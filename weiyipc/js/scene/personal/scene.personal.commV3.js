var responseData = {};//存储基本信息
$(function () {
    forceUrl();
    var uid = $('#sesCustomerId').val(); //登录人id
    var cid = comm.getpara().cid; //当前页面主人id
    var baseinfoUrl = PC_CALL + 'customer/unite/getMapById/';
    var isSelf;
    if (!cid || uid == cid) {//无cid 或 cid == uid 是本人
        isSelf = true;
    } else {
        isSelf = false;
    }





	//当为自己时不允许进入他人主页，直接转入个人首页
    if ((uid == cid || !cid) && location.pathname == "/pages/personal/others_contribution.html") {
        if (window.g_sps) {
            g_sps.jump(null, "personal_index.html");
        } else {
            setTimeout(function () {
                g_sps.jump(null, "personal_index.html");
            }, 300)
        }

    }
    if (!cid) {
        if (!uid) {//个人中心未登录
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
                noAuthReload: true,
                noAuthTip:1
            });
            return false;
        }
    }

    var customerId = 0;
    if (!cid) {
        customerId = uid;
    } else {
        customerId = cid;
    }
    var params = {
        paramJson: $.toJSON({isCustomer:1,"customerId": customerId})
    };
    responseData = Fns.ajax.sync(baseinfoUrl, params);
    var data = isExistData(responseData)[0];
    if (!data) {
        if (window.g_sps) {
            g_sps.jump(null, "/");
        } else {
            setTimeout(function () {
                g_sps.jump(null, "/");
            }, 300)
        }
    }
    var obj = {
        userName: $(".ev-name"),//用户名
        companyMedicalTitle: $(".ev-companyMedicalTitle"),//职称//医院
        logoUrl: $(".ev-logoUrl"), //头像
        upNum: $(".ev-upNum"), //赞数
        fansNum: $(".ev-fansNum"), //粉丝数
        followNum: $(".ev-followNum"),  //关注数
        collectNum: $(".ev-collectNum"),//收藏数
    };
    var unit = data.customer_unite;
    var baseInfo = data.customer_baseinfo;
    var auth = data.customer_auth;
    auth.state = parseInt(auth.state,10);
    var csc = data.customer_statistic;
    var att = data.customer_att;
    var prompt = data.comm_data_prompt;
    var content = "审核将在1-3个工作日内完成，请耐心等待";
   /* if (data.authFlag == 1) {//四证齐全
        content = "执业医师审核将在3个工作日内完成，请耐心等待";
    }*/
    var audit = false;
    if (isSelf) {
        if (!TempCache.getItem("passwd")) {
            TempCache.setItem("passwd", unit.passwd);
        }
        if (unit.isValid == 0 || (unit.passwd && TempCache.getItem("passwd")&&TempCache.getItem("passwd")!="undefined"&&unit.passwd != TempCache.getItem("passwd"))) {//TODO addBy lichunhui 2017.08.29无效的用户 或者在其他端修改过密码
            $.ajax({
                type: 'POST',
                url: PC_CALL + "customer/unite/logout/",//退出登录
                cache: false,
                dataType: 'json',
                success: function (rep) {
                    if (rep && rep.responseObject && rep.responseObject.responseStatus) {
                        if (window.g_sps) {
                            g_sps.jump(null, "/");
                        } else {
                            setTimeout(function () {
                                g_sps.jump(null, "/");
                            }, 300)
                        }
                        TempCache.clear();
                    }
                }
            });
        }
        if (uid) {
            $.ajax({
                url: PC_CALL + "customer/revise/auth/getMapList/",//获取申请审核状态
                type: "POST",
                data: {paramJson: $.toJSON({customerId: uid})},
                dataType: "json",
                async: false,
                success: function (data) {
                    if (data && data.responseObject && data.responseObject.responseStatus) {
                        audit = true;
                    } else {
                        audit = false;
                    }
                }
            });
        }

    }

    //初始化
    $(".ev-uploadFace>img").attr("src", data.customer_att.logoUrl); //头像

    //判断头像
    var logoUrl = "<img src=\"//img10.allinmd.cn/default-user/user_img65.png\">";
    if (att.logoUrl !== "") logoUrl = att.logoUrl;
    obj.logoUrl.html(
        '<img src="' + logoUrl + '" width="103px;" height="103px;"/>' +
        '<i class="al-personalLogoMask ev-uploadFaceMask" style="display:none;">' +
        '<img src="//img10.allinmd.cn/v3/common/icon/icon_camera.png" alt="">' +
        '</i>');
    var reminderBar = $(".al-auth-reminder");//补全四证或者认证失败的提示
    var manufacturerOnOff = unit.customerRole !== 3;
    if (auth.state !== 2 && auth.state !== 7 && auth.state !== 8 && auth.state !== 9) {//未认证
        var nickname = auth.lastName + auth.firstName;
        if (nickname === "") nickname = comm.getRegisterName(unit.email, unit.mobile);
        obj.userName.text(nickname);

        if (!isSelf) {
            obj.companyMedicalTitle.html('<p id="EV-NoQualificationUser">用户尚未认证</p>');
            //SEO值变更
            $("[name=description]").attr('content', '［' + nickname + '］的学术专栏－唯医,allinmd');
            $("[name=keywords]").attr('content', '［' + nickname + '］，学术专栏，医学专栏，医师主页，医生专栏，医生交流，关注医师，唯医,allinmd')
        } else {//自己
            var desStr = "";

            function goAuth() {
                var noAuthTemplate = "<section class='al-not-auth'><span>" + desStr + "</span><button class='al-go-auth ev-go-auth'>去认证</button></section>";
                obj.companyMedicalTitle.html(noAuthTemplate);
                $(".ev-go-auth").off("click").on("click", function () {
                    user.login({
                        callback: function () {
                            window.location.reload();
                        },
                        scene: privilegeSceneConst.eSceneTypeAuth,
                        noAuthTip:1
                    });
                    //事件埋点
                    comm.creatEvent({
                        triggerType: "认证",
                        keyword: "去认证",
                        actionId: 23
                    });
                });
            }
            if (auth.state === 3 && manufacturerOnOff) {
                desStr = prompt.promptMessage;
                $(".ev-noAuth-hide").show();//显示姓名，粉丝行
                goAuth()
            }
            if ((auth.state === -1 || auth.state === 0) && manufacturerOnOff) {
                $(".ev-noAuth-hide").hide();//隐藏姓名，粉丝行
                desStr = prompt.promptMessage;
                reminderBar.addClass('al-reminder-no-auto');
                reminderBar.find(".al-auth-reminder-content").html('<em>'+prompt.promptMessage+'</em>');
                prompt.promptMessage.length>0?reminderBar.show(300).off("click").on("click", function () {
                    user.login({
                        callback: function () {
                            window.location.reload();
                        },
                        scene: privilegeSceneConst.eSceneTypeAuth,
                        noAuthTip:1
                    });
                    //事件埋点
                    comm.creatEvent({
                        triggerType: "认证",
                        keyword: "去认证",
                        actionId: 23
                    });
                }):'';
                $(".al-auth-reminder-close").off("click").on("click", function (e) {
                    $(".al-auth-reminder").hide();
                    e.stopPropagation();
                });
                goAuth()
            } else {
                $(".ev-noAuth-hide").show();//显示姓名，粉丝行
            }
            if(auth.state==3){
                reminderBar.addClass('al-reminder-no-auto');
                reminderBar.find(".al-auth-reminder-content").html('<em>'+prompt.promptMessage+'</em>');
                prompt.promptMessage.length>0?reminderBar.show(300).off("click").on("click", function () {
                    user.login({
                        callback: function () {
                            window.location.reload();
                        },
                        scene: privilegeSceneConst.eSceneTypeAuth,
                        noAuthTip:1
                    });
                    //事件埋点
                    comm.creatEvent({
                        triggerType: "认证",
                        keyword: "去认证",
                        actionId: 23
                    });
                }):'';
                $(".al-auth-reminder-close").off("click").on("click", function (e) {
                    $(".al-auth-reminder").hide();
                    e.stopPropagation();
                });
            }
            if (auth.state === 1) {
                $(".ev-noAuth-hide").hide();
                if (data.authFlag == 1) {
                    $(".al-certification-status").html('<p>' + content + '</p>').show().addClass("al-certification-v2Status");
                } else {
                    $(".al-certification-status").html('<p>' + content + '</p>').show().addClass("al-certification-v1Status");
                }
            }
        }

    } else {
        $(".ev-noAuth-hide").show();//显示姓名，粉丝行
        var name = auth.lastName + auth.firstName;
        var demoStr = name + '<i class="al-vipBigUser "></i>';
        var nameObj = $(demoStr);
        /*if(auth.state === 1 || auth.state === 2||auth.state === 7 || auth.state === 9){
            nameObj.find(".al-vipBigUser").css({"background":"url('/images/img10/authentication/V1.png') no-repeat 50% 50%"});
        }
        if(auth.state === 8 ){
            nameObj.find(".al-vipBigUser").css({"background":"url('/images/img10/authentication/V2.png') no-repeat 50% 50%"});
        }*/
        obj.userName.html(demoStr);
        if (auth.medicalTitleShow) {
            obj.companyMedicalTitle.html('<p>' + auth.medicalTitleShow + '</p><p>' + auth.workplace + '</p>');
        } else {
            obj.companyMedicalTitle.html('<p>' + auth.workplace + '</p>');
        }

        if (!isSelf) { //非个人主页时 他人中心
            //SEO值变更
            $("[name=description]").attr('content', '［' + name + '］的学术专栏－唯医,allinmd');
            $("[name=keywords]").attr('content', '［' + name + '］，学术专栏，医学专栏，医师主页，医生专栏，医生交流，关注医师，唯医,allinmd')
        } else {//个人中心
            if ((auth.state === 2 || auth.state === 7 || auth.state === 9) && (manufacturerOnOff)) {
                //debugger;
                $(".al-vipBigUser").addClass("al-vipNewBigUser").css({"background": "url('/images/img10/authentication/V1.png') no-repeat 50% 50%"});
            }
            if ((auth.state === 2) && (manufacturerOnOff)) {
                var authHelpTemplate = '<section class="al-auth-grade" style="display: block;">' +
                    '<section class="al-auth-grade-details">' +
                    '<h1 class="al-auth-grade-title">认证等级规则</h1>' +
                    '<p class="al-auth-grade-produce">' +
                    '	认证等级是用户在唯医、医鼎、医栈、唯医骨科所具有的统一认证等级。包括：' +
                    '</p>' +
                    '<div class="al-auth-grade-des">' +
                    '	<h1><i></i>V1-认证医师</h1>' +
                    '	<p>' +
                    '		拥有在唯医、医鼎、医栈的医师操作权限' +
                    '	</p>' +
                    '</div>' +
                    '<div class="al-auth-grade-des">' +
                    '	<h1><i></i>V2-执业医师</h1>' +
                    '	<p>' +
                    '		拥有V1权限的同时，还具有在唯医骨科进行执业诊疗的权限' +
                    '	</p>' +
                    '</div>' +
                    '<div class="al-auth-grade-close">' +
                    '</div>' +
                    '</section>' +
                    '</section>';
                if (localStorage.getItem("isFirstAuthHelp")) {
                    // return false;
                } else {
                    $(".al-auth-grade").remove();
                    $("body").append(authHelpTemplate);
                    $(".al-auth-grade-close").off("click").on("click", function () {
                        $(".al-auth-grade").remove();
                    });
                    localStorage.setItem("isFirstAuthHelp", "true");
                }
            }
            if ((auth.state === 8) && (manufacturerOnOff)) {
                $(".al-vipBigUser").addClass("al-vipNewBigUser").css({"background": "url('/images/img10/authentication/V2.png') no-repeat 50% 50%"});
            }
            if ((auth.state === 9) && (manufacturerOnOff)) {
                //desStr ="v2认证未通过审核,请重新认证";
                reminderBar.addClass("al-auth-reminder-failed").find(".al-auth-reminder-content").html(prompt.promptMessage);
                prompt.promptMessage.length>0?reminderBar.show(300).off("click").on("click", function () {
                    if (window.g_sps) {
                        g_sps.jump(null, "/pages/singlePage/user/auth.html");
                    } else {
                        setTimeout(function () {
                            g_sps.jump(null, "/pages/singlePage/user/auth.html");
                        }, 300)
                    }
                }):'';
                $(".al-auth-reminder-close").off("click").on("click", function (e) {
                    $(".al-auth-reminder").hide();
                    e.stopPropagation();
                });
            }
            if ((auth.state === 2) && (auth.state != 7) && (manufacturerOnOff) && !audit) {
                reminderBar.addClass('al-reminder-no-auto');
                reminderBar.find(".al-auth-reminder-content").html('<em>'+prompt.promptMessage+'</em>');
                prompt.promptMessage.length>0?reminderBar.show(300).off("click").on("click", function () {
                    localStorage.setItem("userInfoTrigger", "true");
                    if (window.g_sps) {
                        g_sps.jump(null, $(".al-customer-info a").attr("href"));
                    } else {
                        setTimeout(function () {
                            g_sps.jump(null, $(".al-customer-info a").attr("href"));
                        }, 300)
                    }
                }):'';
                $(".al-auth-reminder-close").off("click").on("click", function (e) {
                    e.stopPropagation();
                    $(".al-auth-reminder").hide();
                });
            }
            if (auth.state === 7) {
                $(".al-certification-status").html('<p>' + content + '</p>').show().addClass("al-certification-v2Status");
            }
            if (auth.state == 2 && audit) {//修改认证审核中
                $(".al-certification-status").html('<p>' + content + '</p>').show().addClass("al-certification-v2Status");
            }
        }

    }
    obj.fansNum.attr("num", csc.fansNum).text(csc.fansNum);
    // obj.followNum.attr("num", csc.followpeopleNum).text(csc.followpeopleNum);
    obj.followNum.attr("num", csc.followOrgNum?csc.followOrgNum:csc.followpeopleNum).text((csc.followOrgNum?csc.followOrgNum:csc.followpeopleNum));//关注数
    obj.upNum.attr("num", csc.othersUpNum).text(csc.othersUpNum);
    obj.collectNum.attr("num", csc.collectionNum).text(csc.collectionNum);
    var shareSummary = comm.cutLine(auth.medicalTitle, "_", ",") + auth.workplace + (baseInfo.summary ? "个人简介：" + baseInfo.summary : '');
    //是自己时才让上传头像
    if (!cid) {
        $(".ev-uploadFace").on("mouseenter", function () {
            $(".ev-uploadFaceMask").show();
        }).on("mouseleave", function () {
            $(".ev-uploadFaceMask").hide();
        });
        module.logoReplace({
            container: $(".ev-uploadFace"),
            callback: function (data) {
                if (data.responseObject && data.responseObject.responseStatus && data.responseObject.responseMessage) {
                    $(".ev-uploadFace>img").attr("src", data.responseObject.responseMessage.url);
                }
                comm.showSuccessPop({
                    title: '更新头像成功',//标题
                    content: '现在其他医师可以看到您的新头像了',//内容
                    second: 3,//时间
                    obj: $(".ev-logoUrl").parent()//存放dom的父元素
                });
            }
        });
        if (unit.customerRole == 3) {//厂商无分享自己权限
            return;
        }
        //获取分享话术
        //分享
        var href = window.location.href;
        var url = "";
        var h5Url = "";
        switch (href.substring(href.lastIndexOf("/") + 1)) {
            case 'personal_index.html'://个人主页
                url = "https://www.allinmd.cn/pages/personal/others_index.html?cid=" + uid;
                h5Url = "https://m.allinmd.cn/dist/personal/others_index.html?cid=" + uid;
                shareSence = shareSenceConst.personal_host;
                break;
            case 'personal_contribution.html'://个人贡献
                url = "https://www.allinmd.cn/pages/personal/others_contribution.html?cid=" + uid;
                h5Url = "https://m.allinmd.cn/dist/personal/others_index.html?cid=" + uid + '#/contribution';
                shareSence = shareSenceConst.personal_host;
                break;
            case 'personal_active.html'://个人动态
                url = "https://www.allinmd.cn/pages/personal/others_index.html?cid=" + uid;
                h5Url = "https://m.allinmd.cn/dist/personal/others_index.html?cid=" + uid;
                shareSence = shareSenceConst.personal_host;
                break;
            default :
                url = "https://www.allinmd.cn/pages/personal/others_index.html?cid=" + uid;
                h5Url = "https://m.allinmd.cn/dist/personal/others_index.html?cid=" + uid;
                shareSence = shareSenceConst.personal_host;
                break;
        }
        //分享
        module.share({
            container: $(".ev-shareContainer"),//存放分享组件的父级
            type: 2,//默认为1  1：社交分享  2：页面左下角全站分享
            url: url,
            title: "",//分享标题
            h5Url: h5Url,//h5页面链接
            shareTrend: 0,//0:不需要站内动态分享  1：需要站内动态分享
            trendUrl: '',//分享到站内动态的接口
            data: {},//分享到站内动态的接口参数
            callback: function () {
            },//分享到站内动态成功后回调函数
            triggerRequest: function (content) {//事件点击
                //获取分享话术
                var data = {};
                data.customerId = uid;
                data.logoUseFlag = 5;
                data.pageIndex = 1;
                data.pageSize = 1;
                data.useFlag = 1;
                data.sceneType = getShareContentSense.my_index;
                data.resourceType = ResouceType.person;
                var param = {};
                param.paramJson = $.toJSON(data);
                $.ajax({
                    url: PC_CALL + 'comm/data/share/getMapList3/',
                    type: "post",
                    data: param,
                    dataType: 'json',
                    async: false,
                    success: function (d) {
                        if (d && d.responseObject.responseData && !$.isEmptyObject(d.responseObject.responseData) && d.responseObject.responseData.data_list.length) {
                            var item = d.responseObject.responseData.data_list[0];
                            content.pic = item.share_comm.shareImageUrl;
                            content.title = item.share_comm.shareTitle != "" ? item.share_comm.shareTitle : document.title;
                            $.each(item.share_channel, function (i, el) {
                                if (el.shareChannel == 'Sina') {
                                    content.sinaTitle = el.shareDesc;
                                } else if (el.shareChannel == "QQFriend") {
                                    content.qqTitle = el.shareTitle;
                                    content.qqSummary = el.shareDesc;
                                } else if (el.shareChannel == "QZone") {
                                    content.qqZoneTitle = el.shareTitle;
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
    } else {
        //他人时头像预览
        $(".ev-logoUrl").on("click", function () {
            var _src = $(this).find('img').eq(0).attr('src');
            comm.LightBox.show(70, '#0a1e2b');
            var _preView = '<div class="logoPreView"><div class="logoPreViewClose"></div><img class="logoPreViewImg" src="' + _src + '"></div>'
            $("body").append(_preView);
            $('.logoPreViewClose').on('click', function () {
                comm.LightBox.hide();
                $('.logoPreView').remove();
            })
        });

        //分享
        var href = window.location.href;
        var url = "";
        var h5Url = "";
        switch (href.substring(href.lastIndexOf("/") + 1)) {
            case 'others_index.html'://他人主页
                url = "https://www.allinmd.cn/pages/personal/others_index.html?cid=" + cid;
                h5Url = "https://m.allinmd.cn/dist/personal/others_index.html?cid=" + cid + '#/dynamic';
                shareSence = shareSenceConst.personal_host;
                break;
            case 'others_contribution.html'://他人贡献
                url = "https://www.allinmd.cn/pages/personal/others_contribution.html?cid=" + cid;
                h5Url = "https://m.allinmd.cn/dist/personal/others_index.html?cid=" + cid + '#/contribution';
                shareSence = shareSenceConst.personal_host;
                break;
            default :
                url = "https://www.allinmd.cn/pages/personal/others_index.html?cid=" + cid;
                h5Url = "https://m.allinmd.cn/dist/personal/others_index.html?cid=" + cid;
                shareSence = shareSenceConst.personal_host;
                break;
        }
        //分享
        module.share({
            container: $(".ev-shareContainer"),//存放分享组件的父级
            url: url,
            type: 2,//默认为1  1：社交分享  2：页面左下角全站分享
            title: "",//分享标题
            h5Url: h5Url,//h5页面链接
            shareTrend: 0,//0:不需要站内动态分享  1：需要站内动态分享
            trendUrl: '',//分享到站内动态的接口
            data: {},//分享到站内动态的接口参数
            callback: function () {
            },//分享到站内动态成功后回调函数
            triggerRequest: function (content) {//事件点击
                //获取分享话术
                var data = {};
                data.customerId = cid;
                data.logoUseFlag = 5;
                data.pageIndex = 1;
                data.pageSize = 1;
                data.useFlag = 1;
                data.sceneType = getShareContentSense.my_index;
                data.resourceType = ResouceType.person;
                var param = {};
                param.paramJson = $.toJSON(data);
                $.ajax({
                    url: PC_CALL + 'comm/data/share/getMapList3/',
                    type: "post",
                    data: param,
                    dataType: 'json',
                    async: false,
                    success: function (d) {
                        if (d && d.responseObject.responseData && !$.isEmptyObject(d.responseObject.responseData) && d.responseObject.responseData.data_list.length) {
                            var item = d.responseObject.responseData.data_list[0];
                            content.pic = item.share_comm.shareImageUrl;
                            content.title = item.share_comm.shareTitle != "" ? item.share_comm.shareTitle : document.title;
                            $.each(item.share_channel, function (i, el) {
                                if (el.shareChannel == 'Sina') {
                                    content.sinaTitle = el.shareDesc;
                                } else if (el.shareChannel == "QQFriend") {
                                    content.qqTitle = el.shareTitle;
                                    content.qqSummary = el.shareDesc;
                                } else if (el.shareChannel == "QZone") {
                                    content.qqZoneTitle = el.shareTitle;
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

    function isExistData(data) {
        if (data.responseObject && data.responseObject.responseStatus && data.responseObject.responseData.data_list) {
            return data.responseObject.responseData.data_list;
        } else {
            return false;
        }
    }
});


function forceUrl() {
    $('.al-personalHeader a,.al-personalNavbar a').on('click', function () {
        var cid = comm.getpara().cid;
        if (cid) {
            var url = $(this).attr("href"), jumpUrl = '';
            if (url.indexOf("?") > 1) jumpUrl = url + "&cid=" + cid;
            else jumpUrl = url + "?cid=" + cid;
            if (window.g_sps) {
                g_sps.jump(null, jumpUrl);
            } else {
                setTimeout(function () {
                    g_sps.jump(null, jumpUrl);
                }, 300)
            }
            return false; //为了事件能冒泡到body上被监听到，先注了
        }
    });
}
