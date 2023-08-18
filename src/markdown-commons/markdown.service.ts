import { marked } from 'marked/marked.min';
import {MarkdownExtension} from './extensions/markdown.extension';
import {MarkedOptions} from './options';
import {Renderer} from './renderer';

export class MarkdownService {
    constructor(protected options: MarkedOptions, protected extensions?: MarkdownExtension[]) {
    }

    renderMarkdown(markdown: string): string {
        let html = '';
        try {
            this.configureMarked();
            html = marked.parse(markdown);
        } finally {
            // NOOP
        }

        return html;
    }

    protected configureMarked() {
        const options = {... this.options};
        const renderer = new Renderer(options)
        renderer.initStylesClassesForTags(options.stylePrefix);
        options.renderer = renderer;

        marked.setOptions(options);

        if (this.extensions) {
            this.extensions.forEach(extension => {
                marked.use({ extensions: [extension] });
            })
        }
    }
}
