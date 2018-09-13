import { SimpleFilter } from './filter.utils';
export interface ActionTagConfig {
    key: string;
    name: string;
    shortName: string;
    showFilter: SimpleFilter[];
    type: string;
    payload?: {};
    recordAvailability: SimpleFilter[];
    configAvailability: SimpleFilter[];
}
export interface MultiActionTagConfig extends ActionTagConfig {
    flgUseInput: boolean;
    flgUseSelect: boolean;
    selectParameterConstants?: string[][];
    selectParameterValueListKey?: string;
    selectFieldName?: string;
    inputFieldName?: string;
}
export interface ActionTag {
    config: ActionTagConfig;
    active: boolean;
    available: boolean;
}
export interface ActionTagForm {
    key: string;
    type: string;
    recordId: string;
    payload: any;
}
export declare abstract class ActionTagUtils {
    static generateTags(tagConfigs: ActionTagConfig[], record: {}, config: {}): ActionTag[];
    static generateTagsForRecords(tagConfigs: ActionTagConfig[], records: {}[], config: {}): ActionTag[];
    static generateTag(tagConfig: ActionTagConfig, record: {}, config: {}): ActionTag;
}
