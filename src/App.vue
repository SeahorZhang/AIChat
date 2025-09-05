<template>
  <div>
    <button @click="startStream">开始模拟逐字流式输出</button>

    <div v-for="(block, idx) in renderedBlocks" :key="idx" class="block">
      <!-- 思考块 -->
      <details v-if="block.type === 'tarnk'" open>
        <summary>深度思考（点击展开/折叠）</summary>
        <div class="thought-body">
          <div v-html="block.content"></div>

          <!-- 引用列表，默认展开 -->
          <details open v-if="block.references.length">
            <summary>引用来源</summary>
            <div class="citation-list">
              <a v-for="(link, i) in block.references" :key="i" :href="link.href" target="_blank">{{ link.display }}</a>
            </div>
          </details>
        </div>
      </details>

      <!-- 普通文本 -->
      <div v-else>{{ block.content }}</div>
    </div>
  </div>
</template>

<script>
function mockBackendStream(callback) {
  const fullText =
    "普通文本开头。\n" +
    "<tarnk>分析开始...\n" +
    "分析内容逐步生成...\n" +
    "<citation><a href='https://vuejs.org'>Vue官方文档</a> " +
    "<a href='https://developer.mozilla.org/'>MDN JS Guide</a></citation>\n分析完成。</tarnk>\n" +
    "普通文本继续。\n" +
    "<tarnk>第二段思考开始...\n" +
    "<citation><a href='https://github.com/vuejs/vue'>Vue源码</a> " +
    "<a href='https://www.javascript.com/'>JavaScript官网</a></citation>\n分析完成。</tarnk>\n" +
    "全文输出完成。";

  let i = 0;
  function push() {
    if (i < fullText.length) {
      callback(fullText[i]);
      i++;
      setTimeout(push, 40);
    }
  }
  push();
}

export default {
  data() {
    return {
      renderedBlocks: [],
      mode: "normal",       // normal | tarnk | citation | a
      tagBuffer: "",
      currentLink: null,    // { href, display }
    };
  },
  methods: {
    startStream() {
      this.renderedBlocks = [];
      this.mode = "normal";
      this.tagBuffer = "";
      this.currentLink = null;

      mockBackendStream(this.handleChar);
    },

    handleChar(char) {
      this.tagBuffer += char;

      // 标签模式切换
      if (this.tagBuffer.endsWith("<tarnk>")) {
        this.mode = "tarnk";
        this.tagBuffer = "";
        this.renderedBlocks.push({ type: "tarnk", content: "", references: [] });
        return;
      }
      if (this.tagBuffer.endsWith("</tarnk>")) {
        this.mode = "normal";
        this.tagBuffer = "";
        return;
      }
      if (this.tagBuffer.endsWith("<citation>") && this.mode === "tarnk") {
        this.mode = "citation";
        this.tagBuffer = "";
        return;
      }
      if (this.tagBuffer.endsWith("</citation>") && this.mode === "citation") {
        this.mode = "tarnk";
        this.tagBuffer = "";
        return;
      }
      if (this.tagBuffer.endsWith("<a") && this.mode === "citation") {
        this.mode = "a";
        this.tagBuffer = "";
        const last = this.renderedBlocks[this.renderedBlocks.length - 1];
        this.currentLink = { href: "", display: "" };
        if (last) last.references.push(this.currentLink);
        return;
      }
      if (this.tagBuffer.endsWith("</a>") && this.mode === "a") {
        this.mode = "citation";
        this.currentLink = null;
        this.tagBuffer = "";
        return;
      }

      // 非标签字符
      if (!this.tagBuffer.startsWith("<")) {
        const last = this.renderedBlocks[this.renderedBlocks.length - 1];
        if (!last) return;

        if (this.mode === "normal") {
          if (!last || last.type !== "normal") this.renderedBlocks.push({ type: "normal", content: "" });
          this.renderedBlocks[this.renderedBlocks.length - 1].content += char;
        } else if (this.mode === "tarnk") {
          last.content += char;
        } else if (this.mode === "a") {
          if (this.currentLink) this.currentLink.display += char;
          const hrefMatch = char.match(/href=['"]([^'"]+)['"]/);
          if (hrefMatch && this.currentLink) this.currentLink.href = hrefMatch[1];
        }

        this.tagBuffer = "";
      }
    }
  }
};
</script>

<style scoped>
.block { margin: 8px 0; }
.thought-body { white-space: pre-wrap; color: #666; font-style: italic; }
.citation-list { margin-left: 12px; margin-top: 4px; }
.citation-list a { display: block; color: #007acc; text-decoration: underline; margin: 2px 0; }
</style>
