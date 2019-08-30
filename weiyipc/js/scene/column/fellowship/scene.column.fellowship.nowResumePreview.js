/**
 * 功能描述： 当前简历预览
 * 使用方法:
 * 注意事件：
 * 引入来源：  作用：
 *
 * Created by HeJing on 2016/06/21.
 */


$(function () {
    var controller = {
        config: {
            fellowshipId: comm.getpara().fId,
            customerId: comm.getpara().cId,
            languageFlag: comm.getpara().lanFlag
        },
        path: {
            getInfo: PC_CALL + "customer/fellowship/base/info/",//报名基本信息
            subConfig: PC_CALL + "fellowship/config/getSubConfigList/",//志愿字段
            getSub: PC_CALL + "customer/fellowship/sub/json_list/",//所选择的学校
            getLogo: PC_CALL + "commdata/getLogoUrlList/",//获得头像
            unitInfo: PC_CALL + "customer/unite/json_info/",//个人信息
            workList: PC_CALL + "customer/occupation/json_list/",//工作列表
            eduList: PC_CALL + "customer/education/json_list/",//简历的教育经历
            conEduList: PC_CALL + "customer/continue/education/json_list/",//简历的继续教育
            honorList: PC_CALL + "customer/honor/json_list/",//简历中的荣誉获得
            foundingList: PC_CALL + "customer/fund/json_list/",//简历中的科研基金
            socialList: PC_CALL + "customer/social/json_list/",//简历中的社会职责
            opusList: PC_CALL + "customer/opus/json_list/",//简历中的学术专著
            patentList: PC_CALL + "customer/patent/json_list/",//简历中的发明专利
            getDataCertificates: PC_CALL + "commdata/getDataCertificates/",//证件类型
            getEducationList: PC_CALL + "commdata/getEducationList/",//学历
            languageListUrl: PC_CALL + "customer/language/json_list/"//获取语言能力列表

        },
        ajaxFn: function (opt) {
            comm.LightBox.showloading();
            var cfg = opt;
            $.ajax({
                url: cfg.url,
                type: 'post',
                data: {paramJson: $.toJSON(cfg.param)},
                dataType: 'json',
                async: opt.async ? opt.async : true,
                success: function (data) {
                    comm.LightBox.hideloading();
                    if (data) {
                        cfg.fn(data);
                    }
                }
            });
        },
        init: function () {
            var t = this;
            t.resumeBaseInfo();
        },
        //报名基本信息中的证件类型
        certificatesType: function (kv) {
            var t = this;
            var callback = function (rep) {
                if (rep && rep.responseObject && rep.responseObject.responseMessage) {
                    var items = rep.responseObject.responseMessage;
                    $.each(items, function (i, e) {
                        if (e.id == kv) {
                            $(".Ev-CardType").text(e.certificate);
                            return false;
                        }
                    });
                }
            };
            comm.ajax.async(t.path.getDataCertificates, {paramJson: $.toJSON({fellowshipCertificate: "",firstResult:0,maxResult:100})}, callback);
        },
        //报名基本信息中的最高学历
        highestDegree: function (kv) {
            var t = this;
            var callback = function (rep) {
                $.each(rep, function (i, e) {
                    if (e.id == kv) {
                        $(".Ev-highestDegree").text(e.educationName);
                        return false;
                    }
                });
            };
            comm.ajax.async(t.path.getEducationList, {paramJson: $.toJSON({})}, callback);
        },
        //报名基本信息
        resumeBaseInfo: function () {
            var t = this;
            var data = {};
            data.customerId = t.config.customerId;
            data.fellowshipId = t.config.fellowshipId;
            t.ajaxFn({
                url: t.path.getInfo,
                param: data,
                fn: function (rep) {
                    if (rep && rep.responseObject.responseData && rep.responseObject.responseData.data_list[0]) {
                        var dataList = rep.responseObject.responseData.data_list[0];
                        var items = dataList.customer_fellowship;
                        t.purposeRequestEn=items.purposeRequestEn;
                        t.purposeRequest=items.purposeRequest;
                        //报名基本信息
                        var evAddress = items.province + items.city + items.district + (items.detailAddress ? items.detailAddress : "");
                        if (items.isAgreeAdjust == 1) {
                            t.schoolContent = "报名志愿(同意调剂)：";
                        } else {
                            t.schoolContent = "报名志愿：";
                        }

                        //报名志愿学校进修和培训
                        if (dataList.fellowship_main_type == 1) {//国外的进修
                            t.baseInfoSchoolList();
                        } else if (dataList.fellowship_main_type == 2) {//国内的进修
                            if (dataList.customer_fellowship_major && !$.isEmptyObject(dataList.customer_fellowship_major)) {
                                var fDepartmentVal = "";
                                switch (parseInt(dataList.customer_fellowship_major.fellowshipDepartment)) {
                                    case 1:
                                        fDepartmentVal = "骨科";
                                        break;
                                    case 2:
                                        fDepartmentVal = "大外科";
                                        break;
                                    case 3:
                                        fDepartmentVal = "临床";
                                        break;
                                }
                                var fellowshipDate = "";
                                switch (parseInt(dataList.customer_fellowship_major.fellowshipDate)) {
                                    case 1:
                                        fellowshipDate = "两周";
                                        break;
                                    case 2:
                                        fellowshipDate = "一个月";
                                        break;
                                    case 3:
                                        fellowshipDate = "两个月";
                                        break;
                                    case 4:
                                        fellowshipDate = "三个月";
                                        break;
                                    case 5:
                                        fellowshipDate = "六个月";
                                        break;
                                    case 6:
                                        fellowshipDate = "十二个月";
                                        break;
                                }
                                $(".Ev-FellowSchool").show();
                                $(".Ev-fVolunteer").text(t.schoolContent);
                                $(".Ev-fDepartmentVal").text(fDepartmentVal);
                                $(".Ev-fProfessionVal").text(dataList.customer_fellowship_major.tagName);
                                $(".Ev-fTimeLimitVal").text(fellowshipDate);
                            }
                        } else if (dataList.fellowship_main_type == 3) {//培训课程
                            $(".Ev-FellowSchool").show();
                            $(".Ev-fVolunteer").text(t.schoolContent);
                            $(".Ev-fDepartment").text("培训方向");
                            $(".Ev-fDepartmentVal").text(dataList.customer_fellowship_major.tagName);
                            $(".Ev-fProfessionVal,.Ev-fProfession,.Ev-fTimeLimitVal,.Ev-fTimeLimit").hide();
                        }


                        $(".Ev-Mobile").text(items.mobile);
                        $(".Ev-WinXin").text(items.weixinCode ? items.weixinCode : "");
                        $(".Ev-Email").text(items.email);
                        $(".Ev-ZipCode").text(items.zipCode);
                        $(".Ev-Address").text(evAddress);

                        $(".Ev-CardNum").text(items.certificatesCode);//证件号
                        $(".Ev-practiceCode").text(items.practiceCode);//医师执业证号
                        $(".Ev-qualificationCode").text(items.qualificationCode);//医师资格证号

                        //单位性质
                        var companyTypeCon = "";
                        switch (parseInt(items.companyType)) {
                            case 1:
                                companyTypeCon = "国有事业单位";
                                break;
                            case 2:
                                companyTypeCon = "私营";
                                break;
                        }
                        $(".Ev-companyType").text(companyTypeCon);

                        //学员类型
                        var customerTypeCon = "";
                        switch (parseInt(items.customerType)) {
                            case 1:
                                customerTypeCon = "军人";
                                break;
                            case 2:
                                customerTypeCon = "地方人员";
                                break;
                        }
                        $(".Ev-customerType").text(customerTypeCon);

                        //证件类型请求
                        t.certificatesType(items.certificatesId);
                        //最高学历
                        t.highestDegree(items.highestDegree);

                        t.resumePreviewAjax();
                    }
                },
                error: function () {
                }
            });

            //头像
            t.ajaxFn({
                url: t.path.getLogo,
                param: {"refId": t.config.customerId, "logoType": 11},
                fn: function (rep) {
                    if (rep && rep.responseObject[0]) {
                        var item = rep.responseObject[0].logoUrl ? rep.responseObject[0].logoUrl : "//img10.allinmd.cn/default/customer/190_190.jpg";
                        $(".Ev-CustomerLogo img").attr("src", item);//头像

                    }
                },
                error: function () {
                }
            });
        },
        //报名基本信息中的志愿列表
        baseInfoSchoolList: function () {
            var t = this;
            var data = {};
            data.fellowshipId = t.config.fellowshipId;
            data.configType = 4;
            t.ajaxFn({
                url: t.path.subConfig,
                param: data,
                fn: function (rep) {
                    if (rep && rep.responseObject.fellowshipSubList) {
                        var items = rep.responseObject.fellowshipSubList;
                        t.schoolListAddHtm(items);
                    }
                },
                error: function () {
                }
            });
        },
        //报名基本信息中的志愿列表添加
        schoolListAddHtm: function (items) {
            var t = this, configListHtml;
            var data = {};
            data.customerId = t.config.customerId;
            data.fellowshipId = t.config.fellowshipId;
            t.ajaxFn({
                url: t.path.getSub,
                param: data,
                fn: function (rep) {
                    if (rep && rep.responseObject.responseData.data_list) {
                        var schoolLists = rep.responseObject.responseData.data_list;
                        $.each(items, function (index, ele) {//志愿字段
                            $.each(schoolLists, function (i, e) {//学校列表
                                if (ele.sortId == e.sortId) {
                                    configListHtml += '<tr><td class="releaseDefaultTextInfo"> ' + ele.configTitle + '</td>' +
                                        '<td colspan="4" class="releaseUserWriteInfo">' + e.fellowshipSubName + '</td>' +
                                        '</tr>';
                                    return false;
                                }
                            });
                        });
                        $(".Ev-FellowSchool").show().html('<tr><td colspan="5" class="volunteerText Ev-FellowSchool">' + t.schoolContent + '</td></tr>' +
                            configListHtml);
                    }
                },
                error: function () {
                }
            });
        },
        //中英文简历预览
        resumePreviewAjax: function () {
            var t = this;
            var data = {};
            data.customerId = t.config.customerId;
            data.fellowshipId = t.config.fellowshipId;
            data.logoUseFlag = UseFlag.d;
            t.ajaxFn({
                url: t.path.unitInfo,
                param: data,
                fn: function (rep) {
                    if (rep && rep.responseObject.responseData.data_list[0]) {
                        var items = rep.responseObject.responseData.data_list[0];
                        $(".Ev-TabBtn").eq(t.config.languageFlag).addClass("Ev-HasAjaxContent active").siblings().removeClass("active");
                        if (t.config.languageFlag == 0) {//中文
                            $(".Ev-AppendChResume").show();
                            $(".Ev-AppendEnResume").hide();
                            t.chResumeCallFun(items);
                        } else {//英文
                            $(".Ev-AppendChResume").hide();
                            $(".Ev-AppendEnResume").show();
                            t.enResumeCallFun(items);
                        }
                        //中英文简历的切换
                        t.tabClickBtn(items);
                    }
                },
                error: function () {
                }
            });
        },
        //中文简历调用函数
        chResumeCallFun: function (items) {
            var t = this;
            //中文简历基本信息
            t.chResumeContent(items);
            //中文简历的工作列表
            t.chResumeWorkList();
            //中文简历中的教育经历
            t.chResumeEducation();
            //中文简历中的继续教育经历
            t.chResumeConEdu();
            //中文简历中的荣誉获得
            t.chResumeRewards();
            //中文简历中的科研基金
            t.chResumeFounding();
            //中文简历中的社会职责
            t.chResumeSocial();
            //中文简历中的学术专著
            t.chResumeOpus();
            //中文简历中的发明专利
            t.chResumePatent();
            //中文简历中的语言能力证明
            t.chResumeLanguage();
        },
        //英文简历调用函数
        enResumeCallFun: function (items) {
            var t = this;
            //英文简历基本信息
            t.enResumeContent(items);
            //英文简历的工作列表
            t.enResumeWorkList();
            //英文简历中的教育经历
            t.enResumeEducation();
            //英文简历中的继续教育经历
            t.enResumeConEdu();
            //英文简历中的荣誉获得
            t.enResumeRewards();
            //英文简历中的科研基金
            t.enResumeFounding();
            //英文简历中的社会职责
            t.enResumeSocial();
            //英文简历中的学术专著
            t.enResumeOpus();
            //英文简历中的发明专利
            t.enResumePatent();
            //英文简历中的语言能力证明
            t.enResumeLanguage();
        },
        //1.中文简历基本信息
        chResumeContent: function (kv) {
            var t=this;
            var customerName;//姓名
            if ((!$.isEmptyObject(kv.customer_fellowship.lastName) && kv.customer_fellowship.lastName) || (!$.isEmptyObject(kv.customer_fellowship.firstName) && kv.customer_fellowship.firstName)) {
                customerName = kv.customer_fellowship.lastName + kv.customer_fellowship.firstName;
            } else {
                if ((!$.isEmptyObject(kv.customer_auth.lastName) && kv.customer_auth.lastName) || (!$.isEmptyObject(kv.customer_auth.firstName) && kv.customer_auth.firstName)) {
                    customerName = kv.customer_auth.lastName + kv.customer_auth.firstName;
                } else {
                    customerName = ""
                }
            }
            $(".Ev-CustomerName").text(customerName);

            var sexContent;//性别
            if (kv.customer_baseinfo.sexId) {
                if (kv.customer_baseinfo.sexId == 1) {
                    sexContent = "男";
                } else if (kv.customer_baseinfo.sexId == 2) {
                    sexContent = "女";
                } else {
                    sexContent = "";
                }
            } else {
                sexContent = "";
            }
            $(".Ev-SexContent").text(sexContent);

            var birthday;//生日
            if (!$.isEmptyObject(kv.customer_baseinfo.birthday) && kv.customer_baseinfo.birthday) {
                birthday = kv.customer_baseinfo.birthday.replace(/-/g, "/");
            } else {
                birthday = "";
            }
            $(".Ev-Birthday").text(birthday);

            var medicalTitle;//职称
            if (!$.isEmptyObject(kv.customer_fellowship.medicalTitle) && kv.customer_fellowship.medicalTitle) {
                medicalTitle = comm.cutLine(kv.customer_fellowship.medicalTitle, "_", ",");
            } else {
                if (!$.isEmptyObject(kv.customer_auth.medicalTitle) && kv.customer_auth.medicalTitle) {
                    medicalTitle = comm.cutLine(kv.customer_auth.medicalTitle, "_", ",");
                } else {
                    medicalTitle = "";
                }
            }
            $(".Ev-MedicalTitle").text(medicalTitle);

            var company;//医院
            if (!$.isEmptyObject(kv.customer_fellowship.company) && kv.customer_fellowship.company) {
                company = kv.customer_fellowship.company;
            } else {
                if (!$.isEmptyObject(kv.customer_auth.company) && kv.customer_auth.company) {
                    company = kv.customer_auth.company;
                } else {
                    company = "";
                }
            }
            $(".Ev-Company").text(company);


            var nativePlace;//籍贯
            if (!$.isEmptyObject(kv.customer_baseinfo.nativePlace) && $.trim(kv.customer_baseinfo.nativePlace)) {
                nativePlace = kv.customer_baseinfo.nativePlace;
            } else {
                nativePlace = "";
            }
            $(".Ev-nativePlace").text(nativePlace);

            var nationality;//民族
            if (!$.isEmptyObject(kv.customer_baseinfo.nationality) && $.trim(kv.customer_baseinfo.nationality)) {
                nationality = kv.customer_baseinfo.nationality;
            } else {
                nationality = "";
            }
            $(".Ev-nationality").text(nationality);

            var politicsStatus;//政治面貌
            if (!$.isEmptyObject(kv.customer_baseinfo.politicsStatus) && $.trim(kv.customer_baseinfo.politicsStatus)) {
                politicsStatus = kv.customer_baseinfo.politicsStatus;
            } else {
                politicsStatus = "";
            }
            $(".Ev-politicsStatus").text(politicsStatus);

            var baseInfoSummary;//个人简介
            if (!$.isEmptyObject(kv.customer_baseinfo.summary) && $.trim(kv.customer_baseinfo.summary)) {
                baseInfoSummary = kv.customer_baseinfo.summary;
            } else {
                baseInfoSummary = "";
            }
            $(".Ev-BaseInfoSummary").text(baseInfoSummary);

            //学习目标
            $(".Ev-purposeRequest").text(t.purposeRequest);
        },
        //2.中文简历工作列表
        chResumeWorkList: function () {
            var t = this;
            var occupationListHtml = "";
            $.ajax({
                url: t.path.workList,
                type: "POST",
                data: {dataFlag: 2, languageFlag: 0},
                dataType: "json",
                success: function (rep) {
                    if (rep && rep.responseObject.responseData.data_list) {
                        var items = rep.responseObject.responseData.data_list;
                        //中文简历中的工作经历
                        var workPlace, workStartTime, workEndTime, workTime, medicalTitle;
                        $.each(items, function (index2, ele2) {
                            if (!$.isEmptyObject(ele2.address) && $.trim(ele2.address)) {
                                workPlace = '工作地点：<span>' + htmlToString(ele2.address) + '</span><i>|</i>';
                            } else {
                                workPlace = "";
                            }
                            workStartTime = ele2.startTime.substring(0, 7);
                            workEndTime = ele2.endTime.substring(0, 7);
                            if (ele2.upNow) {
                                workTime = workStartTime + " ～ 至今";
                            } else {
                                workTime = workStartTime + " ～ " + workEndTime;
                            }
                            medicalTitle = comm.cutLine(ele2.medicalTitle, "_", ",");
                            occupationListHtml += '<dl>' +
                                '<dd class="previewPublic clearFloat"><div class="previewBg workBg"></div>' +
                                '<p>工作单位：<span>' + htmlToString(ele2.unit) + '</span></p>' +
                                '<p class="intro">' +
                                workPlace +
                                '任职时间：<span>' + workTime + '</span><i>|</i>' +
                                '所在科室：<span>' + htmlToString(ele2.department) + '</span><i>|</i>' +
                                '职称：<span>' + medicalTitle + '</span></p></dd>' +
                                '</dl>';
                        });
                        $(".Ev-AppendWorkList,.Ev-occupationTitle").show();
                        $(".Ev-AppendWorkList").html(occupationListHtml);
                    } else {
                        $(".Ev-AppendWorkList,.Ev-occupationTitle").hide();
                    }
                },
                error: function () {
                }
            });
        },
        //3.中文简历的教育经历
        chResumeEducation: function () {
            var t = this;
            var educationListHtml = "";
            $.ajax({
                url: t.path.eduList,
                type: "POST",
                data: {dataFlag: 2, languageFlag: 0},
                dataType: "json",
                success: function (rep) {
                    if (rep && rep.responseObject.responseData.data_list) {
                        var items = rep.responseObject.responseData.data_list;
                        var schoolCity, studyStartTime, studyEndTime, studyTime;
                        $.each(items, function (index3, ele3) {
                            if ($.trim(ele3.city) && !$.isEmptyObject(ele3.city)) {
                                schoolCity = '<i>|</i>就读城市：<span>' + htmlToString(ele3.city) + '</span>';
                            } else {
                                schoolCity = "";
                            }
                            studyStartTime = ele3.startTime.substring(0, 7);
                            studyEndTime = ele3.endTime.substring(0, 7);
                            if (ele3.upNow) {
                                studyTime = studyStartTime + " ～ 至今";
                            } else {
                                studyTime = studyStartTime + " ～ " + studyEndTime;
                            }

                            educationListHtml += '<dl>' +
                                '<dd class="previewPublic clearFloat"><div class="previewBg studyBg"></div>' +
                                '<p>学校名称：<span>' + htmlToString(ele3.university) + '</span></p>' +
                                '<p class="intro">' +
                                '所学专业：<span>' + htmlToString(ele3.major) + '</span><i>|</i>' +
                                '就读时间：<span>' + studyTime + '</span><i>|</i>' +
                                '获得学历：<span>' + ele3.education + '</span>' +
                                schoolCity + '</p></dd>' +
                                '</dl>';
                        });
                        $(".Ev-AppendEduList,.Ev-educationTtile").show();
                        $(".Ev-AppendEduList").html(educationListHtml);
                    } else {
                        $(".Ev-AppendEduList,.Ev-educationTtile").hide();
                    }
                },
                error: function () {
                }
            });
        },
        //4.中文简历的继续教育
        chResumeConEdu: function () {
            var t = this;
            var conEducationListHtml = "";
            $.ajax({
                url: t.path.conEduList,
                type: "POST",
                data: {dataFlag: 2, languageFlag: 0},
                dataType: "json",
                success: function (rep) {
                    if (rep && rep.responseObject.responseData.data_list) {
                        var items = rep.responseObject.responseData.data_list;
                        var conEduContent, conEduStartTime, conEduEndTime,certificateContent;
                        $.each(items, function (index4, ele4) {
                            conEduStartTime = ele4.startTime.substring(0, 7);
                            conEduEndTime = ele4.endTime.substring(0, 7);
                            if ($.trim(ele4.cmeDesc) && !$.isEmptyObject(ele4.cmeDesc)) {
                                conEduContent = '<span style="color:#8d8d8d;">培训内容：</span>' +
                                    '<span>' + htmlToString(ele4.cmeDesc) + '</span>' +
                                    '<i>|</i>';
                            } else {
                                conEduContent = "";
                            }
                            if ($.trim(ele4.certificate) && !$.isEmptyObject(ele4.certificate)) {
                                certificateContent = '<span style="color:#8d8d8d;">获得证书：</span>' +
                                    '<span>' + htmlToString(ele4.certificate) + '</span>' +
                                    '<i>|</i>';
                            } else {
                                certificateContent = "";
                            }

                            conEducationListHtml += '<dl>' +
                                '<dd class="previewPublic clearFloat"><div class="previewBg otherBg"></div>' +
                                '<p>学术机构：<span>' + htmlToString(ele4.organization) + '</span></p>' +
                                '<p class="intro">' +
                                conEduContent +
                                certificateContent +
                                '开始时间：<span>' + conEduStartTime + '</span><i>|</i>' +
                                '结束时间：<span> ' + conEduEndTime + '</span></p></dd>' +
                                '</dl>';
                        });
                        $(".Ev-AppendConEduList,.Ev-conEducationTitle").show();
                        $(".Ev-AppendConEduList").html(conEducationListHtml);
                    } else {
                        $(".Ev-AppendConEduList,.Ev-conEducationTitle").hide();
                    }
                },
                error: function () {
                }
            });
        },
        //5.中文简历中的荣誉获得
        chResumeRewards: function () {
            var t = this;
            var honorListHtml = "";
            $.ajax({
                url: t.path.honorList,
                type: "POST",
                data: {dataFlag: 2, languageFlag: 0},
                dataType: "json",
                success: function (rep) {
                    if (rep && rep.responseObject.responseData.data_list) {
                        var items = rep.responseObject.responseData.data_list;
                        $.each(items, function (index5, ele5) {
                            honorListHtml += '<dl>' +
                                '<dd class="previewPublic clearFloat">' +
                                '<div class="previewBg honorBg"></div>' +
                                '<p>荣誉名称：<span>' + htmlToString(ele5.honorName) + '</span></p>' +
                                '<p class="intro">' +
                                '颁发机构：<span>' + htmlToString(ele5.awardDepartment) + '</span><i>|</i>' +
                                '获得时间：<span>' + ele5.awardYear + '</span>' +
                                '</p></dd>' +
                                '</dl>';
                        });
                        $(".Ev-AppendHonorList,.Ev-honorTitle").show();
                        $(".Ev-AppendHonorList").html(honorListHtml);
                    } else {
                        $(".Ev-AppendHonorList,.Ev-honorTitle").hide();
                    }
                },
                error: function () {
                }
            });
        },
        //6.简历中的科研基金
        chResumeFounding: function () {
            var t = this;
            var foundingListHtml = "";
            $.ajax({
                url: t.path.foundingList,
                type: "POST",
                data: {dataFlag: 2, languageFlag: 0},
                dataType: "json",
                success: function (rep) {
                    if (rep && rep.responseObject.responseData.data_list) {
                        var items = rep.responseObject.responseData.data_list;
                        $.each(items, function (index6, ele6) {
                            foundingListHtml += '<dl>' +
                                '<dd class="previewPublic clearFloat">' +
                                '<div class="previewBg foundingBg"></div>' +
                                '<p>名称：<span>' + htmlToString(ele6.fundName) + '</span></p>' +
                                '<p class="intro">' +
                                '项目号：<span>' + htmlToString(ele6.fundCode) + '</span><i>|</i>' +
                                '批注年度：<span>' + ele6.approvalTime.substring(0, 4) + '</span>' +
                                '</p></dd>' +
                                '</dl>';
                        });
                        $(".Ev-AppendFoundingList,.Ev-fundTitle").show();
                        $(".Ev-AppendFoundingList").html(foundingListHtml);
                    } else {
                        $(".Ev-AppendFoundingList,.Ev-fundTitle").hide();
                    }
                },
                error: function () {
                }
            });
        },
        //7.中文简历中的社会职责
        chResumeSocial: function () {
            var t = this;
            var socialListHtml = "";
            $.ajax({
                url: t.path.socialList,
                type: "POST",
                data: {dataFlag: 2, languageFlag: 0},
                dataType: "json",
                success: function (rep) {
                    if (rep && rep.responseObject.responseData.data_list) {
                        var items = rep.responseObject.responseData.data_list;
                        var socialTime;
                        $.each(items, function (index7, ele7) {
                            if (ele7.upNow) {
                                socialTime = ele7.startTime.substring(0, 4) + '.' + ele7.startTime.substring(5, 7) + " ～ 至今";
                            } else {
                                socialTime = ele7.startTime.substring(0, 4) + '.' + ele7.startTime.substring(5, 7) + " ～ " + ele7.endTime.substring(0, 4) + '.' + ele7.endTime.substring(5, 7);
                            }
                            socialListHtml += '<dl>' +
                                '<dd class="previewPublic clearFloat">' +
                                '<div class="previewBg socialBg"></div>' +
                                '<p>机构名称：<span>' + htmlToString(ele7.organization) + '</span></p>' +
                                '<p class="intro">' +
                                '职位名称：<span>' + htmlToString(ele7.socialTitle) + '</span><i>|</i>' +
                                '任职时间：<span>' + socialTime + '</span>' +
                                '</p></dd>' +
                                '</dl>';
                        });
                        $(".Ev-AppendSocialList,.Ev-socialTitle").show();
                        $(".Ev-AppendSocialList").html(socialListHtml);
                    } else {
                        $(".Ev-AppendSocialList,.Ev-socialTitle").hide();
                    }
                },
                error: function () {
                }
            });

        },
        //8.中文简历中的学术专著
        chResumeOpus: function () {
            var t = this;
            var opusListHtml = "";
            $.ajax({
                url: t.path.opusList,
                type: "POST",
                data: {dataFlag: 2, languageFlag: 0},
                dataType: "json",
                success: function (rep) {
                    if (rep && rep.responseObject.responseData.data_list) {
                        var items = rep.responseObject.responseData.data_list;
                        var information, authorType="", createTime;
                        $.each(items, function (index8, ele8) {
                            if ($.trim(ele8.information) && !$.isEmptyObject(ele8.information)) {
                                information = '<i>|</i>引用信息：<span>' + htmlToString(ele8.information) + '</span>';
                            } else {
                                information = "";
                            }
                            switch (ele8.authorType) {
                                case 1:
                                    authorType = "第一作者";
                                    break;
                                case 2:
                                    authorType = "第一译者";
                                    break;
                                case 3:
                                    authorType = "联合作者";
                                    break;
                                case 4:
                                    authorType = "联合译者";
                                    break;
                            }
                            opusListHtml += '<dl>' +
                                '<dd class="previewPublic clearFloat">' +
                                '<div class="previewBg opusBg"></div>' +
                                '<p>学术标题：<span>' + htmlToString(ele8.opusName) + '</span></p>' +
                                '<p class="intro">' +
                                '作者身份：<span>' + authorType + '</span><i>|</i>' +
                                '出版机构：<span>' + htmlToString(ele8.publisher) + '</span><i>|</i>' +
                                '出版时间：<span>' + ele8.publicationTime.substring(0, 7) + '</span>' +
                                information +
                                '</p></dd>' +
                                '</dl>';
                        });
                        $(".Ev-AppendOpusList,.Ev-opusTitle").show();
                        $(".Ev-AppendOpusList").html(opusListHtml);
                    } else {
                        $(".Ev-AppendOpusList,.Ev-opusTitle").hide();
                    }
                },
                error: function () {
                }
            });
        },
        //9.中文简历中的发明专利
        chResumePatent: function () {
            var t = this;
            var patentListHtml = "";
            $.ajax({
                url: t.path.patentList,
                type: "POST",
                data: {dataFlag: 2, languageFlag: 0},
                dataType: "json",
                success: function (rep) {
                    if (rep && rep.responseObject.responseData.data_list) {
                        var items = rep.responseObject.responseData.data_list;
                        $.each(items, function (index9, ele9) {
                            patentListHtml += '<dl>' +
                                '<dd class="previewPublic clearFloat">' +
                                '<div class="previewBg patentBg"></div>' +
                                '<p>专利名称：<span>' + htmlToString(ele9.patentName) + '</span></p>' +
                                '<p class="intro">' +
                                '专利编号：<span>' + ele9.patentCode + '</span><i>|</i>' +
                                '公告日期：<span>' + ele9.patentTime.substring(0, 7) + '</span><i>|</i>' +
                                '注册国家：<span>' + ele9.country + '</span>' +
                                '</p></dd>' +
                                '</dl>';
                        });
                        $(".Ev-AppendPatentList,.Ev-patentTitle").show();
                        $(".Ev-AppendPatentList").html(patentListHtml);
                    } else {
                        $(".Ev-AppendPatentList,.Ev-patentTitle").hide();
                    }
                },
                error: function () {
                }
            });
        },

        //10.中文简历中语言能力证明
        chResumeLanguage: function () {
            var t = this;
            var languageListHtml = "";
            $.ajax({
                url: t.path.languageListUrl,
                type: "POST",
                data: {paramJson: $.toJSON({dataFlag: 2, languageFlag: 0})},
                dataType: "json",
                success: function (rep) {
                    if (rep && rep.responseObject&&!$.isEmptyObject(rep.responseObject)) {
                        var items = rep.responseObject;
                        $.each(items, function (index10, ele10) {
                            languageListHtml += '<dl>' +
                                '<dd class="previewPublic clearFloat">' +
                                '<div class="languageIcon"></div><p>语言能力：<span>' + ele10.languageName + '</span></p>' +
                                '<p class="intro">' +
                                '获得时间：<span>' + ele10.awardYear + '</span></p>' +
                                '</dd>' +
                                '</dl>';
                        });
                        $(".Ev-AppendLanguageList,.Ev-languageTitle").show();
                        $(".Ev-AppendLanguageList").html(languageListHtml);
                    } else {
                        $(".Ev-AppendLanguageList,.Ev-languageTitle").hide();
                    }
                },
                error: function () {
                }
            });
        },
        //1.英文简历基本信息
        enResumeContent: function (kv) {
            var t=this;

            var registAddressEn;
            if($.trim(kv.customer_baseinfo.registAddressEn)&&!$.isEmptyObject(kv.customer_baseinfo.registAddressEn)){
                registAddressEn=kv.customer_baseinfo.registAddressEn;
            }else{
                registAddressEn="";
            }
            $(".Ev-enAddress").text(registAddressEn);

            var customerName;//姓名
            if ((!$.isEmptyObject(kv.customer_fellowship.lastNameEn) && kv.customer_fellowship.lastNameEn) && (!$.isEmptyObject(kv.customer_fellowship.firstNameEn) && kv.customer_fellowship.firstNameEn)) {
                customerName = kv.customer_fellowship.firstNameEn + ' ' + kv.customer_fellowship.lastNameEn;
            } else {
                if ((!$.isEmptyObject(kv.customer_auth.lastNameEn) && kv.customer_auth.lastNameEn) && (!$.isEmptyObject(kv.customer_auth.firstNameEn) && kv.customer_auth.firstNameEn)) {
                    customerName = kv.customer_auth.firstNameEn + ' ' + kv.customer_auth.lastNameEn;
                } else {
                    customerName = ""
                }
            }
            $(".Ev-EnCustomerName").text(customerName);

            var sexContent;//性别
            if (kv.customer_baseinfo.sexId) {
                if (kv.customer_baseinfo.sexId == 1) {
                    sexContent = "Male";
                } else if (kv.customer_baseinfo.sexId == 2) {
                    sexContent = "Female";
                } else {
                    sexContent = "";
                }
            } else {
                sexContent = "";
            }
            $(".Ev-EnSexContent").text(sexContent);

            var birthday;//生日
            if (!$.isEmptyObject(kv.customer_baseinfo.birthday) && kv.customer_baseinfo.birthday) {
                birthday = getEnTime({'date': kv.customer_baseinfo.birthday});
            } else {
                birthday = "";
            }
            $(".Ev-EnBirthday").text(birthday.year + '.' + birthday.month);

            var medicalTitle;//职称
            if (!$.isEmptyObject(kv.customer_fellowship.medicalTitleEn) && kv.customer_fellowship.medicalTitleEn) {
                medicalTitle = comm.cutLine(kv.customer_fellowship.medicalTitleEn, "_", ",");
            } else {
                if (!$.isEmptyObject(kv.customer_auth.medicalTitleEn) && kv.customer_auth.medicalTitleEn) {
                    medicalTitle = comm.cutLine(kv.customer_auth.medicalTitleEn, "_", ",");
                } else {
                    medicalTitle = "";
                }
            }
            $(".Ev-EnMedicalTitle").text(medicalTitle);

            var company;//医院
            if (!$.isEmptyObject(kv.customer_fellowship.companyEn) && kv.customer_fellowship.companyEn) {
                company = kv.customer_fellowship.companyEn;
            } else {
                if (!$.isEmptyObject(kv.customer_auth.companyEn) && kv.customer_auth.companyEn) {
                    company = kv.customer_auth.companyEn;
                } else {
                    company = "";
                }
            }
            $(".Ev-EnCompany").text(company);

            var baseInfoSummary;//个人简介
            if (!$.isEmptyObject(kv.customer_baseinfo.summaryEn) && $.trim(kv.customer_baseinfo.summaryEn)) {
                baseInfoSummary = kv.customer_baseinfo.summaryEn;
            } else {
                baseInfoSummary = "";
            }
            $(".Ev-EnBaseInfoSummary").text(htmlToString(baseInfoSummary));

            //学习目标
            $(".Ev-EnPurposeRequest").text(t.purposeRequestEn);
        },
        //2.英文简历的工作列表
        enResumeWorkList: function () {
            var t = this;
            var enOccupationListHtml = "";
            $.ajax({
                url: t.path.workList,
                type: "POST",
                data: {dataFlag: 2, languageFlag: 1},
                dataType: "json",
                success: function (rep) {
                    if (rep && rep.responseObject.responseData.data_list) {
                        var items = rep.responseObject.responseData.data_list;
                        var workPlace, workStartTime, workEndTime, workTime, medicalTitle;
                        $.each(items, function (index2, ele2) {
                            if (!$.isEmptyObject(ele2.address) && $.trim(ele2.address)) {
                                workPlace = '<span style="color:#8d8d8b;">Location: </span>' +
                                    '<span>' + htmlToString(ele2.address) + '</span>' +
                                    '<i>|</i>';
                            } else {
                                workPlace = "";
                            }
                            workStartTime = getEnTime({'date': ele2.startTime});
                            workEndTime = getEnTime({'date': ele2.endTime});
                            if (ele2.upNow) {
                                workTime = workStartTime.year + '.' + workStartTime.month + " ～ Till Now";
                            } else {
                                workTime = workStartTime.year + '.' + workStartTime.month + " ～ " + workEndTime.year + '.' + workEndTime.month;
                            }
                            medicalTitle = comm.cutLine(ele2.medicalTitle, "_", ",");
                            enOccupationListHtml += '<dl>' +
                                '<dd class="previewPublic clearFloat"><div class="previewBg workBg"></div>' +
                                '<p>Employer：<span>' + htmlToString(ele2.unit) + '</span></p>' +
                                '<p class="intro">' +
                                workPlace +
                                'Term of Office: <span>' + workTime + '</span><i>|</i>' +
                                'department: <span>' + htmlToString(ele2.department) + '</span><i>|</i>' +
                                'Title:<span>' + medicalTitle + '</span></p></dd>' +
                                '</dl>';
                        });
                        $(".Ev-EnAppendWorkList,.Ev-enOccupationTitle").show();
                        $(".Ev-EnAppendWorkList").html(enOccupationListHtml);
                    } else {
                        $(".Ev-EnAppendWorkList,.Ev-enOccupationTitle").hide();
                    }
                },
                error: function () {
                }
            });

        },
        //3.英文简历中的教育经历
        enResumeEducation: function () {
            var t = this;
            var enEducationListHtml = "";
            $.ajax({
                url: t.path.eduList,
                type: "POST",
                data: {dataFlag: 2, languageFlag: 1},
                dataType: "json",
                success: function (rep) {
                    if (rep && rep.responseObject.responseData.data_list) {
                        var items = rep.responseObject.responseData.data_list;
                        var schoolCity, studyStartTime, studyEndTime, studyTime;
                        $.each(items, function (index3, ele3) {
                            if ($.trim(ele3.city) && !$.isEmptyObject(ele3.city)) {
                                schoolCity = '<i>|</i>Location: <span>' + ele3.city + '</span>';
                            } else {
                                schoolCity = "";
                            }
                            studyStartTime = getEnTime({'date': ele3.startTime});
                            studyEndTime = getEnTime({'date': ele3.endTime});
                            if (ele3.upNow) {
                                studyTime = studyStartTime.year + '.' + studyStartTime.month + " ～ Till Now";
                            } else {
                                studyTime = studyStartTime.year + '.' + studyStartTime.month + " ～ " + studyEndTime.year + '.' + studyEndTime.month;
                            }

                            enEducationListHtml += '<dl>' +
                                '<dd class="previewPublic clearFloat"><div class="previewBg studyBg"></div>' +
                                '<p>School: <span>'+ htmlToString(ele3.university) +'</span></p>' +
                                '<p class="intro">' +
                                'Major: <span>' + htmlToString(ele3.major) + '</span><i>|</i>' +
                                'Period:<span>' + studyTime + '</span><i>|</i>' +
                                'Degree: <span>' + htmlToString(ele3.education) + '</span>' +
                                schoolCity + '</p></dd>' +
                                '</dl>';
                        });
                        $(".Ev-EnAppendEduList,.Ev-enEducationTitle").show();
                        $(".Ev-EnAppendEduList").html(enEducationListHtml);
                    } else {
                        $(".Ev-EnAppendEduList,.Ev-enEducationTitle").hide();
                    }
                },
                error: function () {
                }
            });

        },
        //4.英文简历中的继续教育经历
        enResumeConEdu: function () {
            var t = this;
            var enConEducationListHtml = "";
            $.ajax({
                url: t.path.conEduList,
                type: "POST",
                data: {dataFlag: 2, languageFlag: 1},
                dataType: "json",
                success: function (rep) {
                    if (rep && rep.responseObject.responseData.data_list) {
                        var items = rep.responseObject.responseData.data_list;
                        var conEduContent, conEduStartTime, conEduEndTime, certificateContent;
                        $.each(items, function (index4, ele4) {
                            conEduStartTime = getEnTime({'date': ele4.startTime});
                            conEduEndTime = getEnTime({'date': ele4.endTime});
                            if ($.trim(ele4.cmeDesc) && !$.isEmptyObject(ele4.cmeDesc)) {//培训内容
                                conEduContent = '<span style="color:#8d8d8d;">Subject: </span>' +
                                    '<span>' + htmlToString(ele4.cmeDesc) + '</span>' +
                                    '<i>|</i>';
                            } else {
                                conEduContent = "";
                            }
                            if ($.trim(ele4.certificate) && !$.isEmptyObject(ele4.certificate)) {//证书
                                certificateContent = '<span style="color:#8d8d8d;">Certificate: </span>' +
                                    '<span>' + htmlToString(ele4.certificate) + '</span>' +
                                    '<i>|</i>';
                            } else {
                                certificateContent = "";
                            }
                            enConEducationListHtml += '<dl>' +
                                '<dd class="previewPublic clearFloat"><div class="previewBg otherBg"></div>' +
                                '<p>Institute：<span>' + htmlToString(ele4.organization) + '</span></p>' +
                                '<p class="intro">' +
                                conEduContent +
                                'From：<span>' + conEduStartTime.year + '.' + conEduStartTime.month + '</span><i>|</i>' +
                                'Till: <span>' + conEduEndTime.year + '.' + conEduEndTime.month + '</span>' +
                                '</p></dd>' +
                                '</dl>';
                        });
                        $(".Ev-EnAppendConEduList,.Ev-enConEduTitle").show();
                        $(".Ev-EnAppendConEduList").html(enConEducationListHtml);
                    } else {
                        $(".Ev-EnAppendConEduList,.Ev-enConEduTitle").hide();
                    }
                },
                error: function () {
                }
            });
        },
        //5.英文简历中的荣誉获得
        enResumeRewards: function () {
            var t = this;
            var honorListHtml = "";
            $.ajax({
                url: t.path.honorList,
                type: "POST",
                data: {dataFlag: 2, languageFlag: 1},
                dataType: "json",
                success: function (rep) {
                    if (rep && rep.responseObject.responseData.data_list) {
                        var items = rep.responseObject.responseData.data_list;
                        $.each(items, function (index5, ele5) {
                            honorListHtml += '<dl>' +
                                '<dd class="previewPublic clearFloat"><div class="previewBg honorBg"></div>' +
                                '<p>Name：<span>' + htmlToString(ele5.honorName) + '</span></p>' +
                                '<p class="intro">' +
                                'Issued By：<span>' + htmlToString(ele5.awardDepartment) + '</span><i>|</i>' +
                                'Rewarded at： <span>' + ele5.awardYear + '</span>' +
                                '</p></dd>' +
                                '</dl>';
                        });
                        $(".Ev-EnAppendHonorList,.Ev-enHonorTitle").show();
                        $(".Ev-EnAppendHonorList").html(honorListHtml);
                    } else {
                        $(".Ev-EnAppendHonorList,.Ev-enHonorTitle").hide();
                    }
                },
                error: function () {
                }
            });
        },
        //6.英文简历中的科研基金
        enResumeFounding: function () {
            var t = this;
            var foundingListHtml = "";
            $.ajax({
                url: t.path.foundingList,
                type: "POST",
                data: {dataFlag: 2, languageFlag: 1},
                dataType: "json",
                success: function (rep) {
                    if (rep && rep.responseObject.responseData.data_list) {
                        var items = rep.responseObject.responseData.data_list;
                        $.each(items, function (index6, ele6) {
                            foundingListHtml += '<dl>' +
                                '<dd class="previewPublic clearFloat"><div class="previewBg foundingBg"></div>' +
                                '<p>Name：<span>' + htmlToString(ele6.fundName) + '</span></p>' +
                                '<p class="intro">' +
                                'No.：<span>' + htmlToString(ele6.fundCode) + '</span><i>|</i>' +
                                'Issued at： <span>' + ele6.approvalTime.substring(0, 4) + '</span>' +
                                '</p></dd>' +
                                '</dl>';
                        });
                        $(".Ev-EnAppendFoundingList,.Ev-enFundTitle").show();
                        $(".Ev-EnAppendFoundingList").html(foundingListHtml);
                    } else {
                        $(".Ev-EnAppendFoundingList,.Ev-enFundTitle").hide();
                    }
                },
                error: function () {
                }
            });
        },
        //7.英文简历中的社会职责
        enResumeSocial: function () {
            var t = this;
            var socialListHtml = "";
            $.ajax({
                url: t.path.socialList,
                type: "POST",
                data: {dataFlag: 2, languageFlag: 1},
                dataType: "json",
                success: function (rep) {
                    if (rep && rep.responseObject.responseData.data_list) {
                        var items = rep.responseObject.responseData.data_list;
                        var socialTime, socialStartTime, socialEndTime;
                        $.each(items, function (index7, ele7) {
                            socialStartTime = getEnTime({'date': ele7.startTime});
                            socialEndTime = getEnTime({'date': ele7.endTime});
                            if (ele7.upNow) {
                                socialTime = socialStartTime.year + '.' + socialStartTime.month + " ～ Till Now";
                            } else {
                                socialTime = socialStartTime.year + '.' + socialStartTime.month + " ～ " + socialEndTime.year + '.' + socialEndTime.month;
                            }
                            socialListHtml += '<dl>' +
                                '<dd class="previewPublic clearFloat"><div class="previewBg socialBg"></div>' +
                                '<p>Institute：<span>' + htmlToString(ele7.organization) + '</span></p>' +
                                '<p class="intro">' +
                                'Position：<span>' + htmlToString(ele7.socialTitle) + '</span><i>|</i>' +
                                'Term of Office： <span>' + socialTime + '</span>' +
                                '</p></dd>' +
                                '</dl>';
                        });
                        $(".Ev-EnAppendSocialList,.Ev-enSocialTitle").show();
                        $(".Ev-EnAppendSocialList").html(socialListHtml);
                    } else {
                        $(".Ev-EnAppendSocialList,.Ev-enSocialTitle").hide();
                    }
                },
                error: function () {
                }
            });
        },
        //8.英文简历中的学术专著
        enResumeOpus: function () {
            var t = this;
            var opusListHtml = "";
            $.ajax({
                url: t.path.opusList,
                type: "POST",
                data: {dataFlag: 2, languageFlag: 1},
                dataType: "json",
                success: function (rep) {
                    if (rep && rep.responseObject.responseData.data_list) {
                        var items = rep.responseObject.responseData.data_list;
                        var information, authorType="", opusCreateTime;
                        $.each(items, function (index8, ele8) {
                            if ($.trim(ele8.information) && !$.isEmptyObject(ele8.information)) {
                                information = '<i>|</i>Citation Information：<span>' + ele8.information + '</span>';
                            } else {
                                information = "";
                            }
                            opusCreateTime = getEnTime({'date': ele8.publicationTime});
                            switch (ele8.authorType) {
                                case 1:
                                    authorType = "First Author";
                                    break;
                                case 2:
                                    authorType = "First Translator";
                                    break;
                                case 3:
                                    authorType = "Joint Author";
                                    break;
                                case 4:
                                    authorType = "Joint Translator";
                                    break;
                            }
                            opusListHtml += '<dl>' +
                                '<dd class="previewPublic clearFloat"><div class="previewBg opusBg"></div>' +
                                '<p>Title：<span>' + htmlToString(ele8.opusName) + '</span></p>' +
                                '<p class="intro">' +
                                'As：<span>' + authorType + '</span><i>|</i>' +
                                'Publisher： <span>' + htmlToString(ele8.publisher) + '</span><i>|</i>' +
                                'Time of Publishing: <span>' + opusCreateTime.year + '.' + opusCreateTime.month + '</span>' +
                                information +
                                '</p></dd>' +
                                '</dl>';
                        });
                        $(".Ev-EnAppendOpusList,.Ev-enOpusTitle").show();
                        $(".Ev-EnAppendOpusList").html(opusListHtml);
                    } else {
                        $(".Ev-EnAppendOpusList,.Ev-enOpusTitle").hide();
                    }
                },
                error: function () {
                }
            });
        },
        //9.英文简历中的发明专利
        enResumePatent: function () {
            var t = this;
            var patentListHtml = "";
            $.ajax({
                url: t.path.patentList,
                type: "POST",
                data: {dataFlag: 2, languageFlag: 1},
                dataType: "json",
                success: function (rep) {
                    if (rep && rep.responseObject.responseData.data_list) {
                        var items = rep.responseObject.responseData.data_list;
                        var patentCreateTime;
                        $.each(items, function (index9, ele9) {
                            patentCreateTime = getEnTime({'date': ele9.patentTime});
                            patentListHtml += '<dl>' +
                                '<dd class="previewPublic clearFloat"><div class="previewBg patentBg"></div>' +
                                '<p>Name：<span>' + htmlToString(ele9.patentName) + '</span></p>' +
                                '<p class="intro">' +
                                'Patent No.：<span>' + ele9.patentCode + '</span><i>|</i>' +
                                'Time of Announcement： <span>' + patentCreateTime.year + '.' + patentCreateTime.month + '</span><i>|</i>' +
                                'Registered in: <span>' + ele9.country + '</span>' +
                                '</p></dd>' +
                                '</dl>';
                        });
                        $(".Ev-EnAppendPatentList,.Ev-enPatentTitle").show();
                        $(".Ev-EnAppendPatentList").html(patentListHtml).show();
                    } else {
                        $(".Ev-EnAppendPatentList,.Ev-enPatentTitle").hide();
                    }

                },
                error: function () {
                }
            });
        },
        //英文简历中的语言能力证明
        enResumeLanguage: function () {
            var t = this;
            var languageListHtml = "";
            $.ajax({
                url: t.path.languageListUrl,
                type: "POST",
                data: {paramJson: $.toJSON({dataFlag: 2, languageFlag: 1})},
                dataType: "json",
                success: function (rep) {
                    if (rep && rep.responseObject&&!$.isEmptyObject(rep.responseObject)) {
                        var items = rep.responseObject;
                        $.each(items, function (index10, ele10) {
                            languageListHtml += '<dl>' +
                                '<dd class="previewPublic clearFloat">' +
                                '<div class="languageIcon"></div>' +
                                '<p>English certificate：<span>' + ele10.languageName + '</span></p>' +
                                '<p class="intro">' +
                                'Lssuing：<span>' + ele10.awardYear + '</span></p></dd>' +
                                '</dl>';
                        });
                        $(".Ev-EnAppendLanguageList,.Ev-enLanguageTitle").show();
                        $(".Ev-EnAppendLanguageList").html(languageListHtml);
                    } else {
                        $(".Ev-EnAppendLanguageList,.Ev-enLanguageTitle").hide();
                    }
                },
                error: function () {
                }
            });
        },

        //中英文简历切换
        tabClickBtn: function (items) {
            var t = this;
            var _i;
            $(".Ev-TabBtn").on("click", function () {
                _i = $(this).index();
                $(this).addClass("active").siblings().removeClass("active");
                if (_i == 1) {//英文简历
                    $(".Ev-AppendChResume").hide();
                    $(".Ev-AppendEnResume").show();
                    if (!$(this).hasClass("Ev-HasAjaxContent")) {
                        t.enResumeCallFun(items);
                    }
                } else {//中文简历
                    $(".Ev-AppendChResume").show();
                    $(".Ev-AppendEnResume").hide();
                    t.chResumeCallFun(items);
                }
            });

        }

    };
    controller.init();
});

