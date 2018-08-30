import { BaseEntityRecord, BaseEntityRecordType } from './base-entity-record';
export interface BaseImageRecordType extends BaseEntityRecordType {
    descTxt: string;
    descMd: string;
    descHtml: string;
    fileName: string;
    name: string;
    getMediaId(): string;
}
export declare class BaseImageRecord extends BaseEntityRecord implements BaseImageRecordType {
    descTxt: string;
    descMd: string;
    descHtml: string;
    fileName: string;
    name: string;
    getMediaId(): string;
    toString(): string;
}
