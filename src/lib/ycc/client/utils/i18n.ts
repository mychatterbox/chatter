export interface I18nStrings {
  // https://developer.mozilla.org/en-US/docs/Glossary/BCP_47_language_tag
  bcp47: string;

  anonymous: string;
  submit: string;
  preview: string;
  edit: string;
  edited: string;
  editing: string;
  delete: string;
  reply: string;
  replyTo: string;
  replyingTo: string;
  help: string;
  cancel: string;
  close: string;
  author: string;
  me: string;

  messagePlaceholder: string;
  nicknamePlaceholder: string;

  confirmDelete: string;
  confirmDeleteDesc1: string;
  confirmDeleteDesc2: string;

  helpDesc: string;
  helpMdLink: string;
  helpMdImage: string;
  helpMdItalic: string;
  helpMdBold: string;
  helpMdList: string;
  helpMdOrderedList: string;
  helpMdInlineCode: string;
  helpMdCodeBlock: string;
  helpMdNoHtml: string;

  noComments: string;
  showMore: string;
  showLess: string;

  externalLinkWarning: string;
  externalLinkDesc: string;
  openLink: string;
  copyLink: string;
  unlikeLimitReached: string;
}

export const enUS: I18nStrings = {
  bcp47: 'en-US',
  anonymous: 'Anonymous',
  submit: 'Submit',
  preview: 'Preview',
  edit: 'Edit',
  edited: 'Edited',
  editing: 'Editing: ',
  delete: 'Delete',
  reply: 'Reply',
  replyTo: 'Reply to',
  replyingTo: 'Replying to: ',
  help: 'Help',
  cancel: 'Cancel',
  close: 'Close',
  author: 'Author',
  me: 'Me',
  messagePlaceholder: 'Write a comment...\nSupports Markdown',
  nicknamePlaceholder: 'Nickname (optional)',
  confirmDelete: 'Confirm delete',
  confirmDeleteDesc1: 'Are you sure you want to delete this comment? Comment ID: ',
  confirmDeleteDesc2: 'This action cannot be undone!',
  helpDesc: `This is a simple comment system — you can post comments and reply to others. You may preview your content before posting.
  You can fill in a nickname to display it with your comment, or leave it blank to remain anonymous.
  After posting, you can edit or delete your own comment within two minutes without leaving or refreshing the page.
  Comment content supports basic Markdown and does not support HTML.`,
  helpMdLink: 'Link',
  helpMdImage: 'Image',
  helpMdItalic: 'Italic',
  helpMdBold: 'Bold',
  helpMdList: 'List item',
  helpMdOrderedList: 'Ordered list item',
  helpMdInlineCode: 'Inline code',
  helpMdCodeBlock: 'Code block',
  helpMdNoHtml: 'No HTML',
  noComments: 'No comments yet',
  showMore: 'Show more',
  showLess: 'Show less',

  externalLinkWarning: 'External Link Warning',
  externalLinkDesc: 'You are about to leave this site and visit:',
  openLink: 'Open Link',
  copyLink: 'Copy Link',
  unlikeLimitReached: 'You can only unlike a comment within 24 hours of liking it.',
};

export const zhTW: I18nStrings = {
  bcp47: 'zh-TW',
  anonymous: '匿名',
  submit: '發送',
  preview: '預覽',
  edit: '編輯',
  edited: '已編輯',
  editing: '正在編輯：',
  delete: '刪除',
  reply: '回覆',
  replyTo: '回覆給',
  replyingTo: '正在回覆：',
  cancel: '取消',
  close: '關閉',
  help: '幫助',
  author: '作者',
  me: '我',
  messagePlaceholder: '請輸入留言...\n支援 Markdown',
  nicknamePlaceholder: '暱稱（選填）',
  confirmDelete: '確認刪除',
  confirmDeleteDesc1: '確定要刪除此留言嗎？留言 ID: ',
  confirmDeleteDesc2: '此操作無法復原！',
  helpDesc: `這是一個簡單的留言板，你可以發表留言、回覆他人的留言，發表前可以先預覽內容。
留言時可以填寫暱稱，系統會顯示您輸入的名稱，或留空保持匿名。
發表留言後，在不離開或重新整理頁面的情況下，可以編輯或刪除自己兩分鐘內的留言。
留言內容支援基本 Markdown 語法，不支援 HTML。`,
  helpMdLink: '連結',
  helpMdImage: '圖片',
  helpMdItalic: '斜體',
  helpMdBold: '粗體',
  helpMdList: '清單項目',
  helpMdOrderedList: '有序清單項目',
  helpMdInlineCode: '行內程式碼',
  helpMdCodeBlock: '程式碼區塊',
  helpMdNoHtml: '不支援 HTML',
  noComments: '目前還沒有留言',
  showMore: '顯示全部',
  showLess: '折疊',

  externalLinkWarning: '外部連結警告',
  externalLinkDesc: '你即將離開本站並訪問：',
  openLink: '開啟連結',
  copyLink: '複製連結',
  unlikeLimitReached: '點讚後 24 小時內可以取消讚。',
};

export const koKR: I18nStrings = {
  bcp47: "ko-KR",
  anonymous: "익명",
  submit: "등록",
  preview: "미리보기",
  edit: "수정",
  edited: "수정됨",
  editing: "수정 중: ",
  delete: "삭제",
  reply: "답글",
  replyTo: "답글 대상",
  replyingTo: "답글 대상: ",
  help: "도움말",
  cancel: "취소",
  close: "닫기",
  author: "관리자",
  me: "나",
  messagePlaceholder:
    "· 닉네임과 이모지는 선택 옵션입니다.\n· 간단한 Markdown을 지원합니다 (도움말 참고)\n· 댓글과 좋아요는 24시간 동안 수정/삭제/취소할 수 있습니다.",
  nicknamePlaceholder: "닉네임 (선택)",
  confirmDelete: "삭제 확인",
  confirmDeleteDesc1: "이 댓글을 삭제하시겠습니까? 댓글 ID: ",
  confirmDeleteDesc2: "이 작업은 되돌릴 수 없습니다!",
  helpDesc:
    "등록 전 미리보기로 내용을 확인할 수 있습니다.\n닉네임을 입력하면 입력한 이름이 댓글에 그대로 표시됩니다. 비워두면 익명으로 표시됩니다.\n댓글 작성 후 24시간 동안 수정하거나 삭제할 수 있습니다.\n댓글 내용은 기본 Markdown을 지원하며 HTML은 지원하지 않습니다.",
  helpMdLink: "링크",
  helpMdImage: "이미지",
  helpMdItalic: "기울임",
  helpMdBold: "굵게",
  helpMdList: "목록 항목",
  helpMdOrderedList: "순서 목록 항목",
  helpMdInlineCode: "인라인 코드",
  helpMdCodeBlock: "코드 블록",
  helpMdNoHtml: "HTML 미지원",
  noComments: "아직 댓글이 없습니다",
  showMore: "더 보기",
  showLess: "접기",
  externalLinkWarning: "외부 링크 경고",
  externalLinkDesc: "이 사이트를 떠나 다음 주소를 방문합니다:",
  openLink: "링크 열기",
  copyLink: "링크 복사",
  unlikeLimitReached: "좋아요를 누른 후 24시간 이내에만 취소할 수 있습니다.",
};


let currentLanguage: I18nStrings = enUS;

export function t(key: keyof I18nStrings): string {
  return currentLanguage[key] || key;
}

export function initI18n(lang: I18nStrings) {
  currentLanguage = lang;
}