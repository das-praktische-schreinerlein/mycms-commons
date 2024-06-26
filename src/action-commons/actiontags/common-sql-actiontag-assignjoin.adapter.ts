import {utils} from 'js-data';
import * as Promise_serial from 'promise-serial';
import {ActionTagForm} from '../../commons/utils/actiontag.utils';
import {IdValidationRule, KeywordValidationRule} from '../../search-commons/model/forms/generic-validator.util';
import {ChangelogDataConfig, SqlQueryBuilder} from '../../search-commons/services/sql-query.builder';
import {RawSqlQueryData, SqlUtils} from '../../search-commons/services/sql-utils';

export interface ActionTagAssignJoinReferenceTableConfigType {
    joinedTable: string;
    joinedIdField: string;
    joinTable: string;
    joinBaseIdField: string;
    joinReferenceField: string;
    changelogConfig?: ChangelogDataConfig;
}

export interface ActionTagAssignJoinReferenceTableConfigsType {
    [key: string]: ActionTagAssignJoinReferenceTableConfigType;
}

export interface ActionTagAssignJoinTableConfigType {
    table: string;
    idField: string;
    references: ActionTagAssignJoinReferenceTableConfigsType;
    changelogConfig?: ChangelogDataConfig;
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

export class CommonSqlActionTagAssignJoinAdapter {

    private keywordValidationRule = new KeywordValidationRule(true);
    private idValidator = new IdValidationRule(true);
    private config: any;
    private readonly knex: any;
    private sqlQueryBuilder: SqlQueryBuilder;
    private readonly assignConfigs: ActionTagAssignJoinConfigType;

    constructor(config: any, knex: any, sqlQueryBuilder: SqlQueryBuilder, assignConfigs: ActionTagAssignJoinConfigType) {
        this.config = config;
        this.knex = knex;
        this.sqlQueryBuilder = sqlQueryBuilder;
        this.assignConfigs = assignConfigs;
    }

    public executeActionTagAssignJoin(table: string, id: number, actionTagForm: AssignJoinActionTagForm, opts: any): Promise<any> {
        opts = opts || {};

        if (!utils.isInteger(id)) {
            return utils.reject('actiontag ' + actionTagForm.key + ' id not an integer');
        }
        if (actionTagForm.payload === undefined) {
            return utils.reject('actiontag ' + actionTagForm.key + ' playload expected');
        }
        const referenceField = actionTagForm.payload.referenceField;
        if (!this.keywordValidationRule.isValid(referenceField)) {
            return utils.reject('actiontag ' + actionTagForm.key + ' referenceField not valid');
        }

        let newId: any = actionTagForm.payload.newId;
        if (!this.idValidator.isValid(newId)) {
            return utils.reject('actiontag ' + actionTagForm.key + ' newId not valid');
        }
        newId = parseInt(newId, 10);
        if (!utils.isInteger(newId)) {
            return utils.reject('actiontag ' + actionTagForm.key + ' newId must be integer');
        }

        const assignConfig: ActionTagAssignJoinTableConfigType = this.assignConfigs.tables[table];
        if (!assignConfig) {
            return utils.reject('actiontag ' + actionTagForm.key + ' table not valid');
        }

        const referenceConfig: ActionTagAssignJoinReferenceTableConfigType = assignConfig.references[referenceField];
        if (!referenceConfig) {
            return utils.reject('actiontag ' + actionTagForm.key + ' referenceField not exists');
        }

        const checkBaseSqlQuery: RawSqlQueryData = {
            sql: 'SELECT ' + assignConfig.idField + ' AS id' +
                ' FROM ' + assignConfig.table +
                ' WHERE ' + assignConfig.idField + '=' + '?' + '',
            parameters: [id]};
        const checkNewValueSqlQuery: RawSqlQueryData = {sql: 'SELECT ' + referenceConfig.joinedIdField + ' AS id' +
                ' FROM ' + referenceConfig.joinedTable +
                ' WHERE ' + referenceConfig.joinedIdField + '=' + '?' + '',
            parameters: [newId]};
        const insertSqlQuery: RawSqlQueryData = {sql:
                'INSERT INTO ' + referenceConfig.joinTable +
                ' (' + referenceConfig.joinBaseIdField + ', ' + referenceConfig.joinReferenceField + ')' +
                ' SELECT ?, ? WHERE NOT EXISTS' +
                '    (SELECT ' + referenceConfig.joinBaseIdField + ', ' + referenceConfig.joinReferenceField +
                '     FROM ' + referenceConfig.joinTable +
                '     WHERE ' + referenceConfig.joinBaseIdField + '=? AND ' + referenceConfig.joinReferenceField + '=?)',
            parameters: [id, newId, id, newId]};

        const sqlBuilder = utils.isUndefined(opts.transaction)
            ? this.knex
            : opts.transaction;
        const result = new Promise((resolve, reject) => {
            SqlUtils.executeRawSqlQueryData(sqlBuilder, checkBaseSqlQuery).then(dbresults => {
                const records = this.sqlQueryBuilder.extractDbResult(dbresults, this.knex.client['config']['client']);
                if (records === undefined || records.length !== 1 || records[0]['id'] !== id) {
                    return utils.reject('_doActionTag assignjoin ' + table + ' failed: id not found ' + id);
                }

                return SqlUtils.executeRawSqlQueryData(sqlBuilder, checkNewValueSqlQuery);
            }).then(dbresults => {
                const records = this.sqlQueryBuilder.extractDbResult(dbresults, this.knex.client['config']['client']);
                if (records === undefined || records.length !== 1 || records[0]['id'] !== newId) {
                    return utils.reject('_doActionTag assignjoin ' + table + ' failed: newId not found ' + newId);
                }

                return SqlUtils.executeRawSqlQueryData(sqlBuilder, insertSqlQuery);
            }).then(() => {
                const updateSqlQuery: RawSqlQueryData = this.sqlQueryBuilder.updateChangelogSqlQuery(
                    'update', assignConfig.table, assignConfig.idField, assignConfig.changelogConfig, id);
                if (updateSqlQuery) {
                    return SqlUtils.executeRawSqlQueryData(sqlBuilder, updateSqlQuery);
                }

                return Promise.resolve(true);
            }).then(() => {
                const updateSqlQuery: RawSqlQueryData = this.sqlQueryBuilder.updateChangelogSqlQuery(
                    'update', referenceConfig.joinedTable, referenceConfig.joinedIdField, referenceConfig.changelogConfig, newId);
                if (updateSqlQuery) {
                    return SqlUtils.executeRawSqlQueryData(sqlBuilder, updateSqlQuery);
                }

                return Promise.resolve(true);
            }).then(() => {
                return resolve(true);
            }).catch(function errorPlaylist(reason) {
                console.error('_doActionTag assignjoin ' + table + ' failed:', reason);
                return reject(reason);
            });
        });

        return result;
    }

}
