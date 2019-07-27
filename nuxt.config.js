import colors from 'vuetify/es5/util/colors'

export default {
  mode: 'universal',

  server: {
    port: 3000,
    // host: '0.0.0.0'
  },

  // Atributos del html
  htmlAttrs: {
    lang: 'es',
  },

  // headers
  head: {
    titleTemplate: '%s - ' + process.env.npm_package_name,
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
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
      primary: colors.blue.darken2,
      accent: colors.grey.darken3,
      secondary: colors.amber.darken3,
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
