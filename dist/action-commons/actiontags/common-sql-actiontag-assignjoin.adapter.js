"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var js_data_1 = require("js-data");
var generic_validator_util_1 = require("../../search-commons/model/forms/generic-validator.util");
var sql_utils_1 = require("../../search-commons/services/sql-utils");
var CommonSqlActionTagAssignJoinAdapter = /** @class */ (function () {
    function CommonSqlActionTagAssignJoinAdapter(config, knex, sqlQueryBuilder, assignConfigs) {
        this.keywordValidationRule = new generic_validator_util_1.KeywordValidationRule(true);
        this.idValidator = new generic_validator_util_1.IdValidationRule(true);
        this.config = config;
        this.knex = knex;
        this.sqlQueryBuilder = sqlQueryBuilder;
        this.assignConfigs = assignConfigs;
    }
    CommonSqlActionTagAssignJoinAdapter.prototype.executeActionTagAssignJoin = function (table, id, actionTagForm, opts) {
        var _this = this;
        opts = opts || {};
        if (!js_data_1.utils.isInteger(id)) {
            return js_data_1.utils.reject('actiontag ' + actionTagForm.key + ' id not an integer');
        }
        if (actionTagForm.payload === undefined) {
            return js_data_1.utils.reject('actiontag ' + actionTagForm.key + ' playload expected');
        }
        var referenceField = actionTagForm.payload.referenceField;
        if (!this.keywordValidationRule.isValid(referenceField)) {
            return js_data_1.utils.reject('actiontag ' + actionTagForm.key + ' referenceField not valid');
        }
        var newId = actionTagForm.payload.newId;
        if (!this.idValidator.isValid(newId)) {
            return js_data_1.utils.reject('actiontag ' + actionTagForm.key + ' newId not valid');
        }
        newId = parseInt(newId, 10);
        if (!js_data_1.utils.isInteger(newId)) {
            return js_data_1.utils.reject('actiontag ' + actionTagForm.key + ' newId must be integer');
        }
        var assignConfig = this.assignConfigs.tables[table];
        if (!assignConfig) {
            return js_data_1.utils.reject('actiontag ' + actionTagForm.key + ' table not valid');
        }
        var referenceConfig = assignConfig.references[referenceField];
        if (!referenceConfig) {
            return js_data_1.utils.reject('actiontag ' + actionTagForm.key + ' referenceField not exists');
        }
        var checkBaseSqlQuery = {
            sql: 'SELECT ' + assignConfig.idField + ' AS id' +
                ' FROM ' + assignConfig.table +
                ' WHERE ' + assignConfig.idField + '=' + '?' + '',
            parameters: [id]
        };
        var checkNewValueSqlQuery = { sql: 'SELECT ' + referenceConfig.joinedIdField + ' AS id' +
                ' FROM ' + referenceConfig.joinedTable +
                ' WHERE ' + referenceConfig.joinedIdField + '=' + '?' + '',
            parameters: [newId] };
        var insertSqlQuery = { sql: 'INSERT INTO ' + referenceConfig.joinTable +
                ' (' + referenceConfig.joinBaseIdField + ', ' + referenceConfig.joinReferenceField + ')' +
                ' SELECT ?, ? WHERE NOT EXISTS' +
                '    (SELECT ' + referenceConfig.joinBaseIdField + ', ' + referenceConfig.joinReferenceField +
                '     FROM ' + referenceConfig.joinTable +
                '     WHERE ' + referenceConfig.joinBaseIdField + '=? AND ' + referenceConfig.joinReferenceField + '=?)',
            parameters: [id, newId, id, newId] };
        var sqlBuilder = js_data_1.utils.isUndefined(opts.transaction)
            ? this.knex
            : opts.transaction;
        var result = new Promise(function (resolve, reject) {
            sql_utils_1.SqlUtils.executeRawSqlQueryData(sqlBuilder, checkBaseSqlQuery).then(function (dbresults) {
                var records = _this.sqlQueryBuilder.extractDbResult(dbresults, _this.knex.client['config']['client']);
                if (records === undefined || records.length !== 1 || records[0]['id'] !== id) {
                    return js_data_1.utils.reject('_doActionTag assignjoin ' + table + ' failed: id not found ' + id);
                }
                return sql_utils_1.SqlUtils.executeRawSqlQueryData(sqlBuilder, checkNewValueSqlQuery);
            }).then(function (dbresults) {
                var records = _this.sqlQueryBuilder.extractDbResult(dbresults, _this.knex.client['config']['client']);
                if (records === undefined || records.length !== 1 || records[0]['id'] !== newId) {
                    return js_data_1.utils.reject('_doActionTag assignjoin ' + table + ' failed: newId not found ' + newId);
                }
                return sql_utils_1.SqlUtils.executeRawSqlQueryData(sqlBuilder, insertSqlQuery);
            }).then(function () {
                var updateSqlQuery = _this.sqlQueryBuilder.updateChangelogSqlQuery('update', assignConfig.table, assignConfig.idField, assignConfig.changelogConfig, id);
                if (updateSqlQuery) {
                    return sql_utils_1.SqlUtils.executeRawSqlQueryData(sqlBuilder, updateSqlQuery);
                }
                return Promise.resolve(true);
            }).then(function () {
                var updateSqlQuery = _this.sqlQueryBuilder.updateChangelogSqlQuery('update', referenceConfig.joinedTable, referenceConfig.joinedIdField, referenceConfig.changelogConfig, newId);
                if (updateSqlQuery) {
                    return sql_utils_1.SqlUtils.executeRawSqlQueryData(sqlBuilder, updateSqlQuery);
                }
                return Promise.resolve(true);
            }).then(function () {
                return resolve(true);
            }).catch(function errorPlaylist(reason) {
                console.error('_doActionTag assignjoin ' + table + ' failed:', reason);
                return reject(reason);
            });
        });
        return result;
    };
    return CommonSqlActionTagAssignJoinAdapter;
}());
exports.CommonSqlActionTagAssignJoinAdapter = CommonSqlActionTagAssignJoinAdapter;
//# sourceMappingURL=common-sql-actiontag-assignjoin.adapter.js.map