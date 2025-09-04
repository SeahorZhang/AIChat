<template>
  <div ref="container">
    <div v-html="html"></div>
    <div v-if="thinks" class="think-block" v-html="thinks"></div>
  </div>
</template>

<script>
import { createMarkdownIt } from './markdown-it-trank';

export default {
  name: 'MarkdownRenderer',
  props: ['content'],
  data() {
    return {
      md: null,
      state: null,
      html: '',
      thinks: '',
      // internal pointers to track how much of prop we've processed
      processedStringLen: 0,
      processedArrayIndex: 0,
      debug: false, // 打开可以查看控制台日志
    };
  },
  created() {
    this.md = createMarkdownIt();
    this.state = this.createSplitterState();
    this.processedStringLen = 0;
    this.processedArrayIndex = 0;
  },
  watch: {
    // 支持 content 是 string（累积字符串）或 array（chunks 数组）
    content: {
      handler(newVal,) {
        if (!newVal) return;

        // 如果是数组流（常见：push chunk 到数组）
        if (Array.isArray(newVal)) {
          const start = this.processedArrayIndex || 0;
          if (newVal.length > start) {
            const toProcess = newVal.slice(start);
            if (this.debug) console.log('processing array chunks', start, toProcess.length);
            for (const chunk of toProcess) {
              // 确保传字符串（单 chunk）
              this.state = this.processChunk(this.state, String(chunk));
            }
            this.processedArrayIndex = newVal.length;
          }
        } else {
          // 当作字符串流处理（常见：每次上游把累积的字符串传入）
          const s = String(newVal);
          const prevLen = this.processedStringLen || 0;
          if (s.length > prevLen) {
            const newChunk = s.slice(prevLen);
            if (this._debug) console.log('processing string chunk len', newChunk.length);
            this.state = this.processChunk(this.state, newChunk);
            this.processedStringLen = s.length;
          }
        }

        // 更新渲染（render 全部已经解析的 markdown）
        // 注意：这里用完整的 markdown 渲染一次（不会重复插入节点）
        this.html = this.md.render(this.state.markdown);
        // thinks 保持原文，render 或不 render 由你决定
        this.thinks = this.state.think;
      },
      immediate: true,
      deep: false
    }
  },
  methods: {
    // 初始 state
    createSplitterState() {
      return {
        isInThink: false,
        buffer: "",
        markdown: "",
        think: ""
      };
    },

    // 处理单个 chunk（纯函数式：不修改入参，返回新 state）
    processChunk(prevState, chunk) {
      // 确保 chunk 是字符串
      const str = String(chunk);
      const tagOpen = "<think>";
      const tagClose = "</think>";
      const maxTagLen = Math.max(tagOpen.length, tagClose.length);
      const candidates = [tagOpen, tagClose];

      let buffer = prevState.buffer + str;
      let isInThink = prevState.isInThink;
      let markdown = prevState.markdown;
      let think = prevState.think;

      let i = 0;
      let lastEmit = 0;

      // 扫描完整的标签并在遇到时结算前面的文本
      while (i < buffer.length) {
        if (buffer.startsWith(tagOpen, i)) {
          const text = buffer.slice(lastEmit, i);
          if (isInThink) think += text; else markdown += text;
          isInThink = true;
          i += tagOpen.length;
          lastEmit = i;
          continue;
        }
        if (buffer.startsWith(tagClose, i)) {
          const text = buffer.slice(lastEmit, i);
          if (isInThink) think += text; else markdown += text;
          isInThink = false;
          i += tagClose.length;
          lastEmit = i;
          continue;
        }
        i++;
      }

      // 剩余尾巴（可能包含标签前缀）
      const tail = buffer.slice(lastEmit);

      // 计算需要保留在 buffer 中的最短后缀（可能成为任何标签前缀）
      function calcHoldLen(s) {
        const limit = Math.min(s.length, maxTagLen - 1); // 不保留完整标签
        for (let k = limit; k > 0; k--) {
          const suff = s.slice(-k);
          if (candidates.some(t => t.startsWith(suff))) return k;
        }
        return 0;
      }

      const holdLen = calcHoldLen(tail);
      const safePart = tail.slice(0, tail.length - holdLen);
      const holdPart = tail.slice(-holdLen);

      if (isInThink) think += safePart; else markdown += safePart;

      return {
        isInThink,
        buffer: holdPart,
        markdown,
        think
      };
    },

    // 当流结束时手动调用：把残留 buffer 决算掉（因为不会再来新的 chunk）
    flush() {
      if (!this.state) return;
      if (this.state.buffer) {
        if (this.state.isInThink) this.state.think += this.state.buffer;
        else this.state.markdown += this.state.buffer;
        this.state.buffer = "";
        // 更新渲染
        this.html = this.md.render(this.state.markdown);
        this.thinks = this.state.think;
      }
    }
  }
};
</script>