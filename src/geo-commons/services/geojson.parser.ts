import {AbstractGeoParser} from './geo.parser';
import {DateUtils} from '../../commons/utils/date.utils';
import {GeoElementBase, GeoElementType, LatLngBase} from '../model/geoElementTypes';
import {NameValidationRule} from '../../search-commons/model/forms/generic-validator.util';

export abstract class AbstractGeoJsonParser<T extends LatLngBase> extends AbstractGeoParser<T> {
    private nameValidationRule = new NameValidationRule(false);

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

    public createTrack(name: string, type: string, segments: T[][], defaultPosition: T): string {
        const gpxSegments: string[] = [];
        for (const segment of segments) {
            gpxSegments.push(
                this.createJsonTrackSegment(segment, defaultPosition));
        }

        return this.createJsonTrack(name, type, gpxSegments);
    }

    public createRoute(name: string, type: string, points: T[], defaultPosition: T): string {
        return this.createJsonRoute(name, type, points, defaultPosition)
    }

    public createJsonTrack(name: string, type: string, segments: string[]): string {
        return this.createJson(name, type, segments);
    }

    public createJsonTrackSegment(points: T[], defaultPosition: T): string {
        return this.createJsonPointSegment(points);
    }

    public createJsonRoute(name: string, type: string, points: T[], defaultPosition: T): string {
        return this.createJson(name, type, [this.createJsonPointSegment(points)]);
    }

    protected createJson(name: string, type: string, pointSegments: string[]): string {
        return '{ "track": {' +
            '"tName":"' + this.nameValidationRule.sanitize(name).replace(/"/g, '') + '",' +
            '"type":"' + type + '",' +
            '"header":["lat","lon","ele"],' +
            '"records":[' +
            pointSegments.join(',') +
            ']' +
            '}}';
    }

    protected createJsonPointSegment(points: T[]): string {
        return points.map(point => this.createJsonPoint(point)).join(',')
    }

    protected createJsonPoint(point: T): string {
        const alt = point['alt'] !== undefined &&  point['alt'] !== null && (<any> point['alt']) !== ''
            ? point['alt']
            : 'null';

        return '[' + [point.lat, point.lng, alt].join(',') + ']';
    }

    protected parseJsonObj(obj, options): GeoElementBase<T>[] {
        let j;
        const coords: T[] = [];

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
