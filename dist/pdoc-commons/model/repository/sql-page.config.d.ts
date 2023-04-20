import { TableConfig } from '../../../search-commons/services/sql-query.builder';
import { ActionTagReplaceTableConfigType } from '../../../action-commons/actiontags/common-sql-actiontag-replace.adapter';
import { ActionTagAssignTableConfigType } from '../../../action-commons/actiontags/common-sql-actiontag-assign.adapter';
export declare class SqlPageConfig {
    static readonly tableConfig: TableConfig;
    static readonly actionTagAssignConfig: ActionTagAssignTableConfigType;
    static readonly actionTagReplaceConfig: ActionTagReplaceTableConfigType;
}
