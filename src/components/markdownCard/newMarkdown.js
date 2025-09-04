import markdownit from "markdown-it";
// import marksownTtVueContainer from "./marksown-it-vue-container";
// import markdownItVue2Renderer from "./markdown-it-vue-renderer";
// import CodeBlock from "./CodeBlock.vue";
// import markdownItContainer from "markdown-it-container";

export default () => {
  const md = new markdownit({
    html: true,
  });

  // md.use(markdownItContainer, 'trank', {
  //   render: (tokens, idx) => {
  //     const token = tokens[idx];
  //     if (token.nesting === 1) {
  //       // opening tag
  //       return `<CodeBlock>`;
  //     } else {
  //       // closing tag
  //       return `</CodeBlock>`;
  //     }
  //   }
  // });

  // marksownTtVueContainer(md, {
  //   components: {
  //     trank: CodeBlock,
  //   },
  // });
  // markdownItVue2Renderer(md);
  // md.use(vueFencePlugin, {
  //   components: {
  //     trank: CodeBlock, // 用 ```trank ... ``` 代码块也能渲染组件
  //   },
  // });
  return md;
};
