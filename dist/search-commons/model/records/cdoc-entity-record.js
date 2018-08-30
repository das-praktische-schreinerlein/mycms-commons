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
        return CommonDocRecordValidator.isValid(this);
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
var CommonDocRecordValidator = /** @class */ (function () {
    function CommonDocRecordValidator() {
    }
    CommonDocRecordValidator.isValidValues = function (values) {
        return CommonDocRecordValidator.validateValues(values).length > 0;
    };
    CommonDocRecordValidator.validateValues = function (values) {
        var errors = [];
        var state = true;
        state = !base_entity_record_1.BaseEntityRecord.genericFields.id.validator.isValid(values['id']) ? errors.push('id') && false : true;
        state = !CommonDocRecord.cdocFields.blocked.validator.isValid(values['blocked']) ? errors.push('blocked') && false : true;
        state = !CommonDocRecord.cdocFields.dateshow.validator.isValid(values['dateshow']) ? errors.push('dateshow') && false : true;
        state = !CommonDocRecord.cdocFields.descTxt.validator.isValid(values['descTxt']) ? errors.push('descTxt') && false : true;
        state = !CommonDocRecord.cdocFields.descMd.validator.isValid(values['descMd']) ? errors.push('descMd') && false : true;
        state = !CommonDocRecord.cdocFields.descHtml.validator.isValid(values['descHtml']) ? errors.push('descHtml') && false : true;
        state = !CommonDocRecord.cdocFields.keywords.validator.isValid(values['keywords']) ? errors.push('keywords') && false : true;
        state = !CommonDocRecord.cdocFields.name.validator.isValid(values['name']) ? errors.push('name') && false : true;
        state = !CommonDocRecord.cdocFields.playlists.validator.isValid(values['playlists']) ? errors.push('playlists') && false : true;
        state = !CommonDocRecord.cdocFields.subtype.validator.isValid(values['subtype']) ? errors.push('subtype') && false : true;
        state = !CommonDocRecord.cdocFields.type.validator.isValid(values['type']) ? errors.push('type') && false : true;
        return errors;
    };
    CommonDocRecordValidator.isValid = function (cdoc) {
        return CommonDocRecordValidator.validate(cdoc).length > 0;
    };
    CommonDocRecordValidator.validate = function (cdoc) {
        var errors = [];
        var state = base_entity_record_1.BaseEntityRecord.genericFields.id.validator.isValid(cdoc.id) ? errors.push('id') && false : true;
        state = !CommonDocRecord.cdocFields.blocked.validator.isValid(cdoc.blocked) ? errors.push('blocked') && false : true;
        state = !CommonDocRecord.cdocFields.dateshow.validator.isValid(cdoc.dateshow) ? errors.push('dateshow') && false : true;
        state = !CommonDocRecord.cdocFields.descTxt.validator.isValid(cdoc.descTxt) ? errors.push('descTxt') && false : true;
        state = !CommonDocRecord.cdocFields.descMd.validator.isValid(cdoc.descMd) ? errors.push('descMd') && false : true;
        state = !CommonDocRecord.cdocFields.descHtml.validator.isValid(cdoc.descHtml) ? errors.push('descHtml') && false : true;
        state = !CommonDocRecord.cdocFields.keywords.validator.isValid(cdoc.keywords) ? errors.push('keywords') && false : true;
        state = !CommonDocRecord.cdocFields.name.validator.isValid(cdoc.name) ? errors.push('name') && false : true;
        state = !CommonDocRecord.cdocFields.playlists.validator.isValid(cdoc.playlists) ? errors.push('playlists') && false : true;
        state = !CommonDocRecord.cdocFields.subtype.validator.isValid(cdoc.subtype) ? errors.push('subtype') && false : true;
        state = !CommonDocRecord.cdocFields.type.validator.isValid(cdoc.type) ? errors.push('type') && false : true;
        return errors;
    };
    return CommonDocRecordValidator;
}());
exports.CommonDocRecordValidator = CommonDocRecordValidator;
//# sourceMappingURL=cdoc-entity-record.js.map