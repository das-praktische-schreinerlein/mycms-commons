"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ObjectDetectionState;
(function (ObjectDetectionState) {
    ObjectDetectionState["UNKNOWN"] = "UNKNOWN";
    ObjectDetectionState["OPEN"] = "OPEN";
    ObjectDetectionState["ERROR"] = "ERROR";
    ObjectDetectionState["RUNNING_SUGGESTED"] = "RUNNING_SUGGESTED";
    ObjectDetectionState["RUNNING_MANUAL_APPROVED"] = "RUNNING_MANUAL_APPROVED";
    ObjectDetectionState["RUNNING_MANUAL_REJECTED"] = "RUNNING_MANUAL_REJECTED";
    ObjectDetectionState["RUNNING_MANUAL_CORRECTION_NEEDED"] = "RUNNING_MANUAL_CORRECTION_NEEDED";
    ObjectDetectionState["RUNNING_MANUAL_CORRECTED"] = "RUNNING_MANUAL_CORRECTED";
    ObjectDetectionState["DONE_APPROVAL_PROCESSED"] = "DONE_APPROVAL_PROCESSED";
    ObjectDetectionState["DONE_REJECTION_PROCESSED"] = "DONE_REJECTION_PROCESSED";
    ObjectDetectionState["DONE_CORRECTION_PROCESSED"] = "DONE_CORRECTION_PROCESSED";
})(ObjectDetectionState = exports.ObjectDetectionState || (exports.ObjectDetectionState = {}));
var ObjectDetectionRequest = /** @class */ (function () {
    function ObjectDetectionRequest() {
    }
    return ObjectDetectionRequest;
}());
exports.ObjectDetectionRequest = ObjectDetectionRequest;
var ObjectDetectionDetectedObject = /** @class */ (function () {
    function ObjectDetectionDetectedObject() {
    }
    return ObjectDetectionDetectedObject;
}());
exports.ObjectDetectionDetectedObject = ObjectDetectionDetectedObject;
var ObjectDetectionResponse = /** @class */ (function () {
    function ObjectDetectionResponse() {
    }
    return ObjectDetectionResponse;
}());
exports.ObjectDetectionResponse = ObjectDetectionResponse;
//# sourceMappingURL=objectdetection-model.js.map