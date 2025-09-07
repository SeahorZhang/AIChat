<template>
  <div class="sc-bubble" :class="{ 'sc-bubble-start': placement === 'start', 'sc-bubble-end': placement === 'end' }">
    <div class="sc-bubble-avatar">
      <slot name="avatar">
        <el-avatar :size="40" icon="el-icon-user-solid"></el-avatar>
      </slot>
    </div>
    <div class="sc-bubble-content">
      <MarkdownRenderer v-if="isMarkdown" :content="content">

        <template #think="a">
          {{ a }}
          <Thinking :content="2" />
        </template>
      </MarkdownRenderer>

      <div v-else>{{ content }}</div>
    </div>
  </div>
</template>

<script>
import MarkdownRenderer from './MarkdownRenderer/index.vue'
import Thinking from './Thinking.vue'
export default {
  name: 'sc-bubble',
  components: {
    MarkdownRenderer,
    Thinking
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