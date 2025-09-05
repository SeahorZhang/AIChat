<template>
  <div class="el-send-button">
    <el-button circle @click="$emit('cancel')">
      <loading class="loading-svg" />
    </el-button>
  </div>
</template>

<script>
import loading from './loading.vue';
export default {
  components: {
    loading
  },
}
</script>


<style scoped lang="less">
.el-send-button {
  display: flex;

  :deep(.el-button) {
    padding: 0;
    width: 32px;
    height: 32px;

    >span {
      align-items: center;
      display: inline-flex
    }

    .loading-svg {
      color: #409eff;
      width: 100%;
    }
  }

}
</style>