/* global require, module, process, path */

const path = require('path')
const express = require('express')
const webpack = require('webpack')
const proxyMiddleware = require('http-proxy-middleware')

const webpackConfig = require('./webpack.dev.conf')
const config = require('../config')
const entris = require('./entris')

// default port where dev server listens for incoming traffic
const port = process.env.PORT || config.dev.port
// Define HTTP proxies to your custom API backend
// https://github.com/chimurai/http-proxy-middleware
const proxyTable = config.dev.proxyTable

const app = express()
const compiler = webpack(webpackConfig)

const devMiddleware = require('webpack-dev-middleware')(compiler, {
    publicPath: webpackConfig.output.publicPath,
    stats: {
        colors: true,
        chunks: false
    }
})

const hotMiddleware = require('webpack-hot-middleware')(compiler)
//force page reload when html-webpack-plugin template changes
// compiler.plugin('compilation', function(compilation) {
//     compilation.plugin('html-webpack-plugin-after-emit', function(data, cb) {
//         hotMiddleware.publish({
//             action: 'reload'
//         })
//         cb&&cb()
//     })
// })

// proxy api requests
Object.keys(proxyTable).forEach(function(context) {
    const options = proxyTable[context]
    if (typeof options === 'string') {
        options = {
            target: options
        }
    }
    console.log(options)
    app.use(proxyMiddleware(context, options))
})

//todo 解决本地编译环境链接不能带‘/’的问题，所以先注释
/*let rewrites=((entris)=>{
    let entrisList=[{ from: /\/$/, to: '/index/index.html' }];

    for (let item in entris) {
        let itemName=item.split('\\');
        itemName=itemName[itemName.length-1];
        entrisList.push({
            from: new RegExp('\/'+itemName+'$'),
            to: '/'+itemName+'/index.html'
        })

    }
    return entrisList;
})(entris);*/

/*// handle fallback for HTML5 history API
app.use(
    require('connect-history-api-fallback')({
        rewrites: [
            //{ from: /\/$/, to: '/index/index.html' },
            //{ from: /\/index$/, to: '/index/index.html' },
            //{ from: /\/templateLib$\//, to: '/templateLib/index.html' },
            // { from: /\/module2$/, to: '/module2/index.html' },
            // { from: /\/routerDemo$/, to: '/routerDemo/index.html' },
            // { from: /\/vuexDemo$/, to: '/vuexDemo/index.html' },
            // { from: /\/module3$/, to: '/module3/index.html' },
            // { from: /\/router$/, to: '/router/index.html' },
            // { from: /\/vuex$/, to: '/vuex/index.html' },
            // { from: /\/view$/, to: '/view/index.html' },
            // { from: /\/newCases$/, to: '/newCases/index.html' }
        ]
        // rewrites:rewrites
    })
)*/

// serve webpack bundle output
app.use(devMiddleware)

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware)

// serve pure static assets
const staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory)
app.use(staticPath, express.static('./static'))

module.exports = app.listen(port, function(err) {
    if (err) {
        console.log(err)
        return
    }
    console.log('Listening at http://localhost:' + port + '\n')
})
