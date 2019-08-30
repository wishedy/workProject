/**
 * 功能描述：  个人简介
 * 使用方法:
 * 注意事件：
 * 引入来源：  作用：
 *
 * Created by LiChunHui on 2016/8/3.
 */
$(function () {
    //获取资料百分比
    //customerInforate();
    var para=comm.getpara();
    var languageFlag = 0;
    var obj = {
        cid: $("#sesCustomerId").val(),
        userName: $(".ev-name"),//用户名
        companyMedicalTitle: $(".ev-companyMedicalTitle"),//职称//医院
        logoUrl: $(".ev-logoUrl"), //头像
        upNum: $(".ev-upNum"), //赞数
        fansNum: $(".ev-fansNum"), //粉丝数
        followNum: $(".ev-followNum")  //关注数
    };
    if (!obj.cid) {//未登录
        user.login({
            callback: function () {
                location.reload();
            },
            scene: privilegeSceneConst.eSceneTypeLogin,
            onClose: function () {
                g_sps.jump(null,"/");
            },
            noAuthReload: true
        });
        return false;
    }
    $(".ev-logoUrl").on("mouseenter", function () {
        $(".ev-uploadFaceMask").show();
    }).on("mouseleave", function () {
        $(".ev-uploadFaceMask").hide();
    });


    var path = {
        /*/mcall/customer/auth/getCustomerAuth*/
        initCore: PC_CALL + "customer/unite/getMapById/", //个人信息
        // initCore : PC_CALL+"customer/auth/getCustomerAuth/", //个人信息
        hospital: PC_CALL + "commdata/getHospitalList/",//医院联想
        university: PC_CALL + "commdata/getSchoolList/",//学校联想
        summary: PC_CALL + "customer/baseinfo/saveFellowSummary/",//保存简介
        createAddress: PC_CALL + "customer/address/create/",//通讯地址创建
        updateAddress: PC_CALL + "customer/address/update/",//通讯地址修改
        getDataRoleConfigs: PC_CALL + "comm/data/roleconfig/getDataRoleConfigs/",
        getAuthAttachments: PC_CALL + "customer/auth_attachment/getAuthAttachments/",
        attUpload: PC_CALL + "comm/upload_attachment/upload/",
        saveBaseInfo: PC_CALL + "customer/baseinfo/saveBasicInfo/",
        getAuthProcess: PC_CALL + "customer/revise/auth/getMapList/",
        saveAuth: PC_CALL + "customer/auth/createAuth/",
        saveApplyAuth: PC_CALL + "customer/auth_process/create/",
        createAuthAttachments: PC_CALL + "customer/auth/createAuth2/"
    };
    var unit;
    var auth;
    var baseInfo;
    var customerAddress;
    var surgery = {
        init: function () {
            var t = this;
            t.requestSurgery();
            //t.requestSurgery().upDateSurgery();
        },
        userSurgeryList:[],
        configuration:{},
        subjectList: [],
        surgeryList: {},
        surgeryShow:function(data) {
            var surgeryStr = "";

            $.each(data, function (i, v) {
                if (v.operationName) {
                    if (i === 0) {
                        surgeryStr += "<span class='al-adept-result-item al-adept-result-surgery' data-surgeryId='" + v.operationId + "'>" + v.operationName + "</span>";
                    } else {
                        surgeryStr += "<i class='al-dot'>，</i><span class='al-adept-result-item al-adept-result-surgery' data-surgeryId='" + v.operationId + "'>" + v.operationName + "</span>";
                    }
                }
            });
            if (surgeryStr.length > 0) {
                var goodAtSur = $(".ev-good-at-surgery");
                goodAtSur.html(surgeryStr);
                base.fieldTypeOverflow()
            }
        },
        resetListData: function (data) {
            var t = this;
            var remouldJson = {};
            var remouldArr = [];
            var majorId = [];
            $.each(data, function (i, v) {
                var jsonData = {
                    operationName: v.operationName,
                    "operationId": v.operationId,
                    treeLevel: v.treeLevel,
                    children: v.children
                };
                if (remouldJson["" + v.majorId]) {
                    var noHasOnOff = true;
                    $.each(remouldJson["" + v.majorId], function (inI, inV) {
                        if (inV.operationId === v.operationId) {
                            noHasOnOff = false;
                        }
                    });
                    if (noHasOnOff) {
                        if (v.children.length) {
                            remouldJson["" + v.majorId].push(jsonData);
                        }
                    }
                } else {
                    remouldJson["" + v.majorId] = [];
                    if (v.children.length) {
                        remouldJson["" + v.majorId].push(jsonData);
                    }
                }
            });
            $.each(remouldJson,function(i,v){
                var jsonData = {
                    majorId:i,
                    children:v,
                    treeLevel:0
                };
                majorId.push(i);
                remouldArr.push(jsonData);
            });
            $.each(remouldArr,function(i,v){
                $.each(surgery.subjectList,function(si,sv){
                    if(v.majorId===sv.specialtyId){
                        v.majorName= sv.specialtyName;
                    }
                });
                $.each(surgery.userSurgeryList,function(ti,tv){
                    if(parseInt(v.majorId)===tv.specialtyId){
                        //console.log(v);
                        v.selectOnOff = true;
                        v.id = tv.id;
                    }
                });
            });
            $.each(remouldArr,function(i,v){
                $.each(surgery.userSurgeryList,function(ti,tv){
                    if(parseInt(v.majorId)===tv.specialtyId){
                        var list = !$.isEmptyObject(tv.operationIdList)?tv.operationIdList.split(","):tv.operationIdList;
                        $.each(v.children,function(coi,cov){
                            var hasOnOff = false;
                            $.each(cov.children,function(ctoi,ctov){

                                $.each(list,function(idI,idV){

                                    if(idV===ctov.operationId){
                                        ctov.selectOnOff = true;
                                        hasOnOff = true;
                                    }
                                });
                            });
                            cov.selectOnOff = hasOnOff;
                        });
                    }
                });
            });
            $.each(remouldArr,function(i,v){

                if((v.selectOnOff&&v.selectOnOff===true)){
                    v.temSelectOnOff = true;
                }else{
                    v.selectOnOff = false;
                    v.id = "";
                    v.temSelectOnOff = false;
                }
                $.each(v.children,function(ti,tv){

                    if((tv.selectOnOff&&tv.selectOnOff===true)){
                        tv.temSelectOnOff = true;
                    }else{
                        tv.temSelectOnOff = false;
                        tv.selectOnOff = false;
                    }
                    $.each(tv.children,function(si,sv){

                        if((sv.selectOnOff&&sv.selectOnOff===true)){
                            sv.temSelectOnOff = true;
                        }else{
                            sv.temSelectOnOff = false;
                            sv.selectOnOff = false;
                        }
                    });
                });
            });
            t.surgeryList = remouldArr;
            // console.log(t.surgeryList)
            var newSubjectList = [];
            $.each(surgery.subjectList,function(i,v){
                $.each(majorId,function(si,sv){
                    if(parseInt(v.specialtyId)===parseInt(sv)){
                        newSubjectList.push(v);
                    }
                });
            });
            var configList = (surgery.configuration.operationIdList)?surgery.configuration.operationIdList.split(","):[];
            $.each(t.surgeryList,function(i,v){
               $.each(v.children,function(inIndex,inVal){
                   $.each(inVal.children,function(thIndex,thVal){
                        $.each(configList,function(foIndex,fouVal){
                            if(thVal.operationId==fouVal){
                                thVal.selectOnOff =true;
                                thVal.temSelectOnOff =true;
                                inVal.selectOnOff =true;
                                inVal.temSelectOnOff =true;
                                v.selectOnOff =true;
                                v.temSelectOnOff =true;
                            }
                        });
                   });
               })
            });
            t.subjectList = newSubjectList;
            t.surgeryShow(t.statisticsSurgery().exhibition);
        },
        copyData:function(dire){
            $.each(surgery.surgeryList,function(i,v){
                if(dire===1){
                    v.selectOnOff=v.temSelectOnOff;
                }else{
                    v.temSelectOnOff=v.selectOnOff;
                }
                $.each(v.children,function(ti,tv){
                    if(dire===1){
                        tv.selectOnOff=tv.temSelectOnOff;
                    }else{
                        tv.temSelectOnOff=tv.selectOnOff;
                    }
                    $.each(tv.children,function(si,sv){
                        if(dire===1){
                            sv.selectOnOff=sv.temSelectOnOff;
                        }else{
                            sv.temSelectOnOff=sv.selectOnOff;
                        }
                    });
                })
            });
        },
        editSurgery:function(id,type){
            var t = this;
            /*type 0代表删除，1代表临时选择，2代表临时不选择,3代表增添*/
            $.each(surgery.surgeryList,function(i,v){
                $.each(v.children,function(ti,tv){
                    for(var num = 0;num<tv.children.length;num++){
                        if(parseInt(id)===parseInt(tv.children[num].operationId)){
                            switch (type){
                                case 0:
                                    tv.children[num].selectOnOff = false;
                                    tv.children[num].temSelectOnOff = false;
                                    break;
                                case 1:
                                    tv.children[num].temSelectOnOff = true;
                                    break;
                                case 2:
                                    tv.children[num].temSelectOnOff = false;
                                    break;
                                case 3:
                                    tv.children[num].selectOnOff = true;
                                    tv.children[num].temSelectOnOff = true;
                                    break;
                            }
                            break;
                        }
                    }
                })
            });
            t.upDateSurgery();
        },
        statisticsSurgery: function () {
            var t = this;
            var statisticsData = {
                userSelect: [],
                selectedMajorId: [],
                postSelected: [],
                delSpecialtyIdList:'',
                exhibition: []
            };
            $.each(surgery.surgeryList, function (i, v) {
                var dataJson = {
                    specialtyId: v.majorId,
                    id: v.id,
                    operationIdList: "",
                    operationNameList: ""
                };
                var staticArr = [];
                $.each(v.children, function (ti, tv) {
                    staticArr[i] = 0;
                    $.each(tv.children, function (si, sv) {
                        if (sv.temSelectOnOff && sv.temSelectOnOff === true) {
                            staticArr[i]++;
                            if (dataJson.operationIdList.length) {
                                dataJson.operationIdList += "," + sv.operationId;
                                dataJson.operationNameList += "," + sv.operationName;
                            } else {
                                dataJson.operationIdList += sv.operationId;
                                dataJson.operationNameList += sv.operationName;
                            }
                            var itemJson = {
                                operationId: sv.operationId,
                                operationName: sv.operationName
                            };
                            statisticsData.exhibition.push(itemJson);

                        }
                    });
                    if(staticArr[i]){
                        tv.temSelectOnOff = true;
                    }else{
                        tv.temSelectOnOff = false;
                    }
                });
                var allHaveSelected = true;
                for(var judgeNum = 0;judgeNum<staticArr.length;judgeNum++){
                    if(staticArr[judgeNum]){
                        v.temSelectOnOff = true;
                        allHaveSelected = false;
                        break;
                    }
                }
                if(allHaveSelected){
                    v.temSelectOnOff = false;
                }
                // statisticsData.selectedMajorId.push(v.majorId);
                if(dataJson.operationIdList.length){
                    statisticsData.userSelect.push(dataJson);
                }
            });
            function comparisonStr(a, b) {
                var aArr = a.split(",");
                var bArr = b.split(",");
                if (aArr.length != bArr.length) {
                    return true;
                } else {
                    var sameLen = 0;
                    $.each(aArr, function (i, v) {
                        $.each(bArr, function (ini, inv) {
                            if (v === inv) {
                                sameLen++;
                            }
                        });
                    });
                    return (sameLen === aArr.length);
                }
            }
            //debugger;
            $.each(statisticsData.userSelect, function (i, v) {
                var nothing = true;
                if (v.id) {
                    $.each(surgery.userSurgeryList, function (si, sv) {
                        if (parseInt(v.id) === parseInt(sv.id)) {
                            if (comparisonStr(sv.operationIdList, v.operationIdList)) {
                                v.isUpdate = 1;
                                statisticsData.postSelected.push(v);
                                statisticsData.selectedMajorId.push(v.specialtyId);
                            }
                            nothing = false;
                        }
                    });
                    if(nothing){
                        statisticsData.postSelected.push(v);
                    }
                } else {
                    if (v.operationIdList.length) {
                        statisticsData.postSelected.push(v);
                        statisticsData.selectedMajorId.push(v.specialtyId);
                    }
                }
            });
            $.each(surgery.userSurgeryList,function(i,v){
                var nothing = true;
                $.each(statisticsData.userSelect, function (si, sv){
                    if (parseInt(v.id) === parseInt(sv.id)){
                        nothing = false;
                    }
                });
                if(nothing){
                    v.operationIdList = '';
                    statisticsData.delSpecialtyIdList+=v.id+',';
                }
            });
            var selectResult = [];
            $.each(statisticsData.postSelected,function(i,v){
                if(v.operationIdList.split(",")[0].length){
                    selectResult.push(v.specialtyId);
                }
            });
            /*var configSur = surgery.configuration.operationIdList.split(",");
            var editConfig = false;
            var sum = 0;
            var exitStr = [];
            $.each(configSur,function(index,val){
                $.each(statisticsData.postSelected,function(index,inVal){
                    var arr = inVal.operationIdList.split(",");
                    $.each(arr,function(i,v){
                        if(v===val){
                            sum++;
                            exitStr.push(val);
                        }
                    })
                });
            });
            editConfig=(configSur.length==sum);
            if(!editConfig){
                var updateStr = '';
                $.each(configSur,function(i,v){
                    var has = false;
                    $.each(exitStr,function(index,val){
                        if(v===val){
                            has = true;
                        }
                    });
                    if(has){
                        updateStr+=v+',';
                    }
                });
                var subDot = function (str) {
                    var lastStr = "";
                    lastStr = str.substring(0, str.length - 1);
                    return lastStr;
                };
                updateStr = subDot(updateStr.substr());
                surgery.configuration.operationIdList = updateStr;
                surgery.configuration.isUpdate = 1;
                statisticsData.postSelected.push(surgery.configuration);
            }*/
            statisticsData.selectedMajorId = surgery.unique(selectResult);

            return statisticsData;
        },
        templateSubject: function (d) {
            var selectedMajor = surgery.statisticsSurgery().selectedMajorId;
            var subjectStr = "";
            $.each(d, function (i, v) {
                var selectedStr = "";
                $.each(selectedMajor,function(si,sv){
                    if(parseInt(v.specialtyId)===parseInt(sv)){
                        selectedStr = "selected";
                    }
                });
                subjectStr += '<span class="al-surgery-subject '+selectedStr+'" data-specialtyId="' + v.specialtyId + '"><i></i>' + v.specialtyName + '</span>';
            });
            var demoList = $(subjectStr);
            demoList.each(function(){
                var isObj = $(this);
                var hasOnOff = true;
                $.each(surgery.subjectList,function(i,v){
                    // console.log(parseInt(isObj.attr("data-specialtyId")))
                    if(parseInt(isObj.attr("data-specialtyId"))===parseInt(v.specialtyId)){
                        hasOnOff = false;
                    }
                });
                // console.log(hasOnOff)
                if(hasOnOff){
                    isObj.addClass("hide");
                }
            });
            base.baseInfoEditObj.find(".al-adept-surgery-list").html(demoList);
            surgery.selectedSurgery();

        },
        cancelMethod: function () {
            var t = surgery;
            $(".al-adept-subject-surgery").addClass("hide");
            base.baseInfoEditObj.find(".al-adept-surgery-container").addClass("hide");
            base.baseInfoEditObj.find(".al-adept-surgery-list").html("");
            base.baseInfoEditObj.find(".al-adept-second-index").html("");
            base.baseInfoEditObj.find(".al-adept-third-index").html("");
        },
        selectedSurgery: function () {
            var t = this;
            $(".al-surgery-subject").off("click").on("click", function () {
                var isThis = $(this);
                $(".al-surgery-subject.active").removeClass("active");
                $(".al-surgery-subject.activeHave").removeClass("activeHave").addClass("selected");
                if ($(this).hasClass("selected")) {
                    $(this).attr({'class':"al-surgery-subject activeHave"});
                } else {
                    $(this).attr({'class':"al-surgery-subject active"});
                }
                var showData = [];
                $.each(t.surgeryList,function(i,v){
                    // console.log(v.majorId,isThis.attr("data-specialtyId"))
                    if(v.majorId===isThis.attr("data-specialtyId")){

                        showData = v.children;
                        return false;
                    }
                });
                t.templateSecondIndex(showData);
            });
        },
        upDateSurgery:function(){
            var t = this;
            var majorIdList = (t.statisticsSurgery().selectedMajorId);
            $(".al-surgery-subject").each(function(si,sv){
                var isThis = $(this);
                var noSelect = true;
                $.each(majorIdList,function(si,sv){
                    var isThisObj = $("[data-specialtyid='"+sv+"']");
                    if(isThisObj.hasClass("active")){
                        isThisObj.attr({"class":"al-surgery-subject  activeHave"});
                    }
                    if(isThisObj.hasClass("activeHave")){
                        isThisObj.attr({"class":"al-surgery-subject  activeHave"});
                    }
                    if((!isThisObj.hasClass("activeHave"))&&(!isThisObj.hasClass("active"))&&(!isThisObj.hasClass("selected"))){
                        isThisObj.attr({"class":"al-surgery-subject  selected"});
                    }
                });
                $(".al-surgery-subject ").each(function(){
                    var noHas = true;
                    var isThis = $(this);
                    $.each(majorIdList,function(i,v){
                        if(parseInt(isThis.attr("data-specialtyid"))===parseInt(v)){
                            noHas = false;
                        }
                    });
                    if(noHas){
                        if((isThis.hasClass("selected"))){
                            isThis.attr({"class":"al-surgery-subject"});
                        }
                        if((isThis.hasClass("activeHave"))) {
                            isThis.attr({"class":"al-surgery-subject active"});
                        }
                    }
                });
            });
        },
        templateThirdIndex: function (data) {
            var t = this;
            var thirdStr = "";
            $.each(data, function (i, v) {
                if (v.temSelectOnOff === true) {
                    thirdStr += '<li class="al-adept-third-item selected" data-third-surgeryId="' + v.operationId + '">' + v.operationName + '</li>';
                } else {
                    thirdStr += '<li class="al-adept-third-item" data-third-surgeryId="' + v.operationId + '">' + v.operationName + '</li>';
                }
            });
            var demoList = $(thirdStr);
            demoList.each(function () {
                $(this).off("click").on("click", function () {
                    var isThis = $(this);

                    isThis.toggleClass("selected");
                    if (isThis.hasClass("selected")) {
                        surgery.editSurgery($(this).attr("data-third-surgeryid"),1);
                    } else {
                        surgery.editSurgery($(this).attr("data-third-surgeryid"),2);
                    }
                })
            });
            base.baseInfoEditObj.find(".al-adept-third-index").html(demoList);
        },
        unique: function (arr) {
            var res = [];
            var sArr = JSON.parse(JSON.stringify(arr));

            for (var i = 0, len = sArr.length; i < len; i++) {
                var obj = sArr[i];
                for (var j = 0, jlen = res.length; j < jlen; j++) {
                    if (res[j] === obj) break;
                }
                if (jlen === j) res.push(obj);
            }
            return res;
        },
        templateSecondIndex: function (data) {
            var t = this;
            var secondStr = "";
            var selectedNum = 0;
            var startNum =undefined;
            $.each(data, function (i, v) {
                var selectedOnOff = false;
                var selectedStr = "";
                for (var dataNum = 0; dataNum < v.children.length; dataNum++) {
                    if (v.children[dataNum].selectOnOff === true) {
                        selectedOnOff = true;
                        selectedNum++;
                        if(isNaN(startNum)){
                            startNum = selectedNum;
                            t.templateThirdIndex(v.children);
                        }
                        break;
                    }
                }
                if (selectedNum === 1) {
                    selectedStr = 'selected';
                    selectedNum++;
                } else {
                    selectedStr = "";
                }
                secondStr += '<li class="al-adept-second-item  ' + selectedStr + '" data-second-surgeryId="' + v.operationId + '">' + v.operationName + '</li>';

            });
            var demoList = $(secondStr);
            var selectedOnOff = true;
            demoList.each(function () {
                if ($(this).hasClass("selected")) {
                    selectedOnOff = false;
                }
                $(this).off("click").on("click", function () {
                    var isThis = $(this);
                    $.each(data, function (i, v) {
                        if (v.operationId === isThis.attr("data-second-surgeryid")) {
                            demoList.removeClass("selected");
                            isThis.addClass("selected");
                            t.templateThirdIndex(v.children);
                            return false;
                        }
                    });

                });
            });

            if (selectedOnOff) {
                demoList.eq(0).addClass("selected");
                t.templateThirdIndex(data[0].children);
            }
            $(".al-adept-subject-surgery").removeClass("hide");
            base.baseInfoEditObj.find(".al-adept-second-index").html(demoList);
        },
        requestSurgery: function () {
            var t = this;

            function requestInnerData() {
                var param = {
                    specialtyIdList: "",//	string	否	专业IDList
                    isValid: "1",//	string	是
                    firstResult: "0",//	string	是	分页参数
                    maxResult: "999"//	string	是	分页参数
                };
                var options = {
                    port: "/call/comm/data/specialty/operation/getMapList/",
                    postData: param
                };
                $.ajax({
                    type: "post",
                    url: options.port,
                    data: {paramJson: $.toJSON(options.postData)},
                    dataType: "json",
                    success: function (rep) {
                        if(rep.responseObject.responseData&&rep.responseObject.responseData.dataList){
                            var dataList = rep.responseObject.responseData.dataList;
                            if (dataList) {
                                t.resetListData(dataList);
                                // t.userSurgeryShow();
                                // t.selectedSurgery();
                            }
                        }

                    }
                });
            }
            $.ajax({
                    type: "post",
                    url: "/call/comm/data/specialty/baseinfo/getMapList/",
                    data: {paramJson: $.toJSON({"customerId": obj.cid})},
                    dataType: "json",
                    success: function (rep) {
                        if(rep.responseObject.responseData){
                            var dataList = rep.responseObject.responseData.dataList;
                            t.subjectList = JSON.parse(JSON.stringify(dataList));
                            // console.log(t.subjectList)
                            // t.templateSubject(t.subjectList);
                            requestInnerData();
                        }

                    }
                }
            );

            return t;
        }
    };
    function testNum(obj){
        obj.off('input propertychange').bind('input propertychange',function(){
            var regu = /^[1-9]\d*$/;
            var _isThis = $(this);
            //var regu = /^([1-9][0-9]*){1,3}$/; 亲测可用
            //var regu = /^\+?[1-9][0-9]*$/; 亲测可用
            var val = _isThis.val();
            if (!regu.test(val)) {
                _isThis.parent().find('.al-tableErrorTips').addClass('showIb');
                return false;
            } else {
                _isThis.parent().find('.al-tableErrorTips').removeClass('showIb');
            }
        })

    }
    //获取基本信息
    /*,"logoUseFlag": UseFlag.d*/
    $.ajax({
        url: path.initCore,
        type: "POST",
        data: {paramJson: $.toJSON({customerId: obj.cid})},
        dataType: "json",
        success: function (data) {
            if (!data || !data.responseObject.responseStatus) {
                g_sps.jump(null,"/");
                return false;
            }
            var audit=false;
            if(obj.cid){
                var options = {
                    port: path.getAuthProcess,//获取申请审核状态
                    postData: {customerId: obj.cid},
                    async:1,
                    success: function(){//审核中
                        audit=true;
                    },
                    failed: function () {
                        audit=false;
                    }
                };
                comm.ajax.request(options);
            }

            var list = data.responseObject.responseData.data_list[0];
            unit = list.customer_unite;
            baseInfo = list.customer_baseinfo;
            auth = list.customer_auth;
            csc = list.customer_statistic;
            att = list.customer_att;
            customerAddress = list.customer_address;
            var content="审核将在1个工作日内完成，请耐心等待";
            if(list.authFlag==1){//四证齐全
                content="执业医师审核将在3个工作日内完成，请耐心等待";
            }
            //判断头像
            var logoUrl = "//img10.allinmd.cn/default-user/user_img65.png";
            if (att.logoUrl !== "") logoUrl = att.logoUrl;
            obj.logoUrl.html('<img src=' + logoUrl + '><i class="al-personalLogoMask ev-uploadFaceMask" style="display:none;">' +
                '<img src="//img10.allinmd.cn/v3/common/icon/icon_camera.png" alt="">' +
                '</i>');

            module.logoReplace({
                container: $(".ev-logoUrl"),
                callback: function (data) {
                    if (data.responseObject && data.responseObject.responseStatus && data.responseObject.responseMessage) {
                        $(".ev-logoUrl>img, #logo_src").attr("src", data.responseObject.responseMessage.url);
                    };
                    comm.showSuccessPop({
                        title: '更新头像成功',//标题
                        content: '现在其他医师可以看到您的新头像了',//内容
                        second: 3,//时间
                        obj: $(".ev-logoUrl").parent()//存放dom的父元素
                    });
                }
            });

            //单位
            //TODO  单位需要后台给值
            var unite = auth.company ? auth.company : auth.schoolName;
            var desStr = "";
            var reminderBar = $(".al-auth-reminder");//补全四证或者认证失败的提示
            // auth.state=9;
            var authMedicalId = auth.medicalTitle.split("_")[0];
            auth.authMedicalId = authMedicalId;
            // console.log(auth.state)
            var manufacturerOnOff = unit.customerRole!==3;
            if ( auth.state !== 2 && auth.state !== 7 && auth.state !== 8 && auth.state !== 9) {//未认证
                var nickname = auth.lastName + auth.firstName;
                if (nickname === "") nickname = comm.getRegisterName(unit.email, unit.mobile);
                obj.userName.text(nickname);

                $(".ev-trueName").text(nickname);
                //改版前代码开始
                // obj.companyMedicalTitle.html('<p id="EV-NoQualificationUser">您尚未认证</p>');
                //改版前代码结束
                //改版后代码开始
                function goAuth() {
                    var noAuthTemplate = "<section class='al-not-auth'><span>" + desStr + "</span><button class='al-go-auth ev-go-auth'>去认证</button></section>";
                    obj.companyMedicalTitle.html(noAuthTemplate);
                    $(".ev-go-auth").off("click").on("click", function () {
                        user.login({
                            callback: function () {
                                window.location.reload();
                            },
                            scene: privilegeSceneConst.eSceneTypeAuth
                        });
                        //事件埋点
                        comm.creatEvent({
                            triggerType: "认证",
                            keyword: "去认证",
                            actionId: 23
                        });
                    });
                }
                if ((auth.state === 3)&&manufacturerOnOff) {
                    desStr = "认证未通过审核,请重新认证";
                    $(".al-auth-failed-des").html("认证未通过审核，请重新认证");
                    $(".ev-noAuth-hide").show();//显示姓名，粉丝行
                    goAuth();
                    //reminderBar.addClass("al-auth-reminder-failed").find(".al-auth-reminder-content").html("认证未通过审核，请重新认证");
                } else if ((auth.state === -1 || auth.state === 0)&&manufacturerOnOff) {
                    desStr = "认证后可使用唯医全部功能";
                    $(".ev-noAuth-hide").hide();//隐藏姓名，粉丝行
                    goAuth();
                }else{
                    $(".ev-noAuth-hide").show();//显示姓名，粉丝行
                }
                if ((auth.state === -1||auth.state === 3)&&manufacturerOnOff) {//认证审核
                    $(".ev-onAuthAudit").hide();
                    $(".ev-showAuth").show();//显示认证引导
                }
                if ((auth.state === 0||auth.state === 1||auth.state === 7)&&manufacturerOnOff) {//认证审核
                    $(".ev-onAuthAudit").show();
                    $(".ev-showAuth").hide();
                }
                if(auth.state===1){
                    $(".ev-noAuth-hide").hide();
                    if(list.authFlag==1){
                        $(".al-certification-status").html('<p>'+content+'</p>').show().addClass("al-certification-v2Status");
                    }else{
                        $(".al-certification-status").html('<p>'+content+'</p>').show().addClass("al-certification-v1Status");
                    }
                }
                //reminderBar.show(300);
                //改版后代码结束
                if(manufacturerOnOff){
                    $(".ev-hasAuth").hide();
                    $("#ev-nowAuth").on("click", function () {//点击认证
                        user.login({
                            callback: function () {
                                window.location.reload();
                            },
                            scene: privilegeSceneConst.eSceneTypeAuth
                        })
                        //事件埋点
                        comm.creatEvent({
                            triggerType: "认证",
                            keyword: "去认证",
                            actionId: 23
                        });
                    });
                    $("#ev-goAuth").show();
                }

            } else {
                $(".ev-noAuth-hide").show();//显示姓名
                var name = auth.lastName + auth.firstName;
                $(".ev-trueName").text(name);
                obj.userName.html(name + '<i class="al-vipBigUser al-vipNewBigUser"></i>');

                if (auth.medicalTitleShow) {
                    obj.companyMedicalTitle.html('<p class="ev-medical1">' + auth.medicalTitleShow + '</p><p class="ev-unit">' + unite + '</p>');
                } else {
                    obj.companyMedicalTitle.html('<p class="ev-unit">' + unite + '</p>');
                }
                //obj.companyMedicalTitle.html('<p class="ev-medical">' + auth.medicalTitleShow + '</p><p class="ev-company">' + auth.company + '</p>');
                authAttachment.init();//认证信息编辑
                // console.log()
                if ((auth.state === 0||auth.state === 1||auth.state === 7)&&manufacturerOnOff){
                    $(".ev-hasAuth").hide();
                    $(".ev-onAuthAudit").show();
                    $(".ev-showAuth").hide();
                }else{
                    if(manufacturerOnOff){
                        $(".ev-applyAuth").show();
                    }
                }
                if ((auth.state === 0||auth.state === 1||auth.state === 7)&&manufacturerOnOff) {//认证审核
                    $(".ev-onAuthAudit").show();
                    $(".ev-showAuth").hide();
                    $(".ev-applyAuth button").css("opacity", "0.7");
                } else {
                    applyAuth.init();
                }
                if ((auth.state === 9)&&manufacturerOnOff) {
                    //desStr ="v2认证未通过审核,请重新认证";
                    $(".al-auth-des").html("执业申请被拒绝，点击重新提交");
                    reminderBar.addClass("al-auth-reminder-failed").find(".al-auth-reminder-content").html("执业申请被拒绝，点击重新提交");
                    reminderBar.show(300).off("click").on("click", function () {
                        g_sps.jump(null,"/pages/singlePage/user/auth.html");
                    });
                }
                if ((auth.state === 2) && (auth.state != 7)&&manufacturerOnOff&&!audit) {
                    reminderBar.addClass('al-reminder-no-auto');
                    reminderBar.find(".al-auth-reminder-content").html('<em>补充证件信息，即可在线执业</em>');
                    reminderBar.show(300).off("click").on("click", function () {
                        $("[data-role='qualification']").trigger("click");
                        if ($("[data-star-sign='false']").eq(0).length === 1&&!para.auth) {
                            var scrollTop = $("[data-star-sign='false']").eq(0).offset().top;
                            $("html,body").animate({scrollTop: scrollTop}, 1000);
                        }
                    });
                }
                $(".al-auth-reminder-close").off("click").on("click", function (e) {
                    e.stopPropagation();
                    $(".al-auth-reminder").hide();
                });

                if ((auth.state === 2 || auth.state === 7 || auth.state === 9)&&manufacturerOnOff) {
                    $(".al-vipBigUser").css({"background": "url('/images/img10/authentication/V1.png') no-repeat 50% 50%"});
                }
                if ((auth.state === 8)&&manufacturerOnOff) {
                    $(".al-vipBigUser").css({"background": "url('/images/img10/authentication/V2.png') no-repeat 50% 50%"});
                }
                if(auth.state===7&&manufacturerOnOff){
                    $(".al-certification-status").html('<p>'+content+'</p>').show().addClass("al-certification-v2Status");
                }
                if(auth.state==2&&audit){//修改认证审核中
                    $(".al-certification-status").html('<p>'+content+'</p>').show().addClass("al-certification-v2Status");
                }
            }
            obj.fansNum.text(csc.fansNum);
            // obj.followNum.text(csc.followpeopleNum);
            obj.followNum.text(csc.followOrgNum?csc.followOrgNum:csc.followpeopleNum);
            obj.upNum.text(csc.othersUpNum);
            $(".ev-clinicalYear").text(auth.clinicalTime + "年");

            comm.ajax.request({
                "port": "/call/customer/auth/getCustomerAuth/",
                postData: {
                    customerId: obj.cid

                },
                success: function (req) {
                    // console.log(req)
                    function caseShow(data) {
                        // console.log(data)
                        var caseStr = "";
                        $.each(data, function (i, v) {
                            if (i === 0) {
                                caseStr += "<span class='al-adept-result-item al-adept-result-case' data-caseId='" + v.illnessId + "'>" + v.illnessName + "</span>";
                            } else {
                                caseStr += "<i>，</i><span class='al-adept-result-item al-adept-result-case' data-caseId='" + v.illnessId + "'>" + v.illnessName + "</span>";
                            }
                        });
                        if (caseStr.length > 0) {
                            var goodAtCase =  $(".ev-good-at-case");
                            goodAtCase.html(caseStr);
                            base.fieldTypeOverflow()
                        }
                    }
                    function showMixDate(data) {//基本信息数据

                        /*var departmentLastResult = $('.ev-good-at-department'),
                            fieldTypeLastResult = $('.ev-good-at-fieldType'),
                            yesteryearNumLastResult = $('#yesteryearOperationNum'),
                            precedingNumLastResult = $('#precedingyearOperationNum')*/

                        var d = new Date(),
                            nowYear = +d.getFullYear()
                        $('.boneCaseNum .yesteryear').text(nowYear-1+'年')
                        $('.boneCaseNum .precedingyear').text(nowYear-2+'年')
                        // $('.boneCaseNum i').show()

                        function dataIsNull(num) {
                            if(num&&num.length>0){
                                return num
                            }else {
                                return '--'
                            }
                        }
                        function dataNumIsNull(num) {
                            if(num&&num>0){
                                $('.boneCaseNum i').show()
                                return num
                            }else {
                                return '--'
                            }
                        }

                        departmentLastResult.html(dataIsNull(data.department))//科室
                        fieldTypeLastResult.html(dataIsNull(data.expertise))//擅长领域
                        yesteryearNumLastResult.html(dataNumIsNull(data.yesteryearOperationNum))//去年手术量
                        precedingNumLastResult.html(dataNumIsNull(data.precedingyearOperationNum))//前年手术量
                        // /base.fieldTypeOverflow()
                        // $('#doctorWrote_count').html(data.sendWord)//医师寄语
                    }
                    showMixDate(req.responseObject.responseData.data_list);
                    testNum($('.ev-operation'));//非认证用户前年 完成手术数
                    caseShow(req.responseObject.responseData.data_list.illnessList);
                    surgery.userSurgeryList = JSON.parse(JSON.stringify(req.responseObject.responseData.data_list.operationList));
                    $.each(surgery.userSurgeryList,function(i,v){
                        if(parseInt(v.specialtyId,10)===0){
                            surgery.configuration = v;
                        }
                    });
                    var cliYear = req.responseObject.responseData.data_list.clinicalYear;
                    var yearStr = cliYear?cliYear.split("-"):[];
                    surgery.init();
                }

            });
            //科室
            if (auth.platformId == 1) {
                $(".ev-department").text('骨科');
            } else {
                $(".ev-department").text('手外科');
            }

            $(".ev-medical").text(comm.cutLine(auth.medicalTitle, "_", "，"));
            $(".ev-unit").text(unite);
            var area = auth.areasExpertise ? auth.areasExpertise : baseInfo.areasExpertise;
            var area1 = area ? area.split(",") : [];
            var areaHtml = "";
            $.each(area1, function (i, val) {
                if (val) {
                    if (val.split("_")[1]) {
                        areaHtml += '<figure class="al-tableItemTagItem" tagId="' + val.split("_")[0] + '">' + val.split("_")[1] + '</figure>';
                    }
                }
            });

            $(".ev-areas").html(areaHtml);
            if (baseInfo.sexId == "1") {
                $(".ev-sex").text("男");
            }
            if (baseInfo.sexId == "2") {
                $(".ev-sex").text("女");
            }
            var birthYear = $.trim(baseInfo.birthday) ? baseInfo.birthday : auth.birthYear;
            $(".ev-birth").text(birthYear ? (birthYear.substring(0, 4) + '年' + birthYear.substring(5, 7) + '月' + birthYear.substring(8, 10) + "日") : '');
            registTime = baseInfo.registTime;
            $(".ev-registTime").text(registTime.substring(0, 4) + '/' + registTime.substring(5, 7) + '/' + registTime.substring(8, 10));
            if (unit.customerRole !== 3) {//厂商无分享自己权限
                //分享
                var href = window.location.href;
                var url = "https://www.allinmd.cn/pages/personal/others_baseInfo.html?cid=" + obj.cid;
                var h5Url = "https://m.allinmd.cn/dist/personal/others_index.html?cid=" + obj.cid+'#/baseInfo';
                shareSence = shareSenceConst.personal_info;
                //分享
                module.share({
                    container: $(".ev-shareContainer"),//存放分享组件的父级
                    type: 2,//默认为1  1：社交分享  2：页面左下角全站分享
                    title: "",//分享标题
                    h5Url: h5Url,//h5页面链接
                    shareTrend: 0,//0:不需要站内动态分享  1：需要站内动态分享
                    trendUrl: '',//分享到站内动态的接口
                    data: {},//分享到站内动态的接口参数
                    callback: function () {},//分享到站内动态成功后回调函数
                    triggerRequest:function(content){//事件点击
                        //获取分享话术
                        var data = {};
                        data.customerId = obj.cid;
                        data.logoUseFlag = 5;
                        data.pageIndex = 1;
                        data.pageSize = 1;
                        data.useFlag = 1;
                        data.sceneType = getShareContentSense.my_index;
                        data.resourceType = ResouceType.person;
                        var param = {};
                        param.paramJson = $.toJSON(data);
                        $.ajax({
                            url: PC_CALL+'comm/data/share/getMapList3/',
                            type: "post",
                            data: param,
                            dataType: 'json',
                            async:false,
                            success: function (d) {
                                if (d && d.responseObject.responseData && !$.isEmptyObject(d.responseObject.responseData) && d.responseObject.responseData.data_list.length) {
                                    var item = d.responseObject.responseData.data_list[0];
                                    content.pic = item.share_comm.shareImageUrl;
                                    content.title=item.share_comm.shareTitle!=""?item.share_comm.shareTitle:document.title;
                                    $.each(item.share_channel,function(i,el){
                                        if(el.shareChannel=='Sina'){
                                            content.sinaTitle=el.shareDesc;
                                        }else if(el.shareChannel=="QQFriend"){
                                            content.qqTitle = el.shareTitle;
                                            content.qqSummary = el.shareDesc;
                                        }else if(el.shareChannel=="QZone"){
                                            content.qqZoneTitle=el.shareTitle;
                                            content.qqZoneSummary = el.shareDesc;
                                        }
                                    });
                                }
                            }

                        });
                    },
                    shareQQSuc: function () {//分享qq成功
                        comm.shareLog({
                            shareType: "",
                            resourceId: "",
                            resourceType: "",
                            refId: "",
                            isValid: 1,
                            shareSence: shareSence,
                            shareChannel: 2,
                            shareContent: document.title
                        });
                    },
                    shareQzoneSuc: function () {
                        comm.shareLog({
                            shareType: "",
                            resourceId: "",
                            resourceType: "",
                            refId: "",
                            isValid: 1,
                            shareSence: shareSence,
                            shareChannel: 1,
                            shareContent: document.title
                        });
                    },//分享qzone成功
                    shareSinaSuc: function () {
                        comm.shareLog({
                            shareType: "",
                            resourceId: "",
                            resourceType: "",
                            refId: "",
                            isValid: 1,
                            shareSence: shareSence,
                            shareChannel: 3,
                            shareContent: document.title
                        });
                    }//分享sina成功
                });
            }

            base.init();
            summary.init();
            doctorWrote.init();
            contactAddress.init();
            base.informationNone()
        }
    });
    //左侧导航点击
    $(".ev-leftNav figure").each(function (i, em) {
        $(em).on("click", function (index) {
            $(".ev-leftNav figure").removeClass("active");
            $(this).addClass("active");
            $(".ev-rightCon").removeClass("active");
            $(".ev-rightCon").eq(i).addClass("active");
        })
    });
    //申请认证信息的修改
    var applyAuth = {};
    applyAuth = {
        init: function () {
            var t = this;
            var data = {};
            data.customerId = obj.cid;
            data.state = 4;
            data.sortType = 1;
            data.isValid = 1;
            data.authType = 3;
            var param = {paramJson: $.toJSON(data)};
            $(".ev-applyAuth").on("click", function () {
                var param = {
                    customerId: obj.cid
                };
                function edit(){
                    var callBack = function () {
                        $(".al-changeInfoPop").show();
                        $(".ev-iKnow").off("click").on("click", function () {
                            $(".al-changeInfoPop").hide();
                        });
                    };
                    var options = {
                        port: path.getAuthProcess,
                        postData: param,
                        success: callBack,
                        failed: function () {
                            g_sps.jump(null,"/pages/singlePage/user/auth.html?isCustomerInfo=true");
                        }
                    };
                    comm.ajax.request(options)
                }
                if(auth.state===8){
                    $.makeSurePopup({
                        title:"变更提示",
                        content:"审核将在3个工作日内完成",
                        content01:"变更审核期间您可以正常使用唯医,<br/>但是无法在唯医骨科执医",
                        callback:function(){
                            edit();
                        },
                        error:function(){

                        }
                    });
                }else{
                    edit();
                }



            });
        },
        //取消
        cancel: function () {
            $("#ev-applyAuthCancel").on("click", function () {
                $(".ev-mainContent").show();
                $(".ev-applyAuthConent").hide();
                $(".al-backToTop").show();
                //事件埋点
                comm.creatEvent({
                    triggerType: "全站功能按钮点击",
                    keyword: "申请认证信息修改取消",
                    actionId: 45
                });
            })
        },
        //提交状态判断
        submitConfig: function () {
            var submit = false;
            $("#ev-applyAuthSave").attr("submit", "false").addClass("active");
            var fullName = auth.lastName + auth.firstName;
            var unitType = 0;
            if (auth.company) {
                unitType = 1;
            } else if (auth.schoolName) {
                unitType = 2;
            }
            var medicalTitle = auth.medicalTitle;
            var areasExpertise = auth.areasExpertise;
            var updateMedicalTitle = $(".ev-medTitle").attr("medicaltitle");
            var updateAreasExpertise01 = '';
            $(".ev-areaSed .tagName").each(function (i, em) {
                updateAreasExpertise01 += $(em).attr("tagid") + "_" + $("span", $(em)).text() + ",";
            });
            updateAreasExpertise = updateAreasExpertise01.substring(0, updateAreasExpertise01.length - 1);
            if ($("#clinicalYear01 option:selected").val() != 0 && $("#clinicalMonth01 option:selected").val() != 0) {
                var updateClinicalYear = $("#clinicalYear01 option:selected").val() + "-" + $("#clinicalMonth01 option:selected").val() + "-01";
            }
            if (fullName != $("#fullName01").val()) {
                submit = true;
            }
            if (unitType != this.unitType) {
                submit = true;
            }
            if (this.unitType == 1 && auth.company != $("#company01").val()) {
                submit = true;
            }
            if (this.unitType == 2 && auth.schoolName != $("#schoolName01").val()) {
                submit = true;
            }
            if (medicalTitle != updateMedicalTitle) {
                submit = true;
            }

            if ($("[data-departmentapplytype=" + auth.platformId + "]").find(".al-tableRadioOn").length == 0) {
                submit = true;
            }

            if (updateAreasExpertise != areasExpertise) {
                submit = true;
            }
            if (updateClinicalYear && (updateClinicalYear.substring(0, 7) != auth.clinicalYear.substring(0, 7))) {
                submit = true;
            }
            if (submit) {
                $("#ev-applyAuthSave").attr("submit", "true").removeClass("active");
            }

        },
        //编辑
        edit: function () {
            var t = this;
            t.departmentType = auth.platformId ? auth.platformId : 1;
            $("#fullName01").val(auth.lastName + auth.firstName);
            $("#company01").val(auth.company);
            $("#schoolName01").val(auth.schoolName);
            //医院的搜索
            $("#company01").lenovo({
                url: path.hospital,
                showName: "hospitalName", //显示出的值
                id: "id",   //自定义属性值
                hiddenId: "companyId"    //自定义属性
            });
            //学校名称的选择   TODO 修改
            $("#schoolName01").lenovo({
                url: path.university,
                showName: "schoolName",
                id: "id",//自定义属性值
                hiddenId: "schoolId"//自定义属性
            });

            //科室
            if (auth.platformId) {
                $("[data-departmentApplyType='" + auth.platformId + "']").find("i").addClass("al-tableRadioOn");
            }

            //职称的选择
            /*$(".ev-medicalPar").medicalTitleV3({
                container: $(".ev-medTitle"),//存放已选择的职称
                defaultHide: 1,
                fn: function () {
                    t.submitConfig()
                }
            });*/
            //专业领域
            $(".ev-areaPar").areaExpertiseSelect({
                seledCon: $(".ev-areaSed"),//存放已选择的专业
                platformId: auth.platformId,
                fn: function () {
                    t.submitConfig()
                }
            });
            ymd({
                year: $("#clinicalYear01"),
                month: $("#clinicalMonth01"),
                default1: 1
            });
            var clinicalYear = auth.clinicalYear.substring(0, 4);

            gettime($("#clinicalYear01"), clinicalYear);
            gettime($("#clinicalMonth01"), auth.clinicalYear.substring(5, 7));
            var medical = auth.medicalTitle;
            var medical1 = medical ? medical.split(",") : [];
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
            $(".ev-medTitle").attr("medicalTitle", medical);
            $(".ev-medTitle").text(medicalTitle.substring(0, medicalTitle.length - 1));
            //清空职称的选中状态
            $(".ev-medicalPar .ev-medicalLiList").attr("select-status", "false");
            $(".ev-medicalPar .ev-medicalLiList").removeClass("active");
            //比对是对应职称选中
            $.each($(".ev-medicalPar .ev-medicalLiList"), function (i, em) {
                $.each(ids, function (j, val) {
                    if (val == 3 || val == 4) {
                        $(".ev-medicalPar .al-tagSelectorList:gt(0)").show();
                    }
                    if ($(em).attr("medicalid") == val) {
                        $(em).attr("select-status", "true");
                        $(em).addClass("active");
                    }
                });
            });
            //专业
            var area = baseInfo.areasExpertise;
            var area1 = area ? area.split(",") : [];
            var areaHtml = "";
            //清空专业领域选中状态
            $(".ev-tagConList button").attr("select-status", "false");
            $(".ev-tagConList button").removeClass("active");
            $.each(area1, function (i, val) {
                if (val) {
                    if (val.split("_")[1]) {
                        areaHtml += '<div class="al-tableTagConfigItem tagName" tagid="' + val.split("_")[0] + '"><span style="margin:0;">' + val.split("_")[1] + '</span><i class="ev-tagClose" tagid="' + val.split("_")[0] + '"></i></div>';
                        $.each($(".ev-tagConList button"), function (j, em) {
                            if ($(this).attr("tagid") == val.split("_")[0]) {
                                $(this).attr("select-status", "true");
                                $(this).addClass("active");
                            }
                        });
                    }
                }
            });
            $(".ev-areaSed").html(areaHtml);
            $(".ev-tagClose").on("click", function () {
                tagId = $(this).attr("tagId");
                $(this).parent().remove();
                $.each($(".ev-tagConList button"), function (i, em) {
                    if ($(em).attr("tagId") == tagId) {
                        $(em).removeClass("active");
                        $(em).attr("select-status", "false");
                    }
                });
                t.submitConfig();
            });

            //科室
            $(".ev-departmentApply").on("click", function () {
                t.departmentType = $(this).attr("data-departmentApplyType");
                $(this).find("i").addClass("al-tableRadioOn");
                $(this).siblings().find("i").removeClass("al-tableRadioOn");
                //专业领域
                $(".ev-areaPar").areaExpertiseSelect({
                    seledCon: $(".ev-areaSed"),//存放已选择的专业
                    platformId: t.departmentType,
                    fn: function () {
                        t.submitConfig()
                    }
                });
                t.submitConfig();
            });

            //单位 TODO:
            $(".ev-onUnit01").on("click", function () {
                var index = $(this).index();
                $(".ev-inUnit01").parent().show();
                $(".ev-inUnit01").hide();
                $(".ev-inUnit01").eq(index).show();
                $(".ev-onUnit01 i").removeClass("al-tableRadioOn");
                $(this).find("i").addClass("al-tableRadioOn");
                t.unitType = $(this).attr("unitType");
                t.submitConfig();
            });
            if (auth.company) {
                $(".ev-onUnit01").eq(0).click();
            } else if (auth.schoolName) {
                $(".ev-onUnit01").eq(1).click();
            }

        },
        //保存
        save: function () {
            var t = this;
            $("#ev-applyAuthSave").on("click", function () {
                if ($(this).attr("submit") == "true") {
                    var data = {};
                    data.authId = auth.authId;
                    data.customerId = auth.customerId;
                    data.authType = 3;
                    data.state = 4;
                    data.beforeFullName = auth.lastName + auth.firstName;
                    //data.beforePlatformId= auth.departmentType;
                    data.beforePlatformId = auth.platformId;
                    data.beforeAreasExpertise = auth.areasExpertise;
                    data.beforeMedicalTitle = auth.medicalTitle;
                    if (auth.company) {
                        data.beforeWorkplaceType = 1;
                        data.beforeWorkplaceId = auth.companyId;
                        data.beforeWorkplace = auth.company;
                    } else if (auth.schoolName) {
                        data.beforeWorkplaceType = 2;
                        data.beforeWorkplaceId = auth.schoolId;
                        data.beforeWorkplace = auth.schoolName;
                    }
                    data.beforeClinicalYear = auth.clinicalYear;
                    data.updateClinicalYear = $("#clinicalYear01 option:selected").val() + "-" + $("#clinicalMonth01 option:selected").val() + "-01";
                    data.updateFullName = $("#fullName01").val();
                    data.updatePlatformId = t.departmentType;
                    data.updateMedicalTitle = $(".ev-medTitle").attr("medicaltitle");
                    if (t.unitType == 1) {//在医院
                        data.updateWorkplaceType = 1;
                        data.updateWorkplaceId = $("#company01").attr("companyId");
                        data.updateWorkplace = $("#company01").val();
                    } else if (t.unitType == 2) {//在学校
                        data.updateWorkplaceType = 2;
                        data.updateWorkplaceId = $("#schoolName01").attr("schoolId");
                        data.updateWorkplace = $("#schoolName01").val();
                    }
                    areasExpertise = '';
                    $(".ev-areaSed .tagName").each(function (i, em) {
                        areasExpertise += $(em).attr("tagid") + "_" + $("span", $(em)).text() + ",";
                    });
                    data.updateAreasExpertise = areasExpertise.substring(0, areasExpertise.length - 1);
                    var isSuccess = 1;
                    if (!data.updateFullName) {
                        $("#fullName01").parent().addClass("error");
                        $("#re_con01").addClass("showIb").html("<i></i>请填写姓名！");
                        isSuccess = 0;
                    } else if (comm.getByteLen(data.updateFullName) > 100) {
                        $("#fullName01").parent().addClass("error");
                        $("#re_con01").addClass("showIb").html("<i></i>最长50个中文或100个英文！");
                        isSuccess = 0;
                    } else {
                        $("#fullName01").parent().removeClass("error");
                        $("#re_con01").removeClass("showIb");
                    }
                    if (!data.updateMedicalTitle) {
                        $(".ev-medicalPar").addClass("error");
                        $("#med_error01").addClass("showIb");
                        isSuccess = 0;
                    } else {
                        $(".ev-medicalPar").removeClass("error");
                        $("#med_error01").removeClass("showIb");
                    }
                    ;
                    if (!t.unitType) {
                        $("#onUnit_error01").addClass("showIb").html("<i></i>请填写单位！");
                        isSuccess = 0;
                    } else {
                        $("#onUnit_error01").removeClass("showIb")
                    }

                    if (!t.departmentType) {
                        $("#onDepartment_error01").addClass("showIb").html("<i></i>请选择科室！");
                        isSuccess = 0;
                    } else {
                        $("#onDepartment_error01").removeClass("showIb")
                    }
                    if (data.updateClinicalYear == 0) {
                        $("#clinYear_error01").addClass("showIb");
                        isSuccess = 0;
                    } else {
                        $("#clinYear_error01").removeClass("showIb");
                    }
                    if (t.unitType == 1) {//选择在医院
                        if (!data.updateWorkplace) {
                            $("#company01").parent().addClass("error");
                            $("#company_error01").addClass("showIb").html("<i></i>请填写医院！");
                            isSuccess = 0;
                        } else if (comm.getByteLen(data.updateWorkplace) > 200) {
                            $("#company01").parent().addClass("error");
                            $("#company_error01").addClass("showIb").html("<i></i>最长100个中文或200个英文！");
                            isSuccess = 0;
                        } else {
                            $("#company01").parent().removeClass("error");
                            $("#company_error01").removeClass("showIb");
                        }
                    }
                    if (t.unitType == 2) {//选择在学校
                        if (!data.updateWorkplace) {
                            $("#schoolName01").parent().addClass("error");
                            $("#company_error01").addClass("showIb").html("<i></i>请填写学校！");
                            isSuccess = 0;
                        } else if (comm.getByteLen(data.updateWorkplace) > 200) {
                            $("#schoolName01").parent().addClass("error");
                            $("#company_error01").addClass("showIb").html("<i></i>最长100个中文或200个英文！");
                            isSuccess = 0;
                        } else {
                            $("#schoolName01").parent().removeClass("error");
                            $("#company_error01").removeClass("showIb");
                        }
                    }

                    if (!data.updateAreasExpertise) {
                        $("#area_error01").addClass("showIb");
                        isSuccess = 0;
                    } else {
                        $("#area_error01").removeClass("showIb");
                    }
                    if (isSuccess == 0) {
                        return;
                    }
                    $(this).attr("submit", "false").addClass("active");
                    //$(".al-infoChangeDetailsBox").mask("");
                    var param = {};
                    param.paramJson = $.toJSON(data);

                    $.ajax({
                        type: "post",
                        url: path.saveApplyAuth,
                        data: param,
                        dataType: "json",
                        success: function (rep) {
                            if (rep && rep.responseObject.responseStatus) {

                                $(".al-changeInfoPop").show();
                                $(".ev-iKnow").on("click", function () {
                                    $(".ev-mainContent").show();
                                    $(".ev-applyAuthConent").hide();
                                    $(".al-backToTop").show();
                                    $(".al-changeInfoPop").hide();
                                })
                            }
                        },
                        error: function () {
                        }
                    });
                }

            });
        }
    };
    //基本信息
    var base = {};
    // var authOnOff = false;//全局标识用户是否认证的状态，默认为未认证状态false
    var departmentLastResult = $('.ev-good-at-department'),
        departmentNewResult = $('#departmentInput'),
        fieldTypeLastResult = $('.ev-good-at-fieldType'),
        fieldTypeNewResult = $('#fieldTypeInput'),
        yesteryearNumLastResult = $('#yesteryearOperationNum'),
        yesteryearNumNewResult = $('#yesteryearOperationNumInput'),
        precedingNumLastResult = $('#precedingyearOperationNum'),
        precedingNumNewResult = $('#precedingyearOperationNumInput')
    //var subjectData = {};
    //var lastSubjectData = {};
    //var subjectList = [];
    //var originalSurgeryList = [];
    base = {
        baseInfoEditObj: null,
        init: function () {
            /*if ( auth.state !== 2) {//未认证
                authOnOff = false;//未认证
                this.baseInfoEditObj = $("#base_edit");
                this.bindEdit();
                this.bindCancel();
                // this.adeptSurgery();
            } else {
                authOnOff = true;//已认证*/
                ymd({
                    year: $("#authYear"),
                    month: $("#authMonth"),
                    day: $("#authDay"),
                    default1: 1,
                    css: {}
                });
                this.baseInfoEditObj = $("#base_authEdit");
                this.bindAuthEdit();
                this.bindAuthCancel();
                // this.adeptSurgery();
            // }
            base.departmentText()
        },
        adeptSurgery: function () {
            var t = this;
            function selectedSurgery() {
                var surgeryStr = "";
                $.each(surgery.statisticsSurgery().exhibition, function (i, v) {
                    var dotStr = "";
                    if(v.operationName){
                        if (i !== 0) {
                            dotStr = '<i class="al-dot">，</i>';
                        }
                        surgeryStr += dotStr + '<span class="al-adept-surgery-name" data-resultsurgeryid="' + v.operationId + '">' + v.operationName + '</span>';
                    }


                });
                var inputBar = base.baseInfoEditObj.find(".al-adept-surgery-input");
                inputBar.prevAll().remove();
                var demoList = $(surgeryStr);
                inputBar.before(demoList);
                t.deleteSurgery();
                inputBar.off("focus").on("focus", function () {
                    surgery.templateSubject(surgery.subjectList);
                    var topVal = base.baseInfoEditObj.find(".al-adept-surgery").parent().height();
                    base.baseInfoEditObj.find(".al-adept-surgery-container").removeClass("hide").css({"top": topVal});
                    t.submitSurgery();
                });
            }

            selectedSurgery();

        },
        submitSurgery:function(){
            var t = this;
            $('.al-adept-submit-ensure').off("click").on("click",function(){
                surgery.copyData(1);
                t.adeptSurgery();
                surgery.cancelMethod();
                //console.log(surgery.statisticsSurgery(),surgery.userSurgeryList)
            });
            $(".al-adept-submit-cancel").off("click").on("click",function(){
                surgery.copyData(0);
                surgery.cancelMethod();
            });

        },
        deleteSurgery:function(){
            var t = this;
            var surgeryInput = base.baseInfoEditObj.find(".al-adept-surgery-input");
            if(surgeryInput.val().length){
                surgeryInput.removeAttr("data-editOnOff");
            }else{
                surgeryInput.attr({"data-editonoff":true});
            }
            var editOnOff = function(){
                if(surgeryInput.val().length>0){
                    surgeryInput.removeAttr("data-editOnOff");
                }else{
                    /*if(surgeryInput.attr("data-editonoff")){*/
                        var lastOne =$(".al-adept-surgery-name:last");
                        var listObj = $(".al-adept-surgery-name");
                        var lastDot = $(".al-adept-surgery .al-dot:last");
                        var deleteId = lastOne.attr("data-resultsurgeryid");
                        lastOne.remove();
                        lastDot.remove();
                        var topVal =base.baseInfoEditObj.find(".al-adept-surgery").parent().height();
                        base.baseInfoEditObj.find(".al-adept-surgery-container").css({"top": topVal});
                        if (listObj.length === 0) {
                            surgeryInput.removeAttr("data-editOnOff");
                        }
                        surgery.editSurgery(deleteId,0)
                }
            };
            surgeryInput.off("keydown").on("keydown",function (e) {
                if(e.keyCode===8){
                    editOnOff();
                }
            })
        },
        adeptCase: function (edit, type, data) {
            var t = this;
            var department = 0;
            var fieldType = 1;
            var caseType = 2;
            var surgeryType = 3;
            var inputSurgery = null;
            var searchPort = "";
            var searchType = "";
            var authContainer = null;
            if (edit) {
                authContainer = $("#base_authEdit");
            } else {
                authContainer = $("#base_edit");
            }
            switch (type) {
                case department:
                    inputSurgery = authContainer.find(".al-adept-department-input");
                    searchPort = "";
                    searchType = "department";
                case fieldType:
                    inputSurgery = authContainer.find(".al-adept-fieldType-input");
                    searchPort = "";
                    searchType = "fieldType";
                case caseType:
                    inputSurgery = authContainer.find(".al-adept-case-input");
                    searchPort = "";
                    searchType = "case";
                    break;
                case surgeryType:
                    inputSurgery = authContainer.find(".al-adept-surgery-input");
                    searchPort = "";
                    searchType = "surgery";
                    break;
                default:
                    break;
            }
            // var operateContainer = inputSurgery.parents(".al-tableItemContent");
            var resultContainer = inputSurgery;

            var templateResult = function (d) {
                var resultStr = "";
                if (searchType === "department") {
                    $.each(d, function (i, v) {
                        resultStr += '<li class="al-adept-' + searchType + '-result-item" data-illnessId="' + v.illnessId + '">' +
                            '<p class="al-adept-' + searchType + '-result-content">' +
                            v.illnessName +
                            '</p>' +
                            '</li>'
                    });
                } else if (searchType === "case") {
                    $.each(d, function (i, v) {
                        resultStr += '<li class="al-adept-' + searchType + '-result-item" data-illnessId="' + v.illnessId + '">' +
                            '<p class="al-adept-' + searchType + '-result-content">' +
                            v.illnessName +
                            '</p>' +
                            '</li>'
                    })
                }else {
                    $.each(d, function (i, v) {
                        resultStr += '<li class="al-adept-' + searchType + '-result-item" data-operationId="' + v.operationId + '">' +
                            '<p class="al-adept-' + searchType + '-result-content">' +
                            v.operationName +
                            '</p>' +
                            '</li>'

                    });
                }

                var demoList = $(resultStr);
                demoList.each(function () {
                    $(this).off("click").on("click", function () {
                        var editContainer = null;
                        if (edit) {
                            editContainer = $("#base_authEdit");
                        } else {
                            editContainer = $("#base_edit");
                        }
                        var resultContainer = editContainer.find(".al-adept-" + searchType + "-input").parents(".al-adept-" + searchType + "");
                        var listResult = editContainer.find(".al-adept-" + searchType + "-input");
                        if (searchType === "case") {
                            listResult.before('<span class="al-adept-' + searchType + '-name" data-resultCaseId="' + $(this).attr("data-illnessId") + '">' + $(this).text() + '</span>');
                        } else {
                            listResult.before('<span class="al-adept-' + searchType + '-name" data-resultSurgeryId="' + $(this).attr("data-operationId") + '">' + $(this).text() + '</span>');
                        }
                        var itemsLen = resultContainer.find(".al-adept-" + searchType + "-name").length;
                        var lastItem = resultContainer.find(".al-adept-" + searchType + "-name:last");
                        if (itemsLen > 1) {
                            lastItem.before('<i class="al-dot">，</i>')
                        }
                        if (itemsLen > 0) {
                            if (searchType === "case") {
                                editContainer.find(".al-adept-" + searchType + "-input").attr({"placeholder": "更多擅长疾病"}).val("").css({"width": 105});
                            } else {
                                editContainer.find(".al-adept-" + searchType + "-input").attr({"placeholder": "更多擅长手术"}).val("").css({"width": 105});
                            }
                        } else {
                            if (searchType === "case") {
                                editContainer.find(".al-adept-" + searchType + "-input").attr({"placeholder": "请输入擅长疾病(可输入多个)"}).val("").css({"width": 200});
                            } else {
                                editContainer.find(".al-adept-" + searchType + "-input").attr({"placeholder": "请输入擅长手术(可输入多个)"}).val("").css({"width": 200});
                            }
                        }
                        //editContainer.find(".al-adept-" + searchType + "-input").trigger("blur");
                        //alert(editContainer.find(".al-adept-" + searchType + "-result").length)
                        editContainer.find(".al-adept-" + searchType + "-result").hide().html("");
                        //return false;
                    });
                });
                return demoList;
            };
            if (data) {
                var templateLastData = function (d) {
                    var resultStr = "";
                    var dotStr = "";
                    $.each(data, function (i, v) {
                        if (i !== 0) {
                            dotStr = '<i class="al-dot">，</i>';
                        }
                        resultStr += dotStr + '<span class="al-adept-' + searchType + '-name" data-result' + searchType + 'id="' + v.relatedId + '">' + v.relatedName + '</span>';
                    });
                    return resultStr;
                };
                $(".al-adept-" + searchType + "-name").each(function () {
                    if ($(this).next().hasClass("al-dot")) {
                        $(this).next().remove();
                    }
                    $(this).remove();
                });
                resultContainer.before(templateLastData(data));
            }
            inputSurgery.off("focus").on("focus", function () {
                if ($(this).val().length === 0) {
                    $(this).attr("data-editonoff", "true");
                } else {
                    $(this).removeAttr("data-editonoff");
                }
            });
            inputSurgery.attr({"data-continuous":"true"});
            /*inputSurgery.off("compositionstart").on("compositionstart",function(){
                $(this).attr({"data-continuous":"false"});
            });
            inputSurgery.off("compositionend").on("compositionend",function(){
                $(this).attr({"data-continuous":"true"});
            });*/

            inputSurgery.off("input porpertychange").on("input porpertychange",function(){
                var inputObj = $(this);
                var isThis = $(this);
                var inputVal = inputObj.val();
                var len = inputVal.length;
                var searchType = inputObj.attr("data-searchType");
                var operateContainer = inputObj.parents(".al-tableItemContent");
                if (len > 0) {
                    var topVal = operateContainer.height();

                    var param = null;
                    var callBack = function (data) {
                        if(inputSurgery.val().length>0){
                            var dataList = data.responseObject.responseData.data_list;
                            operateContainer.find(".al-adept-" + searchType + "-result").html(templateResult(dataList)).css({"top": topVal}).show();
                        }else{
                            operateContainer.find(".al-adept-" + searchType + "-result").html("").hide();
                        }

                    };
                    var failedBack = function (data) {
                        operateContainer.find(".al-adept-" + searchType + "-result").html("").hide();
                    };
                    var port = "";
                    if (searchType === "case") {
                        port = "/call/comm/data/illness/getMapList/";
                        // port = "/js/scene/personal/case.json",
                        param = {
                            isValid: 1,	//string	是	是否有效1-有效0-无效
                            firstResult: 0,	//string	是	分页参数
                            maxResult: 20,	//string	是	分页参数
                            illnessName: inputVal,	//string	是	疾病名称（搜索用）
                            visitSiteId: 1
                        };
                    } else {
                        port = "/call/comm/data/operation/getMapList/";
                        // port = "/js/scene/personal/case.json",
                        param = {
                            isValid: 1,	//string	是	是否有效1-有效0-无效
                            firstResult: 0,	//string	是	分页参数
                            maxResult: 20,	//string	是	分页参数
                            operationName: inputVal,	//string	是	疾病名称（搜索用）
                            visitSiteId: 1
                        };
                    }

                    var options = {
                        port: port,
                        postData: param,//上传参数，json形式即可
                        get: true,
                        success: callBack,//成功的回调
                        failed: failedBack
                    };
                    /*if(inputObj.attr("data-continuous")=="true"){*/
                        clearTimeout(timer0);
                        var timer0 = setTimeout(function(){
                            comm.ajax.request(options);
                        },500);
                    /*}*/

                } else {
                    operateContainer.find(".al-adept-" + searchType + "-result").html("").hide();
                }
            });
            inputSurgery.off("keydown").on("keydown", function (e) {
                var inputObj = $(this);
                var isThis = $(this);
                var inputVal = inputObj.val();
                var len = inputVal.length;
                var searchType = inputObj.attr("data-searchType");
                var operateContainer = inputObj.parents(".al-tableItemContent");
                if(e.keyCode===8){
                    if(isThis.val().length){
                        if (isThis.attr("data-editOnOff")) {
                            isThis.removeAttr("data-editOnOff");
                        }
                    }else{
                        /*if (isThis.attr("data-editOnOff")) {*/
                            var lastOne = $(".al-adept-case-name:last");
                            var lastDot = $(".al-adept-case .al-dot:last");
                            lastDot.remove();
                            lastOne.remove();
                            if ($(".al-adept-case-name").length === 0) {
                                isThis.removeAttr("data-editOnOff");
                            }
                        /*}*/ /*else {
                            isThis.attr({"data-editOnOff": "true"})
                        }*/
                    }
                    if (len === 0) {
                        operateContainer.find(".al-adept-" + searchType + "-result").html("").hide();
                    }
                }else{

                    if(len===0){
                        operateContainer.find(".al-adept-" + searchType + "-result").html("").hide();
                    }
                }

            });
        },
        //认证编辑
        bindAuthEdit: function () {
            base.departmentAutoHeight()
            base.InvertedNum(fieldTypeNewResult,$('.ev-fieldInvertedNum'))
            base.textareaAutoH(fieldTypeNewResult)
            var t = this;
            $("#base_edit_btn").on("click", function () {
                var d = new Date(),
                    nowYear = +d.getFullYear()
                $('.boneCaseNumEdit .yesteryear').text(nowYear-1+'年')
                $('.boneCaseNumEdit .precedingyear').text(nowYear-2+'年');
                departmentNewResult.val(base.editNullInfo(departmentLastResult.text()));
                fieldTypeNewResult.val(base.editNullInfo(fieldTypeLastResult.text()));
                yesteryearNumNewResult.val(base.editNullInfo(yesteryearNumLastResult.text()))
                precedingNumNewResult.val(base.editNullInfo(precedingNumLastResult.text()))
                $(this).hide();
                $("#base_show").hide();
                $("#base_authEdit").show();
                $(".ev-contactTips").show();
                ymd({
                    year: $("#clinicalYear"),
                    month: $("#clinicalMonth"),
                    default1: 1
                });
                var yearStr = auth.clinicalYear.split("-");
                $("#clinicalYear").find("option[value='"+yearStr[0]+"']").attr("selected",true);
                $("#clinicalMonth").find("option[value='"+yearStr[1]+"']").attr("selected",true);

                var caseData = [];
                var surgeryData = [];
                $(".al-adept-result-case").each(function () {
                    var dataJson = {
                        "relatedName": $(this).text(),
                        relatedId: $(this).attr("data-caseId")
                    };
                    caseData.push(dataJson);
                });
                $(".al-adept-result-surgery").each(function () {
                    var dataJson = {
                        "relatedName": $(this).text(),
                        relatedId: $(this).attr("data-surgeryId")
                    };
                    surgeryData.push(dataJson);
                });
                t.adeptCase(true, 0, caseData);
                //t.adeptCase(true,1,surgeryData);
                t.adeptSurgery();
                t.bindAuthSave(auth);
            });
        },
        //取消
        bindAuthCancel: function () {
            $("#base_authCancel").on("click", function () {
                $("#base_authEdit").hide();
                $("#base_show").show();
                $("#base_edit_btn").show();
                $(".ev-contactTips").hide();
                $(".ev-authsexId i").removeClass("al-tableRadioOn");
                $(".ev-authsexId i").eq(0).addClass("al-tableRadioOn");
                //事件埋点
                comm.creatEvent({
                    triggerType: "全站功能按钮点击",
                    keyword: "基本信息修改取消",
                    browType: 102,
                    actionId: 45
                });
            });
        },
        saveBaseInfo: function (state) {


            var t = this;
            var yearObj = null;
            var monthObj = null;
            var cancelObj = null;
            var subDot = function (str) {
                var lastStr = "";
                lastStr = str.substring(0, str.length - 1);
                return lastStr;
            };
            var caseList = $(".al-adept-case-name");
            var surgeryList = $(".al-adept-surgery-name");
            // if (state) {//认证用户
                yearObj = $("#clinicalYear");
                monthObj = $("#clinicalMonth");
                cancelObj = $("#base_authCancel");
            // } else {//非认证用户
            //     yearObj = $("#clinicalYear-no");
            //     monthObj = $("#clinicalMonth-no");
            //     yesteryearNumNewResult = $('#uncertifiedYesteryear');
            //     precedingNumNewResult= $('#uncertifiedPrecedingyear');
            //     cancelObj = $("#base_cancel");
            //     departmentNewResult = $("#uncertifiedDepartmentInput");
            //     fieldTypeNewResult = $("#uncertifiedFieldType");
            // }

            var date = new Date;
            var clinicalYearObj = $(".ev-clinicalYear");
            var year = date.getFullYear();
            var clYear = (year - parseInt(yearObj.val(), 10));
            var yearOnOff = (clYear === parseInt(clinicalYearObj.text()));
            if (clYear) {
                clinicalYearObj.html((year - parseInt(yearObj.val(), 10)) + "年").attr({"data-resultTime": yearObj.val() + "-" + monthObj.val() + "-00"});
            }
            auth.clinicalYear = yearObj.val()+"-"+monthObj.val();
            var caseStr = "";
            var illnessIdList = "";
            var illnessNameList = "";
            caseList.each(function (i) {
                if (i === 0) {
                    caseStr += "<span class='al-adept-result-item al-adept-result-case' data-caseId='" + $(this).attr("data-resultcaseid") + "'>" + $(this).text() + "</span>";
                } else {
                    caseStr += "<i>，</i><span class='al-adept-result-item al-adept-result-case' data-caseId='" + $(this).attr("data-resultSurgeryId") + "'>" + $(this).text() + "</span>";
                }
                illnessNameList += $(this).text() + ",";
                illnessIdList += $(this).attr("data-resultcaseid") + ",";
            });
            var surgeryStr = "";
            var operationIdList = "";
            var operationName = "";
            var caseOnOff = true;
            var surgeryOnOff = true;
            var caseLastList = $(".al-adept-result-case");
            var surgeryLastList = $(".al-adept-result-surgery");
            if ((caseLastList.length !== caseList.length) && (caseLastList.length !== 0)) {
                caseOnOff = false;
            }
            if ((surgeryLastList.length !== surgeryList.length) && (surgeryLastList !== 0)) {
                surgeryOnOff = false;
            }
            surgeryList.each(function (i) {
                if (i === 0) {
                    surgeryStr += "<span class='al-adept-result-item al-adept-result-surgery' data-surgeryid='"+$(this).attr("data-resultSurgeryId")+"'>" + $(this).text() + "</span>";
                } else {
                    surgeryStr += "<i>，</i><span class='al-adept-result-item al-adept-result-surgery' data-surgeryid='"+$(this).attr("data-resultSurgeryId")+"'>" + $(this).text() + "</span>";
                }
                operationIdList += $(this).attr("data-resultSurgeryId") + ",";
                operationName += $(this).text() + ",";

            });
            caseList.each(function () {
                if ($(this).next().hasClass("al-dot")) {
                }
                var id = $(this).attr("data-resultcaseid");
                if ($('[data-caseid="' + id + '"]').length === 0) {
                    caseOnOff = false;
                }
            });
            surgeryList.each(function () {
                if ($(this).next().hasClass("al-dot")) {
                }
                var id = $(this).attr("data-resultsurgeryid");
                if ($('[data-surgeryid="' + id + '"]').length === 0) {
                    surgeryOnOff = false;
                }
            });
            if (caseStr.length > 0) {
                var goodAtCase =  $(".ev-good-at-case");
                goodAtCase.html(caseStr);
                base.fieldTypeOverflow()
            }
            if (surgeryStr.length > 0) {
                var goodAtSur = $(".ev-good-at-surgery");
                goodAtSur.html(surgeryStr);
                base.fieldTypeOverflow()
            }
            var value = clinicalYearObj.attr("data-resultTime");
            var param = {
                "customerId": obj.cid,
                visitSiteId: 1,
                illnessIdList: subDot(illnessIdList),
                specialtyList: JSON.stringify(surgery.statisticsSurgery().postSelected),//用于统计手术传给后台的数据
                delSpecialtyIdList: subDot(surgery.statisticsSurgery().delSpecialtyIdList),//删除
                illnessNameList: subDot(illnessNameList),
                clinicalYear: value,
                expertise:fieldTypeNewResult.val(),
                department:departmentNewResult.val(),
                yesteryearOperationNum:yesteryearNumNewResult.val(),
                precedingyearOperationNum:precedingNumNewResult.val()
            };
            function callBack() {
                comm.ajax.request({
                    "port": "/call/customer/auth/getCustomerAuth/",
                    postData: {
                        customerId: obj.cid

                    },
                    success: function (req) {
                        surgery.userSurgeryList = JSON.parse(JSON.stringify(req.responseObject.responseData.data_list.operationList));
                        surgery.requestSurgery();
                    }
                })
            }
            function checkMixInfo(){
                var onoff = true;
                if (departmentLastResult.text()!=departmentNewResult.val()){
                    onoff = false
                }
                if (fieldTypeLastResult.text()!=fieldTypeNewResult.val()){
                    onoff = false
                }
                if (yesteryearNumLastResult.text()!=yesteryearNumNewResult.val()){
                    onoff = false
                }
                if (precedingNumLastResult.text()!=precedingNumNewResult.val()){
                    onoff = false
                }
                return onoff
            }
            var mixOnOff = checkMixInfo();
            var flag=false;
            var yesterYearObj = $('#yesteryearOperationNumInput');
            var preceYearObj = $('#precedingyearOperationNumInput');
            if (caseOnOff && surgeryOnOff && yearOnOff && mixOnOff) {
                $('#base_authEdit').hide();
                $('#base_show').show();
                $('#base_edit_btn').show()
                return false;
            } else {
                // var options = {
                //     port: "/call/customer/auth/updateBaseinfo/",
                //     postData: param,//上传参数，json形式即可
                //     success: callBack//成功的回调
                // };
                comm.ajax.async("/call/customer/auth/updateBaseinfo/",{"paramJson": $.toJSON(param)},callBack);
                cancelObj.trigger("click");
            }
        },
        /*手术病例数*/
        boneCaseNum:function (type) {
            var d = new Date(),
                nowYear = +d.getFullYear();
            if(!type){
                yesteryearNumNewResult = $("#uncertifiedYesteryear");
                precedingNumNewResult = $("#uncertifiedPrecedingyear");
            }
            $('.boneCaseNumEdit .yesteryear').text(nowYear-1+'年');
            $('.boneCaseNumEdit .precedingyear').text(nowYear-2+'年');
            yesteryearNumLastResult.text(yesteryearNumNewResult.val());
            precedingNumLastResult.text(precedingNumNewResult.val())

        },
        /*科室初始化*/
        departmentText:function () {
            departmentLastResult.text(departmentNewResult.val())
        },
        /*擅长领域*/
        fieldTypeText:function () {
            // if(authOnOff) {
                fieldTypeLastResult.text(fieldTypeNewResult.val())
            // }else{
            //     fieldTypeNewResult = $('#uncertifiedFieldType'),
            //         fieldTypeLastResult.text(fieldTypeNewResult.val())
            // }

        },
        
        /*擅长领域超出隐藏*/
        fieldTypeOverflow:function () {
            var fieldTypeCont = $('.ev-fieldTypeCont'),
                fieldTypeMore = $('.ev-fieldTypeMore'),
                fieldTypeContH = fieldTypeCont.height();
            if (fieldTypeContH > 100){
                fieldTypeMore.show();
                fieldTypeCont.height('90px');
                $('.ev-pointer').css('display','inline-block');
            }
            var moreOnOff = true;
            fieldTypeMore.on('click',function () {
                if(moreOnOff){
                    moreOnOff = false;
                    fieldTypeMore.text('收起');
                    fieldTypeCont.height('auto');
                    $('.ev-pointer').hide()
                }else{
                    moreOnOff = true;
                    fieldTypeMore.text('更多');
                    fieldTypeCont.height('90px');
                    $('.ev-pointer').css('display','inline-block');
                }
            })
        },

        /*科室的倒计数和宽高自适应*/
        departmentAutoHeight:function () {
            base.textareaAutoH(departmentNewResult)
            base.InvertedNum(departmentNewResult,$('.ev-departmentInvertedNum'))
        },

        /*textarea的自适应宽高*/
        textareaAutoH:function(obj){
            obj.textareaAutoHeight({minHeight: 25, maxHeight: 460})
        },

        /*倒计数方法*/
        InvertedNum:function (obj,num) {
            comm.textChangeNew({
                $tex: obj,//输入框
                $num: num,//存放数字的元素
                inputIng: function () {
                    num.show();
                },//输入中回调函数
                inputFinish: function () {
                    num.hide();
                },//输入完成回调函数
                inputSurpass: function () {
                }//输入超出回调函数
            });
        },

        /*信息为空显示*/
        textNull:function (obj) {
            if(obj.html()==''){
                obj.html('--')
            }
        },

        /*基本信息为空*/
        informationNone:function () {
            var d = new Date(),
                nowYear = +d.getFullYear()
            $('.boneCaseNum .yesteryear').text(nowYear-1+'年')
            $('.boneCaseNum .precedingyear').text(nowYear-2+'年')

            if(yesteryearNumLastResult.html()==''){
                $('.boneCaseNum i').hide()
            }
            base.textNull(departmentLastResult)//科室
            base.textNull(fieldTypeLastResult)//擅长领域
            base.textNull(yesteryearNumLastResult)//去年的手术数为空
            base.textNull(precedingNumLastResult)//去年的手术数为空
        },

        //认证用户保存
        bindAuthSave: function (auth) {
            var t = this;
            $("#base_authSave").off("click").on("click", function () {
                if(departmentNewResult.val() ==''||fieldTypeNewResult.val()==''||yesteryearNumNewResult.val()==''||precedingNumNewResult.val()==''||$('.al-adept-case-name').length<=0||$('.al-adept-surgery-name').length<=0){
                    return false
                }
                dataG(yesteryearNumLastResult);
                dataG(precedingNumLastResult);
                function dataG(num) {
                    if(num.text()=='--'){
                        $('.boneCaseNum i').hide()
                    }else {
                        $('.boneCaseNum i').show()
                    }
                }

                t.saveBaseInfo();
                base.boneCaseNum(true)
                base.departmentText()
                base.fieldTypeText()

            });
        },
        /*个人信息为空显示 -- */
        editNullInfo:function(str){
            if(str!=="--"){
                return str;
            }else{
                return '';
            }
        },
        //非认证用户编辑
        // bindEdit: function () {
        //     var t = this;
        //     $("#base_edit_btn").on("click", function () {
        //         $(this).hide();
        //         ymd({
        //             year: $("#clinicalYear-no"),
        //             month: $("#clinicalMonth-no"),
        //             default1: 1
        //         });
        //         var yearStr = auth.clinicalYear.split("-");
        //         $("#clinicalYear-no").find("option[value='"+yearStr[0]+"']").attr("selected",true);
        //         $("#clinicalMonth-no").find("option[value='"+yearStr[1]+"']").attr("selected",true);
        //         $("#uncertifiedDepartmentInput").val(base.editNullInfo(departmentLastResult.text()))
        //         $("#uncertifiedFieldType").val(base.editNullInfo(fieldTypeLastResult.text()))
        //         $("#uncertifiedYesteryear").val(base.editNullInfo(yesteryearNumLastResult.text()))
        //         $("#uncertifiedPrecedingyear").val(base.editNullInfo(precedingNumLastResult.text()))
        //         $("#base_show").hide();
        //         $("#base_edit").show();
        //         $.ajax({
        //             type: "post",
        //             url: path.initCore,
        //             data: {paramJson: $.toJSON({"customerId": obj.cid, "logoUseFlag": UseFlag.d})},
        //             dataType: "json",
        //             success: function (rep) {
        //                 //    改版后代码开始
        //                 var caseData = [];
        //                 var surgeryData = [];
        //                 $(".al-adept-result-case").each(function () {
        //                     var dataJson = {
        //                         "relatedName": $(this).text(),
        //                         relatedId: $(this).attr("data-caseId")
        //                     };
        //                     caseData.push(dataJson);
        //                 });
        //                 $(".al-adept-result-surgery").each(function () {
        //                     var dataJson = {
        //                         "relatedName": $(this).text(),
        //                         relatedId: $(this).attr("data-surgeryId")
        //                     };
        //                     surgeryData.push(dataJson);
        //                 });
        //                 t.bindSave(auth.state);
        //                 t.adeptCase(false, 0, caseData);
        //                 t.adeptSurgery();
        //                 var cliYear = rep.responseObject.responseData.data_list[0].customer_auth.clinicalYear;
        //                 var yearStr = cliYear?cliYear.split("-"):[];
        //                 $("#clinicalYear-no").find("option[value='"+yearStr[0]+"']").attr("selected",true);
        //                 $("#clinicalMonth-no").find("option[value='"+yearStr[1]+"']").attr("selected",true);
        //                 //    改版后代码结束
        //
        //             },
        //             error: function () {
        //             }
        //         });
        //         base.departmentAutoHeight()
        //     });
        // },
        //取消
        // bindCancel: function () {
        //     var t = this;
        //     $("#base_cancel").on("click", function () {
        //         t.clearData();
        //         //事件埋点
        //         comm.creatEvent({
        //             triggerType: "全站功能按钮点击",
        //             keyword: "基本信息修改取消",
        //             browType: 102,
        //             actionId: 45
        //         });
        //     });
        // },
        //清空数据
        clearData: function () {
            $("#base_show").show();
            $("#base_edit").hide();
            $("#base_edit_btn").show();
            $(".ev-sexId i").removeClass("al-tableRadioOn");
            $(".ev-sexId i").eq(0).addClass("al-tableRadioOn");
            $("#med_title").empty();
            $("#company").val("");
            $("#area_sed").empty();
            $("#company").parent().removeClass("error");
            $("#company_error").hide();
        },
        // bindSave: function (state) {
        //     var t = this;
        //     $("#base_save").on("click", function () {
        //         $('#base_edit').hide()
        //         t.saveBaseInfo(false);
        //         base.boneCaseNum(false)
        //         base.departmentText()
        //         base.fieldTypeText()
        //         base.informationNone()
        //         /*个人信息编辑保存，改版前代码
        //          var data = {};
        //          data.opflag=1;
        //          //data.resumeType = languageFlag;
        //          data.fullName = $("#fullName").val();
        //          $(".ev-sexId i").each(function (i, em) {
        //          if ($(em).hasClass("al-tableRadioOn")) {
        //          data.sexId = $(em).parent().attr("sexId");
        //          }
        //          });
        //          if ($("#year option:selected").val() != "0" && $("#month option:selected").val() != "0" && $("#day option:selected").val() != "0") {
        //          data.birthday = $("#year option:selected").val() + '-' + $("#month option:selected").val() + '-' + $("#day option:selected").val();
        //          } else {
        //          data.birthday = "";
        //          }
        //          if ($("#clinicalYear option:selected").val() != "0" && $("#clinicalMonth option:selected").val() != "0"){
        //          data.clinicalYear = $("#clinicalYear option:selected").val()+"-"+$("#clinicalMonth option:selected").val()+"-01";
        //          } else{
        //          data.clinicalYear = "";
        //          }
        //          data.platformId= t.departmentType;//科室
        //          data.medicalTitle = $("#med_title").attr("medicaltitle");
        //          if(t.unitType==1){//在医院
        //          data.company = $("#company").val();
        //          }else if(t.unitType==2){//在学校
        //          data.schoolName = $("#schoolName").val();
        //          }
        //          areasExpertise = '';
        //          $("#area_sed .tagName").each(function (i, em) {
        //          areasExpertise += $(em).attr("tagid") + "_" + $("span",$(em)).text() + ",";
        //          });
        //          data.areasExpertise = areasExpertise.substring(0, areasExpertise.length - 1);
        //          var isSuccess = 1;
        //          if (!data.medicalTitle) {
        //          $("#medical_par").addClass("error");
        //          $("#med_error").addClass("showIb");
        //          isSuccess = 0;
        //          } else {
        //          $("#medical_par").removeClass("error");
        //          $("#med_error").removeClass("showIb");
        //          };
        //          if(!t.unitType){
        //          $("#onUnit_error").addClass("showIb").html("<i></i>请填写单位！");
        //          isSuccess=0;
        //          }else{
        //          $("#onUnit_error").removeClass("showIb")
        //          }
        //
        //          if(!t.departmentType){
        //          $("#onDepartment_error").addClass("showIb").html("<i></i>请选择科室！");
        //          isSuccess=0;
        //          }else{
        //          $("#onDepartment_error").removeClass("showIb")
        //          }
        //
        //          if(t.unitType==1){//选择在医院
        //          if (!data.company) {
        //          $("#company").parent().addClass("error");
        //          $("#company_error").addClass("showIb").html("<i></i>请填写医院！");
        //          isSuccess = 0;
        //          } else if (comm.getByteLen(data.company) > 200) {
        //          $("#company").parent().addClass("error");
        //          $("#company_error").addClass("showIb").html("<i></i>最长100个中文或200个英文！");
        //          isSuccess = 0;
        //          } else {
        //          $("#company").parent().removeClass("error");
        //          $("#company_error").removeClass("showIb");
        //          }
        //          }
        //
        //          if(t.unitType==2){//选择在学校
        //          if (!data.schoolName) {
        //          $("#schoolName").parent().addClass("error");
        //          $("#company_error").addClass("showIb").html("<i></i>请填写学校！");
        //          isSuccess = 0;
        //          } else if (comm.getByteLen(data.schoolName) > 200) {
        //          $("#schoolName").parent().addClass("error");
        //          $("#company_error").addClass("showIb").html("<i></i>最长100个中文或200个英文！");
        //          isSuccess = 0;
        //          } else {
        //          $("#schoolName").parent().removeClass("error");
        //          $("#company_error").removeClass("showIb");
        //          }
        //          }
        //
        //          if (!data.areasExpertise) {
        //          $("#area_error").addClass("showIb");
        //          isSuccess = 0;
        //          } else {
        //          $("#area_error").removeClass("showIb");
        //          }
        //          ;
        //          if (isSuccess == 0) {
        //          return;
        //          }
        //          ;
        //          $("#base_edit").mask("");
        //          var param={};
        //          param.paramJson= $.toJSON(data);
        //          $.ajax({
        //          type: "post",
        //          url: path.saveAuth,
        //          data: param,
        //          dataType: "json",
        //          success: function (rep) {
        //          $("#base_edit").unmask("");
        //          if (rep.responseObject.responseStatus) {
        //          //获取资料百分比
        //          customerInforate();
        //          $("#base_edit_btn").show();
        //          $("#base_show").show();
        //          $("#base_edit").hide();
        //          $(".ev-trueName").text(data.fullName);
        //          obj.userName.text(data.fullName);
        //          if (data.sexId == "1") {
        //          $(".ev-sex").text("男");
        //          }
        //          if (data.sexId == "2") {
        //          $(".ev-sex").text("女");
        //          }
        //          if (data.platformId==1){
        //          $(".ev-department").text("骨科");
        //          }else if(data.platformId==2){
        //          $(".ev-department").text("手外科");
        //          }
        //          var local = new Date();
        //          var newcliYear=new Date(data.clinicalYear);
        //          var clinicalYear = Math.floor((local.getTime()-newcliYear.getTime())/(365*24*3600*1000));
        //          $(".ev-birth").text(data.birthday ? data.birthday : '');
        //          $(".ev-clinicalYear").text(clinicalYear+"年");
        //          $(".ev-medical").text($("#med_title").text());
        //          $(".ev-unit").text(t.unitType==1?data.company:data.schoolName);
        //          var areaHtml = "";
        //          $("#area_sed .tagName").each(function (i, em) {
        //          areaHtml += '<figure class="al-tableTagConfigItem tagName" tagid="'+$(em).attr("tagid")+'">'+$("span",$(em)).text()+'</figure>';
        //          });
        //          $(".ev-areas").html(areaHtml);
        //          if (state >= 0) {
        //          if (!data.birthday) {
        //          $(".ev-birth").parent().hide();
        //          } else {
        //          $(".ev-birth").parent().show();
        //          }
        //          if (!data.sexId) {
        //          $(".ev-sex").parent().hide();
        //          } else {
        //          $(".ev-sex").parent().show();
        //          }
        //          }
        //          $.topTip({mark: "success", content: "基本信息保存成功！"});
        //          }
        //          },
        //          error: function () {
        //          }
        //          });*/
        //     })
        // }

    };

    //通讯地址
    var contactAddress = {};
    contactAddress = {
        init: function () {

            $("#contactAddress_save").attr("on", "true");
            $("#contactAddress_hid").val(customerAddress && customerAddress.addressFull);
            $("#contactAddress_con").text($("#contactAddress_hid").val());
            $("#contactAddress_con").expandShrink({len: 210});
            comm.textChange({"$tex": $("#contactAddress"), "noTop": 1});
            msgNull($("#contactAddress_con"));
            this.edit();
            this.save();
            this.cancel();
        },
        edit: function () {//通讯地址
            //$("#summary").textareaAutoHeight({minHeight: 48, maxHeight: 460});
            $("#contactAddress_edit_btn").on("click", function () {
                $(this).hide();
                $("#contactAddress_edit").show();
                $("#contactAddress_show").hide();
                $("#contactAddress").val($("#contactAddress_hid").val());
            })
        },

        save: function () {
            $("#contactAddress_save").on("click", function () {
                contactAddress = $("#contactAddress").val();
                $(".ev-contactAddressTips").removeClass("showIb");
                if (!contactAddress) {
                    return;
                } else if (comm.getByteLen(contactAddress) > 200) {
                    $(".ev-contactAddressTips").addClass("showIb");
                    return;
                }
                if ($(this).attr("on") == "true") {
                    $(this).attr("on", "false");
                    $("#contactAddress_edit").mask("");
                    var url = "";
                    var data = {};
                    if (customerAddress && customerAddress.customerAId) {//更新
                        url = path.updateAddress;
                        data.visitSiteId = 1;
                        data.customerId = obj.cid;
                        data.addressFull = escapeReplace(contactAddress);
                        data.id = customerAddress.customerAId;
                    } else {
                        url = path.createAddress;
                        data.visitSiteId = 1;
                        data.customerId = obj.cid;
                        data.addressFull = escapeReplace(contactAddress);
                    }
                    var param = {};
                    param.paramJson = $.toJSON(data);
                    $.ajax({
                        url: url,
                        type: "POST",
                        dataType: "json",
                        data: param,
                        success: function (rep) {
                            $("#contactAddress_save").attr("on", "true");
                            if (rep.responseObject.responseStatus) {
                                if (rep.responseObject.responsePk) {
                                    customerAddress.customerAId = rep.responseObject.responsePk;
                                }
                                $('#contactAddress_con').parent('.al-tableItem').css('paddingTop','20px')
                                $('#contactAddress_con').show();
                                //获取资料百分比 TODO:这一项不记录信息完整度
                                //customerInforate();
                                $.topTip({mark: "success", content: "通讯地址保存成功！"});
                                $("#contactAddress_edit").unmask("");

                                $("#contactAddress_edit_btn").show();
                                $("#contactAddress_edit").hide();
                                $("#contactAddress_show").show();
                                $("#contactAddress_hid").val(contactAddress);
                                $("#contactAddress_con").text(contactAddress);
                                $("#contactAddress_con").expandShrink({len: 210});
                            }
                        }
                    });
                }
            });
        },
        cancel: function () {
            $("#contactAddress_cancel").on("click", function () {
                $("#contactAddress_edit_btn").show();
                $("#contactAddress_edit").hide();
                $("#contactAddress_show").show();
                //事件埋点
                comm.creatEvent({
                    triggerType: "全站功能按钮点击",
                    keyword: "通讯地址修改取消",
                    browType: 8,
                    actionId: 45
                });
            });
        }
    };
    //简介编辑
    var summary = {};
    summary = {
        init: function () {
            $("#summary_save").attr("on", "true");
            $("#summary_hid").val(baseInfo.summary);
            $("#summary_count").text($("#summary_hid").val());
            $("#summary_count").expandShrink({
                len: 210
            });
            comm.textChange({"$tex": $("#summary"), "noTop": 1});
            msgNull($("#summary_count"));
            this.edit();
            this.save();
            this.cancel();
        },
        edit: function () {
            //$("#summary").textareaAutoHeight({minHeight: 48, maxHeight: 460});
            $("#summary_edit_btn").on("click", function () {
                $(this).hide();
                $("#summary_edit").show();
                $("#summary_show").hide();
                $("#summary").val($("#summary_hid").val());
            })
        },
        save: function () {
            $("#summary_save").on("click", function () {
                summary = $("#summary").val();
                if (!summary) {
                    return;
                }
                if ($(this).attr("on") == "true") {
                    $(this).attr("on", "false");
                    $("#summary_edit").mask("");
                    $.ajax({
                        url: path.summary,
                        type: "POST",
                        dataType: "json",
                        data: {"summary": summary, resumeType: languageFlag},
                        success: function (rep) {
                            $("#summary_save").attr("on", "true");
                            if (rep.rows.responseStatus) {
                                $('#summary_count').parent('.al-tableItem').css('paddingTop','20px')
                                $('#summary_count').show();
                                //获取资料百分比
                                //customerInforate();
                                $.topTip({mark: "success", content: "简介保存成功！"});
                                $("#summary_edit").unmask("");

                                $("#summary_edit_btn").show();
                                $("#summary_edit").hide();
                                $("#summary_show").show();
                                $("#summary_hid").val(summary);
                                $("#summary_count").text(summary);
                                $("#summary_count").expandShrink({len: 210});
                            }
                        }
                    });
                }
            });
        },
        cancel: function () {
            $("#summary_cancel").on("click", function () {
                $("#summary_edit_btn").show();
                $("#summary_edit").hide();
                $("#summary_show").show();
                //事件埋点
                comm.creatEvent({
                    triggerType: "全站功能按钮点击",
                    keyword: "个人简介修改取消",
                    browType: 102,
                    actionId: 45
                });
            });
        }
    };
    //认证信息
    var authAttachment = {};
    authAttachment = {
        init: function () {
            this.attPath = "";
            this.bindAuthAttachment();
        },
        bindAuthAttachment: function () {
            var t = this;
            var param = {roleId: 6, typeId: 1};
            $.ajax({
                type: 'POST',
                url: path.getDataRoleConfigs,
                data: {paramJson: $.toJSON(param)},
                async: false,
                dataType: "json",
                timeout: 10000,
                success: function callback(rep) {
                    var html = "";
                    if (rep && rep.responseObject && rep.responseObject.responseStatus) {
                        var lastData = rep.responseObject.responseMessage;
                        var data = [];
                        var idJson = null;
                        $.each(lastData,function(i,v){
                            if(v.refId!==1){
                                data.push(v);
                            }else{
                                idJson = v;
                            }
                        });
                        data.push(idJson);
                        // console.log(data);
                        var imgDemoList = [
                            {
                                editOnOff:true,
                                refValue: "医师执业证",
                                "refId": "8",
                                "ImgList": ["//img10.allinmd.cn/authentication/certificate/pic_zhiye1.png", "//img10.allinmd.cn/authentication/certificate/pic_zhiye2.png"],
                                startOnOff: true
                            },
                            {
                                editOnOff:true,
                                refValue: "医师资格证",
                                "refId": "6",
                                "ImgList": ["//img10.allinmd.cn/authentication/certificate/pic_zige1.png", "//img10.allinmd.cn/authentication/certificate/pic_zige2.png"],
                                startOnOff: true
                            },
                            {
                                editOnOff:true,
                                refValue: "医师职称证书",
                                "refId": "13", "ImgList": ["//img10.allinmd.cn/authentication/certificate/pic_zhicheng.png"],
                                startOnOff: true
                            },
                            {
                                refValue: "工作证(学生证)",
                                "refId": "10",
                                "ImgList": ["//img10.allinmd.cn/authentication/certificate/pic_id1.png"],
                                startOnOff: false
                            },
                            {
                                "refId": "7",
                                "ImgList": ["//img10.allinmd.cn/authentication/certificate/pic_xuewei.png"],
                                refValue: "医学学位证"
                            },
                            {
                                refValue: "医学学历证",
                                "refId": "9",
                                "ImgList": ["//img10.allinmd.cn/authentication/certificate/pic_xueli.png"],
                                startOnOff: false
                            },
                            {
                                editOnOff:true,
                                refValue: "身份证",
                                "refId": "1",
                                "ImgList": ["//img10.allinmd.cn/authentication/certificate/pic_id1.png", "//img10.allinmd.cn/authentication/certificate/pic_id2.png"],
                                startOnOff: true
                            }];
                        if (data && data.length > 1) {
                            $.each(data, function (i, val) {
                                var demoList = [];
                                var startOnOff = false;
                                // var editOnOff = false;
                                $.each(imgDemoList,function(si,sv){
                                    if(parseInt(sv.refId)===parseInt(val.refId)){
                                        demoList = sv.ImgList;
                                        startOnOff = sv.startOnOff;

                                    }
                                });
                                // console.log()
                                var startStr = "";
                                if(startOnOff){
                                    startStr = '<i data-star-sign="false"></i>';
                                }
                                var imgDemoStr = demoList;
                                if(val.refId===10){
                                    if(parseInt(auth.authMedicalId)===10){
                                        val.refValue = "学生证";
                                        imgDemoStr = ["/images/img10/authentication/certificate/pic_student.png"];
                                        val.refId = 12;
                                    }else{
                                        val.refValue = "工作证";
                                        imgDemoStr = ["/images/img10/authentication/certificate/pic_work.png"];
                                        val.refId = 11;
                                    }
                                }
                                html += '<li class="al-certificate-item" data-auth-atttype="'+val.refId+'" data-auth-demo="'+imgDemoStr+'">'+
                                    '<div class="al-certificate-header-bar">'+
                                    '	<div class="al-certificate-title">'+val.refValue+startStr+
                                    '	</div>'+
                                    '	<div class="al-certificate-number hide">'+
                                    '	</div>'+
                                    '	<div class="al-certificate-error hide">'+
                                    '		<i></i>证件未通过审核，请重新上传'+
                                    '	</div>'+
                                    '	<div class="al-certificate-operate">'+
                                    '		<span class="al-certificate-amend hide">修改</span>'+
                                    '		<span class="al-certificate-upload">上传</span>'+
                                    '	</div>'+
                                    '</div>'+
                                    '</li>'
                            });
                        }

                    }

                    /*var dataList = [];
                    $(".al-certificate-item").each(function(){
                       var dataJson = {
                           refId:$(this).attr("data-auth-atttype"),
                           ImgList:JSON.parse($(this).attr("data-auth-demo"))
                       }
                       dataList.push(dataJson);
                    });
                    $(".al-auth-certificate").html(JSON.stringify(dataList))*/
                    $(".al-certificate-list").html(html);
                    param.pageIndex = 1;
                    param.pageSize = 20;
                    $.ajax({
                        type: 'POST',
                        url: path.getAuthAttachments,
                        data: {paramJson: $.toJSON(param)},
                        dataType: "json",
                        timeout: 10000,
                        success: function callback(rep) {
                            var html = "";
                            if (rep && rep.responseObject && rep.responseObject.responseStatus) {
                                var data = rep.responseObject.responseMessage;
                                if (data && data.length > 0) {
                                    var newData =[];
                                    var flag = false;
                                    $.each(data,function(ni,nel){
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
                                    // console.log(newData)
                                    t.exhibitionCertificate(newData)

                                }
                            }
                            if(para.auth){
                                $(".ev-leftNav figure").eq(1).click();
                                setTimeout(function(){
                                    $(document).scrollTop($(".al-attType-save").offset().top-62);
                                },1000);
                            }
                            t.bindEdit();
                        }
                    });
                }
            });

        },
        exhibitionCertificate: function (data) {
            var t = this;

            function JsonSort(json, key) {
                for (var j = 1, jl = json.length; j < jl; j++) {
                    var temp = json[j],
                        val = temp[key],
                        i = j - 1;
                    while (i >= 0 && json[i][key] > val) {
                        json[i + 1] = json[i];
                        i = i - 1;
                    }
                    json[i + 1] = temp;

                }
                return json;
            }

            var templateImg = function (imgData) {
                //console.log(imgData)
                var demoObj = '<div class="al-certificate-img"></div>';
                var demoContainer = $(demoObj);
                var str = "";
                $.each(imgData, function (i, v) {
                    str += '<div class="al-certificate-img-item" data-id="' + v.id + '">' +
                        '	<img src="' + v.attPath + '" alt="">' +
                        '</div>';
                });
                demoContainer.append(str);
                return demoContainer;
            };
            var imgArr = {};
            var hasOnOff = false;//代表数据里是否有学生证或者工作证的新数据
            $.each(data,function(i,v){
                if((parseInt(v.attType)===11)||(parseInt(v.attType)===12)){
                    hasOnOff = true;
                }
            });
            //console.log(data)
            for(var dataNum = 0;dataNum<data.length;dataNum++){
                var i = dataNum;
                var v = data[dataNum];
                var timestamp = 0;
                if(v.createTime){
                    var date = v.createTime;
                    date = date.substring(0,19);
                    date = date.replace(/-/g,"/");
                    timestamp = new Date(date).getTime();
                }

                if(parseInt(v.attType)===10){
                    if(hasOnOff){
                        continue;
                    }else{
                        if(parseInt(auth.authMedicalId)===10){
                            v.attType=12;
                        }else{
                            v.attType=11;
                        }
                    }
                }
                var imgObj = $("[data-auth-attType=" + v.attType + "]");
                if (imgArr["" + v.attType]) {
                    $.each(imgArr["" + v.attType], function (inIndex, inVal) {
                        var existOnOff = inVal["" + v.attPositionType] ? true : false;
                        if (!existOnOff) {
                            var firstJson = {
                                "attPath": v.attPath.lastIndexOf("allinmd.cn")>-1?v.attPath:"//img05.allinmd.cn/"+v.attPath,
                                "attPositionType": v.attPositionType,
                                "id":(v.id)?v.id:"",
                                attCode:v.attCode,
                                createTime:timestamp
                            };
                            imgArr["" + v.attType].push(firstJson);
                        }
                    });
                } else {
                    imgArr["" + v.attType] = [];
                    var firstJson = {
                        "attPath": v.attPath.lastIndexOf("allinmd.cn")>-1?v.attPath:"//img05.allinmd.cn/"+v.attPath,
                        "attPositionType": v.attPositionType,
                        "id":(v.id)?v.id:"",
                        attCode:v.attCode,
                        createTime:timestamp
                    };
                    imgArr["" + v.attType].push(firstJson);
                }
                //显示上传按钮
                //展示证件号数据
                if (v.attCode) {
                    imgObj.find(".al-certificate-number").html(v.attCode).removeClass("hide");
                } else {
                    if(imgObj.find(".al-certificate-number").text().length===0){
                        imgObj.find(".al-certificate-number").html("").addClass("hide");
                    }
                }
            }
            function uniqueImgList(arr) {
                var res = [];
                var json = {};
                for(var i = 0; i < arr.length; i++){
                    var imgName = arr[i]["attPath"].split("/");
                    var fullName = imgName[imgName.length-1];
                    var nameStr = fullName.split(".");

                    if(json[nameStr[0]+arr[i]["attPositionType"]]){
                        continue;
                    }else{
                        json[nameStr[0]] = true;
                        res.push(arr[i]);
                    }
                }
                return res;
            }
            function uniqueImg(arr){
                //var jsonData = [];
                var dealArr = JSON.parse(JSON.stringify(arr));
                var dataJson = {};
                $.each(dealArr,function(i,v){
                    if(dataJson[v.attPositionType]){
                        dataJson[v.attPositionType].push(v);
                    }else{
                        dataJson[v.attPositionType] = [];
                        dataJson[v.attPositionType].push(v);
                    }
                });
                var lastArr = [];
                $.each(dataJson,function(i,v){
                    if(v.length===1){
                        lastArr.push(v[0]);
                    }else{
                        /*获取最近的数据*/
                        var rearlyData = null;
                        var creatTime = 0;
                        $.each(v,function(si,sv){
                            if(parseInt(sv.createTime)>=creatTime){
                                creatTime = parseInt(sv.createTime);
                                rearlyData = sv;
                            }
                        });
                        lastArr.push(rearlyData);
                    }
                });
                return lastArr;

            }
            var uniqueImgArr = {};
            $.each(imgArr,function(i,v){
                var newArr = JSON.parse(JSON.stringify(uniqueImgList(v)));
                uniqueImgArr[i] = newArr;
            });
            // console.log(uniqueImgArr)
            $.each(uniqueImgArr, function (i, v) {
                var imgObj = $("[data-auth-attType=" + i + "]");
                var imgListData = JsonSort(uniqueImgArr["" + i], "attPositionType");
                //展示图片数据
                if (imgListData) {
                    if (imgObj.find(".al-certificate-img").length === 0) {
                        imgObj.find(".al-certificate-header-bar").after(templateImg(uniqueImg(imgListData)));
                        imgObj.attr({"class": "al-certificate-item al-certificate-ready"});
                    }
                }
            });
            $(".al-certificate-item").each(function () {
                var imgObj = $(this);
                var demoLength = $(this).attr("data-auth-demo").split(",").length;
                if (imgObj.find(".al-certificate-img").length === 1 && imgObj.find(".al-certificate-img-item").length >= demoLength) {
                    if (imgObj.find(".al-certificate-error").hasClass("hide")) {
                        imgObj.find(".al-certificate-operate").addClass("hide").find(".al-certificate-upload").remove();
                    } else {
                        imgObj.find(".al-certificate-operate").addClass("hide").find(".al-certificate-amend").remove();
                    }
                    $(this).find("[data-star-sign]").attr({'data-star-sign': true});

                } else {

                    if (imgObj.find(".al-certificate-error").hasClass("hide")) {
                        if(auth.state!==7){
                            imgObj.find(".al-certificate-operate").removeClass("hide").find(".al-certificate-upload").removeClass("hide");
                        }
                    } else {
                        imgObj.find(".al-certificate-operate").removeClass("hide").find(".al-certificate-amend").removeClass("hide");
                    }
                    $(this).find("[data-star-sign]").attr({'data-star-sign': false});
                }
            });
            var imgCerNum = 4 - $("[data-star-sign='true']").length;
            //console.log(imgCerNum)
            if (imgCerNum) {
                $(".al-auth-certificate-num").html(imgCerNum);
            } else {
                $(".al-auth-reminder").addClass("hide");
                var startDes = "";
                var reminderObj = $(".al-auth-certificate-reminder");
                switch (auth.state) {
                    case 8:
                        startDes = "您已认证成为唯医执业医师";
                        reminderObj.css({"marginLeft": 395});
                        break;
                    case 9:
                        startDes = "V2认证未通过审核,请重新认证";
                        reminderObj.css({"marginLeft": 374});
                        break;
                    default:
                        reminderObj.css({"marginLeft": 335});
                        startDes = "您已上传完所有标星证件,请等待审核";
                        break;
                }

                reminderObj.find("span").html(startDes);

            }
            //展示v2认证规则
            $(".al-auth-certificate-help").off("click").on("click", function () {
                $(".al-auth-grade").show();
                $(".al-auth-grade-close").off("click").on("click", function () {
                    $(".al-auth-grade").hide();
                });
            });
            if(auth.state===2){
                if(localStorage.getItem("isFirstAuthHelp")){
                    // return false;
                }else{
                    $(".al-auth-certificate-help").trigger("click");
                    $(".al-auth-grade-close").off("click").on("click", function () {
                        $(".al-auth-grade").hide();
                    });
                    localStorage.setItem("isFirstAuthHelp","true");
                }
            }
            $(".al-auth-grade-close").off("click").on("click", function () {
                $(".al-auth-grade").hide();
            });
            if (localStorage.getItem("userInfoTrigger")) {
                localStorage.removeItem("userInfoTrigger");
                $(".al-auth-reminder").trigger("click");
            }
        },
        templateCertificate: function (container, demoData, cancelData) {
            /*"certificateDes":certificateDes,
             "certificateNumOnOff":imgObj.find(".al-certificate-number").length===1,
             "certificateType":imgObj.attr("data-auth-attType"),
             "certificateId":certificateId,
             "imgInfoList":imgInfoList*/
            var t = this;
            var postImgIdNum = 0;

            var demoStr = '<div class="al-certificate-img-post">	' +
                '</div>';
            var postObj = $(demoStr);
            var resultStr = "";
            //container.find(".al-certificate-img").remove();
            $.each(demoData.imgInfoList, function (i, v) {
                if (i % 2 === 0) {
                    resultStr += '<div class="al-certificate-post-item al-certificate-post-example">' +
                        '	<img src="' + v.picSrc + '" alt="' + v.picTitle + '">' +
                        '	<span class="al-certificate-post-title">' + v.picTitle + '</span>' +
                        '</div>';
                } else {
                    var failedStr = "";
                    var stateClass = "";
                    var picPostOnOff = false;
                    if (v.picSrc) {
                        picPostOnOff = v.picSrc.length > 0;
                    }
                    // console.log(picPostOnOff)
                    if (v.failed) {
                        picPostOnOff = false;
                        stateClass = "al-certificate-post-failed";
                        failedStr = '	<div class="al-certificate-failed">' +
                            '		<i class="al-certificate-close"></i>' +
                            '		<p class="al-certificate-failed-info al-certificate-info">' +
                            '			上传失败' +
                            '		</p>' +
                            '		<p class="al-certificate-failed-info">' +
                            '			请重新上传' +
                            '		</p>' +
                            '	</div>';
                    }
                    var resultImgStr = "";
                    if (v.picSrc) {
                        stateClass = "al-certificate-post-over";
                        resultImgStr = '	<div class="al-certificate-result">' +
                            '		<img src="' + v.picSrc + '" alt="' + v.picTitle + '">' +
                            '	</div>';
                    }
                    var idName = "al-certificate-post" + postImgIdNum;
                    postImgIdNum++;
                    resultStr += '<div class="al-certificate-post-item ' + stateClass + '">' +
                        '	<div class="al-certificate-post" id="' + idName + '" data-auth-positionType="' + v.positionType + '" >' +
                        '		<i></i>' +
                        '		<input type="file" accept="image/*" class="al-certificate-formImg" data-post-onOff="' + picPostOnOff + '">' +
                        '	</div>' +
                        resultImgStr +
                        failedStr +
                        '</div>';
                }
            });
            resultStr += '<div class="al-certificate-edit-bar">' +
                '<div class="al-certificate-edit-des">' +
                '	<p>' +
                '		证件上传后不可修改' +
                '	</p>' +
                '</div>' +
                '	<div class="al-certificate-edit-button">' +
                '		<button class="al-certificate-edit-cancel">取消</button>' +
                '		<button class="al-certificate-edit-ensure">确认</button>' +
                '	</div>' +
                '</div>' +
                '<div class="al-certificate-edit-sharp">' +
                '</div>';
            var lastStr = "";
            if (demoData.certificateNumOnOff) {
                var postOnOff = demoData.certificateId.length > 0;
                lastStr = '<div class="al-certificate-post-number">' +
                    '	<span class="al-certificate-number-title">证件编号</span>' +
                    '	<input type="text" placeholder="请输入证件编号" class="al-certificate-number-input" value="' + demoData.certificateId + '" data-post-onOff="' + postOnOff + '">' +
                    '</div>' + resultStr;
            } else {
                lastStr = resultStr;
            }
            postObj.html(lastStr);

            postObj.find(".al-certificate-edit-cancel").off("click").on("click", function () {
                $.makeSurePopup({
                    title: "放弃编辑",//弹窗标题
                    content01: "确定放弃当前编辑的内容吗？",//弹窗内容字体会加粗 (可不传)
                    content: "",//弹窗内容
                    url: "",//ajax请求接口（可不传，不传就不发请求）
                    param: "",//ajax请求参数(可不传)
                    toJSON: 1,//传参是否为paramJSPN 0或1，默认为1
                    callback: function () {
                        comm.LightBox.hideloading();
                        t.leaveUploadPost(cancelData);
                    },//点击确认后执行的方法（有发送请求时，是请求成功后执行的方法)
                    error: function () {
                    }//ajax请求失败后执行的方法(可不传)
                });
            });
            postObj.find(".al-certificate-number-input").off("input propertychange").on("input propertychange", function () {
                //保存此时操作的证件类型
                var isThis = $(this);
                $(".al-attType-save").attr({'data-nowAttType': demoData.certificateType});
                var strVal = isThis.val();
                if (parseInt(demoData.certificateType, 10) === 1) {
                    if(strVal.length<17){
                        if (!/^[0-9]*$/.test(strVal)){

                            isThis.attr({"data-post-onOff": false});
                        }else{
                            if(strVal.length===15){
                                isThis.attr({"data-post-onOff": true});
                            }else{
                                isThis.attr({"data-post-onOff": false});
                            }

                        }
                    }else{
                        if(strVal.length>18){
                            isThis.val(strVal.substring(0, strVal.length - 1));
                        }
                        var newStr = isThis.val();
                        if ((/(^\d{17}([0-9]|X|x)$)/.test(newStr))) {
                            isThis.attr({"data-post-onOff": true});
                        } else {
                            isThis.attr({"data-post-onOff": false});
                        }


                    }

                } else {
                    var nowVal = isThis.val();
                    var newStr = nowVal.replace(/[^0-9a-zA-Z]/g,'')
                    isThis.val(newStr);
                    if(newStr.length>50){
                        isThis.val(newStr.substr(0,50));
                    }
                    strVal = isThis.val();
                    if (strVal.length > 0) {
                        isThis.attr({"data-post-onOff": true});
                    } else {
                        isThis.attr({"data-post-onOff": false});
                    }
                }
                t.lightUploadPost();
            });
            t.lightUploadPost();

            return postObj;
        },
        leaveUploadPost: function (leaveData) {
            // console.log(leaveData)
            var t = this;
            var nowAttrType = $('[data-nowAttType]').attr("data-nowAttType");
            var container = $("[data-auth-attType=" + nowAttrType + "]");
            if (leaveData) {
                if (leaveData.length > 0) {
                    container.attr({"class": "al-certificate-item al-certificate-ready"});
                } else {
                    container.attr({"class": "al-certificate-item al-certificate-nothing"});
                }
            } else {
                container.attr({"class": "al-certificate-item al-certificate-nothing"});
            }
            container.find(".al-certificate-img-post").remove();
        },
        lightUploadPost: function () {
            var t = this;
            var postOnOff = true;
            var nowAttrType = $('[data-nowAttType]').attr("data-nowAttType");
            var imgContainer = $("[data-auth-attType=" + nowAttrType + "]");
            var postObj = $("[data-auth-atttype='" + nowAttrType + "']").find(".al-certificate-img-post");
            postObj.find("[data-post-onOff]").each(function () {
                if (!JSON.parse($(this).attr("data-post-onOff"))) {
                    postOnOff = false;
                }
            });
            if (postOnOff) {
                postObj.find(".al-certificate-edit-ensure").addClass("active");
            } else {
                postObj.find(".al-certificate-edit-ensure").removeClass("active");
            }

            postObj.find(".al-certificate-edit-ensure").off("click").on("click", function () {
                if (postObj.find(".al-certificate-number-input").length > 0) {
                    if (postObj.find(".al-certificate-number-input").val().length === 0) {
                        $.errorPopup({"text": imgContainer.find(".al-certificate-title").text() + "编号未填写，请填写后再保存"});
                    }
                }
                if ($(this).hasClass("active")) {
                    var imgListData = [];
                    var param = null;

                    function sunDot(str) {
                        var returnStr = "";
                        returnStr = str.substring(0, str.length - 1);
                        return returnStr;
                    }

                    var pathList = "";
                    var customerIdList = "";
                    var idList = "";
                    var codeList = "";
                    var attTypeList = "";
                    var positionList = "";
                    imgContainer.find(".al-certificate-post-item").each(function () {
                        if (!$(this).hasClass("al-certificate-post-example")) {
                            imgListData.push({
                                "attCode": postObj.find(".al-certificate-number-input").val(),
                                "attPath": $(this).find(".al-certificate-post").attr("pic"),
                                "attPositionType": $(this).find("[data-auth-positiontype]").attr("data-auth-positiontype"),
                                "attType": nowAttrType,
                                "id": "_"
                            });
                        }
                    });
                    imgContainer.find(".al-certificate-post").each(function (i) {
                        pathList += $(this).attr("pic") + ",";
                        customerIdList += obj.cid + ",";
                        idList += "_" + ",";
                        attTypeList += nowAttrType + ",";
                        positionList += $(this).attr("data-auth-positiontype") + ",";
                        param = {
                            "customerId": obj.cid,
                            authAttList: JSON.stringify(imgListData),
                            isCompleted: 1,
                            opflag: 2
                        };
                        if (imgContainer.find(".al-certificate-number-input").length === 1) {
                            codeList += imgContainer.find(".al-certificate-number-input").val() + ",";
                            param.attCode = sunDot(codeList);
                        }

                    });

                    var callBack = function () {
                        if (imgListData.length > 0) {
                            t.exhibitionCertificate(imgListData);
                        }
                        t.leaveUploadPost(imgListData);
                    };
                    var options = {
                        port: path.createAuthAttachments,
                        postData: param,//上传参数，json形式即可
                        success: callBack//成功的回调
                    };
                    var postData = {"paramJson": $.toJSON(options.postData)};
                    $.ajax({
                        url: options.port,    //请求的url地址
                        dataType: "json",   //返回格式为json
                        async: false, //请求是否异步，默认为异步，这也是ajax重要特性
                        data: postData,    //参数值
                        type: "POST",   //请求方式
                        beforeSend: function () {
                            //请求前的处理
                            comm.LightBox.showloading();
                        },
                        success: function (data) {
                            comm.LightBox.hideloading();
                            if (data.responseObject.responseStatus) {
                                callBack();
                            }
                        }
                    });
                }

            });
        },
        bindEdit: function () {
            var t = this;
            //上传证件照
            $(".al-certificate-upload").off("click").on("click", function () {
                var isThis = $(this);
                var options = {
                    port: path.getAuthProcess,
                    postData: {
                        customerId: obj.cid
                    },
                    async:1,//同步
                    success: function(){
                        comm.surePop({
                            icon:0, //需要图标吗
                            title:'',
                            content:"审核中，暂时无法编辑证件信息，请耐心等待！",
                            success:function(){

                            }
                        });
                        return;
                    },
                    failed: function () {
                        var imgObj = isThis.parents(".al-certificate-item");
                        var certificateDes = imgObj.find(".al-certificate-title").text().replace(/\s/g, "");
                        var certificateId = imgObj.find(".al-certificate-number").text().replace(/\s/g, "");
                        var imgInfoList = [];
                        var failedDes = imgObj.find(".al-certificate-error").text().replace(/\s/g, "");
                        var demoImgList = imgObj.attr("data-auth-demo").split(",");
                        var len = demoImgList.length * 2;
                        var numDes = ["一", "二", "三", "四"];
                        //保存此时操作的证件类型
                        $(".al-attType-save").attr({'data-nowAttType': imgObj.attr("data-auth-attType")});
                        var numBerOnOff = (parseInt(imgObj.attr("data-auth-attType"))===8)||(parseInt(imgObj.attr("data-auth-attType"))===6)||(parseInt(imgObj.attr("data-auth-attType"))===13)||(parseInt(imgObj.attr("data-auth-attType"))===1);
                        var oddNumber = 0;
                        var evenNumber = 0;
                        for (var imgNum = 0; imgNum < len; imgNum++) {
                            var desNum = imgNum % 2;
                            if (desNum === 0) {
                                if (len > 3) {
                                    imgInfoList.push({
                                        "picSrc": demoImgList[oddNumber],
                                        "picTitle": "第" + numDes[oddNumber] + "页示例"
                                    });
                                } else {
                                    imgInfoList.push({"picSrc": demoImgList[oddNumber], "picTitle": "示例"});
                                }
                                oddNumber++;
                            } else {
                                var picUrlObj = imgObj.find(".al-certificate-img-item").eq(evenNumber);
                                var picUrl = "";
                                if (picUrlObj) {
                                    picUrl = picUrlObj.find("img").attr("src");
                                }
                                evenNumber++;
                                imgInfoList.push({
                                    "picSrc": picUrl,
                                    "picTitle": "",
                                    "failed": !imgObj.find(".al-certificate-error").hasClass("hide"),
                                    "failedDes": failedDes,
                                    "positionType": evenNumber
                                });

                            }
                        }
                        var authData = {
                            "certificateDes": certificateDes,
                            "certificateNumOnOff": numBerOnOff,
                            "certificateType": imgObj.attr("data-auth-attType"),
                            "certificateId": certificateId,
                            "imgInfoList": imgInfoList
                        };
                        if (imgObj.find(".al-certificate-img-post").length === 0) {
                            // $(".al-certificate-edit-cancel").trigger("click");
                            $(".al-certificate-img-post").remove();
                            // debugger;
                            if (imgObj.find(".al-certificate-img .al-certificate-img-item").length === 0) {
                                imgObj.append(t.templateCertificate(imgObj, authData));
                            } else {
                                var backData = [];
                                backData.push();
                                imgObj.find(".al-certificate-img .al-certificate-img-item").each(function () {
                                    var jsonData = {
                                        "attCode": imgObj.find(".al-certificate-number").text(),
                                        "attPath": $(this).find("img").attr("src"),
                                        "attPositionType": $(this).index() + 1,
                                        "attType": imgObj.attr("data-auth-attType"),
                                        "id": $(this).attr("data-id")
                                    };
                                    backData.push(jsonData);
                                });
                                imgObj.append(t.templateCertificate(imgObj, authData, backData));
                            }
                            imgObj.attr({"class": "al-certificate-item al-certificate-edit"});
                            //初始化上传图片功能
                            $(".al-certificate-post").each(function (i) {

                                var isPostObj = $("#al-certificate-post" + i);
                                t.bindUpload({
                                    uploadPic: isPostObj.attr({"data-post-onoff": isPostObj.next().find("img").length===1}),
                                    imgfile: 'post-imgfile' + i,
                                    picpath: "/images/img10/authentication/camera.png"
                                });
                            });
                        }
                    }
                };
                comm.ajax.request(options);

            });
            $("#auth_cancel").bind("click", function () {
                $(".auth_edit_btn").show();
                $("#auth_edit").hide();
                $(".auth_show").show();
                t.clear();
                //事件埋点
                comm.creatEvent({
                    triggerType: "全站功能按钮点击",
                    keyword: "认证信息修改取消",
                    browType: 103,
                    actionId: 45
                });
            });
            $("#auth_save").bind("click", function () {
                t.renzhengSubmit();
            });
        },
        bindUpload: function (obj) {
            var t = this;
            if (obj.uploadPic.length > 0) {
                obj.uploadPic.html('<input type="file" id="' + obj.imgfile + '" name="file" />');
            }
            var paramJson = $.toJSON({imageType: "2", domain: location.hostname});
            czyx.uploadReplace("#" + obj.imgfile, {
                url: path.attUpload, //文件处理的URL,
                data: {paramJson: paramJson},
                uploadReplaceCss: {
                    // 设置上传按钮图片
                    background: 'url(' + obj.picpath + ') no-repeat 0 0 ',
                    backgroundSize: '100% 100%',
                    width: "216",             //上传按钮的宽度
                    height: "143"              //上传按钮的高度
                },
                uploadInputCss: {
                    width: "100%",             //上传按钮的宽度
                    height: "100%"             //上传按钮的高度
                },
                uploadBefore: function () {
                    if (!/\.((jpg)|(jpeg)|(png))$/i.test(this.value)) {
                        alert('只允许上传.jpg .jpeg .png类型的图片文件');
                        $("#"+obj.imgfile).val("");
                        return false;
                    }
                    var fileSize = comm.file.getFileSize(document.getElementById(obj.imgfile));
                    if (fileSize > 10485760) {
                        alert('图片不能大于' + 10485760/ 1048576 + "M");
                        $("#"+obj.imgfile).val("");
                        return false;
                    }

                    obj.uploadPic.append('<div class="al-mask"><figure class="percentage loadingAnimate"><img src="//img10.allinmd.cn/v3/common/icon/icon_uploading.png"><!--<span>20%</span>--></figure></div>');
                    clearTimeout(failedTimer);
                    var failedTimer = setTimeout(function(){
                        // console.log(obj.uploadPic)
                        obj.uploadPic.find(".al-mask").remove();
                        if(obj.uploadPic.attr("data-post-onOff")&&(!JSON.parse(obj.uploadPic.attr("data-post-onOff")))){
                            obj.uploadPic.append('<div class="ev-upload">'+
                                '	<!--蒙层-->'+
                                '	<div class="uploadPopup">'+
                                '		<p class="hide" style=" display: block; ">'+
                                '			上传失败<br>'+
                                '			                                                请重新上传'+
                                '		</p>'+
                                '		<figure class="percentage loadingAnimate hide" style=" display: none; ">< img src="/image/authority/authentication/icon_uploading.png"><!--<span>20%</span>-->                                            </figure>'+
                                '	</div>'+
                                '	<!--关闭按钮-->'+
                                '	<section class="popupClose">'+
                                '	</section>'+
                                '</div>');
                            $(".popupClose").off("click").on("click",function(){
                                var isImg = $(this);
                                isImg.parents(".ev-upload").remove();
                            });
                        }

                    },2*60*1000);


                },
                uploadEnd: function (serverJson) {//上传完毕后调用
                    $(".al-contentItemTitle").attr({'data-nowAttType': obj.uploadPic.parents(".al-certificate-item").attr("data-auth-attType")});
                    serverJson = $.parseJSON(serverJson.split('<')[0]);
                    if (serverJson.responseObject.responseStatus) {
                        t.url = serverJson.responseObject.responseMessage.url;
                        t.attPath = serverJson.responseObject.responseMessage.path;
                        obj.uploadPic.attr("pic", t.attPath).on("mouseover", function () {
                            // console.log($(this).find("div"));
                            $(this).find("div").css({"opacity": 1});
                        });
                        // console.log(obj.uploadPic.find("input[type='file']"))

                        obj.uploadPic.attr({"data-post-onOff": true});
                        obj.uploadPic.find(".ev-upload").remove();
                        $.extend(obj, {picpath: serverJson.responseObject.responseMessage.url});
                        t.bindUpload(obj);
                        obj.uploadPic.find("input[type='file']").remove();
                        obj.uploadPic.find(".al-mask").remove();
                        $("#attCode_error").removeClass("showIb");
                        //t.addMask(obj);

                    } else {
                        obj.uploadPic.attr({"data-post-onOff": false});
                        if (serverJson.message) {
                            alert(serverJson.message);
                        } else {
                            alert("上传失败")
                        }

                    }
                    t.lightUploadPost();
                }
            });
        },
        renzhengSubmit: function () {
            var t = this;
            var param;
            var chrnum = /^([\@A-Za-z0-9\!\#\$\%\^\&\*\.\~\,\.\/\?\>\<\:\;\+\-\_\|\'\"\\\=\`\(\)\{\}\[\]]+)$/;
            var idCode = /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/;
            var idCode1 = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$/;
            var attCode = $("#certificatesCode").val();
            $("#attPath_error").removeClass("showIb");
            $("#certificatesCode").parent().removeClass("error");

            if (!$(".uploadPic").attr("pic")) {
                $("#attPath_error").addClass("showIb");// 上传图片错误提示
                return false;
            } else if ((attCode && !chrnum.test(attCode) && t.attType != 10) || (attCode && (!idCode.test(attCode) && !idCode1.test(attCode)) && t.attType == 1)) {//非工作证才需验证证件号||身份证的正则校验
                $("#certificatesCode").parent().addClass("error");
                $("#attCode_error").addClass("showIb").html("<i></i>请填写正确证件号码！");
                return;
            } else if (attCode.length > 50) {
                $("#certificatesCode").parent().addClass("error");
                $("#attCode_error").addClass("showIb").html("<i></i>最长50个字符！");
                return;
            } else {
                var attType = t.attType;
                var customerId = obj.cid;
                var attPositionType = '1';
                var id = "_";
                var attPath = $("#uploadPic1").attr("pic");
                if ($("#uploadPic2").attr("pic")) {//有两张图片时
                    attType = t.attType + "," + t.attType;
                    attCode = $("#certificatesCode").val() ? $("#certificatesCode").val() + "," + $("#certificatesCode").val() : '_,_';
                    customerId = obj.cid + "," + obj.cid;
                    attPositionType = '1,2';
                    id = "_,_";
                    attPath = $("#uploadPic1").attr("pic") + "," + $("#uploadPic2").attr("pic");
                }
                param = {
                    attType: attType,
                    attCode: attCode,
                    customerId: customerId,
                    attPositionType: attPositionType,
                    id: id,
                    attPath: attPath
                };
            }
            if (t.attType && t.attType != "") {
                $("#auth_edit").mask("");
                var rst = comm.customer.asyncExecute("createAuthAttachment", param, function (data) {
                    if (data.responseStatus) {
                        var attCodeNew = $("#certificatesCode").val();
                        if (attCodeNew) {
                            if (attCodeNew.length < 4) {
                                code = attCodeNew.substring(0, 2) + "**************" + attCodeNew.substring(attCodeNew.length - 2);
                            } else {
                                code = attCodeNew.substring(0, 4) + "**************" + attCodeNew.substring(attCodeNew.length - 2);
                            }
                            $("#" + t.attType + "_attCode").show().attr("attCode", attCodeNew);
                            $("#" + t.attType + "_attCode").text(code);
                        } else {
                            $("#" + t.attType + "_attCode").hide();
                        }
                        $("#" + t.attType + "_attPath").show().attr("src", "//img05.allinmd.cn/"+$("#uploadPic1").attr("pic"));
                        if ($("#uploadPic2").attr("pic")) {
                            $("#" + t.attType + "_attPath2").show().attr("src", "//img05.allinmd.cn/"+$("#uploadPic2").attr("pic"));
                        }
                        $.topTip({mark: "success", content: "认证资料保存成功！"});
                        $(".auth_edit_btn").each(function (i, em) {
                            if ($(em).attr("atttype") == t.attType) {
                                $(em).remove();
                            }
                        });
                        $(".auth_edit_btn").show();
                        $("#auth_edit").hide();
                        $(".auth_show").show();
                        t.clear();
                    } else {
                        $.topTip({mark: "warn", content: "认证资料保存失败！"});
                    }
                    $("#auth_edit").unmask();
                });
            } else {
                //alert("请填写完整证件信息！");
            }
        },
        addMask: function (obj) {
            $("#" + obj.imgfile).parent().append('<img class="pic_mask" src="//img00.allinmd.cn/personal/cx_sc.png" width="120" height="80"/>');
            $("#" + obj.imgfile).parent().bind("mouseover", function () {
                $(this).find(".pic_mask").show();
            }).bind("mouseout", function () {
                $(this).find(".pic_mask").hide();
            });
        },
        clear: function () {
            $("#uploadPic1").attr("pic", "");
            $("#uploadPic2").attr("pic", "");
            $("#attCode_error").removeClass("showIb");
            $("#attPath_error").removeClass("showIb");
            $("#certificatesCode").parent().removeClass("error");
        }
    };

    function msgNull(obj) {
        if (obj.text()==''){
            // obj.parent('.al-tableItem').remove()
            obj.hide();
            obj.parent('.al-tableItem').css('paddingTop',0)
        }
    }
    /*医生寄语开始*/
    var doctorWrote = {};
    doctorWrote = {
        init: function () {

            $("#doctorWrote_save").attr("on", "true");
            $("#doctorWrote_hid").val($.isEmptyObject(baseInfo.sendWord)?"":baseInfo.sendWord);
            $("#doctorWrote_count").text($("#doctorWrote_hid").val());
            $("#doctorWrote_count").expandShrink({
                len: 210
            });
            comm.textChange({"$tex": $("#doctorWrote"), "noTop": 1});
            msgNull($("#doctorWrote_count"))
            this.edit();
            this.demoText();
            this.save();
            this.cancel();
        },
        edit: function () {
            $("#doctorWroteEditBtn").on("click", function () {
                $(this).hide();
                $("#doctorWrote_edit").show();
                $("#doctorWrote_show").hide();
                // $('#doctorWrote').val($('#doctorWrote_count').text())
                $("#doctorWrote").val($("#doctorWrote_hid").val());
                $('.ev-doctorInvertedNum').text(500);
                base.InvertedNum($('#doctorWrote'),$('.ev-doctorInvertedNum'));
            })
        },
        demoText:function () {
            $('.doctorWroteDemo li i').on('click',function () {
                var textareaVal = $('#doctorWrote').val();
                var doctorDemoText = textareaVal + $(this).siblings('span').html()
                var replaceEnter = doctorDemoText.replace(/[\r\n]/g,"")
                var replaceNbsp = replaceEnter.replace(/[ ]/g,"")
                $('#doctorWrote').val(replaceNbsp);
                var e = jQuery.Event("keyup");
                $('#doctorWrote').trigger(e);
            })
        },
        save: function () {
            function restoreDom() {
                $('#doctorWrote_edit').hide();
                $('#doctorWrote_show').show();
                $('#doctorWroteEditBtn').show();
                $('#doctorWrote_count').parent('.al-tableItem').css('paddingTop','20px')
                $('#doctorWrote_count').show().text($('#doctorWrote').val());
                $("#doctorWrote_hid").val($('#doctorWrote_count').text())
                $("#doctorWrote_count").expandShrink({len: 210});
                $(".loadmask,.loadmask-msg").remove();
                $("#doctorWrote_save").attr("on", "true");
            }
            $("#doctorWrote_save").on("click", function () {

                var _isThis = $(this);
                doctorWrote = $("#doctorWrote").val();
                if (!doctorWrote) {
                    return;
                }
                if (doctorWrote==$('#doctorWrote_count').text()) {
                    restoreDom();
                }else{
                    if (_isThis.attr("on") == "true") {
                        _isThis.attr("on", "false");
                        $("#doctorWrote_edit").mask("");
                        $.ajax({
                            url: "/call/customer/auth/updateBaseinfo/",
                            type: "POST",
                            dataType: "json",
                            data: {paramJson:$.toJSON({sendWord: doctorWrote,customerId: obj.cid})},
                            success: function (rep) {
                                if(rep&&rep.responseObject.responseStatus){
                                    restoreDom();
                                    $("#doctorWrote_edit").unmask("");
                                    $.topTip({mark: "success", content: "医师寄语保存成功！"});
                                }
                            },
                            error:function(){}
                        })
                    }
                }

            });

        },
        cancel: function () {
            $("#doctorWrote_cancel").on("click", function () {
                $("#doctorWroteEditBtn").show();
                $("#doctorWrote_edit").hide();
                $("#doctorWrote_show").show();
                //事件埋点
                comm.creatEvent({
                    triggerType: "全站功能按钮点击",
                    keyword: "医师寄语修改取消",
                    browType: 102,
                    actionId: 45
                });
            });
        }
    };



})

