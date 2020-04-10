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
var BaseNavigationObjectRecord = /** @class */ (function (_super) {
    __extends(BaseNavigationObjectRecord, _super);
    function BaseNavigationObjectRecord() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BaseNavigationObjectRecord.prototype.toString = function () {
        return 'BaseNavigationObjectRecord Record {\n' +
            '  id: ' + this.id + ',\n' +
            '  navid: ' + this.navid + ',\n' +
            '  name: ' + this.name + ',\n' +
            '  navtype: ' + this.navtype + ')\n' +
            '}';
    };
    BaseNavigationObjectRecord.navigationObjectFields = {
        name: new base_entity_record_1.BaseEntityRecordFieldConfig(generic_validator_util_1.GenericValidatorDatatypes.NAME, new generic_validator_util_1.NameValidationRule(false)),
        navid: new base_entity_record_1.BaseEntityRecordFieldConfig(generic_validator_util_1.GenericValidatorDatatypes.ID, new generic_validator_util_1.IdValidationRule(true)),
        navtype: new base_entity_record_1.BaseEntityRecordFieldConfig(generic_validator_util_1.GenericValidatorDatatypes.NAME, new generic_validator_util_1.NameValidationRule(true))
    };
    return BaseNavigationObjectRecord;
}(base_entity_record_1.BaseEntityRecord));
exports.BaseNavigationObjectRecord = BaseNavigationObjectRecord;
//# sourceMappingURL=basenavigationobject-record.js.map