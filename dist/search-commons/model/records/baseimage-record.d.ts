import { BaseMediaRecord, BaseMediaRecordType, BaseMediaRecordValidator } from "./basemedia-record";
export interface BaseImageRecordType extends BaseMediaRecordType {
}
export declare class BaseImageRecord extends BaseMediaRecord implements BaseImageRecordType {
    getMediaId(): string;
    toString(): string;
}
export declare class BaseImageRecordFactory {
    static getSanitizedValues(values: {}): any;
    static getSanitizedValuesFromObj(doc: BaseImageRecord): any;
}
export declare class BaseImageRecordValidator extends BaseMediaRecordValidator {
    static instance: BaseImageRecordValidator;
}
