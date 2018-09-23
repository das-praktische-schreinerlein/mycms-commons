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
var BaseMediaRecordFactory = /** @class */ (function () {
    function BaseMediaRecordFactory() {
    }
    BaseMediaRecordFactory.getSanitizedValues = function (values) {
        var sanitizedValues = {};
        sanitizedValues.id = base_entity_record_1.BaseEntityRecord.genericFields.id.validator.sanitize(values['id']) || undefined;
        sanitizedValues.descTxt = BaseMediaRecord.baseMediaFields.descTxt.validator.sanitize(values['descTxt']) || undefined;
        sanitizedValues.descMd = BaseMediaRecord.baseMediaFields.descMd.validator.sanitize(values['descMd']) || undefined;
        sanitizedValues.descHtml = BaseMediaRecord.baseMediaFields.descHtml.validator.sanitize(values['descHtml']) || undefined;
        sanitizedValues.name = BaseMediaRecord.baseMediaFields.name.validator.sanitize(values['name']) || undefined;
        sanitizedValues.fileName = BaseMediaRecord.baseMediaFields.fileName.validator.sanitize(values['fileName']) || undefined;
        return sanitizedValues;
    };
    BaseMediaRecordFactory.getSanitizedValuesFromObj = function (doc) {
        return BaseMediaRecordFactory.getSanitizedValues(doc);
    };
    return BaseMediaRecordFactory;
}());
exports.BaseMediaRecordFactory = BaseMediaRecordFactory;
var BaseMediaRecordValidator = /** @class */ (function (_super) {
    __extends(BaseMediaRecordValidator, _super);
    function BaseMediaRecordValidator() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BaseMediaRecordValidator.prototype.validateMyRules = function (values, errors, fieldPrefix, errFieldPrefix) {
        fieldPrefix = fieldPrefix !== undefined ? fieldPrefix : '';
        errFieldPrefix = errFieldPrefix !== undefined ? errFieldPrefix : '';
        var state = _super.prototype.validateMyRules.call(this, values, errors, fieldPrefix, errFieldPrefix);
        state = this.validateRule(values, BaseMediaRecord.baseMediaFields.descTxt.validator, fieldPrefix + 'descTxt', errors, errFieldPrefix) && state;
        state = this.validateRule(values, BaseMediaRecord.baseMediaFields.descMd.validator, fieldPrefix + 'descMd', errors, errFieldPrefix) && state;
        state = this.validateRule(values, BaseMediaRecord.baseMediaFields.descHtml.validator, fieldPrefix + 'descHtml', errors, errFieldPrefix) && state;
        state = this.validateRule(values, BaseMediaRecord.baseMediaFields.name.validator, fieldPrefix + 'name', errors, errFieldPrefix) && state;
        state = this.validateRule(values, BaseMediaRecord.baseMediaFields.fileName.validator, fieldPrefix + 'fileName', errors, errFieldPrefix) && state;
        return state;
    };
    BaseMediaRecordValidator.instance = new BaseMediaRecordValidator();
    return BaseMediaRecordValidator;
}(base_entity_record_1.BaseEntityRecordValidator));
exports.BaseMediaRecordValidator = BaseMediaRecordValidator;
//# sourceMappingURL=basemedia-record.js.map