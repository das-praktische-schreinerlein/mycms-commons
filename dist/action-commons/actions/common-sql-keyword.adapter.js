"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var js_data_1 = require("js-data");
var generic_validator_util_1 = require("../../search-commons/model/forms/generic-validator.util");
var string_utils_1 = require("../../commons/utils/string.utils");
var sql_utils_1 = require("../../search-commons/services/sql-utils");
var CommonSqlKeywordAdapter = /** @class */ (function () {
    function CommonSqlKeywordAdapter(config, knex, sqlQueryBuilder, keywordModelConfig) {
        this.keywordValidationRule = new generic_validator_util_1.KeywordValidationRule(false);
        this.config = config;
        this.knex = knex;
        this.sqlQueryBuilder = sqlQueryBuilder;
        this.keywordModelConfig = keywordModelConfig;
    }
    CommonSqlKeywordAdapter.prototype.setGenericKeywords = function (joinTableKey, dbId, keywords, opts, deleteOld) {
        if (!js_data_1.utils.isInteger(dbId)) {
            return js_data_1.utils.reject('setGenericKeywords: ' + joinTableKey + ' - id not an integer');
        }
        if (!this.keywordValidationRule.isValid(keywords)) {
            return js_data_1.utils.reject('setGenericKeywords: ' + joinTableKey + ' - keywords not valid');
        }
        if (!this.keywordModelConfig.joins[joinTableKey]) {
            return js_data_1.utils.reject('setGenericKeywords: ' + joinTableKey + ' - table not valid');
        }
        var keywordTable = this.keywordModelConfig.table;
        var keywordNameField = this.keywordModelConfig.fieldName;
        var keywordIdField = this.keywordModelConfig.fieldId;
        var joinTable = this.keywordModelConfig.joins[joinTableKey].joinTable;
        var joinBaseIdField = this.keywordModelConfig.joins[joinTableKey].fieldReference;
        var newKeywords = string_utils_1.StringUtils.uniqueKeywords(keywords).join(',');
        var deleteNotUsedKeywordSqlQuery = deleteOld ? {
            sql: 'DELETE FROM ' + joinTable + ' WHERE ' + joinBaseIdField + ' IN (' + '?' + ')',
            parameters: [dbId]
        } : { sql: 'SELECT 1', parameters: [] };
        var insertNewKeywordsSqlQuery;
        var insertNewKeywordJoinSqlQuery;
        if (this.knex.client['config']['client'] !== 'mysql') {
            var keywordSplitParameter = newKeywords.replace(/[ \\"']/g, '');
            var keywordSplitSql = ' WITH split(word, str, hascomma) AS ( ' +
                '    VALUES("", ' + '?' + ', 1) ' +
                '    UNION ALL SELECT ' +
                '    substr(str, 0, ' +
                '        case when instr(str, ",") ' +
                '        then instr(str, ",") ' +
                '        else length(str)+1 end), ' +
                '    ltrim(substr(str, instr(str, ",")), ","), ' +
                '    instr(str, ",") ' +
                '    FROM split ' +
                '    WHERE hascomma ' +
                '  ) ' +
                '  SELECT trim(word) AS ' + keywordNameField + ' FROM split WHERE word!="" ';
            insertNewKeywordsSqlQuery = {
                sql: 'INSERT INTO ' + keywordTable + ' (' + keywordNameField + ') ' +
                    'SELECT ' + keywordNameField + ' ' +
                    'FROM ( ' +
                    keywordSplitSql +
                    ') AS kw1 ' +
                    'WHERE NOT EXISTS (SELECT 1 ' +
                    '                  FROM ' + keywordTable + ' kw2 ' +
                    '                  WHERE kw2.' + keywordNameField + ' = kw1.' + keywordNameField + '); ',
                parameters: [keywordSplitParameter]
            };
            insertNewKeywordJoinSqlQuery = {
                sql: 'INSERT INTO ' + joinTable + ' (' + joinBaseIdField + ', ' + keywordIdField + ') ' +
                    'SELECT ' + '?' + ' AS ' + joinBaseIdField + ', ' + keywordIdField + ' AS ' + keywordIdField +
                    ' FROM ' + keywordTable + ' kkw1 WHERE ' + keywordNameField + ' IN ( ' +
                    keywordSplitSql +
                    ') AND NOT EXISTS (SELECT 1 ' +
                    '                  FROM ' + joinTable + ' kkw2 ' +
                    '                  WHERE kkw2.' + keywordIdField + ' = kkw1.' + keywordIdField +
                    '                        AND ' + joinBaseIdField + ' = ' + '?' + '); ',
                parameters: [].concat([dbId]).concat([keywordSplitParameter]).concat([dbId])
            };
        }
        else {
            var escapedKeywords = newKeywords.replace(/[ \\"']/g, '').split(',');
            var keywordSplitSql = escapedKeywords.map(function (value) { return 'SELECT ? AS ' + keywordNameField + ' '; }).join(' UNION ALL ');
            var keywordSplitParameter = escapedKeywords.map(function (value) { return value; });
            insertNewKeywordsSqlQuery = {
                sql: 'INSERT INTO ' + keywordTable + ' (' + keywordNameField + ') ' +
                    'SELECT ' + keywordNameField + ' ' +
                    'FROM ( ' +
                    keywordSplitSql +
                    ') AS kw1 ' +
                    'WHERE NOT EXISTS (SELECT 1 ' +
                    '                  FROM ' + keywordTable + ' kw2 ' +
                    '                  WHERE BINARY kw2.' + keywordNameField + ' = BINARY kw1.' + keywordNameField + '); ',
                parameters: [].concat(keywordSplitParameter)
            };
            insertNewKeywordJoinSqlQuery = {
                sql: 'INSERT INTO ' + joinTable + ' (' + joinBaseIdField + ', ' + keywordIdField + ') ' +
                    'SELECT ' + '?' + ' AS ' + joinBaseIdField + ', ' + keywordIdField + ' AS ' + keywordIdField +
                    '  FROM ' + keywordTable + ' kkw1 WHERE ' + keywordNameField + ' IN ( ' + keywordSplitSql + ') AND' +
                    '      NOT EXISTS (SELECT 1 ' + ' FROM ' + joinTable + ' kkw2 ' +
                    '                  WHERE kkw2.' + keywordIdField + ' = kkw1.' + keywordIdField +
                    '                        AND ' + joinBaseIdField + ' = ' + '?' + '); ',
                parameters: [].concat([dbId]).concat(keywordSplitParameter).concat([dbId])
            };
        }
        var sqlBuilder = js_data_1.utils.isUndefined(opts.transaction) ? this.knex : opts.transaction;
        var result = new Promise(function (resolve, reject) {
            sql_utils_1.SqlUtils.executeRawSqlQueryData(sqlBuilder, deleteNotUsedKeywordSqlQuery).then(function () {
                return sql_utils_1.SqlUtils.executeRawSqlQueryData(sqlBuilder, insertNewKeywordsSqlQuery);
            }).then(function (insertResults) {
                return sql_utils_1.SqlUtils.executeRawSqlQueryData(sqlBuilder, insertNewKeywordJoinSqlQuery);
            }).then(function (insertResults) {
                return resolve(true);
            }).catch(function errorPlaylist(reason) {
                return reject(reason);
            });
        });
        return result;
    };
    CommonSqlKeywordAdapter.prototype.unsetGenericKeywords = function (joinTableKey, dbId, keywords, opts) {
        if (!js_data_1.utils.isInteger(dbId)) {
            return js_data_1.utils.reject('setGenericKeywords: ' + joinTableKey + ' - id not an integer');
        }
        if (!this.keywordValidationRule.isValid(keywords)) {
            return js_data_1.utils.reject('setGenericKeywords: ' + joinTableKey + ' - keywords not valid');
        }
        if (!this.keywordModelConfig.joins[joinTableKey]) {
            return js_data_1.utils.reject('setGenericKeywords: ' + joinTableKey + ' - table not valid');
        }
        var keywordTable = this.keywordModelConfig.table;
        var keywordNameField = this.keywordModelConfig.fieldName;
        var keywordIdField = this.keywordModelConfig.fieldId;
        var joinTable = this.keywordModelConfig.joins[joinTableKey].joinTable;
        var joinBaseIdField = this.keywordModelConfig.joins[joinTableKey].fieldReference;
        var newKeywords = string_utils_1.StringUtils.uniqueKeywords(keywords).join(',');
        var deleteNotUsedKeywordSql;
        if (this.knex.client['config']['client'] !== 'mysql') {
            var keywordSplitParameter = newKeywords.replace(/[ \\"']/g, '');
            var keywordSplitSql = ' WITH split(word, str, hascomma) AS ( ' +
                '    VALUES("", "' + '?' + '", 1) ' +
                '    UNION ALL SELECT ' +
                '    substr(str, 0, ' +
                '        case when instr(str, ",") ' +
                '        then instr(str, ",") ' +
                '        else length(str)+1 end), ' +
                '    ltrim(substr(str, instr(str, ",")), ","), ' +
                '    instr(str, ",") ' +
                '    FROM split ' +
                '    WHERE hascomma ' +
                '  ) ' +
                '  SELECT trim(word) AS ' + keywordNameField + ' FROM split WHERE word!="" ';
            deleteNotUsedKeywordSql = {
                sql: 'DELETE FROM ' + joinTable +
                    ' WHERE ' + joinBaseIdField + ' = ' + '?' +
                    '     AND ' + keywordIdField + ' IN ' +
                    '         (SELECT ' + keywordIdField + ' FROM ' + keywordTable + ' kkw1' +
                    '           WHERE ' + keywordNameField + ' IN ( ' + keywordSplitSql + ')); ',
                parameters: [].concat([dbId]).concat(keywordSplitParameter)
            };
        }
        else {
            var escapedKeywords = newKeywords.replace(/[ \\"']/g, '').split(',');
            var keywordSplitSql = escapedKeywords.map(function (value) { return 'SELECT ? AS ' + keywordNameField + ' '; }).join(' UNION ALL ');
            var keywordSplitParameter = escapedKeywords.map(function (value) { return value; });
            deleteNotUsedKeywordSql = {
                sql: 'DELETE FROM ' + joinTable +
                    ' WHERE ' + joinBaseIdField + ' = ' + '?' +
                    '     AND ' + keywordIdField + ' IN ' +
                    '         (SELECT ' + keywordIdField + ' FROM ' + keywordTable + ' kkw1' +
                    '           WHERE ' + keywordNameField + ' IN ( ' + keywordSplitSql + ')); ',
                parameters: [].concat([dbId]).concat(keywordSplitParameter)
            };
        }
        var sqlBuilder = js_data_1.utils.isUndefined(opts.transaction) ? this.knex : opts.transaction;
        var result = new Promise(function (resolve, reject) {
            sql_utils_1.SqlUtils.executeRawSqlQueryData(sqlBuilder, deleteNotUsedKeywordSql).then(function () {
            }).then(function (insertResults) {
                return resolve(true);
            }).catch(function errorPlaylist(reason) {
                return reject(reason);
            });
        });
        return result;
    };
    return CommonSqlKeywordAdapter;
}());
exports.CommonSqlKeywordAdapter = CommonSqlKeywordAdapter;
//# sourceMappingURL=common-sql-keyword.adapter.js.map