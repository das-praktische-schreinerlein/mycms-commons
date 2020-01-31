"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var js_data_1 = require("js-data");
var objectdetection_model_1 = require("../model/objectdetection-model");
var log_utils_1 = require("../utils/log.utils");
var common_sql_object_detection_model_1 = require("../model/common-sql-object-detection.model");
var sql_utils_1 = require("../..//search-commons/services/sql-utils");
var CommonSqlObjectDetectionProcessingAdapter = /** @class */ (function () {
    function CommonSqlObjectDetectionProcessingAdapter(config, knex, sqlQueryBuilder, objectDetectionModelConfig) {
        this.config = config;
        this.knex = knex;
        this.sqlQueryBuilder = sqlQueryBuilder;
        this.objectDetectionModelConfig = objectDetectionModelConfig;
    }
    CommonSqlObjectDetectionProcessingAdapter.prototype.getObjectDetectionConfiguration = function (input) {
        var arr = input.refId.split('_');
        if (arr.length !== 2) {
            return undefined;
        }
        var table = arr[0].toLowerCase();
        var id = arr[1];
        if (table === undefined || id === undefined) {
            return undefined;
        }
        var config = this.objectDetectionModelConfig.detectionTables[table];
        if (config === undefined) {
            return undefined;
        }
        return __assign({}, config, { id: id });
    };
    CommonSqlObjectDetectionProcessingAdapter.prototype.readMaxIdAlreadyDetectedPerDetector = function (entityType, detectorFilterNames) {
        var _this = this;
        var table = entityType.toLowerCase();
        var config = this.objectDetectionModelConfig.detectionTables[table];
        if (config === undefined) {
            return js_data_1.utils.reject('unknown entityType: ' + log_utils_1.LogUtils.sanitizeLogMsg(entityType));
        }
        var sqlQuery = {
            fields: [config.detectedFieldDetector + ' as detector', 'COALESCE(MAX(' + config.baseFieldId + '), 0) as maxId'],
            from: config.detectedTable,
            where: [config.detectedFieldDetector + ' in ("' + detectorFilterNames.join('", "') + '")'],
            sort: undefined,
            limit: undefined,
            offset: 0,
            tableConfig: undefined,
            groupByFields: [config.detectedFieldDetector],
            having: undefined
        };
        return this.knex.raw(this.transformToSqlDialect(this.sqlQueryBuilder.selectQueryTransformToSql(sqlQuery))).then(function (value) {
            return js_data_1.utils.resolve(_this.sqlQueryBuilder.extractDbResult(value, _this.knex.client['config']['client']));
        }).catch(function (reason) {
            return js_data_1.utils.reject(reason);
        });
    };
    CommonSqlObjectDetectionProcessingAdapter.prototype.readRequestImageDataType = function (entityType, detector, maxIdAlreadyDetected, maxPerRun) {
        var _this = this;
        var table = entityType.toLowerCase();
        var config = this.objectDetectionModelConfig.detectionTables[table];
        if (config === undefined) {
            return js_data_1.utils.reject('unknown entityType: ' + log_utils_1.LogUtils.sanitizeLogMsg(entityType));
        }
        var sqlQuery = {
            fields: ['CONCAT("' + table.toUpperCase() + '", "_", ' + config.baseFieldId + ') AS id',
                config.baseFieldId,
                config.baseFieldFilePath + ' AS filePath',
                config.baseFieldFileDir + ' as fileDir',
                config.baseFieldFileName + ' as fileName',
                '"' + this.sqlQueryBuilder.sanitizeSqlFilterValue(detector) + '" as detector'],
            from: config.baseTable,
            where: [config.baseFieldId + ' > ' + maxIdAlreadyDetected +
                    ' OR ' + config.baseFieldId + ' IN (SELECT ' + config.baseFieldId +
                    '        FROM ' + config.detectedTable + ' WHERE ' + config.detectedFieldState + ' in ("' + objectdetection_model_1.ObjectDetectionState.RETRY + '"))'],
            sort: [config.baseFieldId + ' ASC'],
            limit: maxPerRun,
            offset: 0,
            tableConfig: undefined,
            groupByFields: undefined,
            having: undefined
        };
        return this.knex.raw(this.transformToSqlDialect(this.sqlQueryBuilder.selectQueryTransformToSql(sqlQuery))).then(function (value) {
            return js_data_1.utils.resolve(_this.sqlQueryBuilder.extractDbResult(value, _this.knex.client['config']['client']));
        }).catch(function (reason) {
            return js_data_1.utils.reject(reason);
        });
    };
    CommonSqlObjectDetectionProcessingAdapter.prototype.deleteOldDetectionRequests = function (detectionRequest, onlyNotSucceeded) {
        var _this = this;
        var tableConfig = this.getObjectDetectionConfiguration(detectionRequest);
        if (!tableConfig) {
            return js_data_1.utils.reject('detectionRequest table not valid: ' + log_utils_1.LogUtils.sanitizeLogMsg(detectionRequest.refId));
        }
        var detectorFilterValues = detectionRequest.detectors.map(function (detector) {
            return _this.sqlQueryBuilder.sanitizeSqlFilterValue(detector);
        });
        var onlyNotSucceededStates = [objectdetection_model_1.ObjectDetectionState.ERROR, objectdetection_model_1.ObjectDetectionState.OPEN, objectdetection_model_1.ObjectDetectionState.RETRY,
            objectdetection_model_1.ObjectDetectionState.UNKNOWN];
        var deleteSqlQuery = {
            sql: 'DELETE FROM ' + tableConfig.detectedTable + ' ' +
                'WHERE ' + tableConfig.detectedTable + '.' + tableConfig.detectedFieldDetector +
                ' IN (' + sql_utils_1.SqlUtils.mapParametersToPlaceholderString(detectorFilterValues) + ') ' +
                ' AND ' + tableConfig.baseFieldId + ' = ' + '?' + '' +
                (onlyNotSucceeded
                    ? ' AND ' + tableConfig.detectedFieldState +
                        ' IN (' + sql_utils_1.SqlUtils.mapParametersToPlaceholderString(onlyNotSucceededStates) + ')'
                    : ''),
            parameters: [].concat(detectorFilterValues).concat([tableConfig.id]
                .concat(onlyNotSucceeded ? onlyNotSucceededStates : []))
        };
        deleteSqlQuery.sql = this.transformToSqlDialect(deleteSqlQuery.sql);
        return sql_utils_1.SqlUtils.executeRawSqlQueryData(this.knex, deleteSqlQuery);
    };
    CommonSqlObjectDetectionProcessingAdapter.prototype.createDetectionRequest = function (detectionRequest, detector) {
        var _this = this;
        var tableConfig = this.getObjectDetectionConfiguration(detectionRequest);
        if (!tableConfig) {
            return js_data_1.utils.reject('detectionRequest table not valid: ' + log_utils_1.LogUtils.sanitizeLogMsg(detectionRequest.refId));
        }
        var insertSqlQuery = {
            sql: 'INSERT INTO ' + tableConfig.detectedTable +
                ' (' + tableConfig.baseFieldId + ', ' + tableConfig.detectedFieldState + ', ' + tableConfig.detectedFieldDetector + ')' +
                ' VALUES (' + '?' + ',' +
                ' ' + '?' + ',' +
                ' ' + '?' + ')',
            parameters: [tableConfig.id, this.sqlQueryBuilder.sanitizeSqlFilterValue(detectionRequest.state), detector]
        };
        insertSqlQuery.sql = this.transformToSqlDialect(insertSqlQuery.sql);
        return new Promise(function (resolve, reject) {
            sql_utils_1.SqlUtils.executeRawSqlQueryData(_this.knex, insertSqlQuery).then(function () {
                return resolve(true);
            }).catch(function errorFunction(reason) {
                console.error('detectionRequest delete/insert ' + tableConfig.detectedTable + ' failed:', reason);
                return reject(reason);
            });
        });
    };
    CommonSqlObjectDetectionProcessingAdapter.prototype.createDetectionError = function (detectionResponse, detector) {
        var _this = this;
        var tableConfig = this.getObjectDetectionConfiguration(detectionResponse.request);
        if (!tableConfig) {
            return js_data_1.utils.reject('detectionError table not valid: ' + log_utils_1.LogUtils.sanitizeLogMsg(detectionResponse.request.refId));
        }
        var newState = detectionResponse.responseCode === undefined
            || detectionResponse.responseCode === objectdetection_model_1.ObjectDetectionResponseCode.NONRECOVERABLE_ERROR
            ? objectdetection_model_1.ObjectDetectionState.ERROR
            : objectdetection_model_1.ObjectDetectionState.RETRY;
        var insertSqlQuery = {
            sql: 'INSERT INTO ' + tableConfig.detectedTable +
                ' (' + tableConfig.baseFieldId + ', ' + tableConfig.detectedFieldState + ', ' + tableConfig.detectedFieldDetector + ')' +
                ' VALUES (' + '?' + ',' +
                ' ' + '?' + ',' +
                ' ' + '?' + ')',
            parameters: [tableConfig.id, this.sqlQueryBuilder.sanitizeSqlFilterValue(newState), detector]
        };
        insertSqlQuery.sql = this.transformToSqlDialect(insertSqlQuery.sql);
        return new Promise(function (resolve, reject) {
            sql_utils_1.SqlUtils.executeRawSqlQueryData(_this.knex, insertSqlQuery).then(function () {
                return resolve(true);
            }).catch(function errorFunction(reason) {
                console.error('detectionError delete/insert ' + tableConfig.detectedTable + ' failed:', reason);
                return reject(reason);
            });
        });
    };
    CommonSqlObjectDetectionProcessingAdapter.prototype.createDefaultObject = function () {
        var _this = this;
        var insertObjectSqlQuery = {
            sql: 'INSERT INTO ' + this.objectDetectionModelConfig.objectTable.table +
                ' (' + [this.objectDetectionModelConfig.objectTable.fieldName,
                this.objectDetectionModelConfig.objectTable.fieldPicasaKey,
                this.objectDetectionModelConfig.objectTable.fieldKey,
                this.objectDetectionModelConfig.objectTable.fieldCategory].join(',') + ')' +
                ' SELECT ?, ?, ?, ? FROM dual ' +
                '  WHERE NOT EXISTS (SELECT 1 FROM ' + this.objectDetectionModelConfig.objectTable.table +
                '        WHERE ' + this.objectDetectionModelConfig.objectTable.fieldKey + '=?)',
            parameters: [common_sql_object_detection_model_1.OBJECTDETECTION_NAME_DEFAULT, common_sql_object_detection_model_1.OBJECTDETECTION_KEY_DEFAULT, common_sql_object_detection_model_1.OBJECTDETECTION_KEY_DEFAULT,
                common_sql_object_detection_model_1.OBJECTDETECTION_NAME_DEFAULT, common_sql_object_detection_model_1.OBJECTDETECTION_KEY_DEFAULT]
        };
        insertObjectSqlQuery.sql = this.transformToSqlDialect(insertObjectSqlQuery.sql);
        return new Promise(function (resolve, reject) {
            sql_utils_1.SqlUtils.executeRawSqlQueryData(_this.knex, insertObjectSqlQuery).then(function () {
                return resolve(true);
            }).catch(function errorFunction(reason) {
                console.error('detectionRequest insert default-object failed:', reason);
                return reject(reason);
            });
        });
    };
    CommonSqlObjectDetectionProcessingAdapter.prototype.processDetectionWithResult = function (detector, detectionResult, tableConfig) {
        var _this = this;
        var keySuggestion = this.sqlQueryBuilder.sanitizeSqlFilterValue(detectionResult.keySuggestion.split(',')[0]
            .trim()
            .replace(/[^a-zA-Z0-9]/g, '_'));
        var detailValues = [keySuggestion, detectionResult.imgWidth, detectionResult.imgHeight,
            detectionResult.objX, detectionResult.objY, detectionResult.objWidth, detectionResult.objHeight,
            detectionResult.precision]
            .map(function (value) {
            return _this.sqlQueryBuilder.sanitizeSqlFilterValue(value);
        });
        var insertObjectKeySqlQuery = {
            sql: 'INSERT INTO ' + this.objectDetectionModelConfig.objectKeyTable.table +
                '   (' + [this.objectDetectionModelConfig.objectKeyTable.fieldDetector,
                this.objectDetectionModelConfig.objectKeyTable.fieldKey,
                this.objectDetectionModelConfig.objectKeyTable.fieldId].join(',') + ') ' +
                '   SELECT ' + '?' + ',' +
                '          ' + '?' + ',' +
                '          (SELECT MAX(' + this.objectDetectionModelConfig.objectTable.fieldId + ') AS newId ' +
                '           FROM ' + this.objectDetectionModelConfig.objectTable.table +
                '           WHERE ' + this.objectDetectionModelConfig.objectTable.fieldKey + '=? ' +
                '                 OR ' + this.objectDetectionModelConfig.objectTable.fieldKey + '=' + '?' + ')' +
                '   AS newId FROM dual ' +
                '   WHERE NOT EXISTS (' +
                '      SELECT 1 FROM ' + this.objectDetectionModelConfig.objectKeyTable.table +
                '      WHERE ' + this.objectDetectionModelConfig.objectKeyTable.fieldDetector + '=' + '?' + ' ' +
                '      AND ' + this.objectDetectionModelConfig.objectKeyTable.fieldKey + '=' + '?' + ')',
            parameters: [detector, keySuggestion, common_sql_object_detection_model_1.OBJECTDETECTION_KEY_DEFAULT, keySuggestion, detector, keySuggestion]
        };
        var insertImageObjectQuery = {
            sql: 'INSERT INTO ' + tableConfig.detectedTable + ' (' +
                tableConfig.baseFieldId + ', ' + tableConfig.detectedFieldState + ', ' +
                tableConfig.detectedFieldDetector + ', ' + tableConfig.detailFieldNames.join(', ') + ')' +
                ' VALUES (' + '?' + ',' +
                ' ' + '?' + ',' +
                ' ' + '?' + ', ' + sql_utils_1.SqlUtils.mapParametersToPlaceholderString(detailValues) + ')',
            parameters: [tableConfig.id, this.sqlQueryBuilder.sanitizeSqlFilterValue(detectionResult.state), detector]
                .concat(detailValues)
        };
        insertObjectKeySqlQuery.sql = this.transformToSqlDialect(insertObjectKeySqlQuery.sql);
        insertImageObjectQuery.sql = this.transformToSqlDialect(insertImageObjectQuery.sql);
        return new Promise(function (resolve, reject) {
            sql_utils_1.SqlUtils.executeRawSqlQueryData(_this.knex, insertObjectKeySqlQuery).then(function () {
                return sql_utils_1.SqlUtils.executeRawSqlQueryData(_this.knex, insertImageObjectQuery);
            }).then(function () {
                return resolve(true);
            }).catch(function errorFunction(reason) {
                console.error('detectionRequest delete/insert ' + tableConfig.detectedTable + ' failed:', reason);
                return reject(reason);
            });
        });
    };
    CommonSqlObjectDetectionProcessingAdapter.prototype.processDetectionWithoutResult = function (detector, tableConfig) {
        var _this = this;
        var deleteDummySqlQuery = {
            sql: 'DELETE FROM ' + tableConfig.detectedTable + ' ' +
                'WHERE ' + tableConfig.detectedTable + '.' + tableConfig.detectedFieldDetector +
                ' IN (' + '?' + ') ' +
                ' AND ' + tableConfig.detectedFieldState + ' = ' + '?' + '',
            parameters: [detector, objectdetection_model_1.ObjectDetectionState.RUNNING_NO_SUGGESTION]
        };
        var insertImageObjectQuery = {
            sql: 'INSERT INTO ' + tableConfig.detectedTable + ' (' +
                tableConfig.baseFieldId + ', ' + tableConfig.detectedFieldState + ', ' + tableConfig.detectedFieldDetector + ')' +
                ' VALUES (' + '?' + ',' +
                ' ' + '?' + ',' +
                ' ' + '?' + ')',
            parameters: [tableConfig.id, objectdetection_model_1.ObjectDetectionState.RUNNING_NO_SUGGESTION, detector]
        };
        deleteDummySqlQuery.sql = this.transformToSqlDialect(deleteDummySqlQuery.sql);
        insertImageObjectQuery.sql = this.transformToSqlDialect(insertImageObjectQuery.sql);
        return sql_utils_1.SqlUtils.executeRawSqlQueryData(this.knex, deleteDummySqlQuery).then(function () {
            return sql_utils_1.SqlUtils.executeRawSqlQueryData(_this.knex, insertImageObjectQuery);
        });
    };
    CommonSqlObjectDetectionProcessingAdapter.prototype.transformToSqlDialect = function (sql) {
        var client = this.knex.client['config']['client'];
        if (client === 'sqlite3') {
            sql = sql.replace(/ FROM dual /g, ' ');
        }
        return this.sqlQueryBuilder.transformToSqlDialect(sql, client);
    };
    return CommonSqlObjectDetectionProcessingAdapter;
}());
exports.CommonSqlObjectDetectionProcessingAdapter = CommonSqlObjectDetectionProcessingAdapter;
//# sourceMappingURL=common-sql-object-detection-processing.adapter.js.map