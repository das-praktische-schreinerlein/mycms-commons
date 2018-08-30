import { Record } from 'js-data';
import { GenericValidatorDatatypes, ValidationRule } from '../forms/generic-validator.util';
import { GenericSearchFormFieldConfig } from '../forms/generic-searchform';
export declare class BaseEntityRecordFieldConfig {
    private _datatype;
    private _validator;
    constructor(datatype: GenericValidatorDatatypes, validator: ValidationRule);
    readonly datatype: GenericValidatorDatatypes;
    readonly validator: ValidationRule;
}
export interface BaseEntityRecordType {
    id: string;
    toString(useWrapper?: any, includeId?: any): string;
    isValid(): boolean;
}
export declare class BaseEntityRecord extends Record implements BaseEntityRecordType {
    static genericFields: {
        id: GenericSearchFormFieldConfig;
    };
    id: string;
    toString(useWrapper: any, includeId: any): string;
    isValid(): boolean;
}
export declare class BaseEntityRecordValidator {
    static isValidValues(values: {}): boolean;
    static validateValues(values: {}): string[];
    static isValid(record: BaseEntityRecord): boolean;
    static validate(record: BaseEntityRecord): string[];
}
