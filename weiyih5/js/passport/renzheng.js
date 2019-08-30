// 本页已不再使用。 刘宇涛 11-09  页中的uploadLogo地址为旧的。


jQuery.validator.addMethod("isChinese", function(value, element) {
    return this.optional(element) ||/^[\u4e00-\u9fa5]{1,25}$/.test(value) || /^[A-Za-z_]{1,50}$/.test(value);
}, "请输入中文或字母");

// 身份证较验
jQuery.validator.addMethod("zhengjian", function(value, element) {
   /* var zhengjianType = $("#certificatesId").val();
    if(zhengjianType == "1"){	//若为身份证*/
        return this.optional(element) || /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X|x)$/.test(value);
   /* }else{
        return this.optional(element) || /^[A-Za-z0-9\u4e00-\u9fa5]{1,50}$/.test(value);
    }*/
}, "你还没填写证件号码。");
// 会员证件
jQuery.validator.addMethod("zhengjian2", function(value, element) {
    var chrnum = /^([A-Za-z0-9]+)$/;
    return this.optional(element) || (chrnum.test(value));
}, "请填写正确的证件号码。");

jQuery.validator.addMethod("allinEmail", function(value, element) {
    var allinEmail = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return this.optional(element) || (allinEmail.test(value));
}, "不像是有效的电子邮箱");


jQuery.validator.addMethod("requiredcertificate", function(value, element) {
    return $("#certificatesId").val()!="-1";
}, "请选择证件类型");


$("#renzhengPage").ready(function(){
    renzhengPageInit();
});


function renzhengPageInit() {
    comm.bindReturnBtn("");
    comm.initInputFocusEvent();


	loadCertificate();
    // 若是无权限 跳转过来的则
    if(comm.getpara() && typeof comm.getpara()!="undefined" && comm.getpara().type=="needAuth")
    {
        $(".para").html("只有认证医师才能执行此操作!<br/>请认证你的医师身份 ");
    }
    if(comm.getpara() && typeof comm.getpara()!="undefined" )
    {
       var firstName=comm.getpara().firstName;
       var lastName=comm.getpara().lastName;
       if(firstName && firstName!=""){
    	   $("input[name=firstName]").val(firstName) 
       }
       if(lastName && lastName!=""){
    	   $("input[name=lastName]").val(lastName) 
       }
    }

    $("input").each(function () {
        $(this).parent().removeClass("ui-shadow-inset");
    });
    $("#renzhengForm").validate({
        submitHandler: function () {
            renzhengSubmit();
        },
        rules : {
            "lastName" : {
                "required" : true,
                "rangelength":[1,50],
                "isChinese":true
            },
            "firstName" : {
                "required" : true,
                "rangelength":[1,50],
                "isChinese":true
            },
//            "certificatesCode":{
//               // "required" : true,
//                "zhengjian":true,
//                "chrnum":true
//            },
            "attCode":{
                "required" : true,
                "rangelength":[1,50],
                "zhengjian2":true
            }

        },
        messages : {
            "lastName" : {
                "required" : "您贵姓？",
                "rangelength" : "最大长度50个字符！",
                "isChinese":"您贵姓？"
            },
            "firstName" : {
                "required" : "你的大名是？",
                "rangelength":"最大长度50个字符！",
                "isChinese":"你的大名是？"
            },
//            "certificatesCode":{
//                //"required" : "请填写正确的身份证件号。",
//                "zhengjian":"请填写正确的身份证件号。"
//            },
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


    //为什么
    $(".para a").on("vclick",function(){
        popup("唯医是一个专业的医生社区，为保障你的权益。我们需要认证你的医师身份。谢谢配合。");
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
                attCode:$("input[name=attCode]").val()
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
            		user.success("已提交认证，请等待审核！"); 
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



    bind1('//img50.allinmd.cn/v3/images/images/images/toupload.png');
    bind2('//img50.allinmd.cn/new-login/upload2.png');

    $("#upload").on("vclick",function(){
        $("#uploadDiv").show();
        $("#uploadLayer").show();
    });

    $("#cancel").on("vclick",function(){
        $("#uploadDiv").hide();
        $("#uploadLayer").hide();
    });

    $("#notRenZheng").on("vclick",function(){
        //var t = document.referrer;
    	var t = "/";
        var fromPage = TempCache.getItem("fromPage");
        if(fromPage!=undefined && fromPage!="") {
            t = fromPage
        }
        user.getSessionInfo();
        g_sps.jump(null,t);

    });
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
                			if(i.refValue.indexOf("医师资格证")>-1){
                				html+='<div class="option">' +
                                    '<div class="radio"><img src="//img50.allinmd.cn/case/radio_click.png" name="certificate" title="'+i.refId+'"/></div> <span>' +
                                        i.refValue  +
                                        '</span>' +
                                    '</div>';
                			}else{
                				html+='<div class="option">' +
                                    '<div class="radio"><img src="//img50.allinmd.cn/case/radio_mr.png" name="certificate" title="'+i.refId+'" /></div><span>' +
                                    i.refValue  +
                                    '</span>' +
                                    '</div>';
                			}
                			
                		});
                	}           	
                }

                html+='<div class="clear"></div>';
                $("#attTypeRadio").html(html);


                $(".radio").each(function(i,em){
                    $(em).on("vclick",function(){
                        $(".radio img").attr("src","//img50.allinmd.cn/case/radio_mr.png");
                        $(em).find("img").attr("src","//img50.allinmd.cn/case/radio_click.png");
                        $("#certificate").val($(em).attr("title"));
                        $("#attCode").attr("placeholder",$(em).siblings().text()+"号");
                    });
                });

            }
	    });
  }  
  
}


function bind1(picpath){
    if($("#uploadPic1 [id^=czyx]").length>0){
        $("#uploadPic1").html('<input type="file"    id="file1" name="file" data-role="none" />');
       // $("#uploadPic1 input").textinput();
    }
    czyx.uploadReplace('#file1',{
        url:commdata.urlList.uploadLogo.url, //文件处理的URL,
        data:{imageType:"2"},
        uploadReplaceCss:{
            //设置上传按钮图片
            background:'url('+ picpath +') center no-repeat',
            backgroundSize:'100%',
            width:"100%",             //上传按钮的宽度
            height:"10em",              //上传按钮的高度
            marginTop:"0.5em",
            overflow:"hidden"
        },
        uploadInputCss:{
            width:"90%",             //上传按钮的宽度
            height:"5.5em"             //上传按钮的高度
        },
        uploadBefore:function(){
            if(!/\.((jpg)|(JPG)|(gif)|(GIF)|(png)|(PNG))$/i.test(this.value)){
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
                        changeSize(this,120,100);
                    });

                    bind1("//img50.allinmd.cn/v3/images/images/uoploaded-mask_03_03.png");
                }else{
                    popup(serverJson.responseObject.responseMessage);
                }
            }catch(e){
            	popup('上传失败');
                return ;
            }
        }
    });
}

function bind2(picpath){
    if($("#uploadPic2 [id^=czyx]").length>0){
        $("#uploadPic2").html('<input type="file"    id="file2" name="file" />');
       // $("#uploadPic2 input").textinput();
    }
    czyx.uploadReplace('#file2',{
        url:commdata.urlList.uploadLogo.url, //文件处理的URL,
        data:{imageType:"2"},
        uploadReplaceCss:{
            //设置上传按钮图片
            background:'url('+ picpath +') center no-repeat',
            backgroundSize:'100%',
            width:"100%",             //上传按钮的宽度
            height:"10em",              //上传按钮的高度
            marginTop:"0.5em"
        },
        uploadInputCss:{
            width:"100%",             //上传按钮的宽度
            height:"9em"             //上传按钮的高度
        },
        uploadBefore:function(){
            if(!/\.((jpg)|(gif)|(png))$/i.test(this.value)){
                popup('只允许上传.jpg .gif .png类型的图片文件');
                return false ;
            }

        },
        uploadEnd:function(serverJson){//上传完毕后调用
            //this.style.display = 'block';
            try{
                serverJson = $.parseJSON($(serverJson).html());
                if(serverJson.responseObject.responseStatus) {

                    popup("证件上传成功")
                    $("#qualificationCodePic").val(serverJson.responseObject.responseMessage.path);
                    //$("#uploadPic2").html("<img src='"+ serverJson.responseObject.responseMessage.url +"' />");
                    bind2(serverJson.responseObject.responseMessage.url);
                }
            }catch(e){
                popup('上传失败');
                t.img = null;
                return ;
            }
        }
    });
}


