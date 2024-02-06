"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var generic_validator_util_1 = require("../../search-commons/model/forms/generic-validator.util");
var js_data_1 = require("js-data");
var Promise_serial = require("promise-serial");
var sql_utils_1 = require("../../search-commons/services/sql-utils");
var date_utils_1 = require("../../commons/utils/date.utils");
var CommonSqlActionTagReplaceAdapter = /** @class */ (function () {
    function CommonSqlActionTagReplaceAdapter(config, knex, sqlQueryBuilder, replaceConfigs) {
        this.idValidator = new generic_validator_util_1.IdValidationRule(true);
        this.config = config;
        this.knex = knex;
        this.sqlQueryBuilder = sqlQueryBuilder;
        this.replaceConfigs = replaceConfigs;
    }
    CommonSqlActionTagReplaceAdapter.prototype.executeActionTagReplace = function (table, id, actionTagForm, opts) {
        var _this = this;
        opts = opts || {};
        if (!js_data_1.utils.isInteger(id)) {
            return js_data_1.utils.reject('actiontag ' + actionTagForm.key + ' id not an integer');
        }
        if (actionTagForm.payload === undefined) {
            return js_data_1.utils.reject('actiontag ' + actionTagForm.key + ' playload expected');
        }
        var newId = actionTagForm.payload.newId;
        var newIdSetNull = actionTagForm.payload.newIdSetNull;
        if (newIdSetNull) {
            if (newId !== null && newId !== 'null') {
                return js_data_1.utils.reject('actiontag ' + actionTagForm.key + ' newId must be null if newIdSetNull');
            }
        }
        else {
            if (!this.idValidator.isValid(newId)) {
                return js_data_1.utils.reject('actiontag ' + actionTagForm.key + ' newId not valid');
            }
            if ((id + '') === (newId + '')) {
                return js_data_1.utils.reject('actiontag ' + actionTagForm.key + ' newId must not equal id');
            }
            newId = parseInt(newId, 10);
            if (!js_data_1.utils.isInteger(newId)) {
                return js_data_1.utils.reject('actiontag ' + actionTagForm.key + ' newId must be integer');
            }
        }
        var replaceConfig = this.replaceConfigs.tables[table];
        if (!replaceConfig) {
            return js_data_1.utils.reject('actiontag ' + actionTagForm.key + ' table not valid');
        }
        var referenceConfigs = replaceConfig.referenced;
        if (!referenceConfigs) {
            return js_data_1.utils.reject('actiontag ' + actionTagForm.key + ' table.referenced not valid');
        }
        var joinConfigs = replaceConfig.joins;
        if (!joinConfigs) {
            return js_data_1.utils.reject('actiontag ' + actionTagForm.key + ' table.joins not valid');
        }
        var checkBaseSqlQuery = {
            sql: 'SELECT ' + replaceConfig.fieldId + ' AS id' +
                ' FROM ' + replaceConfig.table +
                ' WHERE ' + replaceConfig.fieldId + '=' + '?' + '',
            parameters: [id]
        };
        var checkNewValueSqlQuery = undefined;
        var updateSqlQueries = [];
        for (var _i = 0, referenceConfigs_1 = referenceConfigs; _i < referenceConfigs_1.length; _i++) {
            var referenceConfig = referenceConfigs_1[_i];
            var changelogDataConfig = referenceConfig.changelogConfig;
            if (changelogDataConfig && (changelogDataConfig.updateDateField !== undefined || changelogDataConfig.updateVersionField !== undefined)) {
                var updateFields = [];
                var parameters = [];
                if (changelogDataConfig.updateDateField !== undefined) {
                    updateFields.push(changelogDataConfig.updateDateField + '=?');
                    parameters.push(date_utils_1.DateUtils.dateToLocalISOString(new Date()));
                }
                if (changelogDataConfig.updateVersionField !== undefined) {
                    updateFields.push(changelogDataConfig.updateVersionField +
                        '=COALESCE(' + changelogDataConfig.updateVersionField + ', 0)+1');
                }
                parameters.push(id);
                updateSqlQueries.push({
                    sql: 'UPDATE ' + referenceConfig.table + ' ' +
                        'SET ' +
                        updateFields.join(', ') + ' ' +
                        'WHERE ' + referenceConfig.fieldReference + '=?',
                    parameters: parameters
                });
            }
        }
        if (newIdSetNull) {
            checkNewValueSqlQuery = {
                sql: 'SELECT null AS id',
                parameters: []
            };
            for (var _a = 0, referenceConfigs_2 = referenceConfigs; _a < referenceConfigs_2.length; _a++) {
                var referenceConfig = referenceConfigs_2[_a];
                updateSqlQueries.push({
                    sql: 'UPDATE ' + referenceConfig.table +
                        ' SET ' + referenceConfig.fieldReference + '=null' +
                        ' WHERE ' + referenceConfig.fieldReference + '=' + '?' + '',
                    parameters: [id]
                });
            }
            for (var _b = 0, joinConfigs_1 = joinConfigs; _b < joinConfigs_1.length; _b++) {
                var joinConfig = joinConfigs_1[_b];
                updateSqlQueries.push({
                    sql: 'DELETE FROM ' + joinConfig.table +
                        ' WHERE ' + joinConfig.fieldReference + '=' + '?' + '',
                    parameters: [id]
                });
            }
        }
        else {
            checkNewValueSqlQuery = {
                sql: 'SELECT ' + replaceConfig.fieldId + ' AS id' +
                    ' FROM ' + replaceConfig.table +
                    ' WHERE ' + replaceConfig.fieldId + '=' + '?' + '',
                parameters: [newId]
            };
            for (var _c = 0, referenceConfigs_3 = referenceConfigs; _c < referenceConfigs_3.length; _c++) {
                var referenceConfig = referenceConfigs_3[_c];
                updateSqlQueries.push({
                    sql: 'UPDATE ' + referenceConfig.table +
                        ' SET ' + referenceConfig.fieldReference + '=' + '?' + '' +
                        ' WHERE ' + referenceConfig.fieldReference + '=' + '?' + '',
                    parameters: [newId, id]
                });
            }
            for (var _d = 0, joinConfigs_2 = joinConfigs; _d < joinConfigs_2.length; _d++) {
                var joinConfig = joinConfigs_2[_d];
                updateSqlQueries.push({
                    sql: 'UPDATE ' + joinConfig.table +
                        ' SET ' + joinConfig.fieldReference + '=' + '?' + '' +
                        ' WHERE ' + joinConfig.fieldReference + '=' + '?' + '',
                    parameters: [newId, id]
                });
            }
            if (replaceConfig.changelogConfig && replaceConfig.changelogConfig.updateDateField !== undefined) {
                var updateSqlQuery = this.sqlQueryBuilder.updateChangelogSqlQuery('update', replaceConfig.table, replaceConfig.fieldId, replaceConfig.changelogConfig, newId);
                if (updateSqlQuery) {
                    updateSqlQueries.push(updateSqlQuery);
                }
            }
        }
        var deleteSqlQuery = {
            sql: 'DELETE FROM ' + replaceConfig.table +
                ' WHERE ' + replaceConfig.fieldId + '=' + '?' + '',
            parameters: [id]
        };
        var sqlBuilder = js_data_1.utils.isUndefined(opts.transaction)
            ? this.knex
            : opts.transaction;
        var result = new Promise(function (resolve, reject) {
            sql_utils_1.SqlUtils.executeRawSqlQueryData(sqlBuilder, checkBaseSqlQuery).then(function (dbresults) {
                var records = _this.sqlQueryBuilder.extractDbResult(dbresults, _this.knex.client['config']['client']);
                if (records === undefined || records.length !== 1 || records[0]['id'] !== id) {
                    return js_data_1.utils.reject('_doActionTag replace ' + table + ' failed: id not found ' + id);
                }
                return sql_utils_1.SqlUtils.executeRawSqlQueryData(sqlBuilder, checkNewValueSqlQuery);
            }).then(function (dbresults) {
                var records = _this.sqlQueryBuilder.extractDbResult(dbresults, _this.knex.client['config']['client']);
                if (records === undefined || records.length !== 1 || records[0]['id'] !== newId) {
                    return js_data_1.utils.reject('_doActionTag replace ' + table + ' failed: newId not found ' + newId);
                }
                var updateSqlQueryPromises = [];
                var _loop_1 = function (updateSql) {
                    updateSqlQueryPromises.push(function () {
                        return sql_utils_1.SqlUtils.executeRawSqlQueryData(sqlBuilder, updateSql);
                    });
                };
                for (var _i = 0, updateSqlQueries_1 = updateSqlQueries; _i < updateSqlQueries_1.length; _i++) {
                    var updateSql = updateSqlQueries_1[_i];
                    _loop_1(updateSql);
                }
                return Promise_serial(updateSqlQueryPromises, { parallelize: 1 });
            }).then(function () {
                return sql_utils_1.SqlUtils.executeRawSqlQueryData(sqlBuilder, deleteSqlQuery);
            }).then(function () {
                return resolve(true);
            }).catch(function errorPlaylist(reason) {
                console.error('_doActionTag replace ' + table + ' failed:', reason);
                return reject(reason);
            });
        });
        return result;
    };
    return CommonSqlActionTagReplaceAdapter;
}());
exports.CommonSqlActionTagReplaceAdapter = CommonSqlActionTagReplaceAdapter;
//# sourceMappingURL=common-sql-actiontag-replace.adapter.js.map