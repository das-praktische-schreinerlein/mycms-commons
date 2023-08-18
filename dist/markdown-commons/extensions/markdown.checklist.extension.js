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
var checkListConfigs = {
    'state-OPEN': {
        matchers: ['OPEN', 'OFFEN', 'o', 'O', '0', 'TODO']
    },
    'state-RUNNING': {
        matchers: ['RUNNING']
    },
    'state-LATE': {
        matchers: ['LATE']
    },
    'state-BLOCKED': {
        matchers: ['BLOCKED', 'WAITING', 'WAIT']
    },
    'state-WARNING': {
        matchers: ['WARNING']
    },
    'state-DONE': {
        matchers: ['DONE', 'OK', 'x', 'X', 'ERLEDIGT']
    },
    'test-TESTOPEN': {
        matchers: ['TESTOPEN']
    },
    'test-PASSED': {
        matchers: ['PASSED']
    },
    'test-FAILED': {
        matchers: ['FAILED', 'ERROR']
    }
};
var ChecklistExtension = /** @class */ (function (_super) {
    __extends(ChecklistExtension, _super);
    function ChecklistExtension() {
        return _super.call(this, 'checklist', 'inline', [], /\[(a-zA-Z0-9)\]/, undefined) || this;
    }
    ChecklistExtension.prototype.tokenizer = function (marked, src, tokens) {
        for (var checklistType in checkListConfigs) {
            var checklistConfig = checkListConfigs[checklistType];
            for (var _i = 0, _a = checklistConfig.matchers; _i < _a.length; _i++) {
                var matcher = _a[_i];
                var rule = new RegExp('^([\\s\\S]*?)(\\[' + matcher + '\\])([\\s\\S]*)$');
                var match = rule.exec(src);
                if (match) {
                    return {
                        type: this.name,
                        raw: match[0],
                        tokens: [],
                        checklistType: checklistType,
                        checklistValue: '[' + matcher + ']',
                        before: marked.lexer.inlineTokens(match[1]),
                        after: marked.lexer.inlineTokens(match[3])
                    };
                }
            }
        }
    };
    ChecklistExtension.prototype.renderer = function (marked, token) {
        var renderer = marked.parser.renderer;
        var type = token.checklistType;
        var value = token.checklistValue;
        return renderer.renderExtendedMarkdownChecklist(type, value, marked.parser.parseInline(token.before), marked.parser.parseInline(token.after));
    };
    return ChecklistExtension;
}(markdown_extension_1.AbstractMarkdownExtension));
exports.MarkdownChecklistExtension = (new ChecklistExtension()).toMarkDownExtension();
//# sourceMappingURL=markdown.checklist.extension.js.map