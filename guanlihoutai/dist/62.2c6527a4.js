(window.webpackJsonp=window.webpackJsonp||[]).push([[62],{689:function(t,i,e){var o=e(934);"string"==typeof o&&(o=[[t.i,o,""]]);var n={hmr:!0,transform:void 0,insertInto:void 0};e(156)(o,n);o.locals&&(t.exports=o.locals)},933:function(t,i,e){"use strict";var o=e(689);e.n(o).a},934:function(t,i,e){(t.exports=e(155)(!1)).push([t.i,"\n.hotDictEditRoot .hotDictEditRoot-editArea[data-v-22e4abb2] {\n  margin: 5px auto;\n  width: 1200px;\n  box-shadow: 0 4px 10px 0 rgba(42, 53, 102, 0.04);\n  border-radius: 3px;\n}\n.hotDictEditRoot .hotDictEditRoot-editArea ul[data-v-22e4abb2] {\n    height: 100%;\n    background: #FFFFFF;\n    float: left;\n}\n.hotDictEditRoot .hotDictEditRoot-editArea ul li[data-v-22e4abb2]:first-child {\n      padding-top: 12px;\n}\n.hotDictEditRoot .hotDictEditRoot-editArea ul .hotDictEditRoot-button[data-v-22e4abb2] {\n      cursor: pointer;\n      margin: 60px 0 60px 100px;\n      float: left;\n}\n.hotDictEditRoot .hotDictEditRoot-editArea ul .hotDictEditRoot-button .hotDictEditRoot-button-submit[data-v-22e4abb2] {\n        width: 140px;\n        height: 32px;\n        background: #3846DC;\n        border-radius: 3px;\n        font-family: PingFangSC-Medium;\n        font-size: 14px;\n        color: #FFFFFF;\n        letter-spacing: 0;\n        line-height: 32px;\n        text-align: center;\n        float: left;\n}\n.hotDictEditRoot .hotDictEditRoot-editArea ul .hotDictEditRoot-button .hotDictEditRoot-button-clear[data-v-22e4abb2] {\n        width: 140px;\n        height: 32px;\n        background: #A1A8C0;\n        border-radius: 3px;\n        font-family: PingFangSC-Medium;\n        font-size: 14px;\n        color: #FFFFFF;\n        letter-spacing: 0;\n        line-height: 32px;\n        text-align: center;\n        float: left;\n        margin-left: 30px;\n}\n.hotDictEditRoot .hotDictEditRoot-editArea ul .hotDictEditRoot-editArea-row[data-v-22e4abb2] {\n      /*height:42px;*/\n}\n.hotDictEditRoot .hotDictEditRoot-editArea ul .hotDictEditRoot-editArea-row input[data-v-22e4abb2] {\n        width: 272px;\n        height: 30px;\n        background: #F7F9FC;\n        border: 1px solid #E6E6E8;\n        border-radius: 3px;\n        padding: 0 13px;\n}\n.hotDictEditRoot .hotDictEditRoot-editArea ul .hotDictEditRoot-editArea-row .hotDictEditRoot-editArea-left[data-v-22e4abb2] {\n        width: 100px;\n        float: left;\n        text-align: right;\n        font-family: PingFangSC-Regular;\n        font-size: 14px;\n        color: #555555;\n        letter-spacing: 0;\n        line-height: 42px;\n}\n.hotDictEditRoot .hotDictEditRoot-editArea ul .hotDictEditRoot-editArea-row .hotDictEditRoot-editArea-right[data-v-22e4abb2] {\n        float: left;\n        margin-left: 10px;\n        font-family: PingFangSC-Regular;\n        font-size: 14px;\n        color: #111111;\n        letter-spacing: 0;\n        line-height: 42px;\n        width: 1000px;\n}\n.hotDictEditRoot .hotDictEditRoot-editArea ul .hotDictEditRoot-editArea-row .hotDictEditRoot-editArea-right .warningStyle[data-v-22e4abb2] {\n          background: #F7F9FC;\n          border: 1px solid #EB3B46;\n          border-radius: 3px;\n}\n.hotDictEditRoot .hotDictEditRoot-editArea ul .hotDictEditRoot-editArea-row .hotDictEditRoot-editArea-right .el-input--suffix input[data-v-22e4abb2] {\n          width: 298px;\n          height: 32px;\n          font-family: PingFangSC-Regular;\n          font-size: 14px;\n          color: #BBBBBB;\n          letter-spacing: 0;\n          line-height: 14px;\n}\n.hotDictEditRoot .hotDictEditRoot-titleTab[data-v-22e4abb2] {\n  margin: 0 auto;\n  width: 1200px;\n  margin-top: 37px;\n  height: 38px;\n}\n.hotDictEditRoot .hotDictEditRoot-titleTab h3[data-v-22e4abb2] {\n    float: left;\n    font-family: PingFangSC-Semibold;\n    font-size: 20px;\n    color: #222222;\n    letter-spacing: 0;\n    line-height: 20px;\n}\n",""])},973:function(t,i,e){"use strict";e.r(i);var o=function(){var i=this,t=i.$createElement,e=i._self._c||t;return e("section",{staticClass:"hotDictEditRoot"},[i._m(0),i._v(" "),e("div",{staticClass:"hotDictEditRoot-editArea"},[e("ul",[e("li",{staticClass:"hotDictEditRoot-editArea-row"},[e("div",{staticClass:"hotDictEditRoot-editArea-left"},[i._v("热搜名")]),i._v(" "),e("div",{staticClass:"hotDictEditRoot-editArea-right"},[i._v(i._s(i.hotDictDetail.searchKey))])]),i._v(" "),e("li",{staticClass:"hotDictEditRoot-editArea-row"},[e("div",{staticClass:"hotDictEditRoot-editArea-left"},[i._v("来源")]),i._v(" "),e("div",{staticClass:"hotDictEditRoot-editArea-right"},[i._v(i._s(i.hotDictDetail.sourceTypeDesc))])]),i._v(" "),e("li",{staticClass:"hotDictEditRoot-editArea-row"},[e("div",{staticClass:"hotDictEditRoot-editArea-left"},[i._v("线上排序号")]),i._v(" "),e("div",{staticClass:"hotDictEditRoot-editArea-right"},[e("input",{directives:[{name:"model",rawName:"v-model",value:i.hotDictDetail.sortId,expression:"hotDictDetail.sortId"}],class:i._f("redlineStyle")(i.warningStyle.sortId),attrs:{type:"text"},domProps:{value:i.hotDictDetail.sortId},on:{input:[function(t){t.target.composing||i.$set(i.hotDictDetail,"sortId",t.target.value)},function(t){i.validInput("sortId")}]}})])]),i._v(" "),e("li",{staticClass:"hotDictEditRoot-editArea-row"},[e("div",{staticClass:"hotDictEditRoot-editArea-left"},[i._v("推荐类型")]),i._v(" "),e("div",{staticClass:"hotDictEditRoot-editArea-right"},[e("el-select",{class:i._f("redlineStyle")(i.warningStyle.recommendType),attrs:{placeholder:"请选择推荐类型"},on:{change:function(t){i.validInput("recommendType")}},model:{value:i.recommendDesc,callback:function(t){i.recommendDesc=t},expression:"recommendDesc"}},i._l(i.recommendType,function(t){return e("el-option",{key:t.id,attrs:{label:t.desc,value:t.id}})}))],1)]),i._v(" "),e("li",{staticClass:"hotDictEditRoot-button"},[e("div",{staticClass:"hotDictEditRoot-button-submit",on:{click:i.save}},[i._v("提交\n        ")]),i._v(" "),e("div",{staticClass:"hotDictEditRoot-button-clear",on:{click:i.goBack}},[i._v("返回\n        ")])])])])])};o._withStripped=!0;var n=e(68),a={name:"hotDictEdit",data:function(){return{warningStyle:{sortId:!1,recommendType:!1},hotDictDetail:{searchKey:"",sourceTypeDesc:"",sortId:0},recommendDesc:"",recommendType:[{id:0,desc:"不推荐"},{id:1,desc:"推荐"},{id:2,desc:"预填充词"}],dictDetailParams:{id:0},updateDictParams:{updateTime:1,id:0,recommendType:0,sortId:0,isValid:1}}},filters:{redlineStyle:function(t){return t?"warningStyle":""}},mounted:function(){this.init()},destroyed:function(){for(var t in sessionStorage)t.includes("hot")&&sessionStorage.removeItem(t);n.default.goBack()},methods:{init:function(){this.$route.query.dictId||this.goBack(),sessionStorage.setItem("search_goBack",!0),sessionStorage.setItem("search_source","hot"),this.dictDetailParams.id=this.$route.query.dictId;var t=n.default.sendAxios("dictDetail",this.dictDetailParams),i=this;n.default.openLoading("加载中..."),t.then(function(t){n.default.closeLoading(),i.hotDictDetail=t,i.hotDictDetail.sourceTypeDesc=1===t.sourceType?"运营添加":"系统",i.recommendDesc=t.recommendType}).catch(function(t){n.default.closeLoading(),n.default.axios.isCancel(t)||i.$allin_confirm({title:"提示",content:"查询/保存失败",type:"notice"})})},goBack:function(){n.default.closeLoading(),this.$router.go(-1)},validInput:function(t){"sortId"===t&&(!n.default.isNumber(this.hotDictDetail.sortId)||9<this.hotDictDetail.sortId.length)?this.warningStyle.sortId=!0:this.warningStyle.sortId=!1,"recommendType"===t&&(this.warningStyle.recommendType=!1)},save:function(){var i=this;for(var t in this.warningStyle)if(this.warningStyle[t])return this.$allin_confirm({content:"资料不符合规范，保存失败",type:"notice"}),!1;n.default.openLoading("查询/保存中...");var e=this;n.default.sendAxios("existDict",{sourceType:this.hotDictDetail.sourceType,recommendType:this.recommendDesc,searchKey:this.hotDictDetail.searchKey,isValid:this.hotDictDetail.isValid,id:this.hotDictDetail.id}).then(function(t){t.responseStatus?(i.updateDictParams.id=i.dictDetailParams.id,i.updateDictParams.sortId=i.hotDictDetail.sortId,i.updateDictParams.recommendType=i.recommendDesc,n.default.sendAxios("updateDict",i.updateDictParams).then(function(t){t.responseStatus&&e.goBack()}).catch(function(t){n.default.closeLoading(),n.default.axios.isCancel(t)||e.$allin_confirm({title:"提示",content:"保存失败",type:"notice"})})):(n.default.closeLoading(),e.warningStyle.recommendType=!0,e.$allin_confirm({content:t.responseMessage+"，保存失败",type:"notice"}))}).catch(function(t){n.default.closeLoading(),n.default.axios.isCancel(t)||e.$allin_confirm({title:"提示",content:"查询/保存失败",type:"notice"})})},tools:function(){return{getRecommendDesc:function(t){var i="不推荐";switch(t){case 1:i="推荐";break;case 2:i="预填充词"}return i}}}}},d=(e(933),e(58)),c=Object(d.a)(a,o,[function(){var t=this,i=t.$createElement,e=t._self._c||i;return e("div",{staticClass:"hotDictEditRoot-titleTab"},[e("h3",[t._v("搜索热词管理 > 搜索词编辑页")])])}],!1,null,"22e4abb2",null);c.options.__file="src/views/operationalConfiguration/searchManager/hotDictEdit.vue";i.default=c.exports}}]);