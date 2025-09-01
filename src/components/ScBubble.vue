<template>
  <div class="sc-bubble" :class="{ 'sc-bubble-start': placement === 'start', 'sc-bubble-end': placement === 'end' }">
    <div class="sc-bubble-avatar">
      <slot name="avatar">
        <el-avatar :size="40" icon="el-icon-user-solid"></el-avatar>
      </slot>
    </div>
    <div class="sc-bubble-content">
      <MarkdownCard v-if="isMarkdown" :content="content" />
      <div v-else>{{ content }}</div>
    </div>
  </div>
</template>

<script>
import MarkdownCard from './markdownCard/index.vue'
export default {
  name: 'sc-bubble',
  components: {
    MarkdownCard
  },
  props: {
    content: {
      type: String,
      default: ''
    },
    placement: {
      type: String,
      default: 'start'
    },
    isMarkdown: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="less" scoped>
.sc-bubble {
  display: flex;
  gap: 4px;

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