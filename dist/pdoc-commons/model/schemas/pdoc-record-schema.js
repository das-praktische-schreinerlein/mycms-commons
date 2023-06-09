"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var base_entity_record_schema_1 = require("../../../search-commons/model/schemas/base-entity-record-schema");
var js_data_1 = require("js-data");
exports.PDocRecordSchema = new js_data_1.Schema({
    $schema: 'http://json-schema.org/draft-04/schema#',
    title: 'PDoc',
    description: 'Schema for a PDoc Record.',
    extends: base_entity_record_schema_1.BaseEntityRecordSchema,
    type: 'object',
    properties: {
        // TODO sync with model
        pageId: { type: 'number' },
        blocked: { type: 'number' },
        // TODO: add type validation ifor date in later version -> but date-values can be string|Date
        dateshow: {},
        css: { type: 'string' },
        descTxt: { type: 'string' },
        descMd: { type: 'string' },
        descHtml: { type: 'string' },
        flags: { type: 'string' },
        heading: { type: 'string' },
        image: { type: 'string' },
        key: { type: 'string' },
        langkeys: { type: 'string' },
        name: { type: 'string', minLength: 1, maxLength: 255 },
        profiles: { type: 'string' },
        subSectionIds: { type: 'string' },
        teaser: { type: 'string' },
        theme: { type: 'string' },
        type: { type: 'string' }
    }
});
//# sourceMappingURL=pdoc-record-schema.js.map