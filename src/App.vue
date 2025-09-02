<template>
  <div id="app">
    <div class="chat-container">
      <div class="chat-list">
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
      </div>
      <div class="chat-button">
        <el-button @click="showThinkingProcess">展示思考过程</el-button>
        <el-button>写一段代码</el-button>
      </div>
      <div class="chat-input">
        <el-input type="text" placeholder="Type your message here..." />
        <el-button>Send</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import ScBubble from './components/ScBubble.vue';
import { nanoid } from 'nanoid/non-secure'
export default {
  name: 'App',
  components: {
    ScBubble
  },
  data() {
    return {
      // 第一项必为我的发问
      chartList: [],
    }
  },
  computed: {
    lastChat() {
      return this.chartList.at(-1) || []
    },

  },
  methods: {
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

<div style="color:red">Mmm</div>

\`\`\`trank
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
  display: flex;
  flex-direction: column;
  padding: 20px;
  box-sizing: border-box;
  background-color: #f5f5f5;

  .chat-button {
    display: flex;
    align-items: center;
    margin-top: 10px;
  }

  .chat-list {
    flex: 1;
    overflow-y: auto;
    border-radius: 5px;
    background-color: #fff;
    padding: 20px 10px;

    >* {
      margin-bottom: 15px;
    }
  }

  .chat-input {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #f5f5f5;
    border-radius: 5px;
    margin-top: 10px;

    .el-input {
      flex: 1;
      margin-right: 10px;
    }
  }
}
</style>
