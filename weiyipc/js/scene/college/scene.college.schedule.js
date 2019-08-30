$(document).ready(function(){
    var collegeSchedule = {
        path:{
            // videoList:'/mock/call/college/course/getVideoList/',
            // produce:'/call/college/course/getCourseDescribe/',
            // coupon:'/mock/call/coupon/maxReceivableCoupon'
            "share": PC_CALL + 'comm/data/share/getMapList3/',//分享接口
            videoList:'/allingateway/base-resource-platform/college/course/getCourseDetail',
            produce:'/call/college/course/getCourseDescribe/',
            coupon:'/call/coupon/getMaxReceivableCoupon/'
        },
        data:{
            courseId:comm.getpara().courseId,
            payState:0,
            couponInfo:{},
            tabIndex:0,
            richContent:{}
        },
        el:{
            courseDesc:$(".course-subTitle"),
            buyCourseBtn:$(".buyCourseBtn"),
            discountCoupon:$(".al-course-price.price-bar"),
            priceBar:$(".price-bar"),
            bannerHeader:$(".al-course-price"),
            topHeader:$(".al-college-headerTab"),
            chatBar:$(".ev-listMore"),
            price:$(".real-price em"),
            courseTitle:$(".course-mainTitle"),
            bannerContainer:$(".al-college-banner"),
            tabList:$(".tab-item"),
            scheduleList:$(".al-schedule-list"),
            pagerBar:$(".pager")
        },
        init:function(){
            var _this = this;

            user.login({
                callback: function() {//getCourseList
                    _this.registerHandel().getVideoList().changeTab().getMyCoupon();
                },
                scene: privilegeSceneConst.eSceneTypeLogin,
                onClose: function() {
                    g_sps.jump(null, "/");
                },
                onAuthCancel: "back" // 当点暂不认证时的处理、回退到来源页
            });
        },
        getProduceContent:function(){
            var _this = this;
            comm.ajax.async(_this.path.produce, {
                paramJson:$.toJSON({
                    customerId:$('#sesCustomerId').val()!=""&&$('#sesCustomerId').val()!=undefined?$('#sesCustomerId').val():"",
                    courseId:_this.data.courseId,
                    attType:5
                })
            }, function (data) {
                if(data&&data.responseObject&&data.responseObject.responseData&&data.responseObject.responseData.dataList&&data.responseObject.responseData.dataList.length){
                    $.each(data.responseObject.responseData.dataList,function(index,item){
                        //console.log(index,item);
                        if(parseInt(item.courseDescribeType,10)===1){
                            item.haveImage = true;
                            var imageList = [];
                            for(var num = 0;num<item.coursePicList.length;num++){
                                    imageList.push({
                                        imageSrc:item.coursePicList[num]
                                    });
                            }
                            item.coursePicList = imageList;
                        }else{
                            item.haveImage = false;
                        }
                    })
                    var cacheData=data.responseObject.responseData.dataList;
                    _this.data.richContent  = cacheData;
                    //console.log(_this.data.richContent);
                    _this.templateRichContent();
                }
            },'true',function(){},'GET');
            return _this;
        },
        shareInit: function (data) {
            var t = this;
            //console.log('------')
            var param = {
                "sceneType": 99,          //
                "visitSiteId": 1,           //1-PC
                'sessionCustomerId': $('#sesCustomerId').val()!=""&&$('#sesCustomerId').val()!=undefined?$('#sesCustomerId').val():"",
                customerId: $('#sesCustomerId').val()!=""&&$('#sesCustomerId').val()!=undefined?$('#sesCustomerId').val():"",
                courseName:data.courseName,
                teacherName:data.teacherName,
                courseId:t.data.courseId,
                appCoverPicUrl:data.appCoverPicUrl
            };
            //var o = $.extend(param, {"sceneType": shareType});
            var sinaTitle = "";
            var qqTitle = "";
            var qZoneTitle = "";
            module.share({
                container: $(".ev-shareContainer"),// 存放分享组件的父级
                type: 2,// 默认为 1  1 ：社交分享  2 ：页面左下角全站分享
                url: document.location.href,// 分享链接， 默认取当前页链接
                h5Url: document.location.href,//h5页面的链接会生成微信二维码
                title: "",// 分享标题
                shareTrend: 0,//0: 不需要站内动态分享  1 ：需要站内动态分享
                trendUrl: '',// 分享到站内动态的接口
                data: {},// 分享到站内动态的接口参数
                callback: function () {
                },// 分享到站内动态成功后回调函数
                triggerRequest: function (content) {//事件点击
                    $.ajax({
                        url: t.path.share,
                        type: "post",
                        data: {paramJson: $.toJSON(param)},
                        dataType: 'json',
                        async: false,
                        success: function (d) {
                            if (d && d.responseObject.responseData && !$.isEmptyObject(d.responseObject.responseData) && d.responseObject.responseData.data_list.length) {
                                var item = d.responseObject.responseData.data_list[0];
                                content.pic = item.share_comm.shareImageUrl;
                                content.title = item.share_comm.shareTitle != "" ? item.share_comm.shareTitle : document.title;
                                $.each(item.share_channel, function (i, el) {
                                    if (el.shareChannel == 'Sina') {
                                        sinaTitle = content.sinaTitle = el.shareDesc;
                                    } else if (el.shareChannel == "QQFriend") {
                                        qqTitle = content.qqTitle = el.shareTitle;
                                        content.qqSummary = el.shareDesc;
                                    } else if (el.shareChannel == "QZone") {
                                        qZoneTitle = content.qqZoneTitle = el.shareTitle;
                                        content.qqZoneSummary = el.shareDesc;
                                    }
                                });
                            }
                        }

                    });
                },
                shareSinaSuc: function () {
                    comm.shareLog({
                        shareType: "",
                        resourceId: "",
                        resourceType: "",
                        refId: "",
                        shareSence: shareSenceConst.discover_by_subject,
                        shareChannel: 3,
                        shareContent: sinaTitle
                    });
                },
                shareQQSuc: function () {
                    comm.shareLog({
                        shareType: "",
                        resourceId: "",
                        resourceType: "",
                        refId: "",
                        shareSence: shareSenceConst.discover_by_subject,
                        shareChannel: 2,
                        shareContent: qqTitle
                    });
                },
                shareQzoneSuc: function () {
                    comm.shareLog({
                        shareType: "",
                        resourceId: "",
                        resourceType: "",
                        refId: "",
                        shareSence: shareSenceConst.discover_by_subject,
                        shareChannel: 1,
                        shareContent: qZoneTitle
                    });
                }
            });
        },
        templateRichContent:function(){
          var _this = this;
            var myTemplate = Handlebars.compile($("#richContent").html());
            _this.el.scheduleList.html(myTemplate(_this.data));
        },
        getStudentsChat:function(){
            var _this = this;
            _this.el.scheduleList.html('<!--全部评论：begin-->\n' +
                '            <div class="al-commentAll al-contentItem" id="reviewArea">\n' +
                '\n' +
                '                <section class="ev-list" data-alcode-mod="179"></section>\n' +
                '            </div>\n' +
                '            <!--全部评论：end-->');
            module.reviewPage({sortType: 1,$context: $('.ev-list'),scene: 'terminal',refType: 24, refId: _this.data.courseId,callback:function(){
                    _this.el.scheduleList.css({background: '#eef3f8'});
                    _this.checkReview(true);
                }});
            $(".ev-listMore").off("mouseup").on("mouseup",function(){
                _this.checkReview(false);
            });

        },
        checkReview:function(first) {
          var _this = this;
          if(first){
              checkStudyInfo();
          }else{
              setTimeout(function () {
                  checkStudyInfo();
              },2000);
          }
          function checkStudyInfo(){
              $(".al-coomentWatchBtn").each(function (index) {
                  var _thisElement = $(this);
                  var watchBtnOff = _thisElement.css('display')==='none';
                  if(!watchBtnOff){
                      //console.log(index);
                      _thisElement.siblings('.ev-delete').remove();
                      _thisElement.siblings('.ev-review').remove();
                      _thisElement.siblings('.ev-prefer').remove();
                      _thisElement.siblings('.ev-collection').remove();
                      _thisElement.siblings('.ev-share').remove();
                      //console.log(_thisElement.parent());
                      _thisElement.parent().css({"visibility":'visible'});
                  }
              });
              $('.al-contentCommentItemTitle [data-teacher]').each(function(){
                  var _thisElement = $(this);
                  if(parseInt(_thisElement.attr("data-teacher"),10)){
                      _thisElement.find(".teacherIcon").remove();
                      _thisElement.append('<span class="teacherIcon">讲师</span>');
                  }else{
                      if(parseInt(_thisElement.attr("data-studentnum"),10)){
                          _thisElement.find(".studyNum").remove();
                          _thisElement.append('<span class="studyNum">No.'+parseInt(_thisElement.attr("data-studentnum"),10)+'</span>');
                      }
                  }
                  var logoElement = _thisElement.parents(".al-contentComment").find(".al-contentCommentUserImg");
                  if(parseInt(_thisElement.attr("data-vipState"),10)===1){
                      logoElement.addClass("vipState");
                  }
                  console.log(logoElement.length);
                  //console.log();
              });
          }

        },
        changeTab:function(){
          var _this = this;
          _this.el.tabList.off("click").on("click",function(){
               var _thisElement = $(this);
              _this.el.scheduleList.empty();
               _thisElement.siblings().removeClass('active');
              _thisElement.addClass("active");
              _this.data.tabIndex = _thisElement.index();
              switch (parseInt(_this.data.tabIndex,10)) {
                  case 0:
                      _this.el.chatBar.hide();
                      _this.getVideoList();//请求课程表
                      break;
                  case 1:
                      _this.el.chatBar.hide();
                      _this.el.pagerBar.empty();
                      _this.getProduceContent();//请求课程简介
                      break;
                  case 2:
                      _this.el.scheduleList.css({background: '#eef3f8'});
                      _this.el.pagerBar.empty();
                      _this.getStudentsChat();//请求学员交流
                      break;
              }
          });
          return _this;
        },
        scrollListen:function(){
          var _this = this;
            window.onscroll= function(){
                //变量t是滚动条滚动时，距离顶部的距离
                var t = document.documentElement.scrollTop||document.body.scrollTop;
                var scrollup = document.getElementById('scrollup');
                //当滚动到距离顶部200px时，返回顶部的锚点显示
                //console.log(t);
                if(t>430){
                    $(".headerTab-container .tab-item").eq(0).css({'marginLeft':$(".al-college-container").offset().left});
                    _this.el.topHeader.show(100);
                    _this.el.bannerHeader.hide();
                    $(".al-course-tab").hide();
                }else{          //恢复正常
                    _this.el.topHeader.hide();
                    _this.el.bannerHeader.show();
                    $(".al-course-tab").show();
                }
            }
            return _this;
        },
        getMyCoupon:function(){
           var _this = this;
           _this.el.buyCourseBtn.off("click").on("click",function(){
               user.login({
                   callback: function () {
                       $(".al-downLoadContent figcaption").text('\n' +
                           '打开唯医骨科app，尽享唯医学院精品内容');
                       $('.Ev-al-downLoad_PopBox').show();
                       $("body").css({"overflow":"hidden"});
                   },
                   scene: privilegeSceneConst.eSceneTypeAuth,
                   onClose: function () {
                       g_sps.jump(null, "/");
                   },
                   onAuthCancel:"back"      // 当点暂不认证时的处理、回退到来源页
               });
            });
            _this.el.discountCoupon.find(".discount-coupon").off("click").on("click",function(){
                user.login({
                    callback: function () {
                        $(".al-downLoadContent figcaption").text('\n' +
                            '更多大额优惠券，打开唯医骨科app查看');
                        $('.Ev-al-downLoad_PopBox').show();
                        $("body").css({"overflow":"hidden"});
                    },
                    scene: privilegeSceneConst.eSceneTypeAuth,
                    onClose: function () {
                        g_sps.jump(null, "/");
                    },
                    onAuthCancel:"back"      // 当点暂不认证时的处理、回退到来源页
                });
            });
            $(".Ev-closePopBtn").on("click",function () {
                $('.Ev-al-downLoad_PopBox').hide();
                $("body").css({"overflow":"auto"});
            });
            return _this;
        },
        registerHandel:function(){
          var _this = this;
            Handlebars.registerHelper('payTypeCheck',function(v,options){
                var type = parseInt(v,10);
                if (type === 1) {
                    return options.fn(this);
                } else {
                    return "";
                }
            });
            Handlebars.registerHelper("emptyPage",function(v1){
                if(!comm.checkInvalid(v1)){
                   return  v1;
                }else{
                    return 'javascript:void(0);';
                }

            });
            //console.log(_this);
            return _this;
        },
        checkPayState:function(){
          var _this = this;
          console.log(parseInt(_this.data.payState,10));
          if(parseInt(_this.data.payState,10)){
              //已购买
              _this.el.bannerHeader.remove();
          }else{
             //未购买
              _this.el.bannerHeader.show();
          }
        },
        getVideoList:function(){
            var _this = this;
            comm.ajax.async(_this.path.videoList, {
                customerId:$('#sesCustomerId').val()!=""&&$('#sesCustomerId').val()!=undefined?$('#sesCustomerId').val():"",
                 courseId:_this.data.courseId
            }, function (data) {
                if(data&&data.responseData){
                    var myTemplate = Handlebars.compile($("#videoTemplate").html());
                    _this.el.scheduleList.html(myTemplate(data.responseData));
                    _this.el.bannerContainer.css({'background':'url("'+data.responseData.pcBannerUrl+'") no-repeat center center/cover'});
                    _this.el.courseTitle.html(data.responseData.courseName);
                    _this.el.price.html(data.responseData.coursePrice);
                    _this.el.courseDesc.html(data.responseData.courseDesc);
                    _this.data.payState = data.responseData.payState;
                    $(".al-course-price .al-price-label").html('成为'+data.responseData.departmentName+'会员VIP会员,学院所有课程免费学医');
                    if(parseInt(data.responseData.productType,10)===3){
                        _this.checkPayState();
                    }
                    _this.shareInit(data.responseData);
                }
            },'true',function(){},'GET');
            return _this;
        }
    };
    collegeSchedule.init();
});
