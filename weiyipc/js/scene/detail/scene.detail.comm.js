/**
 * 功能描述：终端页公共模块组装
 * 使用方法:
 * 注意事件：
 * 引入来源：作用：
 *
 * Created by QiaoLiang on 2015-3-27.
 */
/*ie8兼容indexOf()方法*/
if (!Array.prototype.indexOf){
    Array.prototype.indexOf = function(elt /*, from*/)
    {
        var len = this.length >>> 0;
        var from = Number(arguments[1]) || 0;
        from = (from < 0)
            ? Math.ceil(from)
            : Math.floor(from);
        if (from < 0)
            from += len;
        for (; from < len; from++)
        {
            if (from in this &&
                this[from] === elt)
                return from;
        }
        return -1;
    };
}
if (document.URL.indexOf("doc") > 0 || document.URL.indexOf("topic") > 0 || document.URL.indexOf("case") > 0) {
	var scene, onLoginClose;
	if (document.URL.indexOf("doc") > 0) {
		scene = privilegeSceneConst.eSceneTypeDocDetail;
		onLoginClose = function () {
            g_sps.jump(null, "/pages/channel/doc/doc_index.html");
		};
	}

	if (document.URL.indexOf("topic") > 0) {
		scene = privilegeSceneConst.eSceneTypeTopicDetail;
		onLoginClose = function () {
            g_sps.jump(null, "/pages/channel/topic/topic_index.html");
		};
	}

	if (document.URL.indexOf("case") > 0) {
		scene = privilegeSceneConst.eSceneTypeCaseDetail;
		onLoginClose = function () {
            g_sps.jump(null,  "/pages/channel/case/case_index.html");
		};
	}
	// TODO: 厂商处理：如果是厂商用户，在病例中提示 该功能仅向医务人员开放，
	user.login({
		callback: function () {
			$(".mask_body").remove();
		},
		scene: scene,
		onClose: onLoginClose,
		onAuthCancel:"back"      // 当点暂不认证时的处理、回退到来源页
	});
}

function toggleToMobile() {
	var PC = comm.equipment.IsPC();
	if (!PC) {
		var currentUrl = location.href;
		if (currentUrl.indexOf("www.allinmd.cn") > -1) {
			location.href = currentUrl.replace("www.allinmd.cn", "m.allinmd.cn").replace("/html/", "/html/m/");
		}
	}
}

$(function () {
	comm.LightBox.showloading();
	//检测如果移动端设备访问pc端页面则转入移动端页面
	toggleToMobile();
	comm.LightBox.hideloading();
	//页面获取值 资源id与资源类型
	var refId = $("#resourceId").val(), type = parseInt($("#resourceType").val());
	//当前人登录人id
	var cid = $("#sesCustomerId").val();

	//请求基础数据
	var params = {};
	params.paramJson = $.toJSON({
		refId: refId,
		resourceType: type,
		logoUseFlag: UseFlag.c
	});
	var result = comm.ajax.sync(PC_CALL + "video/info/", params).responseObject;

	//载入数据
	var name = result.resourceCustomerName,
		logoUrl = result.logoUrl === "" ? "//img00.allinmd.cn/personal/user_img65.png" : result.logoUrl,
		customerId = result.resourceCustomerId,
		praiseNum = result.praiseNum.toW(),
		collectNum = result.collectionNum.toW(),
		followNum = result.followNum.toW(),
		browseNum = result.browseNum.toW(),
		reviewNum = result.reviewNum.toW();

	//直接置入浏览数或播放数
	$(".browse-num").text(browseNum);

	//相关推荐
	$("#scrollRecommend").scrollBox({});
	
	//纠错 丨 举报
	$(".Ev-correction").on("click", function(){
        g_sps.jump(null, "/pages/singlePage/correction/correction.html?refType="+type+"&refId="+refId);
	});
	$(".Ev-report").on("click", function(){
		module.report({refType: type, refId: refId});
	});

	//终端页全部评论数量
	$(".v_all_title").html("全部评论(<span class='ev-allReviewNum'>" + reviewNum + "</span>条)");

	//个人名片
	module.nameCard({
		selector: ".name-card"
	});

	//回复
	module.replyForm({
		selector: ".module-replyForm-wrap",
		refId: refId,
		cid: cid,
		authId: customerId, //作者ID
		logoUrl: logoUrl,
		name: name,
		type: type
	});

	//悬浮社交
	module.floatRelation({
		selector: ".module-floatRelation-wrap",
		refId: refId,
		type: type,
		customerId: cid, //当前人id
		refCustomerId: customerId, //当前资源人id
		praiseNum: praiseNum, followNum: followNum, collectNum: collectNum
	});

	//回应列表
	module.replyList({
		target: ".detail_replys", //瀑布流加载位置
		hint: ".reply-list-hint", //提示位置
		refId: refId,
		authId: customerId, //作者ID
		type: type,
		cid: cid,
		callback: function () {
			$(".evModuleReplyForm").click();
		}
	});

	//OE文档中英文切换
	if ($(".ch_en")) {
		$(".ch_en").toggle(
			function () {//切换成中文
				$(this).find(".ch_en_center").text("切换到英文版");
				$(".oe_ch").show();
				$(".oe_en").hide();
			},
			function () {//切换成英文
				$(this).find(".ch_en_center").text("切换到中文版");
				$(".oe_ch").hide();
				$(".oe_en").show();
			}
		);
	};

	function qiniuVideoHandle(refType,refId){ //七牛视频图片处理
		if($(".Ev-videoPic").length>0 && $.trim($(".Ev-videoPic").attr("data-qiniuId")).length>0){ //如果存在视频区域
			var params= {}
			params.paramJson= $.toJSON({
				refType: refType, 
				refId: refId,
				attUseFlag: 10,
				qiniuId: $(".Ev-videoPic").attr("data-qiniuId")
			});
			$.ajax({url: PC_CALL+"qiniu/storage/getMapVideoList/",type:"get",data:params}).done(succ);
		}else if($(".Ev-videoPic").length>0 && $.trim($(".Ev-videoPic").attr("data-qiniuId")).length == 0){
			$(".Ev-videoPic").children().hide();
			if(refType == 7){
				$(".Ev-videoPic").append('<img src="//img10.allinmd.cn/default/qiniu296_196.jpg">');
			}else if(refType == 4){
				$(".Ev-videoPic").append('<img src="//img10.allinmd.cn/default/qiniu900_600.jpg">');
			}
		}
		
		function succ(res){
			if(!res.responseObject.responseStatus) { $(".Ev-videoPic").remove(); return false;}
			if($(".Ev-videoPic").length>0 && res.responseObject.responseStatus && res.responseObject.responseData.videoListMap.length>0 && res.responseObject.responseData.videoListMap[0].qiniuStatus == 2){
				var data = res.responseObject.responseData.videoListMap[0];
				//图片替换
				$(".Ev-qiniuVideoPic>img").attr("src",data.logoUrl);
				
				if(parseInt($("#resourceType").val()) == 7){
					//标题替换
					$(".Ev-qiniuVideoTitle").text(data.attName.split(".")[0]);
				}
				
				$(".Ev-videoPic").attr("data-videoSrc",data.attUrl).on("click", function(){
					module.backgroundVideo({videoSrc:$(this).attr("data-videosrc")});
				});
			}else{
				$(".Ev-videoPic").children().hide();
				if(refType == 7){
					$(".Ev-videoPic").append('<img src="//img10.allinmd.cn/default/qiniu296_196.jpg">');
				}else if(refType == 4){
					$(".Ev-videoPic").append('<img src="//img10.allinmd.cn/default/qiniu900_600.jpg">');
				}
				
			}
		}
	}
	
	//病例页
	if (type === 7) {
		qiniuVideoHandle(7,refId);
		
		//病例投票
		if ($("#vote").length > 0) {
			module.caseVote({
				"voteRecep": $("#vote")
			});
		}

		//病例页图片放大图片翻转
		var ele = $(".ev-zoomImg");
		if (ele.find("li") !== undefined) {
			ele.find("li").on("mouseover", function () {
				var tempH= $(this).find(".case_img_li>img").outerHeight(),tempW= $(this).find(".case_img_li>img").outerWidth();
				$(this).find(".case_img_zoom img").css({"height":tempH,"width":tempW});
				$(this).find(".case_img_zoom").show();
			}).on("mouseout", function () {
				$(this).find(".case_img_zoom").hide();
			});
		}
		//单张时
		$(".ev-singleZoomImg").on("mouseover", function () {
			var tempH= $(this).find(".case_img_li>img").outerHeight(),tempW= $(this).find(".case_img_li>img").outerWidth();
			$(this).find(".case_img_zoom img").css({"height":tempH,"width":tempW});
			$(this).find(".case_img_zoom").show();
		}).on("mouseout", function () {
			$(this).find(".case_img_zoom").hide()
		})
	}
	
	//话题页
	if(type === 4){
		qiniuVideoHandle(4,refId);
	}


	//所有查看大图功能
	$(document).on("click", ".viewBigImg", function (e) {
		var container = $(this);
		var index = 0;
		if ($(e.target).parents("li").eq(0).index() > 0) {
			index = $(e.target).parents("li").eq(0).index();
		}
		module.viewBigImgAll({event: e, container: container, index: index});
	});


	(function () {
		/* 隐藏无链接的标签 */
		var ids = ["关节", "足踝", "四肢矫形", "小儿骨科", "肘&肩", "脊柱", "运动医学", "创伤", "人工髋关节置换", "人工髋关节翻修", "保髋治疗", "人工膝关节置换 ", "人工膝关节翻修 ", "保膝治疗", "足踝", "手", "腕", "髋", "脊柱", "运动医学", "创伤", "上肢", "足踝", "肘", "肩", "颈椎", "腰椎", "脊柱侧凸", "脊髓", "脊柱创伤", "脊柱肿瘤", "肘", "足踝", "髋", "膝", "肩", "腕关节镜", "髋与骨盆", "下肢", "脊柱", "上肢", "骨肿瘤", "康复", "骨质疏松", "基础", "显微修复", "中西医结合"]; // 二级或三级tag
		if (!Array.prototype.indexOf) {
			Array.prototype.indexOf = function (elt /*, from*/) {
				var len = this.length >>> 0;
				var from = Number(arguments[1]) || 0;
				from = (from < 0)
					? Math.ceil(from)
					: Math.floor(from);
				if (from < 0)
					from += len;
				for (; from < len; from++) {
					if (from in this &&
						this[from] === elt)
						return from;
				}
				return -1;
			};
		}
		$(".video_tag_main li").each(function (index, el) {
			if (ids.indexOf($.trim($(el).text())) == -1) {
				$(this).hide();
			}
		});

        // 增加浏览数量
        window.refidoc = $('#resourceId').val();
        window.usefulType = $('#resourceType').val();
        $.ajax({
            url: PC_CALL+'follow/addBrowseNum/',
            type: 'post',
            data: {
                refId: refidoc,
                usefulType: usefulType
            },
            success: function (data) {
                if (data) {
                    $('#lib_rq_num').text(data.rows.responseMessage).parent().fadeIn();
                }
            }
        });
    })();

});

//针对视频
if (document.URL.indexOf("video") > -1) {
	//允许播放时间
	time = 180;
	var authDataObject;

	setTimeout(function () {
		CKobject.getObjectById('CKa1').videoPlay();
	}, 7000);

	function checkAuth(data) {
		html = "";
		if (data == null || data == "" ||
			data.responseObject == undefined ||
			$.isEmptyObject(data.responseObject) ||
			data.responseObject.state == -1 ||
			data.responseObject.state == 0 ||
			data.responseObject.state == 3) {	//未认证
			if ($("#goLogin").length === 0) {
				html = "<img id=\"goLogin\" src=\"//img00.allinmd.cn/detail/video/immediatelyAccreditation.png\" style=\"width:722px;height:450px;\">";
			}
		} else {
			var state = data.responseObject.state;

			var company = data.responseObject.company;
			var areasExpertise = data.responseObject.areasExpertise;
			var medicalTitle = data.responseObject.medicalTitle;
			if (state == 1 || state == 2) {
				//认证已经通过，此时不允许再次认证
				if (!company || !areasExpertise || !medicalTitle && $("#goLogin").length === 0) {
					//认证已经通过，但资料未完善。
					html = "<img id=\"goLogin\" src=\"//img00.allinmd.cn/detail/video/immediatelyWs.png\" style=\"width:722px;height:450px;\">";
				}
			}
		}

		return html;
	}

	//SWF
	function ckplayer_status(str) {
		if (str.indexOf("time:") === 0) {
			var nowTime = str.substr(str.lastIndexOf(":") + 1);
			if (time < nowTime) {
				var html = "";
				if (!user.getLoginStatus() && $("#goLogin").length === 0) { //未登录
					html = "<img id=\"goLogin\" src=\"//img00.allinmd.cn/detail/video/immediatelyLogin.png\" style=\"width:722px;height:450px;\"/>";
				} else {
					if (!authDataObject) {
						$.ajax({
							url: PC_CALL + "customer/auth/getAuthBycustomerId/",
							dataType: "json",
							type: "post",
							async: false,
							success: function (data) {
								authDataObject = data;
							}
						})
					}

					html = checkAuth(authDataObject);

				}

				if (html.length > 0) {
					CKobject.getObjectById('CKa1').videoPause();
					//$("#a1").hide();
					$("#a1").css("position", "absolute").css("top", "-10000px");
					if($("#goLogin").size()==0){
						$("#video").prepend(html);
					}
					$("#video img").on("click", function () {
						user.login({
							callback: function () {
								$("#a1").css("position", "static");
								$("#goLogin").remove();
								CKobject.getObjectById('CKa1').videoPlay();
								time = 50000000;
							},
							onLoginClose:function(){
                                g_sps.jump(null, "/pages/channel/video/video_index.html");
							},
							onAuthCancel:"back",     // 当点暂不认证时的处理、回退到来源页
							scene: privilegeSceneConst.eSceneTypeVideoPlay
						});
					});
				}
			}
		}
	}
}
//针对视频结束