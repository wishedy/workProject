$(function() {

    //区分他人与自己时
    var cid = getpara().cid&&getpara().cid.replace(/"/g,"");
    var uid = localStorage.getItem('userId');
    var isSelf = false;

    if (cid === uid || location.pathname === "/pages/personal/personal_contribution.html") {
        isSelf = true;
        if (location.pathname !== "/pages/personal/personal_contribution.html") {
          g_sps.jump(null,"/pages/personal/personal_contribution.html");
        }
    }

    //未登录
    if (isSelf && !uid) {
        $(".ev-subNav").hide();
        $('.ev-list').append(module.listTemplate.notLoginTemplate());
        return false;
    }

    if (isSelf) {
        //window.onload = Log.createBrowse(64, '我的贡献页面');
    } else {
        //window.onload = Log.createBrowse(67, '他人的贡献页面');
    }
    var dataFlag = isSelf ? 4 : 5;

    //贡献——下拉菜单
    $(".al-personalContributionSelector h2").on("click", function(e) {
        e.stopPropagation();

        if ($(".al-personalContributionSelector").hasClass('al-personalSelectorOn')) {
            $(".al-personalContributionSelector").removeClass('al-personalSelectorOn');
        } else {
            $(".al-personalContributionSelector").addClass('al-personalSelectorOn');
        }
        return false;
    });

    $(".al-personalContributionSelector ul").find("li").on("click", function() {
        $(".ev-list").html('').removeAttr('scrollpagination');
        switch ($(this).attr("data-ev")) {
            case "all":
                $(".al-personalContributionSelector h2").text("全部");
                initContribution(null);
                //埋点
                comm.creatEvent({
                    triggerType:'全部类型 -全部',
                    keyword:"全部类型 -全部",
                    actionId:51
                });
                break;
            case "video":
                $(".al-personalContributionSelector h2").text("视频");
                initContribution(1);
                //埋点
                comm.creatEvent({
                    triggerType:'全部类型 -视频',
                    keyword:"全部类型 -视频",
                    actionId:53
                });
                break;
            case "doc":
                $(".al-personalContributionSelector h2").text("文库");
                initContribution(2);
                //埋点
                comm.creatEvent({
                    triggerType:'全部类型 -文库',
                    keyword:"全部类型 -文库",
                    actionId:54
                });
                break;
            case "topic":
                $(".al-personalContributionSelector h2").text("话题");
                initContribution(4);
                //埋点
                comm.creatEvent({
                    triggerType:'全部类型 -话题',
                    keyword:"全部类型 -话题",
                    actionId:55
                });
                break;
            case "case":
                $(".al-personalContributionSelector h2").text("病例");
                initContribution(7);
                //埋点
                comm.creatEvent({
                    triggerType:'全部类型 -病例',
                    keyword:"全部类型 -病例",
                    actionId:52
                });
                break;
            default:
        }
        $(this).addClass('active').siblings().removeClass('active');
        $(".al-personalContributionSelector").removeClass('al-personalSelectorOn');
    });


    initContribution("");

    function initContribution(refType) {
        var url = M_CALL + 'customer/trends/getMapList/';
        var params = {
            paramJson: $.toJSON({
                customerId: cid,
                opId: 0,
                resourceType: refType, //类型变化
                trendTypes : "1,2,4,7",
                dataFlag: dataFlag,
                logoUseFlag: 3,
                useFlag:3,
                attUseFlag: AttUseFlag.e, //300*200 新的
                visitSiteId: 2,
                pageIndex: 1,
                pageSize: 20
            })
        };
        comm.loading.show();
        $.ajax({
            url: url,
            data: params,
            type: 'post',
            success: function(data) {
                comm.loading.hide();
                dataList(data, refType);
                if(!getpara().cid){
                    waterfall();
                }else{
                    ohterWaterfall();
                }
            }
        });

        function label(type) {
            var word = '';
            switch (type) {
                case 1:
                    word = '视频';
                    break;
                case 2:
                    word = '文库';
                    break;
                case 4:
                    word = '话题';
                    break;
                case 7:
                    word = '病例';
                    break;
                default:
                    word = '全部';
            }
            return word;
        }

        function dataList(data, refType) {
            var result = AjaxResult(data);
            $(".labelsType").text(label(refType));
            $(".contributionNum").text(!result.total_count ? 0 : result.total_count);

            if (result.total_count > 0 || $.trim($(".ev-list").text())!="") {
                if(result==false){ //瀑布流后无数据时
                    $(".ev-list").append(html).attr('scrollPagination', 'disabled');
                    $(".ev-list").append(module.listTemplate.nullDataTemplate);
                    return false;
                }

                result = result.data_list;
                var html = '';
                for (var x = 0; x < result.length; x++) {
                    if(result[x].resource_valid.resourceValid!=3){//已删除的资源
                        html += module.listTemplate.commonList(AjaxAdapter(result[x]), isSelf);
                    }
                }

                if (result.length < 20) {
                    $(".ev-list").append(html).attr('scrollPagination', 'disabled');
                    $(".ev-list").append(module.listTemplate.nullDataTemplate);
                } else {
                    $(".ev-list").append(html);
                }
            } else {
                 $(".ev-subNav").hide();
                if (isSelf) {
                    $(".ev-list").html(module.listTemplate.contributionNullData()).attr('scrollPagination', 'disabled');
                    //发布
                    comm.uploadBtn($(".al-personalPushContribution"));

                } else {
                    $(".ev-list").html(module.listTemplate.contributionNullDataOther()).attr('scrollPagination', 'disabled');
                }
            }
        }

        function AjaxResult(data) {
            if (data && data.responseObject.responseStatus && data.responseObject.responseData.data_list) {
                return data.responseObject.responseData;
            }
            return false;
        }

        function AjaxAdapter(data) {
            var kv = {};
            var trends = data.customer_trends;
            var isOthers = /others_contribution/g.test(window.location.href);
            switch (data.customer_trends_type) {
                case 1:
                    kv = {
                        refType: 1,
                        resourceType:trends.resourceType,
                        title: htmlToString(trends.resourceName),
                        author: data.customer_auth.lastName + data.customer_auth.firstName,
                        browseNum: data.resource_valid.browseNum.toWK(),
                        reviewNum: data.resource_valid.reviewNum.toWK(),
                        picLogo: data.cms_video_attachment_logo.videoAttUrl,//data.cms_video_attachment_logo.videoAttUrl,
                        refUrl: trends.resourceUrl,
                        playTime: data.resource_valid.playTime,
                        preferNum: data.resource_valid.preferUpNum.toWK(),
                        resourceIsValid:data.resource_valid.resourceValid,
                        score:data.currentStarLevel,
                        scoreNum:isOthers?0:data.currentScoreNum,
                        isShowActivityTag:data.resource_valid.isShowActivityTag,
                        activityTagName:data.resource_valid.activityTagName,
                        activityTagColor:data.resource_valid.activityTagColor
                    };
                    break;
                case 2:
                    kv = {
                        refType: 2,
                        resourceType:trends.resourceType,
                        title: htmlToString(trends.resourceName),
                        author: data.customer_auth.lastName + data.customer_auth.firstName,
                        browseNum: data.resource_valid.browseNum.toWK(),
                        reviewNum: data.resource_valid.reviewNum.toWK(),
                        picLogo: data.cms_doc_attachment_logo.docAttUrl,
                        refUrl: data.resource_valid.tpl_Path==286?"/pages/eBook/eBook_details.html?bId="+trends.resourceId:trends.resourceUrl,
                        preferNum: data.resource_valid.preferUpNum.toWK(),
                        resourceIsValid:data.resource_valid.resourceValid,
                        score:data.currentStarLevel,
                        scoreNum:isOthers?0:data.currentScoreNum,
                        isShowActivityTag:data.resource_valid.isShowActivityTag,
                        activityTagName:data.resource_valid.activityTagName,
                        activityTagColor:data.resource_valid.activityTagColor
                    };
                    break;
                case 4:
                    kv = {
                        refType: 4,
                        resourceType:trends.resourceType,
                        title: trends.resourceName === "" ? htmlToString(trends.trendContent) : htmlToString(trends.resourceName),
                        author: data.customer_auth.lastName + data.customer_auth.firstName,
                        browseNum: data.resource_valid.browseNum.toWK(),
                        reviewNum: data.resource_valid.reviewNum.toWK(),
                        picLogo: data.cms_topic_attachment_logo.topicAttUrl,
                        refUrl: trends.resourceUrl,
                        preferNum: data.resource_valid.preferUpNum.toWK(),
                        resourceIsValid:data.resource_valid.resourceValid,
                        isShowActivityTag:data.resource_valid.isShowActivityTag,
                        activityTagName:data.resource_valid.activityTagName,
                        activityTagColor:data.resource_valid.activityTagColor
                    };
                    break;
                case 7:
                    kv = {
                        refType: 7,
                        resourceType:trends.resourceType,
                        title: htmlToString(trends.resourceName),
                        author: data.customer_auth.lastName + data.customer_auth.firstName,
                        browseNum: data.resource_valid.browseNum.toWK(),
                        reviewNum: data.resource_valid.reviewNum.toWK(),
                        picLogo: data.case_attachment_logo.attUrl,
                        refUrl: trends.resourceUrl,
                        preferNum: data.resource_valid.preferUpNum.toWK(),
                        resourceIsValid:data.resource_valid.resourceValid,
                        score:data.currentStarLevel,
                        scoreNum:isOthers?0:data.currentScoreNum,
                        isShowActivityTag:data.resource_valid.isShowActivityTag,
                        activityTagName:data.resource_valid.activityTagName,
                        activityTagColor:data.resource_valid.activityTagColor
                    };
                    break;
                default:
            }
            return kv;
        }

        function ohterWaterfall() { //瀑布流
            $(".ev-list").scrollPagination({
                'contentPage': url,
                'contentData': {
                    customerId: getpara().cid,
                    opId: 0,
                    resourceType: function() {
                        if (params.paramJson) {
                            params = JSON.parse(params.paramJson);
                        }

                        return params.resourceType;
                    }, //类型变化params.refType
                    trendTypes: "1,2,4,7",
                    dataFlag: dataFlag,
                    logoUseFlag: 3,
                    useFlag: 3,
                    attUseFlag: AttUseFlag.e, //300*200 新的
                    visitSiteId: 2,
                    pageIndex: function() {
                        if (params.paramJson) {
                            params = JSON.parse(params.paramJson);
                        }
                        params.pageIndex = params.pageIndex + 1;
                        return params.pageIndex;
                    },
                    pageSize: 20
                },
                'scrollTarget': $(window),
                'heightOffset': 10,
                'delaytime': 0,
                'beforeLoad': function() { comm.loading.show(); },
                'afterLoad': function(elementsLoaded) { comm.loading.hide(); },
                'loader': function(data) {
                    if($("[scrollPagination]").attr("scrollPagination") =="enabled"){
                        dataList(data);
                    }
                }
            });
        }

        function waterfall() { //瀑布流
            $(".ev-list").scrollPagination({
                'contentPage': url,
                'contentData': {
                    useFlag: 3,
                    opId: 0,
                    resourceType: function() {
                        if (params.paramJson) {
                            params = JSON.parse(params.paramJson);
                        }

                        return params.resourceType;
                    }, //类型变化params.refType
                    dataFlag: dataFlag,
                    logoUseFlag: 3,
                    attUseFlag: AttUseFlag.e, //300*200 新的
                    visitSiteId: 2,
                    pageIndex: function() {
                        if (params.paramJson) {
                            params = JSON.parse(params.paramJson);
                        }
                        params.pageIndex = params.pageIndex + 1;
                        return params.pageIndex;
                    },
                    pageSize: 20
                },
                'scrollTarget': $(window),
                'heightOffset': 10,
                'delaytime': 0,
                'beforeLoad': function() { comm.loading.show(); },
                'afterLoad': function(elementsLoaded) { comm.loading.hide(); },
                'loader': function(data) {
                    if($("[scrollPagination]").attr("scrollPagination") =="enabled"){
                        dataList(data);
                    }
                }
            });
        }
    }
});
/*
*
* 收藏评论
* url= M_CALL+"collection/json_list/";
*
* collectionType:8
 attUseFlag:2
 logoUseFlag:3
 customerId:1403850301790
 sessionCustomerId:1403850301790
 pageIndex:1
 pageSize:20
*
* */
