"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ObjectDetectionState;
(function (ObjectDetectionState) {
    ObjectDetectionState["UNKNOWN"] = "UNKNOWN";
    ObjectDetectionState["OPEN"] = "OPEN";
    ObjectDetectionState["ERROR"] = "ERROR";
    ObjectDetectionState["RETRY"] = "RETRY";
    ObjectDetectionState["RUNNING_SUGGESTED"] = "RUNNING_SUGGESTED";
    ObjectDetectionState["RUNNING_NO_SUGGESTION"] = "RUNNING_NO_SUGGESTION";
    ObjectDetectionState["RUNNING_MANUAL_APPROVED"] = "RUNNING_MANUAL_APPROVED";
    ObjectDetectionState["RUNNING_MANUAL_REJECTED"] = "RUNNING_MANUAL_REJECTED";
    ObjectDetectionState["RUNNING_MANUAL_CORRECTION_NEEDED"] = "RUNNING_MANUAL_CORRECTION_NEEDED";
    ObjectDetectionState["RUNNING_MANUAL_CORRECTED"] = "RUNNING_MANUAL_CORRECTED";
    ObjectDetectionState["RUNNING_MANUAL_DETAIL_NEEDED"] = "RUNNING_MANUAL_DETAILS_NEEDED";
    ObjectDetectionState["RUNNING_MANUAL_DETAILED"] = "RUNNING_MANUAL_DETAILED";
    ObjectDetectionState["DONE_APPROVAL_PROCESSED"] = "DONE_APPROVAL_PROCESSED";
    ObjectDetectionState["DONE_REJECTION_PROCESSED"] = "DONE_REJECTION_PROCESSED";
    ObjectDetectionState["DONE_CORRECTION_PROCESSED"] = "DONE_CORRECTION_PROCESSED";
    ObjectDetectionState["DONE_DETAIL_PROCESSED"] = "DONE_DETAIL_PROCESSED";
})(ObjectDetectionState = exports.ObjectDetectionState || (exports.ObjectDetectionState = {}));
var ObjectDetectionResponseCode;
(function (ObjectDetectionResponseCode) {
    ObjectDetectionResponseCode["OK"] = "OK";
    ObjectDetectionResponseCode["OK_WITH_HINTS"] = "OK_WITH_HINT";
    ObjectDetectionResponseCode["OK_WITH_WARNING"] = "OK_WITH_WARNING";
    ObjectDetectionResponseCode["RECOVERABLE_ERROR"] = "RECOVERABLE_ERROR";
    ObjectDetectionResponseCode["NONRECOVERABLE_ERROR"] = "NONRECOVERABLE_ERROR";
})(ObjectDetectionResponseCode = exports.ObjectDetectionResponseCode || (exports.ObjectDetectionResponseCode = {}));
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