/**
 * 功能描述：医鼎联合登录 授权落地页
 * 使用方法:
 * 注意事件：
 * 引入来源：
 * 作用：
 *
 * Created by QiangKaiLiang on 2016/12/02.
 */
var YidingAuthority = function() {
    var that = this;
};
YidingAuthority.prototype = {
    init: function() {
        this.ydUrl = "";
        this.getAuthMsg();
        this.goToYiding();
    },
    goToYiding: function() {
        var that = this;
        $(".al-authLoginBtn").on('click', function(event) {
            event.preventDefault();
            g_sps.jump(null,that.ydUrl);
        });
    },
    getAuthMsg: function() {
        var that = this;
        // 检测登录
        user.login({
            callback: function() {
                $.ajax({
                        url: '/call/customer/unite/getCustomerUnite/',
                        type: 'POST',
                        dataType: 'json',
                        timeout: 10000,
                    })
                    .done(function(data) {

                        var account = data.responseObject.email.length === 0 ? data.responseObject.mobile : data.responseObject.email;
                        if (data.responseObject.mobile.length!==0){
                            that.ydUrl = "//www.yi-ding.net.cn/pages/authority/allinAuthority.html?customerId="+data.responseObject.customerId+'&mobile='+data.responseObject.mobile;
                        } else{
                            that.ydUrl = "//www.yi-ding.net.cn/pages/authority/changePhone.html?customerId="+data.responseObject.customerId;
                        }
                        $(".al-authAccount").show().text("使用唯医帐号(" + account + ")登录");
                        $(".al-authLoginCancel").attr("href",document.referrer);
                    })
                    .fail(function() {
                        //console.log("XHR error...");
                    });
            },
            scene: privilegeSceneConst.eSceneTypeLogin,
            onClose: function() {},
            noAuthReload: true
        });

    }
};
var yidingAuthority = new YidingAuthority();
yidingAuthority.init();
