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
var markdown_extension_1 = require("./markdown.extension");
var extendedBlockRules = {
    togglerStart: /^(\s*)(<|&lt;)!---(TOGGLER) +([-#_a-zA-Z,;0-9\.]*?) *---(>|&gt;)(\s*)/,
    toggler: /^(\s*)(<|&lt;)!---(TOGGLER) +([-#_a-zA-Z,;0-9\.]*?) *---(>|&gt;)(\s*)/,
    togglerAppendStart: /^(\s*)(<|&lt;)!---(TOGGLER\.AFTER|TOGGLER\.BEFORE) +([-#_a-zA-Z,;:0-9\.]*?) *---(>|&gt;)(\s*)/,
    togglerAppend: /^(\s*)(<|&lt;)!---(TOGGLER\.AFTER|TOGGLER\.BEFORE) +([-#_a-zA-Z,;:0-9\.]*?) *---(>|&gt;)(\s*)/
};
var TogglerExtension = /** @class */ (function (_super) {
    __extends(TogglerExtension, _super);
    function TogglerExtension() {
        return _super.call(this, 'toggler', 'block', [], extendedBlockRules.togglerStart, extendedBlockRules.toggler) || this;
    }
    TogglerExtension.prototype.tokenizer = function (marked, src, tokens) {
        var rule = this.tokenizerRegExp;
        var match = rule.exec(src);
        if (match) {
            return {
                type: this.name,
                raw: match[0],
                togglertype: match[3],
                attr: match[4],
                tokens: []
            };
        }
    };
    TogglerExtension.prototype.renderer = function (marked, token) {
        var renderer = marked.parser.renderer;
        var type = token.togglertype;
        var param = token.attr;
        return renderer.renderExtendedMarkdownToggler(type, param);
    };
    return TogglerExtension;
}(markdown_extension_1.AbstractHtmlMarkdownExtension));
var TogglerAppendExtension = /** @class */ (function (_super) {
    __extends(TogglerAppendExtension, _super);
    function TogglerAppendExtension() {
        return _super.call(this, 'togglerAppend', 'block', [], extendedBlockRules.togglerAppendStart, extendedBlockRules.togglerAppend) || this;
    }
    TogglerAppendExtension.prototype.tokenizer = function (marked, src, tokens) {
        var rule = this.tokenizerRegExp;
        var match = rule.exec(src);
        if (match) {
            return {
                type: this.name,
                raw: match[0],
                togglertype: match[3],
                attr: match[4],
                tokens: []
            };
        }
    };
    TogglerAppendExtension.prototype.renderer = function (marked, token) {
        var renderer = marked.parser.renderer;
        var type = token.togglertype;
        var param = token.attr;
        return renderer.renderExtendedMarkdownTogglerAppend(type, param);
    };
    return TogglerAppendExtension;
}(markdown_extension_1.AbstractMarkdownExtension));
exports.MarkdownTogglerExtension = (new TogglerExtension()).toMarkDownExtension();
exports.MarkdownTogglerAppendExtension = (new TogglerAppendExtension()).toMarkDownExtension();
//# sourceMappingURL=markdown.toggler.extension.js.map