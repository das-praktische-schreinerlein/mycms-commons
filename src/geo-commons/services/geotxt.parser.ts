import {AbstractGeoParser} from './geo.parser';
import {DateUtils} from '../../commons/utils/date.utils';
import {GeoElementBase, GeoElementType, LatLngBase} from '../model/geoElementTypes';

export abstract class AbstractGeoTxtParser<T extends LatLngBase> extends AbstractGeoParser<T> {
    public static isResponsibleForSrc(src: string): boolean {
        return src !== undefined && /^[\r\n ]*<(Track|Header|Trackpoint)/g.test(src);
    }

    public static isResponsibleForFile(fileName: string): boolean {
        return fileName !== undefined && fileName.toLowerCase().endsWith('.txt');
    }

    public isResponsibleForSrc(src: string): boolean {
        return AbstractGeoTxtParser.isResponsibleForSrc(src);
    }

    public isResponsibleForFile(fileName: string): boolean {
        return AbstractGeoTxtParser.isResponsibleForFile(fileName);
    }

    public parse(txt: string, options): GeoElementBase<T>[] {
        if (!txt) {
            console.error('cant parse GeoGpxParser: empty');
            return;
        }

        if (txt.includes('<gpx') || txt.includes('<rte') || txt.includes('<trk')) {
            console.error('cant parse GeoGpxParser: no valid txt - contains xml');
            return;
        }

        const elements = this.parseTxt(txt, options);
        if (!elements) {
            return;
        }

        return elements;
    }

    protected parseTxt(txt: string, options: {}): GeoElementBase<T>[] {
        let segments: GeoElementBase<T>[] = [];
        const lines = txt.replace(/[\r\n]+/g, '\n')
            .replace(/\n[\t ]+\n/g, '\n')
            .split('\n');
        // Trackpoint N53.99300 E13.17541 10.12.2005 14:17:51 2 m 96 m 0:01:54 3 kph
        // TODO check for
        // Track	ACTIVE LOG 057	02.05.2008 07:30:04 	9:21:12	6.9 km	0.7 kph
        // Header	Position	Time	Altitude	Depth	Temperature	Leg Length	Leg Time	Leg Speed	Leg Course
        // while (found) check for next and do this.parseTrkSeg for lines between
        // with rest of lines do this.parseTrkSeg for lines
        segments = segments.concat(this.parseTrkSeg(lines, options));

        return segments;
    }

    protected parseTrkSeg(lines: string[], options: {}): GeoElementBase<T> {
        const coords: T[] = [];
        for (let i = 0; i < lines.length; i++) {
            const CONST_TRACKPOINT =
                new RegExp("Trackpoint\tN([0-9.]*) E([0-9.]*)\t([0-9.: ]*) \t([0-9-]*) m.*").compile();
            // Trackpoint N37.49171 W118.56251 19.07.2008 12:39:00 (UTC-7) 1623 m
            const CONST_TRACKPOINT_GLOB =
                new RegExp("Trackpoint\t([NS])([0-9.]*) ([EW])([0-9.]*)\t([0-9.: ]*)[ ]*([0-9()A-Z-]*)\t([0-9-]*) m.*").compile();

            const line = lines[i];
            // Trackpoint N53.99300 E13.17541 10.12.2005 14:17:51 2 m 96 m 0:01:54 3 kph
            // Trackpoint N37.49171 W118.56251 19.07.2008 12:39:00 (UTC-7) 1623 m
            const regExp = CONST_TRACKPOINT_GLOB;
            if (regExp.test(line)) {
                // Daten extrahieren
                const res = regExp.exec(line);
                if (res.length < 6) {
                    console.warn('cant parse line: expected pattern with 7 but got only ', res.length, line);
                    continue;
                }

                const latD = res[1];
                let lat = res[2];
                const lonD = res[3];
                let lon = res[4];
                const time = res[5];
                const ele = res[7];
                const date = DateUtils.parseDate(time); // TODO check this

                // Zonen auswerten
                if (latD.toUpperCase() === 'S') {
                    lat = '-' + lat;
                }
                if (lonD.toUpperCase() === 'W') {
                    lon = '-' + lon;
                }

                coords.push(
                    this.createLatLng(lat, lon, ele, date));
            }
        }

        const type = GeoElementType.TRACK;

        return this.createGeoElement(type, coords, name);
    }

    protected abstract createGeoElement(type: GeoElementType, points: T[], name: string): GeoElementBase<T>;

    protected abstract createLatLng(lat: number|string, lng: number|string, alt?: number|string, time?: Date): T;
}
