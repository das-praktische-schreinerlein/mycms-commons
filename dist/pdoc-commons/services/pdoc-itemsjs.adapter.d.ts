import { PDocRecord } from '../model/records/pdoc-record';
import { PDocSearchForm } from '../model/forms/pdoc-searchform';
import { PDocSearchResult } from '../model/container/pdoc-searchresult';
import { ItemsJsConfig } from '../../search-commons/services/itemsjs-query.builder';
import { GenericItemsJsAdapter } from '../../search-commons/services/generic-itemsjs.adapter';
import { ExtendedItemsJsConfig } from '../../search-commons/services/itemsjs.dataimporter';
export declare class PDocItemsJsAdapter extends GenericItemsJsAdapter<PDocRecord, PDocSearchForm, PDocSearchResult> {
    static itemsJsConfig: ExtendedItemsJsConfig;
    constructor(config: any, records: any, itemsJsConfig: ExtendedItemsJsConfig);
    mapToAdapterDocument(props: any): any;
    getItemsJsConfig(): ItemsJsConfig;
}
