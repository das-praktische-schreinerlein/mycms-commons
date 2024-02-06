import { FacetCacheConfiguration, FacetCacheServiceConfiguration } from '../model/facetcache.configuration';
import { FacetCacheAdapter } from '../model/facetcache.adapter';
import { DatabaseService } from '../../commons/services/database.service';
import { SqlQueryBuilder } from '../../search-commons/services/sql-query.builder';
export declare class FacetCacheService {
    protected knex: any;
    protected sqlQueryBuilder: SqlQueryBuilder;
    protected databaseService: DatabaseService;
    protected configuration: FacetCacheServiceConfiguration;
    protected adapter: FacetCacheAdapter;
    constructor(configuration: FacetCacheServiceConfiguration, knex: any, adapter: FacetCacheAdapter);
    createDatabaseRequirements(): Promise<boolean>;
    showCreateDatabaseRequirements(): string[];
    dropDatabaseRequirements(): Promise<boolean>;
    showDropDatabaseRequirements(): string[];
    createAndStartDatabaseManagedFacets(): Promise<boolean>;
    showCreateAndStartDatabaseManagedFacets(): string[];
    stopAndDropDatabaseManagedFacets(): Promise<boolean>;
    showStopAndDropDatabaseManagedFacets(): string[];
    createAndStartServerManagedFacets(): Promise<boolean>;
    startServerManagedFacets(): Promise<boolean>;
    showCreateServerManagedFacets(): string[];
    dropServerManagedFacets(): Promise<boolean>;
    showDropServerManagedFacets(): string[];
    dropFacetCacheTables(): Promise<boolean>;
    createFacetCacheTables(): Promise<boolean>;
    createFacetCacheTriggerFunctions(): Promise<boolean>;
    dropFacetCacheTriggerFunctions(): Promise<boolean>;
    createFacetCacheUpdateCheckFunctions(): Promise<boolean>;
    dropFacetCacheUpdateCheckFunctions(): Promise<boolean>;
    dropFacetsTriggers(): Promise<boolean>;
    createFacetsTriggers(): Promise<boolean>;
    removeFacetsCacheConfigs(): Promise<boolean>;
    createFacetsCacheConfigs(): Promise<boolean>;
    createFacetsViews(): Promise<boolean>;
    dropFacetsViews(): Promise<boolean>;
    createFacetsUpdateSchedules(): Promise<boolean>;
    dropFacetsUpdateSchedules(): Promise<boolean>;
    generateCreateFacetTriggerSql(): string[];
    generateDropFacetTriggerSql(): string[];
    generateCreateFacetCacheConfigsSql(configurations: FacetCacheConfiguration[]): string[];
    generateRemoveFacetCacheConfigsSql(configurations: FacetCacheConfiguration[]): string[];
    generateDeleteAndUpdateFacetCacheSql(configuration: FacetCacheConfiguration): string[];
    generateCreateUpdateSchedulesFacetsCacheSql(configurations: FacetCacheConfiguration[]): string[];
    generateDropUpdateSchedulesFacetsCacheSql(configurations: FacetCacheConfiguration[]): string[];
    generateCreateFacetViewsSql(configurations: FacetCacheConfiguration[]): string[];
    generateDropFacetViewsSql(configurations: FacetCacheConfiguration[]): string[];
    protected createFacetView(configuration: FacetCacheConfiguration): Promise<boolean>;
    protected dropFacetView(configuration: FacetCacheConfiguration): Promise<boolean>;
    protected createFacetCacheConfig(configuration: FacetCacheConfiguration): Promise<boolean>;
    protected removeFacetCacheConfig(configuration: FacetCacheConfiguration): Promise<boolean>;
    protected createFacetUpdateSchedule(configuration: FacetCacheConfiguration): Promise<boolean>;
    protected dropFacetUpdateSchedule(configuration: FacetCacheConfiguration): Promise<boolean>;
}
