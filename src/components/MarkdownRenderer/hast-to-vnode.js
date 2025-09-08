import { find, html } from "property-information";

// 提取节点内容，保留 HTML 标签
function extractTextContent(nodes = []) {
  return nodes
    .map((node) => {
      if (node.type === "text") return node.value;
      if (node.type === "element") {
        const children = extractTextContent(node.children);
        return `<${node.tagName}>${children}</${node.tagName}>`;
      }
      return "";
    })
    .join("");
}

// 渲染 HAST 为 VNode
export function render(hast, slots = {}, customAttrs = {}, h) {
  const keyCounter = {};
  const vnodes = renderChildren(hast.children || [], slots, customAttrs, h, keyCounter);
  return h("div", {}, vnodes);
}

// 遍历子节点
export function renderChildren(nodeList = [], slots, customAttrs, h, keyCounter) {
  return nodeList.map((node) => {
    switch (node.type) {
      case "text":
      case "raw":
        return node.value;

      case "root":
        return renderChildren(node.children || [], slots, customAttrs, h, keyCounter);

      case "element": {
        const { attrs, aliasList, vnodeProps } = getVNodeInfos(node, keyCounter, customAttrs);

        // 插槽渲染
        for (let i = aliasList.length - 1; i >= 0; i--) {
          const targetSlot = slots[aliasList[i]];
          if (typeof targetSlot === "function") {
            return targetSlot({
              ...vnodeProps,
              ...attrs,
              children: () => renderChildren(node.children || [], slots, customAttrs, h, keyCounter),
              rawContent: extractTextContent(node.children),
            });
          }
        }

        // 普通节点渲染
        return h(
          node.tagName,
          attrs,
          renderChildren(node.children || [], slots, customAttrs, h, keyCounter)
        );
      }

      default:
        return null;
    }
  });
}

// 获取节点 VNode 信息
export function getVNodeInfos(node, keyCounter, customAttrs) {
  const aliasList = [];
  const vnodeProps = {};
  let attrs = {};

  if (node.type === "element") {
    aliasList.push(node.tagName);

    // key
    keyCounter[node.tagName] = (keyCounter[node.tagName] || 0) + 1;
    vnodeProps.key = `${node.tagName}-${keyCounter[node.tagName]}`;

    node.properties = node.properties || {};
    attrs = Object.fromEntries(
      Object.entries(node.properties).map(([k, v]) => {
        const attrInfo = find(html, k);
        return [attrInfo.attribute, v];
      })
    );

    // slot 支持
    if (node.tagName === "slot" && typeof node.properties["slot-name"] === "string") {
      aliasList.push(node.properties["slot-name"]);
      delete node.properties["slot-name"];
    }

    // 应用自定义 attrs
    attrs = computeAttrs(node, aliasList, vnodeProps, attrs, customAttrs);
  }

  return { attrs, aliasList, vnodeProps };
}

// 合并自定义属性
function computeAttrs(node, aliasList, vnodeProps, attrs, customAttrs) {
  for (let i = aliasList.length - 1; i >= 0; i--) {
    const name = aliasList[i];
    if (name in customAttrs) {
      const customAttr = customAttrs[name];
      return {
        ...attrs,
        ...(typeof customAttr === "function"
          ? customAttr(node, { ...attrs, ...vnodeProps })
          : customAttr),
      };
    }
  }
  return attrs;
}
