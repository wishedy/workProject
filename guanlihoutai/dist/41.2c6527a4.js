(window.webpackJsonp=window.webpackJsonp||[]).push([[41],{1009:function(e,n,o){"use strict";o.r(n);var t=function(){var n=this,e=n.$createElement,o=n._self._c||e;return o("section",{staticClass:"crm-login"},[o("figure",{staticClass:"crm-login-box"},[o("h3",[n._v("Allin新业务平台")]),n._v(" "),o("form",{staticClass:"crm-login-form"},[o("el-input",{staticClass:"crm-login-input",attrs:{placeholder:"请输入账号"},model:{value:n.username,callback:function(e){n.username=e},expression:"username"}}),n._v(" "),o("el-input",{staticClass:"crm-login-input",attrs:{type:"password",placeholder:"请输入密码"},model:{value:n.password,callback:function(e){n.password=e},expression:"password"}}),n._v(" "),o("p",{staticClass:"crm-login-tips"},[n._v(n._s(n.tips))]),n._v(" "),o("el-button",{attrs:{type:"primary",round:""},on:{click:n.loginOnClick}},[n._v("登录")])],1)])])};t._withStripped=!0;var r=o(70),i=o.n(r),c=o(69),a=o(59),s=o(526),m={name:"Login",data:function(){return{username:"",password:"",tips:""}},methods:{loginOnClick:function(){var e={},r=this;e.userLoginName=this.username,e.userPassword=this.password,e.isValid="3",this.username&&this.password?Object(a.a)({method:c.a.loginAPI.type,url:c.a.loginAPI.url,data:e}).then(function(e){if(e.data.responseObject&&e.data.responseObject.responseData&&!e.data.responseObject.responseCode){var n=e.data.responseObject.responseData.SESSION_USER,o=e.data.responseObject.responseData.MENU_MAP;r.$store.commit("setUserLoginName",n.userLoginName),r.$store.commit("setUserName",n.userRealName);var t=Object(s.a)(o.responseData.data);r.$store.commit("setMenuList",t),localStorage.setItem("userLoginName",n.userLoginName),localStorage.setItem("userRealName",n.userRealName),localStorage.setItem("userId",n.userId),localStorage.setItem("menuList",i()(t)),r.$router.push({path:"/"})}else r.tips="！账号、密码错误请重新登录"}).catch(function(e){}):r.tips="！账号、密码不可为空"}},mounted:function(){var n=this;document.onkeydown=function(e){13===e.keyCode&&n.loginOnClick()}}},u=(o(708),o(58)),d=Object(u.a)(m,t,[],!1,null,null,null);d.options.__file="src/views/Login.vue";n.default=d.exports},526:function(e,n,o){"use strict";var b=[{menuId:10651,router:"/memberAudit",icon:"icon-home-01.png",desc:"审核管理"},{menuId:10652,router:"/memberAudit",icon:"icon-home-02.png",desc:"审核查询"},{menuId:10653,router:"/memberMerge",icon:"icon-home-03.png",desc:"会员合并"},{menuId:10654,router:"/memberMerge",icon:"icon-home-01.png",desc:"合并查询"},{menuId:10703,router:"/informationMaintenance",icon:"icon-home-02.png",desc:"认证提示"},{menuId:10751,router:"/speciality",icon:"icon-home-01.png",desc:"专业入口"},{menuId:10752,router:"/indexColumn",icon:"icon-home-02.png",desc:"首页栏目"},{menuId:10754,router:"/columnManager",icon:"icon-home-01.png",desc:"栏目管理"},{menuId:10801,router:"/boneCloud",icon:"icon-home-03.png",desc:"骨人云"},{menuId:10755,router:"/boneCloudBanner",icon:"icon-home-02.png",desc:"骨人云活动后台"},{menuId:10802,router:"/videoNodesExamine",icon:"icon-home-01.png",desc:"视频笔记"},{menuId:10803,router:"/kitsList",icon:"icon-home-02.png",desc:"锦囊管理"},{menuId:10753,router:"/searchHotDict",icon:"icon-home-03.png",desc:"热词管理"},{menuId:10756,router:"/searchComplexDict",icon:"icon-home-01.png",desc:"搜索词管理"},{menuId:10851,router:"/patientEduList",icon:"icon-home-01.png",desc:"患教手册"},{menuId:10852,router:"/userPatientEduList",icon:"icon-home-03.png",desc:"用户患教手册"},{menuId:10656,router:"/asiaManager",icon:"icon-home-03.png",desc:"Asia会员管理"},{menuId:10757,router:"/indexBackground",icon:"icon-home-01.png",desc:"首页背景图"},{menuId:10951,router:"/patientsEvaluation",icon:"icon-home-01.png",desc:"患者端管理-患者评价"},{menuId:10901,router:"/advertisingMaterials",icon:"icon-home-01.png",desc:"广告管理-广告物料"},{menuId:10902,router:"/recommendAdvertisement",icon:"icon-home-02.png",desc:"广告管理-首页-推荐广告管理"},{menuId:10903,router:"/curriculumAdvertisement",icon:"icon-home-03.png",desc:"广告管理-首页-课程广告管理"},{menuId:10904,router:"/liveBroadcastAdvertisement",icon:"icon-home-01.png",desc:"广告管理-首页-直播广告管理"},{menuId:10905,router:"/eliteClubAdvertisement",icon:"icon-home-03.png",desc:"广告管理-首页-直播广告管理"},{menuId:10758,router:"/productAnchorPoint",icon:"icon-home-03.png",desc:"运营配置-产品锚点"},{menuId:10708,router:"/companyInformationMaintenance",icon:"icon-home-01.png",desc:"资源管理>认证资源>厂商认证提示"},{menuId:10657,router:"/companyAudit",icon:"icon-home-02.png",desc:"客户关系管理>用户管理>厂商审核管理"},{menuId:13004,router:"/payCoursesIndex",icon:"icon-home-02.png",desc:"CMS管理-运营配置-付费课程管理"},{menuId:13005,router:"/collegeClass",icon:"icon-home-03.png",desc:"CMS管理-运营配置-唯医学院频道"},{menuId:10956,router:"/allinmdSchoolAdvertisement",icon:"icon-home-01.png",desc:"CMS管理-广告管理-唯医学院广告管理"},{menuId:10957,router:"/terminalAdvertisement",icon:"icon-home-02.png",desc:"CMS管理-广告管理-终端页广告管理"},{menuId:13001,router:"/createCode",icon:"icon-home-03.png",desc:"营销工具-兑换码-兑换码创建"},{menuId:13002,router:"/codeBatch",icon:"icon-home-01.png",desc:"营销工具-兑换码-兑换码批次查询"},{menuId:13003,router:"/codeNumber",icon:"icon-home-02.png",desc:"营销工具-兑换码-兑换码码号查询"},{menuId:12001,router:"/createCouponSelectList",icon:"icon-home-03.png",desc:"营销工具-优惠券-优惠券创建"},{menuId:12002,router:"/couponBatchList",icon:"icon-home-01.png",desc:"营销工具-优惠券-优惠券批次查询"},{menuId:12003,router:"/couponVoucherList",icon:"icon-home-02.png",desc:"营销工具-优惠券-优惠券券号查询"},{menuId:11001,router:"/commodityOrderList",icon:"icon-home-03.png",desc:"交易-订单-商品订单"}];o.d(n,"a",function(){return t}),o.d(n,"b",function(){return r});var C={ROLE_ADMIN:721,ROLE_USER:722};function t(e){for(var n=[],o=0;o<e.length;o++){var t=e[o];if(t&&t.oneTree&&t.childMap&&0<t.childMap.length)for(var r=t.childMap,i=0;i<r.length;i++){var c={};c.title=t.oneTree.systemName;var a=t.childMap[i];if(a&&a.twoTree&&a.childMap&&0<a.childMap.length){var s=a.childMap;c.title+=">",c.title+=a.twoTree.menuName,c.menuItemList=[];for(var m=0;m<s.length;m++){var u=s[m],d={};if(u&&u.threeTree){d.name=u.threeTree.menuName,d.menuId=u.threeTree.menuId;var p=u.threeTree.pageOperation.split(","),l=d.pageOperation=null;if(0<p.length&&p[0]){for(var g=0;g<p.length;g++)p[g]&&(d.pageOperation=p[g],d.pageOperation==C.ROLE_ADMIN&&(l=C.ROLE_ADMIN));d.pageOperation=l||d.pageOperation}c.menuItemList.push(d)}}0<c.menuItemList.length&&n.push(c)}}}for(var h=0;h<n.length;h++)for(var I=n[h].menuItemList,f=0;f<I.length;f++)for(var v=I[f],x=0;x<b.length;x++)v.menuId==b[x].menuId&&(v.router=b[x].router,v.icon="/static/images/icons/"+b[x].icon);return n}function r(e){for(var n=JSON.parse(localStorage.getItem("menuList")),o=0;o<n.length;o++)for(var t=n[o].menuItemList,r=0;r<t.length;r++)if(e==t[r].router)return t[r].pageOperation;return null}},556:function(e,n,o){var t=o(709);"string"==typeof t&&(t=[[e.i,t,""]]);var r={hmr:!0,transform:void 0,insertInto:void 0};o(156)(t,r);t.locals&&(e.exports=t.locals)},708:function(e,n,o){"use strict";var t=o(556);o.n(t).a},709:function(e,n,o){(e.exports=o(155)(!1)).push([e.i,"\ninput:-webkit-autofill {\n  -webkit-box-shadow: 0 0 0px 1000px #F7F9FC inset !important;\n  background-color: #F7F9FC !important;\n  background-image: none !important;\n  color: #F7F9FC !important;\n}\n.crm-login-input {\n  border-radius: 4px;\n  width: 300px;\n}\n.crm-login-input .el-input__inner {\n    height: 50px;\n    background: #F7F9FC;\n    border: 1px solid #E6E6E8;\n    border-radius: 4px;\n    font-size: 15px;\n}\n.crm-login {\n  width: 1200px;\n  height: 640px;\n  margin: 0 auto;\n  margin-top: 20px;\n  position: relative;\n  background: #FFFFFF;\n  box-shadow: 0 4px 10px 0 rgba(42, 53, 102, 0.04);\n  border-radius: 4px;\n}\n.crm-login .crm-login-box h3 {\n    padding-top: 120px;\n    text-align: center;\n    font-size: 20px;\n}\n.crm-login .crm-login-box .crm-login-form {\n    position: absolute;\n    width: 300px;\n    height: 200px;\n    left: 50%;\n    margin-left: -150px;\n    margin-top: 40px;\n}\n.crm-login .crm-login-box .el-input {\n    margin-top: 20px;\n}\n.crm-login .crm-login-box .el-button {\n    background: #4B67D6;\n    height: 41px;\n    width: 160px;\n    margin: 36px 70px;\n}\n.crm-login .crm-login-box .crm-login-tips {\n    margin-top: 16px;\n    font-family: PingFangSC-Regular;\n    font-size: 15px;\n    color: #EB3B46;\n    letter-spacing: 0;\n    line-height: 15px;\n}\n",""])}}]);