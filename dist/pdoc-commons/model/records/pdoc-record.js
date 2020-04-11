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
var base_entity_record_1 = require("../../../search-commons/model/records/base-entity-record");
var PDocRecord = /** @class */ (function (_super) {
    __extends(PDocRecord, _super);
    function PDocRecord() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PDocRecord.prototype.toString = function () {
        return 'PDocRecord Record {\n' +
            '  id: ' + this.id + ',\n' +
            '  heading: ' + this.name + ',\n' +
            '  name: ' + this.name + ',\n' +
            '  theme: ' + this.theme + '' +
            '  type: ' + this.type + '' +
            '}';
    };
    return PDocRecord;
}(base_entity_record_1.BaseEntityRecord));
exports.PDocRecord = PDocRecord;
exports.PDocRecordRelation = {};
//# sourceMappingURL=pdoc-record.js.map