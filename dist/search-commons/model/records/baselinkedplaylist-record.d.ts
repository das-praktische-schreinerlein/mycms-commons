import { BaseJoinRecord, BaseJoinRecordType } from './basejoin-record';
import { BaseEntityRecordFieldConfig } from './base-entity-record';
export interface BaseLinkedPlaylistRecordType extends BaseJoinRecordType {
    position: number;
}
export declare abstract class BaseLinkedPlaylistRecord extends BaseJoinRecord implements BaseLinkedPlaylistRecordType {
    static baseLinkedPlaylistFields: {
        position: BaseEntityRecordFieldConfig;
        name: BaseEntityRecordFieldConfig;
        type: BaseEntityRecordFieldConfig;
        refId: BaseEntityRecordFieldConfig;
    };
    position: number;
    toString(): string;
}
