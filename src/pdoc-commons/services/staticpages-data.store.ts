import {SearchParameterUtils} from '../../search-commons/services/searchparameter.utils';
import {PDocDataStore} from "./pdoc-data.store";

export class StaticPagesDataStore extends PDocDataStore {

    constructor(searchParameterUtils: SearchParameterUtils) {
        super(searchParameterUtils);
    }

}
