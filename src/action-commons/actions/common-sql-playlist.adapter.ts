import {utils} from 'js-data';
import {KeywordValidationRule, NumberValidationRule} from '../../search-commons/model/forms/generic-validator.util';
import {SqlQueryBuilder} from '../../search-commons/services/sql-query.builder';
import {StringUtils} from '../../commons/utils/string.utils';
import {RawSqlQueryData, SqlUtils} from '../../search-commons/services/sql-utils';
import * as Promise_serial from 'promise-serial';

export interface PlaylistModelConfigJoinType {
    table: string;
    joinTable: string;
    fieldReference: string;
    positionField ?: string;
}

export interface PlaylistModelConfigJoinsType {
    [key: string]: PlaylistModelConfigJoinType;
}

export interface PlaylistModelConfigType {
    fieldId: string;
    fieldName: string;
    joins: PlaylistModelConfigJoinsType;
    table: string;
}

export class CommonSqlPlaylistAdapter {

    private config: any;
    private readonly knex: any;
    private sqlQueryBuilder: SqlQueryBuilder;
    private readonly playlistModelConfig: PlaylistModelConfigType;
    private playlistValidationRule = new KeywordValidationRule(true);
    private numberValidationRule = new NumberValidationRule(false, 1, 999999999999, undefined);

    constructor(config: any, knex: any, sqlQueryBuilder: SqlQueryBuilder, playlistModelConfig: PlaylistModelConfigType) {
        this.config = config;
        this.knex = knex;
        this.sqlQueryBuilder = sqlQueryBuilder;
        this.playlistModelConfig = playlistModelConfig;
    }

    public setPlaylists(joinTableKey: string, dbId: number, playlist: string, opts: any, set: boolean, position?: number):
        Promise<any> {
        if (!utils.isInteger(dbId)) {
            return utils.reject('setPlaylists ' + joinTableKey + ' id not an integer');
        }
        if (!this.playlistValidationRule.isValid(playlist)) {
            return utils.reject('setPlaylists ' + joinTableKey + ' playlist not valid');
        }
        if (!this.playlistModelConfig.joins[joinTableKey]) {
            return utils.reject('setPlaylists: ' + joinTableKey + ' - table not valid');
        }
        if (!this.numberValidationRule.isValid(position)) {
            return utils.reject('setPlaylists ' + joinTableKey + ' position not valid');
        }

        const me = this;
        const playlistKeys = StringUtils.uniqueKeywords(playlist);
        const playlistTable = this.playlistModelConfig.table;
        const playlistNameField = this.playlistModelConfig.fieldName;
        const playlistIdField = this.playlistModelConfig.fieldId;
        const joinTable = this.playlistModelConfig.joins[joinTableKey].joinTable;
        const joinBaseIdField = this.playlistModelConfig.joins[joinTableKey].fieldReference;
        const positionField = this.playlistModelConfig.joins[joinTableKey].positionField;

        const sqlBuilder = utils.isUndefined(opts.transaction)
            ? this.knex
            : opts.transaction;
        if (positionField === undefined) {
            const deleteMultiPlaylistsSqlQuery: RawSqlQueryData = {
                sql: 'DELETE FROM ' + joinTable + ' ' +
                    'WHERE ' + playlistIdField + ' IN' +
                    '     (SELECT ' + playlistIdField + ' FROM ' + playlistTable +
                    '      WHERE ' + playlistNameField + ' IN (' + SqlUtils.mapParametersToPlaceholderString(playlistKeys) + '))' +
                    ' AND ' + joinBaseIdField + ' = ' + '?' + '',
                parameters: [].concat(playlistKeys).concat([dbId])
            };
            const insertMultiPlaylistsSqlQuery: RawSqlQueryData = {
                sql: 'INSERT INTO ' + joinTable + ' (' + playlistIdField + ', ' + joinBaseIdField + ')' +
                    ' SELECT ' + playlistIdField + ' AS ' + playlistIdField + ',' +
                    '     ' + '?' + ' AS ' + joinBaseIdField + ' FROM ' + playlistTable +
                    '     WHERE ' + playlistNameField + ' IN (' + SqlUtils.mapParametersToPlaceholderString(playlistKeys) + ')',
                parameters: [].concat([dbId]).concat(playlistKeys)
            };

            return SqlUtils.executeRawSqlQueryData(sqlBuilder, deleteMultiPlaylistsSqlQuery).then(() => {
                if (set) {
                    return SqlUtils.executeRawSqlQueryData(sqlBuilder, insertMultiPlaylistsSqlQuery);
                }

                return utils.resolve(true);
            }).then(() => {
                return utils.resolve(true);
            }).catch(function errorPlaylist(reason) {
                console.error('_doActionTag delete/insert ' + joinTable + ' failed:', reason);
                return utils.reject(reason);
            });
        }

        const selectOldPlaylistJoinSqlQuery: RawSqlQueryData = {
            sql: 'SELECT * FROM ' + joinTable + ' INNER JOIN ' + playlistTable +
                ' ON ' + playlistTable + '.' + playlistIdField + ' = ' + joinTable + '.' + playlistIdField +
                ' WHERE ' + joinTable + '.' + playlistIdField + ' IN' +
                '     (SELECT ' + playlistIdField + ' FROM ' + playlistTable +
                '      WHERE ' + playlistNameField + ' IN (' + SqlUtils.mapParametersToPlaceholderString(playlistKeys) + '))' +
                ' AND ' + joinBaseIdField + ' = ' + '?' + '',
            parameters: [].concat(playlistKeys).concat([dbId])
        };
        return SqlUtils.executeRawSqlQueryData(sqlBuilder, selectOldPlaylistJoinSqlQuery).then(dbresults => {
            const oldPlaylistJoins: any[] = <any[]>this.sqlQueryBuilder.extractDbResult(dbresults, this.knex.client['config']['client']);
            const oldPlaylistJoinsByPlaylistKey: { [key: string]: {} } = {};
            if (oldPlaylistJoins !== undefined && oldPlaylistJoins.length >= 1) {
                oldPlaylistJoins.forEach(record => {
                    oldPlaylistJoinsByPlaylistKey[record[playlistNameField]] = record;
                })
            }

            const promises = [];
            for (const playlistKey of playlistKeys) {
                const oldRecord = oldPlaylistJoinsByPlaylistKey[playlistKey];
                promises.push(function () {
                    return me.setPlaylist(joinTableKey, dbId, playlistKey, opts, set, position, oldRecord);
                });
            }

            return Promise_serial(promises, {parallelize: 1})
        }).then(() => {
            return utils.resolve(true);
        }).catch(function errorPlaylist(reason) {
            console.error('setPlaylists ' + joinTable + ' failed:', reason);
            return utils.reject(reason);
        });
    }

    protected setPlaylist(joinTableKey: string, dbId: number, playlistKey: string, opts: any, set: boolean,
                       position: number, oldRecord: {}):
        Promise<any> {
        if (!utils.isInteger(dbId)) {
            return utils.reject('setPlaylist ' + joinTableKey + ' id not an integer');
        }
        if (!this.playlistValidationRule.isValid(playlistKey)) {
            return utils.reject('setPlaylist ' + joinTableKey + ' playlist not valid');
        }
        if (!this.playlistModelConfig.joins[joinTableKey]) {
            return utils.reject('setPlaylist: ' + joinTableKey + ' - table not valid');
        }
        if (!this.numberValidationRule.isValid(position)) {
            return utils.reject('setPlaylist ' + joinTableKey + ' position not valid');
        }

        const playlistTable = this.playlistModelConfig.table;
        const playlistNameField = this.playlistModelConfig.fieldName;
        const playlistIdField = this.playlistModelConfig.fieldId;
        const joinTable = this.playlistModelConfig.joins[joinTableKey].joinTable;
        const joinBaseIdField = this.playlistModelConfig.joins[joinTableKey].fieldReference;
        const positionField = this.playlistModelConfig.joins[joinTableKey].positionField;

        const sqlBuilder = utils.isUndefined(opts.transaction)
            ? this.knex
            : opts.transaction;
        const promises = [];
        const deleteSinglePlaylistSqlQuery: RawSqlQueryData = {
            sql: 'DELETE FROM ' + joinTable + ' ' +
                'WHERE ' + playlistIdField + ' IN' +
                '     (SELECT ' + playlistIdField + ' FROM ' + playlistTable +
                '      WHERE ' + playlistNameField + ' IN (?))' +
                ' AND ' + joinBaseIdField + ' = ' + '?' + '',
            parameters: [].concat([playlistKey]).concat([dbId])
        };
        promises.push(function () {
            return SqlUtils.executeRawSqlQueryData(sqlBuilder, deleteSinglePlaylistSqlQuery);
        })

        if (oldRecord !== undefined) {
            const oldValue = oldRecord[positionField]
            if (oldValue !== undefined && oldValue !== null && oldValue !== 'null') {
                const updateOldPlaylistSuccessorsSqlQuery: RawSqlQueryData = {
                    sql: 'UPDATE ' + joinTable + ' SET ' + positionField + ' = ' + positionField + ' - 1 ' +
                        'WHERE ' + playlistIdField + ' IN' +
                        '     (SELECT ' + playlistIdField + ' FROM ' + playlistTable +
                        '      WHERE ' + playlistNameField + ' IN (?))' +
                        ' AND ' + positionField + ' >= ' + '?' + '',
                    parameters: [].concat([playlistKey]).concat([oldValue])
                };
                promises.push(function () {
                    return SqlUtils.executeRawSqlQueryData(sqlBuilder, updateOldPlaylistSuccessorsSqlQuery);
                })
            }
        }

        if (position !== undefined) {
            const updateNewPlaylistSuccessorsSqlQuery: RawSqlQueryData = {
                sql: 'UPDATE ' + joinTable + ' SET ' + positionField + ' = ' + positionField + ' + 1 ' +
                    'WHERE ' + playlistIdField + ' IN' +
                    '     (SELECT ' + playlistIdField + ' FROM ' + playlistTable +
                    '      WHERE ' + playlistNameField + ' IN (?))' +
                    ' AND ' + positionField + ' >= ' + '?' + '',
                parameters: [].concat([playlistKey]).concat([position])
            };
            promises.push(function () {
                return SqlUtils.executeRawSqlQueryData(sqlBuilder, updateNewPlaylistSuccessorsSqlQuery);
            })
        }

        return Promise_serial(promises, {parallelize: 1}).then((value) => {
            if (!set) {
                return utils.resolve(value);
            }

            if (position !== undefined) {
                const insertSinglePlaylistSqlQuery: RawSqlQueryData = {
                    sql: 'INSERT INTO ' + joinTable + ' (' + playlistIdField + ', ' + positionField + ', ' + joinBaseIdField + ')' +
                        ' SELECT ' + playlistIdField + ' AS ' + playlistIdField + ',' +
                        '     ' + '?' + ' AS ' + positionField + ',' +
                        '     ' + '?' + ' AS ' + joinBaseIdField + ' FROM ' + playlistTable +
                        '     WHERE ' + playlistNameField + ' IN (?)',
                    parameters: [].concat([position]).concat([dbId]).concat([playlistKey])
                };
                return SqlUtils.executeRawSqlQueryData(sqlBuilder, insertSinglePlaylistSqlQuery);
            }

            const selectMaxPlaylistPositionSqlQuery: RawSqlQueryData = {
                sql: 'SELECT max(' + positionField + ') AS maxPos FROM ' + joinTable + ' WHERE ' + playlistIdField + ' IN' +
                    '     (SELECT ' + playlistIdField + ' FROM ' + playlistTable +
                    '      WHERE ' + playlistNameField + ' IN (?))',
                parameters: [].concat([playlistKey])
            };
            return SqlUtils.executeRawSqlQueryData(sqlBuilder, selectMaxPlaylistPositionSqlQuery).then(dbresults => {
                const maxResultRecords: any[] = <any[]>this.sqlQueryBuilder.extractDbResult(dbresults, this.knex.client['config']['client']);
                let maxPos = 0;
                if (maxResultRecords !== undefined && maxResultRecords.length === 1 && maxResultRecords[0]['maxPos']) {
                    maxPos = maxResultRecords[0]['maxPos'] + 0;
                }

                maxPos = maxPos + 1;
                const insertSinglePlaylistSqlQuery: RawSqlQueryData = {
                    sql: 'INSERT INTO ' + joinTable + ' (' + playlistIdField + ', ' + positionField + ', ' + joinBaseIdField + ')' +
                        ' SELECT ' + playlistIdField + ' AS ' + playlistIdField + ',' +
                        '     ' + '?' + ' AS ' + positionField + ',' +
                        '     ' + '?' + ' AS ' + joinBaseIdField + ' FROM ' + playlistTable +
                        '     WHERE ' + playlistNameField + ' IN (?)',
                    parameters: [].concat([maxPos]).concat([dbId]).concat([playlistKey])
                };
                return SqlUtils.executeRawSqlQueryData(sqlBuilder, insertSinglePlaylistSqlQuery);
            });
        });
    }

}
