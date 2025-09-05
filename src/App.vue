<template>
  <div>
    <button @click="startStream">开始模拟逐字流式输出</button>

    <div v-for="(block, idx) in renderedBlocks" :key="idx" class="block">
      <BlockRenderer :block="block" />
    </div>
  </div>
</template>

<script>
import { mockBackendStream } from "@/utils/mockBackendStream";
import BlockRenderer from "@/components/BlockRenderer.vue";

export default {
  components: { BlockRenderer },
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
      // ...existing code...
      // 这里保留原有的 handleChar 逻辑
      this.tagBuffer += char;
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
