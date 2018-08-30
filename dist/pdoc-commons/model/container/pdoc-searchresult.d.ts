import { PDocSearchForm } from '../forms/pdoc-searchform';
import { PDocRecord } from '../records/pdoc-record';
import { GenericSearchResult } from '../../../search-commons/model/container/generic-searchresult';
import { Facets } from '../../../search-commons/model/container/facets';
export declare class PDocSearchResult extends GenericSearchResult<PDocRecord, PDocSearchForm> {
    constructor(pdocSearchForm: PDocSearchForm, recordCount: number, currentRecords: PDocRecord[], facets: Facets);
    toString(): string;
    toSerializableJsonObj(): {};
}
