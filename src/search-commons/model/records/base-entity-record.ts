import {Record} from 'js-data';
import {GenericValidatorDatatypes, IdValidationRule, ValidationRule} from '../forms/generic-validator.util';
import {GenericSearchFormFieldConfig} from '../forms/generic-searchform';
import {isArray} from 'util';

export interface BaseEntityRecordRelationType {
    foreignKey: string;
    localField: string;
    mapperKey: string;
    factory?: BaseEntityRecordFactory;
    validator?: BaseEntityRecordValidator;
}

export interface BaseEntityRecordRelationsType {
    belongsTo?: {
        [key: string]: BaseEntityRecordRelationType;
    }
    hasOne?: {
        [key: string]: BaseEntityRecordRelationType;
    }
    hasMany?: {
        [key: string]: BaseEntityRecordRelationType;
    }
}

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

export class BaseEntityRecordFactory {
    public static instance = new BaseEntityRecordFactory();

    static createSanitized(values: {}): BaseEntityRecord {
        const sanitizedValues = BaseEntityRecordFactory.instance.getSanitizedValues(values, {});
        return new BaseEntityRecord(sanitizedValues);
    }

    static cloneSanitized(doc: BaseEntityRecord): BaseEntityRecord {
        const sanitizedValues = BaseEntityRecordFactory.instance.getSanitizedValuesFromObj(doc);
        return new BaseEntityRecord(sanitizedValues);
    }

    getSanitizedValues(values: {}, result: {}): {} {
        return this.sanitizeFieldValues(values, BaseEntityRecord.genericFields, result, '');
    }

    getSanitizedValuesFromObj(doc: BaseEntityRecord): any {
        return this.getSanitizedValues(doc, {});
    }

    getSanitizedRelationValues(relation: string, values: {}): {} {
        throw new Error('unknown relation:' + relation);
    }

    sanitizeFieldValues(values: {}, fieldConfigs: {}, result: {}, fieldPrefix?: string): {} {
        fieldPrefix = fieldPrefix !== undefined ? fieldPrefix : '';
        const sanitizedValues = result;
        for (const fieldConfigName in fieldConfigs) {
            const fieldConfig = <GenericSearchFormFieldConfig>fieldConfigs[fieldConfigName];
            sanitizedValues[fieldPrefix + fieldConfigName] =
                this.sanitizeFieldValue(values, fieldConfig.validator, fieldPrefix + fieldConfigName);
        }

        return sanitizedValues;
    }

    sanitizeFieldValue(record: {}, rule: ValidationRule, fieldName: string): any {
        return this.sanitizeValue(record[fieldName], rule);

    }

    sanitizeValue(value: any, rule: ValidationRule): any {
        return rule.sanitize(value) || undefined;

    }
}

export class BaseEntityRecordValidator {
    public static instance = new BaseEntityRecordValidator();

    isValidValues(values: {}, fieldPrefix?: string, errFieldPrefix?: string): boolean {
        return this.validateValues(values, fieldPrefix, errFieldPrefix).length === 0;
    }

    validateValues(values: {}, fieldPrefix?: string, errFieldPrefix?: string): string[] {
        const errors = [];
        this.validateMyFieldRules(values, errors, fieldPrefix, errFieldPrefix);
        this.validateMyValueRelationRules(values, errors, fieldPrefix, errFieldPrefix);

        return errors;
    }

    isValid(doc: BaseEntityRecord, errFieldPrefix?: string): boolean {
        return this.validate(doc, errFieldPrefix).length === 0;
    }

    validate(doc: BaseEntityRecord, errFieldPrefix?: string): string[] {
        const errors = [];
        this.validateMyFieldRules(doc, errors, '', errFieldPrefix);
        this.validateMyRelationRules(doc, errors, errFieldPrefix);

        return errors;
    }

    validateMyValueRelationRules(values: {}, errors: string[], fieldPrefix?: string, errFieldPrefix?: string): boolean {
        return true;
    }

    validateMyRelationRules(doc: BaseEntityRecord, errors: string[], errFieldPrefix?: string): boolean {
        return true;
    }

    validateMyFieldRules(values: {}, errors: string[], fieldPrefix?: string, errFieldPrefix?: string): boolean {
        fieldPrefix = fieldPrefix !== undefined ? fieldPrefix : '';
        errFieldPrefix = errFieldPrefix !== undefined ? errFieldPrefix : '';

        return this.validateFieldRules(values, BaseEntityRecord.genericFields, fieldPrefix, errors, errFieldPrefix);
    }

    protected validateValueRelationRules(values: {}, relations: string[],  errors: string[], fieldPrefix?: string, errFieldPrefix?: string): boolean {
        fieldPrefix = fieldPrefix !== undefined ? fieldPrefix : '';
        errFieldPrefix = errFieldPrefix !== undefined ? errFieldPrefix : '';

        const relErrors = [];
        for (const relation of relations) {
            relErrors.push(...this.validateValueRelationDoc(relation, values,
                fieldPrefix + relation + '.', errFieldPrefix));
        }
        errors.push(...relErrors);

        return relErrors.length === 0;
    }

    protected validateRelationRules(doc: BaseEntityRecord, relations: string[], errors: string[], fieldPrefix?: string, errFieldPrefix?: string): boolean {
        errFieldPrefix = errFieldPrefix !== undefined ? errFieldPrefix : '';
        const relErrors = [];
        for (const relation of relations) {
            const subRecords = doc.get(relation) || doc[relation];
            if (isArray(subRecords)) {
                for (const subRecord of subRecords) {
                    relErrors.push(...this.validateRelationDoc(relation, subRecord, errFieldPrefix + relation + '.'));
                }
            } else if (subRecords) {
                relErrors.push(...this.validateRelationDoc(relation, subRecords, errFieldPrefix + relation + '.'));
            }
        }
        errors.push(...relErrors);

        return relErrors.length === 0;
    }

    protected validateRelationDoc(relation: string, doc: BaseEntityRecord, errFieldPrefix?: string): string[] {
        throw new Error('unknown relation:' + relation);
    }

    protected validateValueRelationDoc(relation: string, values: {}, fieldPrefix?: string, errFieldPrefix?: string): string[] {
        throw new Error('unknown relation:' + relation);
    }

    protected validateFieldRules(values: {}, fieldConfigs: {}, fieldPrefix: string, errors: string[], errFieldPrefix?: string): boolean {
        fieldPrefix = fieldPrefix !== undefined ? fieldPrefix : '';
        let state = true;
        for (const fieldConfigName in fieldConfigs) {
            const fieldConfig = <GenericSearchFormFieldConfig>fieldConfigs[fieldConfigName];
            state = this.validateRule(values, fieldConfig.validator, fieldPrefix + fieldConfigName, errors, errFieldPrefix) && state;
        }

        return state;
    }

    protected validateRule(record: {}, rule: ValidationRule, fieldName: string, errors: string[], errFieldPrefix?: string): boolean {
        errFieldPrefix = errFieldPrefix !== undefined ? errFieldPrefix : '';

        return !rule.isValid(record[fieldName]) ? errors.push(errFieldPrefix + fieldName) && false : true;
    }
}
