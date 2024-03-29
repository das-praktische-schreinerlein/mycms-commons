import {TableConfig, TableConfigs} from '../../search-commons/services/sql-query.builder';
import {ActionTagReplaceConfigType} from '../../action-commons/actiontags/common-sql-actiontag-replace.adapter';
import {ActionTagAssignConfigType} from '../../action-commons/actiontags/common-sql-actiontag-assign.adapter';
import {ActionTagAssignJoinConfigType} from '../../action-commons/actiontags/common-sql-actiontag-assignjoin.adapter';
import {SqlPageConfig} from '../model/repository/sql-page.config';
import {KeywordModelConfigType} from '../../action-commons/actions/common-sql-keyword.adapter';

export class PDocSqlConfig {
    public static readonly tableConfigs: TableConfigs = {
        'page': SqlPageConfig.tableConfig
    };

    public static readonly keywordModelConfigType: KeywordModelConfigType = {
        table: 'props',
        fieldId: 'pr_id',
        fieldName: 'pr_name',
        joins: {
            'page': SqlPageConfig.keywordModelConfigType,
        }
    };


    public static readonly actionTagAssignConfig: ActionTagAssignConfigType = {
        tables: {
            'page': SqlPageConfig.actionTagAssignConfig
        }
    };

    public static readonly actionTagAssignJoinConfig: ActionTagAssignJoinConfigType = {
        tables: {
        }
    };

    public static readonly actionTagReplaceConfig: ActionTagReplaceConfigType = {
        tables: {
            'page': SqlPageConfig.actionTagReplaceConfig
        }
    };

    public getTableConfigForTableKey(table: string): TableConfig {
        return PDocSqlConfig.tableConfigs[table];
    }

    public getKeywordModelConfigFor(): KeywordModelConfigType {
        return PDocSqlConfig.keywordModelConfigType;
    }

    public getActionTagAssignConfig(): ActionTagAssignConfigType {
        return PDocSqlConfig.actionTagAssignConfig;
    }

    public getActionTagAssignJoinConfig(): ActionTagAssignJoinConfigType {
        return PDocSqlConfig.actionTagAssignJoinConfig;
    }

    public getActionTagReplaceConfig(): ActionTagReplaceConfigType {
        return PDocSqlConfig.actionTagReplaceConfig;
    }
}

