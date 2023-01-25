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
var base_entity_record_1 = require("./base-entity-record");
var generic_validator_util_1 = require("../forms/generic-validator.util");
var BaseMediaMetaRecord = /** @class */ (function (_super) {
    __extends(BaseMediaMetaRecord, _super);
    function BaseMediaMetaRecord() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BaseMediaMetaRecord.prototype.toString = function () {
        return 'BaseMediaMetaRecord Record {\n' +
            '  id: ' + this.id + ',\n' +
            '  fileCreated: ' + this.fileCreated + ',\n' +
            '  fileName: ' + this.fileName + ',\n' +
            '  fileSize: ' + this.fileSize + ',\n' +
            '  dur: ' + this.dur +
            '}';
    };
    BaseMediaMetaRecord.mediametaFields = {
        dur: new base_entity_record_1.BaseEntityRecordFieldConfig(generic_validator_util_1.GenericValidatorDatatypes.NUMBER, new generic_validator_util_1.NumberValidationRule(false, 0, 999999, undefined)),
        fileCreated: new base_entity_record_1.BaseEntityRecordFieldConfig(generic_validator_util_1.GenericValidatorDatatypes.DATE, new generic_validator_util_1.DateValidationRule(false)),
        fileName: new base_entity_record_1.BaseEntityRecordFieldConfig(generic_validator_util_1.GenericValidatorDatatypes.FILENAME, new generic_validator_util_1.SimpleInsecurePathValidationRule(false)),
        fileSize: new base_entity_record_1.BaseEntityRecordFieldConfig(generic_validator_util_1.GenericValidatorDatatypes.NUMBER, new generic_validator_util_1.NumberValidationRule(false, 0, 999999999, undefined)),
        metadata: new base_entity_record_1.BaseEntityRecordFieldConfig(generic_validator_util_1.GenericValidatorDatatypes.TEXT, new generic_validator_util_1.DescValidationRule(false)),
        resolution: new base_entity_record_1.BaseEntityRecordFieldConfig(generic_validator_util_1.GenericValidatorDatatypes.NAME, new generic_validator_util_1.NameValidationRule(false)),
        recordingDate: new base_entity_record_1.BaseEntityRecordFieldConfig(generic_validator_util_1.GenericValidatorDatatypes.DATE, new generic_validator_util_1.DateValidationRule(false)),
        mdoc_id: new base_entity_record_1.BaseEntityRecordFieldConfig(generic_validator_util_1.GenericValidatorDatatypes.ID, new generic_validator_util_1.IdValidationRule(false))
    };
    return BaseMediaMetaRecord;
}(base_entity_record_1.BaseEntityRecord));
exports.BaseMediaMetaRecord = BaseMediaMetaRecord;
var BaseMediaMetaRecordFactory = /** @class */ (function (_super) {
    __extends(BaseMediaMetaRecordFactory, _super);
    function BaseMediaMetaRecordFactory() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BaseMediaMetaRecordFactory.createSanitized = function (values) {
        var sanitizedValues = BaseMediaMetaRecordFactory.instance.getSanitizedValues(values, {});
        return new BaseMediaMetaRecord(sanitizedValues);
    };
    BaseMediaMetaRecordFactory.cloneSanitized = function (doc) {
        var sanitizedValues = BaseMediaMetaRecordFactory.instance.getSanitizedValuesFromObj(doc);
        return new BaseMediaMetaRecord(sanitizedValues);
    };
    BaseMediaMetaRecordFactory.prototype.getSanitizedValues = function (values, result) {
        _super.prototype.getSanitizedValues.call(this, values, result);
        this.sanitizeFieldValues(values, BaseMediaMetaRecord.mediametaFields, result, '');
        return result;
    };
    BaseMediaMetaRecordFactory.instance = new BaseMediaMetaRecordFactory();
    return BaseMediaMetaRecordFactory;
}(base_entity_record_1.BaseEntityRecordFactory));
exports.BaseMediaMetaRecordFactory = BaseMediaMetaRecordFactory;
var MediaDocMediaMetaRecordValidator = /** @class */ (function (_super) {
    __extends(MediaDocMediaMetaRecordValidator, _super);
    function MediaDocMediaMetaRecordValidator() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MediaDocMediaMetaRecordValidator.prototype.validateMyFieldRules = function (values, errors, fieldPrefix, errFieldPrefix) {
        fieldPrefix = fieldPrefix !== undefined ? fieldPrefix : '';
        errFieldPrefix = errFieldPrefix !== undefined ? errFieldPrefix : '';
        var state = _super.prototype.validateMyFieldRules.call(this, values, errors, fieldPrefix, errFieldPrefix);
        return this.validateFieldRules(values, BaseMediaMetaRecord.mediametaFields, fieldPrefix, errors, errFieldPrefix) && state;
    };
    MediaDocMediaMetaRecordValidator.instance = new MediaDocMediaMetaRecordValidator();
    return MediaDocMediaMetaRecordValidator;
}(base_entity_record_1.BaseEntityRecordValidator));
exports.MediaDocMediaMetaRecordValidator = MediaDocMediaMetaRecordValidator;
//# sourceMappingURL=basemediameta-record.js.map