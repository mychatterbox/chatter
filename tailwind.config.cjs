const defaultTheme = require("tailwindcss/defaultTheme");

// ============================================
// 색상 정의
// ============================================
// ⚠️ 중요: head.astro의 colors와 동일하게 유지하세요!
const colors = {
  dark: "#100F0F",        // head.astro: colors.dark와 동일
  light: "#f5f7f9",       // head.astro: colors.light와 동일
  // codeBlockDark: "#9b0c0cff",
  // codeBlockLight: "#f1f2f3",
  // textDark: "#28272b",
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["src/**/*.{astro,ts}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          ['"Pretendard Variable"', 'Pretendard', 'system-ui', ...defaultTheme.fontFamily.sans],
          { fontFeatureSettings: '"case", "cv12"' },
        ],
        mono: [
          ['"Cascadia Code"', '"Pretendard Variable"', ...defaultTheme.fontFamily.mono],
          { fontFeatureSettings: '"zero"' },
        ],
      },
      colors: {
        "custom-bg-dark": colors.dark,
        "custom-bg-light": colors.light,
        // "custom-code-dark": colors.codeBlockDark,
        // "custom-code-light": colors.codeBlockLight,
      },
      typography: {
        DEFAULT: {
          css: {
            // "--tw-prose-body": colors.textDark,
            code: {
              fontFamily: "inherit",
              fontSize: "1em",
            },
            blockquote: {
              fontStyle: "normal",
              quotes: "none",
            },
            hr: {
              marginTop: "2rem",
              marginBottom: "2rem",
              borderTopWidth: "1px",
              borderColor: "currentColor",
            },
          },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};