import markdownit from "markdown-it";
import markdownItVue2VNode from "./markdown-it-vue2-vnode";
import CodeBlock from "./CodeBlock.vue";
export default () => {
  const md = new markdownit();
  md.use(markdownItVue2VNode, {
    components: {
      trank: CodeBlock, // 用 ```trank ... ``` 代码块也能渲染组件
    },
  });
  return md;
};
