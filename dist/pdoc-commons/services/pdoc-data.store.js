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
var generic_data_store_1 = require("../../search-commons/services/generic-data.store");
var pdoc_searchresult_1 = require("../model/container/pdoc-searchresult");
var PDocDataStore = /** @class */ (function (_super) {
    __extends(PDocDataStore, _super);
    function PDocDataStore(searchParameterUtils) {
        var _this = _super.call(this, []) || this;
        _this.searchParameterUtils = searchParameterUtils;
        _this.validMoreFilterNames = {
        // TODO
        //  filters subtype....
        };
        return _this;
    }
    PDocDataStore.prototype.createQueryFromForm = function (searchForm) {
        var query = {};
        if (searchForm === undefined) {
            return query;
        }
        var filter = undefined;
        if (searchForm.fulltext !== undefined && searchForm.fulltext.length > 0) {
            filter = filter || {};
            filter['html'] = {
                'likei': '%' + searchForm.fulltext + '%'
            };
        }
        if (searchForm.what !== undefined && searchForm.what.length > 0) {
            filter = filter || {};
            filter['keywords_txt'] = {
                'in': searchForm.what.split(/,/)
            };
        }
        if (searchForm.type !== undefined && searchForm.type.length > 0) {
            filter = filter || {};
            filter['type_txt'] = {
                'in': searchForm.type.split(/,/)
            };
        }
        if (searchForm.moreFilter !== undefined && searchForm.moreFilter.length > 0) {
            filter = filter || {};
            var moreFilters = searchForm.moreFilter.split(/;/);
            for (var index in moreFilters) {
                var moreFilter = moreFilters[index];
                var _a = moreFilter.split(/:/), filterName = _a[0], values = _a[1];
                if (filterName && values && this.validMoreFilterNames[filterName] === true) {
                    filter[filterName] = {
                        'in': values.split(/,/)
                    };
                }
            }
        }
        // TODO
        //  filters subtype....
        if (filter !== undefined) {
            query['where'] = filter;
        }
        return query;
    };
    PDocDataStore.prototype.createSearchResult = function (searchForm, recordCount, records, facets) {
        return new pdoc_searchresult_1.PDocSearchResult(searchForm, recordCount, records, facets);
    };
    return PDocDataStore;
}(generic_data_store_1.GenericDataStore));
exports.PDocDataStore = PDocDataStore;
//# sourceMappingURL=pdoc-data.store.js.map