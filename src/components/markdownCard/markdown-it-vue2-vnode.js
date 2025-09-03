// markdown-it-vue2-vnode.js
import sanitizeHtml from "sanitize-html";

const sanitizeOptions = {
  allowedAttributes: {
    "*": ["style", "class", "alt", "href", "title"],
  },
};

export default function markdownItVue2VNode(
  md,
  { createCodeBlock, components = {} } = {}
) {
  const renderers = {
    text: (token, h) => h("span", {}, [token.content]),
    code_inline: (token, h) => h("code", {}, [token.content]),
    fence: (token, h) => {
      // 如果是注册的组件名，则渲染组件
      if (components[token.info]) {
        return h(components[token.info], {
          props: { token }, // 传递内容作为 prop
        });
      }
      return createCodeBlock
        ? createCodeBlock(token, h)
        : h("pre", {}, [h("code", {}, [token.content])]);
    },
    image: (token, h) => {
      const src = token.attrs?.find((a) => a[0] === "src")?.[1] || "";
      const alt =
        token.attrs?.find((a) => a[0] === "alt")?.[1] || token.content || "";
      return h("img", { attrs: { src, alt } });
    },
    softbreak: (token, h) => h("br"),
    hardbreak: (token, h) => h("br"),
    html_inline: (token, h) =>
      h("span", {
        domProps: { innerHTML: sanitizeHtml(token.content, sanitizeOptions) },
      }),
    html_block: (token, h) =>
      h("div", {
        domProps: { innerHTML: sanitizeHtml(token.content, sanitizeOptions) },
      }),
    inline: (token, h, renderTokens) => renderTokens(token.children || [], h),
  };

  function renderTokens(tokens, h) {
    // 用 root 节点统一管理所有 children
    const root = { children: [] };
    // 栈结构，每个元素为 { vnode, children }
    const stack = [root];

    for (const token of tokens) {
      const parent = stack[stack.length - 1];

      if (token.nesting === 1) {
        const tagName = token.tag || "div";
        let vnode;
        // 判断是否是自定义组件
        if (components[tagName]) {
          vnode = h(components[tagName], {}, []);
        } else {
          vnode = h(tagName, {}, []);
        }
        // children 挂载到 vnode
        vnode.children = [];
        parent.children.push(vnode);
        stack.push(vnode);
      } else if (token.nesting === -1) {
        stack.pop();
      } else {
        let childNode;
        const renderer = renderers[token.type];
        if (renderer) {
          childNode = renderer(token, h, renderTokens);
        } else if (token.content) {
          childNode = h("span", {}, [token.content]);
        }

        if (childNode) {
          if (Array.isArray(childNode)) parent.children.push(...childNode);
          else parent.children.push(childNode);
        }
      }
    }

    return root.children;
  }

  md.renderer.renderVNode = function (tokens, options, env, h) {
    return renderTokens(tokens, h);
  };
}
