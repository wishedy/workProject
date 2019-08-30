$(document).ready(function(){
   var collegeSecond = {
      init:function(){
         var _this = this;
          user.login({
              callback: function() {//getCourseList
                  _this.data.collegeId = comm.getpara().collegeId;
                  _this.data.userId = comm.checkInvalid($('#sesCustomerId').val())?"":$('#sesCustomerId').val();
                  _this.registerHandleBars().openVip().closeWakeDialog().getHeaderInfo().getProduceInfo().changeTab();
              },
              scene: privilegeSceneConst.eSceneTypeLogin,
              onClose: function() {
                  g_sps.jump(null, "/");
              },
              onAuthCancel: "back" // 当点暂不认证时的处理、回退到来源页
          });
      },
      el:{
         tabList:$(".tab-item"),
         banner:$(".al-college-banner"),
         price:$(".al-buyVipBtn .money"),
         scheduleList:$(".al-course-content"),
          buyCourseBtn: $(".buyCourseBtn")
      },
      data:{
          collegeId:0,
         tabIndex:0,
          userId:"",
         headerInfo:{},
          coupon:{}
      },
      path:{
        headerInfo:"/allingateway/base-resource-platform/college/department/getDepartHead/",
         produceInfo:"/allingateway/base-resource-platform/college/department/getDepartInfo/",
         videoCourseList:"/allingateway/base-resource-platform/college/department/getCourseInfo/",
         surgeryCase:"/allingateway/base-resource-platform/college/department/getCaseInfo/"
      },
      registerHandleBars:function(){
        var _this = this;
         Handlebars.registerHelper("state",function(v1,options){
            if(parseInt(v1,10)===2){
               return options.fn(this);
            }else{
               return  '';
            }
         });
         Handlebars.registerHelper("checkCourseType",function(v1,options){
            if(parseInt(v1,10)===2){
               return options.fn(this);
            }else{
               return  '';
            }
         });
         Handlebars.registerHelper("checkSurgery",function(v1,options){
            if(parseInt(v1,10)===3){
               return options.fn(this);
            }else{
               return  '';
            }
         });
         Handlebars.registerHelper("checkVipCourse",function(v1,options){
            if(parseInt(v1,10)===2){
               return options.fn(this);
            }else{
               return  '';
            }
         });
         Handlebars.registerHelper("checkAdvance",function(v1){
            if(parseInt(v1,10)===1){
               return 'advance';
            }else{
               return  '';
            }
         });
        return _this;
      },
      getHeaderInfo:function(){
        var _this = this;

         comm.ajax.async(_this.path.headerInfo, {
             departmentId:_this.data.collegeId,
             opUsr:_this.data.userId,
         }, function(data) {
            _this.data.headerInfo = data.responseData.headInfo;
            _this.data.coupon = data.responseData.coupon;
            _this.el.banner.css({"background":'url("'+_this.data.headerInfo.departmentCover+'") no-repeat center center/cover'});
            if((!$.isEmptyObject(_this.data.headerInfo))&&(parseInt(_this.data.headerInfo.vipState)===0)){
                _this.el.price.html(_this.data.headerInfo.vipDiscountPrice+'元').parent().show();

            }else{
                $(".al-buyVipBtn").hide();
            }
            var couponElement = $(".al-course-price");
            if(_this.data.coupon){
                console.log("有优惠券");
                couponElement.find(".al-price-label").html(_this.data.coupon.name);
            }else{
                console.log("没有优惠券");
                couponElement.hide();
            }

         }, 'false', function() {}, 'GET');
         return _this;
      },
      getProduceInfo:function(){
         var _this = this;
         //console.log('进入逻辑');
         comm.ajax.async(_this.path.produceInfo, {
             departmentId:_this.data.collegeId,
             opUsr:_this.data.userId
         }, function(data) {
            if(data&&data.responseData&&data.responseData.info){
               var dataInfo = data.responseData.info;
               var resultJson = {};
               if(parseInt(dataInfo.type,10)===1){
                  //富文本
                  resultJson.haveImage = false;
                  resultJson.attHtmlContent = dataInfo.detail;
               }else{
                  //图片
                  resultJson.haveImage = true;
                  resultJson.imageSrc = dataInfo.pcDepartPic.indexOf(",")>-1?dataInfo.pcDepartPic.split(","):[dataInfo.pcDepartPic];
               }
               var templateData = {
                  richContent:[
                      resultJson
                  ]
               };
               console.log(templateData);
               var myTemplate = Handlebars.compile($("#richContent").html());
               _this.el.scheduleList.html(myTemplate(templateData));
                _this.el.scheduleList.removeClass("al-college-schedule").removeClass("al-surgery-case");
            }

         }, 'false', function() {}, 'GET');
         return _this;
      },
      getVideoList:function(){
        var _this = this;
         comm.ajax.async(_this.path.videoCourseList, {
             departmentId:_this.data.collegeId,
             opUsr:_this.data.userId
         }, function(data) {
            if(data&&data.responseData&&data.responseData.courseList&&data.responseData.courseList.length){
               var dataInfo = data.responseData;
               var myTemplate = Handlebars.compile($("#courseList").html());
               _this.el.scheduleList.html(myTemplate(dataInfo)).css({"background":"#fff"});
               _this.el.scheduleList.removeClass("al-surgery-case").addClass("al-college-schedule");
               $(".buyBtn").off("click").on("click",function(){
                  _this.wakeUpApp();
               });
               $(".schedule-item .user-logo,.schedule-item .title,.schedule-item .des").off("click").on("click",function(){
                   console.log('跳转课程');
                   var nowElement = $(this);
                   var element = null;
                   var courseId = 0;
                   if(nowElement.hasClass("schedule-item")){
                       element = nowElement;
                       courseId = element.attr("data-courseId");
                   }else{
                       element = $(nowElement).parents(".schedule-item");
                       courseId = element.attr("data-courseId");
                   }
                   var   courseType = parseInt(element.attr("dats-courseType"),10);
                   if((!isNaN(courseType))&&(courseType===3)){
                       g_sps.jump(null,"//http://www.allinmd.cn/pages/operate/operate_index.html?collegeId="+_this.data.collegeId);
                   }else{
                       var href = "//www.allinmd.cn/pages/college/college_schedule.html?courseId="+courseId;
                       comm.creatEvent({
                           triggerType:"PC二级学院",
                           keyword:'点击会员课',
                           browType:443,
                           actionId:11909,
                           refId:courseId
                       });
                       g_sps.jump(null,href);
                   }
               });
            }

         }, 'false', function() {}, 'GET');
         return _this;
      },
      getSurgeryCase:function(){
         var _this = this;
         comm.ajax.async(_this.path.surgeryCase, {
             departmentId:_this.data.collegeId,
             opUsr:_this.data.userId,
             offset:0,
             limit:1000
         }, function(data) {
            if(data&&data.responseData&&data.responseData.dataList&&data.responseData.dataList.length){
               var dataInfo = data.responseData;
               var myTemplate = Handlebars.compile($("#surgeryList").html());
               _this.el.scheduleList.html(myTemplate(dataInfo)).css({"background":"#fff"});
               _this.el.scheduleList.removeClass("al-college-schedule").addClass("al-surgery-case");
               if(data.responseData.dataList.length===parseInt(data.responseData.totalCount,10)){
                  //已经加载完毕
               }else{
                  //未更新完毕
                  $(".surgery-case-more").remove();
                  _this.el.scheduleList.append('<section class="surgery-case-more">\n' +
                      '                    <i class="icon"></i>\n' +
                      '                    <em>持续更新更多精彩课程</em>\n' +
                      '                </section>');
               }
               $("[data-href]").off("click").on("click",function(){
                   var _thisElement = $(this);
                   comm.creatEvent({
                       triggerType:"PC二级学院",
                       keyword:'点击手术实例课',
                       browType:443,
                       actionId:11910,
                       browTypeUrl:_thisElement.attr('data-href'),
                       refId:_thisElement.attr("data-videoId")
                   });
                   g_sps.jump(null,_thisElement.attr('data-href'));
               });
            }

         }, 'false', function() {}, 'GET');
         return _this;
      },
      wakeUpApp:function(){
        var _this = this;
         $(".al-downLoadContent figcaption").text('\n' +
             '打开唯医骨科app，尽享唯医学院精品内容');
         $('.Ev-al-downLoad_PopBox').show();
         $("body").css({"overflow":"hidden"});
         return _this;
      },
      closeWakeDialog:function(){
        var  _this = this;
        $(".Ev-closePopBtn").off("click").on("click",function(){
           $(".al-downLoad_PopBox").hide();
            $("body").css({"overflow":"auto"});
        });
        return _this;
      },
      openVip:function(){
        var  _this = this;
        $(".al-buyVipBtn").off("click").on("click",function(){

            comm.creatEvent({
                triggerType:"PC二级学院",
                keyword:'点击购买按钮',
                browType:443,
                actionId:11911,
                refId:_this.collegeId
            });
           _this.wakeUpApp();
        });
        _this.el.buyCourseBtn.off("click").on("click",function(){
            comm.creatEvent({
                triggerType:"PC二级学院",
                keyword:'点击领取优惠券按钮',
                browType:443,
                actionId:11912,
                refId:_this.collegeId
            });
            _this.wakeUpApp();
        });
        return _this;
      },
      changeTab:function(){
         var _this = this;
         _this.el.tabList.off("click").on("click",function(){
            var _thisElement = $(this);
            //_this.el.scheduleList.empty();
            _thisElement.addClass("active").siblings().removeClass('active');
            _this.data.tabIndex = _thisElement.index();
            switch (parseInt(_this.data.tabIndex,10)) {
               case 0:
                  //_this.el.chatBar.hide();
                  //_this.el.pagerBar.empty();
                  _this.getProduceInfo();//请求课程简介
                  break;
               case 1:
                  //_this.el.chatBar.hide();
                  _this.getVideoList();//请求课程表
                  break;
               case 2:
                  //_this.el.pagerBar.empty();
                  _this.getSurgeryCase();//请求手术案例
                  break;
            }
         });
         return _this;
      }
   } ;
   collegeSecond.init();
});
