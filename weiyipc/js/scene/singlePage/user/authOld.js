/**
 * @Desc： 新版认证
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by LiChunHui on 2017/4/24.
 */
$(function(){
    var newAuth={};
    newAuth={
        path: {
            hospital: PC_CALL + "commdata/getHospitalList/",//医院联想
            university:PC_CALL+"commdata/getSchoolList/",//学校联想
            getCustomerUnite: PC_CALL + "customer/unite/getCustomerUnite/",     //获取当前登录用户信息
            medical: PC_CALL + "commdata/getMedicalTitleList/",//获取医师职称
            dataTag: PC_CALL + "commdatas/tag/getDataTags/",//获取专业列表
            getCustomerAuthInfo: PC_CALL + 'customer/auth/getAuthBycustomerId/',//获取用户认证信息
            getLogo: PC_CALL + "commdata/getLogoUrlList/",//获取用户头像
            renzhengSubmit: PC_CALL + "customer/auth/createAuth2/",	//	认证提交
            getDataRoleConfigs:PC_CALL +"comm/data/roleconfig/getDataRoleConfigs/",//获取证件名称
            getAuthAttachments: PC_CALL + "customer/auth_attachment/getAuthAttachments/",//获取用户证件信息
            getMapById: PC_CALL+'customer/unite/getMapById/',//获取用户性别
            getMapList:PC_CALL+'customer/auth_process/getMapList/',//获取拒绝原因
            create:PC_CALL+'customer/revise/auth/create/',//申请认证变更-基本信息
            revise:PC_CALL+'customer/attachment/revise/create/'//申请认证变更-附件
        },
        init:function(){
            this.para=comm.getpara();//解析URL参数
            this.getCustomerAuthInfo();//获取用户认证信息
            this.helpAuth();
            this.cancel();

        },
        //获取用户认证信息
        getCustomerAuthInfo: function () {
            var t = this;
            if(comm.authInfo){
                var data=comm.authInfo;
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
                            var rspObj = data.responseObject;
                            t.customerAuth = rspObj;
                            t.name = rspObj.certificatesCode;//姓名
                        }
                    }
                });
            }
            var postData={
                customerId:$("#sesCustomerId").val()
            };
            postData={
                paramJson:$.toJSON(postData)
            };
            $.ajax({
                url: t.path.getMapById,
                data:postData,
                type:'post',
                dataType:'json',
                success:function(data){
                    if(data&&data.responseObject.responseData&&data.responseObject.responseData.data_list&&data.responseObject.responseData.data_list.length>0) {
                        t.customerAuth.sex=data.responseObject.responseData.data_list["0"].customer_baseinfo.sex;
                        t.customerAuth.birthYear=data.responseObject.responseData.data_list["0"].customer_baseinfo.birthday;
                        t.checkAuth();//检查用户认证状态
                    }
                }
            });
            if(t.para.isCustomerInfo){
                //个人中心
                //进入第一步
                t.firstAuthStep();
                //t.secondAuthStep();
            }else {
                if(t.customerAuth.state === 0||t.customerAuth.state === 1 || t.customerAuth.state === 2 || t.customerAuth.state === 7 || t.customerAuth.state === 8){//0-二次提交认证、1-认证通过、2-运营确认
                    setTimeout(function(){
                        g_sps.jump(null,"/");
                    },500)
                }
            }

        },
        //判断认证
        checkAuth: function () {
            var t = this;
            if (t.customerAuth && !$.isEmptyObject(t.customerAuth)) {//有认证的信息
                var cAuth = t.customerAuth;
                $('.ev-secondError').hide();
                $('.ev-authText').removeClass('authTextMar');
                // -    1-无认证信息、0-二次提交认证、1-认证通过、2-运营确认、3-认证拒绝
                if (cAuth.customerId <= 0 || cAuth.state === 3  || cAuth.state === -1 ||cAuth.state==9) {
                    t.isFirstAuth=1;
                    // 未申请  || 被拒绝  ||无认证信息
                    if(cAuth.state===3||cAuth.state==9){
                        t.isFirstAuth=2;
                        var postData={
                            customerId:$("#sesCustomerId").val(),
                            state:cAuth.state,
                            sortType:3,
                            firstResult:0,
                            maxResult:1
                        };
                        postData={
                            paramJson:$.toJSON(postData)
                        };
                        $.ajax({
                            url: t.path.getMapList,
                            data:postData,
                            type:'post',
                            dataType:'json',
                            success:function(data){
                                if(data&&data.responseObject.responseData&&data.responseObject.responseData.data_list&&data.responseObject.responseData.data_list.length>0) {
                                    $('.ev-secondError span').text(data.responseObject.responseData.data_list["0"].supplement);
                                    $('.ev-secondError').show();
                                    $('.ev-authText').addClass('authTextMar');
                                }
                            }
                        });
                    }
                    //进入第一步
                    t.firstAuthStep();
                    //t.secondAuthStep();
                } else if (cAuth.state === 2  || cAuth.state === 8 ) {
                    if(t.para.isCustomerInfo){
                        //个人中心
                        //进入第一步
                        t.firstAuthStep();
                        //t.secondAuthStep();
                    }else {
                        //认证已经通过，且资料都完善。
                        setTimeout(function() {
                            g_sps.jump(null, "/");
                        },500);
                        t.isRenZhengStatus = true;
                        t.end();
                    }
                } else if (cAuth.state === 0||cAuth.state === 7 || cAuth.state === 1) {
                    //已经提交申请 未审核 ，此时不允许再次认证
                    t.end();
                }
            }
        },
        //第一步
        firstAuthStep:function(){
            comm.Log.createBrowse({href: location.href, id:10001, name: "认证第一步",platformId: $('#sesDepartment').val(),noTimeOut:1});
            var t=this;
            if(t.isFirstAuth==1){//第一次认证
                $(".ev-equity").click();
            }
            t.browType = 10001;
            comm.areaData={1:[],2:[]};
            var auth=t.customerAuth;
            $("#firstStep").show();
            $("#fullName").val(auth.lastName+auth.firstName);//姓名
            $("#company").val(auth.company);//医院
            $("#schoolName").val(auth.schoolName); //学校

            //日期
            ymd({
                year:$("#authYear"),
                month:$("#authMonth"),
                day:$('#authDay'),
                latestYear:2000,
                startYear:1900

            });
            if(auth.birthYear){
                gettime($("#authYear"),auth.birthYear.substr(0,4));//年
                gettime($("#authMonth"),auth.birthYear.substr(5,2));//月
                gettime($("#authDay"),auth.birthYear.substr(8,2));//日
            }else {
                gettime($("#authYear"),'1980');//年
                gettime($("#authMonth"),'01');//月
                gettime($("#authDay"),'01');//日
            }


            //医院的搜索
            $("#company").lenovo({
                width:292,
                url: t.path.hospital,
                showName: "hospitalName", //显示出的值
                id:"id",   //自定义属性值
                hiddenId:"companyId"    //自定义属性
            });

            //学校的选择   TODO 修改
            $("#schoolName").lenovo({
                width:292,
                url: t.path.university,
                showName:"schoolName",
                id:"id",//自定义属性值
                hiddenId:"schoolId"//自定义属性
            });
            $("#schoolName,#company").on('keyup',function () {
                if($(this).attr('schoolid')){
                    $(this).attr('schoolid','')
                }else if($(this).attr('companyid')){
                    $(this).attr('companyid','')
                }
            });
            var medical = auth.medicalTitle,
                areasExpertise=auth.areasExpertise;
            //专业信息初始化
            t.areasInit(areasExpertise);
            //职称的选择
            $("#ev-medicalPar").medicalTitleV3({
                container: $("#ev-medTitle"),//存放已选择的职称
                defaultHide:1,
                mouseoverFn:function(){
                    $("#ev-areaPar .ev-tagBox").hide();
                    var height=$(".ev-medicalBox").innerHeight();
                    $(".ev-medicalBox").css("top",-height);
                    var medicaltitle=$('#ev-medTitle').attr('medicaltitle');
                    if(medicaltitle&&$('.ev-medicalBox').css('display')=='none'){
                        $.each($('.ev-medicalLiList'),function(index,ele){
                            if(medicaltitle.indexOf($(ele).text())!=-1&&medicaltitle.indexOf($(ele).attr('medicalid'))!=-1){
                                $(ele).addClass('active').attr('select-status',true);
                            }else {
                                $(ele).removeClass('active').attr('select-status',false);
                            }
                        })
                    }
                },
                fn:function(){
                    t.submitConfig();
                    if($("#ev-medTitle").attr("medicalTitle")){
                        $("#ev-medTitle").removeClass("al-selectDefault");
                    }else{
                        $("#ev-medTitle").addClass("al-selectDefault").text("选择职称");
                    }
                }
            });
            //职称信息初始化
            t.medicalInit(medical);
            //单位 TODO:
            $(".ev-onUnit").off('click').on("click",function(){
                if(!$(this).find("i").hasClass('al-tableRadioOn')){
                    var index=$(this).index();
                    if($(this).hasClass('ev-unit')){
                        //单位
                        $(".ev-inUnit").parent().show();
                        $(".ev-inUnit").hide();
                        $(".ev-inUnit").eq(index).show();
                        t.unitType=$(this).attr('unittype');
                    }
                    if($(this).hasClass('ev-division')){
                        //科室
                        var platformId=$(this).attr('unittype');
                        t.areasList(platformId);
                        t.department=platformId;
                        if($('#ev-areaSed').attr('unittype')&&$('#ev-areaSed').attr('unittype')!=platformId){
                            $('#ev-areaSed').attr('unittype',platformId);
                            if($('#ev-areaSed .tagName').length>0){
                                t.areaSed=$('#ev-areaSed').html();
                            }
                            if($("#ev-areaSed").hasClass('al-selectDefault')){
                                $("#ev-areaSed").removeClass("al-selectDefault").html(t.areaSed)
                            }else {
                                $("#ev-areaSed").addClass("al-selectDefault").text("选择专业");
                            }
                        }else {
                            $('#ev-areaSed').attr('unittype',platformId);
                            if(t.areaSed){
                                if($("#ev-areaSed").hasClass('al-selectDefault')){
                                    $("#ev-areaSed").removeClass("al-selectDefault").html(t.areaSed)
                                }else {
                                    $("#ev-areaSed").addClass("al-selectDefault").text("选择专业");
                                }

                            }
                        }

                    }
                    if($(this).hasClass('ev-sex')){
                        //性别
                        t.sexId=$(this).attr('unittype');
                        t.sex=($(this).text()).replace(/\s/g, "");
                    }
                    $(this).parent().find("i").removeClass("al-tableRadioOn");
                    $(this).find("i").addClass("al-tableRadioOn");
                    t.submitConfig();
                }
            });
            //性别  默认男
            if(auth.sex=='女'){
                $(".ev-onUnit").eq(1).click();
            }else {
                $(".ev-onUnit").eq(0).click();
            }
            //单位
            if (auth.company){
                $(".ev-onUnit").eq(2).click();
            } else if (auth.schoolName){
                $(".ev-onUnit").eq(3).click();
            }
            //科室 默认骨科
            if (auth.platformId==2){
                $(".ev-onUnit").eq(5).click();
            }else {
                $(".ev-onUnit").eq(4).click();
            }
            $("#firstStep input").on("input change propertychange copy cut paste keyup",function(){
                t.submitConfig();
            });
            t.checkName();
            t.firstSubmit();
        },
        //名字实时校验
        checkName:function(){
            $('#fullName').on('keyup',function(){
                var thisVal=$(this).val();
                if(thisVal){
                    if(comm.getByteLen(thisVal) > 50){
                        $("#fullName").addClass("error");
                        $("#name_error").addClass("showIb").html("<i></i>您的姓名过长？");
                    }else if(!/^[\u4e00-\u9fa5\s\.·-]{1,25}$|^[\@A-Za-z_\s\.·-]{1,50}$/.test(thisVal)){
                        $("#fullName").addClass("error");
                        $("#name_error").addClass("showIb").html("<i></i>请填写正确的姓名？");
                    }else{
                        $("#fullName").removeClass("error");
                        $("#name_error").removeClass("showIb");
                    }
                }else{
                    $("#fullName").removeClass("error");
                    $("#name_error").removeClass("showIb");
                }
            })
        },
        //职称初始化
        medicalInit:function(medical){
            var medical1 = medical?medical.split(","):[];
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
            if(medical){
                $("#ev-medTitle").removeClass("al-selectDefault")
                    .attr("medicalTitle", medical)
                    .text(medicalTitle.substring(0, medicalTitle.length - 1));
            }
            if(medical){
                $("#ev-medTitle").removeClass("al-selectDefault");
                $("#ev-medTitle").attr("medicalTitle", medical);
                $("#ev-medTitle").text(medicalTitle.substring(0, medicalTitle.length - 1));
            }
            //清空职称的选中状态
            $("#ev-medicalPar .ev-medicalLiList").attr("select-status", "false");
            $("#ev-medicalPar .ev-medicalLiList").removeClass("active");
            //比对是对应职称选中
            $.each($("#ev-medicalPar .ev-medicalLiList"), function (i, em) {
                $.each(ids, function (j, val) {
                    if(val==3||val==4){
                        $(".ev-medicalPar .al-tagSelectorList:gt(0)").show();
                    }
                    if ($(em).attr("medicalid") == val) {
                        $(em).attr("select-status", "true");
                        $(em).addClass("active");
                    }
                });
            });
        },
        //专业领域列表选择
        areasList:function(platformId){
            var t=this;
            //专业领域
            $("#ev-areaPar").areaExpertiseSelect({
                seledCon: $("#ev-areaSed"),//存放已选择的专业
                platformId:platformId||1,
                mouseoverFn:function(){
                    $("#ev-medicalPar .ev-medicalBox").hide();
                    var height=$(".ev-tagBox").innerHeight();
                    $(".ev-tagBox").css("top",-height);
                    if($('.ev-tagBox').css('display')=='none'){
                        $('.ev-tagConList button').attr('select-status',false).removeClass('active');
                        if($('#ev-areaSed .al-tableTagConfigItem').length>0){
                            $.each($('#ev-areaSed .al-tableTagConfigItem'),function(i,item){
                                $.each($('.ev-tagConList button'),function(index,ele){
                                    if($(ele).attr('tagid')==$(item).attr('tagid')){
                                        $(ele).attr('select-status',true).addClass('active');
                                    }
                                })
                            })
                        }
                    }

                },
                fn:function(){
                    t.submitConfig();
                    if($("#ev-areaSed .tagName").length>0){
                        $("#ev-areaSed").removeClass("al-selectDefault");
                    }else{
                        $("#ev-areaSed").addClass("al-selectDefault").text("选择专业");
                    }
                }
            });
        },
        //专业初始化
        areasInit:function(areasExpertise){
            var t=this,
                area = areasExpertise!=null ? areasExpertise:"",
                area1 = [];
            if (area) {
                area1 = area.split(",");
            }
            var ids = [];
            var html = "";
            $.each(area1, function (i, val) {
                if (val) {
                    if(val.indexOf('_')>-1){
                        if (val.split("_")[1]) {
                            ids.push({id: val.split("_")[0], name: val.split("_")[1]});
                        }
                    }else {
                        ids.push({id: '', name: val});
                    }
                }
            });
            if(ids.length>0){
                $.each(ids, function (i, val) {
                    html+='<div class="al-tableTagConfigItem tagName" tagid="' + val.id + '"><span style="margin:0;">' + val.name + '</span><i class="ev-tagClose" tagid="' + val.id + '"></i></div>';
                });
                $("#ev-areaSed").html(html).removeClass("al-selectDefault");
            }
            t.clerTag();
        },
        //删除专业
        clerTag:function(){
            var t=this;
            $(".ev-tagClose").on("click",function(){
                var tagId=$(this).attr("tagId");
                $(this).parent().remove();
                $.each($(".ev-tagConList button"),function(i,em){
                    if($(em).attr("tagId")==tagId){
                        $(em).removeClass("active");
                        $(em).attr("select-status","false");
                    }
                });
                if($(".ev-tagConList .active").length==0){
                    $("#ev-areaSed").addClass("al-selectDefault").text("选择专业");
                }
            });
        },
        //取消点击
        cancel:function(){
            var t=this;
            $(".ev-authCancel").off('click').on("click",function(){
                    if(t.para.isCustomerInfo){
                            $.makeSurePopup({
                                title:"",
                                content01:"确认放弃认证变更吗？",//弹窗标题
                                content:"现在放弃将丢失已修改的内容",//弹窗内容
                                ensure:"放弃",//确认按钮文字内容 默认 “确认”
                                cancel:"继续认证",//取消按钮文字内容 默认 “取消”
                                ensureClass:'al-msgDeleteConfirm',//确认按钮class
                                cancelClass:'al-msgDeleteCancel',
                                callback:function(){
                                    history.back(-1);
                                }
                            });
                    }else {
                        $.makeSurePopup({
                            title:"",
                            content01:"确认放弃认证吗？",//弹窗标题
                            content:"放弃认证将无法正常使用唯医",//弹窗内容
                            ensure:"放弃",//确认按钮文字内容 默认 “确认”
                            cancel:"继续认证",//取消按钮文字内容 默认 “取消”
                            ensureClass:'al-msgDeleteConfirm',//确认按钮class
                            cancelClass:'al-msgDeleteCancel',
                            callback:function(){
                                if(document.referrer){
                                    var href=document.referrer;
                                    if(
                                        href.lastIndexOf("/html/video/") > -1 ||
                                        href.lastIndexOf("/html/doc/") > -1 ||
                                        href.lastIndexOf("/html/case/") > -1 ||
                                        href.lastIndexOf("/html/topic/") > -1||
                                        href.lastIndexOf("pages/singlePage/upload-case") > -1
                                    ){
                                        if(href.lastIndexOf("pages/singlePage/upload-case") > -1){
                                            history.go(-2);
                                        }else {
                                            g_sps.jump(null,"/");
                                        }
                                    }else{
                                        history.go(-1);
                                    }
                                }else{
                                    g_sps.jump(null,"/");
                                }
                            }
                        });
                    }
            })
        },
        //第一步提交
        firstSubmit: function () {
            var t = this;
            $("#ev-next").off('click').on("click",function(){
                comm.creatEvent({
                    triggerName:'基本信息-下一步',
                    triggerType:"认证",
                    browType:'10001',
                    actionId:2505
                });
                if($(this).attr("submit")=="true"){
                    var company,companyId,schoolName,schoolId;
                    if(t.unitType==1){//医院
                        company = $('input[name=company]').val();
                        companyId =  $('input[name=company]').attr("companyId");
                    }else{//学校
                        schoolName=$('input[name=schoolName]').val();
                        schoolId=$('input[name=schoolName]').attr("schoolId");
                    }
                    var medicalTitle = $("#ev-medTitle").attr("medicaltitle");
                    var areasExpertise01 = '';
                    $("#ev-areaSed .tagName").each(function (i, em) {
                        areasExpertise01 += $(em).attr("tagid") + "_" + $("span",$(em)).text() + ",";
                    });
                    areasExpertise = areasExpertise01.substring(0, areasExpertise01.length - 1);
                    var data={
                        customerId:$('#sesCustomerId').val(),
                        opflag:1,//认证第一步
                        fullName:$("#fullName").val(),//名字
                        sexId: t.sexId,//姓别ID
                        sex: t.sex,//姓别
                        birthday:$("#authYear option:selected").val()+"-"+$("#authMonth option:selected").val()+"-"+$("#authDay option:selected").val(),//出生日期
                        company:company,//单位
                        companyId:companyId,//单位ID
                        schoolName:schoolName,//学校
                        schoolId:schoolId,//学校ID
                        platformId:t.department,//专业
                        medicalTitleId:'',
                        medicalTitle:medicalTitle,//职称
                        areasExpertise:areasExpertise,//专科
                        authSource:'',
                        authWay:''
                    },url=t.path.renzhengSubmit;
                    if(medicalTitle.indexOf('_')>-1){
                        t.medicalID=medicalTitle.match(/\d+/)[0]
                    }else {
                        if(medicalTitle.indexOf('医学生')>-1){
                            t.medicalID=10;
                        }
                    }
                        var isSuccess = 1;
                        if(!data.fullName){
                            $("#fullName").addClass("error");
                            $("#name_error").addClass("showIb").html("<i></i>您的姓名？");
                            isSuccess = 0;
                        }else if(comm.getByteLen(data.fullName) > 50){
                            $("#fullName").addClass("error");
                            $("#name_error").addClass("showIb").html("<i></i>您的姓名过长？");
                            isSuccess = 0;
                        }else if(!/^[\u4e00-\u9fa5\s\.·-]{1,25}$|^[\@A-Za-z_\s\.·-]{1,50}$/.test(data.fullName)){
                            $("#fullName").addClass("error");
                            $("#name_error").addClass("showIb").html("<i></i>请填写正确的姓名？");
                            isSuccess = 0;
                        }else{
                            $("#fullName").removeClass("error");
                            $("#name_error").removeClass("showIb");
                        }
                        if(!$("#authYear option:selected").val()){
                            $("#date_error").addClass("showIb");
                            isSuccess = 0;
                        }else{
                            $("#date_error").removeClass("showIb");
                        }
                        //职称前6个必须选择一个
                        /*var firstMedical=false;
                        $.each($(".ev-medicalLiList"),function(i,em){
                            if(i<6){
                                if($(em).attr("select-status")=="true"){
                                    firstMedical = true;
                                    return ;
                                }
                            }
                        });*/
                        if (!data.medicalTitle) {
                            $("#medical_par").addClass("error");
                            $("#med_error").addClass("showIb");
                            isSuccess = 0;
                        } else {
                            $("#medical_par").removeClass("error");
                            $("#med_error").removeClass("showIb");
                        }

                        if(!t.unitType){
                            $("#onUnit_error").addClass("showIb").html("<i></i>请填写单位！");
                            isSuccess=0;
                        }else{
                            $("#onUnit_error").removeClass("showIb")
                        }
                        if(t.unitType==1){//选择在医院
                            if (!data.company) {
                                $("#company").parent().addClass("error");
                                $("#company_error").addClass("showIb").html("<i></i>请填写医院！");
                                isSuccess = 0;
                            } else if (comm.getByteLen(data.company) > 200) {
                                $("#company").parent().addClass("error");
                                $("#company_error").addClass("showIb").html("<i></i>最长100个中文或200个英文！");
                                isSuccess = 0;
                            } else {
                                $("#company").parent().removeClass("error");
                                $("#company_error").removeClass("showIb");
                            }
                        }

                        if(t.unitType==2){//选择在学校
                            if (!data.schoolName) {
                                $("#schoolName").parent().addClass("error");
                                $("#company_error").addClass("showIb").html("<i></i>请填写学校！");
                                isSuccess = 0;
                            } else if (comm.getByteLen(data.schoolName) > 200) {
                                $("#schoolName").parent().addClass("error");
                                $("#company_error").addClass("showIb").html("<i></i>最长100个中文或200个英文！");
                                isSuccess = 0;
                            } else {
                                $("#schoolName").parent().removeClass("error");
                                $("#company_error").removeClass("showIb");
                            }
                        }

                        if (!data.areasExpertise) {
                            $("#area_error").addClass("showIb");
                            isSuccess = 0;
                        } else {
                            $("#area_error").removeClass("showIb");
                        }
                        if (isSuccess == 0) {
                            return;
                        }
                        $("#ev-next").attr("submit","false");
                        if(t.para.isCustomerInfo){
                            data={
                                customerId:$('#sesCustomerId').val(),
                                opflag:1,//认证第一步
                                updateFullName:$("#fullName").val(),//名字
                                updateSexId: t.sexId,//姓别ID
                                updateSex: t.sex,//姓别
                                updateBirthday:$("#authYear option:selected").val()+"-"+$("#authMonth option:selected").val()+"-"+$("#authDay option:selected").val(),//出生日期
                                updateWorkplaceType:company?1:2,//单位
                                updateWorkplaceId:companyId?companyId:schoolId,//单位ID
                                updateWorkplace:company?company:schoolName,//学校
                                updatePlatformId:t.department,//专业
                                updateMedicalTitle:medicalTitle,//职称
                                updateAreasExpertise:areasExpertise//专科
                            };
                            url= t.path.create;
                        }
                        var param={};
                        param.paramJson= $.toJSON(data);
                        comm.LightBox.showloading();
                        $.ajax({
                            url: url,
                            cache: false,
                            data: param,
                            dataType: 'json',
                            type: "POST",
                            success: function (data) {
                                comm.LightBox.hideloading();
                                $("#ev-next").attr("submit","true");
                                if (data.responseObject.responseStatus) {
                                    //comm.authInfo=null;//TODO lichunhui add
                                    TempCache.removeItem("authInfo");
                                    if(t.para.isCustomerInfo){
                                        t.reviseId=data.responseObject.responsePk;
                                    }
                                    t.secondAuthStep();
                                } else {
                                    if (data.responseObject.responseMessage) {
                                        $.topTip({mark:"warn",content:data.responseObject.responseMessage});
                                    } else {
                                        $.topTip({mark:"warn",content:"提交认证失败，请稍后重试"});
                                    }
                                }
                            },
                            error: function (XMLHttpRequest, textStatus, errorThrown) {
                                alert(textStatus + "   " + errorThrown);
                            }
                        });
                }

            })
        },
        //获取基本信息数据
        firstData:function(){
            var t=this;
            var company,companyId,schoolName,schoolId;
            if(t.unitType==1){//医院
                company = $('input[name=company]').val();
                companyId =  $('input[name=company]').attr("companyId");
            }else{//学校
                schoolName=$('input[name=schoolName]').val();
                schoolId=$('input[name=schoolName]').attr("schoolId");
            }
            var medicalTitle = $("#ev-medTitle").attr("medicaltitle");
            var areasExpertise01 = '';
            $("#ev-areaSed .tagName").each(function (i, em) {
                areasExpertise01 += $(em).attr("tagid") + "_" + $("span",$(em)).text() + ",";
            });
            areasExpertise = areasExpertise01.substring(0, areasExpertise01.length - 1);
            var data={
                customerId:$('#sesCustomerId').val(),
                opflag:1,//认证第一步
                fullName:$("#fullName").val(),//名字
                sexId: t.sexId,//姓别ID
                sex: t.sex,//姓别
                birthday:$("#authYear option:selected").val()+"-"+$("#authMonth option:selected").val()+"-"+$("#authDay option:selected").val(),//出生日期
                company:company,//单位
                companyId:companyId,//单位ID
                schoolName:schoolName,//学校
                schoolId:schoolId,//学校ID
                platformId:t.department,//专业
                medicalTitleId:medicalTitle.match(/\d+/)[0],
                medicalTitle:medicalTitle,//职称
                areasExpertise:areasExpertise,//专科
                authSource:'',
                authWay:''
            };
            return data;
        },
        //第二步
        secondAuthStep:function(){
            var t=this;
            comm.Log.createBrowse({href: location.href, id:10014, name: "认证第二步",platformId: $('#sesDepartment').val(),noTimeOut:1});
            t.browType = 10014;
            $("#firstStep").hide();
            $("#secondStep").show();
            t.delAttIdList=[];
            t.dataRoleConfigs();
        },
        //第二步提交
        secondAuthSubmit:function(){
            var t=this;
            $("#ev-thirdNext").off('click').on("click",function(){
                comm.creatEvent({
                    triggerName:'认证信息-提交',
                    triggerType:"认证",
                    browType:'10014',
                    actionId:2513
                });
                if($(this).attr("on")=="true"){
                    $(this).attr("on","false");
                    var authAttList=[];
                    $.each($('.ev-attType'),function(index,ele){
                        $.each($(ele).find('.certificatesPath'),function(indexC,eleC){
                            if($(eleC).val()){
                                authAttList.push({
                                    attType:$(ele).find('.ev-dataAttType').attr('data-attType'),
                                    attPath:$(eleC).val(),
                                    attCode:$(ele).find('.attCode').val()?$(ele).find('.attCode').val():'',
                                    attPositionType:indexC+1,
                                    isUpdate:$(eleC).attr('data-id') ? 1:0,
                                    id:$(eleC).attr('data-id')?$(eleC).attr('data-id'):'_'
                                });
                            }
                        });
                    });
                    ////console.log(authAttList);
                        var data={},url= t.path.renzhengSubmit;
                        if(t.para.isCustomerInfo){
                            var attList=[];
                            $.each($('.ev-attType'),function(index,ele){
                                $.each($(ele).find('.certificatesPath'),function(indexC,eleC){
                                    if($(eleC).attr('data-oldpath')||$(eleC).val()){
                                        var oldpath,newpath;
                                        if($(eleC).attr('data-oldpath')){
                                            oldpath=$(eleC).attr('data-oldpath').split('.');
                                        }
                                        if($(eleC).val()){
                                            newpath=$(eleC).val().split('.');
                                        }
                                        attList.push({
                                            attType:$(ele).find('.ev-dataAttType').attr('data-attType'),
                                            attPath:$(eleC).attr('data-oldpath'),
                                            attCode:$(ele).find('.attCode').attr('data-oldcode')?$(ele).find('.attCode').attr('data-oldcode'):'',
                                            attFormat:oldpath?(oldpath[oldpath.length-1]):'',
                                            updateAttType:$(ele).find('.ev-dataAttType').attr('data-attType'),
                                            updateAttPath:$(eleC).val(),
                                            updateAttCode:$(ele).find('.attCode').val()?$(ele).find('.attCode').val():'',
                                            attPositionType:indexC+1,
                                            updateAttFormat:newpath?(newpath[newpath.length-1]):''
                                        });
                                    }
                                });
                            });
                             data={
                                 reviseId:t.reviseId,
                                 customerId:$('#sesCustomerId').val(),
                                 attList:JSON.stringify(attList),
                                 //authAttList:authAttList,
                                 opflag:2
                            };
                            url= t.path.revise;
                        }else {
                             data={
                                customerId:$('#sesCustomerId').val(),
                                delAttIdList: t.delAttIdList.join(','),
                                authAttList:JSON.stringify(authAttList),
                                //authAttList:authAttList,
                                opflag:2,
                                 isCompleted:0
                            };
                        }

                        ////console.log(data)

                        var param={paramJson:$.toJSON(data)};
                        comm.LightBox.showloading();
                        $.ajax({
                            url: url,
                            cache: false,
                            data: param,
                            dataType: 'json',
                            type: "POST",
                            success: function (data) {
                                // TODO: 认证成功后应当作何处理
                                comm.LightBox.hideloading();
                                if (data&&data.responseObject&&data.responseObject.responseStatus) {
                                    if(t.isFirstAuth && t.isFirstAuth==1){
                                        TempCache.setItem('isFirstAuth','true');
                                    }else {
                                        TempCache.removeItem('isFirstAuth');
                                    }
                                    comm.authInfo=null;//TODO lichunhui add
                                    if (data.responseObject.responseData.state == 0) { // 二次审核时才需要显示认证审核中提示信息。
                                        t.lastAuthStep();
                                    } else {
                                        // 首次默认提交成功
                                        t.end();
                                        //$('#sesAuth').val(data.responseObject.responseData.state);//修改页面中认证的值
                                    }
                                } else {
                                    if (data&&data.responseObject&&data.responseObject.responseMessage) {
                                        $.topTip({mark:"warn",content:data.responseObject.responseMessage});
                                    } else {
                                        $.topTip({mark:"warn",content:"提交认证失败，请稍后重试"});
                                    }
                                }
                            },
                            error: function (XMLHttpRequest, textStatus, errorThrown) {
                                alert(textStatus + "   " + errorThrown);
                            }
                        });


                }else {
                    if($('html').attr('emptyAttCode')){
                        var emptyAttCode=($('html').attr('emptyAttCode')).split(' ')[1];
                        $(window).scrollTop($('.'+emptyAttCode).offset().top);
                        $.topTip({mark:"warn",content:"请完整填写"+$('.ev-dataAttType span',$('.'+emptyAttCode)).eq(0).text()+"后再提交"});
                    }else{
                        return false;
                    }
                }
            })
        },
        //获取证件名称
        dataRoleConfigs:function(){
            var t=this;
            var demoImg =[];//存放示例图片
            demoImg[8] = ['pic_zhiye1.png','pic_zhiye2.png'];
            demoImg[6] = ['pic_zige1.png','pic_zige2.png'];
            demoImg[13] = ['pic_zhicheng.png'];
            demoImg[10] =['pic_work.png'];
            demoImg[7] =['pic_xuewei.png'];
            demoImg[9] = ['pic_xueli.png'];
            demoImg[1] =['pic_id1.png','pic_id2.png'];
            var postData={
                "roleId":6,
                "typeId":1
            };
            postData={paramJson:$.toJSON(postData)};
            $.ajax({
                url: t.path.getDataRoleConfigs,
                dataType: "json",
                type: "post",
                data:postData,
                success: function (data) {
                    if (data && data.responseObject&&data.responseObject.responseMessage.length>0) {
                        var roleConfigsStr='',roleIdStr='';
                        $.each(data.responseObject.responseMessage,function(index,ele){
                            var refId=data.responseObject.responseMessage[index].refId;
                           if(refId!=1){
                               if(refId==6||refId==8||refId==13){//有证件编号
                                   roleConfigsStr+= t.attcodeDom({
                                       refId:refId,
                                       refValue:data.responseObject.responseMessage[index].refValue,
                                       demoImg:demoImg
                                   });
                               }else {
                                   roleConfigsStr+=' <section class="ev-attType ev-imgAtt'+(refId==10?(t.medicalID=='10'?12:11):refId)+'">'+
                                       '            <section class="authInput ev-dataAttType" data-attType="'+(refId==10?(t.medicalID=='10'?12:11):refId)+'">'+
                                       '                <span>'+data.responseObject.responseMessage[index].refValue+'</span>'+
                                       '            </section>'+
                                       '            <section class="authInput padding108">'+
                                       '                <figure class="al-tableItemContent">'+
                                       '                    <aside class="uploadImg ev-cerUploadCon">'+
                                       '                        <input type="hidden" value="" name="certificatesPath" class="certificatesPath" />'+
                                       '                        <div class="photoCont">'+
                                       (function(){
                                           var str='';
                                           if(refId==10){
                                               str='<figure class="ev-work hide"><img src="/images/img10/authentication/certificate/pic_work.png"><div class="sample">示例</div></figure>'+
                                                   '<figure class="ev-student hide"><img src="/images/img10/authentication/certificate/pic_student.png"><div class="sample">示例</div></figure>';
                                           }else {
                                               str='<figure><img src="/images/img10/authentication/certificate/'+demoImg[refId][0]+'"><div class="sample">示例</div></figure>';
                                           }
                                           return str;
                                       }())+
                                       '                            <!--上传后的图片 上传中添加类名 uploading-->'+
                                       '                            <figure class="uploadSuccess cer_upload">'+
                                       '                                <div class="czyx1">'+
                                       '                                    <div class="ev-upload hide">'+
                                       '                                        <!--蒙层-->'+
                                       '                                        <div class="uploadPopup">'+
                                       '                                            <p class="hide">上传失败<br/>'+
                                       '                                                请重新上传</p>'+
                                       '                                            <figure class="percentage loadingAnimate hide">'+
                                       '                                                <img src="//img10.allinmd.cn/v3/common/icon/icon_uploading.png">'+
                                       '                                                <!--<span>20%</span>-->'+
                                       '                                            </figure>'+
                                       '                                        </div>'+
                                       '                                        <!--关闭按钮-->'+
                                       '                                        <div class="popupClose hide"></div>'+
                                       '                                    </div>'+
                                       '                                    <input class="cer_po_input" type="file" name="file">'+
                                       '                                </div>'+
                                       '                            </figure>'+
                                       '                        </div>'+
                                       '                        <figure class="uploadPhoto">'+
                                       '                            <i></i>'+
                                       '                            <p>上传证件照</p>'+
                                       '                        </figure>'+
                                       '                        <div class="l_warning photo_error"><img src="//img10.allinmd.cn/v3/common/icon/error_tips.png"><span><label>请上传证件照片！</label></span></div>'+
                                       '                    </aside>'+
                                       '                </figure>'+
                                       '            </section>'+
                                       '        </section>';
                               }
                           }else {
                               roleIdStr+= t.attcodeDom({
                                   refId:refId,
                                   refValue:data.responseObject.responseMessage[index].refValue,
                                   demoImg:demoImg
                               });
                           }
                            $('.ev-container').html(roleConfigsStr+roleIdStr);
                        });
                        if(t.medicalID!='10'){
                            $('.ev-student').hide();
                            $('.ev-work').show();
                            $('.ev-imgAtt11 .ev-dataAttType span').text('工作证');
                        }else {
                            $('.ev-work').hide();
                            $('.ev-student').show();
                            $('.ev-imgAtt12 .ev-dataAttType span').text('学生证');
                        }
                        t.secondInformation();
                        t.uploadAtt();
                        t.secondAuthSubmit();
                        t.secondSubmit();
                        $("#secondStep .attCode").on("keyup",function(){
                            t.secondSubmit();
                                $(this).val($(this).val().replace(/[^0-9a-zA-Z]/g,''));
                                if(($(this).val()).length>50){
                                    $(this).val($(this).val().substr(0,50));
                                }
                            if($(this).parents('.ev-attType').hasClass('ev-imgAtt1')){
                                $(this).val($(this).val().replace(/[^0-9xX]/g,''));
                                if(($(this).val()).length>18){
                                    $(this).val($(this).val().substr(0,18));
                                }
                            }
                        });
                    }
                }
            });
        },
        //有证件编号的DOm
        attcodeDom:function(option){
            var str='<section class="ev-attType ev-imgAtt'+option.refId+'">'+
                '            <section class="authInput ev-dataAttType" data-attType="'+option.refId+'">'+
                '                <span>'+option.refValue+'<b></b></span>'+
                                    (function(){
                                        var str='';
                                        if(option.refId==1){
                                            str='                <span class="only">仅上传身份证无法完成认证</span>';
                                        }
                                        return str;
                                    }())+
                '            </section>'+
                '            <section class="authInput ev-attCodePar padding108 certificatesNum">'+
                '                <span>证件编号</span>'+
                '                <figure class="al-tableItemContent documentNum">'+
                '                    <input type="text" name="attCode" class="attCode" placeholder="请输入证件编号"/>'+
                '                </figure>'+
                '                <p class="al-tableErrorTips attCode_error"  style="right:-90px"><i></i>请填写正确的证件号码！</p>'+
                '            </section>'+
                '            <section class="authInput padding108">'+
                '                <figure class="al-tableItemContent">'+
                '                    <aside class="uploadImg ev-cerUploadCon">'+
                '                        <input type="hidden" value="" name="certificatesPath" class="certificatesPath" />'+
                '                        <div class="photoCont">'+
                '                            <figure><img src="/images/img10/authentication/certificate/'+option.demoImg[option.refId][0]+'">'+
                '                                <div class="sample">'+((option.refId==6||option.refId==8)?'第一页示例':'示例')+'</div>'+
                '                            </figure>'+
                '                            <!--上传后的图片 上传中添加类名 uploading-->'+
                '                            <figure class="uploadSuccess cer_upload">'+
                '                                <div class="czyx1">'+
                '                                    <div class="ev-upload hide">'+
                '                                        <!--蒙层-->'+
                '                                        <div class="uploadPopup">'+
                '                                            <p class="hide">上传失败<br/>'+
                '                                            请重新上传</p>'+
                '                                            <figure class="percentage loadingAnimate hide">'+
                '                                                <img src="//img10.allinmd.cn/v3/common/icon/icon_uploading.png">'+
                '                                                <!--<span>20%</span>-->'+
                '                                            </figure>'+
                '                                        </div>'+
                '                                        <!--关闭按钮-->'+
                '                                        <div class="popupClose hide"></div>'+
                '                                    </div>'+
                '                                    <input class="cer_po_input" type="file" name="file">'+
                '                                </div>'+
                '                            </figure>'+
                '                        </div>'+
                '                        <figure class="uploadPhoto">'+
                '                            <i></i>'+
                '                            <p>上传证件照</p>'+
                '                        </figure>'+
                '                        <div class="l_warning photo_error"><img src="//img10.allinmd.cn/v3/common/icon/error_tips.png"><span><label>请上传证件照片！</label></span></div>'+
                '                    </aside>'+
                (function(){
                    var str='';
                    if(option.refId==6||option.refId==8||option.refId==1){
                        str='<aside class="uploadImg ev-cerUploadCon">'+
                            '        <input type="hidden" value="" name="certificatesPath" class="certificatesPath" />'+
                            '         <div class="photoCont">'+
                            '             <figure><img src="/images/img10/authentication/certificate/'+option.demoImg[option.refId][1]+'"><div class="sample">'+((option.refId==6||option.refId==8)?'第二页示例':'示例')+'</div></figure>'+
                            '             <!--上传后的图片 上传中添加类名 uploading-->'+
                            '             <figure class="uploadSuccess cer_upload">'+
                            '                 <div class="czyx1">'+
                            '                     <div class="ev-upload hide">'+
                            '                         <!--蒙层-->'+
                            '                         <div class="uploadPopup">'+
                            '                             <p class="hide">上传失败<br/>'+
                            '                                 请重新上传</p>'+
                            '                             <figure class="percentage loadingAnimate hide">'+
                            '                                 <img src="//img10.allinmd.cn/v3/common/icon/icon_uploading.png">'+
                            '                                 <!--<span>20%</span>-->'+
                            '                             </figure>'+
                            '                         </div>'+
                            '                         <!--关闭按钮-->'+
                            '                         <div class="popupClose hide"></div>'+
                            '                     </div>'+
                            '                     <input class="cer_po_input" type="file" name="file">'+
                            '                 </div>'+
                            '             </figure>'+
                            '         </div>'+
                            '         <figure class="uploadPhoto">'+
                            '             <i></i>'+
                            '             <p>上传证件照</p>'+
                            '         </figure>'+
                            '         <div class="l_warning photo_error"><img src="//img10.allinmd.cn/v3/common/icon/error_tips.png"><span><label>请上传证件照片！</label></span></div>'+
                            '   </aside>';
                    }
                    return str;
                }())+
                '                </figure>'+
                '            </section>'+
                '        </section>';
            return str;
        },
        //获取用户证件信息
        secondInformation:function(){
            var t=this;
            var postData={
                pageSize:20
            };
            postData={paramJson:$.toJSON(postData)};
            $.ajax({
                url: t.path.getAuthAttachments,
                dataType: "json",
                type: "post",
                data:postData,
                success: function (data) {
                    if (data && data.responseObject&&data.responseObject.responseMessage.length>0) {
                        var newData =[];
                        var flag = false;
                        $.each(data.responseObject.responseMessage,function(ni,nel){
                            if(newData.length==0){
                                newData.push(nel);
                            }else{
                                $.each(newData,function(ji,jel){
                                    flag = false;
                                    if(jel.attType==nel.attType&&jel.attPositionType == nel.attPositionType){
                                        flag = true;
                                        if(Date.parse(jel.createTime.substring(0,19))>Date.parse(nel.createTime.substring(0,19))){//新数组中同一位置 图片时间> 老的时间 ==为新
                                            newData.splice(ji,1,jel);
                                        }else{
                                            newData.splice(ji,1,nel);
                                        }
                                        return false;
                                    }
                                });
                                if(!flag){
                                    newData.push(nel);
                                }
                            }
                        });
                        t.getAuthAttachments=newData;
                        $.each(newData,function(indexm,elem){
                            $.each($('.ev-attType'),function(index,ele){
                                elem.attType=(elem.attType==10?(t.medicalID=='10'?12:11):elem.attType);
                                if(elem.attType&&$('.ev-dataAttType',$(ele)).attr('data-attType')==elem.attType){
                                    if(elem.attCode){
                                        $('.attCode',$(ele)).val(elem.attCode).attr('data-oldcode',elem.attCode);
                                    }
                                    $('.certificatesPath',$(ele)).eq(elem.attPositionType-1).val(elem.attPath.replace("https://img05.allinmd.cn/","")).addClass('ev-upSuccess').attr('data-id',elem.id).attr('data-oldpath',elem.attPath.replace("https://img05.allinmd.cn/",""));
                                    $('.cer_po_input',$(ele)).eq(elem.attPositionType-1).parent().css("background-image",'url(' + elem.attPath + ')');
                                    t.addMask($('.cer_po_input',$(ele)).eq(elem.attPositionType-1));
                                }
                            })
                        })
                        t.secondSubmit();
                    }
                }
            });
        },
        //二次认证提示
        lastAuthStep:function(){
            var t=this;
            comm.LightBox.show(60,"#000");
            comm.LightBox.setZIndex(8);
            $("body").append('<section class="alPopupMain ev_trafficPop">'+
                '<figure class="close ev_trafficClose"><i></i></figure>'+
                '<article class="passSuccess"><i></i>恭喜你，提交成功</article>'+
                '<article class="authSuccessText">'+$("#fullName").val()+'老师，你的认证资料我们已经收到！审核通常需要1~3个工作日，请耐心等待。审核通过后，我们会以手机或邮件的方式通知你，再次感谢你对唯医的支持！<div>在审核期间，你可以享有浏览3分钟视频的特有权限哦~</div></article>'+
                '<button class="know ev_trafficClose">知道了</button>'+
                '</section>');
            comm.setCenter($(".ev_trafficPop"));
            $(".ev_trafficPop").css("zIndex",9);
            $(".ev_trafficClose").on("click",function(){
                if($(this).hasClass("close")){
                    //事件埋点
                    comm.creatEvent({
                        triggerType:"全站功能按钮点击",
                        keyword:"唯医通行证确认弹层关闭",
                        actionId:43,
                        async:false
                    });
                }
            })
        },
        //上传证件照片
        uploadAtt: function () {
            var t = this,uploadTime;
            $('p',$('.ev-upload')).hide();
            czyx.uploadReplace('.cer_po_input', {
                url: "/call/comm/upload_attachment/upload/?_=" + Math.random(), //文件处理的URL,
                data: {paramJson: $.toJSON({imageType: "2", domain: location.hostname})},
                uploadReplaceCss: {
                    //设置上传按钮图片
                    width: "216",             //上传按钮的宽度
                    height: "148.6",             //上传按钮的高度
                    backgroundSize:'100% 100%'
                },
                uploadInputCss: {
                    width: "216",             //上传按钮的宽度
                    height: "148.6"            //上传按钮的高度
                },
                uploadBefore: function () {
                    var fileSize = comm.file.getFileSize(this);
                    if (fileSize > 10485760) {
                        $(this).val('');
                        alert('图片不能大于' + 10485760 / 1048576 + "M");
                        return false;
                    }
                    if (!/\.((jpg)|(jpeg)|(png))$/i.test(this.value)) {
                        $(this).val('');
                        alert('只允许上传.jpg .jpeg .png类型的图片文件');
                        return false;
                    }
                    $('p',$('.ev-upload')).hide();
                    var cerUploadCon=$(this).parents('.ev-cerUploadCon'),$this=$(this);
                    $('.ev-upload,.loadingAnimate ,.uploadPopup',cerUploadCon).show();
                    uploadTime=setTimeout(function(){
                        if(!$('.certificatesPath',cerUploadCon).hasClass('ev-upSuccess')){
                            $('.ev-upload,.loadingAnimate',cerUploadCon).hide();
                            $('.ev-upload,p,.popupClose',cerUploadCon).show();
                            $('.popupClose',cerUploadCon).on('click',function(){

                                $('.certificatesPath',cerUploadCon).val('');
                                $this.val('');
                                $('.ev-upload,p,.popupClose',cerUploadCon).hide();
                                t.secondSubmit();
                            });
                        }
                    },2*60*1000)
                },
                uploadEnd: function (serverJson) {//上传完毕后调用
                    $('.ev-upload,.loadingAnimate',$(this).parents('.ev-cerUploadCon')).hide();
                    //$('.ev-upload,p,.popupClose',$(this).parents('.ev-cerUploadCon')).show();
                    serverJson = $.parseJSON(serverJson.split('<')[0]);
                    if (serverJson && serverJson.responseObject && serverJson.responseObject.responseMessage.path !== "") {
                        clearTimeout(uploadTime)
                        $(this).parents('.ev-cerUploadCon').find('.certificatesPath').val(serverJson.responseObject.responseMessage.path).addClass('ev-upSuccess');
                        $(this).parent().css("background-image",'url(' + serverJson.responseObject.responseMessage.url + ')');
                        if(comm.browser.isIe8()){
                            $(this).parent().css("filter",'progid:DXImageTransform.Microsoft.AlphaImageLoader(src=' + serverJson.responseObject.responseMessage.url + ',sizingMethod="scale")');
                        }
                        if(t.delAttIdList){//判断是否是修改图片
                            var dataId=$(this).parents('.ev-cerUploadCon').find('.certificatesPath').attr('data-id');
                            if(dataId){
                                $.each(t.delAttIdList,function (i,e) {
                                    if(e==dataId){
                                        t.delAttIdList.splice(i, 1);
                                    }
                                })
                            }
                        }
                        t.addMask($(this));
                        t.secondSubmit();
                    } else {
                        if (serverJson.message) {
                            alert(serverJson.message);
                        } else {
                            //alert("上传失败");
                            $('.ev-upload,p,.popupClose',$(this).parents('.ev-cerUploadCon')).show();
                        }
                    }
                },
                hoverOn:function(){

                },
                hoverOut:function(){

                }
            });
        },
        //图片上传成功后悬浮显示蒙层
        addMask: function (ele) {
            var t=this;
            $(".czyx1",ele.parents('.ev-cerUploadCon')).bind("mouseover", function () {
                var certificatesPath=$('.certificatesPath',ele.parents('.ev-cerUploadCon'));
                if(certificatesPath.val()){
                    if($("p",$(this)).css('display')=='none'){
                        //上传成功，蒙层消失
                        $(".uploadPopup",$(this)).hide();
                    }
                    $(".ev-upload,.popupClose",$(this)).show().on('click',function(){
                        if(certificatesPath.attr('data-id')&&t.delAttIdList.indexOf(certificatesPath.attr('data-id'))==-1){
                            t.delAttIdList.push(certificatesPath.attr('data-id'));
                        }
                        $('.certificatesPath',ele.parents('.ev-cerUploadCon')).val('').removeClass('ev-upSuccess');
                        ele.val('');
                        ele.parent().css("background-image",'url()');
                        ele.parents('.czyx1').css("background-image",'url(//img10.allinmd.cn/authentication/camera.png)');
                        $(this).hide();
                        t.secondSubmit();
                    });
                }
            }).bind("mouseout", function () {
                if($("p",$(this)).css('display')=='none'){
                    //上传成功，蒙层消失
                    $(".ev-upload",$(this)).hide();
                }
            });

        },
        //验证第一步是否发生改变
        checkFirstChange:function(option){
            var t=this;
            var cAuth = t.customerAuth;
            var _flag = false;
            if(
                (cAuth.lastName+cAuth.firstName)!=option.fullName||//年龄
                cAuth.sex!=option.sex|| //性别
                cAuth.birthYear.substr(0,10)!=option.birthday||               //年月日
                (option.company?(cAuth.company!=option.company):false)||        //单位
                (option.schoolName?(cAuth.schoolName!=option.schoolName):false)||  //学校
                cAuth.medicalTitle!=option.medicalTitle||  //职称
                cAuth.areasExpertise!=option.areasExpertise||     //专业
                cAuth.platformId!=option.platformId//专科
            ){
                _flag = true;
            }
            return _flag;
        },
        //验证第二步是否发生改变
        checkSecondChange:function(arr){
            var flag=false,t=this;
            if(t.getAuthAttachments&&arr.length==t.getAuthAttachments.length){
                $.each(arr,function(indexArr,eleArr){
                    $.each(t.getAuthAttachments,function(index,ele){
                        if(ele.attType==eleArr.attType&&ele.attPositionType==eleArr.attPositionType){
                            if(
                                ele.attCode!=eleArr.attCode||
                                ele.attPath!=eleArr.attPath
                            ){
                                flag=true;
                            }
                        }
                    })
                });
            }else {
                flag=true;
            }
           return flag;
        },
        //下一步状态判断
        submitConfig:function(){
            var auth=this.customerAuth;
            var submit=false;
            $("#ev-next").attr("submit","false").removeClass("active");
            var fullName=auth.lastName+auth.firstName;
            var unitType=0;
            if(auth.company){
                unitType=1;
            }else if(auth.schoolName){
                unitType=2;
            }
            var medicalTitle=auth.medicalTitle;
            var areasExpertise=auth.areasExpertise;
            var updateMedicalTitle = $("#ev-medTitle").attr("medicaltitle");
            var updateAreasExpertise01 = '';
            $("#ev-areaSed .tagName").each(function (i, em) {
                updateAreasExpertise01 += $(em).attr("tagid") + "_" + $("span",$(em)).text() + ",";
            });
            var updateAreasExpertise = updateAreasExpertise01.substring(0, updateAreasExpertise01.length - 1);
            submit=true;
            if(!$("#fullName").val()){
                submit=false;
            }
            if(!($("#authYear option:selected").val()!=""&&$("#authMonth option:selected").val()!=""&&$("#authDay option:selected").val()!="")){
                submit=false;
            }
            if(!this.unitType){
                submit=false;
            }
            if(this.unitType==1&&!$("#company").val()){
                submit=false;
            }
            if(this.unitType==2&&!$("#schoolName").val()){
                submit=false;
            }
            if(!updateMedicalTitle){
                submit=false;
            }
            if(!updateAreasExpertise){
                submit=false;
            }
            if(submit){
                $("#ev-next").attr("submit","true").addClass("active");
            }

        },
        //提交状态判定
        secondSubmit:function(){
            var isID1=/^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$/,//身份证校验
                isID2=/^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/i;
            var flaArr=[],
                flaArr2 =[],
                flaArr3=[]; //判断非身份证字段是否已填写，如果此字段无1，身份证字段填写完全也不能提交;
            $('#ev-thirdNext').removeClass('active').attr('on',false);
            $('html').removeAttr('emptyAttCode');
            $.each($('.ev-attType'),function(index,elem){
                if(index!=6){
                    if(
                        $(elem).find('.certificatesPath').length!=0 &&  //要上传图片 并且上传图片的数量与已上传的数量相同
                        $(elem).find('.certificatesPath').length==$(elem).find('.ev-upSuccess').length
                    ){
                        //身份证、医师执业证、医师资格证、医师职称证; 证件的证件号码为必填项，上传证件必须证件号加证件照片都填写
                        if($(elem).find('.attCode').length>0){
                            if($(elem).find('.attCode').val()!=""){//证件号码为必填 非空
                                $('#ev-thirdNext').addClass('active').attr('on',true);
                                flaArr.push(1);
                                flaArr2.push(1);
                                flaArr3.push(1);
                            }else{
                                flaArr.push(1);
                                flaArr2.push(0);
                                flaArr3.push(1);
                                $('html').attr('emptyAttCode',$(elem).attr('class'));
                            }
                        }else{
                            flaArr.push(1);
                            flaArr2.push(1);
                            flaArr3.push(1);
                            $('#ev-thirdNext').addClass('active').attr('on',true);
                        }
                    }else if($(elem).find('.ev-upSuccess').length<$(elem).find('.certificatesPath').length&&$(elem).find('.attCode').val()!=''&&$(elem).find('.attCode').length>0){//没传图片，有证件编号
                        $('html').attr('emptyAttCode',$(elem).attr('class'));
                        flaArr.push(1);
                        flaArr2.push(0);
                        flaArr3.push(1);
                    }else if($(elem).find('.ev-upSuccess').length<$(elem).find('.certificatesPath').length&&$(elem).find('.ev-upSuccess').length!=0 ){//只传一张
                        $('html').attr('emptyAttCode',$(elem).attr('class'));
                        flaArr.push(1);
                        flaArr2.push(0);
                        flaArr3.push(1);
                    }
                }else {
                    $.each($(elem),function(inde,eleme){//身份证上传2张并且 资质证明至少有一张
                        var _attCode = $(eleme).find('.attCode').val();
                        if(
                            ($(elem).find('.ev-upSuccess').length && $(elem).find('.ev-upSuccess').length!=2)||       // 只上传了一张
                            ($(elem).find('.ev-upSuccess').length==2&&!(isID1.test(_attCode)||isID2.test(_attCode)))       // 上传了2张，但身份证号不符
                        ){
                            if(flaArr3.indexOf(1)>-1){//判断非身份证字段已填写，身份证字段填写可激活按钮
                                flaArr.push(1);
                            }
                            flaArr2.push(0);
                            $('html').attr('emptyAttCode',$(elem).attr('class'));
                        }else if($(elem).find('.ev-upSuccess').length<2&&(isID1.test(_attCode)||isID2.test(_attCode))){//没传图片
                            $('html').attr('emptyAttCode',$(elem).attr('class'));
                            if(flaArr3.indexOf(1)>-1){//判断非身份证字段已填写，身份证字段填写可激活按钮
                                flaArr.push(1);
                            }
                            flaArr2.push(0);
                        }else if($(elem).find('.ev-upSuccess').length==1 ){//只传一张
                            $('html').attr('emptyAttCode',$(elem).attr('class'));
                            if(flaArr3.indexOf(1)>-1){//判断非身份证字段已填写，身份证字段填写可激活按钮
                                flaArr.push(1);
                            }
                            flaArr2.push(0);
                        }else if(_attCode&&$(elem).find('.ev-upSuccess').length<2){
                            $('html').attr('emptyAttCode',$(elem).attr('class'));
                            flaArr2.push(0);
                        }
                    });
                }
            });
            if(flaArr.indexOf(1)>-1){
                $('#ev-thirdNext').addClass('active');
            }
            if(flaArr2.indexOf(0)>-1){
                $('#ev-thirdNext').attr('on',false);
            }
        },
        //帮助
        helpAuth:function(){
            $('body').on('click',function(e){
                if($(e.target).hasClass('ev-help')){
                    $('.ev-helpInfo').toggle();
                    comm.creatEvent({
                        triggerName:'认证-帮助',
                        triggerType:"认证",
                        browType:$('#firstStep').css('display')=='block'?'10001':'10014',
                        actionId:2514
                    });
                }else {
                    $('.ev-helpInfo').hide();
                    if($(e.target).hasClass('ev-equity')){
                        var gradeBar = $(".al-auth-grade");
                        gradeBar.show();
                        $(".al-auth-grade-close").off("click").on("click",function(){
                            gradeBar.hide();
                        });
                    }
                }
            });

        },
        //结束
        end:function(){
            var contentCss="";
            var title="认证医师审核将在1个工作日内完成,请耐心等待";
            if($(".ev-imgAtt8 .ev-upSuccess").length==2&&
               $(".ev-imgAtt6 .ev-upSuccess").length==2&&
               $(".ev-imgAtt13 .ev-upSuccess").length==1&&
               $(".ev-imgAtt1 .ev-upSuccess").length==2
            ){//四证全
                if(this.isFirstAuth&&this.isFirstAuth==true){//首次认证
                    title="1个工作日后您可以免费浏览资源<br>执业医师审核将在3个工作日完成，请耐心等待";
                    contentCss="text-align:center";
                }else{
                    title="执业医师审核将在3个工作日内完成，请耐心等待";
                }
            }else{
                if(this.isFirstAuth&&this.isFirstAuth==true){//首次认证
                    title="认证医师审核将在1个工作日内完成,请耐心等待";
                }else{
                    title="认证医师审核将在1个工作日内完成,请耐心等待";
                }
            }

            comm.surePop({
                icon:1, //需要图标吗
                title:'提交成功',
                content:title,
                contentCss:contentCss,
                success:function(){
                    if(document.referrer){
                        if(document.referrer.lastIndexOf("html")>-1){
                            if(document.referrer.indexOf("pages/singlePage/upload-case.html")>-1){//来源页为病例发布页面，跳转回首页
                                setTimeout(function() {
                                    g_sps.jump(null, "/");
                                },500);
                            }else {
                                setTimeout(function() {
                                    g_sps.jump(null, document.referrer);
                                },500)
                            }
                        }else{
                            history.go(-1);
                        }
                    }else{
                        setTimeout(function() {
                            g_sps.jump(null, "/");
                        },500)
                    }
                }
            });
        }
    };
    newAuth.init();
});
