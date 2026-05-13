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
import { initI18n, enUS, zhTW, t } from '../utils/i18n';
import type { I18nStrings } from '../utils/i18n';
import { cleanupPowWorker } from '../utils/pow';
import { findRootComment } from '../utils/comment';

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
  @property({ type: String }) lang = 'en-US';
  @property({ type: String }) prePowSalt = 'MAGIC';
  @property({ type: Number }) prePowDifficulty = 2;
  @property({ type: Object, attribute: false }) customMessages: I18nStrings | undefined;

  // @state() private apiService!: ApiService;

  @state() private draft = '';
  @state() private nickname = '';
  @state() private selectedEmoji = '';
  @state() private comments: Comment[] = [];
  @state() private deleteCommentId = '';
  @state() private inputPreviewComment: Comment | null = null;

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

*${t('helpMdItalic')}*

**${t('helpMdBold')}**

- ${t('helpMdList')}

1. ${t('helpMdOrderedList')}

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

    // 인라인(답글/수정) 모드일 때 사용할 에디터 정의
    const inlineEditor = this.isInlineReply 
      ? this.renderCommentInput('before', this.renderCommentInfo()) 
      : null;

    // 루트 레벨(기본 위치)에서 사용할 에디터 정의
    const rootEditor = !this.isInlineReply 
      ? html`${this.renderCommentInfo()}${this.renderCommentInput('after')}`
      : null;

    return html`
      <div class="root" part="root">
        <!-- 원래 위치: 본문 바로 아래 (댓글 리스트 위) -->
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
        @preview-change=${this.handlePreviewChange}
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
        const availableLangs = [enUS, zhTW];
        const selectedLang = availableLangs.find((l) => l.bcp47 === this.lang) || enUS;
        initI18n(selectedLang);
      }
    }

    // Initialize apiService when apiUrl changes
    if (
      (changedProperties.has('apiUrl') ||
        changedProperties.has('prePowDifficulty') ||
        changedProperties.has('prePowSalt')) &&
      this.apiUrl
    ) {
      console.debug('Initializing API service with URL:', this.apiUrl);
      const apiService = createApiService(this.apiUrl, this.prePowDifficulty, this.prePowSalt);
      globalApiService.setInstance(apiService);


    }

    super.willUpdate(changedProperties);
  }

  protected updated(changedProperties: PropertyValues<this>) {
    super.updated(changedProperties);
    // Re-fetch comments when post ID changes
    if (changedProperties.has('post')) {
      console.debug('Post changed to:', this.post);
      this.updatedComments();
    }
  }

  async firstUpdated() {
    console.debug('firstUpdated', 'apiUrl:', this.apiUrl);
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
      console.log('DEBUG: API Response:', response);
      console.log('DEBUG: Number of comments fetched:', response.comments.length);
      console.log('Fetched comments:', response.comments);
      this.comments = response.comments;
      console.log('Updated comments:', this.comments);
      
      // 댓글 업데이트 이벤트 발송 (실시간 카운트 업데이트용)
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
    console.debug('Canceling reply/edit: Resetting input to default position (above list)');
    
    // 1. 모든 입력 내용 초기화
    this.draft = '';
    this.nickname = '';
    this.selectedEmoji = '';
    this.inputPreviewComment = null;
    this.errorMessage = '';

    // 2. 참조 댓글 해제 -> isInlineReply가 false가 되어 에디터가 리스트 하단으로 이동함
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

  private handlePreviewChange = (e: CustomEvent<Comment | null>) => {
    this.inputPreviewComment = e.detail;
  }

  private get replyPreviewComment(): Comment | null {
    if (!this.isReply || !this.referenceComment || !this.inputPreviewComment) return null;

    return {
      ...this.inputPreviewComment,
      id: `preview_reply_${this.referenceComment.id}`,
      replyTo: this.referenceComment.id,
    };
  }

  private get isInlineReply(): boolean {
    // 답글(Reply)이든 수정(Edit)이든 대상 댓글이 있으면 인라인으로 표시
    return !!this.referenceComment;
  }

  private get activeReplyRootId(): string {
    return this.referenceComment?.id || '';
  }

  private async editedSubmit(emoji?: string) {
    if (!this.referenceComment) return;
    if (this.isReply) return;

    const pureDraft = this.draft.trim();
    if (!pureDraft) return;

    const tokenData = this.commentTokens.get(this.referenceComment.id);

    try {
      const ok = await globalApiService
        .getInstance()
        .updateComment(
          this.referenceComment.id,
          this.post,
          this.referenceComment.nickname || '',
          pureDraft,
          emoji,
          tokenData?.token,
          tokenData?.timestamp,
        );

      console.debug('Edit comment ID:', this.referenceComment.id, ok);
      this.draft = '';
      this.inputPreviewComment = null;
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

    const pureDraft = this.draft.trim();
    if (!pureDraft) return;

    const nickname = this.nickname.trim() || undefined;
    const replyTo =
      this.referenceComment && this.referenceComment.id && this.isReply
        ? this.referenceComment.id
        : undefined;

    console.log('handleCommentSubmit called with post:', this.post, 'replyTo:', replyTo);
    try {
      console.debug('Submitting comment - post:', this.post, 'replyTo:', replyTo);
      const result = await globalApiService
        .getInstance()
        .addComment(this.post, nickname, pureDraft, replyTo, emoji);
      console.log('addComment result:', result);
      if (result) {
        console.debug('Added comment ID:', result.id, 'replyTo:', replyTo);
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
        this.inputPreviewComment = null;
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
    console.debug('Reply to comment ID:', commentId);

    const refComment = this.comments.find((cmt) => cmt.id === commentId);
    if (!refComment) {
      this.referenceComment = null;
      return;
    }
    if (!this.isReply) {
      this.draft = ''; // If was editing, cancel editing first
      this.inputPreviewComment = null;
    }
    this.referenceComment = refComment;
    this.isReply = true;
    this.selectedEmoji = '';
    await this.updateComplete;
    this.commentInput?.focus();
  }

  private async handleCommentDelete(e: CustomEvent<string>) {
    const commentId = e.detail;
    console.debug('Delete comment ID:', commentId);
    this.deleteCommentId = commentId;
  }

  private async handleCommentEdit(e: CustomEvent<string>) {
    const commentId = e.detail;
    console.debug('Edit comment ID:', commentId);

    const refComment = this.comments.find((cmt) => cmt.id === commentId);
    if (!refComment) {
      this.referenceComment = null;
      return;
    }
    this.referenceComment = refComment;
    this.isReply = false;
    this.draft = refComment.msg || '';
    this.selectedEmoji = refComment.emoji || '';
    this.inputPreviewComment = null;
    await this.updateComplete;
    this.commentInput?.focus();
  }

  private handleAuthStatusChange = (e: CustomEvent<boolean>) => {
    this.isAdmin = e.detail;
  };

  private async handleDeleteComment() {
    if (!this.deleteCommentId) return;
    const commentId = this.deleteCommentId;
    console.debug('Delete comment ID:', commentId);
    console.log('Deleting comment ID:', commentId, 'from comments:', this.comments);
    const commentExists = this.comments.find(c => c.id === commentId);
    console.log('Comment to delete exists in local comments:', commentExists);

    const tokenData = this.commentTokens.get(commentId);
    if (!tokenData) {
      console.error('No token found for comment:', commentId);
      this.deleteCommentId = '';
      return;
    }

    try {
      const ok = await globalApiService.getInstance().deleteComment(commentId, this.post, tokenData.token, tokenData.timestamp);
      if (ok) {
        console.debug('Deleted comment ID:', commentId);
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
        console.log('Link copied to clipboard');
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
