import {AbstractGeoParser} from './geo.parser';
import {DateUtils} from '../../commons/utils/date.utils';
import {GeoGpxUtils} from './geogpx.utils';
import {GeoElementBase, GeoElementType, LatLngBase, LatLngTimeBase} from '../model/geoElementTypes';

export abstract class AbstractGeoGpxParser<T extends LatLngBase> extends AbstractGeoParser<T> {
    public static isResponsibleForSrc(src: string): boolean {
        return src !== undefined && /^[\r\n ]*<(\?xml|gpx|trk|rte|wpt')/g.test(src);
    }

    public static isResponsibleForFile(fileName: string): boolean {
        return fileName !== undefined && fileName.toLowerCase().endsWith('.gpx');
    }

    constructor(protected geoGpxUtils?: GeoGpxUtils) {
        super();
        if (!geoGpxUtils) {
            this.geoGpxUtils = new GeoGpxUtils();
        }
    }

    public isResponsibleForSrc(src: string): boolean {
        return AbstractGeoGpxParser.isResponsibleForSrc(src);
    }

    public isResponsibleForFile(fileName: string): boolean {
        return AbstractGeoGpxParser.isResponsibleForFile(fileName);
    }

    public parse(xml: string, options): GeoElementBase<T>[] {
        if (!xml) {
            console.error('GeoGpxParser cant parse: empty');
            return;
        }

        xml = this.geoGpxUtils.fixXml(xml);
        if (!(xml.startsWith('<?xml'))) {
            console.error('GeoGpxParser cant parse: no valid xml');
            return;
        }

        const gpxDom: Document = this.parseDomFromString(xml);
        if (gpxDom.getElementsByTagName('parsererror').length > 0) {
            console.error('GeoGpxParser cant parse: parsererror', gpxDom.getElementsByTagName('parsererror')[0]);
            return;
        }

        const elements = this.parseGpxDom(gpxDom, options);
        if (!elements) {
            return;
        }

        return elements;
    }

    public createGpxTrack(name: string, type: string, segments: string[]): string {
        let newGpx = '<trk><type>' + type + '</type><name>' + name + '</name>';
        if (segments) {
            for (let i = 0; i < segments.length; i++) {
                const segment = segments[i];
                newGpx = newGpx + segment;
            }
        }

        newGpx = newGpx + '</trk>';

        return newGpx;
    }

    public createGpxTrackSegment(points: LatLngBase[], defaultPosition: LatLngTimeBase): string {
        if (!points || points.length <= 0) {
            return '';
        }

        let lastTime = defaultPosition && defaultPosition.time
            ? typeof defaultPosition.time === 'string'
                ? defaultPosition.time
                : defaultPosition.time.toISOString()
            : undefined;
        let lastAlt = defaultPosition && defaultPosition.alt
            ? defaultPosition.alt
            : undefined;

        let newGpx = '<trkseg>';
        for (let i = 0; i < points.length; i++) {
            const point = points[i];
            const time = point['time']
                ? typeof point['time'] === 'string'
                    ? point['time']
                    : point['time'].toISOString() // TODO use Zulu time
                : lastTime;
            const alt = point['alt']
                ? point['alt']
                : lastAlt;

            newGpx = newGpx + '<trkpt lat="' + point.lat + '" lon="' + point.lng + '">' +
                (alt ? '<ele>' + alt + '</ele>' : '') +
                (time ? '<time>' + time + '</time>' : '') +
                '</trkpt>';

            lastTime = time;
            lastAlt = alt;
        }

        newGpx = newGpx + '</trkseg>';

        return newGpx;
    }

    public createGpxRoute(name: string, type: string, points: LatLngBase[], defaultPosition: LatLngTimeBase): string {
        if (!points || points.length <= 0) {
            return '';
        }

        let lastTime = defaultPosition && defaultPosition.time
            ? typeof defaultPosition.time === 'string'
                ? defaultPosition.time
                : defaultPosition.time.toISOString() // TODO use Zulu time
            : undefined;
        let lastAlt = defaultPosition && defaultPosition.alt !== 0
            ? defaultPosition.alt
            : undefined;

        let newGpx = '<rte><type>' + type + '</type><name>' + name + '</name>';
        for (let i = 0; i < points.length; i++) {
            const point = points[i];
            const time = point['time']
                ? typeof point['time'] === 'string'
                    ? point['time']
                    : point['time'].toISOString()
                : lastTime;
            const alt = point['alt']
                ? point['alt']
                : lastAlt;

            newGpx = newGpx + '<rtept lat="' + point.lat + '" lon="' + point.lng + '">' +
                (alt ? '<ele>' + alt + '</ele>' : '') +
                (time ? '<time>' + time + '</time>' : '') +
                '</rtept>';

            lastTime = time;
            lastAlt = alt;
        }

        newGpx = newGpx + '</rte>';

        return newGpx;
    }

    protected parseGpxDom(gpxDom: Document, options): GeoElementBase<T>[] {
        let j, i;
        let el: HTMLCollectionOf<Element>;
        const elements = [], tags = [['rte', 'rtept'], ['trkseg', 'trkpt']];

        for (j = 0; j < tags.length; j++) {
            el = gpxDom.getElementsByTagName(tags[j][0]);
            for (i = 0; i < el.length; i++) {
                const l = this.parseTrkSeg(el[i], gpxDom, tags[j][1]);
                if (!l) {
                    continue;
                }

                if (options.generateName) {
                    this.parseName(el[i], l);
                }

                elements.push(l);
            }
        }

        el = gpxDom.getElementsByTagName('wpt');
        if (options.display_wpt !== false) {
            for (i = 0; i < el.length; i++) {
                const waypoint = this.parseWpt(el[i], gpxDom);
                if (!waypoint) {
                    continue;
                }

                if (options.generateName) {
                    this.parseName(el[i], waypoint);
                }

                elements.push(waypoint);
            }
        }

        if (!elements.length) {
            return;
        }

        return elements;
    }

    protected parseName(gpxDom: Element, layer: GeoElementBase<T>): string {
        let i, el, txt = '', name, descr = '', link, len = 0;
        el = gpxDom.getElementsByTagName('name');
        if (el.length && el[0].childNodes && el[0].childNodes.length) {
            name = el[0].childNodes[0].nodeValue;
        }

        el = gpxDom.getElementsByTagName('desc');
        for (i = 0; i < el.length; i++) {
            if (!el[i].childNodes) {
                continue;
            }

            for (let j = 0; j < el[i].childNodes.length; j++) {
                descr = descr + el[i].childNodes[j].nodeValue;
            }
        }

        el = gpxDom.getElementsByTagName('link');
        if (el.length) {
            link = el[0].getAttribute('href');
        }

        len = layer !== undefined ?
            this.polylineLen(layer.points)
            : undefined;

        if (name) {
            txt += '<h2>' + name + '</h2>' + descr;
        }

        if (len) {
            txt += '<p>' + this.humanLen(len) + '</p>';
        }

        if (link) {
            txt += '<p><a target="_blank" href="' + link + '">[...]</a></p>';
        }

        layer.name = txt;

        return txt;
    }

    protected parseTrkSeg(line: Element, gpxDom: Document, tag: string): GeoElementBase<T> {
        const el = line.getElementsByTagName(tag);
        if (!el.length) {
            return;
        }

        const coords = [];
        for (let i = 0; i < el.length; i++) {
            const ptElement = el[i];
            const eleElement = ptElement.getElementsByTagName('ele');
            const timeElement = ptElement.getElementsByTagName('time');

            let ele;
            let time;

            if (eleElement && eleElement.length > 0 && eleElement[0].childNodes.length) {
                ele = eleElement[0].childNodes[0].nodeValue;
            }

            if (timeElement && timeElement.length > 0 && timeElement[0].childNodes.length) {
                time = DateUtils.parseDate(timeElement[0].childNodes[0].nodeValue);  // HINT Date is ISO with ZULU-Time
            }

            coords.push(
                this.createLatLng(ptElement.getAttribute('lat'), ptElement.getAttribute('lon'), ele, time));
        }

        const typeEl = gpxDom.getElementsByTagName('type');
        let type = tag === 'trkpt'
            ? GeoElementType.TRACK
            : GeoElementType.ROUTE;
        if (typeEl.length && typeEl[0].childNodes[0].nodeValue === 'AREA') {
            type = GeoElementType.AREA;
        }

        return this.createGeoElement(type, coords, undefined);
    }

    protected parseWpt(e, gpxDom): GeoElementBase<T> {
        return this.createGeoElement(GeoElementType.WAYPOINT,
            [this.createLatLng(e.getAttribute('lat'), e.getAttribute('lon'))], undefined);
    }

    protected abstract parseDomFromString(xml: string): Document;

    protected abstract createGeoElement(type: GeoElementType, points: T[], name: string): GeoElementBase<T>;

    protected abstract createLatLng(lat: number|string, lng: number|string, alt?: number, time?: Date): T;
}
