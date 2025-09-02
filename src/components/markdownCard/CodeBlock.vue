<template>
  <div class="code-block">
   1-{{ token.content }}
  </div>
</template>

<script>
export default {
  name: 'CodeBlock',
  props: {
    token: {
      type: Object,
      default: () => ({})
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
