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
    ruleBoxStart: /^(\s*)(<|&lt;)\!---(BOX\.INFO|BOX\.WARN|BOX\.ALERT|BOX|CONTAINER|STYLE?) *([#-_a-zA-Z,;0-9\.: ]*?) *---(>|&gt;)(\s*)/,
    ruleBoxEnd: /^(\s*)(<|&lt;)\!---\/(BOX\.INFO|BOX\.WARN|BOX\.ALERT|BOX|CONTAINER|STYLE?) *([#-_a-zA-Z,;0-9\.: ]*?) *---(>|&gt;)(\s*)/
};
var RuleBoxExtension = /** @class */ (function (_super) {
    __extends(RuleBoxExtension, _super);
    function RuleBoxExtension() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    RuleBoxExtension.prototype.tokenizer = function (marked, src, tokens) {
        var rule = this.tokenizerRegExp;
        var match = rule.exec(src);
        if (match && match.length === 7) {
            var token = {
                type: this.name,
                raw: match[0],
                boxtype: match[3],
                attr: match[4],
                tokens: []
            };
            return token;
        }
    };
    return RuleBoxExtension;
}(markdown_extension_1.AbstractHtmlMarkdownExtension));
var RuleBoxStartExtension = /** @class */ (function (_super) {
    __extends(RuleBoxStartExtension, _super);
    function RuleBoxStartExtension() {
        return _super.call(this, 'ruleBoxStart', 'block', [], extendedBlockRules.ruleBoxStart, extendedBlockRules.ruleBoxStart) || this;
    }
    RuleBoxStartExtension.prototype.renderer = function (marked, token) {
        var renderer = marked.parser.renderer;
        var type = token.boxtype;
        var param = token.attr;
        return renderer.renderExtendedMarkdownBoxStart(type, param);
    };
    return RuleBoxStartExtension;
}(RuleBoxExtension));
var RuleBoxEndExtension = /** @class */ (function (_super) {
    __extends(RuleBoxEndExtension, _super);
    function RuleBoxEndExtension() {
        return _super.call(this, 'ruleBoxEnd', 'block', [], extendedBlockRules.ruleBoxEnd, extendedBlockRules.ruleBoxEnd) || this;
    }
    RuleBoxEndExtension.prototype.renderer = function (marked, token) {
        var renderer = marked.parser.renderer;
        var type = token.boxtype;
        var param = token.attr;
        return renderer.renderExtendedMarkdownBoxEnd(type, param);
    };
    return RuleBoxEndExtension;
}(RuleBoxExtension));
exports.MarkdownRuleBoxStartExtension = (new RuleBoxStartExtension()).toMarkDownExtension();
exports.MarkdownRuleBoxEndExtension = (new RuleBoxEndExtension()).toMarkDownExtension();
//# sourceMappingURL=markdown.rulebox.extension.js.map