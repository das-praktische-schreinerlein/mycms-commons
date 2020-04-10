import { Observable } from 'rxjs/Observable';
export declare class GeoLocationService {
    private geoCoder;
    constructor();
    getCurrentPosition(): Observable<Position>;
    doReverseLookup(lat: any, lon: any): Promise<string>;
    doLocationSearch(selector: string, value: string): Promise<any>;
    private prepareResultList;
    private doSearch;
}
