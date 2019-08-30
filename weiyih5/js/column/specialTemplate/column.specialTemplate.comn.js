/**
 * 功能描述：
 * 使用方法:
 * 注意事件：
 * 引入来源：
 *     作用：
 *
 * Created by JuKun on 2016/11/16.
 */
$(function(){
    setTimeout(function(){
        g_sps&&g_sps.createBrowse({pageId:470})
    }, 2000);
    // $('.spTemp_total_down').html(comm.actSkeleton());//增加灰度骨架屏样式
   var specialTemplate={
       init:function(){
           var t=this;
           t.navAdap();
           t.tabClick();
           t.navFixed();
           t.snsShare();
           t.buildArguments();
           if($(".spTemp_total_nav_list li").length == 1){$(".spTemp_total_nav").hide();}
           setTimeout(function(){
               t.wakeUpApp();
           },1000);
       },
       wakeUpApp:function(){
         if(!comm.isApp()){
             var amChannel = comm.getpara()._amChannel;
             var refId = $('#themeId').val();
             var linkUrl = window.location.href.replace("https:","");
             //3.10需求，整站添加顶部唤醒app的按钮，20190241101，张恒
             var iosParam = "scene=11&type=53&linkUrl="+encodeURIComponent(linkUrl)+"&linkName="+document.title+"";
             var androidParam = "{scene:3,type:53,linkUrl:"+linkUrl+",linkName:"+document.title+"";
             var callAppOptions = {
                 el: ".solidBtn",
                 ios: "allinmdios://app.allinmd.cn/applinks.html?"+iosParam,
                 ios9: "http://app.allinmd.cn/applinks.html?"+iosParam,
                 android: "allin://com.allin.social:75235?data="+androidParam,
                 runAtOnce: false
             };
             $(".spTemp_total_up").css({"position":"relative"});
             comm.appWakeUp("figure", callAppOptions);//唤醒app弹层
         }
       },
       //导航自适应
       navAdap:function (){
           var t=this;
           var navL = 0;
           var navH = $(".spTemp_total_nav").height();
           var marginNum = 0;
           if($('html').attr('data-dpr')=='1' && navH < 80 || $('html').attr('data-dpr')=='2' && navH < 160 || $('html').attr('data-dpr')=='3' && navH < 240){
               $(".spTemp_total_nav_list li").each(function(i,em){
                   navL += $(".spTemp_total_nav_list li").eq(i).width();
                   return navL;
               });
               if($('html').attr('data-dpr')=='1'){
                   marginNum = ($('.spTemp_total_nav_list').width()-navL)/($(".spTemp_total_nav_list li").length * 1);
               }else if($('html').attr('data-dpr')=='2'){
                   marginNum = ($('.spTemp_total_nav_list').width()-navL)/($(".spTemp_total_nav_list li").length * 2.1);
               }else if($('html').attr('data-dpr')=='3'){
                   marginNum = ($('.spTemp_total_nav_list').width()-navL)/($(".spTemp_total_nav_list li").length * 3.5);
               }
               if($('html').attr('data-dpr') == '1' && navH < 40 || $('html').attr('data-dpr') == '2' && navH < 80 || $('html').attr('data-dpr') == '3' && navH < 120){
                   $(".spTemp_total_nav_list li").css({
                       'padding':'0 '+ (marginNum-6)/75 + 'rem'
                   });
               }else{
                   $(".spTemp_total_nav_list li").css({
                       'padding': '0 ' + 30 / 75 + 'rem'
                   });
               }
           }else{
               $(".spTemp_total_nav_list li").css({
                   'padding':'0 '+ 30/75 + 'rem'
               });
               //更多导航
               $('.spTemp_nav_more').show();
               $('.spTemp_total_nav_list').css({
                   overflow:'hidden',
                   height: 150/75 + 'rem'
               });
               if (comm.getparaNew().navText > 6) {
                   if ($('.spTemp_nav_more').hasClass('spTemp_nav_more_spread')) {
                       $('.spTemp_nav_more').removeClass('spTemp_nav_more_spread').addClass('spTemp_nav_more_pack');
                       $('.spTemp_total_nav_list').css({
                           overflow: 'visible',
                           height: 'auto'
                       });
                       if($(".spTemp_total_nav_list li").length!=1){
                           $(".ev-placeholder").css("height",$(".spTemp_total_nav").outerHeight());
                       }
                   } else {
                       $('.spTemp_nav_more').removeClass('spTemp_nav_more_pack').addClass('spTemp_nav_more_spread');
                       $('.spTemp_total_nav_list').css({
                           overflow: 'hidden',
                           height: 150 / 75 + 'rem'
                       });
                       if($(".spTemp_total_nav_list li").length!=1) {
                           $(".ev-placeholder").css("height", $(".spTemp_total_nav").outerHeight());
                       }
                   }
               }
               $('.spTemp_nav_more').off('click').on('click',function(){
                   if($(this).hasClass('spTemp_nav_more_spread')){
                       $(this).removeClass('spTemp_nav_more_spread').addClass('spTemp_nav_more_pack');
                       $('.spTemp_total_nav_list').css({
                           overflow:'visible',
                           height:'auto'
                       });
                       if($(".spTemp_total_nav_list li").length!=1) {
                           $(".ev-placeholder").css("height", $(".spTemp_total_nav").outerHeight());
                       }
                   }else{
                       $(this).removeClass('spTemp_nav_more_pack').addClass('spTemp_nav_more_spread');
                       $('.spTemp_total_nav_list').css({
                           overflow:'hidden',
                           height:150/75 + 'rem'
                       });
                       if($(".spTemp_total_nav_list li").length!=1) {
                           $(".ev-placeholder").css("height", $(".spTemp_total_nav").outerHeight());
                       }
                   }
               })
           }
           t.navFixed();
       },
       //导航固定
       navFixed:function(){
           $(".spTemp_total_nav").css({
               "position":"relative"
           });
           //无内容时页脚居于底部
           if($(".spTemp_total_nav_list li").length!=1) {
               $(".ev-placeholder").css("height", $(".spTemp_total_nav").outerHeight());
           }
           $(window).bind("scroll",function(){//浏览器滚动判断定位
               if($(window).scrollTop()>$(".spTemp_total_banner ").height()){//滚动过导航位置
                   $(".spTemp_total_nav").css({
                       "position":"fixed",
                       "top":"0",
                       "z-index":5
                   });
               }else{//恢复原来导航位置
                   $(".spTemp_total_nav").css({
                       "position":"relative"
                   });
               }
           });
       },
       firstLoad:function(){
         var t=this;
         var homePage="",
             homeType="",
             themeMenuId="",
             layoutId="";
         var el=$(".spTemp_total_nav_list li:eq(0)");
         homePage=$(el).children("span").data("href")?$(el).children("span").data("href").replace("https:",""):"";
         homeType=$(el).children("span").data("type");
         themeMenuId=$(el).children("span").data("thememenuid");
         layoutId=$(el).children("span").data("layoutid");
         t.judgeUtlType({urlType:homeType,urlLink:homePage,themeMenuId:themeMenuId,layoutId:layoutId});
     },
       tabClick:function(){
           var t=this;
           $(".spTemp_total_nav_list li span").on("click",function(){
               //每次点击获取到当前目标的一些自定义属性存起来用
               $('#shareLoc').val($(this).data('navtext'));
               $(this).addClass("textColorYesOne").parent().siblings().children("span").removeClass("textColorYesOne");
               if($(this).parent().siblings().hasClass("nav_cut_hasTwo_down")){
                   $(this).parent().siblings().children(".spTemp_total_nav_lists_two").hide().parent().removeClass("nav_cut_hasTwo_down").addClass("nav_cut_hasTwo_up");
               }
               if($(this).parent().hasClass("nav_cut_hasTwo_up")){
                   $(this).siblings(".spTemp_total_nav_lists_two").show().parent().removeClass("nav_cut_hasTwo_up").addClass("nav_cut_hasTwo_down");
                   if($('.spTemp_nav_more').hasClass('spTemp_nav_more_spread')){
                       $('.spTemp_nav_more').removeClass('spTemp_nav_more_spread').addClass('spTemp_nav_more_pack');
                       $('.spTemp_total_nav_list').css({
                           overflow:'visible',
                           height:'auto'
                       });
                   }
               }else if($(this).parent().hasClass("nav_cut_hasTwo_down")){
                   $(this).siblings(".spTemp_total_nav_lists_two").hide().parent().removeClass("nav_cut_hasTwo_down").addClass("nav_cut_hasTwo_up");
                   if($('.spTemp_nav_more').hasClass('spTemp_nav_more_spread')){
                       $('.spTemp_nav_more').removeClass('spTemp_nav_more_spread').addClass('spTemp_nav_more_pack');
                       $('.spTemp_total_nav_list').css({
                           overflow:'visible',
                           height:'auto'
                       });
                   }
               }else{
                   $('.spTemp_total_down').html(comm.actSkeleton());//增加灰度骨架屏样式
                   $(".spTemp_total_nav_lists_two").hide().parent().removeClass("nav_cut_hasTwo_down").addClass("nav_cut_hasTwo_up");
                   var urlLink=$(this).data("href"), //一级导航url
                       urlType=$(this).data("type"),
                       themeMenuId=$(this).data("thememenuid"),
                       layoutId=$(this).data("layoutid");
                   t.judgeUtlType({
                       urlType:urlType,
                       urlLink:urlLink,
                       themeMenuId:themeMenuId,
                       layoutId:layoutId
                   })
                   if(document.getElementsByTagName("gs:video-vod")[0]){
                       GS.loadTag('video-vod', document.getElementsByTagName("gs:video-vod")[0]);
                   }else if(document.getElementsByTagName("gs:video-live")[0]){
                       GS.loadTag('video-live', document.getElementsByTagName("gs:video-live")[0]);
                   }
               }
               t.navFixed();
           });
           $('.spTemp_total_nav_lists_two dl dd').on("click",function(){
               $('.spTemp_total_down').html(comm.actSkeleton());//增加灰度骨架屏样式
               //每次点击获取到当前目标的一些自定义属性存起来用
               $('#shareLoc').val($(this).data('navtext'));
               //$(this).parents('.spTemp_total_nav_lists_two').siblings('span').html($(this).text());
               $(this).parents('.spTemp_total_nav_lists_two').siblings('span').attr('data-navtext',$(this).data('navtext'));
               $(this).parents('.nav_cut_hasTwo').children("span").addClass("textColorYesOne").parent().siblings().children("span").removeClass("textColorYesOne");
               $(this).parent().parent().hide().closest(".nav_cut_hasTwo_down").removeClass("nav_cut_hasTwo_down").addClass("nav_cut_hasTwo_up");
               $(this).addClass("textColorYesTwo").siblings().removeClass("textColorYesTwo");
               var urlLink=$(this).data("href"); //二级导航url
               var urlType=$(this).data("type"),
                   themeMenuId=$(this).data("thememenuid"),
                   layoutId=$(this).data("layoutid");
               t.judgeUtlType({
                   urlType:urlType,
                   urlLink:urlLink,
                   themeMenuId:themeMenuId,
                   layoutId:layoutId
               });
               t.navFixed();
           });
           $('.spTemp_total_nav_lists_two dl dd').hover(function(){
               $(this).removeClass("textColorNoTwo").addClass("textColorYesTwo");
           },function(){
               $(this).removeClass("textColorYesTwo").addClass("textColorNoTwo");
           })
       },
       judgeUtlType:function(uv){
           var t=this;
           switch (uv.urlType){
               case 1:   //站内
                   if(uv.urlLink.length>0){
                       t.singlePageToLoad(uv);
                   }
                   break;
           }
       },
       singlePageToLoad:function(uv){
           var t=this;
           $.ajax({
               url:uv.urlLink,
               dataType:'html',
               type:'get',
               async:false,
               success:function(file){
                   $('.spTemp_total_down').html(file);
                   t.dataLoad(uv);
               },
               error:function(){

               }
           });
       },
       dataLoad:function(uv){
           var t=this;
           var param={
               themeMenuId:uv.themeMenuId,
               layoutId:uv.layoutId,
               pageIndex:1,
               pageSize:9999999,
               solrScene:10,
               sortType:2,
               customerId:localStorage.getItem("userId")
           };
           var resTemplate=commTemplateM.ajax.sync(param);
           if (!(resTemplate==null)&&resTemplate.bo){
               spTemp_list.one.spTemp_listLoad({          //资源
                   resTemplate:resTemplate   //返回数据
               });
               questionnaire.one.question_listLoad({
                   resTemplate:resTemplate   //返回数据
               });
               //H5去认证按钮先隐藏 TODO:2017.12.26 add by lichunhui
               $(".ev-authThemeBtn").hide();
               $(document).off("click").on("click",".ev-authThemeBtn",function(){
                   var state = TempCache.getItem("auth")?JSON.parse(TempCache.getItem("auth")).state:0;
                   if(state==0){
                       href="/pages/passport/auth/auth.html";
                   }else{
                     href="/pages/passport/auth/authInfo.html";
                   }
                   g_sps.jump(null,href);
               })
           }
       },
       //微信/空间/微博分享功能
       snsShare: function() {
           var themeId = $('#themeId').val(),// "1480647316221";
                shareTitle = "",
                shareUrl = "",
                shareContent = ""
           $.ajax({
               url: "/mcall/col/theme/getById/",
               data: { themeId: themeId},
               dataType: 'json',
               async: false,
               success: function(data) {
                   if (data && data.responseObject) {
                       shareTitle = data.responseObject.shareTitle?data.responseObject.shareTitle:document.title;
                       shareUrl = data.responseObject.sharePicUrl;
                       shareContent = data.responseObject.shareContent?data.responseObject.shareContent:"汇集海量手术视频、医学文献、病例讨论、会议回放资源。医生专业互动社区。";
                   }
               }
           });
           shareAll({
               title: shareTitle, //默认标题
               url: "https://" + location.hostname + location.pathname + "?navText=" +$('#shareLoc').val(),
               pic: shareUrl,
               sinaTitle:shareTitle+"--"+shareContent+"  点击查看",
               summary: shareContent, //
               desc: shareContent //微信描述
           }, false, $(".Ev-ShareBtn"));
       },
       //定位函数
       buildArguments: function(obj) {
           var t = this;
           var params = comm.getparaNew();
           //if(comm.getparaNew() == false || comm.getparaNew().navText == "") {
           //    t.firstLoad();
           //    return;
           //}
           if(comm.getparaNew().navText){
               if($('.spTemp_total_nav_list li span[data-navText=' + params.navText + ']').length>0 && $('.spTemp_total_nav_lists_two dl dd[data-navText=' + params.navText + ']').length<=0){
                   $('.spTemp_total_nav_list li span[data-navText=' + params.navText + ']').trigger("click");
               }
               if($('.spTemp_total_nav_lists_two dl dd[data-navText=' + params.navText + ']').length>0){
                   $('.spTemp_total_nav_lists_two dl dd[data-navText=' + params.navText + ']').trigger("click");
                   $('.spTemp_total_nav_list li span[data-navText=' + params.navText + ']').addClass("textColorYesOne").parent().siblings().children("span").removeClass("textColorYesOne");
               }
           }else{
               t.firstLoad();
           }

       },
        /**
         * 将参数 生成锚点链接 添加到链接后面
         * @param obj   参数对象
         */
        buildAnchor:function(obj) {
            if (obj && obj != null && !$.isEmptyObject(obj)) {
                var a = window.location.pathname;
                if (a.indexOf("?") < 0) {
                    a += "?";
                }
                for (var key in obj) {
                    a += "" + key + "=" + obj[key];
                }
                //window.location.href = a;
                window.history.pushState(null,null,a)
            } else {
                return;
            }
        }
   };
    specialTemplate.init();
});




var commTemplateM={};
commTemplateM.ajax = {
    sync : function(param){ //同步获取数据
        var dataJson = {};
        var params={paramJson:$.toJSON(param)};
        comm.loading.show();
        $.ajax({
            url : "/mcall/col/menu/layout/module/getResourceMapList/",
            type : "POST",
            data :  params,
            async : false,
            time : 5000,
            success : function(data){
                comm.loading.hide();
                dataJson = data;
            },
            error : function(){

            }
        });
        return dataJson;
    },
    async : function(url,params,callback){ // 异步获取数据
        comm.loading.show();
        $.ajax({
            url : url,
            type : "POST",
            dataType : "json",
            data : params,
            success : function(data){
                comm.loading.hide();
                callback(data);
            },
            error : function(){

            }
        });
    }
};
