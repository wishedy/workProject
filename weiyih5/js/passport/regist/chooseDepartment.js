$(function(){
    //Log.createBrowse(69,'身份认证');
    var reAuth = comm.getpara().reAuth;
    var nowState;
        if(TempCache.getItem('auth')){
            nowState = JSON.parse(TempCache.getItem('auth')).state;
        }

    //if(nowState==0){//二次认证，待确认
    //    comm.alertBox({
    //        "title":"很抱歉！我们正在加紧审核您的认证信息，请耐心等待... ",
    //        "ensure":"知道了",
    //        ensureCallback:function(){
    //            if(document.referrer.lastIndexOf("/passport/")>-1){
    //                window.location.href="/";
    //                return false;
    //            }
    //            TempCache.removeItem('autoplay');
    //            history.back();
    //        }
    //    });
    //}
    $('.ev-chooseDepartment').on('click',function(){
        var _dept = $(this).data('dept');
        if (_dept == 2) {
            comm.creatEvent({
                triggerType: '认证-手外',
                keyword: "认证-手外",
                actionId: 28
            });
        } else {
            comm.creatEvent({
                triggerType: '认证-骨科',
                keyword: "认证-骨科",
                actionId: 27
            });
        }
        if(reAuth==1||nowState ==3){  //重新认证不到follow标签页
            location.replace('toAuthNew.html?reAuth=1&platformId=' + _dept + '&flag=' + comm.getpara().flag);
        }else{
            location.replace('toAuthNew.html?isFollow=1&platformId=' + _dept + '&flag=' + comm.getpara().flag);
        }

    });

    $('.ev-skipAuth').on('click',copyAuthJS_notRenZheng_Fn);
    function copyAuthJS_notRenZheng_Fn(){
        comm.creatEvent({
            triggerType:'认证',
            keyword:"暂不认证",
            actionId:26
        });
        TempCache.removeItem('autoplay');
        var t = "/";
        var fromPage = TempCache.getItem("fromPage");
        if(fromPage!=undefined && fromPage!="" && fromPage!=null) {
            t = fromPage;
            if(fromPage.lastIndexOf("personal/personal_")>-1||fromPage.lastIndexOf("/sns.html")>-1){//从个人中心跳过来
                t="/pages/personal/personal_index.html";
            }
            if(fromPage.lastIndexOf("message_")>-1){//从消息跳过来
                t="/pages/message/message_main.html";
            }
            if(
                fromPage.lastIndexOf("/html/m/case/")>-1||
                fromPage.lastIndexOf("/html/m/video/")>-1||
                fromPage.lastIndexOf("/html/m/doc/")>-1||
                fromPage.lastIndexOf("/html/m/topic/")>-1
            ){//终端页暂不认证 ,活动、专题可能也带html/m，判断出错
                t="/";
            }
            if(fromPage.indexOf('living_watch')>-1){//直播页不认证回首页
                t = "/pages/live/livingList.html";

            }
        }
        comm.creatEvent({
            triggerType:'认证',
            keyword:"暂不认证",
            actionId:26
        });
        user.getSessionInfo();
      g_sps.jump(null,t);
    }

});
