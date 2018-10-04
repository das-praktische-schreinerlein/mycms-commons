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
var base_entity_record_1 = require("./base-entity-record");
var generic_validator_util_1 = require("../forms/generic-validator.util");
var BaseMediaRecord = /** @class */ (function (_super) {
    __extends(BaseMediaRecord, _super);
    function BaseMediaRecord() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BaseMediaRecord.prototype.getMediaId = function () {
        return 'notimplemented';
    };
    BaseMediaRecord.prototype.toString = function () {
        return 'BaseImageRecord Record {\n' +
            '  id: ' + this.id + ',\n' +
            '  fileName: ' + this.fileName + '\n' +
            '  name: ' + this.name + ',\n' +
            '}';
    };
    BaseMediaRecord.baseMediaFields = {
        descTxt: new base_entity_record_1.BaseEntityRecordFieldConfig(generic_validator_util_1.GenericValidatorDatatypes.TEXT, new generic_validator_util_1.DescValidationRule(false)),
        descMd: new base_entity_record_1.BaseEntityRecordFieldConfig(generic_validator_util_1.GenericValidatorDatatypes.MARKDOWN, new generic_validator_util_1.MarkdownValidationRule(false)),
        descHtml: new base_entity_record_1.BaseEntityRecordFieldConfig(generic_validator_util_1.GenericValidatorDatatypes.HTML, new generic_validator_util_1.HtmlValidationRule(false)),
        name: new base_entity_record_1.BaseEntityRecordFieldConfig(generic_validator_util_1.GenericValidatorDatatypes.NAME, new generic_validator_util_1.NameValidationRule(true)),
        fileName: new base_entity_record_1.BaseEntityRecordFieldConfig(generic_validator_util_1.GenericValidatorDatatypes.FILENAME, new generic_validator_util_1.PathValidationRule(true))
    };
    return BaseMediaRecord;
}(base_entity_record_1.BaseEntityRecord));
exports.BaseMediaRecord = BaseMediaRecord;
var BaseMediaRecordFactory = /** @class */ (function (_super) {
    __extends(BaseMediaRecordFactory, _super);
    function BaseMediaRecordFactory() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BaseMediaRecordFactory.createSanitized = function (values) {
        var sanitizedValues = BaseMediaRecordFactory.instance.getSanitizedValues(values, {});
        return new BaseMediaRecord(sanitizedValues);
    };
    BaseMediaRecordFactory.cloneSanitized = function (doc) {
        var sanitizedValues = BaseMediaRecordFactory.instance.getSanitizedValuesFromObj(doc);
        return new BaseMediaRecord(sanitizedValues);
    };
    BaseMediaRecordFactory.prototype.getSanitizedValues = function (values, result) {
        _super.prototype.getSanitizedValues.call(this, values, result);
        this.sanitizeFieldValues(values, BaseMediaRecord.baseMediaFields, result, '');
        return result;
    };
    BaseMediaRecordFactory.instance = new BaseMediaRecordFactory();
    return BaseMediaRecordFactory;
}(base_entity_record_1.BaseEntityRecordFactory));
exports.BaseMediaRecordFactory = BaseMediaRecordFactory;
var BaseMediaRecordValidator = /** @class */ (function (_super) {
    __extends(BaseMediaRecordValidator, _super);
    function BaseMediaRecordValidator() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BaseMediaRecordValidator.prototype.validateMyFieldRules = function (values, errors, fieldPrefix, errFieldPrefix) {
        fieldPrefix = fieldPrefix !== undefined ? fieldPrefix : '';
        errFieldPrefix = errFieldPrefix !== undefined ? errFieldPrefix : '';
        var state = _super.prototype.validateMyFieldRules.call(this, values, errors, fieldPrefix, errFieldPrefix);
        return this.validateFieldRules(values, BaseMediaRecord.baseMediaFields, fieldPrefix, errors, errFieldPrefix) && state;
    };
    BaseMediaRecordValidator.instance = new BaseMediaRecordValidator();
    return BaseMediaRecordValidator;
}(base_entity_record_1.BaseEntityRecordValidator));
exports.BaseMediaRecordValidator = BaseMediaRecordValidator;
//# sourceMappingURL=basemedia-record.js.map