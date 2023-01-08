import * as tzlookup from 'tz-lookup/tz';
import {LatLngBase, LatLngTimeBase} from '../model/geoElementTypes';

export class GeoDateUtils  {
    public static getLocalDateTimeForLatLng(pos: LatLngBase): Date {
        if (!pos || !pos['time']) {
            return undefined;
        }

        const timezone = GeoDateUtils.getTimezone(pos);
        if (!timezone) {
            return pos['time'];
        }

        return GeoDateUtils.getDateForTimezone(pos['time'], timezone);
    }

    public static getTimezone(pos: LatLngBase): string {
        if (!pos) {
            return undefined;
        }

        return tzlookup(pos.lat, pos.lng);
    }

    public static getDateForTimezone(date: Date, timezone: string): Date {
        if (!date) {
            return undefined;
        }

        const dateString = date.toLocaleString('en-US', {timeZone: timezone});
        return new Date(dateString);
    }

    public static getTimeOffsetToUtc(pos: LatLngTimeBase): number {
        const origDate = pos['time'];
        if (!origDate) {
            return undefined;
        }

        const localDate = GeoDateUtils.getLocalDateTimeForLatLng(pos);
        const utcDate = GeoDateUtils.getDateForTimezone(origDate, 'Europe/London');
        return new Date(localDate.getTime() - utcDate.getTime()).getTime() / 60 / 60 / 1000;
    }
}
