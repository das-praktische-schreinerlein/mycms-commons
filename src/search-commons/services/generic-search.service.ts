import {GenericDataStore} from './generic-data.store';
import {GenericSearchForm} from '../model/forms/generic-searchform';
import {GenericSearchResult} from '../model/container/generic-searchresult';
import {Mapper, Record} from 'js-data';
import {Adapter} from 'js-data-adapter';
import {Facets} from '../model/container/facets';

export interface GenericSearchOptions {
    showForm: boolean;
    loadTrack: boolean;
    loadDetailsMode?: string;
    showFacets: string[]|boolean;
}

export abstract class GenericSearchService <R extends Record, F extends GenericSearchForm,
    S extends GenericSearchResult<R, F>> {
    protected maxPerRun = 99;
    dataStore: GenericDataStore<R, F, S>;
    searchMapperName: string;

    constructor(dataStore: GenericDataStore<R, F, S>, mapperName: string) {
        this.dataStore = dataStore;
        this.searchMapperName = mapperName;
    }

    public abstract getBaseMapperName(): string;

    public abstract isRecordInstanceOf(record: any): boolean;

    public abstract newRecord(values: {}): R;

    public abstract newSearchForm(values: {}): F;

    public abstract createSanitizedSearchForm(values: {}): F;

    public abstract cloneSanitizedSearchForm(src: F): F;

    public abstract newSearchResult(searchForm: F, recordCount: number,
                                    currentRecords: R[], facets: Facets): S;

    public getMapper(mapperName: string): Mapper {
        return this.dataStore.getMapper(mapperName);
    }

    public getAdapterForMapper(mapperName: string): Adapter {
        return this.dataStore.getAdapterForMapper(mapperName);
    }

    public clearLocalStore(): void {
        this.dataStore.clearLocalStore(this.searchMapperName);
    }

    getAll(opts?: any): Promise<R[]> {
        const allForm = this.createDefaultSearchForm();
        allForm.perPage = -1;
        return this.findCurList(allForm, opts);
    }

    findCurList(searchForm: F, opts?: any): Promise<R[]> {
        // console.log('findCurList for form', searchForm);

        const result = new Promise<R[]>((resolve, reject) => {
            this.search(searchForm, opts).then(function doneSearch(searchResultData: S) {
                    // console.log('findCurList searchResultData', searchResultData);
                    return resolve(<R[]>searchResultData.currentRecords);
                },
                function errorSearch(reason) {
                    console.error('findCurList failed:', reason);
                    return reject(reason);
                });
        });

        return result;
    }

    search(searchForm: F, opts?: GenericSearchOptions): Promise<S> {
        // console.log('search for form', searchForm);
        const searchResultObs = this.dataStore.search(this.searchMapperName, searchForm, opts);

        const me = this;
        const result = new Promise<S>((resolve, reject) => {
            searchResultObs.then(function doneSearch(searchResultData: S) {
                    // console.log('search searchResultData', searchResultData);
                    return resolve(searchResultData);
                },
                function errorSearch(reason) {
                    console.error('search failed:', reason);
                    return reject(reason);
                });
        });

        return result;
    }

    export(searchForm: F, format: string, opts?: GenericSearchOptions): Promise<string> {
        // console.log('export for form', searchForm);
        const exportResultObs = this.dataStore.export(this.searchMapperName, searchForm, format, opts);

        const me = this;
        const result = new Promise<string>((resolve, reject) => {
            exportResultObs.then(function doneExport(exportResultData: string) {
                    // console.log('export exportResultData', exportResultData);
                    return resolve(exportResultData);
                },
                function errorExport(reason) {
                    console.error('export failed:', reason);
                    return reject(reason);
                });
        });

        return result;
    }

    getById(id: string, opts?: any): Promise<R> {
        return this.dataStore.find(this.searchMapperName, id, opts);
    }

    getByIdFromLocalStore(id: string): R {
        return <R>this.dataStore.getFromLocalStore(this.searchMapperName, id);
    }

    sortRecords(records: R[], sortType: string): void {
        throw new Error ('sortRecords not implemented');
    }

    getAvailableSorts(): string[] {
        return ['relevance'];
    }

    abstract doMultiSearch(searchForm: F, ids: string[]): Promise<S>;

    abstract createDefaultSearchForm(): F;
}
