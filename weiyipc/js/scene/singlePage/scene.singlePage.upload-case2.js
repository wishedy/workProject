/**
 * Created by zhanghongda on 2017/8/17.
 */
$.getScript(window.paasFilePathObj.js, function () {
    $(function () {
        var uploadCase = {
            config: {
                passFlag: true,
                heigh: 0,
                hasSup: 0,//标示补充资料
                videoLen: 1,//最大上传视频数
                editorId: 0
            },
            path: {
                videoInfo: PC_CALL + "qiniu/storage/saveVideoInfo/",//保存视频
                caseCreate: PC_CALL + "case_baseinfo/create/",//创建
                caseUpdate: PC_CALL + "case_baseinfo/update/",//病例基本信息保存
                caseInfo: PC_CALL + "case_baseinfo/getMapByDraft/",//获取病例信息
                caseDelete: PC_CALL + "case_baseinfo/deleteAll/",//删除病例
                caseAttList: PC_CALL + "case_attachment/json_list/",
                caseAttCreate: PC_CALL + "case_attachment/upload/",
                caseAttDelete: PC_CALL + "case_attachment/delete/",
                caseRemind: PC_CALL + "customer/unite/json_list/",//提醒谁看
                getToken: PC_CALL + "qiniu/storage/getQiniuToken/",
                createPop: PC_CALL + "case_additional/create/",//创建随访记录
                savePop: PC_CALL + "case_additional/updateFollowUpSurvey/",//保存随访记录
                deleteAdd: PC_CALL + "case_additional/update/",//删除随访记录接口
                getPopData: PC_CALL + "case_additional/getFollowUpSurveyList/",//获取随访记录信息
                getPopDataOp: PC_CALL + "case_additional/getOperationInfoList/",//获取随访记录信息
                caseOperation: PC_CALL + "case_additional/getOperationList/",//手术名称接口联想
                caseDiagnosis: PC_CALL + "case_additional/getIllnessList/",//诊断接口联想
                additionalUpload: PC_CALL + "case_additional_attachment/upload/",//随访记录上传图片接口
                addVideoInfo: PC_CALL + "qiniu/storage/saveBatchVideoInfo/",//随访记录的接口  保存视频
                reg: PC_CALL + "activity/register/getRegisterStatus/",//获取用户报名信息
                getTagsList: PC_CALL + "comm/data/property/getPropertyList/",//获取发布病例后可选择的标签列表
                addTagsList: PC_CALL + "case_baseinfo/updateProperty/",//发布病例后添加标签
            },
            init: function () {
                var t = this;
                t.caseId = '';
                t.deleteAttIds = "";//存放删除的图片id
                t.deletePopAttIds = "";//随访记录弹层中存放的
                t.sortId = 0;//图片的id
                // t.videoSortId = 0;//视频的id
                t.addSortId = 0;//随访记录的id
                t.opSortId = 0;//随访记录的id
                t.para = comm.getpara();
                t.flag = {};
                t.checkLogin();
                t.options = {};
            },
            //检测登录，
            checkLogin: function () {
                var t = this;
                user.login({
                    callback: function () {
                        $(".option textarea").textareaAutoHeight({minHeight: 26, maxHeight: 189});
                        if (t.para.caseId) {//表示为编辑病例
                            t.caseId = t.para.caseId;
                            t.editCase();//编辑病例
                            $(".ev-uploadImgPar ul").attr("caseid", t.caseId);
                        } else {
                            comm.ajax.async(t.path.caseCreate, '', function (data) {//创建病例Id
                                if (data.responseObject.responseStatus) {
                                    t.caseId = data.responseObject.responsePk;
                                    $(".ev-uploadImgPar ul").attr("caseid", t.caseId);
                                    t.uploadImg();
                                    t.uploadVideoBind();
                                    t.checkActive();//验证是否可以发布
                                }
                            });
                        }
                        t.addAlPopup();//验证是否可以发布
                        t.caseInfo();//病例资料
                        t.submitBtn();//发布按钮点击
                        t.remind();//提醒谁看
                        t.diagnosis();//诊断
                        t.operationName();//手术名称
                    },
                    scene: privilegeSceneConst.eSceneTypePublic,
                    onAuthCancel: "back"
                })
            },
            // 文字倒计数方法
            textChange: function (v) {
                var t = this;
                var num = $(v).parents(".option").find('b').text();
                comm.textChangeNew({//新版病例发布倒记数功能
                    $tex: $(v),//输入框
                    $num: $(v).parents(".option").find('b'),//存放数字的元素
                    judgmentCE: 0,//需要中英文区分 默认0
                    inputSurpass: function () {
                        $(v).addClass('error');
                        t.config.passFlag = false;
                        if ($(".ev-caseInfoUp").text() == "收起" && $(".supplement").css("display") != "none") {
                            t.config.heigh = $(v).parents(".option").offset().top - 90 - 150;
                        } else {
                            t.config.heigh = $(v).parents(".option").offset().top - 90;
                        }
                        t.errorPop('不能超过' + num + '个字');
                    }//输入超出回调函数
                });
            },
            //验证是否可以激活按钮+右侧导航
            checkActive: function () {
                var t = this;
                $.each($(".option input"), function (k, v) {
                    t.textChange(v);
                });
                $.each($("textarea"), function (i, el) {
                    t.textChange(el);
                });
                $("textarea").on("keyup", function () {
                    $.each($("textarea"), function (i, el) {
                        if ($(el).val() != '') {
                            t.flag.areaFlag = true;
                            return false;
                        } else {
                            t.flag.areaFlag = false;
                        }
                    });
                    t.checkAll();
                });
                t.writeAge($("#age"));
                t.writeAge($("#month"));
                t.writeAge($("#day"));
                $(".years input").on("keyup", function () {//输入年龄时
                    var aStr = $("#age").val();
                    if (aStr != "" && aStr >= 0 && aStr <= 5) {
                        $("#month").attr("disabled", false).parents("p").removeClass("default");
                        $("#day").attr("disabled", false).parents("p").removeClass("default");
                        t.flag.inpFlag = true;
                    } else {
                        $("#month").attr("disabled", true);
                        $("#day").attr("disabled", true);
                        $("#month").parents("p").addClass("default");
                        $("#day").parents("p").addClass("default");
                        if ($("#age").val() != '') {
                            t.flag.inpFlag = true;
                        } else {
                            t.flag.inpFlag = false;
                        }
                        $("#month").val("");
                        $("#day").val("");
                        t.flag.inpFlag = true;
                    }
                    t.checkAll();
                });
                $(".ev-sex .male").on("click", function () {//性别的点击
                    t.flag.malFlag = true;
                    $.each($(".ev-sex .male"), function () {
                        $(this).removeClass("active");
                    });
                    $(this).addClass("active");
                    $(".ev-sex").removeClass("error");
                    t.checkAll();
                });
                $("textarea,.years input,.option input").on('focus', function () {//聚焦进行加入效果
                    $.each($(".option"), function () {
                        $(this).removeClass('active');
                    });
                    $(this).parents(".option").addClass('active').removeClass('error').find("b").show();
                });
                $("textarea,.years input,.option input").on('blur', function () {//失去焦点进行移除
                    $.each($(".option"), function () {
                        $(this).removeClass('active');
                    });
                    $(this).parents(".option").find("b").hide();
                });
                $(".uploadNavCont li").on("click", function () {//点击右侧导航进行定位
                    $(this).addClass("active").siblings().removeClass("active");
                    $(window).scrollTop($("." + $(this).attr("data-dom")).offset().top - 90);
                });
                $(window).on("scroll", function () {
                    var h = $(window).scrollTop(), caseH = $(".ev-caseInfo").offset().top - 90,
                        imgH = $(".ev-imageInfo").offset().top - 90;
                    if (h < caseH) {
                        $('.uploadNavCont li[data-dom="ev-essentialInfor"]').addClass("active").siblings().removeClass("active");
                    }
                    if (h < imgH && h > caseH) {//当病例信息到达顶部，滚动的高度在病例信息和图像信息中间
                        $('.uploadNavCont li[data-dom="ev-caseInfo"]').addClass("active").siblings().removeClass("active");
                    }
                    if (imgH <= h) {
                        $('.uploadNavCont li[data-dom="ev-imageInfo"]').addClass("active").siblings().removeClass("active");
                    }
                });
                //临床转归的点击处理
                $(".ev-clinical .clinical i").off("click").on("click", function () {
                    if (!$(this).hasClass("active")) {
                        $(this).addClass("active").parents('.clinical').siblings('.clinical').find(" i").removeClass("active");
                        t.clinicalFlag = true;
                        t.checkAll();
                    }
                });
            },
            //年龄处理
            writeAge: function (obj) {
                obj.keydown(change).keyup(change).change(change);
                obj[0].onpaste = change;

                function change() {
                    obj.val(obj.val().replace(/[^\d]/g, ''));
                    if (obj.val().length != 0) {
                        if (obj.val() == 0) {
                            obj.val(0);
                        }
                    }
                }
            },
            //验证输入框内容，将发布按钮进行激活（是否全部激活）
            checkAll: function () {
                var t = this;
                if (t.flag.areaFlag || t.flag.inpFlag || t.flag.malFlag || t.flag.atNameFlag || t.flag.uploadFlag
                    || t.flag.upImgFlag || t.flag.upVideoFlag || t.opNameFlag || t.diagnosisFlag || t.clinicalFlag) {
                    $(".uploadCont").addClass("active");
                } else {
                    $(".uploadCont").removeClass("active");
                }
            },
            //补充资料交互
            caseInfo: function () {
                $(".ev-DIYcase").on("click", function () {//自定义表单项点击
                    $(".supplement").show();
                    $(this).hide();
                    $('.nonEssential').hide();
                    comm.creatEvent({
                        triggerType: "发布",
                        keyword: "自定义病例项",
                        actionId: 11055
                    });
                });
                $(".ev-caseInfoUp").on("click", function () {//补充资料的点击
                    $(".supplement").removeClass("uploadFixed");
                    $(".ev-fixedContent").css("height", 0);
                    $(".supplement ul").toggle();
                    if ($(".supplement ul").css("display") == "none") {
                        $(this).text("展开");
                    } else {
                        $(this).text("收起");
                        comm.creatEvent({
                            triggerType: "发布",
                            keyword: "展开",
                            actionId: 11055
                        });
                    }
                });
                $('.supplement li').on('click', function () {
                    var name = $(this).text();
                    if ($(this).hasClass("active")) {
                        $.each($(".nonEssential"), function (i, e) {
                            if ($(e).find(".titleText").text() == name) {
                                $(this).hide();
                            }
                        });
                    } else {
                        $.each($(".nonEssential"), function (i, e) {
                            if ($(e).find(".titleText").text() == name) {
                                $(this).show();
                            }
                        });
                    }
                    $(this).toggleClass("active");
                });
                $(window).on("scroll", function () {//页面滚动时候进行补充资料+影像信息的置顶
                    var h = $(window).scrollTop();
                    if ($('.supplement').css("display") == "block" && $('.ev-caseInfoUp').text() == "收起") {
                        if (h > $('.ev-caseInfo').find(".title").offset().top - 40 && h < $('.ev-imageInfo').find(".title").offset().top - 200) {
                            $('.uploadStandardCont').removeClass("uploadFixed");
                            $(".ev-fixedContent").css("height", 150);
                            $('.supplement').addClass("uploadFixed");
                        } else if (h > $('.ev-imageInfo').find(".title").offset().top - 40) {
                            $(".ev-fixedContent").css("height", 0);
                            $('.supplement').removeClass("uploadFixed");
                            $('.uploadStandardCont').addClass("uploadFixed")
                        } else {
                            $(".ev-fixedContent").css("height", 0);
                            $('.supplement').removeClass("uploadFixed");
                            $('.uploadStandardCont').removeClass("uploadFixed");
                        }
                    } else {
                        if (h > $('.ev-imageInfo').find(".title").offset().top - 40) {
                            $('.uploadStandardCont').addClass("uploadFixed");
                        } else {
                            $('.uploadStandardCont').removeClass('uploadFixed')
                        }
                    }
                })
            },
            //提交按钮验证
            submitBtn: function () {
                var t = this;
                $('.uploadCaseError').hide();
                $('.ev-submitBtn').off("click").on('click', function () {//按钮点击
                    if (TempCache.getItem("userId")) {
                        if ($('.uploadCont').hasClass('active') && t.config.offClick != false) {//如果按钮是激活状态
                            t.isdraft = '';
                            var name = '';

                            function checkMust(dom) {//此段代码感觉太脆弱。。。顺序是倒叙，先检查后面的必填项
                                if ($.trim(dom.find("textarea").val()) == '') {//体格检查
                                    name = '请填写' + dom.find(".titleText").text();
                                    dom.addClass("error");
                                    if ($(".ev-caseInfoUp").text() == "收起" && $(".supplement").css("display") != "none") {
                                        t.config.heigh = dom.offset().top - 90 - 150;
                                    } else {
                                        t.config.heigh = dom.offset().top - 90;
                                    }
                                } else {
                                    dom.removeClass("error");
                                }
                            }

                            //诊断检测 验证
                            if (!$(".diagnosisText").find(".ev-diag").length) {
                                if ($(".ev-caseInfoUp").text() == "收起" && $(".supplement").css("display") != "none") {
                                    t.config.heigh = $(".ev-diagnosis").offset().top - 90 - 150;
                                } else {
                                    t.config.heigh = $(".ev-diagnosis").offset().top - 90;
                                }
                                $(".ev-diagnosis").addClass("error");
                                name = '请填写' + $(".ev-diagnosis .titleText").text();
                            }
                            checkMust($(".ev-caseCheck"));//体格检查
                            checkMust($(".ev-caseHos"));//现病史
                            checkMust($(".ev-caseMain"));//主诉
                            if ($.trim($(".ev-caseAge #age").val()) == '') {//年龄
                                $(".ev-caseAge").addClass("error");
                                name = '请填写' + $(".ev-caseAge .titleText").text();
                                if ($(".ev-caseInfoUp").text() == "收起" && $(".supplement").css("display") != "none") {
                                    t.config.heigh = $(".ev-caseAge").offset().top - 90 - 150;
                                } else {
                                    t.config.heigh = $(".ev-caseAge").offset().top - 90;
                                }
                            } else if ($(".ev-caseAge #age").val() <= 5 && $(".ev-caseAge #age").val() > 0) {
                                if ($("#month").val() == '') {
                                    $(".ev-caseAge").addClass("error");
                                    name = "病人年龄中月数必填!";
                                    if ($(".ev-caseInfoUp").text() == "收起" && $(".supplement").css("display") != "none") {
                                        t.config.heigh = $(".ev-caseAge").offset().top - 90 - 150;
                                    } else {
                                        t.config.heigh = $(".ev-caseAge").offset().top - 90;
                                    }
                                } else if (($("#month").val() < 0 || $("#month").val() > 12)) {
                                    $(".ev-caseAge").addClass("error");
                                    name = "病人年龄中月在0~12月之间!";
                                    if ($(".ev-caseInfoUp").text() == "收起" && $(".supplement").css("display") != "none") {
                                        t.config.heigh = $(".ev-caseAge").offset().top - 90 - 150;
                                    } else {
                                        t.config.heigh = $(".ev-caseAge").offset().top - 90;
                                    }
                                }
                                if ($("#day").val() != '' && ($("#day").val() < 1 || $("#day").val() > 28)) {
                                    $(".ev-caseAge").addClass("error");
                                    name = "病人年龄中天数在1~28天之间!";
                                    if ($(".ev-caseInfoUp").text() == "收起" && $(".supplement").css("display") != "none") {
                                        t.config.heigh = $(".ev-caseAge").offset().top - 90 - 150;
                                    } else {
                                        t.config.heigh = $(".ev-caseAge").offset().top - 90;
                                    }
                                }
                            } else if ($(".ev-caseAge #age").val() == 0) {
                                if ($("#day").val() == '') {
                                    $(".ev-caseAge").addClass("error");
                                    name = "病人年龄中天数必填!";
                                    if ($(".ev-caseInfoUp").text() == "收起" && $(".supplement").css("display") != "none") {
                                        t.config.heigh = $(".ev-caseAge").offset().top - 90 - 150;
                                    } else {
                                        t.config.heigh = $(".ev-caseAge").offset().top - 90;
                                    }
                                } else if ($("#day").val() < 1 || $("#day").val() > 28) {
                                    $(".ev-caseAge").addClass("error");
                                    name = "病人年龄中天数在1~28天之间!";
                                    if ($(".ev-caseInfoUp").text() == "收起" && $(".supplement").css("display") != "none") {
                                        t.config.heigh = $(".ev-caseAge").offset().top - 90 - 150;
                                    } else {
                                        t.config.heigh = $(".ev-caseAge").offset().top - 90;
                                    }
                                }
                                if ($("#month").val() != '' && ($("#month").val() < 0 || $("#month").val() > 12)) {
                                    $(".ev-caseAge").addClass("error");
                                    name = "病人年龄中月在0~12月之间!";
                                    if ($(".ev-caseInfoUp").text() == "收起" && $(".supplement").css("display") != "none") {
                                        t.config.heigh = $(".ev-caseAge").offset().top - 90 - 150;
                                    } else {
                                        t.config.heigh = $(".ev-caseAge").offset().top - 90;
                                    }
                                }
                            } else if ($(".ev-caseAge #age").val() < 0 || $(".ev-caseAge #age").val() > 120) {
                                $(".ev-caseAge").addClass("error");
                                name = "病人年龄在0~120之间!";
                                if ($(".ev-caseInfoUp").text() == "收起" && $(".supplement").css("display") != "none") {
                                    t.config.heigh = $(".ev-caseAge").offset().top - 90 - 150;
                                } else {
                                    t.config.heigh = $(".ev-caseAge").offset().top - 90;
                                }
                            } else {
                                $(".ev-caseAge").removeClass("error");
                            }
                            $.each($(".ev-caseMale .male"), function (i, e) {
                                if ($(".ev-caseMale .male").hasClass("active")) {//性别
                                    $(".ev-caseMale").removeClass("error");
                                    return false;
                                } else {
                                    $(".ev-caseMale").addClass("error");
                                    name = '请填写' + $(".ev-caseMale .titleText").text();
                                    if ($(".ev-caseInfoUp").text() == "收起" && $(".supplement").css("display") != "none") {
                                        t.config.heigh = $(".ev-caseMale").offset().top - 90 - 150;
                                    } else {
                                        t.config.heigh = $(".ev-caseMale").offset().top - 90;
                                    }
                                }
                            });
                            checkMust($(".ev-caseTitle"));//标题
                            $.each($(".ev-must"), function (i, e) {//用来存放报错信息的名称
                                if ($(e).hasClass('error')) {
                                    t.config.passFlag = false;
                                    t.errorPop(name);//错误提示
                                    return false;
                                } else {
                                    t.config.passFlag = true;
                                }
                            });
                            if (t.config.passFlag) {//如果必填项均填写完成便可以进行发布
                                comm.creatEvent({
                                    triggerType: "发布",
                                    keyword: "发布",
                                    actionId: 32,
                                    browType: 83//发布病例按钮点击
                                });
                                var cBack = function (res) {
                                    if (comm.hasResponseData(res)) {
                                        t.config.actStatus = res.responseObject.responseData.registerStatus;
                                        t.config.offClick = false;
                                        t.publicVideo();//发布视频，如果视频存在并且发布成功之后进行发布病例
                                        t.saveDraft();//保存草稿
                                    }
                                };
                                if (t.config.activityId && t.config.activityId != 0 && t.para.caseId && t.para.isDraft) {
                                    comm.ajax.async(t.path.reg, {
                                        paramJson: $.toJSON({
                                            activityId: t.config.activityId,
                                            customerId: $("#sesCustomerId").val(), isValid: 1
                                        })
                                    }, cBack);
                                } else {
                                    t.config.offClick = false;
                                    t.publicVideo();//发布视频，如果视频存在并且发布成功之后进行发布病例
                                    t.saveDraft();//保存草稿
                                }
                            }
                        }
                    } else {
                        g_sps.jump(null, "/");
                    }
                });
                t.saveDraft();//保存草稿
                //取消发布按钮点击事件
                $('.ev-caseCancel').on("click", function () {
                    t.isdraft = '';
                    //事件埋点
                    comm.creatEvent({
                        triggerType: "全站功能按钮点击",
                        keyword: "取消",
                        browType: 83,
                        actionId: 45
                    });
                    if ($('.uploadCont').hasClass('active')) {//确认放弃本地编辑吗
                        $(".editorPupop").show();
                        $(".save").off("click").on("click", function () {
                            $(".editorPupop").hide();
                            t.isdraft = 1;
                            t.publicVideo();//病例保存草稿
                            if (location.href.indexOf("&t") > -1) {
                                history.go(-2);
                            } else {
                                history.go(-1);
                            }
                        });
                        $(".enter").on("click", function () {
                            $(".editorPupop").hide();
                            //事件埋点
                            comm.creatEvent({
                                triggerType: "全站功能按钮点击",
                                keyword: "病例发布取消",
                                browType: 83,
                                actionId: 45
                            });
                            if (location.href.indexOf("&t") > -1) {
                                history.go(-2);
                            } else {
                                history.go(-1);
                            }
                        });
                        $(".closeIcon i").on("click", function () {
                            $(".editorPupop").hide();
                        })
                    } else {
                        comm.creatEvent({
                            triggerType: "全站功能按钮点击",
                            keyword: "取消",
                            browType: 83,
                            actionId: 45
                        });
                        history.back(-1);
                    }
                })
                //
            },
            //病例编辑
            editCase: function () {
                var t = this;
                $(".uploadCont").addClass("active");//编辑病例时候将发布按钮进行激活   （如果是编辑病例，则一些内容都是存在的）
                t.flag.atNameFlag = true;
                if (t.para.isDraft == 1) {//如果是编辑的就不可以保存草稿，如果是从草稿箱中进来编辑可以保存草稿
                    $(".saveDraft").show();
                    $(".save").show();
                    $('.editorBtn').removeClass("btnCenter");
                } else {
                    $(".saveDraft").hide();
                    $(".save").hide();
                    $('.editorBtn').addClass("btnCenter");
                }
                var data = {}, param = {};
                data.caseId = t.para.caseId;
                data.caseId = t.caseId;
                data.logoUseFlag = UseFlag.c;
                data.attUseFlag = AttUseFlag.g;
                param.paramJson = $.toJSON(data);
                comm.ajax.async(t.path.caseInfo, param, function (data) {//首次进来时进行铺数据
                    if (data.responseObject.responseData.data_list) {
                        if (data.responseObject.responseData && data.responseObject.responseData.data_list.length > 0) {
                            var dataList = data.responseObject.responseData.data_list[0];
                            t.config.editorId = dataList.case_supplement.id;//数据库中的id
                            t.config.activityId = dataList.activity.activityId;//数据库中的id
                            var videoCont = [];
                            var caseCont = [];
                            videoCont = dataList.case_video_url_list_1.concat(dataList.case_video_url_list_2).concat(dataList.case_video_url_list_3);
                            caseCont = dataList.case_att_url_list_1.concat(dataList.case_att_url_list_2).concat(dataList.case_att_url_list_3);
                            t.getImgList(caseCont);
                            t.getVideoList(videoCont);
                            var caseBaseInfo = dataList.case_baseinfo;//基本信息
                            var caseSupInfo = dataList.case_supplement;//附加信息
                            var case_additional = dataList.case_additional;//诊断依据，鉴别
                            $('#case_name').val(caseBaseInfo.caseName);//标题
                            $('#main_narrate').val(caseBaseInfo.mainNarrate);//主诉
                            $('#illness_history').val(caseBaseInfo.illnessHistory);//现病史
                            $('#discussion').val(caseBaseInfo.discussion);//讨论（非必填项）
                            $('#professional_checking').val(caseBaseInfo.professionalChecking);//体格检查
                            $('#age').val(caseBaseInfo.age);//年龄
                            if ($('#age').val() <= 5 && $('#age').val() != '' && $('#age').val() >= 0) {
                                $("#month").attr("disabled", false);
                                $("#day").attr("disabled", false);
                                $("#month").parents("p").removeClass("default");
                                $("#day").parents("p").removeClass("default");
                            }
                            $('#month').val(caseBaseInfo.ageMonth);//月份
                            $('#day').val(caseBaseInfo.ageDay);//天数
                            $.each($(".ev-caseMale .male"), function (i, e) {//性别
                                if ($(e).attr("data-type") == caseBaseInfo.sexId) {
                                    $(e).addClass("active");
                                } else {
                                    $(e).removeClass("active");
                                }
                            });
                            $('#past_history').val(caseSupInfo.pastHistory);//既往史
                            $('#personal_history').val(caseSupInfo.personalHistory);//个人史
                            $('#family_history').val(caseSupInfo.familyHistory);//家族史
                            $('#auxiliary_info').val(caseSupInfo.auxiliaryInfo);//辅助检查
                            //诊断开始
                            var _dInfo = caseSupInfo.diagnosisInfo.split('§☆');
                            var diaInfoHtml = '';
                            $.each(_dInfo, function (k, v) {
                                if ($.trim(v)) {
                                    diaInfoHtml += '<span class="atPersonal ev-diag">' + v + '</span>';
                                }
                            });
                            $(".diagnosisText").append(diaInfoHtml);
                            $(".ev-diag").css("marginRight", "20px");
                            $("#diagnosis_info").focus();
                            //诊断结束
                            $('#diagnosis_basis').val(case_additional.according);//诊断依据
                            $('#diagnosis_identify').val(case_additional.distinguish);//鉴别诊断
                            $('#treatment_record').val(caseSupInfo.treatmentRecord);//治疗过程
                            $('#product_info').val(caseSupInfo.productInfo);//产品信息
                            $('#health_plan').val(case_additional.recoverPlan);//康复计划
                            $.each($(".ev-clinical .clinical i"), function (i, e) {//临床转归
                                if ($(e).attr("data-type") == case_additional.outCome) {
                                    $(e).addClass("active");
                                } else {
                                    $(e).removeClass("active");
                                }
                            });
                            $(".option textarea").focus();
                            $(document).scrollTop(0);
                            if (t.para.t) {//保存草稿后需要滚动到编辑前的位置
                                $(document).scrollTop(t.para.t);
                            }
                            t.checkActive();//验证是否可以发布
                        }
                    }
                });
                //手术记录以及手术名称获取
                var cBackOp = function (res) {
                    if (res && res.responseObject && res.responseObject.responseStatus) {
                        var items = res.responseObject.responseData.data_list;
                        if (items && items.length) {
                            var html = "";
                            $.each(items, function (i, e) {
                                html += '<li><aside class="time"><span>' + e.additionalName + '</span><p class="ev-changeBtnOp" ' +
                                    'additionalId="' + e.additionalId + '" opSortId="' + e.sortId + '" id="' + e.id + '">修改</p>' +
                                    '<p class="ev-deleteBtnOp" ' +
                                    'additionalId="' + e.additionalId + '" opSortId="' + e.sortId + '" id="' + e.id + '">删除</p>' +
                                    '</aside>' +
                                    '<div class="detailList">' + e.content + '</div></li>';
                            });
                            $(".ev-funListOp").append(html);
                            t.opSortId = items.length ? items[items.length - 1].sortId : 0;
                        }
                        t.opDeleteOrChange();
                    }
                };
                comm.ajax.async(t.path.getPopDataOp, {
                    paramJson: $.toJSON({
                        caseId: t.caseId,
                        additionalType: 2,
                        sortType: 1,
                        isValid: 1
                    })
                }, cBackOp);
                //随访记录添加请求
                var cBack = function (res) {
                    if (res && res.responseObject && res.responseObject.responseStatus) {
                        var items = res.responseObject.responseData.data_list;
                        if (items && items.length) {
                            var html = "";
                            $.each(items, function (i, e) {
                                var _time = e.additionalOption,
                                    _year = _time.substr(0, _time.indexOf("_")),
                                    _month = _time.substr(_time.indexOf("_") + 1);
                                var _content = "";
                                if (_year && _year != 0 && _month && _month != 0) {
                                    _content = '术后' + _year + '年' + _month + '月';
                                } else if (_year && _year != 0) {
                                    _content = '术后' + _year + '年';
                                } else if (_month && _month != 0) {
                                    _content = '术后' + _month + '月';
                                } else {
                                    _content = '暂无时间';
                                }
                                html += '<li><aside class="time"><span>' + _content + '</span><p class="ev-changeBtn" ' +
                                    'additionalId="' + e.additionalId + '" addSortId="' + e.sortId + '" id="' + e.id + '">修改</p>' +
                                    '<p class="ev-deleteBtn" ' +
                                    'additionalId="' + e.additionalId + '" addSortId="' + e.sortId + '" id="' + e.id + '">删除</p></aside>' +
                                    '<div class="detailList">' + e.content + '</div></li>';
                            });
                            $(".ev-funList").append(html);
                            t.addSortId = items.length ? items[items.length - 1].sortId : 0;
                            for (var i = 0; i < items[0].attachmentPicList.length; i++) {
                                if (items[0].attachmentPicList[i].sortId > t.sortId) {
                                    t.sortId = items[0].attachmentPicList[i].sortId;
                                }
                            }
                            // t.sortId = maxSortId;
                        }

                        t.adDeleteOrChange();
                    }
                };
                comm.ajax.async(t.path.getPopData, {
                    paramJson: $.toJSON({
                        caseId: t.caseId,
                        additionalType: 1,
                        sortType: 1,
                        isValid: 1
                    })
                }, cBack);
            },
            //发布病例+图片
            publicCase: function () {
                var t = this;
                var caseAttachmentParam = '';
                var data1 = {};
                var params = {};
                data1.caseId = t.caseId;
                data1.caseName = $.trim(symbolToString($("#case_name").val()));
                data1.age = $.trim($("#age").val());
                data1.ageMonth = $.trim($("#month").val());
                data1.ageDay = $.trim($("#day").val());
                data1.mainNarrate = $.trim(symbolToString($("#main_narrate").val()));
                data1.illnessHistory = $.trim(symbolToString($("#illness_history").val()));
                data1.professionalChecking = $.trim(symbolToString($("#professional_checking").val()));
                data1.discussion = $.trim(symbolToString($("#discussion").val()));
                data1.platformId = $.trim($("#sesDepartment").val());

                //诊断
                var diagnosisInfo = "";
                var _dia = $(".ev-diag");
                $.each(_dia, function (i, e) {
                    diagnosisInfo += symbolToString($(e).text()) + '§☆';
                });
                if (_dia.length > 1) {
                    diagnosisInfo = diagnosisInfo.substr(0, diagnosisInfo.lastIndexOf("§☆"));
                }
                data1.diagnosisInfo = diagnosisInfo;//诊断


                //添加随访记录的参数
                var confirmAddParam = "";
                if ($(".ev-changeBtn").length) {
                    $.each($(".ev-changeBtn"), function (i, e) {
                        confirmAddParam += $(e).attr('additionalId') + ',';
                    });
                }
                data1.confirmAddParam = confirmAddParam;
                data1.deleteAddParam = "";//删除的随访记录

                //从标签专题页带过来的标签id;
                if (t.para.tId) {
                    data1.propertyIdList = t.para.tId;
                }
                $.each($(".ev-caseMale .male"), function (i, e) {
                    if ($(e).hasClass("active")) {
                        data1.sexId = $(e).attr("data-type");//性别
                    }
                });
                if (t.videoListId) {
                    data1.deleteVideoIds = t.videoListId.substring(0, t.videoListId.length - 1);
                }
                if (t.customerIds) {
                    data1.refCustomerIdList = t.customerIds.substring(0, t.customerIds.length - 1);
                }
                //TODO 新版活动报名添加赛区和类别的参数

                if (t.config.actStatus != 6) {
                    if (t.para.activityId) {
                        if (TempCache.getItem("activityProperty")) {
                            data1.property = JSON.parse(TempCache.getItem("activityProperty"));
                        }
                        if (TempCache.getItem("activityProperty_area")) {
                            data1.property_area = JSON.parse(TempCache.getItem("activityProperty_area"));
                        }
                    }
                    if (t.para.caseId && t.isdraft != 1) {//如果是修改病例
                        data1.moidfyTime = 1;
                    } else {
                        //TODO 活动ID
                        data1.activityId = t.para.activityId ? t.para.activityId : "";
                    }
                } else {
                    data1.activityId = 0;//活动设置为空
                }

                if (t.para.tId) {//从标签专题页带过来的标签id;
                    data1.propertyIdList = t.para.tId;//从标签专题页带过来的标签id;
                }
                if (t.isdraft == 1) {//如果是保存草稿
                    data1.isValid = 0;
                    data1.isDraft = 1;
                } else {
                    data1.isValid = 1;
                    data1.isDraft = 0;
                }
                data1.deleteFlag = 1;
                //循环图片集
                $.each($('.ev-uploadImgLi'), function (i, el) {
                    var case_category_id = '';
                    var case_att_name = '';
                    case_category_id = $(this).attr("listId") + "☆" + $(this).attr("casecategoryId");
                    if ($(el).find(".case_att_name").val()) {
                        case_att_name = "☆" + $(el).find(".case_att_name").val();
                    }
                    case_category_id += case_att_name;
                    caseAttachmentParam += case_category_id + ",";
                });
                //@某人
                if ($(".ev-atPerson").length > 0) {
                    t.customerIds = "";
                    $.each($(".ev-atPerson"), function (i, em) {
                        t.customerIds += $(em).attr("data-customer") + ",";
                        data1.refCustomerIdList = t.customerIds.substring(0, t.customerIds.length - 1);
                    });
                }
                t.deleteAttIds && (data1.deleteAttIds = t.deleteAttIds.substring(0, t.deleteAttIds.length - 1));
                data1.caseAttachmentParam = caseAttachmentParam.substring(0, caseAttachmentParam.length - 1);
                data1.id = t.config.editorId;
                data1.caseId = t.caseId;

                checkDom($("#past_history"), function () {//既往史
                    data1.pastHistory = $.trim($("#past_history").val()).replace(/</g, '&lt;').replace(/>/g, '&gt;');
                }, function () {
                    data1.pastHistory = '';
                });
                checkDom($("#personal_history"), function () {//个人史
                    data1.personalHistory = $.trim($("#personal_history").val()).replace(/</g, '&lt;').replace(/>/g, '&gt;');
                }, function () {
                    data1.personalHistory = '';
                });
                checkDom($("#family_history"), function () {//家族史
                    data1.familyHistory = $.trim($("#family_history").val()).replace(/</g, '&lt;').replace(/>/g, '&gt;');
                }, function () {
                    data1.familyHistory = '';
                });
                checkDom($("#auxiliary_info"), function () {//辅助检查
                    data1.auxiliaryInfo = $.trim($("#auxiliary_info").val()).replace(/</g, '&lt;').replace(/>/g, '&gt;');
                }, function () {
                    data1.auxiliaryInfo = '';
                });
                checkDom($("#diagnosis_basis"), function () {//诊断依据
                    data1.according = $.trim($("#diagnosis_basis").val()).replace(/</g, '&lt;').replace(/>/g, '&gt;');
                }, function () {
                    data1.according = '';
                });
                checkDom($("#diagnosis_identify"), function () {//鉴别诊断
                    data1.distinguish = $.trim($("#diagnosis_identify").val()).replace(/</g, '&lt;').replace(/>/g, '&gt;');
                }, function () {
                    data1.distinguish = '';
                });
                checkDom($("#treatment_record"), function () {//治疗过程
                    data1.treatmentRecord = $.trim($("#treatment_record").val()).replace(/</g, '&lt;').replace(/>/g, '&gt;');
                }, function () {
                    data1.treatmentRecord = '';
                });
                checkDom($("#product_info"), function () {//产品信息
                    data1.productInfo = $.trim($("#product_info").val()).replace(/</g, '&lt;').replace(/>/g, '&gt;');
                }, function () {
                    data1.productInfo = '';
                });
                checkDom($("#health_plan"), function () {//康复计划
                    data1.recoverPlan = $.trim($("#health_plan").val()).replace(/</g, '&lt;').replace(/>/g, '&gt;');
                }, function () {
                    data1.recoverPlan = '';
                });
                //临床转归
                $.each($(".ev-clinical .clinical i"), function (i, e) {
                    if ($(e).hasClass("active")) {
                        data1.outCome = $(e).attr("data-type");
                        return false;
                    } else {
                        data1.outCome = "";
                    }
                });

                function checkDom(dom, callback, cllbackNull) {
                    if (dom.parents(".nonEssential").css("display") != 'none') {
                        callback();
                    } else {
                        cllbackNull();
                    }
                }

                params.paramJson = $.toJSON(data1);
                comm.ajax.async(t.path.caseUpdate, params, function (rep) {
                    if (rep.responseObject.responseStatus) {//如果上传成功
                        if (t.isdraft == 1) {//如果是保存草稿则不跳转
                            t.config.offClick = true;
                            if (TempCache.getItem("activityProperty_area")) {//发布成功后将数据进行删除
                                TempCache.removeItem("activityProperty_area");
                            }
                            if (TempCache.getItem("activityProperty")) {
                                TempCache.removeItem("activityProperty");
                            }
                            g_sps.jump(null, "/pages/singlePage/upload-case.html?caseId=" + t.caseId + "&isDraft=1&t=" + $(document).scrollTop());
                        } else {
                            if (rep.responseObject.responseData.case_baseinfo) {
                                url = rep.responseObject.responseData.case_baseinfo.pageStoragePath;
                            } else {
                                url = "/";
                            }
                            $.topTip({mark: "success", content: "发布成功！审核通过后可在“我的-贡献”查看~"});

                            //0.判断url中是否有caseId，没有则为新建病例，需要弹层；
                            //                         有且同时有isDraft==1 时，表示由草稿发布，也需要弹层，其余情况不需要弹层
                            //1.获取标签列表
                            //2.添加标签dom
                            //3.判断是否至少选择了一个标签，有且至少有1个标签，则触发“确认”按钮可点击，点击后发送数据并跳转
                            //4.标签再次点击可取消选择状态，如果没有被选中的标签，则“确认”按钮不可点击
                            //5.点击弹层关闭按钮，则直接跳转
                            if (!t.para.caseId || (t.para.caseId && t.para.isDraft == 1)) {
                                t.addTagsFun(function () {
                                    g_sps.jump(null, url);
                                });
                            } else {
                                g_sps.jump(null, url);
                            }
                            if (TempCache.getItem("activityProperty_area")) {//发布成功后将数据进行删除
                                TempCache.removeItem("activityProperty_area");
                            }
                            if (TempCache.getItem("activityProperty")) {
                                TempCache.removeItem("activityProperty");
                            }
                            if (t.isdraft == 1) {
                                //事件埋点
                                comm.creatEvent({
                                    triggerType: "发布",
                                    refId: t.para.tId ? t.para.tId : '',
                                    keyword: "保存草稿",
                                    actionId: 37
                                });
                            } else {
                                //事件埋点
                                comm.creatEvent({
                                    triggerType: "发布",
                                    refId: t.para.tId ? t.para.tId : '',
                                    keyword: "发布病例",
                                    actionId: t.para.tId ? 34 : 33
                                });
                            }
                        }
                    } else {
                        $.topTip({mark: "warn", content: "未发布成功，请稍后再试！"});
                        t.config.offClick = true;
                    }
                }, false, function (data) {
                    t.config.offClick = true;
                })
            },
            //发布视频
            publicVideo: function () {
                var t = this;
                if (!t.uploadImgStatus) {
                    t.errorPop("图片上传中请稍候", 1);
                    t.config.offClick = true;
                    return false;
                }
                if (!t.videoUped) {//视频已上传完成后才能发布
                    t.errorPop("视频上传中请稍候", 1);
                    t.config.offClick = true;
                    return false;
                }
                if (t.uploadImgFail) {//有上传失败的图片不让提交发布
                    t.errorPop("有上传失败的图片，请处理完成后再发布", 1);
                    t.config.offClick = true;
                    return false;
                }
                if ($('.ev-treatment .ev-uploadVideoLi').length > 0) {//如果存在视频
                    //循环视频集参数
                    var paramArr = [];
                    var data2 = {};
                    $.each($('.ev-treatment .ev-uploadVideoLi'), function (i, el) {
                        data2 = {
                            key: $(el).attr("key") ? $(el).attr("key") : '',
                            persistentId: $(el).attr("persistentId"),
                            videoName: $(el).attr("videoName") ? $(this).attr("videoName") : '',
                            refType: 7,
                            caseId: t.caseId,
                            caseCategoryId: $(el).attr("casecategoryid"),
                            platformId: $("#sesDepartment").val(),
                            sortId: $(el).attr("videoSortId") ? $(el).attr("videoSortId") : ''
                        };
                        paramArr.push(data2);
                    });
                    var params2 = JSON.stringify(paramArr);
                    if (t.config.actStatus == 6) {
                        var popupHtml = '<div class="score_reminder_mask"><section class="score_reminder"><i></i>' +
                            '<h3>您参与的活动提交作品数已达上限</h3><p>此病例可直接发布到网站与同行交流</p>' +
                            '<div class="btn_box">' +
                            '<button class="btn_ensure">去发布</button>' +
                            '<button class="btn_cancel">知道了</button></div></section></div>';
                        $(".al-mainInner").append(popupHtml);
                        $(".score_reminder").css({
                            'left': '50%', 'top': '50%',
                            'margin-top': -$(".score_reminder").height() / 2,
                            'margin-left': -$(".score_reminder").width() / 2
                        });
                        $('body').css('overflow', 'hidden');
                        $('.btn_ensure').on('click', function () {
                            comm.ajax.async(t.path.addVideoInfo, {paramJson: params2}, function (rep) {
                                if (!(rep && rep.responseObject.responseStatus)) {
                                    if (rep.responseObject.responseMessage) {//没数据的时候不做提示
                                        $.topTip({mark: "warn", content: rep.responseObject.responseMessage});
                                    }
                                } else {
                                    t.publicCase();//发布病例
                                }
                            });
                        });
                        $('.btn_cancel,.score_reminder i').on('click', function () {
                            $('.score_reminder_mask').remove();
                            $('body').css('overflow', 'auto');
                            t.config.offClick = true;
                            t.submitBtn();
                        });
                    } else {
                        comm.ajax.async(t.path.addVideoInfo, {paramJson: params2}, function (rep) {
                            if (!(rep && rep.responseObject.responseStatus)) {
                                if (rep.responseObject.responseMessage) {//没数据的时候不做提示
                                    $.topTip({mark: "warn", content: rep.responseObject.responseMessage});
                                }
                            } else {
                                t.publicCase();//发布病例
                            }
                        });
                    }
                } else {
                    if (t.config.actStatus == 6) {
                        var popupHtml = '<div class="score_reminder_mask"><section class="score_reminder"><i></i>' +
                            '<h3>您参与的活动提交作品数已达上限</h3><p>此病例可直接发布到网站与同行交流</p>' +
                            '<div class="btn_box">' +
                            '<button class="btn_ensure">去发布</button>' +
                            '<button class="btn_cancel">知道了</button></div></section></div>';
                        $(".al-mainInner").append(popupHtml);
                        $(".score_reminder").css({
                            'left': '50%', 'top': '50%',
                            'margin-top': -$(".score_reminder").height() / 2,
                            'margin-left': -$(".score_reminder").width() / 2
                        });
                        $('body').css('overflow', 'hidden');
                        $('.btn_ensure').on('click', function () {
                            t.publicCase();//发布病例
                        });
                        $('.btn_cancel,.score_reminder i').on('click', function () {
                            $('.score_reminder_mask').remove();
                            $('body').css('overflow', 'auto');
                            t.config.offClick = true;
                            t.submitBtn();
                        });
                    } else {
                        t.publicCase();//发布病例
                    }
                }
            },
            //保存草稿
            saveDraft: function () {
                var t = this;
                $(".saveDraft").off("click").on("click", function () {
                    if (TempCache.getItem("userId")) {
                        if ($(".uploadCont").hasClass("active") && t.config.offClick != false) {
                            comm.creatEvent({
                                triggerType: "发布",
                                keyword: "保存草稿",
                                actionId: 11056,
                                locationId: $(this).parents("section").hasClass("uploadHeader") ? 1 : 2
                            });
                            t.config.offClick = false;
                            t.isdraft = 1;
                            t.publicVideo();//发布病例
                        }
                    } else {
                        g_sps.jump(null, "/");
                    }
                })
            },
            //错误提示
            errorPop: function (text, noScroll) {
                var t = this;
                if (noScroll) {

                } else {
                    $('body,html').animate({scrollTop: t.config.heigh}, 300);
                }
                $('.uploadCaseError').fadeIn(300).find('span').text(text);
                setTimeout(function () {
                    $('.uploadCaseError').fadeOut(300);
                }, 1000);
            },
            //手术项的相关操作
            operationName: function () {
                var t = this,
                    _popBox = $(".ev-addOpPop"),
                    _adBtn = $(".ev-addOpBtn"),
                    _oPopContext = $(".ev-opAlPopupMain"),
                    _saveBtn = $(".ev-opSaveBtn"),
                    _closePop = $(".ev-sureOpPop"),
                    _flagText = false;

                $.each($(".ev-FUNDetailOp"), function (i, e) {
                    var _textCh = $(e).find("textarea");
                    _textCh.textareaAutoHeight({minHeight: 26, maxHeight: 189});
                    if (_textCh.val() && $.trim(_textCh.val())) {
                        _flagText = true;
                        return false;
                    }
                });
                //添加手术及记录按钮唤起弹层
                _adBtn.off("click").on("click", function () {
                    if ($(this).attr("data-flag") == 1) {
                        $(this).attr("data-flag", "0");
                        _popBox.show();
                        if (comm.browser.isIe8()) {
                            _oPopContext.css({
                                'margin-top': -_oPopContext.height() / 2,
                                'margin-left': -_oPopContext.width() / 2
                            });
                        }
                        $('body').css('overflow', 'hidden');
                        t.opSortId++;
                        _saveBtn.attr({
                            "additionalId": "",
                            "opSortId": t.opSortId,
                            "id": ""
                        });
                        _adBtn.attr("data-flag", "1");
                        t.operationNameInput();
                    }
                });
                //手术记录弹层关闭按钮
                $(".ev-opCloseBtn").off("click").on("click", function () {
                    $.each($(".ev-FUNDetailOp"), function (i, e) {
                        var _textCh = $(e).find("textarea");
                        if (_textCh.val() && $.trim(_textCh.val())) {
                            _flagText = true;
                            return false;
                        }
                    });
                    if ($(".ev-opNameText").find(".ev-opName").length) {
                        _flagText = true;
                    }
                    if (_flagText) {//确认关闭提示显示
                        _closePop.show();
                    } else {
                        _popBox.hide();//弹层直接关闭
                        $('body').css('overflow', 'auto');
                        _saveBtn.removeClass("active").attr("data-flag", "1");
                    }
                    return false;
                });
                //手术记录确认关闭弹层点击事件处理
                $(".ev-opPopCancel").off("click").on("click", function (e) {//取消,停留在当前页
                    _closePop.hide();//确认关闭提示关闭，留在当前弹层页
                    return false;
                });
                //退出,弹层关闭
                $(".ev-opPopExit").off("click").on("click", function (e) {
                    _popBox.hide();//弹层直接关闭
                    if ($(".ev-opNameText").find(".ev-opName").length) {
                        $(".ev-opNameText").find(".ev-opName").remove();
                    }
                    $(".ev-FUNDetailOp textarea").val("");
                    $('body').css('overflow', 'auto');
                    _closePop.hide();//确认关闭提示关闭
                    _saveBtn.removeClass("active").attr("data-flag", "1");
                    return false;
                });
                //手术记录编辑完成保存按钮
                _saveBtn.off("click").on("click", function () {
                    if ($(this).attr("data-flag") == 1 && $(this).hasClass("active")) {
                        if ($(".ev-opName").text().length > 1000) {//手术记录验证文字1000
                            t.errorPop("手术名称不要超过1000字");
                        } else {
                            $(this).attr("data-flag", "0");
                            t.saveOpFun($(this));
                        }
                    }
                });
                t.opDeleteOrChange();
            },
            //手术记录的删除和修改按钮
            opDeleteOrChange: function () {
                var t = this,
                    _popBox = $(".ev-addOpPop"),
                    _oPopContext = $(".ev-opAlPopupMain");
                //手术记录修改按钮
                $('.ev-changeBtnOp').off("click").on("click", function () {
                    var _aId = $(this).attr("additionalId"),
                        _opSortId = $(this).attr("opSortId");
                    var cBack = function (res) {
                        if (res.responseObject.responseStatus) {
                            var item = res.responseObject.responseData.data_list[0];
                            _popBox.show().find(".ev-opSaveBtn").attr({
                                "additionalId": _aId,
                                "opSortId": _opSortId,
                                id: item.id
                            });
                            $(".ev-opNameText").html('<span class="atPersonal ev-opName">' + item.additionalName + '</span>');
                            $(".ev-opName").css("marginRight", "20px");
                            $(".ev-opContent textarea").val(item.content).focus();
                            if (comm.browser.isIe8()) {
                                _oPopContext.css({
                                    'margin-top': -_oPopContext.height() / 2,
                                    'margin-left': -_oPopContext.width() / 2
                                });
                            }
                            $('body').css('overflow', 'hidden');
                            t.popCheckFunOp();//弹层激活
                            t.operationNameInput();
                        }
                    };
                    comm.ajax.async(t.path.getPopDataOp, {
                        paramJson: $.toJSON({
                            caseId: t.caseId,
                            additionalType: 2,
                            sortType: 1,
                            isValid: 1,
                            additionalId: _aId
                        })
                    }, cBack);
                });

                //手术记录删除按钮
                $('.ev-deleteBtnOp').off("click").on("click", function () {
                    var $this = $(this);
                    $.makeSurePopup({
                        title: "删除手术记录",//弹窗标题
                        content01: "",//弹窗内容字体会加粗 (可不传)
                        content: "确定删除此条手术记录吗？",//弹窗内容
                        callback: function () {
                            var _additionalId = $this.attr("additionalId"),
                                _additionalName = $this.parents("li").find("span").text(),
                                _content = $this.parents("li").find("div.detailList").text(),
                                _sortId = $this.attr("opSortId");
                            var param = {
                                paramJson: $.toJSON({
                                    'caseId': t.caseId,
                                    'additionalId': _additionalId,
                                    'sortId': _sortId,
                                    'additionalType': 2,
                                    'content': _content,
                                    'isValid': 0,
                                    'additionalName': _additionalName
                                })
                            };
                            var cBack = function (res) {
                                if (res.responseObject.responseStatus) {
                                    $.each($(".ev-deleteBtnOp"), function (i, e) {
                                        if (_additionalId === $(e).attr("additionalId")) {
                                            $(e).parents("li").remove();
                                            return false;
                                        }
                                    });
                                }
                            };
                            comm.ajax.async(t.path.createPop, param, cBack);
                        }//点击确认后执行的方法（有发送请求时，是请求成功后执行的方法)
                    });
                });
            },
            popCheckFunOp: function () {
                var t = this,
                    _saveBtn = $(".ev-opSaveBtn"),
                    _saveFlag = false;
                if ($(".ev-opNameText").find(".ev-opName").length) {
                    _saveFlag = true;
                } else {
                    _saveFlag = false;
                }
                if (_saveFlag) {
                    _saveBtn.addClass("active");
                } else {
                    _saveBtn.removeClass("active");
                }
            },
            //保存手术名称和手术记录
            saveOpFun: function ($this) {
                var t = this,
                    additionalName = $(".ev-opNameText .ev-opName").eq(0).text(),
                    content = $(".ev-opContent textarea").val(),
                    _additionalId = $this.attr("additionalId"),
                    _sortId = $this.attr("opSortId");
                var _content = symbolToString(content);
                var _additionalName = symbolToString(additionalName);
                var param = {
                    paramJson: $.toJSON({
                        'caseId': t.caseId,
                        'additionalId': _additionalId ? _additionalId : "",
                        'sortId': _sortId,
                        'additionalType': 2,
                        'content': _content,
                        'isValid': 1,
                        'additionalName': _additionalName
                    })
                };
                var cBack = function (res) {
                    if (res.responseObject.responseStatus) {
                        var _apFlag = true;
                        $(".ev-addOpPop").hide();//添加随访记录弹层直接关闭
                        $('body').css('overflow', 'auto');
                        $(".ev-opSaveBtn").removeClass("active").attr("data-flag", "1");
                        $.each($(".ev-changeBtnOp"), function (i, e) {
                            if ($this.attr("additionalId") === $(e).attr("additionalId")) {
                                $(e).parents("li").find("span").text(_additionalName);
                                $(e).parents("li").find(".detailList").text(_content);
                                _apFlag = false;
                                return false;
                            }
                        });
                        if (_apFlag) {
                            $(".ev-funListOp").append('<li><aside class="time"><span>' + _additionalName + '</span>' +
                                '<p class="ev-changeBtnOp" ' +
                                'additionalId="' + res.responseObject.responsePk + '" opSortId="' + _sortId + '" id="' + ($this.attr("id") ? $this.attr("id") : '') + '">修改</p>' +
                                '<p class="ev-deleteBtnOp" ' +
                                'additionalId="' + res.responseObject.responsePk + '" opSortId="' + _sortId + '" id="' + ($this.attr("id") ? $this.attr("id") : '') + '">删除</p></aside>' +
                                '<div class="detailList">' + symbolToString(_content) + '</div></li>');
                        }
                        if ($(".ev-opNameText").find(".ev-opName").length) {
                            $(".ev-opNameText").find(".ev-opName").remove();
                        }
                        $(".ev-FUNDetailOp textarea").val("");
                        t.operationName();
                        t.opDeleteOrChange();
                    } else {
                        $(".ev-opSaveBtn").attr("data-flag", "1");
                    }
                };
                comm.ajax.async(t.path.createPop, param, cBack);
            },
            //手术名称，联想输入
            operationNameInput: function () {
                var t = this;
                var cpLock = true;
                var param = {};
                var timer = null;
                var _opName = $(".ev-operationName");
                var _opNameCon = _opName.find('.ev-opNameContent');
                var _opNameInput = _opName.find('input');
                var _opNameList = $('.ev-operationNameList');
                _opNameInput.on('compositionstart', function () {
                    cpLock = false;
                });
                _opNameInput.on('compositionend', function () {
                    cpLock = true;
                });
                _opNameInput.on("input propertychange", function () {
                    clearTimeout(timer);
                    timer = setTimeout(function () {
                        if (cpLock) {
                            opNamePerson();
                        }
                    }, 500);
                });
                _opNameInput.on("keydown", function (ev) {//8:删除
                    if ($(this).val() == '') {
                        if (ev.keyCode == "8") {
                            if ($(".ev-opName").length > 0) {
                                $(".ev-opName:last").remove();
                            }
                        }
                        t.popCheckFunOp();//弹层激活
                    }
                });
                _opNameInput.on("keyup", function (ev) {//8:删除
                    if ($(this).val() == '') {
                        $(".ev-opHide").hide();
                        _opNameList.html('');
                    }
                });

                function opNamePerson() {
                    if (_opNameInput.val() != '' && $.trim(_opNameInput.val())) {
                        param.paramJson = $.toJSON({
                            operationNameLike: _opNameInput.val(),
                            pageIndex: 1,
                            pageSize: 99999
                        });
                        comm.ajax.async(t.path.caseOperation, param, function (data) {//数据请求
                            if (data.responseObject.responseStatus) {
                                _opName.find(".arrow").show();
                                $(".ev-opHide").show();
                                _opNameList.html('');
                                var liHtml = '';
                                var dataList = data.responseObject.responseData.data_list;
                                $(".ev-opNReplace").text(comm.getStrByteLen(_opNameInput.val(), 16));
                                $(".ev-addOpName").off("click").on("click", function () {
                                    var remindHtml = '<span class="atPersonal ev-opName"></span>';
                                    //' + htmlToString(_opNameInput.val()) + '
                                    if ($(".ev-opName").length) {

                                        $(".ev-opNameText").html(remindHtml);
                                        $('.ev-opNameText .ev-opName').text((_opNameInput.val()));
                                    } else {
                                        $(".ev-opNameText").append(remindHtml);
                                        $('.ev-opNameText .ev-opName').text((_opNameInput.val()));
                                    }
                                    _opNameInput.val('');
                                    $(".ev-opName").css("marginRight", "20px");
                                    $(".ev-opHide").hide();
                                    t.popCheckFunOp();//弹层激活
                                });
                                if (dataList) {
                                    $.each(dataList, function (i, e) {
                                        liHtml += '<li id="' + e.id + '"><span>' + e.operationName + '</span></li>';
                                    });
                                    _opNameList.append(liHtml);
                                    _opNameList.find("li").on("click", function () {
                                        var $this = $(this);
                                        _opNameInput.val('');
                                        var _clickFlag = true;
                                        var cusName = $(this).find("span").text();
                                        if ($(".ev-opName").length) {
                                            $.each($(".ev-opName"), function (k, v) {
                                                if ($(v).attr("id") == $this.attr('id')) {
                                                    $(v).remove();
                                                    _clickFlag = false;
                                                    return false;
                                                }
                                            });
                                        }
                                        if (_clickFlag) {
                                            var remindHtml = '<span class="atPersonal ev-opName" id="' + $this.attr("id") + '">' + symbolToString(cusName) + '</span>';
                                            if ($(".ev-opName").length) {
                                                $(".ev-opNameText").html(remindHtml);
                                            } else {
                                                $(".ev-opNameText").append(remindHtml);
                                            }
                                            $(".ev-opName").css("marginRight", "20px");
                                        }
                                        $(".ev-opHide").hide();
                                        t.popCheckFunOp();//弹层激活
                                    });
                                }
                                //联想在上方
                                if ($(".ev-opNameListPopup").height() > $(window).height() - _opName.offset().top + $(window).scrollTop() - 90) {
                                    _opNameCon.addClass("positionTop");
                                } else {
                                    _opNameCon.removeClass("positionTop");
                                }
                            }
                        });
                    }
                }
            },
            //诊断，联想输入
            diagnosis: function () {
                var t = this;
                var cpLock = true;
                var param = {};
                var timer = null;
                var _dia = $(".ev-diagnosis"),
                    _diaIn = $(".ev-diagnosis input"),
                    _diaList = $(".ev-diagnosisList"),
                    _hideList = $(".ev-diaHide"),
                    _diaText = $(".diagnosisText");
                _diaIn.on('compositionstart', function () {
                    cpLock = false;
                });
                _diaIn.on('compositionend', function () {
                    cpLock = true;
                });
                _diaIn.on("input propertychange", function () {
                    clearTimeout(timer);
                    timer = setTimeout(function () {
                        if (cpLock) {
                            diagnosisPerson();
                        }
                    }, 500);
                });
                _diaIn.on("keydown", function (ev) {//8:删除
                    if ($(this).val() == '') {
                        if (ev.keyCode == "8") {
                            if ($(".ev-diag").length > 0) {
                                $(".ev-diag:last").remove();
                            }
                            if (_diaText.find("span").length <= 0) {
                                t.flag.uploadFlag = false;
                                t.checkAll();
                            }
                        }
                    }
                });
                _diaIn.on("keyup", function (ev) {//8:删除
                    if ($(this).val() == '') {
                        _hideList.hide();
                        _diaList.html('');
                    }
                });

                function diagnosisPerson() {
                    if (_diaIn.val() != '' && $.trim(_diaIn.val())) {
                        param.paramJson = $.toJSON({
                            illnessName: _diaIn.val(),
                            pageIndex: 1,
                            pageSize: 99999
                        });
                        comm.ajax.async(t.path.caseDiagnosis, param, function (data) {//数据请求
                            if (data.responseObject.responseStatus) {
                                _hideList.show();
                                _diaList.html('');
                                var liHtml = '';
                                var dataList = data.responseObject.responseData.data_list;
                                $(".ev-diaReplace").text(comm.getStrByteLen(_diaIn.val(), 16));
                                $(".ev-addDiagnosis").off("click").on("click", function () {
                                    var remindHtml = '<span class="atPersonal ev-diag"></span>';
                                    _diaText.append(remindHtml);
                                    $('.ev-diag').eq($('.ev-diag').length - 1).text(symbolToString(_diaIn.val()));
                                    //' + htmlToString(_diaIn.val()) + '
                                    _diaIn.val('');
                                    $(".ev-diag").css("marginRight", "20px");
                                    $("#diagnosis_info").focus();
                                    if ($(".ev-caseInfoUp").text() == "收起" && $(".supplement").css("display") != "none") {
                                        t.config.heigh = _dia.offset().top - 90 - 150;
                                    } else {
                                        t.config.heigh = _dia.offset().top - 90;
                                    }
                                    _hideList.hide();
                                    if ($(".ev-diag").length) {
                                        t.diagnosisFlag = true;//存在诊断
                                        $(".ev-diagnosis").removeClass("error");
                                    } else {
                                        t.diagnosisFlag = false;//不存在诊断
                                        $(".ev-diagnosis").addClass("error");
                                    }
                                    t.checkAll();
                                });
                                if (dataList) {
                                    $.each(dataList, function (i, e) {
                                        liHtml += '<li id="' + e.id + '"><span>' + e.illnessName + '</span></li>';
                                    });
                                    _diaList.append(liHtml);
                                    $(".ev-diagnosisList li").on("click", function () {
                                        var $this = $(this);
                                        _diaIn.val('');
                                        var _clickFlag = true;
                                        var cusName = $(this).find("span").text();
                                        if ($(".ev-diag").length) {
                                            $.each($(".ev-diag"), function (k, v) {
                                                if ($(v).attr("id") == $this.attr('id')) {
                                                    $(v).remove();
                                                    _clickFlag = false;
                                                    return false;
                                                }
                                            });
                                        }
                                        if (_clickFlag) {
                                            var remindHtml = '<span class="atPersonal ev-diag" id="' + $this.attr('id') + '">' + symbolToString(cusName) + '</span>';
                                            _diaText.append(remindHtml);
                                            $(".ev-diag").css("marginRight", "20px");
                                            $("#diagnosis_info").focus();
                                        }
                                        if ($(".ev-caseInfoUp").text() == "收起" && $(".supplement").css("display") != "none") {
                                            t.config.heigh = _dia.offset().top - 90 - 150;
                                        } else {
                                            t.config.heigh = _dia.offset().top - 90;
                                        }
                                        _hideList.hide();
                                        if ($(".ev-diag").length) {
                                            t.diagnosisFlag = true;//存在诊断
                                            $(".ev-diagnosis").removeClass("error");
                                        } else {
                                            t.diagnosisFlag = false;//不存在诊断
                                            $(".ev-diagnosis").addClass("error");
                                        }
                                        t.checkAll();
                                    });
                                }
                                //联想在上方
                                if ($(".ev-diagnosisListPopup").height() > $(window).height() - _dia.offset().top + $(window).scrollTop() - 90) {
                                    $(".ev-diaContent").addClass("positionTop");
                                } else {
                                    $(".ev-diaContent").removeClass("positionTop");
                                }
                            }
                        })
                    }
                }
            },
            //提醒谁看
            remind: function () {
                var t = this;
                var cpLock = true;
                var param = {};
                var timer = null;
                $(".ev-remind input").on('compositionstart', function () {
                    cpLock = false;
                });
                $(".ev-remind input").on('compositionend', function () {
                    cpLock = true;
                });
                $(".ev-remind input").on("input propertychange", function () {
                    clearTimeout(timer);
                    timer = setTimeout(function () {
                        if (cpLock) {
                            remindPerson();
                        }
                    }, 500);
                });
                $(".ev-remind input").on("keydown", function (ev) {//8:删除
                    if ($(this).val() == '') {
                        if (ev.keyCode == "8") {
                            if ($(".ev-atPerson").length > 0) {
                                $(".ev-atPerson:last").remove();
                                $(".aitNum").text($(".ev-atPerson").length + '/10');
                            }
                            if ($(".ev-atNameText").find("span").length <= 0) {
                                t.flag.uploadFlag = false;
                                t.checkAll();
                            }
                        }
                    }
                });
                $(".ev-remind input").on("keyup", function (ev) {//8:删除
                    if ($(this).val() == '') {
                        $(".ev-atPosition").hide();
                        $(".ev-atPosition").html('');
                        $(".ev-remind .arrow").hide();
                    }
                });

                function remindPerson() {
                    if ($(".ev-remind input").val() != '') {
                        param.paramJson = $.toJSON({
                            useFlag: 3,
                            searchParam: $(".ev-remind input").val(),
                            isCUnite: 0,
                            isCStatistics: 0,
                            isCFPeople: 0,
                            pageIndex: 1,
                            pageSize: 30,
                            isAuthState: 1
                        });
                        comm.ajax.async(t.path.caseRemind, param, function (data) {//数据请求
                            if (data.responseObject.responseStatus) {
                                $(".ev-remind .arrow").show();
                                $(".ev-atPosition").show();
                                $(".ev-atPosition").html('');
                                var liHtml = '';
                                var dataList = data.responseObject.responseData.data_list;
                                if (dataList) {
                                    $.each(dataList, function (i, e) {
                                        liHtml += '<li data-customerId="' + dataList[i].customer_baseinfo.customerId + '"><img src="' + dataList[i].customer_att.logoUrl + '"><span>' + dataList[i].customer_auth.lastName + '' + dataList[i].customer_auth.firstName + '</span>' +
                                            '<i>' + dataList[i].customer_auth.company + '</i></li>';
                                    });
                                    $(".ev-atPosition").append(liHtml);
                                    $(".ev-atPosition li").on("click", function () {
                                        if ($(".ev-atPerson").length <= 9) {
                                            $(".ev-remind input").val('');
                                            var customerId = $(this).attr("data-customerId");
                                            var cusName = $(this).find("span").text();
                                            var remindHtml = '<span class="atPersonal ev-atPerson" data-customer="' + customerId + '">@' + cusName + '</span>';
                                            $(".ev-atNameText").append(remindHtml);
                                            $(".ev-atPerson").css("marginRight", "20px");
                                            $(".aitNum").text($(".ev-atPerson").length + '/10');
                                        } else {
                                            if ($(".ev-caseInfoUp").text() == "收起" && $(".supplement").css("display") != "none") {
                                                t.config.heigh = $(".ev-remind").offset().top - 90 - 150;
                                            } else {
                                                t.config.heigh = $(".ev-remind").offset().top - 90;
                                            }
                                            $(".ev-atContent input").val("");
                                            t.errorPop("@不能超过十人");
                                        }
                                        $(".ev-remind .arrow").hide();
                                        $(".ev-atPosition").hide();
                                        t.flag.uploadFlag = true;//存在@某人
                                        t.checkAll();
                                    });
                                }
                                //联想在上方
                                if ($(".ev-atPosition").height() > $(window).height() - $(".ev-remind").offset().top + $(window).scrollTop() - 90) {
                                    $(".ev-atContent").addClass("positionTop");
                                } else {
                                    $(".ev-atContent").removeClass("positionTop");
                                }
                            }
                        })
                    }
                }
            },
            //编辑病例时获取图片
            getImgList: function (data) {
                var t = this;
                var html1 = "", html2 = "", html3 = "", html4 = "";
                if (data.length > 0) {
                    $.each(data, function (i, val) {
                        if (val.caseCategoryId == 1) {//治疗前
                            html1 += '<li class="imagesUploadBtn ev-uploadImgLi" listId="' + val.id + '" caseCategoryId="' + val.caseCategoryId + '">' +
                                '<div class="imagesUploadPath ev-uploadImgPath"><img src="' + val.attUrl + '"/></div>' +
                                '<figure class="ev-removeImg"><img src="//img10.allinmd.cn/v3/upload_case/close.png"> </figure>' +
                                '<textarea placeholder="请输入图片描述" class="case_att_name">' + val.caseAttName + '</textarea><b class="imageAttNum ev-attNum">100</b>' +
                                '</li>';
                        } else if (val.caseCategoryId == 2) {//治疗中
                            html2 += '<li class="imagesUploadBtn ev-uploadImgLi" listId="' + val.id + '" caseCategoryId="' + val.caseCategoryId + '">' +
                                '<div class="imagesUploadPath ev-uploadImgPath"><img src="' + val.attUrl + '"/></div>' +
                                '<figure class="ev-removeImg"><img src="//img10.allinmd.cn/v3/upload_case/close.png"> </figure>' +
                                '<textarea placeholder="请输入图片描述" class="case_att_name">' + val.caseAttName + '</textarea><b class="imageAttNum ev-attNum">100</b>' +
                                '</li>';
                        } else if (val.caseCategoryId == 3) {//治疗后
                            html3 += '<li class="imagesUploadBtn ev-uploadImgLi" listId="' + val.id + '" caseCategoryId="' + val.caseCategoryId + '">' +
                                '<div class="imagesUploadPath ev-uploadImgPath"><img src="' + val.attUrl + '"/></div>' +
                                '<figure class="ev-removeImg"><img src="//img10.allinmd.cn/v3/upload_case/close.png"> </figure>' +
                                '<textarea placeholder="请输入图片描述" class="case_att_name">' + val.caseAttName + '</textarea><b class="imageAttNum ev-attNum">100</b>' +
                                '</li>';
                        }
                    });
                    $(".ev-uploadImgPar ul").eq(0).append(html1);
                    $(".ev-uploadImgPar ul").eq(1).append(html2);
                    $(".ev-uploadImgPar ul").eq(2).append(html3);
                    $(".ev-recImgVideo").append(html4);
                    $(".ev-treatment .ev-uploadImgLi").each(function (i, em) {
                        t.removeImg($(em));
                        comm.textChangeNew({
                            $tex: $(em).find("textarea"),//输入框
                            $num: $(em).find(".ev-attNum"),//存放数字的元素
                            inputIng: function () {
                                $(em).find(".ev-attNum").show();
                            },//输入中回调函数
                            inputFinish: function () {
                                $(em).find(".ev-attNum").hide();
                            }//输入完成回调函数
                        });
                    })
                }
                // t.sortId = data.length ? data[data.length - 1].sortId : 0;
                // var maxSortId=0;
                for (var i = 0; i < data.length; i++) {
                    if (data[i].sortId > t.sortId) {
                        t.sortId = data[i].sortId;
                    }
                }
                // t.sortId = maxSortId;
                t.uploadImg();
            },
            //获取视频信息
            getVideoList: function (data) {
                var t = this;
                var html1 = "", html2 = "", html3 = "", html4 = "";
                t.videoListId = "";
                t.videoUped = 1;//默认视频上传成功的状态
                t.uploadVideoBind();
                $.each(data, function (i, val) {
                    var attUrl = val.logoUrl;
                    var play_icon = '<i class="uploadVideoIcon"><img src="//img10.allinmd.cn/v3/common/icon/video_btn.png" alt=""></i>';
                    if (attUrl.lastIndexOf("default") > 0) {
                        attUrl = "//img10.allinmd.cn/default/qiniu196_196.jpg";
                        play_icon = "";
                    }
                    if (val.caseCategoryId == 1) {//治疗前
                        html1 += '<li class="imagesUploadBtn ev-uploadVideoLi" videoSortId="' + val.sortId + '" listId="' + val.attId + '" caseCategoryId="' + val.caseCategoryId + '">' +
                            '<div class="imagesUploadPath ev-uploadVideoPath"><img src="' + attUrl + '"/></div>' +
                            '<figure class="ev-removeVideo"><img src="//img10.allinmd.cn/v3/upload_case/close.png"> </figure>' +
                            play_icon +
                            '</li>';
                    } else if (val.caseCategoryId == 2) {//治疗中
                        html2 += '<li class="imagesUploadBtn ev-uploadVideoLi" videoSortId="' + val.sortId + '" listId="' + val.attId + '" caseCategoryId="' + val.caseCategoryId + '">' +
                            '<div class="imagesUploadPath ev-uploadVideoPath"><img src="' + attUrl + '"/></div>' +
                            '<figure class="ev-removeVideo"><img src="//img10.allinmd.cn/v3/upload_case/close.png"> </figure>' +
                            play_icon +
                            '</li>';
                    } else if (val.caseCategoryId == 3) {//治疗后
                        html3 += '<li class="imagesUploadBtn ev-uploadVideoLi" videoSortId="' + val.sortId + '" listId="' + val.attId + '" caseCategoryId="' + val.caseCategoryId + '">' +
                            '<div class="imagesUploadPath ev-uploadVideoPath"><img src="' + attUrl + '"/></div>' +
                            '<figure class="ev-removeVideo"><img src="//img10.allinmd.cn/v3/upload_case/close.png"> </figure>' +
                            play_icon +
                            '</li>';
                    }
                });
                $(".ev-uploadImgPar ul").eq(0).append(html1);
                $(".ev-uploadImgPar ul").eq(1).append(html2);
                $(".ev-uploadImgPar ul").eq(2).append(html3);
                $(".ev-recImgVideo").append(html4);
                //删除视频
                $(".ev-treatment .ev-uploadVideoLi").each(function (i, em) {
                    t.videoRemove($(em));
                });
            },
            //上传图片
            uploadImg: function () {
                $(document).on('mouseover', ".imagesUploadBtn input", function () {
                    $(this).prev('p').addClass("active");
                });
                $(document).on('click', ".imagesUploadBtn input", function () {
                    $(this).prev('p').removeClass("active");
                });
                $(document).on('mouseleave', ".imagesUploadBtn input", function () {
                    $(this).prev('p').removeClass("active");
                });
                var t = this;
                t.imgFailNum = 0;
                t.uploadImgFail = false;//上传失败的状态
                t.uploadImgStatus = true;
                window.uploadCount = t.sortId || 0;
                $(".ev-uploadImgPar").each(function (i, em) {
                    $('.ev-uploadImgCon', $(em)).each(function () {
                        var _t = $(this);
                        var _additionalId = "",
                            _url = t.path.caseAttCreate;
                        if (t.uploadImgAdditionanl == true) {
                            _additionalId = $(".ev-popSaveBtn").attr('additionalId') ? $(".ev-popSaveBtn").attr('additionalId') : '';
                            _url = t.path.additionalUpload;
                        }
                        _t.uploadImg({
                            ajaxData: {
                                url: _url
                            },
                            multiple: true,
                            inputStyle: {
                                height: '185px',
                                "z-index": 2
                            },
                            formData: {
                                caseId: t.caseId,
                                sortId: t.sortId,
                                additionalId: _additionalId,
                                customerId: $("#sesCustomerId").val() ? $("#sesCustomerId").val() : ''
                            },
                            fileSelected: function (file) {
                                var type = file.type;
                                // window.uploadCount =  _t.parents(".ev-uploadImgPar").find("ul li").length+1;
                                t.sortId++;
                                window.uploadCount = t.sortId || 0;
                                if ((/(jpg)|(jpeg)|(png)$/i.test(type))) {
                                    var fileSize = file.size;
                                    if (fileSize > 10 * 1048576) {
                                        t.errorPop("图片过大，请联系在线客服寻求帮助", 1);
                                        return false;
                                    }
                                } else {
                                    t.errorPop("格式不支持，请选择jpg、png、jpeg", 1);
                                    return false;
                                }
                                t.uploadImgStatus = false;//上传图片的状态：正在上传中
                                var $ul = _t.parents(".ev-uploadImgPar").find("ul");
                                var html = '<div class="imagesUploadPath ev-uploadImgPath"><img src="' + t.localURL(file) + '"/></div>' +
                                    '<figure class="ev-removeImg hide"><img src="//img10.allinmd.cn/v3/upload_case/close.png"> </figure>' +
                                    '<div class="transparentMask ev-uploadImgProgress"><div class="uploading"><i></i><span style="color: #fff;">0%</span></div></div>' +
                                    '<div class="transparentMask ev-uploadImgfail hide"><div class="uploadFail">上传失败<br>请重新上传</div></div>' +
                                    '<textarea placeholder="请输入图片描述" class="case_att_name"></textarea><b class="imageAttNum ev-attNum">100</b>';
                                var data = {};
                                data.context = $('<li class="imagesUploadBtn ev-uploadImgLi" caseCategoryId="' + (i + 1) + '"></li>').append(html);
                                file.context = data.context;
                                $ul.append(data.context);
                                comm.textChangeNew({
                                    $tex: data.context.find("textarea"),//输入框
                                    $num: data.context.find(".ev-attNum"),//存放数字的元素
                                    inputIng: function () {
                                        data.context.find(".ev-attNum").show();
                                    },//输入中回调函数
                                    inputFinish: function () {
                                        data.context.find(".ev-attNum").hide();
                                    }//输入完成回调函数
                                });
                            },
                            uploadBefore: function (file) {
                                file.progress = 0;
                                var node = $(file.context).find("span");
                                //假进程
                                var step = 10;
                                var count = 90;
                                if (file.size > 4 * 1024 * 1024) {
                                    step = 1;
                                    count = 99;
                                } else if (file.size > 2 * 1024 * 1024) {
                                    step = 5;
                                    count = 90;
                                }
                                file.timer = setInterval(function () {
                                    if (file.progress < count) {
                                        file.progress += step;
                                        node.text(file.progress + "%");
                                    } else {
                                        clearInterval(file.timer);
                                    }
                                }, 50);
                            },
                            uploadSuccess: function (data, file) {
                                $('canvas').hide();//发布上传多余隐藏
                                var response = data;
                                var node = $(file.context);
                                node.find(".uploading span").html('100%');
                                node.find(".ev-uploadImgProgress").hide();
                                if (response && response.responseObject && response.responseObject.responseStatus) {
                                    node.attr("listId", response.responseObject.responsePk);
                                    node.find(".ev-removeImg").show();//删除按钮显示
                                    t.removeImg(node);
                                    t.removePopImg(node);
                                } else {
                                    t.imgFailNum++;//上传失败的张数修改
                                    t.uploadImgFail = true;
                                    node.find(".ev-removeImg").show();//删除按钮显示
                                    node.find(".ev-uploadImgProgress").hide();//加载loading隐藏
                                    node.find(".ev-uploadImgfail").show();//失败提示
                                    t.errorPop("图片上传失败,请重新上传", 1);
                                    //点击删除
                                    node.find(".ev-removeImg").on("click", function () {
                                        t.imgFailNum--;//上传失败的张数修改
                                        if (t.imgFailNum == 0) {//上传失败的删除状态判断
                                            t.uploadImgFail = false;
                                        }
                                        node.remove();
                                    });
                                }
                                t.flag.upImgFlag = true;
                                t.uploadImgStatus = true;
                                t.uploadStatrus = true;
                                t.checkAll();
                            }
                        });
                    });
                });
            },
            //返回预览地址
            localURL: function (file) {
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
            removeImg: function ($this) {
                var t = this;
                $this.find(".ev-removeImg").on("click", function () {
                    if ($this.parents('.ev-uploadImgPar').hasClass("ev-treatment")) {
                        t.deleteAttIds += $this.attr("listId") + ",";
                        if ($(".ev-uploadImgLi").length <= 0) {
                            t.flag.upImgFlag = false;
                        }
                        t.checkAll();
                        $this.remove();
                    }
                });
            },
            //上传视频
            uploadVideoBind: function () {
                var t = this;
                $(".ev-uploadImgPar").each(function (i, em) {
                    $(".ev-uploadVideoCon", $(em)).each(function (k, v) {
                        t.uploadVideo(i, $(v));
                    });
                });
            },
            //上传视频
            uploadVideo: function (i, obj) {
                var t = this;
                var _objBox = obj.parents(".ev-uploadImgPar");
                t.videoUped = 1;//视频上传成功的状态
                t.uploadStatrus = true;//允许上传
                t.context = '';//正在上传的元素
                var videoSortId = 0;
                var video = videoUpload({
                    obj: "#" + obj.attr("id"),
                    flash_swf_url: '//paas.allinmd.cn/modules/video_upload/plupload/Moxie.swf',
                    dragdrop: true,
                    max_file_size: 80,
                    uptoken_url: t.path.getToken,
                    domain: '//' + location.hostname,
                    pluploadEach: function (file) {//每个文件添加队列后执行
                        if (!t.uploadStatrus) {
                            return;
                        }
                        if (t.uploadImgAdditionanl == true) {
                            videoSortId = parseInt($(".ev-additionalPop .ev-uploadVideoLi:last").attr("videoSortId")) || 0;
                        } else {
                            videoSortId = parseInt($(".ev-uploadVideoLi:last", _objBox).attr("videoSortId")) || 0;
                        }
                        // if (t.uploadImgAdditionanl == true) {
                        videoSortId++;
                        // }
                        t.videoUped = 0;
                        var html = '<div class="imagesUploadPath ev-uploadVideoPath"><img src=""/></div>' +
                            '<figure class="ev-removeVideo hide"><img src="//img10.allinmd.cn/v3/upload_case/close.png"> </figure>' +
                            '<div class="transparentMask ev-uploadVideoProgress"><div class="uploading"><i></i><span style="color: #fff;">0%</span></div></div>' +
                            '<div class="transparentMask ev-uploadVideofail hide"><div class="uploadFail">上传失败<br>请重新上传</div></div>';
                        var data = {};
                        data.context = $('<li class="imagesUploadBtn ev-uploadVideoLi" caseCategoryId="' + (i + 1) + '"' +
                            ' videoSortId="' + videoSortId + '" videoName="' + file.name + '"></li>').append(html);
                        file.context = data.context;
                        _objBox.find("ul").append(data.context);
                    },
                    beforeUpload: function (file) {//文件上传之前
                        t.uploadStatrus = true;
                        var name = comm.file.getName(file.name);
                        var fileName = name.fileName;
                        var suffix = name.suffixName;
                        if ((/(mp4)|(mov)|(avi)|(wmv)|(flv)$/i.test(suffix))) {
                            var fileSize = file.size;
                            if (fileSize > 80 * 1048576) {
                                t.errorPop("视频过大，请联系在线客服寻求帮助", 1);
                                video.uploader.removeFile(video.uploader.getFile(file.id));
                                t.uploadStatrus = false;
                                return false;
                            }
                        } else {
                            t.errorPop("格式不支持，请选择mov、mp4、avi、wmv、flv", 1);
                            video.uploader.removeFile(video.uploader.getFile(file.id));
                            t.uploadStatrus = false;
                            return false;
                        }
                        var videoName = fileName.length > 15 ? fileName.substring(0, 15) + '...' + '.' + suffix : fileName + '.' + suffix;
                    },
                    uploadProgress: function (file) {//上传进度条
                        var node = $(file.context);
                        t.context = node;
                        node.find(".ev-uploadVideoProgress span").text(file.percent + "%");
                        if (file.percent == 100) {
                            node.find(".ev-uploadVideoProgress").remove();
                        }
                        obj.parents(".imagesUploadBtn").hide();

                    },
                    fileUploaded: function (dataJson, file) {//上传成功
                        t.videoUped = 1;
                        var node = $(file.context);
                        node.attr({'key': dataJson.key, 'persistentId': dataJson.persistentId});
                        node.find(".ev-uploadVideoPath img").attr("src", "//img10.allinmd.cn/default/qiniu196_196.jpg");
                        obj.siblings(".moxie-shim").remove();
                        t.flag.upVideoFlag = true;
                        t.checkAll();
                        t.videoRemove(node);
                        t.removePopVideo(node);
                        t.uploadVideo(i, obj);
                        obj.parents(".imagesUploadBtn").show();
                    },
                    fileUploadError: function (file) {
                        var node = t.context;
                        node.find(".ev-uploadVideoProgress").remove();
                        node.find(".ev-uploadVideofail").show();
                        t.errorPop("视频上传失败,请重新上传", 1);
                        t.videoRemove(node);
                        t.removePopVideo(node);
                        t.uploadVideo(i, obj);
                        obj.parents(".imagesUploadBtn").show();
                    }
                })
            },
            //删除视频
            videoRemove: function ($this) {
                var t = this;
                $this.find('.ev-removeVideo').show().off("click").on("click", function () {
                    if ($this.parents('.ev-uploadImgPar').hasClass("ev-treatment")) {
                        var videoId = '';
                        if($(this).parent().attr("listId") !== undefined)
                            videoId = $(this).parent().attr("listId") + ',';
                        t.videoListId += videoId;

                        if(t.videoListId === 'undefined') t.videoListId = '';

                        // t.uploadVideoBind();
                        if ($(".ev-uploadVideoLi").length <= 0) {
                            t.flag.upVideoFlag = false;
                        }
                        t.checkAll();
                        $this.remove();
                    }
                });
            },
            //添加随访记录的点击事件和验证事件
            addAlPopup: function () {
                var t = this,
                    _popMain = $(".ev-alPopupMain");
                //随访记录文字验证保存按钮
                var _numTe = $(".ev-FUNDetail b");
                var _textCh = $(".ev-FUNDetail textarea");
                _textCh.textareaAutoHeight({minHeight: 26, maxHeight: 189});
                comm.textChangeNew({//新版病例发布倒记数功能
                    $tex: _textCh,//输入框
                    $num: _numTe,//存放数字的元素
                    judgmentCE: 0,//需要中英文区分 默认0
                    inputSurpass: function () {
                    }//输入超出回调函数
                });
                //随访记录项随访时间键入检测
                t.writeAge($("#addYears"));
                t.writeAge($("#addMonth"));
                $(".ev-timeFUN input").on("input", function () {
                    t.popCheckFun();
                });
                //添加随访记录按钮点击  唤醒弹层
                $(".ev-addAPBtn").off("click").on("click", function () {
                    if ($(this).attr("data-flag") == 1) {
                        $(this).attr("data-flag", "0");
                        var cBack = function (res) {
                            if (res.responseObject.responseStatus) {
                                $(".ev-alPopup").show();
                                if (comm.browser.isIe8()) {
                                    _popMain.css({
                                        'margin-top': -_popMain.height() / 2,
                                        'margin-left': -_popMain.width() / 2
                                    });
                                }
                                $('body').css('overflow', 'hidden');
                                t.addSortId++;
                                $(".ev-popSaveBtn").attr({
                                    "additionalId": res.responseObject.responsePk,
                                    addSortId: t.addSortId,
                                    id: ""
                                });
                                t.uploadImgAdditionanl = true;
                                t.uploadImg();//上传图片重新调用
                                $(".ev-addAPBtn").attr("data-flag", "1");
                            } else {//点击容错
                                $(".ev-addAPBtn").attr("data-flag", "1");
                                t.addAlPopup();
                            }
                        };
                        comm.ajax.async(t.path.createPop, {
                            paramJson: $.toJSON({
                                'caseId': t.caseId,
                                'additionalType': 1
                            })
                        }, cBack);
                    }
                });
                //添加随访记录弹层关闭按钮
                $(".ev-cloIBtn").off("click").on("click", function () {
                    if (t.popCheckFun()) {
                        $(".ev-closeRemind").show();//确认关闭提示显示
                    } else {
                        $(".ev-alPopup").hide();//添加随访记录弹层直接关闭
                        $('body').css('overflow', 'auto');
                        $(".ev-popSaveBtn").removeClass("active").attr("data-flag", "1");
                        t.uploadImgAdditionanl = false;
                        t.uploadImg();//上传图片重新调用
                    }
                    return false;
                });
                //随访记录确认关闭弹层点击事件处理
                $(".ev-cancelNow").off("click").on("click", function (e) {//取消,停留在当前页
                    $(".ev-closeRemind").hide();//确认关闭提示关闭，留在当前弹层页
                    e.stopPropagation()
                });
                $(".ev-signOut").off("click").on("click", function (e) {//退出,弹层关闭
                    $(".ev-alPopup").hide();//添加随访记录弹层直接关闭
                    $('body').css('overflow', 'auto');
                    $(".ev-closeRemind").hide();//确认关闭提示关闭
                    $(".ev-timeFUN input").val("");//置空时间选项
                    $(".ev-FUNDetail textarea").val("");//置空时间选项
                    $(".ev-recImgVideo").find("li").remove();//视频图片移除
                    $(".ev-popSaveBtn").removeClass("active").attr("data-flag", "1");
                    t.uploadImgAdditionanl = false;
                    t.uploadImg();//上传图片重新调用
                    e.stopPropagation()
                });
                //随访记录编辑完成保存按钮
                $(".ev-popSaveBtn").off("click").on("click", function () {
                    if ($(this).attr("data-flag") == 1 && $(this).hasClass("active")) {
                        $(this).attr("data-flag", "0");
                        t.saveAddFun($(this));
                    }
                });
                t.adDeleteOrChange();
            },
            //随访记录的删除和修改
            adDeleteOrChange: function () {
                var t = this,
                    _popMain = $(".ev-alPopupMain");
                //随访记录文字验证保存按钮
                var _textCh = $(".ev-FUNDetail textarea");
                //随访记录修改按钮
                $('.ev-changeBtn').off("click").on("click", function () {
                    var _aId = $(this).attr("additionalId"),
                        _addSortId = $(this).attr("addSortId");
                    var cBack = function (res) {
                        if (res.responseObject.responseStatus) {
                            var item = res.responseObject.responseData.data_list[0],
                                _time = item.additionalOption,
                                _year = _time.substr(0, _time.indexOf("_")),
                                _month = _time.substr(_time.indexOf("_") + 1);
                            var _timeInput = $(".ev-timeFUN input");
                            _timeInput.eq(0).val(_year == 0 ? '' : _year);//年
                            _timeInput.eq(1).val(_month == 0 ? '' : _month);//月
                            _textCh.val(item.content);//随访记录详情
                            var _imgHtml = "";
                            $.each(item.attachmentPicList, function (i, e) {//图片列表
                                _imgHtml += '<li class="imagesUploadBtn ev-uploadImgLi" listId="' + e.id + '" attType="' + e.attType + '">' +
                                    '<div class="imagesUploadPath ev-uploadImgPath"><img src="' + e.attUrl + '"/></div>' +
                                    '<figure class="ev-removeImg"><img src="//img10.allinmd.cn/v3/upload_case/close.png"> </figure>' +
                                    '<textarea placeholder="请输入图片描述" class="case_att_name">' + e.caseAttName + '</textarea><b class="imageAttNum ev-attNum">100</b>' + /*' + e.caseAttName + '*/
                                    '</li>';
                            });
                            $(".ev-recImgVideo").append(_imgHtml);
                            var _videoHtml = "";
                            $.each(item.attachmentVideoList, function (k, v) {//视频列表
                                var attUrl = v.attPicUrl;
                                var play_icon = '<i class="uploadVideoIcon"><img src="//img10.allinmd.cn/v3/common/icon/video_btn.png" alt=""></i>';
                                if (attUrl.lastIndexOf("default") > 0) {
                                    attUrl = "//img10.allinmd.cn/default/qiniu196_196.jpg";
                                    play_icon = "";
                                }
                                _videoHtml += '<li class="imagesUploadBtn ev-uploadVideoLi" videoSortId="' + v.sortId + '" listId="' + v.id + '" attType="' + v.attType + '">' +
                                    '<div class="imagesUploadPath ev-uploadVideoPath"><img src="' + attUrl + '"/></div>' +
                                    '<figure class="ev-removeVideo"><img src="//img10.allinmd.cn/v3/upload_case/close.png"></figure>' +
                                    play_icon +
                                    '</li>';
                            });
                            // t.videoSortId = item.attachmentVideoList.length ? item.attachmentVideoList[item.attachmentVideoList.length - 1].sortId : 0;
                            $(".ev-recImgVideo").append(_videoHtml);
                            $(".ev-alPopup").show().find(".ev-popSaveBtn").attr({
                                "additionalId": _aId,
                                "addSortId": _addSortId,
                                id: item.id
                            });//添加随访记录弹层打开
                            _textCh.focus();
                            if (comm.browser.isIe8()) {
                                _popMain.css({
                                    'margin-top': -_popMain.height() / 2,
                                    'margin-left': -_popMain.width() / 2
                                });
                            }
                            $('body').css('overflow', 'hidden');
                            t.uploadImgAdditionanl = true;
                            t.uploadImg();//上传图片重新调用
                            t.popCheckFun();//随访记录弹层激活
                            $(".ev-additionalPop .ev-uploadImgLi").each(function (i, em) {
                                t.removePopImg($(em));
                                comm.textChangeNew({
                                    $tex: $(em).find("textarea"),//输入框
                                    $num: $(em).find(".ev-attNum"),//存放数字的元素
                                    inputIng: function () {
                                        $(em).find(".ev-attNum").show();
                                    },//输入中回调函数
                                    inputFinish: function () {
                                        $(em).find(".ev-attNum").hide();
                                    }//输入完成回调函数
                                });
                            });
                            //删除视频
                            $.each($(".ev-additionalPop .ev-uploadVideoLi"), function (k, v) {
                                t.removePopVideo($(v));
                            });
                        }
                    };
                    comm.ajax.async(t.path.getPopData, {
                        paramJson: $.toJSON({
                            caseId: t.caseId,
                            additionalType: 1,
                            sortType: 1,
                            additionalIds: _aId
                        })
                    }, cBack);
                });

                //随访记录删除按钮
                $('.ev-deleteBtn').off("click").on("click", function () {
                    var $this = $(this);
                    $.makeSurePopup({
                        title: "删除随访记录",//弹窗标题
                        content01: "",//弹窗内容字体会加粗 (可不传)
                        content: "确定删除此条随访记录吗？",//弹窗内容
                        callback: function () {
                            var _additionalId = $this.attr("additionalId");
                            var param = {
                                paramJson: $.toJSON({
                                    'additionalId': _additionalId,
                                    'isValid': 0
                                })
                            };
                            var cBack = function (res) {
                                if (res.responseObject.responseStatus) {
                                    $.each($(".ev-deleteBtn"), function (i, e) {
                                        if (_additionalId === $(e).attr("additionalId")) {
                                            $(e).parents("li").remove();
                                            return false;
                                        }
                                    });
                                }
                            };
                            comm.ajax.async(t.path.deleteAdd, param, cBack);
                        }//点击确认后执行的方法（有发送请求时，是请求成功后执行的方法)
                    });
                });
            },
            //删除弹层的图片
            removePopImg: function ($this) {
                var t = this;
                $this.find(".ev-removeImg").on("click", function () {
                    if ($this.attr("attType")) {
                        t.deletePopAttIds += $this.attr("listId") + '_' + ($this.attr("attType") ? $this.attr("attType") : "1") + ",";
                    }
                    $this.remove();
                });
            },
            //删除弹层的视频
            removePopVideo: function ($this) {
                var t = this;
                $this.find(".ev-removeVideo").on("click", function () {
                    if ($this.attr("attType")) {
                        t.deletePopAttIds += $this.attr("listId") + '_' + ($this.attr("attType") ? $this.attr("attType") : "2") + ",";
                    }
                    $this.remove();
                });
            },
            //保存随访记录接口的事件
            saveAddFun: function ($this) {
                var t = this;
                if (!t.uploadImgStatus) {
                    t.errorPop("图片上传中请稍候", 1);
                    t.config.offClick = true;
                    $this.attr("data-flag", "1");
                    return false;
                }
                if (!t.videoUped) {//视频已上传完成后才能发布
                    t.errorPop("视频上传中请稍候", 1);
                    t.config.offClick = true;
                    $this.attr("data-flag", "1");
                    return false;
                }
                if (t.uploadImgFail) {//有上传失败的图片不让提交发布
                    t.errorPop("有上传失败的图片，请处理完成后再发布", 1);
                    t.config.offClick = true;
                    $this.attr("data-flag", "1");
                    return false;
                }
                if ($('.ev-additionalPop .ev-uploadVideoLi').length > 0) {//如果存在视频
                    //循环视频集参数
                    var paramArr = [];
                    var data2 = {};
                    $.each($('.ev-additionalPop .ev-uploadVideoLi'), function (i, el) {
                        if ($(el).attr("key") && $(el).attr("persistentId")) {
                            data2 = {
                                key: $(el).attr("key") ? $(el).attr("key") : '',
                                persistentId: $(el).attr("persistentId") ? $(el).attr("persistentId") : '',
                                videoName: $(el).attr("videoName") ? $(el).attr("videoName") : '',
                                refType: 10,//随访记录
                                caseId: t.caseId,
                                caseCategoryId: $(el).attr("casecategoryid") ? $(el).attr("casecategoryid") : '',
                                platformId: $("#sesDepartment").val(),
                                additionalId: $this.attr('additionalId'),
                                sortId: $(el).attr("videoSortId") ? $(el).attr("videoSortId") : ''
                            };
                            paramArr.push(data2);
                        }
                    });
                    if (paramArr.length > 0) {
                        var params2 = JSON.stringify(paramArr);
                        comm.ajax.async(t.path.addVideoInfo, {paramJson: params2}, function (rep) {
                            if (!(rep && rep.responseObject.responseStatus)) {
                                if (rep.responseObject.responseMessage) {//没数据的时候不做提示
                                    $.topTip({mark: "warn", content: rep.responseObject.responseMessage});
                                }
                            } else {
                                t.saveAdditional($this);
                            }
                        });
                    } else {
                        t.saveAdditional($this);
                    }
                } else {//没有视频列表的时候
                    t.saveAdditional($this);
                }
            },
            //保存随访记录弹层
            saveAdditional: function ($this) {
                var t = this;
                var confirmIds = "";
                $.each($(".FUNImg .ev-uploadImgLi"), function (i, e) {
                    confirmIds += $(e).attr("listId") + ($(e).find(".case_att_name").val() ? '☆' + $(e).find(".case_att_name").val() : '') + '☆☆';
                });
                var _timeInput = $(".ev-timeFUN input"),
                    _year = _timeInput.eq(0).val() ? _timeInput.eq(0).val() : '0',
                    _month = _timeInput.eq(1).val() ? _timeInput.eq(1).val() : '0',
                    _val = symbolToString($(".ev-FUNDetail textarea").val()),
                    _additionalId = $this.attr("additionalId"),
                    _addSortId = $this.attr("addSortId");
                var param = {
                    paramJson: $.toJSON({
                        caseId: t.caseId,
                        additionalId: _additionalId,
                        sortId: _addSortId,
                        additionalType: 1,
                        followUpContent: _val,
                        picContentJson: confirmIds,//JSON.stringify(图片id
                        followUpTime: (_year ? _year + '_' : '0_') + (_month ? _month : '0'),
                        deleteIds: t.deletePopAttIds,//删除的id（图片和视频共同的）
                        addId: $this.attr("id") ? $this.attr("id") : '',
                        isValid: 1
                    })
                };
                var cBack = function (res) {
                    if (res.responseObject.responseStatus) {
                        t.deletePopAttIds = "";
                        t.uploadImgAdditionanl = false;//上传
                        t.uploadImg();//上传图片重新调用
                        var _apFlag = true;
                        $(".ev-alPopup").hide();//添加随访记录弹层直接关闭
                        $('body').css('overflow', 'auto');
                        $(".ev-popSaveBtn").removeClass("active").attr("data-flag", "1");
                        var _content = "";
                        if (_year && _year != 0 && _month && _month != 0) {
                            _content = '术后' + _year + '年' + _month + '月';
                        } else if (_year && _year != 0) {
                            _content = '术后' + _year + '年';
                        } else if (_month && _month != 0) {
                            _content = '术后' + _month + '月';
                        } else {
                            _content = '暂无时间';
                        }
                        $.each($(".ev-changeBtn"), function (i, e) {
                            if ($this.attr("additionalId") === $(e).attr("additionalId")) {
                                $(e).parents("li").find("span").text(_content);
                                $(e).parents("li").find(".detailList").text(symbolToString(_val));
                                _apFlag = false;
                                return false;
                            }
                        });
                        if (_apFlag) {
                            $(".ev-funList").append('<li><aside class="time"><span>' + _content + '</span>' +
                                '<p class="ev-changeBtn" ' +
                                'additionalId="' + _additionalId + '" addSortId="' + _addSortId + '" id="' + ($this.attr("id") ? $this.attr("id") : '') + '">修改</p>' +
                                '<p class="ev-deleteBtn" ' +
                                'additionalId="' + _additionalId + '" addSortId="' + _addSortId + '" id="' + ($this.attr("id") ? $this.attr("id") : '') + '">删除</p></aside>' +
                                '<div class="detailList">' + symbolToString(_val) + '</div></li>');
                        }

                        $(".ev-timeFUN input").val("");//置空时间选项
                        $(".ev-FUNDetail textarea").val("");//置空时间选项
                        $(".ev-recImgVideo").find("li").remove();//视频图片移除
                        t.addAlPopup();
                        t.adDeleteOrChange();
                    } else {
                        $(".ev-popSaveBtn").attr("data-flag", "1");
                    }
                };
                comm.ajax.async(t.path.savePop, param, cBack);
            },
            //检测随访记录弹层
            popCheckFun: function () {
                var t = this,
                    _eixtFlag = false;
                var _btnActive = false;
                //时间的input是否尊在value
                $.each($(".ev-timeFUN input"), function (i, e) {
                    if ($(e).val() && $.trim($(e).val())) {
                        _eixtFlag = true;
                        _btnActive = true;
                        return false;
                    }
                });
                //添加随访记录是否存在值
                if ($(".ev-FUNDetail textarea").val() && $.trim($(".ev-FUNDetail textarea").val())) {
                    _eixtFlag = true;
                }
                $(".ev-FUNDetail textarea").val() ? _eixtFlag = true : '';
                //随访记录弹层增加图片或视频是否有值
                if ($(".ev-recImgVideo li").length) {
                    _eixtFlag = true;
                }
                //添加随访记录弹层的保存按钮
                var _saveBtn = $(".ev-popSaveBtn");
                if (_btnActive) {//保存按钮激活
                    _saveBtn.addClass("active");
                } else {
                    _saveBtn.removeClass("active");
                }
                return _eixtFlag;
            },
            //添加病例标签
            addTagsFun: function (callback) {
                var t = this;
                var param = {
                    paramJson:$.toJSON({
                        firstResult: 0,
                        maxResult: 20,
                        propertyTypeId: 8,
                        isValid: 1,
                        sortType: 3
                    })
                };
                //获取标签列表
                comm.ajax.async(t.path.getTagsList,
                    param,
                    function (data) {
                        if (data && data.responseObject && data.responseObject.responseData && data.responseObject.responseData && data.responseObject.responseData.data_list) {
                            var dataList = data.responseObject.responseData.data_list;
                            var tagList = [];
                            for (var i = 0; i < dataList.length; i++) {
                                tagList.push({
                                    propertyName: dataList[i].propertyName,
                                    propertyId: dataList[i].propertyId
                                })
                            }

                            var addTagsPupop = $('.uploadCase .addTagsPupop');
                            var tagListDom = addTagsPupop.find('.tagsContentList');
                            var confirmBtn = addTagsPupop.find('.tagsContentButtons .confirmBtn');

                            var tmpHtml = '';
                            for (var i = 0; i < tagList.length; i++) {
                                tmpHtml += "<div propertyId='" + tagList[i].propertyId + "'>" + tagList[i].propertyName + "</div>";
                            }
                            if (tmpHtml) {
                                tagListDom.html(tmpHtml);
                                var selectTagList = [];
                                var tagItemList = addTagsPupop.find('.tagsContentList div');
                                addTagsPupop.show();
                                //关闭按钮事件
                                addTagsPupop.find('.tagsContentHeader .closeIcon i').on('click', function () {
                                    addTagsPupop.hide();
                                    callback && callback();
                                });
                                //确定按钮的点击事件
                                confirmBtn.on('click', function () {
                                    if (selectTagList.length > 0) {
                                        //发布标签
                                        var param = {
                                            paramJson:$.toJSON({
                                                'caseId':t.caseId,
                                                'propertyIdList':selectTagList.join(',')
                                            })
                                        };
                                        comm.ajax.async(t.path.addTagsList,param,function(){
                                            callback && callback();
                                        });
                                    }

                                });
                                //每个标签的点击事件
                                for (var i = 0; i < tagItemList.length; i++) {
                                    (function (i) {
                                        var item = $(tagItemList[i]);
                                        var propertyId = item.attr('propertyId');
                                        item.on('click', function () {
                                            var isSelected = true;
                                            //判断是否已经被选中，如果选中则取消选中，否则加入已选中列表
                                            for (var m = 0; m < selectTagList.length; m++) {
                                                if (selectTagList[m] === propertyId) {
                                                    isSelected = false;
                                                    item.removeClass('active');
                                                    selectTagList.splice(m, 1);
                                                    break;
                                                }
                                            }
                                            if (isSelected) {
                                                item.addClass('active');
                                                selectTagList.push(propertyId);
                                            }
                                            //校验已选标签是否为空，如果为空，则不激活确认按钮
                                            if (selectTagList.length > 0) {
                                                confirmBtn.addClass('active');
                                            }
                                            else {
                                                confirmBtn.removeClass('active');
                                            }
                                        });
                                    })(i);
                                }
                            }
                            else{
                                callback && callback();
                            }
                        }
                        else {
                            callback && callback();
                        }

                    },
                    true,
                    function (err) {
                        callback && callback();
                    },
                    "get");

            }
        };
        uploadCase.init();
    });
});
