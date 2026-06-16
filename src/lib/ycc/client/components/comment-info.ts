import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { yangChunCommentStyles } from './yangchun-comment.styles';
import type { Comment } from '@ziteh/yangchun-comment-shared';
import { t } from '../utils/i18n';

@customElement('comment-info')
export class CommentInfo extends LitElement {
  static styles = [
    yangChunCommentStyles,
    css`
      :host {
        display: block;
      }
      .info-bar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 4px 0;
        // background-color: var(--ycc-bg-secondary);
        // border-radius: var(--ycc-radius);
        // margin-bottom: var(--ycc-spacing-s);
        font-size: 0.9em;
        line-height: 1rem;
      }
      .reference-comment-info {
        display: flex;
        align-items: center;
        gap: var(--ycc-spacing-s);
        min-width: 0;
      }
      .actions {
        display: flex;
        gap: var(--ycc-spacing-s);
        flex-shrink: 0;
      }
      .text-btn {
        white-space: nowrap;
      }
      .reference-comment-info span {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .info-bar.error {
        justify-content: flex-start;
        gap: var(--ycc-spacing-s);
      }
      .error-msg {
        color: var(--ycc-error-color);
      }
    `,
  ];

  @property({ type: Object }) comment: Comment | null = null;
  @property({ type: Boolean }) isReply = true; // true: reply, false: edit
  @property({ type: String }) errorMessage = '';

  render() {
    if (this.errorMessage) {
      return html`
        <div class="info-bar error" part="info-bar info-bar-error">
          <span class="error-msg">${this.errorMessage}</span>
          <button class="text-btn" @click=${this.handleErrorClear}>${t('close')}</button>
        </div>
      `;
    }

    return html`
      <div class="info-bar" part="info-bar">
        ${this.comment
          ? html`
              <div class="reference-comment-info">
                ${this.isReply
                  ? html`<span
                      >${t('replyingTo')}<strong
                        >${this.comment.nickname || t('anonymous')}${' #' +
                        this.comment.id}</strong
                      ></span
                    >`
                  : html`<span>${t('editing')}<strong>${this.comment.id}</strong></span>`}
                <button 
  class="text-btn" 
  @click=${this.handleCancel} 
  style="color: #dd4444; font-weight: bold;"
>
  ${t('cancel')}
</button>
              </div>
            `
          : html`<div></div>`}
        <div class="actions" part="actions">
          <button class="text-btn" @click=${this.handleHelp}>${t('help')}</button>
        </div>
      </div>
    `;
  }



  private handleHelp() {
    this.dispatchEvent(
      new CustomEvent('help-open', {
        bubbles: true,
        composed: true,
      }),
    );
  }



  private handleErrorClear() {
    this.dispatchEvent(
      new CustomEvent('error-clear', {
        bubbles: true,
        composed: true,
      }),
    );
  }

  private handleCancel() {
    if (!this.comment?.id) return;

    this.dispatchEvent(
      new CustomEvent('reference-comment-cancel', {
        detail: this.comment.id,
        bubbles: true,
        composed: true,
      }),
    );
  }
}
