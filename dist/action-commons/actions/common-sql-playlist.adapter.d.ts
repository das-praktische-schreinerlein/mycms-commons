import { SqlQueryBuilder } from '../../search-commons/services/sql-query.builder';
export interface PlaylistModelConfigJoinType {
    table: string;
    joinTable: string;
    fieldReference: string;
    positionField?: string;
    detailsField?: string;
}
export interface PlaylistModelConfigJoinsType {
    [key: string]: PlaylistModelConfigJoinType;
}
export interface PlaylistModelConfigType {
    fieldId: string;
    fieldName: string;
    joins: PlaylistModelConfigJoinsType;
    table: string;
    commonChangeSuccessorPosSqls?: string[];
    commonSelectMaxPositionSql?: string;
}
export declare class CommonSqlPlaylistAdapter {
    private config;
    private readonly knex;
    private sqlQueryBuilder;
    private readonly playlistModelConfig;
    private playlistValidationRule;
    private numberValidationRule;
    private textValidationRule;
    constructor(config: any, knex: any, sqlQueryBuilder: SqlQueryBuilder, playlistModelConfig: PlaylistModelConfigType);
    setPlaylists(joinTableKey: string, dbId: number, playlist: string, opts: any, set: boolean, position?: number, details?: string): Promise<any>;
    protected setPlaylist(joinTableKey: string, dbId: number, playlistKey: string, opts: any, set: boolean, position: number, details: string, oldRecord: {}): Promise<any>;
}
