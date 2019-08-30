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
    //Log.createBrowse(157,'UGC直播-我的预约');
    var ctrl ={
        path:{
            myLive:M_CALL+"broadcast/home/getMapList/"
        },
        init:function(){
            this.whetherLogin();
            this.backBtn();
            this.callApp();
        },
        callApp:function(){
            $('body').on('click','.ev_app',function(){
                var cid=TempCache.getItem("userId");
                var amChannel = comm.getpara()._amChannel;
                var callAppOptions = {
                    ios: "allinmdios://app.allinmd.cn/applinks.html?scene=publishScene&type=4&userId=" + cid +(amChannel?"&_amChannel="+amChannel:''),
                    android: "allin://com.allin.social:75235?data={scene:11,userId:"+  cid +",type:51"+(amChannel?",_amChannel:"+amChannel:'')+ "}",
                    ios9: "http://app.allinmd.cn/applinks.html?scene=publishScene&type=4&userId=" + cid +(amChannel?"&_amChannel="+amChannel:''),
                    runAtOnce: false
                };
                comm.appWakeUp('confirm',callAppOptions)
            });
        },
        whetherLogin:function(){
            var t=this;
            var cid =TempCache.getItem('userId');
            var auth = TempCache.getItem('auth');
            var state;
            if(auth&&auth!=null){
                state = JSON.parse(auth).state;
            }
            if(cid&&state==2||state==7||state==8||state==9){
                t.getMyLive();
            }else{
                user.privExecute({
                    operateType: 'auth', //'login','auth','conference'
                    callback: function() {

                    }
                });
            }
        },
        backBtn:function(){
            $('.ev_backBtn').click(function(){
                comm.creatEvent({
                    triggerType:'全站功能按钮点击',
                    keyword:"返回",
                    actionId:41,
                    async:false
                });
                if(!comm.getpara().from){
                  g_sps.jump(null,'/pages/personal/personal_index.html');
                }else{
                  g_sps.jump(null,comm.getpara().from);
                }
            });
        },
        getMyLive:function(){
            var t=this;
            var param={
                sessionCustomerId:TempCache.getItem('userId'),
                visitSiteId:2,
                isHome:0,      //是否是首页（传0）（1-是，0-不是）
                isSubscribe:1, //是否是预约（传1）（1-是，0-不是）
                pageIndex:1,
                pageSize:20
            };
            $.ajax({
                url:t.path.myLive,
                data:{paramJson:$.toJSON(param)},
                type:'get',
                dataType:'json',
                success:function(d){
                    if(d&&d.responseObject&&d.responseObject.responseData&&!$.isEmptyObject(d.responseObject.responseData)){
                        var dataList = d.responseObject.responseData.data_list;
                        var html="";
                        if(dataList.length){
                            $.each(dataList,function(i,e){
                                html+= t.templateSmall({
                                    liveAttendeeJoinUrl: e.liveAttendeeJoinUrl,
                                    attUrl:e.attUrl,
                                    subtractionDate:e.subtractionDate,
                                    liveTitle:e.liveTitle,
                                    liveStartTime:e.liveStartTime,
                                    followNum:e.onlineNum,
                                    liveType:e.liveType,
                                    liveState:e.liveState,
                                    liveId:e.liveId
                                });
                            });
                            $('.ev_myOrder').html(html).show();
                            if(dataList.length<20) {
                                $('.ev_myOrder').attr("scrollPagination", "disabled");
                                $(t.noMoreDom()).insertAfter('.ev_myOrder');
                            }
                        }else{
                            $('.ev_myOrder').hide();
                            $('.al-noLoginTips').show();
                        }
                    }else{
                        $('.ev_myOrder').hide();
                        $('.al-noLoginTips').show();
                    }
                }
            })
        },
        getType:function(x){
            var type="";
            switch(x){//直播类型(1-手术直播，2-学术会议，3-产品推荐，4-器械操作，5-手术解说，6-病例讨论)
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
            return type;
        },
        getState:function(x){
            var tip='';
            switch(x){//直播状态( 1-预约，2-未开始,3-直播中，4-直播结束，5-完成)
                case 1:
                    tip='<i class="mark livingMark_order"></i>';break;
                case 2:
                    tip ='<i class="mark livingNoBegin"></i>';break;
                case 3:
                    tip='<i class="mark livingMark_living"></i>';break;
                case 4:
                case 5:
                    tip='<i class="mark livingMark_end"></i>';break;
            }
            return tip;
        },
        templateSmall:function(kv){
            var t=this;
            var html="";
            var type=t.getType(parseInt(kv.liveType));
            var tip=t.getState(parseInt(kv.liveState));
            var num = t.toWK(kv.followNum);
//liveAttendeeJoinUrl attUrl subtractionDate liveTitle liveStartTime onlineNum liveType liveState
            html  =   '<section class="al-myLivingItem">'+
                '    <a href="'+(kv.liveState==3?"/pages/live/living_watch.html?liveId="+kv.liveId:"/pages/live/livingDetails.html?liveId="+kv.liveId)+'">'+
                '        <figure class="al-myLivingItemImg">'+
                '            <img src="'+(kv.attUrl!=""?kv.attUrl:"//img50.allinmd.cn/pages/living/NoCover_ListSmall.png")+'" alt="">'+
                tip+
                '                <p class="al-myLivingItemBaseMsg">'+
                //'                    <span>'+kv.subtractionDate+'</span>'+
                '                    <span>'+type+'</span>'+
                '                </p>'+
                '        </figure>'+
                '        <figcaption>'+
                '            <h2>'+kv.liveTitle+'</h2>'+
                '            <p>'+
                '                <span class="time">'+kv.liveStartTime+'</span>'+
                '                <span class="watcherNum icon-livingWatcherNum">'+num+'</span>'+
                '            </p>'+
                '        </figcaption>'+
                '    </a>'+
                '</section>';
            return html;
        },
        noMoreDom:function(){
            return "<section style='padding:20px;text-align: center;color:#515c74;'>~~没有更多了~~</section>";
        },
        toWK:function(x){
            if (isNaN(parseInt(x))) return 0;

            if (parseInt(x) < 10000 && parseInt(x) > 999) {
                return Math.floor(parseInt(x) / 1000) + "K+";
            } else if (parseInt(x) > 9999) {
                return Math.floor(parseInt(x) / 10000) + "万+";
            } else {
                return x;
            }
        },
        scrollPage:function(){
            var t = this;
            var num=2;
            var param={
                sessionCustomerId:TempCache.getItem('userId'),
                visitSiteId:2,
                isHome:0,      //是否是首页（传0）（1-是，0-不是）
                isSubscribe:1, //是否是预约（传1）（1-是，0-不是）
                //pageIndex:1,
                pageSize:20
            };
            $(".ev_myOrder").off("scroll").scrollPagination({
                'contentPage': t.path.allLive,
                'contentData': $.extend(param, {
                    pageIndex: function () {
                        return num++;
                    }
                }),
                'scrollTarget': $(window),
                'heightOffset': 0,
                'delaytime': 0,
                'type': "POST",
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
                        $('.ev_myOrder').attr("scrollPagination", "disabled").append(t.noMoreDom());
                        return false;
                    } else {
                        if ($.isEmptyObject(data.responseObject.responseData) || (data.responseObject.responseData.data_list && data.responseObject.responseData.data_list.length == 0)) {
                            $('.ev_myOrder').attr("scrollPagination", "disabled").append(t.noMoreDom());
                            return false;
                        } else {
                            if(data&&data.responseObject&&data.responseObject.responseData&&!$.isEmptyObject(data.responseObject.responseData)){
                                var dataList = d.responseObject.responseData.data_list;
                                var html="";
                                if(dataList.length){
                                    $.each(dataList,function(i,e){
                                        html+= t.templateSmall({
                                            liveAttendeeJoinUrl: e.liveAttendeeJoinUrl,
                                            attUrl:e.attUrl,
                                            subtractionDate:e.subtractionDate,
                                            liveTitle:e.liveTitle,
                                            liveStartTime:e.liveStartTime,
                                            followNum:e.onlineNum,
                                            liveType:e.liveType,
                                            liveState:e.liveState,
                                            liveId:e.liveId
                                        });
                                    });
                                    $('.ev_myOrder').append(html);
                                }
                                if(dataList.length<20){
                                    $('.ev_myOrder').attr("scrollPagination", "disabled").append(t.noMoreDom());
                                }

                            }
                        }
                    }
                }
            });

        }
    };
    ctrl.init();
});