/**
 * 功能描述： 发现—— 标签终端页
 * 使用方法:
 * 注意事件：    
 * 引入来源：  作用：
 *
 * Created by QiangKaiLiang on 2016/08/27.
 */
$(function() {
    //Log.createBrowse(37, "标签专题页面"); //  浏览日志
    var TagSeminar = function() {
        var that = this;

        this.XHRList = {
            headMsg: '/mcall/recommend/tag/resource/json_info/',
            list: '/mcall/recommend/tag/resource/json_list/',
            follow: '/mcall/customer/follow/resource/create/',
            unfollow: '/mcall/customer/follow/resource/delete/',
            share: '/mcall/comm/data/share/getMapList3/'
        };
    };
    var tId = comm.getpara('?').tId;
    TagSeminar.prototype = {
        init: function() {
            var that = this;
            this.layout();
            this.preSelectByShare();
            this.getHeadMsg();
            var amChannel = comm.getpara()._amChannel;
            var options ={
                ios: "allinmdios://app.allinmd.cn/applinks.html?scene=11&type=54&sourceId="+tId+(amChannel?"&_amChannel="+amChannel:'')+"",
                android: "allin://com.allin.social:75235?data={scene:3,type:54,sourceId="+tId+(amChannel?",_amChannel:"+amChannel:'')+"}",
                ios9: "http://app.allinmd.cn/applinks.html?scene=11&type=54&sourceId=" + tId +(amChannel?"&_amChannel="+amChannel:'')+ ""
            }
            comm.appWakeUp('figure',options);
            this.getContentRequest({
                dataFlag: $(".al-tagSeminarSelectionItem.active").data("flag"),
                dataType: $(".al-personalContributionSelectorItem.active").data("type")
            });
            this.selectRequestConditions();

            $(".al-tagSeminarFollow,.EV-scrollFollowBtn").on("click", function(e) {
                if($(this).hasClass('EV-followed')){
                    comm.creatEvent({
                        triggerType:'取消关注',
                        pushMessageId:comm.getpara().tId,
                        refId:comm.getpara().tId,
                        actionId:69
                    });
                }else{
                    comm.creatEvent({
                        triggerType:'关注',
                        pushMessageId:comm.getpara().tId,
                        refId:comm.getpara().tId,
                        actionId:7
                    });
                }

                var t = this;
                user.privExecute({
                    operateType: 'auth',
                    callback: function() {
                        if ($(t).hasClass('EV-followed') || $(t).hasClass('btn-done')) {
                            if ($(".al-unfollow").hasClass('on')) {
                                return;
                            }
                            $(".al-unfollow").addClass('on');

                            $('#EV-cancelUploadImg').on("click", function(e) {
                                $(".al-unfollow").removeClass('on');
                            });

                            $('#EV-unfollowBtn').on("click", function(e) {
                                that.tagSns($(t));
                                $(".al-unfollow").removeClass('on');
                            });
                        } else {
                            that.tagSns($(t));
                        }
                    },
                    noNeedBack:true
                });

            });

            $('.al-tagSeminarHeader a:eq(0)').on("click",function(){
                comm.creatEvent({
                    triggerType:'全站功能按钮点击',
                    keyword:"返回",
                    actionId:41,
                    async:false
                });
                //if (typeof(document.referrer)!=='undefined'&&document.referrer!==location.href) {
                //    window.location=document.referrer;
                //    if (document.referrer.length===0) {
                //        window.location="/pages/discover/discover_tag.html";
                //    }
                //}else{
                //    window.history.go(-1);
                //}
                window.history.go(-1);
            });


        },
        preSelectByShare: function() {
            var para = comm.getpara('?');
            $(".al-tagSeminarSelectionItem").removeClass('active');
            $(".al-tagSeminarSelectionItem[data-flag='" + ((typeof(para.scene) === 'undefined') ? '1' : para.scene) + "']").addClass('active');
            $(".al-personalContributionSelectorItem").removeClass('active');
            $(".al-personalContributionSelectorItem[data-type='" + ((typeof(para.type) === 'undefined') ? '0' : para.type) + "']").addClass('active');
            $(".al-personalContributionSelector h2").text($(".al-personalContributionSelectorItem[data-type='" + ((typeof(para.type) === 'undefined') ? '0' : para.type) + "']").text())
        },
        layout: function() {

            var headHeight = $(".al-tagSeminarHeader").outerHeight();
            var navbarTop = $(".al-tagSeminarFollowMsg").outerHeight();
            var scrollHeadHeight = $(".al-tagScrollHead").outerHeight();
            var appH=$(".al-appWakeUpFigure").outerHeight();
            $(window).on("scroll", function() {
                if (headHeight+appH+navbarTop+scrollHeadHeight < $(this).scrollTop()) {
                    $(".al-tagSeminarHeader").hide();
                    $(".al-tagSeminarFollowMsg").hide();
                    $(".al-tagScrollHead").show();
                    $(".al-scrollBox").addClass('al-scrollBoxFixed');
                    $(".al-mainInner").css("paddingTop", '5.8rem');
                } else {
                    $(".al-tagSeminarHeader").show();
                    $(".al-tagSeminarFollowMsg").show();
                    $(".al-scrollBox").removeClass('al-scrollBoxFixed');
                    $(".al-tagScrollHead").hide();

                    $(".al-mainInner").css("paddingTop", "0");
                }
            });

        },

        // 头部详细信息
        getHeadMsg: function() {
            var that = this;
            var data = {
                tagId:tId, //812,
                /*pageSize: 20,
                pageIndex: 1,*/
                scene: 2,
                customerId: localStorage.getItem('userId'),
                customerNum: 6
            };
            var hTemplate = "",
                lTemplate = "",
                tTemplate = "";
            $.ajax({
                    url: this.XHRList.headMsg,
                    type: 'post',
                    dataType: 'json',
                    data: {
                        paramJson: $.toJSON(data)
                    }
                })
                .done(function(data) {
                    var hList = data.responseObject.responseData.data_list[0];
                    // 标题get /pages/case/case_upload.html#tId='+comm.getpara().tId+'
                    hTemplate = '<h2 class="al-tagSeminarTitle EV-tagTitle">' + hList.propertyName + '</h2>' +
                        '<article class="al-tagSeminarNumMsg">' +
                        '<span>共<em>' + hList.sourceNum + '</em>个资源</span>' +
                        '<a href="javascript:;" class="ev_digHole1"><i class="icon-tagConfig"></i>补充病例</a>' +
                        '</article>';
                    $('.EV-tagTitleMessage').append(hTemplate);
                    that.setSeo();
                    // 滚动导航条文本
                    $(".EV-scrollTitle").text((hList.propertyName.length > 10) ? hList.propertyName.substring(0, 9) + '...' : hList.propertyName);
                    // 标题按照文本数量改变字号
                    that.changeFontSizeByTitleLen();
                    // 获取资源类型
                    var _arr=['1','2','4','7'];
                    $.each(_arr,function(index,ele){
                        if(hList.types.split(',').indexOf(ele)==-1){
                            $(".al-personalContributionSelector .al-personalContributionSelectorItem[data-type="+ele+"]").remove();
                        }
                    });
                    $('.ev_digHole1').click(function(e){
                        if(TempCache.getItem('auth')&&TempCache.getItem('auth')!=null){
                            var state = JSON.parse(TempCache.getItem('auth')).state;
                            if(state!=2&&state!=7&&state!=8&&state!=9){
								user.privExecute({
									operateType:'auth',
									callback:function(){},
                                    noNeedBack:true
								})
                                return false;
                            }
                        }
                        comm.creatEvent({
                            triggerType:'发布',
                            keyword:comm.getpara().tId,
                            actionId:34,
                            refId:comm.getpara().tId,
                            async:false
                        });
                        var amChannel = comm.getpara()._amChannel;
                        comm.newReleaseBox({
                            imgPath:"/images/img50/case/release.png",
                            title:"补充病例需使用唯医骨科App",
                            solidBtnTitile:"立即使用",
                            authNoneTitle:"暂不使用",
                            data:{
                                el: ".solidBtn",
                                ios: "allinmdios://app.allinmd.cn/applinks.html?scene=11&type=54&sourceId="+tId +(amChannel?"&_amChannel="+amChannel:''),
                                android: "allin://com.allin.social:75235?data={scene:3,type:54,sourceId="+tId+ (amChannel?",_amChannel:"+amChannel:'')+ "}",
                                ios9: "http://app.allinmd.cn/applinks.html?scene=11&type=54&sourceId=" + tId  +(amChannel?"&_amChannel="+amChannel:''),
                            }
                        });
                    });

                    // 获取关注人数
                    if (hList.followNum === 0 || hList.followNum.length === 0) {
                        $('.al-tagSeminarFollowMsg').addClass('noFollow');
                    } else {
                        $(".al-tagSeminarFollowNum span").text(hList.followNum);
                    }

                    // 获取关注状态
                    switch (parseInt(hList.relationship)) {
                        case 0:
                            $(".al-tagSeminarFollow").addClass('EV-follow');
                            $(".al-tagSeminarFollow button").text("关注");
                            $(".EV-scrollFollowBtn").addClass('btn-primary').text('关注');
                            break;
                        case 1:
                            $(".al-tagSeminarFollow").addClass('EV-followed');
                            $(".al-tagSeminarFollow button").text("已关注");
                            $(".EV-scrollFollowBtn").addClass('btn-done').text('已关注');
                            break;
                    }


                    // 获取前5个关注人头像
                    if (hList.logoUrl.length !== 0) {
                        $(hList.logoUrl.split('|').slice(0, 6)).each(function(index, ele) {
                            if (index === 5) {
                                lTemplate = '<li class="al-tagSeminarFollowListItem">' +
                                    '<a href="/pages/discover/discover_tagFollowers.html?tId=' + tId + '&title=' + hList.propertyName + '">' +
                                    '···</a>' +
                                    '</li>';
                            } else {
                                lTemplate = '<li class="al-tagSeminarFollowListItem">' +
                                    '<a href="/pages/discover/discover_tagFollowers.html?tId=' +  tId + '&title=' + hList.propertyName + '">' +
                                    '<img src="' + ele + '" alt="">' + '</a>' +
                                    '</li>';
                            }
                            $('.EV-tagSeminarFollowList').append(lTemplate);
                        });
                    }
                })
                .fail(function() {
                    console.log("XHR error...");
                });
        },
        // 按文字数量改变字号
        changeFontSizeByTitleLen: function() {
            var len = $(".EV-tagTitle").text().length;
            if (len <= 14) {
                return false;
            } else if (len > 14 && len <= 32) {
                $(".EV-tagTitle").addClass('middle');
            } else if (len > 33) {
                $(".EV-tagTitle").addClass('small');
            }
        },
        // 点击筛选条件
        selectRequestConditions: function() {
            var that = this;
            $(".al-tagSeminarSelectionItem").on("click", function(e) {
                var role = $(this).data("role"),
                    flag = $(this).data("flag");
                var _actId = 47;
                if(flag==2){
                    _actId=49;
                }else if(flag==3){
                    _actId=48;
                }
                comm.creatEvent({
                    triggerType:'列表资源排序',
                    keyword:$(this).text(),
                    actionId:_actId
                });
                $(this).addClass('active').siblings().removeClass('active');
                $(".al-content").removeClass('active');
                $(".al-content[data-role=" + role + "]").addClass('active');
                that.getContentRequest({
                    dataFlag: flag,
                    dataType: $(".al-personalContributionSelectorItem.active").data("type")
                });
            });

            $(".al-personalContributionSelector").on("click", function(e) {
                if (e.target.nodeName.toLowerCase() === 'h2') {
                    if (!$(".al-personalContributionSelector").hasClass('al-personalSelectorOn')) {
                        $(".al-personalContributionSelector").addClass('al-personalSelectorOn');
                    } else {
                        $(".al-personalContributionSelector").removeClass('al-personalSelectorOn');
                    }
                } else if (e.target.className === 'al-personalContributionSelectorItem') {
                    var type = e.target.getAttribute('data-type');
                    var _actionId = 51;
                    if(type==7){
                        _actionId = 52;
                    }else if(type==1){
                        _actionId = 53;
                    }else if(type == 2){
                        _actionId = 54;
                    }else if(type==4){
                        _actionId = 55;
                    }
                    comm.creatEvent({
                        triggerType:'列表资源排序',
                        keyword:$(e.target).text(),
                        actionId:_actionId
                    });
                    $(".al-personalContributionSelector").removeClass('al-personalSelectorOn');
                    $(e.target).addClass('active').siblings().removeClass('active');
                    $(".al-personalContributionSelector h2").text(e.target.innerHTML);
                    that.getContentRequest({
                        dataFlag: $(".al-tagSeminarSelectionItem.active").data("flag"),
                        dataType: type
                    });
                    // var _url =document.URL;
                    // if(_url.indexOf('&type=')==-1){
                    //     document.location.href = _url+"&type="+type;
                    // }else{
                    //     document.location.href = _url.replace(/\&type=[1|2|4|7|0]/,'&type='+type);
                    // }
                }

            });
        },
        // 根据条件进行数据请求
        getContentRequest: function(sObj) {
            var data = {
                    tagId: tId || "", //812,
                    pageSize: 20,
                    pageIndex: 1,
                    dataScene: sObj.dataFlag,
                    dataType: sObj.dataType,
                    scene: 2
                },
                tTemplate = "",
                that = this;
                $(".al-content.active").children().remove();
            $.ajax({
                    url: this.XHRList.list,
                    type: 'post',
                    dataType: 'json',
                    data: {
                        paramJson: $.toJSON(data)
                    },
                    beforeSend: function() {
                        comm.loading.show();
                    }
                })
                .done(function(res) {
                    //console.log(res);
                    if (typeof(res.responseObject) !== 'undefined') {
                        if (typeof(res.responseObject.responseData.data_list) !== "undefined") {
                            $(".al-noContentTips").hide();
                            that.contentGenerate(res, sObj);
                            that.dataWaterfall(sObj);
                            that.share();
                        } else {
                            $(".al-noContentTips").show();
                            $(".al-scrollShareBtn").hide();
                        }
                    } else {
                        $(".al-noContentTips").show();
                        $(".al-scrollShareBtn").hide();
                    }
                    comm.loading.hide();
                })
                .fail(function() {
                    console.log("XHR error...");
                });

        },
        scoreDom:function(s,scoreNum){
            var score="";
            if(scoreNum<10){return ""}
            var num = parseInt(s);
            var flot =(s-num)*100+"%";
            if(num==0){
                score='<div class="al-resourceTypeBox" style="margin-bottom:7px;"><ul class="al-littleScoreStarBox"><li><b style="width:'+flot+'"></b></li><li></li><li></li><li></li><li></li></ul></div>';
            }else if(num==1){
                score='<div class="al-resourceTypeBox" style="margin-bottom:7px;"><ul class="al-littleScoreStarBox"><li><b></b></li><li><b style="width:'+flot+'"></b></li><li></li><li></li><li></li></ul></div>';
            }else if(num==2){
                score='<div class="al-resourceTypeBox" style="margin-bottom:7px;"><ul class="al-littleScoreStarBox"><li><b></b></li><li><b></b></li><li><b style="width:'+flot+'"></b></li><li></li><li></li></ul></div>';
            }else if(num==3){
                score='<div class="al-resourceTypeBox" style="margin-bottom:7px;"><ul class="al-littleScoreStarBox"><li><b></b></li><li><b></b></li><li><b></b></li><li><b style="width:'+flot+'"></b></li><li></li></ul></div>';
            }else if(num==4){
                score='<div class="al-resourceTypeBox" style="margin-bottom:7px;"><ul class="al-littleScoreStarBox"><li><b></b></li><li><b></b></li><li><b></b></li><li><b></b></li><li><b style="width:'+flot+'"></b></li></ul></div>';
            }else if(num==5){
                score='<div class="al-resourceTypeBox" style="margin-bottom:7px;"><ul class="al-littleScoreStarBox"><li><b></b></li><li><b></b></li><li><b></b></li><li><b></b></li><li><b></b></li></ul></div>';
            }
            return score;
        },
        // 数据字段处理
        contentGenerate: function(res, sObj) {
            var t=this;
            var tList = res.responseObject.responseData.data_list,
                tImg = '',
                tNum,
                _actTitle;
            $(tList).each(function(index, ele) {
                numObj = {
                    bNum: ((ele.browseNum.length === 0) ? "" : '<span class="icon-contentWatchedNum">' + ele.browseNum.toWK() + '</span>'),
                    rNum: ((ele.reviewNum.length === 0) ? "" : '<span class="icon-tagComment">' + ele.reviewNum.toWK() + '</span>')
                };
                vImg = '<i class="al-videoPlayBtn">' +
                    '<img src="//img50.allinmd.cn/pages/index/videoPlay_btn.png" alt="">' +
                    '</i>' +
                    '<span class="al-videoTime">' + ele.playTime + '</span>';
                tImg = '<figure class="al-contentImgBox">' +
                    '<a href="' + ele.itemUrl + '">' +
                    '<img src="' + ele.picUrl.split('|')[0] + '" alt="">' +
                    ((ele.itemType != 1) ? "" : vImg) +
                    '</a>' +
                    '</figure>';
                _actTitle='';
                if(ele.isShowActivityTag==1){
                    var _color = ele.activityTagColor;
                    _actTitle = '<span style="color:'+_color+';border:1px solid '+_color+';padding:0 0.10667rem;margin-right: 0.26667rem;border-radius: 0.02667rem;">'+ele.activityTagName+'</span>';
                }
                //列表验证用户名和书籍名称
                var uNameOrBName="";
                if(ele.ownerName&& $.trim(ele.ownerName)){
                    if(ele.videoType&&(ele.videoType==17||ele.videoType==18||ele.videoType==19)){
                        uNameOrBName='<span class="al-contentAuthor bookNameIcon">'+ele.ownerName+'</span>';
                    }else{
                        uNameOrBName='<span class="al-contentAuthor icon-contentAuthor">'+ele.ownerName+'</span>';//icon-contentAuthor
                    }
                }else{
                    uNameOrBName="";
                }
                tTemplate = '<section class="al-contentPartModule">' +t.scoreDom(ele.currentStarLevel,ele.currentScoreNum)+
                    '<section class="al-tableBox">' +
                    '<article class="al-contentText">' +
                    '<a href="' + ele.itemUrl + '" class="al-contentTitle"><span>' + ele.itemTitle + '</span></a>' +
                    '<p class="al-contentOtherMsg">' +_actTitle+
                    uNameOrBName +
                    numObj.bNum +
                    numObj.rNum +
                    '</p>' +
                    '</article>' +
                    ((ele.picUrl.length === 0) ? "" : tImg) +
                    '</section>' +
                    '</section>';


                $(".al-content.active").append(tTemplate);
            });
        },
        // 数据瀑布流加载
        dataWaterfall: function(sObj) {
            var that = this;
            var num = 2;
            var data = {
                tagId: comm.getpara().tId, //812,
                pageSize: 20,
                pageIndex: num,
                dataScene: sObj.dataFlag,
                dataType: sObj.dataType,
                scene: 2
            };

            $('.al-content.active').off("scroll").scrollPagination({
                'contentPage': that.XHRList.list,
                'contentData': $.extend(data, {
                    pageIndex: function() {
                        return num++;
                    }
                }),
                'scrollTarget': $(window),
                'heightOffset': 0,
                'delaytime': 0,
                'type': "get",
                'beforeLoad': function() {
                    comm.loading.show();
                },
                'afterLoad': function() {
                    comm.loading.hide();
                },
                'loader': function(res) {
                    if ($.isEmptyObject(res)) {
                        $(".al-content.active").attr('scrollPagination', 'disabled');
                        return false;
                    } else {
                        if ($.isEmptyObject(res.responseObject.responseData) || (res.responseObject.responseData.data_list && res.responseObject.responseData.data_list.length === 0)) {
                            $(".al-content.active").attr('scrollPagination', 'disabled');
                            return false;
                        } else {
                            that.contentGenerate(res, sObj);
                        }
                    }
                }
            });
        },
        tagSns: function(ele) {
            var that = this;
            var data = {
                    followType: 61,
                    customerId: localStorage.getItem("userId"),
                    refId: tId,
                    refName: $(".EV-tagTitle").text()
                },
                reqUrl = "";
            if (ele.hasClass('EV-follow') || ele.hasClass('btn-primary')) {
                reqUrl = this.XHRList.follow;
            } else {
                reqUrl = this.XHRList.unfollow;
            }
            $.ajax({
                url: reqUrl,
                type: 'POST',
                dataType: 'json',
                timeout: 10000,
                data: {
                    paramJson: $.toJSON(data)
                },
            })
            .done(function(data) {
                if (data.responseObject.responseStatus) {
    
                    if (reqUrl === that.XHRList.follow) {
                        $(".al-tagSeminarFollow").removeClass('EV-follow').addClass('EV-followed');
                        $(".al-tagSeminarFollow button").text("已关注");
                        $(".EV-scrollFollowBtn").removeClass('btn-primary').addClass('btn-done').text('已关注');
                    } else if (reqUrl === that.XHRList.unfollow) {
                        $(".al-tagSeminarFollow").removeClass('EV-followed').addClass('EV-follow');
                        $(".al-tagSeminarFollow button").text("关注");
                        $(".EV-scrollFollowBtn").removeClass('btn-done').addClass('btn-primary').text('关注');
                    }
                }
            })
            .fail(function() {
                console.log("XHR error...");
            });
            
        },
        // 分享内容获取
        share: function() {
            var that = this;

            var data = {
                tagId: tId || "", //812,
                pageSize: 20,
                pageIndex: 1,
                dataScene: $('.al-tagSeminarSelectionItem.active').data('flag'),
                dataType: $('.al-personalContributionSelectorItem.active').data('type'),
                scene: 2,
                sceneType: 16,
                resourceType: 0,
            };
            shareAll({
                url: window.location.origin+window.location.pathname+"?tId="+tId+"&type="+$('.al-personalContributionSelectorItem.active').attr('data-type')+"&scene="+$('.al-tagSeminarSelectionItem.active').attr('data-flag'),
                fnMessageSuc: function() {
                    comm.shareLog({
                        shareType: "",
                        resourceId: "",
                        resourceType: "",
                        refId: "",
                        isValid: 1,
                        shareSence: 55,
                        shareChannel: 4,
                        shareContent: that.shareObj.wxTitle
                    });
                },
                fnTimelineSuc: function() {
                    comm.shareLog({
                        shareType: "",
                        resourceId: "",
                        resourceType: "",
                        refId: "",
                        isValid: 1,
                        shareSence: 55,
                        shareChannel: 5,
                        shareContent: that.shareObj.timeLineTitle
                    });
                },
                qShareLog: function(x) {
                    if (x === 'qzone') {
                        comm.shareLog({
                            shareType: "",
                            resourceId: "",
                            resourceType: "",
                            refId: "",
                            isValid: 1,
                            shareSence: 55,
                            shareChannel: 1,
                            shareContent: that.shareObj.summary
                        });
                    }else if (x==='sina') {
                        comm.shareLog({
                            shareType: "",
                            resourceId: "",
                            resourceType: "",
                            refId: "",
                            isValid: 1,
                            shareSence: 55,
                            shareChannel: 3,
                            shareContent: that.shareObj.sinaTitle
                        });
                    }
                },
                triggerRequest:function(){
                    comm.loading.show();
                    $.ajax({
                        url: that.XHRList.share,
                        type: 'POST',
                        dataType: 'json',
                        data: {
                            paramJson: $.toJSON(data)
                        },
                        async:false,
                    })
                        .done(function(data) {
                            var sList = data.responseObject.responseData.data_list[0].share_channel;
                            that.shareObj = {
                                title: '',
                                summary: '',
                                sinaTitle: '',
                                wxTitle: '',
                                wxDesc: '',
                            };

                            $(sList).each(function(index, element) {
                                if (element.shareChannel === 'QZone') {
                                    that.shareObj.title = element.shareTitle;
                                    that.shareObj.summary = element.shareDesc;
                                }
                                if (element.shareChannel === 'Sina') {
                                    that.shareObj.sinaTitle = element.shareDesc;
                                }
                                if (element.shareChannel === 'WechatFriend') {
                                    that.shareObj.wxTitle = element.shareTitle;
                                    that.shareObj.wxDesc = element.shareDesc;
                                }
                                if (element.shareChannel === 'WechatTimeline') {
                                    that.shareObj.timeLineTitle = element.shareTitle;
                                }
                            });

                        });
                    comm.loading.hide();
                    return that.shareObj;
                }
            }, false, $('.al-scrollShareBtn'));


        },
        setSeo: function() {
            var keywords = $(".EV-tagTitle").text() + '，关注标签，' + $(".EV-tagTitle").text() + '病例，' + $(".EV-tagTitle").text() + '视频，' + $(".EV-tagTitle").text() + '文库，' + $(".EV-tagTitle").text() + '话题，唯医,allinmd'
            document.title = $(".EV-tagTitle").text() + "－关注标签,资源更新提醒,唯医,allinmd"
            $("meta[name='keywords']").attr("content", keywords);
        }

    };
    var tagSeminar = new TagSeminar();
    tagSeminar.init();
});
