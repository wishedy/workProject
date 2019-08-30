const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const baseWebpackConfig = require('./webpack.base.conf')
const utils = require('./utils')
const config = require('../config')
const entris = require('./entris')

let webpackConfig = merge(baseWebpackConfig, {
    mode: 'development',
    module: {
        rules: utils.styleLoaders({
            sourceMap: config.build.productionSourceMap,
            extract: false,
            usePostCSS: false
        })
    },
    output: {
        publicPath: '/'
    },
    devtool: '#eval-source-map',
    plugins: [
        new webpack.DefinePlugin({ 'process.env': config.dev.env }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin()
    ]
})

Object.keys(entris).forEach(function(entry) {
    let template='src/template/index.html';
    switch (entry){
        case 'newCases':
        case 'uploadDemo':
            template='src/template/uploadImg.html';
            break;
        case 'caseDetails':
            template='src/template/allinmdpayer.html';
            break;
        default:
            break;
    }
    webpackConfig.plugins.push(
        new HtmlWebpackPlugin({
            isProd: false,
            chunks: ['vendors', entry],
            filename:(entry==="index"? entry + '.html':entry + '/index.html'),
            template: template,
            inject: true
        })
    )
})

Object.keys(webpackConfig.entry).forEach(function(name) {
    webpackConfig.entry[name] = ['./build/dev-client'].concat(webpackConfig.entry[name])
})

module.exports = webpackConfig
