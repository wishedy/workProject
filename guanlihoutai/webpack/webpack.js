const config = require('./config.js');
const loader = require('./loader.js');
const plugin = require('./plugin.js');
const proxy = require('./proxy.js');
const optimization = require('./optimization.js');

let webpackConfig = {
  entry: config.entry,
  output: {
    path: config.output,
    filename: config.fileName + '.js'
  },
  // devtool:'source-map',
  module: {
    rules: loader
  },
  resolve: {
    extensions: config.extensions,
    alias: config.alias
  },
  optimization: optimization,
  plugins: plugin,
  devServer: proxy
};

module.exports = webpackConfig;
