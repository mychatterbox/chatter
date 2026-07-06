import { LitElement, css, html, type PropertyValues } from 'lit';
import { customElement, property, state, query } from 'lit/decorators.js';
import { yangChunCommentStyles, yangChunCommentVars } from './yangchun-comment.styles';
import type { Comment } from '@ziteh/yangchun-comment-shared';
import './comment-input';
import { CommentInput } from './comment-input';
import './comment-info';
import './comment-dialog';
import './list/comment-list';
import './comment-admin';
import type { CommentAdmin } from './comment-admin';
import { createApiService } from '../api/apiService';
import { globalApiService } from '../api/globalApiService';
import { initI18n, koKR, t } from '../utils/i18n';
import type { I18nStrings } from '../utils/i18n';
import { cleanupPowWorker } from '../utils/pow';
import { applyMarkdownLineBreaks } from '../utils/sanitize';

@customElement('yangchun-comment')
export class YangChunComment extends LitElement {
  static styles = [
    yangChunCommentVars,
    yangChunCommentStyles,
    css`
      :host {
        display: block;
      }
      .dialog-actions {
        margin-top: var(--ycc-spacing-m);
        display: flex;
        justify-content: flex-end;
        gap: var(--ycc-spacing-s);
      }
      .help-content {
        display: flex;
        flex-direction: column;
        gap: var(--ycc-spacing-m);
      }
      .help-desc p {
        margin: 0 0 var(--ycc-spacing-s) 0;
      }
      .help-desc p:last-child {
        margin-bottom: 0;
      }
      .help-md-sample {
        background-color: var(--ycc-bg-secondary);
        padding: var(--ycc-spacing-m);
        border-radius: var(--ycc-radius);
        font-family: var(--ycc-font-monospace);
        font-size: 0.9em;
        line-height: 1.6;
        white-space: pre;
        overflow-x: auto;
        margin: 0;
      }
      .help-footer {
        font-size: 0.85em;
        color: var(--ycc-text-secondary);
        text-align: center;
        margin-top: var(--ycc-spacing-xs);
      }
      .help-footer a {
        color: var(--ycc-primary-color);
        text-decoration: none;
      }
      .help-footer a:hover {
        text-decoration: underline;
      }
      .external-link-url {
        word-break: break-all;
        color: var(--ycc-primary-color);
        font-family: var(--ycc-font-monospace);
        font-size: 0.9em;
      }
    `,
  ];

  @property({ type: String }) post = 'my-post';
  @property({ type: String }) apiUrl = 'http://localhost:8787';
  @property({ type: String }) adminName = 'Admin';
  @property({ type: String }) lang = 'ko-KR';
  @property({ type: String }) prePowSalt = 'MAGIC';
  @property({ type: Number }) prePowDifficulty = 2;
  @property({ type: Object, attribute: false }) customMessages: I18nStrings | undefined;

  // @state() private apiService!: ApiService;

  @state() private draft = '';
  @state() private nickname = '';
  @state() private selectedEmoji = '';
  @state() private comments: Comment[] = [];
  @state() private deleteCommentId = '';

  // Store tokens for edit/delete operations
  @state() private commentTokens = new Map<string, { token: string; timestamp: number }>();

  @state() private referenceComment: Comment | null = null;
  @state() private isReply = true; // true: reply, false: edit

  @state() private showAdmin = false;
  @state() private showHelp = false;
  @state() private showExternalLink = false;
  @state() private externalLinkUrl = '';

  @state() private isAdmin = false;

  @state() private errorMessage = '';

  @query('comment-input') private commentInput!: CommentInput;
  @query('comment-admin') private commentAdmin!: CommentAdmin;

  render() {
    const HelpContent = html`
      <div class="help-content">
        <div class="help-desc">
          ${t('helpDesc')
        .split('\n')
        .map((line) => html`<p>${line}</p>`)}
        </div>
        <pre class="help-md-sample">
[${t('helpMdLink')}](https://example.com)

![${t('helpMdImage')}](https://example.com/img.jpg)

### H3
#### H4
*${t('helpMdItalic')}*
**${t('helpMdBold')}**
- ${t('helpMdList')}
> 인용문
\`${t('helpMdInlineCode')}\`
\`\`\`
${t('helpMdCodeBlock')}
\`\`\`

&lt;img src=&quot;${t('helpMdNoHtml')}&quot;&gt;
</pre
        >
        <div class="help-footer">
          Powered by${' '}
          <a href="https://ycc.ziteh.dev/" rel="noopener noreferrer" target="_blank">
            Yang Chun Comment
          </a>
          (<a
            href="https://github.com/ziteh/yangchun-comment"
            rel="noopener noreferrer"
            target="_blank"
            >GitHub</a
          >)
        </div>
      </div>
    `;

    // ?�라???��?/?�정) 모드?????�용???�디???�의
    const inlineEditor = this.isInlineReply
      ? this.renderCommentInput('before', this.renderCommentInfo())
      : null;

    // 루트 ?�벨(기본 ?�치)?�서 ?�용???�디???�의
    const rootEditor = !this.isInlineReply
      ? html`${this.renderCommentInfo()}${this.renderCommentInput('after')}`
      : null;

    return html`
      <div class="root" part="root">
        <!-- ?�래 ?�치: 본문 바로 ?�래 (?��? 리스???? -->
        ${rootEditor}

        <comment-list
          .comments=${this.comments}
          .author=${this.adminName}
          .post=${this.post}
          .commentTokens=${this.commentTokens}
          .previewComment=${null}
          .inlineEditor=${inlineEditor}
          .inlineEditorRootId=${this.activeReplyRootId}
          @comment-reply=${this.handleCommentReply}
          @comment-edit=${this.handleCommentEdit}
          @comment-delete=${this.handleCommentDelete}
        ></comment-list>
        <comment-dialog
          header=${t('confirmDelete')}
          .open=${this.deleteCommentId !== ''}
          @close=${() => (this.deleteCommentId = '')}
        >
          <p>${t('confirmDeleteDesc1') + this.deleteCommentId}</p>
          <strong>${t('confirmDeleteDesc2')}</strong>
          <div class="dialog-actions">
            <button class="secondary" @click=${this.handleDeleteComment}>${t('delete')}</button>
            <button @click=${() => (this.deleteCommentId = '')}>${t('cancel')}</button>
          </div>
        </comment-dialog>
        <comment-dialog
          header="Admin"
          .open=${this.showAdmin}
          @close=${() => (this.showAdmin = false)}
        >
          <comment-admin @auth-status-change=${this.handleAuthStatusChange}></comment-admin>
        </comment-dialog>

        <comment-dialog
          header=${t('help')}
          .open=${this.showHelp}
          @close=${() => (this.showHelp = false)}
        >
          ${HelpContent}
        </comment-dialog>
        <comment-dialog
          header=${t('externalLinkWarning')}
          .open=${this.showExternalLink}
          @close=${() => (this.showExternalLink = false)}
        >
          <p>${t('externalLinkDesc')}</p>
          <p class="external-link-url">${this.externalLinkUrl}</p>
          <div class="dialog-actions">
            <button class="secondary" @click=${this.handleCopyLink}>${t('copyLink')}</button>
            <button @click=${this.handleOpenLink}>${t('openLink')}</button>
          </div>
        </comment-dialog>
      </div>
    `;
  }

  private renderCommentInput(previewPlacement: 'before' | 'after', beforeInputContent: unknown = null) {
    return html`
      <comment-input
        .draft=${this.draft}
        .nickname=${this.nickname}
        .adminName=${this.adminName}
        .isAdmin=${this.isAdmin}
        .hidePreview=${false}
        .previewPlacement=${previewPlacement}
        .previewReplyTo=${this.isInlineReply ? this.referenceComment?.id || '' : ''}
        .beforeInputContent=${beforeInputContent}
        .selectedEmoji=${this.selectedEmoji}
        @draft-change=${this.handleDraftChange}
        @nickname-change=${this.handleNicknameChange}
        @emoji-change=${(e: CustomEvent) => (this.selectedEmoji = e.detail)}
        @comment-submit=${this.handleCommentSubmit}
      ></comment-input>
    `;
  }

  private renderCommentInfo() {
    return html`
      <comment-info
        .comment=${this.referenceComment}
        .isReply=${this.isReply}
        .errorMessage=${this.errorMessage}
        @error-clear=${() => (this.errorMessage = '')}
        @reference-comment-cancel=${() => this.handleRefCommentCancel()}
        @help-open=${() => (this.showHelp = true)}
        @admin-open=${() => (this.showAdmin = true)}
      ></comment-info>
    `;
  }

  protected willUpdate(changedProperties: PropertyValues<this>) {
    if (changedProperties.has('customMessages') || changedProperties.has('lang')) {
      if (this.customMessages) {
        initI18n(this.customMessages);
      } else {
        initI18n(koKR);
      }
    }

    // Initialize apiService when apiUrl changes
    if (
      (changedProperties.has('apiUrl') ||
        changedProperties.has('prePowDifficulty') ||
        changedProperties.has('prePowSalt')) &&
      this.apiUrl
    ) {
      const apiService = createApiService(this.apiUrl, this.prePowDifficulty, this.prePowSalt);
      globalApiService.setInstance(apiService);


    }

    super.willUpdate(changedProperties);
  }

  protected updated(changedProperties: PropertyValues<this>) {
    super.updated(changedProperties);
    // Re-fetch comments when post ID changes
    if (changedProperties.has('post')) {
      this.updatedComments();
    }
  }

  async firstUpdated() {
    this.addEventListener('external-link-click', this.handleExternalLinkClick as EventListener);
  }

  private readonly TOKENS_STORAGE_KEY = 'ycc_tokens';

  connectedCallback() {
    super.connectedCallback();
    this.loadTokens();
  }

  private loadTokens() {
    try {
      const stored = localStorage.getItem(this.TOKENS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        const now = Date.now();
        const twentyFourHours = 24 * 60 * 60 * 1000;

        let hasExpired = false;
        const validTokens = new Map<string, { token: string; timestamp: number }>();

        for (const [id, data] of Object.entries(parsed)) {
          const tokenData = data as { token: string; timestamp: number };
          if (now - tokenData.timestamp < twentyFourHours) {
            validTokens.set(id, tokenData);
          } else {
            hasExpired = true;
          }
        }

        this.commentTokens = validTokens;
        if (hasExpired) {
          this.saveTokens(); // clean up expired ones from storage
        }
      }
    } catch (e) {
      console.error('Failed to load comment tokens', e);
    }
  }

  private saveTokens() {
    try {
      const obj = Object.fromEntries(this.commentTokens);
      localStorage.setItem(this.TOKENS_STORAGE_KEY, JSON.stringify(obj));
    } catch (e) {
      console.error('Failed to save comment tokens', e);
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('external-link-click', this.handleExternalLinkClick as EventListener);
    cleanupPowWorker();
  }

  private async updatedComments() {
    try {
      const response = await globalApiService.getInstance().getComments(this.post);
      this.comments = response.comments;

      // ?��? ?�데?�트 ?�벤??발송 (?�시�?카운???�데?�트??
      this.dispatchEvent(new CustomEvent('ycc-comments-updated', {
        detail: { count: response.comments.length },
        bubbles: true,
        composed: true
      }));

      // Update comment-admin component with admin status if available
      if (response.isAdmin !== undefined && this.commentAdmin) {
        this.commentAdmin.updateAuthStatus(response.isAdmin);
      }
    } catch (err) {
      console.error('Error updating comments:', err);
    }
  }

  private handleRefCommentCancel = () => {

    // 1. 모든 ?�력 ?�용 초기??
    this.draft = '';
    this.nickname = '';
    this.selectedEmoji = '';

    this.errorMessage = '';

    // 2. 참조 ?��? ?�제 -> isInlineReply가 false가 ?�어 ?�디?��? 리스???�단?�로 ?�동??
    this.referenceComment = null;
    this.isReply = true;

    // 3. UI 즉시 갱신 강제
    this.requestUpdate();
  };
  private handleDraftChange = (e: CustomEvent<string>) => {
    this.draft = e.detail;
  }

  private handleNicknameChange = (e: CustomEvent<string>) => {
    this.nickname = e.detail;
  }



  private get isInlineReply(): boolean {
    // ?��?(Reply)?�든 ?�정(Edit)?�든 ?�???��????�으�??�라?�으�??�시
    return !!this.referenceComment;
  }

  private get activeReplyRootId(): string {
    return this.referenceComment?.id || '';
  }

  private async editedSubmit(emoji?: string) {
    if (!this.referenceComment) return;
    if (this.isReply) return;

    // 마크다운 줄바꿈 처리: 엔터만 입력해도 줄바꿈이 되도록 문장 끝에 스페이스 2개 추가
    // (코드 펜스 내부/라인에는 적용하지 않음)
    const pureDraft = applyMarkdownLineBreaks(this.draft.trim());

    if (!pureDraft) return;

    const tokenData = this.commentTokens.get(this.referenceComment.id);

    try {
      await globalApiService
        .getInstance()
        .updateComment(
          this.referenceComment.id,
          this.post,
          this.nickname,
          pureDraft,
          emoji,
          tokenData?.token,
          tokenData?.timestamp,
        );

      this.draft = '';
      this.nickname = '';
      this.selectedEmoji = '';
      this.referenceComment = null;
      this.isReply = true;

      await this.updatedComments();
    } catch (err) {
      console.error('Failed to add comment:', err);
    }
  }

  private handleCommentSubmit = async (e: CustomEvent<{ emoji: string }>) => {
    const { emoji } = e.detail;

    if (this.referenceComment && !this.isReply) {
      await this.editedSubmit(emoji);
      await this.updatedComments();
      return;
    }

    // 마크다운 줄바꿈 처리: 엔터만 입력해도 줄바꿈이 되도록 문장 끝에 스페이스 2개 추가
    // (코드 펜스 내부/라인에는 적용하지 않음)
    const pureDraft = applyMarkdownLineBreaks(this.draft.trim());

    if (!pureDraft) return;

    const nickname = this.nickname.trim() || undefined;
    const replyTo =
      this.referenceComment && this.referenceComment.id && this.isReply
        ? this.referenceComment.id
        : undefined;

    try {
      const result = await globalApiService
        .getInstance()
        .addComment(this.post, nickname, pureDraft, replyTo, emoji);
      if (result) {
        // Store token for future edit/delete operations
        const newTokens = new Map(this.commentTokens);
        newTokens.set(result.id, {
          token: result.token,
          timestamp: result.timestamp,
        });
        this.commentTokens = newTokens;
        this.saveTokens();

        this.draft = '';
        this.nickname = '';
        this.selectedEmoji = '';

        this.referenceComment = null;

        // Refresh from server to get the latest data
        await this.updatedComments();
      } else {
        console.error('addComment returned null');
      }
    } catch (err) {
      console.error('Failed to add comment:', err);
      this.errorMessage = (err as Error).message || 'Failed to add comment. Please try again.';
      return;
    }
  }

  private async handleCommentReply(e: CustomEvent<string>) {
    const commentId = e.detail;

    const refComment = this.comments.find((cmt) => cmt.id === commentId);
    if (!refComment) {
      this.referenceComment = null;
      return;
    }
    if (!this.isReply) {
      this.draft = ''; // If was editing, cancel editing first
    }
    this.referenceComment = refComment;
    this.isReply = true;
    this.selectedEmoji = '';
    await this.updateComplete;
    this.commentInput?.focus();
  }

  private async handleCommentDelete(e: CustomEvent<string>) {
    const commentId = e.detail;
    this.deleteCommentId = commentId;
  }

  private async handleCommentEdit(e: CustomEvent<string>) {
    const commentId = e.detail;

    const refComment = this.comments.find((cmt) => cmt.id === commentId);
    if (!refComment) {
      this.referenceComment = null;
      return;
    }
    this.referenceComment = refComment;
    this.isReply = false;
    this.draft = refComment.msg || '';
    this.nickname = refComment.nickname || '';
    this.selectedEmoji = refComment.emoji || '';

    await this.updateComplete;
    this.commentInput?.focus();
  }

  private handleAuthStatusChange = (e: CustomEvent<boolean>) => {
    this.isAdmin = e.detail;
  };

  private async handleDeleteComment() {
    if (!this.deleteCommentId) return;
    const commentId = this.deleteCommentId;

    const tokenData = this.commentTokens.get(commentId);
    if (!tokenData) {
      console.error('No token found for comment:', commentId);
      this.deleteCommentId = '';
      return;
    }

    try {
      const ok = await globalApiService.getInstance().deleteComment(commentId, this.post, tokenData.token, tokenData.timestamp);
      if (ok) {
        const newTokens = new Map(this.commentTokens);
        newTokens.delete(commentId); // Clean up token
        this.commentTokens = newTokens;
        this.saveTokens();
        this.deleteCommentId = ''; // Close dialog
        await this.updatedComments();
      }
    } catch (err) {
      console.error('Failed to delete comment:', err);
      this.deleteCommentId = ''; // Close dialog even on error
    }
  }

  private handleExternalLinkClick = (e: CustomEvent<string>) => {
    const href = e.detail;
    if (href) {
      this.externalLinkUrl = href;
      this.showExternalLink = true;
    }
  };

  private handleOpenLink = () => {
    if (this.externalLinkUrl) {
      window.open(this.externalLinkUrl, '_blank', 'noopener,noreferrer');
      this.showExternalLink = false;
      this.externalLinkUrl = '';
    }
  };

  private handleCopyLink = async () => {
    if (this.externalLinkUrl) {
      try {
        await navigator.clipboard.writeText(this.externalLinkUrl);
      } catch (err) {
        console.error('Failed to copy link:', err);
      }
      this.showExternalLink = false;
      this.externalLinkUrl = '';
    }
  };
}

declare global {
  interface HTMLElementTagNameMap {
    'yangchun-comment': YangChunComment;
  }
}