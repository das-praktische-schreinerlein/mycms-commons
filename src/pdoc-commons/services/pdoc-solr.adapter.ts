import {GenericSolrAdapter} from '../../search-commons/services/generic-solr.adapter';
import {Mapper, Record} from 'js-data';
import {PDocRecord} from '../model/records/pdoc-record';
import {PDocSearchForm} from '../model/forms/pdoc-searchform';
import {PDocSearchResult} from '../model/container/pdoc-searchresult';
import {SolrConfig} from '../../search-commons/services/solr-query.builder';

export class PDocSolrAdapter extends GenericSolrAdapter<PDocRecord, PDocSearchForm, PDocSearchResult> {
    public static solrConfig: SolrConfig = {
        fieldList: ['id', 'desc_txt', 'desc_md_txt', 'desc_html_txt',
            'flags_s', 'profiles_s', 'langkeys_s', 'name_s', 'type_s'],
        facetConfigs: {
            'flags_txt': {
                'f.flags_txt.facet.prefix': 'kw_',
                'f.flags_txt.facet.limit': '-1',
                'f.flags_txt.facet.sort': 'count'
            },
            'langkeys_txt': {
                'f.langkeys_txt.facet.prefix': 'kw_',
                'f.langkeys_txt.facet.limit': '-1',
                'f.langkeys_txt.facet.sort': 'count'
            },
            'profiles_txt': {
                'f.profiles_txt.facet.prefix': 'kw_',
                'f.profiles_txt.facet.limit': '-1',
                'f.profiles_txt.facet.sort': 'count'
            },
            'type_ss': {}
        },
        commonSortOptions: {
            'qf': 'name_s^10.0 desc_txt^8.0 langkeys_txt^6.0 profiles_txt^6.0 flags_txt^6.0',
            'defType': 'edismax'
        },
        sortMapping: {
            'relevance': {
            }
        },
        filterMapping: {
            'html': 'html_txt'
        },
        fieldMapping: {}
    };

    constructor(config: any) {
        super(config, undefined);
    }

    mapToAdapterDocument(props: any): any {
        const values = {
            id: props.id,
            desc_txt: props.descTxt,
            desc_md_txt: props.descMd,
            desc_html_txt: props.descHtml,
            flags_s: (props.flags ? props.flags.split(', ').join(',,flg_') : ''),
            langkeys_s: (props.langkeys_d ? props.langkeys.split(', ').join(',,lang_') : ''),
            profiles_s: (props.profiles ? props.profiles.split(', ').join(',,profile_') : ''),
            name_s: props.name,
            type_s: props.type,
        };

        const desc =  props.descTxt || props.descHtml || props.descMd;
        values['html_txt'] = [values.name_s, desc, values.flags_s, values.type_s].join(' ');

        return values;
    }

    mapResponseDocument(mapper: Mapper, doc: any): Record {
        const values = {};
        values['id'] = this.mapperUtils.getAdapterValue(doc, 'id', undefined);

        values['descTxt'] = this.mapperUtils.getAdapterValue(doc, 'desc_txt', undefined);
        values['descMd'] = this.mapperUtils.getAdapterValue(doc, 'desc_md_txt', undefined);
        values['descHtml'] = this.mapperUtils.getAdapterValue(doc, 'desc_html_txt', undefined);
        values['flags'] = this.mapperUtils.getAdapterValue(doc, 'flags_s', '').split(',,').join(', ').replace(/flg_/g, '');
        values['langkeys'] = this.mapperUtils.getAdapterValue(doc, 'langkeys_s', '').split(',,').join(', ').replace(/lang_/g, '');
        values['profiles'] = this.mapperUtils.getAdapterValue(doc, 'profiles_s', '').split(',,').join(', ').replace(/profile_/g, '');
        values['name'] = this.mapperUtils.getAdapterValue(doc, 'name_s', undefined);
        values['type'] = this.mapperUtils.getAdapterValue(doc, 'type_s', undefined);

        // console.log('mapResponseDocument values:', values);

        const record: PDocRecord = <PDocRecord>mapper.createRecord(values);

        // console.log('mapResponseDocument record full:', record);

        return record;
    }

    getHttpEndpoint(method: string): string {
        const updateMethods = ['create', 'destroy', 'update'];
        if (updateMethods.indexOf(method.toLowerCase()) >= 0) {
            return 'update?';
        }
        return 'select?';
    }

    getSolrConfig(): SolrConfig {
        return PDocSolrAdapter.solrConfig;
    }
}

