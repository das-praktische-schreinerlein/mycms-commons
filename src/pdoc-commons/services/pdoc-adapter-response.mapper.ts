import {Mapper, Record} from 'js-data';
import {PDocRecord, PDocRecordFactory, PDocRecordRelation} from '../model/records/pdoc-record';
import {MapperUtils} from '../../search-commons/services/mapper.utils';
import {GenericAdapterResponseMapper} from '../../search-commons/services/generic-adapter-response.mapper';
import {BeanUtils} from '../../commons/utils/bean.utils';
import {ObjectUtils} from '../../commons/utils/object.utils';

export class PDocAdapterResponseMapper implements GenericAdapterResponseMapper {
    private readonly _objectSeparator = ';;';
    private readonly _fieldSeparator = ':::';
    private readonly _valueSeparator = '=';

    protected mapperUtils = new MapperUtils(this._objectSeparator, this._fieldSeparator, this._valueSeparator);
    protected config: {} = {};

    public static generateDoubletteValue(value: string): string {
        return MapperUtils.generateDoubletteValue(value);
    }

    constructor(config: any) {
        this.config = config;
    }

    mapToAdapterDocument(mapping: {}, props: PDocRecord): any {
        const values = {};
        values['id'] = props.id;

        values['blocked_i'] = props.blocked;
        values['dateshow_dt'] = props.dateshow;
        values['desc_txt'] = props.descTxt;
        values['desc_md_txt'] = props.descMd;
        values['desc_html_txt'] = props.descHtml;
        values['keywords_txt'] =
            (props.keywords ? props.keywords.split(', ').join(',') : '');
        values['name_s'] = props.name;
        values['key_s'] = MapperUtils.generateDoubletteValue(props.name);
        values['playlists_txt'] =
            (props.playlists ? props.playlists.split(', ').join(',,') : '');
        values['type_s'] = props.type;
        values['subtype_s'] = props.subtype;

        values['html_txt'] = [
            values['desc_txt'],
            values['name_s'],
            values['keywords_txt'],
            values['type_s']].join(' ');


        return values;
    }

    mapDetailDataToAdapterDocument(mapping: {}, profile: string, props: any, result: {}): void {
        switch (profile) {
        }
    }

    mapValuesToRecord(mapper: Mapper, values: {}): PDocRecord {
        const record = PDocRecordFactory.createSanitized(values);
        this.mapperUtils.mapValuesToSubRecords(mapper, values, record, PDocRecordRelation);

        return record;
    }

    mapResponseDocument(mapper: Mapper, doc: any, mapping: {}): Record {
        const values = {};
        values['id'] = this.mapperUtils.getMappedAdapterValue(mapping, doc, 'id', undefined);
        const subtypeField = doc[this.mapperUtils.mapToAdapterFieldName(mapping, 'subtypes_ss')];
        if (subtypeField !== undefined && Array.isArray(subtypeField)) {
            values['subtypes'] = subtypeField.join(',');
        }
        values['blocked'] = this.mapperUtils.getMappedAdapterNumberValue(mapping, doc, 'blocked_i', undefined);
        values['dateshow'] = this.mapperUtils.getMappedAdapterDateTimeValue(mapping, doc, 'dateshow_dt', undefined);
        values['descTxt'] = this.mapperUtils.getMappedAdapterValue(mapping, doc, 'desc_txt', undefined);
        values['descHtml'] = this.mapperUtils.getMappedAdapterValue(mapping, doc, 'desc_html_txt', undefined);
        values['descMd'] = this.mapperUtils.getMappedAdapterValue(mapping, doc, 'desc_md_txt', undefined);

        const origKeywordsArr = this.mapperUtils.getMappedAdapterValue(mapping, doc, 'keywords_txt', '').split(',');
        const replaceKeywordPatterns = BeanUtils.getValue(this.config, 'mapperConfig.replaceKeywordPatterns');
        let srcKeywordsArr = [];
        if (replaceKeywordPatterns && replaceKeywordPatterns.length > 0) {
            for (let keyword of origKeywordsArr) {
                keyword = keyword.trim();
                if (keyword === '') {
                    continue;
                }

                for (const pattern of replaceKeywordPatterns) {
                    keyword = keyword.replace(new RegExp(pattern[0]), pattern[1]);
                }

                srcKeywordsArr.push(keyword);
            }
        } else {
            srcKeywordsArr = [].concat(origKeywordsArr);
        }

        const allowedKeywordPatterns = BeanUtils.getValue(this.config, 'mapperConfig.allowedKeywordPatterns');
        let newKeywordsArr = [];
        for (let keyword of srcKeywordsArr) {
            keyword = keyword.trim();
            if (keyword === '') {
                continue;
            }

            if (allowedKeywordPatterns && allowedKeywordPatterns.length > 0) {
                for (const pattern of allowedKeywordPatterns) {
                    if (keyword.match(new RegExp(pattern))) {
                        newKeywordsArr.push(keyword);
                        break;
                    }
                }
            } else {
                newKeywordsArr.push(keyword);
            }
        }

        newKeywordsArr = ObjectUtils.uniqueArray(newKeywordsArr);
        values['keywords'] = newKeywordsArr.join(', ');

        values['name'] = this.mapperUtils.getMappedAdapterValue(mapping, doc, 'name_s', undefined);
        values['playlists'] = this.mapperUtils.getMappedAdapterValue(mapping, doc, 'playlists_txt', '')
            .replace(/[,]+/g, ',').split(',').join(', ');
        values['subtype'] = this.mapperUtils.getMappedAdapterValue(mapping, doc, 'subtype_s', undefined);
        values['type'] = this.mapperUtils.getMappedAdapterValue(mapping, doc, 'type_s', undefined);

        // console.log('mapResponseDocument values:', values);
        const record: PDocRecord = <PDocRecord>mapper.createRecord(
            PDocRecordFactory.instance.getSanitizedValues(values, {}));

        return record;
    }

    mapDetailResponseDocuments(mapper: Mapper, profile: string, src: Record, docs: any[]): void {
        const record: PDocRecord = <PDocRecord>src;
        switch (profile) {
            case 'keywords':
                record.keywords = ObjectUtils.mergePropertyValues(docs, 'keywords', ', ', true);
                break;
        }
    }
}

