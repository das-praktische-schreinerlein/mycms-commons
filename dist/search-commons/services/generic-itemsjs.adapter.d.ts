import { Mapper, Record } from 'js-data';
import { GenericSearchResult } from '../model/container/generic-searchresult';
import { GenericSearchForm } from '../model/forms/generic-searchform';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import { Adapter } from 'js-data-adapter';
import { Facets } from '../model/container/facets';
import { GenericFacetAdapter, GenericSearchAdapter } from './generic-search.adapter';
import { ItemsJsConfig, ItemsJsQueryBuilder, ItemsJsSelectQueryData } from './itemsjs-query.builder';
import { GenericAdapterResponseMapper } from './generic-adapter-response.mapper';
export interface ItemJsResultPagination {
    per_page: number;
    page: number;
    total: number;
}
export interface ItemJsResultAggregation {
    name: string;
    title: string;
    position: number;
    buckets: [{
        key: string;
        doc_count: string;
    }];
}
export interface ItemJsResultData {
    items: any[];
    aggregations: {};
}
export interface ItemJsResult {
    pagination: ItemJsResultPagination;
    data: ItemJsResultData;
}
export declare abstract class GenericItemsJsAdapter<R extends Record, F extends GenericSearchForm, S extends GenericSearchResult<R, F>> extends Adapter implements GenericSearchAdapter<R, F, S>, GenericFacetAdapter<R, F, S> {
    protected itemJs: any;
    protected itemsJsQueryBuilder: ItemsJsQueryBuilder;
    protected mapper: GenericAdapterResponseMapper;
    constructor(config: any, mapper: GenericAdapterResponseMapper, data: any[], itemJsConfig: ItemsJsConfig);
    create(mapper: Mapper, props: any, opts?: any): Promise<R>;
    createMany(mapper: Mapper, props: any, opts: any): Promise<R>;
    destroy(mapper: Mapper, id: string | number, opts?: any): Promise<any>;
    destroyAll(mapper: Mapper, query: any, opts: any): Promise<any>;
    find(mapper: Mapper, id: string | number, opts: any): Promise<R>;
    sum(mapper: Mapper, field: string, query: any, opts?: any): Promise<any>;
    update(mapper: Mapper, id: string | number, props: any, opts: any): Promise<R>;
    updateAll(mapper: Mapper, props: any, query: any, opts?: any): Promise<any>;
    updateMany(mapper: Mapper, records: R[], opts?: any): Promise<any>;
    count(mapper: Mapper, query: any, opts?: any): Promise<number>;
    findAll(mapper: Mapper, query: any, opts: any): Promise<R[]>;
    facets(mapper: Mapper, query: any, opts: any): Promise<Facets>;
    search(mapper: Mapper, query: any, opts: any): Promise<S>;
    afterCount(mapper: Mapper, props: any, opts: any, result: any): Promise<number>;
    protected _facets(mapper: Mapper, query: any, opts: any): Promise<Facets>;
    protected _search(mapper: Mapper, query: any, opts: any): Promise<S>;
    protected _count(mapper: Mapper, query: any, opts?: any): Promise<any>;
    protected _findAll(mapper: any, query: any, opts?: any): Promise<any>;
    deserializeResponse(mapper: Mapper, response: ItemJsResult, opts: any): number | Facets | R[];
    extractCountFromRequestResult(mapper: Mapper, result: ItemJsResult): number;
    extractRecordsFromRequestResult(mapper: Mapper, result: ItemJsResult): R[];
    extractFacetsFromRequestResult(mapper: Mapper, result: ItemJsResult): Facets;
    mapResponseDocument(mapper: Mapper, doc: any, itemsJsConfig: ItemsJsConfig): Record;
    abstract mapToAdapterDocument(props: any): any;
    abstract getItemsJsConfig(): ItemsJsConfig;
    protected doQuery(query: ItemsJsSelectQueryData): ItemJsResult;
    protected queryTransformToAdapterQuery(mapper: Mapper, params: any, opts: any): ItemsJsSelectQueryData;
    protected queryTransformToAdapterQueryWithMethod(method: string, mapper: Mapper, params: any, opts: any): ItemsJsSelectQueryData;
}
