import { HttpAdapter, IDict } from 'js-data-http';
import { Mapper, Record } from 'js-data';
import { Facets } from '../model/container/facets';
import { GenericSearchResult } from '../model/container/generic-searchresult';
import { GenericSearchForm } from '../model/forms/generic-searchform';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import { GenericActionTagAdapter, GenericFacetAdapter, GenericSearchAdapter } from './generic-search.adapter';
import { ActionTagForm } from '../../commons/utils/actiontag.utils';
export declare function Response(data: any, meta: any, op: any): void;
export declare abstract class GenericSearchHttpAdapter<R extends Record, F extends GenericSearchForm, S extends GenericSearchResult<R, F>> extends HttpAdapter implements GenericSearchAdapter<R, F, S>, GenericFacetAdapter<R, F, S>, GenericActionTagAdapter<R, F, S> {
    constructor(config: any);
    create(mapper: Mapper, props: any, opts?: any): Promise<R>;
    update(mapper: Mapper, id: string | number, props: any, opts?: any): Promise<R>;
    doActionTag(mapper: Mapper, record: R, actionTagForm: ActionTagForm, opts: any): Promise<R>;
    facets(mapper: Mapper, query: any, opts: any): Promise<Facets>;
    search(mapper: Mapper, query: any, opts: any): Promise<S>;
    export(mapper: Mapper, query: any, format: string, opts: any): Promise<string>;
    beforeFacets(mapper: Mapper, query: IDict, opts: IDict): any;
    beforeSearch(mapper: Mapper, query: IDict, opts: IDict): any;
    afterFacets(mapper: Mapper, props: IDict, opts: any, result: any): Promise<Facets>;
    afterSearch(mapper: Mapper, props: IDict, opts: any, result: any): Promise<S>;
    afterCreate(mapper: Mapper, props: IDict, opts: any, result: any): Promise<R>;
    afterUpdate(mapper: Mapper, id: number | string, opts: any, result: any): Promise<R>;
    afterFind(mapper: Mapper, id: number | string, opts: any, result: any): Promise<R>;
    afterDestroy(mapper: Mapper, id: number | string, opts: any, result: any): Promise<R>;
    deserialize(mapper: Mapper, response: any, opts: any): any;
    extractCountFromRequestResult(mapper: Mapper, result: any): number;
    extractRecordsFromRequestResult(mapper: Mapper, result: any): R[];
    extractFacetsFromRequestResult(mapper: Mapper, result: any): Facets;
    protected _doActionTag(mapper: Mapper, record: R, actionTagForm: ActionTagForm, opts: any): Promise<R>;
    protected _export(mapper: Mapper, query: any, format: string, opts: any): Promise<string>;
    abstract getHttpEndpoint(method: string, format?: string): string;
    private queryTransformToHttpQuery;
    buildUrl(url: any, params: any): any;
}
