/**
 * Created by ALLIN on 2016/10/24.
 */

//滚动栏
//adverScroll:function (){
//    jQuery.fn.imageScroller = function (a) {
//        a = jQuery.extend({
//            next: "#buttonNext",
//            prev: "#buttonPrev",
//            frame: "#viewerFrame",
//            child: "a",
//            auto: true,
//            pause: 3E3,
//            move: 1E3
//        }, a || {});
//        var f = jQuery(a.next),
//            g = jQuery(a.prev),
//            b = jQuery(a.frame),
//            h = b.parent(),
//            d = a.child,
//            c = a.auto,
//            o = a.pause,
//            l = a.move,
//            m,
//            i = b.find(d).eq(0).outerWidth(true);
//        a = b.find(d).length * i;
//        h = h.width();
//        b.width(a);
//        var j = function () {
//            g.unbind("click", j);
//            c && n();
//            b.animate({left: -i}, l, "linear", function () {
//                b.find(d + ":first").appendTo(b);
//                b.css("left", 0);
//                g.bind("click", j);
//                c && k()
//            })
//        }, e = function () {
//            f.unbind("click",
//                e);
//            c && n();
//            b.find(d + ":last").prependTo(b);
//            b.css("left", -i);
//            b.animate({left: 0}, l, "linear", function () {
//                f.bind("click", e);
//                c && k()
//            })
//        }, k = function () {
//            m = window.setInterval(e, o)
//        }, n = function () {
//            window.clearInterval(m)
//        };
//        if (a > h) {
//            f.css("cursor", "pointer").click(e);
//            g.css("cursor", "pointer").click(j);
//            c && k()
//        }
//    };
//    $(function(){
//        var scroll={
//            config:{
//
//            },
//            init:function(){
//                var t = this;
//                if($('#expert_demo').length>0){
//                    t.autoPlay_expert();
//                }
//                if($('#works_demo').length>0){
//                    t.autoPlay_works();
//                }
//                if($('#zdy_demo').length>0){
//                    t.autoPlay_zdy();
//                }
//            },
//
//            //专家介绍100%
//            autoPlay_expert:function(){
//                var speed=20;
//                var d2=document.getElementById("expert_demo2");
//                var d1=document.getElementById("expert_demo1");
//                var d=document.getElementById("expert_demo");
//                //取到一个轮播容器中一个轮播项的宽度
//                var aWidth =$(d1).width() / $(d1).find('a').length;
//                function Marquee(){
//                    d2.innerHTML=d1.innerHTML;
//                    if(d2.offsetWidth-d.scrollLeft<=0){
//                        d.scrollLeft-=d1.offsetWidth;
//                    }else{
//                        d.scrollLeft++;
//                    }
//                }
//                var MyMar=setInterval(Marquee,speed);
////          d.onmouseover=function() {clearInterval(MyMar);}
////          d.onmouseout=function() {MyMar=setInterval(Marquee,speed);}
//                var slider = $('.expert_slider');
//                slider.mouseover(function () {
//                    clearInterval(MyMar);
//                })
//                slider.mouseout(function () {
//                    MyMar=setInterval(Marquee,speed);
//                })
//
//                $('.expert_slider .back_n').mouseover(function(){
//                    $(this).css('display','none').siblings('.back_m').css('display','block');
//                });
//                $('.expert_slider .back_m').mouseout(function(){
//                    $(this).css('display','none').siblings('.back_n').css('display','block');
//                });
//                $('.expert_slider .back_m').click(function () {
////				if(d2.offsetWidth-d.scrollLeft<=0){
////                  d.scrollLeft-=d1.offsetWidth;
////              }else{
//                    d.scrollLeft-=aWidth;
////              }
//                })
//                $('.expert_slider .forward_n').mouseover(function(){
//                    $(this).css('display','none').siblings('.forward_m').css('display','block');
//                });
//                $('.expert_slider .forward_m').mouseout(function(){
//                    $(this).css('display','none').siblings('.forward_n').css('display','block');
//                });
//                $('.expert_slider .forward_m').click(function () {
//                    if(d2.offsetWidth-d.scrollLeft<=0){
//                        d.scrollLeft-=d1.offsetWidth;
//                    }else{
//                        d.scrollLeft+=aWidth;
//                    }
//                })
//            },
//            //入围作品100%
//            autoPlay_works:function(){
//                var speed=20;
//                var d2=document.getElementById("works_demo2");
//                var d1=document.getElementById("works_demo1");
//                var d=document.getElementById("works_demo");
//                //取到一个轮播容器中一个轮播项的宽度
//                var aWidth =$(d1).width() / $(d1).find('a').length;
//                function Marquee(){
//                    d2.innerHTML=d1.innerHTML;
//                    if(d2.offsetWidth-d.scrollLeft<=0){
//                        d.scrollLeft-=d1.offsetWidth;
//                    }else{
//                        d.scrollLeft++;
//                    }
//                }
//                var MyMar=setInterval(Marquee,speed);
////          d.onmouseover=function() {clearInterval(MyMar);}
////          d.onmouseout=function() {MyMar=setInterval(Marquee,speed);}
//                var slider = $('.works_slider');
//                slider.mouseover(function () {
//                    clearInterval(MyMar);
//                });
//                slider.mouseout(function () {
//                    MyMar=setInterval(Marquee,speed);
//                })
//
//                $('.works_slider .back_n').mouseover(function(){
//                    $(this).css('display','none').siblings('.back_m').css('display','block');
//                });
//                $('.works_slider .back_m').mouseout(function(){
//                    $(this).css('display','none').siblings('.back_n').css('display','block');
//                });
//                //向前的点击事件
//                $('.works_slider .back_m').click(function () {
//                    d.scrollLeft-=aWidth;
//                })
//                $('.works_slider .forward_n').mouseover(function(){
//                    $(this).css('display','none').siblings('.forward_m').css('display','block');
//                });
//                $('.works_slider .forward_m').mouseout(function(){
//                    $(this).css('display','none').siblings('.forward_n').css('display','block');
//                });
//                //向后的点击事件
//                $('.works_slider .forward_m').click(function () {
//                    if(d2.offsetWidth-d.scrollLeft<=0){
//                        d.scrollLeft-=d1.offsetWidth;
//                    }else{
//                        d.scrollLeft+=aWidth;
//                    }
//                })
//            },
//            autoPlay_zdy:function(){
//                var speed=20;
//                var d2=document.getElementById("zdy_demo2");
//                var d1=document.getElementById("zdy_demo1");
//                var d=document.getElementById("zdy_demo");
//                //取到一个轮播容器中一个轮播项的宽度
//                var aWidth =$(d1).width() / $(d1).find('a').length;
//                function Marquee(){
//                    d2.innerHTML=d1.innerHTML;
//                    if(d2.offsetWidth-d.scrollLeft<=0){
//                        d.scrollLeft-=d1.offsetWidth;
//                    }else{
//                        d.scrollLeft++;
//                    }
//                }
//                var MyMar=setInterval(Marquee,speed);
////          d.onmouseover=function() {clearInterval(MyMar);}
////          d.onmouseout=function() {MyMar=setInterval(Marquee,speed);}
//                var slider = $('.zdy_demo');
//                slider.mouseover(function () {
//                    clearInterval(MyMar);
//                });
//                slider.mouseout(function () {
//                    MyMar=setInterval(Marquee,speed);
//                })
//                $('.zdy_slider .back_n').mouseover(function(){
//                    $(this).css('display','none').siblings('.back_m').css('display','block');
//                });
//                $('.zdy_slider .back_m').mouseout(function(){
//                    $(this).css('display','none').siblings('.back_n').css('display','block');
//                });
//                $('.zdy_slider .back_m').click(function () {
//                    d.scrollLeft-=aWidth;
//                })
//                $('.zdy_slider .forward_n').mouseover(function(){
//                    $(this).css('display','none').siblings('.forward_m').css('display','block');
//                });
//                $('.zdy_slider .forward_m').mouseout(function(){
//                    $(this).css('display','none').siblings('.forward_n').css('display','block');
//                });
//                $('.zdy_slider .forward_m').click(function () {
//                    if(d2.offsetWidth-d.scrollLeft<=0){
//                        d.scrollLeft-=d1.offsetWidth;
//                    }else{
//                        d.scrollLeft+=aWidth;
//                    }
//                })
//            }
//
//        }
//        scroll.init();
//    });
//}



