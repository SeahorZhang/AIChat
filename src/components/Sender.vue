<template>
  <div class="sender-wrap">
    <div v-if="$slots.header" class="sender-header">
      <div class="sender-header-container">
        <slot name="header" />
      </div>
    </div>
    <div @mousedown="onContentMouseDown" class="sender-content">
      <div>
        <div ref="chatareaRef" class="sender-chat" />
      </div>
      <div class="sender-updown-action-list">
        <div v-if="$slots.prefix" class="sender-prefix">
          <slot name="prefix" />
        </div>
        <div class="sender-action-list">
          <el-button size="small" :disabled="chatState.isEmpty || disabled" icon="el-icon-s-promotion" round
            type="primary">
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ChatArea from 'chatarea'
import 'chatarea/lib/ChatArea.css'

export default {
  props: {
    placeholder: {
      type: String,
      default: '请输入内容'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    submitType: {
      type: String,
      default: 'enter',
      validator: (value) => ['enter', 'shiftEnter'].includes(value)
    }
  },
  data() {
    return {
      chat: null,
      chatState: {
        isEmpty: true,
      }
    }
  },
  mounted() {
    this.initChat()
  },
  watch: {
    disabled: {
      handler(val) {
        val ? this.chat?.disabled() : this.chat?.enable();
      },
      immediate: true
    }
  },
  methods: {

    // 点击内容区域聚焦输入框
    onContentMouseDown() {
      requestAnimationFrame(() => {
        const chatInput = this.chat.chatInput;
        chatInput.restCursorPos(chatInput.vnode, chatInput.cursorIndex);
      });
    },
    initChat() {
      // 实例chat对象
      this.chat = new ChatArea({
        elm: this.$refs.chatareaRef,
        placeholder: this.placeholder,
        sendKeyFun:
          this.submitType === 'enter'
            ? event => !event.shiftKey && event.key === 'Enter'
            : event => event.shiftKey && event.key === 'Enter',
        wrapKeyFun:
          this.submitType === 'shiftEnter'
            ? event => !event.shiftKey && event.key === 'Enter'
            : event => event.shiftKey && event.key === 'Enter'
      })
      // 禁用编辑器
      if (this.disabled) {
        this.chat.disabled();
      }
      // 绑定键盘发送事件
      this.chat.addEventListener('enterSend', this.onSubmit)
      this.chat.addEventListener('operate', () => {
        this.chatState.isEmpty = this.chat.isEmpty(true);
        this.$emit('change');
      });
    },
    // 提交发送方法
    onSubmit() {
      // 内容纯空 拦截发送
      if (this.chatState.isEmpty) {
        return;
      }
      this.$emit('submit', this.getCurrentValue());
    },
    // 取消发送方法
    onCancel() {
      this.$emit('cancel');
    },
    // 获取输入框当前内容
    getCurrentValue() {
      const text = this.chat.getText();
      const html = this.chat.getHtml();
      const inputTags = this.chat.getInputTagList();
      return {
        text,
        html,
        inputTags,
      };
    }
  },
  beforeDestroy() {
    // 释放实例
    if (this.chat) {
      this.chat.dispose()
      this.chat = null
    }
  }
}
</script>

<style lang="less" scoped>
.sender-wrap {
  border-radius: 8px;
  border-color: #dcdfe6;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, .03), 0 1px 6px -1px rgba(0, 0, 0, .02), 0 2px 4px 0 rgba(0, 0, 0, .02);
  border-width: 0;
  border-style: solid;
  display: flex;
  flex-direction: column;
  padding: 12px 16px;
  position: relative;

  &:focus-within {
    box-shadow: 0px 12px 32px 4px rgba(0, 0, 0, .04), 0px 8px 20px rgba(0, 0, 0, .08);
    border-color: #409eff;
  }

  &::after {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    pointer-events: none;
    transition: border-color .3s;
    border-radius: inherit;
    border-style: inherit;
    border-color: inherit;
    border-width: 1px;
  }

  .sender-content {
    display: flex;
    flex-direction: column;
    gap: 8px;

    .sender-chat {
      flex-shrink: 0;
      width: 100%;
      font-size: 14px;
      min-height: 26px;
      line-height: 24px;
      box-sizing: border-box;
      overflow-y: auto;
      overflow-x: hidden;

      /deep/.chat-placeholder-wrap {
        font-family: inherit;
        font-style: normal;
        color: #a8abb2;
        padding: 0;
        font-weight: 700;
        font-size: inherit;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }

      /deep/.chat-rich-text {
        font-family: inherit;
        padding: 0;
        font-size: inherit;

        .chat-grid-wrap {
          font-size: inherit;

          >span {
            font-size: inherit;
          }
        }
      }
    }
  }

  .sender-updown-action-list {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>