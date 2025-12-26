import { visit } from 'unist-util-visit';

/**
 * 슬러그 생성
 * - NULL 문자(\0) 제거
 * - 한글 허용
 * - 중복 방지용 기본 형태
 */
function slugify(text) {
  if (!text || typeof text !== 'string') return '';

  return text
    .replace(/\0/g, '') // ⭐ NULL 문자 제거 (중요)
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\uac00-\ud7a3-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

/**
 * 노드에서 텍스트만 안전하게 추출
 */
function getTextContent(node) {
  if (!node) return '';

  if (node.type === 'text') {
    return typeof node.value === 'string'
      ? node.value.replace(/\0/g, '')
      : '';
  }

  if (Array.isArray(node.children)) {
    return node.children
      .map(getTextContent)
      .join('');
  }

  return '';
}

/**
 * rehype 플러그인
 */
export function addAnchorLinks(options = {}) {
  const {
    levels = ['h2', 'h3', 'h4'],
    className = 'heading-anchor',
  } = options;

  return function transformer(tree) {
    const idMap = new Map();

    visit(tree, 'element', (node) => {
      // 1️⃣ 기본 방어
      if (!node || typeof node !== 'object') return;
      if (!node.tagName || !levels.includes(node.tagName)) return;

      // 2️⃣ children 방어
      if (!Array.isArray(node.children)) {
        node.children = [];
      }

      // 3️⃣ 이미 앵커가 있으면 스킵
      const hasLink = node.children.some(
        (child) =>
          child &&
          child.type === 'element' &&
          child.tagName === 'a' &&
          child.properties &&
          'data-anchor' in child.properties
      );
      if (hasLink) return;

      // 4️⃣ 헤딩 텍스트 추출
      const textContent = getTextContent(node).trim();
      if (!textContent) return;

      // 5️⃣ id 생성 (중복 방지)
      if (!node.properties) node.properties = {};

      let id = node.properties.id;
      if (!id) {
        const baseId =
          slugify(textContent) ||
          `sec-${Math.random().toString(36).slice(2, 7)}`;

        id = baseId;
        let counter = 1;

        while (idMap.has(id)) {
          id = `${baseId}-${counter++}`;
        }

        node.properties.id = id;
      }

      idMap.set(id, true);

      // 6️⃣ 앵커 엘리먼트 삽입
      node.children.push({
        type: 'element',
        tagName: 'a',
        properties: {
          href: `#${id}`,
          className: [className],
          'data-anchor': '',
          'aria-label': '섹션 링크',
        },
        children: [
          {
            type: 'element',
            tagName: 'span',
            properties: {
              className: ['anchor-icon'],
              'aria-hidden': 'true',
            },
            children: [
              {
                type: 'element',
                tagName: 'svg',
                properties: {
                  width: '24',
                  height: '24',
                  viewBox: '0 0 24 24',
                  role: 'presentation',
                },
                children: [
                  {
                    type: 'element',
                    tagName: 'g',
                    properties: {
                      fill: 'currentColor',
                      'fill-rule': 'evenodd',
                    },
                    children: [
                      {
                        type: 'element',
                        tagName: 'path',
                        properties: {
                          d: 'm12.856 5.457-.937.92a1 1 0 0 0 0 1.437 1.047 1.047 0 0 0 1.463 0l.984-.966c.967-.95 2.542-1.135 3.602-.288a2.54 2.54 0 0 1 .203 3.81l-2.903 2.852a2.646 2.646 0 0 1-3.696 0l-1.11-1.09L9 13.57l1.108 1.089c1.822 1.788 4.802 1.788 6.622 0l2.905-2.852a4.558 4.558 0 0 0-.357-6.82c-1.893-1.517-4.695-1.226-6.422.47',
                        },
                      },
                      {
                        type: 'element',
                        tagName: 'path',
                        properties: {
                          d: 'm11.144 19.543.937-.92a1 1 0 0 0 0-1.437 1.047 1.047 0 0 0-1.462 0l-.985.966c-.967.95-2.542 1.135-3.602.288a2.54 2.54 0 0 1-.203-3.81l2.903-2.852a2.646 2.646 0 0 1 3.696 0l1.11 1.09L15 11.43l-1.108-1.089c-1.822-1.788-4.802-1.788-6.622 0l-2.905 2.852a4.558 4.558 0 0 0 .357 6.82c1.893 1.517 4.695 1.226 6.422-.47',
                        },
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      });
    });
  };
}
