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
            keywords_txt: (props.keywords ? props.keywords.split(', ').join(',,KW_') : ''),
            name_txt: props.name,
            type_txt: props.type,
        };
        values['html_txt'] = [values.desc_txt, values.name_txt, values.keywords_txt, values.type_txt].join(' ');
        return values;
    };
    PDocSolrAdapter.prototype.mapResponseDocument = function (mapper, doc) {
        var values = {};
        values['id'] = this.mapperUtils.getAdapterValue(doc, 'id', undefined);
        values['descTxt'] = this.mapperUtils.getAdapterValue(doc, 'desc_txt', undefined);
        values['descMd'] = this.mapperUtils.getAdapterValue(doc, 'desc_md_txt', undefined);
        values['descHtml'] = this.mapperUtils.getAdapterValue(doc, 'desc_html_txt', undefined);
        values['keywords'] = this.mapperUtils.getAdapterValue(doc, 'keywords_txt', '').split(',,').join(', ').replace(/KW_/g, '');
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
        fieldList: ['id', 'desc_txt', 'desc_md_txt', 'desc_html_txt', 'keywords_txt', 'name_txt', 'type_txt'],
        facetConfigs: {
            'keywords_txt': {
                'f.keywords_txt.facet.prefix': 'kw_',
                'f.keywords_txt.facet.limit': '-1',
                'f.keywords_txt.facet.sort': 'count'
            },
            'type_txt': {}
        },
        commonSortOptions: {
            'qf': 'name_txt^10.0 desc_txt^8.0 keywords_txt^6.0',
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