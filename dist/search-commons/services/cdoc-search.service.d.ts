import { GenericSearchService } from './generic-search.service';
import { CommonDocRecord } from '../model/records/cdoc-entity-record';
import { CommonDocSearchForm } from '../model/forms/cdoc-searchform';
import { CommonDocSearchResult } from '../model/container/cdoc-searchresult';
import { GenericDataStore } from './generic-data.store';
export declare abstract class CommonDocSearchService<R extends CommonDocRecord, F extends CommonDocSearchForm, S extends CommonDocSearchResult<R, F>> extends GenericSearchService<R, F, S> {
    protected constructor(dataStore: GenericDataStore<R, F, S>, mapperName: string);
    doMultiSearch(searchForm: F, ids: string[]): Promise<S>;
    sortRecords(records: R[], sortType: string): void;
    getAvailableSorts(): string[];
}
