## CRM 新后台管理项目

### 目录
* 项目说明
* 项目启动
* 项目构建
* 注意事项
* 代码说明
* 模块开发历史

#### 项目说明
* 业务描述：本项目为全新的后台管理平台，采用前后端分离的开发模式，此代码库仅为前端静态项目目录。
* 技术栈：
    * 本项目采用 `vue + webpack` 的单页面应用，采用 vue 官方推荐的 vue-cli@2.9.6 为基础，作为开发。
    * 在 vuex 部分 `/src/store/` 借鉴了原有的唯医骨科、唯医等项目的相关结构，可能与官方 vuex 的写法与用法有所不同，需要注意。
* gitlab 地址：
  * ssh:  ` git@192.168.1.78:qiaoliang/crm.git`
  * http：` http://192.168.1.78/qiaoliang/crm.git`
* 线下访问：
  * 访问地址：`http://crm.allinmd.cn`
  * host 绑定（仅需要绑定这个即可）：`192.168.1.28  crm.allinmd.cn`
  * 参考用户（如非开发人员，禁止操作相关功能，仅作查看用）：用户名：admin 密码：1q2w3e4r (若无法正常访问，可咨询其他同事)
* JWT 权限/接口转发：
  * 当前项目没有动态服务层
  * 相关接口都是通过 JWT 服务进行转发
  * 如遇到接口无法正常请求时，可以考虑是否 JWT 中没对应的转发，当且仅当出现新的接口根路径时会发生
  * 当前 JWT 仅支持 GET、POST、PUT 请求，如果有其他如 DELETE 类型时，需要在 JWT 做对应的转发
* 登录状态校验：
  * 当前项目的服务端开发未实现 checkSession 类型的用户状态校验
  * 当前项目的用户是否已登录，主要通过将用户名存入 localStorage 中进行判断，具体逻辑，参考 `/router/index.js`
  * 当前用户的cookie是否过期，主要通过 JWT 中设置的 cookie，有效期为30天，如遇到登录问题，可作相关处理

#### 项目启动

* 环境配置：
   * "node": ">= 6.0.0"
   * "npm": ">= 3.0.0"
   * 其他参考 `package.json` 文件
* 依赖安装：`npm install`
* 本地开发：
  * 项目运行：`npm run dev`
  * 项目访问：`http://10.1.8.14:8080` (以实际提示为准)
  * 说明：由于当前项目已配置`jwt`接口转发，原则上不需要再绑定 host 即可正常访问，如遇新接口无法正常请求（或本地无法正常代理），请考虑是否 jwt 有对应转发

#### 项目构建

* 任何打包构建操作，仅能在 release 分支上进行，禁止其他分支操作任何打包构建操作
* 拉取最新代码版本
* 本地打包： `npm run build`
* 推送至 gitlab
* jenkins 构建：
  * jenkins 仅构建 ` /dist ` 目录下的文件
  * jenkins 任务地址：` http://192.168.1.18:8080/jenkins/view/crm/job/crm_static_local/ `
* 说明：
  * 当前项目打包时，若按当前开发的项目组区分，则由组长决定打包构建权限
  * 打包构建前后，务必通知当前所有参与此项目开发的 Allin-FE 同事，避免文件冲突
  * 打包构建前后，务必先更新最新代码，保证本地的打包前后的 `/dist/ ` 下的文件不会发生冲突
  * _tips_:若发生冲突，当前解决方案为，保留自己修改的文件，然后重新拉取项目，手动更新（希望大家都不需要遇到此问题）

#### 注意事项

* 目录说明：
   * `/build/`: webpack 配置文件，勿私自修改，如果需要修改的话，务必告知相关负责同事，并周知
   * `/config/`: vue 项目运行环境相关文件，勿私自修改，如果需要修改的话，务必告知相关负责同事，并周知
   * `/dist/`: 打包完成后的最终提交文件，非打包构建阶段，禁止上传此目录下的任何文件，若打包构建，则需要周知
   * `/src/`:项目开发源代码目录
      * `/src/api/`:为了便于后期统一修改接口请求地址，所有接口请求必须在此目录下的对应目录中（可根据迭代规模，创建对应的文件），禁止在 `axios/ajax` 请求处写任何请求路径
      * `/src/assets/`:开发中需要用到的公用资源、类库等，如 base.scss
      * `/src/components/`:此目录仅用于全站通用或大部分通用的组件提取，如果组件影响少于2个迭代模块（大功能项），则禁止提取至此，可以提取至对应的功能模块目录中
      * `/src/router/`:router 处理相关目录
      * `/src/store/`: vuex 对应的 store 目录，借鉴了原有的唯医骨科、唯医等项目的相关结构，可能与官方 vuex 的写法与用法有所不同，需要注意。
      * `/src/utils/`: 全站通用的工具方法目录
      * `/views/`:对应的功能模块目录，可在功能模块内部提取共用组件，再根据实际情况进行提取，但不可提取至 `/src/components/`
   * `/static/`:项目中需要用到的其他静态资源，添加图片时，务必保证是否已存在相同文件，避免重复上传，务必重命名图片及其他素材的不规则命名

* 类库使用：
    * 本项目已使用 element-ui 样式库，参考地址 [http://element-cn.eleme.io/#/zh-CN](http://element-cn.eleme.io/#/zh-CN)
    * 本项目已使用 swiper 库，参考地址 [https://www.swiper.com.cn/](https://www.swiper.com.cn/)

* 本项目兼容要求：
    * 仅支持 PC，不需要兼容 H5,无响应式要求
    * 可仅考虑 Chrome ,及 MacBook 的Safari 及 Chrome


#### 代码说明

* 管理后台主页菜单配置说明
  1. 主页菜单配置需要联系后台同事，在数据库中添加对应的菜单项；
  2. 如果新增的菜单配置项有权限关联，则还需要在老后台中对应账户进行勾选；
  3. 数据库中配置好后，会自动从用户登录接口中返回所有已配置有效的菜单；
  4. 每次新增一个菜单项，需要操作本项目的 `src/router/router.js`、`src/router/menuRelation.js`两个文件
     * `src/router/router.js` 文件中需要新增入口的 router;
     * `src/router/menuRelation.js` 文件中需要新增菜单项对应的 menuId 和 router 的映射关系，以及选取的 icon 图标。其中，menuId 为登录接口 `/services/tb/web/sys/user/getAllLoginInfo` 中对应配置项的 `menuId`值（需要注意返回的菜单项的层级关系，一般 `menuId` 取的是最内层中对应的值而非父级的值，切勿取错）。

* 涉及导出 Excel 表格功能，在请求接口时，请务必参考如下的参数
  ```
        import axios from '@/assets/js/utils/request.js';
        import apiConfig from '@/api/apiUrlConfig';
        import comm from '@/assets/js/utils/comm.js';
        
        methods:{
                comm.openLoading('导出中...');
                axios({
                  method: apiConfig.exportRedeemDate.type,
                  url: apiConfig.exportRedeemDate.url,
                  params: data,          // 接口需要的参数
                  responseType: 'blob',  // Excel 返回数据类型，必填
                  headers: {'ms-type': 'application/vnd.ms-excel'} // JWT 中间层转发时数据类型判断，必填
                }).then((res) => {
                  comm.closeLoading();
                  // excelName excel文件名称
                  comm.downloadFileHandle(res.data, excelName);
                }).catch((err) => {
                  comm.closeLoading();
                  this.$allin_confirm({ title: '提示', content: '导出失败', type: 'notice' });
                  console.log(err);
                });
        }
        
  ```
#### 模块开发历史

* 模块对应维护人

序号 | 模块名称 | 模块目录 |维护人|备注
---- | ------   | ------ |------ |------
0    | 公共部分 | --- | 乔亮、姚乔等| 包括但不限于如登录页、主页、Header 、路由等等
1    | 广告物料 |src/views/advertisingMaterials|张红达、何静|
2    | ASIA 会员管理 |src/views/asiaManager | 王宁 |
3    | 骨人云内容审核管理 |src/views/boneCloudManager| 王宁|
4    | 认证提示管理 |src/views/certificationRelation|姚乔|
5    | 栏目管理、骨人云活动 | src/views/columnManager | 姚乔、刘宇涛、王宁|
6    | 课程广告管理 | src/views/curriculumAdvertisement | 张红达 |
7    | 会员合并、审核管理、厂商审核| src/views/customRelation | 王宁、刘宇涛、姚乔、崔博文 |
8    | 精英会广告管理 | src/views/eliteClubAdvertisement | 张红达 |
9    | 首页图片配置 | src/views/indexBackground | 乔亮 |
10   | 锦囊管理 | src/views/kitsList | 何静 |
11   | 直播广告管理 | src/views/liveBroadcastAdvertisement | 张红达 |
12   | 专业入口、首页栏目、搜索热词管理| src/views/operationalConfiguration | 乔亮 |
13   | 患教手册 | src/views/patientEducationBook | 张红达 |
14   | 患者评价     | src/views/patientsEvaluation | 张恒 |
15   | 推荐广告管理 | src/views/recommendAdvertisement | 张红达 |
16   | 用户患教手册 | src/views/userPatientEducationBook | 张红达 |
17   | 视频笔记     | src/views/videoNodesExamine        | 张红达|
