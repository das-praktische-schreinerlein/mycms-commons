"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mapper_utils_1 = require("../../../search-commons/services/mapper.utils");
// TODO sync with model
var SqlPageConfig = /** @class */ (function () {
    function SqlPageConfig() {
    }
    SqlPageConfig.tableConfig = {
        key: 'page',
        tableName: 'page',
        selectFrom: 'page',
        optionalGroupBy: [
            {
                from: 'INNER JOIN (SELECT pg_id AS id FROM page WHERE pg_key' +
                    '              IN (SELECT DISTINCT pg_key AS name' +
                    '                  FROM page GROUP BY name HAVING COUNT(*) > 1)' +
                    '             ) doublettes' +
                    '             ON page.pg_id=doublettes.id',
                triggerParams: ['doublettes'],
                groupByFields: []
            },
        ],
        groupbBySelectFieldList: true,
        groupbBySelectFieldListIgnore: [],
        loadDetailData: [],
        selectFieldList: [
            '"PAGE" AS type',
            'CONCAT("PAGE", "_", page.pg_id) AS id',
            'pg_key',
            'page.pg_id',
            'pg_name',
            'pg_descmd',
            'pg_css',
            'pg_flags',
            'pg_heading',
            'pg_image',
            'pg_langkeys',
            'pg_profiles',
            'pg_subsectionids',
            'pg_teaser',
            'pg_theme',
            'pg_subtype',
        ],
        facetConfigs: {
            // dashboard
            'doublettes': {
                selectSql: 'SELECT COUNT(page.pg_id) AS count, "doublettes" AS value,' +
                    ' "doublettes" AS label, "true" AS id' +
                    ' FROM page INNER JOIN (SELECT pg_id AS id FROM page WHERE pg_key' +
                    '              IN (SELECT DISTINCT pg_key AS name' +
                    '                  FROM page GROUP BY name HAVING COUNT(*) > 1)' +
                    '             ) doublettes' +
                    '             ON page.pg_id=doublettes.id',
                cache: {
                    useCache: false
                }
            },
            'todoDesc': {
                selectSql: 'SELECT COUNT(page.pg_id) AS count, "todoDesc" AS value,' +
                    ' "todoDesc" AS label, "true" AS id' +
                    ' FROM page WHERE pg_descmd LIKE "TODODESC%"',
                filterField: 'page.pg_descmd',
                action: mapper_utils_1.AdapterFilterActions.LIKE
            },
            // common
            'id_notin_is': {
                filterField: 'CONCAT("PAGE", "_", page.pg_id)',
                action: mapper_utils_1.AdapterFilterActions.NOTIN
            },
            'initial_s': {
                selectSql: 'SELECT COUNT(*) as count, ' +
                    ' SUBSTR(UPPER(pg_name), 1, 1) as value ' +
                    'FROM page ' +
                    'WHERE LENGTH(pg_name) > 0 ' +
                    'GROUP BY SUBSTR(UPPER(pg_name), 1, 1)' +
                    'ORDER BY value',
            },
            'type_txt': {
                constValues: ['page'],
                filterField: '"page"',
                selectLimit: 1
            },
            'key_ss': {
                selectSql: 'SELECT COUNT(*) as count, ' +
                    ' LOWER(pg_key) as value ' +
                    'FROM page ' +
                    'WHERE LENGTH(pg_key) > 0 ' +
                    'GROUP BY LOWER(pg_key)' +
                    'ORDER BY value',
                filterField: 'page.pg_key',
                action: mapper_utils_1.AdapterFilterActions.IN
            },
            'flags_ss': {
                selectSql: 'SELECT COUNT(*) as count, ' +
                    ' LOWER(pg_flags) as value ' +
                    'FROM page ' +
                    'WHERE LENGTH(pg_flags) > 0 ' +
                    'GROUP BY LOWER(pg_flags)' +
                    'ORDER BY value',
                filterField: 'page.pg_flags',
                action: mapper_utils_1.AdapterFilterActions.LIKE
            },
            'profiles_ss': {
                selectSql: 'SELECT COUNT(*) as count, ' +
                    ' LOWER(pg_profiles) as value ' +
                    'FROM page ' +
                    'WHERE LENGTH(pg_profiles) > 0 ' +
                    'GROUP BY LOWER(pg_profiles)' +
                    'ORDER BY value',
                filterField: 'page.pg_profiles',
                action: mapper_utils_1.AdapterFilterActions.LIKE
            },
            'langkeys_ss': {
                selectSql: 'SELECT COUNT(*) as count, ' +
                    ' LOWER(pg_langkeys) as value ' +
                    'FROM page ' +
                    'WHERE LENGTH(pg_langkeys) > 0 ' +
                    'GROUP BY LOWER(pg_langkeys)' +
                    'ORDER BY value',
                filterField: 'page.pg_langkeys',
                action: mapper_utils_1.AdapterFilterActions.LIKE
            },
            'subtype_ss': {
                selectSql: 'SELECT COUNT(*) as count, ' +
                    ' LOWER(pg_subtype) as value ' +
                    'FROM page ' +
                    'WHERE LENGTH(pg_subtype) > 0 ' +
                    'GROUP BY LOWER(pg_subtype)' +
                    'ORDER BY value',
                filterField: 'page.pg_subtype',
                action: mapper_utils_1.AdapterFilterActions.IN
            },
            'theme_ss': {
                selectSql: 'SELECT COUNT(*) as count, ' +
                    ' LOWER(pg_theme) as value ' +
                    'FROM page ' +
                    'WHERE LENGTH(pg_theme) > 0 ' +
                    'GROUP BY LOWER(pg_theme)' +
                    'ORDER BY value',
                filterField: 'page.pg_theme',
                action: mapper_utils_1.AdapterFilterActions.IN
            }
        },
        sortMapping: {
            'name': 'pg_name ASC',
            'type': 'pg_typ ASC, pg_name ASC',
            'langkeys': 'pg_langkeys ASC, pg_name ASC',
            'subtype': 'pg_subtype ASC, pg_name ASC',
            'theme': 'pg_theme ASC, pg_name ASC',
            'forExport': 'page.pg_id ASC, pg_name ASC',
            'relevance': 'page.pg_id DESC, pg_name ASC'
        },
        filterMapping: {
            // dashboard
            doublettes: '"doublettes"',
            todoDesc: '"todoDesc"',
            // common
            id: 'page.pg_id',
            page_id_i: 'page.pg_id',
            page_id_is: 'page.pg_id',
            initial_s: 'SUBSTR(UPPER(pg_name), 1, 1)',
            html: 'CONCAT(pg_name, " ",' +
                ' COALESCE(pg_subtype, ""), " ",' +
                ' COALESCE(pg_heading, ""), " ",' +
                ' COALESCE(pg_teaser, ""), " ",' +
                ' COALESCE(pg_theme, ""), " ",' +
                ' COALESCE(pg_descmd, ""))',
            htmlNameOnly: 'pg_name'
        },
        writeMapping: {
            'page.pg_descmd': ':desc_txt:',
            'page.pg_subtype': ':subtype_s:',
            'page.pg_key': ':key_s:',
            'page.pg_name': ':name_s:',
            'page.pg_css': ':css_s:',
            'page.pg_flags': ':flags_s:',
            'page.pg_heading': ':heading_s:',
            'page.pg_image': ':image_s:',
            'page.pg_langkeys': ':langkeys_s:',
            'page.pg_profiles': ':profiles_s:',
            'page.pg_subsectionids': ':subsectionids_s:',
            'page.pg_teaser': ':teaser_s:',
            'page.pg_theme': ':theme_s:',
        },
        fieldMapping: {
            id: 'id',
            page_id_i: 'pg_id',
            page_id_is: 'pg_id',
            desc_txt: 'pg_descmd',
            desc_md_txt: 'pg_descmd',
            desc_html_txt: 'pg_descmd',
            keywords_txt: 'pg_keywords',
            name_s: 'pg_name',
            type_s: 'type',
            subtype_s: 'pg_subtype',
            key_s: 'pg_key',
            css_s: 'pg_css',
            flags_s: 'pg_flags',
            heading_s: 'pg_heading',
            image_s: 'pg_image',
            langkeys_s: 'pg_langkeys',
            profiles_s: 'pg_profiles',
            subsectionids_s: 'pg_subsectionids',
            teaser_s: 'pg_teaser',
            theme_s: 'pg_theme'
        }
    };
    SqlPageConfig.actionTagAssignConfig = {
        table: 'page',
        idField: 'pg_id',
        references: {}
    };
    SqlPageConfig.actionTagReplaceConfig = {
        table: 'page',
        fieldId: 'pg_id',
        referenced: [],
        joins: []
    };
    return SqlPageConfig;
}());
exports.SqlPageConfig = SqlPageConfig;
//# sourceMappingURL=sql-page.config.js.map