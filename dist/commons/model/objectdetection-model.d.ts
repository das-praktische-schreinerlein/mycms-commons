export declare enum ObjectDetectionState {
    UNKNOWN = "UNKNOWN",
    OPEN = "OPEN",
    ERROR = "ERROR",
    RETRY = "RETRY",
    RUNNING_SUGGESTED = "RUNNING_SUGGESTED",
    RUNNING_NO_SUGGESTION = "RUNNING_NO_SUGGESTION",
    RUNNING_MANUAL_APPROVED = "RUNNING_MANUAL_APPROVED",
    RUNNING_MANUAL_REJECTED = "RUNNING_MANUAL_REJECTED",
    RUNNING_MANUAL_CORRECTION_NEEDED = "RUNNING_MANUAL_CORRECTION_NEEDED",
    RUNNING_MANUAL_CORRECTED = "RUNNING_MANUAL_CORRECTED",
    RUNNING_MANUAL_DETAIL_NEEDED = "RUNNING_MANUAL_DETAILS_NEEDED",
    RUNNING_MANUAL_DETAILED = "RUNNING_MANUAL_DETAILED",
    DONE_APPROVAL_PROCESSED = "DONE_APPROVAL_PROCESSED",
    DONE_REJECTION_PROCESSED = "DONE_REJECTION_PROCESSED",
    DONE_CORRECTION_PROCESSED = "DONE_CORRECTION_PROCESSED",
    DONE_DETAIL_PROCESSED = "DONE_DETAIL_PROCESSED"
}
export interface ObjectDetectionRequestType {
    detectors: string[];
    state: ObjectDetectionState;
    keySuggestions: string[];
    imgWidth: number;
    imgHeight: number;
    imgOrientation: string;
    objX: number;
    objY: number;
    objWidth: number;
    objHeight: number;
    precision: number;
    fileName: string;
    refId: any;
}
export interface ObjectDetectionDetectedObjectType {
    detector: string;
    key: string;
    keySuggestion: string;
    keyCorrection: string;
    state: ObjectDetectionState;
    imgWidth: number;
    imgHeight: number;
    imgOrientation: string;
    objX: number;
    objY: number;
    objWidth: number;
    objHeight: number;
    objType?: string;
    objId?: string;
    objParentId?: string;
    objDescriptor?: string;
    objDetails?: string;
    precision: number;
    fileName: string;
}
export declare enum ObjectDetectionResponseCode {
    OK = "OK",
    OK_WITH_HINTS = "OK_WITH_HINT",
    OK_WITH_WARNING = "OK_WITH_WARNING",
    RECOVERABLE_ERROR = "RECOVERABLE_ERROR",
    NONRECOVERABLE_ERROR = "NONRECOVERABLE_ERROR"
}
export interface ObjectDetectionResponseType {
    request: ObjectDetectionRequestType;
    results: ObjectDetectionDetectedObjectType[];
    responseCode: ObjectDetectionResponseCode;
    responseMessages: string[];
}
export declare class ObjectDetectionRequest implements ObjectDetectionRequestType {
    detectors: string[];
    state: ObjectDetectionState;
    keySuggestions: string[];
    imgWidth: number;
    imgHeight: number;
    imgOrientation: string;
    objX: number;
    objY: number;
    objWidth: number;
    objHeight: number;
    precision: number;
    fileName: string;
    refId: any;
}
export declare class ObjectDetectionDetectedObject implements ObjectDetectionDetectedObjectType {
    detector: string;
    key: string;
    keySuggestion: string;
    keyCorrection: string;
    state: ObjectDetectionState;
    imgWidth: number;
    imgHeight: number;
    imgOrientation: string;
    objX: number;
    objY: number;
    objWidth: number;
    objHeight: number;
    objType?: string;
    objId?: string;
    objParentId?: string;
    objDescriptor?: string;
    objDetails?: string;
    precision: number;
    fileName: string;
}
export declare class ObjectDetectionResponse implements ObjectDetectionResponseType {
    request: ObjectDetectionRequestType;
    results: ObjectDetectionDetectedObjectType[];
    responseCode: ObjectDetectionResponseCode;
    responseMessages: string[];
}
