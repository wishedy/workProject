/* global require, module, __dirname */

const path = require('path')
const webpack = require('webpack')
const { VueLoaderPlugin } = require('vue-loader')

const config = require('../config')
const utils = require('./utils')
const entris = require('./entris')

const projectRoot = path.resolve(__dirname, '../')
const isProd = process.env.NODE_ENV === 'production'

const baseWebpackConfig = {
    entry: {
        vendors: ['vue']
    },
    output: {
        path: config.build.assetsRoot,
        publicPath: isProd ? config.build.assetsPublicPath : config.dev.assetsPublicPath,
        filename: '[name].js',
        chunkFilename: '[name].js'
    },
    externals: {
        jquery: 'jQuery'
    },
    resolve: {
        extensions: ['.js', '.vue'],
        modules: [path.join(__dirname, '../node_modules')],
        alias: {
            'jquery':'jquery/dist/jquery.min.js',
            'vue$':'vue/dist/vue.esm.js',
            '~src': path.resolve(__dirname, '../src'),
            '~api': path.resolve(__dirname, '../src/api/index'),
            '~api-config': path.resolve(__dirname, '../src/api/config'),
            '~scss': path.resolve(__dirname, '../src/assets/scss'),
            '~images': path.resolve(__dirname, '../src/assets/images'),
            '~components': path.resolve(__dirname, '../src/components'),
            '~pages': path.resolve(__dirname, '../src/pages'),
            '~polyfill': path.resolve(__dirname, '../src/polyfill'),
            '~store': path.resolve(__dirname, '../src/store'),
            '~utils': path.resolve(__dirname, '../src/utils')
        }
    },
    resolveLoader: {
        modules: [path.join(__dirname, '../node_modules')]
    },
    module: {
        rules: [
            // 取消编译前eslint验证, 可以直接使用 npm run lint
            // {
            //     test: /\.vue$/,
            //     loader: 'eslint-loader',
            //     enforce: 'pre',
            //     include: projectRoot,
            //     exclude: /node_modules/
            // },
            // {
            //     test: /\.js$/,
            //     loader: 'eslint-loader',
            //     enforce: 'pre',
            //     include: projectRoot,
            //     exclude: /node_modules/
            // },
            {
                test: /\.vue$/,
                use: [
                    {
                        loader: 'vue-loader',
                        options: {
                            compilerOptions: {
                                preserveWhitespace: true
                            }
                        }
                    }
                ]
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                include: projectRoot,
                exclude: /node_modules/
            },
            {
                test: /\.(jpg|png|gif|eot|svg|ttf|woff|woff2)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: utils.assetsPath('img/[name].[hash:7].[ext]')
                    }
                ]
            }
        ]
    },
    plugins: [
        new VueLoaderPlugin(),
        new webpack.ProvidePlugin({ $: 'jquery', jQuery: 'jquery', 'window.jQuery': 'jquery' })
    ]
}
baseWebpackConfig.entry = Object.assign(baseWebpackConfig.entry, entris)
module.exports = baseWebpackConfig
