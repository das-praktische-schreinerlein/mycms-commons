import { PDocSearchForm } from '../forms/pdoc-searchform';
import { PDocRecord } from '../records/pdoc-record';
import { Facets } from '../../../search-commons/model/container/facets';
import { CommonDocSearchResult } from '../../../search-commons/model/container/cdoc-searchresult';
export declare class PDocSearchResult extends CommonDocSearchResult<PDocRecord, PDocSearchForm> {
    constructor(pdocSearchForm: PDocSearchForm, recordCount: number, currentRecords: PDocRecord[], facets: Facets);
    toString(): string;
    toSerializableJsonObj(anonymizeMedia?: boolean): {};
}
