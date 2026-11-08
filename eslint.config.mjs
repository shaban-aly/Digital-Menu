import nextPlugin from "@next/eslint-plugin-next";

const eslintConfig = [
  nextPlugin.configs["core-web-vitals"],
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "out/**",
      "build/**",
      "dist/**",
    ],
  },
];

export default eslintConfig;
