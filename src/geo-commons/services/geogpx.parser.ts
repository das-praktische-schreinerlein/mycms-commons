import {AbstractGeoParser} from './geo.parser';
import {DateUtils} from '../../commons/utils/date.utils';
import {GeoGpxUtils} from './geogpx.utils';
import {GeoElementBase, GeoElementType, LatLngBase} from '../model/geoElementTypes';

export abstract class AbstractGeoGpxParser<T extends LatLngBase> extends AbstractGeoParser<T> {
    constructor(protected geoGpxUtils?: GeoGpxUtils) {
        super();
        if (!geoGpxUtils) {
            this.geoGpxUtils = new GeoGpxUtils();
        }
    }

    public parse(xml: string, options): GeoElementBase<T>[] {
        if (!xml) {
            console.error('cant parse GeoGpxParser: empty');
            return;
        }

        xml = this.geoGpxUtils.fixXml(xml);
        if (!(xml.startsWith('<?xml'))) {
            console.error('cant parse GeoGpxParser: no valid xml');
            return;
        }

        const gpxDom: Document = this.parseDomFromString(xml);
        if (gpxDom.getElementsByTagName('parsererror').length > 0) {
            console.error('cant parse GeoGpxParser: parsererror', gpxDom.getElementsByTagName('parsererror')[0]);
            return;
        }

        const elements = this.parseGpxDom(gpxDom, options);
        if (!elements) {
            return;
        }

        return elements;
    }

    protected parseGpxDom(gpxDom: Document, options): GeoElementBase<T>[] {
        let j, i;
        let el: NodeListOf<Element>;
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
                time = DateUtils.parseDate(
                    timeElement[0].childNodes[0].nodeValue);
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

        return this.createGeoElement(type, coords, name);
    }

    protected parseWpt(e, gpxDom): GeoElementBase<T> {
        return this.createGeoElement(GeoElementType.WAYPOINT,
            [this.createLatLng(e.getAttribute('lat'), e.getAttribute('lon'))], undefined);
    }

    protected abstract parseDomFromString(xml: string): Document;

    protected abstract createGeoElement(type: GeoElementType, points: T[], name: string): GeoElementBase<T>;

    protected abstract createLatLng(lat: number|string, lng: number|string, alt?: number, time?: Date): T;
}
