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

// 模拟后端流式返回 markdown 内容
async function* mockMarkdownStream(markdown, chunkSize = 8, interval = 1000) {
  let i = 0;
  while (i < markdown.length) {
    await new Promise(resolve => setTimeout(resolve, interval));
    yield markdown.slice(0, i + chunkSize);
    i += chunkSize;
  }
}
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
    async showThinkingProcess() {
      this.chartList.push([{
        id: nanoid(),
        type: 'mine',
        content: '对话中展示你的思考过程',
      }]);

      // const markdown = `# Markdown示例\n这是一个支持**Markdown**渲染的气泡组件。\n\n## 功能特点\n- 支持标题\n- 支持**粗体**和*斜体*\n- 支持代码块\n\n<div style="color:red">Mmm</div>\n\n<think>\n// 示例代码\nfunction greet(name) {\n    return 'Hello, ' + name + '!';\n}\n</think>`;
      const markdown = `# 一级标题
<think>深度思考中。。。</think>

## 二级标题

### 三级标题

这是一个段落，包含 **粗体**、*斜体*。

这是另一段落。

> 这是一个引用块。

- 无序列表项 1
- 无序列表项 2
  - 嵌套列表项 2.1
  - 嵌套列表项 2.2

1. 有序列表项 1
2. 有序列表项 2
   1. 嵌套有序 2.1
   2. 嵌套有序 2.2

[这是一个链接](https://www.example.com)



~~删除线~~ 示例`
      const bubble = {
        id: nanoid(),
        type: 'other',
        content: '',
      };
      this.chartList.at(-1).push(bubble);

      for await (const chunk of mockMarkdownStream(markdown, 1, 300)) {
        bubble.content = chunk;
        this.$forceUpdate();
      }
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
