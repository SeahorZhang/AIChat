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

export default {
  name: 'MarkdownRenderer',
  props: {
    content: {
      type: String,
      default: ''
    },
  },
  render(h) {
    const processor = unified()
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

    const mdast = processor.parse(this.content);
    const hast = processor.runSync(mdast);
    return render(hast, this.$scopedSlots, {}, h)
  }
}
</script>