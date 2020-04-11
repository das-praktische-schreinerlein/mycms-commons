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
var generic_validator_util_1 = require("../forms/generic-validator.util");
var base_entity_record_1 = require("./base-entity-record");
var util_1 = require("util");
var CommonDocRecord = /** @class */ (function (_super) {
    __extends(CommonDocRecord, _super);
    function CommonDocRecord() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CommonDocRecord.cloneToSerializeToJsonObj = function (baseRecord, anonymizeMedia) {
        var record = {};
        for (var key in baseRecord) {
            record[key] = baseRecord[key];
        }
        if (anonymizeMedia === true) {
            if (util_1.isArray(record['cdocimages'])) {
                for (var _i = 0, _a = record['cdocimages']; _i < _a.length; _i++) {
                    var media = _a[_i];
                    media.fileName = 'anonymized.JPG';
                }
            }
            if (util_1.isArray(record['cdocvideos'])) {
                for (var _b = 0, _c = record['cdocvideos']; _b < _c.length; _b++) {
                    var media = _c[_b];
                    media.fileName = 'anonymized.MP4';
                }
            }
        }
        return record;
    };
    CommonDocRecord.prototype.toString = function () {
        return 'CommonDocRecord Record {\n' +
            '  id: ' + this.id + ',\n' +
            '  name: ' + this.name + ',\n' +
            '  type: ' + this.type + '' +
            '}';
    };
    CommonDocRecord.prototype.toSerializableJsonObj = function (anonymizeMedia) {
        return CommonDocRecord.cloneToSerializeToJsonObj(this, anonymizeMedia);
    };
    CommonDocRecord.prototype.isValid = function () {
        return CommonDocRecordValidator.instance.isValid(this);
    };
    CommonDocRecord.cdocFields = {
        blocked: new base_entity_record_1.BaseEntityRecordFieldConfig(generic_validator_util_1.GenericValidatorDatatypes.NUMBER, new generic_validator_util_1.NumberValidationRule(false, -5, 5, undefined)),
        dateshow: new base_entity_record_1.BaseEntityRecordFieldConfig(generic_validator_util_1.GenericValidatorDatatypes.DATE, new generic_validator_util_1.DateValidationRule(false)),
        descTxt: new base_entity_record_1.BaseEntityRecordFieldConfig(generic_validator_util_1.GenericValidatorDatatypes.TEXT, new generic_validator_util_1.DescValidationRule(false)),
        descMd: new base_entity_record_1.BaseEntityRecordFieldConfig(generic_validator_util_1.GenericValidatorDatatypes.MARKDOWN, new generic_validator_util_1.MarkdownValidationRule(false)),
        descHtml: new base_entity_record_1.BaseEntityRecordFieldConfig(generic_validator_util_1.GenericValidatorDatatypes.HTML, new generic_validator_util_1.HtmlValidationRule(false)),
        keywords: new base_entity_record_1.BaseEntityRecordFieldConfig(generic_validator_util_1.GenericValidatorDatatypes.WHAT_KEY_CSV, new generic_validator_util_1.KeywordValidationRule(false)),
        name: new base_entity_record_1.BaseEntityRecordFieldConfig(generic_validator_util_1.GenericValidatorDatatypes.NAME, new generic_validator_util_1.NameValidationRule(true)),
        playlists: new base_entity_record_1.BaseEntityRecordFieldConfig(generic_validator_util_1.GenericValidatorDatatypes.WHAT_KEY_CSV, new generic_validator_util_1.TextValidationRule(false)),
        subtype: new base_entity_record_1.BaseEntityRecordFieldConfig(generic_validator_util_1.GenericValidatorDatatypes.ID, new generic_validator_util_1.IdValidationRule(false)),
        type: new base_entity_record_1.BaseEntityRecordFieldConfig(generic_validator_util_1.GenericValidatorDatatypes.ID, new generic_validator_util_1.IdValidationRule(true))
    };
    return CommonDocRecord;
}(base_entity_record_1.BaseEntityRecord));
exports.CommonDocRecord = CommonDocRecord;
var CommonDocRecordFactory = /** @class */ (function (_super) {
    __extends(CommonDocRecordFactory, _super);
    function CommonDocRecordFactory() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CommonDocRecordFactory.createSanitized = function (values) {
        var sanitizedValues = CommonDocRecordFactory.instance.getSanitizedValues(values, {});
        return new CommonDocRecord(sanitizedValues);
    };
    CommonDocRecordFactory.cloneSanitized = function (doc) {
        var sanitizedValues = CommonDocRecordFactory.instance.getSanitizedValuesFromObj(doc);
        return new CommonDocRecord(sanitizedValues);
    };
    CommonDocRecordFactory.prototype.getSanitizedValues = function (values, result) {
        _super.prototype.getSanitizedValues.call(this, values, result);
        this.sanitizeFieldValues(values, CommonDocRecord.cdocFields, result, '');
        return result;
    };
    CommonDocRecordFactory.instance = new CommonDocRecordFactory();
    return CommonDocRecordFactory;
}(base_entity_record_1.BaseEntityRecordFactory));
exports.CommonDocRecordFactory = CommonDocRecordFactory;
var CommonDocRecordValidator = /** @class */ (function (_super) {
    __extends(CommonDocRecordValidator, _super);
    function CommonDocRecordValidator() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CommonDocRecordValidator.prototype.validateMyFieldRules = function (values, errors, fieldPrefix, errFieldPrefix) {
        fieldPrefix = fieldPrefix !== undefined ? fieldPrefix : '';
        errFieldPrefix = errFieldPrefix !== undefined ? errFieldPrefix : '';
        var state = _super.prototype.validateMyFieldRules.call(this, values, errors, fieldPrefix, errFieldPrefix);
        return this.validateFieldRules(values, CommonDocRecord.cdocFields, fieldPrefix, errors, errFieldPrefix) && state;
    };
    CommonDocRecordValidator.instance = new CommonDocRecordValidator();
    return CommonDocRecordValidator;
}(base_entity_record_1.BaseEntityRecordValidator));
exports.CommonDocRecordValidator = CommonDocRecordValidator;
//# sourceMappingURL=cdoc-entity-record.js.map