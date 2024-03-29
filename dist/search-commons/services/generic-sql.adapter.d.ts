import { IDict } from 'js-data-http';
import { Mapper, Record } from 'js-data';
import { Facet, Facets } from '../model/container/facets';
import { GenericSearchResult } from '../model/container/generic-searchresult';
import { GenericSearchForm } from '../model/forms/generic-searchform';
import { Adapter } from 'js-data-adapter';
import { GenericFacetAdapter } from './generic-search.adapter';
import { AdapterOpts, AdapterQuery, MapperUtils } from './mapper.utils';
import { GenericAdapterResponseMapper } from './generic-adapter-response.mapper';
import { FacetCacheUsageConfigurations, SelectQueryData, SqlQueryBuilder, TableConfig, WriteQueryData } from './sql-query.builder';
import { ActionTagForm } from '../../commons/utils/actiontag.utils';
export declare abstract class GenericSqlAdapter<R extends Record, F extends GenericSearchForm, S extends GenericSearchResult<R, F>> extends Adapter implements GenericFacetAdapter<R, F, S> {
    protected knex: any;
    protected mapperUtils: MapperUtils;
    protected sqlQueryBuilder: SqlQueryBuilder;
    protected mapper: GenericAdapterResponseMapper;
    protected config: any;
    protected facetCacheConfig: FacetCacheUsageConfigurations;
    constructor(config: any, mapper: GenericAdapterResponseMapper, facetCacheConfig?: FacetCacheUsageConfigurations);
    create(mapper: Mapper, props: any, opts?: any): Promise<R>;
    createMany(mapper: Mapper, props: any, opts: any): Promise<R>;
    destroy(mapper: Mapper, id: string | number, opts?: any): Promise<any>;
    destroyAll(mapper: Mapper, query: any, opts: any): Promise<any>;
    doActionTag(mapper: Mapper, record: R, actionTagForm: ActionTagForm, opts: any): Promise<R>;
    export(mapper: Mapper, query: any, format: string, opts: any): Promise<string>;
    find(mapper: Mapper, id: string | number, opts: any): Promise<R>;
    sum(mapper: Mapper, field: string, query: any, opts?: any): Promise<any>;
    update(mapper: Mapper, id: string | number, props: any, opts: any): Promise<R>;
    updateAll(mapper: Mapper, props: any, query: any, opts?: any): Promise<any>;
    updateMany(mapper: Mapper, records: R[], opts?: any): Promise<any>;
    count(mapper: Mapper, query: any, opts?: any): Promise<number>;
    findAll(mapper: Mapper, query: any, opts: any): Promise<R[]>;
    facets(mapper: Mapper, query: any, opts: any): Promise<Facets>;
    afterCount(mapper: Mapper, props: IDict, opts: any, result: any): Promise<number>;
    afterCreate(mapper: Mapper, props: IDict, opts: any, result: any): Promise<R>;
    afterUpdate(mapper: Mapper, id: string | number, props: IDict, opts: any, result: any): Promise<R>;
    protected saveDetailData(method: string, mapper: Mapper, id: string | number, props: any, opts?: any): Promise<boolean>;
    protected _create(mapper: any, props: any, opts: any): Promise<any>;
    protected _count(mapper: any, query: any, opts: any): Promise<any>;
    protected _doActionTag(mapper: Mapper, record: R, actionTagForm: ActionTagForm, opts: any): Promise<any>;
    protected _findAll(mapper: any, query: any, opts: any): Promise<any>;
    protected _facets(mapper: any, query: any, opts: any): Promise<any>;
    protected _update(mapper: any, id: any, props: any, opts: any): Promise<any>;
    deserialize(mapper: Mapper, response: any, opts: any): any;
    getParams(opts: any): any;
    deserializeCommon(mapper: any, response: any, opts: any): any;
    deserializeResponse(mapper: Mapper, response: any, opts: any): any;
    extractCountFromRequestResult(result: any): [number];
    extractRecordsFromRequestResult(mapper: Mapper, result: any, queryData: SelectQueryData): R[];
    extractFacetFromRequestResult(result: any): Facet;
    mapResponseDocument(mapper: Mapper, doc: any, tableConfig: TableConfig): Record;
    mapToAdapterDocument(tableConfig: TableConfig, props: any): any;
    loadDetailData(method: string, mapper: Mapper, params: any, opts: any, records: R[]): Promise<R[]>;
    protected extractTable(params: AdapterQuery): string;
    protected abstract getTableConfig(params: AdapterQuery): TableConfig;
    protected abstract getTableConfigForTableKey(table: string): TableConfig;
    protected abstract getDefaultFacets(): Facets;
    protected getFacetSql(adapterQuery: AdapterQuery, adapterOpts: AdapterOpts): Map<string, string>;
    protected queryTransformToSql(query: SelectQueryData): string;
    protected transformToSqlDialect(sql: string): string;
    protected extractDbResult(dbresult: any): any;
    protected queryTransformToAdapterSelectQuery(method: string, mapper: Mapper, params: any, opts: any): SelectQueryData;
    protected queryTransformToAdapterWriteQuery(method: string, mapper: Mapper, props: any, opts: any): WriteQueryData;
    protected extractSingleElement(values: any): string;
    protected remapFulltextFilter(adapterQuery: AdapterQuery, tableConfig: TableConfig, fulltextFilterName: string, fulltextNewTrigger: string, fulltextNewFilterName: string, fullTextNewAction: string): void;
}
