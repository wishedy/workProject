const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');

let loader = [
  {
    enforce: 'pre',
    test: /\.(js|vue)$/,
    exclude: /node_modules/,
    include: [path.resolve(__dirname, '../src')], // 指定检查的目录
    loader: 'eslint-loader'
  },
  {
    test: /\.js$/, // es6 => es5
    exclude: /node_modules/,
    use: 'babel-loader'
  },
  {
    test: /\.vue$/,
    loader: 'vue-loader'
  },

  // {
  //   test: /\.ts$/,
  //   exclude: /node_modules/,
  //   enforce: 'pre',
  //   loader: 'tslint-loader'
  // },
  // {
  //   test: /\.tsx?$/,
  //   loader: 'ts-loader',
  //   exclude: /node_modules/,
  //   options: {
  //     appendTsSuffixTo: [/\.vue$/]
  //   }
  // },
  {
    test: /\.css$/,
    use: [
      MiniCssExtractPlugin.loader,
      'css-loader'
    ]
  },
  {
    test: /\.(sass|scss)$/,
    use: ['style-loader', 'css-loader', 'sass-loader']
  },
  {
    test: /\.(png|jpg|gif)$/,
    use: [{
      loader: 'file-loader',
      options: {
        name: '[name].[hash:8].[ext]'
      }
    }]
  },
  { test: /.(eot|woff|ttf)$/, loader: 'url-loader' }
];

module.exports = loader;
