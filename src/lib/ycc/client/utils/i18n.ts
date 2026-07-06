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


let currentLanguage: I18nStrings = koKR;

export function t(key: keyof I18nStrings): string {
  return currentLanguage[key] || key;
}

export function initI18n(lang: I18nStrings) {
  currentLanguage = lang;
}