import {ActionTagForm} from '../../commons/utils/actiontag.utils';
import {IdValidationRule} from '../../search-commons/model/forms/generic-validator.util';
import {utils} from 'js-data';
import {ChangelogDataConfig, SqlQueryBuilder} from '../../search-commons/services/sql-query.builder';
import * as Promise_serial from 'promise-serial';
import {RawSqlQueryData, SqlUtils} from '../../search-commons/services/sql-utils';
import {DateUtils} from '../../commons/utils/date.utils';

export interface ActionTagReplaceReferenceTableConfigType {
    table: string;
    fieldReference: string;
    changelogConfig?: ChangelogDataConfig;
}

export interface ActionTagReplaceTableConfigType {
    fieldId: string;
    joins: ActionTagReplaceReferenceTableConfigType[];
    referenced: ActionTagReplaceReferenceTableConfigType[];
    table: string;
    changelogConfig?: ChangelogDataConfig;
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

export class CommonSqlActionTagReplaceAdapter {

    private idValidator = new IdValidationRule(true);
    private config: any;
    private readonly knex: any;
    private sqlQueryBuilder: SqlQueryBuilder;
    private readonly replaceConfigs: ActionTagReplaceConfigType;

    constructor(config: any, knex: any, sqlQueryBuilder: SqlQueryBuilder, replaceConfigs: ActionTagReplaceConfigType) {
        this.config = config;
        this.knex = knex;
        this.sqlQueryBuilder = sqlQueryBuilder;
        this.replaceConfigs = replaceConfigs;
    }

    public executeActionTagReplace(table: string, id: number, actionTagForm: ReplaceActionTagForm, opts: any): Promise<any> {
        opts = opts || {};

        if (!utils.isInteger(id)) {
            return utils.reject('actiontag ' + actionTagForm.key + ' id not an integer');
        }
        if (actionTagForm.payload === undefined) {
            return utils.reject('actiontag ' + actionTagForm.key + ' playload expected');
        }
        let newId: any = actionTagForm.payload.newId;
        const newIdSetNull = actionTagForm.payload.newIdSetNull;
        if (newIdSetNull) {
            if (newId !== null && newId !== 'null') {
                return utils.reject('actiontag ' + actionTagForm.key + ' newId must be null if newIdSetNull');
            }
        } else {
            if (!this.idValidator.isValid(newId)) {
                return utils.reject('actiontag ' + actionTagForm.key + ' newId not valid');
            }
            if ((id + '') === (newId + '')) {
                return utils.reject('actiontag ' + actionTagForm.key + ' newId must not equal id');
            }
            newId = parseInt(newId, 10);
            if (!utils.isInteger(newId)) {
                return utils.reject('actiontag ' + actionTagForm.key + ' newId must be integer');
            }
        }

        const replaceConfig: ActionTagReplaceTableConfigType = this.replaceConfigs.tables[table];
        if (!replaceConfig) {
            return utils.reject('actiontag ' + actionTagForm.key + ' table not valid');
        }

        const referenceConfigs: ActionTagReplaceReferenceTableConfigType[] = replaceConfig.referenced;
        if (!referenceConfigs) {
            return utils.reject('actiontag ' + actionTagForm.key + ' table.referenced not valid');
        }

        const joinConfigs: ActionTagReplaceReferenceTableConfigType[] = replaceConfig.joins;
        if (!joinConfigs) {
            return utils.reject('actiontag ' + actionTagForm.key + ' table.joins not valid');
        }

        const checkBaseSqlQuery: RawSqlQueryData = {
            sql: 'SELECT ' + replaceConfig.fieldId + ' AS id' +
                ' FROM ' + replaceConfig.table +
                ' WHERE ' + replaceConfig.fieldId + '=' + '?' + '',
            parameters: [id]
        };
        let checkNewValueSqlQuery: RawSqlQueryData = undefined;
        const updateSqlQueries: RawSqlQueryData[] = [];
        for (const referenceConfig of referenceConfigs) {
            const changelogDataConfig = referenceConfig.changelogConfig;
            if (changelogDataConfig && (changelogDataConfig.updateDateField !== undefined || changelogDataConfig.updateVersionField !== undefined)) {
                const updateFields = [];
                const parameters = [];
                if (changelogDataConfig.updateDateField !== undefined) {
                    updateFields.push(changelogDataConfig.updateDateField + '=?');
                    parameters.push(DateUtils.dateToLocalISOString(new Date()));
                }
                if (changelogDataConfig.updateVersionField !== undefined) {
                    updateFields.push(changelogDataConfig.updateVersionField +
                        '=COALESCE(' + changelogDataConfig.updateVersionField + ', 0)+1');
                }

                parameters.push(id)
                updateSqlQueries.push({
                    sql:
                        'UPDATE ' + referenceConfig.table + ' ' +
                        'SET ' +
                        updateFields.join(', ') + ' ' +
                        'WHERE ' + referenceConfig.fieldReference + '=?',
                    parameters: parameters}
                );
            }
        }

        if (newIdSetNull) {
            checkNewValueSqlQuery = {
                sql: 'SELECT null AS id',
                parameters: []};
            for (const referenceConfig of referenceConfigs) {
                updateSqlQueries.push({
                    sql:
                        'UPDATE ' + referenceConfig.table +
                        ' SET ' + referenceConfig.fieldReference + '=null' +
                        ' WHERE ' + referenceConfig.fieldReference + '=' + '?' + '',
                    parameters: [id]}
                );
            }
            for (const joinConfig of joinConfigs) {
                updateSqlQueries.push({
                    sql:
                        'DELETE FROM ' + joinConfig.table +
                        ' WHERE ' + joinConfig.fieldReference + '=' + '?' + '',
                    parameters: [id]}
                );
            }
        } else {
            checkNewValueSqlQuery = {
                sql: 'SELECT ' + replaceConfig.fieldId + ' AS id' +
                    ' FROM ' + replaceConfig.table +
                    ' WHERE ' + replaceConfig.fieldId + '=' + '?' + '',
                parameters: [newId]};
            for (const referenceConfig of referenceConfigs) {
                updateSqlQueries.push({
                    sql:
                        'UPDATE ' + referenceConfig.table +
                        ' SET ' + referenceConfig.fieldReference + '=' + '?' + '' +
                        ' WHERE ' + referenceConfig.fieldReference + '=' + '?' + '',
                    parameters: [newId, id]}
                );
            }
            for (const joinConfig of joinConfigs) {
                updateSqlQueries.push({
                    sql:
                        'UPDATE ' + joinConfig.table +
                        ' SET ' + joinConfig.fieldReference + '=' + '?' + '' +
                        ' WHERE ' + joinConfig.fieldReference + '=' + '?' + '',
                    parameters: [newId, id]}
                );
            }

            if (replaceConfig.changelogConfig && replaceConfig.changelogConfig.updateDateField !== undefined) {
                const updateSqlQuery: RawSqlQueryData = this.sqlQueryBuilder.updateChangelogSqlQuery(
                    'update', replaceConfig.table, replaceConfig.fieldId, replaceConfig.changelogConfig, newId);
                if (updateSqlQuery) {
                    updateSqlQueries.push(updateSqlQuery);
                }
            }
        }

        const deleteSqlQuery: RawSqlQueryData = {
            sql: 'DELETE FROM ' + replaceConfig.table +
                ' WHERE ' + replaceConfig.fieldId + '=' + '?' + '',
            parameters: [id]};

        const sqlBuilder = utils.isUndefined(opts.transaction)
            ? this.knex
            : opts.transaction;
        const result = new Promise((resolve, reject) => {
            SqlUtils.executeRawSqlQueryData(sqlBuilder, checkBaseSqlQuery).then(dbresults => {
                const records = this.sqlQueryBuilder.extractDbResult(dbresults, this.knex.client['config']['client']);
                if (records === undefined || records.length !== 1 || records[0]['id'] !== id) {
                    return utils.reject('_doActionTag replace ' + table + ' failed: id not found ' + id);
                }

                return SqlUtils.executeRawSqlQueryData(sqlBuilder, checkNewValueSqlQuery);
            }).then(dbresults => {
                const records = this.sqlQueryBuilder.extractDbResult(dbresults, this.knex.client['config']['client']);
                if (records === undefined || records.length !== 1 || records[0]['id'] !== newId) {
                    return utils.reject('_doActionTag replace ' + table + ' failed: newId not found ' + newId);
                }

                const updateSqlQueryPromises = [];
                for (const updateSql of updateSqlQueries) {
                    updateSqlQueryPromises.push(function () {
                        return SqlUtils.executeRawSqlQueryData(sqlBuilder, updateSql);
                    });
                }
                return Promise_serial(updateSqlQueryPromises, {parallelize: 1});
            }).then(() => {
                return SqlUtils.executeRawSqlQueryData(sqlBuilder, deleteSqlQuery);
            }).then(() => {
                return resolve(true);
            }).catch(function errorPlaylist(reason) {
                console.error('_doActionTag replace ' + table + ' failed:', reason);
                return reject(reason);
            });
        });

        return result;
    }

}
