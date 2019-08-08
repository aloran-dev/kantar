import colors from 'vuetify/es5/util/colors'

export default {
  mode: 'universal',

  server: {
    port: 80,
    // host: '0.0.0.0'
  },

  // Atributos del html
  htmlAttrs: {
    lang: 'es',
  },

  // headers
  head: {
    titleTemplate: '%s - ' + process.env.npm_package_name,
    title: process.env.npm_package_description || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'msapplication-TileColor', content: '#000000' },
      { name: 'theme-color', content: '#000000' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon/favicon.ico' },
      { rel: 'apple-touch-icon', sizes: '180x180', href: '/favicon/apple-touch-icon.png' },
      { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon/favicon-32x32.png' },
      { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon/favicon-16x16.png' },
      { rel: 'manifest', href: '/favicon/site.webmanifest' },
      { rel: 'mask-icon', href: '/favicon/safari-pinned-tab.svg', color: '#000000' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons' }
    ]
  },

  // color de barra de progreso
  loading: { color: '#fff' },

  // css global
  css: [
  ],

  // plugins que se cargan antes de montar la aplicación
  plugins: [
  ],

  // modulos de nuxt.js
  modules: [
    '@nuxtjs/vuetify',
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
  ],

  // configuracion de axios
  axios: {
  },

  // configuración de vuetify
  vuetify: {
    theme: {
      primary: '#201f1e',
      accent: '#dcb450',
      secondary: '#3e1551',
      info: colors.teal.lighten1,
      warning: colors.amber.base,
      error: colors.deepOrange.accent4,
      success: colors.green.accent3
    }
  },

  // configuración de la build
  build: {
    // configuracion de webpack
    extend(config, ctx) {
    }
  }
}
