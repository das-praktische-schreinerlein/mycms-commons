"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var generic_validator_util_1 = require("../../search-commons/model/forms/generic-validator.util");
var js_data_1 = require("js-data");
var Promise_serial = require("promise-serial");
var sql_utils_1 = require("../../search-commons/services/sql-utils");
var CommonSqlActionTagAssignAdapter = /** @class */ (function () {
    function CommonSqlActionTagAssignAdapter(config, knex, sqlQueryBuilder, assignConfigs) {
        this.keywordValidationRule = new generic_validator_util_1.KeywordValidationRule(true);
        this.idValidator = new generic_validator_util_1.IdValidationRule(true);
        this.config = config;
        this.knex = knex;
        this.sqlQueryBuilder = sqlQueryBuilder;
        this.assignConfigs = assignConfigs;
    }
    CommonSqlActionTagAssignAdapter.prototype.executeActionTagAssign = function (table, id, actionTagForm, opts) {
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
            newId = parseInt(newId, 10);
            if (!js_data_1.utils.isInteger(newId)) {
                return js_data_1.utils.reject('actiontag ' + actionTagForm.key + ' newId must be integer');
            }
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
        var checkNewValueSqlQuery = undefined;
        var updateSqlQueries = [];
        if (newIdSetNull) {
            checkNewValueSqlQuery = {
                sql: 'SELECT null AS id',
                parameters: []
            };
            updateSqlQueries.push({
                sql: 'UPDATE ' + assignConfig.table +
                    ' SET ' + referenceConfig.referenceField + '=null' +
                    ' WHERE ' + assignConfig.idField + '=' + '?' + '',
                parameters: [id]
            });
        }
        else {
            checkNewValueSqlQuery = { sql: 'SELECT ' + referenceConfig.idField + ' AS id' +
                    ' FROM ' + referenceConfig.table +
                    ' WHERE ' + referenceConfig.idField + '=' + '?' + '',
                parameters: [newId] };
            updateSqlQueries.push({ sql: 'UPDATE ' + assignConfig.table +
                    ' SET ' + referenceConfig.referenceField + '=' + '?' + '' +
                    ' WHERE ' + assignConfig.idField + '=' + '?' + '',
                parameters: [newId, id] });
        }
        var sqlBuilder = js_data_1.utils.isUndefined(opts.transaction)
            ? this.knex
            : opts.transaction;
        var result = new Promise(function (resolve, reject) {
            sql_utils_1.SqlUtils.executeRawSqlQueryData(sqlBuilder, checkBaseSqlQuery).then(function (dbresults) {
                var records = _this.sqlQueryBuilder.extractDbResult(dbresults, _this.knex.client['config']['client']);
                if (records === undefined || records.length !== 1 || records[0]['id'] !== id) {
                    return js_data_1.utils.reject('_doActionTag assign ' + table + ' failed: id not found ' + id);
                }
                return sql_utils_1.SqlUtils.executeRawSqlQueryData(sqlBuilder, checkNewValueSqlQuery);
            }).then(function (dbresults) {
                var records = _this.sqlQueryBuilder.extractDbResult(dbresults, _this.knex.client['config']['client']);
                if (records === undefined || records.length !== 1 || records[0]['id'] !== newId) {
                    return js_data_1.utils.reject('_doActionTag assign ' + table + ' failed: newId not found ' + newId);
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
                return resolve(true);
            }).catch(function errorPlaylist(reason) {
                console.error('_doActionTag assign ' + table + ' failed:', reason);
                return reject(reason);
            });
        });
        return result;
    };
    return CommonSqlActionTagAssignAdapter;
}());
exports.CommonSqlActionTagAssignAdapter = CommonSqlActionTagAssignAdapter;
//# sourceMappingURL=common-sql-actiontag-assign.adapter.js.map