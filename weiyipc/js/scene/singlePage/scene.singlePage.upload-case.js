/**
 * Created by zhanghongda on 2017/8/17.
 */
$(function () {
    var uploadCase = {
        config:{
            passFlag:true,
            heigh:0,hasSup:0,//标示补充资料
            videoLen:1,//最大上传视频数
            imgLen:40,//最大上传照片数
            editorId:0
        },
        path:{
            videoInfo: PC_CALL+"qiniu/storage/saveVideoInfo/",//保存视频
            caseCreate: PC_CALL+"case_baseinfo/create/",//创建
            caseUpdate: PC_CALL+"case_baseinfo/update/",//病例基本信息保存
            //caseInfo: PC_CALL+"case_baseinfo/getMapById/",//获取病例信息
            caseInfo: PC_CALL+"case_baseinfo/getMapByDraft/",//获取病例信息
            caseDelete: PC_CALL+"case_baseinfo/deleteAll/",//删除病例
            //caseSupSave: PC_CALL+"case_supplement/save/",//补充信息保存
            caseAttList: PC_CALL+"case_attachment/json_list/",
            caseAttCreate: PC_CALL+"case_attachment/upload/",
            caseAttDelete: PC_CALL+"case_attachment/delete/",
            caseRemind: PC_CALL+"customer/unite/json_list/",//提醒谁看
            getToken:PC_CALL+"qiniu/storage/getQiniuToken/"
        },
        init: function () {
            var t = this;
            t.caseId='';
            t.deleteAttIds="";//存放删除的图片id
            t.imgLen=0;//已上传文件个数
            t.videoLen=0;
            t.sortId=0;
            t.para=comm.getpara();
            t.flag={};
            t.checkLogin();
            t.options = {};
        },
        checkLogin: function () {
            var t = this;
            user.login({
                callback:function(){
                    $(".option textarea").textareaAutoHeight({minHeight:26,maxHeight:189});
                    if(t.para.caseId){//表示为编辑病例
                        t.caseId = t.para.caseId;
                        t.editCase();//编辑病例
                        $(".ev-uploadImgPar ul").attr("caseid",t.caseId);
                    }else {
                        comm.ajax.async(t.path.caseCreate, '', function (data) {//创建病例Id
                            if (data.responseObject.responseStatus) {
                                t.caseId = data.responseObject.responsePk;
                                $(".ev-uploadImgPar ul").attr("caseid", t.caseId);
                                t.ulpoadImg();
                                t.uploadVideoBind();
                                t.checkActive();//验证是否可以发布
                            }
                        });
                    }
                    t.caseInfo();//病例资料
                    t.submitBtn();//发布按钮点击
                    t.remind();//提醒谁看
                },
                scene:privilegeSceneConst.eSceneTypePublic,
                onAuthCancel:"back"
            })
        },
        checkActive: function () {//验证是否可以激活按钮+右侧导航
            var t = this;
            $.each($("textarea"), function (i, el) {
                var num = $(el).parents(".option").find('b').text();
                comm.textChangeNew({//新版病例发布倒记数功能
                    $tex:$(el),//输入框
                    $num:$(el).parents(".option").find('b'),//存放数字的元素
                    judgmentCE:0,//需要中英文区分 默认0
                    inputIng:function(){

                    },//输入中回调函数
                    inputFinish:function(){

                    },//输入完成回调函数
                    inputSurpass:function(){
                        $(el).addClass('error');
                        t.config.passFlag = false;
                        if($(".ev-caseInfoUp").text()=="收起"&&$(".supplement").css("display")!="none"){
                            t.config.heigh = $(el).parents(".option").offset().top-90-150;
                        }else{
                            t.config.heigh = $(el).parents(".option").offset().top-90;
                        }
                        t.errorPop('不能超过'+num+'个字');
                    }//输入超出回调函数
                });
            });
            $("textarea").on("keyup", function () {
                $.each($("textarea"), function (i, el) {
                    if($(el).val()!=''){
                        t.flag.areaFlag = true;
                        return false;
                    }else{
                        t.flag.areaFlag  = false;
                    }
                });
                t.checkAll();
            });
            t.writeAge($("#age"));
            t.writeAge($("#month"));
            t.writeAge($("#day"));
            //$(".years input").on("keydown",function(){//输入年龄时
            //    $(this).val($(this).val().replace(/\D|^0/g,''));
            //});
            $(".years input").on("keyup",function(){//输入年龄时
                var aStr = $("#age").val();
                if(aStr!=""&&aStr>=0&&aStr<=5){
                    $("#month").attr("disabled",false).parents("p").removeClass("default");
                    $("#day").attr("disabled",false).parents("p").removeClass("default");
                    //$.each($(".years input"), function (i, el) {
                    //    if($(el).val()!=''){
                    //        t.flag.inpFlag = true;
                    //    }else{
                    //        t.flag.inpFlag = false;
                    //    }
                    //});
                    t.flag.inpFlag = true;
                }else{
                    $("#month").attr("disabled",true);
                    $("#day").attr("disabled",true);
                    $("#month").parents("p").addClass("default");
                    $("#day").parents("p").addClass("default");
                    if($("#age").val()!=''){
                        t.flag.inpFlag = true;
                    }else{
                        t.flag.inpFlag = false;
                    }
                    $("#month").val("");
                    $("#day").val("");
                    t.flag.inpFlag = true;
                }
                t.checkAll();
            });
            $(".ev-sex .male").on("click",function(){//性别的点击
                t.flag.malFlag = true;
                $.each($(".ev-sex .male"), function () {
                    $(this).removeClass("active");
                });
                $(this).addClass("active");
                $(".ev-sex").removeClass("error");
                t.checkAll();
            });
            $("textarea,.years input").on('focus', function () {//聚焦进行加入效果
                $.each($(".option"), function () {
                    $(this).removeClass('active');
                });
                $(this).parents(".option").addClass('active');
                $(this).parents(".option").removeClass('error')
            });
            $("textarea,.years input").on('blur', function () {//失去焦点进行移除
                $.each($(".option"), function () {
                    $(this).removeClass('active');
                });
            });
            $(".uploadNavCont li").on("click", function () {//点击右侧导航进行定位
                $(this).addClass("active").siblings().removeClass("active");
                $(window).scrollTop($("."+$(this).attr("data-dom")).offset().top-90);
            });
            $(window).on("scroll", function () {
                var h = $(window).scrollTop(),caseH = $(".ev-caseInfo").offset().top-90,imgH = $(".ev-imageInfo").offset().top-90;
                if(h<caseH){
                    $('.uploadNavCont li[data-dom="ev-essentialInfor"]').addClass("active").siblings().removeClass("active");
                }
                if(h<imgH&&h>caseH){//当病例信息到达顶部，滚动的高度在病例信息和图像信息中间
                    $('.uploadNavCont li[data-dom="ev-caseInfo"]').addClass("active").siblings().removeClass("active");
                }
                if(imgH<=h){
                    $('.uploadNavCont li[data-dom="ev-imageInfo"]').addClass("active").siblings().removeClass("active");
                }
            })
        },
        //年龄处理
        writeAge:function(obj){
            obj.keydown(change).keyup(change).change(change)
            obj[0].onpaste=change;
            function change(){
                obj.val(obj.val().replace(/[^\d]/g,''));
                if(obj.val().length!=0){
                    /*if($("#age").val()>120){
                     $("#age").val($("#age").val().substring(0,2));
                     }*/
                    if(obj.val()==0){
                        obj.val(0);
                    }
                }

            };
        },
        checkAll: function () {//验证输入框内容，将发布按钮进行激活
            var t = this;
            if(t.flag.areaFlag||t.flag.inpFlag||t.flag.malFlag||t.flag.atNameFlag||t.flag.uploadFlag||t.flag.upImgFlag||t.flag.upVideoFlag){
                $(".uploadCont").addClass("active");
            }else{
                $(".uploadCont").removeClass("active");
            }
        },
        caseInfo:function(){//补充资料交互
            $(".ev-DIYcase").on("click", function () {//自定义表单项点击
                $(".supplement").show();
                $(this).hide();
                $('.nonEssential').hide();
            });
            $(".ev-caseInfoUp").on("click", function () {//补充资料的点击
                $(".supplement").removeClass("uploadFixed");
                $(".ev-fixedContent").css("height",0);
                $(".supplement ul").toggle();
                if($(".supplement ul").css("display")=="none"){
                    $(this).text("展开");
                }else{
                    $(this).text("收起");
                }
            });
            $('.supplement li').on('click', function () {
                var name  = $(this).text();
                if($(this).hasClass("active")){
                    $.each($(".nonEssential"), function (i, e) {
                        if($(e).find(".titleText").text()==name){
                            $(this).hide();
                        }
                    });
                }else{
                    $.each($(".nonEssential"), function (i, e) {
                        if($(e).find(".titleText").text()==name){
                            $(this).show();
                        }
                    });
                }
                $(this).toggleClass("active");
            });
            $(window).on("scroll", function () {//页面滚动时候进行补充资料+影像信息的置顶
                var h = $(window).scrollTop();
                if($('.supplement').css("display")=="block"&&$('.ev-caseInfoUp').text()=="收起"){
                    if(h>$('.ev-caseInfo').find(".title").offset().top-40&&h<$('.ev-imageInfo').find(".title").offset().top-200){
                        $('.uploadStandardCont').removeClass("uploadFixed");
                        $(".ev-fixedContent").css("height",150);
                        $('.supplement').addClass("uploadFixed");
                    }else if(h>$('.ev-imageInfo').find(".title").offset().top-40){
                        $(".ev-fixedContent").css("height",0);
                        $('.supplement').removeClass("uploadFixed");
                        $('.uploadStandardCont').addClass("uploadFixed")
                    }else{
                        $(".ev-fixedContent").css("height",0);
                        $('.supplement').removeClass("uploadFixed");
                        $('.uploadStandardCont').removeClass("uploadFixed");
                    }
                }else{
                    if(h>$('.ev-imageInfo').find(".title").offset().top-40){
                        $('.uploadStandardCont').addClass("uploadFixed");
                    }else{
                        $('.uploadStandardCont').removeClass('uploadFixed')
                    }
                }
            })
        },
        submitBtn: function () {
            var t = this;
            $('.uploadCaseError').hide();
            $('.ev-submitBtn').off("click").on('click', function () {//按钮点击
                if(TempCache.getItem("userId")){
                    if($('.uploadCont').hasClass('active')&&t.config.offClick!=false){//如果按钮是激活状态
                        t.isdraft = '';
                        var name='';
                        function checkMust(dom){//此段代码感觉太脆弱。。。顺序是倒叙，先检查后面的必填项
                            if($.trim(dom.find("textarea").val())==''){//体格检查
                                name = '请填写'+dom.find(".titleText").text();
                                dom.addClass("error");
                                if($(".ev-caseInfoUp").text()=="收起"&&$(".supplement").css("display")!="none"){
                                    t.config.heigh = dom.offset().top-90-150;
                                }else{
                                    t.config.heigh = dom.offset().top-90;
                                }
                            }else{
                                dom.removeClass("error");
                            }
                        }
                        checkMust($(".ev-caseCheck"));//体格检查
                        checkMust($(".ev-caseHos"));//现病史
                        checkMust($(".ev-caseMain"));//主诉
                        if($.trim($(".ev-caseAge #age").val())==''){//年龄
                            $(".ev-caseAge").addClass("error");
                            name = '请填写'+$(".ev-caseAge .titleText").text();
                            if($(".ev-caseInfoUp").text()=="收起"&&$(".supplement").css("display")!="none"){
                                t.config.heigh = $(".ev-caseAge").offset().top-90-150;
                            }else{
                                t.config.heigh = $(".ev-caseAge").offset().top-90;
                            }
                        }else if($(".ev-caseAge #age").val()<=5&&$(".ev-caseAge #age").val()>0){
                            if($("#month").val()==''){
                                $(".ev-caseAge").addClass("error");
                                name = "病人年龄中月数必填!";
                                if($(".ev-caseInfoUp").text()=="收起"&&$(".supplement").css("display")!="none"){
                                    t.config.heigh = $(".ev-caseAge").offset().top-90-150;
                                }else{
                                    t.config.heigh = $(".ev-caseAge").offset().top-90;
                                }
                            }else if(($("#month").val()<0||$("#month").val()>12)){
                                $(".ev-caseAge").addClass("error");
                                name = "病人年龄中月在0~12月之间!";
                                if($(".ev-caseInfoUp").text()=="收起"&&$(".supplement").css("display")!="none"){
                                    t.config.heigh = $(".ev-caseAge").offset().top-90-150;
                                }else{
                                    t.config.heigh = $(".ev-caseAge").offset().top-90;
                                }
                            }
                            if($("#day").val()!=''&&($("#day").val()<1||$("#day").val()>28)){
                                $(".ev-caseAge").addClass("error");
                                name ="病人年龄中天数在1~28天之间!";
                                if($(".ev-caseInfoUp").text()=="收起"&&$(".supplement").css("display")!="none"){
                                    t.config.heigh = $(".ev-caseAge").offset().top-90-150;
                                }else{
                                    t.config.heigh = $(".ev-caseAge").offset().top-90;
                                }
                            }
                        }else if($(".ev-caseAge #age").val()==0){
                            if($("#day").val()==''){
                                $(".ev-caseAge").addClass("error");
                                name ="病人年龄中天数必填!";
                                if($(".ev-caseInfoUp").text()=="收起"&&$(".supplement").css("display")!="none"){
                                    t.config.heigh = $(".ev-caseAge").offset().top-90-150;
                                }else{
                                    t.config.heigh = $(".ev-caseAge").offset().top-90;
                                }
                            }else if($("#day").val()<1||$("#day").val()>28){
                                $(".ev-caseAge").addClass("error");
                                name ="病人年龄中天数在1~28天之间!";
                                if($(".ev-caseInfoUp").text()=="收起"&&$(".supplement").css("display")!="none"){
                                    t.config.heigh = $(".ev-caseAge").offset().top-90-150;
                                }else{
                                    t.config.heigh = $(".ev-caseAge").offset().top-90;
                                }
                            }
                            if($("#month").val()!=''&&($("#month").val()<0||$("#month").val()>12)){
                                $(".ev-caseAge").addClass("error");
                                name = "病人年龄中月在0~12月之间!";
                                if($(".ev-caseInfoUp").text()=="收起"&&$(".supplement").css("display")!="none"){
                                    t.config.heigh = $(".ev-caseAge").offset().top-90-150;
                                }else{
                                    t.config.heigh = $(".ev-caseAge").offset().top-90;
                                }
                            }
                        }else if($(".ev-caseAge #age").val()<0||$(".ev-caseAge #age").val()>120){
                            $(".ev-caseAge").addClass("error");
                            name ="病人年龄在0~120之间!";
                            if($(".ev-caseInfoUp").text()=="收起"&&$(".supplement").css("display")!="none"){
                                t.config.heigh = $(".ev-caseAge").offset().top-90-150;
                            }else{
                                t.config.heigh = $(".ev-caseAge").offset().top-90;
                            }
                        }else{
                            $(".ev-caseAge").removeClass("error");
                        }
                        $.each($(".ev-caseMale .male"), function (i, e) {
                            if($(".ev-caseMale .male").hasClass("active")){//性别
                                $(".ev-caseMale").removeClass("error");
                                return false;
                            }else{
                                $(".ev-caseMale").addClass("error");
                                name = '请填写'+$(".ev-caseMale .titleText").text();
                                if($(".ev-caseInfoUp").text()=="收起"&&$(".supplement").css("display")!="none"){
                                    t.config.heigh = $(".ev-caseMale").offset().top-90-150;
                                }else{
                                    t.config.heigh = $(".ev-caseMale").offset().top-90;
                                }
                            }
                        });
                        checkMust($(".ev-caseTitle"));//标题
                        $.each($(".ev-must"), function (i, e) {//用来存放报错信息的名称
                            if($(e).hasClass('error')){
                                t.config.passFlag = false;
                                t.errorPop(name);//错误提示
                                return false;
                            }else{
                                t.config.passFlag = true;
                            }
                        });
                        if(t.config.passFlag){//如果必填项均填写完成便可以进行发布
                            t.config.offClick = false;
                            t.publicVideo();//发布视频，如果视频存在并且发布成功之后进行发布病例
                            t.saveDraft();//保存草稿
                        }
                    }
                }else{
                    g_sps.jump(null,"/");
                }
            });
            t.saveDraft();//保存草稿
            $('.ev-caseCancel').on("click", function () {
                t.isdraft = '';
                //事件埋点
                comm.creatEvent({
                    triggerType:"全站功能按钮点击",
                    keyword:"取消",
                    browType:83,
                    actionId:45
                });
                if($('.uploadCont').hasClass('active')){//确认放弃本地编辑吗
                    $(".editorPupop").show();
                    $(".save").off("click").on("click", function () {
                        $(".editorPupop").hide();
                        t.isdraft=1;
                        t.publicVideo();//病例保存草稿
                        history.back(-1);
                    });
                    $(".enter").on("click", function () {
                        $(".editorPupop").hide();
                        //事件埋点
                        comm.creatEvent({
                            triggerType:"全站功能按钮点击",
                            keyword:"病例发布取消",
                            browType:83,
                            actionId:45
                        });
                        history.back(-1);
                    });
                    $(".closeIcon i").on("click", function () {
                        $(".editorPupop").hide();
                    })
                }else{
                    comm.creatEvent({
                        triggerType:"全站功能按钮点击",
                        keyword:"取消",
                        browType:83,
                        actionId:45
                    });
                    history.back(-1);
                }
            })
        },
        editCase: function () {//病例编辑
            var t = this;
            $(".uploadCont").addClass("active");//编辑病例时候将发布按钮进行激活   （如果是编辑病例，则一些内容都是存在的）
            t.flag.atNameFlag = true;
            if(t.para.isDraft==1){//如果是编辑的就不可以保存草稿，如果是从草稿箱中进来编辑可以保存草稿
                $(".saveDraft").show();
                $(".save").show();
                $('.editorBtn').removeClass("btnCenter");
            }else{
                $(".saveDraft").hide();
                $(".save").hide();
                $('.editorBtn').addClass("btnCenter");
            }
            var t = this,data={},param={};
            data.caseId= t.para.caseId;
            data.caseId = t.caseId;
            data.logoUseFlag=UseFlag.c;
            data.attUseFlag=AttUseFlag.g;
            param.paramJson= $.toJSON(data);
            comm.ajax.async(t.path.caseInfo,param, function (data) {//首次进来时进行铺数据
                if(data.responseObject.responseData.data_list){
                    if(data.responseObject.responseData&&data.responseObject.responseData.data_list.length>0){
                        var dataList = data.responseObject.responseData.data_list[0];
                        t.config.editorId = dataList.case_supplement.id;//数据库中的id
                        var videoCont=[];var caseCont=[];
                        videoCont=dataList.case_video_url_list_1.concat(dataList.case_video_url_list_2).concat(dataList.case_video_url_list_3);
                        caseCont=dataList.case_att_url_list_1.concat(dataList.case_att_url_list_2).concat(dataList.case_att_url_list_3);
                        t.getImgList(caseCont);
                        t.getVideoList(videoCont);
                        var caseBaseInfo = dataList.case_baseinfo;//基本信息
                        var caseSupInfo = dataList.case_supplement;//附加信息
                        $('#case_name').val(caseBaseInfo.caseName);//标题
                        $('#main_narrate').val(caseBaseInfo.mainNarrate);//主诉
                        $('#illness_history').val(caseBaseInfo.illnessHistory);//现病史
                        $('#discussion').val(caseBaseInfo.discussion);//讨论（非必填项）
                        $('#professional_checking').val(caseBaseInfo.professionalChecking);//体格检查
                        $('#age').val(caseBaseInfo.age);//年龄
                        if($('#age').val()<=5&&$('#age').val()!=''&&$('#age').val()>=0){
                            $("#month").attr("disabled",false);
                            $("#day").attr("disabled",false);
                            $("#month").parents("p").removeClass("default");
                            $("#day").parents("p").removeClass("default");
                        }
                        $('#month').val(caseBaseInfo.ageMonth);//月份
                        $('#day').val(caseBaseInfo.ageDay);//天数
                        $('.male[data-type='+caseBaseInfo.sexId+']').addClass('active');//性别
                        $('#past_history').val(caseSupInfo.pastHistory);//既往史
                        $('#personal_history').val(caseSupInfo.personalHistory);//个人史
                        $('#family_history').val(caseSupInfo.familyHistory);//家族史
                        $('#auxiliary_info').val(caseSupInfo.auxiliaryInfo);//辅助检查
                        $('#diagnosis_info').val(caseSupInfo.diagnosisInfo);//诊断&鉴别诊断
                        $('#treatment_record').val(caseSupInfo.treatmentRecord);//治疗过程
                        $('#operation_name').val(caseSupInfo.operationName);//手术名称
                        $('#intraoperative_info').val(caseSupInfo.intraoperativeInfo);//手术记录
                        $('#product_info').val(caseSupInfo.productInfo);//产品信息
                        //if(dataList.case_remind_list!=''){
                        //    var atHtml = '';
                        //    $.each(dataList.case_remind_list, function (i, e) {
                        //        atHtml += '<span class="atPersonal ev-atPerson" data-customer="'+dataList.case_remind_list[i].customerId+'" style="margin-right: 20px;">'+dataList.case_remind_list[i].lastName+''+dataList.case_remind_list[i].firstName+'</span>'
                        //    });
                        //    $('.atNameText').append(atHtml);
                        //}
                        //$.each($("textarea"), function (i, el) {
                        //    var num = $(el).parents(".option").find('b').text();
                        //    if($(el).val()!=''){
                        //        $(el).parents(".option").find('b').text(num-$(el).val().length);
                        //    }
                        //});
                        $(".option textarea").focus();
                        $(document).scrollTop(0);
                        t.checkActive();//验证是否可以发布
                    }
                }
            });
        },
        publicCase: function () {//发布病例+图片
            var t = this;
            var caseAttachmentParam='';
            var data1={};
            var params = {};
            data1.caseId= t.caseId;
            data1.caseName= $.trim($("#case_name").val()).replace(/</g,'&lt;').replace(/>/g,'&gt;');
            data1.age=$.trim($("#age").val());
            data1.ageMonth=$.trim($("#month").val());
            data1.ageDay=$.trim($("#day").val());
            data1.mainNarrate=$.trim($("#main_narrate").val()).replace(/</g,'&lt;').replace(/>/g,'&gt;');
            data1.illnessHistory=$.trim($("#illness_history").val()).replace(/</g,'&lt;').replace(/>/g,'&gt;');
            data1.professionalChecking=$.trim($("#professional_checking").val()).replace(/</g,'&lt;').replace(/>/g,'&gt;');
            data1.discussion=$.trim($("#discussion").val()).replace(/</g,'&lt;').replace(/>/g,'&gt;');
            data1.platformId= $.trim($("#sesDepartment").val());
            if(t.para.tId){//从标签专题页带过来的标签id;
                data1.propertyIdList= t.para.tId;
            }
            $.each($(".male"), function (i, e) {
                if($(e).hasClass("active")){
                    data1.sexId=$(e).attr("data-type");//性别
                }
            });
            data1.caseAttachmentParam=caseAttachmentParam.substring(0,caseAttachmentParam.length-1);
            if(t.videoListId){
                data1.deleteVideoIds=t.videoListId.substring(0,t.videoListId.length-1);
            }
            if(t.customerIds){
                data1.refCustomerIdList= t.customerIds.substring(0,t.customerIds.length-1);
            }
            //TODO 新版活动报名添加赛区和类别的参数
            if(t.para.activityId){
                if(TempCache.getItem("activityProperty")){
                    data1.property= JSON.parse(TempCache.getItem("activityProperty"));
                }
                if(TempCache.getItem("activityProperty_area")){
                    data1.property_area= JSON.parse(TempCache.getItem("activityProperty_area"));
                }
            }
            if(t.para.caseId&&t.isdraft!=1){//如果是修改病例
                data1.moidfyTime=1;
            }else{
                //TODO 活动ID
                data1.activityId= t.para.activityId?t.para.activityId:"";
            }
            if(t.para.tId){//从标签专题页带过来的标签id;
                data1.propertyIdList= t.para.tId;//从标签专题页带过来的标签id;
            }
            //if(t.para.isDraft==1){
            //    data1.deleteFlag=1;
            //}
            if(t.isdraft==1){//如果是保存草稿
                data1.isValid=0;
                data1.isDraft=1;
            }else{
                data1.isValid=1;
                data1.isDraft=0;
            }
            data1.deleteFlag=1;
            $.each($('.ev-uploadImgLi'), function (i, el) {//上传图片或视频
                var case_category_id='';
                var case_att_name='';
                case_category_id=$(this).attr("listId")+"☆"+$(this).attr("casecategoryId");
                if($(el).find(".case_att_name").val()){
                    case_att_name="☆"+$(el).find(".case_att_name").val();
                }
                case_category_id+=case_att_name;
                caseAttachmentParam+=case_category_id+",";
            });
            if($(".ev-atPerson").length>0){//@某人
                t.customerIds="";
                $.each($(".ev-atPerson"), function (i,em) {
                    t.customerIds+=$(em).attr("data-customer")+",";
                    data1.refCustomerIdList= t.customerIds.substring(0,t.customerIds.length-1);
                });
            }
            t.deleteAttIds && (data1.deleteAttIds= t.deleteAttIds.substring(0,t.deleteAttIds.length-1));
            data1.caseAttachmentParam=caseAttachmentParam.substring(0,caseAttachmentParam.length-1);
            data1.id = t.config.editorId;
            data1.caseId= t.caseId;
            if(t.isdraft==1){
                data1.isDraft=1;
            }else{
                data1.isDraft=0;
            }
            checkDom($("#past_history"), function () {
                data1.pastHistory= $.trim($("#past_history").val()).replace(/</g,'&lt;').replace(/>/g,'&gt;');
            }, function () {
                data1.pastHistory='';
            });
            checkDom($("#personal_history"), function () {
                data1.personalHistory=$.trim($("#personal_history").val()).replace(/</g,'&lt;').replace(/>/g,'&gt;');
            }, function () {
                data1.personalHistory='';
            });
            checkDom($("#family_history"), function () {
                data1.familyHistory=$.trim($("#family_history").val()).replace(/</g,'&lt;').replace(/>/g,'&gt;');
            }, function () {
                data1.familyHistory='';
            });
            checkDom($("#auxiliary_info"), function () {
                data1.auxiliaryInfo=$.trim($("#auxiliary_info").val()).replace(/</g,'&lt;').replace(/>/g,'&gt;');
            }, function () {
                data1.auxiliaryInfo='';
            });
            checkDom($("#diagnosis_info"), function () {
                data1.diagnosisInfo=$.trim($("#diagnosis_info").val()).replace(/</g,'&lt;').replace(/>/g,'&gt;');
            }, function () {
                data1.diagnosisInfo='';
            });
            checkDom($("#treatment_record"), function () {
                data1.treatmentRecord=$.trim($("#treatment_record").val()).replace(/</g,'&lt;').replace(/>/g,'&gt;');
            }, function () {
                data1.treatmentRecord='';
            });
            checkDom($("#operation_name"), function () {
                data1.operationName=$.trim($("#operation_name").val()).replace(/</g,'&lt;').replace(/>/g,'&gt;');
            }, function () {
                data1.operationName='';
            });
            checkDom($("#intraoperative_info"), function () {
                data1.intraoperativeInfo=$.trim($("#intraoperative_info").val()).replace(/</g,'&lt;').replace(/>/g,'&gt;');
            }, function () {
                data1.intraoperativeInfo='';
            });
            checkDom($("#product_info"), function () {
                data1.productInfo=$.trim($("#product_info").val()).replace(/</g,'&lt;').replace(/>/g,'&gt;');
            }, function () {
                data1.productInfo='';
            });
            function checkDom(dom,callback,cllbackNull){
                if(dom.parents(".nonEssential").css("display")!='none'){
                    callback();
                }else{
                    cllbackNull();
                }
            }
            params.paramJson = $.toJSON(data1);
            comm.ajax.async(t.path.caseUpdate,params,function(rep){
                if(rep.responseObject.responseStatus){//如果上传成功
                    var supParams={};
                    var data={};
                    //$.each($(".nonEssential"), function (i, e) {//判断是否有补充资料
                    //    if($(e).css("display")=="block"&&$(e).find("textarea").val()!=''){
                    //        t.flag.hasNon = 1;//用来表示有没有补充资料如果有，则为1
                    //        return false;
                    //    }else{
                    //        t.flag.hasNon = 0;
                    //    }
                    //});
                    //if(t.flag.hasNon==1){//表示有补充资料
                    //    data.id = t.config.editorId;
                    //    data.caseId= t.caseId;
                    //    if(t.isdraft==1){
                    //        data.isDraft=1;
                    //    }else{
                    //        data.isDraft=0;
                    //    }
                    //    checkDom($("#past_history"), function () {
                    //        data.pastHistory=$("#past_history").val();
                    //    }, function () {
                    //        data.pastHistory='';
                    //    });
                    //    checkDom($("#personal_history"), function () {
                    //        data.personalHistory=$("#personal_history").val();
                    //    }, function () {
                    //        data.personalHistory='';
                    //    });
                    //    checkDom($("#family_history"), function () {
                    //        data.familyHistory=$("#family_history").val();
                    //    }, function () {
                    //        data.familyHistory='';
                    //    });
                    //    checkDom($("#auxiliary_info"), function () {
                    //        data.auxiliaryInfo=$("#auxiliary_info").val();
                    //    }, function () {
                    //        data.auxiliaryInfo='';
                    //    });
                    //    checkDom($("#diagnosis_info"), function () {
                    //        data.diagnosisInfo=$("#diagnosis_info").val();
                    //    }, function () {
                    //        data.diagnosisInfo='';
                    //    });
                    //    checkDom($("#treatment_record"), function () {
                    //        data.treatmentRecord=$("#treatment_record").val();
                    //    }, function () {
                    //        data.treatmentRecord='';
                    //    });
                    //    checkDom($("#operation_name"), function () {
                    //        data.operationName=$("#operation_name").val();
                    //    }, function () {
                    //        data.operationName='';
                    //    });
                    //    checkDom($("#intraoperative_info"), function () {
                    //        data.intraoperativeInfo=$("#intraoperative_info").val();
                    //    }, function () {
                    //        data.intraoperativeInfo='';
                    //    });
                    //    checkDom($("#product_info"), function () {
                    //        data.productInfo=$("#product_info").val();
                    //    }, function () {
                    //        data.productInfo='';
                    //    });
                    //    function checkDom(dom,callback,cllbackNull){
                    //        if(dom.parents(".nonEssential").css("display")!='none'){
                    //            callback();
                    //        }else{
                    //            cllbackNull();
                    //        }
                    //    }
                    //    supParams.paramJson= $.toJSON(data);
                    //    comm.ajax.async(t.path.caseSupSave,supParams, function (rep) {
                    //        if(t.isdraft==1){//表示是保存草稿
                    //            //$.topTip({mark:"success",content:"保存草稿成功！审核通过后可在“个人中心-主页”查看~"});
                    //        }else{
                    //            $.topTip({mark:"success",content:"发布成功！审核通过后可在“我的-贡献”查看~"});
                    //        }
                    //    });
                    //}else{
                    //    if(t.isdraft==1){//表示是保存草稿
                    //        //$.topTip({mark:"success",content:"保存草稿成功！审核通过后可在“个人中心-主页”查看~"});
                    //    }else{
                    //        $.topTip({mark:"success",content:"发布成功！审核通过后可在“我的-贡献”查看~"});
                    //    }
                    //}
                    //t.config.offClick = true;
                    if(t.isdraft==1){//如果是保存草稿则不跳转
                        t.config.offClick = true;
                        if(TempCache.getItem("activityProperty_area")){//发布成功后将数据进行删除
							TempCache.removeItem("activityProperty_area");
                        }
                        if(TempCache.getItem("activityProperty")){
							TempCache.removeItem("activityProperty");
                        }
                    }else{
                        if(rep.responseObject.responseData.case_baseinfo){
                            url=rep.responseObject.responseData.case_baseinfo.pageStoragePath;
                        }else{
                            url="/";
                        }
                        $.topTip({mark:"success",content:"发布成功！审核通过后可在“我的-贡献”查看~"});
                        g_sps.jump(null,url);
                        //location.reload();
                        if(TempCache.getItem("activityProperty_area")){//发布成功后将数据进行删除
							TempCache.removeItem("activityProperty_area");
                        }
                        if(TempCache.getItem("activityProperty")){
							TempCache.removeItem("activityProperty");
                        }
                        if(t.isdraft==1){
                            //事件埋点
                            comm.creatEvent({
                                triggerType:"发布",
                                refId:t.para.tId?t.para.tId:'',
                                keyword:"保存草稿",
                                actionId: 37
                            });
                        }else{
                            //事件埋点
                            comm.creatEvent({
                                triggerType:"发布",
                                refId:t.para.tId?t.para.tId:'',
                                keyword:"发布病例",
                                actionId: t.para.tId?34:33
                            });
                        }
                    }
                }else{
                    $.topTip({mark:"warn",content:"未发布成功，请稍后再试！"});
                    t.config.offClick = true;
                }
            },false, function (data) {
                t.config.offClick = true;
            })
        },
        publicVideo: function () {//发布视频
            var t = this;
            if(!t.uploadImgStatus){
                t.errorPop("图片上传中请稍候",1);
                t.config.offClick = true;
                return false;
            }
            if(!t.videoUped){//视频已上传完成后才能发布
                t.errorPop("视频上传中请稍候",1);
                t.config.offClick = true;
                return false;
            }
            if(t.uploadImgFail){//有上传失败的图片不让提交发布
                t.errorPop("有上传失败的图片，请处理完成后再发布",1);
                t.config.offClick = true;
                return false;
            }
            if(t.videoLen>0 && t.key>0){//如果存在视频
                var params2 = {};
                var data2 = {};
                data2.key= t.key;
                data2.persistentId= t.persistentId;
                data2.videoName= t.videoName;
                data2.refType=7;
                data2.caseId= t.caseId;
                data2.caseCategoryId=$(".ev-uploadVideoLi").attr("casecategoryid");
                data2.platformId= $("#sesDepartment").val();
                params2.paramJson = $.toJSON(data2);
                comm.ajax.async(t.path.videoInfo,params2, function (rep) {
                    if (!(rep && rep.responseObject.responseStatus)) {
                        if (rep.responseObject.responseMessage) {//没数据的时候不做提示
                            $.topTip({mark: "warn", content: rep.responseObject.responseMessage});
                        }
                    }else{
                        t.publicCase();//发布病例
                    }
                });
            }else{
                t.publicCase();//发布病例
            }
        },
        saveDraft: function () {//保存草稿
            var t = this;
            $(".saveDraft").off("click").on("click", function () {
                if(TempCache.getItem("userId")){
                    if($(".uploadCont").hasClass("active")&& t.config.offClick!=false){
                        t.config.offClick = false;
                        t.isdraft=1;
                        t.publicVideo();//发布病例
                    }
                }else{
                    g_sps.jump(null,"/");
                }
            })
        },
        errorPop:function(text,noScroll){//错误提示
            var t = this;
            if(noScroll){

            }else{
                $('body,html').animate({ scrollTop: t.config.heigh }, 300);
            }
            $('.uploadCaseError').fadeIn(300).find('span').text(text);
            setTimeout(function () {
                $('.uploadCaseError').fadeOut(300);
            },1000);
        },
        remind: function () {//提醒谁看
            var t = this;
            var cpLock = true;
            var param = {};
            var timer = null;
            $(".ev-remind input").on('compositionstart',function(){
                cpLock = false;
            });
            $(".ev-remind input").on('compositionend',function(){
                cpLock = true;
            });
            $(".ev-remind input").on("input propertychange",function(){
                clearTimeout(timer);
                timer=setTimeout(function(){
                    if(cpLock){
                        remindPerson();
                    }
                },500);
            });
            $(".ev-remind input").on("keydown",function(ev){//8:删除
                if($(this).val()==''){
                    if(ev.keyCode=="8"){
                        if($(".ev-atPerson").length>0){
                            $(".ev-atPerson:last").remove();
                            $(".aitNum").text($(".ev-atPerson").length+'/10');
                        }
                        if($(".atNameText").find("span").length<=0){
                            t.flag.uploadFlag = false;
                            t.checkAll();
                        }
                    }
                }
            });
            $(".ev-remind input").on("keyup",function(ev){//8:删除
                if($(this).val()==''){
                    $(".ev-atPosition").hide();
                    $(".ev-atPosition").html('');
                    $(".arrow").hide();
                }
            });
            function remindPerson(){
                if($(".ev-remind input").val()!=''){
                    param.paramJson = $.toJSON({
                        useFlag:3,
                        searchParam:$(".ev-remind input").val(),
                        isCUnite:0,
                        isCStatistics:0,
                        isCFPeople:0,
                        pageIndex:1,
                        pageSize:30,
                        isAuthState:1
                    });
                    comm.ajax.async(t.path.caseRemind,param, function (data) {//数据请求
                        if(data.responseObject.responseStatus){
                            $(".arrow").show();
                            $(".ev-atPosition").show();
                            $(".ev-atPosition").html('');
                            var liHtml = '';
                            var dataList = data.responseObject.responseData.data_list;
                            if(dataList){
                                $.each(dataList, function (i, e) {
                                    liHtml += '<li data-customerId="'+dataList[i].customer_baseinfo.customerId+'"><img src="'+dataList[i].customer_att.logoUrl+'"><span>'+dataList[i].customer_auth.lastName+''+dataList[i].customer_auth.firstName+'</span>'+
                                        '<i>'+dataList[i].customer_auth.company+'</i></li>';
                                })
                                $(".ev-atPosition").append(liHtml);
                                $(".ev-atPosition li").on("click", function () {
                                    if($(".ev-atPerson").length<=9){
                                        $(".ev-remind input").val('');
                                        var customerId = $(this).attr("data-customerId");
                                        var cusName = $(this).find("span").text();
                                        var remindHtml = '<span class="atPersonal ev-atPerson" data-customer="'+customerId+'">@'+cusName+'</span>';
                                        $(".atNameText").append(remindHtml);
                                        $(".ev-atPerson").css("marginRight","20px");
                                        $(".aitNum").text($(".ev-atPerson").length+'/10');
                                    }else{
                                        if($(".ev-caseInfoUp").text()=="收起"&&$(".supplement").css("display")!="none"){
                                            t.config.heigh = $(".ev-remind").offset().top-90-150;
                                        }else{
                                            t.config.heigh = $(".ev-remind").offset().top-90;
                                        }
                                        $(".atContent input").val("");
                                        t.errorPop("@不能超过十人");
                                    }
                                    $(".arrow").hide();
                                    $(".ev-atPosition").hide();
                                    t.flag.uploadFlag = true;//存在@某人
                                    t.checkAll();
                                });
                            }
                            //联想在上方
                            if($(".ev-atPosition").height()>$(window).height()-$(".ev-remind").offset().top+$(window).scrollTop()-90){
                                $(".atContent").addClass("positionTop");
                            }else{
                                $(".atContent").removeClass("positionTop");
                            }
                        }

                    })
                }
            }
        },
        //编辑病例时获取图片
        getImgList:function(data){
            var t=this;
            var html1="",html2="",html3="";
            if(data.length>0){
                $.each(data,function(i,val){
                    if(val.caseCategoryId==1){//治疗前
                        html1+='<li class="imagesUploadBtn ev-uploadImgLi" listId="'+val.id+'" caseCategoryId="'+val.caseCategoryId+'">'+
                            '<div class="imagesUploadPath ev-uploadImgPath"><img src="'+val.attUrl+'"/></div>'+
                            '<figure class="ev-removeImg"><img src="//img10.allinmd.cn/v3/upload_case/close.png"> </figure>'+
                            '<textarea placeholder="请输入图片描述" class="case_att_name">'+val.caseAttName+'</textarea><b class="imageAttNum ev-attNum">100</b>'+
                            '</li>';
                    }else if(val.caseCategoryId==2){//治疗中
                        html2+='<li class="imagesUploadBtn ev-uploadImgLi" listId="'+val.id+'" caseCategoryId="'+val.caseCategoryId+'">'+
                            '<div class="imagesUploadPath ev-uploadImgPath"><img src="'+val.attUrl+'"/></div>'+
                            '<figure class="ev-removeImg"><img src="//img10.allinmd.cn/v3/upload_case/close.png"> </figure>'+
                            '<textarea placeholder="请输入图片描述" class="case_att_name">'+val.caseAttName+'</textarea><b class="imageAttNum ev-attNum">100</b>'+
                            '</li>';
                    }else if(val.caseCategoryId==3){//治疗后
                        html3+='<li class="imagesUploadBtn ev-uploadImgLi" listId="'+val.id+'" caseCategoryId="'+val.caseCategoryId+'">'+
                            '<div class="imagesUploadPath ev-uploadImgPath"><img src="'+val.attUrl+'"/></div>'+
                            '<figure class="ev-removeImg"><img src="//img10.allinmd.cn/v3/upload_case/close.png"> </figure>'+
                            '<textarea placeholder="请输入图片描述" class="case_att_name">'+val.caseAttName+'</textarea><b class="imageAttNum ev-attNum">100</b>'+
                            '</li>';
                    }
                });
                $(".ev-uploadImgPar ul").eq(0).append(html1);
                $(".ev-uploadImgPar ul").eq(1).append(html2);
                $(".ev-uploadImgPar ul").eq(2).append(html3);
                $(".ev-uploadImgLi").each(function(i,em){
                    t.removeImg($(em));
                    comm.textChangeNew({
                        $tex:$(em).find("textarea"),//输入框
                        $num:$(em).find(".ev-attNum"),//存放数字的元素
                        inputIng:function(){
                            $(em).find(".ev-attNum").show();
                        },//输入中回调函数
                        inputFinish:function(){
                            $(em).find(".ev-attNum").hide();
                        },//输入完成回调函数
                        inputSurpass:function(){}//输入超出回调函数
                    });
                })
            }
            t.imgLen=data.length;//已上传文件个数
            t.sortId=data.length;
            var maxNum=t.config.imgLen-t.imgLen;
            $(".ev-surplusImgNum").text(maxNum);
            if(maxNum==0){//上传达到最大时隐藏上传按钮
                $(".ev-uploadImgCon").hide();
            }
            t.ulpoadImg();
        },
        //获取视频信息
        getVideoList:function(data){
            var t=this;
            var html1="",html2="",html3="";
            t.videoListId="";
            t.videoUped=1;//默认视频上传成功的状态
            if(data.length==0){
                t.uploadVideoBind();
                return false;
            }
            $.each(data,function(i,val){
                var attUrl=val.logoUrl;
                var play_icon='<i class="uploadVideoIcon"><img src="//img10.allinmd.cn/v3/common/icon/video_btn.png" alt=""></i>';
                if(attUrl.lastIndexOf("default")>0){
                    attUrl="//img10.allinmd.cn/default/qiniu196_196.jpg";
                    play_icon="";
                }
                if(val.caseCategoryId==1) {//治疗前
                    html1+='<li class="imagesUploadBtn ev-uploadVideoLi" listId="'+val.attId+'" caseCategoryId="'+val.caseCategoryId+'">'+
                        '<div class="imagesUploadPath ev-uploadVideoPath"><img src="'+attUrl+'"/></div>'+
                        '<figure class="ev-removeVideo"><img src="//img10.allinmd.cn/v3/upload_case/close.png"> </figure>'+
                        play_icon+
                        '</li>';
                }else if(val.caseCategoryId==2){//治疗中
                    html2+='<li class="imagesUploadBtn ev-uploadVideoLi" listId="'+val.attId+'" caseCategoryId="'+val.caseCategoryId+'">'+
                        '<div class="imagesUploadPath ev-uploadVideoPath"><img src="'+attUrl+'"/></div>'+
                        '<figure class="ev-removeVideo"><img src="//img10.allinmd.cn/v3/upload_case/close.png"> </figure>'+
                        play_icon+
                        '</li>';
                }else if(val.caseCategoryId==3){//治疗后
                    html3+='<li class="imagesUploadBtn ev-uploadVideoLi" listId="'+val.attId+'" caseCategoryId="'+val.caseCategoryId+'">'+
                        '<div class="imagesUploadPath ev-uploadVideoPath"><img src="'+attUrl+'"/></div>'+
                        '<figure class="ev-removeVideo"><img src="//img10.allinmd.cn/v3/upload_case/close.png"> </figure>'+
                        play_icon+
                        '</li>';
                }
            });
            $(".ev-uploadImgPar ul").eq(0).append(html1);
            $(".ev-uploadImgPar ul").eq(1).append(html2);
            $(".ev-uploadImgPar ul").eq(2).append(html3);
            $(".ev-surplusVideoNum").text(0);
            $(".ev-uploadVideoCon").parent().hide();
            //删除视频
            $.each($(".ev-removeVideo"),function(){
                $(this).on("click",function(){
                    if($(this).parent().attr("listId")){
                        t.videoListId+=$(this).parent().attr("listId")+',';
                        $(this).parent().remove();
                        $(".ev-uploadVideoCon").parent().show();
                        $(".ev-surplusVideoNum").text(1);
                        t.uploadVideoBind();
                    }
                })
            })
        },
        //上传图片
        ulpoadImg:function(){
            //查看大图
            $(document).on('click',".ev-viewImg",function(){
                id=$(this).parents("li").attr("listId");
                container=$(this).parents("ul");
                var imgList=[];
                $(".ev-uploadImgLi").each(function(i,em){
                    imgList.push({id:$(em).attr("listid"),url:$(em).find(".ev-uploadImgPath img").attr("src").replace("_c_t_200_200","")});
                });
                module.viewBigImgAll({
                    container:container,
                    typeTitle: "",
                    imgListType:'caze',
                    id: id,
                    imgList:imgList
                });
            });
            $(document).on('mouseover',".ev-uploadImgPath",function(){
                var viewHtml = '<div class="transparentMask viewBIgImgMask ev-viewImg"><div class="uploading"><span>查看大图</span></div></div>'
                $(this).next(".ev-removeImg").after(viewHtml);
            });
            $(document).on('mouseleave',".ev-viewImg,.ev-uploadImgLi",function(){
                $(".ev-viewImg").remove();
            });
            $(document).on('mouseover',".imagesUploadBtn input",function(){
                $(this).prev('p').addClass("active");
            });
            $(document).on('click',".imagesUploadBtn input",function(){
                $(this).prev('p').removeClass("active");
            });
            $(document).on('mouseleave',".imagesUploadBtn input",function(){
                $(this).prev('p').removeClass("active");
            });
            var t=this;
            t.imgFailNum=0;
            t.uploadImgFail=false;//上传失败的状态
            t.uploadImgStatus=true;
            var maxNum=t.config.imgLen-t.imgLen;//最大上传数
            $(".ev-uploadImgPar").each(function(i,em){
                $(".ev-uploadImg",$(em)).fileupload({
                    url: t.path.caseAttCreate,
                    formData:{'caseId':t.caseId,'sortId': t.sortId},
                    fileName: "uploadify", //提交到服务器的文件名
                    maxNumberOfFiles: maxNum, //上传文件个数（多个时修改此处
                    returnType: 'json',              //服务返回数据
                    acceptFiles: "image/*", //只允许图片格式
                    acceptFileTypes: /(\.|\/)(jpg|jpeg|png)$/i, //允许上传的文件式
                    dragDrop: false,
                    showAbort: false,
                    autoUpload: true,
                    maxFileSize: 5120*2,//单个文件允许大小
                    previewMaxWidth: 185,
                    previewMaxHeight: 185
                }).bind('fileuploadsubmit',function(e,data){
                    data.formData = {'caseId':t.caseId,'sortId':t.sortId,'isValid':0};
                }).bind('fileuploadchange', function(e, data) {
                    newNum=data.files.length;
                    if(data.files.length > (t.config.imgLen-t.imgLen)){
                        t.errorPop('最大上传40张',1);
                        return false;
                    }
                }).bind("fileuploaddrop", function(e, data) {
                    newNum=data.files.length;
                    if(data.files.length > (t.config.imgLen-t.imgLen)){
                        t.errorPop("最大上传40张",1);
                        return false;
                    }
                }).bind('fileuploadadd', function (e, data) {//图片添加后
                    var type=data.files[0].type;
                    if ((/(jpg)|(jpeg)|(png)$/i.test(type))) {
                        var fileSize = data.files[0].size;
                        if (fileSize > 10 * 1048576) {
                            t.errorPop("图片过大，请联系在线客服寻求帮助",1);
                            return false;
                        } else {

                        }
                    } else {
                        t.errorPop("格式不支持，请选择jpg、png、jpeg",1);
                        return false;
                    }
                    t.sortId++;
                    t.uploadImgStatus=false;//上传图片的状态：正在上传中
                    var $ul= $(e.currentTarget).parents(".ev-uploadImgPar").find("ul");
                    var html=//'<li class="imagesUploadBtn ev-uploadImgLi">'+
                        '<div class="imagesUploadPath ev-uploadImgPath"><img src="'+ t.localURL(data.files[0])+'"/></div>'+
                        '<figure class="ev-removeImg hide"><img src="//img10.allinmd.cn/v3/upload_case/close.png"> </figure>'+
                        '<div class="transparentMask ev-uploadImgProgress"><div class="uploading"><i></i><span>0%</span></div></div>'+
                        '<div class="transparentMask ev-uploadImgfail hide"><div class="uploadFail">上传失败<br>请重新上传</div></div>'+
                        '<textarea placeholder="请输入图片描述" class="case_att_name"></textarea><b class="imageAttNum ev-attNum">100</b>';
                    //'</li>';
                    data.context = $('<li class="imagesUploadBtn ev-uploadImgLi" caseCategoryId="'+(i+1)+'"></li>').append(html);
                    $ul.append(data.context);
                    comm.textChangeNew({
                        $tex:data.context.find("textarea"),//输入框
                        $num:data.context.find(".ev-attNum"),//存放数字的元素
                        inputIng:function(){
                            data.context.find(".ev-attNum").show();
                        },//输入中回调函数
                        inputFinish:function(){
                            data.context.find(".ev-attNum").hide();
                        },//输入完成回调函数
                        inputSurpass:function(){}//输入超出回调函数
                    });
                    t.imgLen=$(".ev-uploadImgLi").length;//已上传文件个数
                    maxNum=t.config.imgLen-t.imgLen;
                    $(".ev-surplusImgNum").text(maxNum);
                    if(maxNum==0){//上传达到最大时隐藏上传按钮
                        $(".ev-uploadImgCon").hide();
                    }
                }).bind('fileuploadprogress', function (e, data) {//获取进度
                    ////console.log('data-progress',data);
                    var progress = parseInt(data.loaded / data.total * 100, 10);
                    var node = $(data.context).find("span");
                    node.text(progress+"%");
                }).bind('fileuploaddone',function(e,data){//上传成功  ajax返回的数据
                    ////console.log(data);
                    var response=JSON.parse(data.jqXHR.responseText);
                    var node = $(data.context);
                    node.find(".ev-uploadImgProgress").hide();
                    if(response&&response.responseObject&&response.responseObject.responseStatus){
                        node.attr("listId",response.responseObject.responsePk);
                        node.find(".ev-removeImg").show();//删除按钮显示
                        t.removeImg(node);
                    }else{
                        t.imgFailNum++;//上传失败的张数修改
                        t.uploadImgFail=true;
                        node.find(".ev-removeImg").show();//删除按钮显示
                        node.find(".ev-uploadImgProgress").hide();//加载loading隐藏
                        node.find(".ev-uploadImgfail").show();//失败提示
                        t.errorPop("图片上传失败,请重新上传",1);
                        //点击删除
                        node.find(".ev-removeImg").on("click",function(){
                            t.imgFailNum--;//上传失败的张数修改
                            if(t.imgFailNum==0){//上传失败的删除状态判断
                                t.uploadImgFail=false;
                            }
                            node.remove();
                            t.imgLen--;
                            $(".ev-surplusImgNum").text(t.config.imgLen-t.imgLen);
                            if(t.imgLen < t.config.imgLen){
                                $(".ev-uploadImgCon").show();
                            }
                        });
                    }
                    t.flag.upImgFlag = true;
                    t.checkAll();
                }).bind('fileuploadfail',function(e,data){//上传失败
                    t.imgFailNum++;//上传失败的张数修改
                    t.uploadImgFail=true;
                    var node = $(data.context);
                    node.find(".ev-removeImg").show();//删除按钮显示
                    node.find(".ev-uploadImgProgress").hide();//加载loading隐藏
                    node.find(".ev-uploadImgfail").show();//失败提示
                    t.errorPop("图片上传失败,请重新上传",1);
                    //点击删除
                    node.find(".ev-removeImg").on("click",function(){
                        t.imgFailNum--;//上传失败的张数修改
                        if(t.imgFailNum==0){//上传失败的删除状态判断
                            t.uploadImgFail=false;
                        }
                        node.remove();
                        t.imgLen--;
                        $(".ev-surplusImgNum").text(t.config.imgLen-t.imgLen);
                        if(t.imgLen < t.config.imgLen){
                            $(".ev-uploadImgCon").show();
                        }
                    });
                }).bind("fileuploadstop",function(e,data){//上传图片完成
                    t.uploadImgStatus=true;
                    t.uploadStatrus=true;
                });
            });
            /*.on("fileuploadprocessalways",function(e,data){//上传中本地预览 canvas实现
             var i = data.index,
             file = data.files[i],
             node = $(data.context).find(".ev-uploadImgPath");
             if (file.preview) {
             node.prepend(file.preview);
             }
             })*/
        },
        //返回预览地址
        localURL:function(file){
            var url = null;
            if (window.createObjectURL != undefined) {
                url = window.createObjectURL(file);
            } else if (window.URL != undefined) {
                url = window.URL.createObjectURL(file);
            } else if (window.webkitURL != undefined) {
                url = window.webkitURL.createObjectURL(file);
            }
            return url;//     eg:     blob:http://localhost/671c3409-0047-44ec-bcba-89d63a439231
        },
        //删除图片
        removeImg:function($this){
            var t=this;
            $this.find(".ev-removeImg").on("click",function(){
                t.deleteAttIds+=$this.attr("listId")+",";
                $this.remove();
                t.imgLen--;
                $(".ev-surplusImgNum").text(t.config.imgLen-t.imgLen);
                if(t.imgLen < t.config.imgLen){
                    $(".ev-uploadImgCon").show();
                }
                if($(".ev-uploadImgLi").length<=0){
                    t.flag.upImgFlag = false;
                }
                t.checkAll();
                /*if(!$(this).attr("on")){
                    $(this).attr("on","true");
                    var data={};
                    var param={};
                    data.id=$this.attr("listId");
                    param.paramJson= $.toJSON(data);
                    comm.ajax.async(t.path.caseAttDelete,param,function(data){
                        $(".publish_mask").hide();
                        if(data.responseObject.responseStatus){

                        }
                    });
                }*/
            });
        },
        //上传视频
        uploadVideoBind:function(){
            var t=this;
            $(".ev-uploadImgPar").each(function(i,em){
                t.uploadVideo(i,$(em));
            });
        },
        uploadVideo:function(i,obj){
            var t=this;
            t.videoUped=1;//视频上传成功的状态
            t.uploadStatrus=true;//允许上传
            var video=videoUpload({
                obj:"#"+$(".ev-uploadVideoCon",obj).attr("id"),
                flash_swf_url:'//paas.allinmd.cn/modules/video_upload/plupload/Moxie.swf',
                dragdrop:true,
                max_file_size:80,
                uptoken_url: t.path.getToken,
                domain:'//'+location.hostname,
                pluploadEach:function(file){//每个文件添加队列后执行
                    if(!t.uploadStatrus){
                        return;
                    }
                    t.videoUped=0;
                    var html='<li class="imagesUploadBtn ev-uploadVideoLi" caseCategoryId="'+(i+1)+'">'+
                        '<div class="imagesUploadPath ev-uploadVideoPath"><img src=""/></div>'+
                        '<figure class="ev-removeVideo hide"><img src="//img10.allinmd.cn/v3/upload_case/close.png"> </figure>'+
                        '<div class="transparentMask ev-uploadVideoProgress"><div class="uploading"><i></i><span>0%</span></div></div>'+
                        '<div class="transparentMask ev-uploadVideofail hide"><div class="uploadFail">上传失败<br>请重新上传</div></div>'+
                        '</li>';
                    obj.find("ul").append(html);
                    t.videoLen= $(".ev-uploadVideoLi").length;
                    $(".ev-uploadVideoCon").parent().hide();
                    $(".ev-surplusVideoNum").text(0);
                },
                beforeUpload:function(file){//文件上传之前
                    /*if(!t.uploadImgStatus){//在图片上传过程中不能上传视频
                        t.errorPop("请图片上传完成后再上传视频",1);
                        t.uploadStatrus=false;
                        return;
                    }*/
                    t.uploadStatrus=true;
                    var name=comm.file.getName(file.name);
                    var fileName=name.fileName;
                    var suffix=name.suffixName;
                    if ((/(mp4)|(mov)|(avi)|(wmv)|(flv)$/i.test(suffix))) {
                        var fileSize = file.size;
                        if (fileSize > 80 * 1048576) {
                            t.errorPop("视频过大，请联系在线客服寻求帮助",1);
                            video.uploader.removeFile(video.uploader.getFile(file.id));
                            t.uploadStatrus=false;
                            return false;
                        } else {

                        }
                    } else {
                        t.errorPop("格式不支持，请选择mov、mp4、avi、wmv、flv",1);
                        video.uploader.removeFile(video.uploader.getFile(file.id));
                        t.uploadStatrus=false;
                        return false;
                    }
                    t.videoName = fileName.length > 15 ? fileName.substring(0, 15) + '...'  + '.' + suffix : fileName + '.' + suffix;
                },
                uploadProgress:function(file){//上传进度条
                    $(".ev-uploadVideoProgress span").text(file.percent+"%");
                    if(file.percent==100){
                        $(".ev-uploadVideoProgress").remove();
                    }
                },
                fileUploaded:function(dataJson){//上传成功
                    t.videoUped=1;
                    t.key=dataJson.key;
                    t.persistentId=dataJson.persistentId;
                    $(".moxie-shim",obj).remove();
                    $(".ev-uploadVideoPath img").attr("src","//img10.allinmd.cn/default/qiniu196_196.jpg");
                    t.flag.upVideoFlag = true;
                    t.checkAll();
                    t.videoRemove(i,obj);
                },
                fileUploadError:function(){
                    $(".ev-uploadVideoProgress").remove();
                    $(".ev-uploadVideofail").show();
                    t.errorPop("视频上传失败,请重新上传",1);
                    t.videoRemove(i,obj);
                }
            })
        },
        videoRemove:function(i,obj){
            var t=this;
            $(".ev-removeVideo").show();
            $(".ev-removeVideo").on("click",function(){
                $(".ev-uploadVideoLi").remove();
                $(".ev-uploadVideoCon").parent().show();
                $(".ev-surplusVideoNum").text(1);
                t.uploadVideo(i,obj);
                t.flag.upVideoFlag = false;
                t.videoLen=0;
                t.checkAll();
            })
        }
    };
    uploadCase.init();
});