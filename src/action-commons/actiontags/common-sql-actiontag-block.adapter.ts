import {ActionTagForm} from '../../commons/utils/actiontag.utils';
import {utils} from 'js-data';
import {ChangelogDataConfig, SqlQueryBuilder} from '../../search-commons/services/sql-query.builder';
import {RawSqlQueryData, SqlUtils} from '../../search-commons/services/sql-utils';
import {NumberValidationRule} from '../../search-commons/model/forms/generic-validator.util';

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
        set?: boolean|number;
        value?: number;
    };
}
export class CommonSqlActionTagBlockAdapter {

    private config: any;
    private readonly knex: any;
    private sqlQueryBuilder: SqlQueryBuilder;
    private readonly blockConfigs: ActionTagBlockConfigType;
    private rateValidationRule = new NumberValidationRule(false, -99, 99, undefined);

    constructor(config: any, knex: any, sqlQueryBuilder: SqlQueryBuilder, blockConfigs: ActionTagBlockConfigType) {
        this.config = config;
        this.knex = knex;
        this.sqlQueryBuilder = sqlQueryBuilder;
        this.blockConfigs = blockConfigs;
    }

    public executeActionTagBlock(table: string, id: number, actionTagForm: BlockActionTagForm, opts: any): Promise<any> {
        opts = opts || {};

        if (!utils.isInteger(id)) {
            return utils.reject('actiontag ' + actionTagForm.key + ' id not an integer');
        }
        if (actionTagForm.payload === undefined) {
            return utils.reject('actiontag ' + actionTagForm.key + ' playload expected');
        }

        const value = actionTagForm.payload.set
            ? actionTagForm.payload.value > 0
                ? actionTagForm.payload.value
                : 1
            : 0;
        if (!this.rateValidationRule.isValid(value)) {
            return utils.reject('actiontag ' + actionTagForm.key + ' value not valid');
        }

        const blockConfig: ActionTagBlockTableConfigType = this.blockConfigs.tables[table];
        if (!blockConfig) {
            return utils.reject('actiontag ' + actionTagForm.key + ' table not valid');
        }

        const fieldName = blockConfig.blockField;
        const tableName = blockConfig.table;
        const idName = blockConfig.idField;

        let updateSql = 'UPDATE ' + tableName + ' SET ' + fieldName + '=' + '?' +
            '  WHERE ' + idName + ' = ' + '?' + '';
        updateSql = this.sqlQueryBuilder.transformToSqlDialect(updateSql, this.config.knexOpts.client);
        const updateSqlQuery: RawSqlQueryData = {
            sql: updateSql,
            parameters: [value, id]
        };

        const sqlBuilder = utils.isUndefined(opts.transaction)
            ? this.knex
            : opts.transaction;
        const rawUpdate = SqlUtils.executeRawSqlQueryData(sqlBuilder, updateSqlQuery);
        const result = new Promise((resolve, reject) => {
            rawUpdate.then(() => {
                const updateSqlQuery: RawSqlQueryData = this.sqlQueryBuilder.updateChangelogSqlQuery(
                    'update', blockConfig.table, blockConfig.idField, blockConfig.changelogConfig, id);
                if (updateSqlQuery) {
                    return SqlUtils.executeRawSqlQueryData(sqlBuilder, updateSqlQuery);
                }

                return Promise.resolve(true);
            }).then(() => {
                return resolve(true);
            }).catch(function errorBlock(reason) {
                console.error('_doActionTag update ' + tableName + ' blocked failed:', reason);
                return reject(reason);
            });
        });

        return result;
    }

}
