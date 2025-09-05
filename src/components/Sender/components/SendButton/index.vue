<template>
  <el-button size="small" :icon="'el-icon-s-promotion'" round type="primary" :disabled="disabled"
    @click="$emit('submit')">
  </el-button>
</template>

<script>
export default {
  props: {
    disabled: {
      type: Boolean,
      default: false
    }
  },
}
</script>
