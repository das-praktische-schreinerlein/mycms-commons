import { AdapterFilterActions, AdapterOpts, AdapterQuery, MapperUtils } from './mapper.utils';
export interface ItemsJsSelectSpatialQueryData {
    lat: number;
    lng: number;
    distance: number;
}
export interface ItemsJsSelectQueryData {
    page: number;
    per_page: number;
    sort?: string;
    filters?: {};
    spatialQuery?: ItemsJsSelectSpatialQueryData;
    query: string;
}
export interface ItemsJsConfig {
    searchableFields: string[];
    aggregations: {};
    sortings: {};
    filterMapping: {};
    fieldMapping: {};
    spatialField?: string;
    spatialSortKey?: string;
}
export declare class ItemsJsQueryBuilder {
    protected mapperUtils: MapperUtils;
    queryTransformToAdapterSelectQuery(itemsJsConfig: ItemsJsConfig, method: string, adapterQuery: AdapterQuery, adapterOpts: AdapterOpts): ItemsJsSelectQueryData;
    isSpatialQuery(itemsJsConfig: ItemsJsConfig, adapterQuery: AdapterQuery): boolean;
    protected createAdapterSelectQuery(itemsJsConfig: ItemsJsConfig, method: string, adapterQuery: AdapterQuery, adapterOpts: AdapterOpts): ItemsJsSelectQueryData;
    protected getSortParams(itemsJsConfig: ItemsJsConfig, method: string, adapterQuery: AdapterQuery, adapterOpts: AdapterOpts): string;
    protected getSpatialParams(itemsJsConfig: ItemsJsConfig, adapterQuery: AdapterQuery): ItemsJsSelectSpatialQueryData;
    protected getAdapterSelectFields(itemsJsConfig: ItemsJsConfig, method: string, adapterQuery: AdapterQuery): string[];
    protected getFacetParams(itemsJsConfig: ItemsJsConfig, adapterOpts: AdapterOpts): Map<string, any>;
    protected mapToAdapterFieldName(itemsJsConfig: ItemsJsConfig, fieldName: string): string;
    protected mapFilterToAdapterQuery(itemsJsConfig: ItemsJsConfig, fieldName: string, action: string, value: any): {};
    protected generateFilter(fieldName: string, action: string, value: any | AdapterFilterActions, throwOnUnknown?: boolean): {};
}
