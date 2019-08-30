/**
 * 功能描述：  设置
 * 使用方法:
 * 注意事件：
 * 引入来源：  作用：
 *
 * Created by LiChunHui on 2016/8/18.
 */
$(function(){
    if(TempCache.getItem("userId")){//登录
        $(".ev-security").parent().show();
        //退出登录
        $("#loginOut").show();
        $("#loginOut").on("click",function(){
            comm.loading.show();
            var  customerId = localStorage.getItem("userId");
            if(comm.isWeiXin()){
                var wxBindUrl = "/mcall/wx/allin/interact/cancleTempStorage/";   // 临时关联关系存储
                $.ajax({url: wxBindUrl, type: "POST", data:{paramJson: $.toJSON({"customerId":customerId})},async:false });
            }
            $.setCookie("wxBrowseAccessLock", null);
            customer.asyncExecute("logout",null,function(re){
                comm.loading.hide();

                TempCache.clear();
            });
            comm.redirect("/");
        })
    }
    $('#back').click(function(){
        comm.creatEvent({
            triggerType:'全站功能按钮点击',
            keyword:"返回",
            actionId:41,
            async:false
        });
    });
    //安全中心
    $(".ev-security").on("click",function(){
        g_sps.jump($(this),"/pages/personal/securityAccount.html");
    });
    //关于唯医
    $(".ev-about").on("click",function(){
        g_sps.jump($(this),"/pages/personal/about.html");
    });
    //意见反馈
    $(".ev-feedBack").on("click",function(){
        g_sps.jump($(this),"/pages/personal/feedBack.html");
    })

});

