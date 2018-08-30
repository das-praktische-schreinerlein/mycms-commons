"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var js_data_1 = require("js-data");
var base_entity_record_1 = require("../records/base-entity-record");
exports.BaseEntityRecordSchema = new js_data_1.Schema({
    $schema: 'http://json-schema.org/draft-04/schema#',
    title: 'BaseEntity',
    description: 'Schema for BaseEntity Records.',
    type: 'object',
    properties: {
        id: {
            type: 'string',
        }
    }
});
exports.BaseEntityRecordSchema.apply(base_entity_record_1.BaseEntityRecord.prototype);
//# sourceMappingURL=base-entity-record-schema.js.map