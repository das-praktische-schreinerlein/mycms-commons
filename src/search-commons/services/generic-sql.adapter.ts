import {IDict} from 'js-data-http';
import {Mapper, Record, utils} from 'js-data';
import {Facet, Facets} from '../model/container/facets';
import {GenericSearchResult} from '../model/container/generic-searchresult';
import {GenericSearchForm} from '../model/forms/generic-searchform';
import {Adapter} from 'js-data-adapter';
import * as knex from 'knex';
import {GenericFacetAdapter} from './generic-search.adapter';
import {isArray} from 'util';
import {AdapterOpts, AdapterQuery, MapperUtils} from './mapper.utils';
import {GenericAdapterResponseMapper} from './generic-adapter-response.mapper';
import {
    FacetCacheUsageConfigurations,
    SelectQueryData,
    SqlQueryBuilder,
    TableConfig,
    WriteQueryData
} from './sql-query.builder';
import {ActionTagForm} from '../../commons/utils/actiontag.utils';
import {LogUtils} from '../../commons/utils/log.utils';
import {RawSqlQueryData, SqlUtils} from "./sql-utils";

export abstract class GenericSqlAdapter <R extends Record, F extends GenericSearchForm, S extends GenericSearchResult<R, F>>
    extends Adapter implements GenericFacetAdapter<R, F, S> {
    protected knex: any;
    protected mapperUtils = new MapperUtils();
    protected sqlQueryBuilder: SqlQueryBuilder = new SqlQueryBuilder();
    protected mapper: GenericAdapterResponseMapper;
    protected config;
    protected facetCacheConfig: FacetCacheUsageConfigurations;

    constructor(config: any, mapper: GenericAdapterResponseMapper, facetCacheConfig?: FacetCacheUsageConfigurations) {
        super(config);
        this.config = config;
        this.knex = knex(config.knexOpts);
        this.mapper = mapper;
        this.facetCacheConfig = facetCacheConfig;
    }

    create(mapper: Mapper, props: any, opts?: any): Promise<R> {
        props = props || {};
        opts = opts || {};
        return super.create(mapper, props, opts);
    }

    createMany(mapper: Mapper, props: any, opts: any): Promise<R> {
        throw new Error('createMany not implemented');
    }

    destroy(mapper: Mapper, id: string | number, opts?: any): Promise<any> {
        throw new Error('destroy not implemented');
    }

    destroyAll(mapper: Mapper, query: any, opts: any): Promise<any> {
        throw new Error('destroyAll not implemented');
    }

    doActionTag(mapper: Mapper, record: R, actionTagForm: ActionTagForm, opts: any): Promise<R> {
        const adapterQuery: AdapterQuery = {
            loadTrack: false,
            where: {
                id: {
                    'in_number': [actionTagForm.recordId]
                }
            }
        };

        const me = this;
        const result = new Promise<R>((resolve, reject) => {
            me._doActionTag(mapper, record, actionTagForm, opts).then(value => {
                return me._findAll(mapper, adapterQuery, opts);
            }).then(value => {
                const [records] = value;
                if (actionTagForm.deletes === true) {
                    if (records.length === 0) {
                        return resolve(record);
                    }

                    return utils.reject('result record must empty for deleting actionForm:' + records.length + ' for query:' + adapterQuery);
                } else if (records.length === 1) {
                    return resolve(records[0]);
                } else {
                    return utils.reject('records not found or not unique:' + records.length + ' for query:' + adapterQuery);
                }
            }).catch(reason => {
                console.error('doActionTag failed:', reason, actionTagForm);
                return reject(reason);
            });
        });

        return result;
    }

    export(mapper: Mapper, query: any, format: string, opts: any): Promise<string> {
        throw new Error('export not implemented');
    }

    find(mapper: Mapper, id: string | number, opts: any): Promise<R> {
        const adapterQuery: AdapterQuery = {
            loadTrack: false,
            where: {
                id: {
                    'in_number': [id]
                }
            }
        };

        const me = this;
        const result = new Promise<R>((resolve, reject) => {
            me._findAll(mapper, adapterQuery, opts).then(value => {
                const [records] = value;
                if (records.length === 1) {
                    return resolve(records[0]);
                } else {
                    return utils.reject('records not found or not unique:' + records.length + ' for query:' + adapterQuery);
                }
            }).catch(reason => {
                console.error('_find failed:', reason, id, adapterQuery);
                return reject(reason);
            });
        });

        return result;
    }

    sum (mapper: Mapper, field: string, query: any, opts?: any): Promise<any> {
        throw new Error('sum not implemented');
    }

    update(mapper: Mapper, id: string | number, props: any, opts: any): Promise<R> {
        props = props || {};
        opts = opts || {};
        return super.update(mapper, id, props, opts);
    }

    updateAll(mapper: Mapper, props: any, query: any, opts?: any): Promise<any> {
        throw new Error('updateAll not implemented');
    }

    updateMany(mapper: Mapper, records: R[], opts?: any): Promise<any> {
        throw new Error('updateMany not implemented');
    }

    count(mapper: Mapper, query: any, opts?: any): Promise<number> {
        query = query || {};
        opts = opts || {};

        return super.count(mapper, query, opts);
    }

    findAll(mapper: Mapper, query: any, opts: any): Promise<R[]> {
        query = query || {};
        opts = opts || {};

        return super.findAll(mapper, query, opts);
    }

    facets(mapper: Mapper, query: any, opts: any): Promise<Facets> {
        query = query || {};
        opts = opts || {};

        opts.adapterFacet = true;

        return this._facets(mapper, query, opts);
    }

    afterCount(mapper: Mapper, props: IDict, opts: any, result: any): Promise<number> {
        return utils.Promise.resolve(result);
    }

    afterCreate(mapper: Mapper, props: IDict, opts: any, result: any): Promise<R> {
        opts.realResult = result;
        return utils.resolve(result);
    }

    afterUpdate(mapper: Mapper, id: string | number, props: IDict, opts: any, result: any): Promise<R> {
        opts.realResult = result;
        return utils.resolve(result);
    }

    protected saveDetailData(method: string, mapper: Mapper, id: string | number, props: any, opts?: any): Promise<boolean> {
        return utils.resolve(true);
    }

    protected _create(mapper, props, opts): Promise<any> {
        if (opts.realSource) {
            props = opts.realSource;
        }

        props = props || {};
        opts = opts || {};

        const sqlBuilder = utils.isUndefined(opts.transaction)
            ? this.knex
            : opts.transaction;
        const me = this;
        const result: Promise<any> = new Promise((allResolve, allReject) => {
            const writeQuery = me.queryTransformToAdapterWriteQuery('create', mapper, props, opts);
            if (writeQuery) {
                let dbId = undefined;
                const idField = writeQuery.tableConfig.filterMapping['id'];
                sqlBuilder.insert([writeQuery.fields])
                    .into(writeQuery.from)
                    .returning(idField)
                    .then(values => {
                        dbId = values[0];
                        const updateSqlQuery: RawSqlQueryData = this.sqlQueryBuilder.updateChangelogSqlQuery(
                            'create', undefined, undefined, writeQuery.tableConfig.changelogConfig, dbId);
                        if (updateSqlQuery) {
                            return SqlUtils.executeRawSqlQueryData(sqlBuilder, updateSqlQuery);
                        }

                        return Promise.resolve(true);
                    }).then(done => {
                        return me.saveDetailData('create', mapper, dbId, props, opts);
                    }).then(done => {
                        const query = {
                            where: {
                                type_ss: {
                                    'in': [props.type.toLowerCase()]
                                }
                            }
                        };
                        query['where'][idField] = { 'in' : [dbId]};

                        return me.findAll(mapper, query, opts);
                    }).then(searchResult => {
                        if (!searchResult || searchResult.length !== 1) {
                            return allResolve(undefined);
                        }

                        return allResolve([searchResult[0]]);
                    }).catch(function errorSearch(reason) {
                        console.error('_create failed:', reason, writeQuery);

                        return allReject(reason);
                    });
            } else {
                return allReject('no query generated for props:' + props);
            }
        });

        return result;
    }

    protected _count(mapper, query, opts) {
        query = query || {};
        opts = opts || {};
        opts.query = opts.query || query;

        opts.adapterQuery = true;
        const me = this;
        const queryData = me.queryTransformToAdapterSelectQuery('count', mapper, query, opts);
        if (queryData === undefined) {
            console.error('something went wrong - got no query for count', query);
            return utils.reject('something went wrong - got no query for count');
        }
        opts.queryData = queryData;

        const sqlBuilder = utils.isUndefined(opts.transaction)
            ? this.knex
            : opts.transaction;
        const sql = this.queryTransformToSql(queryData);
        // for debug only: const start = (new Date()).getTime();
        const raw = sqlBuilder.raw(sql);
        const result = new Promise((resolve, reject) => {
            raw.then(function doneSearch(dbresults: any) {
                // for debug only: console.error("sql _count: " + ((new Date()).getTime() - start), sql);  // TODO SQL
                const response = me.extractDbResult(dbresults);
                const count = me.extractCountFromRequestResult(response);
                return resolve(count);
            }).catch(function errorSearch(reason) {
                console.error('_count failed:', reason, sql, queryData, query);
                return reject(reason);
            });
        });

        return result;
    }

    protected _doActionTag(mapper: Mapper, record: R, actionTagForm: ActionTagForm, opts: any): Promise<any> {
        const tableConfig = this.getTableConfigForTableKey((record['type'] + '').toLowerCase());
        if (tableConfig === undefined) {
            return utils.reject('no table for actiontag:' + LogUtils.sanitizeLogMsg(actionTagForm.key));
        }
        if (tableConfig.actionTags === undefined || tableConfig.actionTags[actionTagForm.key] === undefined) {
            return utils.reject('no actionConfig for actiontag:' + LogUtils.sanitizeLogMsg(actionTagForm.key));
        }

        return utils.resolve(true);
    }

    protected _findAll(mapper, query, opts) {
        query = query || {};
        opts = opts || {};
        opts.query = opts.query || query;

        opts.adapterQuery = true;
        const me = this;
        const queryData = me.queryTransformToAdapterSelectQuery('findAll', mapper, query, opts);
        if (queryData === undefined) {
            console.error('something went wrong - got no query for findAll', query);
            return utils.reject('something went wrong - got no query for findAll');
        }
        opts.queryData = queryData;

        const sqlBuilder = utils.isUndefined(opts.transaction)
            ? this.knex
            : opts.transaction;
        const sql = this.queryTransformToSql(queryData);
        // for debug only: const start = (new Date()).getTime();
        const raw = sqlBuilder.raw(sql);
        const result = new Promise((resolve, reject) => {
            raw.then(function doneSearch(dbresults: any) {
                // for debug only: console.error("sql _findAll: " + ((new Date()).getTime() - start), sql);  // TODO SQL
                const response = me.extractDbResult(dbresults);
                const records: R[] = me.extractRecordsFromRequestResult(mapper, response, queryData);
                return utils.resolve(records);
            }).then(function doneSearch(records: R[]) {
                return me.loadDetailData('findAll', mapper, query, opts, records);
            }).then(function doneSearch(records: R[]) {
                return resolve([records]);
            }).catch(function errorSearch(reason) {
                console.error('_findAll failed:', reason, sql, queryData, query);
                return reject(reason);
            });
        });

        return result;
    }

    protected _facets(mapper, query, opts) {
        query = query || {};
        opts = opts || {};
        opts.query = opts.query || query;

        // init data with dummy-query
        opts.adapterQuery = true;
        const me = this;
        const queryData = me.queryTransformToAdapterSelectQuery('findAll', mapper, query, opts);
        if (queryData === undefined) {
            return utils.resolve(this.getDefaultFacets());
        }
        opts.query = queryData;

        const tableConfig = this.getTableConfig(<AdapterQuery>query);
        const facetConfigs = tableConfig.facetConfigs;
        const sqlBuilder = utils.isUndefined(opts.transaction)
            ? this.knex
            : opts.transaction;
        const result = new Promise((allResolve, allReject) => {
            const queries = me.getFacetSql(<AdapterQuery>query, <AdapterOpts>opts);
            const promises = [];
            queries.forEach((value, key) => {
                const sql = this.transformToSqlDialect(value);
                const raw = sqlBuilder.raw(sql);
                // for debug only: const start = (new Date()).getTime();
                promises.push(new Promise((resolve, reject) => {
                    raw.then(function doneSearch(dbresults: any) {
                        // for debug only: console.error("sql _facets: " + ((new Date()).getTime() - start), sql);  // TODO SQL
                        const response = me.extractDbResult(dbresults);
                        let facet: Facet = me.extractFacetFromRequestResult(response);
                        if (!facet) {
                            facet = new Facet();
                        }
                        if (facetConfigs[key] && facetConfigs[key].selectLimit > 0) {
                            facet.selectLimit = facetConfigs[key].selectLimit;
                        }

                        return resolve([key, facet]);
                    },
                    function errorSearch(reason) {
                        console.error('_facets failed:', reason, sql);

                        return reject(reason);
                    });
                }));
            });

            return Promise.all(promises).then(function doneSearch(facetResults: any[]) {
                    const facets = new Facets();
                    facetResults.forEach(facet => {
                        facets.facets.set(facet[0], facet[1]);
                    });

                    const sortFacet = new Facet();
                    sortFacet.facet = [];
                    for (const sortKey in tableConfig.sortMapping) {
                        // ignore distance if configured but no spatial query
                        if (!me.sqlQueryBuilder.isSpatialQuery(tableConfig, <AdapterQuery>query) &&
                            tableConfig.spartialConfig !== undefined && tableConfig.spartialConfig.spatialSortKey === sortKey) {
                            continue;
                        }
                        sortFacet.facet.push([sortKey, 0]);
                    }
                    facets.facets.set('sorts', sortFacet);

                    return allResolve(facets);
                }).catch(function errorSearch(reason) {
                    console.error('_facets failed:', reason, queryData);
                    return allReject(reason);
                });
        });

        return result;
    }

    protected _update(mapper, id, props, opts): Promise<any> {
        if (opts.realSource) {
            props = opts.realSource;
        }

        props = props || {};
        opts = opts || {};
        const sqlBuilder = utils.isUndefined(opts.transaction)
            ? this.knex
            : opts.transaction;
        const me = this;
        const result: Promise<any> = new Promise((allResolve, allReject) => {
            const writeQuery = me.queryTransformToAdapterWriteQuery('update', mapper, props, opts);
            if (writeQuery) {
                const dbId  = this.mapperUtils.prepareSingleValue(id, '_').replace(/.*_/g, '');
                const idField = writeQuery.tableConfig.filterMapping['id'];
                sqlBuilder.update(writeQuery.fields)
                    .table(writeQuery.from)
                    .where(idField, dbId)
                    .returning(idField)
                    .then(values => {
                        const updateSqlQuery: RawSqlQueryData = this.sqlQueryBuilder.updateChangelogSqlQuery(
                            'update', undefined, undefined, writeQuery.tableConfig.changelogConfig, dbId);
                        if (updateSqlQuery) {
                            return SqlUtils.executeRawSqlQueryData(sqlBuilder, updateSqlQuery);
                        }

                        return Promise.resolve(true);
                    }).then(done => {
                        return me.saveDetailData('update', mapper, dbId, props, opts);
                    }).then(done => {
                        const query = {
                            where: {
                                type_ss: {
                                    'in': [props.type.toLowerCase()]
                                }
                            }
                        };
                        query['where'][idField] = { 'in' : [dbId]};

                        return me._findAll(mapper, query, opts);
                    }).then(findResult => {
                        const [searchResult] = findResult;
                        if (!searchResult || searchResult.length !== 1) {
                            return allResolve(undefined);
                        }

                        return allResolve([searchResult[0]]);
                    }).catch(function errorSearch(reason) {
                        console.error('_update failed:', reason, id);
                        return allReject(reason);
                    });
            } else {
                return allReject('no query generated for props:' + props);
            }
        });

        return result;
    }

    deserialize(mapper: Mapper, response: any, opts: any) {
        if (opts.adapterQuery) {
            if (response && (typeof response.data === 'string') && response.data.startsWith('JSONP_CALLBACK(')) {
                const json = response.data.substring('JSONP_CALLBACK('.length, response.data.length - 2);
                response.data = JSON.parse(json);
            }

            return this.deserializeResponse(mapper, response, opts);
        }

        // do default behavior
        return this.deserializeCommon(mapper, response, opts);
    }

    getParams(opts) {
        opts = opts || {};
        if (opts.params === undefined) {
            return {};
        }
        return utils.copy(opts.params);
    }

    deserializeCommon(mapper, response, opts): any {
        opts = opts || {};
        if (utils.isFunction(opts.deserialize)) {
            return opts.deserialize(mapper, response, opts);
        }
        if (utils.isFunction(mapper.deserialize)) {
            return mapper.deserialize(mapper, response, opts);
        }
        if (response && response.hasOwnProperty('data')) {
            return response.data;
        }
        return response;
    }

    deserializeResponse(mapper: Mapper, response: any, opts: any) {
        // console.log('deserializeResponse:', response);

        // check response
        if (response === undefined) {
            return this.deserializeCommon(mapper, response, opts);
        }
        if (response.data === undefined) {
            return this.deserializeCommon(mapper, response, opts);
        }

        // count
        if (opts.adapterCount) {
            return this.extractCountFromRequestResult(response.data);
        }

        // facet
        if (opts.adapterFacet) {
            return this.extractFacetFromRequestResult(response.data);
        }

        return this.extractRecordsFromRequestResult(mapper, response.data, <SelectQueryData>opts.queryData);

    }

    extractCountFromRequestResult(result: any): [number] {
        const docs: any[] = result;
        if (docs.length === 1) {
            for (const fieldName of Object.getOwnPropertyNames(docs[0])) {
                if (fieldName.startsWith('COUNT(')) {
                    return [docs[0][fieldName]];
                }
            }
        }

        return [0];
    }

    extractRecordsFromRequestResult(mapper: Mapper, result: any, queryData: SelectQueryData): R[] {
        if (!isArray(result)) {
            return [];
        }

        // got documents
        const docs = result;
        const records = [];
        for (const doc of docs) {
            records.push(this.mapResponseDocument(mapper, doc, queryData.tableConfig));
        }

        return records;
    }

    extractFacetFromRequestResult(result: any): Facet {
        if (!isArray(result)) {
            return undefined;
        }

        // got documents
        const values = [];
        const facet = new Facet();
        for (const doc of result) {
            const facetValue = [doc['value'] + '', doc['count']];
            if (doc['label'] || doc['id']) {
                facetValue.push(doc['label']);
                facetValue.push(doc['id']);
            }
            values.push(facetValue);
        }
        facet.facet = values;

        return facet;
    }


    mapResponseDocument(mapper: Mapper, doc: any, tableConfig: TableConfig): Record {
        return this.mapper.mapResponseDocument(mapper, doc, tableConfig.fieldMapping);
    }

    mapToAdapterDocument(tableConfig: TableConfig, props: any): any {
        return this.mapper.mapToAdapterDocument(tableConfig.fieldMapping, props);
    }

    loadDetailData(method: string, mapper: Mapper, params: any, opts: any, records: R[]): Promise<R[]> {
        const tableConfig = this.getTableConfig(<AdapterQuery>params);
        const loadDetailDataConfigs = tableConfig.loadDetailData;
        if (loadDetailDataConfigs === undefined || loadDetailDataConfigs.length <= 0 || records.length <= 0) {
            return utils.resolve(records);
        }

        const me = this;
        const sqlBuilder = utils.isUndefined(opts.transaction)
            ? this.knex
            : opts.transaction;
        const result: Promise<R[]> = new Promise((allResolve, allReject) => {
            const promises = [];
            records.forEach(record => {
                loadDetailDataConfigs.forEach((loadDetailDataConfig) => {
                    if (loadDetailDataConfig.modes) {
                        if (opts &&  opts.loadDetailsMode && loadDetailDataConfig.modes.indexOf(opts.loadDetailsMode) < 0) {
                            // mode not set on options
                            return;
                        }

                        if (!opts || !opts.loadDetailsMode) {
                            // mode required but no mode set on options
                            console.log("no loadDetailsMode but loadDetailDataConfig", method, tableConfig.key, loadDetailDataConfig.profile, loadDetailDataConfig.modes, params);
                        }
                    }

                    let sql = this.transformToSqlDialect(loadDetailDataConfig.sql);
                    loadDetailDataConfig.parameterNames.forEach(parameterName => {
                        let value = this.mapperUtils.prepareSingleValue(record[parameterName], '_');
                        if (value !== undefined && parameterName === 'id') {
                            value = value.replace(/.*_/g, '');
                        }
                        sql = sql.replace(new RegExp(':' + parameterName, 'g'), value);
                    });
                    const raw = sqlBuilder.raw(sql);
                    // for debug only: const start = (new Date()).getTime();
                    promises.push(new Promise((resolve, reject) => {
                        raw.then(function doneSearch(dbresults: any) {
                                // for debug only: console.error("sql loadDetailData: " + ((new Date()).getTime() - start), sql);  // TODO SQL
                            const response = me.extractDbResult(dbresults);
                            return resolve([loadDetailDataConfig.profile, record, response]);
                        },
                        function errorSearch(reason) {
                            console.error('loadDetailData failed:', reason);

                            return reject(reason);
                        });
                    }));
                });
            });

            return Promise.all(promises).then(function doneSearch(loadDetailsResults: any[]) {
                loadDetailsResults.forEach(loadDetailsResult => {
                    const [profile, record, dbresults] = loadDetailsResult;
                    me.mapper.mapDetailResponseDocuments(mapper, profile, record, dbresults);
                });
                return allResolve(records);
            }).catch(function errorSearch(reason) {
                console.error('loadDetailData failed:', reason);
                return allReject(reason);
            });
        });

        return result;
    }

    protected extractTable(params: AdapterQuery): string {
        if (params.where === undefined) {
            return undefined;
        }

        let tabKey;
        const types = params.where['type_ss'];
        if (types !== undefined && types.in !== undefined) {
            tabKey = this.extractSingleElement(types.in);
            if (tabKey !== undefined) {
                tabKey = tabKey.toLocaleLowerCase();
                if (this.getTableConfigForTableKey(tabKey) !== undefined) {
                    return tabKey;
                }

                return undefined;
            }
        }

        const ids = params.where['id'];
        if (ids !== undefined) {
            tabKey = this.extractSingleElement(ids.in_number);
            if (tabKey !== undefined) {
                tabKey = tabKey.replace(/_.*/g, '').toLocaleLowerCase()
                if (this.getTableConfigForTableKey(tabKey) !== undefined) {
                    return tabKey;
                }

                return undefined;
            }

            tabKey = this.extractSingleElement(ids.in);
            if (tabKey !== undefined) {
                tabKey = tabKey.replace(/_.*/g, '').toLocaleLowerCase()
                if (this.getTableConfigForTableKey(tabKey) !== undefined) {
                    return tabKey;
                }

                return undefined;
            }
        }

        return undefined;
    }

    protected abstract getTableConfig(params: AdapterQuery): TableConfig;

    protected abstract getTableConfigForTableKey(table: string): TableConfig;

    protected abstract getDefaultFacets(): Facets;

    protected getFacetSql(adapterQuery: AdapterQuery, adapterOpts: AdapterOpts): Map<string, string> {
        const tableConfig = this.getTableConfig(adapterQuery);
        if (tableConfig === undefined) {
            return undefined;
        }

        return this.sqlQueryBuilder.getFacetSql(tableConfig, this.facetCacheConfig, adapterOpts);
    }

    protected queryTransformToSql(query: SelectQueryData): string {
        let  sql = this.sqlQueryBuilder.selectQueryTransformToSql(query);
        sql = this.transformToSqlDialect(sql);
        return sql;
    }

    protected transformToSqlDialect(sql: string): string {
        return this.sqlQueryBuilder.transformToSqlDialect(sql, this.config.knexOpts.client);
    }

    protected extractDbResult(dbresult: any): any {
        return this.sqlQueryBuilder.extractDbResult(dbresult, this.config.knexOpts.client);
    }

    protected queryTransformToAdapterSelectQuery(method: string, mapper: Mapper, params: any, opts: any): SelectQueryData {
        const tableConfig = this.getTableConfig(<AdapterQuery>params);
        if (tableConfig === undefined) {
            return undefined;
        }

        return this.sqlQueryBuilder.queryTransformToAdapterSelectQuery(tableConfig, method, <AdapterQuery>params, <AdapterOpts>opts);
    }

    protected queryTransformToAdapterWriteQuery(method: string, mapper: Mapper, props: any, opts: any): WriteQueryData {
        if (props.type === undefined) {
            return undefined;
        }

        const tableKey = props.type.toLowerCase();
        const tableConfig = this.getTableConfigForTableKey(tableKey);
        if (tableConfig === undefined) {
            return undefined;
        }

        const mappedProps = this.mapToAdapterDocument(tableConfig, props);

        return this.sqlQueryBuilder.queryTransformToAdapterWriteQuery(tableConfig, method, mappedProps, <AdapterOpts>opts);
    }

    protected extractSingleElement(values: any): string {
        if (values === undefined) {
            return undefined;
        }

        if (!Array.isArray(values)) {
            return values;
        }

        if (values.length === 1) {
            return values[0];
        }

        const realValues = [];
        values.map(value => {
            if (value !== undefined && value.trim().length > 0) {
                realValues.push(value.trim());
            }
        })
        if (realValues.length === 1) {
            return realValues[0];
        }

        return undefined;
    }

    protected remapFulltextFilter(adapterQuery: AdapterQuery, tableConfig: TableConfig, fulltextFilterName: string,
                                  fulltextNewTrigger: string, fulltextNewFilterName: string, fullTextNewAction: string) {
        if (adapterQuery.where && adapterQuery.where[fulltextFilterName] &&
            tableConfig.filterMapping.hasOwnProperty(fulltextNewFilterName)) {
            const filter = adapterQuery.where[fulltextFilterName];
            const action = Object.getOwnPropertyNames(filter)[0];
            const value: string[] = adapterQuery.where[fulltextFilterName][action];

            if (value.join(' ')
                .includes(fulltextNewTrigger)) {

                const fulltextValues = [];
                adapterQuery.where[fulltextNewFilterName] = [];
                for (let fulltextValue of value) {
                    fulltextValue = fulltextValue.split(fulltextNewTrigger)
                        .join('')
                        .trim();
                    if (fulltextValue && fulltextValue.length > 0) {
                        fulltextValues.push(fulltextValue);
                    }
                }

                adapterQuery.where[fulltextNewFilterName] = {};
                adapterQuery.where[fulltextNewFilterName][fullTextNewAction] = fulltextValues;

                adapterQuery.where[fulltextFilterName] = undefined;
                delete adapterQuery.where[fulltextFilterName];
            }
        }
    }
}

