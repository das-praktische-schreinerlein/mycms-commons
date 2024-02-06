import { AdapterFilterActions, AdapterOpts, AdapterQuery, MapperUtils } from './mapper.utils';
import { FacetValueType } from '../model/container/facets';
import { RawSqlQueryData } from './sql-utils';
export interface SelectQueryData {
    where: string[];
    offset: number;
    limit: number;
    sort: string[];
    tableConfig: TableConfig;
    from: string;
    groupByFields: string[];
    fields: string[];
    having: string[];
}
export interface WriteQueryData {
    tableConfig: TableConfig;
    from: string;
    fields: {};
}
export interface TableFacetConfig {
    ignoreIfNotExplicitNamed?: boolean;
    selectField?: string;
    selectFrom?: string;
    orderBy?: string;
    selectLimit?: number;
    noFacet?: boolean;
    selectSql?: string;
    cache?: {
        useCache: false | 'EVER' | 'IF_VALID';
        cachedSelectSql?: string;
    };
    withLabelField?: boolean;
    withIdField?: boolean;
    triggerTables?: string[];
    valueType?: FacetValueType;
    constValues?: string[];
    action?: AdapterFilterActions;
    filterField?: string;
    filterFields?: string[];
}
export interface OptionalGroupByConfig {
    triggerParams?: string[];
    from?: string;
    groupByFields?: string[];
}
export interface LoadDetailDataConfig {
    profile: string | string[];
    sql: string;
    parameterNames: string[];
    modes?: string[];
}
export interface SpatialDataConfig {
    lat: string;
    lon: string;
    spatialField: string;
    spatialSortKey: string;
}
export interface ChangelogDataConfig {
    table?: string;
    fieldId?: string;
    createDateField?: string;
    updateDateField?: string;
    updateVersionField?: string;
}
export interface TableConfig {
    key: string;
    tableName: string;
    selectFrom: string;
    selectFieldList: string[];
    facetConfigs: {
        [key: string]: TableFacetConfig;
    };
    filterMapping: {
        [key: string]: string;
    };
    fieldMapping: {
        [key: string]: string;
    };
    sortMapping: {
        [key: string]: string;
    };
    writeMapping?: {
        [key: string]: string;
    };
    actionTags?: {};
    groupbBySelectFieldList?: boolean;
    groupbBySelectFieldListIgnore?: string[];
    optionalGroupBy?: OptionalGroupByConfig[];
    loadDetailData?: LoadDetailDataConfig[];
    spartialConfig?: SpatialDataConfig;
    changelogConfig?: ChangelogDataConfig;
}
export interface TableConfigs {
    [key: string]: TableConfig;
}
export interface FacetCacheUsageConfiguration {
    facetKeyPatterns: string[];
}
export interface FacetCacheUsageConfigurations {
    active: boolean;
    entities: {
        [key: string]: FacetCacheUsageConfiguration;
    };
}
export declare class SqlQueryBuilder {
    protected mapperUtils: MapperUtils;
    extendTableConfigs(tableConfigs: TableConfigs): void;
    extendTableConfig(tableConfig: TableConfig): void;
    transformToSqlDialect(sql: string, client: string): string;
    selectQueryTransformToSql(query: SelectQueryData): string;
    updateChangelogSqlQuery(mode: string, table: string, idField: string, changelogDataConfig: ChangelogDataConfig, id: any): RawSqlQueryData;
    queryTransformToAdapterWriteQuery(tableConfig: TableConfig, method: string, props: any, adapterOpts: AdapterOpts): WriteQueryData;
    queryTransformToAdapterSelectQuery(tableConfig: TableConfig, method: string, adapterQuery: AdapterQuery, adapterOpts: AdapterOpts): SelectQueryData;
    getFacetSql(tableConfig: TableConfig, facetCacheUsageConfigurations: FacetCacheUsageConfigurations, adapterOpts: AdapterOpts): Map<string, string>;
    generateFacetSqlForSelectField(tableName: string, tableFacetConfig: TableFacetConfig): string;
    generateFacetSqlSortForSelectField(tableFacetConfig: TableFacetConfig): string;
    protected generateFacetUseCacheSql(facetCacheUsageConfigurations: FacetCacheUsageConfigurations, tableConfig: TableConfig, facetKey: string, tableFacetConfig: TableFacetConfig): string;
    protected generateFacetCacheSql(tableConfig: TableConfig, facetKey: string, tableFacetConfig: TableFacetConfig): string;
    isSpatialQuery(tableConfig: TableConfig, adapterQuery: AdapterQuery): boolean;
    generateFilter(fieldName: string, action: string | AdapterFilterActions, value: any, throwOnUnknown?: boolean): string;
    sanitizeSqlFilterValue(value: any): string;
    sanitizeSqlFilterValuesToSingleValue(value: any, splitter: string, joiner: string): string;
    extractDbResult(dbresult: any, client: string): any;
    protected createInValueList(fieldName: string, fieldValues: any, prefix: string, joiner: string, suffix: string, nullAction: string, notNullAction: string): string;
    protected createAdapterSelectQuery(tableConfig: TableConfig, method: string, adapterQuery: AdapterQuery, adapterOpts: AdapterOpts): SelectQueryData;
    protected getAdapterFrom(tableConfig: TableConfig): string;
    protected getSortParams(tableConfig: TableConfig, method: string, adapterQuery: AdapterQuery, adapterOpts: AdapterOpts): string[];
    protected getSortKey(tableConfig: TableConfig, method: string, adapterQuery: AdapterQuery, adapterOpts: AdapterOpts): string;
    protected getSpatialParams(tableConfig: TableConfig, adapterQuery: AdapterQuery, spatialField: string): string;
    protected getSpatialSql(tableConfig: TableConfig, adapterQuery: AdapterQuery): string;
    protected getAdapterSelectFields(tableConfig: TableConfig, method: string, adapterQuery: AdapterQuery): string[];
    protected generateGroupByForQuery(tableConfig: TableConfig, method: string, query: SelectQueryData, adapterQuery: AdapterQuery, adapterOpts?: AdapterOpts): void;
    protected mapToAdapterFieldName(tableConfig: TableConfig, fieldName: string): string;
    protected mapFilterToAdapterQuery(tableConfig: TableConfig, fieldName: string, action: string | AdapterFilterActions, value: any): string;
}
