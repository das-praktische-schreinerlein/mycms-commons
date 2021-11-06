import { BaseJoinRecord, BaseJoinRecordType } from './basejoin-record';
import { BaseEntityRecordFieldConfig } from './base-entity-record';
export interface BaseLinkedPlaylistRecordType extends BaseJoinRecordType {
    position?: number;
    details?: string;
}
export declare abstract class BaseLinkedPlaylistRecord extends BaseJoinRecord implements BaseLinkedPlaylistRecordType {
    static baseLinkedPlaylistFields: {
        position: BaseEntityRecordFieldConfig;
        details: BaseEntityRecordFieldConfig;
        name: BaseEntityRecordFieldConfig;
        type: BaseEntityRecordFieldConfig;
        refId: BaseEntityRecordFieldConfig;
    };
    position?: number;
    details?: string;
    toString(): string;
}
