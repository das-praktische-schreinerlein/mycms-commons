"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var generic_validator_util_1 = require("../../search-commons/model/forms/generic-validator.util");
var util_1 = require("util");
var date_utils_1 = require("../../commons/utils/date.utils");
var PDocFileUtils = /** @class */ (function () {
    function PDocFileUtils() {
    }
    PDocFileUtils.normalizeCygwinPath = function (path) {
        if (!path) {
            return path;
        }
        path = path.replace(/^\/cygdrive\/([a-z])\//g, '$1:/');
        return path;
    };
    PDocFileUtils.parseRecordSourceFromJson = function (json) {
        var data = JSON.parse(json);
        var records = [];
        var idValidator = new generic_validator_util_1.IdValidationRule(true);
        var mapping = {
            // facets
            page_id_is: 'page_id_i'
        };
        if (data.pdocs) {
            data = data.pdocs;
        }
        if (!util_1.isArray(data)) {
            throw new Error('no valid data to import: no array of pdocs');
        }
        data.forEach(function (record) {
            for (var fieldName in mapping) {
                record[fieldName] = record[mapping[fieldName]];
            }
            record['id'] = idValidator.sanitize(record['id'] + '');
            record['subtype_s'] = record['subtype_s'] ? record['subtype_s'].replace(/[-a-zA-Z_]+/g, '') : '';
            for (var _i = 0, _a = []; _i < _a.length; _i++) {
                var dateField = _a[_i];
                if (record[dateField] !== undefined && record[dateField] !== '') {
                    record[dateField] = date_utils_1.DateUtils.parseDateStringWithLocaltime(record[dateField]);
                }
            }
            records.push(record);
        });
        return records;
    };
    return PDocFileUtils;
}());
exports.PDocFileUtils = PDocFileUtils;
//# sourceMappingURL=pdoc-file.utils.js.map