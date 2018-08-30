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
var js_data_1 = require("js-data");
var generic_validator_util_1 = require("../forms/generic-validator.util");
var generic_searchform_1 = require("../forms/generic-searchform");
var BaseEntityRecordFieldConfig = /** @class */ (function () {
    function BaseEntityRecordFieldConfig(datatype, validator) {
        this._datatype = datatype;
        this._validator = validator;
    }
    Object.defineProperty(BaseEntityRecordFieldConfig.prototype, "datatype", {
        get: function () {
            return this._datatype;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseEntityRecordFieldConfig.prototype, "validator", {
        get: function () {
            return this._validator;
        },
        enumerable: true,
        configurable: true
    });
    return BaseEntityRecordFieldConfig;
}());
exports.BaseEntityRecordFieldConfig = BaseEntityRecordFieldConfig;
var BaseEntityRecord = /** @class */ (function (_super) {
    __extends(BaseEntityRecord, _super);
    function BaseEntityRecord() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BaseEntityRecord.prototype.toString = function (useWrapper, includeId) {
        useWrapper = typeof useWrapper === 'boolean' ? useWrapper : true;
        includeId = typeof includeId === 'boolean' ? includeId : true;
        return (useWrapper ? '{\n' : '') +
            (includeId ? 'id: ' + this.id + ',\n' : '') +
            (useWrapper ? '\n}' : '');
    };
    BaseEntityRecord.prototype.isValid = function () {
        return BaseEntityRecordValidator.isValid(this);
    };
    BaseEntityRecord.genericFields = {
        id: new generic_searchform_1.GenericSearchFormFieldConfig(generic_validator_util_1.GenericValidatorDatatypes.ID, new generic_validator_util_1.IdValidationRule(false))
    };
    return BaseEntityRecord;
}(js_data_1.Record));
exports.BaseEntityRecord = BaseEntityRecord;
var BaseEntityRecordValidator = /** @class */ (function () {
    function BaseEntityRecordValidator() {
    }
    BaseEntityRecordValidator.isValidValues = function (values) {
        return BaseEntityRecordValidator.validateValues(values).length > 0;
    };
    BaseEntityRecordValidator.validateValues = function (values) {
        var errors = [];
        var state = true;
        state = !BaseEntityRecord.genericFields.id.validator.isValid(values['id']) ? errors.push('id') && false : true;
        return errors;
    };
    BaseEntityRecordValidator.isValid = function (record) {
        return BaseEntityRecordValidator.validate(record).length > 0;
    };
    BaseEntityRecordValidator.validate = function (record) {
        var errors = [];
        var state = !BaseEntityRecord.genericFields.id.validator.isValid(record.id) ? errors.push('id') && false : true;
        return errors;
    };
    return BaseEntityRecordValidator;
}());
exports.BaseEntityRecordValidator = BaseEntityRecordValidator;
//# sourceMappingURL=base-entity-record.js.map