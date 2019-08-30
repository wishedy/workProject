+ 唯医PC项目使用jquery+gulp的架构，gulp搭建在服务器端，所以html页面需要参考
```
   <!-- build:css /dest/index/index.css -->
       <link rel="stylesheet" href="/css/v3/base.css">
       <link rel="stylesheet" href="/css/v3/pageTopNav_And_SideBar.css" />
   <!--endbuild-->
   <!-- build:js /dest/index/index.js -->
       <script src="/js/comm/main.js"></script>
       <script src="/js/comm/comm.ajax.js"></script>
   <!--endbuild-->
```
 这样就会在服务器端生成两个合并压缩的文件/dest/index/index.css ，/dest/index/index.js
+ version.md 记录版本得带信息，手写，每次上线钱编辑一次，对应修改main.js，第七行window.version的版本对应修改
+ git release分支，jekins构建的即是该分支，提供单一分支快速上线使用