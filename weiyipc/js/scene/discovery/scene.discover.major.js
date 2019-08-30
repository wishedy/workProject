/**
 * @name:   按专业，术士，疾病
 * @desc:
 * @example:
 * @depend:
 * @date: 2016/8/5
 * @author: sunhaibin
 */

$(function() {
    var paraType ={ //共用参数
        getWhich:function(){
            var name='按专业';
            var logId=44;
            var pageId=464;
            var shareSence=shareSenceConst.discover_by_major ;
            var disType = comm.getpara().type||comm.getpara('#').type;      //major,disease,operation,resource
            var getShareContent;
            switch(disType){
                case "major":
                    name='按专业';
                    document.title='按专业筛选－百余种专业,想你所想,唯医,allinmd';
                    $('meta[name="keywords"]').attr('content','关节，脊柱，创伤，足踝，专业筛选，资源筛选，医学资源，唯医,allinmd，骨科学组，常见病')
                    logId=44;
                    pageId=464;
                    shareSence=shareSenceConst.discover_by_major;
                    getShareContent =getShareContentSense.by_major;
                    break;
                case "disease":
                    name='按疾病';
                    document.title='按疾病筛选－疾病分类,查找便捷,唯医,allinmd';
                    $('meta[name="keywords"]').attr('content','脱位，骨折，畸形，损伤，内外翻，疾病筛选，资源筛选，医学资源，唯医,allinmd，骨科常见病，骨科多发病')
                    logId=45;
                    pageId=466;
                    shareSence=shareSenceConst.discover_by_disease;
                    getShareContent =getShareContentSense.by_disease;
                    break;
                case "operation":
                    name='按术式';
                    document.title='按术式筛选－术式不同,资源也不同,唯医,allinmd';
                    $('meta[name="keywords"]').attr('content','置换术，融合术，翻修术，离断术，显微外科手术，术式筛选，资源筛选，医学资源，唯医,allinmd，骨科手术')
                    logId=46;
                    pageId=465;
                    shareSence=shareSenceConst.discover_by_operation;
                    getShareContent =getShareContentSense.by_operation;
                    break;
                case "resource":
                    name="按类型";
                    logId=48;
                    pageId=424;
                    shareSence=shareSenceConst.discover_by_type;
                    getShareContent =getShareContentSense.by_type;
                    document.title='按类型筛选－资源类型,筛选简单,唯医,allinmd';
                    $('meta[name="keywords"]').attr('content','医学视频，医学病例，医学话题，医学文库，类型筛选，资源筛选，医学资源，唯医,allinmd')
                    break;
            }
            return{
                getName:function(){
                    return name;
                },
                getLogId:function(){
                    return logId;
                },
                getPageId:function(){
                    return pageId;
                },
                getShareSence:function(){
                    return shareSence;
                },
                getShareContent:function(){
                    return getShareContent;
                }
            }
        },
        path:{
            byType_tag:PC_CALL+'comm/data/filter/getMapList/',        //按类型搜索类型接口
            byType_res:PC_CALL+'discovery/search/getMapByType/',        //按类型搜索资源接口
            byMajor:PC_CALL+'discovery/search/getMapListByProperty/',        //按专业疾病术士
            getShareContent:PC_CALL+'comm/data/share/getMapList3/'          //分享话术
        },
        isQuery:false,
        //点击全部样式交互
        searchChangeStyle:function(){
            $('.al_searchType').click(function(){
                if($('.al-discover-ulBox').is(':visible')){
                    $('.al-discover-ulBox').hide();
                    $(this).find('b').removeClass('topArrow');
                }else{
                    $('.al-discover-ulBox').show();
                    $(this).find('b').addClass('topArrow')
                }
            });

        },
        //标签列表滚动条样式美化
        tagScrollBeautify:function(){
            var t=this;
            $('.al-firstFloorTag>li').click(function(e){
                var _index = $(this).index('.al-firstFloorTag>li');
                $(this).addClass('al-tag-selected').siblings().removeClass('al-tag-selected');
                if($(this).next().is('.al-scrollContainer')){
                    if(!$(this).next('.al-scrollContainer').is(':visible')){
                        if(_index>1&&t.getWhich().getName()!=="按类型"&&$('.al-firstFloorTag>li').length>10){
                            $('.al-firstFloorTag>li:lt('+_index+'):gt(0)').slideUp();
                        }

                        $(this).addClass('hasChildTag').siblings().removeClass('hasChildTag');
                        $('.al-scrollContainer').hide();
                        $(this).next('.al-scrollContainer').show();
                        var $secondFloor =$(this).next('.al-scrollContainer').find('.al-secondFloorTag');
                        if(!/MSIE/g.test(navigator.userAgent)){//ie8不支持滚轮事件
                            //$secondFloor.scroll_absolute({arrows:false});
                            setTimeout(function(){
                                $secondFloor.smoothScroll();
                            },400);
                            //$secondFloor.mCustomScrollbar({theme:"light"});

                            if($secondFloor.find('.scroll_vertical_bar').length>0){
                                $(this).next('.al-scrollContainer').find('.scroll_absolute').width(262);
                            }
                        }

                    }else{
                        $('.al-firstFloorTag>li:gt(0)').slideDown(300);
                        $(this).next('.al-scrollContainer').hide();
                        $(this).removeClass('hasChildTag');
                    }
                }else{

                }
                if(_index===0){
                    $('.al-firstFloorTag>li:gt(0)').slideDown(300);
                }
                e.stopPropagation();
            });
            $('.al-firstFloorTag>li').eq(0).trigger('click');
        },
        shareAction:function(param) {
            $('.al-shareBox').hide();
            var t = this;
            var o = $.extend(param, {"sceneType": t.getWhich().getShareContent(),"resourceType":0,"themeType":0,customerId:$('#sesCustomerId').val()||""});
            var shareSense = t.getWhich().getShareSence();
            var sinaTitle="";var qqTitle="";var qZoneTitle="";
            module.share({
                container: $(".ev-shareContainer"),// 存放分享组件的父级
                type: 2,// 默认为 1  1 ：社交分享  2 ：页面左下角全站分享
                url: document.location.href,// 分享链接， 默认取当前页链接
                h5Url: '',//h5页面的链接会生成微信二维
                title: "",// 分享标题
                shareTrend: 0,//0: 不需要站内动s态分享  1 ：需要站内动态分享
                trendUrl: '',// 分享到站内动态的接口
                data: {},// 分享到站内动态的接口参数
                callback: function () {},// 分享到站内动态成功后回调函数
                triggerRequest:function(content){//事件点击
                    $.ajax({
                        url: t.path.getShareContent,
                        type: "post",
                        data: {paramJson: $.toJSON(o)},
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
                },
                shareSinaSuc: function () {
                    comm.shareLog({
                        shareType: "",
                        resourceId: "",
                        resourceType: "",
                        refId: "",
                        shareSence:shareSense,
                        shareChannel: 3,
                        shareContent: sinaTitle
                    });
                },
                shareQQSuc: function () {
                    comm.shareLog({
                        shareType: "",
                        resourceId: "",
                        resourceType: "",
                        refId: "",
                        shareSence: shareSense,
                        shareChannel: 2,
                        shareContent: qqTitle
                    });
                },
                shareQzoneSuc: function () {
                    comm.shareLog({
                        shareType: "",
                        resourceId: "",
                        resourceType: "",
                        refId: "",
                        shareSence: shareSense,
                        shareChannel: 1,
                        shareContent: qZoneTitle
                    });
                }
            });
        }
    };
    var num=0;
    var disType = comm.getpara().type||comm.getpara('#').type;      //major,disease,operation,resource
    if(disType=="major"){
        num=0;
    }else if(disType=='disease'){
        num=1;
    }else if(disType=='operation'){
        num=2;
    }
    var controller_major={

        param:{
            tag:{
                filterSence:1,
                filterSenceType:num,
                isValid:1,
                leFilterTreeLevel:2,
                customerId:$("#sesCustomerId").val()||"",
                platformId:$('#sesDepartment').val()||1
            },
            byMajor:{
                tagId:(comm.getpara('#').tId!=undefined?comm.getpara('#').tId:0),
                pageIndex:1,
                pageSize:20,
                dataScene:4,     // 场景（1-最新发布  2-最多评论 3-最多浏览      4智能）
                dataType:0,      //资源类型，默认0（全部）（1 - 视频 ，2 - 文库 ，4 - 话题 ，7 - 病例）
                scene:2,         //列表页，默认传2
                platformId: $('#sesDepartment').val()||1,
                customerId:$("#sesCustomerId").val()||""
            }
        },
        //tagName:paraType.getWhich().getName(),
        tagName:{
            name:paraType.getWhich().getName()
        },
        init:function(x){
            var t=this;
            if(x){//判断从发布登录重新获取资源
                $(".al-release_popBox").attr('reloadData',1);
                t.param.tag.customerId = $("#sesCustomerId").val();
                t.param.tag.platformId = $("#sesDepartment").val();
                t.param.byMajor.platformId = $("#sesDepartment").val();
                t.param.byMajor.customerId = $("#sesCustomerId").val();

            }
            t.logId = paraType.getWhich().getLogId();
            t.shareSence= paraType.getWhich().getShareSence();
            t.tagList();
            t.getTagNameById();
            t.showAllType();
            t.commonSearch();
        },
        getTagNameById:function(){
            var t=this;
            var _tId=comm.getpara('#').tId;
            if(_tId!=undefined){
                var _params = {paramJson: $.toJSON({
                    tagId:_tId,
                    scene:2,
                    customerId:0
                })};
                $.ajax({
                    url:PC_CALL+'recommend/tag/resource/json_info/',
                    type:"post",
                    data:_params,
                    async:false,
                    dataType:'json',
                    success:function(d){
                        if(d&&d.responseObject.responseData&&!$.isEmptyObject(d.responseObject.responseData)&&d.responseObject.responseData.data_list.length){
                            t.tagName.name = d.responseObject.responseData.data_list[0].propertyName;
                        }
                    }
                })
            }
        },
        showAllType:function(){
            var t=this;
            $('.al-disMajorAll').click(function(e){
                if($('.al-discover-ulBox').is(':hidden')){
                    $(this).find('b').addClass('topArrow');
                    $('.al-discover-ulBox').show();
                }else{
                    $(this).find('b').removeClass('topArrow');
                    $('.al-discover-ulBox').hide();
                }
                e.stopPropagation();
            });
            $('body').not(".al-discover-ulBox").click(function(){
                $(this).find('b').removeClass('topArrow');
                $('.al-discover-ulBox').hide();;
            });
            $('.al-discover-ulBox li').click(function(){
                $('.al-discover-ulBox li').removeClass("al-title");
                $(this).addClass("al-title");
                $('.al-disMajorAll span').text($(this).text());
                t.param.byMajor.dataType = $(this).attr('dataType');
                t.param.byMajor.pageIndex=1;      //第一页
                t.commonSearch();
                var actionId;
                switch(parseInt($(this).attr('dataType'))){
                    case 0://全部
                        actionId=51;
                        break;
                    case 1://视频
                        actionId=53;
                        break;
                    case 7://病例
                        actionId=52;
                        break;
                    case 2://文库
                        actionId=54;
                        break;
                    case 4://话题
                        actionId=55;
                        break;
                }
                //事件埋点
                comm.creatEvent({
                    triggerType:"列表资源排序",
                    keyword:$(this).text(),
                    actionId:actionId
                });
            });
        },
        tagList:function(){
            var t=this;
            var liTags='';
            comm.LightBox.showloading();
            paraType.isQuery = true;
            $.ajax({
                url: paraType.path.byType_tag,
                type:"post",
                data:{paramJson: $.toJSON(t.param.tag)},
                dataType:'json',
                success:function(data){
                    comm.LightBox.hideloading();
                    paraType.isQuery = false;
                    if(data&&data.responseObject.responseData&& !$.isEmptyObject(data.responseObject.responseData)&&data.responseObject.responseData.data_list.length){
                        var item = data.responseObject.responseData.data_list[0];
                        var _item = item.childrenList.length?item.childrenList:item;
                        var lis='';
                        var liGroup='';
                        var childLis='';
                        var childList;
                        var li_section="";
                        var choosed="";
                        var arr=[];
                        $.each(_item,function(i,e){
                            childList = e.childrenList;
                            childLis='';
                            if(e.refRename=='全部'){
                                lis='<li class="al-tag-selected">全部</li>';
                                if(childList.length){
                                    $.each(childList,function(_i,_e){
                                        childLis+='<li tagId="'+ _e.refId+'" >'+ comm.getStrLen(_e.refRename,26)+'</li>';
                                    });
                                }
                                choosed= lis+'<section class="al-scrollContainer">'+
                                        '<ul class="al-secondFloorTag">'+
                                        '<p class="al-allRes">全部资源</p>'+
                                        '<p class="al-handPick"><i class="al-roundL"></i>精选<i class="al-roundR"></i></p>'+
                                        childLis+
                                        '</ul>'+
                                        '</section>';
                            }else{
                                lis='<li >'+ e.refRename+'</li>';
                                li_section="";
                                if(childList.length){
                                    childLis="";
                                    $.each(childList,function(_i,_e){
                                        childLis+='<li tagId="'+ _e.refId+'">'+ comm.getStrLen(_e.refRename,26)+'</li>';
                                    });
                                    li_section='<section class="al-scrollContainer">'+
                                        '<ul class="al-secondFloorTag">'+
                                        childLis+
                                        '</ul>'+
                                        '</section>' ;
                                    lis = lis+li_section;

                                }
                                arr.push(lis);

                            }
                        });
                        liGroup = arr.join("");
                        $('.al-firstFloorTag').html(choosed+liGroup);
                        paraType.tagScrollBeautify();
                        //$(".al-secondFloorTag").each(function(){
                        //    $(this).mCustomScrollbar({theme:"light"});
                        //});
                        $('.al-scrollContainer').eq(0).show();
                        t.filterSearch();
                        var tagId=comm.getpara('#').tId;
                        var selectLi = $('.al-firstFloorTag li[tagId='+tagId+']');
                        if(selectLi.length){
                            selectLi.click();
                            //处理模拟滚动条，index大于4时拉到最底部
                            //if(selectLi.index()>4){
                            //    var top1=selectLi.parents('.scroll_absolute').height()-selectLi.parents('.scroll_container').height();
                            //    var top2=selectLi.offset().top-selectLi.parents('.scroll_absolute').offset().top;
                            //    if(top1<top2){
                            //        var top=top1;
                            //    }else{
                            //        var top=top2;
                            //    }
                            //    selectLi.parents('.scroll_absolute').css({
                            //        //top:-(selectLi.parents('.scroll_absolute').height()-selectLi.parents('.scroll_container').height())
                            //        top:-top
                            //    });
                            //    selectLi.parents('.scroll_absolute').siblings('.scroll_vertical_bar').find('.scroll_drag').css({
                            //        top: selectLi.parents('.scroll_container').height()-selectLi.parents('.scroll_absolute').siblings('.scroll_vertical_bar').find('.scroll_drag').height()
                            //    });
                            //}
                            if(selectLi.index()>4&&selectLi.parents('.scroll_absolute').length){
                                var top1=selectLi.parents('.scroll_absolute').height()-selectLi.parents('.scroll_container').height();
                                var top2=selectLi.offset().top-selectLi.parents('.scroll_absolute').offset().top;
                                if(top1<top2){
                                    var top=top1;
                                }else{
                                    var top=top2;
                                }
                                selectLi.parents('.scroll_absolute').css({
                                    //top:-(selectLi.parents('.scroll_absolute').height()-selectLi.parents('.scroll_container').height())
                                    top:-top
                                });
                                selectLi.parents('.scroll_absolute').siblings('.scroll_vertical_bar').find('.scroll_drag').css({
                                    top: selectLi.parents('.scroll_container').height()-selectLi.parents('.scroll_absolute').siblings('.scroll_vertical_bar').find('.scroll_drag').height()
                                });
                            }

                        }
                        //t.commonSearch();
                    }
                }
            });

            paraType.tagScrollBeautify();
            //$(".al-secondFloorTag").each(function(){
            //    $(this).mCustomScrollbar({theme:"light"});
            //});
        },
        filterSearch:function(){
            var t=this;
            $('.al-allRes').click(function(){
                if(/&tId=/.test(window.location.href)){
                    g_sps.jump(null,window.location.href.substring(0,window.location.href.lastIndexOf('&tId='))+"&tId=0");
                }else{
                    g_sps.jump(null, window.location.href+'&tId=0');
                }
                $('.al-firstFloorTag li').removeClass('al_second_selected');
                $(this).addClass("al_second_selected");
                t.param.byMajor.tagId=0;
                t.commonSearch();
            });
            $('.al-secondFloorTag li').click(function(){
                if(paraType.isQuery===false){
                    $(".al-allRes").removeClass("al_second_selected");
                    $('.al-firstFloorTag li').removeClass('al_second_selected');
                    $(this).addClass('al_second_selected');
                    var prevLi = $(this).parents('.al-scrollContainer').prev('li');
                    if(!prevLi.hasClass('hasChildTag')){
                        prevLi.click();
                    }

                    var tId =$(this).attr('tagId');
                    t.tagName.name=$(this).text();
                    t.param.byMajor.tagId=tId;
                    $('.al-discover-ulBox').hide();
                    if(/&tId=/.test(window.location.href)){
                        setTimeout(function(){
                            g_sps.jump(null,window.location.href.substring(0,window.location.href.lastIndexOf('&tId='))+"&tId="+tId);
                        },400);
                    }else{
                        setTimeout(function() {
                            g_sps.jump(null, window.location.href + '&tId=' + tId);
                        },400);
                    }
                    t.param.byMajor.pageIndex=1;      //第一页
                    var clickIndex =0;  //按哪个排序
                    switch(parseInt(t.param.byMajor.dataScene)){
                        case 1:
                            clickIndex=1;break;
                        case 3:
                            clickIndex =2;break;
                        case 2:
                            clickIndex =3;break;
                        case 4:
                            clickIndex=0;break;
                    }
                    $('.al-disMajorMain_ul li').eq(clickIndex).addClass('al-sortSelected').siblings().removeClass('al-sortSelected');
                    t.commonSearch();
                    //事件埋点
                    comm.creatEvent({
                        triggerType:"列表资源排序",
                        keyword:$(this).text(),
                        actionId:50
                    });
                    //return false;    为了在body上监听事件。先注掉
                }
            });
            //if($('#sesDepartment').val()==2){
            //    $('.al-secondFloorTag li').eq(0).click();
            //}
            $('.al-disMajorMain_ul li').click(function(){
                if(paraType.isQuery===false){
                    $('.al-disMajorMain_ul li').removeClass('al-sortSelected');
                    $(this).addClass('al-sortSelected');
                    $('.al-discover-ulBox').hide();
                    t.param.byMajor.dataScene= $(this).attr('dataScene');
                    t.param.byMajor.pageIndex=1;      //第一页
                    t.commonSearch();
                    var actionId;
                    switch(parseInt($(this).attr('dataScene'))){
                        case 4://智能排序
                            actionId=46;
                            break;
                        case 1://最新发布
                            actionId=47;
                            break;
                        case 3://最多浏览
                            actionId=48;
                            break;
                        case 2://最多评论
                            actionId=49;
                            break;
                    }
                    //事件埋点
                    comm.creatEvent({
                        triggerType:"列表资源排序",
                        keyword:$(this).text(),
                        actionId:actionId
                    });
                    //return false;    为了在body上监听事件。先注掉
                }
            });

        },
        //搜索-分为不同排序搜索，不同资源搜索，资源总数变更，分页
        commonSearch:function(){
            var t=this;
            t.pageClickCallBack =function(o){
                t.param.byMajor.pageIndex= o;
                t.search(t.param.byMajor,function(n){
                    $('.pager').pager({pagenumber:o, pagecount:n, buttonClickCallback: t.pageClickCallBack})
                }, t.tagName.name);

            };
            t.search(t.param.byMajor,function(n){
                $('.pager').pager({pagenumber:1, pagecount:n, buttonClickCallback: t.pageClickCallBack})
            }, t.tagName.name);

        },
        search:function(_param,fn,tagName){
            var t=this;
            comm.LightBox.showloading();
            paraType.isQuery = true;
            $.ajax({
                url: paraType.path.byMajor,
                type:"post",
                data:{paramJson: $.toJSON(_param)},
                dataType:'json',
                success:function(res){
                    comm.LightBox.hideloading();
                    paraType.isQuery = false;
                    if(res&&res.responseObject.responseData&&!$.isEmptyObject(res.responseObject.responseData)&&res.responseObject.responseData.data_list.length){
                        var item = res.responseObject.responseData.data_list;
                        var arr='';
                        var sDom='';
                        $.each(item,function(j,je){
                            sDom=module.indexListTem.byTypeList({
                                    resUrl:je.itemUrl,
                                    resName:je.itemTitle,
                                    videoType:je.videoType,
                                    resDesc:je.itemAbstract,
                                    resAuthor:je.ownerNameStr,
                                    //resAuthor:'测试名1，测试名1，测试名1，测试名1',
                                    resWatchCount:je.browseNum.toWK(),
                                    commentNum:je.reviewNum.toWK(),
                                    attUrl:je.picUrl,
                                    playTime:je.playTime,
                                    score:je.currentStarLevel,
                                    scoreNum:je.currentScoreNum,
                                    isShowActivityTag:je.isShowActivityTag,
                                    activityTagName:je.activityTagName,
                                    activityTagColor:je.activityTagColor
                                }, je.itemType);
                            arr+=sDom;
                        });
                        $('.al-noTag_iconBox').hide();

                        $('.ev_res_container').html(arr).show();
                        $('.al-disMajorMainBox_body_innerWrap:last').css('border','none');
                        $('#totalNum').text(res.responseObject.responseData.total_count);//资源总数
                        fn&&fn(Math.ceil(res.responseObject.responseData.total_count/ t.param.byMajor.pageSize));//分页
                        paraType.shareAction(_param);
                    }else{//无结果
                        $('#totalNum').text(0);//资源总数
                        $('.ev_res_container').empty();
                        $('.al-noTag_iconBox').show();
                        $('.ev-shareContainer').hide();
                        $('.pager').empty();
                    }
                },
                error:function(){
                    paraType.isQuery = false;
                    comm.LightBox.hideloading();
                }

            })

        }
    };

    /*-==========按类型================================*/
    var controller_type={
        option:{
            type:paraType.getWhich().getName()
        },
        path:paraType.path,
        searchParam:{
            pageCount:1,
            type:{//获取类型标签参数
                filterSence:2,
                filterSenceType:0,
                isValid:1,
                leFilterTreeLevel:2
            },
            resType:{//按类型 资源参数
                refType: comm.getpara('#').resType,
                refSecondType:"",
                sortType:5,
                attUseFlag:comm.getpara('#').resType==2?2:4,
                logoUseFlag:11,
                pageIndex:1,
                pageSize:20,
                useFlag:3
            }
        },
        init:function(){
            var t=this;
            var arr=[5,2,4,3];
            $('.al-disMajorMain_ul li').each(function(i,em){
                $(em).attr("dataScene",arr[i]);
            });
            paraType.searchChangeStyle();
            $('.al-disMajorAll').remove();
            t.tagList();
        },
        filterSearch:function(){
            var t=this;
            $('.al-secondFloorTag li').click(function(){
                if(paraType.isQuery===false){
                    comm.creatEvent({
                        triggerType:'按专业-筛选',
                        keyword:"按类型-"+$(this).text(),
                        actionId:50
                    });
                    $('.al-firstFloorTag li').removeClass('al_second_selected');
                    $(this).addClass('al_second_selected');
                    t.searchParam.resType.refType=$(this).attr('refType');
                    if($(this).attr('refType')==2){
                        t.searchParam.resType.attUseFlag=2;
                    }else{
                        t.searchParam.resType.attUseFlag=4;
                    }
                    t.searchParam.resType.refSecondType=$(this).attr('refSecondType');
                    t.searchParam.resType.pageIndex=1;      //第一页
                    t.searchParam.resType.sortType=5;       //智能排序
                    $('.al-disMajorMain_ul li').eq(0).addClass('al-sortSelected').siblings().removeClass('al-sortSelected');
                    t.commonSearch();
                    //return false;
                }
            });
            $('.al-disMajorMain_ul li').click(function(){
                if(paraType.isQuery===false){
                    $('.al-disMajorMain_ul li').removeClass('al-sortSelected');
                    $(this).addClass('al-sortSelected');
                    t.searchParam.resType.sortType= $(this).attr('dataScene');
                    t.searchParam.resType.pageIndex=1;      //第一页
                    t.commonSearch();
                    var actionId;
                    switch(parseInt($(this).attr('dataScene'))){
                        case 5://智能排序
                            actionId=46;
                            break;
                        case 2://最新发布
                            actionId=47;
                            break;
                        case 4://最多浏览
                            actionId=48;
                            break;
                        case 3://最多评论
                            actionId=49;
                            break;
                    }
                    //事件埋点
                    comm.creatEvent({
                        triggerType:"列表资源排序",
                        keyword:$(this).text(),
                        actionId:actionId
                    });
                    //return false;
                }
            });
        },
        //搜索-分为不同排序搜索，不同资源搜索，资源总数变更，分页
        commonSearch:function(){
            var t=this;
            t.pageClickCallBack =function(o){
                t.searchParam.resType.pageIndex= o;
                t.search(t.searchParam.resType,function(n){
                    $('.pager').pager({pagenumber:o, pagecount:n, buttonClickCallback: t.pageClickCallBack})
                },t,paraType.path.byType_res);

            };
           t.search(t.searchParam.resType,function(n){
                $('.pager').pager({pagenumber:1, pagecount:n, buttonClickCallback: t.pageClickCallBack})
            },t,paraType.path.byType_res);

        },
        //加载右侧tag标签
        tagList:function(){
            var t=this;
            var liTags='';
                comm.LightBox.showloading();
                paraType.isQuery = true;
                $.ajax({
                    url: t.path.byType_tag,
                    type:"post",
                    data:{paramJson: $.toJSON(t.searchParam.type)},
                    dataType:'json',
                    success:function(data){
                        comm.LightBox.hideloading();
                        paraType.isQuery = false;
                        if(data&&data.responseObject.responseData&& !$.isEmptyObject(data.responseObject.responseData)&&data.responseObject.responseData.data_list.length){
                            var item = data.responseObject.responseData.data_list[0];
                            var _item = item.childrenList.length?item.childrenList:item;
                            var lis='';
                            var liGroup='';
                            var childLis='';
                            var li_section="";
                            var arr=[];
                            $.each(_item,function(i,e){
                                switch(e.refType){
                                    case 1:
                                        lis='<li >'+ e.refRename+'</li>';
                                        childLis=''
                                        var childList = e.childrenList;
                                        $.each(childList,function(_i,_e){
                                            childLis+='<li refType="'+ e.refType+'" refSecondType="'+ _e.refSecondType+'">'+ _e.refRename+'</li>';
                                        });
                                        li_section='<section class="al-scrollContainer">'+
                                            '<ul class="al-secondFloorTag">'+
                                                '<li refType="'+ e.refType+'" refSecondType="">全部</li>'+
                                                childLis+
                                            '</ul>'+
                                            '</section>' ;
                                        lis = lis+li_section;
                                        arr[0]=lis;
                                        break;
                                    case 2:
                                        lis='<li >'+ e.refRename+'</li>';
                                        childLis=''
                                        var childList = e.childrenList;
                                        $.each(childList,function(_i,_e){
                                            childLis+='<li refType="'+ e.refType+'" refSecondType="'+ _e.refSecondType+'">'+ _e.refRename+'</li>';
                                        });
                                        li_section='<section class="al-scrollContainer">'+
                                            '<ul class="al-secondFloorTag">'+
                                            '<li refType="'+ e.refType+'" refSecondType="">全部</li>'+
                                            childLis+
                                            '</ul>'+
                                            '</section>' ;
                                        lis = lis+li_section;
                                        arr[3]=lis;
                                        break;
                                    case 4:
                                        lis='<li >'+ e.refRename+'</li>';
                                        childLis=''
                                        var childList = e.childrenList;
                                        $.each(childList,function(_i,_e){
                                            childLis+='<li refType="'+ e.refType+'" refSecondType="'+ _e.refSecondType+'">'+ _e.refRename+'</li>';
                                        });
                                        li_section='<section class="al-scrollContainer">'+
                                            '<ul class="al-secondFloorTag">'+
                                            '<li refType="'+ e.refType+'" refSecondType="">全部</li>'+
                                            childLis+
                                            '</ul>'+
                                            '</section>' ;
                                        lis = lis+li_section;
                                        arr[2]=lis;
                                        break;
                                    case 7:
                                        lis='<li >'+ e.refRename+'</li>';
                                        childLis=''
                                        var childList = e.childrenList;
                                        $.each(childList,function(_i,_e){
                                            childLis+='<li refType="'+ e.refType+'" refSecondType="'+ _e.refSecondType+'">'+ _e.refRename+'</li>';
                                        });
                                        li_section='<section class="al-scrollContainer">'+
                                            '<ul class="al-secondFloorTag">'+
                                            '<li refType="'+ e.refType+'" refSecondType="">全部</li>'+
                                            childLis+
                                            '</ul>'+
                                            '</section>' ;
                                        lis = lis+li_section;
                                        arr[1]=lis;
                                        break;
                                }
                                liGroup = arr.join("");
                            });
                            $('.al-firstFloorTag').html(liGroup);
                            paraType.tagScrollBeautify();

                            var clickIndex =0;
                            switch(parseInt(t.searchParam.resType.refType)){//第一次加载进来的默认选项
                                case 1:
                                    clickIndex =0;
                                    break;
                                case 2:
                                    clickIndex =3;
                                    break;
                                case 4:
                                    clickIndex =2;
                                    break;
                                case 7:
                                    clickIndex =1;
                                    break;
                            }
                            $('.al-scrollContainer').eq(clickIndex).show();
                            $('.al-scrollContainer').eq(clickIndex).find('li').eq(0).addClass('al_second_selected');
                            t.filterSearch();
                            t.commonSearch();

                        }
                    }
                });
            paraType.tagScrollBeautify();
        },
        search:function(_param,fn){
            var t=this;
            comm.LightBox.showloading();
            paraType.isQuery = true;
            $.ajax({
                url: paraType.path.byType_res,
                type:"post",
                data:{paramJson: $.toJSON(_param)},
                dataType:'json',
                success:function(res){
                    comm.LightBox.hideloading();
                    paraType.isQuery = false;
                    if(res&&res.responseObject.responseData&&!$.isEmptyObject(res.responseObject.responseData)&&res.responseObject.responseData.data_list.length){
                        var item = res.responseObject.responseData.data_list;
                        var arr='';
                        var sDom='';
                        $.each(item,function(j,je){
                            if(t.searchParam.resType.refType==1){
                                var _cms = je.cms_video;
                                var _vAuth=je.cms_video_customer_auth;
                                sDom=module.indexListTem.byTypeList({
                                    resUrl:_cms.pageStoragePath,
                                    resName:_cms.videoName,
                                    videoType:_cms.videoType,
                                    resDesc:_cms.videoAbstract,
                                    resAuthor:_cms.ownerNameStr,//.lastName+_vAuth.firstName,
                                    resWatchCount:_cms.playNum.toWK(),
                                    commentNum:_cms.reviewNum.toWK(),
                                    attUrl:je.cms_video_attachment_logo.videoAttUrl,
                                    playTime:_cms.playTime,
                                    score:je.currentStarLevel?je.currentStarLevel.currentStarLevel:undefined,
                                    scoreNum:je.currentStarLevel?je.currentStarLevel.currentScoreNum:0,
                                    isShowActivityTag:je.isShowActivityTag,
                                    activityTagName:je.activityTagName,
                                    activityTagColor:je.activityTagColor
                                }, t.searchParam.resType.refType);
                            }else if(t.searchParam.resType.refType==2){
                                var _doc = je.customer_doc;
                                var _docAuth=je.customer_auth;
                                sDom=module.indexListTem.byTypeList({
                                    resUrl:_doc.pageStoragePath,
                                    videoType:_doc.docType,
                                    resName:_doc.docName,
                                    resDesc:_doc.docAbstract,
                                    resAuthor:_docAuth.lastName+_docAuth.firstName,
                                    resWatchCount:_doc.browseNum.toWK(),
                                    commentNum:_doc.reviewNum.toWK(),
                                    attUrl:je.cms_doc_attachment_logo.docAttUrl,
                                    score:je.currentStarLevel?je.currentStarLevel.currentStarLevel:undefined,
                                    scoreNum:je.currentStarLevel?je.currentStarLevel.currentScoreNum:0,
                                    isShowActivityTag:je.isShowActivityTag,
                                    activityTagName:je.activityTagName,
                                    activityTagColor:je.activityTagColor
                                }, t.searchParam.resType.refType);
                            }else if(t.searchParam.resType.refType==4){
                                var _topic = je.cms_topic;
                                var _auth =je.cms_topic_customer_auth;
                                sDom=module.indexListTem.byTypeList({
                                    resUrl:_topic.pageStoragePath,
                                    resName:_topic.topicName,
                                    videoType:_topic.videoType,
                                    resDesc:_topic.topicDiscuss,
                                    resAuthor:_auth.lastName+_auth.firstName,
                                    resWatchCount:_topic.browseNum.toWK(),
                                    commentNum:_topic.reviewNum.toWK(),
                                    attUrl:je.cms_topic_attachment.topicAttUrl,
                                    isShowActivityTag:je.isShowActivityTag,
                                    activityTagName:je.activityTagName,
                                    activityTagColor:je.activityTagColor
                                }, t.searchParam.resType.refType);
                            }else if(t.searchParam.resType.refType==7){
                                var _cz = je.case_baseinfo;
                                var _cAuth = je.case_customer_auth;
                                var _pic ="";
                                if(je.case_att_url_list_1.length){
                                    _pic = je.case_att_url_list_1[0].attUrl;
                                }else if(je.case_att_url_list_2.length){
                                    _pic = je.case_att_url_list_2[0].attUrl;
                                }else if(je.case_att_url_list_3.length){
                                    _pic = je.case_att_url_list_3[0].attUrl;
                                }
                                sDom=module.indexListTem.byTypeList({
                                    resUrl:_cz.pageStoragePath,
                                    resName:_cz.caseName,
                                    videoType:_cz.videoType,
                                    resDesc:_cz.mainNarrate,//主诉
                                    resAuthor:_cAuth.lastName+_cAuth.firstName,
                                    resWatchCount:_cz.browseNum.toWK(),
                                    commentNum:_cz.reviewNum.toWK(),
                                    attUrl:_pic,
                                    score:je.currentStarLevel?je.currentStarLevel.currentStarLevel:undefined,
                                    scoreNum:je.currentStarLevel?je.currentStarLevel.currentScoreNum:0,
                                    isShowActivityTag:je.isShowActivityTag,
                                    activityTagName:je.activityTagName,
                                    activityTagColor:je.activityTagColor
                                }, t.searchParam.resType.refType);
                            }
                            arr+=sDom;
                        });
                        $('.al-noTag_iconBox').hide();
                        $('.ev_res_container').html(arr);
                        $('.al-disMajorMainBox_body_innerWrap:last').css('border','none');
                        $('#totalNum').text(res.responseObject.responseData.total_count);//资源总数
                        fn&&fn(Math.ceil(res.responseObject.responseData.total_count/20));//分页
                        paraType.shareAction(_param);
                    }else{
                        $('#totalNum').text(0);//资源总数
                        $('.ev_res_container').empty();
                        $('.al-noTag_iconBox').show();
                        $('.ev-shareContainer').hide();
                        $('.pager').empty();
                    }
                },
                error:function(){
                    paraType.isQuery = false;
                    comm.LightBox.hideloading();
                }

            })

        }
    };
    var ctrl ={
        init:function(){
            var which = paraType.getWhich().getName();
            $('.al-disMajorMain_p').text(which);
            if(which=="按类型"){
                controller_type.init();
                //comm.Log.createBrowse({href:location.href,id:48,name:'发现-按类型'})
                setTimeout(function(){
                    g_sps&&g_sps.createBrowse({pageId:424});
                },2000);
            }else{
                controller_major.init();
                setTimeout(function(){
                    g_sps&&g_sps.createBrowse({pageId:paraType.getWhich().getPageId()});
                },2000);
                //comm.Log.createBrowse({href:location.href,id:paraType.getWhich().getLogId(),name:'发现-'+paraType.getWhich().getName()});
                scene.TopHeadLoginCallback= function(){
                    //window.location.reload();
                    controller_major.init('reloadData');
                };
            }
        }
    };
    ctrl.init();

});