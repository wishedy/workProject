
$(function () {
    var conId=comm.getpara().conId;

    var liveList = {};
    liveList = {
        path: {
            list: "/mcall/conference/index/getConferenceAgendaList/"
        },
        init: function () {
            this.getList();
            this.share();
            var amChannel = comm.getpara()._amChannel;
            comm.bindCallApp({
                el: ".topAct",
              ios: "allinmdios://",
              ios9: "http://app.allinmd.cn/applinks.html"+(amChannel?"?_amChannel="+amChannel:''),
              android: "allin://com.allin.social:75235"+(amChannel?"?data={_amChannel:"+amChannel+"}":'')
            })
            /*$(".meeting_annual").off("click").on("click",function(){
                    location.href = 'https://m.allinmd.cn/dist/conference/meeting_detail.html?conId=1516348906703';
            });*/
        },
        share:function(){
            var t=this;
            var shareObj = {
                title: '',
                summary: '',
                sinaTitle: '',
                wxTitle: '',
                wxDesc: '',
            };
            shareAll({
                fnMessageSuc: function () {
                    comm.shareLog({
                        shareType: "",
                        resourceId: "",
                        resourceType: "",
                        refId: "",
                        isValid: 1,
                        shareSence:"",
                        shareChannel: 4,
                        shareContent: shareObj.wxTitle
                    });
                },
                fnTimelineSuc: function () {
                    comm.shareLog({
                        shareType: "",
                        resourceId: "",
                        resourceType: "",
                        refId: "",
                        isValid: 1,
                        shareSence: "",
                        shareChannel: 5,
                        shareContent: shareObj.timeLineTitle
                    });
                },
                qShareLog: function (x) {
                    if (x === 'qzone') {
                        comm.shareLog({
                            shareType: "",
                            resourceId: "",
                            resourceType: "",
                            refId: "",
                            isValid: 1,
                            shareSence: "",
                            shareChannel: 1,
                            shareContent: shareObj.summary
                        });
                    } else if (x === 'sina') {
                        comm.shareLog({
                            shareType: "",
                            resourceId: "",
                            resourceType: "",
                            refId: "",
                            isValid: 1,
                            shareSence: "",
                            shareChannel: 3,
                            shareContent: shareObj.sinaTitle
                        });
                    }
                },
                triggerRequest:function(){
                    $.ajax({
                        url:"/mcall/comm/data/share/getMapList3/",
                        data: {
                            paramJson: JSON.stringify(
                                {
                                    sceneType:102,
                                    customerId:TempCache.getItem("userId") != null ? TempCache.getItem("userId") : ""
                                }
                            )
                        },
                        type: "post",
                        async:false,
                        dataType:"json",
                        success:function(data){
                            if(comm.hasResponseData(data)){
                                var sList = data.responseObject.responseData.data_list[0].share_channel;
                                shareObj = {
                                    title: '',
                                    summary: '',
                                    sinaTitle: '',
                                    wxTitle: '',
                                    wxDesc: '',
                                };
                                shareObj.pic = data.responseObject.responseData.data_list[0].share_comm.shareImageUrl;
                                $(sList).each(function (index, element) {
                                    if (element.shareChannel === 'QZone') {
                                        shareObj.title = element.shareTitle;
                                        shareObj.summary = element.shareDesc;
                                    }
                                    if (element.shareChannel === 'Sina') {
                                        shareObj.sinaTitle = element.shareDesc;
                                    }
                                    if (element.shareChannel === 'WechatFriend') {
                                        shareObj.wxTitle = element.shareTitle;
                                        shareObj.wxDesc = element.shareDesc;
                                    }
                                    if (element.shareChannel === 'WechatTimeline') {
                                        shareObj.timeLineTitle = element.shareTitle;
                                    }

                                });

                            }
                        }
                    });
                    return shareObj;
                }
            }, false, $(".annual_footer"));
        },
        showCountDown: function (date) {
            var now = new Date();//当前时间
            var year = date.substring(0, 4);
            var month = date.substring(5, 7);
            var day = date.substring(8, 10);
            var hour = date.substring(11, 13);
            var minute = date.substring(14, 16);
            var second = date.substring(17, 19);
            var endDate = new Date(year, month - 1, day, hour, minute, second);//结束时间
            var leftTime = endDate.getTime() - now.getTime();//相差毫秒数
            return leftTime;
        },
        getList: function () {
            var t = this;
            conId = comm.getpara().conId;
            $.ajax({
                url: t.path.list,
                type: "post",
                data: {paramJson: $.toJSON({conId: conId,pageIndex:1,pageSize:2000})},
                dataType: "json",
                async:false,
                success: function (data) {
                    if (data && data.responseObject.responseData.data_list) {

                        var rows = data.responseObject.responseData.data_list;
                        var dateTime=rows[0].dateTime;
                        var year=dateTime.substring(0,4);
                        var month=dateTime.substring(5,7);
                        t.time=time=dateTime.substring(8,10);
                        $(".Evlive_year").text(year);
                        $(".Evlive_month").text(month);
                        $(".Evlive_time").text(time);
                        var dataList = rows[1];
                        if(time=="22"){
                            $(".annual_no_text").text("直播已结束，请耐心等待录播上线...");
                        }

                        if (dataList&&dataList.menu_data_list&&dataList.menu_data_list.length>0) {
                            var html = "";
                            var isend=true;
                            console.log(dataList);
                            $.each(dataList.menu_data_list, function (i, val) {
                                var start = val.startTime;
                                var end = val.endTime;
                                //if (end.substring(11, 13) > 23) {
                                    //liveTime = "全天";
                                //} else {
                                var liveTime = start.substring(11, 16) + "-" + end.substring(11, 16);
                                //}
                                var conSubUrl=val.conSubWebUrl;//?val.conSubWebUrl:val.conSubPicUrl;
                                if (val.isValid == 4) {//即将播放
                                    isend=false;
                                    var btn = '//img50.allinmd.cn/live_list/live_btn_jj.png';
                                    url = '';
                                    var endClass = '';
                                } else if (val.isValid == 5) {//观看
                                    isend=false;
                                    var authority = val.authority;
                                    var roomId = val.conSubRoom;
                                    var userId = '0438CD3A0AB20794';
                                    var backOnOff = (val.playBackId&&val.playBackId.length>0)?"1":"0";
                                    var title=val.conSubName+"-第十届中国骨科医师年会";
                                    btn = '//img50.allinmd.cn/meeting/meeting_annual/metBut01.png';
                                    url = 'conSubId=' + val.id + ' _href="/pages/conference/conference_live.html?conSubId='+ val.id +'&conId='+ val.conId +'&roomId='+roomId+'&authority='+authority+'&userId='+userId+'&back='+backOnOff+'&liveId='+ val.liveId + '&token=' + val.authcode + '&title=' + title  + '"';
                                    endClass = '';
                                } else if (val.isValid == 6) {//结束
                                    return true;
                                    btn = '//img50.allinmd.cn/meeting/meeting_annual/metBut02.png';
                                    url = '';
                                    endClass = 'listEnd';
                                }
                                if(val.conSubIntro){
                                    var info='<dl><dt class="listInt">会议简介：</dt>'+'<span class="conSubIntro">'+val.conSubIntro+'</span></dl>';
                                }else{
                                    var info='<div class="listTime">时间：' + liveTime + '</div>';
                                }
                                html += '<li class="'+(i==dataList.menu_data_list.length-1?'lastList ':'')+'listMain clearFloat'+endClass+' " '+url+' authority='+val.authority+'>' +
                                '<div class="listLeft"><img src="' + conSubUrl.replace("http:","") + '" alt=""/></div>' +
                                '<div class="listMid">' +
                                '<div class="listTit">' + val.conSubName + '</div>' +
                                info+
                                '</div>' +
                                '<div class="listRight"><img src="' + btn + '" alt=""/></div>' +
                                '</li>'

                            });
                            if(!isend){
                                $(".annual_list").html(html);
                                t.userControl();
                            }else{
                                $(".annual_no").remove();
                                $(".annual_list").after('<div class="annual_no" style="display:none;">\n' +
                                    '          <div class="noImg"><img src="//img50.allinmd.cn/meeting/meeting_annual/nohave.png" alt=""/></div>\n' +
                                    '          <p class="annual_no_text">当天直播已结束，请耐心等待录播上线...</p>\n' +
                                    '          <div class="noBut"><a href="/dist/channel/meeting_index.html" data-ajax="false">查看更多会议</a></div>\n' +
                                    '      </div>');
                                $(".annual_no").show();
                            }
                        } else {
                            $(".annual_no").remove();
                            $(".annual_list").hide().after('<div class="annual_no" style="display:none;">\n' +
                                '          <div class="noImg"><img src="//img50.allinmd.cn/meeting/meeting_annual/nohave.png" alt=""/></div>\n' +
                                '          <p class="annual_no_text">当天直播已结束，请耐心等待录播上线...</p>\n' +
                                '          <div class="noBut"><a href="/dist/channel/meeting_index.html" data-ajax="false">查看更多会议</a></div>\n' +
                                '      </div>');
                            $(".annual_no").show();
                        }
                    }
                }
            })
        },
        userControl: function () {
            $(".annual_list .listMain").each(function (i, em) {
                $(em).on("vclick", function () {
                    if($(this).attr("_href")){
                        // 匹配结果
                        var href = $(this).attr("_href");
                        /*switch(parseInt($(this).attr("authority"))){
                            case 1:                                                       //所有
                              g_sps.jump(null,href);
                                break;
                            case 2:
                                //登录
                                user.privExecute({
                                    operateType: 'login',
                                    callback: function () {
                                      g_sps.jump(null,href);
                                    }
                                });
                                break;
                            case 3:                                                       //认证
                                if (user.needConferenceAuthHandler()) {
                                    var userInfo = user.getRenZhengInfo();
                                  g_sps.jump(null,href);
                                }
                                break;
                            default: g_sps.jump(null,href);
                        }*/
                        location.href = href;

                    }

                });
            })
        }
    };

    liveList.init();


});
