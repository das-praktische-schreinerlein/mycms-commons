import {AbstractGeoParser} from './geo.parser';
import {DateUtils} from '../../commons/utils/date.utils';
import {GeoElementBase, GeoElementType, LatLngBase} from '../model/geoElementTypes';

export abstract class AbstractGeoJsonParser<T extends LatLngBase> extends AbstractGeoParser<T> {
    public static isResponsibleForSrc(src: string): boolean {
        return src !== undefined && /^[\r\n ]*\[[\r\n ]*{[\r\n ]*"track"/g.test(src);
    }

    public static isResponsibleForFile(fileName: string): boolean {
        return fileName !== undefined &&
            (fileName.toLowerCase().endsWith('.json') ||  fileName.toLowerCase().endsWith('.geojson'));
    }

    public isResponsibleForSrc(src: string): boolean {
        return AbstractGeoJsonParser.isResponsibleForSrc(src);
    }

    public isResponsibleForFile(fileName: string): boolean {
        return AbstractGeoJsonParser.isResponsibleForFile(fileName);
    }

    public parse(json: string, options): GeoElementBase<T>[] {
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

        return [this.createGeoElement(GeoElementType.TRACK, coords, obj['track']['tName'] || obj['track']['kName'])];
    }

    protected abstract createGeoElement(type: GeoElementType, points: T[], name: string): GeoElementBase<T>;

    protected abstract createLatLng(lat: number|string, lng: number|string, alt?: number, time?: Date): T;
}
