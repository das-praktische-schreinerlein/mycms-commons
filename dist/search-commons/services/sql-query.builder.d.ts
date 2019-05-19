import { AdapterOpts, AdapterQuery, MapperUtils } from './mapper.utils';
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
    constValues?: string[];
    action: string;
    filterField?: string;
    filterFields?: string[];
}
export interface OptionalGroupByConfig {
    triggerParams?: string[];
    from?: string;
    groupByFields?: string[];
}
export interface LoadDetailDataConfig {
    profile: string[];
    sql: string;
    parameterNames: string[];
    modes?: string[];
}
export interface TableConfig {
    key: string;
    tableName: string;
    selectFrom: string;
    selectFieldList: string[];
    facetConfigs: {};
    filterMapping: {};
    fieldMapping: {};
    sortMapping: {};
    writeMapping?: {};
    actionTags?: {};
    groupbBySelectFieldList?: boolean;
    groupbBySelectFieldListIgnore?: string[];
    optionalGroupBy?: OptionalGroupByConfig[];
    loadDetailData?: LoadDetailDataConfig[];
    spartialConfig?: {
        lat: string;
        lon: string;
        spatialField: string;
        spatialSortKey: string;
    };
}
export declare class SqlQueryBuilder {
    protected mapperUtils: MapperUtils;
    transformToSqlDialect(sql: string, client: string): string;
    selectQueryTransformToSql(query: SelectQueryData): string;
    queryTransformToAdapterWriteQuery(tableConfig: TableConfig, method: string, props: any, adapterOpts: AdapterOpts): WriteQueryData;
    queryTransformToAdapterSelectQuery(tableConfig: TableConfig, method: string, adapterQuery: AdapterQuery, adapterOpts: AdapterOpts): SelectQueryData;
    getFacetSql(tableConfig: TableConfig, adapterOpts: AdapterOpts): Map<string, string>;
    isSpatialQuery(tableConfig: TableConfig, adapterQuery: AdapterQuery): boolean;
    generateFilter(fieldName: string, action: string, value: any, throwOnUnknown?: boolean): string;
    sanitizeSqlFilterValue(value: any): string;
    sanitizeSqlFilterValuesToSingleValue(value: any, splitter: string, joiner: string): string;
    protected createInValueList(fieldName: string, fieldValues: any, prefix: string, joiner: string, suffix: string, nullAction: string): string;
    protected createAdapterSelectQuery(tableConfig: TableConfig, method: string, adapterQuery: AdapterQuery, adapterOpts: AdapterOpts): SelectQueryData;
    protected getAdapterFrom(tableConfig: TableConfig): string;
    protected getSortParams(tableConfig: TableConfig, method: string, adapterQuery: AdapterQuery, adapterOpts: AdapterOpts): string[];
    protected getSpatialParams(tableConfig: TableConfig, adapterQuery: AdapterQuery, spatialField: string): string;
    protected getSpatialSql(tableConfig: TableConfig, adapterQuery: AdapterQuery): string;
    protected getAdapterSelectFields(tableConfig: TableConfig, method: string, adapterQuery: AdapterQuery): string[];
    protected generateGroupByForQuery(tableConfig: TableConfig, method: string, query: SelectQueryData, adapterQuery: AdapterQuery): void;
    protected mapToAdapterFieldName(tableConfig: TableConfig, fieldName: string): string;
    protected mapFilterToAdapterQuery(tableConfig: TableConfig, fieldName: string, action: string, value: any): string;
    extractDbResult(dbresult: any, client: string): any;
}
