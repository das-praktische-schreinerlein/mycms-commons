"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var generic_validator_util_1 = require("./generic-validator.util");
var GenericSearchFormFieldConfig = /** @class */ (function () {
    function GenericSearchFormFieldConfig(datatype, validator) {
        this._datatype = datatype;
        this._validator = validator;
    }
    Object.defineProperty(GenericSearchFormFieldConfig.prototype, "datatype", {
        get: function () {
            return this._datatype;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GenericSearchFormFieldConfig.prototype, "validator", {
        get: function () {
            return this._validator;
        },
        enumerable: true,
        configurable: true
    });
    return GenericSearchFormFieldConfig;
}());
exports.GenericSearchFormFieldConfig = GenericSearchFormFieldConfig;
var GenericSearchForm = /** @class */ (function () {
    function GenericSearchForm(values) {
        this.fulltext = values['fulltext'] || '';
        this.sort = values['sort'] || '';
        this.perPage = values['perPage'] || 10;
        this.pageNum = values['pageNum'] || 1;
    }
    GenericSearchForm.prototype.toString = function () {
        return 'GenericSearchForm {\n' +
            '  fulltext: ' + this.fulltext + '\n' +
            '  sort: ' + this.sort + '\n' +
            '  perPage: ' + this.perPage + '\n' +
            '  pageNum: ' + this.pageNum + '' +
            '}';
    };
    GenericSearchForm.genericFields = {
        fulltext: new GenericSearchFormFieldConfig(generic_validator_util_1.GenericValidatorDatatypes.FULLTEXT, new generic_validator_util_1.SolrValidationRule(false)),
        sort: new GenericSearchFormFieldConfig(generic_validator_util_1.GenericValidatorDatatypes.SORT, new generic_validator_util_1.IdValidationRule(false)),
        perPage: new GenericSearchFormFieldConfig(generic_validator_util_1.GenericValidatorDatatypes.PERPAGE, new generic_validator_util_1.NumberValidationRule(false, 0, 100, 10)),
        pageNum: new GenericSearchFormFieldConfig(generic_validator_util_1.GenericValidatorDatatypes.PAGENUM, new generic_validator_util_1.NumberValidationRule(false, 1, 999999, 1))
    };
    return GenericSearchForm;
}());
exports.GenericSearchForm = GenericSearchForm;
//# sourceMappingURL=generic-searchform.js.map