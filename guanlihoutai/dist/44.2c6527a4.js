(window.webpackJsonp=window.webpackJsonp||[]).push([[44],{555:function(e,t,n){var i=n(707);"string"==typeof i&&(i=[[e.i,i,""]]);var s={hmr:!0,transform:void 0,insertInto:void 0};n(156)(i,s);i.locals&&(e.exports=i.locals)},706:function(e,t,n){"use strict";var i=n(555);n.n(i).a},707:function(e,t,n){(e.exports=n(155)(!1)).push([e.i,"\n.crm-home[data-v-fae5bece] {\n  width: 1200px;\n  margin: 35px auto;\n}\n.crm-home .menu-list[data-v-fae5bece] {\n    width: 100%;\n}\n.crm-home .menu-list .menu-list-row[data-v-fae5bece] {\n      font-family: PingFangSC-Semibold;\n      font-size: 20px;\n      color: #2C343A;\n      letter-spacing: 0;\n      line-height: 1.5;\n}\n.crm-home .menu-list .menu-list-row .menu-list-item[data-v-fae5bece] {\n        display: inline-block;\n        margin: 25px 50px 25px 0;\n        width: 200px;\n        height: 98px;\n        background: #FFFFFF;\n        box-shadow: 0 4px 15px 0 rgba(42, 53, 102, 0.12);\n        border-radius: 4px;\n}\n.crm-home .menu-list .menu-list-row .menu-list-item .menu-list-item-icon[data-v-fae5bece] {\n          overflow: hidden;\n}\n.crm-home .menu-list .menu-list-row .menu-list-item .menu-list-item-icon img[data-v-fae5bece] {\n            float: right;\n            margin: 10px;\n}\n.crm-home .menu-list .menu-list-row .menu-list-item p[data-v-fae5bece] {\n          margin: 10px 16px;\n          font-family: PingFangSC-Medium;\n          font-size: 18px;\n          color: #2C343A;\n          letter-spacing: 0;\n          line-height: 15px;\n}\n.crm-home .menu-list .menu-list-row .menu-list-item[data-v-fae5bece]:hover {\n          cursor: pointer;\n}\n.crm-home .menu-list .menu-list-row .menu-list-item:hover p[data-v-fae5bece] {\n            color: #4B67D6;\n}\n",""])},994:function(e,t,n){"use strict";n.r(t);var i=function(){var n=this,e=n.$createElement,i=n._self._c||e;return i("section",{staticClass:"crm-home"},[i("section",{staticClass:"menu-list"},n._l(n.menuList,function(e,t){return i("section",{key:t,staticClass:"menu-list-row"},[i("h3",[n._v(n._s(e.title))]),n._v(" "),i("section",{staticClass:"menu-list-panel"},n._l(e.menuItemList,function(e,t){return i("router-link",{key:t,staticClass:"menu-list-item",attrs:{to:e.router,tag:"section"}},[i("figure",{staticClass:"menu-list-item-icon"},[i("img",{attrs:{src:e.icon}})]),n._v(" "),i("p",[n._v(n._s(e.name))])])}))])}))])};i._withStripped=!0;var s={name:"Home",data:function(){return{menuList:[]}},created:function(){if(this.$store.getters.menuList)this.menuList=this.$store.getters.menuList;else{var e=JSON.parse(localStorage.getItem("menuList"));this.$store.commit("setMenuList",e),this.menuList=e}}},m=(n(706),n(58)),o=Object(m.a)(s,i,[],!1,null,"fae5bece",null);o.options.__file="src/views/Home.vue";t.default=o.exports}}]);