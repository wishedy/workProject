/**
 * 功能描述：
 * 使用方法:
 * 注意事件：
 * 引入来源：  作用：
 *
 * Created by LiuYuTao on 2015/4/20.
 */
 module.indexBanner = function(Obj){
     var defaults = {

     };
     var options = $.extend(defaults,Obj);
 	var controller = {

 	      config : {},


 	      path : {

 	      },
 	      template : {

 	      },
          timer:null,
 	      init : function(Obj){
              var t = this;

              var num=0;
              //幻灯片
              function banner(num){
                  $(".flex-control-nav li").removeClass("active");
                  $(".flex-control-nav li").eq(num).addClass("active");
                  $(".item1").hide().css({opacity:0});
                  $(".item1").eq(num).show().animate({opacity:0.999},1500);
              }
              //$.each($(".flex-control-nav a"),function(i,val){
              //    $(val).bind("click",function(){
              //        num=i;
              //        banner(num);
              //    });
              //});
              $(".flex-control-nav").on('click','li',function(){
                 num = $(this).index();
                  banner(num);
              });
              //自动播放
              function autoPlay(){
                  t.timer=setInterval(function(){
                      num<$(".item1").length-1?num++:num=0;
                      banner(num);
                  },5000);
              }
              //autoPlay();

              $(".prev,.next").hide();
              $(".index_banner").bind("mouseover",function(){
                  clearInterval(t.timer);
                  $(".prev,.next").show();
              }).bind("mouseout",function(){
                  autoPlay();
                  $(".prev,.next").hide();
              });

              //左箭头
              $(".prev").bind("click",function(){
                  num<=0?num=$(".item1").length-1:num--;
                  banner(num);
              });
              /*$(".prev img").bind("mouseover",function(){ 
                  $(this).attr("src","//modules.allinmd.cn/video_apply/btn-prev-cur.png");
              }).bind("mouseout",function(){
                  $(this).attr("src","//modules.allinmd.cn/video_apply/btn-prev.png");
              });*/
              //右箭头
              $(".next").bind("click",function(){
                  num<$(".item1").length-1?num++:num=0;
                  banner(num);
              });
             /* $(".next img").bind("mouseover",function(){
                  $(this).attr("src","//modules.allinmd.cn/video_apply/btn-next-cur.png");
              }).bind("mouseout",function(){
                  $(this).attr("src","//modules.allinmd.cn/video_apply/btn-next.png");
              });*/

          }


 	};

 	controller.init(Obj);

 };