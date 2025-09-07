<script>
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize'
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import rehypeRaw from 'rehype-raw';
import rehypeParse from 'rehype-parse';
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
    // 检查是否包含自定义标签
    const hasCustomTags = /<(think|citation)>/i.test(this.content);

    let hast;
    if (hasCustomTags) {
      // 如果包含自定义标签，直接解析为 HTML，不进行 sanitize
      const processor = unified()
        .use(rehypeParse, {
          fragment: true,
          emitParseErrors: false,
          duplicateAttribute: false
        });

      hast = processor.runSync(processor.parse(this.content));
    } else {
      // 否则使用 markdown 解析
      const processor = unified()
        .use(remarkParse)
        .use(remarkBreaks)
        .use(remarkGfm, { singleTilde: false })
        .use(remarkRehype, { allowDangerousHtml: true })
        .use(rehypeRaw)
        .use(rehypeSanitize, {
          ...defaultSchema,
          tagNames: ['think', 'citation', ...defaultSchema.tagNames],
        });

      const mdast = processor.parse(this.content);
      hast = processor.runSync(mdast);
    }

    return render(hast, this.$scopedSlots, {}, h)
  }
}
</script>