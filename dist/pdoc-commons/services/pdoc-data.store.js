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
var pdoc_record_1 = require("../model/records/pdoc-record");
var PDocDataStore = /** @class */ (function (_super) {
    __extends(PDocDataStore, _super);
    function PDocDataStore(searchParameterUtils) {
        var _this = _super.call(this, []) || this;
        _this.searchParameterUtils = searchParameterUtils;
        _this.validMoreNumberFilterNames = {
            page_id_i: true,
            page_id_is: true
        };
        _this.validMoreInFilterNames = {
            id: true,
            id_notin_is: true,
            doublettes: true,
            noSubType: true,
            key_ss: true,
            flags_ss: true,
            langkeys_ss: true,
            profiles_ss: true,
            initial_s: true,
            sortkey_ss: true,
            theme_ss: true,
            todoDesc: true,
            todoKeywords: true
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
                'likein': searchForm.fulltext.split(' OR ')
            };
        }
        if (searchForm.type !== undefined && searchForm.type.length > 0) {
            filter = filter || {};
            filter['type_ss'] = {
                'in': searchForm.type.split(/,/)
            };
        }
        if (searchForm.subtype !== undefined && searchForm.subtype.length > 0) {
            filter = filter || {};
            filter['subtype_ss'] = {
                'in': searchForm.subtype.split(/,/)
            };
        }
        if (searchForm.initial !== undefined && searchForm.initial.length > 0) {
            filter = filter || {};
            filter['initial_s'] = {
                'in': searchForm.initial.split(/,/)
            };
        }
        if (searchForm.moreFilter !== undefined && searchForm.moreFilter.length > 0) {
            filter = filter || {};
            var moreFilters = searchForm.moreFilter.split(/;/);
            for (var index in moreFilters) {
                var moreFilter = moreFilters[index];
                var _a = moreFilter.split(/:/), filterName = _a[0], values = _a[1];
                if (filterName && values) {
                    if (this.validMoreNumberFilterNames[filterName] === true) {
                        filter[filterName] = {
                            'in_number': values.split(/,/)
                        };
                    }
                    else if (this.validMoreInFilterNames[filterName] === true) {
                        filter[filterName] = {
                            'in': values.split(/,/)
                        };
                    }
                    else if (filterName === 'createdafter_dt' || filterName === 'updatedafter_dt') {
                        filter[filterName] = {
                            'gt': values[0]
                        };
                    }
                }
            }
        }
        if (searchForm.flags !== undefined && searchForm.flags.length > 0) {
            filter = filter || {};
            filter['flags_ss'] = {
                'in': searchForm.flags.split(/,/)
            };
        }
        if (searchForm.langkeys !== undefined && searchForm.langkeys.length > 0) {
            filter = filter || {};
            filter['langkeys_ss'] = {
                'in': searchForm.langkeys.split(/,/)
            };
        }
        if (searchForm.profiles !== undefined && searchForm.profiles.length > 0) {
            filter = filter || {};
            filter['profiles_ss'] = {
                'in': searchForm.profiles.split(/,/)
            };
        }
        if (searchForm.sortkey !== undefined && searchForm.sortkey.length > 0) {
            filter = filter || {};
            filter['sortkey_ss'] = {
                'in': searchForm.sortkey.split(/,/)
            };
        }
        if (filter !== undefined) {
            query['where'] = filter;
        }
        return query;
    };
    PDocDataStore.prototype.createSearchResult = function (searchForm, recordCount, records, facets) {
        return new pdoc_searchresult_1.PDocSearchResult(searchForm, recordCount, records, facets);
    };
    PDocDataStore.UPDATE_RELATION = [].concat(pdoc_record_1.PDocRecordRelation.hasOne ? Object.keys(pdoc_record_1.PDocRecordRelation.hasOne) : [])
        .concat(pdoc_record_1.PDocRecordRelation.hasMany ? Object.keys(pdoc_record_1.PDocRecordRelation.hasMany) : []);
    return PDocDataStore;
}(generic_data_store_1.GenericDataStore));
exports.PDocDataStore = PDocDataStore;
//# sourceMappingURL=pdoc-data.store.js.map