import {GeoElementBase, LatLngBase} from '../model/geoElementTypes';

export abstract class AbstractGeoParser<T extends LatLngBase>  {
    abstract parse(src: string, options): GeoElementBase<T>[];

    protected humanLen(l) {
        if (l < 2000) {
            return l.toFixed(0) + ' m';
        } else {
            return (l / 1000).toFixed(1) + ' km';
        }
    }

    protected polylineLen(ll: T[]) {
        let d = 0, p = null;
        for (let i = 0; i < ll.length; i++) {
            if (i && p) {
                d += p.distanceTo(ll[i]);
            }

            p = ll[i];
        }
        return d;
    }
}
