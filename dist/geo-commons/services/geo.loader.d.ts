import { AbstractGeoParser } from './geo.parser';
import { MinimalHttpBackendClient } from '../../commons/services/minimal-http-backend-client';
import { GeoElementBase } from '../model/geoElementTypes';
export declare class CommonGeoLoader {
    private http;
    private parser;
    constructor(http: MinimalHttpBackendClient, parser: AbstractGeoParser<any>);
    loadDataFromUrl(url: string, options: any): Promise<GeoElementBase<any>[]>;
    loadData(src: string, options: any): Promise<GeoElementBase<any>[]>;
}
