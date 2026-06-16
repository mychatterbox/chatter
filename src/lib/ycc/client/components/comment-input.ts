import { LitElement, css, html, type PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { yangChunCommentStyles } from './yangchun-comment.styles';
import './list/comment-list-item';
import type { Comment } from '@ziteh/yangchun-comment-shared';
import { t } from '../utils/i18n';

@customElement('comment-input')
export class CommentInput extends LitElement {
  static shadowRootOptions = {
    ...LitElement.shadowRootOptions,
  };

  static styles = [
    yangChunCommentStyles,
    css`
      :host {
        display: block;
      }
      .comment-input-container {
        position: relative;
        z-index: 1;
        background-color: var(--ycc-bg-color);
      }
      comment-info::part(info-bar) {
        margin-left: 0;
        position: relative;
        z-index: 1;
        background-color: var(--ycc-bg-color);
      }
      .draft-container {
        display: flex;
        flex-direction: column;
        gap: var(--ycc-spacing-s);
        padding: var(--ycc-spacing-s);
      }
      textarea {
        min-height: 100px;
        resize: vertical;
        border: none;
        resize: none;
        background-color: var(--ycc-bg-color);
        scrollbar-width: thin;
        scrollbar-color: var(--ycc-border-color) transparent;
        color: inherit;
        font-family: inherit;
      }
      textarea::-webkit-scrollbar {
        width: 6px;
      }
      textarea::-webkit-scrollbar-track {
        background: transparent;
      }
      textarea::-webkit-scrollbar-thumb {
        background-color: var(--ycc-border-color);
        border-radius: 3px;
      }
      textarea::-webkit-scrollbar-thumb:hover {
        background-color: var(--ycc-text-secondary);
      }
      textarea::placeholder,
      input::placeholder {
        color: var(--ycc-placeholder-color);
        opacity: 1;
        font-size: 0.9em;
      }
      .actions {
        display: flex;
        justify-content: flex-end;
        gap: var(--ycc-spacing-s);
      }
      .message-row {
        border: 1px solid var(--ycc-border-color);
        border-bottom: none;
        border-radius: var(--ycc-radius) var(--ycc-radius) 0 0;
        min-height: calc(100px + 2 * var(--ycc-spacing-s));
        transition: border-color 0.15s ease;
      }
      .controls-row {
        border: 1px solid var(--ycc-border-color);
        border-radius: 0 0 var(--ycc-radius) var(--ycc-radius);
        display: flex;
        justify-content: space-between;
        gap: var(--ycc-spacing-s);
        transition: border-color 0.15s ease;
      }
      .comment-input-container:focus-within .message-row,
      .comment-input-container:focus-within .controls-row {
        border-color: var(--ycc-border-focus-color, color-mix(in oklch, var(--color-border) 50%, gray));
      }
      .nickname-input {
        flex: 1;
        border: none;
        outline: none;
        background-color: var(--ycc-bg-color);
        font-size: 10px;
      }
      .nickname-wrapper {
        flex: 1;
        display: flex;
        align-items: center;
        gap: var(--ycc-spacing-s);
        font-size: 0.9em;
      }

      /* ─── 이모지 셀렉터 ─── */
      .emoji-selector {
        display: grid;
        grid-template-columns: repeat(10, minmax(0, 1fr));
        margin-top: var(--ycc-spacing-s);
        margin-bottom: var(--ycc-spacing-s);
        position: relative; /* 팝업 anchor */
      }
      .emoji-btn {
        padding: 0;
        background: var(--ycc-bg-color);
        cursor: pointer;
        transition: all 0.2s;
        display: flex;
        align-items: center;
        justify-content: center;
        min-width: 0;
        font-size: 2.5em;
      }
      .emoji-btn:hover {
        background: var(--ycc-bg-secondary);
        border-color: var(--ycc-primary-color);
      }
      .emoji-btn.active {
        background: var(--ycc-primary-color);
        color: white;
        border-color: var(--ycc-primary-color);
      }

      /* ─── ⋯ 버튼 래퍼 (팝업 anchor) ─── */
      .more-emoji-wrapper {
        position: relative;
        display: flex;
    justify-content: center;
      }

      /* ─── 팝업 컨테이너 ─── */
      .emoji-picker-popup {
        display: none;
        position: absolute;
        bottom: calc(100% + 6px);
        right: 0;
        z-index: 1100;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.18);
        border-radius: 12px;
        overflow: hidden;
      }
      .emoji-picker-popup.open {
        display: block;
        animation: fadeIn 0.35s ease;
      }

      /* emoji-picker 기본 크기 및 스타일 */
      .emoji-picker-popup emoji-picker {
        width: 100%;
        height: 100%;
        --emoji-size: 2.5rem;
      }

      /* ─── preview ─── */
      .preview-label {
        margin-top: var(--ycc-spacing-m);
        margin-bottom: var(--ycc-spacing-xs);
        margin-left: 0;
        font-weight: 700;
        color: #ef4444;
        animation: fadeIn 1s ease;
      }
      .preview-container {
        // border: 1px solid var(--ycc-border-color);
        // padding-top: var(--ycc-spacing-s);
        animation: fadeIn 1s ease;
      }

      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(6px); }
        to   { opacity: 1; transform: translateY(0); }
      }

      /* ─── 카운터 ─── */
      .char-counter {
        font-size: 0.75rem;
        color: var(--ycc-text-secondary);
        white-space: nowrap;
      }
      .message-counter {
        text-align: right;
      }

      /* ─── 허니팟 ─── */
      .input-email {
        position: absolute;
        left: -9999px;
        width: 1px;
        height: 1px;
        opacity: 0;
        pointer-events: none;
        tab-index: -1;
      }

.emoji-picker-popup {
  width: min(768px, calc(100dvw - 2.5em));
  height: 470px;
  // height: 768px;
}

@media (max-width: 640px) {
  .emoji-picker-popup {
    width: min(768px, calc(100dvw - 2em));
  }
}

      /* ─── 태블릿/중간 크기 (420px 초과 ~ 768px 이하) ─── */
      @media (min-width: 421px) and (max-width: 768px) {
        // .emoji-picker-popup {
        //   /* 가로폭을 화면에 맞춤 (최대 768px까지) */
        //   width: calc(100vw - 40px);
        //   /* 380:400 비율 유지 (height = width * 400/380) */
        //   // height: calc((100vw - 40px) * 1.0526);
        //   max-width: 768px;
        //   max-height: 468px;
        //   min-width: 320px;
        //   min-height: 337px;
        // }
        .emoji-btn {
          font-size: 2rem;

        }
        .emoji-picker-popup emoji-picker { --emoji-size: 2rem;       }
      }

      /* ─── 모바일 (420px 이하) ─── */
      @media (max-width: 420px) {
        textarea { min-height: 100px; }
        .draft-container { padding: 0; }
        .focus-overlay {
          display: block;
          position: fixed;
          inset: 0;
          z-index: 999;
          backdrop-filter: blur(1px);
          -webkit-backdrop-filter: blur(1px);
          pointer-events: none;
        }

        .comment-input-container.mobile-focus {
          z-index: 1000;

          // background-color: var(--ycc-bg-color);
          // box-shadow: 0 4px 18px rgba(0, 0, 0, 0.12);
        }
        .emoji-btn {
          width: 100%;
          height: 36px;
          font-size: 1.5rem;
          box-sizing: border-box;
        }
        /* 모바일에서는 팝업을 화면 하단에 고정하고 전체 너비로 */
        .emoji-picker-popup.open {
          position: fixed;
          bottom: 0;
          right: 0;
          left: 0;
          width: 100%;
          height: 50vh;
          max-height: 450px;
          border-radius: 12px 12px 0 0;
        }
        /* 모바일에서 emoji-picker 작은 화면 대응 */
        .emoji-picker-popup emoji-picker {
          --num-columns: 6;
          --emoji-size: 2rem;
          --category-emoji-size: 1.25rem;
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
      }
    `,
  ];

  static readonly MAX_NICKNAME_LENGTH: number = 25;
  static readonly MAX_MESSAGE_LENGTH: number = 1000;

  @property({ type: String }) draft = '';
  @property({ type: String }) nickname = '';
  @property({ type: String }) adminName = '';
  @property({ type: Boolean }) isAdmin = false;
  @property({ type: Boolean }) hidePreview = false;
  @property({ type: String }) previewPlacement: 'before' | 'after' = 'after';
  @property({ type: String }) previewReplyTo = '';
  @property({ attribute: false }) beforeInputContent: unknown = null;
  @property({ type: String }) selectedEmoji = '';

  @state() protected previewComment: Comment | null = null;
  @state() private honeypot = '';
  @state() private isFocused = false;
  @state() private isPickerOpen = false;
  @state() private isDarkMode = false;

  private previewResizeObserver: ResizeObserver | null = null;
  private isAutoScrolling = false;

  // ⋯ 를 제외한 고정 이모지 목록
  private readonly emojis = ['😀', '🤬', '❤️', '👍🏼', '🙏🏼', '❗️', '❓️', '🐱', '🐶'];

  // emoji-picker-element 스크립트 로드 (한 번만)
  private static pickerScriptLoaded = false;
  private static loadPickerScript() {
    if (CommentInput.pickerScriptLoaded) return;
    CommentInput.pickerScriptLoaded = true;
    const script = document.createElement('script');
    script.type = 'module';
    script.src = 'https://cdn.jsdelivr.net/npm/emoji-picker-element@^1/index.js';
    document.head.appendChild(script);
  }

  // MutationObserver로 dark 클래스 변경 감지
  private themeObserver: MutationObserver | null = null;

  connectedCallback() {
    super.connectedCallback();
    CommentInput.loadPickerScript();

    // 초기 다크 모드 상태 확인 (document.documentElement의 dark 클래스 기준)
    this.isDarkMode = document.documentElement.classList.contains('dark');

    // MutationObserver로 html 요소의 class 변경 감지
    this.themeObserver = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          this.isDarkMode = document.documentElement.classList.contains('dark');
        }
      }
    });

    this.themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    // 'device' 모드에서 시스템 테마 변경 감지
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (localStorage.getItem('theme') === 'device') {
        this.isDarkMode = e.matches;
      }
    });

    // Shadow DOM 외부 클릭 감지 (팝업 닫기)
    this._onOutsideClick = this._onOutsideClick.bind(this);
    document.addEventListener('pointerdown', this._onOutsideClick);

    // ResizeObserver로 미리보기 컨테이너 크기 변화 감지
    this.previewResizeObserver = new ResizeObserver(() => {
      this.updateComplete.then(() => {
        const previewContainer = this.shadowRoot?.querySelector('.preview-container');
        if (!previewContainer) return;

        const rect = previewContainer.getBoundingClientRect();
        
        // 미리보기가 화면 아래에 가려져 있으면 자동 스크롤
        if (rect.bottom > window.innerHeight) {
          this.isAutoScrolling = true;
          previewContainer.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'nearest' // 최소한의 스크롤만 수행
          });
          // 스크롤 완료 후 플래그 리셋
          setTimeout(() => {
            this.isAutoScrolling = false;
          }, 500);
        }
      });
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    // Observer 정리
    if (this.themeObserver) {
      this.themeObserver.disconnect();
    }

    if (this.previewResizeObserver) {
      this.previewResizeObserver.disconnect();
    }

    document.removeEventListener('pointerdown', this._onOutsideClick);
  }

  private _onOutsideClick(e: PointerEvent) {
    if (!this.isPickerOpen) return;
    // Shadow DOM 내부 클릭이면 무시
    const path = e.composedPath();
    if (path.includes(this)) return;
    this.isPickerOpen = false;
  }

  render() {
    const preview = this.renderPreview();

    return html`
      ${this.isFocused ? html`<div class="focus-overlay"></div>` : null}
      ${this.previewPlacement === 'before' ? preview : null}
      <div
        part="input-container"
        class="comment-input-container ${this.isFocused ? 'mobile-focus' : ''}"
        @focusout=${this.handleFocusOut}
      >
        ${this.beforeInputContent}
        <div class="message-row">
          <div class="draft-container">
            <textarea
              part="textarea"
              .value=${this.draft}
              @focus=${this.handleFocusIn}
              @input=${this.handleDraftInput}
              placeholder=${t('messagePlaceholder')}
              aria-label=${t('messagePlaceholder')}
              aria-describedby="message-counter"
              maxlength=${CommentInput.MAX_MESSAGE_LENGTH}
            ></textarea>
            <div class="char-counter message-counter" id="message-counter" aria-live="polite">
              ${this.draft.length} / ${CommentInput.MAX_MESSAGE_LENGTH}
            </div>
            <input
              type="email"
              name="email"
              class="input-email"
              .value=${this.honeypot}
              @input=${this.handleHoneypotInput}
              tabindex="-1"
              aria-hidden="true"
              autocomplete="off"
            />
          </div>
        </div>

        <div class="controls-row">
          <div class="nickname-wrapper">
            <input
              part="nickname"
              class="nickname-input"
              .value=${this.isAdmin ? 'Admin' : this.nickname}
              @focus=${this.handleFocusIn}
              @input=${this.handleNicknameInput}
              type="text"
              placeholder=${t('nicknamePlaceholder')}
              aria-label=${t('nicknamePlaceholder')}
              aria-describedby="nickname-counter"
              ?disabled=${this.isAdmin}
              maxlength=${CommentInput.MAX_NICKNAME_LENGTH}
            />
            <span class="char-counter" id="nickname-counter" aria-live="polite">
              ${this.nickname.length} / ${CommentInput.MAX_NICKNAME_LENGTH}
            </span>
          </div>
          <div class="actions">
            <button
              part="btn-cancel"
              @pointerdown=${this.preventMobileFocus}
              @click=${this.handleCancel}
              ?disabled=${!this.shouldShowLivePreview()}
            >
              ${t('cancel')}
            </button>
            <button
              part="btn-submit"
              @pointerdown=${this.preventMobileFocus}
              @click=${this.handleSubmit}
              ?disabled=${!this.isValidComment()}
            >
              ${t('submit')}
            </button>
          </div>
        </div>

        <!-- 이모지 셀렉터 행 -->
        <div class="emoji-selector">
          <!-- 고정 이모지 9개 -->
          ${this.emojis.map(
      (e) => html`
              <button
                class="emoji-btn ${this.selectedEmoji === e ? 'active' : ''}"
                @click=${() => this.handleEmojiClick(e)}
                title=${e}
              >
                ${e}
              </button>
            `,
    )}

          <!-- ⋯ 버튼 + 팝업 -->
          <div class="more-emoji-wrapper">
            <button
              class="emoji-btn ${this.isPickerOpen ? 'active' : ''}"
              @click=${this.handleMoreEmojiClick}
              title="더 많은 이모지"
              style="color: inherit;"
            >
              
            ···
            </button>

            <div class="emoji-picker-popup ${this.isPickerOpen ? 'open' : ''}">
              <!-- emoji-picker-element: document.documentElement의 dark 클래스 기준으로 다크 모드 적용 -->
              <emoji-picker
                class="${this.isDarkMode ? 'dark' : 'light'}"
                @emoji-click=${this.handlePickerEmojiClick}
              ></emoji-picker>
            </div>
          </div>
        </div>

        ${this.previewPlacement === 'after' ? preview : null}
      </div>
    `;
  }

  private renderPreview() {
    if (!this.previewComment || this.hidePreview) return null;

    return html`
      <div class="preview-label" part="preview">${t('preview')}</div>
      <div class="preview-container" part="preview">
        <comment-list-item
          .comment=${this.previewComment}
          .author=${this.adminName}
        ></comment-list-item>
      </div>
    `;
  }

  // ─── 팝업 토글 ───
  private handleMoreEmojiClick(e: Event) {
    e.stopPropagation();
    this.isPickerOpen = !this.isPickerOpen;
  }

  // ─── emoji-picker-element 선택 이벤트 ───
  private handlePickerEmojiClick(e: CustomEvent) {
    const emoji: string = e.detail?.unicode ?? '';
    if (!emoji) return;
    this.selectedEmoji = emoji;
    this.isPickerOpen = false;

    // 팝업 닫힌 후 포커스를 textarea로 복원하여 mobile-focus 상태 유지
    this.updateComplete.then(() => {
      const textarea = this.shadowRoot?.querySelector('textarea');
      textarea?.focus();
    });

    this.dispatchEvent(
      new CustomEvent('emoji-change', {
        detail: this.selectedEmoji,
        bubbles: true,
        composed: true,
      }),
    );
  }

  // ─── 기존 고정 이모지 클릭 ───
  private handleEmojiClick(e: string) {
    this.selectedEmoji = this.selectedEmoji === e ? '' : e;
    this.dispatchEvent(
      new CustomEvent('emoji-change', {
        detail: this.selectedEmoji,
        bubbles: true,
        composed: true,
      }),
    );
  }

  // ─── 나머지 기존 메서드 (변경 없음) ───

  private createPreviewComment(): Comment {
    const nickname = this.nickname.trim() || t('anonymous');
        const processedDraft = this.draft
      .split('\n')
      .map(line => (line.length > 0 && !line.endsWith('  ')) ? line + '  ' : line)
      .join('\n');
      
    return {
      msg: processedDraft,
      nickname: nickname,
      pubDate: Date.now(),
      id: `preview_${Date.now()}`,
      replyTo: this.previewReplyTo || undefined,
      isAdmin: this.isAdmin,
      emoji: this.selectedEmoji || undefined,
    };
  }

  private hasUserContent(): boolean {
    return (
      this.draft.trim().length > 0 ||
      this.nickname.trim().length > 0 ||
      this.selectedEmoji.length > 0
    );
  }

  private shouldShowLivePreview(): boolean {
    return this.hasUserContent();
  }

  willUpdate(changedProperties: PropertyValues<this>) {
    // 렌더링 전에 상태를 계산하여 불필요한 재업데이트 방지
    if (
      changedProperties.has('draft') ||
      changedProperties.has('nickname') ||
      changedProperties.has('selectedEmoji')
    ) {
      const newPreview = this.shouldShowLivePreview() ? this.createPreviewComment() : null;
      this.previewComment = newPreview;
      // previewComment가 바뀔 때 바로 부모에게 알림
      this.dispatchEvent(
        new CustomEvent('preview-change', {
          detail: newPreview,
          bubbles: true,
          composed: true,
        }),
      );
    }
  }

  updated(changedProperties: PropertyValues<this>) {
    // 렌더링 후 미리보기 컨테이너 감지 설정
    if ((changedProperties as Map<string, any>).has('previewComment')) {
      if (this.previewComment) {
        // 미리보기가 추가되면 ResizeObserver 활성화
        this.updateComplete.then(() => {
          const previewContainer = this.shadowRoot?.querySelector('.preview-container');
          if (previewContainer && this.previewResizeObserver) {
            this.previewResizeObserver.observe(previewContainer);
          }
        });
      } else {
        // 미리보기가 제거되면 관찰 중지
        if (this.previewResizeObserver) {
          this.previewResizeObserver.disconnect();
        }
      }
    }
  }



  private isValidComment(): boolean {
    const msgLength = this.draft.trim().length;
    const nicknameLength = this.nickname.trim().length;
    return (
      msgLength > 0 &&
      msgLength <= CommentInput.MAX_MESSAGE_LENGTH &&
      nicknameLength <= CommentInput.MAX_NICKNAME_LENGTH
    );
  }

  private handleDraftInput(e: Event) {
    const target = e.target as HTMLTextAreaElement;
    this.draft = target.value.slice(0, CommentInput.MAX_MESSAGE_LENGTH);

    // 실제 입력 시작 시에만 mobile-focus 활성화
    this.isFocused = this.hasUserContent();

    this.dispatchEvent(
      new CustomEvent('draft-change', {
        detail: this.draft,
        bubbles: true,
        composed: true,
      }),
    );
  }

  private handleNicknameInput(e: Event) {
    const target = e.target as HTMLInputElement;
    this.nickname = target.value.slice(0, CommentInput.MAX_NICKNAME_LENGTH);

    this.isFocused = this.hasUserContent();

    this.dispatchEvent(
      new CustomEvent('nickname-change', {
        detail: this.nickname,
        bubbles: true,
        composed: true,
      }),
    );
  }

  private handleHoneypotInput(e: Event) {
    const target = e.target as HTMLInputElement;
    this.honeypot = target.value;
  }


  private preventMobileFocus(e: PointerEvent) {
    // 모바일에서 버튼 터치 시 textarea focus 복원 방지
    e.preventDefault();
  }

  private async handleFocusIn() {
    if (!this.hasUserContent()) {
      return;
    }

    // mobile fixed 모드 활성화
    this.isFocused = true;

    // DOM 업데이트 대기
    await this.updateComplete;

    // 컨테이너 전체 기준으로 스크롤
    const container =
      this.shadowRoot?.querySelector('.comment-input-container');

    container?.scrollIntoView({
      block: 'start',
      behavior: 'instant',
    });
  }

  private handleFocusOut() {
    if (!this.shadowRoot?.activeElement) this.isFocused = false;
  }

  private async handleCancel(e: Event) {
    e.preventDefault();
    e.stopPropagation();

    // 아무 입력 없으면 완전 무시
    if (!this.hasUserContent()) {
      return;
    }

    const textarea =
      this.shadowRoot?.querySelector('textarea');

    const nicknameInput =
      this.shadowRoot?.querySelector('.nickname-input') as HTMLInputElement | null;

    // 먼저 blur 처리
    textarea?.blur();
    nicknameInput?.blur();

    // mobile-focus 즉시 해제
    this.isFocused = false;

    // picker 닫기
    this.isPickerOpen = false;

    // 렌더 안정화 대기
    await this.updateComplete;

    // 상태 초기화
    this.draft = '';
    this.nickname = '';
    this.selectedEmoji = '';
    this.previewComment = null;

    // preview 제거 이벤트
    this.dispatchEvent(
      new CustomEvent('preview-change', {
        detail: null,
        bubbles: true,
        composed: true,
      }),
    );

    // cancel 이벤트
    this.dispatchEvent(
      new CustomEvent('comment-cancel', {
        bubbles: true,
        composed: true,
      }),
    );
  }

  private handleSubmit(e?: Event) {
    e?.preventDefault();

    // 입력 없으면 아무 동작 안 함
    if (!this.hasUserContent()) return;

    if (this.honeypot !== '') return;
    this.previewComment = null;
    this.dispatchEvent(
      new CustomEvent('preview-change', {
        detail: null,
        bubbles: true,
        composed: true,
      }),
    );
    this.dispatchEvent(
      new CustomEvent('comment-submit', {
        detail: { emoji: this.selectedEmoji },
        bubbles: true,
        composed: true,
      }),
    );
  }
}