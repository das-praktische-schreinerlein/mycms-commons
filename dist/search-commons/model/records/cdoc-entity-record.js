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
        subtype: new base_entity_record_1.BaseEntityRecordFieldConfig(generic_validator_util_1.GenericValidatorDatatypes.ID, new generic_validator_util_1.IdValidationRule(true)),
        type: new base_entity_record_1.BaseEntityRecordFieldConfig(generic_validator_util_1.GenericValidatorDatatypes.ID, new generic_validator_util_1.IdValidationRule(true))
    };
    return CommonDocRecord;
}(base_entity_record_1.BaseEntityRecord));
exports.CommonDocRecord = CommonDocRecord;
var CommonDocRecordFactory = /** @class */ (function () {
    function CommonDocRecordFactory() {
    }
    CommonDocRecordFactory.getSanitizedValues = function (values) {
        var sanitizedValues = {};
        sanitizedValues.id = base_entity_record_1.BaseEntityRecord.genericFields.id.validator.sanitize(values['id']) || undefined;
        sanitizedValues.blocked = CommonDocRecord.cdocFields.blocked.validator.sanitize(values['blocked']) || undefined;
        sanitizedValues.dateshow = CommonDocRecord.cdocFields.dateshow.validator.sanitize(values['dateshow']) || undefined;
        sanitizedValues.descTxt = CommonDocRecord.cdocFields.descTxt.validator.sanitize(values['descTxt']) || undefined;
        sanitizedValues.descMd = CommonDocRecord.cdocFields.descMd.validator.sanitize(values['descMd']) || undefined;
        sanitizedValues.descHtml = CommonDocRecord.cdocFields.descHtml.validator.sanitize(values['descHtml']) || undefined;
        sanitizedValues.keywords = CommonDocRecord.cdocFields.keywords.validator.sanitize(values['keywords']) || undefined;
        sanitizedValues.name = CommonDocRecord.cdocFields.name.validator.sanitize(values['name']) || undefined;
        sanitizedValues.playlists = CommonDocRecord.cdocFields.playlists.validator.sanitize(values['playlists']) || undefined;
        sanitizedValues.subtype = CommonDocRecord.cdocFields.subtype.validator.sanitize(values['subtype']) || undefined;
        sanitizedValues.type = CommonDocRecord.cdocFields.type.validator.sanitize(values['type']) || undefined;
        return sanitizedValues;
    };
    CommonDocRecordFactory.getSanitizedValuesFromObj = function (doc) {
        return CommonDocRecordFactory.getSanitizedValues(doc);
    };
    return CommonDocRecordFactory;
}());
exports.CommonDocRecordFactory = CommonDocRecordFactory;
var CommonDocRecordValidator = /** @class */ (function (_super) {
    __extends(CommonDocRecordValidator, _super);
    function CommonDocRecordValidator() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CommonDocRecordValidator.prototype.validateMyRules = function (values, errors, fieldPrefix, errFieldPrefix) {
        fieldPrefix = fieldPrefix !== undefined ? fieldPrefix : '';
        errFieldPrefix = errFieldPrefix !== undefined ? errFieldPrefix : '';
        var state = _super.prototype.validateMyRules.call(this, values, errors, fieldPrefix, errFieldPrefix);
        state = this.validateRule(values, CommonDocRecord.cdocFields.blocked.validator, fieldPrefix + 'blocked', errors, errFieldPrefix) && state;
        state = this.validateRule(values, CommonDocRecord.cdocFields.dateshow.validator, fieldPrefix + 'dateshow', errors, errFieldPrefix) && state;
        state = this.validateRule(values, CommonDocRecord.cdocFields.descTxt.validator, fieldPrefix + 'descTxt', errors, errFieldPrefix) && state;
        state = this.validateRule(values, CommonDocRecord.cdocFields.descMd.validator, fieldPrefix + 'descMd', errors, errFieldPrefix) && state;
        state = this.validateRule(values, CommonDocRecord.cdocFields.descHtml.validator, fieldPrefix + 'descHtml', errors, errFieldPrefix) && state;
        state = this.validateRule(values, CommonDocRecord.cdocFields.keywords.validator, fieldPrefix + 'keywords', errors, errFieldPrefix) && state;
        state = this.validateRule(values, CommonDocRecord.cdocFields.name.validator, fieldPrefix + 'name', errors, errFieldPrefix) && state;
        state = this.validateRule(values, CommonDocRecord.cdocFields.playlists.validator, fieldPrefix + 'playlists', errors, errFieldPrefix) && state;
        state = this.validateRule(values, CommonDocRecord.cdocFields.subtype.validator, fieldPrefix + 'subtype', errors, errFieldPrefix) && state;
        state = this.validateRule(values, CommonDocRecord.cdocFields.type.validator, fieldPrefix + 'type', errors, errFieldPrefix) && state;
        return state;
    };
    CommonDocRecordValidator.instance = new CommonDocRecordValidator();
    return CommonDocRecordValidator;
}(base_entity_record_1.BaseEntityRecordValidator));
exports.CommonDocRecordValidator = CommonDocRecordValidator;
//# sourceMappingURL=cdoc-entity-record.js.map