const flowbiteReact = require("flowbite-react/plugin/tailwindcss");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/flowbite/**/*.js",
    // Aqui parece que você quer referenciar o arquivo de classes do flowbite-react,
    // mas o caminho usa barra invertida "\" que pode causar problemas.
    // Use barra normal "/" para melhor compatibilidade multiplataforma:
    "./.flowbite-react/class-list.json",
  ],
  theme: {
    extend: {},
  },
  plugins: [require('flowbite/plugin'), flowbiteReact],
};