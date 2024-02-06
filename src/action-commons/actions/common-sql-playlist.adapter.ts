import {utils} from 'js-data';
import {
    DescValidationRule,
    KeywordValidationRule,
    NumberValidationRule
} from '../../search-commons/model/forms/generic-validator.util';
import {ChangelogDataConfig, SqlQueryBuilder} from '../../search-commons/services/sql-query.builder';
import {StringUtils} from '../../commons/utils/string.utils';
import {RawSqlQueryData, SqlUtils} from '../../search-commons/services/sql-utils';
import * as Promise_serial from 'promise-serial';

export interface PlaylistModelConfigJoinType {
    table: string;
    joinTable: string;
    fieldReference: string;
    positionField?: string;
    detailsField?: string;
    changelogConfig?: ChangelogDataConfig;
}

export interface PlaylistModelConfigJoinsType {
    [key: string]: PlaylistModelConfigJoinType;
}

export interface PlaylistModelConfigType {
    fieldId: string;
    fieldName: string;
    joins: PlaylistModelConfigJoinsType;
    table: string;
    // sql: UPDATE image_playlist SET ip_pos = ip_pos + ? WHERE p_id IN     (SELECT p_id FROM playlist      WHERE p_name IN (?)) AND ip_pos >= ?
    // parameter [-1, 1] (inc/dec), playlistKey, oldPosition
    commonChangeSuccessorPosSqls ?: string [];
    // sql: SELECT max(pos) AS maxPos FROM all_entries_playlist_max WHERE p_id IN     (SELECT p_id FROM playlist      WHERE p_name IN (?))
    // parameter playlistKey
    commonSelectMaxPositionSql ?: string;
}

export class CommonSqlPlaylistAdapter {

    private config: any;
    private readonly knex: any;
    private sqlQueryBuilder: SqlQueryBuilder;
    private readonly playlistModelConfig: PlaylistModelConfigType;
    private playlistValidationRule = new KeywordValidationRule(true);
    private numberValidationRule = new NumberValidationRule(false, 1, 999999999999, undefined);
    private textValidationRule = new DescValidationRule(false);

    constructor(config: any, knex: any, sqlQueryBuilder: SqlQueryBuilder, playlistModelConfig: PlaylistModelConfigType) {
        this.config = config;
        this.knex = knex;
        this.sqlQueryBuilder = sqlQueryBuilder;
        this.playlistModelConfig = playlistModelConfig;
    }

    public setPlaylists(joinTableKey: string, dbId: number, playlist: string, opts: any, set: boolean,
                        position?: number, details?: string):
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
        if (!this.textValidationRule.isValid(details)) {
            return utils.reject('setPlaylists ' + joinTableKey + ' details not valid');
        }

        const me = this;
        const playlistKeys = StringUtils.uniqueKeywords(playlist);
        const playlistTable = this.playlistModelConfig.table;
        const playlistNameField = this.playlistModelConfig.fieldName;
        const playlistIdField = this.playlistModelConfig.fieldId;
        const joinConfig = this.playlistModelConfig.joins[joinTableKey];
        const joinTable = joinConfig.joinTable;
        const joinBaseIdField = joinConfig.fieldReference;
        const positionField = joinConfig.positionField;
        const updateSqlQuery: RawSqlQueryData = this.sqlQueryBuilder.updateChangelogSqlQuery(
            'update', joinConfig.table, undefined, joinConfig.changelogConfig, dbId);

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

                return Promise.resolve(true);
            }).then(() => {
                if (updateSqlQuery) {
                    return SqlUtils.executeRawSqlQueryData(sqlBuilder, updateSqlQuery);
                }

                return Promise.resolve(true);
            }).then(() => {
                return Promise.resolve(true);
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
                    return me.setPlaylist(joinTableKey, dbId, playlistKey, opts, set, position, details, oldRecord);
                });
            }

            return Promise_serial(promises, {parallelize: 1})
        }).then(() => {
            if (updateSqlQuery) {
                return SqlUtils.executeRawSqlQueryData(sqlBuilder, updateSqlQuery);
            }

            return Promise.resolve(true);
        }).then(() => {
            return Promise.resolve(true);
        }).catch(function errorPlaylist(reason) {
            console.error('setPlaylists ' + joinTable + ' failed:', reason);
            return Promise.reject(reason);
        });
    }

    protected setPlaylist(joinTableKey: string, dbId: number, playlistKey: string, opts: any, set: boolean,
                       position: number, details: string, oldRecord: {}):
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
        const joinConfig = this.playlistModelConfig.joins[joinTableKey];
        const joinTable = joinConfig.joinTable;
        const joinBaseIdField = joinConfig.fieldReference;
        const positionField = joinConfig.positionField;
        const detailsField = joinConfig.detailsField;

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
                if (this.playlistModelConfig.commonChangeSuccessorPosSqls !== undefined) {
                    for (const sql of this.playlistModelConfig.commonChangeSuccessorPosSqls) {
                        const updateOldPlaylistSuccessorsSqlQuery: RawSqlQueryData = {
                            sql: sql,
                            parameters: [].concat([-1]).concat([playlistKey]).concat([oldValue])
                        };
                        promises.push(function () {
                            return SqlUtils.executeRawSqlQueryData(sqlBuilder, updateOldPlaylistSuccessorsSqlQuery);
                        })
                    }
                } else {
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
        }

        if (position !== undefined) {
            if (this.playlistModelConfig.commonChangeSuccessorPosSqls !== undefined) {
                for (const sql of this.playlistModelConfig.commonChangeSuccessorPosSqls) {
                    const updateOldPlaylistSuccessorsSqlQuery: RawSqlQueryData = {
                        sql: sql,
                        parameters: [].concat([+1]).concat([playlistKey]).concat([position])
                    };
                    promises.push(function () {
                        return SqlUtils.executeRawSqlQueryData(sqlBuilder, updateOldPlaylistSuccessorsSqlQuery);
                    });
                }
            } else {
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
        }

        return Promise_serial(promises, {parallelize: 1}).then((value) => {
            if (!set) {
                return Promise.resolve(value);
            }

            const sql = 'INSERT INTO ' + joinTable + ' (' + playlistIdField + ', ' +
                (detailsField && details ? detailsField + ', ' : '') +
                positionField + ', ' + joinBaseIdField + ')' +
                ' SELECT ' + playlistIdField + ' AS ' + playlistIdField + ',' +
                (detailsField && details ? '     ' + '?' + ' AS ' + detailsField + ',' : '') +
                '     ' + '?' + ' AS ' + positionField + ',' +
                '     ' + '?' + ' AS ' + joinBaseIdField + ' FROM ' + playlistTable +
                '     WHERE ' + playlistNameField + ' IN (?)';
            const params = detailsField && details
                ? [details]
                : [];

            if (position !== undefined) {
                const insertSinglePlaylistSqlQuery: RawSqlQueryData = {
                    sql: sql,
                    parameters: [].concat(params).concat([position]).concat([dbId]).concat([playlistKey])
                };
                return SqlUtils.executeRawSqlQueryData(sqlBuilder, insertSinglePlaylistSqlQuery);
            }

            const selectMaxPlaylistPositionSql = this.playlistModelConfig.commonSelectMaxPositionSql
                ? this.playlistModelConfig.commonSelectMaxPositionSql
                : 'SELECT max(' + positionField + ') AS maxPos FROM ' + joinTable + ' WHERE ' + playlistIdField + ' IN' +
                '     (SELECT ' + playlistIdField + ' FROM ' + playlistTable +
                '      WHERE ' + playlistNameField + ' IN (?))'
            const selectMaxPlaylistPositionSqlQuery: RawSqlQueryData = {
                sql: selectMaxPlaylistPositionSql,
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
                    sql: sql,
                    parameters: [].concat([maxPos]).concat([dbId]).concat([playlistKey])
                };
                return SqlUtils.executeRawSqlQueryData(sqlBuilder, insertSinglePlaylistSqlQuery);
            });
        });
    }

}
