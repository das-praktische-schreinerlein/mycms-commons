"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var geogpx_parser_1 = require("../services/geogpx.parser");
var geodate_utils_1 = require("../services/geodate.utils");
var file_utils_1 = require("../../commons/utils/file.utils");
var fs = require("fs");
var geoElementTypes_1 = require("../model/geoElementTypes");
var sql_utils_1 = require("../../search-commons/services/sql-utils");
var sql_query_builder_1 = require("../../search-commons/services/sql-query.builder");
var Promise_serial = require("promise-serial");
var string_utils_1 = require("../../commons/utils/string.utils");
var hierarchy_utils_1 = require("../../commons/utils/hierarchy.utils");
var BackendGeoServiceConfigType = /** @class */ (function () {
    function BackendGeoServiceConfigType() {
    }
    return BackendGeoServiceConfigType;
}());
exports.BackendGeoServiceConfigType = BackendGeoServiceConfigType;
var BackendGeoService = /** @class */ (function () {
    function BackendGeoService(backendConfig, knex, gpxParser, txtParser, jsonParser, gpxUtils, geoEntityDbMapping) {
        this.backendConfig = backendConfig;
        this.knex = knex;
        this.gpxParser = gpxParser;
        this.txtParser = txtParser;
        this.jsonParser = jsonParser;
        this.gpxUtils = gpxUtils;
        this.geoEntityDbMapping = geoEntityDbMapping;
        this.sqlQueryBuilder = new sql_query_builder_1.SqlQueryBuilder();
    }
    BackendGeoService.mapDBResultOnGeoEntity = function (dbResult, records) {
        for (var i = 0; i <= dbResult.length; i++) {
            if (dbResult[i] !== undefined) {
                var entry = {
                    gpsTrackBasefile: undefined,
                    gpsTrackSrc: undefined,
                    gpsTrackTxt: undefined,
                    id: undefined,
                    locHirarchie: undefined,
                    name: undefined,
                    type: undefined
                };
                for (var key in dbResult[i]) {
                    if (dbResult[i].hasOwnProperty(key)) {
                        entry[key] = dbResult[i][key];
                    }
                }
                records.push(entry);
            }
        }
    };
    BackendGeoService.prototype.readGeoEntityForId = function (entityType, id) {
        var _this = this;
        var geoEntityDbMapping = this.geoEntityDbMapping.tables[entityType];
        if (!geoEntityDbMapping) {
            return Promise.reject('no valid entityType:' + entityType);
        }
        var readSqlQuery = {
            sql: this.generateBaseSqlForTable(geoEntityDbMapping) +
                '  WHERE ' + geoEntityDbMapping.fields.id + ' = ?',
            parameters: [id]
        };
        // console.debug('call readGeoEntityForId sql', readSqlQuery);
        return sql_utils_1.SqlUtils.executeRawSqlQueryData(this.knex, readSqlQuery).then(function (dbResults) {
            var records = [];
            BackendGeoService.mapDBResultOnGeoEntity(_this.sqlQueryBuilder.extractDbResult(dbResults, _this.knex.client['config']['client']), records);
            if (records.length === 1) {
                return Promise.resolve(records[0]);
            }
            return Promise.resolve(undefined);
        }).catch(function (reason) {
            return Promise.reject(reason);
        });
    };
    BackendGeoService.prototype.updateGeoEntity = function (entity, fieldsToUpdate) {
        var geoEntityDbMapping = this.geoEntityDbMapping.tables[entity.type]
            || this.geoEntityDbMapping.tables[entity.type.toLowerCase()];
        if (!geoEntityDbMapping) {
            return Promise.reject('no valid entityType:' + entity.type);
        }
        var dbFields = [];
        var dbValues = [];
        for (var _i = 0, fieldsToUpdate_1 = fieldsToUpdate; _i < fieldsToUpdate_1.length; _i++) {
            var field = fieldsToUpdate_1[_i];
            if (!geoEntityDbMapping.fields[field]) {
                return Promise.reject('no valid entityType:' + entity.type + ' missing field:' + field);
            }
            dbFields.push(geoEntityDbMapping.fields[field]);
            dbValues.push(entity[field] !== undefined && entity[field] !== ''
                ? entity[field]
                : null);
        }
        var updateSqlQuery = {
            sql: 'UPDATE ' + geoEntityDbMapping.table +
                ' SET ' + dbFields.map(function (field) { return field + '=?'; }).join(', ') +
                ' WHERE ' + geoEntityDbMapping.fields.id + ' = ?',
            parameters: dbValues.concat([entity.id])
        };
        // console.debug('call updateGeoEntity sql', updateSqlQuery, entity);
        return sql_utils_1.SqlUtils.executeRawSqlQueryData(this.knex, updateSqlQuery).then(function () {
            console.log('DONE - updateGeoEntity for: ', entity.type, entity.id, entity.name, fieldsToUpdate);
            return Promise.resolve(entity);
        }).catch(function (reason) {
            return Promise.reject(reason);
        });
    };
    BackendGeoService.prototype.readGeoEntitiesWithTxtButNoGpx = function (entityType, force) {
        var _this = this;
        var geoEntityDbMapping = this.geoEntityDbMapping.tables[entityType];
        if (!geoEntityDbMapping) {
            return Promise.reject('no valid entityType:' + entityType);
        }
        var readSqlQuery = {
            sql: this.generateBaseSqlForTable(geoEntityDbMapping) +
                '  WHERE ' + geoEntityDbMapping.fields.gpsTrackTxt + ' IS NOT NULL' +
                (force
                    ? ''
                    : '  AND ' + geoEntityDbMapping.fields.gpsTrackSrc + ' IS NULL') +
                '  ORDER BY ' + geoEntityDbMapping.fields.id,
            parameters: []
        };
        // console.debug('call readGeoEntitiesWithTxtButNoGpx sql', readSqlQuery);
        return sql_utils_1.SqlUtils.executeRawSqlQueryData(this.knex, readSqlQuery).then(function (dbResults) {
            var records = [];
            BackendGeoService.mapDBResultOnGeoEntity(_this.sqlQueryBuilder.extractDbResult(dbResults, _this.knex.client['config']['client']), records);
            return Promise.resolve(records);
        }).catch(function (reason) {
            return Promise.reject(reason);
        });
    };
    BackendGeoService.prototype.readGeoEntitiesWithGpxButNoPoints = function (entityType, force) {
        var _this = this;
        var geoEntityDbMapping = this.geoEntityDbMapping.tables[entityType];
        if (!geoEntityDbMapping) {
            return Promise.reject('no valid entityType:' + entityType);
        }
        var readSqlQuery = {
            sql: this.generateBaseSqlForTable(geoEntityDbMapping) +
                '  WHERE ' + geoEntityDbMapping.fields.gpsTrackSrc + ' IS NOT NULL' +
                (force
                    ? ''
                    : '  AND ' + geoEntityDbMapping.fields.id + ' NOT IN (' +
                        ' SELECT DISTINCT ' + geoEntityDbMapping.pointFields.refId +
                        ' FROM ' + geoEntityDbMapping.pointTable + ')') +
                '  ORDER BY ' + geoEntityDbMapping.fields.id,
            parameters: []
        };
        // console.debug('call readGeoEntitiesWithGpxButNoPoints sql', readSqlQuery);
        return sql_utils_1.SqlUtils.executeRawSqlQueryData(this.knex, readSqlQuery).then(function (dbResults) {
            var records = [];
            BackendGeoService.mapDBResultOnGeoEntity(_this.sqlQueryBuilder.extractDbResult(dbResults, _this.knex.client['config']['client']), records);
            return Promise.resolve(records);
        }).catch(function (reason) {
            return Promise.reject(reason);
        });
    };
    BackendGeoService.prototype.readGeoEntitiesWithGpx = function (entityType) {
        var _this = this;
        var geoEntityDbMapping = this.geoEntityDbMapping.tables[entityType];
        if (!geoEntityDbMapping) {
            return Promise.reject('no valid entityType:' + entityType);
        }
        var readSqlQuery = {
            sql: this.generateBaseSqlForTable(geoEntityDbMapping) +
                '  WHERE ' + geoEntityDbMapping.fields.gpsTrackSrc + ' IS NOT NULL' +
                '  ORDER BY ' + geoEntityDbMapping.fields.id,
            parameters: []
        };
        // console.debug('call readGeoEntitiesWithGpx sql', readSqlQuery);
        return sql_utils_1.SqlUtils.executeRawSqlQueryData(this.knex, readSqlQuery).then(function (dbResults) {
            var records = [];
            BackendGeoService.mapDBResultOnGeoEntity(_this.sqlQueryBuilder.extractDbResult(dbResults, _this.knex.client['config']['client']), records);
            return Promise.resolve(records);
        }).catch(function (reason) {
            return Promise.reject(reason);
        });
    };
    BackendGeoService.prototype.convertTxtLogToGpx = function (entity, force) {
        if (entity === undefined) {
            return Promise.reject('no valid entity:' + entity);
        }
        if (entity.gpsTrackTxt === undefined || !this.txtParser.isResponsibleForSrc(entity.gpsTrackTxt)) {
            return Promise.reject('no valid txt:' + entity.id);
        }
        var geoElements = this.txtParser.parse(entity.gpsTrackTxt, {});
        if (!geoElements) {
            return Promise.reject('error while parsing txt: got no result:' + entity.id);
        }
        var segments = [];
        var newGpx = '';
        for (var _i = 0, geoElements_1 = geoElements; _i < geoElements_1.length; _i++) {
            var geoElement = geoElements_1[_i];
            if (geoElement.type === geoElementTypes_1.GeoElementType.TRACK) {
                segments.push(this.gpxParser.createGpxTrackSegment(geoElement.points, undefined));
            }
            else {
                newGpx += this.gpxParser.createGpxRoute(geoElement.name, 'ROUTE', geoElement.points, undefined);
            }
        }
        if (segments && segments.length > 0) {
            newGpx += this.gpxParser.createGpxTrack(entity.name, 'TRACK', segments);
        }
        newGpx = this.gpxUtils.fixXml(newGpx);
        newGpx = this.gpxUtils.fixXmlExtended(newGpx);
        newGpx = this.gpxUtils.reformatXml(newGpx);
        newGpx = this.gpxUtils.trimXml(newGpx);
        entity.gpsTrackSrc = newGpx;
        console.log('DONE - convertTxtLogToGpx for: ', entity.type, entity.id, entity.name);
        return this.updateGeoEntity(entity, ['gpsTrackSrc']);
    };
    BackendGeoService.prototype.saveGpxPointsToDatabase = function (entity, force) {
        if (entity === undefined) {
            return Promise.reject('no valid entity:' + entity);
        }
        if (entity.gpsTrackSrc === undefined || !geogpx_parser_1.AbstractGeoGpxParser.isResponsibleForSrc(entity.gpsTrackSrc)) {
            return Promise.reject('no valid gpx:' + entity.id);
        }
        var geoEntityDbMapping = this.geoEntityDbMapping.tables[entity.type]
            || this.geoEntityDbMapping.tables[entity.type.toLowerCase()];
        if (!geoEntityDbMapping || !geoEntityDbMapping.pointTable || !geoEntityDbMapping.pointFields) {
            return Promise.reject('no valid entityType:' + entity.type);
        }
        var geoElements = this.gpxParser.parse(entity.gpsTrackSrc, {});
        if (!geoElements) {
            return Promise.reject('error while parsing gpx -got no result' + entity.id);
        }
        var deleteSqlQuery = {
            sql: 'DELETE FROM ' + geoEntityDbMapping.pointTable +
                ' WHERE ' + geoEntityDbMapping.pointFields.refId + ' = ?',
            parameters: [entity.id]
        };
        var sql = 'INSERT INTO ' + geoEntityDbMapping.pointTable + '(' +
            ' ' + geoEntityDbMapping.pointFields.refId +
            ', ' + geoEntityDbMapping.pointFields.lat +
            ', ' + geoEntityDbMapping.pointFields.lng +
            ', ' + geoEntityDbMapping.pointFields.alt +
            (geoEntityDbMapping.pointFields.time
                ? ', ' + geoEntityDbMapping.pointFields.time
                : '') +
            ')' +
            ' VALUES(?, ?, ?, ?' +
            (geoEntityDbMapping.pointFields.time
                ? ', ?'
                : '') +
            ')';
        var me = this;
        // console.debug('call saveGpxPointsToDatabase sql', deleteSqlQuery);
        return sql_utils_1.SqlUtils.executeRawSqlQueryData(this.knex, deleteSqlQuery).then(function () {
            var promises = [];
            for (var _i = 0, geoElements_2 = geoElements; _i < geoElements_2.length; _i++) {
                var geoElement = geoElements_2[_i];
                var _loop_1 = function (point) {
                    promises.push(function () {
                        var insertSqlQuery = {
                            sql: sql,
                            parameters: [entity.id, point.lat, point.lng,
                                point.alt !== undefined && !isNaN(point.alt)
                                    ? point.alt
                                    : null]
                        };
                        if (geoEntityDbMapping.pointFields.time) {
                            var time = point['time']
                                ? geodate_utils_1.GeoDateUtils.getLocalDateTimeForLatLng(point)
                                : undefined;
                            insertSqlQuery.parameters.push(time !== undefined
                                ? time
                                : null);
                        }
                        // console.debug('call saveGpxPointsToDatabase sql', insertSqlQuery);
                        return sql_utils_1.SqlUtils.executeRawSqlQueryData(me.knex, insertSqlQuery).then(function (result) {
                            return Promise.resolve(result);
                        }).catch(function (reason) {
                            console.error('ERROR - saveGpxPointsToDatabase for: ', entity.type, entity.id, entity.name, insertSqlQuery);
                            return Promise.reject(reason);
                        });
                    });
                };
                for (var _a = 0, _b = geoElement.points; _a < _b.length; _a++) {
                    var point = _b[_a];
                    _loop_1(point);
                }
            }
            return Promise_serial(promises, { parallelize: 1 }).then(function () {
                console.log('DONE - saveGpxPointsToDatabase for: ', entity.type, entity.id, entity.name);
                return Promise.resolve(entity);
            }).catch(function (reason) {
                return Promise.reject(reason);
            });
        }).catch(function (reason) {
            return Promise.reject(reason);
        });
    };
    BackendGeoService.prototype.exportGpxToFile = function (entity, force) {
        if (entity === undefined) {
            return Promise.reject('no valid entity:' + entity);
        }
        if (entity.gpsTrackSrc === undefined || !geogpx_parser_1.AbstractGeoGpxParser.isResponsibleForSrc(entity.gpsTrackSrc)) {
            return Promise.reject('no valid gpx:' + entity.id);
        }
        var flagUpdateName = false;
        if (entity.gpsTrackBasefile === undefined || entity.gpsTrackBasefile === null
            || entity.gpsTrackBasefile.length < 10) {
            entity.gpsTrackBasefile = this.generateGeoFileName(entity);
            flagUpdateName = true;
        }
        var filePath = this.backendConfig.apiRouteTracksStaticDir + '/' + entity.gpsTrackBasefile + '.gpx';
        var errFileCheck = file_utils_1.FileUtils.checkFilePath(filePath, false, false, false, true, false);
        if (errFileCheck) {
            return Promise.reject('no valid gpx-filePath:' + filePath);
        }
        var existsFileCheck = file_utils_1.FileUtils.checkFilePath(filePath, false, false, true, true, false);
        if (force || existsFileCheck) {
            try {
                fs.writeFileSync(filePath, entity.gpsTrackSrc);
            }
            catch (err) {
                console.error('error while writing gpx-file: ' + filePath, err);
                return Promise.reject('error while writing gpx-file: ' + err);
            }
            console.log('DONE - exportGpxToFile for: ', entity.type, entity.id, entity.name, filePath);
            if (flagUpdateName) {
                return this.updateGeoEntity(entity, ['gpsTrackBasefile']);
            }
            return Promise.resolve(entity);
        }
        console.log('SKIPPED already exists - exportGpxToFile for: ', entity.type, entity.id, entity.name, filePath);
        return Promise.resolve(entity);
    };
    BackendGeoService.prototype.exportJsonToFile = function (entity, force) {
        if (entity === undefined) {
            return Promise.reject('no valid entity:' + entity);
        }
        if (entity.gpsTrackSrc === undefined || !geogpx_parser_1.AbstractGeoGpxParser.isResponsibleForSrc(entity.gpsTrackSrc)) {
            return Promise.reject('no valid gpx:' + entity.id);
        }
        var flagUpdateName = false;
        if (entity.gpsTrackBasefile === undefined || entity.gpsTrackBasefile === null
            || entity.gpsTrackBasefile.length < 10) {
            entity.gpsTrackBasefile = this.generateGeoFileName(entity);
            flagUpdateName = true;
        }
        var filePath = this.backendConfig.apiRouteTracksStaticDir + '/' + entity.gpsTrackBasefile + '.json';
        var errFileCheck = file_utils_1.FileUtils.checkFilePath(filePath, false, false, false, true, false);
        if (errFileCheck) {
            return Promise.reject('no valid json-filePath:' + filePath);
        }
        var existsFileCheck = file_utils_1.FileUtils.checkFilePath(filePath, false, false, true, true, false);
        if (force || existsFileCheck) {
            var trackSrc = undefined;
            var geoElements = this.gpxParser.parse(entity.gpsTrackSrc, {});
            switch (entity.type) {
                case 'TRACK':
                    trackSrc = this.jsonParser.createTrack(entity.name, entity.type, geoElements.map(function (geoElement) { return geoElement.points; }), undefined);
                    break;
                case 'ROUTE':
                    // use tracks instead of route because of more information (time), route only as fallback
                    var tourSrcGeoElements = geoElements.length < 2
                        ? geoElements
                        : geoElements.filter(function (geoElement) {
                            return geoElement.type === undefined || geoElement.type === geoElementTypes_1.GeoElementType.TRACK;
                        });
                    if (tourSrcGeoElements.length === 0) {
                        tourSrcGeoElements = geoElements.filter(function (geoElement) { return geoElement.type === geoElementTypes_1.GeoElementType.ROUTE; });
                    }
                    trackSrc = this.jsonParser.createRoute(entity.name, entity.type, tourSrcGeoElements.map(function (geoElement) { return geoElement.points; })
                        .reduce(function (previousValue, currentValue) { return [].concat(previousValue, currentValue); }), undefined);
                    break;
                default:
                    return Promise.reject('unknown entitytype:' + entity.type + ' for id:' + entity.id);
            }
            try {
                fs.writeFileSync(filePath, trackSrc);
            }
            catch (err) {
                console.error('error while writing json-file: ' + filePath, err);
                return Promise.reject('error while writing json-file: ' + err);
            }
            console.log('DONE - exportJsonToFile for: ', entity.type, entity.id, entity.name, filePath);
            if (flagUpdateName) {
                return this.updateGeoEntity(entity, ['gpsTrackBasefile']);
            }
            return Promise.resolve(entity);
        }
        console.log('SKIPPED already exists - exportJsonToFile for: ', entity.type, entity.id, entity.name, filePath);
        return Promise.resolve(entity);
    };
    BackendGeoService.prototype.generateGeoFileName = function (entity) {
        if (!entity) {
            return undefined;
        }
        var locHierarchy = hierarchy_utils_1.HierarchyUtils.getTxtHierarchy(this.backendConfig.hierarchyConfig, entity, false, true, 3);
        return [string_utils_1.StringUtils.generateTechnicalName(locHierarchy.join('-')),
            string_utils_1.StringUtils.generateTechnicalName(entity.name),
            entity.type + entity.id].join('_');
    };
    BackendGeoService.prototype.generateBaseSqlForTable = function (geoEntityDbMapping) {
        return 'SELECT DISTINCT ' +
            geoEntityDbMapping.fields.id + ' as id, ' +
            geoEntityDbMapping.fields.type + ' as type, ' +
            geoEntityDbMapping.fields.name + ' as name, ' +
            geoEntityDbMapping.fields.gpsTrackBasefile + ' as gpsTrackBasefile, ' +
            geoEntityDbMapping.fields.gpsTrackSrc + ' as gpsTrackSrc, ' +
            (geoEntityDbMapping.fields.gpsTrackTxt
                ? geoEntityDbMapping.fields.gpsTrackTxt + ' as gpsTrackTxt, '
                : '') +
            geoEntityDbMapping.fields.locHirarchie + ' as locHirarchie ' +
            '  FROM ' + geoEntityDbMapping.selectFrom +
            ' ';
    };
    return BackendGeoService;
}());
exports.BackendGeoService = BackendGeoService;
//# sourceMappingURL=backend-geo.service.js.map