"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var AbstractMarkdownExtension = /** @class */ (function () {
    function AbstractMarkdownExtension(name, level, childTokens, startRegExp, tokenizerRegExp) {
        this.name = name;
        this.level = level;
        this.childTokens = childTokens;
        this.startRegExp = startRegExp;
        this.tokenizerRegExp = tokenizerRegExp;
    }
    AbstractMarkdownExtension.prototype.start = function (marked, src) {
        var match = src.match(this.startRegExp);
        return match
            ? match.index
            : undefined;
    };
    ;
    AbstractMarkdownExtension.prototype.tokenizer = function (marked, src, tokens) {
        throw new Error('must be implemented: ' + this.name);
    };
    AbstractMarkdownExtension.prototype.renderer = function (marked, token) {
        throw new Error('must be implemented: ' + this.name);
    };
    ;
    AbstractMarkdownExtension.prototype.toMarkDownExtension = function () {
        var me = this;
        return {
            name: this.name,
            childTokens: this.childTokens,
            level: this.level,
            start: function (src) {
                var index = me.start(this, src);
                return me.start(this, src);
            },
            tokenizer: function (src, tokens) {
                return me.tokenizer(this, src, tokens);
            },
            renderer: function (token) {
                return me.renderer(this, token);
            }
        };
    };
    return AbstractMarkdownExtension;
}());
exports.AbstractMarkdownExtension = AbstractMarkdownExtension;
var AbstractHtmlMarkdownExtension = /** @class */ (function (_super) {
    __extends(AbstractHtmlMarkdownExtension, _super);
    function AbstractHtmlMarkdownExtension() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return AbstractHtmlMarkdownExtension;
}(AbstractMarkdownExtension));
exports.AbstractHtmlMarkdownExtension = AbstractHtmlMarkdownExtension;
//# sourceMappingURL=markdown.extension.js.map