"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var generic_solr_adapter_1 = require("../../search-commons/services/generic-solr.adapter");
var PDocSolrAdapter = /** @class */ (function (_super) {
    __extends(PDocSolrAdapter, _super);
    function PDocSolrAdapter(config) {
        return _super.call(this, config, undefined) || this;
    }
    PDocSolrAdapter.prototype.mapToAdapterDocument = function (props) {
        var values = {
            id: props.id,
            desc_txt: props.descTxt,
            desc_md_txt: props.descMd,
            desc_html_txt: props.descHtml,
            flags_s: (props.flags ? props.flags.split(', ').join(',,flg_') : ''),
            langkeys_s: (props.langkeys_d ? props.langkeys.split(', ').join(',,lang_') : ''),
            profiles_s: (props.profiles ? props.profiles.split(', ').join(',,profile_') : ''),
            name_txt: props.name,
            type_txt: props.type,
        };
        var desc = props.descTxt || props.descHtml || props.descMd;
        values['html_txt'] = [values.name_txt, desc, values.flags_s, values.type_txt].join(' ');
        return values;
    };
    PDocSolrAdapter.prototype.mapResponseDocument = function (mapper, doc) {
        var values = {};
        values['id'] = this.mapperUtils.getAdapterValue(doc, 'id', undefined);
        values['descTxt'] = this.mapperUtils.getAdapterValue(doc, 'desc_txt', undefined);
        values['descMd'] = this.mapperUtils.getAdapterValue(doc, 'desc_md_txt', undefined);
        values['descHtml'] = this.mapperUtils.getAdapterValue(doc, 'desc_html_txt', undefined);
        values['flags'] = this.mapperUtils.getAdapterValue(doc, 'flags_s', '').split(',,').join(', ').replace(/flg_/g, '');
        values['langkeys'] = this.mapperUtils.getAdapterValue(doc, 'langkeys_s', '').split(',,').join(', ').replace(/lang_/g, '');
        values['profiles'] = this.mapperUtils.getAdapterValue(doc, 'profiles_s', '').split(',,').join(', ').replace(/profile_/g, '');
        values['name'] = this.mapperUtils.getAdapterValue(doc, 'name_txt', undefined);
        values['type'] = this.mapperUtils.getAdapterValue(doc, 'type_txt', undefined);
        // console.log('mapResponseDocument values:', values);
        var record = mapper.createRecord(values);
        // console.log('mapResponseDocument record full:', record);
        return record;
    };
    PDocSolrAdapter.prototype.getHttpEndpoint = function (method) {
        var updateMethods = ['create', 'destroy', 'update'];
        if (updateMethods.indexOf(method.toLowerCase()) >= 0) {
            return 'update?';
        }
        return 'select?';
    };
    PDocSolrAdapter.prototype.getSolrConfig = function () {
        return PDocSolrAdapter.solrConfig;
    };
    PDocSolrAdapter.solrConfig = {
        fieldList: ['id', 'desc_txt', 'desc_md_txt', 'desc_html_txt',
            'flags_s', 'profiles_s', 'langkeys_s', 'name_txt', 'type_txt'],
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
            'type_txt': {}
        },
        commonSortOptions: {
            'qf': 'name_txt^10.0 desc_txt^8.0 langkeys_txt^6.0 profiles_txt^6.0 flags_txt^6.0',
            'defType': 'edismax'
        },
        sortMapping: {
            'relevance': {}
        },
        filterMapping: {
            'html': 'html_txt'
        },
        fieldMapping: {}
    };
    return PDocSolrAdapter;
}(generic_solr_adapter_1.GenericSolrAdapter));
exports.PDocSolrAdapter = PDocSolrAdapter;
//# sourceMappingURL=pdoc-solr.adapter.js.map