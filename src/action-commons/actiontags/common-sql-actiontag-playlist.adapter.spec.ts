/* tslint:disable:no-unused-variable */
import {SqlQueryBuilder} from '../../search-commons/services/sql-query.builder';
import {TestHelper} from '../../testing/test-helper';
import {CommonSqlActionTagPlaylistAdapter} from './common-sql-actiontag-playlist.adapter';
import {CommonSqlPlaylistAdapter, PlaylistModelConfigType} from '../actions/common-sql-playlist.adapter';
import {TestActionFormHelper} from '../testing/test-actionform-helper';

describe('CommonDocSqlActionTagPlaylistAdapter', () => {
    const modelConfigType: PlaylistModelConfigType = {
        table: 'playlist',
        fieldId: 'p_id',
        fieldName: 'p_name',
        joins: {
            'image': {
                table: 'image', joinTable: 'image_playlist', fieldReference: 'i_id'
            }
        }
    };

    const modelConfigTypeWithPosition: PlaylistModelConfigType = {
        table: 'playlist',
        fieldId: 'p_id',
        fieldName: 'p_name',
        joins: {
            'image': {
                table: 'image', joinTable: 'image_playlist', fieldReference: 'i_id', positionField: 'ip_pos'
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

            return new CommonSqlActionTagPlaylistAdapter(
                new CommonSqlPlaylistAdapter(config, knex, sqlQueryBuilder, modelConfigType));
        }
    };

    describe('test defaults', () => {
        const knex = TestHelper.createKnex('mysql', []);
        const service: CommonSqlActionTagPlaylistAdapter = localTestHelper.createService(knex);

        it('should created', done => {
            // WHEN/THEN
            expect(service).toBeTruthy();
            done();
        });

        it('executeActionTagPlaylist should error on no payload', done => {
            TestActionFormHelper.doActionTagTestInvalidPayloadTest(knex, service, 'executeActionTagPlaylist', 'playlist' , done);
        });

        it('executeActionTagPlaylist should error on invalid id', done => {
            TestActionFormHelper.doActionTagTestInvalidIdTest(knex, service, 'executeActionTagPlaylist', 'playlist', done);
        });

        it('executeActionTagPlaylist should error on unknown table', done => {
            TestActionFormHelper.doActionTagFailInvalidTableTest(knex, service, 'executeActionTagPlaylist', 'playlist',
                {
                    playlistkey: 'playlist',
                    set: 1,
                }, 'setPlaylists: unknowntable - table not valid', done);
        });


        it('executeActionTagPlaylist should reject playlist', done => {
            const id: any = 5;
            return TestActionFormHelper.doActionTagFailTest(knex, service, 'executeActionTagPlaylist', 'image', id, {
                payload: {
                    playlistkey: 'playlist??`"',
                    set: false,
                },
                deletes: false,
                key: 'playlist',
                recordId: id,
                type: 'tag'
            }, 'actiontag playlist playlists not valid', done);
        });
    });

    describe('#executeActionTagPlaylist()', () => {
        const knex = TestHelper.createKnex('mysql', []);
        const service: CommonSqlActionTagPlaylistAdapter = localTestHelper.createService(knex);

        it('executeActionTagPlaylist should set playlist', done => {
            const id: any = 5;
            TestActionFormHelper.doActionTagTestSuccessTest(knex, service, 'executeActionTagPlaylist', 'image', id, {
                    payload: {
                        playlistkey: 'playlist',
                        set: true,
                    },
                    deletes: false,
                    key: 'playlist',
                    recordId: id,
                    type: 'tag'
                },
                true,
                [
                    'DELETE FROM image_playlist'
                    + ' WHERE p_id IN     (SELECT p_id FROM playlist      WHERE p_name IN (?)) AND i_id = ?',
                    'INSERT INTO image_playlist (p_id, i_id)'
                    + ' SELECT p_id AS p_id,     ? AS i_id FROM playlist     WHERE p_name IN (?)'
                ],
                [
                    ['playlist', 5],
                    [5, 'playlist']
                ],
                done);
        });

        it('executeActionTagPlaylist should unset playlist', done => {
            const id: any = 5;
            TestActionFormHelper.doActionTagTestSuccessTest(knex, service, 'executeActionTagPlaylist', 'image', id, {
                    payload: {
                        playlistkey: 'playlist',
                        set: false,
                    },
                    deletes: false,
                    key: 'playlist',
                    recordId: id,
                    type: 'tag'
                },
                true,
                [
                    'DELETE FROM image_playlist'
                    + ' WHERE p_id IN     (SELECT p_id FROM playlist      WHERE p_name IN (?)) AND i_id = ?'
                ],
                [
                    ['playlist', 5]
                ],
                done);
        });

        const localTestHelperWithPosition = {
            createService: function (knex) {
                const config = {
                    knexOpts: {
                        client: knex.client.config.client
                    }
                };

                return new CommonSqlActionTagPlaylistAdapter(
                    new CommonSqlPlaylistAdapter(config, knex, sqlQueryBuilder, modelConfigTypeWithPosition));
            }
        };

        describe('#executeActionTagPlaylistWith() WithPosition', () => {
            const knex = TestHelper.createKnex('mysql', []);
            const service: CommonSqlActionTagPlaylistAdapter = localTestHelperWithPosition.createService(knex);

            it('executeActionTagPlaylist should set playlist WithPosition newPosition and oldPosition', done => {
                const id: any = 5;
                const oldPos = 11;
                const newPos = 111;
                TestActionFormHelper.doActionTagTestSuccessTest(knex, service, 'executeActionTagPlaylist', 'image', id, {
                        payload: {
                            playlistkey: 'playlist',
                            set: true,
                            position: newPos
                        },
                        deletes: false,
                        key: 'playlist',
                        recordId: id,
                        type: 'tag'
                    },
                    true,
                    [
                        'SELECT * FROM image_playlist INNER JOIN playlist ON playlist.p_id = image_playlist.p_id' +
                        ' WHERE image_playlist.p_id IN     (SELECT p_id FROM playlist      WHERE p_name IN (?)) AND i_id = ?',
                        'DELETE FROM image_playlist' +
                        ' WHERE p_id IN     (SELECT p_id FROM playlist      WHERE p_name IN (?)) AND i_id = ?',
                        'UPDATE image_playlist SET ip_pos = ip_pos - 1' +
                        ' WHERE p_id IN     (SELECT p_id FROM playlist      WHERE p_name IN (?)) AND ip_pos >= ?',
                        'UPDATE image_playlist SET ip_pos = ip_pos + 1' +
                        ' WHERE p_id IN     (SELECT p_id FROM playlist      WHERE p_name IN (?)) AND ip_pos >= ?',
                        'INSERT INTO image_playlist (p_id, ip_pos, i_id)' +
                        ' SELECT p_id AS p_id,     ? AS ip_pos,     ? AS i_id FROM playlist     WHERE p_name IN (?)'
                    ],
                    [
                        ['playlist', id],
                        ['playlist', id],
                        ['playlist', oldPos],
                        ['playlist', newPos],
                        [newPos, id, 'playlist'],
                    ],
                    done,
                    [
                        [[{'i_id': id, 'ip_pos': oldPos, 'p_name': 'playlist'}]],
                        [],
                        [],
                        [],
                        [],
                    ]);
            });

            it('executeActionTagPlaylist should set playlist WithPosition no oldPosition no newPos', done => {
                const id: any = 5;
                const oldPos = undefined;
                const newPos = undefined;
                const maxPos = 111;
                TestActionFormHelper.doActionTagTestSuccessTest(knex, service, 'executeActionTagPlaylist', 'image', id, {
                        payload: {
                            playlistkey: 'playlist',
                            set: true,
                            position: newPos
                        },
                        deletes: false,
                        key: 'playlist',
                        recordId: id,
                        type: 'tag'
                    },
                    true,
                    [
                        'SELECT * FROM image_playlist INNER JOIN playlist ON playlist.p_id = image_playlist.p_id' +
                        ' WHERE image_playlist.p_id IN     (SELECT p_id FROM playlist      WHERE p_name IN (?)) AND i_id = ?',
                        'DELETE FROM image_playlist' +
                        ' WHERE p_id IN     (SELECT p_id FROM playlist      WHERE p_name IN (?)) AND i_id = ?',
                        'SELECT max(ip_pos) AS maxPos FROM image_playlist' +
                        ' WHERE p_id IN     (SELECT p_id FROM playlist      WHERE p_name IN (?))',
                        'INSERT INTO image_playlist (p_id, ip_pos, i_id)' +
                        ' SELECT p_id AS p_id,     ? AS ip_pos,     ? AS i_id FROM playlist     WHERE p_name IN (?)'
                    ],
                    [
                        ['playlist', id],
                        ['playlist', id],
                        ['playlist'],
                        [maxPos + 1, id, 'playlist'],
                    ],
                    done,
                    [
                        [[{'i_id': id, 'ip_pos': oldPos, 'p_name': 'playlist'}]],
                        [],
                        [[{maxPos: maxPos}]],
                        [],
                    ]);
            });

            it('executeActionTagPlaylist should set playlist WithPosition oldPosition no newPos', done => {
                const id: any = 5;
                const oldPos = 11;
                const newPos = undefined;
                const maxPos = 111;
                TestActionFormHelper.doActionTagTestSuccessTest(knex, service, 'executeActionTagPlaylist', 'image', id, {
                        payload: {
                            playlistkey: 'playlist',
                            set: true,
                            position: newPos
                        },
                        deletes: false,
                        key: 'playlist',
                        recordId: id,
                        type: 'tag'
                    },
                    true,
                    [
                        'SELECT * FROM image_playlist INNER JOIN playlist ON playlist.p_id = image_playlist.p_id' +
                        ' WHERE image_playlist.p_id IN     (SELECT p_id FROM playlist      WHERE p_name IN (?)) AND i_id = ?',
                        'DELETE FROM image_playlist' +
                        ' WHERE p_id IN     (SELECT p_id FROM playlist      WHERE p_name IN (?)) AND i_id = ?',
                        'UPDATE image_playlist SET ip_pos = ip_pos - 1' +
                        ' WHERE p_id IN     (SELECT p_id FROM playlist      WHERE p_name IN (?)) AND ip_pos >= ?',
                        'SELECT max(ip_pos) AS maxPos FROM image_playlist' +
                        ' WHERE p_id IN     (SELECT p_id FROM playlist      WHERE p_name IN (?))',
                        'INSERT INTO image_playlist (p_id, ip_pos, i_id)' +
                        ' SELECT p_id AS p_id,     ? AS ip_pos,     ? AS i_id FROM playlist     WHERE p_name IN (?)'
                    ],
                    [
                        ['playlist', id],
                        ['playlist', id],
                        ['playlist', oldPos],
                        ['playlist'],
                        [maxPos + 1, id, 'playlist'],
                    ],
                    done,
                    [
                        [[{'i_id': id, 'ip_pos': oldPos, 'p_name': 'playlist'}]],
                        [],
                        [],
                        [[{maxPos: maxPos}]],
                        [],
                    ]);
            });

            it('executeActionTagPlaylist should set playlist WithPosition no oldPosition but newPos', done => {
                const id: any = 5;
                const oldPos = undefined;
                const newPos = 11;
                const maxPos = 111;
                TestActionFormHelper.doActionTagTestSuccessTest(knex, service, 'executeActionTagPlaylist', 'image', id, {
                        payload: {
                            playlistkey: 'playlist',
                            set: true,
                            position: newPos
                        },
                        deletes: false,
                        key: 'playlist',
                        recordId: id,
                        type: 'tag'
                    },
                    true,
                    [
                        'SELECT * FROM image_playlist INNER JOIN playlist ON playlist.p_id = image_playlist.p_id' +
                        ' WHERE image_playlist.p_id IN     (SELECT p_id FROM playlist      WHERE p_name IN (?)) AND i_id = ?',
                        'DELETE FROM image_playlist' +
                        ' WHERE p_id IN     (SELECT p_id FROM playlist      WHERE p_name IN (?)) AND i_id = ?',
                        'UPDATE image_playlist SET ip_pos = ip_pos + 1' +
                        ' WHERE p_id IN     (SELECT p_id FROM playlist      WHERE p_name IN (?)) AND ip_pos >= ?',
                        'INSERT INTO image_playlist (p_id, ip_pos, i_id)' +
                        ' SELECT p_id AS p_id,     ? AS ip_pos,     ? AS i_id FROM playlist     WHERE p_name IN (?)'
                    ],
                    [
                        ['playlist', id],
                        ['playlist', id],
                        ['playlist', newPos],
                        [newPos, id, 'playlist'],
                    ],
                    done,
                    [
                        [[{'i_id': id, 'ip_pos': oldPos, 'p_name': 'playlist'}]],
                        [],
                        [],
                        [],
                    ]);
            });

            it('executeActionTagPlaylist should unset playlist WithPosition withOldPos', done => {
                const id: any = 5;
                const oldPos = 111;
                TestActionFormHelper.doActionTagTestSuccessTest(knex, service, 'executeActionTagPlaylist', 'image', id, {
                        payload: {
                            playlistkey: 'playlist',
                            set: false
                        },
                        deletes: false,
                        key: 'playlist',
                        recordId: id,
                        type: 'tag'
                    },
                    true,
                    [
                        'SELECT * FROM image_playlist INNER JOIN playlist ON playlist.p_id = image_playlist.p_id' +
                        ' WHERE image_playlist.p_id IN     (SELECT p_id FROM playlist      WHERE p_name IN (?)) AND i_id = ?',
                        'DELETE FROM image_playlist' +
                        ' WHERE p_id IN     (SELECT p_id FROM playlist      WHERE p_name IN (?)) AND i_id = ?',
                        'UPDATE image_playlist SET ip_pos = ip_pos - 1' +
                        ' WHERE p_id IN     (SELECT p_id FROM playlist      WHERE p_name IN (?)) AND ip_pos >= ?'
                    ],
                    [
                        ['playlist', id],
                        ['playlist', id],
                        ['playlist', oldPos]
                    ],
                    done,
                    [
                        [[{'i_id': id, 'ip_pos': oldPos, 'p_name': 'playlist'}]],
                        [],
                        []
                    ]);
            });

            it('executeActionTagPlaylist should unset playlist WithPosition withoutOldPos', done => {
                const id: any = 5;
                const oldPos = undefined;
                TestActionFormHelper.doActionTagTestSuccessTest(knex, service, 'executeActionTagPlaylist', 'image', id, {
                        payload: {
                            playlistkey: 'playlist',
                            set: false
                        },
                        deletes: false,
                        key: 'playlist',
                        recordId: id,
                        type: 'tag'
                    },
                    true,
                    [
                        'SELECT * FROM image_playlist INNER JOIN playlist ON playlist.p_id = image_playlist.p_id' +
                        ' WHERE image_playlist.p_id IN     (SELECT p_id FROM playlist      WHERE p_name IN (?)) AND i_id = ?',
                        'DELETE FROM image_playlist' +
                        ' WHERE p_id IN     (SELECT p_id FROM playlist      WHERE p_name IN (?)) AND i_id = ?'
                    ],
                    [
                        ['playlist', id],
                        ['playlist', id]
                    ],
                    done,
                    [
                        [[{'i_id': id, 'ip_pos': oldPos, 'p_name': 'playlist'}]],
                        []
                    ]);
            });
        });
    });
});
