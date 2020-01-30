import {BaseEntityRecord, BaseEntityRecordFieldConfig, BaseEntityRecordType} from './base-entity-record';
import {GenericValidatorDatatypes, IdValidationRule, NameValidationRule} from '../forms/generic-validator.util';

export interface BaseNavigationObjectRecordType extends BaseEntityRecordType {
    name: string;
    navid: string;
    navtype: string;
}

export class BaseNavigationObjectRecord extends BaseEntityRecord implements BaseNavigationObjectRecordType {
    static navigationObjectFields = {
        name: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.NAME, new NameValidationRule(false)),
        navid: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.ID, new IdValidationRule(true)),
        navtype: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.NAME, new NameValidationRule(true))
    };

    name: string;
    navid: string;
    navtype: string;

    toString() {
        return 'BaseNavigationObjectRecord Record {\n' +
            '  id: ' + this.id + ',\n' +
            '  navid: ' + this.navid + ',\n' +
            '  name: ' + this.name + ',\n' +
            '  navtype: ' + this.navtype + ')\n' +
            '}';
    }
}
