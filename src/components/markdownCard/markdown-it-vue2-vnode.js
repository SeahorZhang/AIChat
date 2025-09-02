// markdown-it-vue2-vnode.js
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
      h("span", { domProps: { innerHTML: token.content } }),
    html_block: (token, h) =>
      h("div", { domProps: { innerHTML: token.content } }),
    inline: (token, h, renderTokens) => renderTokens(token.children || [], h),
  };

  function renderTokens(tokens, h) {
    const vnodes = [];
    const stack = [];

    for (const token of tokens) {
      const parent = stack.length > 0 ? stack[stack.length - 1] : null;

      if (token.nesting === 1) {
        const tagName = token.tag || "div";

        // 判断是否是自定义组件
        if (components[tagName]) {
          const vnode = h(components[tagName], {}, []);
          if (parent) parent.children.push(vnode);
          else vnodes.push(vnode);
          stack.push(vnode);
          continue;
        }

        const vnode = h(tagName, {}, []);
        if (parent) parent.children.push(vnode);
        else vnodes.push(vnode);
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
          const target = parent ? parent.children : vnodes;
          if (Array.isArray(childNode)) target.push(...childNode);
          else target.push(childNode);
        }
      }
    }

    return vnodes;
  }

  md.renderer.renderVNode = function (tokens, options, env, h) {
    return renderTokens(tokens, h);
  };
}
