<template>
  <div class="sc-bubble" :class="{ 'sc-bubble-start': placement === 'start', 'sc-bubble-end': placement === 'end' }">
    <div class="sc-bubble-avatar">
      <slot name="avatar">
        <el-avatar :size="40" icon="el-icon-user-solid"></el-avatar>
      </slot>
    </div>
    <div class="sc-bubble-content">
      <MarkdownRenderer v-if="isMarkdown" :content="content">
        <template #code="slotProps">
          <div v-if="slotProps.language === 'think'">
            <el-alert title="思考中..." type="info" :closable="false">
              <MarkdownRenderer v-if="isMarkdown" :content="slotProps.content">
                <template #code="slotProps">
                  <div v-if="slotProps.language === 'citation'">
                    <div style="color: red;">
                      <MarkdownRenderer :content="slotProps.content" />
                    </div>
                  </div>
                </template>
              </MarkdownRenderer>
            </el-alert>
          </div>
        </template>
      </MarkdownRenderer>
      <div v-else>{{ content }}</div>
    </div>
  </div>
</template>

<script>
import MarkdownRenderer from './MarkdownRenderer/index.vue'


export default {
  name: 'sc-bubble',
  components: {
    MarkdownRenderer
  },
  props: {
    content: {
      type: String,
      default: ''
    },
    placement: {
      type: String,
      default: 'start'
    },
    isMarkdown: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    selfCodeXRender() {
      // 渲染自定义代码块标识符 javascript, 返回一个组件
      const h = this.$createElement;
      return {
        javascript: (props) => {
          return h(
            'pre',
            { class: 'language-javascript' },
            h('code', { class: 'language-javascript' }, props.raw.content)
          );
        }
      }
    }

  }
}
</script>

<style lang="less" scoped>
.sc-bubble {
  display: flex;
  gap: 12px;

  &-start {
    flex-direction: row;
  }

  &-end {
    flex-direction: row-reverse;
    justify-content: end;
  }

  &-content {
    padding: 12px 18px;
    border-radius: 8px;
    color: #303133;
    font-size: 14px;
    line-height: 24px;
    word-break: break-word;
    background-color: #edf2fc;
  }
}
</style>