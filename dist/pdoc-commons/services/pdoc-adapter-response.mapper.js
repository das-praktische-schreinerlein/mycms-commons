"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var pdoc_record_1 = require("../model/records/pdoc-record");
var mapper_utils_1 = require("../../search-commons/services/mapper.utils");
var bean_utils_1 = require("../../commons/utils/bean.utils");
var object_utils_1 = require("../../commons/utils/object.utils");
var PDocAdapterResponseMapper = /** @class */ (function () {
    function PDocAdapterResponseMapper(config) {
        this._objectSeparator = ';;';
        this._fieldSeparator = ':::';
        this._valueSeparator = '=';
        this.mapperUtils = new mapper_utils_1.MapperUtils(this._objectSeparator, this._fieldSeparator, this._valueSeparator);
        this.config = {};
        this.config = config;
    }
    PDocAdapterResponseMapper.generateDoubletteValue = function (value) {
        return mapper_utils_1.MapperUtils.generateDoubletteValue(value);
    };
    PDocAdapterResponseMapper.prototype.mapToAdapterDocument = function (mapping, props) {
        var values = {};
        values['id'] = props.id;
        values['blocked_i'] = props.blocked;
        values['dateshow_dt'] = props.dateshow;
        values['desc_txt'] = props.descTxt;
        values['desc_md_txt'] = props.descMd;
        values['desc_html_txt'] = props.descHtml;
        values['keywords_txt'] =
            (props.keywords ? props.keywords.split(', ').join(',') : '');
        values['name_s'] = props.name;
        values['key_s'] = mapper_utils_1.MapperUtils.generateDoubletteValue(props.name);
        values['playlists_txt'] =
            (props.playlists ? props.playlists.split(', ').join(',,') : '');
        values['type_s'] = props.type;
        values['subtype_s'] = props.subtype;
        values['html_txt'] = [
            values['desc_txt'],
            values['name_s'],
            values['keywords_txt'],
            values['type_s']
        ].join(' ');
        return values;
    };
    PDocAdapterResponseMapper.prototype.mapDetailDataToAdapterDocument = function (mapping, profile, props, result) {
        switch (profile) {
        }
    };
    PDocAdapterResponseMapper.prototype.mapValuesToRecord = function (mapper, values) {
        var record = pdoc_record_1.PDocRecordFactory.createSanitized(values);
        this.mapperUtils.mapValuesToSubRecords(mapper, values, record, pdoc_record_1.PDocRecordRelation);
        return record;
    };
    PDocAdapterResponseMapper.prototype.mapResponseDocument = function (mapper, doc, mapping) {
        var values = {};
        values['id'] = this.mapperUtils.getMappedAdapterValue(mapping, doc, 'id', undefined);
        var subtypeField = doc[this.mapperUtils.mapToAdapterFieldName(mapping, 'subtypes_ss')];
        if (subtypeField !== undefined && Array.isArray(subtypeField)) {
            values['subtypes'] = subtypeField.join(',');
        }
        values['blocked'] = this.mapperUtils.getMappedAdapterNumberValue(mapping, doc, 'blocked_i', undefined);
        values['dateshow'] = this.mapperUtils.getMappedAdapterDateTimeValue(mapping, doc, 'dateshow_dt', undefined);
        values['descTxt'] = this.mapperUtils.getMappedAdapterValue(mapping, doc, 'desc_txt', undefined);
        values['descHtml'] = this.mapperUtils.getMappedAdapterValue(mapping, doc, 'desc_html_txt', undefined);
        values['descMd'] = this.mapperUtils.getMappedAdapterValue(mapping, doc, 'desc_md_txt', undefined);
        var origKeywordsArr = this.mapperUtils.getMappedAdapterValue(mapping, doc, 'keywords_txt', '').split(',');
        var replaceKeywordPatterns = bean_utils_1.BeanUtils.getValue(this.config, 'mapperConfig.replaceKeywordPatterns');
        var srcKeywordsArr = [];
        if (replaceKeywordPatterns && replaceKeywordPatterns.length > 0) {
            for (var _i = 0, origKeywordsArr_1 = origKeywordsArr; _i < origKeywordsArr_1.length; _i++) {
                var keyword = origKeywordsArr_1[_i];
                keyword = keyword.trim();
                if (keyword === '') {
                    continue;
                }
                for (var _a = 0, replaceKeywordPatterns_1 = replaceKeywordPatterns; _a < replaceKeywordPatterns_1.length; _a++) {
                    var pattern = replaceKeywordPatterns_1[_a];
                    keyword = keyword.replace(new RegExp(pattern[0]), pattern[1]);
                }
                srcKeywordsArr.push(keyword);
            }
        }
        else {
            srcKeywordsArr = [].concat(origKeywordsArr);
        }
        var allowedKeywordPatterns = bean_utils_1.BeanUtils.getValue(this.config, 'mapperConfig.allowedKeywordPatterns');
        var newKeywordsArr = [];
        for (var _b = 0, srcKeywordsArr_1 = srcKeywordsArr; _b < srcKeywordsArr_1.length; _b++) {
            var keyword = srcKeywordsArr_1[_b];
            keyword = keyword.trim();
            if (keyword === '') {
                continue;
            }
            if (allowedKeywordPatterns && allowedKeywordPatterns.length > 0) {
                for (var _c = 0, allowedKeywordPatterns_1 = allowedKeywordPatterns; _c < allowedKeywordPatterns_1.length; _c++) {
                    var pattern = allowedKeywordPatterns_1[_c];
                    if (keyword.match(new RegExp(pattern))) {
                        newKeywordsArr.push(keyword);
                        break;
                    }
                }
            }
            else {
                newKeywordsArr.push(keyword);
            }
        }
        newKeywordsArr = object_utils_1.ObjectUtils.uniqueArray(newKeywordsArr);
        values['keywords'] = newKeywordsArr.join(', ');
        values['name'] = this.mapperUtils.getMappedAdapterValue(mapping, doc, 'name_s', undefined);
        values['playlists'] = this.mapperUtils.getMappedAdapterValue(mapping, doc, 'playlists_txt', '')
            .replace(/[,]+/g, ',').split(',').join(', ');
        values['subtype'] = this.mapperUtils.getMappedAdapterValue(mapping, doc, 'subtype_s', undefined);
        values['type'] = this.mapperUtils.getMappedAdapterValue(mapping, doc, 'type_s', undefined);
        // console.log('mapResponseDocument values:', values);
        var record = mapper.createRecord(pdoc_record_1.PDocRecordFactory.instance.getSanitizedValues(values, {}));
        return record;
    };
    PDocAdapterResponseMapper.prototype.mapDetailResponseDocuments = function (mapper, profile, src, docs) {
        var record = src;
        switch (profile) {
            case 'keywords':
                record.keywords = object_utils_1.ObjectUtils.mergePropertyValues(docs, 'keywords', ', ', true);
                break;
        }
    };
    return PDocAdapterResponseMapper;
}());
exports.PDocAdapterResponseMapper = PDocAdapterResponseMapper;
//# sourceMappingURL=pdoc-adapter-response.mapper.js.map