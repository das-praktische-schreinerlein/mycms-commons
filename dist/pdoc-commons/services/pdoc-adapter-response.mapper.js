"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var pdoc_record_1 = require("../model/records/pdoc-record");
var mapper_utils_1 = require("../../search-commons/services/mapper.utils");
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
        // common
        values['blocked_i'] = props.blocked;
        values['dateshow_dt'] = props.dateshow;
        values['desc_txt'] = props.descTxt;
        values['desc_md_txt'] = props.descMd;
        values['desc_html_txt'] = props.descHtml;
        values['name_s'] = props.name;
        values['subtype_s'] = props.subtype;
        values['type_s'] = props.type;
        // page
        values['css_s'] = props.css;
        values['flags_s'] = props.flags;
        values['heading_s'] = props.heading;
        values['image_s'] = props.image;
        values['key_s'] = props.key;
        values['langkeys_s'] = props.langkeys;
        values['profiles_s'] = props.profiles;
        values['subsectionids_s'] = props.subSectionIds;
        values['teaser_s'] = props.teaser;
        values['theme_s'] = props.theme;
        var desc = props.descTxt || props.descHtml || props.descMd;
        values['html_txt'] = [
            values['name_s'],
            values['heading_s'],
            values['teaser_s'],
            desc,
            values['flags_s'],
            values['key_s'],
            values['langkeys_s'],
            values['profile_s'],
            values['type_s'],
            values['subtype_s']
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
        // commons
        values['blocked'] = this.mapperUtils.getMappedAdapterNumberValue(mapping, doc, 'blocked_i', undefined);
        values['dateshow'] = this.mapperUtils.getMappedAdapterDateTimeValue(mapping, doc, 'dateshow_dt', undefined);
        values['descTxt'] = this.mapperUtils.getMappedAdapterValue(mapping, doc, 'desc_txt', undefined);
        values['descHtml'] = this.mapperUtils.getMappedAdapterValue(mapping, doc, 'desc_html_txt', undefined);
        values['descMd'] = this.mapperUtils.getMappedAdapterValue(mapping, doc, 'desc_md_txt', undefined);
        values['name'] = this.mapperUtils.getMappedAdapterValue(mapping, doc, 'name_s', undefined);
        values['subtype'] = this.mapperUtils.getMappedAdapterValue(mapping, doc, 'subtype_s', undefined);
        values['type'] = this.mapperUtils.getMappedAdapterValue(mapping, doc, 'type_s', undefined);
        // page
        values['css'] = this.mapperUtils.getMappedAdapterValue(mapping, doc, 'css_s', undefined);
        values['flags'] = this.mapperUtils.getMappedAdapterValue(mapping, doc, 'flags_s', undefined);
        values['heading'] = this.mapperUtils.getMappedAdapterValue(mapping, doc, 'heading_s', undefined);
        values['image'] = this.mapperUtils.getMappedAdapterValue(mapping, doc, 'image_s', undefined);
        values['key'] = this.mapperUtils.getMappedAdapterValue(mapping, doc, 'key_s', undefined);
        values['langkeys'] = this.mapperUtils.getMappedAdapterValue(mapping, doc, 'langkeys_s', undefined);
        values['profiles'] = this.mapperUtils.getMappedAdapterValue(mapping, doc, 'profiles_s', undefined);
        values['subSectionIds'] = this.mapperUtils.getMappedAdapterValue(mapping, doc, 'subsectionids_s', undefined);
        values['teaser'] = this.mapperUtils.getMappedAdapterValue(mapping, doc, 'teaser_s', undefined);
        values['theme'] = this.mapperUtils.getMappedAdapterValue(mapping, doc, 'theme_s', undefined);
        // console.log('mapResponseDocument values:', values);
        var record = mapper.createRecord(pdoc_record_1.PDocRecordFactory.instance.getSanitizedValues(values, {}));
        return record;
    };
    PDocAdapterResponseMapper.prototype.mapDetailResponseDocuments = function (mapper, profile, src, docs) {
        var record = src;
        switch (profile) {
            case 'flags':
                record.flags = object_utils_1.ObjectUtils.mergePropertyValues(docs, 'flags', ', ', true);
                break;
            case 'langkeys':
                record.langkeys = object_utils_1.ObjectUtils.mergePropertyValues(docs, 'langkeys', ', ', true);
                break;
            case 'profiles':
                record.profiles = object_utils_1.ObjectUtils.mergePropertyValues(docs, 'profiles', ', ', true);
                break;
        }
    };
    return PDocAdapterResponseMapper;
}());
exports.PDocAdapterResponseMapper = PDocAdapterResponseMapper;
//# sourceMappingURL=pdoc-adapter-response.mapper.js.map