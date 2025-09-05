<template>
  <div>
    <details v-if="block.type === 'tarnk'" open>
      <summary>深度思考（点击展开/折叠）</summary>
      <div class="thought-body">
        <div v-html="block.content"></div>
        <details open v-if="block.references.length">
          <summary>引用来源</summary>
          <div class="citation-list">
            <a v-for="(link, i) in block.references" :key="i" :href="link.href" target="_blank">{{ link.display }}</a>
          </div>
        </details>
      </div>
    </details>
    <div v-else>{{ block.content }}</div>
  </div>
</template>

<script>
export default {
  name: "BlockRenderer",
  props: {
    block: { type: Object, required: true }
  }
};
</script>

<style scoped>
.block { margin: 8px 0; }
.thought-body { white-space: pre-wrap; color: #666; font-style: italic; }
.citation-list { margin-left: 12px; margin-top: 4px; }
.citation-list a { display: block; color: #007acc; text-decoration: underline; margin: 2px 0; }
</style>
