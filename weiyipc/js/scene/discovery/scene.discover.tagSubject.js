/**
 * @name:   标签专题页
 * @desc:
 * @example:
 * @depend:
 * @date: 2016/8/12
 * @author: sunhaibin
 */
$(function(){
    var ctrl ={
        opt:{
            cid:$('#sesCustomerId').val(),
            tagId:comm.getpara('#').tId||comm.getpara().tId
        },
        isQuery:false,
        path:{
            getInfoByTagId:PC_CALL+'recommend/tag/resource/json_info/',
            tagResource:PC_CALL+"recommend/tag/resource/json_list/",
            tagListUrl:PC_CALL+'comm/data/property/getMapList/',
            getShareContent:PC_CALL+'comm/data/share/getMapList3/'

        },
        params:{
            tagId : comm.getpara('#').tId,//812,   标签ID
            pageIndex:1,
            pageSize:20,
            dataScene:1,//   场景（1-最新发布  2-最多评论 3-最多浏览）
            dataType:comm.getpara('#').type!=undefined?comm.getpara('#').type:0, //资源类型，默认0（全部）（1 - 视频 ，2 - 文库 ，4 - 话题 ，7 - 病例）
            scene:2,         //列表页，默认传2
            customerId:$('#sesCustomerId').val()!=undefined?$('#sesCustomerId').val():'0'
        },
        init:function(){
            var t=this;
            t.backBtn();
            t.getTagBaseInfo();
            t.showAllType();
            t.commonSearch();
            t.filterSearch();
            t.addCase();
            t.getHotTags();
        },
        backBtn:function(){

        },
        //加载标签名称，资源总数，是否关注，关注人数，关注人头像
        getTagBaseInfo:function(x){
            var t=this;
            t.opt.cid = $('#sesCustomerId').val();
            var _params = {paramJson: $.toJSON({
                tagId:comm.getpara('#').tId,
                scene:2,
                customerId: t.opt.cid!=undefined? t.opt.cid:0
            })};
            var callback =function(d){
                if(d&& !$.isEmptyObject(d.responseObject.responseData)&& d.responseObject.responseData.data_list.length){
                    if(x){//判断从发布登录重新获取资源
                        $(".al-release_popBox").attr('reloadData',1);
                    }
                    var item = d.responseObject.responseData.data_list[0];
                    if(item.propertyName==""){
                        g_sps.jump(null, "/");
                    }else{
                        var tagName=item.propertyName
                        document.title=tagName+'－关注标签,资源更新提醒,唯医,allinmd';
                        $('meta[name="keywords"]').attr('content',tagName+'，关注标签，'+tagName+'病例，'+tagName+'视频，'+tagName+'文库，'+tagName+'话题，唯医,allinmd');
                        $('.ev_tagName').text(tagName);   //标签名称

                        $('.ev_tagCount').text(item.sourceNum);         //资源数
                        if(item.followNum==0){  // 无关注
                            $('.ev_followedNum').text(0).attr('href','javascript:;');
                        }else{
                            $('.ev_followedNum').text(item.followNum).attr('href','/pages/discover/discover_tagFollowers.html?tId='+ t.opt.tagId);      //关注数
                        }
                        var arr=item.logoUrl.split('|');                //头像
                        var imgs='';
                        var lastImg ='<a href="/pages/discover/discover_tagFollowers.html?tId='+t.opt.tagId+'" class="al-lastImg">' +
                            '<img src="//img10.allinmd.cn/v3/discover/ellipsisBtn.png" alt=""/>' +
                            '</a>';
                        $.each(arr,function(index,ele){
                            if(index<6){
                                imgs+='<a href="javascript:;"><img src="'+ele+'"></a>';
                            }
                        });
                        if(imgs!='<a href="javascript:;"><img src=""></a>'){
                            $('.ev_al_imgBox').html(imgs+lastImg);
                        }
                        if(item.relationship==1){//0未关注，1已关注
                            $('.ev_followBtn').addClass('followedBtn').removeClass('followBtn').attr('isFollow',1);
                        }else{
                            $('.ev_followBtn').attr('isFollow',0);
                        }
                        $('.ev_followBtn').followTag({
                            refId: t.opt.tagId,
                            refName: item.propertyName,
                            canToggle:true,
                            followType:61,
                            needSure:true,
                            addSuc:function(){$('.ev_followedNum').text(parseInt($('.ev_followedNum').text())+1)},
                            delSuc:function(){$('.ev_followedNum').text(parseInt($('.ev_followedNum').text())-1)}
                        });
                        if(item.sourceNum==0){
                            $('.al-disMajorMainBox_head').hide();
                            $('.al-noTag_iconBox').show();
                        }
                    }

                }else{
                    g_sps.jump(null,"/");
                }
            };
            comm.ajax.async(t.path.getInfoByTagId,_params,callback);
        },
        commonSearch:function(){

            var t=this;
            var callback = function(o){

                t.getTagResouce(function(pagecount){
                    $('.pager').pager({pagenumber:o,pagecount:pagecount,buttonClickCallback:callback});
                },o);
            };
            t.getTagResouce(function(pagecount){
                $('.pager').pager({pagenumber:1,pagecount:pagecount,buttonClickCallback:callback});
            },1);

        },
        //切换搜索
        filterSearch:function(){
            var t=this;
            $('.al-disTagSub-ul li').click(function(){
                if($(this).hasClass('active')&& t.isQuery==true){   //如果点击同一个并正在请求中，return false
                    return false;
                }else{
                    var dataScene = $(this).attr('dataScene');
                    var tId = t.opt.tagId;
                    if(dataScene==1){
                        comm.creatEvent({
                            triggerType:'列表资源排序',
                            keyword:tId,
                            actionId:47
                        });
                    }else if(dataScene==2){
                        comm.creatEvent({
                            triggerType:'列表资源排序',
                            keyword:tId,
                            actionId:49
                        });
                    }else if(dataScene==3){
                        comm.creatEvent({
                            triggerType:'列表资源排序',
                            keyword:tId,
                            actionId:48
                        });
                    }

                    $(this).addClass('active').siblings().removeClass('active');
                    t.params.dataScene = dataScene;
                    t.commonSearch();
                }
            });
        },
        //根据默认params加载资源
        getTagResouce:function(fn,pageIndex){
            var t=this;
            t.isQuery =true;
            var _params={paramJson: $.toJSON($.extend(t.params,{pageIndex:pageIndex}))};
            var _callback=function(d){
                t.isQuery =false;
                if(d&& !$.isEmptyObject(d.responseObject.responseData)&& d.responseObject.responseData.data_list.length){
                    var item =d.responseObject.responseData.data_list;
                    var refType;
                    var html='';
                    var firstName='',secondName='';
                    var attUrl='';
                    $.each(item,function(i,je){
                        if(i===0){
                            firstName = je.itemTitle;
                        }else if(i===1){
                            secondName = je.itemTitle;
                        }
                        refType = je.itemType;
                        attUrl='';
                        if(je.picNum==1){
                            attUrl=je.picUrl
                        }else if(je.picNum>1){
                            attUrl = je.picUrl.split('|')[0];
                        }
                        html+=module.indexListTem.byTypeList({
                            resUrl:je.itemUrl,
                            resName:je.itemTitle,
                            videoType:je.videoType,
                            resDesc:je.itemAbstract,
                            resAuthor:je.ownerNameStr,
                            resWatchCount:je.browseNum.toWK(),
                            commentNum:je.reviewNum.toWK(),
                            attUrl:attUrl,
                            playTime:je.playTime,
                            score:je.currentStarLevel,
                            scoreNum:je.currentScoreNum,
                            isShowActivityTag:je.isShowActivityTag,
                            activityTagName:je.activityTagName,
                            activityTagColor:je.activityTagColor
                        },refType);
                    });

                    $('.al-noTag_iconBox').hide();
                    $('.ev_tagResContainer').html(html);
                    $('.al-disMajorMainBox_body_innerWrap:last').css('border','none');
                    fn&&fn(Math.ceil(d.responseObject.responseData.total_count/ t.params.pageSize));
                    t.shareAction($.extend(t.params,{pageIndex:pageIndex}));
                }else{
                    $('.pager').empty();
                    $('.al-noTag_iconBox').show();
                    $('.ev_tagResContainer').html("");
                    comm.LightBox.hideloading();
                    $('.ev-shareContainer').hide();
                }
            };
            comm.ajax.async(t.path.tagResource,_params,_callback);
        },
        //补充病例
        addCase:function(){
            /*module.caseUpload({
                caseBtn: $(".ev_addCase"),
                needAuth:1,
                propertyIdList:comm.getpara('#').tId
            });*/
            $(".ev_addCase").on("click",function(){
                var href="/pages/singlePage/upload-case.html?tId="+comm.getpara('#').tId;
                comm.ieAlert(href);
            });
        },
        //点击全部显示类型及资源
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
            var _type = comm.getpara('#').type;
            if(_type!=undefined){
                $('.al-discover-ulBox li').removeClass("al-title");
                $('.al-discover-ulBox ul li[resType='+_type+']').addClass("al-title");
                $('.ev_resType').html($('.al-discover-ulBox ul li[resType='+_type+']').text());
            }
            $('body').not(".al-discover-ulBox").click(function(){
                $(this).find('b').removeClass('topArrow');
                $('.al-discover-ulBox').hide();
            });

            $('.al-discover-ulBox li').click(function(){
                var type=$(this).attr('resType');
                if(type==1){
                    comm.creatEvent({
                        triggerType:'列表资源排序',
                        keyword: t.opt.tagId,
                        actionId:53
                    });
                }else if(type==2){
                    comm.creatEvent({
                        triggerType:'列表资源排序',
                        keyword: t.opt.tagId,
                        actionId:54
                    });
                }if(type==4){
                    comm.creatEvent({
                        triggerType:'列表资源排序',
                        keyword: t.opt.tagId,
                        actionId:55
                    });
                }if(type==7){
                    comm.creatEvent({
                        triggerType:'列表资源排序',
                        keyword: t.opt.tagId,
                        actionId:52
                    });
                }else if(type==0){
                    comm.creatEvent({
                        triggerType:'列表资源排序',
                        keyword: t.opt.tagId,
                        actionId:51
                    });
                }
                $('.al-discover-ulBox li').removeClass("al-title");
                $(this).addClass("al-title");

                $('.al-disMajorAll span').text($(this).text());
                t.params.dataType = type;
                var _url =document.URL;
                if(_url.indexOf('&type=')==-1){
                    document.location.href = _url+"&type="+type;
                }else{
                    document.location.href = _url.replace(/\&type=[1|2|4|7|0]/,'&type='+type);
                }
                t.commonSearch();
            });
        },
        //加载热门标签
        getHotTags:function(){
            var t=this;
            var _params = {paramJson: $.toJSON({
                customerId:(t.opt.cid!=''&& t.opt.cid!=undefined)? t.opt.cid:'',
                pageIndex:1,
                pageSize:10,
                visitSiteId:1
            })};
            var callback =function(d){
                if(d&& !$.isEmptyObject(d.responseObject.responseData)&& d.responseObject.responseData.hot_list.length){
                    var item =d.responseObject.responseData.hot_list;
                    var html='';
                    $.each(item,function(i,ele){
                        html+='<li tagId="'+ele.propertyId+'">'+comm.getStrLen(ele.propertyName,20)+'</li>';
                    });
                    $('.ev_hotTags').html(html)
                        .find('li').on('click',function(){
                            var url='/pages/discover/discover_tagSubject.html?rand=' + new Date().getTime() +'#tId='+$(this).attr('tagId');
                            //TODO sps跳转
                            g_sps.jump($(this),url);
                        });

                }
            };
            comm.ajax.async(t.path.tagListUrl,_params,callback);
        },
        shareAction:function(param){
            var t=this;
            var sinaTitle=""; var qqTitle=""; var qZoneTitle="";
            module.share({
                container:$ ( ".ev-shareContainer" ),// 存放分享组件的父级
                type:2,// 默认为 1  1 ：社交分享  2 ：页面左下角全站分享
                url:document.location.href,// 分享链接， 默认取当前页链接
                h5Url:'',//h5页面的链接会生成微信二维码
                title:"",// 分享标题
                shareTrend:0,//0: 不需要站内动态分享  1 ：需要站内动态分享
                trendUrl:'',// 分享到站内动态的接口
                data:{},// 分享到站内动态的接口参数
                callback:function(){},// 分享到站内动态成功后回调函数
                triggerRequest:function(content){//事件点击
                    //获取分享话术
                    var o = $.extend(param,{"sceneType":getShareContentSense.by_tagSubject});
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
                shareSinaSuc:function(){
                    comm.shareLog({
                        shareType: "",
                        resourceId:"" ,
                        resourceType: "",
                        refId: "",
                        shareSence:shareSenceConst.tag_subject,
                        shareChannel:3,
                        shareContent:sinaTitle
                    });
                },
                shareQQSuc:function(){
                    comm.shareLog({
                        shareType: "",
                        resourceId:"" ,
                        resourceType: "",
                        refId: "",
                        shareSence:shareSenceConst.tag_subject,
                        shareChannel:2,
                        shareContent:qqTitle
                    });
                },
                shareQzoneSuc:function(){
                    comm.shareLog({
                        shareType: "",
                        resourceId:"" ,
                        resourceType: "",
                        refId: "",
                        shareSence:shareSenceConst.tag_subject,
                        shareChannel:1,
                        shareContent:qZoneTitle
                    });
                }
            });
        }
    };
    ctrl.init();
    //顶部导航登录回调
    scene.TopHeadLoginCallback= function(){
        ctrl.getTagBaseInfo('reloadData');
    };
});
