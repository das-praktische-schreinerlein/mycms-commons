/* tslint:disable:no-unused-variable */
import {SqlQueryBuilder} from '../../search-commons/services/sql-query.builder';
import {TestHelper} from '../../testing/test-helper';
import {CommonSqlActionTagRateAdapter} from './common-sql-actiontag-rate.adapter';
import {CommonSqlRateAdapter, RateModelConfigType} from '../actions/common-sql-rate.adapter';
import {TestActionFormHelper} from '../testing/test-actionform-helper';
import {DateUtils} from '../../commons/utils/date.utils';

describe('CommonDocSqlActionTagRateAdapter', () => {
    const modelConfigType: RateModelConfigType = {
        tables: {
            'image': {
                fieldId: 'i_id',
                table: 'image',
                rateFields: {
                    'gesamt': 'i_rate',
                    'motive': 'i_rate_motive',
                    'wichtigkeit': 'i_rate_wichtigkeit'
                },
                fieldSum: 'i_rate'
            },
            'imagewithchangelog': {
                fieldId: 'i_id',
                table: 'image',
                rateFields: {
                    'gesamt': 'i_rate',
                    'motive': 'i_rate_motive',
                    'wichtigkeit': 'i_rate_wichtigkeit'
                },
                fieldSum: 'i_rate',
                changelogConfig: {
                    createDateField: 'imgcreated',
                    updateDateField: 'imgupdated'
                }
            }
        }
    };

    const sqlQueryBuilder: SqlQueryBuilder = new SqlQueryBuilder();
    const localTestHelper = {
        createService: function (knex) {
            const config = {
                knexOpts: {
                    client: knex.client.config.client
                }
            };

            return new CommonSqlActionTagRateAdapter(
                new CommonSqlRateAdapter(config, knex, sqlQueryBuilder, modelConfigType));
        }
    };


    describe('test defaults', () => {
        const knex = TestHelper.createKnex('mysql', []);
        const service: CommonSqlActionTagRateAdapter = localTestHelper.createService(knex);

        it('should created', done => {
            // WHEN/THEN
            expect(service).toBeTruthy();
            done();
        });

        it('executeActionTagPlaylist should error on no payload', done => {
            TestActionFormHelper.doActionTagTestInvalidPayloadTest(knex, service, 'executeActionTagRate', 'rate' , done);
        });

        it('executeActionTagPlaylist should error on invalid id', done => {
            TestActionFormHelper.doActionTagTestInvalidIdTest(knex, service, 'executeActionTagRate', 'rate', done);
        });

        it('executeActionTagPlaylist should error on unknown table', done => {
            TestActionFormHelper.doActionTagFailInvalidTableTest(knex, service, 'executeActionTagRate', 'rate',
                {
                    ratekey: 'gesamt',
                    value: 1,
                }, 'setRates: unknowntable - table not valid', done);
        });

        it('executeActionTagRate should reject ratekey', done => {
            const id: any = 5;
            return TestActionFormHelper.doActionTagFailTest(knex, service, 'executeActionTagRate', 'image', id, {
                payload: {
                    ratekey: 'unknownRateKey',
                    value: 15,
                },
                deletes: false,
                key: 'rate',
                recordId: id,
                type: 'tag'
            }, 'setRates: image - rateKey not valid', done);
        });

        it('executeActionTagRate should reject rate', done => {
            const id: any = 5;
            const rate: any = 'a';
            return TestActionFormHelper.doActionTagFailTest(knex, service, 'executeActionTagRate', 'image', id, {
                payload: {
                    ratekey: 'gesamt',
                    value: rate,
                },
                deletes: false,
                key: 'rate',
                recordId: id,
                type: 'tag'
            }, 'actiontag rate rate not valid', done);
        });
    });

    describe('#executeActionTagRate()', () => {
        const knex = TestHelper.createKnex('mysql', []);
        const service: CommonSqlActionTagRateAdapter = localTestHelper.createService(knex);

        it('executeActionTagRate should set gesamt', done => {
            const id: any = 5;
            TestActionFormHelper.doActionTagTestSuccessTest(knex, service, 'executeActionTagRate', 'image', id, {
                    payload: {
                        ratekey: 'gesamt',
                        value: 15,
                    },
                    deletes: false,
                    key: 'rate',
                    recordId: id,
                    type: 'tag'
                },
                true,
                [
                    'UPDATE image SET'
                    + ' i_rate=GREATEST(COALESCE(-1, -1), ?),'
                    + ' i_rate=GREATEST(COALESCE(i_rate, -1), COALESCE(i_rate_motive, -1), COALESCE(i_rate_wichtigkeit, -1))'
                    + '  WHERE i_id = ?'
                ],
                [
                    [15, 5]
                ],
                done);
        });

        it('executeActionTagRate should set motive', done => {
            const id: any = 5;
            TestActionFormHelper.doActionTagTestSuccessTest(knex, service, 'executeActionTagRate', 'image', id, {
                    payload: {
                        ratekey: 'motive',
                        value: 15,
                    },
                    deletes: false,
                    key: 'rate',
                    recordId: id,
                    type: 'tag'
                },
                true,
                [
                    'UPDATE image SET'
                    + ' i_rate_motive=GREATEST(COALESCE(-1, -1), ?),'
                    + ' i_rate=GREATEST(COALESCE(i_rate, -1), COALESCE(i_rate_motive, -1), COALESCE(i_rate_wichtigkeit, -1))'
                    + '  WHERE i_id = ?'
                ],
                [
                    [15, 5]
                ],
                done);
        });

        it('executeActionTagRate should set gesamt with changelog', done => {
            const id: any = 5;
            TestActionFormHelper.doActionTagTestSuccessTest(knex, service, 'executeActionTagRate', 'imagewithchangelog', id, {
                    payload: {
                        ratekey: 'gesamt',
                        value: 15,
                    },
                    deletes: false,
                    key: 'rate',
                    recordId: id,
                    type: 'tag'
                },
                true,
                [
                    'UPDATE image SET'
                    + ' i_rate=GREATEST(COALESCE(-1, -1), ?),'
                    + ' i_rate=GREATEST(COALESCE(i_rate, -1), COALESCE(i_rate_motive, -1), COALESCE(i_rate_wichtigkeit, -1))'
                    + '  WHERE i_id = ?',
                    'UPDATE image SET imgupdated=? WHERE i_id=?'
                ],
                [
                    [15, 5],
                    // TODO fingers crossed for a fast computer ;-)
                    [DateUtils.dateToLocalISOString(new Date()), 5]
                ],
                done);
        });
    });
});
