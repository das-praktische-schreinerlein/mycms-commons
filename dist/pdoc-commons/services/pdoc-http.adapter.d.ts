import { PDocRecord } from '../model/records/pdoc-record';
import { PDocSearchForm } from '../model/forms/pdoc-searchform';
import { PDocSearchResult } from '../model/container/pdoc-searchresult';
import { GenericSearchHttpAdapter } from '../../search-commons/services/generic-search-http.adapter';
import { Mapper } from 'js-data';
export declare class PDocHttpAdapter extends GenericSearchHttpAdapter<PDocRecord, PDocSearchForm, PDocSearchResult> {
    private responseMapper;
    constructor(config: any);
    create(mapper: Mapper, record: any, opts?: any): Promise<PDocRecord>;
    update(mapper: Mapper, id: string | number, record: any, opts?: any): Promise<PDocRecord>;
    getHttpEndpoint(method: string, format?: string): string;
    private mapRecordToAdapterValues;
}
