"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var Promise_serial = require("promise-serial");
var js_data_1 = require("js-data");
var sql_utils_1 = require("../../search-commons/services/sql-utils");
var DatabaseService = /** @class */ (function () {
    function DatabaseService(knex, sqlQueryBuilder) {
        this.sqlQueryBuilder = sqlQueryBuilder;
        this.knex = knex;
    }
    DatabaseService.extractSqlFileOnScriptPath = function (sqlFile, splitter) {
        return fs.readFileSync(sqlFile, { encoding: 'utf8' }).split(splitter);
    };
    DatabaseService.prototype.executeSqls = function (sqls) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var promises = [];
            var me = _this;
            var sqlBuilder = _this.knex;
            var _loop_1 = function (sql) {
                promises.push(function () {
                    if (sql === undefined || sql.trim() === '' || sql.startsWith('DELIMITER ') || sql.includes('\nDELIMITER ')) {
                        return js_data_1.utils.resolve(true);
                    }
                    return sqlBuilder.raw(me.transformToSqlDialect(sql)).catch(function (reason) {
                        if (reason.errno === 21) {
                            console.error('skip misue', reason, sql);
                            return Promise.resolve();
                        }
                        return Promise.reject(reason);
                    });
                });
            };
            for (var _i = 0, sqls_1 = sqls; _i < sqls_1.length; _i++) {
                var sql = sqls_1[_i];
                _loop_1(sql);
            }
            Promise_serial(promises, { parallelize: 1 }).then(function () {
                return resolve(true);
            }).catch(function (reason) {
                return reject(reason);
            });
        });
    };
    DatabaseService.prototype.transformToSqlDialect = function (sql) {
        var client = this.knex.client['config']['client'];
        if (client === 'sqlite3') {
            sql = sql_utils_1.SqlUtils.transformToSqliteDialect(sql);
        }
        return this.sqlQueryBuilder.transformToSqlDialect(sql, client);
    };
    return DatabaseService;
}());
exports.DatabaseService = DatabaseService;
//# sourceMappingURL=database.service.js.map