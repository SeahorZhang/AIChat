<template>
  <div class="citation-code">
    <div class="citation-code-title">引用信息</div>
    <MarkdownRenderer :content="content" class="citation-code-content" />
  </div>
</template>
<script>
import MarkdownRenderer from "./MarkdownRenderer/index.vue";
export default {
  name: "CitationCode",
  components: {
    MarkdownRenderer,
  },
  props: {
    content: {
      type: String,
      default: "",
    },
  },
};
</script>


<style lang="less" scoped>
.citation-code {
  color: red;
  .citation-code-title {
    font-size: 14px;
    color: #333;
  }
  .citation-code-content {
    font-size: 14px;
    color: #333;
  }
}
</style>