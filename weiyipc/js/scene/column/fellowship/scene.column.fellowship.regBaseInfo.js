/**
 * 功能描述：  报名基本信息编辑和完善
 * 使用方法:
 * 注意事件：
 * 引入来源：  作用：
 *
 * Created by LiChunHui on 2015/12/23.
 */
var regBaseInfo=function(obj){
    controller= {
        config: {
            baseId:obj.that.attr("baseid"),
            customerId:$("#sesCustomerId").val(),
            fellowshipId:obj.fellowshipId
        },
        path:{
        	url:PC_CALL+"customer/fellowship/base/json_list/",//获取进修目的及要求的数据
            customerInfo:PC_CALL+"customer/baseinfo/json_info/",//完善信息的接口
            webUser:PC_CALL+"web/user/getWebUser/",//完善信息的接口
            subConfig:PC_CALL+"fellowship/config/getSubConfigList/",//展示第一志愿，第二志愿，第三志愿
            subSchool:PC_CALL+"fellowship/sub/json_list/",//获取志愿里的数据项
            update:PC_CALL+"customer/fellowship/base/update/",//保存提交
            getInfo:PC_CALL+"customer/fellowship/base/info/",//获取报名基本信息展示
            getSub:PC_CALL+"customer/fellowship/sub/json_list/",//获取第一第二第三志愿的选择项并默认选择
            getAgree:PC_CALL+"fellowship/config/getConsentAdjust/",//获取是否同意调剂
            getMajor:PC_CALL+"fellowship/major/info/",//获取国内进修或者培训的科室等数据
            getCategoryList:PC_CALL+"fellowship/config/getCategoryList/",//获取配置项以及该项目的类别
            getEducationList:PC_CALL+"commdata/getEducationList/",//学历
            getDataCertificates:PC_CALL+"commdata/getDataCertificates/"//证件类型
        },
        el: {

        },
        template: {
            baseTem:function(options){
                var html = '';
                html='<div id="base_pop"><!-- 遮罩层 -->'+
                    '<div id="lightbox"></div>'+
                    '<!-- 弹窗 -->'+
                    '<div class="lightbox-container" style="z-index: 10; position: absolute;">'+
                    '<div class="layer_fellow">'+
                    '<!--弹窗头部-->'+
                    '<div class="layer_fellow_t layerLarger">'+
                    '<div class="layerCaption">报名申请表</div>'+
                    '<a href="javascript:;" class="close">'+
                    '<div class="layer_close base_close"></div>'+
                    '</a>'+
                    '<div class="clear"></div>'+
                    '</div>'+
                    '<!--弹窗头部 end-->'+
                    '<form id="regBaseInfo">' +
                    '<div class="layer_fellow_c">'+
                    '<div class="personal_content" style="padding-top:0;">'+
                    '<div class="layerSection applyBottom">'+
                    '<div class="layerTitle">'+
                    '<div class="secLeft">个人联系信息</div>'+
                    '<div class="secRight">（以下联系方式将用于面试通知及入选通知，请仔细核对填写内容，并在活动期间保持通讯渠道畅通。）</div>'+
                    '<div class="clear"></div>'+
                    '</div>'+
                    '<div class="layerInfo">'+
                    '<div class="p_base_info_jbxx layerRel">'+
                    '<div class="p_base_info_jbxx01">'+
                    '<div class="p_base_info_jbxx01_l applyInfoL font_yahei">联系电话</div>'+
                    '<div class="p_c_title_bj_zl_r baseinfo_margin layerBaseMagin">'+
                    '<input type="text" class="font_yahei"name="mobile" id="mobile">'+
                    '</div>'+
                    '<div class="clear"></div>'+
                    '</div>'+
                    '<div class="p_base_info_jbxx01">'+
                    '<div class="p_base_info_jbxx01_l applyInfoL font_yahei">电子邮箱</div>'+
                    '<div class="p_c_title_bj_zl_r baseinfo_margin layerBaseMagin">'+
                    '<input type="text" class="font_yahei" id="email" name="email">'+
                    '</div>'+
                    '<div class="clear"></div>'+
                    '</div>'+
                    '<div class="p_base_info_jbxx01">'+
                    '<div class="p_base_info_jbxx01_l applyInfoL font_yahei">微信帐号</div>'+
                    '<div class="p_c_title_bj_zl_r baseinfo_margin layerBaseMagin">'+
                    '<input type="text" class="font_yahei" name="weixinCode" id="weixinCode">'+
                    '</div>'+
                    '<div class="clear"></div>'+
                    '</div>'+
                    '<div class="p_base_info_jbxx01">'+
                    '<div class="p_base_info_jbxx01_l applyInfoL font_yahei">邮政编码</div>'+
                    '<div class="p_c_title_bj_zl_r baseinfo_margin layerBaseMagin">'+
                    '<input type="text" class="font_yahei" name="zipCode" id="zipCode">'+
                    '</div>'+
                    '<div class="clear"></div>'+
                    '</div>'+
                    '<div class="p_base_info_jbxx01">'+
                    '<div class="p_base_info_jbxx01_l applyInfoL font_yahei">通信地址</div>'+
                    '<input type="hidden" id="provinceId"/>'+
                    '<input type="hidden" id="cityId"/>'+
                    '<input type="hidden" id="districtId"/>'+
                    '<div class="p_c_title_bj_zl_r font_yahei baseinfo_margin layerBaseMagin" id="provinceCity" style="width:283px">' +
                    '<div class="p_c_baseinfo_time01"><div class="p_c_baseinfo_div01"><select class="province"></select></div></div>'+
                    '<div class="p_c_baseinfo_time01"><div class="p_c_baseinfo_div01"><select class="city"></select></div></div>'+
                    '<div class="p_c_baseinfo_time01"><div class="p_c_baseinfo_div01"><select class="district"></select></div></div>'+
                    '</div>'+
                    '<div class="p_c_title_bj_zl_r baseinfo_margin layerSpecal" style="width:110px;">'+
                    '<input type="text" placeholder="详细地址" class="font_yahei detailAddress" name="detailAddress" id="detailAddress">'+
                    '</div>'+
                    '<div class="clear"></div>'+
                    '</div>'+
                    '</div>'+
                    '</div>'+
                    '</div>'+
                    '<div class="layerSection">'+
                    '<div class="fellow_sub" style="display: none">'+
                    '<div class="layerTitle">'+
                    '<div class="secLeft">申请意向</div>'+
                    '<div class="clear"></div>'+
                    '</div>'+
                    '<div class="layerInfo" style="padding-top:19px;" id="subList"></div>'+

                    '<div class="fellow_objective">'+
                    '<div class="fellow_objectiveTitle font_yahei">进修目的及要求</div>'+
                    '<div class="fellow_objectiveText">'+
                    '<textarea class="font_yahei objective" name="objective" id="objective"></textarea>'+
                    '</div>'+
                    '</div>'+

                    '</div>'+
                    '<div class="layerBtn layerSave">'+
                    '<div class="checkAgree" style="display:none">'+
                    '<div class="agreeCheck"><input type="checkbox" checked="checked"></div>'+
                    '<div class="agreeText"></div>'+
                    '<div class="clear"></div>'+
                    '</div>'+
                    '<a href="javascript:;" class="save_btn">保 存</a><a href="javascript:;" class="gray cancel_btn">取 消</a>'+
                    '</div>'+
                    '</div>'+
                    '</div>'+
                    '</div>'+
                    '</form>'+
                    '</div>'+
                    '</div></div>';
                return html;
            },
            //证件类型及号码模板
            idTem : function () {
            	var htmlTem;
            	htmlTem = '<div class="p_base_info_jbxx01">'+
                    '<div class="p_base_info_jbxx01_l applyInfoL font_yahei">证件类型</div>'+
                    '<div class="p_c_title_bj_zl_r baseinfo_margin layerBaseMagin">'+
                    '<div class="p_c_baseinfo_info">'+
                    '<div class="layerTran">'+
                    '<select name="idType" class="idType"><option value="">--请选择--</option></select>'+
                    '</div>'+
                    '</div>'+
                    '</div>'+
                    '<div class="clear"></div>'+
                    '</div>'+
                    '<div class="p_base_info_jbxx01">'+
                    '<div class="p_base_info_jbxx01_l applyInfoL font_yahei">证件号码</div>'+
                    '<div class="p_c_title_bj_zl_r baseinfo_margin layerBaseMagin">'+
                    '<input type="text" class="font_yahei" name="idNumber" id="idNumber">'+
                    '</div>'+
                    '<div class="clear"></div>'+
                    '</div>';
                return htmlTem;
            },
            //最高学历模板
            highestEducation : function () {
            	var htmlTem;
            	htmlTem = '<div class="p_base_info_jbxx01">'+
                    '<div class="p_base_info_jbxx01_l applyInfoL font_yahei">最高学历</div>'+
                    '<div class="p_c_title_bj_zl_r baseinfo_margin layerBaseMagin">'+
                    '<div class="p_c_baseinfo_info">'+
                    '<div class="layerTran">'+
                    '<select name="highestEducation" class="highestEducation"><option value="">--请选择--</option></select>'+
                    '</div>'+
                    '</div>'+
                    '</div>'+
                    '<div class="clear"></div>'+
                    '</div>';
                return htmlTem;
            },
            //单位性质模板
            unitProperties : function () {
            	var htmlTem;
            	htmlTem = '<div class="p_base_info_jbxx01">'+
                    '<div class="p_base_info_jbxx01_l applyInfoL font_yahei">单位性质</div>'+
                    '<div class="p_c_title_bj_zl_r baseinfo_margin layerBaseMagin">'+
                    '<div class="p_c_baseinfo_info">'+
                    '<div class="layerTran">'+
                    '<select name="unitProperties" class="unitProperties"><option value="">--请选择--</option><option value="1">国有事业单位</option><option value="2">私营</option></select>'+
                    '</div>'+
                    '</div>'+
                    '</div>'+
                    '<div class="clear"></div>'+
                    '</div>';
                return htmlTem;
            },
            //学员类型模板
            studentType : function () {
            	var htmlTem;
            	htmlTem = '<div class="p_base_info_jbxx01">'+
                    '<div class="p_base_info_jbxx01_l applyInfoL font_yahei">学员类型</div>'+
                    '<div class="p_c_title_bj_zl_r baseinfo_margin layerBaseMagin">'+
                    '<div class="p_c_baseinfo_info">'+
                    '<div class="layerTran">'+
                    '<select name="studentType" class="studentType"><option value="">--请选择--</option><option value="1">军人</option><option value="2">地方人员</option></select>'+
                    '</div>'+
                    '</div>'+
                    '</div>'+
                    '<div class="clear"></div>'+
                    '</div>';
                return htmlTem;
            },
            //医师执业证号模板
            practice : function () {
            	var htmlTem;
            	htmlTem = '<div class="p_base_info_jbxx01">'+
                    '<div class="p_base_info_jbxx01_l applyInfoL font_yahei">医师执业证号</div>'+
                    '<div class="p_c_title_bj_zl_r baseinfo_margin layerBaseMagin">'+
                    '<input type="text" class="font_yahei"name="practice" id="practice">'+
                    '</div>'+
                    '<div class="clear"></div>'+
                    '</div>';
                return htmlTem;
            },
            //医师资格证号模板
            qualification : function () {
            	var htmlTem;
            	htmlTem = '<div class="p_base_info_jbxx01">'+
                    '<div class="p_base_info_jbxx01_l applyInfoL font_yahei">医师资格证号</div>'+
                    '<div class="p_c_title_bj_zl_r baseinfo_margin layerBaseMagin">'+
                    '<input type="text" class="font_yahei"name="qualification" id="qualification">'+
                    '</div>'+
                    '<div class="clear"></div>'+
                    '</div>';
                return htmlTem;
            },
            //国内进修报名意向的模板
            majorTem : function () {
            	var htmlTem;
            	htmlTem = '<div class="p_c_title_bj_zl font_yahei">'+
    				'<div class="p_c_title_bj_zl_l applyInfoL">进修科室</div>'+
    				'<div class="p_c_title_bj_zl_r">'+
    				'<div class="p_c_baseinfo_hxl layerWishT">'+
    				'<div class="p_c_baseinfo_div01">'+
    				'<select name="department_select" class="department_select"><option value="">--请选择--</option></select>'+
    				'</div>'+
    				'</div>'+
    				'</div>'+
    				'<div class="clear"></div>'+
    				'</div>'+
    				'<div class="p_c_title_bj_zl font_yahei">'+
    				'<div class="p_c_title_bj_zl_l applyInfoL">进修专业</div>'+
    				'<div class="p_c_title_bj_zl_r">'+
    				'<div class="p_c_baseinfo_hxl layerWishT">'+
    				'<div class="p_c_baseinfo_div01">'+
    				'<select name="profession_select" class="profession_select"><option value="">--请选择--</option></select>'+
    				'</div>'+
    				'</div>'+
    				'</div>'+
    				'<div class="clear"></div>'+
    				'</div>'+
    				'<div class="p_c_title_bj_zl font_yahei">'+
    				'<div class="p_c_title_bj_zl_l applyInfoL">进修期限</div>'+
    				'<div class="p_c_title_bj_zl_r">'+
    				'<div class="p_c_baseinfo_hxl layerWishT">'+
    				'<div class="p_c_baseinfo_div01">'+
    				'<select name="term_select" class="term_select"><option value="">--请选择--</option></select>'+
    				'</div>'+
    				'</div>'+
    				'</div>'+
    				'<div class="clear"></div>'+
    				'</div>';
    			return htmlTem;
            },
            //培训方向报名意向的模板
            directionTem : function () {
            	var htmlTem;
            	htmlTem = '<div class="p_c_title_bj_zl font_yahei">'+
    				'<div class="p_c_title_bj_zl_l applyInfoL">培训方向</div>'+
    				'<div class="p_c_title_bj_zl_r">'+
    				'<div class="p_c_baseinfo_hxl layerWishT">'+
    				'<div class="p_c_baseinfo_div01">'+
    				'<select name="trDirection_select" class="trDirection_select"><option value="">--请选择--</option></select>'+
    				'</div>'+
    				'</div>'+
    				'</div>'+
    				'<div class="clear"></div>'+
    				'</div>';
    			return htmlTem;
            },
        },
        init: function (obj) {
        	var t =this;
            $("body").append(this.template.baseTem());
            //公共居中的方法
            comm.setCenter($("#base_pop .lightbox-container"));
            this.options={};
            var o={
                container:$("body")
            };
			this.getCategoryList();//添加模板函数
			switch (this.config.fellowshipMainType){
				case 1:this.getSubConfig();// 海外进修，获取报名志愿信息
					break;
			
				case 2:this.getSubConfig();//获取报名志愿信息
				    this.getMajor();// 国内进修，获取进修课程信息

					break;
				case 3:this.getTrainingDirection()// 培训课程，获取培训课程信息
					break;
				default:
					break;
			};
            this.options= $.extend(o,obj);
            this.par=this.options.that.parents(".fs_rereq");
            this.getAgree();
            if(this.par.hasClass("sub_blue")){//编辑
                this.getBaseInfo();
            }else{
                if(!$.isEmptyObject(this.options.fellowData)){//上一个报名信息
                    this.getPrevInfo();//获得上一次的报名信息
                }else{
                    this.getCustomerInfo();//完善
                }

            }
            t.getObjective();
            this.baseCancel();
            this.baseClose();
            this.baseSubmit();
        },
        //获取进修目的及要求的数据并展示
        getObjective : function () {
        	var t =this;
        	var purposeRequest;
        	$.ajax({
                url: t.path.url,
                type:"POST",
                data:{paramJson: $.toJSON({customerId:$("#sesCustomerId").val(),fellowshipId:t.config.fellowshipId,queryType:1,sortType:3})},
                dataType:"json",
                success:function(data){
                    if(data&&data.responseObject.responseData){
                        purposeRequest=data.responseObject.responseData.data_list[0].customer_fellowship.purposeRequest;
                        $('.fellow_objective .objective').val(purposeRequest);
                    }
                },
                error:function(){}
            });
        },
		//判断数据添加模板
        getCategoryList : function () {
            var t=this;
            var param={};
            var data = {};
            data.fellowshipId = t.config.fellowshipId;
           	param.paramJson= $.toJSON(data);
            $.ajax({
                type : "post",
                url : t.path.getCategoryList,
                dataType : "json",
                async:false,
                data : param,
                success : function(rep){
                	if (rep.responseObject) {
                		customForm = rep.responseObject.categoryList[0].customForm;
                		var htlmTem = '';
                		//判断是否需要展示1-证件类型及号码、2-最高学历、3-单位性质、4-学员类型、5-医师执业证号、6-医师资格证号
                		if (customForm.indexOf('1') != -1) {
                			htlmTem += t.template.idTem();
                		};
                		if (customForm.indexOf('2') != -1) {
                			htlmTem += t.template.highestEducation();
                		};
                		if (customForm.indexOf('3') != -1) {
                			htlmTem += t.template.unitProperties();
                		};
                		if (customForm.indexOf('4') != -1) {
                			htlmTem += t.template.studentType();
                		};
                		if (customForm.indexOf('5') != -1) {
                			htlmTem += t.template.practice();
                			
                		};
                		if (customForm.indexOf('6') != -1) {
                			htlmTem += t.template.qualification();
                		};
                		$('#regBaseInfo .layerRel').prepend(htlmTem)
	                    t.config.fellowshipMainType = rep.responseObject.fellowshipMainType;
//	                    t.config.fellowshipMainType = 3;
	                    if (customForm.indexOf('1') != -1) {
                			t.getDataCertificates();
                		};
                		if (customForm.indexOf('2') != -1) {
                			t.getEducationList();
                		};
                	}
                },
                error:function(){
                    //console.log('出错了!');
                }
            });
        },
        //获取学历列表数据
        getEducationList:function () {
        	var t=this;
            $.ajax({
                type : "post",
                url : t.path.getEducationList,
                dataType : "json",
                success : function(rep){
                	var data =rep;
                	if(data){
                	    var html = '';
                        $.each(data,function(i,val){
                            html+="<option value='"+val.educationName+"'data-id='"+val.id+"'>"+val.educationName+"</option>"
                        })
                        $(".highestEducation").append(html);
                    }
                },
                error:function(){
                    //console.log('出错了!');
                }
            });
        },
        //获取证件类型列表数据
        getDataCertificates:function () {
        	var t=this;
        	var param={};
            var data = {};
            data.fellowshipCertificate = "1";
           	param.paramJson= $.toJSON(data);
            $.ajax({
                type : "POST",
                url : t.path.getDataCertificates,
				data : param,
                dataType : "json",
                success : function(rep){
                	var data =rep.responseObject.responseMessage;
                	if(data){
                	    var html = '';
                        $.each(data,function(i,val){
                            html+="<option value='"+val.certificate+"'data-id='"+val.id+"'>"+val.certificate+"</option>"
                        })
                        $(".idType").append(html);
                    }
                },
                error:function(){
                    //console.log('出错了!');
                }
            });
        },
        //获取国内进修报名意向数据
		getMajor:function () {
			var t=this;
			var param={};
            var data = {};
            data.fellowshipId = t.config.fellowshipId;
            data.fellowshipMainType = t.config.fellowshipMainType;
           	param.paramJson= $.toJSON(data);
            $.ajax({
                type : "post",
                url : t.path.getMajor,
                dataType : "json",
                data : param,
                success : function(rep){
                    if (rep.responseObject&&!$.isEmptyObject(rep.responseObject)) {
                        var html = t.template.majorTem();
                        $("#regBaseInfo .fellow_sub").show();
                        $("#subList").prepend(html);
                    	t.getMajorInfor(rep.responseObject);
                    }
                },
                error:function(){
                    //console.log('出错了!');
                }
            });
		},
		//展示国内进修报名意向的数据
		getMajorInfor:function (data) {
			var html = '';
			if (data['1']) {
				html+="<option value='1'>骨科</option>"
			};
			if (data['2']) {
				html+="<option value='2'>大外科</option>"
			};
			if (data['3']) {
				html+="<option value='3'>临床</option>"
			};
			$('.department_select').append(html);
			//三级联动控制
			var department = $('.department_select');
			var profession = $('.profession_select');
			var term = $('.term_select');
			department.on("change",function () {
				if (department.val() == '') {
					profession.html('<option value="">--请选择--</option>');
					term.html('<option value="">--请选择--</option>');
				};
				if (department.val() == '1') {
					var html = '';
                    $.each(data['1'],function(i,val){
                        html+="<option value='"+val.tagName+"' data-tagId='"+val.tagId+"' data-fellowshipMajorId='"+val.fellowshipMajorId+"'>"+val.tagName+"</option>";
                    });
                    profession.html(html);
					term.html('<option value="">--请选择--</option>');
				};
				if (department.val() == '2') {
					var html = '';
                    $.each(data['2'],function(i,val){
                        html+="<option value='"+val.tagName+"' data-tagId='"+val.tagId+"' data-fellowshipMajorId='"+val.fellowshipMajorId+"'>"+val.tagName+"</option>";
                    });
                    profession.html(html);
					term.html('<option value="">--请选择--</option>');
				};
				if (department.val() == '3') {
					var html = '';
                    $.each(data['3'],function(i,val){
                        html+="<option value='"+val.tagName+"' data-tagId='"+val.tagId+"' data-fellowshipMajorId='"+val.fellowshipMajorId+"'>"+val.tagName+"</option>";
                    });
                    profession.html(html);
					term.html('<option value="">--请选择--</option>');
				};
				if ($('.profession_select option').length == 1&& $('.profession_select option').val() != '') {
					$('.profession_select option:last-child').attr("selected",true);
					profession.attr('disabled','disabled');
				}else {
					profession.removeAttr('disabled');
				};
				profession.trigger('change');
			});
			profession.on('change',function () {
				if (department.val() == '1') {
					var html = '';
					$.each(data['1'],function(i,val){
                        if (profession.val() == val.tagName) {
                        	var termArray = val.fellowshipDate.split(',');
							$.each(termArray, function(i,val) {
								html+="<option value='"+val+"'>"+val+"个月</option>"
							});
                        }
                    });
                    term.html(html);
				};
				if (department.val() == '2') {
					var html = '';
					$.each(data['2'],function(i,val){
                        if (profession.val() == val.tagName) {
                        	var termArray = val.fellowshipDate.split(',');
							$.each(termArray, function(i,val) {
								html+="<option value='"+val+"'>"+val+"个月</option>"
							});
                        }
                    });
                    term.html(html);
				};
				if (department.val() == '3') {
					var html = '';
					$.each(data['3'],function(i,val){
                        if (profession.val() == val.tagName) {
                        	var termArray = val.fellowshipDate.split(',');
							$.each(termArray, function(i,val) {
								html+="<option value='"+val+"'>"+val+"个月</option>"
							});
                        }
                    });
                    term.html(html);
				};
				if ($('.term_select option').length == 1&& $('.term_select option').val() != '') {
					$('.term_select option:last-child').attr("selected",true);
					term.attr('disabled','disabled');
				} else {
					term.removeAttr('disabled');
				};
			})
		},
		//获取培训课程报名意向数据
		getTrainingDirection:function () {
			var t=this;
			var param={};
            var data = {};
            data.fellowshipId = t.config.fellowshipId;
            data.fellowshipMainType = t.config.fellowshipMainType;
           	param.paramJson= $.toJSON(data);
            $.ajax({
                type : "post",
                url : t.path.getMajor,
                dataType : "json",
                data : param,
                success : function(rep){
                	var html = t.template.directionTem();
                	$("#regBaseInfo .fellow_sub").show();
                    $("#subList").prepend(html);
                    if (rep.responseObject) {
                    	var html = '';
                        $.each(rep.responseObject["4"],function(i,val){
                        html+="<option value='"+val.tagName+"' data-tagId='"+val.tagId+"' data-fellowshipMajorId='"+val.fellowshipMajorId+"'>"+val.tagName+"</option>";
                        })
                        $(".trDirection_select").append(html);
                    }
                },
                error:function(){
                    //console.log('出错了!');
                }
            });
		},
        //取消
        baseCancel:function(){
            var t=this;
            $(".cancel_btn").on("click",function(){
                t.clear();
                //事件埋点
                comm.creatEvent({
                    triggerType:"全站功能按钮点击",
                    keyword:"fellowship报名个人基本信息取消",
                    actionId:45
                });
            });
        },
        //关闭
        baseClose:function(){
            var t=this;
            $(".base_close").on("click",function(){
                t.clear();
                //事件埋点
                comm.creatEvent({
                    triggerType:"全站功能按钮点击",
                    keyword:"fellowship报名个人基本信息关闭",
                    actionId:43
                });
            })
        },
        clear:function(){
            $("#base_pop").remove();
            $(".tip-yellow").remove();
        },
        //获取用户信息
        getCustomerInfo:function(){
            var t=this;
            $.ajax({
                type : "post",
                url : t.path.webUser,
                dataType : "json",
                success : function(rep){
                    if(rep.responseObject&&rep.responseObject.responseMessage){
                        info=rep.responseObject.responseMessage;
                        $("#mobile").val(info.mobile);
                        $("#email").val(info.email);
                    }
                },
                error:function(){}
            });
            $.ajax({
                type : "post",
                url : t.path.customerInfo,
                data : {"customerId": t.config.customerId},
                dataType : "json",
                success : function(rep){
                    if(rep.responseObject){
                        var info=rep.responseObject;
                        $("#provinceId").val(info.provinceId);
                        $("#cityId").val(info.cityId);
                        $("#districtId").val(info.districtId);
                        t.addProvince();
                    }
                },
                error:function(){}
            });
        },
        //省市区联动
        addProvince:function(){
            provinceCityDistrict({
                url:PC_CALL+'comm/data/region/json_list/',
                provinceId:$("#provinceId").val()||'110000',
                cityId:$("#cityId").val()||'110100',
                districtId:$("#districtId").val()||'110101',
                provinceEl:$(".province"),//省元素
                cityEl:$(".city"),//市元素
                districtEl:$(".district"),//区元素
                provinceChange:function(){
                    $("#provinceId").val($(".province option:selected").attr("provinceid"));
                    $("#cityId").val($(".city option:selected").attr("cityid"));
                    $("#districtId").val($(".district option:selected").attr("districtid"));
                },
                cityChange:function(){
                    $("#cityId").val($(".city option:selected").attr("cityid"));
                    $("#districtId").val($(".district option:selected").attr("districtid"));
                },
                districtChange:function(){
                    $("#districtId").val($(".district option:selected").attr("districtid"));
                }
            });
        },
        //获取国外申请意向
        getSubConfig:function(){
            var t=this;
            var data={};
            var param={};
            data.fellowshipId= t.config.fellowshipId;
            data.configType=4;
            param.paramJson=$.toJSON(data);
            $.ajax({
                type : "post",
                url : t.path.subConfig,
                data : param,
                dataType : "json",
                async:false,
                success : function(rep){
                    if(rep.responseObject){
                        if(rep.responseObject.fellowshipSubList){
                            var subList=rep.responseObject.fellowshipSubList;
                            if(subList.length>0){
                                var html="";
                                $.each(subList,function(i,val){
                                    html+='<div class="p_c_title_bj_zl font_yahei">'+
                                        '<div class="p_c_title_bj_zl_l applyInfoL">'+val.configTitle+'</div>'+
                                        '<div class="p_c_title_bj_zl_r">'+
                                        '<div class="p_c_baseinfo_hxl layerWishT">'+
                                        '<div class="p_c_baseinfo_div01">'+
                                        '<select class="school_select" sortId="'+val.sortId+'"></select>'+
                                        '</div>'+
                                        '</div>'+
                                        '</div>'+
                                        '<div class="clear"></div>'+
                                        '</div>';
                                });
                                $(".fellow_sub").show();
                                $("#subList").prepend(html);
                                t.getSubSchool();
                            }else{
                                $(".fellow_sub").remove();
                            }
                        }
                    }
                },
                error:function(){}
            });
        },
        //获取学校
        getSubSchool:function(){
            var t=this;
            var data={};
            var param={};
            data.fellowshipId= t.config.fellowshipId;
            param.paramJson=$.toJSON(data);
            $.ajax({
                type : "post",
                url : t.path.subSchool,
                data : param,
                dataType : "json",
                async:false,
                success : function(rep){
                    if(rep&&rep.responseObject&&rep.responseObject.responseData){
                        if(rep.responseObject.responseData.data_list&&rep.responseObject.responseData.data_list.length>0){
                            var list=rep.responseObject.responseData.data_list;
                            var html="";
                            $.each(list,function(i,val){
                                html+='<option value="'+val.fellowshipSubId+'">'+val.fellowshipSubName+'</option>';
                            });
                            $.each($(".school_select"),function(j,em){
                                $(em).html(html);
                                $(em).find("option").eq(j).attr("selected",true);
                            })
                        }
                    }
                },
                error:function(){}
            });
        },
        //获取同意调剂
        getAgree:function(){
            var t=this;
            var data={};
            var param={};
            data.fellowshipId= t.config.fellowshipId;
            data.configType=6;
            param.paramJson= $.toJSON(data);
            $.ajax({
                type : "post",
                url : t.path.getAgree,
                data : param,
                dataType : "json",
                async:false,
                success : function(rep){
                    if(rep&&rep.responseObject){
                        if(rep.responseObject.consentAdjustList!=0){
                            var ADjust=rep.responseObject.consentAdjustList[0];
                            $(".checkAgree").show();
                            $(".agreeText").text(ADjust.configTitle+"："+ADjust.configIntro);
                        }else{
                            $(".checkAgree").remove();
                        }
                    }
                },
                error:function(){}
            });
        },
        //获取上一次的报名基本信息
        getPrevInfo:function(){
            var info= this.options.fellowData;
            $("#mobile").val(info.mobile);
            $("#email").val(info.email);
            $("#weixinCode").val(info.weixinCode);
            $("#detailAddress").val(info.detailAddress);
            $("#zipCode").val(info.zipCode);
            $("#provinceId").val(info.provinceId);
            $("#cityId").val(info.cityId);
            $("#districtId").val(info.districtId);
            //if(info.isAgreeAdjust){
            //    $(".checkAgree input").attr("checked","true");
            //}else{
            //    $(".checkAgree input").removeAttr("checked");
            //}
            this.addProvince();
            this.getSubInfo();
        },
        //获取报名信息
        getBaseInfo:function(){
            var t=this;
            var data={};
            var param={};
            data.customerId= t.config.customerId;
            data.fellowshipId= t.config.fellowshipId;
            param.paramJson= $.toJSON(data);
            $.ajax({
                type : "post",
                url : t.path.getInfo,
                data : param,
                dataType : "json",
                success : function(rep){
                    if(rep.responseObject.responseData){
                        if(rep.responseObject.responseData.data_list&&rep.responseObject.responseData.data_list.length>0){
                            var info=rep.responseObject.responseData.data_list[0].customer_fellowship;
                            var infoMajor=rep.responseObject.responseData.data_list[0].customer_fellowship_major;
                            $("#mobile").val(info.mobile);
                            $("#email").val(info.email);
                            $("#weixinCode").val(info.weixinCode);
                            $("#detailAddress").val(info.detailAddress);
                            $("#zipCode").val(info.zipCode);
                            $("#provinceId").val(info.provinceId);
                            $("#cityId").val(info.cityId);
                            $("#districtId").val(info.districtId);
                            //1-证件类型及号码、2-最高学历、3-单位性质、4-学员类型、5-医师执业证号、6-医师资格证号
	                		if (customForm.indexOf('1') != -1) {
		                		$.each($('.idType option'),function(i,em){
	                                if($(em).data("id")==info.certificatesId){
	                                    $(em).attr("selected",true);
	                                }
                            	});
		                		$('#idNumber').val(info.certificatesCode);
		            		};
		            		if (customForm.indexOf('2') != -1) {
//		                		data.highestDegree = $('.highestEducation option:selected').data("id");
		                		$.each($('.highestEducation option'),function(i,em){
	                                if($(em).data("id")==info.highestDegree){
	                                    $(em).attr("selected",true);
	                                }
                            	});
		            		};
		            		if (customForm.indexOf('3') != -1) {
//		            			data.companyType = $('.unitProperties').val();
		            			$.each($('.unitProperties option'),function(i,em){
	                                if($(em).val()==info.companyType){
	                                    $(em).attr("selected",true);
	                                }
                            	});
		            		};
		            		if (customForm.indexOf('4') != -1) {
//		            			data.customerType = $('.studentType').val();
		            			$.each($('.studentType option'),function(i,em){
	                                if($(em).val()==info.customerType){
	                                    $(em).attr("selected",true);
	                                }
                            	});
		            		};
		            		if (customForm.indexOf('5') != -1) {
		            			$('#practice').val(info.practiceCode);
		            		};
		            		if (customForm.indexOf('6') != -1) {
		            			$('#qualification').val(info.qualificationCode);
		            		};
		            		switch (t.config.fellowshipMainType){
								case 1:t.getSubInfo();// 海外进修
									break;
								case 2:// 国内进修
									if (infoMajor.fellowshipDepartment && infoMajor.fellowshipDepartment != "") {
										$.each($('.department_select option'),function(i,em){
			                                if($(em).val()==infoMajor.fellowshipDepartment){
			                                    $(em).attr("selected",true);
			                                }
		                            	});
		                            	$('.department_select').trigger('change');
		                            	$.each($('.profession_select option'),function(i,em){
			                                if($(em).val()==infoMajor.tagName){
			                                    $(em).attr("selected",true);
			                                }
		                            	});
		                            	$('.profession_select').trigger('change');
		                            	$.each($('.term_select option'),function(i,em){
			                                if($(em).val()==infoMajor.fellowshipDate){
			                                    $(em).attr("selected",true);
			                                }
		                            	});
									}
									break;
								case 3:// 培训课程
									if (infoMajor.tagName && infoMajor.tagName != "") {
										$.each($('.trDirection_select option'),function(i,em){
			                                if($(em).val()==infoMajor.tagName){
			                                    $(em).attr("selected",true);
			                                }
		                            	});
									}
									break;
								default:
									break;
							};
                            if(info.isAgreeAdjust){
                                $(".checkAgree input").attr("checked","true");
                            }else{
                                $(".checkAgree input").removeAttr("checked");
                            }
                            t.addProvince();
//                          t.getSubInfo();
                        }
                    }
                },
                error:function(){}
            });
        },
        //获取已报名的志愿信息
        getSubInfo:function(){
            var t=this;
            var data={};
            var param={};
            data.customerId= t.config.customerId;
            data.fellowshipId= t.config.fellowshipId;
            param.paramJson= $.toJSON(data);
            $.ajax({
                type : "post",
                url : t.path.getSub,
                data : param,
                dataType : "json",
                success : function(rep){
                    if(rep.responseObject.responseData){
                        if(rep.responseObject.responseData.data_list&&rep.responseObject.responseData.data_list.length>0){
                            var sub=rep.responseObject.responseData.data_list;
                            $.each($(".school_select"),function(i,em){
                                $.each(sub,function(j,val){
                                    if($(em).attr("sortid")==val.sortId){
                                        $.each($(em).find("option"),function(k,o){
                                            if($(o).val()==val.fellowshipSubId){
                                                $(o).attr("selected",true);
                                            }
                                        })
                                    }
                                })
                            })
                        }
                    }
                },
                error:function(){}
            });
        },
        //保存信息
        baseSubmit:function(){
            var t=this;
            t.isClick=0;
            $(".save_btn").on("click",function(){
                if(!t.isClick){
                    $("#regBaseInfo").submit();
                }
            });
            $("#regBaseInfo").validate({
                submitHandler : function() {
                    t.isClick=1;
                    var sortIdList=[];
                    var schoolList=[];
                    var data={};
                    var param={};
                    data.id= t.config.baseId;
                    data.customerId = t.config.customerId;
                    data.mobile=$("#mobile").val();
                    data.email=$("#email").val();
                    data.weixinCode=$("#weixinCode").val()?$("#weixinCode").val():"";
                    data.provinceId=$("#provinceId").val();
                    data.province=$(".province option:selected").val();
                    data.cityId=$("#cityId").val();
                    data.city=$(".city option:selected").val();
                    data.districtId=$("#districtId").val();
                    data.district=$(".district option:selected").val();
                    data.detailAddress=$("#detailAddress").val();
                    data.zipCode=$("#zipCode").val();
                    data.fellowshipMainType = t.config.fellowshipMainType;
                    if($(".agreeCheck input").attr("checked")){
                        data.isAgreeAdjust=1;
                    }else{
                        data.isAgreeAdjust=0;
                    }
					if (customForm.indexOf('1') != -1) {
                		data.certificatesId = $('.idType option:selected').data("id");
                		data.certificatesCode = $('#idNumber').val();
            		};
            		if (customForm.indexOf('2') != -1) {
                		data.highestDegree = $('.highestEducation option:selected').data("id");
            		};
            		if (customForm.indexOf('3') != -1) {
            			data.companyType = $('.unitProperties').val();
            		};
            		if (customForm.indexOf('4') != -1) {
            			data.customerType = $('.studentType').val();
            		};
            		if (customForm.indexOf('5') != -1) {
            			data.practiceCode = $('#practice').val();
            		};
            		if (customForm.indexOf('6') != -1) {
            			data.qualificationCode = $('#qualification').val();
            		};
            		//获取进修目的及要求
            		data.purposeRequest = $("#objective").val();
            		switch (t.config.fellowshipMainType){
						case 1:
							$.each($(".school_select"),function(i,em){
		                        sortIdList.push({"sortId":$(em).attr("sortId"),"fellowshipSubId":$("option:selected",em).val()});
		                    });
							break;
						case 2:
						    if($(".school_select").length){
                                $.each($(".school_select"),function(i,em){
                                    schoolList.push({"sortId":$(em).attr("sortId"),"fellowshipSubId":$("option:selected",em).val()});
                                });
                            }
//							if ($('.department_select').val() != '请选择') {
                            if($('.department_select').val()&&$('.department_select').val() != '请选择'){
                                sortIdList.push({'fellowshipDepartment':$('.department_select').val(),'tagName':$('.profession_select option:selected').val(),'tagId':$('.profession_select option:selected').data("tagid"),'fellowshipMajorId':$('.profession_select option:selected').data("fellowshipmajorid"),'fellowshipDate':$('.term_select').val()});
                            }
//								sortIdList.push({'tagName':$('.profession_select option:selected').val(),'tagId':$('.profession_select option:selected').data("tagid"),'fellowshipMajorId':$('.profession_select option:selected').data("fellowshipmajorid")});
//								sortIdList.push({'fellowshipDate':parseInt($('.term_select').val())});
//							}
							break;
						case 3:
							sortIdList.push({'tagName':$('.trDirection_select option:selected').val(),'tagId':$('.trDirection_select option:selected').data("tagid"),'fellowshipMajorId':$('.trDirection_select option:selected').data("fellowshipmajorid")});
							
							break;
						default:
							break;
					};
            		//获取志愿
//                  $.each($(".school_select"),function(i,em){
//                      sortIdList.push({"sortId":$(em).attr("sortId"),"fellowshipSubId":$("option:selected",em).val()});
//                  });
                    data.sortIdList=sortIdList;
                    data.schoolList=schoolList;
                    param.paramJson = $.toJSON(data);
                    comm.LightBox.showloading();
                    $.ajax({
                        url: t.path.update,
                        dataType:"json",
                        type:"post",
                        data:param,
                        success:function(rep){
                            t.isClick=0;
                            if(rep&&rep.responseObject.responseStatus){
                                comm.LightBox.hideloading();
                                t.clear();
                                t.options.callback()&& t.options.callback();
                            }
                        }
                    })
                },
                rules : {
                	"idType" : {
                		"required" : true,
                	},
                	"idNumber" : {
                		"required" : true,
                        "rangelength": [ 1, 50 ]
                	},
                	"highestEducation" : {
                		"required" : true,
                	},
                	"unitProperties" : {
                		"required" : true,
                	},
                	"studentType" : {
                		"required" : true,
                	},
                	"practice" : {
                		"required" : true,
                	},
                	"qualification" : {
                		"required" : true,
                	},
                    "email" : {
                        "required" : true,
                        "allinEmail" : true,
                        "rangelength": [ 1, 50 ]
                    },
                    "mobile":{
                        "required":true,
                        "mobile":true
                    },
                    "weixinCode":{
                        "required":true,
                        "weixin":true
                    },
                    "zipCode":{
                        "required":true,
                        "zip":true
                    },
                    "detailAddress":{
                        "required":true,
                        "rangelength":[1,50]
                    },
                    "department_select":{
                        "required":true
                    },
                    "trDirection_select":{
                        "required":true
                    },
                    "objective" : {
                        "rangelength": [ 0, 200 ]
                    }
                },
                messages : {
                	"idType" : {
                		"required" : "你的证件类型是什么？",
                	},
                	"idNumber" : {
                		"required" : "你的证件号码是什么？",
                		"rangelength":"证件号码不长于50位！"
                	},
                	"highestEducation" : {
                		"required" : "你的最高学历是什么？",
                	},
                	"unitProperties" : {
                		"required" : "你的单位性质是什么？",
                	},
                	"studentType" : {
                		"required" : "你的学员类型是什么？",
                	},
                	"practice" : {
                		"required" : "你的医师执业证号是什么？",
                	},
                	"qualification" : {
                		"required" : "你的医师资格证号是什么？",
                	},
                    "email" : {
                        "required" : "你的邮件是什么？",
                        "allinEmail" : "不像是有效的电子邮箱。",
                        "rangelength":"邮件地址不长于50位！"
                    },
                    "mobile":{
                        "required":"请输入手机号！",
                        "mobile":"请输入正确的手机号！"
                    },
                    "weixinCode":{
                        "required":"请输入微信号！",
                        "weixin":"请输入正确的微信号！"
                    },
                    "zipCode":{
                        "required":"请输入邮政编码！",
                        "zip":"请输入正确的邮政编码！"
                    },
                    "detailAddress":{
                        "required":"请填写具体地址！",
                        "rangelength":"具体地址最长50个汉字"
                    },
                    "department_select":{
                        "required":"请选择进修科室"
                    },
                    "trDirection_select":{
                        "required":"请选择培训方向"
                    },
                    "objective" : {
                        "rangelength":"进修目的及要求最长200个汉字"
                    }
                },
                showErrors : poshyTipShowErrors,
                hideErrors : poshyTipHideErrors
            })
        }
    }
    controller.init(obj);
}
