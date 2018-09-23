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
        return BaseEntityRecordValidator.instance.isValid(this);
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
    BaseEntityRecordValidator.prototype.isValidValues = function (values, fieldPrefix, errFieldPrefix) {
        return this.validateValues(values, fieldPrefix, errFieldPrefix).length === 0;
    };
    BaseEntityRecordValidator.prototype.validateValues = function (values, fieldPrefix, errFieldPrefix) {
        var errors = [];
        this.validateMyRules(values, errors, fieldPrefix, errFieldPrefix);
        this.validateMyValueRelationRules(values, errors, fieldPrefix, errFieldPrefix);
        return errors;
    };
    BaseEntityRecordValidator.prototype.isValid = function (doc, errFieldPrefix) {
        return this.validate(doc, errFieldPrefix).length === 0;
    };
    BaseEntityRecordValidator.prototype.validate = function (doc, errFieldPrefix) {
        var errors = [];
        this.validateMyRules(doc, errors, '', errFieldPrefix);
        this.validateMyRelationRules(doc, errors, errFieldPrefix);
        return errors;
    };
    BaseEntityRecordValidator.prototype.validateMyValueRelationRules = function (values, errors, fieldPrefix, errFieldPrefix) {
        return true;
    };
    BaseEntityRecordValidator.prototype.validateMyRelationRules = function (doc, errors, errFieldPrefix) {
        return true;
    };
    BaseEntityRecordValidator.prototype.validateMyRules = function (values, errors, fieldPrefix, errFieldPrefix) {
        fieldPrefix = fieldPrefix !== undefined ? fieldPrefix : '';
        errFieldPrefix = errFieldPrefix !== undefined ? errFieldPrefix : '';
        var state = true;
        state = this.validateRule(values, BaseEntityRecord.genericFields.id.validator, fieldPrefix + 'id', errors, errFieldPrefix) && state;
        return state;
    };
    BaseEntityRecordValidator.prototype.validateRule = function (record, rule, fieldName, errors, errFieldPrefix) {
        errFieldPrefix = errFieldPrefix !== undefined ? errFieldPrefix : '';
        return !rule.isValid(record[fieldName]) ? errors.push(errFieldPrefix + fieldName) && false : true;
    };
    BaseEntityRecordValidator.instance = new BaseEntityRecordValidator();
    return BaseEntityRecordValidator;
}());
exports.BaseEntityRecordValidator = BaseEntityRecordValidator;
//# sourceMappingURL=base-entity-record.js.map