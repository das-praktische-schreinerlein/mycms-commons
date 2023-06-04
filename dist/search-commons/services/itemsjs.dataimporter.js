"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var internal_compatibility_1 = require("rxjs/internal-compatibility");
var object_utils_1 = require("../../commons/utils/object.utils");
var ItemsJsDataImporter = /** @class */ (function () {
    function ItemsJsDataImporter(itemsJsConfig) {
        this._objectSeparator = ';;';
        this._fieldSeparator = ':::';
        this._valueSeparator = '=';
        this.itemsJsConfig = itemsJsConfig;
    }
    ItemsJsDataImporter.prepareConfiguration = function (itemsJsConfig) {
        var aggregations = itemsJsConfig.aggregations;
        for (var aggreationName in aggregations) {
            var aggregation = aggregations[aggreationName];
            if (!aggregation['field']) {
                aggregation['field'] = aggreationName;
            }
        }
        for (var _i = 0, _a = itemsJsConfig.aggregationFields; _i < _a.length; _i++) {
            var fieldName = _a[_i];
            if (fieldName.endsWith('_i') || fieldName.endsWith('_s')) {
                if (!aggregations[fieldName]) {
                    aggregations[fieldName] = {
                        conjunction: false,
                        sort: 'term',
                        order: 'asc',
                        hide_zero_doc_count: true,
                        size: 9999
                    };
                }
                if (!aggregations[fieldName + 's']) {
                    aggregations[fieldName + 's'] = {
                        conjunction: false,
                        sort: 'term',
                        order: 'asc',
                        hide_zero_doc_count: true,
                        size: 9999
                    };
                }
            }
        }
    };
    ItemsJsDataImporter.prototype.mapToItemJsDocuments = function (data) {
        var recordIds = {};
        var records = [];
        var recordMap = {};
        var imagePathes = {};
        var videoPathes = {};
        // check for duplicates and fill media-container
        for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
            var record = data_1[_i];
            if (!record['id'] || record['id'] === '') {
                console.warn('SKIPPED record - no id', record['id'], record);
                continue;
            }
            if (recordIds[record['id']]) {
                console.warn('SKIPPED record - id already exists id/existing/skipped', record['id'], recordIds[record['id']], record);
                continue;
            }
            records.push(record);
            recordIds[record['id']] = records.length - 1;
            delete record['gpstracks_basefile_s'];
            var mediaUrl = record['i_fav_url_txt'];
            if (mediaUrl && record['type_s'] === 'IMAGE') {
                imagePathes[mediaUrl] = mediaUrl;
            }
            mediaUrl = record['v_fav_url_txt'];
            if (mediaUrl && record['type_s'] === 'VIDEO') {
                videoPathes[mediaUrl] = mediaUrl;
            }
            recordMap[record.id] = record;
        }
        var refMappings = this.generateRelationMappings(recordMap);
        this.remapRelationMappings(recordMap, refMappings);
        if (!this.itemsJsConfig.skipMediaCheck) {
            this.clearNotExistingMediaPathes(records, imagePathes, videoPathes);
        }
        return records;
    };
    ItemsJsDataImporter.prototype.createRecordFromJson = function (responseMapper, mapper, props, relationType) {
        for (var key in relationType.hasOne) {
            if (props[key]) {
                for (var fieldName in props[key]) {
                    props[key + '.' + fieldName] = props[key][fieldName];
                }
            }
        }
        for (var key in relationType.hasMany) {
            if (props[key]) {
            }
        }
        return responseMapper.mapValuesToRecord(mapper, props);
    };
    ItemsJsDataImporter.prototype.extendAdapterDocument = function (values) {
        // remap fields with fallbacks
        values['actiontype_s'] = values['actiontype_s'] || values['subtype_s'];
        values['dateshow_dt'] = values['dateshow_dt'] || values['datestart_dt'];
        values['html'] = values['name_s'] + ' ' + values['desc_txt'];
        // prepare aggregations
        for (var _i = 0, _a = ['keywords', 'objects', 'persons', 'playlists']; _i < _a.length; _i++) {
            var filterBase = _a[_i];
            values[filterBase + '_ss'] = values[filterBase + '_txt'];
        }
        var aggregations = this.itemsJsConfig.aggregations;
        for (var aggreationName in aggregations) {
            var aggregation = aggregations[aggreationName];
            if (aggregation.filterFunction) {
                values[aggreationName] = aggregation.filterFunction.call(this, values);
            }
            else if (aggregation['mapField']) {
                values[aggreationName] = values[aggregation['mapField']];
            }
        }
        // override some aggregations
        values['type_txt'] = values['type_txt']
            ? values['type_txt']
            : values['type_s'];
        values['type_txt'] = values['type_txt']
            ? values['type_txt'].toLowerCase()
            : '';
        values['year_is'] = values['dateshow_dt']
            ? new Date(values['dateshow_dt']).getFullYear()
            : undefined;
        values['month_is'] = values['dateshow_dt']
            ? new Date(values['dateshow_dt']).getMonth() + 1
            : undefined;
        values['done_ss'] = values['dateshow_dt']
            ? 'DONE1'
            : 'DONE0';
        if (values['loc_lochirarchie_s']) {
            values['loc_lochirarchie_txt'] = values['loc_lochirarchie_s'].split(',,');
        }
        // add aggregations for searchableFields if not exists
        for (var _b = 0, _c = this.itemsJsConfig.searchableFields; _b < _c.length; _b++) {
            var fieldName = _c[_b];
            if ((fieldName.endsWith('_i') || fieldName.endsWith('_s')) && !values[fieldName + 's']) {
                values[fieldName + 's'] = values[fieldName];
            }
        }
        // remap to String because itemjs is string-search-engine ;-)
        for (var _d = 0, _e = [].concat(this.itemsJsConfig.aggregationFields).concat(); _d < _e.length; _d++) {
            var fieldName = _e[_d];
            if (internal_compatibility_1.isNumeric(values[fieldName])) {
                values[fieldName] = values[fieldName] + '';
            }
        }
        for (var key in values) {
            if ((key.endsWith('_ss') || key.endsWith('_is') || key.endsWith('_fs')) && internal_compatibility_1.isNumeric(values[key])) {
                values[key] = values[key] + '';
            }
        }
        var spatialField = this.itemsJsConfig.spatialField;
        if (spatialField && values[spatialField]) {
            // TODO use rad instead of deg
            var _f = values[spatialField].split(/[;,]/), lat = _f[0], lng = _f[1], distance = _f[2];
            values[spatialField + '_lat'] = parseFloat(lat);
            values[spatialField + '_lng'] = parseFloat(lng);
            values[spatialField + '_ele'] = parseFloat(distance);
        }
        return values;
    };
    ItemsJsDataImporter.prototype.lazyCheckForFilePath = function (pathes, needle) {
        var normalizedTries = [];
        if (!needle) {
            return undefined;
        }
        normalizedTries.push(needle);
        if (pathes[needle]) {
            return needle;
        }
        var normalized = needle.replace(/^\//, '');
        normalizedTries.push(normalized);
        if (pathes[normalized]) {
            return normalized;
        }
        normalized = needle.replace('/', '_');
        normalizedTries.push(normalized);
        if (pathes[normalized]) {
            return normalized;
        }
        normalized = '/' + needle;
        normalizedTries.push(normalized);
        if (pathes[normalized]) {
            return normalized;
        }
        normalized = '/' + needle.replace('/', '_');
        normalizedTries.push(normalized);
        if (pathes[normalized]) {
            return normalized;
        }
        if (needle.length === 1) {
            // console.debug('no matching path found - checked normalized pathes', normalizedTries);
            return undefined;
        }
        normalized = needle.substr(0, 1)
            + needle.substr(1, needle.length).replace('/', '_');
        normalizedTries.push(normalized);
        if (pathes[normalized]) {
            return normalized;
        }
        // console.debug('no matching path found - checked normalized pathes', normalizedTries);
        return undefined;
    };
    ItemsJsDataImporter.prototype.clearNotExistingMediaPathes = function (records, imagePathes, videoPathes) {
        // delete reference if media-path not exists in media-container
        for (var _i = 0, records_1 = records; _i < records_1.length; _i++) {
            var record = records_1[_i];
            var mediaUrl = record['i_fav_url_txt'];
            if (mediaUrl && record['type_s'] !== 'IMAGE' && !imagePathes[mediaUrl]) {
                var normalizedUrl = this.lazyCheckForFilePath(imagePathes, mediaUrl);
                if (normalizedUrl && imagePathes[normalizedUrl]) {
                    // console.debug('FavImage REMAPPED i_fav_url_txt remapped:', mediaUrl, normalizedUrl);
                    record['i_fav_url_txt'] = normalizedUrl;
                }
                else {
                    // console.debug('FavImage NOT FOUND i_fav_url_txt:', mediaUrl);
                    delete record['i_fav_url_txt'];
                }
            }
            mediaUrl = record['v_fav_url_txt'];
            if (mediaUrl && record['type_s'] !== 'VIDEO' && !imagePathes[mediaUrl]) {
                var normalizedUrl = this.lazyCheckForFilePath(videoPathes, mediaUrl);
                if (normalizedUrl && videoPathes[normalizedUrl]) {
                    // console.debug('FavVideo REMAPPED v_fav_url_txt remapped:', mediaUrl, normalizedUrl);
                    record['v_fav_url_txt'] = normalizedUrl;
                }
                else {
                    // console.debug('FavVideo RESET v_fav_url_txt:', mediaUrl);
                    delete record['v_fav_url_txt'];
                }
            }
        }
    };
    ItemsJsDataImporter.prototype.generateRelationMappings = function (recordMap) {
        var result = {};
        for (var _i = 0, _a = Object.keys(recordMap); _i < _a.length; _i++) {
            var recordId = _a[_i];
            var record = recordMap[recordId];
            for (var _b = 0, _c = this.itemsJsConfig.refConfigs; _b < _c.length; _b++) {
                var refConfig = _c[_b];
                var container = record[refConfig.containerField];
                if (container) {
                    var refIds = [];
                    var objects = object_utils_1.ObjectUtils.explodeValueToObjects(container, this._objectSeparator, this._fieldSeparator, this._valueSeparator, true);
                    for (var _d = 0, objects_1 = objects; _d < objects_1.length; _d++) {
                        var object = objects_1[_d];
                        var refId = object[refConfig.refField];
                        if (refId) {
                            refIds.push(refId);
                        }
                    }
                    for (var _e = 0, _f = refConfig.filterFields; _e < _f.length; _e++) {
                        var filterField = _f[_e];
                        if (!record[filterField]) {
                            record[filterField] = [];
                        }
                        if (!Array.isArray(record[filterField])) {
                            record[filterField] = [record[filterField]];
                        }
                        record[filterField] = record[filterField].concat(refIds);
                        for (var _g = 0, refIds_1 = refIds; _g < refIds_1.length; _g++) {
                            var refId = refIds_1[_g];
                            var fullRefId = refConfig.idPrefix + refId;
                            if (!result[fullRefId]) {
                                result[fullRefId] = {};
                            }
                            if (!result[fullRefId][filterField]) {
                                result[fullRefId][filterField] = [];
                            }
                            result[fullRefId][filterField].push(recordId);
                        }
                    }
                }
            }
        }
        return result;
    };
    ItemsJsDataImporter.prototype.remapRelationMappings = function (recordMap, refMappings) {
        // TODO map to original-record instead opf reference
        for (var _i = 0, _a = Object.keys(recordMap); _i < _a.length; _i++) {
            var recordId = _a[_i];
            var record = recordMap[recordId];
            var recordRefMappings = refMappings[record['id']];
            if (!recordRefMappings) {
                continue;
            }
        }
    };
    ItemsJsDataImporter.prototype.getItemsJsConfig = function () {
        return this.itemsJsConfig;
    };
    return ItemsJsDataImporter;
}());
exports.ItemsJsDataImporter = ItemsJsDataImporter;
//# sourceMappingURL=itemsjs.dataimporter.js.map