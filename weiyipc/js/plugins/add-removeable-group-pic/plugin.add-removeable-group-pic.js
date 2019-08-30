/**
 * 功能描述：点击添加图片，添加至某容器中，
 * 使用方法:  $("#xxx").addRemoveablePic({
 *             container:$("#yyy"),
 *             limit:4
 *          })
 * 注意事件： 依赖上传插件  js/plugin/uploadReplace.js
 * 引入来源：
 *
 * Created by LiuYuTao on 2015/2/28.
 */
$.fn.addRemoveablePic = function (obj) {
	var defaultOpts = {
		container: null,
		limitNumOfPhoto: 9,
		limitNumOfVideo: 1,
		maxFileSize: 10485760,
		html: "xxx",
		qiniuUploaderId:"#uploadVideoBtn_1",
		onSizeChange: null
	};
	var _DomObj = this;     // 当前元素
	var controller = {
		path: {
			upload: PC_CALL + "customer/fellowship/attachment/create/",   // 插入评论图片 上传地址      url:"/call/customer/fellowship/attachment/create/", //文件处理的URL

			//data:{customerId:t.customerId,fellowshipId:fellowshipid,useFlag:'2'},
			saveVideoInfo:"/call/qiniu/storage/saveVideoInfo/"
		},
		el: {},

		opts: null,
		listContainer: null,
		imgPkList: {},
		photoNumOfAvailable: null,
		videoNumOfAvailable: null,
		/**
		 *
		 */
		init: function () {
			var t = this;
			t.opts = $.extend(defaultOpts, obj);
			if (t.opts.container === null) {
				console.error("图片列表容器不能为空");
				return false;
			}

			t.insertContainer();
			
			// 绑定上传视频
			if(typeof Qiniu != "undefined"){
				t.bindUploadVideo(t.opts.qiniuUploaderId);
			}
			
			// 绑定上传图片按钮
			if (typeof FileReader != 'undefined') {  // 本地可预览模式
				t.bindDomObj();
				t.listContainer.find("#imgType").val("local");
			} else {
				t.bindRemoteUpload();
				t.listContainer.find("#imgType").val("remote");
			}

			t.photoNumOfAvailable = t.opts.limitNumOfPhoto;
			t.videoNumOfAvailable = t.opts.limitNumOfVideo;
		},
		template: {
			container: function (kv) {
				if(kv.limitNumOfPhoto===undefined) kv.limitNumOfPhoto = "初始化中...";
					else kv.limitNumOfPhoto = '还能添加' + kv.limitNumOfPhoto + '张';
				return '<div class="add_photo hide">' +
					'<div class="hn_add ev-processTips">'+kv.limitNumOfPhoto+'</div>' +
					'                <ul>' +
						// '                <li><div class="add_photo_img"><img src="//plugins.allinmd.cn/add-removeable-group-pic/images/sc_photo.png"><div class="c_close"><img src="//plugins.allinmd.cn/add-removeable-group-pic/images/c_close.png"></div></div></li>' +
					'                   <div class="clear"></div>' +
					'                 </ul>' +
					'<input type="hidden" id="imgType" />' +
					'<input type="hidden"  class="imgPkList" />  ' +
					'<input type="hidden"  class="pvideoIds" />  ' +
					'   </div>';
			}
		},
		/**
		 * 在规定的父容器中插入 要放置图片列表的 子级容器
		 */
		insertContainer: function () {
			var t = this;
			$(defaultOpts.container).append(t.template.container({limit: defaultOpts.limitNumOfPhoto}));
			t.listContainer = $(defaultOpts.container).find(".add_photo");
			t.listContainer.bind(".c_close", "click", function () {   // 关闭按钮
				t.removeItem(this);
				return;
			});
		},
		/**
		 * 绑定上传图片按钮 点击上传
		 */
		bindDomObj: function () {
			var t = this;
			_DomObj.html("<input type='file' name='file' /> ");

			var input = _DomObj.find("input[name=file]:last");
			input.replaceInput({
				html: t.opts.html,      // 替换后的DOM代码
				uploadReplaceCss: {//上传控件默认样式
					width: 50,
					height: 30,
					overflow: 'hidden',
					position: 'relative',
					fontSize: 12
				},
				uploadInputCss: {
					cursor: 'pointer',
					filter: 'alpha(opacity=0)',
					opacity: 0,
					outline: 'none',
					width: 50,
					height: 30,
					fontSize: 12,
					hideFocus: 'expression(this.hideFocus=true)'
				},
				onChangeHdl: function () {       	   // 选中文件后
					if (t.photoNumOfAvailable > 0) {   //图片数量不超过限制
						//预览
						if (!/\.((jpg)|(jpeg)|(gif)|(png))$/i.test($(input).val())) {
							alert('只允许上传.jpg .gif .png类型的图片文件');
							$(input).val("");
							return false;
						}
						var html = $('<li type="photo"><div class="add_photo_img"><div class="c_close"><img src="//plugins.allinmd.cn/add-removeable-group-pic/images/c_close.png"></div></div></li>');
						var imgWrap = html.find(".add_photo_img");

						html.insertBefore(t.listContainer.find(".clear"));

						var close = html.find(".c_close");
						close.on("click", function () {     // 移除 此图片ff
							$(this).parent().parent().remove();
							t.photoNumOfAvailable++;
							t.updateNum();
							t.onSizeChange();
							input.val("");
						});

						var result = $.imageFileVisible({           // 判断是否图片 显示预览
							wrapSelector: imgWrap,
							fileSelector: input
						});
						
						if(result === false){
							$.topTip({mark: "warn",showTime: 3, content: "请上传图片类型!"});
							return false;
						}
						$(input).css("zIndex","-1");

						// 将 当前浏览图片按钮 移入刚刚上传的图片中。
						input.appendTo(imgWrap);
						t.bindDomObj();
						t.photoNumOfAvailable--;
						t.listContainer.show();
						t.updateNum();
						t.onSizeChange();

					}else{
						$.topTip({mark: "warn",showTime: 3, content: "最多添加"+t.opts.limitNumOfPhoto+"张照片!"});
						input.val("");
						return false;
					}
				}
			});
		},

		onSizeChange: function () {
			var t = this;
			var isExistPhotoOrVideo =  t.photoNumOfAvailable < t.opts.limitNumOfPhoto || t.videoNumOfAvailable< t.opts.limitNumOfVideo;
			t.opts.onSizeChange && t.opts.onSizeChange(isExistPhotoOrVideo);
		},
		//绑定上传视频按钮
		bindUploadVideo: function (obj) {
			var t = this;
			t.videoUped = 1;//视频上传成功参数
            var param={
                customerId:$("#sesCustomerId").val()
            };
			var uploader = Qiniu.uploader({
				runtimes: 'html5,flash,html4',
				browse_button: obj.substring(1),
				container: $(obj).parent().attr("id"),
				drop_element: $(obj).parent().attr("id"),
				//max_file_size: '2048mb',
				multi_selection: false,
				flash_swf_url: '/js/third-party/plupload/Moxie.swf',
				dragdrop: true,
				chunk_size: '4mb',
				uptoken_url: PC_CALL + "qiniu/storage/getQiniuToken/?paramJson="+JSON.stringify(param),
				domain: "//"+location.hostname,
				get_new_uptoken: false,
				filters: {
					mime_types: [ //只允许上传video
						{title: "video", extensions: "mp4,mov,avi,wmv,flv"}
					],
					prevent_duplicates: true //不允许选取重复文件
				},
				auto_start: true,
				init: {
					'FilesAdded': function (up, files) {// 文件添加进队列后,处理相关的事情
						if(t.videoNumOfAvailable ==0){ //提示操作上传数量值
							$.topTip({mark: "warn",showTime: 3, content: "最多添加"+t.opts.limitNumOfVideo+"个视频!"});
							return false;
						}
						plupload.each(files, function (file) {
							t.videoUped = 0;
							//console.log("ad")
							var progress = new FileProgress(file, 'fsUploadProgress');
							progress.setStatus("等待...");
							progress.bindUploadCancel(up);
							
							if(file.status == 1){ return false;} //未找到api 理解是1为上传失败
							//将图片插入到上方列表中
							console.log(t.videoNumOfAvailable);
							if (t.videoNumOfAvailable > 0) {   //图片数量不超过限制   //预览

								var html = $('<li type="video">' +
									'               <div class="add_photo_img">' +
									'                   <div class="c_close">' +
									'                       <img src="//plugins.allinmd.cn/add-removeable-group-pic/images/c_close.png"/>' +
									'                   </div>' +
									'                   <img src="//plugins.allinmd.cn/add-removeable-group-pic/images/video_default.png"/>' +
									'                   <div class="upload-progress"></div>' +
									'               </div>' +
									'           </li>');
								var imgWrap = html.find(".add_photo_img");

								html.insertBefore(t.listContainer.find(".clear"));

								var close = html.find(".c_close");
								close.on("click", function () {     // 移除 此视频
									t.listContainer.find(".pvideoIds").val(''); //置空id值
									$(this).parent().parent().remove();
									t.videoNumOfAvailable++;
									t.updateNum();
									t.onSizeChange();
								});
								t.videoNumOfAvailable--;
								t.listContainer.show();
							}else{
								return false;
							}

						});
					},
					'BeforeUpload': function (up, file) {// 每个文件上传前,处理相关的事情
						if(t.videoNumOfAvailable ==0){ //提示操作上传数量值
							uploader.removeFile(uploader.getFile(file.id));
							return false;
						}

						var name = comm.file.getName(file.name);
						var fileName = name.fileName;
						var suffix = name.suffixName;
						if ((/(mp4)|(mov)|(avi)|(wmv)|(flv)$/i.test(suffix))) {
							var fileSize = file.size;
							if (fileSize > 80 * 1048576) {
								alert("视频过大，请联系在线客服寻求帮助");
								uploader.removeFile(uploader.getFile(file.id));
								return false;
								
							} else {

							}
						} else {
							alert("格式不支持，请选择mov、mp4、avi、wmv、flv");
							uploader.removeFile(uploader.getFile(file.id));
							return false;
						}

						t.videoName = fileName.length > 15 ? fileName.substring(0, 15) + '...' + '.' + suffix : fileName + '.' + suffix;

						var progress = new FileProgress(file, 'fsUploadProgress');
						var chunk_size = plupload.parseSize(this.getOption('chunk_size'));
						if (up.runtime === 'html5' && chunk_size) {
							progress.setChunkProgess(chunk_size);
						}
					},
					'UploadProgress': function (up, file) {// 每个文件上传时,处理相关的事情
						$(".ev-processTips",t.listContainer).text("视频正在处理中...");
						
						//禁用视频关闭按钮
						$(".c_close",t.listContainer).hide();
						//外部禁用取消按钮
						$(".evSupportReplyCancel",t.listContainer.parents("li")).addClass("qx_but_prohibit");
						
						var progress = new FileProgress(file, 'fsUploadProgress');
						var chunk_size = plupload.parseSize(this.getOption('chunk_size'));
						progress.setProgress(file.percent + "%", file.speed, chunk_size);
						//$(".upload-progress").animate({width: file.percent*0.98 + '%'}, 200);
					},
					'UploadComplete': function () { //队列文件处理完毕后,处理相关的事情
						endTime = new Date();
						//$(".upload-progress").animate({width:"100%"}, 200);
						//console.log("UploadComplete")
					},
					'FileUploaded': function (up, file, info) {// 每个文件上传成功后,处理相关的事情
						var progress = new FileProgress(file, 'fsUploadProgress');
						progress.setComplete(up, info);
						//console.log("FileUploaded");
						if (info) {
							var dataJSON = JSON.parse(info);
							t.key = dataJSON.key;
							t.persistentId = dataJSON.persistentId;
							$(obj).parent().find(".moxie-shim").remove();
							
							//将七牛视频保存进
							t.saveQiNiuVideoInfo(file);
							t.bindUploadVideo(obj);//重新获取token
						}
					},
					'Error': function (up, err, errTip) {// 每个文件上传失败后,处理相关的事情
						var progress = new FileProgress(err.file, 'fsUploadProgress');
						progress.setError();
						progress.setStatus(errTip);
					}
					/*'Key': function(up, file) {
					 var key = "";
					 // do something with key
					 return key
					 }*/
				}
			});
			uploader.bind('FilesAdded', function (uploader, file) {
			/*	if (uploader.files.length > 1) { // 最多上传1个视频
					uploader.splice(1, 999);
				}*/
			});
			uploader.bind('FileUploaded', function () {
				//console.log('hello man,a file is uploaded');
			});
		},
		saveQiNiuVideoInfo: function (file) {
			var t = this;
			$.ajax({
				url: t.path.saveVideoInfo,
				data: {
					paramJson: $.toJSON({
						videoName: file.name,
						refType: 8,
						key: t.key,
						persistentId: t.persistentId
					})
				},
				success: function (data) {
					if (data && data.responseObject && data.responseObject && data.responseObject.responseStatus) {
						// 更新回复表单提交按钮样式
						t.listContainer.find(".pvideoIds").val(data.responseObject.responsePk);
						t.updateNum();
						t.onSizeChange();
					}
				}
			})
		},
		bindRemoteUpload: function () {
			var t = this;
			_DomObj.html("<input type='file' name='file' id='removeablePicBtn' /> ");
			var input = _DomObj.find("input");
			czyx.uploadReplace('#removeablePicBtn', {
				url: PC_CALL + "comm/upload_attachment/upload/?_=" + Math.random(), //文件处理的URL,
				data: {paramJson: $.toJSON({imageType: "5", domain: location.hostname})},
				uploadReplaceCss: {
					//设置上传按钮图片
					//background: 'url(' + picpath + ') center no-repeat',
					//backgroundSize: '100%',
					width: "50",             //上传按钮的宽度
					height: "16",              //上传按钮的高度
					lineHeight: "12px",              //上传按钮的高度
					marginRight: "10px",
					marginTop: "10px",
					top: 0,
					right: 0
				},
				html: t.opts.html,      // 替换后的DOM代码
				uploadInputCss: {
					width: "50",             //上传按钮的宽度
					height: "16",             //上传按钮的高度
					padding: "0",
					top: 0,
					right: 0
				},
				uploadBefore: function () {
					var fileSize = comm.file.getFileSize(document.getElementById("removeablePicBtn"));
					if (fileSize > 5242880) {
						$.topTip({mark: "warn",showTime: 3, content: '图片不能大于' + 5242880 / 1048576 + "M"});
						return false;
					}
					if (!/\.((jpg)|(gif)|(png))$/i.test(this.value)) {
						$.topTip({mark: "warn",showTime: 3, content: '只允许上传.jpg .gif .png类型的图片文件'});
						return false;
					}
					var html = $('<li><div class="add_photo_img"><div class="c_close"><img src="//plugins.allinmd.cn/add-removeable-group-pic/images/c_close.png"></div></div></li>');
					html.insertBefore(t.listContainer.find(".clear"));
					t.listContainer.show();
				},
				uploadEnd: function (serverJson) {//上传完毕后调用
					try {
						serverJson = $.parseJSON(serverJson);
						if (serverJson && serverJson.responseObject && serverJson.responseObject.responseMessage.url != "") {
							var pk = serverJson.responseObject.responsePk;
							t.imgPkList[pk] = "";
							var html = t.listContainer.find("li:last");
							var close = html.find(".c_close");
							close.on("click", function () {     // 移除 此图片
								var pk = $(this).parent().attr("pk");
								delete t.imgPkList[pk];
								$(this).parent().parent().remove();
								t.photoNumOfAvailable++;
								t.updateNum();
								t.onSizeChange();
								input.val("");
								t.updatePk();
								if (t.photoNumOfAvailable > 0) {
									t.bindRemoteUpload();
								}
							});
							html.find(".add_photo_img").append("<img src='" + serverJson.responseObject.responseMessage.url + "' />").attr("pk", pk);
							t.bindDomObj();
							t.photoNumOfAvailable--;
							t.updateNum();
							if (t.photoNumOfAvailable > 0) {
								t.bindRemoteUpload();
							}
							t.updatePk();
							t.onSizeChange();
						} else {
							if (serverJson.message) {
								alert(serverJson.message);
							} else {
								alert("上传失败");
							}
						}
					} catch (e) {
						alert("上传失败");
						//t.img = null;
						return;
					}
				}
			});

		},
		removeItem: function (obj) {
			var t = this;
			$(obj).parent().remove();
			t.photoNumOfAvailable++;
			t.updateNum();
		},

		updateNum: function () {
			
			//更新进程
			//$(".upload-progress").animate({width: '100%'}, 200);
			
			var t = this;
			//启用视频关闭按钮
			$(".c_close",t.listContainer).show();
			//外部启用取消按钮
			$(".evSupportReplyCancel",t.listContainer.parents("li")).removeClass("qx_but_prohibit");
			
			t.listContainer.find(".hn_add").text('还能添加' + t.photoNumOfAvailable + '张图片或' + t.videoNumOfAvailable +'个视频').show();
			if (t.photoNumOfAvailable === t.opts.limitNumOfPhoto && t.videoNumOfAvailable === t.opts.limitNumOfVideo) {
				t.listContainer.hide();
			}
			if (t.photoNumOfAvailable == 0 && t.videoNumOfAvailable==0) {
				_DomObj.find("input").hide();
			} else {
				_DomObj.find("input").show().css("top", 0);
			}
		},
		updatePk: function () {
			var t = this;
			var pks = [];
			for (var key in t.imgPkList) {
				pks.push(key);
			}
			t.listContainer.find(".imgPkList").val(pks);
		}

	};

	controller.init();
	return {getPics: controller.getPics};


};