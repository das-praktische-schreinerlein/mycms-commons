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
var BaseAudioRecord = /** @class */ (function (_super) {
    __extends(BaseAudioRecord, _super);
    function BaseAudioRecord() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BaseAudioRecord.prototype.getMediaId = function () {
        return 'notimplemented';
    };
    BaseAudioRecord.prototype.toString = function () {
        return 'BaseAudioRecord Record {\n' +
            '  id: ' + this.id + ',\n' +
            '  fileName: ' + this.fileName + '\n' +
            '  name: ' + this.name + ',\n' +
            '}';
    };
    BaseAudioRecord.baseAudioFields = {
        dur: new base_entity_record_1.BaseEntityRecordFieldConfig(generic_validator_util_1.GenericValidatorDatatypes.NUMBER, new generic_validator_util_1.NumberValidationRule(false, 0, 999999, undefined))
    };
    return BaseAudioRecord;
}(basemedia_record_1.BaseMediaRecord));
exports.BaseAudioRecord = BaseAudioRecord;
var BaseAudioRecordFactory = /** @class */ (function (_super) {
    __extends(BaseAudioRecordFactory, _super);
    function BaseAudioRecordFactory() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BaseAudioRecordFactory.createSanitized = function (values) {
        var sanitizedValues = BaseAudioRecordFactory.instance.getSanitizedValues(values, {});
        return new BaseAudioRecord(sanitizedValues);
    };
    BaseAudioRecordFactory.cloneSanitized = function (doc) {
        var sanitizedValues = BaseAudioRecordFactory.instance.getSanitizedValuesFromObj(doc);
        return new BaseAudioRecord(sanitizedValues);
    };
    BaseAudioRecordFactory.prototype.getSanitizedValues = function (values, result) {
        _super.prototype.getSanitizedValues.call(this, values, result);
        this.sanitizeFieldValues(values, BaseAudioRecord.baseAudioFields, result, '');
        return result;
    };
    BaseAudioRecordFactory.instance = new BaseAudioRecordFactory();
    return BaseAudioRecordFactory;
}(basemedia_record_1.BaseMediaRecordFactory));
exports.BaseAudioRecordFactory = BaseAudioRecordFactory;
var BaseAudioRecordValidator = /** @class */ (function (_super) {
    __extends(BaseAudioRecordValidator, _super);
    function BaseAudioRecordValidator() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BaseAudioRecordValidator.prototype.validateMyFieldRules = function (values, errors, fieldPrefix, errFieldPrefix) {
        fieldPrefix = fieldPrefix !== undefined ? fieldPrefix : '';
        errFieldPrefix = errFieldPrefix !== undefined ? errFieldPrefix : '';
        var state = _super.prototype.validateMyFieldRules.call(this, values, errors, fieldPrefix, errFieldPrefix);
        return this.validateFieldRules(values, BaseAudioRecord.baseAudioFields, fieldPrefix, errors, errFieldPrefix) && state;
    };
    BaseAudioRecordValidator.instance = new BaseAudioRecordValidator();
    return BaseAudioRecordValidator;
}(basemedia_record_1.BaseMediaRecordValidator));
exports.BaseAudioRecordValidator = BaseAudioRecordValidator;
//# sourceMappingURL=baseaudio-record.js.map