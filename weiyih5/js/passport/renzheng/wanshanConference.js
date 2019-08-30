$(function () {
    var medTitle = {
        init: function () {
            var t = this;
            this.para = comm.getpara();
            this.getMedTitle();
            this.bindReturnBtn();
            this.value = "";
        },
        bindReturnBtn: function () {
            var t = this;
            $("#back").on("vclick", function () {
                history.back(-1);
            });
        },
        getMedTitle: function () {
            var t = this;
            $.mobile.loading("show");
            $.ajax({
                type: 'POST',
                url: "/mcall/comm/data/medicalTitle/json_list/",
                data: {pageIndex: 1, pageSize: 100},
                dataType: "json",
                timeout: 10000,
                success: function callback(rep) {
                    var html1 = html2 = html3 = "";
                    $.mobile.loading("hide");
                    if (rep && rep.responseObject.responseData && rep.responseObject.responseData.data_list) {
                        $.each(rep.responseObject.responseData.data_list, function (i, val) {
                            if (i < 4) {
                                html1 += '<li tagid="' + val.id + '" select="no"><div class="add_tag_mr">' + val.medicalTitle + '</div></li>';
                            } else if (i < 7) {
                                html2 += '<li tagid="' + val.id + '" select="no" ' + (i == 4 ? 'style="border-top:solid 0.13em #dfdfdf;"' : '') + '><div class="add_tag_mr">' + val.medicalTitle + '</div></li>';
                            } else {
                                html3 += '<li tagid="' + val.id + '" select="no" ' + (i == 7 ? 'style="border-top:solid 0.13em #dfdfdf;"' : '') + '><div class="add_tag_mr">' + val.medicalTitle + '</div></li>';
                            }
                        })
                    }
                    ;
                    $("#medical01").html(html1);
                    //$("#medical02").html(html2);
                    //$("#medical03").html(html3);
                    t.hasSelect();
                    t.selectMedical();
                    if (t.para.occId && t.para.occId != 0) {
                        $("#save").on("vclick", function () {
                            t.setLocalStorage();
                            //g_sps.jump(null,pageurl.urlList.toOccupation.url+"?customerId="+t.para.customerId+"&id="+t.para.occId);
                            history.go(-1)
                        })
                    } else if (t.para.occId == 0) {
                        $("#save").on("vclick", function () {
                            t.setLocalStorage();
                          g_sps.jump(null,pageurl.urlList.toOccupation.url + "?customerId=" + t.para.customerId);
                        })
                    } else {
                        t.saveMedical();
                    }
                }
            });
        },
        //初始化选择
        hasSelect: function () {
            var tagId;
            var ids = this.para.ids;
            if (ids) {
                tagId = ids.split(",");
                $.each(tagId, function (i, val) {
                    $.each($(".zc_content li"), function (j, em) {
                        if (val == $(em).attr("tagid")) {
                            $(em).attr("select", "yes");
                            $(em).find("div").removeClass("add_tag_mr").addClass("add_tag_xz");
                        }
                    })

                })
            }
            ;
        },
        //选择
        selectMedical: function () {
            $.each($("#medical01 li"), function (i, em) {
                $(em).on("vclick", function () {
                    if ($(em).attr("select") == "no") {
                        $("#medical01 li").attr("select", "no");
                        $("#medical01 div").removeClass("add_tag_xz").addClass("add_tag_mr");
                        $(em).attr("select", "yes");
                        $(em).find("div").removeClass("add_tag_mr").addClass("add_tag_xz");
                    } else {
                        $(em).attr("select", "no");
                        $(em).find("div").removeClass("add_tag_xz").addClass("add_tag_mr");
                    }
                });
            });
            $.each($("#medical02 li"), function (i, em) {
                $(em).on("vclick", function () {
                    if ($(em).attr("select") == "no") {
                        $("#medical02 li").attr("select", "no");
                        $("#medical02 div").removeClass("add_tag_xz").addClass("add_tag_mr");
                        $(em).attr("select", "yes");
                        $(em).find("div").removeClass("add_tag_mr").addClass("add_tag_xz");
                    } else {
                        $(em).attr("select", "no");
                        $(em).find("div").removeClass("add_tag_xz").addClass("add_tag_mr");
                    }
                });
            });
            $.each($("#medical03 li"), function (i, em) {
                $(em).on("vclick", function () {
                    if ($(em).attr("select") == "no") {
                        $("#medical03 li").attr("select", "no");
                        $("#medical03 div").removeClass("add_tag_xz").addClass("add_tag_mr");
                        $(em).attr("select", "yes");
                        $(em).find("div").removeClass("add_tag_mr").addClass("add_tag_xz");
                    } else {
                        $(em).attr("select", "no");
                        $(em).find("div").removeClass("add_tag_xz").addClass("add_tag_mr");
                    }
                });
            });
        },
        //更新职称
        saveMedical: function () {


            var t = this;
            $("#medicalTitleSave").on("vclick", function () {
                $.mobile.loading("show");
                medicalTitle = "";
                $.each($(".zc_content li"), function (i, em) {
                    if ($(em).attr("select") == "yes") {
                        medicalTitle += ($(em).attr("tagid") + "_" + $(em).find("div").text() + ",");
                    }
                });
                var data = {};
                data.customerId = t.para.customerId;
                data.medicalTitle = medicalTitle.substring(0, medicalTitle.length - 1);

                $("#medicalTitleChoose .text").text(comm.removeMedicalTitleNum(medicalTitle.replace(/\,/gi, "、")));
                t.value = medicalTitle.substring(0, medicalTitle.length - 1);
                $.mobile.changePage("#renzhengPage");
                $.mobile.loading("hide");
                index.validate();
                /*if(rep&&rep.responseStatus){
                 //popup("保存成功");
                 //setTimeout(function(){
                 //window.location.href=pageurl.urlList.toBaseInfoEdit.url;
                 //history.go(-1)

                 //},1000);
                 }else{
                 popup("保存失败");
                 }*/


            });
        },
        //点击完成并且存储localStorage
        setLocalStorage: function () {
            var occ = {};
            occ.tagContent = [];
            $(".zc_content li").each(function (i, em) {
                if ($(em).attr("select") == "yes") {
                    var tagId = $(em).attr("tagid");
                    var tagName = $(em).find("div").text();

                    occ.tagContent.push([tagId, tagName, tagId + "_" + tagName]);
                }
            });
            if (localStorage.getItem("occ")) {
                var occu = JSON.parse(localStorage.getItem("occ"));
                occ.address = occu.address;
                occ.department = occu.department;
                occ.unit = occu.unit;
                occ.startTime = occu.startTime;
                occ.endTime = occu.endTime;
            }
            localStorage.setItem("occ", JSON.stringify(occ));
        }
    };


    var areasExp = {
        init: function () {
            this.para = comm.getpara();
            this.getTag();
            this.value = "";
        },
        //数据初始化
        getTag: function () {
            var t = this;
            var html = "";
            var data = {};
            data.treeLevel = 2;
            data.pageIndex = 1;
            data.pageSize = 100;
            $.mobile.loading("show");
            $.ajax({
                url: "/mcall/comm/data/tag/json_list/",
                data: data,
                dataType: "json",
                timeout: 10000,
                success: function (rep) {
                    $.mobile.loading("hide");
                    if (rep && rep.responseObject.responseStatus) {
                        $.each(rep.responseObject.responseData.data_list, function (i, val) {
                            html += '<li tagid="' + val.id + '" select="no"><div class="add_tag_mr">' + val.tagName + '</div></li>';
                        });
                    }
                    $(".add_tag_li").html(html);
                    t.hasSelect();
                    t.selectTag();
                    t.saveAreaExp();
                }
            });
            return false;

        },
        //数据初始化选中
        hasSelect: function () {
            var tagId;
            var ids = this.para.ids;
            if (ids) {
                tagId = ids.split(",");
                $.each(tagId, function (i, val) {
                    $.each($(".add_tag_li li"), function (j, em) {
                        if (val == $(em).attr("tagid")) {
                            $(em).attr("select", "yes")
                            $(em).find("div").removeClass("add_tag_mr").addClass("add_tag_xz");
                        }
                    })

                })
            }
            ;
        },
        //数据的选择
        selectTag: function () {
            $.each($(".add_tag_li li"), function (i, em) {
                $(em).on("vclick", function () {
                    if ($(em).attr("select") == "no") {
                        $(em).attr("select", "yes");
                        $(em).find("div").removeClass("add_tag_mr").addClass("add_tag_xz");
                    } else {
                        $(em).attr("select", "no");
                        $(em).find("div").removeClass("add_tag_xz").addClass("add_tag_mr");
                    }
                });
            })
        },
        //保存专业领域
        saveAreaExp: function () {
            var t = this;
            $("#areasExpertiseSave").on("vclick", function () {
                $.mobile.loading("show");
                var areasExpertise = "";
                $.each($(".add_tag_li li"), function (i, em) {
                    if ($(em).attr("select") == "yes") {
                        areasExpertise += ($(em).attr("tagid") + "_" + $(em).find("div").text() + ",");
                    }
                });
                var data = {};
                data.customerId = t.para.customerId;
                data.areasExpertise = areasExpertise.substring(0, areasExpertise.length - 1);
                $("#areaExpertiseChoose .text").text(comm.removeMedicalTitleNum(data.areasExpertise.replace(/\,/gi, "、")));

                t.value = data.areasExpertise;
                $.mobile.changePage("#renzhengPage");
                $.mobile.loading("hide");
                index.validate();
            });
        }
    };

    var company = {
        init: function () {
            var t = this;
            this.scrollpage = 2;
            this.pageSize = 10;
            this.para = comm.getpara();
            this.getProvince();
            this.value = "";

            $("#cityBack").on("vclick", function () {
                $("#sProvince").show();
                $("#sCity").hide();
            });
            $("#companyBack").on("vclick", function () {
                $("#sCity").show();
                $("#sCompany").hide();
            });
            this.saveCompany();
            this.search();
            this.bindTextChange();
            $(".add").on("vclick", function () {
                //g_sps.jump(null,pageurl.urlList.toAddCompany.url+"?customerId="+t.para.customerId);
                //$("#companyName").val(para.name)
                $.mobile.changePage("#addCompanyPage");
            });
            $(".addCompany").on("vclick", function () {
                //g_sps.jump(null,pageurl.urlList.toAddCompany.url+"?customerId="+t.para.customerId+"&name="+t.input.val());
                $.mobile.changePage("#addCompanyPage");
                $("#companyName").val(t.input.val());
            });
        },
        //获取省
        getProvince: function () {
            var t = this;
            var data = {};
            data.treeLevel = 2;
            data.pageIndex = 1;
            data.pageSize = 100;
            $.mobile.loading("show");
            $.ajax({
                type: 'POST',
                url: "/mcall/comm/data/region/json_list/",
                data: data,
                dataType: "json",
                timeout: 10000,
                success: function (rep) {
                    $.mobile.loading("hide");
                    var html = "";
                    if (rep && rep.responseObject.responseData.data_list) {
                        $.each(rep.responseObject.responseData.data_list, function (i, val) {
                            html += "<li regionid=" + val.regionId + ">" + val.regionName + "</li>";
                        });
                    }
                    $("#province").html(html);
                    t.getCity();
                }
            });
            return false;
        },
        //获取市
        getCity: function () {
            var t = this;
            $("#province li").on("vclick", function () {
                var data = {};
                //data.treeLevel=2;
                data.parentId = $(this).attr("regionid");
                data.pageIndex = 1;
                data.pageSize = 100;
                $.mobile.loading("show");
                $.ajax({
                    type: 'POST',
                    url: "/mcall/comm/data/region/json_list/",
                    data: data,
                    dataType: "json",
                    timeout: 10000,
                    success: function (rep) {
                        $.mobile.loading("hide");
                        var html = "";
                        if (rep && rep.responseObject.responseData.data_list) {
                            $("#sProvince").hide();
                            $("#sCity").show();
                            $.each(rep.responseObject.responseData.data_list, function (i, val) {
                                html += "<li regionid=" + val.regionId + ">" + val.regionName + "</li>";
                            });
                        }
                        $("#city").html(html);
                        t.getCompany();

                    }
                });
                return false;
            });
        },
        //获取医院
        getCompany: function () {
            var t = this;
            $("#city li").off("vclick").on("vclick", function () {
                var data = {};
                var cityId = $(this).attr("regionid");
                data.cityId = cityId;
                data.pageIndex = 1;
                data.pageSize = t.pageSize;
                $.mobile.loading("show");
                $.ajax({
                    type: 'POST',
                    url: "/mcall/comm/data/hospital/json_list/",
                    data: data,
                    dataType: "json",
                    timeout: 10000,
                    success: function (rep) {
                        $.mobile.loading("hide");
                        var html = "";
                        if (rep && rep.responseObject.responseData.data_list) {
                            $("#sCity").hide();
                            $("#sCompany").show();
                            $.each(rep.responseObject.responseData.data_list, function (i, val) {
                                html += "<li>" + val.hospitalName + "</li>";
                            });
                            $("#company").html(html);
                            //瀑布流
                            (function () {
                                $("#company").scrollPagination({
                                    'contentPage': "/mcall/comm/data/hospital/json_list/",
                                    'noParamJson': 1,
                                    'contentData': {cityId: cityId, pageIndex: function () {
                                        return t.scrollpage++
                                    }, pageSize: t.pageSize},
                                    'scrollTarget': $(window),
                                    'heightOffset': 0,
                                    'delaytime': 1000,
                                    'beforeLoad': function () {
                                        $(".load").fadeIn();
                                    },
                                    'afterLoad': function (elementsLoaded) {
                                        $('.load').fadeOut();
                                    },
                                    'loader': function (data) {
                                        if ($.isEmptyObject(data.responseObject.responseData)) {
                                            //$(".none").show();
                                            $("#company").attr('scrollPagination', 'disabled');
                                            //alert("没有内容了");
                                            return false;
                                        } else {
                                            var htm = "";
                                            $.each(data.responseObject.responseData.data_list, function (i, val) {
                                                htm += "<li>" + val.hospitalName + "</li>";
                                            });
                                            //$(".none").hide();
                                            $("#company").append(htm);
                                        }
                                    }
                                });
                            })();
                        }

                    }
                });
                return false;
            });
        },
        //选择医院并保存
        saveCompany: function () {
            var t = this;
            $("#company").on("vclick",'li', function () {
                t.save($(this));
            });
        },
        //点击搜索
        search: function () {
            var t = this;
            this.input = $("#seachKey");
            $("#searchPop").css({
                position: "absolute",
                top: 0,
                left: -$("#searchPop").width()
            });
            $(".search_btn").on("vclick", function () {
                $("#searchPop .yy_none").hide();
                $("#searchPop").show().animate({left: 0}, function () {
                    t.input.focus();
                    setTimeout(function () {
                        $("#searchPop .cancel").on("vclick", function () {
                            t.closeSearch();
                        });
                    }, 500);
                });
            });
            $(".yy_s_close").on("vclick", function () {
                t.input.val("");
            });
        },
        closeSearch: function () {
            var t = this;
            $("#searchPop").animate({left: -$("#searchPop").width()}, "slow", function () {
                $("#searchPop").hide();
            });
            $("#searchPop .cancel").off("vclick");
            $("#search_list").empty();
        },
        bindTextChange: function () {
            var t = this;
            var val = "", val2 = "", changeInterval;
            t.input.on("focus", function () {

                changeInterval = setInterval(function () {
                    val2 = t.input.val();
                    if (val != val2) {
                        changeHandler(t.input.val());
                    }
                }, 500);
            });
            t.input.on("blur", function () {
                clearInterval(changeInterval);
            });
            t.input.on("change", function () {
                if (val != val2) {
                    changeHandler(t.input.val());
                }
            });

            function changeHandler(keyWord) {
                var data = {};
                data.hospitalName = keyWord;
                data.pageIndex = 1;
                data.pageSize = t.pageSize;
                $(".add_tag_li_loading").show();
                $.ajax({
                    type: 'get',
                    url: "/mcall/comm/data/hospital/json_list/",
                    data: data,
                    dataType: "json",
                    timeout: 10000,
                    success: function (rep) {
                        $(".add_tag_li_loading").hide();
                        var html = "";
                        if (rep && rep.responseObject.responseData.data_list) {
                            $.each(rep.responseObject.responseData.data_list, function (i, val) {
                                html += "<li>" + val.hospitalName + "</li>";
                            });
                            $("#search_list").html(html);
                            $("#search_list li").on("vclick", function () {
                                t.save($(this));
                            });
                            $("#searchPop .yy_none").show();
                            $(".yy_none_search").hide();
                        } else {
                            $("#search_list").empty();
                            $("#searchPop .yy_none").hide();
                            $(".yy_none_search").show();
                            $(".name").text(t.input.val());
                        }
                        val = val2;
                    }
                });
            }
        },
        //save
        save: function ($this) {
            $.mobile.loading("show");
            var data = {};
            data.company = $this.text();
            $("#companyChoose .text").text(data.company);
            this.value = data.company;
            $.mobile.changePage("#renzhengPage");
            $.mobile.loading("hide");
            index.validate();
        }
    };

    var index = {
        init: function () {
            var t = this;

            var userInfo = user.getRenZhengInfo();
            if (userInfo != undefined 
            		&& !$.isEmptyObject(userInfo) 
            		&& userInfo.company != "" 
            			&& userInfo.medicalTitle != "" 
            				&& userInfo.areasExpertise != "" 
            					&& userInfo.lastName != "" 
            						&& userInfo.firstName != "" 
            							&& userInfo.clinicalTime != "") {
                alert("资料已完整");
                window.location = "/";
                return;
            }
            
            areasExp.init();
            medTitle.init();
            company.init();
            if(!$.isEmptyObject(userInfo)){
            	areasExp.value = userInfo.areasExpertise;
                company.value = userInfo.company;
                //医师     1_住院医生
                medTitle.value = comm.cutDoctorTitle(userInfo.medicalTitle);
                //非医师   1_教授,
                t.notDoc=comm.cutNotDoctorTitle(userInfo.medicalTitle);
                
                $("#companyChoose .text").text(userInfo.company);
                $("#medicalTitleChoose .text").text(comm.removeMedicalTitleNum(comm.cutDoctorTitle(userInfo.medicalTitle)));
                $("#areaExpertiseChoose .text").text(comm.removeMedicalTitleNum(userInfo.areasExpertise));
                $("#lastName").val(userInfo.lastName);
                $("#firstName").val(userInfo.firstName);
            }else{
                t.notDoc = "";
            }
            
            t.bindChoose();
            t.bindAddCompany();
            

            $("#lastName").on("change", function () {
                t.validate();
            });
            $("#firstName").on("change", function () {
                t.validate();
            });
            t.validate();
            $("#notRenZheng").on("vclick", function () {
                //var t = document.referrer;
                var t = "/";
                var fromPage = TempCache.getItem("fromPage");
                if (fromPage != undefined && fromPage != "") {
                    t = fromPage
                }
                user.getSessionInfo();
                g_sps.jump(null,t);

                //history.go(-1);
            });

        },
        bindChoose: function () {
            $("#companyChoose").on("vclick", function () {
                $.mobile.changePage("#companyPage");
            });
            $("#medicalTitleChoose").on("vclick", function () {
                $.mobile.changePage("#medicalTitlePage");
            });
            $("#areaExpertiseChoose").on("vclick", function () {
                $.mobile.changePage("#areasExpertisePage");
            });
        },

        bindAddCompany: function () {
            var t = this;
            $("#addCompanySave").on("vclick", function () {

                if ($("#companyName").val().length > 200) {
                    popup("所填医院字数过长!");
                } else {
                    $.mobile.loading("show");
                    var data = {};
                    data.company = $("#companyName").val();
                    $.mobile.loading("hide");
                    company.value = data.company;
                    $("#companyChoose .text").text(data.company);
                    $.mobile.changePage("#renzhengPage");
                    t.validate();
                }
            })
        },
        validate: function () {
            var t = this;

            var valid = true;

            if (company.value == "") {
                valid = false;

            }
            if (areasExp.value == "") {
                valid = false;
            }

            if (medTitle.value == "" || medTitle.value == undefined ||
                (   medTitle.value.indexOf("1") < 0 &&    // 未选择医师职称
                    medTitle.value.indexOf("2") < 0 &&
                    medTitle.value.indexOf("3") < 0 &&
                    medTitle.value.indexOf("4") < 0 )   ) {
                valid = false;
            }

            if ($("#lastName").val() == "") {
                valid = false;
            }
            if ($("#firstName").val() == "") {
                valid = false;
            }
            if (!valid) {
                $("#submit").off('vclick').addClass("disabled");
            } else {
                $("#submit").on('vclick', function () {
                    t.submit();
                }).removeClass("disabled");
            }
        },
        submit: function () {
        	var t=this;
            var param = {
                company: company.value,
                medicalTitle:t.notDoc + medTitle.value,           //
                areasExpertise: areasExp.value,
                lastName: $("#lastName").val(),
                firstName: $("#firstName").val(),
                clinicalTime: $("#clinicalTime").val(),
                authType: 1
            };
            $.mobile.loading("show",{
                text: '资料评论中，请稍等...', //加载器中显示的文字
                textVisible: true, //是否显示文字
                textonly: false,   //是否只显示文字
                html: ""           //要显示的html内容，如图片等
            });
            $("#loading_mask").show();
            $.ajax({
                url: '/mcall/customer/auth/save/',
                cache: false,
                data: {paramJson: $.toJSON(param)},
                dataType: 'json',
                type: "POST",
                success: function (data) {
                    var result = data.responseObject;
                    $("#loading_mask").hide();
                    $.mobile.loading('hide')
                    if (!result.responseStatus) {  // 保存失败

                    } else {           // 保存成功。
                        TempCache.removeItem("userInfo");
                        TempCache.removeItem("needConferenceAuth");
                        var fromPage = TempCache.getItem("fromPage");
                        var fromPageConference = TempCache.getItem("fromPageConference");
                        if (fromPageConference != undefined && fromPageConference != "") {
                        	$("#clinicalTime").parent().hide();
                        	$("#successTip").show();
                            comm.setCenter($("#successTip"));
                            TempCache.removeItem("fromPageConference");
                            setTimeout(function () {
                                comm.redirect(fromPageConference);
                            }, 3000);
                        } else {

                        }
                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    $("#loading_mask").hide();
                    $.mobile.loading('hide')
                }
            });
        }
    };


    index.init();

});