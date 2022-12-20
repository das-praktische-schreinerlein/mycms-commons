import { AbstractGeoParser } from './geo.parser';
import { GeoElementBase, GeoElementType, LatLngBase } from '../model/geoElementTypes';
export declare abstract class AbstractGeoJsonParser<T extends LatLngBase> extends AbstractGeoParser<T> {
    parse(json: string, options: any): GeoElementBase<T>[];
    protected parseJsonObj(obj: any, options: any): GeoElementBase<T>[];
    protected abstract createGeoElement(type: GeoElementType, points: T[], name: string): GeoElementBase<T>;
    protected abstract createLatLng(lat: number | string, lng: number | string, alt?: number, time?: Date): T;
}
