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
var pdoc_adapter_response_mapper_1 = require("./pdoc-adapter-response.mapper");
var generic_itemsjs_adapter_1 = require("../../search-commons/services/generic-itemsjs.adapter");
// TODO sync with model
// tslint:disable:no-console
var PDocItemsJsAdapter = /** @class */ (function (_super) {
    __extends(PDocItemsJsAdapter, _super);
    function PDocItemsJsAdapter(config, records, itemsJsConfig) {
        var _this = this;
        console.debug('init itemsjs with config', itemsJsConfig, records ? records.length : 0);
        _this = _super.call(this, config, new pdoc_adapter_response_mapper_1.PDocAdapterResponseMapper(config), records, itemsJsConfig) || this;
        return _this;
    }
    PDocItemsJsAdapter.prototype.mapToAdapterDocument = function (props) {
        return this.mapper.mapToAdapterDocument({}, props);
    };
    PDocItemsJsAdapter.prototype.getItemsJsConfig = function () {
        return PDocItemsJsAdapter.itemsJsConfig;
    };
    PDocItemsJsAdapter.itemsJsConfig = {
        skipMediaCheck: true,
        aggregationFields: ['id'],
        refConfigs: [],
        searchableFields: ['id',
            'dateshow_dt', 'desc_txt', 'desc_md_txt', 'desc_html_txt',
            'keywords_txt', 'name_s', 'type_s',
            'subtype_s',
            'html'],
        aggregations: {
            'keywords_txt': {
                filterFunction: function (record) {
                    return record['keywords_txt']
                        ? record['keywords_txt'].replace(',,', ',').split(',')
                        : undefined;
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
        fieldMapping: {}
    };
    return PDocItemsJsAdapter;
}(generic_itemsjs_adapter_1.GenericItemsJsAdapter));
exports.PDocItemsJsAdapter = PDocItemsJsAdapter;
//# sourceMappingURL=pdoc-itemsjs.adapter.js.map