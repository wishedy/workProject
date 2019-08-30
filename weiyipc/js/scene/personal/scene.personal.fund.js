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
    var fund={};
    fund={
        path:{
            list:PC_CALL+"customer/fund/json_list/",
            info:PC_CALL+"customer/fund/info/",
            create:PC_CALL+"customer/fund/create/",
            update:PC_CALL+"customer/fund/update/",
            delete1:PC_CALL+"customer/fund/delete/"
        },
        templete:{
            returnList : function(options){
                var html="";
                html+='<section class="al-tableWriteComplate fund_list">'+
                '<sectiopn class="fund_show"><i class="al-tableIconFoud"></i>'+
                '<article class="al-tableWriteContent">'+
                '<h2 class="fundName">'+options.fundName+'</h2>'+
                '<p>'+
                '<span class="fundCode">'+options.fundCode+'</span>'+
                '<span class="al-timeRange time04">'+options.approvalTime+'</span>'+
                '</p>'+
                '<figcaption class="al-tableWriteComplateConfig">'+
                '<a href="javascript:void(0)" class="al-tableWriteComplateConfigBtn fund_editBtn" val="'+options.id+'">编辑</a>'+
                '<a href="javscript:void(0)" class="fund_delBtn" val="'+options.id+'">删除</a>'+
                '</figcaption>'+
                '</article>'+
                '</section></section>'
                return html;
            }
        },
        init:function(){
            var t=this;
            ymd({
                year:$("#approvalTime")
            });

            this.customerId=$("#sesCustomerId").val();
            this.getFundList();
            this.cancel();
            this.create();
            this.save();

        },
        //获取列表
        getFundList:function(){
            var t=this;
            $.ajax({
                type : "post",
                url : t.path.list,
                data:{dataFlag:2,languageFlag:languageFlag},
                dataType : "json",
                success : function(data){
                    var html="";
                    if(data.responseObject.responseData.data_list&&data.responseObject.responseData.data_list.length>0) {
                        var list = data.responseObject.responseData.data_list;
                        $.each(list,function(i,val){
                            html+= t.templete.returnList({
                                fundName:htmlToString(val.fundName),
                                fundCode:htmlToString(val.fundCode),
                                approvalTime:val.approvalTime.substring(0,4),
                                id:val.id
                            });
                        })
                    };
                    $("#fund_list").html(html);
                    t.bindEdit();
                    t.mouse();
                    t.del();
                },
                error:function(){}
            });
        },
        //列表移入移出
        mouse:function(){
            $(".fund_list").live("mouseover",function(){
                $(this).addClass("baseinfo_after_hover");
            });
            $(".fund_list").live("mouseout",function(){
                $(this).removeClass("baseinfo_after_hover");
            });
        },

        cancel:function(){
            var t=this;
            $("#fund_cancel").on("click",function(){
                t.clear();
                //事件埋点
                comm.creatEvent({
                    triggerType:"全站功能按钮点击",
                    keyword:"科研基金修改取消",
                    browType:137,
                    actionId:45
                });
                return false;
            })
        },
        clear:function(){
            this.mouse();
            $("#fund_add").show();
            $("#fund_edit").hide();
            $(".fund_show").show();
            $("#fundId").val("");
            $("#fund_edit input").val("");
            $("#fund_edit input").parents("section").removeClass("error");
            $(".al-tableErrorTips","#fund_edit").removeClass("showIb");
            $("#fund_edit select").each(function(i,em){
                $("option",em).eq(0).attr("selected",true);
            })
        },
        //编辑
        bindEdit:function(){
            var t=this;
            $(".fund_editBtn").off("click").on("click",function(){
                var parent=$(this).parents(".fund_list");
                $("#fund_add").hide();
                parent.after($("#fund_edit"));
                $("#fund_edit").show();
                $(".fund_show",parent).hide();
                $(".fund_list").die("mouseover");
                var paramJson=$.toJSON({id:$(this).attr("val")});
                $.ajax({
                    type : "post",
                    url : t.path.info,
                    data : {paramJson:paramJson},
                    dataType : "json",
                    success : function(rep){
                        if(rep&&rep.responseObject.responseData.bo_data){
                            var data=rep.responseObject.responseData.bo_data;
                            $("#fundId").val(data.id);//给修改添加id
                            $("#fundName").val(data.fundName);
                            $("#fundCode").val(data.fundCode);
                            gettime($("#approvalTime"),data.approvalTime.substring(0,4));
                        }
                    },
                    error:function(){}
                });
            })
        },
        create:function(){
            $("#fund_add").on("click",function(){
                $(this).after($("#fund_edit"));
                $("#fund_edit").show();
                $(this).hide();
                $(".fund_list").die("mouseover");
            })
        },
        save:function(){
            var t=this;
            $("#fund_save").off("click").on("click",function(){
                var data={};
                var $obj=$("#fund_edit").prev();
                var id=$("#fundId").val();
                if(!id){//添加
                    data.customerId=t.customerId;
                }else{//修改
                    data.id=id;
                }
                data.fundName=$("#fundName").val();
                data.fundCode=$("#fundCode").val();
                data.approvalTime=$("#approvalTime option:selected").val();
                data.languageFlag=languageFlag;
                var isSuccess=1;
                //验证
                if(!data.fundName){
                    $(".ev-fundNameTips").parent().addClass("error");
                    $(".ev-fundNameTips").addClass("showIb").html("<i></i>请填写科研基金的项目名称!");
                    isSuccess=0;
                }else if(comm.getByteLen(data.fundName)>200){
                    $(".ev-fundNameTips").parent().addClass("error");
                    $(".ev-fundNameTips").addClass("showIb").html("<i></i>最长100个中文或200个英文!");
                    isSuccess=0;
                }else{
                    $(".ev-fundNameTips").parent().removeClass("error");
                    $(".ev-fundNameTips").removeClass("showIb");
                };
                if(!data.fundCode){
                    $(".ev-fundCodeTips").parent().addClass("error");
                    $(".ev-fundCodeTips").addClass("showIb").html("<i></i>请填写科研基金的项目编号!");
                    isSuccess=0;
                }else if(comm.getByteLen(data.fundCode)>200){
                    $(".ev-fundCodeTips").parent().addClass("error");
                    $(".ev-fundCodeTips").addClass("showIb").html("<i></i>最长100个中文或200个英文!");
                    isSuccess=0;
                }else{
                    $(".ev-fundCodeTips").parent().removeClass("error");
                    $(".ev-fundCodeTips").removeClass("showIb");
                };

                if(isSuccess==0){
                    return;
                };
                $("#fund_edit").mask("");
                var paramJson=$.toJSON(data);
                $.ajax({
                    type : "post",
                    url : id? t.path.update: t.path.create,
                    data : {paramJson:paramJson},
                    dataType : "json",
                    success : function(rep){
                        $("#fund_edit").unmask("");
                        if(rep.responseObject.responseStatus){
                            //获取资料百分比
                            //customerInforate();
                            if(id){
                                $obj.find(".fundName").text(data.fundName);
                                $obj.find(".fundCode").text(data.fundCode);
                                $obj.find(".time04").text(data.approvalTime);
                            }else{
                                var html="";
                                html+= t.templete.returnList({
                                    fundName:htmlToString(data.fundName),
                                    fundCode:htmlToString(data.fundCode),
                                    approvalTime:data.approvalTime,
                                    id:rep.responseObject.responsePk
                                });
                                $("#fund_list").append(html);
                                t.bindEdit();
                                t.mouse();
                                t.del();
                            }
                            t.clear();
                            $.topTip({mark:"success",content:"科研基金保存成功！"});
                        }else{
                            $.topTip({mark:"warn",content:"科研基金保存失败！"});
                        }
                    },
                    error:function(){}
                });
            });
        },
        del:function(){
            var t=this;
            $(".fund_delBtn").off("click").on("click",function(){
                var $obj = $(this).parents(".fund_list")
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
                        $.topTip({mark: "success", content: "科研基金删除成功！"});
                    },
                    error:function(){//ajax请求失败后执行的方法(可不传)
                        $.topTip({mark: "warn", content: "科研基金删除失败！"});
                    }
                });

            });
        }
    };

    fund.init();
})

