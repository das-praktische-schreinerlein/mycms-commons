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
var pdoc_record_1 = require("../records/pdoc-record");
var cdoc_searchresult_1 = require("../../../search-commons/model/container/cdoc-searchresult");
var PDocSearchResult = /** @class */ (function (_super) {
    __extends(PDocSearchResult, _super);
    function PDocSearchResult(pdocSearchForm, recordCount, currentRecords, facets) {
        return _super.call(this, pdocSearchForm, recordCount, currentRecords, facets) || this;
    }
    PDocSearchResult.prototype.toString = function () {
        return 'PDocSearchResult {\n' +
            '  facets: ' + this.facets + '' +
            '  currentRecords: ' + this.currentRecords + '' +
            '  recordCount: ' + this.recordCount + '' +
            '  searchFormGroup: ' + this.searchForm + '' +
            '}';
    };
    PDocSearchResult.prototype.toSerializableJsonObj = function (anonymizeMedia) {
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
                var record = pdoc_record_1.PDocRecord.cloneToSerializeToJsonObj(this.currentRecords[i], anonymizeMedia);
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
    return PDocSearchResult;
}(cdoc_searchresult_1.CommonDocSearchResult));
exports.PDocSearchResult = PDocSearchResult;
//# sourceMappingURL=pdoc-searchresult.js.map