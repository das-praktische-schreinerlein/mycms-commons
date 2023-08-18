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
    tocStart: /(\s*)(<|&lt;)!---(TOC) *([-#_a-zA-Z,;0-9\.]*?) *---(>|&gt;)(\s*)/,
    toc: /(\s*)(<|&lt;)!---(TOC) *([-#_a-zA-Z,;0-9\.]*?) *---(>|&gt;)(\s*)/
};
// TODO its not functional
var TocExtension = /** @class */ (function (_super) {
    __extends(TocExtension, _super);
    function TocExtension() {
        return _super.call(this, 'toc', 'inline', [], extendedBlockRules.tocStart, extendedBlockRules.toc) || this;
    }
    TocExtension.prototype.tokenizer = function (marked, src, tokens) {
        var rule = this.tokenizerRegExp;
        var match = rule.exec(src);
        if (match) {
            return {
                type: this.name,
                raw: match[0],
                toctype: match[3],
                attr: match[4],
                tokens: []
            };
        }
    };
    TocExtension.prototype.renderer = function (marked, token) {
        var renderer = marked.parser.renderer;
        var type = token.toctype;
        var param = token.attr;
        return renderer.renderExtendedMarkdownTOC(type, param);
    };
    return TocExtension;
}(markdown_extension_1.AbstractHtmlMarkdownExtension));
exports.MarkdownTocExtension = (new TocExtension()).toMarkDownExtension();
//# sourceMappingURL=markdown.toc.extension.js.map