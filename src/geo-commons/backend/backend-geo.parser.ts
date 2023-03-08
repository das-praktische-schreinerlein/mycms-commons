import {GeoElementType} from '../model/geoElementTypes';
import {AbstractGeoParser} from '../services/geo.parser';
import {AbstractGeoGpxParser} from '../services/geogpx.parser';
import {AbstractGeoJsonParser} from '../services/geojson.parser';
import {AbstractGeoTxtParser} from '../services/geotxt.parser';
import {BackendGeoElement, BackendLatLng, BackendLatLngTime} from './backend-geo.types';
import {DOMParser} from '@xmldom/xmldom';

export class BackendGeoUtils  {
    public static createLatLng(lat: string | number, lng: string | number, alt?: number, time?: Date): BackendLatLng {
        return time !== undefined
            ? <BackendLatLngTime> {
                lat: Number(lat),
                lng: Number(lng),
                alt: Number(alt),
                time: time}
            : alt !== undefined
                ? {
                    lat: Number(lat),
                    lng: Number(lng),
                    alt: Number(alt)
                }
                : {
                    lat: Number(lat),
                    lng: Number(lng),
                    alt: undefined
                };
    }

    public static createGeoElement(type: GeoElementType, points: BackendLatLng[], name: string): BackendGeoElement {
        return new BackendGeoElement(type, points, name);
    }

    public static calcDistance(from: BackendLatLng, to: BackendLatLng): number {
        return 0; // TODO do a calculation
    }
}

export interface BackendGeoParser extends AbstractGeoParser<BackendLatLng> {
}

export class BackendGeoGpxParser extends AbstractGeoGpxParser<BackendLatLng> implements BackendGeoParser {
    protected parseDomFromString(xml: string): Document {
        const oParser = new DOMParser();
        return oParser.parseFromString(xml, 'application/xml');
    }

    protected createLatLng(lat: string | number, lng: string | number, alt?: number, time?: Date): BackendLatLng {
        return BackendGeoUtils.createLatLng(lat, lng, alt, time);
    }

    protected createGeoElement(type: GeoElementType, points: BackendLatLng[], name: string): BackendGeoElement {
        return BackendGeoUtils.createGeoElement(type, points, name);
    }

    protected calcDistance(from: BackendLatLng, to: BackendLatLng): number {
        return BackendGeoUtils.calcDistance(from, to);
    }
}

export class BackendGeoTxtParser extends AbstractGeoTxtParser<BackendLatLng> implements BackendGeoParser {
    protected createLatLng(lat: string | number, lng: string | number, alt?: number, time?: Date): BackendLatLng {
        return BackendGeoUtils.createLatLng(lat, lng, alt, time);
    }

    protected createGeoElement(type: GeoElementType, points: BackendLatLng[], name: string): BackendGeoElement {
        return BackendGeoUtils.createGeoElement(type, points, name);
    }

    protected calcDistance(from: BackendLatLng, to: BackendLatLng): number {
        return BackendGeoUtils.calcDistance(from, to);
    }

}

export class BackendGeoJsonParser extends AbstractGeoJsonParser<BackendLatLng> implements BackendGeoParser {
    protected createLatLng(lat: string | number, lng: string | number, alt?: number, time?: Date): BackendLatLng {
        return BackendGeoUtils.createLatLng(lat, lng, alt, time);
    }

    protected createGeoElement(type: GeoElementType, points: BackendLatLng[], name: string): BackendGeoElement {
        return BackendGeoUtils.createGeoElement(type, points, name);
    }

    protected calcDistance(from: BackendLatLng, to: BackendLatLng): number {
        return BackendGeoUtils.calcDistance(from, to);
    }
}
