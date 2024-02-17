import {GeoEntity, GeoEntityDbMapping, GeoEntityTableDbMapping} from './backend-geo.types';
import {AbstractGeoGpxParser} from '../services/geogpx.parser';
import {GeoDateUtils} from '../services/geodate.utils';
import {FileUtils} from '../../commons/utils/file.utils';
import * as fs from 'fs';
import {BackendGeoGpxParser, BackendGeoJsonParser, BackendGeoTxtParser} from './backend-geo.parser';
import {GeoElementType} from '../model/geoElementTypes';
import {GeoGpxUtils} from '../services/geogpx.utils';
import {AbstractBackendGeoService} from './abstract-backend-geo.service';
import {RawSqlQueryData, SqlUtils} from '../../search-commons/services/sql-utils';
import {SqlQueryBuilder} from '../../search-commons/services/sql-query.builder';
import * as Promise_serial from 'promise-serial';
import {StringUtils} from '../../commons/utils/string.utils';
import {HierarchyConfig, HierarchyUtils} from '../../commons/utils/hierarchy.utils';

export class BackendGeoServiceConfigType {
    apiRouteTracksStaticDir: string;
    hierarchyConfig: HierarchyConfig;
}

export class BackendGeoService implements AbstractBackendGeoService {
    private readonly sqlQueryBuilder: SqlQueryBuilder;

    public static mapDBResultOnGeoEntity(dbResult: any, records: GeoEntity[]): void {
        for (let i = 0; i <= dbResult.length; i++) {
            if (dbResult[i] !== undefined) {
                const entry: GeoEntity = {
                    gpsTrackBasefile: undefined,
                    gpsTrackSrc: undefined,
                    gpsTrackTxt: undefined,
                    id: undefined,
                    locHirarchie: undefined,
                    name: undefined,
                    type: undefined
                };
                for (const key in dbResult[i]) {
                    if (dbResult[i].hasOwnProperty(key)) {
                        entry[key] = dbResult[i][key];
                    }
                }
                records.push(entry);
            }
        }
    }

    constructor(protected backendConfig: BackendGeoServiceConfigType,
                protected knex,
                protected gpxParser: BackendGeoGpxParser,
                protected txtParser: BackendGeoTxtParser,
                protected jsonParser: BackendGeoJsonParser,
                protected gpxUtils: GeoGpxUtils,
                protected geoEntityDbMapping: GeoEntityTableDbMapping) {
        this.sqlQueryBuilder = new SqlQueryBuilder();
    }

    public readGeoEntityForId(entityType: string, id: number): Promise<GeoEntity> {
        const geoEntityDbMapping = this.geoEntityDbMapping.tables[entityType];
        if (!geoEntityDbMapping) {
            return Promise.reject('no valid entityType:' + entityType);
        }

        const readSqlQuery: RawSqlQueryData = {
            sql: this.generateBaseSqlForTable(geoEntityDbMapping) +
                '  WHERE ' + geoEntityDbMapping.fields.id + ' = ?',
            parameters: [id]
        };

        // console.debug('call readGeoEntityForId sql', readSqlQuery);
        return SqlUtils.executeRawSqlQueryData(this.knex, readSqlQuery).then(dbResults => {
            const records: GeoEntity[] = [];
            BackendGeoService.mapDBResultOnGeoEntity(
                this.sqlQueryBuilder.extractDbResult(dbResults, this.knex.client['config']['client']), records);

            if (records.length === 1) {
                return Promise.resolve(records[0]);
            }

            return Promise.resolve(undefined);
        }).catch(reason => {
            return Promise.reject(reason);
        });
    }

    public updateGeoEntity(entity: GeoEntity, fieldsToUpdate: string[]): Promise<GeoEntity> {
        const geoEntityDbMapping = this.geoEntityDbMapping.tables[entity.type]
            || this.geoEntityDbMapping.tables[entity.type.toLowerCase()];
        if (!geoEntityDbMapping) {
            return Promise.reject('no valid entityType:' + entity.type);
        }

        const dbFields = [];
        const dbValues = [];
        for (const field of fieldsToUpdate) {
            if (!geoEntityDbMapping.fields[field]) {
                return Promise.reject('no valid entityType:' + entity.type + ' missing field:' + field);
            }

            dbFields.push(geoEntityDbMapping.fields[field]);
            dbValues.push(entity[field] !== undefined && entity[field] !== ''
                ? entity[field]
                : null);
        }

        const updateSqlQuery: RawSqlQueryData = {
            sql: 'UPDATE ' + geoEntityDbMapping.table +
                ' SET ' + dbFields.map( field => field + '=?').join(', ') +
                ' WHERE ' + geoEntityDbMapping.fields.id + ' = ?',
            parameters: dbValues.concat([entity.id])
        };

        // console.debug('call updateGeoEntity sql', updateSqlQuery, entity);
        return SqlUtils.executeRawSqlQueryData(this.knex, updateSqlQuery).then( () => {
            console.log('DONE - updateGeoEntity for: ', entity.type, entity.id, entity.name, fieldsToUpdate);
            return Promise.resolve(entity);
        }).catch(reason => {
            return Promise.reject(reason);
        });
    }

    public readGeoEntitiesWithTxtButNoGpx(entityType: string, force: boolean): Promise<GeoEntity[]> {
        const geoEntityDbMapping = this.geoEntityDbMapping.tables[entityType];
        if (!geoEntityDbMapping) {
            return Promise.reject('no valid entityType:' + entityType);
        }

        const readSqlQuery: RawSqlQueryData = {
            sql: this.generateBaseSqlForTable(geoEntityDbMapping) +
                '  WHERE ' + geoEntityDbMapping.fields.gpsTrackTxt + ' IS NOT NULL' +
                (force
                    ? ''
                    : '  AND ' + geoEntityDbMapping.fields.gpsTrackSrc + ' IS NULL') +
                '  ORDER BY ' +  geoEntityDbMapping.fields.id,
            parameters: []
        };

        // console.debug('call readGeoEntitiesWithTxtButNoGpx sql', readSqlQuery);
        return SqlUtils.executeRawSqlQueryData(this.knex, readSqlQuery).then(dbResults => {
            const records: GeoEntity[] = [];
            BackendGeoService.mapDBResultOnGeoEntity(
                this.sqlQueryBuilder.extractDbResult(dbResults, this.knex.client['config']['client']), records);

            return Promise.resolve(records);
        }).catch(reason => {
            return Promise.reject(reason);
        });
    }

    public readGeoEntitiesWithGpxButNoPoints(entityType: string, force: boolean): Promise<GeoEntity[]> {
        const geoEntityDbMapping = this.geoEntityDbMapping.tables[entityType];
        if (!geoEntityDbMapping) {
            return Promise.reject('no valid entityType:' + entityType);
        }

        const readSqlQuery: RawSqlQueryData = {
            sql: this.generateBaseSqlForTable(geoEntityDbMapping) +
                '  WHERE ' + geoEntityDbMapping.fields.gpsTrackSrc + ' IS NOT NULL' +
                (force
                        ? ''
                        : '  AND ' + geoEntityDbMapping.fields.id + ' NOT IN (' +
                        ' SELECT DISTINCT ' + geoEntityDbMapping.pointFields.refId +
                        ' FROM ' + geoEntityDbMapping.pointTable + ')'
                ) +
                '  ORDER BY ' +  geoEntityDbMapping.fields.id,
            parameters: []
        };

        // console.debug('call readGeoEntitiesWithGpxButNoPoints sql', readSqlQuery);
        return SqlUtils.executeRawSqlQueryData(this.knex, readSqlQuery).then(dbResults => {
            const records: GeoEntity[] = [];
            BackendGeoService.mapDBResultOnGeoEntity(
                this.sqlQueryBuilder.extractDbResult(dbResults, this.knex.client['config']['client']), records);

            return Promise.resolve(records);
        }).catch(reason => {
            return Promise.reject(reason);
        });
    }

    public readGeoEntitiesWithGpx(entityType: string): Promise<GeoEntity[]> {
        const geoEntityDbMapping = this.geoEntityDbMapping.tables[entityType];
        if (!geoEntityDbMapping) {
            return Promise.reject('no valid entityType:' + entityType);
        }

        const readSqlQuery: RawSqlQueryData = {
            sql: this.generateBaseSqlForTable(geoEntityDbMapping) +
                '  WHERE ' + geoEntityDbMapping.fields.gpsTrackSrc + ' IS NOT NULL' +
                '  ORDER BY ' +  geoEntityDbMapping.fields.id,
            parameters: []
        };

        // console.debug('call readGeoEntitiesWithGpx sql', readSqlQuery);
        return SqlUtils.executeRawSqlQueryData(this.knex, readSqlQuery).then(dbResults => {
            const records: GeoEntity[] = [];
            BackendGeoService.mapDBResultOnGeoEntity(
                this.sqlQueryBuilder.extractDbResult(dbResults, this.knex.client['config']['client']), records);

            return Promise.resolve(records);
        }).catch(reason => {
            return Promise.reject(reason);
        });
    }

    public convertTxtLogToGpx(entity: GeoEntity, force: boolean): Promise<GeoEntity> {
        if (entity === undefined) {
            return Promise.reject('no valid entity:' + entity);
        }

        if (entity.gpsTrackTxt === undefined || !this.txtParser.isResponsibleForSrc(entity.gpsTrackTxt)) {
            return Promise.reject('no valid txt:' + entity.id);
        }

        const geoElements = this.txtParser.parse(entity.gpsTrackTxt, {});
        if (!geoElements) {
            return Promise.reject('error while parsing txt: got no result:' + entity.id);
        }

        const segments = [];
        let newGpx = '';
        for (const geoElement of geoElements) {
            if (geoElement.type === GeoElementType.TRACK) {
                segments.push(
                    this.gpxParser.createGpxTrackSegment(geoElement.points, undefined));
            } else {
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
    }

    public saveGpxPointsToDatabase(entity: GeoEntity, force: boolean): Promise<GeoEntity> {
        if (entity === undefined) {
            return Promise.reject('no valid entity:' + entity);
        }

        if (entity.gpsTrackSrc === undefined || !AbstractGeoGpxParser.isResponsibleForSrc(entity.gpsTrackSrc)) {
            return Promise.reject('no valid gpx:' + entity.id);
        }

        const geoEntityDbMapping = this.geoEntityDbMapping.tables[entity.type]
            || this.geoEntityDbMapping.tables[entity.type.toLowerCase()];
        if (!geoEntityDbMapping || !geoEntityDbMapping.pointTable || !geoEntityDbMapping.pointFields) {
            return Promise.reject('no valid entityType:' + entity.type);
        }

        const geoElements = this.gpxParser.parse(entity.gpsTrackSrc, {});
        if (!geoElements) {
            return Promise.reject('error while parsing gpx -got no result' + entity.id);
        }

        const deleteSqlQuery: RawSqlQueryData = {
            sql: 'DELETE FROM ' + geoEntityDbMapping.pointTable +
                ' WHERE ' + geoEntityDbMapping.pointFields.refId + ' = ?',
            parameters: [entity.id]
        };

        const sql = 'INSERT INTO ' + geoEntityDbMapping.pointTable + '(' +
            ' ' + geoEntityDbMapping.pointFields.refId +
            ', ' + geoEntityDbMapping.pointFields.lat +
            ', ' + geoEntityDbMapping.pointFields.lng +
            ', ' + geoEntityDbMapping.pointFields.alt +
            (geoEntityDbMapping.pointFields.time
                    ? ', ' + geoEntityDbMapping.pointFields.time
                    : ''
            ) +
            ')' +
            ' VALUES(?, ?, ?, ?' +
            (geoEntityDbMapping.pointFields.time
                    ? ', ?'
                    : ''
            ) +
            ')';

        const me = this;
        // console.debug('call saveGpxPointsToDatabase sql', deleteSqlQuery);
        return SqlUtils.executeRawSqlQueryData(this.knex, deleteSqlQuery).then( () => {
            const promises = [];
            for (const geoElement of geoElements) {
                for (const point of geoElement.points) {
                    promises.push ( function () {
                        const insertSqlQuery: RawSqlQueryData = {
                            sql: sql,
                            parameters: [entity.id, point.lat, point.lng,
                                point.alt !== undefined && !isNaN(point.alt)
                                    ? point.alt
                                    : null]
                        };

                        if (geoEntityDbMapping.pointFields.time) {
                            const time = point['time']
                                ? GeoDateUtils.getLocalDateTimeForLatLng(point)
                                : undefined;
                            insertSqlQuery.parameters.push(time !== undefined
                                ? time
                                : null);
                        }

                        // console.debug('call saveGpxPointsToDatabase sql', insertSqlQuery);
                        return SqlUtils.executeRawSqlQueryData(me.knex, insertSqlQuery).then((result) => {
                            return Promise.resolve(result);
                        }).catch(reason => {
                            console.error('ERROR - saveGpxPointsToDatabase for: ', entity.type, entity.id, entity.name,
                                insertSqlQuery);
                            return Promise.reject(reason);
                        });
                    });
                }
            }

            return Promise_serial(promises, {parallelize: 1}).then(() => {
                console.log('DONE - saveGpxPointsToDatabase for: ', entity.type, entity.id, entity.name);
                return Promise.resolve(entity);
            }).catch(reason => {
                return Promise.reject(reason);
            });
        }).catch(reason => {
            return Promise.reject(reason);
        });
    }

    public exportGpxToFile(entity: GeoEntity, force: boolean): Promise<GeoEntity> {
        if (entity === undefined) {
            return Promise.reject('no valid entity:' + entity);
        }

        if (entity.gpsTrackSrc === undefined || !AbstractGeoGpxParser.isResponsibleForSrc(entity.gpsTrackSrc)) {
            return Promise.reject('no valid gpx:' + entity.id);
        }

        let flagUpdateName = false;
        if (entity.gpsTrackBasefile === undefined || entity.gpsTrackBasefile === null
            || entity.gpsTrackBasefile.length < 10) {
            entity.gpsTrackBasefile = this.generateGeoFileName(entity);
            flagUpdateName = true;
        }

        const filePath = this.backendConfig.apiRouteTracksStaticDir + '/' + entity.gpsTrackBasefile + '.gpx';
        const errFileCheck = FileUtils.checkFilePath(filePath, false, false, false, true, false);
        if (errFileCheck) {
            return Promise.reject('no valid gpx-filePath:' + filePath);
        }

        const existsFileCheck = FileUtils.checkFilePath(filePath, false, false, true, true, false);
        if (force || existsFileCheck || this.checkIfFileShouldUpdated(entity, filePath)) {
            try {
                fs.writeFileSync(filePath, entity.gpsTrackSrc);
            } catch (err) {
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
    }

    public exportJsonToFile(entity: GeoEntity, force: boolean): Promise<GeoEntity> {
        if (entity === undefined) {
            return Promise.reject('no valid entity:' + entity);
        }

        if (entity.gpsTrackSrc === undefined || !AbstractGeoGpxParser.isResponsibleForSrc(entity.gpsTrackSrc)) {
            return Promise.reject('no valid gpx:' + entity.id);
        }

        let flagUpdateName = false;
        if (entity.gpsTrackBasefile === undefined || entity.gpsTrackBasefile === null
            || entity.gpsTrackBasefile.length < 10) {
            entity.gpsTrackBasefile = this.generateGeoFileName(entity);
            flagUpdateName = true;
        }

        const filePath = this.backendConfig.apiRouteTracksStaticDir + '/' + entity.gpsTrackBasefile + '.json';
        const errFileCheck = FileUtils.checkFilePath(filePath, false, false, false, true, false);
        if (errFileCheck) {
            return Promise.reject('no valid json-filePath:' + filePath);
        }

        const existsFileCheck = FileUtils.checkFilePath(filePath, false, false, true, true, false);
        if (force || existsFileCheck || this.checkIfFileShouldUpdated(entity, filePath)) {
            let trackSrc = undefined;
            let geoElements = this.gpxParser.parse(entity.gpsTrackSrc, {});
            switch (entity.type) {
                case 'TRACK':
                    trackSrc = this.jsonParser.createTrack(entity.name, entity.type,
                        geoElements.map(geoElement => geoElement.points), undefined);
                    break;
                case 'ROUTE':
                    // use tracks instead of route because of more information (time), route only as fallback
                    let tourSrcGeoElements = geoElements.length < 2
                        ? geoElements
                        : geoElements.filter(geoElement =>
                            geoElement.type === undefined || geoElement.type === GeoElementType.TRACK);
                    if (tourSrcGeoElements.length === 0) {
                        tourSrcGeoElements = geoElements.filter(geoElement => geoElement.type === GeoElementType.ROUTE);
                    }

                    trackSrc = this.jsonParser.createRoute(entity.name, entity.type,
                        tourSrcGeoElements.map(geoElement => geoElement.points)
                            .reduce((previousValue, currentValue) => [].concat(previousValue, currentValue)),
                        undefined);
                    break;
                default:
                    return Promise.reject('unknown entitytype:' + entity.type + ' for id:' + entity.id);
            }

            try {
                fs.writeFileSync(filePath, trackSrc);
            } catch (err) {
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
    }

    public generateGeoFileName(entity: GeoEntity): string {
        if (!entity) {
            return undefined;
        }

        const locHierarchy = HierarchyUtils.getTxtHierarchy(this.backendConfig.hierarchyConfig, entity, false,  true, 3);

        return [StringUtils.generateTechnicalName(locHierarchy.join('-')),
            StringUtils.generateTechnicalName(entity.name),
            entity.type + entity.id].join('_');
    }

    protected generateBaseSqlForTable(geoEntityDbMapping: GeoEntityDbMapping): string {
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
    }

    protected checkIfFileShouldUpdated(mdoc: GeoEntity, absDestPath: string): boolean {
        if (!fs.existsSync(absDestPath)) {
            return true;
        }

        const fileUpdateDate = fs.statSync(absDestPath).ctimeMs;
        if (mdoc.updatedAt !== undefined && new Date(mdoc.updatedAt).getTime() < fileUpdateDate) {
            const msg = 'HINT doc.updatedAt' + mdoc.updatedAt + ' < fileUpdateDate:' + new Date(fileUpdateDate);
            console.log(msg)
            return false
        }

        return true;
    }
}
