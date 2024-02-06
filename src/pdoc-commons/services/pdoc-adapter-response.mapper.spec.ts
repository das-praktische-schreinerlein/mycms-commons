/* tslint:disable:no-unused-variable */
import {PDocRecord, PDocRecordRelation} from '../model/records/pdoc-record';
import {PDocAdapterResponseMapper} from './pdoc-adapter-response.mapper';
import {Mapper} from 'js-data';
import {PDocDataStore} from './pdoc-data.store';
import {SearchParameterUtils} from '../../search-commons/services/searchparameter.utils';
import {PDocRecordSchema} from '../model/schemas/pdoc-record-schema';
import {PDocSqlConfig} from './pdoc-sql.config';

describe('PDocAdapterResponseMapper', () => {
    let datastore: PDocDataStore;
    let mapper: Mapper;
    let service: PDocAdapterResponseMapper;
    const config =  {
        mapperConfig: {
            allowedKeywordPatterns: [],
            replaceKeywordPatterns: []
        }
    };

    beforeEach(() => {
        datastore = new PDocDataStore(new SearchParameterUtils());
        service = new PDocAdapterResponseMapper(config);
        datastore.defineMapper('pdoc', PDocRecord, PDocRecordSchema, PDocRecordRelation);
        mapper = datastore.getMapper('pdoc');
    });

    it('should ...', done => {
        // WHEN/THEN
        expect(service).toBeTruthy();
        done();
    });

    describe('#mapValuesToRecord()', () => {
        it('mapValuesToRecord database kategorie', done => {
            // WHEN http://localhost:4100/api/v1/de/pdoc/TRACK_9 with PDocSqlMytbDbAdapter
            const sqlSrcValues = {
                'type': 'TRACK',
                'pg_type': 4,
                'id': 'TRACK_9',
                'pg_id': 9,
                'pg_name': 'Ausflug Liepnitzsee 01.01.2000',
                'html': 'Ausflug Liepnitzsee 01.01.2000 Jetzt ist wirklich Frühling.',
                'pg_dateshow': '2000-01-01T22:00:00.000Z',
                'pg_descmd': 'Jetzt ist wirklich Frühling und damit Zeit für eine 2h Wassertretertour auf dem Liepnitzsee.',
                'pg_flags': 'flg_ShowStart, flg_ShowMenu'
            };
            const expected  = {
                'descMd': 'Jetzt ist wirklich Frühling und damit Zeit für eine 2h Wassertretertour auf dem Liepnitzsee.',
                'flags': 'flg_ShowStart, flg_ShowMenu',
                'name': 'Ausflug Liepnitzsee 01.01.2000',
                'type': 'TRACK',
                'id': 'TRACK_9'
            };
            const res = <PDocRecord>service.mapResponseDocument(mapper, sqlSrcValues,
                PDocSqlConfig.tableConfigs.page.fieldMapping);

            // THEN
            expect(JSON.stringify(res.toSerializableJsonObj(false), null, 2)).toEqual(JSON.stringify(expected, null, 2));

            done();
        });

        it('mapValuesToRecord solr-data track', done => {
            // WHEN http://localhost:4100/api/v1/de/pdoc/TRACK_9 with PDocSolrAdapter
            const sqlSrcValues = {
                'desc_md_txt': [
                    'Jetzt ist wirklich Frühling und damit Zeit für eine 2h Wassertretertour auf dem Liepnitzsee.'
                ],
                'type_s': 'TRACK',
                'id': 'TRACK_9',
                'flags_s': [
                    'flg_ShowStart,flg_ShowMenu'
                ],
                'name_s': 'Ausflug Liepnitzsee 01.01.2000',
                'track_id_i': 9,
                'dateshow_dt': '2000-01-01T00:00:00Z',
            };
            const expected  = {
                'dateshow': '2000-01-01T01:00:00',
                'descMd': 'Jetzt ist wirklich Frühling und damit Zeit für eine 2h Wassertretertour auf dem Liepnitzsee.',
                'flags': 'flg_ShowStart,flg_ShowMenu',
                'name': 'Ausflug Liepnitzsee 01.01.2000',
                'type': 'TRACK',
                'id': 'TRACK_9'
            };
            const res = <PDocRecord>service.mapResponseDocument(mapper, sqlSrcValues, {});

            // THEN
            expect(JSON.stringify(res.toSerializableJsonObj(false), null, 2)).toEqual(JSON.stringify(expected, null, 2));

            done();
        });
    });
});
