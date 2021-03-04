/* tslint:disable:no-unused-variable */

/**
describe('GenericSqlAdapter', () => {
    let tdoc1: CommonDocRecord = undefined;
    let tdoc2: CommonDocRecord = undefined;
    let adapter: GenericSqlAdapter;
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
        const adapter = new GenericSqlAdapter(options, { active : false, entities: {}});
        adapter['knex'] = knex;

        return knex;
    }

    beforeEach(() => {
        tdoc1 = new CommonDocRecord({desc: '', name: 'Testtdoc1', persons: '', id: '1', type: 'image', subtype: '5'});
        tdoc2 = new CommonDocRecord({desc: '', name: 'Testtdoc2', persons: '', id: '2', type: 'image', subtype: '5'});
    });

    it('should ...', done => {
        // WHEN/THEN
        expect(adapter).toBeTruthy();g
        done();
    });

    describe('#search with adapter', () => {
        it('should return searchResult and correct sql', done => {
            const knexRes = addSqliteAdapter();
            knex.resetTestResults([
                [{id: '50', type: 'TRACK'}],
                [{id: '51', type: 'IMAGE'}],
                [{'COUNT( DISTINCT kategorie.k_id)': 1}]
            ]);
            Observable.forkJoin(
                adapter.search(adapter.newSearchForm({fulltext: 'bla', type: 'TRACK', sort: 'dateAsc', pageNum: 11, perPage: 12}))
            ).subscribe(
                results => {
                    // THEN: get Track
                    expect(results[0].recordCount).toEqual(1);
                    expect(JSON.stringify(results[0].currentRecords[0].toSerializableJsonObj())).toEqual(JSON.stringify(
                        {
                            'type': 'TRACK',
                            'id': '50',
                            'tdocimages': [{
                                'tdoc_id': '50',
                                'id': '5000000050' }
                            ],
                            'tdocvideos': [],
                            'tdocodimageobjects': [],
                            'tdocnavigationobjects': []}));
                    expect(knexRes.sqls[0]).toContain('where k_name || " " || COALESCE(k_meta_shortdesc,"", " ", l_name) LIKE "%bla%"' +
                        '  AND  ( "track"  IN ("TRACK"))' +
                        '   order by k_datevon ASC' +
                        ' limit 120, 12');
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
 **/
