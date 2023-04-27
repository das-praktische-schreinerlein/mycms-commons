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
var cdoc_searchform_1 = require("../../../search-commons/model/forms/cdoc-searchform");
var generic_searchform_1 = require("../../../search-commons/model/forms/generic-searchform");
var generic_validator_util_1 = require("../../../search-commons/model/forms/generic-validator.util");
var PDocSearchForm = /** @class */ (function (_super) {
    __extends(PDocSearchForm, _super);
    function PDocSearchForm(values) {
        var _this = _super.call(this, values) || this;
        _this.subtype = values['subtype'] || '';
        return _this;
    }
    PDocSearchForm.prototype.toString = function () {
        return 'PDocSearchForm {\n' +
            '  what: ' + this.what + '\n' +
            '  fulltext: ' + this.fulltext + '\n' +
            '  type: ' + this.type + '\n' +
            '  subtype: ' + this.subtype + '\n' +
            '  sort: ' + this.sort + '\n' +
            '  perPage: ' + this.perPage + '\n' +
            '  pageNum: ' + this.pageNum + '' +
            '}';
    };
    // TODO filter by locale
    // TODO filter by profiles
    // TODO filter by permissions
    PDocSearchForm.pdocFields = {
        subtype: new generic_searchform_1.GenericSearchFormFieldConfig(generic_validator_util_1.GenericValidatorDatatypes.ID_CSV, new generic_validator_util_1.IdCsvValidationRule(false)),
    };
    return PDocSearchForm;
}(cdoc_searchform_1.CommonDocSearchForm));
exports.PDocSearchForm = PDocSearchForm;
var PDocSearchFormFactory = /** @class */ (function () {
    function PDocSearchFormFactory() {
    }
    PDocSearchFormFactory.getSanitizedValues = function (values) {
        var sanitizedValues = cdoc_searchform_1.CommonDocSearchFormFactory.getSanitizedValues(values);
        sanitizedValues.subtype = PDocSearchForm.pdocFields.subtype.validator.sanitize(values['subtype']) || '';
        return sanitizedValues;
    };
    PDocSearchFormFactory.getSanitizedValuesFromForm = function (searchForm) {
        return PDocSearchFormFactory.getSanitizedValues(searchForm);
    };
    PDocSearchFormFactory.createSanitized = function (values) {
        var sanitizedValues = PDocSearchFormFactory.getSanitizedValues(values);
        return new PDocSearchForm(sanitizedValues);
    };
    PDocSearchFormFactory.cloneSanitized = function (searchForm) {
        var sanitizedValues = PDocSearchFormFactory.getSanitizedValuesFromForm(searchForm);
        return new PDocSearchForm(sanitizedValues);
    };
    return PDocSearchFormFactory;
}());
exports.PDocSearchFormFactory = PDocSearchFormFactory;
var PDocSearchFormValidator = /** @class */ (function () {
    function PDocSearchFormValidator() {
    }
    PDocSearchFormValidator.isValidValues = function (values) {
        var state = cdoc_searchform_1.CommonDocSearchFormValidator.isValidValues(values);
        state = PDocSearchForm.pdocFields.subtype.validator.isValid(values['subtype']) && state;
        return state;
    };
    PDocSearchFormValidator.isValid = function (searchForm) {
        return PDocSearchFormValidator.isValidValues(searchForm);
    };
    return PDocSearchFormValidator;
}());
exports.PDocSearchFormValidator = PDocSearchFormValidator;
//# sourceMappingURL=pdoc-searchform.js.map