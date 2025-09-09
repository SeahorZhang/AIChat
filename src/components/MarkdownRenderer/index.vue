<script>
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize'
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import rehypeRaw from 'rehype-raw';
import { render } from './hast-to-vnode';
import rehypeFormat from 'rehype-format';

// 创建全局processor实例，避免重复创建
const createProcessor = () => {
  return unified()
    .use(remarkParse)// 解析Markdown为AST
    .use(remarkBreaks)// 处理换行符
    .use(remarkGfm, { singleTilde: false })// GitHub Flavored Markdown支持
    .use(remarkRehype, { allowDangerousHtml: true })// 转换为HTML AST
    .use(rehypeRaw)// 处理原始HTML
    .use(rehypeFormat)// 格式化HTML
    .use(rehypeSanitize, { // 过滤HTML标签
      ...defaultSchema,
      tagNames: ['think', 'citation', ...defaultSchema.tagNames],
    });
};

// 缓存processor实例
let processor = null;

export default {
  name: 'MarkdownRenderer',
  props: {
    content: {
      type: String,
      default: ''
    },
  },
  render(h) {
    try {
      // 使用缓存的processor实例
      if (!processor) {
        processor = createProcessor();
      }

      const mdast = processor.parse(this.content);
      const hast = processor.runSync(mdast);
      return render(hast, this.$scopedSlots, {}, h);
    } catch (error) {
      console.error('Markdown渲染失败:', error);
      // 降级处理：直接显示原始内容
      return h('div', { class: 'markdown-error' }, [
        h('p', '内容渲染失败'),
        h('pre', this.content)
      ]);
    }
  }
}
</script>

<style scoped>
.markdown-error {
  padding: 12px;
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 6px;
  color: #dc2626;
}

.markdown-error p {
  margin: 0 0 8px 0;
  font-weight: 500;
}

.markdown-error pre {
  margin: 0;
  font-size: 12px;
  background-color: #f9fafb;
  padding: 8px;
  border-radius: 4px;
  overflow-x: auto;
}
</style>