export declare enum GeoElementType {
    TRACK = 0,
    ROUTE = 1,
    WAYPOINT = 2,
    AREA = 3
}
export interface LatLngBase {
    lat: number;
    lng: number;
    alt?: number;
}
export interface LatLngTimeBase extends LatLngBase {
    time: Date;
}
export interface LatLngBoundsBase<T extends LatLngBase> {
    getCenter(): T;
    getSouthWest(): T;
    getNorthEast(): T;
    getNorthWest(): T;
    getSouthEast(): T;
    getWest(): number;
    getSouth(): number;
    getEast(): number;
    getNorth(): number;
}
export interface TrackStatisticBase<T extends LatLngBase, B extends LatLngBoundsBase<T>> {
    altAsc?: number;
    altDesc?: number;
    dist: number;
    velocity?: number;
    altAscVelocity?: number;
    altDescVelocity?: number;
    altMin?: number;
    altMax?: number;
    altAvg?: number;
    altStart?: number;
    altEnd?: number;
    bounds: B;
    posStart: T;
    posEnd: T;
    dateStart: Date;
    dateEnd: Date;
    duration: number;
}
export interface GeoElementBase<T extends LatLngBase> {
    type: GeoElementType;
    points: T[];
    name: string;
}
