import { Mapper, Record } from 'js-data';
import { PDocRecord } from '../model/records/pdoc-record';
import { MapperUtils } from '../../search-commons/services/mapper.utils';
import { GenericAdapterResponseMapper } from '../../search-commons/services/generic-adapter-response.mapper';
export declare class PDocAdapterResponseMapper implements GenericAdapterResponseMapper {
    private readonly _objectSeparator;
    private readonly _fieldSeparator;
    private readonly _valueSeparator;
    protected mapperUtils: MapperUtils;
    protected config: {};
    static generateDoubletteValue(value: string): string;
    constructor(config: any);
    mapToAdapterDocument(mapping: {}, props: PDocRecord): any;
    mapDetailDataToAdapterDocument(mapping: {}, profile: string, props: any, result: {}): void;
    mapValuesToRecord(mapper: Mapper, values: {}): PDocRecord;
    mapResponseDocument(mapper: Mapper, doc: any, mapping: {}): Record;
    mapDetailResponseDocuments(mapper: Mapper, profile: string, src: Record, docs: any[]): void;
}
