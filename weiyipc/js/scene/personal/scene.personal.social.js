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
    var social={};
    social={
        path:{
            list:PC_CALL+"customer/social/json_list/",
            info:PC_CALL+"customer/social/info/",
            create:PC_CALL+"customer/social/create/",
            update:PC_CALL+"customer/social/update/",
            delete1:PC_CALL+"customer/social/delete/"
        },
        templete:{
            returnList : function(options){
                var html="";
                html+='<section class="al-tableWriteComplate social_list">'+
                '<section class="social_show"><i class="al-tableIconSociety"></i>'+
                '<article class="al-tableWriteContent">'+
                '<h2 class="organization">'+options.organization+'</h2>'+
                '<p>'+
                '<span class="socialTitle">'+options.socialTitle+'</span>'+
                '<span class="al-timeRange time05">'+options.time+'</span>'+
                '</p>'+
                '<figcaption class="al-tableWriteComplateConfig">'+
                '<a href="javascript:void(0)" class="al-tableWriteComplateConfigBtn social_editBtn" val="'+options.id+'">编辑</a>'+
                '<a href="javscript:void(0)" class="social_delBtn" val="'+options.id+'">删除</a>'+
                '</figcaption>'+
                '</article>'+
                '</section></section>';
                return html;
            }
        },
        init:function(){
            var t=this;
            ymd({
                year:$("#social_start_year"),
                month:$("#social_start_month")
            });
            ymd({
                year:$("#social_end_year"),
                month:$("#social_end_month")
            });

            this.customerId=$("#sesCustomerId").val();
            this.getSocialList();
            this.upNowClick();
            this.cancel();
            this.create();
            this.save();

        },
        //获取列表
        getSocialList:function(){
            var t=this;
            $.ajax({
                type : "post",
                url : t.path.list,
                data:{dataFlag:2,languageFlag:languageFlag,socialType:0},
                dataType : "json",
                success : function(data){
                    var html="";
                    if(data.responseObject.responseData.data_list&&data.responseObject.responseData.data_list.length>0) {
                        var list = data.responseObject.responseData.data_list;
                        $.each(list,function(i,val){
                            if(val.upNow){
                                time=val.startTime.substring(0,4)+'/'+val.startTime.substring(5,7)+" ～ 至今";
                            }else{
                                time=val.startTime.substring(0,4)+'/'+val.startTime.substring(5,7)+" ～ "+val.endTime.substring(0,4)+'/'+val.endTime.substring(5,7);
                            };
                            html+= t.templete.returnList({
                                organization:htmlToString(val.organization),
                                socialTitle:htmlToString(val.socialTitle),
                                time:time,
                                id:val.id
                            });
                        })
                    };
                    $("#social_list").html(html);
                    t.bindEdit();
                    t.mouse();
                    t.del();
                },
                error:function(){}
            });
        },
        //列表移入移出
        mouse:function(){
            $(".social_list").live("mouseover",function(){
                $(this).addClass("baseinfo_after_hover");
            });
            $(".social_list").live("mouseout",function(){
                $(this).removeClass("baseinfo_after_hover");
            });
        },
        //至今点击
        upNowClick:function(){
            $("#social_upNow").on("click",function(){
                if($(this).attr("value")==0){
                    $(".soc_time").hide();
                    $(this).attr("value",1);
                }else{
                    $(".soc_time").show();
                    $(this).attr("value",0);
                }
                $(this).toggleClass("al-tableItemCheckboxOn");
            });
        },
        cancel:function(){
            var t=this;
            $("#social_cancel").on("click",function(){
                t.clear();
                //事件埋点
                comm.creatEvent({
                    triggerType:"全站功能按钮点击",
                    keyword:"社会任职修改取消",
                    browType:138,
                    actionId:45
                });
                return false;
            })
        },
        clear:function(){
            this.mouse();
            $("#social_add").show();
            $("#social_edit").hide();
            $(".social_show").show();
            $("#socialId").val("");
            $("#social_edit input").val("");
            $("#social_edit input").parents("section").removeClass("error");
            $(".al-tableErrorTips","#social_edit").removeClass("showIb");
            $(".soc_time").show();
            $("#social_upNow").attr("value",0);
            $("#social_upNow").removeClass("al-tableItemCheckboxOn");
            $("#social_edit select").each(function(i,em){
                $("option",em).eq(0).attr("selected",true);
            })
        },
        //编辑
        bindEdit:function(){
            var t=this;
            $(".social_editBtn").off("click").on("click",function(){
                var parent=$(this).parents(".social_list");
                $("#social_add").hide();
                parent.after($("#social_edit"));
                $("#social_edit").show();
                $(".social_show",parent).hide();
                $(".social_list").die("mouseover");
                var paramJson=$.toJSON({id:$(this).attr("val")});
                $.ajax({
                    type : "post",
                    url : t.path.info,
                    data : {paramJson:paramJson},
                    dataType : "json",
                    success : function(rep){
                        if(rep&&rep.responseObject.responseData.bo_data){
                            var data=rep.responseObject.responseData.bo_data;
                            $("#socialId").val(data.id);//给修改添加id
                            $("#soc_organization").val(data.organization);
                            $("#socialTitle").val(data.socialTitle);

                            var start_year=data.startTime.split("-")[0];
                            var start_month=data.startTime.split("-")[1];
                            var end_year=data.endTime.split("-")[0];
                            var end_month=data.endTime.split("-")[1];
                            gettime($("#social_start_year"),start_year);
                            gettime($("#social_start_month"),start_month);
                            gettime($("#social_end_year"),end_year);
                            gettime($("#social_end_month"),end_month);

                            if(data.upNow){
                                $(".soc_time").hide();
                                $("#social_upNow").attr("value",1);
                                $("#social_upNow").addClass("al-tableItemCheckboxOn");
                            };
                        }
                    },
                    error:function(){}
                });
            })
        },
        create:function(){
            $("#social_add").on("click",function(){
                $(this).after($("#social_edit"));
                $("#social_edit").show();
                $(this).hide();
                $(".social_list").die("mouseover");
            })
        },
        save:function(){
            var t=this;
            $("#social_save").off("click").on("click",function(){
                var data={};
                var $obj=$("#social_edit").prev();
                var id=$("#socialId").val();
                if(!id){//添加
                    data.customerId=t.customerId;
                }else{//修改
                    data.id=id;
                }
                data.organization=$("#soc_organization").val();
                data.socialTitle=$("#socialTitle").val();
                var sTime=$("#social_start_year option:selected").val()+'/'+$("#social_start_month option:selected").val();
                data.startTime=$("#social_start_year option:selected").val()+'-'+$("#social_start_month option:selected").val();
                var eTime=$("#social_end_year option:selected").val()+'/'+$("#social_end_month option:selected").val();
                data.endTime=$("#social_end_year option:selected").val()+'-'+$("#social_end_month option:selected").val();
                data.languageFlag=languageFlag;
                time="";
                if($("#social_upNow").attr("value")==1){
                     data.upNow=1;
                     time=sTime+' ～ 至今';
                     eTime='';
                     data.endTime='';
                 }else{
                     data.upNow=0;
                     time=sTime+' ～ '+eTime;
                 };
                var isSuccess=1;
                //验证
                if(!data.organization){
                    $(".ev-socOrganizationTips").parent().addClass("error");
                    $(".ev-socOrganizationTips").addClass("showIb").html("<i></i>请填写任职机构名称!");
                    isSuccess=0;
                }else if(comm.getByteLen(data.organization)>200){
                    $(".ev-socOrganizationTips").parent().addClass("error");
                    $(".ev-socOrganizationTips").addClass("showIb").html("<i></i>最长100个中文或200个英文!");
                    isSuccess=0;
                }else{
                    $("#soc_organization").parent().removeClass("error");
                    $("#soc_organization").removeClass("showIb");
                };
                if(!data.socialTitle){
                    $(".ev-socialTitleTips").parent().addClass("error");
                    $(".ev-socialTitleTips").addClass("showIb").html("<i></i>请填写职位名称!");
                    isSuccess=0;
                }else if(comm.getByteLen(data.socialTitle)>200){
                    $("#socialTitle").parent().addClass("error");
                    $("#socialTitle").addClass("showIb").html("<i></i>最长100个中文或200个英文!");
                    isSuccess=0;
                }else{
                    $("#socialTitle").parent().removeClass("error");
                    $("#socialTitle").removeClass("showIb");
                };

                if(!checkEndTime(data.startTime,data.endTime)){
                    $("#soc_error_time").show();
                    isSuccess=0;
                }else{
                    $("#soc_error_time").hide();
                };
                if(isSuccess==0){
                    return;
                };
                $("#social_edit").mask("");
                var paramJson=$.toJSON(data);
                $.ajax({
                    type : "post",
                    url : id? t.path.update: t.path.create,
                    data : {paramJson:paramJson},
                    dataType : "json",
                    success : function(rep){
                        $("#social_edit").unmask("");
                        if(rep.responseObject.responseStatus){
                            //获取资料百分比
                            //customerInforate();
                            if(id){
                                $obj.find(".organization").text(data.organization);
                                $obj.find(".socialTitle").text(data.socialTitle);
                                $obj.find(".time05").text(time);
                            }else{

                                var html="";
                                html+= t.templete.returnList({
                                    organization:htmlToString(data.organization),
                                    socialTitle:htmlToString(data.socialTitle),
                                    time:time,
                                    id:rep.responseObject.responsePk
                                });
                                $("#social_list").append(html);
                                t.bindEdit();
                                t.mouse();
                                t.del();
                            }
                            t.clear();
                            $.topTip({mark:"success",content:"社会任职保存成功！"});
                        }else{
                            $.topTip({mark:"warn",content:"社会任职保存失败！"});
                        }
                    },
                    error:function(){}
                });
            });
        },
        del:function(){
            var t=this;
            $(".social_delBtn").off("click").on("click",function(){
                var $obj = $(this).parents(".social_list");
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
                        $.topTip({mark: "success", content: "社会任职删除成功！"});
                    },
                    error:function(){//ajax请求失败后执行的方法(可不传)
                        $.topTip({mark: "warn", content: "社会任职删除失败！"});
                    }
                });

            });
        }
    };

    social.init();
})

