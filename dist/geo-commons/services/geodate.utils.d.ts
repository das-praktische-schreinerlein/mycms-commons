import { LatLngBase, LatLngTimeBase } from '../model/geoElementTypes';
export declare class GeoDateUtils {
    static getLocalDateTimeForLatLng(pos: LatLngBase): Date;
    static getTimezone(pos: LatLngBase): string;
    static getDateForTimezone(date: Date, timezone: string): Date;
    static getTimeOffsetToUtc(pos: LatLngTimeBase): number;
    static getTimeOffset(timeZone: string, date?: Date): number;
    private static getOffset;
}
