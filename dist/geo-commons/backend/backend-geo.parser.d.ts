import { GeoElementType } from '../model/geoElementTypes';
import { AbstractGeoParser } from '../services/geo.parser';
import { AbstractGeoGpxParser } from '../services/geogpx.parser';
import { AbstractGeoJsonParser } from '../services/geojson.parser';
import { AbstractGeoTxtParser } from '../services/geotxt.parser';
import { BackendGeoElement, BackendLatLng } from './backend-geo.types';
export declare class BackendGeoUtils {
    static createLatLng(lat: string | number, lng: string | number, alt?: number, time?: Date): BackendLatLng;
    static createGeoElement(type: GeoElementType, points: BackendLatLng[], name: string): BackendGeoElement;
    static calcDistance(from: BackendLatLng, to: BackendLatLng): number;
}
export interface BackendGeoParser extends AbstractGeoParser<BackendLatLng> {
}
export declare class BackendGeoGpxParser extends AbstractGeoGpxParser<BackendLatLng> implements BackendGeoParser {
    protected parseDomFromString(xml: string): Document;
    protected createLatLng(lat: string | number, lng: string | number, alt?: number, time?: Date): BackendLatLng;
    protected createGeoElement(type: GeoElementType, points: BackendLatLng[], name: string): BackendGeoElement;
    protected calcDistance(from: BackendLatLng, to: BackendLatLng): number;
}
export declare class BackendGeoTxtParser extends AbstractGeoTxtParser<BackendLatLng> implements BackendGeoParser {
    protected createLatLng(lat: string | number, lng: string | number, alt?: number, time?: Date): BackendLatLng;
    protected createGeoElement(type: GeoElementType, points: BackendLatLng[], name: string): BackendGeoElement;
    protected calcDistance(from: BackendLatLng, to: BackendLatLng): number;
}
export declare class BackendGeoJsonParser extends AbstractGeoJsonParser<BackendLatLng> implements BackendGeoParser {
    protected createLatLng(lat: string | number, lng: string | number, alt?: number, time?: Date): BackendLatLng;
    protected createGeoElement(type: GeoElementType, points: BackendLatLng[], name: string): BackendGeoElement;
    protected calcDistance(from: BackendLatLng, to: BackendLatLng): number;
}
