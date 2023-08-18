"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var markdown_rulebox_extension_1 = require("./markdown.rulebox.extension");
var markdown_splitter_extension_1 = require("./markdown.splitter.extension");
var markdown_toggler_extension_1 = require("./markdown.toggler.extension");
var markdown_checklist_extension_1 = require("./markdown.checklist.extension");
exports.MarkdownDefaultExtensions = [
    markdown_checklist_extension_1.MarkdownChecklistExtension,
    markdown_rulebox_extension_1.MarkdownRuleBoxStartExtension,
    markdown_rulebox_extension_1.MarkdownRuleBoxEndExtension,
    markdown_splitter_extension_1.MarkdownSplitterExtension,
    markdown_toggler_extension_1.MarkdownTogglerExtension,
    markdown_toggler_extension_1.MarkdownTogglerAppendExtension
];
//# sourceMappingURL=markdown.extensions.js.map