import {PDocRecord} from '../model/records/pdoc-record';
import {PDocSearchForm} from '../model/forms/pdoc-searchform';
import {PDocSearchResult} from '../model/container/pdoc-searchresult';
import {GenericSearchHttpAdapter} from '../../search-commons/services/generic-search-http.adapter';
import {PDocAdapterResponseMapper} from "./pdoc-adapter-response.mapper";
import {Mapper} from 'js-data';

export class PDocHttpAdapter extends GenericSearchHttpAdapter<PDocRecord, PDocSearchForm, PDocSearchResult> {
    private responseMapper: PDocAdapterResponseMapper;

    constructor(config: any) {
        super(config);
        this.responseMapper = new PDocAdapterResponseMapper(config);
    }

    create(mapper: Mapper, record: any, opts?: any): Promise<PDocRecord> {
        opts = opts || {};
        opts.endpoint = this.getHttpEndpoint('create');
        if (opts.realSource) {
            record = opts.realSource;
        }

        const props = this.mapRecordToAdapterValues(mapper, record);

        return super.create(mapper, props, opts);
    }

    update(mapper: Mapper, id: string | number, record: any, opts?: any): Promise<PDocRecord> {
        opts = opts || {};
        opts.endpoint = this.getHttpEndpoint('update');
        if (opts.realSource) {
            record = opts.realSource;
        }
        const props = this.mapRecordToAdapterValues(mapper, record);

        return super.update(mapper, id, props, opts);
    }

    getHttpEndpoint(method: string, format?: string): string {
        const findMethods = ['find', 'findAll'];
        const updateMethods = ['create', 'destroy', 'update'];
        if (findMethods.indexOf(method.toLowerCase()) >= 0) {
            return 'pdoc';
        }
        if (updateMethods.indexOf(method.toLowerCase()) >= 0) {
            return 'pdocwrite';
        }
        if (method.toLowerCase() === 'doactiontag') {
            return 'pdocaction';
        }
        if (method.toLowerCase() === 'export') {
            return 'pdocexport/' + format;
        }

        return 'pdocsearch';
    }

    private mapRecordToAdapterValues(mapper: Mapper, values: any): {} {
        let record = values;
        if (!(record instanceof PDocRecord)) {
            record = this.responseMapper.mapValuesToRecord(mapper, values);
        }

        return this.responseMapper.mapToAdapterDocument({}, record);
    }

}
