import { TableConfig } from '../../../search-commons/services/sql-query.builder';
import { ActionTagReplaceTableConfigType } from '../../../action-commons/actiontags/common-sql-actiontag-replace.adapter';
import { ActionTagAssignTableConfigType } from '../../../action-commons/actiontags/common-sql-actiontag-assign.adapter';
import { KeywordModelConfigJoinType } from '../../../action-commons/actions/common-sql-keyword.adapter';
export declare class SqlPageConfig {
    static readonly tableConfig: TableConfig;
    static readonly keywordModelConfigType: KeywordModelConfigJoinType;
    static readonly actionTagAssignConfig: ActionTagAssignTableConfigType;
    static readonly actionTagReplaceConfig: ActionTagReplaceTableConfigType;
}
