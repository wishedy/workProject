/**
 * 功能描述：  发现——按类型筛选
 * 使用方法:
 * 注意事件：    
 * 引入来源：  作用：
 *
 * Created by QiangKaiLiang on 2016/08/17.
 */

$(function() {
    var DiscoverType = function() {
        var that = this;
        var $that = $(this);
        this.XHRList = {
            list: '/mcall/discovery/search/getMapByType/',
            filter: '/mcall/comm/data/filter/getMapList/',
            share: '/mcall/comm/data/share/getMapList3/'
        };
    };
    DiscoverType.prototype = {
        // 获取选中态筛选条件
        // 点击清空当前内容 重新请求

        init: function() {
            var that = this;
            comm.twoFilterController();
            //window.onload = Log.createBrowse(48, '按类型');
            $('.ev_digHole').click(function(){
                comm.creatEvent({
                    triggerType:'全站功能按钮点击',
                    keyword:"返回",
                    actionId:41,
                    async:false
                });
            });
            this.layout();
            this.ajaxReq = null;
            this.getContentFilter();
            var filterMsg = {
                refType: $(".al-twoFloorSecondFilterItem.active").attr("reftype") || "1",
                refSecondType: $(".al-twoFloorSecondFilterItem.active").attr("refsecondtype") || "",
                sortType: $(".EV-sortFilter .active").data("sort") || "5"
            };
            this.getContentList(filterMsg);


            $(".al-twoFloorSecondFilter").on("click", ".al-twoFloorSecondFilterItem", function(e) {
                //$(".EV-sortFilter .active");
                filterMsg = {
                    refType: $(this).attr("reftype"),
                    refSecondType: $(this).attr("refsecondtype"),
                    sortType: $(".EV-sortFilter .active").data("sort")
                };
                $("html,body,.al-mainInner").css({ "overflow": "auto", "height": "auto" });
                $('.EV-discoverTypeFilter').children().remove();
                that.ajaxReq.abort();
                that.ajaxReq = null;
                that.getContentList(filterMsg);
            });

            $(".al-oneFloorFilterItem[data-role='sort']").on('click', function(e) {
                comm.creatEvent({
                    triggerType:'列表资源排序',
                    keyword:$(this).text(),
                    actionId:$(this).index()+46
                });
                $("html,body,.al-mainInner").css({ "overflow": "auto", "height": "auto" });
                filterMsg.sortType = $(this).data("sort");
                $('.EV-discoverTypeFilter').children().remove();
                $(".al-typeFilterNavbarItem[data-role='sort']").text($(this).text())
                that.getContentList(filterMsg);
            });

            if(typeof(comm.getpara().type)!=='undefined'){
                $(".al-typeFilterMainMask").removeClass('active');
                $(".al-discoverMask").removeClass('show');
                $(".al-typeFilterNavbarItem").removeClass('active');
            }

        },
        // 布局相关
        // 撑开固定定位头部高度
        layout: function() {
            var fH = $(".al-headFilterBox").height();
            $(".al-content").css("marginTop", fH);
        },
        // 根据分享状态设置初始状态
        preSelectFilter: function() {
            var obj = comm.getpara();
            $('.al-twoFloorFirstFilterItem').removeClass('selected');
            $('.al-twoFloorSecondFilterBox').removeClass('selected');
            $('.al-twoFloorSecondFilterItem').removeClass('active');
            $('.al-twoFloorFirstFilterItem[reftype="' + (obj.type || '1') + '"]').addClass('selected');
            $('.al-twoFloorSecondFilterBox[data-role="' + (obj.type || '1') + '"]').addClass('selected');
            $('.al-twoFloorSecondFilterItem[reftype="' + (obj.type || '1') + '"][refsecondtype="' + (obj.sType || '') + '"]').addClass('active');

            $(".al-oneFloorFilterItem").removeClass('active');

            $(".al-oneFloorFilterItem[data-sort='" + (obj.scene || '5') + "']").addClass('active');
            $(".al-typeFilterNavbarItem[data-role='sort']").text($(".al-oneFloorFilterItem.active").text());
            if(obj.type){$("body").unbind("touchmove");}

        },
        // 点击——请求内容
        getContentList: function(rObj) {
            var that = this;
            var data = {
                refType: rObj.refType,
                refSecondType: rObj.refSecondType,
                sortType: rObj.sortType,
                attUseFlag: 3,
                logoUseFlag: 3,
                pageIndex: 1,
                pageSize: 20,
                themeType: 0,
                useFlag:12
            };
            var typeResList = "",
                resTemplate = "",
                imgContent = "";
            that.ajaxReq = $.ajax({
                    url: that.XHRList.list,
                    type: 'get',
                    dataType: 'json',
                    beforeSend: function() {
                        comm.loading.show();
                    },
                    data: {
                        paramJson: $.toJSON(data)
                    },
                })
                .done(function(res) {
                    that.contentGenerate(res.responseObject.responseData.data_list, rObj,true);
                    comm.loading.hide();
                    /*
                    * 按病例全部搜索特殊处理：搜索第一页20个数据，只有3个是有效，页面不够高度不滚动加载后面的数据
                    * **/
                    if(rObj.refType==7){ //病例的时候 ， 第一页个数小于20个，总数大于20个，直接加载第二页，滚动加载时能第三页开始
                        if(res.responseObject.responseData.total_count>20 && res.responseObject.responseData.data_list.length<20){
                            $.ajax({
                                url: that.XHRList.list,
                                type: 'get',
                                dataType: 'json',
                                data: {
                                    paramJson: $.toJSON($.extend({},data,{pageIndex:2}))
                                },
                                success:function(resData){
                                    that.contentGenerate(resData.responseObject.responseData.data_list, rObj);
                                    that.dataWaterfall(rObj,3);
                                }
                            });
                        }else{
                            that.dataWaterfall(rObj);
                        }
                    }else{
                        that.dataWaterfall(rObj);
                    }

                    that.share();
                })
                .fail(function() {
                    comm.loading.show();
                    //console.log("XHR Error...");
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
        // 字段处理
        contentGenerate: function(typeResList, rObj,replaceHtml) {
            var t=this;
            var bNum = '',
                cNum = '';
            var htmlDom ='';
            var _act = '';
            var uNameOrBName="";
            var isSmallPhone = $(window).width()<=640;
            $(typeResList).each(function(index, el) {
                _act = '';
                if(el.isShowActivityTag==1){
                    var _color = el.activityTagColor;
                    _act = '<span style="color:'+_color+';border:1px solid '+_color+';padding:0 0.10667rem;margin-right: 0.26667rem;border-radius: 0.02667rem;">'+el.activityTagName+'</span>';
                }
                switch (rObj.refType) {
                    case "1":
                        if(el.cms_video) {
                            if (el.cms_video.playNum !== 0) {
                                bNum = '<span class="icon-contentWatchedNum">' + el.cms_video.playNum.toWK() + '</span>';

                            }
                            if (el.cms_video.reviewNum !== 0) {
                                cNum = '<span class="icon-tagComment">' + el.cms_video.reviewNum.toWK() + '</span>';
                            }

                            imgContent = (el.cms_video_attachment_logo.videoAttUrl.length === 0) ? "" : '<figure class="al-contentImgBox">' +
                            '<a href="' + el.cms_video.webStoragePath + '">' +
                            '<img src="' + el.cms_video_attachment_logo.videoAttUrl + '" alt="">' +
                            '<i class="al-videoPlayBtn">' +
                            '<img src="//img50.allinmd.cn/pages/index/videoPlay_btn.png" alt="">' +
                            '</i>' +
                            '<span class="al-videoTime">' + el.cms_video.playTime + '</span>' +
                            '</a>' +
                            '</figure>';
                            if(isSmallPhone&&bNum&&cNum&&imgContent&&_act){
                                _act = '<span style="color:'+_color+';border:1px solid '+_color+';padding:0 0.10667rem;margin-right: 0.26667rem;margin-bottom:0.2rem;border-radius: 0.02667rem;">'+el.activityTagName+'</span><br/>';
                            }
                            if(el.cms_video.videoAuthor&& $.trim(el.cms_video.videoAuthor)){
                                if(el.cms_video.videoType==17||el.cms_video.videoType==18||el.cms_video.videoType==19){
                                    uNameOrBName='<span class="al-contentAuthor bookNameIcon">'+el.cms_video_customer_auth.lastName+el.cms_video_customer_auth.firstName+'</span>';
                                }else{
                                    uNameOrBName='<span class="al-contentAuthor icon-contentAuthor">'+el.cms_video_customer_auth.lastName+el.cms_video_customer_auth.firstName+'</span>';//icon-contentAuthor
                                }
                            }else{
                                uNameOrBName="";
                            }
                            resTemplate = '<section class="al-contentPartModule">' + t.scoreDom(el.currentStarLevel ? el.currentStarLevel.currentStarLevel : undefined, el.currentStarLevel ? el.currentStarLevel.currentScoreNum : 0) +
                                '<section class="al-tableBox">' +
                                '<article class="al-contentText">' +
                                '<a href="' + el.cms_video.webStoragePath + '" class="al-contentTitle"><span>' + el.cms_video.videoName + '</span></a>' +
                                '<p class="al-contentOtherMsg">' +_act+
                                uNameOrBName +
                                bNum + cNum +
                                '</p>' +
                                '</article>' +
                                imgContent +
                                '</section>' +
                                '</section>';
                        }
                        break;
                    case "2":
                        if(el.customer_doc) {
                            if (el.customer_doc.browseNum !== 0) {
                                bNum = '<span class="icon-contentWatchedNum">' + el.customer_doc.browseNum.toWK() + '</span>';
                            }
                            if (el.customer_doc.reviewNum !== 0) {
                                cNum = '<span class="icon-tagComment">' + el.customer_doc.reviewNum.toWK() + '</span>';
                            }
                            imgContent = (el.cms_doc_attachment_logo.docAttUrl.length === 0) ? "" : '<figure class="al-contentImgBox">' +
                            '<a href="' + el.customer_doc.webStoragePath + '">' +
                            '<img src="' + el.cms_doc_attachment_logo.docAttUrl + '" alt="">' +
                            '</a>' +
                            '</figure>';
                            if(isSmallPhone&&bNum&&cNum&&imgContent&&_act){
                                _act = '<span style="color:'+_color+';border:1px solid '+_color+';padding:0 0.10667rem;margin-right: 0.26667rem;margin-bottom:0.2rem;border-radius: 0.02667rem;">'+el.activityTagName+'</span><br/>';
                            }
                            if(el.customer_doc.docAuthor&& $.trim(el.customer_doc.docAuthor)){
                                if(el.customer_doc.docType==17||el.customer_doc.docType==18||el.customer_doc.docType==19){
                                    uNameOrBName='<span class="al-contentAuthor bookNameIcon">'+el.customer_auth.lastName+el.customer_auth.firstName
                                        +'</span>';
                                }else{
                                    uNameOrBName='<span class="al-contentAuthor icon-contentAuthor">'+el.customer_auth.lastName+el.customer_auth.firstName
                                        +'</span>';//icon-contentAuthor
                                }
                            }else{
                                uNameOrBName="";
                            }
                            resTemplate = '<section class="al-contentPartModule">' + t.scoreDom(el.currentStarLevel ? el.currentStarLevel.currentStarLevel : undefined, el.currentStarLevel ? el.currentStarLevel.currentScoreNum : 0) +
                                '<section class="al-tableBox">' +
                                '<article class="al-contentText">' +
                                '<a href="' + el.customer_doc.webStoragePath + '" class="al-contentTitle"><span>' + el.customer_doc.docName + '</span></a>' +
                                '<p class="al-contentOtherMsg">' +_act+
                                uNameOrBName +
                                '<span class="icon-contentWatchedNum">' + el.customer_doc.browseNum.toWK() + '</span>' + cNum +
                                '</p>' +
                                '</article>' +
                                imgContent +
                                '</section>' +
                                '</section>';
                        }
                        break;
                    case "4":
                        if(el.cms_topic) {
                            if (el.cms_topic.browseNum !== 0) {
                                bNum = '<span class="icon-contentWatchedNum">' + el.cms_topic.browseNum.toWK() + '</span>';
                            }
                            if (el.cms_topic.reviewNum !== 0) {
                                cNum = '<span class="icon-tagComment">' + el.cms_topic.reviewNum.toWK() + '</span>';
                            }
                            imgContent = (el.cms_topic_attachment.topicAttUrl.length === 0) ? "" : '<figure class="al-contentImgBox">' +
                            '<a href="' + el.cms_topic.webStoragePath + '">' +
                            '<img src="' + el.cms_topic_attachment.topicAttUrl + '" alt="">' +
                            '</a>' +
                            '</figure>';
                            if(isSmallPhone&&bNum&&cNum&&imgContent&&_act){
                                _act = '<span style="color:'+_color+';border:1px solid '+_color+';padding:0 0.10667rem;margin-right: 0.26667rem;margin-bottom:0.2rem;border-radius: 0.02667rem;">'+el.activityTagName+'</span><br/>';
                            }
                            if(el.cms_topic_customer_auth.lastName && el.cms_topic_customer_auth.firstName){
                                uNameOrBName='<span class="al-contentAuthor icon-contentAuthor">'+el.cms_topic_customer_auth.lastName + el.cms_topic_customer_auth.firstName +'</span>';//icon-contentAuthor
                            }else{
                                uNameOrBName="";
                            }
                            resTemplate = '<section class="al-contentPartModule">' + t.scoreDom(el.currentStarLevel ? el.currentStarLevel.currentStarLevel : undefined, el.currentStarLevel ? el.currentStarLevel.currentScoreNum : 0) +
                                '<section class="al-tableBox">' +
                                '<article class="al-contentText">' +
                                '<a href="' + el.cms_topic.webStoragePath + '" class="al-contentTitle"><span>' + (el.cms_topic.topicName==""?'话题医起聊': el.cms_topic.topicName)+ '</span></a>' +
                                '<p class="al-contentOtherMsg">' +_act+
                                uNameOrBName +
                                '<span class="icon-contentWatchedNum">' + el.cms_topic.browseNum.toWK() + '</span>' + cNum +
                                '</p>' +
                                '</article>' +
                                imgContent +
                                '</section>' +
                                '</section>';
                        }
                        break;
                    case "7":
                        if(el.case_baseinfo) {
                            if (el.case_baseinfo.browseNum !== 0) {
                                bNum = '<span class="icon-contentWatchedNum">' + el.case_baseinfo.browseNum.toWK() + '</span>';
                            }
                            if (el.case_baseinfo.reviewNum !== 0) {
                                cNum = '<span class="icon-tagComment">' + el.case_baseinfo.reviewNum.toWK() + '</span>';
                            }
                            imgContent = (el.case_attachment.attUrl.length === 0) ? "" : '<figure class="al-contentImgBox">' +
                            '<a href="' + el.case_baseinfo.webStoragePath + '">' +
                            '<img src="' + el.case_attachment.attUrl + '" alt="">' +
                            '</a>' +
                            '</figure>';
                            if(isSmallPhone&&bNum&&cNum&&imgContent&&_act){
                                _act = '<span style="color:'+_color+';border:1px solid '+_color+';padding:0 0.10667rem;margin-right: 0.26667rem;margin-bottom:0.2rem;border-radius: 0.02667rem;">'+el.activityTagName+'</span><br/>';
                            }
                            if(el.case_customer_auth.lastName && el.case_customer_auth.firstName){
                                uNameOrBName='<span class="al-contentAuthor icon-contentAuthor">'+el.case_customer_auth.lastName + el.case_customer_auth.firstName +'</span>';//icon-contentAuthor
                            }else{
                                uNameOrBName="";
                            }
                            resTemplate = '<section class="al-contentPartModule">' + t.scoreDom(el.currentStarLevel ? el.currentStarLevel.currentStarLevel : undefined, el.currentStarLevel ? el.currentStarLevel.currentScoreNum : 0) +
                                '<section class="al-tableBox">' +
                                '<article class="al-contentText">' +
                                '<a href="' + el.case_baseinfo.webStoragePath + '" class="al-contentTitle"><span>' + el.case_baseinfo.caseName + '</span></a>' +
                                '<p class="al-contentOtherMsg">' +_act+
                                uNameOrBName +
                                '<span class="icon-contentWatchedNum">' + el.case_baseinfo.browseNum.toWK() + '</span>' + cNum +
                                '</p>' +
                                '</article>' +
                                imgContent +
                                '</section>' +
                                '</section>';
                        }
                        break;

                }
                htmlDom+=resTemplate;

            });
            if(replaceHtml){
                $(".EV-discoverTypeFilter").html(htmlDom);
            }else{
                $(".EV-discoverTypeFilter").append(htmlDom);
            }
        },
        // 动态获取筛选条件
        getContentFilter: function() {
            var that = this;
            var data = {
                filterSence: 2,
                filterSenceType: 0,
                isValid: 1,
                leFilterTreeLevel: 2,
            };
            var filterList, templateFilter1;
            $.ajax({
                    url: that.XHRList.filter,
                    type: 'get',
                    dataType: 'json',
                    async: false,
                    data: {
                        paramJson: $.toJSON(data)
                    },
                })
                .done(function(data) {
                    filterList = data.responseObject.responseData.data_list[0].childrenList;
                    var newArr = [];
                    var allItem = "";
                    $(filterList).each(function(index, el) {
                        switch (el.refType) {
                            case 1:
                                newArr[0] = el;
                                break;
                            case 4:
                                newArr[3] = el;
                                break;
                            case 2:
                                newArr[2] = el;
                                break;
                            case 7:
                                newArr[1] = el;
                                break;
                        }
                    });
                    $(newArr).each(function(index, el) {
                        switch (el.refType) {
                            case 1:
                                allItem = "全部视频";
                                break;
                            case 4:
                                allItem = "全部话题";
                                break;
                            case 2:
                                allItem = "全部文库";
                                break;
                            case 7:
                                allItem = "全部病例";
                                break;
                        }
                        var templateFilter2 = '<section class="al-twoFloorSecondFilterBox" data-role="' + el.refType + '">' +
                            '<p class="al-twoFloorSecondFilterItem" refsecondtype="" reftype="' + el.refType + '">' + allItem + '</p>',
                            templateFilter2Item = "",
                            templateFilter1 = '<article class="al-twoFloorFirstFilterItem" data-role="' + el.refType + '" refType="' + el.refType + '">' + el.refName + '</article>';
                        $(".al-twoFloorFirstFilter").append(templateFilter1);

                        $(el.childrenList).each(function(index2, el2) {
                            templateFilter2Item += '<p class="al-twoFloorSecondFilterItem" refSecondType="' +
                                el2.refSecondType + '" refType="' +
                                el2.refType + '" refId="'+el2.refId+'">' +
                                el2.refName +
                                '</p>';

                        });
                        templateFilter2 = templateFilter2 + templateFilter2Item + '</section>';

                        $(".al-twoFloorSecondFilter").append(templateFilter2);
                    });
                    that.preSelectFilter();

                })
                .fail(function() {
                    //console.log("XHR Error...");
                });
        },
        // 数据瀑布流加载
        dataWaterfall: function(rObj,pageIndex) {
            var that = this;
            var num = pageIndex||2;
            var data = {
                refType: rObj.refType,
                refSecondType: rObj.refSecondType,
                sortType: rObj.sortType,
                attUseFlag: 3,
                logoUseFlag: 3,
                pageSize: 20,
                pageIndex: num,
                useFlag:12
            };
            var _type = rObj.refType;
            $('.EV-discoverTypeFilter').off("scroll").scrollPagination({
                'contentPage': this.XHRList.list,
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
                        $(".EV-discoverTypeFilter").attr('scrollPagination', 'disabled');
                        return false;
                    } else {
                        if ($.isEmptyObject(res.responseObject.responseData) || (res.responseObject.responseData.data_list && res.responseObject.responseData.data_list.length === 0)) {

                            $(".EV-discoverTypeFilter").attr('scrollPagination', 'disabled');
                            return false;
                        } else {
                            console.log(2);
                            that.contentGenerate(res.responseObject.responseData.data_list, rObj);
                        }
                    }

                }
            });
        },
        // 分享内容获取
        share: function() {
            var that = this;
            var data = {
                refType: $(".al-twoFloorSecondFilterItem.active").attr('reftype'),
                refSecondType: $(".al-twoFloorSecondFilterItem.active").attr('refsecondtype'),
                sortType: $(".al-oneFloorFilterItem.active").attr('data-sort'),
                attUseFlag: 3,
                logoUseFlag: 3,
                pageIndex: 1,
                pageSize: 20,
                sceneType: 14,
                themeType: 0,
                resourceType: 0,
            };
            var shareData;
            shareAll({
                fnMessageSuc: function() {
                    comm.shareLog({
                        shareType: "",
                        resourceId: "",
                        resourceType: "",
                        refId: "",
                        isValid: 1,
                        shareSence: 56,
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
                        shareSence: 56,
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
                            shareSence: 56,
                            shareChannel: 1,
                            shareContent: that.shareObj.summary
                        });
                    } else if (x === 'sina') {
                        comm.shareLog({
                            shareType: "",
                            resourceId: "",
                            resourceType: "",
                            refId: "",
                            isValid: 1,
                            shareSence: 56,
                            shareChannel: 3,
                            shareContent: that.shareObj.sinaTitle
                        });
                    }
                },
                triggerRequest:function(){
                    $.ajax({
                        url: that.XHRList.share,
                        type: 'POST',
                        dataType: 'json',
                        data: {
                            paramJson: $.toJSON(data)
                        },
                        async: false
                    })
                        .done(function(data) {
                            if (typeof(data.responseObject.responseData.data_list) !== 'undefined' && data.responseObject.responseData.data_list) {
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
                                shareData = that.shareObj;
                            }
                        })
                        .fail(function() {
                            //console.log("XHR error...");
                        });
                    return shareData;
                }
            }, false, $('.al-scrollShareBtn'));

        }
    };

    // 实例化 动态加载开始
    var discoverType = new DiscoverType();
    discoverType.init();
});
