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
var generic_searchform_1 = require("./generic-searchform");
var generic_validator_util_1 = require("./generic-validator.util");
var CommonDocSearchForm = /** @class */ (function (_super) {
    __extends(CommonDocSearchForm, _super);
    function CommonDocSearchForm(values) {
        var _this = _super.call(this, values) || this;
        _this.when = values['when'] || '';
        _this.what = values['what'] || '';
        _this.initial = values['initial'] || '';
        _this.moreFilter = values['moreFilter'] || '';
        _this.playlists = values['playlists'] || '';
        _this.theme = values['theme'] || '';
        _this.type = values['type'] || '';
        return _this;
    }
    CommonDocSearchForm.prototype.toString = function () {
        return 'CommonDocSearchForm {\n' +
            '  when: ' + this.when + '\n' +
            '  what: ' + this.what + '\n' +
            '  initial: ' + this.initial + '\n' +
            '  fulltext: ' + this.fulltext + '\n' +
            '  type: ' + this.type + '\n' +
            '  sort: ' + this.sort + '\n' +
            '  perPage: ' + this.perPage + '\n' +
            '  pageNum: ' + this.pageNum + '' +
            '}';
    };
    CommonDocSearchForm.cdocFields = {
        when: new generic_searchform_1.GenericSearchFormFieldConfig(generic_validator_util_1.GenericValidatorDatatypes.WHEN_KEY_CSV, new generic_validator_util_1.KeyParamsValidationRule(false)),
        what: new generic_searchform_1.GenericSearchFormFieldConfig(generic_validator_util_1.GenericValidatorDatatypes.WHAT_KEY_CSV, new generic_validator_util_1.IdCsvValidationRule(false)),
        initial: new generic_searchform_1.GenericSearchFormFieldConfig(generic_validator_util_1.GenericValidatorDatatypes.NAME, new generic_validator_util_1.KeyParamsValidationRule(false)),
        moreFilter: new generic_searchform_1.GenericSearchFormFieldConfig(generic_validator_util_1.GenericValidatorDatatypes.FILTER_LIST, new generic_validator_util_1.ExtendedKeyParamsValidationRule(false)),
        playlists: new generic_searchform_1.GenericSearchFormFieldConfig(generic_validator_util_1.GenericValidatorDatatypes.WHAT_KEY_CSV, new generic_validator_util_1.TextValidationRule(false)),
        theme: new generic_searchform_1.GenericSearchFormFieldConfig(generic_validator_util_1.GenericValidatorDatatypes.ID, new generic_validator_util_1.IdValidationRule(false)),
        type: new generic_searchform_1.GenericSearchFormFieldConfig(generic_validator_util_1.GenericValidatorDatatypes.ID_CSV, new generic_validator_util_1.IdCsvValidationRule(false))
    };
    return CommonDocSearchForm;
}(generic_searchform_1.GenericSearchForm));
exports.CommonDocSearchForm = CommonDocSearchForm;
var CommonDocSearchFormFactory = /** @class */ (function () {
    function CommonDocSearchFormFactory() {
    }
    CommonDocSearchFormFactory.getSanitizedValues = function (values) {
        var sanitizedValues = {};
        sanitizedValues.fulltext = generic_searchform_1.GenericSearchForm.genericFields.fulltext.validator.sanitize(values['fulltext']) || '';
        sanitizedValues.sort = generic_searchform_1.GenericSearchForm.genericFields.sort.validator.sanitize(values['sort']) || '';
        sanitizedValues.perPage = generic_searchform_1.GenericSearchForm.genericFields.perPage.validator.sanitize(values['perPage']) || 10;
        sanitizedValues.pageNum = generic_searchform_1.GenericSearchForm.genericFields.pageNum.validator.sanitize(values['pageNum']) || 1;
        sanitizedValues.when = CommonDocSearchForm.cdocFields.when.validator.sanitize(values['when']) || '';
        sanitizedValues.what = CommonDocSearchForm.cdocFields.what.validator.sanitize(values['what']) || '';
        sanitizedValues.initial = CommonDocSearchForm.cdocFields.initial.validator.sanitize(values['initial']) || '';
        sanitizedValues.moreFilter = CommonDocSearchForm.cdocFields.moreFilter.validator.sanitize(values['moreFilter']) || '';
        sanitizedValues.playlists = CommonDocSearchForm.cdocFields.playlists.validator.sanitize(values['playlists']) || '';
        sanitizedValues.theme = CommonDocSearchForm.cdocFields.theme.validator.sanitize(values['theme']) || '';
        sanitizedValues.type = CommonDocSearchForm.cdocFields.type.validator.sanitize(values['type']) || '';
        return sanitizedValues;
    };
    CommonDocSearchFormFactory.getSanitizedValuesFromForm = function (searchForm) {
        return CommonDocSearchFormFactory.getSanitizedValues(searchForm);
    };
    CommonDocSearchFormFactory.createSanitized = function (values) {
        var sanitizedValues = CommonDocSearchFormFactory.getSanitizedValues(values);
        return new CommonDocSearchForm(sanitizedValues);
    };
    CommonDocSearchFormFactory.cloneSanitized = function (searchForm) {
        var sanitizedValues = CommonDocSearchFormFactory.getSanitizedValuesFromForm(searchForm);
        return new CommonDocSearchForm(sanitizedValues);
    };
    return CommonDocSearchFormFactory;
}());
exports.CommonDocSearchFormFactory = CommonDocSearchFormFactory;
var CommonDocSearchFormValidator = /** @class */ (function () {
    function CommonDocSearchFormValidator() {
    }
    CommonDocSearchFormValidator.isValidValues = function (values) {
        var state = true;
        state = generic_searchform_1.GenericSearchForm.genericFields.fulltext.validator.isValid(values['fulltext']) && state;
        state = generic_searchform_1.GenericSearchForm.genericFields.sort.validator.isValid(values['sort']) && state;
        state = generic_searchform_1.GenericSearchForm.genericFields.perPage.validator.isValid(values['perPage']) && state;
        state = generic_searchform_1.GenericSearchForm.genericFields.pageNum.validator.isValid(values['pageNum']) && state;
        state = CommonDocSearchForm.cdocFields.when.validator.isValid(values['when']) && state;
        state = CommonDocSearchForm.cdocFields.what.validator.isValid(values['what']) && state;
        state = CommonDocSearchForm.cdocFields.initial.validator.isValid(values['initial']) && state;
        state = CommonDocSearchForm.cdocFields.moreFilter.validator.isValid(values['moreFilter']) && state;
        state = CommonDocSearchForm.cdocFields.playlists.validator.isValid(values['playlists']) && state;
        state = CommonDocSearchForm.cdocFields.theme.validator.isValid(values['theme']) && state;
        state = CommonDocSearchForm.cdocFields.type.validator.isValid(values['type']) && state;
        return state;
    };
    CommonDocSearchFormValidator.isValid = function (searchForm) {
        return CommonDocSearchFormValidator.isValidValues(searchForm);
    };
    return CommonDocSearchFormValidator;
}());
exports.CommonDocSearchFormValidator = CommonDocSearchFormValidator;
//# sourceMappingURL=cdoc-searchform.js.map