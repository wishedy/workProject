// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path')
//配置代理服务器，设置proxyTable属性，实现跨域请求
var proxyMiddleware = require('http-proxy-middleware')
var proxyTable = {
    '/allingateway': {
        target: 'http://dev-gateway.allinmd.cn',
        //target: 'http://m.allinmd.cn',
        changeOrigin: true,
        pathRewrite: {
            '^/allingateway': '/'
        }
    },
    '/mcall': {
        target: 'https://m.allinmd.cn',
        // target: 'http://m.allinmd.cn:9002',
        changeOrigin: true,
        pathRewrite: {
            '^/mcall': '/mcall'
        }
    },
    '/mock': {
        target: 'http://192.168.1.149:9002',
        changeOrigin: true,
        pathRewrite: {
            '^/mock': '/mock'
        }
    },
    '/quan': {
        target: 'http://192.168.1.60:16000',
        changeOrigin: true,
        pathRewrite: {
            '^/quan': '/'
        }
    }

}
module.exports = {
  build: {
    env: require('./prod.env'),
    index: path.resolve(__dirname, '../dist/index.html'),
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '/dist/',
    productionSourceMap: false,
    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assest for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],
    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  },
  dev: {
    env: require('./dev.env'),
    port: 8080,
    host:"10.1.6.4",
    autoOpenBrowser: true,
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: proxyTable,
    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: false
  }
}
