/**
 * 功能描述：  视频病例pk模块
 * 使用方法:   module.videoCasePk({
                    enrollBtn:$("#xxx"),//创建点击btn
                    container:$(".personal_content"),//存放弹层的外层
                    top:126,//弹层top值
                    userImg:1,//是否有用户头像
                    isEnroll:1,//是否报过名
                    activityId:XXX,
                    needGoDetail:1,//需要跳转终端页
                    callback:function(){},//回调函数

                });
 * 注意事件：
 * 引入来源：  作用：
 *
 * Created by LiChunHui on 2015/11/10.
 */
module.videoCasePk=function(obj){
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
    controller= {
        config: {
            imgPath: "//modules.allinmd.cn/video-case-pk/"
        },
        el: {},
        path: {
            getAreaExpertise: PC_CALL+"commdata/getAreaExpertise/",
            getInfo:PC_CALL+"customer/auth/getAuthBycustomerId/",
            getUser:PC_CALL+"web/user/getWebUser/",
            getList:PC_CALL+"activity/property/getMapList/",//获取专业和术士
            getActivity:PC_CALL+"cms/activity/getMapList/",
            activCreate:PC_CALL+"activity/register/create/",
            getRegisterStatus:PC_CALL+"activity/register/getRegisterStatus/"//获取报名状态
        },
        template:{
            firstTem:function(option){
                var html="";
                html+='<div class="doc_tc" id="firstStep" style="top:'+option.top+'px;'+(option.left?"left:"+option.left+"px":"")+'">'+
                    '<!-- 遮罩 -->'+
                    '<div class="publish_mask">'+
                    '<img src="//modules.allinmd.cn/video-case-pk/images/loading6060.gif" />'+
                    '</div>'+
                    (option.userImg?'<div class="tc_jiao"></div><div class="channel_right_user_img"><img src="'+option.userImg+'"/></div>':'')+
                    '<div class="fb_doc">'+
                    '<div class="pk_close"><img src="//modules.allinmd.cn/video-case-pk/images/popup_close.png"></div>'+
                    '<div class="doc_tc_bg"></div>'+
                    '<div class="form_all module-user ">'+
                    '<h2 class="all_h">个人信息</h2>'+
                    '<p class="all_p">请填写以下信息，完成报名</p>'+
                    '<form id="enrollForm">'+
                    '<div class="inputParent rz_input">'+
                    '<div class=" input-wrap input-border">'+
                    '<div class="jinggao"></div>'+
                    '<div class="ok"></div>'+
                    '<input type="text" placeholder="姓名"  tabindex="5" name="name" id="name"/>'+
                    '</div>'+
                    '<div class="l_warning"></div>'+
                    '</div>'+
                    '<div class="inputParent rz_input">'+
                    '<div class=" input-wrap input-border">'+
                    '<div class="jinggao"></div>'+
                    '<div class="ok"></div>'+
                    '<input type="text" placeholder="医院"  tabindex="5" name="company" id="company"/>'+
                    '</div>'+
                    '<div class="l_warning"></div>'+
                    '</div>'+
                    '<div class="inputParent rz_input">'+
                    '<div class="lk_input input-wrap input-border" id="medical_title" >'+
                    '<div class="jinggao"></div>'+
                    '<div class="ok"></div>'+
                    '<div class="input_name">职称</div>'+
                    '<ul class="medicalShow"></ul>'+
                    '</div>'+
                    '<div class="l_warning medical_error"></div>'+
                    '</div>'+
                    '<div class="inputParent rz_input">'+
                    '<div class=" input-wrap input-border">'+
                    '<div class="jinggao"></div>'+
                    '<div class="ok"></div>'+
                    '<input type="text" placeholder="邮箱"  tabindex="5" name="email" id="email"/>'+
                    '</div>'+
                    '<div class="l_warning"></div>'+
                    '</div>'+
                    '<div class="inputParent rz_input">'+
                    '<div class=" input-wrap input-border">'+
                    '<div class="jinggao"></div>'+
                    '<div class="ok"></div>'+
                    '<input type="text" placeholder="电话"  tabindex="5" name="mobile" id="mobile"/>'+
                    '</div>'+
                    '<div class="l_warning"></div>'+
                    '</div>'+

                    '<!-- 弹出工作职称下拉框 -->'+
                    '<div id="medicalMenu" class="xmenu" style="display: none; left:0">'+
                    '<div class="select-info">'+
                    '<label class="top-label">已选职称：</label>'+
                    '<ul></ul>'+
                    '<a name="menu-confirm" href="javascript:void(0);" class="a-btn">'+
                    '<span class="a-btn-text">确定</span>'+
                    '</a>'+
                    '</div>'+
                    '<dl></dl>'+
                    '</div>'+
                    '</form>'+
                    '<div class="wu_y">'+
                    '<a class="btn_bao btn_bnn" href="javascript:;" type="button" id="submit_btn" status="0">立即报名</a>'+
                    '</div>'+
                    '</div>'+
                    '</div>'+
                '<div>';

                return html;
            },
            secondTem:function(option){
                var html="";
                html+='<div class="doc_tc" id="secondStep" style="top:'+option.top+'px;'+(option.left?"left:"+option.left+"px":"")+'">'+
                (option.userImg?'<div class="tc_jiao"></div><div class="channel_right_user_img"><img src="'+option.userImg+'"/></div>':'')+
                    '<div class="fb_doc">'+
                        '<div class="pk_close"><img src="//modules.allinmd.cn/video-case-pk/images/popup_close.png"></div>'+
                        '<div class="doc_tc_bg"></div>'+
                        '<div class="enroll_success">'+
                            '<div class="content_bar">'+
                                '<div class="cheng_g"><div class="bm_suc"></div>恭喜你，报名成功<div class="clear"></div></div>'+
                                '<p class="content_p">接下来你想...</p>'+
                                '<div class="bao_z">'+
                                    '<div class="contener_1">'+
                                        '<img src="'+option.imgPath+'images/pk-case.jpg" class="in-third" type="case"/><br/>'+
                                        '<a href="javascript:;" class="btn_1 in-third" type="case">上传病例</a>'+
                                    '</div>'+
                                    '<div class="contener_2">'+
                                        '<img src="'+option.imgPath+'images/pk-video.jpg" class="in-third" type="video"/><br/>'+
                                        '<a href="javascript:;" class="btn_1 in-third" type="video">上传视频</a>'+
                                    '</div>'+
                                    '<div class="clear"></div>'+
                                '</div>'+
                            '</div>'+
                            '<a class="content_3" href="javascript:;" id="later_cancel">稍后上传</a>'+
                        '</div>'+
                    '</div>'+
                '<div>';

                return html;
            },
            thirdTem:function(option){
                var html="";
                html+='<div class="doc_tc" id="thirdStep" style="top:'+option.top+'px;'+(option.left?"left:"+option.left+"px":"")+'">'+
                (option.userImg?'<div class="tc_jiao"></div><div class="channel_right_user_img"><img src="'+option.userImg+'"/></div>':'')+
                    '<div class="fb_doc">'+
                        '<div class="pk_close"><img src="//modules.allinmd.cn/video-case-pk/images/popup_close.png"></div>'+
                        '<div class="doc_tc_bg"></div>'+
                        '<div class="content_all">'+
                            '<p class="title_1">请选择作品所属的专业及术式</p>'+
                            '<div class="contener">'+
                                '<div class="pk_one">'+
                                    '<p class="title_2">所属专业</p>'+
                                    '<ul class="oen_pk" id="areExp_list">'+

                                    '</ul>'+
                                '</div>'+
                                '<div class="pk_two_hidden">'+
                                    '<p class="title_3">术式</p>'+
                                    '<div class="shushi_content">'+

                                    '</div>'+
                                '</div>'+
                            '</div>'+
                            '<div class="wu_y">'+
                            '<a href="javascript:;" class="content_btn1" id="in-upload">下一步</a>'+
                            '<a href="javascript:;" class="content_btn2" id="back">返回</a>'+
                            '</div>'+
                        '</div>'+
                    '</div>'+
                '<div>';

                return html;
            }
        },
        init:function(obj){
            var t=this;
            this.options={};
            var o={
                container:$("body")
            };
            this.options= $.extend(o,obj);
            this.inEnroll();
        },
        //获取活动信息
        getActivity:function(){
            var t=this;
            $.ajax({
                type : "post",
                url : t.path.getActivity,
                async:false,
                data : {paramJson: $.toJSON({pageIndex:1,pageSize:1})},
                dataType : "json",
                success : function(rep){
                    if(rep.responseObject.responseData&&rep.responseObject.responseData.list.length>0){
                        t.activityId=rep.responseObject.responseData.list[0].activityId.toString();
                    }
                },
                error:function(){}
            });
        },
        close:function(){
            var t=this;
            $(".pk_close").on("click",function(){
                $(".select_tc").remove();
                $("#secondStep").remove();
                $(this).parents(".doc_tc").remove();
                comm.LightBox.hide();
                if(t.options.videoPKList){t.options.videoPKList();}
                //事件埋点
                comm.creatEvent({
                    triggerType:"全站功能按钮点击",
                    keyword:"视频PK报名弹层关闭",
                    actionId:43
                });
            })
        },
        //进入报名
        inEnroll:function(){
            var t=this;
            this.options.enrollBtn.off("click").on("click",function() {
                if(t.options.toTop){//需要到页面顶部
                    $(document).scrollTop(0);
                }
                if(!t.options.top){
                    t.options.top=$(document).scrollTop()+50;
                    t.options.left=($(window).width()-713)/2;
                }
                if(t.options.activityId){
                    t.activityId=t.options.activityId.toString();
                }else{
                    t.getActivity();
                }
               
                if(t.options.isEnroll){//报过名
                    if(t.options.type){//在外面选择过类型进来后跳过第二步
                        t.thirdStep(1);
                    }else{
                        t.secondStep();
                    }
                    if(t.options.videoPKList){t.options.videoPKList();}
                }else{
                    if(t.options.type) {//在外面选择过类型进来后跳过第二步且已经判断过权限
                        t.firstOrSecond();
                    }else{
                    	user.login({
                            callback:function(){
                            	var isReviewed=isReviewerPK3();
                            	 $("#activityId").attr("expert",isReviewed);
                            	 if(!$('#activityId').attr('registerStatus')){
                            	 	$.ajax({
							            type : "post",
							            url : PC_CALL+"activity/register/getRegisterStatus/",//获取报名状态
							            data : {paramJson: $.toJSON({customerId:$("#sesCustomerId").val(),activityId:$("#activityId").val()})},
							            dataType : "json",
							            async:false,
							            success : function(rep){
							                if(rep.responseObject.responseData){
							                	var num = rep.responseObject.responseData.registerStatus;
							                    if(num==1){//没有报名
							                    	if($('#activityId').length){$('#activityId').attr('registerStatus',1);}
							                        if($(".nav_bm a").length){$(".nav_bm a").text("立即报名");}						                       
							                    }else if(num>=2){//报过名
							                    	if($('#activityId').length){$('#activityId').attr('registerStatus',num);}
							                        if($(".nav_bm a").length){$(".nav_bm a").text("立即上传");}						                      
							                    }
							                }
							            }
						        	});
                            	 }
                            	 
                            	if($("#activityId").attr("expert")==1){
                            		$(".nav_zx_a").text("作品审核");
        							$(".nav_bm").remove();
        							if($('#Ev-NavList').length){$('#Ev-NavList').show();}
        							$('.gr_center_con').hide();
        							vPKCheck();
                            	}else{
                            		t.firstOrSecond();
                            		if(t.options.videoPKList){t.options.videoPKList();}
                            	}
                                
                            },
		                   scene:privilegeSceneConst.eSceneTypeVideoPK
                        })
                    }
                }
                //事件埋点
                comm.creatEvent({
                    triggerType:"发布",
                    keyword:"发布视频",
                    actionId: 38
                });

            });
        },
        //是否报名确定是否需要第一步填写报名信息
        firstOrSecond:function(){
            var t=this;
            t.options.callback&& t.options.callback();//回调函数            
            $.ajax({
                type : "post",
                url : t.path.getUser,
                dataType : "json",
                async: false,
                success : function(rep){
                    if (rep.responseObject) {
                        t.userData = rep.responseObject.responseMessage;
                        if($('.gr_cen_ts').length){
			            	$('.gr_cen_ts').hide();
	                       
			            }
                    }
                },
                error:function(){}
            });
            $.ajax({
                type : "post",
                url : t.path.getRegisterStatus,
                data : {paramJson: $.toJSON({customerId: t.userData.userId,activityId:t.activityId})},
                dataType : "json",
                success : function(rep){
                    if(rep.responseObject.responseData&&rep.responseObject.responseData.registerStatus==1){//未报名 需要填写信息
                        t.firstStep();
                        t.needFirst=true;
                    }else{
                        if(t.options.type){//在外面选择过类型进来后跳过第二步
                            t.thirdStep();
                        }else{
                            t.secondStep();
                        }

                    }
                },
                error:function(){}
            });//if(t.options.hadUpload){                            			t.options.hadUpload();                            		}
        },
        //第一步填写报名信息
        firstStep:function(){
            var t=this;
            t.options.container.css("position","relative");
            comm.LightBox.show(95,"#3c3c3d");
            comm.LightBox.setZIndex(8);
            t.options.container.append(t.template.firstTem({
                top:t.options.top,
                left: t.options.left,
                userImg:t.options.userImg,
                imgPath:t.config.imgPath
            }));

            t.getInfo();
            $("#firstStep").find("input[placeholder]").placeholder();	// 表单默认值 插件
            $("#firstStep").find("input[placeholder]").bind("keyup keydown change input cut paste drop", function () {
                t.submitToggle();
            });
            $("#company").lenovo({
                url: PC_CALL+"commdata/getHospitalList/",
                width: 340,
                id:"id",
                hiddenId:"hid",
                showName: "hospitalName" //显示出的值
            });
            left=$("#firstStep").offset().left;
            top1=$("#firstStep").offset().top;
            $("#medical_title").xMenunew({
                width:400,
                left: -left,
                top: -top1,
                eventType: "click", //事件类型 支持focus click hover
                dropmenu: "#medicalMenu",//弹出层
                dataUrl: PC_CALL+"commdata/getMedicalTitleList/",//数据存放,
                showList: ".medicalShow",
                callback: function () {
                    t.submitToggle();
                },
                closeBack:function(){
                    t.submitToggle();
                }
            });
            t.close();
        },
        //获取信息
        getInfo:function(){
            var t=this;
            $.ajax({
                type : "post",
                url : t.path.getInfo,
                dataType : "json",
                success : function(rep){
                    if(rep.responseObject){
                        var info=rep.responseObject;
                        $("#name").val(info.lastName+info.firstName);
                        $("#company").val(info.company);

                        var oldArr = info.medicalTitle?info.medicalTitle.split(","):[];
                        var medicalArr = [];
                        for (var x = 0; x < oldArr.length; x++) {
                            if (oldArr[x]) {
                                medicalArr.push(oldArr[x].split("_"));
                            }
                        }
                        var html = "";
                        var arr = [];
                        for (var i = 0; i < medicalArr.length; i++) {
                            html += '<li rel=' + medicalArr[i][0] + ' class="current"><div class="link_l_bg"></div><div class="link_c_bg"><b>' + medicalArr[i][1] + '</b><p>×</p></div><div class="link_r_bg"></div></li>';
                            arr.push(medicalArr[i][0]);
                        }
                        setTimeout(function () {
                            for (var i = 0; i < arr.length; i++) {
                                if (arr && arr !== "") {
                                    $("#medicalMenu dd li").removeClass("current");
                                    $("#medicalMenu .select-info ul").empty();
                                    for (var j = 0; j < arr.length; j++) {
                                        var $cli = $("#medicalMenu dd li").filter("li[rel='" + arr[j] + "']");
                                        $cli.addClass("current");
                                        $("<li rel='" + arr[j] + "' class='current'>" + $cli.text() + "</li>").appendTo($("#medicalMenu .select-info ul"));
                                    }
                                } else {
                                    $("#medicalMenu .select-info").hide();
                                }
                            }
                        }, 500);
                        $(".medicalShow").html(html);
                        $("#email").val(t.userData.email);
                        $("#mobile").val(t.userData.mobile);
                        t.submitToggle();
                        t.firstSubmit();
                    }
                },
                error:function(){}
            });

        },
        //报名按钮的激活与否
        submitToggle: function () {
            var t = this;
            name=$("#name").val();
            company=$("#company").val();
            var medical = $(".medicalShow .link_c_bg");
            var medicalTitle = "";
            $.each(medical, function (i, em) {
                medicalTitle += $(em).parent().attr("rel") + '_' + $(em).find("b").text() + ',';
            });
            email1=$("#email").val();
            mobile=$("#mobile").val();
            if(name && company && medicalTitle && email1 && mobile){
                $("#submit_btn").removeClass("btn_bnn").attr("status",1);
            }else{
                $("#submit_btn").addClass("btn_bnn").attr("status",0).off("vclick");
            }
        },
        //报名信息提交
        firstSubmit:function(){
            var t=this;
            var form = $("#enrollForm");
            // 较验
            form.validate({
                submitHandler: function () {
                    var param;
                    // 判断图片是否保存成功
                    var validReslut = t.validateBeforeSubmit();
                    var company = $("#company").val();
                    if(validReslut.flag){
                        $(".publish_mask").show();
                        param = {
                            customerId: t.userData.userId,
                            activityId: t.activityId,
                            name: $("#name").val(),
                            companyId:$("#company").attr("hid")?$("#company").attr("hid"):'',
                            company: $("#company").val(),
                            medicalTitle: validReslut.medicalTitle.substring(0, validReslut.medicalTitle.length - 1),
                            contactEmail:$("#email").val(),
                            contactMobile:$("#mobile").val()
                        };
                        var data = {paramJson: $.toJSON(param)};
                        $(".submit_btn").off("click");
                        $.ajax({
                            url: t.path.activCreate,
                            cache: false,
                            data: data,
                            dataType: 'json',
                            type: "POST",
                            success: function (data) {
                                $(".publish_mask").hide();
                                if (data.responseObject.responseStatus) {
                                    t.options.enrollCallBack&&t.options.enrollCallBack();//报名成功回调
                                    if(t.options.type){//在外面选择过类型进来后跳过第二步
                                        $("#firstStep").remove();
                                        t.thirdStep();
                                    }else{
                                        t.secondStep(1);//传值是需要成功提示
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
                    "name": {
                        "required": true,
                        "rangelength": [1, 50],
                        "isChinese": true
                    },
                    "company": {
                        "required": true,
                        "rangelength": [1, 200]
                    },
                    "email": {
                        "required": true,
                        "allinEmail": true,
                        "rangelength": [ 1, 50 ]
                    },
                    "mobile": {
                        "required": true,
                        "mobile": true,
                        "rangelength": [ 1, 50 ]
                    }
                },
                messages: {
                    "name": {
                        "required": "您的姓名？",
                        "rangelength": "您的姓名过长？",
                        "isChinese": "您的姓名？"
                    },
                    "company": {
                        "required": "请填写医院名称。",
                        "rangelength": "医院最大长度200个字符"
                    },
                    "email": {
                        "required": "请填写邮箱。",
                        "allinEmail": "请填写正确的邮箱。",
                        "rangelength": "邮箱最大长度50个字符"
                    },
                    "mobile": {
                        "required": "请填写手机号码。",
                        "mobile": "请填写正确的手机号码。",
                        "rangelength": "手机号码最大长度50个字符"
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
            $("#submit_btn").on("click", function () {
                if($(this).attr("status")=="1"){
                    form.submit();
                }
            });
        },
        //form提交之前验证
        validateBeforeSubmit: function () {
            var t = this;
            var flag = true;
            var medical = $(".medicalShow .link_c_bg");
            var medicalTitle = "";
            $.each(medical, function (i, em) {
                medicalTitle += $(em).parent().attr("rel") + '_' + $(em).find("b").text() + ',';
            });
            if (medicalTitle) {
                validateHideErr($(".medical_error"));
            }
            if (!medicalTitle) {
                validateShowErr($(".medical_error"),"<label>请选择职称</label>");
                flag = false;
            }
            return {
                flag:flag,
                medicalTitle:medicalTitle
            };
        },
        //第二步选择发布类型
        secondStep:function(need){
            var t=this;
            $("#firstStep").remove();
            t.options.container.css("position","relative");
            comm.LightBox.show(95,"#3c3c3d");
            comm.LightBox.setZIndex(8);
            t.options.container.append(t.template.secondTem({
                top:t.options.top,
                left: t.options.left,
                userImg:t.options.userImg,
                imgPath:t.config.imgPath
            }));
            if(!need){
                $(".cheng_g").hide();
            }
            //稍后上传
            $("#later_cancel").on("click",function(){
                comm.LightBox.hide();
                $("#secondStep").remove();
                if(t.options.videoPKList){t.options.videoPKList();}
            });
            //选择类型后进入专业和术士选择页
            $(".in-third").on("click",function(){
                t.type=$(this).attr("type");
                t.thirdStep();
            });
            t.close();
        },
        //第三步选择专业和术士
        thirdStep:function(noback){
            var t=this;
            $("#secondStep").hide();
            t.options.container.css("position","relative");
            comm.LightBox.show(95,"#3c3c3d");
            comm.LightBox.setZIndex(8);
            t.options.container.append(t.template.thirdTem({
                top:t.options.top,
                left: t.options.left,
                userImg:t.options.userImg,
                imgPath:t.config.imgPath
            }));
            if(noback){
                $("#back").hide();
            }
            //返回按钮
            $("#back").on("click",function(){
                if(t.options.type){
                    //if(t.needFirst){//需要报名的
                        //$("#firstStep").show();
                    //}else{//不需要
                        $(".select_tc").show();
                    //}
                }else{
                    $("#secondStep").show();
                }
                $("#thirdStep").remove();
            });
            t.close();
            t.thirdAction();
        },
        //第三步的一些事件处理
        thirdAction:function(){
            var t=this;
            //获取专业和术士
            var type=t.options.type?t.options.type: t.type;
            if(type=="case"){
                activityType=7;
            }else{
                activityType=1;
            }
            var param={
                activityId:t.activityId,
                activityType:activityType,
                parentId:0,
                pageIndex:1,
                pageSize:100
            }
            $.ajax({
                type : "post",
                url : t.path.getList,
                data : {paramJson: $.toJSON(param)},
                dataType : "json",
                async:false,
                success : function(rep){
                    if(rep&&rep.responseObject.responseData){
                        if(rep.responseObject.responseData.list&&rep.responseObject.responseData.list.length>0){
                            var tagHtML="";
                            var shushiHtml=shushiHtml1="";
                            var data=rep.responseObject.responseData.list;
                            $.each(data,function(i,val){
                                var cms_pty=val.cms_activity_property;
                                tagHtML+='<li '+(i==0?'select="true"':'')+'><div class='+(i==0?'"tu_pk tu_pk2"':'"tu_pk"')+'></div><div class="tu_pk1" propertyId="'+cms_pty.propertyId+'" parentId="'+cms_pty.parentId+'" propertyFullPath="'+cms_pty.propertyFullPath+'">'+cms_pty.propertyName+'</div></li>';
                                var shushiHtml3="";
                                if(val.list_cms_activity_property&&val.list_cms_activity_property.length>0){

                                    $.each(val.list_cms_activity_property,function(j,obj){
                                        if(obj.list_cms_activity_property){//三级
                                            var cms_pty1=obj.cms_activity_property;
                                            var shushiHtml4="";
                                            $.each(obj.list_cms_activity_property,function(k,o){
                                                if(o.propertyName){
                                                    shushiHtml4+='<li><div class="tu_pk"></div><div class="tu_pk1" propertyId="'+o.propertyId+'" parentId="'+o.parentId+'" propertyFullPath="'+o.propertyFullPath+'">'+o.propertyName+'</div></li>';
                                                }
                                            });
                                            shushiHtml3+='<p class="title_4 leaf_pk"  propertyId="'+cms_pty1.propertyId+'" parentId="'+cms_pty1.parentId+'" propertyFullPath="'+cms_pty1.propertyFullPath+'">'+cms_pty1.propertyName+'</p><ul class="two_pk">'+shushiHtml4+'</ul>';
                                        }else{//二级
                                            if(obj.propertyName){
                                                shushiHtml3+='<li><div class="tu_pk"></div><div class="tu_pk1" propertyId="'+obj.propertyId+'" parentId="'+obj.parentId+'" propertyFullPath="'+obj.propertyFullPath+'">'+obj.propertyName+'</div></li>';
                                            }
                                        }

                                    });

                                    if(shushiHtml3){
                                        shushiHtml1+='<div class="shushi_pk" '+(i>0?'style="display:none;"':'')+'><ul class="two_pk">'+shushiHtml3+'</ul></div>';
                                    }

                                }else{
                                    shushiHtml1+='<div class="shushi_pk" '+(i>0?'style="display:none;"':'')+'><ul class="two_pk"></ul></div>';
                                }

                            });
                            shushiHtml=shushiHtml1;
                            $("#areExp_list").html(tagHtML);
                            $(".shushi_content").html(shushiHtml);
                        }
                    }
                }
            });
            //专业
            $("#areExp_list li").each(function(i,em){
                $(em).on("click",function(){
                    /*if($(this).attr("select")&&$(this).attr("select")=="true"){//取消点击
                        $(this).attr("select","false");
                        $(this).find(".tu_pk").removeClass("tu_pk2");
                        $(".shushi_pk").eq(i).hide();
                        $(".shushi_pk").eq(i).find("li").attr("select","false");
                        $(".shushi_pk").eq(i).find("li").find(".tu_pk").removeClass("tu_pk2");
                    }else{*///点击
                        $("#areExp_list li").attr("select","false");
                        $("#areExp_list li").find(".tu_pk").removeClass("tu_pk2");
                        $(this).attr("select","true");
                        $(this).find(".tu_pk").addClass("tu_pk2");
                        $(".shushi_pk").hide();
                        $(".shushi_pk").find("li").attr("select","false");
                        $(".shushi_pk").find("li").find(".tu_pk").removeClass("tu_pk2");
                        $(".shushi_pk").eq(i).show();
                    //}
                    t.nextStep();
                })
            });
            //术士
            $(".shushi_content .shushi_pk").each(function(i,em){
                $(em).find("li").each(function(j,o){
                    $(o).on("click",function(){
                        $(em).find("li").attr("select","false");
                        $(em).find("li").find(".tu_pk").removeClass("tu_pk2");
                        $(this).find(".tu_pk").addClass("tu_pk2");
                        $(this).attr("select","true");
                        t.nextStep();
                    })
                })
            })
        },
        nextStep:function(){
            var t=this;
            var status1=status2=false;
            this.property={};
            t.property.property_1=[];
            t.property.property_2=[];
            t.property.property_3=[];
            var type=t.options.type?t.options.type: t.type;
            if(type=="case"){
                activityType=7;
            }else{
                activityType=1;
            }
            $("#areExp_list li").each(function(i,em){
                if($(em).attr("select")=="true"){
                    status1=true;
                    t.property.property_1.push({
                        activityId: t.activityId,
                        activityType: activityType,
                        propertyId:$(em).find(".tu_pk1").attr("propertyId"),
                        propertyName:$(em).find(".tu_pk1").text(),
                        parentId:$(em).find(".tu_pk1").attr("parentId"),
                        propertyFullPath:$(em).find(".tu_pk1").attr("propertyFullPath")
                    });
                    //return;
                }
            });
            $(".shushi_content li").each(function(i,em){
                if($(em).attr("select")=="true"){
                    status2=true;
                    t.property.property_3.push({
                        activityId: t.activityId,
                        activityType: activityType,
                        propertyId:$(em).find(".tu_pk1").attr("propertyId"),
                        propertyName:$(em).find(".tu_pk1").text(),
                        parentId:$(em).find(".tu_pk1").attr("parentId"),
                        propertyFullPath:$(em).find(".tu_pk1").attr("propertyFullPath")
                    });
                    var oP=$(em).parent().prev();
                    if(oP.length>0){
                        t.property.property_2.push({
                            activityId: t.activityId,
                            activityType: activityType,
                            propertyId:oP.attr("propertyId"),
                            propertyName:oP.text(),
                            parentId:oP.attr("parentId"),
                            propertyFullPath:oP.attr("propertyFullPath")
                        });
                    }

                    //return;
                }
            })
            if(status1&&status2){
                $("#in-upload").addClass("content_bun1");
                this.selectType();
            }else{
                $(".content_bun1").off("click");
                $("#in-upload").removeClass("content_bun1");
            }
        },
        //进入发布页
        selectType:function(){
            var t=this;
            if(t.options.type){
                t.type=t.options.type;
            }
            if(t.type=="case"){
                if(t.options.needGoDetail){
                    module.caseUpload({
                        caseBtn:$(".content_bun1"),//创建点击btn
                        container: t.options.container,//存放弹层的外层
                        top: t.options.top,//弹层top值
                        left: t.options.left,
                        userImg:t.options.userImg,//是否有用户头像
                        activityId: t.activityId,//是否PK上传
                        property: t.property,//专业和术式
                        callback:function(){
                            $("#thirdStep").remove();
                        }
                    });
                }else{
                    module.caseUpload({
                        caseBtn:$(".content_bun1"),//创建点击btn
                        container: t.options.container,//存放弹层的外层
                        top: t.options.top,//弹层top值
                        left: t.options.left,
                        userImg:t.options.userImg,//是否有用户头像
                        activityId: t.activityId,//是否PK上传
                        property: t.property,//专业和术式
                        callback:function(){
                            $("#thirdStep").remove();
                        },
                        publishBack:function(){
                            t.options.publishBack();
                        }
                    });
                }

            }else{
                module.videoUpload({
                    videoBtn:$(".content_bun1"),//创建点击btn
                    container:t.options.container,//存放弹层的外层
                    top:t.options.top,//弹层top值
                    left: t.options.left,
                    userImg:t.options.userImg,//是否有用户头像
                    activityId: t.activityId,//是否PK上传
                    property: t.property,//专业和术式
                    callback:function(){
                        $("#thirdStep").remove();
                    },
                    publishBack:function(){
                        t.options.publishBack();
                    }
                });
            }
        }

    };
    controller.init(obj);
};
