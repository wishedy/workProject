function Datacube(swiperIndex) {
    _that = this;
    this.swiperIndex = swiperIndex;
    this.swiper = new Swiper('.swiper-container', {
        pagination: '.swiper-pagination',
        initialSlide: _that.swiperIndex,
        //默认初始索引
        direction: 'vertical',
        onSlideChangeEnd: function(swiper) {
            if (swiper.activeIndex === 1) {
                if (JSON.parse(localStorage.getItem("NumbInfo")).browseVideoTime !== 0) {
                    _that.numWheel.numShow($("#EV-browseVideoTime"), JSON.parse(localStorage.getItem("NumbInfo")).browseVideoTime || 1);
                }
            } else {
                $("#EV-browseVideoTime .numLine ul").css("transform", "translateY(0)");
                $(".master").removeClass("masterShow");
            }
        }
    })
}
Datacube.prototype = {
    constructor: Datacube,
    // 数据获取
    getData: function(customerId) {
        var params = {};
        params.paramJson = JSON.stringify({
            customerId: customerId
        });
        $.ajax({
            url: '/mcall/customer/statisticsStat/info/',
            type: 'POST',
            data: params,
            async: false,
            error: function(xhr) {
                console.log("错误提示： " + xhr.status + " " + xhr.statusText);
            },
            success: function(data) {
                if (data.responseObject.responseData.bo_data && !$.isEmptyObject(data.responseObject.responseData.bo_data)) {
                    _that.InfoWriteLocal(data);
                } else {
                    // 未成功返回数据,跳转至登录页
                  g_sps.jump(null,'/pages/column/data_magic/dataMagic_login.html');
                }
            }
        });
    },
    // 简单数据处理并写入缓存
    InfoWriteLocal: function(data) {
        var stateData = {"J":1,"I":2,"H":3,"G":4,"F":5};
        data.responseObject.responseData.bo_data.worthLevel = stateData[data.responseObject.responseData.bo_data.worthLevel] || 1;
        if (data.responseObject.responseData.bo_data.worthLevel == 5) {
            data.responseObject.responseData.bo_data.worthLevelTitle = "您已成为唯医网的骨科大佬";
        } else {
            data.responseObject.responseData.bo_data.worthLevelTitle = "您距“骨科大佬”仅" + (5 - data.responseObject.responseData.bo_data.worthLevel ) + "步";
        }
        // 设置默认值
        data.responseObject.responseData.bo_data.worthTag = data.responseObject.responseData.bo_data.worthTag || "初出茅庐，还需努力";
        if(_that.isEmptyObject(data.responseObject.responseData.bo_data.titleLevel)){data.responseObject.responseData.bo_data.titleLevel="医路学徒"}
        data.responseObject.responseData.bo_data.browseVideoTime = data.responseObject.responseData.bo_data.browseVideoTime || 0;
        data.responseObject.responseData.bo_data.sendResourcesTotal = data.responseObject.responseData.bo_data.sendResourcesTotal || 0;
        data.responseObject.responseData.bo_data.browsedMyresourceTotal = data.responseObject.responseData.bo_data.browsedMyresourceTotal || 0;
        localStorage.setItem("NumbInfo", JSON.stringify(data.responseObject.responseData.bo_data));
    },
    // 读取本地信息重新渲染
    readInfoRender: function() {
        var state = JSON.parse(localStorage.getItem("NumbInfo"));
        if ((state.sendResourcesTotal > 20) || (state.browsedMyresourceTotal > 1000)) {
            // 移除第页面C  显示 J
            this.swiper.removeSlide(2);
        } else {
            // 移除第页面J 显示 C
            this.swiper.removeSlide(3);
        }
        for (x in state) {
            var $this = $("#EV-" + x);
            switch (x) {
                // 第一个 最后一个关注的人
                case "firstFollowLogoUrl":
                case "lastFollowLogoUrl":
                    if(state[x] !==""){
                        $this.attr('src', "http://img05.allinmd.cn/"+state[x]);
                    }
                    break;
                case "browseVideoTime":
                    if (parseInt(state[x]) != 0) {
                        this.numWheel.numWrite($this, state[x]);
                    } else {
                        this.swiper.removeSlide(1);
                    }
                    break;
                case "starLevel":
                    // 星级
                    var _starLevel = $this.find("li");
                    for (var i = 0; i < state[x]; i++) {
                        _starLevel.eq(i).find("img").attr('src', '/images/img50/column/data_magic/3/lightStar.png');
                    }
                    break;
                case "followPeopleNum":
                    $this.text(state[x]);
                    $("#EV-followPeopleNum02").text(state[x]);
                    break;
                case "worthLevel":
                    //台阶动画
                    this.jumpFloor((state[x]));
                    var $awardGift = $("#EV-awardGift");
                    if ($awardGift.length) {
                        $awardGift.attr("src", "/images/img50column/data_magic/8/award" + state[x] + ".png")
                    }
                    break;
                default:
                    $this.text(state[x]);
            }
        }
    },
    // 判断是否登录,如需要则加载数据
    isLogin: function() {
        var userId = parseInt(localStorage.getItem('userId'));
        if (localStorage.getItem('NumbInfo')) {
            return true;
        } else if (userId) {
            this.getData(userId);
        } else {
            localStorage.setItem("fromPage", "/html/pages/column/data_magic/dataMagic_jump.html");
          g_sps.jump(null,'/pages/column/data_magic/dataMagic_login.html');
        }
    },
    /*滚动数字*/
    numWheel: {
        //数字写入
        numWrite: function(element, num) {
            element.html("");
            var len = String(num).length;
            for (var i = 0; i < len; i++) {
                var n = String(num).charAt(i);
                if (i <= len) {
                    element.append(
                        '<div class="numLine"><ul><li>0</li><li>1</li><li>2</li><li>3</li><li>4</li><li>5</li><li>6</li><li>7</li><li>8</li><li>9</li></ul></div>');
                }
            }
        },
        // 数字滚动
        numShow: function(element, num) {
            var len = String(num).length;
            for (var i = 0; i < len; i++) {
                var n = String(num).charAt(i);
                element.find('ul').eq(i).css("transform", "translateY(" + ( - 10 * n) + "%)");
            }
        }
    },
    // 根据场景选择不同的APP下载地址
    downloadAppAddress: function() {
        var userAgentInfo = navigator.userAgent;
        var isIphone = false;
        if (userAgentInfo.indexOf("iPhone") > 0) {
            isIphone = true
        }
        var isWeixin = (userAgentInfo.indexOf("MicroMessenger") > 0);
        if (isIphone) {
            if (isWeixin) {
                //link = "http://fusion.qq.com/cgi-bin/qzapps/unified_jump?appid=12138947&from=groupmessage&isTimeline=false&actionFlag=0&params=pname%3Dcom.allin.social%26versioncode%3D1%26channelid%3D%26actionflag%3D0&isappinstalled=1";
                link="http://a.app.qq.com/o/simple.jsp?pkgname=com.allin.social";
            } else {
                link = "https://itunes.apple.com/cn/app/wei-yi-for-iphone/id986266583";
            }
        } else {
            link = "http://a.app.qq.com/o/simple.jsp?pkgname=com.allin.social";
        }
        return link;
    },
    // 分享
    addShare: function() {
        $("#Ev-viewOrShare").on("touchend",
            function(e) {
                if (is_weixin()) {
                    var $zhezhao = $('<div id="videoPK_weixin_zhezhao"></div>');
                    $zhezhao.css({
                        position: 'fixed',
                        width: '100%',
                        height: '100%',
                        background: "rgba(0,0,0,0.8)",
                        zIndex: '100',
                        top: '0',
                        left: '0'
                    }).append($(
                        '<img src="/images/img50column/videoPK/video_pk_share.jpg" style="display:block;width:100%;height:100%;opacity:0.6;"/>'));
                    $("#videoPK_weixin_zhezhao").on("touchend",
                        function(e) {
                            $("#videoPK_weixin_zhezhao").remove();
                            e.preventDefault();
                        });
                    $('body')
                        .append($zhezhao)
                        .delay(300)
                        .remove('#videoPK_weixin_zhezhao');
                } else {
                    $('.videoPK_share_pop').show();
                }
                e.preventDefault();
            });
    },
    // 台阶动画 
    jumpFloor:function(level) {
        var levelText = "",
            levelTitle,
            $person = $(".person"),
            $clickShare = $(".clickShare"),
            $master = $(".master");
        if (isNaN(level)) {
            return NaN;
        }
        if($person.length<=0 || $master.length<=0 ){return}
        $person.addClass("jumpFloor" + level);
        $master.removeClass("masterShow");
        $(".floorItem" + level).addClass("on");
        if (level == 5) {
            $(".master").hide();
            var master = $person.find("img").attr('src').replace('normal', 'master');
            $person.find("img").attr("src", master);
            $person.css({"marginLeft":"-1.9rem","marginBottom":"0.7667rem"});
        } else {
            $(".person").on("animationend webkitAnimationEnd",
                function() {
                    $master.addClass("masterShow");
                });
        }
    },
    init: function() {
        this.isLogin();
        this.readInfoRender();
        this.addShare();
    },
    // 判断是否空对象
    isEmptyObject:function (obj){
    for(var n in obj){return false}
    return true;
    }
};
$(function() {
    var swiperIndex = localStorage.getItem('swiperIndex') || 0;
    var dataCubeNew = new Datacube(swiperIndex);
    dataCubeNew.init();

    //清除微信分享后,初始index的设置
    if (swiperIndex !== 0) localStorage.removeItem('swiperIndex');
    localStorage.setItem("swiperLength", dataCubeNew.swiper.slides.length);
});

/**
  * @component-name: 数据魔方
  * @desc:唯医两周年年会活动
  * @example:
 *  var dataCubeNew = new Datacube(swiperIndex);
  *   参数说明
  *   swiperIndex:初始化时显示滑动页面索引.(当前主要用于判断微信分享后)
  */