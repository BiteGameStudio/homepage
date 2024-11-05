// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  // Global page headers
  app: {
    head: {
      title: 'Bite Game Studio',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { hid: 'description', name: 'description', content: 'My Nuxt.js project' },
      ],
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    },
  },

  // Global CSS
  css: ['public/assets/css/main.css'],

  // Plugins
  plugins: [],

  // Auto import components
  components: true,

  // Modules (for Nuxt 3+)
  modules: [],

  // Build configuration
  build: {},
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true }
});
