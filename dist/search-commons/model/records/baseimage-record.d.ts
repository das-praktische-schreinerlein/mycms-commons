import { BaseMediaRecord, BaseMediaRecordFactory, BaseMediaRecordType, BaseMediaRecordValidator } from "./basemedia-record";
export interface BaseImageRecordType extends BaseMediaRecordType {
}
export declare class BaseImageRecord extends BaseMediaRecord implements BaseImageRecordType {
    getMediaId(): string;
    toString(): string;
}
export declare class BaseImageRecordFactory extends BaseMediaRecordFactory {
    static instance: BaseImageRecordFactory;
    static createSanitized(values: {}): BaseImageRecord;
    static cloneSanitized(doc: BaseImageRecord): BaseImageRecord;
}
export declare class BaseImageRecordValidator extends BaseMediaRecordValidator {
    static instance: BaseImageRecordValidator;
}
