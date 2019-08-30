/**
 * 功能描述：
 * 使用方法:
 * 注意事件：
 * 引入来源：  作用：
 *
 * Created by LiChunHui on 2015/4/13.
 */
$(function(){
    var languageFlag=0;
    var honor={};
    honor={
        path:{
            list:PC_CALL+"customer/honor/json_list/",
            info:PC_CALL+"customer/honor/info/",
            create:PC_CALL+"customer/honor/create/",
            update:PC_CALL+"customer/honor/update/",
            delete1:PC_CALL+"customer/honor/delete/"
        },
        templete:{
            returnList : function(options){
                var html="";
                html+='<section class="al-tableWriteComplate honor_list">'+
                '<section class="honor_show"><i class="al-tableIconAward"></i>'+
                '<article class="al-tableWriteContent">'+
                '<h2 class="honorName">'+options.honorName+'</h2>'+
                '<p>'+
                '<span class="awardDepartment">'+options.awardDepartment+'</span>'+
                //'<b class="al-hrLine"></b>'+
                '<span class="al-timeRange time03">'+options.awardYear+'</span>'+
                '</p>'+
                '<figcaption class="al-tableWriteComplateConfig">'+
                '<a href="javascript:void(0)" class="al-tableWriteComplateConfigBtn honor_editBtn" val="'+options.id+'">编辑</a>'+
                '<a href="javscript:void(0)" class="honor_delBtn" val="'+options.id+'">删除</a>'+
                '</figcaption>'+
                '</article>'+
                '</section></section>';
                return html;
            }
        },
        init:function(){
            var t=this;
            ymd({
                year:$("#awardYear")
            });

            this.customerId=$("#sesCustomerId").val();
            this.getHonorList();
            this.cancel();
            this.create();
            this.save();

        },
        //获取列表
        getHonorList:function(){
            var t=this;
            $.ajax({
                type : "post",
                url : t.path.list,
                data:{dataFlag:2,languageFlag:languageFlag,honorType:0},
                dataType : "json",
                success : function(data){
                    var html="";
                    if(data.responseObject.responseData.data_list&&data.responseObject.responseData.data_list.length>0) {
                        var list = data.responseObject.responseData.data_list;
                        $.each(list,function(i,val){
                            html+= t.templete.returnList({
                                honorName:htmlToString(val.honorName),
                                awardDepartment:htmlToString(val.awardDepartment),
                                awardYear:val.awardYear,
                                id:val.id
                            });
                        })
                    };
                    $("#honor_list").html(html);
                    t.mouse();
                    t.bindEdit();
                    t.del();
                },
                error:function(){}
            });
        },
        //列表移入移出
        mouse:function(){
            $(".honor_list").live("mouseover",function(){
                $(this).addClass("baseinfo_after_hover");
            });
            $(".honor_list").live("mouseout",function(){
                $(this).removeClass("baseinfo_after_hover");
            });
        },

        cancel:function(){
            var t=this;
            $("#honor_cancel").on("click",function(){
                t.clear();
                //事件埋点
                comm.creatEvent({
                    triggerType:"全站功能按钮点击",
                    keyword:"获得荣誉修改取消",
                    browType:136,
                    actionId:45
                });
                return false;
            })
        },
        clear:function(){
            this.mouse();
            $("#honor_add").show();
            $("#honor_edit").hide();
            $(".honor_show").show();
            $("#honorId").val("");
            $("#honor_edit input").val("");
            $("#honor_edit input").parents("section").removeClass("error");
            $(".al-tableErrorTips","#honor_edit").removeClass("showIb");
            $("#honor_edit select").each(function(i,em){
                $("option",em).eq(0).attr("selected",true);
            })
        },
        //编辑
        bindEdit:function(){
            var t=this;
            $(".honor_editBtn").off("click").on("click",function(){
                var parent=$(this).parents(".honor_list");
                $("#honor_add").hide();
                parent.after($("#honor_edit"));
                $("#honor_edit").show();
                $(".honor_show",parent).hide();
                $(".honor_list").die("mouseover");
                var paramJson=$.toJSON({id:$(this).attr("val")});
                $.ajax({
                    type : "post",
                    url : t.path.info,
                    data : {paramJson:paramJson},
                    dataType : "json",
                    success : function(rep){
                        if(rep&&rep.responseObject.responseData.bo_data){
                            var data=rep.responseObject.responseData.bo_data;
                            $("#honorId").val(data.id);//给修改添加id
                            $("#honorName").val(data.honorName);
                            $("#awardDepartment").val(data.awardDepartment);
                            gettime($("#awardYear"),data.awardYear);
                        }
                    },
                    error:function(){}
                });
            })
        },
        create:function(){
            $("#honor_add").on("click",function(){
                $(this).after($("#honor_edit"));
                $("#honor_edit").show();
                $(this).hide();
                $(".honor_list").die("mouseover");
            })
        },
        save:function(){
            var t=this;
            $("#honor_save").off("click").on("click",function(){
                var data={};
                var $obj=$("#honor_edit").prev();
                var id=$("#honorId").val();
                if(!id){//添加
                    data.customerId=t.customerId;
                }else{//修改
                    data.id=id;
                }
                data.honorName=$("#honorName").val();
                data.awardDepartment=$("#awardDepartment").val();
                data.awardYear=$("#awardYear option:selected").val();
                data.languageFlag=languageFlag;
                var isSuccess=1;
                //验证
                if(!data.honorName){
                    $(".ev-honorNameTips").parent().addClass("error");
                    $(".ev-honorNameTips").addClass("showIb").html("<i></i>请填写所获荣誉名称!");
                    isSuccess=0;
                }else if(comm.getByteLen(data.honorName)>200){
                    $(".ev-honorNameTips").parent().addClass("error");
                    $(".ev-honorNameTips").addClass("showIb").html("<i></i>最长100个中文或200个英文!");
                    isSuccess=0;
                }else{
                    $(".ev-honorNameTips").parent().removeClass("error");
                    $(".ev-honorNameTips").removeClass("showIb");
                };
                if(!data.awardDepartment){
                    $(".ev-awardDepartmentTips").parent().addClass("error");
                    $(".ev-awardDepartmentTips").addClass("showIb").html("<i></i>请填写颁发机构名称!");
                    isSuccess=0;
                }else if(comm.getByteLen(data.awardDepartment)>200){
                    $(".ev-awardDepartmentTips").parent().addClass("error");
                    $(".ev-awardDepartmentTips").addClass("showIb").html("<i></i>最长100个中文或200个英文!");
                    isSuccess=0;
                }else{
                    $(".ev-awardDepartmentTips").parent().removeClass("error");
                    $(".ev-awardDepartmentTips").removeClass("showIb");
                };

                if(isSuccess==0){
                    return;
                };
                $("#honor_edit").mask("");
                var paramJson=$.toJSON(data);
                $.ajax({
                    type : "post",
                    url : id? t.path.update: t.path.create,
                    data : {paramJson:paramJson},
                    dataType : "json",
                    success : function(rep){
                        $("#honor_edit").unmask("");
                        if(rep.responseObject.responseStatus){
                            //获取资料百分比
                            //customerInforate();
                            if(id){
                                $obj.find(".honorName").text(data.honorName);
                                $obj.find(".awardDepartment").text(data.awardDepartment);
                                $obj.find(".time03").text(data.awardYear);
                            }else{
                                var html="";
                                html+= t.templete.returnList({
                                    honorName:htmlToString(data.honorName),
                                    awardDepartment:htmlToString(data.awardDepartment),
                                    awardYear:data.awardYear,
                                    id:rep.responseObject.responsePk
                                });
                                $("#honor_list").append(html);
                                t.mouse();
                                t.bindEdit();
                                t.del();
                            }
                            t.clear();
                            $.topTip({mark:"success",content:"获得荣誉保存成功！"});
                        }else{
                            $.topTip({mark:"warn",content:"获得荣誉保存失败！"});
                        }
                    },
                    error:function(){}
                });
            });
        },
        del:function(){
            var t=this;
            $(".honor_delBtn").off("click").on("click",function(){
                var $obj = $(this).parents(".honor_list")
                var param={id: $(this).attr("val")};
                $.makeSurePopup({
                    title:"删除资料",
                    content:"确定删除该项吗？",
                    url:t.path.delete1,//ajax请求接口（可不传，不传就不发请求）
                    param:param,//ajax请求参数(可不传)
                    callback:function(){//点击确认后执行的方法（有发送请求时，是请求成功后执行的方法)
                        //获取资料百分比
                        //customerInforate();
                        $obj.animate({height:0},200,function(){
                            $obj.remove();
                        });
                        $.topTip({mark: "success", content: "获得荣誉删除成功！"});
                    },
                    error:function(){//ajax请求失败后执行的方法(可不传)
                        $.topTip({mark: "warn", content: "获得荣誉删除失败！"});
                    }
                });

            });
        }
    };

    honor.init();
})

