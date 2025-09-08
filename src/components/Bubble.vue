<template>
  <div class="bubble" :class="{ 'bubble-start': placement === 'start', 'bubble-end': placement === 'end' }">
    <div class="bubble-avatar" v-if="$slots.avatar">
      <slot name="avatar">
      </slot>
    </div>
    <div class="bubble-content">
      <MarkdownRenderer v-if="isMarkdown" :content="content">
        <template #think="{ rawContent }">
          <Thinking :content="rawContent" />
        </template>
        <template #citation="{ rawContent }">
          <Citation :content="rawContent" />
        </template>
      </MarkdownRenderer>
      <div v-else>{{ content }}</div>
    </div>
  </div>
</template>

<script>
import MarkdownRenderer from './MarkdownRenderer/index.vue'
import Thinking from './Thinking.vue'
import Citation from './Citation.vue'
export default {
  name: 'bubble',
  components: {
    MarkdownRenderer,
    Thinking,
    Citation
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
  },
  methods: {
  }
}
</script>

<style lang="less" scoped>
.bubble {
  display: flex;
  gap: 12px;

  &-start {
    flex-direction: row;
  }

  &-end {
    flex-direction: row-reverse;
    justify-content: end;
    padding-left: 52px;
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