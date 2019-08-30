/**
 * 功能描述：  微信认证
 * 使用方法:    当用户在微信上扫描了二维码后，微信公众号向用户推送一条消息，
 *                  这条消息会带一个认证链接，
 *                  点击此链接，会使用户在h5端创建session 并在登录后跳转到本微信认证页。
 * 注意事件：
 * 引入来源：  作用：
 *
 * Created by LiuYuTao on 2015/11/5.
 */

//加载医师证件选项
function loadCertificate(){
	var param={roleId:6,typeId:1};
	$.ajax({
		type: 'POST',
		url: commdata.urlList.getDataRoleConfigs.url,
		data:{paramJson:$.toJSON(param)},
		async: false,
		dataType: "json",
		timeout: 10000,
		success: function callback(rep) {
			var html="";
			if (rep && rep.responseObject && rep.responseObject.responseStatus) {
				var data=rep.responseObject.responseMessage;
				if(data && data.length>1){
					$.each(data,function(index,i){
						if(i.refId==10){
							html+='<div class="option">' +
								'<div class="radio" title="'+ i.refId +'"><img src="//img50.allinmd.cn/form/radio-selected.png" name="certificate" title="'+i.refId+'"/></div> <span>' +
								i.refValue  +
								'</span>' +
								'</div>';
						}else{
							html+='<div class="option">' +
								'<div class="radio"  title="'+ i.refId +'"><img src="//img50.allinmd.cn/form/radio-normal.png" name="certificate" title="'+i.refId+'" /></div><span>' +
								i.refValue  +
								'</span>' +
								'</div>';
						}

					});
				}
			}

			html+='<div class="clear"></div>';
			$("#attTypeRadio").html(html);
			if($("#attTypeRadio .radio").eq(0).attr("title")==10){
				$(".v3-input_parent").hide();
			}
			$(".radio").each(function(i,em){
				$(em).on("vclick",function(){
					if($(em).attr("title")==10){
						$(".v3-input_parent").hide();
					}else{
						$(".v3-input_parent").show();
					}
					$(".radio img").attr("src","//img50.allinmd.cn/form/radio-normal.png");
					$(em).find("img").attr("src","//img50.allinmd.cn/form/radio-selected.png");
					$("#certificate").val($(em).attr("title"));
					$("#attCode").attr("placeholder","请输入"+$(em).siblings().text()+"号");

					$(".upload-text").text("上传"+ $(em).siblings().text() + "照片")
				}); ;
			});

		}
	});
}

jQuery.validator.addMethod("zhengjian2", function(value, element) {
	var chrnum = /^([A-Za-z0-9]+)$/;
	return this.optional(element) || (chrnum.test(value));
}, "请填写正确的证件号码。");

$(function () {
	renzhengPageInit();


	$("#ok").on("vclick", function () {
    g_sps.jump(null,"/");
	});

	$(".head-close-right").on("vclick", function () {
    g_sps.jump(null,"/");
	})
});


function renzhengPageInit() {
	comm.initInputFocusEvent();

	loadCertificate();
	// 若是无权限 跳转过来的则
	if(comm.getpara() && typeof comm.getpara()!="undefined" && comm.getpara().type=="needAuth")
	{
		$(".para").html("只有认证医师才能执行此操作!<br/>请认证你的医师身份 ");
	}

	$("input").each(function () {
		$(this).parent().removeClass("ui-shadow-inset");
	});
	$("#renzhengForm").validate({
		submitHandler: function () {
			renzhengSubmit();
		},
		rules : {
			"attCode":{
				"required" : true,
				"rangelength":[1,50],
				"zhengjian2":true
			}

		},
		messages : {
			"attCode":{
				"required" : "请填写正确的证件号码。",
				"rangelength":"请填写正确的证件号码",
				"zhengjian2":"请填写正确的证件号码"
			}
		},
		errorPlacement:function(error,element){
			var con = $(element).parent().parent().find(".l_warning");
			con.html(error);
			$(element).parent().parent().addClass("input_error");
		},
		success:function(element){
			$(element).parents(".input_error").removeClass("input_error");
			$(element).parent().empty();
		},
		onkeyup: false

	});

	$("#submit").on('vclick', function () {
		$("#renzhengForm").submit();
	});

	function renzhengSubmit() {

		var param;
		// 判断图片是否保存成功
		var qualificationPath = $("#qualificationCodePic");
		var certificatesPath = $("#certificatesCodePic");
		var attType=1;

		if(certificatesPath.val()==""){
			popup("请上传证件照片");	// 上传图片错误提示
			return false;
		}else{
			param = {
				lastName: $("input[name=lastName]").val(),
				firstName: $("input[name=firstName]").val(),
				attType:$("#certificate").val(),
				attPath:$("input[name=certificatesCodePic]").val(),
				attCode:$("input[name=attCode]").val() ,
				opflag:2
			};
		}

		var rst = customer.execute("createAuth",param);
		if(rst.responseStatus){
			user.getSessionInfo();
			var isFollow=comm.getpara().isFollow;
			if(isFollow=="1"){
				comm.redirect("/pages/passport/regist_tag.html",0);
			}else{
				if(rst && rst.responseCode=="0B0101" || rst.responseCode=="0B0102"){
					//user.success("已提交认证，请等待审核！");
					$("#cancel_mask").show();

				}else{
					user.success("认证成功，即将返回来原页");
				}

			}

		}else{
			if(rst && rst.responseCode=="0B0101" || rst.responseCode=="0B0102"){
				popup("已提交认证，请等待审核！");
			}else{
				popup(rst.responseMessage);
			}
		}
	}

	bind1('//img50.allinmd.cn/pages/passport/upload.jpg');
}


function bind1(picpath){
	if($("#uploadPic1 [id^=czyx]").length>0){
		$("#uploadPic1").html('<input type="file"    id="file1" name="file" data-role="none" />');
		// $("#uploadPic1 input").textinput();
	}
	var paramJson=$.toJSON({imageType:"2"});
	czyx.uploadReplace('#file1',{

		url:"/mcall/comm/upload_attachment/upload/", //文件处理的URL,
		data:{paramJson:paramJson},
		uploadReplaceCss:{
			//设置上传按钮图片
			background:'url('+ picpath +') center no-repeat',
			backgroundSize:'100%',
			width:"100%",             //上传按钮的宽度
			height:"234px",              //上传按钮的高度
			overflow:"hidden"
		},
		uploadInputCss:{
			width:"100%",             //上传按钮的宽度
			height:"234px"             //上传按钮的高度
		},
		uploadBefore:function(){
			if(!/\.((jpg)|(jpeg)|(gif)|(png))$/i.test(this.value)){
				popup('只允许上传.jpg .gif .png类型的图片文件');
				return false ;
			}
			var fileSize =comm.getFileSize(document.getElementById("file1"));
			if(fileSize>5242880){
				popup('图片不能大于'+5242880/1048576+"M");
				return false;
			}
			$.mobile.loading('show', {
				text: '上传中...', //加载器中显示的文字
				textVisible: true, //是否显示文字
				theme: 'a',        //加载器主题样式a-e
				textonly: false,   //是否只显示文字
				html: ""           //要显示的html内容，如图片等
			});
		},
		uploadEnd:function(serverJson){//上传完毕后调用
			//this.style.display = 'block';
			$.mobile.loading('hide');
			try{

				serverJson = $.parseJSON($(serverJson).html());
				if(serverJson.responseObject.responseStatus) {

					//popup("证件上传成功")    // serverJson.responseObject.responseMessage.url
					$("#certificatesCodePic").val(serverJson.responseObject.responseMessage.path);


					//$(".click_up").html('<img src="' + serverJson['url'] + '" onload="changeSize(this,325,325);clearImgs();" />');
					$("#uploadedImg img").attr("src", serverJson.responseObject.responseMessage.url);

					$("#uploadedImg img").on("load",function(){
						changeSize(this,$("#uploadedImg").width(),232);
					});

					bind1("//img50.allinmd.cn/pages/passport/mask.png");
				}else{
					popup(serverJson.responseObject.responseMessage);
				}
			}catch(e){
				popup('上传失败');
				return;
			}
		}
	});
}
