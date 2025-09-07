// 模拟后端流式返回 Markdown 内容（示例）
export function mockMarkdownStream(callback) {
    const fullText = `
  <think>
  用户问 “你能干什么”
  <citation>2233333
  - [Vue源码](https://github.com/vuejs/vue)
  - [JavaScript官网](https://www.javascript.com/)
  </citation>
  </think>

  # 一、知识问答与信息解读
  ## 1. 多领域知识问答
  - **基础知识**：涵盖历史、地理、科学、文化等各类常识性问题。
  - **专业领域**：涉及技术、医学、法律、经济等专业知识。
  - **实时信息**：提供最新新闻、天气、股市行情等动态信息。
  `;

  // {
    /* <img src="https://avatars.githubusercontent.com/u/76239030?v=4" alt="" />   */
  // }
  // const fullText = `
  // <think>
  // 用户问 “你能干什么”
  // </think>
  //  `
  // const fullText = `
  // <citation>
  // - [Vue源码](https://github.com/vuejs/vue)
  // - [JavaScript官网](https://www.javascript.com/)
  // </citation>
  //  `
//   const fullText = `
// <think>
// 用户问 “你能干什么”
// <citation>
// - [Vue源码](https://github.com/vuejs/vue)
// - [JavaScript官网](https://www.javascript.com/)
// </citation>
// </think>
//  `;

  let i = 0;
  function push() {
    if (i < fullText.length) {
      // 检查是否遇到标签开始
      if (fullText[i] === '<') {
        // 找到标签结束位置
        let tagEnd = fullText.indexOf('>', i);
        if (tagEnd !== -1) {
          // 整个标签一起返回
          const tag = fullText.substring(i, tagEnd + 1);
          callback(tag);
          i = tagEnd + 1;
        } else {
          // 如果没有找到结束标签，按字符返回
          callback(fullText[i]);
          i++;
        }
      } else {
        // 普通字符按字符返回
        callback(fullText[i]);
        i++;
      }
      setTimeout(push, 24); // 每 24ms 输出一个字符（可调整）
    }
  }
  push();
}
