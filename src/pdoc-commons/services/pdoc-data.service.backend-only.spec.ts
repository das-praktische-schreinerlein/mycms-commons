/* tslint:disable:no-unused-variable */
import {PDocRecord} from '../model/records/pdoc-record';
import {PDocDataService} from './pdoc-data.service';
import {PDocDataStore} from './pdoc-data.store';
import {SearchParameterUtils} from '../../search-commons/services/searchparameter.utils';
import {TestHelper} from '../../testing/test-helper';
import {PDocSqlAdapter} from './pdoc-sql.adapter';

describe('PDocDataService', () => {
    let pdoc1: PDocRecord = undefined;
    let pdoc2: PDocRecord = undefined;
    let service: PDocDataService;
    let datastore: PDocDataStore;
    let knex;

    function addSqliteAdapter() {
        const options = {
            knexOpts: {
                'client': 'sqlite3',
                'connection': {
                    'filename': ':memory:'
                }
            },
            mapperConfig: {
                'allowedKeywordPatterns': ['KW_.*', 'TODO.*', 'Harry', 'Booga', 'Buddy', 'Micha', '.*'],
                'replaceKeywordPatterns': []
            }
        };
        knex = TestHelper.createKnex(options.knexOpts.client, []);
        const adapter = new PDocSqlAdapter(options, { active : false, entities: {}});
        adapter['knex'] = knex;
        datastore.setAdapter('http', adapter, '', {});

        return knex;
    }

    beforeEach(() => {
        datastore = new PDocDataStore(new SearchParameterUtils());
        service = new PDocDataService(datastore);
        service.setWritable(true);
        pdoc1 = new PDocRecord({desc: '', name: 'Testpdoc1', id: '1', type: 'image', subtype: '5'});
        pdoc2 = new PDocRecord({desc: '', name: 'Testpdoc2', id: '2', type: 'image', subtype: '5'});
    });

});
