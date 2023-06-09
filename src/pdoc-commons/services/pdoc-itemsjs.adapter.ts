import {PDocRecord} from '../model/records/pdoc-record';
import {PDocSearchForm} from '../model/forms/pdoc-searchform';
import {PDocSearchResult} from '../model/container/pdoc-searchresult';
import {PDocAdapterResponseMapper} from './pdoc-adapter-response.mapper';
import {ItemsJsConfig} from '../../search-commons/services/itemsjs-query.builder';
import {GenericItemsJsAdapter} from '../../search-commons/services/generic-itemsjs.adapter';
import {ExtendedItemsJsConfig} from '../../search-commons/services/itemsjs.dataimporter';

// TODO sync with model
// tslint:disable:no-console
export class PDocItemsJsAdapter extends GenericItemsJsAdapter<PDocRecord, PDocSearchForm, PDocSearchResult> {
    public static itemsJsConfig: ExtendedItemsJsConfig = {
        skipMediaCheck: true,
        aggregationFields: ['id'],
        refConfigs: [
        ],
        searchableFields: ['id',
            'dateshow_dt', 'desc_txt', 'desc_md_txt', 'desc_html_txt',
            'flags_s', 'profiles_s', 'flagkeys_s', 'name_s', 'type_s',
            'subtype_s',
            'html'],
        aggregations: {
            'flags_ss': {
                filterFunction: function(record) {
                    return record['flags_s']
                        ? record['flags_s'].replace(',,', ',').split(',')
                        : undefined
                },
                conjunction: false,
                sort: 'term',
                order: 'asc',
                hide_zero_doc_count: true,
                size: 1000
            },
            'profiles_ss': {
                filterFunction: function(record) {
                    return record['profiles_s']
                        ? record['profiles_s'].replace(',,', ',').split(',')
                        : undefined
                },
                conjunction: false,
                sort: 'term',
                order: 'asc',
                hide_zero_doc_count: true,
                size: 1000
            },
            'langkeys_ss': {
                filterFunction: function(record) {
                    return record['langkeys_s']
                        ? record['langkeys_s'].replace(',,', ',').split(',')
                        : undefined
                },
                conjunction: false,
                sort: 'term',
                order: 'asc',
                hide_zero_doc_count: true,
                size: 1000
            },
            'subtype_ss': {
                mapField: 'subtype_s',
                conjunction: false,
                sort: 'term',
                order: 'asc',
                hide_zero_doc_count: true,
                size: 1000
            },
            'type_txt': {
                mapField: 'type_s',
                conjunction: false,
                sort: 'term',
                order: 'asc',
                hide_zero_doc_count: false,
                size: 1000
            },
            'id': {
                conjunction: false,
                sort: 'term',
                order: 'asc',
                hide_zero_doc_count: true,
                size: 1000
            },
            'UNDEFINED_FILTER': {
                mapField: 'id',
                field: 'id',
                conjunction: true,
                sort: 'term',
                order: 'asc',
                hide_zero_doc_count: true,
                size: 1000
            }
        },
        sortings: {
            'date': {
                field: ['dateshow_dt'],
                order: ['desc', 'desc']
            },
            'dateAsc': {
                field: ['dateshow_dt'],
                order: ['asc', 'desc']
            },
            'relevance': {
                field: ['dateshow_dt', 'id'],
                order: ['desc', 'desc']
            }
        },
        filterMapping: {
            'html': 'html_txt'
        },
        fieldMapping: {
        }
    };

    constructor(config: any, records: any, itemsJsConfig: ExtendedItemsJsConfig) {
        console.debug('init itemsjs with config', itemsJsConfig, records ? records.length : 0);
        super(config, new PDocAdapterResponseMapper(config), records, itemsJsConfig);
    }

    mapToAdapterDocument(props: any): any {
        return this.mapper.mapToAdapterDocument({}, props);
    }

    getItemsJsConfig(): ItemsJsConfig {
        return PDocItemsJsAdapter.itemsJsConfig;
    }

}

