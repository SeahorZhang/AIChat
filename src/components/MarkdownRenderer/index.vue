<script>
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeSanitize from 'rehype-sanitize'
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import rehypeRaw from 'rehype-raw';
import { render } from './hast-to-vnode';

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
      .use([
        remarkParse,// 解析Markdown语法
        remarkBreaks,// 支持换行
        [
          remarkGfm,// 支持GitHub风格的Markdown
          { singleTilde: false }// 关闭单个波浪线表示删除线
        ],
      ])
      .use(
        remarkRehype,// 转换为HAST
        { allowDangerousHtml: true }// 允许原始HTML
      )
      .use(rehypeRaw)// 允许HAST中包含原始HTML
      .use(rehypeSanitize)// 清理HAST，防止XSS攻击

    const mdast = processor.parse(this.content); // 解析为MDAST
    const hast = processor.runSync(mdast);// 转换为HAST

    return render(hast, {}, this.$scopedSlots, {}, h)
  }
}
</script>