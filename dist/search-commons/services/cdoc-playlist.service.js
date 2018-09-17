"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CommonDocPlaylistService = /** @class */ (function () {
    function CommonDocPlaylistService() {
    }
    CommonDocPlaylistService.prototype.generateM3uForRecords = function (pathPrefix, records) {
        var _this = this;
        var values = ['#EXTM3U'];
        if (records) {
            records.forEach(function (record) {
                values.push(_this.generateM3uEntryForRecord(pathPrefix, record));
            });
        }
        return values.filter(function (value) {
            return value !== undefined && value !== '';
        }).join('\n');
    };
    CommonDocPlaylistService.prototype.generateM3uEntryForRecord = function (pathPrefix, record) {
        if (!record) {
            return undefined;
        }
        var path = this.generateM3uEntityPath(pathPrefix, record);
        if (!path) {
            return undefined;
        }
        var values = [
            this.generateM3uEntityInfo(record),
            path
        ];
        return values.filter(function (value) {
            return value !== undefined && value !== '';
        }).join('\n');
    };
    CommonDocPlaylistService.prototype.generateM3uEntityInfo = function (record) {
        if (!record || !record.name) {
            return undefined;
        }
        return '#EXTINF:-1,' + record.name;
    };
    return CommonDocPlaylistService;
}());
exports.CommonDocPlaylistService = CommonDocPlaylistService;
//# sourceMappingURL=cdoc-playlist.service.js.map