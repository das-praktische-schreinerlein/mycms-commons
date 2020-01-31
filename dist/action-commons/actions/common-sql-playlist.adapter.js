"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var js_data_1 = require("js-data");
var generic_validator_util_1 = require("../../search-commons/model/forms/generic-validator.util");
var string_utils_1 = require("../../commons/utils/string.utils");
var sql_utils_1 = require("../../search-commons/services/sql-utils");
var CommonSqlPlaylistAdapter = /** @class */ (function () {
    function CommonSqlPlaylistAdapter(config, knex, sqlQueryBuilder, playlistModelConfig) {
        this.playlistValidationRule = new generic_validator_util_1.KeywordValidationRule(true);
        this.config = config;
        this.knex = knex;
        this.sqlQueryBuilder = sqlQueryBuilder;
        this.playlistModelConfig = playlistModelConfig;
    }
    CommonSqlPlaylistAdapter.prototype.setPlaylists = function (joinTableKey, dbId, playlist, opts, set) {
        if (!js_data_1.utils.isInteger(dbId)) {
            return js_data_1.utils.reject('actiontag ' + joinTableKey + ' id not an integer');
        }
        if (!this.playlistValidationRule.isValid(playlist)) {
            return js_data_1.utils.reject('actiontag ' + joinTableKey + ' playlist not valid');
        }
        if (!this.playlistModelConfig.joins[joinTableKey]) {
            return js_data_1.utils.reject('setGenericPlaylists: ' + joinTableKey + ' - table not valid');
        }
        var playlistKeys = string_utils_1.StringUtils.uniqueKeywords(playlist);
        var playlistTable = this.playlistModelConfig.table;
        var playlistNameField = this.playlistModelConfig.fieldName;
        var playlistIdField = this.playlistModelConfig.fieldId;
        var joinTable = this.playlistModelConfig.joins[joinTableKey].joinTable;
        var joinBaseIdField = this.playlistModelConfig.joins[joinTableKey].fieldReference;
        var deleteSqlQuery = {
            sql: 'DELETE FROM ' + joinTable + ' ' +
                'WHERE ' + playlistIdField + ' IN' +
                '     (SELECT ' + playlistIdField + ' FROM ' + playlistTable +
                '      WHERE ' + playlistNameField + ' IN (' + sql_utils_1.SqlUtils.mapParametersToPlaceholderString(playlistKeys) + '))' +
                ' AND ' + joinBaseIdField + ' = ' + '?' + '',
            parameters: [].concat(playlistKeys).concat([dbId])
        };
        var insertSqlQuery = {
            sql: 'INSERT INTO ' + joinTable + ' (' + playlistIdField + ', ' + joinBaseIdField + ')' +
                ' SELECT ' + playlistIdField + ' AS ' + playlistIdField + ',' +
                '     ' + '?' + ' AS ' + joinBaseIdField + ' FROM ' + playlistTable +
                '     WHERE ' + playlistNameField + ' IN (' + sql_utils_1.SqlUtils.mapParametersToPlaceholderString(playlistKeys) + ')',
            parameters: [].concat([dbId]).concat(playlistKeys)
        };
        var sqlBuilder = js_data_1.utils.isUndefined(opts.transaction) ? this.knex : opts.transaction;
        var rawDelete = sql_utils_1.SqlUtils.executeRawSqlQueryData(sqlBuilder, deleteSqlQuery);
        var result = new Promise(function (resolve, reject) {
            rawDelete.then(function () {
                if (set) {
                    return sql_utils_1.SqlUtils.executeRawSqlQueryData(sqlBuilder, insertSqlQuery);
                }
                return js_data_1.utils.resolve(true);
            }).then(function () {
                return resolve(true);
            }).catch(function errorPlaylist(reason) {
                console.error('_doActionTag delete/insert ' + joinTable + ' failed:', reason);
                return reject(reason);
            });
        });
        return result;
    };
    return CommonSqlPlaylistAdapter;
}());
exports.CommonSqlPlaylistAdapter = CommonSqlPlaylistAdapter;
//# sourceMappingURL=common-sql-playlist.adapter.js.map