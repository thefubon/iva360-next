/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions} */
export default {
  singleQuote: true,
  trailingComma: 'all',
  printWidth: 100,
  semi: false,
  plugins: ['prettier-plugin-tailwindcss'],
  tailwindStylesheet: './src/app/assets/css/globals.css',
  tailwindFunctions: ['cn', 'clsx', 'cva'],
}
