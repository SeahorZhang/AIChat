<template>
  <div class="markdown-card">
    <MarkdownContent :content="content" />
  </div>
</template>

<script>
import MarkdownContent from './MarkdownContent.vue';
export default {
  name: 'markdown-card',
  components: {
    MarkdownContent
  },
  props: {
    content: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="less" scoped>
</style>