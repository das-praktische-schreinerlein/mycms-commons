import * as Promise_serial from 'promise-serial';
import {utils} from 'js-data';
import {FacetCacheConfiguration, FacetCacheServiceConfiguration} from '../model/facetcache.configuration';
import {FacetCacheAdapter} from '../model/facetcache.adapter';
import {DatabaseService} from "../../commons/services/database.service";
import {SqlQueryBuilder} from "../../search-commons/services/sql-query.builder";

export class FacetCacheService {
    protected knex: any;
    protected sqlQueryBuilder: SqlQueryBuilder;
    protected databaseService: DatabaseService;
    protected configuration: FacetCacheServiceConfiguration;
    protected adapter: FacetCacheAdapter;

    public constructor(configuration: FacetCacheServiceConfiguration, knex: any, adapter: FacetCacheAdapter) {
        this.sqlQueryBuilder = new SqlQueryBuilder();
        this.databaseService = new DatabaseService(knex, this.sqlQueryBuilder);
        this.configuration = configuration;
        this.knex = knex;
        this.adapter = adapter;
    }

    public createDatabaseRequirements(): Promise<boolean> {
        return this.createFacetCacheTables().then(() => {
            return this.createFacetCacheTriggerFunctions();
        }).then(() => {
            return this.createFacetCacheUpdateCheckFunctions();
        });
    }

    public showCreateDatabaseRequirements(): string[] {
        return this.adapter.generateCreateFacetCacheTables()
            .concat(this.adapter.generateCreateFacetCacheTriggerFunctions())
            .concat(this.adapter.generateCreateFacetCacheUpdateCheckFunctions());
    }

    public dropDatabaseRequirements(): Promise<boolean> {
        return this.dropFacetCacheUpdateCheckFunctions().then(() => {
            return this.dropFacetCacheTriggerFunctions();
        }).then(() => {
            return this.dropFacetCacheTables();
        });
    }

    public showDropDatabaseRequirements(): string[] {
        return this.adapter.generateDropFacetCacheUpdateCheckFunctions()
            .concat(this.adapter.generateDropFacetCacheTriggerFunctions())
            .concat(this.adapter.generateDropFacetCacheTables());
    }

    public createAndStartDatabaseManagedFacets(): Promise<boolean> {
        if (!this.adapter.supportsDatabaseManagedUpdate) {
            throw new Error('adapter doesnt support database-managed-facetcache');
        }
        if (this.configuration.facets.length <= 0) {
            console.error('dont start facetcache: no facets defined');
            return utils.resolve(false);
        }

        return this.createFacetsViews().then(() => {
            return this.createFacetsCacheConfigs();
        }).then(() => {
            return this.createFacetsTriggers();
        }).then(() => {
            return this.createFacetsUpdateSchedules();
        });
    }

    public showCreateAndStartDatabaseManagedFacets(): string[] {
        if (!this.adapter.supportsDatabaseManagedUpdate) {
            throw new Error('adapter doesnt support database-managed-facetcache');
        }

        return this.generateCreateFacetViewsSql(this.configuration.facets)
            .concat(this.generateCreateFacetCacheConfigsSql(this.configuration.facets))
            .concat(this.generateCreateFacetTriggerSql())
            .concat(this.generateCreateUpdateSchedulesFacetsCacheSql(this.configuration.facets));
    }

    public stopAndDropDatabaseManagedFacets(): Promise<boolean> {
        if (!this.adapter.supportsDatabaseManagedUpdate) {
            throw new Error('adapter doesnt support database-managed-facetcache');
        }

        return this.dropFacetsUpdateSchedules().then(() => {
            return this.dropFacetsTriggers();
        }).then(() => {
            return this.removeFacetsCacheConfigs();
        }).then(() => {
            return this.dropFacetsViews();
        });
    }

    public showStopAndDropDatabaseManagedFacets(): string[] {
        if (!this.adapter.supportsDatabaseManagedUpdate) {
            throw new Error('adapter doesnt support database-managed-facetcache');
        }

        return this.generateDropUpdateSchedulesFacetsCacheSql(this.configuration.facets)
            .concat(this.generateDropFacetTriggerSql())
            .concat(this.generateRemoveFacetCacheConfigsSql(this.configuration.facets))
            .concat(this.generateDropFacetViewsSql(this.configuration.facets));
    }

    public createAndStartServerManagedFacets(): Promise<boolean> {
        if (this.configuration.facets.length <= 0) {
            console.error('dont start facetcache: no facets defined');
            return utils.resolve(false);
        }

        return this.createFacetsViews().then(() => {
            return this.createFacetsCacheConfigs();
        }).then(() => {
            return this.createFacetsTriggers();
        }).then(() => {
            return this.startServerManagedFacets();
        });
    }

    public startServerManagedFacets(): Promise<boolean> {
        if (this.configuration.facets.length <= 0) {
            console.error('dont start facetcache: no facets defined');
            return utils.resolve(false);
        }

        const me = this;
        const facets: { [key: string]: FacetCacheConfiguration } = {};
        for (const facet of me.configuration.facets) {
            facets[facet.longKey] = facet;
        }

        return new Promise<boolean>((resolve, reject) => {
            const callback = function() {
                const sqlBuilder = me.knex;
                const sql = me.adapter.generateSelectFacetCacheUpdateTriggerSql();
                const raw = sqlBuilder.raw(sql);
                raw.then(function doneSearch(dbresults: any) {
                    const response = me.sqlQueryBuilder.extractDbResult(dbresults, me.knex.client['config']['client']);
                    if (response.length < 1) {
                        console.error('no facetupdatetrigger found', new Date());
                        return utils.resolve(true);
                    }

                    let sqls = [];
                    for (const record of response) {
                        const triggerName = record['ft_key'];
                        const facet = facets[triggerName];
                        if (!facet) {
                            console.error('unknown facetupdatetrigger found: ' + triggerName, new Date());
                            continue;
                        }

                        console.error('facetupdatetrigger found: ' + triggerName, new Date());
                        sqls = sqls.concat(me.generateDeleteAndUpdateFacetCacheSql(facet));
                    }

                    console.error('DO update facets:', sqls);

                    return me.databaseService.executeSqls(sqls);
                }).then(function doneSearch() {
                    console.error('DONE update facets:', new Date());
                    setTimeout(callback, me.configuration.checkInterval * 60 * 1000);
                    return utils.resolve(true);
                }).catch(function errorSearch(reason) {
                    console.error('updateFacets failed:', reason);
                    return reject(reason);
                });
            };

            callback();
        });
    }

    public showCreateServerManagedFacets(): string[] {
        return this.generateCreateFacetViewsSql(this.configuration.facets)
            .concat(this.generateCreateFacetCacheConfigsSql(this.configuration.facets))
            .concat(this.generateCreateFacetTriggerSql());
    }

    public dropServerManagedFacets(): Promise<boolean> {
        return this.dropFacetsTriggers().then(() => {
            return this.removeFacetsCacheConfigs();
        }).then(() => {
            return this.dropFacetsViews();
        });
    }

    public showDropServerManagedFacets(): string[] {
        return this.generateDropFacetTriggerSql()
            .concat(this.generateRemoveFacetCacheConfigsSql(this.configuration.facets))
            .concat(this.generateDropFacetViewsSql(this.configuration.facets));
    }

    public dropFacetCacheTables(): Promise<boolean> {
        return this.databaseService.executeSqls(this.adapter.generateDropFacetCacheTables());
    }

    public createFacetCacheTables(): Promise<boolean> {
        return this.databaseService.executeSqls(this.adapter.generateCreateFacetCacheTables());
    }

    public createFacetCacheTriggerFunctions(): Promise<boolean> {
        return this.databaseService.executeSqls(this.adapter.generateCreateFacetCacheTriggerFunctions());
    }

    public dropFacetCacheTriggerFunctions(): Promise<boolean> {
        return this.databaseService.executeSqls(this.adapter.generateDropFacetCacheTriggerFunctions());
    }

    public createFacetCacheUpdateCheckFunctions(): Promise<boolean> {
        return this.databaseService.executeSqls(this.adapter.generateCreateFacetCacheUpdateCheckFunctions());
    }

    public dropFacetCacheUpdateCheckFunctions(): Promise<boolean> {
        return this.databaseService.executeSqls(this.adapter.generateDropFacetCacheUpdateCheckFunctions());
    }

    public dropFacetsTriggers(): Promise<boolean> {
        return this.databaseService.executeSqls(this.generateDropFacetTriggerSql());
    }

    public createFacetsTriggers(): Promise<boolean> {
        return this.databaseService.executeSqls(this.generateCreateFacetTriggerSql());
    }

    public removeFacetsCacheConfigs(): Promise<boolean> {
        const sqlBuilder = this.knex;
        const sql = this.databaseService.transformToSqlDialect(this.adapter.generateSelectTrueIfTableFacetCacheConfigExistsSql());
        const me = this;
        return sqlBuilder.raw(sql).then(dbresult => {
            const response = me.sqlQueryBuilder.extractDbResult(dbresult, me.knex.client['config']['client']);
            if (response.length < 1) {
                console.error('facetcacheconfig not exists', new Date());
                return utils.resolve(true);
            }

            return new Promise<boolean>((resolve, reject) => {
                const promises = [];
                for (const configuration of me.configuration.facets) {
                    promises.push(function () {
                        return me.removeFacetCacheConfig(configuration);
                    });
                }

                Promise_serial(promises, {parallelize: 1}).then(() => {
                    return resolve(true);
                }).catch(reason => {
                    return reject(reason);
                });
            });
        });
    }

    public createFacetsCacheConfigs(): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            const promises = [];
            const me = this;
            for (const configuration of this.configuration.facets) {
                promises.push(function () {
                    return me.createFacetCacheConfig(configuration);
                });
            }

            Promise_serial(promises, {parallelize: 1}).then(() => {
                return resolve(true);
            }).catch(reason => {
                return reject(reason);
            });
        });
    }

    public createFacetsViews(): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            const promises = [];
            const me = this;
            for (const configuration of this.configuration.facets) {
                promises.push(function () {
                    return me.createFacetView(configuration);
                });
            }

            Promise_serial(promises, {parallelize: 1}).then(() => {
                return resolve(true);
            }).catch(reason => {
                return reject(reason);
            });
        });
    }

    public dropFacetsViews(): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            const promises = [];
            const me = this;
            for (const configuration of this.configuration.facets) {
                promises.push(function () {
                    return me.dropFacetView(configuration);
                });
            }

            Promise_serial(promises, {parallelize: 1}).then(() => {
                return resolve(true);
            }).catch(reason => {
                return reject(reason);
            });
        });
    }

    public createFacetsUpdateSchedules(): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            const promises = [];
            const me = this;
            for (const configuration of this.configuration.facets) {
                promises.push(function () {
                    return me.createFacetUpdateSchedule(configuration);
                });
            }

            Promise_serial(promises, {parallelize: 1}).then(() => {
                return resolve(true);
            }).catch(reason => {
                return reject(reason);
            });
        });
    }

    public dropFacetsUpdateSchedules(): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            const promises = [];
            const me = this;
            for (const configuration of this.configuration.facets) {
                promises.push(function () {
                    return me.dropFacetUpdateSchedule(configuration);
                });
            }

            Promise_serial(promises, {parallelize: 1}).then(() => {
                return resolve(true);
            }).catch(reason => {
                return reject(reason);
            });
        });
    }

    public generateCreateFacetTriggerSql(): string[] {
        const tables = {};
        for (const configuration of this.configuration.facets) {
            const longKey = configuration.longKey;
            for (const table of configuration.triggerTables) {
                if (!tables[table]) {
                    tables[table] = [];
                }
                tables[table].push(longKey);
            }
        }

        let sqls: string[] = [];
        for (const table in tables) {
            const triggerSqls = [];
            for (const facetKey of tables[table]) {
                triggerSqls.push(this.adapter.generateFacetTriggerCallSql(facetKey));
            }

            sqls = sqls.concat(this.adapter.generateCreateTableTriggerSql(table, triggerSqls.join('\n')));
        }

        return sqls;
    }

    public generateDropFacetTriggerSql(): string[] {
        const tables = {};
        for (const configuration of this.configuration.facets) {
            const longKey = configuration.longKey;
            for (const table of configuration.triggerTables) {
                if (!tables[table]) {
                    tables[table] = [];
                }
                tables[table].push(longKey);
            }
        }

        let sqls: string[] = [];
        for (const table in tables) {
            sqls = sqls.concat(this.adapter.generateDropTableTriggerSql(table));
        }

        return sqls;
    }

    public generateCreateFacetCacheConfigsSql(configurations: FacetCacheConfiguration[]): string[] {
        let sqls: string[] = [];
        for (const configuration of configurations) {
            sqls = sqls.concat(this.adapter.generateCreateFacetCacheConfigSql(configuration));
        }

        return sqls;
    }

    public generateRemoveFacetCacheConfigsSql(configurations: FacetCacheConfiguration[]): string[] {
        let sqls: string[] = [];
        for (const configuration of configurations) {
            sqls = sqls.concat(this.adapter.generateRemoveFacetCacheConfigSql(configuration));
        }

        return sqls;
    }

    public generateDeleteAndUpdateFacetCacheSql(configuration: FacetCacheConfiguration): string[] {
        return this.adapter.generateDeleteFacetCacheSql(configuration)
            .concat(this.adapter.generateUpdateFacetCacheSql(configuration))
            .concat(this.adapter.generateDeleteFacetCacheUpdateTriggerSql(configuration));
    }

    public generateCreateUpdateSchedulesFacetsCacheSql(configurations: FacetCacheConfiguration[]): string[] {
        let sqls: string[] = [];
        for (const configuration of configurations) {
            sqls = sqls.concat(this.adapter.generateCreateUpdateScheduleSql(configuration.longKey,
                this.adapter.generateUpdateFacetCacheSql(configuration).join(';'), this.configuration.checkInterval));
        }

        return sqls;
    }

    public generateDropUpdateSchedulesFacetsCacheSql(configurations: FacetCacheConfiguration[]): string[] {
        let sqls: string[] = [];
        for (const configuration of configurations) {
            sqls = sqls.concat(this.adapter.generateDropUpdateScheduleSql(configuration.longKey));
        }

        return sqls;
    }

    public generateCreateFacetViewsSql(configurations: FacetCacheConfiguration[]): string[] {
        let sqls: string[] = [];
        for (const configuration of configurations) {
            sqls = sqls.concat(this.adapter.generateCreateFacetViewSql(configuration));
        }

        return sqls;
    }

    public generateDropFacetViewsSql(configurations: FacetCacheConfiguration[]): string[] {
        let sqls: string[] = [];
        for (const configuration of configurations) {
            sqls = sqls.concat(this.adapter.generateDropFacetViewSql(configuration));
        }

        return sqls;
    }

    protected createFacetView(configuration: FacetCacheConfiguration): Promise<boolean> {
        return this.databaseService.executeSqls(this.adapter.generateCreateFacetViewSql(configuration));
    }

    protected dropFacetView(configuration: FacetCacheConfiguration): Promise<boolean> {
        return this.databaseService.executeSqls(this.adapter.generateDropFacetViewSql(configuration));
    }

    protected createFacetCacheConfig(configuration: FacetCacheConfiguration): Promise<boolean> {
        return this.databaseService.executeSqls(this.adapter.generateCreateFacetCacheConfigSql(configuration));
    }

    protected removeFacetCacheConfig(configuration: FacetCacheConfiguration): Promise<boolean> {
        return this.databaseService.executeSqls(this.adapter.generateRemoveFacetCacheConfigSql(configuration));
    }

    protected createFacetUpdateSchedule(configuration: FacetCacheConfiguration): Promise<boolean> {
        return this.databaseService.executeSqls(
            this.adapter.generateCreateUpdateScheduleSql(configuration.longKey,
                this.adapter.generateUpdateFacetCacheSql(configuration).join(';'), this.configuration.checkInterval));
    }

    protected dropFacetUpdateSchedule(configuration: FacetCacheConfiguration): Promise<boolean> {
        return this.databaseService.executeSqls(this.adapter.generateDropUpdateScheduleSql(configuration.longKey));
    }

}
