<template>
  <div class="code-block">
   1-{{ content }}
  </div>
</template>

<script>
export default {
  name: 'CodeBlock',
  props: {
    content: {
      type: String,
      default: ''
    }
  }
}
</script>

<style scoped>
.code-block {
  background-color: #f0f0f0;
  padding: 10px;
}
</style>
