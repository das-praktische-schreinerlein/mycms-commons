import { Adapter } from 'js-data-adapter';
import { Mapper, Record } from 'js-data';
import { GenericSearchResult } from '../model/container/generic-searchresult';
import { GenericSearchForm } from '../model/forms/generic-searchform';
export declare abstract class GenericInMemoryAdapter<R extends Record, F extends GenericSearchForm, S extends GenericSearchResult<R, F>> extends Adapter {
    constructor(config: any);
    _count(mapper: Mapper, query: any, opts?: any): Promise<any>;
    _create(mapper: any, props: any, opts?: any): Promise<any>;
    _createMany(mapper: any, props: any, opts?: any): Promise<any>;
    _destroy(mapper: any, id: string | number, opts?: any): Promise<any>;
    _destroyAll(mapper: any, query: any, opts?: any): Promise<any>;
    _find(mapper: any, id: string | number, opts?: any): Promise<any>;
    _findAll(mapper: any, query: any, opts?: any): Promise<any>;
    _sum(mapper: any, field: any, query: any, opts?: any): Promise<any>;
    _update(mapper: any, id: any, props: any, opts?: any): Promise<any>;
    _updateAll(mapper: any, props: any, query: any, opts?: any): Promise<any>;
    _updateMany(mapper: any, records: any, opts?: any): Promise<any>;
}
