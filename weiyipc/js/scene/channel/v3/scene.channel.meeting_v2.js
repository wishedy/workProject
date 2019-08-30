/**
 * Created by sunhaibin on 2016/3/17.
 */
$(function(){
   var channelMeeting={
       config:{
           requestTime:1//换一批请求次数
       },
       path:{
            indexLoad:PC_CALL+'conference/index/getMapList/'
       },
       init:function(o){
           var opt={};
           opt= $.extend(opt,o);
           var t=this;
           t.loadAtReady();
           $('.seeMore').on('click',function(){
               if($(this).hasClass('seeMoreIng')){
                   return false;
               }else{
                   //$(this).addClass('seeMoreIng').css({cursor:'default',color:'#ccc'});
                   $(this).hide();
                   $('.al-loadMoreImg').show();
                   firstResult = $('#ev_meetingPastUl li').length;
                   t.loadMoreMeeting(firstResult);
               }
           });

           t.randomChange();
           //t.bannerSlide();
           t.searchMeetingNavFixed();   //搜索导航条固定
           t.searchByTag();             //搜索
           t.shareAction();             //分享
       },
       bannerSlide:function(){
           $('.meetingTopLeft').slide({
               mainCell:'#ev_meetingBannerCaro',
               effect:'leftLoop',
               autoPlay:true,
               titCell:'.metTopSpotUl li',
               titOnClassName:'activeLi',
               titCellWidth:'20'
           });
           $("#ev_meetingBannerCaro .metTopImg").on("click",function(){
               locationId=$(this).attr("index");
               //事件埋点
               comm.creatEvent({
                   async:false,
                   triggerType:"广告",
                   keyword:'广告位-轮播图(会议)-'+$(this).find("img").attr("alt"),
                   locationId:locationId,
                   actionId:14
               });
           })
       },
       searchByTag:function(){
           var t=this;
           $('.metPastNavUl').on('mouseover','li',function(){
               $(this).addClass('metNavChange').siblings('li').removeClass('metNavChange');
           }).on('click','li',function(){
               $('#ev_search_tagName').val($(this).text());
               var url='/pages/search/search.html?keyword='+$(this).text()+"&type=conference";
               //sps跳转
               g_sps.jump($(this),url);
           });
           $('.metPastNavbut').click(function(){
               //$('#search_meeting_Form').submit();
               var href='/pages/search/search.html?keyword='+$('#ev_search_tagName').val()+"&type=conference";
               g_sps.jump(null,href,true);
           });
           $('#ev_search_tagName').on('keyup',function(e){
               if($(this).val()!=""){
                   if(e.which===13){
                       var href='/pages/search/search.html?keyword='+$('#ev_search_tagName').val()+"&type=conference";
                       g_sps.jump(null,href,true);
                   }
               }
               e.preventDefault();
               return false;
           });
           //safari lineHeight 兼容
           var userA = navigator.userAgent.toLowerCase();
           if(/safari/g.test(userA)&&/version/g.test(userA)){
               $('#ev_search_tagName').css('lineHeight',0).focus(function(){
                   if($(this).val()==""||$(this).val()=='输入会议、时间、内容等关键词'){
                       $(this).val('输入会议、时间、内容等关键词');
                       setCursorPosition($('#ev_search_tagName')[0],0);
                   }
               }).keydown(function(){
                   if($(this).val()=="输入会议、时间、内容等关键词"){
                       $(this).val('');
                   }
               }).blur(function(){
                   if($(this).val()==""){
                       $(this).val('输入会议、时间、内容等关键词');

                   }
               });
           }
           //ie8 placeholder功能
           if (typeof window.addEventListener == "undefined" && typeof document.getElementsByClassName == "undefined") {

                $('#ev_search_tagName').val('输入会议、时间、内容等关键词').focus(function(){
                    if($(this).val()=="输入会议、时间、内容等关键词"){
                        setCursorPosition($('#ev_search_tagName')[0],0);
                    }
                }).keydown(function(){
                    if($(this).val()=="输入会议、时间、内容等关键词"){
                        $(this).val('');
                    }
                }).blur(function(){
                    if($(this).val()==""){
                        $(this).val('输入会议、时间、内容等关键词');

                    }
                });
           }
       },
       searchMeetingNavFixed:function(){
           //var  $mNav = $('#ev_searchNav');
           //var $nNav = $('#meetingNowNav');
           //$(window).on('scroll load',function(){
               //if($(document).scrollTop()>$('#ev_searchNav').attr('sTop')){
               //    $mNav.css({
               //        position:'fixed',
               //        background:'#fff',
               //        top:0,
               //        left:0
               //    });
               //     $nNav.css({
               //         background:'#fff'
               //     });
               //}else{
               //    $mNav.css({
               //        position:'static',
               //        background:'#fff',
               //        top:0,
               //        left:0
               //    });
               //    $nNav.css({
               //        background:'#fff'
               //    });
               //}
           //})

       },
       loadAtReady:function(){//首次加载
           var t=this;
           var recentMeeting="",metTopSpotLi="",
               latestMeeting="",latestIndex="",latestMeetingWithImg="",latestMeetingWithNoImg="",
               recomMeeting="",
               tagList="",
               prevMeeting="";
           t.ajaxFn({
               url: t.path.indexLoad,
               param:{paramJson: $.toJSON({conferenceVersion:1,visitSiteId:1,platformId:$('#sesDepartment').val()||1,sessionCustomerId:$('#sesCustomerId').val()||""})},
               async:false,
               fn:function(data){
                   if(data&&data.responseObject.responseData&&data.responseObject.responseData.data_list.length){
                       var res=data.responseObject.responseData.data_list[0];
                       var adAttAbstract ="";
                       if(res.adList&&res.adList.length){
                           for(var r= 0,rl=res.adList.length;r<rl;r++){
                               adAttAbstract=res.adList[r].adAttAbstract.length>94? ( res.adList[r].adAttAbstract.substring(0,110)+'...'):  res.adList[r].adAttAbstract;
                               recentMeeting+='<li>'+
                                                   '<div class="metTopImg" index="'+(r+1)+'">'+
                                                       '<a  class="metTop_bg" href="'+ res.adList[r].linkUrl+'"><img  src="'+  res.adList[r].adAttUrl+'" alt="'+  res.adList[r].adAttName+'"/></a>'+
                                                       '</div>'+
                                                       '<div class="metTopBot">'+
                                                       '<div class="metTopText">会议亮点</div>'+
                                                       '<div class="metBotText">'+comm.getStrLen(adAttAbstract,170) +'</div>'+
                                                   '</div>'+
                                               '</li>';
                               metTopSpotLi+='<li></li>';
                           }
                       }
                       latestIndex = res.conferenceList[0].conference[0];
                       if(latestIndex){
                           latestMeetingWithImg = '<a href="'+latestIndex.conUrl+'" class="metRightMid">'+
                               ' <div class="metRightImg"><img src="'+latestIndex.conMainPicUrl+'" alt=""/></div>'+
                               ' <div class="metRightBot">'+
                               '     <div class="metRightTextTop">'+latestIndex.conName+'</div>'+
                               ' <div class="metRightTextTBot">'+dateFormat(latestIndex.startTime,latestIndex.endTime)+'&nbsp;&nbsp;&nbsp;'+comm.getStrLen(latestIndex.country+' &sdot; '+ latestIndex.city,20)+'</div>'+
                               ' </div>'+
                               ' </a>';
                       }

                       var item;
                       if(res.conferenceList[0].conference.length){
                           for(var j=1;j<res.conferenceList[0].conference.length-1;j++){//原来显示4个，现在显示3个
                               item=res.conferenceList[0].conference[j]
                                latestMeetingWithNoImg +=' <li class="metRightLi">'+
                                                        '   <a href="'+item.conUrl+'"> ' +
                                                                '<div class="metRightLiTop"><span></span>'+(item.conName.length>14?(item.conName.substring(0,12)+'...'):item.conName)+'</div>'+
                                                        '        <div class="metRightLiBot">'+dateFormat(item.startTime,item.endTime)+'&nbsp;&nbsp;&nbsp;'+comm.getStrLen(item.country+' &sdot; '+ item.city,20)+'</div>'+
                                                            '</a>'+
                                                        '</li>';
                           }
                       }
                       latestMeeting=latestMeetingWithImg+'<ul class="metRightUl">'+latestMeetingWithNoImg+'</ul>';
                        //推荐会议
                       var reItem='';
                       for(var m= 0,ml=res.conferenceList[1].conference.length;m<ml;m++){
                           reItem = res.conferenceList[1].conference[m];
                           recomMeeting+='<li>'+
                                             ' <a href="'+ reItem.conUrl+'">'+
                                             '     <div class="recommendImg"><img src="'+ reItem.conMainPicUrl+'" alt=""/></div>'+
                                             '     <div class="recommendBot">'+
                                             '     <div class="recommentTop">'+
                                             '     <div class="recommentDate"><span class="dateImg"></span>'+(typeof reItem.startTime=="string"&&reItem.startTime.substring(0,10))+'-'+ (typeof reItem.endTime=="string"&&reItem.endTime.substring(0,10))+'</div>'+ //
                                             ' <div class="recommentText"><span class="location"></span>'+ comm.getStrLen(reItem.country+' &sdot; '+ reItem.city,20)+'</div>'+
                                             ' <div class="clear"></div>'+
                                             '     </div>'+
                                             '     <div class="recommentBotText">'+ comm.getStrLen(reItem.conIntro,110)+'</div>'+//
                                             ' <div class="clear"></div>'+
                                             '     </div>'+
                                             '     </a>'+
                                             '     </li>';
                       }
                       //标签
                       $.each(res.tagList,function(tIndex,tEle){
                           tagList+='<li>'+tEle.tagName+'</li>';
                       });
                       //过往会议
                       //var startTime,endTime;
                       $.each(res.conferenceList[2].conference,function(n,ele){
                           prevMeeting+='   <li>'+
                                        '   <a href="'+ele.conUrl+'">'+
                                        '      <div class="recommendImg">' +
                               //'<img src="//img10.allinmd.cn/v3/others/endMeeting.png" class="meetingEndImg">' +
                               '<img  src="'+ ele.conMainPicUrl+'" alt=""/></div>'+
                                        '      <div class="recommendBot">'+
                                        '      <div class="recommentTop">'+
                                        '      <div class="recommentDate"><span class="dateImg"></span>'+(typeof ele.startTime=="string"?ele.startTime.substring(0,10).replace(/-/g,".")+' - ':"")+ (typeof ele.endTime=="string"?ele.endTime.substring(0,10).replace(/-/g,"."):"")+'</div>'+
                                        '  <div class="recommentText"><span class="location"></span>'+ comm.getStrLen(ele.country+(ele.country!=""?' &sdot; ':"")+ ele.city,20)+'</div>'+
                                        '  <div class="clear"></div>'+
                                        '      </div>'+
                                        '      <div class="recommentBotText">'+comm.getStrLen(ele.conIntro,110) +'</div>'+
                                        '  <div class="clear"></div>'+
                                        '      </div>'+
                                        '      </a>'+
                                        '</li>';
                       });
                       $('#ev_meetingBannerCaro').html(recentMeeting).width($('#ev_meetingBannerCaro li').width()*$('#ev_meetingBannerCaro li').length);

                       if(metTopSpotLi=="<li></li>"){//如果仅有一个数据，只有一个li,则默认隐藏
                           metTopSpotLi="";
                       }
                       $('.metTopSpotUl').html(metTopSpotLi).find('li:first').addClass('activeLi');
                       var wD = 30*$('.metTopSpotUl li').length;
                       $('.metTopSpotUl').width(wD);
                       $('.metTopSpot').css({
                           width:$('.metTopSpotUl').outerWidth(),
                           left:(710-$('.metTopSpotUl').width())/2
                       });
                       $('.meetingTopLeft').removeClass('hide');
                       $('#ev_latestMeeting').after(latestMeeting);
                       $('.meetingTopRight').removeClass('hide');
                       $('#ev_recomMeeting').html(recomMeeting);
                       if(recomMeeting){
                           $('.meetingMid').removeClass('hide');
                       }
                       $('#ev_searchTagList').html(tagList).find('li').eq(0).addClass('metNavChange');
                       $("#ev_prevMeeting").before(prevMeeting);
                       if(prevMeeting){
                           $('.meeting_past_wrap ,.meetingPast').removeClass('hide');
                       }
                       $('#ev_searchNav').attr('sTop',$('#ev_searchNav').offset().top);
                       t.bannerSlide();
                       if(recentMeeting==""&&latestMeetingWithImg==""&&recomMeeting==""&&prevMeeting==""){
                           $(".meetingTop").hide();
                           $(".meeting_noList").show();
                       }
                   }else{
                       $(".meetingTop").hide();
                       $(".meeting_noList").show();
                   }
               }
           });

       },
       randomChange:function(){//换一批
           var t=this;
           var html="";
           $('#ev_randomChange').on('click',function(){
               html="";
               //var requestTime = $('#ev_randomChange').data('requestTime');
               var requestTime = t.config.requestTime;
               if($(this).hasClass('ev_requesting')){//如果在请求中，加上类，禁用按钮
                   $(this).css('cursor','default');
                   return false;
               }else{
                   $(this).addClass('ev_requesting').css('cursor','default');//点击加请求中的类
                   t.ajaxFn({
                       url: t.path.indexLoad,
                       param:{paramJson: $.toJSON({visitSiteId:1,recommendNum:requestTime,platformId:$('#sesDepartment').val()||1,sessionCustomerId:$('#sesCustomerId').val()||""})},
                       fn:function(data){
                           if(data&&data.responseObject.responseData&&data.responseObject.responseData.data_list.length){
                               var item = data.responseObject.responseData.data_list[0];
                               var startTime,endTime;
                               $.each(item.conference,function(i,e){
                                   startTime= (e.startTime&& e.startTime!=undefined&& e.startTime!=""&& !$.isEmptyObject(e.startTime))? (e.startTime).substring(0,10).replace(/-/g,"."):"";
                                   endTime= (e.endTime&& e.endTime!=undefined&& e.endTime!=""&& !$.isEmptyObject(e.endTime))? (e.endTime).substring(0,10).replace(/-/g,"."):"";
                                   html+='<li>'+
                                           ' <a href="'+e.conUrl+'">'+
                                           '     <div class="recommendImg"><img src="'+ e.conMainPicUrl+'" alt=""/></div>'+
                                           '     <div class="recommendBot">'+
                                           '     <div class="recommentTop">'+
                                           '     <div class="recommentDate"><span class="dateImg"></span>'+startTime+'-'+ endTime+'</div>'+ //
                                           ' <div class="recommentText"><span class="location"></span>'+  comm.getStrLen(e.country+' &sdot; '+ e.city,20)+'</div>'+
                                           ' <div class="clear"></div>'+
                                           '     </div>'+
                                           '     <div class="recommentBotText">'+ comm.getStrLen(e.conIntro,110)+'</div>'+//
                                           ' <div class="clear"></div>'+
                                           '     </div>'+
                                           '     </a>'+
                                           '</li>';
                               })
                               $('#ev_recomMeeting').html(html+'<div class="clear"></div>');
                               $('#ev_randomChange').removeClass('ev_requesting').css('cursor','pointer');//列表结束启用按钮
                               //requestTime++;
                               //$('ev_randomChange').data('requestTime',requestTime);
                               t.config.requestTime+=1;
                           }else{//没有数据
                               $('#ev_randomChange').removeClass('ev_requesting').css('cursor','pointer');
                           }
                       },
                       error:function(XMLHttpRequest, textStatus, errorThrown){//请求出错启用按钮
                           comm.LightBox.hideloading();
                           $('#ev_randomChange').removeClass('eq_requesting').css('cursor','pointer');
                       }
                   });
               }

           })

       },
       loadMoreMeeting:function(num){//查找会议
           var t=this;
            var html='';
               t.ajaxFn({
                   url: t.path.indexLoad,
                   param:{paramJson: $.toJSON({firstResult:num,maxResult:20,platformId:$('#sesDepartment').val()||1,sessionCustomerId:$('#sesCustomerId').val()||""})},
                   fn:function(data){
                       if(data&&data.responseObject.responseData&&data.responseObject.responseData.data_list.length){
                           var item=data.responseObject.responseData.data_list;
                           var startTime,endTime;
                           $.each(item,function(i,e){
                               startTime= (e.conference.startTime&& e.conference.startTime!=undefined&& e.conference.startTime!=""&& !$.isEmptyObject(e.conference.startTime))? (e.conference.startTime).substring(0,10).replace(/-/g,"."):"";
                               endTime= (e.conference.endTime&& e.conference.endTime!=undefined&& e.conference.endTime!=""&& !$.isEmptyObject(e.conference.endTime))? (e.conference.endTime).substring(0,10).replace(/-/g,"."):"";
                               html+='   <li>'+
                                   '   <a href="'+e.conference.conUrl+'">'+
                                   '      <div class="recommendImg">' +
                                   //'<img src="//img10.allinmd.cn/v3/others/endMeeting.png" class="meetingEndImg">' +
                                   '<img  src="'+ e.conference.conMainPicUrl+'" alt=""/></div>'+
                                   '      <div class="recommendBot">'+
                                   '      <div class="recommentTop">'+
                                   '      <div class="recommentDate"><span class="dateImg"></span>'+startTime+'-'+endTime+'</div>'+
                                   '  <div class="recommentText"><span class="location"></span>'+ comm.getStrLen(e.conference.country+' &sdot; '+e.conference.city,20)+'</div>'+
                                   '  <div class="clear"></div>'+
                                   '      </div>'+
                                   '      <div class="recommentBotText">'+comm.getStrLen(e.conference.conIntro,110) +'</div>'+
                                   '  <div class="clear"></div>'+
                                   '      </div>'+
                                   '      </a>'+
                                   '</li>';
                           })

                           $('#ev_prevMeeting').before(html);
                           //$('.seeMore').removeClass('seeMoreIng').css({cursor:'default',color:'#565656'});
                           $('.seeMore').show();
                           $('.al-loadMoreImg').hide();
                           if(item.length<20){
                               $('.seeMore').hide();
                           }
                       }else if(data.responseObject.responseData.data_list.length==0){
                           $('.seeMore').hide();
                       }
                   }
               },true);

       },
       ajaxFn:function(o,noLoadingState){
           if(!noLoadingState){
               comm.LightBox.showloading();
           }
           $.ajax({
               url:o.url,
               type:'post',
               dataType:'json',
               //data:{paramJson: $.toJSON(o.param)},
               data: o.param,
               success:function(res){
                   if(!noLoadingState){
                       comm.LightBox.hideloading();
                   }
                    if(res){
                        o.fn(res);
                    }
               }
           })
       },
       shareAction:function(){
           //module.share({
           //    container:$ ( ".ev-shareContainer" ),// 存放分享组件的父级
           //    type:2,// 默认为 1  1 ：社交分享  2 ：页面左下角全站分享
           //    url:document.location.href,// 分享链接， 默认取当前页链接
           //    h5Url:'',//h5页面的链接会生成微信二维码
           //    title:'唯医会议频道-医学会议在线直播，allinmd',// 分享标题
           //    shareTrend:1,//0: 不需要站内动态分享  1 ：需要站内动态分享
           //    trendUrl:'',// 分享到站内动态的接口
           //    data:{},// 分享到站内动态的接口参数
           //    callback:function(){},// 分享到站内动态成功后回调函数
           //    pic:'',// 分享图片
           //    sinaTitle:'医学会议，专家访谈，手术视频，医学教学视频，医学科研视频，医学讲座视频，直播，录播，回放，免费医学视频，唯医，allinmd',// 新浪分享标题
           //    sinaSummary:'',// 新浪分享描述
           //    qqTitle:'',//qq 好友分享标题
           //    qqSummary:'医学会议，专家访谈，手术视频，医学教学视频，医学科研视频，医学讲座视频，直播，录播，回放，免费医学视频，唯医，allinmd',//qq 好友分享描述
           //    qqZoneTitle:'',//qq 空间分享标题
           //    qqZoneSummary:'医学会议，专家访谈，手术视频，医学教学视频，医学科研视频，医学讲座视频，直播，录播，回放，免费医学视频，唯医，allinmd'//qq 空间分享描述
           //});
       }

   };
    channelMeeting.init();


});
/*
* 设置时间格式 如：2015.10.01-10.03
* */
function dateFormat(date1,date2){//date1开始时间，date2结束时间
    var result;
    if(date1&&date2&&typeof date1=='string'&&typeof date2=='string') {
        var d1 = date1.substring(0, 10).replace(/-/g, '.');
        var d1Arr = d1.toString().split('.');
        var d2 = date2.substring(0, 10).replace(/-/g, '.');
        var d2Arr = d2.toString().split('.');
        if (parseInt(d2Arr[0]) > parseInt(d1Arr[0])) {//如果跨年
            result = d1 + '~' + d2;
        } else {//同一年
            if (parseInt(d2Arr[1]) > parseInt(d1Arr[1])) {//如果结束月份大于开始月份
                result = d1 + '~' + d2.substring(5, 10);
            } else {
                result = d1 + "~" + d2.substring(8, 10);
            }
        }
        return result;
    }else{
        return "";
    }
}

/*
* 设置光标所在位置
* */
function setCursorPosition(elem, index) {
    var val = elem.value
    var len = val.length

    // 超过文本长度直接返回
    if (len < index) return
    setTimeout(function() {
        elem.focus()
        if (elem.setSelectionRange) { // 标准浏览器
            elem.setSelectionRange(index, index)
        } else { // IE9-
            var range = elem.createTextRange()
            range.moveStart("character", -len)
            range.moveEnd("character", -len)
            range.moveStart("character", index)
            range.moveEnd("character", 0)
            range.select()
        }
    }, 10)
}