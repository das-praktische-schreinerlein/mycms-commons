import { BaseImageRecord, BaseImageRecordType } from './baseimage-record';
export interface BaseVideoRecordType extends BaseImageRecordType {
    toString(): string;
}
export declare class BaseVideoRecord extends BaseImageRecord implements BaseVideoRecordType {
    toString(): string;
}
