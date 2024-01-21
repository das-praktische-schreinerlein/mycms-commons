"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CommonDocPlaylistService = /** @class */ (function () {
    function CommonDocPlaylistService() {
        this.exportProfiles = {
            'default': {
                profileName: 'default',
                headerNames: ['id', 'name'],
                fieldNames: ['id', 'name']
            }
        };
    }
    CommonDocPlaylistService.prototype.generateM3uForRecords = function (pathPrefix, records) {
        var _this = this;
        var values = [this.generateM3uHeader()];
        if (records) {
            records.forEach(function (record) {
                values.push(_this.generateM3uEntryForRecord(pathPrefix, record));
            });
        }
        return values.filter(function (value) {
            return value !== undefined && value !== '';
        }).join('\n');
    };
    CommonDocPlaylistService.prototype.generateM3uHeader = function () {
        return '#EXTM3U';
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
    CommonDocPlaylistService.prototype.generateCsvForRecords = function (profileConfig, pathPrefix, records) {
        var _this = this;
        var values = [this.generateCsvHeader(profileConfig)];
        if (records) {
            records.forEach(function (record) {
                values.push(_this.generateCsvEntryForRecord(profileConfig, pathPrefix, record));
            });
        }
        return values.filter(function (value) {
            return value !== undefined && value !== '';
        }).join('\n');
    };
    CommonDocPlaylistService.prototype.generateCsvHeader = function (profileConfig) {
        return profileConfig.headerNames.join('\t');
    };
    CommonDocPlaylistService.prototype.generateCsvEntryForRecord = function (profileConfig, pathPrefix, record) {
        var _this = this;
        if (!record) {
            return undefined;
        }
        return profileConfig.fieldNames.map(function (csvFieldName) {
            return _this.generateFieldValue(pathPrefix, record, csvFieldName);
        }).join('\t');
    };
    CommonDocPlaylistService.prototype.generateFieldValue = function (pathPrefix, record, csvFieldName) {
        return record[csvFieldName] !== undefined && record[csvFieldName] !== null
            ? record[csvFieldName]
            : '';
    };
    CommonDocPlaylistService.prototype.getCsvExportProfile = function (profile) {
        return this.exportProfiles[profile];
    };
    return CommonDocPlaylistService;
}());
exports.CommonDocPlaylistService = CommonDocPlaylistService;
//# sourceMappingURL=cdoc-playlist.service.js.map