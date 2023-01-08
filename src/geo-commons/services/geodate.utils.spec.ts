/* tslint:disable:no-unused-variable */
import {LatLngTimeBase} from '../model/geoElementTypes';
import {GeoDateUtils} from './geodate.utils';

describe('GeoDateUtils', () => {
    class LatLngTime implements LatLngTimeBase {
        alt: number;
        lat: number;
        lng: number;
        time: Date;
    }

    const service = new GeoDateUtils();

    it('getTimeOffsetToUtc', done => {
        let date: LatLngTime = {
            alt: 0,
            lat: 54.01712,
            lng: 13.23951,
            time: new Date(2022, 0, 1, 20, 0, 0)
        };
        expect(GeoDateUtils.getTimezone(date)).toEqual('Europe/Berlin');
        expect(GeoDateUtils.getTimeOffsetToUtc(date)).toEqual(1);

        date = {
            alt: 0,
            lat: 54.01712,
            lng: 13.23951,
            time: new Date(2022, 6, 1, 20, 0, 0)
        };
        expect(GeoDateUtils.getTimeOffsetToUtc(date)).toEqual(1);

        date = {
            alt: 0,
            lat: 37.72678,
            lng: -119.53334,
            time: new Date(2022, 6, 1, 20, 0, 0)
        };
        expect(GeoDateUtils.getTimezone(date)).toEqual('America/Los_Angeles');
        expect(GeoDateUtils.getTimeOffsetToUtc(date)).toEqual(-8);
        done();
    });
});
