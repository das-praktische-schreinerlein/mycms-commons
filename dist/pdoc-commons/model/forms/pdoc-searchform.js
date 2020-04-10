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
var generic_searchform_1 = require("../../../search-commons/model/forms/generic-searchform");
var generic_validator_util_1 = require("../../../search-commons/model/forms/generic-validator.util");
var PDocSearchForm = /** @class */ (function (_super) {
    __extends(PDocSearchForm, _super);
    function PDocSearchForm(values) {
        var _this = _super.call(this, values) || this;
        _this.what = PDocSearchForm.pdocFields.what.validator.sanitize(values['what']) || '';
        _this.moreFilter = PDocSearchForm.pdocFields.moreFilter.validator.sanitize(values['moreFilter']) || '';
        _this.type = PDocSearchForm.pdocFields.type.validator.sanitize(values['type']) || '';
        return _this;
    }
    PDocSearchForm.prototype.toString = function () {
        return 'PDocSearchForm {\n' +
            '  what: ' + this.what + '\n' +
            '  fulltext: ' + this.fulltext + '\n' +
            '  type: ' + this.type + '\n' +
            '  sort: ' + this.sort + '\n' +
            '  perPage: ' + this.perPage + '\n' +
            '  pageNum: ' + this.pageNum + '' +
            '}';
    };
    PDocSearchForm.pdocFields = {
        what: new generic_searchform_1.GenericSearchFormFieldConfig(generic_validator_util_1.GenericValidatorDatatypes.WHAT_KEY_CSV, new generic_validator_util_1.IdCsvValidationRule(false)),
        moreFilter: new generic_searchform_1.GenericSearchFormFieldConfig(generic_validator_util_1.GenericValidatorDatatypes.FILTER_LIST, new generic_validator_util_1.KeyParamsValidationRule(false)),
        type: new generic_searchform_1.GenericSearchFormFieldConfig(generic_validator_util_1.GenericValidatorDatatypes.ID_CSV, new generic_validator_util_1.IdCsvValidationRule(false))
    };
    return PDocSearchForm;
}(generic_searchform_1.GenericSearchForm));
exports.PDocSearchForm = PDocSearchForm;
//# sourceMappingURL=pdoc-searchform.js.map