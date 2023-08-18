import { marked } from 'marked/marked.min';

export interface MarkedOptions {
  breaks: boolean;
  gfm: boolean;
  pedantic: boolean;
  sanitize: boolean;
  smartLists: boolean;
  smartypants: boolean;
  tables: boolean;
  async: boolean;
  baseUrl: null;
  headerIds: boolean;
  headerPrefix: string;
  highlight: Function;
  langPrefix: string;
  mangle: boolean;
  renderer: marked.Renderer;
  sanitizer: null;
  silent: boolean;
  tokenizer: marked.Tokenizer;
  walkTokens: null;
  xhtml: boolean;

  appBaseVarName: string;
  stylePrefix: string;
}

export const DefaultOptions = {
  getDefault(): MarkedOptions {
    return {
      // from ngx-md
      breaks: false, // boolean 	false 	v0.2.7 	If true, add <br> on a single line break (copies GitHub behavior on comments, but not on rendered markdown files). Requires gfm be true.
      gfm: true, // boolean 	true 	v0.2.1 	If true, use approved GitHub Flavored Markdown (GFM) specification.
      pedantic: false, // boolean 	false 	v0.2.1 	If true, conform to the original markdown.pl as much as possible. Don't fix original markdown bugs or behavior. Turns off and overrides gfm.
      sanitize: false, // boolean 	false 	v0.2.1 	If true, sanitize the HTML passed into markdownString with the sanitizer function.
      smartLists: true, // TODO nor more seen on
      smartypants: false, // boolean 	false 	v0.2.9 	If true, use "smart" typographic punctuation for things like quotes and dashes.
      tables: true,


      async: false, // boolean 	false 	4.1.0 	If true, walkTokens functions can be async and marked.parse will return a promise that resolves when all walk tokens functions resolve.
      baseUrl: null, // string 	null 	0.3.9 	A prefix url for any relative link.
      headerIds: true, //  boolean 	true 	v0.4.0 	If true, include an id attribute when emitting headings (h1, h2, h3, etc).
      headerPrefix: '', // string 	'' 	v0.3.0 	A string to prefix the id attribute when emitting headings (h1, h2, h3, etc).
      highlight: null, // function 	null 	v0.3.0 	A function to highlight code blocks, see Asynchronous highlighting.
      langPrefix: 'language-', // string 	'language-' 	v0.3.0 	A string to prefix the className in a <code> block. Useful for syntax highlighting.
      mangle: true, // boolean 	true 	v0.3.4 	If true, autolinked email address is escaped with HTML character references.
      renderer: new marked.Renderer(), // object 	new Renderer() 	v0.3.0 	An object containing functions to render tokens to HTML. See extensibility for more details.
      sanitizer: null, // function 	null 	v0.3.4 	A function to sanitize the HTML passed into markdownString.
      silent: false, // boolean 	false 	v0.2.7 	If true, the parser does not throw any exception.
      tokenizer: new marked.Tokenizer(), // object 	new Tokenizer() 	v1.0.0 	An object containing functions to create tokens from markdown. See extensibility for more details.
      walkTokens: null, // function 	null 	v1.1.0 	A function which is called for every token. See extensibility for more details.
      xhtml: false, // boolean 	false 	v0.3.2 	If true, emit self-closing HTML tags for void elements (<br/>, <img/>, etc.) with a "/" as required by XHTML.

      // from marked for syntax
      /**
       highlight: function(code, lang) {
                const hljs = require('highlight.js');
                const language = hljs.getLanguage(lang) ? lang : 'plaintext';
                return hljs.highlight(code, { language }).value;
            },
       langPrefix: 'hljs language-', // highlight.js css expects a top-level 'hljs' class.
       **/

      appBaseVarName: 'dpsAppBase',
      stylePrefix: 'dps-'
    }
  }
}
