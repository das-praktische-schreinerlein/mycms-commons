import { BaseEntityRecord, BaseEntityRecordType } from './base-entity-record';
export interface BaseAudioRecordType extends BaseEntityRecordType {
    descTxt: string;
    descMd: string;
    descHtml: string;
    fileName: string;
    name: string;
    getMediaId(): string;
}
export declare class BaseAudioRecord extends BaseEntityRecord implements BaseAudioRecordType {
    descTxt: string;
    descMd: string;
    descHtml: string;
    fileName: string;
    name: string;
    getMediaId(): string;
    toString(): string;
}
