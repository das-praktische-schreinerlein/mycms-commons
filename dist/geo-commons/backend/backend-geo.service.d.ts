import { GeoEntity, GeoEntityDbMapping, GeoEntityTableDbMapping } from './backend-geo.types';
import { BackendGeoGpxParser, BackendGeoJsonParser, BackendGeoTxtParser } from './backend-geo.parser';
import { GeoGpxUtils } from '../services/geogpx.utils';
import { AbstractBackendGeoService } from './abstract-backend-geo.service';
import { HierarchyConfig } from '../../commons/utils/hierarchy.utils';
export declare class BackendGeoServiceConfigType {
    apiRouteTracksStaticDir: string;
    hierarchyConfig: HierarchyConfig;
}
export declare class BackendGeoService implements AbstractBackendGeoService {
    protected backendConfig: BackendGeoServiceConfigType;
    protected knex: any;
    protected gpxParser: BackendGeoGpxParser;
    protected txtParser: BackendGeoTxtParser;
    protected jsonParser: BackendGeoJsonParser;
    protected gpxUtils: GeoGpxUtils;
    protected geoEntityDbMapping: GeoEntityTableDbMapping;
    private readonly sqlQueryBuilder;
    static mapDBResultOnGeoEntity(dbResult: any, records: GeoEntity[]): void;
    constructor(backendConfig: BackendGeoServiceConfigType, knex: any, gpxParser: BackendGeoGpxParser, txtParser: BackendGeoTxtParser, jsonParser: BackendGeoJsonParser, gpxUtils: GeoGpxUtils, geoEntityDbMapping: GeoEntityTableDbMapping);
    readGeoEntityForId(entityType: string, id: number): Promise<GeoEntity>;
    updateGeoEntity(entity: GeoEntity, fieldsToUpdate: string[]): Promise<GeoEntity>;
    readGeoEntitiesWithTxtButNoGpx(entityType: string, force: boolean): Promise<GeoEntity[]>;
    readGeoEntitiesWithGpxButNoPoints(entityType: string, force: boolean): Promise<GeoEntity[]>;
    readGeoEntitiesWithGpx(entityType: string): Promise<GeoEntity[]>;
    convertTxtLogToGpx(entity: GeoEntity, force: boolean): Promise<GeoEntity>;
    saveGpxPointsToDatabase(entity: GeoEntity, force: boolean): Promise<GeoEntity>;
    exportGpxToFile(entity: GeoEntity, force: boolean): Promise<GeoEntity>;
    exportJsonToFile(entity: GeoEntity, force: boolean): Promise<GeoEntity>;
    generateGeoFileName(entity: GeoEntity): string;
    protected generateBaseSqlForTable(geoEntityDbMapping: GeoEntityDbMapping): string;
}
