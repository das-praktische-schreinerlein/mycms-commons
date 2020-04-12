"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var js_data_1 = require("js-data");
var rxjs_1 = require("rxjs");
var TestHelper = /** @class */ (function () {
    function TestHelper() {
    }
    TestHelper.createKnex = function (client, returnValues) {
        return {
            client: {
                config: {
                    client: client
                }
            },
            sqls: [],
            params: [],
            returnValues: returnValues.reverse(),
            raw: function (sql, params) {
                this.sqls.push(sql);
                this.params.push(params);
                var result = this.returnValues.pop();
                return js_data_1.utils.resolve(result);
            },
            resetTestResults: function (newReturnValues) {
                this.sqls = [];
                this.params = [];
                this.returnValues = newReturnValues.reverse();
            }
        };
    };
    TestHelper.doTestSuccessWithSqlsTest = function (knex, promiseFunction, result, sqls, parameters, done, newReturnValue) {
        knex.resetTestResults(newReturnValue ? newReturnValue : [true]);
        // WHEN
        return rxjs_1.from(promiseFunction()).subscribe(function (res) {
            // THEN
            expect(res).toEqual(result);
            expect(knex.sqls).toEqual(sqls);
            expect(knex.params).toEqual(parameters);
            done();
        }, function (error) {
            expect(error).toBeUndefined();
            expect(false).toBeTruthy('should not fail');
            done();
        }, function () {
            done();
        });
    };
    TestHelper.doTestFailWithSqlsTest = function (knex, promiseFunction, errorMsg, sqls, parameters, done, newReturnValue) {
        knex.resetTestResults(newReturnValue ? newReturnValue : [true]);
        // WHEN
        return rxjs_1.from(promiseFunction()).subscribe(function (res) {
            // THEN
            expect(res).toBeUndefined();
            expect(false).toBeTruthy('should fail');
            done();
        }, function (error) {
            expect(error).toEqual(errorMsg);
            expect(knex.sqls).toEqual(sqls);
            expect(knex.params).toEqual(parameters);
            done();
        }, function () {
            done();
        });
    };
    return TestHelper;
}());
exports.TestHelper = TestHelper;
//# sourceMappingURL=test-helper.js.map