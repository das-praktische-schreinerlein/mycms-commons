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
var basemedia_record_1 = require("./basemedia-record");
var base_entity_record_1 = require("./base-entity-record");
var generic_validator_util_1 = require("../forms/generic-validator.util");
var BaseVideoRecord = /** @class */ (function (_super) {
    __extends(BaseVideoRecord, _super);
    function BaseVideoRecord() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BaseVideoRecord.prototype.toString = function () {
        return 'BaseVideoRecord Record {\n' +
            '  id: ' + this.id + ',\n' +
            '  fileName: ' + this.fileName + '\n' +
            '  name: ' + this.name + ',\n' +
            '}';
    };
    BaseVideoRecord.baseVideoFields = {
        dur: new base_entity_record_1.BaseEntityRecordFieldConfig(generic_validator_util_1.GenericValidatorDatatypes.NUMBER, new generic_validator_util_1.NumberValidationRule(false, 0, 999999, undefined))
    };
    return BaseVideoRecord;
}(basemedia_record_1.BaseMediaRecord));
exports.BaseVideoRecord = BaseVideoRecord;
var BaseVideoRecordFactory = /** @class */ (function (_super) {
    __extends(BaseVideoRecordFactory, _super);
    function BaseVideoRecordFactory() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BaseVideoRecordFactory.createSanitized = function (values) {
        var sanitizedValues = BaseVideoRecordFactory.instance.getSanitizedValues(values, {});
        return new BaseVideoRecord(sanitizedValues);
    };
    BaseVideoRecordFactory.cloneSanitized = function (doc) {
        var sanitizedValues = BaseVideoRecordFactory.instance.getSanitizedValuesFromObj(doc);
        return new BaseVideoRecord(sanitizedValues);
    };
    BaseVideoRecordFactory.prototype.getSanitizedValues = function (values, result) {
        _super.prototype.getSanitizedValues.call(this, values, result);
        this.sanitizeFieldValues(values, BaseVideoRecord.baseVideoFields, result, '');
        return result;
    };
    BaseVideoRecordFactory.instance = new BaseVideoRecordFactory();
    return BaseVideoRecordFactory;
}(basemedia_record_1.BaseMediaRecordFactory));
exports.BaseVideoRecordFactory = BaseVideoRecordFactory;
var BaseVideoRecordValidator = /** @class */ (function (_super) {
    __extends(BaseVideoRecordValidator, _super);
    function BaseVideoRecordValidator() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BaseVideoRecordValidator.prototype.validateMyFieldRules = function (values, errors, fieldPrefix, errFieldPrefix) {
        fieldPrefix = fieldPrefix !== undefined ? fieldPrefix : '';
        errFieldPrefix = errFieldPrefix !== undefined ? errFieldPrefix : '';
        var state = _super.prototype.validateMyFieldRules.call(this, values, errors, fieldPrefix, errFieldPrefix);
        return this.validateFieldRules(values, BaseVideoRecord.baseVideoFields, fieldPrefix, errors, errFieldPrefix) && state;
    };
    BaseVideoRecordValidator.instance = new BaseVideoRecordValidator();
    return BaseVideoRecordValidator;
}(basemedia_record_1.BaseMediaRecordValidator));
exports.BaseVideoRecordValidator = BaseVideoRecordValidator;
//# sourceMappingURL=basevideo-record.js.map