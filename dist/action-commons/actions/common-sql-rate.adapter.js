"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var js_data_1 = require("js-data");
var generic_validator_util_1 = require("../../search-commons/model/forms/generic-validator.util");
var sql_utils_1 = require("../../search-commons/services/sql-utils");
var CommonSqlRateAdapter = /** @class */ (function () {
    function CommonSqlRateAdapter(config, knex, sqlQueryBuilder, rateModelConfig) {
        this.rateValidationRule = new generic_validator_util_1.NumberValidationRule(true, -1, 15, 0);
        this.config = config;
        this.knex = knex;
        this.sqlQueryBuilder = sqlQueryBuilder;
        this.rateModelConfig = rateModelConfig;
    }
    CommonSqlRateAdapter.prototype.setRates = function (rateTableKey, dbId, rates, checkGreatestHimself, opts) {
        if (!js_data_1.utils.isInteger(dbId)) {
            return js_data_1.utils.reject('setRates ' + rateTableKey + ' id not an integer');
        }
        if (!this.rateModelConfig.tables[rateTableKey]) {
            return js_data_1.utils.reject('setRates: ' + rateTableKey + ' - table not valid');
        }
        var rateConfig = this.rateModelConfig.tables[rateTableKey];
        var rateUpdateSqls = [];
        var rateUpdateSqlParams = [];
        for (var rateKey in rates) {
            if (!rates.hasOwnProperty(rateKey)) {
                continue;
            }
            var rate = rates[rateKey];
            if (!this.rateValidationRule.isValid(rate)) {
                return js_data_1.utils.reject('setRates ' + rateTableKey + ' rate not valid');
            }
            if (!rateConfig.rateFields[rateKey]) {
                return js_data_1.utils.reject('setRates: ' + rateTableKey + ' - rateKey not valid');
            }
            var base = checkGreatestHimself ? rateConfig.rateFields[rateKey] : '-1';
            rateUpdateSqls.push(rateConfig.rateFields[rateKey] + '=GREATEST(COALESCE(' + base + ', -1), ?)');
            rateUpdateSqlParams.push(+rate);
        }
        if (rateConfig.fieldSum !== undefined) {
            var greatesSqls = [];
            for (var rateFieldKey in rateConfig.rateFields) {
                if (!rateConfig.rateFields.hasOwnProperty(rateFieldKey)) {
                    continue;
                }
                greatesSqls.push('COALESCE(' + rateConfig.rateFields[rateFieldKey] + ', -1)');
            }
            if (checkGreatestHimself) {
                greatesSqls.push('COALESCE(' + rateConfig.fieldSum + ', -1)');
            }
            rateUpdateSqls.push(rateConfig.fieldSum + '=GREATEST(' + greatesSqls.join(', ') + ')');
        }
        var updateSql = 'UPDATE ' + rateConfig.table + ' SET ' + rateUpdateSqls.join(', ') +
            '  WHERE ' + rateConfig.fieldId + ' = ' + '?' + '';
        updateSql = this.sqlQueryBuilder.transformToSqlDialect(updateSql, this.config.knexOpts.client);
        var updateSqlQuery = {
            sql: updateSql,
            parameters: [].concat(rateUpdateSqlParams).concat(dbId)
        };
        var sqlBuilder = js_data_1.utils.isUndefined(opts.transaction)
            ? this.knex
            : opts.transaction;
        var rawUpdate = sql_utils_1.SqlUtils.executeRawSqlQueryData(sqlBuilder, updateSqlQuery);
        var result = new Promise(function (resolve, reject) {
            rawUpdate.then(function () {
                return resolve(true);
            }).catch(function errorPlaylist(reason) {
                console.error('_doActionTag update ' + rateConfig.table + ' rate failed:', reason);
                return reject(reason);
            });
        });
        return result;
    };
    return CommonSqlRateAdapter;
}());
exports.CommonSqlRateAdapter = CommonSqlRateAdapter;
//# sourceMappingURL=common-sql-rate.adapter.js.map