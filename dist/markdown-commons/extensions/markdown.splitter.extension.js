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
    splitterStart: /(:\|:)/,
    splitter: /^([\s\S]*?)(:\|:)([\s\S]*)$/
};
var SplitterExtension = /** @class */ (function (_super) {
    __extends(SplitterExtension, _super);
    function SplitterExtension() {
        return _super.call(this, 'splitter', 'inline', [], extendedBlockRules.splitterStart, extendedBlockRules.splitter) || this;
    }
    SplitterExtension.prototype.tokenizer = function (marked, src, tokens) {
        var rule = this.tokenizerRegExp;
        var match = rule.exec(src);
        if (match) {
            return {
                type: this.name,
                raw: match[0],
                tokens: [],
                before: marked.lexer.inlineTokens(match[1].trimRight()),
                after: marked.lexer.inlineTokens(match[3].trimLeft())
            };
        }
    };
    SplitterExtension.prototype.renderer = function (marked, token) {
        var renderer = marked.parser.renderer;
        var type = token.boxtype;
        var param = token.attr;
        return renderer.renderExtendedMarkdownSplitter(type, param, marked.parser.parseInline(token.before), marked.parser.parseInline(token.after));
    };
    return SplitterExtension;
}(markdown_extension_1.AbstractMarkdownExtension));
exports.MarkdownSplitterExtension = (new SplitterExtension()).toMarkDownExtension();
//# sourceMappingURL=markdown.splitter.extension.js.map