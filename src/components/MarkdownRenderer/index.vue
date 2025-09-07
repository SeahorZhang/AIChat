<script>
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize'
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
    const hast = processor.runSync(mdast);

    return render(hast, this.$scopedSlots, {}, h)
  }
}
</script>