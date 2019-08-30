const config= require('./config.js');
const UglifyJsPlugin= require('uglifyjs-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

let optimization= {
  splitChunks: {
    cacheGroups: {
      styles: {
        name: 'styles',
          test: /\.css$/,
          chunks: 'all',
          enforce: true
      }
    }
  },
  minimizer: [
    new UglifyJsPlugin({
      exclude: /\.min\.js$/,
      cache: true,
      parallel: true, // 开启并行压缩，充分利用cpu
      sourceMap: false,
      extractComments: false, // 移除注释
      uglifyOptions: {
        compress: {
          unused: true,
          warnings: false,
          drop_debugger: true,
          drop_console:true
        },
        output: {
          comments: false
        }
      }
    }),
    new OptimizeCssAssetsPlugin({
      cssProcessor: require('cssnano'),
      cssProcessorOptions: { discardComments: { removeAll: true }, safe: true},
      canPrint: true
    })
  ]
};

module.exports= optimization;
