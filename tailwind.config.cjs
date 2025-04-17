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
        'custom-dark': '#121212',
        'custom-light': '#f5f7f9',
      },
      typography: {
        DEFAULT: {
          css: {
            'code': {
              // color: '#d95d5d', // 인라인 코드 색상 (라이트 모드)
              fontFamily: 'inherit',
              fontSize: '1em',
            },
            blockquote: {
              fontStyle: 'normal', // 이탤릭 효과 제거
              quotes: 'none', // 따옴표 제거
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
