import { ActionTagForm } from '../../commons/utils/actiontag.utils';
import { CommonSqlKeywordAdapter } from '../actions/common-sql-keyword.adapter';
export interface KeywordActionTagForm extends ActionTagForm {
    payload: {
        keywordAction: 'set' | 'unset';
        keywords: string;
    };
}
export declare class CommonSqlActionTagKeywordAdapter {
    private keywordValidationRule;
    private readonly commonSqlKeywordAdapter;
    constructor(commonSqlKeywordAdapter: CommonSqlKeywordAdapter);
    executeActionTagKeyword(table: string, id: number, actionTagForm: KeywordActionTagForm, opts: any): Promise<any>;
}
