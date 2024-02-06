import {utils} from 'js-data';
import {ChangelogDataConfig, SqlQueryBuilder} from '../../search-commons/services/sql-query.builder';
import {BaseJoinRecordType} from '../../search-commons/model/records/basejoin-record';
import {RawSqlQueryData, SqlUtils} from '../../search-commons/services/sql-utils';
import * as Promise_serial from 'promise-serial';


export interface JoinFieldMappingConfigJoinType {
    [key: string]: string;
}

export interface JoinModelConfigTableType {
    baseTableIdField: string;
    joinTable: string;
    joinFieldMappings: JoinFieldMappingConfigJoinType;
    changelogConfig?: ChangelogDataConfig;
}

export interface JoinModelConfigTablesType {
    [key: string]: JoinModelConfigTableType;
}

export interface JoinModelConfigType {
    name: string;
    tables: JoinModelConfigTablesType;
}

export interface JoinModelConfigsType {
    [key: string]: JoinModelConfigType;
}

export class CommonSqlJoinAdapter {

    private config: any;
    private readonly knex: any;
    private sqlQueryBuilder: SqlQueryBuilder;
    private readonly joinModelConfig: JoinModelConfigsType;

    constructor(config: any, knex: any, sqlQueryBuilder: SqlQueryBuilder, joinModelConfig: JoinModelConfigsType) {
        this.config = config;
        this.knex = knex;
        this.sqlQueryBuilder = sqlQueryBuilder;
        this.joinModelConfig = joinModelConfig;
    }

    public saveJoins(joinKey: string, baseTableKey: string, dbId: number, joinRecords: BaseJoinRecordType[], opts: any):
        Promise<any> {
        if (!utils.isInteger(dbId)) {
            return utils.reject('saveJoins ' + baseTableKey + ' id not an integer');
        }
        if (!this.joinModelConfig[joinKey]) {
            return utils.reject('saveJoins: ' + joinKey + ' -> ' + baseTableKey + ' - join not valid');
        }

        const joinConfig = this.joinModelConfig[joinKey];
        if (!joinConfig.tables[baseTableKey]) {
            return utils.reject('saveJoins: ' + joinKey + ' -> ' + baseTableKey + ' - table not valid');
        }
        const joinedTableConfig = joinConfig.tables[baseTableKey];
        const baseTableIdField = joinedTableConfig.baseTableIdField;
        const joinTable = joinedTableConfig.joinTable;
        const joinFields = joinedTableConfig.joinFieldMappings;

        const deleteSqlQuery: RawSqlQueryData = {
            sql: 'DELETE FROM ' + joinTable + ' ' +
                'WHERE ' + baseTableIdField + ' = ' + '?' + '',
            parameters: [].concat([dbId])};
        const promises = [];

        const sqlBuilder = utils.isUndefined(opts.transaction)
            ? this.knex
            : opts.transaction;

        for (const joinRecord of joinRecords) {
            const fields = [baseTableIdField];
            const values = [dbId];
            for (const destField in joinFields) {
                fields.push(destField);
                const value = joinRecord[joinFields[destField]];
                values.push(value === undefined || value === null || value === 'undefined' || value === 'null' ? null : value);
            }
            const insertSqlQuery: RawSqlQueryData = {
                sql: 'INSERT INTO ' + joinTable + ' (' + fields.join(', ') + ') ' +
                    'VALUES(' + SqlUtils.mapParametersToPlaceholderString(values) + ')',
                parameters: [].concat(values)};
            promises.push(function () {
                return SqlUtils.executeRawSqlQueryData(sqlBuilder, insertSqlQuery)
            });
        }

        if (joinedTableConfig.changelogConfig) {
            const updateSqlQuery = this.sqlQueryBuilder.updateChangelogSqlQuery(
                'update', baseTableKey, baseTableIdField, joinedTableConfig.changelogConfig, dbId);
            promises.push(function () {
                return SqlUtils.executeRawSqlQueryData(sqlBuilder, updateSqlQuery);
            });
        }

        const result = new Promise((resolve, reject) => {
            SqlUtils.executeRawSqlQueryData(sqlBuilder, deleteSqlQuery).then(() => {
                return Promise_serial(promises, {parallelize: 1}).then(() => {
                    return resolve(true);
                }).catch(function errorJoinDetails(reason) {
                    console.error('_doJoin delete/insert ' + joinTable + ' failed:', reason);
                    return reject(reason);
                });
            }).then(() => {
                return resolve(true);
            }).catch(function errorJoin(reason) {
                console.error('_doJoin delete/insert ' + joinTable + ' failed:', reason);
                return reject(reason);
            });
        });

        return result;
    }
}
