// markdown-it-trank.js
import MarkdownIt from 'markdown-it';
import container from 'markdown-it-container';

export function createMarkdownIt() {
  const md = new MarkdownIt();

  md.use(container, 'trank', {
    validate(params) {
      return /^trank\s*(.*)$/.test(params.trim());
    },
    render(tokens, idx) {
      const m = tokens[idx].info.trim().match(/^trank\s*(.*)$/);
      const slotName = m && m[1] ? m[1] : '';

      if (tokens[idx].nesting === 1) {
        return `<trank-component slot-name="${slotName}">`;
      } else {
        return `</trank-component>`;
      }
    },
  });

  return md;
}