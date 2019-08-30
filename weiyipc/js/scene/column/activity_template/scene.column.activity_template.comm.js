/**
 * 功能描述：专题模板拜耳二期PC
 * 使用方法:
 * 注意事件：
 * 引入来源：
 *     作用：
 *
 * Created by JuKun on 2016/11/3.
 *
 * UpData by zhanghongda on 2017/4
 */
$(function(){
   $("body").append('<input type="hidden" id="browseType" value="197">');
    setTimeout(function(){
        g_sps&&g_sps.createBrowse({pageId:467})
    }, 2000);
   var specialTemplate={
       config:{
           havPic:0,//标示话题是否有图
           isExpert:PC_CALL+'activity/api/isExpert/',
           reviewCount:PC_CALL+"activity/api/getExpertReviewResourceCount/",//查看专家待评作品数量
           resourceLIst:PC_CALL+"activity/menu/layout/module/getResourceMapList/",//列表数据
       },
       init:function(){
           var t=this;
           t.tabClick();
           t.navMore();
           t.snsShare();
           t.buildArguments();
           t.newUpDow();
           t.isReviewBegin();
           t.scoreAlert();
           t.userList();
           if($(".spTemp_total_nav_lists li").length == 0){$(".spTemp_total_nav").hide();}
       },
       loadFirst:function(){
           var t=this;
           var homePage="",
               homeType="",
               activitymenuId="",
               areaOrSemi="",
               layoutId="",
               isMyWorks = '',
               waitWorks = '';

           var el=$(".spTemp_total_nav_lists li:eq(0)");
           if($(el).hasClass("nav_cut_hasTwo")){
               var els=$(".spTemp_total_nav_lists li dd")[0];
               homePage=$(els).data("href").replace("https:","");
               homeType=$(els).data("type");
               activitymenuId=$(els).data("activitymenuid");
               layoutId=$(els).data("layoutid");
           }else{
               homePage=$(el).children("span").data("href").replace("https:","");
               homeType=$(el).children("span").data("type");
               activitymenuId=$(el).children("span").data("activitymenuid");
               layoutId=$(el).children("span").data("layoutid");

               if($(el).text().indexOf("区域赛")>-1){
                   areaOrSemi=1;
               }
               if($(el).text().indexOf("半决赛")>-1){
                   areaOrSemi=2;
               }
               if($(el).text().indexOf("我的作品")>-1){
                   isMyWorks = 1;
               }
               if($(el).text().indexOf("待评作品")>-1){
                   waitWorks = 1;
               }
           }
           t.judgeUtlType({urlType:homeType,urlLink:homePage,activitymenuId:activitymenuId,layoutId:layoutId,areaOrSemi:areaOrSemi,isMyWorks:isMyWorks,waitWorks:waitWorks});
       },
       navMore:function(){
           var navH = $('.spTemp_total_nav_lists').height();
           if(navH>132){
               $('.spTemp_nav_more').show();
               $('.spTemp_total_nav_lists').css({
                   overflow:'hidden',
                   height:'132px',
                   paddingRight:'246px'
               });
           }else{
               $('.spTemp_total_nav_lists').css({
                   paddingRight:'246px'
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
           });
           var Hei = $(".spTemp_total_nav").offset().top;//当行
           $(window).on("scroll",function(){
               if($(".spTemp_total_nav_lists").find("li").length>1){
                   if(navH>66){//表示导航为大于一行
                       if(Hei-$(window).scrollTop()<=0){
                           $(".spTemp_total_nav").addClass("toTop");
                           $(".spTemp_total_down").addClass("marginTop");
                       }else{
                           $(".spTemp_total_nav").removeClass("toTop");
                           $(".spTemp_total_down").removeClass("marginTop");
                       }
                   }else{//导航为一行
                       if(Hei-$(window).scrollTop()<=0){
                           $(".spTemp_total_nav").addClass("toTop");
                           $(".spTemp_total_down").addClass("marginTopOne");
                       }else{
                           $(".spTemp_total_nav").removeClass("toTop");
                           $(".spTemp_total_down").removeClass("marginTopOne");
                       }
                   }
               }
           });
       },
       tabClick:function(){
           var t = this;
           if($("#sesCustomerId").val()){//如果已经登录,判断是否是专家
               $.ajax({//结果是否在公示中，上传是否截止
                   type:'post',
                   url:t.config.isExpert,
                   data:{paramJson: $.toJSON({customerId:$("#sesCustomerId").val(),activityId:$('#activityId').val()})},
                   dataType:"json",
                   async:false,
                   success:function(data){
                       var isExpert = data.responseObject.responseData.isExpert;
                       var recordId = data.responseObject.responseData.recordId;
                       $("#activityId").attr("expert",isExpert);
                       $("#activityId").attr("recordId",recordId);
                       if($("#activityId").attr("expert")==1){//专家用户将待评作品进行显示
                           $.each($(".spTemp_total_nav_lists li span"), function (i, e) {
                               if(e.innerText=="待评作品"){
                                   $(this).show();
                               }
                               if(e.innerText=="我的作品"){
                                   $(this).hide();
                               }
                           })
                       }else{//唯医会员，普通用户将待评作品进行隐藏，将我的作品进行显示
                           $.each($(".spTemp_total_nav_lists li span"), function (i, e) {
                               if(e.innerText=="待评作品"){
                                   $(this).hide();
                               }
                               if(e.innerText=="我的作品"){
                                   $(this).show();
                               }
                           })
                       }
                   }
               })
           }else{//没有登录时将待评作品进行隐藏
               $.each($(".spTemp_total_nav_lists li span"), function (i, e) {
                   if(e.innerText=="待评作品"){
                       $(this).hide();
                   }
                   if(e.innerText=="我的作品"){
                       $(this).show();
                   }
               })
           }
           $(window).unload(function(){//在刷新页面时，将滚动条滚动到最顶端
               $("html,body").scrollTop(0);
           });
           $(".spTemp_total_nav_lists li span").on("click",function(){//每次点击获取到当前目标的一些自定义属性存起来用
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
                       activitymenuId=$(this).data("activitymenuid"),
                       layoutId=$(this).data("layoutid"),
                       isMyWorks = '',
                       areaOrSemi = '',
                       waitWorks=''
                   if($(this).text().indexOf("区域赛")>-1){
                       areaOrSemi=1;
                   }else if($(this).text().indexOf("半决赛")>-1){
                       areaOrSemi=2;
                   }else if($(this).text().indexOf("我的作品")>-1){
                       isMyWorks = 1
                   }else if($(this).text().indexOf("待评作品")>-1){
                       waitWorks = 1;
                   }else{
                       areaOrSemi = '',
                       waitWorks=''
                   }
                   t.judgeUtlType({
                       urlType:urlType,
                       urlLink:urlLink,
                       activitymenuId:activitymenuId,
                       layoutId:layoutId,
                       areaOrSemi:areaOrSemi,
                       isMyWorks:isMyWorks,
                       waitWorks:waitWorks
                   })
               }
               var navHref = window.location.pathname + location.search;
               if(navHref.indexOf("#") < 0){
                   navHref += "#";
               }
               var href = navHref+"&navText="+$(this).data("navtext");
               window.location.href=href;
               if($(this).parents("li").hasClass("nav_cut_hasTwo_up")||$(this).parents("li").hasClass("nav_cut_hasTwo_down")){
               }else{
                   $(window).scrollTop(0);
               }
               //t.snsShare();
               t.newUpDow();//展开收起
           });
           $('.spTemp_total_nav_lists_two dl dd').on("click",function(){//每次点击获取到当前目标的一些自定义属性存起来用
               $('#shareLoc').val("http://" + location.hostname + location.pathname + "?navText=" +$(this).data('navtext'));
               //$(this).parents('.spTemp_total_nav_lists_two').siblings('span').html($(this).text());
               $(this).parents('.spTemp_total_nav_lists_two').siblings('span').attr('data-navtext',$(this).data('navtext'));
               $(this).parents('.nav_cut_hasTwo').children("span").addClass("textColorYesOne").parent().siblings().children("span").removeClass("textColorYesOne");
               $(this).parent().parent().hide().closest(".nav_cut_hasTwo_down").removeClass("nav_cut_hasTwo_down").addClass("nav_cut_hasTwo_up");
               $(this).addClass("textColorYesTwo").siblings().removeClass("textColorYesTwo");
               var urlLink=$(this).data("href").replace("https:",""); //二级导航url
               var urlType=$(this).data("type"),
                   activitymenuId=$(this).data("activitymenuid"),
                   layoutId=$(this).data("layoutid");
               t.judgeUtlType({
                   urlType:urlType,
                   urlLink:urlLink,
                   activitymenuId:activitymenuId,
                   layoutId:layoutId
               })
               var navHref = window.location.pathname + location.search;
               if(navHref.indexOf("#") < 0){
                   navHref += "#";
               }
               $(window).scrollTop(0);
               var href = navHref+"&navText="+$(this).data("navtext");
               setTimeout(function () {
                   g_sps.jump(null,href);
               },300);
               comm.getpara()
               //t.snsShare();
           });
           $('.spTemp_total_nav_lists_two dl dd').hover(function(){
              $(this).removeClass("textColorNoTwo").addClass("textColorYesTwo");
           },function(){
               $(this).removeClass("textColorYesTwo").addClass("textColorNoTwo");
           })
       },
       judgeUtlType:function(Uv){
           var t=this;
           switch (Uv.urlType){
               case 1:   //站内
                   if(Uv.urlLink.length>0){
                       t.singlePageToLoad(Uv);
                   }
                   break;
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
       //添加排序方式
       dataLoad:function(Uv){
           var t = this;
           // comm.Log.createBrowse({href: location.href, id: 197, name: '新版活动页面'});
           if(Uv.areaOrSemi){//半决赛和区域赛组件列表
               var params={paramJson: $.toJSON({
                   scene:Uv.areaOrSemi,
                   activityId:$("#activityId").val(),
                   activityMenuId:Uv.activitymenuId,
                   siteId:3
               })};
               var callback=function(rep){//将赛区入口进行添加
                   if(rep&&rep.responseObject&&rep.responseObject.responseData&&rep.responseObject.responseData.list
                       &&rep.responseObject.responseData.list.length>0){
                       var items=rep.responseObject.responseData.list;
                       var html="";
                       $(".isComp[data-componenttype=8] .total_title span").text(rep.responseObject.responseData.title);
                       $.each(items,function(i,e){
                           html+='<a'+(e.cmsActivityProperty.isValid==1?' href="'+ e.areaUrl+'"':' class="divisionGray" href="javascript:;"')+'>'
                               + e.cmsActivityProperty.propertyName+'</ a>';
                       });
                       $(".division_list").html(html);
                   }
               };
               commTemplate.ajax.async(params,callback);
           }
           if(Uv.isMyWorks==1){//如果是我的作品
               comm.myWorks=activity;
               function activity(){
                   var param = {paramJson: $.toJSON({
                       "pageIndex":1,
                       "pageSize":50,
                       "attUseFlag":3,
                       "logoUseFlag":3,
                       "dataFlag":4,
                       customerId:$("#sesCustomerId").val(),
                       sessionCustomerId:$("#sesCustomerId").val(),
                       activityId:$("#activityId").val(),
                       "isNewActivity":1
                   })};
                   commTemplate.ajax.actAsync(param, function (data) {
                       var content="";
                       if(data&&data.responseObject.responseData){
                           var dataItem=data.responseObject.responseData.data_list;
                           if(dataItem&&dataItem.length>0){//存在数据
                               $(".tempMainModel").show();
                               $(".no_register").hide();
                               $(".works_mine_content").show();
                               $(".works_mine_lists_top span").text("（"+dataItem.length+"）");
                               for(var i=0,l=dataItem.length;i<l;i++){
                                   var item = dataItem[i],
                                       state = item.approvalStatus,
                                       hide="style='display:none;'",
                                       finalScore = item.score,		//得分
                                       authName=item.customer_auth.lastName+item.customer_auth.firstName,	//作者名称
                                       auth_report="",					//审核状态
                                       shareBtns="",					//分享按钮
                                       playTime='',					//播放时间及背景
                                       imgUrl='//img10.allinmd.cn/default/loading/225_150.jpg',						//图片链接
                                       deadLink="javascript:;",		//无效链接
                                       shareBtn_suc = '<li>'+
                                           '<span style="margin-right:0;">分享至：</span>'+
                                           '<span class="works_mine_lists_shareQQ shareQQ"><a href="javascript:;"><img src="//img00.allinmd.cn/column/videoPK_v2/myworks_QQ.png" alt=""></a></span>'+
                                           '<span class="works_mine_lists_shareWeiXin shareWx"><a href="javascript:;"><img src="//img00.allinmd.cn/column/videoPK_v2/myworks_WeiXin.png" alt=""></a><span class="d2_saomiao"><img src="//img00.allinmd.cn/column/videoPK_v2/2D_saomiao.png"></span></span>'+
                                           '<span class="works_mine_lists_shareQQKongJian shareQzone"><a href="javascript:;"><img src="//img00.allinmd.cn/column/videoPK_v2/myworks_quan.png" alt=""></a></span>'+
                                           '<div style="clear: both;"></div>'+
                                           '</li>',
                                       auth_report_ing="<div class='audit_wait'>待审核</div>",
                                       auth_report_suc=$('#activityId').attr('isReviewBegin')==1?"<div class='audit_finish'>报名已结束，评审正在紧张进行中，请关注初选结果...</div>":"<div class='audit_yes'>审核已通过</div>",
                                       auth_report_fail="<div class='audit_no'>未达到参赛标准<span class='no_reason'>拒绝原因： "+(jQuery.isEmptyObject(item.approvalReason)?'':item.approvalReason.substring(0,31))+"</span></div>";
                                   //判断是视频还是病例，如果是视频：
                                   //1 :有播放时间playTime，2:获取视频图片，3:如果状态为有效则有链接，有分享、判断审核状态
                                   //2 ：获取相关信息如图片，审核状态
                                   if(item.customer_trends_type){
                                       switch (item.customer_trends_type) {
                                           case 1://视频//1.有无播放时间
                                               playTime="<span>"+(item.resource_valid.playTime==undefined?'00:00:00':item.resource_valid.playTime)+"</span>";
                                               if(item.cms_video_attachment&&item.cms_video_attachment!=''){												// 	视频图片是否存在
                                                   for(var k=0,len=item.cms_video_attachment.length;k<len;k++){
                                                       if(item.cms_video_attachment[k].videoAttUrl&&item.cms_video_attachment[k].videoAttUrl!=""){			//视频图片存在&&不为空
                                                           imgUrl = item.cms_video_attachment[k].videoAttUrl.replace("img00","img10");				//imgUrl = 视频图片
                                                           break;
                                                       }
                                                   }
                                               }
                                               break;
                                           case 2://文库（没有图片）
                                               break;
                                           case 4://话题(不需要审核)
                                               if(item.cms_topic_attachment&&item.cms_topic_attachment!=''){
                                                   if(item.cms_topic_attachment[0].topicAttUrl&&item.cms_topic_attachment[0].topicAttUrl!=''){
                                                       imgUrl = item.cms_topic_attachment[0].topicAttUrl.replace("img00","img10");
                                                       t.config.havPic = 1;//如果话题有图存在
                                                   }
                                               }
                                               if(item.resource_valid.resourceValid==1){//审核通过可以跳转
                                                   auth_report = "<div class='audit_yes'>审核已通过</div>";
                                                   shareBtns=shareBtn_suc;
                                                   deadLink=item.customer_trends.headerUrl;
                                               }else{
                                                   auth_report = auth_report_fail;
                                               }
                                               break;
                                           case 7://病例
                                               if(item.case_attachment_list&&item.case_attachment_list!=''){
                                                   if(item.case_attachment_list[0].attUrl&&item.case_attachment_list[0].attUrl!=''){
                                                       imgUrl = item.case_attachment_list[0].attUrl.replace("img00","img10");
                                                   }
                                               }

                                               break;
                                       } //3:如果状态为有效则有链接，有分享、判断审核状态4期新加，如果activityId的属性isResultShowBegin存在，则显示分数
                                       if(item.customer_trends.isValid===1){//视频有效
                                           if(state==2||(state==1&&item.customer_trends_type==7)){ //判断资源审核通过||是待审核+病例
                                               shareBtns=shareBtn_suc;
                                               deadLink=item.customer_trends.headerUrl;
                                           }
                                           if($('#activityId').attr('isResultShowBegin')||$('#activityId').attr('isReviewBegin')==1){//1-提交审核、2-审核通过，4-审核拒绝'
                                               switch(state){ /**审核通过显示评分，拒绝显示拒绝*/
                                                   case 1:
                                                       auth_report =auth_report_ing;
                                                       break;
                                                   case 2:
                                                       auth_report=(finalScore>0?'<div class="totleScore"><i>总分：</i><span>'+finalScore+'</span></div>':auth_report_suc);
                                                       break;
                                                   case 3:
                                                       auth_report =auth_report_fail;
                                                       break;
                                                   case 4:
                                                       auth_report =auth_report_fail;
                                                       break;
                                               }
                                           }else{
                                               switch(state){
                                                   case 1:
                                                       auth_report =auth_report_ing;
                                                       break;
                                                   case 2:
                                                       auth_report=(finalScore>0?'<div class="totleScore"><i>总分：</i><span>'+finalScore+'</span></div>':auth_report_suc);
                                                       break;
                                                   case 3:
                                                       auth_report =auth_report_fail;
                                                       break;
                                                   case 4:
                                                       auth_report =auth_report_fail;
                                                       break;
                                               }
                                           }

                                       }else{
                                           switch(state){ //1-提交审核、2-审核通过，4-审核拒绝'
                                               case 1:
                                                   auth_report =auth_report_ing;
                                                   break;
                                               case 2:
                                                   auth_report=(finalScore>0?'<div class="totleScore"><i>总分：</i><span>'+finalScore+'</span></div>':auth_report_suc);
                                                   break;
                                               case 3:
                                                   auth_report =auth_report_fail;
                                                   break;
                                               case 4:
                                                   auth_report =auth_report_fail;
                                                   break;
                                           }
                                       }
                                   }
                                   content += "<div class='works_mine_lists_piece' data-workType='"+item.customer_trends_type+"' style='"+(item.customer_trends_type!=1&&item.customer_trends_type!=2?'height:210px':'')+"' "+(state==1&&$('#activityId').attr('isReviewBegin')==1?hide:"")+">"+
                                       "<div class='works_mine_lists_piece_left'>"+
                                       "<a target='_blank' class='authNameBox' "+((state==2||(state==1&&item.customer_trends_type==7)||state=='')?'href="'+deadLink+'"':'')+"><h3 authName='"+authName+"'>"+comm.getStrLen(item.customer_trends.resourceName,50)+"</h3></a>"+
                                       "<p class='authCont'>"+(item.customer_trends.trendContent!="该用户发言已被管理员屏蔽！"?comm.getStrLen(item.customer_trends.trendContent,150):"已被管理员屏蔽！")+"</p>"+
                                       "<ul>"+
                                       "<li>"+(item.resource_valid.browseNum==undefined?0:item.resource_valid.browseNum)+"</li>"+
                                       "<li>"+(item.resource_valid.reviewNum==undefined?0:item.resource_valid.reviewNum)+"</li>"+
                                       "<li>"+(item.resource_valid.preferUpNum==undefined?0:item.resource_valid.preferUpNum)+"</li>"+
                                       shareBtns+
                                       "<li class='ev-upNum' style='float:right;"+(item.customer_trends_type==2||(item.customer_trends_type==4&&t.config.havPic==0)?'margin-right:-250px;height:50px':'margin-right:0')+"'>"+item.customer_trends.opDate.substring(0,10)+"</li>"+
                                       "<div style='clear: both;'></div>"+
                                       "</ul>"+
                                       auth_report+
                                       "</div>"+
                                       "<div class='works_mine_lists_piece_right'>"+
                                       "<a target='_blank' href='"+deadLink+"'>" +
                                       (item.customer_trends_type==2||(item.customer_trends_type==4&&t.config.havPic==0)?"":"<img src='"+imgUrl+"' class='tupian'>")+
                                       "</a>"+
                                       playTime+
                                       (item.customer_trends_type==1?'<img class="video_btn" src="/images/img10/v3/common/icon/video_btn.png">':'')+
                                       "</div>"+
                                       "<div style='clear: both;'></div>"+
                                       "</div>"
                                   t.config.havPic=0;
                                   deadLink='';
                                   shareBtns="";
                               }
                               $(".works_mine_content").show();//外层的大div显示，html中隐藏了
                               $(".works_center_main").eq(0).hide();
                               $(".works_center_main").eq(1).show();
                               $(".works_mine_lists").html(content);
                               t.mYShareWeiXin();
                               t.mYShareQQ();
                               t.mYShareQzone();
                               $(".works_mine_lists img").lazyload({effect:"fadeIn",event:"scrollstop"});
                           }else{//不存在数据
                               var uploadHtml = '<div class="no_register no_up_reg" style="">'+
                                   '<div class="no_reg_center" style="margin-left: -130px; margin-top: -45px;">'+
                                   '<p>你还没有上传任何作品！</p>'+
                                   '</div>'+
                                   '</div>';
                               $(".no_up_reg").remove();
                               $(".spTemp_total_down").append(uploadHtml);
                               $(".tempMainModel").css("display","none");
                           }
                       }
                   })
               }
               if($("#sesCustomerId").val()){//已登录
                   if($("#activityId").attr("expert")==1){//专家用户,在未登录时在我的作品页登录，登录成功如果是专家，则将我的作品进行隐藏，显示待评作品并展示
                       $.each($(".spTemp_total_nav_lists li span"), function (i, e) {
                           if(e.innerText=="待评作品"){
                               $(this).show();
                               $(this).click();//跳转到待评作品页
                           }
                           if(e.innerText=="我的作品"){
                               $(this).hide();
                           }
                       })
                   }else{//唯医会员，普通用户
                       comm.myWorks();
                   }
               }else{//未登录
                   var uploadHtml = '<div class="no_register no_up_reg" style="">'+
                       '<div class="no_reg_center" style="margin-left: -90px; margin-top: -45px;">'+
                       '<p>你还没有登录！</p>'+
                       '<a href="javascript:;" id="tanchu_login">立即登录</a>'+
                       '</div>'+
                       '</div>'
                   $(".works_mine_content").hide();
                   $(".no_up_reg").remove();
                   $(".spTemp_total_down").append(uploadHtml);
                   $(".tempMainModel").hide();
                   $("#tanchu_login").off("click").on("click",function(){
                       user.login({
                           callback:function(){
                               t.isExpert();
                               if($("#activityId").attr("expert")==1){//专家用户,在未登录时在我的作品页登录，登录成功如果是专家，则将我的作品进行隐藏，显示待评作品并展示
                                   $.each($(".spTemp_total_nav_lists li span"), function (i, e) {
                                       if(e.innerText=="我的作品"){
                                           $(this).hide();
                                       }
                                       if(e.innerText=="待评作品"){
                                           $(this).show();
                                           $(this).click();
                                       }
                                   });
                                   t.scoreAlert();
                               }else{//唯医会员，普通用户
                                   comm.myWorks();
                               }
                           },
                           scene:privilegeSceneConst.eSceneTypeFellow,
                           onAuthCancel:function(){
                               comm.myWorks();
                           }

                       });
                   });
                   //兼容ie和360浏览器
                   var noUpW = -$(".no_up_center").width()/2,
                       noUpH = -$(".no_up_center").height()/2,
                       noRegW = -$(".no_reg_center").width()/2,
                       noRegH = -$(".no_reg_center").height()/2;
                   $(".no_up_center").css({
                       "margin-left":noUpW,
                       "margin-top":noUpH
                   })
                   $(".no_reg_center").css({
                       "margin-left":noRegW,
                       "margin-top":noRegH
                   });
                   //$(document).find("#nav_enroll").off("click").on("click", function () {
                   //    user.login({
                   //        callback: function () {
                   //            t.isExpert();
                   //            if($("#activityId").attr("expert")==1){//专家用户,在未登录时在我的作品页登录，登录成功如果是专家，则将我的作品进行隐藏，显示待评作品并展示
                   //                $.each($(".spTemp_total_nav_lists li span"), function (i, e) {
                   //                    if(e.innerText=="待评作品"){
                   //                        $(this).show();
                   //                        $(this).click();
                   //                    }
                   //                    if(e.innerText=="我的作品"){
                   //                        $(this).hide();
                   //                    }
                   //                })
                   //                t.scoreAlert();
                   //            }else{//唯医会员，普通用户
                   //                comm.myWorks();
                   //            }
                   //        }
                   //    })
                   //})
               }
           }
           if(Uv.waitWorks==1){//如果是待评作品
               if($("#sesCustomerId").val()){//已登录
                   $('.no_up_reg').hide();
                   t.isExpert();
                   if($("#activityId").attr("expert")==1){//专家进行评分
                       activityCheck();
                   }else{//唯医会员，普通用户,调用待评作品列表数据
                       $('.er_noList').show();
                   }
               }else{//未登录
                   setTimeout(function () {
                       g_sps.jump(null,"/html/activity/"+$("#activityId").val()+"/activity_index.html");
                   },300);
               }
           }
           if(Uv.isMyWorks!=1&&Uv.waitWorks!=1){//如果不是待评作品或者已评作品
               //var param={
               //    activityMenuId:Uv.activitymenuId,
               //    layoutId:Uv.layoutId,
               //    pageIndex:1,
               //    pageSize:999,
               //    solrScene:10,
               //    sortType:2,
               //    visitSiteId:1,
               //    activityId:$("#activityId").val(),
               //    customerId:$("#sesCustomerId").val(),
               //};
               //var resTemplate=commTemplate.ajax.sync(param);//将获取到的数据进行赋值
               //spTemp_list.one.spTemp_listLoad({ //调用temp.mylist.js
               //    resTemplate:resTemplate   //返回数据
               //});
               //testPerson.one.questionLoad({
               //    resTemplate:resTemplate   //返回数据
               //})
               $.each($(".sp_container .isComp"), function (i, e) {
                   if ($(e).attr("data-componentType") != 8) {//排除区域赛
                       var param={
                           activityMenuId:Uv.activitymenuId,
                           layoutId:Uv.layoutId,
                           id: $(e).attr("data-id"),
                           columnId: $(e).attr("data-columnId"),
                           pageIndex:1,
                           pageSize:999,
                           solrScene:10,
                           sortType:2,
                           visitSiteId:1,
                           activityId:$("#activityId").val(),
                           customerId:$("#sesCustomerId").val(),
                       };
                       var callbacks = function (data) {
                           if (data && data.bo && data.bo.responseData && !$.isEmptyObject(data.bo.responseData)) {
                               var resTemplate=data;
                               spTemp_list.one.spTemp_listLoad({ //调用temp.mylist.js
                                   resTemplate:resTemplate   //返回数据
                               });
                               testPerson.one.questionLoad({
                                   resTemplate:resTemplate   //返回数据
                               })
                           }
                           t.userList();
                       };
                       comm.ajax.async(t.config.resourceLIst, {paramJson: $.toJSON(param)}, callbacks);
                   }
               });
           }
       },
       mYShareQQ:function(){
           var t = this;
           $(".works_center_main").on('click','.shareQQ',function(e){
               var $this =  $(this).parents('.works_mine_lists_piece');
               var workType = $this.attr("data-workType");
               var wType = '';
               switch (parseInt(workType)){
                   case 1:
                       wType = "视频";
                       break;
                   case 2:
                       wType = "文库";
                       break;
                   case 4:
                       wType = "话题";
                       break;
                   case 7:
                       wType = "病例";
                       break;
               }
               var imgSource =$this.find('.tupian').eq(0).attr('src');
               var url=encodeURIComponent($this.find('.authNameBox').attr("href")),
                   t=encodeURIComponent($this.find('h3').text()),
                   pSrc=encodeURIComponent(imgSource),
                   openurl = 'http://connect.qq.com/widget/shareqq/index.html?',
                   desc =encodeURIComponent($("#sesNickname").val()+"参加了"+"“"+$.trim($("title").html())+"”，"+"参赛"+wType+"《"+$.trim($this.find('h3').text())+"》。"+"快来支持，点击进入作品>>");
               var alink = openurl+"url=https:"+url+"&pics="+pSrc+"&title="+t+"&summary="+desc;
               window.open(alink,'_blank');
               return false;
           })
       },
       mYShareQzone:function(){
           var t = this;
           $(".works_center_main").on('click','.shareQzone',function(e){
               var $this =  $(this).parents('.works_mine_lists_piece');
               var workType = $this.attr("data-workType");
               var wType = '';
               switch (parseInt(workType)){
                   case 1:
                       wType = "视频";
                       break;
                   case 2:
                       wType = "文库";
                       break;
                   case 4:
                       wType = "话题";
                       break;
                   case 7:
                       wType = "病例";
                       break;
               }
               var imgSource =$this.find('.tupian').eq(0).attr('src');
               var t=encodeURIComponent($this.find('h3').text()),
                   pSrc=encodeURIComponent(imgSource),
                   url=encodeURIComponent($this.find('.authNameBox').attr("href")),
                   desc =encodeURIComponent($("#sesNickname").val()+"参加了"+"“"+$.trim($("title").html())+"”，"+"参赛"+wType+"《"+$.trim($this.find('h3').text())+"》。"+"链接："),
                   openurl="http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?";
               var aLink = openurl+"url=https:"+url+"&summary="+desc+"&pics="+pSrc+"&title="+t;
               window.open(aLink,'_blank');
               return false;
           })
       },
       mYShareWeiXin:function(){
           var t = this;
           $(".works_mine_lists_shareWeiXin").mouseenter(function(){
               var erweima=$(this).children(".d2_saomiao");
               var $this = $(this).parents('.works_mine_lists_piece');
               var url = "https:"+$this.find("h3").parent("a").attr("href").replace("www.allinmd.cn/html",'m.allinmd.cn/html/m');
               erweima.show();
               if(erweima.find("canvas").length==0){// 是否支持canvas
                   if(!!document.createElement('canvas').getContext){
                       erweima.show().qrcode({
                           text : url
                       });
                       erweima.find("canvas").css({"position":"absolute","width":"148px","height":"156px","left":"20px","top":"20px"});
                   }else{
                       erweima.show().find(".qrcodeTable").qrcode({
                           render	: "table",
                           text : url
                       });
                       erweima.find("canvas").css({"position":"absolute","width":"148px","height":"156px","left":"20px","top":"20px"});
                   }
               }

           })
           $(".works_mine_lists_shareWeiXin").mouseleave(function(){
               $(this).children(".d2_saomiao").hide()
           })
       },
       snsShare: function() {//微信/空间/微博分享功能
           var activityId = $('#activityId').val(),// "1480647316221";
               t = this;
           module.share({
               container:$(".ev-shareContainer"),//存放分享组件的父级
               type:2,//默认为1  1：社交分享  2：页面左下角全站分享,3.终端页面的固定分享,4.终端评论区分享，消息的评论我的，只分享到唯医朋友圈
               url:window.location.href,//分享链接， 默认取当前页链接
               hiddenEl:$('#shareLoc'),
               h5Url:'https://m.allinmd.cn/html/m/activity/'+activityId+'/activity_index.html',//微信分享生成二维码的链接
               shareTrend:0,//0:不需要站内动态分享  1：需要站内动态分享
               trendUrl:'',//分享到站内动态的接口
               data:{},//分享到站内动态的接口参数
               callback:function(){},//分享到站内动态成功后回调函数
               shareQQSuc:function(){},//分享qq成功
               shareQzoneSuc:function(){},//分享qzone成功
               shareSinaSuc:function(){},//分享sina成功
               triggerRequest:function(content){
                   $.ajax({
                       url: "/call/cms/activity/getById/",
                       data: { activityId: activityId},
                       dataType: 'json',
                       async: false,
                       success: function(data) {
                           if (data && data.responseObject) {
                               shareContent = data.responseObject.shareContent;
                               shareTitle = data.responseObject.shareTitle+"--"+shareContent+"--"+($(".textColorYesOne").length>0?$(".textColorYesOne").text():$(".textColorYesTwo").text())+"点击查看";
                               content.sinaTitle = shareTitle,//新浪分享标题
                               content.qqTitle = shareTitle;
                               content.qqZoneTitle = shareTitle;
                               content.pic = data.responseObject.sharePicUrl;
                               content.qqSummary = data.responseObject.shareContent;
                               content.qqZoneSummary = data.responseObject.shareContent;
                           }
                       }
                   });
               }
           });
       },
       buildArguments: function(obj) {//定位函数
           var t = this;
           var a = location.search,
               params = comm.getpara("#");
           if(params.navText){
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
           }else{
               t.loadFirst();
           }
       },
       newUpDow: function () { //    专业术士新闻点击展开收起
           var heigh = $(".term_left").height()>$(".term_right").height()?$(".term_left").height():$(".term_right").height();
           var flag = 0;
           $('.gd_btn').off("click").on("click", function () {
               if(flag==0){
                   flag = 1;
                   $(this).children("i").css('background','url(//img10.allinmd.cn/v3/avtivity/up.png) no-repeat left center');
                   $(this).children("i").css('background-size','contain');
                   $(this).children("span").text('收起全部');
                   $('.term').css('height',heigh+'px');
               }else{
                   flag = 0;
                   $(this).children("i").css('background','url(//img10.allinmd.cn/v3/avtivity/down.png) no-repeat left center');
                   $(this).children("i").css('background-size','contain');
                   $(this).children("span").text('展示更多');
                   $('.term').css('height','560px');
               }
           });
       },
       isExpert: function () {
           var t = this;
           var params = {paramJson: $.toJSON({customerId:$("#sesCustomerId").val(),activityId:$('#activityId').val()})}
           var callback = function(data){
               var isExpert = data.responseObject.responseData.isExpert;
               $("#activityId").attr("expert",isExpert);
               $("#activityId").attr("recordId",data.responseObject.responseData.recordId);
           }
           $.ajax({
               url : t.config.isExpert,
               type : "POST",
               data :  params,
               async : false,
               time : 5000,
               success : function(data){
                   comm.LightBox.hideloading();
                   callback(data);
               },
               error : function(){
                   comm.LightBox.hideloading();
               }
           });
       },
       isReviewBegin: function () {
           if(!$('#activityId').attr('isResultShowBegin')) {		//如果不是结果公示过程，则查看上传是否截止
               $.ajax({//评分是否开始
                   type:'post',
                   url:PC_CALL+"activity/event/isReviewBegin/",
                   data:{paramJson:$.toJSON({ activityId:$("#activityId").val()})},
                   dataType:"json",
                   async:false,
                   success:function(data){
                       if (data && data.responseObject.responseData) {
                           var isReviewBegin = data.responseObject.responseData.expireStatus;
                           $('#activityId').attr('isReviewBegin',isReviewBegin);//1是已经开始了,-1没开始
                       }
                   }
               })
           }
       },
       scoreAlert: function () {//评分弹窗提醒
           var t = this;
           if($("#sesCustomerId").val()&&$("#activityId").attr("expert")==1&&$("#activityId").attr("isReviewBegin")==1){//时专家但是还是在海选报名阶段则不显示评分弹层
               var url=document.URL;
               var alertPop={};
               var str,item;
               if(url.lastIndexOf("?")>0){
                   str=url.substring(url.lastIndexOf("?")+1,url.length);
                   var arr=str.split("#");
                   item =  arr[0].split("=");
                   alertPop[item[0]] = decodeURI(item[1]);
               }
               if((!alertPop.isformPer&&alertPop.isformPer!=1)&&$(".bgColorYesOne").text()!="待评作品"){//表示不是从个人中心页跳转过来的,并且页面不是在待评作品上
                   if($.cookie("newIsClose") != 'yes'){//表示没有关闭弹层的提示
                       $.ajax({
                           url: t.config.reviewCount,
                           type:"POST",
                           data:{paramJson: $.toJSON({
                               customerId:$("#sesCustomerId").val(),
                               activityId:$("#activityId").val(),
                               firstResult:0,
                               maxResult:100,
                               refType: 0,
                               resourceStatus:1
                           })},
                           dataType:"json",
                           success:function(data){
                               if(data&&data.responseObject&&data.responseObject.resourceCount>0){
                                   var items = data.responseObject.resourceCount;
                                   $(".score_reminder_mask").remove();
                                   $(".al-mainInner").append('<div class="score_reminder_mask"><section class="score_reminder"><h3>'+$("title").text()+'</h3><p>亲爱的评委，您尚有'+items+'个作品待审核，请尽快完成~</p><div class="btn_box"><button class="btn_cancel">稍后再说</button><button class="btn_ensure">前往打分</button></div></section></div>');
                                   $("body").css("overflow","hidden");
                                   $(".btn_cancel").on("click",function(){
                                       $(".score_reminder_mask").remove();
                                       $("body").css("overflow","auto");
                                   });
                                   $(".btn_ensure").off("click").on("click",function(){
                                       $.each($(".spTemp_total_nav_lists li span"),function(i,el){//将打分项进行追加
                                           if($(el).text()=="待评作品"){
                                               $(this).click();
                                               $(".score_reminder_mask").remove();
                                               $("body").css("overflow","auto");
                                           }
                                       });
                                   })
                               }
                               $.cookie("newIsClose",'yes',{ expires:365});      //一天
                           }
                       });
                   }
               }
           }
       },
       userList: function () {
           var t = this;
           $(".userListCont li:first-child").show().siblings().hide();
           $(".openMore").toggle(function () {
               $(this).find("span").text("收起");
               $(this).addClass("pickUp");
               $(".userListCont li").show();
           }, function () {
               $(this).find("span").text("展开更多");
               $(this).removeClass("pickUp");
               $(".userListCont li:first-child").show().siblings().hide();
           });
       }
   };
    specialTemplate.init();
});
/**
*专题活动公共数据请求  commTemplate.ajax.sync();
 */
var commTemplate={};
commTemplate.ajax = {
    //进行调取mylist中的方法进行获取列表接口数据
    //sync : function(tparam){ //同步获取数据
    //    var dataJson = {};
    //    var params={paramJson:$.toJSON(tparam)};
    //    comm.LightBox.showloading();
    //    $.ajax({
    //        url : PC_CALL+"/call/activity/menu/layout/module/getResourceMapList/",
    //        type : "POST",
    //        data :  params,
    //        time : 5000,
    //        async:false,
    //        success : function(data){
    //            comm.LightBox.hideloading();
    //            dataJson = data;
    //        },
    //        error : function(){
    //            comm.LightBox.hideloading();
    //        }
    //    });
    //    return dataJson;
    //},
    //syncpage : function(tparam){ //同步获取分页数据
    //    var dataJson = {};
    //      var param={
    //           columnId:12,
    //           page:1,
    //           maxResult:2
    //     };
    //    var params={paramJson:$.toJSON(param)};
    //    comm.LightBox.showloading();
    //    $.ajax({
    //        url : PC_CALL+"/call/col/column/recommend/getResourceMapList/",
    //        type : "POST",
    //        data :  params,
    //        time : 5000,
    //        async:false,
    //        success : function(data){
    //            comm.LightBox.hideloading();
    //            dataJson = data;
    //        },
    //        error : function(){
    //            comm.LightBox.hideloading();
    //        }
    //    });
    //    return dataJson;
    //},
    async : function(params,callback){ // 异步获取数据
        comm.LightBox.showloading();
        $.ajax({
            url : PC_CALL+"cms/activity/getAreaList/",
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
            url : PC_CALL+"/call/col/question/answer/create/",
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
    },
    actAsync: function (params,callback) {
        $.ajax({
            url : PC_CALL+"customer/trends/json_list/",
            type : "POST",
            data :  params,
            time : 5000,
            success : function(data){
                comm.LightBox.hideloading();
                callback(data)
            },
            error : function(){
                comm.LightBox.hideloading();
            }
        });
    }
};