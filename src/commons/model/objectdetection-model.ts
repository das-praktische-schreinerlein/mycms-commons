export enum ObjectDetectionState {
    UNKNOWN='UNKNOWN', OPEN='OPEN', ERROR='ERROR', RETRY='RETRY',
    RUNNING_SUGGESTED='RUNNING_SUGGESTED', RUNNING_NO_SUGGESTION='RUNNING_NO_SUGGESTION',
    RUNNING_MANUAL_APPROVED='RUNNING_MANUAL_APPROVED', RUNNING_MANUAL_REJECTED='RUNNING_MANUAL_REJECTED', RUNNING_MANUAL_CORRECTION_NEEDED='RUNNING_MANUAL_CORRECTION_NEEDED', RUNNING_MANUAL_CORRECTED='RUNNING_MANUAL_CORRECTED',
    DONE_APPROVAL_PROCESSED='DONE_APPROVAL_PROCESSED', DONE_REJECTION_PROCESSED='DONE_REJECTION_PROCESSED', DONE_CORRECTION_PROCESSED='DONE_CORRECTION_PROCESSED'
}

export interface ObjectDetectionRequestType {
    detectors: string[];
    state: ObjectDetectionState;
    keySuggestions: string[];
    imgWidth: number;
    imgHeight: number;
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
    objX: number;
    objY: number;
    objWidth: number;
    objHeight: number;
    precision: number;
    fileName: string;
}

export enum ObjectDetectionResponseCode {
    OK='OK', OK_WITH_HINTS='OK_WITH_HINT', OK_WITH_WARNING='OK_WITH_WARNING', RECOVERABLE_ERROR='RECOVERABLE_ERROR',
    NONRECOVERABLE_ERROR='NONRECOVERABLE_ERROR'
}

export interface ObjectDetectionResponseType {
    request: ObjectDetectionRequestType;
    results: ObjectDetectionDetectedObjectType[];
    responseCode: ObjectDetectionResponseCode;
    responseMessages: string[];
}

export class ObjectDetectionRequest implements ObjectDetectionRequestType {
    detectors: string[];
    state: ObjectDetectionState;
    keySuggestions: string[];
    imgWidth: number;
    imgHeight: number;
    objX: number;
    objY: number;
    objWidth: number;
    objHeight: number;
    precision: number;
    fileName: string;
    refId: any;
}

export class ObjectDetectionDetectedObject implements ObjectDetectionDetectedObjectType {
    detector: string;
    key: string;
    keySuggestion: string;
    keyCorrection: string;
    state: ObjectDetectionState;
    imgWidth: number;
    imgHeight: number;
    objX: number;
    objY: number;
    objWidth: number;
    objHeight: number;
    precision: number;
    fileName: string;
}

export class ObjectDetectionResponse implements ObjectDetectionResponseType{
    request: ObjectDetectionRequestType;
    results: ObjectDetectionDetectedObjectType[];
    responseCode: ObjectDetectionResponseCode;
    responseMessages: string[];
}
