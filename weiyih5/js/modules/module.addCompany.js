/**
 * 功能描述：  联动
 * 使用方法:
 * 注意事件：
 * 引入来源：  作用：
 *
 * Created by LiChunHui on 2016/8/16.
 */
module.addCompany = function(obj) {
    //Log.createBrowse(131,'医院选择页');
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
            this.addCompanyBtn();
            this.cancelSearch();
            this.bindTextChange();
            $("#seachCompany").val("");
            $(".ev-backToMain").on("click", function() {
                comm.creatEvent({
                    triggerType:'全站功能按钮点击',
                    keyword:'选择医院取消',
                    actionId:45
                });
                setTimeout(function() {
                    $(".ev-mainInner").show();
                    $(".ev-companyInner").hide();
                    $(".ev-sProvince").show();
                    $(".ev-sCity").hide();
                    $(".ev-sCompany").hide();
                    $("#sCompany").stopScrollPagination();
                }, 500);
            });
            $(".ev-backToCompany").on("click", function() {
                setTimeout(function() {
                    $(".ev-companyInner").show();
                    $(".ev-addCompanyInner").hide();
                    $("#sCompany").stopScrollPagination();
                }, 500)

            });
            //返回
            $("#cityBack").on("click", function() {
                $(".ev-sProvince").show();
                $(".ev-sCity").hide();
                $("#sCompany").stopScrollPagination();
            });
            //返回
            $("#companyBack").on("click", function() {
                $(".ev-sCity").show();
                $(".ev-sCompany").hide();
                $(".al-noResult").hide();
                $("#sCompany").stopScrollPagination();
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
            $.ajax({
                type: 'POST',
                url: "/mcall/comm/data/region/json_list/",
                data: data,
                dataType: "json",
                timeout: 10000,
                success: function(rep) {
                    //comm.loading.hide();
                    var html = "";
                    if (rep && rep.responseObject.responseData.data_list) {
                        $.each(rep.responseObject.responseData.data_list, function(i, val) {
                            html += '<article class="al-searchResultItem" regionid="' + val.regionId + '">' + val.regionName + '<i class="icon-selected"></i></article>';
                        })
                    }
                    $("#sProvince").html(html);
                    t.options.getProvinceFn&&t.options.getProvinceFn();
                    t.options.triggerDom&&t.options.triggerDom.addClass('hasLoadData');
                    t.getCity();
                }
            });
        },
        //获取市
        getCity: function() {
            var t = this;
            $("#sProvince article").on("click", function() {
                $("#sProvince article").removeClass("selected");
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
                    success: function(rep) {
                        comm.loading.hide();
                        var html = "";
                        if (rep && rep.responseObject.responseData.data_list) {
                            $(".ev-sProvince").hide();
                            $(".ev-sCity").show();
                            $(".icon-backArrow").show();
                            $(".ev-sCity .backTitle").text(title);
                            $.each(rep.responseObject.responseData.data_list, function(i, val) {
                                html += '<article class="al-searchResultItem" regionid="' + val.regionId + '">' + val.regionName + '<i class="icon-selected"></i></article>';
                            });
                        }
                        $("#sCity").html(html);
                        t.options.getCityFn&&t.options.getCityFn();
                        t.getCompany();
                    }
                });
            });
        },
        //获取医院
        getCompany: function() {
            var t = this;
            $(".ev-sCompany").hide();
            $("#sCity article").off("click").on("click", function() {
                $("#sProvince article").removeClass("selected");
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
                    url: "/mcall/comm/data/hospital/json_list/",
                    data: data,
                    dataType: "json",
                    timeout: 10000,
                    success: function(rep) {
                        comm.loading.hide();
                        var html = "";
                        $(".al-noResult").show();
                        if (rep && rep.responseObject.responseData.data_list) {
                            $(".ev-sCity").hide();
                            $(".ev-sCompany").show();
                            $(".ev-sCompany .backTitle").text(title);
                            $.each(rep.responseObject.responseData.data_list, function(i, val) {
                                html += '<article class="al-searchResultItem" companyId ="'+val.id+'">' + val.hospitalName + '<i class="icon-selected"></i></article>';
                            });
                            $("#sCompany").html(html).show();
                            t.options.getCompanyFn&&t.options.getCompanyFn();
                            t.saveCompany();
                            //瀑布流
                            (function() {
                                $("#sCompany").scrollPagination({
                                    'contentPage': "/mcall/comm/data/hospital/json_list/",
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
                                            $("#sCompany").attr('scrollPagination', 'disabled');
                                            return false;
                                        } else {
                                            var html = "";
                                            $.each(data.responseObject.responseData.data_list, function(i, val) {
                                                html += '<article class="al-searchResultItem" companyId ="'+val.id+'">' + val.hospitalName + '<i class="icon-selected"></i></article>';
                                            });
                                            $("#sCompany").append(html);
                                            t.saveCompany();
                                        }
                                    }
                                });
                            })();
                        } else {
                            popup("本市下没有可选择的医院!");
                        }

                    }
                });
            });
        },
        //选择医院
        saveCompany: function() {
            var t = this;
            $("#sCompany article").off("click").on("click", function() {
                $(".ev-mainInner").show();
                $(".ev-companyInner").hide();
                $(".ev-sProvince").show();
                $(".ev-sCity").hide();
                $(".al-noResult").hide();
                $("#sProvince article").removeClass("selected");
                $("#sCompany").hide();
                if(t.options.wordLen){
                    t.options.container.css("color", "#222")
                        .attr({company:$(this).text(),'nowVal':$(this).text(),companyId:$(this).attr('companyId')}).text(comm.getStrLen($(this).text(),t.options.wordLen));
                }else{
                    t.options.container.css("color", "#222").attr({company:$(this).text(),'nowVal':$(this).text(),companyId:$(this).attr('companyId')}).text(comm.getStrLen($(this).text(),30));
                }

                t.options.fn&&t.options.fn();
                //$(".al-searchResult.expert").css("marginTop", "0");
            });
        },
        //添加医院
        addCompanyBtn: function() {
            var t = this;
            $(".ev-addCompanyBtn").off("click").on("click", function() {
                if($("#seachCompany").val()&&/^[\u4e00-\u9fa5\dA-Za-z]+$/.test($("#seachCompany").val())) {
                    $(".ev-sProvince").show();
                    $(".ev-sCity").hide();
                    $(".ev-sCompany").hide();
                    $(".ev-companyInner").hide();
                    $(".ev-addCompanyInner").show();
                    t.options.addCompanyFn && t.options.addCompanyFn();
                    $("#companyIn").val($("#seachCompany").val());
                }else {
                    popup("请输入中文、英文、数字");
                }
            });
            $("#saveCompany").off("click").on("click", function() {
                if ($.trim($("#companyIn").val())&&/^[\u4e00-\u9fa5\dA-Za-z]+$/.test($("#companyIn").val())) {
                    $(".ev-mainInner").show();
                    $(".ev-addCompanyInner").hide();
                    if(t.options.wordLen){
                        t.options.container.css("color", "#222")
                            .attr({"company":$("#companyIn").val(),"nowVal":$("#companyIn").val(),companyId:"0"})
                            .text(comm.getStrLen($("#companyIn").val(),t.options.wordLen));
                    }else{
                        t.options.container.css("color", "#222").attr({"company":$("#companyIn").val(),"nowVal":$("#companyIn").val(),companyId:"0"}).text(comm.getStrLen($("#companyIn").val(),30));
                    }

                    t.options.fn&&t.options.fn();
                }
            })
        },
        cancelSearch: function() {
            $("#cancelSearch").on("click", function() {
                $(".ev-sProvince").show();
                $(".ev-sCity").hide();
                $(".ev-sCompany").hide();
                $(".al-noResult").hide();
            })
        },
        //搜索医院
        bindTextChange: function() {
            var t = this;
            t.input = $("#seachCompany");
            comm.inputFocus();
            var fH = $(".al-searchHead").height();
            $(".al-searchResult").css("marginTop", "2.5rem");

            $(".al-searchInputBar input").on("click", function(e) {
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
                data.hospitalName = keyWord;
                data.pageIndex = 1;
                data.pageSize = t.pageSize;
                comm.loading.show();
                $.ajax({
                    type: 'get',
                    url: "/mcall/comm/data/hospital/json_list/",
                    data: data,
                    dataType: "json",
                    timeout: 10000,
                    success: function(rep) {
                        comm.loading.hide();
                        var html = "";
                        $(".ev-sProvince").hide();
                        $(".ev-sCity").hide();
                        $(".ev-sCompany").show();
                        $("#companyBack").hide();
                        $(".al-noResult").hide();
                        $("#sCompany").show();
                        if (rep && rep.responseObject.responseData.data_list) {
                            $.each(rep.responseObject.responseData.data_list, function(i, val) {
                                html += '<article class="al-searchResultItem" companyId ="'+val.id+'">' + val.hospitalName + '<i class="icon-selected"></i></article>';
                            });
                            $("#sCompany").html(html);
                            $("#companyIn").val();
                            t.saveCompany();
                        } else {
                            $("#sCompany").empty();
                            $("#companyIn").val(t.input.val());
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