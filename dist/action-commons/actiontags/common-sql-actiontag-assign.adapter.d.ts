import { ActionTagForm } from '../../commons/utils/actiontag.utils';
import { ChangelogDataConfig, SqlQueryBuilder } from '../../search-commons/services/sql-query.builder';
export interface ActionTagAssignReferenceTableConfigType {
    table: string;
    idField: string;
    referenceField: string;
    changelogConfig?: ChangelogDataConfig;
}
export interface ActionTagAssignReferenceTableConfigsType {
    [key: string]: ActionTagAssignReferenceTableConfigType;
}
export interface ActionTagAssignTableConfigType {
    table: string;
    idField: string;
    references: ActionTagAssignReferenceTableConfigsType;
    changelogConfig?: ChangelogDataConfig;
}
export interface ActionTagAssignTableConfigsType {
    [key: string]: ActionTagAssignTableConfigType;
}
export interface ActionTagAssignConfigType {
    tables: ActionTagAssignTableConfigsType;
}
export interface AssignActionTagForm extends ActionTagForm {
    payload: {
        newId: string;
        newIdSetNull: boolean;
        referenceField: string;
    };
}
export declare class CommonSqlActionTagAssignAdapter {
    private keywordValidationRule;
    private idValidator;
    private config;
    private readonly knex;
    private sqlQueryBuilder;
    private readonly assignConfigs;
    constructor(config: any, knex: any, sqlQueryBuilder: SqlQueryBuilder, assignConfigs: ActionTagAssignConfigType);
    executeActionTagAssign(table: string, id: number, actionTagForm: AssignActionTagForm, opts: any): Promise<any>;
}
