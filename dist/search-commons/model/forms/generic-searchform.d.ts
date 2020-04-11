import { GenericValidatorDatatypes, ValidationRule } from './generic-validator.util';
export declare class GenericSearchFormFieldConfig {
    private _datatype;
    private _validator;
    constructor(datatype: GenericValidatorDatatypes, validator: ValidationRule);
    readonly datatype: GenericValidatorDatatypes;
    readonly validator: ValidationRule;
}
export declare class GenericSearchForm {
    static genericFields: {
        fulltext: GenericSearchFormFieldConfig;
        sort: GenericSearchFormFieldConfig;
        perPage: GenericSearchFormFieldConfig;
        pageNum: GenericSearchFormFieldConfig;
    };
    fulltext: string;
    sort: string;
    perPage: number;
    pageNum: number;
    constructor(values: {});
    toString(): string;
}
