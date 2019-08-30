const webpack = require('webpack'); //引入的webpack,使用lodash
const Chalk= require('chalk');
const HtmlWebpackPlugin = require('html-webpack-plugin');  //将html打包
const {VueLoaderPlugin}= require('vue-loader');
const CopyWebpackPlugin= require('copy-webpack-plugin');
const CleanWebpackPlugin= require('clean-webpack-plugin');
const MiniCssExtractPlugin= require('mini-css-extract-plugin');
const AssetsWebpackPlugin= require('assets-webpack-plugin');
const ProgressBarWebpackPlugin= require('progress-bar-webpack-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const config= require('./config.js');

let plugin= [
  new HtmlWebpackPlugin({file: config.mainPage, template: config.mainPage}),
  new MiniCssExtractPlugin({ filename: config.fileName+ ".css"}),
  new StyleLintPlugin({
    context: config.sassPath,
    files: '**/*.(css|sass|less)',
  }),
  new webpack.ProvidePlugin({  //引用框架 jquery  lodash工具库是很多组件会复用的，省去了import
    '_': 'lodash'  //引用webpack
  }),
  new VueLoaderPlugin(),
  new ProgressBarWebpackPlugin({format: '  build [:bar] ' + Chalk.green.bold(':percent') + ' (:elapsed seconds)', clear: false}),
  new webpack.LoaderOptionsPlugin({ options: {} })
];

if(config.isPro){
    plugin.push(new CopyWebpackPlugin([{from:config.syncStaticPath,to: config.output}]));
    plugin.push(new CleanWebpackPlugin(config.output, {root: config.rootPath, verbose: true, dry: false}));
    plugin.push(new AssetsWebpackPlugin());
    plugin.push(new CompressionWebpackPlugin({
      filename: '[path].gz[query]',
      algorithm: 'gzip',
      test: new RegExp('\\.(js|css)$'),
      threshold: 10240,
      minRatio: 0.8
    }));
}

module.exports= plugin;
