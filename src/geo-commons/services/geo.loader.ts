import {AbstractGeoParser} from './geo.parser';
import {MinimalHttpBackendClient} from '../../commons/services/minimal-http-backend-client';
import {LogUtils} from '../../commons/utils/log.utils';
import {GeoElementBase} from '../model/geoElementTypes';

export class CommonGeoLoader {
    constructor(private http: MinimalHttpBackendClient, private parser: AbstractGeoParser<any>) {}

    loadDataFromUrl(url: string, options): Promise<GeoElementBase<any>[]> {
        const me = this;
        return new Promise<GeoElementBase<any>[]>((resolve, reject) => {
            me.http.makeHttpRequest({ method: 'get', url: url, withCredentials: true })
                .then(function onLoaded(res: any) {
                    return resolve(me.parser.parse(res.text(), options));
            }).catch(function onError(error: any) {
                    console.error('loading geofeature failed:' + LogUtils.sanitizeLogMsg(url), error);
                    return reject(error);
            });
        });
    }

    loadData(src: string, options): Promise<GeoElementBase<any>[]> {
        return new Promise<GeoElementBase<any>[]>((resolve) => {
            return resolve(this.parser.parse(src, options));
        });
    }

    isResponsibleForSrc(src: string): boolean {
        return this.parser.isResponsibleForSrc(src);
    }

    isResponsibleForFile(fileName: string): boolean {
        return this.parser.isResponsibleForFile(fileName);
    }
}
