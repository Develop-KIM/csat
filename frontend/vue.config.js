const { defineConfig } = require("@vue/cli-service");
const rootPackage = require("../package.json");

module.exports = defineConfig({
  transpileDependencies: ["vuetify"],
  lintOnSave: false,
  devServer: {
    host: process.env.HOST,
    open: true,
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
        logLevel: "debug",
      },
    },
    client: {
      overlay: {
        warnings: false,
        errors: true,
      },
    },
  },
  chainWebpack: (config) => {
    config.plugin("define").tap((args) => {
      args[0]["process.env"].VUE_APP_VERSION = JSON.stringify(
        rootPackage.version,
      );
      return args;
    });
  },
});
