<script>
import newMarkdown from './newMarkdown';
import { isValidTagName } from './cardParser';
import CodeBlock from './CodeBlock.vue';

export default {
  name: 'markdown-content',
  components: {
    CodeBlock
  },
  props: {
    content: {
      type: String,
      default: ''
    }
  },
  render(h) {
    const mdt = newMarkdown();
    const tokens = mdt.parse(this.content || '', {});

    function convertAttrsToProps(attrs) {
      if (!attrs) return {};
      return attrs.reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {});
    }

    function createCodeBlock(token) {
      const language = token.info || '';
      const code = token.content;
      return h(CodeBlock, {
        props: {
          language,
          code,
        },
        key: `code-block-${token.map ? token.map[0] : ''}`,
      });
    }

    function tokensToVNodes(tokens) {
      const stack = [];
      const result = [];
      for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];
        const parent = stack.length > 0 ? stack[stack.length - 1] : null;
        if (token.nesting === 1) {
          // Opening tag
          const tagName = isValidTagName(token.tag) ? token.tag : 'div';
          const vnode = h(tagName, { attrs: convertAttrsToProps(token.attrs) }, []);
          if (parent) {
            parent.children.push(vnode);
          } else {
            result.push(vnode);
          }
          stack.push(vnode);
        } else if (token.nesting === -1) {
          // Closing tag
          stack.pop();
        } else {
          // Content or self-closing tag
          let childNode;
          if (token.type === 'inline') {
            const inlineNodes = tokensToVNodes(token.children);
            if (parent) {
              parent.children.push(...inlineNodes);
            } else {
              result.push(h('span', inlineNodes));
            }
            continue;
          }
          switch (token.type) {
            case 'text':
              childNode = h('span', [token.content]);
              break;
            case 'fence':
              childNode = createCodeBlock(token);
              break;
            case 'code_inline':
              childNode = h('code', { attrs: convertAttrsToProps(token.attrs) }, [token.content]);
              break;
            case 'image': {
              const attrs = convertAttrsToProps(token.attrs);
              const src = attrs.src || '';
              const alt = token.content || '';
              childNode = h('img', { attrs: { ...attrs, src, alt } });
              break;
            }
            case 'softbreak':
              childNode = mdt.options.breaks ? h('br') : h('span', [' ']);
              break;
            case 'hardbreak':
              childNode = h('br');
              break;
            case 'html_inline':
            case 'html_block':
              childNode = h(token.type === 'html_block' ? 'div' : 'span', {
                domProps: { innerHTML: token.content },
              });
              break;
            default:
              if (token.content) {
                childNode = h('span', [token.content]);
              }
              break;
          }
          if (childNode) {
            if (parent) {
              if (!parent.children) parent.children = [];
              parent.children.push(childNode);
            } else {
              result.push(childNode);
            }
          }
        }
      }
      return result;
    }

    const vnodes = tokensToVNodes(tokens);
    return h('div', { class: 'markdown-body' }, vnodes);
  }
}
</script>
