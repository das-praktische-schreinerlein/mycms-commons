import { BaseMediaRecord, BaseMediaRecordType, BaseMediaRecordValidator } from "./basemedia-record";
export interface BaseAudioRecordType extends BaseMediaRecordType {
}
export declare class BaseAudioRecord extends BaseMediaRecord implements BaseAudioRecordType {
    getMediaId(): string;
    toString(): string;
}
export declare class BaseAudioRecordFactory {
    static getSanitizedValues(values: {}): any;
    static getSanitizedValuesFromObj(doc: BaseAudioRecord): any;
}
export declare class BaseAudioRecordValidator extends BaseMediaRecordValidator {
    static instance: BaseAudioRecordValidator;
}
