import {GeoElementBase, LatLngBase} from '../model/geoElementTypes';
import {GeoFormatter} from './geo.formatter';

export abstract class AbstractGeoParser<T extends LatLngBase>  {
    abstract parse(src: string, options): GeoElementBase<T>[];

    protected humanLen(l) {
        return GeoFormatter.humanLen(l);
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
