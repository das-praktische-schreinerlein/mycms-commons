import { ActionTagForm } from '../../commons/utils/actiontag.utils';
import { Mapper } from 'js-data';
import { Adapter } from 'js-data-adapter';
import { Facets } from '../model/container/facets';
import { GenericDataStore } from './generic-data.store';
import { CommonDocRecord } from '../model/records/cdoc-entity-record';
import { CommonDocSearchForm } from '../model/forms/cdoc-searchform';
import { CommonDocSearchResult } from '../model/container/cdoc-searchresult';
import { GenericSearchOptions, GenericSearchService } from './generic-search.service';
import { GenericAdapterResponseMapper } from './generic-adapter-response.mapper';
import { CommonDocSearchService } from './cdoc-search.service';
export declare abstract class CommonDocDataService<R extends CommonDocRecord, F extends CommonDocSearchForm, S extends CommonDocSearchResult<R, F>> {
    protected dataStore: GenericDataStore<R, F, S>;
    protected searchService: CommonDocSearchService<R, F, S>;
    protected responseMapper: GenericAdapterResponseMapper;
    private writable;
    typeMapping: {};
    idMappings: any[];
    idMappingAliases: {};
    constructor(dataStore: GenericDataStore<R, F, S>, searchService: CommonDocSearchService<R, F, S>, responseMapper: GenericAdapterResponseMapper);
    abstract createRecord(props: any, opts: any): R;
    getBaseMapperName(): string;
    isRecordInstanceOf(record: any): boolean;
    newRecord(values: {}): R;
    newSearchForm(values: {}): F;
    newSearchResult(searchForm: F, recordCount: number, currentRecords: R[], facets: Facets): S;
    createSanitizedSearchForm(values: {}): F;
    cloneSanitizedSearchForm(src: F): F;
    getMapper(mapperName: string): Mapper;
    getAdapterForMapper(mapperName: string): Adapter;
    getSearchService(): GenericSearchService<R, F, S>;
    generateNewId(): string;
    createDefaultSearchForm(): F;
    getAll(opts?: any): Promise<R[]>;
    findCurList(searchForm: F, opts?: any): Promise<R[]>;
    doMultiSearch(searchForm: F, ids: string[]): Promise<S>;
    search(searchForm: F, opts?: GenericSearchOptions): Promise<S>;
    getById(id: string, opts?: any): Promise<R>;
    getByIdFromLocalStore(id: string): R;
    clearLocalStore(): void;
    add(values: {}, opts?: any): Promise<R>;
    addMany(docs: R[], opts?: any): Promise<R[]>;
    deleteById(id: string, opts?: any): Promise<R>;
    updateById(id: string, values: {}, opts?: any): Promise<R>;
    doActionTag(docRecord: R, actionTagForm: ActionTagForm, opts?: any): Promise<R>;
    doActionTags(docRecord: R, actionTagForms: ActionTagForm[], opts?: any): Promise<R>;
    importRecord(record: R, recordIdMapping: {}, recordRecoverIdMapping: {}, opts?: any): Promise<R>;
    postProcessImportRecord(record: R, recordIdMapping: {}, recordRecoverIdMapping: {}, opts?: any): Promise<R>;
    setWritable(writable: boolean): void;
    isWritable(): boolean;
    protected doImportActionTags(origRecord: R, newRecord: R, opts?: {}): Promise<R>;
    protected abstract defineDatastoreMapper(): void;
    protected abstract defineIdMappings(): string[];
    protected abstract defineIdMappingAlliases(): {};
    protected abstract defineTypeMappings(): {};
    protected abstract onImportRecordNewRecordProcessDefaults(record: R): void;
    protected abstract addAdditionalActionTagForms(origRecord: R, newRecord: R, actionTagForms: ActionTagForm[]): any;
}
