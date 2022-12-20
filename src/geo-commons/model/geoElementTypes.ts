export enum GeoElementType {
    TRACK,
    ROUTE,
    WAYPOINT,
    AREA
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
