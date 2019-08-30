/**
 * @name:
 * @desc:
 * @example:
 * @depend:
 * @date: 2016/12/1
 * @author: sunhaibin
 */

$(function(){
    FastClick.attach(document.body);
    //Log.createBrowse(154,'UGC直播-预约直播详情');
   var ctrl={
       init:function(){
           this.getInfo();

           this.update();
           this.backBtn();
       },
       backBtn:function(){
           $('.ev_backBtn').click(function(){
               comm.creatEvent({
                   triggerType:'全站功能按钮点击',
                   keyword:comm.getpara().liveId,
                   actionId:41,
                   async:false
               });
               if(document.referrer==""){
                 g_sps.jump(null,'/');
               }else{
                 if(document.referrer.lastIndexOf("passport")>-1){
                     history.go(-3);
                 }else{
                   history.go(-1);
                 }
               }
           });
       },
       getInfo:function(){
           var t=this;
           var liveId = comm.getpara().liveId;
           var cid = TempCache.getItem('userId');
           if(liveId){
                var param={
                    sessionCustomerId:cid?cid:"",
                    visitSiteId:2,
                    liveId:liveId
                };
               $.ajax({
                   url:M_CALL+"broadcast/home/getMapById/",
                   data:{paramJson:$.toJSON(param)},
                   type:"get",
                   dataType:'json',
                   success:function(d){
                       if(d&&d.responseObject&&d.responseObject.responseData&&!$.isEmptyObject(d.responseObject.responseData)){
                           if(d.responseObject.responseData.data_list.length){
                               t.liveInfo(d.responseObject.responseData.data_list[0]);
                           }
                       }
                   }
               });
           }else{
               window.history.back();
           }
       },
       liveInfo:function(x){
           var t=this;
           //ev_liveLogo ev_startTime ev_liveTitle ev_vsLocalTime ev_type ev_notice
               var type="";
               switch(parseInt(x.liveType)){//直播类型(1-手术直播，2-学术会议，3-产品推荐，4-器械操作，5-手术解说，6-病例讨论)
                   case 1:
                       type="手术直播";break;
                   case 2:
                       type="学术会议";break;
                   case 3:
                       type="产品推荐";break;
                   case 4:
                       type="器械操作";break;
                   case 5:
                       type="手术解说";break;
                   case 6:
                       type="病例讨论";break;
                   case 7:
                       type="课程讲解";break;
                   case 8:
                       type="会议直播";break;
                   case 9:
                       type="学术讨论";break;
                   case 10:
                       type="其他";break;
               }

           if(x.attUrl!="")$('.ev_liveLogo').attr('src',x.attUrl);
           $('.ev_startTime').html(x.liveStartTime);
           $('.ev_liveTitle').html(x.liveTitle);

           $('.ev_type').html(type);
           $('.ev_notice').html(x.liveNotice);
           if(x.isOrder==1){
               $('.ev_btn').addClass('ordered').text('已预约');
           }
           if(x.liveState==1||x.liveState==2){
               t.cancelOrOrder();
               $('.ev_vsLocalTime').html(comm.date.vsLocalTime(x.liveStartTime)+"开始直播");
           }else if(x.liveState==3){
               $('.ev_vsLocalTime').html(comm.date.vsLocalTime(x.liveStartTime)+"开始直播");
           }else{
               $('.ev_vsLocalTime').html("直播已结束").css('color','#909090');
                $('.ev_btn').addClass('ordered').html('直播已结束').off('click');
           }
       },
       cancelOrOrder:function(){
           var cid = TempCache.getItem('userId');
           var state;
           var auth = TempCache.getItem('auth');
           if(auth){
               state = JSON.parse(auth).state;
           }
           var ajaxing =false;
           $('.ev_btn').click(function(e){
               var self = $(this);
                if($(this).hasClass('ordered')){
                    $(".al-bottomSelectorListMask").addClass("on");
                    $(".cancel").on("click", function() {
                        $(".al-bottomSelectorListMask").removeClass("on");
                    });

                    e.preventDefault();
                }else{
                    if(cid&&state==2||state==7||state==8||state==9){
                        if(ajaxing==false){
                            ajaxing =true;
                            $.ajax({
                                url:M_CALL+'broadcast/audience/create/',
                                data:{
                                    paramJson:$.toJSON({
                                        sessionCustomerId:cid,
                                        liveId:comm.getpara().liveId,
                                        liveUserRole:1,//直播用户角色(1-普通用;2-组织者;3-管理员)',
                                        state:0,//在线状态(0-预约房间，1-在房间内，2-离开房间)
                                        isSpeak:0,//是否禁言（0-否，1-是）
                                        isShield:0,//是否屏蔽（0-否，1-是）
                                        //openTime:"",
                                        siteId:2
                                    })
                                },
                                dataType:"json",
                                type:'post',
                                success:function(d){
                                    ajaxing =false;
                                    if(d&&d.responseObject&&d.responseObject.responseStatus){
                                        self.addClass('ordered').text('已预约');

                                    }
                                },
                                error:function(){
                                    ajaxing =false;
                                }
                            })
                        }

                    }else{
                        user.privExecute({
                            operateType: 'auth', //'login','auth','conference'
                            noNeedBack:true,
                            callback: function() {
                            }
                        });
                    }

                }
           });
       },
       update:function(){
           var ajaxing =false;
           var cid =TempCache.getItem('userId');
           $('.ev_cancelOrder').click(function(){
               if(ajaxing==false){
                   ajaxing =true;
                   $.ajax({
                       url:M_CALL+'broadcast/home/update/',
                       data:{
                           paramJson:$.toJSON({
                               sessionCustomerId:cid,
                               liveId:comm.getpara().liveId,
                               visitSiteId:2,
                               isCancel:0

                           })
                       },
                       dataType:"json",
                       type:'post',
                       success:function(d){
                           ajaxing =false;
                           if(d&&d.responseObject&&d.responseObject.responseStatus){
                               $('.ev_btn').removeClass('ordered').text('立即预约');
                               $(".al-bottomSelectorListMask").removeClass("on");
                           }
                       },
                       error:function(){
                           ajaxing =false;
                       }
                   })
               }
           });
       }
   };
    ctrl.init();
});