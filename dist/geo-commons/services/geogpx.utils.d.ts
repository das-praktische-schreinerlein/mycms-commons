import { LatLngBase } from '../model/geoElementTypes';
export declare class GeoGpxUtils {
    fixXml(xml: string): string;
    fixXmlExtended(xml: string): string;
    reformatXml(xml: string): string;
    trimXml(xml: string): string;
    createNewRouteGpx(name: string, type: string, points: LatLngBase[]): string;
    deleteGpxTrackSegment(track: string, delSegIdx: number): string;
    mergeGpxTrackSegment(track: string, mergeSegIdx: number): string;
    mergeGpx(track1: string, track2: string): string;
}
