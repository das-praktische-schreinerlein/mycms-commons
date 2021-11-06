import {ActionTagForm} from '../../commons/utils/actiontag.utils';
import {
    DescValidationRule,
    KeywordValidationRule,
    NumberValidationRule
} from '../../search-commons/model/forms/generic-validator.util';
import {utils} from 'js-data';
import {CommonSqlPlaylistAdapter} from '../actions/common-sql-playlist.adapter';

export interface PlaylistActionTagForm extends ActionTagForm {
    payload: {
        playlistkey: string;
        set: boolean;
        position ?: number;
        details ?: string;
    };
}

export class CommonSqlActionTagPlaylistAdapter {

    private playlistValidationRule = new KeywordValidationRule(true);
    private numberValidationRule = new NumberValidationRule(false, 1, 999999999999, undefined);
    private textValidationRule = new DescValidationRule(false);
    private readonly commonSqlPlaylistAdapter: CommonSqlPlaylistAdapter;

    constructor(commonSqlPlaylistAdapter: CommonSqlPlaylistAdapter) {
        this.commonSqlPlaylistAdapter = commonSqlPlaylistAdapter;
    }

    public executeActionTagPlaylist(table: string, id: number, actionTagForm: PlaylistActionTagForm, opts: any): Promise<any> {
        opts = opts || {};

        if (!utils.isInteger(id)) {
            return utils.reject('actiontag ' + actionTagForm.key + ' id not an integer');
        }
        if (actionTagForm.payload === undefined) {
            return utils.reject('actiontag ' + actionTagForm.key + ' playload expected');
        }

        const playlists = actionTagForm.payload.playlistkey;
        if (!this.playlistValidationRule.isValid(playlists)) {
            return utils.reject('actiontag ' + actionTagForm.key + ' playlists not valid');
        }

        const position = actionTagForm.payload.position;
        if (!this.numberValidationRule.isValid(position)) {
            return utils.reject('actiontag ' + actionTagForm.key + ' position not valid');
        }

        const details = actionTagForm.payload.details;
        if (!this.textValidationRule.isValid(details)) {
            return utils.reject('actiontag ' + actionTagForm.key + ' details not valid');
        }

        return this.commonSqlPlaylistAdapter.setPlaylists(table, id, playlists, opts, actionTagForm.payload.set,
            position, details);
    }

}
