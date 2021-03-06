import {utils} from 'js-data';
import {KeywordValidationRule} from '../../search-commons/model/forms/generic-validator.util';
import {SqlQueryBuilder} from '../../search-commons/services/sql-query.builder';
import {StringUtils} from '../../commons/utils/string.utils';
import {RawSqlQueryData, SqlUtils} from '../../search-commons/services/sql-utils';

export interface PlaylistModelConfigJoinType {
    table: string;
    joinTable: string;
    fieldReference: string;
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

    constructor(config: any, knex: any, sqlQueryBuilder: SqlQueryBuilder, playlistModelConfig: PlaylistModelConfigType) {
        this.config = config;
        this.knex = knex;
        this.sqlQueryBuilder = sqlQueryBuilder;
        this.playlistModelConfig = playlistModelConfig;
    }

    public setPlaylists(joinTableKey: string, dbId: number, playlist: string, opts: any, set: boolean):
        Promise<any> {
        if (!utils.isInteger(dbId)) {
            return utils.reject('actiontag ' + joinTableKey + ' id not an integer');
        }
        if (!this.playlistValidationRule.isValid(playlist)) {
            return utils.reject('actiontag ' + joinTableKey + ' playlist not valid');
        }
        if (!this.playlistModelConfig.joins[joinTableKey]) {
            return utils.reject('setGenericPlaylists: ' + joinTableKey + ' - table not valid');
        }
        const playlistKeys = StringUtils.uniqueKeywords(playlist);

        const playlistTable = this.playlistModelConfig.table;
        const playlistNameField = this.playlistModelConfig.fieldName;
        const playlistIdField = this.playlistModelConfig.fieldId;
        const joinTable = this.playlistModelConfig.joins[joinTableKey].joinTable;
        const joinBaseIdField = this.playlistModelConfig.joins[joinTableKey].fieldReference;

        const deleteSqlQuery: RawSqlQueryData = {
            sql: 'DELETE FROM ' + joinTable + ' ' +
                'WHERE ' + playlistIdField + ' IN' +
                '     (SELECT ' + playlistIdField + ' FROM ' + playlistTable +
                '      WHERE ' + playlistNameField + ' IN (' + SqlUtils.mapParametersToPlaceholderString(playlistKeys) + '))' +
                ' AND ' + joinBaseIdField + ' = ' + '?' + '',
            parameters: [].concat(playlistKeys).concat([dbId])};
        const insertSqlQuery: RawSqlQueryData = {
            sql: 'INSERT INTO ' + joinTable + ' (' + playlistIdField + ', ' + joinBaseIdField + ')' +
                ' SELECT ' + playlistIdField + ' AS ' + playlistIdField + ',' +
                '     ' + '?' + ' AS ' + joinBaseIdField + ' FROM ' + playlistTable +
                '     WHERE ' + playlistNameField + ' IN (' + SqlUtils.mapParametersToPlaceholderString(playlistKeys) + ')',
            parameters: [].concat([dbId]).concat(playlistKeys)};

        const sqlBuilder = utils.isUndefined(opts.transaction) ? this.knex : opts.transaction;
        const rawDelete = SqlUtils.executeRawSqlQueryData(sqlBuilder, deleteSqlQuery);
        const result = new Promise((resolve, reject) => {
            rawDelete.then(() => {
                if (set) {
                    return SqlUtils.executeRawSqlQueryData(sqlBuilder, insertSqlQuery);
                }

                return utils.resolve(true);
            }).then(() => {
                return resolve(true);
            }).catch(function errorPlaylist(reason) {
                console.error('_doActionTag delete/insert ' + joinTable + ' failed:', reason);
                return reject(reason);
            });
        });

        return result;
    }
}
