export const transformerFileName = ({ className = "code-file-label", hideDot = false } = {}) => ({
  pre(node) {
    // meta raw parsing (예: file="src/config/site.ts")
    const raw = this.options.meta?.__raw?.split(" ");
    if (!raw) return;

    const metaMap = new Map();
    for (const item of raw) {
      const [key, value] = item.split("=");
      if (!key || !value) continue;
      metaMap.set(key, value.replace(/["'`]/g, ""));
    }

    const file = metaMap.get("file");
    if (!file) return;

    this.addClassToHast(node, "has-code-file-label");
    node.properties = node.properties || {};
    const existingStyle = node.properties.style || "";
    // node.properties.style = `${existingStyle}; --file-name-offset: -0.75rem;`;
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
