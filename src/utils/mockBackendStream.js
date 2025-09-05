export function mockBackendStream(callback) {
  const fullText =
    "普通文本开头。\n" +
    "<tarnk>分析开始...\n" +
    "分析内容逐步生成...\n" +
    "<citation><a href='https://vuejs.org'>Vue官方文档</a> " +
    "<a href='https://developer.mozilla.org/'>MDN JS Guide</a></citation>\n分析完成。</tarnk>\n" +
    "普通文本继续。\n" +
    "<tarnk>第二段思考开始...\n" +
    "<citation><a href='https://github.com/vuejs/vue'>Vue源码</a> " +
    "<a href='https://www.javascript.com/'>JavaScript官网</a></citation>\n分析完成。</tarnk>\n" +
    "全文输出完成。";

  let i = 0;
  function push() {
    if (i < fullText.length) {
      callback(fullText[i]);
      i++;
      setTimeout(push, 40);
    }
  }
  push();
}
