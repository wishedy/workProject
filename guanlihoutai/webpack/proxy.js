const interfaces = require('os').networkInterfaces(); // 在开发环境中获取局域网中的本机iP地址

let IPAdress = '';
for (let devName in interfaces) {
  let iface = interfaces[devName];
  for (let i = 0; i < iface.length; i++) {
    let alias = iface[i];
    if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
      IPAdress = alias.address;
    }
  }
}

let proxy = {
  host: !!IPAdress ? IPAdress : 'localhost', // can be overwritten by process.env.HOST
  port: 8089,
  disableHostCheck: true,
  proxy: {
    '/base-message-platform': {
      target: 'http://10.0.1.155:3333',
      changeOrigin: true,
      pathRewrite: {
        '^/base-message-platform': '/base-message-platform'
      }
    },
    '/services/med/': {
      target: 'http://192.168.1.92:18080',
      changeOrigin: true,
      pathRewrite: {
        '^/services/med/': '/services/med/'
      }
    },
    '/services': {
      target: 'http://192.168.1.172:3333',
      changeOrigin: true,
      pathRewrite: {
        '^/services': '/services'
      }
    },
    '/base-customer-platform': {
      target: 'http://192.168.1.172:3333',
      changeOrigin: true,
      pathRewrite: {
        '^/base-customer-platform': '/base-customer-platform'
      }
    },
    '/region-manager-platform-32': {
      // target: 'http://192.168.1.172:3333',
      target: 'http://192.168.1.96:16000',
      changeOrigin: true,
      pathRewrite: {
        '^/region-manager-platform-32': '/region-manager-platform-32'
      }
    },
    '/image-api': {
      target: 'http://192.168.1.172:3333',
      changeOrigin: true,
      pathRewrite: {
        '^/image-api': '/image-api'
      }
    },
    '/comm': {
      target: 'http://192.168.1.172:3333',
      changeOrigin: true,
      pathRewrite: {
        '^/comm': '/comm'
      }
    },
    '/base-social-platform': {
      target: 'http://192.168.1.172:3333',
      changeOrigin: true,
      pathRewrite: {
        '^/base-social-platform': '/base-social-platform'
      }
    },
    '/call': {
      target: 'https://www.allinmd.cn',
      changeOrigin: true,
      pathRewrite: {
        '^/call': '/call'
      }
    },
    '/mcall': {
      target: 'http://m1.allinmed.cn',
      changeOrigin: true,
      pathRewrite: {
        '^/mcall': '/mcall'
      }
    },
    '/base-image-platform': {
      target: 'http://192.168.1.172:3333',
      changeOrigin: true,
      pathRewrite: {
        '^/base-image-platform': '/base-image-platform'
      }
    },
    '/mock': {
      target: 'http://192.168.1.149:9003',
      changeOrigin: true,
      pathRewrite: {
        '^/mock': '/mock'
      }
    },
    '/pay': {
      target: 'http://192.168.1.172:3333',
      changeOrigin: true,
      pathRewrite: {
        '^/pay': '/pay'
      }
    },

    // 本地联调，如果影响，可注释删除，
    // 本地联调时，注意参数需要补充添加 queryJson , 接口需要去掉 responseObject ，
    // 因为其他环境 gateway 会有统一处理，本地不会
    '/bgShoppingOrder/accessCourseRight': {
      target: 'http://10.0.4.224:18080',
      changeOrigin: true,
      secure: false,
      pathRewrite: {
        '^/bgShoppingOrder/accessCourseRight': '/bgShoppingOrder/accessCourseRight'
      }
    },
    '/bgShoppingOrder/getShopOrderList': {
      target: 'http://10.0.4.224:18080',
      changeOrigin: true,
      pathRewrite: {
        '^/bgShoppingOrder/getShopOrderList': '/bgShoppingOrder/getShopOrderList'
      }
    },
    '/bg/shopping/order/getShopOrderDetailById': {
      target: 'http://10.0.4.224:18080',
      changeOrigin: true,
      pathRewrite: {
        '^/bg/shopping/order/getShopOrderDetailById': '/bg/shopping/order/getShopOrderDetailById'
      }
    },

  }
};
module.exports = proxy;
