(window.webpackJsonp=window.webpackJsonp||[]).push([[3],{554:function(t,e,i){"use strict";var a=function(){var i=this,t=i.$createElement,a=i._self._c||t;return a("section",{staticClass:"wrapper"},[a("div",{class:{attCodeRedColor:i.activeAttCode.isNew},staticStyle:{position:"relative","margin-left":"30px","margin-top":"40px","margin-bottom":"10px"}},[i._m(0),i._v(" "),a("span",{staticStyle:{float:"left",position:"relative","margin-left":"22px",top:"18px","font-size":"14px","z-index":"1"}},[i._v("编号:")]),i._v(" "),i.activeAttCode.isNew?a("el-input",{staticClass:"attCode",attrs:{type:"text",readonly:i.activeAttCode.isNew||!i.isNeedEdit},model:{value:i.activeAttCode.updateAttCode,callback:function(t){i.$set(i.activeAttCode,"updateAttCode",t)},expression:"activeAttCode.updateAttCode"}}):i._e(),i._v(" "),i.activeAttCode.isNew?i._e():a("el-input",{staticClass:"attCode",attrs:{type:"text",readonly:i.activeAttCode.isNew||!i.isNeedEdit},model:{value:i.activeAttCode.attCode,callback:function(t){i.$set(i.activeAttCode,"attCode",t)},expression:"activeAttCode.attCode"}}),i._v(" "),!i.isNeedEdit||6!==parseInt(i.activeAttCode.attType)&&8!==parseInt(i.activeAttCode.attType)&&13!==parseInt(i.activeAttCode.attType)?i._e():a("span",[i._v("证件时间:")]),i._v(" "),!i.isNeedEdit||6!==parseInt(i.activeAttCode.attType)&&8!==parseInt(i.activeAttCode.attType)&&13!==parseInt(i.activeAttCode.attType)?i._e():a("el-date-picker",{attrs:{type:"date","value-format":"yyyy-MM-dd",placeholder:"选择日期","picker-options":i.dataPickerOptions},model:{value:i.activeAttCode.attRecDate,callback:function(t){i.$set(i.activeAttCode,"attRecDate",t)},expression:"activeAttCode.attRecDate"}})],1),i._v(" "),a("section",{staticClass:"imgShow"},[a("div",{staticClass:"swiper-container gallery-top"},[a("div",{staticClass:"swiper-wrapper"},i._l(i.attList,function(e,t){return a("div",{key:t,staticClass:"swiper-slide swiper-no-swiping"},[a("div",[(e.isNew?e.updateAttPath:e.attPath)?a("img",{attrs:{src:e.isNew?e.updateAttPath:e.attPath},on:{click:function(t){i.showBigImgOnClick(e)},mouseover:i.imgMouseOverHandle,mouseout:i.imgMouseOutHandle}}):i._e()])])})),i._v(" "),a("div",{staticClass:"rotate-control-box",class:{"transparent-effect-open":!i.rotateControlActive,"transparent-effect-close":i.rotateControlActive},on:{mouseover:i.imgMouseOverHandle,mouseout:i.imgMouseOutHandle}},[a("div",{staticClass:"rotate-left",on:{click:i.turnLeft}}),i._v(" "),a("div",{staticClass:"rotate-right",on:{click:i.turnRight}})])]),i._v(" "),a("div",{staticClass:"swiper-container gallery-thumbs"},[a("div",{staticClass:"swiper-wrapper"},i._l(i.attList,function(e,t){return a("div",{key:t,class:[e.isNew?"swiper-slide isNew":"swiper-slide"]},[(e.isNew?e.updateAttPath:e.attPath)?a("img",{attrs:{src:e.isNew?e.updateAttPath:e.attPath,index:t}}):i._e(),i._v(" "),i.ifBoolean&&e.attName?a("p",[i._v(i._s(e.attName))]):i._e(),i._v(" "),!i.ifBoolean&&e.isFirst?a("p",[i._v(i._s(i.attTypeFormat(e.isNew?e.updateAttType:e.attType)))]):i._e(),i._v(" "),"memberAuditChangeDetail"!==i.pageName||e.isNew&&!i.ifBoolean?a("div",{on:{click:function(t){i.updateCartImgOnclick(e)}}},[i._m(1,!0)]):i._e()])}))]),i._v(" "),a("div",{staticClass:"swiper-button-next swiper-button-white"}),i._v(" "),a("div",{staticClass:"swiper-button-prev swiper-button-white"})]),i._v(" "),a("input",{ref:"cerImg_img_upload",staticStyle:{display:"none"},attrs:{type:"file"},on:{change:i.cerImgInputChangeHandle}}),i._v(" "),a("CertImgShowBig",{attrs:{src:i.showBigData.url,isReadOnly:i.showBigData.isReadOnly,title:i.showBigData.title,visible:i.showBigData.visible},on:{closeShowBig:i.closeShowBigHandle,switchPrevEvent:i.switchPrevEventHandle,switchNextEvent:i.switchNextEventHandle}})],1)};a._withStripped=!0;var n=i(68),o=i(699),s=i.n(o),r=(i(522),i(59)),l=i(563),p=i(705),c=i(69),d={name:"cert-img-show-horizon",props:{attList:{type:Array},customerId:{type:String},isNeedEdit:{type:Boolean},pageName:{type:String},ifBoolean:{type:Boolean,default:!1}},components:{CertImgShowBig:p.a},data:function(){return{dataPickerOptions:{disabledDate:function(t){return t.getTime()>Date.now()}},topSwiper:null,thumbSwiper:null,activeAttCode:"",isChangePage:!1,imgDomRotateController:null,imgDomRotateData:{currentIndex:-1,parentWidth:500,parentHeight:435},showBigData:{url:"",isReadOnly:!1,title:"",visible:!1},rotateControlActive:!1,certImgFileData:{}}},methods:{attTypeFormat:function(t){var e="";switch(parseInt(t)){case 1:e="身份证";break;case 2:e="军官证";break;case 3:e="文职干部证";break;case 4:e="驾照";break;case 5:e="护照";break;case 6:e="医师资格证";break;case 7:e="医学学位证";break;case 8:e="医师执业证";break;case 9:e="毕业证";break;case 10:e="工作证（学生证）";break;case 11:e="工作证";break;case 12:e="学生证";break;case 13:e="医师职称证";break;case 14:e="住院医师规范化培训合格证";break;case 15:e="护士执业证";break;case 16:e="专业技术资格证";break;default:e=""}return e},initSwiper:function(){var e=this;this.galleryTop=new s.a(".gallery-top",{direction:"vertical",spaceBetween:10,observer:!0}),this.galleryThumbs=new s.a(".gallery-thumbs",{direction:"vertical",spaceBetween:24,centeredSlides:!0,slidesPerView:"auto",touchRatio:1,slideToClickedSlide:!0,nextButton:".swiper-button-next",prevButton:".swiper-button-prev",observer:!0,onTap:function(t){e.activeAttCode=e.attList&&0<e.attList.length&&e.attList[t.activeIndex]?e.attList&&0<e.attList.length&&e.attList[t.activeIndex]:""},onInit:function(){this.activeAttCode=this.attList&&this.attList[0]?this.attList&&this.attList[0]&&this.attList[0]:""},onSlideChangeEnd:function(t){e.initTopSwiperImgStyle(),e.activeAttCode=e.attList&&0<e.attList.length&&e.attList[t.activeIndex]?e.attList&&0<e.attList.length&&e.attList[t.activeIndex]:""}}),this.galleryTop.params.control=this.galleryThumbs,this.galleryThumbs.params.control=this.galleryTop},imgMouseOverHandle:function(){this.rotateControlActive=!0},imgMouseOutHandle:function(){this.rotateControlActive=!1},turnLeft:function(){if(this.imgRotateController.imgElement){if(this.imgDomRotateData.currentIndex!==this.topSwiper.activeIndex){this.imgDomRotateData.currentIndex=this.topSwiper.activeIndex;var t=this.topSwiper.slides[this.topSwiper.activeIndex].getElementsByTagName("img")[0];this.imgRotateController.init(t,this.imgDomRotateData.parentWidth,this.imgDomRotateData.parentHeight)}}else{this.topSwiper=this.galleryTop,this.imgDomRotateData.currentIndex=this.topSwiper.activeIndex;var e=this.topSwiper.slides[this.topSwiper.activeIndex].getElementsByTagName("img")[0];this.imgRotateController.init(e,this.imgDomRotateData.parentWidth,this.imgDomRotateData.parentHeight)}this.imgRotateController.rotate(-90)},turnRight:function(){if(this.topSwiper=this.galleryTop,this.imgRotateController.imgElement){if(this.imgDomRotateData.currentIndex!==this.topSwiper.activeIndex){this.imgDomRotateData.currentIndex=this.topSwiper.activeIndex;var t=this.topSwiper.slides[this.topSwiper.activeIndex].getElementsByTagName("img")[0];this.imgRotateController.init(t,this.imgDomRotateData.parentWidth,this.imgDomRotateData.parentHeight)}}else{this.imgDomRotateData.currentIndex=this.topSwiper.activeIndex;var e=this.topSwiper.slides[this.topSwiper.activeIndex].getElementsByTagName("img")[0];this.imgRotateController.init(e,this.imgDomRotateData.parentWidth,this.imgDomRotateData.parentHeight)}this.imgRotateController.rotate(90)},showBigImgOnClick:function(t){this.showBigData.visible=!0,this.showBigData.url=t.isNew?t.updateAttPath.replace("_c",""):t.attPath.replace("_c",""),this.showBigData.isReadOnly=!!t.isChangePage,this.showBigData.title=t.attCode,this.showBigData.title=this.activeAttCode.isNew?t.updateAttCode:t.attCode},closeShowBigHandle:function(t){this.showBigData.visible=!1,this.showBigData.isReadOnly||(this.activeAttCode.isNew?this.activeAttCode.updateAttCode=t:this.activeAttCode.attCode=t)},switchPrevEventHandle:function(){this.galleryTop.slidePrev(),this.showBigImgOnClick(this.attList[this.galleryTop.activeIndex])},switchNextEventHandle:function(){this.galleryTop.slideNext(),this.showBigImgOnClick(this.attList[this.galleryTop.activeIndex])},initTopSwiperImgStyle:function(){var t=this;if(this.topSwiper=this.galleryTop,this.topSwiper&&0<this.topSwiper.slides.length){this.imgDomRotateData.currentIndex=this.topSwiper.activeIndex;var e=this.topSwiper.slides[this.topSwiper.activeIndex].getElementsByTagName("img")[0];if(e)if(0===e.width){var i=new Image;i.src=e.src,i.onload=function(){t.imgRotateController.init(e,t.imgDomRotateData.parentWidth,t.imgDomRotateData.parentHeight)}}else this.imgRotateController.init(e,this.imgDomRotateData.parentWidth,this.imgDomRotateData.parentHeight)}},updateCartImgOnclick:function(){if(this.isLoading)return!1;this.$refs.cerImg_img_upload.click()},cerImgInputChangeHandle:function(t){var e=this,i=t.target.files[0];if(!i)return!1;if(!this.cerImgFormatCheck(i))return!1;this.certImgFileData.extName=i.type,this.certImgFileData.file=i;var a=new FileReader;a.onload=function(t){e.certImgFileData.fileContent=a.result,e.cerImgUploadImg()},a.readAsDataURL(i)},cerImgFormatCheck:function(t){var e="image/jpeg"===t.type||"image/jpg"===t.type||"image/png"===t.type,i=t.size/1024/1024<5;return e?!!i||(this.$message.error("上传图片大小不超过5M"),!1):(this.$message.error("上传图片仅支持JPG/JPEG/PNG格式"),!1)},cerImgUploadImg:function(){var a=this;n.default.openLoading("图片上传中..."),this.$refs.cerImg_img_upload.value=null,"memberAuditChangeDetail"===this.pageName?Object(r.a)({method:c.a.memberAuditDetailCardImgUpload.type,url:c.a.memberAuditDetailCardImgUpload.url,data:{fileContent:this.certImgFileData.fileContent.split(",")[1],extName:this.certImgFileData.extName.split("/")[1],customerId:this.customerId,attType:this.activeAttCode.attType,attPositionType:this.activeAttCode.attPositionType}}).then(function(t){if(t&&t.data.responseObject&&!0===t.data.responseObject.responseStatus&&t.data.responseObject.responseData){var e=t.data.responseObject.responseData.data_list.attUrl,i={};i=a.activeAttCode.isNew?(a.activeAttCode.updateAttPath=URL.createObjectURL(a.certImgFileData.file),{id:a.activeAttCode.id,updateAttPath:e}):(a.activeAttCode.attPath=URL.createObjectURL(a.certImgFileData.file),{id:a.activeAttCode.id,attPath:e}),Object(r.a)({method:c.a.memberAuditDetailFourCardImgChange.type,url:c.a.memberAuditDetailFourCardImgChange.url,data:i}).then(function(t){t&&t.data&&t.data.responseObject&&t.data.responseObject.responseStatus?a.$message.success("图片保存成功！"):a.$message.error("图片保存失败！"),n.default.closeLoading()}).catch(function(){n.default.closeLoading(),a.$message.error("图片保存失败！")})}else a.$message.error("图片上传失败！"),n.default.closeLoading()}).catch(function(){a.$message.error("图片上传失败！"),n.default.closeLoading()}):Object(r.a)({method:c.a.memberAuditDetailFourCardImgUpload.type,url:c.a.memberAuditDetailFourCardImgUpload.url,data:{fileContent:this.certImgFileData.fileContent.split(",")[1],extName:this.certImgFileData.extName.split("/")[1],customerId:this.customerId,attCode:this.activeAttCode.attCode,attType:this.activeAttCode.attType,attPositionType:this.activeAttCode.attPositionType}}).then(function(t){if(t&&t.data.responseObject&&!0===t.data.responseObject.responseStatus&&t.data.responseObject.responseData){var e=t.data.responseObject.responseData.customer_auth_attachment;for(var i in a.activeAttCode)e[i]&&(a.activeAttCode[i]=e[i]);a.$message.success("图片上传成功！")}else a.$message.error("图片上传失败！");n.default.closeLoading()}).catch(function(){n.default.closeLoading(),a.$message.error("图片上传失败！")})}},watch:{attList:function(t,e){var i=[];if(0<t.length){for(var a=0;a<t.length;a++)t[a].isNew?(i[t[a].updateAttType]||(i[t[a].updateAttType]=[],t[a].isFirst=!0),t[a].index=a,i[t[a].updateAttType].push(t[a])):(i[t[a].attType]||(i[t[a].attType]=[],t[a].isFirst=!0),t[a].index=a,i[t[a].attType].push(t[a]));this.initTopSwiperImgStyle()}this.activeAttCode=this.attList&&this.attList[0]?this.attList&&this.attList[0]&&this.attList[0]:"",this.attList=t,this.isChangePage=!!(this.attList&&this.attList[0]&&this.attList[0].isChangePage)},isNeedEdit:function(t,e){this.isNeedEdit=t},"activeAttCode.attCode":function(t,e){for(var i=0;i<this.attList.length;i++){var a=this.attList[i];this.activeAttCode.attType===a.attType&&this.activeAttCode.attPositionType!==a.attPositionType&&(a.attCode=t)}},"activeAttCode.attRecDate":function(t,e){switch(parseInt(this.activeAttCode.attType)){case 6:this.$emit("setAttRecDateParams",{certRecDate:t});break;case 8:this.$emit("setAttRecDateParams",{pracRecDate:t});break;case 13:this.$emit("setAttRecDateParams",{titleRecDate:t})}for(var i=0;i<this.attList.length;i++){var a=this.attList[i];this.activeAttCode.attType===a.attType&&this.activeAttCode.attPositionType!==a.attPositionType&&(a.attRecDate=t)}}},mounted:function(){this.imgRotateController=new l.a,this.initSwiper()},updated:function(){}},h=(i(729),i(58)),g=Object(h.a)(d,a,[function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticStyle:{width:"15px",height:"14px",float:"left",top:"18px",position:"absolute","z-index":"1"}},[e("img",{attrs:{src:"/static/images/icons/icon-edit.png",alt:""}})])},function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("p",[t._v("\n            替换图片"),i("i",{staticClass:"el-icon-sort el-icon--right"})])}],!1,null,null,null);g.options.__file="src/views/customRelation/components/CertImgShowHorizon.vue";e.a=g.exports},565:function(t,e,i){var a=i(730);"string"==typeof a&&(a=[[t.i,a,""]]);var n={hmr:!0,transform:void 0,insertInto:void 0};i(156)(a,n);a.locals&&(t.exports=a.locals)},729:function(t,e,i){"use strict";var a=i(565);i.n(a).a},730:function(t,e,i){(t.exports=i(155)(!1)).push([t.i,'\n@charset "UTF-8";\n.attCode {\n  width: 220px !important;\n}\n.attCode input {\n    border: 0px;\n    padding: 0;\n    padding-top: 10px;\n}\n.wrapper {\n  /*证件时间*/\n}\n.wrapper > p {\n    font-family: PingFangSC-Regular;\n    font-size: 15px;\n    color: #2C343A;\n    letter-spacing: 0;\n    line-height: 15px;\n    padding-left: 55px;\n    margin: 40px 0 16px;\n    position: relative;\n}\n.wrapper > p:before {\n      padding: 0;\n      margin: 0;\n      display: block;\n      content: "";\n      width: 15px;\n      height: 15px;\n      background: url("/static/images/icons/icon-edit.png") 50% 50% no-repeat;\n      position: absolute;\n      left: 30px;\n      top: 0;\n}\n.wrapper .el-date-editor.el-input {\n    width: 150px;\n}\n.imgShow {\n  width: 820px;\n  margin: 0 auto;\n  height: 435px;\n  /*border: 1px solid red;*/\n  position: relative;\n}\n.imgShow .swiper-container {\n    width: 100%;\n    height: 300px;\n    margin-left: auto;\n    margin-right: auto;\n}\n.imgShow .swiper-slide {\n    background-size: cover;\n    background-position: center;\n}\n.imgShow .gallery-top {\n    height: 100%;\n    width: 61%;\n    float: left;\n    position: relative;\n}\n.imgShow .gallery-top .swiper-slide {\n      box-sizing: border-box;\n      width: 100%;\n      text-align: center;\n      display: table;\n}\n.imgShow .gallery-top .swiper-slide div {\n        display: table-cell;\n        vertical-align: middle;\n}\n.imgShow .gallery-top .swiper-slide div img {\n          width: auto;\n          height: auto;\n          max-width: 500px;\n          max-height: 435px;\n}\n.imgShow .gallery-top .rotate-control-box {\n      width: 96px;\n      height: 40px;\n      display: flex;\n      justify-content: space-between;\n      z-index: 99;\n      position: absolute;\n      bottom: 14px;\n      left: 50%;\n      transform: translateX(-50%);\n}\n.imgShow .gallery-top .rotate-control-box div {\n        cursor: pointer;\n        width: 44px;\n        height: 44px;\n        border-radius: 22px;\n}\n.imgShow .gallery-top .rotate-control-box .rotate-left {\n        background: #ffffff url(/static/images/icons/icon-turn-left-black.png) center no-repeat;\n}\n.imgShow .gallery-top .rotate-control-box .rotate-left:active {\n          background: #4B67D6 url(/static/images/icons/icon-turn-left-white.png) center no-repeat;\n}\n.imgShow .gallery-top .rotate-control-box .rotate-right {\n        background: #ffffff url(/static/images/icons/icon-turn-right-black.png) center no-repeat;\n}\n.imgShow .gallery-top .rotate-control-box .rotate-right:active {\n          background: #4B67D6 url(/static/images/icons/icon-turn-right-white.png) center no-repeat;\n}\n.imgShow .gallery-thumbs {\n    padding: 0 50px;\n    height: 100%;\n    width: 39%;\n    box-sizing: border-box;\n}\n.imgShow .gallery-thumbs .swiper-slide {\n      width: 120px;\n      height: 90px;\n      box-sizing: border-box;\n      position: relative;\n}\n.imgShow .gallery-thumbs .swiper-slide img {\n        width: 100%;\n        height: 100%;\n}\n.imgShow .gallery-thumbs .swiper-slide.swiper-slide-active {\n        border: 1px solid blue;\n        background: #FFFFFF;\n        box-shadow: 0 4px 10px 0 rgba(42, 53, 102, 0.3);\n        border-radius: 4px;\n}\n.imgShow .gallery-thumbs .swiper-slide.isNew {\n        border: 4px solid red;\n}\n.imgShow .gallery-thumbs .swiper-slide > p {\n        font-family: PingFangSC-Regular;\n        font-size: 13px;\n        color: #BCC2CC;\n        letter-spacing: 0;\n        line-height: 15px;\n        left: 150px;\n        top: -80px;\n        position: relative;\n        writing-mode: vertical-rl;\n        cursor: pointer;\n}\n.imgShow .gallery-thumbs .swiper-slide > p::before {\n          content: "";\n          display: block;\n          width: 9px;\n          height: 3px;\n          color: #BCC2CC;\n          position: absolute;\n          opacity: 0.2;\n          background: #BCC2CC;\n          left: 50%;\n          top: -8px;\n          transform: translateX(-50%);\n}\n.imgShow .gallery-thumbs .swiper-slide > div {\n        position: absolute;\n        left: 0;\n        bottom: 0;\n        width: 74px;\n        height: 22px;\n        background: black;\n        opacity: 0.5;\n        padding-left: 6px;\n}\n.imgShow .gallery-thumbs .swiper-slide > div p {\n          font-size: 12px;\n          font-family: PingFangSC-Regular;\n          font-weight: 400;\n          color: white;\n          line-height: 22px;\n          cursor: pointer;\n          opacity: 1;\n}\n.imgShow .swiper-button-prev, .imgShow .swiper-button-next {\n    position: absolute;\n    left: 574px;\n    width: 40px;\n    height: 22px;\n    margin-top: -11px;\n    z-index: 3;\n    cursor: pointer;\n    opacity: 0.2;\n    border-radius: 1px;\n}\n.imgShow .swiper-button-prev.swiper-button-white, .imgShow .swiper-container-rtl .swiper-button-next.swiper-button-white {\n    top: 0;\n    transform: translateX(50%);\n    background-size: 40px 24px;\n    background: #4A5B6F url(/static/images/icons/icon-arrow-white-up.png) center center no-repeat;\n}\n.imgShow .swiper-button-next.swiper-button-white, .imgShow .swiper-container-rtl .swiper-button-next.swiper-button-white {\n    margin-top: 0;\n    top: auto;\n    bottom: 0;\n    margin-bottom: -11px;\n    transform: translateX(50%);\n    background-size: 40px 24px;\n    background: #4A5B6F url(/static/images/icons/icon-arrow-white-down.png) center center no-repeat;\n}\n.attCodeRedColor {\n  color: red;\n}\n.attCodeRedColor .el-input__inner {\n    color: red;\n}\n.transparent-effect-open {\n  opacity: 0.1;\n}\n.transparent-effect-close {\n  opacity: 1;\n}\n',""])}}]);