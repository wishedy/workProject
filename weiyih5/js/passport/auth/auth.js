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
        var identityFlag;//用户选择的身份
        var cusRole = TempCache.getItem("customerRole");//用户当前的角色
        var mIdVal;//职称id
        //单位
        var company = {
            init: function () {
                var t = this;
                t.changeCompany();
            },
            changeCompany: function () {
                var t = this;
                $('.ev_changeCompany').off("click").on('click', function () {
                    var _kv = $("#medicalTitle").attr("nowval");
                    if ($.trim($("#medicalTitle").text()) && $("#medicalTitle").text() != "请选择") {//职称存在
                        if (_kv.substr(0, _kv.indexOf("_")) == 10) {//医学生
                            $(".ev-mainInner").hide();
                            $(".ev-schoolInner").show();
                            $(".ev-schoolProvince").show();
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
                                    setTimeout(function () {
                                        if (g_sps) {
                                            g_sps.createBrowse({pageId: 443,param:{ userRoleType: (identityFlag ? identityFlag : (cusRole && cusRole == 5 ? ((mIdVal == 11 || mIdVal == 12 || mIdVal == 13 || mIdVal == 14 || mIdVal == 15) ? 2 : 1) : cusRole == 12 ? 2 : 1))}})
                                        }
                                    }, 2000);
                                },
                                getCityFn: function () {
                                    setTimeout(function () {
                                        if (g_sps) {
                                            g_sps.createBrowse({pageId: 444, param:{userRoleType: (identityFlag ? identityFlag : (cusRole && cusRole == 5 ? ((mIdVal == 11 || mIdVal == 12 || mIdVal == 13 || mIdVal == 14 || mIdVal == 15) ? 2 : 1) : cusRole == 12 ? 2 : 1))}})
                                        }
                                    }, 2000);
                                },
                                getCompanyFn: function () {
                                    setTimeout(function () {
                                        if (g_sps) {
                                            g_sps.createBrowse({pageId: 445, param:{userRoleType: (identityFlag ? identityFlag : (cusRole && cusRole == 5 ? ((mIdVal == 11 || mIdVal == 12 || mIdVal == 13 || mIdVal == 14 || mIdVal == 15) ? 2 : 1) : cusRole == 12 ? 2 : 1))}})
                                        }
                                    }, 2000);
                                },
                                addCompanyFn: function () {
                                    setTimeout(function () {
                                        if (g_sps) {
                                            g_sps.createBrowse({pageId: 446,param:{ userRoleType: (identityFlag ? identityFlag : (cusRole && cusRole == 5 ? ((mIdVal == 11 || mIdVal == 12 || mIdVal == 13 || mIdVal == 14 || mIdVal == 15) ? 2 : 1) : cusRole == 12 ? 2 : 1))}})
                                        }
                                    }, 2000);
                                }
                            });
                        } else {//医生或者护士
                            $(".ev-mainInner").hide();
                            $(".ev-companyInner").show();
                            $(".ev-sProvince").show();
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
                                    setTimeout(function () {
                                        if (g_sps) {
                                            g_sps.createBrowse({pageId: 439,param:{ userRoleType: (identityFlag ? identityFlag : (cusRole && cusRole == 5 ? ((mIdVal == 11 || mIdVal == 12 || mIdVal == 13 || mIdVal == 14 || mIdVal == 15) ? 2 : 1) : cusRole == 12 ? 2 : 1))}});
                                        }
                                    }, 2000);
                                },
                                getCityFn: function () {
                                    setTimeout(function () {
                                        if (g_sps) {
                                            g_sps.createBrowse({pageId: 440,param:{ userRoleType: (identityFlag ? identityFlag : (cusRole && cusRole == 5 ? ((mIdVal == 11 || mIdVal == 12 || mIdVal == 13 || mIdVal == 14 || mIdVal == 15) ? 2 : 1) : cusRole == 12 ? 2 : 1))}})
                                        }
                                    }, 2000);
                                },
                                getCompanyFn: function () {
                                    setTimeout(function () {
                                        if (g_sps) {
                                            g_sps.createBrowse({pageId: 441,param:{ userRoleType: (identityFlag ? identityFlag : (cusRole && cusRole == 5 ? ((mIdVal == 11 || mIdVal == 12 || mIdVal == 13 || mIdVal == 14 || mIdVal == 15) ? 2 : 1) : cusRole == 12 ? 2 : 1))}})
                                        }
                                    }, 2000);
                                },
                                addCompanyFn: function () {
                                    setTimeout(function () {
                                        if (g_sps) {
                                            g_sps.createBrowse({pageId: 442,param:{ userRoleType: (identityFlag ? identityFlag : (cusRole && cusRole == 5 ? ((mIdVal == 11 || mIdVal == 12 || mIdVal == 13 || mIdVal == 14 || mIdVal == 15) ? 2 : 1) : cusRole == 12 ? 2 : 1))}})
                                        }
                                    }, 2000);
                                }
                            });

                        }
                    } else {//职称不存在
                        popup("请先选择职称");
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
                    identityFlag: identityFlag ? identityFlag : (cusRole == 12 ? 2 : 1),
                    fn: function () {
                        if ($('#medicalTitle').attr("nowval")) {
                            //职称切换，单位数据相关保存
                            var _pT = $('#company').attr("preType");
                            var _pN = $('#company').attr("preName");
                            var _pI = $('#company').attr("preCId");
                            if ($('#medicalTitle').attr("nowval").indexOf('10_') == -1) {//职称当前的选择是医生或者护士
                                //如果之前选择的职称是学生，单位是学校,那么当职称改选为医生，相应变动单位信息，如果之前有选择医院显示医院，没有医院默认清空
                                if ($('#company').attr("workplacetype") == 2) {
                                    //如果更改之前，单位信息有数据，存储上的单位信息要随着切换变动
                                    if (_pT) {
                                        if (_pT != 10) {//如果之前存在并且不是学生的类型
                                            //先对隐藏上次选择的记录赋值，记录当前的单位值，方便下次切换更改
                                            $('#company').attr({
                                                preType: 10,//记录之前选择的类型，职称切换单位备用（选择医生的情况，更改为医学生）
                                                preName: $('#company').attr("nowval") ? $('#company').attr("nowval") : '',
                                                preCId: $('#company').attr("companyid") ? $('#company').attr("companyid") : ''
                                            });
                                            if (_pN && _pI) {//上次选择的id和名称都存在，防止脏数据，只有名字没有id
                                                //再对当前展示赋值
                                                $('#company').text(_pN).attr({
                                                    workplaceType: 1,
                                                    nowVal: _pN,
                                                    companyId: _pI,
                                                }).removeClass('placeHolderColor').css("color", "#222");
                                            } else {
                                                $('#company').text("请选择").attr({
                                                    workplaceType: '',
                                                    nowVal: "",
                                                    companyId: "",
                                                }).addClass('placeHolderColor').css("color", "#aaa");
                                            }
                                        } else {
                                            $('#company').text("请选择").attr({
                                                workplaceType: '',
                                                nowVal: "",
                                                companyId: "",
                                            }).addClass('placeHolderColor').css("color", "#aaa");
                                        }
                                    } else {//更改之前没有单位信息
                                        $('#company').text("请选择").attr({
                                            workplaceType: "",
                                            nowVal: "",
                                            companyId: "",
                                            preType: 10,//记录之前选择的类型，职称切换单位备用（非医学生）
                                            preName: $('#company').attr("nowval") ? $('#company').attr("nowval") : '',
                                            preCId: $('#company').attr("companyid") ? $('#company').attr("companyid") : ''
                                        }).addClass('placeHolderColor').css("color", "#aaa");
                                    }
                                } else {//如果依旧选择医生   进行重新赋值
                                    if (_pT && _pN && _pI && _pT != 10) {//上次选择的id和名称都存在，防止脏数据，只有名字没有id
                                        //再对当前展示赋值
                                        $('#company').text(_pN).attr({
                                            workplaceType: 1,
                                            nowVal: _pN,
                                            companyId: _pI,
                                        }).removeClass('placeHolderColor').css("color", "#222");
                                    }
                                }
                            } else if ($('#medicalTitle').attr("nowval").indexOf('10_') > -1) {//职称当前选择的是医学生
                                //如果之前选择的职称是医生，单位是医院，那么职称改选为医学生时，应该相应变动单位信息，如果之前有选择的学校显示学校，如果没有清空单位信息
                                if ($('#company').attr("workplacetype") == 1) {
                                    //如果更改之前，单位信息有数据，存储上的单位信息要随着切换变动
                                    if (_pT) {
                                        if (_pT == 10) {//如果之前存在并且是学生的类型，那么单位调整
                                            //先对隐藏上次选择的记录赋值，记录当前的单位值，方便下次切换更改
                                            $('#company').attr({
                                                preType: 4,//记录之前选择的类型，职称切换单位备用（选择医学生的情况，更改为非医学生）
                                                preName: $('#company').attr("nowval") ? $('#company').attr("nowval") : '',
                                                preCId: $('#company').attr("companyid") ? $('#company').attr("companyid") : ''
                                            });
                                            if (_pN && _pI) {//上次选择的id和名称都存在，防止脏数据，只有名字没有id
                                                //再对当前展示赋值
                                                $('#company').text(_pN).attr({
                                                    workplaceType: 2,
                                                    nowVal: _pN,
                                                    companyId: _pI,
                                                }).removeClass('placeHolderColor').css("color", "#222");
                                            } else {
                                                $('#company').text("请选择").attr({
                                                    workplaceType: '',
                                                    nowVal: "",
                                                    companyId: "",
                                                }).addClass('placeHolderColor').css("color", "#aaa");
                                            }
                                        } else {
                                            $('#company').text("请选择").attr({
                                                workplaceType: '',
                                                nowVal: "",
                                                companyId: "",
                                            }).addClass('placeHolderColor').css("color", "#aaa");
                                        }
                                    } else {//更改之前没有单位信息
                                        $('#company').text("请选择").attr({
                                            workplaceType: "",
                                            nowVal: "",
                                            companyId: "",
                                            preType: 4,//记录之前选择的类型，职称切换单位备用
                                            preName: $('#company').attr("nowval") ? $('#company').attr("nowval") : '',
                                            preCId: $('#company').attr("companyid") ? $('#company').attr("companyid") : ''
                                        }).addClass('placeHolderColor').css("color", "#aaa");
                                    }
                                } else {//如果依旧选择医学生   进行重新赋值
                                    if (_pT && _pN && _pI && _pT == 10) {//上次选择的id和名称都存在，防止脏数据，只有名字没有id
                                        //再对当前展示赋值
                                        $('#company').text(_pN).attr({
                                            workplaceType: 2,
                                            nowVal: _pN,
                                            companyId: _pI,
                                        }).removeClass('placeHolderColor').css("color", "#222");
                                    }
                                }
                            }
                        } else {//如果当前选值为空
                            $('#company').text("请选择").attr({
                                workplaceType: "",
                                nowVal: "",
                                companyId: "",
                                preType: ($('#company').attr("workplaceType") ? $('#company').attr("workplaceType") == 1 ? 4 : 10 : ""),//记录之前选择的类型，职称切换单位备用workplacetype
                                preName: $('#company').attr("nowval") ? $('#company').attr("nowval") : '',
                                preCId: $('#company').attr("companyid") ? $('#company').attr("companyid") : ''
                            }).addClass('placeHolderColor').css("color", "#aaa");
                        }
                        checkFinish();
                    }
                });
                $('.ev_changeMedicalTitle').click(function () {
                    setTimeout(function () {
                        if (g_sps) {
                            g_sps.createBrowse({pageId: 447,param:{ userRoleType: (identityFlag ? identityFlag : (cusRole && cusRole == 5 ? ((mIdVal == 11 || mIdVal == 12 || mIdVal == 13 || mIdVal == 14 || mIdVal == 15) ? 2 : 1) : cusRole == 12 ? 2 : 1))}})
                        }
                    }, 2000);
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
        function radioSelect() {
            $('.al-radioInput').off("click").on("click", function () {
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
                    data: {
                        paramJson: $.toJSON({
                            customerId: TempCache.getItem('userId'),
                            "logoUseFlag": UseFlag.d,
                            isCustomer: 1
                        })
                    },
                    dataType: "json",
                    async: false,
                    success: function (rep) {
                        comm.loading.hide();
                        radioSelect();
                        if (rep && rep.responseObject.responseData && rep.responseObject.responseData.data_list) {
                            if (rep.responseObject.responseData.data_list.length > 0) {
                                responseData = rep.responseObject.responseData.data_list[0];
                                var auth = responseData.customer_auth;
                                var baseInfo = responseData.customer_baseinfo;

                                //姓名
                                $('#fullName').val(auth.lastName + auth.firstName).blur().attr('preVal', auth.lastName + auth.firstName);
                                //性别
                                if (baseInfo.sex == '女') {
                                    $('.ev-sexRadio').eq(1).click();
                                    $('input[name=sex]').attr('preVal', '女');
                                } else {
                                    $('.ev-sexRadio').eq(0).click();
                                    $('input[name=sex]').attr('preVal', '男')
                                }
                                //职称
                                if (auth.medicalTitle != "") {
                                    var medTitle = "";
                                    var mArr = auth.medicalTitle.split(",");
                                    for (var i = 0; i < mArr.length; i++) {
                                        var kv = mArr[i].substr(0, mArr[i].indexOf("_"));
                                        //排除社会职称 5讲师 6副教授 7教授 8硕士生导师 9博士生导师
                                        if (!(kv == 5 || kv == 6 || kv == 7 || kv == 8 || kv == 9)) {
                                            medTitle = mArr[i];
                                        }
                                    }
                                    //单位依据职称显示（只有医生、护士、医学生才可以显示单位，但是也要校验单位是否和职称匹配）
                                    if (medTitle) {//职称存在
                                        $('#medicalTitle')
                                            .text(comm.getStrLen(comm.cutLine(medTitle, "_", ","), $(window).width() < 760 ? 26 : 30))
                                            .attr({
                                                nowVal: medTitle.substr(0, medTitle.indexOf("_")) ? medTitle : (auth.medicalTitleId + '_' + medTitle),
                                                preVal: medTitle.substr(0, medTitle.indexOf("_")) ? medTitle : (auth.medicalTitleId + '_' + medTitle)
                                            })
                                            .removeClass('placeHolderColor').css("color", "#222");
                                        //单位
                                        if (medTitle.substr(0, medTitle.indexOf("_"))
                                            ? (medTitle.substr(0, medTitle.indexOf("_")) == 10) : (auth.medicalTitleId == 10)) {//医学生的情况
                                            if (auth.schoolName) {
                                                $('#company').text(comm.getStrLen(auth.schoolName, 30))
                                                    .attr({
                                                        workplaceType: 2,
                                                        nowVal: auth.schoolName,
                                                        companyId: auth.schoolId,
                                                        preVal: auth.schoolName,
                                                        preType: auth.company ? 4 : '',//记录之前选择的类型，职称切换单位备用（非医学生）
                                                        preName: auth.company ? auth.company : '',
                                                        preCId: auth.companyId ? auth.companyId : ''
                                                    }).removeClass('placeHolderColor').css("color", "#222");
                                            }
                                        } else {//医生或者护士
                                            if (auth.company) {
                                                $('#company').text(comm.getStrLen(auth.company, 30))
                                                    .attr({
                                                        workplaceType: 1,
                                                        nowVal: auth.company,
                                                        companyId: auth.companyId,
                                                        preVal: auth.company,
                                                        preType: auth.schoolName ? 10 : '',//记录之前选择的类型，职称切换单位备用（非医学生）
                                                        preName: auth.schoolName ? auth.schoolName : '',
                                                        preCId: auth.schoolId ? auth.schoolId : ''
                                                    }).removeClass('placeHolderColor').css("color", "#222");
                                            }
                                        }
                                    }
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
                                // 判断首次认证
                                mIdVal = auth.medicalTitleId ? auth.medicalTitleId :
                                    (auth.medicalTitle.match(/\d+/g) ? auth.medicalTitle.match(/\d+/g) : '');//职称id
                                if (auth.state == -1) {
                                    /*"1_住院医师""2_主治医师""3_副主任医师""4_主任医师""10_医学生""11_护士""12_护师""13_主管护师""14_副主任护师""15_主任护师""16_医助"*/
                                    $('.ev_certSave').attr('firstTimeToAuth', true);
                                    if (identityFlag == 2) {//选择了护理
                                        //基本信息不是护理角色（医生、医学生或者医助）
                                        if (!(mIdVal == 11 || mIdVal == 12 || mIdVal == 13 || mIdVal == 14 || mIdVal == 15)) {
                                            $('#fullName').val("").blur().attr('preVal', "");//清空姓名
                                            $('.ev-sexRadio').eq(0).click();
                                            $('input[name=sex]').attr('preVal', '男');//默认选择男
                                            $('#company').text("请选择")
                                                .attr({
                                                    workplaceType: "",
                                                    nowVal: "",
                                                    companyId: "",
                                                    preVal: "",
                                                    preType: '',//记录之前选择的类型，职称切换单位备用（非医学生）
                                                    preName: '',
                                                    preCId: ''
                                                }).addClass('placeHolderColor').css("color", "#aaa");//医院清空
                                            $('#medicalTitle')
                                                .text("护士")
                                                .attr({
                                                    nowVal: 11 + '_' + '护士',
                                                    preVal: 11 + '_' + '护士',
                                                }).removeClass('placeHolderColor').css("color", "#222");//重置职称
                                        }
                                    }
                                    if (identityFlag == 1) {//选择了医生
                                        //基本信息不是医生角色（护理或者医助）
                                        if (!(mIdVal == 1 || mIdVal == 2 || mIdVal == 3 || mIdVal == 4 || mIdVal == 10)) {
                                            $('#fullName').val("").blur().attr('preVal', "");//清空姓名
                                            $('.ev-sexRadio').eq(0).click();
                                            $('input[name=sex]').attr('preVal', '男');//默认选择男
                                            $('#company').text("请选择")
                                                .attr({
                                                    workplaceType: "",
                                                    nowVal: "",
                                                    companyId: "",
                                                    preVal: "",
                                                    preType: '',//记录之前选择的类型，职称切换单位备用（非医学生）
                                                    preName: '',
                                                    preCId: ''
                                                }).addClass('placeHolderColor').css("color", "#aaa");//医院清空
                                            $('#medicalTitle')
                                                .text("请选择")
                                                .attr({
                                                    nowVal: '',
                                                    preVal: '',
                                                }).addClass('placeHolderColor').css("color", "#aaa");//重置职称
                                        }
                                    }
                                }
                                else {//cusRole  0游客 1系统 2组织 3厂商 4患者 5普通医师 6认证医师  12-护士 7-医学生 13-医助
                                    if (identityFlag == 1 && !(mIdVal == 1 || mIdVal == 2 || mIdVal == 3 || mIdVal == 4 || mIdVal == 10)) {//选择了医生，但是本身是护理角色
                                        $('#fullName').val("").blur().attr('preVal', "");//清空姓名
                                        $('.ev-sexRadio').eq(0).click();
                                        $('input[name=sex]').attr('preVal', '男');//默认选择男
                                        $('#company').text("请选择")
                                            .attr({
                                                workplaceType: "",
                                                nowVal: "",
                                                companyId: "",
                                                preVal: "",
                                                preType: '',//记录之前选择的类型，职称切换单位备用（非医学生）
                                                preName: '',
                                                preCId: ''
                                            }).addClass('placeHolderColor').css("color", "#aaa");//医院清空
                                        $('#medicalTitle')
                                            .text("请选择")
                                            .attr({
                                                nowVal: '',
                                                preVal: '',
                                            }).addClass('placeHolderColor').css("color", "#aaa");//重置职称
                                        return false;
                                    }
                                    if (identityFlag == 2 && !(mIdVal == 11 || mIdVal == 12 || mIdVal == 13 || mIdVal == 14 || mIdVal == 15)) {//选择了护理，但是本身是医生角色
                                        $('#fullName').val("").blur().attr('preVal', "");//清空姓名
                                        $('.ev-sexRadio').eq(0).click();
                                        $('input[name=sex]').attr('preVal', '男');//默认选择男
                                        $('#company').text("请选择")
                                            .attr({
                                                workplaceType: "",
                                                nowVal: "",
                                                companyId: "",
                                                preVal: "",
                                                preType: '',//记录之前选择的类型，职称切换单位备用（非医学生）
                                                preName: '',
                                                preCId: ''
                                            }).addClass('placeHolderColor').css("color", "#aaa");//医院清空
                                        $('#medicalTitle')
                                            .text("护士")
                                            .attr({
                                                nowVal: 11 + '_' + '护士',
                                                preVal: 11 + '_' + '护士',
                                            }).removeClass('placeHolderColor').css("color", "#222");//重置职称
                                        return false;
                                    }
                                }
                                checkFinish();
                            }
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
                getDataRoleConfigs: M_CALL + "mcall/comm/data/roleconfig/getSortList/",//获取会员证件类型
                getAuthAttachments: M_CALL + "customer/auth_attachment/getAuthAttachmentsV2/",//获取认证附件
                upload: M_CALL + "comm/upload_attachment/upload/",//上传图片
                creatAuth: M_CALL + "customer/auth_attachment/createAuthAttachment/",
                errorReport: M_CALL + "customer/auth_process/getMapList/",//原错误提示暂时没用了
                promptMessage: M_CALL + "customer/unite/promptMessage/",//获取上传证件提示信息接口
                checkCustomerV3: M_CALL + "customer/auth/checkCustomerV3/",//判断多帐号合并请求接口
                mergeCreate: M_CALL + "customer/merge/v3/create/",//确认提交发送合并请求
            },
            init: function () {
                if (comm.getpara().reAuth) {//申请变更
                    $(".ev_authStepZero,.ev-headerPrev").hide();//把选择身份隐藏
                    $(".ev_authStepOne,.ev-headerOne").show();//展示基本信息
                }
                var t = this;
                var cBack = function (res) {
                    if (res && res.responseObject && res && res.responseObject.responseStatus) {
                        var item = res.responseObject.responseMessage;
                        var state = item ? item.state : '';//记录id
                        if (!item || $.isEmptyObject(item) || state == -1 || state == 3 || state == 9 || ((state == 2 || state == 8) && comm.getpara().reAuth)) {//-1-无认证信息、0-二次提交认证、1-v1待审核、2-运营确认、3-认证拒绝 7-执业医师申请 8-执业医师确认 9-执业医师拒绝
                            if (comm.getpara().reAuth && (state == 2 || state == 8 || state == 9 || state == 7) || (cusRole == 6 && state == 9)) {//申请变更
                                //展示下一步
                                $(".ev_authStepZero,.ev-headerPrev").hide();//把选择身份隐藏
                                $(".ev_authStepOne,.ev-headerOne").show();//展示基本信息
                                t.backBtn(1);//返回按钮
                                t.oneStep();
                            } else {//正常流程
                                $(".ev_authStepZero,.ev-headerPrev").show();//选择身份展示
                                t.backBtn();//返回按钮
                                t.zeroStep(); //先进行身份选择，再进行其他步骤
                            }
                        } else {
                            setTimeout(function () {
                                if (g_sps) {
                                    g_sps.jump(null, "/");
                                }
                            }, 200);
                        }
                    }
                };
                comm.ajax.async(t.path.getCustomerAuth, {}, cBack);
            },
            //选择身份（医生、护士）
            zeroStep: function () {
                var t = this;
                setTimeout(function () {
                    if (g_sps) {
                        g_sps.createBrowse({pageId: 483})
                    }
                }, 2000);
                $(".ev-identityChoice").off("click").on("click", function () {
                    $(this).addClass("hoverClass");
                    //展示下一步
                    $(".ev_authStepZero,.ev-headerPrev").hide();//把选择身份隐藏
                    $(".ev_authStepOne,.ev-headerOne").show();//展示基本信息
                    if ($(this).hasClass("al-doctorBox")) {//医生
                        $(".al-nurseIcon").removeClass("hoverClass");
                        identityFlag = 1;//医生参数
                        comm.creatEvent({
                            triggerType: "角色选择页",
                            triggerName: '医生',
                            keyword: '医生',
                            browType: 395,
                            actionId: 11694
                        });
                    } else {//护理
                        $(".al-doctorBox").removeClass("hoverClass");
                        identityFlag = 2;//护士参数
                        comm.creatEvent({
                            triggerType: "角色选择页",
                            triggerName: '护士',
                            keyword: '护士',
                            browType: 395,
                            actionId: 11695
                        });
                    }
                    t.oneStep();
                    $(this).removeClass("hoverClass");//展示完移除class
                });
            },
            //进入基本信息获取
            oneStep: function () {
                var t = this;
                setTimeout(function () {
                    if (g_sps) {
                        g_sps.createBrowse({pageId: 449, param:{userRoleType: (identityFlag ? identityFlag : (cusRole && cusRole == 5 ? ((mIdVal == 11 || mIdVal == 12 || mIdVal == 13 || mIdVal == 14 || mIdVal == 15) ? 2 : 1) : cusRole == 12 ? 2 : 1))}})
                    }
                }, 2000);
                t.edit();
                t.nextStepBtn();
                getUserInfo.init();
                company.init();
                medTitle.init();
                t.submit();
                t.showAuthRightTip();
                t.errorReport();
            },
            //姓名编辑
            edit: function () {
                var t = this;
                $('#fullName').on('input propertychange blur', function () {
                    if (/^[\s]/.test($(this).val())) {
                        $(this).val($(this).val().replace(/^[\s]/, ''));
                    }
                    if (comm.getByteLen($.trim($(this).val())) > 50) {
                        $(this).val(t.getCutStr($.trim($(this).val()), 50));
                    }
                    checkFinish();
                });
                $('#fullName').on('propertychange', function () {
                    if (!$.trim($(this).val())) {
                        popup("请正确填写姓名");
                    }
                });
            },
            //帮助按钮
            showAuthRightTip: function () {
                $('.authRight').off("click").on("click", function () {
                    if($(this).parents(".ev_authStep").hasClass("ev_authStepOne")){//基本信息也帮助
                        comm.creatEvent({
                            triggerType: "认证-基本信息",
                            triggerName: '帮助',
                            keyword: '帮助',
                            userRoleType: (identityFlag ? identityFlag : (cusRole && cusRole == 5 ? ((mIdVal == 11 || mIdVal == 12 || mIdVal == 13 || mIdVal == 14 || mIdVal == 15) ? 2 : 1) : cusRole == 12 ? 2 : 1)),//1医生 2护士
                            actionId: 2514,
                            browType: 10001
                        });
                    }else{//上传证件页帮助
                        comm.creatEvent({
                            triggerType: "认证-证件信息",
                            triggerName: '帮助',
                            keyword: '帮助',
                            userRoleType: (identityFlag ? identityFlag : (cusRole && cusRole == 5 ? ((mIdVal == 11 || mIdVal == 12 || mIdVal == 13 || mIdVal == 14 || mIdVal == 15) ? 2 : 1) : cusRole == 12 ? 2 : 1)),//1医生 2护士
                            actionId: 11697,
                            browType: 10014
                        });
                    }
                    if (identityFlag == 2 || cusRole == 12) {//护理系角色  护士、护师、主管护师、副主任护师、主任护师
                        $(".ev-nurseHelp").show();
                    } else {//默认医生角色
                        $(".ev-doctorHelp").show();
                    }
                    $("body,html").css({
                        height: "100%",
                        overflow: "hidden"
                    })
                });
                $('.ev-authGradeClose').off("click").on("click", function () {
                    $(this).siblings(".al-serText").scrollTop(0);
                    $('.serviceTime').hide();
                    $("body,html").css({
                        height: "auto",
                        overflow: "auto"
                    })
                });
            },
            //错误提示  提示重新认证 认证拒绝
            errorReport: function () {
                var state = TempCache.getItem('auth') ? JSON.parse(TempCache.getItem('auth')).state : null;
                var t = this;
                var param = {
                    customerId: TempCache.getItem('userId'),
                    state: state,
                    sortType: 3,
                    firstResult: 0,
                    maxResult: 1,
                    isCustomer: 1
                };
                var callback = function (data) {
                    if (comm.hasResponseData(data) && data.responseObject.responseData.data_list && data.responseObject.responseData.data_list.length) {
                        var dataList = data.responseObject.responseData.data_list[0];
                        if (dataList.resourceName) {
                            $('.authErrorMessage').html(dataList.resourceName).removeClass('hide');
                            $(".ev-errMesBox").height($('.authErrorMessage').outerHeight());
                        }
                    }
                };
                if (state == 3 || state == 9) {
                    comm.ajax.async(t.path.errorReport, {paramJson: $.toJSON(param)}, callback);
                }
            },
            //返回操作  顶部按钮
            backBtn: function (kv) {
                var t = this;
                $('.ev_authBackBtn').off('click').click(function () {
                    if ($(this).parents(".ev-commHeader").hasClass("ev-headerPrev")) {//选择身份页面
                        if ($('.ev_certSave').hasClass('active') || $('.ev_authNextStep').hasClass('active') || checkHasChangedItem() || $(".ev_skipAuth").is(":visible")) {
                            comm.confirmBox({
                                title: (comm.getpara().reAuth ? "<span class='giveUp'>" +
                                    "确定退出认证变更吗？</span><br/>退出将失去已编辑的内容" :
                                    "<span class='giveUp'>确定放弃认证吗？</span><br/>放弃认证将无法正常使用唯医"),
                                cancel: (comm.getpara().reAuth ? "退出" : "放弃"),
                                ensure: (comm.getpara().reAuth ? "取消" : "继续认证"),
                                cancelCallback: function () {
                                    comm.creatEvent({
                                        triggerType: "角色选择页",
                                        triggerName: '返回',
                                        keyword: '返回',
                                        browType: 395,
                                        actionId: 11696
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
                    else if ($(this).parents(".ev-commHeader").hasClass("ev-headerOne")) {//基本信息页
                        if (kv == 1) {//没有选择身份页面的返回
                            if ($('.ev_certSave').hasClass('active') || $('.ev_authNextStep').hasClass('active') || checkHasChangedItem() || $(".ev_skipAuth").is(":visible")) {
                                comm.confirmBox({
                                    title: (comm.getpara().reAuth ? "<span class='giveUp'>" +
                                        "确定退出认证变更吗？</span><br/>退出将失去已编辑的内容" :
                                        "<span class='giveUp'>确定放弃认证吗？</span><br/>放弃认证将无法正常使用唯医"),
                                    cancel: (comm.getpara().reAuth ? "退出" : "放弃"),
                                    ensure: (comm.getpara().reAuth ? "取消" : "继续认证"),
                                    cancelCallback: function () {
                                        comm.creatEvent({
                                            triggerType: '认证-基本信息',
                                            triggerName: "暂不认证",
                                            keyword: "暂不认证",
                                            userRoleType: (identityFlag ? identityFlag : (cusRole && cusRole == 5 ? ((mIdVal == 11 || mIdVal == 12 || mIdVal == 13 || mIdVal == 14 || mIdVal == 15) ? 2 : 1) : cusRole == 12 ? 2 : 1)),//1医生 2护士
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
                        } else {//有选择身份页面的返回
                            $('.ev_authStep').hide().eq(0).show();//显示身份选择，其他的不显示
                            $('.ev-commHeader').hide().eq(0).show();//显示身份选择，其他的不显示
                            if (comm.getpara().reAuth) {//申请认证变更的情况，返回按钮第一步显示成取消变更
                                $('.ev_skipAuth').hide().eq(0).show().text("取消变更").siblings('img').hide();
                            } else {
                                $('.ev_skipAuth').hide().eq(0).show().text("暂不认证").siblings('img').hide();
                            }
                        }
                    }
                    else if ($(this).parents(".ev-commHeader").hasClass("ev-headerTwo")) {//获取证件页
                        comm.creatEvent({
                            triggerType: "认证-证件信息",
                            triggerName: '返回',
                            keyword: '返回',
                            userRoleType: (identityFlag ? identityFlag : (cusRole && cusRole == 5 ? ((mIdVal == 11 || mIdVal == 12 || mIdVal == 13 || mIdVal == 14 || mIdVal == 15) ? 2 : 1) : cusRole == 12 ? 2 : 1)),//1医生 2护士
                            browType: 10014,
                            actionId: 2521
                        });
                        if (t.mergeAjaxFlag) {//如果存在多帐号合并
                            $('.ev_authStep,.ev-commHeader').hide();//将现有步骤全部隐藏
                            $(".ev-exceptionCon,.un-sameAccount").show();//显示
                        } else {
                            $('.ev_authStep').hide().eq(1).show();//显示基本信息，其他的不显示
                            $('.ev-commHeader').hide().eq(1).show();//显示基本信息，其他的不显示
                            if (kv == 1) {//没有选择身份页面的返回
                                if (comm.getpara().reAuth) {//申请认证变更的情况，返回按钮第一步显示成取消变更
                                    $('.ev_skipAuth').hide().eq(1).show().text("取消变更").siblings('img').hide();
                                } else {
                                    $('.ev_skipAuth').hide().eq(1).show().text("暂不认证").siblings('img').hide();
                                }
                            } else {
                                $('.ev_authStep').hide().eq(1).show();//显示基本信息，其他的不显示
                                $('.ev-commHeader').hide().eq(1).show();//显示基本信息，其他的不显示
                                if (comm.getpara().reAuth) {//申请认证变更的情况，返回按钮第一步显示成取消变更
                                    $('.ev_skipAuth').hide().eq(0).show().text("取消变更").siblings('img').hide();
                                } else {
                                    $('.ev_skipAuth').hide().eq(0).show().text("暂不认证").siblings('img').hide();
                                }
                            }
                            $("body").css("background-color", "#fff");
                        }
                    }
                });
            },
            //来源页跳转
            backFn: function () {
                var hash = location.hash;
                var fromPage = TempCache.getItem('fromPage') || TempCache.getItem('fromPageN');
                if (/message_index/.test(fromPage) ||
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
                } else if (/#secondStep/g.test(hash)) {//判断顶部有第二步骤标志返回两级
                    history.go(-2);
                } else {
                    history.back();
                }
            },
            //基本信息提交页面
            nextStepBtn: function () {
                var t = this;
                var reAuth = comm.getpara().reAuth;//重新认证
                $('.ev_authNextStep').off('click').on('click', function () {
                    if ($(this).attr("data-flag") == 1) {//防止多次点击事件发生
                        $('.ev_authNextStep').attr("data-flag", 0);
                        //下一步
                        comm.creatEvent({
                            triggerType: '认证-基本信息',
                            triggerName: '基本信息-下一步',
                            keyword: '基本信息-下一步',
                            actionId: 2505,
                            browType: 10001
                        });
                        var callBack = function (muCusIdKv) {
                            //判断保存基本信息是否存在多帐号
                            var cBack = function (res) {
                                if (comm.hasResponseData(res)) {
                                    var item = res.responseObject.responseData.dataList;
                                    $('.ev_authNextStep').attr("data-flag", 1);
                                    if (item.isHaveSameAccount == 0) {//没有多帐号合并直接走下一步
                                        $('.ev_authStepOne,.ev-headerOne').hide();
                                        $('.ev_authStepTwo,.ev-headerTwo').show();
                                        $('.ev_skipAuth').hide().siblings('img').show();
                                        location.hash = "#secondStep";
                                        setTimeout(function () {
                                            if (g_sps) {
                                                g_sps.createBrowse({pageId: 450, param:{userRoleType: (identityFlag ? identityFlag : (cusRole && cusRole == 5 ? ((mIdVal == 11 || mIdVal == 12 || mIdVal == 13 || mIdVal == 14 || mIdVal == 15) ? 2 : 1) : cusRole == 12 ? 2 : 1))}});
                                            }
                                        }, 2000);
                                        t.loadCertificate($('#medicalTitle').text() == '医学生');
                                        t.promptMessageFun();//获取顶部上传提示信息
                                        $("body").css("background-color", "#eff4f8");
                                    } else {//有多帐号，走合并流程
                                        t.mergeAjaxFlag = true;//提交认证时是否发送合并请求
                                        t.mergeAjaxCusId = item.customerId;//要合并的帐号
                                        $('.ev_authStepOne,.ev-headerOne').hide();
                                        $(".ev-exceptionCon,.un-sameAccount,.ev-sameAccountHead").show();
                                        exception(item, function () {
                                            $('.ev_authStepOne,.ev-headerOne').hide();
                                            $('.ev_authStepTwo,.ev-headerTwo').show();
                                            $('.ev_skipAuth').hide().siblings('img').show();
                                            $('.ev-exceptionCon').hide();
                                            location.hash = "#secondStep";
                                            setTimeout(function () {
                                                if (g_sps) {
                                                    g_sps.createBrowse({pageId: 450,param:{ userRoleType: (identityFlag ? identityFlag : (cusRole && cusRole == 5 ? ((mIdVal == 11 || mIdVal == 12 || mIdVal == 13 || mIdVal == 14 || mIdVal == 15) ? 2 : 1) : cusRole == 12 ? 2 : 1))}});
                                                }
                                            }, 2000);
                                            t.loadCertificate($('#medicalTitle').text() == '医学生');
                                            t.promptMessageFun();//获取顶部上传提示信息
                                            $("body").css("background-color", "#eff4f8");
                                        },(identityFlag ? identityFlag : (cusRole && cusRole == 5 ? ((mIdVal == 11 || mIdVal == 12 || mIdVal == 13 || mIdVal == 14 || mIdVal == 15) ? 2 : 1) : cusRole == 12 ? 2 : 1)));
                                    }
                                }
                            };
                            if (reAuth) {//认证变更不做异常流程请求
                                $('.ev_authStepOne,.ev-headerOne').hide();
                                $('.ev_authStepTwo,.ev-headerTwo').show();
                                $('.ev_skipAuth').hide().siblings('img').show();
                                location.hash = "#secondStep";
                                setTimeout(function () {
                                    if (g_sps) {
                                        g_sps.createBrowse({pageId: 450, param:{userRoleType: (identityFlag ? identityFlag : (cusRole && cusRole == 5 ? ((mIdVal == 11 || mIdVal == 12 || mIdVal == 13 || mIdVal == 14 || mIdVal == 15) ? 2 : 1) : cusRole == 12 ? 2 : 1))}});
                                    }
                                }, 2000);
                                t.loadCertificate($('#medicalTitle').text() == '医学生');
                                t.promptMessageFun();//获取顶部上传提示信息
                                $("body").css("background-color", "#eff4f8");
                                $('.ev_authNextStep').attr("data-flag", 1);
                            } else {//认证才检测有没有异常流程
                                comm.ajax.async(t.path.checkCustomerV3, {
                                    paramJson: $.toJSON({
                                        "customerId": TempCache.getItem('userId'),
                                        "visitSiteId": 2,
                                        "customerName": muCusIdKv.cName,
                                        "companyId": muCusIdKv.cPid,
                                        "companyName": muCusIdKv.cPName
                                    })
                                }, cBack);
                            }
                        };
                        if ($(this).hasClass('active') && !t.submitting) {
                            var compType = $('#company').attr('workplaceType');             //单位类型
                            var compVal = $('#company').attr('nowVal');                     //单位名称
                            var compId = $('#company').attr('companyId');                   //单位号码
                            var param = {
                                customerId: TempCache.getItem('userId'),
                                fullName: $('#fullName').val(),
                                attType: $(".ev_certType").attr('selectCert'),      //证件类型
                                attPath: $('.ev_loadedPic').attr('src'),            //证件地址
                                attCode: $("input[name=attCode]").val(),            //证件编号
                                company: compType == 1 ? compVal : "",
                                companyId: compType == 1 ? (compId ? compId : "") : "",
                                schoolName: compType == 2 ? compVal : "",
                                schoolId: compType == 2 ? (compId ? compId : "") : "",
                                medicalTitle: $('#medicalTitle').attr('nowVal'),                 //职称
                                opflag: 1,                                                          //第一步骤
                                sex: $('input[name=sex]').val(),
                                sexId: $('input[name=sex]').val() == '男' ? 1 : 2,
                                medicalTitleId: $('#medicalTitle').attr('medFirstClass') == 1 ? $('#medicalTitle').attr('nowVal').match(/\d+/)[0] : ""
                            };
                            var param2 = {
                                customerId: TempCache.getItem('userId'),
                                updateFullName: $('#fullName').val(),
                                updateSexId: $('input[name=sex]').val() == '男' ? 1 : 2,
                                updateSex: $('input[name=sex]').val(),
                                updateWorkplaceType: compType,
                                updateWorkplaceId: compId,
                                updateWorkplace: compVal,
                                updateMedicalTitle: $('#medicalTitle').attr('nowVal'),
                            };
                            var muCusIdKv = {
                                cName: $('#fullName').val(),
                                cPid: compId,
                                cPName: compVal,
                            };
                            var _fnSuc = function (data) {//基本信息保存成功
                                t.submitting = false;
                                comm.loading.hide();
                                if (data && data.responseObject && data.responseObject.responseStatus) {
                                    if (reAuth) {
                                        t.resPK = data.responseObject.responsePk;
                                    }
                                    //重新保存信息
                                    $('#company').attr({
                                        'preVal': $('#company').attr('nowVal'),
                                        'preValCId': $('#company').attr('nowVal')
                                    });                     //单位名称
                                    $('#fullName').attr('preVal', $('#fullName').val());
                                    $('input[name=sex]').attr('preVal', $('input[name=sex]').val());
                                    $('#medicalTitle').attr('preVal', $('#medicalTitle').attr('nowVal'));
                                    callBack(muCusIdKv);
                                }
                            };
                            if (reAuth) {//重新认证发送请求
                                t.submitting = true;
                                comm.loading.show();
                                comm.ajax.async(t.path.updateAuth, {paramJson: $.toJSON(param2)}, _fnSuc);
                            } else {
                                if (checkHasChangedItem()) {//检测基本信息数据是否有变动
                                    t.submitting = true;
                                    comm.loading.show();
                                    comm.ajax.async(t.path.createAuthNew, {paramJson: $.toJSON(param)}, _fnSuc);
                                } else {//没有数据变动，直接获取证书
                                    if (!t.submitting) {
                                        callBack(muCusIdKv);
                                    }
                                }
                            }
                        }
                    }
                });
            },
            //获取上传证件顶部提示信息
            promptMessageFun: function () {
                var t = this;
                var cBack = function (res) {
                    if (comm.hasResponseData(res)) {
                        var item = res.responseObject.responseData;
                        $(".ev-tipsTitle").text(item.promptMessage.split("@=@")[0]);
                        $(".ev-detailText").text('(' + item.promptMessage.split("@=@")[1] + ')');
                    }
                };
                comm.ajax.async(t.path.promptMessage, {
                    paramJson: $.toJSON({
                        scene: identityFlag ? (identityFlag == 1 ? 2 : 6) : (cusRole == 12 ? 6 : 2),//护理角色传6，医生传2
                        isValid: 1,
                        promptCondition: 0
                    })
                }, cBack);
            },
            //截取
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
                var param = {
                    medicalTitleId: $("#medicalTitle").attr("nowval").substr(0, $("#medicalTitle").attr("nowval").indexOf("_")),
                    isValid: 2, visitSiteId: 2
                };
                $.ajax({
                    type: 'POST',
                    url: t.path.getDataRoleConfigs,
                    data: {paramJson: $.toJSON(param)},
                    async: false,
                    dataType: "json",
                    timeout: 10000,
                    success: function callback(rep) {
                        $('.ev_authNextStep').addClass('ev-hasLoadedCert');
                        var html = "";
                        var certArr = [];
                        if (rep && rep.responseObject && rep.responseObject.responseStatus) {
                            var data = rep.responseObject.responseData.data_list;
                            if (data && data.length > 1) {
                                //1*身份证,8*医师执业证,6*医师资格证,13*医师职称证书,10工作证(学生证),9医学学历证,7医学学位证
                                $.each(data, function (index, i) {
                                    html += t.certTemplate(i.refId, i.refValue, isStu);
                                });
                                $('.ev_notIdCert').html(html);
                                t.getAuthAttachments(isStu);
                                //①默认展开所有未填项，其他完成项收起。
                                $('.al-certificateToggleArea').addClass('slideDownState');
                                //当A项证件照点开但未上传图片，又展开其他项时，A项自动收起；
                                $('.al-certificateToggleArea .al-tableModuleItem').off('click').click(function () {
                                    var selfPa = $(this).parent(".al-certificateToggleArea").index();
                                    if ($(this).parent().hasClass('slideDownState')) {
                                        $(this).parent().removeClass('slideDownState');
                                        comm.creatEvent({
                                            triggerType: '认证-证件信息',
                                            triggerName: '收起按钮',
                                            keyword: '收起按钮',
                                            userRoleType: (identityFlag ? identityFlag : (cusRole && cusRole == 5 ? ((mIdVal == 11 || mIdVal == 12 || mIdVal == 13 || mIdVal == 14 || mIdVal == 15) ? 2 : 1) : cusRole == 12 ? 2 : 1)),//1医生 2护士
                                            actionId: 11458,
                                            browType: 10014
                                        });
                                    } else {
                                        $(this).parent().addClass('slideDownState');
                                        comm.creatEvent({
                                            triggerType: '认证-证件信息',
                                            triggerName: '展开按钮',
                                            keyword: '展开按钮',
                                            userRoleType: (identityFlag ? identityFlag : (cusRole && cusRole == 5 ? ((mIdVal == 11 || mIdVal == 12 || mIdVal == 13 || mIdVal == 14 || mIdVal == 15) ? 2 : 1) : cusRole == 12 ? 2 : 1)),//1医生 2护士
                                            actionId: 11458,
                                            browType: 10014
                                        });
                                    }
                                });
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
            //获取认证附件
            getAuthAttachments: function (isStu) {
                var t = this;
                $.ajax({
                    url: t.path.getAuthAttachments,
                    data: {firstResult: 0, maxResult: 999},
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
                                            if (jel.createTime && nel.createTime && Date.parse(jel.createTime.substring(0, 19))
                                                > Date.parse(nel.createTime.substring(0, 19))) {//新数组中同一位置 图片时间> 老的时间 ==为新
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
                                _temp = $('.ev-imgAtt' + ele.attType);
                                if (_temp.length) {
                                    var _img = _temp.eq(ele.attPositionType - 1).find('img');
                                    //②用户上传过的证件将展开；
                                    _temp.parents('.al-certificateToggleArea').addClass('slideDownState hasLoadedCerts');
                                    if (ele.attPath && (ele.attPath.indexOf('jpg') != -1 || ele.attPath.indexOf('jpeg') != -1 || ele.attPath.indexOf('png') != -1 || ele.attPath.indexOf('PNG') != -1 || ele.attPath.indexOf('JPEG') != -1 || ele.attPath.indexOf('JPG') != -1)) {
                                        $(_img.eq(0)).attr({
                                            src: '//img50.allinmd.cn/authentication/certificate/authImgLoading.png',
                                            imgSrc: ele.attPath,
                                            id: ele.id,
                                            preVal: ele.attPath
                                        }).addClass('newUploadSuccess').siblings(".al-certUpText").hide();//上传图片文字
                                        _img.siblings('.al-certClose').off('click').click(function () {
                                            _img.eq(0).attr('src', _img.eq(0).attr('oriurl')).removeClass('newUploadSuccess hide').addClass('newDelete').removeAttr('imgSrc').siblings(".al-certUpText").show();//上传图片文字修改
                                            $(this).addClass('hide');
                                            _img.siblings('input').show();
                                            if (_temp.parents('.al-certificateItems').find('.newUploadSuccess').length < _temp.parents('.al-certificateItems').find('input').length) {
                                                if ($('html').attr('emptyAttCode') == _temp.parents('.al-certificateItems').find('.al-firstCertItem section').eq(1).attr('class').split('al-certItemUploadBox ')[1]) {
                                                    $('html').removeAttr('emptyAttCode');
                                                }
                                            }
                                            checkCertReady();
                                        });
                                        _img.siblings('input').hide();
                                    }
                                    if (ele.isRefuse == 1) {//未通过认证、
                                        _temp.parents(".al-certificateToggleArea")
                                            .find(".al-cerTitleText .ev-noPassTips").addClass("al-notPassTips").show();
                                    }
                                    if (ele.attCode) {//证件号
                                        _temp.parents('.al-certificateItems').siblings('.al-certCode').find('input').val(ele.attCode).attr('preVal', ele.attCode);
                                    }
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
                        } else {
                            checkCertReady();//检测完整度
                        }
                    }
                });
            },
            //证书模板
            certTemplate: function (refId, refValue, isStu) {
                var demoImg = [];//存放示例图片
                var tipWords = '';
                var isStudent = $('#medicalTitle').text() == "医学生";
                var loadingImg = '//img50.allinmd.cn/authentication/certificate/authImgLoading.png';
                demoImg[8] = ['pic_zhiye1.png', 'pic_zhiye2.png'];//医师执业证
                demoImg[6] = ['pic_zige1.png', 'pic_zige2.png'];//医师资格证
                demoImg[13] = ['pic_zhicheng.png'];//医师职称证
                demoImg[10] = ['pic_work.png'];//工作证
                demoImg[11] = ['pic_work.png', 'pic_nurseWork.png'];//工作证
                demoImg[12] = ['pic_student.png'];//学生证
                demoImg[7] = ['pic_xuewei.png'];//学位证
                demoImg[9] = ['pic_xueli.png'];//学历证
                demoImg[1] = ['pic_id1.png', 'pic_id2.png'];//身份证
                demoImg[15] = ['pic_nurseZhiye1.png', 'pic_nurseZhiye2.png'];//15-护士执业证
                demoImg[16] = ['pic_nurseJishuzige1.png'];//16-专业技术资格证
                if (refId == 1 || refId == 6 || refId == 8 || refId == 15) {//身份证、医师资格证、医师执业证、护士执业证
                    tipWords = '第一页'
                }
                var html =
                    ' <section class="al-certificateToggleArea">' +
                    '     <article class="al-tableModuleItem al-cerTitleText">' +
                    '         <h3 class="al-toggleStar ">' + refValue +
                    '         </h3>' +
                    '<p class="ev-readyTips"></p><p class="ev-noPassTips" style="display: none;">未通过</p>' +
                    '     </article>' +
                    '     <section class="al-certificateItems ' + (refId == 1 ? ' ev-idCard' : '') + '">' +
                    '<p class="al-certNameText">证件照片</p>' + /*证件信息父层  加标题用20180905*/
                    '<section class="al-certItemBox">' +
                    '         <section class="al-certItem al-firstCertItem">' +
                    '<aside class="al-upImgBox">' +
                    '             <section>' +
                    '                 <img class="ev_demoImg" src="' + loadingImg + '" ' +
                    'imgSrc="//img50.allinmd.cn/authentication/certificate/' + (identityFlag && identityFlag == 2 && refId == 11 ? demoImg[11][1] : (cusRole == 12 && refId == 11) ? demoImg[11][1] : demoImg[refId][0]) + '"/>' +
                    '             </section>' +
                    '                 <p class="al-certTip">' + tipWords + '示例' + '</p>' +
                    '</aside>' +
                    '<aside class="al-upImgBox">' +
                    '             <section class="al-certItemUploadBox ev-imgAtt' + refId + ' ev_attFile" attType="' + refId + '">' +

                    '                 <img src="//img50.allinmd.cn/authentication/auth/upload_01.png" alt="" oriUrl="//img50.allinmd.cn/authentication/auth/upload_01.png"/>' +
                    '                 <span class="al-certUpText">上传照片</span>' +

                    '                 <figure class="al-certLoadingTip hide">' +
                    '                     <img src="//img50.allinmd.cn/case/loading.gif" alt="" class="notShow"/>' +
                    '                 </figure>' +
                    '                 <figure class="al-certErrorTip hide">' +
                    '                     <p>上传失败<br/>删除后重新上传</p>' +
                    '                 </figure>' +
                    '                 <span class="al-certClose hide"></span>' +

                    '            </section>' +
                    '                 <p class="al-certTip">' + ((refId == 1 || refId == 6 || refId == 8 || refId == 15) ? '第一页' : '') + '</p>' +
                    '    </aside>' +
                    '         </section>' +
                    ((refId == 1 || refId == 6 || refId == 8 || refId == 15) ? (   //两张图片的
                        '         <section class="al-certItem">' +
                        '<aside class="al-upImgBox">' +
                        '             <section>' +
                        '                 <img class="ev_demoImg" src="' + loadingImg + '" imgSrc="//img50.allinmd.cn/authentication/certificate/' + demoImg[refId][1] + '" alt=""/>' +
                        '             </section>' +
                        '              <p class="al-certTip">第二页示例</p>' +
                        '   </aside>' +
                        '<aside class="al-upImgBox">' +
                        '             <section class="al-certItemUploadBox ev-imgAtt' + refId + ' ev_attFile" attType="' + refId + '">' +

                        '                 <img src="//img50.allinmd.cn/authentication/auth/upload_01.png" alt="" oriUrl="//img50.allinmd.cn/authentication/auth/upload_01.png"/>' +
                        '                 <span class="al-certUpText">上传照片</span>' +

                        '                 <figure class="al-certLoadingTip hide">' +
                        '                     <img src="//img50.allinmd.cn/case/loading.gif" alt="" class="notShow"/>' +
                        '                 </figure>' +
                        '                 <figure class="al-certErrorTip hide">' +
                        '                     <p>上传失败<br/>删除后重新上传</p>' +
                        '                 </figure>' +
                        '                 <span class="al-certClose hide"></span>' +
                        '            </section>' +
                        '              <p class="al-certTip">第二页</p>' +
                        '    </aside>' +
                        '         </section>'
                    ) : "") +
                    '     </section>' +
                    '     </section>' +
                    '<p class="al-cerPlaceholder"></p>' +
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
                        showImg.siblings(".al-certUpText").hide();//上传图片文字修改
                    },
                    uploadSuccess: function (data, status) {
                        var url = data.responseObject.responseMessage.url;
                        var path = data.responseObject.responseMessage.path;
                        if (data.responseObject.responseStatus) {
                            showImg.attr({
                                src: url,
                                val: url
                            }).removeClass('hide newDelete').addClass('newUploadSuccess').siblings(".al-certUpText").hide();//上传图片文字修改
                            loadingTip.addClass('hide');
                            t.viewBigImg('.al-certItemUploadBox');
                            obj.find("input").hide().val("");
                            //移除未通过标志
                            obj.parents(".al-certificateToggleArea").find(".al-cerTitleText .ev-noPassTips").removeClass("al-notPassTips").hide();
                            checkCertReady();
                            certClose.removeClass('hide').off('click').click(function () {
                                obj.find("input").show().val("");
                                loadingTip.addClass('hide');
                                showImg.attr('src', showImg.attr('oriUrl')).removeClass('newUploadSuccess hide').removeAttr('imgSrc').siblings(".al-certUpText").show();//上传图片文字修改
                                $(this).addClass('hide');
                                if (showImg.parents('.al-certificateItems').find('.newUploadSuccess').length < showImg.parents('.al-certificateItems').find('input').length) {
                                    if ($('html').attr('emptyAttCode') == showImg.parents('.al-certificateItems').find('.al-firstCertItem section').eq(1).attr('class').split('al-certItemUploadBox ')[1]) {
                                        $('html').removeAttr('emptyAttCode');
                                    }
                                }
                                //移除未通过标志
                                obj.parents(".al-certificateToggleArea").find(".al-cerTitleText .ev-noPassTips").removeClass("al-notPassTips").hide();
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
                                    if ($('html').attr('emptyAttCode') == showImg.parents('.al-certificateItems').find('.al-firstCertItem section').eq(1).attr('class').split('al-certItemUploadBox ')[1]) {
                                        $('html').removeAttr('emptyAttCode');
                                    }
                                }
                                //移除未通过标志
                                obj.parents(".al-certificateToggleArea").find(".al-cerTitleText .ev-noPassTips").removeClass("al-notPassTips").hide();
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
                                if ($('html').attr('emptyAttCode') == showImg.parents('.al-certificateItems').find('.al-firstCertItem section').eq(1).attr('class').split('al-certItemUploadBox ')[1]) {
                                    $('html').removeAttr('emptyAttCode');
                                }
                            }
                            //移除未通过标志
                            obj.parents(".al-certificateToggleArea").find(".al-cerTitleText .ev-noPassTips").removeClass("al-notPassTips").hide();
                            checkCertReady();
                        });
                    },
                });
            },
            //查看大图
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
                        setTimeout(function () {
                            if (g_sps) {
                                g_sps.createBrowse({pageId: 451, param:{userRoleType: (identityFlag ? identityFlag : (cusRole && cusRole == 5 ? ((mIdVal == 11 || mIdVal == 12 || mIdVal == 13 || mIdVal == 14 || mIdVal == 15) ? 2 : 1) : cusRole == 12 ? 2 : 1))}});
                            }
                        }, 2000);
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
            //提交成功提示弹层
            showAuthPop: function (obj) {
                var html = "";
                if (obj && obj.type == "success") {
                    html = '<section class="authPopup_change">\n' +
                        '        <aside class="authPopupCont_change">\n' +
                        '            <figure class="ev_know">关闭</figure>\n' +
                        '            <aside class="exhibitionImg_change submit"><img src="//img50.allinmd.cn/authentication/auth/success_01.png"></aside><!--提交成功图片-->\n' +
                        '            <article class="titleText_change">提交成功</article>\n' +
                        '            <article class="detailText_change color777">' + (comm.getpara().reAuth ? '变更申请已成功提交，<br/>我们将在1-3个工作日内处理完成，请您耐心等待' : '认证审核需要1-3个工作日，请您耐心等待') + '</article><!--色值为#777777 浅色-->\n' +
                        '        </aside>\n' +
                        '    </section>';
                } else if (obj && obj.type == "fail") {
                    html = '<section class="authPopup_change">\n' +
                        '        <aside class="authPopupCont_change">\n' +
                        '            <figure class="ev_closeAuthPop">关闭</figure>\n' +
                        '            <aside class="exhibitionImg_change submitFail"><img src="/images/img50/authentication/auth/defeated_hint.png"></aside>' +//<!--提交失败图片-->
                        '            <article class="titleText_change">提交失败</article>\n' +
                        '            <article class="detailText_change color777">可能是网络原因，请检查您的网络</article><!--色值为#777777 浅色-->\n' +
                        '            <button class="hollowBtn ev_reSubmit">重新提交</button><!--空心按钮-->\n' +
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
                $('.ev_certSave').off("click").click(function () {
                    var _kv = false;
                    $.each($(".al-certLoadingTip"), function (i, e) {
                        if ($(e).is(":visible")) {
                            _kv = true;
                        }
                    });
                    if (_kv) {//如果上传图片的loading，不能保存  提示图片上传
                        popup("图片正在上传，请稍候");
                    } else {
                        var self = this;
                        comm.creatEvent({
                            triggerType: '认证-证件信息',
                            triggerName: '认证信息-提交',
                            keyword: '认证信息-提交',
                            userRoleType: (identityFlag ? identityFlag : (cusRole && cusRole == 5 ? ((mIdVal == 11 || mIdVal == 12 || mIdVal == 13 || mIdVal == 14 || mIdVal == 15) ? 2 : 1) : cusRole == 12 ? 2 : 1)),//1医生 2护士
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
                                        if ($(el).attr('src') && $(el).attr('src').indexOf('authentication/auth/upload_01.png') > -1) {//删除证件
                                            updateAttPath = '';
                                        }
                                    }
                                    attArr.push({
                                        attType: $(el).parent().attr('attType'),
                                        updateAttType: $(el).parent().attr('attType'),
                                        updateAttCode: $(el).parents('.al-certificateToggleArea').find('.al-certCode').length ? $(el).parents('.al-certificateToggleArea').find('.al-certCode input').val() : "",
                                        attCode: $(el).parents('.al-certificateToggleArea').find('.al-certCode').length ? $(el).parents('.al-certificateToggleArea').find('.al-certCode input').attr('preVal') : "",
                                        updateAttPath: updateAttPath,
                                        attPath: $(el).attr('preVal') ? $(el).attr('preVal').split('img05.allinmd.cn/')[1] : "",
                                        attPositionType: $(el).parents('.al-certItem').hasClass('al-firstCertItem') ? 1 : 2,
                                        attFormat: $(el).attr('preVal') ? ($(el).attr('preVal').lastIndexOf("img05.allinmd.cn/") > -1 ? $(el).attr('preVal').split('img05.allinmd.cn/')[1].substring($(el).attr('preVal').split('img05.allinmd.cn/')[1].lastIndexOf('.') + 1) : $(el).attr('preVal')) : "",
                                        updateAttFormat: updateAttPath == '' ? "" : $(el).attr('src').split('.')[$(el).attr('src').split('.').length - 1]
                                    });
                                } else {
                                    if ($(el).hasClass('newUploadSuccess')) {
                                        attArr.push({
                                            attType: $(el).parent().attr('attType'),
                                            attCode: $(el).parents('.al-certificateToggleArea').find('.al-certCode').length ? $(el).parents('.al-certificateToggleArea').find('.al-certCode input').val() : "",
                                            attPath: $(el).attr('preVal') ? ($(el).attr('preVal').indexOf($(el).attr('src').split('img05.allinmd.cn/')[1]) > -1
                                                ? "" : $(el).attr('src').split('img05.allinmd.cn/')[1]) : $(el).attr('src').split('img05.allinmd.cn/')[1],
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
                            if (t.mergeAjaxFlag) {//如果存在多个帐号发送合并请求
                                param.isMerge = 1;
                                param.mainCustomerId = TempCache.getItem('userId');
                                param.mergeCustomerId = t.mergeAjaxCusId;
                            }
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
                                    $("body,html").css({
                                        height: "100%",
                                        overflow: "hidden"
                                    });
                                    return false;
                                }
                                if (data && data.responseObject && data.responseObject.responseStatus) {
                                    user.getSessionInfo();
                                    t.showAuthPop({
                                        type: "success",
                                        knowFn: function () {
                                            user.success("认证成功，即将返回来源页");
                                        }
                                    });
                                    $("body,html").css({
                                        height: "100%",
                                        overflow: "hidden"
                                    });
                                }
                                setTimeout(function () {
                                    t.isSubmiting = false;
                                }, 3000);
                            };
                            t.isSubmiting = true;
                            if (comm.getpara().reAuth) {
                                comm.ajax.async(t.path.updateAttachement, {paramJson: $.toJSON(param2)}, _callback);
                            } else {
                                comm.ajax.async(t.path.createAuthNew, {paramJson: $.toJSON(param)}, _callback);
                            }
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
                                } else if ($('html').attr('emptyAttCode') == 'ev-imgAtt15') {
                                    popup('请完整上传护士执业证后再提交');
                                }
                                $('.' + $('html').attr('emptyAttCode')).parents('.al-certificateToggleArea').find('.al-certCode').focus();
                            } else {
                                return false;
                            }
                        }
                    }
                });
            }
        };
        //检测是否有数据变动
        function checkHasChangedItem() {
            var _flag = false;
            if (
                $('#fullName').val() != $('#fullName').attr('preVal') ||   //姓名
                $('input[name=sex]').val() != $('input[name=sex]').attr('preVal') || //性别
                $('#company').attr('nowVal') != $('#company').attr('preVal') ||        //单位
                $('#medicalTitle').attr('nowVal') != $('#medicalTitle').attr('preVal') //||  //职称
            ) {
                _flag = true;
            }
            return _flag;
        }
        //检测基本信息，是否下一步
        function checkFinish() {
            var fullName = $('#fullName').val().replace(/^[\s]/, '');    //姓名$('#fullName').val().replace(/^[\s]/, '')
            var _isValidName = /^[\u4e00-\u9fa5\s·A-Za-z]{1,25}$/.test(fullName) || /^[A-Za-z·\s]{1,50}$/.test(fullName);
            var companyVal = $('#company').attr('nowVal');
            var medTitleVal = $('#medicalTitle').text() && $('#medicalTitle').text() != "请选择";
            if (fullName && _isValidName && companyVal && medTitleVal) {
                $('.ev_authNextStep').addClass('active').attr("data-flag", 1);
            } else {
                if (fullName && !_isValidName) {//验证姓名有问题
                    popup("请正确填写姓名");
                }
                $('.ev_authNextStep').removeClass('active');
            }
        }
        //检测证件是否可以保存
        function checkCertReady() {
            var flag = false;//可提交条件 满足任一
            var flaArr = [],  //用于判断按钮是否可以激活
                flaArr2 = [],//判断数据是否完整，可以提交
                flaArr3 = []; //判断非身份证字段是否已填写，如果此字段无1，身份证字段填写完全也不能提交
            $('.ev_certSave').removeClass('active').attr('flag', false);
            $('html').removeAttr('emptyAttCode');
            $.each($('.ev_notIdCert .al-certificateItems'), function (ind, elem) {
                if ($(elem).find('.ev-imgAtt1').length) {//身份证判断
                    $.each($('.ev-idCard'), function (inde, eleme) {//身份证上传2张并且 资质证明至少有一张
                        if ($(eleme).find('.newUploadSuccess').length && $(eleme).find('.newUploadSuccess').length != 2) {      // 只上传了一张
                            $('.ev_certSave').attr('flag', false);
                            if (flaArr3.indexOf(1) > -1) {//判断非身份证字段已填写，身份证字段填写可激活按钮
                                flaArr.push(0);
                            }
                            flaArr2.push(0);
                            $(elem).siblings(".al-cerTitleText").find(".ev-readyTips").removeClass('al-readyTips');
                            $('html').attr('emptyAttCode', $(eleme).find('.al-firstCertItem section').eq(1).attr('class').split(' ')[1]);
                        }
                        else if ($(eleme).find('.newUploadSuccess').length == 2) {//上传了两张
                            if (!$(elem).siblings(".al-cerTitleText").find(".ev-noPassTips").hasClass("al-notPassTips")) {//没有未通过标志
                                $(elem).parents(".al-certificateToggleArea").removeClass("slideDownState");
                                $(elem).siblings(".al-cerTitleText").find(".ev-readyTips").addClass('al-readyTips');
                            }
                        }
                    });
                } else {//除了身份证以外的证件
                    if (
                        $(elem).find('input').length != 0 &&  //要上传图片 并且上传图片的数量与已上传的数量相同
                        $(elem).find('input').length == $(elem).find('.newUploadSuccess').length
                    ) {
                        if ($(elem).find('.newDelete').length == 0) {
                            $('.ev_certSave').addClass('active').attr('flag', true);
                            flaArr.push(1);
                            flaArr2.push(1);
                            flaArr3.push(1);
                            if (!$(elem).siblings(".al-cerTitleText").find(".ev-noPassTips").hasClass("al-notPassTips")) {//没有未通过标志
                                $(elem).parents(".al-certificateToggleArea").removeClass("slideDownState");
                                $(elem).siblings(".al-cerTitleText").find(".ev-readyTips").addClass('al-readyTips');
                            }
                        } else {//有删除后为空的
                            flaArr.push(1);
                            flaArr2.push(0);
                            flaArr3.push(1);
                            if (!$(elem).siblings(".al-cerTitleText").find(".ev-noPassTips").hasClass("al-notPassTips")) {//没有未通过标志
                                $(elem).parents(".al-certificateToggleArea").removeClass("slideDownState");
                                $(elem).siblings(".al-cerTitleText").find(".ev-readyTips").addClass('al-readyTips');
                            }
                            $('.ev_certSave').attr('flag', false);
                            $('html').attr('emptyAttCode', $(elem).find('.al-firstCertItem section').eq(1).attr('class').split(' ')[1]);
                        }
                        if ($('#medicalTitle').text() != '医学生') {//20180703修改需求，非医学生的学历证和学位证上传不能激活认证提交，工作证可以激活提交
                            if ($(elem).find(".ev-imgAtt9").length <= 0 && $(elem).find(".ev-imgAtt7").length <= 0) {
                                $('.ev_certSave').addClass('active').attr('flag', true);
                                flaArr.push(1);
                                flaArr2.push(1);
                                flaArr3.push(1);
                                if (!$(elem).siblings(".al-cerTitleText").find(".ev-noPassTips").hasClass("al-notPassTips")) {//没有未通过标志
                                    $(elem).parents(".al-certificateToggleArea").removeClass("slideDownState");
                                    $(elem).siblings(".al-cerTitleText").find(".ev-readyTips").addClass('al-readyTips');
                                }
                            }
                        } else {//医学生的学位证和学历证可以正常提交 验证激活
                            $('.ev_certSave').addClass('active').attr('flag', true);
                            flaArr.push(1);
                            flaArr2.push(1);
                            flaArr3.push(1);
                            if (!$(elem).siblings(".al-cerTitleText").find(".ev-noPassTips").hasClass("al-notPassTips")) {//没有未通过标志
                                $(elem).parents(".al-certificateToggleArea").removeClass("slideDownState");
                                $(elem).siblings(".al-cerTitleText").find(".ev-readyTips").addClass('al-readyTips');
                            }
                        }

                    } else if ($(elem).find('input').length != $(elem).find('.newUploadSuccess').length && $(elem).find('.newUploadSuccess').length != 0) {//两张传一张
                        $('html').attr('emptyAttCode', $(elem).find('.al-firstCertItem section').eq(1).attr('class').split(' ')[1]);
                        flaArr.push(0);
                        flaArr3.push(1);
                        flaArr2.push(0);
                        $(elem).siblings(".al-cerTitleText").find(".ev-readyTips").removeClass('al-readyTips');
                    }
                    else {//已完成标志
                        $(elem).siblings(".al-cerTitleText").find(".ev-readyTips").removeClass('al-readyTips');
                    }
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
});




