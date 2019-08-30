/**
 * @name:
 * @desc:   直播列表，登录加载我的预约，
 * @example:
 * @depend:
 * @date: 2016/12/1
 * @author: sunhaibin
 */

$(function(){
    FastClick.attach(document.body);
    //Log.createBrowse(156,'UGC直播-直播列表');
    var ctrl ={
        path:{
            allLive:M_CALL+"broadcast/home/getMapList/"
        },
        init:function(){
            this.getAllLive();
            this.callApp();
            this.digHole();
        },
        digHole:function(){
            $('.ev_digHole').click(function(){
                comm.creatEvent({
                    triggerType:'全站功能按钮点击',
                    keyword:'直播列表',
                    actionId:41
                });
            });
        },
        getAllLive:function(){
            var t=this;
            var cid =TempCache.getItem('userId');
            var param={
                visitSiteId:2,
                isHome:1,      //是否是首页（传0）（1-是，0-不是）
                sessionCustomerId:cid?cid:"",
                pageIndex:1,
                pageSize:20
            };
            $.ajax({
                url:t.path.allLive,
                data:{paramJson:$.toJSON(param)},
                type:'post',
                dataType:'json',
                success:function(d){
                    if(d&&d.responseObject&&d.responseObject.responseData&&!$.isEmptyObject(d.responseObject.responseData)){
                        var dataList = d.responseObject.responseData.data_list;
                        var orderList = d.responseObject.responseData.order_list;
                        var htmlAll="";
                        if(dataList&&dataList.length){
                            $.each(dataList,function(i,e){
                                htmlAll+= t.templateBig({
                                    liveAttendeeJoinUrl: e.liveAttendeeJoinUrl,
                                    attUrl:e.attUrl,
                                    subtractionDate:e.subtractionDate,
                                    liveTitle:e.liveTitle,
                                    liveStartTime:e.liveStartTime,
                                    onlineNum:e.onlineNum,
                                    followNum:e.followNum,
                                    liveType:e.liveType,
                                    liveState:e.liveState,
                                    liveId:e.liveId,
                                    isOrder:e.isOrder,
                                    authName:e.authInfo.authName,
                                    customerId:e.authInfo.authCustomerId,
                                    logoUrl:e.authInfo.logoUrl
                                });
                            });
                            $('.ev_allLive').html(htmlAll);
                            $('[data-livestate]').each(function(){
                                var item = $(this);
                                var state =parseInt(item.attr("data-livestate"),10) ;
                                if(state===4||state===5){
                                    item.attr({"href":"javascript:;"});
                                    item.off("touchstart").on("touchstart",function(){
                                        popup('直播已结束');
                                    })
                                }
                            });
                            if(dataList.length<20){
                                $('.ev_allLive').attr('scrollPagination','disabled').append(t.noMoreDom());
                            }
                            t.scrollPage();
                        }

                        var htmlOrder="";
                        if(orderList&&orderList.length){
                            $.each(orderList.slice(0,4),function(i,e){
                                htmlOrder+= t.templateSmall({
                                    liveAttendeeJoinUrl: e.liveAttendeeJoinUrl,
                                    attUrl:e.attUrl,
                                    subtractionDate:e.subtractionDate,
                                    liveTitle:comm.getStrLen(e.liveTitle,20),
                                    liveStartTime:e.liveStartTime,
                                    onlineNum:e.onlineNum,
                                    followNum:e.followNum,
                                    liveType:e.liveType,
                                    liveState:e.liveState,
                                    liveId:e.liveId,
                                    authName:e.authInfo.authName
                                });
                            });
                            $('.ev_MyLive').html(htmlOrder);
                            $('.ev_MyLiveBox').show();
                        }
                        if(orderList&&orderList.length>4){
                            $('.al-checkMore').css('display','block');
                        }

                        if(!htmlAll){
                            $('.al-myLivingContent').hide();
                            $('.al-noLoginTips').show();
                        }

                    }else{
                       $('.al-myLivingContent').hide();
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
            var _num = (kv.liveState==4||kv.liveState==5)?kv.followNum:kv.onlineNum;
            var num = t.toWK(_num);
            html  =   '<section class="al-myLivingItem">'+
                      '    <a href="'+(kv.liveState==3?"/pages/live/living_watch.html?liveId="+kv.liveId:"/pages/live/livingDetails.html?liveId="+kv.liveId)+'">'+ //liveAttendeeJoinUrl attUrl subtractionDate liveTitle liveStartTime onlineNum liveType liveState
                      '        <figure class="al-myLivingItemImg">'+
                      '            <img src="'+(kv.attUrl!=""?kv.attUrl:"//img50.allinmd.cn/pages/living/NoCover_ListSmall.png")+'" alt="">'+
                                        tip+
                      '                <p class="al-myLivingItemBaseMsg">'+
                      '                    <span>'+kv.liveStartTime+'</span>'+
                      '                    <span>'+type+'</span>'+
                      '                </p>'+
                      '        </figure>'+
                      '        <figcaption>'+
                      '            <h2>'+kv.liveTitle+'</h2>'+
                      '            <p>'+
                      '                <span class="time">'+kv.authName+'</span>'+
                      '                <span class="watcherNum icon-livingWatcherNum">'+num+'</span>'+
                      '            </p>'+
                      '        </figcaption>'+
                      '    </a>'+
                      '</section>';
            return html;
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
        templateBig:function(kv){
            var t=this;
            //console.log(kv);
            var html="";
            var type=t.getType(parseInt(kv.liveType));
            var tip=t.getState(parseInt(kv.liveState));
            var _num = (kv.liveState==4||kv.liveState==5)?kv.followNum:kv.onlineNum;
           var num = t.toWK(_num);
            html  =
              '  <section class="al-contentPartModule">'+
              '      <article class="al-contentWatcher">'+
              '          <figure class="al-contentWatcherPic">'+
              '<a href="/dist/personal/others_index.html?cid='+kv.customerId+'">' +
              '              <img src="'+kv.logoUrl+'" alt="">'+

              '</a>'+
              '              </figure>'+
              '      <span class="al-contentWatcherName">'+
              '<a href="/dist/personal/others_index.html?cid='+kv.customerId+'">' +
                        kv.authName+
                  '</a>'+
              '         <span class="watcherNum icon-livingWatcherNum">'+num+'</span>'+
              '      </span>'+
              '      </article>'+
              '      <figure class="al-contentSeminarImg">'+
              '          <a style="position:relative;" href="'+(kv.liveState==3?"/pages/live/living_watch.html?liveId="+kv.liveId:"/pages/live/livingDetails.html?liveId="+kv.liveId)+'" data-liveState="'+kv.liveState+'">'+
              '              <img src="'+(kv.attUrl!=""?kv.attUrl:"//img50.allinmd.cn/pages/living/NoCover_ListBig.png")+'" alt="">'+
              tip+
              '              <span class="al-livingClass">'+type+'</span>'+
              '          </a>'+
              '      </figure>'+
              '      <section class="al-contentBottomPart">'+
              '          <article class="al-contentText">'+
              '              <a href="'+(kv.liveState==3?"/pages/live/living_watch.html?liveId="+kv.liveId:"/pages/live/livingDetails.html?liveId="+kv.liveId)+'" class="al-contentTitle">'+kv.liveTitle+'</a>'+
              '          </article>'+
              ((kv.liveState==2||kv.liveState==1)?('<figure class="al-contentSeminarJoin"><a href="/pages/live/livingDetails.html?liveId='+kv.liveId+'" class="'+(kv.isOrder==1?"btn-done":"btn-primary")+'" style="display:inline-block;">'+(kv.isOrder==1?"已预约":"预约")+'</a></figure>'):"")+
              '      </section>'+
              '  </section>';
            return html;
        },
        noMoreDom:function(){
            return "<section style='padding:0.3rem;text-align: center;color:#515c74;font-size:0.3rem;'>~~没有更多了~~</section>";
        },
        scrollPage:function(){
            var t = this;
            var num=2;
            var cid=TempCache.getItem('userId');
            var param={
                visitSiteId:2,
                isHome:1,      //是否是首页（传0）（1-是，0-不是）
                sessionCustomerId:cid?cid:"",
                //pageIndex:1,
                pageSize:20
            };
            $('.ev_allLive').off("scroll").scrollPagination({
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
                        $('.ev_allLive').attr("scrollPagination", "disabled").append(t.noMoreDom());
                        return false;
                    } else {
                        if ($.isEmptyObject(data.responseObject.responseData) || (data.responseObject.responseData.data_list && data.responseObject.responseData.data_list.length == 0)) {
                            $('.ev_allLive').attr("scrollPagination", "disabled").append(t.noMoreDom());
                            return false;
                        } else {
                            if(data&&data.responseObject&&data.responseObject.responseData&&!$.isEmptyObject(data.responseObject.responseData)){
                                var dataList = data.responseObject.responseData.data_list;
                                var html="";
                                if(dataList.length){
                                    $.each(dataList,function(i,e){
                                        html+= t.templateBig({
                                            liveAttendeeJoinUrl: e.liveAttendeeJoinUrl,
                                            attUrl:e.attUrl,
                                            subtractionDate:e.subtractionDate,
                                            liveTitle:e.liveTitle,
                                            liveStartTime:e.liveStartTime,
                                            onlineNum:e.onlineNum,
                                            followNum:e.followNum,
                                            liveType:e.liveType,
                                            liveState:e.liveState,
                                            liveId:e.liveId,
                                            isOrder:e.isOrder,
                                            authName:e.authInfo.authName,
                                            customerId:e.authInfo.authCustomerId,
                                            logoUrl:e.authInfo.logoUrl
                                        });
                                    });
                                    $('.ev_allLive').append(html);
                                }
                                if(dataList.length<20){
                                    $('.ev_allLive').attr("scrollPagination", "disabled").append(t.noMoreDom());
                                }

                            }
                        }
                    }
                }
            });

        },
        callApp:function(){
            $('.ev_app').on("click", function() {
                var cid=TempCache.getItem("userId");
                var amChannel = comm.getpara()._amChannel;
                var callAppOptions = {
                    ios: "allinmdios://app.allinmd.cn/applinks.html?scene=publishScene&type=4&userId=" + cid + (amChannel?"&_amChannel="+amChannel:''),
                    android: "allin://com.allin.social:75235?data={scene:11,userId:"+  cid +",type:51"+ (amChannel?",_amChannel:"+amChannel:'')+ "}",
                    ios9: "http://app.allinmd.cn/applinks.html?scene=publishScene&type=4&userId=" + cid+ (amChannel?"&_amChannel="+amChannel:''),
                    runAtOnce: false
                };
                comm.appWakeUp('confirm',callAppOptions);
            });
        }
    };
    ctrl.init();
});