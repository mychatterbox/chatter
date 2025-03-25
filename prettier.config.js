export default {
  printWidth: 100,
  proseWrap: "always",
  plugins: ["prettier-plugin-astro", "prettier-plugin-tailwindcss"],
  overrides: [
    { files: "*.astro", options: { parser: "astro" } },
    { files: "*.mdoc", options: { parser: "markdown" } },
  ],
};
