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
var basemedia_record_1 = require("./basemedia-record");
var BaseAudioRecord = /** @class */ (function (_super) {
    __extends(BaseAudioRecord, _super);
    function BaseAudioRecord() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BaseAudioRecord.prototype.getMediaId = function () {
        return 'notimplemented';
    };
    BaseAudioRecord.prototype.toString = function () {
        return 'BaseAudioRecord Record {\n' +
            '  id: ' + this.id + ',\n' +
            '  fileName: ' + this.fileName + '\n' +
            '  name: ' + this.name + ',\n' +
            '}';
    };
    return BaseAudioRecord;
}(basemedia_record_1.BaseMediaRecord));
exports.BaseAudioRecord = BaseAudioRecord;
var BaseAudioRecordFactory = /** @class */ (function () {
    function BaseAudioRecordFactory() {
    }
    BaseAudioRecordFactory.getSanitizedValues = function (values) {
        return basemedia_record_1.BaseMediaRecordFactory.getSanitizedValues(values);
    };
    BaseAudioRecordFactory.getSanitizedValuesFromObj = function (doc) {
        return basemedia_record_1.BaseMediaRecordFactory.getSanitizedValuesFromObj(doc);
    };
    return BaseAudioRecordFactory;
}());
exports.BaseAudioRecordFactory = BaseAudioRecordFactory;
var BaseAudioRecordValidator = /** @class */ (function (_super) {
    __extends(BaseAudioRecordValidator, _super);
    function BaseAudioRecordValidator() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BaseAudioRecordValidator.instance = new BaseAudioRecordValidator();
    return BaseAudioRecordValidator;
}(basemedia_record_1.BaseMediaRecordValidator));
exports.BaseAudioRecordValidator = BaseAudioRecordValidator;
//# sourceMappingURL=baseaudio-record.js.map