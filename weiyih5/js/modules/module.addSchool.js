/**
 * 功能描述：  联动
 * 使用方法:
 * 注意事件：
 * 引入来源：  作用：
 *
 * Created by LiChunHui on 2016/8/16.
 */
module.addSchool = function(obj) {
    //Log.createBrowse(134,'学校选择页');
    var container = {
        init: function(options) {
            this.options = {};
            var o = {
                callback: function() {}
            };
            this.options = $.extend(o, options);
            this.scrollpage = 2;
            this.pageSize = 10;
            this.getProvince();
            this.addSchoolBtn();
            this.cancelSearch();
            this.bindTextChange();
            $("#seachSchool").val("");
            $(".ev-backToMain").on("click", function() {
                comm.creatEvent({
                    triggerType:'全站功能按钮点击',
                    keyword:'选择学校取消',
                    actionId:45
                });
                setTimeout(function() {
                    $(".ev-mainInner").show();
                    $(".ev-schoolInner").hide();
                    $(".ev-schoolProvince").show();
                    $(".ev-schoolCity").hide();
                    $(".ev-schoolCompany").hide();
                    $("#sSchool").stopScrollPagination();
                }, 500);
            });
            $(".ev-backToSchool").on("click", function() {
                setTimeout(function() {
                    $(".ev-schoolInner").show();
                    $(".ev-addSchoolInner").hide();
                    $("#sSchool").stopScrollPagination();
                }, 500)

            });
            //返回
            $("#schoolCityBack").on("click", function() {
                $(".ev-schoolProvince").show();
                $(".ev-schoolCity").hide();
                $("#sSchool").stopScrollPagination();

            });
            //返回
            $("#schoolBack").on("click", function() {
                $(".ev-schoolCity").show();
                $(".ev-schoolCompany").hide();
                $("#sSchool").stopScrollPagination();
                $(".al-noResult").hide();
            });
        },
        //获取省
        getProvince: function() {
            var t = this;
            var data = {};
            data.treeLevel = 2;
            data.pageIndex = 1;
            data.pageSize = 100;
            //comm.loading.show();
            if($('#schoolProvince').html()=="") {
                $.ajax({
                    type: 'POST',
                    url: "/mcall/comm/data/region/json_list/",
                    data: data,
                    dataType: "json",
                    timeout: 10000,
                    success: function (rep) {
                        //comm.loading.hide();
                        var html = "";
                        if (rep && rep.responseObject.responseData.data_list) {
                            $.each(rep.responseObject.responseData.data_list, function (i, val) {
                                html += '<article class="al-searchResultItem" regionid="' + val.regionId + '">' + val.regionName + '<i class="icon-selected"></i></article>';
                            })
                        }
                        $("#schoolProvince").html(html).show();
                        t.options.getProvinceFn&&t.options.getProvinceFn();
                        t.options.triggerDom&&t.options.triggerDom.addClass('hasLoadData');
                        $('.ev-schoolProvince').show();
                        t.getCity();
                    }
                });
            }else{
                $("#schoolProvince").show();
                $('.ev-schoolProvince').show();
                t.getCity();
            }
        },
        //获取市
        getCity: function() {
            var t = this;
            $("#schoolProvince article").on("click", function() {
                $("#schoolProvince article").removeClass("selected");
                $(".al-noResult").hide();
                $(this).addClass("selected");
                var title = $(this).text();
                var data = {};
                //data.treeLevel=2;
                data.parentId = $(this).attr("regionid");
                data.pageIndex = 1;
                data.pageSize = 100;
                comm.loading.show();
                $.ajax({
                    type: 'POST',
                    url: "/mcall/comm/data/region/json_list/",
                    data: data,
                    dataType: "json",
                    timeout: 10000,
                    success: function (rep) {
                        comm.loading.hide();
                        var html = "";
                        if (rep && rep.responseObject.responseData.data_list) {
                            $(".ev-schoolProvince").hide();
                            $(".ev-schoolCity").show();
                            $(".icon-backArrow").show();
                            $(".ev-schoolCity .backTitle").text(title);
                            $.each(rep.responseObject.responseData.data_list, function (i, val) {
                                html += '<article class="al-searchResultItem" regionid="' + val.regionId + '">' + val.regionName + '<i class="icon-selected"></i></article>';
                            });
                        }
                        $("#schoolCity").html(html).show();
                        t.options.getCityFn&&t.options.getCityFn();
                        t.getSchool();
                    }
                });

            });
        },
        //获取医院
        getSchool: function() {
            var t = this;
            $('.ev-schoolCompany').hide();
            $("#schoolCity article").off("click").on("click", function() {
                $("#schoolProvince article").removeClass("selected");
                $('.ev-schoolCity').hide();
                $("#sSchool").hide();
                $(this).addClass("selected");
                var title = $(this).text();
                var data = {};
                var cityId = $(this).attr("regionid");
                data.cityId = cityId;
                data.pageIndex = 1;
                data.pageSize = t.pageSize;
                comm.loading.show();
                $.ajax({
                    type: 'POST',
                    url: "/mcall/comm/data/school/json_list/",
                    data: data,
                    dataType: "json",
                    timeout: 10000,
                    success: function(rep) {
                        comm.loading.hide();
                        var html = "";
                        $(".al-noResult").show();
                        if (rep && rep.responseObject.responseData.data_list) {
                            $(".ev-schoolCity").hide();
                            $(".ev-schoolCompany").show();
                            $(".ev-schoolCompany .backTitle").text(title);
                            $.each(rep.responseObject.responseData.data_list, function(i, val) {
                                html += '<article class="al-searchResultItem" companyId="'+val.id+'">' + val.schoolName + '<i class="icon-selected"></i></article>';
                            });
                            $("#sSchool").html(html).show();
                            $('.ev-schoolCompany').show();
                            t.options.getCompanyFn&&t.options.getCompanyFn();
                            t.saveSchool();
                            //瀑布流
                            (function() {
                                $("#sSchool").scrollPagination({
                                    'contentPage': "/mcall/comm/data/school/json_list/",
                                    'noParamJson': 1,
                                    'contentData': {
                                        cityId: cityId,
                                        pageIndex: function() {
                                            return t.scrollpage++
                                        },
                                        pageSize: t.pageSize
                                    },
                                    'scrollTarget': $(window),
                                    'heightOffset': 0,
                                    'delaytime': 1000,
                                    'beforeLoad': function() {
                                        comm.loading.show();
                                    },
                                    'afterLoad': function(elementsLoaded) {
                                        comm.loading.hide();
                                    },
                                    'loader': function(data) {
                                        if ($.isEmptyObject(data.responseObject.responseData)) {
                                            $("#sSchool").attr('scrollPagination', 'disabled');
                                            return false;
                                        } else {
                                            var html = "";
                                            $.each(data.responseObject.responseData.data_list, function(i, val) {
                                                html += '<article class="al-searchResultItem" companyId="'+val.id+'">' + val.schoolName + '<i class="icon-selected"></i></article>';
                                            });
                                            $("#sSchool").append(html);
                                            t.saveSchool();
                                        }
                                    }
                                });
                            })();
                        } else {
                            popup("本市下没有可选择的学校!");
                        }

                    }
                });
            });
        },
        //选择医院
        saveSchool: function() {
            var t = this;
            $("#sSchool article").off("click").on("click", function() {
                $(".ev-mainInner").show();
                $(".ev-schoolInner").hide();
                $(".ev-schoolProvince").hide();
                $(".ev-schoolCity").hide();
                $(".al-noResult").hide();
                $("#schoolProvince article").removeClass("selected");
                $("#sSchool").hide();
                if(t.options.wordLen){
                    t.options.container.css("color", "#222")
                        .attr({"school":$(this).text(),"nowVal":$(this).text(),companyId:$(this).attr('companyId')})
                        .text(comm.getStrLen($(this).text(),t.options.wordLen));
                }else{
                    t.options.container.css("color", "#222").attr({"school":$(this).text(),"nowVal":$(this).text(),companyId:$(this).attr('companyId')}).text(comm.getStrLen($(this).text(),30));
                }

                t.options.fn&&t.options.fn();
                //$(".al-searchResult.expert").css("marginTop", "0");
            });
        },
        //添加医院
        addSchoolBtn: function() {
            var t = this;
            $(".ev-addSchoolBtn").off("click").on("click", function() {
                if($("#seachSchool").val()&&/^[\u4e00-\u9fa5\dA-Za-z]+$/.test($("#seachSchool").val())){
                    $(".ev-schoolProvince").hide();
                    $(".ev-schoolCity").hide();
                    $(".ev-sSchool").hide();
                    $(".ev-schoolInner").hide();
                    $(".ev-addSchoolInner").show();
                    $("#schoolIn").val($("#seachSchool").val());
                    t.options.addCompanyFn&&t.options.addCompanyFn();
                }else{
                    popup("请输入中文、英文、数字");
                }
            });
            $("#saveSchool").off("click").on("click", function() {
                if ($.trim($("#schoolIn").val())&&/^[\u4e00-\u9fa5\dA-Za-z]+$/.test($("#schoolIn").val())) {
                    $(".ev-mainInner").show();
                    $(".ev-addSchoolInner").hide();
                    if(t.options.wordLen){
                        t.options.container.css("color", "#222")
                            .attr({"school": $("#schoolIn").val(),"nowVal":$("#schoolIn").val(),companyId:"0"})
                            .text(comm.getStrLen($("#schoolIn").val(),t.options.wordLen));
                    }else{
                        t.options.container.css("color", "#222").attr({"school": $("#schoolIn").val(),"nowVal":$("#schoolIn").val(),companyId:"0"}).text(comm.getStrLen($("#schoolIn").val(),30));
                    }

                    t.options.fn&&t.options.fn();
                }else{
                    popup("请输入中文、英文、数字");
                }
            })
        },
        cancelSearch: function() {
            $("#cancelSearch").on("click", function() {
                $(".ev-schoolProvince").show();
                $(".ev-schoolCity").hide();
                $(".ev-sSchool").hide();
                $(".al-noResult").hide();
            })
        },
        //搜索学校
        bindTextChange: function() {
            var t = this;
            t.input = $("#seachSchool");
            comm.inputFocus();
            var fH = $(".al-searchHead").height();
            $(".al-searchResult").css("marginTop", "2.5rem");

            $(".al-searchInputBar").find("input").on("click", function(e) {
                $(".al-searchResult").css("marginTop", '1.4rem');
            });
            $(".al-searchCancel").on("click", function(e) {
                if (e.target.className === "icon-searchCancel") {
                    return;
                }
                $(".al-searchResult").css("marginTop", "2.5rem");
            });



            var val = "",
                val2 = "",
                changeInterval;
            t.input.on("focus", function() {

                changeInterval = setInterval(function() {
                    val2 = t.input.val();
                    if (val != val2) {
                        // t.input.val(t.input.val().replace(/[^\u4e00-\u9fa5\dA-Za-z]/g, ''));
                        if(t.input.val()) {
                            if(/^[\u4e00-\u9fa5\dA-Za-z]+$/.test(t.input.val())){
                                changeHandler(t.input.val());
                            }/*else{
                                // t.input.val(t.input.val().replace(/[^\u4e00-\u9fa5\dA-Za-z]/g, ''));
                                popup("请输入中文、英文、数字");
                            }*/
                        }
                    }
                }, 500);
            });
            t.input.on("blur", function() {
                clearInterval(changeInterval);
            });
            t.input.on("input change",function () {//input框中的值发生变化
                val2 = t.input.val();
                if (val != val2) {
                    if(t.input.val()) {
                    // if(/[\u4e00-\u9fa5\dA-Za-z]/.test(t.input.val())){
                    if(/^[\u4e00-\u9fa5\dA-Za-z]+$/.test(t.input.val())){
                            changeHandler(t.input.val());
                    }else{
                        // t.input.val(t.input.val().replace(/[^\u4e00-\u9fa5\dA-Za-z]/g, ''));
                        popup("请输入中文、英文、数字");
                    }
                    }
                }
            });

            function changeHandler(keyWord) {
                var data = {};
                data.schoolName = keyWord;
                data.pageIndex = 1;
                data.pageSize = t.pageSize;
                comm.loading.show();
                $.ajax({
                    type: 'get',
                    url: "/mcall/comm/data/school/json_list/",
                    data: data,
                    dataType: "json",
                    timeout: 10000,
                    success: function(rep) {
                        comm.loading.hide();
                        var html = "";
                        $(".ev-schoolProvince").hide();
                        $(".ev-schoolCity").hide();
                        $(".ev-sSchool").show();
                        $(".ev-schoolCompany").show();
                        $("#schoolBack").hide();
                        $(".al-noResult").hide();
                        $("#sSchool").show();
                        if (rep && rep.responseObject.responseData.data_list) {
                            $.each(rep.responseObject.responseData.data_list, function(i, val) {
                                html += '<article class="al-searchResultItem"  companyId="'+val.id+'">' + val.schoolName + '<i class="icon-selected"></i></article>';
                            });
                            $("#sSchool").html(html);
                            $("#schoolIn").val();
                            t.saveSchool();
                        } else {
                            $("#sSchool").empty();
                            $("#schoolIn").val(t.input.val());
                            $(".al-noResult").show();
                        };
                        val = val2;
                    }
                });

            }
        }
    };
    container.init(obj);
}