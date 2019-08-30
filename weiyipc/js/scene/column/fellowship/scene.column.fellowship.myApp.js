/**
 * 功能描述： 我的报名
 * 使用方法:
 * 注意事件：
 * 引入来源：  作用：
 *
 * Created by HeJing on 2015/12/14.
 */
$(function () {
    //comm.Log.createBrowse({href: location.href, id: 121, name: '进修报名页'});
    var controller = {
            config: {
                getAD: PC_CALL + "customer/fellowship/base/getAdContentNew/",//获取广告位
                url: PC_CALL + "customer/fellowship/base/json_list/",//是否报名
                submitUrl: PC_CALL + "customer/fellowship/base/update/",//提交申请
                felUrl: PC_CALL + "fellowship/config/getSubConfigList/",//知情同意书
                resume: PC_CALL + "pdf/report/pdfReport/",//简历模板地址
                customerId: $("#sesCustomerId").val()
            },
            init: function () {
                var t = this;
                t.getAD();
                t.login();
            },
            //获取轮播图
            getAD: function () {
                var t = this;
                $.ajax({
                    type: "post",
                    url: t.config.getAD,
                    dataType: "json",
                    success: function (rep) {
                        if (rep && rep.responseObject && rep.responseObject.length > 0) {
                            var html = nHtml = "";
                            $.each(rep.responseObject, function (i, val) {
                                html += '<li index="'+(i+1)+'">' +
                                    '<a href="' + (val.linkUrl ? val.linkUrl : "javascript:;") + '" target="_blank">' +
                                    '<img alt="'+val.adAttName+'" src="//img99.allinmd.cn/' + val.adAttUrl + '" />' +
                                    '</a>' +
                                    '</li>';
                                nHtml += "<li>" + (i + 1) + ".</li>";
                            });
                            $(".banner-inner ul").html(html);
                            $(".banner_channel_num ul").html(nHtml);
                            module.bannerCarousel();    // 幻灯片
                            $(".banner-inner li").on("click",function(){
                                locationId=$(this).attr("index");
                                //事件埋点
                                comm.creatEvent({
                                    async:false,
                                    triggerType:"广告",
                                    keyword:$(this).find("img").attr("alt"),
                                    locationId:locationId,
                                    actionId:14
                                });
                            })
                        }
                    },
                    error: function () {
                    }
                });
            },
            //判断登录认证
            login: function () {
                var t = this;
                var val = $("#sesCustomerId").val();
                var auth = $("#sesAuth").val();
                if (val) {//登录
                    t.showSign();
                } else {//未登录
                    $(".Ev-StateJudgeAllShow").show();
                    $(".Ev-LoginShow").show();
                    $("#login_btn").on('click', function () {
                        user.login({
                            callback: function () {
                                g_sps.jump(null,location.href);
                                t.showSign();
                            },
                            scene: privilegeSceneConst.eSceneTypeFellow
                        });
                    });
                }
            },
            //显示报名信息
            showSign: function () {
                var t = this;
                var items,
                    isRegistration;//报名状态，1报名
                comm.LightBox.showloading();
                $.ajax({
                    url: t.config.url,
                    type: "POST",
                    data: {paramJson: $.toJSON({customerId: $("#sesCustomerId").val(), queryType: 1, sortType: 3})},
                    dataType: "json",
                    success: function (data) {
                        comm.LightBox.hideloading();
                        if (data && data.responseObject.responseData) {
                            items = data.responseObject.responseData.data_list;
                            isRegistration = data.responseObject.responseData.isRegistration;
                            if (isRegistration != 1) {//不在当前在报名状态中
                                $(".Ev-StateJudgeAllShow").show();
                                $(".Ev-NotApplyCurrentShow").show();
                                if (items) {
                                    $(".Ev-ApplyListAllShow").show();
                                    $(".Ev-ListShowMyTop").hide();
                                }
                                $("#login_btn2").on("click", function () {
                                    user.login({
                                        callback: function () {
                                            g_sps.jump(null,"/html/index/fellowship/fellowship_home.html");
                                        },
                                        scene: privilegeSceneConst.eSceneTypeFellow
                                    });
                                });
                            } else {//已经报名了
                                $(".Ev-ApplyListAllShow").show();
                            }
                            if (items) {
                                t.myApplyListAllShow(items, isRegistration);
                            }
                        }
                    },
                    error: function () {
                    }
                });
            },
            //所有报名信息
            myApplyListAllShow: function (data, isRegistration) {
                var t = this,
                    items,
                    ApplyState,
                    ApplyStateText,
                    fellowshipName,
                    createTime,
                    fellowshipYear,
                    stateInfo,
                    stateInfoTextContent,
                    subDowContent = "",
                    html = "",
                    historyFellowshipId;
                var index = data.length - 1;
                t.globalData = [];

                for (var i = data.length - 1; i >= 0; i--) {
                    items = data[i];
                    ApplyState = items.customer_fellowship.state;
                    ApplyStateText = items.stateInfo.configTitle ? items.stateInfo.configTitle : "";//申请的文字状态
                    fellowshipName = items.customer_fellowship.fellowshipName;
                    createTime = items.customer_fellowship.createTime.substr(0, 10);
                    fellowshipYear = items.fellowshipYear;
                    stateInfo = items.stateInfo;
                    historyFellowshipId = items.customer_fellowship.fellowshipId;
                    if (stateInfo && !$.isEmptyObject(stateInfo)) {
                        stateInfoTextContent = !$.isEmptyObject(stateInfo.configIntro) ? $.trim(stateInfo.configIntro) : "";
                    } else {
                        stateInfoTextContent = "";
                    }

                    subDowContent = '<div class="f_sub_down sub_no Ev-ApplyInfoShowOrHide">' +
                        '<div class="f_sub_state">' +
                        '<div class="f_sub_sup"></div>' +
                        '<div class="f_sub_state_word">' + stateInfoTextContent + '</div>' +
                        '<div class="clear"></div>' +
                        '</div>' +
                        '<div class="clear"></div>' +
                        '</div>' +
                        '<div class="f_sub_bottom Ev-ApplyInfoShowOrHideResume">' +
                        '<a class="Ev-HistoryFellow" ' +
                        'href="/pages/column/fellowship/fellowship_resumePreview.html?cId=' + $("#sesCustomerId").val() + '&fId=' + historyFellowshipId + '" ' +
                        'target="_blank">简历预览</a>' +
                        '</div>';
                    var aStateParam = 1;
                    var c_fellow = items.customer_fellowship;
                    switch (ApplyState) {
                        case 1://正在报名
                            aStateParam = 0;
                            c_fellow = "";
                            //当前报名的操作
                            var nowSubDownList = "";//当前报名下边的条目
                            var configIntro, nowSubDownListParam;
                            var infoStatus = items.infoStatus,//报名基本信息
                                resumeCnStatus = items.resumeCnStatus,//中文简历
                                resumeEnStatus = items.resumeEnStatus,//英文简历
                                recommendStatus = items.recommendStatus,//推荐信
                                englishResumeStatus = items.englishResumeStatus,//语言能力证明
                                otherAttachmentStatus = items.otherAttachmentStatus;//其他能力证明
                            var recommendNum = items.recommendNum,
                                englishResumeNum = items.englishResumeNum,
                                otherAttachmentNum = items.otherAttachmentNum;
                            $.each(items.configState, function (index, ele) {
                                if (!$.isEmptyObject(ele.configIntro) && $.trim(stateInfo.configIntro)) {
                                    configIntro = ele.configIntro;
                                } else {
                                    configIntro = "";
                                }

                                var redParam = 0;
                                switch (ele.configDataType) {
                                    case 1://报名基本信息
                                        nowSubDownListParam = '<div class="per_btn">' +
                                            '<a href="javascript:;" class="base_btn" baseid="' + items.customer_fellowship.id + '">' + (infoStatus == 1 ? "编辑信息" : "完善") + '</a>' +
                                            '</div>';
                                        if (infoStatus == 1) {
                                            redParam = 1;
                                        }
                                        break;
                                    case 2://中文简历
                                        nowSubDownListParam = '<div class="per_btn">' +
                                            '<a href="javascript:;" class="chResume_btn">' + (resumeCnStatus == 1 ? "编辑简历" : "完善简历") + '</a>' +
                                            '</div>' +
                                            '<div class="per_d">' +
                                            '<a href="' + t.config.resume + "?customerId=" + $("#sesCustomerId").val() + "&fellowshipId=" + items.customer_fellowship.fellowshipId + "&languageFlag=0" + '" class="down_chResume">导出简历</a>' +
                                            '</div>';
                                        if (resumeCnStatus == 1) {
                                            redParam = 1;
                                        }
                                        break;
                                    case 3://英文简历
                                        nowSubDownListParam = '<div class="per_btn">' +
                                            '<a href="javascript:;" class="enResume_btn">' + (resumeEnStatus == 1 ? "编辑简历" : "完善简历") + '</a>' +
                                            '</div>' +
                                            '<div class="per_d">' +
                                            '<a href="' + t.config.resume + "?customerId=" + $("#sesCustomerId").val() + "&fellowshipId=" + items.customer_fellowship.fellowshipId + "&languageFlag=1" + '" class="down_enResume">导出简历</a>' +
                                            '</div>';
                                        if (resumeEnStatus == 1) {
                                            redParam = 1;
                                        }
                                        break;
                                    case 4://推荐信
                                        nowSubDownListParam = '<div class="per_btn">' +
                                            '<a href="javascript:;" class="fel_rec_upload" data-recomnum="' + recommendNum + '">上传</a>' +
                                            '</div>' +
                                            '<div class="per_d">' +
                                            '<a href="' + items.fellowship_attachment_3.fellowshipAttUrl + '" id="mod_download">模板下载</a>' + /*<!--target="_blank"-->*/
                                            '</div>';
                                        if (recommendStatus == 1) {
                                            redParam = 1;
                                            $.cookie('download_fel_rec', '1', {expires: 365});
                                        }
                                        break;
                                    case 5://语言能力
                                        nowSubDownListParam = '<div class="per_btn">' +
                                            '<a href="javascript:;" class="lang_abl_upload" data-engnum="' + englishResumeNum + '">上传</a>' +
                                            '</div>';
                                        if (englishResumeStatus == 1) {
                                            redParam = 1;
                                        }
                                        break;
                                    case 6://其他能力
                                        nowSubDownListParam = '<div class="per_btn">' +
                                            '<a href="javascript:;" class="other_mat_upload" data-othernum="' + otherAttachmentNum + '">上传</a>' +
                                            '</div>';
                                        if (otherAttachmentStatus == 1) {
                                            redParam = 1;
                                        }
                                        break;
                                }
                                nowSubDownList += '<div class="fs_rereq ' + (redParam == 1 ? "sub_blue" : "") + '" ' + (ele.isMandatory == 1 ? 'ismandatory=1' : '') + '>' +
                                    '<div class="rer_up">' +
                                    '<div class="bt fs_font_s fs_font_b"><div class="Ev-ClickTitleContent" style="display: inline-block">' + ele.configTitle +
                                    '</div><span class="xuantian" ' + (ele.isMandatory == 0 ? '' : 'style="display: none"') + '>（选填）</span>' +
                                    '</div>' +
                                    nowSubDownListParam +
                                    '<div class="clear"></div>' +
                                    '</div>' +
                                    '<div class="rer_d">' + configIntro + '</div>' +
                                    (redParam == 1 ? '<div class="fs_duig"></div>' : '') +
                                    '</div>';
                            });
                            subDowContent = '<div class="f_sub_down Ev-ApplyInfoShowOrHide" data-fId="' + items.customer_fellowship.fellowshipId + '">' +
                                nowSubDownList +
                                '<div class="clear Ev-AppendInfoContent"></div>' +
                                '</div>' +
                                '<div class="f_sub_tjbtn Ev-ApplySubmitBtn">' +
                                '<a href="javascript:;" class="a_now f_sub_tjbtnLeft" data-nowFId="' + items.customer_fellowship.fellowshipId + '"  data-sId="' + items.customer_fellowship.id + '">提交申请</a>' +
                                '<a href="/pages/column/fellowship/fellowship_nowResumePreview.html?cId=' + $("#sesCustomerId").val() + '&fId=' + items.customer_fellowship.fellowshipId + '&lanFlag=0"' +
                                ' class="f_sub_tjbtnRightHover Ev-NowResumePriview Ev-ApplyInfoShowOrHideResume" target="_blank">简历预览</a>' +
                                '<div class="clear"></div>' +
                                '</div>';
                            break;

                        case 8:
                            aStateParam = 1;
                            c_fellow = items.customer_fellowship;
                            subDowContent = '<div class="f_sub_down sub_no Ev-ApplyInfoShowOrHide">' +
                                '<div class="f_sub_state">' +
                                '<div class="f_sub_sup dg"></div>' +
                                '<div class="f_sub_state_word">' + stateInfoTextContent + '</div>' +
                                '<div class="clear"></div>' +
                                '</div>' +
                                '<div class="clear"></div>' +
                                '</div>' +
                                '<div class="f_sub_bottom Ev-ApplyInfoShowOrHideResume">' +
                                '<a class="Ev-HistoryFellow" ' +
                                'href="/pages/column/fellowship/fellowship_resumePreview.html?cId=' + $("#sesCustomerId").val() + '&fId=' + historyFellowshipId + '" ' +
                                'target="_blank">简历预览</a>' +
                                '</div>';
                            break;
                        case 9:
                            aStateParam = 1;
                            c_fellow = items.customer_fellowship;
                            subDowContent = '<div class="f_sub_down sub_no Ev-ApplyInfoShowOrHide">' +
                                '<div class="f_sub_state">' +
                                '<div class="f_sub_sup"></div>' +
                                '<div class="f_sub_state_word">' + stateInfoTextContent + '</div>' +
                                '<div class="clear"></div>' +
                                '</div>' +
                                '<div class="clear"></div>' +
                                '</div>' +
                                '<div class="f_sub_bottom Ev-ApplyInfoShowOrHideResume">' +
                                '<a class="Ev-HistoryFellow" ' +
                                'href="/pages/column/fellowship/fellowship_resumePreview.html?cId=' + $("#sesCustomerId").val() + '&fId=' + historyFellowshipId + '" ' +
                                'target="_blank">简历预览</a>' +
                                '</div>';
                            break;
                    }

                    if (ApplyState != 1 && stateInfoTextContent == "") {
                        subDowContent = "";
                    }
                    if (aStateParam == 1) {
                        var cFId = c_fellow.id;
                        t.globalData.push(c_fellow);
                    }
                    html += '<div class="f_nass_sub ' + (aStateParam == 1 ? " Ev-lastInfo" : "") + '" ' + (aStateParam == 1 ? 'data-fellowInfoId=' + c_fellow.id : "") + '>' +
                        '<div class="f_sub_top">' +
                        '<ul class="f_app_ul">' +
                        '<li class="app_item">申请项目</li>' +
                        '<li class="app_tim">申请时间</li>' +
                        '<li class="app_state">申请状态</li>' +
                        '<div class="clear"></div>' +
                        '</ul>' +
                        '<ol class="f_app_ol">' +
                        '<li class="app_item">' +
                        '<div class="li_all">' +
                        '<div class="item_y">' + fellowshipYear + '</div>' +
                        '<div class="item_w">' + fellowshipName + '</div>' +
                        '<div class="clear"></div>' +
                        '</div>' +
                        '</li>' +
                        '<li class="app_tim">' + createTime + '</li>' +
                        '<li class="app_state">' +
                        '<div class="li_all">' +
                        '<div class="item_w">' + ApplyStateText + '</div>' +
                        '<div class="fs_z_btn subBtn Ev-CheckApplyInfoBtn">' +
                        '<a href="javascript:;">' +
                        '<img src="//img00.allinmd.cn/fellow/fs_v2/fs_close.png" width="100%" onmouseover=\"this.src=\'//img00.allinmd.cn/fellow/fs_v2/fs_close_h.png\'\" onmouseout=\"this.src=\'//img00.allinmd.cn/fellow/fs_v2/fs_close.png\'\" />' +
                        '</a>' +
                        '</div>' +
                        '<div class="clear"></div>' +
                        '</div>' +
                        '</li>' +
                        '<div class="clear"></div>' +
                        '</ol>' +
                        '</div>' + subDowContent +
                        '</div>';
                }
                $(".Ev-MyApplyListAppend").html(html);
                t.secBaseInfo = t.globalData ? t.globalData[0] : {};
                if ($(".f_sub_down").length > 0) {
                    recom({
                        callback: function () {
                            t.submitBtnStatus();
                        }
                    });
                    t.baseAndresume();
                    t.submitBtnStatus();
                }
                t.btnStatus();//右侧小按钮
                t.isFinish();//右侧小按钮
            },
            //个人信息完善判断
            isFinish: function () {
                var t = this,
                    html = "",
                    windowHeight = parseInt($(window).height() * 0.85);
                $(".f_sub_tjbtn .a_now").off("click").on("click", function () {
                    if ($(this).hasClass("f_sub_tjbtnLeftHover")) {
                        var fellowId = $(this).attr("data-nowFId");
                        var submitId = $(this).attr("data-sId");
                        html = '<div id="agree_box"><div id="lightbox"></div>' +
                            '<div id="agreeLightbox" class="lightbox-container" style="z-index: 10; position:absolute;height:' + windowHeight + '">' +
                            t.getInform(fellowId) +
                            '</div></div>';
                        $("body").append(html);
                        $(".layerKnow").css({height: windowHeight});
                        comm.setCenter($("#agreeLightbox"));
                        t.isSubmit(submitId);
                    }
                });
            },
            //获取知情同意书
            getInform: function (kv) {
                var t = this;
                var configBody = "";
                $.ajax({
                    url: t.config.felUrl,
                    type: "POST",
                    data: {paramJson: $.toJSON({fellowshipId: kv, configType: 5})},
                    dataType: "json",
                    async: false,
                    success: function (data) {
                        if (data && data.responseObject) {
                            configBody = data.responseObject.fellowshipSubList[0].configBody;
                        }
                    },
                    error: function () {
                    }
                });
                return configBody;
            },
            //确认提交个人信息
            isSubmit: function (id) {
                var t = this;
                $(".checkAgree>label").off("click").on("click", function (e) {
                    var checkAgree = $("#fellow_checkbox").prop("checked");
                    if (checkAgree == true) {//知情同意书选中
                        $("#fellowship_apply_submit").removeClass("gray");
                    } else {//未选中
                        $("#fellowship_apply_submit").addClass("gray");
                    }
                    var e = e || window.event;
                    e.stopPropagation();
                    e.cancelBubble = true;
                });
                $(".layer_close").on("click", function () {
                    $("#agree_box").remove();
                    //事件埋点
                    comm.creatEvent({
                        triggerType:"全站功能按钮点击",
                        keyword:"fellowship报名信息关闭",
                        actionId:43
                    });
                });
                $("#fellowship_apply_submit").on("click", function () {
                        var checkAgree = $("#fellow_checkbox").prop("checked");
                        if (checkAgree == true) {
                            $("#agree_box").remove();
                            $(".a_now").text("").addClass("tjz");
                            $.ajax({
                                url: t.config.submitUrl,
                                type: "POST",
                                data: {paramJson: $.toJSON({id: id, state: 2})},
                                dataType: "json",
                                success: function () {
                                    t.showSign();
                                    t.btnStatus();
                                },
                                error: function () {
                                }
                            });
                        }
                    }
                )
                ;
            },
            //按钮的状态变换，显示或隐藏
            btnStatus: function () {
                var srcPath = "//img00.allinmd.cn/fellow/fs_v2/fs_";
                $(".Ev-CheckApplyInfoBtn").each(function (i, el) {
                    if ($(this).parents(".f_nass_sub").find(".f_sub_down").length > 0) {
                        $(el).on("click", function () {
                            var isVisible = $(this).parents(".f_nass_sub").find(".f_sub_down").is(":visible");
                            var $thisParents= $(this).parents(".f_nass_sub");
                            if (isVisible) {
                                $thisParents.find(".Ev-ApplyInfoShowOrHide").hide();//文字说明和报名条目
                                $thisParents.find(".Ev-ApplyInfoShowOrHideResume").hide();//历史简历预览
                                $thisParents.find(".Ev-ApplySubmitBtn").hide();//提交按钮
                                $(this).find("img").attr({
                                    "src": srcPath + "open.png",
                                    "onmouseover": "this.src='//img00.allinmd.cn/fellow/fs_v2/fs_open_h.png'",
                                    "onmouseout": "this.src='//img00.allinmd.cn/fellow/fs_v2/fs_open.png'"
                                });
                            } else {
                                $thisParents.find(".Ev-ApplyInfoShowOrHide").show();
                                $thisParents.find(".Ev-ApplyInfoShowOrHideResume").show();
                                $thisParents.find(".Ev-ApplySubmitBtn").show();
                                $(this).find("img").attr({
                                    "src": srcPath + "close.png",
                                    "onmouseover": "this.src='//img00.allinmd.cn/fellow/fs_v2/fs_close_h.png'",
                                    "onmouseout": "this.src='//img00.allinmd.cn/fellow/fs_v2/fs_close.png'"
                                });
                            }
                        });
                    } else {
                        $(this).find("img").attr({
                            "src": srcPath + "open.png",
                            "onmouseover": '',
                            "onmouseout": ''
                        });
                    }
                });
            }
            ,
//提交按钮是否激活
            submitBtnStatus: function () {
                var t = this,
                    fId;
                var status = 0;
                $.each($(".f_nass_sub"), function (i, em) {
                    $.each($(em).find(".fs_rereq"), function (k, v) {
                        if (!$(v).hasClass("rer_grey01") && $(v).attr("ismandatory")) {
                            if ($(v).hasClass("sub_blue")) {//完善
                                status = 1;
                            } else {//有未完善的
                                status = 0;
                                return false;
                            }
                        }
                    });
                    if (status) {
                        $(this).find(".a_now").addClass("f_sub_tjbtnLeftHover");
                    } else {
                        $(this).find(".a_now").removeClass("f_sub_tjbtnLeftHover");
                    }
                });
            }
            ,
//报名基本信息和中英文简历
            baseAndresume: function () {
                var t = this;
                $(".base_btn").on("click", function () {
                    var $this = $(this);
                    regBaseInfo({
                        that: $this,
                        fellowshipId: $this.parents(".Ev-ApplyInfoShowOrHide").attr("data-fId"),
                        fellowData: t.secBaseInfo,
                        callback: function () {
                            $this.text("编辑信息");
                            $this.parents(".fs_rereq").addClass("sub_blue").append('<div class="fs_duig"></div>');
                            t.submitBtnStatus();
                        }
                    });
                });
                //中文简历
                $(".chResume_btn").on("click", function () {
                    var $this = $(this);
                    $(".layerResumeT .down_chResume").attr("href", $this.parents(".Ev-ApplyInfoShowOrHide").find(".down_chResume").attr("href"));
                    chResume({
                        type: "ch",
                        that: $this,
                        fellowshipId: $this.parents(".Ev-ApplyInfoShowOrHide").attr("data-fId"),
                        callback: function () {
                            t.submitBtnStatus();
                        }
                    });
                });
                //英文简历
                $(".enResume_btn").on("click", function () {
                    var $this = $(this);
                    $(".layerResumeT .down_enResume").attr("href", $this.parents(".Ev-ApplyInfoShowOrHide").find(".down_enResume").attr("href"));
                    enResume({
                        type: "en",
                        that: $this,
                        fellowshipId: $this.parents(".Ev-ApplyInfoShowOrHide").attr("data-fId"),
                        callback: function () {
                            t.submitBtnStatus();
                        }
                    });
                });
            }
        }
        ;
    controller.init();
})
;
