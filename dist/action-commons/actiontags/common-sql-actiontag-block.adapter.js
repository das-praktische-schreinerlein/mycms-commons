"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var js_data_1 = require("js-data");
var sql_utils_1 = require("../../search-commons/services/sql-utils");
var CommonSqlActionTagBlockAdapter = /** @class */ (function () {
    function CommonSqlActionTagBlockAdapter(config, knex, sqlQueryBuilder, blockConfigs) {
        this.config = config;
        this.knex = knex;
        this.sqlQueryBuilder = sqlQueryBuilder;
        this.blockConfigs = blockConfigs;
    }
    CommonSqlActionTagBlockAdapter.prototype.executeActionTagBlock = function (table, id, actionTagForm, opts) {
        opts = opts || {};
        if (!js_data_1.utils.isInteger(id)) {
            return js_data_1.utils.reject('actiontag ' + actionTagForm.key + ' id not an integer');
        }
        if (actionTagForm.payload === undefined) {
            return js_data_1.utils.reject('actiontag ' + actionTagForm.key + ' playload expected');
        }
        var value = actionTagForm.payload.set ? 1 : 0;
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
                return resolve(true);
            }).catch(function errorPlaylist(reason) {
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