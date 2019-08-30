/**
 * 功能描述：
 * 使用方法:
 * 注意事件：
 * 引入来源：  作用：
 *
 * Created by LiChunHui on 2015/10/29.
 */
module.videoPKShare=function(Obj){
    var controller = {
        init : function(Obj){
            var t = this;
            t.options={};
            var shareUrl=window.location.href;
            if($('#activityId').length&&$('#activityId').attr('isResultShowBegin')){
                shareUrl='https://www.allinmd.cn/pages/column/videoPK/pk4_results.html';
            }
            var o={
                title:'决战一触即发，骨科示教病例及手术视频选拔赛决赛入围名单公布！',
                sina:'决战一触即发，骨科示教病例及手术视频选拔赛决赛入围名单公布！点击查看优秀作品名单，看看有没有你心中的“它”！桂冠最终由谁摘得？5月21日CAOS2016为你揭晓！',
                qqFriend:'决战一触即发，骨科示教病例及手术视频选拔赛决赛入围名单公布！',
                qqFriendTitle:'',
                qqZone:"决战一触即发，骨科示教病例及手术视频选拔赛决赛入围名单公布！",
                qqZoneTitle:'',
                url:shareUrl,
                pic:'https://m.allinmd.cn/image/column/videoPK/casePK_banner.jpg'
            };
            t.options= $.extend(o,Obj);

            var opts = t.options;

            t.shareIco = {
                "tsina"	:"http://service.weibo.com/share/share.php?title=" + encodeURIComponent(t.options.sina) + "&url=" + encodeURIComponent(t.options.url) +(t.options.sina?"&summary="+encodeURIComponent(t.options.sina):'')+ (t.options.pic?"&pic="+ encodeURIComponent(t.options.pic):''),
                "tqq"	:"http://connect.qq.com/widget/shareqq/index.html?title="+ encodeURIComponent(t.options.qqFriendTitle? t.options.qqFriendTitle:t.options.title) +"&url=" + encodeURIComponent(t.options.url)+(t.options.qqFriend?"&summary="+encodeURIComponent(t.options.qqFriend):'')+(t.options.pic?"&pics="+ encodeURIComponent(t.options.pic?t.options.pic:''):''),
                "qzone"	:"http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?title=" + encodeURIComponent(t.options.qqZoneTitle? t.options.qqZoneTitle:t.options.title) + "&url=" + encodeURIComponent(t.options.url)+(t.options.qqZone?"&summary="+encodeURIComponent(t.options.qqZone):'')+(t.options.pic?"&pics="+ encodeURIComponent(t.options.pic?t.options.pic:''):'')
            };

            t.share();
            //t.weixingClick();
        },
        share : function(){
            var t=this;
            function eFunction(str){
                return function(){
                    var channel=1;//1-QQ空间，2-QQ好友，3-新浪微博
                    window.open(formatmodel(t.shareIco[str],{title: t.options.title, url: t.options.url}));
                    switch(str){
                        case "tsina":channel=3;break;
                        case "tqq":channel=2;break;
                        case "qzone":channel=1;break;
                    }
                    comm.shareLog({
                        shareType: "",
                        resourceId: "",
                        resourceType: "",
                        refId: "",
                        isValid: 1,
                        shareSence: shareSenceConst.vPK,
                        shareChannel: channel,
                        shareContent: t.options.title
                    });
                    //window.showModalDialog(formatmodel(t.shareIco[str],{title: t.options.title, url: t.options.url}), new Object(), 'dialogWidth=700px;dialogHeight=400px');
                };
                return false;
            }

            function formatmodel(str,model){
                for(var k in model){
                    var re = new RegExp("{"+k+"}","g");
                    str = str.replace(re,model[k]);
                }
                return str;
            }

            for(var si in t.shareIco){
                $("#hr_share .share_ico_"+si).on('click',eFunction(si));
            }

        }

    }

    controller.init(Obj);
};
