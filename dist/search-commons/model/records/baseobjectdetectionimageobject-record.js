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
var baseimage_record_1 = require("./baseimage-record");
var BaseObjectDetectionImageObjectRecord = /** @class */ (function (_super) {
    __extends(BaseObjectDetectionImageObjectRecord, _super);
    function BaseObjectDetectionImageObjectRecord() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BaseObjectDetectionImageObjectRecord.prototype.toString = function () {
        return 'BaseObjectDetectionImageObjectRecord Record {\n' +
            '  id: ' + this.id + ',\n' +
            '  detector: ' + this.detector + ',\n' +
            '  category: ' + this.category + ',\n' +
            '  key: ' + this.key + ',\n' +
            '  pos: ' + this.objX + ',' + this.objY + '(' + this.objWidth + ',' + this.objHeight + ')\n' +
            '}';
    };
    BaseObjectDetectionImageObjectRecord.objectDetectionImageObjectFields = {
        category: new base_entity_record_1.BaseEntityRecordFieldConfig(generic_validator_util_1.GenericValidatorDatatypes.NAME, new generic_validator_util_1.NameValidationRule(true)),
        detector: new base_entity_record_1.BaseEntityRecordFieldConfig(generic_validator_util_1.GenericValidatorDatatypes.NAME, new generic_validator_util_1.NameValidationRule(true)),
        key: new base_entity_record_1.BaseEntityRecordFieldConfig(generic_validator_util_1.GenericValidatorDatatypes.NAME, new generic_validator_util_1.NameValidationRule(true)),
        keySuggestion: new base_entity_record_1.BaseEntityRecordFieldConfig(generic_validator_util_1.GenericValidatorDatatypes.NAME, new generic_validator_util_1.NameValidationRule(false)),
        keyCorrection: new base_entity_record_1.BaseEntityRecordFieldConfig(generic_validator_util_1.GenericValidatorDatatypes.NAME, new generic_validator_util_1.NameValidationRule(false)),
        state: new base_entity_record_1.BaseEntityRecordFieldConfig(generic_validator_util_1.GenericValidatorDatatypes.NAME, new generic_validator_util_1.NameValidationRule(true)),
        imgWidth: new base_entity_record_1.BaseEntityRecordFieldConfig(generic_validator_util_1.GenericValidatorDatatypes.NUMBER, new generic_validator_util_1.NumberValidationRule(false, 0, 999999, 0)),
        imgHeight: new base_entity_record_1.BaseEntityRecordFieldConfig(generic_validator_util_1.GenericValidatorDatatypes.NUMBER, new generic_validator_util_1.NumberValidationRule(false, 0, 999999, 0)),
        objX: new base_entity_record_1.BaseEntityRecordFieldConfig(generic_validator_util_1.GenericValidatorDatatypes.NUMBER, new generic_validator_util_1.NumberValidationRule(false, 0, 999999, 0)),
        objY: new base_entity_record_1.BaseEntityRecordFieldConfig(generic_validator_util_1.GenericValidatorDatatypes.NUMBER, new generic_validator_util_1.NumberValidationRule(false, 0, 999999, 0)),
        objWidth: new base_entity_record_1.BaseEntityRecordFieldConfig(generic_validator_util_1.GenericValidatorDatatypes.NUMBER, new generic_validator_util_1.NumberValidationRule(false, 0, 999999, 0)),
        objHeight: new base_entity_record_1.BaseEntityRecordFieldConfig(generic_validator_util_1.GenericValidatorDatatypes.NUMBER, new generic_validator_util_1.NumberValidationRule(false, 0, 999999, 0)),
        precision: new base_entity_record_1.BaseEntityRecordFieldConfig(generic_validator_util_1.GenericValidatorDatatypes.NUMBER, new generic_validator_util_1.NumberValidationRule(false, 0, 999999, 0))
    };
    return BaseObjectDetectionImageObjectRecord;
}(baseimage_record_1.BaseImageRecord));
exports.BaseObjectDetectionImageObjectRecord = BaseObjectDetectionImageObjectRecord;
//# sourceMappingURL=baseobjectdetectionimageobject-record.js.map