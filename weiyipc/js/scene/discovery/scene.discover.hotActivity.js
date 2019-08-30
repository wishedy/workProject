/**
 * @name:
 * @desc:
 * @example:
 * @depend:
 * @date: 2016/8/16
 * @author: sunhaibin
 */

$(function(){
    var ctrl={
        path:{
            hotActs:PC_CALL+'cms/activity/getMapList3/',
            banner:PC_CALL + 'ad/position/profile/getMapList/',             //banner
            getShareContent:PC_CALL+'comm/data/share/getMapList3/'
        },
        params:{
            sortType:1,
            pageIndex:1,
            pageSize:20
        },
        init:function(){
            var t=this;
            t.commonSearch();
            t.bannerLoad();
        },
        bannerLoad:function(){
            var t=this;
            var param = {paramJson: $.toJSON({
                firstResult: 0,
                maxResult: 1,
                visitSiteId:1,//pc 1  h52
                channelId:141, //channelId:''//113-病例 78-视频 81-文库 114-话题  68-首页
                isIndex:1//是否是首页,首页传1，频道页不传值
            })};
            var callback =function(d){
                if(d&&!$.isEmptyObject(d.responseObject.responseData)&& d.responseObject.responseData.data_list.length){
                    var item = d.responseObject.responseData.data_list[0];
                    var html="";
                    if(item.ad_profile_attachment&&item.ad_profile_attachment.length){
                    html =  '<a href="'+item.ad_profile_attachment[0].linkUrl+'">'+
                            '<img src="'+item.ad_profile_attachment[0].adAttUrl+'" alt=""/>'+
                            '<p>'+item.ad_profile_attachment[0].adAttName+'</p>'+
                            '</a>';
                        $('.ev_hotActAd').html(html);
                    }else{
                        $('.ev_hotActAd').parent().hide();
                    }
                }else{
                    $('.ev_hotActAd').parent().hide();
                }
            };
            comm.ajax.async(t.path.banner,param,callback);
        },
        commonSearch:function(){
            var t=this;
            var pageClickCallback =function(o){
                t.params.pageIndex = o;
                t.renderDom(function(n){
                    $('.pager').pager({pagenumber:o,pagecount:n,buttonClickCallback:pageClickCallback})
                });
            };
            t.renderDom(function(n){
                $('.pager').pager({pagenumber:1,pagecount:n,buttonClickCallback:pageClickCallback})
            })
        },
        listTemp:function(kv){
            //0-无状态1-最热2-最新3-正在进行4-已结束  //无最热状态
            var _tip = '';
            if(kv.state==3){
                _tip = '<i class="al-discover_SMC_hotActivity"><em></em>正在进行</i>';
            }else if(kv.state==2){
                _tip = ' <i class="al-discover_SMC_NewIcon"><em></em>New</i>';
            }else if(kv.state==4){
                _tip = ' <i class="al-discover_SMC_endIcon"><em></em>精彩回顾</i>';
            }
            var html=' <section class="al-discover_subMainContent">'+
                       '     <figure>'+
                            _tip+
                       '    <a href="'+kv.resUrl+'">  <img src="'+kv.attUrl+'" alt=""/></a>'+
                       '     </figure>'+
                       '     <p><a href="'+kv.resUrl+'">'+kv.resName+'</a></p>'+
                       ' </section>';
            return html;
        },
        renderDom:function(fn){
            var t=this;
            var paramJson ={paramJson:$.toJSON(t.params)} ;
            var callback =function(data){
                if(data&&!$.isEmptyObject(data.responseObject.responseData)&&data.responseObject.responseData.data_list.length){
                    var res =data.responseObject.responseData.data_list;
                    var html='';
                    var _tep="";
                    var pageCount=Math.ceil(data.responseObject.responseData.total_count/data.responseObject.responseData.page_size);
                    $.each(res,function(i,el){
                        _tep = t.listTemp({
                            state:el.state,
                            resUrl:el.activityUrl,
                            attUrl:el.activityPicUrl,
                            resName:el.activityName
                        });
                        html+=_tep;
                    });
                    $('.ev_hotActs').html(html);
                    fn&&fn(pageCount);
                    t.shareAction(t.params);
                }else{
                    $('.ev-shareContainer').hide();
                }
            };
            comm.ajax.async(t.path.hotActs, paramJson,callback);
        },
        shareAction:function(param){
            var t=this;
            var o = $.extend(param,{"sceneType":getShareContentSense.hot_activity});
            var sinaTitle="";var qqTitle="";var qZoneTitle="";
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
                        shareSence:shareSenceConst.discover_hotActivity,
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
                        shareSence:shareSenceConst.discover_hotActivity,
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
                        shareSence:shareSenceConst.discover_hotActivity,
                        shareChannel:1,
                        shareContent:qZoneTitle
                    });
                }
            });
        }
    };
    ctrl.init();
})