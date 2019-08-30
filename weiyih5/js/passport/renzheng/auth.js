$(function () {
    var medTitle={
        init:function(){
            var t=this;
            this.para=comm.getpara();
            this.getMedTitle();
            this.bindReturnBtn();
            this.value=mediVal?mediVal:"";
            //console.log(mediVal);
        },
        bindReturnBtn: function () {
            var t = this;
            $(".back").on("vclick", function () {
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
                    var html1="",html2="",html3="";
                    $.mobile.loading("hide");
                    if(rep&&rep.responseObject.responseData&&rep.responseObject.responseData.data_list){
                        $.each(rep.responseObject.responseData.data_list,function(i,val){
                            if(val.medicalTitleId==1){
                                html1+='<li tagid="'+val.id+'" select="no"><div class="add_tag_mr">'+val.medicalTitle+'</div></li>';
                            }else if(val.medicalTitleId==2){
                                html2+='<li tagid="'+val.id+'" select="no" '+(i==4?'style="border-top:solid 0.13em #dfdfdf;"':'')+'><div class="add_tag_mr">'+val.medicalTitle+'</div></li>';
                            }else{
                                html3+='<li tagid="'+val.id+'" select="no" '+(i==7?'style="border-top:solid 0.13em #dfdfdf;"':'')+'><div class="add_tag_mr">'+val.medicalTitle+'</div></li>';
                            }
                        })
                    };
                    $("#medical01").html(html1);
                    $("#medical02").html(html2).hide();
                    $("#medical03").html(html3).hide();
                    t.toggleOthers();
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
        toggleOthers:function(){
            $('#otherMedicalTitle').click(function(){
               if($(this).hasClass('slideDown')){
                   $(this).removeClass('slideDown');
                   $("#medical02").hide();
                   $("#medical03").hide();
               }else{
                   $(this).addClass('slideDown');
                   $("#medical02").show();
                   $("#medical03").show();
               }
            });
        },
        //初始化选择
        hasSelect:function(){
            var tagId;
            var ids=this.para.ids||medTitle.ids.join(',');
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
            $("#medicalTitleSave").on("vclick",function(event){
                $.mobile.loading("show");
                medicalTitle="";
                $.each($(".zc_content li"),function(i,em){
                    if($(em).attr("select")=="yes"){
                        medicalTitle+=($(em).attr("tagid")+"_"+$(em).find("div").text()+",");
                    }
                });
                if($('#medical01 li[select=yes]').length){
                    t.medFirstClass = true;
                }else{
                    t.medFirstClass = false;
                }
                var data={};
                data.customerId=t.para.customerId;
                data.medicalTitle=medicalTitle.substring(0,medicalTitle.length-1);
                var _showMedicalTitle = comm.removeMedicalTitleNum(medicalTitle.replace(/\,/gi,"、"));
                var _title = _showMedicalTitle.substring(0,_showMedicalTitle.lastIndexOf('、'));
                $("#medicalTitleChoose .text").text(_title);
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
                event.stopPropagation();
                event.preventDefault();
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
            this.value = areaVal?areaVal:"";
        },
        //数据初始化
        getTag:function(){
            var t=this;
            var html="";
            var data={};
            data.treeLevel=2;
            data.pageIndex=1;
            data.pageSize=100;
            data.platformId=comm.getpara().platformId;
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

        },
        //数据初始化选中
        hasSelect:function(){
            var tagId;
            var ids=this.para.ids||areasExp.ids.join(',');
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
                        $(em).attr("select","yes")
                        $(em).find("div").removeClass("add_tag_mr").addClass("add_tag_xz");
                    }else{
                        $(em).attr("select","no")
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
                $("#areaExpertiseChoose .text").text(comm.getStrLen(comm.removeMedicalTitleNum(data.areasExpertise.replace(/\,/gi,"、")),30));

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
            this.value=companyVal?companyVal:"";
            this.companyId=companyId?companyId:"0";

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
            this.preSelect();
            this.saveCompany();
            this.search();
            this.bindTextChange();
            this.bindTextChange2();
            this.schoolAddSave();
            $(".add").on("vclick",function(){
                //g_sps.jump(null,pageurl.urlList.toAddCompany.url+"?customerId="+t.para.customerId);
                $("#companyName").val(t.input.val())
                //$.mobile.changePage("#addCompanyPage");
                comm.showPage("#addCompanyPage");
                return false;
            });
            $(".addCompany").on("vclick",function(){
                //g_sps.jump(null,pageurl.urlList.toAddCompany.url+"?customerId="+t.para.customerId+"&name="+t.input.val());
                //$.mobile.changePage("#addCompanyPage");
                comm.showPage("#addCompanyPage");
                $("#companyName").val(t.input.val());
                return false;
            });
        },
        preSelect:function(){
            //$('.backToPre').on('vclick',function(){
            //    comm.showPage("#pre_companySelect");
            //});
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
                                        if($.isEmptyObject(data.responseObject.responseData)){
                                            //$(".none").show();
                                            $("#company").attr('scrollPagination', 'disabled');
                                            //alert("没有内容了");
                                            return false;
                                        }else{
                                            var htm="";
                                            $.each(data.responseObject.responseData.data_list,function(i,val){
                                                htm+="<li companyId='" + val.id + "'>"+val.hospitalName+"</li>";
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
            });
        },
        //选择医院并保存
        saveCompany:function(){
            var t=this;
            $("#company li").live("vclick",function(){
                t.save($(this),'company');
            });
            $("#schools li").live("vclick",function(){
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
                    $("#province").hide();
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
        closeSearch:function(school){
            var t = this;
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
            //$.mobile.changePage("#renzhengPage");
            $.mobile.loading("hide");
            index.validate();
        }
    };
    var getUserInfo={
        init:function(fn){
            var t=this;
            $.ajax({
                type : "post",
                url : M_CALL + "customer/unite/getMapById/",
                data : {paramJson: $.toJSON({customerId: TempCache.getItem('userId'),"logoUseFlag": UseFlag.d})},
                dataType : "json",
                async:false,
                success : function(rep) {
                    comm.loading.hide();
                    if (rep && rep.responseObject.responseData && rep.responseObject.responseData.data_list) {
                        if(rep.responseObject.responseData.data_list.length>0){
                            responseData=rep.responseObject.responseData.data_list[0];

                            var baseInfo=responseData.customer_auth;
                            $('#lastName').val(baseInfo.lastName).blur();
                            $('#firstName').val(baseInfo.firstName).blur();
                            if(baseInfo.medicalTitle!=""){
                                $('#medicalTitleChoose .text').text(comm.getStrLen(comm.cutLine(baseInfo.medicalTitle,"_",","),30));
                            }else{
                                $('#medicalTitleChoose .text').text('');
                            }
                            var medIds = [1,2,3,4,10,11];
                            var mIds = baseInfo.medicalTitle.match(/\d+/g)||[];    //10_医学生,6_副教授
                            $.each(mIds,function(mi,me){
                                $.each(medIds,function(mei,med){
                                   if(me==med){
                                       medTitle.medFirstClass = true;
                                       return false;
                                   }
                                });
                            });
                            medTitle.value = baseInfo.medicalTitle;
                            medTitle.ids =[];
                            var medArr = baseInfo.medicalTitle.split(',');
                            for(var mi=0,ml=medArr.length;mi<ml;mi++){
                                medTitle.ids.push(medArr[mi].split('_')[0]);
                            }
                            $('#companyChoose .text').text(comm.getStrLen(baseInfo.workplace,30));
                            company.type=baseInfo.workplaceType;
                            company.id=baseInfo.id;
                            $('#areaExpertiseChoose .text').text(comm.getStrLen(baseInfo.areasExpertiseShow,30));
                            areasExp.value=baseInfo.areasExpertise;
                            areasExp.ids=[];
                            var araArr = baseInfo.areasExpertise.split(',');
                            for(var ai=0,al=araArr.length;ai<al;ai++){
                                areasExp.ids.push(araArr[ai].split('_')[0]);
                            }
                            companyVal =baseInfo.workplace;
                            companyId=baseInfo.id;
                            mediVal=baseInfo.medicalTitle;
                            areaVal=baseInfo.areasExpertise;
                            fn&&fn();
                        }
                    }
                }
            });
        }
    };
    var index = {

        init: function () {
            window.onload = Log.createBrowse(69, '认证页面');
            var t = this;
            var companyVal,companyId,mediVal,areaVal;
            getUserInfo.init(t.bindValidate);
            areasExp.init();
            medTitle.init();
            company.init();
            t.bindChoose();
            t.bindUpload('//img50.allinmd.cn/user/renzheng/upload.jpg');
            t.bindAddCompany();
            t.bindValidate();
            comm.initInputFocusEvent();
            t.loadCertificate();

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
            $("#attCode").on("change",function(){
                t.validate();
            });

            // 若是无权限 跳转过来的则
            if(comm.getpara() && typeof comm.getpara()!="undefined" && comm.getpara().type=="needAuth")
            {
                $(".para").html("只有认证医师才能执行此操作!<br/>请认证你的医师身份 ");
            }
            if(comm.getpara() && typeof comm.getpara()!="undefined" )
            {
                var firstName=comm.getpara().firstName;
                var lastName=comm.getpara().lastName;
                if(firstName && firstName!=""){
                    $("input[name=firstName]").val(firstName)
                }
                if(lastName && lastName!=""){
                    $("input[name=lastName]").val(lastName)
                }
            }

            $("#notRenZheng").on("vclick",function(){
                comm.creatEvent({
                    triggerType:'认证',
                    keyword:"暂不认证",
                    actionId:26
                });
                //var t = document.referrer;
                var t = "/";
                var fromPage = TempCache.getItem("fromPage");
                if(fromPage!=undefined && fromPage!="") {
                    t = fromPage;
                    if(fromPage.lastIndexOf("personal_")>-1||fromPage.lastIndexOf("/sns.html")>-1){//从个人中心跳过来
                        t="/pages/personal/personal_index.html";
                    }
                    if(fromPage.lastIndexOf("message_")>-1){//从消息跳过来
                        t="/pages/message/message_main.html";
                    }
                    if(fromPage.lastIndexOf("/html/m/")>-1){//终端页暂不认证
                        t="/";
                    }
                }
                user.getSessionInfo();
                g_sps.jump(null,t);
                //history.go(-1);
            });

        },
        bindValidate: function () {
            $("#lastName").on("blur",function(){
                var err = false,errmsg;
                var val  = $.trim($(this).val());
                var con = $(this).parent().parent().find(".l_warning");
                if(val==""){
                    err = true; errmsg = "您贵姓？";
                }
                if(val.length>50){
                    err = true; errmsg = "最大长度50个字符！";
                }
                if(!(/^[\u4e00-\u9fa5]{1,25}$/.test(val) || /^[A-Za-z_]{1,50}$/.test(val))){
                    err = true; errmsg = "您贵姓？";
                }
                if(err){
                    con.show();
                    con.html(errmsg);
                    $(this).parent().parent().addClass("input_error");
                }else{
                    $(this).parents(".input_error").removeClass("input_error");
                    con.empty().hide();
                }
            });
            $("#firstName").on("blur",function(){
                var err = false,errmsg;
                var val  = $.trim($(this).val());
                var con = $(this).parent().parent().find(".l_warning");
                if(val==""){
                    err = true; errmsg = "你的大名是？";
                }
                if(val.length>50){
                    err = true; errmsg = "最大长度50个字符！";
                }
                if(!(/^[\u4e00-\u9fa5]{1,25}$/.test(val) || /^[A-Za-z_]{1,50}$/.test(val))){
                    err = true; errmsg = "你的大名是？";
                }
                if(err){
                    con.show();
                    con.html(errmsg);
                    $(this).parent().parent().addClass("input_error");
                }else{
                    $(this).parents(".input_error").removeClass("input_error");
                    con.empty().hide();
                }
            });
            $("#attCode").on("blur",function(){
                var err = false,errmsg;
                var val  = $.trim($(this).val());
                var con = $(this).parents(".form-group-box").next(".l_warning");
                if(val==""){
                    err = true; errmsg = "请填写正确的证件号码。";
                }
                if(val.length>50){
                    err = true; errmsg = "请填写正确的证件号码";
                }
                if(!/^([A-Za-z0-9]+)$/.test(val)){
                    err = true; errmsg = "请填写正确的证件号码";
                }
                if(err){
                    con.show();
                    con.html(errmsg);
                    $(this).parent().parent().addClass("input_error");
                }else{
                    $(this).parents(".input_error").removeClass("input_error");
                    con.empty().hide();
                }
            });
        },
        bindChoose: function () {
            $("#companyChoose").on("vclick", function () {
                //$.mobile.changePage("#companyPage");
                $('.auth_mask').show();
                return false;
            });
            $("#medicalTitleChoose").on("vclick", function () {
                //$.mobile.changePage("#medicalTitlePage");
                comm.showPage("#medicalTitlePage");
                Log.createBrowse(132,'职称选择页');
                return false;
            });
            $("#areaExpertiseChoose").on("vclick", function () {
                comm.showPage("#areasExpertisePage");
                //$.mobile.changePage("#areasExpertisePage");
                //Log.createBrowse(132,'职称选择页');
                return false;
            });
            $(".ev_inHospital").on("vclick", function () {
                comm.showPage("#companyPage");
                Log.createBrowse(131,'医院选择页');
                $('.auth_mask').hide();
                return false;
            });
            $(".ev_inSchool").on("vclick", function () {
                comm.showPage("#schoolPage");
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
            if($("#uploadPicBtn [id^=czyx]").length>0){
                $("#uploadPicBtn").html('<input type="file"    id="file1" name="file" data-role="none" />');
                // $("#uploadPic1 input").textinput();
            }
            var paramJson=$.toJSON({imageType:"2"});
            czyx.uploadReplace('#file1',{
                url:"/mcall/comm/upload_attachment/upload/", //文件处理的URL,
                data:{paramJson:paramJson},
                uploadReplaceCss:{
                    //设置上传按钮图片
                    background:'url('+ path +') center no-repeat',
                    backgroundSize:'100% 100%',
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
                	//校验必填项
                    if(!/\.((JPEG)|(jpeg)(jpg)|(JPG)|(gif)|(GIF)|(png)|(PNG))$/i.test(this.value)){
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
                            t.bindUpload(serverJson.responseObject.responseMessage.url);
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
            $("#addCompanySave").on("vclick",function(){
                if($("#companyName").val().length>200){
                    popup("所填医院字数过长!");
                }else{
                    $.mobile.loading("show");
                    var data={};
                    data.company=$("#companyName").val();
                    data.companyId=0;
                    $.mobile.loading("hide");
                    company.value = data.company;
                    company.type=1;
                    company.companyId = data.companyId;
                    $("#companyChoose .text").text(comm.getStrLen(data.company,30));
                    //$.mobile.changePage("#renzhengPage")
                    comm.showPage("#renzhengPage");
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
            if($("#lastName").val()==""){
                valid = false;
                console.log("lastName.value"+$("#lastName").val());
            }
            if($("#firstName").val()==""){
                valid = false;
                console.log("firstName.value"+$("#firstName").val());
            }
            //if($("#attCode").val()==""&&$("#certificate option:selected").val()!=10){
            //    valid = false;
            //    console.log("areasExp.value"+areasExp.value);
            //}
            if(company.value==""){
                valid = false;
                console.log("company.value"+company.value);
            }

            if(areasExp.value==""){
                valid = false;
                console.log("areasExp.value"+areasExp.value);
            }
            if(medTitle.value==""||!medTitle.medFirstClass){ //职称为空或 第一级职称未选择
                valid = false;
                console.log("medTitle.value"+medTitle.value);
            }
            if($("#certificatesCodePic").val()==""){
                valid = false;
                console.log("certificatesCodePic.value"+$("#certificatesCodePic").val());
            }
            console.log(valid);
            if(!valid){
                $("#submit").off('vclick').addClass("disabled");
            }else{
                $("#submit").on('vclick', function () {
                    comm.creatEvent({
                        triggerType:'认证-提交',
                        keyword:"认证-提交",
                        actionId:30
                    });
                    t.submit();
                }).removeClass("disabled");

            }
        },
        submit: function () {
            var param = {
                customerId:TempCache.getItem('userId'),
                lastName: $("input[name=lastName]").val(),
                firstName: $("input[name=firstName]").val(),
                attType:$("#certificate").val(),
                attPath:$("input[name=certificatesCodePic]").val(),
                attCode:$("input[name=attCode]").val(),
                company:company.type==1?company.value:"",
                companyId:company.type==1?company.companyId:"",
                schoolName:company.type==2?company.value:"",
                schoolId:company.type==2?company.companyId:"",
                medicalTitle:medTitle.value,
                areasExpertise:areasExp.value,
                platformId:comm.getpara().platformId
            };


            var rst = customer.execute("createAuth",param);
            if(rst.responseStatus){
                user.getSessionInfo();
                var isFollow=comm.getpara().isFollow;
                var name=$("#lastName").val()+$("#firstName").val();
                var flag=comm.getpara().flag;
                if(isFollow=="1"){
                    TempCache.setItem("department", comm.getpara().platformId);
                    comm.redirect("/pages/passport/regist_tag.html?name="+name+"&flag="+flag+"&platformId="+comm.getpara().platformId,0);
                    //comm.redirect("/pages/passport/auth/regist_tag.html?name="+name+"&flag="+flag+"&platformId="+comm.getpara().platformId,0);

                }else{
                    if(rst && rst.responseCode=="0B0101" || rst.responseCode=="0B0102"){
                        if(comm.getpara().reAuth){//认证已拒绝，重新认证
                            comm.alertBox({
                                "title":"我们已经收到您的认证资料，审核周期为3-5个工作日，请耐心等待！谢谢您的配合 ",
                                "ensure":"知道了",
                                ensureCallback:function(){
                                    if(/\/html\/m\/video\//.test(TempCache.getItem('fromPage'))) {//认证拒绝且来源页是视频的，跳回首页，同时清空autoplay
                                        TempCache.removeItem('autoplay');
                                      g_sps.jump(null,'/');
                                    }else{
                                        user.success();
                                    }
                                }
                            });
                            $(".al-confirmModal").css({"width":"20rem","marginLeft":"-10rem"});
                            $(".al-confirmModalEnsureBtn").css({"height":"3.6rem","lineHeight":"3.6rem"})
                        }else {
                            user.success("已提交认证，请等待审核！");
                        }
                    }else{
                        TempCache.setItem("department", comm.getpara().platformId);

                        if(TempCache.getItem('needAuthRegist')=="need"){//需要认证并认证成功
                            TempCache.setItem('needAuthCompleted','needAuthCompleted');
                        }
                        user.success("认证成功，即将返回来源页");
                    }

                }

            }else{
                if(rst && rst.responseCode=="0B0101" || rst.responseCode=="0B0102"){
                    popup("已提交认证，请等待审核！");
                    user.success();
                }else{
                    popup(rst.responseMessage);
                    user.success();
                }
            }
        },
        //加载医师证件选项
        loadCertificate:function(){
            var t = this;
        var param={roleId:6,typeId:1};
        $.ajax({
            type: 'POST',
            url: commdata.urlList.getDataRoleConfigs.url,
            data:{paramJson:$.toJSON(param)},
            async: false,
            dataType: "json",
            timeout: 10000,
            success: function callback(rep) {
                var html="";
                if (rep && rep.responseObject && rep.responseObject.responseStatus) {
                    var data=rep.responseObject.responseMessage;
                    if(data && data.length>1){
                        $.each(data,function(index,i){
                            if(i.refId!=1&&i.refId!=13){
                                html+='<option value="'+ i.refId +'">'+ i.refValue +'</option>';
                            }
                        });
                    }
                }
                $("#certificate").html(html);
                $("#certificate").val(10);
                $(".uploader .l").text("上传" +  ($("#certificate option[value=10]").text()) + "照片");
                if($("#certificate").val()==10){
                    $("input[name=attCode]").hide();
                }else{
                    $("input[name=attCode]").show();
                }

                $("#certificate").on("change",function(){
                    var _val = $(this).val();
                   $(".uploader .l").text("上传" +  ($("#certificate option[value="+_val+"]").text()) + "照片");
                    $("#certificate").parent().parent().find("input").attr("placeholder",
                           "请输入" +
                           ($("#certificate option[value="+_val+"]").text()));
                    if($("#certificate option:selected").val()==10){
                        $("input[name=attCode]").hide();
                    }else{
                        $("input[name=attCode]").show();
                    }
                    t.validate();
                });


            }
        });
    }

};
    

    index.init();

});