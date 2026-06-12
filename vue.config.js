const webpack = require("webpack");
const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  publicPath: "./",
  // 生产环境是否生成 sourceMap 文件
  productionSourceMap: false,
  devServer: {
    client: {
      overlay: false,
    },
  },
  css: {
    loaderOptions: {
      // 注意：在 sass-loader v8 中，这个选项名是 "prependData"
      // https://cli.vuejs.org/zh/guide/css.html
      // 向预处理器 Loader 传递选项
      sass: {
        prependData: `@import '@/assets/styles/variable_mixin.scss';`,
      },
    },
  },
});
