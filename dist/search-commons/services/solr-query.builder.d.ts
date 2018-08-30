import { AdapterOpts, AdapterQuery, MapperUtils } from './mapper.utils';
export interface SolrQueryData {
    start: number;
    rows: number;
    sort?: string[];
    field?: string[];
    q: string;
    fl?: string;
}
export interface SolrConfig {
    fieldList: string[];
    facetConfigs: {};
    filterMapping: {};
    fieldMapping: {};
    sortMapping: {};
    commonSortOptions: {};
    spatialField?: string;
    spatialSortKey?: string;
}
export declare class SolrQueryBuilder {
    protected mapperUtils: MapperUtils;
    buildUrl(url: any, params: any): any;
    queryTransformToAdapterSelectQuery(solrConfig: SolrConfig, method: string, adapterQuery: AdapterQuery, adapterOpts: AdapterOpts): SolrQueryData;
    isSpatialQuery(solrConfig: SolrConfig, adapterQuery: AdapterQuery): boolean;
    protected createAdapterSelectQuery(solrConfig: SolrConfig, method: string, adapterQuery: AdapterQuery, adapterOpts: AdapterOpts): SolrQueryData;
    protected getSortParams(solrConfig: SolrConfig, method: string, adapterQuery: AdapterQuery, adapterOpts: AdapterOpts): Map<string, any>;
    protected getSpatialParams(solrConfig: SolrConfig, adapterQuery: AdapterQuery): Map<string, any>;
    protected getAdapterSelectFields(solrConfig: SolrConfig, method: string, adapterQuery: AdapterQuery): string[];
    protected getFacetParams(solrConfig: SolrConfig, adapterOpts: AdapterOpts): Map<string, any>;
    protected mapToAdapterFieldName(solrConfig: SolrConfig, fieldName: string): string;
    protected mapFilterToAdapterQuery(solrConfig: SolrConfig, fieldName: string, action: string, value: any): string;
    protected generateFilter(fieldName: string, action: string, value: any): string;
}
