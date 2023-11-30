"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var pdoc_record_1 = require("../model/records/pdoc-record");
var pdoc_search_service_1 = require("./pdoc-search.service");
var pdoc_record_schema_1 = require("../model/schemas/pdoc-record-schema");
var cdoc_data_service_1 = require("../../search-commons/services/cdoc-data.service");
var pdoc_adapter_response_mapper_1 = require("./pdoc-adapter-response.mapper");
var string_utils_1 = require("../../commons/utils/string.utils");
var StaticPagesDataService = /** @class */ (function (_super) {
    __extends(StaticPagesDataService, _super);
    function StaticPagesDataService(dataStore) {
        return _super.call(this, dataStore, new pdoc_search_service_1.PDocSearchService(dataStore), new pdoc_adapter_response_mapper_1.PDocAdapterResponseMapper({})) || this;
    }
    StaticPagesDataService.prototype.createRecord = function (props, opts) {
        return this.dataStore.createRecord(this.getBaseMapperName(), props, opts);
    };
    StaticPagesDataService.prototype.defineDatastoreMapper = function () {
        this.dataStore.defineMapper('pdoc', pdoc_record_1.PDocRecord, pdoc_record_schema_1.PDocRecordSchema, pdoc_record_1.PDocRecordRelation);
    };
    StaticPagesDataService.prototype.defineIdMappingAlliases = function () {
        return {};
    };
    StaticPagesDataService.prototype.defineIdMappings = function () {
        return [];
    };
    StaticPagesDataService.prototype.defineTypeMappings = function () {
        return {};
    };
    StaticPagesDataService.prototype.onImportRecordNewRecordProcessDefaults = function (record, recordIdMapping, recordRecoverIdMapping) {
    };
    StaticPagesDataService.prototype.remapBaseJoins = function (baseJoins, refIdFieldName, recordIdMapping, recordRecoverIdMapping) {
        if (baseJoins) {
            for (var _i = 0, baseJoins_1 = baseJoins; _i < baseJoins_1.length; _i++) {
                var join = baseJoins_1[_i];
                var refIdMapping = recordIdMapping[refIdFieldName];
                var refId = join.refId;
                if (refIdMapping && refIdMapping[refId]) {
                    console.log('orig join: ' + join.id + ' map join ref ' + refIdFieldName + ' ' + refId
                        + '->' + refIdMapping[refId]);
                    join.refId = refIdMapping[refId] + '';
                }
                else {
                    console.warn('WARNING NO Id-Mapping orig join: ' + join.id + ' map baseJoin ref ' + refIdFieldName + ' ' + refId
                        + '->' + refIdMapping[refId]);
                }
            }
        }
    };
    StaticPagesDataService.prototype.generateImportRecordQuery = function (record) {
        return {
            where: {
                name_s: {
                    'in': [record.name]
                },
                type_ss: {
                    'in': [record.type.toLowerCase()]
                }
            }
        };
    };
    StaticPagesDataService.prototype.getSubDocuments = function (pdoc) {
        var sections = [];
        if (!pdoc) {
            return [];
        }
        var ids = pdoc.subSectionIds !== undefined ? pdoc.subSectionIds.split(/,/) : [];
        for (var _i = 0, ids_1 = ids; _i < ids_1.length; _i++) {
            var id = ids_1[_i];
            if (id === undefined || id.length === 0) {
                continue;
            }
            var section = this.getByIdFromLocalStore(id);
            if (section !== undefined) {
                sections.push(section);
            }
            else {
                // console.warn('getSubSections: section not found:', LogUtils.sanitizeLogMsg(id));
            }
        }
        sections.sort(function (a, b) { return string_utils_1.StringUtils.nullSafeStringCompare(a.sortkey, b.sortkey); });
        return sections;
    };
    StaticPagesDataService.prototype.addAdditionalActionTagForms = function (origRecord, newRecord, actionTagForms) {
    };
    return StaticPagesDataService;
}(cdoc_data_service_1.CommonDocDataService));
exports.StaticPagesDataService = StaticPagesDataService;
//# sourceMappingURL=staticpages-data.service.js.map