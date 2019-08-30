# 唯医病历夹vue2 多页配置实例

基于`vue2 + vue-router + vuex`而组成的多页配置实例

多页实例中包含 纯单页, 基于 vue-router 的单页, 基于 vue-router + vuex 的单页, 多种模式自由组合

在 module 文件夹中只留一个模块, 就变成 纯`SPA`

所有模块均带修改head里的title, 所有模块也都包含`ajax`例子, 任何不带`ajax`的例子都是耍流氓

vuex模块带有懒加载

fork demo

```bash
$ git clone

// 安装依赖
$ npm install
#or
$ yarn

// 生产模式
$ npm run build

// 开发模式
$ npm run dev

// eslint 检测
$ npm run lint
```

访问: http://localhost:8080/index


# 目录结构
- /build/          = webpack配置文件目录
- /dist/           = webpack编译后生成文件目录
- /src/api/        = axios配置目录
- /src/assets/     = 静态文件目录
- /src/components/ = 组件目录
- /src/modules/    = 多页面模块, 每个模块一个文件夹
- /src/modules/router    = 多页面模块之带路由模块的例子
- /src/modules/vuex    = 多页面模块之带路由和vuex的模块的例子
- /static/         = 静态文件目录
- /template/       = html文件模版
- /utils/          = 一些有用的插件

# 热加载入口
stipulateEntry里面 如果是 /  会热加载整个项目 如果是具体的modules 下的文件名 会单独热加载

# 添加新的页面
每增加一个页面 需要在 dev-server.js 52行那个USE里面模仿已有页面新加一行代码

# 热加载刷新页面
dev-server.js 里面30到37行 如果注释掉，页面热加载的时候不会刷新页面，不注释掉，页面热加载的时候会直接刷新一次，看自己的需要

# 简单的实例化引用
index/app.vue 有引用element的例子  routerDemo是调用路由的demo vuexDemo是调用vuex的demo

# 页面title配置
metaInfo里面就是当前页面的title
#npm install 时候如果出现404可能原因是因为私有包没安装成功，需要单独执行以下两个命令
npm install @allin/wap-share @allin/arthas_monitor_report --save --registry http://192.168.1.149:7001 --scope=@allin
其余私有包依次往后添加即可
