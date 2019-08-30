
$(function () {
    var cId = localStorage.getItem("userId");
    var refType = $("#relationType").val();
    var refId = $("#resourceId").val();
    //refId = '1529896754414';
    var videoType = $("#videoType").val();
    var bookId = $("#bookId").val();
    var catalogueId = $("#catalogueId").val();
    var count1 = "";//计数器记录播放中下标值md
    var count2 = "";//计数器记录播放中下标值md
    var nums = 0;//计数器记录播放中下标值md
    var amChannel = comm.getpara()._amChannel;
    var storeSession = {
        checkInvalid: function (val) {
            if (((typeof val == 'string') && (val.length == 0)) || (val == undefined) || (val == 'undefined') || (val == 'null') || (typeof val == 'undefined') || (typeof val == 'null') || (val == null)) {
                return true;
            } else {
                return false;
            }
        },
        getQueryString: function (name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return unescape(r[2]);
            return null;
        },
        loginInit: function () {
            var webdomain = '//' + location.host;
            var appId = 'wx8d4a2df6fdc13658';
            var searchParam = '';
            var searchUrlOnOff = storeSession.checkInvalid(location.search);
            var loginOnOff = false;
            if (searchUrlOnOff) {
                loginOnOff = true;
                searchParam = "?redirectNum=1";
            } else {
                var redirectNum = storeSession.getQueryString('redirectNum');
                var loginNumRight = !storeSession.checkInvalid(redirectNum);
                if (loginNumRight && parseInt(redirectNum, 10) === 1) {
                    loginOnOff = false;
                } else {
                    searchParam = location.search + "&redirectNum=1";
                    loginOnOff = true;
                }
            }
            var href = location.origin + location.pathname + searchParam;
            var toUrl = 'http:' + webdomain + '/mcall/wx/allin/interact/viewVideo/?url=' + encodeURIComponent(href);
            if (loginOnOff) {
                var weixinLoginUrl = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + appId + '&redirect_uri=' + encodeURIComponent(toUrl) + '&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect';
                window.location.href = weixinLoginUrl;
            } else {
            }
        }
    };
    var payVideoInfo = '';
    var callAppOptions = {
        ios: "allinmdios://app.allinmd.cn/applinks.html?scene=terminalPage&index=1&sourceId=" + refId + "&tplPath=1&share=app&visitSiteId=5" + (amChannel ? "&_amChannel=" + amChannel : ''),
        android: "allin://com.allin.social:75235?data={scene:3,type:1,sourceId:" + refId + ",tplPath:1" + (amChannel ? ",_amChannel:" + amChannel : '') + "}",
        ios9: "http://app.allinmd.cn/applinks.html?scene=terminalPage&index=1&sourceId=" + refId + "&tplPath=1&share=app&visitSiteId=5" + (amChannel ? "&_amChannel=" + amChannel : ''),
        runAtOnce: false
    };
    var wakeUpSelection = function () {
        var wakeUpBtnText ='更多相关资源，打开唯医骨科APP查看';
        var wakeUpBtnClass ='';
        var owerNameList = payForClass.data.videoInfo.owerNameList;
        if(owerNameList&&owerNameList.length){
            wakeUpBtnClass = 'al-selectionCourse-wakeBtn';
            if(owerNameList.length===1){
                wakeUpBtnText = '打开唯医骨科App，学习'+owerNameList[0].authorName+'讲师'+'全部精品课程';
            }else{
                wakeUpBtnText = '打开唯医骨科App，学习'+owerNameList[0].authorName+'讲师团队'+'全部精品课程';
            }
        }
        //console..log(payForClass.data.videoInfo.owerNameList)
        if(parseInt(payForClass.data.videoInfo.payState,10)===1){
            $(".ev-videoContV2").prepend(
                '<section class="video-app-wrapper">\n' +
                '                <section class="videoAppBtn '+wakeUpBtnClass+'">\n' +
                '                    '+wakeUpBtnText+'\n' +
                '                </section>\n' +
                '            </section>'
            );
            $('.videoAppBtn').off("click").on("click", function () {
                comm.appWakeUp("diyLayer", callAppOptions);//唤醒app弹层
            });
        }else{
            comm.appWakeUp("figure", callAppOptions);//唤醒app弹层
        }
    };
    //唯医3.7付费课视频终端页逻辑处理开始
    var payForClass = {
        el:{
            chatContainer:$(".Ev-discussArea"),
            mainContent:$(".al-mainInner"),
            videoChargeBox:$(".al-charge-mask"),
            videoBox:$("#video #CKa1"),
            downLoadApp:$(".al-followCase"),
            discountCoupon:$(".al-discount-coupon"),
            buyCourse:$(".al-charge-btn")
        },
        data:{
            customerId:localStorage.getItem("userId")!=""&&localStorage.getItem("userId")!=undefined?localStorage.getItem("userId"):"",
            videoInfo:{},
            couponInfo:{},
            videoId:$("#resourceId").val()
        },
        path:{
            coupon:'/mcall/coupon/getMaxReceivableCoupon/'
        },
        getCouponEvent:function(){
            var _this = this;
            _this.el.discountCoupon.off("click").on("click",function(){
                user.privExecute({
                    operateType: 'auth',   //'login','auth','conference'
                    callback: function () {
                        comm.newReleaseBox({
                            imgPath: "//img50.allinmd.cn/case/release.png",
                            title: "更多大额优惠券，打开唯医骨科app查看",
                            solidBtnTitile: "立即打开",
                            authNoneTitle: " ",
                            data: callAppOptions
                        });
                    },
                    noNeedBack: true,
                    noAuthTip: 1
                });
            });
            _this.el.buyCourse.off("click").on("click",function(){
                callAppOptions.el = ".solidBtn";
                user.privExecute({
                    operateType: 'auth',   //'login','auth','conference'
                    callback: function () {
                        comm.newReleaseBox({
                            imgPath: "//img50.allinmd.cn/case/release.png",
                            title: "打开唯医骨科app，尽享唯医学院精品内容",
                            solidBtnTitile: "立即打开",
                            authNoneTitle: " ",
                            data: callAppOptions
                        });
                    },
                    noNeedBack: true,
                    noAuthTip: 1
                });
            });
            $(".Ev-closePopBtn").on("click",function () {
                $('.Ev-al-downLoad_PopBox').hide();
                $("body").css({"overflow":"auto"});
            });
            return _this;
        },
        getCoupon:function(){
            var _this = this;
            var factoryOnOff = localStorage.getItem("customerRole") && (localStorage.getItem("customerRole")=="14" || localStorage.getItem("customerRole")=="15")?true:false;
            if(parseInt(payForClass.data.videoInfo.payState,10)===0&&(!factoryOnOff)){
                comm.ajax.async(_this.path.coupon, {
                    paramJson:$.toJSON({
                        customerId:_this.data.customerId?_this.data.customerId:'',
                        productId:payForClass.data.videoInfo.courseId
                    })
                }, function (data) {
                    if(data&&data.responseObject&&data.responseObject.responseData){
                        _this.data.couponInfo = data.responseObject.responseData;
                        _this.checkCouponStatus();
                    }else{
                        _this.checkCouponStatus();
                    }
                },'true',function(){},'GET');
            }
            return _this;
        },
        checkCouponStatus:function(){
            var _this = this;
            if($.isEmptyObject(_this.data.couponInfo)){
                //未配置优惠券
                _this.el.discountCoupon.remove();
            }else{
                //console..log('显示');
                _this.el.discountCoupon.find(".coupon-des").text(_this.data.couponInfo.displayName);
                _this.el.discountCoupon.show();
                $(".videoMainV2").css({'marginTop': '1.06667rem'});
                $(".video-app-wrapper").remove();
                //配置优惠券
            }
            return _this;
        },
        /*checkCourseInfo:function(){
            var _this = this;
            var pcCoverImgUrl = _this.data.videoInfo.pcCoverImgUrl;
            var courseId = _this.data.videoInfo.courseId;
            var courseName = _this.data.videoInfo.courseName;
            if(!comm.checkInvalid(courseId)){
                _this.el.collegeSideBar.find(".college-logo").css({"background":"url('"+pcCoverImgUrl+"') no-repeat center center/cover"});
                _this.el.collegeSideBar.find(".al-college-courseTitle").html(courseName);
                _this.el.collegeSideBar.show().attr({"data-courseId":courseId});
            }
            return _this;
        },*/
        checkVideoPayType:function(){
            var _this = this;
            var collegeCourseState = _this.data.videoInfo.cms_video.collegeCourseState;
            /*if(parseInt(_this.data.videoInfo.payState,10)){
                //1代表已购买
                collegeCourseState = 0;
                _this.data.videoInfo.cms_video.collegeCourseState = 0;
            }else{
                //代表未购买
            }*/
            var payType = _this.data.videoInfo.cms_video.payType;
            _this.el.mainContent.attr({'data-collegeCourseState':collegeCourseState});
            $(".al-myScoreBox *").unbind();
            //console..log('解除绑定');
            $(".al-myScoreBox").off("click").on("click",function(){
                user.privExecute({
                    operateType: 'auth',   //'login','auth','conference'
                    callback: function () {
                        callAppOptions.el = ".solidBtn";
                        comm.newReleaseBox({
                            imgPath: "//img50.allinmd.cn/case/release.png",
                            title: "打开唯医骨科app，尽享唯医学院精品内容",
                            solidBtnTitile: "立即打开",
                            authNoneTitle: " ",
                            data: {
                                el: ".solidBtn",
                                ios: "allinmdios://app.allinmd.cn/applinks.html",
                                ios9: "http://app.allinmd.cn/applinks.html",
                                android: "allin://com.allin.social:75235?data={}",
                            }
                        });
                    },
                    noNeedBack: true,
                    noAuthTip: 1
                });
            });
            //console..log(collegeCourseState);
            if((!isNaN(parseInt(collegeCourseState,10)))&&parseInt(collegeCourseState,10)){//是付费课
                _this.el.chatContainer.addClass('al-college-payCourse');
                $(".Ev-discussBtnPlaceholder").remove();
                _this.getCoupon();
                if(parseInt(payType,10)){
                    //是付费课，但是是免费课，可以试看的视频，与原有逻辑基本保持不变
                    $("video").show();
                    $('#CKa1').show();
                    video.wakeUpAPPByPlayVideo();
                }else{
                    //是付费课，不是免费课，这时候整个页面视频就不能播放了，整个页面就不算一个视频终端页
                    _this.el.videoBox.remove();
                    _this.el.videoChargeBox.show();

                }
            }else{
                $("video").show();
                $('#CKa1').show();
                //不是付费课，也就是原有的视频终端页，逻辑不做任何调整
                video.wakeUpAPPByPlayVideo();
            }

            return _this;
        },
        initElement:function(){
            var _this = this;
            var payState = _this.data.videoInfo.payState;
            var textStr = '购买后可继续学习观看';
            var btnStr = '购买课程';
            if(parseInt(payState,10)){
                textStr = '前往唯医骨科App学习观看';
                btnStr = '立即前往';
            }
            $("#video").append('<section class="al-charge-mask" style="display: none;">\n' +
                '                    <section class="al-charge-title">'+textStr+'</section>\n' +
                '                    <section class="al-charge-bar">\n' +
                '                        <section class="al-charge-btn">'+btnStr+'</section>\n' +
                '                    </section>\n' +
                '                </section><section class="al-discount-coupon" style="display: none;">\n' +
                '                    <section class="coupon-des">\n' +
                '                        唯医学院送你买400减60优惠券\n' +
                '                    </section>\n' +
                '                    <section class="coupon-btn">\n' +
                '                        领取\n' +
                '                    </section>\n' +
                '                </section>');
            _this.el = {
                chatContainer:$(".Ev-discussArea"),
                mainContent:$(".al-mainInner"),
                videoChargeBox:$(".al-charge-mask"),
                videoBox:$("#video #CKa1"),
                downLoadApp:$(".al-followCase"),
                discountCoupon:$(".al-discount-coupon"),
                buyCourse:$(".al-charge-btn")
            };
            return _this;
        },
        init:function(original){
            var _this = this;
            _this.data.videoInfo = original;
            _this.initElement().checkVideoPayType().getCouponEvent();
        }
    };
    //唯医3.7付费课视频终端页逻辑处理结束


    //唯医3.11终端页，专栏购买，会员购买，单视频+会员购买开始
    var payVipOrClass = {
        init:function(dataList){
            var _this = this;
            payVideoInfo = dataList;
            _this.data.courseInfo = dataList;
            _this.data.couponInfo = '';
            _this.getVideoInfo(dataList);//获取视频状态
        },
        data:{
            courseInfo:'',
            couponInfo:''
        },
        path:{
            maxCoupon:'/mcall/coupon/getMaxReceivableCoupon/',//优惠券列表
            getMaxCoupon:'/allingateway/base-shopping-platform/coupon/getOneCoupon',//优惠券领取
            // getMaxCoupon:'/mcall/coupon/getOneCoupon'//优惠券领取
        },
        getUserAuthFn:function(option){
            //判断是否登录
            if(TempCache.getItem("userId")){
                var userRole = TempCache.getItem("customerRole");
                var userState = TempCache.getItem("auth").state;
                var role = parseInt(userRole,10);
                //1-系统、2-组织、3-厂商、5-普通医生、6-认证医生、7-住陪学员、11-执业医师、12-护理、13-医助、14-厂商未认证、15-厂商已认证
                if(role===5||role===6||role===7||role===11||role===12){//医务人员，医生，护士，医学生
                    switch (parseInt(userState)) {
                        case -1:
                        case 3:
                        case 0:
                        case 1:
                            user.privExecute({
                                operateType: 'auth',
                                noNeedBack:false,
                                noAuthTip:1,
                                callback: function () {
                                    // TempCache.setItem('fromPage', location.href);
                                    //TODO：回调
                                }
                            });
                            break;
                        case 2://可以购买
                        case 7://可以购买
                        case 8://可以购买
                        case 9://可以购买
                            option.callBack&&option.callBack();
                            break;
                    }
                }else{
                    console.log('认证权限不够不可以购买')
                    //不可以购买
                }
            }else{
                user.privExecute({
                    operateType: 'auth',
                    noNeedBack:false,
                    noAuthTip:1,
                    callback: function () {}
                });
            }
        },
        //添加优惠券dom
        addCouponDom:function(couponData){
            let _this = this;
            var couponDom = '<section class="couponGet">\n' +
                '                    <span class="couponInfo ev-couponInfo"></span>\n' +
                '                    <span class="couponGetBtn ev-couponGetBtn">领取</span>\n' +
                '                    <span class="couponGetBtn couponAlreadyGetBtn ev-couponAlreadyGetBtn" style="display: none">已领取</span>\n' +
                '                </section>';
            $(".videoIntroduction").before(couponDom);//在视频简介前添加
            $('.ev-couponInfo').text(couponData.displayName);
            $('.ev-couponGetBtn').off('click').on('click',function () {
                _this.getUserAuthFn({
                    callBack:function () {
                        comm.creatEvent({
                            browType:416,
                            triggerType: '付费课程终端页',
                            triggerName: "领取优惠券",
                            actionId: 11767,
                            refId:_this.courseInfo?_this.courseInfo.courseId:''
                        });
                        $.ajax({
                            url:_this.path.getMaxCoupon,
                            data:{
                                queryJson:$.toJSON({
                                    customerId:TempCache.getItem("userId")?TempCache.getItem("userId"):'',
                                    // customerId:1397586888724,
                                    couponBatchId:couponData.couponBatchId,
                                    productType:_this.data.courseInfo.productType!=2?3:_this.data.courseInfo.productType,
                                })
                            },
                            type:"get",
                            dataType:'json',
                            success:function(data){
                                if(data && data.responseObject && data.responseObject.responseData && data.responseObject.responseStatus){
                                    $('.ev-couponGetBtn').hide();
                                    $('.ev-couponAlreadyGetBtn').show();
                                }else{
                                    popup(data.responseObject.responseStatus)
                                }
                            }
                        });
                    }
                });
                // user.privExecute({
                //     operateType: 'auth',   //'login','auth','conference'
                //     callback: function () {
                //         comm.creatEvent({
                //             browType:416,
                //             triggerType: '付费课程终端页',
                //             triggerName: "领取优惠券",
                //             actionId: 11767,
                //             refId:_this.courseInfo?_this.courseInfo.courseId:''
                //         });
                //         $.ajax({
                //             url:_this.path.getMaxCoupon,
                //             data:{
                //                 queryJson:$.toJSON({
                //                     customerId:TempCache.getItem("userId")?TempCache.getItem("userId"):'',
                //                     // customerId:1397586888724,
                //                     couponBatchId:couponData.couponBatchId,
                //                     productType:_this.data.courseInfo.productType!=2?3:_this.data.courseInfo.productType,
                //                 })
                //             },
                //             type:"get",
                //             dataType:'json',
                //             success:function(data){
                //                 if(data && data.responseObject && data.responseObject.responseData && data.responseObject.responseStatus){
                //                     $('.ev-couponGetBtn').hide();
                //                     $('.ev-couponAlreadyGetBtn').show();
                //                 }else{
                //                     popup(data.responseObject.responseStatus)
                //                 }
                //             }
                //         });
                //     },
                //     noNeedBack: true,
                //     noAuthTip: 1
                // });
            });
        },
    //    添加会员信息提示栏
        addVipInfoDom:function () {
            let _this = this;
            var VipInfoDom = '<section class="vipPayTipsInfo">\n' +
                '                    <span class="vipPayImg ev-vipPayImg"><img class="vipImgBg" src="/static/images/payDetail/vipPayItem.png"/></span>\n' +
                '                    <div class="notVipInfoText ev-notVipInfoText">\n' +
                '                        <div class="vipPayInfo">\n' +
                '                            <span class="vipPayInfoTop ev-vipPayInfoTop">开通创伤学院，92节课程免费看</span>\n' +
                '                            <span class="vipPayInfoBot">线下学习班免费参与，专享购课优惠</span>\n' +
                '                        </div>\n' +
                '                        <span class="vipPayMoreBtn">\n' +
                '                            详情 >\n' +
                '                        </span>\n' +
                '                    </div>\n' +
                '                    <div class="hasVipInfo ev-hasVipInfo">\n' +
                '                        <div class="hasVipTitle">\n' +
                '                            查看更多学院精彩内容\n' +
                '                        </div>\n' +
                '                        <span class="hasVipMore">></span>\n' +
                '                    </div>';
            $(".Ev-recommendVideo").before(VipInfoDom);//在相关推荐前添加
            //跳转详情页
            $('.ev-notVipInfoText,.ev-hasVipInfo').off('click').on('click',function () {
                comm.creatEvent({
                    browType:416,
                    triggerType: '付费课程终端页',
                    triggerName: "二级学院详情点击",
                    actionId: 11894,
                });
                window.location.href='//m.allinmd.cn/dist/college/college.html#/collegeDetail?departmentId='+_this.data.courseInfo.courseId;
            })
        },
        //视频蒙层提示
        addVideoBgDom:function () {
            var _this = this;
            var videoBgDom = ' <section class="videoGrayBg">\n' +
                '                    <section class="videoGrayBgCont">\n' +
                '                        <section class="videoGrayBgTitle ev-videoGrayBgTitle">开通会员观看</section>\n' +
                '                        <section class="videoGrayBgMore ev-videoGrayBgMore">\n' +
                '                            点击查看学院会员权益<i></i>\n' +
                '                        </section>\n' +
                '                    </section>\n' +
                '                </section>';
            $("#video").before(videoBgDom);//在视频添加
            //跳转支付
            $('.ev-videoGrayBgTitle').off('click').on('click',function () {
                _this.getUserAuthFn({
                    callBack:function () {
                        comm.creatEvent({
                            browType:416,
                            triggerType: '付费课程终端页',
                            triggerName: "视频区域开通会员点击",
                            actionId: 11892,
                        });
                        window.location.href='//m.allinmd.cn/dist/payDetail/payDetail.html?productId='+_this.data.courseInfo.courseId+'&productType='+_this.data.courseInfo.productType;
                    }
                });
                // user.privExecute({
                //     operateType: 'auth',   //'login','auth','conference'
                //     callback: function () {
                //         comm.creatEvent({
                //             browType:416,
                //             triggerType: '付费课程终端页',
                //             triggerName: "视频区域开通会员点击",
                //             actionId: 11892,
                //         });
                //         window.location.href='//m.allinmd.cn/dist/payDetail/payDetail.html?productId='+_this.data.courseInfo.courseId+'&productType='+_this.data.courseInfo.productType;
                //     },
                //     noNeedBack: true,
                //     noAuthTip: 1
                // });
            });
            //显示权益详情弹层
            $('.ev-videoGrayBgMore').off('click').on('click',function () {
                comm.checkVipRight({
                    rightName:_this.data.courseInfo.courseName
                });
                comm.creatEvent({
                    browType:416,
                    triggerType: '付费课程终端页',
                    triggerName: "查看二级学院会员权益",
                    actionId: 11893,
                });
            })
        },
        //底部购买课程按钮
        addBotButtonClass:function () {
            let _this = this;
            var botButtonDom = '<section class="videoPayContent">\n' +
                '            <div class="payInfo">\n' +
                '                <span class="moneyNum ev-moneyNum">￥<i>0</i></span>\n' +
                '                <span class="grayLine ev-grayLine">￥0</span>\n' +
                '                <span class="payRedTips ev-payRedTips">限时特惠</span>\n' +
                '            </div>\n' +
                '            <div class="submitBtn ev-seriesSubmitBtn">\n' +
                '                    立即购买\n' +
                '            </div>\n' +
                '    </section>';
            $('body').append(botButtonDom);
            $('.ev-payRedTips').text(_this.data.courseInfo.discountDesc);
            $('.ev-grayLine').text('￥'+_this.data.courseInfo.originalPrice);
            $('.ev-moneyNum').html('￥'+'<i>'+_this.data.courseInfo.discountPrice+'</i>');
            $('.ev-seriesSubmitBtn').off('click').on('click',function () {
                _this.getUserAuthFn({
                    callBack:function () {
                        comm.creatEvent({
                            browType:416,
                            triggerType: '付费课程终端页',
                            triggerName: "吸底按钮点击",
                            actionId: 11895,
                        });
                        window.location.href='//m.allinmd.cn/dist/payDetail/payDetail.html?productId='+_this.data.courseInfo.courseId+'&productType='+_this.data.courseInfo.productType;
                    }
                });
                // user.privExecute({
                //     operateType: 'auth',   //'login','auth','conference'
                //     callback: function () {
                //         comm.creatEvent({
                //             browType:416,
                //             triggerType: '付费课程终端页',
                //             triggerName: "吸底按钮点击",
                //             actionId: 11895,
                //         });
                //         window.location.href='//m.allinmd.cn/dist/payDetail/payDetail.html?productId='+_this.data.courseInfo.courseId+'&productType='+2;
                //     },
                //     noNeedBack: true,
                //     noAuthTip: 1
                // });
            })
        },
        //底部会员购买
        addBotButtonVip:function () {
            var _this = this;
            var botButtonVipDom = ' <section class="vipPayContent">\n' +
                '        <div class="submitBtn ev-vipSubmitBtn">\n' +
                '            开通创伤学院会员，立即观看\n' +
                '        </div>\n' +
                '    </section>';
            $('body').append(botButtonVipDom);
            $('.ev-vipSubmitBtn').off('click').on('click',function () {
                _this.getUserAuthFn({
                    callBack:function () {
                        comm.creatEvent({
                            browType:416,
                            triggerType: '付费课程终端页',
                            triggerName: "吸底按钮点击",
                            actionId: 11895,
                        });
                        window.location.href='//m.allinmd.cn/dist/payDetail/payDetail.html?productId='+_this.data.courseInfo.courseId+'&productType='+_this.data.courseInfo.productType;
                    }
                });
                // user.privExecute({
                //     operateType: 'auth',   //'login','auth','conference'
                //     callback: function () {
                //         comm.creatEvent({
                //             browType:416,
                //             triggerType: '付费课程终端页',
                //             triggerName: "吸底按钮点击",
                //             actionId: 11895,
                //         });
                //         window.location.href='//m.allinmd.cn/dist/payDetail/payDetail.html?productId='+_this.data.courseInfo.courseId+'&productType='+_this.data.courseInfo.productType;
                //     },
                //     noNeedBack: true,
                //     noAuthTip: 1
                // });
            })
        },
        //获取最大优惠券
        getMaxCoupon(courseInfo){
            var  _this = this;
            $.ajax({
                url:this.path.maxCoupon,
                data:{
                    paramJson:$.toJSON({
                        customerId:TempCache.getItem("userId")?TempCache.getItem("userId"):'',
                        // customerId:1397586888724,
                        productId:courseInfo.productType!=2?courseInfo.vipProductId:courseInfo.courseId,
                        productType:courseInfo.productType!=2?3:courseInfo.productType
                    })
                },
                type:"get",
                dataType:'json',
                success:function(data){
                    if(data&&data.responseObject&&data.responseObject.responseData){
                        _this.data.couponInfo = data.responseObject.responseData;
                        _this.checkCouponStatus();
                    }else{
                        _this.checkCouponStatus();
                    }
                },
                error:function () {
                    popup('最大优惠券获取失败')
                }
            })
        },
        checkCouponStatus:function(){
            var _this = this;
            //配置了优惠券
            if(!$.isEmptyObject(_this.data.couponInfo)){
                _this.addCouponDom(_this.data.couponInfo);
                if(_this.data.couponInfo.applyStatus!=1){//未领取
                    $('.ev-couponInfo').text(_this.data.couponInfo.displayName);
                }else if(_this.data.couponInfo.applyStatus==1){//已经领取
                    $('.ev-couponGetBtn').hide();
                    $('.ev-couponAlreadyGetBtn').show();
                }
            }
        },
    //    获取视频的状态
        getVideoInfo(data){
            var _this = this;
            if(data.responseObject && data.responseObject.responseData && data.responseObject.responseData.data_list){
                var dataList = data.responseObject.responseData.data_list[0];
                var collegeCourseState = dataList.cms_video.collegeCourseState;
                var payCourseOrVip = dataList.college;
                _this.data.courseInfo = payCourseOrVip;
                if(TempCache.getItem('isShowVipPopup')&&TempCache.getItem('productId')==_this.data.courseInfo.courseId){
                    comm.buySuccessDialog({
                        productType:_this.data.courseInfo.productType,
                        productId:_this.data.courseInfo.courseId
                    });
                    TempCache.removeItem('isShowVipPopup');
                    TempCache.removeItem('productId')
                };
                if((!isNaN(parseInt(collegeCourseState,10)))&&parseInt(collegeCourseState,10)){//是付费课
                    // 付费可页面埋点
                    Log.createBrowse('416',"付费课程终端页");
                    $(".Ev-discussArea").addClass('al-college-payCourse');
                    $(".Ev-discussBtnPlaceholder").remove();
                    _this.getMaxCoupon(_this.data.courseInfo);//添加优惠券
                    if(parseInt(payCourseOrVip.payState,10)){
                        //是付费课，但是是免费课，可以试看的视频，与原有逻辑基本保持不变
                        $("video").show();
                        $('#CKa1').show();
                        video.wakeUpAPPByPlayVideo();
                    }else{
                        //是付费课，不是免费课，这时候整个页面视频就不能播放了，整个页面就不算一个视频终端页
                        $("#video #CKa1").remove();
                        _this.addVideoBgDom();
                        //1-单课付费商品，2-专栏付费商品，3-会员付费商品（用户可以免费看）
                        if(payCourseOrVip.productType==1){//判断类型
                            _this.addBotButtonClass();
                            if(payCourseOrVip.vipState==0){//不是会员
                                $('.ev-videoGrayBgTitle').text('购买后可继续学习观看');
                                _this.addVipInfoDom();
                                $('.ev-notVipInfoText').show();
                                $('.ev-hasVipInfo').hide();
                                $('.ev-vipPayInfoTop').text('开通'+payCourseOrVip.courseName+'，'+payCourseOrVip.totalCourseNum+'节课程免费看');
                                $('.ev-vipSubmitBtn').text('开通'+payCourseOrVip.courseName+'会员，立即观看');
                                $('.ev-vipPayImg img').attr('src',payCourseOrVip.iconPicUrl);
                                $('.ev-videoGrayBgMore').html('点击查看'+payCourseOrVip.courseName+'会员权益<i></i>');
                                $('.ev-videoGrayBgMore').hide();
                            }else{
                                $('.ev-videoGrayBgTitle').text('购买后可继续学习观看');
                                _this.addVipInfoDom();
                                $('.ev-notVipInfoText').hide();
                                $('.ev-hasVipInfo').show();
                                $('.ev-hasVipInfo .hasVipTitle').text('点击查看'+payCourseOrVip.courseName+'会员权益');
                                $('.ev-vipPayImg img').attr('src',payCourseOrVip.iconPicUrl);
                                $('.ev-videoGrayBgMore').html('点击查看'+payCourseOrVip.courseName+'会员权益<i></i>');
                                $('.ev-videoGrayBgMore').hide();
                                if(payCourseOrVip.payState==0){//判断支付状态没有支付
                                    $('.ev-videoGrayBgTitle').text('购买后可继续学习观看');
                                }else{
                                    //添加唤醒app方法
                                    $('.ev-videoGrayBgTitle').text('前往唯医骨科App学习观看');
                                    $('.ev-videoGrayBgTitle').off('click').on('click',function () {
                                        var callAppOpt = {
                                            ios: "allinmdios://app.allinmd.cn/applinks.html?scene=terminalPage&index=1&sourceId=" + payCourseOrVip.courseId +   (amChannel ? "&_amChannel=" + amChannel : ''),
                                            android: "allin://com.allin.social:75235?data={scene:3,type:110,sourceId:" + payCourseOrVip.courseId + (amChannel ? ",_amChannel:" + amChannel : '') + "}",
                                            ios9: "http://app.allinmd.cn/applinks.html?scene=terminalPage&index=1&sourceId=" + payCourseOrVip.courseId + (amChannel ? "&_amChannel=" + amChannel : ''),
                                            runAtOnce: false
                                        };
                                        comm.bindCallApp(callAppOpt);
                                    })
                                }
                            }
                        }else if(payCourseOrVip.productType==2){//专栏付费商品
                            _this.addBotButtonClass();
                            $('.videoGrayBgMore').hide();
                            if(payCourseOrVip.payState==0){//判断支付状态没有支付
                                $('.ev-videoGrayBgTitle').text('购买后可继续学习观看');
                            }else{
                                $('.ev-videoGrayBgTitle').text('前往唯医骨科App学习观看');
                            }
                            $('.ev-videoGrayBgMore').hide();
                        }else if(payCourseOrVip.productType==3){//会员购买
                            if(payCourseOrVip.vipState==0){
                                _this.addVipInfoDom();
                                $('.ev-notVipInfoText').show();
                                $('.ev-hasVipInfo').hide();
                                $('.ev-vipPayInfoTop').text('开通'+payCourseOrVip.courseName+'，'+payCourseOrVip.totalCourseNum+'节课程免费看')
                            }else{
                                _this.addVipInfoDom();
                                $('.ev-notVipInfoText').hide();
                                $('.ev-hasVipInfo').show();
                            }
                            _this.addBotButtonVip();
                            $('.ev-vipSubmitBtn').text('开通'+payCourseOrVip.courseName+'会员，立即观看');
                            $('.ev-hasVipInfo .hasVipTitle').text('点击查看'+payCourseOrVip.courseName+'会员权益');
                            $('.ev-videoGrayBgTitle').text('开通会员观看');
                            $('.ev-videoGrayBgMore').html('点击查看'+payCourseOrVip.courseName+'会员权益<i></i>')
                        }
                    }
                }else{
                    $("video").show();
                    $('#CKa1').show();
                    //不是付费课，也就是原有的视频终端页，逻辑不做任何调整
                    video.wakeUpAPPByPlayVideo();
                }
            }
        },
    };
    //唯医3.11终端页，专栏购买，会员购买，单视频+会员购买结束


    if (refType == 1) {
        /*$.ajax({
            url: '/mcall/cms/video/getSelectionByVideo/',
            type: "post",
            data: {
                paramJson: $.toJSON(
                    {
                        "videoId": refId,
                        'visitSiteId': 1,
                        'customerId': cId
                    }
                )
            },
            dataType: 'json',
            success: function (d) {

                if (d && d.responseObject && d.responseObject.responseData && d.responseObject.responseData.dataList && d.responseObject.responseData.dataList.length > 0) {
                    wakeUpSelection();
                } else {
                    comm.appWakeUp("figure", callAppOptions);//唤醒app弹层
                }
            },
            error: function () {
                comm.appWakeUp("figure", callAppOptions);//唤醒app弹层
            }
        });*/
    } else {
        comm.appWakeUp("figure", callAppOptions);//唤醒app弹层
    }
    //正常视频3分钟登录 //电子书视频直接登录
    if (videoType == 19) {
        user.privExecute({
            operateType: 'auth',   //'login','auth','conference'
            callback: function () {
            }
        });
    }
    $("video").on("webkitfullscreenchange mozfullscreenchange fullscreenchange ", function () {
        $("#video").css({
            "width": "100%",
            "height": "100%"
        });
    });
    var video = {
        path: {
            getVideoSlice: M_CALL + 'cms/videoCrop/json_list/',
            getById: M_CALL + "customer/videoPlay/getById/",//获取用户观看的时间
            videoPlayTime: M_CALL + "customer/videoPlay/create/",//离开页面时上传视频播放时间
            cVideoList: M_CALL + "cms/book/catalogue/getMapCatalogueVideoList/",//电子书系列视频
            albumListInTag: M_CALL + "cms/video/albumListInTag/",//系列视频
            getCoursesByResource: M_CALL + "cms/course/getCoursesByResource/",//系列课
            listInTag: M_CALL + "cms/video/listInTag/",//推荐视频
            shareUrl: M_CALL + "comm/data/share/getMapList3/",//分享话术接口
            videoInfo: M_CALL + "cms/video/info/",//视频的点赞浏览数据
            reviewOperate: M_CALL + "customer/draft/reviewOperate/",//草稿提示
            colCreate: M_CALL + "customer/collection/create/",//收藏
            colDelete: M_CALL + "customer/collection/delete/",//取消收藏
            preDelete: M_CALL + "customer/prefer/delete/",//取消点赞
            preCreate: M_CALL + "customer/prefer/create/",//点赞
            cloumnInfo: M_CALL + "/special/getResourceSpecial/",//获取所属栏目信息
            tagList: M_CALL + "/cms/resource_property/jsonList/",//获取标签内容
            tagListNew: M_CALL + '/mcall/cms/video/getMapByIdNew4/',//新的获取标签的内容
        },
        videoAuth: function () {
            var authData = JSON.parse(localStorage.getItem('auth'));
            var login = (cId) ? 1 : 0;
            var authState = (authData) ? parseInt(authData.state, 10) : -1;
            var authStatus = 1;
            if (authData == null || authData == "" || authData == undefined || $.isEmptyObject(authData) || authState == -1
                || authState == 0 || authState == 1 || authState == 3) {	//未认证
                authStatus = 0;
            }
            return ((login + authStatus) === 2) ? 0 : 3;
        },
        getVideoSlice: function (callBack) {
            var t = this;
            $.ajax({
                url: t.path.getVideoSlice,
                type: "post",
                data: {
                    paramJson: $.toJSON(
                        {
                            "videoId": refId,
                            "isValid": "1",
                            "firstResult": "0",
                            "maxResult": "1000000",
                            'cropType': t.videoAuth(),
                            'visitSiteId': 1,
                            'isSupport': 1
                        }
                    )
                },
                dataType: 'json',
                success: function (d) {
                    if (d && d.responseObject && d.responseObject.responseData && d.responseObject.responseData.data_list&&d.responseObject.responseData.data_list.length) {
                        t.videoType = 'application/x-mpegURL';
                        if (!((/.m3u8/ig).test(d.responseObject.responseData.data_list[0].cropM3u8Url))) {
                            t.videoType = 'video/mp4';
                            t.videoMp4Src = d.responseObject.responseData.data_list[0].videoAttUrl.replace(/http:|https:/ig, '');
                        } else {
                            t.videoMp4Src = d.responseObject.responseData.data_list[0].cropM3u8Url.replace(/http:|https:/ig, '');
                        }

                        //t.videoMp4Src = 'http://slice.allinmd.cn/public1/M00/03/FF/wKgBw1sxlRmAGV_-AAAA6bE3V0c11.m3u8';
                        callBack && callBack();

                    }else{
                        t.videoMp4Src = 'https://m.allinmd.cn/nothing.mp4';
                        callBack && callBack();
                    }
                }
            });
        },
        init: function () {
            var t = video;
            /*$(".Ev-videoArea").css({opacity:0});
            $(".Ev-videoArea").append("<section style='position:absolute;top:0;left:0;right:0;width:100%;z-index:3;height:100%;bottom:0;background: #333;'></section>");*/
            var a = $(".authorCont a").eq(0).attr("href");
            if (a && a.lastIndexOf("/pages/") > -1) {
                a = a.replace("pages", "dist").replace("others_contribution", "others_index");
                $(".authorCont a").attr("href", a);
            }
            $.each($(".al-terminalTags"), function (i, em) {
                if ($(em).attr("href").lastIndexOf("pages") > -1) {
                    var tag = $(em).attr("href").replace("pages", "dist");
                    $(em).attr("href", tag);
                }
            });
            var videoContainer = $("#video");
            var originalHeight = videoContainer.height();
            var originalWidth = videoContainer.width();

            $("#video").css({height:originalHeight,width:originalWidth});
            $("video").hide();

            t.updateViewdNum();//增加浏览数

            //alert((!$(".al-terminalNone").length)&&($('#CKa1').length));
            if ((!$(".al-terminalNone").length)&&($('#CKa1').length)) {
                t.setVideoPlayer();//设置视频播器
                /*setTimeout(function(){

                },3000);*/
            }
            t.weixinlogin();//微信环境下做一次强制登陆;

            $('.videoDetailTag ul').hide();
            t.loadRecommendVideo();//推荐视频
            t.contentFun();//页面中的浏览，关注数，视频的关注状态
            t.getColumnInfo();//栏目相关推荐10.12
            t.oldNewFunc();//评论区最新最旧按钮切换
            t.scrollFunc();//评论最新最旧的滚动&&固定
            t.draftRemind();//草稿提示
            t.shareClick();//分享点击
            t.backBtnClick();//登录认证
            setTimeout(function(){
                //console..log(payForClass.data.videoInfo);
                var payState = ''
                if(payForClass && payForClass.data && payForClass.data.videoInfo && payForClass.data.videoInfo.cms_video && payForClass.data.videoInfo.cms_video.collegeCourseState){
                    payState = parseInt(payForClass.data.videoInfo.cms_video.collegeCourseState,10);
                }
                if((!isNaN(payState))&&payState===1){
                    if (refType == 1) {//正常视频终端页
                        t.loadSelectionVideo();//系列视频
                        t.seriesCouList(nums);
                    }
                }else{
                    if (refType == 1) {//正常视频终端页
                        t.loadSeriesVideo();//系列视频
                        t.seriesCouList(nums);
                    }
                }
                if(payForClass && payForClass.data && payForClass.data.videoInfo && payForClass.data.videoInfo.cms_video && payForClass.data.videoInfo.cms_video.collegeCourseState){
                    var  collegeCourseState=parseInt(payForClass.data.videoInfo.cms_video.collegeCourseState,10);
                }
                var payStateType=parseInt(payForClass.data.videoInfo.payState,10);
                if (localStorage.getItem('customerRole') != 3) {   // 厂商没有评分功能
                    callAppOptions.el = ".solidBtn";
                    scoringSystem(t.player2, $(".al-titleName").text(),{
                        collegeCourseState:collegeCourseState,
                        payStateType:payStateType,
                        callBack: function () {
                            comm.newReleaseBox({
                                imgPath: "//img50.allinmd.cn/case/release.png",
                                title: "打开唯医骨科app，尽享唯医学院精品内容",
                                solidBtnTitile: "立即打开",
                                authNoneTitle: " ",
                                data: callAppOptions
                            });
                        },
                    });//新增评分系统
                }

            },2000);
            t.advertisement();
            t.bindOrientationChangeEvent();
            t.popsClickFunc(); //各个弹层点击
            t.eventTrack(); //标签埋点
            t.getTabList();//获取标签列表
        },
        videoMp4Src: '',
        videoType: 'application/x-mpegURL',
        wakeUpAPPByPlayVideo:function(){
            var _this = this;
            if($("video").length){
                var restoreMask = function(){
                    var mainInner = $(".al-mainInner");
                    mainInner.removeClass("al-mainInner-wakeApp");
                    $("[data-newwakeupapp='1']").remove();
                    if(_this.player2){
                        _this.player2.player.play();
                    }
                    $(".al-appWakeUpFigure").css({"display":"table"});
                    $(".al-appWakeUpFigure h2").text("使用APP看视频省流量又清晰");
                };
                $(".Ev-videoAreaWrap").find(".wakeUpAPPByPlayVideo").remove();
                var wakeUpAppMask = "<div class='wakeUpAPPByPlayVideo wakeUpAppMask' data-newwakeupapp='1'><section class='fakePlayBtn'></section></div>";
                $(".Ev-videoAreaWrap").append(wakeUpAppMask);
                $(".al-appWakeUpFigure").hide();
                $(".Ev-backBtn").css("z-index",13);
                $(".wakeUpAppMask").off("click").on("click",function(){
                    var mainInner = $(".al-mainInner");
                    mainInner.addClass("al-mainInner-wakeApp");
                    var mainInnerwakeUpAppMask = "<section class='mainInnerwakeUpAppMask'  data-newwakeupapp='1' style='display: none;'><div class='dialog'><span class='closeBtn'></span><div class='title'>使用APP观看超清画质</div><div class='openAppBtn'>打开APP</div><div class='goOnWebVideo'>继续标清观看</div></section></section>";
                    mainInner.find(".mainInnerwakeUpAppMask").remove();
                    mainInner.append(mainInnerwakeUpAppMask);
                    mainInner.find(".mainInnerwakeUpAppMask").fadeIn(300);
                    mainInner.find(".closeBtn,.goOnWebVideo").off("click").on("click",function(){
                        restoreMask();
                    });
                    mainInner.find(".closeBtn").off("mousedown").on("mousedown",function(){
                        comm.creatEvent({
                            triggerType:'H5下载页',
                            triggerName:'点击"X"按钮',
                            keyword:'唯医app下载',
                            actionId:'11878',
                            browType:'438'
                        });
                    });
                    mainInner.find(".goOnWebVideo").off("mousedown").on("mousedown",function(){
                        comm.creatEvent({
                            triggerType:'H5下载页',
                            triggerName:'点击继续标清观看',
                            keyword:'唯医app下载',
                            actionId:'11877',
                            browType:'438'
                        });
                    });
                    var callOptions = JSON.parse(JSON.stringify(callAppOptions));
                    callOptions.el = ".openAppBtn"
                    comm.bindCallApp(callOptions);
                    $(".openAppBtn").off("mousedown").on("mousedown",function(){
                        comm.creatEvent({
                            triggerType:'H5下载页',
                            triggerName:'点击"打开"',
                            keyword:'唯医app下载',
                            actionId:'11876',
                            browType:'438'
                        });
                    });
                });
            }
        },
        advertisement:function(){
            var t = this;
            //console..log(refId);
            $.ajax({
                url: '/mcall/medicalCollege/getBannerList/',
                type: "post",
                data: {
                    paramJson: $.toJSON(
                        {
                            "opUsr":localStorage.getItem("userId")!=""&&localStorage.getItem("userId")!=undefined?localStorage.getItem("userId"):"",
                            "resourceId":refId,
                            // "resourceId":1490169423188,
                            "recommendType":6,
                            "resourceType":1,
                            "firstResult":0,
                            "maxResult":1,
                            'visitSiteId': 1
                        }
                    )
                },
                dataType: 'json',
                success: function (d) {

                    if (d && d.responseObject && d.responseObject.responseData && d.responseObject.responseData.dataList && d.responseObject.responseData.dataList.length > 0) {
                        var item = d.responseObject.responseData.dataList[0];
                        $(".al-advertisement-video").remove();
                        $(".Ev-videoAreaWrap").after("<section class='al-advertisement-video'><section class='al-advertisement-picture' style='background: url(\""+item.bannerUrl+"\") no-repeat center center/cover'></section></section>");
                        $(".al-advertisement-video").off("click").on("click",function(){
                            //console..log(comm.banner);
                            comm.banner.openBanner(item);
                        });
                        //console..log(d.responseObject.responseData.dataList.length);
                    } else {

                    }
                },
                error: function () {

                }
            });
        },
        weixinlogin: function () {
            if (comm.isWeiXin()) {
                //storeSession.loginInit();
            }
        },
        //标签埋点
        eventTrack: function () {
            $('.al-terminalTags').click(function () {
                comm.creatEvent({
                    triggerType: '标签',
                    trigger_name: "标签",
                    keyword: $(this).text(),
                    refId: $(this).attr('href').split('tId=')[1],
                    actionId: 79,
                    async: false
                });
            });
        },
        //各个弹层点击
        popsClickFunc: function () {
            var t = this;
            var tMCM = $(".al-terminalMainContent").css("margin");
            //简介点击展开详细简介
            $('.ev-absShowBtn').on('click', function () {
                $(".ev-videoContV2").hide();
                $(".ev-introDetail").show();
                comm.creatEvent({
                    triggerType: "终端页功能",
                    keyword: "简介",
                    actionId: 11051
                });
            });
            //展开简介中的关闭按钮
            $('.ev-introDetail .nav i').on('click', function () {
                $(".ev-videoContV2").show();
                $(".ev-introDetail").hide();
            });
            //点击展开评论弹层
            $('.ev-reviewPopShow').on('click', function () {
                if(localStorage.getItem("customerRole") === "14" ||
                    localStorage.getItem("customerRole") === "15" ||
                    localStorage.getItem("customerRole") === "13"){ // 厂商不能评论
                    comm.toastFactoryAuth(null);
                }else{ // 原逻辑
                    $('.ev-noReviewArea').hide();
                    $('.ev-commentClose').show();
                    $(".al-terminalMainContent").css("margin", "0");
                    if ($('.Ev-discussArea').height() + $('.Ev-videoArea').height() + $('.al-appWakeUpFigure').height() >= $(window).height()) { //三个高度不满一屏，不做滚动（无评论时）
                        $(window).scrollTop($('.Ev-discussArea').offset().top - $('.Ev-videoArea').height());
                        $(".Ev-discussBtnWrap").attr('topHeight', $('.Ev-videoArea').offset().top + $(window).scrollTop());
                    }
                }
            });
            //评论弹层点击关闭
            $('.ev-commentClose').on('click', function () {
                $('.ev-noReviewArea').show();
                $('.ev-commentClose').hide();
                $(".al-terminalMainContent").css("margin", tMCM);
                $(".Ev-discussBtnWrap").attr('topHeight', $('.Ev-videoArea').offset().top + $(window).scrollTop() + $('.ev-noReviewArea').outerHeight());
            });
        },
        //页面左上角返回按钮跳转、埋点
        backBtnClick: function () {
            $(".Ev-backBtn").on("click", function () {
                comm.creatEvent({
                    triggerType: '全站功能按钮点击',
                    keyword: "返回",
                    actionId: 41
                });
                if (document.referrer.lastIndexOf("/passport/") > -1 || document.referrer.indexOf("seminar") > -1 || !document.referrer) {
                    g_sps.jump(null, "/");
                } else {
                    history.back();
                }
                return false;
            })
        },
        //设置视频播放器
        setVideoPlayer: function () {
            var t = this;
            var browse = comm.browser.versions;
            var videoMp4Src = $("#videoMp4Src").val();
            var playPic = $("#playPic").val();
            var hasAuth = false;
            var isUc = navigator.userAgent.toLowerCase().indexOf('ucbrowser') > -1;  //判断uc或者qq浏览器
            var ua = navigator.userAgent.toLowerCase();
            var isAndroidChrome = /chrome\/[\d|.]+ mobile safari\/[\d|.]+$/g.test(ua);  //android手机chrome浏览器
            var _auth;
            if (localStorage.getItem('auth') != null) {
                _auth = JSON.parse(localStorage.getItem('auth')).state
            } else {
                _auth = '';
            }
            var isIOS = browse.ios;
            if (isIOS) {
                $('#CKa1').attr('playsinline', 'playsinline');
            }
            $('#CKa1 source').attr({'src': t.videoMp4Src, "type": t.videoType});
            t.arrPlayTimes = [];
            t._strTimeArr = []; //临时存放播放时间点，长度为2
            var _playTime = 0,      //播放开始时间点
                _pauseTime = 0;     //播放暂停/停止时间点
            var player2 = new AllinmdPlayer('CKa1', {
                width: $(window).width(),
                height: $(window).width() * 0.56,
                poster: $('#playPic').val() ? $('#playPic').val() : '//img50.allinmd.cn/defaultVideo.jpg',  //播放之前需要放置的海报图片
                //设置播放权限时间，使用时需保证allow值为true
                // limitPlayTime: {
                //     allow: false,
                //     value: 30
                // },//设置允许最大的快进时长，用于限制用户拖拽至不允许播放的时间点，使用时需保证allow值为true
                setMaxPlayTime: {
                    allow: false,
                    value: 0
                },
                isH5: true
            }, function () {
                if (isIOS || isAndroidChrome) {  //ios放出全屏（版本10以下playsinline无效，暂无解决方法）
                    $('.vjs-fullscreen-control').show().css('marginRight', '0.5rem');
                    $('.allinmd-time-elements').css('float', 'left');
                }
            });
            var getRenzhenStatus = user.getRenZhengStatus();
            if (getRenzhenStatus) {
                hasAuth = true;
                t.getVideoSeenTime(player2);
            }
            if (localStorage.getItem('autoplay') == $("#resourceId").val()) {  //从断点登录后，回到当前页面，跳转到登录断点
                var _player = player2.player;
                if (browse.android) {
                    if (player2.getDurationTime()) {
                        _player.currentTime(30);
                    } else {
                        setTimeout(function () {
                            _player.currentTime(30);
                        }, 2000);
                    }
                } else {
                    if (_player.duration() != 0) {
                        _player.currentTime(30);
                    } else {
                        _player.on('loadedmetadata', function () {
                            _player.currentTime(30);
                            _player.off('loadedmetadata');
                        });
                        _player.one('canplaythrough', function () {
                            _player.currentTime(30);
                        })
                    }
                }

            }
            t.player2 = player2;
            comm.players.push(player2);

            if ((localStorage.getItem('autoplay') == $("#resourceId").val()) && (browse.android || isUc)) {//todo add by lichunhui 2018-05-29 android 浏览器不能退出全屏逻辑添加
                if (!hasAuth) {   //未登录认证
                    player2.player.pause();
                    if (localStorage.getItem('userId') == null) {
                        $('#CKa1').children().not('.allinmd-modal-dialog').remove();
                        player2.ModalDialog(true, '<div class="ev_needLogin videoAnchorPopup"><p class="videoToast">试看结束</p><p class="videoToast">认证可观看全部内容</p><div class="LAbutton" id="goLogin">登录/认证</div><div class="againLook"><i></i><span>重新试看</span></div> </div>');
                        /* player2.ModalDialog(true, '<img id="goLogin" class="ev_needLogin" src="//img50.allinmd.cn/video_detail/notlogin.png" style="width:100%;height:100%;">');*/

                        if (isUc) {
                            if ($('#CKa1').offset().top != $('#CKa1 .allinmd-modal-dialog').offset().top) {
                                $('#CKa1 .allinmd-modal-dialog').css({
                                    position: 'absolute', top: '1.6rem', left: 0
                                });
                            }
                        }

                    } else if (!getRenzhenStatus) {
                        $('#CKa1').children().not('.allinmd-modal-dialog').remove();
                        /*player2.ModalDialog(true, '<img id="goLogin" src="//img50.allinmd.cn/video_detail/notrenzheng.png" style="width:100%;height:100%;">');*/
                        player2.ModalDialog(true, '<div class="ev_needLogin videoAnchorPopup"><p class="videoToast">试看结束</p><p class="videoToast">认证可观看全部内容</p><div class="LAbutton" id="goLogin">登录/认证</div><div class="againLook"><i></i><span>重新试看</span></div> </div>');

                        if (isUc) {
                            if ($('#CKa1').offset().top != $('#CKa1 .allinmd-modal-dialog').offset().top) {
                                $('#CKa1 .allinmd-modal-dialog').css({
                                    position: 'absolute', top: '1.6rem', left: 0
                                });
                            }
                        }
                    } else if (!user.getWanShanStatus()) {
                        $('#CKa1').children().not('.allinmd-modal-dialog').remove();
                        /*player2.ModalDialog(true, '<img id="goLogin" src="//img50.allinmd.cn/video_detail/notwanshan.png" style="width:100%;height:100%;">');*/
                        player2.ModalDialog(true, '<div class="ev_needLogin videoAnchorPopup"><p class="videoToast">试看结束</p><p class="videoToast">认证可观看全部内容</p><div class="LAbutton" id="goLogin">登录/认证</div><div class="againLook"><i></i><span>重新试看</span></div> </div>');
                        if (isUc) {
                            if ($('#CKa1').offset().top != $('#CKa1 .allinmd-modal-dialog').offset().top) {
                                $('#CKa1 .allinmd-modal-dialog').css({
                                    position: 'absolute', top: '1.6rem', left: 0
                                });
                            }
                        }
                    }
                    $('#goLogin').off('click').on('click', function () {
                        // 厂商未注册厂商14以认证App,15已认证及医助可以直接看
                        if(localStorage.getItem("customerRole") === "14"){
                            // 厂商未认证时,直接去APP认证,认证后可以看
                            var androidParam = "{}";
                            var iosParam = "";
                            comm.newReleaseBox({
                                imgPath:"/images/img50/case/release.png",
                                title:"厂商认证需使用唯医骨科App",
                                solidBtnTitile:"立即使用",
                                authNoneTitle:"暂不使用",
                                data:{
                                    el: ".solidBtn",
                                    ios: "allinmdios://app.allinmd.cn/applinks.html?"+iosParam,
                                    ios9: "http://app.allinmd.cn/applinks.html?"+iosParam,
                                    android: "allin://com.allin.social:75235?data="+androidParam
                                }
                            });
                        }else if(localStorage.getItem("customerRole") === "15" ||
                            localStorage.getItem("customerRole") === "13"){
                            // 空放逻辑
                        }else{ // 原逻辑
                            if ($(this).hasClass('ev_needLogin')) {
                                comm.creatEvent({
                                    triggerType: '视频弹出去登录按钮',
                                    keyword: "视频弹出去登录按钮",
                                    actionId: 18
                                });
                            } else {
                                comm.creatEvent({
                                    triggerType: '认证-视频弹窗确定',
                                    keyword: "认证-视频弹窗确定",
                                    actionId: 24
                                });
                            }
                        }
                        user.privExecute({
                            operateType: 'auth',
                            callback: function () {
                            },
                            noNeedBack: true,
                            noAuthTip: 1
                        });

                    });
                    $(".againLook").off("click").on("click", function () {
                        localStorage.removeItem('autoplay');
                        window.location.reload();
                    });
                    return false;
                }
            }
            player2.player.on('timeupdate', function (d) {
                if (!hasAuth) {   //未登录认证
                    if (player2.player.currentTime() >= 30) {
                        localStorage.setItem('autoplay', $("#resourceId").val());
                        /*if(browse.android){//todo add by lichunhui 2018-05-29 android 浏览器不能退出全屏逻辑添加
                         player2.player.pause();
                         location.reload();
                         }*/
                        if (localStorage.getItem('userId') == null) {
                            player2.player.pause();
                            $('#CKa1').children().not('.allinmd-modal-dialog').remove();
                            player2.player.exitFullscreen();
                            player2.ModalDialog(true, '<div class="ev_needLogin videoAnchorPopup"><p class="videoToast">试看结束</p><p class="videoToast">认证可观看全部内容</p><div class="LAbutton"  id="goLogin">登录/认证</div><div class="againLook"><i></i><span>重新试看</span></div> </div>');
                            /*player2.ModalDialog(true, '<img id="goLogin" class="ev_needLogin" src="//img50.allinmd.cn/video_detail/notlogin.png" style="width:100%;height:100%;">');*/

                            if (isUc) {
                                if ($('#CKa1').offset().top != $('#CKa1 .allinmd-modal-dialog').offset().top) {
                                    $('#CKa1 .allinmd-modal-dialog').css({
                                        position: 'absolute', top: '1.6rem', left: 0
                                    });
                                }
                            }
                        } else if (!getRenzhenStatus) {
                            player2.player.pause();
                            $('#CKa1').children().not('.allinmd-modal-dialog').remove();
                            player2.player.exitFullscreen();
                            player2.ModalDialog(true, '<div class="ev_needLogin videoAnchorPopup"><p class="videoToast">试看结束</p><p class="videoToast">认证可观看全部内容</p><div class="LAbutton" id="goLogin">登录/认证</div><div class="againLook"><i></i><span>重新试看</span></div> </div>');

                            if (isUc) {
                                if ($('#CKa1').offset().top != $('#CKa1 .allinmd-modal-dialog').offset().top) {
                                    $('#CKa1 .allinmd-modal-dialog').css({
                                        position: 'absolute', top: '1.6rem', left: 0
                                    });
                                }
                            }
                        } else if (!user.getWanShanStatus()) {
                            player2.player.pause();
                            $('#CKa1').children().not('.allinmd-modal-dialog').remove();
                            player2.player.exitFullscreen();
                            /*player2.ModalDialog(true, '<img id="goLogin" src="//img50.allinmd.cn/video_detail/notwanshan.png" style="width:100%;height:100%;">');*/
                            player2.ModalDialog(true, '<div class="ev_needLogin videoAnchorPopup"><p class="videoToast">试看结束</p><p class="videoToast">认证可观看全部内容</p><div class="LAbutton" id="goLogin">登录/认证</div><div class="againLook"><i></i><span>重新试看</span></div> </div>');
                            if (isUc) {
                                if ($('#CKa1').offset().top != $('#CKa1 .allinmd-modal-dialog').offset().top) {
                                    $('#CKa1 .allinmd-modal-dialog').css({
                                        position: 'absolute', top: '1.6rem', left: 0
                                    });
                                }
                            }
                        } else {
                            hasAuth = true;
                        }
                        $('#goLogin').off('click').on('click', function () {
                            // 厂商未注册厂商14以认证App,15已认证,可以直接看
                            if(localStorage.getItem("customerRole") === "14"){
                                // 厂商未认证时,直接去APP认证,认证后可以看
                                var androidParam = "{}";
                                var iosParam = "";
                                comm.newReleaseBox({
                                    imgPath:"/images/img50/case/release.png",
                                    title:"厂商认证需使用唯医骨科App",
                                    solidBtnTitile:"立即使用",
                                    authNoneTitle:"暂不使用",
                                    data:{
                                        el: ".solidBtn",
                                        ios: "allinmdios://app.allinmd.cn/applinks.html?"+iosParam,
                                        ios9: "http://app.allinmd.cn/applinks.html?"+iosParam,
                                        android: "allin://com.allin.social:75235?data="+androidParam
                                    }
                                });
                            }else if(localStorage.getItem("customerRole") === "15" ||
                                localStorage.getItem("customerRole") === "13"){
                                // 空放逻辑
                            }else { // 原逻辑
                                if ($(this).hasClass('ev_needLogin')) {
                                    comm.creatEvent({
                                        triggerType: '视频弹出去登录按钮',
                                        keyword: "视频弹出去登录按钮",
                                        actionId: 18
                                    });
                                } else {
                                    comm.creatEvent({
                                        triggerType: '认证-视频弹窗确定',
                                        keyword: "认证-视频弹窗确定",
                                        actionId: 24
                                    });
                                }
                                user.privExecute({
                                    operateType: 'auth',
                                    callback: function () {
                                    },
                                    noNeedBack: true,
                                    noAuthTip: 1
                                });
                            }
                        });
                        $(".againLook").off("click").on("click", function () {
                            localStorage.removeItem('autoplay');
                            window.location.reload();
                        })
                    }
                } else {//已登录认证记录播放时长
                    t._strTimeArr.push(this.currentTime());
                    if (t._strTimeArr.length > 2) {
                        t._strTimeArr.shift();
                    }

                }
            });
            function exitFullscreen() {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                }
                else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                }
                else if (document.msExitFullscreen) {
                    document.msExiFullscreen();
                }
                else if (document.webkitCancelFullScreen) {
                    document.webkitCancelFullScreen();
                }
            }

            //记录时间段
            if (hasAuth) {
                player2.player.on('play', function () {    //点击暂停和拖动均触发，拖动先触发pause再play
                    if (localStorage.getItem('autoplay') == $("#resourceId").val()) {
                        _playTime = 0;
                        player2.player.currentTime(30);
                        localStorage.removeItem('autoplay');
                    } else {
                        _playTime = parseInt(this.currentTime());
                    }
                    t._playTime = _playTime;
                    //暂停其他视频播放
                    $.each(comm.players, function (ix, plea) {
                        if (player2 != plea) {
                            plea.player.pause();
                        }
                    });
                    $("[data-newwakeupapp='1']").remove();
                });
                player2.player.on('pause', function () {       //点击暂停和拖动均触发，拖动先触发pause再play
                    if (Math.abs(t._strTimeArr[1] - t._strTimeArr[0]) > 1) {  //如果播放时间两个间隔大于1秒，是拖动
                        _pauseTime = parseInt(t._strTimeArr[0]);
                    } else {
                        _pauseTime = parseInt(this.currentTime());
                    }
                    if (_pauseTime > 0 && _pauseTime - _playTime > 0 && this.currentTime() != this.duration()) {    //暂停时间不为0，暂停时间大于开始播放时间，当前时间不等视频总时长（未结束）
                        t.arrPlayTimes.push({
                            playTime: comm.secToTime(_pauseTime - _playTime),
                            createTime: comm.date.local_time()
                        });

                    }
                });
                player2.player.on('ended', function () { //视频结束
                    _pauseTime = this.duration; //暂停时间=总时长
                    if (_pauseTime) {
                        t.arrPlayTimes.push({
                            playTime: comm.secToTime(_pauseTime - _playTime),
                            createTime: comm.date.local_time()
                        });

                    }
                    var authState = JSON.parse(localStorage.getItem('auth')).state;
                    if (cId && (authState == 2 || authState == 7 || authState == 8 || authState == 9)) {
                        t.bindMediaEnd(player2);
                    }
                    player2.player.exitFullscreen();

                });
                t.uploadTimeType();
            } else {
                player2.player.on('play', function () {
                    //暂停其他视频播放
                    $.each(comm.players, function (ix, plea) {
                        if (player2 != plea) {
                            plea.player.pause();
                        }
                    });
                });
            }

        },
        //视频播放结束后的操作
        bindMediaEnd: function (player2, isUcOrMqq) {
            var t = this;
            if ($(".EV-notScore").length > 0) {
                if (localStorage.getItem('customerRole') != 3) {//厂商无评分
                    $("#video").css({'zIndex': 4});//当显示评分弹层的时候分享按钮把关闭按钮遮住的，用js动态处理zIndex样式，提高到4，张恒2018120810:23
                    if ($("#video .al-videoScorePartBox").length == 0) {
                        $('#CKa1 video').hide();
                        $("#video").append('<div class="al-videoScorePartBox"><figure class="al-videoScorePopBox"><span class="al-scorePopCloseBtn"></span><figcaption>你的评分会让我们做的更好</figcaption><ul class="al-bigScoreStarBox ev-scoring"><li class="ev-startItem"></li><li class="ev-startItem"></li><li class="ev-startItem"></li><li class="ev-startItem"></li><li class="ev-startItem"></li></ul><p class="al-anonymousScoreText ev-isAnonymous"><b class=""></b><span>匿名评分</span></p></figure></div>')
                    } else {
                        $('#CKa1 video').hide();
                        $("#video .al-videoScorePartBox").show();
                    }
                }
                //是否匿名
                $(".al-anonymousScoreText").on('click', function () {
                    if ($(this).children("b").hasClass("active")) {
                        $(this).children("b").removeClass("active");
                    } else {
                        $(this).children("b").addClass("active");
                    }
                });
                //关闭video弹层
                $(".al-scorePopCloseBtn").on('click', function () {
                    $("#video").css({'zIndex': 2});//当关闭评分弹层时回复分享按钮的层级关系,张恒2018120810:23
                    $(".al-videoScorePartBox").hide();
                    $('#CKa1 video').show();
                    if ($(".Ev-seriesVideo .Ev-sVideoAppend article").length > 0) {
                        var locationHref = $(".Ev-highLight").parents(".swiper-slide").next().find("a").attr("href");
                        if (!locationHref) {//没有下一个了，当前播放在最后,重置到0秒
                            player2.player.pause();
                        } else {
                            g_sps.jump(null, locationHref);
                        }
                    } else {
                        player2.player.pause();
                    }
                });
                //公共方法调取
                module.scoringSystem({
                    isTerminal: 0,
                    answerType: $("#relationType").val(),        //(1视频，2文库，7病例)
                    resourceTitle: $(".al-titleName").text(),      //资源名称
                    scoreTerminal: function (items) {    //终端页评分回调
                        $(".iScore").text("我的评分");
                        $(".al-myScoreBox").removeClass("al-iAskScore");
                        $(".al-videoScorePopBox").remove();
                        $(".al-termianlVideoHeader").removeClass("EV-notScore");
                        scoringCount(items.scoreNum, $(".al-myScoreBox .al-littleScoreStarBox"));
                        $('#CKa1 video').show();
                        if (player2.player.currentTime() < player2.player.duration() - 1) {
                            setTimeout(function () {
                                player2.player.play();
                            }, 3000)
                        }
                        if ($(".Ev-seriesVideo .Ev-sVideoAppend article").length > 0) {
                            var locationHref = $(".Ev-highLight").next().find(".text").attr("href");
                            if (!locationHref) {//没有下一个了，当前播放在最后
                                player2.player.pause();
                            } else {
                                g_sps.jump(null, locationHref);
                            }
                        }
                    },
                    scoreVideoStop: function () {
                        $('#CKa1 video').show();
                        player2.player.pause();
                    }
                });
            } else if ($(".Ev-seriesVideo .Ev-sVideoAppend article").length > 0) {
                var locationHref = $(".Ev-highLight").parents(".swiper-slide").next().find("a").attr("href");
                if (!locationHref) {//没有下一个了，当前播放在最后
                    player2.player.pause();
                } else {
                    g_sps.jump(null, locationHref);
                }
            } else {
                player2.player.pause();
            }
        },
        //获取用户已观看时间
        getVideoSeenTime: function (player2) {
            var t = this;
            var _sesLogin = localStorage.getItem("userId");
            if (_sesLogin) {
                var time;
                var paramData = {
                    customerId: _sesLogin,
                    videoId: $("#resourceId").val(),
                    siteId: 2,
                    timeType: 1
                };
                var callback = function (rep) {
                    if (rep && rep.responseObject && $.trim(rep.responseObject.responseData) && !$.isEmptyObject(rep.responseObject.responseData)) {
                        var _goTime = rep.responseObject.responseData.data_list[0].customer_video_play.playTime;
                        if (comm.timeToSec(_goTime)) {
                            time = comm.timeToSec(_goTime);
                            var _player = player2.player;
                            if (comm.browser.versions.android) {
                                if (player2.getDurationTime()) {
                                    _player.currentTime(30);
                                } else {
                                    setTimeout(function () {
                                        _player.currentTime(30);
                                    }, 2000);
                                }
                            } else {
                                if (_player.duration() != 0) {
                                    _player.currentTime(time);
                                } else {
                                    _player.on('loadedmetadata', function () {
                                        _player.currentTime(time);
                                        _player.off('loadedmetadata');
                                    });
                                    _player.one('canplaythrough', function () {
                                        _player.currentTime(time);
                                    })
                                }
                            }
                        }
                    }
                };
                comm.ajax.async(t.path.getById, {paramJson: $.toJSON(paramData)}, callback);
            }
        },
        //页面离开上传视频播放时长
        uploadTimeType: function () {
            var t = this;

            function cPlayTime(kv) {
                $.ajax({
                    url: t.path.videoPlayTime,
                    type: "post",
                    dataType: "json",
                    data: {paramJson: $.toJSON(kv)},
                    async: false,
                    success: function (data) {
                    }
                });
            }

            var player2 = t.player2;
            var leaveFn = function () {
                var _sesLogin = localStorage.getItem("userId");
                if (_sesLogin && !$(".al-terminalNone").length) {
                    var _n = player2.player.currentTime();
                    var _nowT = (_n == 0 || _n) ? parseFloat(_n) : -1;//页面离开时当前的时间
                    var _totalT = parseFloat(player2.player.duration());//视频总时长
                    if (_nowT != -1 && (t._strTimeArr && t._strTimeArr[1])) {//直接刷新页面离开时对数组再进行一次push
                        if ((_nowT - t._playTime > 0) && (_nowT - t._playTime == 0 || _nowT - t._playTime)) {
                            t.arrPlayTimes.push({
                                'playTime': comm.secToTime(parseInt(_nowT - t._playTime)),
                                'createTime': comm.date.local_time()
                            });
                        }
                    }
                    //离开页面播放时间点接口传递
                    var paramData = {
                        customerId: _sesLogin,
                        videoId: $("#resourceId").val(),
                        typeId: 1,
                        playTime: (_nowT != -1 && _totalT) ? comm.secToTime(parseInt(_nowT)) : "00:00:00",
                        isValid: 1,
                        siteId: 2,//1.pc 2.h5
                        createTime: comm.date.local_time()//本地时间
                    };
                    cPlayTime(paramData);
                    //离开页面播放时间段接口传递
                    var paramData1 = {
                        customerId: _sesLogin,
                        videoId: $("#resourceId").val(),
                        isValid: 1,
                        siteId: 2,//1.pc 2.h5
                        timeType: 2,
                        playTimeList: JSON.stringify(video.arrPlayTimes)
                    };
                    cPlayTime(paramData1);
                }
            };
            if (comm.browser.versions.ios) {
                //关闭页面或者页面跳转定为上次播放时间
                $(window).bind('unload', leaveFn);
            } else {
                $(window).bind('beforeunload', leaveFn);
            }

        },
        //横屏重置
        bindOrientationChangeEvent: function () {
            var t = this;
            $(window).on('orientationchange', function (event) {
                function checkOrient() {
                    if (window.orientation == 0 || window.orientation == 180) {
                        var screenOrientation = 'portrait';
                    } else if (window.orientation == 90 || window.orientation == -90) {
                        var screenOrientation = 'landscape';
                    }
                    return screenOrientation;
                }
                function onlyShowVideo(reRender){
                    if(checkOrient()=="landscape"){//横屏
                        var scrW = window.screen.width*dpr;
                        var scrH = window.screen.height*dpr;
                        var maskElement = $(".al-charge-mask").clone();
                        maskElement.addClass('al-charge-maskFullScreen').css({"height":'100vh',"width":'100vw'});
                        $(".al-mainInner").append(maskElement);
                        $('body').css({"overflow":"hidden",'height':'100vh','width':'100vw'});
                        $("#video .al-charge-mask").css({"opacity":'0'});
                        $(".al-charge-maskFullScreen .al-charge-btn").off("click").on("click",function () {
                            callAppOptions.el = ".solidBtn";
                            user.privExecute({
                                operateType: 'auth',   //'login','auth','conference'
                                callback: function () {
                                    comm.newReleaseBox({
                                        imgPath: "//img50.allinmd.cn/case/release.png",
                                        title: "打开唯医骨科app，尽享唯医学院精品内容",
                                        solidBtnTitile: "立即打开",
                                        authNoneTitle: " ",
                                        data: callAppOptions
                                    });
                                },
                                noNeedBack: true,
                                noAuthTip: 1
                            });
                        });
                    }else{//竖屏
                        $(".al-charge-maskFullScreen").remove();
                        $('body').css({"overflow":"auto",'height':'auto','width':'auto'});
                        $("#video .al-charge-mask").css({"opacity":'1'});
                    }
                }
                $("#video").css({
                    "width": "100%"
                });
                if($(".al-charge-mask").length===0||($(".al-charge-mask").css("display")==='none')){
                    $('.CKa1-dimensions').css({
                        width: $(window).width(),
                        height: $(window).width() * 0.56
                    })
                }else {
                    onlyShowVideo();
                }

            });

            $(window).on('resize', function (event) {
                $("#video").css({
                    "width": "100%"
                });
                $('.CKa1-dimensions').css({
                    width: $(window).width(),
                    height: $(window).width() * 0.56
                });
                $('#video .video-js .allinmd-modal-dialog').css({
                    width: $('#CKa1').width(),
                    height: $('#CKa1').height()
                })
            });
        },
        //电子书系列视频
        eBookSeriesVideo: function () {
            var t = this;
            var seriesBox = $(".Ev-seriesVideo");
            var cBack = function (data) {
                if (data && data.responseObject && data.responseObject.responseData && data.responseObject.responseData.data_list) {
                    var items = data.responseObject.responseData.data_list;
                    seriesBox.show();
                    var html = "";
                    var videoName, nowRefId, nowPlayNum;
                    $.each(items, function (i, e) {
                        videoName = e.videoName;
                        nowRefId = e.videoId;
                        if (comm.getLength(videoName) > 48) {
                            videoName = comm.cutstr(videoName, 36) + '……' + comm.revCutstr(videoName, 10);
                        }
                        html += '<article class="swiper-slide ' + (refId == nowRefId ? 'living' : '') + '"><a href="' + e.webStoragePath + '">' +
                            videoName +
                            (refId == nowRefId ? '<span class="livingMark Ev-highLight">播放中</span>' : '') +
                            '</a></article>';
                    });
                    var html2 = html + '<article class="swiper-slide allElement Ev-moreVideoBtn">' +
                        '<a href="/dist/eBook/eBook_chapter.html?articleBook=' + t.bookId + '&articleCatalogue=' +
                        t.catalogueParentId + '&catalogueName=' + t.videoCatalogueName + '&catalogueNum=' + t.catalogueSortId + '&bookName=' + t.bookName + '&type=2" class="icon-videoDetailsMore">' +
                        '<span>全部</span>' +
                        '</a>' +
                        '</article>';

                    $(".Ev-sVideoAppend").html(html2);
                    t.indexCarousel();
                } else {
                    seriesBox.hide();
                }
            };
            comm.ajax.async(t.path.cVideoList, {
                paramJson: $.toJSON({
                    videoId: refId,
                    catalogueId: t.catalogueParentId,
                    scene: 10,
                    visitSiteId: 2
                })
            }, cBack);
        },
        //系列视频
        loadSeriesVideo: function () {
            var t = this;
            var seriesBox = $(".Ev-seriesVideo");
            comm.creatEvent({
                browType:416,
                triggerType: '付费课程终端页',
                triggerName: "相关推荐",
                actionId: 11407,
            });
            $.ajax({
                url: t.path.albumListInTag,
                type: "GET",
                dataType: "json",
                data: {
                    refId: refId,
                    refType: refType//视频
                },
                success: function (data) {
                    if (data && data.rows && data.rows.length > 0) {
                        var list = data.rows;
                        seriesBox.show();
                        var html = "";
                        var videoName, nowRefId;
                        $.each(list, function (i, e) {
                            nowRefId = e.refId;
                            if (comm.getLength(e.refName) > 48) {
                                videoName = comm.cutstr(e.refName, 34) + '……' + comm.revCutstr(e.refName, 8);
                            } else {
                                videoName = e.refName;
                            }
                            html += '<article class="swiper-slide ' + (refId == nowRefId ? 'living' : '') + '"><a href="' + e.refUrl + '">' +
                                videoName +
                                (refId == nowRefId ? '<span class="livingMark Ev-highLight">播放中</span>' : '') +
                                '</a></article>';
                            if (refId == nowRefId) {
                                count1 = i;
                            }
                        });
                        $(".Ev-sVideoAppend").html(html);
                        t.indexCarousel();
                    } else {
                        seriesBox.hide();
                    }
                }
            });

        },
        //选集视频
        loadSelectionVideo:function() {
            var t= this;
            var seriesBox = $(".Ev-seriesVideo");
            seriesBox.find('h2').eq(0).text("选集");
            $.ajax({
                url: '/mcall/cms/video/getSelectionByVideo/',
                type: "post",
                data: {
                    paramJson: $.toJSON(
                        {
                            "videoId": refId,
                            'visitSiteId': 1,
                            'customerId': cId
                        }
                    )
                },
                dataType: 'json',
                success: function (d) {

                    if (d && d.responseObject && d.responseObject.responseData && d.responseObject.responseData.dataList && d.responseObject.responseData.dataList.length > 0) {

                        wakeUpSelection();
                        var list = d.responseObject.responseData.dataList;
                        seriesBox.show();
                        var html = "";
                        var videoName, nowRefId;
                        $.each(list, function (i, e) {
                            //console..log(e.payType);
                            nowRefId = e.videoId;
                            if (comm.getLength(e.videoName) > 48) {
                                videoName = comm.cutstr(e.videoName, 34) + '……' + comm.revCutstr(e.videoName, 8);
                            } else {
                                videoName = e.videoName;
                            }
                            html += '<article class="swiper-slide payType-selection ' + (refId == nowRefId ? 'living' : '') + '"><a href="' + e.webStoragePath + '">' +
                                videoName +
                                ((parseInt(e.payType,10) ===1)&&(parseInt(e.isCollegeCourse,10)===1) ? '<span class="payType livingMark Ev-highLight">免费</span>' : '') +
                                '</a></article>';
                            if (refId == nowRefId) {
                                count1 = i;
                            }
                        });
                        $(".Ev-sVideoAppend").html(html);
                        t.indexCarousel();
                    } else {
                        comm.appWakeUp("figure", callAppOptions);//唤醒app弹层
                        seriesBox.hide();
                    }
                },
                error: function () {
                    seriesBox.hide();
                    comm.appWakeUp("figure", callAppOptions);//唤醒app弹层
                }
            });
        },
        //系列课程
        seriesCouList: function () {
            var t = this;
            var param = {
                paramJson: $.toJSON({
                    "resourceId": refId,    //资源Id
                    "isValid": !$(".al-terminalNone").length ? 1 : 0,
                    "resourceType": refType
                })
            };
            var findRecommendObj = function () {
                var objArr = [$(".Ev-recommendVideo"), $(".Ev-similarRecommend")];
                var resultObj = false;
                $.each(objArr, function (i, v) {
                    if (v.length > 0) {
                        resultObj = v;
                    }
                });
                return resultObj;
            };
            var templateRecommend = function (data) {
                var reStr = "";
                /*//资源类型，1-视频，2-文库，7-病例,17-电子书，18-文章*/
                $.each(data, function (i, v) {
                    var typeStr = "";
                    switch (parseInt(v.resourceType)) {
                        case 1:
                            typeStr = "视频";
                            break;
                        case 2:
                            typeStr = "文库";
                            break;
                        case 7:
                            typeStr = "病例";
                            break;
                        case 17:
                            typeStr = "电子书";
                            break;
                        case 18:
                            typeStr = "文章";
                            break;
                    }
                    reStr += '<article class="al-terminalRecommendItem"><a href="//' + v.webStoragePath + '"><em>' + typeStr + '</em><span>' + comm.getStrLen(v.resourceName, 30) + '</span></a></article>';
                });
                return reStr;
            };

            function recommendShow(data) {
                var recommendObj = findRecommendObj();
                var newArrData = [];
                var recommendLen = 0;
                if (data) {
                    $.each(data, function (i, v) {
                        if (i < 5) {
                            newArrData.push(v);
                        }
                        recommendLen++;
                    });
                }
                recommendObj.find(".al-terminalRecommendItem").each(function (i) {
                    if (i < recommendLen) {
                        $(this).remove();
                    }
                });
                recommendObj.find("h2").after(templateRecommend(newArrData));
                if (recommendObj.find(".al-terminalRecommendItem").length > 0) {
                    recommendObj.show();
                } else {
                    recommendObj.hide();
                }
            }

            var callback = function (rep) {
                if (rep && rep.responseObject && rep.responseObject.responseData && rep.responseObject.responseData.data_list
                    && rep.responseObject.responseData.data_list.length > 0) {
                    $(".Ev-seriesCourse").show();
                    var items = rep.responseObject.responseData.data_list;
                    recommendShow(rep.responseObject.responseData.recommendList);
                    var html = "", nowRefId;
                    var str = [];
                    var xx = [];//存储课程数目 ，比如1课程6节，2课程4节，3课程1节，存为[6,6+4,6+4+1]
                    var yy = [];//存储不同课所占比例,xx的值占总数的比例[]
                    var len = 0;
                    var m = 1, n = 0;
                    $.each(items, function (i, ele) {
                        str.push('系列课 <a style="color:#a9a9a9" href="/dist/discover/discover_seriesDetail.html?tId=' + ele.courseId + '">《' + comm.getStrLen(ele.courseName, 28) + '》</a>');
                        $.each(ele.resourceList, function (k, v) {
                            n++;
                            if (refId.indexOf(v.resourceId) == -1) {
                                html += '<article class="swiper-slide">  ' +
                                    '            <a href="//' + v.webStoragePath + '">' + comm.getStrLen(v.resourceName, 28) + '</a>' +
                                    '       </article>';
                            } else {
                                if (m == 1) {
                                    nowRefId = v.resourceId;
                                    html += '<article class="swiper-slide ' + (refId == nowRefId ? 'living' : '') + '">' +
                                        '   <a href="//' + v.webStoragePath + '">' + comm.getStrLen(v.resourceName, 28) +
                                        (refId == nowRefId ? '<span class="livingMark Ev-highLight">播放中</span>' : '') +
                                        '   </a>' +
                                        '</article>';
                                    count2 = n - 1;
                                } else {
                                    html += '<article class="swiper-slide">  ' +
                                        '            <a href="//' + v.webStoragePath + '">' + comm.getStrLen(v.resourceName, 28) + '</a>' +
                                        '       </article>';
                                }
                                m++;
                            }
                        });
                        len += ele.resourceList.length;
                        xx.push(len);
                    });
                    $.each(xx, function (i, el) {
                        yy.push(el / len);
                    });
                    $('.Ev-seriesCourse h2').html(str[0]);
                    $(".Ev-sCListAppend").html(html);
                    t.indexCarouselCourse(yy, str);
                }
            };
            comm.ajax.async(t.path.getCoursesByResource, param, callback);
        },
        //系列课滚动
        indexCarouselCourse: function (yy, str) {
            var t = this;
            var _hL = $(".Ev-highLight").parents("article");
            var prevLi = _hL.prevAll().length;//当前播放前的li有多少个
            var indexCarousel = new Swiper(".Ev-terminalVideoCourse", {
                direction: 'horizontal',
                speed: 500,
                slidesPerView: "auto",
                loopedSlides: 1,
                freeMode: true,
                initialSlide: count2,
                observer: true,
                observeParents: true,
                onSlideChangeStart: function (swiper) {
                    for (var i = 0; i < yy.length; i++) {
                        if (swiper.progress > yy[i - 1] && swiper.progress < yy[i + 1]) { //滑动比例大于i，小于i+1区间
                            $('.Ev-seriesCourse h2').html(str[i]);
                        } else if (swiper.progress == 1) {   //滑动到最后
                            $('.Ev-seriesCourse h2').html(str[yy.length - 1]);
                        }
                    }
                },
                onReachBeginning: function (swiper) {
                    $('.Ev-seriesCourse h2').html(str[0]);
                }
            });
        },
        //系列视频滑动和初始定位
        indexCarousel: function () {
            var _hL = $(".Ev-highLight").parents("article");
            var prevLi = _hL.prevAll().length;//当前播放前的li有多少个
            var indexCarousel = new Swiper(".Ev-terminalVideoSlideContent", {
                direction: 'horizontal',
                speed: 500,
                slidesPerView: "auto",
                loopedSlides: 1,
                freeMode: true,
                initialSlide: count1
            });
        },
        //推荐视频
        loadRecommendVideo: function () {
            var t = this;
            var recommendBox = $(".Ev-recommendVideo");
            $.ajax({
                url: t.path.listInTag,
                type: "GET",
                dataType: "json",
                data: {
                    refId: refId
                },
                success: function (data) {
                    if (data && data.rows && data.rows[0].refVideoItems && data.rows[0].refVideoItems.length > 0) {
                        var list = data.rows[0].refVideoItems;
                        recommendBox.show();
                        var html = "", html2;
                        $.each(list, function (i, e) {
                            if (i < 5) {
                                html += '<article class="al-terminalRecommendItem"><a href="' + e.webStoragePath + '">' +
                                    '<em>视频</em><span>' + comm.cutstr(e.recommendVideoName, 32, 1) + '</span></a>' +
                                    '</article>';
                            }
                        });
                        html2 = '<h2>相关推荐</h2>' + html;
                        recommendBox.html(html2);
                    } else {
                        recommendBox.hide();
                    }
                }
            })
        },
        //评论区最新最旧按钮切换
        oldNewFunc: function () {
            $(".al-terminalSortChangeItem").on("click", function () {
                $(this).addClass('active').siblings().removeClass('active');
                comm.creatEvent({
                    triggerType: '评论区排序',
                    trigger_name: "评论区排序",
                    keyword: $(this).text(),
                    actionId: 74
                });
            });
        },
        //分享点击
        shareClick: function () {
            var t = this;
            var isWeixin = function () { //是否微信浏览器
                var nav = navigator.userAgent;
                if (/MicroMessenger/.test(nav)) {
                    return true;
                } else {
                    return false;
                }
            };
            t.shareFunc();
            if (isWeixin()) {
                t.shareFunc('initWeixinWord');
            }
        },
        //页面上的分享功能
        shareFunc: function (initWeixinWord) {
            var t = this;
            var paramLog = {};
            paramLog.shareSence = shareSenceConst.video_detail;
            var param = {};
            param.sessionCustomerId = cId ? cId : "";
            param.videoId = refId;
            param.resourceType = refType;
            param.visitSiteId = 2;
            param.useFlag = 12;
            param.logoUseFlag = 3;
            if (videoType != 19) {
                param.sceneType = 6;
            } else {
                param.sceneType = 27;
            }
            var params = {paramJson: $.toJSON(param)};
            var callback = function (rep) {
                if (rep && rep.responseObject && !$.isEmptyObject(rep.responseObject.responseData) && rep.responseObject.responseData.data_list && rep.responseObject.responseData.data_list[0]) {
                    var items = rep.responseObject.responseData.data_list[0];
                    var sinaTitle, qqTitle, qZoneTitle, qqSummary, qZoneSummary, picUrl, shareTitle, shareDesc, wechatTitle, wechatSummary, timelineTitle, timelineSummary;
                    picUrl = items.share_comm.shareImageUrl;
                    shareTitle = items.share_comm.shareTitle != "" ? items.share_comm.shareTitle : document.title;
                    paramLog.picUrl = picUrl;
                    paramLog.shareTitle = shareTitle;
                    $.each(items.share_channel, function (i, el) {
                        if (el.shareChannel == 'Sina') {//新浪
                            sinaTitle = el.shareTitle;
                            shareDesc = el.shareDesc;
                            paramLog.sinaTitle = sinaTitle;
                            paramLog.sinaDesc = shareDesc;
                        } else if (el.shareChannel == "QZone") {//QQ空间
                            qZoneTitle = el.shareTitle;
                            qZoneSummary = el.shareDesc;
                            paramLog.qZoneTitle = qZoneTitle;
                            paramLog.qZoneSummary = qZoneSummary;
                        } else if (el.shareChannel == "WechatFriend") {//微信好友
                            wechatTitle = el.shareTitle;
                            wechatSummary = el.shareDesc;
                            paramLog.wechatTitle = wechatTitle;
                            paramLog.weiXinDesc = wechatSummary;
                        } else if (el.shareChannel == "WechatTimeline") {//微信朋友圈
                            timelineTitle = el.shareTitle;
                            timelineSummary = el.shareDesc;
                            paramLog.timelineTitle = timelineTitle;
                            paramLog.timelineSummary = timelineSummary;
                        }
                    });

                    //判断是否是pK活动作品
                    var sTitleC = comm.cutstr($('.Ev-caseTitle h2').text().replace(/[\n|\s]/g, ""), 30, 1);
                    var authorName = $('.Ev-authorName').text().replace(/[\n|\s]/g, "");
                    authorName = ((authorName == '唯医小编' || authorName == "") ? "" : authorName + ":");//作者名称为唯医小编时为空
                    //视频病例PK活动分享不同
                    if ($('#resourceId').attr('activityId') == 1449026372937) {//1449026372937是视频病例PK活动ID
                        paramLog.shareTitle = "参赛视频《" + sTitleC + "》";
                        paramLog.wechatTitle = paramLog.shareTitle;
                        paramLog.weiXinDesc = authorName + '参加了“骨科示教病例及手术视频评选活动”， 快点赞支持他！点击进入作品';
                        paramLog.timeLineTitle = "参赛视频《" + paramLog.shareTitle + "》，欢迎讨论！";
                        paramLog.sinaDesc = paramLog.weiXinDesc;
                        paramLog.qZoneTitle = paramLog.shareTitle;
                        paramLog.qZoneSummary = paramLog.weiXinDesc;
                    }
                    t.shareFuncClick(paramLog, initWeixinWord);
                }
            };
            setTimeout(function(){
                //console..log(payForClass.data.videoInfo);
                if(payForClass && payForClass.data && payForClass.data.videoInfo && payForClass.data.videoInfo.cms_video && payForClass.data.videoInfo.cms_video.collegeCourseState){
                    var priceState = payForClass.data.videoInfo.cms_video.collegeCourseState;
                }
                //console..log(isNaN(parseInt(priceState,10)),(parseInt(priceState,10)===0));
                if(isNaN(parseInt(priceState,10))||(parseInt(priceState,10)===0)){
                    //console..log('老的分享参数，不用处理')
                }else{
                    param.resourceType = 0;
                    param.sceneType = 100;
                    param.customerId = $('#sesCustomerId').val()!=""&&$('#sesCustomerId').val()!=undefined?$('#sesCustomerId').val():"";
                    param.videoName = payForClass.data.videoInfo.cms_video.videoName;
                    param.videoId	 = payForClass.data.videoInfo.cms_video.videoId;
                    //console..log(params);
                    params = {
                        paramJson:$.toJSON(param)
                    }
                }
                comm.ajax.async(t.path.shareUrl, params, callback);
            },4000);

        },
        //分享点击操作
        shareFuncClick: function (paramLog, initWeixinWord) {
            if (initWeixinWord) {//视频终端在微信浏览器初始化分享话术
                shareAll({
                    title: paramLog.shareTitle,
                    url: window.location.href,//不传默认取当前地址
                    pic: paramLog.picUrl,//分享图片
                    trendUrl: "/mcall/customer/reprint/create/",//分享动态的请求连接  //不需要动态分享就不传
                    noPJ: 0,//0：分享动态给后台的参数需要转为paramJson ,1:不需要
                    data: {//分享动态传给后台的参数
                        "reprintType": refType,
                        "customerId": cId,//当前人ID
                        "refId": refId,//资源id
                        "visitSiteId": "2"//1PC 2 h5
                    },
                    callback: function () {
                    },//分享动态后成功后的回调函数
                    wxTitle: paramLog.wechatTitle,//微信分享标题
                    wxDesc: paramLog.weiXinDesc,//微信分享描述
                    timeLineTitle: paramLog.timelineTitle,
                    sinaTitle: paramLog.sinaDesc,//新浪title
                    desc: paramLog.sinaDesc,//新浪的描述
                    qzoneTitle: paramLog.qZoneTitle,//qq空间title
                    summary: paramLog.qZoneSummary,//qq空间的描述
                    qShareLog: function (x) {
                        comm.shareLog({
                            shareType: refType,
                            resourceId: refId,
                            resourceType: refType,
                            refId: refId,
                            isValid: 1,
                            shareSence: paramLog.shareSence,
                            shareChannel: x == 'sina' ? 3 : 1,
                            shareContent: paramLog.shareTitle,
                            refCustomerId: cId

                        });
                    },  //分享新浪，空间成功与否都执行
                    fnMessageSuc: function () {//分享好友成功回调
                        comm.shareLog({
                            shareType: refType,
                            resourceId: refId,
                            resourceType: refType,
                            refId: refId,
                            isValid: 1,
                            shareSence: paramLog.shareSence,
                            shareChannel: 4,
                            shareContent: paramLog.shareTitle,
                            refCustomerId: cId

                        });
                    },
                    fnTimelineSuc: function () {//分享朋友圈成功回调
                        comm.shareLog({
                            shareType: refType,
                            resourceId: refId,
                            resourceType: refType,
                            refId: refId,
                            isValid: 1,
                            shareSence: paramLog.shareSence,
                            shareChannel: 5,
                            shareContent: paramLog.shareTitle,
                            refCustomerId: cId
                        });
                    }
                }, true);
            } else {
                shareAll({
                    title: paramLog.shareTitle,
                    url: window.location.href,//不传默认取当前地址
                    pic: paramLog.picUrl,//分享图片
                    trendUrl: "/mcall/customer/reprint/create/",//分享动态的请求连接  //不需要动态分享就不传
                    noPJ: 0,//0：分享动态给后台的参数需要转为paramJson ,1:不需要
                    data: {//分享动态传给后台的参数
                        "reprintType": refType,
                        "customerId": cId,//当前人ID
                        "refId": refId,//资源id
                        "visitSiteId": "2"//1PC 2 h5
                    },
                    callback: function () {
                    },//分享动态后成功后的回调函数
                    wxTitle: paramLog.wechatTitle,//微信分享标题
                    wxDesc: paramLog.weiXinDesc,//微信分享描述
                    timeLineTitle: paramLog.timelineTitle,
                    sinaTitle: paramLog.sinaDesc,//新浪title
                    desc: paramLog.sinaDesc,//新浪的描述
                    qzoneTitle: paramLog.qZoneTitle,//qq空间title
                    summary: paramLog.qZoneSummary,//qq空间的描述
                    qShareLog: function (x) {
                        comm.shareLog({
                            shareType: refType,
                            resourceId: refId,
                            resourceType: refType,
                            refId: refId,
                            isValid: 1,
                            shareSence: paramLog.shareSence,
                            shareChannel: x == 'sina' ? 3 : 1,
                            shareContent: x == 'sina' ? (paramLog.sinaDesc ? paramLog.sinaDesc : document.title) : (paramLog.qZoneTitle ? paramLog.qZoneTitle : document.title),
                            refCustomerId: cId
                        });
                    },  //分享新浪，空间成功与否都执行
                    fnMessageSuc: function () {//分享好友成功回调
                        comm.shareLog({
                            shareType: refType,
                            resourceId: refId,
                            resourceType: refType,
                            refId: refId,
                            isValid: 1,
                            shareSence: paramLog.shareSence,
                            shareChannel: 4,
                            shareContent: paramLog.wechatTitle,
                            refCustomerId: cId

                        });
                    },
                    fnTimelineSuc: function () {//分享朋友圈成功回调
                        comm.shareLog({
                            shareType: refType,
                            resourceId: refId,
                            resourceType: refType,
                            refId: refId,
                            isValid: 1,
                            shareSence: paramLog.shareSence,
                            shareChannel: 5,
                            shareContent: paramLog.timelineTitle,
                            refCustomerId: cId
                        });
                    }
                }, false, $(".Ev-shareBtn"));
            }

        },
        //页面中的浏览，关注数，视频的关注状态
        contentFun: function () {
            var t = this;
            var nameStr = "";
            var callback = function (rep) {
                if (rep && rep.responseObject && rep.responseObject.responseData && rep.responseObject.responseData.data_list) {
                    var data = rep.responseObject.responseData.data_list[0];//关注
                    payVipOrClass.init(rep);
                    // payForClass.init(data);
                    var info = data.cms_video;//收藏，点赞，评论，关注，浏览数
                    var auth = data.cms_video_customer;//视频的作者
                    var authLogo = data.cms_video_customer_logo && data.cms_video_customer_logo.logoUrl;

                    $(".Ev-authorName").text(auth.lastName + auth.firstName);
                    $(".authorCont img").eq(0).attr("src", authLogo);
                    $(".authorCont p").eq(1).html("<span style='margin-right:.2rem'>" + auth.medicalTitleShow + "</span><span>" + auth.workplace + "</span>");
                    $(".authorCont a").attr("href", (auth.customerId && auth.customerId != 0) ? "/dist/personal/others_index.html?cid=" + auth.customerId : 'javascript:;');
                    if (data.owerNameList && data.owerNameList.length > 1) {//视频多作者
                        var html = "";
                        $.each(data.owerNameList, function (i, val) {
                            html += '<li>' +
                                '<a href="' + (val.refCustomerId && val.refCustomerId != 0 ? '/dist/personal/others_index.html?cid=' + val.refCustomerId : "javascript:;") + '" style="display:inline-block;">' +
                                '   <img src="' + val.logoUrl + '" alt=""/>' +
                                '   <section class="author_name">' + val.authorName + '</section>' +
                                '</a>' +
                                '</li>';
                            nameStr += val.authorName + ",";
                        });
                        $(".authorCont").hide();
                        $(".authorNewCont").show();
                        $(".authorNewCont ul").html(html);
                    } else {
                        if (!auth.customerId || auth.customerId == 0) {
                            $(".authorCont").hide();
                        } else {
                            $(".authorCont").show();
                        }
                    }
                    $('#resourceId').attr('activityId', info.activityId);//把activityId赋值给input#resourceId属性
                    //视频关注 回复数

                    if (info.reviewNum && info.reviewNum > 0) {
                        $(".Ev-navReviewNum").text(info.reviewNum);//评论区导航评论数字
                        //$(".Ev-reviewNum span").show().text(info.reviewNum);//评论数
                    } else {
                        $(".Ev-navReviewNum").text(0);//评论区导航评论数字
                        //$(".Ev-reviewNum span").hide();
                    }

                    if (info.playNum && info.playNum > 0) {
                        if (parseInt(info.playNum) > 9999) {
                            $(".Ev-browseNum").text(info.playNum.toW());//播放数
                        } else {
                            $(".Ev-browseNum").text(info.playNum);//播放数
                        }

                    } else {
                        $(".Ev-browseNum").text(0);//浏览数
                    }

                    if (info.preferUpNum && info.preferUpNum > 0) {
                        if (parseInt(info.preferUpNum) > 9999) {
                            $(".Ev-praiseNum span").show().text(info.preferUpNum.toWKH());//点赞数
                        } else {
                            $(".Ev-praiseNum span").show().text(info.preferUpNum);//点赞数
                        }
                    } else {
                        $(".Ev-praiseNum span").text("点赞");//点赞数
                    }
                    if (info.collectionNum && info.collectionNum > 0) {
                        if (parseInt(info.collectionNum) > 9999) {
                            $(".Ev-collectNum span").show().text(info.collectionNum.toWKH());//收藏数
                        } else {
                            $(".Ev-collectNum span").show().text(info.collectionNum);//收藏数
                        }
                    } else {
                        $(".Ev-collectNum span").text("收藏");//收藏数
                    }
                    //视频的点赞状态和收藏状态
                    if (parseInt(data.preferRelationship) != 0) {//点赞
                        $(".Ev-praiseNum i").addClass("active");
                    } else {
                        $(".Ev-praiseNum i").removeClass("active");
                    }
                    if (parseInt(data.collectionRelationship) != 0) {//收藏
                        $(".Ev-collectNum i").addClass("active");
                    } else {
                        $(".Ev-collectNum i").removeClass("active");
                    }
                    t.activityStatus(data);
                    t.meetingStatus(data);

                    if (videoType == 19) {
                        t.articleStatus(data);
                    }
                    t.praColDisFunc(auth.customerId, nameStr);//点赞收藏评论操作
                    if($('.Ev-discussBtnPlaceholder').length){
                        $('.Ev-discussBtnWrap').attr('topHeight', $('.Ev-discussBtnPlaceholder').offset().top);
                    }

                }
            };

            comm.ajax.async(t.path.videoInfo, {
                paramJson: $.toJSON({
                    sessionCustomerId: cId,
                    useFlag: 12,
                    visitSiteId: 2,
                    logoUseFlag: 3,
                    videoId: refId
                    // videoId:1557812418797
                })
            }, callback);
        },
        getColumnInfo: function () {
            var t = this;
            var callback = function (data) {
                if (comm.hasResponseData(data)) {
                    var item = data.responseObject.responseData.data_list;
                    if (item.length) {
                        t.cloumnStatus(item[0]);
                    }
                }
            };
            comm.ajax.async(t.path.cloumnInfo, {
                paramJson: $.toJSON({
                    resourceId: refId,
                    resourceType: refType
                })
            }, callback);
        },
        //点赞收藏评论操作
        praColDisFunc: function (val, nameStr) {
            var t = this;
            $(".Ev-discussBtn").off("click").on("click", function () {//加入讨论操作
                comm.creatEvent({
                    browType:416,
                    triggerType: '付费课程终端页',
                    triggerName: "回复按钮点击",
                    actionId: 11385,
                });
                if(localStorage.getItem("customerRole") === "14" ||
                    localStorage.getItem("customerRole") === "15" ||
                    localStorage.getItem("customerRole") === "13"){
                    comm.toastFactoryAuth(null);
                }else{
                    var authorName = $('.Ev-authorName').text().replace(/[\n|\s]/g, "");
                    if (nameStr) {
                        authorName = nameStr.substring(0, nameStr.length - 1);
                    }
                    var $this = $(this);
                    user.privExecute({
                        operateType: 'auth',   //'login','auth','conference'
                        callback: function () {
                            comm.creatEvent({
                                triggerType: '加入讨论',
                                keyword: $('#resourceId').val(),
                                actionId: 72
                            });
                            if (localStorage.getItem('customerRole') == 2 || localStorage.getItem('customerRole') == 3 || localStorage.getItem('customerRole') == 4) {
                                popup('该用户没有操作权限');
                            } else {
                                var href = "/pages/common/comment.html?resourceId=" + refId + "&username=" + authorName + "&type=" + refType + "&parentId=0&refCustomerId=" + val
                                g_sps.jump($this, href);
                            }
                        },
                        noNeedBack: true,
                        noAuthTip: 1
                    });
                }

            });
            var rep;
            $(".Ev-praiseNum").off("click").on("click", function () {//点赞数点击操作
                // 厂商未认证去认证
                if(localStorage.getItem("customerRole") === "14"){
                    // 审核与二次认证
                    if(user.getRenZhengInfo().state === 0 || user.getRenZhengInfo().state === 1){
                        comm.alertBox({
                            "title":"认证资料审核将在1-3个工作日内完成，请耐心等待 ",
                            "ensure":"知道了",
                        });
                    }else{
                        // 厂商未认证时,直接去APP认证,认证后可以看
                        var androidParam = "{}";
                        var iosParam = "";
                        comm.newReleaseBox({
                            imgPath:"/images/img50/case/release.png",
                            title:"厂商认证需使用唯医骨科App",
                            solidBtnTitile:"立即使用",
                            authNoneTitle:"暂不使用",
                            data:{
                                el: ".solidBtn",
                                ios: "allinmdios://app.allinmd.cn/applinks.html?"+iosParam,
                                ios9: "http://app.allinmd.cn/applinks.html?"+iosParam,
                                android: "allin://com.allin.social:75235?data="+androidParam
                            }
                        });
                    }
                }else {
                    // 医助与厂商认证后可以赞
                    if (cId && (user.getRenZhengStatus() ||
                        (localStorage.getItem("customerRole") === "13" ||
                            localStorage.getItem("customerRole") === "15"))) {
                        var kv = $(".Ev-praiseNum span").text();
                        var preferUpNum;
                        if (kv == "点赞") {
                            preferUpNum = "";
                        } else if (kv.indexOf("万") > -1) {
                            preferUpNum = $(".Ev-praiseNum span").text();
                        } else {
                            preferUpNum = parseInt($(".Ev-praiseNum span").text());
                        }
                        var params = {};
                        params.customerId = cId;
                        params.refId = refId;
                        params.usefulType = refType;
                        params.upDownType = 1;
                        var paramData = {paramJson: $.toJSON(params)};
                        user.privExecute({
                            operateType: 'auth',   //'login','auth','conference'
                            callback: function () {
                                if ($(".Ev-praiseNum i").hasClass("active")) {//取消点赞
                                    var callbackOff = function (rep) {
                                        if (rep && rep.responseObject && rep.responseObject.responseStatus && rep.responseObject.responseStatus == true) {
                                            $(".Ev-praiseNum i").removeClass("active");
                                            if (kv.indexOf("万") == -1) {
                                                if (preferUpNum && preferUpNum > 0) {  //点赞数
                                                    if (preferUpNum - 1 > 0) {
                                                        $(".Ev-praiseNum span").text(preferUpNum - 1);
                                                    } else {
                                                        $(".Ev-praiseNum span").text("点赞");
                                                    }
                                                } else {
                                                    $(".Ev-praiseNum span").text("点赞");
                                                }
                                            }
                                        }
                                    };
                                    comm.ajax.async(t.path.preDelete, paramData, callbackOff);
                                } else {//点赞
                                    comm.creatEvent({
                                        browType:416,
                                        triggerType: '付费课程终端页',
                                        triggerName: "点赞",
                                        actionId: 11369,
                                    });
                                    var callbackOn = function (rep) {
                                        if (rep && rep.responseObject && rep.responseObject.responseStatus && rep.responseObject.responseStatus == true) {
                                            $(".Ev-praiseNum i").addClass("active");
                                            if (kv.indexOf("万") == -1) {
                                                $(".Ev-praiseNum span").text(preferUpNum + 1);//点赞数
                                            }
                                        }
                                    };
                                    comm.ajax.async(t.path.preCreate, paramData, callbackOn);
                                }
                            },
                            noNeedBack: true,
                            noAuthTip: 1
                        });

                    } else {
                        t.loginState();
                    }
                }
            });
            $(".Ev-collectNum").off("click").on("click", function () {//收藏数点击操作
                // 厂商未认证去认证
                if(localStorage.getItem("customerRole") === "14"){
                    // 审核与二次认证
                    if(user.getRenZhengInfo().state === 0 || user.getRenZhengInfo().state === 1){
                        comm.alertBox({
                            "title":"认证资料审核将在1-3个工作日内完成，请耐心等待 ",
                            "ensure":"知道了",
                        });
                    }else{
                        // 厂商未认证时,直接去APP认证,认证后可以看
                        var androidParam = "{}";
                        var iosParam = "";
                        comm.newReleaseBox({
                            imgPath:"/images/img50/case/release.png",
                            title:"厂商认证需使用唯医骨科App",
                            solidBtnTitile:"立即使用",
                            authNoneTitle:"暂不使用",
                            data:{
                                el: ".solidBtn",
                                ios: "allinmdios://app.allinmd.cn/applinks.html?"+iosParam,
                                ios9: "http://app.allinmd.cn/applinks.html?"+iosParam,
                                android: "allin://com.allin.social:75235?data="+androidParam
                            }
                        });
                    }
                }else {
                    // 医助与厂商认证后可以赞
                    if (cId && (user.getRenZhengStatus() ||
                        (localStorage.getItem("customerRole") === "13" ||
                            localStorage.getItem("customerRole") === "15"))) {
                        var collectionNum;
                        var kVal = $(".Ev-collectNum span").text();
                        if (kVal == "收藏") {
                            collectionNum = "";
                        } else if (kVal.indexOf("万") > -1) {
                            collectionNum = $(".Ev-collectNum span").text();
                        } else {
                            collectionNum = parseInt($(".Ev-collectNum span").text());
                        }
                        var param = {};
                        param.customerId = cId;
                        param.refId = refId;
                        param.collectionType = refType;
                        var paramData = {paramJson: $.toJSON(param)};
                        user.privExecute({
                            operateType: 'auth',   //'login','auth','conference'
                            callback: function () {
                                if ($(".Ev-collectNum i").hasClass("active")) {//取消收藏
                                    var callbackOff = function (rep) {
                                        if (rep && rep.responseObject && rep.responseObject.responseStatus && rep.responseObject.responseStatus == true) {
                                            $(".Ev-collectNum i").removeClass("active");
                                            if (kVal.indexOf("万") == -1) {
                                                if (collectionNum && collectionNum > 0) {
                                                    if (collectionNum - 1 > 0) {
                                                        $(".Ev-collectNum span").text(collectionNum - 1);
                                                    } else {
                                                        $(".Ev-collectNum span").text("收藏");
                                                    }
                                                } else {
                                                    $(".Ev-collectNum span").text("收藏");
                                                }
                                            }
                                        }
                                    };
                                    comm.ajax.async(t.path.colDelete, paramData, callbackOff);
                                } else {//收藏
                                    var callbackOn = function (rep) {
                                        if (rep && rep.responseObject && rep.responseObject.responseStatus && rep.responseObject.responseStatus == true) {
                                            $(".Ev-collectNum i").addClass("active");
                                            if (kVal.indexOf("万") == -1) {
                                                $(".Ev-collectNum span").text(collectionNum + 1);//收藏数
                                            }
                                        }
                                    };
                                    comm.ajax.async(t.path.colCreate, paramData, callbackOn);
                                }
                            },
                            noNeedBack: true,
                            noAuthTip: 1
                        });
                    } else {
                        t.loginState();
                    }
                }
            });
        },
        //认证状态
        loginState: function () {
            user.privExecute({
                operateType: 'auth',   //'login','auth','conference'
                callback: function () {
                    scoringSystem();//新增评分系统
                },
                noNeedBack: true,
                noAuthTip: 1
            });
        },
        //顶部滚动和评论区导航滚动
        scrollFunc: function () {
            var videoH = $('.Ev-videoArea').height();
            $('.Ev-videoAreaWrap').height(videoH);
            setTimeout(function(){
                $('.wakeUpAppMask').height(videoH);
            },1000);
            $('.Ev-discussBtnPlaceholder').height($(".Ev-discussBtnWrap").outerHeight());
            var _top = $(".Ev-discussBtnWrap").length?$(".Ev-discussBtnWrap").offset().top:0;
            var _appWakenH = $('.al-appWakeUpFigure').outerHeight();
            var scrolls = 0;
            $(window).on("touchmove", function () {
                _top = $('.Ev-discussBtnPlaceholder').offset().top - $('.Ev-videoAreaWrap').height();
                scrolls = $(this).scrollTop();//获取当前可视区域距离页面顶端的距离
                if (scrolls >= _top) {//评论区顶部最新最旧
                    var top = 0;
                    if ($('.Ev-videoArea').length > 0) {
                        top = videoH + "px";
                    }
                    $(".Ev-discussBtnWrap").css({
                        "position": "fixed",
                        "top": top,
                        "left": 0,
                        "right": 0,
                        "z-index": 2,
                        'borderBottom': "1px solid #b9b9b9"
                    });
                } else {
                    $(".Ev-discussBtnWrap").css({
                        position: "static",
                        border: 'none'
                    });
                }
                if (scrolls > _appWakenH) {//播放区域固定
                    $('.Ev-videoArea').css({
                        position: 'fixed',
                        top: 0,
                        zIndex: 2
                    });
                    $(".wakeUpAppMask").css({"position":"fixed"});
                } else {
                    $('.Ev-videoArea').css({
                        position: 'relative',
                        top: 0
                    });
                    $(".wakeUpAppMask").css({"position":"absolute"});
                }
            });
        },
        //所属会议
        meetingStatus: function (data) {
            var t = this;
            var _m = data.conference;
            if (_m && !$.isEmptyObject(_m)) {
                $(".ev-joinMeeting").show();
                $(".ev-joinMeeting a").attr('href', '/dist/conference/meeting_detail.html?conId=' + parseInt(_m.conId)).text(comm.getStrByteLen(_m.conName, 50));
            }
        },
        //所属栏目
        cloumnStatus: function (data) {
            if (data.specialId && data.specialTitle) {
                $(".ev-column").show();
                //$(".joinBoneClass").show();
                //$(".columnName").html('《'+comm.getStrByteLen(data.specialTitle, 10)+'》');
                //comm.creatEvent({
                //    triggerType: '功能按钮',
                //    trigger_name: "所属栏目",
                //    keyword: data.specialTitle,
                //    push_message_id:data.specialId,
                //    actionId: 11042,
                //    async: false
                //});

                $(".ev-column a").attr('href', '/dist/discover/discover_columnDetail.html?columnId=' + parseInt(data.specialId)).text('《' + comm.getStrByteLen(data.specialTitle, 28) + '》');
            }

        },
        //所属活动
        activityStatus: function (data) {
            var t = this;
            var act = data.activity;
            if (act.activityId != 0 || act.activityId != "") {
                $(".Ev-activity").show().find("span").text(act.type == 1 ? "所属活动：" : "所属专题：");
                $(".Ev-actName").text("《" + comm.getStrByteLen(act.activityName, 28) + "》").attr("href", act.activityUrl);
            }
        },
        //所属文章
        articleStatus: function (data) {
            var t = this;
            var act = data.book ? data.book : "";
            if ($.trim(act) && !$.isEmptyObject(act)) {
                t.catalogueName = act.catalogueName;
                t.catalogueSortId = act.catalogueSortId;
                t.catalogueParentId = act.catalogueParentId;
                t.videoCatalogueName = act.videoCatalogueName;
                t.bookId = act.bookId;
                t.bookName = act.bookName;
                $("#bookId").val(act.bookId);
                $("#catalogueId").val(act.catalogueId);
                $("#catalogueName").val(act.catalogueName);
                $("#catalogueSortId").val(act.catalogueSortId);
                $("#catalogueParentId").val(act.catalogueParentId);
                $(".Ev-article").show();
                $(".Ev-articleName").text("《" + comm.getStrByteLen(act.docName, 28) + "》").attr("href", act.webStoragePath);
                if (videoType == 19) {//电子书视频
                    t.eBookSeriesVideo();//电子书系列视频
                }
            }
        },
        //更新浏览数
        updateViewdNum: function () {
            commdata.asyncExecute("updateVideoNum", {
                "propertyKey": "playNum",
                "type": "plus",
                "videoId": $("#resourceId").val()
            });
        },
        //草稿提示
        draftRemind: function () {
            var t = this;
            var resourceId = refId;//资源id
            comm.draftRemind({
                url: t.path.reviewOperate,
                data: {refId: resourceId, reviewType: 1, operateType: 1},//reviewType 4:话题 7:病例;
                type: 2, //1:频道页 2:详情页
                resourceId: resourceId,
                resourceType: 1,//resourceType 1-视频，2-文库，4-话题 ,7-病例
                data2: {refId: resourceId, reviewType: 1, operateType: 2}//operateType 1:说明执行的是判断是否加载提示操作 2:关闭提示
            });
        },
        //标签展示
        getTabList: function () {
            var t = this, tagDetailHtml = '';
            //(1-视频,2-文库,4-话题,7-病例)
            comm.creatEvent({
                browType:416,
                triggerType: '付费课程终端页',
                triggerName: "标签",
                actionId: 11406,
            });
            $.ajax({
                url: t.path.tagList,
                type: "post",
                data: {
                    paramJson: $.toJSON(
                        {"resourceType": 1, "resourceId": refId, isValid: 1, vFlag: 4}
                    )
                },
                dataType: 'json',
                success: function (d) {
                    if (d && d.responseData && d.responseData.dataList) {
                        var _date = d.responseData.dataList;
                        var tagHtml = '';
                        for (var i = 0; i < _date.length; i++) {
                            var tagName = comm.getStrByteLen(_date[i].propertyName, 18);
                            if (_date[i].propertyType == 4) {
                                if (_date[i].propertyLogoUrl) {//如果存在图片
                                    if (parseInt(_date[i].propertyId, 10) === 14) {
                                        tagHtml += '<li><a href="//m.allinmd.cn/dist/elite/elite.html#/home"  class="al-terminalTags"><img src="' + _date[i].propertyLogoUrl + '" />' + tagName + '</a></li>'
                                    } else {
                                        tagHtml += '<li><a href="//m.allinmd.cn/dist/organization/organization.html?orgId=' + _date[i].propertyId + '#/" class="al-terminalTags"><img src="' + _date[i].propertyLogoUrl + '" />' + tagName + '</a></li>'
                                    }

                                } else {//没有图片展示默认图
                                    if (parseInt(_date[i].propertyId, 10) === 14) {
                                        tagHtml += '<li><a href="//m.allinmd.cn/dist/elite/elite.html#/home"  class="al-terminalTags"><img src="/images/img50/v3/video-detail/normalTagIcon.png" />' + tagName + '</a></li>'
                                    } else {
                                        tagHtml += '<li><a href="//m.allinmd.cn/dist/organization/organization.html?orgId=' + _date[i].propertyId + '#/" class="al-terminalTags"><img src="/images/img50/v3/video-detail/normalTagIcon.png" />' + tagName + '</a></li>'
                                    }

                                }
                            } else {
                                tagHtml += '<li><a href="//m.allinmd.cn/dist/discover/discover_tagSubject.html?tId=' + _date[i].propertyId + '" class="al-terminalTags">' + tagName + '</a></li>'
                            }
                        }
                        if (_date.length > 0) {//如果存在数据
                            if ($('.videoDetailTa').length <= 0) {//即如果页面中没有相应的dom结构
                                tagDetailHtml = '<aside class="videoDetailTag">' +
                                    '                <p>所属标签</p>' +
                                    '                 <ul data-alcode-mod=\'498\'>' +
                                    tagHtml +
                                    '                 </ul>' +
                                    '             </aside>';
                                $('.introductionDetailCont').after(tagDetailHtml);
                                $('.introductionDetailCont .videoDetailTag').remove();
                            } else {
                                $('.videoDetailTag ul').html(tagHtml);
                                $('.videoDetailTag ul').show();
                            }
                        }
                    }
                }
            });
        }
    };
    //alert('逻辑进入');
    video.getVideoSlice(video.init);
    //video.init();
//相关产品
    var relatedProducts = {
        path: {
            product: "/mcall/cms/resourceCategory/getMapList/"
        },
        init: function () {
            var t = this;
            t.resourceType = $("#relationType").val();
            t.resourceId = $("#resourceId").val();
            t.getData();
            t.appendRecommendProduct();
            comm.creatEvent({
                browType:416,
                triggerType: '付费课程终端页',
                triggerName: "相关产品",
                actionId: 11409,
            });
        },
        appendRecommendProduct:function(){
            var oldRecommendElement = $(".al-productRecommendPart");//原有的相关推荐产品
            var newRecommendTemplate = '<!--推荐产品开始-->'+
                '                        <section class="al-elite-productList" style="display: none;">'+
                '                            <section class="al-elite-titleBar productTitle"><h1 class="title">推荐产品</h1>'+
                '                            </section>'+
                '                            <section class="al-elite-productContainerWrap">'+
                '                                <section class="al-elite-productContainer">'+
                '                                </section>'+
                '                            </section>'+
                '                        </section>'+
                '  <!--推荐产品结束-->';
            oldRecommendElement.hide().after(newRecommendTemplate);
            oldRecommendElement.remove();
        },
        getData: function () {
            var t = this;
            var data = {
                resourceType: t.resourceType,     //文库2 视频1 病例7
                resourceId: t.resourceId,
                categoryType: 4,
                pageIndex: 1,
                pageSize: 10000,
                isValid: 1,
                sortType: 5,
                vFlag: "3.8"
            };
            var params = {paramJson: $.toJSON(data)};
            comm.loading.show();
            comm.ajax.async(t.path.product, params, function (data) {
                $(".al-productRecommendPart").css("display", "block");
                if (data && data.responseObject) {
                    if (data.responseObject.responseData && data.responseObject.responseData.total_count) {
                        var total_count = data.responseObject.responseData.total_count;
                        t.total_count = total_count;
                        $('.al-productRecommendPart .num').text(total_count);
                    }
                    if (data.responseObject.responseData && data.responseObject.responseData.data_list) {
                        var data_list = data.responseObject.responseData.data_list;
                        if (data_list.length > 0) {
                            t.dataProcessing(data_list);
                        }
                    }
                    if ($.isEmptyObject(data.responseObject.responseData)) {
                        $(".al-productRecommendPart").css("display", "none");
                    }
                }

                comm.loading.hide();
            });
        },
        dataProcessing: function (data) {
            var t = this;
            var html = '';
            /*唯医3.6推荐产品逻辑开始*/
            var filterData = function(originalData){
                var list = [];
                var lastData = JSON.parse(JSON.stringify(originalData));
                for(var num = 0;num<lastData.length;num++){
                    var dataItem  = lastData[num];
                    if (parseInt(dataItem.operationType, 10) !== 3) {
                        list.push(dataItem);
                    }
                }
                return list;

            };
            data = filterData(data);
            t.total_count = data.length;
            $(".al-elite-productList .title").html("推荐产品");
            var n = data.length >= 10 ? 10 : data.length;
            if(n>0){
                $(".al-elite-productList").show();
            }
            for (var i = 0; i < n; i++) {
                var dataItem = data[i];
                var newUrlLink = dataItem.productId;
                dataItem.webStoragePath = '//m.allinmd.cn/dist/medPlus/medPlus.html?#/productDetail?productId=' + newUrlLink + '&';
                if (parseInt(dataItem.operationType, 10) === 1) {
                    if (dataItem.attPath !== '') {
                        html+='<a class="al-elite-productItem" href="' + dataItem.webStoragePath + '?from=2&visitSiteId=2"  class="ev_digHole">\n' +
                            '                                        <section class="al-elite-productCard"\n' +
                            '                                                 style="background: url(&quot;'+dataItem.attPath+'&quot;) center center / cover no-repeat;">\n' +
                            '                                        </section>\n' +
                            '                                        <article class="al-elite-productDes productBackProductDes">\n' +
                            '                                            <p class="content">'+dataItem.productName+'</p></article>\n' +
                            '                                    </a>';
                    } else {
                        html+='<a class="al-elite-productItem" href="' + dataItem.webStoragePath + '?from=2&visitSiteId=2"  class="ev_digHole">\n' +
                            '                                        <section class="al-elite-productCard"\n' +
                            '                                                 style="background: url(&quot;//img50.allinmd.cn/score/productNoImg.png&quot;) center center / cover no-repeat;">\n' +
                            '                                        </section>\n' +
                            '                                        <article class="al-elite-productDes productBackProductDes">\n' +
                            '                                            <p class="content">'+dataItem.productName+'</p></article>\n' +
                            '                                    </a>';
                    }
                } else if (parseInt(dataItem.operationType, 10) === 2) {
                    if ((parseInt(dataItem.customerId, 10) === parseInt(cId, 10)) && (parseInt(dataItem.customerId, 10) != 0)) {//我打的产品
                        if (dataItem.attPath !== '') {
                            html+='<a class="al-elite-productItem" href="' + dataItem.webStoragePath + '?from=2&visitSiteId=2"  class="ev_digHole">\n' +
                                '                                        <section class="al-elite-productCard"\n' +
                                '                                                 style="background: url(&quot;'+dataItem.attPath+'&quot;) center center / cover no-repeat;">\n' +
                                '                                            <span class="al-my-product">我的</span>\n' +
                                '                                        </section>\n' +
                                '                                        <article class="al-elite-productDes productBackProductDes">\n' +
                                '                                            <p class="content">'+dataItem.productName+'</p></article>\n' +
                                '                                    </a>';
                        } else {
                            html+='<a class="al-elite-productItem" href="' + dataItem.webStoragePath + '?from=2&visitSiteId=2"  class="ev_digHole">\n' +
                                '                                        <section class="al-elite-productCard"\n' +
                                '                                                 style="background: url(&quot;//img50.allinmd.cn/score/productNoImg.png&quot;) center center / cover no-repeat;">\n' +
                                '                                            <span class="al-my-product">我的</span>\n' +
                                '                                        </section>\n' +
                                '                                        <article class="al-elite-productDes productBackProductDes">\n' +
                                '                                            <p class="content">'+dataItem.productName+'</p></article>\n' +
                                '                                    </a>';
                        }
                    } else {
                        if (dataItem.attPath !== '') {
                            html+='<a class="al-elite-productItem" href="' + dataItem.webStoragePath + '?from=2&visitSiteId=2"  class="ev_digHole">\n' +
                                '                                        <section class="al-elite-productCard"\n' +
                                '                                                 style="background: url(&quot;'+dataItem.attPath+'&quot;) center center / cover no-repeat;">\n' +
                                '                                        </section>\n' +
                                '                                        <article class="al-elite-productDes productBackProductDes">\n' +
                                '                                            <p class="content">'+dataItem.productName+'</p></article>\n' +
                                '                                    </a>';
                        } else {
                            html+='<a class="al-elite-productItem" href="' + dataItem.webStoragePath + '?from=2&visitSiteId=2"  class="ev_digHole">\n' +
                                '                                        <section class="al-elite-productCard"\n' +
                                '                                                 style="background: url(&quot;//img50.allinmd.cn/score/productNoImg.png&quot;) center center / cover no-repeat;">\n' +
                                '                                        </section>\n' +
                                '                                        <article class="al-elite-productDes productBackProductDes">\n' +
                                '                                            <p class="content">'+dataItem.productName+'</p></article>\n' +
                                '                                    </a>';
                        }
                    }

                    // 3推广这项不显示
                    // } else if (parseInt(dataItem.operationType, 10) === 3) {
                    //     if (dataItem.attPath !== '') {
                    //         html+='<a class="al-elite-productItem" href="' + dataItem.webStoragePath + '?from=2&visitSiteId=2"  class="ev_digHole">\n' +
                    //             '                                        <section class="al-elite-productCard"\n' +
                    //             '                                                 style="background: url(&quot;'+dataItem.attPath+'&quot;) center center / cover no-repeat;">\n' +
                    //             '                                           <span class="al-vendor-product">推广</span>\n' +
                    //             '                                        </section>\n' +
                    //             '                                        <article class="al-elite-productDes productBackProductDes">\n' +
                    //             '                                            <p class="content">'+dataItem.productName+'</p></article>\n' +
                    //             '                                    </a>';
                    //     } else {
                    //         html+='<a class="al-elite-productItem" href="' + dataItem.webStoragePath + '?from=2&visitSiteId=2"  class="ev_digHole">\n' +
                    //             '                                        <section class="al-elite-productCard"\n' +
                    //             '                                                 style="background: url(&quot;//img50.allinmd.cn/score/productNoImg.png&quot;) center center / cover no-repeat;">\n' +
                    //             '                                           <span class="al-vendor-product">推广</span>\n' +
                    //             '                                        </section>\n' +
                    //             '                                        <article class="al-elite-productDes productBackProductDes">\n' +
                    //             '                                            <p class="content">'+dataItem.productName+'</p></article>\n' +
                    //             '                                    </a>';
                    //     }

                }

            }
            $('.al-elite-productContainer').append(html);
            if (n == 10) {
                $('.al-elite-productContainer').append('<section class="al-elite-productItem al-elite-productMore total">\n' +
                    '                                        <section class="al-elite-productCard"\n' +
                    '                                                 style="background: url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAYAAACOEfKtAAAAAXNSR0IArs4c6QAABp5JREFUeAHtnc1rlEccx3c3wSSHmCBSRSwmoRARxJqjUMGg9BQPbc+C9FIP9dL2r9BezKG9lIJn20NyKpYUWsgxLQ2IgZKkNYS2iBiFbFLy0s93febhedlnn3mefZLN7s4DDzPPzPzm5bO/38w8LzNbLrXw2N/fP7m9vX2ZKozv7e2Nl8vlcfynOQeJG+R6UNXD/xr/a7w6/+Z6qVKpLOFf6uvr+5W45/hbcpQPs1QaPgCw68CapNxJGn6RsKbqQB5ksb9IfnNAnQPoj4RVD6tdTVXeppICtLW1dZW0tzg/4vq4jVzeNMB7hewjzof9/f0/C3DevGzkDgwgoPrQttu4X3CO2VSm6DTAW+a8h1Z+i7tddP7Kr3CAwJKZfoKZfk7+Zw6i0jnyXMe87wPya0AWat6FAsRUpwD4gHMkRyMPXAR4q5x3Me3ZogorBGC1Wj0ncFTqZlEVO+B8ZgD56cDAwF/NltM0QMz1g93d3W+oyHCzlTlk+Zc9PT0fY9bfN1NuJa8wGndsc3PzAfC+I492g6dmD6vuaoPakpdDLg2kwBP0d7O4V/IWfJTkMOd5+sUp3BdZ65UZINDOAu8H3AtZCzvK6YH3BIjv465lqWcmgIAbB9xjzrezFNIuaYH3jPMGIHWbaHVY94HSvE6GJ1pSDK+NZ63okcgKIJmqz5PZdqTmBWGpjV5bTwTDk/ypAMnwGBlqwOioPi8JiMLVVq/NqaNzKkAmyffJsCNG20bQonFqs9oeDY9eNxxEvEmy5nldezDZ/rDRZDsRoHd79hvk2nGSXOQP/pKR+VLSbV+iCaPCurftdnj6IYZhMZ30i9QFSAc6hUC7PBhIaluR4Tc9JrE8YyYM7QESP8EdiaXu4gDMeJUJ9gXc0PPEmAbS991x8OKaIiZ6UByNCWkgifoAuEyio/IkOVrfVl+vM5iMoYX+64GQBkL4toPX8Dc64zHyE/kaiPbp7dkfuGN+rPPECKB9y/SF7+DW3vb5Ggi8qw5ejFcsQIzEykT4AAm4ZQKdm0rAZ1UzYahq6qJPJo6niroEJcz3FWZ8Grda00A6xusOnr1miJWYSaIG0PtWxT4Hl7JkmJk+cNIxyUygxkyfNp2k//sX15/SZM6qCwU0jaEffKuCLV928LJrgJiJnUz4fHZxJ+ERGK/QGeqrUHfkIAC78xVs2QHMAU8iYteLeyqnfKIYfUNpZWWltLGxUUszNDRUGh0dLfFuIVEmGNFq+WBdUvynyjy+WqFDHElJaB2txi8sLJR2dnZCMr29vaWJiYlUiK2WD1U65QINXK0Ar/YlfEpa62hpXhSehBWmuLSj1fJp9QvGi536wEIBGrMNFmT8jeJs0hyGvKmHjSt25k7EJr1LU4eATFiLVwo7NGAkHY3ijEyjNI3iipI3+di4YicTLhSgRlsNGNFDYYpLO1otn1a/YLzYaRT+HZIXgxHN+ls9DWm2fNv2A3BRAPXBZO3Zlq2gS/eGAAAfqw+0/hrTgQsTEDsW8FSehoPdlS0B2C1pGuM00JZYPN2Se6Aah2IVQv/35oEqnufY8qKVlEvkExAzsTN3InN+jPPYEqgxqwGkM3QAbbF56Qwz92I9Izglx3TDL9YJ0EeDWibvDjsCjzxmoYU2D+1kXSoI+Kz8d8GMKu7zNgvdQPPqf95GxD7nPYs8ujqJGImVgeBroALQQveJryFT3238iS9ktxmeU5c31c+780PFRoyCLQ1poCLQQrfMIUjI8wPObpkDCaucd+vk0dVBYiI2UQjmVi4UzldHswTMhAK7+2LGYxKjEDNhk4In1ecwZ7fYsFTKt9iQBSV/al8VA7RbXTFIWqkpJnVN2MDy1slOm+sudKcbrRUWj0QTNrAwYy35/wm3q1atM2BoL5lruP8ZFvXcVIASAp42nfgFtyv2TQCa9pB5Dzd1Ix4rgB5EbbgzD8SO3rkDaM+AdwV3rZ7GRcMa9oHBxMqQ84YKCIZ3kl9t89poBU9tt9ZAAwoNdFs/GRi41hpoZPiF1rz+Yd6EtbtLmzRgqM+z1jzT5swAJUhBLyjwGt5OmOJMqy1qk4GSxc1swtHM+ZDHbcAYhZLlWhNNfr13kWmne2dtAXopbZJsw6FpDQwWwjTHbUIbBJLHzyg9wIOIO8h+xnlUNq9Ypy5fck/7FZoXeySVp51GplANNJnKBaTbiDsIJK8fkG4r+LzwonIyb0Zt92cEUTB5rwFq/g7jvBY90j9p3Z6WnjX6O4x/kDN/h/GUkbSlf4fxPxamYl2QcMBBAAAAAElFTkSuQmCC\') center center / cover no-repeat;">\n' +
                    '                                        </section>\n' +
                    '                                        <article class="al-elite-productDes productEndProductDes">\n' +
                    '                                            <p class="content">查看更多</p></article>\n' +
                    '                                    </section>');
            }
            if (t.total_count == 9) {
                $('.al-elite-productContainer .al-elite-productMore').remove();
            }
            /*唯医3.6推荐产品逻辑结束*/
            if (t.total_count > 3) {
                //t.touchFun();
            }
            t.skipProduct();
            $('.ev_digHole').click(function () {
                var _hr = $(this).attr('href');
                var _refId = _hr.split('.html')[0];
                var _rd = _refId.substring(_refId.lastIndexOf('/') + 1);
                comm.creatEvent({
                    triggerType: '引流医栈',
                    keyword: $(this).find('.al-productRecommendText').text(),
                    actionId: 1,
                    pushMessageId: _rd,
                    locationId: $(this).parent().index() + 1
                });
            });
        },
        //手动滑动查看
        touchFun: function () {
            var tag_num = $(".al-productRecommendListBox >li").length;
            var nav_widthx = document.body.clientWidth; //获取可视区域宽度
            var tag_width = $(".al-productRecommendListBox >li").width();
            var max_width = (tag_num * tag_width + tag_width + 20) * -1; //获取左滑最大距离
            document.getElementById("al-elite-productContainer").addEventListener('touchstart', touchStart, false);
            document.getElementById("al-elite-productContainer").addEventListener('touchmove', touchMove, false);
            document.getElementById("al-elite-productContainer").addEventListener('touchend', function () {
                isMove = false;
            }, false);
            function touchStart(e) {
                isMove = true;
                tx = parseInt($("#al-productRecommendListBox").css('left'));
                x = e.touches[0].pageX;
            }

            function touchMove(e) {
                if (isMove) {
                    var n = tx + e.touches[0].pageX - x;
                    if (n <= 0 && n > max_width) {
                        $("#al-productRecommendListBox").css('left', n + 'px');
                    }
                }
            }
        },

        //点击全部进入产品列表页
        skipProduct: function () {
            var t = this;
            $(".total").on("click", function () {
                window.location = '/dist/medPlus/medPlus.html#/terminalRelatedProducts?resourceType=' + t.resourceType + '&resourceId=' + t.resourceId + '';
            });
        }
    };
    relatedProducts.init();
    //window.onload = Log.createBrowse(4, "视频终端页面"); //  浏览日志

});
