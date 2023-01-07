import * as tzlookup from 'tz-lookup/tz';
import {LatLngBase} from '../model/geoElementTypes';

export class GeoDateUtils  {
    public static getLocalDateTimeForLatLng(pos: LatLngBase): Date {
        if (!pos || !pos['time']) {
            return undefined;
        }

        const timezone = tzlookup(pos.lat, pos.lng);
        if (!timezone) {
            return pos['time'];
        }

        const dateString = pos['time'].toLocaleString('en-US', {timeZone: timezone});
        return new Date(dateString);
    }
}
