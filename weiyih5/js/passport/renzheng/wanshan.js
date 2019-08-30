$(function () {
    var medTitle={
        init:function(){
            var t=this;
            this.para=comm.getpara();
            this.getMedTitle();
            this.bindReturnBtn();
            this.value="";
        },
        bindReturnBtn: function () {
            var t = this;
            $(".back").on("vclick", function () {
                //history.back(-1);
                comm.showPage("#renzhengPage");
            });
        },
        getMedTitle:function(){
            var t=this;
            $.mobile.loading("show");
            $.ajax({
                type:'POST',
                url:"/mcall/comm/data/medicalTitle/json_list/",
                data:{pageIndex:1,pageSize:100},
                dataType:"json",
                timeout:10000,
                success : function callback(rep) {
                    var html1=html2=html3="";
                    $.mobile.loading("hide");
                    if(rep&&rep.responseObject.responseData&&rep.responseObject.responseData.data_list){
                        $.each(rep.responseObject.responseData.data_list,function(i,val){
                            if(i<4){
                                html1+='<li tagid="'+val.id+'" select="no"><div class="add_tag_mr">'+val.medicalTitle+'</div></li>';
                            }else if(i<7){
                                html2+='<li tagid="'+val.id+'" select="no" '+(i==4?'style="border-top:solid 0.13em #dfdfdf;"':'')+'><div class="add_tag_mr">'+val.medicalTitle+'</div></li>';
                            }else{
                                html3+='<li tagid="'+val.id+'" select="no" '+(i==7?'style="border-top:solid 0.13em #dfdfdf;"':'')+'><div class="add_tag_mr">'+val.medicalTitle+'</div></li>';
                            }
                        })
                    };
                    $("#medical01").html(html1);
                    $("#medical02").html(html2);
                    $("#medical03").html(html3);
                    t.hasSelect();
                    t.selectMedical();
                    if(t.para.occId&&t.para.occId!=0){
                        $("#save").on("vclick",function(){
                            t.setLocalStorage();
                            //g_sps.jump(null,pageurl.urlList.toOccupation.url+"?customerId="+t.para.customerId+"&id="+t.para.occId);
                            history.go(-1)
                        })
                    }else if(t.para.occId==0){
                        $("#save").on("vclick",function(){
                            t.setLocalStorage();
                          g_sps.jump(null,pageurl.urlList.toOccupation.url+"?customerId="+t.para.customerId);
                        })
                    }else{
                        t.saveMedical();
                    }
                }
            });
        },
        //初始化选择
        hasSelect:function(){
            var tagId;
            var ids=this.para.ids;
            if(ids){
                tagId=ids.split(",");
                $.each(tagId,function(i,val){
                    $.each($(".zc_content li"),function(j,em){
                        if(val==$(em).attr("tagid")){
                            $(em).attr("select","yes");
                            $(em).find("div").removeClass("add_tag_mr").addClass("add_tag_xz");
                        }
                    })

                })
            };
        },
        //选择
        selectMedical:function(){
            $.each($("#medical01 li"),function(i,em){
                $(em).on("vclick",function(){
                    if($(em).attr("select")=="no"){
                        $("#medical01 li").attr("select","no");
                        $("#medical01 div").removeClass("add_tag_xz").addClass("add_tag_mr");
                        $(em).attr("select","yes");
                        $(em).find("div").removeClass("add_tag_mr").addClass("add_tag_xz");
                    }else{
                        $(em).attr("select","no");
                        $(em).find("div").removeClass("add_tag_xz").addClass("add_tag_mr");
                    }
                });
            });
            $.each($("#medical02 li"),function(i,em){
                $(em).on("vclick",function(){
                    if($(em).attr("select")=="no"){
                        $("#medical02 li").attr("select","no");
                        $("#medical02 div").removeClass("add_tag_xz").addClass("add_tag_mr");
                        $(em).attr("select","yes");
                        $(em).find("div").removeClass("add_tag_mr").addClass("add_tag_xz");
                    }else{
                        $(em).attr("select","no");
                        $(em).find("div").removeClass("add_tag_xz").addClass("add_tag_mr");
                    }
                });
            });
            $.each($("#medical03 li"),function(i,em){
                $(em).on("vclick",function(){
                    if($(em).attr("select")=="no"){
                        $("#medical03 li").attr("select","no");
                        $("#medical03 div").removeClass("add_tag_xz").addClass("add_tag_mr");
                        $(em).attr("select","yes");
                        $(em).find("div").removeClass("add_tag_mr").addClass("add_tag_xz");
                    }else{
                        $(em).attr("select","no");
                        $(em).find("div").removeClass("add_tag_xz").addClass("add_tag_mr");
                    }
                });
            });
        },
        //更新职称
        saveMedical:function(){


            var t=this;
            $("#medicalTitleSave").on("vclick",function(){
                $.mobile.loading("show");
                medicalTitle="";
                $.each($(".zc_content li"),function(i,em){
                    if($(em).attr("select")=="yes"){
                        medicalTitle+=($(em).attr("tagid")+"_"+$(em).find("div").text()+",");
                    }
                })
                var data={};
                data.customerId=t.para.customerId;
                data.medicalTitle=medicalTitle.substring(0,medicalTitle.length-1);
                $("#medicalTitleChoose .text").text(comm.removeMedicalTitleNum(medicalTitle.replace(/\,/gi,"、").replace(/、$/g,'')));
                t.value = medicalTitle.substring(0,medicalTitle.length-1);
                comm.showPage("#renzhengPage");
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
        setLocalStorage:function(){
            var occ={};
            occ.tagContent=[];
            $(".zc_content li").each(function(i,em){
                if($(em).attr("select")=="yes"){
                    var tagId=$(em).attr("tagid");
                    var tagName=$(em).find("div").text();

                    occ.tagContent.push([tagId,tagName,tagId+"_"+tagName]);
                }
            });
            if(localStorage.getItem("occ")){
                var occu=JSON.parse(localStorage.getItem("occ"));
                occ.address=occu.address;
                occ.department=occu.department;
                occ.unit=occu.unit;
                occ.startTime=occu.startTime;
                occ.endTime=occu.endTime;
            }
            localStorage.setItem("occ", JSON.stringify(occ));
        }
    };


    var areasExp={
        init:function(){
            this.para=comm.getpara();
            this.getTag();
            this.value = "";
        },
        //数据初始化
        getTag:function(){
            var t=this;
            var html="";
            var data={};
            data.treeLevel=2;
            data.pageIndex=1;
            data.pageSize=100;
            $.mobile.loading("show");
            $.ajax({
                url:"/mcall/comm/data/tag/json_list/",
                data : data,
                dataType:"json",
                timeout:10000,
                success : function(rep){
                    $.mobile.loading("hide");
                    if(rep&&rep.responseObject.responseStatus){
                        $.each(rep.responseObject.responseData.data_list,function(i,val){
                            html+='<li tagid="'+val.id+'" select="no"><div class="add_tag_mr">'+val.tagName+'</div></li>';
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
        hasSelect:function(){
            var tagId;
            var ids=this.para.ids;
            if(ids){
                tagId=ids.split(",");
                $.each(tagId,function(i,val){
                    $.each($(".add_tag_li li"),function(j,em){
                        if(val==$(em).attr("tagid")){
                            $(em).attr("select","yes")
                            $(em).find("div").removeClass("add_tag_mr").addClass("add_tag_xz");
                        }
                    })

                })
            };
        },
        //数据的选择
        selectTag:function(){
            $.each($(".add_tag_li li"),function(i,em){
                $(em).on("vclick",function(){
                    if($(em).attr("select")=="no"){
                        $(em).attr("select","yes");
                        $(em).find("div").removeClass("add_tag_mr").addClass("add_tag_xz");
                    }else{
                        $(em).attr("select","no");
                        $(em).find("div").removeClass("add_tag_xz").addClass("add_tag_mr");
                    }
                });
            })
        },
        //保存专业领域
        saveAreaExp:function(){
            var t=this;
            $("#areasExpertiseSave").on("vclick",function(){
                $.mobile.loading("show");
                var areasExpertise="";
                $.each($(".add_tag_li li"),function(i,em){
                    if($(em).attr("select")=="yes"){
                        areasExpertise+=($(em).attr("tagid")+"_"+$(em).find("div").text()+",");
                    }
                });
                var data={};
                data.customerId=t.para.customerId;
                data.areasExpertise=areasExpertise.substring(0,areasExpertise.length-1);
                $("#areaExpertiseChoose .text").text(comm.removeMedicalTitleNum(data.areasExpertise.replace(/\,/gi,"、")));

                t.value = data.areasExpertise ;
                comm.showPage("#renzhengPage");
                $.mobile.loading("hide");
                index.validate();
            });
        }
    };

    var company={
        init:function(){
            var t=this;
            this.scrollpage=2;
            this.pageSize=10;
            this.para=comm.getpara();
            this.getProvince();
            this.val='';
            //this.value=companyVal?companyVal:"";
            //this.companyId=companyId?companyId:"0";

            $("#cityBack").on("vclick",function(){
                $("#sProvince").show();
                $("#sCity").hide();
            });
            $("#companyBack").on("vclick",function(){
                $("#sCity").show();
                $("#sCompany").hide();
            });
            $("#schoolCityBack").on("vclick",function(){
                $("#schoolProvince").show();
                $("#schoolCity").hide();
            });
            $("#schoolBack").on("vclick",function(){
                $("#schoolCity").show();
                $("#sSchool").hide();
            });
            this.saveCompany();
            this.search();
            this.bindTextChange();
            this.bindTextChange2();
            this.schoolAddSave();
            $(".add").on("vclick",function(){
                //g_sps.jump(null,pageurl.urlList.toAddCompany.url+"?customerId="+t.para.customerId);
                //$("#companyName").val(para.name)
                comm.showPage("#addCompanyPage");
            });
            $(".addCompany").on("vclick",function(){
                //g_sps.jump(null,pageurl.urlList.toAddCompany.url+"?customerId="+t.para.customerId+"&name="+t.input.val());
                comm.showPage("#addCompanyPage");
                $("#companyName").val(t.input.val());
            });
        },
        schoolAddSave:function(){
            $(".addSchool").on("vclick",function(){
                comm.showPage("#addSchoolPage");
            });
            $(".addSchool").on("vclick",function(){
                comm.showPage("#addSchoolPage");
                $("#schoolFullName").val($('#seachSchoolKey').val());
                return false;
            });

        },
        //获取省
        getProvince:function(){
            var t=this;
            var data={};
            data.treeLevel=2;
            data.pageIndex=1;
            data.pageSize=100;
            $.mobile.loading("show");
            $.ajax({
                type:'POST',
                url:"/mcall/comm/data/region/json_list/",
                data:data,
                dataType:"json",
                timeout:10000,
                success : function(rep) {
                    $.mobile.loading("hide");
                    var html="";
                    if(rep&&rep.responseObject.responseData.data_list){
                        $.each(rep.responseObject.responseData.data_list,function(i,val){
                            html+="<li regionid="+val.regionId+">"+val.regionName+"</li>";
                        });
                    }
                    $(".province").html(html);
                    t.getCity();
                }
            });
            return false;
        },
        //获取市
        getCity:function(){
            var t=this;
            $(".province li").on("vclick",function(){
                var data={};
                //data.treeLevel=2;
                data.parentId=$(this).attr("regionid");
                data.pageIndex=1;
                data.pageSize=100;
                $.mobile.loading("show");
                $.ajax({
                    type:'POST',
                    url:"/mcall/comm/data/region/json_list/",
                    data:data,
                    dataType:"json",
                    timeout:10000,
                    success : function(rep) {
                        $.mobile.loading("hide");
                        var html="";
                        if(rep&&rep.responseObject.responseData.data_list){
                            if($('#companyPage').is(':visible')){
                                $("#sProvince").hide();
                                $("#sCity").show();
                            }else{
                                $("#schoolProvince").hide();
                                $("#schoolCity").show();
                            }
                            $.each(rep.responseObject.responseData.data_list,function(i,val){
                                html+="<li regionid="+val.regionId+">"+val.regionName+"</li>";
                            });
                        }
                        $(".city").html(html);
                        t.getCompany();
                        t.getSchool();
                    }
                });
                return false;
            });
        },
        //获取学校
        getSchool:function(){
            var t=this;
            $('#schoolCity li').off('vclick').on('vclick',function(){
                var data={};
                var cityId=$(this).attr("regionid");
                data.cityId=cityId;
                data.pageIndex=1;
                data.pageSize=t.pageSize;
                $.mobile.loading("show");
                $.ajax({
                    type:'POST',
                    url:"/mcall/comm/data/school/json_list/",
                    data:data,
                    dataType:"json",
                    timeout:10000,
                    success : function(rep) {
                        $.mobile.loading("hide");
                        var html="";
                        if(rep&&rep.responseObject.responseData.data_list){
                            $("#schoolCity").hide();
                            $("#sSchool").show();
                            $.each(rep.responseObject.responseData.data_list,function(i,val){
                                html+="<li companyId='"+val.id+"'>"+val.schoolName+"</li>";
                            });
                            $("#schools").html(html);
                            //瀑布流
                            (function(){
                                $("#schools").scrollPagination({
                                    'contentPage':"/mcall/comm/data/school/json_list/",
                                    'noParamJson':1,
                                    'contentData':{cityId:cityId,pageIndex:function(){return t.scrollpage++},pageSize:t.pageSize},
                                    'scrollTarget': $(window),
                                    'heightOffset': 0,
                                    'delaytime':1000,
                                    'beforeLoad': function(){
                                        $(".load").fadeIn();
                                    },
                                    'afterLoad': function(elementsLoaded){
                                        $('.load').fadeOut();
                                    },
                                    'loader':function(data){
                                        if($.isEmptyObject(data.responseObject.responseData)){
                                            //$(".none").show();
                                            $("#company").attr('scrollPagination', 'disabled');
                                            //alert("没有内容了");
                                            return false;
                                        }else{
                                            var htm="";
                                            $.each(data.responseObject.responseData.data_list,function(i,val){
                                                htm+="<li companyId='"+val.id+"'>"+val.schoolName+"</li>";
                                            });
                                            //$(".none").hide();
                                            $("#schools").append(htm);
                                        }
                                    }
                                });
                            })();
                        }else{
                            $("#schoolCity").hide();
                            $("#sSchool").show();
                            $("#schools").html("");
                        }

                    }
                })
            });
        },
        //获取医院
        getCompany:function(){
            var t=this;
            $("#city li").off("vclick").on("vclick",function(){
                var data={};
                var cityId=$(this).attr("regionid");
                data.cityId=cityId;
                data.pageIndex=1;
                data.pageSize=t.pageSize;
                $.mobile.loading("show");
                $.ajax({
                    type:'POST',
                    url:"/mcall/comm/data/hospital/json_list/",
                    data:data,
                    dataType:"json",
                    timeout:10000,
                    success : function(rep) {
                        $.mobile.loading("hide");
                        var html="";
                        if(rep&&rep.responseObject.responseData.data_list){
                            $("#sCity").hide();
                            $("#sCompany").show();
                            $.each(rep.responseObject.responseData.data_list,function(i,val){
                                html+="<li companyId='" + val.id + "'>"+val.hospitalName+"</li>";
                            });
                            $("#company").html(html);
                            //瀑布流
                            (function(){
                                $("#company").scrollPagination({
                                    'contentPage':"/mcall/comm/data/hospital/json_list/",
                                    'noParamJson':1,
                                    'contentData':{cityId:cityId,pageIndex:function(){return t.scrollpage++},pageSize:t.pageSize},
                                    'scrollTarget': $(window),
                                    'heightOffset': 0,
                                    'delaytime':1000,
                                    'beforeLoad': function(){
                                        $(".load").fadeIn();
                                    },
                                    'afterLoad': function(elementsLoaded){
                                        $('.load').fadeOut();
                                    },
                                    'loader':function(data){
                                        if(isEmptyObject(data.responseObject.responseData)){
                                            //$(".none").show();
                                            $("#company").attr('scrollPagination', 'disabled');
                                            //alert("没有内容了");
                                            return false;
                                        }else{
                                            var htm="";
                                            $.each(data.responseObject.responseData.data_list,function(i,val){
                                                htm+="<li>"+val.hospitalName+"</li>";
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
        saveCompany:function(){
            var t=this;
            $(document).on("click","#company li",function(){
                t.save($(this));
            });
            $(document).on("click","#schools li",function(){
                t.save($(this),'school');
            });
        },
        //点击搜索
        search:function(){
            var t=this;
            this.input=$("#seachKey");
            $("#searchPop").css({
                position:"absolute",
                top:0,
                left:-$("#searchPop").width()
            });
            $(".search_btn").on("vclick",function(){
                $("#searchPop .yy_none").hide();
                $("#searchPop").show().animate({left:0},function(){
                    t.input.focus();
                    setTimeout(function(){
                        $("#searchPop .cancel").on("vclick",function(){
                            t.closeSearch();
                        });
                    },500);
                });
            });
            $(".search_school_btn").on("vclick",function(){
                $("#searchSchoolPop .yy_none").hide();
                $("#searchSchoolPop").show().animate({left:0},function(){
                    $("#SchoolProvince").hide();
                    $("#seachSchoolKey").focus();
                    setTimeout(function(){
                        $("#searchSchoolPop .cancel").on("vclick",function(){
                            t.closeSearch("school");
                        });
                    },500);
                });
            });
            $(".yy_s_close").on("vclick",function(){
                t.input.val("");
            });
        },
        closeSearch:function(){
            var t = this;
            //$("#searchPop").animate({left:-$("#searchPop").width()},"slow",function(){
            //    $("#searchPop").hide();
            //});
            //$("#searchPop .cancel").off("vclick");
            //$("#search_list").empty();
            if(school){
                $("#searchSchoolPop").animate({left: '-100%'}, "slow", function () {
                    $("#searchSchoolPop").hide();
                });
                $("#searchSchoolPop .cancel").off("vclick");
                $("#search_school_list").empty();
                $("#schoolProvince").show();
            }else {
                $("#searchPop").animate({left: -$("#searchPop").width()}, "slow", function () {
                    $("#searchPop").hide();
                });
                $("#searchPop .cancel").off("vclick");
                $("#search_list").empty();
                $("#province").show();
            }
        },
        bindTextChange:function(){
            var t = this;
            var val = "",val2 = "",changeInterval;
            t.input.on("focus",function(){

                changeInterval = setInterval(function(){
                    val2 = t.input.val();
                    if(val != val2){
                        changeHandler(t.input.val());
                    }
                },500);
            });
            t.input.on("blur",function(){
                clearInterval(changeInterval);
            });
            t.input.on("change",function(){
                if(val != val2){
                    changeHandler(t.input.val());
                }
            });

            function changeHandler(keyWord){
                var data={};
                data.hospitalName=keyWord;
                data.pageIndex=1;
                data.pageSize=t.pageSize;
                $(".add_tag_li_loading").show();
                $.ajax({
                    type:'get',
                    url:"/mcall/comm/data/hospital/json_list/",
                    data:data,
                    dataType:"json",
                    timeout:10000,
                    success : function(rep) {
                        $(".add_tag_li_loading").hide();
                        var html="";
                        if(rep&&rep.responseObject.responseData.data_list){
                            $.each(rep.responseObject.responseData.data_list,function(i,val){
                                html+="<li>"+val.hospitalName+"</li>";
                            });
                            $("#search_list").html(html);
                            $("#search_list li").on("vclick",function(){
                                t.save($(this),'company');
                            })
                            $("#searchPop .yy_none").show();
                            $(".yy_none_search").hide();
                        }else{
                            $("#search_list").empty();
                            $("#searchPop .yy_none").hide();
                            $(".yy_none_search").show();
                            $(".name").text(t.input.val());
                        };
                        val = val2;
                    }
                });
            }
        },
        //搜索学校
        bindTextChange2:function(){
            var t = this;
            var val = "",val2 = "",changeInterval;
            var schoolInput = $('#seachSchoolKey');
            schoolInput.on("focus",function(){
                changeInterval = setInterval(function(){
                    val2 = schoolInput.val();
                    if(val != val2){
                        changeHandler(schoolInput.val());
                    }
                },500);
            });
            schoolInput.on("blur",function(){
                clearInterval(changeInterval);
            });
            schoolInput.on("change",function(){
                if(val != val2){
                    changeHandler(schoolInput.val());
                }
            });

            function changeHandler(keyWord){
                var data={};
                data.schoolName=keyWord;
                data.pageIndex=1;
                data.pageSize=t.pageSize;
                $(".add_tag_li_loading").show();
                $.ajax({
                    type:'get',
                    url:"/mcall/comm/data/school/json_list/",
                    data:data,
                    dataType:"json",
                    timeout:10000,
                    success : function(rep) {
                        $(".add_tag_li_loading").hide();
                        var html="";
                        if(rep&&rep.responseObject.responseData.data_list){
                            $.each(rep.responseObject.responseData.data_list,function(i,val){
                                html+="<li>"+val.schoolName+"</li>";
                            });
                            $("#search_school_list").html(html);
                            $("#search_school_list li").on("vclick",function(){
                                t.save($(this),'school');
                            })
                            $("#searchSchoolPop .yy_none").show();
                            $(".yy_none_search").hide();
                        }else{
                            $("#search_school_list").empty();
                            $("#searchSchoolPop .yy_none").hide();
                            $(".yy_none_search").show();
                            $(".schoolName").text(schoolInput.val());
                        };
                        val = val2;
                    }
                });
            }
        },
        //save
        save:function($this,name){
            $.mobile.loading("show");
            var data={};
            if(name=="school"){
                data.schoolName = $this.text();
                data.schoolId = $this.attr('companyId')?$this.attr('companyId'):'';
                this.type = 2;
            }else{
                data.company = $this.text();
                data.companyId = $this.attr('companyId')?$this.attr('companyId'):"";
                this.type = 1;
            }
            $("#companyChoose .text").text(comm.getStrLen(data.company||data.schoolName,30));

            this.value = $this.text();
            this.companyId = $this.attr('companyId')?$this.attr('companyId'):"";
            comm.showPage("#renzhengPage");
            $.mobile.loading("hide");
            index.validate();
        }
    };

    var index = {
        init: function () {
            var t = this;
            var companyVal,companyId,mediVal,areaVal;
            var userInfo = user.getRenZhengInfo();
            if(userInfo.company!="" && userInfo.medicalTitle!="" && userInfo.areasExpertise!=""){
                //alert("资料已完整");
                //window.location = "/";
                //return;
            }
            areasExp.init();
            medTitle.init();
            //company.init();
            areasExp.value =userInfo.areasExpertise;
            if(userInfo.company==''){//学校
                company.value = userInfo.schoolName;
                company.type=2;
                company.companyId=userInfo.schoolId;

            }else{
                company.value = userInfo.company;
                company.type=1;
                company.companyId=userInfo.companyId;
            }
            companyVal=company.value;

            medTitle.value = userInfo.medicalTitle;
            $("#companyChoose .text").text(company.value);
            $("#medicalTitleChoose .text").text(comm.removeMedicalTitleNum(userInfo.medicalTitle));
            $("#areaExpertiseChoose .text").text(comm.removeMedicalTitleNum(userInfo.areasExpertise));
            t.bindChoose();
            t.bindAddCompany();
            //为什么
            $(".para a").on("vclick",function(){
                popup("唯医是一个专业的医生社区，为保障你的权益。我们需要认证你的医师身份。谢谢配合。");
            });

            $("#lastName").on("change",function(){
                t.validate();
            });
            $("#firstName").on("change",function(){
                t.validate();
            });

            $("#notRenZheng").on("vclick",function(){
                //var t = document.referrer;
                var t = "/";
                var fromPage = TempCache.getItem("fromPage");
                if(fromPage!=undefined && fromPage!="") {
                    t = fromPage
                }
                user.getSessionInfo();
                g_sps.jump(null,t);

                //history.go(-1);
            });

        },
        bindChoose: function () {
            $("#companyChoose").on("vclick", function () {
                //$.mobile.changePage("#companyPage");
                $('.auth_mask').show();
                return false;
            });

            $("#medicalTitleChoose").on("vclick", function () {
                comm.showPage("#medicalTitlePage");
            });
            $("#areaExpertiseChoose").on("vclick", function () {
                comm.showPage("#areasExpertisePage");
                $(".add_tag_li").css({
                    height:$(window).height()-$('#areasExpertisePage .case_header').height()-$('#areasExpertiseSave').height(),
                    overflow:"auto"
                });
            });
            $(".ev_inHospital").on("vclick", function () {
                comm.showPage("#companyPage");
                company.init();
                Log.createBrowse(131,'医院选择页');
                $('.auth_mask').hide();
                return false;
            });
            $(".ev_inSchool").on("vclick", function () {
                comm.showPage("#schoolPage");
                company.init();
                Log.createBrowse(134,'学校选择页');
                $('.auth_mask').hide();
                return false;
            });
            $('.auth_company_cancel').on('vclick',function(){
                $('.auth_mask').hide();
                return false;
            });
        },
        bindUpload: function (path) {
            var t = this;
            if($("#uploadPic1 [id^=czyx]").length>0){
                $("#uploadPic1").html('<input type="file"    id="file1" name="file" data-role="none" />');
                // $("#uploadPic1 input").textinput();
            }
            czyx.uploadReplace('#file1',{
                url:commdata.urlList.uploadLogo.url, //文件处理的URL,
                data:{imageType:"2"},
                uploadReplaceCss:{
                    //设置上传按钮图片
                    background:'url('+ path +') center no-repeat',
                    backgroundSize:'100%',
                    width:"2.2rem",             //上传按钮的宽度
                    height:"2.2rem",              //上传按钮的高度
                    margin:"6px 10px 6px 0",
                    float:"right",
                    overflow:"hidden"
                },
                uploadInputCss:{
                    width:"90%",             //上传按钮的宽度
                    height:"5.5em"             //上传按钮的高度
                },
                uploadBefore:function(){
                    if(!/\.((jpg)|(gif)|(png))$/i.test(this.value)){
                        popup('只允许上传.jpg .gif .png类型的图片文件');
                        return false ;
                    }
                    var fileSize =comm.getFileSize(document.getElementById("file1"));
                    if(fileSize>5242880){
                        popup('图片不能大于'+5242880/1048576+"M");
                        return false;
                    }
                    $.mobile.loading('show', {
                        text: '上传中...', //加载器中显示的文字
                        textVisible: true, //是否显示文字
                        theme: 'a',        //加载器主题样式a-e
                        textonly: false,   //是否只显示文字
                        html: ""           //要显示的html内容，如图片等
                    });
                },
                uploadEnd:function(serverJson){//上传完毕后调用
                    $.mobile.loading('hide');
                    try{
                        serverJson = $.parseJSON($(serverJson).html());
                        if(serverJson.responseObject.responseStatus) {
                            popup("证件上传成功")    // serverJson.responseObject.responseMessage.url
                            $("#certificatesCodePic").val(serverJson.responseObject.responseMessage.path);
                            t.bindUpload(serverJson.responseObject.responseMessage.path);
                            t.validate();
                        }else{
                            popup(serverJson.responseObject.responseMessage);
                        }
                    }catch(e){
                        popup('上传失败');
                        return ;
                    }
                }
            });
        },
        bindAddCompany: function () {
            var t = this;
            $("#addCompanySave").on("vclick",function(){
                if($("#companyName").val().length>200){
                    popup("所填医院字数过长!");
                }else{
                    $.mobile.loading("show");
                    var data={};
                    data.company=$("#companyName").val();
                    $.mobile.loading("hide");
                    company.value = data.company;
                    company.type=1;
                    $("#companyChoose .text").text(comm.getStrLen(data.company,30));
                    comm.showPage("#renzhengPage");
                    t.validate();
                }
            });
            $("#addSchoolSave").on("vclick",function(){
                if($("#schoolFullName").val().length>200){
                    popup("所填学校字数过长!");
                }else{
                    $.mobile.loading("show");
                    var data={};
                    data.company=$("#schoolFullName").val();
                    $.mobile.loading("hide");
                    company.value = data.company;
                    company.type=2;
                    $("#companyChoose .text").text(comm.getStrLen(data.company,30));
                    //$.mobile.changePage("#renzhengPage")
                    comm.showPage("#renzhengPage");
                }
            });
        },
        validate: function () {
            var t = this;

            var valid = true;

            if(company.value==""){
                valid = false;
                console.log("company.value"+company.value);
            }
            if(areasExp.value==""){
                valid = false;
                console.log("areasExp.value"+areasExp.value);
            }
            if(medTitle.value==""){
                valid = false;
                console.log("medTitle.value"+medTitle.value);
            }
            console.log(valid);
            if(!valid){
                $("#submit").off('vclick').addClass("disabled");
            }else{
                $("#submit").on('vclick', function () {
                    t.submit();
                }).removeClass("disabled");
            }
        },
        submit: function () {

            var param = {
                //company:company.value,
                medicalTitle:medTitle.value,
                areasExpertise:areasExp.value,
                authType:1,
                company:company.type==1?company.value:"",
                companyId:company.type==1?company.companyId:"",
                schoolName:company.type==2?company.value:"",
                schoolId:company.type==2?company.companyId:"",
            };

            $.ajax({
                url: '/mcall/customer/auth/save/',
                cache: false,
                data:{paramJson: $.toJSON(param)},
                dataType:'json',
                type:"POST",
                success: function(data){
                    var result = data.responseObject;
                    if(!result.responseStatus){  // 保存失败

                    }else{           // 保存成功。
                        TempCache.removeItem("userInfo");
                        var fromPage = TempCache.getItem("fromPage");
                        $("#successTip").show();
                        comm.setCenter($("#successTip"));
                        if(fromPage!=undefined && fromPage!=""){

                            TempCache.removeItem("fromPage");
                            setTimeout(function () {
                                comm.redirect(fromPage);
                            },3000);
                        }else{
                            if(history.length){
                                setTimeout(function () {
                                    history.back(-1);
                                },3000);
                            }else{
                                setTimeout(function () {
                                  g_sps.jump(null,'/');
                                },3000);
                            }

                        }
                    }
                },
                error:function (XMLHttpRequest, textStatus, errorThrown) {

                }
            });
        }
};
    

    index.init();

});