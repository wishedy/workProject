/**
 * 功能描述：
 * 使用方法: module.floatRelation(Obj)
 *                必需参数:selector :指定位置
 *                            refId 资源id
 *                            customerId 当前人id
 *                            refCustomerId 当前资源人id
 *                            type 资源类型
 *                        praiseNum collectNum followNum 三个值
 *
 * 注意事件：
 * 引入来源：  作用：
 *
 * Created by LiChunHui on 2015/3/4.
 *
 * add by QiaoLiang on 2015-3-9
 * 变更为template形式，追加参数检测提示、社交互动功能；
 */
module.floatRelation = function (Obj) {
    var controller = {
        config : {
        	resourceId:$('#resourceId').val(),
        	resourceType:$('#resourceType').val(),
            nameCard:($.trim($('.name-card').text())=="唯医小编"?"": $.trim($('.name-card').text())),
            shareImgUrl:(($('#shareImgSrc').length)?$('#shareImgSrc').val():''),
            videoType:(($('#videoType').length&&$('#videoType').val()!="")?$('#videoType').val():""),
        	videoInfo:PC_CALL+"video/getMapById/",
        	caseInfo:PC_CALL+"case_baseinfo/getMapById/"
        },
        el: {
            weixingBtn: ".weixin_ico",
            erweima: ".qrcodeEWM",
            relation: ".fx_b_jh"  //社交条
        },
        path: {
            follow: PC_CALL + "customer/follow_resource/create/", //关注
            cancelFollow: PC_CALL + "customer/follow_resource/delete/", //取消关注
            praise: PC_CALL + "prefer/create/", 	  //赞
            praiseCancel: PC_CALL + "prefer/delete/", //取消赞
            collect: PC_CALL + "collection/create/", //收藏
            collectCancel: PC_CALL + "collection/delete/"//收藏取消
            //视频病例pk项目专用话术接口
        },
        init: function (Obj) {
            var t = this;
            t.options = {};
            var o = {
                title: document.title,
                url: window.location.href
            };
            t.options = $.extend(o, Obj);

            var opts = t.options;
            if (opts.customerId == opts.refCustomerId)
                $(opts.selector).append(t.template.selfRelation({
                    praiseNum: opts.praiseNum,
                    collectNum: opts.collectNum,
                    followNum: opts.followNum
                }));
            else
                $(opts.selector).append(t.template.relation({
                    praiseNum: opts.praiseNum,
                    collectNum: opts.collectNum,
                    followNum: opts.followNum
                }));

            //文章与视频不显示关注
            if (opts.type == ResouceType.video || opts.type == ResouceType.doc) {
                $(t.options.selector).find("div:eq(1)").addClass("notFollowScene");
                $(t.options.selector).find(".fx_b_gz").remove();
            }
			//根据activityId判断是否是视频病例PK项目中活动，nameCard发布人，summaryTitle简介,channelName频道，shareImgSrc分享默认图
			var queryId,queryUrl,param = {},nameCard="",summaryTitle="",channelName="——唯医网 allinmd",shareImgSrc,videoType;
            /*
            * 视频类型
            * */
            switch(t.config.videoType){//视频类型(1-手术视频，2-课程视频，3-会议视频，4-专家访谈视频)
                case '1':
                    videoType ='手术';
                    break;
                case '2':
                    videoType ='课程';
                    break;
                case '3':
                    videoType ='会议';
                    break;
                case '4':
                    videoType ='专家访谈';
                    break;
                default:
                    videoType='';
            }
            /*分享图片*/
            //shareImgSrc = t.config.shareImgUrl;
			if($('meta[name="description"]').length){//summaryTitle默认为页面描述
                summaryTitle=$('meta[name="description"]').attr('content');
            }
            if(t.config.resourceType==1){//视频
                t.options.title=comm.getStrByteLen($.trim($('.v_d_t').text()),30);
				queryId = "videoId";
				queryUrl = t.config.videoInfo;
                if($('.video_jj_text').text()!=""){
                    summaryTitle=comm.getStrByteLen($.trim($('.video_jj_text').text()),160);//视频简介
                }
                channelName="——唯医"+videoType+"视频, allinmd";
                shareImgSrc = (t.config.shareImgUrl==''?'//modules.allinmd.cn/float-relation/images/logo.png':t.config.shareImgUrl);
			}else if(t.config.resourceType==7){//病例
                t.options.title=comm.getStrByteLen($.trim($('.video_jj_title').text()),30);
				queryId="caseId";
				queryUrl = t.config.caseInfo;
                if($('.cdr_xb').eq(1).text()!=""){
                    summaryTitle=comm.getStrByteLen($.trim($('.cdr_xb').eq(1).text()),160);//主诉
                }
                channelName="——唯医病例, allinmd";
                if(t.config.shareImgUrl==""){
                    var docImgs = $('.video_jj img');
                    if(docImgs.length>0){
                        shareImgSrc = $($('.video_jj img')[0]).attr('src');
                    }else{
                        shareImgSrc='//modules.allinmd.cn/float-relation/images/logo.png';
                    }
                }else{
                    shareImgSrc = t.config.shareImgUrl;
                }
			}else if(t.config.resourceType==4){//话题
                t.options.title=comm.getStrByteLen($.trim($('.video_jj_title').text()),30);
                t.options.title = t.options.title==""?'邀你讨论': t.options.title;
                if($('.video_jj_text').text()!=""){
                    summaryTitle=comm.getStrByteLen($('.video_jj_text').text(),160);//话题正文
                }
                channelName="——唯医话题, allinmd";
                if(t.config.shareImgUrl==""){
                    var docImgs = $('.video_jj img');
                    if(docImgs.length>1){
                        shareImgSrc = $($('.video_jj img')[1]).attr('src');
                    }else{
                        shareImgSrc='//modules.allinmd.cn/float-relation/images/logo.png';
                    }
                }else{
                    shareImgSrc = t.config.shareImgUrl;
                }
			}else if(t.config.resourceType==2){//文库
                t.options.title=comm.getStrByteLen($.trim($('.video_jj_title').text()),30);
                if($('.video_jj_text').text()!=""){//文库正文
                    summaryTitle=comm.getStrLen($('.video_jj_text').text(),160);
                }else if($.trim($('.topic_ads').text())!=""){
                    summaryTitle=comm.getStrByteLen($('.topic_ads').text(),160);
                }
                channelName="——唯医文库, allinmd";
                if(t.config.shareImgUrl==""){
                    var docImgs = $('.video_jj img');
                    if(docImgs.length>0){
                        shareImgSrc = $($('.video_jj img')[0]).attr('src');
                    }else{
                        shareImgSrc='//modules.allinmd.cn/float-relation/images/logo.png';
                    }
                }else{
                    shareImgSrc = t.config.shareImgUrl;
                }
            }
			param[queryId] = t.config.resourceId;
			nameCard = (t.config.nameCard!=""?(t.config.nameCard+":"):"");
			//将当前地址转为http
			t.options.url= "http:"+location.href.split(":")[1];
			t.shareIco = {
                "tsina"	:"http://service.weibo.com/share/share.php?title=" + encodeURIComponent((nameCard+"《"+t.options.title+"》"+(t.config.resourceType==7?'--来自唯医病例，allinmd':channelName)+"，点击查看:"))+  "&url=" + encodeURIComponent(t.options.url) + "&source=bookmark&appkey=&pic=https:"+encodeURIComponent(shareImgSrc),
                "tqq"	:"http://connect.qq.com/widget/shareqq/index.html?title="+ encodeURIComponent(nameCard+"《"+t.options.title+"》"+channelName) +"&url=" + encodeURIComponent(t.options.url)+"&summary="+encodeURIComponent(summaryTitle)+"&pics=https:"+shareImgSrc,
                "qzone"	:"http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=" + encodeURIComponent(t.options.url) + "&title=" + encodeURIComponent(nameCard+"《"+t.options.title+"》"+channelName)+"&summary="+encodeURIComponent(summaryTitle)+"&pics=https:"+encodeURIComponent(shareImgSrc)
            };
			if(queryId!=undefined){//如果是视频或病例则判断是否是活动作品
				$.ajax({
					type:"post",
					url:queryUrl,
					async:false,
					data:{paramJson:$.toJSON(param)},
					dataType:"json",
					success:function(res){
						if(res&&res.responseObject.responseData&&res.responseObject.responseData.data_list){
							var data = res.responseObject.responseData.data_list[0];
							var activityId;
							var shareContent = data.shareResourceContent;
							if(data.case_baseinfo){
								activityId=data.case_baseinfo.activityId;
							}else if(data.cms_video){
								activityId = data.cms_video.activityId;
							}
							if(activityId!=undefined&&activityId>0){//如果是pK活动终端页，则用返回的话术
								t.shareIco = {
					                "tsina"	:"http://service.weibo.com/share/share.php?title=" + encodeURIComponent(shareContent.sina.sinaContent) + "&url=" + encodeURIComponent(t.options.url) + "&source=bookmark&appkey=&pic=https:"+encodeURIComponent(shareImgSrc),
					                "tqq"	:"http://connect.qq.com/widget/shareqq/index.html?title="+ encodeURIComponent(shareContent.qq.qqContent) +"&url=" + encodeURIComponent(t.options.url)+"&pics=https:"+shareImgSrc,
					                "qzone"	:"http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=" + encodeURIComponent(t.options.url) + "&title=" + encodeURIComponent(shareContent.qqSpace.qqSpaceContent)+"&summary=''&pics=https:"+encodeURIComponent(shareImgSrc)
					            };
							}
						}
					}
				});
			}
			
            


            t.share();
            t.weixingClick();

            //赞、收藏、关注事件
            var praiseStatus = false, collectStatus = false, followStatus = false;
            $(t.el.relation).find(".fx_b_zan").on("click", function () {
            	var _this = this;
                user.login({
                    callback: function () {
                    	praiseStatus = !praiseStatus;
                        t.events.praise(praiseStatus, _this);
                    },
                    scene: privilegeSceneConst.eSceneTypePraiseResourse // 赞
                });
            }).on("mouseover", function () {
                if (praiseStatus) {
                    $(this).find("div:eq(0)").removeClass("v2_spr_detail_zan_mr_hover")
                        .addClass("v2_spr_detail_zan_mr_active");
                }
            }).on("mouseout", function () {
                if (praiseStatus) {
                    $(this).find("div:eq(0)").removeClass("v2_spr_detail_zan_mr_active")
                        .addClass("v2_spr_detail_zan_mr_hover");
                }
            });

            $(t.el.relation).find(".fx_b_sc").on("click", function () {
                var _this = this;
                user.login({
                    callback: function () {
                        collectStatus = !collectStatus;
                        if (collectStatus)    t.events.collect(collectStatus, _this);
                        else t.events.collect(collectStatus, _this);
                    },
                    scene: privilegeSceneConst.eSceneTypeCollect // 收藏
                });
            }).on("mouseover", function () {
                if (collectStatus) {
                    $(this).find("div:eq(0)").removeClass("v2_spr_detail_sc_mr_hover")
                        .addClass("v2_spr_detail_sc_mr_active");
                }
            }).on("mouseout", function () {
                if (collectStatus) {
                    $(this).find("div:eq(0)").removeClass("v2_spr_detail_sc_mr_active")
                        .addClass("v2_spr_detail_sc_mr_hover");
                }
            });

            $(t.el.relation).find(".fx_b_gz").on("click", function () {
                var _this = this;
                user.login({
                    callback: function () {
                        followStatus = !followStatus;
                        if (followStatus)    t.events.follow(followStatus, _this);
                        else t.events.follow(followStatus, _this);
                    },
                    scene: privilegeSceneConst.eSceneTypeAttention // 关注
                });
            }).on("mouseover", function () {
                if (followStatus) {
                    $(this).find("div:eq(0)").removeClass("v2_spr_detail_gz_mr_hover")
                        .addClass("v2_spr_detail_gz_mr_active");
                }
            }).on("mouseout", function () {
                if (followStatus) {
                    $(this).find("div:eq(0)").removeClass("v2_spr_detail_gz_mr_active")
                        .addClass("v2_spr_detail_gz_mr_hover");
                }
            });

        },
        template: {
            relation: function (kv) {
                return "<div class=\"module-floatRelation\">" +
                    "<div class=\"fx_detail_content\">" +
                    "<ul class=\"fx_leibie\" id=\"hr_share\">" +
                    "<div class=\"qrcodeEWM\"><div class=\"qrcodeTable\"></div></div>" +
                    "<li class=\"weixin_ico cursor\"></li>" +
                    "<li class=\"share_ico_tsina cursor\"></li>" +
                    "<li class=\"share_ico_tqq cursor\"></li>" +
                    "<li class=\"share_ico_qzone cursor\"></li>" +
                    "<div class=\"clear\"></div>" +
                    "</ul>" +
                    "<div class=\"fx_b_jh\">" +
                    "<div class=\"fx_b_zan\">" +
                    "<div class=\"v2_spr_detail_zan_mr\"></div>" +
                    "<div class=\"fx_b_zan_text\">" + kv.praiseNum + "人点赞</div>" +
                    "<div class=\"clear\"></div>" +
                    "</div>" +
                    "<div class=\"fx_b_sc\">" +
                    "<div class=\"v2_spr_detail_sc_mr\"></div>" +
                    "<div class=\"fx_b_sc_text\">" + kv.collectNum + "人收藏</div>" +
                    "<div class=\"clear\"></div>" +
                    "</div>" +
                    "<div class=\"fx_b_gz\">" +
                    "<div class=\"v2_spr_detail_gz_mr\"></div>" +
                    "<div class=\"fx_b_gz_text\">" + kv.followNum + "人关注</div>" +
                    "<div class=\"clear\"></div>" +
                    "</div>" +
                    "<div class=\"clear\"></div>" +
                    "</div>" +
                    "<div class=\"clear\"></div>" +
                    "</div>" +
                    "</div>";
            },
            selfRelation: function (kv) { //当为本人时
                return "<div class=\"module-floatRelation\">" +
                    "<div class=\"fx_detail_content\">" +
                    "<ul class=\"fx_leibie\" id=\"hr_share\">" +
                    "<div class=\"qrcodeEWM\"><div class=\"qrcodeTable\"></div></div>" +
                    "<li class=\"weixin_ico cursor\"></li>" +
                    "<li class=\"share_ico_tsina cursor\"></li>" +
                    "<li class=\"share_ico_tqq cursor\"></li>" +
                    "<li class=\"share_ico_qzone cursor\"></li>" +
                    "<div class=\"clear\"></div>" +
                    "</ul>" +
                    "<div class=\"fx_b_jh\">" +
                    "<div class=\"self-praise\">" +
                    "<div class=\"v2_spr_detail_zan_mr\"></div>" +
                    "<div class=\"fx_b_zan_text\">" + kv.praiseNum + "人点赞</div>" +
                    "<div class=\"clear\"></div>" +
                    "</div>" +
                    "<div class=\"self-collect\">" +
                    "<div class=\"v2_spr_detail_sc_mr\"></div>" +
                    "<div class=\"fx_b_sc_text\">" + kv.collectNum + "人收藏</div>" +
                    "<div class=\"clear\"></div>" +
                    "</div>" +
                    "<div class=\"self-follow\">" +
                    "<div class=\"v2_spr_detail_gz_mr\"></div>" +
                    "<div class=\"fx_b_gz_text\">" + kv.followNum + "人关注</div>" +
                    "<div class=\"clear\"></div>" +
                    "</div>" +
                    "<div class=\"clear\"></div>" +
                    "</div>" +
                    "<div class=\"clear\"></div>" +
                    "</div>" +
                    "</div>";
            }
        },
        //微信点击
        weixingClick: function () {
            var t = this;
            var up = 0;
            $(this.el.weixingBtn).on("click", function () {
                    if (up === 0) {

                        var address = "";
                        var tplId = $("#resourceTpl").val();

                        if (!comm.equipment.IsPC()) { //非pc端时 PDF
                            address = "//m.allinmd.cn/" + $("#resourceWapUrl").val();
                        } else {
                            address = location.href;
                        }

                        // 是否支持canvas
                        if (!!document.createElement('canvas').getContext) {
                            $(t.el.erweima).animate({height: 191}, 500, function () {
                                up = 1;
                            }).qrcode({
                                text: address
                            });

                            $("canvas").css("padding", "36px 16px 16px 16px");
                        } else {
                            $(t.el.erweima).animate({height: 191}, 500, function () {
                                up = 1;
                            }).find(".qrcodeTable").qrcode({
                                render: "table",
                                text: address
                            });
                            $(".qrcodeTable").css("padding", "36px 16px 16px 16px");
                        }

                    } else {
                        $(t.el.erweima).animate({height: 0}, 500, function () {
                            up = 0;
                            var ele = $(this).find("table");
                            if (ele.length > 0) {
                                ele.remove();
                                $(".qrcodeTable").removeAttr("style");
                            } else {
                                $("canvas").remove();
                            }

                        });
                    }

                    return false;
                }
            );
            $(t.el.erweima).on("click", function () {
                $(t.el.erweima).animate({height: 0}, 500, function () {
                    up = 0;
                });
            });
        },
        share: function () {
            var t = this;

            function eFunction(str) {
                return function () {
                    window.open(formatmodel(t.shareIco[str], {title: t.options.title, url: t.options.url}));
                    //window.showModalDialog(formatmodel(t.shareIco[str],{title: t.options.title, url: t.options.url}), new Object(), 'dialogWidth=700px;dialogHeight=400px');
                };
            }

            function formatmodel(str, model) {
                for (var k in model) {
                    var re = new RegExp("{" + k + "}", "g");
                    str = str.replace(re, model[k]);
                }
                return str;
            }

            for (var si in t.shareIco) {
                $("#hr_share .share_ico_" + si).on('click', eFunction(si));
            }
        },
        events: {
            praise: function (status, el) {
                var t = controller;
                var url = "", params = {};
                params.paramJson = $.toJSON({
                    refId: t.options.refId,
                    customerId: t.options.customerId,
                    usefulType: t.options.type,
                    upDownType: 1
                });

                var praiseNum = parseInt($(".fx_b_zan_text").text().match(/\d/g).join(""));
                if (status) {
                    praiseNum++;
                    url = t.path.praise;
                    $(el).find("div:eq(0)").addClass("v2_spr_detail_zan_mr_active");
                } else {
                    praiseNum--;
                    url = t.path.praiseCancel;
                    $(el).find("div:eq(0)").removeClass("v2_spr_detail_zan_mr_active");
                }
                $(".fx_b_zan_text").text(praiseNum + "人点赞");
                t.ajaxSend(url, params);
            },
            collect: function (status, el) {
                var t = controller;
                var url = "", params = {};
                params.paramJson = $.toJSON({
                    customerId: t.options.customerId,
                    collectionType: t.options.type,
                    refId: t.options.refId
                });

                var collectNum = parseInt($(".fx_b_sc_text").text().match(/\d/g).join(""));
                if (status) {
                    url = t.path.collect;
                    collectNum++;
                    $(el).find("div:eq(0)").addClass("v2_spr_detail_sc_mr_active");
                } else {
                    url = t.path.collectCancel;
                    collectNum--;
                    $(el).find("div:eq(0)").removeClass("v2_spr_detail_sc_mr_active");
                }

                $(".fx_b_sc_text").text(collectNum + "人收藏");
                t.ajaxSend(url, params);
            },
            follow: function (status, el) {
                var t = controller;
                var url = "";
                var params = {};
                var followNum = parseInt($(".fx_b_gz_text").text().match(/\d/g).join(""));
                if (status) {
                    url = t.path.follow;
                    followNum++;
                    $(el).find("div:eq(0)").addClass("v2_spr_detail_gz_mr_active");
                    params.paramJson = $.toJSON({
                        followType: t.options.type,
                        refName: $(".video_jj_title").text(),
                        refId: t.options.refId
                    });
                } else {
                    url = t.path.cancelFollow;
                    followNum--;
                    $(el).find("div:eq(0)").removeClass("v2_spr_detail_gz_mr_active");
                    params.paramJson = $.toJSON({
                        followType: t.options.type,
                        refId: t.options.refId
                    });
                }

                $(".fx_b_gz_text").text(followNum + "人关注");
                t.ajaxSend(url, params);
            }
        },
        ajaxSend: function (url, params) {
            $.ajax({
                url: url,
                type: "POST",
                data: params
            });
        }

    };

    controller.init(Obj);
};
