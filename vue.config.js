const path = require('path');

function resolve(dir) {
  return path.join(__dirname, dir)
}

let target = process.env.VUE_APP_API
console.log(target);
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
        '/v1': {
          // target: 'http://10.12.70.39:28129', //跨域地址
          target: target, //跨域地址
          changeOrigin: true, //是否跨域
          // ws: true, // 是否启用websockets
          // secure: true, // 使用的是http协议则设置为false，https协议则设置为true
          pathRewrite: {
            '^/v1': '/v1' //规定请求地址以什么作为开头
          }
        }
      }
    },

  },
  chainWebpack(config) {
    config.resolve.alias
      .set('@', resolve('./src'))
  },
  css: {
    loaderOptions: {
      postcss: {
        plugins: [
          require("postcss-px-to-viewport")({
            unitToConvert: "px",
            viewportWidth: 1920,
            viewportHeight: 1080,
            unitPrecision: 3,
            propList: [
              "*"
            ],
            viewportUnit: "vw",
            fontViewportUnit: "vw",
            selectorBlackList: ['.ignore', '.no-adaptive'],
            minPixelValue: 1,
            mediaQuery: false,
            replace: true,
            exclude: /(\/|\\)(node_modules)(\/|\\)/,
          })
        ]
      }
    }
  }
}