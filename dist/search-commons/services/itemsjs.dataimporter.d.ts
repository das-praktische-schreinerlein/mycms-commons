import { ItemsJsConfig } from './itemsjs-query.builder';
import { Mapper } from 'js-data';
import { GenericAdapterResponseMapper } from './generic-adapter-response.mapper';
import { BaseEntityRecordRelationsType } from '../model/records/base-entity-record';
export interface RefMappingType {
    [id: string]: {
        [filterField: string]: any[];
    };
}
export interface RefConfigType {
    containerField: string;
    refField: string;
    idPrefix: string;
    filterFields: string[];
}
export interface ExtendedItemsJsConfig extends ItemsJsConfig {
    aggregationFields: string[];
    refConfigs: RefConfigType[];
    skipMediaCheck: boolean;
}
export declare class ItemsJsDataImporter {
    protected _objectSeparator: string;
    protected _fieldSeparator: string;
    protected _valueSeparator: string;
    protected itemsJsConfig: ExtendedItemsJsConfig;
    static prepareConfiguration(itemsJsConfig: ExtendedItemsJsConfig): void;
    constructor(itemsJsConfig: ExtendedItemsJsConfig);
    mapToItemJsDocuments(data: any): any[];
    createRecordFromJson(responseMapper: GenericAdapterResponseMapper, mapper: Mapper, props: any, relationType: BaseEntityRecordRelationsType): any;
    extendAdapterDocument(values: {}): {};
    protected lazyCheckForFilePath(pathes: {}, needle: string): string;
    protected clearNotExistingMediaPathes(records: any[], imagePathes: {}, videoPathes: {}): void;
    protected generateRelationMappings(recordMap: {}): RefMappingType;
    protected remapRelationMappings(recordMap: {}, refMappings: RefMappingType): void;
    protected getItemsJsConfig(): ItemsJsConfig;
}
