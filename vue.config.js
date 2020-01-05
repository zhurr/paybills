module.exports = {
  publicPath: './',
  outputDir: 'dist',
  assetsDir: 'static',
  lintOnSave: false, // 是否开启eslint保存检测
  productionSourceMap: false, // 是否在构建生产包时生成sourcdeMap
  runtimeCompiler: true,
  configureWebpack: {
    devServer: {
      proxy: {
        '/api': {
          target: 'http://www.baidu.com', //跨域地址
          changeOrigin: true, //是否跨域
          pathRewrite: {
            '^/api': '' //规定请求地址以什么作为开头
          }
        }
      }
    }
  }
}