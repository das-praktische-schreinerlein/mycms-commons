import { ActionTagForm } from '../../commons/utils/actiontag.utils';
import { SqlQueryBuilder } from '../../search-commons/services/sql-query.builder';
export interface ActionTagAssignJoinReferenceTableConfigType {
    joinedTable: string;
    joinedIdField: string;
    joinTable: string;
    joinBaseIdField: string;
    joinReferenceField: string;
}
export interface ActionTagAssignJoinReferenceTableConfigsType {
    [key: string]: ActionTagAssignJoinReferenceTableConfigType;
}
export interface ActionTagAssignJoinTableConfigType {
    table: string;
    idField: string;
    references: ActionTagAssignJoinReferenceTableConfigsType;
}
export interface ActionTagAssignJoinTableConfigsType {
    [key: string]: ActionTagAssignJoinTableConfigType;
}
export interface ActionTagAssignJoinConfigType {
    tables: ActionTagAssignJoinTableConfigsType;
}
export interface AssignJoinActionTagForm extends ActionTagForm {
    payload: {
        newId: string;
        referenceField: string;
    };
}
export declare class CommonSqlActionTagAssignJoinAdapter {
    private keywordValidationRule;
    private idValidator;
    private config;
    private readonly knex;
    private sqlQueryBuilder;
    private readonly assignConfigs;
    constructor(config: any, knex: any, sqlQueryBuilder: SqlQueryBuilder, assignConfigs: ActionTagAssignJoinConfigType);
    executeActionTagAssignJoin(table: string, id: number, actionTagForm: AssignJoinActionTagForm, opts: any): Promise<any>;
}
