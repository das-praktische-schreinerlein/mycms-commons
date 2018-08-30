import { GenericSearchResult } from './generic-searchresult';
import { Facets } from './facets';
import { CommonDocRecord } from '../records/cdoc-entity-record';
import { CommonDocSearchForm } from '../forms/cdoc-searchform';
export declare class CommonDocSearchResult<R extends CommonDocRecord, F extends CommonDocSearchForm> extends GenericSearchResult<R, F> {
    constructor(cdocSearchForm: F, recordCount: number, currentRecords: R[], facets: Facets);
    toString(): string;
    toSerializableJsonObj(anonymizeMedia?: boolean): {};
}
