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
var BaseExtendedObjectPropertyRecord = /** @class */ (function (_super) {
    __extends(BaseExtendedObjectPropertyRecord, _super);
    function BaseExtendedObjectPropertyRecord() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BaseExtendedObjectPropertyRecord.prototype.toString = function () {
        return 'BaseExtendedObjectPropertyRecord Record {\n' +
            '  id: ' + this.id + ',\n' +
            '  category: ' + this.category + ',\n' +
            '  name: ' + this.name + ',\n' +
            '  value: ' + this.value + ')\n' +
            '}';
    };
    BaseExtendedObjectPropertyRecord.extendedObjectPropertyFields = {
        category: new base_entity_record_1.BaseEntityRecordFieldConfig(generic_validator_util_1.GenericValidatorDatatypes.NAME, new generic_validator_util_1.NameValidationRule(true)),
        name: new base_entity_record_1.BaseEntityRecordFieldConfig(generic_validator_util_1.GenericValidatorDatatypes.NAME, new generic_validator_util_1.NameValidationRule(true)),
        value: new base_entity_record_1.BaseEntityRecordFieldConfig(generic_validator_util_1.GenericValidatorDatatypes.FULLTEXT, new generic_validator_util_1.HtmlValidationRule(false))
    };
    return BaseExtendedObjectPropertyRecord;
}(base_entity_record_1.BaseEntityRecord));
exports.BaseExtendedObjectPropertyRecord = BaseExtendedObjectPropertyRecord;
//# sourceMappingURL=baseextendedobjectproperty-record.js.map