<script>
import newMarkdown from './newMarkdown';

export default {
  name: 'markdown-content',
  props: {
    content: {
      type: String,
      default: ''
    }
  },
  render(h) {
    const md = newMarkdown();
    const tokens = md.parse(this.content, {});
    const vnodes = md.renderer.renderVNode(tokens, {}, {}, h);
    return h('div', {}, vnodes);
  }
}
</script>
