/* tslint:disable:no-unused-variable */
import {PDocRecord} from '../model/records/pdoc-record';
import {PDocDataService} from './pdoc-data.service';
import {forkJoin, from} from 'rxjs';
import {PDocDataStore} from './pdoc-data.store';
import {SearchParameterUtils} from '../../search-commons/services/searchparameter.utils';

describe('PDocDataService', () => {
    let pDoc1: PDocRecord = undefined;
    let pDoc2: PDocRecord = undefined;
    let service: PDocDataService;
    let datastore: PDocDataStore;

    beforeEach(() => {
        datastore = new PDocDataStore(new SearchParameterUtils());
        service = new PDocDataService(datastore);
        service.setWritable(true);
        pDoc1 = new PDocRecord({desc: '', name: 'TestpDoc1', id: '1', langkeys: 'lang_de, lang_en', profiles: 'profile_dev, profile_import', key: 'key1'});
        pDoc2 = new PDocRecord({desc: '', name: 'TestpDoc2', id: '2', langkeys: 'lang_de, lang_en', profiles: 'profile_dev, profile_import', key: 'key1'});
    });

    it('should ...', done => {
        // WHEN/THEN
        expect(service).toBeTruthy();
        done();
    });

    describe('#getAll()', () => {
        it('should return an empty array by default', done => {
            // WHEN
            from(service.getAll()).subscribe(
                pDocs => {
                    // THEN
                    expect(pDocs).toEqual([]);
                    done();
                },
                error => {
                    expect(error).toBeUndefined();
                    done();
                },
                () => {
                    done();
                }
            );
        });

        it('should return all pDocs', done => {
            // GIVEN
            forkJoin(
                service.addMany([pDoc1, pDoc2]),
                service.getAll()
            ).subscribe(
                results => {
                    // THEN: add PDocs
                    expect(results[0].toString()).toEqual([pDoc1, pDoc2].toString());
                    // THEN: get PDocs
                    expect(results[1].toString()).toEqual([pDoc1, pDoc2].toString());
                    done();
                },
                error => {
                    expect(error).toBeUndefined();
                    done();
                },
                () => {
                    done();
                }
            );
        });
    });
    describe('#save(record)', () => {

        it('should automatically assign an incrementing id', done => {
            // GIVEN
            forkJoin(
                service.addMany([pDoc1, pDoc2]),
                service.getById('1'),
                service.getById('2')
            ).subscribe(
                results => {
                    // THEN: add PDocs
                    expect(results[0].toString()).toEqual([pDoc1, pDoc2].toString());
                    // THEN: get PDocs
                    expect(results[1].toString()).toEqual(pDoc1.toString());
                    expect(results[2].toString()).toEqual(pDoc2.toString());
                    done();
                },
                error => {
                    expect(error).toBeUndefined();
                    done();
                },
                () => {
                    done();
                }
            );
        });

    });

    describe('#deleteById(id)', () => {

        it('should remove record with the corresponding id', done => {
            forkJoin(
                service.addMany([pDoc1, pDoc2]),
                service.getAll(),
                service.deleteById('1'),
                service.getAll(),
                service.deleteById('2'),
                service.getAll()
            ).subscribe(
                results => {
                    // THEN: add PDocs
                    expect(results[0].toString()).toEqual([pDoc1, pDoc2].toString());
                    expect(results[1].toString()).toEqual([pDoc1, pDoc2].toString());
                    // THEN: get PDocs
                    expect(results[2]).toEqual(pDoc1);
                    expect(results[3].toString()).toEqual([pDoc2].toString());
                    expect(results[4]).toEqual(pDoc2);
                    expect(results[5].toString()).toEqual([].toString());
                    done();
                },
                error => {
                    expect(error).toBeUndefined();
                    done();
                },
                () => {
                    done();
                }
            );
        });

        it('should not removing anything if record with corresponding id is not found', done => {
            forkJoin(
                service.addMany([pDoc1, pDoc2]),
                service.getAll(),
                service.deleteById('3'),
                service.getAll()
            ).subscribe(
                results => {
                    // THEN: add PDocs
                    expect(results[0].toString()).toEqual([pDoc1, pDoc2].toString());
                    expect(results[1].toString()).toEqual([pDoc1, pDoc2].toString());
                    // THEN: get PDocs
                    expect(results[2]).toEqual(undefined);
                    expect(results[3].toString()).toEqual([pDoc1, pDoc2].toString());
                    done();
                },
                error => {
                    expect(error).toBeUndefined();
                    done();
                },
                () => {
                    done();
                }
            );
        });

    });
    describe('#updateById(id, values)', () => {

        it('should return record with the corresponding id and updated data', done => {
            forkJoin(
                service.addMany([pDoc1, pDoc2]),
                service.getAll(),
                service.updateById('1', {
                    id: '1', name: 'new name', type: 'page', langkeys: 'lang_de, lang_en', profiles: 'profile_dev, profile_import', key: 'key1'
                }),
                service.getById('1')
            ).subscribe(
                results => {
                    // THEN: add PDocs
                    expect(results[0].toString()).toEqual([pDoc1, pDoc2].toString());
                    expect(results[1].toString()).toEqual([pDoc1, pDoc2].toString());
                    // THEN: get PDocs
                    expect(results[2].name).toEqual('new name');
                    expect(results[3].name).toEqual('new name');
                    done();
                },
                error => {
                    expect(error).toBeUndefined();
                    done();
                },
                () => {
                    done();
                }
            );
        });

        it('should return null if record is not found', done => {
            forkJoin(
                service.addMany([pDoc1, pDoc2]),
                service.getAll(),
                service.updateById('26', {
                    id: '26', name: 'new name', type: 'page', langkeys: 'lang_de, lang_en', profiles: 'profile_dev, profile_import', key: 'key1'
                }),
                service.getById('26')
            ).subscribe(
                results => {
                    // THEN: add PDocs
                    expect(results[0].toString()).toEqual([pDoc1, pDoc2].toString());
                    expect(results[1].toString()).toEqual([pDoc1, pDoc2].toString());
                    // THEN: get PDocs
                    expect(results[2]).toEqual(null);
                    expect(results[3]).toEqual(undefined);
                    done();
                },
                error => {
                    expect(error).toBeUndefined();
                    done();
                },
                () => {
                    done();
                }
            );
        });
    });
});
