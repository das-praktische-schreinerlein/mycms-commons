import {BaseJoinRecord, BaseJoinRecordType} from './basejoin-record';
import {BaseEntityRecordFieldConfig} from './base-entity-record';
import {GenericValidatorDatatypes, NumberValidationRule} from '../forms/generic-validator.util';

export interface  BaseLinkedPlaylistRecordType extends BaseJoinRecordType {
    position: number;
}

export abstract class  BaseLinkedPlaylistRecord extends BaseJoinRecord implements  BaseLinkedPlaylistRecordType {
    static baseLinkedPlaylistFields = {...BaseJoinRecord.joinFields,
        position: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.NUMBER,
            new NumberValidationRule(false, 1, 999999999999, undefined))
    };

    position: number;

    toString() {
        return ' BaseLinkedPlaylistRecord Record {\n' +
            '  id: ' + this.id + ',\n' +
            '  refId: ' + this.refId + '\n' +
            '  name: ' + this.name + ',\n' +
            '  position: ' + this.position +
            '}';
    }
}
