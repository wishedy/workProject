$(function () {
    var allinmdNew={
        dataInit:{
            load_timer:null,
            prg:0,
            thirdIndex:null,
            indexNum:0
        },
        progress:function (dist, delay, callback) {
            var t=this;
            window.clearInterval(t.dataInit.load_timer);
            t.dataInit.load_timer = window.setInterval(function() {
                if(t.dataInit.prg >= dist) {
                    window.clearInterval(t.dataInit.load_timer);
                    t.dataInit.prg = dist;
                    callback && callback();
                } else {
                    t.dataInit.prg++;
                }
                $(".loading-tip").html(t.dataInit.prg+"%");
            }, delay);
        },
        swiperInit:function () {
            var t=this;
            var mySwiper = new Swiper(".swiper-container", {
                direction: 'vertical',
                speed: 500,
                initialSlide: 0,
                mousewheelControl: true,
                followFinger: false,
                observer: true, //修改swiper自己或子元素时，自动初始化swiper
                observeParents: true, //修改swiper的父元素时，自动初始化swiper
                onInit: function(swiper) { //初始化后执行
                    swiperAnimateCache(swiper); //隐藏动画元素
                    setTimeout(function () {
                        swiperAnimate(swiper); //初始化完成开始动画
                    },2000)
                    $('.page-tip').text("1/"+$('.swiper-slide').length);
                    $('.ev-progress').width(1/$('.swiper-slide').length*100+'%');
                },
                onTransitionEnd: function(swiper) { //slider切换结束时执行。
                    $('.page-tip').text((swiper.activeIndex+1)+"/"+$('.swiper-slide').length);
                    $('.ev-progress').width((swiper.activeIndex+1)/$('.swiper-slide').length*100+'%');
                    swiperAnimate(swiper); //每个slide切换结束时也运行当前slide动画
                    clearInterval(t.dataInit.thirdIndex);
                    if(swiper.activeIndex==2){
                        // rubber
                        t.dataInit.thirdIndex=setInterval(function () {
                            if(t.dataInit.indexNum==3){
                                t.dataInit.indexNum=0;
                            }
                            $(".slide3 .slide1_w2 img").eq( t.dataInit.indexNum).addClass("show").siblings().removeClass("show");
                            t.dataInit.indexNum++;
                        },100);
                        setTimeout(function () {
                            $('.slide3 .slide1_w3,.slide3 .slide1_w4,.slide3 .slide1_w8 .slide1_w8_3,.slide3 .slide1_w8 .slide1_w8_2,.slide3 .slide1_w8 .slide1_w8_1').addClass('puffOut')
                        },2000)
                       }else {
                        clearInterval(t.dataInit.thirdIndex);
                        t.dataInit.indexNum=0;
                        $('.slide3 .slide1_w3,.slide3 .slide1_w4,.slide3 .slide1_w8 .slide1_w8_3,.slide3 .slide1_w8 .slide1_w8_2,.slide3 .slide1_w8 .slide1_w8_1').removeClass('puffOut');
                    }
                    if(swiper.activeIndex==6){
                        // rubber
                        setTimeout(function () {
                            $('.slide7 .slide1_w3 img').addClass('slideOn');
                        },2000)
                    }else {
                        $('.slide7 .slide1_w3 img').removeClass('slideOn');
                    }
                    if(swiper.activeIndex==7){
                        setTimeout(function () {
                            $('.slide11 .slide1_w3,.slide11 .slide1_w4').addClass('puffOut');
                        },1800)
                    }else {
                        $('.slide11 .slide1_w3,.slide11 .slide1_w4').removeClass('puffOut');
                    }
                    if(swiper.activeIndex==10){
                        // rubber
                        $('.u-arrow-bottom').hide();
                        setTimeout(function () {
                            $('.slide10 .slide1_w6').addClass('rubber');
                        },2000)
                    }else {
                        $('.slide10 .slide1_w6').removeClass('rubber');
                        $('.u-arrow-bottom').show();
                    }
                },
            })
        },
        init:function () {
            setTimeout(function () {
                $('#bgMusic')[0].play();
            },1000);
            $(".music_box").on('click',function () {
                $(this).toggleClass('m_on');
                if($(this).hasClass('m_on')){
                    $('#bgMusic')[0].play();
                }else {
                    $('#bgMusic')[0].pause();
                }
            })
            shareAll({
                wxTitle:"唯医骨科3.0全新上线",
                timeLineTitle:"邀您一起学习赢大奖！终结骨科疾病“恶势力",
                wxDesc:"邀您一起学习赢大奖！终结骨科疾病“恶势力",
                url:"https://m.allinmd.cn/pages/column/allinmdNew/index.html",
                pic:'https://m.allinmd.cn/pages/column/allinmdNew/images/wxshare.png',
                // 分享好友成功
                fnMessageSuc: function() {
                },
                // 分享朋友圈成功
                fnTimelineSuc: function() {
                }
            }, true);
        }
    };
    allinmdNew.progress(100,10,function(){
        $("#loading").fadeOut(100);
    });
    allinmdNew.swiperInit();
    allinmdNew.init();
    document.addEventListener("WeixinJSBridgeReady", function () {
        $('#bgMusic')[0].load();
        $('#bgMusic')[0].play();
        // allinmdNew.init();
    })
})