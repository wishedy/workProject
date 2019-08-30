/**
 * 功能描述：  发现——按疾病筛选
 * 使用方法:
 * 注意事件：    
 * 引入来源：  作用：
 *
 * Created by QiangKaiLiang on 2016/08/27.
 */

$(function() {
    var DiscoverDisease = function() {
        var that = this;
        var $that = $(this);
        this.XHRList = {
            filter: '/mcall/comm/data/filter/getMapList/',
            list: '/mcall/discovery/search/getMapListByProperty/',
            share: '/mcall/comm/data/share/getMapList3/'
        };
    };
    DiscoverDisease.prototype = {
        init: function() {
            var that = this;
            //window.onload = Log.createBrowse(45, '按疾病');
            this.backBtn();
            this.layout();
            this.getFilterItem();
            this.getContentList({
                tagId: $(".al-twoFloorSecondFilterItem.active").attr("refid"),
                dataScene: $(".EV-filterScene.active").data("scene"),
                dataType: $(".EV-filterType.active").data("type")
            });
            this.dataWaterfall();
            if (typeof(comm.getpara().tId) !== 'undefined') {
                $(".al-typeFilterMainMask").removeClass('active');
                $(".al-discoverMask").removeClass('show');
                $(".al-typeFilterNavbarItem").removeClass('active');
                $("body").unbind("touchmove");
            }
        },
        backBtn: function() { //四个频道首页跳转跳回
            $('.ev_backBtn').off('click').click(function() {
                comm.creatEvent({
                    triggerType:'全站功能按钮点击',
                    keyword:"返回",
                    actionId:41,
                    async:false
                });
                if (document.referrer) {
                  g_sps.jump(null,document.referrer);
                } else {
                  g_sps.jump(null,'/pages/discover/discover_index.html');
                }
                return false;
            });
        },
        layout: function() {
            var fH = $(".al-headFilterBox").height();
            var that = this;
            $(".al-content").css("marginTop", fH);

            $(".al-twoFloorSecondFilter").on("click", ".al-twoFloorSecondFilterItem", function(e) {
                comm.creatEvent({
                    triggerType:'按专业-筛选',
                    keyword:$(this).text(),
                    actionId:50
                });
                that.getContentList({
                    tagId: $(this).attr("refid"),
                    dataType: $(".EV-filterType.active").data("type"),
                    dataScene: $(".EV-filterScene.active").data("scene")
                });
                $("html,body,.al-mainInner").css({ "overflow": "auto", "height": "auto" });
                $(window).scrollTop($('html').attr('sT')||0);
                $('.EV-discoverDiseaseFilter').children().remove();
                $(".EV-discoverProfessionFilter").attr('scrollPagination', 'enabled');
                that.wNum = 2;
            });
            $(".EV-filterType").on("click", function() {
                var type = $(this).data('type');
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
                    keyword:$(this).text(),
                    actionId:_actionId
                });
                $("html,body,.al-mainInner").css({ "overflow": "auto", "height": "auto" });
                $(".al-typeFilterMainMask[data-role='type']").removeClass('active');
                $(".al-typeFilterNavbarItem[data-role='type']").removeClass('active');
                $(this).addClass('active').siblings().removeClass('active');
                that.getContentList({
                    tagId: $(".al-twoFloorSecondFilterItem.active").attr("refid"),
                    dataScene: $(".EV-filterScene.active").data("scene"),
                    dataType: $(this).data('type')
                });
                $('.EV-discoverDiseaseFilter').children().remove();
                $(".al-discoverMask").removeClass('show');
                $(".al-typeFilterNavbarItem[data-role='type'] span").text($(this).text());
                $(".EV-discoverProfessionFilter").attr('scrollPagination', 'enabled');
                that.wNum = 2;

            });
            $(".EV-filterScene").on("click", function() {
                comm.creatEvent({
                    triggerType:'列表资源排序',
                    keyword:$(this).text(),
                    actionId:$(this).index()+46
                });
                $("html,body,.al-mainInner").css({ "overflow": "auto", "height": "auto" });
                $(".al-typeFilterMainMask[data-role='sort']").removeClass('active');
                $(".al-typeFilterNavbarItem[data-role='sort']").removeClass('active');
                $(this).addClass('active').siblings().removeClass('active');
                that.getContentList({
                    tagId: $(".al-twoFloorSecondFilterItem.active").attr("refid"),
                    dataScene: $(this).data('scene'),
                    dataType: $(".EV-filterType.active").data("type")
                });
                $('.EV-discoverDiseaseFilter').children().remove();
                $(".al-discoverMask").removeClass('show');
                $(".al-typeFilterNavbarItem[data-role='sort'] span").text($(this).text());
                $(".EV-discoverProfessionFilter").attr('scrollPagination', 'enabled');
                that.wNum = 2;
            });


        },
        getContentList: function(rObj) {
            var that = this;
            var data = {
                tagId: rObj.tagId||0,
                pageIndex: 1,
                pageSize: 20,
                dataScene: rObj.dataScene||4,
                dataType: rObj.dataType||0,
                scene: 2,
                sessionCustomerId:TempCache.getItem('userId')||"",
                platformId:TempCache.getItem('department')||1
            };
            var cTemplate = "";
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
                .done(function(data) {
                    comm.loading.hide();
                    var cList = data.responseObject.responseData.data_list;
                    if(cList!=undefined&&cList.length){
                        $(cList).each(function(index, ele) {
                            that.contentGenerate(ele);
                        });

                        that.share();
                        $('.ev_noContent').hide();
                    }else{
                        $('.ev_noContent').show();
                    }

                })
                .fail(function() {
                    console.log("XHR error...");
                    comm.loading.hide();
                    $('.ev_noContent').show();
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
        contentGenerate: function(ele) {
            var t=this;
            var vMark = '',
                imgPart = '',
                bNum = '',
                cNum = '';
            var _act ="";
            var isSmallPhone = $(window).width()<=640;
            if (ele.browseNum.length !== 0) {
                bNum = '<span class="icon-contentWatchedNum">' + ele.browseNum.toWK() + '</span>';

            }
            if (ele.reviewNum.length !== 0) {
                cNum = '<span class="icon-tagComment">' + ele.reviewNum.toWK() + '</span>';
            }
            if (ele.itemType == 1) {
                vMark = '<i class="al-videoPlayBtn">' +
                    '<img src="//img50.allinmd.cn/pages/index/videoPlay_btn.png" alt="">' +
                    '</i>' +
                    '<span class="al-videoTime">' + ele.playTime + '</span>';
            }

            if (ele.picUrl.length !== 0) {
                imgPart = '<figure class="al-contentImgBox">' +
                    '<a href="' + ele.itemUrl + '">' +
                    '<img src="' + ((ele.picUrl.indexOf('|') != -1) ? ele.picUrl.split("|")[0] : ele.picUrl) + '" alt="">' +
                    vMark +
                    '</a>' +
                    '</figure>';
            }
            if(ele.isShowActivityTag==1){
                var _color = ele.activityTagColor;
                if(isSmallPhone&&bNum&&cNum&&imgPart){
                    _act = '<span style="color:'+_color+';border:1px solid '+_color+';padding:0 0.10667rem;margin-right: 0.26667rem;margin-bottom:0.2rem;border-radius: 0.02667rem;display:inline-block;">'+ele.activityTagName+'</span><br/>';
                }else{
                    _act = '<span style="color:'+_color+';border:1px solid '+_color+';padding:0 0.10667rem;margin-right: 0.26667rem;border-radius: 0.02667rem;">'+ele.activityTagName+'</span>';
                }
            }

            if(ele.itemType==4 && ele.itemTitle ==""){
                ele.itemTitle = '话题医起聊';
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
            cTemplate = ' <section class="al-contentPartModule">' +t.scoreDom(ele.currentStarLevel,ele.currentScoreNum)+
                '<section class="al-tableBox">' +
                '<article class="al-contentText">' +
                '<a href="' + ele.itemUrl + '" class="al-contentTitle"><span>' + ele.itemTitle + '</span></a>' +
                '<p class="al-contentOtherMsg">' +_act+
                uNameOrBName +
                bNum + cNum +
                '</p>' +
                '</article>' +
                imgPart +
                '</section>' +
                '</section>';
            $(".EV-discoverDiseaseFilter").append(cTemplate);




        },
        getFilterItem: function() {
            var that = this;
            var data = {
                filterSence: 1,
                filterSenceType: 1,
                isValid: 1,
                leFilterTreeLevel: 2,
                customerId:TempCache.getItem('userId')||"",
                sessionCustomerId:TempCache.getItem('userId')||"",
                platformId:TempCache.getItem('department')||1
            };
            var fTemplate = "",
                sTemplate = "";

            $.ajax({
                    url: this.XHRList.filter,
                    type: 'post',
                    dataType: 'json',
                    data: {
                        paramJson: $.toJSON(data)
                    }
                })
                .done(function(data) {
                    if(data&&data.responseObject.responseData&&data.responseObject.responseData.data_list&&data.responseObject.responseData.data_list.length){
                        var fList = data.responseObject.responseData.data_list[0].childrenList;
                        var sList = "",
                            fullFilter = '<article class="al-twoFloorSecondFilterItem" refid="0" fpid="1472519088582"><span>全部资源</span></article>' +
                            '<article class="al-twoFloorSecondFilterItem al-choiceLine">' +
                            '<span>精选</span>' +
                            '</article>';
                        $(fList).each(function(index, ele) {
                            var sTemplateList = "";
                            fTemplate = '<article class="al-twoFloorFirstFilterItem" refType="' + ele.refType + '" data-role="' + ele.filterId + '">' +
                                '<span>' + ele.refRename + '</span>' +
                                '</article>';
                            if (ele.refId === 0) {
                                $('.EV-firstTemplateBox').prepend(fTemplate);
                                sList = ele.childrenList;
                                $(sList).each(function(index, ele2) {
                                    sTemplateList += '<article class="al-twoFloorSecondFilterItem" refId="' + ele2.refId + '" fpid="' + ele2.filterParentId + '">' +
                                        '<span>' + ele2.refRename + '</span>' +
                                        '</article>';
                                });
                                sTemplate = '<section class="al-twoFloorSecondFilterBox" data-role="' + ele.filterId + '">' +
                                    fullFilter + sTemplateList +
                                    '</section>';
                                $(".al-twoFloorSecondFilter").prepend(sTemplate);

                            } else {
                                $('.EV-firstTemplateBox').append(fTemplate);
                                sList = ele.childrenList;
                                $(sList).each(function(index, ele2) {
                                    sTemplateList += '<article class="al-twoFloorSecondFilterItem" refId="' + ele2.refId + '" fpid="' + ele2.filterParentId + '">' +
                                        '<span>' + ele2.refRename + '</span>' +
                                        '</article>';
                                });
                                sTemplate = '<section class="al-twoFloorSecondFilterBox" data-role="' + ele.filterId + '">' +
                                    sTemplateList +
                                    '</section>';

                                $(".al-twoFloorSecondFilter").append(sTemplate);
                            }


                        });
                        comm.loading.hide();
                    }
                    comm.twoFilterController();
                    that.preSelectFilter();
                    //(function() {
                    //    var myscroll_first = new IScroll("#wrapper_first", {
                    //        preventDefault: false,
                    //        onBeforeScrollStart: function(e) {
                    //            e.preventDefault();
                    //        },
                    //        snap: true,
                    //        hScrollbar: false
                    //    });
                    //    var myscroll_second = new IScroll("#wrapper_second", {
                    //        preventDefault: false,
                    //        onBeforeScrollStart: function(e) {
                    //            e.preventDefault();
                    //        },
                    //        snap: true,
                    //        hScrollbar: false
                    //    });
                    //})();
                })
                .fail(function() {
                    console.log("XHR error...");
                    comm.loading.hide();
                });

        },
        preSelectFilter: function() {
            var obj = comm.getpara();
            $('.al-twoFloorFirstFilterItem').removeClass('selected');
            $('.al-twoFloorSecondFilterBox').removeClass('selected');
            $('.al-twoFloorSecondFilterItem').removeClass('active');
            if (typeof(obj.type) !== "undefined") {
                $('.al-twoFloorSecondFilterItem[refid="' + obj.tId + '"]').addClass('active');
                var fpId = $('.al-twoFloorSecondFilterItem[refid="' + obj.tId + '"]').parent().attr("data-role");
                $('.al-twoFloorSecondFilterBox[data-role="' + fpId + '"]').addClass('selected');
                $('.al-twoFloorFirstFilterItem[data-role="' + fpId + '"]').addClass('selected');


            } else {
                $('.al-twoFloorFirstFilterItem').eq(0).addClass('selected');
                $('.al-twoFloorSecondFilterBox').eq(0).addClass('selected');
                $('.al-twoFloorSecondFilterItem').eq(0).addClass('active');
            }


            $(".al-oneFloorFilterItem").removeClass('active');
            $(".EV-filterType[data-type='" + (obj.type || '0') + "']").addClass('active');
            $(".al-typeFilterNavbarItem[data-role='type'] span").text($('.EV-filterType.active').text() === "全部" ? "全部类型" : $('.EV-filterType.active').text());
            $(".EV-filterScene[data-scene='" + (obj.scene || '4') + "']").addClass('active');
            $(".al-typeFilterNavbarItem[data-role='sort'] span").text($('.EV-filterScene.active').text());
        },
        dataWaterfall: function(rObj) {
            var that = this;
            this.wNum = 2;
            var data = {
                tagId: $('.al-twoFloorSecondFilterItem.active').attr('refid')||0,
                pageIndex: 1,
                pageSize: 20,
                dataScene: $('.EV-filterScene.active').data('scene')||4,
                dataType: $('.EV-filterType.active').data('type')||0,
                scene: 2,
                sessionCustomerId:TempCache.getItem('userId')||"",
                platformId:TempCache.getItem('department')||1
            };

            $('.EV-discoverDiseaseFilter').off("scroll").scrollPagination({
                'contentPage': this.XHRList.list,
                'contentData': $.extend(data, {
                    pageIndex: function() {
                        return that.wNum++;
                    },
                    dataScene:function(){return $('.EV-filterScene.active').data('scene');},
                    dataType: function(){return $('.EV-filterType.active').data('type');},
                    tagId: function() {
                        return $('.al-twoFloorSecondFilterItem.active').attr('refid');
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
                        $(".EV-discoverDiseaseFilter").attr('scrollPagination', 'disabled');
                        return false;
                    } else {
                        if ($.isEmptyObject(res.responseObject.responseData) || (res.responseObject.responseData.data_list && res.responseObject.responseData.data_list.length === 0)) {

                            $(".EV-discoverDiseaseFilter").attr('scrollPagination', 'disabled');
                            return false;
                        } else {
                            $(res.responseObject.responseData.data_list).each(function(index, ele) {
                                that.contentGenerate(ele);
                            });
                        }
                    }

                }
            });
        },
        share: function() {
            var that = this;

            var data = {
                tagId: $('.al-twoFloorSecondFilterItem.active').attr('refid'),
                pageIndex: 1,
                pageSize: 20,
                dataScene: $('.EV-filterScene.active').attr('data-scene'),
                dataType: $('.EV-filterType.active').attr('data-type'),
                scene: 2,
                sceneType: 21,
                platformId:TempCache.getItem('department')||1,
                sessionCustomerId:TempCache.getItem('userId')||""
            };
            shareAll({
                fnMessageSuc: function() {
                    comm.shareLog({
                        shareType: "",
                        resourceId: "",
                        resourceType: "",
                        refId: "",
                        isValid: 1,
                        shareSence: 54,
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
                        shareSence: 54,
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
                            shareSence: 54,
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
                            shareSence: 54,
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
                        async: false,
                    })
                        .done(function(data) {
                            comm.loading.hide();
                            if (data.responseObject.responseData.data_list && data.responseObject.responseData.data_list.length !== 0) {
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
                            }
                        })
                        .fail(function() {
                            console.log("XHR error...");

                        });
                    return that.shareObj;
                }
            }, false, $('.al-scrollShareBtn'));

        }
    };
    var discoverDisease = new DiscoverDisease();
    discoverDisease.init();
});
