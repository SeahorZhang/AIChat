<template>
  <div>
    <button @click="startStream">开始流式 Markdown 输出</button>

    <div v-for="(block, idx) in renderedBlocks" :key="idx" class="block">
      <!-- 思考块 -->
      <details v-if="block.type === 'tarnk'" :open="true">
        <summary>
          {{ block.finished ? "已完成思考" : "深度思考（点击展开/折叠）" }}
        </summary>
        <div class="thought-body" v-html="block.html"></div>
      </details>

      <!-- 引用块 -->
      <details v-else-if="block.type === 'citation'" :open="true">
        <summary>
          {{ block.finished ? "引用来源（已加载）" : "引用来源（加载中…）" }}
        </summary>
        <div class="citation-body" v-html="block.html"></div>
      </details>

      <!-- 普通 Markdown -->
      <div v-else v-html="block.html"></div>
    </div>
  </div>
</template>

<script>
import MarkdownIt from "markdown-it";
const md = new MarkdownIt();

// 模拟后端流式返回 Markdown 内容（示例）
export function mockMarkdownStream(callback) {
  const fullText = `
<tarnk>
用户问 “你能干什么”，需要全面且有条理地介绍自己的能力，同时让用户容易理解。
<citation>
- [Vue源码](https://github.com/vuejs/vue)
- [JavaScript官网](https://www.javascript.com/)
</citation>
</tarnk>

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

export default {
  data() {
    return {
      renderedBlocks: [],   // 存放所有块（normal / tarnk / citation）
      buffer: "",           // 用于检测标签的临时 buffer
      blockStack: [],       // 存放当前打开块的索引（用于嵌套）
    };
  },
  methods: {
    startStream() {
      this.renderedBlocks = [];
      this.buffer = "";
      this.blockStack = [];
      // 用箭头函数保证 this 正确绑定
      mockMarkdownStream((ch) => this.handleChar(ch));
    },

    handleChar(char) {
      this.buffer += char;

      // ---- 标签开/关 检测 ----
      if (this.buffer.endsWith("<tarnk>")) {
        // 新建一个 tarnk 块，并把它的索引 push 到栈里
        const idx = this.renderedBlocks.push({
          type: "tarnk",
          content: "",
          html: "",
          finished: false,
        }) - 1;
        this.blockStack.push(idx);
        this.buffer = "";
        return;
      }

      if (this.buffer.endsWith("</tarnk>")) {
        // 关闭当前栈顶块（应该是 tarnk）
        const poppedIdx = this.blockStack.pop();
        if (poppedIdx !== undefined) {
          const blk = this.renderedBlocks[poppedIdx];
          if (blk && blk.type === "tarnk") blk.finished = true;
        }
        this.buffer = "";
        return;
      }

      if (this.buffer.endsWith("<citation>")) {
        const idx = this.renderedBlocks.push({
          type: "citation",
          content: "",
          html: "",
          finished: false,
        }) - 1;
        this.blockStack.push(idx);
        this.buffer = "";
        return;
      }

      if (this.buffer.endsWith("</citation>")) {
        const poppedIdx = this.blockStack.pop();
        if (poppedIdx !== undefined) {
          const blk = this.renderedBlocks[poppedIdx];
          if (blk && blk.type === "citation") blk.finished = true;
        }
        this.buffer = "";
        return;
      }

      // ---- 普通字符：追加到当前活跃块（栈顶），若无则追加到 normal 块 ----
      // 判断当前 buffer 是否为一个以 '<' 开头的标签片段（若是则等待完整标签）
      if (!this.buffer.startsWith("<")) {
        if (this.blockStack.length === 0) {
          // normal 模式
          let last = this.renderedBlocks[this.renderedBlocks.length - 1];
          if (!last || last.type !== "normal") {
            this.renderedBlocks.push({ type: "normal", content: "", html: "" });
            last = this.renderedBlocks[this.renderedBlocks.length - 1];
          }
          last.content += char;
          last.html = md.render(last.content);
        } else {
          // 有打开的块，追加到栈顶指定的块
          const curIdx = this.blockStack[this.blockStack.length - 1];
          const blk = this.renderedBlocks[curIdx];
          blk.content += char;
          blk.html = md.render(blk.content);
        }

        // 处理完非标签字符后清空 buffer（确保接下来能积累标签字符串）
        this.buffer = "";
      }
    },
  },
};
</script>

<style scoped>
.block {
  margin: 8px 0;
}
/* 思考体样式 */
.thought-body {
  white-space: pre-wrap;
  color: #666;
  font-style: italic;
  padding: 6px 8px;
  border-left: 3px solid #e0e0e0;
  background: #fafafa;
  border-radius: 6px;
}
/* 引用样式 */
.citation-body {
  margin-left: 12px;
  color: #007acc;
  padding: 6px 8px;
  background: #f3fbff;
  border-radius: 6px;
}
</style>
