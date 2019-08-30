/**
 * 功能描述：   工作经历
 * 使用方法:
 * 注意事件：
 * 引入来源：  作用：
 *
 * Created by LiChunHui on 2016/8/17.
 */
$(function(){
    var occupation={};
    occupation={
        path:{
            occInfo:M_CALL+"customer/occupation/info/",
            occUpdate:M_CALL+"customer/occupation/update/",
            occCreate:M_CALL+"customer/occupation/create/",
            occDelete:M_CALL+"customer/occupation/delete/"
        },
        init:function(){
            this.medicalTitle="";
            this.customerId=TempCache.getItem("userId");
            this.id=comm.getpara()?comm.getpara().id:"";
            this.getOcc();
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
                        keyword:"工作经历修改取消",
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
                            url : t.path.occDelete,
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
        //获取专业经历
        getOcc:function(){
            var t=this;
            var sYear;
            var sMonth;
            var eYear;
            var eMonth;
            if(t.id){
                this.deleteInfo();
                $("#delete").show();
                comm.loading.show();
                var data={id:t.id};
                var param={};
                param.paramJson= $.toJSON(data);
                $.ajax({
                    type : "post",
                    url : t.path.occInfo,
                    data : param,
                    dataType : "json",
                    success : function(rep){
                        comm.loading.hide();
                        if(rep&&rep.responseObject.responseData.bo_data){
                            var info=rep.responseObject.responseData.bo_data;
                            $("#address").val(info.address);
                            if(info.unit){
                                $("#unit").css("color","#333").attr("company",info.unit).text(info.unit);
                            }
                            sYear=info.startTime.substring(0,4);
                            sMonth=info.startTime.substring(5,7);
                            if(!info.upNow){
                                eYear=info.endTime.substring(0,4);
                                eMonth=info.endTime.substring(5,7);
                            }
                            t.addYmd();
                            gettime($("#sYear"),sYear);
                            gettime($("#sMonth"),sMonth);
                            if(info.upNow){//至今
                                $("#eYear").next().hide();
                                $("#eMonth").parent().hide();
                                $("#eYear option").eq(0).attr("selected",true);
                            }else{
                                gettime($("#eYear"),eYear);
                                gettime($("#eMonth"),eMonth);
                            }
                            module.medicalTitle({//职称
                                container:$("#medicalTitle")
                            });
                            t.company();
                            var medicalTitle=info.medicalTitle;
                            var medical = medicalTitle;
                            var medical1 = medical?medical.split(","):[];
                            var ids = [];
                            $.each(medical1, function (i, val) {
                                if (val) {
                                    if (val.split("_")[1]) {
                                        ids.push(val.split("_")[0]);
                                    }
                                }
                            });
                            $(".ev-medBox figcaption").each(function(i,em){
                                $.each(ids, function (j, val) {
                                    if ($(em).attr("medicalid") == val) {
                                        $(em).parent().attr("select", "yes");
                                        $(em).parent().addClass("selected");
                                    }
                                });
                            })
                            if(medicalTitle){
                                $("#medicalTitle").css("color","#333");
                                $("#medicalTitle").attr("medicalTitle",medicalTitle).text(comm.cutLine(medicalTitle, "_", "，"));
                            }
                            t.getDepartment(info.department);
                            t.save();
                        }
                    },
                    error:function(){}
                });

            }else{
                t.addYmd();
                t.getDepartment("");
                module.medicalTitle({//职称
                    container:$("#medicalTitle")
                });
                t.company();
                t.save();
            }

        },
        company:function(){
            $("#unit").parents("figure").on("click",function(){
                $(".ev-mainInner").hide();
                $(".ev-companyInner").show();
            });
            module.addCompany({
                container:$("#unit")
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
        //获取所在科室并默认选择
        getDepartment:function(dep){
            $.ajax({
                type:'POST',
                url:"/mcall/comm/data/department/json_list/",
                data:{pageIndex:1,pageSize:300},
                dataType:"json",
                //async: false,
                success : function(rep) {
                    str="";
                    if(rep&&rep.responseObject.responseData.data_list){
                        list=rep.responseObject.responseData.data_list;
                        if(dep){
                            $("#department").css("color","#333");
                            str += "<option value=" + dep + " selected=true>" + dep + "</option>";
                        }
                        $.each(list,function(i,val){
                            if(val.departmentName==dep){
                                $("#department").css("color","#333");
                                str += "<option value=" + val.departmentName + " selected=true>" + val.departmentName + "</option>";
                            }else{
                                str += "<option value=" + val.departmentName + ">" + val.departmentName + "</option>";
                            }
                        });
                        $("#department").append(str);
                        $("#department").on("change",function(e){
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
                if($(this).attr("on")=="true"){
                    var data={};
                    if(t.id){
                        data.id=t.id;
                    }else{
                        data.customerId=t.customerId;
                    }
                    data.address=$("#address").val();
                    data.unit=$("#unit").attr("company");
                    data.department=$("#department option:selected").val();
                    data.medicalTitle=$("#medicalTitle").attr("medicaltitle");
                    data.startTime=$("#sYear option:selected").val()+"-"+$("#sMonth option:selected").val();
                    if($("#eYear option:selected").val()=="0"){
                        data.upNow=1;
                    }else{
                        data.upNow=0;
                        data.endTime=$("#eYear option:selected").val()+"-"+$("#eMonth option:selected").val();
                    }
                    var param={};
                    param.paramJson= $.toJSON(data);
                    if(!data.unit){
                        popup("工作单位未填写");
                    }else if(comm.getByteLen(data.unit)>200){
                        popup("工作单位不能超过100汉字或200英文");
                    }else if(!data.medicalTitle){
                        popup("请选择职称");
                    }else if(comm.getByteLen(data.address)>100){
                        popup("工作地点不能超过50汉字或100英文");
                    }else if(data.department=="0"){
                        popup("请选择所在科室");
                    }else if(!checkEndTime(data.startTime,data.endTime)){
                        popup("开始时间不能大于结束时间");
                    }else{
                        $(this).attr("on","false");
                        comm.loading.show();
                        $("#backMask").removeClass("on");
                        if(t.id){
                            //修改
                            $.ajax({
                                type : "post",
                                url : t.path.occUpdate,
                                data : param,
                                dataType : "json",
                                success : function(rep){
                                    $this.attr("on","true");
                                    comm.loading.hide();
                                    if(rep&&rep.responseObject.responseStatus){
                                       g_sps.jump(null,"/pages/personal/otherMsgV2.html");
                                        return false;
                                    }else{
                                        popup("保存失败");
                                    }
                                },
                                error:function(){}
                            });
                        }else{
                            //创建
                            $.ajax({
                                type : "post",
                                url : t.path.occCreate,
                                data : param,
                                dataType : "json",
                                success : function(rep){
                                    $this.attr("on","true");
                                    comm.loading.hide();
                                    if(rep&&rep.responseObject.responseStatus){
                                        g_sps.jump(null,"/pages/personal/otherMsgV2.html");
                                        return false;
                                    }else{
                                        popup("保存失败");
                                    }
                                },
                                error:function(){}
                            });
                        }

                    }
                }

            });

        }
    };

    occupation.init();
})
