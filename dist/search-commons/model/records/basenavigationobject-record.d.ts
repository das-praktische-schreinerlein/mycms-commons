import { BaseEntityRecord, BaseEntityRecordFieldConfig, BaseEntityRecordType } from './base-entity-record';
export interface BaseNavigationObjectRecordType extends BaseEntityRecordType {
    name: string;
    navid: string;
    navtype: string;
}
export declare class BaseNavigationObjectRecord extends BaseEntityRecord implements BaseNavigationObjectRecordType {
    static navigationObjectFields: {
        name: BaseEntityRecordFieldConfig;
        navid: BaseEntityRecordFieldConfig;
        navtype: BaseEntityRecordFieldConfig;
    };
    name: string;
    navid: string;
    navtype: string;
    toString(): string;
}
