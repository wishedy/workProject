/**
 * 功能描述：  教育背景
 * 使用方法:
 * 注意事件：
 * 引入来源：  作用：
 *
 * Created by LiChunHui on 2016/8/18.
 */
$(function(){
    var education={};
    education={
        path:{
            eduInfo:M_CALL+"customer/education/info/",
            eduUpdate:M_CALL+"customer/education/update/",
            eduCreate:M_CALL+"customer/education/create/",
            eduDelete:M_CALL+"customer/education/delete/"
        },
        init:function(){
            var t=this;
            this.pageSize=30;
            this.para=comm.getpara();
            this.customerId=TempCache.getItem("userId");
            this.id=comm.getpara()?comm.getpara().id:"";
            this.getEdu();
            this.backHref();
        },
        //后退
        backHref:function(){
            $("#backHref").on("click",function(){
                comm.creatEvent({
                    triggerType:'全站功能按钮点击',
                    keyword:"返回",
                    actionId:41,
                    async:false
                });
                $("#backMask").addClass("on");
                //放弃
                $(".giveup").on("click",function(){
                  g_sps.jump(null,"/pages/personal/otherMsgV2.html");
                });
                //取消
                $(".cancel").on("click",function(){
                    comm.creatEvent({
                        triggerType:'全站功能按钮点击',
                        keyword:"教育背景修改取消",
                        actionId:45,
                        async:false
                    });
                    $("#backMask").removeClass("on");
                })
            })
        },
        //删除
        deleteInfo:function(){
            var t=this;
            $("#delete").on("click",function(){
                comm.confirmBox({
                    title:"确定删除该信息吗？",
                    cancel:"取消",
                    ensure:"确定",
                    ensureCallback:function(){
                        comm.loading.show();
                        $.ajax({
                            type : "post",
                            url : t.path.eduDelete,
                            data : {paramJson:$.toJSON({id:t.id})},
                            dataType : "json",
                            success : function(rep){
                                comm.loading.hide();
                                if(rep&&rep.responseObject.responseStatus){
                                    popup("删除成功");
                                    g_sps.jump(null,"/pages/personal/otherMsgV2.html");
                                }
                            },
                            error:function(){}
                        });
                    }
                })
            })
        },
        //获取教育信息
        getEdu:function(){
            var t=this;
            if(t.id){
                this.deleteInfo();
                $("#delete").show();
                comm.loading.show();
                var data={id:t.id};
                var param={};
                param.paramJson= $.toJSON(data);
                $.ajax({
                    type : "post",
                    url : t.path.eduInfo,
                    data : param,
                    dataType : "json",
                    success : function(rep){
                        comm.loading.hide();
                        if(rep&&rep.responseObject.responseData.bo_data){
                            var info=rep.responseObject.responseData.bo_data;
                            if(info.city){
                                $("#city").attr("city",info.city).text(info.city).css("color","#333");
                            }
                            $("#cityId").val(info.cityId);
                            if(info.university){
                                $("#university").val(info.university);
                            }
                            $("#universityId").val(info.universityId);
                            t.addCity();
                            t.addYmd();
                            gettime($("#sYear"),info.startTime.substring(0,4));
                            gettime($("#sMonth"),info.startTime.substring(5,7));
                            if(info.upNow){//至今
                                $("#eYear").next().hide();
                                $("#eMonth").parent().hide();
                                $("#eYear option").eq(0).attr("selected",true);
                            }else{
                                gettime($("#eYear"),info.endTime.substring(0,4));
                                gettime($("#eMonth"),info.endTime.substring(5,7));
                            }
                            t.getEducation(info.educationId);
                            t.getMajor(info.majorId,info.major);
                            t.save();
                        }
                    },
                    error:function(){}
                });
            }else{
                t.addCity();
                t.addYmd();
                t.getEducation("");
                t.getMajor("","");
                t.save();
            }
        },
        addCity:function(){
            $("#city").parents("figure").on("click",function(){
                $(".ev-mainInner").hide();
                $(".ev-cityInner").show();
            });
            module.addCity({
                container:$("#city"),
                cityId:$("#cityId")
            });
        },
        addYmd:function(){
            ymd({
                year:$("#sYear"),
                month:$("#sMonth")
            });
            ymd({
                year:$("#eYear"),
                month:$("#eMonth")
            });
            $("#eYear").bind("change",function(){
                if($(this).val()=="0"){
                    $(this).next().hide();
                    $("#eMonth").parent().hide();
                }else{
                    $(this).next().show();
                    $("#eMonth").parent().show();
                }
            });
        },
        //获取专业
        getMajor:function(majorId,major){
            $.ajax({
                type:'POST',
                url:"/mcall/comm/data/major/json_list/",
                data:{pageIndex:1,pageSize:300},
                dataType:"json",
                async: false,
                success : function(rep) {
                    var str="";
                    if(rep&&rep.responseObject.responseData.data_list){
                        list=rep.responseObject.responseData.data_list;
                        if(major){
                            $("#major").css("color","#333");
                            str += "<option selected=true>" + major + "</option>";
                        }
                        $.each(list,function(i,val){
                            if(val.majorId==majorId){
                                $("#major").css("color","#333");
                                str += "<option value=" + val.majorId + " selected=true>" + val.majorTitle + "</option>";
                            }else{
                                str += "<option value=" + val.majorId + ">" + val.majorTitle + "</option>";
                            }
                        });
                        $("#major").append(str);
                        $("#major").on("change",function(e){
                            if ($(this).find("option:selected").val()!=0) {
                                $(this).css("color","#333");
                            }else{
                                $(this).css("color","#aaa");
                            }
                        });
                    }
                }
            });
        },
        //获取学历
        getEducation:function(id){
            $.ajax({
                type:'POST',
                url:"/mcall/comm/data/education/json_list/",
                data:{pageIndex:1,pageSize:10},
                dataType:"json",
                async: false,
                success : function(rep) {
                    var str="";
                    if(rep&&rep.responseObject.responseData.data_list){
                        list=rep.responseObject.responseData.data_list;
                        $.each(list,function(i,val){
                            if(val.id==id){
                                $("#education").css("color","#333");
                                str += "<option value=" + val.id + " selected=true>" + val.educationName + "</option>";
                            }else{
                                str += "<option value=" + val.id + ">" + val.educationName + "</option>";
                            }
                        });
                        $("#education").append(str);
                        $("#education").on("change",function(e){
                            if ($(this).find("option:selected").val()!=0) {
                                $(this).css("color","#333");
                            }else{
                                $(this).css("color","#aaa");
                            }
                        });
                    }
                }
            });
        },

        //修改
        save:function(){
            var t=this;
            $(".save").attr("on","true");
            $(".save").on("click",function(){
                var $this=$(this);
                if($(this).attr("on")=="true") {
                    var data = {};
                    if (t.id) {
                        data.id = t.id;
                    } else {
                        data.customerId = t.customerId;
                    }
                    data.city = $("#city").attr("city");
                    data.cityId = $("#cityId").val();
                    //data.universityId=$("#universityId").val();
                    data.university = $("#university").val();
                    data.major = $("#major option:selected").text();
                    data.majorId = $("#major option:selected").val();
                    data.education = $("#education option:selected").text();
                    data.educationId = $("#education option:selected").val();
                    data.startTime = $("#sYear option:selected").val() + "-" + $("#sMonth option:selected").val();
                    if ($("#eYear option:selected").val() == "0") {
                        data.upNow = 1;
                    } else {
                        data.upNow = 0;
                        data.endTime = $("#eYear option:selected").val() + "-" + $("#eMonth option:selected").val();
                    }
                    ;
                    var param = {};
                    param.paramJson = $.toJSON(data);
                    if (!data.university) {
                        popup("请填写学校");
                    } else if (data.majorId == "0") {
                        popup("请选择专业");
                    } else if (data.educationId == "0") {
                        popup("请选择学历");
                    } else if (!checkEndTime(data.startTime, data.endTime)) {
                        popup("开始时间不能大于结束时间");
                    } else {
                        $(this).attr("on","false");
                        $("#backMask").removeClass("on");
                        comm.loading.show();
                        if (t.id) {
                            //修改
                            $.ajax({
                                type: "post",
                                url: t.path.eduUpdate,
                                data: param,
                                dataType: "json",
                                success: function (rep) {
                                    comm.loading.hide();
                                    $this.attr("on","true");
                                    if (rep && rep.responseObject.responseStatus) {
                                      g_sps.jump(null,"/pages/personal/otherMsgV2.html");
                                        return false;
                                    } else {
                                        popup("保存失败");
                                    }
                                },
                                error: function () {
                                }
                            });
                        } else {
                            //创建
                            $.ajax({
                                type: "post",
                                url: t.path.eduCreate,
                                data: param,
                                dataType: "json",
                                success: function (rep) {
                                    comm.loading.hide();
                                    $this.attr("on","true");
                                    if (rep && rep.responseObject.responseStatus) {
                                        g_sps.jump(null,"/pages/personal/otherMsgV2.html");
                                        return false;
                                    } else {
                                        popup("保存失败");
                                    }
                                },
                                error: function () {
                                }
                            });
                        }

                    }
                }
            });

        }
    }

    education.init();
})
