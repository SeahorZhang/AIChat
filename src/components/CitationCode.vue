<template>
  <div class="citation-code">
    {{ content }}
  </div>
</template>
<script>
export default {
  name: "CitationCode",
  props: {
    content: {
      type: String,
      default: "",
    },
  },
};
</script>


<style lang="less" scoped>
.citation-code {
  color: red;
}
</style>