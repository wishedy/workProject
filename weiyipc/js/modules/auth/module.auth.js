/**
 * 功能描述： 认证功能
 * 使用方法:  主方法 auth.showAuthPage({
 *                 	onAuthCancel:"back",  // 这个参数针对暂不认证按钮， 看是否是关闭当前弹层， 或是返回上一页。
					privCheckFailed: function () {  // 本参数只有在上面参数为 back时才有效。 看应该返回到哪一页，避免返回到 联合登录页， 或是微信绑定登录注册页。 或是搜索页。
						window.location.href = "/"
					}
				});
 * 注意事件：
 * 引入来源：  作用：
 *
 * Created by LiChunHui on 2015/9/6.
 */
module.auth = function (Obj) {
	function validateShowErr(element, error) {
		var p = $(element).parents(".inputParent");
		var con = p.find(".l_warning");
		con.empty();
		con.append("<img src='//modules.allinmd.cn/user/images/jinggao2.png' alt=''/><span></span>");
		con.find("span").html(error);
		con.show();
		p.find(".input-border").addClass("input-error");
		$(element).parent().parent().addClass("input-error");
	}

	function validateHideErr(element) {
		var p = $(element).parents(".inputParent");
		var con = p.find(".l_warning");

		p.find(".input-border").removeClass("input-error");
		con.hide();
		$(element).parents(".input-error").removeClass("input-error");
		$(element).parents(".l_warning").empty();
	}

	var controller = {
		isLoginStatus: false,     // 是否已登录
		isRenZhengStatus: false,  // 是否已认证
		$container: null,
		customerAuth: null,
		isRunning: false,        // 是否已弹出
		isSubmitting: false,
		isBindKeyCode: false,
		department: 1, //科室 默认骨科  1.骨科 2.手外
		path: {
			getCustomerUnite: PC_CALL + "customer/unite/getCustomerUnite/",     //获取当前登录用户信息
			medical: PC_CALL + "commdata/getMedicalTitleList/",
			dataTag: PC_CALL + "commdatas/tag/getDataTags/",
			getCustomerAuthInfo: PC_CALL + "customer/auth/getAuthBycustomerId/",
			getLogo: PC_CALL + "commdata/getLogoUrlList/",
			university:PC_CALL+"commdata/getSchoolList/",
			renzhengSubmit: PC_CALL + "customer/auth/createAuth/",	//	认证提交
			otherAuth: PC_CALL + "customer/auth/otherAuth/"//其他认证
		},
		template: {
			first: function () {
				//单项骨科
//				return ' <div class="pop-up auth">' +
//					'        <div class="login" style="">' +
//					'           <div class="login_content">' +
//					'               <div class="auth_lh">认证审核</div>' +
//					'               <div class="auth_tishi auth_tishi_sh">为了保证十万骨科医师的权益，唯医需要对你的身份进行审核完成认证后，即可享受全网所有资源免费浏览的特权哦~</div><div class="clear"></div>' +
//					'               <div class="login_but"><div class="v2-blue-btn ev-orthopaedicsBtn">开始认证</div></div>' + 
//					'               <div class="no_auth">暂不认证</div>' +
//					'           </div>' +
//					'        </div>' +
//					'</div>';
				//骨科与手外
				return '<div class="al-idSurePop pop-up auth">'+
				        '<figure class="al-idSureContent login">'+
			            '<figcaption><b></b>身份认证</figcaption>'+
			            '<p class="al-idSureText">为保证医学交流环境，唯医需要对你的身份进行审核，通过即可观看数万手术视频～</p>'+
			            '<section class="al-idSurePopMain">'+
			                '<span>选择科室，开始认证</span>'+
			                '<a href="javascript:;" class="al-orthopaedicsBtn ev-chooseDepartment" data-dept="1"><i></i>骨科</a>'+
			                '<a href="javascript:;" class="al-surgeryBtn ev-chooseDepartment"  data-dept="2"><i></i>手外科</a>'+ 
			                '<p class="no_auth">暂不认证</p>'+ 
			            '</section>'+
			        '</figure>'+
			    '</div>';
			},
			second: function () {
				return ' <div class="pop-up auth">' +
					'        <div class="login" style="">' +
					'           <div class="login_content">' +
					'               <div class="auth_lh">医师认证</div>' +
					'               <div class="auth_tishi02">填写真实信息，有助于跟大师零距离交流哦~</div>' +
					'               <div class="clear"></div>' +
					'               <form id="renzhengForm">' +
					'               <div class="auth_up_logo">' +
					'                   <div class="auth_uploadfile" id="logo_upload">' +
					'                       <input id="auth_logo_input" type="file" name="file">' +
					'                   </div>' +
					'                   <div class="auth_sc">上传照片</div>' +
					'               </div>' +
					'               <div class="name_input">' +
					'                   <div class="inputParent authName_input">' +
					'                       <div class=" input-wrap input-border">' +
					'                          <input type="text" maxlength="50" placeholder="姓名" tabindex="2" name="name" />' +
					'                       </div>' +
					'                       <div class="l_warning"></div>' +
					'                   </div>' +
					'                   <div class="inputParent authAge_input">' +
					'                       <div class=" input-wrap input-border">' +
					'                          <input type="text" placeholder="年龄" tabindex="3" name="age" />' +
					'                       </div>' +
					'                       <div class="l_warning age_error"></div>' +
					'                   </div>' +
					'                   <div class="clear"></div>' +
					'               </div>' +
					'               <div class="inputParent radio_input rz-num-type">' +
					'				<div class="doctor_radio03" value="1">我在医院</div>' +
					'				<div class="doctor_radio03" value="2">我在学校</div>' +
					'				<p class="clear"></p>'+
					'               <div class="l_warning unit_error"></div>' +
					'				</div>' +
					'                   <div class="clear"></div>' +
					'               <div class="inputParent rz_input onUnit" style="display: none">' +
					'                   <div class=" input-wrap input-border">' +
					'                       <input type="text" placeholder="医院"  tabindex="5" name="company" id="company"/>' +
					'                   </div>' +
					'                   <div class="l_warning"></div>' +
					'               </div>' +
					'               <div class="inputParent rz_input onUnit" style="display: none">' +
					'                   <div class=" input-wrap input-border">' +
					'                       <input type="text" placeholder="学校"  tabindex="5" name="schoolName" id="schoolName"/>' +
					'                   </div>' +
					'                   <div class="l_warning"></div>' +
					'               </div>' +
					'               <div class="inputParent rz_input">' +
					'                     <div class="lk_input input-wrap input-border" id="medical_title" >' +

					'                       <div class="input_name">职称</div>' +
					'                       <ul class="medicalShow a_tag">' +
					'                       </ul>' +
					'                       <div class="p_l_zc_xl">' +
					'                         <ul class="medical_con_list">' +
					'                         </ul>' +
					'                       </div>' +
					'                     </div>' +
					'                   <div class="l_warning medical_error"></div>' +
					'               </div>' +
					'               <div class="inputParent rz_input">' +
					'                      <div class="lk_input input-wrap input-border" id="areasExpertise">' +

					'                          <div class="input_name">专业</div>' +
					'                          <ul class="proFieldshow a_tag"></ul>' +
					'                          <div class="p_l_zc_xl">' +
					'                            <ul class="tag_con_list"><li class="tag_par_li"><ul class="p_l_zc_xl_li"></ul></li></ul>' +
					'                          </div>' +
					'                      </div>' +
					'                   <div class="l_warning area_error"></div>' +
					'               </div>' +
					'               <div class="login_but submit_but">' +
					'                   <div class="v2-blue-btn v2-letterspace-2"  id="second_btn">提交</div>' +
					'               </div>' +
					'               <input type="hidden" value="" name="certificatesPath" id="certificatesPath" />' +
					'               <input type="hidden" value="" name="qualificationPath" id="qualificationPath" />' +
					'               </form>' +
					'           </div>' +
					'        </div>' +
					'</div>';
			},
			//第三步
			third: function () {
				return ' <div class="pop-up auth">' +
					'        <div class="login" style="">' +
					'           <div class="login_content">' +
					'               <div class="auth_lh">医师认证</div>' +
					'               <div class="auth_tishi02">保证信息的真实性，才能更快通过认证哦~</div>' +
					'               <form id="renzhengForm">' +
					'               <div class="radio_input rz-num-type"></div>' +
					'               <input type="hidden" name="certificate" id="certificate" />' +
					'               <div class="inputParent rz_input">' +
					'                   <div class="input-border input-wrap">' +
					'                       <input type="text" maxlength="50" placeholder="证件号码" tabindex="4"  name="attCode" />' +
					'                   </div>' +
					'                   <div class="l_warning"></div>' +
					'               </div>' +
					'               <div class="zj_sc_title">' +
					'                   <span class="cer_sc cer_sc_active">证件照片上传</span> ' +
					'                   <span class="line_sc">|</span>' +
					'                   <span class="wx_sc">微信提交</span> ' +
					'               </div>' +
					'               <div class="zj_sc_con">' +
					'                   <div class="cer_sc_con">' +//照片上传
					'                       <div class="cer_l"><img src="//modules.allinmd.cn/auth/images/sl_zp.png"></div>' +
					'                       <div class="cer_r"><div class="cer_r_t">示例</div><div class="cer_r_c">请按照左侧的规范,上传证 件照片，如果证件照有两面，请上传证件号的一面。</div></div>' +
					'                       <div class="clear"></div>' +
					'                       <div class="cer_uploadfile" id="cer_upload">' +
					'                           <input id="cer_po_input" type="file" name="file">' +
					'                       </div>' +
					'                   </div>' +
					'                   <div class="l_warning photo_error"></div>' +
					'                   <div class="wx_sc_con">' +//微信提交
					'                       <div class="wx_l weixin_erweima"></div>' +
					'                       <div class="wx_r"><div class="wx_r_t">电脑上传不方便？</div><div class="wx_r_c">扫描左边二维码，关注后 即可用手机发送证件照片 给我们。</div></div>' +
					'                       <div class="clear"></div>' +
					'                   </div>' +
					'                 <div class="l_warning weixin_error" style="height: auto;"><img src="//modules.allinmd.cn/auth/images/zt_sb.png" ></div>' +
					'                 <div class="l_warning weixin_right" style="height: auto;"><img src="//modules.allinmd.cn/user/images/ok.png" width="17" height="17"></div>' +
					'               </div>' +
					'               <div class="login_but submit_but">' +
					'                   <div class="v2-blue-btn v2-letterspace-2"  id="third_btn"> 完成认证 </div>' +
					'               </div>' +
					'               <div class="other_auth" >其它类型认证</div>' +
					'               <input type="hidden" value="1" id="photoUptype" />' +
					'               <input type="hidden" value="" name="certificatesPath" id="certificatesPath" />' +
					'               <input type="hidden" value="" name="qualificationPath" id="qualificationPath" />' +
					'               </form>' +
					'           </div>' +
					'        </div>' +
					'</div>';
			},
			//其它类型
			otherThird: function () {
				return ' <div class="pop-up auth">' +
					'        <div class="login" style="">' +
					'           <div class="login_content">' +
					'               <div class="auth_lh">医师认证</div>' +
					'               <div class="auth_tishi02">保证信息的真实性，才能更快通过认证哦~</div>' +
					'               <div class="auth_line">线下认证</div>' +
					'               <div class="inputParent rz_input">' +
					'                   <div class="input-border input-wrap">' +
					'                       <input type="text" placeholder="邀请码" id="InvCode" />' +
					'                   </div>' +
					'                   <div class="l_warning"></div>' +
					'               </div>' +
					'               <div class="auth_othTishi"><span></span>邀请码需要现场认证通过后，才能获得哦~</div>' +
					'               <div class="login_but submit_but">' +
					'                   <div class="v2-blue-btn v2-letterspace-2" id="otherThird_btn"> 完成认证 </div>' +
					'               </div>' +
					'               <div class="go_back">返回前一页</div>' +
					'           </div>' +
					'        </div>' +
					'</div>';
			},
			//认证完成 第二次认证成功时的提示
			last: function () {
				return ' <div class="pop-up auth">' +
					'        <div class="login">' +
					'           <div class="login_content" style="width:490px">' +
					'               <div class="auth_suc"><img src="//modules.allinmd.cn/auth/images/rz_suc.png"></div>' +
					'               <div class="auth_lh">恭喜你，提交成功</div>' +
					'               <div class="auth_tishi auth_suc_tishi"><span class="auth_suc_name"></span>老师，你的认证资料我们已经收到！审核通常需要1~3个工作日，请耐心等待。审核通过后，我们会以手机或邮件的方式通知你，再次感谢你对唯医的支持！<div>在审核期间，你可以享有浏览3分钟视频的特有权限哦~</div></div>' +
					'               <div class="login_but"><div class="v2-blue-btn"><a href="/">进入首页</a></div></div>' +
					'           </div>' +
					'        </div>' +
					'</div>';
			},
			//认证完成 第一次认证成功时的提示
			renzhengSuccess: function () {         // 认证拒绝
				return ' <div class="pop_up sh_pop">' +
					'        <div class="sh_title">' +
					'            <div class="sh_t_l">审核</div>' +
					'            <div class="sh_t_r"><img src="//modules.allinmd.cn/user/images/close_icon.png"/></div>' +
					'            <div class="clear"></div>' +
					'        </div>' +
					'        <div class="sh_con">' +
					'            <div class="sh_c_t">提交成功</div>' +
					'            <div class="sh_c_c">' +
					'               <p><span class="auth_suc_name"></span>老师，你的认证资料我们已经收到！审核通常需要1~3个工作日，请耐心等待。审核通过后，我们会以手机或邮件的方式通知你，再次感谢你对唯医的支持！</p>' +
					'               <p>在审核期间，你可以享有浏览3分钟视频的特有权限哦~</p>' +
					'            </div>' +
					'            <div class="sh_c_b">' +
					'                <div class="sh_re_btn" id="cancel">知道了</div>' +
					'            </div>' +
					'        </div>' +
					'    </div>';
			},
			weixinError: function () {
				return '<div class="weixin_border_jt"></div>' +
					'<div class="weixin_border_t"></div>' +
					'<div class="weixin_border_c">' +
					'<div class="weixin_border_c_text">' +
					'<div class="weixin_border_c_text_t">opps，没有绑定成功哦！</div>' +
					'<div class="weixin_border_c_text_c">您的此微信号已经绑定过其他唯医帐号</div>' +
					'<div class="weixin_border_c_text_b"><span class="ev-countdown">3</span>秒后自动关闭</div>' +
					'</div>' +
					'</div>' +
					'<div class="weixin_border_b"></div>';
			}
		},

		//获取当前登录用户信息
		getCustomerUnite: function () {
			var t = this;
			this.unite = {};
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
		//创建弹层所需DOM结构
		showContainer: function () {
			var t = this;
			if ($(".LightBox-container").length === 0) {
				$("<div class='LightBox-right-top  module-user'>" +
					"<div class='LightBox-close'></div>" +
					"<div class='LightBox-btns'></div>" +
					"</div>" +
					"<div class='LightBox-container module-user'></div>" +
					"<div class='auth_bottom' style='display:none;'>" +
					"<div class='auth_b_po'>" +
					"<ul>" +
					"<li class='active'></li>" +
					"<li></li>" +
					"<li></li>" +
					"<div class='clear'></div>" +
					"</ul>" +
					"</div>" +
					"<div class='auth_b_link'>" +
					"<span>欧应科技©2014</span><span>友情链接</span><span>网站地图</span><span>京ICP备10217266号</span><span>京公网安备11010502023174号</span>" +
					"</div>" +
					"</div>"
				).appendTo(t.$body);

				if (comm.LightBox.count > 0) {
					comm.LightBox.count++;
					comm.LightBox.zIndexUp();
					$("#lightbox").css({"opacity": "0.97", "background": "#EFEFF4"});
				} else {
					comm.LightBox.show(97, "#EFEFF4");
				}
				if (comm.LightBox.getZIndex() <= 12) {
					comm.LightBox.setZIndex(13);
				}
			}
			t.$container = $(".LightBox-container").css({
				zIndex: comm.LightBox.getZIndex() + 1,
				position: "absolute"
			});
			t.$window = $(window);
			t.$rightTop = $(".LightBox-right-top");
			if ("close" in t.options && t.options.close == "empty") {  //
				t.$rightTop.find(".LightBox-close").css("visibility", "hidden");
			} else {
				t.$rightTop.find(".LightBox-close").off('click').on('click', function () {
					t.cancelAuth();
					//事件埋点
					comm.creatEvent({
						triggerType:"全站功能按钮点击",
						keyword:"认证弹层关闭",
						browType: t.browType,
						actionId:43
					});
				});
			}
			t.setTopRight();

			$('select, object, embed').css({
				visibility: "hidden"
			});
		},
		setTopRight: function () {
			var t = this;
			t.$rightTop.css({
				top: '0px',
				right: '0px',
				position: 'fixed',
				zIndex: 108
			});
		},
		// 载入页面
		loadHtml: function (htmlUrl, callback, options) {
			var t = this;

			document.body.style.overflow = "hidden";

			if (options && options.popType && options.popType == "error") {
				t.showErrorContiner();
			} else {
				t.showContainer();
			}

			t.isSubmitting = false;
			t.$container.html(t.template[htmlUrl]());
			t.form = t.$container.find("form");
			if (t.form.length === 0) {
				t.form = null;
			} else {
				if (!t.isBindKeyCode) {
					t.isBindKeyCode = true;
					t.enableKeyboard();
				}
			}
			var pop = t.$container.find(".pop-up").css({
				"margin": "0 auto",
				"width": t.$container.find(".pop-up>div").width()
			});
			pop.on("click", function (e) {
				comm.stopBubble(e);
			});
			callback && callback();
			comm.setCenter(t.$container);


			t.$container.find("input[placeholder], textarea[placeholder]")
				.placeholder();	// 表单默认值 插件
			t.$body.css("overflow", "hidden");
			$(window).bind("resize", function resizeHandler() {
				comm.setCenter(t.$container);
			});
		},
		enableKeyboard: function () {
			$(document).on('keyup.keyboard', $.proxy(this.keyboardAction, this));
		},
		//键盘操作
		keyboardAction: function (event) {
			var t = this;
			var KEYCODE_ESC = 27;
			var KEYCODE_ENTER = 13;
			var keycode = event.keyCode;
			var key = String.fromCharCode(keycode).toLowerCase();
			if (keycode === KEYCODE_ESC) {              //  || key.match(/x|o|c/   // 关闭
				//t.end();
			}
			if (keycode === KEYCODE_ENTER) {             // 提交
				if (t.form != null) {
					t.form.submit();
				}
			}
		},
		//禁用键盘事件
		disableKeyboard: function () {
			$(document).off('.keyboard');
		},
		bindActiveInput: function () {
			var t = this;
			t.$container.find('input').on("focus", function () {
				$(this).parent().addClass("hover");
			});
			t.$container.find('input').on("blur", function () {
				$(this).parent().removeClass("hover");
			});
		},
		//关闭
		end: function () {
			var t = this;
			if (comm.LightBox.count > 1) {
				comm.LightBox.count--;
				comm.LightBox.zIndexDown();
				$("#lightbox").css({"opacity": "0.7", "background": "#000"});
			} else {
				comm.LightBox.hide();
			}
			$('select, object, embed').css({
				visibility: "visible"
			});
			if (t.$container != null) {
				t.$container.remove();
			}
			if (t.$rightTop != null) {
				t.$rightTop.remove();
			}
			t.disableKeyboard();
			t.isRunning = false;
			document.body.style.overflow = "auto";
			if (t.options.isGuide && t.isRenZhengStatus == false) {
				$(".mask_body").show();
			}
			$(window).unbind("resize", function resizeHandler() {
				comm.setCenter(t.$container);
			});
		},
		//底部按钮的切换
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
		//form提交之前验证
		validateBeforeRenZhengSubmit: function () {
			var t = this;
			var flag = true;
			var medical = $(".medicalShow .tagName");
			var area = $(".proFieldshow .tagName");
			var unitEm=$(".rz-num-type div");//单位
			var areasExpertise = "";
			var medicalTitle = "";
			var unitType="";
			$.each(medical, function (i, em) {
				medicalTitle += $(em).attr("medicalid") + '_' + $(em).text() + ',';
			});

			$.each(area, function (i, em) {
				areasExpertise += $(em).attr("tagid") + '_' + $(em).text() + ',';
			});
			//单位（在学校，在医院）//修改
			$.each(unitEm,function(i,em){
				if($(em).hasClass("on")){
					unitType=$(em).attr("value");
				}
			});
			var firstMedical=false;
			$.each($(".medical_list_li"),function(i,em){
				if(i<6){
					if($(em).attr("select-status")=="true"){
						firstMedical=true;
						return ;
					}
				}
			});
			if (medicalTitle) {
				validateHideErr(t.$container.find(".medical_error"));
			}
			if (areasExpertise) {
				validateHideErr(t.$container.find(".area_error"));
			}
			if (unitType) {
				validateHideErr(t.$container.find(".unit_error"));
			}
			if (!medicalTitle||!firstMedical) {
				validateShowErr(t.$container.find(".medical_error"), "<label>请选择职称</label>");
				flag = false;
			}
			if (!areasExpertise) {
				validateShowErr(t.$container.find(".area_error"), "<label>请选择专业</label>");
				flag = false;
			}
			if (!unitType) {
				validateShowErr(t.$container.find(".unit_error"), "<label>请选择单位</label>");
				flag = false;
			}
			return {
				flag: flag,
				medicalTitle: medicalTitle,
				areasExpertise: areasExpertise,
				unitType:unitType
			};
		},

		uploadLogo: function (picpath) {
			var t = this;
			if ($("#logo_upload [id^=czyx]").length > 0) {
				$("#logo_upload").html('<input id="auth_logo_input" type="file" name="file">');
			}
			czyx.uploadReplace('#auth_logo_input', {
				url: "/call/comm/upload_attachment/upload/?_=" + Math.random(), //文件处理的URL,
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
								url: "/call/commdata/saveLogoUrl/",
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
										logoUrl: uploadResult.path
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
		medicalTitle: function () {
			this.getmedData($("#medical_title"));
		},
		getmedData: function ($this) {
			var t = this;
			$.ajax({
				type: "post",
				url: t.path.medical,
				data:{paramJson: $.toJSON({pageIndex:1,pageSize:100})},
				async: false,
				dataType: "json",
				success: function (rep) {
					if (rep) {
						var html = "";
						$.each(rep, function (i, val) {
							//修改
							if(i>1){
								html += "<li style='display: none;'><ul class='p_l_zc_xl_li'></ul></li>";
							}else{
								html += "<li><ul class='p_l_zc_xl_li'></ul></li>";
							}

						});
						$this.find(".medical_con_list").html(html);

						$.each($this.find(".medical_con_list ul"), function (i, em) {
							var html2 = "";
							$.each(rep[i + 1], function (i, val) {
								html2 += "<li class='medical_list_li' select-status='false' medicalid='" + val.id + "'>" + val.medicalTitle + "</li>";
							});
							//修改
							if(i==0){
								html2 += "<li class='medical_list_li' select-status='false' medicalid='0'>其它</li>";
							}

							html2 += "<div class='clear'></div>";
							$this.find(".medical_con_list ul").eq(i).append(html2);
						});
						t.mouse($this);
						t.listAction($this);
					}
				}
			});
		},
		mouse: function ($this) {
			$this.on("mouseover", function () {
				if($(window).height()<=768){
					$this.find(".p_l_zc_xl").css({"top": -$this.find(".p_l_zc_xl").outerHeight(),"bottom":''});
				}else{
					$this.find(".p_l_zc_xl").css({"bottom":-$this.find(".p_l_zc_xl").outerHeight(),"top":''});
				}
				$this.find(".p_l_zc_xl").show();

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
							//修改
							if($(this).attr("medicalid")!=0){
								$("li", $(em)).attr("select-status", "false");
								$("li", $(em)).removeClass("active");
								$(this).addClass("active");
							}
							$(this).attr("select-status", "true");
							if($(this).attr("medicalid")==0||$(this).attr("medicalid")==3||$(this).attr("medicalid")==4){
								$(this).parents("li").nextAll().show();
							}else{
								if(i==0){
									$(this).parents("li").nextAll().hide();
									$(this).parents("li").nextAll().find("li").removeClass("active");
									$(this).parents("li").nextAll().find("li").attr("select-status", "false");
									//$this.find(".p_l_zc_xl").css("bottom", -$this.find(".p_l_zc_xl").outerHeight());
									if($(window).height()<=768){
										$this.find(".p_l_zc_xl").css({"top": -$this.find(".p_l_zc_xl").outerHeight(),"bottom":''});
									}else{
										$this.find(".p_l_zc_xl").css({"bottom":-$this.find(".p_l_zc_xl").outerHeight(),"top":''});
									}
								}

							}
						} else {
							$(this).removeClass("active");
							$(this).attr("select-status", "false");
							//修改
							if($(this).attr("medicalid")==0||$(this).attr("medicalid")==3||$(this).attr("medicalid")==4){
								$(this).parents("li").nextAll().hide();
								$(this).parents("li").nextAll("li").find("li").removeClass("active");
								$(this).parents("li").nextAll("li").find("li").attr("select-status", "false");
								//$this.find(".p_l_zc_xl").css("bottom", -$this.find(".p_l_zc_xl").outerHeight());
								if($(window).height()<=768){
									$this.find(".p_l_zc_xl").css({"top": -$this.find(".p_l_zc_xl").outerHeight(),"bottom":''});
								}else{
									$this.find(".p_l_zc_xl").css({"bottom":-$this.find(".p_l_zc_xl").outerHeight(),"top":''});
								}
							}
						}
						$(".medical_con_list ul li", $this).each(function (n, val) {
							//修改
							if ($(val).attr("select-status") == "true"&&$(val).attr("medicalid")>0) {
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
		//职称初始化
		medicalInit: function () {
			var t = this;
			var medical = "";
			var medical1 = "";
			if (t.customerAuth!=null && t.customerAuth.medicalTitle != undefined) {
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
						//修改
						if(val.id==3||val.id==4){
							$(".medical_con_list li:gt(0)").show();
						}
					});
				});
			}

			t.clear($(".medicalShow"));
		},
		//tag
		getTag: function () {
			var t = this;
			$.ajax({
				type: "post",
				url: t.path.dataTag,
				async: false,
				data: {paramJson: $.toJSON({ pageIndex: 1, pageSize: 50, treeLevel: '2', platformId:t.department})},
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
		},
		//专业领域初始化
		areaInit: function () {
			var t = this;
			var area = t.customerAuth!=null ? t.customerAuth.areasExpertise:"";
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

		//上传证件照片
		uploadAtt: function (picpath) {
			var t = this;
			if ($("#cer_upload [id^=czyx]").length > 0) {
				$("#cer_upload").html('<input id="cer_po_input" type="file" name="file">');
			}
			czyx.uploadReplace('#cer_po_input', {
				url: "/call/comm/upload_attachment/upload/?_=" + Math.random(), //文件处理的URL,
				data: {paramJson: $.toJSON({imageType: "2", domain: location.hostname})},
				uploadReplaceCss: {
					//设置上传按钮图片
					background: 'url(' + picpath + ') center no-repeat',
					backgroundSize: '100%',
					width: "315",             //上传按钮的宽度
					height: "135"             //上传按钮的高度
				},
				uploadInputCss: {
					width: "315",             //上传按钮的宽度
					height: "135",             //上传按钮的高度
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
							$("#certificatesPath").val(serverJson.responseObject.responseMessage.url);
							// $(".photo_error").hide().parents(".inputParent").find(".input-border").removeClass("input-error");
							t.uploadAtt(serverJson.responseObject.responseMessage.url);
							t.addMask();
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
		addMask: function () {
			$("#cer_po_input").parent().append('<img id="pic_mask" src="//modules.allinmd.cn/auth/images/sc_zp_hov.png" />');
			$("#cer_po_input").parent().bind("mouseover", function () {
				$("#pic_mask").show();
			}).bind("mouseout", function () {
				$("#pic_mask").hide();
			});
		},
		//三证的动态加载
		loadCertificate: function () {
			var param = {roleId: 6, typeId: 1};
			$.ajax({
				type: 'POST',
				url: "/call/comm/data/roleconfig/getDataRoleConfigs/",
				data: {paramJson: $.toJSON(param)},
				async: false,
				dataType: "json",
				timeout: 10000,
				success: function callback(rep) {
					var html = "";
					if (rep && rep.responseObject && rep.responseObject.responseStatus) {
						var data = rep.responseObject.responseMessage;
						if (data && data.length > 1) {
							$.each(data, function (index, i) {
								if(i.refId != 1&&i.refId != 13){//新加的身份证、职称证不显示
									if (i.refId == 10) {
										html += '<div class="doctor_radio03" value="' + i.refId + '">' + i.refValue + '</div>';
									} else {
										html += '<div class="doctor_radio03" value="' + i.refId + '">' + i.refValue + '</div>';
									}
								}

							});
						}
					}
					html += '<p class="clear"></p>';
					var rzNumType = $(".rz-num-type");
					rzNumType.html(html);
					if($("div",rzNumType).eq(0).attr("class")=="doctor_radio03"){
						$(".rz_input").hide();
					}
					$("#certificate").val(10);
					rzNumType.find("[value=10]").addClass("on");
					rzNumType.find(":last").addClass("last");
					rzNumType.find("div").on("click", function () {
						$(this).addClass("on").siblings().removeClass("on");
						$("#certificate").val($(this).attr("value"));
						if($(this).attr("value")==10){//工作证时不让填写证件号
							$(".rz_input").hide();
						}else{
							$(".rz_input").show();
						}
					});
				}
			});
		},
		//证件上传和微信的切换
		attChangeWx: function () {
			var t = this;
			$(".cer_sc").on("click", function () {//证件上传
				$(this).addClass("cer_sc_active");
				$(".wx_sc").removeClass("cer_sc_active");
				$(".cer_sc_con").show();
				$(".wx_sc_con").hide();
				$(".weixin_error").hide();
				$(".weixin_right").hide();
				$("#photoUptype").val(1);
				t.stopCheckingWxStatus();
			});
			$(".wx_sc").on("click", function () {//微信提交
				$(this).addClass("cer_sc_active");
				$(".cer_sc").removeClass("cer_sc_active");
				$(".cer_sc_con").hide();
				$(".wx_sc_con").show();
				$("#photoUptype").val(2);
				$(".photo_error").hide();
				// 生成微信
				module.welcomeAuth({size: 100});
				t.startCheckingWxStatus();
			})
		},
		/**
		 * 获取微信扫描状态   侦听扫码返回状态
		 * */
		getWxStatus: function () {
			var t = this;
			var result = module.weixinAuth();
			var secondSuccess = false;
			if (result == true) {
				t.stopCheckingWxStatus();
				$(".weixin_error").hide();
				$(".weixin_right").html("<img src='//modules.allinmd.cn/user/images/ok.png' width='17' height='17'><span><label>扫描成功！</label>请到微信提交认证信息</span>").show()
			} else {
				if (result == 4) {
					$(".weixin_error").html("<img src='//modules.allinmd.cn/auth/images/zt_sb.png'>" +
						"<span><label>你的唯医号已绑定过其它微信号。</label>（请更换微信 或 登录该账户解绑后操作）</span>").show();
				}
				if (result == 2) {
					$(".weixin_error").html("<img src='//modules.allinmd.cn/auth/images/zt_sb.png'>" +
						"<span><label>该微信号已被其他人账户绑定</label>（请更换微信 或 登录该账户解绑后操作）</span>").show();
				}
				window.timeoutWx = setTimeout(function () {
					t.getWxStatus();
				}, 3000);
			}
		},
		startCheckingWxStatus: function () {
			this.getWxStatus();
		},
		stopCheckingWxStatus: function () {
			if (window.timeoutWx != null) {
				clearTimeout(window.timeoutWx);
				window.timeoutWx = null;
			}
		},
		//获取认证信息
		getCustomerAuthInfo: function () {
			var t = this;
			//comm.LightBox.showloading();
			if(t.options.authInfoData){
				var data=t.options.authInfoData;
				if (data && data.responseObject) {

					var rspObj = data.responseObject;
					t.customerAuth = rspObj;
					t.name = rspObj.certificatesCode;//姓名
				}
			}else{
				$.ajax({
					url: t.path.getCustomerAuthInfo,
					dataType: "json",
					type: "post",
					async: false,
					success: function (data) {
						if (data && data.responseObject) {
							/*	if (data.state != 1 && data.state != 2) { //data === null || data == "" || data.responseObject === undefined 旧情况会出现data为null
							 t.customerAuth = {};
							 } else {*/
							var rspObj = data.responseObject;
							t.customerAuth = rspObj;
							t.name = rspObj.certificatesCode;//姓名
						}
						/*	}*/

					}
				});
			}

		},
		//判断认证
		checkAuth: function () {
			var t = this;
			//comm.LightBox.showloading();
			if (t.customerAuth && !$.isEmptyObject(t.customerAuth)) {//有认证的信息
				var cAuth = t.customerAuth;
				// -    1-无认证信息、0-二次提交认证、1-认证通过、2-运营确认、3-认证拒绝
				if (cAuth.customerId <= 0 || cAuth.state === 3 || cAuth.state === 0) {
					// 未申请  || 被拒绝
					//alert("您的认证申请正在审核中。无法进行相关操作");
					if (cAuth.state == 3) {        // 拒绝
						//直接进入第二步
						t.firstAuthStep();
					} else if (cAuth.state == 0) {        // 审核中

					} else {
						//姓名，年龄，医院，学校，职称，专业是否有
						if ((!cAuth.company && !cAuth.medicalTitle) || !cAuth.areasExpertise || !cAuth.schoolName) {           //!cAuth.certificatesCode || !cAuth.certificatesPath
							//进入第二步
							t.secondAuthStep();
						} else {
							//进入第三步
							t.thirdAuthStep();
						}
					}

				} else if (cAuth.state === 1 || cAuth.state === 2) {
					//认证已经通过，此时不允许再次认证
					if ((!cAuth.company && !cAuth.areasExpertise) || !cAuth.medicalTitle || !cAuth.schoolName) {
						//认证已经通过，但资料未完善。

					} else {
						//认证已经通过，且资料都完善。
                        g_sps.jump(null,"/");
						t.isRenZhengStatus = true;
						t.end();
						//t.privCheckSuccess();
					}

				} else if (cAuth.state === 0) {
					//已经提交申请 未审核 ，此时不允许再次认证
					//alert("你已经提交过认证，不能重复认证")
					t.end();
				} else if (cAuth.state === -1) {
					/*if ((cAuth.company||cAuth.schoolName) && cAuth.medicalTitle && cAuth.areasExpertise) {
						//进入第三步
						t.thirdAuthStep();
					} else {*/
					    //进入第一步
						t.firstAuthStep();
					//}

				}
			} else {//无认证信息
				//直接进入第一步
				t.firstAuthStep();
			}
		},
		//第二步提交
		secondSubmit: function () {
			var t = this;
			t.bindActiveInput();
			var form = t.$container.find("form");
			// 较验
			form.validate({
				submitHandler: function () {
					var param;
					// 判断图片是否保存成功
					var validReslut = t.validateBeforeRenZhengSubmit();
					var company="";var companyId="";var schoolName="";var schoolId="";
					//var company = $("#company").val();//在个人中心还有个#company，报错
					if(validReslut.unitType==1){//医院
						company = $('input[name=company]').val();
						companyId =  $('input[name=company]').attr("companyId");
					}else{//学校
						schoolName=$('input[name=schoolName]').val();
						schoolId=$('input[name=schoolName]').attr("schoolId");
					}
					if (validReslut.flag) {
						param = {
							opflag: 1,
							name: t.$container.find("input[name=name]").val(),
							age: t.$container.find("input[name=age]").val(),
							company: company,
							companyId: companyId,
							schoolName:schoolName,
							schoolId:schoolId,
							platformId: t.department,
							medicalTitle: validReslut.medicalTitle.substring(0, validReslut.medicalTitle.length - 1),
							areasExpertise: validReslut.areasExpertise.substring(0, validReslut.areasExpertise.length - 1)
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
									comm.authInfo=null;//TODO lichunhui add
									t.name = t.$container.find("input[name=name]").val();
									t.end();
									t.thirdAuthStep();
								} else {
									if (data.responseObject.responseMessage) {
										alert(data.responseObject.responseMessage);
									} else {
										alert("提交认证失败，请稍后重试");
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
						"rangelength": [1, 50],
						"isChinese": true
					},
					"age": {
						"required": true,
						"max": 120,
						"min": 20,
						"number": true
					},
					"company": {
						"required": true,
						"rangelength": [1, 200]
					},
					"schoolName": {
						"required": true,
						"rangelength": [1, 200]
					}
				},
				messages: {
					"name": {
						"required": "您的姓名？",
						"rangelength": "您的姓名过长？",
						"isChinese": "您的姓名？"
					},
					"age": {
						"required": "20-120",
						"max": "20-120",
						"min": "20-120",
						"number": "20-120"
					},
					"company": {
						"required": "请填写医院名称。",
						"rangelength": "医院最大长度200个字符"
					},
					"schoolName": {
						"required": "请填写学校名称。",
						"rangelength": "学校最大长度200个字符"
					}
				},
				errorPlacement: function (error, element) {
					validateShowErr(element, error);
				},
				success: function (element) {
					validateHideErr(element);
				},
				onkeyup: false
			});
			// 提交
			t.$container.find(".submit_but").on("click", function () {
				t.validateBeforeRenZhengSubmit();
				form.submit();
				//事件埋点
				comm.creatEvent({
					triggerType:"认证",
					keyword:"提交",
					browType: t.browType,
					actionId:30
				});
			});
		},
		//第三步提交
		thirdSubmit: function () {
			var t = this;
			t.bindActiveInput();
			var form = t.$container.find("form");
			// 较验
			form.validate({
				submitHandler: function () {
					var param;
					var flag = true;
					// 判断图片是否保存成功
					if ($("#photoUptype").val() == 1) {//当选择上传时
						var certificatesPath = t.$container.find("#certificatesPath");
						if (certificatesPath.val() !== "") {
							t.$container.find(".photo_error").hide();
						} else {
							t.$container.find(".photo_error").show().html("<img src='//modules.allinmd.cn/user/images/jinggao2.png' alt=''/><span><label>请上传证件照</label></span>");
							flag = false;
						}
					}
					//证件类型
					var attType = $("#certificate").val();
					if (flag) {
						param = {
							opflag: 2,
							attType: attType,
							attPath: $("#photoUptype").val() == 1 ? t.$container.find("input[name=certificatesPath]").val() : '',
							attCode: t.$container.find("input[name=attCode]").val(),
							platformId: t.department
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
								// TODO: 认证成功后应当作何处理
								comm.LightBox.hideloading();
								if (data.responseObject.responseStatus) {
									comm.authInfo=null;//TODO lichunhui add
									if (data.responseObject.responseData.state == 0) { // 二次审核时才需要显示认证审核中提示信息。
										t.lastAuthStep(1);
									} else {
										// 首次默认提交成功
										t.end();
										$('#sesAuth').val(data.responseObject.responseData.state);//修改页面中认证的值
										t.options && t.options.callback && t.options.callback();
									}
								} else {
									if (data.responseObject.responseMessage) {
										alert(data.responseObject.responseMessage);
									} else {
										alert("提交认证失败，请稍后重试");
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
					"attCode": {
						//"required": true,
						"rangelength": [1, 50],
						"chrnumNew": true
					}
				},
				messages: {
					"attCode": {
						//"required": "请填写正确的证件号码。",
						"rangelength": "请填写正确的证件号码。",
						"chrnumNew": "请填写正确的证件号码。"
					}
				},
				errorPlacement: function (error, element) {
					validateShowErr(element, error);
				},
				success: function (element) {
					validateHideErr(element);
				},
				onkeyup: false
			});
			// 提交
			t.$container.find(".submit_but").on("click", function () {
				if ($(".wx_sc").hasClass("cer_sc_active")) {    // 微信认证
					controller.getCustomerAuthInfo();              // 检查认证状态
					if (t.customerAuth.state == 1) {  // 认证成功。
						t.end();
						t.options && t.options.callback && t.options.callback();
					} else {
						controller.cancelAuth();    // 若未认证成功，则取消认证
					}
				} else {                            // 普通认证提交
					form.submit();
				}
				//事件埋点
				comm.creatEvent({
					triggerType:"认证",
					keyword:"提交",
					browType: t.browType,
					actionId:30
				});
			});
		},
		//认证第一步
		firstAuthStep: function () {
			var t = this;
			this.loadHtml("first", function () {
				//t.pointerChange(1);
				comm.LightBox.show(30, "#0A1E2B");
				$(".ev-chooseDepartment").on("click", function () {//进入第二步
					//if(t.options.scene == privilegeSceneConst.eSceneTypeReAuth){       // 重新认证的话，直接去第二步。
					var platformType=TempCache.getItem("platformType");
					if(platformType==1){//唯医
						t.department= $(this).data('dept');
						t.secondAuthStep();
						if(t.department==1){//骨科
							//事件埋点
							comm.creatEvent({
								triggerType:"认证",
								keyword:"骨科",
								actionId:27
							});
						}else{
							//事件埋点
							comm.creatEvent({
								triggerType:"认证",
								keyword:"手外科",
								actionId:28
							});
						}
					}else{
						var content="";
						if(platformType==2){//医栈
							content="该通行证注册于医栈请前往医栈认证";
						}else{
							content="该通行证注册于医鼎请前往医鼎认证";
						}
						t.isRunning = false;
						$(".LightBox-right-top").remove();
						$(".LightBox-container").remove();
						comm.alertBox({
							"content":content,
							"ensure":"知道了"
						})
					}

					//}else{
					//	t.checkAuth();
					//}
				});
				$(".no_auth").on("click", function () {//暂不认证
					t.cancelAuth();
					//事件埋点
					comm.creatEvent({
						triggerType:"认证",
						keyword:"暂不认证",
						actionId:26
					});
				});
			});
		},

		/**
		 * 取消认证  暂不认证
		 * */
		cancelAuth: function () {
			var t = this;
			if (typeof t.options.onAuthCancel != "undefined" && t.options.onAuthCancel == "back") {
				/**
				 * 2016-5-3 liuyutao from biwenjuan
				 * 若有来源页，点击暂不
				 * */
				if (document.referrer != "" && document.referrer != window.location.href && document.referrer.indexOf("search") < 0) {
					// 有来源     并且与本页面不相同。避免刷新时，来源页与当前页地址相同。
					// 并且不是搜索页， 我们不跳回搜索页。
					window.location.href = document.referrer;
				} else {                          // 无来源
					if (typeof t.options.privCheckFailed != "undefined") { // 若有关闭后应跳转的页
						t.options.privCheckFailed();
					} else {                      // 若无则跳回首页
                        g_sps.jump(null,"/"); //
					}
				}
			} else {    // “stay” 关闭弹层，留在当前页。
				t.end();
				if(typeof t.options.onAuthCancel=='function'){
					t.options.onAuthCancel();
				}
			}
			t.options.indexRegisterAuthcancel&&t.options.indexRegisterAuthcancel();//首页暂不认证
		},
		//认证第二步
		secondAuthStep: function () {
			var t = this;
			t.browType = 69;
			comm.LightBox.hideloading();
			$("#lightbox").css({"opacity": "0.97", "background": "#EFEFF4"});
			//comm.Log.createBrowse({href:location.href,id:69,name:'认证第一步-身份认证',platform: $('#sesDepartment').val()});
			this.loadHtml("second", function () {
				var logo = "//modules.allinmd.cn/auth/images/a_logo_def.png";
				var params = {};
				var data = {};
				var userData = {};
				data.logoUseFlag = UseFlag.c;
				data.refId = t.customerAuth.customerId;
				params.paramJson = $.toJSON(data);
				$.ajax({
					type: 'POST',
					url: t.path.getLogo,
					data: params,
					//async: false,
					dataType: 'json',
					success: function (rep) {
						if (rep && rep.responseObject) {
							urlData = rep.responseObject;
						}
						if (urlData && urlData.length > 0) {
							var portraitUrl1 = urlData[0].logoUrl;
							logo = portraitUrl1 ? portraitUrl1 : "//modules.allinmd.cn/auth/images/a_logo_def.png";
						}
						t.uploadLogo(logo);
					}
				});
				//lichunhui 修改 单位修改为选择
				$(".rz-num-type").find("div").on("click",function(){
					var index=$(this).index();
					$(this).addClass("on").siblings().removeClass("on");
					$(".onUnit").hide();
					$(".onUnit").eq(index).show();
				});
				$("#company").lenovo({
					url: "/call/commdata/getHospitalList/",
					width: 340,
					showName: "hospitalName", //显示出的值
					id:"id",   //自定义属性值
					hiddenId:"companyId"    //自定义属性
				});
				//学校名称的选择   修改
				$("#schoolName").lenovo({
					url: t.path.university,
					width:340,
					showName:"schoolName",
					id:"schoolId",//自定义属性值
					hiddenId:"universityId"//自定义属性
				});
				if(t.customerAuth!=null){
					$("input[name=name]").val(t.customerAuth.lastName+t.customerAuth.firstName);
					$("input[name=age]").val(t.customerAuth.age);
					$("input[name=company]").val(t.customerAuth.company);
					$("input[name=company]").attr("companyId",t.customerAuth.companyId);
					//修改
					$("input[name=schoolName]").val(t.customerAuth.schoolName);
					$("input[name=schoolName]").attr("companyId",t.customerAuth.schoolId);
					if(t.customerAuth.company){
						$(".rz-num-type").find("div").eq(0).click();
					}else if(t.customerAuth.schoolName){
						$(".rz-num-type").find("div").eq(1).click();
					}
				}


				t.pointerChange(2);

				t.medicalTitle();
				t.getTag();
				t.medicalInit();
				//t.areaInit();
				t.secondSubmit();
			});
		},
		//认证第三步
		thirdAuthStep: function () {
			var t = this;
			t.browType = 70;
			comm.LightBox.hideloading();
			$("#lightbox").css({"opacity": "0.97", "background": "#EFEFF4"});
			this.loadHtml("third", function () {

				t.pointerChange(3);
				t.loadCertificate();
				t.uploadAtt("//modules.allinmd.cn/auth/images/sc_zp.png");
				t.attChangeWx();
				t.thirdSubmit();
				$(".other_auth").on("click", function () {
					comm.authInfo=null;//TODO lichunhui add
					t.otherAuthStep();
				})
			});
		},
		//其它认证
		otherAuthStep: function () {
			var t = this;
			comm.LightBox.hideloading();
			this.loadHtml("otherThird", function () {
				var on = true;
				t.bindActiveInput();
				$(".go_back").on("click", function () {
					t.thirdAuthStep();
				});
				$("#otherThird_btn").on("click", function () {//完成认证
					if (on == true) {
						var $InvCode = $("#InvCode");
						if (!/^[A-Za-z0-9]+$/.test($InvCode.val())) {//只能输入数字和英文
							validateShowErr($InvCode, "<label>请输入正确的邀请码！</label>");
						} else {
							on = false;
							validateHideErr($InvCode);
							$.ajax({
								type: "post",
								url: t.path.otherAuth,
								data: {
									paramJson: $.toJSON({
										identifyCode: $InvCode.val(),
										dataFlag: 2
									})
								},
								dataType: "json",
								success: function (rep) {
									if (rep.responseObject.responseStatus) {
										if (rep.responseObject.responseData.state == 0) { // 二次审核时才需要显示认证审核中提示信息。
											t.lastAuthStep(1);
										} else {
											// 首次默认提交成功
											t.end();
											t.options && t.options.callback && t.options.callback();
										}
									} else {
										on = true;
										if (rep.responseObject.responseMessage) {
											validateShowErr($InvCode, "<label>" + rep.responseObject.responseMessage + "</label>");
										} else {
											validateShowErr($InvCode, "<label>提交认证失败，请稍后重试</label>");
										}
									}
								},
								error: function () {
								}
							});
						}
					}
				})
			})
		},
		//认证成功
		lastAuthStep: function (authState) {
			var t = this;

			this.loadHtml("last", function () {
				t.pointerChange(0);
				$(".auth_suc_name").text(t.name);
				t.$container.find("#cancel").on("click", function () {
					t.cancelAuth();
				});
				comm.authInfo=null;
				comm.getHeaderLogin();
			}, {popType: "error"});
		},


		//创建错误提示弹层所需DOM结构
		showErrorContiner: function () {
			var t = this;
			if ($(".LightBox-container").length === 0) {
				$("<div class='LightBox-container module-user'></div>").appendTo(t.$body);
				if (comm.LightBox.count > 0) {
					comm.LightBox.count++;
					comm.LightBox.zIndexUp();
					$("#lightbox").css({"opacity": "0.7", "background": "#000000"});
				} else {
					comm.LightBox.show(70, "#000000");
				}

				t.$container = $(".LightBox-container").css({
					zIndex: comm.LightBox.getZIndex() + 1,
					position: "absolute"
				});
				t.$window = $(window);
			}

			$('select, object, embed').css({
				visibility: "hidden"
			});
		},
		//认证主方法
		authStep: function (options) {
			var t = this;
			t.$body = $("body");
			if (t.isRunning) {
				return;
			} else {
				t.isRunning = true;
			}
			//this.getCustomerUnite();  //TODO:lichunhui update 优化暂不请求此接口
			this.getCustomerAuthInfo();
			this.checkAuth();
		}
	};


	return {
		/**
		 *  auth.showAuthPage({
		 *                 	onAuthCancel:"back",  // 这个参数针对暂不认证按钮， 看是否是关闭当前弹层， 或是返回上一页。
		 *                   privCheckFailed: function () {  // 本参数只有在上面参数为 back时才有效。 看应该返回到哪一页，避免返回到 联合登录页， 或是微信绑定登录注册页。 或是搜索页。
		 *				window.location.href = "/"
		 *			}
		 *         });
		 * */
		showAuthPage: function (options) {
			controller.$body = $("body");
			controller.options = $.extend({
				callback: function () {
					if (options && options.callback) {
						options.callback();
					} else {
                        g_sps.jump(null,"/");
					}
				}
			}, options);
			controller.authStep();
		},
		getCustomerAuthInfo: function () {
			return controller.isRenZhengStatus;
		},
		getUserInfo: function () {
			return controller.userInfo;
		}
	};
};

auth = null;
var auth = module.auth();