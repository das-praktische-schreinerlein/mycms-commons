import { GenericDataStore } from '../../search-commons/services/generic-data.store';
import { PDocSearchResult } from '../model/container/pdoc-searchresult';
import { PDocSearchForm } from '../model/forms/pdoc-searchform';
import { PDocRecord } from '../model/records/pdoc-record';
import { Facets } from '../../search-commons/model/container/facets';
import { SearchParameterUtils } from '../../search-commons/services/searchparameter.utils';
export declare class PDocDataStore extends GenericDataStore<PDocRecord, PDocSearchForm, PDocSearchResult> {
    private searchParameterUtils;
    private validMoreFilterNames;
    constructor(searchParameterUtils: SearchParameterUtils);
    createQueryFromForm(searchForm: PDocSearchForm): Object;
    createSearchResult(searchForm: PDocSearchForm, recordCount: number, records: PDocRecord[], facets: Facets): PDocSearchResult;
}
