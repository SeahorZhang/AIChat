<!-- TrankComponent.vue -->
<template>
  <div class="trank-wrapper" v-html="compiledSlot"></div>
</template>

<script>
import { createMarkdownIt } from './markdown-it-trank';

export default {
  name: 'TrankComponent',
  props: ['slotName'],
  computed: {
    compiledSlot() {
      const md = createMarkdownIt();
      // this.$slots.default 返回 VNode，需要提取文本内容
      let raw = '';
      if (this.$slots.default) {
        raw = this.$slots.default
          .map((vnode) => {
            // VNode 文本节点直接取 text
            return vnode.text || '';
          })
          .join('');
      }
      return md.render(raw);
    },
  },
};
</script>

<style>
.trank-wrapper {
  border: 1px solid #409eff;
  padding: 10px;
  border-radius: 4px;
  background: #f0f9ff;
}
</style>