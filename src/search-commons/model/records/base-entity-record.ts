import {Record} from 'js-data';
import {GenericValidatorDatatypes, IdValidationRule, ValidationRule} from '../forms/generic-validator.util';
import {GenericSearchFormFieldConfig} from '../forms/generic-searchform';

export class BaseEntityRecordFieldConfig {
    private _datatype: GenericValidatorDatatypes;
    private _validator: ValidationRule;

    constructor(datatype: GenericValidatorDatatypes, validator: ValidationRule) {
        this._datatype = datatype;
        this._validator = validator;
    }
    get datatype(): GenericValidatorDatatypes {
        return this._datatype;
    }

    get validator(): ValidationRule {
        return this._validator;
    }
}

export interface BaseEntityRecordType {
    id: string;
    toString(useWrapper?, includeId?): string;
    isValid(): boolean;
}

export class BaseEntityRecord extends Record implements BaseEntityRecordType {
    static genericFields = {
        id: new GenericSearchFormFieldConfig(GenericValidatorDatatypes.ID, new IdValidationRule(false))
    };

    id: string;

    toString(useWrapper, includeId): string {
        useWrapper = typeof useWrapper === 'boolean' ? useWrapper : true;
        includeId = typeof includeId === 'boolean' ? includeId : true;
        return (useWrapper ? '{\n' : '') +
            (includeId ? 'id: ' + this.id + ',\n' : '') +
            (useWrapper ? '\n}' : '');
    }

    isValid(): boolean {
        return BaseEntityRecordValidator.instance.isValid(this);
    }
}

export class BaseEntityRecordValidator {
    public static instance = new BaseEntityRecordValidator();

    isValidValues(values: {}, fieldPrefix?: string, errFieldPrefix?: string): boolean {
        return this.validateValues(values, fieldPrefix, errFieldPrefix).length === 0;
    }

    validateValues(values: {}, fieldPrefix?: string, errFieldPrefix?: string): string[] {
        const errors = [];
        this.validateMyRules(values, errors, fieldPrefix, errFieldPrefix);
        this.validateMyValueRelationRules(values, errors, fieldPrefix, errFieldPrefix);

        return errors;
    }

    isValid(doc: BaseEntityRecord, errFieldPrefix?: string): boolean {
        return this.validate(doc, errFieldPrefix).length === 0;
    }

    validate(doc: BaseEntityRecord, errFieldPrefix?: string): string[] {
        const errors = [];
        this.validateMyRules(doc, errors, '', errFieldPrefix);
        this.validateMyRelationRules(doc, errors, errFieldPrefix);

        return errors;
    }

    validateMyValueRelationRules(values: {}, errors: string[], fieldPrefix?: string, errFieldPrefix?: string): boolean {
        return true;
    }

    validateMyRelationRules(doc: BaseEntityRecord, errors: string[], errFieldPrefix?: string): boolean {
        return true;
    }

    validateMyRules(values: {}, errors: string[], fieldPrefix?: string, errFieldPrefix?: string): boolean {
        fieldPrefix = fieldPrefix !== undefined ? fieldPrefix : '';
        errFieldPrefix = errFieldPrefix !== undefined ? errFieldPrefix : '';

        let state = true;
        state = this.validateRule(values, BaseEntityRecord.genericFields.id.validator, fieldPrefix + 'id', errors, errFieldPrefix) && state;

        return state;
    }

    protected validateRule(record: {}, rule: ValidationRule, fieldName: string, errors: string[], errFieldPrefix?: string): boolean {
        errFieldPrefix = errFieldPrefix !== undefined ? errFieldPrefix : '';

        return !rule.isValid(record[fieldName]) ? errors.push(errFieldPrefix + fieldName) && false : true;
    }
}
