/**
 * @name:
 * @desc:
 * @example:
 * @depend:
 * @date: 2016/9/5
 * @author: sunhaibin
 */

$(function(){
    FastClick.attach(document.body);
   var ctrl ={
       opt:{
           cid:TempCache.getItem('userId')
       },
       path:{
           timeHot:M_CALL+'resource/browse/json_list/'
       },
       params:{
           groupByFlag :1,// 1-每日最热  5-每周最热
           dataType:0,// 0-全部 ，1-视频 2-文库，4-话题，7-病例
           visitSiteId:2,
           scene:1,// 1-列表
           pageIndex:1,
           pageSize:20,
           platformId:TempCache.getItem('department')
    },
       setParams:function(){   //通过传参设置不同页面及请求
           var t=this;
           var dataType = comm.getpara().dataType;  //	全部时传0   //1,2,4,7
           var groupByFlag =comm.getpara().groupByFlag;              //1-每日最新 2-每周最新
           var _dataType =dataType!=undefined?dataType:0;
           var _groupByFlag=groupByFlag!=undefined?groupByFlag:1;
           var resType='资源';
           switch(parseInt(_dataType)){
               case 1:
                   resType='视频';
                   break;
               case 2:
                   resType='文库';
                   break;
               case 4:
                   resType='话题';
                   break;
               case 7:
                   resType='病例';
                   break;
           }
           switch(parseInt(_groupByFlag)){
               case 1:
                   $('.ev_listName').text('每日最热');
                   document.title = "每日最热"+resType+" －为你精选,唯医,allinmd";
                   $('meta[name="keywords"]').attr('content',"每日最热"+resType+"，allinmd");
                   Log.createBrowse(40,"每日最热");
                   break;
               case 5:
                   $('.ev_listName').text('每周最热');
                   document.title = "每周最热"+resType+" －为你精选,唯医,allinmd";
                   $('meta[name="keywords"]').attr('content',"每周最热"+resType+"，allinmd");
                   Log.createBrowse(41,"每周最热");
                   break;
           }
           t.params = $.extend(t.params,{
               dataType: _dataType,
               groupByFlag:_groupByFlag
           });
       },
       init:function(){
           var t=this;
           t.setParams();
           t.getResource();
           t.scrollPage();
           t.back();
       },
       back:function(){
           $('.ev_back').click(function(){
               comm.creatEvent({
                   triggerType:'全站功能按钮点击',
                   keyword:"返回",
                   actionId:41,
                   async:false
               });
               if(document.referrer===window.location.href||document.referrer==""){
                 g_sps.jump(null,'/');
               } else{
                 g_sps.jump(null,document.referrer);
               }
           });
       },
       noMoreDom:function(){
           return '<section class="listNoMore">~  没有更多了  ~</section>';
       },
       getResource:function(){
           var t=this;
           var paramJson ={paramJson:$.toJSON(t.params)} ;
           var callback =function(data){
               if(data&&!$.isEmptyObject(data.responseObject.responseData)&&data.responseObject.responseData.data_list.length){
                   var item =data.responseObject.responseData.data_list;
                   var html='',sDom="",attUrl="",refType='',trend,c_auth;
                   $.each(item,function(i,je){
                       if(!$.isEmptyObject(je)){
                           refType = je.itemType;
                           attUrl="";
                           if(je.picNum==1){
                               attUrl=je.picUrl
                           }else if(je.picNum>1){
                               attUrl = je.picUrl.split('|')[0];
                           }
                           html+=module.indexListTem.byTypeList({
                               resUrl:je.itemUrl,
                               resName:je.itemTitle,
                               author:je.ownerName,
                               browseNum:je.browseNum?je.browseNum.toWK():0,
                               attUrl:attUrl,
                               playTime:je.playTime,
                               score:je.currentStarLevel,
                               scoreNum:je.currentScoreNum,
                               videoType:je.videoType
                           }, refType);
                       }
                   });
                   $('.ev_resBox').html(html);
                   if(item.length<20){
                       $(".ev_scrollPage").attr("scrollPagination", "disabled").append(t.noMoreDom());
                   }
               }
           };
           comm.ajax.async(t.path.timeHot, paramJson,callback);

       },
       scrollPage:function(){
           var t=this;
           var pagenumber=2;
           $('.ev_scrollPage').scrollPagination({
               'contentPage': t.path.timeHot,
               'contentData': $.extend(t.params, {
                   pageIndex: function () {
                       return pagenumber++;
                   }
               }),
               'scrollTarget': $(window),
               'heightOffset': $(window).height(), // it gonna request when scroll is 10 pixels before the page ends
               'delaytime': 0,
               'type': "post",
               'dataType':"json",
               'beforeLoad': function () {
                   comm.loading.show();
               },
               'afterLoad': function (elementsLoaded) {
                   comm.loading.hide();
               },
               'fail':function(){
                   comm.loading.hide();
               },
               'loader': function (data) {
                   if ($.isEmptyObject(data)) {
                       $(".ev_scrollPage").attr("scrollPagination", "disabled").append(t.noMoreDom());;
                       //alert("没有内容了");
                       return false;
                   } else {
                       if ($.isEmptyObject(data.responseObject.responseData) || (data.responseObject.responseData.data_list && data.responseObject.responseData.data_list.length == 0)) {
                           $(".ev_scrollPage").attr("scrollPagination", "disabled").append(t.noMoreDom());;
                           //alert("没有内容了2");
                           return false;
                       } else {
                           var item =data.responseObject.responseData.data_list;
                           var html='',sDom="",attUrl="",refType='',trend,c_auth;
                           $.each(item,function(i,je){
                               refType = je.itemType;
                               attUrl="";
                               if(je.picNum==1){
                                   attUrl=je.picUrl
                               }else if(je.picNum>1){
                                   attUrl = je.picUrl.split('|')[0];
                               }
                               html+=module.indexListTem.byTypeList({
                                   resUrl:je.itemUrl,
                                   resName:je.itemTitle,
                                   author:je.ownerName,
                                   browseNum:je.browseNum?je.browseNum.toWK():0,
                                   attUrl:attUrl,
                                   playTime:je.playTime,
                                   score:je.currentStarLevel,
                                   scoreNum:je.currentScoreNum,
                                   videoType:je.videoType
                               }, refType);
                           });
                           $('.ev_scrollPage').append(html);
                           if(item.length< t.params.pageSize){
                               $(".ev_scrollPage").attr("scrollPagination", "disabled").append(t.noMoreDom());
                               //alert("没有内容了3");
                               return false;
                           }
                       }
                   }
               }
           });
       }
   };
    ctrl.init();
});