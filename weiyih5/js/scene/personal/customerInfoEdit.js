/**
 * 功能描述：  资料编辑
 * 使用方法:
 * 注意事件：
 * 引入来源：  作用：
 *
 * Created by LiChunHui on 2016/8/15.
 */
$(function() {
    //user.privLogin(); //未登录跳转
    var customerInfoEdit = {
        path: {
            customerInfo: M_CALL + "customer/unite/json_list/", //客户信息
            //updateInfo: M_CALL + "customer/unite/update/", //修改信息
            updateInfo: M_CALL+"customer/baseinfo/updateCustomerBaseinfo/",
            saveAuth: M_CALL + "customer/auth/createAuth/", //修改非认证用户
            updateAuth: M_CALL + "customer/unite/update2/", //修改认证用户
            getAreas: M_CALL + "comm/data/tag/json_list/", //专业领域的数据
            occList: M_CALL + "customer/occupation/json_list/", //工作经历
            eduList: M_CALL + "customer/education/json_list/", //教育背景
            cEduList: M_CALL + "customer/continue/education/json_list/", //继续教育
            honorList: M_CALL + "customer/honor/json_list/", //获得荣誉
            fundList: M_CALL + "customer/fund/json_list/", //科研基金
            socialList: M_CALL + "customer/social/json_list/", //社会任职
            opusList: M_CALL + "customer/opus/json_list/", //学术专著
            patentList: M_CALL + "customer/patent/json_list/", //发明专利
            createAddress:M_CALL+"customer/address/create/",    //  创建地址
            updateAddress:M_CALL+"customer/address/update/"     //更新地址
        },
        init: function() {
            this.customerId = TempCache.getItem("userId");
            this.getInitPage();
            this.editSummary();
            this.editAddress();
            this.getOccupation();
            this.getEducation();
            this.getcEdu();
            this.getHonor();
            this.getFund();
            this.getSocial();
            this.getOpus();
            this.getPatent();
            this.digHole();
        },
        //埋点
        digHole:function(){
            $('.ev_digHole').click(function(){
                comm.creatEvent({
                    triggerType:'全站功能按钮点击',
                    keyword:"返回",
                    actionId:41,
                    async:false
                });
            });
        },
        //初始化个人信
        getInitPage: function() {
            comm.loading.show();
            var t = this;
            var data = {};
            data.customerId = this.customerId;
            data.dataFlag = 3;
            data.logoUseFlag = 4;
            data.pageIndex = 1;
            data.pageSize = 1;
            data.useFlag = 1;
            $.ajax({
                type: "post",
                url: t.path.customerInfo,
                data: data,
                dataType: "json",
                //async:false,
                success: function(rep) {
                    comm.loading.hide();
                    if (rep && rep.responseObject.responseData && rep.responseObject.responseData.data_list) {
                        if (rep.responseObject.responseData.data_list.length > 0) {
                            responseData = rep.responseObject.responseData.data_list[0];
                            var unit = responseData.customer_unite;
                            var baseInfo = responseData.customer_baseinfo;
                            var c_address = responseData.customer_address;
                            var auth = responseData.customer_auth;
                            if (baseInfo.summary) {
                                $("#summary").css("color", "#333");
                                $("#summary").text(comm.getStrLen(baseInfo.summary, 124));
                                $("#summaryIn").val(baseInfo.summary);
                            } else {
                                $("#summary").css("color", "#aaa");
                            }
                            if(c_address.addressFull){
                                $("#address").css("color", "#333")
                                        .text(c_address.addressFull)
                                        .attr("addId",c_address.customerAId);
                                $("#addressIn").val(c_address.addressFull);
                            }else{
                                $("#address").css("color", "#aaa");
                            }
                            if (auth.state != 1 && auth.state != 2) { //未认证
                                $(".ev-noAuth").show();
                                $(".ev-btn").show().text("完成");
                                $("#fullName").val(comm.getStrLen((auth.lastName + auth.firstName),30)).attr('fullname',(auth.lastName+auth.firstName));
                                $("#fullName").on('change input propertyChange',function(){
                                    $(this).attr('fullname',$(this).val());
                                }).on('blur',function(){
                                    $(this).attr('fullname',$(this).val()).val(comm.getStrLen($(this).val(),30));
                                });
                                if(auth.platformId==1){
                                    $('#platform').text('骨科').attr('platformId',1);
                                }else if(auth.platformId==2){
                                    $('#platform').text('手外科').attr('platformId',2);
                                }
                                $("#sexId option").each(function(i, em) {
                                    if ($(em).val() == baseInfo.sexId) {
                                        $("#sexId option").removeAttr("selected");
                                        $(em).attr("selected", "selected");
                                        $("#sexId").css("color", "#333");
                                        return;
                                    }
                                });
                                $("#sexId").on("change", function() {
                                    if ($("#sexId option:selected").val()) {
                                        $("#sexId").css("color", "#333");
                                    } else {
                                        $("#sexId").css("color", "#aaa");
                                    }
                                });

                                //未认证临床时间
                                ymd({
                                    year:$('#noauth_clinicalYear'),
                                    month:$('#noauth_clinicalMonth'),
                                    default1:1,
                                    defaultVal:"请选择临床时间"
                                });
                                if(auth.clinicalYear){
                                    gettime($('#noauth_clinicalYear'),auth.clinicalYear.substring(0,4),1);
                                    gettime($('#noauth_clinicalMonth'),auth.clinicalYear.substring(5,7),1);
                                    $('#noauth_clinicalYear,#noauth_clinicalMonth,.ev-clinicalTime span').css('color','#333');
                                }else{
                                    gettime($('#noauth_clinicalYear'),'请选择临床时间',1);
                                    gettime($('#noauth_clinicalMonth'),'请选择临床时间',1);
                                    $('#noauth_clinicalYear,#noauth_clinicalMonth,.ev-clinicalTime span').css('color','#aaa');
                                }



                                module.medicalTitle({ //职称
                                    container: $("#medicalTitle")
                                });
                                var medical = auth.medicalTitle;
                                var medical1 = medical ? medical.split(",") : [];
                                var ids = [];
                                $.each(medical1, function(i, val) {
                                    if (val) {
                                        if (val.split("_")[1]) {
                                            ids.push(val.split("_")[0]);
                                        }
                                    }
                                });
                                $(".ev-medBox figcaption").each(function(i, em) {
                                    $.each(ids, function(j, val) {
                                        if ($(em).attr("medicalid") == val) {
                                            $(em).parent().attr("select", "yes");
                                            $(em).parent().addClass("selected");
                                        }
                                    });
                                });
                                t.platform();
                                t.company();
                                t.areaExpertise(); //专业领域
                                var area = auth.areasExpertise;
                                var area1 = area ? area.split(",") : [];
                                var areaIds = [];
                                $.each(area1, function(i, val) {
                                    if (val) {
                                        if (val.split("_")[1]) {
                                            areaIds.push(val.split("_")[0]);
                                        }
                                    }
                                });
                                $(".ev-areasCon figcaption").each(function(i, em) {
                                    $.each(areaIds, function(j, val) {
                                        if ($(em).attr("tagid") == val) {
                                            $(em).parent().attr("select", "yes");
                                            $(em).parent().addClass("selected");
                                        }
                                    });
                                });
                                //生日
                                ymd({
                                    year: $("#year"),
                                    month: $("#month"),
                                    day: $("#day"),
                                    default1:1
                                });
                                if (baseInfo.birthday&&!$.isEmptyObject(baseInfo.birthday)) {
                                    $(".ev-noAuthBirth select").css("color", "#333");
                                    $(".ev-noAuthBirth span").css("color", "#333");
                                    gettime($("#year"), baseInfo.birthday.substring(0, 4),1);
                                    gettime($("#month"), baseInfo.birthday.substring(5, 7),1);
                                    gettime($("#day"), baseInfo.birthday.substring(8, 10),1);
                                }
                                if (auth.medicalTitle) {
                                    $("#medicalTitle").css("color", "#333");
                                    $("#medicalTitle").attr("medicalTitle", auth.medicalTitle).text(comm.getStrLen(comm.cutLine(auth.medicalTitle, "_", "，"),30));
                                }
                                if (auth.workplace) {
                                    $("#company").css("color", "#333");
                                    $("#company").attr("company", auth.workplace).text(comm.getStrLen(auth.workplace,30));
                                }
                                if (auth.areasExpertise) {
                                    $("#areaExpertise").css("color", "#333");
                                    $("#areaExpertise").attr("areasExpertise", auth.areasExpertise).text(comm.getStrLen(comm.cutLine(auth.areasExpertise, "_", "，"),30));
                                }

                                t.noAuthSave();
                                t.clinicalYearChange();
                            } else { //已认证
                                $(".ev-btn").show().removeClass('btn-primary').text("认证信息");
                                $(".ev-btn").attr("href", "/pages/personal/authInfo.html");
                                if(auth.platformId==1){
                                    $('#platform01').text('骨科').attr('platformId',1);
                                }else if(auth.platformId==2){
                                    $('#platform01').text('手外科').attr('platformId',2);
                                }
                                $(".ev-hasAuth").show();
                                $("#trueName01").css("color", "#333").text(comm.getStrLen((auth.lastName + auth.firstName),30));
                                $("#sexId01 option").each(function(i, em) {
                                    if ($(em).val() == baseInfo.sexId) {
                                        $("#sexId01 option").removeAttr("selected");
                                        $(em).attr("selected", "selected");
                                        $("#sexId01").css("color", "#333");
                                        return;
                                    }
                                });
                                ymd({
                                    year: $("#year01"),
                                    month: $("#month01"),
                                    day: $("#day01"),
                                    default1:1
                                });
                                var birthYear = "";
                                if(baseInfo.birthday){
                                    birthYear = baseInfo.birthday;
                                }else if(auth.birthYear){
                                    birthYear = auth.birthYear;
                                }
                                if (birthYear) {
                                    $(".ev-birthDay select").css("color", "#333");
                                    $(".ev-birthDay span").css("color", "#333");
                                    gettime($("#year01"), birthYear.substring(0, 4),1);
                                    gettime($("#month01"), birthYear.substring(5, 7),1);
                                    gettime($("#day01"), birthYear.substring(8, 10),1);
                                }
                                if (auth.medicalTitle) {
                                    $("#medicalTitle01").css("color", "#333");
                                }
                                if (auth.company) {
                                    $("#company01").css("color", "#333");
                                }
                                if (auth.areasExpertise) {
                                    $("#areaExpertise01").css("color", "#333");
                                }
                                $("#medicalTitle01").text(comm.getStrLen(comm.cutLine(auth.medicalTitle, "_", "，"),30));

                                $("#company01").text(comm.getStrLen(auth.workplace,30));
                                $("#areaExpertise01").text(comm.getStrLen(comm.cutLine(auth.areasExpertise, "_", "，"),30));
                                //临床时间  如有临床时间直接显示，没有可以选择保存
                                if(auth.clinicalYear){
                                    $('.ev-clinicalTime article').html('<span>'+auth.clinicalYear+'&nbsp;&nbsp;——至今</span>');
                                    $('.ev-clinicalTime span').css('color','#333');
                                }else{
                                    ymd({
                                        year:$('#auth_clinicalYear'),
                                        month:$('#auth_clinicalMonth'),
                                        default1:1,
                                        defaultVal:"请选择临床时间"
                                    });
                                    gettime($('#auth_clinicalYear'),'请选择临床时间',1);
                                    gettime($('#auth_clinicalMonth'),'请选择临床时间',1);
                                    $('#auth_clinicalYear,#auth_clinicalMonth').css("color", "#aaa");
                                    t.saveClinicalYear();
                                }
                                t.saveSex();
                                t.saveBirthDay();
                            }
                        }
                    }
                },
                error: function() {}
            });

        },
        //未认证时保存基本信息
        noAuthSave: function() {
            var t = this;

            $(".ev-btn").on("click", function() {
                var data = {};
                data.customerId = t.customerId;
                data.opflag = 1;
                data.fullName = $("#fullName").attr('fullname');
                data.sexId = $("#sexId option:selected").val();
                data.sex = $("#sexId option:selected").text();
                data.birthday = $("#year option:selected").val() + "-" + $("#month option:selected").val() + "-" + $("#day option:selected").val();
                data.medicalTitle = $("#medicalTitle").attr("medicalTitle");
                data.platformId = $('#platform').attr('platformId')
                if($('#company').attr('school')&&$('#company').attr('school')!=""){
                    data.schoolName = $('#company').attr('school');
                    data.schoolId = $('#company').attr('companyId');
                }else{
                    data.company = $("#company").attr("company");
                    data.companyId = $('#company').attr('companyId');
                }

                data.areasExpertise = $("#areaExpertise").attr("areasExpertise");
                data.clinicalYear = "";
                if($('#noauth_clinicalYear option:selected').val()!="请选择临床时间"&&$('#noauth_clinicalMonth option:selected').val()!="请选择临床时间"){
                    data.clinicalYear = $('#noauth_clinicalYear option:selected').val()+"-"+$('#noauth_clinicalMonth option:selected').val()+"-01";
                }

                if (!data.fullName) {
                    popup("请填写姓名");
                    return;
                }
                if (!data.sexId) {
                    popup("请选择性别");
                    return;
                }
                if(!$("#year option:selected").val()||!$("#month option:selected").val()||!$("#day option:selected").val()){
                    popup("请选择出生年月");
                    return;
                }
                if (!data.medicalTitle) {
                    popup("请选择职称");
                    return;
                }
                if (!(data.company||data.schoolName)) {
                    popup("请选择单位");
                    return;
                }
                if (!data.areasExpertise) {
                    popup("请选择专业领域");
                    return;
                }
                if(!data.clinicalYear){
                    popup("请选择临床时间");
                    return;
                }
                comm.loading.show();
                var rep = CommService.execute(t.path.saveAuth, data);
                comm.loading.hide();
                if (rep && rep.responseStatus) {
                    popup("保存成功");
                } else {
                    popup(rep.responseMessage)
                    //popup("保存失败");
                }
            })
        },
        //性别
        saveSex: function() {
            var t = this;
            $("#sexId01").on("change", function() {
                comm.loading.show();
                var data = {};
                data.customerId = t.customerId;
                data.sexId = $("#sexId01 option:selected").val();
                data.sex = $("#sexId01 option:selected").text();
                if (!data.sexId) {
                    $(this).css("color", "#aaa");
                } else {
                    $(this).css("color", "#333");
                }
                var rep = CommService.execute(t.path.updateInfo, data);
                comm.loading.hide();
                if (rep && rep.responseStatus) {
                    //popup("保存成功");
                } else {
                    popup("保存失败");
                }
            });
        },
        //生日
        saveBirthDay: function() {
            var t = this;
            $(".ev-birthDay select").on("change", function() {
                if ($("#year01 option:selected").val().length === 0) {
                    $(".ev-birthDay").find('span,select').css("color", "#aaa");
                } else {
                    $(".ev-birthDay").find('span,select').css("color", "#333");
                }
                comm.loading.show();
                var data = {};
                data.customerId = t.customerId;
                data.birthday = $("#year01 option:selected").val() + "-" + $("#month01 option:selected").val() + "-" + $("#day01 option:selected").val();
                var rep = CommService.execute(t.path.updateInfo, data);
                comm.loading.hide();
                if (rep && rep.responseStatus) {
                    //popup("保存成功");
                } else {
                    popup("保存失败");
                }
            });
        },
        clinicalYearChange:function(){
            var t = this;
            var val1="",val2="",sel1 = false, sel2 = false;
            $(".ev-clinicalTime select").on("change", function() {
                val1 = $("#noauth_clinicalYear option:selected").val();
                val2 = $("#noauth_clinicalMonth option:selected").val();
                sel1 = (val1 !="请选择临床时间");
                sel2 = (val2!="请选择临床时间");
                if(sel1){
                    $("#noauth_clinicalYear").css('color','#333');
                }else{
                    $("#noauth_clinicalYear").css('color','#aaa');
                }
                if(sel2){
                    $("#noauth_clinicalMonth").css('color','#333');
                }else{
                    $("#noauth_clinicalMonth").css('color','#aaa');
                }

            });
        },
        //w保存临床时间
        saveClinicalYear:function(){
            var t = this;
            var val1="",val2="",sel1 = false, sel2 = false;
            $(".ev-clinicalTime select").on("change", function() {
                val1 = $("#auth_clinicalYear option:selected").val();
                val2 = $("#auth_clinicalMonth option:selected").val();
                sel1 = (val1 !="请选择临床时间");
                sel2 = (val2!="请选择临床时间");
                if(sel1){
                    $("#auth_clinicalYear").css('color','#333');
                }else{
                    $("#auth_clinicalYear").css('color','#aaa');
                }
                if(sel2){
                    $("#auth_clinicalMonth").css('color','#333');
                }else{
                    $("#auth_clinicalMonth").css('color','#aaa');
                }
                if(sel1&&sel2){
                    $(".ev-clinicalTime").find('span,select').css("color", "#333");
                    comm.loading.show();
                    var data = {};
                    data.customerId = t.customerId;
                    data.clinicalYear = val1 + "-" + val2+"-01";
                    var rep = CommService.execute(t.path.updateAuth, data);
                    comm.loading.hide();
                    if (rep && rep.responseStatus) {
                        $(".ev-clinicalTime article").html('<span>'+val1+"-"+val2+"-至今</span>").css("color", "#333");
                    } else {
                        popup("保存失败");
                    }
                }

            });
        },
        platform:function(){
            var t=this;
            $("#platform").parents("article").on("click", function() {
                $('#platFormSelect').addClass('on');
            });
            $('.ev_bone').on('click',function(){
                $('#platform').text($(this).text()).attr('platformId',1);
                $('#platFormSelect').removeClass('on');
                t.areaExpertise();
            });
            $('.ev_hand').on('click',function(){
                $('#platform').text($(this).text()).attr('platformId',2);
                $('#platFormSelect').removeClass('on');
                t.areaExpertise();
            });
            $('#ev-platformCancel').click(function(){
                comm.creatEvent({
                    triggerType:'全站功能按钮点击',
                    keyword:'科室修改取消',
                    actionId:45
                });
                $('#platFormSelect').removeClass('on');
            });
        },
        company: function() {
            $("#company").parents("article").on("click", function() {
                $('#backMask').addClass('on');
            });
            $('.ev_hospital').on('click',function(){
                $('.ev-sProvince').show();
                $(".ev-mainInner").hide();
                $(".ev-companyInner").show();
                $('#backMask').removeClass('on');
                $(".al-noResult").hide();
                module.addCompany({
                    container:$('#company'),
                    fn:function(){
                        $('#company').attr('school',"");
                    }
                });
            });
            $('.ev_school').on('click',function(){

                $(".ev-mainInner").hide();
                $(".ev-schoolInner").show();
                $('#backMask').removeClass('on');
                $(".al-noResult").hide();
                module.addSchool({
                    container:$('#company'),
                    fn:function(){
                        $('#company').attr('company',"");
                    }
                });
            });
            $('#EV-cancelSelect').click(function(){
                comm.creatEvent({
                    triggerType:'全站功能按钮点击',
                    keyword:'单位修改取消',
                    actionId:45
                });
                $('#backMask').removeClass('on');
            });
        },
        areaExpertise: function() {
            $("#areaExpertise").parents("article").on("click", function() {
                Log.createBrowse(149,"专业选择页");
                $(".ev-mainInner").hide();
                $(".ev-areaInner").show();
                $(".ev-areasCon").css('marginTop','0!important');
                $(".ev-areasCon").parent().css('margin',0);
            });
            $(".ev-goBack").on("click", function() {
                comm.creatEvent({
                    triggerType:'全站功能按钮点击',
                    keyword:'专业领域修改取消',
                    actionId:45
                });
                setTimeout(function() {
                    $(".ev-mainInner").show();
                    $(".ev-areaInner").hide();
                }, 500);
            });
            this.getAreas();
        },
        //数据初始化
        getAreas: function() {
            var t = this;
            var html = "";
            var data = {};
            data.treeLevel = 2;
            data.pageIndex = 1;
            data.pageSize = 100;
            data.platformId = $('#platform').attr('platformId');
            $.ajax({
                url: t.path.getAreas,
                data: data,
                dataType: "json",
                async: false,
                success: function(rep) {
                    if (rep && rep.responseObject.responseStatus) {
                        $.each(rep.responseObject.responseData.data_list, function(i, val) {
                            html += '<section class="al-selectorBarItem" select="no">' +
                                '<figure class="al-selectorBarItemIcon"></figure>' +
                                '<figcaption class="al-selectorBarItemName" tagid="' + val.id + '">' + val.tagName + '</figcaption>' +
                                '</section>';
                        });
                    }
                    $(".ev-areasCon").html(html);
                    t.selectTag();
                    t.saveAreaExp();
                }
            });
        },
        //数据的选择
        selectTag: function() {
            $.each($(".ev-areasCon section"), function(i, em) {
                $(em).on("click", function() {
                    if ($(em).attr("select") == "no") {
                        $(em).attr("select", "yes");
                        $(this).addClass("selected");
                    } else {
                        $(em).attr("select", "no");
                        $(this).removeClass("selected");
                    }
                });
            })
        },
        //保存专业领域
        saveAreaExp: function() {
            var t = this;
            $(".ev-areasSave").on("click", function() {
                var html = "";
                var str = "";
                $.each($(".ev-areasCon section"), function(i, em) {
                    if ($(em).attr("select") == "yes") {
                        html += $("figcaption", $(em)).text() + "，";
                        str += $("figcaption", $(em)).attr("tagid") + "_" + $("figcaption", $(em)).text() + ",";
                    }
                })
                $("#areaExpertise").text(comm.getStrLen(html.substring(0, html.length - 1),30));
                $("#areaExpertise").attr("areasExpertise", str.substring(0, str.length - 1));
                if (html) {
                    $("#areaExpertise").css("color", "#333");
                } else {
                    $("#areaExpertise").css("color", "#aaa").text("请选择专业领域");
                };
                $(".ev-mainInner").show();
                $(".ev-areaInner").hide();
            });
        },
        //编辑简介
        editSummary: function() {
            $("#summary").on("click", function() {
                $(".ev-mainInner").hide();
                $(".ev-summaryInner").show();
            });
            $(".ev-backToMain").on("click", function() {
                comm.creatEvent({
                    triggerType:'全站功能按钮点击',
                    keyword:'个人简介修改取消',
                    actionId:45
                });
                setTimeout(function() {
                    $(".ev-mainInner").show();
                    $(".ev-summaryInner").hide();
                }, 500);

            });
            $("#summaryIn").on("keyup", function() {
                if ($(this).val().length === 0) {
                    $("#saveSummary").addClass('al-msgWriting');
                } else {
                    $("#saveSummary").removeClass('al-msgWriting');
                }
            });
            this.saveSummary();
        },
        //保存简介
        saveSummary: function() {
            var t = this;
            $("#saveSummary").on("click", function() {
                if ($("#summaryIn").val()) {
                    var data = {};
                    data.customerId = t.customerId;
                    data.summary = $("#summaryIn").val();
                    var param = {};
                    param.paramJson = $.toJSON(data);
                    comm.loading.show();
                    $.ajax({
                        type: "post",
                        url: t.path.updateInfo,
                        data: param,
                        dataType: "json",
                        success: function(rep) {
                            comm.loading.hide();
                            if (rep && rep.responseObject.responseStatus) {
                                $(".ev-mainInner").show();
                                $(".ev-summaryInner").hide();
                                if (data.summary) {
                                    $("#summary").css("color", "#333");
                                    $("#summary").text(comm.getStrLen(data.summary, 124));
                                } else {
                                    $("#summary").css("color", "#aaa");
                                }
                                popup("保存成功");
                            } else {
                                popup("保存失败");
                            }
                        },
                        error: function() {}
                    });
                }
            })
        },
        //编辑地址
        editAddress: function() {
            $("#address").on("click", function() {
                $(".ev-mainInner").hide();
                $(".ev-addressInner").show();
            });
            $(".ev-backToMain").on("click", function() {
                comm.creatEvent({
                    triggerType:'全站功能按钮点击',
                    keyword:'通讯地址修改取消',
                    actionId:45
                });
                setTimeout(function() {
                    $(".ev-mainInner").show();
                    $(".ev-addressInner").hide();
                }, 500);

            });
            $("#addressIn").on("keyup", function() {
                if ($(this).val().length === 0) {
                    $("#saveAddress").addClass('al-msgWriting');
                } else {
                    $("#saveAddress").removeClass('al-msgWriting');
                }
            });
            var setSug=$("#addressIn");
            comm.textChange({'$tex':setSug,'$num':$("#Ev-settingSugNum"),'noTop':0,maxTop:0});
            setSug.on('focus',function(){
                $("#Ev-settingSugNum").show().html(100-parseInt(comm.getByteLen(setSug.val())));
            }).on('blur',function(){
                $("#Ev-settingSugNum").hide();
            });
            this.saveAddress();
        },
        //保存地址
        saveAddress: function() {
            var t = this;

            $("#saveAddress").on("click", function() {
                if ($("#addressIn").val()) {
                    var data = {};
                    data.customerId = t.customerId;
                    data.addressFull = $("#addressIn").val();
                    data.visitSiteId =2;
                    var addId = $('#address').attr('addId');
                    if(addId){
                        data.id = addId;
                    }
                    var param = {};
                    param.paramJson = $.toJSON(data);
                    comm.loading.show();
                    $.ajax({
                        type: "get",
                        url: addId?t.path.updateAddress:t.path.createAddress,
                        data: param,
                        dataType: "json",
                        success: function(rep) {
                            comm.loading.hide();
                            if (rep && rep.responseObject.responseStatus) {
                                $(".ev-mainInner").show();
                                $(".ev-addressInner").hide();
                                if (data.addressFull) {
                                    $("#address").css("color", "#333");
                                    $("#address").text(data.addressFull);
                                } else {
                                    $("#address").css("color", "#aaa");
                                }
                                popup("保存成功");
                            } else {
                                popup("保存失败");
                            }
                        },
                        error: function() {
                            comm.loading.hide();
                        }
                    });
                }
            })
        },
        //工作经历列表
        getOccupation: function() {
            var t = this;
            var html = "";
            var data = {};
            data.customerId = this.customerId;
            data.languageFlag = 0;
            data.pageIndex = 1;
            data.pageSize = 100;
            $.ajax({
                type: 'POST',
                url: t.path.occList,
                data: data,
                dataType: "json",
                success: function callback(rep) {
                    if (rep && rep.responseObject.responseData) {
                        if (rep.responseObject.responseData.data_list && rep.responseObject.responseData.data_list.length > 0) {
                            var rows = rep.responseObject.responseData.data_list;
                            $.each(rows, function(i, val) {
                                var sYear = val.startTime.substring(0, 4);
                                var sMonth = val.startTime.substring(5, 7);
                                var sDay = val.startTime.substring(8, 10);
                                if (val.upNow == 1) {
                                    time = sYear + '/' + sMonth + '-至今';
                                } else {
                                    var eYear = val.endTime.substring(0, 4);
                                    var eMonth = val.endTime.substring(5, 7);
                                    var eDay = val.endTime.substring(8, 10);
                                    time = sYear + '/' + sMonth + '-' + eYear + '/' + eMonth;
                                }
                                medicalTitle = "";
                                title = val.medicalTitle.indexOf(",") > 0 ? val.medicalTitle.split(",") : [val.medicalTitle];
                                $.each(title, function(j, n) {
                                    if (n) {
                                        medicalTitle += (n.split("_")[1] + "、");
                                    }
                                })
                                html += '<article class="al-tableModuleContent" occid=' + val.id + '>' +
                                    '<p>' + val.unit + ' ' + val.address + '</p>' +
                                    '<p>' + val.department + '</p>' +
                                    '<p>' + medicalTitle.substring(0, medicalTitle.length - 1) + '</p>' +
                                    '<span class="al-timeRange">' + time + '</span>' +
                                    '<button class="al-tableModuleContentConfigBtn icon-pencilDeepBlue"></button>' +
                                    '</article>';
                            });
                            $(".ev-occList").html(html);
                            $(".ev-occList article").on("click", function() {
                                var href = "/pages/personal/occupation.html?id=" + $(this).attr("occid");
                                g_sps.jump($(this),href);
                            });
                        }

                    }
                }
            });
        },
        //教育背景列表
        getEducation: function() {
            var t = this;
            var html = "";
            var data = {};
            data.customerId = this.customerId;
            data.languageFlag = 0;
            data.pageIndex = 1;
            data.pageSize = 100;
            $.ajax({
                type: 'POST',
                url: t.path.eduList,
                data: data,
                dataType: "json",
                success: function callback(rep) {
                    if (rep && rep.responseObject.responseData) {
                        if (rep.responseObject.responseData.data_list && rep.responseObject.responseData.data_list.length > 0) {
                            var rows = rep.responseObject.responseData.data_list;
                            $.each(rows, function(i, val) {
                                var sYear = val.startTime.substring(0, 4);
                                var sMonth = val.startTime.substring(5, 7);
                                var sDay = val.startTime.substring(8, 10);
                                if (val.upNow == 1) {
                                    time = sYear + '/' + sMonth + '-至今';
                                } else {
                                    var eYear = val.endTime.substring(0, 4);
                                    var eMonth = val.endTime.substring(5, 7);
                                    var eDay = val.endTime.substring(8, 10);
                                    time = sYear + '/' + sMonth + '-' + eYear + '/' + eMonth;
                                }
                                html += '<article class="al-tableModuleContent" eduid="' + val.id + '">' +
                                    '<p>' + (val.city ? val.city + ' ' : '') + val.university + '</p>' +
                                    '<p>' + (val.major ? val.major + ' ' : '') + val.education + '</p>' +
                                    '<span class="al-timeRange">' + time + '</span>' +
                                    '<button class="al-tableModuleContentConfigBtn icon-pencilDeepBlue"></button>' +
                                    '</article>';
                            });
                            $(".ev-eduList").html(html);
                            $(".ev-eduList article").on("click", function() {
                                var href = "/pages/personal/education.html?id=" + $(this).attr("eduid");
                                g_sps.jump($(this),href);
                            });
                        }

                    }
                }
            });
        },
        //继续教育列表
        getcEdu: function() {
            var t = this;
            var html = "";
            var data = {};
            data.customerId = this.customerId;
            data.languageFlag = 0;
            data.pageIndex = 1;
            data.pageSize = 100;
            $.ajax({
                type: 'POST',
                url: t.path.cEduList,
                data: data,
                dataType: "json",
                success: function callback(rep) {
                    if (rep && rep.responseObject.responseData) {
                        if (rep.responseObject.responseData.data_list && rep.responseObject.responseData.data_list.length > 0) {
                            var rows = rep.responseObject.responseData.data_list;
                            $.each(rows, function(i, val) {
                                var sYear = val.startTime.substring(0, 4);
                                var sMonth = val.startTime.substring(5, 7);
                                var sDay = val.startTime.substring(8, 10);
                                var eYear = val.endTime.substring(0, 4);
                                var eMonth = val.endTime.substring(5, 7);
                                var eDay = val.endTime.substring(8, 10);
                                var time = sYear + '/' + sMonth + '/' + sDay + '/-' + eYear + '/' + eMonth + '/' + eDay;
                                html += '<article class="al-tableModuleContent" cEduid="' + val.id + '">' +
                                    '<p>' + val.organization + '</p>' +
                                    '<p>' + val.cmeDesc + '</p>' +
                                    '<span class="al-timeRange">' + time + '</span>' +
                                    '<p>' + val.certificate + '</p>' +
                                    '<button class="al-tableModuleContentConfigBtn icon-pencilDeepBlue"></button>' +
                                    '</article>';
                            });
                            $(".ev-cEduList").html(html);
                            $(".ev-cEduList article").on("click", function() {
                                var href = "/pages/personal/cEducation.html?id=" + $(this).attr("cEduid");
                                g_sps.jump($(this),href);
                            });
                        }

                    }
                }
            });
        },
        //获得荣誉列表
        getHonor: function() {
            var t = this;
            var html = "";
            var data = {};
            data.customerId = this.customerId;
            data.languageFlag = 0;
            data.pageIndex = 1;
            data.pageSize = 100;
            $.ajax({
                type: 'POST',
                url: t.path.honorList,
                data: data,
                dataType: "json",
                success: function callback(rep) {
                    if (rep && rep.responseObject.responseData) {
                        if (rep.responseObject.responseData.data_list && rep.responseObject.responseData.data_list.length > 0) {
                            var rows = rep.responseObject.responseData.data_list;
                            $.each(rows, function(i, val) {
                                html += '<article class="al-tableModuleContent" honorid="' + val.id + '">' +
                                    '<p>' + val.honorName + '</p>' +
                                    '<p>' + val.awardDepartment + '</p>' +
                                    '<span class="al-timeRange">' + val.awardYear + '</span>' +
                                    '<button class="al-tableModuleContentConfigBtn icon-pencilDeepBlue"></button>' +
                                    '</article>';
                            });
                            $(".ev-honorList").html(html);
                            $(".ev-honorList article").on("click", function() {
                                var href = "/pages/personal/honor.html?id=" + $(this).attr("honorid");
                                g_sps.jump($(this),href);
                            });
                        }

                    }
                }
            });
        },
        //科研基金列表
        getFund: function() {
            var t = this;
            var html = "";
            var data = {};
            data.customerId = this.customerId;
            data.languageFlag = 0;
            data.pageIndex = 1;
            data.pageSize = 100;
            $.ajax({
                type: 'POST',
                url: t.path.fundList,
                data: data,
                dataType: "json",
                success: function callback(rep) {
                    if (rep && rep.responseObject.responseData) {
                        if (rep.responseObject.responseData.data_list && rep.responseObject.responseData.data_list.length > 0) {
                            var rows = rep.responseObject.responseData.data_list;
                            $.each(rows, function(i, val) {
                                html += '<article class="al-tableModuleContent" fundid="' + val.id + '">' +
                                    '<p>' + val.fundName + '</p>' +
                                    '<p>' + val.fundCode + '</p>' +
                                    '<span class="al-timeRange">' + val.approvalTime.substring(0, 4) + '</span>' +
                                    '<button class="al-tableModuleContentConfigBtn icon-pencilDeepBlue"></button>' +
                                    '</article>';
                            });
                            $(".ev-fundList").html(html);
                            $(".ev-fundList article").on("click", function() {
                                var href = "/pages/personal/fund.html?id=" + $(this).attr("fundid");
                                g_sps.jump($(this),href);
                            });
                        }
                    }
                }
            });
        },
        //社会任职列表
        getSocial: function() {
            var t = this;
            var html = "";
            var data = {};
            data.customerId = this.customerId;
            data.languageFlag = 0;
            data.pageIndex = 1;
            data.pageSize = 100;
            $.ajax({
                type: 'POST',
                url: t.path.socialList,
                data: data,
                dataType: "json",
                success: function callback(rep) {
                    if (rep && rep.responseObject.responseData) {
                        if (rep.responseObject.responseData.data_list && rep.responseObject.responseData.data_list.length > 0) {
                            var rows = rep.responseObject.responseData.data_list;
                            $.each(rows, function(i, val) {
                                var time = "";
                                if (val.upNow) {
                                    time = val.startTime.substring(0, 4) + '/' + val.startTime.substring(5, 7) + " ～ 至今";
                                } else {
                                    time = val.startTime.substring(0, 4) + '/' + val.startTime.substring(5, 7) + " ～ " + val.endTime.substring(0, 4) + '/' + val.endTime.substring(5, 7);
                                };
                                html += '<article class="al-tableModuleContent" socialid="' + val.id + '">' +
                                    '<p>' + val.organization + '</p>' +
                                    '<p>' + val.socialTitle + '</p>' +
                                    '<span class="al-timeRange">' + time + '</span>' +
                                    '<button class="al-tableModuleContentConfigBtn icon-pencilDeepBlue"></button>' +
                                    '</article>';
                            });
                            $(".ev-socialList").html(html);
                            $(".ev-socialList article").on("click", function() {
                                var href = "/pages/personal/social.html?id=" + $(this).attr("socialid");
                                g_sps.jump($(this),href);
                            });
                        }

                    }
                }
            });
        },
        //学术专著列表
        getOpus: function() {
            var t = this;
            var html = "";
            var data = {};
            data.customerId = this.customerId;
            data.languageFlag = 0;
            data.pageIndex = 1;
            data.pageSize = 100;
            $.ajax({
                type: 'POST',
                url: t.path.opusList,
                data: data,
                dataType: "json",
                success: function callback(rep) {
                    if (rep && rep.responseObject.responseData) {
                        if (rep.responseObject.responseData.data_list && rep.responseObject.responseData.data_list.length > 0) {
                            var rows = rep.responseObject.responseData.data_list;
                            $.each(rows, function(i, val) {
                                author = "";
                                switch (val.authorType) {
                                    case 1:
                                        author = "第一作者";
                                        break;
                                    case 2:
                                        author = "第一译者";
                                        break;
                                    case 3:
                                        author = "联合作者";
                                        break;
                                    case 4:
                                        author = "联合译者";
                                        break;
                                };
                                html += '<article class="al-tableModuleContent" opusid="' + val.id + '">' +
                                    '<p>' + val.opusName + '</p>' +
                                    '<p>' + author + '</p>' +
                                    '<p>' + val.publisher + '</p>' +
                                    '<span class="al-timeRange">' + val.publicationTime.substring(0, 4) + "/" + val.publicationTime.substring(5, 7) + '</span>' +
                                    '<p>' + val.information + '</p>' +
                                    '<button class="al-tableModuleContentConfigBtn icon-pencilDeepBlue"></button>' +
                                    '</article>';
                            });
                            $(".ev-opusList").html(html);
                            $(".ev-opusList article").on("click", function() {
                                var href = "/pages/personal/opus.html?id=" + $(this).attr("opusid");
                                g_sps.jump($(this),href);
                            });
                        }

                    }
                }
            });
        },
        //发明专利列表
        getPatent: function() {
            var t = this;
            var html = "";
            var data = {};
            data.customerId = this.customerId;
            data.languageFlag = 0;
            data.pageIndex = 1;
            data.pageSize = 100;
            $.ajax({
                type: 'POST',
                url: t.path.patentList,
                data: data,
                dataType: "json",
                success: function callback(rep) {
                    if (rep && rep.responseObject.responseData) {
                        if (rep.responseObject.responseData.data_list && rep.responseObject.responseData.data_list.length > 0) {
                            var rows = rep.responseObject.responseData.data_list;
                            $.each(rows, function(i, val) {
                                html += '<article class="al-tableModuleContent" patentid="' + val.id + '">' +
                                    '<p>' + val.patentName + '</p>' +
                                    '<p>' + val.patentCode + '</p>' +
                                    '<span class="al-timeRange">' + val.patentTime.substring(0, 4) + "/" + val.patentTime.substring(5, 7) + '</span>' +
                                    '<p>' + val.country + '</p>' +
                                    '<button class="al-tableModuleContentConfigBtn icon-pencilDeepBlue"></button>' +
                                    '</article>';
                            });
                            $(".ev-patentList").html(html);
                            $(".ev-patentList article").on("click", function() {
                                var href = "/pages/personal/patent.html?id=" + $(this).attr("patentid");
                                g_sps.jump($(this),href);
                            });
                        }

                    }
                }
            });
        }
    };
    customerInfoEdit.init();
});
