<template>
  <Expand>
    <template #title>
      <i v-if="loading" class="el-icon-loading"></i>
      引用来源
    </template>
    <div v-for="(item, index) in (typeof content === 'string' ? [content] : content)" :key="index">
      <div style="color:red">
        <MarkdownRenderer :content="item" />
      </div>
    </div>
  </Expand>
</template>

<script>
import MarkdownRenderer from './MarkdownRenderer/index.vue'
import Expand from './Expand.vue'
export default {
  name: "Citation",
  components: {
    MarkdownRenderer,
    Expand
  },
  props: {
    content: {
      type: [String, Array],
      default: () => [],
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
    }
  },
  methods: {

  }
};
</script>