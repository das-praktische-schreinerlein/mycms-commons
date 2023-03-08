import {AbstractGeoParser} from './geo.parser';
import {DateUtils} from '../../commons/utils/date.utils';
import {GeoElementBase, GeoElementType, LatLngBase} from '../model/geoElementTypes';
import {GeoDateUtils} from './geodate.utils';

export abstract class AbstractGeoTxtParser<T extends LatLngBase> extends AbstractGeoParser<T> {
    public static isResponsibleForSrc(src: string): boolean {
        return src !== undefined && /^[\r\n ]*(Grid|Datum|Track|Header|Trackpoint)/g.test(src);
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
            console.error('GeoTxtParser cant parse: empty');
            return;
        }

        if (txt.includes('<gpx') || txt.includes('<rte') || txt.includes('<trk')) {
            console.error('GeoTxtParser cant parse: no valid txt - contains xml');
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
        const srcSegments: {
            name: string,
            lines: string[]}[] = [];
        let currentSeg: {
            name: string,
            lines: string[]} = {
            name: undefined,
            lines: []
        };
        for (const line of lines) {
            if (line.match(/Grid/)) {
                // NOOP
            } else if (line.match(/Datum/)) {
                // NOOP
            } else if (line.match(/^Track[\t ]+/)) {
                // NOOP
                if (currentSeg.name) {
                    srcSegments.push(currentSeg);
                }
                currentSeg = {
                    name: line,
                    lines: []
                };
            } else if (line.match(/^Header/)) {
                // NOOP
            } else if (line.match(/^Trackpoint/)) {
                if (!currentSeg.name) {
                    currentSeg.name = 'Default'
                }
                currentSeg.lines.push(line)
            } else {
                // NOOP
            }
        }

        if (currentSeg.name) {
            srcSegments.push(currentSeg);
        }

        for (const srcSegment of srcSegments) {
            segments.push(
                this.parseTrkSeg(srcSegment.name, srcSegment.lines, options));
        }

        return segments;
    }

    protected parseTrkSeg(name, lines: string[], options: {}): GeoElementBase<T> {
        const coords: T[] = [];
        for (const element of lines) {
            const CONST_TRACKPOINT_LEGACY = /Trackpoint[\t ]+([NS])([0-9.]*)[\t ]+([EW])([0-9.]*)[\t ]+(\d\d\.\d\d\.\d\d\d\d \d\d:\d\d:\d\d)[\t ]+([0-9-]*) m.*/g;
            const CONST_TRACKPOINT_GLOB = /Trackpoint[\t ]+([NS])([0-9.]*)[\t ]+([EW])([0-9.]*)[\t ]+(\d\d\.\d\d\.\d\d\d\d \d\d:\d\d:\d\d)( \(UTC[+-0-9].*\))[\t ]+([0-9-]*) m.*/g;

            const line = element;
            if (line.match(CONST_TRACKPOINT_LEGACY)) {
                // Trackpoint N53.99300 E13.17541 10.12.2005 14:17:51 2 m 96 m 0:01:54 3 kph
                const res = CONST_TRACKPOINT_LEGACY.exec(line);
                if (res.length < 5) {
                    console.warn('cant parse line: expected pattern with 6 but got only ', res.length, line, res);
                    continue;
                }

                const latD = res[1].trim();
                let lat = res[2].trim();
                const lonD = res[3].trim();
                let lon = res[4].trim();
                const time = res[5].trim();
                const ele = res[6].trim();
                if (latD.toUpperCase() === 'S') {
                    lat = '-' + lat;
                }
                if (lonD.toUpperCase() === 'W') {
                    lon = '-' + lon;
                }

                const timeZone = GeoDateUtils.getTimezone(this.createLatLng(lat, lon));
                const date = DateUtils.parseDate(time, timeZone);

                coords.push(
                    this.createLatLng(lat, lon, ele, date));
            } else if (line.match(CONST_TRACKPOINT_GLOB)) {
                // Trackpoint N37.49171 W118.56251 19.07.2008 12:39:00 (UTC-7) 1623 m
                const res = CONST_TRACKPOINT_GLOB.exec(line);
                if (res.length < 6) {
                    console.warn('cant parse line: expected pattern with 7 but got only ', res.length, line, res);
                    continue;
                }

                const latD = res[1].trim();
                let lat = res[2].trim();
                const lonD = res[3].trim();
                let lon = res[4].trim();
                const time = res[5].trim();
                const txtTimeZone = res[6].trim();
                const ele = res[7].trim();

                if (latD.toUpperCase() === 'S') {
                    lat = '-' + lat;
                }
                if (lonD.toUpperCase() === 'W') {
                    lon = '-' + lon;
                }

                const timeZone = GeoDateUtils.getTimezone(this.createLatLng(lat, lon));
                const date = DateUtils.parseDate(time, timeZone);

                coords.push(
                    this.createLatLng(lat, lon, ele, date));
            } else {
                console.debug('GeoTxtParser: cant parse Trackpoint', line);
            }
        }

        const type = GeoElementType.TRACK;

        return this.createGeoElement(type, coords, name);
    }

    protected abstract createGeoElement(type: GeoElementType, points: T[], name: string): GeoElementBase<T>;

    protected abstract createLatLng(lat: number|string, lng: number|string, alt?: number|string, time?: Date): T;

}
