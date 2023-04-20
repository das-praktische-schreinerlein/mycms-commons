import { TableConfig, TableConfigs } from '../../search-commons/services/sql-query.builder';
import { ActionTagReplaceConfigType } from '../../action-commons/actiontags/common-sql-actiontag-replace.adapter';
import { ActionTagAssignConfigType } from '../../action-commons/actiontags/common-sql-actiontag-assign.adapter';
import { ActionTagAssignJoinConfigType } from '../../action-commons/actiontags/common-sql-actiontag-assignjoin.adapter';
export declare class PDocSqlConfig {
    static readonly tableConfigs: TableConfigs;
    static readonly actionTagAssignConfig: ActionTagAssignConfigType;
    static readonly actionTagAssignJoinConfig: ActionTagAssignJoinConfigType;
    static readonly actionTagReplaceConfig: ActionTagReplaceConfigType;
    getTableConfigForTableKey(table: string): TableConfig;
    getActionTagAssignConfig(): ActionTagAssignConfigType;
    getActionTagAssignJoinConfig(): ActionTagAssignJoinConfigType;
    getActionTagReplaceConfig(): ActionTagReplaceConfigType;
}
