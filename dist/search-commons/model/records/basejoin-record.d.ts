import { BaseEntityRecord, BaseEntityRecordFieldConfig, BaseEntityRecordType } from './base-entity-record';
export interface BaseJoinRecordType extends BaseEntityRecordType {
    name: string;
    refId: string;
    type: string;
}
export declare abstract class BaseJoinRecord extends BaseEntityRecord implements BaseJoinRecordType {
    static joinFields: {
        name: BaseEntityRecordFieldConfig;
        type: BaseEntityRecordFieldConfig;
        refId: BaseEntityRecordFieldConfig;
    };
    name: string;
    refId: string;
    type: string;
    toString(): string;
}
