/**
 * 功能描述： 用户权限控制模块
 * 使用方法:  开放两个方法 user.login() user.logout();
 *                1.   user.login({
 *                          callback:function(){},  // 登录后的回调
 *                          scene:"25",  // 场景，可以使用公共常量设置，privilegeSceneConst
 *                          close:"empty" // optional 可选，带上这个参数，页面不显示右上角关闭按钮
 *                          onLoginClose:function(){} 当点击登录界面的关闭按钮时  若存在此属性，则执行，若不存在，则无响应，仅关闭弹窗
 *                          onAuthCancel:{String}  {Optional}, 可选参数，可选值 “stay”|"back" 不传参的话，默认为"back" 以处理当用户
 *                          stay:true,  证二期需要对state为1  V1待审核 点击知道了需要留在当前页
 *                          noAuthTip:1, //是否需要认证提示弹层
 *                          noAuthResult:1 //是否需要弹出认证拒绝提示弹窗
 *                      });
 *
 *                 2.  user.logout(
 *                   function(){}    // 退出后的回调
 *                   );
 * 注意事件：
 * 引入来源：
 * 依赖
 *  1.jquery.validate.js 较验
 *  2.jquery.placeholder.zhihu.js
 *  3.jquery.validate.rules.collection.js  规则集
 *  4.lenovo.js 自动补全插件
 *  5.autocomplete.js
 *  6.v2/js/third-party/xMenu/jquery-xmenu.js 下拉
 *  7.上传按钮替换插件
 *  8.uploadReplace.js
 *  9.comm.file.jsv2/js/comm/comm.file.js
 *  10. 在“为什么”上显示卡片 v2/js/plugins/ui-card/plugin.ui-card.js
 *  11 .v2/js/comm/comm.customer.js
 *  12.权限配置参数存于main.js中
 * Created by LiuYuTao on 2015/3/19.
 *  version : 1
 */

if (typeof Array.prototype.indexOf != "function") {
	Array.prototype.indexOf = function (searchElement, fromIndex) {
		var index = -1;
		fromIndex = fromIndex * 1 || 0;

		for (var k = 0, length = this.length; k < length; k++) {
			if (k >= fromIndex && this[k] === searchElement) {
				index = k;
				break;
			}
		}
		return index;
	};
}
module.user = function () {
	//window.debugMode = 1;   // TODO: 开关不宜为全局变量，
	function validateShowErr(element, error) {
		var p = $(element).parents(".inputParent");
		var con = p.find(".l_warning");
		con.html("<img src='//modules.allinmd.cn/user/images/jinggao2.png' alt=''/><span></span>");
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

	/**
	 * 上传按钮替换
	 * @param picpath
	 */
	function bind1(picpath) {
		if ($("#uploadPic1").find("[id^=czyx]").length > 0) {
			$("#uploadPic1").html('<input type="file"    id="file1" name="file" />');
			//$("#uploadPic1 input").textinput();
		}
		czyx.uploadReplace('#file1', {
			url: PC_CALL + "comm/upload_attachment/upload/?_=" + Math.random(), //文件处理的URL,
			data: {paramJson: $.toJSON({imageType: "2", domain: location.hostname})},
			uploadReplaceCss: {
				//设置上传按钮图片
				background: 'url(' + picpath + ') center no-repeat',
				backgroundSize: '100%',
				width: "30",             //上传按钮的宽度
				height: "30",              //上传按钮的高度
				marginRight: "10px",
				marginTop: "10px"
			},
			uploadInputCss: {
				width: "30",             //上传按钮的宽度
				height: "30",             //上传按钮的高度
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
				//this.style.display = 'block';

				try {
					serverJson = $.parseJSON(serverJson);
					if (serverJson && serverJson.responseObject && serverJson.responseObject.responseMessage.path !== "") {

						$("#certificatesPath").val(serverJson.responseObject.responseMessage.url);
						$(".photo_error").hide().parents(".inputParent").find(".input-border").removeClass("input-error");

						bind1(serverJson.responseObject.responseMessage.url);
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

				}
			}
		});
	}

	/**
	 * 模板
	 * */
	var template = {
		renzhengRefuse: function (options) {         // 认证拒绝
			return ' <div class="pop_up sh_pop">' +
				'        <div class="sh_title">' +
				'            <div class="sh_t_l">审核</div>' +
				'            <div class="sh_t_r close"><img src="//modules.allinmd.cn/user/images/close_icon.png"/></div>' +
				'            <div class="clear"></div>' +
				'        </div>' +
				'        <div class="sh_con">' +
				'            <div class="sh_c_t"><span class="sh_c_tBg"></span><span class="sh_name">' + options.username + '</span>老师，很抱歉你的医师认证资料未通过审核~ </div>' +
				'            <div class="sh_c_c">' +
				'                由于你提交的' + options.supplement + '医师认证的要求，建议你重新提交，确保内容真实、完整。我们将优先处理你的申请，感谢你的理解与配合' +
				'            </div>' +
				'            <div class="sh_c_b">' +
				'                <div class="sh_re_btn" id="reAuth">重新提交</div>' +
				'                <div class="sh_fq_btn" id="cancel">放弃</div>' +
				'            </div>' +
				'        </div>' +
				'    </div>';
		},
		renzhengSuccess: function (options) {         // 认证拒绝
			return ' <div class="pop_up sh_pop">' +
				'        <div class="sh_title">' +
				'            <div class="sh_t_l">审核</div>' +
				'            <div class="sh_t_r"><img src="//modules.allinmd.cn/user/images/close_icon.png"/></div>' +
				'            <div class="clear"></div>' +
				'        </div>' +
				'        <div class="sh_con">' +
				'            <div class="sh_c_t">提交成功</div>' +
				'            <div class="sh_c_c">' +
				'               <p><span class="auth_suc_name"></span>老师，你的认证资料我们已经收到！审核通常需要1~3个工作日，请耐心等待。审核通过后，我们会以手机或邮件的方式通知你，再次感谢你对唯医的支持！<p/>' +
				'               <p>在审核期间，你可以享有浏览3分钟视频的特有权限哦~</p>' +
				'            </div>' +
				'            <div class="sh_c_b">' +
				'                <div class="sh_re_btn" id="cancel">知道了</div>' +
				'            </div>' +
				'        </div>' +
				'    </div>';
		},
		renzhengChecking: function () {
			return '<div class="al-two_authenticate">'+
				'<figure class="al_twoSureBox">'+
				'<b class="al-popCloseBtn sh_t_r close"></b>'+
				'<figcaption>医师资格正在审核中</figcaption>'+
				'<p>我们已经收到您的认证申请，审核通常需要1-3个工作日，请耐心等待，感谢您的理解和配合。</p>'+
				'<footer>'+
				'<span id="cancel">知道了</span>'+ //'<p class="al-againSure">重新申请认证</p>'+
				'</footer>'+
				'</figure>'+
				'</div>';
		},
		/**
		 * 会议的完善资料
		 * */
		conferenceWanShan: function () {
			return ' <div class="pop-up">' +
				' 	<div class="login_detail_ty">' +
				'        <div class="login" style="">' +

				'            <div class="login_content">' +
				'                <div class="login_lh">完善资料</div>' +
				'                <div class="tishi">亲爱的医师你好，完善以下资料才可以继续浏览资源哦</div>' +
				'               <form action="" >' +
				'               <div class="name_input">' +
				'                   <div class="inputParent ming_input">' +
				'                       <div class=" input-wrap input-border">' +
				'                          <input type="text" maxlength="50" placeholder="名字" name="firstName" />' +
				'                       </div>' +
				'                       <div class="l_warning"></div>' +
				'                   </div>' +
				'                   <div class="inputParent xing_input">' +
				'                       <div class=" input-wrap input-border">' +
				'                          <input type="text" maxlength="50" placeholder="姓氏" name="lastName" />' +
				'                       </div>' +
				'                       <div class="l_warning"></div>' +
				'                   </div>' +
				'                   <div class="clear"></div>' +
				'               </div>' +
				'                <div class="inputParent rz_input">' +
				'                    <div class=" input-wrap input-border">' +
				'                       <input type="text" placeholder="医院"   name="company" id="company"/>' +
				'                    </div>' +
				'                    <div class="l_warning"></div>' +
				'                </div>' +
				'                <div class="inputParent">' +
				'                    <div class="rz_input">' +
				'                      <div class="lk_input input-border  input-wrap" id="medical_title" >' +
				'                        <div class="input_name">职称</div>' +
				'                       <ul class="medicalShow a_tag">' +
				'                       </ul>' +
				'                       <div class="p_l_zc_xl">' +
				'                         <ul class="medical_con_list">' +
				'                         </ul>' +
				'                       </div>' +
				'                      </div>' +
				'                    </div>' +
				'                    <div class="l_warning"></div>' +
				'                </div>' +
				'                <div class="inputParent">' +
				'                    <div class="rz_input">' +
				'                       <div class="lk_input input-border input-wrap" id="areasExpertise">' +
				'                           <div class="input_name">专业</div>' +
				'                          <ul class="proFieldshow a_tag"></ul>' +
				'                          <div class="p_l_zc_xl">' +
				'                            <ul class="tag_con_list"><li class="tag_par_li"><ul class="p_l_zc_xl_li"></ul></li></ul>' +
				'                          </div>' +
				'                       </div>' +
				'                      </div>' +
				'                    <div class="l_warning"></div>' +
				'                </div>' +
				'                <div class="inputParent">' +
				'                    <div class="rz_input">' +
				'                       <div class="lk_input input-border input-wrap" id="areasExpertise">' +
				'                           <div class="input_name">临床时间</div>' +
				'                           <div class="select">' +
				'                               <select name="clinicalTime" id="clinicalTime">' +
				'                                   <option value="1-3年">1-3年</option>' +
				'                                   <option selected value="3-10年">3-10年</option>' +
				'                                   <option value="10年以上">10年以上</option>' +
				'                           </select></div>' +
				'                       </div>' +
				'                      </div>' +
				'                    <div class="l_warning"></div>' +
				'                </div>' +
				'                <div class="login_but submit_but">' +
				'                       <img src="//modules.allinmd.cn/user/images/tj_zl.png" />' +
				'                </div>' +
				'                <!-- 弹出工作职称下拉框 -->' +
				'                 <div id="medicalMenu" class="xmenu" style="display: none; left:0">' +
				'                    <div class="select-info">	' +
				'                        <label class="top-label">已选职称：</label>' +
				'                        <ul>					' +
				'                        </ul>' +
				'                        <a  name="menu-confirm" href="javascript:void(0);" class="a-btn">' +
				'                            <span class="a-btn-text">确定</span>' +
				'                        </a> ' +
				'                    </div>			' +
				'                    <dl></dl>			' +
				'                </div>' +
				'                <!--end-->' +
				'                <!-- 专业弹层 -->' +
				'                <div id="areasMenu" class="xmenu" style="display: none; left:0">' +
				'                    <div class="select-info">	' +
				'                        <label class="top-label">已选专业：</label>' +
				'                        <ul></ul>' +
				'                        <a  name="menu-confirm" href="javascript:void(0);" class="a-btn">' +
				'                            <span class="a-btn-text">确定</span>' +
				'                        </a> ' +
				'                    </div>			' +
				'                    <dl></dl>			' +
				'                </div>' +
				'               </form>' +
				'            </div>' +
				'        </div>' +
				'    </div>' +
				'</div>';
		},
		/**
		 * 与会议完善资料的没有关系。
		 * 针对之前认证过但没有填写全几个关键字段的用户，补填一下几个字段
		 * */
		wsrenzheng: function () {
			return ' <div class="pop-up">' +
				' 	 <div class="login_detail_ty">' +
				'        <div class="login" style="">' +
				'            <div class="login_content">' +
				'               <div class="login_lh">完善资料</div>' +
				'               <div class="tishi">亲爱的医师你好，完善以下资料才可以继续浏览资源哦</div>' +
				'               <form action="">' +
				'               <div class="inputParent radio_input rz-num-type">' +
				'				<div class="doctor_radio03" value="1">我在医院</div>' +
				'				<div class="doctor_radio03" value="2">我在学校</div>' +
				'				<p class="clear"></p>'+
				'               <div class="l_warning unit_error"></div>' +
				'				</div>' +
				'                   <div class="clear"></div>' +
				'                   <div class="inputParent rz_input onUnit" style="display: none">' +
				'                       <div class=" input-wrap input-border">' +

				'                          <input type="text" placeholder="医院"   name="company" id="company"/>' +
				'                       </div>' +
				'                       <div class="l_warning"></div>' +
				'                   </div>' +
				'               <div class="inputParent rz_input onUnit" style="display: none">' +
				'                   <div class=" input-wrap input-border">' +
				'                       <input type="text" placeholder="学校"  tabindex="5" name="schoolName" id="schoolName"/>' +
				'                   </div>' +
				'                   <div class="l_warning"></div>' +
				'               </div>' +
				'                   <div class="inputParent">' +
				'                       <div class="rz_input">' +
				'                         <div class="lk_input input-border  input-wrap" id="medical_title" >' +
				'                           <div class="input_name">职称</div>' +
				'                       <ul class="medicalShow a_tag">' +
				'                       </ul>' +
				'                       <div class="p_l_zc_xl">' +
				'                         <ul class="medical_con_list">' +
				'                         </ul>' +
				'                       </div>' +
				'                         </div>' +
				'                       </div>' +
				'                       <div class="l_warning"></div>' +
				'                   </div>' +
				'                   <div class="inputParent">' +
				'                       <div class="rz_input">' +
				'                          <div class="lk_input input-border input-wrap" id="areasExpertise">' +
				'                              <div class="input_name">专业</div>' +
				'                          <ul class="proFieldshow a_tag"></ul>' +
				'                          <div class="p_l_zc_xl">' +
				'                            <ul class="tag_con_list"><li class="tag_par_li"><ul class="p_l_zc_xl_li"></ul></li></ul>' +
				'                          </div>' +
				'                          </div>' +
				'                         </div>' +
				'                       <div class="l_warning"></div>' +
				'                   </div>' +
				'                   <div class="login_but submit_but">' +
				'                          <img src="//modules.allinmd.cn/user/images/tj_zl.png" />' +
				'                   </div>' +
				'                   <div class="pass">跳过</div>' +
				'                   <!-- 弹出工作职称下拉框 -->' +
				'                    <div id="medicalMenu" class="xmenu" style="display: none; left:0">' +
				'                       <div class="select-info">	' +
				'                           <label class="top-label">已选职称：</label>' +
				'                           <ul>					' +
				'                           </ul>' +
				'                           <a  name="menu-confirm" href="javascript:void(0);" class="a-btn">' +
				'                               <span class="a-btn-text">确定</span>' +
				'                           </a> ' +
				'                       </div>			' +
				'                       <dl></dl>			' +
				'                   </div>' +
				'                   <!--end-->' +
				'                   <!-- 专业弹层 -->' +
				'                   <div id="areasMenu" class="xmenu" style="display: none; left:0">' +
				'                       <div class="select-info">	' +
				'                           <label class="top-label">已选专业：</label>' +
				'                           <ul></ul>' +
				'                           <a  name="menu-confirm" href="javascript:void(0);" class="a-btn">' +
				'                               <span class="a-btn-text">确定</span>' +
				'                           </a> ' +
				'                       </div>			' +
				'                       <dl></dl>			' +
				'                   </div>' +
				'               </form>' +
				'            </div>' +
				'        </div>' +
				'    </div>' +
				'</div>';
		},
		lianhe: function () {
			return '<div class="pop-up">' +
				'    <div class="login">' +
				'        <div class="login_content">' +
				'            <div class="login_lh">联合登录</div>' +
				'            <div class="tishi lh_tishi" style="text-align: center;font-size: 18px; margin: 0 0 30px 0;">你正在使用CAOS帐号登录唯医</div>' +
				'            <form>' +
				'                <div class="inputParent login_input">' +
				'                    <div class="input-wrap input-border">' +
				'						<span class="inputImage"></span>' +
				'                       <input type="text" name="email" placeholder="你在CAOS的用户名" maxlength="50" /></div>' +
				'                    <div class="l_warning"></div>' +
				'                </div>' +
				'                <div class="inputParent password_input">' +
				'                    <div class=" input-wrap input-border">' +
				'						<span class="inputImage"></span>' +
				'                       <input type="password" name="passwd" placeholder="你在CAOS的密码" maxlength="20" /></div>' +
				'                    <div class="l_warning"></div>' +
				'                </div>' +
				'            </form>' +
				'            <div class="login_but">' +
				'               <div class="v2-blue-btn v2-letterspace-2 "> 授权并登录 </div>' +
				'            </div>' +
				'	    </div>' +
				'	</div>' +
				'</div>';
		},
		/*CAOS帐号登录时，若没有同名唯医帐号，则创建唯医帐号*/
		settingAllinPwd: function (options) {
			return '<div class="pop-up">' +
				'	<div class="login_detail_ty">' +
				'        <div class="login_content" style="position: relative;">' +
				'            <div class="login_lh" style="margin-bottom: 110px;"><span></span>老师，欢迎你进入唯医</div>' +
				'            <div class="tishi_v2" style="width: 400px;position: absolute;text-align: center;font-size: 18px;color: #969696;top: 40px;left: -30px;line-height: 26px;">' +
				'为了方便你今后登录唯医，我们为你创建了专属的<br/>唯医帐号，请设置你的唯医帐号密码</div>' +
				'            <form id="wanShanForm">' +
				'                <div class="error_bg" style="display: none">' +
				'                    <img src="//modules.allinmd.cn/user/images/jinggao2.png" alt=""/>' +
				'                    <div class="error_biao"></div>' +
				'                </div>' +
				'                <div class="inputParent login_input disabled">' +
				'                    <div class="input-wrap input-border">' +
				'						<span class="inputImage"></span>' +
				'                       <input type="text" name="email" placeholder="你在CAOS的用户名" value="" disabled class="caos-email" maxlength="50" /></div>' +
				'                    <div class="l_warning"></div>' +
				'                </div>' +
				'                <div class="inputParent password_input">' +
				'                    <div class=" input-wrap input-border">' +
				'						<span class="inputImage"></span>' +
				'                       <input type="password" name="newPasswd" id="wanshanPasswd" maxlength="20" placeholder="设置唯医的密码" />' +
				'                    </div>' +
				'                    <div class="l_warning"></div>' +
				'                </div>' +
				'                <div class="login_but submit_but">' +
				'                    <div class="v2-blue-btn v2-letterspace-2 "> 完成 </div>' +
				'                </div>' +
				'            </form>' +
				'        </div>' +
				'	</div>' +
				'</div>';
		},
		AllinAccountBinding: function () {
			return "<div class=\"pop-up\"><div class=\"login_detail_ty\"><div class=\"login_content\"><div class=\"login_lh\"><\/div><div class=\"tishi\" style=\"font-size:18px;text-align:center\">你已使用 <span><\/span>注册过唯医，请输入当时设置的密码<\/div><form id=\"wanShanForm\"><div class=\"error_bg\" style=\"display:none\"><img src=\"//modules.allinmd.cn/user/images/jinggao2.png\" alt=\"\"><div class=\"error_biao\">密码不正确。想要 <a href=\"/pages/singlePage/user/passport/reset_password_account.html\">恢复密码<\/a> 吗？<\/div><\/div><div class=\"inputParent password_input\"><div class=\"input-wrap input-border\"><span class=\"inputImage\"><\/span> <input type=\"password\" name=\"wanshanPasswd\" id=\"wanshanPasswd\" maxlength=\"20\" placeholder=\"你在唯医的登录密码\"><\/div><div class=\"l_warning\"><\/div><\/div><div class=\"forget_password font_song\" style=\"text-align:right;padding-top:5px\"><a href=\"javascript:void(0)\" id=\"forgetPwd\">无法登录？<\/a><\/div><div class=\"login_but submit_but\"><div class=\"v2-blue-btn v2-letterspace-2\">登录<\/div><\/div><\/form><\/div><\/div><\/div>\n";
		},
		/*认证提示弹窗*/
		authTip: function(){
			return '<section class="al_openGuid ev_authTip">' +
                '        <section class="al_openGuidAuthTip">' +
                '            <section class="guid_close ev_authTipClose"></section>' +
                '            <section class="guid_icon"><img src="/images/img10/authentication/guid_v.png"></section>' +
                '            <h1 class="guid_title">认证后才能继续操作</h1>' +
                '            <button class="ev_authNow">立即认证</button>' +
                '        </section>' +
                '    </section>';
		}
	};

	/**
	 * 请求地址
	 * */
	var path = {
		/**
		 * 获取
		 *  */
		"out": PC_CALL + "customer/unite/logout/",//退出登录
  		"getCustomerUnite": PC_CALL + "customer/unite/getCustomerUnite/",     //获取当前登录用户信息
		"getLogoUrlList": PC_CALL + "commdata/getLogoUrlList/",         //获取系统上传的图片
		"getCustomerStatistics": PC_CALL + "customer/statistics/getCustomerStatistics/",     //获取用户统计信息
		"checkUserStatus": PC_CALL + "customer/unite/checkSession/",	// 获取用户状态
		"getCustomerAuthInfo": PC_CALL + "customer/auth/getAuthBycustomerId/",
		"getUserInfo": PC_CALL + "customer/unite/getCustomerUnite/",
		"getPrivData": PC_CALL + "customer/role/priv/json_list/",        // 获取权限信息
		"university":PC_CALL+"commdata/getSchoolList/",
		/**
		 * 提交
		 * */
		"loginSubmit": PC_CALL + "passport/securitycheck",	            // 登录提交
		"registSubmit": PC_CALL + "customer/unite/userRegist/",	        //	注册提交
		"caosLoginSubmit": PC_CALL + "passport/securitycheck",	        //	联合登录提交
		"checkEmail": PC_CALL + "customer/unite/validateEmail/",		//	检测邮箱是否存在
		"renzhengSubmit": PC_CALL + "customer/auth/createAuth/",		//	认证提交
		"wsRenzhengSubmit": PC_CALL + "customer/auth/save/",		    //	认证修改
		/**
		 *  上传
		 *  */
		"fileUpload": PC_CALL + "customer/auth/uploadImg/",		        //	文件上传
		"userHeadUpload": PC_CALL + "customer/index/uploadImg/",		//	文件上传
		"updateUserBaseInfo": PC_CALL + "customer/baseinfo/updateBaseInfo/",

		/**
		 * 其它
		 * */
		"randomCode": PC_CALL + "randomValidCode/create/",           // 随机码
		"userValidAndBind": PC_CALL + "web/user/userValidAndBind/",	 //唯医与caos用户绑定

		"caosRegist": "/call/customer/unite/userCaosRegist/",
		"updateNewPasswd": "/call/customer/unite/update_new_passwd/",			// 更新与CAOS同帐号的唯医帐号密码
		"medical": PC_CALL + "commdata/getMedicalTitleList/",
		"dataTag": PC_CALL + "commdatas/tag/getDataTags/"
	};

	/**
	 * DOM操作与绑定
	 * */
	var DOM = {
		$container: null,
		$body: null,
		el: {
			main: null
		},
		currentForm: "",

		showLoginPop: function () {
			var t = this;
			var body = $("body");

			t.currentForm = "login";
			if ('pushState' in history && !"close" in controller.options) {      // 非登录页
				controller.changeHistory("login");
			}
			body.css("overflow", "normal");
			body.append('	<div class="m-UserPop-v2">' +
			'				<div class="mask"></div>' +
			'          		<div class="center-box">' +
			'					<div class="top"></div>' +
			'          			<div class="close"></div>' +
			'          			<div class="back"></div>' +
			'					<div class="content">' +
			'                       <div class="module-login-box" data-alcode-mod="58">' +
			'                       <div class="index_login_l module-index-login caos" style="display:none;" data-alcode-sm="regist"></div>' +
			'				        <div class="index_login_r module-index-login allin" data-alcode-sm="login"></div>' +
			'                       </div>' +
			'                   </div>' +
			'				</div>' +
			'         	</div>');
			// DOM.utils.setPosition();
            comm.layerBottomFixed({
                layerDom:$(".center-box"),
                closeBtn:$(".close"),
                isclose:true
            });
			t.utils.bindResize();
			t.el.main = $(".m-UserPop-v2");
			t.el.close = $(".close", t.el.main);
			body.css("overflow", "hidden");

			/*关闭*/
			t.el.close.on("click", function () {
				controller.cancelLogin();
				//事件埋点
				comm.creatEvent({
					triggerType:"全站功能按钮点击",
					keyword:"登录注册认证弹层关闭",
					actionId:43
				});
			});

			DOM.$container = t.el.main;
			(typeof debugLog != "undefined") && debugLog("v2 showLoginPop");
			module.indexLogin_v2({
				container: DOM.$container.find(".module-login-box"),
				callback: function () {
					t.el.main.remove();
					controller.loginSuccess();
				},
				scene:controller.options.scene,
				noAuthReload:controller.options.noAuthReload,
				//onAuthCancel:'back'
				onAuthCancel:(!/www.allinmd.cn\/?$/.test(window.location.href))?controller.options.onAuthCancel:'stay'
			});
		},

		changeCAOS: function () {
			var t = this;
			DOM.$container.empty();
			t.currentForm = "caos";
			t.utils.loadHtml("lianhe", function () {
				t.bindCAOS();
			});
		},

		//	=================v2 ===================

		/**
		 *  显示会议完善资料
		 */
		showConferenceWanShan: function () {
			var t = this;
			if (t.el && t.el.main) { // 如果原来在登录页
				t.el.main.remove();
			}
			DOM.utils.loadHtml("conferenceWanShan", function () {
				t.bindConferenceWanShan();
				//回显认证信息
				if (controller.options.firstName && controller.options.firstName !== "") {
					$("input[name=firstName]").val(controller.options.firstName).attr("disabled", true);
				}
				if (controller.options.lastName && controller.options.lastName !== "") {
					$("input[name=lastName]").val(controller.options.lastName).attr("disabled", true);
				}
			});
		},

		/**
		 * 绑定会议完善资料
		 *  */
		bindConferenceWanShan: function () {
			var t = this;
			$.ajax({
				url: path.getCustomerAuthInfo,
				dataType: "json",
				type: "post",
				async: false,
				success: function (data) {
					if (data !== null && data !== "" && data.responseObject !== undefined && !$.isEmptyObject(data.responseObject)) {
						controller.customerAuth = data.responseObject;
						var userName=controller.customerAuth.lastName+controller.customerAuth.firstName;
						TempCache.setItem("userName",userName)
					}
				}
			});
			t.bindWsRenZheng();

		},

		/**
		 * 设置为CAOS帐号创建的唯医帐号的密码
		 * */
		changeToSettingAllinPwd: function (options) {
			var t = this;
			DOM.$container.empty();
			DOM.utils.loadHtml("settingAllinPwd", function () {
				DOM.$container.find(".login_lh span").html(options.username);
				t.bindActiveInput();

				DOM.$container.find(".caos-email").val(options.email);
				DOM.$container.find(".submit_but").on("click", function () {
					var data = {};
					var el = DOM.$container.find("[name=newPasswd]");
					var password = $.trim(el.val());
					var errors = [];
					// 密码
					if (password == "" || password == null) {
						errors.push("请填写密码。");
						passwdErrorFlag = true;
					} else {
						if (password.length < 6 || password.length > 20) {
							errors.push("密码长度请保持在6-20位！");
							passwdErrorFlag = true;
						}
					}
					if (errors.length > 0) {
						validateShowErr(el, errors[0]);
					} else {
						validateHideErr(el);
						data.newPasswd = password;
						data.account = options.email;
						$.ajax({
							url: path.updateNewPasswd,
							type: "POST",
							data: {
								paramJson: $.toJSON(data)
							},
							success: function (data) {
								if (data && data.responseObject && data.responseObject.responseStatus) { // 设置成功
                                    g_sps.jump(null,document.referrer);
								} else {  // TODO:设置失败

								}
							}
						});
					}
				});
			});
		},

		changeAllinAccountBindingPop: function (username) {
			var t = this;
			DOM.utils.loadHtml("AllinAccountBinding", function () {
				t.bindAllinAccountBinding(username);
			});
		},

		/**
		 * 用唯医帐号登录 ，并绑定CAOS
		 * */
		bindAllinAccountBinding: function (username) {
			var t = this;
			DOM.$container.find(".login_lh").html("你好," + controller.responseMessage.name);
			DOM.$container.find(".tishi span").text(username);
			DOM.$container.find("#forgetPwd").on("click", function () {
				module.findPassword_v2(controller.options);
			});

			DOM.utils.bindActiveInput();
			var a = DOM.$container.find("#wanShanForm").validate({
				submitHandler: function () {

					controller.AllinAccountBindingSubmit(username);
				},
				rules: {
					"wanshanPasswd": {
						"required": true,
						"rangelength": [6, 20]
					}
				},
				messages: {
					"wanshanPasswd": {
						"required": "请填写密码。",
						"rangelength": "密码长度在{0}-{1}位！"
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
			DOM.$container.find(".submit_but").on("click", function () {
				DOM.$container.find("form").submit();
			});
		},

		/**
		 * CAOS登录绑定
		 */
		bindCAOS: function () { //Lecer
			var t = this;
			DOM.utils.bindActiveInput();
			DOM.$container.find("form").validate({
				submitHandler: function () {
					if (DOM.$container.find(".login_but").attr("on") == "true") {
						controller.caosLoginSubmit();
					}
				},
				rules: {
					"email": {
						"required": true,
						"emailOrPhone": true,
						"rangelength": [1, 50]
					},
					"passwd": {
						"required": true,
						"rangelength": [6, 20]
					}
				},
				messages: {
					"email": {
						"required": "请填写你在CAOS的用户名",
						"emailOrPhone": "请输入正确的手机号或邮箱。",
						"rangelength": "邮件地址不长于50位！"
					},
					"passwd": {
						"required": "请填写你在CAOS的密码。",
						"rangelength": "密码长度在{0}-{1}位！"
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
			DOM.$container.find(".login_but").attr("on", "true");
			DOM.$container.find(".login_but").on("click", function () {
				if ($(this).attr("on") == "true") {
					DOM.$container.find("form").submit();
				}
			});
		},

		/**
		 * 跳转到完善认证
		 */
		changeWsRenZheng: function () {
			var t = this;
			DOM.utils.loadHtml("wsrenzheng", function () {
				DOM.bindWsRenZheng();
				$(".LightBox-btns").empty();
			});
		},

		/**
		 * 完善认证资料
		 * @param options
		 */
		showWsRenzhengPop: function (options) {
			var t = this;
			if (options) {
				controller.options = options;
			}
			DOM.utils.loadHtml("wsrenzheng", function () {
				DOM.$container.find(".login_detail_ty").addClass("normal");
				DOM.bindWsRenZheng();
			});
		},

		/**
		 * 绑定完善认证资料界面
		 */
		bindWsRenZheng: function () {
			var t = this;
			var newArea = [];
			var notDoc = "";
			if (controller.customerAuth !== null && !$.isEmptyObject(controller.customerAuth)) {
				/*if (controller.customerAuth.company) {
				 $("#company").attr("disabled", true);
				 }*/
				if (controller.customerAuth.firstName) {
					DOM.$container.find("[name=firstName]").attr("disabled", true);
				}
				if (controller.customerAuth.lastName) {
					DOM.$container.find("[name=lastName]").attr("disabled", true);
				}
				$("#company").val(controller.customerAuth.company);
				DOM.$container.find("[name=firstName]").val(controller.customerAuth.firstName);
				DOM.$container.find("[name=lastName]").val(controller.customerAuth.lastName);

				var html = "";
				var oldArea = controller.customerAuth.areasExpertise ? controller.customerAuth.areasExpertise.split(",") : [];

				for (var i = 0, l = oldArea.length; i < l; i++) {
					if (oldArea[i]) {
						newArea.push(oldArea[i].split("_"));
					}
				}

				//会议直播页的职称处理
				if (controller.privDetails.NeedCompleteInfo) {
					notDoc = comm.strHandle.cutNotDoctorTitle(controller.customerAuth.medicalTitle);
				}

			}
			for (var j = 0, nl = newArea.length; j < nl; j++) {
				if (newArea[j][0]) {
					html += '<li rel=' + newArea[j][0] + ' class="current">' +
					'<div class="link_l_bg"></div>' +
					'<div class="link_c_bg">' +
					'<b>' + newArea[j][1] + '</b>' +
					'<p>×</p>' +
					'</div><div class="link_r_bg"></div></li>';
				}
			}
			$("#proFieldshow").html(html);

			DOM.utils.bindActiveInput();

			/*跳过按钮*/
			DOM.$container.find(".pass").on("click", function () {
				if ("close" in controller.options && controller.options.close == "empty") {  //  是以前用来判断是否是注册页面来着的
                    g_sps.jump(null,"/");
				}
				controller.cancelLogin();
			});

			/*重新绑定关闭按钮，未完善的话，认为是较验失败。*/
			DOM.$rightTop.find(".LightBox-close").off("click").on("click", function () {
				controller.cancelLogin();
				//事件埋点
				comm.creatEvent({
					triggerType:"全站功能按钮点击",
					keyword:"完善认证弹层关闭",
					actionId:43
				});
			});

			controller.renderHospitalAreasMedicalTitle();

			var submitFunc = function () {
				var company="";var companyId="";var schoolName="";var schoolId="";
				//var company = $("#company").val();//在个人中心还有个#company，报错
				//单位（在学校，在医院）//修改
				var unitEm=$(".rz-num-type div");
				var unitType="";
				$.each(unitEm,function(i,em){
					if($(em).hasClass("on")){
						unitType=$(em).attr("value");
					}
				});
				//if(unitType==1){//医院
				company = $('input[name=company]').val();
				companyId =  $('input[name=company]').attr("companyId");
				//}else{//学校
				schoolName=$('input[name=schoolName]').val();
				schoolId=$('input[name=schoolName]').attr("schoolId");
				//}
				var medical = $(".medicalShow .tagName");
				var area = $(".proFieldshow .tagName");
				var areasExpertise = "";
				var medicalTitle = "";
				$.each(medical, function (i, em) {
					medicalTitle += $(em).attr("medicalid") + '_' + $(em).text() + ',';
				});

				$.each(area, function (i, em) {
					areasExpertise += $(em).attr("tagid") + '_' + $(em).text() + ',';
				});
				if (DOM.$container.find("[name=firstName]").size() > 0) {
					var firstName = DOM.$container.find("[name=firstName]").val();
					var lastName = DOM.$container.find("[name=lastName]").val();
					var clinicalTime = DOM.$container.find("[name=clinicalTime]").val();
				}


				if (!company&&!schoolName) {
					DOM.utils.showError("请填写单位");
					return false;
				} else if (!medicalTitle) {
					DOM.utils.showError("请选择职称");
					return false;
				} else if (!areasExpertise) {
					DOM.utils.showError("请选择专业");
					return false;
				} else if (DOM.$container.find("[name=firstName]").size() > 0 && (!firstName || !lastName)) {
					if (!firstName) {
						DOM.utils.showError("请添加名字");
						return false;
					} else if (!lastName) {
						DOM.utils.showError("请添加姓名");
						return false;
					}
				} else {
					$(".submit_but").attr("on", "false");
					if (notDoc) {
						medicalTitle += notDoc;
					}
					param = {
						company: company,
						companyId:companyId,
						schoolName:schoolName,
						schoolId:schoolId,
						medicalTitle: medicalTitle.substring(0, medicalTitle.length - 1),
						areasExpertise: areasExpertise.substring(0, areasExpertise.length - 1)
					};

					if (DOM.$container.find("[name=firstName]").size() > 0) {
						param.firstName = firstName;
						param.lastName = lastName;
						param.clinicalTime = clinicalTime;
					}
				}
				var data = {paramJson: $.toJSON(param)};
				//comm.LightBox.showloading();
				$.ajax({
					url: path.wsRenzhengSubmit,
					cache: false,
					data: data,
					dataType: 'json',
					type: "POST",
					success: function (data) {
						//comm.LightBox.hideloading();
						if (data && data.responseObject) {
							var rst = data.responseObject;
							if (rst.responseStatus) {
								DOM.utils.end();
								t.isRenZhengStatus = true;
								//t.privCheckSuccess();
								//controller.checkIfNeedCompleteConferenceInfo();

							} else {
								$(".submit_but").attr("on", "true");
								if (rst.responseMessage) {
									alert(rst.responseMessage);
								} else {
									alert("提交完善资料失败，请稍后重试");
								}
							}
						}
					}

				});
				return false;
			};
			$(".submit_but").attr("on", "true").bind("click", function () {
				if ($(this).attr("on") == "true") {
					submitFunc();
				}
			});

			t.form.on("submit", submitFunc);
		},

		/**
		 * 联合登录
		 * @param options
		 */
		showLianHePop: function (options) {
			var t = this;
			if (options) {
				controller.options = options;
			}

			DOM.utils.loadHtml("lianhe", function () {
				t.bindCAOS();
			});
		},

		//引导弹层
		showLoginGuide: function () {
			$(document).scrollTop(0);
			$(".mask_body").remove();
			$(DOM.guideLayer('login')).appendTo(DOM.$body);
			DOM.$body.css("overflow", "hidden");
			$(".login_mask").live("click", function () {
				DOM.showLoginPop();
			});
		}
	};

	DOM.utils = {
		// 载入页面
		loadHtml: function (htmlUrl, callback, options) {
			var t = this;
			document.body.style.overflow = "hidden";

			if (options && options.popType && options.popType == "error") {
				DOM.utils.showErrorContainer();
			} else {
				t.showContainer();
			}

			controller.isSubmitting = false;

			if (options != undefined) {
				DOM.$container.html(template[htmlUrl](options));
			} else {
				DOM.$container.html(template[htmlUrl]());
			}


			DOM.form = DOM.$container.find("form");
			if (DOM.form.length === 0) {
				DOM.form = null;
			} else {
				if (!controller.isBindKeyCode) {
					t.isBindKeyCode = true;
					t.enableKeyboard();
				}
			}
			var pop = DOM.$container.find(".pop-up").css({
				"margin": "0 auto",
				"width": DOM.$container.find(".pop-up>div").width()
			});
			pop.on("click", function (e) {
				comm.stopBubble(e);
			});
			pop.on("click", ".caos_login", function () {	// 绑定联合登录 Lecer
				DOM.changeCAOS();
			});
			comm.setCenter(DOM.$container);
			callback && callback();
			DOM.$container.find("input[placeholder], textarea[placeholder]")
				.placeholder();	// 表单默认值 插件
			DOM.$body.css("overflow", "hidden");
			$(window).bind("resize", function resizeHandler() {
				comm.setCenter(DOM.$container);
			});
		},

		showContainer: function () {
			var t = this;
			if ($(".LightBox-container").length === 0) {
				$("<div class='LightBox-right-top  module-user'>" +
					"<div class='LightBox-close'></div>" +
					"<div class='LightBox-btns'></div>" +
					"</div>" +
					"<div class='LightBox-container module-user auth'></div>"
				).appendTo(DOM.$body);

				if (comm.LightBox.count > 0) {
					comm.LightBox.count++;
					comm.LightBox.zIndexUp();
					$("#lightbox").css({"opacity": "0.92", "background": "#EFEFF4"});
				} else {
					controller.isLightBoxOpened = true;
					comm.LightBox.show(92, "#EFEFF4");
				}

				DOM.$container = $(".LightBox-container").css({
					zIndex: comm.LightBox.getZIndex() + 1,
					position: "absolute"
				});
				DOM.$window = $(window);
			}
			DOM.$rightTop = $(".LightBox-right-top");
			if ("close" in controller.options && controller.options.close == "empty") {  //
				DOM.$rightTop.find(".LightBox-close").css("visibility", "hidden");
			} else {
				DOM.$rightTop.find(".LightBox-close").on('click', function () {
					DOM.utils.end();
					//事件埋点
					comm.creatEvent({
						triggerType:"全站功能按钮点击",
						keyword:"登录注册认证弹层关闭",
						actionId:43
					});
				});
			}
			t.setTopRight();
			$('select, object, embed').css({
				visibility: "hidden"
			});
		},

		/**
		 * 创建错误提示弹层所需DOM结构
		 */
		showErrorContainer: function () {
			var t = this;
			if ($(".LightBox-container").length === 0) {
				$("<div class='LightBox-container module-user'></div>").appendTo(DOM.$body);
				if (comm.LightBox.count > 0) {
					comm.LightBox.count++;
					comm.LightBox.zIndexUp();
					$("#lightbox").css({"opacity": "0.7", "background": "#000000"});
				} else {
					controller.isLightBoxOpened = true;
					comm.LightBox.show(70, "#000000");
				}

				DOM.$container = $(".LightBox-container").css({
					zIndex: comm.LightBox.getZIndex() + 1,
					position: "absolute"
				});
				t.$window = $(window);
			}

			$('select, object, embed').css({
				visibility: "hidden"
			});
		},
		setTopRight: function () {
			DOM.$rightTop.css({
				top: '0px',
				right: '0px',
				position: 'fixed',
				zIndex: 108
			});
		},
		showError: function (msg) {
			var t = this;
			var errorMsg = DOM.$container.find(".errorMsg");
			if (errorMsg.length === 0) {
				errorMsg = $('<div class="error_bg errorMsg"><img src="//modules.allinmd.cn/user/images/jinggao2.png" alt=""/><div class="error_biao"></div></div>');
				DOM.$container.find("form").prepend(errorMsg);
			}
			errorMsg.find(".error_biao").html(msg);
			errorMsg.show();
			t.errorMsg = errorMsg;
		},
		hideError: function () {
			var t = this;
			if (typeof t.errorMsg != "undefined") {
				t.errorMsg.hide();
			}

		},
		bindActiveInput: function () {
			DOM.$container.find('input').on("focus", function () {
				$(this).parent().addClass("hover");
			});
			DOM.$container.find('input').on("blur", function () {
				$(this).parent().removeClass("hover");
			});
		},
		end: function () {
			var t = this;

			if (comm.LightBox.count > 1) {
				comm.LightBox.count--;
				comm.LightBox.zIndexDown();
				$("#lightbox").css({"opacity": "0.7", "background": "#000"});
			} else if(comm.LightBox.count==1){
				if(controller.isLightBoxOpened){
					comm.LightBox.hide();
				}
			}

			$('select, object, embed').css({
				visibility: "visible"
			});

			if (DOM.$container != null) {
				DOM.$container.remove();
			}
			if (DOM.$rightTop != null) {
				DOM.$rightTop.remove();
			}
			t.disableKeyboard();
			controller.isRunning = false;
			if($('.ev-guide').length==0){
                document.body.style.overflow = "auto";
			}else {
                $(window).scrollTop(0);
			}
			if ('pushState' in history) {
				controller.historyChanged && history.back();
			}
			$(window).unbind("resize", function resizeHandler() {
				comm.setCenter(DOM.$container);
			});
		},
		//键盘操作
		keyboardAction: function (event) {
			var KEYCODE_ESC = 27;
			var KEYCODE_ENTER = 13;
			var keycode = event.keyCode;
			/*在登录页与注册页不能按ESC关闭*/
			if (keycode === KEYCODE_ESC && !controller.options.close) {              //  || key.match(/x|o|c/   // 关闭
				DOM.utils.end();
			}
			if (keycode === KEYCODE_ENTER) {             // 提交
				if (DOM.form != null) {
					DOM.form.submit();
				}
			}
		},
		enableKeyboard: function () {
			$(document).on('keyup.keyboard', $.proxy(this.keyboardAction, this));
		},
		//禁用键盘事件
		disableKeyboard: function () {
			$(document).off('.keyboard');
		},
		/* 窗口改变大小 */
		bindResize: function () {
			var t = this;
			// console.log("进入");
			//console.log(t.setSize())
			//$(window).bind("resize", t.setSize);
			//t.resizeMask();
		},
		resizeMask:function(){
		 var t = this;
		 // console.log("进入");
		 var resizeMak = function(){
		 	// console.log($(document.body).width(),$(document).height());
				$(".m-UserPop-v2").css({"width":$(document.body).width(),"height":$(document.body).height()});
				$(".mask").css({"width":$(document.body).width(),"height":$(document.body).height()});
		 };
            window.onresize=function(){
                resizeMak();
            };
            resizeMak();
            /*$("window").off("resize").on("resize",function(){
		 	console.log("触发");
		 })*/
		},
		setPosition: function () {
			$(".m-UserPop-v2,.mask").css({
				width: $(window).width(),
				height: $(window).height()
			});
			comm.setCenter($(".center-box"));
		}
	};

	/**
	 * 权限数据处理工具
	 */
	var privDataUtils = {

		/**
		 * 获取权限列表
		 * */
		getPrivData: function () {
			var t = this;
			if(TempCache.getItem("privData")){
				t.privData = JSON.parse(TempCache.getItem("privData"));
			}else{
				if (!t.privData) {
					$.ajax({
						url: path.getPrivData,
						async: false,
						success: function (data) {
							if (data && data.responseObject && data.responseObject.responseData) {
								t.privData = data.responseObject.responseData;
								TempCache.setItem("privData",JSON.stringify(t.privData));
							} else {
								throw "no priv data";
							}
						}
					});
				}
			}

			return t.privData;
		},

		/**
		 * 获取可执行某方法的用户角色
		 */
		getAvailableCustomerRole: function (scene) {
			var t = this;
			this.getPrivData();
			if (!t.privData) {    // 无权限数据
				throw "no priv data";

			} else {
				var availableCustomerRoleArr = [];
				var data = t.getPrivData();
				var role, privList;
				for (role in data.customeRole) {
					privList = data.customeRole[role];
					if (privList.roleOps.charAt(privList.roleOps.indexOf(scene + "-") + scene.toString().length + 1) == "1") {
						availableCustomerRoleArr.push(parseInt(role));
					}
				}
				if (availableCustomerRoleArr.length == 0) {
					throw "no available role";
				}
				(typeof debugLog != "undefined") && debugLog("availableCustomerRoleArr:", availableCustomerRoleArr);
				return availableCustomerRoleArr;
			}
		},

		/**
		 * 对场景进行描述，拆分成细节
		 * @param scene {Number}场景
		 * @returns {{}} 权限细节
		 */
		getPrivilegeDetailsOfThisScene: function (scene) {

			var privDetails = {
				/*需要登录*/
				NeedLogin: false,
				/*需要认证*/
				NeedAuth: false,
				NeedSystem: false,
				/*需要完善资料*/
				NeedCompleteInfo: false,
				/*需要未认证厂商角色*/
				NeedNoCertifiedManufacture: false,
				/*需要已认证厂商角色*/
				NeedCertifiedManufacture: false,
				/*无法操作*/
				CannotOperate: false,
				LoginIsEnough: false
			};

			var availableRoleArr = this.getAvailableCustomerRole(scene);

			/*是否需要登录*/
			privDetails.NeedLogin = availableRoleArr.indexOf(privilegeRoleConst.Visitor) <= -1;

			/*是否需要认证*/
			privDetails.NeedAuth = availableRoleArr.indexOf(privilegeRoleConst.Doctor) <= -1 && availableRoleArr.indexOf(privilegeRoleConst.AuthedDoctor) > -1;  // 无普通用户，且有认证用户

			/* 仅需普通用户权限即可 */
			privDetails.LoginIsEnough = availableRoleArr.indexOf(privilegeRoleConst.Doctor) > -1;  // 有普通用户

			/*是否需要完善资料*/
			//privDetails.NeedCompleteInfo = this.checkIsNeedConferenceComplete(scene);

			/*是否需要认证厂商角色*/
			privDetails.NoCertifiedManufacture = availableRoleArr.indexOf(privilegeRoleConst.CertifiedManufacture) > -1;

			privDetails.NeedCertifiedManufacture = availableRoleArr.indexOf(privilegeRoleConst.CertifiedManufacture) > -1;

			/*是否需要系统角色*/
			privDetails.NeedSystem = availableRoleArr.indexOf(privilegeRoleConst.System) > -1;

			return privDetails;
		},

		/**
		 * 判断是否需要完善资料
		 * */
		checkIsNeedConferenceComplete: function (scene) {
			return scene == privilegeSceneConst.eSceneTypeLiveShow ? true : false;
		}
	};

	var controller = {
		/*状态*/
		isLoginStatus: false,       // 是否已登录
		isCheckEmail: false,        // 邮箱是否已验证
		isSubmitting: false,
		isRenZhengStatus: false,
		isBindKeyCode: false,		// 是否绑定键盘操作
		isWeixinQuerying: false,    // 微信状态查询
		isRunning: false,           // 是否已弹出
		/*对象*/
		customerAuth: null,         // 认证对象
		historyChanged: false,
		customerRole: 0,            // 用户角色 默认为零
		isLightBoxOpened:false,
		init: function () {
			var t = this;
			t.getLoginStatus();
			t.getCustomerAuthInfo();
			//privDataUtils.getPrivData();
		},

		/**
		 * 主方法
		 * @param params {Object}
		 * {
		 * callback:{Function},  // 权限处理完后回调函数
		 * scene:{String||Number},    // 场景
		 * redirectUrlOnClose:""   // 关闭时跳转地址
		 * }
		 */
		login: function (params) {
			(typeof debugLog != "undefined") && debugLog("start check login");
			var t = this;
			DOM.$body = $("body");
			if (!t.isRunning) {
				t.isRunning = true;
				if (params) {
					t.options = params;
					if ((params.scene !== "" || params.operateType != "") && params.callback !== null) {
						if (params.scene == privilegeSceneConst.eSceneTypeReAuth) {
							t.showAuthPage(t.options);
						} else {
							t.checkPriv();
						}
					}
				}
			}
		},

		//==================================权限控制相关============================================

		/**
		 * 开始比较权限
		 * */
		checkPriv: function () {
			var t = this;
			(typeof debugLog != "undefined") && debugLog("start check Priv");
			if (!t.privDetails.NeedLogin) { // 未登录用户可以执行
				t.privCheckSuccess();
			} else {  // 需要登录
				t.checkLoginStatus();       //判断登录状态
			}
		},

		/**
		 * 检测登录状态
		 * */
		checkLoginStatus: function () {
			var t = this;
			(typeof debugLog != "undefined") && debugLog("check login status");
			//$.ajax({
			//	url: path.checkUserStatus,
			//	dataType: "json",
			//	type: "post",
			//	success: function (result) {
			//		if (result.responseObject.responseStatus) { //已登录
			//			t.loginSuccess();
			//		} else {                                    // 未登录
			//			DOM.showLoginPop();
			//		}
			//	}
			//});
			var authInfo=JSON.parse(TempCache.getItem("authInfo"));
			if(authInfo==null){
				controller.getCustomerAuthInfo();
				authInfo=JSON.parse(TempCache.getItem("authInfo"));
			}
			if(authInfo&&authInfo.responseObject&&authInfo.responseObject.customerId){//已登录
				t.loginSuccess();
			}else{                            //未登录
				DOM.showLoginPop();
			}
		},

		/**
		 *  分析权限信息
		 */
		analyzePrivDetails: function (options) {
			var t = this;
			(typeof debugLog != "undefined") && debugLog("options.scene:" + options.scene);
			/* 直接认证功能 */
			if (options.scene == privilegeSceneConst.eSceneTypeLogin) {
				t.privDetails = {
					/*需要登录*/
					NeedLogin: true,
					/*需要认证*/
					NeedAuth: false,
					LoginIsEnough:true,
					/*需要完善资料*/
					//NeedCompleteInfo: false,
					/*需要未认证厂商角色*/
					NeedNoCertifiedManufacture: false,
					/*需要已认证厂商角色*/
					NeedCertifiedManufacture: false,
					/*无法操作*/
					CannotOperate: false
				};
			} else if (options.scene == privilegeSceneConst.eSceneTypeAuth
				|| options.scene == privilegeSceneConst.eSceneTypeReAuth) {
				t.privDetails = {
					/*需要登录*/
					NeedLogin: true,
					/*需要认证*/
					NeedAuth: true,
					LoginIsEnough:false,
					/*需要完善资料*/
					//NeedCompleteInfo: false,
					/*需要未认证厂商角色*/
					NeedNoCertifiedManufacture: false,
					/*需要厂商角色*/
					NeedCertifiedManufacture: true,
					/*无法操作*/
					CannotOperate: false
				};

			} else if (options.scene == privilegeSceneConst.eSceneTypeNeedManufactureLogin){
                t.privDetails = {
					/*需要登录*/
                    NeedLogin: true,
					/*需要认证*/
                    NeedAuth: true,
                    LoginIsEnough:true,
					/*需要完善资料*/
                    //NeedCompleteInfo: false,
					/* 需要未认证厂商 */
					NeedNoCertifiedManufacture:false,
					/*需要厂商角色*/
                    NeedCertifiedManufacture: true,
					/*无法操作*/
                    CannotOperate: false
                };
			} else if(options.scene == privilegeSceneConst.eSceneDoctorOnly){
				t.privDetails = {
					/*需要登录*/
					NeedLogin: true,
					/*需要认证*/
					NeedAuth: true,
					LoginIsEnough:false,
					/*需要完善资料*/
					//NeedCompleteInfo: false,
					/* 需要未认证厂商 */
					NeedNoCertifiedManufacture:false,
					/*需要厂商角色*/
					NeedCertifiedManufacture: false,
					/*无法操作*/
					CannotOperate: false
				};
			}
			else if(options.scene == privilegeSceneConst.eSceneExceptManufacture){
				t.privDetails = {
					/*需要登录*/
					NeedLogin: true,
					/*需要认证*/
					NeedAuth: true,
					LoginIsEnough:false,
					/*需要完善资料*/
					//NeedCompleteInfo: false,
					/* 需要未认证厂商 */
					NeedNoCertifiedManufacture:false,
					/*需要厂商角色*/
					NeedCertifiedManufacture: false,
					/*无法操作*/
					CannotOperate: false
				};
			}
			else {
				/**
				 * 考虑到之前很多场景下仍然使用的是 operateType
				 */
				if (typeof options.scene != "undefined") {    // 若是新版权限参数
					t.privDetails = privDataUtils.getPrivilegeDetailsOfThisScene(options.scene);
				}
			}

			(typeof debugLog != "undefined") && debugLog("privDetails", t.privDetails);
			return t.privDetails;
		},

		/**
		 * 登录成功后
		 * @param result
		 */
		loginSuccess: function (result) {
			var t = this;
			t.isLoginStatus = true;
			$(".LightBox-btns").remove();
			$(".nav_list a:eq(0)").attr("href", "/pages/personal/personal_index.html");
			if (typeof t.userInfo === "undefined" || $.isEmptyObject(t.userInfo)) {
				var userInfo = t.getCustomerUnite();
				t.userInfo = userInfo;
				if (userInfo != null && userInfo != undefined) {     // 更新头部用户状态 修改样式，加载头像 设置隐藏域
					if(t.userInfo.isValid==0){// addBy lichunhui 2017.08.31无效的用户
						$.ajax({
							type: 'POST',
							url: path.out,
							cache: false,
							dataType: 'json',
							success: function (rep) {
								if (rep && rep.responseObject && rep.responseObject.responseStatus) {
                                    comm.cookie.deleteFn("userId");//病历夹子站删除cookie
                                    g_sps.jump(null,"/");
									TempCache.clear();
								}
							}
						});
					}
					if ($("#header_main").size() > 0) {
						comm.getHeaderLogin();
					}
				}
			}
			controller.getCustomerAuthInfo();
			/*角色处理*/
			t.handleCustomerRole();
		},

		/**
		 * 登录后处理角色问题
		 * */
		handleCustomerRole: function () {
			var t = this;
			(typeof debugLog != "undefined") && debugLog("handleCustomerRole-角色：" + t.userInfo.customerRole);

			switch (t.userInfo.customerRole) {
				//  系统用户
				case privilegeRoleConst.System:
					if (t.privDetails.NeedSystem) {
						DOM.utils.end();
						t.privCheckSuccess();
					} else {
						DOM.utils.end();
						controller.privCheckFailed();
						(typeof debugLog != "undefined") && debugLog("handleCustomerRole-角色：" + t.userInfo.customerRole + "无权操作");
					}
					break;
				// 组织
				case privilegeRoleConst.Organization:
					break;

				// 未认证厂商
				case privilegeRoleConst.NoCertifiedManufacture:
					if (t.privDetails.NeedCertifiedManufacture) {  // 需厂商权限
						// 提示认证  入驻唯医
						if(t.customerAuth.state == -1){	// 未填写认证
							comm.alertBox({
								title:'入驻唯医',
								content:'成功入驻享受以下权益：<br>' +
								'1. 十万+精彩资源免费浏览<br>' +
								'2. 品牌下展示个人身份信息<br>' +
								'3. 手动曝光产品在唯医展示',
								ensure:'入驻唯医',
								ensureCallback:function(){
									window.location.href = "/pages/singlePage/user/companyAuth.html";
								}
							});
						}
						if(t.customerAuth.state == 1 || t.customerAuth.state == 0){	 // 审核中
							comm.alertBox({
								title:'认证资料正在审核中',
								content:'我们已经收到您的认证申请，审核通常需要1-3个工作日，请耐心等待，感谢您的理解和配合。',
								ensure:'知道了',
								ensureCallback:function(){

								}
							});
						}
						if(t.customerAuth.state == 3){	 // 被拒绝
							comm.alertBox({
								title:'认证拒绝',
								content:'您的认证信息被拒绝，点击重新提交',
								ensure:'重新提交',
								ensureCallback:function(){
									window.location.href = "/pages/singlePage/user/companyAuth.html";
								}
							});
						}
					} else {	// 厂商无法操作
						DOM.utils.end();    //关掉，无动作
						//controller.privCheckFailed();
						if((/conference_live/ig).test(window.location.href)){
							t.options.callback&&t.options.callback();
							return false;
						}
						comm.alertBox({
							content:'你没有此操作权限',
							ensure:'知道了',
							ensureCallback:function(){
								//t.cancelLogin();
								if(!t.options.stay){
									controller.cancelLogin();
								}
							}
						});
						(typeof debugLog != "undefined") && debugLog("handleCustomerRole-角色：" + t.userInfo.customerRole + "无权操作");
					}
					break;
				// 已认证厂商
				case privilegeRoleConst.CertifiedManufacture:
					if (t.privDetails.NeedCertifiedManufacture) {  // 需厂商权限
						DOM.utils.end();
						t.privCheckSuccess();
					} else {
						DOM.utils.end();    //关掉，无动作
						//controller.privCheckFailed();
                        if((/conference_live/ig).test(window.location.href)){
                            t.options.callback&&t.options.callback();
                            return false;
                        }
						comm.alertBox({
							content:'你没有此操作权限',
							ensure:'知道了',
							ensureCallback:function(){
								if(!t.options.stay){
									controller.cancelLogin();
								}
							}
						});
						(typeof debugLog != "undefined") && debugLog("handleCustomerRole-角色：" + t.userInfo.customerRole + "无权操作");
					}
					break;

				// 患者
				case privilegeRoleConst.Patient:
					break;
				// 普通用户 医师
				case privilegeRoleConst.Doctor:

					if (t.privDetails.LoginIsEnough) {    // 仅需登录
						DOM.utils.end();
						t.privCheckSuccess();
					} else {
						t.checkIfNeedAuth();
					}
					break;
				case privilegeRoleConst.AuthedDoctor:   // 认证用户
                case privilegeRoleConst.LiveStudents:   // 住陪学员
				case privilegeRoleConst.practitioner:   // 执业医师
				case privilegeRoleConst.Nurse:			// 护士
				case privilegeRoleConst.DoctorAssistance: // 医助
					if (t.privDetails.LoginIsEnough) {    // 仅需登录
						DOM.utils.end();
						t.privCheckSuccess();
					}
					/**
					 * 检查当前用户状态
					 * 若状态正常，则执行第二步检测用户是否完善信息，
					 * 若已完善，则执行第三步，检查是否在直播页面，
					 * 若在直播页面，则检查用户直播信息是否已完善
					 * 不正常则显示提示信息。
					 */
					else {
						t.checkAuthState();
					}
					break;
			}
		},

		/**
		 * 根据用户认证对象判断当前用户是否已完善
		 * @return  {Boolean} 是否已完善
		 */
		checkAuthInfoIsComplete: function () {
			var t = this;
			var isComplete;
			if (t.customerAuth == "" || t.customerAuth == null || $.isEmptyObject(t.customerAuth)) {
				isComplete = false;    // 未完善
			} else {
				if ((t.customerAuth.company == "" && t.customerAuth.schoolName=="")||
					t.customerAuth.medicalTitle == "") {  // 检查用户认证信息是否完善
					isComplete = false;   // 未完善
				} else {
					isComplete = true;   // 已完善，
				}
			}
			return isComplete;
		},

		/**
		 * 判断会议信息是否完善
		 * @return  {Boolean} 是否已完善
		 */
		checkConferenceInfoIsComplete: function () {
			var t = this;
			var isComplete;
			if (t.customerAuth == "" || t.customerAuth == null || $.isEmptyObject(t.customerAuth)) {
				isComplete = false;    // 未完善
			} else {
				if (t.customerAuth.firstName == "" || t.customerAuth.lastName == "" ||
					t.customerAuth.company == "" || t.customerAuth.medicalTitle == "" ||
					t.customerAuth.areasExpertise == "" || t.customerAuth.clinicalTime == "") {  // 完善参会所需材料
					isComplete = false;   // 未完善
				} else {
					isComplete = true;   // 已完善，
				}
			}
			return isComplete;
		},

		/**
		 *  权限较验成功后处理
		 *  */
		privCheckSuccess: function () {
			var t = this;
			t.privCheckState = true;
			(typeof debugLog != "undefined") && debugLog("start Priv check success");
			//loadLoginUserBaseInfo();
			//loadCustomerPic();
			if (typeof t.userInfo === "undefined" || $.isEmptyObject(t.userInfo)) {
				var userInfo = t.getCustomerUnite();
				t.userInfo = userInfo;
			}
			if(t.userInfo.isValid==0 || (TempCache.getItem("passwd")&&TempCache.getItem("passwd")!="undefined"&&t.userInfo.passwd!=TempCache.getItem("passwd"))){//TODO addBy lichunhui 2017.08.29无效的用户 或者在其他端修改过密码
				$.ajax({
					type: 'POST',
					url: path.out,
					cache: false,
					dataType: 'json',
					success: function (rep) {
						if (rep && rep.responseObject && rep.responseObject.responseStatus) {
                            comm.cookie.deleteFn("userId");//todo :病历夹子站删除cookie
							g_sps.jump(null,"/");
							TempCache.clear();
						}
					}
				});
			}
			/*若当前页面是联合登录*/
			/*如果是从普通登录页，或联合登录页跳来的，则跳回源页*/
			if ("close" in controller.options && controller.options.close == "empty") {
				setTimeout(function(){
                    g_sps.jump(null,document.referrer);
				},1000);
			}
			if (typeof t.options != "undefined" && typeof t.options.callback != "undefined") {
				t.options.callback();
			} else {
                setTimeout(function(){
                	g_sps.jump(null,"/");
                },1000);
			}
			t.isRunning = false;
		},

		/**
		 * 权限较验失败
		 * */
		privCheckFailed: function () {
			(typeof debugLog != "undefined") && debugLog("check priv Faild");
			/*关闭 或跳过后跳转*/
			/*若配置了关闭按钮点击事件*/
			if (typeof  controller.options.onLoginClose != "undefined") {
				controller.options.onLoginClose();
			} else {
                g_sps.jump(null,"/");
			}

		},

		/**
		 * 取消登录  及认证权限。
		 * */
		cancelLogin: function () {
			var t = this;
			/**
			 * 2016-5-3 liuyutao from biwenjuan
			 * 若有来源页，点击暂不
			 * */
			if (typeof t.options.onAuthCancel != "undefined" && t.options.onAuthCancel == "back") {
				if (document.referrer != "" && document.referrer.indexOf("regist") < 0 && document.referrer.indexOf("login") < 0 && document.referrer.indexOf("auth") < 0 ) {    // 有来源
					window.location.href=document.referrer;
				} else {                          // 无来源
					if (typeof t.options.privCheckFailed != "undefined") { // 若有关闭后应跳转的页
						t.options.privCheckFailed();
					} else {                      // 若无则跳回首页
                        window.location.href="/";
					}
				}
			}else{
                typeof t.options.onClose=='function'&& t.options.onClose();
                DOM.utils.end();
			}
		},

		/**
		 * 判断是否需要认证用户权限
		 */
		checkIfNeedAuth: function () {
			var t = this;
			if (t.privDetails.NeedAuth) {     // 需认证
				(typeof debugLog != "undefined") && debugLog("v2 need auth");
				var options = {};

				$.extend(options, t.options, {
					callback: function () {
						t.isRunning = false;
						var userInfo = t.getCustomerUnite();
						t.userInfo = userInfo;
						t.options.callback();
					},
					privCheckFailed: function () {
						t.privCheckFailed();
					}
				});
				//t.showAuthPage(options);

				t.checkAuthState(options);
			} else {                    // 是否需要完善资料
				t.checkIfNeedCompleteAuthInfo();
			}
		},

		/**
		 * 判断是否需要验证完善认证资料
		 */
		checkIfNeedCompleteAuthInfo: function () {
			var t = this;
			(typeof debugLog != "undefined") && debugLog("check checkIfNeedCompleteAuthInfo");
			if (t.checkAuthInfoIsComplete()) { // 已完善
				(typeof debugLog != "undefined") && debugLog("check authInfo is complete");
				DOM.utils.end();
				//t.checkIfNeedCompleteConferenceInfo(); // 判断是否需要完善会议资料
				t.privCheckSuccess();
			} else {
				DOM.changeWsRenZheng();      // 未完善，跳转界面
			}
		},

		/**
		 * 判断是否需要验证完善会议资料
		 */
		checkIfNeedCompleteConferenceInfo: function () {
			var t = this;
			if (t.privDetails.NeedCompleteInfo) { // 是否需要完善资料
				if (t.checkConferenceInfoIsComplete()) { // 已完善
					DOM.utils.end();
					t.privCheckSuccess();
				} else {
					DOM.showConferenceWanShan();      // 未完善，跳转会议界面
				}
			} else {        //  不需要
				DOM.utils.end();
				t.privCheckSuccess();
			}
		},

		/**
		 * 检查认证信息状态，以显示相关状态信息。
		 * 如被拒绝，或审核中
		 * */
		checkAuthState: function () {
			var t = this;
			/*if(JSON.parse(TempCache.getItem("authInfo"))){
				t.authAction(JSON.parse(TempCache.getItem("authInfo")));
			}else{*/
				$.ajax({
					url: path.getCustomerAuthInfo,
					dataType: "json",
					type: "post",
					success: function (data) {
						//comm.authInfo=data;
						t.customerAuth = data.responseObject;
						TempCache.setItem("authInfo",JSON.stringify(data));
						t.authAction(data);
					}
				});
			//}

		},
		//获取认证信息后执行
		authAction:function(data){
			var t=this;
			t.options.authInfoData=data;
			var options = t.options;
			if (data === null ||
				data == "" ||
				data.responseObject === undefined ||
				$.isEmptyObject(data.responseObject) ||
				data.responseObject.state == -1) {	//未认证
				if (DOM.$container && DOM.$container.is(":visible")) {
					// 之前在登录界面的话
					DOM.utils.end();
					t.showAuthPage();
				} else {
					DOM.utils.end();
					t.showAuthPage();
				}
			} else {
				t.customerAuth= data.responseObject;
				var userName=t.customerAuth.lastName+t.customerAuth.firstName;
				TempCache.setItem("userName",userName);
				var customerId = t.customerAuth.customerId;
				var state = t.customerAuth.state;
				if(customerId<=0){//TODO 20180627 update by lichunhui 解决checksession返回true 但是 auth信息返回没有用户信息时去登录
                    DOM.showLoginPop();
					return false;
				}
				// -    1-无认证信息、0-二次提交认证、1-认证待审核、2-运营确认、3-认证拒绝、4-执业医师申请中、5-执业医师通过、6-执业医师拒绝
				if (state === 3 || state === -1 || state === 0 || state === 1) {
					// 未申请  || 被拒绝
					//alert("您的认证申请正在审核中。无法进行相关操作");
					if (state == 3) {        // 拒绝
						DOM.utils.end();
						//TODO edit by lichunhui 20180914 认证弹窗不走拒绝弹窗
                        DOM.utils.end();
                        t.showAuthPage();
                        /*DOM.utils.loadHtml("renzhengRefuse", function () {
                            DOM.$rightTop && DOM.$rightTop.hide();   // 显示状态时，隐藏右上角关闭按钮
                            DOM.$container.find("#reAuth").on("click", function () {
                                DOM.utils.end();
                                t.options.noAuthTip = 1;//不需要认证提示弹层
                                t.showAuthPage();
                            });
                            DOM.$container.find("#cancel,.close").on("click", function () {
                                controller.cancelLogin();
                            });
                            t.options.loginCallback&&t.options.loginCallback();
                        }, {popType: "error", username: t.customerAuth.certificatesCode, supplement: t.customerAuth.supplement});*/

					} else if (state == 0 || state == 1) {        // 审核中
						DOM.utils.end();
						DOM.utils.loadHtml("renzhengChecking", function () {
							DOM.$rightTop && DOM.$rightTop.hide();   // 显示状态时，隐藏右上角关闭按钮
							DOM.$container.find("#reAuth").on("click", function () {
								DOM.utils.end();
                                t.options.noAuthTip = 1;//不需要认证提示弹层
								t.showAuthPage();
							});
							DOM.$container.find("#cancel,.close").on("click", function () {
								// 认证提交成功后，的审核中界面，知道了按钮，点击后的响应。
								if(t.options.stay){//TODO:认证二期需要对state为1  V1待审核 点击知道了需要留在当前页
                                    DOM.utils.end();
								}else{
                                    controller.cancelLogin();
								}
							});
							t.options.loginCallback&&t.options.loginCallback();//TODO add by lichunhui 登录成功回调
						}, {popType: "error"});
					} else {
						if (DOM.$container && DOM.$container.is(":visible")) {    // TODO: tobe deleted  新版无此逻辑
							// 之前在登录界面的话
							DOM.utils.end();
							t.showAuthPage();
						} else {
							DOM.utils.end();
							t.showAuthPage();
						}
					}

				} else if (t.customerAuth.state === 2 || t.customerAuth.state === 7 || t.customerAuth.state === 8 || t.customerAuth.state === 9) {
					//V1认证已经通过，此时不允许再次认证
					// 判断是否需要补全认证信息
					controller.checkIfNeedCompleteAuthInfo();
				} else if (t.customerAuth.state === 0 || t.customerAuth.state === 1) {
					//已经提交申请 未审核 ，此时不允许再次认证
					//alert("你已经提交过认证，不能重复认证")
					DOM.utils.end();
					t.options.loginCallback&&t.options.loginCallback();//TODO add by lichunhui 登录成功回调
				}
			}

		},
		//==================================提交相关==============================================

		/**
		 * CAOS登录后若发现有同名唯医帐号则
		 * 绑定唯医用户
		 * @param userName
		 */
		AllinAccountBindingSubmit: function (userName) {
			var t = this;
			var email = userName;
			var type = comm.checkAccountType(email);
			var param = {
				type: type,
				email: email,
				account: email,
				passwd: DOM.$container.find("[name=wanshanPasswd]").val(),
				nickname: DOM.$container.find("[name=wanshanNickname]").val(),
				caosCustomerId: t.caosCustomerId
				//caosId:t.responseMessage.responsePk
			};
			var data = {"paramJson": $.toJSON(param)};
			DOM.utils.hideError();
			$.ajax({
				url: path.userValidAndBind,
				type: "POST",
				data: data,
				dataType: "json",
				success: function (data) {
					var result = data.responseObject;
					if (result) {
						if (result.responseStatus) {
							//comm.authInfo=null;
							TempCache.removeItem("authInfo");
							t.userInfo = t.getCustomerUnite();
							controller.getCustomerAuthInfo();
							/*角色处理*/
							t.handleCustomerRole();
						} else {
							DOM.utils.showError("密码不正确。"); //想要 <a href='/pages/singlePage/user/passport/reset_password_account.html'>恢复密码</a> 吗？
						}
					}
				}
			});
		},

		/**
		 * 联合登录提交
		 */
		caosLoginSubmit: function () {
			/* 登录后，若无绑定的唯医帐号，为其创建，并设置密码 */
			var t = this;
			DOM.$container.find(".login_but").attr("on", "false");
			var data = {};
			var rememberMe = $("#rememberMe") != null ? $("#rememberMe").attr("checked") : 1;
			var password = DOM.$container.find("[name=passwd]").val();
			var email = DOM.$container.find("[name=email]").val();
			var type = comm.checkAccountType(email);
			data.j_username = "caos;" + email + ";" + password + ";" + type;
			data.j_password = password;
			data.rememberMe = (rememberMe === 'checked' || rememberMe === '1' || rememberMe === 'true') ? true : false;
			//comm.LightBox.showloading();
			$.ajax({
				url: path.caosLoginSubmit,
				type: "POST",
				data: data,
				async: false,
				dataType: "json",
				success: function (data) {
					//comm.LightBox.hideloading();
					var result = data.responseObject;
					var resStatus = result.responseStatus;
					var resCode = result.responseCode;
					var resMessage = result.responseMessage;
					if (!resStatus && resCode === "0A1004") { //完善资料
						t.responseMessage = resMessage;
						t.caosCustomerId = result.responsePk;
						DOM.changeAllinAccountBindingPop(email);
					} else if (!resStatus) {         // 登录失败
						setTimeout(function () {
							DOM.$container.find(".login_but").attr("on", "true");
						}, 1000);
						DOM.utils.showError("不正确的帐号或密码,请重新输入！");  //resMessage
					} else {
						//登录成功
						if (typeof t.userInfo === "undefined" || $.isEmptyObject(t.userInfo)) {
							var userInfo = t.getCustomerUnite();
							t.userInfo = userInfo;
							/**
							 * 获取用户是否有同名唯医帐号,检测CAOS用户是否是第一次登录
							 * */
							$.ajax({
								url: PC_CALL + "customer/unite/checkCaosLoginNum/",
								type: "POST",
								data: {
									paramJson: $.toJSON({account: email})
								},
								success: function (data) {
									//comm.authInfo=null;
									TempCache.removeItem("authInfo");
									if (data && data.responseObject && data.responseObject.responseStatus) {
										/* if(data.responseObject.responseData.caosFlag=="1"){ // TODO: 需创建帐号 暂不上线设置密码的功能

										 t.changeToSettingAllinPwd({username: t.userInfo.nickname,email:email});
										 }else{ */
										controller.getCustomerAuthInfo();

										$(".LightBox-btns").remove();

										// 检查是否需要认证权限
										t.handleCustomerRole();

										// FIXME:忘了这个状态干嘛的了
										if (resMessage != null && resMessage != "" && resCode === "0B0004") {
											//window.top.location.href = sufix;
										} else {
											//window.top.location.href = '/call/customer/index/input/?_=' + Math.random();
										}
										// }

									} else {
										// TODO: 获取失败
										controller.getCustomerAuthInfo();

										// 检查是否需要认证权限
										t.handleCustomerRole();
									}
								}
							});
						}
					}
					//事件埋点
					comm.creatEvent({
						triggerType:"登录",
						keyword:"CAOS授权登录",
						browType:148,
						actionId:21,
						locationId:3,
						pushMessageId:TempCache.getItem("userId")
					});
					/*var existSameNameAllinId = true; // 　FIXME:是否存在同名帐号
					 var isBindAllinId = true // FIXME：是否已绑定唯医帐号
					 if(isBindAllinId){ // 已绑定
					 var isAllinIdLogined = true; // FIXME:是否用唯医帐号登录过
					 if(!isAllinIdLogined){ // 未登录过
					 t.changeToSettingAllinPwd(email);
					 }else{
					 // 直接进入
					 window.location.href = document.referrer;
					 }
					 }else{  // 未绑定
					 if(existSameNameAllinId){   // 存在同名帐号
					 t.changeWanShanPop()
					 }else{

					 }

					 }
					 if(existSameNameAllinId){ // 已存在同名帐号

					 }else{

					 }*/
				}
			});
		},

		//========================获取数据相关===============================
		/**获取登录状态*/
		getLoginStatus: function () {
			var t = this;
			$.ajax({
				url: path.checkUserStatus,
				dataType: "json",
				type: "post",
				async: false,
				success: function (result) {
					if (result.responseObject.responseStatus) {//已登录
						t.isLoginStatus = true;
						comm.isLoginStatus = true;
					} else {
						t.isLoginStatus = false;
						comm.isLoginStatus = false;
                        comm.cookie.deleteFn("userId");//todo :病历夹子站删除cookie
						TempCache.removeItem("authInfo");
					}
				}
			});
		},

		/**
		 * 获取是否已认证状态
		 * */
		getCustomerAuthInfo: function () {
			var t = this;
			if(TempCache.getItem("authInfo")&&JSON.parse(TempCache.getItem("authInfo")).responseObject.customerId>0){
				t.customerAuth = JSON.parse(TempCache.getItem("authInfo")).responseObject;
				var result=t.customerAuth;
				if ((result.state === 2 || result.state === 7 || result.state === 8 || result.state === 9)) {//已登录
					t.isRenZhengStatus = true;
				}
				if (result.checkEmail) { // 邮箱验证
					t.isCheckEmail = true;
				}

			}else{
				$.ajax({
					url: path.getCustomerAuthInfo,
					dataType: "json",
					type: "post",
					async: false,
					success: function (result) {
						//添加全局的获取的认证信息防止以后的重复请求
						//comm.authInfo=result;
						if (result != null && result != "") {
							TempCache.setItem("authInfo", JSON.stringify(result));
							t.customerAuth = result.responseObject;
							var userName = t.customerAuth.lastName + t.customerAuth.firstName;
							TempCache.setItem("userName", userName);
							if (!$.isEmptyObject(result)) {
								if ((result.responseObject.state === 2 || result.responseObject.state === 7 || result.responseObject.state === 8 || result.responseObject.state === 9)) {//已登录
									t.isRenZhengStatus = true;
								}
								if (result.responseObject.checkEmail) { // 邮箱验证
									t.isCheckEmail = true;
								}
							}
						} else {
							t.isRenZhengStatus = false;
						}
					}
				});
			}

		},

		/**
		 * 获取当前登录用户信息
		 * @returns {{}}   用户信息
		 * 新版里 包含customerRole
		 */
		getCustomerUnite: function () {
			var unite = {};
			$.ajax({
				type: 'POST',
				url: path.getCustomerUnite,
				cache: false,
				dataType: 'json',
				async: false,
				success: function (rep) {
					if (rep && rep.responseObject) {
						unite = rep.responseObject;
						if (unite != null && unite != undefined) {
                            TempCache.setItem("customerRole",unite.customerRole);
                            TempCache.setItem("userId",unite.customerId);
							if(!TempCache.getItem("passwd")){
                                TempCache.setItem("passwd",unite.passwd);
							}
							if(unite.mobile){
								TempCache.setItem("mobile",unite.mobile);
							}
							if(unite.email){
								TempCache.setItem("email",unite.email);
							}
						}
					}
				},
				error: function (XMLHttpRequest, textStatus, errorThrown) {
				}
			});
			return unite;
		},

		/**
		 * 获取系统上传的图片
		 */
		getLogoUrlList: function (logoType, logoSpec, customerId) {
			var params = {};
			var data = {};
			var urlData = {};
			if (logoType && logoType !== "") {
				data.logoType = logoType;
			}
			if (logoSpec && logoSpec !== "") {
				data.logoSpec = logoSpec;
			}
			if (customerId && customerId !== "") {
				data.refId = customerId;
				params.paramJson = $.toJSON(data);
				$.ajax({
					type: 'POST',
					url: path.getLogoUrlList,
					data: params,
					cache: false,
					async: false,
					dataType: 'json',
					success: function (rep) {
						if (rep && rep.responseObject) {
							urlData = rep.responseObject;
						}
					},
					error: function (XMLHttpRequest, textStatus, errorThrown) {
					}
				});
			}
			return urlData;
		},

		/**
		 * 获取用户统计信息
		 * @param customerId
		 */
		getCustomerStatistics: function (customerId) {
			var statistics = {};
			$.ajax({
				type: 'get',
				url: path.getCustomerStatistics + "?customerId=" + customerId,
				cache: false,
				async: false,
				timeout: 20000,
				success: function callback(rep) {
					if (rep.responseObject) {
						statistics = rep.responseObject;
					}
				},
				error: function () {
				}
			});
			return statistics;
		},

		/**
		 * 退出
		 * */
		logout: function (obj) {
			TempCache.clear();
			comm.cookie.deleteFn("userId");//todo :病历夹子站删除cookie
			$.ajax({
				type: 'POST',
				url: PC_CALL + "customer/unite/logout/",
				cache: false,
				dataType: 'json',
				success: function (rep) {
					if (rep && rep.responseObject && rep.responseObject.responseStatus) {
						TempCache.clear();
						comm.cookie.deleteFn("userId");//todo :病历夹子站删除cookie
						obj && obj();
					}
				},
				error: function (XMLHttpRequest, textStatus, errorThrown) {
				}
			});
		},


		//====================与绑定医院、职称、专业表单有关的方法=====================

		renderHospitalAreasMedicalTitle: function () {
			var t = this;
			//lichunhui 修改 单位修改为选择
			$(".rz-num-type").find("div").on("click",function(){
				var index=$(this).index();
				$(this).addClass("on").siblings().removeClass("on");
				$(".onUnit").hide();
				$(".onUnit").eq(index).show();
			});
			//医院的自动搜索
			$("#company").lenovo({
				url: PC_CALL + "commdata/getHospitalList/",
				width: 340,
				showName: "hospitalName", //显示出的值
				id:"id",   //自定义属性值
				hiddenId:"companyId"    //自定义属性
			});
			//学校名称的选择   修改
			$("#schoolName").lenovo({
				url: path.university,
				width:340,
				showName:"schoolName",
				id:"schoolId",//自定义属性值
				hiddenId:"universityId"//自定义属性
			});
			var $LightBox = $(".LightBox-container");
			left = $LightBox.offset().left;
			top1 = $LightBox.offset().top + 200 + 57;
			top2 = $LightBox.offset().top + 290 + 57;
			top3 = $LightBox.offset().top + 100 + 57;
			//专业多选设置
			t.getTag();
			if (t.privDetails.NeedCompleteInfo) {
				//职称
				t.getmedData($("#medical_title"));
			} else {
				//职称
				t.getmedData($("#medical_title"));
			}
			if (t.customerAuth) {
				$("input[name=firstName]").val(t.customerAuth.firstName);
				$("input[name=lastName]").val(t.customerAuth.lastName);
				//医院
				$("#company").val(t.customerAuth.company);
				//修改
				$("input[name=schoolName]").val(t.customerAuth.schoolName);
				$("input[name=schoolName]").attr("companyId",t.customerAuth.schoolId);
				if(t.customerAuth.company){
					$(".rz-num-type").find("div").eq(0).click();
				}else if(t.customerAuth.schoolName){
					$(".rz-num-type").find("div").eq(1).click();
				}
				//setTimeout(function () {
				t.medicalInit();
				//}, 500);

				//setTimeout(function () {
				t.areaInit();
				//}, 500);
			}
		},
		getmedData: function ($this) {
			var t = this;
			$.ajax({
				type: "post",
				url: path.medical,
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
									$this.find(".p_l_zc_xl").css("bottom", -$this.find(".p_l_zc_xl").outerHeight());
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
								$this.find(".p_l_zc_xl").css("bottom", -$this.find(".p_l_zc_xl").outerHeight());
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
				url: path.dataTag,
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
		validateBeforeRenZhengSubmit: function () {
			var t = this;
			var qualificationPath = DOM.$container.find("#qualificationPath");
			var certificatesPath = DOM.$container.find("#certificatesPath");
			var flag = true;

			var medical = $(".medicalShow .tagName");
			var area = $("#proFieldshow .tagName");
			var areasExpertise = "";
			var medicalTitle = "";
			$.each(medical, function (i, em) {
				medicalTitle += $(em).attr("medicalid") + '_' + $(em).text() + ',';
			});

			$.each(area, function (i, em) {
				areasExpertise += $(em).attr("tagid") + '_' + $(em).text() + ',';
			});
			if (certificatesPath.val() !== "") {           //       || qualificationPath.val()
				validateHideErr(DOM.$container.find(".photo_error"));
			}
			if (medicalTitle) {
				validateHideErr(DOM.$container.find(".medical_error"));
			}
			if (areasExpertise) {
				validateHideErr(DOM.$container.find(".area_error"));
			}
			if (certificatesPath.val() === "") {           //&& qualificationPath.val() === ""
				validateShowErr(DOM.$container.find(".photo_error"), "<label>请上传证件照</label>");
				flag = false;
			}
			if (!medicalTitle) {
				validateShowErr(DOM.$container.find(".medical_error"), "<label>请选择职称</label>");
				flag = false;
			}
			if (!areasExpertise) {
				validateShowErr(DOM.$container.find(".area_error"), "<label>请选择专业</label>");
				flag = false;
			}
			return {
				flag: flag,
				medicalTitle: medicalTitle,
				areasExpertise: areasExpertise,
				certificatesPath: certificatesPath


			};
		},

		//======================其它的=====================================
		/**
		 * 打开登录域注册弹层时， 改变地址栏地址
		 * */
		changeHistory: function (type) {
			var t = this, state;
			if (type == "login") {
				state = {
					title: "登录网站",
					url: "/pages/singlePage/user/login.html",
					otherkey: null
				};
			} else {
				state = {
					title: "登录网站",
					url: "/pages/singlePage/user/renzheng.html",
					otherkey: null
				};
			}

			window.history.pushState(state, state.title, state.url);
			t.historyChanged = true;

			$(window).on("popstate", function () {
				// 获得存储在该历史记录点的json对象
				t.historyChanged = false;
				DOM.utils.end();
			});
		},
		//新版认证
		showAuthPage:function(){
			var t=this;
			if(t.options.noAuthTip){
                var onAuthCancel="";
                if(t.options.onAuthCancel){
                    onAuthCancel="?onAuthCancel=back";
                }
                g_sps.jump(null,'/pages/singlePage/user/auth.html'+onAuthCancel);
			}else{
                var html=template.authTip();
                if($(".ev_authTip").length){
                    $(".ev_authTip").show();
                }else{
                    $("body").append(html);
                }
                document.body.style.overflow = "hidden";
                $(".ev_authTipClose").off("click").on("click",function(){
                    $(".ev_authTip").hide();
                    t.cancelLogin();
                });
                $(".ev_authNow").off("click").on("click",function(){
                    var onAuthCancel="";
                    if(t.options.onAuthCancel){
                        onAuthCancel="?onAuthCancel=back";
                    }
                    g_sps.jump(null,'/pages/singlePage/user/auth.html'+onAuthCancel);
                });
			}
		}

	};

	controller.init();

	return {

		login: function (params) {
			controller.options = params;
			/**
			 *  权限详情
			 *  */
			controller.isRunning=false;
  			var privDetails = controller.analyzePrivDetails(params);
			controller.privDetails = privDetails;
			controller.login(params);
		},

		logout: function (options) {
			controller.logout(options);
		},

		showLoginPage: function () {
			var redirectUrl = comm.getpara() && comm.getpara().redirectUrl;
			if (redirectUrl != undefined && redirectUrl != null) {
				controller.redirectUrl = redirectUrl;
			}
			DOM.$body = $("body");
			controller.options = {
				callback: function () {
					if (controller.redirectUrl != undefined && controller.redirectUrl != null && controller.redirectUrl != "null") {
                        setTimeout(function() {
                            g_sps.jump(null, controller.redirectUrl);// 登录成功后
                        },1000);
					} else {
                        setTimeout(function() {
                        	g_sps.jump(null,"/");
                        },1000);
					}
				},
				close: "empty",
				scene: privilegeSceneConst.eSceneTypeLogin
			};
			controller.analyzePrivDetails(controller.options);
			DOM.showLoginPop();
		},

		/*显示联合登录页*/
		showUnionPage: function () {
			DOM.$body = $("body");
			controller.options = {
				callback: function () {
                    setTimeout(function() {
                    	g_sps.jump(null, document.referrer);
                    },1000);
				},
				close: "empty",
				scene: privilegeSceneConst.eSceneTypeAuth,
				onAuthCancel: "back"
			};
			controller.analyzePrivDetails(controller.options);
			DOM.showLianHePop();
		},

		getRenZhengStatus: function () {
			return controller.isRenZhengStatus;
		},

		getUserInfo: function () {
			return controller.userInfo;
		},
		//获取用户信息
		getCustomerUnit:function(){//用户角色 customerRole 1-系统、2-组织、3-厂商、4-患者、5-普通医生、6-认证医生
			return controller.getCustomerUnite();
		},

		getLoginStatus: function () {
			return controller.isLoginStatus;
		},

		/**
		 * 跳转到完善界面
		 * */
		changeAllinAccountBindingPop: function (username) {
			DOM.$body = $("body");
			controller.options = {
				callback: function () {
                    g_sps.jump(null,"/");
				},
				close: "empty",
				scene: privilegeSceneConst.eSceneTypeLogin
			};
			controller.responseMessage = this.responseMessage;
			controller.caosCustomerId = this.caosCustomerId;

			controller.analyzePrivDetails(controller.options);
			DOM.changeAllinAccountBindingPop(username);
		},

		show: function (call) {
			DOM.$body = $("body");
			controller.options = {};
			DOM[call]();
		},
		isRunning: function () {
			return controller.isRunning;
		}
	};
};
var user = module.user();

//首屏弹窗--认证提示，合并成功后修改密码
(function (){
	var openGuid={};
    openGuid = {
		template:{
			//认证首屏弹窗
            openAuthHtml : '<section class="al_openGuid ev_openAuth ev-guide" style="display: none">' +
            '        <section class="al_openGuidContent">' +
            '            <section class="guid_icon"><img src="/images/img10/authentication/guid_v.png"></section>' +
            '            <section class="guid_close ev_openAuthClose"></section>' +
            '            <h1 class="guid_title">立即认证，您将获得:</h1>' +
            '            <p>1.免费浏览与观看唯医所有资源</p>' +
            '            <p>2.骨科医生专属工具使用资格</p>' +
            '            <p>3.开启骨科在线执业</p>' +
            '            <button class="ev_openAuthNow">立即认证</button>' +
            '        </section>' +
            '    </section>',


            // //合并成功后修改密码
            // openUpdatePwd:'<section class="al_openGuid ev-guidUpdatePwd ev-guide" style="display: none">' +
            // '        <section class="al_openGuidUpdatePwd">' +
            // // '            <section class="guid_close ev-passClose"></section>' +
            // '            <h1 class="guid_title"><i></i><span>您的账号已合并成功</span></h1>' +
            // '            <section class="guid_tip">为了您的帐号安全，请在下方重置密码</section>' +
            // '            <section class="guid_input">' +//guid_error
            // '                <input placeholder="请输入新密码" type="password" class="ev-newPass">' +
            // '                <section class="error_tip ev_newPwdError" style="display: none"><i></i><span>请输入正确的密码</span></section>' +
            // '            </section>' +
            // '            <section class="guid_input">' +
            // '                <input placeholder="请再次输入新密码" type="password" class="ev-NextnewPass">' +
            // '                <section class="error_tip ev_newPwdError" style="display: none"><i></i><span>两次密码输入的不一致</span></section>' +
            // '            </section>' +
            // '            <button class="ev-resetBtnPass" data-isActive="true">重置密码</button>' +
            // '        </section>' +
            // '    </section>'
		},
		init:function(){
			this.guidAuth();
		},
		//认证弹窗
        guidAuth:function(){
			var t=this;
            $.ajax({
                url:PC_CALL + '/customer/unite/isPopUpAuthFrame/',
				type:'post',
				dataType:'json',
				data:{
                	paramJson:JSON.stringify({
                        customerId:localStorage.getItem('userId'),
                        visitSiteId:1
					})
				},
				success:function (data) {
					if(data&&data.responseObject&&data.responseObject.responseData&&data.responseObject.responseData.isPopUp){
						var customerRole = TempCache.getItem("customerRole");

						if (data.responseObject.responseData.isPopUp == 1) {
							if(customerRole && (customerRole =="14" || customerRole =="15" )) {
								comm.alertBox({
									title:'入驻唯医',
									content:'成功入驻享受以下权益：<br>' +
									'1. 十万+精彩资源免费浏览<br>' +
									'2. 品牌下展示个人身份信息<br>' +
									'3. 手动曝光产品在唯医展示',
									ensure:'入驻唯医',
									ensureCallback:function(){
										window.location.href = "/pages/singlePage/user/companyAuth.html";
									}
								});
							}else{
								$("body").append(t.template.openAuthHtml);
								if (localStorage.getItem('indexAdDelivery')) {
									$('.ev_openAuth').show();
								}
								document.body.style.overflow = "hidden";
								t.mianAction();
							}
						}
					}
                }
            })
		},
        // //合并通知改密码
        // guidAuthPass:function () {
			// var t=this;
        //     $.ajax({
        //         url:'//www.allinmd.cn/call/customer/unite/isPopUpAuthFrame/',
        //         type:'GET',
        //         dataType:'json',
        //         data:{
        //             paramJson:JSON.stringify({
        //                 customerId:localStorage.getItem('userId'),
        //                 visitSiteId:1
        //             })
        //         },
        //         success:function (data) {
        //             if(data&&data.responseObject&&data.responseObject.responseData&&data.responseObject.responseData.isPopUp){
        //                 if(data.responseObject.responseData.isPopUp==1){
        //                     $("body").append(t.template.openUpdatePwd);
        //                     if(localStorage.getItem('indexAdDelivery')){
        //                         $('.ev-guidUpdatePwd').show();
        //                     }
        //                     document.body.style.overflow = "hidden";
        //                     t.passAction();
        //                 }
        //
        //             }
        //         }
        //
        //     });
        // },
		//认证弹窗处理
		mianAction:function(){
			var t=this;
            $(".ev_openAuthClose").on("click",function(){
                $(".ev_openAuth").remove();
                document.body.style.overflow = "auto";
            //    发消息
                t.sendMessage();
            });
            $(".ev_openAuthNow").on("click",function(){
                $(".ev_openAuth").remove();
                document.body.style.overflow = "auto";
                window.location.href='//www.allinmd.cn/pages/singlePage/user/auth.html'
            });
		},
        //发送认证消息
		sendMessage:function () {
		   $.ajax({
			   url:PC_CALL+'customer/message/createInviteAuthMessage/',
			   type:'post',
			   dataType:'json',
			   data:{
                   paramJson:JSON.stringify({
                       customerId:localStorage.getItem('userId'),
                       visitSiteId:1
				   })
			   },
			   success:function (data) {
				   // console.log(data)
               }
		   })
        },
        // //修改密码弹窗处理
        // passAction:function () {
        //     // $('.ev-passClose').off('click').on('click',function () {
			// 	// $('.ev-guidUpdatePwd').remove();
        //     //     document.body.style.overflow = "auto";
        //     // });
			// $('.ev-newPass').on('keyup',function () {
			// 	$(this).val($(this).val().replace(' ',''));
        //         $(this).parent().removeClass('guid_error').find('.ev_newPwdError').hide();
        //     })
			// 	.on('blur',function () {
			// 	if($(this).val()){
			// 		if($(this).val().length<6||$(this).val().length<6>20){
        //                 $(this).parent().addClass('guid_error').find('.ev_newPwdError').show().find('span').text('密码长度请保持在{6}-{20}位');
			// 		}
			// 	}else {
        //             $(this).parent().addClass('guid_error').find('.ev_newPwdError').show().find('span').text('请输入新密码');
			// 	}
        //     });
        //     $('.ev-NextnewPass').on('keyup',function () {
        //         $(this).parent().removeClass('guid_error').find('.ev_newPwdError').hide();
        //     })
			// 	.on('blur',function () {
        //         if($(this).val()&&$(this).val()!=$('.ev-newPass').val()){
        //         	$(this).parent().addClass('guid_error').find('.ev_newPwdError').show().find('span').text('两次密码输入的不一致');
        //         }else if(!$(this).val()){
        //             $(this).parent().addClass('guid_error').find('.ev_newPwdError').show().find('span').text('请再次输入新密码');
        //         }
        //     });
			// $('.ev-resetBtnPass').off('click').on('click',function () {
        //         var data = {
        //             "newPasswd":$('.ev-newPass').val(),
        //             "rePasswd": $('.ev-NextnewPass').val()
        //         };
			// 	if(
			// 		$(this).attr('data-isActive')=='true'&&
        //             data.newPasswd&&
			// 		data.rePasswd&&
        //             data.newPasswd==data.rePasswd
			// 	){
        //             $.ajax({
        //                 type: "get",
        //                 url: PC_CALL + "customer/unite/update_passwd/",
        //                 data: data,
        //                 dataType: "json",
        //                 success: function (data) {
        //                     if (data.rows.responseStatus) {
        //                         $('.ev-guidUpdatePwd').remove();
        //                             document.body.style.overflow = "auto";
        //                     }
        //
        //                 },
        //                 error: function (XMLHttpRequest, textStatus, errorThrown) {
        //                     alert(textStatus + " " + errorThrown);
        //                 }
        //             });
			// 	}
        //     })
        // }
	}
    if(window.location.pathname=='/'&&localStorage.getItem('userId')){
        openGuid.init();
    }
}());
