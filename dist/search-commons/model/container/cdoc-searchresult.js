"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var generic_searchresult_1 = require("./generic-searchresult");
var cdoc_entity_record_1 = require("../records/cdoc-entity-record");
var CommonDocSearchResult = /** @class */ (function (_super) {
    __extends(CommonDocSearchResult, _super);
    function CommonDocSearchResult(cdocSearchForm, recordCount, currentRecords, facets) {
        return _super.call(this, cdocSearchForm, recordCount, currentRecords, facets) || this;
    }
    CommonDocSearchResult.prototype.toString = function () {
        return 'CommonDocSearchResult {\n' +
            '  facets: ' + this.facets + '' +
            '  currentRecords: ' + this.currentRecords + '' +
            '  recordCount: ' + this.recordCount + '' +
            '  searchFormGroup: ' + this.searchForm + '' +
            '}';
    };
    CommonDocSearchResult.prototype.toSerializableJsonObj = function (anonymizeMedia) {
        var _this = this;
        var result = {
            'recordCount': this.recordCount,
            'searchForm': this.searchForm,
            'currentRecords': [],
            'facets': {
                facets: {},
                selectLimits: {}
            }
        };
        if (Array.isArray(this.currentRecords)) {
            for (var i = 0; i < this.currentRecords.length; i++) {
                var record = cdoc_entity_record_1.CommonDocRecord.cloneToSerializeToJsonObj(this.currentRecords[i], anonymizeMedia);
                result.currentRecords.push(record);
            }
        }
        if (this.facets && this.facets.facets) {
            this.facets.facets.forEach(function (value, key) {
                result.facets.facets[key] = _this.facets.facets.get(key).facet;
                result.facets.selectLimits[key] = _this.facets.facets.get(key).selectLimit;
            });
        }
        return result;
    };
    return CommonDocSearchResult;
}(generic_searchresult_1.GenericSearchResult));
exports.CommonDocSearchResult = CommonDocSearchResult;
//# sourceMappingURL=cdoc-searchresult.js.map