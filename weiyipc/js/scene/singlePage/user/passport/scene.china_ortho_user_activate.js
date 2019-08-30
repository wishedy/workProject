/**
 * 功能描述： 中华骨科网用户激活
 * 使用方法:
 * 注意事件：
 * 引入来源：  作用：
 *
 * Created by LiuYuTao on 2015/10/27.
 */

$(function () {

	function validateShowErr(element, error) {
		var p = $(element).parents(".inputParent");
		var con = p.find(".l_warning");
		con.empty();
		con.append("<span></span>");
		con.find("span").html(error);
		con.show();
		p.find(".ok").hide();
		p.find(".input-border").addClass("input-error");
		p.find(".jinggao").show();
		$(element).parent().parent().addClass("input-error");
	}

	function validateHideErr(element) {
		var p = $(element).parents(".inputParent");
		var con = p.find(".l_warning");
		p.find(".jinggao").hide();
		p.find(".ok").show();
		p.find(".input-border").removeClass("input-error");
		con.hide();
		$(element).parents(".input-error").removeClass("input-error");
		$(element).parents(".l_warning").empty();
	}

	var controller = {
		customerAuth: null,
		path: {
			getRenZheng: PC_CALL+"customer/auth/getAuthBycustomerId/",
			activateUser: PC_CALL+"customer/reset/password/updatePassword/",
			dataTag: PC_CALL+"commdatas/tag/getDataTags/",
			medical: PC_CALL+"commdata/getMedicalTitleList/",
			renzhengSubmit: PC_CALL+"customer/auth/save/",	//	认证提交
			getCustomerUnite: PC_CALL+"customer/unite/getCustomerUnite/"     //获取当前登录用户信息

		},
		el: {
			activate: null,
			info: null
		},
		$container: $("body"),
		init: function () {
			var t = this;
			t.el.activate = $("#layerActivate");
			t.el.info = $("#layerInfo");

			t.bindActivatePage();
			t.uploadLogo();
		},
		//获取当前登录用户信息
		getCustomerUnite: function () {
			var t = this;
			t.unite = {customerId: "111111"};
			return;
			//TODO:  临时返回
			$.ajax({
				type: 'POST',
				url: t.path.getCustomerUnite,
				cache: false,
				dataType: 'json',
				async: false,
				success: function (rep) {
					if (rep && rep.responseObject) {
						t.unite = rep.responseObject;
					}
				},
				error: function (XMLHttpRequest, textStatus, errorThrown) {
				}
			});
		},

		//职称初始化
		medicalInit: function () {
			var t = this;
			var medical = "";
			var medical1 = "";
			if (t.customerAuth.medicalTitle != undefined) {
				medical = t.customerAuth.medicalTitle;
				medical1 = medical.split(",");
				var ids = [];
				var html = "";
				$.each(medical1, function (i, val) {
					if (val) {
						if (val.split("_")[1]) {
							ids.push({id: val.split("_")[0], name: val.split("_")[1]});
						}
					}
				});
				$.each(ids, function (i, val) {
					html += '<li><div class="p_baseinfo_tag_text tagName" medicalid=' + val.id + '>' + val.name + '</div><div class="p_baseinfo_tag_close"><img src="//img00.allinmd.cn/personal/baseinfo_close.png"></div></li>';
				});
				$(".medicalShow").append(html);
				//比对是对应职称选中
				$.each($(".medical_con_list .medical_list_li"), function (i, em) {
					$.each(ids, function (j, val) {
						if ($(em).attr("medicalid") == val.id) {
							$(em).attr("select-status", "true");
							$(em).addClass("active");
						}
					});
				});
			}

			t.clear($(".medicalShow"));
		},
		/**
		 *    专业领域初始化
		 */
		areaInit: function () {
			var t = this;
			var area = t.customerAuth.areasExpertise;
			var area1 = [];
			if (area) {
				area1 = area.split(",");
			}
			var ids = [];
			var html = "";
			$.each(area1, function (i, val) {
				if (val) {
					if (val.split("_")[1]) {
						ids.push({id: val.split("_")[0], name: val.split("_")[1]});
					}
				}
			});
			$.each(ids, function (i, val) {
				html += '<li><div class="p_baseinfo_tag_text tagName" tagid=' + val.id + '>' + val.name + '</div><div class="p_baseinfo_tag_close"><img src="//img00.allinmd.cn/personal/baseinfo_close.png"></div></li>';
			});
			$(".proFieldshow").append(html);

			//比对是对应职称选中
			$.each($(".tag_con_list .tag_li"), function (i, em) {
				$.each(ids, function (j, val) {
					if ($(em).attr("tagid") == val.id) {
						$(em).attr("select-status", "true");
						$(em).addClass("active");
					}
				});
			});
			t.clearTag();
		},
		/**
		 * 输入框激活状态
		 */
		bindActiveInput: function () {
			var t = this;
			t.$container.find('input').on("focus", function () {
				$(this).parent().addClass("hover");
			});
			t.$container.find('input').on("blur", function () {
				$(this).parent().removeClass("hover");
			});
		},
		/**
		 * 绑定激活页面
		 */
		bindActivatePage: function () {
			var t = this;
			t.bindActiveInput();
			$("#activateBtn").on("click", function () {

				var password = $.trim($("[name=passwd]").val());
				if (password == "") {
					$(".password_input .l_warning").html("<span><label>请填写密码</label></span>").show();
				} else {
					if (password.length < 6 || password.length > 20) {
						$(".password_input .l_warning").html("<span><label>密码长度请保持在6-20位!</label></span>").show();
					} else {
						t.activateUser({password: password});
						// TODO: 激活成功后跳转到认证界面。
						// TODO: 获取当前用户填写过的资料。
					}
				}

			});
		},
		/**
		 * 用户激活提交，提交后跳转到个人信息填写页面
		 * @param options
		 */
		activateUser: function (options) {
			var t = this;
			var data = {};
			data.password = $.trim($("#password").val());
			data.customerId = $("#customerId").val();
			data.resetSite = 1;
			data.itemId = $("#itemId").val();
			data.activaflag = 1;
			$.ajax({
				url: t.path.activateUser,
				dataType: "json",
				type: "post",
				async: false,
				data: {paramJson: $.toJSON(data)},
				success: function (data) {  // 激活成功后跳转到认证页面。
					t.showRenZheng();
				}
			});
		},
		/**
		 * 绑定个人信息填写页面
		 */
		bindInfo: function () {
			var t = this;
			var logo = "/js/module/auth/images/a_logo_def.png";
			var params = {};
			var data = {};
			var userData = {};
			data.logoUseFlag = UseFlag.c;
			data.refId = t.unite.customerId;
			params.paramJson = $.toJSON(data);

			$.ajax({
				type: 'POST',
				url: t.path.getLogo,
				data: params,
				cache: false,
				async: false,
				dataType: 'json',
				success: function (rep) {
					if (rep && rep.responseObject) {
						urlData = rep.responseObject;
					}
				}
			});

			$("#company").lenovo({
				url: PC_CALL+"commdata/getHospitalList/",
				width: 340,
				showName: "hospitalName" //显示出的值
				//id:"hospitalAddress",   //自定义属性值
				//hiddenId:"address",    //自定义属性
			});

			$("input[name=name]").val(t.customerAuth.certificatesCode);
			$("input[name=age]").val(t.customerAuth.certificatesPath);
			$("input[name=company]").val(t.customerAuth.company);
			/*稍后再填*/
			$("#laterOn").on("click", function () {
				if($("#redirectUrl").val()!=""){
                    g_sps.jump(null,$("#redirectUrl").val());
				}else{
                    g_sps.jump(null,'/pages/personal/index.html');
				}
			});

			t.pointerChange(2);
			t.uploadLogo(logo);
			t.medicalTitle();
			t.getTag();
			t.medicalInit();
			t.areaInit();
			t.secondSubmit();
		},
		/**
		 * 提交个人信息
		 */
		secondSubmit: function () {
			var t = this;
			var form = t.$container.find("#renzhengForm");
			// 较验
			form.validate({
				submitHandler: function () {
					var param;
					// 判断图片是否保存成功
					var validReslut = t.validateBeforeRenZhengSubmit();
					var company = $("#company").val();
					if (validReslut.flag) {
						param = {
							opflag: 1,
							name: t.$container.find("input[name=name]").val(),
							age: t.$container.find("input[name=age]").val(),
							company: company,
							medicalTitle: validReslut.medicalTitle.substring(0, validReslut.medicalTitle.length - 1),
							areasExpertise: validReslut.areasExpertise.substring(0, validReslut.areasExpertise.length - 1),
							saveInfoflag:1
						};
						var data = {paramJson: $.toJSON(param)};
						comm.LightBox.showloading();
						t.$container.find(".submit_but").off("click");
						$.ajax({
							url: t.path.renzhengSubmit,
							cache: false,
							data: data,
							dataType: 'json',
							type: "POST",
							success: function (data) {
								comm.LightBox.hideloading();
								if (data.responseObject.responseStatus) {
									t.name = t.$container.find("input[name=name]").val();
									// 激活成功
									if($("#returnUrl").val()!=""){
                                        g_sps.jump(null,$("#redirectUrl").val());
									}else{
                                        g_sps.jump(null,'/pages/personal/index.html');
									}
								} else {
									if (data.responseObject.responseMessage) {
										alert(data.responseObject.responseMessage);
									} else {
										alert("提交个人信息失败，请稍后重试");
									}
								}
							},
							error: function (XMLHttpRequest, textStatus, errorThrown) {
								// 通常 textStatus 和 errorThrown 之中
								// 只有一个会包含信息
								//this; // 调用本次AJAX请求时传递的options参数
								alert(textStatus + "   " + errorThrown);
							}
						});
					}
				},
				rules: {
					"name": {
						"required": true,
						"rangelength": [1, 50]
					},
					"age": {
						"required": true,
						"number":true,
						"max":120,
						"min":20
					},
					"company": {
						"required": true,
						"rangelength": [1, 200],
						"isChinese":true
					}
				},
				messages: {
					"name": {
						"required": "您的姓名？",
						"rangelength": "您的姓名过长？"
					},
					"age": {
						"required": "20-120",
						"number":"20-120",
						"max":"20-120",
						"min":"20-120"
					},
					"company": {
						"required": "请填写医院名称。",
						"rangelength": "医院最大长度200个字符",
						"isChinese":"请填写正确的医院名称"
					}
				},
				errorPlacement: function (error, element) {
					validateShowErr(element, error);
				},
				success: function (element) {
					validateHideErr(element);
				},
				onkeyup: true
			});
			// 提交
			t.$container.find(".submit_but").on("click", function () {
				form.submit();
			});
		},
		/**
		 * form提交之前验证
		 */
		validateBeforeRenZhengSubmit: function () {
			var t = this;
			var flag = true;
			var name = t.$container.find("input[name=name]").val();
			var company = t.$container.find("input[name=company]").val();
			var medical = $(".medicalShow .tagName");
			var area = $(".proFieldshow .tagName");
			var age = t.$container.find("input[name=age]").val();
			var areasExpertise = "";
			var medicalTitle = "";
			$.each(medical, function (i, em) {
				medicalTitle += $(em).attr("medicalid") + '_' + $(em).text() + ',';
			});

			$.each(area, function (i, em) {
				areasExpertise += $(em).attr("tagid") + '_' + $(em).text() + ',';
			});
			if (age) {
				validateHideErr(t.$container.find(".age_error"));
			}
			if (medicalTitle) {
				validateHideErr(t.$container.find(".medical_error"));
			}
			if (areasExpertise) {
				validateHideErr(t.$container.find(".area_error"));
			}
			if (!age || age < 20 || age > 120 && !isNaN(age)) {
				validateShowErr(t.$container.find(".age_error"), "<label>20-120</label>");
				flag = false;
			}
			if (!medicalTitle) {
				validateShowErr(t.$container.find(".medical_error"), "<label>请选择职称</label>");
				flag = false;
			}
			if (!areasExpertise) {
				validateShowErr(t.$container.find(".area_error"), "<label>请选择专业</label>");
				flag = false;
			}
			return {
				flag: flag,
				medicalTitle: medicalTitle,
				areasExpertise: areasExpertise
			};
		},

		/**
		 * 显示认证填写
		 */
		showRenZheng: function () {
			var t = this;
			t.el.activate.hide();
			t.el.info.show();
			t.getRenZheng();
			t.getCustomerUnite();
			t.bindInfo();
		},

		/**
		 *   底部按钮的切换
		 */
		pointerChange: function (i) {
			var t = this;
			$(".auth_b_po li").each(function (j, em) {
				$(em).removeClass("active");
				if (i != 0) {
					$(".auth_b_po li").eq(i - 1).addClass("active");
				} else {//最后一步隐藏
					$(".auth_b_po").hide();
				}
			})
		},

		medicalTitle: function () {
			this.getmedData($("#medical_title"));
		},
		getmedData: function ($this) {
			var t = this;
			$.ajax({
				type: "post",
				url: t.path.medical,
				async: false,
				dataType: "json",
				success: function (rep) {
					if (rep) {
						var html = "";
						$.each(rep, function (i, val) {
							html += "<li><ul class='p_l_zc_xl_li'></ul></li>";
						});
						$this.find(".medical_con_list").html(html);

						$.each($this.find(".medical_con_list ul"), function (i, em) {
							var html2 = "";
							$.each(rep[i + 1], function (i, val) {
								html2 += "<li class='medical_list_li' select-status='false' medicalid='" + val.id + "'>" + val.medicalTitle + "</li>";
							});
							html2 += "<div class='clear'></div>";
							$this.find(".medical_con_list ul").eq(i).append(html2);
						});
						t.mouse($this);
						t.listAction($this);
					}
				}
			});
		},
		uploadLogo: function (picpath) {
			var t = this;
			if ($("#logo_upload [id^=czyx]").length > 0) {
				$("#logo_upload").html('<input id="auth_logo_input" type="file" name="file">');
			}
			czyx.uploadReplace('#auth_logo_input', {
				url: PC_CALL+"comm/upload_attachment/upload/?_=" + Math.random(), //文件处理的URL,
				data: {paramJson: $.toJSON({imageType: "0", domain: location.hostname})},
				uploadReplaceCss: {
					//设置上传按钮图片
					background: 'url(' + picpath + ') center no-repeat',
					backgroundSize: '100%',
					width: "110",             //上传按钮的宽度
					height: "110",             //上传按钮的高度
					borderRadius: "50%"
				},
				uploadInputCss: {
					width: "110",             //上传按钮的宽度
					height: "110",             //上传按钮的高度
					padding: "0"
				},
				uploadBefore: function () {
					var fileSize = comm.file.getFileSize(document.getElementById("file1"));
					if (fileSize > 5242880) {
						alert('图片不能大于' + 5242880 / 1048576 + "M");
						return false;
					}
					if (!/\.((jpg)|(gif)|(png))$/i.test(this.value)) {
						alert('只允许上传.jpg .gif .png类型的图片文件');
						return false;
					}
				},
				uploadEnd: function (serverJson) {//上传完毕后调用
					try {
						serverJson = $.parseJSON(serverJson);
						if (serverJson && serverJson.responseObject && serverJson.responseObject.responseMessage.path !== "") {
							uploadResult = serverJson.responseObject.responseMessage;
							t.uploadLogo(serverJson.responseObject.responseMessage.url);
							$.ajax({
								url: PC_CALL+"commdata/saveLogoUrl/",
								type: "post",
								data: {
									paramJson: $.toJSON({
										uploadType: 0,
										logoType: 10,
										imageType: 1,
										logoSize: uploadResult.logoSize,
										logoWidth: uploadResult.logoWidth,
										logoHeight: uploadResult.logoHeight,
										dynaWidth: uploadResult.dynaWidth,
										dynaHeight: uploadResult.dynaHeight,
										logoUrl: uploadResult.url
									})
								},
								success: function (result) {
									if (result.responseObject.responseStatus) {

									} else {
										// 上传失败 TODO
									}
								}
							})
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
		/**
		 *  获取认证
		 */
		getRenZheng: function () {
			var t = this;

			// 暂时
			/*	t.customerAuth = {
			 certificatesCode:"name",
			 certificatesPath:33,
			 company:"hospital"
			 };*/
			// TODO:获取认证信息 包括用户姓名，年龄，医院
			$.ajax({
				url: t.path.getRenZheng,
				dataType: "json",
				type: "post",
				async: false,
				success: function (data) {
					if (data === null || data == "" || data.responseObject === undefined) {
						t.customerAuth = {};
					} else {
						var rspObj = data.responseObject;
						t.customerAuth = rspObj;
						t.name = rspObj.certificatesCode;//姓名
					}
				}
			});
		},
		clear: function (obj) {
			obj.find(".p_baseinfo_tag_close").on("click", function () {
				$Li = $(this).parents("li");
				$.each($(".medical_con_list li"), function (i, em) {
					if ($(em).attr("medicalid") === $Li.find(".tagName").attr("medicalid")) {
						$(em).removeClass("active");
						$(em).attr("select-status", "false");
					}
				});
				$Li.remove();
			})
		},
		//tag
		getTag: function () {
			var t = this;
			$.ajax({
				type: "post",
				url: t.path.dataTag,
				async: false,
				data: {paramJson: $.toJSON({parentId: 1, pageIndex: 1, pageSize: 50, treeLevel: '2'})},
				dataType: "json",
				success: function (data) {
					if (data && data.responseObject && data.responseObject.length > 0) {
						var htmledit = "";
						dataTag = data.responseObject;
						if (dataTag && dataTag.length > 0) {
							$.each(dataTag, function (index, obj) {
								htmledit += '<li class="tag_li" select-status="false" tagid="' + obj.id + '">' + obj.tagName + '</li>';
							});
							htmledit += '<div class="clear"></div>';
							$(".tag_con_list li ul").html(htmledit);
							t.tagListAction();
							t.mouse($("#areasExpertise"));
						}
					}
				},
				error: function () {
				}
			});
		},
		mouse: function ($this) {
			$this.on("mouseover", function () {
				$this.find(".p_l_zc_xl").show();
				$this.find(".p_l_zc_xl").css("bottom", -$this.find(".p_l_zc_xl").outerHeight());
			});
			$this.on("mouseout", function () {
				$this.find(".p_l_zc_xl").hide();
			});
		},
		listAction: function ($this) {
			var t = this;
			$(".medical_con_list ul", $this).each(function (i, em) {
				$("li", $(em)).each(function (j, obj) {
					$(obj).on("mouseover", function () {
						$("li", $(em)).removeClass("hover");
						if ($(this).attr("select-status") == "false") {
							$(this).addClass("hover");
						}
					});
					$(obj).on("mouseout", function () {
						$(this).removeClass("hover");
					});
					$(obj).on("click", function () {
						var html = "";
						var str = "";
						if ($(this).attr("select-status") == "false") {
							$("li", $(em)).attr("select-status", "false");
							$("li", $(em)).removeClass("active");
							$(this).addClass("active");
							$(this).attr("select-status", "true");
						} else {
							$(this).removeClass("active");
							$(this).attr("select-status", "false");
						}
						$(".medical_con_list ul li", $this).each(function (n, val) {
							if ($(val).attr("select-status") == "true") {
								html += '<li><div class="p_baseinfo_tag_text tagName" medicalid=' + $(val).attr("medicalid") + '>' + $(val).text() + '</div><div class="p_baseinfo_tag_close"><img src="//img00.allinmd.cn/personal/baseinfo_close.png"></div></li>';
								//str+=$(val).attr("medicalid")+"_"+$(val).text()+",";
							}
						});
						$(".medicalShow").html(html);
						//$(".medicalShow").attr("medicalTitle",str.substring(0,str.length-1));
						t.clear($(".medicalShow"));
					});
				});
			});

		},

		tagListAction: function () {
			var t = this;

			$(".tag_con_list .tag_par_li li").each(function (j, obj) {
				$(obj).on("mouseover", function () {
					$("li", $(this)).removeClass("hover");
					if ($(this).attr("select-status") == "false") {
						$(this).addClass("hover");
					}
				});
				$(obj).on("mouseout", function () {
					$(this).removeClass("hover");
				});
				$(obj).on("click", function () {
					var html = "";
					if ($(this).attr("select-status") == "false") {
						$("li", $(this)).attr("select-status", "false");
						$("li", $(this)).removeClass("active");
						$(this).addClass("active");
						$(this).attr("select-status", "true");
						html += '<li><div class="p_baseinfo_tag_text tagName" tagid=' + $(this).attr("tagid") + '>' + $(this).text() + '</div><div class="p_baseinfo_tag_close"><img src="//img00.allinmd.cn/personal/baseinfo_close.png"></div></li>';
					} else {
						$(this).removeClass("active");
						$(this).attr("select-status", "false");
						var $this = $(this);
						$(".proFieldshow .tagName").each(function (n, val) {
							if ($(val).attr("tagid") == $this.attr("tagid")) {
								$(val).parents("li").remove();
							}
						});
					}

					$(".proFieldshow").append(html);

					t.clearTag();
				});
			});
		},
		clearTag: function () {
			$("#areasExpertise").find(".p_baseinfo_tag_close").on("click", function () {
				$Li = $(this).parents("li");
				$.each($(".tag_con_list li"), function (i, em) {
					if ($(em).attr("tagid") === $Li.find(".tagName").attr("tagid")) {
						$(em).removeClass("active");
						$(em).attr("select-status", "false");
					}
				});
				$Li.remove();
			})
		}
	};
	controller.init();
});