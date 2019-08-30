const path = require('path');
const rootPath = path.resolve(__dirname, '..');
const isPro = process.env.npm_lifecycle_event === 'build';

let defaultSetting = {
  isPro: isPro,
  rootPath: rootPath,
  sassPath: '/src/assets/scss/',
  entryPath: rootPath + '/src/',
  mainPage: rootPath + '/index.html',
  syncStaticPath: rootPath + '/static/**/*',
  entry: rootPath + '/src/main.js',
  output: rootPath + '/dist/',
  fileName: isPro ? '[name].[hash:8]' : '[name]',
  extensions: ['.js', '.json', '.jsx', '.vue', '.ts'],
  alias: {
    'vue$': 'vue/dist/vue.esm.js',
    '@': rootPath + '/src/'
  }
};

module.exports = defaultSetting;
