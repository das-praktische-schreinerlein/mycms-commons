import { GeoEntity } from './backend-geo.types';
export interface AbstractBackendGeoService {
    readGeoEntityForId(table: string, id: number): Promise<GeoEntity>;
    convertTxtLogToGpx(entity: GeoEntity, force: boolean): Promise<GeoEntity>;
    saveGpxPointsToDatabase(entity: GeoEntity, force: boolean): Promise<GeoEntity>;
    exportGpxToFile(entity: GeoEntity, force: boolean): Promise<GeoEntity>;
    exportJsonToFile(entity: GeoEntity, force: boolean): Promise<GeoEntity>;
}
