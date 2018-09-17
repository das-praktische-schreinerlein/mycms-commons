import {FilterUtils, SimpleFilter} from './filter.utils';

export interface ActionTagConfig {
    key: string;
    name: string;
    shortName: string;
    showFilter: SimpleFilter[];
    type: string;
    payload?: {};
    recordAvailability: SimpleFilter[];
    configAvailability: SimpleFilter[];
    profileAvailability?: SimpleFilter[];
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

export abstract class ActionTagUtils {
    public static generateTags(tagConfigs: ActionTagConfig[], record: {}, config: {}, profile: {}): ActionTag[] {
        const lTags: ActionTag[] = [];
        for (const tagConfig of tagConfigs) {
            const tag = ActionTagUtils.generateTag(tagConfig, record, config, profile);
            if (tag.available) {
                lTags.push(tag);
            }
        }

        return lTags;
    }

    public static generateTagsForRecords(tagConfigs: ActionTagConfig[], records: {}[], config: {}, profile: {}): ActionTag[] {
        const lTags: ActionTag[] = [];
        for (const tagConfig of tagConfigs) {
            for (const record of records) {
                const tag = ActionTagUtils.generateTag(tagConfig, record, config, profile);
                if (tag.available) {
                    lTags.push(tag);
                    break;
                }
            }
        }

        return lTags;
    }

    public static generateTag(tagConfig: ActionTagConfig, record: {}, config: {}, profile: {}): ActionTag {
        let available = FilterUtils.checkFilters(tagConfig.configAvailability, config);
        available = available && FilterUtils.checkFilters(
            tagConfig.profileAvailability ? tagConfig.profileAvailability : [], profile);
        available = available && FilterUtils.checkFilters(tagConfig.recordAvailability, record);
        const active = available && FilterUtils.checkFilters(tagConfig.showFilter, record);

        return {
            config: tagConfig,
            active: active,
            available: available
        };
    }
}
