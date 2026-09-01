import tailwindcss from "@tailwindcss/vite";
export default defineNuxtConfig({
  ssr: true,

  app: {
    head: {
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Google+Sans+Code:ital,wght,MONO@0,300..800,1;1,300..800,1&display=swap' }
      ]
    }
  },

  vite: {
    plugins: [tailwindcss() as any],
  },

  nitro: {
    experimental: {
      wasm: true,
    },
    rollupConfig: {
      external: ['better-sqlite3'],
    },
  },

  css: ['~/assets/css/main.css'],
  modules: ["nuxt-lucide-icons", "@pinia/nuxt"],
});