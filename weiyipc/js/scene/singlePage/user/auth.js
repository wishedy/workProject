/**
 * @Desc： 新版认证
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by LiChunHui on 2017/4/24.
 */
$(function () {
    var newAuth = {};
    newAuth = {
        path: {
            hospital: PC_CALL + "commdata/getHospitalList/",//医院联想
            university: PC_CALL + "commdata/getSchoolList/",//学校联想
            getCustomerUnite: PC_CALL + "customer/unite/getCustomerUnite/",     //获取当前登录用户信息
            medical: PC_CALL + "commdata/getMedicalTitleList/",//获取医师职称
            getCustomerAuthInfo: PC_CALL + 'customer/auth/getAuthBycustomerId/',//获取用户认证信息
            getLogo: PC_CALL + "commdata/getLogoUrlList/",//获取用户头像
            renzhengSubmit: PC_CALL + "customer/auth/createAuth2/",	//	认证提交
            // getDataRoleConfigs: PC_CALL + "comm/data/roleconfig/getDataRoleConfigs/",//获取证件名称
            getDataRoleConfigs: PC_CALL + "comm/data/roleconfig/getSortList/",//获取证件名称
            // getAuthAttachments: PC_CALL + "customer/auth_attachment/getAuthAttachments/",//获取用户证件信息
            getAuthAttachments: PC_CALL + "customer/auth_attachment/getAuthAttachmentsV2/",//获取用户证件信息
            // getAuthAttachments: PC_CALL + "customer/auth_attachment/getMapList2/",//获取用户证件信息
            promptMessage: PC_CALL + "customer/unite/promptMessage/",//上传证件页面提示接口
            getMapById: PC_CALL + 'customer/unite/getMapById/',//获取用户性别
            getMapList: PC_CALL + 'customer/auth_process/getMapList/',//获取拒绝原因
            // getMapList: PC_CALL + 'customer/auth/process/v3/getMapList/',//获取拒绝原因
            create: PC_CALL + 'customer/revise/auth/create/',//申请认证变更-基本信息
            checkCustomerV3: PC_CALL + 'customer/auth/checkCustomerV3/',//检测是否有异常账号
            mergeCreate: PC_CALL + 'customer/merge/v3/create/',//账号合并请求
            revise: PC_CALL + 'customer/attachment/revise/create/'//申请认证变更-附件
        },
        init: function () {
            this.para = comm.getpara();//解析URL参数
            this.getCustomerAuthInfo();//获取用户认证信息
            this.helpAuth();
            this.cancel();
            // this.getTipSecond();
            // this.sendMergeCreate({
            //     "mainCustomerId":"1536644724485",
            //     "mergeCustomerId":1536627354802,
            //     "mergeState":"1",
            //     "mergeType":"1",
            //     "opUsr":"1536644724485",
            //     "resourceType":1,
            //     "isValid":1,
            //     "visitSiteId":1
            // });
            var uid = $('#sesCustomerId').val(); //登录人id
            if (!uid) {
                user.login({
                    callback: function () {
                        location.reload();
                    },
                    scene: privilegeSceneConst.eSceneTypeLogin,
                    onClose: function () {
                        if (window.g_sps) {
                            g_sps.jump(null, "/");
                        } else {
                            setTimeout(function () {
                                g_sps.jump(null, "/");
                            }, 300)
                        }
                    },
                    noAuthReload: true
                });
                return false;
            }
            else {
                //获取当前登录用户信息，是为了更新 customerRole
                user.getCustomerUnit();
            }
        },
        //获取用户认证信息
        getCustomerAuthInfo: function () {
            var t = this;
            if (comm.authInfo) {
                var data = comm.authInfo;
                if (data && data.responseObject) {
                    var rspObj = data.responseObject;
                    t.customerAuth = rspObj;
                    t.name = rspObj.certificatesCode;//姓名
                }
            } else {
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
            var postData = {
                customerId: $("#sesCustomerId").val(),
                isCustomer: 1
            };
            postData = {
                paramJson: $.toJSON(postData)
            };
            $.ajax({
                url: t.path.getMapById,
                data: postData,
                type: 'post',
                dataType: 'json',
                success: function (data) {
                    if (data && data.responseObject.responseData && data.responseObject.responseData.data_list && data.responseObject.responseData.data_list.length > 0) {
                        t.customerAuth.sex = data.responseObject.responseData.data_list["0"].customer_baseinfo.sex;
                        // var reason=data.responseObject.responseData.data_list['0'].customer_auth_refuse.resourceName;
                        // if(reason){
                        //     $('.ev-errorText').text(reason);
                        // }

                    }
                    t.checkAuth();//检查用户认证状态
                }
            });
            if (t.para.isCustomerInfo) {
                //个人中心
                //进入第一步
                t.firstAuthStep();
                $('.ev-authCancel').show();
                // t.secondAuthStep();
            } else {
                if (t.customerAuth.state === 0 || t.customerAuth.state === 1 || t.customerAuth.state === 2 || t.customerAuth.state === 7 || t.customerAuth.state === 8) {//0-二次提交认证、1-认证通过、2-运营确认
                    setTimeout(function () {
                        g_sps.jump(null, "/");
                    }, 500)
                }
            }

        },
        /**
         * 功能描述：判断认证结果
         * 参数说明：
         * 认证状态值：cAuth.state
         *  -1 - 无认证信息、0 - 二次提交认证、1 - V1认证申请、2 - 运营确认
         *  3 - 认证拒绝、7 - 执业医师申请、8 - 执业医师确认、9 - 执业医师拒绝
         * 注意事项：
         *
         * Create by YaoQiao on 2019/3/13
         */
        checkAuth: function () {
            var t = this;
            if (t.customerAuth && !$.isEmptyObject(t.customerAuth)) {//有认证的信息
                var cAuth = t.customerAuth;
                $('.ev-secondError').hide();
                $('.ev-authText').removeClass('authTextMar');
                //  1-无认证信息、0-二次提交认证、1-认证通过、2-运营确认、3-认证拒绝
                if (cAuth.customerId <= 0 || cAuth.state === 3 || cAuth.state === -1 || cAuth.state == 9) {
                    t.isFirstAuth = 1;
                    // 未申请  || 被拒绝  ||无认证信息
                    if (cAuth.state === 3 || cAuth.state == 9) {
                        t.isFirstAuth = 2;
                        // $('.ev-firstError').show();
                        var postData = {
                            customerId: $("#sesCustomerId").val(),
                            state: cAuth.state,
                            sortType: 3,
                            firstResult: 0,
                            maxResult: 1,
                            isCustomer: 1
                        };
                        postData = {
                            paramJson: $.toJSON(postData)
                        };
                        $.ajax({
                            url: t.path.getMapList,
                            data: postData,
                            type: 'post',
                            dataType: 'json',
                            success: function (data) {
                                if (data && data.responseObject.responseData
                                    && data.responseObject.responseData.data_list
                                    && data.responseObject.responseData.data_list.length > 0) {
                                    $('.ev-errorText').text(data.responseObject.responseData.data_list["0"].resourceName);
                                    $('.ev-firstError').show();
                                }
                            }
                        });
                    }
                    //进入第一步
                    t.firstAuthStep();
                    // t.end();
                    // t.secondAuthStep();
                }
                else if (cAuth.state === 2 || cAuth.state === 8) {
                    if (t.para.isCustomerInfo) {
                        //个人中心
                        //进入第一步
                        t.firstAuthStep();
                        //t.secondAuthStep();
                    } else {
                        //认证已经通过，且资料都完善。
                        setTimeout(function () {
                            g_sps.jump(null, "/");
                        }, 500);
                        t.isRenZhengStatus = true;
                        // t.end();
                    }
                }
                else if (cAuth.state === 0 || cAuth.state === 7 || cAuth.state === 1) {
                    //已经提交申请 未审核 ，此时不允许再次认证
                    // t.end();
                    //认证已经通过，且资料都完善。
                    setTimeout(function () {
                        g_sps.jump(null, "/");
                    }, 500);
                }
            }
        },
        /**
         * 功能描述：认证信息的第一步
         * 参数说明：
         * 认证状态值：t.customerAuth.state
         *  -1 - 无认证信息、0 - 二次提交认证、1 - V1认证申请、2 - 运营确认
         *  3 - 认证拒绝、7 - 执业医师申请、8 - 执业医师确认、9 - 执业医师拒绝
         * 注意事项：
         * 1、弹窗的条件：仅限于新用户首次申请认证、V1拒绝的认证状态会弹出角色选择，也就是说，只要不是 2、8、9 都可以弹出角色选择
         * 2、认证第一步，角色选择：分为2个小步骤：
         *      1）角色选择
         *      2）基本信息填写
         *
         * Create by YaoQiao on 2019/3/15
         */
        firstAuthStep: function () {
            var t = this;
            var postData = {
                customerId: $("#sesCustomerId").val(),
                isCustomer: 1
            };
            postData = {
                paramJson: $.toJSON(postData)
            };
            //-1 是注册用户以及提交了基本信息的用户
            //3 是V1审核拒绝的用户，仅有这两种用户可以选择角色
            if (t.customerAuth.state === -1 || t.customerAuth.state === 3) {
                setTimeout(function () {
                    g_sps && g_sps.createBrowse({pageId: 484});
                }, 2200);
                //1）角色选择
                $("#roleSelectStep").show();
                //选择医生角色,identity = 1
                $("#roleDoctor").off('click').on('click', function () {
                    comm.creatEvent({
                        triggerName: '医生',
                        triggerType: "角色选择页",
                        browType: '395',
                        actionId: 11694,
                    });
                    //强制更新用户信息
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

                                //获取性别，不知道为啥要把性别单独写到这个接口。。。
                                $.ajax({
                                    url: t.path.getMapById,
                                    data: postData,
                                    type: 'post',
                                    dataType: 'json',
                                    success: function (data) {
                                        if (data && data.responseObject.responseData && data.responseObject.responseData.data_list && data.responseObject.responseData.data_list.length > 0) {
                                            t.customerAuth.sex = data.responseObject.responseData.data_list["0"].customer_baseinfo.sex;
                                            $("#roleSelectStep").hide();
                                            //2）基本信息填写
                                            t.identity = 1;
                                            t.baseInfoAuthStep();
                                        }
                                    }
                                });
                            }
                        }
                    });
                });
                //选择护士角色,identity = 2
                $("#roleNurse").off('click').on('click', function () {
                    comm.creatEvent({
                        triggerName: '护士',
                        triggerType: "角色选择页",
                        browType: '395',
                        actionId: 11695,
                    });
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
                                //请求用户性别
                                $.ajax({
                                    url: t.path.getMapById,
                                    data: postData,
                                    type: 'post',
                                    dataType: 'json',
                                    success: function (data) {
                                        if (data && data.responseObject.responseData && data.responseObject.responseData.data_list && data.responseObject.responseData.data_list.length > 0) {
                                            t.customerAuth.sex = data.responseObject.responseData.data_list["0"].customer_baseinfo.sex;
                                            //强制更新用户信息
                                            $("#roleSelectStep").hide();
                                            //2）基本信息填写
                                            t.identity = 2;
                                            t.baseInfoAuthStep();
                                        }
                                    }
                                });

                            }
                        }
                    });
                });
            }
            else {
                //未选择任何角色，identiey=0,是为了识别用户是否有点击对应的角色选择
                t.identity = 0;
                t.baseInfoAuthStep();
            }

        },
        /**
         * 功能描述：获取基本信息
         * 参数说明：
         * 1、获取职称数据：需要传参 identity
         *      identity:0 --表示获取所有职称数据
         *      identity:1 --表示获取医生/医学生的职称数据
         *      identity:2 --表示获取护士的职称数据
         *
         * 注意事项：
         *
         * Create by YaoQiao on 2019/3/15
         */
        baseInfoAuthStep: function () {
            var t = this;
            var userRoleType = 1;
            var _customerRole = TempCache.getItem("customerRole");
            if (_customerRole == '12' || t.identity == 2 || t.medicalID == 11 || t.medicalID == 12 || t.medicalID == 13 || t.medicalID == 14 || t.medicalID == 15) {
                userRoleType = 2;
            }
            setTimeout(function () {
                g_sps && g_sps.createBrowse({pageId: 436,param:{userRoleType:userRoleType}});
            }, 2200);
            t.browType = 10001;
            comm.areaData = {1: [], 2: []};
            var auth = t.customerAuth;
            $("#firstStep").show();
            $("#fullName").val(auth.lastName + auth.firstName);//姓名
            $("#company").val(auth.company).attr('companyId', auth.companyId);//医院
            $("#schoolName").val(auth.schoolName).attr('schoolId', auth.schoolId); //学校

            //性别选择
            $(".ev-onUnit").off('click').on("click", function () {
                if (!$(this).find("i").hasClass('al-tableRadioOn')) {
                    if ($(this).hasClass('ev-sex')) {
                        //性别
                        t.sexId = $(this).attr('unittype');
                        t.sex = ($(this).text()).replace(/\s/g, "");
                    }
                    $(this).parent().find("i").removeClass("al-tableRadioOn");
                    $(this).find("i").addClass("al-tableRadioOn");
                    t.submitConfig();
                }
            });
            //性别  默认男
            if (auth.sex == '女') {
                $(".ev-onUnit").eq(1).click();
            } else {
                $(".ev-onUnit").eq(0).click();
            }
            //职称初始化,根据不同角色获取不同职称数据
            t.medicalInit(auth.medicalTitle);
            //单位联想
            $("#company").lenovo({
                width: 292,
                url: t.path.hospital,
                showName: "hospitalName", //显示出的值
                id: "id",   //自定义属性值
                hiddenId: "companyId"    //自定义属性
            });

            //学校联想
            $("#schoolName").lenovo({
                width: 292,
                url: t.path.university,
                showName: "schoolName",
                id: "id",//自定义属性值
                hiddenId: "schoolId"//自定义属性
            });
            //清空单位和学校ID
            // $("#schoolName,#company").on('keyup', function () {
            //     $(this).val($(this).val().replace(/[^\u4e00-\u9fa5\dA-Za-z]/g, ''));
            //     if ($(this).attr('schoolid')) {
            //         $(this).attr('schoolid', '')
            //     } else if ($(this).attr('companyid')) {
            //         $(this).attr('companyid', '')
            //     }
            //
            // });
            var cpLock = true;
            $("#schoolName,#company").on({
                compositionstart: function () {//中文输入开始
                    cpLock = false;
                },
                compositionend: function () {//中文输入结束
                    cpLock = true;
                },
                input: function () {//input框中的值发生变化
                    if (cpLock)
                        $(this).val($(this).val().replace(/[^\u4e00-\u9fa5\dA-Za-z]/g, ''));
                    if ($(this).attr('schoolid')) {
                        $(this).attr('schoolid', '')
                    } else if ($(this).attr('companyid')) {
                        $(this).attr('companyid', '')
                    }
                }
            });
            $("#firstStep input").on("input change propertychange copy cut paste keyup", function () {
                t.submitConfig();
            });
            t.checkName();
            t.submitConfig();
            t.firstSubmit();
        },
        //名字实时校验
        checkName: function () {
            // $('#fullName').on('keyup', function () {
            //     $('#name_error').hide();
            //     var thisVal = $(this).val();
            //     if (thisVal) {
            //         $(this).val(thisVal.replace(/[^\u4e00-\u9fa5\sA-Za-z]/g, ''));
            //         $(this).val($(this).val().replace(/^[\s]/, ''));
            //         if (comm.getByteLen(thisVal) > 50) {
            //             $(this).val(thisVal.substring(0,50));
            //         }
            //     }
            // });
            var cpLock = true;
            $('#fullName').on({
                compositionstart: function () {//中文输入开始
                    cpLock = false;
                },
                compositionend: function () {//中文输入结束
                    cpLock = true;
                },
                input: function () {//input框中的值发生变化
                    $('#name_error').hide();
                    var thisVal = $(this).val();
                    if (thisVal && cpLock) {
                        $(this).val(thisVal.replace(/[^\u4e00-\u9fa5\sA-Za-z]/g, ''));
                        $(this).val($(this).val().replace(/^[\s]/, ''));
                        if (comm.getByteLen(thisVal) > 50) {
                            $(this).val(thisVal.substring(0, 50));
                        }
                    }
                }
            });
        },
        //职称初始化
        medicalInit: function (medical) {
            var t = this;
            // 为了兼容老数据，因为某个时间段（似乎是2.7版本）是允许同一个用户有多个职称，现在是仅允许有一个职称
            var medical1 = medical ? medical.split(",") : [];
            var medicalTitle = "";
            var ids = '';
            $.each(medical1, function (i, val) {
                if (val && i == 0) {
                    if (val.split("_")[1]) {
                        ids = val.split("_")[0];
                        medicalTitle = val.split("_")[1];
                    } else {
                        medicalTitle = val;
                    }
                }
            });
            //动态获取职称数据
            $.ajax({
                url: t.path.medical,
                type: 'GET',
                dataType: 'json',
                success: function (data) {
                    var str = '';
                    //由于PC和H5获取职称的数据不一样，所以PC这边都是自己去主动筛选对应的职称数据
                    //通过接口返回数据来看，data["1"] 表示的是医生/医学生的职称
                    // data["4"] 表示的是护士的职称

                    if (t.identity === 1) {
                        $.each(data['1'], function (i, e) {
                            str += '<li class="medicalItem" data-id="' + e.id + '">' + e.medicalTitle + '</li>'
                        });
                    }
                    else if (t.identity === 2 || (ids && ((ids == 11 || ids == 12 || ids == 13 || ids == 14 || ids == 15)))) {
                        $.each(data['4'], function (i, e) {
                            str += '<li class="medicalItem" data-id="' + e.id + '">' + e.medicalTitle + '</li>'
                        });
                    }//默认为医生/医学生的职称吧，后续有其他角色再继续拆分，避免数据异常，导致逻辑不通
                    else {
                        $.each(data['1'], function (i, e) {
                            str += '<li class="medicalItem" data-id="' + e.id + '">' + e.medicalTitle + '</li>'
                        });
                    }
                    $('.ev-medicalConer').html(str);
                    $('#ev-medicalPar').off('click').on('click', function (e) {
                        if ($(e.target).hasClass('medicalItem')) {
                            $('.ev-medicalConer').hide();
                            $('#ev-medicalPar').removeClass('selectForce');
                            $('#ev-medTitle').attr('data-id', $(e.target).attr('data-id')).removeClass("al-selectDefault").find('.selectText').val($(e.target).text());
                            if ($(e.target).attr('data-id') == 10) {
                                $('.ev-shoolCon').show();
                                $('.ev-companyCon').hide();
                            } else {
                                $('.ev-companyCon').show();
                                $('.ev-shoolCon').hide();
                            }
                            t.submitConfig();
                        } else if ($(e.target).attr('id') == 'ev-medTitle' || $(e.target).hasClass('selectText')) {
                            $('.ev-medicalConer').toggle();
                            $(e.target).parents('#ev-medicalPar').addClass('selectForce');
                        }
                    });
                }
            });
            //如果有职称，如果角色由医生变为护士时，需要清空原有数据，并默认选中护士职称
            if (medical) {
                var _customerRole = TempCache.getItem("customerRole");
                //医生/医学生变为护士，都需要清空原有数据，但是保留默认的职称选择数据
                // identity === 2 表示的是选择角色时，选择了护士
                //  _customerRole 为5时，表示当前用户角色为医生角色，其中 5 也可能是护士角色，因为没有被认证时，customerRole 不会变，因此需要下一步判断
                //当选择了护士角色，且当前角色的customerRole为5时，
                //如果原职称不是护士相关的职称，则进行清空，并默认处理选择护士职称
                //医生职称 ：1_住院医师；2_主治医师；3_副主任医师；4_主任医师；10_医学生
                if (t.identity === 2 && _customerRole === "5" && (ids == 1 || ids == 2 || ids == 3 || ids == 4 || ids == 10)) {
                    $("#fullName").val("");//清空姓名
                    $("#company").val("").attr('companyId', "");//清空医院
                    $("#schoolName").val("").attr('schoolId', ""); //清空学校
                    $(".ev-onUnit").eq(0).click(); //默认性别选男
                    //默认选择护士
                    medicalTitle = "护士";
                    ids = "11"
                    $("#ev-medTitle").removeClass("al-selectDefault")
                        .attr("data-id", ids)
                        .find('.selectText').val(medicalTitle);
                    $('.ev-companyCon').show();
                    $('.ev-shoolCon').hide();
                }
                //护士变为医生/医学生，需要清空原有数据，同时没有默认的职称选择数据
                //如果 customerRole == 5,且原来是护士职称，则也应该清空
                //护士职称：11_护士；12_护师；13_主管护师；14_副主任护师；15_主任护师
                else if (t.identity === 1 && _customerRole === "5" && (ids == 11 || ids == 12 || ids == 13 || ids == 14 || ids == 15)) {
                    $("#fullName").val("");//清空姓名
                    $("#company").val("").attr('companyId', "");//清空医院
                    $("#schoolName").val("").attr('schoolId', ""); //清空学校
                    $(".ev-onUnit").eq(0).click(); //默认性别选男
                    //没有默认选择
                    $("#ev-medTitle").addClass("al-selectDefault")
                        .attr("data-id", "")
                        .find('.selectText').val("");
                }//选择更改的角色和已有角色一致，则默认显示即可
                else {
                    //这里的逻辑也是为了兼容老数据
                    //因为有时返回的medicalTitle字段只有“1_住院医师”，而有时只返回“住院医师”，此时需要从medicalTitleId字段获取id
                    //但是并不能完全依赖medicalTitleId字段，因为有时这个字段又没有值，所以需要用以下方法做兼容
                    //ids==10 是为了判断如果是医学生，则单位会变成学校名称
                    $("#ev-medTitle").removeClass("al-selectDefault")
                        .attr("data-id", ids)
                        .find('.selectText').val(medicalTitle);
                    if (ids) {
                        if (ids == 10) {
                            $('.ev-shoolCon').show();
                            $('.ev-companyCon').hide();
                        } else {
                            $('.ev-companyCon').show();
                            $('.ev-shoolCon').hide();
                        }
                    } else {
                        $("#ev-medTitle").attr("data-id", t.customerAuth.medicalTitleId)
                    }
                }
            }// 如果没有职称，但当前选择的角色是护理角色，则默认选中护士职称，医生/医学生角色不给予默认选中
            else {
                //没有默认选择
                $("#ev-medTitle").addClass("al-selectDefault")
                    .attr("data-id", "")
                    .find('.selectText').val("");

                if (t.identity === 2) {
                    medicalTitle = "护士";
                    ids = "11"
                    $("#ev-medTitle").removeClass("al-selectDefault")
                        .attr("data-id", ids)
                        .find('.selectText').val(medicalTitle);
                    $('.ev-companyCon').show();
                    $('.ev-shoolCon').hide();
                }
            }
        },
        //取消点击
        cancel: function () {
            var t = this;
            $(".ev-authCancel").off('click').on("click", function () {
                $("#secondStep").hide();
                if ($('.ev_exceptionMain').attr('data-isShow')) {
                    $('.ev_exception,.ev_exceptionMain').show();
                } else {
                    $("#firstStep").show();
                }

            })
            // $(".ev-authCancel").off('click').on("click", function () {
            //
            //     if($("#secondStep").css('display')=='block'){
            //         $("#firstStep").show();
            //         $("#secondStep").hide();
            //     }else {
            //         if(t.para.isCustomerInfo){
            //             $.makeSurePopup({
            //                 title:"",
            //                 content01:"确认放弃认证变更吗？",//弹窗标题
            //                 content:"现在放弃将丢失已修改的内容",//弹窗内容
            //                 ensure:"放弃",//确认按钮文字内容 默认 “确认”
            //                 cancel:"继续认证",//取消按钮文字内容 默认 “取消”
            //                 ensureClass:'al-msgDeleteConfirm',//确认按钮class
            //                 cancelClass:'al-msgDeleteCancel',
            //                 callback:function(){
            //                     history.back(-1);
            //                 }
            //             });
            //         }
            //     }
            //
            // })
        },
        //第一步提交
        firstSubmit: function () {
            var t = this;
            $("#ev-next").off('click').on("click", function () {

                if ($(this).attr("submit") == "true") {
                    if ((!/^[\u4e00-\u9fa5\sA-Za-z]/.test($("#fullName").val())) || comm.getByteLen($("#fullName").val()) > 50) {
                        $('#name_error').show().html('<i>!</i>请输入正确的姓名');
                        return false;
                    }
                    t.medicalID = $("#ev-medTitle").attr('data-id');
                    var company, companyId, schoolName, schoolId;
                    if (t.medicalID == 10) {
                        //学校
                        schoolName = $('input[name=schoolName]').val();
                        schoolId = $('input[name=schoolName]').attr("schoolId");
                    }
                    else {
                        //医院
                        company = $('input[name=company]').val();
                        companyId = $('input[name=company]').attr("companyId");
                    }
                    var data = {
                        customerId: $('#sesCustomerId').val(),
                        opflag: 1,//认证第一步
                        fullName: $("#fullName").val(),//名字
                        sexId: t.sexId,//姓别ID
                        sex: t.sex,//姓别
                        company: company || '',//单位
                        companyId: companyId || '',//单位ID
                        schoolName: schoolName || '',//学校
                        schoolId: schoolId || '',//学校ID
                        medicalTitleId: $("#ev-medTitle").attr('data-id'),
                        medicalTitle: $("#ev-medTitle").attr('data-id') + '_' + $("#ev-medTitle").find('.selectText').val(),//职称
                        authSource: '',
                        authWay: ''
                    }, url = t.path.renzhengSubmit;
                    //判断是新认证，还是申请变更，如果t.para.isCustomerInfo 有值，则为申请变更。两者参数和接口不一样
                    if (t.para.isCustomerInfo) {
                        data = {
                            customerId: $('#sesCustomerId').val(),
                            opflag: 1,//认证第一步
                            updateFullName: $("#fullName").val(),//名字
                            updateSexId: t.sexId,//姓别ID
                            updateSex: t.sex,//姓别
                            updateWorkplaceType: t.medicalID != 10 ? 1 : 2,//单位
                            updateWorkplaceId: t.medicalID != 10 ? (companyId || '') : (schoolId || ''),//单位ID
                            updateWorkplace: t.medicalID != 10 ? company : schoolName,//学校
                            updateMedicalTitle: $("#ev-medTitle").attr('data-id') + '_' + $("#ev-medTitle").find('.selectText').val(),//职称
                        };
                        url = t.path.create;
                    }
                    var param = {};
                    param.paramJson = $.toJSON(data);
                    comm.LightBox.showloading();
                    $.ajax({
                        url: url,
                        cache: false,
                        data: param,
                        dataType: 'json',
                        type: "POST",
                        success: function (data) {
                            comm.LightBox.hideloading();
                            $("#ev-next").attr("submit", "true");
                            if (data.responseObject.responseStatus) {
                                //comm.authInfo=null;
                                TempCache.removeItem("authInfo");
                                $("#firstStep").hide();
                                if (t.para.isCustomerInfo) {
                                    t.reviseId = data.responseObject.responsePk;
                                    t.secondAuthStep();
                                } else {
                                    if (t.medicalID == 10) {
                                        t.secondAuthStep();
                                    } else {
                                        t.checkCustomer({
                                            customerId: $('#sesCustomerId').val(),
                                            visitSiteId: 1,
                                            customerName: $("#fullName").val(),
                                            companyId: companyId || 0,
                                            companyName: company || 0,
                                        })
                                    }
                                }
                            }
                            else {
                                if (data.responseObject.responseMessage) {
                                    $.topTip({mark: "warn", content: data.responseObject.responseMessage});
                                } else {
                                    $.topTip({mark: "warn", content: "提交认证失败，请稍后重试"});
                                }
                            }
                        },
                        error: function (XMLHttpRequest, textStatus, errorThrown) {
                            alert(textStatus + "   " + errorThrown);
                        }
                    });
                    var userRoleType = 1;
                    var _customerRole = TempCache.getItem("customerRole");
                    if (_customerRole == '12' || t.identity == 2 || t.medicalID == 11 || t.medicalID == 12 || t.medicalID == 13 || t.medicalID == 14 || t.medicalID == 15) {
                        userRoleType = 2;
                    }
                    comm.creatEvent({
                        triggerName: '下一步',
                        triggerType: "认证-基本信息",
                        browType: '10001',
                        actionId: 2505,
                        userRoleType:userRoleType
                    });
                } else {
                    // if(!$("#fullName").val()){
                    //     $("#name_error").show();
                    // }
                    // if($("#ev-medTitle").text()=='请选择'){
                    //     $('#med_error').show();
                    // }
                    // if($("#ev-medTitle").attr('data-id')!=10){
                    //     if(!$('input[name=company]').val()){
                    //         $('#onUnit_error').show();
                    //     }
                    // }else {
                    //     if(!$('input[name=company]').val()){
                    //         $('#company_error').show();
                    //     }
                    // }
                }
            })
        },
        //账号异常判断
        checkCustomer: function (option) {
            var t = this;
            $.ajax({
                url: t.path.checkCustomerV3,
                type: 'post',
                data: {
                    paramJson: JSON.stringify({
                        customerId: option.customerId,
                        visitSiteId: 1,
                        customerName: option.customerName,
                        companyId: option.companyId,
                        companyName: option.companyName,
                    })
                },
                dataType: 'json',
                success: function (data) {
                    if (data && data.responseObject && data.responseObject.responseData && data.responseObject.responseData.dataList) {
                        var isHaveSameAccount = data.responseObject.responseData.dataList.isHaveSameAccount;
                        t.haveSameAccount = data.responseObject.responseData.dataList;
                        if (parseInt(isHaveSameAccount)) {//异常
                            exception({
                                sameAccount: data.responseObject.responseData.dataList,
                                continueAuth: function () {
                                    t.secondAuthStep()
                                }
                            });
                            $('.ev_exceptionMain').attr('data-isShow', true);
                            var userRoleType = 1;
                            var _customerRole = TempCache.getItem("customerRole");
                            if (_customerRole == '12' || t.identity == 2 || t.medicalID == 11 || t.medicalID == 12 || t.medicalID == 13 || t.medicalID == 14 || t.medicalID == 15) {
                                userRoleType = 2;
                            }
                            setTimeout(function () {
                                g_sps && g_sps.createBrowse({pageId: 487,param:{userRoleType:userRoleType}});
                            }, 2200);
                        } else {
                            t.secondAuthStep();
                        }
                    } else {
                        t.secondAuthStep();
                    }
                }
            })
        },
        //第二步
        secondAuthStep: function () {
            var t = this;
            /*comm.Log.createBrowse({
                href: location.href,
                id: 10014,
                name: "认证第二步",
                platformId: $('#sesDepartment').val(),
                noTimeOut: 1
            });*/
            var userRoleType = 1;
            var _customerRole = TempCache.getItem("customerRole");
            if (_customerRole == '12' || t.identity == 2 || t.medicalID == 11 || t.medicalID == 12 || t.medicalID == 13 || t.medicalID == 14 || t.medicalID == 15) {
                userRoleType = 2;
            }
            setTimeout(function () {
                g_sps && g_sps.createBrowse({pageId: 438,param:{userRoleType:userRoleType}});
            }, 2200);
            t.browType = 10014;
            $("#firstStep").hide();
            $("#secondStep").show();
            t.delAttIdList = [];
            t.getTipSecond();
            t.dataRoleConfigs();
            comm.ieAlert("", '继续看看在说', '', true);
        },
        //第二步提交
        secondAuthSubmit: function () {
            var t = this;
            $("#ev-thirdNext").off('click').on("click", function () {
                var userRoleType = 1;
                var _customerRole = TempCache.getItem("customerRole");
                if (_customerRole == '12' || t.identity == 2 || t.medicalID == 11 || t.medicalID == 12 || t.medicalID == 13 || t.medicalID == 14 || t.medicalID == 15) {
                    userRoleType = 2;
                }
                var indexUp = 0;
                comm.creatEvent({
                    triggerName: '提交',
                    triggerType: "认证-证件信息",
                    browType: '10014',
                    actionId: 2513,
                    userRoleType:userRoleType
                });
                $.each($('.ev-upload .loadingAnimate'), function (i, ele) {
                    if ($(ele).css('display') == 'block') {
                        $.topTip({mark: "warn", content: "图片正在上传中，请稍后"});
                        indexUp++;
                    }
                });
                if (indexUp) {
                    return false;
                }
                if ($(this).attr("on") == "true") {
                    $(this).attr("on", "false");
                    var authAttList = [];
                    $.each($('.ev-attType'), function (index, ele) {
                        $.each($(ele).find('.certificatesPath'), function (indexC, eleC) {
                            if ($(eleC).val()) {
                                authAttList.push({
                                    attType: $(ele).find('.ev-dataAttType').attr('data-attType'),
                                    attPath: $(eleC).val() != $(eleC).attr('data-oldpath') ? $(eleC).val() : '',
                                    // attCode: $(ele).find('.attCode').val() ? $(ele).find('.attCode').val() : '',//以后需要证件号时再打开
                                    attPositionType: indexC + 1,
                                    isUpdate: $(eleC).attr('data-id') ? 1 : 0,
                                    id: $(eleC).attr('data-id') ? $(eleC).attr('data-id') : '_'
                                });
                            }
                        });
                    });
                    var data = {}, url = t.path.renzhengSubmit;
                    if (t.para.isCustomerInfo) {
                        var attList = [];
                        $.each($('.ev-attType'), function (index, ele) {
                            $.each($(ele).find('.certificatesPath'), function (indexC, eleC) {
                                if ($(eleC).attr('data-oldpath') || $(eleC).val()) {
                                    var oldpath, newpath;
                                    if ($(eleC).attr('data-oldpath')) {
                                        oldpath = $(eleC).attr('data-oldpath').split('.');
                                    }
                                    if ($(eleC).val()) {
                                        newpath = $(eleC).val().split('.');
                                    }
                                    attList.push({
                                        attType: $(ele).find('.ev-dataAttType').attr('data-attType'),
                                        attPath: $(eleC).attr('data-oldpath'),
                                        // attCode: $(ele).find('.attCode').attr('data-oldcode') ? $(ele).find('.attCode').attr('data-oldcode') : '',//以后需要证件号时再打开
                                        attFormat: oldpath ? (oldpath[oldpath.length - 1]) : '',
                                        updateAttType: $(ele).find('.ev-dataAttType').attr('data-attType'),
                                        updateAttPath: $(eleC).val(),
                                        // updateAttCode: $(ele).find('.attCode').val() ? $(ele).find('.attCode').val() : '',//以后需要证件号时再打开
                                        attPositionType: indexC + 1,
                                        updateAttFormat: newpath ? (newpath[newpath.length - 1]) : ''
                                    });
                                }
                            });
                        });
                        data = {
                            reviseId: t.reviseId,
                            customerId: $('#sesCustomerId').val(),
                            attList: JSON.stringify(attList),
                            opflag: 2
                        };
                        url = t.path.revise;
                    }
                    else {
                        if (t.haveSameAccount && parseInt(t.haveSameAccount.isHaveSameAccount)) {
                            data = {
                                customerId: $('#sesCustomerId').val(),
                                delAttIdList: t.delAttIdList.join(','),
                                authAttList: JSON.stringify(authAttList),
                                opflag: 2,
                                isCompleted: 0,
                                isMerge: 1,
                                mainCustomerId: localStorage.getItem('userId'),
                                mergeCustomerId: t.haveSameAccount.customerId
                            };
                        } else {
                            data = {
                                customerId: $('#sesCustomerId').val(),
                                delAttIdList: t.delAttIdList.join(','),
                                authAttList: JSON.stringify(authAttList),
                                opflag: 2,
                                isCompleted: 0
                            };
                        }

                    }
                    var param = {paramJson: $.toJSON(data)};
                    comm.LightBox.showloading();
                    $.ajax({
                        url: url,
                        cache: false,
                        data: param,
                        dataType: 'json',
                        type: "POST",
                        success: function (data) {
                            comm.LightBox.hideloading();
                            if (data && data.responseObject && data.responseObject.responseStatus) {
                                comm.authInfo = null;
                                t.end();
                            } else {
                                if (data && data.responseObject && data.responseObject.responseMessage) {
                                    $.topTip({mark: "warn", content: data.responseObject.responseMessage});
                                } else {
                                    $.topTip({mark: "warn", content: "提交认证失败，请稍后重试"});
                                }
                            }
                        },
                        error: function (XMLHttpRequest, textStatus, errorThrown) {
                            alert(textStatus + "   " + errorThrown);
                        }
                    });


                }
                else {
                    if ($('html').attr('emptyAttCode')) {
                        var emptyAttCode = ($('html').attr('emptyAttCode')).split(' ')[1];
                        $(window).scrollTop($('.' + emptyAttCode).offset().top);
                        $.topTip({
                            mark: "warn",
                            content: "请完整填写" + $('.ev-dataAttType span', $('.' + emptyAttCode)).eq(0).text() + "后再提交"
                        });
                    } else {
                        return false;
                    }
                }
            })
        },
        //获取提示信息
        getTipSecond: function () {
            var t = this;
            comm.LightBox.showloading();
            //根据现有用户的角色选择，来获取不同的认证提示，t.
            //如果当前用户没有进行角色选择，则根据其 customerRole 来进行判断，如果 customerRole == 12 ，则为护士，获取护士的提示值
            var scene = 2; // 默认取医生的认证提示
            if (TempCache.getItem("customerRole") === "12" || (t.identity && t.identity === 2)) {
                scene = 6;
            }
            $.ajax({
                url: t.path.promptMessage,
                type: 'post',
                dataType: 'json',
                data: {
                    paramJson: JSON.stringify({
                        scene: scene,
                        isValid: 1,
                        promptCondition: 0
                    })
                },
                success: function (data) {
                    comm.LightBox.hideloading();
                    if (data && data.responseObject && data.responseObject.responseData && data.responseObject.responseData) {
                        var promptMessage = data.responseObject.responseData.promptMessage;
                        if (promptMessage.indexOf('@=@') > -1) {
                            $('.ev-seStepTitle').find('h3').text(promptMessage.split('@=@')[0]);
                            $('.ev-seStepTitle').find('p').text('(' + promptMessage.split('@=@')[1] + ')');
                        } else {
                            $('.ev-seStepTitle').find('h3').text(promptMessage);
                            $('.ev-seStepTitle').find('p').text('');
                        }
                    }
                }
            })
        },
        //获取证件名称
        dataRoleConfigs: function () {
            var t = this;
            var demoImg = [];//存放示例图片
            // 1-身份证6-医师资格证8-医师执业证7-医学学位证11-工作证12-学生证10工作证(学生证)13-医师职称证书9-医学学历证
            // 15-护士执业证，16-专业技术资格证
            demoImg[8] = ['pic_zhiye1.png', 'pic_zhiye2.png'];
            demoImg[6] = ['pic_zige1.png', 'pic_zige2.png'];
            demoImg[13] = ['pic_zhicheng.png'];
            demoImg[10] = ['pic_work.png'];
            demoImg[11] = t.identity === 2 ? ['pic_work_nurse.png'] : ['pic_work.png'];//护士角色的工作证和医生的不一样
            demoImg[12] = ['pic_student.png'];
            demoImg[7] = ['pic_xuewei.png'];
            demoImg[9] = ['pic_xueli.png'];
            demoImg[1] = ['pic_id1.png', 'pic_id2.png'];
            demoImg[15] = ['pic_nurse_zhiye1.png', 'pic_nurse_zhiye2.png'];//护士执业证，正反两面
            demoImg[16] = ['pic_nurse_zige.png'];//护士专业技术资格证
            var postData = {
                "isValid": 2,
                "visitSiteId": 1,
                medicalTitleId: t.medicalID
            };
            postData = {paramJson: $.toJSON(postData)};
            comm.LightBox.showloading();
            $.ajax({
                url: t.path.getDataRoleConfigs,
                dataType: "json",
                type: "post",
                data: postData,
                success: function (data) {
                    comm.LightBox.hideloading();
                    if (data && data.responseObject && data.responseObject.responseData.data_list && data.responseObject.responseData.data_list.length > 0) {
                        var roleConfigsStr = '', roleIdStr = '';
                        $.each(data.responseObject.responseData.data_list, function (index, ele) {
                            var refId = ele.refId;
                            if (refId == 6 || refId == 8 || refId == 1 || refId == 15) {//有证件编号
                                roleConfigsStr += t.attcodeDom({
                                    refId: refId,
                                    refValue: ele.refValue,
                                    demoImg: demoImg
                                });
                            } else {
                                roleConfigsStr += ' <section class="ev-attType ev-imgAtt' + refId + '">' +
                                    '            <section class="authInput ev-dataAttType" data-attType="' + refId + '">' +
                                    '                <span class="typeTitle">' + ele.refValue + '</span>' +
                                    '                 <div class="typeTip" style="display: none"><i>!</i><span>未通过</span></div>' +
                                    '            </section>' +
                                    '                 <section class="typeAttCon"><p class="typeAtt">证件照片<span>根据示例上传证件</span></p></section>' +
                                    '            <section class="authInput padding108">' +
                                    '                <figure class="al-tableItemContent">' +
                                    '                    <aside class="uploadImg ev-cerUploadCon">' +
                                    '                        <input type="hidden" value="" name="certificatesPath" class="certificatesPath" />' +
                                    '                        <div class="photoCont">' +
                                    '                            <figure><img src="/images/img10/authentication/certificate/' + demoImg[refId][0] + '"><div class="sample">示例</div></figure>' +
                                    '                            <!--上传后的图片 上传中添加类名 uploading-->' +
                                    '                            <figure class="uploadSuccess cer_upload">' +
                                    '                                <div class="czyx1">' +
                                    '                                    <div class="ev-upload hide">' +
                                    '                                        <!--蒙层-->' +
                                    '                                        <div class="uploadPopup">' +
                                    '                                            <p class="hide">上传失败<br/>' +
                                    '                                                请重新上传</p>' +
                                    '                                            <figure class="percentage loadingAnimate hide">' +
                                    '                                                <img src="//img10.allinmd.cn/v3/common/icon/icon_uploading.png">' +
                                    '                                                <span>0%</span>' +
                                    '                                            </figure>' +
                                    '                                        </div>' +
                                    '                                        <!--关闭按钮-->' +
                                    '                                        <div class="popupClose hide"></div>' +
                                    '                                    </div>' +
                                    // '                                    <input class="cer_po_input" type="file" name="file">' +
                                    '                                </div>' +
                                    '                            </figure>' +
                                    '                        </div>' +
                                    '                        <figure class="uploadPhoto">' +
                                    '                            <i></i>' +
                                    '                            <p>上传证件照</p>' +
                                    '                        </figure>' +
                                    '                        <div class="l_warning photo_error"><img src="//img10.allinmd.cn/v3/common/icon/error_tips.png"><span><label>请上传证件照片！</label></span></div>' +
                                    '                    </aside>' +
                                    '                </figure>' +
                                    '            </section>' +
                                    '              <div class="attLine"></div>' +
                                    '        </section>';

                            }
                            $('.ev-container').html(roleConfigsStr + roleIdStr);
                        });
                        t.secondInformation();
                        t.uploadAtt();
                        t.secondAuthSubmit();
                        t.secondSubmit();
                        $("#secondStep .attLine").eq($("#secondStep .attLine").length - 1).hide();
                        $("#secondStep .attCode").on("keyup", function () {
                            t.secondSubmit();
                            $(this).val($(this).val().replace(/[^0-9a-zA-Z]/g, ''));
                            if (($(this).val()).length > 50) {
                                $(this).val($(this).val().substr(0, 50));
                            }
                            // if ($(this).parents('.ev-attType').hasClass('ev-imgAtt1')) {
                            //     $(this).val($(this).val().replace(/[^0-9xX]/g, ''));
                            //     if (($(this).val()).length > 18) {
                            //         $(this).val($(this).val().substr(0, 18));
                            //     }
                            // }
                        });
                    }
                }
            });
        },
        //有证件编号的DOm
        attcodeDom: function (option) {
            var str = '<section class="ev-attType ev-imgAtt' + option.refId + '">' +
                '            <section class="authInput ev-dataAttType" data-attType="' + option.refId + '">' +
                '                <span class="typeTitle">' + option.refValue + '</span>' +
                '                 <div class="typeTip" style="display: none"><i>!</i><span>未通过</span></div>' +
                '            </section>' +
                '            <section class="authInput ev-attCodePar padding108 certificatesNum">' +
                // '                <span>证件编号</span>' +
                // '                <figure class="al-tableItemContent documentNum">' +
                // '                    <input type="text" name="attCode" class="attCode" placeholder="请输入证件编号"/>' +
                // '                </figure>' +
                // '                <p class="al-tableErrorTips attCode_error"  style="right:-90px"><i></i>请填写正确的证件号码！</p>' +
                '                 <p class="typeAtt">证件照片<span>根据示例上传证件</span></p>' +
                '            </section>' +
                '            <section class="authInput padding108">' +
                '                <figure class="al-tableItemContent">' +
                '                    <aside class="uploadImg ev-cerUploadCon">' +
                '                        <input type="hidden" value="" name="certificatesPath" class="certificatesPath" />' +
                '                        <div class="photoCont">' +
                '                            <figure><img src="/images/img10/authentication/certificate/' + option.demoImg[option.refId][0] + '">' +
                '                                <div class="sample">' + ((option.refId == 6 || option.refId == 8) ? '第一页示例' : '示例') + '</div>' +
                '                            </figure>' +
                '                            <!--上传后的图片 上传中添加类名 uploading-->' +
                '                            <figure class="uploadSuccess cer_upload">' +
                '                                <div class="czyx1">' +
                '                                    <div class="ev-upload hide">' +
                '                                        <!--蒙层-->' +
                '                                        <div class="uploadPopup">' +
                '                                            <p class="hide">上传失败<br/>' +
                '                                            请重新上传</p>' +
                '                                            <figure class="percentage loadingAnimate hide">' +
                '                                                <img src="//img10.allinmd.cn/v3/common/icon/icon_uploading.png">' +
                '                                                <span>0%</span>' +
                '                                            </figure>' +
                '                                        </div>' +
                '                                        <!--关闭按钮-->' +
                '                                        <div class="popupClose hide"></div>' +
                '                                    </div>' +
                // '                                    <input class="cer_po_input" type="file" name="file">' +
                '                                </div>' +
                '                            </figure>' +
                '                        </div>' +
                '                        <figure class="uploadPhoto">' +
                '                            <i></i>' +
                '                            <p>上传证件照</p>' +
                '                        </figure>' +
                '                        <div class="l_warning photo_error"><img src="//img10.allinmd.cn/v3/common/icon/error_tips.png"><span><label>请上传证件照片！</label></span></div>' +
                '                    </aside>' +
                (function () {
                    var str = '';
                    if (option.refId == 6 || option.refId == 8 || option.refId == 1 || option.refId == 15) {
                        str = '<aside class="uploadImg ev-cerUploadCon">' +
                            '        <input type="hidden" value="" name="certificatesPath" class="certificatesPath" />' +
                            '         <div class="photoCont">' +
                            '             <figure><img src="/images/img10/authentication/certificate/' + option.demoImg[option.refId][1] + '"><div class="sample">' + ((option.refId == 6 || option.refId == 8) ? '第二页示例' : '示例') + '</div></figure>' +
                            '             <!--上传后的图片 上传中添加类名 uploading-->' +
                            '             <figure class="uploadSuccess cer_upload">' +
                            '                 <div class="czyx1">' +
                            '                     <div class="ev-upload hide">' +
                            '                         <!--蒙层-->' +
                            '                         <div class="uploadPopup">' +
                            '                             <p class="hide">上传失败<br/>' +
                            '                                 请重新上传</p>' +
                            '                             <figure class="percentage loadingAnimate hide">' +
                            '                                 <img src="//img10.allinmd.cn/v3/common/icon/icon_uploading.png">' +
                            '                                 <!--<span>20%</span>-->' +
                            '                             </figure>' +
                            '                         </div>' +
                            '                         <!--关闭按钮-->' +
                            '                         <div class="popupClose hide"></div>' +
                            '                     </div>' +
                            // '                     <input class="cer_po_input" type="file" name="file">' +
                            '                 </div>' +
                            '             </figure>' +
                            '         </div>' +
                            '         <figure class="uploadPhoto">' +
                            '             <i></i>' +
                            '             <p>上传证件照</p>' +
                            '         </figure>' +
                            '         <div class="l_warning photo_error"><img src="//img10.allinmd.cn/v3/common/icon/error_tips.png"><span><label>请上传证件照片！</label></span></div>' +
                            '   </aside>';
                    }
                    return str;
                }()) +
                '                </figure>' +
                '            </section>' +
                '              <div class="attLine"></div>' +
                '        </section>';
            return str;
        },
        //获取用户证件信息
        secondInformation: function () {
            var t = this;
            var postData = {
                pageIndex: 1,
                pageSize: 999
            };

            postData = {paramJson: $.toJSON(postData)};
            comm.LightBox.showloading();
            $.ajax({
                url: t.path.getAuthAttachments,
                dataType: "json",
                type: "post",
                data: postData,
                success: function (data) {
                    comm.LightBox.hideloading();
                    if (data && data.responseObject && data.responseObject.responseData && data.responseObject.responseData.data_list && data.responseObject.responseData.data_list.length > 0) {
                        var newData = [];
                        var flag = false;
                        $.each(data.responseObject.responseData.data_list, function (ni, nel) {
                            if (newData.length == 0) {
                                newData.push(nel);
                            } else {
                                $.each(newData, function (ji, jel) {
                                    flag = false;
                                    if (jel.attType == nel.attType && jel.attPositionType == nel.attPositionType) {
                                        flag = true;
                                        if (Date.parse(jel.createTime.substring(0, 19)) > Date.parse(nel.createTime.substring(0, 19))) {//新数组中同一位置 图片时间> 老的时间 ==为新
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
                        t.getAuthAttachments = newData;
                        $.each(newData, function (indexm, elem) {
                            $.each($('.ev-attType'), function (index, ele) {
                                // elem.attType = (elem.attType == 10 ? (t.medicalID == '10' ? 12 : 11) : elem.attType);
                                if (elem.attType && $('.ev-dataAttType', $(ele)).attr('data-attType') == elem.attType) {
                                    if (parseInt(elem.isRefuse)) {
                                        $('.ev-imgAtt' + elem.attType).find('.ev-dataAttType .typeTip').show();
                                    }
                                    if (elem.attCode) {
                                        $('.attCode', $(ele)).val(elem.attCode).attr('data-oldcode', elem.attCode);
                                    }
                                    // $('.certificatesPath', $(ele)).eq(elem.attPositionType - 1).val(elem.attPath.replace("https://img05.allinmd.cn/", "")).addClass('ev-upSuccess').attr('data-id', elem.id).attr('data-oldpath', elem.attPath.replace("https://img05.allinmd.cn/", ""));
                                    // $('.czyx1', $(ele)).eq(elem.attPositionType - 1).css("background-image", 'url(' + elem.attPath + ')');
                                    if (elem.attPath && (elem.attPath.indexOf('jpg') != -1 || elem.attPath.indexOf('jpeg') != -1 || elem.attPath.indexOf('png') != -1 || elem.attPath.indexOf('PNG') != -1 || elem.attPath.indexOf('JPEG') != -1 || elem.attPath.indexOf('JPG') != -1)) {
                                        $('.certificatesPath', $(ele)).eq(elem.attPositionType - 1).val(elem.attPath.replace("https://img05.allinmd.cn/", "")).addClass('ev-upSuccess').attr('data-id', elem.id).attr('data-oldpath', elem.attPath.replace("https://img05.allinmd.cn/", ""));
                                        $('.czyx1', $(ele)).eq(elem.attPositionType - 1).css("background-image", 'url(' + elem.attPath + ')');
                                        $('.czyx1 input', $(ele)).eq(elem.attPositionType - 1).hide();
                                    } else {
                                        $('.czyx1 input', $(ele)).eq(elem.attPositionType - 1).show();
                                    }
                                    t.addMask($('.czyx1', $(ele)).eq(elem.attPositionType - 1));
                                }
                            })
                        })
                        t.secondSubmit();
                    }
                }
            });
        },
        //上传证件照片
        uploadAtt: function () {
            var t = this, uploadTime;
            $('p', $('.ev-upload')).hide();
            $('.czyx1').each(function (index, ele) {
                var _t = $(ele);
                _t.uploadImg({
                    ajaxData: {
                        url: "/call/comm/upload_attachment/upload/?_=" + Math.random(), //文件处理的URL,
                    },
                    multiple: false,
                    fileName: 'file',
                    inputStyle: {
                        "z-index": '1'
                    },
                    formData: {
                        paramJson: $.toJSON({imageType: "2", domain: location.hostname})
                    },
                    fileChange: function (data) {
                        if (data.files.length > 1) {
                            alert("最多上传1张");
                            $("input", $(ele)).val("");
                            return false;
                        }
                    },
                    fileSelected: function (file) {
                        var type = file.type;
                        if ((/(jpg)|(jpeg)|(png)$/i.test(type))) {
                            var fileSize = file.size;
                            if (fileSize > 10 * 1048576) {
                                alert('图片不能大于10M');
                                $("input", $(ele)).val("");
                                return false;
                            }
                        } else {
                            alert('只允许上传.jpg .jpeg .png类型的图片文件');
                            $("input", $(ele)).val("");
                            return false;
                        }
                    },
                    uploadBefore: function (file) {
                        $('p', $('.ev-upload')).hide();
                        var cerUploadCon = $(ele).parents('.ev-cerUploadCon'), $this = $(ele);
                        $('.ev-upload,.loadingAnimate ,.uploadPopup', cerUploadCon).show();
                        file.progress = 0;
                        var node = $('.loadingAnimate span', cerUploadCon);
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
                        uploadTime = setTimeout(function () {
                            if (!$('.certificatesPath', cerUploadCon).hasClass('ev-upSuccess')) {
                                $('.ev-upload,.loadingAnimate', cerUploadCon).hide();
                                $('.ev-upload,p,.popupClose', cerUploadCon).show();
                                $('.popupClose', cerUploadCon).on('click', function () {

                                    $('.certificatesPath', cerUploadCon).val('');
                                    $this.val('');
                                    $('.ev-upload,p,.popupClose', cerUploadCon).hide();
                                    t.secondSubmit();
                                });
                            }
                        }, 2 * 60 * 1000)
                    },
                    uploadSuccess: function (serverJson, file) {
                        $('.ev-upload,.loadingAnimate', $(ele).parents('.ev-cerUploadCon')).hide();
                        serverJson = $.parseJSON($(serverJson)[1].data);
                        // //console.log(serverJson)
                        if (serverJson && serverJson.responseObject && serverJson.responseObject.responseMessage.path !== "") {
                            clearTimeout(uploadTime)
                            $('input', $(ele)).hide();
                            $(ele).parents('.ev-cerUploadCon').find('.certificatesPath').val(serverJson.responseObject.responseMessage.path).addClass('ev-upSuccess');
                            $(ele).css("background-image", 'url(' + serverJson.responseObject.responseMessage.url + ')');
                            if (comm.browser.isIe8()) {
                                $(ele).css("filter", 'progid:DXImageTransform.Microsoft.AlphaImageLoader(src=' + serverJson.responseObject.responseMessage.url + ',sizingMethod="scale")');
                            }
                            if (t.delAttIdList) {//判断是否是修改图片
                                var dataId = $(ele).parents('.ev-cerUploadCon').find('.certificatesPath').attr('data-id');
                                if (dataId) {
                                    $.each(t.delAttIdList, function (i, e) {
                                        if (e == dataId) {
                                            t.delAttIdList.splice(i, 1);
                                        }
                                    })
                                }
                            }
                            t.addMask($(ele));
                            t.secondSubmit();
                        } else {
                            if (serverJson.message) {
                                alert(serverJson.message);
                            } else {
                                $('.ev-upload,p,.popupClose', $(ele).parents('.ev-cerUploadCon')).show();
                                $('.popupClose', $(ele)).off('click').on('click', function () {
                                    $('input', $(ele)).val('');
                                    $('.ev-upload,p,.popupClose', $(ele).parents('.ev-cerUploadCon')).hide();
                                });
                            }
                        }

                    },
                    uploadFail: function (data) {

                    }
                });
            });
        },
        //图片上传成功后悬浮显示蒙层
        addMask: function (ele) {
            var t = this;
            ele.bind("mouseover", function () {
                var certificatesPath = $('.certificatesPath', ele.parents('.ev-cerUploadCon'));
                if (certificatesPath.val()) {
                    if ($("p", $(this)).css('display') == 'none') {
                        //上传成功，蒙层消失
                        $(".uploadPopup", $(this)).hide();
                    }
                    $(".ev-upload,.popupClose", $(this)).show();
                    $(".popupClose", $(this)).on('click', function () {
                        ele.unbind('mouseover mouseout');
                        if (certificatesPath.attr('data-id') && t.delAttIdList.indexOf(certificatesPath.attr('data-id')) == -1) {
                            t.delAttIdList.push(certificatesPath.attr('data-id'));
                        }
                        $('.certificatesPath', ele.parents('.ev-cerUploadCon')).val('').removeClass('ev-upSuccess');
                        $('input', ele).show().val('');
                        ele.css("background-image", 'url()');
                        ele.css("background-image", 'url(//img10.allinmd.cn/authentication/camera.png)');
                        $(this).hide();
                        $(this).parents('.ev-upload').hide();
                        t.secondSubmit();
                    });
                }
            }).bind("mouseout", function () {
                // //console.log($("p", $(this)).css('display') == 'none')
                if ($("p", $(this)).css('display') == 'none') {
                    //上传成功，蒙层消失
                    $(".ev-upload", $(this)).hide();
                }
            });

        },
        //下一步状态判断
        submitConfig: function () {
            var submit = true;
            $("#ev-next").attr("submit", "false").removeClass("active");
            if (!$("#fullName").val() || $("#fullName").hasClass('error')) {
                submit = false;
            }
            if (!$("#company").val() && !$("#schoolName").val()) {
                submit = false;
            }
            if (!$('#ev-medTitle .selectText').val()) {
                submit = false;
            }
            if (submit) {
                $("#ev-next").attr("submit", "true").addClass("active");
            }

        },
        //提交状态判定
        secondSubmit: function () {
            var isID1 = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$/,//身份证校验
                isID2 = /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/i;
            var flaArr = [],
                flaArr2 = [],
                flaArr3 = [],
                attTypeArr = []; //判断非身份证字段是否已填写，如果此字段无1，身份证字段填写完全也不能提交;
            var t = this;
            $('#ev-thirdNext').removeClass('active').attr('on', false);
            $('html').removeAttr('emptyAttCode');
            $.each($('.ev-attType'), function (index, elem) {
                if (!$(elem).hasClass('ev-imgAtt1')) {
                    if (
                        $(elem).find('.certificatesPath').length != 0 &&  //要上传图片 并且上传图片的数量与已上传的数量相同
                        $(elem).find('.certificatesPath').length == $(elem).find('.ev-upSuccess').length
                    ) {
                        //身份证、医师执业证、医师资格证、医师职称证; 证件的证件号码为必填项，上传证件必须证件号加证件照片都填写
                        if ($(elem).find('.attCode').length > 0) {
                            if ($(elem).find('.attCode').val() != "") {//证件号码为必填 非空
                                $('#ev-thirdNext').addClass('active').attr('on', true);
                                flaArr.push(1);
                                flaArr2.push(1);
                                flaArr3.push(1);
                                attTypeArr.push($(elem).attr('class').slice(-2))
                            } else {
                                // flaArr.push(1);
                                flaArr2.push(0);
                                flaArr3.push(1);
                                $('html').attr('emptyAttCode', $(elem).attr('class'));
                            }
                        }
                        else {
                            flaArr.push(1);
                            flaArr2.push(1);
                            flaArr3.push(1);
                            $('#ev-thirdNext').addClass('active').attr('on', true);
                            attTypeArr.push($(elem).attr('class').slice(-2))
                        }
                    }
                    else if ($(elem).find('.ev-upSuccess').length < $(elem).find('.certificatesPath').length && $(elem).find('.attCode').val() != '' && $(elem).find('.attCode').length > 0) {//没传图片，有证件编号
                        $('html').attr('emptyAttCode', $(elem).attr('class'));
                        flaArr.push(1);
                        flaArr2.push(0);
                        flaArr3.push(1);
                    }
                    else if ($(elem).find('.ev-upSuccess').length < $(elem).find('.certificatesPath').length && $(elem).find('.ev-upSuccess').length != 0) {//只传一张
                        $('html').attr('emptyAttCode', $(elem).attr('class'));
                        flaArr.push(1);
                        flaArr2.push(0);
                        flaArr3.push(1);
                    }
                }
                else {
                    $.each($(elem), function (inde, eleme) {//身份证上传2张并且 资质证明至少有一张
                        // var _attCode = $(eleme).find('.attCode').val();
                        //先写死，为了后期产品再说需要填写证件编号时，打开上面一行，关闭下面一行即可
                        var _attCode = '';
                        if ($(elem).find('.ev-upSuccess').length) {
                            _attCode = "320926195511175276"
                        }
                        if (
                            ($(elem).find('.ev-upSuccess').length && $(elem).find('.ev-upSuccess').length != 2) ||       // 只上传了一张
                            ($(elem).find('.ev-upSuccess').length == 2 && !(isID1.test(_attCode) || isID2.test(_attCode)))       // 上传了2张，但身份证号不符
                        ) {
                            if (flaArr3.indexOf(1) > -1) {//判断非身份证字段已填写，身份证字段填写可激活按钮
                                flaArr.push(1);
                            }
                            flaArr2.push(0);
                            $('html').attr('emptyAttCode', $(elem).attr('class'));
                        } else if ($(elem).find('.ev-upSuccess').length < 2 && (isID1.test(_attCode) || isID2.test(_attCode))) {//没传图片
                            $('html').attr('emptyAttCode', $(elem).attr('class'));
                            if (flaArr3.indexOf(1) > -1) {//判断非身份证字段已填写，身份证字段填写可激活按钮
                                flaArr.push(1);
                            }
                            flaArr2.push(0);
                        } else if ($(elem).find('.ev-upSuccess').length == 1) {//只传一张
                            $('html').attr('emptyAttCode', $(elem).attr('class'));
                            if (flaArr3.indexOf(1) > -1) {//判断非身份证字段已填写，身份证字段填写可激活按钮
                                flaArr.push(1);
                            }
                            flaArr2.push(0);
                        } else if (_attCode && $(elem).find('.ev-upSuccess').length < 2) {
                            $('html').attr('emptyAttCode', $(elem).attr('class'));
                            flaArr2.push(0);
                        }
                    });
                }
            });
            if (flaArr.indexOf(1) > -1) {
                $('#ev-thirdNext').addClass('active');
            }
            if (flaArr2.indexOf(0) > -1) {
                $('#ev-thirdNext').attr('on', false);
            }

            if (
                // t.medicalID==1||
            // t.medicalID==2||
            // t.medicalID==3||
            // t.medicalID==4
                t.medicalID != 10
            ) {
                //8医师执业证，6医师资格证；13医师职称证；11工作证；15-护士执业证，16-专业技术资格证
                if (//有医师证
                    attTypeArr.indexOf('t8') == -1 &&
                    attTypeArr.indexOf('t6') == -1 &&
                    attTypeArr.indexOf('13') == -1 &&
                    attTypeArr.indexOf('11') == -1 &&
                    attTypeArr.indexOf('15') == -1 &&
                    attTypeArr.indexOf('16') == -1
                ) {
                    $('#ev-thirdNext').removeClass('active').attr('on', false);
                }
            }
        },
        //帮助
        helpAuth: function () {
            var t = this;
            var _customerRole = TempCache.getItem("customerRole");
            $('body').on('click', function (e) {
                if (!$(e.target).parents('#ev-medicalPar').length) {
                    $('.ev-medicalConer').hide();
                    $('#ev-medicalPar').removeClass('selectForce');
                }
                if ($(e.target).hasClass('ev-help')) {
                    //判断当前用户角色是护士，还是医生，显示不同的帮助文案
                    //显示护士的帮助文案
                    if ((t.identity && t.identity === 2) || _customerRole === "12") {
                        //如果第二步隐藏，则显示基本信息的帮助文案
                        if ($('#secondStep').css('display') === "none") {
                            comm.creatEvent({
                                triggerName: '帮助',
                                triggerType: "认证-基本信息",
                                browType: '10001',
                                actionId: 2514,
                               userRoleType:2
                            });
                            $("#nurseFirstStepHelpInfo").show();
                        }//否则显示上传认证的帮助文案
                        else {
                            comm.creatEvent({
                                triggerName: '帮助',
                                triggerType: "认证-证件信息",
                                browType: '10014',
                                actionId: 11697,
                               userRoleType:2
                            });
                            $("#nurseSecondStepHelpInfo").show();
                        }
                    }//显示医生的帮助文案
                    else {
                        //如果第二步隐藏，则显示基本信息的帮助文案
                        if ($('#secondStep').css('display') === "none") {
                            comm.creatEvent({
                                triggerName: '帮助',
                                triggerType: "认证-基本信息",
                                browType: '10001',
                                actionId: 2514,
                              userRoleType:1
                            });
                            $("#doctorFirstStepHelpInfo").show();
                        }//否则显示上传认证的帮助文案
                        else {
                            comm.creatEvent({
                                triggerName: '帮助',
                                triggerType: "认证-证件信息",
                                browType: '10014',
                                actionId: 11697,
                                userRoleType:1
                            });
                            $("#doctorSecondStepHelpInfo").show();
                        }
                    }
                } else {
                    $('.ev-helpInfo').hide();
                    if ($(e.target).hasClass('ev-equity')) {
                        var gradeBar = $(".al-auth-grade");
                        gradeBar.show();
                        $(".al-auth-grade-close").off("click").on("click", function () {
                            gradeBar.hide();
                        });
                    }
                }
            });

        },
        //结束
        end: function () {
            var t = this;
            var contentCss = "text-align:center;text-indent: initial";
            var title = "认证审核需要1-3个工作日,请耐心等待";
            if (t.para.isCustomerInfo) {
                title = '变更申请已成功提交，我们将在1-3个工作日内处理完成，请您耐心等待';
                // contentCss = "text-align:left;text-indent: initial"
            }
            comm.surePop({
                icon: 1, //需要图标吗
                title: '提交成功',
                content: title,
                contentCss: contentCss,
                sureClass: 'sureClass',
                success: function () {
                    if (document.referrer) {
                        if (document.referrer.lastIndexOf("html") > -1) {
                            if (document.referrer.indexOf("pages/singlePage/upload-case.html") > -1) {//来源页为病例发布页面，跳转回首页
                                // setTimeout(function () {
                                g_sps.jump(null, "/");
                                // }, 500);
                            } else {
                                // setTimeout(function () {
                                g_sps.jump(null, document.referrer);
                                // }, 500)
                            }
                        } else {
                            history.go(-1);
                        }
                    } else {
                        // setTimeout(function () {
                        g_sps.jump(null, "/");
                        // }, 500)
                    }
                },
                close: function () {
                    if (document.referrer) {
                        if (document.referrer.lastIndexOf("html") > -1) {
                            if (document.referrer.indexOf("pages/singlePage/upload-case.html") > -1) {//来源页为病例发布页面，跳转回首页
                                // setTimeout(function () {
                                g_sps.jump(null, "/");
                                // }, 500);
                            } else {
                                // setTimeout(function () {
                                g_sps.jump(null, document.referrer);
                                // }, 500)
                            }
                        } else {
                            history.go(-1);
                        }
                    } else {
                        // setTimeout(function () {
                        g_sps.jump(null, "/");
                        // }, 500)
                    }
                }
            });
        }
    };
    newAuth.init();
});
