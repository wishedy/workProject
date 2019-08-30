/**
 * 我关注的会议
 * Created by zhenghui on 2017/8/2.
 */

$(function(){
    var channelFollow={
        path:{
            getConferenceNum:PC_CALL+'conference/index/getConferenceNum/',//会议数量
            getMapList:PC_CALL+'conference/index/getMapListV4/'//内容列表
        },
        config:{
            holdedConfNum:0,
            unholdedConfNum:0,
            firstData:[],
            secondData:[]
        },
        //页面交互入口
        init:function(){
            var t=this;
            if($('#sesCustomerId').length>0){
                t.conferenceNum();
            }else {
                $('.ev-meetingFellowList ul,.ev-meetingFellowList .titleTab').hide();
                $('.ev-meetingFellowNone').show();
            }
            scene.TopHeadLoginCallback=function(){
                location.reload();
            }
        },
        //获取会议数量
        conferenceNum:function(){
            var t=this;
            var paramData={
               sessionCustomerId:$('#sesCustomerId').val()||""
            };
            paramData={
                paramJson: $.toJSON(paramData)
            };
            t.ajax({
                url: t.path.getConferenceNum,
                data:paramData,
                type:"post",
                callback:function(req){
                    if(req&&req.responseObject&&req.responseObject.responseData&&req.responseObject.responseData.data_list&&req.responseObject.responseData.data_list.length>0){
                        var dataList=req.responseObject.responseData.data_list,
                            holdedConfNum=dataList[0].holdedConfNum,
                            unholdedConfNum=dataList[0].unholdedConfNum,
                            option={};
                        channelFollow.config.holdedConfNum=dataList[0].holdedConfNum;
                        channelFollow.config.unholdedConfNum=dataList[0].unholdedConfNum;
                        if(holdedConfNum=='0'&&unholdedConfNum=='0'){
                            //未进行无数据，已进行无数据
                            $('.ev-meetingFellowList .titleTab').hide();
                            $('.ev-meetingFellowNone').show();
                        }else{
                            $('.ev-meetingFellowNone').hide();
                            $('.ev-meetingFellowList .titleTab').show();
                            if(holdedConfNum=='0'&&unholdedConfNum!='0'){
                                //未进行有数据，已进行无数据
                                $('.ev-firstTab,.ev-firstCont').hide();
                                $('.ev-secondTab span').text(unholdedConfNum);
                                option={
                                    runState:0
                                };
                                t.dataReqInfor(1,option);//获取初始数据(未进行)
                                $('.ev-secondCont').show();
                            }else if(holdedConfNum!='0'&&unholdedConfNum=='0'){
                                //已进行有数据，未进行无数据
                                $('.ev-firstTab span').text(holdedConfNum);
                                $('.ev-secondTab,.ev-secondCont').hide();
                                option={
                                    runState:1
                                };
                                t.dataReqInfor(1,option);//获取初始数据（已进行）
                                $('.ev-firstCont').show();
                            }else {
                                //已进行有数据，未进行有数据
                                $('.ev-firstTab span').text(holdedConfNum);
                                $('.ev-secondTab span').text(unholdedConfNum);
                                $('.ev-secondCont').hide();
                                option={
                                    runState:1
                                };
                                t.dataReqInfor(1,option);//获取初始数据（已进行）
                                $('.ev-firstCont').show();
                                t.tabToggle();//tab切换
                            }
                        }
                    }else {
                        $('.ev-firstCont,.ev-secondCont,.ev-firstPager,.ev-secondPager,.ev-meetingFellowList .titleTab').hide();
                        $('.ev-meetingFellowNone').show();
                    }
                }
            })
        },
        //tab切换
        tabToggle:function(){
            var t=this;
            $('.ev-firstTab,.ev-secondTab').off('click').on('click',function(e){
                $('.ev-firstTab,.ev-secondTab').removeClass('active');
                $(this).toggleClass('active');
                var option={};
                if($(e.target).hasClass('ev-firstTab')){
                    $('.ev-firstCont,.ev-firstPager').show();
                    $('.ev-secondCont,.ev-secondPager').hide();
                    option={
                        runState:1
                    };
                //    已进行事件埋点
                    comm.creatEvent({
                        triggerName:'我关注的会议tab',
                        triggerType:"会议tab",
                        keyword:'已进行',
                        actionId:11012
                    });
                }else {
                    $('.ev-firstCont,.ev-firstPager').hide();
                    $('.ev-secondCont,.ev-secondPager').show();
                    option={
                        runState:0
                    };
                    if($('.ev-secondCont li').length==0){
                        t.dataReqInfor(1,option);//获取初始数据（已进行）
                    }
                //    未进行事件埋点
                    comm.creatEvent({
                        triggerName:'我关注的会议tab',
                        triggerType:"会议tab",
                        keyword:'未进行',
                        actionId:11012
                    });
                }

            });
        },
        //获取已进行数据
        dataReqInfor:function(pageNumber,option){
            var t=this;
            if(option.runState=='1'){
                //已进行
                for(var i= 0,max=t.config.firstData.length;i<max;i++){
                    if(t.config.firstData[i].pageIndex==pageNumber){
                        var data=t.config.firstData[i].data
                        t.firstPage(data,pageNumber);
                        return false;
                    }
                }
            }else {
                //未进行
                for(var i= 0,max=t.config.secondData.length;i<max;i++){
                    if(t.config.secondData[i].pageIndex==pageNumber){
                        var data=t.config.secondData[i].data
                        t.secondPage(data,pageNumber);
                        return false;
                    }
                }
            }

            var paramData={
                scene:1,//场景（0-会议频道页，1-我关注的会议，2-会议预告）
                sessionCustomerId:$('#sesCustomerId').val()||"",
                runState:option.runState,//会议状态（0-未进行，1-已进行）
                pageIndex:pageNumber,
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
                        var dataList=req.responseObject.responseData.data_list;
                        if(option.runState=='1'){
                            //已进行
                            t.config.firstData.push({
                                data:dataList,
                                pageIndex:pageNumber
                            })
                            t.firstPage(dataList,pageNumber);
                        }else {
                            //未进行
                            t.config.secondData.push({
                                data:dataList,
                                pageIndex:pageNumber
                            })
                            t.secondPage(dataList,pageNumber);
                        }
                    }else {
                        $('.ev-firstCont,.ev-secondCont,.ev-firstPager,.ev-secondPager,.ev-meetingFellowList .titleTab').hide();
                        $('.ev-meetingFellowNone').show();
                    }
                }
            })
        },
        firstPage:function (data,pageNumber){
            var t=this;
            var listStr='';
            //列表数据
            for(var i= 0,max=data.length;i<max;i++){
                listStr+='<li>'+
                    '  <a href="'+data[i].conUrl+'">'+
                        (data[i].conTag?'<span>'+data[i].conTag+'</span>':'')+data[i].conName+
                    '</a>'+
                    '  <article class="">'+
                    (data[i].startTime&&data[i].endTime?'<span class="meetingTime">'+comm.date.dateLocalJoint(data[i].startTime,data[i].endTime,'/','-')+'</span>':'')+
                           (data[i].conAddr?'<span class="meetingAddress">'+data[i].conAddr+'</span>':'')+
                           (data[i].isLive=='1'? '<span class="meetingLiving"><i></i>直播中</span>':'')+
                    '   </article>'+
                    '</li>';
            }
            $('.ev-meetingFellowNone,.ev-secondCont,.ev-secondPager').hide();
            $('.ev-firstCont,.ev-firstPager').show();
            $('.ev-firstCont').html(listStr);
            if(Math.ceil(channelFollow.config.holdedConfNum/20)>1){
                $('.ev-firstPager .pager').pager({
                    pagenumber:pageNumber,//channelMeeting.config.first.pageIndex,
                    pagecount: Math.ceil(channelFollow.config.holdedConfNum/20),
                    buttonClickCallback: t.firstPageClick
                });
            }
        },
        //未进行的dom
        secondPage:function (data,pageNumber){
            var t=this;
            var listStr='';
            //列表数据
            //列表数据
            for(var i= 0,max=data.length;i<max;i++){
                listStr+='<li>'+
                    '  <a href="'+data[i].conUrl+'">'+
                          (data[i].conTag?'<span>'+data[i].conTag+'</span>':'')+data[i].conName+
                    '  </a>'+
                    '  <article class="">'+
                    (data[i].startTime&&data[i].endTime?'<span class="meetingTime">'+comm.date.dateLocalJoint(data[i].startTime,data[i].endTime,'/','-')+'</span>':'')+
                           (data[i].conAddr?'<span class="meetingAddress">'+data[i].conAddr+'</span>':'')+
                           (data[i].isLive=='1'? '<span class="meetingLiving"><i></i>直播中</span>':'')+
                    '   </article>'+
                    '</li>';
            }
            $('.ev-meetingFellowNone,.ev-firstCont,.ev-firstPager').hide();
            $('.ev-secondCont,.ev-secondPager').show();
            $('.ev-secondCont').html(listStr);
            if(Math.ceil(channelFollow.config.unholdedConfNum/20)>1){
                $('.ev-secondPager .pager').pager({
                    pagenumber: pageNumber,
                    pagecount: Math.ceil(channelFollow.config.unholdedConfNum/20),
                    buttonClickCallback: t.secondPageClick
                });
            }
        },
        //已进行的分页点击
        firstPageClick:function(pageNumber){
            var option={
                runState:1
            };
            channelFollow.dataReqInfor(pageNumber,option);
        },
        //未进行的分页点击
        secondPageClick:function(pageNumber){
            var option={
                runState:0
            };
            channelFollow.dataReqInfor(pageNumber,option);
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
                    option.callback(req);

                },
                error: function(xhr, type, error) {
                    comm.LightBox.hideloading();
                }
            });
        },


    };
    channelFollow.init();
});
