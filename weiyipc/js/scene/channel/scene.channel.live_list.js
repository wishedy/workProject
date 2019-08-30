/**
 * 功能描述：
 * 使用方法:
 * 注意事件：
 * 引入来源：  作用：
 *
 * Created by LiChunHui on 2015/4/28.
 */
$(function(){
    var liveList={};
    liveList={
        path:{
            list:PC_CALL+"conference/index/getConferenceAgendaList/"
        },
        init:function(){
            this.conId=comm.getpara().conId;
            this.defLiveBtn="//img00.allinmd.cn/meeting/metBut01.jpg";//默认播放按钮
            this.hovLiveBtn="//img00.allinmd.cn/meeting/metBut03.jpg";//鼠标移入播放按钮
            this.getList();
            this.share();
        },
        share:function(){
            var t=this;
            var date = new Date();
             var time = t.time;
            //var time = date.getDate();
            switch (parseInt(time,10)){
                case 10:
                    qqTitle='CAOS2018-NASS国际课程直播进行时';
                    summary='点击进入CAOS2018-NASS国际课程直播现场';
                    sinaTitle='直播进行时：CAOS2018-NASS国际课程马上看！全天候8:00—17:00！点击查看：链接';
                    break;
                case 11:
                    qqTitle='CAOS2018-NASS&AAHKS&髋、膝关节课程直播进行时';
                    summary='点击进入CAOS2018国内外精品课程直播现场';
                    sinaTitle='直播进行时：CAOS2018国内外精品课程马上看！全天候8:00—17:30！点击查看：链接';
                    break;
                case 12:
                    qqTitle='CAOS2018-脊柱微创课程直播进行时';
                    summary='点击进入CAOS2018-脊柱微创课程直播现场';
                    sinaTitle='直播进行时：CAOS2018-脊柱微创课程马上看！全天候8:00—17:30！点击查看：链接';
                    break;
               /* case '14':
                    qqTitle='直播进行时丨CAOS2018年会—创伤脊柱关节大师课堂全面开讲！';
                    summary='8:00—11:30现场直播，好课分秒必争！';
                    sinaTitle='[CAOS2018]直播进行时丨8:00—11:30—创伤关节脊柱大师讲堂全面开讲！链接';
                    break;*/
                default :
                    qqTitle='CAOS2018-NASS国际课程直播进行时';
                    summary='点击进入CAOS2018-NASS国际课程直播现场';
                    sinaTitle='直播进行时：CAOS2018-NASS国际课程马上看！全天候8:00—17:00！点击查看：链接';
                    break;
            }
            module.videoPKShare({
                title:qqTitle,
                sina:sinaTitle,
                qqFriend:summary,
                qqZone:summary,
                pic:'https://img00.allinmd.cn/meeting/meeting2018.jpg'
            });
        },
        getList:function(){
            var t=this;
            $.ajax({
                url: t.path.list,
                type: "post",
                data: {paramJson:$.toJSON({conId: t.conId})},
                async:false,
                dataType:"json",
                success: function (data) {
                    if(data&&data.responseObject.responseData.data_list){
                        var rows=data.responseObject.responseData.data_list;
                        var dateTime=rows[0].dateTime;
                        year=dateTime.substring(0,4);
                        month=dateTime.substring(5,7);
                        t.time=time=dateTime.substring(8,10);
                        $(".Evlive_year").text(year);
                        $(".Evlive_month").text(month);
                        $(".Evlive_time").text(time);
                        dataList=rows[1];
                        if(time=="22"){
                            $(".annual_no_text").text("直播已结束，请耐心等待录播上线...");
                        }
                        if(dataList&&dataList.menu_data_list&&dataList.menu_data_list.length>0){
                            var html="";
                            var isend=true;
                            $.each(dataList.menu_data_list,function(i,val){
                                var metTopNo="";
                                start = val.startTime;
                                end = val.endTime;
                                liveTime = start.substring(11, 16) + "~" + end.substring(11, 16);
                                conSubUrl=val.conSubPicUrl?val.conSubPicUrl.replace("http:",""):val.conSubWebUrl;
                                if(val.isValid==4){//即将播放
                                    isend=false;
                                    liveId='';
                                    img='<img src="'+conSubUrl+'"/>';
                                    btn='<img src="//img00.allinmd.cn/conference/live/live_btn_jj.jpg"/>';
                                }else if(val.isValid==5){//观看
                                    isend=false;
                                    var authority = val.authority;
                                    var roomId = val.conSubRoom;
                                    var userId = '0438CD3A0AB20794';
                                    var backOnOff = (val.playBackId&&val.playBackId.length>0)?"1":"0";
                                    liveId='liveid='+val.liveId;
                                    img='<a class="live_btn_a" authority='+val.authority+' href="javascript:;" _href="/pages/conference/conference_live.html?liveId='+val.liveId+'&roomId='+roomId+'&userId='+userId+'&back='+backOnOff+'&authority='+val.authority+'&conId='+val.conId+'&conSubId='+val.id+'"><img src="'+conSubUrl+'"/></a>';
                                    btn='<a class="live_btn_a" authority='+val.authority+' href="javascript:;" _href="/pages/conference/conference_live.html?liveId='+val.liveId+'&roomId='+roomId+'&userId='+userId+'&back='+backOnOff+'&authority='+val.authority+'&conId='+val.conId+'&conSubId='+val.id+'"><img src="//img00.allinmd.cn/meeting/metBut01.jpg"/></a>'
                                }else if(val.isValid==6){//结束
                                    return true;
                                    liveId='';
                                    img='<img src="'+conSubUrl+'"/>';
                                    btn='<img src="//img00.allinmd.cn/meeting/metBut02.jpg"/>'
                                }
                                if(val.conSubIntro){
                                    metTopNo="metTopNo";
                                    info='<dl>'+val.conSubIntro+'</dl>';
                                }else{
                                    metTopNo="";
                                    info='<p>直播时间：'+year+'年'+month+'月'+time+'日</p>'+
                                    '<p>'+liveTime+'</p>';
                                }
                                html+='<li '+liveId+'>'+
                                '<div class="metTop '+metTopNo+'">'+
                                '<div class="listImg"><i class="playIcon"></i>'+img+'</div>'+
                                '<p class="metTit">' + (comm.getByteLen(val.conSubName)>50?comm.getStrLen(val.conSubName,50):val.conSubName) + '</p>'+
                                info+
                                '</div>'+
                                '<div class="metBot">'+btn+'</div>'+
                                '</li>';

                            });
                            if(!isend){
                                $(".EvAct_list").html(html);
                                $(".EvAct_list li").on("mouseover",function(){
                                    if($(this).find('a').length){
                                        $(this).addClass("actHover");
                                        //$(this).find(".metBot img").attr("src", t.hovLiveBtn);
                                    }
                                }).on("mouseout",function(){
                                        $(this).removeClass("actHover");
                                       // $(this).find(".metBot img").attr("src", t.defLiveBtn);
                                });
                                t.userControl();
                            }else{
                                $(".EvAct_list").hide();
                                $(".actTexd").show();
                            }
                        }else{
                            $(".actTexd").show();
                        }
                        $(".listImg .playIcon").off("click").on("click",function(){
                            var t = $(this);
                          if(t.next().attr("href")){
                              t.next().trigger("click");
                          }
                        });
                    }
                }
            })
        },
        userControl:function(){
            $(".EvAct_list .live_btn_a").each(function(i,em){
                $(em).on("click",function(){
                    // 匹配结果
                    var href=$(em).attr("_href");
                    switch(parseInt($(this).attr("authority"))){
                        case 1:                                                       //所有
                            g_sps.jump(null,href);
                            break;
                        case 2:                                                       //登录
                            user.login({
                                callback:function(){
                                    g_sps.jump(null,href);
                                },
                                scene:privilegeSceneConst.eSceneTypeLogin
                            });
                            break;
                        case 3:                                                       //认证
                            user.login({
                                callback:function(){
                                    g_sps.jump(null,href);
                                },
                                scene:privilegeSceneConst.eSceneTypeAuth
                            });
                            break;
                        default: g_sps.jump(null,href);
                    }
                });
            })
        }
    };
    liveList.init();
})
