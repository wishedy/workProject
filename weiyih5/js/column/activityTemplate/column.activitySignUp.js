/**
 * 活动报名流程
 * Created by HJ on 2017/5/19.
 **/
$(function () {
    var cId = TempCache.getItem("userId");
    var authState = JSON.parse(TempCache.getItem("auth"))?JSON.parse(TempCache.getItem("auth")).state:"";
    var authName = JSON.parse(TempCache.getItem("auth"))?JSON.parse(TempCache.getItem("auth")).lastName+JSON.parse(TempCache.getItem("auth")).firstName:"";
    var actId = comm.getpara().actId;
    var tit = comm.getpara().tit;
    var activityId = actId.indexOf("#") > -1 ? actId.substr(actId, actId.indexOf("#")) : actId;
    var activitySignUp = {
        path: {
            getEventConfigList: M_CALL + "activity/event/getEventConfigList/",//报名流程步骤展示接口
            getProPertyList: M_CALL + "activity/property/getProPertyList/",//赛区类别级联选择
            updateBaseInfo: M_CALL + "activity/register/update/",//保存用户基本信息，无效用户基本信息接口
            getRegisterStatus: M_CALL + "activity/register/getRegisterStatus/",//判断用户是否报名的接口
            propertyCreate: M_CALL + "activity/registers/property/create/"//单独保存地区和术式的接口
        },
        init: function () {
            var t = this;
                user.privExecute({ //检测登录认证
                    operateType: 'auth',   //'login','auth','conference'
					noNeedBack:true,
                    callback: function () {
                        t.applyStateAjax();
                    }
                });
        },
        //报名状态请求
        applyStateAjax: function () {
            var t = this;
            var cBack = function (rep) {
                if (rep && rep.responseObject && rep.responseObject.responseData && !$.isEmptyObject(rep.responseObject.responseData)) {
                    t.applyProcess(rep.responseObject.responseData.registerStatus);//报名步骤流程
                }
            };
            comm.ajax.async(t.path.getRegisterStatus, {
                paramJson: $.toJSON({
                    customerId: cId,
                    activityId: activityId,
                    isValid:1
                })
            }, cBack);
        },
        //报名步骤流程请求
        applyProcess: function (kv) {
            var t = this;
            comm.loading.show();
            var param = {
                paramJson: $.toJSON({
                    activityId: activityId,
                    customerId: cId,
                    registerStatus: kv //1:没有报名,2:已经报名没有上传作品,3:即报名也上传了作品,4.报名已经结束 5.结果公示
                })
            };
            var callback = function (rep) {
                comm.loading.hide();
                if (rep && rep.responseObject && rep.responseObject.responseData
                    &&rep.responseObject.responseData.data_list&&rep.responseObject.responseData.data_list.length>0) {
                    t.processJudgeEvent(rep.responseObject.responseData.data_list);
                }
            };
            comm.ajax.async(t.path.getEventConfigList, param, callback);
        },
        //流程返回数据判断
        processJudgeEvent: function (rep) {
            var t = this;
            var arr = [];
            var html = "", html2 = "", optionalHtml1 = "", optionalHtml2 = "";
            var CategoryFlag = 0;
            $.each(rep, function (i, e) {
                if (e.eventProcessType == 1) {//报名流程type (1.海选报名、2.专家评审 、3.大众评选 、 4.现场展示和颁奖)
                    if (e.startStatus == -1 && e.endStatus == -1) {//报名流程开始,报名流程未结束
                        var _ev=e.cmsActivityEventConfig;
                        if(_ev.length){//列表存在数据
                            if (_ev.length == 1 && _ev[0].configType == 1 && _ev[0].configDataType == 4 && _ev[0].uploadType.split(",").length == 1){//只剩一个步骤上传一种资源
                                setTimeout(function () {
                                    g_sps.jump(null,"/html/m/activity/" + activityId + "/activity_index.html");
                                },500)
                            }else{
                                html = "";
                                html2 = "";
                                t.baseInfnFlag=false;
                                $.each(e.cmsActivityEventConfig, function (k, v) {
                                    if (v.configType == 1) {//configType：1报名信息，
                                        switch (parseInt(v.configDataType)) {//configDataType  1-报名基本信息,2-选择地区,3-选择类别,4-上传资源
                                            case 1:
                                                html += t.baseInfo(e, v, k);
                                                t.baseInfnFlag=true;
                                                break;
                                            case 2://赛区选择，单独步骤，不能直接循环大结构dom，只能单独写死步骤
                                                optionalHtml1 = '<section class="form ev-areaList"><span>赛区</span><div class="divisionName" contenteditable="true" placeholder="请选择赛区"></div> <i></i></section>';
                                                arr.push({rep: e, kv: v, lenNum: k});//两个index不同步骤融合成一个前端页面，需要记录循环此时的参数
                                                break;
                                            case 3://类别选择，单独步骤不能直接循环大结构dom，只能单独写死步骤
                                                optionalHtml2 = '<section class="form ev-category"><span>类别</span><div class="divisionName" contenteditable="true" placeholder="请选择类别"></div><i></i></section>';
                                                arr.push({rep: e, kv: v, lenNum: k});//两个index不同步骤融合成一个前端页面，需要记录循环此时的参数
                                                break;
                                            case 4:
                                                $.each(v.uploadType.split(','),function (i, kv) {
                                                    if(kv==2||kv==1){//上传的类型是文库或者视频
                                                        t.computerUpload=2;
                                                        return false;
                                                    }
                                                });
                                                if (v.uploadType.split(",").length == 1) {//只有一个type的时候
                                                    t.uploadType = v.uploadType;
                                                    t.onlyUpload=1;
                                                    t.onlyUploadNum=k;
                                                    switch (parseInt(v.uploadType)){
                                                        case 1:
                                                            t.uploadText = "上传视频";//上传文本
                                                            break;
                                                        case 2:
                                                            t.uploadText = "上传文库";//上传文本
                                                            break;
                                                        case 7:
                                                            t.uploadText = "上传病例";//上传文本
                                                            break;
                                                    }
                                                }
                                                break;
                                        }
                                    }
                                });
                             /*   if(!t.baseInfnFlag){
                                  g_sps.jump(null,"/html/m/activity/" + activityId + "/activity_index.html");
                                }*/
                                $(".ev-mainInner").append(html);
                                if($(".ev-signUp_baseInfo .ev-baseInfoSave").attr("data-save")=="upload"){
                                    $(".ev-signUp_baseInfo .ev-baseInfoSave").text(t.uploadText);
                                }

                                if (arr.length) {//循环中后台不同的步骤，要前端融合成一步，非常规办法
                                    if(parseInt(arr[0].lenNum)>0){//选择赛区类别前边有步骤
                                        if(t.onlyUpload==1){//第一步上传 不展示的时候
                                            if($(".ev-processBox").length){
                                                if(arr[0].lenNum==1&&t.onlyUploadNum==0){//上传为第一步，并且只有一个上传项
                                                    $(".ev-processBox").eq(0).before(t.areaBoxHtml(optionalHtml1, optionalHtml2, arr[arr.length - 1]));
                                                }else{
                                                    $(".ev-mainInner").append(t.areaBoxHtml(optionalHtml1, optionalHtml2, arr[arr.length - 1]));
                                                }
                                            }else{
                                                $(".ev-mainInner").append(t.areaBoxHtml(optionalHtml1, optionalHtml2, arr[arr.length - 1]));
                                            }
                                        }else{//否则正常显示
                                          /*  if($(".ev-processBox").length){
                                                $(".ev-processBox").eq(0).after(t.areaBoxHtml(optionalHtml1, optionalHtml2, arr[arr.length - 1]));
                                            }else{*/
                                                $(".ev-mainInner").append(t.areaBoxHtml(optionalHtml1, optionalHtml2, arr[arr.length - 1]));

                                            // }
                                        }
                                    }else{//选择赛区类别前没有步骤的情况
                                        if(parseInt(arr[0].lenNum)==0){
                                            if($(".ev-processBox").length){
                                                $(".ev-processBox").eq(0).before(t.areaBoxHtml(optionalHtml1, optionalHtml2, arr[arr.length - 1]));
                                            }else{
                                                $(".ev-mainInner").append(t.areaBoxHtml(optionalHtml1, optionalHtml2, arr[arr.length - 1]));
                                            }
                                        }
                                    }
                                }
                                $(".ev-mainInner>section").eq(0).show();//显示第一个流程
                                // t.baseInfoEvent();
                                t.submitStatus();
                                t.processShowHandle();
                                return false;
                            }
                        }else{//列表不存在数据步骤的情况
                            setTimeout(function () {
                                    g_sps.jump(null,"/html/m/activity/" + activityId + "/activity_index.html");
                                    },500)

                        }
                    } else {//报名流程结束或者未开始
                        setTimeout(function () {
                            g_sps.jump(null,"/html/m/activity/" + activityId + "/activity_index.html");
                        },500)
                    }
                }
            });
        },
        //报名进程的相关展示
        processShowHandle: function () {
            var t = this;
            var _seType = $(".ev-mainInner>section");//流程展示操作的section
            $.each(_seType, function (i, e) {//循环处理事件
                //返回按钮点击操作
                $(e).find(".ev-backBtn").off("click").on("click", function () {
                    if (i == 0) {//返回历史页面
                        comm.confirmBox({
                            title: "取消报名将删除所填信息<br/>是否确认取消",
                            cancel: "考虑一下",// 取消按钮文本 {string}
                            ensure: "去意已决",// 确认按钮文本 {string}
                            ensureCallback: function () {// 确认执行回调 {Function}
                                window.location.href = "//m.allinmd.cn/html/m/activity/" + activityId + "/activity_index.html";
                            }
                        });
                    } else {//返回上一步骤
                        $(e).hide().prev(".ev-processBox").show();
                    }
                });
                //当前可见的流程是哪一块
                if ($(e).is(":visible")) {
                    switch (parseInt($(e).attr("data-typeFlag"))) {//前端自定义类型
                        case 1://报名基本信息
                            t.baseInfoEvent();//基本信息的相关操作
                            t.submitStatus();//提交按钮状态监测
                            t.submitReg();//提交按钮提交时进行验证
                            break;
                      /*  case 2://上传类型选择
                            t.uploadTypeEvent();
                            break;*/
                        case 3://赛区和类别选择
                            t.areaEvent();
                            break;
                        case 4://报名成功提示页
                            break;
                    }
                }
            });
        },
        //报名基本信息的相关操作和事件
        baseInfoEvent: function () {
            var t = this;
            var _mT = $(".ev-medicalTitle");
            var _com = $(".ev-company");
            var _sYear = $(".selectYear");
            var _sMonth = $(".selectMonth");
            var _nameReg=/^[\u4e00-\u9fa5\s\·-]{1,25}$|^[\@A-Za-z_\s\·-]{1,50}$/;
            $(".ev-nameNum").on("input",function(){
                if(!_nameReg.test($(".ev-nameNum").val())){
                    $(".ev-nameNum").css("color", "#ff0000").addClass("ev-noSub");
                }else{
                    $(".ev-nameNum").css("color", "#222").removeClass("ev-noSub");
                }
                t.submitStatus();
            });
            //医师职称点击获取
            module.medicalTitle({
                container: _mT,
                fn: function () {//处理职称改变后的状态监测
                    t.submitStatus();
                }
            });
            //连带职称默认选中
            var medical = _mT.attr("medicalTitle");
            var medical1 = medical ? medical.split(",") : [];
            var ids = [];
            $.each(medical1, function (i, val) {
                if (val) {
                    if (val.split("_")[1]) {
                        ids.push(val.split("_")[0]);
                    }
                }
            });
            $(".ev-medBox figcaption").each(function (i, em) {
                $.each(ids, function (j, val) {
                    if ($(em).attr("medicalid") == val) {
                        $(em).parent().attr("select", "yes");
                        $(em).parent().addClass("selected");
                    }
                });
            });
            //医师医院点击获取
            _com.parents("article").on("click", function () {
                $(".ev-mainInner").hide();
                $(".ev-companyInner").show();
            });
            module.addCompany({
                container: _com,
                fn: function () {//处理医院选择改变后的状态监测
                    t.submitStatus();
                }
            });
            //临床时间选择
            if (_sYear.length && _sMonth.length) {
                ymd({
                    year: _sYear,
                    month: _sMonth,
                    default1: 1,
                    fn: function () {
                        t.submitStatus();//更改时间选择时监测状态
                    }
                });
                gettime(_sYear, _sYear.attr("data-sDate").substring(0, 4));
                gettime(_sMonth, _sYear.attr("data-sDate").substring(5, 7));
            }
            //input的变更事件（电话，姓名，邮件）
            $(".ev-validateInput").on("input", function () {
                t.submitStatus();
                $(this).css("color", "#222");
                $(this).siblings("span").css("color", "#555");
            });
        },
        //报名基本信息下一步按钮激活判断
        submitStatus: function () {
            var t = this;
            var inputSubmit = false, infoSubmit1= false,infoSubmit2= false, yearSubmit = false, yearNoEXist = false;
            //检测input是否有值
            $(".ev-validateInput").each(function (i, e) {
                if ($.trim($(e).val())) {
                    inputSubmit = true;
                    return false;
                } else {
                    inputSubmit = false;
                }
            });
            //检测职称和医院是否完善
            if($.trim($(".ev-medicalTitle").attr("medicalTitle"))){
                infoSubmit1 = true;
                $(".ev-medicalTitle").siblings("span").css("color","#555");
            }else{
                infoSubmit1 = false;
            }
            if($.trim($(".ev-company").attr("company"))){
                infoSubmit2 = true;
                $(".ev-company").siblings("span").css("color","#555");
            }else{
                infoSubmit2 = false;
            }

            //检测日期是否填写
            if ($(".selectYear").length && $(".selectMonth").length) {
                if ($(".selectYear option:selected").val() && $(".selectMonth option:selected").val()) {
                    yearSubmit = true;
                } else {
                    yearSubmit = false;
                }
            } else {
                yearNoEXist = true;//时间不存在
            }
            //下一步按钮置灰高亮操作
            if (inputSubmit ||infoSubmit1||infoSubmit2 || (yearSubmit || yearNoEXist)||!$(".ev-nameNum").hasClass("ev-noSub")) {
                $(".ev-baseInfoSave").addClass("activation");
                t.submitReg();
            } else {
                $(".ev-baseInfoSave").removeClass("activation");
            }
        },
        //报名基本信息的提交按钮验证正则
        submitReg: function () {
            var _seType = $(".ev-mainInner>section");//流程展示操作的section
            var _baseInSave = $(".ev-baseInfoSave");
            var t = this;
            var _evMb = $(".ev-mobileNum"),
                _evEm = $(".ev-emailNum"),
                _evNa = $(".ev-nameNum"),
                _evCo = $(".ev-company"),
                _evMe = $(".ev-medicalTitle");
            _baseInSave.off("click").on("click", function () {
                if ($(this).hasClass("activation")) {//激活状态下
                    var _mb = _evMb.val(),//电话
                        _em = _evEm.length?_evEm.val():'',//邮箱
                        _name = _evNa.val(),
                        _companyId = _evCo.attr("companyId"),
                        _company = _evCo.attr("company"),
                        _medicalTitle = _evMe.attr("medicalTitle"),
                        _clinicalYear =($(".selectYear").length&&$(".selectYear option:selected").val()&&$(".selectMonth option:selected").val())?($(".selectYear option:selected").val() + '-' + $(".selectMonth option:selected").val() + '-01 00:00:00'):'';
                    var param = {
                        activityId: activityId,
                        customerId: cId,
                        name: _name,
                        companyId: (_companyId&&!$.isEmptyObject(_companyId))?_companyId:0,
                        company: _company,
                        medicalTitle: _medicalTitle,
                        contactMobile: _mb
                    };
                    if(_evEm.length&&$(".selectYear").length){
                        if(_name&&_medicalTitle&&_company&&_mb&&_em&&_clinicalYear&&!$(".ev-nameNum").hasClass("ev-noSub")){//姓名、职称、医院、电话、邮箱、临床时间都存在
                            param.contactEmail  = _em;
                            param.clinicalYear = _clinicalYear;
                            t.baseInfoCommit(param);
                        }else{//循环列表项判断空
                            t.baseInfoNone();
                        }
                    }else if (_evEm.length) {//判断自定义邮件选项在不在的传参
                        if(_name&&_medicalTitle&&_company&&_mb&&_em&&!$(".ev-nameNum").hasClass("ev-noSub")) {//姓名、职称、医院、电话、邮箱存在
                            param.contactEmail = _em;
                            t.baseInfoCommit(param);
                        }else{//循环列表项判断空
                            t.baseInfoNone();
                        }
                    }else if ($(".selectYear").length) {//判断临床时间在不在的传参
                        if(_name&&_medicalTitle&&_company&&_mb&&_clinicalYear&&!$(".ev-nameNum").hasClass("ev-noSub")) {//姓名、职称、医院、电话、临床时间存在
                            param.clinicalYear = _clinicalYear;
                            t.baseInfoCommit(param);
                        }else{//循环列表项判断空
                            t.baseInfoNone();
                        }
                    }else{
                        if(_name&&_medicalTitle&&_company&&_mb&&!$(".ev-nameNum").hasClass("ev-noSub")) {//姓名、职称、医院、电话、临床时间存在
                            t.baseInfoCommit(param);
                        }else{//循环列表项判断空
                            t.baseInfoNone();
                        }
                    }
                }
            });
        },
        //确认提交基本信息请求
        baseInfoCommit:function(param){
            var _baseInSave = $(".ev-baseInfoSave");
            var t=this, _evEm = $(".ev-emailNum"),_em = _evEm.length?_evEm.val():'',_evMb = $(".ev-mobileNum"),_mb = _evMb.val();
            var emailReg = /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/;
            // var mobileReg = /^(127|13[0-9]|14[0-9]|15[0-9]|18[0-9]|17[0-9])\d{8}$/;
            var mobileReg = /^1\d{10}$/;
            var paramData = {paramJson: $.toJSON(param)};
            var flage = _evEm.length?emailReg.test(_em):true;//自定义邮箱判断
            var flagm = mobileReg.test(_mb);
            if (flage && flagm) {//正则通过
                comm.loading.show();
                var callback = function (rep) {
                    comm.loading.hide();
                    if (rep && rep.responseObject.responseStatus) {
                        if (_baseInSave.attr("data-save") == "upload") {//上传按钮  ||_baseInSave.attr("data-save") == "next"
                            t.appPop();
                        } else if (_baseInSave.attr("data-save") == "save") {//保存按钮
                            t.signUpSuc();
                        } else if (_baseInSave.attr("data-save") == "next") {//下一步按钮
                            _baseInSave.parents(".ev-signUp_baseInfo").hide().next(".ev-processBox").show();
                            t.processShowHandle();
                        }
                    }
                };
                comm.ajax.async(t.path.updateBaseInfo, paramData, callback);
            } else {//正则未通过
                if (!flage) {//邮箱不规范提示
                    _evEm.css("color", "#ff0000");
                    _evEm.siblings("span").css("color", "#ff0000");
                    popup("请填写正确的邮箱");
                }
                if (!flagm) {//手机不规范提示
                    _evMb.css("color", "#ff0000");
                    _evMb.siblings("span").css("color", "#ff0000");
                    popup("请填写正确的手机号码");
                }
            }
        },
        //基本信息为空为空循环进行提示
        baseInfoNone:function(){
            var t=this;
            var inputSubmit = true, infoSubmit1 = true, infoSubmit2 = true,yearSubmit = true;
            //检测input是否有值
            $(".ev-validateInput").each(function (i, e) {
                if ($.trim($(e).val())) {
                    $(e).siblings("span").css("color","#555");
                }else{//有为空的进行提示
                    $(e).siblings("span").css("color","#ff0000");
                    inputSubmit=false;
                }
            });
            //检测职称和医院是否完善
            if($.trim($(".ev-medicalTitle").attr("medicalTitle"))){
                $(".ev-medicalTitle").siblings("span").css("color","#555");
            }else{
                $(".ev-medicalTitle").siblings("span").css("color","#ff0000");
                infoSubmit1 = false;
            }
            if($.trim($(".ev-company").attr("company"))){
                $(".ev-company").siblings("span").css("color","#555");
            }else{
                $(".ev-company").siblings("span").css("color","#ff0000");
                infoSubmit2 = false;
            }
            //检测日期是否填写
            if ($(".selectYear").length && $(".selectMonth").length) {
                if ($(".selectYear option:selected").val() && $(".selectMonth option:selected").val()) {
                    $(".selectYear").siblings("span").css("color","#555");
                } else {
                    $(".selectYear").siblings("span").css("color","#ff0000");
                    yearSubmit = false;
                }
            } else {
                yearSubmit = false;
            }
            //下一步按钮置灰高亮操作
            if (!inputSubmit ||!infoSubmit1||!infoSubmit2 || !yearSubmit||$(".ev-nameNum").hasClass("ev-noSub")) {
                if($(".ev-nameNum").hasClass("ev-noSub")&&$(".ev-nameNum").val()){
                    popup("请填写正确的姓名");
                }else{
                    popup("请完整填写所有内容后再提交");
                }
            }
        },
        //一大堆dom结构
        //基本信息
        baseInfo: function (rep, kv, lenNum) {//rep大外层，kv内层报名基本信息类型，cusForm用户自定义选项是否显示
            var t = this;
            var cusForm = kv.customForm.split(",");
            var cusFormHtml = "";
            $.each(cusForm, function (i, e) {//cusForm：1是邮箱，2是临床时间是吧
                switch (parseInt(e)) {
                    case 1:
                        cusFormHtml += '<article class="form"><span>邮箱</span>' +
                            '<input type="text" class="ev-validateInput ev-emailNum" placeholder="请输入邮箱" value="' + rep.customer_auth.qualificationCode + '"></article>';
                        break;
                    case 2:
                        cusFormHtml += '<article class="form"><span>临床时间</span><select class="selectYear" data-sDate="' + rep.customer_auth.clinicalYear + '"></select><b>年</b>' +
                            '<select class="selectMonth"></select><b>月</b><b>-- 至今 </b></article>';
                        break;
                }
            });
            //uploadType 上传的类型选择
            var uploadType = kv.uploadType.split(",");
            //判断报名基本信息的时候，是不是只有上传和基本信息
            var upLoadBtn = false;
            var upLoadBtnNum="";
            var uploadText="",uploadTextFlag="";
            $.each(rep.cmsActivityEventConfig, function (k, v) {
                if (v.configDataType == 4) {
                    upLoadBtn = true;
                    upLoadBtnNum=k;
                    return false;
                }
            });
            if((upLoadBtn&&upLoadBtnNum==rep.cmsActivityEventConfig.length - 1&&rep.cmsActivityEventConfig.length -2 == lenNum)||(upLoadBtn&&rep.cmsActivityEventConfig.length - 1 == lenNum)){
                if(t.uploadText){
                    uploadText=t.uploadText;
                }else{
                    uploadText="立即上传";
                }
                uploadTextFlag="upload";
            }else if(rep.cmsActivityEventConfig.length - 1 == lenNum){
                uploadText="保存";
                uploadTextFlag="save";
            }else{
                uploadText="下一步";
                uploadTextFlag="next";
            }

            var baseInfoHtml;
            baseInfoHtml = '<!--报名基本信息开始-->' +
                '<section class="ev-processBox ev-signUp_baseInfo" style="display: none;" data-typeFlag="1">' +
                '<header class="al-indexHeader">' +
                '<figure class="al-indexHeaderItem">' +
                '<a class="ev-backBtn" href="/html/m/activity/' + activityId + '/activity_index.html">' +
                '<img src="/images/img50/pages/personal/arrow_back.png">' +
                '</a>' +
                '</figure>' +
                '<figure class="al-indexHeaderItem">' +
                '<h1>' + rep.cmsActivityEvent.eventName + '</h1>' +
                '</figure>' +
                '<figure class="al-indexHeaderItem">' +
                '</figure>' +
                '</header>' +
                '<section class="signUpMsg">' +
                '<aside class="title">' + kv.configIntro + '</aside>' +
                '<article class="form"><span>姓名</span><input type="text" class="ev-validateInput ev-nameNum" placeholder="请输入姓名" value="' + rep.customer_auth.lastName + rep.customer_auth.firstName + '"></article>' +
                '<article class="form"><span>职称</span><div class="doctorInfo ev-medicalTitle" contenteditable="true" placeholder="请选择职称" medicalTitle="' + rep.customer_auth.medicalTitle + '">' + comm.cutLine(rep.customer_auth.medicalTitle, "_", "，") + '</div><i></i></article>' +
                '<article class="form"><span>医院</span><div class="doctorInfo ev-company" contenteditable="true" placeholder="请选择医院" companyId="' +(( rep.customer_auth.companyId&&!$.isEmptyObject( rep.customer_auth.companyId))? rep.customer_auth.companyId:0) + '" company="' + rep.customer_auth.company + '">' + rep.customer_auth.company + '</div><i></i></article>' +
                '<article class="form"><span>电话</span><input type="text" class="ev-validateInput ev-mobileNum" placeholder="请输入电话" value="' + rep.customer_auth.certificatesCode + '"></article>' +
                cusFormHtml +//用户自定义显示表单
                '</section>' +
                '<button class="signUpEnter ev-baseInfoSave" data-save="' + uploadTextFlag+ '">' +
                uploadText + '</button>' +
                '</section>' +
                '<!--报名基本信息结束-->';
            return baseInfoHtml;
        },
        //报名成功提示
        signUpSuc: function () {
            var t=this;
            var num = 5;
            var successHtml;
            successHtml = '<!--报名成功提示页开始-->' +
                '<section class="ev-processBox ev-signUp_success">' +
                '<header class="al-indexHeader">' +
                '<figure class="al-indexHeaderItem"></figure>' +
                '<figure class="al-indexHeaderItem">' +
                '<h1>' + $(".ev-processBox").eq(0).find("h1").text() + '</h1>' +
                '</figure>' +
                '<figure class="al-indexHeaderItem"></figure>' +
                '</header>' +
                '<section class="signUPSuccess">' +
                '<aside>恭喜'+ (authName?authName:'您')+'</aside>' +
                '<aside>报名成功</aside>' +
                '<aside>' +
                '<a href="/html/m/activity/' + activityId + '/activity_index.html">返回首页</a></aside>' +
                '</section>' +
                '</section>' +
                '<!--报名成功提示页结束-->';
            $(".ev-mainInner").html(successHtml);
        },
      /*  //选择上传类型选择
        uploadTypeEvent: function () {
            var t = this;
            $(".ev-typeList li").off("click").on("click", function () {
                if ($(this).parents(".ev-typeList").attr("data-last") != 1) {//选择步骤不是最后一个流程的情况
                    t.uploadType = $(this).attr("data-refTy");
                    if (t.uploadType == 1) {//视频
                        $(".ev-areaUploadBtn").text("上传视频");
                    }
                    if (t.uploadType == 2) {//文库
                        $(".ev-areaUploadBtn").text("上传文库");
                    }
                    if (t.uploadType == 4) {//话题
                        $(".ev-areaUploadBtn").text("上传话题");
                    }
                    if (t.uploadType == 7) {//病例
                        $(".ev-areaUploadBtn").text("上传病例");
                    }
                    if(t.upTypeChange){
                        if(t.upTypeChange==t.uploadType){//没有更改点击按钮，两次点击了同一个类型按钮
                            $(this).parents(".ev-upTypeBtn").hide().next(".ev-processBox").show();
                        }else{//两次点击，更改了类型按钮
                            $(this).parents(".ev-upTypeBtn").hide().next(".ev-processBox").show();
                            $(".divisionName").text("");//重新滞空选择的数据
                            $(".ev-areaPop,.ev-kindPop").remove();
                            t.areaActStatus();
                            t.upTypeChange=t.uploadType;//重新赋值方便判断
                        }
                    }else{//首次点击
                        $(this).parents(".ev-upTypeBtn").hide().next(".ev-processBox").show();
                        t.upTypeChange=t.uploadType;//首次赋值方便判断上一步按钮返回重选判断
                        t.processShowHandle();
                    }
                } else {//最后一个步骤的时候（直接提示上传）
                    t.appPop();
                }
            });
        },*/
        //赛区选择的事件
        areaEvent: function () {
            var t = this;
            var _area = $(".ev-areaList"),
                _cate = $(".ev-category");
            var param = {
                activityId: activityId,
                treeLevel: 1,
                parentId: 0
            };
            //地区列表
            if (_area.length) {
                _area.off("click").on("click", function () {
                    if (!$(".ev-areaPop").length||t.upTypeAreaChange!=t.uploadType) {//没加载过选择弹层
                        param.activityType = 8;
                        t.areaListAjax(param);
                        t.upTypeAreaChange=t.uploadType;//判断选择类型有没有变换
                    } else {//已经加载过选择弹层
                        $(".ev-areaPop").addClass("on");
                        $(".ev-kindPop").removeClass("on");
                        t.areaListClick(param.activityType);
                        $("body,html").css({
                            overflow:"hidden",
                            height:"100%"
                        });
                        $(".ev-areaPop,.ev-kindPop").on("touchmove",function(e){
                            e.stopPropagation();
                        });
                    }
                });
            }
            //类别选择
            if (_cate.length) {
                _cate.off("click").on("click", function () {
                    if (!$(".ev-kindPop").length||t.upTypeKindChange!=t.uploadType) {//没加载过选择弹层
                        t.upTypeKindChange=t.uploadType;//判断选择类型有没有变换
                        param.activityType = t.uploadType;
                        t.areaListAjax(param);
                    } else {//已经加载过选择弹层
                        $(".ev-kindPop").addClass("on");
                        $(".ev-areaPop").removeClass("on");
                        t.areaListClick(param.activityType);
                        $("body,html").css({
                            overflow:"hidden",
                            height:"100%"
                        });
                        $(".ev-areaPop,.ev-kindPop").on("touchmove",function(e){
                            e.stopPropagation();
                        });
                    }
                });
            }
            var activity,_areaL,param1,param2,param3,_kindsL,params1,params2,params3;
            //上传按钮点击事件
            $(".ev-areaUploadBtn").off("click").on("click", function () {
                if ($(this).hasClass("activation")) {//激活状态下的
                    var _upBtnFlag = false;
                    $.each($(".divisionName"), function (i, e) {
                        if ($(e).text()) {
                            _upBtnFlag = true;
                        } else {
                            _upBtnFlag = false;
                            return false;
                        }
                    });
                    if(_upBtnFlag){
                     /*   activity = {
                            "activityId": activityId
                        };
                        //赛区字段存在
                        if ($(".ev-areaList").length) {
                            _areaL = $(".ev-areaList .divisionName");//赛区class
                            activity.property_area = {};
                            //一级菜单项存在
                            if (_areaL.attr("data-allinfo1")) {
                                param1 = JSON.parse(_areaL.attr("data-allinfo1"));
                                activity.property_area.property_area_1 = [{
                                    propertyName:_areaL.attr("data-thisText1"),
                                    parentId: param1.parentId,
                                    propertyFullPath: param1.pFPath,
                                    propertyId: param1.prId
                                }];
                            }
                            //二级菜单项存在
                            if (_areaL.attr("data-allinfo2")) {
                                param2 = JSON.parse(_areaL.attr("data-allinfo2"));
                                activity.property_area.property_area_2 = [{
                                    propertyName:_areaL.attr("data-thisText2"),
                                    parentId: param2.parentId,
                                    propertyFullPath: param2.pFPath,
                                    propertyId: param2.prId
                                }];
                            }
                            //三级菜单项存在
                            if (_areaL.attr("data-allinfo3")) {
                                param3 = JSON.parse(_areaL.attr("data-allinfo3"));
                                activity.property_area.property_area_3 = [{
                                    propertyName:_areaL.attr("data-thisText3"),
                                    parentId: param3.parentId,
                                    propertyFullPath: param3.pFPath,
                                    propertyId: param3.prId
                                }];
                            }
                        }
                        //类别字段存在
                        if ($(".ev-category").length) {
                            _kindsL = $(".ev-category .divisionName");//赛区class
                            activity.property = {};
                            if (_kindsL.attr("data-allinfo1")) {//一级菜单存在
                                params1 = JSON.parse(_kindsL.attr("data-allinfo1"));
                                activity.property.property_1 = [{
                                    propertyName:_kindsL.attr("data-thisText1"),
                                    parentId: params1.parentId,
                                    propertyFullPath: params1.pFPath,
                                    propertyId: params1.prId
                                }];
                            }
                            if (_kindsL.attr("data-allinfo2")) {//二级菜单存在
                                params2 = JSON.parse(_kindsL.attr("data-allinfo2"));
                                activity.property.property_2 = [{
                                    propertyName:_kindsL.attr("data-thisText2"),
                                    parentId: params2.parentId,
                                    propertyFullPath: params2.pFPath,
                                    propertyId: params2.prId
                                }];
                            }
                            if (_kindsL.attr("data-allinfo3")) {//三级菜单存在
                                params3 = JSON.parse(_kindsL.attr("data-allinfo3"));
                                activity.property.property_3 = [{
                                    propertyName:_kindsL.attr("data-thisText3"),
                                    parentId: params3.parentId,
                                    propertyFullPath: params3.pFPath,
                                    propertyId: params3.prId
                                }];
                            }
                        }*/

                        if ($(this).attr("data-save") == "upload") {//上传按钮
                            t.saveAreaAjax("upload");

                        } else if ($(this).attr("data-save") == "save") {//保存按钮
                            t.saveAreaAjax();

                        } else if ($(this).attr("data-save") == "next") {//下一步按钮
                            $(this).parents(".ev-areasChooose").hide().next(".ev-processBox").show();
                            TempCache.setItem("activity", JSON.stringify(activity));
                            if(!t.firstNextClick){//第一次点击判断，避免触发报名基本信息
                                t.processShowHandle();
                                t.firstNextClick=1;
                            }
                        }
                    }else{//验证没有
                        var _upBtnFlagNo=true;
                        $.each($(".divisionName"), function (i, e) {
                            if ($(e).text()) {
                                $(e).siblings("span").removeClass("redMark");
                            } else {
                                _upBtnFlagNo = false;
                                $(e).siblings("span").addClass("redMark");
                                return false;
                            }
                        });
                        if(!_upBtnFlagNo){
                            popup("请完整填写所有内容后再提交");
                        }
                    }
                }
            });
        },
        //请求赛区和类别数据的接口
        areaListAjax: function (param) {
            var t = this;
            comm.loading.show();
            //当activityId为万里挑一的活动则获取对应阿里oss下的数据不走接口（解决接口响应过慢问题）
            if(activityId == '1549964316941'&&param.activityType == 8){
                $.ajax({
                    url: '//img05.allinmd.cn/yunying/activityAreaList.json',
                    type: "get",//请求方式为get
                    dataType: "json", //返回数据格式为json
                    success: function (rep) {
                        comm.loading.hide();
                        if (rep && rep.responseObject&&rep.responseObject.responseData&&rep.responseObject.responseData.data_list
                            &&rep.responseObject.responseData.data_list.length > 0) {
                            if (param.activityType == 8) {//地区列表请求
                                $(".ev-mainInner").append(t.areaPop(rep.responseObject.responseData.data_list, 8));
                                t.areaListClick(param.activityType);
                                $(".ev-areaPop").addClass("on");
                                $(".ev-kindPop").removeClass("on");
                            } else {//上传类型
                                $(".ev-mainInner").append(t.areaPop(rep.responseObject.responseData.data_list, param.activityType));
                                t.areaListClick(param.activityType);
                                $(".ev-kindPop").addClass("on");
                                $(".ev-areaPop").removeClass("on");
                            }
                            $("body,html").css({
                                overflow:"hidden",
                                height:"100%"
                            });
                            $(".ev-areaPop,.ev-kindPop").on("touchmove",function(e){
                                e.stopPropagation();
                            });
                        }
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        console.log('失败');
                        comm.loading.hide();
                        popup('数据请求失败')
                    }
                })
            }else{
                var callback = function (rep) {
                    comm.loading.hide();
                    if (rep && rep.responseObject&&rep.responseObject.responseData&&rep.responseObject.responseData.data_list
                        &&rep.responseObject.responseData.data_list.length > 0) {
                        if (param.activityType == 8) {//地区列表请求
                            $(".ev-mainInner").append(t.areaPop(rep.responseObject.responseData.data_list, 8));
                            t.areaListClick(param.activityType);
                            $(".ev-areaPop").addClass("on");
                            $(".ev-kindPop").removeClass("on");
                        } else {//上传类型
                            $(".ev-mainInner").append(t.areaPop(rep.responseObject.responseData.data_list, param.activityType));
                            t.areaListClick(param.activityType);
                            $(".ev-kindPop").addClass("on");
                            $(".ev-areaPop").removeClass("on");
                        }
                        $("body,html").css({
                            overflow:"hidden",
                            height:"100%"
                        });
                        $(".ev-areaPop,.ev-kindPop").on("touchmove",function(e){
                            e.stopPropagation();
                        });
                    }
                };
                comm.ajax.async(t.path.getProPertyList, {paramJson: $.toJSON(param)}, callback);
            }
            // var callback = function (rep) {
            //     comm.loading.hide();
            //     if (rep && rep.responseObject&&rep.responseObject.responseData&&rep.responseObject.responseData.data_list
            //         &&rep.responseObject.responseData.data_list.length > 0) {
            //         if (param.activityType == 8) {//地区列表请求
            //             $(".ev-mainInner").append(t.areaPop(rep.responseObject.responseData.data_list, 8));
            //             t.areaListClick(param.activityType);
            //             $(".ev-areaPop").addClass("on");
            //             $(".ev-kindPop").removeClass("on");
            //         } else {//上传类型
            //             $(".ev-mainInner").append(t.areaPop(rep.responseObject.responseData.data_list, param.activityType));
            //             t.areaListClick(param.activityType);
            //             $(".ev-kindPop").addClass("on");
            //             $(".ev-areaPop").removeClass("on");
            //         }
            //         $("body,html").css({
            //             overflow:"hidden",
            //             height:"100%"
            //         });
            //         $(".ev-areaPop,.ev-kindPop").on("touchmove",function(e){
            //             e.stopPropagation();
            //         });
            //     }
            // };
            // comm.ajax.async(t.path.getProPertyList, {paramJson: $.toJSON(param)}, callback);
        },
        //赛区列表，专业术式
        areaListClick: function (acType) {
            var t = this;
            var _nav1 = acType == 8 ? $(".ev-areaPop .ev-navTab1") : $(".ev-kindPop .ev-navTab1"),
                _nav2 = acType == 8 ? $(".ev-areaPop .ev-navTab2") : $(".ev-kindPop .ev-navTab2"),
                _nav3 = acType == 8 ? $(".ev-areaPop .ev-navTab3") : $(".ev-kindPop .ev-navTab3"),
                _nav4 = acType == 8 ? $(".ev-areaPop .ev-navTab4") : $(".ev-kindPop .ev-navTab4"),
                _aPop = $(".ev-areaPop"),
                _kPop = $(".ev-kindPop");
            var hideVal1,
                hideVal2,
                hideVal3,
                hideVal4,
                onText1,
                onText2,
                onText3,
                onText4;
            var _sureBtn = acType == 8 ? $(".ev-areaPop .ev-tabEnter") : $(".ev-kindPop .ev-tabEnter");
            var _firstTab = acType == 8 ? $(".ev-areaPop .ev-firstTab li") : $(".ev-kindPop .ev-firstTab li"),
                _secondTab = acType == 8 ? $(".ev-areaPop .ev-secondTab li") : $(".ev-kindPop .ev-secondTab li"),
                _thirdTab = acType == 8 ? $(".ev-areaPop .ev-thirdTab li") : $(".ev-kindPop .ev-thirdTab li"),
                _fourthTab = acType == 8 ? $(".ev-areaPop .ev-fourthTab li") : $(".ev-kindPop .ev-fourthTab li");
            var _eachBox = acType == 8 ? $(".ev-areaPop .divisionFixed .address") : $(".ev-kindPop .divisionFixed .address");
            //导航tab切换可以回点操作addressCanClick
            $.each(_eachBox, function (i, e) {
                $(e).off("click").on("click", function () {
                    if ($(this).hasClass("addressCanClick")) {//有可以回点的class
                        $(this).siblings(".address").removeClass("addressCanClick");
                        $(this).addClass("active").siblings().removeClass("active");
                        switch (i){
                            case 0://点击第一个tab，将后面的进行操作
                                $(this).next().text(comm.getStrLen($(this).next().attr("data-navTabName"),10));
                                $(this).next().next().text(comm.getStrLen($(this).next().next().attr("data-navTabName"),10));
                                $(this).next().next().next().text(comm.getStrLen($(this).next().next().next().attr("data-navTabName"),10));
                                break;
                            case 1:
                                $(this).prev().addClass("addressCanClick");
                                $(this).next().text(comm.getStrLen($(this).next().attr("data-navTabName"),10));
                                $(this).next().next().text(comm.getStrLen($(this).next().next().attr("data-navTabName"),10));
                                break;
                            case 2:
                                $(this).prev().addClass("addressCanClick");
                                $(this).prev().prev().addClass("addressCanClick");
                                $(this).next().text(comm.getStrLen($(this).next().attr("data-navTabName"),10));
                                break;
                        }
                        if($(this).next().length){
                            $(this).next().text(comm.getStrLen($(this).next().attr("data-navTabName"),10));
                        }
                        if (i != _eachBox.length - 1) {//点击不是最后一个tab的时候确定按钮设置为灰色
                            _sureBtn.removeClass("enterHover");
                        } else {
                            _sureBtn.addClass("enterHover");
                        }
                        $(this).parents(".divisionFixed").find(".ev-AreaCon").eq(i).show().siblings(".ev-AreaCon").hide();
                    }
                });
            });

            //一级菜单项点击事件
            _firstTab.off("click").on("click", function () {
                _nav1.attr({"data-allInfo1": $(this).attr("data-allInfo1"), "thisText": $(this).text()}).text(comm.getStrLen($(this).text(),10));//在选中的导航tab上加当前的属性
                $(this).addClass("change").siblings().removeClass("change");
                if ($(this).parents(".divisionFixed").find("ul.ev-secondTab").length&& $("ul.ev-secondTab[data-checkId=" + $(this).attr("data-checkId") + "]").length) {//二级菜单项存在
                    _secondTab.removeClass("change");
                    $(this).parents(".divisionFixed").find(".ev-firstAreaCon").hide();//隐藏对应的一级菜单项
                    $(this).parents(".divisionFixed").find(".ev-secondAreaCon").show();//显示对应的二级菜单项父层
                    $("ul.ev-secondTab[data-checkId=" + $(this).attr("data-checkId") + "]").show().siblings("ul").hide();//显示对应的二级菜单项
                    _nav1.removeClass("active").addClass("addressCanClick").siblings(".ev-navTab2").addClass("active");//处理对应的导航tab项
                } else {
                    _nav2.attr({"data-allInfo2": "", "thisText": ""}).text(comm.getStrLen(_nav2.attr("data-navTabName"),10));
                    _nav3.attr({"data-allInfo3": "", "thisText": ""}).text(comm.getStrLen(_nav3.attr("data-navTabName"),10));
                    _sureBtn.addClass("enterHover");
                }
            });
            //二级菜单项点击事件
            _secondTab.off("click").on("click", function () {
                _nav2.attr({"data-allInfo2": $(this).attr("data-allInfo2"), "thisText": $(this).text()}).text(comm.getStrLen($(this).text(),10));
                $(this).addClass("change").siblings().removeClass("change");
                if ($(this).parents(".divisionFixed").find("ul.ev-thirdTab").length&&$("ul.ev-thirdTab[data-checkId=" + $(this).attr("data-checkId") + "]").length) {//三级菜单项存在
                    _thirdTab.removeClass("change");
                    $(this).parents(".divisionFixed").find(".ev-secondAreaCon").hide();//隐藏对应的二级菜单项
                    $(this).parents(".divisionFixed").find(".ev-thirdAreaCon").show();//显示对应的三级菜单项父层
                    $("ul.ev-thirdTab[data-checkId=" + $(this).attr("data-checkId") + "]").show().siblings("ul").hide();//显示对应的二级菜单项
                    _nav2.removeClass("active").addClass("addressCanClick").siblings(".ev-navTab3").addClass("active");//处理对应的导航tab项
                } else {
                    if(_nav3.length){
                        _nav3.attr({"data-allInfo3": "", "thisText": ""}).text(comm.getStrLen(_nav3.attr("data-navTabName"),10));
                    }
                    _sureBtn.addClass("enterHover");
                }
            });
            //三级菜单项点击事件
            _thirdTab.off("click").on("click", function () {
                _nav3.attr({"data-allInfo3": $(this).attr("data-allInfo3"), "thisText": $(this).text()}).text(comm.getStrLen($(this).text(),10));
                $(this).addClass("change").siblings().removeClass("change");
                if ($(this).parents(".divisionFixed").find("ul.ev-fourthTab").length&&$("ul.ev-fourthTab[data-checkId=" + $(this).attr("data-checkId") + "]").length) {//三级菜单项存在
                    _fourthTab.removeClass("change");
                    $(this).parents(".divisionFixed").find(".ev-thirdAreaCon").hide();//隐藏对应的二级菜单项
                    $(this).parents(".divisionFixed").find(".ev-fourthAreaCon").show();//显示对应的三级菜单项父层
                    $("ul.ev-fourthTab[data-checkId=" + $(this).attr("data-checkId") + "]").show().siblings("ul").hide();//显示对应的二级菜单项
                    _nav3.removeClass("active").addClass("addressCanClick").siblings(".ev-navTab4").addClass("active");//处理对应的导航tab项
                } else {
                    if(_nav4.length){
                        _nav4.attr({"data-allInfo4": "", "thisText": ""}).text(comm.getStrLen(_nav4.attr("data-navTabName"),10));
                    }
                    _sureBtn.addClass("enterHover");
                }
            });

            //四级菜单项点击事件
            _fourthTab.off("click").on("click", function () {
                _nav4.attr({"data-allInfo4": $(this).attr("data-allInfo4"), "thisText": $(this).text()}).text(comm.getStrLen($(this).text(),10));
                $(this).addClass("change").siblings().removeClass("change");
                _sureBtn.addClass("enterHover");
            });

            //确定按钮的点击
            _sureBtn.off("click").on("click", function () {
                if ($(this).hasClass("enterHover")) {
                    //取选中值
                    hideVal1 = $(this).siblings(".ev-navTab1").attr("data-allInfo1");
                    hideVal2 = $(this).siblings(".ev-navTab2").attr("data-allInfo2");
                    hideVal3 = $(this).siblings(".ev-navTab3").attr("data-allInfo3");
                    hideVal4 = $(this).siblings(".ev-navTab4").attr("data-allInfo4");
                    onText1 = $(this).siblings(".ev-navTab1").attr("thisText");
                    onText2 = $(this).siblings(".ev-navTab2").attr("thisText");
                    onText3 = $(this).siblings(".ev-navTab3").attr("thisText");
                    onText4 = $(this).siblings(".ev-navTab4").attr("thisText");
                    if ($(this).hasClass("areaEn")) {//选择地区
                        _aPop.removeClass("on");
                        $(".ev-areaList .divisionName").text((onText1 ? onText1 : "") + " " + (onText2 ? onText2 : "") + " " + (onText3 ? onText3 : "")+ " " + (onText4 ? onText4 : ""))
                            .attr({
                                "data-allInfo1": (hideVal1 ? hideVal1 : ""),
                                "data-allInfo2": (hideVal2 ? hideVal2 : ""),
                                "data-allInfo3": (hideVal3 ? hideVal3 : ""),
                                "data-allInfo4": (hideVal4 ? hideVal4 : ""),
                                "data-thisText1":(onText1 ? onText1 : ""),
                                "data-thisText2":(onText2 ? onText2 : ""),
                                "data-thisText3":(onText3 ? onText3 : ""),
                                "data-thisText4":(onText4 ? onText4 : ""),

                            });
                        t.areaActStatus();
                        $(".ev-areaList span").removeClass("redMark");
                    } else {//选择类别
                        _kPop.removeClass("on");
                        $(".ev-category .divisionName").text((onText1 ? onText1 : "") + " " + (onText2 ? onText2 : "") + " " + (onText3 ? onText3 : "") + " " + (onText4 ? onText4 : ""))
                            .attr({
                                "data-allInfo1": (hideVal1 ? hideVal1 : ""),
                                "data-allInfo2": (hideVal2 ? hideVal2 : ""),
                                "data-allInfo3": (hideVal3 ? hideVal3 : ""),
                                "data-allInfo4": (hideVal4 ? hideVal4 : ""),
                                "data-thisText1":(onText1 ? onText1 : ""),
                                "data-thisText2":(onText2 ? onText2 : ""),
                                "data-thisText3":(onText3 ? onText3 : ""),
                                "data-thisText4":(onText4 ? onText4 : "")
                            });
                        t.areaActStatus();
                        $(".ev-category span").removeClass("redMark");
                    }
                    $("body,html").css({overflow:"",height:"auto"}).unbind("touchmove");
                }
            });
            //遮罩区域点击关闭弹层
            $(".ev-popClickClose").off("click").on("click",function(e){
                if(!($(e.target).is('.divisionFixed')||$(e.target).parents().is('.divisionFixed'))){
                    $(this).removeClass("on");
                    $("body,html").css({overflow:"",height:"auto"}).unbind("touchmove");
                }
            });
        },
        //地区列表激活按钮判断
        areaActStatus: function () {
            var t = this;
            var _upBtnFlag = false;
            $.each($(".divisionName"), function (i, e) {
                if ($(e).text()) {
                    _upBtnFlag = true;
                    return false;
                } else {
                    _upBtnFlag = false;
                }
            });
            if (_upBtnFlag) {
                $(".ev-areaUploadBtn").addClass("activation");
            } else {
                $(".ev-areaUploadBtn").removeClass("activation");
            }
        },
       /* //选择上传类型
        uploadHtml: function (rep, kv, lenNum) {
            var t = this;
            var uploadType = kv.uploadType.split(",");
            var uploadTypeHtml = "";
            $.each(uploadType, function (i, e) {
                switch (parseInt(e)) {
                    case 1:
                        uploadTypeHtml += '<li data-refTy="1">视频</li>';
                        break;
                    case 2:
                        uploadTypeHtml += '<li data-refTy="2">文库</li>';
                        break;
                    case 4:
                        uploadTypeHtml += '<li data-refTy="4">话题</li>';
                        break;
                    case 7:
                        uploadTypeHtml += '<li data-refTy="7">病例</li>';
                        break;
                }
            });

            var uploadHtml;
            uploadHtml = '<!--上传类型选择开始-->' +
                '<section class="ev-processBox ev-upTypeBtn" data-typeFlag="2" style="display: none;">' +
                '<header class="al-indexHeader">' +
                '<figure class="al-indexHeaderItem">' +
                '<a class="ev-backBtn" href="javascript:;">' +
                '<img src="/images/img50/pages/personal/arrow_back.png" alt="">' +
                '</a>' +
                '</figure>' +
                '<figure class="al-indexHeaderItem">' +
                '<h1>' + rep.cmsActivityEvent.eventName + '</h1>' +
                '</figure>' +
                '<figure class="al-indexHeaderItem">' +
                '</figure>' +
                '</header>' +
                '<section class="productType">' +
                '<section class="signUpMsg">' +
                '<aside class="title">' + kv.configIntro + '</aside>' +
                '<ul class="typeList ev-typeList" data-last="' + (rep.cmsActivityEventConfig.length - 1 == lenNum ? '1' : '0') + '">' +
                uploadTypeHtml +
                '</ul>' +
                '</section>' +
                '</section>' +
                '</section>' +
                '<!--上传类型选择结束-->';
            return uploadHtml;
        },*/
        //选择赛区
        areaBoxHtml: function (html1, html2, arr) {//html1是 赛区  html2是类别 arr是数组的最后一个对象信息（赛区和类别不固定）
            var t = this;
            var upLoadBtn = false;
            var upLoadBtnNum="";
            var uploadText="",uploadTextFlag="";
            var arrSort = [];
            $.each(arr.rep.cmsActivityEventConfig, function (k, v) {
                switch (parseInt(v.configDataType)) {
                    case 2://赛区
                        arrSort.push("html1");
                        t.areaTab = v.propertyFullPath;
                        break;
                    case 3://类别
                        t.kindsTab = v.propertyFullPath;
                        arrSort.push("html2");
                        break;
                    case 4:
                        upLoadBtn = true;
                        upLoadBtnNum=k;
                        break;
                }
            });

            if((upLoadBtn&&upLoadBtnNum==arr.rep.cmsActivityEventConfig.length - 1&&arr.rep.cmsActivityEventConfig.length -2 == arr.lenNum)||(upLoadBtn&&arr.rep.cmsActivityEventConfig.length - 1 == arr.lenNum)){
                if(t.uploadText){
                    uploadText=t.uploadText;
                }else{
                    uploadText="立即上传";
                }
                uploadTextFlag="upload";
            }else if(arr.rep.cmsActivityEventConfig.length - 1 == arr.lenNum){
                uploadText="保存";
                uploadTextFlag="save";
            }else{
                uploadText="下一步";
                uploadTextFlag="next";
            }
            var areaHtml;
            areaHtml = '<!--所属地区选择开始-->' +
                '<section class="ev-processBox ev-areasChooose" data-typeFlag="3" style="display: none;">' +
                '<header class="al-indexHeader">' +
                '<figure class="al-indexHeaderItem">' +
                /*'<a class="ev-backBtn" href="javascript:;">' +
                '<img src="/images/img50/pages/personal/arrow_back.png" alt="">' +
                '</a>' +*/
                '</figure>' +
                '<figure class="al-indexHeaderItem">' +
                '<h1>' + arr.rep.cmsActivityEvent.eventName + '</h1>' +
                '</figure>' +
                '<figure class="al-indexHeaderItem">' +
                '</figure>' +
                '</header>' +
                '<section class="productType">' +
                '<section class="signUpMsg">' +
                '<aside class="title">' + arr.kv.configIntro + '</aside>' +
                ((arrSort[0] == "html1") ? ((html1 ? html1 : "") + (html2 ? html2 : "")) : ((html2 ? html2 : "") + (html1 ? html1 : ""))) +
                '</section>' +
                '</section>' +
                '<button class="signUpEnter ev-areaUploadBtn" data-save="' + uploadTextFlag + '">' +
                uploadText+ '</button>' +
                '</section>' +
                '<!--所属地区选择结束-->';
            return areaHtml;
        },
        //赛区小弹窗提示
        areaPop: function (rep, type) {//rep是返回数据  type是判断地区还是类别选择
            var t = this;
            //导航tab名称显示
            var areaTab = t.areaTab ? comm.cutLine(t.areaTab, "_", "，").split("，") : "";//赛区
            var kindsTab = t.kindsTab ? comm.cutLine(t.kindsTab, "_", "，").split("，") : "";//类别
            if (areaTab.length) {
                var areaTabHtml = "";
                $.each(areaTab, function (i, e) {
                    areaTabHtml += '<aside class="address ev-navTab' + (i + 1) + (i == 0 ? ' active' : '') + '" data-navTabName="'+e+'">' + comm.getStrLen(e,10) + '</aside>';
                });
            }
            if (kindsTab.length) {
                var kindTabHtml = "";
                $.each(kindsTab, function (i, e) {
                    kindTabHtml += '<aside class="address ev-navTab' + (i + 1) + (i == 0 ? ' active' : '') + '" data-navTabName="'+e+'">' + comm.getStrLen(e,10) + '</aside>';
                });
            }
            //tab切换内容显示
            var html = "", html2 = "", html3 = "", html4 = "", html2Box = "", html3Box = "", html4Box = "";
            var returnParam = function (e) {
                return JSON.stringify({
                    parentId: e.parentId,
                    pFPath: e.propertyFullPath,
                    prId: e.propertyId
                });
            };
            $.each(rep, function (i, e) {
                html += '<li data-checkId="' + e.id + '" data-allInfo1=' + returnParam(e) + '>' + e.propertyName + '</li>';//外层赛区名字
                //第二层tab存在
                if (e.property_2.length) {
                    html2 = "";
                    $.each(e.property_2, function (k, v) {
                        html2 += '<li data-checkId="' + v.id + '" data-allInfo2=' + returnParam(v) + '>' + v.propertyName + '</li>';//内层赛区名字

                        if (v.property_3.length) {//第三层tab存在
                            html3 = "";
                            $.each(v.property_3, function (n, s) {
                                html3 += '<li data-checkId="' + s.id + '" data-allInfo3=' + returnParam(s) + '>' + s.propertyName + '</li>';
                                if(s.property_4.length){
                                    html4 = "";
                                    $.each(s.property_4, function (m, q) {
                                        html4 += '<li data-checkId="' + q.id + '" data-allInfo4=' + returnParam(q) + '>' + q.propertyName + '</li>';
                                    });
                                    html4Box += '<ul class="addressNameSecond ev-fourthTab" style="display: none;" data-checkId="' + s.id + '">' + html4 + '</ul>';
                                }
                            });
                            html3Box += '<ul class="addressNameSecond ev-thirdTab" style="display: none;" data-checkId="' + v.id + '">' + html3 + '</ul>';
                        }

                    });
                    html2Box += '<ul class="addressNameSecond ev-secondTab" style="display: none;" data-checkId="' + e.id + '">' + html2 + '</ul>';
                }
            });

            var areaPopHtml;
            areaPopHtml = '<section class="al-selectorBarMask ev-popClickClose' + (type == 8 ? ' ev-areaPop' : ' ev-kindPop') + ' ">' +
                '<section class="divisionFixed">' +
                '<header>' +
                (type == 8 ? areaTabHtml : kindTabHtml) +
                '<aside class="enter ev-tabEnter ' + (type == 8 ? ' areaEn' : ' kindEn') + '">确定</aside>' +
                '</header>' +
                '<div class="ev-AreaCon ev-firstAreaCon">' +
                '<ul class="addressNameFirst ev-firstTab">' +
                html +
                '</ul>' +
                '</div>' +
                '<div class="ev-AreaCon ev-secondAreaCon">' +
                html2Box +
                '</div>' +
                '<div class="ev-AreaCon ev-thirdAreaCon">' +
                html3Box +
                '</div>' +
                '<div class="ev-AreaCon ev-fourthAreaCon">' +
                html4Box +
                '</div>' +
                '</section>' +
                '</section>';
            return areaPopHtml;
        },
        //跳转到app弹层
        appPop:function () {
            var t=this;
            if(t.computerUpload==2){
                comm.alertBox({
                    "title": "您已报名成功！为了保证作品质量，此次活动仅提供电脑版上传功能，请您移步电脑版唯医www.allinmd.cn完成上传。期待您的精彩作品！",
                    "ensure": "好的",
                    ensureCallback: function () {
                        window.location.href = "//m.allinmd.cn/html/m/activity/" + activityId + "/activity_index.html";
                    }
                });
            }else{
                var amChannel = comm.getparaNew()._amChannel;
                comm.newReleaseBox({
                    imgPath:"//img50.allinmd.cn/case/release.png",
                    title:"报名成功<br/>上传作品需使用唯医骨科App",
                    solidBtnTitile:"立即使用",
                    authNoneTitle:"暂不发布",
                    data:{
                        el: ".solidBtn",
                        ios: "allinmdios://app.allinmd.cn/applinks.html?scene=11&type=53&sourceId="+activityId+"&userId="+cId+"&linkUrl=//m.allinmd.cn/html/app/activity/" + activityId + "/activity_index.html&linkName="+tit +(amChannel?"&_amChannel="+amChannel:''),
                        ios9: "http://app.allinmd.cn/applinks.html?scene=11&type=53&sourceId="+activityId+"&userId="+cId+"&linkUrl=//m.allinmd.cn/html/app/activity/" + activityId + "/activity_index.html&linkName="+tit +(amChannel?"&_amChannel="+amChannel:''),
                        android: "allin://com.allin.social:75235?data={scene:3,type:53,sourceId:"+activityId+",userId:"+cId+",linkUrl://m.allinmd.cn/html/app/activity/" + activityId + "/activity_index.html,linkName:"+tit+ (amChannel?",_amChannel:"+amChannel:'')+ "}"
                    },
                    authNoneCallBack:function () {
                        setTimeout(function () {
                            g_sps.jump(null,"/html/m/activity/" + activityId + "/activity_index.html");
                        },500)
                    }
                });
            }

        },
        //单独保存赛区和类别的接口
        saveAreaAjax:function (flag) {
            var t=this;
            var _areaL,param1,param2,param3,_kindsL,params1,params2,params3;
            var param={
                activityId:activityId,
                customerId:cId,
                siteId:"2",
                property:{},
                property_area:{}
            };

            //赛区字段存在
            if ($(".ev-areaList").length) {
                _areaL = $(".ev-areaList .divisionName");//赛区class
                //一级菜单项存在
                if (_areaL.attr("data-allinfo1")) {
                    param1 = JSON.parse(_areaL.attr("data-allinfo1"));
                    param.property_area.propertyIdList=param1.prId;
                    param.property_area.propertyName=_areaL.attr("data-thisText1");
                    param.property_area.propertyFullPath=param1.pFPath;
                }
                //二级菜单项存在
                if (_areaL.attr("data-allinfo2")) {
                    param2 = JSON.parse(_areaL.attr("data-allinfo2"));
                    param.property_area.propertyIdList=param1.prId+','+param2.prId;
                    param.property_area.propertyName=_areaL.attr("data-thisText1")+','+_areaL.attr("data-thisText2");
                    param.property_area.propertyFullPath=param2.pFPath;
                }
                //三级菜单项存在
                if (_areaL.attr("data-allinfo3")) {
                    param3 = JSON.parse(_areaL.attr("data-allinfo3"));
                    param.property_area.propertyIdList=param1.prId+','+param2.prId+','+param3.prId;
                    param.property_area.propertyName=_areaL.attr("data-thisText1")+','+_areaL.attr("data-thisText2")+','+_areaL.attr("data-thisText3");
                    param.property_area.propertyFullPath=param3.pFPath;
                }
                //四级菜单项存在
                if (_areaL.attr("data-allinfo4")) {
                    param4 = JSON.parse(_areaL.attr("data-allinfo4"));
                    param.property_area.propertyIdList=param1.prId+','+param2.prId+','+param3.prId+','+param4.prId;
                    param.property_area.propertyName=_areaL.attr("data-thisText1")+','+_areaL.attr("data-thisText2")+','+_areaL.attr("data-thisText3")+','+_areaL.attr("data-thisText4");
                    param.property_area.propertyFullPath=param4.pFPath;
                }
            }
            //类别字段存在
            if ($(".ev-category").length) {
                _kindsL = $(".ev-category .divisionName");//赛区class
                if (_kindsL.attr("data-allinfo1")) {//一级菜单存在
                    params1 = JSON.parse(_kindsL.attr("data-allinfo1"));
                    param.property.propertyIdList=params1.prId;
                    param.property.propertyName=_kindsL.attr("data-thisText1");
                    param.property.propertyFullPath=params1.pFPath;
                }
                if (_kindsL.attr("data-allinfo2")) {//二级菜单存在
                    params2 = JSON.parse(_kindsL.attr("data-allinfo2"));
                    param.property.propertyIdList=params1.prId+","+params2.prId;
                    param.property.propertyName=_kindsL.attr("data-thisText1")+","+_kindsL.attr("data-thisText2");
                    param.property.propertyFullPath=params2.pFPath;
                }
                if (_kindsL.attr("data-allinfo3")) {//三级菜单存在
                    params3 = JSON.parse(_kindsL.attr("data-allinfo3"));
                    param.property.propertyIdList=params1.prId+","+params2.prId+","+params3.prId;
                    param.property.propertyName=_kindsL.attr("data-thisText1")+","+_kindsL.attr("data-thisText2")+","+_kindsL.attr("data-thisText3");
                    param.property.propertyFullPath=params3.pFPath;
                }
                if (_kindsL.attr("data-allinfo4")) {//四级菜单存在
                    params4 = JSON.parse(_kindsL.attr("data-allinfo4"));
                    param.property.propertyIdList=params1.prId+","+params2.prId+","+params3.prId+","+params4.prId;
                    param.property.propertyName=_kindsL.attr("data-thisText1")+","+_kindsL.attr("data-thisText2")+","+_kindsL.attr("data-thisText3")+","+_kindsL.attr("data-thisText4");
                    param.property.propertyFullPath=params4.pFPath;
                }
            }
            var cBack=function (res) {
                if (res&&res.responseObject&&res.responseObject.responseStatus){
                    if(flag){//上传
                        t.appPop();
                    }else{//保存
                        t.signUpSuc();
                    }
                }
            };
            comm.ajax.async(t.path.propertyCreate,{paramJson:$.toJSON(param)},cBack);
        }

    };
    activitySignUp.init();
});
