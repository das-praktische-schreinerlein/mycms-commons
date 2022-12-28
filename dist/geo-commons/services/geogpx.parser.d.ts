import { AbstractGeoParser } from './geo.parser';
import { GeoGpxUtils } from './geogpx.utils';
import { GeoElementBase, GeoElementType, LatLngBase, LatLngTimeBase } from '../model/geoElementTypes';
export declare abstract class AbstractGeoGpxParser<T extends LatLngBase> extends AbstractGeoParser<T> {
    protected geoGpxUtils?: GeoGpxUtils;
    constructor(geoGpxUtils?: GeoGpxUtils);
    parse(xml: string, options: any): GeoElementBase<T>[];
    createGpxTrack(name: string, type: string, segments: string[]): string;
    createGpxTrackSegment(points: LatLngBase[], defaultPosition: LatLngTimeBase): string;
    createGpxRoute(name: string, type: string, points: LatLngBase[], defaultPosition: LatLngTimeBase): string;
    protected parseGpxDom(gpxDom: Document, options: any): GeoElementBase<T>[];
    protected parseName(gpxDom: Element, layer: GeoElementBase<T>): string;
    protected parseTrkSeg(line: Element, gpxDom: Document, tag: string): GeoElementBase<T>;
    protected parseWpt(e: any, gpxDom: any): GeoElementBase<T>;
    protected abstract parseDomFromString(xml: string): Document;
    protected abstract createGeoElement(type: GeoElementType, points: T[], name: string): GeoElementBase<T>;
    protected abstract createLatLng(lat: number | string, lng: number | string, alt?: number, time?: Date): T;
}
