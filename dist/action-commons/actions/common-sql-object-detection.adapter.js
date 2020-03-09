"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var js_data_1 = require("js-data");
var objectdetection_model_1 = require("../../commons/model/objectdetection-model");
var log_utils_1 = require("../../commons/utils/log.utils");
var string_utils_1 = require("../../commons/utils/string.utils");
var generic_validator_util_1 = require("../../search-commons/model/forms/generic-validator.util");
var sql_utils_1 = require("../../search-commons/services/sql-utils");
var CommonSqlObjectDetectionAdapter = /** @class */ (function () {
    function CommonSqlObjectDetectionAdapter(config, knex, sqlQueryBuilder, objectDetectionModelConfig) {
        this.keywordValidationRule = new generic_validator_util_1.KeywordValidationRule(true);
        this.precisionValidationRule = new generic_validator_util_1.NumberValidationRule(true, 0, 1, 1);
        this.config = config;
        this.knex = knex;
        this.sqlQueryBuilder = sqlQueryBuilder;
        this.objectDetectionModelConfig = objectDetectionModelConfig;
    }
    CommonSqlObjectDetectionAdapter.prototype.transformToSqlDialect = function (sql) {
        var client = this.knex.client['config']['client'];
        if (client === 'sqlite3') {
            sql = sql.replace(/ FROM dual /g, ' ');
        }
        return this.sqlQueryBuilder.transformToSqlDialect(sql, client);
    };
    CommonSqlObjectDetectionAdapter.prototype.setObjects = function (table, id, objectKey, precision, detector, set, opts) {
        var objectKeys = string_utils_1.StringUtils.uniqueKeywords(objectKey);
        var config = this.objectDetectionModelConfig.detectionTables[table];
        if (config === undefined) {
            return js_data_1.utils.reject('unknown table: ' + log_utils_1.LogUtils.sanitizeLogMsg(table));
        }
        opts = opts || {};
        if (!js_data_1.utils.isInteger(id)) {
            return js_data_1.utils.reject('actiontag ObjectsKey ' + table + ' id not an integer');
        }
        if (!this.keywordValidationRule.isValid(objectKey)) {
            return js_data_1.utils.reject('actiontag ObjectsKey ' + table + ' objectkey not valid');
        }
        if (!this.keywordValidationRule.isValid(detector)) {
            return js_data_1.utils.reject('actiontag ObjectsKey ' + table + ' detector not valid');
        }
        if (!this.precisionValidationRule.isValid(precision)) {
            return js_data_1.utils.reject('actiontag ObjectsKey ' + table + ' precision not valid');
        }
        var deleteSqlQuery = {
            sql: 'DELETE FROM ' + config.detectedTable + ' ' +
                ' WHERE ' + config.detectedTable + '.' + config.detectedFieldKey + ' IN (' +
                '    SELECT ' + this.objectDetectionModelConfig.objectTable.fieldKey +
                '    FROM ' + this.objectDetectionModelConfig.objectTable.table +
                '    WHERE ' + this.objectDetectionModelConfig.objectTable.fieldName + ' IN (' +
                sql_utils_1.SqlUtils.mapParametersToPlaceholderString(objectKeys) + '))' +
                ' AND ' + config.baseFieldId + ' = ' + '?' + '',
            parameters: [].concat(objectKeys).concat([id])
        };
        var insertSqlQuery = {
            sql: 'INSERT INTO ' + config.detectedTable + ' (' +
                [config.detectedFieldKey, config.baseFieldId, config.detectedFieldPrecision, config.detectedFieldDetector,
                    config.detectedFieldState].join(', ') + ')' +
                ' SELECT objects.o_key AS ' + config.detectedFieldKey + ',' +
                ' ' + '?' + ' AS ' + config.baseFieldId + ',' +
                ' ' + '?' + ' AS ' + config.detectedFieldPrecision + ',' +
                ' ' + '?' + ' AS ' + config.detectedFieldDetector + ',' +
                ' ' + '?' + ' AS ' + config.detectedFieldState +
                ' FROM objects WHERE o_name = (' + sql_utils_1.SqlUtils.mapParametersToPlaceholderString(objectKeys) + ')',
            parameters: [id, precision, detector, objectdetection_model_1.ObjectDetectionState.DONE_APPROVAL_PROCESSED].concat(objectKeys)
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
                console.error('_doActionTag delete/insert ObjectsKey ' + table + ' failed:', reason);
                return reject(reason);
            });
        });
        return result;
    };
    CommonSqlObjectDetectionAdapter.prototype.setObjectsState = function (table, id, state, opts) {
        var config = this.objectDetectionModelConfig.detectedObjectsTables[table];
        if (config === undefined) {
            return js_data_1.utils.reject('unknown table: ' + log_utils_1.LogUtils.sanitizeLogMsg(table));
        }
        opts = opts || {};
        if (!js_data_1.utils.isInteger(id)) {
            return js_data_1.utils.reject('actiontag ObjectsState ' + table + ' id not an integer');
        }
        if (!this.keywordValidationRule.isValid(state)) {
            return js_data_1.utils.reject('actiontag ObjectsState ' + table + ' state not valid');
        }
        var updateSqlQuery = {
            sql: 'UPDATE ' + config.table + ' SET ' + config.fieldState + '=' + '?' + '' +
                '  WHERE ' + config.fieldId + ' = ' + '?' + '',
            parameters: [state, id]
        };
        updateSqlQuery.sql = this.sqlQueryBuilder.transformToSqlDialect(updateSqlQuery.sql, this.config.knexOpts.client);
        var sqlBuilder = js_data_1.utils.isUndefined(opts.transaction) ? this.knex : opts.transaction;
        var rawUpdate = sql_utils_1.SqlUtils.executeRawSqlQueryData(sqlBuilder, updateSqlQuery);
        var result = new Promise(function (resolve, reject) {
            rawUpdate.then(function () {
                return resolve(true);
            }).catch(function errorPlaylist(reason) {
                console.error('_doActionTag update ObjectsState ' + table + ' failed:', reason);
                return reject(reason);
            });
        });
        return result;
    };
    CommonSqlObjectDetectionAdapter.prototype.updateObjectsKey = function (table, id, detector, objectkey, objectname, objectcategory, action, state, opts) {
        var config = this.objectDetectionModelConfig.detectedObjectsTables[table];
        if (config === undefined) {
            return js_data_1.utils.reject('unknown table: ' + log_utils_1.LogUtils.sanitizeLogMsg(table));
        }
        opts = opts || {};
        if (!js_data_1.utils.isInteger(id)) {
            return js_data_1.utils.reject('actiontag updateObjectsKey ' + table + ' id not an integer');
        }
        if (!this.keywordValidationRule.isValid(detector)) {
            return js_data_1.utils.reject('actiontag updateObjectsKey ' + table + ' detector not valid');
        }
        if (!this.keywordValidationRule.isValid(objectkey)) {
            return js_data_1.utils.reject('actiontag updateObjectsKey ' + table + ' objectkey not valid');
        }
        if (!this.keywordValidationRule.isValid(action)) {
            return js_data_1.utils.reject('actiontag updateObjectsKey ' + table + ' action not valid');
        }
        if (!this.keywordValidationRule.isValid(state)) {
            return js_data_1.utils.reject('actiontag updateObjectsKey ' + table + ' state not valid');
        }
        if (state !== objectdetection_model_1.ObjectDetectionState.RUNNING_MANUAL_CORRECTED && state !== objectdetection_model_1.ObjectDetectionState.RUNNING_MANUAL_DETAILED) {
            return js_data_1.utils.reject('actiontag updateObjectsKey ' + table + ' state not allowed');
        }
        var insertObjectNameSqlQuery;
        var deleteObjectKeySqlQuery;
        var insertObjectKeySqlQuery;
        if (action === 'changeObjectKeyForRecord') {
            // NOOP
        }
        else if (action === 'changeObjectLabelForObjectKey'
            || action === 'createNewObjectKeyAndObjectLabel'
            || action === 'createObjectLabelForObjectKey') {
            if (!this.keywordValidationRule.isValid(objectname)) {
                return js_data_1.utils.reject('actiontag updateObjectsKey ' + table + ' objectname not valid');
            }
            // update object_key (remove+insert)
            deleteObjectKeySqlQuery = {
                sql: 'DELETE FROM ' + this.objectDetectionModelConfig.objectKeyTable.table +
                    ' WHERE ' + this.objectDetectionModelConfig.objectKeyTable.fieldDetector + '=' + '?' + ' ' +
                    ' AND ' + this.objectDetectionModelConfig.objectKeyTable.fieldKey + '=' + '?' + '',
                parameters: [detector, objectkey]
            };
            insertObjectKeySqlQuery = {
                sql: 'INSERT INTO ' + this.objectDetectionModelConfig.objectKeyTable.table +
                    '   (' + [this.objectDetectionModelConfig.objectKeyTable.fieldDetector,
                    this.objectDetectionModelConfig.objectKeyTable.fieldKey,
                    this.objectDetectionModelConfig.objectKeyTable.fieldId].join(', ') + ') ' +
                    '   SELECT ' + '?' + ',' +
                    '          ' + '?' + ',' +
                    '          (SELECT MAX(' + this.objectDetectionModelConfig.objectTable.fieldId + ') AS newId' +
                    '           FROM ' + this.objectDetectionModelConfig.objectTable.table +
                    '           WHERE ' + this.objectDetectionModelConfig.objectTable.fieldName + '=' + '?' + ')' +
                    ' AS newId FROM dual ' +
                    '   WHERE NOT EXISTS (' +
                    '      SELECT 1 FROM ' + this.objectDetectionModelConfig.objectKeyTable.table +
                    '      WHERE ' + this.objectDetectionModelConfig.objectKeyTable.fieldDetector + '=' + '?' + ' ' +
                    '      AND ' + this.objectDetectionModelConfig.objectKeyTable.fieldKey + '=' + '?' + ')',
                parameters: [detector, objectkey, objectname, detector, objectkey]
            };
            // insert object_name if not exists
            if (action === 'createNewObjectKeyAndObjectLabel' || action === 'createObjectLabelForObjectKey') {
                if (!this.keywordValidationRule.isValid(objectcategory)) {
                    return js_data_1.utils.reject('actiontag updateObjectsKey ' + table + ' objectcategory not valid');
                }
                insertObjectNameSqlQuery = {
                    sql: 'INSERT INTO ' + this.objectDetectionModelConfig.objectTable.table +
                        ' (' + [this.objectDetectionModelConfig.objectTable.fieldName,
                        this.objectDetectionModelConfig.objectTable.fieldPicasaKey,
                        this.objectDetectionModelConfig.objectTable.fieldKey,
                        this.objectDetectionModelConfig.objectTable.fieldCategory].join(', ') + ')' +
                        ' SELECT ' + '?' + ', ' + '?' + ', ' + '?' + ', ' + '?' + ' FROM dual ' +
                        '  WHERE NOT EXISTS (SELECT 1 FROM ' + this.objectDetectionModelConfig.objectTable.table +
                        '                    WHERE ' + this.objectDetectionModelConfig.objectTable.fieldName + '=' + '?' + ')',
                    parameters: [objectname, objectkey, objectkey, objectcategory, objectname]
                };
            }
        }
        else {
            return js_data_1.utils.reject('actiontag updateObjectsKey ' + table + ' action unknown');
        }
        var updateImageObjectObjectKeySqlQuery = {
            sql: 'UPDATE ' + config.table +
                '  SET ' + config.fieldKey + '=' + '?' + ', ' + config.fieldState + '=' + '?' + '' +
                '  WHERE ' + config.fieldId + ' = ' + '?' + '',
            parameters: [objectkey, state, id]
        };
        updateImageObjectObjectKeySqlQuery.sql = this.sqlQueryBuilder.transformToSqlDialect(updateImageObjectObjectKeySqlQuery.sql, this.config.knexOpts.client);
        if (insertObjectNameSqlQuery) {
            insertObjectNameSqlQuery.sql = this.sqlQueryBuilder.transformToSqlDialect(insertObjectNameSqlQuery.sql, this.config.knexOpts.client);
        }
        if (deleteObjectKeySqlQuery) {
            deleteObjectKeySqlQuery.sql = this.sqlQueryBuilder.transformToSqlDialect(deleteObjectKeySqlQuery.sql, this.config.knexOpts.client);
        }
        if (insertObjectKeySqlQuery) {
            insertObjectKeySqlQuery.sql = this.sqlQueryBuilder.transformToSqlDialect(insertObjectKeySqlQuery.sql, this.config.knexOpts.client);
        }
        var sqlBuilder = js_data_1.utils.isUndefined(opts.transaction) ? this.knex : opts.transaction;
        return new Promise(function (resolve, reject) {
            sql_utils_1.SqlUtils.executeRawSqlQueryData(sqlBuilder, updateImageObjectObjectKeySqlQuery).then(function () {
                if (insertObjectNameSqlQuery) {
                    return sql_utils_1.SqlUtils.executeRawSqlQueryData(sqlBuilder, insertObjectNameSqlQuery);
                }
                return js_data_1.utils.resolve(true);
            }).then(function () {
                if (deleteObjectKeySqlQuery) {
                    return sql_utils_1.SqlUtils.executeRawSqlQueryData(sqlBuilder, deleteObjectKeySqlQuery);
                }
                return js_data_1.utils.resolve(true);
            }).then(function () {
                if (insertObjectKeySqlQuery) {
                    return sql_utils_1.SqlUtils.executeRawSqlQueryData(sqlBuilder, insertObjectKeySqlQuery);
                }
                return js_data_1.utils.resolve(true);
            }).then(function () {
                return resolve(true);
            }).catch(function errorPlaylist(reason) {
                console.error('_doActionTag update updateObjectsKey ' + table + ' odobjectkey failed:', reason);
                return reject(reason);
            });
        });
    };
    return CommonSqlObjectDetectionAdapter;
}());
exports.CommonSqlObjectDetectionAdapter = CommonSqlObjectDetectionAdapter;
//# sourceMappingURL=common-sql-object-detection.adapter.js.map