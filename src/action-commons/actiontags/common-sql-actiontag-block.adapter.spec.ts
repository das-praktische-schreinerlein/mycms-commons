/* tslint:disable:no-unused-variable */
import {ActionTagBlockConfigType, CommonSqlActionTagBlockAdapter} from './common-sql-actiontag-block.adapter';
import {SqlQueryBuilder} from '../../search-commons/services/sql-query.builder';
import {TestHelper} from '../../testing/test-helper';
import {TestActionFormHelper} from '../testing/test-actionform-helper';

describe('CommonSqlActionTagBlockAdapter', () => {
    const sqlQueryBuilder: SqlQueryBuilder = new SqlQueryBuilder();
    const modelConfigType: ActionTagBlockConfigType = {
        tables: {
            'location': {
                table: 'location', idField: 'l_id', blockField: 'l_gesperrt'
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

            return new CommonSqlActionTagBlockAdapter(config, knex, sqlQueryBuilder, modelConfigType);
        }
    };


    describe('test defaults', () => {
        const knex = TestHelper.createKnex('mysql', []);
        const service: CommonSqlActionTagBlockAdapter = localTestHelper.createService(knex);

        it('should created', done => {
            // WHEN/THEN
            expect(service).toBeTruthy();
            done();
        });

        it('executeActionTagBlock should error on no payload', done => {
            TestActionFormHelper.doActionTagTestInvalidPayloadTest(knex, service, 'executeActionTagBlock', 'block' , done);
        });

        it('executeActionTagBlock should error on unknown table', done => {
            TestActionFormHelper.doActionTagFailInvalidTableTest(knex, service, 'executeActionTagBlock', 'blockd',
                {set: 1}, undefined, done);
        });

        it('executeActionTagBlock should error on invalid id', done => {
            TestActionFormHelper.doActionTagTestInvalidIdTest(knex, service, 'executeActionTagBlock', 'block', done);
        });
    });

    describe('#executeActionTagBlock()', () => {
        const knex = TestHelper.createKnex('mysql', []);
        const service: CommonSqlActionTagBlockAdapter = localTestHelper.createService(knex);

        it('executeActionTagBlock should set', done => {
            const id: any = 5;
            TestActionFormHelper.doActionTagTestSuccessTest(knex, service, 'executeActionTagBlock', 'location', id, {
                    payload: {
                        set: 1
                    },
                    deletes: false,
                    key: 'block',
                    recordId: id,
                    type: 'tag'
                },
                true,
                [
                    'UPDATE location SET l_gesperrt=?  WHERE l_id = ?'
                ],
                [
                    [1, 5]
                ],
                done);
        });

            it('executeActionTagBlock should set', done => {
                const id: any = 5;
                TestActionFormHelper.doActionTagTestSuccessTest(knex, service, 'executeActionTagBlock', 'location', id, {
                        payload: {
                            set: 1,
                            value: 5
                        },
                        deletes: false,
                        key: 'block',
                        recordId: id,
                        type: 'tag'
                    },
                    true,
                    [
                        'UPDATE location SET l_gesperrt=?  WHERE l_id = ?'
                    ],
                    [
                        [5, 5]
                    ],
                    done);
            });

            it('executeActionTagBlock should unset', done => {
            const id: any = 7;
            TestActionFormHelper.doActionTagTestSuccessTest(knex, service, 'executeActionTagBlock', 'location', id, {
                    payload: {
                        set: 0,
                        value: 5
                    },
                    deletes: false,
                    key: 'block',
                    recordId: id,
                    type: 'tag'
                },
                true,
                [
                    'UPDATE location SET l_gesperrt=?  WHERE l_id = ?'
                ],
                [
                    [0, 7]
                ],
                done);
        });
    });
});
