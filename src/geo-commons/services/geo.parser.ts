import {GeoElementBase, LatLngBase} from '../model/geoElementTypes';
import {GeoFormatter} from './geo.formatter';

export abstract class AbstractGeoParser<T extends LatLngBase>  {
    abstract isResponsibleForSrc(src: string): boolean;

    abstract isResponsibleForFile(fileName: string): boolean;

    abstract parse(src: string, options): GeoElementBase<T>[];

    protected abstract calcDistance(from: T, to: T): number;

    protected humanLen(l) {
        return GeoFormatter.humanLen(l);
    }

    protected polylineLen(ll: T[]) {
        let d = 0, p = null;
        for (let i = 0; i < ll.length; i++) {
            if (i && p) {
                d += this.calcDistance(p, ll[i]);
            }

            p = ll[i];
        }

        return d;
    }

}
