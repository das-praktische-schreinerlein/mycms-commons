import { GeoElementBase, GeoElementType, LatLngBase, LatLngTimeBase } from '../model/geoElementTypes';
export declare class BackendLatLng implements LatLngBase {
    alt: number;
    lat: number;
    lng: number;
}
export declare class BackendLatLngTime extends BackendLatLng implements LatLngTimeBase {
    time: Date;
}
export declare class BackendGeoElement implements GeoElementBase<BackendLatLng> {
    type: GeoElementType;
    points: BackendLatLng[];
    name: string;
    constructor(type: GeoElementType, points: BackendLatLng[], name: string);
}
export interface GeoEntity {
    type: string;
    id: string;
    name: string;
    locHirarchie?: string;
    gpsTrackTxt?: string;
    gpsTrackSrc: string;
    gpsTrackBasefile: string;
    createdAt?: Date;
    updatedAt?: Date;
    updateVersion?: number;
}
export interface GeoEntityFieldMapping {
    type: string;
    id: string;
    name: string;
    locHirarchie?: string;
    gpsTrackTxt?: string;
    gpsTrackSrc: string;
    gpsTrackBasefile: string;
}
export interface GeoPointEntityFieldMapping {
    refId: string;
    alt: string;
    lat: string;
    lng: string;
    time: string;
}
export interface GeoEntityDbMapping {
    table: string;
    selectFrom: string;
    fields: GeoEntityFieldMapping;
    pointTable?: string;
    pointFields?: GeoPointEntityFieldMapping;
}
export interface GeoEntityTablesDbMapping {
    [key: string]: GeoEntityDbMapping;
}
export interface GeoEntityTableDbMapping {
    tables: GeoEntityTablesDbMapping;
}
