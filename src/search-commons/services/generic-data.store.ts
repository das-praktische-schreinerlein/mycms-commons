// DataStore is mostly recommended for use in the browser
import {DataStore, Mapper, Record, Schema, utils} from 'js-data';
import {Adapter} from 'js-data-adapter';
import {Facets} from '../model/container/facets';
import {GenericSearchResult} from '../model/container/generic-searchresult';
import {GenericSearchForm} from '../model/forms/generic-searchform';
import {GenericActionTagAdapter, GenericFacetAdapter, GenericSearchAdapter} from './generic-search.adapter';
import {ActionTagForm} from '../../commons/utils/actiontag.utils';

export abstract class GenericDataStore <R extends Record, F extends GenericSearchForm,
    S extends GenericSearchResult<R, F>> {

    private store: DataStore;
    private mappers = new Map<string, Mapper>();
    private mapperAdapters = new Map<string, Adapter>();

    public static convertToDate(record) {
        if (typeof record.created_at === 'string') {
            record.created_at = new Date(record.created_at);
        }
        if (typeof record.updated_at === 'string') {
            record.updated_at = new Date(record.updated_at);
        }
    }

    constructor(private updateRelations: string[]) {
        const me = this;
        this.store = new DataStore({
            usePendingFindAll: false,
            usePendingFind: false,
            cachedFind: function(mapperName, id, opts) {
                // disabled js-data-cache in generic-datastore because of exception: "replace not found" if where has array instead of string
                return;
            },
            cachedFindAll: function(mapperName, hash, opts) {
                // disabled js-data-cache in generic-datastore because of exception: "replace not found" if where has array instead of string
                return;
            },
            addToCache: function(name_: string, data: any, opts: any) {
                // disabled js-data-cache in generic-datastore because of objects with different loadDetailsProfiles loaded
                return data;
            },
            mapperDefaults: {
                // Override the original to make sure the date properties are actually Date
                // objects
                createRecord (props, opts) {
                    let result = undefined;
                    for (const key in props) {
                        if (props.hasOwnProperty(key) && props[key] === null) {
                            props[key] = undefined;
                        }
                    }

                    try {
                        result = this.constructor.prototype.createRecord.call(this, props, opts);
                    } catch (err) {
                        // console.error('validation failed for', props);
                        console.log('validation errors', err.errors);
                        throw err;
                    }
                    /**                    if (Array.isArray(result)) {
                        result.forEach(this.convertToDate);
                    } else if (this.is(result)) {
                        GenericDataStore.convertToDate(result);
                    }
                     **/
                    return result;
                },
                beforeCreate(props: any, opts: any) {
                    opts.realSource = props;
                    return utils.resolve(props);
                },
                afterCreate(props: any, opts: any, result: any): Promise<R> {
                    if (opts.realResult) {
                        result = opts.realResult;
                    }
                    return utils.resolve(result);
                },
                beforeUpdate(id: any, props: any, opts: any) {
                    opts.realSource = props;
                    return utils.resolve(props);
                },
                afterUpdate(id: any, props: any, opts: any, result: any): Promise<R> {
                    if (opts.realResult) {
                        result = opts.realResult;
                    }

                    // update relations
                    for (const mapperKey of me.updateRelations) {
                        if (result.get(mapperKey)) {
                            const obj = result.get(mapperKey);
                            me.store.add(mapperKey, obj);
                            result.set(mapperKey, obj);
                        } else {
                            me.store.removeAll(mapperKey, { where: { 'cdoc_id': { 'contains': result.id }}});
                            me.store.removeAll(mapperKey, { where: { ['cdoc_id']: { 'contains': [result.id] }}});
                            me.store.removeAll(mapperKey, { where: { 'cdoc_id': { 'contains': [result.id] }}});
                            result.set(mapperKey, undefined);
                        }
                    }

                    return utils.resolve(result);
                }
            }
        });
    }

    public defineMapper(mapperName: string, recordClass: any, schema: Schema, relations: any): Mapper {
        this.mappers.set(mapperName, this.store.defineMapper(mapperName, {
            recordClass: recordClass,
            applySchema: true,
            schema: schema,
            relations: relations
        }));
        return this.mappers.get(mapperName);
    }

    public setAdapter(adapterName: string, adapter: Adapter, mapperName: string, options: any) {
        if (mapperName === undefined || mapperName === '') {
            this.store.registerAdapter(adapterName, adapter, { 'default': true });
            this.mapperAdapters.set('', adapter);
        } else {
            this.mappers.get(mapperName).registerAdapter(adapterName, adapter, { 'default': true });
            this.mapperAdapters.set(mapperName, adapter);
        }
    }

    public count(mapperName: string, query?: any, opts?: any): Promise<number> {
        if (this.getAdapterForMapper(mapperName) === undefined || (opts && opts.forceLocalStore)) {
            return utils.Promise.resolve(this.store.filter(mapperName, query).length);
        } else {
            return this.getAdapterForMapper(mapperName).count(this.store.getMapper(mapperName), query, opts);
        }
    }

    public createRecord(mapperName: string, props, opts): R {
        return <R>this.store.createRecord(mapperName, props, opts);
    }

    public create(mapperName: string, record: any, opts?: any): Promise<R> {
        if (this.getAdapterForMapper(mapperName) === undefined || (opts && opts.forceLocalStore)) {
            return utils.Promise.resolve(this.store.add(mapperName, record, opts));
        } else {
            return this.store.create(mapperName, record, opts);
        }
    }

    public createMany(mapperName: string, records: any[], opts?: any): Promise<R[]> {
        if (this.getAdapterForMapper(mapperName) === undefined || (opts && opts.forceLocalStore)) {
            return utils.Promise.resolve(this.store.add(mapperName, records, opts));
        } else {
            return this.store.createMany(mapperName, records, opts);
        }
    }

    public destroy(mapperName: string, id: any, opts?: any): Promise<R> {
        if (this.getAdapterForMapper(mapperName) === undefined || (opts && opts.forceLocalStore)) {
            return utils.Promise.resolve(this.store.remove(mapperName, id, opts));
        } else {
            return this.store.destroy(mapperName, id, opts);
        }
    }

    public doActionTag(mapperName: string, record: R, actionTagForm: ActionTagForm, opts?: any): Promise<R> {
        const me = this;
        const result = new Promise<R>((resolve, reject) => {
            if (this.getAdapterForMapper(mapperName) === undefined ||
                (typeof me.getAdapterForMapper(mapperName)['doActionTag'] !== 'function')) {
                return reject('doActionTag not supported');
            } else {
                const mapper = this.store.getMapper(mapperName);
                const adapter: any = me.getAdapterForMapper(mapperName);
                me.store.remove(mapperName, record['id']);
                (<GenericActionTagAdapter<R, F, S>>adapter).doActionTag(mapper, record, actionTagForm, opts)
                    .then(function doneActionTag(genericResult: R) {
                        return resolve(genericResult);
                    }).catch(function errorHandling(reason) {
                    console.error('doActionTag failed:', reason, actionTagForm);
                    return reject(reason);
                });
            }
        });

        return result;
    }


    public clearLocalStore(mapperName: string): void {
        this.store.removeAll(mapperName);
    }

    public facets(mapperName: string, query?: any, opts?: any): Promise<Facets> {
        if (this.getAdapterForMapper(mapperName) === undefined ||
            (typeof this.getAdapterForMapper(mapperName)['facets'] !== 'function') ||
            (opts && opts.forceLocalStore)) {
            return utils.Promise.resolve(undefined);
        } else {
            opts = opts || {};

            // bypass cache
            opts.force = true;

            const mapper = this.store.getMapper(mapperName);
            const adapter: any = this.getAdapterForMapper(mapperName);
            return (<GenericFacetAdapter<R, F, S>>adapter).facets(mapper, query, opts);
        }
    }

    public getFromLocalStore(mapperName: string, id: any): R {
        return this.store.get(mapperName, id);
    }

    public find(mapperName: string, id: any, opts?: any): Promise<R> {
        if (this.getAdapterForMapper(mapperName) === undefined || (opts && opts.forceLocalStore)) {
            return utils.Promise.resolve(this.store.get(mapperName, id));
        } else {
            return this.store.find(mapperName, id, opts);
        }
    }

    public findAll(mapperName: string, query?: any, opts?: any): Promise<R[]> {
        if (this.getAdapterForMapper(mapperName) === undefined || (opts && opts.forceLocalStore)) {
            return utils.Promise.resolve(this.store.filter(mapperName, query));
        } else {
            opts = opts || {};

            // bypass cache
            opts.force = true;
            return this.store.findAll(mapperName, query, opts);
        }
    }

    public search(mapperName: string, searchForm: F, opts?: any): Promise<S> {
        const query = this.createQueryFromForm(searchForm);

        // console.log('search for form', searchForm);
        const searchResult = this.createSearchResult(searchForm, 0, [], new Facets());

        const me = this;
        const result = new Promise<S>((resolve, reject) => {
            const options = {
                originalSearchForm: searchForm,
                showFacets: opts && opts['showFacets'] !== undefined ? opts['showFacets'] : true,
                loadTrack: opts && opts['loadTrack'] !== undefined ? opts['loadTrack'] : false,
                showForm: opts && opts['showForm'] !== undefined ? opts['showForm'] : true,
                loadDetailsMode: (opts && opts['loadDetailsMode'] !== undefined) ? opts['loadDetailsMode'] : undefined,
                force: false,
                limit: searchForm.perPage,
                offset: searchForm.pageNum - 1,
                // We want the newest posts first
                orderBy: [['created_at', 'descTxt', 'descHtml', 'descMd']]
            };
            if (this.getAdapterForMapper(mapperName) === undefined ||
                (typeof me.getAdapterForMapper(mapperName)['search'] !== 'function') ||
                (opts && opts.forceLocalStore)) {
                // the resolve / reject functions control the fate of the promise
                me.findAll(mapperName, query, options).then(function doneFindAll(documents: R[]) {
                    searchResult.currentRecords = documents;
                    return me.count(mapperName, query, options);
                }).then(function doneCount(count: number) {
                    searchResult.recordCount = count;
                    return me.facets(mapperName, query, options);
                }).then(function doneFacets(facets: Facets) {
                    searchResult.facets = facets;
                    return resolve(searchResult);
                }).catch(function errorHandling(reason) {
                    console.error('search failed:', reason, searchForm);
                    return reject(reason);
                });
            } else {
                opts = opts || {};
                options.force = true;

                const mapper = this.store.getMapper(mapperName);
                const adapter: any = me.getAdapterForMapper(mapperName);
                (<GenericSearchAdapter<R, F, S>>adapter).search(mapper, query, options)
                    .then(function doneSearch(genericSearchResult: S) {
                    searchResult.facets = genericSearchResult.facets;
                    searchResult.currentRecords = genericSearchResult.currentRecords;
                    searchResult.recordCount = genericSearchResult.recordCount;
                    return resolve(searchResult);
                }).catch(function errorHandling(reason) {
                    console.error('search failed:', reason, searchForm);
                    return reject(reason);
                });
            }
        });

        return result;
    }

    public export(mapperName: string, searchForm: F, format: string, opts?: any): Promise<string> {
        const query = this.createQueryFromForm(searchForm);

        // console.log('export for form', searchForm);

        const me = this;
        const result = new Promise<string>((resolve, reject) => {
            const options = {
                originalSearchForm: searchForm
            };
            if (this.getAdapterForMapper(mapperName) === undefined ||
                (typeof me.getAdapterForMapper(mapperName)['export'] !== 'function') ||
                (opts && opts.forceLocalStore)) {
                // the resolve / reject functions control the fate of the promise
                const reason = 'export not supported';
                console.error('export failed:', reason, searchForm);
                return reject(reason);
            } else {
                opts = opts || {};
                const mapper = this.store.getMapper(mapperName);
                const adapter: any = me.getAdapterForMapper(mapperName);
                (<GenericSearchAdapter<R, F, S>>adapter).export(mapper, query, format, options)
                    .then(function doneExport(genericExportResult: string) {
                        return resolve(genericExportResult);
                    }).catch(function errorHandling(reason) {
                    console.error('export failed:', reason, searchForm);
                    return reject(reason);
                });
            }
        });

        return result;
    }

    public update(mapperName: string, id: string | number, record: any, opts?: any): Promise<R> {
        if (this.getAdapterForMapper(mapperName) === undefined || (opts && opts.forceLocalStore)) {
            if (id === undefined || id === null) {
                return utils.Promise.reject('cant update records without id');
            }
            const readRecord: any = this.store.get(mapperName, id);
            if (readRecord === undefined || readRecord === null) {
                return utils.Promise.resolve(null);
            }

            record.id = id;
            return utils.Promise.resolve(this.store.add(mapperName, record, opts));
        } else {
            return this.store.update(mapperName, id, record, opts);
        }
    }


    public updateAll(mapperName: string, props: any, query?: any, opts?: any): Promise<R[]> {
        if (this.getAdapterForMapper(mapperName) === undefined || (opts && opts.forceLocalStore)) {
            return utils.Promise.reject('cant do update all without adapter');
        } else {
            return this.store.updateAll(mapperName, props, query, opts);
        }
    }

    public updateMany(mapperName: string, records: any[], opts?: any): Promise<R[]> {
        if (this.getAdapterForMapper(mapperName) === undefined || (opts && opts.forceLocalStore)) {
            return utils.Promise.reject('cant do update many without adapter');
        } else {
            return this.store.updateMany(mapperName, records, opts);
        }
    }

    abstract createQueryFromForm(searchForm: F): Object;

    abstract createSearchResult(searchForm: F, recordCount: number, records: R[], facets: Facets): S;

    public getMapper(mapperName: string): Mapper {
        return this.mappers.get(mapperName);
    }

    public getAdapterForMapper(mapperName: string): Adapter {
        if (this.mapperAdapters.get(mapperName) !== undefined) {
            return this.mapperAdapters.get(mapperName);
        }

        return this.mapperAdapters.get('');
    }
}
