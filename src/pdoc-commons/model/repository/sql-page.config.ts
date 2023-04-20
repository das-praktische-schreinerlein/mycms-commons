import {TableConfig} from '../../../search-commons/services/sql-query.builder';
import {ActionTagBlockTableConfigType} from '../../../action-commons/actiontags/common-sql-actiontag-block.adapter';
import {ActionTagReplaceTableConfigType} from '../../../action-commons/actiontags/common-sql-actiontag-replace.adapter';
import {ActionTagAssignTableConfigType} from '../../../action-commons/actiontags/common-sql-actiontag-assign.adapter';
import {AdapterFilterActions} from '../../../search-commons/services/mapper.utils';
import {KeywordModelConfigJoinType} from '../../../action-commons/actions/common-sql-keyword.adapter';
import {PlaylistModelConfigJoinType} from '../../../action-commons/actions/common-sql-playlist.adapter';

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
            'page.pg_name',
            'pg_descmd'
            // TODO
            //   pg_langkey VARCHAR(255) NOT NULL,
            //   pg_name VARCHAR(255) NOT NULL,
            //   pg_css TEXT,
            //   pg_descmd TEXT,
            //   pg_heading TEXT,
            //   pg_image VARCHAR(255),
            //   pg_teaser VARCHAR(255),
            //   pg_theme VARCHAR(255),
            //   pg_subtype VARCHAR(255),
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
            }
            // TODO
            //   pg_langkey VARCHAR(255) NOT NULL,
            //   pg_subtype VARCHAR(255),
        },
        sortMapping: {
            'name': 'pg_name ASC',
            'type': 'pg_typ ASC, pg_name ASC',
            // TODO
            //   pg_langkey VARCHAR(255) NOT NULL,
            //   pg_theme VARCHAR(255),
            //   pg_subtype VARCHAR(255),
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
            html: 'CONCAT(pg_name, " ", COALESCE(pg_descmd,""))',
            htmlNameOnly: 'pg_name'
            // TODO
            //   pg_langkey VARCHAR(255) NOT NULL,
            //   pg_name VARCHAR(255) NOT NULL,
            //   pg_heading TEXT,
            //   pg_teaser VARCHAR(255),
            //   pg_theme VARCHAR(255),
            //   pg_subtype VARCHAR(255),
        },
        writeMapping: {
            'page.pg_descmd': ':desc_txt:',
            'page.pg_subtype': ':subtype_s:',
            'page.pg_key': ':key_s:',
            'page.pg_name': ':name_s:'
            // TODO
            //   pg_langkey VARCHAR(255) NOT NULL,
            //   pg_css TEXT,
            //   pg_heading TEXT,
            //   pg_image VARCHAR(255),
            //   pg_teaser VARCHAR(255),
            //   pg_theme VARCHAR(255),
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
            type_s: 'type'
            // TODO
            //   pg_langkey VARCHAR(255) NOT NULL,
            //   pg_css TEXT,
            //   pg_heading TEXT,
            //   pg_image VARCHAR(255),
            //   pg_teaser VARCHAR(255),
            //   pg_theme VARCHAR(255),
            //   pg_subtype VARCHAR(255),
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

