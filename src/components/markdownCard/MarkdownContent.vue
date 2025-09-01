<script>
import newMarkdown from './newMarkdown';
import { tokensToAst, htmlToVNode, isValidTagName } from './cardParser';
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
    const mdt = newMarkdown()

    const tokens = mdt.parse(this.content || '', {});
    const ast = tokensToAst(tokens);
    const vnodes = astToVnodes(ast);

    function astToVnodes(nodes) {
      return nodes.map(node => processASTNode(node));
    }

    function processASTNode(node) {
      if (node.nodeType === 'html_inline' || node.nodeType === 'html_block') {
        const outerVnode = htmlToVNode(node.openNode?.content || '', h)[0];
        if (outerVnode) {
          const outerChildren = outerVnode?.children || [];
          if (Array.isArray(outerChildren)) {
            outerVnode.children = [...outerChildren, ...node.children.map(child => processASTNode(child))];
          } else {
            outerVnode.children = [outerChildren, ...node.children.map(child => processASTNode(child))];
          }
          return outerVnode;
        } else {
          return node.openNode?.content || ''
        }
      }

      if (node.nodeType === 'inline') {
        const html = mdt.renderer.render([node.openNode], mdt.options, {});
        const vNodes = htmlToVNode(html, h);
        return h('div', vNodes);
      }

      if (isToken(node)) {
        return processToken(node);
      }

      return processASTNodeInternal(node);
    }

    function isToken(node) {
      return 'type' in node && 'content' in node;
    }

    function processToken(token) {
      if (token.type === 'text') {
        return token.content;
      }

      if (token.type === 'inline') {
        return processInlineToken(token);
      }

      if (token.type === 'fence') {
        return processFenceToken(token);
      }

      if (token.type === 'softbreak') {
        return mdt.options.breaks ? h('br') : '\n';
      }

      if (token.type === 'html_block' || token.type === 'html_inline') {
        return token.type === 'html_block' ? h('div', { innerHTML: token.content }) : h('span', { innerHTML: token.content });
      }

      // 优先使用token的tag属性
      if (token.tag) {
        const tagName = isValidTagName(token.tag) ? token.tag : 'div'
        const attrs = convertAttrsToProps(token.attrs || []);
        return h(tagName, { ...attrs, key: token.vNodeKey }, token.content);
      }

      return token.content;
    }

    function convertAttrsToProps(attrs) {
      return attrs.reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {});
    }


    function processFenceToken(token) {
      const language = token.info?.replace(/<span\b[^>]*>/i, '').replace('</span>', '') || '';
      const code = token.content;
      return createCodeBlock(language, code, token.tokenIndex);
    }

    function createCodeBlock(
      language,
      code,
      blockIndex,
    ) {
      return h(
        CodeBlock,
        {
          language,
          code,
          blockIndex,
          key: `code-block-${blockIndex}`,
        },
      );
    }


    function processInlineToken(token) {
      const html = mdt.renderer.render([token], mdt.options, {});
      const vNodes = htmlToVNode(html, h);
      return h('div', vNodes);
    }


    function processASTNodeInternal(node) {
      let tagName = 'div';
      if (node.openNode?.tag && isValidTagName(node.openNode?.tag)) {
        tagName = node.openNode?.tag
      }
      const attrs = convertAttrsToProps(node.openNode?.attrs || []);

      // 特殊处理fence类型的token
      if (node.openNode?.type === 'fence') {
        return processFenceToken(node.openNode);
      }

      // 处理所有带tag的AST节点
      if (node.openNode?.tag) {
        let tagName = isValidTagName(node.openNode?.tag) ? node.openNode?.tag : 'div'
        const children = node.children.map(child => processASTNode(child));
        const attrs = convertAttrsToProps(node.openNode?.attrs || []);
        return h(tagName, { ...attrs, key: node.vNodeKey }, children);
      }

      const children = node.children.map(child => processASTNode(child));

      return h(tagName, { ...attrs, key: node.vNodeKey }, children);
    }


    return h('div', vnodes)
  }
}
</script>