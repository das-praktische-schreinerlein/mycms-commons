import { GenericSolrAdapter } from '../../search-commons/services/generic-solr.adapter';
import { Mapper, Record } from 'js-data';
import { PDocRecord } from '../model/records/pdoc-record';
import { PDocSearchForm } from '../model/forms/pdoc-searchform';
import { PDocSearchResult } from '../model/container/pdoc-searchresult';
import { SolrConfig } from '../../search-commons/services/solr-query.builder';
export declare class PDocSolrAdapter extends GenericSolrAdapter<PDocRecord, PDocSearchForm, PDocSearchResult> {
    static solrConfig: SolrConfig;
    constructor(config: any);
    mapToAdapterDocument(props: any): any;
    mapResponseDocument(mapper: Mapper, doc: any): Record;
    getHttpEndpoint(method: string): string;
    getSolrConfig(): SolrConfig;
}
