import {AbstractGeoParser} from './geo.parser';
import {DateUtils} from '../../commons/utils/date.utils';
import {GeoElementBase, GeoElementType, LatLngBase} from '../model/geoElementTypes';

export abstract class AbstractGeoJsonParser<T extends LatLngBase> extends AbstractGeoParser<T> {
    parse(json: string, options): GeoElementBase<T>[] {
        const obj = typeof json === 'string'
            ? JSON.parse(json)
            : json;

        const elements = this.parseJsonObj(obj, options);
        if (!elements) {
            return;
        }

        return elements;
    }

    protected parseJsonObj(obj, options): GeoElementBase<T>[] {
        let j;
        const coords = [];

        for (j = 0; j < obj['track']['records'].length; j++) {
            const record = obj['track']['records'][j];
            if (record.length > 2) {
                coords.push(this.createLatLng(record[0], record[1], record[2], DateUtils.parseDate(record[3])));
            } else {
                coords.push(this.createLatLng(record[0], record[1], record[2]));
            }
        }

        return [this.createGeoElement(GeoElementType.TRACK, coords, obj['track']['tName'])];
    }

    protected abstract createGeoElement(type: GeoElementType, points: T[], name: string): GeoElementBase<T>;

    protected abstract createLatLng(lat: number|string, lng: number|string, alt?: number, time?: Date): T;
}
