import {GenericSearchForm} from '../model/forms/generic-searchform';
import {DateUtils} from '../../commons/utils/date.utils';
import {
    BaseEntityRecord,
    BaseEntityRecordFactory,
    BaseEntityRecordRelationsType,
    BaseEntityRecordRelationType,
    BaseEntityRecordType
} from "../model/records/base-entity-record";
import {Mapper, Record} from 'js-data';
import {ObjectUtils} from "../../commons/utils/object.utils";

export interface AdapterQuery {
    where?: {};
    additionalWhere?: {};
    spatial?: {
        geo_loc_p: {
            nearby: string;
        };
    };
    loadTrack: any;
}
export interface AdapterOpts {
    limit?: number;
    offset?: number;
    originalSearchForm?: GenericSearchForm;
    showFacets?: any;
}

export class AdapterFilterActions {
    static LIKEI = 'likei';
    static LIKE = 'like';
    static EQ1 = '==';
    static EQ2 = 'eq';
    static GT = '>';
    static GE = '>=';
    static LT = '<';
    static LE = '<=';
    static IN = 'in';
    static IN_NUMBER = 'in_number';
    static IN_CSV = 'in_csv';
    static LIKEIN = 'likein';
    static NOTIN = 'notin';
}

export class MapperUtils {
    private static DEFAULT_OBJECTSEPARATOR = ';;';
    private static DEFAULT_FIELDSEPARATOR = ':::';
    private static DEFAULT_VALUESEPARATOR = '=';

    private _objectSeparator;
    private _fieldSeparator;
    private _valueSeparator;

    constructor(_objectSeparator?: string, _fieldSeparator?: string, _valueSeparator?: string) {
        this._objectSeparator = _objectSeparator || MapperUtils.DEFAULT_OBJECTSEPARATOR;
        this._fieldSeparator = _fieldSeparator || MapperUtils.DEFAULT_FIELDSEPARATOR;
        this._valueSeparator = _valueSeparator || MapperUtils.DEFAULT_VALUESEPARATOR;
    }

    public mapToAdapterFieldName(mapping: {}, fieldName: string): string {
        if (mapping.hasOwnProperty(fieldName)) {
            return mapping[fieldName];
        }

        return fieldName;
    }

    public getMappedAdapterValue(mapping: {}, adapterDocument: any, adapterFieldName: string, defaultValue: any): string {
        return this.getAdapterValue(adapterDocument, this.mapToAdapterFieldName(mapping, adapterFieldName), defaultValue);
    }

    public getMappedAdapterNumberValue(mapping: {}, adapterDocument: any, adapterFieldName: string, defaultValue: any): number {
        return this.getAdapterNumberValue(adapterDocument, this.mapToAdapterFieldName(mapping, adapterFieldName), defaultValue);
    }

    public getMappedAdapterDateTimeValue(mapping: {}, adapterDocument: any, adapterFieldName: string, defaultValue: any): number {
        return this.getAdapterDateTimeValue(adapterDocument, this.mapToAdapterFieldName(mapping, adapterFieldName), defaultValue);
    }

    public getAdapterValue(adapterDocument: any, adapterFieldName: string, defaultValue: any): string {
        let value = defaultValue;
        if (adapterDocument[adapterFieldName] !== undefined && adapterDocument[adapterFieldName] !== null) {
            if (Array.isArray(adapterDocument[adapterFieldName])) {
                value = adapterDocument[adapterFieldName][0];
            } else {
                value = adapterDocument[adapterFieldName];
            }
        }

        return value;
    }

    public getAdapterNumberValue(adapterDocument: any, adapterFieldName: string, defaultValue: any): number {
        let value = defaultValue;
        if (adapterDocument[adapterFieldName] !== undefined && adapterDocument[adapterFieldName] !== null) {
            if (Array.isArray(adapterDocument[adapterFieldName])) {
                value = adapterDocument[adapterFieldName][0];
            } else {
                value = adapterDocument[adapterFieldName];
            }
            if (value === undefined) {
                return undefined;
            }
            if (typeof value === 'string') {
                value = Number.parseFloat(value);
            }
            value = Number(value);
        }

        return value;
    }

    public getAdapterDateTimeValue(adapterDocument: any, adapterFieldName: string, defaultValue: any): number {
        let value = defaultValue;
        if (adapterDocument[adapterFieldName] !== undefined && adapterDocument[adapterFieldName] !== null) {
            if (Array.isArray(adapterDocument[adapterFieldName])) {
                value = adapterDocument[adapterFieldName][0];
            } else {
                value = adapterDocument[adapterFieldName];
            }
            if (value === undefined) {
                return undefined;
            }

            value =  DateUtils.dateToLocalISOString(value);
        }

        return value;
    }

    public getAdapterCoorValue(adapterDocument: any, adapterFieldName: string, defaultValue: any): string {
        let value = defaultValue;
        if (adapterDocument[adapterFieldName] !== undefined && adapterDocument[adapterFieldName] !== null) {
            if (Array.isArray(adapterDocument[adapterFieldName])) {
                value = adapterDocument[adapterFieldName][0];
            } else if (adapterDocument[adapterFieldName] !== '0' && adapterDocument[adapterFieldName] !== '0,0') {
                value = adapterDocument[adapterFieldName];
            }
        }

        return value;
    }

    public prepareEscapedSingleValue(value: any, splitter: string, joiner: string): string {
        value = this.prepareSingleValue(value, ' ');
        value = this.escapeAdapterValue(value);
        const values = this.prepareValueToArray(value, splitter);
        value = values.map(inValue => this.escapeAdapterValue(inValue)).join(joiner);
        return value;
    }

    public prepareSingleValue(value: any, joiner: string): string {
        switch (typeof value) {
            case 'string':
                return value.toString();
            case 'number':
                return '' + value;
            default:
        }
        if (Array.isArray(value)) {
            return value.join(joiner);
        }

        return value.toString();
    }

    public prepareValueToArray(value: any, splitter: string): string[] {
        return value.toString().split(splitter);
    }

    public escapeAdapterValue(value: any): string {
        value = value.toString().replace(/[%]/g, ' ')
            .replace(/[\"\':\()\[\]\x00\n\r\x1a\\]/g, ' ')
            .replace(/[ ]+/g, ' ')
            .trim();
        return value;
    }

    public splitPairs(arr: Array<any>): Array<Array<any>> {
        const pairs = [];
        for (let i = 0; i < arr.length; i += 2) {
            if (arr[i + 1] !== undefined) {
                pairs.push([arr[i], arr[i + 1]]);
            } else {
                pairs.push([arr[i]]);
            }
        }
        return pairs;
    }

    public mapDetailDocsToDetailRecords(mapper: Mapper, factory: BaseEntityRecordFactory, record: BaseEntityRecordType,
                                           detailDocs: {}[]): Record[] {
        const detailRecords: Record[] = [];
        if (detailDocs !== undefined) {
            let id = this.extractUniqueId(record);
            for (const detailDoc of detailDocs) {
                if (detailDoc === undefined || detailDoc === null) {
                    continue;
                }
                const detailValues = {... detailDoc};
                detailValues['id'] = (id++).toString() + record.id;
                const detailRecord = mapper.createRecord(
                    factory.getSanitizedValues(detailValues, {}));
                detailRecords.push(detailRecord);
            }
        }

        return detailRecords;
    }

    explodeAndMapDetailResponseDocuments(mapper: Mapper, relation: BaseEntityRecordRelationType, srcFields: string[],
                                         record: BaseEntityRecord, docs: any[]): void {
        if (docs === undefined) {
            return;
        }

        let subDocs = [];
        docs.forEach(doc => {
            let fieldName;
            for (const srcField of srcFields) {
                if (doc[srcField] !== undefined && doc[srcField] !== null) {
                    fieldName = srcField;
                    break;
                }
            }
            if (fieldName !== undefined && doc[fieldName] !== undefined && doc[fieldName] !== null) {
                const objects = ObjectUtils.explodeValueToObjects(doc[fieldName], this._objectSeparator,
                    this._fieldSeparator, this._valueSeparator);
                subDocs = subDocs.concat(objects);
            }
        });

        record.set(relation.localField,
            this.mapDetailDocsToDetailRecords(mapper['datastore']._mappers[relation.mapperKey],
                relation.factory, record, subDocs));
    }

    mapValuesToSubRecords(mapper: Mapper, values: {}, record: BaseEntityRecord, relations: BaseEntityRecordRelationsType) {
        if (relations.hasOne) {
            for (const relationKey in relations.hasOne) {
                const relation: BaseEntityRecordRelationType = relations.hasOne[relationKey];
                const subMapper = mapper['datastore']._mappers[relation.mapperKey];
                let subValues = undefined;
                for (const key in values) {
                    if (key.startsWith(relation.localField + '.')) {
                        const subKey = key.replace(relation.localField + '.', '');
                        subValues = subValues || {};
                        subValues[subKey] = values[key];
                    }
                }

                if (subValues) {
                    record.set(relation.localField, subMapper.createRecord(
                        relation.factory.getSanitizedValues(subValues, {}))
                    );
                } else {
                    record.set(relation.localField, undefined);
                }
            }
        }

        if (relations.hasMany) {
            for (const relationKey in relations.hasMany) {
                const relation: BaseEntityRecordRelationType = relations.hasMany[relationKey];
                const joinMapper = mapper['datastore']._mappers[relation.mapperKey];
                if (values[relation.localField]) {
                    const joinValues = values[relation.localField];
                    const joinRecords: Record[] = [];
                    for (const joinRecordProps of joinValues) {
                        joinRecords.push(
                            joinMapper.createRecord(
                                relation.factory.getSanitizedValues(joinRecordProps, {}))
                        );
                    }

                    if (joinRecords.length > 0) {
                        record.set(relation.localField, joinRecords);
                    } else {
                        record.set(relation.localField, undefined);
                    }
                }
            }
        }
    }

    public extractUniqueId(record: BaseEntityRecordType): number {
        if (record === undefined || record.id === undefined) {
            return undefined;
        }
        let id = Number(record.id.replace(/.*_/, '')) || 1;
        id = id * 1000000;

        return id;
    }

    public static generateDoubletteValue(value: string): string {
        return value === undefined ? value :
            value.toLowerCase()
                .replace(/ß/g, 'ss')
                .replace(/ö/g, 'oe')
                .replace(/ü/g, 'ue')
                .replace(/ä/g, 'ae')
                .replace(/[^a-z0-9]/g, '');
    }

}

