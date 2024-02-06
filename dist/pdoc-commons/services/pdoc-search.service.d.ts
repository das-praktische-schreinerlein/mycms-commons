import { PDocRecord } from '../model/records/pdoc-record';
import { PDocSearchResult } from '../model/container/pdoc-searchresult';
import { PDocSearchForm } from '../model/forms/pdoc-searchform';
import { PDocDataStore } from './pdoc-data.store';
import { Facets } from '../../search-commons/model/container/facets';
import { CommonDocSearchService } from '../../search-commons/services/cdoc-search.service';
export declare class PDocSearchService extends CommonDocSearchService<PDocRecord, PDocSearchForm, PDocSearchResult> {
    constructor(dataStore: PDocDataStore);
    createDefaultSearchForm(): PDocSearchForm;
    getBaseMapperName(): string;
    isRecordInstanceOf(record: any): boolean;
    createRecord(props: any, opts: any): PDocRecord;
    newRecord(values: {}): PDocRecord;
    newSearchForm(values: {}): PDocSearchForm;
    newSearchResult(pdocSearchForm: PDocSearchForm, recordCount: number, currentRecords: PDocRecord[], facets: Facets): PDocSearchResult;
    cloneSanitizedSearchForm(src: PDocSearchForm): PDocSearchForm;
    createSanitizedSearchForm(values: {}): PDocSearchForm;
}
