const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["src/**/*.{astro,svelte,ts}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [['"Pretendard"', ...defaultTheme.fontFamily.sans], { fontFeatureSettings: '"cv12"' }],
        mono: [['"CascadiaCode"', ...defaultTheme.fontFamily.mono], { fontFeatureSettings: '"zero"' }],
      },
      colors: {
        'custom-dark': '#121212',  // 다크모드 배경색
        'custom-light': '#f5f7f9',  // 다크모드 글자색
      },
      typography: {
        DEFAULT: {
          css: {
            'code::before': {
              content: 'none', // 백틱 제거
            },
            'code::after': {
              content: 'none', // 백틱 제거
            },
            blockquote: {
              fontStyle: 'normal', // 이탤릭 효과 제거
              quotes: 'none', // 따옴표 제거
            },
            'code': {
              color: '#d95d5d', // 인라인 코드 색상 (라이트 모드)
              fontFamily: 'inherit',
              fontSize: '1em',
            },
            'pre code': {
              color: 'inherit', // 코드 블록 색상 (기본값 유지)
            },
            '.dark code': {
              color: '#d95d5d', // 인라인 코드 색상 (다크 모드)
            },
            '.dark pre code': {
              color: 'inherit', // 코드 블록 색상 (기본값 유지)
            },
            // hr 스타일 추가
            hr: {
              marginTop: '2rem', // my-8 (2rem)
              marginBottom: '2rem', // my-8 (2rem)
              borderTopWidth: '1px', // border-t-2
              borderColor: 'currentColor',
            },
          },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
