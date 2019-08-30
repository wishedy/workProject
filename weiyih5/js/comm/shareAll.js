/**
 * @component-name:
 * @desc: obj(必填，可以为{})，weChat(必填) [true只做微信分享，false分享微信及微博，空间], trigger（选填[$('#id')或$('.class')])，
 * @example:    shareAll({
 *                  noSelfInit:true or false,//是否自执行，使用场景列表类的分享点击时再触发 Weixin_share
                    title:'11113',
                    url:"http://www.allinmd.cn",//不传默认取当前地址
                    pic:"",//分享图片
                    trendUrl:"",//分享动态的请求连接  //不需要动态分享就不传
                    noPJ:0,//0：分享动态给后台的参数需要转为paramJson ,1:不需要
                    data:{},//分享动态传给后台的参数
                    callback:function(){},//分享动态后成功后的回调函数
                    wxTitle:'wxxxx',//微信分享标题
                    wxDesc:'',//微信分享描述
                    timeLineTitle:'timelIne',
                    sinaTitle:'sinannnnn',//新浪title
                    desc:"sinaadfaipdhaepid",//新浪的描述
                    qzoneTitle:'',//qq空间title
                    summary:"qzonedfdasfdsfkldjasklfdjskf",//qq空间的描述
                    qShareLog:function(x){    //分享新浪，空间成功与否都执行
                        if(x=='sina'){
                            console.log('sina');
                        }else{
                            console.log('qzone');
                        }
                    }
                    fnMessageSuc:function(){},      //分享好友成功回调
                    fnTimelineSuc:function(){}      //分享朋友圈成功回调
                },false,$('.share'));
 * @depend:
 * @date: 2016/7/20
 * @author: sunhaibin
 */
function shareAll(obj, weChat, trigger,onlyAllinCircle) {
    var shareDef = {
        title: document.title,
        url: window.location.href,
        pic: 'https://m.allinmd.cn/image/allin_logo.png',
        summary: "汇集海量手术视频、医学文献、病例讨论、会议回放资源。医生专业互动社区。", //qzone描述
        sinaTitle: '',
        sinaDesc: '',
        qzoneTitle: '',
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
        fnMessageSuc: function() {

        },
        // 分享朋友圈成功
        fnTimelineSuc: function() {

        },
        //分享新浪及空间成功（shareToName为分享渠道，if(shareToName=='sina'){fn();})）
        qShareLog: function(shareToName) {

        }
    };

    var Weixin_share = function(obj) {
        var controller = {
            init: function(obj) {
                var t = this;
                t.options = {};
                t.options = $.extend(shareDef, obj);
                t.options.desc = comm.getStrLen(t.options.desc,50);
                t.options.summary = comm.getStrLen(t.options.summary,50);
                t.options.pic = /^http/.test(t.options.pic)?t.options.pic:"https:"+t.options.pic;
                if (obj.triggerCallback) {
                    t.options = $.extend(t.options,obj.triggerCallback());
                }
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
            shareContent: function() {
                var t = this;
                wx.ready(function() {
                    wx.onMenuShareAppMessage({
                        title: t.options.wxTitle != '' ? t.options.wxTitle : t.options.title,
                        desc: t.options.wxDesc ? t.options.wxDesc : t.options.desc,
                        link: t.options.url.split("?from")[0]+'?&from'+t.options.url.split("?from")[1],//,
                        imgUrl: t.options.pic,
                        success: function() {
                            t.options.closeDialog();
                            if (t.options.fnMessageSuc) {
                                t.options.fnMessageSuc();
                            }
                        },
                        cancel: function() {
                            t.options.closeDialog();
                        }
                    });
                    wx.onMenuShareTimeline({
                        title: t.options.timeLineTitle === "" ? t.options.title : t.options.timeLineTitle,
                        desc: t.options.wxDesc ? t.options.wxDesc : t.options.desc,
                        link: t.options.url,
                        imgUrl: t.options.pic,
                        success: function() {
                            t.options.closeDialog();
                            if (t.options.fnTimelineSuc) {
                                t.options.fnTimelineSuc();
                            }
                        },
                        cancel: function() {
                            t.options.closeDialog();
                        }
                    });
                    wx.onMenuShareQQ({
                        title: t.options.qqTitle === "" ? t.options.title : t.options.qqTitle,
                        desc: t.options.wxDesc ? t.options.wxDesc : t.options.desc,
                        link: t.options.url,
                        imgUrl: t.options.pic,
                        success: function() {
                            t.options.closeDialog();
                        },
                        cancel: function() {
                            t.options.closeDialog();
                        }
                    });
                })
            }
        };
        controller.init(obj);
    };
    var mobileShare = function(obj) {
        var _controller = {
            default: {
                qzone_m: "http://qzs.qzone.qq.com/open/connect/widget/mobile/qzshare/feedback.html?",
                sina_m: "http://v.t.sina.com.cn/share/share.php?&appkey=&"
                    //sina_m: "http://service.weibo.com/share/mobile.php?&appkey=&"

            },
            init: function(obj) {
                var t = this;
                var opt = {};
                opt = $.extend(shareDef, obj);
                opt.desc = comm.getStrLen(opt.desc,50);
                opt.summary = comm.getStrLen(opt.summary,50);
                opt.pic = /^http/.test(opt.pic)?opt.pic:"https:"+opt.pic;
                if (opt.triggerCallback) {
                    opt = $.extend(opt, opt.triggerCallback($(this)));
                }
                if(opt.noSelfInit){//不让自执行

                }else{
                    Weixin_share(opt);
                }
                //微信分享
                t.shareAction(opt);
            },
            shareAction: function(opt) {
                var t = this;

                trigger.off('click').on('click', function() {
                    var sl = $(this);
                    //分享埋点
                    comm.creatEvent({
                        triggerType:'分享',
                        keyword:"分享",
                        actionId:40,
                        locationId:(function(){
                            if(sl.hasClass('ev-share')){
                                if(sl.parents('.al-commentItem').length){
                                    if($('.icon-shareWhite').length){
                                        return sl.parents('.al-commentItem').index()+2;
                                    }else{
                                        return sl.parents('.al-commentItem').index()+1;
                                    }
                                }else{
                                    return 1;
                                }
                            }else{
                                return 1;
                            }

                        })(),
                        refId:(function(){
                            if(window.location.href.indexOf('/html/')>-1){      //终端页加refId
                                var _ind = window.location.href.lastIndexOf('/')+1;
                                return window.location.href.substring(_ind,_ind+13);
                            }else{
                                var _tId = comm.getpara().tId;      //标签专题页加tId
                                if(_tId){
                                    return _tId;
                                }else{
                                    return "";
                                }
                            }
                        })()
                    });


                    if(opt.noSelfInit==true){
                        Weixin_share(opt);
                    }


                    var isWeixin = function() { //是否微信浏览器
                        var nav = navigator.userAgent;
                        if (/MicroMessenger/.test(nav)) {
                            return true;
                        } else {
                            return false;
                        }
                    };

                    if (isWeixin()) {
                        var shareHtml = '<div class="dk-result-pointer-bg"></div><div class="dk-result-pointer" ></div>';
                        $("body").append(shareHtml);
                        $("body").bind('touchmove', function(e) {
                            e.preventDefault();
                        });
                        if ($(".dk-result-pointer").length) {
                            setTimeout(function() {
                                $(".dk-result-pointer").remove();
                                $(".dk-result-pointer-bg").remove();
                                $("body").unbind('touchmove');
                            }, 10000);
                        }
                        $(".dk-result-pointer,.dk-result-pointer-bg").on("click", function() {
                            $(".dk-result-pointer").remove();
                            $(".dk-result-pointer-bg").remove();
                            $('body').unbind('touchmove');
                            return false;
                        });
                        Weixin_share(opt);
                    } else { //不是微信
                        if ($('.al-bottomSharePart').length > 0) { //已加载过弹层
                            $('.al-bottomSharePart').addClass('on');
                            $("body").on("touchmove", function(e) {
                                e.preventDefault();
                            });
                        } else {
                            // var notWeixinDom = '<div class="videoPK_share_pop Ev-BayerShareCasePopShow" style="display: block;background: #efeff4;height:25em;width:100%;position:fixed;bottom:0;left:0;z-index:5;box-shadow:7px 3px 0 0 rgba(0,0,0,.2)">'+
                            //     '<div id="videoPK_sharebtn" class="vPK_share_cont" style="position:absolute;top:0;width:60%;z-index:6;left:0;height:18.5em;border-bottom:2px solid #e6e9ea;background:#fff;padding:0 20% 0.5em 20%">'+
                            //     '<div class="vPK_share_list" style="width:100%;height:2.98667rem;margin:0 auto;">'+
                            //     '<div class="share_dao" style="font-size:1.75em;color:#333;line-height:2em;text-align:center;margin:1.43em 0 0.7em 0;">分享到</div>'+
                            //     '<a class="share_sina Ev-BayerShareSina ui-link" target="_blank" ref="sina" style="display:block;width:30%;margin:0 auto;float:left;text-align:center;">'+
                            //     '<div class="share_sina_icon" style="width:80%;margin:0 auto;">' +
                            //     '<img src="/images/img50column/videoPK/xinlang.png" _mce_src="/images/img50column/videoPK/xinlang.png" alt="" style="width:100%;margin:0 auto;border:0;">' +
                            //     '</div>'+
                            //     '<div class="share_sina_text" style="font-size:1.5em;color:#333;margin-top:0.6em;text-align:center;">新浪微博</div>'+
                            //     '</a> ' +
                            //     '<a class="share_qzone Ev-BayerShareQzone ui-link" target="_blank" ref="qzone" style="display:block;width:30%;margin:0 auto;float:right;text-align:center;">'+
                            //     '<div class="share_qzone_icon"  style="width:80%;margin:0 auto;">' +
                            //     '<img src="/images/img50column/videoPK/kongjian.png" _mce_src="/images/img50column/videoPK/kongjian.png" alt="" style="width:100%;margin:0 auto;border:0;">' +
                            //     '</div>'+
                            //     '<div class="share_sina_text" style="font-size:1.5em;color:#333;margin-top:0.6em;text-align:center;">QQ空间</div>'+
                            //     '</a>' +
                            //     '</div>'+
                            //     '</div>'+
                            //     '<div class="share_quxiao Ev-BayerShareHideBtn" style="background:#868c95;border-radius:3px;width:93.75%;line-height:2em;border:1px solid #7a7f89;position:absolute;bottom:0.3em;left:3.125%;font-size:2.125em;color:#fff;text-align:center;text-shadow:none;">取消</div>'+
                            //     ' </div>';


                            /*@fixed
                             *@desc 样式重构
                             *      增加缓入缓出动效
                             *@fixed by qiangkailiang on 2016/08/18
                             */
                            var trendImg = "";

                            if (typeof(shareDef.trendUrl) !== 'undefined' && shareDef.trendUrl.length !== 0&&shareDef.trendUrl!="") {
                                trendImg = '<img src="//img50.allinmd.cn/pages/index/share_allin.png" _mce_src="//img50.allinmd.cn/pages/index/share_allin.png" alt="">';
                            } else {
                                trendImg = '<img src="//img50.allinmd.cn/pages/index/share_allin_no.png" _mce_src="//img50.allinmd.cn/pages/index/share_allin_no.png" alt="">';
                            }
                            var notWeixinDom = '<section class="al-bottomSelectorListMask al-bottomSharePart">' +
                                '        <section class="al-bottomSelectorListBox">' +
                                '            <section class="al-bottomSelectorList">' +
                                '                <figure class="al-bottomSelectorItem al-bottomShareListBox">' +
                                '                    <h2>分享给好友 共同讨论</h2>' +
                                '                    <ul>' +
                                '                        <li class="al-bottomShareItem" ref="trend">' +
                                '                            <figure class="al-bottomShareImg">' +
                                trendImg +
                                '                            </figure>' +
                                '                            <figcaption>唯医朋友圈</figcaption>' +
                                '                        </li>' +
                                '                        <li class="al-bottomShareItem share_qzone" ref="qzone">' +
                                '                            <figure class="al-bottomShareImg">' +
                                '                                <img src="//img50.allinmd.cn/pages/index/share_kongjian.png" _mce_src="//img50.allinmd.cn/pages/index/share_kongjian.png" alt="">' +
                                '                            </figure>' +
                                '                            <figcaption>QQ空间</figcaption>' +
                                '                        </li>' +
                                '                        <li class="al-bottomShareItem share_sina" ref="sina">' +
                                '                            <figure class="al-bottomShareImg">' +
                                '                                <img src="//img50.allinmd.cn/pages/index/share_weibo.png" alt="">' +
                                '                            </figure>' +
                                '                            <figcaption>微博</figcaption>' +
                                '                        </li>' +
                                '                    </ul>' +
                                '                </figure>' +
                                '            </section>' +
                                '            <section class="al-bottomSelectorList mgt">' +
                                '                <figure class="al-bottomSelectorItem" id="EV-cancelShare"><a href="javascript:void(0)">取消</a></figure>' +
                                '            </section>' +
                                '        </section>' +
                                '    </section>';

                            var notWeixinDom2 = '<section class="al-bottomSelectorListMask al-bottomSharePart">' +
                                '        <section class="al-bottomSelectorListBox">' +
                                '            <section class="al-bottomSelectorList">' +
                                '                <figure class="al-bottomSelectorItem al-bottomShareListBox">' +
                                '                    <h2>分享给好友 共同讨论</h2>' +
                                '                    <ul>' +
                                '                        <li class="al-bottomShareItem" ref="trend">' +
                                '                            <figure class="al-bottomShareImg">' +
                                trendImg +
                                '                            </figure>' +
                                '                            <figcaption>唯医朋友圈</figcaption>' +
                                '                        </li>' +
                                '                    </ul>' +
                                '                </figure>' +
                                '            </section>' +
                                '            <section class="al-bottomSelectorList mgt">' +
                                '                <figure class="al-bottomSelectorItem" id="EV-cancelShare"><a href="javascript:void(0)">取消</a></figure>' +
                                '            </section>' +
                                '        </section>' +
                                '    </section>';

                            if(onlyAllinCircle){
                                $('body').append(notWeixinDom2);
                            }else{
                                $('body').append(notWeixinDom);
                            }
                            setTimeout(function() {
                                $(".al-bottomSharePart").addClass('on');
                                $("body").on("touchmove", function(e) {
                                    e.preventDefault();
                                });
                            }, 200);

                        }
                        $('.al-bottomShareItem').off("click").on('click', function() {
                            var shareToName = $(this).attr('ref');
                            /*@fixed
                             *@desc 增加动态的分享
                             *@fixed by lichunhui on 2016/08/23
                             */
                            if (shareToName == "trend") {
                                if (opt.trendUrl) { //需要分享动态
                                    user.privExecute({
                                        operateType: 'auth', //'login','auth','conference'
                                        callback: function() {
                                            comm.loading.show();
                                            var data = opt.noPJ ? opt.data : {
                                                paramJson: $.toJSON(opt.data)
                                            };
                                            $.ajax({
                                                type: "post",
                                                url: opt.trendUrl,
                                                data: data,
                                                dataType: "json",
                                                success: function(rep) {
                                                    comm.loading.hide();
                                                    $('.al-bottomSharePart').removeClass('on');
                                                    $("body").css("overflow", "visible")
                                                    if (rep && rep.responseObject.responseStatus) {
                                                        opt.callback && opt.callback();
                                                        popup("分享到唯医朋友圈成功！");
                                                    } else {
                                                        popup("分享到唯医朋友圈失败！");
                                                    }
                                                    $('body').unbind('touchmove');
                                                },
                                                error: function() {
                                                    comm.loading.hide();
                                                    popup("分享到唯医朋友圈失败！");
                                                    $('body').unbind('touchmove');
                                                }
                                            });
                                        }
                                    });

                                }

                            } else {
                                var newHref = t.default[shareToName + '_m'];
                                var picture = '&pics=http:',
                                    shareTitle;
                                if (shareToName == 'sina') {
                                    picture = "&pic=http:";
                                    shareTitle = opt.sinaTitle != '' ? opt.sinaTitle.split(':http')[0] : opt.title;
                                } else if (shareToName = 'qzone') {
                                    shareTitle = opt.qzoneTitle != '' ? opt.qzoneTitle : opt.title;
                                }
                                if (opt.pic.search(':') >= 0) {
                                    opt.pic = opt.pic.split(':')[1];
                                }
                                opt.qShareLog && opt.qShareLog(shareToName);
                                window.open(newHref + 'url=' + encodeURIComponent(opt.url) + '&title=' + encodeURIComponent(shareTitle) + picture + encodeURIComponent(opt.pic) + '&summary=' + encodeURIComponent(opt.summary) + (shareToName == 'sina' ? '&desc=' + encodeURIComponent(opt.desc) : ""), '_blank');
                            }
                            $('body').unbind('touchmove');
                            return false;
                        });
                        $('#EV-cancelShare').off('click').on('click', function() {
                            comm.creatEvent({
                                triggerType:'全站功能按钮点击',
                                keyword:"取消",
                                actionId:45
                            });
                            $('.al-bottomSharePart').removeClass('on');
                            $("body").unbind("touchmove");
                            return false;
                        })
                    }
                    return false;
                })
            }
        };
        _controller.init(obj);
    };
    if (weChat == true) {
        Weixin_share(obj);
    } else {
        mobileShare(obj, false, trigger);
    }
};
