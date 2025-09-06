<template>
  <div class="think-code">
    <el-alert title="思考中..." type="info" :closable="false">{{ content }}</el-alert>
  </div>
</template>

<script>
export default {
  name: "ThinkCode",
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
}
</style>