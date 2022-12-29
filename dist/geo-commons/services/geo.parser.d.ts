import { GeoElementBase, LatLngBase } from '../model/geoElementTypes';
export declare abstract class AbstractGeoParser<T extends LatLngBase> {
    abstract parse(src: string, options: any): GeoElementBase<T>[];
    protected abstract calcDistance(from: T, to: T): number;
    protected humanLen(l: any): string;
    protected polylineLen(ll: T[]): number;
}
