//3.0回复框
module.reviewBox= function(options){

	var opts= {
		scene: null, //terminal
		context: null, //追加回复位置
		reviewId: 0, //回复id用于充当父级id时使用
		reviewUsername: '', //回复列表中，当前人的名字
		refId: 0,//资源id
		type: 0, //资源类型
		uploadKey: new Date().getTime(), //上传id新值
		callback:null       // 评论成功回调
	};
	opts.url= PC_CALL+'review/createReview/';

	opts.ajaxParams= {

	}

	$.extend(opts, options);

	if(opts.context.length ===0 ){console.log('找不到元素'); return false;};

	//备份资源区
	var cidArr = []; //被提醒人id
	var resourceIdArr= []; //引用资源
    //comm.ieAlert("",'继续上传照片和视频');
	var ctrl= {
		init: function(){
			var _this= this;
			_this.render();
		},
		render: function(){
			var _this= this;
			if(opts.scene ==null){
				opts.context.append(mainTemplate(opts));
				opts.context.find('textarea').focus();

			}else{//用于终端页下拉回复
				opts.context.append(terminalTemplate());
				var logoUrl= '';
				var data={};
				var params={};
				data.customerId=$("#sesCustomerId").val();
				params.paramJson= $.toJSON(data);
				$.ajax({
					url:PC_CALL+'customer/unite/getMapById/',
					data:params,
					type:'post',
					dataType:'json',
					success:function(data){
						if(data&&data.responseObject.responseData&&data.responseObject.responseData.data_list&&data.responseObject.responseData.data_list.length>0) {
							logoUrl = data.responseObject.responseData.data_list[0].customer_att.logoUrl;
						}else{
							logoUrl= "//img10.allinmd.cn/v3/common/icon/comment_user.png";
						}
						$('.al-userCommentImg img').attr('src',logoUrl);
					}
				});
				opts.context.find('textarea').on('click', function(){
					$(this).css('height','90px');
					$(".ev-reviewOper").show();

				});
			}
			$('.evReviewBoxSubmit').removeClass("fb_but-ok").addClass("fb_but");
			_this.event.cancel();
			_this.event.save();
			_this.outsideHandle();
		},
		outsideHandle: function(){
			//添加图片与视频
			$(".Ev-addPicVideo", opts.context).addRemoveablePic({
				container: $(".evUploadVideoAndPic", opts.context),
				limit: 4,
				qiniuUploaderId: "#uploadVideoBtn_"+opts.uploadKey,
				html: '<figure><i class="al-commentBtnImg al-commentPic"></i>图片</figure>',
				onSizeChange: function (isExist) {
						console.log(isExist)
					picCb(isExist);
				}
			});

			//提醒谁看
			$(".al-commentBox", opts.context).replyRemind({
				callback: function () {
					remindCb($(".al-commentBox", opts.context).find(".remind_name span"));
				}
			});

			//资源引用
			$(".al-commentBox", opts.context).referenceResource({
				customerId:"1399252409974",      //TODO
				callback:function(){
					resourceCb($(".al-commentBox", opts.context).find(".Ev-resourceName span"));
				}
			});

			//取出引用资源id
			function resourceCb(arr) {
				resourceIdArr = [];
				$.each(arr, function (i, el) {
					resourceIdArr.push($(el).attr("resourceid"));
				});
				updateParams();
			}

			//取出被提醒人id
			function remindCb(arr) {
				cidArr = [];
				$.each(arr, function (i, el) {
					cidArr.push($(el).attr("customerid"));
				});
				updateParams();
			}

			//记录pic与content是否有值
			var pic = false, content = false;

			//图片上传后触发发布按钮更新状态
			function picCb(isExist) {
				pic = isExist;

                // TODO:2018年5月22日 删除已经上传的input框
                //获取上传所有的图片标签，过滤掉视频默认图start
                if(comm.browser.isIe8()||comm.browser.isIe9()){

				}else{
                    var newArr = $('.reviewBoxForm .add_photo .add_photo_img input');
                    newArr.remove();
				}

				//end

				submitToggle();
				updateParams();
			}

			function quoteUpdate(arr){ //取出引用资源id更新
				$.each(arr, function (i, el) {
					resourceIdArr.push($(el).attr("resourceid"));
				});
				updateParams();
			}

			//文本域触发切换发布
			$('.evReviewBoxForm',opts.context).bind("input", function () {
				content = $(this).val();
				submitToggle();
				updateParams();
			}).bind("propertychange", function () { //兼容IE
				content = $(this).val();
				submitToggle();
				updateParams();
			});

			//切换发布
			function submitToggle() {
				if (pic || content) $('.evReviewBoxSubmit').removeClass("fb_but").addClass("fb_but-ok");
					else $('.evReviewBoxSubmit').removeClass("fb_but-ok").addClass("fb_but");
			}

			function updateParams(){ //更新form参数
				var isUploadAttachment = 0, attachmentIds = "";
				if (typeof FileReader != 'undefined') {  // 本地可预览模式
					isUploadAttachment = 1;
				}

				attachmentIds = $(".imgPkList", opts.context).val(); //图片Id集
				pvideoIds = $(".pvideoIds", opts.context).val();  // 视频Id集

				//重新拼下名字
				var reviewContent= $('.evReviewBoxForm', opts.context).val();
				var remindArr= $(".al-commentBox", opts.context).find(".remind_name span");
				for(var s=0;s<remindArr.length;s++){
					reviewContent += '<a href="'+$(remindArr[s]).attr("customerid")+'">'+$(remindArr[s]).text()+'</a>';
				}

				var parentId= opts.context.find('[data-reviewid]').attr('data-reviewid');
				var data={};
				data.reviewType=opts.type;
				data.refId=opts.refId;
				data.isValid=1;
				if(parentId){
					data.parentId=parentId;
				}
				data.reviewContent=reviewContent;
				data.imageType=5;
				data.refCustomerIdList=cidArr.toString();
				data.isUploadAttachment=isUploadAttachment;
				data.attachmentIds=attachmentIds;
				data.quoteIds=resourceIdArr.join(",").replace('>','');
				data.pvideoIds=pvideoIds;
				data.quoteType=$(".Ev-resourceName>span",opts.context).attr("quotetypeid");
				data.quoteName=$(".Ev-resourceName>span",opts.context).text();
				$('.evReviewBoxParams', opts.context).val("" +JSON.stringify(data));
			}

		},
        imgSizeFn: function (w, h) { //图片压缩后宽高
            if (w <= 1280 && h <= 1280) {
                return {w: w, h: h};
            } else if (w / h <= 2 && (w > 1280 || h > 1280)) {
                //opt.ratio = 1;
                if (w > h) {
                    return {w: 1280, h: parseInt(h / w * 1280)};
                } else {
                    return {w: parseInt(w / h * 1280), h: 1280};
                }

            } else if (w / h > 2) {
                if (w > 1280 && h > 1280) {
                    //opt.ratio = 1;
                    if (w > h) { //压缩规则第4条，宽高都大于1280时，取较小值为1280，经多次测试数据过大造成浏览器卡死崩溃，故更改为取较大值为1280，小值等比压缩
                        if(h/w*1280>500){   //如果h较小，但长度大于500，按宽1280等比压缩   （小值按1280算，ajax上传时报413 Request Entity Too Large）
                            return {w: 1280, h: parseInt(h / w * 1280)};
                        }else{//如果h小于500，按H500等比压缩
                            return {w: w*500/h, h: 500};
                        }
                    } else {
                        if(w/h*1280>500){   //如果h较小，但长度大于500，按宽1280等比压缩
                            return {w: parseInt(w / h * 1280), h: 1280};
                        }else{//如果h小于500，按H500等比压缩
                            return {w: 500, h: h*500/w};
                        }
                    }
                } else {
                    //opt.ratio = 1;
                    return {w: w, h: h};
                }
            }
        },
        canvasDataURL:function(path, dataCallBack){
			var t = this;
            var img = new Image();
            img.src = path;
            img.onload = function(){
                var that = this;
                // 默认按比例压缩
                var w = that.width;
                var   h = that.height;
                //scale = w / h;
                //w = obj.width || w;
                //h = obj.height || (w / scale);
                var quality = 0.7;  // 默认图片质量为0.7
                //生成canvas
                var canvas = document.createElement('canvas');
                var ctx = canvas.getContext('2d');
                // 创建属性节点
                var compressRect = t.imgSizeFn(w, h);
                canvas.width = compressRect.w;
                canvas.height = compressRect.h;
                ctx.drawImage(that, 0, 0, compressRect.w, compressRect.h);
                // 图像质量
                // quality值越小，所绘制出的图像越模糊
                var base64 = canvas.toDataURL('image/jpeg',.7);
                // 回调函数返回base64的值
                dataCallBack&&dataCallBack(base64);

                return base64;
            }
        },
		event: {
			cancel: function(){
				//取消发布
				$('.evReviewBoxCancel', opts.context).on("click", function () {
					//$('.reviewBoxForm', opts.context).remove(); 
					$('.reviewBoxForm', opts.context).hide();
					if(opts.scene=='terminal'){
						$('.reviewBoxForm', opts.context).remove();
						module.reviewBox({
							scene: 'terminal',
							context: $('.ev-detailReviewForm'),
							refId: opts.refId,
							type: opts.type
						});
					}
					//事件埋点
					comm.creatEvent({
						triggerType:"全站功能按钮点击",
						keyword:"回复框取消",
						actionId:45,
						refType: opts.type,
						refId: opts.refId
					});
					return false;
				});
			},
			save: function(){
				var t = this;
				$('.evReviewBoxSubmit', opts.context).on("click", function () {
					var _this = this;
					user.login({
						callback: function () {
							if ($(_this).attr("class").indexOf("fb_but-ok") > -1) {
								//处理视频正在上传中的状态
			                	if($(".ev-processTips", opts.context).text() === "视频正在处理中..."){
			                		alert("上传视频正在处理中，请等待上传完成后再进行发布操作！")
			                		return false;
			                	};

								//提交后禁止再次提交
								$('.evReviewBoxSubmit', opts.context).removeClass("fb_but-ok").addClass("fb_but");


                                // TODO:添加压缩图片的逻辑
								//start
                                if(comm.browser.isIe8()||comm.browser.isIe9()){
                                    var options = {
                                        url: opts.url,
                                        contentType: "multipart/form-data",
                                        dataType: "text",
                                        success: function (result) {

                                            //IE时
                                            if (navigator.userAgent.indexOf("MSIE") >-1) {
                                                $.topTip({mark: "success", content: "发布成功！"});
                                                //初始化
                                                $('.reviewBoxForm', opts.context).remove();
                                                //opts.callback&&opts.callback();
                                                //ctrl.render();
                                                //window.location.href= location.href+'#reviewArea';
                                                ctrl.init(opts);
                                                $('.ev-list').empty();
                                                $('.ev_bookCommentCount').html(parseInt($('.ev_bookCommentCount').html()) + 1);
                                                module.reviewPage({
                                                    sortType: $(".al-oldNews").data("sortType"),
                                                    $context: $('.ev-list'),
                                                    scene: 'terminal',
                                                    refType: $("#resourceType").val(),
                                                    refId: $("#resourceId").val()
                                                });
                                                window.location.reload();
//											//回应列表
//											module.replyList({
//												target: ".detail_replys", //瀑布流加载位置
//												hint: ".reply-list-hint", //提示位置
//												refId: opts.refId,
//												authId: $('.Ev-cAuthName').attr('href').split('cid=')[1]?$('.Ev-cAuthName').attr('href').split('cid=')[1]:"",//作者ID
//												type: opts.type,
//												cid: opts.cid,
//												refresh: false, //刷新
//												callback: function () {
//													$(".evReviewBoxForm").click();
//													$(".evReviewBoxForm").focus();
//												}
//											});
                                                return false;
                                            }else {

                                                var result = $.parseJSON(result);
                                                if (result.responseObject.responseStatus) {
                                                    resourceIdArr=[];
                                                    $.topTip({mark: "success", content: "发布成功！"});
                                                    //初始化
                                                    $('.reviewBoxForm', opts.context).remove();
                                                    //window.location.href= location.href+'#reviewArea';

                                                    // TODO:刷新回复列表

                                                    if (window.location.href.match(/\/html\//g)) {//终端页
                                                        ctrl.init();
                                                        $('.ev-list').empty();
                                                        $('.ev_bookCommentCount').html(parseInt($('.ev_bookCommentCount').html()) + 1);
                                                        module.reviewPage({
                                                            sortType: $(".al-oldNews").data("sortType"),
                                                            $context: $('.ev-list'),
                                                            scene: 'terminal',
                                                            refType: $("#resourceType").val(),
                                                            refId: $("#resourceId").val()
                                                        });
                                                    } else if (window.location.href.match(/others_index/g)) {//如果是在他人动态评论，不做操作

                                                    } else {
                                                        /*if(opts.callback){
                                                         opts.callback();
                                                         }else{*/
                                                        window.location.reload();
                                                        /*}*/
                                                    }

                                                    //ctrl.render();
                                                } else {
                                                    $.topTip({mark: "warn", content: "发布失败，请稍后再试！"});
                                                }
                                            }
                                        }
                                    };
                                    $('.reviewBoxForm', opts.context).ajaxSubmit(options);
								}else{
                                    function convertBase64UrlToBlob(urlData){
                                        var arr = urlData.split(','), mime = arr[0].match(/:(.*?);/)[1],
                                            bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
                                        while(n--){
                                            u8arr[n] = bstr.charCodeAt(n);
                                        }
                                        return new Blob([u8arr], {type:mime});
                                    }

                                    var form = $(_this).parents('.reviewBoxForm')[0];
                                    var formdata = new FormData(form);

                                    //获取上传所有的图片标签，过滤掉视频默认图
                                    var newArr = $(_this).parents('.reviewBoxForm').find('.add_photo li img');
                                    function getAllImage(){
                                        $.each(newArr,function(index,value){
                                            if($(value).attr('src').indexOf('data:')==0){
                                                var re = $(value).attr('src');
                                                ctrl.canvasDataURL(re,function(baseData){
                                                    $(value).attr('data-sence',1);
                                                    formdata.append("file", convertBase64UrlToBlob(baseData), "file_"+'photo'+[index]+".jpg"); // 文件对象
                                                });
                                            }else{
                                                $(value).attr('data-sence',2);
                                            }
                                        });
                                    }
                                    getAllImage();

                                    function request(){
                                        clearInterval(clear);
                                        $.ajax({
                                            type: "POST",
                                            url: opts.url,
                                            data: formdata,
                                            cache: false,
                                            processData: false,
                                            contentType: false,
                                            beforeSend:function(){},
                                            complete:function(){},
                                            success: function (result) {
                                                //IE时
                                                if (navigator.userAgent.indexOf("MSIE") >-1) {
                                                    $.topTip({mark: "success", content: "发布成功！"});
                                                    //初始化
                                                    $('.reviewBoxForm', opts.context).remove();
                                                    //opts.callback&&opts.callback();
                                                    //ctrl.render();
                                                    //window.location.href= location.href+'#reviewArea';
                                                    ctrl.init(opts);
                                                    $('.ev-list').empty();
                                                    $('.ev_bookCommentCount').html(parseInt($('.ev_bookCommentCount').html()) + 1);
                                                    module.reviewPage({
                                                        sortType: $(".al-oldNews").data("sortType"),
                                                        $context: $('.ev-list'),
                                                        scene: 'terminal',
                                                        refType: $("#resourceType").val(),
                                                        refId: $("#resourceId").val()
                                                    });
                                                    //2018/5/24日
                                                    window.location.reload();
//											//回应列表
//											module.replyList({
//												target: ".detail_replys", //瀑布流加载位置
//												hint: ".reply-list-hint", //提示位置
//												refId: opts.refId,
//												authId: $('.Ev-cAuthName').attr('href').split('cid=')[1]?$('.Ev-cAuthName').attr('href').split('cid=')[1]:"",//作者ID
//												type: opts.type,
//												cid: opts.cid,
//												refresh: false, //刷新
//												callback: function () {
//													$(".evReviewBoxForm").click();
//													$(".evReviewBoxForm").focus();
//												}
//											});
                                                    return false;
                                                }else {

                                                    var result = $.parseJSON(result);
                                                    if (result.responseObject.responseStatus) {
                                                        resourceIdArr=[];
                                                        $.topTip({mark: "success", content: "发布成功！"});
                                                        //初始化
                                                        $('.reviewBoxForm', opts.context).remove();
                                                        //window.location.href= location.href+'#reviewArea';

                                                        // TODO:刷新回复列表

                                                        if (window.location.href.match(/\/html\//g)) {//终端页
                                                            ctrl.init();
                                                            $('.ev-list').empty();
                                                            $('.ev_bookCommentCount').html(parseInt($('.ev_bookCommentCount').html()) + 1);
                                                            module.reviewPage({
                                                                sortType: $(".al-oldNews").data("sortType"),
                                                                $context: $('.ev-list'),
                                                                scene: 'terminal',
                                                                refType: $("#resourceType").val(),
                                                                refId: $("#resourceId").val()
                                                            });
                                                        } else if (window.location.href.match(/others_index/g)) {//如果是在他人动态评论，不做操作

                                                        } else {
                                                            /*if(opts.callback){
                                                             opts.callback();
                                                             }else{*/
                                                            window.location.reload();
                                                            /*}*/
                                                        }

                                                        //ctrl.render();
                                                    } else {
                                                        $.topTip({mark: "warn", content: "发布失败，请稍后再试！"});
                                                    }
                                                }
                                            },
                                            error: function(data) {}
                                        });
                                    }

                                    var complete = $(_this).parents('.reviewBoxForm').find('.add_photo li img');
                                    var clear = setInterval(function(){
                                        if($("[data-sence=2]").length){
                                            if(complete.length-1===$("[data-sence=1]").length){
                                                request();
                                            }
                                        }else{
                                            if(complete.length===$("[data-sence=1]").length){
                                                request();
                                            }
                                        }
                                    },500);
								}

                                //结束

                                //以下方法已经注释start  true

								//end
							}
						},
						scene:privilegeSceneConst.eSceneTypeReview
					});
				});
			}
		}

	}

	ctrl.init();

	function terminalTemplate(){
		return '<form class=\"reviewBoxForm\" style="margin-left: 0px;margin-right: 0px;" method=\"post\" enctype=\"multipart/form-data\">'+
				'<section class="al-commentBox" style="background-color: #fff;">'+
					'<section style="position:relative;"><a href=javascript:; class="al-userCommentImg"><img src=""></a></section>'+
		        	'<section class="al-commentBoxInner" style="margin:10px 0 4px 0px;">'+
			            '<article class="al-commentTextAreaBox">'+
			                //'<textarea placeholder="回复@'+$(".Ev-cAuthName").text()+'" name="" id="disArea" class="al-commentTextarea evReviewBoxForm" style="border-bottom: 0px solid #dbdbdb;padding:8px;height: 35px;overflow-y: hidden;"></textarea>'+
			                '<textarea placeholder="写下你的评论......" name="" id="disArea" class="al-commentTextarea evReviewBoxForm" style="border-bottom: 0px solid #dbdbdb;padding:8px;height: 35px;"></textarea>'+
			                '<ul class="al-commentUploadImgList evUploadVideoAndPic" style="padding:0px;">'+
			                '</ul>'+
			                "<section class='re_content_text remind_text hide'></section>"+//提醒
			                "<section class='re_content_text peferRes_text hide'></section>"+//引用资源
			            '</article>'+
			            '<section class="al-commentBtnBox ev-reviewOper" style="display:none;">'+
			                '<ul class=\"btn_place\">'+
			                    '<li class="al-commentBtnItem Ev-addPicVideo">'+
			                        '<i class="al-commentBtnImg al-commentPic"></i>图片'+
			                    '</li>'+
			                    '<li class="al-commentBtnItem Ev-addVideo" id="uploadVideoBtn_'+opts.uploadKey+'">'+
			                        '<i class="al-commentBtnImg al-commentVideo"></i> 视频'+
			                    '</li>'+
			                '</ul>'+
			                '<section class="al-commentPush">'+
			                	'<input class=\"evReviewBoxParams\" type=\"hidden\" name=\"paramJson\" value="" />'+
			                    '<button class="al-commentCancel evReviewBoxCancel">取消</button>'+
			                    '<button class="al-commentCommit evReviewBoxSubmit">评论</button>'+
			                '</section>'+
			            '</section>'+
			        '</section>'+
			    '</section></form>';
	}

	function mainTemplate(opts){
		return '<form class=\"reviewBoxForm admin\" method=\"post\" enctype=\"multipart/form-data\">'+
		'<section class="al-commentBox" data-reviewid="'+opts.reviewId+'">'+
        	'<section class="al-commentBoxInner">'+
	            '<article class="al-commentTextAreaBox">'+
	                '<textarea placeholder="评论@'+opts.reviewUsername+'" name="" id="disArea" cols="30" rows="10" class="al-commentTextarea evReviewBoxForm"></textarea>'+
	                '<ul class="al-commentUploadImgList evUploadVideoAndPic" style="padding:0px;">'+
	                '</ul>'+
	                "<section class='re_content_text remind_text hide'></section>"+//提醒
	                "<section class='re_content_text peferRes_text hide'></section>"+//引用资源
	            '</article>'+
	            '<section class="al-commentBtnBox">'+
	                '<ul class=\"btn_place\">'+
	                    '<li class="al-commentBtnItem Ev-addPicVideo">'+
	                        '<i class="al-commentBtnImg al-commentPic"></i>图片'+
	                    '</li>'+
	                    '<li class="al-commentBtnItem Ev-addVideo" id="uploadVideoBtn_'+opts.uploadKey+'">'+
	                        '<i class="al-commentBtnImg al-commentVideo"></i> 视频'+
	                    '</li>'+
	                '</ul>'+
	                '<section class="al-commentPush">'+
	                	'<input class=\"evReviewBoxParams\" type=\"hidden\" name=\"paramJson\" value="" />'+
	                    '<button class="al-commentCancel evReviewBoxCancel">取消</button>'+
	                    '<button class="al-commentCommit evReviewBoxSubmit">评论</button>'+
	                '</section>'+
	            '</section>'+
	        '</section>'+
	    '</section></form>';
	}

};
