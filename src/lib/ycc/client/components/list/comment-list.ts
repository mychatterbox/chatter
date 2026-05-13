import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { Comment } from '@ziteh/yangchun-comment-shared';
import './comment-list-item';
import { sortCommentsByDate, filterRootComments, findReplyComments, filterReplyComments } from '../../utils/comment';
import { yangChunCommentStyles } from '../yangchun-comment.styles';
import { t } from '../../utils/i18n';

@customElement('comment-list')
export class CommentList extends LitElement {
  static styles = [
    yangChunCommentStyles,
    css`
      :host {
        display: block;
      }
      .reply-comments-container {
        margin-bottom: var(--ycc-spacing-m);
      }
      .no-comments {
        text-align: center;
        color: var(--ycc-text-secondary);
        font-style: italic;
        font-size: 0.9em;
      }
    `,
  ];

  @property({ type: Array }) comments: Comment[] = [];
  @property({ type: String }) author = '';
  @property({ type: String }) post = '';
  @property({ type: Object }) commentTokens = new Map<string, { token: string; timestamp: number }>();
  @property({ type: Object }) previewComment: Comment | null = null;
  @property({ attribute: false }) inlineEditor: unknown = null;
  @property({ type: String }) inlineEditorRootId = '';

  render() {
    return html`
      <div class="reply-comments-container" role="list">
        ${sortCommentsByDate(filterRootComments(this.comments), true).map(
      (comment) => html`
            <comment-list-item
              role="listitem"
              .comment=${comment}
              .author=${this.author}
              .post=${this.post}
              .allComments=${this.comments}
              .replyComments=${sortCommentsByDate(
                this.withPreviewReply(filterReplyComments(this.comments, comment.id), comment.id),
                false,
              )}
              .commentTokens=${this.commentTokens}
              .inlineEditor=${this.inlineEditor}
              .inlineEditorRootId=${this.inlineEditorRootId}
            ></comment-list-item>
          `,
    )}
      </div>
    `;
  }

  private withPreviewReply(replies: Comment[], rootCommentId: string): Comment[] {
    if (!this.previewComment) return replies;

    const previewTargetId = this.previewComment.replyTo;
    const isDirectChild = previewTargetId === rootCommentId;

    if (!isDirectChild) return replies;
    return [...replies, this.previewComment];
  }
}
