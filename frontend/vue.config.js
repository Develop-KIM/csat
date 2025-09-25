const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: [
    'vuetify'
  ],
  lintOnSave: false,
  devServer: {
    host: process.env.HOST,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        logLevel: 'debug'
      }
    },
    client: {
      overlay: {
        warnings: false,
        errors: true
      }
    }
  }
})
