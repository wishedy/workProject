/**
 * 功能描述： 历史简历预览
 * 使用方法:
 * 注意事件：
 * 引入来源：  作用：
 *
 * Created by HeJing on 2016/06/06.
 */


$(function () {
    var controller = {
        config: {
            fellowshipId: comm.getpara().fId,//,1451455120847
            customerId: comm.getpara().cId //1448850488667
        },
        path: {
            getHistoryFellowshipInfo: PC_CALL + 'customer/fellowship/base/getHistoryFellowshipInfo/',//中英文简历,报名基本信息
            getDataCertificates: PC_CALL + "commdata/getDataCertificates/",//证件类型
            getEducationList: PC_CALL + "commdata/getEducationList/"//学历
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
            t.resumePreviewChResumeAjax();
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
        //中文简历预览
        resumePreviewChResumeAjax: function () {
            var t = this;
            var configListHtml = "", occupationListHtml = "", educationListHtml = "", conEducationListHtml = "", honorListHtml = "", foundingListHtml = "", socialListHtml = "";
            var opusListHtml = "", patentListHtml = "", languageListHtml = "";
            var data = {};
            data.customerId = t.config.customerId;
            data.fellowshipId = t.config.fellowshipId;
            data.languageFlag = 0;//0中文，1英文
            t.ajaxFn({
                url: t.path.getHistoryFellowshipInfo,
                param: data,
                fn: function (rep) {
                    if (rep && rep.responseObject) {
                        var items = rep.responseObject;
                        t.purposeRequestEn=items.fellowshipList[0].purposeRequestEn;
                        t.purposeRequest=items.fellowshipList[0].purposeRequest;
                        //报名基本信息
                        var evAddress = items.fellowshipList[0].province + items.fellowshipList[0].city + items.fellowshipList[0].district + (items.fellowshipList[0].detailAddress ? items.fellowshipList[0].detailAddress : "");
                        var schoolContent = (items.fellowshipList[0].isAgreeAdjust == 1 ) ? "报名志愿(同意调剂)：" : "报名志愿：";
                        $(".Ev-Mobile").text(items.fellowshipList[0].mobile);
                        $(".Ev-WinXin").text(items.fellowshipList[0].weixinCode ? items.fellowshipList[0].weixinCode : "");
                        $(".Ev-Email").text(items.fellowshipList[0].email);
                        $(".Ev-ZipCode").text(items.fellowshipList[0].zipCode);
                        $(".Ev-Address").text(evAddress);
                        $(".Ev-CardNum").text(items.fellowshipList[0].certificatesCode);//证件号
                        $(".Ev-practiceCode").text(items.fellowshipList[0].practiceCode);//医师执业证号
                        $(".Ev-qualificationCode").text(items.fellowshipList[0].qualificationCode);//医师资格证号

                        //单位性质
                        var companyTypeCon = "";
                        switch (parseInt(items.fellowshipList[0].companyType)) {
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
                        switch (parseInt(items.fellowshipList[0].customerType)) {
                            case 1:
                                customerTypeCon = "军人";
                                break;
                            case 2:
                                customerTypeCon = "地方人员";
                                break;
                        }
                        $(".Ev-customerType").text(customerTypeCon);

                        if (items.logoUrlList) {
                            if (items.logoUrlList.length) {
                                $(".Ev-CustomerLogo img").attr("src", items.logoUrlList[0].logoUrl ? items.logoUrlList[0].logoUrl : "//img10.allinmd.cn/default/customer/190_190.jpg");
                            }
                        } else {
                            $(".Ev-CustomerLogo img").attr("src", "//img10.allinmd.cn/default/customer/190_190.jpg")
                        }

                        //证件类型请求
                        t.certificatesType(items.fellowshipList[0].certificatesId);
                        //最高学历
                        t.highestDegree(items.fellowshipList[0].highestDegree);


                        //报名基本信息中的学校列表
                        if (rep.responseObject.fellowshipMainType == 1) {//国外的进修
                            if (rep.responseObject.configList && rep.responseObject.configList.length > 0) {
                                var wishList = rep.responseObject.wishList;
                                var configList = rep.responseObject.configList;
                                $.each(configList, function (index, ele) {//志愿字段
                                    configListHtml += '<tr><td class="releaseDefaultTextInfo"> ' + ele.configTitle + '</td>' +
                                        '<td colspan="4" class="releaseUserWriteInfo">' + wishList[wishList.length - 1 - index].fellowshipSubName + '</td>' +
                                        '</tr>';
                                });
                                $(".Ev-FellowSchool").show().html('<tr><td colspan="5" class="volunteerText Ev-FellowSchool">' + schoolContent + '</td></tr>' +
                                    configListHtml);
                            }
                        } else if (rep.responseObject.fellowshipMainType == 2) {//国内的进修
                            if (rep.responseObject.majorList && rep.responseObject.majorList.length > 0) {
                                var fDepartmentVal = "";
                                switch (parseInt(rep.responseObject.majorList[0].fellowshipDepartment)) {
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
                                switch (parseInt(rep.responseObject.majorList[0].fellowshipDate)) {
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
                                $(".Ev-fVolunteer").text(schoolContent);
                                $(".Ev-fDepartmentVal").text(fDepartmentVal);
                                $(".Ev-fProfessionVal").text(rep.responseObject.majorList[0].tagName);
                                $(".Ev-fTimeLimitVal").text(fellowshipDate);
                            }
                        } else if (rep.responseObject.fellowshipMainType == 3) {//培训课程
                            if (rep.responseObject.majorList && rep.responseObject.majorList.length > 0) {
                                $(".Ev-FellowSchool").show();
                                $(".Ev-fVolunteer").text(schoolContent);
                                $(".Ev-fDepartment").text("培训方向");
                                $(".Ev-fDepartmentVal").text(rep.responseObject.majorList[0].tagName);
                                $(".Ev-fProfessionVal,.Ev-fProfession,.Ev-fTimeLimitVal,.Ev-fTimeLimit").hide();
                            }
                        }

                        //中文简历
                        t.chResumeContent(items);
                        //2.中文简历中的工作经历
                        if (rep.responseObject.occupationList && rep.responseObject.occupationList.length > 0) {
                            var occupationList = rep.responseObject.occupationList;
                            var workPlace, workStartTime, workEndTime, workTime, medicalTitle;
                            $.each(occupationList, function (index2, ele2) {
                                if (!$.isEmptyObject(ele2.address) && $.trim(ele2.address)) {
                                    workPlace = '工作地点：<span>' + ele2.address + '</span><i>|</i>';
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
                                    '<p>工作单位：<span>' + ele2.unit + '</span></p>' +
                                    '<p class="intro">' +
                                    workPlace +
                                    '任职时间：<span>' + workTime + '</span><i>|</i>' +
                                    '所在科室：<span>' + ele2.department + '</span><i>|</i>' +
                                    '职称：<span>' + medicalTitle + '</span></p></dd>' +
                                    '</dl>';
                            });
                            $(".Ev-AppendWorkList,.Ev-occupationTitle").show();
                            $(".Ev-AppendWorkList").html(occupationListHtml);
                        } else {
                            $(".Ev-AppendWorkList,.Ev-occupationTitle").hide();
                        }


                        //3.中文简历中的教育经历
                        if (rep.responseObject.educationList && rep.responseObject.educationList.length > 0) {
                            var educationList = rep.responseObject.educationList;
                            var schoolCity, studyStartTime, studyEndTime, studyTime;
                            $.each(educationList, function (index3, ele3) {
                                if ($.trim(ele3.city) && !$.isEmptyObject(ele3.city)) {
                                    schoolCity = '<i>|</i>就读城市：<span>' + ele3.city + '</span>';
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
                                    '<p>学校名称：<span>' + ele3.university + '</span></p>' +
                                    '<p class="intro">' +
                                    '所学专业：<span>' + ele3.major + '</span><i>|</i>' +
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


                        //4.中文简历中的继续教育经历
                        if (rep.responseObject.continuingEducationList && rep.responseObject.continuingEducationList.length > 0) {
                            var continuingEducationList = rep.responseObject.continuingEducationList;
                            var conEduContent, certificateContent, conEduStartTime, conEduEndTime;
                            $.each(continuingEducationList, function (index4, ele4) {
                                conEduStartTime = ele4.startTime.substring(0, 10);
                                conEduEndTime = ele4.endTime.substring(0, 10);
                                if ($.trim(ele4.cmeDesc) && !$.isEmptyObject(ele4.cmeDesc)) {
                                    conEduContent = '培训内容：<span>' + ele4.cmeDesc + '</span><i>|</i>';
                                } else {
                                    conEduContent = "";
                                }
                                if ($.trim(ele4.certificate) && !$.isEmptyObject(ele4.certificate)) {
                                    certificateContent = '获得证书：<span>' + ele4.certificate + '</span><i>|</i>';
                                } else {
                                    certificateContent = "";
                                }
                                conEducationListHtml += '<dl>' +
                                    '<dd class="previewPublic clearFloat"><div class="previewBg otherBg"></div>' +
                                    '<p>学术机构：<span>' + ele4.organization + '</span></p>' +
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

                        //5.中文简历中的荣誉获得
                        if (rep.responseObject.honorList&&rep.responseObject.honorList.length>0) {
                            var honorList = rep.responseObject.honorList;
                            $.each(honorList, function (index5, ele5) {
                                honorListHtml += '<dl>' +
                                    '<dd class="previewPublic clearFloat">' +
                                    '<div class="previewBg honorBg"></div>' +
                                    '<p>荣誉名称：<span>' + ele5.honorName + '</span></p>' +
                                    '<p class="intro">' +
                                    '颁发机构：<span>' + ele5.awardDepartment + '</span><i>|</i>' +
                                    '获得时间：<span>' + ele5.awardYear + '</span>' +
                                    '</p></dd>' +
                                    '</dl>';
                            });
                            $(".Ev-AppendHonorList,.Ev-honorTitle").show();
                            $(".Ev-AppendHonorList").html(honorListHtml);
                        } else {
                            $(".Ev-AppendHonorList,.Ev-honorTitle").hide();
                        }

                        //6.简历中的科研基金
                        if (rep && rep.responseObject.fundList && rep.responseObject.fundList.length > 0) {
                            var fundList = rep.responseObject.fundList;
                            $.each(fundList, function (index6, ele6) {
                                foundingListHtml += '<dl>' +
                                    '<dd class="previewPublic clearFloat">' +
                                    '<div class="previewBg foundingBg"></div>' +
                                    '<p>名称：<span>' + ele6.fundName + '</span></p>' +
                                    '<p class="intro">' +
                                    '项目号：<span>' + ele6.fundCode + '</span><i>|</i>' +
                                    '批注年度：<span>' + ele6.approvalTime.substring(0, 4) + '</span>' +
                                    '</p></dd>' +
                                    '</dl>';
                            });
                            $(".Ev-AppendFoundingList,.Ev-fundTitle").show();
                            $(".Ev-AppendFoundingList").html(foundingListHtml);
                        } else {
                            $(".Ev-AppendFoundingList,.Ev-fundTitle").hide();
                        }

                        //7.中文简历中的社会职责
                        if (rep && rep.responseObject.socialList && rep.responseObject.socialList.length > 0) {
                            var socialList = rep.responseObject.socialList;
                            var socialTime;
                            $.each(socialList, function (index7, ele7) {
                                if (ele7.upNow) {
                                    socialTime = ele7.startTime.substring(0, 4) + '.' + ele7.startTime.substring(5, 7) + " ～ 至今";
                                } else {
                                    socialTime = ele7.startTime.substring(0, 4) + '.' + ele7.startTime.substring(5, 7) + " ～ " + ele7.endTime.substring(0, 4) + '.' + ele7.endTime.substring(5, 7);
                                }
                                socialListHtml += '<dl>' +
                                    '<dd class="previewPublic clearFloat">' +
                                    '<div class="previewBg socialBg"></div>' +
                                    '<p>机构名称：<span>' + ele7.organization + '</span></p>' +
                                    '<p class="intro">' +
                                    '职位名称：<span>' + ele7.socialTitle + '</span><i>|</i>' +
                                    '任职时间：<span>' + socialTime + '</span>' +
                                    '</p></dd>' +
                                    '</dl>';
                            });
                            $(".Ev-AppendSocialList,.Ev-socialTitle").show();
                            $(".Ev-AppendSocialList").html(socialListHtml);
                        } else {
                            $(".Ev-AppendSocialList,.Ev-socialTitle").hide();
                        }


                        //8.中文简历中的学术专著
                        if (rep && rep.responseObject.opusList && rep.responseObject.opusList.length > 0) {
                            var opusList = rep.responseObject.opusList;
                            var information, authorType="", createTime;
                            $.each(opusList, function (index8, ele8) {
                                if ($.trim(ele8.information) && !$.isEmptyObject(ele8.information)) {
                                    information = '<i>|</i>引用信息：<span>' + ele8.information + '</span>';
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
                                    '<p>学术标题：<span>' + ele8.opusName + '</span></p>' +
                                    '<p class="intro">' +
                                    '作者身份：<span>' + authorType + '</span><i>|</i>' +
                                    '出版机构：<span>' + ele8.publisher + '</span><i>|</i>' +
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

                        //9.中文简历中的发明专利
                        if (rep && rep.responseObject.patentList && rep.responseObject.patentList.length > 0) {
                            var patentList = rep.responseObject.patentList;
                            $.each(patentList, function (index9, ele9) {
                                patentListHtml += '<dl>' +
                                    '<dd class="previewPublic clearFloat">' +
                                    '<div class="previewBg patentBg"></div>' +
                                    '<p>专利名称：<span>' + ele9.patentName + '</span></p>' +
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

                        //10.语言能力
                        if (rep && rep.responseObject.customerLanguageList && rep.responseObject.customerLanguageList.length > 0) {
                            var languageList = rep.responseObject.customerLanguageList;
                            $.each(languageList, function (index10, ele10) {
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

                        t.tabClickBtn(items);
                    }
                },
                error: function () {
                }
            });
        },
        //中文简历内容填写
        chResumeContent: function (kv) {
            var t=this;
            var customerName;//姓名
            if ((!$.isEmptyObject(kv.fellowshipList[0].lastName) && kv.fellowshipList[0].lastName) || (!$.isEmptyObject(kv.fellowshipList[0].firstName) && kv.fellowshipList[0].firstName)) {
                customerName = kv.fellowshipList[0].lastName + kv.fellowshipList[0].firstName;
            } else {
                if ((!$.isEmptyObject(kv.authList[0].lastName) && kv.authList[0].lastName) || (!$.isEmptyObject(kv.authList[0].firstName) && kv.authList[0].firstName)) {
                    customerName = kv.authList[0].lastName + kv.authList[0].firstName;
                } else {
                    customerName = ""
                }
            }
            $(".Ev-CustomerName").text(customerName);

            var sexContent;//性别
            if (kv.baseInfoList[0].sexId) {
                if (kv.baseInfoList[0].sexId == 1) {
                    sexContent = "男";
                } else if (kv.baseInfoList[0].sexId == 2) {
                    sexContent = "女";
                } else {
                    sexContent = "";
                }
            } else {
                sexContent = "";
            }
            $(".Ev-SexContent").text(sexContent);

            var birthday;//生日
            if (!$.isEmptyObject(kv.baseInfoList[0].birthday) && kv.baseInfoList[0].birthday) {
                birthday = kv.baseInfoList[0].birthday;
            } else {
                birthday = "";
            }
            $(".Ev-Birthday").text(birthday);

            var medicalTitle;//职称
            if (!$.isEmptyObject(kv.fellowshipList[0].medicalTitle) && kv.fellowshipList[0].medicalTitle) {
                medicalTitle = comm.cutLine(kv.fellowshipList[0].medicalTitle, "_", ",");
            } else {
                if (!$.isEmptyObject(kv.authList[0].medicalTitle) && kv.authList[0].medicalTitle) {
                    medicalTitle = comm.cutLine(kv.authList[0].medicalTitle, "_", ",");
                } else {
                    medicalTitle = "";
                }
            }
            $(".Ev-MedicalTitle").text(medicalTitle);

            var company;//医院
            if (!$.isEmptyObject(kv.fellowshipList[0].company) && kv.fellowshipList[0].company) {
                company = kv.fellowshipList[0].company;
            } else {
                if (!$.isEmptyObject(kv.authList[0].company) && kv.authList[0].company) {
                    company = kv.authList[0].company;
                } else {
                    company = "";
                }
            }
            $(".Ev-Company").text(company);

            var nativePlace;//籍贯
            if (!$.isEmptyObject(kv.baseInfoList[0].nativePlace) && $.trim(kv.baseInfoList[0].nativePlace)) {
                nativePlace = kv.baseInfoList[0].nativePlace;
            } else {
                nativePlace = "";
            }
            $(".Ev-nativePlace").text(nativePlace);

            var nationality;//民族
            if (!$.isEmptyObject(kv.baseInfoList[0].nationality) && $.trim(kv.baseInfoList[0].nationality)) {
                nationality = kv.baseInfoList[0].nationality;
            } else {
                nationality = "";
            }
            $(".Ev-nationality").text(nationality);

            var politicsStatus;//政治面貌
            if (!$.isEmptyObject(kv.baseInfoList[0].politicsStatus) && $.trim(kv.baseInfoList[0].politicsStatus)) {
                politicsStatus = kv.baseInfoList[0].politicsStatus;
            } else {
                politicsStatus = "";
            }
            $(".Ev-politicsStatus").text(politicsStatus);

            var baseInfoSummary;//个人简介
            if (!$.isEmptyObject(kv.baseInfoList[0].summary) && kv.baseInfoList[0].summary) {
                baseInfoSummary = kv.baseInfoList[0].summary;
            } else {
                baseInfoSummary = ""
            }
            $(".Ev-BaseInfoSummary").text(baseInfoSummary);

            //学习目标
            $(".Ev-purposeRequest").text(t.purposeRequest);
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
                        t.resumePreviewEnResumeAjax();
                    }
                } else {//中文简历
                    $(".Ev-AppendChResume").show();
                    $(".Ev-AppendEnResume").hide();
                }
            });
        },
        //英文简历预览
        resumePreviewEnResumeAjax: function () {
            var t = this, enOccupationListHtml = "", enEducationListHtml = "", enConEducationListHtml = "";
            var honorListHtml = "", foundingListHtml = "", socialListHtml = "", opusListHtml = "", patentListHtml = "", languageListHtml = "";
            var param = {};
            param.customerId = t.config.customerId;
            param.fellowshipId = t.config.fellowshipId;
            param.languageFlag = 1;//中文,1英文
            t.ajaxFn({
                url: t.path.getHistoryFellowshipInfo,
                param: param,
                fn: function (rep) {
                    if (rep && rep.responseObject) {
                        var items = rep.responseObject;
                        $(".Ev-TabBtn").eq(1).addClass("Ev-HasAjaxContent");
                        //英文简历
                        t.EnResumeContent(items);
                        //2.英文简历中的工作经历
                        if (rep.responseObject.occupationList && rep.responseObject.occupationList.length > 0) {
                            var occupationList = rep.responseObject.occupationList;
                            var workPlace, workStartTime, workEndTime, workTime, medicalTitle;
                            $.each(occupationList, function (index2, ele2) {
                                if (!$.isEmptyObject(ele2.address) && $.trim(ele2.address)) {
                                    workPlace = 'Location:<span>' + ele2.address + '</span><i>|</i>';
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
                                    '<p>Employer：<span>' + ele2.unit + '</span></p>' +
                                    '<p class="intro">' +
                                    workPlace +
                                    'Term of Office: <span>' + workTime + '</span><i>|</i>' +
                                    'department: <span>' + ele2.department + '</span><i>|</i>' +
                                    'Title:<span>' + medicalTitle + '</span></p></dd>' +
                                    '</dl>';
                            });
                            $(".Ev-EnAppendWorkList,.Ev-enOccupationTitle").show();
                            $(".Ev-EnAppendWorkList").html(enOccupationListHtml);
                        } else {
                            $(".Ev-EnAppendWorkList,.Ev-enOccupationTitle").hide();
                        }

                        //3.英文简历中的教育经历
                        if (rep.responseObject.educationList && rep.responseObject.educationList.length > 0) {
                            var educationList = rep.responseObject.educationList;
                            var schoolCity, studyStartTime, studyEndTime, studyTime;
                            $.each(educationList, function (index3, ele3) {
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
                                    '<p>School: <span>'+ ele3.university +'</span></p>' +
                                    '<p class="intro">' +
                                    'Major: <span>' + ele3.major + '</span><i>|</i>' +
                                    'Period:<span>' + studyTime + '</span><i>|</i>' +
                                    'Degree: <span>' + ele3.education + '</span>' +
                                    schoolCity + '</p></dd>' +
                                    '</dl>';
                            });
                            $(".Ev-EnAppendEduList,.Ev-enEducationTitle").show();
                            $(".Ev-EnAppendEduList").html(enEducationListHtml);
                        } else {
                            $(".Ev-EnAppendEduList,.Ev-enEducationTitle").hide();
                        }


                        //4.英文简历中的继续教育经历
                        if (rep.responseObject.continuingEducationList && rep.responseObject.continuingEducationList.length > 0) {
                            var continuingEducationList = rep.responseObject.continuingEducationList;
                            var conEduContent, certificateContent, conEduStartTime, conEduEndTime;
                            $.each(continuingEducationList, function (index4, ele4) {
                                conEduStartTime = getEnTime({'date': ele4.startTime});
                                conEduEndTime = getEnTime({'date': ele4.endTime});
                                if ($.trim(ele4.cmeDesc) && !$.isEmptyObject(ele4.cmeDesc)) {
                                    conEduContent = 'Subject: <span>' + ele4.cmeDesc + '</span><i>|</i>';
                                } else {
                                    conEduContent = "";
                                }
                                if ($.trim(ele4.certificate) && !$.isEmptyObject(ele4.certificate)) {
                                    certificateContent = 'Certificate: <span>' + ele4.certificate + '</span><i>|</i>';
                                } else {
                                    certificateContent = "";
                                }
                                enConEducationListHtml += '<dl>' +
                                    '<dd class="previewPublic clearFloat"><div class="previewBg otherBg"></div>' +
                                    '<p>Institute：<span>' + ele4.organization + '</span></p>' +
                                    '<p class="intro">' +
                                    conEduContent +
                                    'From：<span>' + conEduStartTime.year + '.' + conEduStartTime.month + '.' + conEduStartTime.day + '</span><i>|</i>' +
                                    'Till: <span>' + conEduEndTime.year + '.' + conEduEndTime.month + '.' + conEduEndTime.day + '</span>' +
                                    '</p></dd>' +
                                    '</dl>';
                            });
                            $(".Ev-EnAppendConEduList,.Ev-enConEduTitle").show();
                            $(".Ev-EnAppendConEduList").html(enConEducationListHtml);
                        } else {
                            $(".Ev-EnAppendConEduList,.Ev-enConEduTitle").hide();
                        }

                        //5.英文简历中的荣誉获得
                        if (rep && rep.responseObject.honorList && rep.responseObject.honorList.length > 0) {
                            var honorList = rep.responseObject.honorList;
                            $.each(honorList, function (index5, ele5) {
                                honorListHtml += '<dl>' +
                                    '<dd class="previewPublic clearFloat"><div class="previewBg honorBg"></div>' +
                                    '<p>Name：<span>' + ele5.honorName + '</span></p>' +
                                    '<p class="intro">' +
                                    'Issued By：<span>' + ele5.awardDepartment + '</span><i>|</i>' +
                                    'Rewarded at： <span>' + ele5.awardYear + '</span>' +
                                    '</p></dd>' +
                                    '</dl>';
                            });
                            $(".Ev-EnAppendHonorList,.Ev-enHonorTitle").show();
                            $(".Ev-EnAppendHonorList").html(honorListHtml);
                        } else {
                            $(".Ev-EnAppendHonorList,.Ev-enHonorTitle").hide();
                        }
                        //6.英文简历中的科研基金
                        if (rep && rep.responseObject.fundList && rep.responseObject.fundList.length > 0) {
                            var fundList = rep.responseObject.fundList;
                            $.each(fundList, function (index6, ele6) {
                                foundingListHtml += '<dl>' +
                                    '<dd class="previewPublic clearFloat"><div class="previewBg foundingBg"></div>' +
                                    '<p>Name：<span>' + ele6.fundName + '</span></p>' +
                                    '<p class="intro">' +
                                    'No.：<span>' + ele6.fundCode + '</span><i>|</i>' +
                                    'Issued at： <span>' + ele6.approvalTime.substring(0, 4) + '</span>' +
                                    '</p></dd>' +
                                    '</dl>';
                            });
                            $(".Ev-EnAppendFoundingList,.Ev-enFundTitle").show();
                            $(".Ev-EnAppendFoundingList").html(foundingListHtml);
                        } else {
                            $(".Ev-EnAppendFoundingList,.Ev-enFundTitle").hide();
                        }
                        //7.英文简历中的社会职责
                        if (rep && rep.responseObject.socialList&&rep.responseObject.socialList.length>0) {
                            var socialList = rep.responseObject.socialList;
                            var socialTime, socialStartTime, socialEndTime;
                            $.each(socialList, function (index7, ele7) {
                                socialStartTime = getEnTime({'date': ele7.startTime});
                                socialEndTime = getEnTime({'date': ele7.endTime});
                                if (ele7.upNow) {
                                    socialTime = socialStartTime.year + '.' + socialStartTime.month + " ～ Till Now";
                                } else {
                                    socialTime = socialStartTime.year + '.' + socialStartTime.month + " ～ " + socialEndTime.year + '.' + socialEndTime.month;
                                }
                                socialListHtml += '<dl>' +
                                    '<dd class="previewPublic clearFloat"><div class="previewBg socialBg"></div>' +
                                    '<p>Institute：<span>' + ele7.organization + '</span></p>' +
                                    '<p class="intro">' +
                                    'Position：<span>' + ele7.socialTitle + '</span><i>|</i>' +
                                    'Term of Office： <span>' + socialTime + '</span>' +
                                    '</p></dd>' +
                                    '</dl>';
                            });
                            $(".Ev-EnAppendSocialList,.Ev-enSocialTitle").show();
                            $(".Ev-EnAppendSocialList").html(socialListHtml);
                        } else {
                            $(".Ev-EnAppendSocialList,.Ev-enSocialTitle").hide();
                        }
                        //8.英文简历中的学术专著
                        if (rep && rep.responseObject.opusList && rep.responseObject.opusList.length > 0) {
                            var opusList = rep.responseObject.opusList;
                            var information, authorType="", opusCreateTime;
                            $.each(opusList, function (index8, ele8) {
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
                                    '<p>Title：<span>' + ele8.opusName + '</span></p>' +
                                    '<p class="intro">' +
                                    'As：<span>' + authorType + '</span><i>|</i>' +
                                    'Publisher： <span>' + ele8.publisher + '</span><i>|</i>' +
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

                        //9.英文简历中的发明专利
                        if (rep && rep.responseObject.patentList && rep.responseObject.patentList.length > 0) {
                            var patentList = rep.responseObject.patentList;
                            var patentCreateTime;
                            $.each(patentList, function (index9, ele9) {
                                patentCreateTime = getEnTime({'date': ele9.patentTime});
                                patentListHtml += '<dl>' +
                                    '<dd class="previewPublic clearFloat"><div class="previewBg patentBg"></div>' +
                                    '<p>Name：<span>' + ele9.patentName + '</span></p>' +
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

                        //10.语言能力证明
                        if (rep && rep.responseObject.customerLanguageList && rep.responseObject.customerLanguageList.length > 0) {
                            var languageList = rep.responseObject.customerLanguageList;
                            $.each(languageList, function (index10, ele10) {
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

                    }
                },
                error: function () {
                }
            });
        },
        //英文简历内容填写
        EnResumeContent: function (kv) {
            var t=this;

            var registAddressEn;
            if($.trim(kv.baseInfoList[0].registAddressEn)&&!$.isEmptyObject(kv.baseInfoList[0].registAddressEn)){
                registAddressEn=kv.baseInfoList[0].registAddressEn;
            }else{
                registAddressEn="";
            }
            $(".Ev-enAddress").text(registAddressEn);

            var customerName;//姓名
            if ((!$.isEmptyObject(kv.fellowshipList[0].lastNameEn) && kv.fellowshipList[0].lastNameEn) && (!$.isEmptyObject(kv.fellowshipList[0].firstNameEn) && kv.fellowshipList[0].firstNameEn)) {
                customerName = kv.fellowshipList[0].firstNameEn + ' ' + kv.fellowshipList[0].lastNameEn;
            } else {
                if ((!$.isEmptyObject(kv.authList[0].lastNameEn) && kv.authList[0].lastNameEn) && (!$.isEmptyObject(kv.authList[0].firstNameEn) && kv.authList[0].firstNameEn)) {
                    customerName = kv.authList[0].firstNameEn + ' ' + kv.authList[0].lastNameEn;
                } else {
                    customerName = ""
                }
            }
            $(".Ev-EnCustomerName").text(customerName);

            var sexContent;//性别
            if (kv.baseInfoList[0].sexId) {
                if (kv.baseInfoList[0].sexId == 1) {
                    sexContent = "Male";
                } else if (kv.baseInfoList[0].sexId == 2) {
                    sexContent = "Female";
                } else {
                    sexContent = "";
                }
            } else {
                sexContent = "";
            }
            $(".Ev-EnSexContent").text(sexContent);

            var birthday;//生日
            if (!$.isEmptyObject(kv.baseInfoList[0].birthday) && kv.baseInfoList[0].birthday) {
                birthday = getEnTime({'date': kv.baseInfoList[0].birthday});
            } else {
                birthday = "";
            }
            $(".Ev-EnBirthday").text(birthday.year + '.' + birthday.month);

            var medicalTitle;//职称
            if (!$.isEmptyObject(kv.fellowshipList[0].medicalTitleEn) && kv.fellowshipList[0].medicalTitleEn) {
                medicalTitle = comm.cutLine(kv.fellowshipList[0].medicalTitleEn, "_", ",");
            } else {
                if (!$.isEmptyObject(kv.authList[0].medicalTitleEn) && kv.authList[0].medicalTitleEn) {
                    medicalTitle = comm.cutLine(kv.authList[0].medicalTitleEn, "_", ",");
                } else {
                    medicalTitle = "";
                }
            }
            $(".Ev-EnMedicalTitle").text(medicalTitle);

            var company;//医院
            if (!$.isEmptyObject(kv.fellowshipList[0].companyEn) && kv.fellowshipList[0].companyEn) {
                company = kv.fellowshipList[0].companyEn;
            } else {
                if (!$.isEmptyObject(kv.authList[0].companyEn) && kv.authList[0].companyEn) {
                    company = kv.authList[0].companyEn;
                } else {
                    company = "";
                }
            }
            $(".Ev-EnCompany").text(company);

            var baseInfoSummary;//个人简介
            if (!$.isEmptyObject(kv.baseInfoList[0].summaryEn) && kv.baseInfoList[0].summaryEn) {
                baseInfoSummary = kv.baseInfoList[0].summaryEn;
            } else {
                baseInfoSummary = ""
            }
            $(".Ev-EnBaseInfoSummary").text(baseInfoSummary);

            //学习目标
            $(".Ev-EnPurposeRequest").text(t.purposeRequestEn);
        }
    };
    controller.init();
});

