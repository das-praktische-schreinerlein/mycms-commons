"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var XRegExp = require("xregexp/lib");
var GenericValidatorDatatypes;
(function (GenericValidatorDatatypes) {
    GenericValidatorDatatypes[GenericValidatorDatatypes["FULLTEXT"] = 0] = "FULLTEXT";
    GenericValidatorDatatypes[GenericValidatorDatatypes["ID"] = 1] = "ID";
    GenericValidatorDatatypes[GenericValidatorDatatypes["PERPAGE"] = 2] = "PERPAGE";
    GenericValidatorDatatypes[GenericValidatorDatatypes["PAGENUM"] = 3] = "PAGENUM";
    GenericValidatorDatatypes[GenericValidatorDatatypes["SORT"] = 4] = "SORT";
    GenericValidatorDatatypes[GenericValidatorDatatypes["WHEN_KEY_CSV"] = 5] = "WHEN_KEY_CSV";
    GenericValidatorDatatypes[GenericValidatorDatatypes["LOCATION_KEY_CSV"] = 6] = "LOCATION_KEY_CSV";
    GenericValidatorDatatypes[GenericValidatorDatatypes["ID_CSV"] = 7] = "ID_CSV";
    GenericValidatorDatatypes[GenericValidatorDatatypes["NEARBY"] = 8] = "NEARBY";
    GenericValidatorDatatypes[GenericValidatorDatatypes["ADDRESS"] = 9] = "ADDRESS";
    GenericValidatorDatatypes[GenericValidatorDatatypes["WHAT_KEY_CSV"] = 10] = "WHAT_KEY_CSV";
    GenericValidatorDatatypes[GenericValidatorDatatypes["FILTER_LIST"] = 11] = "FILTER_LIST";
    GenericValidatorDatatypes[GenericValidatorDatatypes["NAME"] = 12] = "NAME";
    GenericValidatorDatatypes[GenericValidatorDatatypes["GPSTRACK"] = 13] = "GPSTRACK";
    GenericValidatorDatatypes[GenericValidatorDatatypes["DATE"] = 14] = "DATE";
    GenericValidatorDatatypes[GenericValidatorDatatypes["TEXT"] = 15] = "TEXT";
    GenericValidatorDatatypes[GenericValidatorDatatypes["HTML"] = 16] = "HTML";
    GenericValidatorDatatypes[GenericValidatorDatatypes["MARKDOWN"] = 17] = "MARKDOWN";
    GenericValidatorDatatypes[GenericValidatorDatatypes["NUMBER"] = 18] = "NUMBER";
    GenericValidatorDatatypes[GenericValidatorDatatypes["FILENAME"] = 19] = "FILENAME";
    GenericValidatorDatatypes[GenericValidatorDatatypes["GEOLOC"] = 20] = "GEOLOC";
})(GenericValidatorDatatypes = exports.GenericValidatorDatatypes || (exports.GenericValidatorDatatypes = {}));
var ValidationRule = /** @class */ (function () {
    function ValidationRule(required) {
        this._required = required;
    }
    ValidationRule.prototype.isRequiredValid = function (value) {
        return (this._required && !this.isUndefined(value)) || !this._required;
    };
    ValidationRule.prototype.isUndefined = function (value) {
        return value === undefined;
    };
    return ValidationRule;
}());
exports.ValidationRule = ValidationRule;
var ValidationWithDefaultRule = /** @class */ (function (_super) {
    __extends(ValidationWithDefaultRule, _super);
    function ValidationWithDefaultRule(required, defaultValue) {
        var _this = _super.call(this, required) || this;
        _this._defaultValue = defaultValue;
        return _this;
    }
    ValidationWithDefaultRule.prototype.sanitize = function (value) {
        if (this.isValid(value)) {
            return value;
        }
        // console.error("sanitize value:" + value + " to defaultValue: " + this._defaultValue);
        return this._defaultValue;
    };
    return ValidationWithDefaultRule;
}(ValidationRule));
exports.ValidationWithDefaultRule = ValidationWithDefaultRule;
var ListValidationRule = /** @class */ (function (_super) {
    __extends(ListValidationRule, _super);
    function ListValidationRule(required, values, defaultValue) {
        var _this = _super.call(this, required, defaultValue) || this;
        _this._values = values;
        return _this;
    }
    return ListValidationRule;
}(ValidationWithDefaultRule));
exports.ListValidationRule = ListValidationRule;
var WhiteListValidationRule = /** @class */ (function (_super) {
    __extends(WhiteListValidationRule, _super);
    function WhiteListValidationRule(required, whiteListValues, defaultValue) {
        return _super.call(this, required, whiteListValues, defaultValue) || this;
    }
    WhiteListValidationRule.prototype.isValid = function (value) {
        if (!this.isRequiredValid(value)) {
            return false;
        }
        if (this.isUndefined(value)) {
            return true;
        }
        return this._values.indexOf(value) >= 0;
    };
    return WhiteListValidationRule;
}(ListValidationRule));
exports.WhiteListValidationRule = WhiteListValidationRule;
var BlackListValuesValidationRule = /** @class */ (function (_super) {
    __extends(BlackListValuesValidationRule, _super);
    function BlackListValuesValidationRule(required, blackListValues, defaultValue) {
        return _super.call(this, required, blackListValues, defaultValue) || this;
    }
    BlackListValuesValidationRule.prototype.isValid = function (value) {
        if (!this.isRequiredValid(value)) {
            return false;
        }
        if (this.isUndefined(value)) {
            return true;
        }
        return this._values.indexOf(value) < 0;
    };
    return BlackListValuesValidationRule;
}(ListValidationRule));
exports.BlackListValuesValidationRule = BlackListValuesValidationRule;
var RegExValidationReplaceRule = /** @class */ (function (_super) {
    __extends(RegExValidationReplaceRule, _super);
    // @ts-ignore: is functional
    function RegExValidationReplaceRule(required, checkRegEx, replaceRegEx, replacement, maxLength) {
        var _this = _super.call(this, required) || this;
        _this._checkRegEx = checkRegEx;
        _this._replaceRegEx = replaceRegEx;
        _this._replaceMent = replacement;
        _this.maxLength = maxLength;
        return _this;
    }
    RegExValidationReplaceRule.prototype.isValid = function (value) {
        if (!this.isRequiredValid(value)) {
            return false;
        }
        if (this.isUndefined(value)) {
            return true;
        }
        if (typeof value !== 'string') {
            return false;
        }
        if (this.maxLength !== undefined && value.length > this.maxLength) {
            return false;
        }
        var res = XRegExp.match(value, this._checkRegEx, 'one');
        /**
        if (res === null) {
            const res2 = XRegExp.match(value, this._replaceRegEx, 'all');
            console.log('values not matching list' + value, res2);
            console.log('code not matching 1' + res2.join(''), res2.join('').charCodeAt(0));
        }
        **/
        return res !== null;
    };
    RegExValidationReplaceRule.prototype.sanitize = function (value) {
        if (this.isValid(value)) {
            return value;
        }
        if (typeof value !== 'string') {
            return undefined;
        }
        var result = XRegExp.replace(value, this._replaceRegEx, this._replaceMent);
        // console.error("sanitize value:" + value + " to replaceValue: " + result);
        return result;
    };
    RegExValidationReplaceRule.prototype.getMaxLength = function () {
        return this.maxLength;
    };
    /**
     + '\\p{Cc}' // Cc 	Other, Control
     + '\\p{Cf}' // Cf 	Other, Format
     + '\\p{Cn}' // Cn 	Other, Not Assigned (no characters in the file have this property)
     + '\\p{Co}' // Co 	Other, Private Use
     + '\\p{Cs}' // Cs 	Other, Surrogate
     + '\\p{LC}' // LC 	Letter, Cased
     + '\\p{Ll}' // Ll 	Letter, Lowercase
     + '\\p{Lm}' // Lm 	Letter, Modifier
     + '\\p{Lo}' // Lo 	Letter, Other
     + '\\p{Lt}' // Lt 	Letter, Titlecase
     + '\\p{Lu}' // Lu 	Letter, Uppercase
     + '\\p{Mc}' // Mc 	Mark, Spacing Combining
     + '\\p{Me}' // Me 	Mark, Enclosing
     + '\\p{Mn}' // Mn 	Mark, Nonspacing
     + '\\p{Nd}' // Nd 	Number, Decimal Digit
     + '\\p{Nl}' // Nl 	Number, Letter
     + '\\p{No}' // No 	Number, Other
     + '\\p{Pc}' // Pc 	Punctuation, Connector
     + '\\p{Pd}' // Pd 	Punctuation, Dash
     + '\\p{Pe}' // Pe 	Punctuation, Close
     + '\\p{Pf}' // Pf 	Punctuation, Final quote (may behave like Ps or Pe depending on usage)
     + '\\p{Pi}' // Pi 	Punctuation, Initial quote (may behave like Ps or Pe depending on usage)
     + '\\p{Po}' // Po 	Punctuation, Other
     + '\\p{Ps}' // Ps 	Punctuation, Open
     + '\\p{Sc}' // Sc 	Symbol, Currency
     + '\\p{Sk}' // Sk 	Symbol, Modifier
     + '\\p{Sm}' // Sm 	Symbol, Math
     + '\\p{So}' // So 	Symbol, Other
     + '\\p{Zl}' // Zl 	Separator, Line
     + '\\p{Zp}' // Zp 	Separator, Paragraph
     + '\\p{Zs}' // Zs 	Separator, Space
     */
    RegExValidationReplaceRule.textRule = ''
        + '\\p{Cs}' // Cs 	Other, Surrogate
        + '\\p{LC}' // LC 	Letter, Cased
        + '\\p{Ll}' // Ll 	Letter, Lowercase
        + '\\p{Lm}' // Lm 	Letter, Modifier
        + '\\p{Lo}' // Lo 	Letter, Other
        + '\\p{Lt}' // Lt 	Letter, Titlecase
        + '\\p{Lu}' // Lu 	Letter, Uppercase
        + '\\p{Mc}' // Mc 	Mark, Spacing Combining
        + '\\p{Me}' // Me 	Mark, Enclosing
        + '\\p{Mn}' // Mn 	Mark, Nonspacing
        + '\\p{Nd}' // Nd 	Number, Decimal Digit
        + '\\p{Nl}' // Nl 	Number, Letter
        + '\\p{No}' // No 	Number, Other
        + '\\p{Pc}' // Pc 	Punctuation, Connector
        + '\\p{Pd}' // Pd 	Punctuation, Dash
        + '\\p{Pe}' // Pe 	Punctuation, Close
        + '\\p{Pf}' // Pf 	Punctuation, Final quote (may behave like Ps or Pe depending on usage)
        + '\\p{Pi}' // Pi 	Punctuation, Initial quote (may behave like Ps or Pe depending on usage)
        + '\\p{Po}' // Po 	Punctuation, Other
        + '\\p{Ps}' // Ps 	Punctuation, Open
        + '\\p{Sc}' // Sc 	Symbol, Currency
        + '\\p{Sk}' // Sk 	Symbol, Modifier
        + '\\p{Sm}' // Sm 	Symbol, Math
        + '\\p{So}' // So 	Symbol, Other
        + '\\p{Zl}' // Zl 	Separator, Line
        + '\\p{Zp}' // Zp 	Separator, Paragraph
        + ' \r\n\t';
    RegExValidationReplaceRule.nameRule = ''
        + XRegExp.escape('-')
        + '@'
        + '\\p{LC}' // LC 	Letter, Cased
        + '\\p{Ll}' // Ll 	Letter, Lowercase
        + '\\p{Lm}' // Lm 	Letter, Modifier
        + '\\p{Lo}' // Lo 	Letter, Other
        + '\\p{Lt}' // Lt 	Letter, Titlecase
        + '\\p{Lu}' // Lu 	Letter, Uppercase
        + '\\p{Nd}' // Nd 	Number, Decimal Digit
        + XRegExp.escape('/+;,:._*()[] ´`\'');
    RegExValidationReplaceRule.hierarchyRule = ''
        + XRegExp.escape('-')
        + '\\p{LC}' // LC 	Letter, Cased
        + '\\p{Ll}' // Ll 	Letter, Lowercase
        + '\\p{Lm}' // Lm 	Letter, Modifier
        + '\\p{Lo}' // Lo 	Letter, Other
        + '\\p{Lt}' // Lt 	Letter, Titlecase
        + '\\p{Lu}' // Lu 	Letter, Uppercase
        + '\\p{Nd}' // Nd 	Number, Decimal Digit
        + XRegExp.escape('/+;,:._*() ´`\'>');
    return RegExValidationReplaceRule;
}(ValidationRule));
exports.RegExValidationReplaceRule = RegExValidationReplaceRule;
var NumberValidationRule = /** @class */ (function (_super) {
    __extends(NumberValidationRule, _super);
    function NumberValidationRule(required, min, max, defaultValue) {
        var _this = _super.call(this, required, defaultValue) || this;
        _this._min = min;
        _this._max = max;
        return _this;
    }
    NumberValidationRule.prototype.isValid = function (value) {
        if (!this.isRequiredValid(value)) {
            return false;
        }
        if (this.isUndefined(value)) {
            return true;
        }
        if (typeof value === 'string' && !isNaN(+value)) {
            value = +value;
        }
        if (typeof value !== 'number') {
            return false;
        }
        if (this._min !== undefined && value < this._min) {
            return false;
        }
        if (this._max !== undefined && value > this._max) {
            return false;
        }
        return true;
    };
    NumberValidationRule.prototype.sanitize = function (value) {
        if (this.isValid(value)) {
            return +value;
        }
        // console.error("sanitize value:" + value + " to defaultValue: " + this._defaultValue);
        return this._defaultValue;
    };
    return NumberValidationRule;
}(ValidationWithDefaultRule));
exports.NumberValidationRule = NumberValidationRule;
var StringNumberValidationRule = /** @class */ (function (_super) {
    __extends(StringNumberValidationRule, _super);
    function StringNumberValidationRule(required, min, max, defaultValue) {
        return _super.call(this, required, min, max, defaultValue) || this;
    }
    StringNumberValidationRule.prototype.sanitize = function (value) {
        if (this.isValid(value)) {
            return value ? value + '' : value;
        }
        // console.error("sanitize value:" + value + " to defaultValue: " + this._defaultValue);
        return this._defaultValue;
    };
    return StringNumberValidationRule;
}(NumberValidationRule));
exports.StringNumberValidationRule = StringNumberValidationRule;
var DateValidationRule = /** @class */ (function (_super) {
    __extends(DateValidationRule, _super);
    function DateValidationRule(required) {
        return _super.call(this, required, new XRegExp('^[-0-9.: Tt]*$', 'gi'), new XRegExp('[^-0-9.: Tt]*', 'gi'), '', 50) || this;
    }
    return DateValidationRule;
}(RegExValidationReplaceRule));
exports.DateValidationRule = DateValidationRule;
var IdValidationRule = /** @class */ (function (_super) {
    __extends(IdValidationRule, _super);
    function IdValidationRule(required) {
        return _super.call(this, required, new XRegExp('^[a-zA-Z_0-9.]*$', 'gi'), new XRegExp('[^a-zA-Z_0-9.]*', 'gi'), '', 100) || this;
    }
    return IdValidationRule;
}(RegExValidationReplaceRule));
exports.IdValidationRule = IdValidationRule;
var IdCsvValidationRule = /** @class */ (function (_super) {
    __extends(IdCsvValidationRule, _super);
    function IdCsvValidationRule(required) {
        return _super.call(this, required, new XRegExp('^[a-zA-Z_0-9,.]*$', 'gi'), new XRegExp('[^a-zA-Z_0-9,.]*', 'gi'), '', 20000) || this;
    }
    return IdCsvValidationRule;
}(RegExValidationReplaceRule));
exports.IdCsvValidationRule = IdCsvValidationRule;
var DbIdValidationRule = /** @class */ (function (_super) {
    __extends(DbIdValidationRule, _super);
    function DbIdValidationRule(required) {
        return _super.call(this, required, 1, 9999999999999999, undefined) || this;
    }
    return DbIdValidationRule;
}(NumberValidationRule));
exports.DbIdValidationRule = DbIdValidationRule;
var DbIdCsvValidationRule = /** @class */ (function (_super) {
    __extends(DbIdCsvValidationRule, _super);
    function DbIdCsvValidationRule(required) {
        return _super.call(this, required, new XRegExp('^[0-9,]*$', 'gi'), new XRegExp('[^0-9,]*', 'gi'), '', 20000) || this;
    }
    return DbIdCsvValidationRule;
}(RegExValidationReplaceRule));
exports.DbIdCsvValidationRule = DbIdCsvValidationRule;
var KeyParamsValidationRule = /** @class */ (function (_super) {
    __extends(KeyParamsValidationRule, _super);
    function KeyParamsValidationRule(required) {
        return _super.call(this, required, new XRegExp('^[-a-zA-Z_0-9äöüßÄÖÜ,;:. ]*$', 'gi'), new XRegExp('[^-a-zA-Z_0-9äöüßÄÖÜ,;:. ]*', 'gi'), '', 1500) || this;
    }
    return KeyParamsValidationRule;
}(RegExValidationReplaceRule));
exports.KeyParamsValidationRule = KeyParamsValidationRule;
var ExtendedKeyParamsValidationRule = /** @class */ (function (_super) {
    __extends(ExtendedKeyParamsValidationRule, _super);
    function ExtendedKeyParamsValidationRule(required) {
        return _super.call(this, required, new XRegExp('^[-a-zA-Z_0-9äöüßÄÖÜ,;:. ]*$', 'gi'), new XRegExp('[^-a-zA-Z_0-9äöüßÄÖÜ,;:. ]*', 'gi'), '', 2000) || this;
    }
    return ExtendedKeyParamsValidationRule;
}(RegExValidationReplaceRule));
exports.ExtendedKeyParamsValidationRule = ExtendedKeyParamsValidationRule;
var KeywordValidationRule = /** @class */ (function (_super) {
    __extends(KeywordValidationRule, _super);
    function KeywordValidationRule(required) {
        return _super.call(this, required, new XRegExp('^[-a-zA-Z_0-9äöüßÄÖÜ,;:. ]*$', 'gi'), new XRegExp('[^-a-zA-Z_0-9äöüßÄÖÜ,;:. ]*', 'gi'), '', 1500) || this;
    }
    return KeywordValidationRule;
}(RegExValidationReplaceRule));
exports.KeywordValidationRule = KeywordValidationRule;
var NearbyParamValidationRule = /** @class */ (function (_super) {
    __extends(NearbyParamValidationRule, _super);
    function NearbyParamValidationRule(required) {
        return _super.call(this, required, new XRegExp('^[-0-9._]*$', 'gi'), new XRegExp('[^-0-9._]*', 'gi'), '', 100) || this;
    }
    return NearbyParamValidationRule;
}(RegExValidationReplaceRule));
exports.NearbyParamValidationRule = NearbyParamValidationRule;
var TextValidationRule = /** @class */ (function (_super) {
    __extends(TextValidationRule, _super);
    function TextValidationRule(required) {
        return _super.call(this, required, new XRegExp('^[-A-Za-z0-9äöüßÄÖÜ+;,:._* ]*$', 'gi'), new XRegExp('[^-A-Za-z0-9äöüßÄÖÜ+;,:._* ]*', 'gi'), '', 1500) || this;
    }
    return TextValidationRule;
}(RegExValidationReplaceRule));
exports.TextValidationRule = TextValidationRule;
var NameValidationRule = /** @class */ (function (_super) {
    __extends(NameValidationRule, _super);
    function NameValidationRule(required) {
        return _super.call(this, required, new XRegExp('^[' + RegExValidationReplaceRule.nameRule + ']*$', 'gi'), new XRegExp('[^' + RegExValidationReplaceRule.nameRule + ']*', 'gi'), '', 200) || this;
    }
    return NameValidationRule;
}(RegExValidationReplaceRule));
exports.NameValidationRule = NameValidationRule;
var SolrValidationRule = /** @class */ (function (_super) {
    __extends(SolrValidationRule, _super);
    function SolrValidationRule(required) {
        return _super.call(this, required, new XRegExp('^[-A-Za-z0-9äöüßÄÖÜ+;,:._* ]*$', 'gi'), new XRegExp('[^-A-Za-z0-9äöüßÄÖÜ+;,:._* ]*', 'gi'), '', 100) || this;
    }
    return SolrValidationRule;
}(RegExValidationReplaceRule));
exports.SolrValidationRule = SolrValidationRule;
var GeoLocValidationRule = /** @class */ (function (_super) {
    __extends(GeoLocValidationRule, _super);
    function GeoLocValidationRule(required) {
        return _super.call(this, required, new XRegExp('^[-0-9,.]*$', 'gi'), new XRegExp('[^-0-9,.]*', 'gi'), '', 50) || this;
    }
    return GeoLocValidationRule;
}(RegExValidationReplaceRule));
exports.GeoLocValidationRule = GeoLocValidationRule;
var HierarchyValidationRule = /** @class */ (function (_super) {
    __extends(HierarchyValidationRule, _super);
    function HierarchyValidationRule(required) {
        return _super.call(this, required, new XRegExp('^[' + RegExValidationReplaceRule.hierarchyRule + ']*$', 'gi'), new XRegExp('[^' + RegExValidationReplaceRule.hierarchyRule + ']*', 'gi'), '', 400) || this;
    }
    return HierarchyValidationRule;
}(RegExValidationReplaceRule));
exports.HierarchyValidationRule = HierarchyValidationRule;
var GpsTrackValidationRule = /** @class */ (function (_super) {
    __extends(GpsTrackValidationRule, _super);
    function GpsTrackValidationRule(required) {
        var _this = this;
        var characters = '-A-Za-z0-9' + XRegExp.escape('äöüßÄÖÜ/"+=;,:._*?!<>()[] ');
        _this = _super.call(this, required, new XRegExp('^[' + characters + '\t\r\n]*$', 'gi'), new XRegExp('[^' + characters + '\t\r\n]*', 'gi'), '', 1000000) || this;
        return _this;
    }
    return GpsTrackValidationRule;
}(RegExValidationReplaceRule));
exports.GpsTrackValidationRule = GpsTrackValidationRule;
var RouteValidationRule = /** @class */ (function (_super) {
    __extends(RouteValidationRule, _super);
    function RouteValidationRule(required) {
        return _super.call(this, required, new XRegExp('^[-A-Za-z0-9äöüßÄÖÜ/+;,:._*]*$', 'gi'), new XRegExp('[^-A-Za-z0-9äöüßÄÖÜ/+;,:._*]*', 'gi'), '', 2000) || this;
    }
    return RouteValidationRule;
}(RegExValidationReplaceRule));
exports.RouteValidationRule = RouteValidationRule;
var ShowRouteValidationRule = /** @class */ (function (_super) {
    __extends(ShowRouteValidationRule, _super);
    function ShowRouteValidationRule(required) {
        return _super.call(this, required, new XRegExp('^[-A-Za-z0-9/_]*$', 'gi'), new XRegExp('[^-A-Za-z0-9/_]*', 'gi'), '', 2000) || this;
    }
    return ShowRouteValidationRule;
}(RegExValidationReplaceRule));
exports.ShowRouteValidationRule = ShowRouteValidationRule;
var HtmlValidationRule = /** @class */ (function (_super) {
    __extends(HtmlValidationRule, _super);
    function HtmlValidationRule(required) {
        return _super.call(this, required, new XRegExp('^[' + RegExValidationReplaceRule.textRule + ']*$', 'gi'), new XRegExp('[^' + RegExValidationReplaceRule.textRule + ']*', 'gi'), '', 10000) || this;
    }
    return HtmlValidationRule;
}(RegExValidationReplaceRule));
exports.HtmlValidationRule = HtmlValidationRule;
var MarkdownValidationRule = /** @class */ (function (_super) {
    __extends(MarkdownValidationRule, _super);
    function MarkdownValidationRule(required) {
        return _super.call(this, required) || this;
    }
    return MarkdownValidationRule;
}(HtmlValidationRule));
exports.MarkdownValidationRule = MarkdownValidationRule;
var DescValidationRule = /** @class */ (function (_super) {
    __extends(DescValidationRule, _super);
    function DescValidationRule(required) {
        return _super.call(this, required) || this;
    }
    return DescValidationRule;
}(MarkdownValidationRule));
exports.DescValidationRule = DescValidationRule;
var FilenameValidationRule = /** @class */ (function (_super) {
    __extends(FilenameValidationRule, _super);
    function FilenameValidationRule(required) {
        return _super.call(this, required, new XRegExp('^[-A-Za-z0-9_]*$', 'gi'), new XRegExp('[^-A-Za-z0-9_]*', 'gi'), '', 260) || this;
    }
    return FilenameValidationRule;
}(RegExValidationReplaceRule));
exports.FilenameValidationRule = FilenameValidationRule;
var SimpleInsecurePathValidationRule = /** @class */ (function (_super) {
    __extends(SimpleInsecurePathValidationRule, _super);
    function SimpleInsecurePathValidationRule(required) {
        return _super.call(this, required, new XRegExp('^[^\$\&\"\*]*$', 'gi'), new XRegExp('[\$\&\"\*]*', 'gi'), '', 4096) || this;
    }
    return SimpleInsecurePathValidationRule;
}(RegExValidationReplaceRule));
exports.SimpleInsecurePathValidationRule = SimpleInsecurePathValidationRule;
var PasswordValidationRule = /** @class */ (function (_super) {
    __extends(PasswordValidationRule, _super);
    function PasswordValidationRule(required) {
        return _super.call(this, required, new XRegExp('^[-A-Za-z0-9_@\(\)<>:]*$', 'gi'), new XRegExp('[^-A-Za-z0-9_@\(\)<>:]*', 'gi'), '', 50) || this;
    }
    return PasswordValidationRule;
}(RegExValidationReplaceRule));
exports.PasswordValidationRule = PasswordValidationRule;
//# sourceMappingURL=generic-validator.util.js.map