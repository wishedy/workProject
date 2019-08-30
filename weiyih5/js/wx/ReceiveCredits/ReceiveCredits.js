/**
 * @name:   微信服务号
 * @desc:   首先进行登录判断
 * @example:
 * @depend:
 * @date: 2018/04/02
 * @author: zhanghongda
 */
$(function () {
    user.privExecute({
        operateType:"login",
        resource:"weixin",
        callback:function(){
            crdit.init();
        }
    });
    var crdit = {
        path:{
            sendCode:M_CALL+'customer/unite/sendCode/',//发送验证码
            checkTime:M_CALL+'caos/credit/getCaosCreditDate/',//校验时间是否开始或者结束
            submitInfo:M_CALL+'mcall/caos/credit/receiveCaosCredit/',//提交信息接口
        },
        param:{
            phoneReg : /^1\d{10}$/,
            timer:'',
            cId:TempCache.getItem("userId"),
            // cId:1511933152997,
            codeId:0
        },
        init : function () {
            var t = this;
            t.checkTime();
        },
        checkTime:function () {
            var t = this;
            $('.ev-phoneNum,.ev-codeCheck').on('focus',function () {
                $('.infoFooter').hide();
            });
            $('.ev-phoneNum,.ev-codeCheck').on('blur',function () {
                $('.infoFooter').show();
            });
            // if($('.infoFooterCon').length>0){
            //     $('.infoFooterCon').find('a').attr('href',"tel:010-59007122");
            // }
            if($('.ev-receiveBtn').length>0){
                $('.ev-receiveBtn').attr('unCli',0)
            }
            if($('.ev-bigImg').length>0){
                $('.ev-bigImg').off('click').on("click",function (e) {
                    var url =$(this).attr("src");
                    var arr = Array();
                    var urls =$(".ev-bigImg").each(function(index){
                        var imgSrc = $(this).attr("src");
                        arr.push(imgSrc);
                    });
                    wx.previewImage({
                        current: url, // 当前显示图片的http链接
                        urls: arr // 需要预览的图片http链接列表
                    });
                    e.preventDefault();
                   return false;
                });
            }
            $('.infoFooter a').on("click",function () {
                var type = $(this).attr('data-type'),
                pageType = $('body').attr('data-alcode'),
                href = $(this).attr('data-href');
                comm.creatEvent({
                    browType:pageType,
                    triggerType:'学分领取',
                    triggerName:'电话号码点击',
                    location_id:type,
                    actionId:11068,

                });
                window.location.href=href;
            });
            param = {
                customerId : t.param.cId
            };
            param.paramJson= $.toJSON(param);
            callback = function (data) {
                if(data&&data.responseObject&&data.responseObject.responseStatus){
                    if(data.responseObject.responseData){
                        var dataCon = data.responseObject.responseData;
                        switch (parseInt(dataCon.stat)){
                            case 0://领取未开始
                                // window.location.href = '//m.allinmd.cn/pages/wx/ReceiveCredits/unOpened.html';
                                if(dataCon.isShowDate==0){//表示是否显示时间
                                    $('.ev-unOpentext').hide();
                                }else{
                                    $('.ev-unOpentext').show();
                                    var startDate = (dataCon.startDate.substring(0,10)).replace(/\-/g,'.'),endDate = (dataCon.endDate.substring(0,10)).replace(/\-/g,'.');
                                    $('.ev-unOpentext').find("span").text(startDate+'-'+endDate);
                                }
                                break;
                            case 1://处于领取时间段
                                $('.ev-reminderTime').text((dataCon.endDate.substring(0,10)).replace(/\-/g,'.'));
                                t.sendCode();
                                t.receiveBtn();
                                break;
                            case 2://领取已结束,判断是否已经领取过学分卡，领取过进行展示
                                // window.location.href = '//m.allinmd.cn/pages/wx/ReceiveCredits/isOver.html';
                                if(dataCon.isReceive==1){//进行判断已经领取过学分卡
                                    $(".ev-isOverContain").hide();//没有领取过的隐藏
                                    $(".ev-isOverReceived").show();//领取过的显示
                                    $('.ev-isOverImg img').attr("src",dataCon.dataMap.picUrl);//显示学分卡
                                    if($('.ev-bigImg').length>0){
                                        $('.ev-bigImg').off('click').on('click',function (e) {
                                            var url =$(this).attr("src");
                                            var arr = Array();
                                            var urls =$(".ev-bigImg").each(function(index){
                                                var imgSrc = $(this).attr("src");
                                                arr.push(imgSrc);
                                            });
                                            wx.previewImage({
                                                current: url, // 当前显示图片的http链接
                                                urls: arr // 需要预览的图片http链接列表
                                            });
                                            e.preventDefault();
                                            return false;
                                        });
                                    }
                                }
                                break;
                        }
                    }
                }
            };
            comm.ajax.async(t.path.checkTime,param,callback);
        },
        //设置倒计时
        setNum:function(time){
          var t=this;
          $('.ev-sendCode').hide();
          $('.ev-countDown').show().find("i").text(time);
          if(time<0){
            $('.ev-sendCode').show();
            $('.ev-countDown').hide().find("i").text(60);
            clearInterval(t.param.timer);
            $(".ev-sendCode").attr("unCli",0);
            t.sendCode();
          }
        },
        //发送验证码接口，判断学分领取状态
        sendCode:function () {
            var t = this;
            $(".ev-sendCode").off("click").on("click",function () {
                var account = $(".ev-phoneNum").val(),code = $(".ev-codeCheck");
                var timestamp = new Date().getTime();
                if($(this).attr('unCli')==0){
                    $(this).attr("unCli",1);
                    if(account==''){
                        popupFn('请输入您的手机号',2000);
                        $(this).attr("unCli",0);
                    }else if(!t.param.phoneReg.test(account)){
                        popupFn('请输入正确的手机号',2000);
                        $(this).attr("unCli",0);
                    }else if(code==''){
                        popupFn('请输入您的验证码',2000);
                        $(this).attr("unCli",0);
                    }else{
                      var time = 60;
                      t.setNum(time);
                      t.param.timer = setInterval(function () {
                        time--;
                        t.setNum(time);
                      },1000);
                        param={
                            siteId:2,
                            typeId:4,
                            account:account,
                            codeLength:4,
                            timestamp:timestamp,
                            ALLINACCESSTOKEN:allinaccesstoken(timestamp,account)
                        };
                        param.paramJson= $.toJSON(param);
                        callback=function (data) {
                            if(data&&data.responseObject&&data.responseObject.responseStatus){
                                t.param.codeId = data.responseObject.responsePk;
                            }else if(!data.responseObject.responseStatus){
                                if(data&&data.responseObject.responseCode=='ERR_001'){
                                    popupFn('今日获取次数已达上限',2000);
                                }else if( data && data.responseObject.responseMessage){
                                    popupFn(data.responseObject.responseMessage,2000);
                                }else{
                                    popupFn("发送失败！",2000);
                                }
                                $('.ev-sendCode').show();
                                $('.ev-countDown').hide().find("i").text(60);
                                clearInterval(t.param.timer);
                                $(".ev-sendCode").attr("unCli",0);
                                t.sendCode();
                            }
                        };
                        errorCallBack=function () {};
                        comm.ajax.async(t.path.sendCode,param,callback);
                    }
                }
            })
        },
        //立即领取按钮
        receiveBtn:function () {
            var t = this;
            $(".ev-receiveBtn").off("click").on("click",function () {
                comm.creatEvent({
                    triggerType:'学分领取',
                    triggerName:'立即领取',
                    actionId:11067,
                    browType:228
                });
                if($(this).attr('unCli')==0){//表示可以进行点击
                    var _t = $(this);
                    _t.attr('unCli',1);
                    var phoneNum = $('.ev-phoneNum').val(),codeNum = $('.ev-codeCheck').val();
                    if(phoneNum==''){
                        popupFn('请输入您的手机号',2000);
                        _t.attr('unCli',0);
                    }else if(!t.param.phoneReg.test(phoneNum)){
                        popupFn('请输入正确的手机号',2000);
                        _t.attr('unCli',0);
                    }else if(codeNum==''){
                        popupFn('请输入您的验证码',2000);
                        _t.attr('unCli',0);
                    }else{
                        param = {
                            typeId:4,
                            validCode:codeNum,
                            account:phoneNum,
                            id:t.param.codeId
                        };
                        param.paramJson = $.toJSON(param);
                        callback = function (data) {
                            _t.attr('unCli',0);
                            if(data&&data.responseObject&&data.responseObject.responseStatus){
                                var dataCon = data.responseObject.responseData;
                                if(dataCon.isHavePermission==1){//表示有权限
                                    if(dataCon.isReceive==0){//表示没有领取过卡片
                                        $('.ev-successContain').show();
                                        $('.ev-infoContain').hide();
                                        $('.ev-failedContain').hide();
                                        $(".ev-sucCard").show();
                                        $(".ev-sucAlCard").hide();
                                        $('.ev-sucCardImg img').attr('src',dataCon.picUrl);
                                        $('.sucTitle').text('领取成功');
                                        if($('.ev-bigImg').length>0){
                                            $('.ev-bigImg').off('click').on('click',function (e) {
                                                var url =$(this).attr("src");
                                                var arr = Array();
                                                var urls =$(".ev-bigImg").each(function(index){
                                                    var imgSrc = $(this).attr("src");
                                                    arr.push(imgSrc);
                                                });
                                                wx.previewImage({
                                                    current: url, // 当前显示图片的http链接
                                                    urls: arr     // 需要预览的图片http链接列表
                                                });
                                                e.preventDefault();
                                                return false;
                                            });
                                        }
                                    }else{//表示领取过学分卡
                                        $('.ev-successContain').show();
                                        $('.ev-infoContain').hide();
                                        $('.ev-failedContain').hide();
                                        $(".ev-sucCard").hide();
                                        $(".ev-sucAlCard").show();
                                        $('.sucTitle').text('您已领过学分，请勿重复提交');
                                        $('.ev-sucCardImg img').attr('src',dataCon.picUrl);
                                        if($('.ev-bigImg').length>0){
                                            $(".ev-bigImg").off('click').on('click',function(e){
                                                var url =$(this).attr("src");
                                                var arr = Array();
                                                var urls =$(".ev-bigImg").each(function(index){
                                                    var imgSrc = $(this).attr("src");
                                                    arr.push(imgSrc);
                                                });
                                                wx.previewImage({
                                                    current: url, // 当前显示图片的http链接
                                                    urls: arr     // 需要预览的图片http链接列表
                                                });
                                                e.preventDefault();
                                                return false;
                                            });
                                        }
                                    }
                                }else{//表示无权限
                                    $('.ev-successContain').hide();
                                    $('.ev-failedContain').show();
                                    $('.ev-infoContain').hide();
                                    $('.ev-refill').on('click',function () {//重新填写按钮
                                        $('.ev-successContain').hide();
                                        $('.ev-failedContain').hide();
                                        $('.ev-infoContain').show();
                                        $('.ev-phoneNum').val('');
                                        $('.ev-codeCheck').val('');
                                        clearInterval(t.param.timer);
                                        $('.ev-sendCode').attr('uncli',0);
                                        $('.ev-sendCode').show();
                                        $('.ev-countDown').hide().find("i").text(60);
                                        t.sendCode();
                                    })
                                }
                            }else{
                                if(data&&data.responseObject&&data.responseObject.responseCode=='1A0002'){
                                    popupFn(data.responseObject.responseMessage,2000);
                                }else if(data&&data.responseObject&&data.responseObject.responseCode=='1A0001'){
                                    popupFn(data.responseObject.responseMessage,2000);
                                }else{
                                    popupFn('验证失败，请重试',2000);
                                }
                            }
                        };
                        comm.ajax.async(t.path.submitInfo,param,callback);
                    }
                }
            })
        }
    };
});
