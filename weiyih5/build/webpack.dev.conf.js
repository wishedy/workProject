var utils = require('./utils');
var webpack = require('webpack');
var config = require('../config');
var merge = require('webpack-merge');
var baseWebpackConfig = require('./webpack.base.conf');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var VueLoaderPlugin = require('vue-loader/lib/plugin');
var FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
var glob = require('glob');
var vConsolePlugin = require('vconsole-webpack-plugin');
var entryPointModule = require('./entryModules');
// add hot-reload related code to entry chunks
Object.keys(baseWebpackConfig.entry).forEach(function (name) {
  baseWebpackConfig.entry[name] = ['./build/dev-client'].concat(baseWebpackConfig.entry[name])
});
var pathStr = entryPointModule.checkEntryPath();
let devConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap })
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': config.dev.env
    }),
    // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
    new webpack.HotModuleReplacementPlugin(),
    //new webpack.NoEmitOnErrorsPlugin(),
    new FriendlyErrorsPlugin(),
    new vConsolePlugin({
      enable: false // 发布代码前记得改回 false
    }),
      new VueLoaderPlugin()
  ]
});
let pages = ((globalPath)=>{
  let htmlFiles = {},
    pageName;

  glob.sync(globalPath).forEach((pagePath)=>{
    //TODO:单层级目录文件打包
    //var basename = path.basename(pagePath, path.extname(pagePath));
    // TODO 多层级页面打包编译逻辑 2017.11.20 姚乔，王宁，李春辉
    var basename = pagePath.substring(pagePath.indexOf("modules/")+8,pagePath.lastIndexOf("/"));
    pageName = basename;
    htmlFiles[pageName] = {};
    htmlFiles[pageName]['chunk'] = basename;
    htmlFiles[pageName]['path'] = pagePath;

  });
  return htmlFiles;
})(utils.resolve('src')+pathStr);

for (let entryName in pages) {
  let conf = {
    // 生成出来的html文件名
    filename: entryName + '.html',
    // 每个html的模版，这里多个页面使用同一个模版
    template: pages[entryName]['path'],
    // 自动将引用插入html
    inject: true,
    // 每个html引用的js模块，也可以在这里加上vendor等公用模块
    chunks: ['vendor','manifest',pages[entryName]['chunk']]
  };
  /*入口文件对应html文件（配置多个，一个页面对应一个入口，通过chunks对应）*/
  devConfig.plugins.push(new HtmlWebpackPlugin(conf));
}

module.exports = devConfig;
