<template>
  <Expand class="thinking">
    <template #title>
      <div v-if="loading">
        <i class="el-icon-loading"></i>
        思考中...
      </div>
      <div v-else>
        <i class="el-icon-success"></i>
        思考完成
      </div>
    </template>

    <template v-for="(item, index) in content">
      <div :key="index">{{ item }}</div>
      <!-- <MarkdownRenderer :content="item" :key="index" /> -->
    </template>
  </Expand>
</template>

<script>
// import MarkdownRenderer from './MarkdownRenderer/index.vue'
import Expand from './Expand.vue'
export default {
  name: "Thinking",
  components: {
    // MarkdownRenderer,
    Expand
  },
  props: {
    content: {
      type: Array,
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

<style lang="less" scoped>
.thinking {

  /deep/.title {
    justify-content: space-between;

    .el-icon-success {
      color: #52c41a;
    }
  }

}
</style>