export const transformerFileName = ({ className = "code-file-label", hideDot = false } = {}) => ({
  pre(node) {
    // meta raw parsing - file 값만 추출하는 간단한 방법
    const raw = this.options.meta?.__raw;
    if (!raw) return;

    // file="값" 패턴 찾기
    const fileMatch = raw.match(/file=(["'`])(.*?)\1/);
    if (!fileMatch) return;

    const file = fileMatch[2];
    if (!file) return;

    this.addClassToHast(node, "has-code-file-label");
    node.properties = node.properties || {};
    this.addClassToHast(node, "has-code-file-label code-file-offset");

    const labelSpan = {
      type: "element",
      tagName: "span",
      properties: {
        class: [className, hideDot ? "no-dot" : ""].filter(Boolean),
      },
      children: [{ type: "text", value: file }],
    };

    node.children.unshift(labelSpan);

    return {
      type: "element",
      tagName: "div",
      properties: { class: ["code-block-wrapper"] },
      children: [node],
    };
  },
});