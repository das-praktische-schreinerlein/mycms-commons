import {BaseMediaMetaRecord} from './basemediameta-record';

describe('BaseMediaMetaRecord', () => {
    it('should create an instance', () => {
        expect(new BaseMediaMetaRecord()).toBeTruthy();
    });

    it('should accept values in the constructor', () => {
        const mdoc = new BaseMediaMetaRecord({
            dur: 5.0
        });
        expect(mdoc.dur).toEqual(5.0);
    });
});
