<template>
  <div id="app">
    <div class="chat-container">
      <div class="chat-list" ref="chatListRef">
        <template v-for="item in chartList">
          <template v-for="chat in item">
            <ScBubble v-if="chat.type === 'mine'" :key="chat.id" :content="chat.content" placement="end">
              <template #avatar>
                <el-avatar>我</el-avatar>
              </template>
            </ScBubble>
            <ScBubble v-else :key="chat.id" is-markdown :content="chat.content" avatar="el-icon-user-solid" />
          </template>
        </template>

        <Thinking  :content="thinkingContent" />
      </div>
      <div class="chat-button">
        <el-button round size="small" @click="showThinkingProcess">展示思考过程</el-button>
        <el-button round size="small">写一段代码</el-button>
      </div>
      <Sender class="chat-content" @submit="onSubmit" @cancel="onCancel" :loading="loading">
        <template #prefix>
          <el-button icon="el-icon-s-help" round size="small" :type="isDeep ? 'primary' : 'default'"
            @click="isDeep = !isDeep">深度思考</el-button>
        </template>
      </Sender>
    </div>
  </div>
</template>

<script>
import ScBubble from './components/ScBubble.vue';
import { nanoid } from 'nanoid/non-secure'
import Sender from './components/Sender/index.vue';
import Thinking from './components/Thinking.vue';
export default {
  name: 'App',
  components: {
    ScBubble,
    Sender,
    Thinking
  },
  data() {
    return {
      // 第一项必为我的发问
      chartList: [],
      isDeep: false,
      loading: false,
      showThinking: false,
      thinkingContent: '我现在需要回答用户的问题：“json 来历”。首先，我应该明确用户想知道 JSON 的起源、发展历史以及相关的关键人物和事件。',
    }
  },
  computed: {
    lastChat() {
      return this.chartList.at(-1) || []
    },

  },
  methods: {
    scrollToBottom() {
      this.$nextTick(() => {
        const chatList = this.$refs.chatListRef
        chatList.scrollTop = chatList.scrollHeight
      })
    },
    onSubmit(val) {
      console.log(1, val)
      this.showThinkingProcess()
      this.scrollToBottom()
    },
    onCancel(val) {
      console.log(2, val)
      this.loading = false
    },
    showThinkingProcess() {
      this.chartList.push([{
        id: nanoid(),
        type: 'mine',
        content: '对话中展示你的思考过程',
      }])

      this.chartList.at(-1).push({
        id: nanoid(),
        type: 'other',
        content: `# Markdown示例
这是一个支持**Markdown**渲染的气泡组件。

## 功能特点
- 支持标题
- 支持**粗体**和*斜体*
- 支持代码块

\`\`\`javascript
// 示例代码
function greet(name) {
    return 'Hello, ' + name + '!';
}
console.log(greet('World'));
\`\`\``,
      })
    }
  }
}
</script>

<style lang="less" scoped>
.chat-container {
  width: 100%;
  height: 100%;
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  background-color: #fff;
  padding: 20px 0;

  .chat-button {
    display: flex;
    align-items: center;
    margin: 10px 15px 0;
  }

  .chat-list {
    flex: 1;
    overflow-y: auto;
    border-radius: 5px;
    padding: 20px 10px;

    >* {
      margin-bottom: 15px;
    }
  }

  .chat-content {
    //   background-color: #fff;
    margin: 10px 15px 0;
    //   border-radius: 8px;
    //   padding: 5px 12px;

    //   .chat-button{
    //     margin-bottom: 12px;
    //   }
  }

  // .chat-input {
  //   display: flex;
  //   justify-content: space-between;
  //   align-items: center;
  //   background-color: #f5f5f5;
  //   border-radius: 5px;
  //   margin-top: 10px;

  //   .el-input {
  //     flex: 1;
  //     margin-right: 10px;
  //   }
  // }
}
</style>
