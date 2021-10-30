import { ActionTagForm } from '../../commons/utils/actiontag.utils';
import { CommonSqlPlaylistAdapter } from '../actions/common-sql-playlist.adapter';
export interface PlaylistActionTagForm extends ActionTagForm {
    payload: {
        playlistkey: string;
        set: boolean;
        position?: number;
    };
}
export declare class CommonSqlActionTagPlaylistAdapter {
    private playlistValidationRule;
    private numberValidationRule;
    private readonly commonSqlPlaylistAdapter;
    constructor(commonSqlPlaylistAdapter: CommonSqlPlaylistAdapter);
    executeActionTagPlaylist(table: string, id: number, actionTagForm: PlaylistActionTagForm, opts: any): Promise<any>;
}
