<template>
  <div class="sc-bubble" :class="{
    'sc-bubble-start': placement === 'start',
    'sc-bubble-end': placement === 'end',
  }">
    <div class="sc-bubble-avatar">
      <slot name="avatar">
        <el-avatar :size="40" icon="el-icon-user-solid"></el-avatar>
      </slot>
    </div>
    <div class="sc-bubble-content">
      <MarkdownRenderer v-if="isMarkdown" :content="content">
        <template #thinkCode="{ content }">
          <ThinkCode :content="content" />
        </template>
        <template #citationCode="{ content }">
          <CitationCode :content="content" />
        </template>
      </MarkdownRenderer>
      <div v-else>{{ content }}</div>
    </div>
  </div>
</template>

<script>
import MarkdownRenderer from "./MarkdownRenderer/index.vue";
import ThinkCode from './ThinkCode.vue'
import CitationCode from './CitationCode.vue'

export default {
  name: "sc-bubble",
  components: {
    MarkdownRenderer,
    // 代码块类型组件
    ThinkCode,
    CitationCode
  },
  props: {
    content: {
      type: String,
      default: "",
    },
    placement: {
      type: String,
      default: "start",
    },
    isMarkdown: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style lang="less" scoped>
.sc-bubble {
  display: flex;
  gap: 12px;

  &-start {
    flex-direction: row;
  }

  &-end {
    flex-direction: row-reverse;
    justify-content: end;
  }

  &-content {
    padding: 12px 18px;
    border-radius: 8px;
    color: #303133;
    font-size: 14px;
    line-height: 24px;
    word-break: break-word;
    background-color: #edf2fc;
  }
}
</style>
