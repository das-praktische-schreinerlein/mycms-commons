"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var Observable_1 = require("rxjs/Observable");
var TestActionFormHelper = /** @class */ (function () {
    function TestActionFormHelper() {
    }
    TestActionFormHelper.doActionTagTestSuccessTest = function (knex, service, functionName, table, id, actionForm, result, sqls, parameters, done, newReturnValue) {
        knex.resetTestResults(newReturnValue ? newReturnValue : [true]);
        // WHEN
        return Observable_1.Observable.fromPromise(service[functionName](table, id, actionForm, {})).subscribe(function (res) {
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
    TestActionFormHelper.doActionTagTestFailWithSqlsTest = function (knex, service, functionName, table, id, actionForm, errorMsg, sqls, parameters, done, newReturnValue) {
        knex.resetTestResults(newReturnValue ? newReturnValue : [true]);
        // WHEN
        return Observable_1.Observable.fromPromise(service[functionName](table, id, actionForm, {})).subscribe(function (res) {
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
    TestActionFormHelper.doActionTagFailTest = function (knex, service, functionName, table, id, actionForm, errorMsg, done, newReturnValue) {
        knex.resetTestResults(newReturnValue ? newReturnValue : [true]);
        // WHEN
        return Observable_1.Observable.fromPromise(service[functionName](table, id, actionForm, {})).subscribe(function (res) {
            // THEN
            expect(res).toBeUndefined();
            expect(false).toBeTruthy('should fail');
            done();
        }, function (error) {
            expect(error).toEqual(errorMsg);
            done();
        }, function () {
            done();
        });
    };
    TestActionFormHelper.doActionTagTestInvalidPayloadTest = function (knex, service, functionName, action, done) {
        var id = 7;
        return TestActionFormHelper.doActionTagFailTest(knex, service, functionName, 'table', id, {
            payload: undefined,
            deletes: false,
            key: action,
            recordId: id,
            type: 'tag'
        }, 'actiontag ' + action + ' playload expected', done);
    };
    TestActionFormHelper.doActionTagTestInvalidIdTest = function (knex, service, functionName, action, done) {
        var id = 'a';
        return TestActionFormHelper.doActionTagFailTest(knex, service, functionName, 'table', id, {
            payload: {
                set: 0
            },
            deletes: false,
            key: action,
            recordId: id,
            type: 'tag'
        }, 'actiontag ' + action + ' id not an integer', done);
    };
    TestActionFormHelper.doActionTagFailInvalidTableTest = function (knex, service, functionName, action, payload, altErrorMsg, done) {
        var id = 7;
        return TestActionFormHelper.doActionTagFailTest(knex, service, functionName, 'unknowntable', id, {
            payload: __assign({}, payload),
            deletes: false,
            key: action,
            recordId: id,
            type: 'tag'
        }, altErrorMsg !== undefined ? altErrorMsg : 'actiontag ' + action + ' table not valid', done);
    };
    return TestActionFormHelper;
}());
exports.TestActionFormHelper = TestActionFormHelper;
//# sourceMappingURL=test-actionform-helper.js.map