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
    distanceTo(otherLatLng: LatLngBase): number;
}
export interface LatLngTimeBase extends LatLngBase {
    time: Date;
}
export interface GeoElementBase<T extends LatLngBase> {
    type: GeoElementType;
    points: T[];
    name: string;
}
