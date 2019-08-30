/**
 * 功能描述：  获得荣誉
 * 使用方法:
 * 注意事件：
 * 引入来源：  作用：
 *
 * Created by LiChunHui on 2016/8/18.
 */
$(function(){
    var honor={};
    honor={
        path:{
            honorInfo:M_CALL+"customer/honor/info/",
            honorUpdate:M_CALL+"customer/honor/update/",
            honorCreate:M_CALL+"customer/honor/create/",
            honorDelete:M_CALL+"customer/honor/delete/"
        },
        init:function(){
            this.customerId=TempCache.getItem("userId");
            this.id=comm.getpara()?comm.getpara().id:"";
            this.getHonor();
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
                        keyword:"获得荣誉修改取消",
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
                            url : t.path.honorDelete,
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
        getHonor:function(){
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
                    url : t.path.honorInfo,
                    data : param,
                    dataType : "json",
                    success : function(rep){
                        comm.loading.hide();
                        if(rep&&rep.responseObject.responseData.bo_data) {
                            var info = rep.responseObject.responseData.bo_data;
                            $("#honorName").val(info.honorName);
                            $("#awardDepartment").val(info.awardDepartment);
                            awardYear=info.awardYear.substring(0,4);
                            ymd({
                                year:$("#awardYear")
                            });
                            gettime($("#awardYear"),awardYear);
                            t.save();
                        }
                    },
                    error:function(){}
                });

            }else{
                ymd({
                    year:$("#awardYear")
                });
                t.save();
            }

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
                    data.honorName=$("#honorName").val();
                    data.awardDepartment=$("#awardDepartment").val();
                    data.awardYear=$("#awardYear option:selected").val();

                    var param={};
                    param.paramJson= $.toJSON(data);

                    if(!data.honorName){
                        popup("请填写荣誉名称");
                    }else if(comm.getByteLen(data.honorName)>200){
                        popup("荣誉名称不能超过100汉字或200英文");
                    }else if(!data.awardDepartment){
                        popup("请填写颁发机构");
                    }else if(comm.getByteLen(data.awardDepartment)>200){
                        popup("颁发机构不能超过100汉字或200英文");
                    }else{
                        $(this).attr("on","false");
                        comm.loading.show();
                        $("#backMask").removeClass("on");
                        if(t.id){
                            //修改
                            $.ajax({
                                type : "post",
                                url : t.path.honorUpdate,
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
                                url : t.path.honorCreate,
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

    honor.init();
})
