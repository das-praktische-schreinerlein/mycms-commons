import { Record } from 'js-data';
import { GenericValidatorDatatypes, ValidationRule } from '../forms/generic-validator.util';
import { GenericSearchFormFieldConfig } from '../forms/generic-searchform';
export declare class BaseEntityRecordFieldConfig {
    private _datatype;
    private _validator;
    constructor(datatype: GenericValidatorDatatypes, validator: ValidationRule);
    get datatype(): GenericValidatorDatatypes;
    get validator(): ValidationRule;
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
export declare class BaseEntityRecordFactory {
    static instance: BaseEntityRecordFactory;
    static createSanitized(values: {}): BaseEntityRecord;
    static cloneSanitized(doc: BaseEntityRecord): BaseEntityRecord;
    getSanitizedValues(values: {}, result: {}): {};
    getSanitizedValuesFromObj(doc: BaseEntityRecord): any;
    getSanitizedRelationValues(relation: string, values: {}): {};
    sanitizeFieldValues(values: {}, fieldConfigs: {}, result: {}, fieldPrefix?: string): {};
    sanitizeFieldValue(record: {}, rule: ValidationRule, fieldName: string): any;
    sanitizeValue(value: any, rule: ValidationRule): any;
}
export declare class BaseEntityRecordValidator {
    static instance: BaseEntityRecordValidator;
    isValidValues(values: {}, fieldPrefix?: string, errFieldPrefix?: string): boolean;
    validateValues(values: {}, fieldPrefix?: string, errFieldPrefix?: string): string[];
    isValid(doc: BaseEntityRecord, errFieldPrefix?: string): boolean;
    validate(doc: BaseEntityRecord, errFieldPrefix?: string): string[];
    validateMyValueRelationRules(values: {}, errors: string[], fieldPrefix?: string, errFieldPrefix?: string): boolean;
    validateMyRelationRules(doc: BaseEntityRecord, errors: string[], errFieldPrefix?: string): boolean;
    validateMyFieldRules(values: {}, errors: string[], fieldPrefix?: string, errFieldPrefix?: string): boolean;
    protected validateValueRelationRules(values: {}, relations: string[], errors: string[], fieldPrefix?: string, errFieldPrefix?: string): boolean;
    protected validateRelationRules(doc: BaseEntityRecord, relations: string[], errors: string[], fieldPrefix?: string, errFieldPrefix?: string): boolean;
    protected validateRelationDoc(relation: string, doc: BaseEntityRecord, errFieldPrefix?: string): string[];
    protected validateValueRelationDoc(relation: string, values: {}, fieldPrefix?: string, errFieldPrefix?: string): string[];
    protected validateFieldRules(values: {}, fieldConfigs: {}, fieldPrefix: string, errors: string[], errFieldPrefix?: string): boolean;
    protected validateRule(record: {}, rule: ValidationRule, fieldName: string, errors: string[], errFieldPrefix?: string): boolean;
}
