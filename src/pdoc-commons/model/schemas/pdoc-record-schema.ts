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

        // TODO: add type validation ifor date in later version -> but date-values can be string|Date
        dateshow: {},

        css: {type: 'string'},
        descTxt: {type: 'string'},
        descMd: {type: 'string'},
        descHtml: {type: 'string'},
        flgShowSearch: {type: 'boolean'},
        flgShowNews:  {type: 'boolean'},
        flgShowTopTen: {type: 'boolean'},
        flgShowAdminArea: {type: 'boolean'},
        flgShowDashboard: {type: 'boolean'},
        flags: {type: 'array', items: {type: 'string'}},
        heading: {type: 'string'},
        image: {type: 'string'},
        key: {type: 'string'},
        keywords: {type: 'string'},
        langkey: {type: 'string'},
        name: {type: 'string', minLength: 1, maxLength: 255},
        subSectionIds: {type: 'string'},
        teaser: {type: 'string'},
        theme: {type: 'string'},
        type: {type: 'string'}
    }
});
