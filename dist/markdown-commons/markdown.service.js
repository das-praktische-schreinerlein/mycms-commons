"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var marked_min_1 = require("marked/marked.min");
var renderer_1 = require("./renderer");
var MarkdownService = /** @class */ (function () {
    function MarkdownService(options, extensions) {
        this.options = options;
        this.extensions = extensions;
    }
    MarkdownService.prototype.renderMarkdown = function (markdown) {
        var html = '';
        try {
            this.configureMarked();
            html = marked_min_1.marked.parse(markdown);
        }
        finally {
            // NOOP
        }
        return html;
    };
    MarkdownService.prototype.configureMarked = function () {
        var options = __assign({}, this.options);
        var renderer = new renderer_1.Renderer(options);
        renderer.initStylesClassesForTags(options.stylePrefix);
        options.renderer = renderer;
        marked_min_1.marked.setOptions(options);
        if (this.extensions) {
            this.extensions.forEach(function (extension) {
                marked_min_1.marked.use({ extensions: [extension] });
            });
        }
    };
    return MarkdownService;
}());
exports.MarkdownService = MarkdownService;
//# sourceMappingURL=markdown.service.js.map