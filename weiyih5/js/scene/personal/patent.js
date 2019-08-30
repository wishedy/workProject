/**
 * 功能描述：  发明专利
 * 使用方法:
 * 注意事件：
 * 引入来源：  作用：
 *
 * Created by LiChunHui on 2016/8/18.
 */
$(function(){
    var patent={};
    patent={
        path:{
            patentInfo:M_CALL+"customer/patent/info/",
            patentUpdate:M_CALL+"customer/patent/update/",
            patentCreate:M_CALL+"customer/patent/create/",
            patentDelete:M_CALL+"customer/patent/delete/"
        },
        init:function(){
            this.customerId=TempCache.getItem("userId");
            this.id=comm.getpara()?comm.getpara().id:"";
            this.getPat();
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
                        keyword:"发明专利修改取消",
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
                            url : t.path.patentDelete,
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
        //获取国家
        getCountry:function(name){
            var t=this;
            var data={};
            data.treeLevel=1;
            data.pageIndex=1;
            data.pageSize=100;
            $.ajax({
                type:'POST',
                url:"/mcall/comm/data/region/json_list/",
                data:data,
                dataType:"json",
                success : function(rep) {
                    var html="<option regionid=0 selected=true>请选择注册国家</option>";
                    if(rep&&rep.responseObject.responseData.data_list){
                        $.each(rep.responseObject.responseData.data_list,function(i,val){
                            if(name==val.regionName){
                                $("#country").css("color","#333")
                                html+="<option regionid="+val.regionId+" selected=true>"+val.regionName+"</option>";
                            }else{
                                html+="<option regionid="+val.regionId+">"+val.regionName+"</option>";
                            }

                        });
                    }
                    $("#country").html(html);
                    $("#country").on("change",function(e){
                        if ($(this).find("option:selected").val()!=0) {
                            $(this).css("color","#333");
                        }else{
                            $(this).css("color","#aaa");
                        }
                    });
                }
            });
        },
        //获取发明专利
        getPat:function(){
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
                    url : t.path.patentInfo,
                    data : param,
                    dataType : "json",
                    success : function(rep){
                        comm.loading.hide();
                        if(rep&&rep.responseObject.responseData.bo_data) {
                            var info = rep.responseObject.responseData.bo_data;
                            $("#patentName").val(info.patentName);
                            $("#patentCode").val(info.patentCode);
                            pYear=info.patentTime.substring(0,4);
                            pMonth=info.patentTime.substring(5,7);
                            ymd({
                                year:$("#patYear"),
                                month:$("#patMonth")
                            });
                            gettime($("#patYear"),pYear);
                            gettime($("#patMonth"),pMonth);
                            t.getCountry(info.country);
                            t.save();
                        }
                    },
                    error:function(){}
                });

            }else{
                ymd({
                    year:$("#patYear"),
                    month:$("#patMonth")
                });
                t.getCountry("");
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
                    data.patentName = $("#patentName").val();
                    data.patentCode = $("#patentCode").val();
                    data.patentTime = $("#patYear option:selected").val() + '-' + $("#patMonth option:selected").val();
                    data.country = $("#country option:selected").val();

                    var param={};
                    param.paramJson= $.toJSON(data);

                    if (!data.patentName) {
                        popup("请填写专利名称!");
                    } else if (comm.getByteLen(data.patentName) > 200) {
                        popup("专利名称不能超过100汉字或200英文");
                    } else if (!data.patentCode) {
                        popup("请填写专利编号!");
                    } else if (!(/[a-zA-Z0-9]{1,200}$/.test(data.patentCode))) {
                        popup("请填写正确的专利编号");
                    } else if (comm.getByteLen(data.patentCode) > 200) {
                        popup("专利编号不能超过100汉字或200英文");
                    } else {
                        $(this).attr("on", "false");
                        comm.loading.show();
                        $("#backMask").removeClass("on");
                        if(t.id){
                            //修改
                            $.ajax({
                                type : "post",
                                url : t.path.patentUpdate,
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
                                url : t.path.patentCreate,
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

    patent.init();
})
