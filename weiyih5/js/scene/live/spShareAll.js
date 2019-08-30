/**
 * @component-name:
 * @desc: obj(必填，可以为{})，weChat(必填) [true只做微信分享，false分享微信及微博，空间], trigger（选填[$('#id')或$('.class')])，
 * @example:    shareAll({
                    title:'11113',
                    url:"http://www.allinmd.cn",
                    wxTitle:'wxxxx',
                    summary:"qzonedfdasfdsfkldjasklfdjskf",
                    timeLineTitle:'timelIne',
                    sinaTitle:'sinannnnn',
                    qShareLog:function(x){    //分享新浪，空间成功与否都执行
                        if(x=='sina'){
                            console.log('sina');
                        }else{
                            console.log('qzone');
                        }
                    }，
                    fnMessageSuc:function(){},      //分享好友成功回调
                    fnTimelineSuc:function(){}      //分享朋友圈成功回调
                },false,$('.share'));
 * @depend:
 * @date: 2016/7/20
 * @author: sunhaibin
 */
function shareAll(obj,weChat,trigger){
    var shareDef={
        title: document.title,
        url: window.location.href,
        pic: 'https://m.allinmd.cn/image/allin_logo.png',
        summary: "汇集海量手术视频、医学文献、病例讨论、会议回放资源。医生专业互动社区。", //qzone描述
        sinaTitle: '新浪直播',
        sinaDesc: '新浪公告',
        qzoneTitle: '唯医直播',
        qqTitle: '',
        wxTitle: "", //微信分享标题
        wxDesc: "", //微信分享描述
        timeLineTitle: "",
        desc: "汇集海量手术视频、医学文献、病例讨论、会议回放资源。医生专业互动社区。",
        closeDialog: function() {
            if ($('.dk-result-pointer').length) {
                $('.dk-result-pointer,.dk-result-pointer-bg').remove();
                $("body").unbind('touchmove');
            }
        },
        // 分享好友成功
        fnMessageSuc: function () {

        },
        // 分享朋友圈成功
        fnTimelineSuc: function () {

        },
        //分享新浪及空间成功（shareToName为分享渠道，if(shareToName=='sina'){fn();})）
        qShareLog:function(shareToName){

        }
    };
    var Weixin_share =function(obj){
        var controller={
            init:function(obj){
                var t=this;
                t.options={};
                t.options=$.extend(shareDef,obj);
                t.getWxConfig();
            },
            getWxConfig: function() {
                var t = this;
                var data;
                var dataJson;
                if(!$.isEmptyObject(weixinJSConfig)){//如果weixinJSConfig不为空，说明signature还可以用，不再重复请求
                    data = weixinJSConfig;
                    wx.config({
                        debug: false,
                        appId: data.appId,
                        timestamp: data.timestamp,
                        nonceStr: data.noncestr,
                        signature: data.signature,
                        jsApiList: [
                            'onMenuShareTimeline',
                            'onMenuShareAppMessage',
                            'onMenuShareQQ'
                        ]
                    });
                    setTimeout(function() {
                        t.shareContent();
                    }, 500);
                }else{
                    $.ajax({
                        url: "/mcall/wx/api/getJSConfig/",
                        type: "post",
                        data: {
                            paramJson: $.toJSON({
                                url: window.location.href
                            })
                        },
                        dataType: 'json',
                        async: true,
                        success: function(res) {
                            dataJson = res;
                            data = dataJson.responseObject.responseData;
                            weixinJSConfig = data;
                            wx.config({
                                debug: false,
                                appId: data.appId,
                                timestamp: data.timestamp,
                                nonceStr: data.noncestr,
                                signature: data.signature,
                                jsApiList: [
                                    'onMenuShareTimeline',
                                    'onMenuShareAppMessage',
                                    'onMenuShareQQ'
                                ]
                            });
                            setTimeout(function() {
                                t.shareContent();
                            }, 500);
                        }
                    });
                }
            },
            shareContent:function(){
                var t = this;
                wx.ready(function(){
                    wx.onMenuShareAppMessage({
                        title:t.options.wxTitle!=''?t.options.wxTitle:t.options.title,
                        desc:t.options.desc,
                        link:t.options.url,
                        imgUrl:t.options.pic,
                        success:function(){
                            t.options.closeDialog();
                            if(t.options.fnMessageSuc){
                                t.options.fnMessageSuc();
                            }
                        },
                        cancel:function(){
                            t.options.closeDialog();
                        },
                        trigger: function (res) {
                        },
                        fail: function (res) {
                        }
                    });
                    wx.onMenuShareTimeline({
                        title:t.options.timeLineTitle===""?t.options.title:t.options.timeLineTitle,
                        desc:t.options.desc,
                        link:t.options.url,
                        imgUrl:t.options.pic,
                        success:function(){
                            t.options.closeDialog();
                            if(t.options.fnTimelineSuc){
                                t.options.fnTimelineSuc();
                            }
                        },
                        cancel:function(){
                            t.options.closeDialog();
                        }
                    });
                    wx.onMenuShareQQ({
                        title:t.options.qqTitle===""?t.options.title:t.options.qqTitle,
                        desc:t.options.desc,
                        link:t.options.url,
                        imgUrl:t.options.pic,
                        success:function(){
                            t.options.closeDialog();
                        },
                        cancel:function(){
                            t.options.closeDialog();
                        }
                    });
                    wx.onMenuShareQZone({
                        title: t.options.qqTitle === "" ? t.options.title : t.options.qqTitle,
                        desc: t.options.desc,
                        link: t.options.url,
                        imgUrl: t.options.pic,
                        success: function () {
                            t.options.closeDialog();
                        },
                        cancel: function () {
                            t.options.closeDialog();
                        }
                    });
                    wx.error(function(res){
                        console.log(res);
                        // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。

                    });
                })
            }
        };
        controller.init(obj);
    };
    var  mobileShare = function (obj){
        var _controller ={
            default:{
                qzone_m:"http://qzs.qzone.qq.com/open/connect/widget/mobile/qzshare/feedback.html?",
                sina_m:"http://v.t.sina.com.cn/share/share.php?&appkey=&"
            },
            init:function(obj){
                var t=this;
                var opt={};
                //如果obj内含有空属性,则删除,以免覆盖默认属性
                for(var x in obj){
                    if(!obj[x]) delete obj[x];
                }
                opt = $.extend(shareDef,obj);
                Weixin_share(opt);//微信分享
                t.shareAction(opt);
            },
            shareAction:function(opt){
                var t=this;
                trigger.on('click',function(){
                    var isWeixin = function(){//是否微信浏览器
                        var nav = navigator.userAgent;
                        if(/MicroMessenger/.test(nav)){
                            return true;
                        }else{
                            return false;
                        }
                    };

                    if (isWeixin()) {
                        var shareHtml = '<div class="dk-result-pointer-bg"></div><div class="dk-result-pointer" ></div>';
                        $("body").append(shareHtml);
                        $("body").bind('touchmove',function(e){
                            e.preventDefault();
                        });
                        if ($(".dk-result-pointer").length) {
                            setTimeout(function () {
                                $(".dk-result-pointer").remove();
                                $(".dk-result-pointer-bg").remove();
                                $("body").unbind('touchmove');
                            }, 10000);
                        }
                        $(".dk-result-pointer,.dk-result-pointer-bg").on("click", function () {
                            $(".dk-result-pointer").remove();
                            $(".dk-result-pointer-bg").remove();
                            $('body').unbind('touchmove');
                            return false;
                        });
                    } else {//不是微信
                        if($('.Ev-SharePopShow').length>0){//已加载过弹层
                            $('.Ev-SharePopShow').show();
                        }else{
                            var notWeixinDom = '<div class="videoPK_share_pop Ev-SharePopShow" style="display: block;background: #efeff4;height:20em;width:100%;position:fixed;bottom:0;left:0;z-index:5;box-shadow:7px 3px 0 0 rgba(0,0,0,.2)">'+
                                '<div id="videoPK_sharebtn" class="vPK_share_cont" style="position:absolute;top:0;width:60%;z-index:6;left:0;height:15em;border-bottom:2px solid #e6e9ea;background:#fff;padding:0 20% 0.5em 20%">'+
                                '<div class="vPK_share_list" style="width:100%;height:2.98667rem;margin:0 auto;">'+
                                '<div class="share_dao" style="font-size:1.5em;color:#333;line-height:2em;text-align:center;margin:1.43em 0 0.7em 0;">分享到</div>'+
                                '<a class="share_sina Ev-BayerShareSina ui-link" target="_blank" ref="sina" style="display:block;width:30%;margin:0 auto;float:left;text-align:center;">'+
                                '<div class="share_sina_icon" style="width:80%;margin:0 auto;">' +
                                '<img src="//m.medplus.net/image/SpTemplate/xinlang.png" _mce_src="//m.medplus.net/image/SpTemplate/xinlang.png" alt="" style="width:100%;margin:0 auto;border:0;">' +
                                '</div>'+
                                '<div class="share_sina_text" style="font-size:1em;color:#333;margin-top:0.6em;text-align:center;">新浪微博</div>'+
                                '</a> ' +
                                '<a class="share_qzone Ev-BayerShareQzone ui-link" target="_blank" ref="qzone" style="display:block;width:30%;margin:0 auto;float:right;text-align:center;">'+
                                '<div class="share_qzone_icon"  style="width:80%;margin:0 auto;">' +
                                '<img src="//m.medplus.net/image/SpTemplate/kongjian.png" _mce_src="//m.medplus.net/image/SpTemplate/kongjian.png" alt="" style="width:100%;margin:0 auto;border:0;">' +
                                '</div>'+
                                '<div class="share_sina_text" style="font-size:1em;color:#333;margin-top:0.6em;text-align:center;">QQ空间</div>'+
                                '</a>' +
                                '</div>'+
                                '</div>'+
                                '<div class="share_quxiao Ev-BayerShareHideBtn" style="background:#868c95;border-radius:3px;width:93.75%;line-height:2em;border:1px solid #7a7f89;position:absolute;bottom:0.3em;left:3.125%;font-size:1.5em;color:#fff;text-align:center;text-shadow:none;">取消</div>'+
                                ' </div>';
                            $('body').append(notWeixinDom);
                        }
                        $('.vPK_share_list>a').on('touchend', function () {
                            var shareToName = $(this).attr('ref');
                            var newHref = t.default[shareToName+'_m'];
                            var picture = '&pics=https:',
                                shareTitle;
                            if (shareToName == 'sina') {
                                picture = "&pic=http:";
                                //shareTitle = opt.sinaTitle != '' ? opt.sinaTitle : opt.title;
                                shareTitle = opt.sinaTitle != '' ? opt.sinaTitle : opt.title;
                            } else if (shareToName = 'qzone') {
                                shareTitle = opt.qzoneTitle != '' ? opt.qzoneTitle : opt.title;
                            }
                            if(opt.pic.search(':')>=0){
                                opt.pic = opt.pic.split(':')[1];
                            }
                            opt.qShareLog&&opt.qShareLog(shareToName);
                            window.open(newHref + 'url=' + encodeURIComponent(opt.url) + '&title=' + encodeURIComponent(shareTitle) + picture + encodeURIComponent(opt.pic) + '&summary=' + encodeURIComponent(opt.summary)+(shareToName=='sina'?'&desc='+encodeURIComponent(opt.desc):""), '_blank');
                            return false;
                        });
                        $('.share_quxiao').on('touchend',function(){
                            comm.creatEvent({
                                triggerType:'全站功能按钮点击',
                                keyword:"取消",
                                actionId:45
                            });
                            $('.videoPK_share_pop').hide();
                            return false;
                        })
                    }
                    return false;
                })
            }
        };
        _controller.init(obj);
    }
    if(weChat==true){
        Weixin_share(obj);
    }else{
        mobileShare(obj,false,trigger);
    }
}