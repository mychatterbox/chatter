export const transformerFileName = ({ className = "code-file-label" } = {}) => ({
  name: "transformer-file-name",
  pre(node) {
    const raw = this.options?.meta?.__raw || node.meta || "";
    
    const isExpanded = /\bexpanded\b/.test(raw);
    const cleanedRaw = raw.replace(/\bexpanded\b/g, "").trim();

    const patterns = [
      /(?:file|filename|title)=["']([^"']+)["']/,
      /(?:file|filename|title)=([^\s]+)/,
      /^([^\s=]+)(?:\s|$)/,
    ];

    let file = "";
    for (const pattern of patterns) {
      const match = cleanedRaw.match(pattern);
      if (match && match[1]) {
        file = match[1];
        break;
      }
    }

    const children = [];

    if (file) {
      children.push({
        type: "element",
        tagName: "span",
        properties: { className: [className] },
        children: [{ type: "text", value: file }],
      });
    }

    children.push(node);

    return {
      type: "element",
      tagName: "div",
      properties: { 
        className: ["code-block-wrapper"],
        "data-file": file || "",
        "data-expanded": isExpanded ? "true" : "false",
        style: node.properties.style,
      },
      children: children,
    };
  },
});