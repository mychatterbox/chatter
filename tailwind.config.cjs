const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["src/**/*.{astro,ts}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          ['"Pretendard"', ...defaultTheme.fontFamily.sans],
          { fontFeatureSettings: '"cv12"' },
        ],
        mono: [
          ['"CascadiaCode"', '"Pretendard"', ...defaultTheme.fontFamily.mono],
          { fontFeatureSettings: '"zero"' },
        ],
      },
      colors: {
        "custom-bg-dark": "#100F0F",
        "custom-bg-light": "#f5f7f9",
      },
      typography: {
        DEFAULT: {
          css: {
            "--tw-prose-body": "#28272b",
            // '--tw-prose-body': '#3f3f46',
            // '--tw-prose-invert-body': '#d4d4d8',
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
