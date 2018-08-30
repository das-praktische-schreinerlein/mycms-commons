import { PDocRecord } from '../model/records/pdoc-record';
import { PDocSearchForm } from '../model/forms/pdoc-searchform';
import { PDocSearchResult } from '../model/container/pdoc-searchresult';
import { GenericSearchHttpAdapter } from '../../search-commons/services/generic-search-http.adapter';
export declare class PDocHttpAdapter extends GenericSearchHttpAdapter<PDocRecord, PDocSearchForm, PDocSearchResult> {
    constructor(config: any);
    getHttpEndpoint(method: string): string;
}
