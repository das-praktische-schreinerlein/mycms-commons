"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var generic_validator_util_1 = require("../../search-commons/model/forms/generic-validator.util");
var js_data_1 = require("js-data");
var CommonSqlActionTagPlaylistAdapter = /** @class */ (function () {
    function CommonSqlActionTagPlaylistAdapter(commonSqlPlaylistAdapter) {
        this.playlistValidationRule = new generic_validator_util_1.KeywordValidationRule(true);
        this.numberValidationRule = new generic_validator_util_1.NumberValidationRule(false, 1, 999999999999, undefined);
        this.textValidationRule = new generic_validator_util_1.DescValidationRule(false);
        this.commonSqlPlaylistAdapter = commonSqlPlaylistAdapter;
    }
    CommonSqlActionTagPlaylistAdapter.prototype.executeActionTagPlaylist = function (table, id, actionTagForm, opts) {
        opts = opts || {};
        if (!js_data_1.utils.isInteger(id)) {
            return js_data_1.utils.reject('actiontag ' + actionTagForm.key + ' id not an integer');
        }
        if (actionTagForm.payload === undefined) {
            return js_data_1.utils.reject('actiontag ' + actionTagForm.key + ' playload expected');
        }
        var playlists = actionTagForm.payload.playlistkey;
        if (!this.playlistValidationRule.isValid(playlists)) {
            return js_data_1.utils.reject('actiontag ' + actionTagForm.key + ' playlists not valid');
        }
        var position = actionTagForm.payload.position;
        if (!this.numberValidationRule.isValid(position)) {
            return js_data_1.utils.reject('actiontag ' + actionTagForm.key + ' position not valid');
        }
        var details = actionTagForm.payload.details;
        if (!this.textValidationRule.isValid(details)) {
            return js_data_1.utils.reject('actiontag ' + actionTagForm.key + ' details not valid');
        }
        return this.commonSqlPlaylistAdapter.setPlaylists(table, id, playlists, opts, actionTagForm.payload.set, position, details);
    };
    return CommonSqlActionTagPlaylistAdapter;
}());
exports.CommonSqlActionTagPlaylistAdapter = CommonSqlActionTagPlaylistAdapter;
//# sourceMappingURL=common-sql-actiontag-playlist.adapter.js.map