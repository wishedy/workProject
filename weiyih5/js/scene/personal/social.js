/**
 * 功能描述：  社会任职
 * 使用方法:
 * 注意事件：
 * 引入来源：  作用：
 *
 * Created by LiChunHui on 2016/8/18.
 */
$(function(){
    var social={};
    social={
        path:{
            socialInfo:M_CALL+"customer/social/info/",
            socialUpdate:M_CALL+"customer/social/update/",
            socialCreate:M_CALL+"customer/social/create/",
            socialDelete:M_CALL+"customer/social/delete/"
        },
        init:function(){
            this.customerId=TempCache.getItem("userId");
            this.id=comm.getpara()?comm.getpara().id:"";
            this.getsoc();
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
                        keyword:"社会任职修改取消",
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
                            url : t.path.socialDelete,
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
        //获取社会任职
        getsoc:function(){
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
                    url : t.path.socialInfo,
                    data : param,
                    dataType : "json",
                    success : function(rep){
                        comm.loading.hide();
                        if(rep&&rep.responseObject.responseData.bo_data) {
                            var info = rep.responseObject.responseData.bo_data;
                            $("#organization").val(info.organization);
                            $("#socialTitle").val(info.socialTitle);
                            sYear=info.startTime.substring(0,4);
                            sMonth=info.startTime.substring(5,7);
                            eYear=info.endTime.substring(0,4);
                            eMonth=info.endTime.substring(5,7);
                            t.addYmd();
                            gettime($("#sYear"),sYear);
                            gettime($("#sMonth"),sMonth);
                            if(info.upNow){//至今
                                $("#eYear").next().hide();
                                $("#eMonth").parent().hide();
                                $("#eYear option").eq(0).attr("selected",true);
                            }else{
                                gettime($("#eYear"),info.endTime.substring(0,4));
                                gettime($("#eMonth"),info.endTime.substring(5,7));
                            }

                            t.save();
                        }
                    },
                    error:function(){}
                });
            }else{
                t.addYmd();
                t.save();
            }

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
                    data.organization = $("#organization").val();
                    data.socialTitle = $("#socialTitle").val();
                    data.startTime = $("#sYear option:selected").val() + "-" + $("#sMonth option:selected").val();
                    if ($("#eYear option:selected").val() == "0") {
                        data.upNow = 1;
                    } else {
                        data.upNow = 0;
                        data.endTime = $("#eYear option:selected").val() + "-" + $("#eMonth option:selected").val();
                    };

                    var param={};
                    param.paramJson= $.toJSON(data);

                    if (!data.organization) {
                        popup("请填写任职机构名称");
                    } else if (comm.getByteLen(data.organization) > 200) {
                        popup("机构名称不能超过100汉字或200英文");
                    } else if (!data.socialTitle) {
                        popup("请填写职位名称");
                    } else if (comm.getByteLen(data.socialTitle) > 200) {
                        popup("职位名称不能超过100汉字或200英文");
                    } else if (!checkEndTime(data.startTime, data.endTime)) {
                        popup("开始时间不能大于结束时间");
                    } else {
                        $(this).attr("on", "false");
                        $("#backMask").removeClass("on");
                        comm.loading.show();
                        if(t.id){
                            //修改
                            $.ajax({
                                type : "post",
                                url : t.path.socialUpdate,
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
                                url : t.path.socialCreate,
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

    social.init();
})
