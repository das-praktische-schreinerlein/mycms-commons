"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var js_data_1 = require("js-data");
var sql_utils_1 = require("../../search-commons/services/sql-utils");
var generic_validator_util_1 = require("../../search-commons/model/forms/generic-validator.util");
var CommonSqlActionTagBlockAdapter = /** @class */ (function () {
    function CommonSqlActionTagBlockAdapter(config, knex, sqlQueryBuilder, blockConfigs) {
        this.rateValidationRule = new generic_validator_util_1.NumberValidationRule(false, -99, 99, undefined);
        this.config = config;
        this.knex = knex;
        this.sqlQueryBuilder = sqlQueryBuilder;
        this.blockConfigs = blockConfigs;
    }
    CommonSqlActionTagBlockAdapter.prototype.executeActionTagBlock = function (table, id, actionTagForm, opts) {
        var _this = this;
        opts = opts || {};
        if (!js_data_1.utils.isInteger(id)) {
            return js_data_1.utils.reject('actiontag ' + actionTagForm.key + ' id not an integer');
        }
        if (actionTagForm.payload === undefined) {
            return js_data_1.utils.reject('actiontag ' + actionTagForm.key + ' playload expected');
        }
        var value = actionTagForm.payload.set
            ? actionTagForm.payload.value > 0
                ? actionTagForm.payload.value
                : 1
            : 0;
        if (!this.rateValidationRule.isValid(value)) {
            return js_data_1.utils.reject('actiontag ' + actionTagForm.key + ' value not valid');
        }
        var blockConfig = this.blockConfigs.tables[table];
        if (!blockConfig) {
            return js_data_1.utils.reject('actiontag ' + actionTagForm.key + ' table not valid');
        }
        var fieldName = blockConfig.blockField;
        var tableName = blockConfig.table;
        var idName = blockConfig.idField;
        var updateSql = 'UPDATE ' + tableName + ' SET ' + fieldName + '=' + '?' +
            '  WHERE ' + idName + ' = ' + '?' + '';
        updateSql = this.sqlQueryBuilder.transformToSqlDialect(updateSql, this.config.knexOpts.client);
        var updateSqlQuery = {
            sql: updateSql,
            parameters: [value, id]
        };
        var sqlBuilder = js_data_1.utils.isUndefined(opts.transaction)
            ? this.knex
            : opts.transaction;
        var rawUpdate = sql_utils_1.SqlUtils.executeRawSqlQueryData(sqlBuilder, updateSqlQuery);
        var result = new Promise(function (resolve, reject) {
            rawUpdate.then(function () {
                var updateSqlQuery = _this.sqlQueryBuilder.updateChangelogSqlQuery('update', blockConfig.table, blockConfig.idField, blockConfig.changelogConfig, id);
                if (updateSqlQuery) {
                    return sql_utils_1.SqlUtils.executeRawSqlQueryData(sqlBuilder, updateSqlQuery);
                }
                return Promise.resolve(true);
            }).then(function () {
                return resolve(true);
            }).catch(function errorBlock(reason) {
                console.error('_doActionTag update ' + tableName + ' blocked failed:', reason);
                return reject(reason);
            });
        });
        return result;
    };
    return CommonSqlActionTagBlockAdapter;
}());
exports.CommonSqlActionTagBlockAdapter = CommonSqlActionTagBlockAdapter;
//# sourceMappingURL=common-sql-actiontag-block.adapter.js.map