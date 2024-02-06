"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var js_data_1 = require("js-data");
var sql_utils_1 = require("../../search-commons/services/sql-utils");
var Promise_serial = require("promise-serial");
var CommonSqlJoinAdapter = /** @class */ (function () {
    function CommonSqlJoinAdapter(config, knex, sqlQueryBuilder, joinModelConfig) {
        this.config = config;
        this.knex = knex;
        this.sqlQueryBuilder = sqlQueryBuilder;
        this.joinModelConfig = joinModelConfig;
    }
    CommonSqlJoinAdapter.prototype.saveJoins = function (joinKey, baseTableKey, dbId, joinRecords, opts) {
        if (!js_data_1.utils.isInteger(dbId)) {
            return js_data_1.utils.reject('saveJoins ' + baseTableKey + ' id not an integer');
        }
        if (!this.joinModelConfig[joinKey]) {
            return js_data_1.utils.reject('saveJoins: ' + joinKey + ' -> ' + baseTableKey + ' - join not valid');
        }
        var joinConfig = this.joinModelConfig[joinKey];
        if (!joinConfig.tables[baseTableKey]) {
            return js_data_1.utils.reject('saveJoins: ' + joinKey + ' -> ' + baseTableKey + ' - table not valid');
        }
        var joinedTableConfig = joinConfig.tables[baseTableKey];
        var baseTableIdField = joinedTableConfig.baseTableIdField;
        var joinTable = joinedTableConfig.joinTable;
        var joinFields = joinedTableConfig.joinFieldMappings;
        var deleteSqlQuery = {
            sql: 'DELETE FROM ' + joinTable + ' ' +
                'WHERE ' + baseTableIdField + ' = ' + '?' + '',
            parameters: [].concat([dbId])
        };
        var promises = [];
        var sqlBuilder = js_data_1.utils.isUndefined(opts.transaction)
            ? this.knex
            : opts.transaction;
        var _loop_1 = function (joinRecord) {
            var fields = [baseTableIdField];
            var values = [dbId];
            for (var destField in joinFields) {
                fields.push(destField);
                var value = joinRecord[joinFields[destField]];
                values.push(value === undefined || value === null || value === 'undefined' || value === 'null' ? null : value);
            }
            var insertSqlQuery = {
                sql: 'INSERT INTO ' + joinTable + ' (' + fields.join(', ') + ') ' +
                    'VALUES(' + sql_utils_1.SqlUtils.mapParametersToPlaceholderString(values) + ')',
                parameters: [].concat(values)
            };
            promises.push(function () {
                return sql_utils_1.SqlUtils.executeRawSqlQueryData(sqlBuilder, insertSqlQuery);
            });
        };
        for (var _i = 0, joinRecords_1 = joinRecords; _i < joinRecords_1.length; _i++) {
            var joinRecord = joinRecords_1[_i];
            _loop_1(joinRecord);
        }
        if (joinedTableConfig.changelogConfig) {
            var updateSqlQuery_1 = this.sqlQueryBuilder.updateChangelogSqlQuery('update', baseTableKey, baseTableIdField, joinedTableConfig.changelogConfig, dbId);
            promises.push(function () {
                return sql_utils_1.SqlUtils.executeRawSqlQueryData(sqlBuilder, updateSqlQuery_1);
            });
        }
        var result = new Promise(function (resolve, reject) {
            sql_utils_1.SqlUtils.executeRawSqlQueryData(sqlBuilder, deleteSqlQuery).then(function () {
                return Promise_serial(promises, { parallelize: 1 }).then(function () {
                    return resolve(true);
                }).catch(function errorJoinDetails(reason) {
                    console.error('_doJoin delete/insert ' + joinTable + ' failed:', reason);
                    return reject(reason);
                });
            }).then(function () {
                return resolve(true);
            }).catch(function errorJoin(reason) {
                console.error('_doJoin delete/insert ' + joinTable + ' failed:', reason);
                return reject(reason);
            });
        });
        return result;
    };
    return CommonSqlJoinAdapter;
}());
exports.CommonSqlJoinAdapter = CommonSqlJoinAdapter;
//# sourceMappingURL=common-sql-join.adapter.js.map