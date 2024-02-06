import {BaseEntityRecordSchema} from '../../../search-commons/model/schemas/base-entity-record-schema';
import {Schema} from 'js-data';

export const PDocRecordSchema = new Schema({
    $schema: 'http://json-schema.org/draft-04/schema#',
    title: 'PDoc',
    description: 'Schema for a PDoc Record.',
    extends: BaseEntityRecordSchema,
    type: 'object',
    properties: {
        // TODO sync with model
        pageId: {type: 'number'},

        blocked: {type: 'number'},

        // TODO: add type validation for date in later version -> but date-values can be string|Date
        dateshow: {},

        // TODO: add type validation for date in later version -> but date-values can be string|Date
        createdAt: {},
        updatedAt: {},
        updateVersion: {type: 'number'},

        css: {type: 'string'},
        descTxt: {type: 'string'},
        descMd: {type: 'string'},
        descHtml: {type: 'string'},
        flags: {type: 'string'},
        heading: {type: 'string'},
        image: {type: 'string'},
        key: {type: 'string'},
        langkeys: {type: 'string'},
        name: {type: 'string', minLength: 1, maxLength: 255},
        profiles: {type: 'string'},
        sortkey: {type: 'string'},
        subSectionIds: {type: 'string'},
        subtype: {type: 'string'},
        teaser: {type: 'string'},
        theme: {type: 'string'},
        type: {type: 'string'}
    }
});
