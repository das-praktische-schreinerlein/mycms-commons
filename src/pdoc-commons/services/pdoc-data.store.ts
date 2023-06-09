import {GenericDataStore} from '../../search-commons/services/generic-data.store';
import {PDocSearchResult} from '../model/container/pdoc-searchresult';
import {PDocSearchForm} from '../model/forms/pdoc-searchform';
import {PDocRecord, PDocRecordRelation} from '../model/records/pdoc-record';
import {Facets} from '../../search-commons/model/container/facets';
import {SearchParameterUtils} from '../../search-commons/services/searchparameter.utils';

export class PDocDataStore extends GenericDataStore<PDocRecord, PDocSearchForm, PDocSearchResult> {

    static UPDATE_RELATION = [].concat(PDocRecordRelation.hasOne ? Object.keys(PDocRecordRelation.hasOne) : [])
        .concat(PDocRecordRelation.hasMany ? Object.keys(PDocRecordRelation.hasMany) : []);
    private validMoreNumberFilterNames = {
        page_id_i: true,
        page_id_is: true
    };
    private validMoreInFilterNames = {
        id: true,
        id_notin_is: true,
        doublettes: true,
        noSubType: true,
        key_ss: true,
        flags_ss: true,
        langkeys_ss: true,
        profiles_ss: true,
        initial_s: true,
        theme_ss: true,
        todoDesc: true,
        todoKeywords: true
    };

    constructor(private searchParameterUtils: SearchParameterUtils) {
        super([]);
    }

    createQueryFromForm(searchForm: PDocSearchForm): Object {
        const query = {};

        if (searchForm === undefined) {
            return query;
        }

        let filter: {} = undefined;
        if (searchForm.fulltext !== undefined && searchForm.fulltext.length > 0) {
            filter = filter || {};
            filter['html'] = {
                'likein': searchForm.fulltext.split(' OR ')
            };
        }

        if (searchForm.type !== undefined && searchForm.type.length > 0) {
            filter = filter || {};
            filter['type_txt'] = {
                'in': searchForm.type.split(/,/)
            };
        }
        if (searchForm.subtype !== undefined && searchForm.subtype.length > 0) {
            filter = filter || {};
            filter['subtype_ss'] = {
                'in': searchForm.subtype.split(/,/)
            };
        }

        if (searchForm.initial !== undefined && searchForm.initial.length > 0) {
            filter = filter || {};
            filter['initial_s'] = {
                'in': searchForm.initial.split(/,/)
            };
        }

        if (searchForm.moreFilter !== undefined && searchForm.moreFilter.length > 0) {
            filter = filter || {};
            const moreFilters = searchForm.moreFilter.split(/;/);
            for (const index in moreFilters) {
                const moreFilter = moreFilters[index];
                const [filterName, values] = moreFilter.split(/:/);
                if (filterName && values && this.validMoreNumberFilterNames[filterName] === true) {
                    filter[filterName] = {
                        'in_number': values.split(/,/)
                    };
                } else if (filterName && values && this.validMoreInFilterNames[filterName] === true) {
                    filter[filterName] = {
                        'in': values.split(/,/)
                    };
                }
            }
        }

        if (searchForm.flags !== undefined && searchForm.flags.length > 0) {
            filter = filter || {};
            filter['flags_ss'] = {
                'in': searchForm.flags.split(/,/)
            };
        }

        if (searchForm.langkeys !== undefined && searchForm.langkeys.length > 0) {
            filter = filter || {};
            filter['langkeys_ss'] = {
                'in': searchForm.langkeys.split(/,/)
            };
        }

        if (searchForm.profiles !== undefined && searchForm.profiles.length > 0) {
            filter = filter || {};
            filter['profiles_ss'] = {
                'in': searchForm.profiles.split(/,/)
            };
        }
        
        if (filter !== undefined) {
            query['where'] = filter;
        }

        return query;
    }

    createSearchResult(searchForm: PDocSearchForm, recordCount: number, records: PDocRecord[], facets: Facets): PDocSearchResult {
        return new PDocSearchResult(searchForm, recordCount, records, facets);
    }

}
