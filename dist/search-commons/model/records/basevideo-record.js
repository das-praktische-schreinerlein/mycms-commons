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
var baseimage_record_1 = require("./baseimage-record");
var BaseVideoRecord = /** @class */ (function (_super) {
    __extends(BaseVideoRecord, _super);
    function BaseVideoRecord() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BaseVideoRecord.prototype.toString = function () {
        return 'BaseVideoRecord Record {\n' +
            '  id: ' + this.id + ',\n' +
            '  fileName: ' + this.fileName + '\n' +
            '  name: ' + this.name + ',\n' +
            '}';
    };
    return BaseVideoRecord;
}(baseimage_record_1.BaseImageRecord));
exports.BaseVideoRecord = BaseVideoRecord;
//# sourceMappingURL=basevideo-record.js.map