// tokensToVNodes.js
// 通用 markdown-it tokens 转 Vue VNode 工具函数

/**
 * @param {Array} tokens markdown-it 生成的 tokens
 * @param {Function} h Vue render 函数 (createElement)
 * @param {Object} options 可选项（如 markdown-it 实例、CodeBlock 组件等）
 * @returns {Array} VNode 数组
 */
export default function tokensToVNodes(tokens, h, options = {}) {
  const { mdt, CodeBlock } = options;
  function convertAttrsToProps(attrs) {
    if (!attrs) return {};
    return attrs.reduce((acc, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {});
  }
  function isValidTagName(tag) {
    return typeof tag === 'string' && /^[a-zA-Z][\w-]*$/.test(tag);
  }
  const stack = [];
  const result = [];
  const tokenRenderers = {
    text: (token) => h('span', [token.content]),
    fence: (token) =>
      CodeBlock
        ? h(CodeBlock, {
            props: { language: token.info || '', code: token.content },
            key: `code-block-${token.map ? token.map[0] : ''}`,
          })
        : h('pre', [token.content]),
    code_inline: (token) => h('code', { attrs: convertAttrsToProps(token.attrs) }, [token.content]),
    image: (token) => {
      const attrs = convertAttrsToProps(token.attrs);
      const src = attrs.src || '';
      const alt = token.content || '';
      return h('img', { attrs: { ...attrs, src, alt } });
    },
    softbreak: (token) => (mdt && mdt.options.breaks ? h('br') : h('span', [' '])),
    hardbreak: () => h('br'),
    html_inline: (token) => h('span', { domProps: { innerHTML: token.content } }),
    html_block: (token) => h('div', { domProps: { innerHTML: token.content } }),
    // ...可继续扩展
  };
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
        const inlineNodes = tokensToVNodes(token.children, h, options);
        if (parent) {
          parent.children.push(...inlineNodes);
        } else {
          result.push(h('span', inlineNodes));
        }
        continue;
      }
      const renderer = tokenRenderers[token.type];
      if (renderer) {
        childNode = renderer(token, h, options);
      } else if (token.content) {
        childNode = h('span', [token.content]);
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
