import { ActionTagForm } from '../../commons/utils/actiontag.utils';
import { SqlQueryBuilder } from '../../search-commons/services/sql-query.builder';
export interface ActionTagReplaceReferenceTableConfigType {
    table: string;
    fieldReference: string;
}
export interface ActionTagReplaceTableConfigType {
    fieldId: string;
    joins: ActionTagReplaceReferenceTableConfigType[];
    referenced: ActionTagReplaceReferenceTableConfigType[];
    table: string;
}
export interface ActionTagReplaceTableConfigsType {
    [key: string]: ActionTagReplaceTableConfigType;
}
export interface ActionTagReplaceConfigType {
    tables: ActionTagReplaceTableConfigsType;
}
export interface ReplaceActionTagForm extends ActionTagForm {
    payload: {
        newId: string;
        newIdSetNull: boolean;
    };
}
export declare class CommonSqlActionTagReplaceAdapter {
    private idValidator;
    private config;
    private readonly knex;
    private sqlQueryBuilder;
    private readonly replaceConfigs;
    constructor(config: any, knex: any, sqlQueryBuilder: SqlQueryBuilder, replaceConfigs: ActionTagReplaceConfigType);
    executeActionTagReplace(table: string, id: number, actionTagForm: ReplaceActionTagForm, opts: any): Promise<any>;
}
