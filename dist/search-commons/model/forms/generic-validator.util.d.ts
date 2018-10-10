import * as XRegExp from 'xregexp';
export declare enum GenericValidatorDatatypes {
    'FULLTEXT' = 0,
    'ID' = 1,
    'PERPAGE' = 2,
    'PAGENUM' = 3,
    'SORT' = 4,
    'WHEN_KEY_CSV' = 5,
    'LOCATION_KEY_CSV' = 6,
    'ID_CSV' = 7,
    'NEARBY' = 8,
    'ADDRESS' = 9,
    'WHAT_KEY_CSV' = 10,
    'FILTER_LIST' = 11,
    'NAME' = 12,
    'GPSTRACK' = 13,
    'DATE' = 14,
    'TEXT' = 15,
    'HTML' = 16,
    'MARKDOWN' = 17,
    'NUMBER' = 18,
    'FILENAME' = 19,
    'GEOLOC' = 20,
}
export declare abstract class ValidationRule {
    protected _required: boolean;
    abstract isValid(value: any): boolean;
    abstract sanitize(value: any): any;
    constructor(required: boolean);
    isRequiredValid(value: any): boolean;
    isUndefined(value: any): boolean;
}
export declare abstract class ValidationWithDefaultRule extends ValidationRule {
    protected _defaultValue: any;
    constructor(required: boolean, defaultValue: any);
    sanitize(value: any): any;
}
export declare abstract class ListValidationRule extends ValidationWithDefaultRule {
    protected _values: any[];
    constructor(required: boolean, values: any[], defaultValue: any);
}
export declare class WhiteListValidationRule extends ListValidationRule {
    constructor(required: boolean, whiteListValues: any[], defaultValue: any);
    isValid(value: any): boolean;
}
export declare class BlackListValuesValidationRule extends ListValidationRule {
    constructor(required: boolean, blackListValues: any[], defaultValue: any);
    isValid(value: any): boolean;
}
export declare class RegExValidationReplaceRule extends ValidationRule {
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
    static textRule: string;
    static nameRule: string;
    static hierarchyRule: string;
    protected _checkRegEx: XRegExp;
    protected _replaceRegEx: XRegExp;
    protected _replaceMent: string;
    protected maxLength: number;
    constructor(required: boolean, checkRegEx: XRegExp, replaceRegEx: XRegExp, replacement: string, maxLength?: number);
    isValid(value: any): boolean;
    sanitize(value: any): any;
    getMaxLength(): number;
}
export declare class NumberValidationRule extends ValidationWithDefaultRule {
    protected _min: number;
    protected _max: number;
    constructor(required: boolean, min: number, max: number, defaultValue: number);
    isValid(value: any): boolean;
    sanitize(value: any): any;
}
export declare class StringNumberValidationRule extends NumberValidationRule {
    constructor(required: boolean, min: number, max: number, defaultValue: number);
    sanitize(value: any): any;
}
export declare class DateValidationRule extends RegExValidationReplaceRule {
    constructor(required: boolean);
}
export declare class IdValidationRule extends RegExValidationReplaceRule {
    constructor(required: boolean);
}
export declare class IdCsvValidationRule extends RegExValidationReplaceRule {
    constructor(required: boolean);
}
export declare class DbIdValidationRule extends NumberValidationRule {
    constructor(required: boolean);
}
export declare class DbIdCsvValidationRule extends RegExValidationReplaceRule {
    constructor(required: boolean);
}
export declare class KeyParamsValidationRule extends RegExValidationReplaceRule {
    constructor(required: boolean);
}
export declare class ExtendedKeyParamsValidationRule extends RegExValidationReplaceRule {
    constructor(required: boolean);
}
export declare class KeywordValidationRule extends RegExValidationReplaceRule {
    constructor(required: boolean);
}
export declare class NearbyParamValidationRule extends RegExValidationReplaceRule {
    constructor(required: boolean);
}
export declare class TextValidationRule extends RegExValidationReplaceRule {
    constructor(required: boolean);
}
export declare class NameValidationRule extends RegExValidationReplaceRule {
    constructor(required: boolean);
}
export declare class SolrValidationRule extends RegExValidationReplaceRule {
    constructor(required: boolean);
}
export declare class GeoLocValidationRule extends RegExValidationReplaceRule {
    constructor(required: boolean);
}
export declare class HierarchyValidationRule extends RegExValidationReplaceRule {
    constructor(required: boolean);
}
export declare class GpsTrackValidationRule extends RegExValidationReplaceRule {
    constructor(required: boolean);
}
export declare class RouteValidationRule extends RegExValidationReplaceRule {
    constructor(required: boolean);
}
export declare class ShowRouteValidationRule extends RegExValidationReplaceRule {
    constructor(required: boolean);
}
export declare class HtmlValidationRule extends RegExValidationReplaceRule {
    constructor(required: boolean);
}
export declare class MarkdownValidationRule extends HtmlValidationRule {
    constructor(required: boolean);
}
export declare class DescValidationRule extends MarkdownValidationRule {
    constructor(required: boolean);
}
export declare class FilenameValidationRule extends RegExValidationReplaceRule {
    constructor(required: boolean);
}
export declare class SimpleInsecurePathValidationRule extends RegExValidationReplaceRule {
    constructor(required: boolean);
}
