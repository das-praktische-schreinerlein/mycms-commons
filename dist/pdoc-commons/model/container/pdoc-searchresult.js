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
var generic_searchresult_1 = require("../../../search-commons/model/container/generic-searchresult");
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
    PDocSearchResult.prototype.toSerializableJsonObj = function () {
        var _this = this;
        var result = {
            'recordCount': this.recordCount,
            'searchForm': this.searchForm,
            'currentRecords': [],
            'facets': {
                facets: {}
            }
        };
        if (Array.isArray(this.currentRecords)) {
            for (var i = 0; i < this.currentRecords.length; i++) {
                var record = {};
                for (var key in this.currentRecords[i]) {
                    record[key] = this.currentRecords[i][key];
                }
                result.currentRecords.push(record);
            }
        }
        if (this.facets && this.facets.facets) {
            this.facets.facets.forEach(function (value, key) {
                result.facets.facets[key] = _this.facets.facets.get(key).facet;
            });
        }
        return result;
    };
    return PDocSearchResult;
}(generic_searchresult_1.GenericSearchResult));
exports.PDocSearchResult = PDocSearchResult;
//# sourceMappingURL=pdoc-searchresult.js.map