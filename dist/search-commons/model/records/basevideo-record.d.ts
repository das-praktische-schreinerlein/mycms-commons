import { BaseMediaRecord, BaseMediaRecordType, BaseMediaRecordValidator } from "./basemedia-record";
export interface BaseVideoRecordType extends BaseMediaRecordType {
    toString(): string;
}
export declare class BaseVideoRecord extends BaseMediaRecord implements BaseVideoRecordType {
    toString(): string;
}
export declare class BaseVideoRecordFactory {
    static getSanitizedValues(values: {}): any;
    static getSanitizedValuesFromObj(doc: BaseVideoRecord): any;
}
export declare class BaseVideoRecordValidator extends BaseMediaRecordValidator {
    static instance: BaseVideoRecordValidator;
}
