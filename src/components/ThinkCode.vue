<template>
  <div class="think-code">
    <div class="think-code-title">思考中...</div>
    <MarkdownRenderer :content="content" class="think-code-content" />
  </div>
</template>

<script>
import MarkdownRenderer from "./MarkdownRenderer/index.vue";
export default {
  name: "ThinkCode",
  components: {
    MarkdownRenderer,
  },
  props: {
    content: {
      type: String,
      default: "",
    },
  }
}
</script>

<style lang="less" scoped>
.think-code {
  background-color: aquamarine;
  .think-code-title {
    font-size: 14px;
    color: #333;
  }
  .think-code-content {
    font-size: 14px;
    color: #333;
  }
}
</style>