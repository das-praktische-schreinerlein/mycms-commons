import {PDocSearchForm} from '../forms/pdoc-searchform';
import {PDocRecord} from '../records/pdoc-record';
import {Facet, Facets} from '../../../search-commons/model/container/facets';
import {CommonDocSearchResult} from '../../../search-commons/model/container/cdoc-searchresult';

export class PDocSearchResult extends CommonDocSearchResult <PDocRecord, PDocSearchForm> {
    constructor(pdocSearchForm: PDocSearchForm, recordCount: number, currentRecords: PDocRecord[], facets: Facets) {
        super(pdocSearchForm, recordCount, currentRecords, facets);
    }

    toString() {
        return 'PDocSearchResult {\n' +
            '  facets: ' + this.facets + '' +
            '  currentRecords: ' + this.currentRecords + '' +
            '  recordCount: ' + this.recordCount + '' +
            '  searchFormGroup: ' + this.searchForm + '' +
            '}';
    }

    toSerializableJsonObj(anonymizeMedia?: boolean): {} {
        const result = {
            'recordCount': this.recordCount,
            'searchForm': this.searchForm,
            'currentRecords': [],
            'facets': {
                facets: {},
                selectLimits: {}
            }
        };
        if (Array.isArray(this.currentRecords)) {
            for (let i = 0; i < this.currentRecords.length; i++) {
                const record = PDocRecord.cloneToSerializeToJsonObj(this.currentRecords[i], anonymizeMedia);

                result.currentRecords.push(record);
            }
        }
        if (this.facets && this.facets.facets) {
            this.facets.facets.forEach((value: Facet, key: string) => {
                result.facets.facets[key] = this.facets.facets.get(key).facet;
                result.facets.selectLimits[key] = this.facets.facets.get(key).selectLimit;
            });
        }
        return result;
    }
}
