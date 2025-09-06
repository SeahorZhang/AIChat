// 模拟后端流式返回 Markdown 内容（示例）
export function mockMarkdownStream(callback) {
  const fullText = `
<taink>
用户问 “你能干什么”，需要全面且有条理地介绍自己的能力，同时让用户容易理解。
<citation>
- [Vue源码](https://github.com/vuejs/vue)
- [JavaScript官网](https://www.javascript.com/)
</citation>
</taink>

# 一、知识问答与信息解读
## 1. 多领域知识问答
- **基础知识**：涵盖历史、地理、科学、文化等各类常识性问题。
- **专业领域**：涉及技术、医学、法律、经济等专业知识。
- **实时信息**：提供最新新闻、天气、股市行情等动态信息。
`;

  let i = 0;
  function push() {
    if (i < fullText.length) {
      callback(fullText[i]);
      i++;
      setTimeout(push, 24); // 每 24ms 输出一个字符（可调整）
    }
  }
  push();
}
