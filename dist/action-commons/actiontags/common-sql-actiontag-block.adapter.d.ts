import { ActionTagForm } from '../../commons/utils/actiontag.utils';
import { ChangelogDataConfig, SqlQueryBuilder } from '../../search-commons/services/sql-query.builder';
export interface ActionTagBlockTableConfigType {
    table: string;
    idField: string;
    blockField: string;
    changelogConfig?: ChangelogDataConfig;
}
export interface ActionTagBlockTableConfigsType {
    [key: string]: ActionTagBlockTableConfigType;
}
export interface ActionTagBlockConfigType {
    tables: ActionTagBlockTableConfigsType;
}
export interface BlockActionTagForm extends ActionTagForm {
    payload: {
        set?: boolean | number;
        value?: number;
    };
}
export declare class CommonSqlActionTagBlockAdapter {
    private config;
    private readonly knex;
    private sqlQueryBuilder;
    private readonly blockConfigs;
    private rateValidationRule;
    constructor(config: any, knex: any, sqlQueryBuilder: SqlQueryBuilder, blockConfigs: ActionTagBlockConfigType);
    executeActionTagBlock(table: string, id: number, actionTagForm: BlockActionTagForm, opts: any): Promise<any>;
}
