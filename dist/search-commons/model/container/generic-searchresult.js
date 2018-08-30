"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var GenericSearchResult = /** @class */ (function () {
    function GenericSearchResult(searchForm, recordCount, currentRecords, facets) {
        this.currentRecords = currentRecords;
        this.recordCount = recordCount;
        this.searchForm = searchForm;
        this.facets = facets;
    }
    GenericSearchResult.prototype.toString = function () {
        return 'GenericSearchResult {\n' +
            '  facets: ' + this.facets + '' +
            '  currentRecords: ' + this.currentRecords + '' +
            '  recordCount: ' + this.recordCount + '' +
            '  searchFormGroup: ' + this.searchForm + '' +
            '}';
    };
    return GenericSearchResult;
}());
exports.GenericSearchResult = GenericSearchResult;
//# sourceMappingURL=generic-searchresult.js.map