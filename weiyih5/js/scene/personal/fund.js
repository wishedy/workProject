/**
 * 功能描述：   科研基金
 * 使用方法:
 * 注意事件：
 * 引入来源：  作用：
 *
 * Created by LiChunHui on 2016/8/18.
 */
$(function(){
    var fund={};
    fund={
        path:{
            fundInfo:M_CALL+"customer/fund/info/",
            fundUpdate:M_CALL+"customer/fund/update/",
            fundCreate:M_CALL+"customer/fund/create/",
            fundDelete:M_CALL+"customer/fund/delete/"
        },
        init:function(){
            this.customerId=TempCache.getItem("userId");
            this.id=comm.getpara()?comm.getpara().id:"";
            this.getFund();
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
                        keyword:"科研基金修改取消",
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
                            url : t.path.fundDelete,
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
        //获取科研基金
        getFund:function(){
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
                    url : t.path.fundInfo,
                    data : param,
                    dataType : "json",
                    success : function(rep){
                        comm.loading.hide();
                        if(rep&&rep.responseObject.responseData.bo_data) {
                            var info = rep.responseObject.responseData.bo_data;
                            $("#fundName").val(info.fundName);
                            $("#fundCode").val(info.fundCode);
                            var approvalTime=info.approvalTime.substring(0,4);
                            ymd({
                                year:$("#approvalTime")
                            });
                            gettime($("#approvalTime"),approvalTime);
                            t.save();
                        }
                    },
                    error:function(){}
                });
            }else{
                ymd({
                    year:$("#approvalTime")
                });
                t.save();
            }

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
                    data.fundName = $("#fundName").val();
                    data.fundCode = $("#fundCode").val();
                    data.approvalTime = $("#approvalTime option:selected").val();

                    var param={};
                    param.paramJson= $.toJSON(data);

                    if (!data.fundName) {
                        popup("请填写科研基金的项目名称!");
                    } else if (comm.getByteLen(data.fundName) > 200) {
                        popup("项目名称不能超过100汉字或200英文");
                    } else if (!data.fundCode) {
                        popup("请填写科研基金的项目编号!");
                    } else if (comm.getByteLen(data.fundCode) > 200) {
                        popup("项目编号不能超过100汉字或200英文");
                    } else {
                        $(this).attr("on", "false");
                        $("#backMask").removeClass("on");
                        comm.loading.show();
                        if(t.id){
                            //修改
                            $.ajax({
                                type : "post",
                                url : t.path.fundUpdate,
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
                                url : t.path.fundCreate,
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

    fund.init();
})
