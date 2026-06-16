import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { globalApiService } from '../../api/globalApiService';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { until } from 'lit/directives/until.js';
import { yangChunCommentStyles } from '../yangchun-comment.styles';
import type { Comment } from '@ziteh/yangchun-comment-shared';
import { sanitizeHtml } from '../../utils/sanitize';
import { marked } from 'marked';
import { formatRelativeDate, formatAbsoluteDate } from '../../utils/format';
import { t } from '../../utils/i18n';
import anonymousAvatar from '../anonymous_square.png?url';

const anonymousAvatarUrl = anonymousAvatar;

const deletedMark = 'deleted';

@customElement('comment-list-item')
export class CommentListItem extends LitElement {
  static styles = [
    yangChunCommentStyles,
    css`
      :host {
        display: block;
        margin-bottom: var(--ycc-spacing-s);
      }
      .comment-layout {
        display: flex;
        // gap: var(--ycc-spacing-s);
        align-items: flex-start;
        margin: var(--ycc-spacing-l) -5px;
        width: 100%;
        box-sizing: border-box;
      }
      .author-avatar {
        width: 40px;
        height: 40px;
        object-fit: cover;
        border-radius: var(--ycc-radius);
      }
      .emoji-column {
        flex-shrink: 0;
        width: 1.3em;
        display: flex;
        justify-content: center;
        // padding-top: var(--ycc-spacing-xs);
        font-size: 2.5em;
        // margin: 2px var(--ycc-spacing-s) 0 0;
        line-height: 1;

      }
      .comment-box {
        flex: 1;
        // padding: 0 var(--ycc-spacing-s);
        border: none;
        background-color: var(--ycc-bg-color);
        min-width: 0;
        display: flex;
        flex-direction: column;
        width: 100%;
        box-sizing: border-box;
      }
      .reply-comment .comment-box {
        // background-color: var(--ycc-bg-secondary);
      }
      .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--ycc-spacing-s);
        color: var(--ycc-text-secondary);
        width: 100%;
        box-sizing: border-box;
        flex-wrap: wrap;
        line-height: 1.2;
      }
      .header-meta {
        display: flex;
        align-items: center;
        gap: var(--ycc-spacing-s);
        flex-wrap: wrap;
        min-width: 0;
      }
      .header-emoji {
        display: none;
      }
      .header-avatar {
        width: 1.2em;
        height: 1.2em;
        object-fit: cover;
        border-radius: var(--ycc-radius);
        vertical-align: middle;
        display: none;
      }
      .author {
        font-weight: bold;
        color: var(--ycc-text-primary);
        font-size: 0.93em;
      }
      .badge {
        background-color: var(--ycc-badge-bg);
        color: var(--ycc-badge-text);
        border-radius: var(--ycc-radius);
        padding: 0 var(--ycc-spacing-xs);
        font-size: 0.9em;
      }
      .date-relative {
        display: none; /* 상대 시간 숨김 */
        font-size: 0.9em;
      }
      .date-absolute {
        display: inline; /* 절대 시간 표시 */
        font-size: 0.7em;
        opacity: 0.7;
        // align-self: baseline;
        // vertical-align: baseline;
      }
.comment-id {
  display: none;
  font-size: 0.9em;
  // font-family: var(--ycc-font-monospace);
  font-weight: 500;
}
.header:hover .comment-id {
  display: block;
  // opacity: 0.6;
}
.header:hover .date-absolute {
  display: inline; /* hover 중에도 계속 표시 */
  // opacity: 0.6;
}
      .comment-reply-to {
        display: none;
        font-size: 0.9em;
      }
      .header:hover .comment-reply-to {
        display: block;
        // opacity: 0.6;
        color: var(--ycc-primary-hover);
      }
      .content {
        // margin: 0 10px;
        line-height: 1.6;
        // white-space: pre-wrap;
        word-break: break-word;
        overflow: hidden;
        transition: max-height 0.3s ease-out;
      }
      .content.collapsed {
        max-height: 10em;
        position: relative;
      }
      .content.collapsed::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 3em;
        background: linear-gradient(transparent, var(--ycc-bg-color));
        pointer-events: none;
      }
      .show-more-btn {
        margin-top: var(--ycc-spacing-xs);
        color: var(--ycc-primary-color);
        font-weight: 500;
        cursor: pointer;
        padding: 2px 0;
        font-size: 0.9em;
        background: none;
        border: none;
      }
      .show-more-btn:hover {
        color: var(--ycc-primary-hover);
        text-decoration: underline;
        background: none;
      }
      .content p {
        margin: 0;
      }
      .content a {
        color: var(--ycc-primary-color);
        text-decoration: underline;
      }
      .content a:hover {
        color: var(--ycc-primary-hover);
      }
      .content img {
        max-width: 80%;
        height: auto;
        border-radius: var(--ycc-radius);
        display: block;
        margin: var(--ycc-spacing-s) 0;
      }
      .content code {
        background-color: var(--ycc-bg-secondary);
        padding: 2px 4px;
        border-radius: 4px;
        font-family: var(--ycc-font-monospace);
        // font-size: 0.9em;
      }
      .content pre {
        background-color: var(--ycc-bg-secondary);
        padding: var(--ycc-spacing-s);
        border-radius: var(--ycc-radius);
        overflow-x: auto;
        margin: var(--ycc-spacing-s) 0;
      }
      .content pre code {
        padding: 0;
        background-color: transparent;
        display: block;
      }
      .content ul,
      .content ol {
        padding-left: var(--ycc-spacing-l);
        margin: var(--ycc-spacing-s) 0;
      }
      .content li {
        margin: 0.2em 0;
      }
      .content hr {
        border: none;
        border-top: 1px solid var(--ycc-border-color);
        margin: var(--ycc-spacing-m) 0;
      }
      .content blockquote {
        border-left: 4px solid var(--ycc-border-color);
        margin: var(--ycc-spacing-s) 0;
        padding-left: var(--ycc-spacing-m);
        color: var(--ycc-text-secondary);
      }
      .content strong {
        font-weight: bold;
      }
      .content em {
        font-style: italic;
      }
      .content h3 {
        font-size: 1.3em;
        margin: 0;
        font-weight: bold;
      }
      .content h4 {
        font-size: 1.15em;
        margin: 0;
        font-weight: bold;
      }  
      .actions {
        gap: var(--ycc-spacing-s);
        display: flex;
        flex-wrap: wrap;
        margin-top: var(--ycc-spacing-s);
        opacity: 0.7;
      }
      .reply-comments {
        position: relative;
        margin-top: var(--ycc-spacing-s);
        margin-left: calc(var(--ycc-spacing-xxl) * 1.15);
        margin-bottom: var(--ycc-spacing-m);
      }
      .reply-comment {
        position: relative;
      }
      /* L자형 가지 라인 (위에서부터 아바타 중앙까지) */
      .reply-comment::before {
        content: '';
        position: absolute;
        left: -26px;
        top: -35px; /* 위쪽 여백을 메우기 위해 연장 */
        width: 15px;
        height: 52px; /* top(-16) + margin-top(16) + avatar-center(20) = 52px */
        border-left: 2px solid var(--ycc-border-color);
        border-bottom: 2px solid var(--ycc-border-color);
        border-bottom-left-radius: 15px;
        z-index: 1;
      }
      /* 다음 형제로 이어지는 수직선 (마지막 요소가 아닐 때만) */
      .reply-comment:not(.preview-label)::after {
        content: '';
        position: absolute;
        left: -26px;
        top: 0px; /* 아바타 중앙 지점 */
        bottom: -16px; /* 아래쪽 여백을 메우기 위해 연장 */
        border-left: 2px solid var(--ycc-border-color);
        z-index: 0;
      }
      .reply-comment.is-last::after {
        display: none;
      }

      /* 부모 아바타 아래로 뻗는 시작 선 */
      .comment-layout {
        position: relative;
        z-index: 2;
        gap: var(--ycc-spacing-xs);
      }
      .comment-layout.has-replies::after {
        content: '';
        position: absolute;
        left: 25px; /* 아바타 중앙 (50px/2) */
        top: 50px;  /* 아바타 중앙 하단부터 시작 */
        bottom: -15px; /* 답글 영역 입구까지 충분히 연장 */
        border-left: 2px solid var(--ycc-border-color);
        z-index: 0;
      }

      @media (max-width: 768px) {
        .reply-comment::before, .reply-comment::after {
          left: -26px;
        }
      }
      .reply-input-slot {
        position: relative;
        margin: var(--ycc-spacing-m) 0 var(--ycc-spacing-m) 0;
      }
      .reply-input-slot comment-input::part(input-container) {
        margin-left: 0;
        width: 100%;
      }
      /* 특정 단계 이상부터는 들여쓰기 중단 (PC 기준 6단계부터) */
      :host([depth="5"]) .reply-comments,
      :host([depth="6"]) .reply-comments,
      :host([depth="7"]) .reply-comments {
        margin-left: 0;
      }
      /* 특정 단계 이상부터는 브랜치 라인 제거 (들여쓰기가 중단되는 단계와 동기화) */
      :host([depth="6"]) .reply-comment::before,
      :host([depth="6"]) .reply-comment::after,
      :host([depth="7"]) .reply-comment::before,
      :host([depth="7"]) .reply-comment::after {
        display: none;
      }

      @media (max-width: 420px) {
        /* 모바일 레이아웃 및 정렬 */
        .comment-layout {
          display: flex;
          flex-direction: row;
          align-items: flex-start;
          margin: var(--ycc-spacing-xs) -5px;
        }

        .reply-comment:not(.preview-label)::after 
        {
              left: -17.5px;
        }
        .emoji-column {
          display: flex;
          flex: 0 0 35px;
          justify-content: center;
          font-size: 1.2rem;
        }
        .emoji-column img {
          width: 28px;
          height: 28px;
        }
        .header-avatar, .header-emoji {
          // display: none !important;
        }
        .header {
          justify-content: space-between;
          gap: calc(var(--ycc-spacing-s) / 2);
          width: 100%;
        }
        .actions {          margin-top: var(--ycc-spacing-s);
          margin-bottom: var(--ycc-spacing-m);
  }
          .comment-id {
  font-size: 0.8em;
}
  .comment-icon {
top: 0;
  }
        .comment-layout.has-replies::after{
          left: 12.5px;
          top: 35px;
          // bottom: -10px;
          border-left: 2px solid var(--ycc-border-color);
        }
        .reply-comments {
          margin-left: 25px;
        }
        /* 모바일에서도 6단계부터는 브랜치 라인 제거 (PC와 동기화) */
        :host([depth="6"]) .reply-comment::before,
        :host([depth="6"]) .reply-comment::after,
        :host([depth="7"]) .reply-comment::before,
        :host([depth="7"]) .reply-comment::after {
          display: none !important;
        }

        .reply-comment::before {
          left: -17.5px;
          // top: -26px;
          width: 10px;
          height: 43px;
          border-left: 2px solid var(--ycc-border-color);
          border-bottom: 2px solid var(--ycc-border-color);
          // border-bottom-left-radius: 8px;
          // display: block !important;
        }
        .reply-comment::after {
          left: -17.5px;
          // top: 12.5px;
          bottom: -16px;
          display: block !important;
          border-left: 2px solid var(--ycc-border-color);
        }
        .reply-comment.is-last::after {
          display: none !important;
        }
        .preview-label {
         margin-left: 0; 
         }
        .preview-container {
          margin: 0 8px;
          padding: var(--ycc-spacing-s);
        }
        comment-info::part(info-bar) {
          margin-left: 0;
          gap: 5px;
          padding: 5px 0;
        }
        .content { font-size: 0.9em; }
      }
.action-btn {
    background: none;

    color: var(--ycc-text-secondary);
    padding: 0px;
    font-size: 0.9em;
}
    .action-btn:hover {
    background: none;
    color: var(--ycc-primary-hover);
    text-decoration: underline;
    font-weight: 700;
}
    .action-btn.danger {
      color: #ef4444;
      font-weight: bold;
    }
    .action-btn.danger:hover {
      color: #dc2626;
    }
    // .reply-icon {
    //   margin-right: 2px;
    //   padding-left: 30px;
    // }
    .like-btn {
      background: none;
      border: none;
      cursor: pointer;
      padding: 0;
      font-size: 0.9em;
      color: var(--ycc-text-secondary);
      display: inline-flex;
      align-items: center;
      gap: 2px;
      margin-left: auto;
      align-self: center;
      opacity: 0.7;
      line-height: 1;
      vertical-align: middle;
      transition: transform 0.15s ease, opacity 0.15s ease;
      position: relative;
      top: -1px; /* 상하 정렬 미세 보정 */
    }
    .like-btn:hover {
      opacity: 1;
      transform: scale(1.15);
      background: none;
    }
    .like-btn.liked {
      opacity: 1;
    }
    .like-count {
      font-size: 0.85em;
    }
      :host([isReplying]) .comment-id,
.header:hover .comment-id {
  display: block !important;
}
    `,
  ];

  @property({ type: Boolean, reflect: true }) isLast = false;

  @property({ type: Object }) comment: Comment = {
    id: '',
    msg: '',
    pubDate: 0,
  };
  @property({ type: Array }) replyComments: Comment[] = [];
  @property({ type: Array }) allComments: Comment[] = [];
  @property({ type: String }) author = '';
  @property({ type: String }) post = '';
  @property({ type: Number, reflect: true }) depth = 1;
  @property({ type: Object }) commentTokens = new Map<string, { token: string; timestamp: number }>();
  @property({ attribute: false }) inlineEditor: unknown = null;
  @property({ type: String }) inlineEditorRootId = '';

  @state() private likes = 0;
  @state() private liked = false;
  @state() private likeTimestamp: number | null = null;
  @property({ type: Boolean, reflect: true }) isReplying = false;
  private _lastMsg: string | undefined | null = null;
  private _cachedHtml: ReturnType<typeof unsafeHTML> | null = null;

  private isContentExpanded = false;
  private readonly MAX_LINES = 10;
  private readonly LIKED_STORAGE_KEY = 'ycc_liked';

  firstUpdated() {
    this.likes = this.comment.likes ?? 0;
    try {
      const stored = localStorage.getItem(this.LIKED_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          // 기존 string[] 형식에서 마이그레이션
          this.liked = parsed.includes(this.comment.id);
          this.likeTimestamp = this.liked ? this.comment.pubDate : null;
        } else {
          // 새로운 Record<string, number> 형식
          const likedData: Record<string, number> = parsed;
          this.liked = !!likedData[this.comment.id];
          this.likeTimestamp = likedData[this.comment.id] || null;
        }
      }
    } catch {
      this.liked = false;
    }
  }

  render() {
    const commentContent = html`<div part="content" class="content">${until(this.renderMarkdown(this.comment.msg), '')}</div>`;
    const shouldRenderReplyArea = this.replyComments.length > 0 || this.shouldRenderInlineEditor();
    const normalReplies = this.replyComments.filter(
      (reply) => !this.isPreviewComment(reply) && reply.replyTo === this.comment.id,
    );
    const previewReplies = this.replyComments.filter(
      (reply) => this.isPreviewComment(reply) && reply.replyTo === this.comment.id,
    );

    return html`
    <div class="${this.comment.replyTo ? 'reply-comment' : 'root-comment'} ${this.isLast ? 'is-last' : ''}">
      <div class="comment-layout ${shouldRenderReplyArea ? 'has-replies' : ''}">
        <div class="emoji-column">
          ${this.comment.emoji
        ? html`<span class="author-emoji" title="Selected emoji">${this.comment.emoji}</span>`
        : html`<img src=${anonymousAvatarUrl} class="author-avatar" alt="avatar" />`}
        </div>
        <div part="comment-box" class="comment-box" id=${this.comment.id} role="article">
          <div class="header" part="header">
            <div class="header-meta">
              ${this.comment.emoji
        ? html`<span class="header-emoji" title="Selected emoji">${this.comment.emoji}</span>`
        : html`<img src=${anonymousAvatarUrl} class="header-avatar" alt="avatar" />`}
              <span class="author" part="author">
                ${this.comment.isAdmin ? (this.author || 'Admin') : this.comment.nickname || t('anonymous')}
              </span>
              ${this.comment.isAdmin ? html`<span class="badge" part="badge">${t('author')}</span>` : null}
              <span class="date-absolute">${formatAbsoluteDate(this.comment.pubDate)}</span>
              <span class="comment-id">ID : #${this.comment.id}</span>
            </div>
            <button
              class="like-btn ${this.liked ? 'liked' : ''}"
              @click=${this.handleLike}
              aria-label="Like"
              title="${this.liked && !this.isWithinUnlikeTimeLimit ? t('unlikeLimitReached') : ''}"
            >
              ${this.likes > 0 ? html`<span class="like-count">${this.likes}</span>` : null}
              ${this.liked ? '❤️' : '🩶'}
            </button>
          </div>
          ${commentContent}
          <!-- 액션 버튼 영역 -->
          <div class="actions">
            <button @click=${this.handleReply} class="action-btn"><span class="reply-icon">↪</span> ${t('reply')}</button>
            ${this.canEditOrDelete() ? html`
              <button @click=${this.handleEdit} class="action-btn danger">${t('edit')}</button>
              <button @click=${this.handleDelete} class="action-btn danger">${t('delete')}</button>
            ` : null}
          </div>
        </div>
      </div>
      ${shouldRenderReplyArea ? html`
        <div class="reply-comments">
          ${normalReplies.map((reply, index) => {
          const grandChildReplies = this.depth < 10
            ? (this.allComments || []).filter(c => c.replyTo === reply.id)
            : [];
          const isLast = index === normalReplies.length - 1 && !this.shouldRenderInlineEditor();

          return html`
            <comment-list-item
              .comment=${reply}
              .author=${this.author}
              .post=${this.post}
              .allComments=${this.allComments}
              .replyComments=${grandChildReplies}
              .depth=${this.depth + 1}
              .isLast=${isLast}
              .commentTokens=${this.commentTokens}
              .inlineEditor=${this.inlineEditor}
              .inlineEditorRootId=${this.inlineEditorRootId}
              @comment-reply=${this.handleReply}
              @comment-edit=${this.handleEdit}
              @comment-delete=${this.handleDelete}
            ></comment-list-item>
          `;
        })}
          ${this.shouldRenderInlineEditor()
          ? html`<div class="reply-input-slot">${this.inlineEditor}</div>`
          : null}
          ${previewReplies.length > 0
          ? html`
                <div class="preview-label">${t('preview')}</div>
                <div class="preview-container">
                  ${previewReplies.map(reply => html`
                    <comment-list-item
                      .comment=${reply}
                      .author=${this.author}
                      .replyComments=${[]}
                      .commentTokens=${this.commentTokens}
                      @comment-reply=${this.handleReply}
                      @comment-edit=${this.handleEdit}
                      @comment-delete=${this.handleDelete}
                    ></comment-list-item>
                  `)}
                </div>
              `
          : null}
        </div>
      ` : ''}
    </div>
  `;
  }

    updated(changedProperties: Map<string, any>) {
    // 1. 부모로부터 전달받는 inlineEditorRootId 속성이 변경되었는지 확인
    if (changedProperties.has('inlineEditorRootId')) {
      // 2. 현재 입력 중인 ID가 나의 ID와 다르면 답글 상태를 해제
      if (this.inlineEditorRootId !== this.comment.id) {
        this.isReplying = false;
      }
    }
  }

  private shouldRenderInlineEditor(): boolean {
    return !!this.inlineEditor && this.inlineEditorRootId === this.comment.id;
  }

  private isPreviewComment(comment: Comment): boolean {
    return comment.id.startsWith('preview_');
  }

  private get isWithinTimeLimit(): boolean {
    const now = Date.now();
    const twentyFourHours = 24 * 60 * 60 * 1000;
    return (now - this.comment.pubDate) < twentyFourHours;
  }

  private get isWithinUnlikeTimeLimit(): boolean {
    if (!this.liked) return true;
    const now = Date.now();
    const twentyFourHours = 24 * 60 * 60 * 1000;
    // 저장된 좋아요 시점(likeTimestamp)을 사용하고, 없으면 댓글 작성일(pubDate)을 기준으로 함
    const startTime = this.likeTimestamp || this.comment.pubDate;
    return (now - startTime) < twentyFourHours;
  }

  private canEditOrDelete(): boolean {
    const hasToken = this.commentTokens.has(this.comment.id);
    return this.isWithinTimeLimit && hasToken;
  }

  private async handleLike() {
    if (!this.comment.id) return;

    if (this.liked) {
      // 좋아요 취소 로직: 좋아요를 누른 시점부터 24시간 이내인 경우만 허용
      if (!this.isWithinUnlikeTimeLimit) {
        alert(t('unlikeLimitReached'));
        return;
      }

      // API 서버의 unlikeComment를 호출합니다.
      const newLikes = await globalApiService.getInstance().unlikeComment(this.comment.id, this.post);
      if (newLikes !== null) {
        this.likes = newLikes;
        this.liked = false;
        this.updateLikedStorage(false);
      }
      return;
    }

    // 좋아요 등록 로직
    const newLikes = await globalApiService.getInstance().likeComment(this.comment.id, this.post);
    if (newLikes !== null) {
      this.likes = newLikes;
      this.liked = true;
      this.updateLikedStorage(true);
    }
  }

  private updateLikedStorage(isLiked: boolean) {
    try {
      const stored = localStorage.getItem(this.LIKED_STORAGE_KEY);
      let likedData: Record<string, number> = {};
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          // 마이그레이션: 기존 ID 리스트를 객체로 변환 (시점은 알 수 없으므로 댓글 작성일 등으로 대체하거나 0으로 설정)
          parsed.forEach(id => likedData[id] = this.comment.pubDate);
        } else {
          likedData = parsed;
        }
      }

      if (isLiked) {
        const now = Date.now();
        likedData[this.comment.id] = now;
        this.likeTimestamp = now;
      } else {
        delete likedData[this.comment.id];
        this.likeTimestamp = null;
      }
      localStorage.setItem(this.LIKED_STORAGE_KEY, JSON.stringify(likedData));
    } catch {
      // localStorage 접근 불가 시 무시
    }
  }

  private handleDelete() {
    if (!this.comment.id) return;
    this.dispatchEvent(
      new CustomEvent('comment-delete', {
        detail: this.comment.id,
        bubbles: true,
        composed: true,
      }),
    );
  }

  private handleEdit() {
    if (!this.comment.id) return;
    this.dispatchEvent(
      new CustomEvent('comment-edit', {
        detail: this.comment.id,
        bubbles: true,
        composed: true,
      }),
    );
  }

private handleReply() {
  if (!this.comment.id) return;
  
  // 답글 모드 활성화 (ID 강제 노출을 위해)
  this.isReplying = true; 
  
  this.dispatchEvent(
    new CustomEvent('comment-reply', {
      detail: this.comment.id,
      bubbles: true,
      composed: true,
    }),
  );
}

  private handleContentClick(e: Event) {
    const target = e.target as HTMLElement;
    const link = target.closest('[data-external-link="true"]') as HTMLElement;
    if (link) {
      e.preventDefault();
      e.stopPropagation();
      const href = link.getAttribute('data-href');
      if (href) {
        this.dispatchEvent(
          new CustomEvent('external-link-click', {
            detail: href,
            bubbles: true,
            composed: true,
          }),
        );
      }
    }
  }

  private async renderMarkdown(
    dirtyMd: string | undefined | null,
  ): Promise<ReturnType<typeof unsafeHTML>> {
    if (!dirtyMd) return unsafeHTML('');

    if (this._lastMsg === dirtyMd && this._cachedHtml) {
      return this._cachedHtml;
    }

    const dirtyHtml = await marked.parse(dirtyMd);
    const cleanHtml = sanitizeHtml(dirtyHtml);
    this._lastMsg = dirtyMd;
    this._cachedHtml = unsafeHTML(cleanHtml);
    return this._cachedHtml;
  }

  private shouldShowExpandBtn(): boolean {
    const lines = (this.comment.msg || '').split('\n');
    return lines.length > this.MAX_LINES;
  }

  private handleToggleExpand(): void {
    this.isContentExpanded = !this.isContentExpanded;
    this.requestUpdate();
  }
}
