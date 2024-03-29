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
var basemedia_record_1 = require("./basemedia-record");
var BaseImageRecord = /** @class */ (function (_super) {
    __extends(BaseImageRecord, _super);
    function BaseImageRecord() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BaseImageRecord.prototype.getMediaId = function () {
        return 'notimplemented';
    };
    BaseImageRecord.prototype.toString = function () {
        return 'BaseImageRecord Record {\n' +
            '  id: ' + this.id + ',\n' +
            '  fileName: ' + this.fileName + '\n' +
            '  name: ' + this.name + ',\n' +
            '}';
    };
    return BaseImageRecord;
}(basemedia_record_1.BaseMediaRecord));
exports.BaseImageRecord = BaseImageRecord;
var BaseImageRecordFactory = /** @class */ (function (_super) {
    __extends(BaseImageRecordFactory, _super);
    function BaseImageRecordFactory() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BaseImageRecordFactory.createSanitized = function (values) {
        var sanitizedValues = BaseImageRecordFactory.instance.getSanitizedValues(values, {});
        return new BaseImageRecord(sanitizedValues);
    };
    BaseImageRecordFactory.cloneSanitized = function (doc) {
        var sanitizedValues = BaseImageRecordFactory.instance.getSanitizedValuesFromObj(doc);
        return new BaseImageRecord(sanitizedValues);
    };
    BaseImageRecordFactory.instance = new BaseImageRecordFactory();
    return BaseImageRecordFactory;
}(basemedia_record_1.BaseMediaRecordFactory));
exports.BaseImageRecordFactory = BaseImageRecordFactory;
var BaseImageRecordValidator = /** @class */ (function (_super) {
    __extends(BaseImageRecordValidator, _super);
    function BaseImageRecordValidator() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BaseImageRecordValidator.instance = new BaseImageRecordValidator();
    return BaseImageRecordValidator;
}(basemedia_record_1.BaseMediaRecordValidator));
exports.BaseImageRecordValidator = BaseImageRecordValidator;
//# sourceMappingURL=baseimage-record.js.map