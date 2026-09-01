import tailwindcss from "@tailwindcss/vite";
export default defineNuxtConfig({
  ssr: true,

  app: {
    head: {
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Unbounded:wght@400;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap' }
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