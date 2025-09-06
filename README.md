# AI Chat

一个基于 Vue 2 的 AI 流式对话应用，支持实时 Markdown 渲染和自定义标签解析。

## ✨ 特性

- 🚀 **流式输出**: 支持字符级别的流式 Markdown 内容渲染
- 📝 **Markdown 支持**: 完整的 Markdown 语法支持，包括代码块、引用等
- 🎨 **自定义标签**: 支持 `<taink>` 和 `<citation>` 等自定义标签的解析和渲染
- 💬 **聊天界面**: 基于 Element UI 的现代化聊天界面
- 🔧 **可扩展**: 模块化设计，易于扩展新的功能

## 🛠️ 技术栈

- **前端框架**: Vue 2.6.14
- **UI 组件库**: Element UI 2.15.14
- **Markdown 解析**: markdown-it 14.1.0
- **样式预处理**: Less 4.4.1
- **构建工具**: Vue CLI 5.0.0
- **包管理器**: pnpm

## 📦 安装

```bash
# 克隆项目
git clone <repository-url>
cd ai-chat

# 安装依赖
pnpm install
```

## 🚀 开发

```bash
# 启动开发服务器
pnpm run dev
```

访问 `http://localhost:8080` 查看应用。

## 🏗️ 构建

```bash
# 构建生产版本
pnpm run build
```

## 📁 项目结构

```
src/
├── App.vue                 # 主应用组件，包含流式 Markdown 渲染逻辑
├── main.js                 # 应用入口文件
├── components/
│   ├── markdownCard/       # Markdown 卡片组件
│   │   ├── index.vue       # 主卡片组件
│   │   ├── MarkdownContent.vue  # Markdown 内容渲染器
│   │   ├── CodeBlock.vue   # 代码块组件
│   │   ├── cardParser.js    # Markdown 解析器
│   │   └── newMarkdown.js   # Markdown-it 配置
│   ├── ScBubble.vue        # 聊天气泡组件
│   └── HelloWorld.vue      # 示例组件
└── styles/
    └── index.less          # 全局样式
```

## 🎯 核心功能

### 流式 Markdown 渲染

应用支持实时流式输出 Markdown 内容，通过字符级别的解析实现平滑的渲染效果。

### 自定义标签支持

- **`<taink>`**: 思考块标签，用于显示 AI 的思考过程
- **`<citation>`**: 引用块标签，用于显示引用来源

### 聊天界面

基于 `ScBubble` 组件实现的现代化聊天界面，支持：
- 用户和 AI 消息的区分显示
- Markdown 内容的自动渲染
- 响应式布局

## 🔧 配置

### Vue 配置

项目使用 Vue CLI 5.0.0 构建，配置文件位于 `vue.config.js`。

### ESLint 配置

项目配置了 ESLint 进行代码规范检查，支持 Vue 和 JavaScript 语法检查。

## 📝 使用示例

### 基本用法

```vue
<template>
  <div>
    <button @click="startStream">开始流式输出</button>
    <div v-for="(block, idx) in renderedBlocks" :key="idx">
      <!-- 渲染不同类型的块 -->
    </div>
  </div>
</template>
```

### Markdown 卡片组件

```vue
<template>
  <MarkdownCard :content="markdownContent" />
</template>
```

### 聊天气泡组件

```vue
<template>
  <ScBubble 
    :content="message" 
    :placement="isUser ? 'end' : 'start'"
    :is-markdown="true"
  />
</template>
```

## 🤝 贡献

欢迎提交 Issue 和 Pull Request 来改进这个项目。

## 📄 许可证

本项目采用 MIT 许可证。
