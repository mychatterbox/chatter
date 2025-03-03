const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["src/**/*.{astro,svelte,ts}"],
    theme: {
    extend: {
      fontFamily: {
        // cv12 : ... 를 한국어화, zero = slash 0
        sans: [['"Pretendard"', ...defaultTheme.fontFamily.sans], { fontFeatureSettings: '"cv12"'  },],
        mono: [['"CascadiaCode"', ...defaultTheme.fontFamily.mono],   { fontFeatureSettings: '"zero"'  },],
      },
      colors: {     // 모바일 기기 상단의 배경색
        'custom-dark': '#121212', 
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
              color: '#cc2323', // 인라인 코드 색상 (라이트 모드)
              fontFamily: 'inherit',
              fontSize: '1em',
            },
            'pre code': {
              color: 'inherit', // 코드 블록 색상 (기본값 유지)
            },
            'dark code': {
              color: '#e94a3f', // 인라인 코드 색상 (다크 모드)
            },
            'dark pre code': {
              color: 'inherit', // 코드 블록 색상 (기본값 유지)
            },
          },
        },
      },
    },
  },
  
  plugins: [require("@tailwindcss/typography")],
};
