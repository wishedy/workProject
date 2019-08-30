/**
 * 会议预告
 * Created by zhenghui on 2017/8/2.
 */

$(function(){
    var channelTrailler={
        path:{
            createFollowResource:PC_CALL+'customer/follow_resource/createFollowResource/',//关注
            delete3:PC_CALL+"customer/follow_resource/delete3/",//取消关注
            getScreeningCondition:PC_CALL+'conference/index/getScreeningCondition/',//专业列表
            getMapList:PC_CALL+'conference/index/getMapListV4/',//内容列表
            getMapList3:PC_CALL+'comm/data/share/getMapList3/'//页面分享
        },
        config:{
            pageIndex:1
        },
        //页面交互入口
        init:function(){
            var t=this;
            t.condition(); //获取专业列表
            t.dataReqInfor(false,{});//获取初始数据
            t.selectLabel();//筛选条件
            t.PCshare();//分享
            //顶部导航浏览记录登录
            scene.TopHeadLoginCallback=function(){
                location.reload();
            };
        },
        //获取专业列表
        condition:function(){
            var t=this;
            if(comm.getpara().platId){
                $('.al_siteSwitch_popBox div').attr('on',false);
                $('#sesDepartment').val(comm.getpara().platId);
                if(comm.getpara().platId==2){
                    $('.ev_siteSwitchName').text('手外科');
                    $('.al_siteSwitch_handSurgery').attr('on',true);
                }else {
                    $('.ev_siteSwitchName').text('骨科');
                    $('.al_siteSwitch_orthopaedics').attr('on',true);
                }
            }
            var paramData={
                sessionCustomerId:$('#sesCustomerId').val()||1,
                platformId:$('#sesDepartment').val()||1
            };
            paramData={
                paramJson: $.toJSON(paramData)
            };
            t.ajax({
                url: t.path.getScreeningCondition,
                data:paramData,
                type:"post",
                callback:function(req){
                    if(comm.hasResponseData(req)){
                        var majorList=req.responseObject.responseData.majorList,
                            authMajorStr='';
                        authMajorStr+='<li data-id="" data-tagType="1">全部</li>';
                        //专业列表
                        for(var i= 0,max=majorList.length;i<max;i++){
                            authMajorStr+='<li data-id="'+majorList[i].tagId+'" data-tagType="'+majorList[i].tagType+'">'+majorList[i].tagName+'</li>';
                        }
                        $('.ev-major ul').html(authMajorStr);
                        $('#sesDepartment').val()=='2' ?  $('.ev-major ul').addClass('handSurgery') :$('.ev-major ul').removeClass('handSurgery');
                        t.selectLabel();//筛选条件
                    }
                }
            })
        },
        //获取初始数据
        dataReqInfor:function(isMore,option){
            var t=this,
                openTime='';
            //    获取URL参数
            openTime=comm.getpara().time ?  t.dataInfor().year+'-'+comm.getpara().time : t.dataInfor().year+'-'+(t.dataInfor().month>9 ? t.dataInfor().month: '0'+t.dataInfor().month);
            var paramData={
                scene:2,//场景（0-会议频道页，1-我关注的会议，2-会议预告）
                sessionCustomerId:$('#sesCustomerId').val()||"",
                subjectTeamId:option.subjectTeamId||'',//专业标签
                runState:option.runState||'',//会议状态（0-未进行，1-已进行）
                shootState:option.shootState||'',//拍摄状态（0-不拍摄，1-拍摄）
                openTime:option.openTime||openTime,//	时间筛选（多个时间以“_”分隔）
                pageIndex:channelTrailler.config.pageIndex,
                pageSize:20,
                platformId:$('#sesDepartment').val()||1
            };
            paramData={
                paramJson: $.toJSON(paramData)
            };
            t.ajax({
                url: t.path.getMapList,
                data:paramData,
                type:"post",
                callback:function(req){
                    if(req&&req.responseObject&&req.responseObject.responseData&&req.responseObject.responseData.data_list&&req.responseObject.responseData.data_list.length>0){
                        var dataList=req.responseObject.responseData.data_list,
                            total=req.responseObject.responseData.total,
                            listStr='';
                        //列表数据
                        for(var i= 0,max=dataList.length;i<max;i++){
                            listStr+=' <li data-conId="'+dataList[i].conId+'" data-conName="'+dataList[i].conName+'">'+
                                '<aside>'+
                                '<div class="listNameCont">'+
                                    '<a href="javascript:;">'+
                                        (dataList[i].conTag?'<span>'+dataList[i].conTag+'</span>':'')+dataList[i].conName+
                                    '</a>'+
                                '</div>'+
                                    (function(){
                                        var str='';
                                        if(dataList[i].shootState=='0'){
                                            if(dataList[i].followState=='0'&&dataList[i].runState=='0'){
                                                str+='<b class="ev-attention likeView" data-followNum="'+dataList[i].followNum+'"><span>想看</span></b><i>合作沟通中</i>';
                                            }else {
                                                str+='<b class="ev-attention likeViewNum" data-followNum="'+dataList[i].followNum+'"><span>'+dataList[i].followNum+'人想看</span></b><i>合作沟通中</i>';
                                            }
                                        }else {
                                            if(dataList[i].followState=='0'){
                                                str+='<b class="ev-attention attention ev-fellowed" data-followNum="'+dataList[i].followNum+'"><span>关注</span></b><i>唯医合作</i>';
                                            }else {
                                                str+='<b class="ev-attention fellowed ev-fellowed" data-followNum="'+dataList[i].followNum+'"><span>已关注</span></b><i>唯医合作</i>';
                                            }
                                        }
                                        return str;
                                    }())+
                                '</aside>'+
                                '<div class="meetingDescribe">'+dataList[i].conIntro+'</div>'+
                                '<article class="">'+
                                (dataList[i].startTime&&dataList[i].endTime?'<span class="meetingTime">'+comm.date.dateLocalJoint(dataList[i].startTime,dataList[i].endTime,'/','-')+'</span>':'')+
                                    (dataList[i].conAddr?'<span class="meetingAddress">'+dataList[i].conAddr+'</span>':'')+
                                '</article>'+
                            ' </li>';
                        }
                        $('.ev-screenNone').hide();
                        if(total<20 ||dataList.length<20){
                            $('.ev-meetingListMore').hide();
                        }else {
                            $('.ev-meetingListMore').show();
                        }
                        $('.ev-meetingTrailerList ul, .ev-results').show();
                        if(isMore){
                            $('.ev-meetingTrailerList ul').append(listStr);
                        }else {
                            $('.ev-results span').html(total);
                            $('.ev-meetingTrailerList ul').html(listStr);
                        }
                        t.moreReqInfor();//加载更多
                        t.fellowTipHide(isMore);//关注引导隐藏
                        t.attention();//点击关注或想看
                        $('.meetingDescribe').each(function(index,ele){
                            if($('.al-contentCollapse',$(ele)).length==0){
                                $(ele).expandShrink({len:84})
                            }
                        })
                    }else {
                        if(!isMore){
                            $('.ev-meetingTrailerList ul').hide();
                            $('.ev-screenNone').show();
                        }
                        $('.ev-meetingListMore').hide();
                        $('.ev-results').show().find('span').html('0');
                    }
                }
            })
        },
        //点击查看更多
        moreReqInfor:function(){
            var t=this;
            $('.ev-meetingListMore').off('click').on('click',function(){
                channelTrailler.config.pageIndex++;
                var option= t.activefind();
                t.dataReqInfor(true,option);
            });
        },
        //点击关注或想看
        attention:function(){
            var t=this;
            $('.ev-attention').off('click').on('click',function(){
                var $this=$(this),
                    sesAuth=$("#sesAuth").val();
                if(sesAuth=='2'||sesAuth=='7'||sesAuth=='8'||sesAuth=='9'){
                    t.fellowedAtten($this);
                }else {
                    user.login({
                        callback: function () {
                            location.reload();
                        },
                        scene: privilegeSceneConst.eSceneTypeAuth,
                    });
                }
            })
        },
        //点击已关注执行函数
        fellowedAtten:function(ele){
            var t=this,
                refId=ele.parents('li').attr('data-conId'),
                refName=ele.parents('li').attr('data-conName'),
                paramData={
                "refId":refId,
                "refName":refName,
                "customerId":$('#sesCustomerId').val()||"",
                "followType":3
            };
            paramData={
                paramJson: $.toJSON(paramData)
            };
            if(ele.hasClass('attention')||ele.hasClass('likeView')){
                    //   关注
                    comm.creatEvent({
                        triggerName:ele.hasClass('attention')?'关注':'想看',
                        triggerType:"关注",
                        keyword:'',
                        refId:refId,
                        refType:'会议',
                        actionId:ele.hasClass('attention')?11022:11023
                    });
                t.ajax({
                    url: t.path.createFollowResource,
                    data:paramData,
                    type:"post",
                    callback:function(req){
                        if(req.responseObject.responseStatus){
                            if(ele.hasClass('attention')){
                                ele.removeClass('attention');
                                ele.find('span').text('已关注');
                                ele.addClass('fellowed');
                            }else {
                                ele.removeClass('likeView');
                                ele.find('span').text((parseInt(ele.attr('data-followNum'),10)+1)+'人想看');
                                ele.addClass('likeViewNum');
                            }
                        }
                    }
                })
            }else if(ele.hasClass('fellowed')){
                t.ajax({
                    url: t.path.delete3,
                    data:paramData,
                    type:"post",
                    callback:function(req){
                        if(req.responseObject.responseStatus){
                                ele.removeClass('fellowed');
                                ele.find('span').text('关注');
                                ele.addClass('attention');
                        }
                    }
                })
            }
        },
        //选择筛选条件
        selectLabel:function(){
            var t=this,
                month='';
            month = comm.getpara().time ? comm.getpara().time : t.dataInfor().month;
            $('.ev-date span').text((month>9 ||month.length>1) ? month+'月': '0'+month+'月');
            if(comm.getpara().time&&parseInt(comm.getpara().time,10)!=parseInt(t.dataInfor().month,10)){
                $('.ev-meetingState').hide().attr('data-show',false);
            }else {
                $('.ev-meetingState').show().attr('data-show',true);
            }
            $('.ev-date ul li').each(function(index,ele){
                if(parseInt($(ele).text(),10)==month){
                    $(ele).addClass('active');
                }else {
                    $(ele).removeClass('active');
                }
            })
            $('.major').off('click').on('click',function(){
                if($(this).find('ul').is(':visible')){
                    $(this).find('ul').hide();
                }else{
                    $('.major ul').hide();
                    $(this).find('ul').show();
                }
            });
            $('.major ul li').off('click').on('click',function(){
                $(this).parents('.major').find('li').removeClass('active');
                $(this).addClass('active');
                $(this).parents('.major').find('span').text($(this).text());
                $(this).parents('.major').attr('data-id',$(this).attr('data-id'));
                if($(this).parents('.major').hasClass('ev-date')){
                    //选择月份
                    if(parseInt($(this).text(),10)!= t.dataInfor().month){
                        $('.ev-meetingState').hide().attr('data-show',false).attr('data-id','');
                        $('.ev-meetingState span').text('会议状态');
                        $('.ev-meetingState li').removeClass('active');
                    }else {
                        $('.ev-meetingState').show().attr('data-show',true);
                    }
                    var text=parseInt($(this).text(),10);
                    //月份事件埋点
                    comm.creatEvent({
                        triggerName:'会议预告月份tab',
                        triggerType:"会议tab",
                        keyword:text,
                        actionId:11013
                    });
                    t.PCshare();//分享
                }else if($(this).parents('.major').hasClass('ev-meetingState')){
                //    会议状态筛选项
                    var text=$(this).text();
                    comm.creatEvent({
                        triggerName:'会议状态筛选项',
                        triggerType:"筛选",
                        keyword:text,
                        actionId:11020
                    });
                }else if($(this).parents('.major').hasClass('ev-major')){
                    //    btn-筛选专业选择
                    var text=$(this).text();
                    comm.creatEvent({
                        triggerName:'btn-筛选专业选择',
                        triggerType:"筛选",
                        keyword:text,
                        actionId:11016
                    });
                    $('.ev-major li').addClass('handSurgeryli');
                    $(this).parents('.major').find('span').text(comm.getStrLen(text,6))

                }
                channelTrailler.config.pageIndex=1;
                var option= t.activefind();
                t.dataReqInfor(false,option);
            });
            $('.ev-onlyLive').off('click').on('click',function(){
                if($(this).find('i').hasClass('active')){
                    $(this).find('i').removeClass('active');
                }else {
                    $(this).find('i').addClass('active');
                }
                //   唯医录制
                comm.creatEvent({
                    triggerName:'唯医录制',
                    triggerType:"筛选",
                    keyword:'',
                    actionId:11021
                });
                // if($('.ev-screenNone').css('display')=='none'){
                    channelTrailler.config.pageIndex=1;
                    var option= t.activefind();
                    t.dataReqInfor(false,option);
                // }
            });
            $('body').off('click').on('click',function(e){
                if(!($(e.target).parents().hasClass('major')||$(e.target).hasClass('major'))){
                    $('.ev-major ul,.ev-date ul,.ev-meetingState ul').hide();
                }
            });
        },
        //查找筛选项
        activefind:function(){
            var t=this,
                marjorId=$('.ev-major').attr('data-id'),
                monthText=$('.ev-date span').text(),
                dateText= monthText=='全部' ? t.dataInfor().year : t.dataInfor().year+'-'+monthText.slice(0,monthText.length-1),
                stateId='',
                onlyLive=false;
            if($('.ev-meetingState').attr('data-show')=='true'){
                stateId=$('.ev-meetingState').attr('data-id');
            }else {
                stateId='';
            }
            if($('.ev-onlyLive i').hasClass('active')){
                onlyLive='1'
            }else {
                onlyLive=''
            }
            return {
                subjectTeamId:marjorId,
                openTime:dateText,
                runState:stateId,
                shootState:onlyLive
            }
        },
        //关注引导隐藏
        fellowTipHide:function(isMore){
            var t=this;
            //if(Date.parse(new Date())>Date.parse('2017/08/08')){
            if(Date.parse(new Date())>Date.UTC(2017,8,6)){
                $('.fellowTip').hide();
            }else{
                if(!isMore){
                    $('.ev-fellowed').eq(0).append('<div class="fellowTip">关注会议，获得会议最新动态。</div>');
                }
            }
            setTimeout(function(){
                $('.fellowTip').hide();
            },3000);
        },
        //分享
        PCshare:function(){
            var t=this,
                platformId=$('#sesDepartment').val()||1;
            var sinaTitle=""; var qqTitle=""; var qZoneTitle="";
            var openTime='';
            if((typeof t.activefind().openTime)=='string'){
                openTime=t.activefind().openTime.split('-')[1];
            }else {
                openTime=t.activefind().openTime;
            }
            module.share({
                container:$ ( ".ev-shareContainer" ),// 存放分享组件的父级
                type:2,// 默认为 1  1 ：社交分享  2 ：页面左下角全站分享
                url:'https://www.allinmd.cn/pages/channel/conference/meeting_trailer.html?time='+openTime+"&platId="+platformId,// 分享链接， 默认取当前页链接
                h5Url:'https://m.allinmd.cn/dist/channel/meeting_trailer.html?time='+ openTime+"&platId="+platformId,//h5页面的链接会生成微信二维码
                title:"",// 分享标题
                shareTrend:0,//0: 不需要站内动态分享  1 ：需要站内动态分享
                trendUrl:'',// 分享到站内动态的接口
                data:{},// 分享到站内动态的接口参数
                callback:function(){},// 分享到站内动态成功后回调函数
                shareSinaSuc:function(){
                    comm.shareLog({
                        shareType: "",
                        resourceId:"" ,
                        resourceType: "",
                        refId: "",
                        shareSence:2,
                        shareChannel:3,
                        shareContent:sinaTitle
                    });
                },
                shareQQSuc:function(){
                    comm.shareLog({
                        shareType: "",
                        resourceId:"" ,
                        resourceType: "",
                        refId: "",
                        shareSence:2,
                        shareChannel:2,
                        shareContent:qqTitle
                    });
                },
                shareQzoneSuc:function(){
                    comm.shareLog({
                        shareType: "",
                        resourceId:"" ,
                        resourceType: "",
                        refId: "",
                        shareSence:2,
                        shareChannel:1,
                        shareContent:qZoneTitle
                    });
                },
                triggerRequest:function(content){//事件点击
                    //获取分享话术
                    var paramData={
                        openTime: t.activefind().openTime,
                        platformId:platformId,
                        "sceneType":2,
                        "resourceType":3,
                        "visitSiteId":1
                    };
                    paramData={
                        paramJson: $.toJSON(paramData)
                    };
                    $.ajax({
                        url: t.path.getMapList3,
                        type: "post",
                        data: paramData,
                        dataType: 'json',
                        async:false,
                        success: function (d) {
                            if (d && d.responseObject.responseData && !$.isEmptyObject(d.responseObject.responseData) && d.responseObject.responseData.data_list.length) {
                                var item = d.responseObject.responseData.data_list[0];
                                content.pic = item.share_comm.shareImageUrl;
                                content.title=item.share_comm.shareTitle!=""?item.share_comm.shareTitle:document.title;
                                $.each(item.share_channel,function(i,el){
                                    if(el.shareChannel=='Sina'){
                                        sinaTitle=content.sinaTitle=el.shareDesc;
                                    }else if(el.shareChannel=="QQFriend"){
                                        qqTitle=content.qqTitle = el.shareTitle;
                                        content.qqSummary = el.shareDesc;
                                    }else if(el.shareChannel=="QZone"){
                                        qZoneTitle=content.qqZoneTitle=el.shareTitle;
                                        content.qqZoneSummary = el.shareDesc;
                                    }
                                });
                            }
                        }

                    });
                }
            });
        },
        //获取当前年月日
        dataInfor:function(){
            var date=new Date,
                year=date.getFullYear(),
                month=date.getMonth()+ 1,
                day=date.getDate();
            return {
                year:year,
                month:month,
                day:day
            }
        },
        //ajax请求
        ajax:function(option) {
            comm.LightBox.showloading();
            $.ajax({
                url: option.url,
                type: option.type,
                dataType: 'json',
                data: option.data,
                success: function(req) {
                    comm.LightBox.hideloading();
                    option.callback&&option.callback(req);

                },
                error: function(xhr, type, error) {
                    comm.LightBox.hideloading();
                }
            });
        }
    };
    channelTrailler.init();
});
