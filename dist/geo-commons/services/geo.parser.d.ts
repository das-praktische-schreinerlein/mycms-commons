import { GeoElementBase, LatLngBase } from '../model/geoElementTypes';
export declare abstract class AbstractGeoParser<T extends LatLngBase> {
    abstract isResponsibleForSrc(src: string): boolean;
    abstract isResponsibleForFile(fileName: string): boolean;
    abstract parse(src: string, options: any): GeoElementBase<T>[];
    createTrack(name: string, type: string, segments: [T[]], defaultPosition: T): string;
    createRoute(name: string, type: string, points: T[], defaultPosition: T): string;
    protected abstract calcDistance(from: T, to: T): number;
    protected humanLen(l: any): string;
    protected polylineLen(ll: T[]): number;
}
