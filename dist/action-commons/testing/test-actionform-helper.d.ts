import 'rxjs/add/observable/fromPromise';
import { ActionTagForm } from '../../commons/utils/actiontag.utils';
export declare class TestActionFormHelper {
    static doActionTagTestSuccessTest(knex: any, service: any, functionName: string, table: string, id: any, actionForm: ActionTagForm, result: any, sqls: string[], parameters: any[], done: any, newReturnValue?: any[]): any;
    static doActionTagTestFailWithSqlsTest(knex: any, service: any, functionName: string, table: string, id: any, actionForm: ActionTagForm, errorMsg: string, sqls: string[], parameters: any[], done: any, newReturnValue?: any[]): any;
    static doActionTagFailTest(knex: any, service: any, functionName: string, table: string, id: any, actionForm: ActionTagForm, errorMsg: string, done: any, newReturnValue?: any[]): any;
    static doActionTagTestInvalidPayloadTest(knex: any, service: any, functionName: any, action: any, done: any): any;
    static doActionTagTestInvalidIdTest(knex: any, service: any, functionName: any, action: any, done: any): any;
    static doActionTagFailInvalidTableTest(knex: any, service: any, functionName: any, action: any, payload: any, altErrorMsg: any, done: any): any;
}
