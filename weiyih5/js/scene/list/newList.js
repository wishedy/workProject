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
           timeHot:M_CALL+'customer/trends/getMapListByTime/'
       },
       params:{
           sessionCustomerId:TempCache.getItem('userId')!=undefined?TempCache.getItem('userId'):'',
           opId:0,             //0只查询发布状态的
           dateType:2,         //1-每日最新 2-每周最新
           trendTypes:'1,2,4,7',  		//	全部时传1,2,4,7
           logoUseFlag:3,
           attUseFlag:AttUseFlag.e,
           pageIndex:1,
           pageSize:20,
           platformId:TempCache.getItem('department')
       },
       setParams:function(){   //通过传参设置不同页面及请求
           var t=this;
           var _a = comm.getpara().trendTypes;
           var _b =comm.getpara().dateType;
           var trendType=_a!=undefined?_a:0;           //	全部时传1,2,4,7
           var dateType =_b!=undefined?_b:1;          //1-每日最新 2-每周最新
           var resType='资源';
           var _tType;
           switch(parseInt(trendType)){
               case 1:
                   _tType =1;
                   resType='视频';
                   break;
               case 2:
                   _tType=2;
                   resType='文库';
                   break;
               case 4:
                   _tType=4;
                   resType='话题';
                   break;
               case 7:
                   _tType=7;
                   resType='病例';
                   break;
               default:
                   _tType ="1,2,4,7";
           }
           switch(parseInt(dateType)){
               case 1:
                   $('.ev_listName').text('每日最新');
                   document.title = "每日最新"+resType+" －为你精选,唯医,allinmd";
                   $('meta[name="keywords"]').attr('content',"每日最新"+resType+"，allinmd");
                   Log.createBrowse(38,"每日最新");
                   break;
               case 2:
                   $('.ev_listName').text('每周最新');
                   document.title = "每周最新"+resType+" －为你精选,唯医,allinmd";
                   $('meta[name="keywords"]').attr('content',"每周最新"+resType+"，allinmd");
                   Log.createBrowse(39,"每周最新");
                   break;
           }
           t.params = $.extend(t.params,{
               trendTypes: _tType,
               dateType:dateType
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
                       refType = je.customer_trends_type;
                       trend = je.customer_trends;
                       c_auth = je.customer_auth;
                       if(refType==1){
                           attUrl = je.cms_video_attachment_logo==""?"":je.cms_video_attachment_logo.videoAttUrl;
                       }else if(refType==2){
                           attUrl = je.cms_doc_attachment_logo==""?"":je.cms_doc_attachment_logo.docAttUrl;
                       }else if(refType==4){
                           attUrl = je.cms_topic_attachment_logo==""?"":je.cms_topic_attachment_logo.topicAttUrl;
                       }else if(refType==7){
                           attUrl = je.case_attachment_logo==""?"":je.case_attachment_logo.attUrl;
                       }
                       sDom=module.indexListTem.byTypeList({
                           resUrl:trend.resourceUrl,
                           resName:trend.resourceName,
                           author:c_auth.lastName+c_auth.firstName,
                           browseNum:je.resource_valid.browseNum?je.resource_valid.browseNum.toWK():0,
                           attUrl:attUrl,
                           playTime:je.resource_valid.playTime,
                           score:je.currentStarLevel,
                           scoreNum:je.currentScoreNum,
                           videoType:je.videoType
                       }, refType);
                       html+= sDom;
                   });
                   $('.ev_resBox').html(html);
                   if(item.length<20){
                       $(".ev_scrollPage").attr("scrollPagination", "disabled").append(t.noMoreDom());;
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
                       $(".ev_scrollPage").attr("scrollPagination", "disabled").append(t.noMoreDom());
                       //alert("没有内容了");
                       return false;
                   } else {
                       if ($.isEmptyObject(data.responseObject.responseData) || (data.responseObject.responseData.data_list && data.responseObject.responseData.data_list.length == 0)) {
                           $(".ev_scrollPage").attr("scrollPagination", "disabled").append(t.noMoreDom());
                           //alert("没有内容了2");
                           return false;
                       } else {
                           var item =data.responseObject.responseData.data_list;
                           var html='',sDom="",attUrl="",refType='',trend,c_auth;
                           $.each(item,function(i,je){
                               refType = je.customer_trends_type;
                               trend = je.customer_trends;
                               c_auth = je.customer_auth;
                               if(refType==1){
                                   attUrl = je.cms_video_attachment_logo==""?"":je.cms_video_attachment_logo.videoAttUrl;
                               }else if(refType==2){
                                   attUrl = je.cms_doc_attachment_logo==""?"":je.cms_doc_attachment_logo.docAttUrl;
                               }else if(refType==4){
                                   attUrl = je.cms_topic_attachment_logo==""?"":je.cms_topic_attachment_logo.topicAttUrl;
                               }else if(refType==7){
                                   attUrl = je.case_attachment_logo==""?"":je.case_attachment_logo.attUrl;
                               }
                               sDom=module.indexListTem.byTypeList({
                                   resUrl:trend.resourceUrl,
                                   resName:trend.resourceName,
                                   author:c_auth.lastName+c_auth.firstName,
                                   browseNum:je.resource_valid.browseNum?je.resource_valid.browseNum.toWK():0,
                                   attUrl:attUrl,
                                   playTime:je.resource_valid.playTime,
                                   score:je.currentStarLevel,
                                   scoreNum:je.currentScoreNum,
                                   videoType:je.videoType
                               }, refType);
                               html+= sDom;
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