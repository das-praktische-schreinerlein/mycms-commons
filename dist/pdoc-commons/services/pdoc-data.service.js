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
var PDocDataService = /** @class */ (function (_super) {
    __extends(PDocDataService, _super);
    function PDocDataService(dataStore) {
        return _super.call(this, dataStore, new pdoc_search_service_1.PDocSearchService(dataStore), new pdoc_adapter_response_mapper_1.PDocAdapterResponseMapper({})) || this;
    }
    PDocDataService.prototype.createRecord = function (props, opts) {
        return this.dataStore.createRecord(this.getBaseMapperName(), props, opts);
    };
    PDocDataService.prototype.defineDatastoreMapper = function () {
        this.dataStore.defineMapper('pdoc', pdoc_record_1.PDocRecord, pdoc_record_schema_1.PDocRecordSchema, pdoc_record_1.PDocRecordRelation);
    };
    PDocDataService.prototype.defineIdMappingAlliases = function () {
        return {};
    };
    PDocDataService.prototype.defineIdMappings = function () {
        return ['playlistId'];
    };
    PDocDataService.prototype.defineTypeMappings = function () {
        return {
            playlist: 'playlistId'
        };
    };
    PDocDataService.prototype.onImportRecordNewRecordProcessDefaults = function (record, recordIdMapping, recordRecoverIdMapping) {
        record.subtype = record.subtype ? record.subtype.replace(/[-a-zA-Z_]+/g, '') : '';
    };
    PDocDataService.prototype.remapBaseJoins = function (baseJoins, refIdFieldName, recordIdMapping, recordRecoverIdMapping) {
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
    PDocDataService.prototype.generateImportRecordQuery = function (record) {
        return {
            where: {
                name_s: {
                    'in': [record.name]
                },
                langkeys_ss: {
                    'in': [record.langkeys]
                },
                profiles_ss: {
                    'in': [record.profiles]
                },
                type_txt: {
                    'in': [record.type.toLowerCase()]
                }
            }
        };
    };
    PDocDataService.prototype.addAdditionalActionTagForms = function (origRecord, newRecord, actionTagForms) {
    };
    return PDocDataService;
}(cdoc_data_service_1.CommonDocDataService));
exports.PDocDataService = PDocDataService;
//# sourceMappingURL=pdoc-data.service.js.map