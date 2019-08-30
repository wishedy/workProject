/**
 * 功能描述：  继续教育
 * 使用方法:
 * 注意事件：
 * 引入来源：  作用：
 *
 * Created by LiChunHui on 2016/8/18.
 */
$(function(){
    var cEdu={};
    cEdu={
        path:{
            cEduInfo:M_CALL+"customer/continue/education/info/",
            cEduUpdate:M_CALL+"customer/continue/education/update/",
            cEduCreate:M_CALL+"customer/continue/education/create/",
            cEduDelete:M_CALL+"customer/continue/education/delete/"
        },
        init:function(){
            this.para=comm.getpara();
            this.customerId=TempCache.getItem("userId");
            this.id=comm.getpara()?comm.getpara().id:"";
            this.getcEdu();
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
                        keyword:"继续教育修改取消",
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
                            url : t.path.cEduDelete,
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
        getcEdu:function(){
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
                    url : t.path.cEduInfo,
                    data : param,
                    dataType : "json",
                    success : function(rep){
                        comm.loading.hide();
                        if(rep&&rep.responseObject.responseData.bo_data) {
                            var info = rep.responseObject.responseData.bo_data;
                            $("#organization").val(info.organization);
                            $("#certificate").val(info.certificate);
                            sYear=info.startTime.substring(0,4);
                            sMonth=info.startTime.substring(5,7);
                            //sDay=info.startTime.substring(8,10);
                            eYear=info.endTime.substring(0,4);
                            eMonth=info.endTime.substring(5,7);
                            //eDay=info.endTime.substring(8,10);
                            t.addYmd();
                            gettime($("#sYear"),sYear,1);
                            gettime($("#sMonth"),sMonth,1);
                            //gettime($("#sDay"),sDay,1);
                            gettime($("#eYear"),eYear,1);
                            gettime($("#eMonth"),eMonth,1);
                            //gettime($("#eDay"),eDay,1);
                            $("#cmeDesc").val(info.cmeDesc,1);
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
                //day:$("#sDay")
            });
            ymd({
                year:$("#eYear"),
                month:$("#eMonth")
                //day:$("#eDay")
            });
        },
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
                    data.organization=$("#organization").val();
                    data.certificate=$("#certificate").val();
                    data.cmeDesc=$("#cmeDesc").val();
                    data.startTime=$("#sYear option:selected").val()+"-"+$("#sMonth option:selected").val();
                    data.endTime=$("#eYear option:selected").val()+"-"+$("#eMonth option:selected").val();

                    var param={};
                    param.paramJson= $.toJSON(data);

                    if(!data.organization){
                        popup("请填写学术机构");
                    }else if(comm.getByteLen(data.organization)>100){
                        popup("学术机构不能超过50汉字或100英文");
                    }else if(comm.getByteLen(data.certificate)>100){
                        popup("证书不能超过50汉字或100英文");
                    }else if(comm.getByteLen(data.cmeDesc)>1000){
                        popup("培训内容不能超过500汉字或1000英文");
                    }else if(!checkEndTime(data.startTime,data.endTime)){
                        popup("开始时间不能大于结束时间");
                    }else{
                        $(this).attr("on","false");
                        $("#backMask").removeClass("on");
                        comm.loading.show();
                        if(t.id){//修改
                            $.ajax({
                                type : "post",
                                url : t.path.cEduUpdate,
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
                                url : t.path.cEduCreate,
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

    cEdu.init();
});
