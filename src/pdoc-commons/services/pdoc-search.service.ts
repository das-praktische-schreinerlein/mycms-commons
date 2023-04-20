import {PDocRecord} from '../model/records/pdoc-record';
import {PDocSearchResult} from '../model/container/pdoc-searchresult';
import {PDocSearchForm, PDocSearchFormFactory} from '../model/forms/pdoc-searchform';
import {PDocDataStore} from './pdoc-data.store';
import {Facets} from '../../search-commons/model/container/facets';
import {CommonDocSearchService} from "../../search-commons/services/cdoc-search.service";

export class PDocSearchService extends CommonDocSearchService<PDocRecord, PDocSearchForm, PDocSearchResult> {
    constructor(dataStore: PDocDataStore) {
        super(dataStore, 'pdoc');
    }

    createDefaultSearchForm(): PDocSearchForm {
        return new PDocSearchForm({ pageNum: 1, perPage: 10});
    }

    public getBaseMapperName(): string {
        return 'pdoc';
    }

    public isRecordInstanceOf(record: any): boolean {
        return record instanceof PDocRecord;
    }

    public createRecord(props, opts): PDocRecord {
        return this.dataStore.createRecord(this.getBaseMapperName(), props, opts);
    }

    public newRecord(values: {}): PDocRecord {
        return new PDocRecord(values);
    }

    public newSearchForm(values: {}): PDocSearchForm {
        return new PDocSearchForm(values);
    }

    public newSearchResult(pdocSearchForm: PDocSearchForm, recordCount: number,
                           currentRecords: PDocRecord[], facets: Facets): PDocSearchResult {
        return new PDocSearchResult(pdocSearchForm, recordCount, currentRecords, facets);
    }

    public cloneSanitizedSearchForm(src: PDocSearchForm): PDocSearchForm {
        return PDocSearchFormFactory.cloneSanitized(src);
    }

    public createSanitizedSearchForm(values: {}): PDocSearchForm {
        return PDocSearchFormFactory.createSanitized(values);
    }

}
