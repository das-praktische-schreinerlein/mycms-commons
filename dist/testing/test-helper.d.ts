import 'rxjs/add/observable/fromPromise';
export declare class TestHelper {
    static createKnex(client: string, returnValues: any[]): {
        client: {
            config: {
                client: string;
            };
        };
        sqls: any[];
        params: any[];
        returnValues: any[];
        raw: (sql: any, params: any) => Promise<any>;
        resetTestResults: (newReturnValues: any[]) => void;
    };
    static doTestSuccessWithSqlsTest(knex: any, promiseFunction: any, result: any, sqls: string[], parameters: any[], done: any, newReturnValue?: any[]): any;
    static doTestFailWithSqlsTest(knex: any, promiseFunction: any, errorMsg: string, sqls: string[], parameters: any[], done: any, newReturnValue?: any[]): any;
}
