    /**
     * 功能描述：  活动二期PC赛区报名
     * 使用方法:
     * 注意事件：
     * 引入来源：
     * 作用：公共方法
     * Created by ZhangHongda on 2017/05/22.
     */
    $(function(){
        var Competition = {
            param:{
                activityId:$("#activityId").val(), customerId:'', cusInfo : {}, status:'',//标识用户报名状态
                cancle:0,
                actType:'',//保存活动上传的类型
                divFlag:0,//地区是否展开
                warFlag:0,
                divThird:0,//判断地区有几级
                warThird:0,//判断专业有几级
                uploadOne:0,//判断上传的类型是否只有一种
                property_area:{},//术士保存
                property:{},//地区保存
                divInfo:{//用来存放地区信息，用于上一步或者下一步信息填充使用
                    div:'',
                    war:''
                },
                divId:{//用于存放各个id进行active的样式添加
                    div:'',
                    war:''
                },
                stepNum:0,
                goUpload:'',//为1时标示如果只配置了一项上传资源的类型为一种，则点击时直接走入发布页
                oneLoad:'',
                isShowTipstar:'',
                isShowTipend:'',
                propertyAll_5:'',//赛区
                propertyAll_6:''//类别
            },
            path:{
                reg:'activity/register/getRegisterStatus/',//获取用户报名信息
                pertyList:'activity/property/getProPertyList/',//地区选择
                list:'activity/event/getEventConfigList/',//获取内容
                upData:'activity/register/update/',//用户填写完个人信息进行下一步
                isExpert:PC_CALL+'activity/api/isExpert/',//查看是否是专家
                reviewCount:PC_CALL+"activity/api/getExpertReviewResourceCount/",//查看专家待评作品数量
                saveProperty:"activity/registers/property/create/"//保存赛区和术士
            },
            template:{
                CusInfo:'',
                //参赛地区整体轮廓
                alBox: '',
                //参赛地区具体内容
                divOrbus:'',
                divBus:'',
                //参赛类别
                business:'',
                //资源类型
                resourceType:''
            },
            actArr : [],
            init:function (){
                var t = this;
                t.activetyOrder();//判断步骤顺序
                t.cancle();//取消报名
            },
            //获取用户基本信息
            activetyOrder:function(){
                var t = this;
                t.param.customerId = $("#sesCustomerId").val();
                var registerStatus = '';
                var params={paramJson:$.toJSON({
                    activityId: t.param.activityId,
                })};
                t.actAsync(t.path.list,params,function(data){
                    if(data.responseObject.responseData){
                        if(data.responseObject.responseData.data_list){
                            var datas = data.responseObject.responseData.data_list;
                            for(var i = 0;i<datas.length;i++){
                                //事件类型，1:报名流程
                                if(datas[i].eventProcessType==1){
                                    //startStatus:startNum//1未开始 ，-1已开始
                                    //endStatus:endNum//1结束 ，-1未结束
                                    if((datas[i].endStatus==-1&&datas[i].startStatus==-1)||$("#activityId").attr("isreviewbegin")==1) {
                                        t.param.isShowTipstar = datas[i].startStatus;
                                        t.param.isShowTipend = datas[i].endStatus;
                                        $("#nav_enroll").show();
                                        $(".nav_apply").css("background",datas[i].cmsActivityEvent.eventBgcolor);
                                        $(".nav_apply a").text(datas[i].cmsActivityEvent.eventName.substr(0,6));
                                        if(datas[i].cmsActivityEventConfig.length==1&&datas[i].cmsActivityEventConfig[0].configDataType==4&&datas[i].cmsActivityEventConfig[0].uploadType.length==1){
                                            t.param.goUpload = 1;
                                        }
                                    }
                                }
                                if(datas[i].eventProcessType==2){//大众评审阶段
                                    //startStatus:startNum//1未开始 ，-1已开始
                                    //endStatus:endNum//1结束 ，-1未结束
                                    if((datas[i].endStatus==-1&&datas[i].startStatus==-1)||$("#activityId").attr("isreviewbegin")==1) {
                                        $("#nav_enroll").show();
                                        $(".nav_apply").css("background",datas[i].cmsActivityEvent.eventBgcolor);
                                        $(".nav_apply a").text(datas[i].cmsActivityEvent.eventName.substr(0,6));
                                    }
                                }
                            }
                        }
                    }
                    $("#nav_enroll").off("click").on("click", function () {
                        user.login({
                            callback: function () {
                                var cid = $("#sesCustomerId").val();
                                var params = {paramJson: $.toJSON({customerId:$("#sesCustomerId").val(),activityId:$('#activityId').val()})}
                                $.ajax({
                                    url : t.path.isExpert,//判断是否是专家
                                    type : "POST",
                                    data :  params,
                                    async : false,
                                    success : function(data){
                                        comm.LightBox.hideloading();
                                        var isExpert = data.responseObject.responseData.isExpert;
                                        $("#activityId").attr("expert",isExpert);
                                        var recordId = data.responseObject.responseData.recordId;
                                        $("#activityId").attr("recordId",recordId);
                                    },
                                    error : function(){
                                        comm.LightBox.hideloading();
                                    }
                                });
                                if($("#activityId").attr("expert")==1){//判断是专家
                                    var navText = 1;
                                    $.each($(".spTemp_total_nav_lists li span"), function (i, e) {
                                        if(e.innerText=="待评作品"){
                                            $(this).show();
                                            $(this).click();
                                        }
                                        if(e.innerText=="我的作品"){
                                            $(this).hide();
                                        }
                                        //if($(e).text()=="待评作品"){
                                        //    navText = $(e).attr("data-navtext");//获取到待评作品的导航值
                                        //}
                                    });
                                    //window.location.href = "/html/activity/"+$('#activityId').val()+"/activity_index.html#&navText="+navText;//跳转到待评作品页
                                    t.scoreAlert();
                                }else{
                                    if($(".textColorYesOne").text().indexOf("我的作品")>-1){
                                        if(comm.myWorks){
                                            comm.myWorks();
                                        }
                                    }
                                    t.param.customerId = $("#sesCustomerId").val();
                                    t.actAsync(t.path.reg,{paramJson:$.toJSON({activityId: t.param.activityId,customerId: TempCache.getItem("userId"),isValid:1})}, function (data) {
                                        t.param.status = data.responseObject.responseData.registerStatus;
                                    });
                                    if(t.param.status==6){//表示上传作品达到上限
                                        var popupHtml = '<div class="score_reminder_mask"><section class="score_reminder"><i></i>' +
                                            '<h3>您在本活动提交作品数已达上限</h3><p>您可参与其他活动，或直接发布到网站与同行交流</p>' +
                                            '<div class="btn_box">' +
                                            '<button class="btn_ensure">去发布</button>' +
                                            '<button class="btn_cancel">知道了</button></div></section></div>';
                                        $(".al-mainInner").append(popupHtml);
                                        $('.score_reminder').css({"marginLeft":-225,'marginTop':-132,'top':'50%','left':'50%'});
                                        $('body').css('overflow','hidden');
                                        $('.btn_ensure').on('click',function () {
                                            $('.score_reminder_mask').remove();
                                            $('body').css('overflow','auto');
                                            var href='/pages/singlePage/upload-case.html';
                                            //g_sps.jump(null,href,true);
                                            comm.ieAlert(href);
                                        });
                                        $('.btn_cancel,.score_reminder i').on('click',function () {
                                            $('.score_reminder_mask').remove();
                                            $('body').css('overflow','auto');
                                        });
                                    }else{
                                        params={paramJson:$.toJSON({
                                            activityId: t.param.activityId,
                                            customerId: TempCache.getItem("userId"),
                                            registerStatus: t.param.status
                                        })};
                                        t.actAsync(t.path.list,params,function(data){
                                            if(data.responseObject.responseData){
                                                if(data.responseObject.responseData.data_list){
                                                    var datas = data.responseObject.responseData.data_list;
                                                    for(var i = 0;i<datas.length;i++){
                                                        //如果是报名流程
                                                        if(datas[i].cmsActivityEvent.eventType==1&&datas[i].endStatus==-1&&datas[i].startStatus==-1){
                                                            //如果只配置了一种，为上传，上传只有一种
                                                            if(datas[i].cmsActivityEventConfig.length==1&&datas[i].cmsActivityEventConfig[0].configDataType==4&&datas[i].cmsActivityEventConfig[0].uploadType.length==1){
                                                                t.param.goUpload = 1;//表示只有上传类型，类型只有一种
                                                                t.param.actType = parseInt(datas[i].cmsActivityEventConfig[0].uploadType);
                                                                switch (parseInt(t.param.actType)){
                                                                    case 1://视频发布
                                                                        module.videoUpload({
                                                                            videoBtn:$("#nav_upLoad"),
                                                                            oneUpload:1,//只有一种发布时
                                                                            activityId: t.param.activityId,//是否PK上传
                                                                            property:t.param.property,//活动时选择的专业和术式
                                                                            property_area:t.param.property_area,//新版活动赛区参数
                                                                            publishBack:function(){//发布成功回调
                                                                                $(".signUpBackground").remove();
                                                                                t.actArr=[];
                                                                                t.param.stepNum=0;
                                                                                if($(".textColorYesOne").text().indexOf("我的作品")>-1){
                                                                                    if(comm.myWorks){
                                                                                        comm.myWorks();
                                                                                    }
                                                                                }
                                                                            }
                                                                        });
                                                                        break;
                                                                    case 2://文库发布
                                                                        module.docUpload({
                                                                            docBtn: $("#nav_upLoad"),
                                                                            oneUpload:1,//只有一种发布时
                                                                            activityId: t.param.activityId,//是否PK上传
                                                                            property:t.param.property,//活动时选择的专业和术式
                                                                            property_area:t.param.property_area,//新版活动赛区参数
                                                                            publishBack:function(){//发布成功回调
                                                                                $(".signUpBackground").remove();
                                                                                t.actArr=[];
                                                                                t.param.stepNum=0;
                                                                                if($(".textColorYesOne").text().indexOf("我的作品")>-1){
                                                                                    if(comm.myWorks){
                                                                                        comm.myWorks();
                                                                                    }
                                                                                }
                                                                            }
                                                                        });
                                                                        break;
                                                                    case 4://话题发布
                                                                        module.topicUpload({
                                                                            topicBtn: $("#nav_upLoad"),
                                                                            oneUpload:1,//只有一种发布时
                                                                            activityId: t.param.activityId,//是否PK上传
                                                                            property:t.param.property,//活动时选择的专业和术式
                                                                            property_area:t.param.property_area,//新版活动赛区参数
                                                                            publishBack:function(){//发布成功回调
                                                                                $(".signUpBackground").remove();
                                                                                t.actArr=[];
                                                                                t.param.stepNum=0;
                                                                                if($(".textColorYesOne").text().indexOf("我的作品")>-1){
                                                                                    if(comm.myWorks){
                                                                                        comm.myWorks();
                                                                                    }
                                                                                }
                                                                            }
                                                                        });
                                                                        break;
                                                                    case 7://病例发布
                                                                        if(!$.isEmptyObject(t.param.property_area)){
                                                                            TempCache.setItem("activityProperty_area",JSON.stringify(t.param.property_area));
                                                                        }
                                                                        if(!$.isEmptyObject(t.param.property)){
                                                                            TempCache.setItem("activityProperty",JSON.stringify(t.param.property));
                                                                        }
                                                                        var href = "/pages/singlePage/upload-case.html?activityId="+$("#activityId").val();
                                                                        if($("#activityId").val()=="1513149467288"){// 线下：1509331335386  线上：1513149467288
                                                                            href="/pages/singlePage/upload-activityCase.html?activityId="+$("#activityId").val();
                                                                        }
                                                                        comm.ieAlert(href);
                                                                        //module.caseUpload({
                                                                        //    caseBtn:$("#nav_upLoad"),//创建点击btn
                                                                        //    oneUpload:1,//只有一种发布时
                                                                        //    activityId: t.param.activityId,//是否PK上传
                                                                        //    property:t.param.property,//活动时选择的专业和术式
                                                                        //    property_area:t.param.property_area,//新版活动赛区参数
                                                                        //    publishBack:function(){//发布成功回调
                                                                        //        $(".signUpBackground").remove();
                                                                        //        t.actArr=[];
                                                                        //        t.param.stepNum=0;
                                                                        //        if($(".textColorYesOne").text().indexOf("我的作品")>-1){
                                                                        //            if(comm.myWorks){
                                                                        //                comm.myWorks();
                                                                        //            }
                                                                        //        }
                                                                        //    }
                                                                        //});
                                                                        break;
                                                                }
                                                                $("#nav_upLoad").click();
                                                            }
                                                            //如果不是只有上传（并且上传只有一种）
                                                            if(t.param.goUpload!=1){
                                                                var steps = datas[i].cmsActivityEventConfig;
                                                                //提示不可重复报名
                                                                if (steps.length == 0&&t.param.isShowTipstar==-1&&t.param.isShowTipend==-1) {//处于没有步骤的报名阶段
                                                                    $(".ev-repeat").fadeIn();
                                                                    var timer = setInterval(function () {
                                                                        $(".ev-repeat").fadeOut();
                                                                        clearInterval(timer);
                                                                    },5000);
                                                                } else {
                                                                    $(".ev-repeat").hide();
                                                                    var customerInfo = datas[i].customer_auth;
                                                                    for (var j = 0; j < steps.length; j++) {
                                                                        //报名信息
                                                                        if (steps[j].configType == 1) {
                                                                            //进行判断是那些信息并将相应的信息进行追加
                                                                            switch (steps[j].configDataType) {
                                                                                case 1://用户信息
                                                                                    if(t.actArr.indexOf(1)==-1){
                                                                                        t.actArr.push(1);
                                                                                    }
                                                                                    t.template.activetyCusInfo = '<section class="signUpBackground">' +
                                                                                        ' <section class="signUpMain ev-actCusInfo">' +
                                                                                        ' <section class="empty"><i class="ev-actCancle"></i></section>' +
                                                                                        ' <section class="signUpCont">' +
                                                                                        '<aside class="title">' + steps[j].configIntro + '</aside>' +
                                                                                        ' <aside class="formCont"><span class="title">姓名</span><input type="text" class="ev-actName" value="' + (customerInfo? customerInfo.lastName + customerInfo.firstName : "") + '"><span class="errorTip">名字不正确</span></aside>' +
                                                                                        ' <aside class="formCont actTitle"><span class="title">职称</span><div class="textVal"></div><span class="errorTip">职称不正确</span></aside>' +
                                                                                        ' <aside class="formCont"><span class="title">医院</span><input type="text" class="ev-actHospital" value="' + (customerInfo?customerInfo.company:'') + '" companyid="' + ((customerInfo&&!$.isEmptyObject(customerInfo.companyId))?customerInfo.companyId:'') + '"><span class="errorTip">医院不正确</span></aside>' +
                                                                                        '<aside class="formCont"><span class="title">电话</span><input type="text" class="ev-actPhone" value="' + (customerInfo?customerInfo.certificatesCode:'') + '"><span class="errorTip">手机号不正确</span></aside>' +
                                                                                        ($.inArray("1", steps[j].customForm.split(",")) != -1 ? '<aside class="formCont"><span class="title">邮箱</span><input type="text" class="ev-actEmail" value="' + (customerInfo?customerInfo.qualificationCode:'') + '"><span class="errorTip">邮箱不正确</span></aside>' : '') +
                                                                                        ($.inArray("2", steps[j].customForm.split(",")) != -1 ? '<aside class="formCont"><span class="title">临床时间</span>' +
                                                                                            '  <figure>' +
                                                                                            '  <select id="ayear">' +
                                                                                            '   </select>' +
                                                                                            '   <b>年</b>' +
                                                                                            '   </figure>' +
                                                                                            '  <figure>' +
                                                                                            '  <select id="amonth">' +
                                                                                            '  </select>' +
                                                                                            '   <b>月</b>' +
                                                                                            '  </figure><span class="soFar">~至今</span>' +
                                                                                            ' </aside>' : '') +
                                                                                        ' <button class="prevBtn ev-actPrevBtn">上一步</button>' +
                                                                                        '  <button class="nextBtn ev-actNextBtn active" style="display: none;">下一步</button>' +
                                                                                        '  <button class="nextBtn ev-actNext">下一步</button>' +
                                                                                        '  </section>' +
                                                                                        '  </section>' +
                                                                                        '  </section>';
                                                                                    if(customerInfo){
                                                                                        t.param.clinicalYear = customerInfo.clinicalYear;
                                                                                        t.param.medicalTitle = customerInfo.medicalTitle;
                                                                                    }
                                                                                    break;
                                                                                case 2://地区
                                                                                    if(t.actArr.indexOf(2)==-1){
                                                                                        t.actArr.push(2);
                                                                                    }
                                                                                    t.template.alBox = '<section class="signUpBackground ev-actDivision">' +
                                                                                        '<section class="signUpMain">' +
                                                                                        ' <section class="empty"><i class="ev-actCancle"></i></section>' +
                                                                                        '<section class="signUpCont">' +
                                                                                        ' <aside class="title ev-actTitle">' + steps[j].configIntro + '</aside>' +
                                                                                        ' <aside class="divisionBtn">' +
                                                                                        ' <button class="ev-actPrevBtn">上一步</button>' +
                                                                                        ' <button class="nextBtn ev-actNext">下一步</button>' +
                                                                                        ' <button class="nextBtn ev-actNextBtn active" style="display: none;">下一步</button>' +
                                                                                        '</aside>' +
                                                                                        ' </section>' +
                                                                                        ' </section>' +
                                                                                        '  </section>'
                                                                                    if($(".ev-actDivisionItem").length==0&&t.template.divOrbus.indexOf("ev-actDivisionItem")==-1){
                                                                                        t.template.divOrbus += '<aside class="formCont ev-actDivisionItem"><div class="ev-divCli"><span class="title">赛区</span><div class="textVal">请选择</div><i></i></div>' +
                                                                                            '<div class="selectCheck ev-divSel" style="display: none">' +
                                                                                            ' <!--关闭按钮-->' +
                                                                                            '<div class="divisionClose"></div>' +
                                                                                            '<ul class="ev-divList">' +
                                                                                            (steps[j].propertyFullPath.split(",")[0] ? '<li class="active ev-divBNav"><span>' + comm.getStrLen(steps[j].propertyFullPath.split(",")[0].substring(2), 8) + '</span><i></i></li>' : '') +
                                                                                            (steps[j].propertyFullPath.split(",")[1] ? '<li class="ev-divSNav"><span>' + comm.getStrLen(steps[j].propertyFullPath.split(",")[1].substring(2), 8) + '</span><i></i></li>' : '') +
                                                                                            (steps[j].propertyFullPath.split(",")[2] ? '<li class="ev-divSMNav"><span>' + comm.getStrLen(steps[j].propertyFullPath.split(",")[2].substring(2), 8) + '</span><i></i></li>' : '') +
                                                                                            (steps[j].propertyFullPath.split(",")[3] ? '<li class="ev-divSMMNav"><span>' + comm.getStrLen(steps[j].propertyFullPath.split(",")[3].substring(2), 8) + '</span><i></i></li>' : '') +
                                                                                            ' </ul>' +
                                                                                            ' </div>' +
                                                                                            '</aside>'
                                                                                    }
                                                                                    //判断有几级，最开始没有同一类别不同级别的情况所以采用这种方式
                                                                                    if (steps[j].propertyFullPath.split(",")[3]) {
                                                                                        t.param.divThird = 4
                                                                                    }else if (steps[j].propertyFullPath.split(",")[2]) {
                                                                                        t.param.divThird = 3
                                                                                    } else if (steps[j].propertyFullPath.split(",")[1]) {
                                                                                        t.param.divThird = 2
                                                                                    } else if (steps[j].propertyFullPath.split(",")[0]) {
                                                                                        t.param.divThird = 1
                                                                                    } else {
                                                                                        t.param.divThird = 0
                                                                                    }
                                                                                    break;
                                                                                case 3://类别
                                                                                    if(t.actArr.indexOf(3)==-1){
                                                                                        t.actArr.push(3);
                                                                                    }
                                                                                    t.template.alBox = '<section class="signUpBackground ev-actDivision">' +
                                                                                        '<section class="signUpMain">' +
                                                                                        ' <section class="empty"><i class="ev-actCancle"></i></section>' +
                                                                                        '<section class="signUpCont ">' +
                                                                                        ' <aside class="title ev-actTitle">' + steps[j].configIntro + '</aside>' +
                                                                                        ' <aside class="divisionBtn">' +
                                                                                        ' <button class="ev-actPrevBtn">上一步</button>' +
                                                                                        ' <button class="nextBtn ev-actNext">下一步</button>' +
                                                                                        ' <button class="nextBtn ev-actNextBtn active" style="display: none;">下一步</button>' +
                                                                                        '</aside>' +
                                                                                        ' </section>' +
                                                                                        ' </section>' +
                                                                                        '  </section>'
                                                                                    if($(".ev-actWarlockItem").length==0&&t.template.divOrbus.indexOf("ev-actWarlockItem")==-1){
                                                                                        t.template.divOrbus += '<aside class="formCont ev-actWarlockItem"><div class="ev-warCli"><span class="title">类别</span><div class="textVal"><div>请选择</div></div><i></i></div>' +
                                                                                            ' <div class="selectCheck ev-warSel" style="display: none">' +
                                                                                            ' <!--关闭按钮-->' +
                                                                                            '<div class="divisionClose"></div>' +
                                                                                            ' <ul class="ev-warList">' +
                                                                                            (steps[j].propertyFullPath.split(",")[0] ? '<li class="active ev-warBNav"><span>' + comm.getStrLen(steps[j].propertyFullPath.split(",")[0].substring(2), 8) + '</span><i></i></li>' : '') +
                                                                                            (steps[j].propertyFullPath.split(",")[1] ? '<li class="ev-warSNav"><span>' + comm.getStrLen(steps[j].propertyFullPath.split(",")[1].substring(2), 8) + '</span><i></i></li>' : '') +
                                                                                            (steps[j].propertyFullPath.split(",")[2] ? '<li class="ev-warSMNav"><span>' + comm.getStrLen(steps[j].propertyFullPath.split(",")[2].substring(2), 8) + '</span><i></i></li>' : '') +
                                                                                            (steps[j].propertyFullPath.split(",")[3] ? '<li class="ev-warSMMNav"><span>' + comm.getStrLen(steps[j].propertyFullPath.split(",")[3].substring(2), 8) + '</span><i></i></li>' : '') +
                                                                                            '</ul>' +
                                                                                            ' </div>' +
                                                                                            ' </aside>'
                                                                                    }
                                                                                    if (steps[j].propertyFullPath.split(",")[3]) {
                                                                                        t.param.warThird = 4
                                                                                    } else if (steps[j].propertyFullPath.split(",")[2]) {
                                                                                        t.param.warThird = 3
                                                                                    } else if (steps[j].propertyFullPath.split(",")[1]) {
                                                                                        t.param.warThird = 2
                                                                                    } else if (steps[j].propertyFullPath.split(",")[0]) {
                                                                                        t.param.warThird = 1
                                                                                    } else {
                                                                                        t.param.warThird = 0
                                                                                    }
                                                                                    break;
                                                                                case 4://上传类型
                                                                                    if(t.actArr.indexOf(4)==-1){
                                                                                        t.actArr.push(4);
                                                                                    }
                                                                                    var busItem = '';
                                                                                    for (var m = 0; m < steps[j].uploadType.split(",").length; m++) {
                                                                                        switch (parseInt(steps[j].uploadType.split(",")[m])) {
                                                                                            case 1:
                                                                                                busItem += '<li data-type="1">视频</li>';
                                                                                                break;
                                                                                            case 2:
                                                                                                busItem += '<li data-type="2">文库</li>';
                                                                                                break;
                                                                                            case 4:
                                                                                                busItem += '<li data-type="4">话题</li>';
                                                                                                break;
                                                                                            case 7:
                                                                                                busItem += '<li data-type="7">病例</li>';
                                                                                                break;
                                                                                        }
                                                                                    }
                                                                                    //如果上传类型只有一种
                                                                                    if (steps[j].uploadType.split(",").length == 1) {
                                                                                        t.param.uploadOne = 1;//标识只上传一种类型
                                                                                        t.param.actType = steps[j].uploadType;
                                                                                    }
                                                                                    t.template.business = '<section class="signUpBackground ev-actSource">' +
                                                                                        '<section class="signUpMain">' +
                                                                                        ' <section class="empty"><i class="ev-actCancle"></i></section>' +
                                                                                        ' <section class="signUpCont">' +
                                                                                        '<aside class="title">' + steps[j].configIntro + '</aside>' +
                                                                                        '<ul class="sourceList ev-sourceCli">' + busItem + '</ul>' +
                                                                                        '<div style="display: none" class="ev-actUpOneBtn"></div>'+
                                                                                        ' </section>' +
                                                                                        '</section>' +
                                                                                        ' </section>';
                                                                                    break;
                                                                            }
                                                                        }
                                                                    }
                                                                    //如果数组中同时存在2,3则将3进行删除保证下一步和上一步的正确
                                                                    if ($.inArray(2, t.actArr) != -1 && $.inArray(3, t.actArr) != -1) {
                                                                        var index = $.inArray(3, t.actArr);
                                                                        t.actArr.splice(index, 1);
                                                                        t.param.hasThir = 1;
                                                                    }
                                                                    //循环结束后进行各步骤解析
                                                                    switch (parseInt(t.actArr[0])) {
                                                                        case 1:
                                                                            t.actCusInfo();
                                                                            break;
                                                                        case 2:
                                                                            t.divOrbus();
                                                                            break;
                                                                        case 3:
                                                                            t.divOrbus();
                                                                            break;
                                                                        case 4:
                                                                            t.uploadType();
                                                                            break;
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        });
                                    }
                                }
                            },
                            scene: privilegeSceneConst.eSceneTypeManufacture,
                            //取消报名时判断是否是我的作品
                            onAuthCancel:function(){
                                if($(".textColorYesOne").text().indexOf("我的作品")>-1){
                                    if(comm.myWorks){
                                        comm.myWorks();
                                    }
                                }
                            },
                            //登录成功后进行判断是否是我的作品，存在已经登录但是没有认证
                            loginCallback: function () {
                                var t = this;
                                if($(".textColorYesOne").text().indexOf("我的作品")>-1){
                                    if(comm.myWorks){
                                        comm.myWorks();
                                    }
                                }
                            }
                        });
                    });
                })
            },
            //点击上一步、下一步的步骤判断
            activityStep: function () {
                var t = this;
                stepBtn();//下一步和下一步的点击
                function stepBtn(){
                    $(".ev-actNextBtn").on("click", function () {
                        if($(".ev-actNextBtn").hasClass("active")&&$(".ev-actNextBtn").text()=="下一步"){
                            if(t.param.stepNum>=t.actArr.length-1){
                                t.param.stepNum=t.actArr.length-1
                            }else{
                                t.param.stepNum++;
                            }
                            //判断当前步是什么，在点击下一步时将当前的信息进行保存
                            if(parseInt(t.actArr[t.param.stepNum-1])){
                                switch (parseInt(t.actArr[t.param.stepNum-1])){
                                    //基本信息,点击下一步时将所有信息进行保存
                                    case 1:
                                        var companyid=$(".ev-actHospital").attr("companyid");
                                        t.param.cusInfo.name = $(".ev-actName").val();
                                        t.param.cusInfo.jobTitle = $(".actTitle").find("div").text();
                                        t.param.cusInfo.hospital = $(".ev-actHospital").val();
                                        t.param.cusInfo.email = $(".ev-actEmail").val();
                                        t.param.cusInfo.phone = $(".ev-actPhone").val();
                                        t.param.cusInfo.year = $("#ayear option:selected").val();
                                        t.param.cusInfo.month = $("#amonth option:selected").val();
                                        t.param.cusInfo.hospitalId = (companyid&&!$.isEmptyObject(companyid))?companyid:'';
                                        //点击下一步走入的接口
                                        if($("#ayear option:selected").val()){
                                            var clinicalYear=$("#ayear option:selected").val()+'-'+$("#amonth option:selected").val()+'-01 00:00:00';
                                        }
                                        t.actAsync(t.path.upData,{paramJson:$.toJSON({
                                            activityId:t.param.activityId,
                                            customerId: TempCache.getItem("userId"),
                                            name: $(".ev-actName").val(),
                                            companyId:(companyid&&!$.isEmptyObject(companyid))?companyid:'',
                                            company:$(".ev-actHospital").val(),
                                            medicalTitle:$('.actTitle').find("div").attr("medicaltitle"),
                                            contactMobile:$(".ev-actPhone").val(),
                                            contactEmail:$(".ev-actEmail").val(),
                                            clinicalYear:clinicalYear,
                                            isValid:1,
                                        })}, function (data) {
                                        });
                                        break;
                                    //如果第二步是地区选择
                                    case 2:
                                        if($(".ev-divCli .textVal").text()){
                                            t.param.divInfo.war = $(".ev-divCli .textVal").text();
                                        }
                                        if($(".ev-warCli .textVal").text()){
                                            t.param.divInfo.div = $(".ev-warCli .textVal").text();
                                        }
                                        if(t.template.divOrbus!=''){
                                            t.template.divBus=t.template.divOrbus;
                                        }
                                        t.template.divOrbus='';
                                        t.saveProperty();
                                        break;
                                    case 3:
                                        if($(".ev-divCli .textVal").text()){
                                            t.param.divInfo.war = $(".ev-divCli .textVal").text();
                                        }
                                        if($(".ev-warCli .textVal").text()){
                                            t.param.divInfo.div = $(".ev-warCli .textVal").text();
                                        }
                                        t.saveProperty();
                                        break;
                                    case 4:
                                        break;
                                }
                            }
                            //判断下一步内容
                            if(parseInt(t.actArr[t.param.stepNum])){
                                switch (t.actArr[t.param.stepNum]){
                                    //基本信息
                                    case 1:
                                        t.actCusInfo();
                                        break;
                                    //如果第二步是地区选择
                                    case 2:
                                        t.divOrbus();
                                        break;
                                    case 3:
                                        t.divOrbus();
                                        break;
                                    case 4:
                                        t.uploadType();
                                        break;
                                }
                            }
                            //如果下一步时提交,如果是报名信息则将报名信息提交
                        }else if($(this).text()=="提交"){
                            if(parseInt(t.actArr[t.param.stepNum])){
                                switch (parseInt(t.actArr[t.param.stepNum])) {
                                    case 1:
                                        if($("#ayear option:selected").val()){
                                            var clinicalYear=$("#ayear option:selected").val()+'-'+$("#amonth option:selected").val()+'-01 00:00:00';
                                        }
                                        t.actAsync(t.path.upData,{paramJson:$.toJSON({
                                            activityId:t.param.activityId,
                                            customerId: t.param.customerId,
                                            name: $(".ev-actName").val(),
                                            companyId:$(".ev-actHospital").attr("companyid"),
                                            company:$(".ev-actHospital").val(),
                                            medicalTitle:$('.actTitle').find("div").attr("medicaltitle"),
                                            contactMobile:$(".ev-actPhone").val(),
                                            contactEmail:$(".ev-actEmail").val(),
                                            clinicalYear:clinicalYear,
                                            isValid:1
                                        })}, function (data) {
                                            $(".signUpBackground").remove();
                                        });
                                        t.uploadSuc();
                                        break;
                                    case 2://如果是上传赛区术士
                                        t.saveProperty(1);
                                        break;
                                    case 3:
                                        t.saveProperty(1);
                                        break;
                                    case 4:
                                        break;
                                }
                            }
                        }
                    });
                    //上一步的点击
                    $(".ev-actPrevBtn").on("click", function () {
                        //如果当前步骤的前一步是上传信息并且上传只有一种则返回上一步时是返回两步
                        if(t.actArr[t.param.stepNum-1]==4&&t.param.uploadOne==1){
                            t.param.stepNum--;
                        }
                        if(t.param.stepNum<=0){
                            t.param.stepNum=0;
                        }else{
                            t.param.stepNum--;
                        }
                        if(parseInt(t.actArr[t.param.stepNum])){
                            switch (parseInt(t.actArr[t.param.stepNum])){
                                //基本信息
                                case 1:
                                    t.actCusInfo();
                                    break;
                                //如果第二步是地区选择
                                case 2:
                                    t.divOrbus();
                                    break;
                                case 3:
                                    t.divOrbus();
                                    break;
                                case 4:
                                    t.uploadType();
                                    break;
                            }
                        }
                    });
                }
            },
            //提交成功
            uploadSuc:function () {
                var t = this;
                //报名成功的提示
                var sucHtml = '<div class="warningBg" style="z-index: 9"><section class="al-msgDeleteModal ev-makeSurePopup" id="ev-makeSurePopup" style="z-index: 9">'+
                    '<h2>提示<i class="icon-close ev-makeCancel"></i></h2>'+
                    '<section class="signPopup">'+
                    '<aside class="signSuccess"><i></i>报名成功</aside>'+
                    '<aside class="signUpPtext">恭喜您已报名成功，预祝您取得好成绩！</aside>'+
                    '<aside class="setTime">3秒后消失</aside>'+
                    '</section>'+
                    '</section></div>';
                comm.LightBox.show(70,"#0a1e2b");//弹层显示
                $("body").append(sucHtml);
                var time = 3;
                var timer = setInterval(function () {
                    if(time==0){
                        clearInterval(timer);
                        $(".signUpBackground").remove();
                        $(".ev-makeSurePopup").remove();
                        $(".warningBg").remove();
                        comm.LightBox.hide();//弹层显示
                        t.actArr=[];
                        t.template.divOrbus = '';//将结构进行置空
                        t.param.stepNum=0;
                        t.param.divInfo.div = '';
                        t.param.divInfo.war = '';
                        t.param.divId.div = '';
                        t.param.divId.war = ''
                    }else{
                        time--;
                        $(".setTime").text(time+'秒后消失');
                    }
                },1000);
            },
            //提交用户选择的地区和术士
            saveProperty:function (isOver) {
                var properAll = {},t = this,
                    name6 = t.param.propertyAll_6.property_name,
                    name5 = t.param.propertyAll_5.property_name,
                    id6 = t.param.propertyAll_6.property_id_list,
                    id5 = t.param.propertyAll_5.property_id_list,
                    fullPath5 = t.param.propertyAll_5.property_full_path,
                    fullPath6 = t.param.propertyAll_6.property_full_path,
                    propertyName6 = {},propertyName5 = {},
                    propertyIdList6 = {},propertyIdList5 = {},
                    propertyFullPath6 = {},propertyFullPath5 = {};
                if(name6.property_name_1&&name6.property_name_2){//如果地区1存在地区2存在
                    propertyName6 = name6.property_name_1+','
                }else {
                    propertyName6 = name6.property_name_1
                }
                if(name6.property_name_2&&name6.property_name_3){//如果地区2存在地区3存在
                    propertyName6 += name6.property_name_2+','
                }else if(name6.property_name_2){
                    propertyName6 += name6.property_name_2
                }
                if(name6.property_name_3&&name6.property_name_4){
                    propertyName6 += name6.property_name_3+','
                }else if(name6.property_name_3){
                    propertyName6 += name6.property_name_3
                }
                if(name6.property_name_4){
                    propertyName6 += name6.property_name_4
                }

                if(name5.propertyName_1&&name5.propertyName_2){
                    propertyName5 = name5.propertyName_1+','
                }else{
                    propertyName5 = name5.propertyName_1
                }
                if(name5.propertyName_2&&name5.propertyName_3){
                    propertyName5 += name5.propertyName_2+','
                }else if(name5.propertyName_2){
                    propertyName5 += name5.propertyName_2
                }
                if(name5.propertyName_3&&name5.propertyName_4){
                    propertyName5 += name5.propertyName_3+','
                }else if(name5.propertyName_3){
                    propertyName5 += name5.propertyName_3
                }
                if(name5.propertyName_4){
                    propertyName5 += name5.propertyName_4
                }

                if(id5.property_id_list_1&&id5.property_id_list_2){
                    propertyIdList5 = id5.property_id_list_1+','
                }else if(id5.property_id_list_1){
                    propertyIdList5 = id5.property_id_list_1
                }
                if(id5.property_id_list_2&&id5.property_id_list_3){
                    propertyIdList5 += id5.property_id_list_2+','
                }else if(id5.property_id_list_2){
                    propertyIdList5 += id5.property_id_list_2
                }
                if(id5.property_id_list_3&&id5.property_id_list_4){
                    propertyIdList5 += id5.property_id_list_3+','
                }else if(id5.property_id_list_3){
                    propertyIdList5 += id5.property_id_list_3
                }
                if(id5.property_id_list_4){
                    propertyIdList5 += id5.property_id_list_4
                }

                if(id6.property_id_list_1&&id6.property_id_list_2){
                    propertyIdList6 = id6.property_id_list_1+','
                }else if(id6.property_id_list_1){
                    propertyIdList6 = id6.property_id_list_1
                }
                if(id6.property_id_list_2&&id6.property_id_list_3){
                    propertyIdList6 += id6.property_id_list_2+','
                }else if(id6.property_id_list_2){
                    propertyIdList6 += id6.property_id_list_2
                }
                if(id6.property_id_list_3&&id6.property_id_list_4){
                    propertyIdList6 += id6.property_id_list_3+','
                }else if(id6.property_id_list_3){
                    propertyIdList6 += id6.property_id_list_3
                }
                if(id6.property_id_list_4){
                    propertyIdList6 += id6.property_id_list_4
                }

                if(fullPath5.property_full_path_1&&fullPath5.property_full_path_2){
                    propertyFullPath5 = fullPath5.property_full_path_1+','
                }else if(fullPath5.property_full_path_1){
                    propertyFullPath5 = fullPath5.property_full_path_1
                }
                if(fullPath5.property_full_path_2&&fullPath5.property_full_path_3){
                    propertyFullPath5 += fullPath5.property_full_path_2+','
                }else if(fullPath5.property_full_path_2){
                    propertyFullPath5 += fullPath5.property_full_path_2
                }
                if(fullPath5.property_full_path_3&&fullPath5.property_full_path_4){
                    propertyFullPath5 += fullPath5.property_full_path_3+','
                }else if(fullPath5.property_full_path_3){
                    propertyFullPath5 += fullPath5.property_full_path_3
                }
                if(fullPath5.property_full_path_4){
                    propertyFullPath5 += fullPath5.property_full_path_4
                }

                if(fullPath6.property_full_path_1&&fullPath6.property_full_path_2){
                    propertyFullPath6 = fullPath6.property_full_path_1+','
                }else if(fullPath6.property_full_path_1){
                    propertyFullPath6 = fullPath6.property_full_path_1
                }
                if(fullPath6.property_full_path_2&&fullPath6.property_full_path_3){
                    propertyFullPath6 += fullPath6.property_full_path_2+','
                }else if(fullPath6.property_full_path_2){
                    propertyFullPath6 += fullPath6.property_full_path_2
                }
                if(fullPath6.property_full_path_3&&fullPath6.property_full_path_4){
                    propertyFullPath6 += fullPath6.property_full_path_3+','
                }else if(fullPath6.property_full_path_3){
                    propertyFullPath6 += fullPath6.property_full_path_3
                }
                if(fullPath6.property_full_path_4){
                    propertyFullPath6 += fullPath6.property_full_path_4
                }
                if($(".ev-actDivisionItem").length<=0){
                    properAll ={
                        activityId:t.param.activityId,
                        customerId: t.param.customerId,
                        property:{
                            propertyIdList:propertyIdList6,
                            propertyName:propertyName6,
                            propertyFullPath:propertyFullPath6
                        },
                        property_area:{
                        },
                        siteId:1
                    }
                } else if($(".ev-actWarlockItem").length<=0){
                    properAll ={
                        activityId:t.param.activityId,
                        customerId: t.param.customerId,
                        property:{
                        },
                        property_area:{
                            propertyIdList:propertyIdList5,
                            propertyName:propertyName5,
                            propertyFullPath:propertyFullPath5
                        },
                        siteId:1
                    }
                }else{
                    properAll ={
                        activityId:t.param.activityId,
                        customerId: t.param.customerId,
                        property:{
                            propertyIdList:propertyIdList6,
                            propertyName:propertyName6,
                            propertyFullPath:propertyFullPath6
                        },
                        property_area:{
                            propertyIdList:propertyIdList5,
                            propertyName:propertyName5,
                            propertyFullPath:propertyFullPath5
                        },
                        siteId:1
                    }
                }
                t.actAsync(t.path.saveProperty,{paramJson:$.toJSON(
                        // activityId:t.param.activityId,
                        // customerId: t.param.customerId,
                        // property:{
                        //     propertyIdList:propertyIdList6,
                        //     propertyName:propertyName6,
                        //     propertyFullPath:propertyFullPath6
                        // },
                        // property_area:{
                        //     propertyIdList:propertyIdList5,
                        //     propertyName:propertyName5,
                        //     propertyFullPath:propertyFullPath5
                        // },
                        // siteId:1
                        properAll
                    )}, function (data) {
                    $(".signUpBackground").remove();
                    if(isOver){
                        t.uploadSuc();
                    }
                });
            },
            //用户基本信息填写
            actCusInfo: function () {
                var t = this;
                $(".signUpBackground").remove();
                $("body").append(t.template.activetyCusInfo);
                //判断地区和类别是否是第一步,如果是第一步则将上一步进行移除,如果基本信息为第二步并且第一步为上传一种资源
                if(t.actArr[0]==1||t.actArr[1]==1&&t.actArr[0]==4&& t.param.uploadOne==1){
                    $(".ev-actPrevBtn").remove();
                    $(".ev-actNext").css("width","340px");
                    $(".ev-actNextBtn").css("width","340px");
                }
                //如果此步骤为最后一步
                if($.inArray(1,t.actArr) == t.actArr.length-1|| $.inArray(1,t.actArr) == t.actArr.length-2&&t.actArr[$.inArray(1,t.actArr)+1]==4&&t.param.uploadOne==1){
                    if($.inArray(1,t.actArr)!=-1&&$.inArray(4,t.actArr)!=-1){
                        var text = '';
                        switch (parseInt(t.param.actType)){
                            case 1:
                                text = "视频";
                                break;
                            case 2:
                                text = "文库";
                                break;
                            case 4:
                                text = "话题";
                                break;
                            case 7:
                                text = "病例";
                                break;
                        }
                        $(".ev-actNextBtn").text("上传"+text);
                        $(".ev-actNext").text("上传"+text);
                        //走入报名
                        $(".ev-actNextBtn").bind("click", function () {
                            //点击下一步走入的接口
                            if($("#ayear option:selected").val()){
                                var clinicalYear=$("#ayear option:selected").val()+'-'+$("#amonth option:selected").val()+'-01 00:00:00';
                            }
                            t.actAsync(t.path.upData,{paramJson:$.toJSON({
                                activityId:t.param.activityId,
                                customerId: t.param.customerId,
                                name: $(".ev-actName").val(),
                                companyId:$(".ev-actHospital").attr("companyid"),
                                company:$(".ev-actHospital").val(),
                                medicalTitle:$('.actTitle').find("div").attr("medicaltitle"),
                                contactMobile:$(".ev-actPhone").val(),
                                contactEmail:$(".ev-actEmail").val(),
                                clinicalYear:clinicalYear,
                                isValid:1
                            })}, function (data) {
                            });
                        });
                        //最后一步是上传则将直接走入发布
                        t.upload();
                    }else{
                        $(".ev-actNextBtn").text("提交");
                        $(".ev-actNext").text("提交");
                    }
                }
                //添加年月
                if($("#ayear").length!=0){
                    ymd({
                        year:$("#ayear"),
                        month:$("#amonth")
                    });
                    var year = t.param.clinicalYear.substring(0, 4);
                    var month = t.param.clinicalYear.substring(5, 7);
                    gettime($("#ayear"), year);
                    gettime($("#amonth"), month);
                }
                //职称
                $(".actTitle").medicalTitleV3({
                    container:$(".actTitle").find(".textVal"),//存放已选择的职称
                    defaultHide:1,//默认隐藏  选择医师展开
                });
                //医院联想词
                $(".ev-actHospital").lenovo({
                    url: "/call/commdata/getHospitalList/",
                    width: 273,
                    showName: "hospitalName", //显示出的值
                    id:"id",   //自定义属性值
                    hiddenId:"companyId"    //自定义属性
                });

                var medical = t.param.medicalTitle;
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
                $(".actTitle").find(".textVal").text(medicalTitle.substring(0,medicalTitle.length-1)).attr("medicalTitle", medical);
                //清空职称的选中状态
                $(".actTitle .ev-medicalLiList").attr("select-status", "false");
                $(".actTitle .ev-medicalLiList").removeClass("active");
                //比对是对应职称选中
                $.each($(".actTitle .ev-medicalLiList"), function (i, em) {
                    $.each(ids, function (j, val) {
                        if(val==3||val==4){
                            $(".actTitle .al-tagSelectorList:gt(0)").show();
                        }
                        if ($(em).attr("medicalid") == val) {
                            $(em).attr("select-status", "true");
                            $(em).addClass("active");
                        }
                    });
                });
                //将之前填好的数据进行补充
                if(t.param.cusInfo){
                    if(t.param.cusInfo.name!=undefined){
                        $(".ev-actName").val(t.param.cusInfo.name);
                        $(".actTitle").find("div").text(t.param.cusInfo.jobTitle);
                        $(".ev-actHospital").val(t.param.cusInfo.hospital);
                        $(".ev-actEmail").val(t.param.cusInfo.email);
                        $(".ev-actPhone").val(t.param.cusInfo.phone);
                        $("#ayear option:selected").val(t.param.cusInfo.year);
                        $("#amonth option:selected").val(t.param.cusInfo.month);
                    }
                }
                //判断是否可以点击
                t.checkActive();
                //步骤
                t.activityStep();
            },
            //类别和地区
            divOrbus: function () {
                var t = this;
                var divFlag = 0,//控制地区分类显示或者隐藏开关
                    warFlag = 0,
                    divActive = 0,//判断是否可以点击下一步
                    warActive = 0;
                $(".signUpBackground").remove();
                //将弹层的外框进行追加，再将dom节点进行追加
                $("body").append(t.template.alBox);
                if(t.template.divBus!=''){
                    $(".ev-actTitle").after(t.template.divBus);
                }else {
                    $(".ev-actTitle").after(t.template.divOrbus);
                }
                //判断地区和类别是否是第一步,如果是第一步则将上一步进行移除,或者不是第一步，上传作品是第一步，并且只上传一种资源，地区类别是第二步。
                if(t.actArr[0]==3||t.actArr[0]==2||($.inArray(2,t.actArr)==1&&$.inArray(4,t.actArr)==0&&t.param.uploadOne==1||($.inArray(3,t.actArr)==1&&$.inArray(4,t.actArr)==0&&t.param.uploadOne==1))){
                    $(".ev-actPrevBtn").remove();
                    $(".ev-actNextBtn").css("width","340px");
                    $(".ev-actNext").css("width","340px");
                    $(".ev-actNextBtn").removeClass("prev");
                }
                //如果此步骤为最后一步,或者后一步是上传资源，并且上传资源只有一种时.只是配置了类别没有
                if($.inArray(2,t.actArr) == t.actArr.length-1||$.inArray(3,t.actArr) == t.actArr.length-1|| $.inArray(2,t.actArr) == t.actArr.length-2&&t.actArr[$.inArray(2,t.actArr)+1]==4&&t.param.uploadOne==1|| $.inArray(3,t.actArr) == t.actArr.length-2&&t.actArr[$.inArray(3,t.actArr)+1]==4&&t.param.uploadOne==1){
                    if($.inArray(4,t.actArr)!=-1){
                        var text = '';
                        switch (parseInt(t.param.actType)){
                            case 1:
                                text = "视频";
                                break;
                            case 2:
                                text = "文库";
                                break;
                            case 4:
                                text = "话题";
                                break;
                            case 7:
                                text = "病例";
                                break;
                        }
                        $(".ev-actNextBtn").text("上传"+text);
                        $(".ev-actNext").text("上传"+text);
                    }else{
                        $(".ev-actNextBtn").text("提交");
                        $(".ev-actNext").text("提交");
                    }
                }
                //地区数据
                if($.inArray(2,t.actArr)!=-1){
                    if(t.param.activityId=='1549964316941'){
                        $.ajax({
                            url: '//img05.allinmd.cn/yunying/activityAreaList.json',
                            type: "get",//请求方式为get
                            dataType: "json", //返回数据格式为json
                            success: function (rep) {
                                var divBItem = '',//大地区的全部名称
                                    divSItem = '',//小地区的全部名称
                                    divMSItem = '',//更小地区的全部名称
                                    divMMSItem = '',
                                    divSBox = '',//定义一个放所有小地区的容器
                                    divMSBox = '',
                                    divMMSBox = '',
                                    list = rep.responseObject.responseData.data_list;
                                for(var i = 0;i<list.length;i++){
                                    //将大地区的名称进行保存
                                    divBItem +='<li data-divBId="'+list[i].id+'" data-divId="'+list[i].id+'" data-parentId="'+list[i].parentId+'" data-fullPath="'+list[i].propertyFullPath+'" data-proId="'+list[i].propertyId+'">'+list[i].propertyName+'</li>';
                                    if(list[i].property_2){
                                        divSItem = '';
                                        for(var j = 0;j<list[i].property_2.length;j++){
                                            divSItem +='<li data-divSId="'+list[i].property_2[j].id+'" data-divId="'+list[i].property_2[j].id+'" data-parentId="'+list[i].property_2[j].parentId+'" data-fullPath="'+list[i].property_2[j].propertyFullPath+'" data-proId="'+list[i].property_2[j].propertyId+'">'+list[i].property_2[j].propertyName+'</li>';
                                            if(list[i].property_2[j].property_3){
                                                divMSItem = '';
                                                for(var z= 0;z<list[i].property_2[j].property_3.length;z++){
                                                    divMSItem +='<li data-divSId="'+list[i].property_2[j].property_3[z].id+'" data-divId="'+list[i].property_2[j].property_3[z].id+'" data-parentId="'+list[i].property_2[j].property_3[z].parentId+'" data-fullPath="'+list[i].property_2[j].property_3[z].propertyFullPath+'" data-proId="'+list[i].property_2[j].property_3[z].propertyId+'">'+list[i].property_2[j].property_3[z].propertyName+'</li>';
                                                    if(list[i].property_2[j].property_3[z].property_4){
                                                        divMMSItem = '';
                                                        for(var n= 0;n<list[i].property_2[j].property_3[z].property_4.length;n++){
                                                            divMMSItem += '<li data-divId="'+list[i].property_2[j].property_3[z].property_4[n].id+'" data-parentId="'+list[i].property_2[j].property_3[z].property_4[n].parentId+'" data-fullPath="'+list[i].property_2[j].property_3[z].property_4[n].propertyFullPath+'" data-proId="'+list[i].property_2[j].property_3[z].property_4[n].propertyId+'">'+list[i].property_2[j].property_3[z].property_4[n].propertyName+'</li>';
                                                        }
                                                    }
                                                    divMMSBox +='<ul class="divNam ev-divMMSBox ev-divItem" data-parentId="'+list[i].property_2[j].property_3[z].id+'" style="display: none">'+divMMSItem+'</ul>'
                                                }
                                            }
                                            divMSBox +='<ul class="divNam ev-divMSBox ev-divItem" data-parentId="'+list[i].property_2[j].id+'" style="display: none">'+divMSItem+'</ul>'
                                        }
                                    }
                                    divSBox += '<ul class="divNam ev-divSBox ev-divItem" data-parentId="'+list[i].id+'" style="display: none">'+divSItem+'</ul>';
                                }
                                $(".ev-divSel").append("<div class='divisionName'><ul class='ev-divBItem ev-divItem'>"+divBItem+"</ul></div>");
                                $(".ev-divSel").append("<div class='divisionName ev-divSItem' style='display: none'>"+divSBox+"</div>");
                                $(".ev-divSel").append("<div class='divisionName ev-divMSItem' style='display: none'>"+divMSBox+"</div>");
                                $(".ev-divSel").append("<div class='divisionName ev-divMMSItem' style='display: none'>"+divMMSBox+"</div>");
                                divCli()
                            },
                            error: function (XMLHttpRequest, textStatus, errorThrown) {
                                //console.log('失败')
                            }
                        })
                    }else{
                        t.actAsync(
                            t.path.pertyList,
                            {paramJson:$.toJSON({
                            activityId: t.param.activityId,
                            activityType:8,
                            treeLevel:1,
                            parentId:0,
                        })}, function (rep) {
                            var divBItem = '',//大地区的全部名称
                                divSItem = '',//小地区的全部名称
                                divMSItem = '',//更小地区的全部名称
                                divMMSItem = '',
                                divSBox = '',//定义一个放所有小地区的容器
                                divMSBox = '',
                                divMMSBox = '',
                                list = rep.responseObject.responseData.data_list;
                            for(var i = 0;i<list.length;i++){
                                //将大地区的名称进行保存
                                divBItem +='<li data-divBId="'+list[i].id+'" data-divId="'+list[i].id+'" data-parentId="'+list[i].parentId+'" data-fullPath="'+list[i].propertyFullPath+'" data-proId="'+list[i].propertyId+'">'+list[i].propertyName+'</li>';
                                if(list[i].property_2){
                                    divSItem = '';
                                    for(var j = 0;j<list[i].property_2.length;j++){
                                        divSItem +='<li data-divSId="'+list[i].property_2[j].id+'" data-divId="'+list[i].property_2[j].id+'" data-parentId="'+list[i].property_2[j].parentId+'" data-fullPath="'+list[i].property_2[j].propertyFullPath+'" data-proId="'+list[i].property_2[j].propertyId+'">'+list[i].property_2[j].propertyName+'</li>';
                                        if(list[i].property_2[j].property_3){
                                            divMSItem = '';
                                            for(var z= 0;z<list[i].property_2[j].property_3.length;z++){
                                                divMSItem +='<li data-divSId="'+list[i].property_2[j].property_3[z].id+'" data-divId="'+list[i].property_2[j].property_3[z].id+'" data-parentId="'+list[i].property_2[j].property_3[z].parentId+'" data-fullPath="'+list[i].property_2[j].property_3[z].propertyFullPath+'" data-proId="'+list[i].property_2[j].property_3[z].propertyId+'">'+list[i].property_2[j].property_3[z].propertyName+'</li>';
                                                if(list[i].property_2[j].property_3[z].property_4){
                                                    divMMSItem = '';
                                                    for(var n= 0;n<list[i].property_2[j].property_3[z].property_4.length;n++){
                                                        divMMSItem += '<li data-divId="'+list[i].property_2[j].property_3[z].property_4[n].id+'" data-parentId="'+list[i].property_2[j].property_3[z].property_4[n].parentId+'" data-fullPath="'+list[i].property_2[j].property_3[z].property_4[n].propertyFullPath+'" data-proId="'+list[i].property_2[j].property_3[z].property_4[n].propertyId+'">'+list[i].property_2[j].property_3[z].property_4[n].propertyName+'</li>';
                                                    }
                                                }
                                                divMMSBox +='<ul class="divNam ev-divMMSBox ev-divItem" data-parentId="'+list[i].property_2[j].property_3[z].id+'" style="display: none">'+divMMSItem+'</ul>'
                                            }
                                        }
                                        divMSBox +='<ul class="divNam ev-divMSBox ev-divItem" data-parentId="'+list[i].property_2[j].id+'" style="display: none">'+divMSItem+'</ul>'
                                    }
                                }
                                divSBox += '<ul class="divNam ev-divSBox ev-divItem" data-parentId="'+list[i].id+'" style="display: none">'+divSItem+'</ul>';
                            }
                            $(".ev-divSel").append("<div class='divisionName'><ul class='ev-divBItem ev-divItem'>"+divBItem+"</ul></div>");
                            $(".ev-divSel").append("<div class='divisionName ev-divSItem' style='display: none'>"+divSBox+"</div>");
                            $(".ev-divSel").append("<div class='divisionName ev-divMSItem' style='display: none'>"+divMSBox+"</div>");
                            $(".ev-divSel").append("<div class='divisionName ev-divMMSItem' style='display: none'>"+divMMSBox+"</div>");
                            divCli()
                        });
                    }
                }
                //专业数据
                if($.inArray(3,t.actArr)!=-1){
                    t.actAsync(t.path.pertyList,{paramJson:$.toJSON({
                        activityId: t.param.activityId,
                        activityType: t.param.actType,
                        treeLevel:1,
                        parentId:0,
                    })}, function (opt) {
                        var warBItem = '',//大类别的全部名称
                            warSItem = '',//小类别的全部名称
                            warMSItem = '',//更小类别的全部名称
                            marMMSItem = '',//存放四级类别的全部名称
                            warSBox = '',//定义一个放所有小类别的容器
                            warMSBox = '',
                            warMMSBox = '',
                            lists = opt.responseObject.responseData.data_list;
                        for(var i = 0;i<lists.length;i++){
                            //将大地区的名称进行保存
                            warBItem +='<li data-warBId="'+lists[i].id+'" data-warId="'+lists[i].id+'" data-parentId="'+lists[i].parentId+'" data-fullPath="'+lists[i].propertyFullPath+'" data-proId="'+lists[i].propertyId+'">'+lists[i].propertyName+'</li>';
                            if(lists[i].property_2){
                                warSItem = '';
                                for(var j = 0;j<lists[i].property_2.length;j++){
                                    warSItem +='<li data-warSId="'+lists[i].property_2[j].id+'" data-warId="'+lists[i].property_2[j].id+'" data-parentId="'+lists[i].property_2[j].parentId+'" data-fullPath="'+lists[i].property_2[j].propertyFullPath+'" data-proId="'+lists[i].property_2[j].propertyId+'">'+lists[i].property_2[j].propertyName+'</li>';
                                    if(lists[i].property_2[j].property_3){
                                        warMSItem = '';
                                        for(var z= 0;z<lists[i].property_2[j].property_3.length;z++){
                                            warMSItem +='<li data-warSId="'+lists[i].property_2[j].property_3[z].id+'" data-parentId="'+lists[i].property_2[j].property_3[z].parentId+'" data-warId="'+lists[i].property_2[j].property_3[z].id+'" data-fullPath="'+lists[i].property_2[j].property_3[z].propertyFullPath+'" data-proId="'+lists[i].property_2[j].property_3[z].propertyId+'">'+lists[i].property_2[j].property_3[z].propertyName+'</li>';
                                            if(lists[i].property_2[j].property_3[z].property_4){
                                                marMMSItem = '';
                                                for(var n= 0;n<lists[i].property_2[j].property_3[z].property_4.length;n++){
                                                    marMMSItem +='<li data-parentId="'+lists[i].property_2[j].property_3[z].property_4[n].parentId+'" data-warId="'+lists[i].property_2[j].property_3[z].property_4[n].id+'" data-fullPath="'+lists[i].property_2[j].property_3[z].property_4[n].propertyFullPath+'" data-proId="'+lists[i].property_2[j].property_3[z].property_4[n].propertyId+'">'+lists[i].property_2[j].property_3[z].property_4[n].propertyName+'</li>';
                                                }
                                            }
                                            warMMSBox += '<ul class="divNam ev-warMMSBox ev-warItem" data-parentId="'+lists[i].property_2[j].property_3[z].id+'" style="display: none">'+warMMSItem+'</ul>'
                                        }
                                    }
                                    warMSBox +='<ul class="divNam ev-warMSBox ev-warItem" data-parentId="'+lists[i].property_2[j].id+'" style="display: none">'+warMSItem+'</ul>'
                                }
                            }
                            warSBox += '<ul class="divNam ev-warSBox ev-warItem" data-parentId="'+lists[i].id+'" style="display: none">'+warSItem+'</ul>';
                        }
                        $(".ev-warSel").append("<div class='divisionName'><ul class='ev-warBItem ev-warItem'>"+warBItem+"</ul></div>");
                        $(".ev-warSel").append("<div class='divisionName ev-warSItem' style='display: none'>"+warSBox+"</div>");
                        $(".ev-warSel").append("<div class='divisionName ev-warMSItem' style='display: none'>"+warMSBox+"</div>");
                        $(".ev-warSel").append("<div class='divisionName ev-warMMSItem' style='display: none'>"+warMMSBox+"</div>");
                    });
                }
                //点击赛区，进行显示或者隐藏
                $(".ev-divCli").on("click", function () {
                    if(t.param.divFlag==0){
                        //将类型进行隐藏
                        t.param.warFlag = 0;
                        $(".ev-warSel").hide();
                        t.param.divFlag = 1;
                        $(this).next(".ev-divSel").show();
                        //点击大地区时将相应的小地区展示
                    }else{
                        t.param.divFlag = 0;
                        $(this).next(".ev-divSel").hide();
                    }
                    //点击大小地区时进行Tab切换显示
                    //大地区的点击时
                    $(".ev-divBNav").on("click", function () {
                        $(this).addClass("active").siblings().removeClass("active");
                        $(".ev-divBItem").show();
                        $(".ev-divSItem").hide();
                        $(".ev-divMSItem").hide();
                        $(".ev-divMMSItem").hide();
                    });
                    //如果点击大地区里面已经有被选项，则小地区可以被点击
                    $(".ev-divSNav").on("click", function () {
                        var parId = $(".ev-divBItem li[class=acti]").attr('data-divId');
                        if($(".ev-divBItem li[class=acti]").length!=0&&$('.ev-divSBox li[data-parentid='+parId+']').length>0){
                            $(this).addClass("active").siblings().removeClass("active");
                            $(".ev-divSItem").show();
                            $(".ev-divBItem").hide();
                            $(".ev-divMSItem").hide();
                            $(".ev-divMMSItem").hide();
                        }
                    });
                    //三级地区导航点击
                    $(".ev-divSMNav").on("click", function () {
                        var parId = $(".ev-divSItem li[class=acti]").attr('data-divId');
                        if($(".ev-divSItem li[class=acti]").length!=0&&$('.ev-divMSBox li[data-parentid='+parId+']').length>0){
                            $(this).addClass("active").siblings().removeClass("active");
                            $(".ev-divSItem").hide();
                            $(".ev-divBItem").hide();
                            $(".ev-divMSItem").show();
                            $(".ev-divMMSItem").hide();
                        }
                    });
                    //第四级小地区导航点击
                    $(".ev-divSMMNav").on("click", function () {
                        var parId = $(".ev-divMSItem li[class=acti]").attr('data-divId');
                        if($(".ev-divSItem li[class=acti]").length!=0&&$('.ev-divMMSBox li[data-parentid='+parId+']').length>0){
                            $(this).addClass("active").siblings().removeClass("active");
                            $(".ev-divSItem").hide();
                            $(".ev-divBItem").hide();
                            $(".ev-divMSItem").hide();
                            $(".ev-divMMSItem").show();
                        }
                    });
                    //点击X时进行隐藏
                    $(".ev-divSel .divisionClose").on("click", function () {
                        t.param.divFlag = 0;
                        $(".ev-divSel").hide();
                    })
                });
                function divCli() {
                    //每一项地区的分类点击效果
                    $(".ev-divBItem li").on("click", function () {
                        $(this).addClass("acti").siblings().removeClass("acti");//将点击的li进行样式的增加
                        t.param.divId.div = $(this).attr("data-fullPath");
                        //点击大地区时将小地区和更小地区的选中状态删除，控制nav是否可点击
                        $(".ev-divSBox li").removeClass("acti");
                        $(".ev-divMSBox li").removeClass("acti");
                        //如果没有二级
                        //将点击的内容进行填充，t.param.divThird。表示后台配置了几项。
                        switch (t.param.divThird){
                            case 1:
                                $('.ev-divCli .textVal').text(comm.getStrLen($(this).text(), 28));
                                $(".ev-divSel").hide();
                                t.param.divFlag = 0;
                                divActive = 1;
                                checkAll();
                                break;
                            case 2:
                                //如果地区没有二级
                                if($(".ev-divSItem .ev-divSBox[data-parentId='"+$(this).attr("data-divBid")+"']").children('li').length==0){
                                    $('.ev-divCli .textVal').text(comm.getStrLen($(this).text(), 28));
                                    $(".ev-divSBox").hide();
                                    $(".ev-divSel").hide();
                                    t.param.divFlag = 0;
                                    divActive = 1;
                                }else{//如果最高为二级，有二级。
                                    $('.ev-divCli .textVal').text(comm.getStrLen($(this).text(), 14));
                                    $(".ev-divBItem").hide();
                                    $(".ev-divList").find("li").eq(1).addClass("active").siblings().removeClass("active");
                                    $(".ev-divSItem").show();
                                    $(".ev-divSItem .ev-divSBox[data-parentId='"+$(this).attr("data-divBid")+"']").show().siblings().hide();
                                    divActive = 0;
                                }
                                checkAll();
                                break;
                            case 3:
                                //如果地区没有二级
                                if($(".ev-divSItem .ev-divSBox[data-parentId='"+$(this).attr("data-divBid")+"']").children("li").length==0){
                                    $('.ev-divCli .textVal').text(comm.getStrLen($(this).text(), 28));
                                    $(".ev-divSel").hide();
                                    t.param.divFlag = 0;
                                    divActive = 1;
                                }else{
                                    $('.ev-divCli .textVal').text(comm.getStrLen($(this).text(), 10));
                                    $(".ev-divBItem").hide();
                                    $(".ev-divList").find("li").eq(1).addClass("active").siblings().removeClass("active");
                                    $(".ev-divSItem").show();
                                    $(".ev-divSItem .ev-divSBox[data-parentId='"+$(this).attr("data-divBid")+"']").show().siblings().hide();
                                    divActive = 0;
                                }
                                checkAll();
                                break;
                            case 4:
                                //如果地区没有二级
                                if($(".ev-divSItem .ev-divSBox[data-parentId='"+$(this).attr("data-divBid")+"']").children("li").length==0){
                                    $('.ev-divCli .textVal').text(comm.getStrLen($(this).text(), 28));
                                    $(".ev-divSel").hide();
                                    t.param.divFlag = 0;
                                    divActive = 1;
                                }else{
                                    $('.ev-divCli .textVal').text(comm.getStrLen($(this).text(), 10));
                                    $(".ev-divBItem").hide();
                                    $(".ev-divList").find("li").eq(1).addClass("active").siblings().removeClass("active");
                                    $(".ev-divSItem").show();
                                    $(".ev-divSItem .ev-divSBox[data-parentId='"+$(this).attr("data-divBid")+"']").show().siblings().hide();
                                    divActive = 0;
                                }
                                checkAll();
                        }
                        //控制parentId进行显示某个小地区
                    });
                    //小地区的点击，将带有acti类的节点的内容取出来+点击的内容
                    $(".ev-divSBox li").on("click", function () {
                        $(".ev-divMSBox li").removeClass("acti");
                        $(this).addClass("acti").siblings().removeClass("acti");//将点击的li进行样式的增加
                        t.param.divId.div = $(this).attr("data-fullPath");
                        switch (t.param.divThird){
                            case 2:
                                $('.ev-divCli .textVal').text(comm.getStrLen($(".ev-divBItem li[class=acti]").text(), 14)+'/'+comm.getStrLen($(this).text(), 14));
                                $(".ev-divSel").hide();
                                t.param.divFlag = 0;
                                divActive = 1;
                                checkAll();
                                break;
                            case 3:
                                $(".ev-divBItem").hide();
                                $(".ev-divMSItem .ev-divMSBox[data-parentId='"+$(this).attr("data-divSId")+"']").show().siblings().hide();
                                if($(".ev-divMSItem .ev-divMSBox[data-parentId='"+$(this).attr("data-divSId")+"']").children("li").length==0){
                                    $('.ev-divCli .textVal').text(comm.getStrLen($(".ev-divBItem li[class=acti]").text(), 14)+'/'+comm.getStrLen($(this).text(), 14));
                                    $(".ev-divSel").hide();
                                    t.param.divFlag = 0;
                                    divActive = 1;
                                }else{
                                    $('.ev-divCli .textVal').text(comm.getStrLen($(".ev-divBItem li[class=acti]").text(), 10)+'/'+comm.getStrLen($(this).text(), 10));
                                    $(".ev-divSItem").hide();
                                    $(".ev-divList").find("li").eq(2).addClass("active").siblings().removeClass("active");
                                    $(".ev-divMSItem").show();
                                    divActive = 0;
                                }
                                checkAll();
                                break;
                            case 4:
                                $(".ev-divBItem").hide();
                                $(".ev-divMSItem .ev-divMSBox[data-parentId='"+$(this).attr("data-divSId")+"']").show().siblings().hide();
                                if($(".ev-divMSItem .ev-divMSBox[data-parentId='"+$(this).attr("data-divSId")+"']").children("li").length==0){
                                    $('.ev-divCli .textVal').text(comm.getStrLen($(".ev-divBItem li[class=acti]").text(), 14)+'/'+comm.getStrLen($(this).text(), 14));
                                    $(".ev-divSel").hide();
                                    t.param.divFlag = 0;
                                    divActive = 1;
                                }else{
                                    $('.ev-divCli .textVal').text(comm.getStrLen($(".ev-divBItem li[class=acti]").text(), 10)+'/'+comm.getStrLen($(this).text(), 10));
                                    $(".ev-divSItem").hide();
                                    $(".ev-divList").find("li").eq(2).addClass("active").siblings().removeClass("active");
                                    $(".ev-divMSItem").show();
                                    divActive = 0;
                                }
                                checkAll();
                        }
                    });
                    //更小地区的点击
                    $(".ev-divMSBox li").on("click", function () {
                        t.param.divId.div = $(this).attr("data-fullPath");
                        $(this).addClass("acti").siblings().removeClass("acti");//将点击的li进行样式的增加
                        $(".ev-divMMSBox li").removeClass("acti");
                        switch (t.param.divThird){
                            case 3:
                                $('.ev-divCli .textVal').text(comm.getStrLen($(".ev-divBItem li[class=acti]").text(), 10)+'/'+comm.getStrLen($(".ev-divSItem li[class=acti]").text(), 10)+'/'+comm.getStrLen($(this).text(), 10));
                                $(".ev-divSItem").hide();
                                $(".ev-divList").find("li").eq(2).addClass("active").siblings().removeClass("active");
                                $(".ev-divSel").hide();
                                t.param.divFlag = 0;
                                divActive = 1;
                                break;
                            case 4:
                                //如果四级不存在
                                if ($(".ev-divMMSItem .ev-divMMSBox[data-parentId='"+$(this).attr("data-divSId")+"']").children("li").length==0){
                                    $('.ev-divCli .textVal').text(comm.getStrLen($(".ev-divBItem li[class=acti]").text(), 10)+'/'+comm.getStrLen($(".ev-divSItem li[class=acti]").text(), 10)+'/'+comm.getStrLen($(this).text(), 10));
                                    $(".ev-divSel").hide();
                                    t.param.divFlag = 0;
                                    divActive = 1;
                                }else{
                                    $('.ev-divCli .textVal').text(comm.getStrLen($(".ev-divBItem li[class=acti]").text(), 10)+'/'+comm.getStrLen($(".ev-divSItem li[class=acti]").text(), 10)+'/'+comm.getStrLen($(this).text(), 10));
                                    $(".ev-divSItem").hide();
                                    $(".ev-divMSItem").hide();
                                    $(".ev-divList").find("li").eq(3).addClass("active").siblings().removeClass("active");
                                    $(".ev-divMMSItem").show();
                                    $(".ev-divMMSItem .ev-divMMSBox[data-parentId='"+$(this).attr("data-divSid")+"']").show().siblings().hide();
                                    divActive = 0;
                                }
                                checkAll();
                        }
                    });
                    //第四级小地区的点击
                    $(".ev-divMMSBox li").on("click", function () {
                        t.param.divId.div = $(this).attr("data-fullPath");
                        $(this).addClass("acti").siblings().removeClass("acti");//将点击的li进行样式的增加
                        $('.ev-divCli .textVal').text(comm.getStrLen($(".ev-divBItem li[class=acti]").text(), 10)+'/'+comm.getStrLen($(".ev-divSItem li[class=acti]").text(), 10)+'/'+comm.getStrLen($(".ev-divMSItem li[class=acti]").text(), 10)+'/'+comm.getStrLen($(this).text(), 10));
                        $(".ev-divSel").hide();
                        t.param.divFlag = 0;
                        divActive = 1;
                        checkAll()
                    });
                }
                //专业术士数据
                //因将3从数组中删除则定义一个全量进行控制
                //if($.inArray(3,t.actArr)!=-1){
                if(t.param.hasThir==1){
                    t.actAsync(t.path.pertyList,{paramJson:$.toJSON({
                        activityId: t.param.activityId,
                        activityType: t.param.actType,
                        treeLevel:1,
                        parentId:0,
                    })}, function (opt) {
                        var warBItem = '',//大类别的全部名称
                            warSItem = '',//小类别的全部名称
                            warMSItem = '',//更小类别的全部名称
                            warMMSItem = '',
                            warSBox = '',//定义一个放所有小类别的容器
                            warMSBox = '',
                            warMMSBox = '',
                            lists = opt.responseObject.responseData.data_list;
                        for(var i = 0;i<lists.length;i++){
                            //将大地区的名称进行保存
                            warBItem +='<li data-warBId="'+lists[i].id+'" data-warId="'+lists[i].id+'" data-parentId="'+lists[i].parentId+'" data-fullPath="'+lists[i].propertyFullPath+'" data-proId="'+lists[i].propertyId+'">'+lists[i].propertyName+'</li>';
                            if(lists[i].property_2){
                                warSItem = '';
                                for(var j = 0;j<lists[i].property_2.length;j++){
                                        warSItem +='<li data-warSId="'+lists[i].property_2[j].id+'" data-warId="'+lists[i].property_2[j].id+'" data-parentId="'+lists[i].property_2[j].parentId+'" data-fullPath="'+lists[i].property_2[j].propertyFullPath+'" data-proId="'+lists[i].property_2[j].propertyId+'">'+lists[i].property_2[j].propertyName+'</li>';
                                    if(lists[i].property_2[j].property_3){
                                        warMSItem = '';
                                        for(var z= 0;z<lists[i].property_2[j].property_3.length;z++){
                                            warMSItem +='<li data-warSId="'+lists[i].property_2[j].property_3[z].id+'" data-parentId="'+lists[i].property_2[j].property_3[z].parentId+'" data-warId="'+lists[i].property_2[j].property_3[z].id+'" data-fullPath="'+lists[i].property_2[j].property_3[z].propertyFullPath+'" data-proId="'+lists[i].property_2[j].property_3[z].propertyId+'">'+lists[i].property_2[j].property_3[z].propertyName+'</li>';
                                            if(lists[i].property_2[j].property_3[z].property_4){
                                                warMMSItem = '';
                                                for(var n= 0;n<lists[i].property_2[j].property_3[z].property_4.length;n++){
                                                    warMMSItem +='<li data-parentId="'+lists[i].property_2[j].property_3[z].property_4[n].parentId+'" data-warId="'+lists[i].property_2[j].property_3[z].property_4[n].id+'" data-fullPath="'+lists[i].property_2[j].property_3[z].property_4[n].propertyFullPath+'" data-proId="'+lists[i].property_2[j].property_3[z].property_4[n].propertyId+'">'+lists[i].property_2[j].property_3[z].property_4[n].propertyName+'</li>';
                                                }
                                            }
                                            warMMSBox += '<ul class="divNam ev-warMMSBox ev-warItem" data-parentId="'+lists[i].property_2[j].property_3[z].id+'" style="display: none">'+warMMSItem+'</ul>'
                                        }
                                    }
                                    warMSBox +='<ul class="divNam ev-warMSBox ev-warItem" data-parentId="'+lists[i].property_2[j].id+'" style="display: none">'+warMSItem+'</ul>'
                                }
                            }
                            warSBox += '<ul class="divNam ev-warSBox ev-warItem" data-parentId="'+lists[i].id+'" style="display: none">'+warSItem+'</ul>';
                        }
                        $(".ev-warSel").append("<div class='divisionName'><ul class='ev-warBItem ev-warItem'>"+warBItem+"</ul></div>");
                        $(".ev-warSel").append("<div class='divisionName ev-warSItem' style='display: none'>"+warSBox+"</div>");
                        $(".ev-warSel").append("<div class='divisionName ev-warMSItem' style='display: none'>"+warMSBox+"</div>");
                        $(".ev-warSel").append("<div class='divisionName ev-warMMSItem' style='display: none'>"+warMMSBox+"</div>");
                        //在上一步时将保存的赛区和专业的信息进行填充
                        if(t.param.divInfo.div!=''){
                            $(".ev-divCli .textVal").text(t.param.divInfo.war);
                        }
                        if(t.param.divInfo.div!=''){
                            $(".ev-warCli .textVal").text(t.param.divInfo.div);
                        }
                    });
                }
                //在上一步时将保存的赛区和专业的信息进行填充
                if(t.param.divInfo.div!=''){
                    $(".ev-divCli .textVal").text(t.param.divInfo.war);
                }
                if(t.param.divInfo.div!=''){
                    $(".ev-warCli .textVal").text(t.param.divInfo.div);
                }
                //点击专业
                $(".ev-warCli").on("click", function () {
                    if(t.param.warFlag==0){
                        //将类型进行隐藏
                        t.param.divFlag = 0;
                        $(".ev-divSel").hide();
                        t.param.warFlag = 1;
                        $(".ev-warSel").show();

                    }else{
                        t.param.warFlag = 0;
                        $(".ev-warSel").hide();
                    }
                    //点击X时进行隐藏
                    $(".ev-warSel .divisionClose").on("click", function () {
                        t.param.warFlag = 0;
                        $(".ev-warSel").hide();
                    });
                    //点击大小地区时进行Tab切换显示
                    //大地区的点击时
                });
                //专业分类点击
                $(".ev-warBItem li").on("click", function () {
                    t.param.divId.war = $(this).attr("data-fullPath");
                    $(this).addClass("acti").siblings().removeClass("acti");//将点击的li进行样式的增加
                    //点击大地区时将小地区和更小地区的选中状态删除，控制nav是否可点击
                    $(".ev-warSBox li").removeClass("acti");
                    $(".ev-warMSBox li").removeClass("acti");
                    //将点击的内容进行填充
                    switch (t.param.warThird){
                        case 1:
                            $('.ev-warCli .textVal').text(comm.getStrLen($(this).text(), 28));
                            $(".ev-warSel").hide();
                            t.param.warFlag = 0;
                            warActive = 1;
                            checkAll();
                            break;
                        case 2:
                            if($(".ev-warSItem .ev-warSBox[data-parentId='"+$(this).attr("data-warBid")+"']").children("li").length==0){
                                $('.ev-warCli .textVal').text(comm.getStrLen($(this).text(), 28));
                                $(".ev-warSel").hide();
                                t.param.warFlag = 0;
                                warActive = 1;
                            }else{
                                $('.ev-warCli .textVal').text(comm.getStrLen($(this).text(), 14));
                                $(".ev-warBItem").hide();
                                $(".ev-warList").find("li").eq(1).addClass("active").siblings().removeClass("active");
                                $(".ev-warSItem").show();
                                $(".ev-warSItem .ev-warSBox[data-parentId='"+$(this).attr("data-warBid")+"']").show().siblings().hide();
                                warActive = 0;
                            }
                            checkAll();
                            break;
                        case 3:
                            if($(".ev-warSItem .ev-warSBox[data-parentId='"+$(this).attr("data-warBid")+"']").children("li").length==0){
                                $('.ev-warCli .textVal').text(comm.getStrLen($(this).text(), 28));
                                $(".ev-warSel").hide();
                                t.param.warFlag = 0;
                                warActive = 1;
                            }else{
                                $('.ev-warCli .textVal').text(comm.getStrLen($(this).text(), 10));
                                $(".ev-warBItem").hide();
                                $(".ev-warList").find("li").eq(1).addClass("active").siblings().removeClass("active");
                                $(".ev-warSItem").show();
                                $(".ev-warSItem .ev-warSBox[data-parentId='"+$(this).attr("data-warBid")+"']").show().siblings().hide();
                                warActive = 0;
                            }
                            checkAll();
                            break;
                        case 4:
                            if($(".ev-warSItem .ev-warSBox[data-parentId='"+$(this).attr("data-warBid")+"']").children("li").length==0){
                                $('.ev-warCli .textVal').text(comm.getStrLen($(this).text(), 28));
                                $(".ev-warSel").hide();
                                t.param.warFlag = 0;
                                warActive = 1;
                            }else{
                                $('.ev-warCli .textVal').text(comm.getStrLen($(this).text(), 10));
                                $(".ev-warBItem").hide();
                                $(".ev-warList").find("li").eq(1).addClass("active").siblings().removeClass("active");
                                $(".ev-warSItem").show();
                                $(".ev-warSItem .ev-warSBox[data-parentId='"+$(this).attr("data-warBid")+"']").show().siblings().hide();
                                warActive = 0;
                            }
                            checkAll();
                            break;
                    }
                    //控制parentId进行显示某个小地区
                });
                //术士的点击，将带有acti类的节点的内容取出来+点击的内容
                $(".ev-warSBox li").on("click", function () {
                    t.param.divId.war = $(this).attr("data-fullPath");
                    $(".ev-warMSBox li").removeClass("acti");
                    $(this).addClass("acti").siblings().removeClass("acti");//将点击的li进行样式的增加
                    switch (t.param.warThird){
                        case 2:
                            $('.ev-warCli .textVal').text(comm.getStrLen($(".ev-warBItem li[class=acti]").text(), 14)+'/'+comm.getStrLen($(this).text(), 14));
                            $(".ev-warSel").hide();
                            t.param.warFlag = 0;
                            warActive = 1;
                            checkAll();
                            break;
                        case 3:
                            $(".ev-warBItem").hide();
                            if($(".ev-warMSItem .ev-warMSBox[data-parentId='"+$(this).attr("data-warSId")+"']").children("li").length==0){
                                $('.ev-warCli .textVal').text(comm.getStrLen($(".ev-warBItem li[class=acti]").text(), 14)+'/'+comm.getStrLen($(this).text(), 14));
                                $(".ev-warSel").hide();
                                t.param.warFlag = 0;
                                warActive = 1;
                            }else{
                                $('.ev-warCli .textVal').text(comm.getStrLen($(".ev-warBItem li[class=acti]").text(), 10)+'/'+comm.getStrLen($(this).text(), 10));
                                $(".ev-warSItem").hide();
                                $(".ev-warList").find("li").eq(2).addClass("active").siblings().removeClass("active");
                                $(".ev-warMSItem").show();
                                $(".ev-warMSItem .ev-warMSBox[data-parentId='"+$(this).attr("data-warSId")+"']").show().siblings().hide();
                                warActive = 0;
                            }
                            checkAll();
                            break;
                        case 4:
                            $(".ev-warBItem").hide();
                            if($(".ev-warMSItem .ev-warMSBox[data-parentId='"+$(this).attr("data-warSId")+"']").children("li").length==0){
                                $('.ev-warCli .textVal').text(comm.getStrLen($(".ev-warBItem li[class=acti]").text(), 14)+'/'+comm.getStrLen($(this).text(), 14));
                                $(".ev-warSel").hide();
                                t.param.warFlag = 0;
                                warActive = 1;
                            }else{
                                $('.ev-warCli .textVal').text(comm.getStrLen($(".ev-warBItem li[class=acti]").text(), 10)+'/'+comm.getStrLen($(this).text(), 10));
                                $(".ev-warSItem").hide();
                                $(".ev-warList").find("li").eq(2).addClass("active").siblings().removeClass("active");
                                $(".ev-warMSItem").show();
                                $(".ev-warMSItem .ev-warMSBox[data-parentId='"+$(this).attr("data-warSId")+"']").show().siblings().hide();
                                warActive = 0;
                            }
                            checkAll();
                            break;
                    }
                });
                //术士的点击，将带有acti类的节点的内容取出来+点击的内容
                $(".ev-warMSBox li").on("click", function () {
                    t.param.divId.war = $(this).attr("data-fullPath");
                    $(this).addClass("acti").siblings().removeClass("acti");//将点击的li进行样式的增加
                    $(".ev-warMMSBox li").removeClass("acti");
                    switch (t.param.warThird){
                        case 3:
                            $('.ev-warCli .textVal').text(comm.getStrLen($(".ev-warBItem li[class=acti]").text(), 10)+'/'+comm.getStrLen($(".ev-warSItem li[class=acti]").text(), 10)+'/'+comm.getStrLen($(this).text(), 10));
                            $(".ev-warSel").hide();
                            t.param.warFlag = 0;
                            warActive = 1;
                            checkAll();
                            break;
                        case 4:
                            if($(".ev-warMMSItem .ev-warMMSBox[data-parentId='"+$(this).attr("data-warSId")+"']").children("li").length==0){
                                $('.ev-warCli .textVal').text(comm.getStrLen($(".ev-warBItem li[class=acti]").text(), 10)+'/'+comm.getStrLen($(".ev-warSItem li[class=acti]").text(), 10)+'/'+comm.getStrLen($(this).text(), 10));
                                $(".ev-warSel").hide();
                                t.param.warFlag = 0;
                                warActive = 1;
                            }else{
                                $('.ev-warCli .textVal').text(comm.getStrLen($(".ev-warBItem li[class=acti]").text(), 10)+'/'+comm.getStrLen($(".ev-warSItem li[class=acti]").text(), 10)+'/'+comm.getStrLen($(this).text(), 10));
                                $(".ev-warMSItem").hide();
                                $(".ev-warList").find("li").eq(3).addClass("active").siblings().removeClass("active");
                                $(".ev-warMMSItem").show();
                                $(".ev-warMMSItem .ev-warMMSBox[data-parentId='"+$(this).attr("data-warSId")+"']").show().siblings().hide();
                                warActive = 0;
                            }
                            checkAll();
                            break;
                    }

                });
                //术士的点击，将带有acti类的节点的内容取出来+点击的内容
                $(".ev-warMMSBox li").on("click", function () {
                    t.param.divId.war = $(this).attr("data-fullPath");
                    $('.ev-warCli .textVal').text(comm.getStrLen($(".ev-warBItem li[class=acti]").text(), 10)+'/'+comm.getStrLen($(".ev-warSItem li[class=acti]").text(), 10)+'/'+comm.getStrLen($(".ev-warMSItem li[class=acti]").text(), 10)+'/'+comm.getStrLen($(this).text(), 10));
                    $(this).addClass("acti").siblings().removeClass("acti");//将点击的li进行样式的增加
                    $(".ev-warSel").hide();
                    t.param.warFlag = 0;
                    warActive = 1;
                    checkAll()
                });
                $(".ev-warBNav").on("click", function () {
                    $(this).addClass("active").siblings().removeClass("active");
                    $(".ev-warBItem").show();
                    $(".ev-warSItem").hide();
                    $(".ev-warMSItem").hide();
                    $(".ev-warMMSItem").hide();
                });
                //如果点击大地区里面已经有被选项，则小地区可以被点击
                $(".ev-warSNav").on("click", function () {
                    var parId = $(".ev-warBItem li[class=acti]").attr('data-warId');
                    if($(".ev-warBItem li[class=acti]").length!=0&&$('.ev-warSBox li[data-parentid='+parId+']').length>0){
                        $(this).addClass("active").siblings().removeClass("active");
                        $(".ev-warSItem").show();
                        $(".ev-warBItem").hide();
                        $(".ev-warMSItem").hide();
                        $(".ev-warMMSItem").hide();
                    }
                });
                //更小地区导航点击
                $(".ev-warSMNav").on("click", function () {
                    var parId = $(".ev-warSItem li[class=acti]").attr('data-warId');
                    if($(".ev-warSItem li[class=acti]").length!=0&&$('.ev-warMSBox li[data-parentid='+parId+']').length>0){
                        $(this).addClass("active").siblings().removeClass("active");
                        $(".ev-warSItem").hide();
                        $(".ev-warBItem").hide();
                        $(".ev-warMSItem").show();
                        $(".ev-warMMSItem").hide();
                    }
                });
                //更小地区导航点击
                $(".ev-warSMMNav").on("click", function () {
                    var parId = $(".ev-warMSItem li[class=acti]").attr('data-warId');
                    if($(".ev-warSItem li[class=acti]").length!=0&&$('.ev-warMMSBox li[data-parentid='+parId+']').length>0){
                        $(this).addClass("active").siblings().removeClass("active");
                        $(".ev-warSItem").hide();
                        $(".ev-warBItem").hide();
                        $(".ev-warMSItem").hide();
                        $(".ev-warMMSItem").show();
                    }
                });
                var warArr = t.param.divId.war.split(",");
                if(warArr!=''){
                    for(var n = 0;n<warArr.length;n++){
                        for(var k = 0;k<$(".ev-warItem li").length;k++){
                            if($(".ev-warItem li").eq(k).attr("data-warId")==warArr[n]){
                                $(".ev-warItem li").eq(k).addClass("acti").click();
                            }
                        }
                    }
                }
                var divArr = t.param.divId.div.split(",");
                if(divArr!=''){
                    for(var n = 0;n<divArr.length;n++){
                        for(var k = 0;k<$(".ev-divItem li").length;k++){
                            if($(".ev-divItem li").eq(k).attr("data-divId")==divArr[n]){
                                $(".ev-divItem li").eq(k).addClass("acti").click();
                            }
                        }
                    }
                }
                switch (t.param.divThird){
                    case 0:
                        divActive = 1;
                        break;
                    case 1:
                        if($(".ev-divBItem li[class=acti]").length!=0){
                            divActive = 1;
                        }
                        break;
                    case 2:
                        if($(".ev-divSBox li[class=acti]").length!=0){
                            divActive = 1;
                        }
                        break;
                    case 3:
                        if($(".ev-divMSBox li[class=acti]").length!=0){
                            divActive = 1;
                        }
                        break;
                }
                switch (t.param.warThird){
                    case 0:
                        warActive = 1;
                        break;
                    case 1:
                        if($(".ev-warBItem li[class=acti]").length!=0){
                            warActive = 1;
                        }
                        break;
                    case 2:
                        if($(".ev-warMSBox li[class=acti]").length!=0){
                            warActive = 1;
                        }
                        break;
                    case 3:
                        if($(".ev-warMSBox li[class=acti]").length!=0){
                            warActive = 1;
                        }
                        break;
                }
                //判断下一步是否可以点击
                function checkAll(){
                    if(divActive==1&&warActive==1){
                    // if(divActive==1){
                        $(".ev-actNextBtn").show();
                        $(".ev-actNext").hide();
                        var property = {},
                            property_area = {},
                            property_5 = {
                                property_name:{},
                                property_id_list:{},
                                property_full_path:{}
                            },//存放赛区
                            property_6 = {
                                property_name:{},
                                property_id_list:{},
                                property_full_path:{}
                            };//存放类别
                        //如果有一级类别---类别。
                        if($(".ev-warBItem li[class=acti]").text()){
                            property.property_1=[
                                {
                                    "propertyName": $(".ev-warBItem li[class=acti]").text(),
                                    "parentId": "0",
                                    "propertyFullPath": $(".ev-warBItem li[class=acti]").attr("data-fullPath"),
                                    "propertyId": $(".ev-warBItem li[class=acti]").attr("data-proId"),
                                }
                            ];
                            property_6.property_name.property_name_1 = $(".ev-warBItem li[class=acti]").text();
                            property_6.property_id_list.property_id_list_1 = $(".ev-warBItem li[class=acti]").attr("data-proId");
                            property_6.property_full_path.property_full_path_1 = $(".ev-warBItem li[class=acti]").attr("data-warId")
                        }
                        //如果有二级类别
                        if($(".ev-warSItem li[class=acti]").text()){
                            property.property_2=[
                                {
                                    "propertyName": $(".ev-warSItem li[class=acti]").text(),
                                    "parentId": $(".ev-warSItem li[class=acti]").attr("data-parentId"),
                                    "propertyFullPath": $(".ev-warSItem li[class=acti]").attr("data-fullPath"),
                                    "propertyId": $(".ev-warSItem li[class=acti]").attr("data-proId"),
                                }
                            ];
                            property_6.property_name.property_name_2=$(".ev-warSItem li[class=acti]").text();
                            property_6.property_id_list.property_id_list_2 = $(".ev-warSItem li[class=acti]").attr("data-proId");
                            property_6.property_full_path.property_full_path_2 = $(".ev-warSItem li[class=acti]").attr("data-warId")
                        }
                        //如果有三级类别
                        if($(".ev-warMSItem li[class=acti]").text()){
                            property.property_3=[
                                {
                                    "propertyName": $(".ev-warMSItem li[class=acti]").text(),
                                    "parentId": $(".ev-warMSItem li[class=acti]").attr("data-parentId"),
                                    "propertyFullPath": $(".ev-warMSItem li[class=acti]").attr("data-fullPath"),
                                    "propertyId": $(".ev-warMSItem li[class=acti]").attr("data-proId")
                                }
                            ];
                            property_6.property_name.property_name_3=$(".ev-warMSItem li[class=acti]").text();
                            property_6.property_id_list.property_id_list_3 = $(".ev-warMSItem li[class=acti]").attr("data-proId");
                            property_6.property_full_path.property_full_path_3 = $(".ev-warMSItem li[class=acti]").attr("data-warId")
                        }
                        //如果有四级类别
                        if($(".ev-warMMSItem li[class=acti]").text()){
                            property.property_4=[
                                {
                                    "propertyName": $(".ev-warMMSItem li[class=acti]").text(),
                                    "parentId": $(".ev-warMMSItem li[class=acti]").attr("data-parentId"),
                                    "propertyFullPath": $(".ev-warMMSItem li[class=acti]").attr("data-fullPath"),
                                    "propertyId": $(".ev-warMMSItem li[class=acti]").attr("data-proId")
                                }
                            ];
                            property_6.property_name.property_name_4=$(".ev-warMMSItem li[class=acti]").text();
                            property_6.property_id_list.property_id_list_4 = $(".ev-warMMSItem li[class=acti]").attr("data-proId");
                            property_6.property_full_path.property_full_path_4 = $(".ev-warMMSItem li[class=acti]").attr("data-warId")
                        }
                        t.param.property = property;
                        t.param.propertyAll_6 = property_6;
                        if($(".ev-divBItem li[class=acti]").text()){
                            property_area.property_area_1=[
                                {
                                    "propertyName": $(".ev-divBItem li[class=acti]").text(),
                                    "parentId": "0",
                                    "propertyFullPath": $(".ev-divBItem li[class=acti]").attr("data-fullPath"),
                                    "propertyId": $(".ev-divBItem li[class=acti]").attr("data-proId")
                                }
                            ];
                            property_5.property_name.propertyName_1 = $(".ev-divBItem li[class=acti]").text();
                            property_5.property_id_list.property_id_list_1 = $(".ev-divBItem li[class=acti]").attr("data-proId");
                            property_5.property_full_path.property_full_path_1 = $(".ev-divBItem li[class=acti]").attr("data-divId");
                        }
                        if($(".ev-divSBox li[class=acti]").text()){
                            property_area.property_area_2=[
                                {
                                    "propertyName": $(".ev-divSBox li[class=acti]").text(),
                                    "parentId": $(".ev-divSBox li[class=acti]").attr("data-parentId"),
                                    "propertyFullPath": $(".ev-divSBox li[class=acti]").attr("data-fullPath"),
                                    "propertyId": $(".ev-divSBox li[class=acti]").attr("data-proId")
                                }
                            ];
                            property_5.property_name.propertyName_2 = $(".ev-divSBox li[class=acti]").text();
                            property_5.property_id_list.property_id_list_2 = $(".ev-divSBox li[class=acti]").attr("data-proId");
                            property_5.property_full_path.property_full_path_2 = $(".ev-divSBox li[class=acti]").attr("data-divId");
                        }
                        if($(".ev-divMSBox li[class=acti]").text()){
                            property_area.property_area_3=[
                                {
                                    "propertyName":$(".ev-divMSBox li[class=acti]").text(),
                                    "parentId": $(".ev-divMSBox li[class=acti]").attr("data-parentId"),
                                    "propertyFullPath": $(".ev-divMSBox li[class=acti]").attr("data-fullPath"),
                                    "propertyId": $(".ev-divMSBox li[class=acti]").attr("data-proId")
                                }
                            ];
                            property_5.property_name.propertyName_3 = $(".ev-divMSBox li[class=acti]").text();
                            property_5.property_id_list.property_id_list_3 = $(".ev-divMSBox li[class=acti]").attr("data-proId");
                            property_5.property_full_path.property_full_path_3 = $(".ev-divMSBox li[class=acti]").attr("data-divId");
                        }
                        if($(".ev-divMMSBox li[class=acti]").text()){
                            property_area.property_area_4=[
                                {
                                    "propertyName":$(".ev-divMMSBox li[class=acti]").text(),
                                    "parentId": $(".ev-divMMSBox li[class=acti]").attr("data-parentId"),
                                    "propertyFullPath": $(".ev-divMMSBox li[class=acti]").attr("data-fullPath"),
                                    "propertyId": $(".ev-divMMSBox li[class=acti]").attr("data-proId")
                                }
                            ];
                            property_5.property_name.propertyName_4 = $(".ev-divMMSBox li[class=acti]").text();
                            property_5.property_id_list.property_id_list_4 = $(".ev-divMMSBox li[class=acti]").attr("data-proId");
                            property_5.property_full_path.property_full_path_4 = $(".ev-divMMSBox li[class=acti]").attr("data-divId");
                        }
                        t.param.property_area = property_area;
                        t.param.propertyAll_5 = property_5;
                        if($(".ev-actNextBtn").text().indexOf("上传")!=-1){
                            t.upload();
                        }
                    }else{
                        $(".ev-actNextBtn").hide();
                        $(".ev-actNext").show();
                    }
                }
                t.activityStep();
            },
            //上传类型
            uploadType: function () {
                var t = this;
                if($(".signUpBackground")&&$(".signUpBackground").length>0){
                    $(".signUpBackground").remove();
                }
                //如果上传是一种类型（1为一种类型）
                if(t.param.uploadOne==1){
                    //如果只上传一种资源，直接将页数进行增加
                    t.param.stepNum++;
                    //判断下一步内容
                    if(parseInt(t.actArr[t.param.stepNum])){
                        switch (t.actArr[t.param.stepNum]){
                            //基本信息
                            case 1:
                                t.actCusInfo();
                                break;
                            //如果第二步是地区选择
                            case 2:
                                t.divOrbus();
                                break;
                            case 3:
                                t.divOrbus();
                                break;
                        }
                    }
                }else{
                    $("body").append(t.template.business);
                }
                //如果第一步为上传资源类型
                $(".ev-sourceCli li").on("click", function () {
                    t.param.stepNum++;
                    t.param.actType = $(this).attr("data-type");
                    //点击类型后进行专业和术士的选择
                    switch (parseInt(t.actArr[parseInt($.inArray(4, t.actArr))+1])){
                        //基本信息
                        case 1:
                            t.actCusInfo();
                            break;
                        //如果第二步是地区选择
                        case 2:
                            t.divOrbus();
                            break;
                        case 3:
                            t.divOrbus();
                            break;
                    }
                    //如果到上传资源时就没有下一步了 则直接进入发布资源
                    if(!parseInt(t.actArr[parseInt($.inArray(4, t.actArr))+1])){
                        switch (parseInt(t.param.actType)){
                            case 1://视频发布
                                module.videoUpload({
                                    videoBtn:$(".ev-actUpOneBtn"),
                                    //needAuth:1,
                                    activityId: t.param.activityId,//是否PK上传
                                    property:t.param.property,//活动时选择的专业和术式
                                    property_area:t.param.property_area,//新版活动赛区参数
                                    publishBack:function(){//发布成功回调
                                        $(".signUpBackground").remove();
                                        t.actArr=[];
                                        t.param.stepNum=0;
                                        if($(".textColorYesOne").text().indexOf("我的作品")>-1){
                                            if(comm.myWorks){
                                                comm.myWorks();
                                            }
                                        }
                                    }
                                });
                                break;
                            case 2://文库发布
                                module.docUpload({
                                    docBtn: $(".ev-actUpOneBtn"),
                                    activityId: t.param.activityId,//是否PK上传
                                    property:t.param.property,//活动时选择的专业和术式
                                    property_area:t.param.property_area,//新版活动赛区参数
                                    publishBack:function(){//发布成功回调
                                        $(".signUpBackground").remove();
                                        t.actArr=[];
                                        t.param.stepNum=0;
                                        if($(".textColorYesOne").text().indexOf("我的作品")>-1){
                                            if(comm.myWorks){
                                                comm.myWorks();
                                            }
                                        }
                                    }
                                });
                                break;
                            case 4://话题发布
                                module.topicUpload({
                                    topicBtn: $(".ev-actUpOneBtn"),
                                    activityId: t.param.activityId,//是否PK上传
                                    property:t.param.property,//活动时选择的专业和术式
                                    property_area:t.param.property_area,//新版活动赛区参数
                                    publishBack:function(){//发布成功回调
                                        $(".signUpBackground").remove();
                                        t.actArr=[];
                                        t.param.stepNum=0;
                                        if($(".textColorYesOne").text().indexOf("我的作品")>-1){
                                            if(comm.myWorks){
                                                comm.myWorks();
                                            }
                                        }
                                    }
                                });
                                break;
                            case 7://病例发布
                                $(".ev-actUpOneBtn").on("click", function () {
                                    if(!$.isEmptyObject(t.param.property_area)){
                                        TempCache.setItem("activityProperty_area",JSON.stringify(t.param.property_area));
                                    }
                                    if(!$.isEmptyObject(t.param.property)){
                                        TempCache.setItem("activityProperty",JSON.stringify(t.param.property));
                                    }
                                    var href = "/pages/singlePage/upload-case.html?activityId="+$("#activityId").val();
                                    if($("#activityId").val()=="1513149467288"){// 线下：1509331335386  线上：1513149467288
                                        href="/pages/singlePage/upload-activityCase.html?activityId="+$("#activityId").val();
                                    }
                                    comm.ieAlert(href);
                                });
                                //module.caseUpload({
                                //    caseBtn:$(".ev-actUpOneBtn"),//创建点击btn
                                //    //needAuth:1,
                                //    activityId: t.param.activityId,//是否PK上传
                                //    property:t.param.property,//活动时选择的专业和术式
                                //    property_area:t.param.property_area,//新版活动赛区参数
                                //    publishBack:function(){//发布成功回调
                                //        $(".signUpBackground").remove();
                                //        t.actArr=[];
                                //        t.param.stepNum=0;
                                //        if($(".textColorYesOne").text().indexOf("我的作品")>-1){
                                //            if(comm.myWorks){
                                //                comm.myWorks();
                                //            }
                                //        }
                                //    }
                                //});
                                break;
                        }
                        $(".ev-actUpOneBtn").click();
                    }
                })
            },
            //判断基本信息下一步按钮是否可以点击
            checkActive: function () {
                var t = this;
                var inputVali = 1, actEmail = 0, actPhone = 0, divVali = 1,actHospital = 1,actName = 1;
                //初始判断是否按钮可点击,姓名医院职称必须填写，邮箱和电话进行判断。
                // TODO:2019/06/25 当未配置邮箱/手机号且默认进来时即为可以提交状态，则进行判断如果没有配置邮箱/手机号则将校验通过
                if($(".ev-actName").val()!=''&&$(".ev-actHospital").val()!=''&&$(".actTitle").find("div").text()!=''){
                    if($(".ev-actEmail").length==0 || ($(".ev-actEmail").length!=0&&/^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test($(".ev-actEmail").val()))){
                        actEmail = 1;
                        $(".ev-actEmail").next(".errorTip").hide();
                        $(".ev-actEmail").parent(".formCont").removeClass("actError");
                    }else{
                        actEmail = 0;
                        $(".ev-actEmail").parent(".formCont").addClass("actError");
                        $(".ev-actEmail").next(".errorTip").show();
                        $(".ev-actEmail").next(".errorTip").text("请填写正确的邮箱");
                    }
                    if($(".ev-actPhone").length==0 ||($(".ev-actPhone").length!=0&&/^1\d{10}$/.test($(".ev-actPhone").val()))){
                        actPhone = 1;
                        $(".ev-actPhone").next(".errorTip").hide();
                        $(".ev-actPhone").parent(".formCont").removeClass("actError");
                    }else{
                        actPhone = 0;
                        $(".ev-actPhone").next(".errorTip").show();
                        $(".ev-actPhone").next(".errorTip").text("请填写正确的手机号码");
                        $(".ev-actPhone").parent(".formCont").addClass("actError");
                    }
                    allCheck();
                }
                //判断职称是否可以校验通过
                if($(".actTitle").find("div").text()!=''){
                    divVali = 1
                }else{
                    divVali = 0
                }
                //所有input框的blur事件
                $("input").on("blur", function () {
                    if($(this).val()!=''){
                        inputVali = 1;
                    }else{
                        inputVali = 0;
                    }
                    allCheck();
                });
                //在keyup后判断是否可以激活按钮
                $("input").on("keyup", function () {
                    if($(".ev-actEmail").length!=0){
                        if(/^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test($(".ev-actEmail").val())){
                            actEmail = 1;
                            $(".ev-actEmail").parent(".formCont").removeClass("actError");
                            $(".ev-actEmail").next(".errorTip").hide();
                        }else{
                            actEmail = 0;
                            $(".ev-actEmail").parent(".formCont").addClass("actError");
                            $(".ev-actEmail").next(".errorTip").show();
                            $(".ev-actEmail").next(".errorTip").text("请填写正确的邮箱");
                        }
                    }else{
                        actEmail = 1;
                    }
                    if($(".ev-actPhone").length!=0){
                        if($(".ev-actPhone").val()&&/^1\d{10}$/.test($(".ev-actPhone").val())){
                            actPhone = 1;
                            $(".ev-actPhone").parent(".formCont").removeClass("actError");
                            $(".ev-actPhone").next(".errorTip").hide();
                        }else{
                            actPhone = 0;
                            $(".ev-actPhone").parent(".formCont").addClass("actError");
                            $(".ev-actPhone").next(".errorTip").show();
                            $(".ev-actPhone").next(".errorTip").text("请填写正确的手机号码");
                        }
                    }else{
                        actPhone = 1;
                    }
                    //医院存在并且过长
                    if($(".ev-actHospital").length!=0){
                        if($(".ev-actHospital").val().length>200){
                            $(".ev-actHospital").parent(".formCont").addClass("actError");
                            actHospital=0;
                            $(".ev-actHospital").next(".errorTip").show();
                            $(".ev-actHospital").next(".errorTip").text("医院最大长度200个字符");
                        }else if($(".ev-actHospital").val().length<=0){
                            $(".ev-actHospital").parent(".formCont").addClass("actError");
                            actHospital=0;
                            $(".ev-actHospital").next(".errorTip").show();
                            $(".ev-actHospital").next(".errorTip").text("请填写医院");
                        }else{
                            actHospital=1;
                            $(".ev-actHospital").parent(".formCont").removeClass("actError");
                            $(".ev-actHospital").next(".errorTip").hide();
                        }
                    }else{
                        actHospital=1;
                    }
                    //姓名校验
                    if($(".ev-actName").length!=0){
                        if($(".ev-actName").val().length>50){
                            $(".ev-actName").parent(".formCont").addClass("actError");
                            $(".ev-actName").next(".errorTip").show();
                            $(".ev-actName").next(".errorTip").text("您的姓名过长");
                            actName=0;
                        }else if(!/^[\u4e00-\u9fa5\s\.-]{1,25}$|^[\@A-Za-z_\s\.-]{1,50}$/.test($(".ev-actName").val())){
                            $(".ev-actName").parent(".formCont").addClass("actError");
                            $(".ev-actName").next(".errorTip").show();
                            $(".ev-actName").next(".errorTip").text("您的姓名？");
                            actName=0;
                        }else{
                            actName=1;
                            $(".ev-actName").next(".errorTip").hide();
                            $(".ev-actName").parent(".formCont").removeClass("actError");
                        }
                    }else{
                        actName=1;
                    }
                    allCheck();
                });
                //职称点击确定取消时会出现空白状态
                $(".ev-medSave,.ev-medCancel,.ev-medCancel").on("click", function () {
                    if($(".actTitle").find("div").text()!=''){
                        divVali = 1;
                        $(".actTitle").removeClass("actError");
                        $(".actTitle .errorTip").hide();
                    }else{
                        divVali = 0;
                        $(".actTitle").addClass("actError");
                        $(".actTitle .errorTip").show();
                        $(".actTitle .errorTip").text("请选择职称")
                    }
                    allCheck()
                });
                //校验所有的输入
                function allCheck(){
                    if(inputVali==1&&divVali==1&&actEmail==1&&actPhone==1&&actName==1&&actHospital==1){
                        $(".ev-actNextBtn").show();
                        $(".ev-actNext").hide();
                    }else{
                        $(".ev-actNextBtn").hide();
                        $(".ev-actNext").show();
                    }
                }

            },
            actAsync : function(url,params,callback){ // 异步获取数据
                comm.LightBox.showloading();
                $.ajax({
                    url : PC_CALL+url,
                    type : "POST",
                    async:false,
                    dataType : "json",
                    data : params,
                    success : function(data){
                        comm.LightBox.hideloading();
                        callback(data);
                    },
                    error : function(){
                        comm.LightBox.hideloading();
                    }
                });
            },
            //取消报名
            cancle:function(){
                var t = this;
                $("html").on("click",$(".ev-actCancle"),function (e) {
                    e=e||window.event;
                    if($(e.target).hasClass("ev-actCancle")){
                        var html = '<div class="warningBg"><section class="al-msgDeleteModal ev-makeSurePopup" id="ev-makeSurePopup" style="z-index: 8">'+
                            '<h2>删除资料<i class="icon-close ev-makeCancel"></i></h2>'+
                            '<section class="al-msgDeleteContent"><i class="al-iconAsk"></i>'+
                            '<article><span>取消报名将删除所填信息，</span><br/><span>是否确认取消</span></article>'+
                            '</section>'+
                            '<section class="signUpPbtn">'+
                            '<button class="al-msgDeleteConfirm ev-makeSure">去意已决</button>'+
                            '<button class="al-msgDeleteCancel ev-makeCancel">考虑一下</button>'+
                            '</section>'+
                            '</section></div>';
                        $("body").append(html);
                        $(".ev-makeCancel").on("click",function(){
                            $('.ev-makeSurePopup').remove();
                            $(".warningBg").css("display","none");
                        })
                        $(".ev-makeSure").on("click",function(){
                            $('.ev-makeSurePopup').remove();
                            $(".signUpBackground").remove();
                            $(".warningBg").css("display","none");
                            t.template.divOrbus = ''//将结构进行置空
                            t.param.stepNum=0;
                            t.actArr=[];
                        })
                    }
                })
            },
            //上传文件
            upload: function () {
                var t = this;
                switch (parseInt(t.param.actType)){
                    case 1://视频发布
                        module.videoUpload({
                            videoBtn:$(".ev-actNextBtn"),
                            activityId: t.param.activityId,//是否PK上传
                            property:t.param.property,//活动时选择的专业和术式
                            property_area:t.param.property_area,//新版活动赛区参数
                            publishBack:function(){//发布成功回调
                                $(".signUpBackground").remove();
                                t.actArr=[];
                                t.param.stepNum=0;
                                if($(".textColorYesOne").text().indexOf("我的作品")>-1){
                                    if(comm.myWorks){
                                        comm.myWorks();
                                    }
                                }
                            }
                        });
                        break;
                    case 2://文库发布
                        module.docUpload({
                            docBtn: $(".ev-actNextBtn"),
                            activityId: t.param.activityId,//是否PK上传
                            property:t.param.property,//活动时选择的专业和术式
                            property_area:t.param.property_area,//新版活动赛区参数
                            publishBack:function(){//发布成功回调
                                $(".signUpBackground").remove();
                                t.actArr=[];
                                t.param.stepNum=0;
                                if($(".textColorYesOne").text().indexOf("我的作品")>-1){
                                    if(comm.myWorks){
                                        comm.myWorks();
                                    }
                                }
                            }
                        });
                        break;
                    case 4://话题发布
                        module.topicUpload({
                            topicBtn: $(".ev-actNextBtn"),
                            activityId: t.param.activityId,//是否PK上传
                            property:t.param.property,//活动时选择的专业和术式
                            property_area:t.param.property_area,//新版活动赛区参数
                            publishBack:function(){//发布成功回调
                                $(".signUpBackground").remove();
                                t.actArr=[];
                                t.param.stepNum=0;
                                if($(".textColorYesOne").text().indexOf("我的作品")>-1){
                                    if(comm.myWorks){
                                        comm.myWorks();
                                    }
                                }
                            }
                        });
                        break;
                    case 7://病例发布
                        $(".ev-actNextBtn").on("click", function () {
                            if(!$.isEmptyObject(t.param.property_area)){
                                TempCache.setItem("activityProperty_area",JSON.stringify(t.param.property_area));
                            }
                            if(!$.isEmptyObject(t.param.property)){
                                TempCache.setItem("activityProperty",JSON.stringify(t.param.property));
                            }
                            if(!$.isEmptyObject(t.param.property_area)||!$.isEmptyObject(t.param.property)){
                                t.saveProperty();
                            }
                            var href = "/pages/singlePage/upload-case.html?activityId="+$("#activityId").val();
                            if($("#activityId").val()=="1513149467288"){// 线下：1509331335386  线上：1513149467288
                                href="/pages/singlePage/upload-activityCase.html?activityId="+$("#activityId").val();
                            }
                            comm.ieAlert(href);
                        });
                        //module.caseUpload({
                        //    caseBtn:$(".ev-actNextBtn"),//创建点击btn
                        //    activityId: t.param.activityId,//是否PK上传
                        //    property: t.param.property,//活动时选择的专业和术式
                        //    property_area:t.param.property_area,//新版活动赛区参数
                        //    publishBack:function(){//发布成功回调
                        //        $(".signUpBackground").remove();
                        //        t.actArr=[];
                        //        t.param.stepNum=0;
                        //        if($(".textColorYesOne").text().indexOf("我的作品")>-1){
                        //            if(comm.myWorks){
                        //                comm.myWorks();
                        //            }
                        //        }
                        //    }
                        //});
                        break;
                }
            },
            scoreAlert: function () {//评分弹窗提醒
                var t = this;
                if($("#sesCustomerId").val()&&$("#activityId").attr("expert")==1&&$("#activityId").attr("isReviewBegin")==1){
                    var url=document.URL;
                    var alertPop={};
                    var str,item;
                    if(url.lastIndexOf("?")>0){
                        str=url.substring(url.lastIndexOf("?")+1,url.length);
                        var arr=str.split("#");
                        item =  arr[0].split("=");
                        alertPop[item[0]] = decodeURI(item[1]);
                    }
                    if((!alertPop.isformPer&&alertPop.isformPer!=1)&&$(".bgColorYesOne").text()!="待评作品"){//表示不是从个人中心页跳转过来的,并且页面不是在待评作品上
                        if($.cookie("newIsClose") != 'yes'){//表示没有关闭弹层的提示
                            $.ajax({
                                url: t.path.reviewCount,
                                type:"POST",
                                data:{paramJson: $.toJSON({
                                    customerId:$("#sesCustomerId").val(),
                                    activityId:$("#activityId").val(),
                                    firstResult:0,
                                    maxResult:100,
                                    refType: 0,
                                    resourceStatus:1
                                })},
                                dataType:"json",
                                success:function(data){
                                    if(data&&data.responseObject&&data.responseObject.resourceCount>0){
                                        var items = data.responseObject.resourceCount;
                                        $(".score_reminder_mask").remove();
                                        $(".al-mainInner").append('<div class="score_reminder_mask"><section class="score_reminder"><h3>'+$("title").text()+'</h3><p>亲爱的评委，您尚有'+items+'个作品待审核，请尽快完成~</p><div class="btn_box"><button class="btn_cancel">稍后再说</button><button class="btn_ensure">前往打分</button></div></section></div>');
                                        $("body").css("overflow","hidden");
                                        $(".btn_cancel").on("click",function(){
                                            $(".score_reminder_mask").remove();
                                            $("body").css("overflow","auto");
                                        });
                                        $(".btn_ensure").off("click").on("click",function(){
                                            $.each($(".spTemp_total_nav_lists li span"),function(i,el){//将打分项进行追加
                                                if($(el).text()=="待评作品"){
                                                    $(this).click();
                                                    $(".score_reminder_mask").remove();
                                                    $("body").css("overflow","auto");
                                                }
                                            });
                                        })
                                    }
                                    $.cookie("newIsClose",'yes',{ expires:1});      //一天
                                }
                            });
                        }
                    }
                }
            }
        };
        Competition.init();
    });