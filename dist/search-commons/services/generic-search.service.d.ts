import { GenericDataStore } from './generic-data.store';
import { GenericSearchForm } from '../model/forms/generic-searchform';
import { GenericSearchResult } from '../model/container/generic-searchresult';
import { Mapper, Record } from 'js-data';
import { Adapter } from 'js-data-adapter';
import { Facets } from '../model/container/facets';
export interface GenericSearchOptions {
    showForm: boolean;
    loadTrack: boolean;
    loadDetailsMode?: string;
    showFacets: string[] | boolean;
}
export declare abstract class GenericSearchService<R extends Record, F extends GenericSearchForm, S extends GenericSearchResult<R, F>> {
    protected maxPerRun: number;
    dataStore: GenericDataStore<R, F, S>;
    searchMapperName: string;
    constructor(dataStore: GenericDataStore<R, F, S>, mapperName: string);
    abstract getBaseMapperName(): string;
    abstract isRecordInstanceOf(record: any): boolean;
    abstract newRecord(values: {}): R;
    abstract newSearchForm(values: {}): F;
    abstract createSanitizedSearchForm(values: {}): F;
    abstract cloneSanitizedSearchForm(src: F): F;
    abstract newSearchResult(searchForm: F, recordCount: number, currentRecords: R[], facets: Facets): S;
    getMapper(mapperName: string): Mapper;
    getAdapterForMapper(mapperName: string): Adapter;
    clearLocalStore(): void;
    getAll(opts?: any): Promise<R[]>;
    findCurList(searchForm: F, opts?: any): Promise<R[]>;
    search(searchForm: F, opts?: GenericSearchOptions): Promise<S>;
    export(searchForm: F, format: string, opts?: GenericSearchOptions): Promise<string>;
    getById(id: string, opts?: any): Promise<R>;
    getByIdFromLocalStore(id: string): R;
    sortRecords(records: R[], sortType: string): void;
    getAvailableSorts(): string[];
    abstract doMultiSearch(searchForm: F, ids: string[]): Promise<S>;
    abstract createDefaultSearchForm(): F;
}
