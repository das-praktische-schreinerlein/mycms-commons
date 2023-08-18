import { marked } from 'marked/marked.min';
import {MarkedOptions} from './options';

/**
 * Renderer
 */
export class Renderer extends marked.Renderer {
  options: MarkedOptions;
  allTagStyles: {};

  constructor(options: MarkedOptions) {
    super(options);
    this.options = options;
    this.allTagStyles = {};
  }

  code(code, infostring, escaped) {
    const lang = (infostring || '').match(/\S*/)[0];

    if (lang && lang === 'mermaid') {
      return '<pre class="mermaid">' + code + '</pre>';
    }

    if (this.options.highlight) {
      const out = this.options.highlight(code, lang);
      if (out != null && out !== code) {
        escaped = true;
        code = out;
      }
    }

    code = code.replace(/\n$/, '') + '\n';

    if (!lang) {
      return '<pre' + this.genStyleClassAttrForTag('pre') + '><code' + this.genStyleClassAttrForTag('code') + '>'
          + (escaped ? code : this.escape(code, true))
          + '\n</code></pre>\n';
    }

    return '<pre' + this.genStyleClassAttrForTag('pre') + '><code class="'
        + this.options.langPrefix
        + this.escape(lang, true)
        + ' ' + this.genStyleClassesForTag('code')
        + '">'
        + (escaped ? code : this.escape(code, true))
        + '\n</code></pre>\n';
  }

  blockquote(quote) {
    const styleClass = this.genStyleClassAttrForTag('blockquote');
    return `<blockquote${styleClass}>\n${quote}</blockquote>\n`;
  }

  html(html) {
    return html;
  }

  heading(text, level, raw, slugger) {
    const styleClass = this.genStyleClassAttrForTag('h' + level);
    if (this.options.headerIds) {
      const id = this.options.headerPrefix + slugger.slug(raw);
      return `<h${level} id="${id}"${styleClass}>${text}</h${level}>\n`;
    }

    // ignore IDs
    return `<h${level}${styleClass}>${text}</h${level}>\n`;
  }

  hr() {
    const styleClass = this.genStyleClassAttrForTag('hr');
    return this.options.xhtml ? `<hr${styleClass}/>\n` : `<hr${styleClass}>\n`;
  }

  list(body, ordered, start) {
    const type = ordered ? 'ol' : 'ul',
        startatt = (ordered && start !== 1) ? (' start="' + start + '"') : '';
    const styleClass = this.genStyleClassAttrForTag(type);
    return '<' + type + startatt + `${styleClass}>\n` + body + '</' + type + '>\n';
  }

  listitem(text) {
    const styleClass = this.genStyleClassAttrForTag('li');
    return `<li${styleClass}>${text}</li>\n`;
  }

  checkbox(checked) {
    return '<input '
        + (checked ? 'checked="" ' : '')
        + this.genStyleClassAttrForTag('checkbox')
        + 'disabled="" type="checkbox"'
        + (this.options.xhtml ? ' /' : '')
        + '> ';
  }

  paragraph(text) {
    const styleClass = this.genStyleClassAttrForTag('p');
    return `<p${styleClass}>${text}</p>\n`;
  }

  table(header, body) {
    if (body) {
      const styleClass = this.genStyleClassAttrForTag('tbody');
      body = `<tbody${styleClass}>${body}</tbody>`;
    }

    const tablestyleClass = this.genStyleClassAttrForTag('table');
    const theadstyleClass = this.genStyleClassAttrForTag('thead');
    return `<table${tablestyleClass}>\n`
        + `<thead${theadstyleClass}>\n`
        + header
        + '</thead>\n'
        + body
        + '</table>\n';
  }

  tablerow(content) {
    const styleClass = this.genStyleClassAttrForTag('tr');
    return `<tr${styleClass}>\n${content}</tr>\n`;
  }

  tablecell(content, flags) {
    const type = flags.header ? 'th' : 'td';
    const styleClass = this.genStyleClassAttrForTag(type);
    const tag = flags.align
        ? `<${type} align="${flags.align}"${styleClass}>`
        : `<${type}${styleClass}>`;
    return tag + content + `</${type}>\n`;
  }

  strong(text) {
    const styleClass = this.genStyleClassAttrForTag('strong');
    return `<strong${styleClass}>${text}</strong>`;
  }

  em(text) {
    const styleClass = this.genStyleClassAttrForTag('em');
    return `<em${styleClass}>${text}</em>`;
  }

  codespan(text) {
    const styleClass = this.genStyleClassAttrForTag('code');
    return `<code${styleClass}>${text}</code>`;
  }

  br() {
    const styleClass = this.genStyleClassAttrForTag('br');
    return this.options.xhtml ? `<br${styleClass}/>` : `<br${styleClass}>`;
  }

  del(text) {
    const styleClass = this.genStyleClassAttrForTag('del');
    return `<del${styleClass}>${text}</del>`;
  }

  link(href, title, text) {
    // TODO href = marked.cleanUrl(this.options.sanitize, this.options.baseUrl, href);
    if (href === null) {
      return text;
    }
    let out = '<a href="' + href + '"' + this.genStyleClassAttrForTag('a');
    if (title) {
      out += ' title="' + title + '"';
    }
    out += '>' + text + '</a>';
    return out;
  }

  image(href, title, text) {
    // TODO href = marked.cleanUrl(this.options.sanitize, this.options.baseUrl, href);
    if (href === null) {
      return text;
    }

    let out = `<img src="${href}" alt="${text}"`;
    if (title) {
      out += ` title="${title}"`;
    }
    out += this.genStyleClassAttrForTag('img') + this.options.xhtml ? '/>' : '>';
    return out;
  }

  text(text) {
    return text;
  }

  genStyleClassesForTag(tag) {
    const styles = this.allTagStyles[tag];
    if (!styles) {
      return '';
    }
    return Object.getOwnPropertyNames(styles).join(' ');
  };

  genStyleClassAttrForTag(tag) {
    const styleClasses = this.genStyleClassesForTag(tag);
    if (!styleClasses) {
      return '';
    }

    return ' class="' + styleClasses + '"';
  };

  initStylesClassesForTags(prefix) {
    const renderer = this;
    const tags = [
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'h7', 'h8',
      'img', 'a', 'p',
      'table', 'tr', 'td', 'th', 'tbody', 'thead',
      'br',
      'strong', 'em',
      'dl', 'dt', 'dd',
      'li', 'ul', 'ol',
      'container',
      'box', 'box-ue', 'box-container',
      'infobox', 'infobox-ue', 'infobox-container',
      'warnbox', 'warnbox-ue', 'warnbox-container',
      'alertbox', 'alertbox-ue', 'alertbox-container',
      'togglerparent', 'splitter1', 'splitter2',
      'checklist'
    ];
    const allTagStyles = renderer.allTagStyles;
    tags.map(function (tag) {
      const style = (prefix ? prefix : '') + 'md-' + tag;
      let tagStyles = allTagStyles[tag];
      if (!tagStyles) {
        tagStyles = {};
      }

      tagStyles[style] = style;
      allTagStyles[tag] = tagStyles;
    });

    renderer.allTagStyles = allTagStyles;
  };

  renderExtendedMarkdownBoxhtmlStart(type, param) {
    const renderer = this;
    return '<div class="' + renderer.genStyleClassesForTag(type + 'box') + '">' +
        '<div class="' + renderer.genStyleClassesForTag(type + 'box-ue') + '">' + param + '</div>' +
        '<div class="' + renderer.genStyleClassesForTag(type + 'box-container') + '">';
  };

  renderExtendedMarkdownBoxStart(type, param) {
    const renderer = this;
    let res = '';

    if (type.toLowerCase() === 'box') {
      res = '<div class="' + renderer.genStyleClassesForTag('box') + ' ' + param + '">';
    } else if (type.toLowerCase() === 'container') {
      res = '<div class="' + renderer.genStyleClassesForTag('container') + ' md-container-' + param + '" id="md-container-' + param + '">';
    } else if (type.toLowerCase() === 'box.info') {
      res = renderer.renderExtendedMarkdownBoxhtmlStart('info', param);
    } else if (type.toLowerCase() === 'box.warn') {
      res = renderer.renderExtendedMarkdownBoxhtmlStart('warn', param);
    } else if (type.toLowerCase() === 'box.alert') {
      res = renderer.renderExtendedMarkdownBoxhtmlStart('alert', param);
    } else if (type.toLowerCase() === 'style' && param) {
      // do set style for next elements

      // split params elements:styles
      const params = param.split(':');
      let tags = [],
          styles = [];
      if (params.length > 0) {
        tags = params[0].split(' ');
        if (params.length > 1) {
          styles = params[1].split(' ');
        }
      }

      // set styles for all tags
      const allTagStyles = renderer.allTagStyles;
      tags.map(function (tag) {
        let tagStyles = allTagStyles[tag];
        if (!tagStyles) {
          tagStyles = {};
        }

        styles.map(function (style) {
          tagStyles[style] = style;
        });

        allTagStyles[tag] = tagStyles;
      });

      renderer.allTagStyles = allTagStyles;
    }
    return res;
  };

  renderExtendedMarkdownBoxEnd(type, param) {
    const renderer = this;
    let res = '';

    if (type.toLowerCase() === 'box') {
      res = '</div>';
    } else if (type.toLowerCase() === 'box.info' ||
        type.toLowerCase() === 'box.alert' ||
        type.toLowerCase() === 'box.warn') {
      res = '</div></div>';
    } else if (type.toLowerCase() === 'container') {
      res = '</div>';
    } else if (type.toLowerCase() === 'style' && param) {
      // do reset style for next elements
      // split params elements:styles
      const params = param.split(':');
      let tags = [],
          styles = [];
      if (params.length > 0) {
        tags = params[0].split(' ');
        if (params.length > 1) {
          styles = params[1].split(' ');
        }
      }

      // reset styles for all tags
      const allTagStyles = renderer.allTagStyles;
      tags.map(function (tag) {
        styles.map(function (style) {
          if (allTagStyles[tag] && allTagStyles[tag][style]) {
            allTagStyles[tag][style] = '';
            delete allTagStyles[tag][style];
          }
        });
      });
    }

    return res;
  };

  renderExtendedMarkdownToggler(type, attr) {
    const renderer = this;

    let res = '';
    const params = (attr || '').split(',');
    let togglerType = 'icon',
        id;
    if (params.length > 0) {
      id = params[0].replace(' ');
      if (params.length > 1) {
        togglerType = params[1];
      }
    }

    if (type.toLowerCase() === 'toggler' && id !== undefined && id !== '') {
      res = '<div' +
          ' class="' + renderer.genStyleClassesForTag('togglerparent') + ' md-togglerparent-' + id + '"' +
          ' id="md-togglerparent-' + id + '"' +
          ' data-togglecontainer="' + id + '"' +
          ' data-toggletype="' + togglerType + '"' +
          '>' +
          '</div>';
    }

    return res;
  };

  renderExtendedMarkdownTogglerAppend(type, attr) {
    const renderer = this;

    let res = '';
    const params = (attr || '').split(',');
    let togglerType = 'icon',
        tags = [],
        styles = [];
    if (params.length > 0) {
      if (params.length > 1) {
        togglerType = params[1];
      }

      // split params elements:styles
      const filter = params[0].replace(' ').split(':');
      if (filter.length > 0) {
        tags = filter[0].split(' ');
        if (filter.length > 1) {
          styles = filter[1].split(' ');
        }
      }

      tags.map(function (tag) {
        styles.map(function (style) {
          res = '<div' +
              ' style="display: none"' +
              ' class="dps-command-toggle-append"' +
              ' data-togglefilter="' + tag + '.' + style + '"' +
              ' data-toggletype="' + togglerType + '"' +
              ' data-togglepos="' + type + '"' +
              '>' +
              '</div>';
        });
      });
    }

    return res;
  };

  renderExtendedMarkdownTOC(type, attr) {
    const renderer = this;
    let appBaseVarName = this.options.appBaseVarName;
    if (!appBaseVarName) {
      appBaseVarName = 'dpsAppBase';
    }

    let res = '';
    if (marked.nextTocId === undefined) {
      marked.nextTocId = 1;
    }

    if (type.toLowerCase() === 'toc') {
      const tocId = 'dps-md-toc-container-' + marked.nextTocId,
          tocElement = appBaseVarName + '.$(\'div.' + tocId + '\')',
          srcElement = tocElement + '.parents(\'div\')',
          settings = 'undefined';
      res = '<div class="dps-md-toc-container ' + tocId + '" id="' + tocId + '"></div>' +
          '<script>' + appBaseVarName + '.get(\'Renderer\').addTOCForBlock(' +
          tocElement + ', ' + srcElement + ', ' + settings + ');</script>';
    }

    marked.nextTocId++;

    return res;
  };

  renderExtendedMarkdownSplitter(type, attr, first, second) {
    const renderer = this;
    return '<label class="' + renderer.genStyleClassesForTag('splitter1') + '">' + first + '</label>' +
        '<span class="' + renderer.genStyleClassesForTag('splitter2') + '">' + second + '</span>';
  };

  renderExtendedMarkdownChecklist(type, value, before, after) {
    const renderer = this;
    return before + '<span class="' + renderer.genStyleClassesForTag('checklist') + '-' + type + '">' + value + '</span>' +
        after;
  };

  /**
   * Helpers
   */
  escapeTest = /[&<>"']/;
  escapeReplace = new RegExp(this.escapeTest.source, 'g');
  escapeTestNoEncode = /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/;
  escapeReplaceNoEncode = new RegExp(this.escapeTestNoEncode.source, 'g');
  escapeReplacements = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  };
  getEscapeReplacement = (ch) => this.escapeReplacements[ch];
  escape(html, encode) {
    if (encode) {
      if (this.escapeTest.test(html)) {
        return html.replace(this.escapeReplace, this.getEscapeReplacement);
      }
    } else {
      if (this.escapeTestNoEncode.test(html)) {
        return html.replace(this.escapeReplaceNoEncode, this.getEscapeReplacement);
      }
    }

    return html;
  }

  unescapeTest = /&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig;

  /**
   * @param {string} html
   */
  unescape(html) {
    // explicitly match decimal, hex, and named HTML entities
    return html.replace(this.unescapeTest, (_, n) => {
      n = n.toLowerCase();
      if (n === 'colon') return ':';
      if (n.charAt(0) === '#') {
        return n.charAt(1) === 'x'
            ? String.fromCharCode(parseInt(n.substring(2), 16))
            : String.fromCharCode(+n.substring(1));
      }
      return '';
    });
  }

  nonWordAndColonTest = /[^\w:]/g;
  originIndependentUrl = /^$|^[a-z][a-z0-9+.-]*:|^[?#]/i;

  /**
   * @param {boolean} sanitize
   * @param {string} base
   * @param {string} href
   */
  cleanUrl(sanitize, base, href) {
    if (sanitize) {
      let prot;
      try {
        prot = decodeURIComponent(unescape(href))
            .replace(this.nonWordAndColonTest, '')
            .toLowerCase();
      } catch (e) {
        return null;
      }
      if (prot.indexOf('javascript:') === 0 || prot.indexOf('vbscript:') === 0 || prot.indexOf('data:') === 0) {
        return null;
      }
    }
    if (base && !this.originIndependentUrl.test(href)) {
      href = this.resolveUrl(base, href);
    }
    try {
      href = encodeURI(href).replace(/%25/g, '%');
    } catch (e) {
      return null;
    }
    return href;
  }

  baseUrls = {};
  justDomain = /^[^:]+:\/*[^/]*$/;
  protocol = /^([^:]+:)[\s\S]*$/;
  domain = /^([^:]+:\/*[^/]*)[\s\S]*$/;

  /**
   * @param {string} base
   * @param {string} href
   */
  resolveUrl(base, href) {
    if (!this.baseUrls[' ' + base]) {
      // we can ignore everything in base after the last slash of its path component,
      // but we might need to add _that_
      // https://tools.ietf.org/html/rfc3986#section-3
      if (this.justDomain.test(base)) {
        this.baseUrls[' ' + base] = base + '/';
      } else {
        this.baseUrls[' ' + base] = this.rtrim(base, '/', true);
      }
    }
    base = this.baseUrls[' ' + base];
    const relativeBase = base.indexOf(':') === -1;

    if (href.substring(0, 2) === '//') {
      if (relativeBase) {
        return href;
      }
      return base.replace(this.protocol, '$1') + href;
    } else if (href.charAt(0) === '/') {
      if (relativeBase) {
        return href;
      }
      return base.replace(this.domain, '$1') + href;
    } else {
      return base + href;
    }
  }

  rtrim(str, c, invert) {
    const l = str.length;
    if (l === 0) {
      return '';
    }

    // Length of suffix matching the invert condition.
    let suffLen = 0;

    // Step left until we fail to match the invert condition.
    while (suffLen < l) {
      const currChar = str.charAt(l - suffLen - 1);
      if (currChar === c && !invert) {
        suffLen++;
      } else if (currChar !== c && invert) {
        suffLen++;
      } else {
        break;
      }
    }

    return str.slice(0, l - suffLen);
  }
}
