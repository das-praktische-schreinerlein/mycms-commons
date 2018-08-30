"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var filter_utils_1 = require("./filter.utils");
var ActionTagUtils = /** @class */ (function () {
    function ActionTagUtils() {
    }
    ActionTagUtils.generateTags = function (tagConfigs, record, config) {
        var lTags = [];
        for (var _i = 0, tagConfigs_1 = tagConfigs; _i < tagConfigs_1.length; _i++) {
            var tagConfig = tagConfigs_1[_i];
            var tag = ActionTagUtils.generateTag(tagConfig, record, config);
            if (tag.available) {
                lTags.push(tag);
            }
        }
        return lTags;
    };
    ActionTagUtils.generateTag = function (tagConfig, record, config) {
        var available = filter_utils_1.FilterUtils.checkFilters(tagConfig.configAvailability, config);
        available = available && filter_utils_1.FilterUtils.checkFilters(tagConfig.recordAvailability, record);
        var active = available && filter_utils_1.FilterUtils.checkFilters(tagConfig.showFilter, record);
        return {
            config: tagConfig,
            active: active,
            available: available
        };
    };
    return ActionTagUtils;
}());
exports.ActionTagUtils = ActionTagUtils;
//# sourceMappingURL=actiontag.utils.js.map