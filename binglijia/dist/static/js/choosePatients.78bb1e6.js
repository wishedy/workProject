(window.webpackJsonp=window.webpackJsonp||[]).push([[7],{0:function(e,t,s){"use strict";var a=s(2),n=s.n(a),i=s(18),o=s.n(i),r=(s(6),{ajax:function(e){o()({url:e.url,method:e.method||"get",data:e.data,transformRequest:[function(t){if(e.paramJson)return"paramJson="+n()(t)}],headers:{"X-Requested-With":"XMLHttpRequest"}}).then(function(t){e.success&&e.success(t)}).catch(function(t){e.fail&&e.fail(t)})},ajax2:function(e){(e=e||{}).type=(e.type||"GET").toUpperCase(),e.dataType=e.dataType||"json";var t=function(e){var t=[];for(var s in e)t.push(encodeURIComponent(s)+"="+encodeURIComponent(e[s]));return t.push(("v="+Math.random()).replace(".","")),t.join("&")}(e.data),s=new XMLHttpRequest;s.onreadystatechange=function(){if(4==s.readyState){var t=s.status;t>=200&&t<300?e.success&&e.success(JSON.parse(s.responseText),s.responseXML):e.fail&&e.fail(t)}},"GET"==e.type?(s.open("GET",e.url+"?"+t,!0),s.send(null)):"POST"==e.type&&(s.open("POST",e.url,!0),s.setRequestHeader("Content-Type","application/x-www-form-urlencoded"),s.send(t))},cutLine:function(e,t,s,a){var n=[];e&&e.lastIndexOf(t)>-1?n=e.split(t):n.push(e);for(var i="",o=0;o<n.length;o++)n[o]&&(n[o].split(s)[1]?i+=n[o].split(s)[1]+a:i+=n[o]+a);return i.substring(0,i.length-1)},getStrLen:function(e,t){var s="",a=0;if(!e)return"";for(var n=0;n<e.length&&(e.charCodeAt(n)>128?a+=2:a++,a<=t);n++)s=s.concat(e[n]);return a>t&&(s+="..."),s},getByteLen:function(e){var t=0;if(!e)return 0;for(var s=0;s<e.length;s++)e.charCodeAt(s)>128?t+=2:t++;return t},getParamFromUrl:function(e,t){var s=e.split("?"),a=new RegExp("(^|&)"+t+"=([^&]*)(&|$)","i"),n=s[1].match(a);return null!=n?unescape(n[2]):null},getpara:function(e){var t=document.URL,s={},a=void 0;if(t.lastIndexOf(e||"?")>0)for(var n=t.substring(t.lastIndexOf(e||"?")+1,t.length).split("&"),i=0;i<n.length;i++)s[(a=n[i].split("="))[0]]=this.htmlToString(decodeURIComponent(a[1]));return s},isEmptyObject:function(e){for(var t in e)return!1;return!0},hasResponseData:function(e){return!(!(e&&e.responseObject&&e.responseObject.responseData)||this.isEmptyObject(e.responseObject.responseData))},hasResponseData2:function(e){return!(!e||!e.responseData||this.isEmptyObject(e.responseData))},hasResponseMessage:function(e){return!(!(e&&e.responseObject&&e.responseObject.responseMessage)||this.isEmptyObject(e.responseObject.responseMessage))},htmlToString:function(e){var t=(e+"").replace(/[<>&]/g,function(e){return{"<":"&lt;",">":"&gt;","&":"&amp;"}[e]}),s=t.split("&lt;/a&gt;&lt;a");return t=(t=s.length>=2?s.map(function(e,t){var s=e.replace(/\&lt\;a[\s]*href\=\"?(\S*)\"?\&gt\;([\S\s]*)/gi,'<a href="$1">$2');return s=(s=s.replace(/[\s]*href\=\"?(\S*)\"?\&gt\;([\S\s]*)&lt\;\/a\&gt\;/gi,'<a href="$1">$2</a>')).replace(/[\s]*href\=\"?(\S*)\"?\&gt\;([\S\s]*)/gi,'<a href="$1">$2</a>')}).join():(t+"").replace(/\&lt\;a[\s]*href\=\"?(\S*)\"?\&gt\;([\S\s]*)\&lt\;\/a\&gt\;/gi,'<a href="$1">$2</a>')).replace(/@@/g,"@")},symbolToString:function(e){var t=e.replace(/[<>]/g,function(e){return{"<":"&lt;",">":"&gt;"}[e]}),s=t.split("&lt;/a&gt;&lt;a");return t=(t=s.length>=2?s.map(function(e,t){var s=e.replace(/\&lt\;a[\s]*href\=\"?(\S*)\"?\&gt\;([\S\s]*)/gi,'<a href="$1">$2');return s=(s=s.replace(/[\s]*href\=\"?(\S*)\"?\&gt\;([\S\s]*)&lt\;\/a\&gt\;/gi,'<a href="$1">$2</a>')).replace(/[\s]*href\=\"?(\S*)\"?\&gt\;([\S\s]*)/gi,'<a href="$1">$2</a>')}).join():(t+"").replace(/\&lt\;a[\s]*href\=\"?(\S*)\"?\&gt\;([\S\s]*)\&lt\;\/a\&gt\;/gi,'<a href="$1">$2</a>')).replace(/@@/g,"@")},escapeReplace:function(e){return e.replace(/[+/?#&=!%]/g,function(e){return{"+":"%2B","/":"%2F","?":"%3F","#":"%23","&":"%26","=":"%3D","!":"%21","%":"%25"}[e]})},bodyScroll:function(){document.getElementsByTagName("body")[0].style.height="100%",document.getElementsByTagName("html")[0].style.height="100%",document.getElementsByTagName("body")[0].style.overflow="hidden",document.getElementsByTagName("html")[0].style.overflow="hidden"},bodyNoScroll:function(){document.getElementsByTagName("body")[0].style.height="auto",document.getElementsByTagName("html")[0].style.height="auto",document.getElementsByTagName("body")[0].style.overflow="auto",document.getElementsByTagName("html")[0].style.overflow="auto"},browser:{mozilla:/firefox/.test(navigator.userAgent.toLowerCase()),webkit:/webkit/.test(navigator.userAgent.toLowerCase()),opera:/opera/.test(navigator.userAgent.toLowerCase()),msie:/msie/.test(navigator.userAgent.toLowerCase()),versions:function(){var e=navigator.userAgent;navigator.appVersion;return{trident:e.indexOf("Trident")>-1,presto:e.indexOf("Presto")>-1,webKit:e.indexOf("AppleWebKit")>-1,gecko:e.indexOf("Gecko")>-1&&-1==e.indexOf("KHTML"),mobile:!!e.match(/AppleWebKit.*Mobile.*/)||!!e.match(/AppleWebKit/),ios:!!e.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),android:e.indexOf("Android")>-1||e.indexOf("Linux")>-1,iPhone:e.indexOf("iPhone")>-1||e.indexOf("Mac")>-1,iPad:e.indexOf("iPad")>-1,webApp:-1===e.indexOf("Safari")}}(),language:(navigator.browserLanguage||navigator.language).toLowerCase(),isIe8:function(){var e=navigator.appName,t=navigator.appVersion.split(";"),s=void 0!=t[1]&&""!=t[1]?t[1].replace(/[ ]/g,""):"";return"Microsoft Internet Explorer"===e&&"MSIE8.0"==s},isIe9:function(){var e=navigator.appName,t=navigator.appVersion.split(";"),s=void 0!=t[1]&&""!=t[1]?t[1].replace(/[ ]/g,""):"";return"Microsoft Internet Explorer"===e&&"MSIE9.0"==s},isIeOrEdge:function(){var e=navigator.userAgent,t=e.indexOf("compatible")>-1&&e.indexOf("MSIE")>-1,s=e.indexOf("Edge")>-1&&!t,a=e.indexOf("Trident")>-1&&e.indexOf("rv:11.0")>-1;if(t){new RegExp("MSIE (\\d+\\.\\d+);").test(e);parseFloat(RegExp.$1);return!0}return!!s||!!a},isLessIe10:function(){var e=navigator.userAgent,t=e.indexOf("compatible")>-1&&e.indexOf("MSIE")>-1;e.indexOf("Edge"),e.indexOf("Trident")>-1&&e.indexOf("rv:11.0");if(t){new RegExp("MSIE (\\d+\\.\\d+);").test(e);var s=parseFloat(RegExp.$1);return 7==s||(8==s||(9==s||10==s))}return!1}},cookie:{set:function(e,t,s){var a=new Date,n=s;a.setTime(a.getTime()+24*n*3600*1e3),document.cookie=e+"="+t+";expires="+a+";domain=.allinmd.cn"},get:function(e){for(var t=document.cookie.replace(/[ ]/g,"").split(";"),s=void 0,a=0;a<t.length;a++){var n=t[a].split("=");if(e==n[0]){s=n[1];break}}return s},delete:function(e){this.get(e)&&this.set(e,"",-1)}},checkUser:function(){var e=this.cookie.get("userId"),t=localStorage.getItem("userId");e&&""!=e?e!=t&&location.reload():window.location.href="//www.allinmd.cn?from=emr"}});t.a=r},10:function(e,t,s){},101:function(e,t,s){"use strict";var a=s(32);s.n(a).a},12:function(e,t,s){"use strict";var a={},n=(s(37),s(1)),i=Object(n.a)(a,function(){this.$createElement;this._self._c;return this._m(0)},[function(){var e=this.$createElement,t=this._self._c||e;return t("section",{staticClass:"alEmr-loading"},[t("img",{attrs:{src:"/static/images/common/loading.gif"}})])}],!1,null,null,null);t.a=i.exports},13:function(e,t,s){},14:function(e,t,s){},163:function(e,t,s){},19:function(e,t,s){"use strict";var a=s(0),n={data:function(){return{search:""}},methods:{searchInfo:function(){this.search?"/"!=window.location.pathname?window.location.href="/?q="+this.search:this.$emit("searchVal",this.search):"/"==window.location.pathname&&this.$emit("searchVal",this.search)},keySearch:function(e){13==e.keyCode&&this.searchInfo()}},mounted:function(){var e=a.a.getpara().q;this.search=e}},i=(s(52),s(1)),o=Object(i.a)(n,function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("section",{staticClass:"alEmr-searchInput"},[s("input",{directives:[{name:"model",rawName:"v-model",value:e.search,expression:"search"}],attrs:{type:"text",placeholder:"搜索病历信息"},domProps:{value:e.search},on:{keyup:e.keySearch,input:function(t){t.target.composing||(e.search=t.target.value)}}}),e._v(" "),s("b",{on:{click:e.searchInfo}})])},[],!1,null,null,null);t.a=o.exports},20:function(e,t,s){"use strict";var a=s(2),n=s.n(a),i=s(0),o=s(5),r=s(25),c={data:function(){return{href:"",userName:"",logoUrl:""}},methods:{getLogo:function(){var e=this;i.a.ajax2({url:"/call/commdata/getLogoUrlList/",type:"post",data:{paramJson:n()({logoType:4,logoSpec:2,logoUseFlag:3,refId:i.a.cookie.get("userId")})},success:function(t){t&&t.responseObject.length>0&&(e.logoUrl=t.responseObject[0].logoUrl.replace("https:",""))}})}},mounted:function(){var e=this;r.a.login({scene:0,callback:function(){e.href="//www.allinmd.cn/pages/personal/personal_contribution.html",e.userName=o.a.getItem("userName"),e.getLogo()}})}},u=(s(50),s(1)),p=Object(u.a)(c,function(){var e=this.$createElement,t=this._self._c||e;return t("section",{staticClass:"alEmr-userLogo"},[t("a",{attrs:{href:this.href}},[t("img",{attrs:{src:this.logoUrl,alt:""}}),this._v(" "),t("span",[this._v(this._s(this.userName))])])])},[],!1,null,null,null);t.a=p.exports},23:function(e,t,s){},24:function(e,t,s){},25:function(e,t,s){"use strict";var a=s(2),n=s.n(a),i=s(7),o=s.n(i),r=s(0),c=s(5),u=(s(6),0),p=1,l=2,d=3,m=4,h=5,g=6,v=7,f=11,y=13,w="manufactureLogin",I="auth",b="login",_="reAuth",x={isLoginStatus:!1,isRenZhengStatus:!1,customerAuth:null,customerRole:0,path:{out:"/call/customer/unite/logout/",checkUserStatus:"/call/customer/unite/checkSession/",getPrivData:"/call/customer/role/priv/json_list/",getCustomerUnite:"/call/customer/unite/getCustomerUnite/",getCustomerAuthInfo:"/call/customer/auth/getAuthBycustomerId/"},privDataUtils:{getPrivData:function(){var e=this;return new o.a(function(t,s){c.a.getItem("privData")?(e.privData=JSON.parse(c.a.getItem("privData")),t(e.privData)):e.privData||r.a.ajax2({url:x.path.getPrivData,success:function(s){if(t(),!(s&&s.responseObject&&s.responseObject.responseData))throw"no priv data";e.privData=s.responseObject.responseData,c.a.setItem("privData",n()(e.privData)),t(e.privData)}})})},getAvailableCustomerRole:function(e){var t=this;return new o.a(function(s,a){t.getPrivData().then(function(){if(!t.privData)throw s(),"no priv data";var a=[];t.getPrivData().then(function(t){var n=void 0,i=void 0;for(n in t.customeRole)"1"==(i=t.customeRole[n]).roleOps.charAt(i.roleOps.indexOf(e+"-")+e.toString().length+1)&&a.push(parseInt(n));if(0==a.length)throw"no available role";s(a)})})})},getPrivilegeDetailsOfThisScene:function(e){var t=this;return new o.a(function(s,a){var n={NeedLogin:!1,NeedAuth:!1,NeedSystem:!1,NeedManufacture:!1,CannotOperate:!1,LoginIsEnough:!1};t.getAvailableCustomerRole(e).then(function(e){var t=e;n.NeedLogin=t.indexOf(u)<=-1,n.NeedAuth=t.indexOf(h)<=-1&&t.indexOf(g)>-1,n.LoginIsEnough=t.indexOf(h)>-1,n.NeedManufacture=t.indexOf(d)>-1,n.NeedSystem=t.indexOf(p)>-1,s(n)})})}},login:function(e){var t=this;t.getLoginStatus().then(function(){t.analyzePrivDetails(e).then(function(s){t.privDetails=s,e&&(t.options=e,""===e.scene&&""==e.operateType||null===e.callback||t.checkPriv())})})},getLoginStatus:function(){var e=this;return new o.a(function(t,s){r.a.ajax2({url:e.path.checkUserStatus,dataType:"json",type:"post",success:function(s){t(),s.responseObject.responseStatus?e.isLoginStatus=!0:(e.isLoginStatus=!1,r.a.cookie.delete("userId"),c.a.removeItem("authInfo"))}})})},checkPriv:function(){var e=this;e.privDetails.NeedLogin?e.checkLoginStatus():e.privCheckSuccess()},getCustomerUnite:function(){var e=this,t={};return new o.a(function(s,a){r.a.ajax2({type:"POST",url:e.path.getCustomerUnite,dataType:"json",success:function(a){a&&a.responseObject&&(e.userInfo=t=a.responseObject,null!=t&&void 0!=t&&(c.a.setItem("customerRole",t.customerRole),c.a.setItem("userId",t.customerId),t.mobile&&c.a.setItem("mobile",t.mobile),t.email&&c.a.setItem("email",t.email))),s()},error:function(e,t,s){}})})},privCheckSuccess:function(){var e=this;e.privCheckState=!0,e.getCustomerUnite().then(function(){0==e.userInfo.isValid&&r.a.ajax2({type:"POST",url:e.path.out,dataType:"json",success:function(e){e&&e.responseObject&&e.responseObject.responseStatus&&(window.location.href="//www.allinmd.cn",c.a.clear())}}),void 0!==e.options&&void 0!==e.options.callback&&e.options.callback()})},checkLoginStatus:function(){var e=this;e.isLoginStatus?e.loginSuccess():e.goBackIndex()},analyzePrivDetails:function(e){var t=this;return new o.a(function(s,a){e.scene==b?(t.privDetails={NeedLogin:!0,NeedAuth:!1,LoginIsEnough:!0,NeedManufacture:!1,CannotOperate:!1},s(t.privDetails)):e.scene==I||e.scene==_?(t.privDetails={NeedLogin:!0,NeedAuth:!0,LoginIsEnough:!1,NeedManufacture:!1,CannotOperate:!1},s(t.privDetails)):e.scene==w?(t.privDetails={NeedLogin:!0,NeedAuth:!1,LoginIsEnough:!0,NeedManufacture:!0,CannotOperate:!1},s(t.privDetails)):void 0!==e.scene&&t.privDataUtils.getPrivilegeDetailsOfThisScene(e.scene).then(function(e){t.privDetails=e,s(t.privDetails)})})},loginSuccess:function(){var e=this;e.isLoginStatus=!0,e.getCustomerUnite().then(function(){null!=e.userInfo&&void 0!=e.userInfo&&0==e.userInfo.isValid&&r.a.ajax2({type:"POST",url:e.path.out,dataType:"json",success:function(e){e&&e.responseObject&&e.responseObject.responseStatus&&(r.a.cookie.delete("userId"),c.a.clear(),window.location.href="//www.allinmd.cn")}}),e.getCustomerAuthInfo().then(function(){e.handleCustomerRole()})})},getCustomerAuthInfo:function(){var e=this;return new o.a(function(t,s){r.a.ajax2({url:e.path.getCustomerAuthInfo,dataType:"json",type:"post",success:function(s){if(e.customerAuth=s,null!=s&&""!=s){c.a.setItem("authInfo",n()(s));var a=s.responseObject,i=a.lastName+a.firstName;c.a.setItem("userName",i),r.a.isEmptyObject(s)||2!==a.state&&7!==a.state&&8!==a.state&&9!==a.state||(e.isRenZhengStatus=!0)}else e.isRenZhengStatus=!1;t()}})})},handleCustomerRole:function(){var e=this;switch(e.userInfo.customerRole){case p:e.privDetails.NeedSystem&&e.privCheckSuccess();break;case l:break;case d:e.privDetails.NeedManufacture?e.privCheckSuccess():e.goBackIndex();break;case m:break;case h:e.privDetails.LoginIsEnough?e.privCheckSuccess():e.checkIfNeedAuth();break;case g:case y:case v:case f:e.privDetails.LoginIsEnough?e.privCheckSuccess():e.checkAuthState()}},checkIfNeedAuth:function(){this.privDetails.NeedAuth&&this.checkAuthState()},checkAuthState:function(){var e=this,t=e.customerAuth;if(null===t||""==t||void 0===t.responseObject||r.a.isEmptyObject(t.responseObject)||-1==t.responseObject.state)e.goBackIndex();else{var s=e.customerAuth.responseObject.customerId,a=e.customerAuth.responseObject.state;if(s<=0)return e.goBackIndex(),!1;3===a||-1===a||0===a||1===a?e.goBackIndex():2!==a&&7!==a&&8!==a&&9!==a||(""!=r.a.cookie.get("userId")&&r.a.cookie.get("userId")||(r.a.cookie.set("userId",s,1825),location.reload()),e.options.callback&&e.options.callback())}},goBackIndex:function(){window.location.href="//www.allinmd.cn?from=emr"}};t.a=x},26:function(e,t,s){"use strict";var a={},n=(s(82),s(1)),i=Object(n.a)(a,function(){this.$createElement;this._self._c;return this._m(0)},[function(){var e=this.$createElement,t=this._self._c||e;return t("section",{staticClass:"alEmr-logo"},[t("a",{attrs:{href:"/"}})])}],!1,null,null,null);t.a=i.exports},262:function(e,t,s){"use strict";s.r(t);var a=s(4),n=s.n(a),i=(s(39),s(8)),o=s(34),r=s.n(o),c=s(2),u=s.n(c),p=s(76),l=s(40),d=s(12),m=s(0),h=(s(18),"/call/patient/case_baseinfo/getPatientCaseSelects/"),g="/call/caseFolder/baseinfo/batchCreate/",v="/call/caseFolder/team_member/getDoctorListByCustomerId/",f={name:"index-app",provide:function(){return{reload:this.reload}},data:function(){return{customerId:m.a.cookie.get("userId"),customerRole:localStorage.getItem("customerRole"),userName:localStorage.getItem("userName"),docCustomerId:"",pageIndex:1,pageSize:10,total:0,crumbsTxt:"选择患者",showLoading:!1,tipError:!1,patientLists:"",patChoNum:"",isClicked:!1,indexItem:[],patientData:[],importSuc:!1,importErr:!1,showPager:!1,impDef:!0,impPro:!1,belongType:0,noneP:!1,docList:[],choseDoc:"",choseDocId:"",choseDocSub:"",choseType:"住院患者",choseTypeId:"2,5",choseTypeSub:"2,5",isShowDoc:!1,isSowType:!1}},components:{HeaderTopNav:s(75).a,pagination:p.a,videoPlayer:l.a,loading:d.a},mounted:function(){this.getDoctorList()},watch:{importErr:function(){this.importErr?document.getElementsByTagName("body")[0].className="bodyHidden":document.getElementsByTagName("body")[0].classList.remove("bodyHidden")},importSuc:function(){this.importSuc?document.getElementsByTagName("body")[0].className="bodyHidden":document.getElementsByTagName("body")[0].classList.remove("bodyHidden")}},methods:{pageChange:function(e){this.patientList(e)},importBtn:function(){var e=this;if(!e.noneP)if(e.patChoNum<=0){e.tipError=!0;var t=setTimeout(function(){e.tipError=!1,clearTimeout(t)},3e3)}else e.showLoading=!0,m.a.ajax2({url:g,type:"post",data:{paramJson:u()(e.patientData)},timeout:3e4,success:function(t){e.showLoading=!1,e.impDef=!1,e.impPro=!0,t&&t.responseObject&&t.responseObject.responseStatus?(e.importSuc=!0,e.importErr=!1,e.impDef=!0,e.impPro=!1):(e.importSuc=!1,e.importErr=!0,e.impDef=!0,e.impPro=!1)},fail:function(){e.showLoading=!1,e.importSuc=!1,e.importErr=!0,e.impDef=!0,e.impPro=!1}})},itemCli:function(e,t,s){var a,n=this;n.isClicked=!0,a=e+"-"+t,n.indexItem.indexOf(a)>-1?(n.indexItem.splice(n.indexItem.indexOf(a),1),n.patientData.splice(n.patientData.indexOf(a),1),n.patChoNum--):(n.indexItem.push(a),14==s.caseType?n.patientData.push({patientName:s.patientName,patientAge:s.patientAgeDetail,patientSex:1==s.patientSex?s.patientSex:"0",patientMobile:s.mobile,belongType:0,customerId:s.reportCustomerId,siteId:1,patientId:s.patientId,tagIdList:s.patientTagList,doctorId:s.reportCustomerId,creatorId:n.customerId}):n.patientData.push({patientName:s.patientName,patientAge:s.patientAgeDetail,patientSex:1==s.patientSex?s.patientSex:"0",patientMobile:s.mobile,numberType:4,numberContent:s.certificateCode,belongType:0,customerId:n.customerId,siteId:1,patientId:s.patientId,doctorId:n.customerId,creatorId:n.customerId}),n.patChoNum++)},patientList:function(e){var t=this;t.showLoading=!0,m.a.ajax2({url:h,type:"get",data:{paramJson:u()({customerId:13==t.customerRole?t.choseDocSub:t.customerId,assCustomerId:13!=t.customerRole||t.choseDocSub?"":t.customerId,firstResult:(e?e-1:t.pageIndex-1)*t.pageSize,maxResult:t.pageSize,customerRole:13==this.customerRole?"13":0,reportTypeList:this.choseTypeSub,caseTypeIn:13==this.customerRole?"14":""})},timeout:3e4,success:function(e){t.showLoading=!1,e&&e.responseObject&&e.responseObject.items&&e.responseObject.items.length>0?(t.patientLists=e.responseObject.items,t.pageSize=e.responseObject.pageSize,t.total=e.responseObject.pageCount,e.responseObject.pageCount>1&&(t.showPager=!0),t.noneP=!1):(t.noneP=!0,t.patientLists=[],t.total=0,t.pageSize=10,t.showPager=!1)}})},popupCancle:function(){this.importSuc=!1,this.importErr=!1},popupSucCancle:function(){location.reload()},Iknow:function(){window.location.href="/"},titLen:function(e,t){return t?m.a.getStrLen(m.a.cutLine(e,",","_",","),2*t):m.a.cutLine(e,",","_",",")},tagFn:function(e){if(e){e=e.split(",");for(var t="",s=0;s<e.length;s++)0==s?t="#"+e[0]+"#":t+="#"+e[s]+"#";return t}},getDoctorList:function(){var e=this;13==e.customerRole?m.a.ajax2({url:v,type:"get",data:{paramJson:u()({customerId:e.customerId,firstResult:0,maxResult:9999,customerRole:3,customerState:1,isValid:1})},timeout:3e4,success:function(t){e.showLoading=!1,t&&t.responseObject&&t.responseObject.responseData&&t.responseObject.responseData.dataList?(e.docList=t.responseObject.responseData.dataList,e.docList.unshift({customerName:"全部",customerId:""}),e.choseDoc=e.docList[1].customerName,e.choseDocId=e.docList[1].customerId,e.choseDocSub=e.docList[1].customerId,e.patientList()):(e.docList=[{customerName:"全部",customerId:""}],e.choseDoc=e.docList[0].customerName,e.choseDocId=e.docList[0].customerId,e.choseDocSub=e.docList[0].customerId,e.noneP=!0,e.patientLists=[],e.total=0,e.pageSize=10)}}):12==e.customerRole?(e.docList=[{customerName:"全部",customerId:""}],e.choseDoc=e.docList[0].customerName,e.choseDocId=e.docList[0].customerId,e.choseDocSub=e.docList[0].customerId,e.noneP=!0,e.patientLists=[],e.total=0,e.pageSize=10):(e.docList=[{customerName:"全部",customerId:""},{customerName:e.userName,customerId:e.customerId}],e.choseDoc=e.docList[1].customerName,e.choseDocId=e.docList[1].customerId,e.choseDocSub=e.docList[1].customerId,e.patientList())},docChoseFn:function(e){this.isShowDoc=!this.isShowDoc,this.choseDoc=e.customerName,this.choseDocId=e.customerId},typeChoseFn:function(e){this.choseType=""==e?"全部":1==e?"住院患者":"门诊患者",this.choseTypeId=""==e?"":1==e?"2,5":"1,4",this.isSowType=!this.isSowType},changeDocFn:function(e){1==e?(this.isShowDoc=!this.isShowDoc,this.isSowType=!1):(this.isShowDoc=!1,this.isSowType=!this.isSowType)},submitBtnFn:function(){this.showPager=!1,this.choseDocSub=this.choseDocId,this.choseTypeSub=this.choseTypeId,this.patientList(),this.indexItem=[],this.patChoNum="",this.patientData=[]}},filters:{patientSex:function(e){return 1==e?"男":"女"},titLen:function(e,t){return t?m.a.getStrLen(m.a.cutLine(e,",","_",","),2*t):m.a.cutLine(e,",","_",",")},dateChange:function(e){if(e){var t=e.split("-");return t[1]+"月"+t[2]+"日"}}},metaInfo:{title:"选择患者"}},y=(s(350),s(1)),w=Object(y.a)(f,function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",{staticClass:"alEmr-mainInner"},[s("header-top-nav",{attrs:{crumbsTxt:e.crumbsTxt,pageType:2}}),e._v(" "),s("section",{staticClass:"alEmr-mainIndex",staticStyle:{"padding-left":"0"}},[s("section",{staticClass:"alEmr-indexInner"},[s("div",{staticClass:"patListCon"},[s("div",{staticClass:"selectCont"},[s("div",{staticClass:"selectItem"},[s("span",{staticClass:"docTitle"},[e._v("报到医生")]),e._v(" "),s("div",{staticClass:"docSelect selectResult",on:{click:function(t){t.stopPropagation(),e.changeDocFn(1)}}},[s("input",{attrs:{type:"text",disabled:""},domProps:{value:e.choseDoc}}),e._v(" "),e._m(0),e._v(" "),s("ul",{directives:[{name:"show",rawName:"v-show",value:e.isShowDoc,expression:"isShowDoc"}],staticClass:"docList selectList",staticStyle:{display:"none"}},e._l(e.docList,function(t,a){return s("li",{key:a,on:{click:function(s){s.stopPropagation(),e.docChoseFn(t)}}},[e._v(e._s(t.customerName))])}))])]),e._v(" "),s("div",{staticClass:"selectItem"},[s("span",{staticClass:"docTitle"},[e._v("报到类型")]),e._v(" "),s("div",{staticClass:"docSelect selectResult",on:{click:function(t){t.stopPropagation(),e.changeDocFn(2)}}},[s("input",{attrs:{type:"text",disabled:""},domProps:{value:e.choseType}}),e._v(" "),e._m(1),e._v(" "),s("ul",{directives:[{name:"show",rawName:"v-show",value:e.isSowType,expression:"isSowType"}],staticClass:"docList selectList",staticStyle:{display:"none"}},[s("li",{on:{click:function(t){t.stopPropagation(),e.typeChoseFn("")}}},[e._v("全部")]),e._v(" "),s("li",{on:{click:function(t){t.stopPropagation(),e.typeChoseFn(1)}}},[e._v("住院患者")]),e._v(" "),s("li",{on:{click:function(t){t.stopPropagation(),e.typeChoseFn(2)}}},[e._v("门诊患者")])])])]),e._v(" "),s("span",{staticClass:"subBtn",on:{click:function(t){return t.stopPropagation(),e.submitBtnFn(t)}}},[e._v("筛选")]),e._v(" "),s("div",{class:{importBtn:!0,noneP:e.noneP},on:{click:e.importBtn}},[s("div",{directives:[{name:"show",rawName:"v-show",value:e.impDef,expression:"impDef"}],staticClass:"impDef"},[e._v("\n                            导入 "),s("span",{staticClass:"patChoNum",domProps:{textContent:e._s(e.patChoNum)}})]),e._v(" "),s("span",{directives:[{name:"show",rawName:"v-show",value:e.tipError,expression:"tipError"}],staticClass:"patTip"},[e._v("请先选择一个患者")]),e._v(" "),s("ul",{directives:[{name:"show",rawName:"v-show",value:e.impPro,expression:"impPro"}],staticClass:"impPro"},[s("li"),s("li"),s("li")])])]),e._v(" "),e._l(e.patientLists,function(t,a){return s("section",{staticClass:"patLists"},[s("section",{staticClass:"calendar"},[s("i"),s("span",[e._v(e._s(e._f("dateChange")(t.timeYMD)))])]),e._v(" "),s("ul",e._l(t.dataList,function(t,a){return s("li",{class:{patListItem:!0,unchecked:1==t.isSelected,active:e.indexItem.indexOf(a+"-"+t.caseId)>-1}},[s("span",{staticClass:"patChooBtn",on:{click:function(s){s.stopPropagation(),0==t.isSelected&&e.itemCli(a,t.caseId,t)}}}),e._v(" "),s("span",{class:{patType:!0,typeTwo:14!=t.caseType},domProps:{textContent:e._s(14==t.caseType?"报到患者":"问诊患者")}}),e._v(" "),s("span",{staticClass:"patName",attrs:{title:t.patientName}},[e._v(e._s(e._f("titLen")(t.patientName,4)))]),e._v(" "),s("span",{staticClass:"patSex"},[e._v(e._s(e._f("patientSex")(t.patientSex)))]),e._v(" "),s("span",{staticClass:"patAge"},[e._v(e._s(t.patientAge))]),e._v(" "),s("span",{directives:[{name:"show",rawName:"v-show",value:14==t.caseType,expression:"sonItem.caseType==14"}],staticClass:"patNum200",attrs:{title:e._f("titLen")(t.cell2)}},[e._v(e._s(e._f("titLen")(t.cell2,10)))]),e._v(" "),s("span",{directives:[{name:"show",rawName:"v-show",value:14==t.caseType,expression:"sonItem.caseType==14"}],staticClass:"patNum145",attrs:{title:e._f("titLen")(t.cell3)}},[e._v(e._s(e._f("titLen")(t.cell3,8)))]),e._v(" "),s("span",{directives:[{name:"show",rawName:"v-show",value:14==t.caseType,expression:"sonItem.caseType==14"}],staticClass:"patNum110",attrs:{title:e._f("titLen")(t.customerName)}},[e._v(e._s(e._f("titLen")(t.customerName,6)))]),e._v(" "),s("span",{directives:[{name:"show",rawName:"v-show",value:14==t.caseType,expression:"sonItem.caseType==14"}],staticClass:"patNum1",attrs:{title:e._f("titLen")(e.tagFn(t.cell4))}},[e._v(e._s(t.cell4?e.titLen(e.tagFn(t.cell4),8):""))]),e._v(" "),s("span",{directives:[{name:"show",rawName:"v-show",value:14==t.caseType,expression:"sonItem.caseType==14"}],staticClass:"patNum1",staticStyle:{width:"126px"},attrs:{title:e._f("titLen")(t.cell5)}},[e._v(e._s(e._f("titLen")(t.cell5,8)))]),e._v(" "),s("span",{directives:[{name:"show",rawName:"v-show",value:14!=t.caseType,expression:"sonItem.caseType!=14"}],staticClass:"patNum",attrs:{title:e._f("titLen")(t.caseMain)}},[e._v(e._s(e._f("titLen")(t.caseMain,43)))])])}))])})],2),e._v(" "),s("div",{directives:[{name:"show",rawName:"v-show",value:e.importErr||e.importSuc,expression:"importErr||importSuc"}],staticClass:"patPopupCont"},[s("section",{directives:[{name:"show",rawName:"v-show",value:e.importErr,expression:"importErr"}],staticClass:"importError"},[s("i",{staticClass:"impClose",on:{click:function(t){return t.stopPropagation(),e.popupCancle(t)}}}),e._v(" "),e._m(2),e._v(" "),s("article",{staticClass:"impErrBot"},[s("button",{staticClass:"impCancle",on:{click:function(t){return t.stopPropagation(),e.popupCancle(t)}}},[e._v("取消")]),e._v(" "),s("button",{staticClass:"impAgain",on:{click:e.importBtn}},[e._v("重新上传")])])]),e._v(" "),s("section",{directives:[{name:"show",rawName:"v-show",value:e.importSuc,expression:"importSuc"}],staticClass:"importSuc importError"},[s("i",{staticClass:"impClose",on:{click:function(t){return t.stopPropagation(),e.popupSucCancle(t)}}}),e._v(" "),e._m(3),e._v(" "),s("article",{staticClass:"impErrBot"},[s("button",{staticClass:"impAgain",on:{click:function(t){return t.stopPropagation(),e.Iknow(t)}}},[e._v("知道了")])])])]),e._v(" "),s("div",{directives:[{name:"show",rawName:"v-show",value:e.noneP,expression:"noneP"}],staticClass:"NonePatients"},[s("img",{attrs:{src:"/static/images/pages/choosePatients/nonePatients.png"}}),e._v(" "),s("div",[e._v("\n                    暂无患者\n                ")])]),e._v(" "),e.showPager?s("pagination",{staticStyle:{"margin-top":"35px"},attrs:{pageIndex:e.pageIndex,pageSize:e.pageSize,total:e.total},on:{change:e.pageChange}}):e._e()],1)]),e._v(" "),s("loading",{directives:[{name:"show",rawName:"v-show",value:e.showLoading,expression:"showLoading"}],on:{showLoading:e.showLoading}})],1)},[function(){var e=this.$createElement,t=this._self._c||e;return t("p",[this._v("切换"),t("i",{staticClass:"tabBtn"})])},function(){var e=this.$createElement,t=this._self._c||e;return t("p",[this._v("切换"),t("i",{staticClass:"tabBtn"})])},function(){var e=this.$createElement,t=this._self._c||e;return t("article",{staticClass:"impErrTop"},[t("i"),this._v(" "),t("p",[this._v("导入失败，请检查你的的网络设置")])])},function(){var e=this.$createElement,t=this._self._c||e;return t("article",{staticClass:"impErrTop"},[t("i"),this._v(" "),t("div",[t("p",[this._v("导入成功")]),this._v(" "),t("p",[this._v("\n                                已将选择的患者成功导入到病历中，可在全部病历中查看\n                            ")])])])}],!1,null,null,null).exports;s(44);i.default.use(r.a),new i.default(n()({},w)).$mount("#app")},31:function(e,t,s){},32:function(e,t,s){},350:function(e,t,s){"use strict";var a=s(163);s.n(a).a},37:function(e,t,s){"use strict";var a=s(10);s.n(a).a},39:function(e,t,s){"use strict";s(88),s(85),s(84),s(83)},40:function(e,t,s){"use strict";var a=s(0),n=s(6),i={props:["path","beginPlay","isPopup","codeType"],data:function(){return{Inpath:this.path,isBegin:this.beginPlay,transcodingTxt:"转码中...",codingType:this.codeType?this.codeType:2}},watch:{codeType:function(){var e=this;e.codingType=this.codeType,3==e.codeType?e.transcodingTxt="转码中...":4==e.codeType&&(e.transcodingTxt="转码失败")},beginPlay:function(){var e=this;e.beginPlay&&(e.isBegin=this.beginPlay,(3!=e.codeType&&4!=e.codeType||2==e.codeType)&&(e.Inpath=this.path,setTimeout(function(){n("source").attr("src",e.Inpath),e.pluginCKplayerCode(e.Inpath,e.isPopup)},10)))}},methods:{pluginCKplayerCode:function(e,t){var s=this;t||n("body").addClass("bodyHidden");var i=new AllinmdPlayer("ev-videoArea",{width:600,height:400,poster:"//img10.allinmd.cn/v3/terminal/defaultVideo.jpg",flash:{swf:"//paas.allinmd.cn/modules/allinmdplayer/allinmdplayer.swf"},limitPlayTime:{allow:!1,value:3},setMaxPlayTime:{allow:!1,value:0}},function(){void 0!=i?i.player.play():this.play()});i.player.on("play",function(){a.a.players&&n.each(a.a.players,function(e,t){t.player.pause()})}),i.player.on("ended",function(){setTimeout(function(){n("#ev-BgVideo").length<=0||(t||n("body").removeClass("bodyHidden"),s.isBegin=!1,s.$emit("beginFn",!1),n(".videoPlayerBg").hide(),n("#lightbox").hide(),i.player.dispose(),n("#ev-BgVideo,#bg").remove(),a.a.players&&n.each(a.a.players,function(e,t){t.player.play()}))},1e3)}),n("#videoArea").append('<a class="ev-videoPopUpWindowClose" href="javascript:;" style="display:block;width:42px;height:42px;position:absolute;top:-10px;right:-25px;z-index:12;"><img src="//img00.allinmd.cn/detail/close.png"/></a>').find(".ev-videoPopUpWindowClose").on("click",function(e){n("#ev-BgVideo").length<=0||(t||n("body").removeClass("bodyHidden"),s.isBegin=!1,s.$emit("beginFn",!1),n(".videoPlayerBg").hide(),i.player.dispose(),n("#ev-BgVideo,#bg").remove(),a.a.players&&n.each(a.a.players,function(e,t){t.player.play()}))})},quit:function(){this.isBegin=!1,this.$emit("beginFn",!1),n(".videoPlayerBg").hide(),n("#ev-BgVideo,#bg").remove()}},mounted:function(){}},o=(s(80),s(1)),r=Object(o.a)(i,function(){var e=this,t=e.$createElement,s=e._self._c||t;return e.isBegin?s("div",{staticClass:"videoPlayerBg"},[s("div",{attrs:{id:"ev-BgVideo"}},[s("div",{attrs:{id:"videoArea"}},[s("video",{directives:[{name:"show",rawName:"v-show",value:2==e.codingType,expression:"codingType==2"}],staticClass:"video-js vjs-default-skin vjs-no-flex vjs-big-play-centered",attrs:{id:"ev-videoArea",oncontextmenu:"return false"}},[s("source",{attrs:{src:e.Inpath,type:"video/mp4"}})]),e._v(" "),s("div",{directives:[{name:"show",rawName:"v-show",value:2!=e.codingType,expression:"codingType!=2"}],staticClass:"videoTranscoding"},[s("a",{staticClass:"quitBtn",attrs:{href:"javascript:;"},on:{click:function(t){t.stopPropagation(),e.quit()}}},[s("img",{attrs:{src:"//img00.allinmd.cn/detail/close.png"}})]),e._v(" "),s("span",{domProps:{textContent:e._s(e.transcodingTxt)}})])])]),e._v(" "),s("div",{attrs:{id:"lightbox"}})]):e._e()},[],!1,null,null,null);t.a=r.exports},44:function(e,t,s){"use strict";var a=s(2),n=s.n(a),i=s(8),o=(s(6),s(91));i.default.config.errorHandler=function(e,t,s){var a=function(e){if(e.$root===e)return"root";var t=e._isVue?e.$options&&e.$options.name||e.$options&&e.$options._componentTag:e.name;return(t?"component <"+t+">":"anonymous component")+(e._isVue&&e.$options&&e.$options.__file?" at "+(e.$options&&e.$options.__file):"")}(t),i=t.$options&&t.$options.propsData;o.init({token:"21"}),o.initVueErrorHandle(e,{metaData:{componentName:a,propsData:n()(i),info:s}})}},5:function(e,t,s){"use strict";var a={cache:function(e){localStorage.setItem("EasyWayTempCache",e)},getCache:function(){return localStorage.getItem("EasyWayTempCache")},setItem:function(e,t){localStorage.setItem(e,t)},getItem:function(e){var t=localStorage.getItem(e);return e&&"fromPage"==e&&localStorage.removeItem(e),t},removeItem:function(e){return localStorage.removeItem(e)},clear:function(){localStorage.clear()}};t.a=a},50:function(e,t,s){"use strict";var a=s(13);s.n(a).a},52:function(e,t,s){"use strict";var a=s(14);s.n(a).a},6:function(e,t){e.exports=jQuery},75:function(e,t,s){"use strict";var a=s(26),n=s(19),i=s(20),o={props:{navName:{type:String,default:""},crumbsTxt:{type:String,default:""},pageType:{type:Number,default:2},saveStatus:{type:Number,default:0}},components:{Logo:a.a,UserLogo:i.a,SearchInput:n.a},watch:{},methods:{saveCaseInfo:function(){this.$emit("quitSaveCaseInfo")}},mounted:function(){}},r=(s(99),s(1)),c=Object(r.a)(o,function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("section",{staticClass:"headerTopNav"},[s("logo"),e._v(" "),s("aside",{staticClass:"crumbs"},[s("span",[e._v(e._s(e.crumbsTxt))]),e._v(" "),s("i",{directives:[{name:"show",rawName:"v-show",value:1==e.pageType,expression:"pageType==1"}]}),e._v(" "),s("span",[e._v(e._s(e.navName))])]),e._v(" "),s("aside",{directives:[{name:"show",rawName:"v-show",value:1==e.pageType,expression:"pageType==1"}],staticClass:"saveBtn"},[s("span",{directives:[{name:"show",rawName:"v-show",value:0==e.saveStatus,expression:"saveStatus==0"}],on:{click:e.saveCaseInfo}},[e._v("保存并退出")]),e._v(" "),s("ul",{directives:[{name:"show",rawName:"v-show",value:1==e.saveStatus,expression:"saveStatus==1"}]},[s("li"),s("li"),s("li")]),e._v(" "),s("i",{directives:[{name:"show",rawName:"v-show",value:2==e.saveStatus,expression:"saveStatus==2"}]})]),e._v(" "),s("section",{directives:[{name:"show",rawName:"v-show",value:2==e.pageType,expression:"pageType==2"}],staticClass:"alEmr-headerContainer"},[s("section",{staticClass:"alEmr-headerInner"},[s("SearchInput"),e._v(" "),s("UserLogo")],1)])],1)},[],!1,null,"6ba4477e",null);t.a=c.exports},76:function(e,t,s){"use strict";var a=s(9),n={props:{pageIndex:{type:Number,default:1},pageSize:{type:Number,default:10},total:{type:Number,default:1}},data:function(){return{index:this.pageIndex,size:this.pageSize,count:this.total,pageNumber:""}},methods:{prev:function(){this.index>1&&this.go(this.index-1)},next:function(){this.index<this.count&&this.go(this.index+1)},pageJump:function(){var e=this.pageNumber;this.pageNumber>this.count&&(e=this.count),this.go(e)},go:function(e){this.index===e||isNaN(parseInt(e))||(this.index=parseInt(e),this.$emit("change",this.index))}},computed:{pageList:function(){if(this.count>1){for(var e=[],t=0;t<this.count;t++)e.push(t+1);if(this.count>11)if(this.index<6){var s=this.count-10;e.splice(9,s,"...")}else{var a=this.index-1,n=this.count-this.index-2;if(a>3&&n>3){var i=a-3;e.splice(1,i,"...");var o=n-3;e.splice(this.index+5-i,o,"...")}else{if(a>3){var r=this.index+1-(11-(this.count-this.index));e.splice(1,r,"...")}if(n>3){var c=this.count-10;e.splice(this.index+c,c,"...")}}}return e}}},mounted:function(){},watch:{pageNumber:function(){a.a.testNum(this.pageNumber)||(this.pageNumber="")},pageIndex:function(){this.index=this.pageIndex},pageSize:function(){this.size=this.pageSize},total:function(){this.count=this.total}}},i=(s(101),s(1)),o=Object(i.a)(n,function(){var e=this,t=e.$createElement,s=e._self._c||t;return e.count>1?s("section",{staticClass:"pagination pager"},[s("ul",{staticClass:"pages pgTxCenter"},[s("li",{staticClass:"pgNext pgpre",class:{pgEmpty:1==e.index},on:{click:function(t){return t.stopPropagation(),e.prev(t)}}},[s("i")]),e._v(" "),e._l(e.pageList,function(t){return s("li",{staticClass:"page-number",class:{"page-number-omit":isNaN(parseInt(t)),pgCurrent:e.index==t},on:{click:function(s){s.stopPropagation(),e.go(t)}}},[e._v(e._s(t))])}),e._v(" "),s("li",{staticClass:"pgNext pgAfter",class:{pgEmpty:e.index==e.count},on:{click:function(t){return t.stopPropagation(),e.next(t)}}},[s("i")])],2),e._v(" "),e.count>=14?s("div",{staticClass:"pgJump"},[s("span",[e._v("跳转到：")]),e._v(" "),s("input",{directives:[{name:"model",rawName:"v-model",value:e.pageNumber,expression:"pageNumber"}],staticClass:"pgJumpNumber",attrs:{type:"text"},domProps:{value:e.pageNumber},on:{input:function(t){t.target.composing||(e.pageNumber=t.target.value)}}}),e._v(" "),s("span",{staticClass:"pgText"},[e._v("页")]),e._v(" "),s("input",{staticClass:"pgJumpSubmit",attrs:{type:"button",value:"确定"},on:{click:function(t){return t.stopPropagation(),e.pageJump(t)}}})]):e._e()]):e._e()},[],!1,null,null,null);t.a=o.exports},80:function(e,t,s){"use strict";var a=s(23);s.n(a).a},82:function(e,t,s){"use strict";var a=s(24);s.n(a).a},9:function(e,t,s){"use strict";t.a={testNum:function(e){return/^\d+$/g.test(e)},testName:function(e){return/^[\u4e00-\u9fa5\s\.·-]{1,25}$|^[\@A-Za-z_\s\.·-]{1,50}$|^[A-Za-z\u4e00-\u9fa5]{1,20}$|^[\u4e00-\u9fa5A-Za-z]{1,20}$/.test(e)},testPhoneNum:function(e){return/^1\d{10}$/.test(e)},testID:function(e){var t=!0;if(15==(e=e.toUpperCase()).length)t=!1;else if(e&&/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(e))if({11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江 ",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北 ",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏 ",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外 "}[e.substr(0,2)]){if(18==e.length){e=e.split("");for(var s=[7,9,10,5,8,4,2,1,6,3,7,9,10,5,8,4,2],a=0,n=0;n<17;n++)a+=e[n]*s[n];[1,0,"X",9,8,7,6,5,4,3,2][a%11]!=e[17]&&(t=!1)}}else t=!1;else t=!1;return t},isPInt:function(e){return/^[1-9]*[1-9][0-9]*$/.test(e)},decimals:function(e){return/^\d+(\.\d+)?$/.test(e)},minus:function(e){return/^(\-|\+)?\d+(\.\d+)?$/.test(e)}}},99:function(e,t,s){"use strict";var a=s(31);s.n(a).a}},[[262,0,1]]]);
//# sourceMappingURL=choosePatients.78bb1e6.js.map