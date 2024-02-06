/* tslint:disable:no-unused-variable */

import {SqlQueryBuilder} from '../../search-commons/services/sql-query.builder';
import {
    ActionTagAssignJoinConfigType,
    CommonSqlActionTagAssignJoinAdapter
} from './common-sql-actiontag-assignjoin.adapter';
import {TestHelper} from '../../testing/test-helper';
import {TestActionFormHelper} from '../testing/test-actionform-helper';
import {DateUtils} from '../../commons/utils/date.utils';

describe('CommonSqlActionTagAssignJoinAdapter', () => {
    const sqlQueryBuilder: SqlQueryBuilder = new SqlQueryBuilder();
    const modelConfigType: ActionTagAssignJoinConfigType = {
        tables: {
            'route': {
                table: 'route',
                idField: 't_id',
                references: {
                    'info_id_is': {
                        joinedTable: 'info',
                        joinedIdField: 'if_id',
                        joinTable: 'tour_info',
                        joinBaseIdField: 't_id',
                        joinReferenceField: 'if_id'
                    }
                }
            },
            'track': {
                table: 'kategorie',
                idField: 'k_id',
                references: {
                    'route_id_is': {
                        joinedTable: 'route',
                        joinedIdField: 't_id',
                        joinTable: 'kategorie_tour',
                        joinBaseIdField: 'k_id',
                        joinReferenceField: 't_id',
                        changelogConfig: {
                            createDateField: 'rtecreated',
                            updateDateField: 'rteupdated'
                        }

                    }
                },
                changelogConfig: {
                    createDateField: 'trkcreated',
                    updateDateField: 'trkupdated'
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

            return new CommonSqlActionTagAssignJoinAdapter(config, knex, sqlQueryBuilder, modelConfigType);
        }
    };


    describe('test defaults', () => {
        const knex = TestHelper.createKnex('mysql', []);
        const service: CommonSqlActionTagAssignJoinAdapter = localTestHelper.createService(knex);

        it('should created', done => {
            // WHEN/THEN
            expect(service).toBeTruthy();
            done();
        });

        it('executeActionTagAssignJoin should error on no payload', done => {
            TestActionFormHelper.doActionTagTestInvalidPayloadTest(knex, service, 'executeActionTagAssignJoin', 'assignjoin' , done);
        });

        it('executeActionTagAssignJoin should error on unknown table', done => {
            TestActionFormHelper.doActionTagFailInvalidTableTest(knex, service, 'executeActionTagAssignJoin', 'assignjoin',
                {
                    newId: '10',
                    referenceField: 'info_id_is'
                }, undefined, done);
        });

        it('executeActionTagAssignJoin should error on invalid id', done => {
            TestActionFormHelper.doActionTagTestInvalidIdTest(knex, service, 'executeActionTagAssignJoin', 'assignjoin', done);
        });

        it('executeActionTagAssignJoin should reject: invalid newId', done => {
            const id: any = 5;
            const newId: any = 'a*';
            return TestActionFormHelper.doActionTagFailTest(knex, service, 'executeActionTagAssignJoin', 'route', id, {
                payload: {
                    newId: newId,
                    referenceField: 'info_id_is'
                },
                deletes: false,
                key: 'assignjoin',
                recordId: id,
                type: 'tag'
            }, 'actiontag assignjoin newId not valid', done);
        });

        it('executeActionTagAssignJoin should reject: newId must integer', done => {
            const id: any = 5;
            const newId: any = 'a';
            return TestActionFormHelper.doActionTagFailTest(knex, service, 'executeActionTagAssignJoin', 'route', id, {
                payload: {
                    newId: newId,
                    referenceField: 'info_id_is'
                },
                deletes: false,
                key: 'assignjoin',
                recordId: id,
                type: 'tag'
            }, 'actiontag assignjoin newId must be integer', done);
        });

        it('executeActionTagAssignJoin should reject: invalid referenceField', done => {
            const id: any = 5;
            const newId: any = '10';
            return TestActionFormHelper.doActionTagFailTest(knex, service, 'executeActionTagAssignJoin', 'route', id, {
                payload: {
                    newId: newId,
                    referenceField: '*unknownReferenceField'
                },
                deletes: false,
                key: 'assignjoin',
                recordId: id,
                type: 'tag'
            }, 'actiontag assignjoin referenceField not valid', done);
        });

        it('executeActionTagAssignJoin should reject: unknown referenceField', done => {
            const id: any = 5;
            const newId: any = '10';
            return TestActionFormHelper.doActionTagFailTest(knex, service, 'executeActionTagAssignJoin', 'route', id, {
                payload: {
                    newId: newId,
                    referenceField: 'unknownReferenceField'
                },
                deletes: false,
                key: 'assignjoin',
                recordId: id,
                type: 'tag'
            },
                'actiontag assignjoin referenceField not exists', done);
        });

    });

    describe('#executeActionTagAssignJoin()', () => {
        const knex = TestHelper.createKnex('mysql', []);
        const service: CommonSqlActionTagAssignJoinAdapter = localTestHelper.createService(knex);

        it('executeActionTagAssignJoin should set newId', done => {
            const id: any = 5;
            const newId: any = '10';
            TestActionFormHelper.doActionTagTestSuccessTest(knex, service, 'executeActionTagAssignJoin', 'route', id, {
                    payload: {
                        newId: newId,
                        referenceField: 'info_id_is'
                    },
                    deletes: false,
                    key: 'assignjoin',
                    recordId: id,
                    type: 'tag'
                },
                true,
                [
                    'SELECT t_id AS id FROM route WHERE t_id=?',
                    'SELECT if_id AS id FROM info WHERE if_id=?',
                    'INSERT INTO tour_info (t_id, if_id) SELECT ?, ? WHERE NOT EXISTS    (SELECT t_id, if_id     FROM tour_info     WHERE t_id=? AND if_id=?)'
                ],
                [
                    [5],
                    [10],
                    [5, 10, 5, 10]
                ],
                done,
                [
                    [[{id: 5}]],
                    [[{id: 10}]]
                ]);
        });

        it('executeActionTagAssignJoin should reject: id not exists', done => {
            const id: any = 5;
            const newId: any = '10';
            TestActionFormHelper.doActionTagTestFailWithSqlsTest(knex, service, 'executeActionTagAssignJoin', 'route', id, {
                    payload: {
                        newId: newId,
                        referenceField: 'info_id_is'
                    },
                    deletes: false,
                    key: 'assignjoin',
                    recordId: id,
                    type: 'tag'
                },
                '_doActionTag assignjoin route failed: id not found ' + id,
                [
                    'SELECT t_id AS id FROM route WHERE t_id=?'
                ],
                [
                    [5]
                ],
                done,
                [
                    [[]]
                ]);
        });

        it('executeActionTagAssignJoin should reject: newId not exists', done => {
            const id: any = 5;
            const newId: any = '10';
            TestActionFormHelper.doActionTagTestFailWithSqlsTest(knex, service, 'executeActionTagAssignJoin', 'route', id, {
                    payload: {
                        newId: newId,
                        referenceField: 'info_id_is'
                    },
                    deletes: false,
                    key: 'assignjoin',
                    recordId: id,
                    type: 'tag'
                },
                '_doActionTag assignjoin route failed: newId not found ' + newId,
                [
                    'SELECT t_id AS id FROM route WHERE t_id=?',
                    'SELECT if_id AS id FROM info WHERE if_id=?'
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

        it('executeActionTagAssignJoin should set newId with changelog', done => {
            const id: any = 5;
            const newId: any = '10';
            TestActionFormHelper.doActionTagTestSuccessTest(knex, service, 'executeActionTagAssignJoin', 'track', id, {
                    payload: {
                        newId: newId,
                        referenceField: 'route_id_is'
                    },
                    deletes: false,
                    key: 'assignjoin',
                    recordId: id,
                    type: 'tag'
                },
                true,
                [
                    'SELECT k_id AS id FROM kategorie WHERE k_id=?',
                    'SELECT t_id AS id FROM route WHERE t_id=?',
                    'INSERT INTO kategorie_tour (k_id, t_id) SELECT ?, ? WHERE NOT EXISTS    (SELECT k_id, t_id     FROM kategorie_tour     WHERE k_id=? AND t_id=?)',
                    'UPDATE kategorie SET trkupdated=? WHERE k_id=?',
                    'UPDATE route SET rteupdated=? WHERE t_id=?'
                ],
                [
                    [5],
                    [10],
                    [5, 10, 5, 10],
                    // TODO fingers crossed for a fast computer ;-)
                    [DateUtils.dateToLocalISOString(new Date()), 5],
                    [DateUtils.dateToLocalISOString(new Date()), 10]
                ],
                done,
                [
                    [[{id: 5}]],
                    [[{id: 10}]]
                ]);
        });

    });
});
