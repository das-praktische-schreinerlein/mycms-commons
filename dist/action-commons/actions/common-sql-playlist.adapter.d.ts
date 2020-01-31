import { SqlQueryBuilder } from '../../search-commons/services/sql-query.builder';
export interface PlaylistModelConfigJoinType {
    table: string;
    joinTable: string;
    fieldReference: string;
}
export interface PlaylistModelConfigJoinsType {
    [key: string]: PlaylistModelConfigJoinType;
}
export interface PlaylistModelConfigType {
    fieldId: string;
    fieldName: string;
    joins: PlaylistModelConfigJoinsType;
    table: string;
}
export declare class CommonSqlPlaylistAdapter {
    private config;
    private readonly knex;
    private sqlQueryBuilder;
    private readonly playlistModelConfig;
    private playlistValidationRule;
    constructor(config: any, knex: any, sqlQueryBuilder: SqlQueryBuilder, playlistModelConfig: PlaylistModelConfigType);
    setPlaylists(joinTableKey: string, dbId: number, playlist: string, opts: any, set: boolean): Promise<any>;
}
