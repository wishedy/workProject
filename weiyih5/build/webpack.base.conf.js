var path = require('path')
var utils = require('./utils')
var config = require('../config')
var vueLoaderConfig = require('./vue-loader.conf')
var buildEntries = require('./build-entries')

module.exports = {
  mode:'development',
  entry: buildEntries,
  output: {
    path: config.build.assetsRoot, //编译后文件的存放目录
    filename: '[name].js',
    publicPath: process.env.NODE_ENV === 'production'
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath
  },
  resolve: {
    extensions: ['.js', '.vue', '.json','.ts'],
    alias: {
      '@': utils.resolve('src'),
      'common': utils.resolve('src/common'),
      'components': utils.resolve('src/components'),
      'pages': utils.resolve('src/modules'),
      'api': utils.resolve('src/api'),
      'static':utils.resolve('static'),
      'scss':utils.resolve('scss')
    }
  },
  module: {
    rules: [
      // {
      //   test: /\.(js|vue)$/,
      //   loader: 'eslint-loader',
      //   enforce: 'pre',
      //   include: [utils.resolve('src')],
      //   options: {
      //     formatter: require('eslint-friendly-formatter')
      //   }
      // },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
        {
          test: /\.js$/,
          loader: 'babel-loader',
          include: [utils.resolve('src')]
        },

        {  test: /\.js$/,
            loader: "babel-loader",
            query: {presets: ['env']},
            exclude: /node_modules/
        },/*,
          {
              test: /\.ts$/,
              exclude: /node_modules/,
              enforce: 'pre',
              loader: 'tslint-loader'
          },
        /*{
            test: /\.tsx?$/,
            loader: 'ts-loader',
            exclude: /node_modules/,
            options: {
                appendTsSuffixTo: [/\.vue$/],
            }
        },*/
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  }
};
