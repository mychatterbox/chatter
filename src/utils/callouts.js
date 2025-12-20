import { visit } from 'unist-util-visit';

export function Callouts() {
  return (tree) => {
    visit(tree, 'blockquote', (node) => {
      processBlockquoteRecursively(node);
    });
  };
}

function processBlockquoteRecursively(node) {
  if (!node.children || !Array.isArray(node.children)) return;
  
  for (const child of node.children) {
    if (child.type === 'blockquote') {
      processBlockquoteRecursively(child);
    } else if (child.children) {
      for (const grandchild of child.children) {
        if (grandchild.type === 'blockquote') {
          processBlockquoteRecursively(grandchild);
        }
      }
    }
  }
  
  processCallout(node);
}

function processCallout(node) {
  if (!node.children || !Array.isArray(node.children)) return;

  const firstChild = node.children[0];
  if (!firstChild || firstChild.type !== 'paragraph') return;
  if (!firstChild.children || !Array.isArray(firstChild.children)) return;

  const textNode = firstChild.children[0];
  if (!textNode || textNode.type !== 'text') return;

  const text = textNode.value || '';

  const match = text.match(/^\[!(\w+)(?:\|([\w-]+(?:\|[\w-]+)*))?\]\s*(.*)/);
  if (!match) return;

  const [_, type, options, titleText] = match;
  const normalizedType = type.toLowerCase();
  const optionList = options ? options.split('|') : [];

  const hideTitle = optionList.includes('hide');
  const collapsed = optionList.includes('collapsed');
  const noIcon = optionList.includes('no-icon');
  const small = optionList.includes('small');
  const borderless = optionList.includes('borderless');

  const typeMap = {
    note: 'note',
    tip: 'tip',
    hint: 'tip',
    important: 'important',
    warning: 'warning',
    caution: 'warning',
    danger: 'danger',
    error: 'danger',
    info: 'info',
    success: 'success',
    check: 'success',
    question: 'question',
    todo: 'todo',
    abstract: 'abstract',
    summary: 'abstract',
    tldr: 'abstract',
    bug: 'bug',
    fail: 'fail',
    example: 'example',
    quote: 'quote',
    cite: 'quote'
  };

  const finalType = typeMap[normalizedType] || 'note';

  const iconMap = {
    note: '📝',
    tip: '💡',
    important: '⭐',
    warning: '⚠️',
    danger: '🔥',
    error: '❌',
    info: 'ℹ️',
    success: '✅',
    check: '✓',
    question: '❓',
    todo: '📋',
    abstract: '📄',
    bug: '🐛',
    fail: '🚫',
    example: '🔍',
    quote: '💬',
    cite: '📚'
  };

  const icon = iconMap[finalType] || '📌';

  if (titleText.trim()) {
    textNode.value = titleText;
  } else {
    if (firstChild.children.length > 1) {
      firstChild.children.shift();
      if (firstChild.children[0]?.type === 'break') {
        firstChild.children.shift();
      }
    } else {
      node.children.shift();
    }
  }

  const checkboxId = `callout-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  let titleHtml = '';
  if (!hideTitle) {
    titleHtml = `
      ${collapsed ? `<input type="checkbox" id="${checkboxId}" class="callout-checkbox">` : ''}
      <label for="${checkboxId}" class="callout-title" ${collapsed ? '' : 'style="cursor: default;"'}>
        ${!noIcon ? `<span class="callout-icon" aria-hidden="true">${icon}</span>` : ''}
        <span class="callout-title-text">${escapeHtml(type)}</span>
        ${collapsed ? `<span class="callout-toggle">&#x3009;</span>` : ''}
      </label>
    `;
  }

  const openingDiv = `<div class="callout callout-${finalType} ${small ? 'callout-small' : ''} ${borderless ? 'callout-borderless' : ''} ${collapsed ? 'callout-collapsible' : ''}">
      ${titleHtml}
      <div class="callout-content" ${collapsed ? 'style="display: none;"' : ''}>`;
  
  const closingDiv = `</div></div>`;

  node.children.unshift({
    type: 'html',
    value: openingDiv
  });
  
  node.children.push({
    type: 'html',
    value: closingDiv
  });

  node.data = {
    hName: 'div',
    hProperties: {
      className: 'callout-wrapper'
    }
  };
}

function escapeHtml(text) {
  if (typeof text !== 'string') return text;
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}