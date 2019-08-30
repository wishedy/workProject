function draw(obj){
	var $width = $(".picShowlist").width();
	var $height = $width * 4;     // 380 /   570
	DrawImageLarge(obj,$width,$height);
}


$(function () {
    toggleToPC();
    comm.bindNav(6, false,false);
  var amChannel = comm.getpara()._amChannel;
	var callAppOptions = {
		ios: "allinmdios://app.allinmd.cn/applinks.html?scene=terminalPage&index=4&sourceId=" + $("#resourceId").val() + "&tplPath=1"+(amChannel?"&_amChannel="+amChannel:''),
		android: "allin://com.allin.social:75235?data={scene:3,type:4,sourceId:"+  $("#resourceId").val()  +",tplPath:1"+(amChannel?",_amChannel:"+amChannel:'')+ "}",
		ios9: "http://app.allinmd.cn/applinks.html?scene=terminalPage&index=4&sourceId=" + $("#resourceId").val() + "&tplPath=1"+(amChannel?"&_amChannel="+amChannel:''),
		runAtOnce: false
	};
	//comm.bindCallApp(callAppOptions);

	comm.recognizeAppShareLink(callAppOptions);
    if (comm.getparaNew() && comm.getparaNew().share && (comm.getparaNew().share.toLowerCase() == "app")){//app分享的链接

    }else {
        user.privExecute({
            operateType: 'auth',   //'login','auth','conference'
            callback: function () {
                if (!TempCache.getItem("detailNoNeedApp")) {
                    comm.appWakeUp("confirm", callAppOptions);//唤醒app弹层
                }
                TempCache.removeItem("detailNoNeedApp");
            }
        });
    }
    //user.needRenZhengPop();
    comm.showAppDownload("topic");
    //window.onload = Log.createBrowse(9, "话题终端页面"); //	浏览日志
    var topic = {
        init: function () {
            updateViewdNum();
            initShareWeixin();
            comm.showAppDownload("topic");
        }
    };
    topic.init();
    //@某人
    if($('.detail_cont a').length>0){
        $('.detail_cont a').on('click',function(){
          g_sps.jump(null,'/pages/personal/others_contribution.html?cid='+$(this).attr('href'));
            return false;
        })
    }
    if($('.detail_cont_topic a').length>0){
        $('.detail_cont_topic a').on('click',function(){
            var href = '/pages/personal/others_contribution.html?cid='+$(this).attr('href');
            g_sps.jump(null, href);
            return false;
        })
    }
//新增话题页视频开始
    var qiniuId = '';
    var resourceId=$("#resourceId").val();//资源id
    if ($('.ev_vidMain').length>0) {
        qiniuId = $('.ev_vidMain').attr('data-qiniuId');
        if (qiniuId != ''&&qiniuId!=undefined) {
            $.ajax({
                url: "/mcall/qiniu/storage/getMapVideoList/",
                type: "post",
                data: {paramJson: $.toJSON({refType: 4, refId: resourceId, attUseFlag: 3, qiniuId: qiniuId})},
                dataType: 'json',
                success: function (data) {
                    if (data && !$.isEmptyObject(data.responseObject.responseData) && data.responseObject.responseData.videoListMap.length) {
                        var item = data.responseObject.responseData.videoListMap[0];
                        if (item.qiniuStatus == 1) {
                            $('.decorationBox .attLogo').attr('src','//img50.allinmd.cn/case/videoFormating.jpg');
                            $('.decorationBox span').html('').hide();
                        } else if (item.qiniuStatus == 2) {
                            $('.decorationBox span').html(item.playTime);
                            $('.decorationBox .attLogo').attr('src',item.logoUrl);
                            var videoItem = '<video controls src="' + item.attUrl + '" style="width:100%;height:100%;"></video>';
                            $('.ev_vidMain').on('touchend', function () {
                                if($(this).find('video').length==0){
                                    $('.decorationBox').hide();
                                    $('.ev_vidMain .videoBox')
                                        .append(videoItem)
                                        .find('video')[0].play();
                                }
                            });
                        }
                    }
                }
            })
        }
    }
    //新增话题页视频结束

    //if ($(".picShowlist img").size() > 0) {
    //    $(".picShowlist .imgs").each(function (index, obj) {
    //        var $width = $(".picShowlist").width();
    //        var $height = $width * 4;     // 380 /   570
    //        DrawImageLarge($(obj).find("img:eq(0)").get(0), $width, $height);
    //        $(this).on("vclick", function () {
    //            $(".picShowlist").picShow({open: 0});
    //            return false;
    //        });
    //    });
    //}
    if ($(".imgs img").size() > 0) {
        $(".imgs").each(function (index, obj) {
            var $width = $(".detail_after_img").width();
            var $height = $width * 0.666;     // 371 /   580

            DrawImageLarge($(obj).find("img:eq(0)").get(0), $width, $height);
            $(this).on("vclick", function () {
                gallary = $(obj).picShow({open: 0});
                return false;
            });
            $(window).on("orientationchange", function () {
                if ($(".pswp").size() > 0) {
                    gallary.updateSize();
                }
            });
        });
    }

    //草稿提示

    comm.draftRemind({
        url:"/mcall/customer/draft/reviewOperate/",
        data:{refId:resourceId,reviewType:4,operateType:1},//reviewType 4:话题 7:病例;
        type:2, //1:频道页 2:详情页
        resourceId:resourceId,
        resourceType:4,//resourceType 1-视频，2-文库，4-话题 ,7-病例
        data2:{refId:resourceId,reviewType:4,operateType:2}//operateType 1:说明执行的是判断是否加载提示操作 2:关闭提示
    });
});

function updateViewdNum() {
    commdata.asyncExecute("updateTopicNum", {
        "propertyKey": "browseNum",
        "type": "plus",
        "topicId": $("#resourceId").val()
    });
}

/**
 * 微信分享
 */

function initShareWeixin() {

    var weiXinTitle = "";
    var weiXinDesc = "";
    var weiXinLogo = "//m.allinmd.cn/image/allin_logo.png";
    var resourceId = $('#resourceId').val();
    var refCustomerId = $('#authCustomerId').length>0?$('#authCustomerId').val():"";
    WeixinJSApi.title = function () {
        var resourceTitle = $(".case_detail_title").text().trim();
            resourceTitle = resourceTitle==""?'邀你讨论':resourceTitle;
        var nameCard = $('.user_fabu_sq a').eq(0).text().trim();//作者名称
            nameCard = ((nameCard =='唯医小编'||nameCard=="")?"":nameCard+":");//作者名称为唯医小编时为空
        if (comm.getLength(resourceTitle) > 30) {
            resourceTitle = comm.cutstr(resourceTitle, 30) + "..."
        }
        if (resourceTitle && resourceTitle != "")
            weiXinTitle = nameCard+"《"+resourceTitle + "》 —唯医话题, allinmd";
        return weiXinTitle;
    };
    WeixinJSApi.desc = function () {
        var resourceDesc = $(".detail_cont_topic").text().trim();
        if (comm.getLength(resourceDesc) > 55) {
            resourceDesc = comm.cutstr(resourceDesc, 52) + "..."
        }
        if (resourceDesc && resourceDesc != "")
            weiXinDesc = resourceDesc;
        return weiXinDesc;
    };
    WeixinJSApi.imgUrl = function () {
        weiXinLogo = $('#shareImgSrc').val();
        return weiXinLogo;
    };
    WeixinJSApi.appSuc = function(){
        comm.shareLog({
            shareType: 4,
            resourceId:resourceId ,
            resourceType: 4,
            refId: resourceId,
            isValid: 1,
            shareSence:9,
            shareChannel:4,
            shareContent:weiXinTitle,
            refCustomerId:refCustomerId
        });
    };
    WeixinJSApi.timeLineSuc = function(){
        comm.shareLog({
            shareType: 4,
            resourceId:resourceId ,
            resourceType: 4,
            refId: resourceId,
            isValid: 1,
            shareSence:9,
            shareChannel:5,
            shareContent:weiXinTitle,
            refCustomerId:refCustomerId
        });
    }
}

