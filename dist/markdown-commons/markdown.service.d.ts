import { MarkdownExtension } from './extensions/markdown.extension';
import { MarkedOptions } from './options';
export declare class MarkdownService {
    protected options: MarkedOptions;
    protected extensions?: MarkdownExtension[];
    constructor(options: MarkedOptions, extensions?: MarkdownExtension[]);
    renderMarkdown(markdown: string): string;
    protected configureMarked(): void;
}
