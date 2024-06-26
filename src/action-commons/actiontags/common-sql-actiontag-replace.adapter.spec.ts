/* tslint:disable:no-unused-variable */
import {SqlQueryBuilder} from '../../search-commons/services/sql-query.builder';
import {TestHelper} from '../../testing/test-helper';
import {ActionTagReplaceConfigType, CommonSqlActionTagReplaceAdapter} from './common-sql-actiontag-replace.adapter';
import {TestActionFormHelper} from '../testing/test-actionform-helper';
import {DateUtils} from '../../commons/utils/date.utils';

describe('CommonDocSqlActionTagReplaceAdapter', () => {
    const sqlQueryBuilder: SqlQueryBuilder = new SqlQueryBuilder();
    const modelConfigType: ActionTagReplaceConfigType = {
        tables: {
            'image': {
                table: 'image',
                fieldId: 'i_id',
                referenced: [],
                joins: [
                    {table: 'image_object', fieldReference: 'i_id'},
                    {table: 'image_playlist', fieldReference: 'i_id'},
                    {table: 'image_keyword', fieldReference: 'i_id'}
                ]
            },
            'track': {
                table: 'kategorie',
                fieldId: 'k_id',
                referenced: [
                    { table: 'image', fieldReference: 'k_id' ,
                        changelogConfig: {
                            createDateField: 'icreated',
                            updateDateField: 'iupdated',
                            updateVersionField: 'iupdateversion'
                        }
                    },
                    { table: 'tour', fieldReference: 'k_id' ,
                        changelogConfig: {
                            createDateField: 'rtecreated',
                            updateDateField: 'rteupdated'
                        }
                    }
                ],
                joins: [
                    { table: 'kategorie_keyword', fieldReference: 'k_id' },
                    { table: 'kategorie_tour', fieldReference: 'k_id' }
                ],
                changelogConfig: {
                    createDateField: 'trkcreated',
                    updateDateField: 'trkupdated',
                    updateVersionField: 'trkupdateversion'
                }

            }
        }
    };
    const localTestHelper = {
        createService: function (knex) {
            const config = {
                knexOpts: {
                    client: knex.client.config.client
                }
            };

            return new CommonSqlActionTagReplaceAdapter(config, knex, sqlQueryBuilder, modelConfigType);
        }
    };


    describe('test defaults', () => {
        const knex = TestHelper.createKnex('mysql', []);
        const service: CommonSqlActionTagReplaceAdapter = localTestHelper.createService(knex);

        it('should created', done => {
            // WHEN/THEN
            expect(service).toBeTruthy();
            done();
        });

        it('executeActionTagReplace should error on no payload', done => {
            TestActionFormHelper.doActionTagTestInvalidPayloadTest(knex, service, 'executeActionTagReplace', 'replace' , done);
        });

        it('executeActionTagReplace should error on unknown table', done => {
            TestActionFormHelper.doActionTagFailInvalidTableTest(knex, service, 'executeActionTagReplace', 'replace',
                {
                    newId: '10',
                    newIdSetNull: false
                }, undefined, done);
        });

        it('executeActionTagReplace should error on invalid id', done => {
            TestActionFormHelper.doActionTagTestInvalidIdTest(knex, service, 'executeActionTagReplace', 'replace', done);
        });

        it('executeActionTagReplace should reject: invalid newId', done => {
            const id: any = 5;
            const newId: any = 'a*';
            return TestActionFormHelper.doActionTagFailTest(knex, service, 'executeActionTagReplace', 'image', id, {
                payload: {
                    newId: newId,
                    newIdSetNull: false
                },
                deletes: false,
                key: 'replace',
                recordId: id,
                type: 'tag'
            }, 'actiontag replace newId not valid', done);
        });

        it('executeActionTagReplace should reject: newId must be null if newIdSetNull', done => {
            const id: any = 5;
            const newId: any = '10';
            return TestActionFormHelper.doActionTagFailTest(knex, service, 'executeActionTagReplace', 'image', id, {
                payload: {
                    newId: newId,
                    newIdSetNull: true
                },
                deletes: false,
                key: 'replace',
                recordId: id,
                type: 'tag'
            }, 'actiontag replace newId must be null if newIdSetNull', done);
        });

        it('executeActionTagReplace should reject: newId must integer', done => {
            const id: any = 5;
            const newId: any = 'a';
            return TestActionFormHelper.doActionTagFailTest(knex, service, 'executeActionTagReplace', 'image', id, {
                payload: {
                    newId: newId,
                    newIdSetNull: false
                },
                deletes: false,
                key: 'replace',
                recordId: id,
                type: 'tag'
            }, 'actiontag replace newId must be integer', done);
        });
    });

    describe('#executeActionTagReplace()', () => {
        const knex = TestHelper.createKnex('mysql', []);
        const service: CommonSqlActionTagReplaceAdapter = localTestHelper.createService(knex);

        it('executeActionTagReplace should set newId', done => {
            const id: any = 5;
            const newId: any = '10';
            TestActionFormHelper.doActionTagTestSuccessTest(knex, service, 'executeActionTagReplace', 'image', id, {
                    payload: {
                        newId: newId,
                        newIdSetNull: false
                    },
                    deletes: false,
                    key: 'replace',
                    recordId: id,
                    type: 'tag'
                },
                true,
                [
                    'SELECT i_id AS id FROM image WHERE i_id=?',
                    'SELECT i_id AS id FROM image WHERE i_id=?',
                    'UPDATE image_object SET i_id=? WHERE i_id=?',
                    'UPDATE image_playlist SET i_id=? WHERE i_id=?',
                    'UPDATE image_keyword SET i_id=? WHERE i_id=?',
                    'DELETE FROM image WHERE i_id=?'
                ],
                [
                    [5],
                    [10],
                    [10, 5],
                    [10, 5],
                    [10, 5],
                    [5]
                ],
                done,
                [
                    [[{id: 5}]],
                    [[{id: 10}]]
                ]);
        });

        it('executeActionTagReplace should set newId null', done => {
            const id: any = 5;
            const newId: any = null;
            TestActionFormHelper.doActionTagTestSuccessTest(knex, service, 'executeActionTagReplace', 'image', id, {
                    payload: {
                        newId: newId,
                        newIdSetNull: true
                    },
                    deletes: false,
                    key: 'replace',
                    recordId: id,
                    type: 'tag'
                },
                true,
                [
                    'SELECT i_id AS id FROM image WHERE i_id=?',
                    'SELECT null AS id',
                    'DELETE FROM image_object WHERE i_id=?',
                    'DELETE FROM image_playlist WHERE i_id=?',
                    'DELETE FROM image_keyword WHERE i_id=?',
                    'DELETE FROM image WHERE i_id=?'
                ],
                [
                    [5],
                    [],
                    [5],
                    [5],
                    [5],
                    [5]
                ],
                done,
                [
                    [[{id: 5}]],
                    [[{id: null}]]
                ]);
        });

        it('executeActionTagReplace should reject: id not exists', done => {
            const id: any = 5;
            const newId: any = '10';
            TestActionFormHelper.doActionTagTestFailWithSqlsTest(knex, service, 'executeActionTagReplace', 'image', id, {
                    payload: {
                        newId: newId,
                        newIdSetNull: false
                    },
                    deletes: false,
                    key: 'replace',
                    recordId: id,
                    type: 'tag'
                },
                '_doActionTag replace image failed: id not found ' + id,
                [
                    'SELECT i_id AS id FROM image WHERE i_id=?'
                ],
                [
                    [5]
                ],
                done,
                [
                    [[]]
                ]);
        });

        it('executeActionTagReplace should reject: newId not exists', done => {
            const id: any = 5;
            const newId: any = '10';
            TestActionFormHelper.doActionTagTestFailWithSqlsTest(knex, service, 'executeActionTagReplace', 'image', id, {
                    payload: {
                        newId: newId,
                        newIdSetNull: false
                    },
                    deletes: false,
                    key: 'replace',
                    recordId: id,
                    type: 'tag'
                },
                '_doActionTag replace image failed: newId not found ' + newId,
                [
                    'SELECT i_id AS id FROM image WHERE i_id=?',
                    'SELECT i_id AS id FROM image WHERE i_id=?'
                ],
                [
                    [5],
                    [10]
                ],
                done,
                [
                    [[{id: 5}]],
                    [[]]
                ]);
        });

        it('executeActionTagReplace should set newId with changelog', done => {
            const id: any = 5;
            const newId: any = '10';
            TestActionFormHelper.doActionTagTestSuccessTest(knex, service, 'executeActionTagReplace', 'track', id, {
                    payload: {
                        newId: newId,
                        newIdSetNull: false
                    },
                    deletes: false,
                    key: 'replace',
                    recordId: id,
                    type: 'tag'
                },
                true,
                [
                    'SELECT k_id AS id FROM kategorie WHERE k_id=?',
                    'SELECT k_id AS id FROM kategorie WHERE k_id=?',
                    'UPDATE image SET iupdated=?, iupdateversion=COALESCE(iupdateversion, 0)+1 WHERE k_id=?',
                    'UPDATE tour SET rteupdated=? WHERE k_id=?',
                    'UPDATE image SET k_id=? WHERE k_id=?',
                    'UPDATE tour SET k_id=? WHERE k_id=?',
                    'UPDATE kategorie_keyword SET k_id=? WHERE k_id=?',
                    'UPDATE kategorie_tour SET k_id=? WHERE k_id=?',
                    'UPDATE kategorie SET trkupdated=?, trkupdateversion=COALESCE(trkupdateversion, 0)+1 WHERE k_id=?',
                    'DELETE FROM kategorie WHERE k_id=?'
                ],
                [
                    [5],
                    [10],
                    [DateUtils.dateToLocalISOString(new Date()), 5],
                    [DateUtils.dateToLocalISOString(new Date()), 5],
                    [10, 5],
                    [10, 5],
                    [10, 5],
                    [10, 5],
                    // TODO fingers crossed for a fast computer ;-)
                    [DateUtils.dateToLocalISOString(new Date()), 10],
                    [5]
                ],
                done,
                [
                    [[{id: 5}]],
                    [[{id: 10}]]
                ]);
        });

        it('executeActionTagReplace should set newId null with changelog', done => {
            const id: any = 5;
            const newId: any = null;
            TestActionFormHelper.doActionTagTestSuccessTest(knex, service, 'executeActionTagReplace', 'track', id, {
                    payload: {
                        newId: newId,
                        newIdSetNull: true
                    },
                    deletes: false,
                    key: 'replace',
                    recordId: id,
                    type: 'tag'
                },
                true,
                [
                    'SELECT k_id AS id FROM kategorie WHERE k_id=?',
                    'SELECT null AS id',
                    'UPDATE image SET iupdated=?, iupdateversion=COALESCE(iupdateversion, 0)+1 WHERE k_id=?',
                    'UPDATE tour SET rteupdated=? WHERE k_id=?',
                    'UPDATE image SET k_id=null WHERE k_id=?',
                    'UPDATE tour SET k_id=null WHERE k_id=?',
                    'DELETE FROM kategorie_keyword WHERE k_id=?',
                    'DELETE FROM kategorie_tour WHERE k_id=?',
                    'DELETE FROM kategorie WHERE k_id=?'
                ],
                [
                    [5],
                    [],
                    // TODO fingers crossed for a fast computer ;-)
                    [DateUtils.dateToLocalISOString(new Date()), 5],
                    [DateUtils.dateToLocalISOString(new Date()), 5],
                    [5],
                    [5],
                    [5],
                    [5],
                    [5]
                ],
                done,
                [
                    [[{id: 5}]],
                    [[{id: null}]]
                ]);
        });

    });
});
