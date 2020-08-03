import {Mapper, Record} from 'js-data';

export interface GenericAdapterResponseMapper {
    mapToAdapterDocument(mapping: {}, props: any): any;

    mapDetailDataToAdapterDocument(mapping: {}, profile: string, props: any, result: {}): void;

    mapResponseDocument(mapper: Mapper, doc: any, mapping: {}): Record;

    mapDetailResponseDocuments(mapper: Mapper, profile: string, record: Record, docs: any): void;

    mapValuesToRecord(mapper: Mapper, values: {}): Record;
}

