/**
 * 功能描述： 英文简历的完善与编辑
 * 使用方法:
 * 注意事件：
 * 引入来源：  作用：
 *
 * Created by LiChunHui on 2015/12/21.
 */
var enResume=function(obj){
    var languageFlag=1;
    var closeBaseInfo={};
    var monthArr=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var path={
        getLogo: PC_CALL + "commdata/getLogoUrlList/",
        attUpload: PC_CALL + "comm/upload_attachment/upload/",
        unitInfo: PC_CALL + "customer/unite/json_info/",
        getDataRoleConfigs: PC_CALL + "comm/data/roleconfig/getDataRoleConfigs/",
        summary: PC_CALL + "customer/baseinfo/saveFellowSummary/",
        savaLearn: PC_CALL + "customer/baseinfo/savePurposeEn/",
        hospital: PC_CALL + "commdata/getHospitalList/",
        saveBaseInfo: PC_CALL + "customer/baseinfo/saveBasicInfo/"
    },
    controller= {
        config: {
			fellowshipId:obj.fellowshipId
        },
        el: {},
        template:{

        },
        init:function(obj){
            var t=this;
            this.options={};
            var o={
                container:$("body")
            };
            this.options= $.extend(o,obj);
            $("#en_resume").show().attr("data-fId", t.config.fellowshipId);
            $(".Ev-EnResumePreview").attr("href","/pages/column/fellowship/fellowship_nowResumePreview.html?cId="+$('#sesCustomerId').val()+"&fId="+t.config.fellowshipId+"&lanFlag="+languageFlag);
            this.par=this.options.type=="ch"?"#ch_resume ":"#en_resume ";
           /* if(!$("#en_resume").attr("hasClick")) {
                $("#en_resume").attr("hasClick",1);*/
                $.ajax({
                    type: "post",
                    url: path.unitInfo,
                    data: {paramJson: $.toJSON({"customerId": $("#sesCustomerId").val(), "logoUseFlag": UseFlag.d,'fellowshipId':t.config.fellowshipId})},
                    dataType: "json",
                    success: function (rep) {
                        if (rep && rep.responseObject.responseData.data_list) {
                            if (rep.responseObject.responseData.data_list[0].customer_baseinfo) {
                                baseInfo = rep.responseObject.responseData.data_list[0].customer_baseinfo;
                            }
                            if (rep.responseObject.responseData.data_list[0].customer_unite) {
                                unit = rep.responseObject.responseData.data_list[0].customer_unite;
                            }
                            if (rep.responseObject.responseData.data_list[0].customer_auth) {
                                auth = rep.responseObject.responseData.data_list[0].customer_auth;
                            }
                            if (rep.responseObject.responseData.data_list[0].customer_att) {
                                logo = rep.responseObject.responseData.data_list[0].customer_att;
                            }
                            if (rep.responseObject.responseData.data_list[0].customer_statistic) {
                                statistic = rep.responseObject.responseData.data_list[0].customer_statistic;
                            }
                            if (rep.responseObject.responseData.data_list[0].customer_fellowship) {
                                fellowship = rep.responseObject.responseData.data_list[0].customer_fellowship;
                            }
                        }
                        base.init(t.options);
                        summary.init(t.options);
                        learn.init(t.options);
                    },
                    error: function () {
                    }
                });
                $.ajax({
                    type: "post",
                    url: path.getLogo,
                    data: {paramJson: $.toJSON({"refId": $("#sesCustomerId").val(), "logoType": 11})},
                    dataType: "json",
                    success: function (rep) {
                        url = "";
                        if (rep && rep.responseObject.length > 0) {
                            url = rep.responseObject[0].logoUrl;
                        }
                        t.uploadPic(url);
                        t.addMask();
                    },
                    error: function () {
                    }
                });

                t.replaceCh();
                occ.init(t.options);
                edu.init(t.options);
                cEdu.init(t.options);
                honor.init(t.options);
                fund.init(t.options);
                social.init(t.options);
                opus.init(t.options);
                patent.init(t.options);
                language.init(t.options);
            //}

            $(t.par+".per_bj_floor").each(function(i,em){//展开和收缩
                if(!$(em).find(".up_down").attr("up")){
                    $(em).find(".up_down").attr("up",0);
                }
                $(em).find(".up_down").off("click").on("click",function(){
                    if($(this).attr("up")==1){//展开
                        $(this).attr("up",0);
                        $(this).removeClass("layerTranD").addClass("layerTranU");
                        $(em).find(".up_down_con").show();
                        if($(this).attr("edit")!="1"){
                            $(em).find(".layerEdit").show();
                        }
                    }else{//收缩
                        $(this).attr("up",1);
                        $(this).removeClass("layerTranU").addClass("layerTranD");
                        $(em).find(".up_down_con").hide();
                        $(em).find(".layerEdit").hide();
                    }

                });
            });
            $(t.par+".resume_close").off("click").on("click",function(){//关闭弹层

                //关闭按钮的时候检测如果未保存成功过，关闭时自动保存，否则后台无法存入数据库表中
                if(!$(this).attr("data-flag")==1){
                    $.ajax({
                        type: "post",
                        url: path.saveBaseInfo,
                        data: {
                            id:closeBaseInfo.id,
                            resumeType:1,
                            fellowshipId:$(this).parents("#en_resume").attr("data-fId"),
                            sexId:closeBaseInfo.sexId,
                            birthday:closeBaseInfo.birthday,
                            medicalTitleEn:closeBaseInfo.medicalTitle,
                            companyEn:closeBaseInfo.company,
                            firstNameEn:closeBaseInfo.firstName,
                            lastNameEn:closeBaseInfo.lastName,
                            registAddressEn:closeBaseInfo.registAddressEn
                        },
                        dataType: "json",
                        success: function (rep) {
                            if (rep.rows.responseStatus) {}
                        }
                    });
                }


                var _fId=$(this).parents("#en_resume").attr("data-fId");
                $("#ch_resume").hide();
                $("#en_resume").hide();
                base.clearData();
                $(t.par+".summary_cancel").click();
                $(t.par+".learn_cancel").click();
                occ.clear();
                edu.clear();
                cEdu.clear();
                honor.clear();
                fund.clear();
                social.clear();
                opus.clear();
                patent.clear();
                language.clear();
                $(t.par+".per_bj_floor").each(function(i,em){//展开和收缩
                    if(i>0){
                        $(em).find(".up_down").attr("up",0);
                        $(em).find(".up_down").removeClass("layerTranD").addClass("layerTranU");
                        $(em).find(".up_down_con").show();
                        $(em).find(".layerEdit").show();
                    }else{
                        /*$(em).find(".up_down").attr("up",1);
                         $(em).find(".up_down").removeClass("layerTranU").addClass("layerTranD");
                         $(em).find(".up_down_con").hide();
                         $(em).find(".layerEdit").hide();*/
                    }
                });

                $.each($(t.par+ ".base_show .baseinfo_after_text01"),function(index1,ele1){
                    if(!$.trim($(ele1).text())){
                        baseFinish=false;
                        return false;
                    }else{
                        baseFinish=true;
                    }
                });
                var _editBtn=$($(".Ev-ApplyInfoShowOrHide[data-fId="+_fId+"]")).find(".enResume_btn");
                if(baseFinish&&$(t.par+ ".summary_count").text().length>0&&$(t.par+ ".occ_list").length>0&&$(t.par+ ".edu_list").length>0){
                    _editBtn.text("编辑简历");
                    _editBtn.parents(".fs_rereq").addClass("sub_blue").append('<div class="fs_duig"></div>');
                }else{
                    _editBtn.text("完善简历");
                    _editBtn.parents(".fs_rereq").removeClass("sub_blue").find(".fs_duig").remove();
                }
                //if($(t.par+ ".name").text().length>0&&$(t.par+ ".sex").text().length>0&&$(t.par+ ".birth").text().length>0&&$(t.par+ ".medical").text().length>0&&$(t.par+ ".company_show").text().length>0&&$(t.par+ ".address_show").text().length>0&&$(t.par+ ".summary_count").text().length>0&&$(t.par+ ".occ_list").length>0&&$(t.par+ ".edu_list").length>0){
                //    t.options.that.text("编辑简历");
                //    t.options.that.parents(".fs_rereq").addClass("sub_blue").append('<div class="fs_duig"></div>');
                //}else{
                //    t.options.that.text("完善简历");
                //    t.options.that.parents(".fs_rereq").removeClass("sub_blue").find(".fs_duig").remove();
                //}
                t.options.callback&& t.options.callback();
                //事件埋点
                comm.creatEvent({
                    triggerType:"全站功能按钮点击",
                    keyword:"fellowship英文简历关闭",
                    actionId:43
                });
            })
        },
        //正则使输入框只能填写英文标点和数字
        replaceCh:function(){
            var chrnum = /^([\@A-Za-z0-9\ \!\#\$\%\^\&\*\.\~\,\.\/\?\>\<\:\;\+\-\_\|\'\"\\\=\`\(\)\{\}\[\]]+)$/;
            $("#en_resume input,#en_resume textarea").bind("keyup keydown change input cut paste drop",function(){
                if(!chrnum.test($(this).val())){
                    input=$(this).val();
                    newInput="";
                    $.each(input,function(i,val){
                        if(!chrnum.test(val)){
                            newInput+='';
                        }else{
                            newInput+=val;
                        }
                    })
                    $(this).val(newInput);
                }
            })
        },
        addMask: function () {
            $("#imgfile_en").parent().append('<div class="layerChoose imgMask" style="display: none">'+
            '<div class="chooseImgT"><img src="//img00.allinmd.cn/column/fellowship/sc_img_tishi.png"></div>'+
            '<div class="chooseImgC font_yahei">Photo</div>'+
            '<div class="chooseImgB">JPG or PNG<br>Size:< 5M</div>'+
            '</div>');
            $("#imgfile_en").parent().bind("mouseover", function () {
                $(this).find(".imgMask").show();
            }).bind("mouseout", function () {
                $(".imgMask").hide();
            });
        },
        uploadPic:function(picpath){
            var t = this;
            //if ($("#en_logo [id^=czyx]").length > 0) {
                $("#en_logo").html('<input type="file" id="imgfile_en" name="file" />');
            //}
            var paramJson = $.toJSON({imageType:1,logoType:11,domain:location.hostname});
            czyx.uploadReplace('#imgfile_en', {
                url: path.attUpload, //文件处理的URL,
                data: {paramJson: paramJson},
                uploadReplaceCss: {
                    //设置上传按钮图片
                    background: 'url(' + picpath + ') center no-repeat',
                    backgroundSize: '100%',
                    width: "100%",             //上传按钮的宽度
                    height: "100%"              //上传按钮的高度
                },
                uploadInputCss: {
                    width: "100%",             //上传按钮的宽度
                    height: "100%"             //上传按钮的高度
                },
                uploadBefore: function () {
                    if (!/\.((jpg)|(png))$/i.test(this.value)) {
                        alert('只允许上传.jpg .png类型的图片文件');
                        return false;
                    }
                    var fileSize = comm.file.getFileSize(document.getElementById("imgfile_en"));
                    if (fileSize > 5242880) {
                        alert('图片不能大于' + 5242880 / 1048576 + "M");
                        return false;
                    }

                },
                uploadEnd: function (serverJson) {//上传完毕后调用
                    try {
                        serverJson = $.parseJSON(serverJson);
                        if (serverJson.responseObject.responseStatus) {
                            t.uploadPic(serverJson.responseObject.responseMessage.url);
                            t.addMask();
                            $("#ch_logo div").eq(0).css({"background-image":"url("+serverJson.responseObject.responseMessage.url+")"});
                        } else {
                            if (serverJson.message) {
                                alert(serverJson.message);
                            } else {
                                alert("上传失败")
                            }

                        }
                    } catch (e) {
                        alert("上传失败");
                        return;
                    }
                }
            });
        }

    };
    var base = {};
    base = {
        init: function (obj) {
            var t=this;
            this.par=obj.type=="ch"?"#ch_resume ":"#en_resume ";
            ymd({
                year: $(t.par+ ".year"),
                month: $(t.par+ ".month"),
                day: $(t.par+ ".day"),
                default1: 1,
                en:1,
                css: {"padding-left": "2px"}
                //order:1
            });

            this.getInfo();
            this.bindEdit();
            //职称的选择
            if(!$(t.par+ ".medical_par").find(".p_l_zc_xl").length){
                $(t.par+ ".medical_par").medicalTitle({
                    en:1,
                    container: $(t.par+ ".med_title")//存放已选择的职称
                });
            }
            this.bindCancel();
        },
        getInfo: function () {
            var t=this;
            //$(t.par+".nick").text(baseInfo.nickname);
            lastNameEn= ($.trim(fellowship.lastNameEn)&&!$.isEmptyObject(fellowship.lastNameEn))?fellowship.lastNameEn:auth.lastNameEn;
            firstNameEn= ($.trim(fellowship.firstNameEn)&&!$.isEmptyObject(fellowship.firstNameEn))?fellowship.firstNameEn:auth.firstNameEn;
            medicalTitleEn= ($.trim(fellowship.medicalTitleEn)&&!$.isEmptyObject(fellowship.medicalTitleEn))?fellowship.medicalTitleEn:auth.medicalTitleEn;
            companyEn= ($.trim(fellowship.companyEn)&&!$.isEmptyObject(fellowship.companyEn))?fellowship.companyEn:auth.companyEn;
            closeBaseInfo.id=baseInfo.id;
            closeBaseInfo.lastName=lastNameEn;
            closeBaseInfo.firstName=firstNameEn;
            closeBaseInfo.sexId=baseInfo.sexId;
            closeBaseInfo.birthday=baseInfo.birthday;
            closeBaseInfo.medicalTitle=medicalTitleEn;
            closeBaseInfo.company=companyEn;
            closeBaseInfo.registAddressEn=($.trim(baseInfo.registAddressEn)&&!$.isEmptyObject(baseInfo.registAddressEn))?baseInfo.registAddressEn:"";

            if (lastNameEn && firstNameEn) {
                $(t.par+ ".name").text(lastNameEn + firstNameEn);
            }
            //$(t.par+".region").text(baseInfo.city);
            if (baseInfo.sexId == "1") {
                $(t.par+ ".sex").text("Male");
            }
            if (baseInfo.sexId == "2") {
                $(t.par+ ".sex").text("Female");
            }
            var birth=getEnTime({'date':baseInfo.birthday});
            $(t.par+ ".birth").text(birth.year?(birth.year+'.'+birth.month):'');

            $(t.par+ ".medical").text(medicalTitleEn?comm.cutLine(medicalTitleEn, "_", "，"):'');
            $(t.par+ ".company_show").text(companyEn);

            var registAddressEn;
            if(!$.trim(baseInfo.registAddressEn)|| $.isEmptyObject(baseInfo.registAddressEn)){
                registAddressEn="";
            }else{
                registAddressEn=baseInfo.registAddressEn;
            }
            $(t.par+ ".address_show").text(registAddressEn);
            /*if (auth.state >= 0) {
                if (typeof baseInfo.sexId == "object" && comm.isEmptyObject(baseInfo.sexId)) {
                    $(t.par+ ".sex").parents(".p_base_info_jbxx01").hide();
                }
                if (!baseInfo.birthday || baseInfo.birthday == " ") {
                    $(t.par+ ".birth").parents(".p_base_info_jbxx01").hide();
                }
            }*/
        },
        //取消
        bindCancel: function () {
            var t = this;
            $(t.par+ ".base_cancel").on("click", function () {
                t.clearData();
                //事件埋点
                comm.creatEvent({
                    triggerType:"全站功能按钮点击",
                    keyword:"个人简介修改取消",
                    actionId:45
                });
            });
        },
        //清空数据
        clearData: function () {
            var t=this;
            $(t.par+ ".base_show").show();
            $(t.par+ ".base_edit").hide();
            $(t.par+ ".base_edit_btn").show();
            $(t.par+ ".address").val("");
            $(t.par+ "input[name='sexId']").eq(0).attr("checked", "true");
            $(t.par+ ".med_title").empty();
            $(t.par+ ".company_in").val("");
            $(t.par+ ".area_sed").empty();
            $(t.par+ ".company_in").removeClass("baseinfo_error_red");
            $(t.par+ ".company_error").hide();
            $(t.par+ ".base_edit").find("input").parent().removeClass("baseinfo_error_red");
            $(t.par+ ".base_edit").find(".error_red_icon").hide();
            $(t.par+".up_down").eq(0).attr("edit",0);
        },
        bindEdit: function () {
            var t = this;
            $(t.par+ ".base_edit_btn").on("click", function () {
                var _fId=$(this).parents("#en_resume").attr("data-fId");
                $(this).hide();
                $(t.par+ ".base_show").hide();
                $(t.par+ ".base_edit").show();
                $(t.par+".up_down").eq(0).attr("edit",1);
                $.ajax({
                    type: "post",
                    url: path.unitInfo,
                    data: {paramJson: $.toJSON({"customerId": $("#sesCustomerId").val(), "logoUseFlag": UseFlag.d,fellowshipId:_fId})},
                    dataType: "json",
                    success: function (rep) {
                        if (rep && rep.responseObject.responseData) {
                            if (rep.responseObject.responseData.data_list[0].customer_baseinfo) {
                                baseInfo = rep.responseObject.responseData.data_list[0].customer_baseinfo;
                            }
                            if (rep.responseObject.responseData.data_list[0].customer_unite) {
                                unit = rep.responseObject.responseData.data_list[0].customer_unite;
                            }
                            if (rep.responseObject.responseData.data_list[0].customer_auth) {
                                auth = rep.responseObject.responseData.data_list[0].customer_auth;
                            }
                            if (rep.responseObject.responseData.data_list[0].customer_fellowship) {
                                fellowship = rep.responseObject.responseData.data_list[0].customer_fellowship;
                            }
                            lastNameEn= ($.trim(fellowship.lastNameEn)&&!$.isEmptyObject(fellowship.lastNameEn))?fellowship.lastNameEn:auth.lastNameEn;
                            firstNameEn= ($.trim(fellowship.firstNameEn)&&!$.isEmptyObject(fellowship.firstNameEn))?fellowship.firstNameEn:auth.firstNameEn;
                            medicalTitleEn= ($.trim(fellowship.medicalTitleEn)&&!$.isEmptyObject(fellowship.medicalTitleEn))?fellowship.medicalTitleEn:auth.medicalTitleEn;
                            companyEn= ($.trim(fellowship.companyEn)&&!$.isEmptyObject(fellowship.companyEn))?fellowship.companyEn:auth.companyEn;
                            //$(t.par+ ".nickName").val(baseInfo.nickname);
                            $(t.par+ ".baseId").val(baseInfo.id);
                            if (auth.state >= 0) {
                                //$(t.par+ ".firstName").attr("disabled", true);
                                //$(t.par+ ".lastName").attr("disabled", true);
                                $(t.par+ ".firstName").val(firstNameEn);
                                $(t.par+ ".lastName").val(lastNameEn);
                            } else {
                                //$("#re_con").html('<a href="javascript:;" class="authBtn">申请认证</a>');
                            }
                            $(".authBtn").on("click", function () {
                                user.login({
                                    callback: function () {
                                        location.reload();
                                    },scene:privilegeSceneConst.eSceneTypeFellow
                                })
                            }) ;
                            /*$(t.par+ ".province_city").ProvinceCity({
                                 addDiv:1,
                                 province:baseInfo.provinceId,
                                 city:baseInfo.cityId,
                                 district:baseInfo.districtId,
                                 provinceChange:function(){},
                                 cityChange:function(){},
                                 districtChange:function(){}
                             });*/
                            $.each($(t.par+ "input[name='sexId']"), function (i, em) {
                                if ($(em).val() == baseInfo.sexId) {
                                    $(em).attr("checked", "true");
                                }
                            });

                            var year = baseInfo.birthday.substring(0, 4);
                            var month = baseInfo.birthday.substring(5, 7);
                            var day = baseInfo.birthday.substring(8, 10);
                            gettime($(t.par+ ".year"), year);
                            gettime($(t.par+ ".month"), month);
                            gettime($(t.par+ ".day"), day);
                            if (!year || year == "0" || year == " ") {
                                $(t.par+ ".year option").eq(0).attr("selected", true);
                                $(t.par+ ".month option").eq(0).attr("selected", true);
                                $(t.par+ ".day option").eq(0).attr("selected", true);
                            }

                            var medical = medicalTitleEn;
                            var medical1 = medical.split(",");
                            var medicalTitle = "";
                            var ids = [];
                            $.each(medical1, function (i, val) {
                                if (val) {
                                    if (val.split("_")[1]) {
                                        ids.push(val.split("_")[0]);
                                        medicalTitle += (val.split("_")[1] + "，");
                                    } else {
                                        medicalTitle += (val + "，");
                                    }
                                }
                            });
                            $(t.par+ ".med_title").attr("medicalTitle", medical);
                            $(t.par+ ".med_title").text(medicalTitle.substring(0, medicalTitle.length - 1));
                            //清空职称的选中状态
                            $(t.par+ ".medical_par .medical_list_li").attr("select-status", "false");
                            $(t.par+ ".medical_par .medical_list_li").removeClass("active");
                            //比对是对应职称选中
                            $.each($(t.par+ ".medical_par .medical_list_li"), function (i, em) {
                                $.each(ids, function (j, val) {
                                    if ($(em).attr("medicalid") == val) {
                                        $(em).attr("select-status", "true");
                                        $(em).addClass("active");
                                    }
                                });
                            });

                            var registAddress;
                            if(baseInfo.registAddress=="无"||!$.trim(baseInfo.registAddress)|| $.isEmptyObject(baseInfo.registAddress)){
                                registAddress="";
                            }else{
                                registAddress=baseInfo.registAddress;
                            }
                            var registAddressEn;
                            if(baseInfo.registAddressEn=="无"||!$.trim(baseInfo.registAddressEn)|| $.isEmptyObject(baseInfo.registAddressEn)){
                                registAddressEn="";
                            }else{
                                registAddressEn=baseInfo.registAddressEn;
                            }
                            $(t.par+ ".company_in").val(companyEn);
                            $(t.par+ ".address_in").attr("placeholder",registAddress);
                            $(t.par+ ".address_in").val(registAddressEn);
                            t.bindSave(auth.state);
                        }
                    },
                    error: function () {
                    }
                });
            });
        },
        bindSave: function (state) {
            var t=this;
            $(t.par+ ".base_save").on("click", function () {
                var data = {};
                data.id = $(t.par+ ".baseId").val();
                data.resumeType=languageFlag;
                data.fellowshipId=$(this).parents("#en_resume").attr("data-fId");
                //data.nickname=$(t.par+".nickName").val();
                //if (!state) {
                    data.firstNameEn = $(t.par+ ".firstName").val();
                    data.lastNameEn = $(t.par+ ".lastName").val();
                //}
                //data.province=$(t.par+".province option:selected").val();
                //data.provinceId=$(t.par+".province option:selected").attr("provinceid");
                //data.city=$(t.par+".city option:selected").val();
                //data.cityId=$(t.par+".city option:selected").attr("cityid");
                //data.district=$(t.par+".district option:selected").val();
                //data.districtId=$(t.par+".district option:selected").attr("districtid");
                $(t.par+ "input[name='sexId']").each(function (i, em) {
                    if ($(em).attr("checked")) {
                        data.sexId = $(em).val();
                    }
                });
                if ($(t.par+ ".year option:selected").val() != "0" && $(t.par+ ".month option:selected").val() != "0" && $(t.par+ ".day option:selected").val() != "0") {
                    data.birthday = $(t.par+ ".year option:selected").val() + '-' + $(t.par+ ".month option:selected").val() + '-' + $(t.par+ ".day option:selected").val();
                } else {
                    data.birthday = "";
                }
                data.medicalTitleEn = $(t.par+ ".med_title").attr("medicaltitle");
                data.companyEn = $(t.par+ ".company_in").val();
                data.registAddressEn=$(t.par+'.address_in').val();

                var isSuccess = 1;
                if(!$.trim(data.firstNameEn)){
                    $(t.par+ ".firstName").parent().addClass("baseinfo_error_red");
                    isSuccess = 0;
                }else if(comm.getByteLen(data.firstNameEn)>50){
                    $(t.par+ ".firstName").parent().addClass("baseinfo_error_red");
                    isSuccess = 0;
                }else{
                    $(t.par+ ".firstName").parent().removeClass("baseinfo_error_red");
                }
                if(!$.trim(data.lastNameEn)){
                    $(t.par+ ".lastName").parent().addClass("baseinfo_error_red");
                    isSuccess = 0;
                }else if(comm.getByteLen(data.lastNameEn)>50){
                    $(t.par+ ".lastName").parent().addClass("baseinfo_error_red");
                    isSuccess = 0;
                }else{
                    $(t.par+ ".lastName").parent().removeClass("baseinfo_error_red");
                }
                if(!data.sexId){
                    $(t.par+ ".sex_error").show();
                    isSuccess = 0;
                }else{
                    $(t.par+ ".sex_error").hide();
                }
                if(!data.birthday){
                    $(t.par+ ".date_error").show().text("请选择出生年月！");
                    isSuccess = 0;
                }else if(!checkEndTime(data.birthday,comm.date.local_time().substr(0,10))){
                    $(t.par+ ".date_error").show().text("请选择正确的出生年月！");
                    isSuccess = 0;
                }else{
                    $(t.par+ ".date_error").hide();
                }
                if (!data.medicalTitleEn) {
                    $(t.par+ ".medical_par").addClass("baseinfo_error_red");
                    $(t.par+ ".med_error").show();
                    isSuccess = 0;
                } else {
                    $(t.par+ ".medical_par").removeClass("baseinfo_error_red");
                    $(t.par+ ".med_error").hide();
                }
                ;
                if (!$.trim(data.companyEn)) {
                    $(t.par+ ".company_in").parent().addClass("baseinfo_error_red");
                    $(t.par+ ".company_error").show().text("请填写医院！");
                    isSuccess = 0;
                } else if (comm.getByteLen(data.companyEn) > 200) {
                    $(t.par+ ".company_in").parent().addClass("baseinfo_error_red");
                    $(t.par+ ".company_error").show().text("最长100个中文或200个英文！");
                    isSuccess = 0;
                } else {
                    $(t.par+ ".company_in").parent().removeClass("baseinfo_error_red");
                    $(t.par+ ".company_error").hide();
                };

                if (!$.trim(data.registAddressEn)) {
                    $(t.par+ ".address_in").parent().addClass("baseinfo_error_red");
                    $(t.par+ ".address_error").show().text("请填写英文地址！");
                    isSuccess = 0;
                } else if (comm.getByteLen(data.registAddressEn) > 100) {
                    $(t.par+ ".address_in").parent().addClass("baseinfo_error_red");
                    $(t.par+ ".address_error").show().text("最长50个中文或100个英文！");
                    isSuccess = 0;
                } else {
                    $(t.par+ ".address_in").parent().removeClass("baseinfo_error_red");
                    $(t.par+ ".address_error").hide();
                };


                if (isSuccess == 0) {
                    return;
                }
                ;
                $(t.par+ ".base_edit").mask("");
                $.ajax({
                    type: "post",
                    url: path.saveBaseInfo,
                    data: data,
                    dataType: "json",
                    success: function (rep) {
                        $(t.par+ ".base_edit").unmask("");
                        if (rep.rows.responseStatus) {
                            $(t.par+ ".resume_close").attr("data-flag","1");
                            $(t.par+ ".base_edit_btn").show();
                            $(t.par+ ".base_show").show();
                            $(t.par+ ".base_edit").hide();
                            $(t.par+".up_down").eq(0).attr("edit",0);
                            //$(t.par+ ".region").text(data.city);
                            $(t.par+ ".name").text(data.lastNameEn + data.firstNameEn);
                            if (data.sexId == "1") {
                                $(t.par+ ".sex").text("Male");
                                $("#ch_resume .sex").text("男");
                            }
                            if (data.sexId == "2") {
                                $(t.par+ ".sex").text("Female");
                                $("#ch_resume .sex").text("女");
                            }
                            var birth=getEnTime({'date':data.birthday});
                            $("#ch_resume .birth").text(data.birthday ? data.birthday : '');
                            $(t.par+ ".birth").text(birth.year?(birth.year+'.'+birth.month):'');
                            $(t.par+ ".medical").text($(t.par+ ".med_title").text());
                            $(t.par+ ".company_show").text(data.companyEn);
                            $(t.par+ ".address_show").text(data.registAddressEn);


                            /*if (state >= 0) {
                                if (!data.birthday) {
                                    $(t.par+ ".birth").parents(".p_base_info_jbxx01").hide();
                                } else {
                                    $(t.par+ ".birth").parents(".p_base_info_jbxx01").show();
                                }
                                if (!data.sexId) {
                                    $(t.par+ ".sex").parents(".p_base_info_jbxx01").hide();
                                } else {
                                    $(t.par+ ".sex").parents(".p_base_info_jbxx01").show();
                                }
                            }*/
                            $.topTip({mark: "success",showTime:"2", content: "基本信息保存成功！"});
                        }
                    },
                    error: function () {
                    }
                });
            })
        }
    };
    
    //学习目的
    var learn = {};
    learn = {
        init: function (obj) {
            var t=this;
            var _kv=fellowship.purposeRequestEn;
            this.par=obj.type=="ch"?"#ch_resume ":"#en_resume ";
            $(t.par+".learn_save").attr("on", "true");
            $(t.par+".learn_hid").val(($.trim(_kv)&&!$.isEmptyObject(_kv))?_kv:"");
            $(t.par+".learn_count").text($(t.par+".learn_hid").val());
            if($(t.par+".learn_count").text()){
                $(t.par+".learn_count").expandShrink({len: 580,en:1});
            }
            comm.textChange({"$tex":$(t.par+".learn"),"noTop":1});
            this.edit();
            this.save();
            this.cancel();
        },
        edit: function () {
            var t=this;
            $(t.par + ".learn").textareaAutoHeight({minHeight: 48, maxHeight: 460});
            $(t.par+".learn_edit_btn").on("click", function () {
                $(this).hide();
                $(t.par+".learn_edit").show();
                $(t.par+".learn_show").hide();
                $(t.par+".learn").val($(t.par+".learn_hid").val());
                $(t.par+".learn").focus();
                $(t.par+".up_down").eq(1).attr("edit",1);
            })
        },
        save: function () {
            var t=this;
            var learn = '';
            $(t.par+".learn_save").on("click", function () {
                var _fId=$(this).parents("#en_resume").attr("data-fId");
                learn = $(t.par+".learn").val();
                if (!$.trim(learn)) {
//                  return;
					learn = '';
                }
                if ($(this).attr("on") == "true") {
                    $(this).attr("on", "false");
                    $(t.par+".learn_edit").mask("");
                    $.ajax({
                        url: path.savaLearn,
                        type: "POST",
                        dataType: "json",
                        data:{customerId:$("#sesCustomerId").val(),dataFlag:2,"purposeRequestEn": learn,'resumeType':languageFlag,fellowshipId:_fId},
                        success: function (rep) {
                            $(t.par+".learn_save").attr("on", "true");
                            if (rep.rows.responseStatus) {
                                $.topTip({mark: "success", showTime:"2",content: "简介保存成功！"});
                                $(t.par+".learn_edit").unmask("");
                                $(t.par+".learn_edit_btn").show();
                                $(t.par+".learn_edit").hide();
                                $(t.par+".learn_show").show();
                                $(t.par+".up_down").eq(1).attr("edit",0);
                                $(t.par+".learn_hid").val(learn);
                                $(t.par+".learn_count").text(learn);
                                if(learn){
                                    $(t.par+".learn_count").expandShrink({len: 728,en:1});
                                }
                            } else {
                            	$.topTip({mark: "warn", showTime:"2",content: "简介保存失败！"});
                                $(t.par+".learn_edit").unmask("");

                                $(t.par+".learn_edit_btn").show();
                                $(t.par+".learn_edit").hide();
                                $(t.par+".learn_show").show();
                                $(t.par+".up_down").eq(1).attr("edit",0);
                                if(learn){
                                    $(t.par+".learn_count").expandShrink({len: 728,en:1});
                                }
                            }
                        }
                    });
                }
            });
        },
        cancel: function () {
            var t=this;
            $(t.par+".learn_cancel").on("click", function () {
                $(t.par+".learn_edit_btn").show();
                $(t.par+".learn_edit").hide();
                $(t.par+".learn_show").show();
                $(t.par+".up_down").eq(1).attr("edit",0);
                //事件埋点
                comm.creatEvent({
                    triggerType:"全站功能按钮点击",
                    keyword:"学习目的修改取消",
                    actionId:45
                });
            });
        }
    };
    
    //简介编辑
    var summary = {};
    summary = {
        init: function (obj) {
            var t=this;
            this.par=obj.type=="ch"?"#ch_resume ":"#en_resume ";
            $(t.par+".summary_save").attr("on", "true");
            $(t.par+".summary_hid").val(baseInfo.summaryEn);
            $(t.par+".summary_count").text($(t.par+".summary_hid").val());
            if($(t.par+".summary_count").text()){
                $(t.par+".summary_count").expandShrink({len: 580,en:1});
            }
            comm.textChange({"$tex":$(t.par+".summary"),"noTop":1});
            this.edit();
            this.save();
            this.cancel();
        },
        edit: function () {
            var t=this;
            $(t.par + ".summary").textareaAutoHeight({minHeight: 48, maxHeight: 460});
            $(t.par+".summary_edit_btn").on("click", function () {
                $(this).hide();
                $(t.par+".summary_edit").show();
                $(t.par+".summary_show").hide();
                $(t.par+".summary").val($(t.par+".summary_hid").val());
                $(t.par+".summary").focus();
                $(t.par+".up_down").eq(1).attr("edit",1);
            })
        },
        save: function () {
            var t=this;
            $(t.par+".summary_save").on("click", function () {
                summary = $(t.par+".summary").val();
                if (!$.trim(summary)) {
                    return;
                }
                if ($(this).attr("on") == "true") {
                    $(this).attr("on", "false");
                    $(t.par+".summary_edit").mask("");
                    $.ajax({
                        url: path.summary,
                        type: "POST",
                        dataType: "json",
                        data: {"summaryEn": summary,'resumeType':languageFlag},
                        success: function (rep) {
                            $(t.par+".summary_save").attr("on", "true");
                            if (rep.rows.responseStatus) {
                                $.topTip({mark: "success", showTime:"2",content: "简介保存成功！"});
                                $(t.par+".summary_edit").unmask("");

                                $(t.par+".summary_edit_btn").show();
                                $(t.par+".summary_edit").hide();
                                $(t.par+".summary_show").show();
                                $(t.par+".up_down").eq(1).attr("edit",0);
                                $(t.par+".summary_hid").val(summary);
                                $(t.par+".summary_count").text(summary);
                                if(summary){
                                    $(t.par+".summary_count").expandShrink({len: 728,en:1});
                                }
                            }
                        }
                    });
                }
            });
        },
        cancel: function () {
            var t=this;
            $(t.par+".summary_cancel").on("click", function () {
                $(t.par+".summary_edit_btn").show();
                $(t.par+".summary_edit").hide();
                $(t.par+".summary_show").show();
                $(t.par+".up_down").eq(1).attr("edit",0);
                //事件埋点
                comm.creatEvent({
                    triggerType:"全站功能按钮点击",
                    keyword:"个人简介修改取消",
                    actionId:45
                });
            });
        }
    };

    //工作经历
    var occ={};
    occ={
        path:{
            list:PC_CALL+"customer/occupation/json_list/",
            info:PC_CALL+"customer/occupation/info/",
            create:PC_CALL+"customer/occupation/create/",
            update:PC_CALL+"customer/occupation/update/",
            delete:PC_CALL+"customer/occupation/delete/",
            unit:PC_CALL+"commdata/getHospitalList/",
            department:PC_CALL+"commdata/getDepartmentList/"
        },
        templete:{
            returnList : function(options){
                var html="";
                html+='<div class="occ_list p_c_title_bj_zl baseinfo_after_mr">'+
                '<div class="occ_show"><div class="p_c_title_bj_zl_l font_yahei layerNoMargin layerEngL">'+
                '<div class="bj_bao_bg layerEngM"></div>'+
                '</div>'+
                '<div class="p_c_title_bj_zl_r font_yahei">'+
                '<div class="p_baseinfo_hospital unit_show">'+options.unit+'</div>'+
                '<div class="p_baseinfo_hospital_zl"><span class="address_show">'+options.address+'</span><span class="address_line" style="'+(options.address?"":"display:none")+'">｜</span><span class="time00">'+options.time+'</span></div>'+
                '</div>'+
                '<div class="baseinfo_del"><a href="javascript:;" class="occ_delBtn" val="'+options.id+'">Delete</a></div>'+
                '<div class="baseinfo_bj"><a href="javascript:;" class="occ_editBtn" val="'+options.id+'">Edit</a></div>'+
                '<div class="clear"></div>'+
                '</div></div>';
                return html;
            }
        },
        init:function(obj){
            var t=this;
            this.par=obj.type=="ch"?"#ch_resume ":"#en_resume ";
            ymd({
                year:$(t.par+".occ_start_year"),
                month:$(t.par+".occ_start_month"),
                en:1
            });
            ymd({
                year:$(t.par+".occ_end_year"),
                month:$(t.par+".occ_end_month"),
                en:1
            });
            this.customerId=$("#sesCustomerId").val();
            this.getOccList();
            this.mouse();
            this.upNowClick();
            this.bindEdit();
            this.cancel();
            this.create();
            this.save();
            this.del();
            /*//职称的选择
            $(t.par+".occmed_par").medicalTitle({
                container:$(t.par+".occmed_title")//存放已选择的职称
            });
            //单位搜索
            $(t.par+".unit").lenovo({
                url: t.path.unit,
                showName:"hospitalName", //显示出的值
                id:"hospitalAddress",   //自定义属性值
                hiddenId:"address",    //自定义属性
                success:function(){
                    $(t.par+".address").val($(t.par+".unit").attr("address"));
                }
            });
            //科室搜索
            $(t.par+".department").lenovo({
                url: t.path.department,
                showName:"departmentName"
            });*/
        },
        //获取列表
        getOccList:function(){
            var t=this;
            $.ajax({
                type : "post",
                url : t.path.list,
                data:{dataFlag:2,languageFlag:languageFlag},
                dataType : "json",
                success : function(data){
                    var html="";
                    if(data.responseObject.responseData.data_list&&data.responseObject.responseData.data_list.length>0) {
                        var list = data.responseObject.responseData.data_list;
                        $.each(list,function(i,val){
                            var startTime=getEnTime({'date':val.startTime});
                            var endTime=getEnTime({'date':val.endTime});
                            if(val.upNow){
                                time=startTime.year+'.'+startTime.month+" ～ Till Now";
                            }else{
                                time=startTime.year+'.'+startTime.month+" ～ "+endTime.year+'.'+endTime.month;
                            };

                            html+= t.templete.returnList({
                                unit:val.unit,
                                address:val.address,
                                //medicalTitle:comm.cutLine(val.medicalTitle,"_","，"),
                                //occupation:val.occupation,
                                time:time,
                                id:val.id
                            });
                        })
                    };
                    $(t.par+".occ_list_par").html(html);
                },
                error:function(){}
            });
        },
        //列表移入移出
        mouse:function(){
            var t=this;
            $(t.par+".occ_list").live("mouseover",function(){
                $(this).addClass("baseinfo_after_hover");
            });
            $(t.par+".occ_list").live("mouseout",function(){
                $(this).removeClass("baseinfo_after_hover");
            });
        },
        //至今点击
        upNowClick:function(){
            var t=this;
            $(t.par+".occ_upNow").on("click",function(){
                if($(this).attr("value")==0){
                    $(t.par+".occ_time").hide();
                    $(this).attr("value",1);
                    $("span",this).addClass("checkboxImgActive");
                }else{
                    $(t.par+".occ_time").show();
                    $(this).attr("value",0);
                    $("span",this).removeClass("checkboxImgActive");
                }

            });
        },
        cancel:function(){
            var t=this;
            $(t.par+".occ_cancel").on("click",function(){
                t.clear();
                //事件埋点
                comm.creatEvent({
                    triggerType:"全站功能按钮点击",
                    keyword:"工作经历修改取消",
                    actionId:45
                });
                return false;
            })
        },
        clear:function(){
            var t=this;
            this.par="#en_resume ";
            this.mouse();
            $(t.par+".occ_add").show();
            $(t.par+".occ_edit").hide();
            $(t.par+".occ_add").after($(t.par+".occ_edit"));
            $(t.par+".occ_show").show();
            $(t.par+".occupationId").val("");
            $(t.par+".occ_edit input").val("");
            $(t.par+".occ_edit input").parent().removeClass("baseinfo_error_red");
            $(t.par+".occmed_par").removeClass("baseinfo_error_red");
            $(".error_red_icon",t.par+".occ_edit").hide();
            $(t.par+".occmed_title").attr("medicaltitle","").text("");
            $(t.par+".occmed_par .medical_list_li").attr("select-status","false");
            $(t.par+".occmed_par .medical_list_li").removeClass("active");
            $(t.par+".occ_time").show();
            $(t.par+".occ_upNow").attr("value",0);
            $(t.par+".occ_upNow span").removeClass("checkboxImgActive");
            $(t.par+".occ_edit select").each(function(i,em){
                $("option",em).eq(0).attr("selected",true);
            })
        },
        //编辑
        bindEdit:function(){
            var t=this;
            $(t.par+".occ_editBtn").die("click").live("click",function(){
                var parent=$(this).parents(".occ_list");
                $(t.par+".occ_add").hide();
                $(t.par+".occ_edit").show().appendTo(parent);
                $(".occ_show",parent).hide();
                $(t.par+".occ_list").die("mouseover");
                var paramJson=$.toJSON({id:$(this).attr("val")});
                $.ajax({
                    type : "post",
                    url : t.path.info,
                    data : {paramJson:paramJson},
                    dataType : "json",
                    success : function(rep){
                        if(rep&&rep.responseObject.responseData.bo_data){
                            var data=rep.responseObject.responseData.bo_data;
                            $(t.par+".occupationId").val(data.id);//给修改添加id
                            $(t.par+".unit").val(data.unit);
                            $(t.par+".address").val(data.address);

                            /*var medical=data.medicalTitle;
                            var medical1=medical.split(",");
                            var medicalTitle="";
                            var ids=[];
                            $.each(medical1,function(i,val){
                                if(val){
                                    if(val.split("_")[1]){
                                        ids.push(val.split("_")[0]);
                                        medicalTitle+=(val.split("_")[1]+"，");
                                    }else{
                                        medicalTitle+=(val+"，");
                                    }
                                }
                            });
                            $(t.par+".occmed_title").attr("medicalTitle",medical);
                            $(t.par+".occmed_title").text(medicalTitle.substring(0,medicalTitle.length-1));
                            //清空职称的选中状态
                            $(t.par+".occmed_par .medical_list_li").attr("select-status","false");
                            $(t.par+".occmed_par .medical_list_li").removeClass("active");
                            //比对是对应职称选中
                            $.each($(t.par+".occmed_par .medical_list_li"),function(i,em){
                                $.each(ids,function(j,val){
                                    if($(em).attr("medicalid")==val){
                                        $(em).attr("select-status","true");
                                        $(em).addClass("active");
                                    }
                                });
                            });*/
                            //$("#occupation").val(data.occupation);
                            //$(t.par+".address").val(data.address);
                            var start_year=data.startTime.split("-")[0];
                            var start_month=data.startTime.split("-")[1];
                            var end_year=data.endTime.split("-")[0];
                            var end_month=data.endTime.split("-")[1];
                            gettime($(t.par+".occ_start_year"),start_year);
                            gettime($(t.par+".occ_start_month"),start_month);
                            gettime($(t.par+".occ_end_year"),end_year);
                            gettime($(t.par+".occ_end_month"),end_month);
                            if(data.upNow){
                                $(t.par+".occ_time").hide();
                                $(t.par+".occ_upNow").attr("value",1);
                                $(t.par+".occ_upNow span").addClass("checkboxImgActive");
                            }
                        }
                    },
                    error:function(){}
                });
            })
        },
        create:function(){
            var t=this;
            $(t.par+".occ_add").on("click",function(){
                $(this).after($(t.par+".occ_edit"));
                $(t.par+".occ_edit").show();
                $(this).hide();
                $(t.par+".occ_list").die("mouseover");
            })
        },
        save:function(){
            var t=this;
            $(t.par+".occ_save").die("click").live("click",function(){
                var data={};
                $obj=$(this).parents(".occ_list");
                var id=$(t.par+".occupationId").val();
                if(!id){//添加
                    data.customerId=t.customerId;
                }else{//修改
                    data.id=id;
                }
                data.unit=$(t.par+".unit").val();
                data.address=$(t.par+".address").val()?$(t.par+".address").val():" ";
                //data.medicalTitle=$(t.par+".occmed_title").attr("medicalTitle");
                //data.occupation=$("#occupation").val();
                //data.address=$(t.par+".address").val();
                var sTime=$(t.par+".occ_start_year option:selected").val()+'.'+$(t.par+".occ_start_month option:selected").text();
                data.startTime=$(t.par+".occ_start_year option:selected").val()+'-'+$(t.par+".occ_start_month option:selected").val();
                var eTime=$(t.par+".occ_end_year option:selected").val()+'.'+$(t.par+".occ_end_month option:selected").text();
                data.endTime=$(t.par+".occ_end_year option:selected").val()+'-'+$(t.par+".occ_end_month option:selected").val();
                data.upNow=0;
                data.languageFlag=languageFlag;
                var time='';
                if($(t.par+".occ_upNow").attr("value")==1){
                    data.upNow=1;
                    time=sTime+' ～ Till Now';
                    eTime='';
                    data.endTime='';
                }else{
                    data.upNow=0;
                    time=sTime+' ～ '+eTime;
                };
                var isSuccess=1;
                //验证
                if(!$.trim(data.unit)){
                    $(t.par+".unit").parent().addClass("baseinfo_error_red");
                    $(t.par+".unit").parent().next().show().text("请填写工作单位!");
                    isSuccess=0;
                }else if(comm.getByteLen(data.unit)>200){
                    $(t.par+".unit").parent().addClass("baseinfo_error_red");
                    $(t.par+".unit").parent().next().show().text("最长100个中文或200个英文!");
                    isSuccess=0;
                }else{
                    $(t.par+".unit").parent().removeClass("baseinfo_error_red");
                    $(t.par+".unit").parent().next().hide();
                };
                if(comm.getByteLen(data.address)>100){
                    $(t.par+".address").parent().addClass("baseinfo_error_red");
                    $(t.par+".address").parent().next().show();
                    isSuccess=0;
                }else{
                    $(t.par+".address").parent().removeClass("baseinfo_error_red");
                    $(t.par+".address").parent().next().hide();
                };
                /*if(!data.medicalTitle){
                    $(t.par+".occmed_par").addClass("baseinfo_error_red");
                    $(t.par+".occmed_par").next().show();
                    isSuccess=0;
                }else{
                    $(t.par+".occmed_par").removeClass("baseinfo_error_red");
                    $(t.par+".occmed_par").next().hide();
                };*/
                /*if(comm.getByteLen(data.occupation)>100){
                 $("#occupation").parent().addClass("baseinfo_error_red");
                 $("#occupation").parent().next().show();
                 isSuccess=0;
                 }else{
                 $("#occupation").parent().removeClass("baseinfo_error_red");
                 $("#occupation").parent().next().hide();
                 };*/
                /*if(comm.getByteLen(data.address)>100){
                    $(t.par+".address").parent().addClass("baseinfo_error_red");
                    $(t.par+".address").parent().next().show();
                    isSuccess=0;
                }else{
                    $(t.par+".address").parent().removeClass("baseinfo_error_red");
                    $(t.par+".address").parent().next().hide();
                }*/
                if(!checkEndTime(data.startTime,data.endTime)){
                    $(t.par+".occ_time_error").show();
                    isSuccess=0;
                }else{
                    $(t.par+".occ_time_error").hide();
                };
                if(isSuccess==0){
                    return;
                };
                $(t.par+".occ_edit").mask("");
                var paramJson=$.toJSON(data);
                $.ajax({
                    type : "post",
                    url : id? t.path.update: t.path.create,
                    data : {paramJson:paramJson},
                    dataType : "json",
                    success : function(rep){
                        $(t.par+".occ_edit").unmask("");
                        if(rep.responseObject.responseStatus){
                            /*if(id){
                                $obj.find(".unit_show").text(data.unit);
                                $obj.find(".address_show").text(data.address);
                                if(!data.address){
                                    $obj.find(".address_line").hide();
                                }else{
                                    $obj.find(".address_line").show();
                                }
                                //$obj.find(".medicalTitle_show").text($(t.par+".occmed_title").text());
                                /!*if(data.occupation){
                                 $obj.find(".occupation").show().text(data.occupation);
                                 $obj.find(".occupation").next().show();
                                 }else{
                                 $obj.find(".occupation").hide().text(data.occupation);
                                 $obj.find(".occupation").next().hide();
                                 }*!/
                                $obj.find(".time00").text(time);
                            }else{
                                /!*var html="";
                                html+= t.templete.returnList({
                                    unit:data.unit,
                                    address:data.address,
                                    //medicalTitle:$(t.par+".occmed_title").text(),
                                    //occupation:data.occupation,
                                    time:time,
                                    id:rep.responseObject.responsePk
                                });
                                $(t.par+".occ_list_par").append(html);*!/

                            }*/
                            t.clear();
                            t.getOccList();
                            $.topTip({mark:"success",showTime:"2",content:"工作经历保存成功！"});
                        }else{
                            $.topTip({mark:"warn",showTime:"2",content:"工作经历保存失败！"});
                        }
                    },
                    error:function(){}
                });
            });
        },
        del:function(){
            var t=this;
            $(t.par+".occ_delBtn").die("click").live("click",function(){
                if(confirm("确认删除?")) {
                    $(t.par+".occ_add").after($(t.par+".occ_edit"));
                    $obj = $(this).parents(".occ_list")
                    var paramJson = $.toJSON({id: $(this).attr("val")});
                    $.ajax({
                        type: "post",
                        url: t.path.delete,
                        data: {paramJson: paramJson},
                        dataType: "json",
                        success: function (rep) {
                            if (rep.responseObject.responseStatus) {
                                $obj.animate({height: 0}, 200, function () {
                                    $obj.remove();
                                });
                                $.topTip({mark: "success",showTime:"2", content: "工作经历删除成功！"});
                            } else {
                                $.topTip({mark: "warn", showTime:"2",content: "工作经历删除失败！"});
                            }
                        },
                        error: function () {
                        }
                    });
                }
            });
        }
    };

    //教育背景
    var edu={};
    edu={
        path:{
            list:PC_CALL+"customer/education/json_list/",
            info:PC_CALL+"customer/education/info/",
            create:PC_CALL+"customer/education/create/",
            update:PC_CALL+"customer/education/update/",
            delete:PC_CALL+"customer/education/delete/",
            education:PC_CALL+"commdata/getEducationList/",
            university:PC_CALL+"commdata/getSchoolList/",
            major:PC_CALL+"commdata/getMajorList/",
            city:PC_CALL+"commdata/getRegionList/"
        },
        templete:{
            returnList : function(options){
                var html="";
                html+='<div class="edu_list p_c_title_bj_zl baseinfo_after_mr">'+
                '<div class="edu_show"><div class="p_c_title_bj_zl_l font_yahei layerNoMargin layerEngL">'+
                '<div class="bj_mao_bg layerEngM"></div>'+
                '</div>'+
                '<div class="p_c_title_bj_zl_r font_yahei">'+
                '<div class="p_baseinfo_hospital university_show">'+options.university+'</div>'+
                '<div class="p_baseinfo_hospital_zl"><span class="major_show">'+options.major+'</span><span>｜</span><span class="edu_education_show">'+options.education+'</span><span>｜</span><span class="city_show"'+(!options.city?"style='display:none'":'')+'>'+options.city+'</span><span '+(!options.city?"style='display:none'":'')+'>｜</span><span class="time01">'+options.time+'</span></div>'+
                '</div>'+
                '<div class="baseinfo_del"><a href="javascript:;" class="edu_delBtn" val="'+options.id+'">Delete</a></div>'+
                '<div class="baseinfo_bj"><a href="javascript:;" class="edu_editBtn" val="'+options.id+'">Edit</a></div>'+
                '<div class="clear"></div>'+
                '</div></div>';
                return html;
            }
        },
        init:function(obj){
            var t=this;
            this.par=obj.type=="ch"?"#ch_resume ":"#en_resume ";
            ymd({
                year:$(t.par+".edu_start_year"),
                month:$(t.par+".edu_start_month"),
                en:1
            });
            ymd({
                year:$(t.par+".edu_end_year"),
                month:$(t.par+".edu_end_month"),
                en:1
            });
            $.ajax({
                type : "post",
                url : t.path.education,
                dataType : "json",
                async:false,
                success : function(data){
                    var html="";
                    $.each(data,function(i,val){
                        html+='<option value="'+val.id+'">'+val.educationNameEn+'</option>';
                    });
                    $(t.par+".edu_education").html(html);
                },
                error:function(){}
            });
            this.customerId=$("#sesCustomerId").val();
            this.getEduList();
            this.mouse();
            this.upNowClick();
            this.bindEdit();
            this.cancel();
            this.create();
            this.save();
            this.del();
            //学校名称的选择
            /*$(t.par+".university").lenovonew({
                url: t.path.university,
                showName:"schoolName",
                hiddenId:"universityId"
            });
            //专业搜索
            $(t.par+".major").lenovo({
                url: t.path.major,
                showName:"majorTitle",
                hiddenId:"majorId"
            });
            //学校所在城市
            $(t.par+".edu_city").lenovo({
                url: t.path.city,
                showName:"regionName",
                hiddenId:"edu_cityId",
                success:function(){
                    $(t.par+".edu_city").val($(t.par+".edu_city").val().split(" ")[0]);
                }
            });*/
        },
        //获取列表
        getEduList:function(){
            var t=this;
            $.ajax({
                type : "post",
                url : t.path.list,
                data:{dataFlag:2,languageFlag:languageFlag},
                dataType : "json",
                success : function(data){
                    var html="";
                    if(data.responseObject.responseData.data_list&&data.responseObject.responseData.data_list.length>0) {
                        var list = data.responseObject.responseData.data_list;
                        $.each(list,function(i,val){
                            var startTime=getEnTime({'date':val.startTime});
                            var endTime=getEnTime({'date':val.endTime});
                            if(val.upNow){
                                time=startTime.year+'.'+startTime.month+" ～ Till Now";
                            }else{
                                time=startTime.year+'.'+startTime.month+" ～ "+endTime.year+'.'+endTime.month;
                            };
                            html+= t.templete.returnList({
                                university:val.university,
                                major:val.major,
                                education:val.education,
                                city:val.city,
                                time:time,
                                id:val.id
                            });
                        })
                    };
                    $(t.par+".edu_list_par").html(html);
                },
                error:function(){}
            });
        },
        //列表移入移出
        mouse:function(){
            var t=this;
            $(t.par+".edu_list").live("mouseover",function(){
                $(this).addClass("baseinfo_after_hover");
            });
            $(t.par+".edu_list").live("mouseout",function(){
                $(this).removeClass("baseinfo_after_hover");
            });
        },
        //至今点击
        upNowClick:function(){
            var t=this;
            $(t.par+".edu_upNow").on("click",function(){
                if($(this).attr("value")==0){
                    $(t.par+".edu_time").hide();
                    $(this).attr("value",1);
                    $("span",this).addClass("checkboxImgActive");
                }else{
                    $(t.par+".edu_time").show();
                    $(this).attr("value",0);
                    $("span",this).removeClass("checkboxImgActive");
                }

            });
        },
        cancel:function(){
            var t=this;
            $(t.par+".edu_cancel").on("click",function(){
                t.clear();
                //事件埋点
                comm.creatEvent({
                    triggerType:"全站功能按钮点击",
                    keyword:"教育背景修改取消",
                    actionId:45
                });
                return false;
            })
        },
        clear:function(){
            var t=this;
            this.par="#en_resume ";
            this.mouse();
            $(t.par+".edu_add").show();
            $(t.par+".edu_edit").hide();
            $(t.par+".edu_add").after($(t.par+".edu_edit"));
            $(t.par+".edu_show").show();
            $(t.par+".educationId").val("");
            $(t.par+".edu_edit input").val("");
            $(t.par+".edu_edit input").parent().removeClass("baseinfo_error_red");
            $(".error_red_icon",t.par+".edu_edit").hide();
            $(t.par+".edu_time").show();
            $(t.par+".edu_upNow").attr("value",0);
            $(t.par+".edu_upNow span").removeClass("checkboxImgActive");
            $(t.par+".edu_edit select").each(function(i,em){
                $("option",em).eq(0).attr("selected",true);
            })
        },
        //编辑
        bindEdit:function(){
            var t=this;
            $(t.par+".edu_editBtn").die("click").live("click",function(){
                var parent=$(this).parents(".edu_list");
                $(t.par+".edu_add").hide();
                $(t.par+".edu_edit").show().appendTo(parent);
                $(".edu_show",parent).hide();
                $(t.par+".edu_list").die("mouseover");
                var paramJson=$.toJSON({id:$(this).attr("val")});
                $.ajax({
                    type : "post",
                    url : t.path.info,
                    data : {paramJson:paramJson},
                    dataType : "json",
                    success : function(rep){
                        if(rep&&rep.responseObject.responseData.bo_data){
                            var data=rep.responseObject.responseData.bo_data;
                            $(t.par+".educationId").val(data.id);//给修改添加id
                            $(t.par+".university").val(data.university);
                            $(t.par+".major").val(data.major);
                            $(t.par+".edu_city").val(data.city);

                            var start_year=data.startTime.split("-")[0];
                            var start_month=data.startTime.split("-")[1];
                            var end_year=data.endTime.split("-")[0];
                            var end_month=data.endTime.split("-")[1];
                            gettime($(t.par+".edu_start_year"),start_year);
                            gettime($(t.par+".edu_start_month"),start_month);
                            gettime($(t.par+".edu_end_year"),end_year);
                            gettime($(t.par+".edu_end_month"),end_month);
                            if(data.upNow){
                                $(t.par+".edu_time").hide();
                                $(t.par+".edu_upNow").attr("value",1);
                                $(t.par+".edu_upNow span").addClass("checkboxImgActive");
                            };

                            $.each($(t.par+".edu_education option"),function(i,em){
                                if($(em).val()==data.educationId){
                                    $(em).attr("selected",true);
                                }
                            });

                        }
                    },
                    error:function(){}
                });
            })
        },
        create:function(){
            var t=this;
            $(t.par+".edu_add").on("click",function(){
                $(this).after($(t.par+".edu_edit"));
                $(t.par+".edu_edit").show();
                $(this).hide();
                $(t.par+".edu_list").die("mouseover");
            })
        },
        save:function(){
            var t=this;
            $(t.par+".edu_save").die("click").live("click",function(){
                var data={};
                $obj=$(this).parents(".edu_list");
                var id=$(t.par+".educationId").val();
                if(!id){//添加
                    data.customerId=t.customerId;
                }else{//修改
                    data.id=id;
                }

                data.city=$(t.par+".edu_city").val()?$(t.par+".edu_city").val():" ";
                data.cityId=$(t.par+".edu_city").attr("edu_cityId")||0;
                data.universityId=$(t.par+".university").attr("universityId")||0;
                data.university=$(t.par+".university").val();
                data.major=$(t.par+".major").val();
                data.majorId=$(t.par+".major").attr("majorId")||0;
                data.education=$(t.par+".edu_education option:selected").text();
                data.educationId=$(t.par+".edu_education option:selected").val();
                var sTime=$(t.par+".edu_start_year option:selected").val()+'.'+$(t.par+".edu_start_month option:selected").text();
                data.startTime=$(t.par+".edu_start_year option:selected").val()+'-'+$(t.par+".edu_start_month option:selected").val();
                var eTime=$(t.par+".edu_end_year option:selected").val()+'.'+$(t.par+".edu_end_month option:selected").text();
                data.endTime=$(t.par+".edu_end_year option:selected").val()+'-'+$(t.par+".edu_end_month option:selected").val();
                data.upNow=0;
                data.languageFlag=languageFlag;
                var time='';
                if($(t.par+".edu_upNow").attr("value")==1){
                    data.upNow=1;
                    time=sTime+' ～ Till Now';
                    eTime='';
                    data.endTime='';
                }else{
                    data.upNow=0;
                    time=sTime+' ～ '+eTime;
                };
                var isSuccess=1;
                //验证
                if(comm.getByteLen(data.city)>100){
                    $(t.par+".edu_city").parent().addClass("baseinfo_error_red");
                    $(t.par+".edu_city").parent().next().show().text("最长50个中文或100个英文!");
                    isSuccess=0;
                }else{
                    $(t.par+".edu_city").parent().removeClass("baseinfo_error_red");
                    $(t.par+".edu_city").parent().next().hide();
                }
                if(!$.trim(data.university)){
                    $(t.par+".university").parent().addClass("baseinfo_error_red");
                    $(t.par+".university").parent().next().show().text("请填写学校名称!");
                    isSuccess=0;
                }else if(comm.getByteLen(data.university)>100){
                    $(t.par+".university").parent().addClass("baseinfo_error_red");
                    $(t.par+".university").parent().next().show().text("最长50个中文或100个英文!");
                    isSuccess=0;
                }else{
                    $(t.par+".university").parent().removeClass("baseinfo_error_red");
                    $(t.par+".university").parent().next().hide();
                };
                if(!$.trim(data.major)){
                    $(t.par+".major").parent().addClass("baseinfo_error_red");
                    $(t.par+".major").parent().next().show().text("请选择专业!");
                    isSuccess=0;
                }else if(comm.getByteLen(data.major)>50){
                    $(t.par+".major").parent().addClass("baseinfo_error_red");
                    $(t.par+".major").parent().next().show().text("最长25个中文或50个英文!");
                    isSuccess=0;
                }else{
                    $(t.par+".major").parent().removeClass("baseinfo_error_red");
                    $(t.par+".major").parent().next().hide();
                };
                if(!data.education){
                    $(t.par+".edu_error").show();
                    isSuccess=0;
                }else{
                    $(t.par+".edu_error").hide();
                };
                if(!checkEndTime(data.startTime,data.endTime)){
                    $(t.par+".edu_time_error").show();
                    isSuccess=0;
                }else{
                    $(t.par+".edu_time_error").hide();
                };
                if(isSuccess==0){
                    return;
                };
                $(t.par+".edu_edit").mask("");
                var paramJson=$.toJSON(data);
                $.ajax({
                    type : "post",
                    url : id? t.path.update: t.path.create,
                    data : {paramJson:paramJson},
                    dataType : "json",
                    success : function(rep){
                        $(t.par+".edu_edit").unmask("");
                        if(rep.responseObject.responseStatus){
                            /*if(id){
                                $obj.find(".university_show").text(data.university);
                                $obj.find(".major_show").text(data.major);
                                $obj.find(".edu_education_show").text(data.education);
                                if(data.city){
                                    $obj.find(".city_show").show().text(data.city);
                                    $obj.find(".city_show").next().show();
                                }else{
                                    $obj.find(".city_show").hide().text(data.city);
                                    $obj.find(".city_show").next().hide();
                                }
                                $obj.find(".time01").text(time);
                            }else{
                                var html="";
                                html+= t.templete.returnList({
                                    university:data.university,
                                    major:data.major,
                                    education:data.education,
                                    city:data.city,
                                    time:time,
                                    id:rep.responseObject.responsePk
                                });
                                $(t.par+".edu_list_par").append(html);

                            }*/
                            t.clear();
                            t.getEduList();
                            $.topTip({mark:"success",showTime:"2",content:"教育背景保存成功！"});
                        }else{
                            $.topTip({mark:"warn",showTime:"2",content:"教育背景保存失败！"});
                        }
                    },
                    error:function(){}
                });
            });
        },
        del:function(){
            var t=this;
            $(t.par+".edu_delBtn").die("click").live("click",function(){
                if(confirm("确认删除?")) {
                    $(t.par+".edu_add").after($(t.par+".edu_edit"));
                    $obj = $(this).parents(".edu_list")
                    var paramJson = $.toJSON({id: $(this).attr("val")});
                    $.ajax({
                        type: "post",
                        url: t.path.delete,
                        data: {paramJson: paramJson},
                        dataType: "json",
                        success: function (rep) {
                            if (rep.responseObject.responseStatus) {
                                $obj.animate({height:0},200,function(){
                                    $obj.remove();
                                });
                                $.topTip({mark: "success", showTime:"2",content: "教育背景删除成功！"});
                            } else {
                                $.topTip({mark: "warn",showTime:"2", content: "教育背景删除失败！"});
                            }
                        },
                        error: function () {
                        }
                    });
                }
            });
        }
    };
    //继续教育
    var cEdu={};
    cEdu={
        path:{
            list:PC_CALL+"customer/continue/education/json_list/",
            info:PC_CALL+"customer/continue/education/info/",
            create:PC_CALL+"customer/continue/education/create/",
            update:PC_CALL+"customer/continue/education/update/",
            delete:PC_CALL+"customer/continue/education/delete/"
        },
        templete:{
            returnList : function(options){
                var html="";
                html+='<div class="cEdu_list p_c_title_bj_zl baseinfo_after_mr">'+
                '<div class="cEdu_show"><div class="p_c_title_bj_zl_l font_yahei layerNoMargin layerEngL">'+
                '<div class="bj_book_bg layerEngM"></div>'+
                '</div>'+
                '<div class="p_c_title_bj_zl_r font_yahei">'+
                '<div class="p_baseinfo_hospital organization_show">'+options.organization+'</div>'+
                '<div class="p_baseinfo_hospital_zl"><span class="certificate_show"'+(!options.certificate?"style='display:none'":'')+'>'+options.certificate+'</span><span '+(!options.certificate?"style='display:none'":'')+'>｜</span><span class="time02">'+options.time+'</span></div>'+
                '<div class="p_baseinfo_px_cont cmeDesc_show" '+(!options.cmeDesc?"style='display:none'":'')+'>'+options.cmeDesc+'</div>'+
                '</div>'+
                '<div class="baseinfo_del"><a href="javascript:;" class="cEdu_delBtn" val="'+options.id+'">Delete</a></div>'+
                '<div class="baseinfo_bj"><a href="javascript:;" class="cEdu_editBtn" val="'+options.id+'">Edit</a></div>'+
                '<div class="clear"></div>'+
                '</div></div>';
                return html;
            }
        },
        init:function(obj){
            var t=this;
            this.par=obj.type=="ch"?"#ch_resume ":"#en_resume ";
            ymd({
                year:$(t.par+".cEdu_start_year"),
                month:$(t.par+".cEdu_start_month"),
                 /*day:$(t.par+".cEdu_start_day"),*/
                en:1
            });
            ymd({
                year:$(t.par+".cEdu_end_year"),
                month:$(t.par+".cEdu_end_month"),
                 /*day:$(t.par+".cEdu_end_day"),*/
                en:1
            });

            this.customerId=$("#sesCustomerId").val();
            this.getcEduList();
            this.mouse();
            //this.upNowClick();
            this.bindEdit();
            this.cancel();
            this.create();
            this.save();
            this.del();

        },
        //获取列表
        getcEduList:function(){
            var t=this;
            $.ajax({
                type : "post",
                url : t.path.list,
                data:{dataFlag:2,languageFlag:languageFlag},
                dataType : "json",
                success : function(data){
                    var html="";
                    if(data.responseObject.responseData.data_list&&data.responseObject.responseData.data_list.length>0) {
                        var list = data.responseObject.responseData.data_list;
                        $.each(list,function(i,val){
                            var startTime=getEnTime({'date':val.startTime});
                            var endTime=getEnTime({'date':val.endTime});
                            if(val.upNow){
                                time=startTime.year+'.'+startTime.month+" ～ Till Now";
                            }else{
                                time=startTime.year+'.'+startTime.month+" ～ "+endTime.year+'.'+endTime.month;
                            };
                            html+= t.templete.returnList({
                                organization:val.organization,
                                certificate:$.trim(val.certificate)?val.certificate:'',
                                time:time,
                                cmeDesc:$.trim(val.cmeDesc)?val.cmeDesc:'',
                                id:val.id
                            });
                        })
                    };
                    $(t.par+".cEdu_list_par").html(html);
                },
                error:function(){}
            });
        },
        //列表移入移出
        mouse:function(){
            var t=this;
            $(t.par+".cEdu_list").live("mouseover",function(){
                $(this).addClass("baseinfo_after_hover");
            });
            $(t.par+".cEdu_list").live("mouseout",function(){
                $(this).removeClass("baseinfo_after_hover");
            });
        },
        //至今点击
        upNowClick:function(){
            var t=this;
            $(t.par+".cEdu_upNow").on("click",function(){
                if($(this).attr("value")==0){
                    $(t.par+".cEdu_time").hide();
                    $(this).attr("value",1);
                    $("span",this).addClass("checkboxImgActive");
                }else {
                    $(t.par + ".cEdu_time").show();
                    $(this).attr("value", 0);
                    $("span", this).removeClass("checkboxImgActive");
                }
            });
        },
        cancel:function(){
            var t=this;
            $(t.par+".cEdu_cancel").on("click",function(){
                t.clear();
                //事件埋点
                comm.creatEvent({
                    triggerType:"全站功能按钮点击",
                    keyword:"继续教育修改取消",
                    actionId:45
                });
                return false;
            })
        },
        clear:function(){
            var t=this;
            this.par="#en_resume ";
            this.mouse();
            $(t.par+".cEdu_add").show();
            $(t.par+".cEdu_edit").hide();
            $(t.par+".cEdu_show").show();
            $(t.par+".cEducationId").val("");
            $(t.par+".cEdu_edit input").val("");
            $(t.par+".cmeDesc").val("");
            $(t.par+".cEdu_edit input").parent().removeClass("baseinfo_error_red");
            $(t.par+".cmeDesc").parent().removeClass("baseinfo_error_red");
            $(".error_red_icon",t.par+".cEdu_edit").hide();
            $(t.par+".cEdu_edit select").each(function(i,em){
                $("option",em).eq(0).attr("selected",true);
            })
            /*$(t.par+".cEdu_time").show();
            $(t.par+".cEdu_upNow").attr("value",0);
            $(t.par+".cEdu_upNow span").removeClass("checkboxImgActive");*/
        },
        //编辑
        bindEdit:function(){
            var t=this;
            $(t.par+".cEdu_editBtn").die("click").live("click",function(){
                var parent=$(this).parents(".cEdu_list");
                $(t.par+".cEdu_add").hide();
                $(t.par+".cEdu_edit").show().appendTo(parent);
                $(".cEdu_show",parent).hide();
                $(t.par+".cEdu_list").die("mouseover");
                var paramJson=$.toJSON({id:$(this).attr("val")});
                $.ajax({
                    type : "post",
                    url : t.path.info,
                    data : {paramJson:paramJson},
                    dataType : "json",
                    success : function(rep){
                        if(rep&&rep.responseObject.responseData.bo_data){
                            var data=rep.responseObject.responseData.bo_data;
                            $(t.par+".cEducationId").val(data.id);//给修改添加id
                            $(t.par+".organization").val(data.organization);
                            $(t.par+".cmeDesc").val(data.cmeDesc);
                            $(t.par+".certificate").val(data.certificate);

                            var start_year=data.startTime.split("-")[0];
                            var start_month=data.startTime.split("-")[1];
                            //var start_day=data.startTime.split("-")[2];
                            var end_year=data.endTime.split("-")[0];
                            var end_month=data.endTime.split("-")[1];
                            //var end_day=data.endTime.split("-")[2];
                            gettime($(t.par+".cEdu_start_year"),start_year);
                            gettime($(t.par+".cEdu_start_month"),start_month);
                           // gettime($(t.par+".cEdu_start_day"),start_day);
                            gettime($(t.par+".cEdu_end_year"),end_year);
                            gettime($(t.par+".cEdu_end_month"),end_month);
                           // gettime($(t.par+".cEdu_start_day"),end_day);
                            /*if(data.upNow){
                             $(".cEdu_time").hide();
                             $("#cEdu_upNow").attr("value",1);
                             $("#cEdu_upNow").addClass("p_c_baseinfo_check_hover");
                             };*/
                        }
                    },
                    error:function(){}
                });
            })
        },
        create:function(){
            var t=this;
            $(t.par+".cEdu_add").on("click",function(){
                $(this).after($(t.par+".cEdu_edit"));
                $(t.par+".cEdu_edit").show();
                $(this).hide();
                $(t.par+".cEdu_list").die("mouseover");
            })
        },
        save:function(){
            var t=this;
            $(t.par+".cEdu_save").die("click").live("click",function(){
                var data={};
                $obj=$(this).parents(".cEdu_list");
                var id=$(t.par+".cEducationId").val();
                if(!id){//添加
                    data.customerId=t.customerId;
                }else{//修改
                    data.id=id;
                }
                data.organization=$(t.par+".organization").val();
                data.cmeDesc=$(t.par+".cmeDesc").val()?$(t.par+".cmeDesc").val():" ";
                data.certificate=$(t.par+".certificate").val()?$(t.par+".certificate").val():" ";
                var sTime=$(t.par+".cEdu_start_year option:selected").val()+'.'+$(t.par+".cEdu_start_month option:selected").text();
                data.startTime=$(t.par+".cEdu_start_year option:selected").val()+'-'+$(t.par+".cEdu_start_month option:selected").val();
                var eTime=$(t.par+".cEdu_end_year option:selected").val()+'.'+$(t.par+".cEdu_end_month option:selected").text();
                data.endTime=$(t.par+".cEdu_end_year option:selected").val()+'-'+$(t.par+".cEdu_end_month option:selected").val();
                data.languageFlag=languageFlag;
                time=sTime+' ～ '+eTime;
                /*if($("#edu_upNow").attr("value")==1){
                 data.upNow=1;
                 time=sTime+' ～ 至今';
                 eTime='';
                 data.endTime='';
                 }else{
                 data.upNow=0;
                 time=sTime+' ～ '+eTime;
                 };*/
                var isSuccess=1;
                //验证
                if(!$.trim(data.organization)){
                    $(t.par+".organization").parent().addClass("baseinfo_error_red");
                    $(t.par+".organization").parent().next().show().text("请填写培训机构名称!");
                    isSuccess=0;
                }else if(comm.getByteLen(data.organization)>100){
                    $(t.par+".organization").parent().addClass("baseinfo_error_red");
                    $(t.par+".organization").parent().next().show().text("最长50个中文或100个英文!");
                    isSuccess=0;
                }else{
                    $(t.par+".organization").parent().removeClass("baseinfo_error_red");
                    $(t.par+".organization").parent().next().hide();
                };
                if(comm.getByteLen(data.cmeDesc)>1000){
                    $(t.par+".cmeDesc").parent().addClass("baseinfo_error_red");
                    $(t.par+".cmeDesc").parent().next().show().text("最长500个中文或1000个英文!");
                    isSuccess=0;
                }else{
                    $(t.par+".cmeDesc").parent().removeClass("baseinfo_error_red");
                    $(t.par+".cmeDesc").parent().next().hide();
                };
                if(comm.getByteLen(data.certificate)>100){
                    $(t.par+".certificate").parent().addClass("baseinfo_error_red");
                    $(t.par+".certificate").parent().next().show().text("最长50个中文或100个英文!");
                    isSuccess=0;
                }else{
                    $(t.par+".certificate").parent().removeClass("baseinfo_error_red");
                    $(t.par+".certificate").parent().next().hide();
                };
                if(!checkEndTime(data.startTime,data.endTime)){
                    $(t.par+".cEdu_error_time").show();
                    isSuccess=0;
                }else{
                    $(t.par+".cEdu_error_time").hide();
                };
                if(isSuccess==0){
                    return;
                };
                $(t.par+".cEdu_edit").mask("");
                var paramJson=$.toJSON(data);
                $.ajax({
                    type : "post",
                    url : id? t.path.update: t.path.create,
                    data : {paramJson:paramJson},
                    dataType : "json",
                    success : function(rep){
                        $(t.par+".cEdu_edit").unmask("");
                        if(rep.responseObject.responseStatus){
                            if(id){
                                $obj.find(".organization_show").text(data.organization);
                                if($.trim(data.certificate)){
                                    $obj.find(".certificate_show").show().text(data.certificate);
                                    $obj.find(".certificate_show").next().show();
                                }else{
                                    $obj.find(".certificate_show").hide().text(data.certificate);
                                    $obj.find(".certificate_show").next().hide();
                                }
                                if($.trim(data.cmeDesc)){
                                    $obj.find(".cmeDesc_show").show().text(data.cmeDesc);
                                }else{
                                    $obj.find(".cmeDesc_show").hide().text(data.cmeDesc);
                                }
                                $obj.find(".time02").text(time);
                            }else{
                                var html="";
                                html+= t.templete.returnList({
                                    organization:data.organization,
                                    certificate:$.trim(data.certificate)?data.certificate:'',
                                    time:time,
                                    cmeDesc:$.trim(data.cmeDesc)?data.cmeDesc:'',
                                    id:rep.responseObject.responsePk
                                });
                                $(t.par+".cEdu_list_par").append(html);
                            }
                            t.clear();
                            $.topTip({mark:"success",showTime:"2",content:"继续教育保存成功！"});
                        }else{
                            $.topTip({mark:"warn",showTime:"2",content:"继续教育保存失败！"});
                        }
                    },
                    error:function(){}
                });
            });
        },
        del:function(){
            var t=this;
            $(t.par+".cEdu_delBtn").die("click").live("click",function(){
                if(confirm("确认删除?")) {
                    $(t.par+".cEdu_add").after($(t.par+".cEdu_edit"));
                    $obj = $(this).parents(".cEdu_list")
                    var paramJson = $.toJSON({id: $(this).attr("val")});
                    $.ajax({
                        type: "post",
                        url: t.path.delete,
                        data: {paramJson: paramJson},
                        dataType: "json",
                        success: function (rep) {
                            if (rep.responseObject.responseStatus) {
                                $obj.animate({height:0},200,function(){
                                    $obj.remove();
                                });
                                $.topTip({mark: "success", showTime:"2",content: "继续教育删除成功！"});
                            } else {
                                $.topTip({mark: "warn", showTime:"2",content: "继续教育删除失败！"});
                            }
                        },
                        error: function () {
                        }
                    });
                }
            });
        }
    };
    //获得荣誉
    var honor={};
    honor={
        path:{
            list:PC_CALL+"customer/honor/json_list/",
            info:PC_CALL+"customer/honor/info/",
            create:PC_CALL+"customer/honor/create/",
            update:PC_CALL+"customer/honor/update/",
            delete:PC_CALL+"customer/honor/delete/"
        },
        templete:{
            returnList : function(options){
                var html="";
                html+='<div class="honor_list p_c_title_bj_zl baseinfo_after_mr">'+
                '<div class="honor_show"><div class="p_c_title_bj_zl_l font_yahei layerNoMargin layerEngL">'+
                '<div class="bj_jb_bg layerEngM"></div>'+
                '</div>'+
                '<div class="p_c_title_bj_zl_r font_yahei">'+
                '<div class="p_baseinfo_hospital honorName_show">'+options.honorName+'</div>'+
                '<div class="p_baseinfo_hospital_zl"><span class="awardDepartment_show">'+options.awardDepartment+'</span><span>｜</span><span class="time03">'+options.awardYear+'</span></div>'+
                '</div>'+
                '<div class="baseinfo_del"><a href="javascript:;" class="honor_delBtn" val="'+options.id+'">Delete</a></div>'+
                '<div class="baseinfo_bj"><a href="javascript:;" class="honor_editBtn" val="'+options.id+'">Edit</a></div>'+
                '<div class="clear"></div>'+
                '</div></div>';
                return html;
            }
        },
        init:function(obj){
            var t=this;
            this.par=obj.type=="ch"?"#ch_resume ":"#en_resume ";
            ymd({
                year:$(t.par+".awardYear")
            });

            this.customerId=$("#sesCustomerId").val();
            this.getHonorList();
            this.mouse();
            this.bindEdit();
            this.cancel();
            this.create();
            this.save();
            this.del();

        },
        //获取列表
        getHonorList:function(){
            var t=this;
            $.ajax({
                type : "post",
                url : t.path.list,
                data:{dataFlag:2,languageFlag:languageFlag},
                dataType : "json",
                success : function(data){
                    var html="";
                    if(data.responseObject.responseData.data_list&&data.responseObject.responseData.data_list.length>0) {
                        var list = data.responseObject.responseData.data_list;
                        $.each(list,function(i,val){
                            html+= t.templete.returnList({
                                honorName:val.honorName,
                                awardDepartment:val.awardDepartment,
                                awardYear:val.awardYear,
                                id:val.id
                            });
                        })
                    };
                    $(t.par+".honor_list_par").html(html);
                },
                error:function(){}
            });
        },
        //列表移入移出
        mouse:function(){
            var t=this;
            $(t.par+".honor_list").live("mouseover",function(){
                $(this).addClass("baseinfo_after_hover");
            });
            $(t.par+".honor_list").live("mouseout",function(){
                $(this).removeClass("baseinfo_after_hover");
            });
        },

        cancel:function(){
            var t=this;
            $(t.par+".honor_cancel").on("click",function(){
                t.clear();
                //事件埋点
                comm.creatEvent({
                    triggerType:"全站功能按钮点击",
                    keyword:"获得荣誉修改取消",
                    actionId:45
                });
                return false;
            })
        },
        clear:function(){
            var t=this;
            this.par="#en_resume ";
            this.mouse();
            $(t.par+".honor_add").show();
            $(t.par+".honor_edit").hide();
            $(t.par+".honor_show").show();
            $(t.par+".honorId").val("");
            $(t.par+".honor_edit input").val("");
            $(t.par+".honor_edit input").parent().removeClass("baseinfo_error_red");
            $(".error_red_icon",t.par+".honor_edit").hide();
            $(t.par+".honor_edit select").each(function(i,em){
                $("option",em).eq(0).attr("selected",true);
            })
        },
        //编辑
        bindEdit:function(){
            var t=this;
            $(t.par+".honor_editBtn").die("click").live("click",function(){
                var parent=$(this).parents(".honor_list");
                $(t.par+".honor_add").hide();
                $(t.par+".honor_edit").show().appendTo(parent);
                $(".honor_show",parent).hide();
                $(t.par+".honor_list").die("mouseover");
                var paramJson=$.toJSON({id:$(this).attr("val")});
                $.ajax({
                    type : "post",
                    url : t.path.info,
                    data : {paramJson:paramJson},
                    dataType : "json",
                    success : function(rep){
                        if(rep&&rep.responseObject.responseData.bo_data){
                            var data=rep.responseObject.responseData.bo_data;
                            $(t.par+".honorId").val(data.id);//给修改添加id
                            $(t.par+".honorName").val(data.honorName);
                            $(t.par+".awardDepartment").val(data.awardDepartment);
                            gettime($(t.par+".awardYear"),data.awardYear);
                        }
                    },
                    error:function(){}
                });
            })
        },
        create:function(){
            var t=this;
            $(t.par+".honor_add").on("click",function(){
                $(this).after($(t.par+".honor_edit"));
                $(t.par+".honor_edit").show();
                $(this).hide();
                $(t.par+".honor_list").die("mouseover");
            })
        },
        save:function(){
            var t=this;
            $(t.par+".honor_save").die("click").live("click",function(){
                var data={};
                $obj=$(this).parents(".honor_list");
                var id=$(t.par+".honorId").val();
                if(!id){//添加
                    data.customerId=t.customerId;
                }else{//修改
                    data.id=id;
                }
                data.honorName=$(t.par+".honorName").val();
                data.awardDepartment=$(t.par+".awardDepartment").val();
                data.awardYear=$(t.par+".awardYear option:selected").val();
                data.languageFlag=languageFlag;
                var isSuccess=1;
                //验证
                if(!$.trim(data.honorName)){
                    $(t.par+".honorName").parent().addClass("baseinfo_error_red");
                    $(t.par+".honorName").parent().next().show().text("请填写所获荣誉名称!");
                    isSuccess=0;
                }else if(comm.getByteLen(data.honorName)>200){
                    $(t.par+".honorName").parent().addClass("baseinfo_error_red");
                    $(t.par+".honorName").parent().next().show().text("最长100个中文或200个英文!");
                    isSuccess=0;
                }else{
                    $(t.par+".honorName").parent().removeClass("baseinfo_error_red");
                    $(t.par+".honorName").parent().next().hide();
                };
                if(!$.trim(data.awardDepartment)){
                    $(t.par+".awardDepartment").parent().addClass("baseinfo_error_red");
                    $(t.par+".awardDepartment").parent().next().show().text("请填写颁发机构名称!");
                    isSuccess=0;
                }else if(comm.getByteLen(data.awardDepartment)>200){
                    $(t.par+".awardDepartment").parent().addClass("baseinfo_error_red");
                    $(t.par+".awardDepartment").parent().next().show().text("最长100个中文或200个英文!");
                    isSuccess=0;
                }else{
                    $(t.par+".awardDepartment").parent().removeClass("baseinfo_error_red");
                    $(t.par+".awardDepartment").parent().next().hide();
                };

                if(isSuccess==0){
                    return;
                };
                $(t.par+".honor_edit").mask("");
                var paramJson=$.toJSON(data);
                $.ajax({
                    type : "post",
                    url : id? t.path.update: t.path.create,
                    data : {paramJson:paramJson},
                    dataType : "json",
                    success : function(rep){
                        $(t.par+".honor_edit").unmask("");
                        if(rep.responseObject.responseStatus){
                            if(id){
                                $obj.find(".honorName_show").text(data.honorName);
                                $obj.find(".awardDepartment_show").text(data.awardDepartment);
                                $obj.find(".time03").text(data.awardYear);
                            }else{
                                var html="";
                                html+= t.templete.returnList({
                                    honorName:data.honorName,
                                    awardDepartment:data.awardDepartment,
                                    awardYear:data.awardYear,
                                    id:rep.responseObject.responsePk
                                });
                                $(t.par+".honor_list_par").append(html);
                            }
                            t.clear();
                            $.topTip({mark:"success",showTime:"2",content:"获得荣誉保存成功！"});
                        }else{
                            $.topTip({mark:"warn",showTime:"2",content:"获得荣誉保存失败！"});
                        }
                    },
                    error:function(){}
                });
            });
        },
        del:function(){
            var t=this;
            $(t.par+".honor_delBtn").die("click").live("click",function(){
                if(confirm("确认删除?")) {
                    $(t.par+".honor_add").after($(t.par+".honor_edit"));
                    $obj = $(this).parents(".honor_list")
                    var paramJson = $.toJSON({id: $(this).attr("val")});
                    $.ajax({
                        type: "post",
                        url: t.path.delete,
                        data: {paramJson: paramJson},
                        dataType: "json",
                        success: function (rep) {
                            if (rep.responseObject.responseStatus) {
                                $obj.animate({height:0},200,function(){
                                    $obj.remove();
                                });
                                $.topTip({mark: "success", showTime:"2",content: "获得荣誉删除成功！"});
                            } else {
                                $.topTip({mark: "warn", showTime:"2",content: "获得荣誉删除失败！"});
                            }
                        },
                        error: function () {
                        }
                    });
                }
            });
        }
    };
    //科研基金
    var fund={};
    fund={
        path:{
            list:PC_CALL+"customer/fund/json_list/",
            info:PC_CALL+"customer/fund/info/",
            create:PC_CALL+"customer/fund/create/",
            update:PC_CALL+"customer/fund/update/",
            delete:PC_CALL+"customer/fund/delete/"
        },
        templete:{
            returnList : function(options){
                var html="";
                html+='<div class="fund_list p_c_title_bj_zl baseinfo_after_mr">'+
                '<div class="fund_show"><div class="p_c_title_bj_zl_l font_yahei layerNoMargin layerEngL">'+
                '<div class="bj_s_bg layerEngM"></div>'+
                '</div>'+
                '<div class="p_c_title_bj_zl_r font_yahei">'+
                '<div class="p_baseinfo_hospital fundName_show">'+options.fundName+'</div>'+
                '<div class="p_baseinfo_hospital_zl"><span class="fundCode_show">'+options.fundCode+'</span><span>｜</span><span class="time04">'+options.approvalTime+'</span></div>'+
                '</div>'+
                '<div class="baseinfo_del"><a href="javascript:;" class="fund_delBtn" val="'+options.id+'">Delete</a></div>'+
                '<div class="baseinfo_bj"><a href="javascript:;" class="fund_editBtn" val="'+options.id+'">Edit</a></div>'+
                '<div class="clear"></div>'+
                '</div></div>';
                return html;
            }
        },
        init:function(obj){
            var t=this;
            this.par=obj.type=="ch"?"#ch_resume ":"#en_resume ";
            ymd({
                year:$(t.par+".approvalTime")
            });

            this.customerId=$("#sesCustomerId").val();
            this.getFundList();
            this.mouse();
            this.bindEdit();
            this.cancel();
            this.create();
            this.save();
            this.del();

        },
        //获取列表
        getFundList:function(){
            var t=this;
            $.ajax({
                type : "post",
                url : t.path.list,
                data:{dataFlag:2,languageFlag:languageFlag},
                dataType : "json",
                success : function(data){
                    var html="";
                    if(data.responseObject.responseData.data_list&&data.responseObject.responseData.data_list.length>0) {
                        var list = data.responseObject.responseData.data_list;
                        $.each(list,function(i,val){
                            html+= t.templete.returnList({
                                fundName:val.fundName,
                                fundCode:val.fundCode,
                                approvalTime:val.approvalTime.substring(0,4),
                                id:val.id
                            });
                        })
                    };
                    $(t.par+".fund_list_par").html(html);
                },
                error:function(){}
            });
        },
        //列表移入移出
        mouse:function(){
            var t=this;
            $(t.par+".fund_list").live("mouseover",function(){
                $(this).addClass("baseinfo_after_hover");
            });
            $(t.par+".fund_list").live("mouseout",function(){
                $(this).removeClass("baseinfo_after_hover");
            });
        },

        cancel:function(){
            var t=this;
            $(t.par+".fund_cancel").on("click",function(){
                t.clear();
                //事件埋点
                comm.creatEvent({
                    triggerType:"全站功能按钮点击",
                    keyword:"科研基金修改取消",
                    actionId:45
                });
                return false;
            })
        },
        clear:function(){
            var t=this;
            this.par="#en_resume ";
            this.mouse();
            $(t.par+".fund_add").show();
            $(t.par+".fund_edit").hide();
            $(t.par+".fund_show").show();
            $(t.par+".fundId").val("");
            $(t.par+".fund_edit input").val("");
            $(t.par+".fund_edit input").parent().removeClass("baseinfo_error_red");
            $(".error_red_icon",t.par+".fund_edit").hide();
            $(t.par+".fund_edit select").each(function(i,em){
                $("option",em).eq(0).attr("selected",true);
            })
        },
        //编辑
        bindEdit:function(){
            var t=this;
            $(t.par+".fund_editBtn").die("click").live("click",function(){
                var parent=$(this).parents(".fund_list");
                $(t.par+".fund_add").hide();
                $(t.par+".fund_edit").show().appendTo(parent);
                $(".fund_show",parent).hide();
                $(t.par+".fund_list").die("mouseover");
                var paramJson=$.toJSON({id:$(this).attr("val")});
                $.ajax({
                    type : "post",
                    url : t.path.info,
                    data : {paramJson:paramJson},
                    dataType : "json",
                    success : function(rep){
                        if(rep&&rep.responseObject.responseData.bo_data){
                            var data=rep.responseObject.responseData.bo_data;
                            $(t.par+".fundId").val(data.id);//给修改添加id
                            $(t.par+".fundName").val(data.fundName);
                            $(t.par+".fundCode").val(data.fundCode);
                            gettime($(t.par+".approvalTime"),data.approvalTime.substring(0,4));
                        }
                    },
                    error:function(){}
                });
            })
        },
        create:function(){
            var t=this;
            $(t.par+".fund_add").on("click",function(){
                $(this).after($(t.par+".fund_edit"));
                $(t.par+".fund_edit").show();
                $(this).hide();
                $(t.par+".fund_list").die("mouseover");
            })
        },
        save:function(){
            var t=this;
            $(t.par+".fund_save").die("click").live("click",function(){
                var data={};
                $obj=$(this).parents(".fund_list");
                var id=$(t.par+".fundId").val();
                if(!id){//添加
                    data.customerId=t.customerId;
                }else{//修改
                    data.id=id;
                }
                data.fundName=$(t.par+".fundName").val();
                data.fundCode=$(t.par+".fundCode").val();
                data.approvalTime=$(t.par+".approvalTime option:selected").val();
                data.languageFlag=languageFlag;
                var isSuccess=1;
                //验证
                if(!$.trim(data.fundName)){
                    $(t.par+".fundName").parent().addClass("baseinfo_error_red");
                    $(t.par+".fundName").parent().next().show().text("请填写科研基金的项目名称!");
                    isSuccess=0;
                }else if(comm.getByteLen(data.fundName)>200){
                    $(t.par+".fundName").parent().addClass("baseinfo_error_red");
                    $(t.par+".fundName").parent().next().show().text("最长100个中文或200个英文!");
                    isSuccess=0;
                }else{
                    $(t.par+".fundName").parent().removeClass("baseinfo_error_red");
                    $(t.par+".fundName").parent().next().hide();
                };
                if(!$.trim(data.fundCode)){
                    $(t.par+".fundCode").parent().addClass("baseinfo_error_red");
                    $(t.par+".fundCode").parent().next().show().text("请填写科研基金的项目编号!");
                    isSuccess=0;
                }else if(comm.getByteLen(data.fundCode)>200){
                    $(t.par+".fundCode").parent().addClass("baseinfo_error_red");
                    $(t.par+".fundCode").parent().next().show().text("最长100个中文或200个英文!");
                    isSuccess=0;
                }else{
                    $(t.par+".fundCode").parent().removeClass("baseinfo_error_red");
                    $(t.par+".fundCode").parent().next().hide();
                };

                if(isSuccess==0){
                    return;
                };
                $(t.par+".fund_edit").mask("");
                var paramJson=$.toJSON(data);
                $.ajax({
                    type : "post",
                    url : id? t.path.update: t.path.create,
                    data : {paramJson:paramJson},
                    dataType : "json",
                    success : function(rep){
                        $(t.par+".fund_edit").unmask("");
                        if(rep.responseObject.responseStatus){
                            if(id){
                                $obj.find(".fundName_show").text(data.fundName);
                                $obj.find(".fundCode_show").text(data.fundCode);
                                $obj.find(".time04").text(data.approvalTime);
                            }else{
                                var html="";
                                html+= t.templete.returnList({
                                    fundName:data.fundName,
                                    fundCode:data.fundCode,
                                    approvalTime:data.approvalTime,
                                    id:rep.responseObject.responsePk
                                });
                                $(t.par+".fund_list_par").append(html);
                            }
                            t.clear();
                            $.topTip({mark:"success",showTime:"2",content:"科研基金保存成功！"});
                        }else{
                            $.topTip({mark:"warn",showTime:"2",content:"科研基金保存失败！"});
                        }
                    },
                    error:function(){}
                });
            });
        },
        del:function(){
            var t=this;
            $(t.par+".fund_delBtn").die("click").live("click",function(){
                if(confirm("确认删除?")) {
                    $(t.par+".fund_add").after($(t.par+".fund_edit"));
                    $obj = $(this).parents(".fund_list")
                    var paramJson = $.toJSON({id: $(this).attr("val")});
                    $.ajax({
                        type: "post",
                        url: t.path.delete,
                        data: {paramJson: paramJson},
                        dataType: "json",
                        success: function (rep) {
                            if (rep.responseObject.responseStatus) {
                                $obj.animate({height: 0}, 200, function () {
                                    $obj.remove();
                                });
                                $.topTip({mark: "success", showTime:"2",content: "科研基金删除成功！"});
                            } else {
                                $.topTip({mark: "warn", showTime:"2",content: "科研基金删除失败！"});
                            }
                        },
                        error: function () {
                        }
                    });
                }
            });
        }
    };
    //社会职责
    var social={};
    social={
        path:{
            list:PC_CALL+"customer/social/json_list/",
            info:PC_CALL+"customer/social/info/",
            create:PC_CALL+"customer/social/create/",
            update:PC_CALL+"customer/social/update/",
            delete:PC_CALL+"customer/social/delete/"
        },
        templete:{
            returnList : function(options){
                var html="";
                html+='<div class="social_list p_c_title_bj_zl baseinfo_after_mr">'+
                '<div class="social_show"><div class="p_c_title_bj_zl_l font_yahei layerNoMargin layerEngL">'+
                '<div class="bj_jt_bg layerEngM"></div>'+
                '</div>'+
                '<div class="p_c_title_bj_zl_r font_yahei">'+
                '<div class="p_baseinfo_hospital organization_show">'+options.organization+'</div>'+
                '<div class="p_baseinfo_hospital_zl"><span class="socialTitle_show">'+options.socialTitle+'</span><span>｜</span><span class="time05">'+options.time+'</span></div>'+
                '</div>'+
                '<div class="baseinfo_del"><a href="javascript:;" class="social_delBtn" val="'+options.id+'">Delete</a></div>'+
                '<div class="baseinfo_bj"><a href="javascript:;" class="social_editBtn" val="'+options.id+'">Edit</a></div>'+
                '<div class="clear"></div>'+
                '</div></div>';
                return html;
            }
        },
        init:function(obj){
            var t=this;
            this.par=obj.type=="ch"?"#ch_resume ":"#en_resume ";
            ymd({
                year:$(t.par+".social_start_year"),
                month:$(t.par+".social_start_month"),
                en:1
            });
            ymd({
                year:$(t.par+".social_end_year"),
                month:$(t.par+".social_end_month"),
                en:1
            });

            this.customerId=$("#sesCustomerId").val();
            this.getSocialList();
            this.mouse();
            this.upNowClick();
            this.bindEdit();
            this.cancel();
            this.create();
            this.save();
            this.del();

        },
        //获取列表
        getSocialList:function(){
            var t=this;
            $.ajax({
                type : "post",
                url : t.path.list,
                data:{dataFlag:2,languageFlag:languageFlag},
                dataType : "json",
                success : function(data){
                    var html="";
                    if(data.responseObject.responseData.data_list&&data.responseObject.responseData.data_list.length>0) {
                        var list = data.responseObject.responseData.data_list;
                        $.each(list,function(i,val){
                            var startTime=getEnTime({'date':val.startTime});
                            var endTime=getEnTime({'date':val.endTime});
                            if(val.upNow){
                                time=startTime.year+'.'+startTime.month+" ～ Till Now";
                            }else{
                                time=startTime.year+'.'+startTime.month+" ～ "+endTime.year+'.'+endTime.month;
                            };
                            html+= t.templete.returnList({
                                organization:val.organization,
                                socialTitle:val.socialTitle,
                                time:time,
                                id:val.id
                            });
                        })
                    };
                    $(t.par+".social_list_par").html(html);
                },
                error:function(){}
            });
        },
        //列表移入移出
        mouse:function(){
            var t=this;
            $(t.par+".social_list").live("mouseover",function(){
                $(this).addClass("baseinfo_after_hover");
            });
            $(t.par+".social_list").live("mouseout",function(){
                $(this).removeClass("baseinfo_after_hover");
            });
        },
        //至今点击
        upNowClick:function(){
            var t=this;
            $(t.par+".social_upNow").on("click",function(){
                if($(this).attr("value")==0){
                    $(t.par+".soc_time").hide();
                    $(this).attr("value",1);
                    $("span",this).addClass("checkboxImgActive");
                }else{
                    $(t.par+".soc_time").show();
                    $(this).attr("value",0);
                    $("span",this).removeClass("checkboxImgActive");
                }

            });
        },
        cancel:function(){
            var t=this;
            $(t.par+".social_cancel").on("click",function(){
                t.clear();
                //事件埋点
                comm.creatEvent({
                    triggerType:"全站功能按钮点击",
                    keyword:"社会任职修改取消",
                    actionId:45
                });
                return false;
            })
        },
        clear:function(){
            var t=this;
            this.par="#en_resume ";
            this.mouse();
            $(t.par+".social_add").show();
            $(t.par+".social_edit").hide();
            $(t.par+".social_show").show();
            $(t.par+".socialId").val("");
            $(t.par+".social_edit input").val("");
            $(t.par+".social_edit input").parent().removeClass("baseinfo_error_red");
            $(".error_red_icon",t.par+".social_edit").hide();
            $(t.par+".soc_time").show();
            $(t.par+".social_upNow").attr("value",0);
            $(t.par+".social_upNow span").removeClass("checkboxImgActive");
            $(t.par+".social_edit select").each(function(i,em){
                $("option",em).eq(0).attr("selected",true);
            })
        },
        //编辑
        bindEdit:function(){
            var t=this;
            $(t.par+".social_editBtn").die("click").live("click",function(){
                var parent=$(this).parents(".social_list");
                $(t.par+".social_add").hide();
                $(t.par+".social_edit").show().appendTo(parent);
                $(".social_show",parent).hide();
                $(t.par+".social_list").die("mouseover");
                var paramJson=$.toJSON({id:$(this).attr("val")});
                $.ajax({
                    type : "post",
                    url : t.path.info,
                    data : {paramJson:paramJson},
                    dataType : "json",
                    success : function(rep){
                        if(rep&&rep.responseObject.responseData.bo_data){
                            var data=rep.responseObject.responseData.bo_data;
                            $(t.par+".socialId").val(data.id);//给修改添加id
                            $(t.par+".soc_organization").val(data.organization);
                            $(t.par+".socialTitle").val(data.socialTitle);

                            var start_year=data.startTime.split("-")[0];
                            var start_month=data.startTime.split("-")[1];
                            var end_year=data.endTime.split("-")[0];
                            var end_month=data.endTime.split("-")[1];
                            gettime($(t.par+".social_start_year"),start_year);
                            gettime($(t.par+".social_start_month"),start_month);
                            gettime($(t.par+".social_end_year"),end_year);
                            gettime($(t.par+".social_end_month"),end_month);

                            if(data.upNow){
                                $(t.par+".soc_time").hide();
                                $(t.par+".social_upNow").attr("value",1);
                                $(t.par+".social_upNow span").addClass("checkboxImgActive");
                            };
                        }
                    },
                    error:function(){}
                });
            })
        },
        create:function(){
            var t=this;
            $(t.par+".social_add").on("click",function(){
                $(this).after($(t.par+".social_edit"));
                $(t.par+".social_edit").show();
                $(this).hide();
                $(t.par+".social_list").die("mouseover");
            })
        },
        save:function(){
            var t=this;
            $(t.par+".social_save").die("click").live("click",function(){
                var data={};
                $obj=$(this).parents(".social_list");
                var id=$(t.par+".socialId").val();
                if(!id){//添加
                    data.customerId=t.customerId;
                }else{//修改
                    data.id=id;
                }
                data.organization=$(t.par+".soc_organization").val();
                data.socialTitle=$(t.par+".socialTitle").val();
                var sTime=$(t.par+".social_start_year option:selected").val()+'.'+$(t.par+".social_start_month option:selected").text();
                data.startTime=$(t.par+".social_start_year option:selected").val()+'-'+$(t.par+".social_start_month option:selected").val();
                var eTime=$(t.par+".social_end_year option:selected").val()+'.'+$(t.par+".social_end_month option:selected").text();
                data.endTime=$(t.par+".social_end_year option:selected").val()+'-'+$(t.par+".social_end_month option:selected").val();
                data.languageFlag=languageFlag;
                time="";
                if($(t.par+".social_upNow").attr("value")==1){
                    data.upNow=1;
                    time=sTime+' ～ Till Now';
                    eTime='';
                    data.endTime='';
                }else{
                    data.upNow=0;
                    time=sTime+' ～ '+eTime;
                };
                var isSuccess=1;
                //验证
                if(!$.trim(data.organization)){
                    $(t.par+".soc_organization").parent().addClass("baseinfo_error_red");
                    $(t.par+".soc_organization").parent().next().show().text("请填写任职机构名称!");
                    isSuccess=0;
                }else if(comm.getByteLen(data.organization)>200){
                    $(t.par+".soc_organization").parent().addClass("baseinfo_error_red");
                    $(t.par+".soc_organization").parent().next().show().text("最长100个中文或200个英文!");
                    isSuccess=0;
                }else{
                    $(t.par+".soc_organization").parent().removeClass("baseinfo_error_red");
                    $(t.par+".soc_organization").parent().next().hide();
                };
                if(!$.trim(data.socialTitle)){
                    $(t.par+".socialTitle").parent().addClass("baseinfo_error_red");
                    $(t.par+".socialTitle").parent().next().show().text("请填写职位名称!");
                    isSuccess=0;
                }else if(comm.getByteLen(data.socialTitle)>200){
                    $(t.par+".socialTitle").parent().addClass("baseinfo_error_red");
                    $(t.par+".socialTitle").parent().next().show().text("最长100个中文或200个英文!");
                    isSuccess=0;
                }else{
                    $(t.par+".socialTitle").parent().removeClass("baseinfo_error_red");
                    $(t.par+".socialTitle").parent().next().hide();
                };

                if(!checkEndTime(data.startTime,data.endTime)){
                    $(t.par+".soc_error_time").show();
                    isSuccess=0;
                }else{
                    $(t.par+".soc_error_time").hide();
                };
                if(isSuccess==0){
                    return;
                };
                $(t.par+".social_edit").mask("");
                var paramJson=$.toJSON(data);
                $.ajax({
                    type : "post",
                    url : id? t.path.update: t.path.create,
                    data : {paramJson:paramJson},
                    dataType : "json",
                    success : function(rep){
                        $(t.par+".social_edit").unmask("");
                        if(rep.responseObject.responseStatus){
                            if(id){
                                $obj.find(".organization_show").text(data.organization);
                                $obj.find(".socialTitle_show").text(data.socialTitle);
                                $obj.find(".time05").text(time);
                            }else{
                                var html="";
                                html+= t.templete.returnList({
                                    organization:data.organization,
                                    socialTitle:data.socialTitle,
                                    time:time,
                                    id:rep.responseObject.responsePk
                                });
                                $(t.par+".social_list_par").append(html);
                            }
                            t.clear();
                            $.topTip({mark:"success",showTime:"2",content:"社会任职保存成功！"});
                        }else{
                            $.topTip({mark:"warn",showTime:"2",content:"社会任职保存失败！"});
                        }
                    },
                    error:function(){}
                });
            });
        },
        del:function(){
            var t=this;
            $(t.par+".social_delBtn").die("click").live("click",function(){
                if(confirm("确认删除?")) {
                    $(t.par+".social_add").after($(t.par+".social_edit"));
                    $obj = $(this).parents(".social_list")
                    var paramJson = $.toJSON({id: $(this).attr("val")});
                    $.ajax({
                        type: "post",
                        url: t.path.delete,
                        data: {paramJson: paramJson},
                        dataType: "json",
                        success: function (rep) {
                            if (rep.responseObject.responseStatus) {
                                $obj.animate({height:0},200,function(){
                                    $obj.remove();
                                });
                                $.topTip({mark: "success", showTime:"2",content: "社会任职删除成功！"});
                            } else {
                                $.topTip({mark: "warn",showTime:"2", content: "社会任职删除失败！"});
                            }
                        },
                        error: function () {
                        }
                    });
                }
            });
        }
    };
    //学术专著
    var opus={};
    opus={
        path:{
            list:PC_CALL+"customer/opus/json_list/",
            info:PC_CALL+"customer/opus/info/",
            create:PC_CALL+"customer/opus/create/",
            update:PC_CALL+"customer/opus/update/",
            delete:PC_CALL+"customer/opus/delete/"
        },
        templete:{
            returnList : function(options){
                var html="";
                html+='<div class="opus_list p_c_title_bj_zl baseinfo_after_mr">'+
                '<div class="opus_show"><div class="p_c_title_bj_zl_l font_yahei layerNoMargin layerEngL">'+
                '<div class="bj_gz_bg layerEngM"></div>'+
                '</div>'+
                '<div class="p_c_title_bj_zl_r font_yahei">'+
                '<div class="p_baseinfo_hospital opusName_show">'+options.opusName+'</div>'+
                '<div class="p_baseinfo_hospital_zl"><span class="publisher_show">'+options.publisher+'</span><span>｜</span><span class="authorType_show">'+options.authorType+'</span><span>｜</span><span class="time06">'+options.time+'</span></div>'+
                '<div class="p_baseinfo_px_cont information_show" '+(!options.information?"style='display:none'":'')+'>'+options.information+'</div>'+
                '</div>'+
                '<div class="baseinfo_del"><a href="javascript:;" class="opus_delBtn" val="'+options.id+'">Delete</a></div>'+
                '<div class="baseinfo_bj"><a href="javascript:;" class="opus_editBtn" val="'+options.id+'">Edit</a></div>'+
                '<div class="clear"></div>'+
                '</div></div>';
                return html;
            }
        },
        init:function(obj){
            var t=this;
            this.par=obj.type=="ch"?"#ch_resume ":"#en_resume ";
            ymd({
                year:$(t.par+".pubYear"),
                month:$(t.par+".pubMonth"),
                en:1
            });
            this.customerId=$("#sesCustomerId").val();
            this.getOpusList();
            this.mouse();
            this.bindEdit();
            this.cancel();
            this.create();
            this.save();
            this.del();
        },
        //获取列表
        getOpusList:function(){
            var t=this;
            $.ajax({
                type : "post",
                url : t.path.list,
                data:{dataFlag:2,languageFlag:languageFlag},
                dataType : "json",
                success : function(data){
                    var html="";
                    if(data.responseObject.responseData.data_list&&data.responseObject.responseData.data_list.length>0) {
                        var list = data.responseObject.responseData.data_list;
                        $.each(list,function(i,val){
                            switch(val.authorType){
                                case 1:
                                    authorType="First Author";
                                    break;
                                case 2:
                                    authorType="First Translator";
                                    break;
                                case 3:
                                    authorType="Joint Author";
                                    break;
                                case 4:
                                    authorType="Joint Translator";
                                    break;
                            }
                            var date=getEnTime({'date':val.publicationTime});
                            time=date.year+"."+date.month;
                            html+= t.templete.returnList({
                                opusName:val.opusName,
                                publisher:val.publisher,
                                authorType:authorType,
                                time:time,
                                information: $.trim(val.information)?val.information:'',
                                id:val.id
                            });
                        })
                    };
                    $(t.par+".opus_list_par").html(html);
                },
                error:function(){}
            });
        },
        //列表移入移出
        mouse:function(){
            var t=this;
            $(t.par+".opus_list").live("mouseover",function(){
                $(this).addClass("baseinfo_after_hover");
            });
            $(t.par+".opus_list").live("mouseout",function(){
                $(this).removeClass("baseinfo_after_hover");
            });
        },
        cancel:function(){
            var t=this;
            $(t.par+".opus_cancel").on("click",function(){
                t.clear();
                //事件埋点
                comm.creatEvent({
                    triggerType:"全站功能按钮点击",
                    keyword:"学术专著修改取消",
                    actionId:45
                });
                return false;
            })
        },
        clear:function(){
            var t=this;
            this.par="#en_resume ";
            this.mouse();
            $(t.par+".opus_add").show();
            $(t.par+".opus_edit").hide();
            $(t.par+".opus_show").show();
            $(t.par+".opusId").val("");
            $(t.par+".opus_edit input").val("");
            $(t.par+".opus_edit input").parent().removeClass("baseinfo_error_red");
            $(".error_red_icon",t.par+".opus_edit").hide();
            $(t.par+".information").val("");
            $(t.par+".opus_edit select").each(function(i,em){
                $("option",em).eq(0).attr("selected",true);
            })
        },
        //编辑
        bindEdit:function(){
            var t=this;
            $(t.par+".opus_editBtn").die("click").live("click",function(){
                var parent=$(this).parents(".opus_list");
                $(t.par+".opus_add").hide();
                $(t.par+".opus_edit").show().appendTo(parent);
                $(".opus_show",parent).hide();
                $(t.par+".opus_list").die("mouseover");
                var paramJson=$.toJSON({id:$(this).attr("val")});
                $.ajax({
                    type : "post",
                    url : t.path.info,
                    data : {paramJson:paramJson},
                    dataType : "json",
                    success : function(rep){
                        if(rep&&rep.responseObject.responseData.bo_data){
                            var data=rep.responseObject.responseData.bo_data;
                            $(t.par+".opusId").val(data.id);//给修改添加id
                            $(t.par+".opusName").val(data.opusName);
                            $(t.par+".publisher").val(data.publisher);
                            $(t.par+".information").val(data.information);

                            var pubYear=data.publicationTime.substring(0,4);
                            var pubMonth=data.publicationTime.substring(5,7);
                            gettime($(t.par+".pubYear"),pubYear);
                            gettime($(t.par+".pubMonth"),pubMonth);

                            $.each($(t.par+".authorType option"),function(i,em){
                                if($(em).val()==data.authorType){
                                    $(em).attr("selected",true);
                                }
                            });
                        }
                    },
                    error:function(){}
                });
            })
        },
        create:function(){
            var t=this;
            $(t.par+".opus_add").on("click",function(){
                $(this).after($(t.par+".opus_edit"));
                $(t.par+".opus_edit").show();
                $(this).hide();
                $(t.par+".opus_list").die("mouseover");
            })
        },
        save:function(){
            var t=this;
            $(t.par+".opus_save").die("click").live("click",function(){
                var data={};
                $obj=$(this).parents(".opus_list");
                var id=$(t.par+".opusId").val();
                if(!id){//添加
                    data.customerId=t.customerId;
                }else{//修改
                    data.id=id;
                }
                data.opusName=$(t.par+".opusName").val();
                data.publisher=$(t.par+".publisher").val();
                data.information=$(t.par+".information").val()?$(t.par+".information").val():" ";
                data.authorType=$(t.par+".authorType option:selected").val();
                var time=$(t.par+".pubYear option:selected").val()+'.'+$(t.par+".pubMonth option:selected").text();
                data.publicationTime=$(t.par+".pubYear option:selected").val()+'-'+$(t.par+".pubMonth option:selected").val()+"-01";
                data.languageFlag=languageFlag;
                var isSuccess=1;
                //验证
                if(!$.trim(data.opusName)){
                    $(t.par+".opusName").parent().addClass("baseinfo_error_red");
                    $(t.par+".opusName").parent().next().show().text("请填写学术论著的标题！");
                    isSuccess=0;
                }else if(comm.getByteLen(data.opusName)>200){
                    $(t.par+".opusName").parent().addClass("baseinfo_error_red");
                    $(t.par+".opusName").parent().next().show().text("最长100个中文或200个英文！");
                    isSuccess=0;
                }else{
                    $(t.par+".opusName").parent().removeClass("baseinfo_error_red");
                    $(t.par+".opusName").parent().next().hide();
                };
                if(!$.trim(data.publisher)){
                    $(t.par+".publisher").parent().addClass("baseinfo_error_red");
                    $(t.par+".publisher").parent().next().show().text("请填写出版机构名称！");
                    isSuccess=0;
                }else if(comm.getByteLen(data.publisher)>200){
                    $(t.par+".publisher").parent().addClass("baseinfo_error_red");
                    $(t.par+".publisher").parent().next().show().text("最长100个中文或200个英文！");
                    isSuccess=0;
                }else{
                    $(t.par+".publisher").parent().removeClass("baseinfo_error_red");
                    $(t.par+".publisher").parent().next().hide();
                };
                if(data.authorType==="0"){
                    $(t.par+".type_error").show().text("请选择你对本文的著作身份！");
                    isSuccess=0;
                }else{
                    $(t.par+".type_error").hide();
                };
                if(comm.getByteLen(data.information)>4000){
                    $(t.par+".information").parent().addClass("baseinfo_error_red");
                    $(t.par+".information").parent().next().show().text("最长2000个中文！");
                    isSuccess=0;
                }else{
                    $(t.par+".information").parent().removeClass("baseinfo_error_red");
                    $(t.par+".information").parent().next().hide();
                };
                if(isSuccess==0){
                    return;
                };
                authorType=$(t.par+".authorType option:selected").text();
                $(t.par+".opus_edit").mask("");
                var paramJson=$.toJSON(data);
                $.ajax({
                    type : "post",
                    url : id? t.path.update: t.path.create,
                    data : {paramJson:paramJson},
                    dataType : "json",
                    success : function(rep){
                        $(t.par+".opus_edit").unmask("");
                        if(rep.responseObject.responseStatus){
                            if(id){
                                $obj.find(".opusName_show").text(data.opusName);
                                $obj.find(".publisher_show").text(data.publisher);
                                $obj.find(".authorType_show").text(authorType);
                                if($.trim(data.information)){
                                    $obj.find(".information_show").show().text(data.information);
                                }else{
                                    $obj.find(".information_show").hide().text(data.information);
                                }
                                $obj.find(".time06").text(time);
                            }else{
                                var html="";
                                html+= t.templete.returnList({
                                    opusName:data.opusName,
                                    publisher:data.publisher,
                                    authorType:authorType,
                                    time:time,
                                    information: $.trim(data.information)?data.information:'',
                                    id:rep.responseObject.responsePk
                                });
                                $(t.par+".opus_list_par").append(html);
                            }
                            t.clear();
                            $.topTip({mark:"success",showTime:"2",content:"学术专著保存成功！"});
                        }else{
                            $.topTip({mark:"warn",showTime:"2",content:"学术专著保存失败！"});
                        }
                    },
                    error:function(){}
                });
            });
        },
        del:function(){
            var t=this;
            $(t.par+".opus_delBtn").die("click").live("click",function(){
                if(confirm("确认删除?")) {
                    $(t.par+".opus_add").after($(t.par+".opus_edit"));
                    $obj = $(this).parents(".opus_list");
                    var paramJson = $.toJSON({id: $(this).attr("val")});
                    $.ajax({
                        type: "post",
                        url: t.path.delete,
                        data: {paramJson: paramJson},
                        dataType: "json",
                        success: function (rep) {
                            if (rep.responseObject.responseStatus) {
                                $obj.animate({height: 0}, 200, function () {
                                    $obj.remove();
                                });
                                $.topTip({mark: "success", showTime:"2",content: "学术专著删除成功！"});
                            } else {
                                $.topTip({mark: "warn",showTime:"2", content: "学术专著删除失败！"});
                            }
                        },
                        error: function () {
                        }
                    });
                }
            });
        }
    };
    //发明专利
    var patent={};
    patent={
        path:{
            list:PC_CALL+"customer/patent/json_list/",
            info:PC_CALL+"customer/patent/info/",
            create:PC_CALL+"customer/patent/create/",
            update:PC_CALL+"customer/patent/update/",
            delete:PC_CALL+"customer/patent/delete/",
            country:PC_CALL+"comm/data/region/json_list/"
        },
        templete:{
            returnList : function(options){
                var html="";
                html+='<div class="patent_list p_c_title_bj_zl baseinfo_after_mr">'+
                '<div class="patent_show"><div class="p_c_title_bj_zl_l font_yahei layerNoMargin layerEngL">'+
                '<div class="bj_d_bg layerEngM"></div>'+
                '</div>'+
                '<div class="p_c_title_bj_zl_r font_yahei">'+
                '<div class="p_baseinfo_hospital patentName_show">'+options.patentName+'</div>'+
                '<div class="p_baseinfo_hospital_zl"><span class="patentCode_show">'+options.patentCode+'</span><span>｜</span><span class="country_show">'+options.country+'</span><span>｜</span><span class="time07">'+options.time+'</span></div>'+
                '</div>'+
                '<div class="baseinfo_del"><a href="javascript:;" class="patent_delBtn" val="'+options.id+'">Delete</a></div>'+
                '<div class="baseinfo_bj"><a href="javascript:;" class="patent_editBtn" val="'+options.id+'">Edit</a></div>'+
                '<div class="clear"></div>'+
                '</div></div>';
                return html;
            }
        },
        init:function(obj){
            var t=this;
            this.par=obj.type=="ch"?"#ch_resume ":"#en_resume ";
            ymd({
                year:$(t.par+".patYear"),
                month:$(t.par+".patMonth"),
                en:1
            });
            this.customerId=$("#sesCustomerId").val();
            this.getPatList();
            this.mouse();
            this.getCountry();
            this.bindEdit();
            this.cancel();
            this.create();
            this.save();
            this.del();
        },
        //获取国家
        getCountry:function(){
            var t=this;
            $.ajax({
                type: "POST",
                url:  t.path.country,
                data:{treeLevel:1,pageIndex:1,pageSize:500},
                dataType: "json",
                async: false,
                success: function(data){
                    var html="";
                    if(data.responseObject.responseData.data_list){
                        $.each(data.responseObject.responseData.data_list,function(i,val){
                            html+="<option value='"+val.regionNameEn+"'>"+val.regionNameEn+"</option>"
                        })
                        $(t.par+".country").html(html);
                    }
                }
            });
        },
        //获取列表
        getPatList:function(){
            var t=this;
            $.ajax({
                type : "post",
                url : t.path.list,
                data:{dataFlag:2,languageFlag:languageFlag},
                dataType : "json",
                success : function(data){
                    var html="";
                    if(data.responseObject.responseData.data_list&&data.responseObject.responseData.data_list.length>0) {
                        var list = data.responseObject.responseData.data_list;
                        $.each(list,function(i,val){
                            var date=getEnTime({'date':val.patentTime})
                            time=date.year+'.'+date.month;
                            html+= t.templete.returnList({
                                patentName:val.patentName,
                                patentCode:val.patentCode,
                                country:val.country,
                                time:time,
                                id:val.id
                            });
                        })
                    };
                    $(t.par+".patent_list_par").html(html);
                },
                error:function(){}
            });
        },
        //列表移入移出
        mouse:function(){
            var t=this;
            $(t.par+".patent_list").live("mouseover",function(){
                $(this).addClass("baseinfo_after_hover");
            });
            $(t.par+".patent_list").live("mouseout",function(){
                $(this).removeClass("baseinfo_after_hover");
            });
        },
        cancel:function(){
            var t=this;
            $(t.par+".patent_cancel").on("click",function(){
                t.clear();
                //事件埋点
                comm.creatEvent({
                    triggerType:"全站功能按钮点击",
                    keyword:"发明专利修改取消",
                    actionId:45
                });
                return false;
            })
        },
        clear:function(){
            var t=this;
            this.par="#en_resume ";
            this.mouse();
            $(t.par+".patent_add").show();
            $(t.par+".patent_edit").hide();
            $(t.par+".patent_show").show();
            $(t.par+".patentId").val("");
            $(t.par+".patent_edit input").val("");
            $(t.par+".patent_edit input").parent().removeClass("baseinfo_error_red");
            $(".error_red_icon",t.par+".patent_edit").hide();
            $(t.par+".patent_edit select").each(function(i,em){
                $("option",em).eq(0).attr("selected",true);
            })
        },
        //编辑
        bindEdit:function(){
            var t=this;
            $(t.par+".patent_editBtn").die("click").live("click",function(){
                var parent=$(this).parents(".patent_list");
                $(t.par+".patent_add").hide();
                $(t.par+".patent_edit").show().appendTo(parent);
                $(".patent_show",parent).hide();
                $(t.par+".patent_list").die("mouseover");
                var paramJson=$.toJSON({id:$(this).attr("val")});
                $.ajax({
                    type : "post",
                    url : t.path.info,
                    data : {paramJson:paramJson},
                    dataType : "json",
                    success : function(rep){
                        if(rep&&rep.responseObject.responseData.bo_data){
                            var data=rep.responseObject.responseData.bo_data;
                            $(t.par+".patentId").val(data.id);//给修改添加id
                            $(t.par+".patentName").val(data.patentName);
                            $(t.par+".patentCode").val(data.patentCode);

                            var patYear=data.patentTime.substring(0,4);
                            var patMonth=data.patentTime.substring(5,7);
                            gettime($(t.par+".patYear"),patYear);
                            gettime($(t.par+".patMonth"),patMonth);

                            $.each($(t.par+".country option"),function(i,em){
                                if($(em).val()==data.country){
                                    $(em).attr("selected",true);
                                }
                            });
                        }
                    },
                    error:function(){}
                });
            })
        },
        create:function(){
            var t=this;
            $(t.par+".patent_add").on("click",function(){
                $(this).after($(t.par+".patent_edit"));
                $(t.par+".patent_edit").show();
                $(this).hide();
                $(t.par+".patent_list").die("mouseover");
            })
        },
        save:function(){
            var t=this;
            $(t.par+".patent_save").die("click").live("click",function(){
                var data={};
                $obj=$(this).parents(".patent_list");
                var id=$(t.par+".patentId").val();
                if(!id){//添加
                    data.customerId=t.customerId;
                }else{//修改
                    data.id=id;
                }
                data.patentName=$(t.par+".patentName").val();
                data.patentCode=$(t.par+".patentCode").val();
                data.country=$(t.par+".country option:selected").val();
                var time=$(t.par+".patYear option:selected").val()+'.'+$(t.par+".patMonth option:selected").text();
                data.patentTime=$(t.par+".patYear option:selected").val()+'-'+$(t.par+".patMonth option:selected").val();
                data.languageFlag=languageFlag;
                var isSuccess=1;
                //验证
                if(!$.trim(data.patentName)){
                    $(t.par+".patentName").parent().addClass("baseinfo_error_red");
                    $(t.par+".patentName").parent().next().show().text("请填写专利名称！");
                    isSuccess=0;
                }else if(comm.getByteLen(data.patentName)>200){
                    $(t.par+".patentName").parent().addClass("baseinfo_error_red");
                    $(t.par+".patentName").parent().next().show().text("最长100个中文或200个英文！");
                    isSuccess=0;
                }else{
                    $(t.par+".patentName").parent().removeClass("baseinfo_error_red");
                    $(t.par+".patentName").parent().next().hide();
                };
                if(!$.trim(data.patentCode)){
                    $(t.par+".patentCode").parent().addClass("baseinfo_error_red");
                    $(t.par+".patentCode").parent().next().show().text("请填写专利编号！");
                    isSuccess=0;
                }else if(!(/[a-zA-Z0-9]{1,200}$/.test(data.patentCode))){
                    $(t.par+".patentCode").parent().addClass("baseinfo_error_red");
                    $(t.par+".patentCode").parent().next().show().text("请填写正确的专利编号！");
                    isSuccess=0;
                }else if(comm.getByteLen(data.patentCode)>200){
                    $(t.par+".patentCode").parent().addClass("baseinfo_error_red");
                    $(t.par+".patentCode").parent().next().show().text("最长200个字符！");
                    isSuccess=0;
                }else{
                    $(t.par+".patentCode").parent().removeClass("baseinfo_error_red");
                    $(t.par+".patentCode").parent().next().hide();
                };

                if(isSuccess==0){
                    return;
                };
                $(t.par+".patent_edit").mask("");
                var paramJson=$.toJSON(data);
                $.ajax({
                    type : "post",
                    url : id? t.path.update: t.path.create,
                    data : {paramJson:paramJson},
                    dataType : "json",
                    success : function(rep){
                        $(t.par+".patent_edit").unmask("");
                        if(rep.responseObject.responseStatus){
                            if(id){
                                $obj.find(".patentName_show").text(data.patentName);
                                $obj.find(".patentCode_show").text(data.patentCode);
                                $obj.find(".country_show").text(data.country);
                                $obj.find(".time07").text(time);
                            }else{
                                var html="";
                                html+= t.templete.returnList({
                                    patentName:data.patentName,
                                    patentCode:data.patentCode,
                                    country:data.country,
                                    time:time,
                                    id:rep.responseObject.responsePk
                                });
                                $(t.par+".patent_list_par").append(html);
                            }
                            t.clear();
                            $.topTip({mark:"success",showTime:"2",content:"发明专利保存成功！"});
                        }else{
                            $.topTip({mark:"warn",showTime:"2",content:"发明专利保存失败！"});
                        }
                    },
                    error:function(){}
                });
            });
        },
        del:function(){
            var t=this;
            $(t.par+".patent_delBtn").die("click").live("click",function(){
                if(confirm("确认删除?")) {
                    $(t.par+".patent_add").after($(t.par+".patent_edit"));
                    $obj = $(this).parents(".patent_list");
                    var paramJson = $.toJSON({id: $(this).attr("val")});
                    $.ajax({
                        type: "post",
                        url: t.path.delete,
                        data: {paramJson: paramJson},
                        dataType: "json",
                        success: function (rep) {
                            if (rep.responseObject.responseStatus) {
                                $obj.animate({height:0},200,function(){
                                    $obj.remove();
                                });
                                $.topTip({mark: "success", showTime:"2",content: "发明专利删除成功！"});
                            } else {
                                $.topTip({mark: "warn", showTime:"2",content: "发明专利删除失败！"});
                            }
                        },
                        error: function () {
                        }
                    });
                }
            });
        }
    };
    //语言能力
    var language = {};
    language = {
        //语言能力的接口
        path:{
            list:PC_CALL+"customer/language/json_list/",//获取语言能力列表
            info:PC_CALL+"customer/language/info/",//编辑
            create:PC_CALL+"customer/language/create/",//添加语言能力进入后的保存
            update:PC_CALL+"customer/language/update/",//编辑进入后的保存
            delete:PC_CALL+"customer/language/update/",//删除
            getLanguage:PC_CALL+"commdata/getLanguageList/",//语言能力
        },
        //语言能力列表项的模板
        templete:{
            returnList : function(options){
                var html="";
                html+='<div class="language_list p_c_title_bj_zl baseinfo_after_mr">'+
                    '<div class="language_show"><div class="p_c_title_bj_zl_l font_yahei layerNoMargin layerEngL">'+
                    '<div class="bj_d_bg layerEngM"></div>'+
                    '</div>'+
                    '<div class="p_c_title_bj_zl_r font_yahei">'+
                    '<div class="p_baseinfo_hospital languageName_show">'+options.languageName+'</div>'+
                    '<div class="p_baseinfo_hospital_zl"><span class="time07">'+options.time+'</span></div>'+
                    '</div>'+
                    '<div class="baseinfo_del"><a href="javascript:;" class="language_delBtn" val="'+options.id+'">删除</a></div>'+
                    '<div class="baseinfo_bj"><a href="javascript:;" class="language_editBtn" val="'+options.id+'">编辑</a></div>'+
                    '<div class="clear"></div>'+
                    '</div></div>';
                return html;
            }
        },
        //语言能力的初始化
        init:function(obj){
            var t=this;
            this.par=obj.type=="ch"?"#ch_resume ":"#en_resume ";
//          ymd({
//              year:$(t.par+".patYear"),
//          });
            this.customerId=$("#sesCustomerId").val();
            this.getLanList();
            this.mouse();
            this.getLanguage();
            this.bindEdit();
            this.cancel();
            this.create();
            this.save();
            this.del();
            this.lanChange();
        },
        //语言证明select添加change事件
        lanChange:function () {
            var t =this;
            $(t.par+".languageName").hide();
            $(t.par+".language").on("change",function () {
                if ($(this).val() == "Other") {
                    $(t.par+".languageName").show();
                }  else {
                    $(t.par+".languageName").hide();
                }
            })
        },
        //获取列表
        getLanList:function(){
            var t=this;
            $.ajax({
                type : "post",
                url : t.path.list,
                data:{paramJson: $.toJSON({customerId:$("#sesCustomerId").val(),dataFlag:2,languageFlag:languageFlag})},
                dataType : "json",
                success : function(data){
                    var html="";
                    if(data.responseObject&&data.responseObject.length>0) {
                        var list = data.responseObject;
                        $.each(list,function(i,val){
                            time=val.awardYear;
                            html+= t.templete.returnList({
                                languageName:val.languageName,
                                time:time,
                                id:val.id
                            });
                        })
                    };
                    $(t.par+".language_list_par").html(html);
                },
                error:function(){}
            });
        },
        //列表移入移出
        mouse:function(){
            var t=this;
            $(t.par+".language_list").live("mouseover",function(){
                $(this).addClass("baseinfo_after_hover");
            });
            $(t.par+".language_list").live("mouseout",function(){
                $(this).removeClass("baseinfo_after_hover");
            });
        },
        //添加语言能力按钮
        create:function(){
            var t=this;
            $(t.par+".language_add").on("click",function(){
                $(this).after($(t.par+".language_edit"));
                $(t.par+".language_edit").show();
                $(this).hide();
                $(t.par+".language_list").die("mouseover");
            })
        },
        //获取语言证明列表
        getLanguage:function(){
            var t=this;
            $.ajax({
                type: "POST",
                url:  t.path.getLanguage,
                data:{treeLevel:1,pageIndex:1,pageSize:500},
                dataType: "json",
                async: false,
                success: function(data){
                    var html="";
                    if(data){
                        $.each(data,function(i,val){
                            html+="<option value='"+val.languageNameEn+"' data-id='"+val.id+"'>"+val.languageNameEn+"</option>"
                        })
                        $(t.par+".language").append(html);
                    }
                },
                error:function () {
                    //console.log("出错了");
                }
            });
        },
        //取消按钮
        cancel:function(){
            var t=this;
            $(t.par+".language_cancel").on("click",function(){
                t.clear();
                //事件埋点
                comm.creatEvent({
                    triggerType:"全站功能按钮点击",
                    keyword:"语言能力修改取消",
                    actionId:45
                });
                return false;
            })
        },
        clear:function(){
            var t=this;
            this.par="#en_resume ";
            this.mouse();
            $(t.par+".language_add").show();
            $(t.par+".language_edit").hide();
            $(t.par+".language_show").show();
            $(t.par+".languageId").val("");
            $(t.par+".language_edit input").val("").hide();
            $(t.par+".language_edit input").parent().removeClass("baseinfo_error_red");
            $(".error_red_icon",t.par+".language_edit").hide();
            $(t.par+".language_edit select").each(function(i,em){
                $("option",em).eq(0).attr("selected",true);
            })
        },
        //保存按钮
        save:function(){
            var t=this;
            $(t.par+".language_save").die("click").live("click",function(){
                var data={};
                $obj=$(this).parents(".language_list");
                var id=$(t.par+".languageId").val();
                if(!id){//添加
                    data.customerId=t.customerId;
                }else{//修改
                    data.id=id;
                }
                var languageName=$(t.par+".languageName").val();
                var language=$(t.par+".language option:selected").val();
                var awardYear=$(t.par+".language_edit .patYear option:selected").val();
                data.awardYear=$(t.par+".language_edit .patYear option:selected").val();
                data.languageId = $(t.par+".language option:selected").data("id");
                data.languageFlag=languageFlag;
                var isSuccess=1;
                //验证
                if(!$.trim(languageName) && "Other" == language){
                    $(t.par+".languageName").parent().addClass("baseinfo_error_red");
                    $(t.par+".languageName").parent().next().show().text("请填写语言证明！");
                    isSuccess=0;
                }
//			   	else if(comm.getByteLen(data.patentName)>200){
//			       	$(t.par+".patentName").parent().addClass("baseinfo_error_red");
//			   	$(t.par+".patentName").parent().next().show().text("最长100个中文或200个英文！");
//			       	isSuccess=0;
//			   	}else{
//			       	$(t.par+".patentName").parent().removeClass("baseinfo_error_red");
//			   	$(t.par+".patentName").parent().next().hide();
//			   	};
                // if(!$.trim(data.patentCode)){
                //     $(t.par+".patentCode").parent().addClass("baseinfo_error_red");
                //     $(t.par+".patentCode").parent().next().show().text("请填写专利编号！");
                //     isSuccess=0;
                // }else if(!(/[a-zA-Z0-9]{1,200}$/.test(data.patentCode))){
                //     $(t.par+".patentCode").parent().addClass("baseinfo_error_red");
                //     $(t.par+".patentCode").parent().next().show().text("请填写正确的专利编号！");
                //     isSuccess=0;
                // }else if(comm.getByteLen(data.patentCode)>200){
                //     $(t.par+".patentCode").parent().addClass("baseinfo_error_red");
                //     $(t.par+".patentCode").parent().next().show().text("最长200个字符！");
                //     isSuccess=0;
                // }else{
                //     $(t.par+".patentCode").parent().removeClass("baseinfo_error_red");
                //     $(t.par+".patentCode").parent().next().hide();
                // };
                //
                if(isSuccess==0){
                    return;
                }
                if ("Other" == language) {
                    data.languageName = languageName;
                } else {
                    data.languageName = language;
                }
                $(t.par+".language_edit").mask("");
                var paramJson=$.toJSON(data);
                $.ajax({
                    type : "post",
                    url : id? t.path.update: t.path.create,
                    data : {paramJson:paramJson},
                    dataType : "json",
                    success : function(rep){
                        $(t.par+".language_edit").unmask("");
                        if(rep.responseObject.responseStatus){
                            if(id){
                                // $obj.find(".patentName_show").text(data.patentName);
                                // $obj.find(".patentCode_show").text(data.patentCode);
                                $obj.find(".languageName_show").text(data.languageName);
                                $obj.find(".time07").text(awardYear);
                            }else{
                                var html="";
                                html+= t.templete.returnList({
                                    languageName:data.languageName,
                                    time:awardYear,
                                    id:rep.responseObject.responsePk
                                });
                                $(t.par+".language_list_par").append(html);
                            }
                            t.clear();
                            $.topTip({mark:"success",showTime:"2",content:"语言能力保存成功！"});
                        }else{
                            $.topTip({mark:"warn",showTime:"2",content:"语言能力保存失败！"});
                        }
                    },
                    error:function(){}
                });
            });
        },
        //编辑按钮
        bindEdit:function(){
            var t=this;
            $(t.par+".language_editBtn").die("click").live("click",function(){
                var parent=$(this).parents(".language_list");
                $(t.par+".language_add").hide();
                $(t.par+".language_edit").show().appendTo(parent);
                $(".language_show",parent).hide();
                $(t.par+".language_list").die("mouseover");
                var paramJson=$.toJSON({id:$(this).attr("val")});
                $.ajax({
                    type : "post",
                    url : t.path.info,
                    data : {paramJson:paramJson},
                    dataType : "json",
                    success : function(rep){
                        if(rep&&rep.responseObject){
                            var data=rep.responseObject;
                            $(t.par+".languageId").val(data.id);//给修改添加id
                            var patYear=data.awardYear;
                            gettime($(t.par+".patYear"),patYear);
                            var flag = 1;
                            $.each($(t.par+".language option"),function(i,em){
                                if($(em).val()==data.languageName){
                                    $(em).attr("selected",true);
                                    flag = 0;
                                }
                            });
                            if (flag) {
                                $(t.par+".language option:last-child").attr("selected",true);
                                $(t.par+".languageName").show().val(data.languageName).focus();
                            }
                        }
                    },
                    error:function(){}
                });
            })
        },
        //删除按钮
        del:function(){
            var t=this;
            $(t.par+".language_delBtn").die("click").live("click",function(){
                if(confirm("确认删除?")) {
                    $(t.par+".language_add").after($(t.par+".language_edit"));
                    $obj = $(this).parents(".language_list");
                    var paramJson = $.toJSON({id: $(this).attr("val"),isValid: "0"});
                    $.ajax({
                        type: "post",
                        url: t.path.delete,
                        data: {paramJson: paramJson},
                        dataType: "json",
                        success: function (rep) {
                            if (rep.responseObject.responseStatus) {
                                $obj.animate({height:0},200,function(){
                                    $obj.remove();
                                });
                                $.topTip({mark: "success", showTime:"2",content: "语言能力删除成功！"});
                            } else {
                                $.topTip({mark: "warn", showTime:"2",content: "语言能力删除失败！"});
                            }
                        },
                        error: function () {
                        }
                    });
                }
            });
        }
    };
    controller.init(obj);
}
