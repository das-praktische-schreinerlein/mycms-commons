"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var sql_query_builder_1 = require("../../search-commons/services/sql-query.builder");
var Promise_serial = require("promise-serial");
var js_data_1 = require("js-data");
var sql_utils_1 = require("../../search-commons/services/sql-utils");
var FacetCacheService = /** @class */ (function () {
    function FacetCacheService(configuration, knex, adapter) {
        this.sqlQueryBuilder = new sql_query_builder_1.SqlQueryBuilder();
        this.configuration = configuration;
        this.knex = knex;
        this.adapter = adapter;
    }
    FacetCacheService.prototype.createDatabaseRequirements = function () {
        var _this = this;
        return this.createFacetCacheTables().then(function () {
            return _this.createFacetCacheTriggerFunctions();
        }).then(function () {
            return _this.createFacetCacheUpdateCheckFunctions();
        });
    };
    FacetCacheService.prototype.showCreateDatabaseRequirements = function () {
        return this.adapter.generateCreateFacetCacheTables()
            .concat(this.adapter.generateCreateFacetCacheTriggerFunctions())
            .concat(this.adapter.generateCreateFacetCacheUpdateCheckFunctions());
    };
    FacetCacheService.prototype.dropDatabaseRequirements = function () {
        var _this = this;
        return this.dropFacetCacheUpdateCheckFunctions().then(function () {
            return _this.dropFacetCacheTriggerFunctions();
        }).then(function () {
            return _this.dropFacetCacheTables();
        });
    };
    FacetCacheService.prototype.showDropDatabaseRequirements = function () {
        return this.adapter.generateDropFacetCacheUpdateCheckFunctions()
            .concat(this.adapter.generateDropFacetCacheTriggerFunctions())
            .concat(this.adapter.generateDropFacetCacheTables());
    };
    FacetCacheService.prototype.createAndStartDatabaseManagedFacets = function () {
        var _this = this;
        if (!this.adapter.supportsDatabaseManagedUpdate) {
            throw new Error('adapter doesnt support database-managed-facetcache');
        }
        if (this.configuration.facets.length <= 0) {
            console.error('dont start facetcache: no facets defined');
            return js_data_1.utils.resolve(false);
        }
        return this.createFacetsViews().then(function () {
            return _this.createFacetsCacheConfigs();
        }).then(function () {
            return _this.createFacetsTriggers();
        }).then(function () {
            return _this.createFacetsUpdateSchedules();
        });
    };
    FacetCacheService.prototype.showCreateAndStartDatabaseManagedFacets = function () {
        if (!this.adapter.supportsDatabaseManagedUpdate) {
            throw new Error('adapter doesnt support database-managed-facetcache');
        }
        return this.generateCreateFacetViewsSql(this.configuration.facets)
            .concat(this.generateCreateFacetCacheConfigsSql(this.configuration.facets))
            .concat(this.generateCreateFacetTriggerSql())
            .concat(this.generateCreateUpdateSchedulesFacetsCacheSql(this.configuration.facets));
    };
    FacetCacheService.prototype.stopAndDropDatabaseManagedFacets = function () {
        var _this = this;
        if (!this.adapter.supportsDatabaseManagedUpdate) {
            throw new Error('adapter doesnt support database-managed-facetcache');
        }
        return this.dropFacetsUpdateSchedules().then(function () {
            return _this.dropFacetsTriggers();
        }).then(function () {
            return _this.removeFacetsCacheConfigs();
        }).then(function () {
            return _this.dropFacetsViews();
        });
    };
    FacetCacheService.prototype.showStopAndDropDatabaseManagedFacets = function () {
        if (!this.adapter.supportsDatabaseManagedUpdate) {
            throw new Error('adapter doesnt support database-managed-facetcache');
        }
        return this.generateDropUpdateSchedulesFacetsCacheSql(this.configuration.facets)
            .concat(this.generateDropFacetTriggerSql())
            .concat(this.generateRemoveFacetCacheConfigsSql(this.configuration.facets))
            .concat(this.generateDropFacetViewsSql(this.configuration.facets));
    };
    FacetCacheService.prototype.createAndStartServerManagedFacets = function () {
        var _this = this;
        if (this.configuration.facets.length <= 0) {
            console.error('dont start facetcache: no facets defined');
            return js_data_1.utils.resolve(false);
        }
        return this.createFacetsViews().then(function () {
            return _this.createFacetsCacheConfigs();
        }).then(function () {
            return _this.createFacetsTriggers();
        }).then(function () {
            return _this.startServerManagedFacets();
        });
    };
    FacetCacheService.prototype.startServerManagedFacets = function () {
        if (this.configuration.facets.length <= 0) {
            console.error('dont start facetcache: no facets defined');
            return js_data_1.utils.resolve(false);
        }
        var me = this;
        var facets = {};
        for (var _i = 0, _a = me.configuration.facets; _i < _a.length; _i++) {
            var facet = _a[_i];
            facets[facet.longKey] = facet;
        }
        return new Promise(function (resolve, reject) {
            var callback = function () {
                var sqlBuilder = me.knex;
                var sql = me.adapter.generateSelectFacetCacheUpdateTriggerSql();
                var raw = sqlBuilder.raw(sql);
                raw.then(function doneSearch(dbresults) {
                    var response = me.sqlQueryBuilder.extractDbResult(dbresults, me.knex.client['config']['client']);
                    if (response.length < 1) {
                        console.error('no facetupdatetrigger found', new Date());
                        return js_data_1.utils.resolve(true);
                    }
                    var sqls = [];
                    for (var _i = 0, response_1 = response; _i < response_1.length; _i++) {
                        var record = response_1[_i];
                        var triggerName = record['ft_key'];
                        var facet = facets[triggerName];
                        if (!facet) {
                            console.error('unknown facetupdatetrigger found: ' + triggerName, new Date());
                            continue;
                        }
                        console.error('facetupdatetrigger found: ' + triggerName, new Date());
                        sqls = sqls.concat(me.generateDeleteAndUpdateFacetCacheSql(facet));
                    }
                    console.error('DO update facets:', sqls);
                    return me.executeSqls(sqls);
                }).then(function doneSearch() {
                    console.error('DONE update facets:', new Date());
                    setTimeout(callback, me.configuration.checkInterval * 60 * 1000);
                    return js_data_1.utils.resolve(true);
                }).catch(function errorSearch(reason) {
                    console.error('updateFacets failed:', reason);
                    return reject(reason);
                });
            };
            callback();
        });
    };
    FacetCacheService.prototype.showCreateServerManagedFacets = function () {
        return this.generateCreateFacetViewsSql(this.configuration.facets)
            .concat(this.generateCreateFacetCacheConfigsSql(this.configuration.facets))
            .concat(this.generateCreateFacetTriggerSql());
    };
    FacetCacheService.prototype.dropServerManagedFacets = function () {
        var _this = this;
        return this.dropFacetsTriggers().then(function () {
            return _this.removeFacetsCacheConfigs();
        }).then(function () {
            return _this.dropFacetsViews();
        });
    };
    FacetCacheService.prototype.showDropServerManagedFacets = function () {
        return this.generateDropFacetTriggerSql()
            .concat(this.generateRemoveFacetCacheConfigsSql(this.configuration.facets))
            .concat(this.generateDropFacetViewsSql(this.configuration.facets));
    };
    FacetCacheService.prototype.dropFacetCacheTables = function () {
        return this.executeSqls(this.adapter.generateDropFacetCacheTables());
    };
    FacetCacheService.prototype.createFacetCacheTables = function () {
        return this.executeSqls(this.adapter.generateCreateFacetCacheTables());
    };
    FacetCacheService.prototype.createFacetCacheTriggerFunctions = function () {
        return this.executeSqls(this.adapter.generateCreateFacetCacheTriggerFunctions());
    };
    FacetCacheService.prototype.dropFacetCacheTriggerFunctions = function () {
        return this.executeSqls(this.adapter.generateDropFacetCacheTriggerFunctions());
    };
    FacetCacheService.prototype.createFacetCacheUpdateCheckFunctions = function () {
        return this.executeSqls(this.adapter.generateCreateFacetCacheUpdateCheckFunctions());
    };
    FacetCacheService.prototype.dropFacetCacheUpdateCheckFunctions = function () {
        return this.executeSqls(this.adapter.generateDropFacetCacheUpdateCheckFunctions());
    };
    FacetCacheService.prototype.dropFacetsTriggers = function () {
        return this.executeSqls(this.generateDropFacetTriggerSql());
    };
    FacetCacheService.prototype.createFacetsTriggers = function () {
        return this.executeSqls(this.generateCreateFacetTriggerSql());
    };
    FacetCacheService.prototype.removeFacetsCacheConfigs = function () {
        var sqlBuilder = this.knex;
        var sql = this.transformToSqlDialect(this.adapter.generateSelectTrueIfTableFacetCacheConfigExistsSql());
        var me = this;
        return sqlBuilder.raw(sql).then(function (dbresult) {
            var response = me.sqlQueryBuilder.extractDbResult(dbresult, me.knex.client['config']['client']);
            if (response.length < 1) {
                console.error('facetcacheconfig not exists', new Date());
                return js_data_1.utils.resolve(true);
            }
            return new Promise(function (resolve, reject) {
                var promises = [];
                var _loop_1 = function (configuration) {
                    promises.push(function () {
                        return me.removeFacetCacheConfig(configuration);
                    });
                };
                for (var _i = 0, _a = me.configuration.facets; _i < _a.length; _i++) {
                    var configuration = _a[_i];
                    _loop_1(configuration);
                }
                Promise_serial(promises, { parallelize: 1 }).then(function () {
                    return resolve(true);
                }).catch(function (reason) {
                    return reject(reason);
                });
            });
        });
    };
    FacetCacheService.prototype.createFacetsCacheConfigs = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var promises = [];
            var me = _this;
            var _loop_2 = function (configuration) {
                promises.push(function () {
                    return me.createFacetCacheConfig(configuration);
                });
            };
            for (var _i = 0, _a = _this.configuration.facets; _i < _a.length; _i++) {
                var configuration = _a[_i];
                _loop_2(configuration);
            }
            Promise_serial(promises, { parallelize: 1 }).then(function () {
                return resolve(true);
            }).catch(function (reason) {
                return reject(reason);
            });
        });
    };
    FacetCacheService.prototype.createFacetsViews = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var promises = [];
            var me = _this;
            var _loop_3 = function (configuration) {
                promises.push(function () {
                    return me.createFacetView(configuration);
                });
            };
            for (var _i = 0, _a = _this.configuration.facets; _i < _a.length; _i++) {
                var configuration = _a[_i];
                _loop_3(configuration);
            }
            Promise_serial(promises, { parallelize: 1 }).then(function () {
                return resolve(true);
            }).catch(function (reason) {
                return reject(reason);
            });
        });
    };
    FacetCacheService.prototype.dropFacetsViews = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var promises = [];
            var me = _this;
            var _loop_4 = function (configuration) {
                promises.push(function () {
                    return me.dropFacetView(configuration);
                });
            };
            for (var _i = 0, _a = _this.configuration.facets; _i < _a.length; _i++) {
                var configuration = _a[_i];
                _loop_4(configuration);
            }
            Promise_serial(promises, { parallelize: 1 }).then(function () {
                return resolve(true);
            }).catch(function (reason) {
                return reject(reason);
            });
        });
    };
    FacetCacheService.prototype.createFacetsUpdateSchedules = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var promises = [];
            var me = _this;
            var _loop_5 = function (configuration) {
                promises.push(function () {
                    return me.createFacetUpdateSchedule(configuration);
                });
            };
            for (var _i = 0, _a = _this.configuration.facets; _i < _a.length; _i++) {
                var configuration = _a[_i];
                _loop_5(configuration);
            }
            Promise_serial(promises, { parallelize: 1 }).then(function () {
                return resolve(true);
            }).catch(function (reason) {
                return reject(reason);
            });
        });
    };
    FacetCacheService.prototype.dropFacetsUpdateSchedules = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var promises = [];
            var me = _this;
            var _loop_6 = function (configuration) {
                promises.push(function () {
                    return me.dropFacetUpdateSchedule(configuration);
                });
            };
            for (var _i = 0, _a = _this.configuration.facets; _i < _a.length; _i++) {
                var configuration = _a[_i];
                _loop_6(configuration);
            }
            Promise_serial(promises, { parallelize: 1 }).then(function () {
                return resolve(true);
            }).catch(function (reason) {
                return reject(reason);
            });
        });
    };
    FacetCacheService.prototype.generateCreateFacetTriggerSql = function () {
        var tables = {};
        for (var _i = 0, _a = this.configuration.facets; _i < _a.length; _i++) {
            var configuration = _a[_i];
            var longKey = configuration.longKey;
            for (var _b = 0, _c = configuration.triggerTables; _b < _c.length; _b++) {
                var table = _c[_b];
                if (!tables[table]) {
                    tables[table] = [];
                }
                tables[table].push(longKey);
            }
        }
        var sqls = [];
        for (var table in tables) {
            var triggerSqls = [];
            for (var _d = 0, _e = tables[table]; _d < _e.length; _d++) {
                var facetKey = _e[_d];
                triggerSqls.push(this.adapter.generateFacetTriggerCallSql(facetKey));
            }
            sqls = sqls.concat(this.adapter.generateCreateTableTriggerSql(table, triggerSqls.join('\n')));
        }
        return sqls;
    };
    FacetCacheService.prototype.generateDropFacetTriggerSql = function () {
        var tables = {};
        for (var _i = 0, _a = this.configuration.facets; _i < _a.length; _i++) {
            var configuration = _a[_i];
            var longKey = configuration.longKey;
            for (var _b = 0, _c = configuration.triggerTables; _b < _c.length; _b++) {
                var table = _c[_b];
                if (!tables[table]) {
                    tables[table] = [];
                }
                tables[table].push(longKey);
            }
        }
        var sqls = [];
        for (var table in tables) {
            sqls = sqls.concat(this.adapter.generateDropTableTriggerSql(table));
        }
        return sqls;
    };
    FacetCacheService.prototype.generateCreateFacetCacheConfigsSql = function (configurations) {
        var sqls = [];
        for (var _i = 0, configurations_1 = configurations; _i < configurations_1.length; _i++) {
            var configuration = configurations_1[_i];
            sqls = sqls.concat(this.adapter.generateCreateFacetCacheConfigSql(configuration));
        }
        return sqls;
    };
    FacetCacheService.prototype.generateRemoveFacetCacheConfigsSql = function (configurations) {
        var sqls = [];
        for (var _i = 0, configurations_2 = configurations; _i < configurations_2.length; _i++) {
            var configuration = configurations_2[_i];
            sqls = sqls.concat(this.adapter.generateRemoveFacetCacheConfigSql(configuration));
        }
        return sqls;
    };
    FacetCacheService.prototype.generateDeleteAndUpdateFacetCacheSql = function (configuration) {
        return this.adapter.generateDeleteFacetCacheSql(configuration)
            .concat(this.adapter.generateUpdateFacetCacheSql(configuration))
            .concat(this.adapter.generateDeleteFacetCacheUpdateTriggerSql(configuration));
    };
    FacetCacheService.prototype.generateCreateUpdateSchedulesFacetsCacheSql = function (configurations) {
        var sqls = [];
        for (var _i = 0, configurations_3 = configurations; _i < configurations_3.length; _i++) {
            var configuration = configurations_3[_i];
            sqls = sqls.concat(this.adapter.generateCreateUpdateScheduleSql(configuration.longKey, this.adapter.generateUpdateFacetCacheSql(configuration).join(';'), this.configuration.checkInterval));
        }
        return sqls;
    };
    FacetCacheService.prototype.generateDropUpdateSchedulesFacetsCacheSql = function (configurations) {
        var sqls = [];
        for (var _i = 0, configurations_4 = configurations; _i < configurations_4.length; _i++) {
            var configuration = configurations_4[_i];
            sqls = sqls.concat(this.adapter.generateDropUpdateScheduleSql(configuration.longKey));
        }
        return sqls;
    };
    FacetCacheService.prototype.generateCreateFacetViewsSql = function (configurations) {
        var sqls = [];
        for (var _i = 0, configurations_5 = configurations; _i < configurations_5.length; _i++) {
            var configuration = configurations_5[_i];
            sqls = sqls.concat(this.adapter.generateCreateFacetViewSql(configuration));
        }
        return sqls;
    };
    FacetCacheService.prototype.generateDropFacetViewsSql = function (configurations) {
        var sqls = [];
        for (var _i = 0, configurations_6 = configurations; _i < configurations_6.length; _i++) {
            var configuration = configurations_6[_i];
            sqls = sqls.concat(this.adapter.generateDropFacetViewSql(configuration));
        }
        return sqls;
    };
    FacetCacheService.prototype.createFacetView = function (configuration) {
        return this.executeSqls(this.adapter.generateCreateFacetViewSql(configuration));
    };
    FacetCacheService.prototype.dropFacetView = function (configuration) {
        return this.executeSqls(this.adapter.generateDropFacetViewSql(configuration));
    };
    FacetCacheService.prototype.createFacetCacheConfig = function (configuration) {
        return this.executeSqls(this.adapter.generateCreateFacetCacheConfigSql(configuration));
    };
    FacetCacheService.prototype.removeFacetCacheConfig = function (configuration) {
        return this.executeSqls(this.adapter.generateRemoveFacetCacheConfigSql(configuration));
    };
    FacetCacheService.prototype.createFacetUpdateSchedule = function (configuration) {
        return this.executeSqls(this.adapter.generateCreateUpdateScheduleSql(configuration.longKey, this.adapter.generateUpdateFacetCacheSql(configuration).join(';'), this.configuration.checkInterval));
    };
    FacetCacheService.prototype.dropFacetUpdateSchedule = function (configuration) {
        return this.executeSqls(this.adapter.generateDropUpdateScheduleSql(configuration.longKey));
    };
    FacetCacheService.prototype.executeSqls = function (sqls) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var promises = [];
            var me = _this;
            var sqlBuilder = _this.knex;
            var _loop_7 = function (sql) {
                promises.push(function () {
                    if (sql === undefined || sql.trim() === '') {
                        return js_data_1.utils.resolve(true);
                    }
                    return sqlBuilder.raw(me.transformToSqlDialect(sql));
                });
            };
            for (var _i = 0, sqls_1 = sqls; _i < sqls_1.length; _i++) {
                var sql = sqls_1[_i];
                _loop_7(sql);
            }
            Promise_serial(promises, { parallelize: 1 }).then(function () {
                return resolve(true);
            }).catch(function (reason) {
                return reject(reason);
            });
        });
    };
    FacetCacheService.prototype.transformToSqlDialect = function (sql) {
        var client = this.knex.client['config']['client'];
        if (client === 'sqlite3') {
            sql = sql_utils_1.SqlUtils.transformToSqliteDialect(sql);
        }
        return this.sqlQueryBuilder.transformToSqlDialect(sql, client);
    };
    return FacetCacheService;
}());
exports.FacetCacheService = FacetCacheService;
//# sourceMappingURL=facetcache.service.js.map