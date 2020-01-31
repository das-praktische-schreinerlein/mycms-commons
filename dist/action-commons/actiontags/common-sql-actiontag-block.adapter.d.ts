import { ActionTagForm } from '../../commons/utils/actiontag.utils';
import { SqlQueryBuilder } from '../../search-commons/services/sql-query.builder';
export interface ActionTagBlockTableConfigType {
    table: string;
    idField: string;
    blockField: string;
}
export interface ActionTagBlockTableConfigsType {
    [key: string]: ActionTagBlockTableConfigType;
}
export interface ActionTagBlockConfigType {
    tables: ActionTagBlockTableConfigsType;
}
export declare class CommonSqlActionTagBlockAdapter {
    private config;
    private readonly knex;
    private sqlQueryBuilder;
    private readonly blockConfigs;
    constructor(config: any, knex: any, sqlQueryBuilder: SqlQueryBuilder, blockConfigs: ActionTagBlockConfigType);
    executeActionTagBlock(table: string, id: number, actionTagForm: ActionTagForm, opts: any): Promise<any>;
}
