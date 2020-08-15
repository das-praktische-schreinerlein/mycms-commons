import { BaseEntityRecord, BaseEntityRecordFieldConfig, BaseEntityRecordType } from './base-entity-record';
export interface BaseExtendedObjectPropertyRecordType extends BaseEntityRecordType {
    category: string;
    name: string;
    value: any;
}
export declare abstract class BaseExtendedObjectPropertyRecord extends BaseEntityRecord implements BaseExtendedObjectPropertyRecordType {
    static extendedObjectPropertyFields: {
        category: BaseEntityRecordFieldConfig;
        name: BaseEntityRecordFieldConfig;
        value: BaseEntityRecordFieldConfig;
    };
    category: string;
    name: string;
    value: any;
    toString(): string;
}
