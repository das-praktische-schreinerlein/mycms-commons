"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var js_data_1 = require("js-data");
var CommonDocPlaylistExporter = /** @class */ (function () {
    function CommonDocPlaylistExporter(dataService, playlistGenerator) {
        this.dataService = dataService;
        this.playlistGenerator = playlistGenerator;
    }
    CommonDocPlaylistExporter.prototype.exportPlaylist = function (playlistExportConfig, searchForm) {
        var me = this;
        searchForm.perPage = 100;
        searchForm.pageNum = 1;
        var cDocPlaylistChunks = [this.playlistGenerator.generateM3uHeader()];
        var createNextPlaylist = function () {
            return me.dataService.search(searchForm).then(function searchDone(searchResult) {
                if (playlistExportConfig.maxAllowed < searchResult.recordCount) {
                    console.error('to much record');
                    throw new Error('records to export as playlist exceeds maximum allowed '
                        + searchResult.recordCount + '>' + playlistExportConfig.maxAllowed);
                }
                var playlistEntries = [];
                for (var _i = 0, _a = searchResult.currentRecords; _i < _a.length; _i++) {
                    var doc = _a[_i];
                    playlistEntries.push(me.playlistGenerator.generateM3uEntryForRecord('', doc));
                }
                searchForm.pageNum++;
                cDocPlaylistChunks.push(playlistEntries.join('\n'));
                if (searchForm.pageNum < (searchResult.recordCount / searchForm.perPage + 1)) {
                    return createNextPlaylist();
                }
                else {
                    return js_data_1.utils.resolve(cDocPlaylistChunks.join('\n'));
                }
            }).catch(function searchError(error) {
                console.error('error thrown: ', error);
                return js_data_1.utils.reject(error);
            });
        };
        return createNextPlaylist();
    };
    return CommonDocPlaylistExporter;
}());
exports.CommonDocPlaylistExporter = CommonDocPlaylistExporter;
//# sourceMappingURL=cdoc-playlist-exporter.js.map