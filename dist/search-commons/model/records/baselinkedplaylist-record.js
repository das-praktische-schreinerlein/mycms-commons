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
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var basejoin_record_1 = require("./basejoin-record");
var base_entity_record_1 = require("./base-entity-record");
var generic_validator_util_1 = require("../forms/generic-validator.util");
var BaseLinkedPlaylistRecord = /** @class */ (function (_super) {
    __extends(BaseLinkedPlaylistRecord, _super);
    function BaseLinkedPlaylistRecord() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BaseLinkedPlaylistRecord.prototype.toString = function () {
        return ' BaseLinkedPlaylistRecord Record {\n' +
            '  id: ' + this.id + ',\n' +
            '  refId: ' + this.refId + '\n' +
            '  name: ' + this.name + ',\n' +
            '  position: ' + this.position +
            '}';
    };
    BaseLinkedPlaylistRecord.baseLinkedPlaylistFields = __assign({}, basejoin_record_1.BaseJoinRecord.joinFields, { position: new base_entity_record_1.BaseEntityRecordFieldConfig(generic_validator_util_1.GenericValidatorDatatypes.NUMBER, new generic_validator_util_1.NumberValidationRule(false, 1, 999999999999, undefined)) });
    return BaseLinkedPlaylistRecord;
}(basejoin_record_1.BaseJoinRecord));
exports.BaseLinkedPlaylistRecord = BaseLinkedPlaylistRecord;
//# sourceMappingURL=baselinkedplaylist-record.js.map