/**
 * 功能描述：  学术专著
 * 使用方法:
 * 注意事件：
 * 引入来源：  作用：
 *
 * Created by LiChunHui on 2016/8/18.
 */
$(function(){
    var opus={};
    opus={
        path:{
            opusInfo:M_CALL+"customer/opus/info/",
            opusUpdate:M_CALL+"customer/opus/update/",
            opusCreate:M_CALL+"customer/opus/create/",
            opusDelete:M_CALL+"customer/opus/delete/"
        },
        init:function(){
            this.customerId=TempCache.getItem("userId");
            this.id=comm.getpara()?comm.getpara().id:"";
            this.getOpus();
            $("#authorType").on("change",function(e){
                if ($(this).find("option:selected").val()!=0) {
                    $(this).css("color","#333");
                }else{
                    $(this).css("color","#aaa");
                }
            });
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
                        keyword:"学术专著修改取消",
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
                            url : t.path.opusDelete,
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
        //获取发明专利
        getOpus:function(){
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
                    url : t.path.opusInfo,
                    data : param,
                    dataType : "json",
                    success : function(rep){
                        comm.loading.hide();
                        if(rep&&rep.responseObject.responseData.bo_data) {
                            var info = rep.responseObject.responseData.bo_data;
                            $("#opusName").val(info.opusName);
                            $("#publisher").val(info.publisher);
                            $("#information").val(info.information);
                            pubYear=info.publicationTime.substring(0,4);
                            pubMonth=info.publicationTime.substring(5,7);
                            ymd({
                                year:$("#pubYear"),
                                month:$("#pubMonth")
                            });
                            gettime($("#pubYear"),pubYear);
                            gettime($("#pubMonth"),pubMonth);
                            $.each($("#authorType option"),function(i,em){
                                if($(em).val()==info.authorType){
                                    $("#authorType").css("color","#333");
                                    $(em).attr("selected","true");
                                    return;
                                }
                            })
                            t.save();
                        }
                    },
                    error:function(){}
                });
            }else{
                ymd({
                    year:$("#pubYear"),
                    month:$("#pubMonth")
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
                    data.opusName = $("#opusName").val();
                    data.publisher = $("#publisher").val();
                    data.authorType = $("#authorType option:selected").val();
                    data.publicationTime = $("#pubYear option:selected").val() + '-' + $("#pubMonth option:selected").val() + "-01";
                    data.information = $("#information").val();

                    var param={};
                    param.paramJson= $.toJSON(data);

                    if (!data.opusName) {
                        popup("请填写学术论著的标题");
                    } else if (comm.getByteLen(data.opusName) > 200) {
                        popup("著作标题不能超过100汉字或200英文");
                    } else if (!data.publisher) {
                        popup("请填写出版机构名称!");
                    } else if (comm.getByteLen(data.publisher) > 200) {
                        popup("出版机构不能超过100汉字或200英文");
                    } else if (data.authorType == "0") {
                        popup("请选择你对本文的著作身份");
                    } else if (comm.getByteLen(data.information) > 4000) {
                        popup("引用信息不能超过2000个汉字");
                    } else {
                        $(this).attr("on", "false");
                        comm.loading.show();
                        $("#backMask").removeClass("on");
                        if(t.id){
                            //修改
                            $.ajax({
                                type : "post",
                                url : t.path.opusUpdate,
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
                                url : t.path.opusCreate,
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

    opus.init();
})
