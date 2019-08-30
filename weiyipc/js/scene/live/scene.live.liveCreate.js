/**
 * 功能描述：
 * 使用方法:
 * 注意事件：
 * 引入来源：  作用：
 *
 * Created by LiChunHui on 2016/11/18.
 */
$(function(){
   // var reg = /^(127|13[0-9]|14[0-9]|15[0-9]|18[0-9])\d{8}$/;//验证手机
   var reg = /^1\d{10}$/;//验证手机
   var liveCreate={};
    liveCreate={
        path:{
            attUpload: PC_CALL + "broadcast/attachment/create/",
            getUnite:PC_CALL+"customer/unite/getCustomerUnite/",
            create:PC_CALL+"broadcast/home/create/"
        },
        init:function(){
            this.validMobile();
        },
        validMobile:function(){
            var t=this;
            $.ajax({
                type : "post",
                url : t.path.getUnite,
                data : {},
                dataType : "json",
                success : function(rep){
                    var unit=rep.responseObject;
                    if (unit && unit.mobile) {//有绑定手机
                        $(".al-webcastBox").show();
                        t.createBaseInfo();
                    } else {
                        $(".al-bindPhoneBox").show();
                        t.onSubmitFlag();
                        t.bindSendBtn();
                        t.bindValidMobile();
                    }
                },
                error:function(){}
            });
        },
        //提交按钮状态的判断
        onSubmitFlag:function(){
            $(".al-bindPhoneMainInfo input").on("input",function(){
                $.each($(".al-bindPhoneMainInfo input"),function(i,em){
                    if(!$(em).val()){
                        $("#ev_sureBtn").attr("on","false").removeClass("active");
                        return ;
                    }else{
                        $("#ev_sureBtn").attr("on","true").addClass("active");
                    }
                });

            })
        },
        //发送验证码按钮
        bindSendBtn: function () {
            var t = this;
            $("#send_validCode").attr("on", "true");
            $("#send_validCode").on("click",function () {
                var mobile = $("#phone_number").val();
                if (mobile) {
                    $(".error_phonemsg").removeClass("showIb");
                    if (!reg.test(mobile)) {
                        $(".error_phonemsg").addClass("showIb");
                        $(".error_phonemsg").html("手机号码格式错误");
                        $("#phone_number").parent().addClass("error");
                        return;
                    } else if ($(this).attr("on") == "true") {
                        $(this).attr("on", "false");
                        $(".error_phonemsg").removeClass("showIb");
                        $("#phone_number").parent().removeClass("error");
                        comm.customer.asyncExecute("validateCustomerAccount", {
                            "type": "mobile",
                            "account": mobile
                        }, function (rep) {
                            if (rep.responseStatus) {
                                //给手机发短信
                                var timestamp = new Date().getTime();
                                comm.customer.asyncExecute("sendSms", {
                                    "siteId": 1,
                                    "typeId": 2,
                                    "account": mobile,
                                    "timestamp":timestamp,
                                    "ALLINACCESSTOKEN": comm.allinaccesstoken(timestamp,mobile)
                                }, function (data) {
                                    if (!data.responseStatus) {
                                        $("#send_validCode").text("重新发送");
                                        alert(data.responseMessage);
                                        return false;
                                    }else{
                                        t.countdown();//倒计时
                                    }
                                });

                            } else {
                                $(".error_phonemsg").addClass("showIb");
                                $(".error_phonemsg").html(rep.responseMessage);
                                $("#phone_number").parent().addClass("error");
                                $("#send_validCode").attr("on", "true");
                                return;
                            }
                        });

                    }
                } else {
                    $(".error_phonemsg").addClass("showIb");
                    $(".error_phonemsg").html("请输入手机号码");
                    $("#phone_number").parent().addClass("error");
                    return;
                }
            });
        },
        //验证手机
        bindValidMobile: function () {
            var t = this;
            $("#ev_sureBtn").on("click", function () {
                var validCode = $("#validCode").val();
                var mobile = $("#phone_number").val();
                if (!reg.test(mobile)) {
                    $(".error_phonemsg").addClass("showIb");
                    $(".error_phonemsg").html("请输入正确手机号码");
                    $("#phone_number").parent().addClass("error");
                    return;
                } else if($(this).attr("on")=="true"){
                    $(this).attr("on","false");
                    if (validCode && mobile) {//验证码不为空
                        $(".error_validCodemsg").removeClass("showIb");
                        $(".error_phonemsg").removeClass("showIb");
                        $("#phone_number").parent().removeClass("error");
                        comm.customer.asyncExecute("updateMobile", {
                            "mobile": mobile,
                            "siteId": 1,
                            "validCode": validCode
                        }, function (data) {
                            $("#ev_sureBtn").attr("on","true");
                            if (data.responseStatus) {
                                $.topTip({mark: "success", content: "成功绑定手机！"});
                                $(".al-webcastBox").show();
                                $(".al-bindPhoneBox").hide();
                                t.createBaseInfo();
                            } else {
                                if(data.responseCode=="0B0002"){
                                    $(".error_validCodemsg").addClass("showIb");
                                }else{
                                    $.topTip({mark: "warn", content: "绑定手机失败！"});
                                }

                            }
                        });
                    }
                }
            });
        },
        //倒计时
        countdown: function () {
            $("#send_validCode").text("60秒后重新发送");
            var timer = null;
            var num = 60;
            timer = setInterval(function () {
                num--;
                if (num == 0) {
                    clearInterval(timer);
                    $("#send_validCode").text("重新发送");
                    $("#send_validCode").attr("on", "true");
                    return;
                }
                $("#send_validCode").text(addZero(num) + "秒后重新发送");
            }, 1000);

            function addZero(n) {
                if (n < 10) {
                    return '0' + n;
                } else {
                    return n;
                }
            };
        },
        //获取时间
        getdate:function(){
            var local = new Date();
            var year = local.getFullYear();
            var month = local.getMonth()+1;
            if(month<10){
                month = "0"+month;
            }
            var day = local.getDate();
            if(day<10){
                day = "0"+day;
            }
            var hour = local.toTimeString().substr(0,2);
            var minute = local.toTimeString().substr(3,2);
            var minuteNew = (Math.ceil(minute/5))*5;
            if(minuteNew<10){
                minuteNew = "0"+minuteNew
            }
            if(minuteNew==60){
                hour=parseInt(hour)+1;
                minuteNew="00";
            }
            var time = hour+":"+minuteNew;
            return {
                year:year,
                month:month,
                day:day,
                hour:hour,
                minute:minute,
                ymd:year+"-"+month+"-"+day,
                time:time
            }
        },
        //创建直播基本信息
        createBaseInfo:function(){
            var t=this;
            $("#ev_dateSelect").text(t.getdate().ymd);
            $("#ev_liveTime").text(t.getdate().time);
            $("#ev_dateSelect").on("click",function(){
                laydate();
            });
            $(".al-webcastTimeInfo").timeDivision({
                container:$(".al-webcastTimeInfo span")
            });
            $("#ev_agree").attr("on","false");
            $("#ev_agree").on("click",function(){
                if($(this).attr("on")=="false"){
                    $(this).attr("on","true");
                    $("b",$(this)).addClass("active");
                }else{
                    $(this).attr("on","false");
                    $("b",$(this)).removeClass("active");
                }
                return false;
            });
            this.submitConfig();
            this.bindUpload("//img10.allinmd.cn/v3/webcast/UplodeCover.png");
            this.cancel();
            this.createSubmit();
            //comm.Log.createBrowse({href:location.href,id:150,name:'UGC开直播-基本信息'});
        },
        //取消
        cancel:function(){
            $("#ev_cancel").on("click",function(){
                history.back(-1);
                //事件埋点
                comm.creatEvent({
                    triggerType:"全站功能按钮点击",
                    keyword:"UGC直播开直播取消",
                    actionId:45
                });
            })
        },
        bindUpload: function (picpath) {
            var t = this;
            if ($("#ev_uploadPic").length > 0) {
                $("#ev_uploadPic").html('<input type="file" id="imgfile" name="file" />');
            }
            var data={};
            data.sessionCustomerId=$("#sesCustomerId").val();
            data.visitSiteId=1;
            data.domain=location.hostname;
            var paramJson = $.toJSON(data);
            czyx.uploadReplace('#imgfile', {
                url: t.path.attUpload, //文件处理的URL,
                data: {paramJson: paramJson},
                uploadReplaceCss: {
                    //设置上传按钮图片
                    background: 'url(' + picpath + ') center no-repeat',
                    backgroundSize: '100%',
                    width: "100%",             //上传按钮的宽度
                    height: "100%"              //上传按钮的高度
                },
                uploadInputCss: {
                    width: "100%",             //上传按钮的宽度
                    height: "100%"             //上传按钮的高度
                },
                uploadBefore: function () {
                    if (!/\.((jpg)|(gif)|(png))$/i.test(this.value)) {
                        alert('只允许上传.jpg .gif .png类型的图片文件');
                        return false;
                    }
                    var fileSize = comm.file.getFileSize(document.getElementById("imgfile"));
                    if (fileSize > 5242880) {
                        alert('图片不能大于' + 5242880 / 1048576 + "M");
                        return false;
                    }

                },
                uploadEnd: function (serverJson) {//上传完毕后调用
                    try {
                        serverJson = $.parseJSON(serverJson);
                        if (serverJson.responseObject.responseStatus) {
                            t.attId = serverJson.responseObject.responseData.responsePk;
                            t.bindUpload(serverJson.responseObject.responseData.url);
                        } else {
                            if (serverJson.message) {
                                alert(serverJson.message);
                            } else {
                                alert("上传失败")
                            }

                        }
                    } catch (e) {
                        alert("上传失败");
                        return;
                    }
                }
            });
        },
        //创建按钮的状态
        submitConfig:function(){
            var config=false;
            $("#ev_create").attr("on","false");
            $("#live_title").on("input",function(){
                if($("#live_title").val()&&$("#live_type option:selected").val()){
                    $("#ev_create").addClass("active").attr("on","true");
                }else{
                    $("#ev_create").removeClass("active").attr("on","false");
                }
            });

            $("#live_type").on("change",function(){
                if($("#live_title").val()&&$("#live_type option:selected").val()){
                    $("#ev_create").addClass("active").attr("on","true");
                }else{
                    $("#ev_create").removeClass("active").attr("on","false");
                }
            })
        },
        //创建点击
        createSubmit:function(){
            var t=this;
            $("#ev_create").on("click",function(){
                if($(this).attr("on")=="true"){
                    $(this).attr("on","false");
                    var data={};
                    data.sessionCustomerId=$("#sesCustomerId").val();
                    data.liveTitle=$("#live_title").val();//直播标题
                    data.liveType=$("#live_type option:selected").val();//直播分类
                    var liveYMD=$("#ev_dateSelect").text();//直播年月日
                    var liveHourminute=$("#ev_liveTime").text();//直播时分
                    data.liveNotice=$("#live_notice").val();//直播公告
                    if(t.getdate().year==liveYMD.substring(0,4)){//当前年
                        data.liveStartTime=liveYMD.substring(5,10)+" "+liveHourminute;
                    }else{
                        data.liveStartTime=liveYMD+" "+liveHourminute;
                    }
                    data.visitSiteId=1;
                    if($("#ev_agree").attr("on")=="true"){
                        data.liveOpened=1;//是否公开0-否，1-是
                    }else{
                        data.liveOpened=0;
                    }

                    var isSuccess=true;
                    if(!data.liveTitle){
                        isSuccess=false;
                        $("#live_title").parent().addClass("error");
                    }else if(comm.getByteLen(data.liveTitle)<10||comm.getByteLen(data.liveTitle)>40){
                        isSuccess=false;
                        $("#live_title").parent().addClass("error");
                    }else{
                        $("#live_title").parent().removeClass("error");
                    }

                    if(!data.liveType){
                        isSuccess=false;
                        $("#live_type").parent().addClass("error");
                    }else{
                        $("#live_type").parent().removeClass("error");
                    }

                    if(!t.checkTime(liveYMD+" "+liveHourminute)){
                        isSuccess=false;
                        $(".al-webcastTime").addClass("error");
                    }else{
                        $(".al-webcastTime").removeClass("error");
                    }

                    if(comm.getByteLen(data.liveNotice)>100){
                        isSuccess=false;
                        $("#live_notice").parent().addClass("error");
                    }else{
                        $("#live_notice").parent().removeClass("error");
                    }
                    data.attId= t.attId;
                    if(isSuccess){
                        var param={};
                        param.paramJson= $.toJSON(data);
                        $.ajax({
                            type : "post",
                            url : t.path.create,
                            data : param,
                            dataType : "json",
                            success : function(rep){
                                if(rep&&rep.responseObject.responseStatus){
                                    $("#ev_create").attr("on","true");
                                    $(".al-webcastNoOpenShade").show();
                                    $(".al-closeBtn").on("click",function(){
                                        history.back(-1);
                                        //事件埋点
                                        comm.creatEvent({
                                            triggerType:"全站功能按钮点击",
                                            keyword:"UGC直播-开直播关闭",
                                            actionId:43
                                        });
                                    })
                                }else{
                                    $("#ev_create").attr("on","true");
                                }
                            },
                            error:function(){}
                        });

                    }else{
                        $(this).attr("on","true");
                    }
                }

            });
        },
        //比较时间
        checkTime:function(endTime){
            var t=this;
            var localDate= t.getdate();
            if(endTime){
                var start=new Date(localDate.year,localDate.month,localDate.day,localDate.hour,localDate.minute,"");
                var end=new Date(endTime.substring(0,4),endTime.substring(5,7),endTime.substring(8,10),endTime.substring(11,13),endTime.substring(14,16),"");
                if(end<start){
                    return false;
                }
            }
            return true;
        }
    }

    user.login({
        callback: function () {
            liveCreate.init();
        },
        scene: privilegeSceneConst.eSceneTypeAuth,
        onClose:function(){
            history.back(-1);
        },
        noAuthReload:true,
        onAuthCancel:"back"
    });
});
