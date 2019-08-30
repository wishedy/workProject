/**
 * @name: 新版认证
 * @desc:
 * @example:
 * @depend:
 * @date: 2017/9/1
 * @author: sunhaibin
 */
$.getScript(window.paasFilePathObj.js, function () {
    $(function () {
        user.privExecute({
            operateType: "login",
            callback: function () {
            }
        });
        //单位
        var company = {
            init: function () {
                var t = this;
                t.changeCompany();
            },
            changeCompany: function () {
                var t = this;
                $('.ev_changeCompany').on('click', function () {
                    $('#backMask').addClass('on');
                });
                $('#EV-cancelSelect').off('click').on('click', function () {
                    comm.creatEvent({
                        triggerType: '功能按钮',
                        triggerName: '全站功能按钮点击',
                        keyword: '医院/学校选择取消',
                        actionId: 45
                    });
                    $('#backMask').removeClass('on');
                });
                $('.ev_hospital').on('click', function () {
                    $(".ev-mainInner").hide();
                    $(".ev-companyInner").show();
                    $(".ev-sProvince").show();
                    $('#backMask').removeClass('on');
                    if (!$(this).hasClass('hasLoadData')) {
                        module.addCompany({
                            container: $('#company'),
                            wordLen: $(window).width() < 760 ? 24 : 30,
                            triggerDom: $(this),
                            fn: function () {
                                checkFinish();
                                $('#company').attr({school: "", workplaceType: 1});
                                $("#sCompany").stopScrollPagination();
                            },
                            getProvinceFn: function () {
                                // Log.createBrowse(10002, '认证-我在医院-省');
                                setTimeout(function(){
                                    if(g_sps) {
                                        g_sps.createBrowse({pageId: 439});
                                    }
                                },2000);
                            },
                            getCityFn: function () {
                                // Log.createBrowse(10003, '认证-我在医院-市');
                                setTimeout(function(){
                                    if(g_sps) {
                                        g_sps.createBrowse({pageId: 440})
                                    }},2000);
                            },
                            getCompanyFn: function () {
                                // Log.createBrowse(10004, '认证-我在医院-医院');
                                setTimeout(function(){
                                    if(g_sps) {
                                        g_sps.createBrowse({pageId: 441})
                                    }},2000);
                            },
                            addCompanyFn: function () {
                                // Log.createBrowse(10006, '认证-我在医院-添加医院');
                                setTimeout(function(){
                                    if(g_sps) {
                                        g_sps.createBrowse({pageId:442})
                                    }},2000);
                            }
                        });
                    }

                });
                $('.ev_school').on('click', function () {
                    $(".ev-mainInner").hide();
                    $(".ev-schoolInner").show();
                    $(".ev-schoolProvince").show();
                    $('#backMask').removeClass('on');
                    if (!$(this).hasClass('hasLoadData')) {
                        module.addSchool({
                            container: $('#company'),
                            wordLen: $(window).width() < 760 ? 24 : 30,
                            triggerDom: $(this),
                            fn: function () {
                                checkFinish();
                                $('#company').attr({company: "", workplaceType: 2});
                                t.type = 2;
                                $("#sSchool").stopScrollPagination();
                            },
                            getProvinceFn: function () {
                                // Log.createBrowse(10007, '认证-我在学校-省');
                                setTimeout(function(){
                                    if(g_sps) {
                                        g_sps.createBrowse({pageId: 443})
                                    }},2000);
                            },
                            getCityFn: function () {
                                // Log.createBrowse(10008, '认证-我在学校-市');
                                setTimeout(function(){
                                    if(g_sps) {
                                        g_sps.createBrowse({pageId: 444})
                                    }},2000);
                            },
                            getCompanyFn: function () {
                                // Log.createBrowse(10009, '认证-我在学校-学校');
                                setTimeout(function(){
                                    if(g_sps) {
                                        g_sps.createBrowse({pageId: 445})
                                    }},2000);
                            },
                            addCompanyFn: function () {
                                // Log.createBrowse(10011, '认证-我在学校-添加学校');
                                setTimeout(function(){
                                    if(g_sps) {
                                        g_sps.createBrowse({pageId: 446})
                                    }},2000);
                            }
                        });
                    }
                });
            }

        };
        //职称
        var medTitle = {
            init: function () {
                this.changeMedicalTitle();
            },
            changeMedicalTitle: function () {
                var t = this;
                module.medicalTitle({
                    container: $('#medicalTitle'),
                    wordLen: $(window).width() < 760 ? 26 : 30,
                    fn: function () {
                        checkFinish();
                    }
                });
                $('.ev_changeMedicalTitle').click(function () {
                    // Log.createBrowse(10012, '认证-选择职称');
                    setTimeout(function(){
                        if(g_sps) {
                            g_sps.createBrowse({pageId: 447})
                        }},2000);
                    $(".ev-medBox").addClass('on');
                    var medical = $(this).find('a').attr('nowVal');
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

                });

            }
        };
        //专业
        var expertise = {
            init: function () {
                var t = this;
                t.data = [];
                t.areaExpertise();
            },
            areaExpertise: function () {
                var t = this;
                $(".ev_changeArea").on("click", function () {
                    // Log.createBrowse(10013, "认证-选择专科");
                    setTimeout(function(){
                        if(g_sps) {
                            g_sps.createBrowse({pageId: 448})
                        }},2000);
                    //专科选择时 如果已有专科数据与当前相同不请求，否则重新请求数据
                    if ($('.ev_changeArea').attr('pId') != $('input[name=platformId]').val()) {
                        t.getAreas($('input[name=platformId]').val());

                    }
                    var area = $('#areasExpertise').attr('nowVal');
                    var area1 = area ? area.split(",") : [];
                    var areaIds = [];
                    $.each(area1, function (i, val) {
                        if (val) {
                            if (val.split("_")[1]) {
                                areaIds.push(val.split("_")[0]);
                            }
                        }
                    });
                    $(".ev-areasCon figcaption").each(function (i, em) {
                        $.each(areaIds, function (j, val) {
                            if ($(em).attr("tagid") == val) {
                                $(em).parent().attr("select", "yes");
                                $(em).parent().addClass("selected");
                            }
                        });
                    });
                    $(".ev-mainInner").hide();
                    $(".ev-areaInner").show();
                    $(".al-searchResult.expert").css("marginTop", "0");
                    /*点击专科进入选择列表时保存按钮的状态*/
                    $('.al-selectorBarItem').each(function () {
                        if ($(this).attr('select') == 'yes') {
                            $('.ev-areasSave').addClass('focus')
                        } else {

                        }
                    })
                });
                $(".ev-goBack").on("click", function () {
                    setTimeout(function () {
                        $(".ev-mainInner").show();
                        $(".ev-areaInner").hide();
                        $('.ev-areasCon .al-selectorBarItem').removeClass('selected').removeAttr('select');
                    }, 500);
                });

            },
            //数据初始化
            getAreas: function (pId) {
                var t = this;
                var html = "";
                var data = {};
                data.treeLevel = 2;
                data.pageIndex = 1;
                data.pageSize = 100;
                data.platformId = pId || 1;
                $('.ev_changeArea').attr('pId', pId);
                var callback = function (rep) {
                    if (rep && rep.responseObject.responseStatus) {
                        $.each(rep.responseObject.responseData.data_list, function (i, val) {
                            html += '<section class="al-selectorBarItem" select="no">' +
                                '<figure class="al-selectorBarItemIcon"></figure>' +
                                '<figcaption class="al-selectorBarItemName" tagid="' + val.id + '">' + val.tagName + '</figcaption>' +
                                '</section>';
                        });
                        if (pId == 1) {
                            t.data[1] = rep;
                        } else {
                            t.data[2] = rep;
                        }
                    }
                    $(".ev-areasCon").html(html).attr('platformId', pId).show();
                    t.selectTag();
                    t.saveAreaExp(data.platformId);
                };
                if (!t.data[pId]) {
                    $.ajax({
                        url: M_CALL + "comm/data/tag/json_list/",
                        data: data,
                        dataType: "json",
                        async: false,
                        timeout: 10000,
                        success: function (rep) {
                            callback(rep);
                        }
                    });
                } else {
                    callback(t.data[pId]);
                }


            },
            //数据的选择
            selectTag: function () {
                var t = this;
                $.each($(".ev-areasCon section"), function (i, em) {
                    $(em).on("click", function () {
                        if ($(em).attr("select") == "no") {
                            $(em).attr("select", "yes");
                            $(this).addClass("selected");
                        } else {
                            $(em).attr("select", "no");
                            $(this).removeClass("selected");
                        }
                        /*点击专科列表时保存按钮的状态*/

                        var sign = 0;
                        $(".ev-areasCon section").each(function (i, e) {
                            if ($(e).attr("select") == "yes") {
                                sign = 1
                            }
                        })
                        if (sign === 1) {
                            $('.ev-areasSave').addClass('focus')
                        } else {
                            $('.ev-areasSave').removeClass('focus')
                        }
                        //t.saveAreaExp(1);
                    });
                })
            },
            //保存专业领域
            saveAreaExp: function (pId) {
                var t = this;
                $(".ev-areasSave").on("click", function () {
                    if ($(this).hasClass('focus')) {
                        var html = "";
                        var str = "";
                        $.each($(".ev-areasCon section"), function (i, em) {
                            if ($(em).attr("select") == "yes") {
                                html += $("figcaption", $(em)).text() + "、";
                                str += $("figcaption", $(em)).attr("tagid") + "_" + $("figcaption", $(em)).text() + ",";
                            }
                        });
                        $("#areasExpertise").text(comm.getStrLen(html.substring(0, html.length - 1), $(window).width() < 760 ? 26 : 30));
                        $("#areasExpertise").attr({
                            areasExpertise: str.substring(0, str.length - 1),
                            nowVal: str.substring(0, str.length - 1),
                            pId: pId
                        });
                        if (html) {
                            $("#areasExpertise").css("color", "#333");
                        } else {
                            $("#areasExpertise").css("color", "#aaa").text("请选择专科");
                        }
                        checkFinish();
                        $(".ev-mainInner").show();
                        $(".ev-areaInner,.ev_areasCon").hide();
                    }


                });
            }
        };

        function radioSelect() {
            $('.al-radioInput').click(function () {
                $(this).addClass('selected').siblings('.al-radioInput').removeClass('selected');
                $(this).siblings('input').val($(this).attr('val'));
            });
        }

        //获取个人信息
        var getUserInfo = {
            init: function (fn) {
                var t = this;
                comm.loading.show();
                $.ajax({
                    type: "post",
                    url: M_CALL + "customer/unite/getMapById/",
                    data: {paramJson: $.toJSON({customerId: TempCache.getItem('userId'), "logoUseFlag": UseFlag.d})},
                    dataType: "json",
                    async: false,
                    success: function (rep) {
                        comm.loading.hide();
                        if (rep && rep.responseObject.responseData && rep.responseObject.responseData.data_list) {
                            if (rep.responseObject.responseData.data_list.length > 0) {
                                responseData = rep.responseObject.responseData.data_list[0];

                                var auth = responseData.customer_auth;
                                var baseInfo = responseData.customer_baseinfo;
                                // 判断首次认证
                                if (auth.state == -1) {
                                    $('.ev_certSave').attr('firstTimeToAuth', true);
                                    $('.serviceTime').show();
                                }

                                //姓名
                                $('#fullName').val(auth.lastName + auth.firstName).blur().attr('preVal', auth.lastName + auth.firstName);
                                //性别
                                radioSelect();
                                if (baseInfo.sex == '女') {
                                    $('.ev-sexRadio').eq(1).click();
                                    $('input[name=sex]').attr('preVal', '女');
                                } else {
                                    $('.ev-sexRadio').eq(0).click();
                                    $('input[name=sex]').attr('preVal', '男')
                                }
                                //年龄
                                ymd({
                                    year: $("#year01"),
                                    month: $("#month01"),
                                    day: $('#day01'),
                                    latestYear: 2000,
                                    default1: true
                                });
                                var birthday = auth.birthYear || baseInfo.birthday;
                                if (birthday && !$.isEmptyObject(birthday)) {
                                    gettime($("#year01"), birthday.substring(0, 4), 1);
                                    gettime($("#month01"), birthday.substring(5, 7), 1);
                                    gettime($('#day01'), birthday.substring(8, 10) ? birthday.substring(8, 10) : '01', 1);
                                    $("#year01").attr('preVal', birthday.substring(0, 4));
                                    $("#month01").attr('preVal', birthday.substring(5, 7));
                                    $("#day01").attr('preVal', birthday.substring(8, 10));
                                } else {
                                    gettime($("#year01"), '1980', 1);
                                    gettime($("#month01"), '01', 1);
                                    gettime($('#day01'), '01', 1);
                                }
                                $('#year01').on('change', function () {
                                    $('#month01 option[value=01]').attr('selected', true);
                                    $('#day01 option[value=01]').attr('selected', true);
                                    checkFinish();
                                });
                                $('#month01').on('change', function () {
                                    $('#day01 option[value=01]').attr('selected', true);
                                    checkFinish();
                                });
                                $('#day01').on('change', function () {
                                    checkFinish();
                                });
                                //单位
                                if (auth.workplace) {
                                    $('#company').text(comm.getStrLen(auth.workplace, 30))
                                        .attr({
                                            workplaceType: auth.workplaceType,
                                            nowVal: auth.workplace,
                                            companyId: auth.workplaceId,
                                            preVal: auth.workplace
                                        }).removeClass('placeHolderColor');
                                }
                                //职称
                                if (auth.medicalTitle != "") {
                                    $('#medicalTitle')
                                        .text(comm.getStrLen(comm.cutLine(auth.medicalTitle, "_", ","), $(window).width() < 760 ? 26 : 30))
                                        .attr({nowVal: auth.medicalTitle, preVal: auth.medicalTitle})
                                        .removeClass('placeHolderColor');
                                }
                                //一级职称
                                var medIds = [1, 2, 3, 4, 10, 11];
                                var mIds = auth.medicalTitle.match(/\d+/g) || [];    //10_医学生,6_副教授

                                $.each(mIds, function (mi, me) {
                                    $.each(medIds, function (mei, med) {
                                        if (me == med) {
                                            $('#medicalTitle').attr('medFirstClass', 1);
                                            return false;
                                        }
                                    });
                                });
                                //专业
                                if (auth.platformId == 2) {
                                    $('.ev-platformRadio').eq(1).click();
                                    $('input[name=platformId]').attr('preVal', '2');
                                    $('.ev_changeArea').attr('formId', 2);
                                } else {
                                    $('.ev-platformRadio').eq(0).click();
                                    $('input[name=platformId]').attr('preVal', '1');
                                    $('.ev_changeArea').attr('formId', 1);
                                }

                                //专科
                                if (auth.areasExpertiseShow) {
                                    $('#areasExpertise').text(comm.getStrLen(auth.areasExpertiseShow, $(window).width() < 760 ? 26 : 30))
                                        .attr({
                                            nowVal: auth.areasExpertise,
                                            preVal: auth.areasExpertise,
                                            pId: auth.platformId
                                        })
                                        .removeClass('placeHolderColor');
                                }
                                checkFinish();
                            } else {
                                ymd({
                                    year: $("#year01"),
                                    month: $("#month01"),
                                    day: $('#day01'),
                                    latestYear: '2000',
                                    default1: true
                                });
                                $('#year01').on('change', function () {
                                    $('#month01 option[value=01]').attr('selected', true);
                                    $('#day01 option[value=01]').attr('selected', true);
                                    checkFinish();
                                });
                                $('#month01').on('change', function () {
                                    $('#day01 option[value=01]').attr('selected', true);
                                    checkFinish();
                                });
                                $('#day01').on('change', function () {
                                    checkFinish();
                                });
                            }
                        } else {
                            ymd({
                                year: $("#year01"),
                                month: $("#month01"),
                                day: $('#day01'),
                                latestYear: '2000',
                                default1: true
                            });
                            $('#year01').on('change', function () {
                                $('#month01 option[value=01]').attr('selected', true);
                                $('#day01 option[value=01]').attr('selected', true);
                                checkFinish();
                            });
                            $('#month01').on('change', function () {
                                $('#day01 option[value=01]').attr('selected', true);
                                checkFinish();
                            });
                            $('#day01').on('change', function () {
                                checkFinish();
                            });
                        }
                    }
                });
            }
        };
        var index = {
            path: {
                createAuthNew: M_CALL + 'customer/auth/createAuth2/',  //
                updateAuth: M_CALL + 'customer/revise/auth/create/',                  //申请认证变更-基本信息
                updateAttachement: M_CALL + "customer/attachment/revise/create/",
                getCustomerAuth: M_CALL + "customer/auth/getCustomerAuth/",//获取认证信息
                getDataRoleConfigs: M_CALL + "comm/data/roleconfig/getDataRoleConfigs/",//获取会员证件类型
                getAuthAttachments: M_CALL + "customer/auth/getAuthAttachments/",//获取认证附件
                upload: M_CALL + "comm/upload_attachment/upload/",//上传图片
                creatAuth: M_CALL + "customer/auth_attachment/createAuthAttachment/",
                errorReport: M_CALL + "customer/auth_process/getMapList/"
            },
            init: function () {
                // window.onload = Log.createBrowse(10001, '认证-基本信息');
                setTimeout(function(){
                    if(g_sps) {
                        g_sps.createBrowse({pageId:449})
                    }},2000);
                var t = this;
                t.edit();
                t.backBtn();
                t.nextStepBtn();
                company.init();
                medTitle.init();
                getUserInfo.init();
                expertise.init();
                t.helpModule();
                t.errorReport();
                t.submit();
                t.platFormChange();
                t.showAuthRightTip();
                //t.loadCertificate();

            },

            edit: function () {
                var t = this;
                $('#fullName').on('input propertychange blur', function () {
                    if (comm.getByteLen($.trim($(this).val())) > 50) {
                        $(this).val(t.getCutStr($.trim($(this).val()), 50));
                    }
                    checkFinish();
                });
                //$('select').on('change',function(){
                //    checkFinish();
                //});


            },
            showAuthRightTip: function () {
                $('.authRight').click(function () {
                    comm.creatEvent({
                        triggerType: "认证",
                        triggerName: '认证-等级规则',
                        keyword: '认证-等级规则',
                        actionId: 2517
                    });
                    $('.serviceTime').show();
                });
                $('.ev-authGradeClose').click(function () {
                    $('.serviceTime').hide();
                });

            },
            platFormChange: function () {
                $('.ev-platformRadio').on('click', function () {
                    if ($(this).attr('val') != $('#areasExpertise').attr('pId')) {//如果变了 清空
                        $('#areasExpertise').html('请选择专科').css('color', "#909090");
                    } else {
                        if ($('#areasExpertise').attr('nowVal') && $('#areasExpertise').attr('pId') == $(this).attr('val')) {
                            $('#areasExpertise').html($('#areasExpertise').attr('nowVal').replace(/\d+_/g, "")).attr('nowVal', $('#areasExpertise').attr('nowVal')).css('color', '#333');
                        }
                    }
                    checkFinish();
                });

            },
            errorReport: function () {
                var state = TempCache.getItem('auth') ? JSON.parse(TempCache.getItem('auth')).state : null;
                var t = this;
                var param = {
                    customerId: TempCache.getItem('userId'),
                    state: state,
                    sortType: 3,
                    firstResult: 0,
                    maxResult: 1
                };
                var callback = function (data) {
                    if (comm.hasResponseData(data) && data.responseObject.responseData.data_list && data.responseObject.responseData.data_list.length) {
                        var dataList = data.responseObject.responseData.data_list[0];
                        if (dataList.supplement) {
                            $('.authErrorMessage').html(dataList.supplement + "<i></i>").removeClass('hide');
                            $('.authErrorMessage i').click(function () {
                                $(this).parent().remove();
                            });
                        }
                    }
                };

                if (state == 3 || state == 9) {
                    comm.ajax.async(t.path.errorReport, {paramJson: $.toJSON(param)}, callback);
                }

            },
            helpModule: function () {
                $('.ev-help').click(function () {
                    comm.creatEvent({
                        triggerType: "认证",
                        triggerName: '认证-帮助',
                        keyword: '认证-帮助',
                        actionId: 2514,
                        browType: $('.ev_authStepOne').is(":visible") ? 10001 : 10014
                    });
                    $('.al-authHelpBg').addClass('on');
                });
                $('.ev_helpClose').click(function () {
                    $('.al-authHelpBg').removeClass('on');
                });
                $('.al-authHelpContact a').click(function () {
                    comm.creatEvent({
                        triggerType: "认证",
                        triggerName: '认证-帮助电话呼叫',
                        keyword: '认证-帮助电话呼叫',
                        actionId: 2515,
                        browType: $('.ev_authStepOne').is(":visible") ? 10001 : 10014
                    });
                });

            },
            backBtn: function () {
                var t = this;
                $('.ev_authBackBtn').off('click').click(function () {
                    var hash = location.hash;
                    if (/#secondStep/g.test(hash)) {
                        $('.ev_authStep').hide().eq(0).show();
                        history.back();
                        comm.creatEvent({
                            triggerType: "认证",
                            triggerName: '认证信息-返回',
                            keyword: '认证信息-返回',
                            browType: 10014,
                            actionId: 2511,
                            async: false
                        });
                        $('.ev_skipAuth').show().siblings('img').hide();
                    } else {
                        comm.creatEvent({
                            triggerType: "认证",
                            triggerName: '基本信息-返回',
                            keyword: '基本信息-返回',
                            browType: 10001,
                            actionId: 2504
                        });
                        if ($('.ev_certSave').hasClass('active') || $('.ev_authNextStep').hasClass('active') || checkHasChangedItem()) {
                            comm.confirmBox({
                                title: (comm.getpara().reAuth ? "<span class='giveUp'>确定放弃认证吗？</span><br/>放弃认证将无法正常使用唯医" : "<span class='giveUp'>确定放弃认证变更吗</span><br/>现在放弃将丢失已修改的内容"),
                                cancel: "放弃",
                                ensure: "继续认证",
                                cancelCallback: function () {
                                    comm.creatEvent({
                                        triggerType: '认证',
                                        triggerName: "暂不认证",
                                        keyword: "暂不认证",
                                        browType: 10001,
                                        actionId: 2501
                                    });
                                    TempCache.removeItem('needAuthRegist');
                                    t.backFn();

                                }
                            });
                        } else {
                            TempCache.removeItem('needAuthRegist');
                            t.backFn();
                        }
                    }

                });
            },
            backFn: function () {
                var fromPage = TempCache.getItem('fromPage') || TempCache.getItem('fromPageN');
                if (/message_main/.test(fromPage) ||
                    /html\/m\/(video|case|topic|doc)/g.test(fromPage) ||
                    /i_want.html/g.test(fromPage) ||
                    /friends_circle/g.test(fromPage) ||
                    /_upload.html/g.test(fromPage)
                ) {
                    g_sps.jump(null, "/");
                } else if (/live-wrap/g.test(fromPage)) {
                    history.go(-2);
                } else if (/login.html/.test(document.referrer) || /register.html/.test(document.referrer)) {//注册或登录之后直接认证，返回fromPage页，或上一页
                    if (fromPage) {
                        g_sps.jump(null, fromPage);
                    } else {
                        history.back();
                    }
                } else {
                    history.back();
                }
            },
            nextStepBtn: function () {
                var t = this;
                var reAuth = comm.getpara().reAuth;//重新认证
                $('.ev_authNextStep').on('click', function () {
                    //下一步
                    comm.creatEvent({
                        triggerType: '认证',
                        triggerName: '基本信息-下一步',
                        keyword: '基本信息-下一步',
                        actionId: 2505,
                        browType: 10001
                    });
                    var btnSelf = $(this);
                    var callBack = function () {
                        $('.ev_authStepOne').hide();
                        $('.ev_authStepTwo').show();
                        $('.ev_skipAuth').hide().siblings('img').show();
                        location.hash = "#secondStep";
                        if (!btnSelf.hasClass('ev-hasLoadedCert')) {
                            // Log.createBrowse(10014, '认证-证件信息');

                            setTimeout(function(){
                                if(g_sps){
                                    g_sps.createBrowse({pageId:450});
                                }
                            }, 2000);
                            t.loadCertificate($('#medicalTitle').text() == '医学生');
                        } else {
                            if (/医学生/g.test($('#medicalTitle').text())) {
                                $('.ev-imgAtt11,.ev-imgAtt12').find('img').eq(0).attr('src', $('.ev-imgAtt11,.ev-imgAtt12').attr('stuPic'));
                                if ($('.ev-imgAtt11,.ev-imgAtt12').attr('stuPic') || $('.ev-imgAtt11,.ev-imgAtt12').attr('oldPic')) {
                                    $('.ev-imgAtt11,.ev-imgAtt12').find('img').eq(0).attr('src', $('.ev-imgAtt11,.ev-imgAtt12').attr('stuPic') || $('.ev-imgAtt11,.ev-imgAtt12').attr('oldPic'));
                                } else {
                                    $('.ev-imgAtt11,.ev-imgAtt12').find('img').eq(0).attr('src', $('.ev-imgAtt11,.ev-imgAtt12').find('img').eq(0).attr('oriUrl'));
                                    $('.ev-imgAtt11,.ev-imgAtt12').find('.al-certClose').addClass('hide');
                                    $('.ev-imgAtt11,.ev-imgAtt12').find('img').eq(0).removeClass('newUploadSuccess');
                                    $('.ev-imgAtt11,.ev-imgAtt12').find('input').show();
                                }
                                $('.ev-imgAtt11,.ev-imgAtt12').find('img').eq(0).attr('id', $('.ev-imgAtt11,.ev-imgAtt12').attr('stuId') || $('.ev-imgAtt11,.ev-imgAtt12').attr('oldId') || "");

                                $('.ev-imgAtt11,.ev-imgAtt12').parents('.al-certificateToggleArea').find('h3').html('学生证');
                                $('.ev-imgAtt11,.ev-imgAtt12').addClass('ev-imgAtt12').attr("atttype",12).removeClass('ev-imgAtt10 ev-imgAtt11');
                                t.viewBigImg('.al-certItem .al-certItemUploadBox');
                                if($(".ev-imgAtt7").parents(".al-certificateItems")
                                    .siblings(".al-tableModuleItem").find(".grayInfo").length){
                                    $(".ev-imgAtt7").parents(".al-certificateItems")
                                        .siblings(".al-tableModuleItem").find(".grayInfo").remove();
                                    $(".ev-imgAtt7").parents(".al-certificateItems")
                                        .siblings(".al-tableModuleItem").find("h3").removeClass("newAddTips");
                                }
                                if($(".ev-imgAtt9").parents(".al-certificateItems")
                                    .siblings(".al-tableModuleItem").find(".grayInfo").length){
                                    $(".ev-imgAtt9").parents(".al-certificateItems")
                                        .siblings(".al-tableModuleItem").find(".grayInfo").remove();
                                    $(".ev-imgAtt9").parents(".al-certificateItems")
                                        .siblings(".al-tableModuleItem").find("h3").removeClass("newAddTips");
                                }

                            } else {
                                $('.ev-imgAtt11,.ev-imgAtt12').find('img').eq(0).attr('src', $('.ev-imgAtt11,.ev-imgAtt12').attr('workPic'));
                                if ($('.ev-imgAtt11,.ev-imgAtt12').attr('workPic') || $('.ev-imgAtt11,.ev-imgAtt12').attr('oldPic')) {
                                    $('.ev-imgAtt11,.ev-imgAtt12').find('img').eq(0).attr('src', $('.ev-imgAtt11,.ev-imgAtt12').attr('workPic') || $('.ev-imgAtt11,.ev-imgAtt12').attr('oldPic'));
                                } else {
                                    $('.ev-imgAtt11,.ev-imgAtt12').find('img').eq(0).attr('src', $('.ev-imgAtt11,.ev-imgAtt12').find('img').eq(0).attr('oriUrl'));
                                    $('.ev-imgAtt11,.ev-imgAtt12').find('.al-certClose').addClass('hide');
                                    $('.ev-imgAtt11,.ev-imgAtt12').find('img').eq(0).removeClass('newUploadSuccess');
                                    $('.ev-imgAtt11,.ev-imgAtt12').find('input').show();
                                }
                                $('.ev-imgAtt11,.ev-imgAtt12').find('img').eq(0).attr('id', $('.ev-imgAtt11,.ev-imgAtt12').attr('workId') || $('.ev-imgAtt11,.ev-imgAtt12').attr('oldId') || "");
                                $('.ev-imgAtt11,.ev-imgAtt12').parents('.al-certificateToggleArea').find('h3').html('工作证');
                                $('.ev-imgAtt11,.ev-imgAtt12').addClass('ev-imgAtt11').attr("atttype",11).removeClass('ev-imgAtt10 ev-imgAtt12');
                                t.viewBigImg('.al-certItem .al-certItemUploadBox');
                                if(!$(".ev-imgAtt7").parents(".al-certificateItems")
                                    .siblings(".al-tableModuleItem").find(".grayInfo").length){
                                    $(".ev-imgAtt7").parents(".al-certificateItems")
                                        .siblings(".al-tableModuleItem").append('<p class="grayInfo">仅上传学位证无法完成认证</p>');
                                    $(".ev-imgAtt7").parents(".al-certificateItems")
                                        .siblings(".al-tableModuleItem").find("h3").addClass("newAddTips");
                                }
                                if(!$(".ev-imgAtt9").parents(".al-certificateItems")
                                    .siblings(".al-tableModuleItem").find(".grayInfo").length){
                                    $(".ev-imgAtt9").parents(".al-certificateItems")
                                        .siblings(".al-tableModuleItem").append('<p class="grayInfo">仅上传学历证无法完成认证</p>');
                                    $(".ev-imgAtt9").parents(".al-certificateItems")
                                        .siblings(".al-tableModuleItem").find("h3").addClass("newAddTips");
                                }
                            }
                            checkCertReady();
                        }

                    };
                    if ($(this).hasClass('active') && !t.submitting) {

                        var compType = $('#company').attr('workplaceType');             //单位类型
                        var compVal = $('#company').attr('nowVal');                     //单位名称
                        var compId = $('#company').attr('companyId');                   //单位号码
                        var birthYear = $('#year01').val();                             //出生年月日
                        var birthMonth = $('#month01').val();
                        var birthDay = $('#day01').val();
                        var param = {
                            customerId: TempCache.getItem('userId'),
                            fullName: $('#fullName').val(),
                            birthday: birthYear + "-" + birthMonth + '-' + birthDay,
                            attType: $(".ev_certType").attr('selectCert'),
                            attPath: $('.ev_loadedPic').attr('src'),
                            attCode: $("input[name=attCode]").val(),
                            company: compType == 1 ? compVal : "",
                            companyId: compType == 1 ? compId : "",
                            schoolName: compType == 2 ? compVal : "",
                            schoolId: compType == 2 ? compId : "",
                            medicalTitle: $('#medicalTitle').attr('nowVal'),                 //职称
                            areasExpertise: $('#areasExpertise').attr('nowVal'),            //专业
                            platformId: $('input[name=platformId]').val(),                   //科室
                            opflag: 1,
                            sex: $('input[name=sex]').val(),
                            sexId: $('input[name=sex]').val() == '男' ? 1 : 2,
                            medicalTitleId: $('#medicalTitle').attr('medFirstClass') == 1 ? $('#medicalTitle').attr('nowVal').match(/\d+/)[0] : ""
                        };
                        var param2 = {
                            customerId: TempCache.getItem('userId'),
                            updateFullName: $('#fullName').val(),
                            updateSexId: $('input[name=sex]').val() == '男' ? 1 : 2,
                            updateSex: $('input[name=sex]').val(),
                            updateBirthday: birthYear + "-" + birthMonth + '-' + birthDay,
                            updateWorkplaceType: compType,
                            updateWorkplaceId: compId,
                            updateWorkplace: compVal,
                            updateMedicalTitle: $('#medicalTitle').attr('nowVal'),
                            updatePlatformId: $('input[name=platformId]').val(),
                            updateAreasExpertise: $('#areasExpertise').attr('nowVal')
                        };
                        var _fnSuc = function (data) {
                            t.submitting = false;
                            comm.loading.hide();
                            if (data && data.responseObject && data.responseObject.responseStatus) {
                                if (reAuth) {
                                    t.resPK = data.responseObject.responsePk;
                                }
                                //重新保存信息
                                $('#company').attr('preVal', $('#company').attr('nowVal'));                     //单位名称
                                $('#fullName').attr('preVal', $('#fullName').val());
                                $('input[name=sex]').attr('preVal', $('input[name=sex]').val());
                                $('#year01').attr('preVal', $('#year01').val());
                                $('#month01').attr('preVal', $('#month01').val());
                                $('#day01').attr('preVal', $('#day01').val());
                                $('#medicalTitle').attr('preVal', $('#medicalTitle').attr('nowVal'));
                                $('input[name=platformId]').attr("preVal", $('input[name=platformId]').val());
                                $('#areasExpertise').attr('preVal', $('#areasExpertise').attr('nowVal'));
                                callBack();
                            }
                        };

                        if (reAuth) {
                            t.submitting = true;
                            comm.loading.show();
                            comm.ajax.async(t.path.updateAuth, {paramJson: $.toJSON(param2)}, _fnSuc);
                        } else {
                            if (checkHasChangedItem()) {
                                t.submitting = true;
                                comm.loading.show();
                                comm.ajax.async(t.path.createAuthNew, {paramJson: $.toJSON(param)}, _fnSuc);
                            } else {
                                if (!t.submitting) {
                                    callBack();
                                }
                            }

                        }
                    }
                });
            },
            getCutStr: function (str, len) {
                if (typeof str != 'undefined') {
                    var newStr = '',
                        newLength = 0;
                    for (var i = 0; i < str.length; i++) {
                        if (str.charCodeAt(i) > 128) {
                            newLength += 2;
                        } else {
                            newLength++;
                        }
                        if (newLength <= len) {
                            newStr = newStr.concat(str[i]);
                        } else {
                            break;
                        }
                    }
                    return newStr;
                }
            },
            //加载证书项
            loadCertificate: function (isStu) { //isStu  是学生证还是工作证
                var t = this;
                var param = {roleId: 6, typeId: 1};
                $.ajax({
                    type: 'POST',
                    url: commdata.urlList.getDataRoleConfigs.url,
                    data: {paramJson: $.toJSON(param)},
                    async: false,
                    dataType: "json",
                    timeout: 10000,
                    success: function callback(rep) {
                        $('.ev_authNextStep').addClass('ev-hasLoadedCert');
                        var html = "";
                        var certArr = [];
                        if (rep && rep.responseObject && rep.responseObject.responseStatus) {
                            var data = rep.responseObject.responseMessage;
                            if (data && data.length > 1) {
                                //1*身份证,8*医师执业证,6*医师资格证,13*医师职称证书,10工作证(学生证),9医学学历证,7医学学位证
                                $.each(data, function (index, i) {
                                    if (i.refId != 1) {//其他证件
                                        html += t.certTemplate(i.refId, i.refValue, isStu);
                                    } else {//身份证
                                        $('.ev_idCert').html(t.certTemplate(1, i.refValue));
                                    }
                                });
                                $('.ev_notIdCert').html(html);
                                $('.ev_notIdCert .al-certCode input').on('input change propertychange copy cut paste', function () {
                                    $(this).val($(this).val().replace(/[^0-9a-zA-Z]/g, ''));
                                    if (comm.getByteLen($.trim($(this).val())) > 50) {
                                        $(this).val(t.getCutStr($.trim($(this).val()), 50));
                                    }
                                    checkCertReady();
                                });
                                $('.ev_idCert .al-certCode input').on('input change propertychange copy cut paste', function () {
                                    $(this).val($(this).val().replace(/[^0-9x]/g, ''));
                                    if ($.trim($(this).val()).length > 18) {
                                        $(this).val($(this).val().substring(0, 18));
                                    }
                                    checkCertReady();
                                });
                                t.getAuthAttachments(isStu);

                                //①默认展开“医师执业证”，其他项收起。
                                $('.ev-imgAtt8').parents('.al-certificateToggleArea').addClass('slideDownState');

                                //当A项证件照点开但未上传图片，又展开其他项时，A项自动收起；
                                $('.al-certificateToggleArea .al-tableModuleItem').off('click').click(function () {
                                    var selfPa = $(this).parent().index();
                                    if ($(this).parent().hasClass('slideDownState')) {
                                        $(this).parent().removeClass('slideDownState');
                                    } else {
                                        $(this).parent().addClass('slideDownState');

                                        $.each($('.al-certificateToggleArea'), function (ix, iex) {
                                            if ($(iex).parents('.ev_idCert').length) {    //身份证的index与其他的不在同一个父元素里面，此处重新赋值
                                                selfPa = $('.al-certificateToggleArea').length - 1;
                                            }
                                            if (ix != selfPa) {
                                                if (!$(iex).hasClass('hasLoadedCerts')) {
                                                    if ($(iex).find('.newUploadSuccess').length == 0) {
                                                        $(iex).removeClass('slideDownState');
                                                    }
                                                }
                                            }


                                        });
                                    }
                                });
                                // t.viewBigImg('.al-certItem section:not(.al-certItemUploadBox)');
                                $('.ev_demoImg').each(function (ix, ele) {
                                    var img = new Image();
                                    img.src = $(ele).attr('imgSrc');
                                    img.onload = function () {
                                        $(ele).attr('src', img.src);
                                        t.viewBigImg($('.ev_demoImg').parent());
                                    };
                                });
                                $.each($('.ev_attFile'), function (i, e) {
                                    t.bindUpload($(e));
                                });
                            }
                        }
                    }
                });
            },
            //处理异步请求（工作证class名字替换引起的找不见class元素问题）
            dealAsync:function(isStu){
                var t=this;
                if (isStu) {//工作证11，学生证12
                    $('.ev-imgAtt10').addClass('ev-imgAtt12').removeClass('ev-imgAtt10').attr("attType","12");
                    if ($('.ev-imgAtt12').attr('workPic')) {
                        $('.ev-imgAtt12').find('img').eq(0).attr('src', $('.ev-imgAtt12').attr('workPic'));
                    } else {
                        $('.ev-imgAtt12').find('img').eq(0).attr('src', $('.ev-imgAtt12').attr('oldPic'));
                    }
                } else {
                    $('.ev-imgAtt10').addClass('ev-imgAtt11').removeClass('ev-imgAtt10').attr("attType","11");
                    if ($('.ev-imgAtt11').attr('workPic')) {
                        $('.ev-imgAtt11').find('img').eq(0).attr('src', $('.ev-imgAtt11').attr('workPic'));
                    } else {
                        $('.ev-imgAtt11').find('img').eq(0).attr('src', $('.ev-imgAtt11').attr('oldPic'));
                    }
                }
            },
            getAuthAttachments: function (isStu) {
                var t = this;
                $.ajax({
                    url: t.path.getAuthAttachments,
                    data: {"dataFlag": 2, pageSize: 20},
                    type: "get",
                    dataType: "json",
                    success: function (res) {
                        if (comm.hasResponseData(res) && res.responseObject.responseData.data_list && res.responseObject.responseData.data_list.length) {
                            var data_list = res.responseObject.responseData.data_list;
                            var newData = [];
                            var flag = false;
                            $.each(data_list, function (ni, nel) {
                                if (newData.length == 0) {
                                    newData.push(nel);
                                } else {
                                    $.each(newData, function (ji, jel) {
                                        flag = false;
                                        if (jel.attType == nel.attType && jel.attPositionType == nel.attPositionType) {
                                            flag = true;
                                            if (jel.createTime && nel.createTime && Date.parse(jel.createTime.substring(0, 19)) > Date.parse(nel.createTime.substring(0, 19))) {//新数组中同一位置 图片时间> 老的时间 ==为新
                                                newData.splice(ji, 1, jel);
                                            } else {
                                                newData.splice(ji, 1, nel);
                                            }
                                            return false;
                                        }

                                    });
                                    if (!flag) {
                                        newData.push(nel);
                                    }
                                }
                            });

                            $.each(newData, function (i, ele) {
                                //图片
                                var _temp;
                                if (ele.attType == 10 || ele.attType == 11 || ele.attType == 12) {
                                    _temp = $('.ev-imgAtt10');
                                    if (ele.attType == 11) {
                                        if($('#medicalTitle').text().indexOf('医学生')==-1){
                                            $('.ev-imgAtt10,.ev-imgAtt11,.ev-imgAtt12').attr({
                                                workPic: ele.attPath,
                                                workId: ele.id
                                            });
                                        }
                                    } else if (ele.attType == 12) {
                                        if($('#medicalTitle').text().indexOf('医学生')>-1){
                                            $('.ev-imgAtt10,.ev-imgAtt11,.ev-imgAtt12').attr({
                                                stuPic: ele.attPath,
                                                stuId: ele.id
                                            });
                                        }
                                    } else {
                                        $('.ev-imgAtt10').attr({oldPic: ele.attPath, oldId: ele.id});
                                    }

                                    if (ele.attType != 10) {
                                        if($('#medicalTitle').text().indexOf('医学生')>-1&&ele.attType==12){
                                            _temp.addClass('ev-imgAtt' + ele.attType).removeClass('ev-imgAtt10').attr("attType",ele.attType);
                                        }else if($('#medicalTitle').text().indexOf('医学生')==-1&&ele.attType==11){
                                            _temp.addClass('ev-imgAtt' + ele.attType).removeClass('ev-imgAtt10').attr("attType",ele.attType);
                                        }
                                    }
                                    _temp = $('.ev-imgAtt' + ele.attType);

                                    // _temp = $('.ev-imgAtt10,.ev-imgAtt11,.ev-imgAtt12');
                                } else {
                                    _temp = $('.ev-imgAtt' + ele.attType);
                                }

                                var _img = _temp.eq(ele.attPositionType - 1).find('img');
                                //②用户上传过的证件将展开；
                                _temp.parents('.al-certificateToggleArea').addClass('slideDownState hasLoadedCerts');
                                if(ele.attPath&&(ele.attPath.indexOf('jpg')!=-1||ele.attPath.indexOf('jpeg')!=-1||ele.attPath.indexOf('png')!=-1||ele.attPath.indexOf('PNG')!=-1||ele.attPath.indexOf('JPEG')!=-1||ele.attPath.indexOf('JPG')!=-1)){
                                    $(_img.eq(0)).attr({
                                        src: '//img50.allinmd.cn/authentication/certificate/authImgLoading.png',
                                        imgSrc: ele.attPath,
                                        id: ele.id,
                                        preVal: ele.attPath
                                    }).addClass('newUploadSuccess');
                                    // _img.siblings('.al-certClose').removeClass('hide').off('click').click(function(){
                                    _img.siblings('.al-certClose').off('click').click(function () {
                                        _img.eq(0).attr('src', _img.eq(0).attr('oriurl')).removeClass('newUploadSuccess hide').addClass('newDelete').removeAttr('imgSrc');
                                        $(this).addClass('hide');
                                        _img.siblings('input').show();
                                        if (_temp.parents('.al-certificateItems').find('.newUploadSuccess').length < _temp.parents('.al-certificateItems').find('input').length) {
                                            if ($('html').attr('emptyAttCode') == _temp.parents('.al-certificateItems').find('.al-firstCertItem>section').eq(1).attr('class').split('al-certItemUploadBox ')[1]) {
                                                $('html').removeAttr('emptyAttCode');
                                            }
                                        }
                                        checkCertReady();
                                    });
                                    _img.siblings('input').hide();
                                }


                                if (ele.attCode) {//证件号
                                    _temp.parents('.al-certificateItems').siblings('.al-certCode').find('input').val(ele.attCode).attr('preVal', ele.attCode);
                                } else {
                                    //_temp.parents('.al-certificateItems').siblings('.al-certCode').find('input').remove();
                                }
                                checkCertReady();
                            });

                            $('.al-certItemUploadBox .newUploadSuccess').each(function (i, el) {
                                var img = new Image();
                                img.src = $(el).attr('imgSrc');
                                img.onload = function () {
                                    if (img.src) {
                                        $(el).attr('src', img.src);
                                        $(el).siblings('.al-certClose').removeClass('hide');
                                        t.viewBigImg('.al-certItemUploadBox');
                                    }
                                };
                            });
                        }
                        t.dealAsync(isStu);
                    }
                });
            },
            //证书模板
            certTemplate: function (refId, refValue, isStu) {
                var demoImg = [];//存放示例图片
                var tipWords = '';
                var isStudent = $('#medicalTitle').text() == "医学生";
                var loadingImg = '//img50.allinmd.cn/authentication/certificate/authImgLoading.png';
                demoImg[8] = ['pic_zhiye1.png', 'pic_zhiye2.png'];
                demoImg[6] = ['pic_zige1.png', 'pic_zige2.png'];
                demoImg[13] = ['pic_zhicheng.png'];
                demoImg[10] = ['pic_work.png', 'pic_student.png'];
                demoImg[7] = ['pic_xuewei.png'];
                demoImg[9] = ['pic_xueli.png'];
                demoImg[1] = ['pic_id1.png', 'pic_id2.png'];
                if (refId == 1 || refId == 6 || refId == 8) {
                    tipWords = '第一页'
                }
                var _tipsText="",//医学学历和医学学位证增加提示文本信息(非医学生的情况)
                    _h3Class=false;

                if(!isStudent){
                    if(refId==7){
                        _h3Class=true;
                        _tipsText='<p class="grayInfo">仅上传学位证无法完成认证</p>';
                    }
                    if(refId==9){
                        _h3Class=true;
                        _tipsText='<p class="grayInfo">仅上传学历证无法完成认证</p>';
                    }
                }
                var html =
                    ' <section class="al-certificateToggleArea">' +
                    '     <article class="al-tableModuleItem">' +
                    '         <h3 class="al-toggleStar '+(_h3Class?" newAddTips":"")+'">' + (refId == 10 ? (isStudent ? "学生证" : "工作证") : refValue) +
                    ((refId == 1 || refId == 6 || refId == 8 || refId == 13) ? ('<img class="al-certificateStar" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAAAXNSR0IArs4c6QAAAbVJREFUOBHFlM9Kw0AQxr+NVQQRDyIIHjxIVawH/2Go6KGKBx/Cx/DqC/gY6r1HoehJLJX676CIpQcPgiAeRCxi1fWbko0xm5pICy4kszPz228nk2SB/x66jM2216BPsERhLTapuJMQNNUaG7tMxRH6FFl84sjnHCyoGRR9v8kkvmId6m3YbyL8a8X6HPN4R8lam4KrpnBsxQMBS1hfoguvGIFCmi3YILsY4M30EA62oFFBN6oqgzeTMFaxh+sEXF5pBtMUHOY8vkW+ArfXuKVb4Vq5SnwH24qPO83HLTDRb9gW7CNSWGWbzhy5USjHnR5aEIS3Pufp0fUGWzLBh9qnO2hif7D3bN4KW3Bl1vjCEmBbRvGBA/ZsyACxVuEOHVhmpTdB9oewJPjryhdRpPhAEIycS/s0smoO1XDeevseVAuDTfxalKiwdsXX6MULnliJlbPEFake9KlxPIdzVsUUzSQSFSXZXPiIYQtrTEZwdUrsMV63ciqpcBBU/AAVdtCJMTWLNbENX+JmRBdist+Wh3mhcaiXkdcXkdVD4mTy3uEvf238ILzLy40nG5+mK3wStm3MF7+TgMtRiX3pAAAAAElFTkSuQmCC" alt=""/>') : "") +
                    '         </h3>' +
                    _tipsText+
                    '     </article>' +
                    ((refId == 1 || refId == 6 || refId == 8 || refId == 13) ?
                        '     <section class="al-certCode">' +
                        (refId == 8?'<p class="al-certAuthTips"><span>需包含必要信息页：基本信息页 和 变更信息页</span></p>':"")+//20180703 修改需求如果是医师执业证需要增加说明文字
                        '         <span>证件编号</span><input type="text" placeholder="请输入证件编号"/>' +
                        '     </section>' : "") +
                    '     <section class="al-certificateItems">' +
                    '         <section class="al-certItem al-firstCertItem">' +
                    '             <section>' +
                    '                 <img class="ev_demoImg" src="' + loadingImg + '" imgSrc="//img50.allinmd.cn/authentication/certificate/' + (refId == 10 ? (isStudent ? demoImg[10][1] : demoImg[10][0]) : demoImg[refId][0]) + '"' + (refId == 10 ? ' workPic="//img50.allinmd.cn/authentication/certificate/pic_work.png" stuPic="//img50.allinmd.cn/authentication/certificate/pic_student.png"' : "") + 'alt=""/>' +
                    '                 <span class="al-certTip '+(refId==8?' bgChange':'')+'">' +(refId==8?'基础页+照片页示例':tipWords+'示例')+'</span>' +
                    '             </section>' +
                    '             <section class="al-certItemUploadBox ev-imgAtt' + refId + ' ev_attFile" attType="' + refId + '">' +
                    '                 <img src="//img50.allinmd.cn/authentication/auth/photo.png" alt="" oriUrl="//img50.allinmd.cn/authentication/auth/photo.png"/>' +
                    //'                 <input type="file" name="file" class="attFile ev_attFile" attType="'+refId+'" id="attFile_'+refId+((refId==1||refId==6||refId==8)?'_1':"")+'"/>'+
                    '                 <figure class="al-certLoadingTip hide">' +
                    '                     <img src="//img50.allinmd.cn/case/loading.gif" alt="" class="notShow"/>' +
                    '                 </figure>' +
                    '                 <figure class="al-certErrorTip hide">' +
                    '                     <p>上传失败<br/>删除后重新上传</p>' +
                    '                 </figure>' +
                    '                 <span class="al-certClose hide"></span>' +
                    '            </section>' +
                    '         </section>' +
                    ((refId == 1 || refId == 6 || refId == 8) ? (   //两张图片的
                        '         <section class="al-certItem">' +
                        '             <section>' +
                        '                 <img class="ev_demoImg" src="' + loadingImg + '" imgSrc="//img50.allinmd.cn/authentication/certificate/' + demoImg[refId][1] + '" alt=""/>' +
                        '                 <span class="al-certTip '+(refId==8?' bgChange':'')+'">' +(refId==8?'信息页+变更页示例':'第二页示例')+'</span>' +
                        '             </section>' +
                        '             <section class="al-certItemUploadBox ev-imgAtt' + refId + ' ev_attFile" attType="' + refId + '">' +
                        '                 <img src="//img50.allinmd.cn/authentication/auth/photo.png" alt="" oriUrl="//img50.allinmd.cn/authentication/auth/photo.png"/>' +
                        //'                 <input type="file" name="file" class="attFile ev_attFile" attType="'+refId+'"  id="attFile_'+refId+((refId==1||refId==6||refId==8)?'_2':"")+'"/>'+
                        '                 <figure class="al-certLoadingTip hide">' +
                        '                     <img src="//img50.allinmd.cn/case/loading.gif" alt="" class="notShow"/>' +
                        '                 </figure>' +
                        '                 <figure class="al-certErrorTip hide">' +
                        '                     <p>上传失败<br/>删除后重新上传</p>' +
                        '                 </figure>' +
                        '                 <span class="al-certClose hide"></span>' +
                        '            </section>' +
                        '         </section>'
                    ) : "") +
                    '     </section>' +
                    ' </section>';
                return html;
            },
            //绑定上传图片
            bindUpload: function (obj) {
                var t = this;
                var loadingTip = '';//上传loading
                var errorTip = '';//错误提示
                var certClose = '';//删除
                var showImg = '';     //显示图片
                obj.uploadImg({
                    ajaxData: {
                        url: M_CALL + "comm/upload_attachment/upload/",
                    },               //ajax请求配置参数 url,type等
                    ratio: 0.6,
                    formData: {
                        paramJson: '{imageType:2}'
                    },
                    fileName: 'file',// 上传的data
                    multiple: false,            //文件单选多选
                    inputStyle: {
                        width: '100%',
                        height: '100%',
                        "z-index": 3,
                        top: 0,
                        left: 0,
                        position: "absolute",
                        opacity: 0
                    },
                    fileChange: function () {
                    },
                    fileSelected: function (file) {
                        if (!/((JPEG)|(jpeg)|(jpg)|(JPG)|(png)|(PNG))$/i.test(file.type)) {
                            popup('只允许上传.jpg .jpeg .png类型的图片文件');
                            obj.find("input").val("");
                            return false;
                        }
                        var fileSize = file.size;
                        if (fileSize > 10 * 1048576) {
                            popup("超过10M大小，无法上传");
                            obj.find("input").val("");
                            return false;
                        }
                    },
                    uploadBefore: function () {
                        var self = obj.find("input");
                        loadingTip = self.siblings('.al-certLoadingTip');//上传loading
                        errorTip = self.siblings('.al-certErrorTip');//错误提示
                        certClose = self.siblings('.al-certClose');//删除
                        showImg = self.siblings('img');     //显示图片
                        loadingTip.removeClass('hide');
                        showImg.addClass('hide');
                    },
                    uploadSuccess: function (data, status) {
                        var url = data.responseObject.responseMessage.url;
                        var path = data.responseObject.responseMessage.path;
                        if (data.responseObject.responseStatus) {
                            showImg.attr({
                                src: url,
                                val: url
                            }).removeClass('hide newDelete').addClass('newUploadSuccess');
                            loadingTip.addClass('hide');
                            t.viewBigImg('.al-certItemUploadBox');
                            obj.find("input").hide().val("");
                            checkCertReady();
                            certClose.removeClass('hide').off('click').click(function () {
                                obj.find("input").show().val("");
                                loadingTip.addClass('hide');
                                showImg.attr('src', showImg.attr('oriUrl')).removeClass('newUploadSuccess hide').removeAttr('imgSrc');
                                $(this).addClass('hide');
                                if (showImg.parents('.al-certificateItems').find('.newUploadSuccess').length < showImg.parents('.al-certificateItems').find('input').length) {
                                    if ($('html').attr('emptyAttCode') == showImg.parents('.al-certificateItems').find('.al-firstCertItem>section').eq(1).attr('class').split('al-certItemUploadBox ')[1]) {
                                        $('html').removeAttr('emptyAttCode');
                                    }
                                }
                                checkCertReady();
                            });
                        } else {
                            obj.find("input").hide().val("");
                            errorTip.removeClass('hide');
                            loadingTip.addClass('hide');
                            certClose.removeClass('hide').off('click').click(function () {
                                obj.find("input").show().val("");
                                errorTip.addClass('hide');
                                loadingTip.addClass('hide');
                                showImg.attr('src', showImg.attr('oriUrl')).removeClass('newUploadSuccess hide').removeAttr('imgSrc');
                                $(this).addClass('hide');
                                if (showImg.parents('.al-certificateItems').find('.newUploadSuccess').length < showImg.parents('.al-certificateItems').find('input').length) {
                                    if ($('html').attr('emptyAttCode') == showImg.parents('.al-certificateItems').find('.al-firstCertItem>section').eq(1).attr('class').split('al-certItemUploadBox ')[1]) {
                                        $('html').removeAttr('emptyAttCode');
                                    }
                                }
                                checkCertReady();
                            });
                        }
                    },
                    uploadFail: function (XMLHttpRequest, textStatus, errorThrown) {
                        obj.find("input").hide();
                        errorTip.removeClass('hide');
                        loadingTip.addClass('hide');
                        certClose.removeClass('hide').off('click').click(function () {
                            errorTip.addClass('hide');
                            obj.find("input").show().val("");
                            showImg.attr('src', showImg.attr('oriUrl')).removeClass('newUploadSuccess hide').removeAttr('imgSrc');
                            $(this).addClass('hide');
                            if (showImg.parents('.al-certificateItems').find('.newUploadSuccess').length < showImg.parents('.al-certificateItems').find('input').length) {
                                if ($('html').attr('emptyAttCode') == showImg.parents('.al-certificateItems').find('.al-firstCertItem>section').eq(1).attr('class').split('al-certItemUploadBox ')[1]) {
                                    $('html').removeAttr('emptyAttCode');
                                }
                            }
                            checkCertReady();
                        });
                    },
                });
            },
            viewBigImg: function (dom) {
                bigPicShow.init({
                    domIdList: dom,//,//指定多个class|| ID
                    topSwiperOptions: {
                        isInit: true,//是否需要初始化,
                        onInit: function (sipwer) {
                        },
                        zoom: true
                    },
                    imgClickCallBack: function (index, ele) {
                        // Log.createBrowse(188, '点击大图');
                        setTimeout(function(){
                            if(g_sps) {
                                g_sps.createBrowse({pageId: 451});
                            }
                        },2000);
                        $('html').attr('sT', $(window).scrollTop());
                        $('html,body').css({height: '100%', overflow: 'hidden'});
                    },
                    bottomSwiperOptions: {
                        isInit: false,//是否需要初始化,
                    },
                    closeCallBack: function () {
                        $('html,body').css({height: 'auto', overflow: 'auto'});
                        $(window).scrollTop($('html').attr('sT') || 0);
                        $('html').removeAttr('sT');
                    },
                    theme: 'dark',
                    topTitle: {
                        isInit: true,
                        title: ""
                    }
                });
            },
            showAuthPop: function (obj) {
                var html = "";
                if (obj && obj.type == "newSuccess") {
                    html = '<section class="authPopup">\n' +
                        '        <aside class="authPopupCont">\n' +
                        '            <figure class="ev_know"><img src="//img50.allinmd.cn/authentication/auth/close.png"></figure>\n' +
                        '            <aside class="exhibitionImg submit"><img src="//img50.allinmd.cn/authentication/auth/success_hint.png"></aside><!--提交成功图片-->\n' +
                        '            <article class="titleText">提交成功</article>\n' +
                        '            <article class="detailText color777">1个工作日后您可以浏览免费资源<br/>执业医师审核将在3个工作日内完成，请耐心等待</article><!--色值为#777777 浅色-->\n' +
                        '            <button class="hollowBtn ev_know">知道了</button><!--空心按钮-->\n' +
                        '        </aside>\n' +
                        '    </section>';
                } else if (obj && obj.type == "success") {
                    html = '<section class="authPopup">\n' +
                        '        <aside class="authPopupCont">\n' +
                        '            <figure class="ev_know"><img src="//img50.allinmd.cn/authentication/auth/close.png"></figure>\n' +
                        '            <aside class="exhibitionImg submit"><img src="//img50.allinmd.cn/authentication/auth/success_hint.png"></aside><!--提交成功图片-->\n' +
                        '            <article class="titleText">提交成功</article>\n' +
                        '            <article class="detailText color777">认证医师审核将在1个工作日内完成，请耐心等待</article><!--色值为#777777 浅色-->\n' +
                        '            <button class="hollowBtn ev_know">知道了</button><!--空心按钮-->\n' +
                        '        </aside>\n' +
                        '    </section>';
                } else if (obj && obj.type == "fail") {
                    html = '<section class="authPopup">\n' +
                        '        <aside class="authPopupCont">\n' +
                        '            <figure class="ev_closeAuthPop"><img src="//img50.allinmd.cn/authentication/auth/close.png"></figure>\n' +
                        '            <aside class="exhibitionImg submitFail"><img src="/images/img50/authentication/auth/defeated_hint.png"></aside>' +//<!--提交失败图片-->
                        '            <article class="titleText">提交失败</article>\n' +
                        '            <article class="detailText color777">可能是网络原因，请检查您的网络</article><!--色值为#777777 浅色-->\n' +
                        '            <button class="hollowBtn ev_reSubmit">重新提交</button><!--空心按钮-->\n' +
                        '        </aside>\n' +
                        '    </section>';
                } else if (obj && obj.type == "V2Success") {
                    html = '<section class="authPopup">\n' +
                        '        <aside class="authPopupCont">\n' +
                        '            <figure class="ev_know"><img src="//img50.allinmd.cn/authentication/auth/close.png"></figure>\n' +
                        '            <aside class="exhibitionImg submit"><img src="//img50.allinmd.cn/authentication/auth/success_hint.png"></aside><!--提交成功图片-->\n' +
                        '            <article class="titleText">提交成功</article>\n' +
                        '            <article class="detailText color777">执业医师审核将在3个工作日内完成，请耐心等待</article><!--色值为#777777 浅色-->\n' +
                        '            <button class="hollowBtn ev_know">知道了</button><!--空心按钮-->\n' +
                        '        </aside>\n' +
                        '    </section>';
                } else if (obj && obj.type == "reAuth") {
                    html = '<section class="authPopup">\n' +
                        '        <aside class="authPopupCont">\n' +
                        '            <figure class="ev_know"><img src="//img50.allinmd.cn/authentication/auth/close.png"></figure>\n' +
                        '            <aside class="exhibitionImg submit"><img src="//img50.allinmd.cn/authentication/auth/success_hint.png"></aside><!--提交成功图片-->\n' +
                        '            <article class="titleText">提交成功</article>\n' +
                        '            <article class="detailText color777">认证医师审核将在1个工作日内完成，请耐心等待</article><!--色值为#777777 浅色-->\n' +
                        '            <button class="hollowBtn ev_know">知道了</button><!--空心按钮-->\n' +
                        '        </aside>\n' +
                        '    </section>';
                }
                $('.authPopup').remove();
                $('body').append(html);
                $('.ev_know').click(function () {
                    obj.knowFn && obj.knowFn();
                });
                $('.ev_reSubmit').click(function () {
                    obj.reSubmit && obj.reSubmit();
                });
                $('.ev_closeAuthPop').click(function () {
                    var fromPage = TempCache.getItem('fromPage') || document.referrer;
                    if (/message_main/.test(fromPage) ||
                        /html\/m\/(video|case|topic|doc)/g.test(fromPage) ||
                        /i_want.html/g.test(fromPage) ||
                        /friends_circle/g.test(fromPage) ||
                        /live-wrap/g.test(fromPage) ||
                        /_upload.html/g.test(fromPage)
                    ) {
                        g_sps.jump(null, "/");
                    } else {
                        history.go(-1);
                    }
                });

            },
            //提交认证
            submit: function () {
                var t = this;
                $('.ev_certSave').click(function () {
                    var self = this;
                    comm.creatEvent({
                        triggerType: '认证',
                        triggerName: '认证信息-提交',
                        keyword: '认证信息-提交',
                        actionId: 2513,
                        browType: 10014
                    });
                    if ($(this).hasClass('active') && $(this).attr('flag') == 'true' && !t.isSubmiting) {
                        var attArr = [];
                        var attchementChange = false;
                        comm.loading.show();
                        $('.al-middleTipsBox').css({
                            left: 0, right: 0, background: "rgba(0,0,0,0.3)"
                        });
                        $.each($('.newUploadSuccess,.newDelete'), function (i, el) {
                            if ($(el).attr('src') != $(el).attr('preVal')) {
                                attchementChange = true;
                            }
                            if ($(el).parents('.al-certificateToggleArea').find('.al-certCode').length) {
                                var attInput = $(el).parents('.al-certificateToggleArea').find('.al-certCode input');
                                if (attInput.attr('preVal') != attInput.val()) {
                                    attchementChange = true;
                                }
                            }
                            if (comm.getpara().reAuth) {//认证变更
                                var updateAttPath = $(el).attr('src').split('img05.allinmd.cn/')[1];
                                if ($(el).attr('preval') || $(el).hasClass('newUploadSuccess')) {
                                    if ($(el).attr('src') && $(el).attr('src').indexOf('authentication/auth/photo.png') > -1) {//删除证件
                                        updateAttPath = '';
                                    }
                                }
                                attArr.push({
                                    attType: $(el).parent().attr('attType'),//.split('al-certItemUploadBox ev-imgAtt')[1],
                                    updateAttType: $(el).parent().attr('attType'),//.split('al-certItemUploadBox ev-imgAtt')[1],
                                    updateAttCode: $(el).parents('.al-certificateToggleArea').find('.al-certCode').length ? $(el).parents('.al-certificateToggleArea').find('.al-certCode input').val() : "",
                                    attCode: $(el).parents('.al-certificateToggleArea').find('.al-certCode').length ? $(el).parents('.al-certificateToggleArea').find('.al-certCode input').attr('preVal') : "",
                                    updateAttPath: updateAttPath,
                                    attPath: $(el).attr('preVal') ? $(el).attr('preVal').split('img05.allinmd.cn/')[1] : "",
                                    attPositionType: $(el).parents('.al-certItem').hasClass('al-firstCertItem') ? 1 : 2,
                                    attFormat: $(el).attr('preVal') ? ($(el).attr('preVal').lastIndexOf("img05.allinmd.cn/") > -1 ? $(el).attr('preVal').split('img05.allinmd.cn/')[1].substring($(el).attr('preVal').split('img05.allinmd.cn/')[1].lastIndexOf('.') + 1) : $(el).attr('preVal')) : "",
                                    updateAttFormat: updateAttPath == '' ? "" : $(el).attr('src').split('.')[$(el).attr('src').split('.').length - 1]
                                });
                                //处理学生和医师身份切换时原有图片未保存问题 ,显示工作证时有学生证信息
                                if ($('.ev-imgAtt11').attr('stuPic') && $('.ev-imgAtt11').attr('stuId')) {
                                    attArr.push({
                                        attType: 12,
                                        updateAttType: 12,
                                        updateAttCode: "",
                                        attCode: "",
                                        updateAttPath: $('.ev-imgAtt11').attr('stuPic').split('img05.allinmd.cn/')[1],
                                        attPath: $('.ev-imgAtt11').attr('stuPic').split('img05.allinmd.cn/')[1],
                                        attPositionType: 1,
                                        updateAttFormat: $('.ev-imgAtt11').attr('stuPic').substring($('.ev-imgAtt11').attr('stuPic').lastIndexOf('.') + 1),
                                        attFormat: $('.ev-imgAtt11').attr('stuPic').substring($('.ev-imgAtt11').attr('stuPic').lastIndexOf('.') + 1)
                                    });
                                } else if ($('.ev-imgAtt12').attr('workPic') && $('.ev-imgAtt12').attr('workId')) {  //显示学生证时有工作证信息
                                    attArr.push({
                                        attType: 11,
                                        updateAttType: 11,
                                        updateAttCode: "",
                                        attCode: "",
                                        updateAttPath: $('.ev-imgAtt12').attr('workPic').split('img05.allinmd.cn/')[1],
                                        attPath: $('.ev-imgAtt12').attr('workPic').split('img05.allinmd.cn/')[1],
                                        attPositionType: 1,
                                        updateAttFormat: $('.ev-imgAtt12').attr('workPic').substring($('.ev-imgAtt12').attr('workPic').lastIndexOf('.') + 1),
                                        attFormat: $('.ev-imgAtt12').attr('workPic').substring($('.ev-imgAtt12').attr('workPic').lastIndexOf('.') + 1)
                                    });
                                }
                            } else {
                                if ($(el).hasClass('newUploadSuccess')) {
                                    attArr.push({
                                        attType: $(el).parent().attr('attType'),//.split('al-certItemUploadBox ev-imgAtt')[1],
                                        attCode: $(el).parents('.al-certificateToggleArea').find('.al-certCode').length ? $(el).parents('.al-certificateToggleArea').find('.al-certCode input').val() : "",
                                        attPath: $(el).attr('src').split('img05.allinmd.cn/')[1],
                                        attPositionType: $(el).parents('.al-certItem').hasClass('al-firstCertItem') ? 1 : 2,
                                        isUpdate: ($(el).attr('id')) ? 1 : 0, //如果有id,并且前后的值不=，则为更新图片，否则为新建&&$(el).attr('src') != $(el).attr('preVal')
                                        id: $(el).attr('id') ? $(el).attr('id') : '_'
                                    });
                                }

                            }

                        });
                        var delArr = [];
                        $.each($('.al-certItemUploadBox'), function (idn, ele) {
                            if (!$(ele).find('img:eq(0)').hasClass('newUploadSuccess') && $(ele).find('img:eq(0)').attr('id')) {//没有上传成功的图片，但有id,说明之前保存的图片被删除
                                delArr.push($(ele).find('img:eq(0)').attr('id'));
                            }
                        });
                        var param = {
                            customerId: TempCache.getItem('userId'),
                            delAttIdList: delArr.join(','),
                            authAttList: JSON.stringify(attArr),
                            opflag: 2,
                            isCompleted: 0//是否补全四证1-是0-否
                        };
                        var param2 = {
                            reviseId: t.resPK,//	string	是	用户id
                            customerId: TempCache.getItem('userId'),//	string	是	名称
                            attList: JSON.stringify(attArr)
                        };
                        var _callback = function (data) {
                            comm.loading.hide();
                            var rst = data && data.responseObject;
                            if (!rst) {//提交失败提示，重新提交
                                t.showAuthPop({
                                    type: 'fail',
                                    reSubmit: function () {
                                        t.isSubmiting = true;
                                        if (comm.getpara().reAuth) {
                                            comm.ajax.async(t.path.updateAttachement, {paramJson: $.toJSON(param2)}, _callback);
                                        } else {
                                            comm.ajax.async(t.path.createAuthNew, {paramJson: $.toJSON(param)}, _callback);
                                        }
                                    }
                                });
                                return false;
                            }
                            if (data && data.responseObject && data.responseObject.responseStatus) {
                                user.getSessionInfo();
                                var isFollow = location.search.indexOf('isFollow') > -1;    //有
                                var name = $('#fullName').val();
                                var flag = comm.getpara().flag;
                                TempCache.setItem("department", $('input[name=platformId]').val());
                                if (isFollow) {
                                    //todo 原逻辑认证权限页面，新注册-认证连续进行，认证之后再进行标签选择，认证2.0改版时产品确认此处去除标签选择2017-12-06
                                    if (TempCache.getItem('needAuthRegist') == "need") {//需要认证并认证成功
                                        TempCache.setItem('needAuthCompleted', 'needAuthCompleted');
                                    }
                                    if ($('.ev-imgAtt8 .newUploadSuccess').length == 2 &&
                                        $('.ev-imgAtt6 .newUploadSuccess').length == 2 &&
                                        $('.ev-imgAtt13 .newUploadSuccess').length == 1 &&
                                        $('.ev-imgAtt1 .newUploadSuccess').length == 2) {
                                        t.showAuthPop({
                                            type: "newSuccess",
                                            knowFn: function () {
                                                // comm.redirect("/pages/passport/auth/regist_tag.html?name="+name+"&flag="+flag+"&platformId="+$('input[name=platformId]').val(),0);
                                                user.success("认证成功，即将返回来源页");
                                            }
                                        });
                                    } else {
                                        t.showAuthPop({
                                            type: "success",
                                            knowFn: function () {
                                                // comm.redirect("/pages/passport/auth/regist_tag.html?name="+name+"&flag="+flag+"&platformId="+$('input[name=platformId]').val(),0);
                                                user.success("认证成功，即将返回来源页");
                                            }
                                        });
                                    }
                                } else {
                                    if (rst && rst.responseCode == "0B0101" || rst.responseCode == "0B0102") {
                                        if (comm.getpara().reAuth) {
                                            if ($('.ev-imgAtt8 .newUploadSuccess').length == 2 &&
                                                $('.ev-imgAtt6 .newUploadSuccess').length == 2 &&
                                                $('.ev-imgAtt13 .newUploadSuccess').length == 1 &&
                                                $('.ev-imgAtt1 .newUploadSuccess').length == 2) {
                                                t.showAuthPop({
                                                    type: "V2Success",
                                                    knowFn: function () {
                                                        // comm.redirect("/pages/passport/auth/regist_tag.html?name="+name+"&flag="+flag+"&platformId="+$('input[name=platformId]').val(),0);
                                                        user.success("认证成功，即将返回来源页");
                                                    }
                                                });
                                            } else {
                                                t.showAuthPop({
                                                    type: "reAuth",
                                                    knowFn: function () {
                                                        user.success("认证成功，即将返回来源页");
                                                    }
                                                })
                                            }

                                        } else {
                                            if ($('.ev-imgAtt8 .newUploadSuccess').length == 2 &&
                                                $('.ev-imgAtt6 .newUploadSuccess').length == 2 &&
                                                $('.ev-imgAtt13 .newUploadSuccess').length == 1 &&
                                                $('.ev-imgAtt1 .newUploadSuccess').length == 2) {
                                                t.showAuthPop({
                                                    type: "V2Success",
                                                    knowFn: function () {
                                                        // comm.redirect("/pages/passport/auth/regist_tag.html?name="+name+"&flag="+flag+"&platformId="+$('input[name=platformId]').val(),0);
                                                        user.success("认证成功，即将返回来源页");
                                                    }
                                                });
                                            } else {
                                                t.showAuthPop({
                                                    type: "reAuth",
                                                    knowFn: function () {
                                                        user.success("认证成功，即将返回来源页");
                                                    }
                                                })
                                            }
                                        }
                                    } else {
                                        if (TempCache.getItem('needAuthRegist') == "need") {//需要认证并认证成功
                                            TempCache.setItem('needAuthCompleted', 'needAuthCompleted');
                                        }
                                        if (!comm.getpara().reAuth) {
                                            TempCache.setItem('firstTimeAuth', 'firstTimeAuth');
                                        }
                                        if ($(self).attr('firstTimeToAuth') == 'true') {//初次认证
                                            if ($('.ev-imgAtt8 .newUploadSuccess').length == 2 &&
                                                $('.ev-imgAtt6 .newUploadSuccess').length == 2 &&
                                                $('.ev-imgAtt13 .newUploadSuccess').length == 1 &&
                                                $('.ev-imgAtt1 .newUploadSuccess').length == 2) {
                                                t.showAuthPop({
                                                    type: "newSuccess",
                                                    knowFn: function () {
                                                        // comm.redirect("/pages/passport/auth/regist_tag.html?name="+name+"&flag="+flag+"&platformId="+$('input[name=platformId]').val(),0);
                                                        user.success("认证成功，即将返回来源页");
                                                    }
                                                });
                                            } else {
                                                t.showAuthPop({
                                                    type: "success",
                                                    knowFn: function () {
                                                        // comm.redirect("/pages/passport/auth/regist_tag.html?name="+name+"&flag="+flag+"&platformId="+$('input[name=platformId]').val(),0);
                                                        user.success("认证成功，即将返回来源页");
                                                    }
                                                });
                                            }
                                        } else if (comm.getpara().reAuth) {//申请认证变更
                                            if (//四证填全 V2申请提交成功
                                                $('.ev-imgAtt8 .newUploadSuccess').length == 2 &&
                                                $('.ev-imgAtt6 .newUploadSuccess').length == 2 &&
                                                $('.ev-imgAtt13 .newUploadSuccess').length == 1 &&
                                                $('.ev-imgAtt1 .newUploadSuccess').length == 2
                                            ) {
                                                t.showAuthPop({
                                                    type: "V2Success",
                                                    knowFn: function () {
                                                        user.success("认证成功，即将返回来源页");
                                                    }
                                                });
                                            } else {
                                                t.showAuthPop({
                                                    type: "reAuth",
                                                    knowFn: function () {
                                                        user.success("认证成功，即将返回来源页");
                                                    }
                                                });
                                            }
                                        } else {
                                            if (//四证填全 V2申请提交成功
                                                $('.ev-imgAtt8 .newUploadSuccess').length == 2 &&
                                                $('.ev-imgAtt6 .newUploadSuccess').length == 2 &&
                                                $('.ev-imgAtt13 .newUploadSuccess').length == 1 &&
                                                $('.ev-imgAtt1 .newUploadSuccess').length == 2
                                            ) {
                                                t.showAuthPop({
                                                    type: "V2Success",
                                                    knowFn: function () {
                                                        user.success("认证成功，即将返回来源页");
                                                    }
                                                });
                                            } else {
                                                t.showAuthPop({
                                                    type: "reAuth",
                                                    knowFn: function () {
                                                        user.success("认证成功，即将返回来源页");
                                                    }
                                                });
                                            }
                                        }

                                    }
                                }
                            } else {
                                if (rst && rst.responseCode == "0B0101" || rst.responseCode == "0B0102") {
                                    if ($('.ev-imgAtt8 .newUploadSuccess').length == 2 &&
                                        $('.ev-imgAtt6 .newUploadSuccess').length == 2 &&
                                        $('.ev-imgAtt13 .newUploadSuccess').length == 1 &&
                                        $('.ev-imgAtt1 .newUploadSuccess').length == 2) {
                                        t.showAuthPop({
                                            type: "newSuccess",
                                            knowFn: function () {
                                                // comm.redirect("/pages/passport/auth/regist_tag.html?name="+name+"&flag="+flag+"&platformId="+$('input[name=platformId]').val(),0);
                                                user.success("认证成功，即将返回来源页");
                                            }
                                        });
                                    } else {
                                        t.showAuthPop({
                                            type: "reAuth",
                                            knowFn: function () {
                                                user.success("认证成功，即将返回来源页");
                                            }
                                        })
                                    }
                                } else {
                                    // popup(rst.responseMessage);
                                    // user.success();
                                    if ($('.ev-imgAtt8 .newUploadSuccess').length == 2 &&
                                        $('.ev-imgAtt6 .newUploadSuccess').length == 2 &&
                                        $('.ev-imgAtt13 .newUploadSuccess').length == 1 &&
                                        $('.ev-imgAtt1 .newUploadSuccess').length == 2) {
                                        t.showAuthPop({
                                            type: "newSuccess",
                                            knowFn: function () {
                                                // comm.redirect("/pages/passport/auth/regist_tag.html?name="+name+"&flag="+flag+"&platformId="+$('input[name=platformId]').val(),0);
                                                user.success("认证成功，即将返回来源页");
                                            }
                                        });
                                    } else {
                                        t.showAuthPop({
                                            type: "reAuth",
                                            knowFn: function () {
                                                user.success("认证成功，即将返回来源页");
                                            }
                                        })
                                    }
                                }
                            }
                            setTimeout(function () {
                                t.isSubmiting = false;
                            }, 3000);
                        };
                        //if(attchementChange){   //如果证件数据变了，则提交，否则返回上一页
                        t.isSubmiting = true;
                        if (comm.getpara().reAuth) {
                            // comm.loading.show();
                            // $('.al-middleTipsBox').css({
                            //     left:0,right:0,background:"rgba(0,0,0,0.3)"
                            // });
                            comm.ajax.async(t.path.updateAttachement, {paramJson: $.toJSON(param2)}, _callback);
                        } else {
                            // comm.loading.show();
                            // $('.al-middleTipsBox').css({
                            // 	left:0,right:0,background:"rgba(0,0,0,0.3)"
                            // });
                            comm.ajax.async(t.path.createAuthNew, {paramJson: $.toJSON(param)}, _callback);
                        }

                        //}else{
                        //    history.back(-2);
                        //}

                    } else {
                        if ($('html').attr('emptyAttCode')) {
                            $(window).scrollTop($('.' + $('html').attr('emptyAttCode')).parents('.al-certificateToggleArea').offset().top);
                            if ($('html').attr('emptyAttCode') == 'ev-imgAtt1') {
                                popup('请完整上传身份证后再提交');
                            } else if ($('html').attr('emptyAttCode') == 'ev-imgAtt8') {
                                popup('请完整上传医师执业证后再提交');
                            } else if ($('html').attr('emptyAttCode') == 'ev-imgAtt6') {
                                popup('请完整上传医师资格证后再提交');
                            } else if ($('html').attr('emptyAttCode') == 'ev-imgAtt13') {
                                popup('请完整上传医师职称证后再提交');
                            }
                            $('.' + $('html').attr('emptyAttCode')).parents('.al-certificateToggleArea').find('.al-certCode').focus();
                        } else {
                            return false;
                        }
                    }
                });

            }
        };

        function checkHasChangedItem() {
            var _flag = false;
            if (
                $('#fullName').val() != $('#fullName').attr('preVal') ||   //姓名
                $('input[name=sex]').val() != $('input[name=sex]').attr('preVal') || //性别
                $('#year01').val() != ($('#year01').attr('preVal') ? $('#year01').attr('preVal') : "1980") ||               //年月日
                $('#month01').val() != ($('#month01').attr('preVal') ? $('#month01').attr('preVal') : "01") ||
                $('#day01').val() != ($('#day01').attr('preVal') ? $('#day01').attr('preVal') : "01") ||
                $('#company').attr('nowVal') != $('#company').attr('preVal') ||        //单位
                $('#medicalTitle').attr('nowVal') != $('#medicalTitle').attr('preVal') ||  //职称
                $('input[name=platformId]').val() != $('input[name=platformId]').attr('preVal') ||     //专业
                $('#areasExpertise').attr('nowVal') != $('#areasExpertise').attr('preVal')//专科
            ) {
                _flag = true;
            }
            return _flag;
        }

        function checkFinish() {//检测基本信息，是否下一步
            var fullName = $('#fullName').val();    //姓名
            var _isValidName = /^[\u4e00-\u9fa5\s·]{1,25}$/.test(fullName) || /^[A-Za-z·\s]{1,50}$/.test(fullName);
            var birthYear = $('#year01').val();     //出生年，月，
            var birthMonth = $('#month01').val();
            var birthDay = $('#day01').val();
            var companyVal = $('#company').attr('nowVal');
            var medTitleVal = $('#medicalTitle').text() && $('#medicalTitle').text() != "请选择职称";
            //var medFirstClass = $('#medicalTitle').attr('medFirstClass')==1;//一级职称
            var areasVal = $('#areasExpertise').text() && $('#areasExpertise').text() != "请选择专科";
            if (fullName && _isValidName && birthYear && birthMonth && birthDay && companyVal && medTitleVal && areasVal) {
                $('.ev_authNextStep').addClass('active');
            } else {
                $('.ev_authNextStep').removeClass('active');
            }
        }

        function checkCertReady() {//检测证件是否可以保存
            var isID1 = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$/,//身份证校验
                isID2 = /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/i;
            //var isID1 =/\d/;
            //var isID2 =/\d/;
            var flag = false;//可提交条件 满足任一
            var flaArr = [],  //用于判断按钮是否可以激活
                flaArr2 = [],//判断数据是否完整，可以提交
                flaArr3 = []; //判断非身份证字段是否已填写，如果此字段无1，身份证字段填写完全也不能提交
            $('.ev_certSave').removeClass('active').attr('flag', false);
            $('html').removeAttr('emptyAttCode');
            $.each($('.ev_notIdCert .al-certificateItems'), function (ind, elem) {
                if (
                    $(elem).find('input').length != 0 &&  //要上传图片 并且上传图片的数量与已上传的数量相同
                    $(elem).find('input').length == $(elem).find('.newUploadSuccess').length
                ) {
                    //身份证、医师执业证、医师资格证、医师职称证; 证件的证件号码为必填项，上传证件必须证件号加证件照片都填写
                    if ($(elem).find('.ev-imgAtt13').length > 0 || $(elem).find('.ev-imgAtt6').length > 0 || $(elem).find('.ev-imgAtt8').length > 0) {
                        if (/^[a-zA-Z0-9]{1,50}$/.test($.trim($(elem).siblings('.al-certCode').find('input').val()))) {//证件号码为必填 非空
                            if ($(elem).find('.newDelete').length == 0) {
                                $('.ev_certSave').addClass('active').attr('flag', true);
                                flaArr.push(1);
                                flaArr2.push(1);
                                flaArr3.push(1);
                            } else {//有删除后为空的
                                flaArr.push(1);
                                flaArr2.push(0);
                                flaArr3.push(1);
                                $('.ev_certSave').attr('flag', false);
                                $('html').attr('emptyAttCode', $(elem).find('.al-firstCertItem>section').eq(1).attr('class').split(' ')[1]);
                            }
                        } else {
                            flaArr.push(1);
                            flaArr2.push(0);
                            flaArr3.push(1);
                            $('.ev_certSave').attr('flag', false);
                            $('html').attr('emptyAttCode', $(elem).find('.al-firstCertItem>section').eq(1).attr('class').split(' ')[1]);
                            //return false;
                        }
                    } else {
                        if($('#medicalTitle').text() != '医学生'){//20180703修改需求，非医学生的学历证和学位证上传不能激活认证提交，工作证可以激活提交
                            if($(elem).find(".ev-imgAtt9").length<=0&&$(elem).find(".ev-imgAtt7").length<=0){
                                $('.ev_certSave').addClass('active').attr('flag', true);
                                flaArr.push(1);
                                flaArr2.push(1);
                                flaArr3.push(1);
                            }
                        }else{//医学生的学位证和学历证可以正常提交 验证激活
                            $('.ev_certSave').addClass('active').attr('flag', true);
                            flaArr.push(1);
                            flaArr2.push(1);
                            flaArr3.push(1);
                        }
                    }

                } else if ($(elem).find('input').length != $(elem).find('.newUploadSuccess').length && $(elem).find('.newUploadSuccess').length != 0) {//两张传一张
                    $('html').attr('emptyAttCode', $(elem).find('.al-firstCertItem>section').eq(1).attr('class').split(' ')[1]);
                    flaArr.push(1);
                    flaArr3.push(1);
                    flaArr2.push(0);
                    //$('.ev_certSave').attr('flag',false);
                    //return false;
                } else if ($(elem).find('.newUploadSuccess').length == 0 && ($(elem).siblings('.al-certCode').length ? /^[a-zA-Z0-9]{1,50}$/.test($(elem).siblings('.al-certCode').find('input').val()) : false)) {//没传图片，填了证件号
                    $('html').attr('emptyAttCode', $(elem).find('.al-firstCertItem>section').eq(1).attr('class').split(' ')[1]);
                    flaArr.push(1);
                    flaArr3.push(1);
                    flaArr2.push(0);
                    //$('.ev_certSave').attr('flag',false);
                    //return false;
                }
            });
            $.each($('.ev_idCert .al-certificateItems'), function (inde, eleme) {//身份证上传2张并且 资质证明至少有一张
                var _attCode = $(eleme).siblings('.al-certCode').find('input').val();
                if ($(eleme).find('.newUploadSuccess').length && $(eleme).find('.newUploadSuccess').length != 2) {      // 只上传了一张
                    $('.ev_certSave').attr('flag', false);
                    if (flaArr3.indexOf(1) > -1) {//判断非身份证字段已填写，身份证字段填写可激活按钮
                        flaArr.push(1);
                    }
                    flaArr2.push(0);
                    $('html').attr('emptyAttCode', $(eleme).find('.al-firstCertItem section').eq(1).attr('class').split(' ')[1]);
                } else if ($(eleme).find('.newUploadSuccess').length - $(eleme).find('.newDelete').length == 2 && !(isID1.test(_attCode) || isID2.test(_attCode))) {// 上传了2张 且没有删除为空的，但身份证号不符
                    if (flaArr3.indexOf(1) > -1) {//判断非身份证字段已填写，身份证字段填写可激活按钮
                        flaArr.push(1);
                    }
                    flaArr2.push(0);
                    //$('.ev_certSave').attr('flag',false);
                    $('html').attr('emptyAttCode', $(eleme).find('.al-firstCertItem section').eq(1).attr('class').split(' ')[1]);
                } else if ((isID1.test(_attCode) || isID2.test(_attCode)) && $(eleme).find('.newUploadSuccess').length != 2) {// 身份证号相符但 上传数目不符
                    //$('.ev_certSave').attr('flag',false);
                    if (flaArr3.indexOf(1) > -1) {//判断非身份证字段已填写，身份证字段填写可激活按钮
                        flaArr.push(1);
                    }
                    flaArr2.push(0);
                    $('html').attr('emptyAttCode', $(eleme).find('.al-firstCertItem section').eq(1).attr('class').split(' ')[1]);
                    return false;
                } else if (_attCode && $(eleme).find('.newUploadSuccess').length != 2) {//有身份证号，没图片
                    if (flaArr3.indexOf(1) > -1) {//判断非身份证字段已填写，身份证字段填写可激活按钮
                        flaArr.push(1);
                    }
                    flaArr2.push(0);
                    $('html').attr('emptyAttCode', $(eleme).find('.al-firstCertItem section').eq(1).attr('class').split(' ')[1]);
                }

            });
            if (flaArr.indexOf(1) > -1) {
                $('.ev_certSave').addClass('active');
            }
            if (flaArr2.indexOf(0) > -1) {
                $('.ev_certSave').attr('flag', false);
            }
        }

        index.init();
    })
})




