"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var js_data_1 = require("js-data");
var generic_validator_util_1 = require("../../search-commons/model/forms/generic-validator.util");
var string_utils_1 = require("../../commons/utils/string.utils");
var sql_utils_1 = require("../../search-commons/services/sql-utils");
var Promise_serial = require("promise-serial");
var CommonSqlPlaylistAdapter = /** @class */ (function () {
    function CommonSqlPlaylistAdapter(config, knex, sqlQueryBuilder, playlistModelConfig) {
        this.playlistValidationRule = new generic_validator_util_1.KeywordValidationRule(true);
        this.numberValidationRule = new generic_validator_util_1.NumberValidationRule(false, 1, 999999999999, undefined);
        this.textValidationRule = new generic_validator_util_1.DescValidationRule(false);
        this.config = config;
        this.knex = knex;
        this.sqlQueryBuilder = sqlQueryBuilder;
        this.playlistModelConfig = playlistModelConfig;
    }
    CommonSqlPlaylistAdapter.prototype.setPlaylists = function (joinTableKey, dbId, playlist, opts, set, position, details) {
        var _this = this;
        if (!js_data_1.utils.isInteger(dbId)) {
            return js_data_1.utils.reject('setPlaylists ' + joinTableKey + ' id not an integer');
        }
        if (!this.playlistValidationRule.isValid(playlist)) {
            return js_data_1.utils.reject('setPlaylists ' + joinTableKey + ' playlist not valid');
        }
        if (!this.playlistModelConfig.joins[joinTableKey]) {
            return js_data_1.utils.reject('setPlaylists: ' + joinTableKey + ' - table not valid');
        }
        if (!this.numberValidationRule.isValid(position)) {
            return js_data_1.utils.reject('setPlaylists ' + joinTableKey + ' position not valid');
        }
        if (!this.textValidationRule.isValid(details)) {
            return js_data_1.utils.reject('setPlaylists ' + joinTableKey + ' details not valid');
        }
        var me = this;
        var playlistKeys = string_utils_1.StringUtils.uniqueKeywords(playlist);
        var playlistTable = this.playlistModelConfig.table;
        var playlistNameField = this.playlistModelConfig.fieldName;
        var playlistIdField = this.playlistModelConfig.fieldId;
        var joinTable = this.playlistModelConfig.joins[joinTableKey].joinTable;
        var joinBaseIdField = this.playlistModelConfig.joins[joinTableKey].fieldReference;
        var positionField = this.playlistModelConfig.joins[joinTableKey].positionField;
        var sqlBuilder = js_data_1.utils.isUndefined(opts.transaction)
            ? this.knex
            : opts.transaction;
        if (positionField === undefined) {
            var deleteMultiPlaylistsSqlQuery = {
                sql: 'DELETE FROM ' + joinTable + ' ' +
                    'WHERE ' + playlistIdField + ' IN' +
                    '     (SELECT ' + playlistIdField + ' FROM ' + playlistTable +
                    '      WHERE ' + playlistNameField + ' IN (' + sql_utils_1.SqlUtils.mapParametersToPlaceholderString(playlistKeys) + '))' +
                    ' AND ' + joinBaseIdField + ' = ' + '?' + '',
                parameters: [].concat(playlistKeys).concat([dbId])
            };
            var insertMultiPlaylistsSqlQuery_1 = {
                sql: 'INSERT INTO ' + joinTable + ' (' + playlistIdField + ', ' + joinBaseIdField + ')' +
                    ' SELECT ' + playlistIdField + ' AS ' + playlistIdField + ',' +
                    '     ' + '?' + ' AS ' + joinBaseIdField + ' FROM ' + playlistTable +
                    '     WHERE ' + playlistNameField + ' IN (' + sql_utils_1.SqlUtils.mapParametersToPlaceholderString(playlistKeys) + ')',
                parameters: [].concat([dbId]).concat(playlistKeys)
            };
            return sql_utils_1.SqlUtils.executeRawSqlQueryData(sqlBuilder, deleteMultiPlaylistsSqlQuery).then(function () {
                if (set) {
                    return sql_utils_1.SqlUtils.executeRawSqlQueryData(sqlBuilder, insertMultiPlaylistsSqlQuery_1);
                }
                return js_data_1.utils.resolve(true);
            }).then(function () {
                return js_data_1.utils.resolve(true);
            }).catch(function errorPlaylist(reason) {
                console.error('_doActionTag delete/insert ' + joinTable + ' failed:', reason);
                return js_data_1.utils.reject(reason);
            });
        }
        var selectOldPlaylistJoinSqlQuery = {
            sql: 'SELECT * FROM ' + joinTable + ' INNER JOIN ' + playlistTable +
                ' ON ' + playlistTable + '.' + playlistIdField + ' = ' + joinTable + '.' + playlistIdField +
                ' WHERE ' + joinTable + '.' + playlistIdField + ' IN' +
                '     (SELECT ' + playlistIdField + ' FROM ' + playlistTable +
                '      WHERE ' + playlistNameField + ' IN (' + sql_utils_1.SqlUtils.mapParametersToPlaceholderString(playlistKeys) + '))' +
                ' AND ' + joinBaseIdField + ' = ' + '?' + '',
            parameters: [].concat(playlistKeys).concat([dbId])
        };
        return sql_utils_1.SqlUtils.executeRawSqlQueryData(sqlBuilder, selectOldPlaylistJoinSqlQuery).then(function (dbresults) {
            var oldPlaylistJoins = _this.sqlQueryBuilder.extractDbResult(dbresults, _this.knex.client['config']['client']);
            var oldPlaylistJoinsByPlaylistKey = {};
            if (oldPlaylistJoins !== undefined && oldPlaylistJoins.length >= 1) {
                oldPlaylistJoins.forEach(function (record) {
                    oldPlaylistJoinsByPlaylistKey[record[playlistNameField]] = record;
                });
            }
            var promises = [];
            var _loop_1 = function (playlistKey) {
                var oldRecord = oldPlaylistJoinsByPlaylistKey[playlistKey];
                promises.push(function () {
                    return me.setPlaylist(joinTableKey, dbId, playlistKey, opts, set, position, details, oldRecord);
                });
            };
            for (var _i = 0, playlistKeys_1 = playlistKeys; _i < playlistKeys_1.length; _i++) {
                var playlistKey = playlistKeys_1[_i];
                _loop_1(playlistKey);
            }
            return Promise_serial(promises, { parallelize: 1 });
        }).then(function () {
            return js_data_1.utils.resolve(true);
        }).catch(function errorPlaylist(reason) {
            console.error('setPlaylists ' + joinTable + ' failed:', reason);
            return js_data_1.utils.reject(reason);
        });
    };
    CommonSqlPlaylistAdapter.prototype.setPlaylist = function (joinTableKey, dbId, playlistKey, opts, set, position, details, oldRecord) {
        var _this = this;
        if (!js_data_1.utils.isInteger(dbId)) {
            return js_data_1.utils.reject('setPlaylist ' + joinTableKey + ' id not an integer');
        }
        if (!this.playlistValidationRule.isValid(playlistKey)) {
            return js_data_1.utils.reject('setPlaylist ' + joinTableKey + ' playlist not valid');
        }
        if (!this.playlistModelConfig.joins[joinTableKey]) {
            return js_data_1.utils.reject('setPlaylist: ' + joinTableKey + ' - table not valid');
        }
        if (!this.numberValidationRule.isValid(position)) {
            return js_data_1.utils.reject('setPlaylist ' + joinTableKey + ' position not valid');
        }
        var playlistTable = this.playlistModelConfig.table;
        var playlistNameField = this.playlistModelConfig.fieldName;
        var playlistIdField = this.playlistModelConfig.fieldId;
        var joinTable = this.playlistModelConfig.joins[joinTableKey].joinTable;
        var joinBaseIdField = this.playlistModelConfig.joins[joinTableKey].fieldReference;
        var positionField = this.playlistModelConfig.joins[joinTableKey].positionField;
        var detailsField = this.playlistModelConfig.joins[joinTableKey].detailsField;
        var sqlBuilder = js_data_1.utils.isUndefined(opts.transaction)
            ? this.knex
            : opts.transaction;
        var promises = [];
        var deleteSinglePlaylistSqlQuery = {
            sql: 'DELETE FROM ' + joinTable + ' ' +
                'WHERE ' + playlistIdField + ' IN' +
                '     (SELECT ' + playlistIdField + ' FROM ' + playlistTable +
                '      WHERE ' + playlistNameField + ' IN (?))' +
                ' AND ' + joinBaseIdField + ' = ' + '?' + '',
            parameters: [].concat([playlistKey]).concat([dbId])
        };
        promises.push(function () {
            return sql_utils_1.SqlUtils.executeRawSqlQueryData(sqlBuilder, deleteSinglePlaylistSqlQuery);
        });
        if (oldRecord !== undefined) {
            var oldValue = oldRecord[positionField];
            if (oldValue !== undefined && oldValue !== null && oldValue !== 'null') {
                if (this.playlistModelConfig.commonChangeSuccessorPosSqls !== undefined) {
                    var _loop_2 = function (sql) {
                        var updateOldPlaylistSuccessorsSqlQuery = {
                            sql: sql,
                            parameters: [].concat([-1]).concat([playlistKey]).concat([oldValue])
                        };
                        promises.push(function () {
                            return sql_utils_1.SqlUtils.executeRawSqlQueryData(sqlBuilder, updateOldPlaylistSuccessorsSqlQuery);
                        });
                    };
                    for (var _i = 0, _a = this.playlistModelConfig.commonChangeSuccessorPosSqls; _i < _a.length; _i++) {
                        var sql = _a[_i];
                        _loop_2(sql);
                    }
                }
                else {
                    var updateOldPlaylistSuccessorsSqlQuery_1 = {
                        sql: 'UPDATE ' + joinTable + ' SET ' + positionField + ' = ' + positionField + ' - 1 ' +
                            'WHERE ' + playlistIdField + ' IN' +
                            '     (SELECT ' + playlistIdField + ' FROM ' + playlistTable +
                            '      WHERE ' + playlistNameField + ' IN (?))' +
                            ' AND ' + positionField + ' >= ' + '?' + '',
                        parameters: [].concat([playlistKey]).concat([oldValue])
                    };
                    promises.push(function () {
                        return sql_utils_1.SqlUtils.executeRawSqlQueryData(sqlBuilder, updateOldPlaylistSuccessorsSqlQuery_1);
                    });
                }
            }
        }
        if (position !== undefined) {
            if (this.playlistModelConfig.commonChangeSuccessorPosSqls !== undefined) {
                var _loop_3 = function (sql) {
                    var updateOldPlaylistSuccessorsSqlQuery = {
                        sql: sql,
                        parameters: [].concat([+1]).concat([playlistKey]).concat([position])
                    };
                    promises.push(function () {
                        return sql_utils_1.SqlUtils.executeRawSqlQueryData(sqlBuilder, updateOldPlaylistSuccessorsSqlQuery);
                    });
                };
                for (var _b = 0, _c = this.playlistModelConfig.commonChangeSuccessorPosSqls; _b < _c.length; _b++) {
                    var sql = _c[_b];
                    _loop_3(sql);
                }
            }
            else {
                var updateNewPlaylistSuccessorsSqlQuery_1 = {
                    sql: 'UPDATE ' + joinTable + ' SET ' + positionField + ' = ' + positionField + ' + 1 ' +
                        'WHERE ' + playlistIdField + ' IN' +
                        '     (SELECT ' + playlistIdField + ' FROM ' + playlistTable +
                        '      WHERE ' + playlistNameField + ' IN (?))' +
                        ' AND ' + positionField + ' >= ' + '?' + '',
                    parameters: [].concat([playlistKey]).concat([position])
                };
                promises.push(function () {
                    return sql_utils_1.SqlUtils.executeRawSqlQueryData(sqlBuilder, updateNewPlaylistSuccessorsSqlQuery_1);
                });
            }
        }
        return Promise_serial(promises, { parallelize: 1 }).then(function (value) {
            if (!set) {
                return js_data_1.utils.resolve(value);
            }
            var sql = 'INSERT INTO ' + joinTable + ' (' + playlistIdField + ', ' +
                (detailsField && details ? detailsField + ', ' : '') +
                positionField + ', ' + joinBaseIdField + ')' +
                ' SELECT ' + playlistIdField + ' AS ' + playlistIdField + ',' +
                (detailsField && details ? '     ' + '?' + ' AS ' + detailsField + ',' : '') +
                '     ' + '?' + ' AS ' + positionField + ',' +
                '     ' + '?' + ' AS ' + joinBaseIdField + ' FROM ' + playlistTable +
                '     WHERE ' + playlistNameField + ' IN (?)';
            var params = detailsField && details
                ? [details]
                : [];
            if (position !== undefined) {
                var insertSinglePlaylistSqlQuery = {
                    sql: sql,
                    parameters: [].concat(params).concat([position]).concat([dbId]).concat([playlistKey])
                };
                return sql_utils_1.SqlUtils.executeRawSqlQueryData(sqlBuilder, insertSinglePlaylistSqlQuery);
            }
            var selectMaxPlaylistPositionSql = _this.playlistModelConfig.commonSelectMaxPositionSql
                ? _this.playlistModelConfig.commonSelectMaxPositionSql
                : 'SELECT max(' + positionField + ') AS maxPos FROM ' + joinTable + ' WHERE ' + playlistIdField + ' IN' +
                    '     (SELECT ' + playlistIdField + ' FROM ' + playlistTable +
                    '      WHERE ' + playlistNameField + ' IN (?))';
            var selectMaxPlaylistPositionSqlQuery = {
                sql: selectMaxPlaylistPositionSql,
                parameters: [].concat([playlistKey])
            };
            return sql_utils_1.SqlUtils.executeRawSqlQueryData(sqlBuilder, selectMaxPlaylistPositionSqlQuery).then(function (dbresults) {
                var maxResultRecords = _this.sqlQueryBuilder.extractDbResult(dbresults, _this.knex.client['config']['client']);
                var maxPos = 0;
                if (maxResultRecords !== undefined && maxResultRecords.length === 1 && maxResultRecords[0]['maxPos']) {
                    maxPos = maxResultRecords[0]['maxPos'] + 0;
                }
                maxPos = maxPos + 1;
                var insertSinglePlaylistSqlQuery = {
                    sql: sql,
                    parameters: [].concat([maxPos]).concat([dbId]).concat([playlistKey])
                };
                return sql_utils_1.SqlUtils.executeRawSqlQueryData(sqlBuilder, insertSinglePlaylistSqlQuery);
            });
        });
    };
    return CommonSqlPlaylistAdapter;
}());
exports.CommonSqlPlaylistAdapter = CommonSqlPlaylistAdapter;
//# sourceMappingURL=common-sql-playlist.adapter.js.map