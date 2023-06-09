import {TableConfig} from '../../../search-commons/services/sql-query.builder';
import {ActionTagReplaceTableConfigType} from '../../../action-commons/actiontags/common-sql-actiontag-replace.adapter';
import {ActionTagAssignTableConfigType} from '../../../action-commons/actiontags/common-sql-actiontag-assign.adapter';
import {AdapterFilterActions} from '../../../search-commons/services/mapper.utils';
import {KeywordModelConfigJoinType} from '../../../action-commons/actions/common-sql-keyword.adapter';

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
            {
                from:  'LEFT JOIN page_props flag_page_props ON page.pg_id=flag_page_props.pg_id ' +
                    'LEFT JOIN props flag_props ON flag_page_props.pr_id=flag_props.pr_id ' +
                    'AND flag_props.pr_name LIKE "flg_%" ',
                triggerParams: ['id', 'flags_ss'],
                groupByFields: ['GROUP_CONCAT(DISTINCT flag_props.pr_name ORDER BY flag_props.pr_name SEPARATOR ", ") AS pg_flags']
            },
            {
                from:  'LEFT JOIN page_props langkey_page_props ON page.pg_id=langkey_page_props.pg_id ' +
                    'LEFT JOIN props langkey_props ON langkey_page_props.pr_id=langkey_props.pr_id ' +
                    'AND langkey_props.pr_name LIKE "lang_%" ',
                triggerParams: ['id', 'langkeys_ss'],
                groupByFields: ['GROUP_CONCAT(DISTINCT langkey_props.pr_name ORDER BY langkey_props.pr_name SEPARATOR ", ") AS pg_langkeys']
            },
            {
                from:  'LEFT JOIN page_props profile_page_props ON page.pg_id=profile_page_props.pg_id ' +
                    'LEFT JOIN props profile_props ON profile_page_props.pr_id=profile_props.pr_id ' +
                    'AND profile_props.pr_name LIKE "profile_%" ',
                triggerParams: ['id', 'profiles_ss'],
                groupByFields: ['GROUP_CONCAT(DISTINCT profile_props.pr_name ORDER BY profile_props.pr_name SEPARATOR ", ") AS pg_profiles']
            }
        ],
        groupbBySelectFieldList: true,
        groupbBySelectFieldListIgnore: ['pg_flags', 'pg_langkeys', 'pg_profiles'],
        loadDetailData: [
            {
                profile: 'flags',
                sql:  'SELECT GROUP_CONCAT(DISTINCT flag_props.pr_name ORDER BY flag_props.pr_name SEPARATOR ", ") AS flags ' +
                    'FROM page_props flag_page_props ' +
                    ' INNER JOIN props flag_props ON flag_page_props.pr_id=flag_props.pr_id ' +
                    'WHERE flag_page_props.pg_id in (:id) AND flag_props.pr_name LIKE "flg_%" ',
                parameterNames: ['id'],
            },
            {
                profile: 'langkeys',
                sql:  'SELECT GROUP_CONCAT(DISTINCT langkey_props.pr_name ORDER BY langkey_props.pr_name SEPARATOR ", ") AS langkeys ' +
                    'FROM page_props langkey_page_props ' +
                    ' INNER JOIN props langkey_props ON langkey_page_props.pr_id=langkey_props.pr_id ' +
                    'WHERE langkey_page_props.pg_id in (:id) AND langkey_props.pr_name LIKE "lang_%" ',
                parameterNames: ['id'],
            },
            {
                profile: 'profiles',
                sql:  'SELECT GROUP_CONCAT(DISTINCT profile_props.pr_name ORDER BY profile_props.pr_name SEPARATOR ", ") AS profiles ' +
                    'FROM page_props profile_page_props ' +
                    ' INNER JOIN props profile_props ON profile_page_props.pr_id=profile_props.pr_id ' +
                    'WHERE profile_page_props.pg_id in (:id) AND profile_props.pr_name LIKE "profile_%" ',
                parameterNames: ['id'],
            }
        ],
        selectFieldList: [
            '"PAGE" AS type',
            'CONCAT("PAGE", "_", page.pg_id) AS id',
            'pg_key',
            'page.pg_id',
            'pg_name',
            'pg_descmd',
            'pg_css',
            'pg_heading',
            'pg_image',
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
                    ' FROM page ' +
                    ' WHERE LENGTH(pg_name) > 0 ' +
                    ' GROUP BY SUBSTR(UPPER(pg_name), 1, 1)' +
                    ' ORDER BY value',
            },
            'type_txt': {
                constValues: ['page'],
                filterField: '"page"',
                selectLimit: 1
            },
            'key_ss': {
                selectSql: 'SELECT COUNT(*) as count, ' +
                    ' pg_key as value ' +
                    ' FROM page ' +
                    ' WHERE LENGTH(pg_key) > 0 ' +
                    ' GROUP BY pg_key ' +
                    ' ORDER BY value',
                filterField: 'page.pg_key',
                action: AdapterFilterActions.IN
            },
            'flags_ss': {
                selectSql: 'SELECT COUNT(page.pg_id) AS count, pr_name AS value,' +
                    ' pr_name AS label, pr_name AS id' +
                    ' FROM page' +
                    ' INNER JOIN page_props ON page.pg_id=page_props.pg_id' +
                    ' INNER JOIN props ON page_props.pr_id=props.pr_id ' +
                    ' WHERE props.pr_name LIKE "flg_%"' +
                    ' GROUP BY value' +
                    ' ORDER BY count desc',
                filterField: 'flag_props.pr_name',
                action: AdapterFilterActions.IN
            },
            'profiles_ss': {
                selectSql: 'SELECT COUNT(page.pg_id) AS count, pr_name AS value,' +
                    ' pr_name AS label, pr_name AS id' +
                    ' FROM page' +
                    ' INNER JOIN page_props ON page.pg_id=page_props.pg_id' +
                    ' INNER JOIN props ON page_props.pr_id=props.pr_id ' +
                    ' WHERE props.pr_name LIKE "profile_%"' +
                    ' GROUP BY value' +
                    ' ORDER BY count desc',
                filterField: 'profile_props.pr_name',
                action: AdapterFilterActions.IN
            },
            'langkeys_ss': {
                selectSql: 'SELECT COUNT(page.pg_id) AS count, pr_name AS value,' +
                    ' pr_name AS label, pr_name AS id' +
                    ' FROM page' +
                    ' INNER JOIN page_props ON page.pg_id=page_props.pg_id' +
                    ' INNER JOIN props ON page_props.pr_id=props.pr_id ' +
                    ' WHERE props.pr_name like "lang_%"' +
                    ' GROUP BY value' +
                    ' ORDER BY count desc',
                filterField: 'langkey_props.pr_name',
                action: AdapterFilterActions.IN
            },
            'subtype_ss': {
                selectSql: 'SELECT COUNT(*) as count, ' +
                    ' pg_subtype as value ' +
                    ' FROM page ' +
                    ' WHERE LENGTH(pg_subtype) > 0 ' +
                    ' GROUP BY pg_subtype ' +
                    ' ORDER BY value',
                filterField: 'page.pg_subtype',
                action: AdapterFilterActions.IN
            },
            'theme_ss': {
                selectSql: 'SELECT COUNT(*) as count, ' +
                    ' pg_theme as value ' +
                    ' FROM page ' +
                    ' WHERE LENGTH(pg_theme) > 0 ' +
                    ' GROUP BY pg_theme ' +
                    ' ORDER BY value',
                filterField: 'page.pg_theme',
                action: AdapterFilterActions.IN
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
            'page.pg_heading': ':heading_s:',
            'page.pg_image': ':image_s:',
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

    public static readonly keywordModelConfigType: KeywordModelConfigJoinType = {
        table: 'page', joinTable: 'page_props', fieldReference: 'pg_id'
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
            { table: 'page_props', fieldReference: 'pg_id' },
        ]
    };
}

