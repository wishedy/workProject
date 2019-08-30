/**
 *fellow 报名页
 * 功能：1、是否登录注册
 * 		2、是否报过名whetherApply(),
 * 			2.1获取fellow最新一年的信息
 * 			2.2 所有资料加不可用状态，数据返回有值变为可用
 * 			2.3是否完善了信息，完善加状态
 * 			2.4必选项是否全部填写，按钮能否点击
 * 			2.5获取fellow往年的信息
 * 		3、项目名单，时间，状态获取
 * 		4、是否下载过推荐信模板
 * 		5 获取文件列表
 * 		6 文件上传，删除
 * 		7 折叠菜单
 * created by sunhaibin 2015-12-25	Merry Christmas
 * */
var recom=function(obj){
	var fellowship_Recom = {

		config: {
			customerId: $('#sesCustomerId').val(),
			fellowshipId:""
		},
		path: {
			getFileList:PC_CALL + 'customer/fellowship/attachment/json_list/', 		//获取文件列表接口
			getApply: 	PC_CALL + "customer/fellowship/base/update/", 					//提交申请
			getIfApply: PC_CALL + "customer/fellowship/base/json_list/",				//是否申请过接口
			fileUpload: PC_CALL + "customer/fellowship/attachment/create/",				//上传接口
			fileDelete: PC_CALL + "customer/fellowship/attachment/delete/",				//删除接口
			getSubConfigList:PC_CALL+"fellowship/config/getSubConfigList/",				//知情同意书弹层
			getPreLanList:PC_CALL+"customer/fellowship/attachment/getCustomerFellowshipAtt/"			//获取上一次语言证明能力列表
		},
		paramBase: {
			rec: {
				customerId: $('#sesCustomerId').val(),
				useFlag: 3
			},
			lang: {
				customerId: $('#sesCustomerId').val(),
				useFlag: 2
			},
			others: {
				customerId: $('#sesCustomerId').val(),
				useFlag: 4
			}
		},
		init: function(obj) {
			var t = this;
			t.dataId = "";
			t.applyId = "";
			this.options={};
            var o={};
            this.options= $.extend(o,obj);
			var layerCaptionTitle,
				layerTxtUContent,
				downLoadText;

			//t.whetherApply();			
			//	模板上传按钮点击		
			$(document).on('click', '.fel_rec_upload', function(e) {
				t.fellowshipId=$(this).parents(".Ev-ApplyInfoShowOrHide").attr("data-fId");
				t.par=$(this).parents(".fs_rereq");
				t.whetherGetTemplate();
				var xtVisible=$(this).parents(".fs_rereq").find(".xuantian").is(":visible");//选填可见
				if(xtVisible){
					layerCaptionTitle=$(this).parents(".fs_rereq").find(".fs_font_s").text();
				}else{
					layerCaptionTitle=$(this).parents(".fs_rereq").find(".Ev-ClickTitleContent").text();
				}

				layerTxtUContent=$(this).parents(".fs_rereq").find(".rer_d").text();
				downLoadText=$(this).parents(".fs_rereq").find("#mod_download").text();
				var html4 = t.template4(layerCaptionTitle,layerTxtUContent,downLoadText);
				if ($('body').children('.lightbox-container').length > 0) {
					return;
				} else {
					$('body').append(html4); //加载遮罩及推荐信弹层
					comm.setCenter($('.FEL_REC'));
				}
				t.fileList($.extend(t.paramBase.rec,{fellowshipId: t.fellowshipId}));
				t.uploadRecommend({
					id: '#fellow_rec_upload',
					useFlag: 3,
					param: $.extend(t.paramBase.rec,{fellowshipId: t.fellowshipId})
				});
				if ($.cookie('download_fel_rec') != '1') {
					//没下载过模板，上传按钮样式&&不能点击
					$('#fellow_rec_upload').parents('#fel_tjx').addClass('gray');
					$(document).on('click', '#fellow_rec_upload', function(e) {
						if($('#fel_tjx').hasClass('gray')){
							return false;
						}
					})
				}

			});
			$(document).on('click', '#mod_download', function(e) {
				$.cookie('download_fel_rec', '1', {	expires: 365});				
			});
			//语言能力证明
			$(document).on('click', '.lang_abl_upload', function(e) {
				t.fellowshipId=$(this).parents(".Ev-ApplyInfoShowOrHide").attr("data-fId");
				t.par=$(this).parents(".fs_rereq");
				var xtVisible=$(this).parents(".fs_rereq").find(".xuantian").is(":visible");//选填可见
				if(xtVisible){
					layerCaptionTitle=$(this).parents(".fs_rereq").find(".fs_font_s").text();
				}else{
					layerCaptionTitle=$(this).parents(".fs_rereq").find(".Ev-ClickTitleContent").text();
				}
				layerTxtUContent=$(this).parents(".fs_rereq").find(".rer_d").text();

				var html_l = t.template5(layerCaptionTitle,layerTxtUContent);
				if ($('body').children('.lightbox-container').length > 0) {
					return;
				} else {
					$('body').append(html_l); //加载遮罩及推荐信弹层
					comm.setCenter($('.FEL_LANG'));
				}
				t.fileList($.extend(t.paramBase.lang,{fellowshipId: t.fellowshipId}));

				t.uploadRecommend({
					id: '#lang_ability_upload',
					useFlag: 2,
					param:$.extend(t.paramBase.lang,{fellowshipId: t.fellowshipId})
				});

			});
			//其他证明材料
			$(document).on('click', '.other_mat_upload', function(e) {
				t.fellowshipId=$(this).parents(".Ev-ApplyInfoShowOrHide").attr("data-fId");
				t.par=$(this).parents(".fs_rereq");
				var xtVisible=$(this).parents(".fs_rereq").find(".xuantian").is(":visible");//选填可见
				if(xtVisible){
					layerCaptionTitle=$(this).parents(".fs_rereq").find(".fs_font_s").text();
				}else{
					layerCaptionTitle=$(this).parents(".fs_rereq").find(".Ev-ClickTitleContent").text();
				}
				layerTxtUContent=$(this).parents(".fs_rereq").find(".rer_d").text();
				var html_o = t.template6(layerCaptionTitle,layerTxtUContent);
				if ($('body').children('.lightbox-container').length > 0) {
					return;
				} else {
					$('body').append(html_o); //加载遮罩及推荐信弹层
					comm.setCenter($('.FEL_OTHERS'));
				}
				t.fileList($.extend(t.paramBase.others,{fellowshipId: t.fellowshipId}));
				t.uploadRecommend({
					id: '#other_material_upload',
					useFlag: 4,
					param: $.extend(t.paramBase.others,{fellowshipId: t.fellowshipId})
				});

			});

			//弹层关闭点击事件
			$(document).on('click', '.layer_close_rec', function() {
				//如果是删除文件弹层上X,则只关闭该弹层，否则关闭全部弹层及遮罩
				
				if ($(this).attr('id') == 'deleteFile_btn') {
					$(this).parents('.lightbox-container').remove();
				} else if($(this).parents('.lightbox-container').parent('body').length<=0){
					$(this).parents('.lightbox-container').parent().hide();
					t.options.callback&&t.options.callback();
				}else{
					if($(this).parents('.lightbox-container').find('.layerFileList').length===0){
						t.par.removeClass("sub_blue").find(".fs_duig").remove();
					}else{
						if($(t.par).find("a.fel_rec_upload").length){//推荐信
							if($(".layerFileList ul li").length>=$(t.par).find(".fel_rec_upload").attr("data-recomnum")){
								t.par.addClass("sub_blue").append("<div class='fs_duig'></div>");
							}else{
								t.par.removeClass("sub_blue").find(".fs_duig").remove();
							}
						}else if($(t.par).find("a.lang_abl_upload").length){//语言能力
							if($(".layerFileList ul li").length>=$(t.par).find(".lang_abl_upload").attr("data-engnum")){
								t.par.addClass("sub_blue").append("<div class='fs_duig'></div>");
							}else{
								t.par.removeClass("sub_blue").find(".fs_duig").remove();
							}
						}else if($(t.par).find("a.other_mat_upload").length){//其他能力
							if($(".layerFileList ul li").length>=$(t.par).find(".other_mat_upload").attr("data-othernum")){
								t.par.addClass("sub_blue").append("<div class='fs_duig'></div>");
							}else{
								t.par.removeClass("sub_blue").find(".fs_duig").remove();
							}
						}else{
							t.par.addClass("sub_blue").append("<div class='fs_duig'></div>");
						}
					}
					$('body').children('.lightbox-container').remove();
					$('body').children('#lightbox').remove();
					t.options.callback&&t.options.callback();
				}

				//事件埋点
				comm.creatEvent({
					triggerType:"全站功能按钮点击",
					keyword:"fellowship报名信息关闭",
					actionId:43
				});
			});
			//删除已上传文件
			$(document).on('click', '.fileDel', function() {
				t.deleteFile_template();
				t.dataId = $(this).parents('li').find('dt').attr('dataid');
				
			});
			//确定删除
			$(document).on('click', '.fel_rec_del_btn', function() {
				var data_del_param = "",
					m;
				var dataId = t.dataId;
				var PClass = ($(this).parents('.lightbox-container').siblings('.lightbox-container').attr('class')).replace(/lightbox-container lightBox_p /, "");
				switch (PClass) {
					case 'FEL_REC':
						data_del_param = t.paramBase.rec;
						m = 3;
						break;
					case 'FEL_LANG':
						data_del_param = t.paramBase.lang;
						m = 4;
						break;
					case 'FEL_OTHERS':
						data_del_param = t.paramBase.others;
						m = 5;
						break;
				}
				t.ajaxFn({
					url: t.path.fileDelete,
					param: {
						paramJson: $.toJSON({
							id: dataId
						})
					},
					fn: function() {
						t.fileList(data_del_param);
					}
				});
				
				$(this).parents('.lightbox-container').remove();
				
			});
			//取消删除
			$(document).on('click', '.layerBtn .cancel', function() {
				$(this).parents('.lightbox-container').remove();
			});
			//推荐文件滑过效果
			$(document).on('mouseover', '.layerFileList li', function() {
				$(this).addClass('active').siblings('li').removeClass('active');
			}).on('mouseout', '.layerFileList li', function() {
				$(this).removeClass('active');
			});

			t.mouseHover();
		},
		//带入上一次的语言证明能力列表
		preLangList:function(){
			var listContent = '';
			var t=this;
			t.ajaxFn({
				url: t.path.getPreLanList,
				param: {
					paramJson: $.toJSON({
						customerId: t.config.customerId,
						fellowshipAttType:2
					})
				},
				async:false,
				fn:function(data){
					if(data.responseObject&&data.responseObject.fellowAttList.length){

						var items=data.responseObject.fellowAttList;
						$.each(items,function(i,e){
							var format = "",
								attFormat = "",
								attName = e.fellowshipAttName;
							attFormat = (e.fellowshipAttFormat).toLowerCase();
							switch (attFormat) {
								case "doc":
								case "docx":
									format = 'Word';
									break;
								case "png":
								case "jpeg":
								case "jpg":
								case "bmp":
								case "gif":
									format = 'Pic';
									break;
								case "pdf":
									format = "Pdf";
									break;
							}
							var dotIndex = attName.lastIndexOf('.');
							var fel_attName = comm.getStrLen(attName.substring(0, dotIndex), 22);
							listContent += '<li>' +
								'<dl class="layer' + format + '">' +
								'<dt dataId="' + e.id + '">' + fel_attName + '</dt>' +
								'<dd>上传时间：' + e.createTime.substring(0, 10) + '</dd>' +
								'</dl>' +
								'<div class="fileDel"></div>'+
								'<a class="elasticLaye hide"'+(format!='Word'?'target="_blank"':'')+' href="'+ e.fellowshipAttUrl+'">'+(format!='Word'?'点击预览':'下载预览')+'</a>'+
								'</li>';
						});
					}
				}
			});
			return listContent;
		},

		ajaxFn: function(opt) {
			comm.LightBox.showloading();
			$.ajax({
				url: opt.url,
				data: opt.param,
				type: "post",
				dataType: 'json',
				async:opt.async!=undefined?opt.async:true,
				success: function(data) {
					comm.LightBox.hideloading();
					if (data) {
						opt.fn(data);
					}
				},
				error: function() {},
				beforeSend: function() {
					if (opt.fn_bf_send) {
						opt.fn_bf_send();
					}
				}
			})
		},
		//是否下载过模板
		whetherGetTemplate: function() {
			$(document).on('click', '#fel_rec_model_download', function() {
				$.cookie('download_fel_rec', '1', {
					expires: 365
				});
				$('#fellow_rec_upload').parents('#fel_tjx').removeClass('gray');
				
			});
		},
		//	推荐信模板
		template4: function(title,text,dtext) {
//			top:10px; left:50%;margin-left:-356.5px;
			var html = '<div id="lightbox"></div>' +
				'<div class="lightbox-container lightBox_p FEL_REC" style="z-index: 10; position: absolute; ">' +
				'<div class="layer_fellow">' +
				'<div class="layer_fellow_t layerLarger">' +// clear
				'<div class="layerCaption">'+title+'</div>' +
				'<a href="javascript:;" class="close">' +
				'<div class="layer_close layer_close_rec"></div>' +
				'</a>' +
				'</div>' +
				'<div class="layer_fellow_c">' +
				'<div class="layerTxtU">'+(text?text+"。":"")+'<a href="'+$('#mod_download').attr('href')+'" id="fel_rec_model_download">'+dtext+'</a></div>' +
				'<div class="layerBtnU layerBtnC"><a href="javascript:;" class="" id="fel_tjx">立即上传' +
				'<span class="layer_close_rec Ev-CompleteBtn" style="display: none;">完成</span>' +
				'<input type="file" id="fellow_rec_upload" name="uploadify"/></a></div>' +
				'</div>' +
				'</div>' +
				'</div>';
			return html;
		},
		//		语言能力证明模板
		template5: function(title,text) {
			var html5 = '<div id="lightbox"></div>' +
				'<div class="lightbox-container lightBox_p FEL_LANG" style="z-index: 10; position: absolute;">' +
				'<div class="layer_fellow">' +
				'<div class="layer_fellow_t layerLarger">' +// clear
				'<div class="layerCaption">'+title+'</div>' +
				'<a href="javascript:;" class="close">' +
				'<div class="layer_close layer_close_rec"></div>' +
				'</a>' +
				'<div class="clear"></div>' +
				'</div>' +
				'<div class="layer_fellow_c">' +
				'<div class="layerTxtU layerTxtL">'+(text?text+"。":"")+'</div>' +
				'<div class="layerBtnU layerBtnC"><a href="javascript:;" >立即上传<span class="layer_close_rec Ev-CompleteBtn" style="display: none;">完成</span><input type="file" id="lang_ability_upload" name="uploadify"/></a></div>' +
				'</div>' +
				'</div>' +
				'</div>';
			return html5;
		},
		//		其他证明模板
		template6: function(title,text) {
			var html6 = '<div id="lightbox"></div>' +
				'<div class="lightbox-container lightBox_p FEL_OTHERS" style="z-index: 10; position: absolute;">' +
				'<div class="layer_fellow">' +
				'<div class="layer_fellow_t layerLarger">' +	// clear
				'<div class="layerCaption">'+title+'</div>' +
				'<a href="javascript:;" class="close">' +
				'<div class="layer_close layer_close_rec"></div>' +
				'</a>' +
				'</div>' +
				'<div class="layer_fellow_c">' +
				'<div class="layerTxtU">'+(text?text+"。":"")+'</div>' +
				'<div class="layerBtnU layerBtnC"><a href="javascript:;" >立即上传<span class="layer_close_rec Ev-CompleteBtn" style="display: none;">完成</span><input type="file" id="other_material_upload" name="uploadify"/></a></div>' +
				'</div>' +
				'</div>' +
				'</div>';
			return html6;
		},
		//获取上传文件列表
		fileList: function(opt) {
			var t = this;
			t.ajaxFn({
				url: t.path.getFileList,
				param: {
					paramJson: $.toJSON(opt)
				},
				fn: function(data) {
					if (data) {
						t.fileListTemplate(data);
						comm.setCenter($('.lightBox_p'));
					}
				}
			});
		},
		fileListTemplate: function(data) {
			var listContent = '';
			var t = this;

			var prevLis= "";
			if($(t.par).find('a.lang_abl_upload').length){prevLis= t.preLangList();}

			if (data.responseObject.responseData&&data.responseObject.responseData.data_list && data.responseObject.responseData.data_list.length > 0) {
				for (var j = 0, l = data.responseObject.responseData.data_list.length; j < l; j++) {
					var item = data.responseObject.responseData.data_list[j],
						format = "",
						attFormat = "",
						attName = item.customer_fellowship_attachment.fellowshipAttName;
					attFormat = (item.customer_fellowship_attachment.fellowshipAttFormat).toLowerCase();
					switch (attFormat) {
						case "doc":
						case "docx":
							format = 'Word';
							break;
						case "png":
						case "jpeg":
						case "jpg":
						case "bmp":
						case "gif":
							format = 'Pic';
							break;
						case "pdf":
							format = "Pdf";
							break;
					}
					var dotIndex = attName.lastIndexOf('.');
					var fel_attName = comm.getStrLen(attName.substring(0, dotIndex), 22);
					listContent += '<li>' +
						'<dl class="layer' + format + '">' +
						'<dt dataId="' + item.customer_fellowship_attachment.id + '">' + fel_attName + '</dt>' +
						'<dd>上传时间：' + item.customer_fellowship_attachment.createTime.substring(0, 10) + '</dd>' +
						'</dl>' +
						'<div class="fileDel"></div>'+
						'<a href="'+item.customer_fellowship_attachment.attUrl+'"'+(format!='Word'?'target="_blank"':'')+' class="elasticLaye hide">'+(format!='Word'?'点击预览':'下载预览')+'</a>'+
						'</li>';
				}
				var html2 = '<div class="layerFileList">' +
					'<ul class="">' +
					prevLis+ listContent+//li 列表
					'<div class="clear"></div>' +
					'</ul>' +
					'</div>';
				if ($('.layerFileList').length > 0) {

					$('.layerFileList').remove();
					$(".lightBox_p .layer_fellow_c").prepend(html2);
				} else {
					$(".lightBox_p .layer_fellow_c").prepend(html2);
				}

				if (listContent != "") {
					$('.layerTxtU').addClass('layerTxtC');
					$('.layerBtnU').addClass('layerBtnC');
					if ($('.layerTxtU').hasClass('layerTxtL')) {
						$('.layerTxtU').removeClass('layerTxtL').addClass('layerTxtLC');
					}
					$(".Ev-CompleteBtn").show();
				}else{
					$(".Ev-CompleteBtn").hide();
				}
			} else if(prevLis!=""){
				var html3 = '<div class="layerFileList">' +
					'<ul class="">' +
					prevLis+ //li 列表
					'<div class="clear"></div>' +
					'</ul>' +
					'</div>';
				if ($('.layerFileList').length > 0) {
					//$('.layerFileList ul').append(prevLis);
					$('.layerFileList').remove();
					$(".lightBox_p .layer_fellow_c").prepend(html3);
				} else {
					$(".lightBox_p .layer_fellow_c").prepend(html3);
				}
					$(".Ev-CompleteBtn").show();
			}else {
				if ($('.layerFileList').length > 0) {
					$('.layerFileList').remove();
					$('.layerTxtU').removeClass('layerTxtC');
					$('.layerBtnU').removeClass('layerBtnC');
					if ($('.layerTxtU').hasClass('layerTxtLC')) {
						$('.layerTxtU').removeClass('layerTxtLC').addClass('layerTxtL');

					}
					if($(".Ev-CompleteBtn").length){
						$(".Ev-CompleteBtn").show();
					}
				}
				if($(".Ev-CompleteBtn").length){
					$(".Ev-CompleteBtn").hide();
				}
			}
			t.mouseHover();
		},
		//鼠标悬停和移除的遮罩点击
		mouseHover:function(){
			$(".layerFileList li").mouseover(function(){
				$(this).find(".elasticLaye").show();
			}).mouseout(function(){
				$(this).find(".elasticLaye").hide();
			});
		},
		//上传
		uploadRecommend: function(opts) {
			document.domain =location.hostname;
			var t = this,
				documentType = /\.((doc)|(docx)|(pdf)|(jpg)|(jpeg))$/i,
				alertContent="只允许上传.doc .docx .pdf .jpg .jpeg类型的文件",
				cSs = {
					width: 220,
					height: 56,
					position: "absolute",
					top: 0,
					left: 0,
					background:""
				};
			switch(opts.useFlag){
				case 3:
				documentType = /\.((doc)|(docx)|(pdf))$/i;
				alertContent="只允许上传.doc .docx .pdf类型的文件";
				break;
				default:
				documentType = /\.((doc)|(docx)|(pdf)|(jpg)|(jpeg))$/i;
			}
			czyx.uploadReplace(opts.id, {
				url: t.path.fileUpload,
				data: {
					customerId: $('#sesCustomerId').val(),
					useFlag: opts.useFlag,
					fellowshipId: t.fellowshipId,
					uploadifyFileName: "",
					uploadify: ""
				},
				uploadReplaceCss: cSs,
				uploadInputCss: cSs,
				uploadBefore: function(e) {
					if (this.value&&!documentType.test(this.value)) {
						$(opts.id).val("");
						alert(alertContent);
						return false;
					}
					var fileSize = comm.file.getFileSize($('#fellow_rec_upload')[0]);
					if (fileSize > 10485760) {
						$(opts.id).val("");
						alert('文件不能大于' + 10485760 / 1048576 + "M");
						return false;
					}
				},
				uploadEnd: function(serverStr) {
					t.fileList(opts.param);
					$(opts.id).val("");
				}
			});

		},
		//		删除已上传文件模板
		deleteFile_template: function() {
			var html = '<div class="lightbox-container" style="z-index: 11; position: fixed; top:30%; left:50%;margin-left:-226px;">' +
				'<div class="layer_fellow">' +
				'<div class="layer_fellow_t">' +
				'<div class="tip">确认提示</div>' +
				'<a href="javascript:;" class="close">' +
				'<div class="layer_close layer_close_rec" id="deleteFile_btn"></div>' +
				'</a>' +
				'</div>' +
				'<div class="layer_fellow_c delTip">' +
				'<div class="layerTxt">确认要删除该文件吗？</div>' +
				'<div class="layerBtn"><a href="javascript:;" class="fel_rec_del_btn">删 除</a><a href="javascript:;" class="gray cancel">不删除</a></div>' +
				'</div>' +
				'</div>' +
				'</div>';
			$('body').append(html);
		}
		
	};
    
    fellowship_Recom.init(obj);
};