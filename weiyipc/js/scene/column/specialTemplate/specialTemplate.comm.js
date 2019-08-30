/**
 * 功能描述：
 * 使用方法:
 * 注意事件：
 * 引入来源：
 *     作用：
 *
 * Created by JuKun on 2016/11/3.
 */
$(function(){
    setTimeout(function(){
        g_sps&&g_sps.createBrowse({pageId:468})
    }, 2000);
   var specialTemplate={
       config:{
       	  
       },
       init:function(){
           var t=this;
           t.tabClick();
           t.navMore();
           t.snsShare();
           t.buildArguments();
           if($(".spTemp_total_nav_lists li").length == 1){$(".spTemp_total_nav").hide();}
       },
       loadFirst:function(){
           var t=this;
           var homePage="",
               homeType="",
               themeMenuId="",
               layoutId="";

           var el=$(".spTemp_total_nav_lists li:eq(0)");
           if($(el).hasClass("nav_cut_hasTwo")){
               var els=$(".spTemp_total_nav_lists li dd")[0];
               homePage=$(els).data("href").replace("https:","");
               homeType=$(els).data("type");
               themeMenuId=$(els).data("thememenuid");
               layoutId=$(els).data("layoutid");

           }else{
               homePage=$(el).children("span").data("href").replace("https:","");
               homeType=$(el).children("span").data("type");
               themeMenuId=$(el).children("span").data("thememenuid");
               layoutId=$(el).children("span").data("layoutid");
           }
           t.judgeUtlType({urlType:homeType,urlLink:homePage,themeMenuId:themeMenuId,layoutId:layoutId});
       },
       navMore:function(){
           var navH = $('.spTemp_total_nav_lists').height();
           if(navH>132){
               $('.spTemp_nav_more').show();
               $('.spTemp_total_nav_lists').css({
                   overflow:'hidden',
                   height:'132px',
                   paddingRight:'66px'
               });
           }
           $('.spTemp_nav_more').on('click',function(){
               if($(this).hasClass('spTemp_nav_more_spread')){
                   $(this).removeClass('spTemp_nav_more_spread').addClass('spTemp_nav_more_pack').text('收起');
                   $('.spTemp_total_nav_lists').css({
                       overflow:'visible',
                       height:'auto'
                   });
               }else{
                   $(this).removeClass('spTemp_nav_more_pack').addClass('spTemp_nav_more_spread').text('更多');
                   $('.spTemp_total_nav_lists').css({
                       overflow:'hidden',
                       height:'132px'
                   });
               }
           })
           var Hei = $(".spTemp_total_nav").offset().top;//当行
           $(window).on("scroll",function(){
               if($(".spTemp_total_nav_lists").find("li").length>1){
                   if(Hei-$(window).scrollTop()<=0){
                       $(".spTemp_total_nav").addClass("toTop");
                       $(".spTemp_total_down").addClass("marginTop");
                   }else{
                       $(".spTemp_total_nav").removeClass("toTop");
                       $(".spTemp_total_down").removeClass("marginTop");
                   }
               }
           });
       },
       tabClick:function(){
           var t=this;
           $(".spTemp_total_nav_lists li span").on("click",function(){
               //每次点击获取到当前目标的一些自定义属性存起来用
               $('#shareLoc').val("http://" + location.hostname + location.pathname + "?navText=" +$(this).data('navtext'));
               $(this).addClass("textColorYesOne bgColorYesOne nav_cut").parent().siblings().children("span").removeClass("textColorYesOne bgColorYesOne");
               if($(this).parent().siblings().hasClass("nav_cut_hasTwo_down")){
                   $(this).parent().siblings().children(".spTemp_total_nav_lists_two").hide().parent().removeClass("nav_cut_hasTwo_down").addClass("nav_cut_hasTwo_up");
               }
               if($(this).parent().hasClass("nav_cut_hasTwo_up")){
                   $(this).siblings(".spTemp_total_nav_lists_two").show().parent().removeClass("nav_cut_hasTwo_up").addClass("nav_cut_hasTwo_down");
                   if($('.spTemp_nav_more').hasClass('spTemp_nav_more_spread')){
                       $('.spTemp_nav_more').removeClass('spTemp_nav_more_spread').addClass('spTemp_nav_more_pack');
                       $('.spTemp_total_nav_lists').css({
                           overflow:'visible',
                           height:'auto'
                       });
                   }
               }else if($(this).parent().hasClass("nav_cut_hasTwo_down")){
                   $(this).siblings(".spTemp_total_nav_lists_two").hide().parent().removeClass("nav_cut_hasTwo_down").addClass("nav_cut_hasTwo_up");
                   if($('.spTemp_nav_more').hasClass('spTemp_nav_more_spread')){
                       $('.spTemp_nav_more').removeClass('spTemp_nav_more_spread').addClass('spTemp_nav_more_pack');
                       $('.spTemp_total_nav_lists').css({
                           overflow:'visible',
                           height:'auto'
                       });
                   }
               }else{
                       $(".spTemp_total_nav_lists_two").hide().parent().removeClass("nav_cut_hasTwo_down").addClass("nav_cut_hasTwo_up");
                       var urlLink=$(this).data("href").replace("https:",""), //一级导航url
                           urlType=$(this).data("type"),
                           themeMenuId=$(this).data("thememenuid"),
                           layoutId=$(this).data("layoutid");

                       t.judgeUtlType({
                           urlType:urlType,
                           urlLink:urlLink,
                           themeMenuId:themeMenuId,
                           layoutId:layoutId
                       })
                   }
           });
           $('.spTemp_total_nav_lists_two dl dd').on("click",function(){
               //每次点击获取到当前目标的一些自定义属性存起来用
               $('#shareLoc').val("http://" + location.hostname + location.pathname + "?navText=" +$(this).data('navtext'));
               //$(this).parents('.spTemp_total_nav_lists_two').siblings('span').html($(this).text());
               $(this).parents('.spTemp_total_nav_lists_two').siblings('span').attr('data-navtext',$(this).data('navtext'))
               $(this).parents('.nav_cut_hasTwo').children("span").addClass("textColorYesOne").parent().siblings().children("span").removeClass("textColorYesOne");
               $(this).parent().parent().hide().closest(".nav_cut_hasTwo_down").removeClass("nav_cut_hasTwo_down").addClass("nav_cut_hasTwo_up");
               $(this).addClass("textColorYesTwo").siblings().removeClass("textColorYesTwo");
               var urlLink=$(this).data("href").replace("https:",""); //二级导航url
               var urlType=$(this).data("type"),
                   themeMenuId=$(this).data("thememenuid"),
                   layoutId=$(this).data("layoutid");
               t.judgeUtlType({
                   urlType:urlType,
                   urlLink:urlLink,
                   themeMenuId:themeMenuId,
                   layoutId:layoutId
               })
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
               //case 2:
               //    var iframeResult= t.createIframe(uv);
               //    if(iframeResult.length>0){
               //        $('.spTemp_total_down').html(iframeResult);
               //    }
           }
       },
       singlePageToLoad:function(Uv){
           var t=this;
           comm.LightBox.showloading();
           $.ajax({
               url:Uv.urlLink,
               dataType:'html',
               type:'get',
               async:false,
               success:function(file){
                   comm.LightBox.hideloading();
                   $('.spTemp_total_down').html(file);
                   t.dataLoad(Uv);
               },
               error:function(){

               }
           });
       },
       //createIframe:function(ev){
       //    var iframeHtml='<iframe name="left" id="rightMain" src="'+ev+'" frameborder="false" scrolling="no" style="border:none;" width="100%" height="470" allowtransparency="true"></iframe>';
       //    return iframeHtml;
       //},
       dataLoad:function(Uv){
           // comm.Log.createBrowse({href: location.href, id: 197, name: '新版活动页面'});

           var param={
               themeMenuId:Uv.themeMenuId,
               layoutId:Uv.layoutId,
               pageIndex:1,
               pageSize:9999999,
               solrScene:10,
               sortType:2,
               customerId:$("#sesCustomerId").val()
           };
           var resTemplate=commTemplate.ajax.sync(param);
               spTemp_list.one.spTemp_listLoad({
                   resTemplate:resTemplate   //返回数据
               });
               testPerson.one.questionLoad({
                   resTemplate:resTemplate   //返回数据
               })
       },
       //微信/空间/微博分享功能
       snsShare: function() {
           var themeId = $('#themeId').val(),// "1480647316221";
               t = this;
           module.share({
               container:$(".ev-shareContainer"),//存放分享组件的父级
               type:2,//默认为1  1：社交分享  2：页面左下角全站分享,3.终端页面的固定分享,4.终端评论区分享，消息的评论我的，只分享到唯医朋友圈
               url:window.location.href,//分享链接， 默认取当前页链接
               hiddenEl:$('#shareLoc'),
               h5Url:'https://m.allinmd.cn/html/m/theme/'+themeId+'/theme_index.html',//微信分享生成二维码的链接
               shareTrend:0,//0:不需要站内动态分享  1：需要站内动态分享
               trendUrl:'',//分享到站内动态的接口
               data:{},//分享到站内动态的接口参数
               callback:function(){},//分享到站内动态成功后回调函数
               shareQQSuc:function(){},//分享qq成功
               shareQzoneSuc:function(){},//分享qzone成功
               shareSinaSuc:function(){},//分享sina成功
               triggerRequest:function(content){
                   $.ajax({
                       url: "/call/col/theme/getById/",
                       data: { themeId: themeId},
                       dataType: 'json',
                       async: false,
                       success: function(data) {
                           if (data && data.responseObject) {
                               content.sinaTitle = data.responseObject.shareTitle+"--"+(data.responseObject.shareContent?data.responseObject.shareContent:"汇集海量手术视频、医学文献、病例讨论、会议回放资源。医生专业互动社区。")+"  点击查看";
                               content.qqTitle = data.responseObject.shareTitle;
                               content.qqZoneTitle = data.responseObject.shareTitle;
                               content.pic = data.responseObject.sharePicUrl;
                               content.qqSummary = data.responseObject.shareContent;
                               content.qqZoneSummary = data.responseObject.shareContent;
                           }
                       }
                   });
               }
           });
       },
       //定位函数
       buildArguments: function(obj) {
           var t = this;
           var a = location.search,
               params = comm.getpara();
           if( $.isEmptyObject(comm.getpara()) || comm.getpara().navText == "") {
               t.loadFirst();
               return;
           }
           if($('.spTemp_total_nav_lists li span[data-navText=' + params.navText + ']').length>0 && $('.spTemp_total_nav_lists_two dl dd[data-navText=' + params.navText + ']').length <= 0){
               $('.spTemp_total_nav_lists li span[data-navText=' + params.navText + ']').trigger("click");
           }else{
               if($('.spTemp_total_nav_lists_two dl dd[data-navText=' + params.navText + ']').length>0){
                   $('.spTemp_total_nav_lists_two dl dd[data-navText=' + params.navText + ']').trigger("click");
                   $('.spTemp_total_nav_lists li span[data-navText=' + params.navText + ']').addClass("textColorYesOne bgColorYesOne nav_cut").parent().siblings().children("span").removeClass("textColorYesOne bgColorYesOne");
               }else{
                   t.loadFirst();
               }
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
               window.history.pushState(null,null,a)
           } else {
               return;
           }
       }
   };
    specialTemplate.init();
});
/**
*专题活动公共数据请求  commTemplate.ajax.sync();
 */
var commTemplate={};
commTemplate.ajax = {
    sync : function(tparam){ //同步获取数据
        var dataJson = {};
        var params={paramJson:$.toJSON(tparam)};
        comm.LightBox.showloading();
        $.ajax({
            url : "/call/col/menu/layout/module/getResourceMapList/",
            type : "POST",
            data :  params,
            async : false,
            time : 5000,
            success : function(data){
                comm.LightBox.hideloading();
                dataJson = data;
            },
            error : function(){
                comm.LightBox.hideloading();
            }
        });
        return dataJson;
    },
    syncpage : function(tparam){ //同步获取分页数据
        var dataJson = {};
          var param={
               columnId:12,
               page:1,
               maxResult:2
         };
        var params={paramJson:$.toJSON(param)};
        comm.LightBox.showloading();
        $.ajax({
            url : "/call/col/column/recommend/getResourceMapList/",
            type : "POST",
            data :  params,
            async : false,
            time : 5000,
            success : function(data){
                comm.LightBox.hideloading();
                dataJson = data;
            },
            error : function(){
                comm.LightBox.hideloading();
            }
        });
        return dataJson;
    },
    async : function(params,callback){ // 异步获取数据
        comm.LightBox.showloading();
        $.ajax({
            url : "/call/col/menu/layout/module/getResourceMapList/",
            type : "POST",
            dataType : "json",
            data : params,
            success : function(data){
                comm.LightBox.hideloading();
                callback(data);
            },
            error : function(){
                comm.LightBox.hideloading();
            }
        });
    },
    asyncfff : function(tparam){ //同步提交问卷答案数据
        var recommendListMap=[];
        var list1={
            questionId:1479799702296,
            questionType:1,
            optionMark:'A'
        };
        var list2={
            questionId:1479892839884,
            questionType:2,
            optionMark:'A,B,C'
        };
        var list3={
            questionId:1479892910120,
            questionType:3,
            answerContent:'就是打开了快来升级的方式了深刻的'
        };
        recommendListMap.push(list1);
        recommendListMap.push(list2);
        recommendListMap.push(list3);
        var reData={
            customerId:"1445226185213",
            questionnaireId:"1479721606667",
            recommendListMap:JSON.stringify(recommendListMap)
        };
        var params={paramJson:$.toJSON(reData)};
        comm.LightBox.showloading();
        $.ajax({
            url : "/call/col/question/answer/create/",
            type : "POST",
            data :  params,
            async : false,
            time : 5000,
            success : function(data){
                comm.LightBox.hideloading();
            },
            error : function(){
                comm.LightBox.hideloading();
            }
        });
    }
};