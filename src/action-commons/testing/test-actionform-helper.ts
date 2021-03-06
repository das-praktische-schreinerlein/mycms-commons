import {from} from 'rxjs';
import {ActionTagForm} from '../../commons/utils/actiontag.utils';

export class TestActionFormHelper {
    public static doActionTagTestSuccessTest(knex, service, functionName: string, table: string, id: any, actionForm: ActionTagForm,
                                             result: any, sqls: string[], parameters: any[], done, newReturnValue?: any[]): any {
        knex.resetTestResults(newReturnValue ? newReturnValue : [true]);

        // WHEN
        return from(service[functionName](table, id, actionForm, {})).subscribe(
            res => {
                // THEN
                expect(res).toEqual(result);
                expect(knex.sqls).toEqual(sqls);
                expect(knex.params).toEqual(parameters);
                done();
            },
            error => {
                expect(error).toBeUndefined();
                expect(false).toBeTruthy('should not fail');
                done();
            },
            () => {
                done();
            }
        );
    }

    public static doActionTagTestFailWithSqlsTest(knex, service, functionName: string, table: string, id: any, actionForm: ActionTagForm,
                                                  errorMsg: string, sqls: string[], parameters: any[], done, newReturnValue?: any[]): any {
        knex.resetTestResults(newReturnValue ? newReturnValue : [true]);

        // WHEN
        return from(service[functionName](table, id, actionForm, {})).subscribe(
            res => {
                // THEN
                expect(res).toBeUndefined();
                expect(false).toBeTruthy('should fail');
                done();
            },
            error => {
                expect(error).toEqual(errorMsg);
                expect(knex.sqls).toEqual(sqls);
                expect(knex.params).toEqual(parameters);
                done();
            },
            () => {
                done();
            }
        );
    }

    public static doActionTagFailTest(knex, service, functionName: string, table: string, id: any, actionForm: ActionTagForm,
                                      errorMsg: string, done, newReturnValue?: any[]): any {
        knex.resetTestResults(newReturnValue ? newReturnValue : [true]);

        // WHEN
        return from(service[functionName](table, id, actionForm, {})).subscribe(
            res => {
                // THEN
                expect(res).toBeUndefined();
                expect(false).toBeTruthy('should fail');
                done();
            },
            error => {
                expect(error).toEqual(errorMsg);
                done();
            },
            () => {
                done();
            }
        );
    }

    public static doActionTagTestInvalidPayloadTest(knex, service, functionName, action, done): any {
        const id: any = 7;
        return TestActionFormHelper.doActionTagFailTest(knex, service, functionName, 'table', id, {
            payload: undefined,
            deletes: false,
            key: action,
            recordId: id,
            type: 'tag'
        }, 'actiontag ' + action + ' playload expected', done);
    }

    public static doActionTagTestInvalidIdTest(knex, service, functionName, action, done): any {
        const id: any = 'a';
        return TestActionFormHelper.doActionTagFailTest(knex, service, functionName, 'table', id, {
            payload: {
                set: 0
            },
            deletes: false,
            key: action,
            recordId: id,
            type: 'tag'
        }, 'actiontag ' + action + ' id not an integer', done);
    }

    public static doActionTagFailInvalidTableTest(knex, service, functionName, action, payload, altErrorMsg, done): any {
        const id: any = 7;
        return TestActionFormHelper.doActionTagFailTest(knex, service, functionName, 'unknowntable', id, {
            payload: {
                ...payload
            },
            deletes: false,
            key: action,
            recordId: id,
            type: 'tag'
        }, altErrorMsg !== undefined ? altErrorMsg : 'actiontag ' + action + ' table not valid', done);
    }
}
