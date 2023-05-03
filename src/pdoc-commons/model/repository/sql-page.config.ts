import {TableConfig} from '../../../search-commons/services/sql-query.builder';
import {ActionTagReplaceTableConfigType} from '../../../action-commons/actiontags/common-sql-actiontag-replace.adapter';
import {ActionTagAssignTableConfigType} from '../../../action-commons/actiontags/common-sql-actiontag-assign.adapter';
import {AdapterFilterActions} from '../../../search-commons/services/mapper.utils';

// TODO sync with model
export class SqlPageConfig {
    public static readonly tableConfig: TableConfig = {
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
        loadDetailData: [
        ],
        selectFieldList: [
            '"PAGE" AS type',
            'CONCAT("PAGE", "_", page.pg_id) AS id',
            'pg_key',
            'page.pg_id',
            'pg_name',
            'pg_descmd',
            'pg_langkey',
            'pg_css',
            'pg_heading',
            'pg_image',
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
                action: AdapterFilterActions.LIKE
            },
            // common
            'id_notin_is': {
                filterField: 'CONCAT("PAGE", "_", page.pg_id)',
                action: AdapterFilterActions.NOTIN
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
                action: AdapterFilterActions.IN
            },
            'langkey_ss': {
                selectSql: 'SELECT COUNT(*) as count, ' +
                    ' LOWER(pg_langkey) as value ' +
                    'FROM page ' +
                    'WHERE LENGTH(pg_langkey) > 0 ' +
                    'GROUP BY LOWER(pg_langkey)' +
                    'ORDER BY value',
                filterField: 'page.pg_langkey',
                action: AdapterFilterActions.IN
            },
            'subtype_ss': {
                selectSql: 'SELECT COUNT(*) as count, ' +
                    ' LOWER(pg_subtype) as value ' +
                    'FROM page ' +
                    'WHERE LENGTH(pg_subtype) > 0 ' +
                    'GROUP BY LOWER(pg_subtype)' +
                    'ORDER BY value',
                filterField: 'page.pg_subtype',
                action: AdapterFilterActions.IN
            },
            'theme_ss': {
                selectSql: 'SELECT COUNT(*) as count, ' +
                    ' LOWER(pg_theme) as value ' +
                    'FROM page ' +
                    'WHERE LENGTH(pg_theme) > 0 ' +
                    'GROUP BY LOWER(pg_theme)' +
                    'ORDER BY value',
                filterField: 'page.pg_theme',
                action: AdapterFilterActions.IN
            }
        },
        sortMapping: {
            'name': 'pg_name ASC',
            'type': 'pg_typ ASC, pg_name ASC',
            'langkey': 'pg_langkey ASC, pg_name ASC',
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
            'page.pg_langkey': ':langkey_s:',
            'page.pg_css': ':css_s:',
            'page.pg_heading': ':heading_s:',
            'page.pg_image': ':image_s:',
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
            langkey_s: 'pg_langkey',
            css_s: 'pg_css',
            heading_s: 'pg_heading',
            image_s: 'pg_image',
            teaser_s: 'pg_teaser',
            theme_s: 'pg_theme'
        }
    };

    public static readonly actionTagAssignConfig: ActionTagAssignTableConfigType = {
        table: 'page',
        idField: 'pg_id',
        references: {
        }
    };

    public static readonly actionTagReplaceConfig: ActionTagReplaceTableConfigType = {
        table: 'page',
        fieldId: 'pg_id',
        referenced: [],
        joins: [
        ]
    };
}

