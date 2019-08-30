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
    var cEdu={};
    cEdu={
        path:{
            list:PC_CALL+"customer/continue/education/json_list/",
            info:PC_CALL+"customer/continue/education/info/",
            create:PC_CALL+"customer/continue/education/create/",
            update:PC_CALL+"customer/continue/education/update/",
            delete1:PC_CALL+"customer/continue/education/delete/"
        },
        templete:{
            returnList : function(options){
                var html="";
                html+='<section class="al-tableWriteComplate cEdu_list">'+
                '<section class="cEdu_show"><i class="al-tableIconConEdu"></i>'+
                '<article class="al-tableWriteContent">'+
                '<h2 class="organization">'+options.organization+'</h2>'+
                '<p>'+
                '<span class="cmeDesc"'+(!options.cmeDesc?"style='display:none'":'')+'>'+options.cmeDesc+'</span>'+
                '<b class="al-hrLine" '+(!options.certificate?"style='display:none'":'')+'></b>'+
                '<span class="certificate" '+(!options.certificate?"style='display:none'":'')+'>'+options.certificate+'</span>'+
                '<span class="al-timeRange time02">'+options.time+'</span>'+
                '</p>'+
                '<figcaption class="al-tableWriteComplateConfig">'+
                '<a href="javascript:void(0)" class="al-tableWriteComplateConfigBtn cEdu_editBtn" val="'+options.id+'">编辑</a>'+
                '<a href="javscript:void(0)" class="cEdu_delBtn" val="'+options.id+'">删除</a>'+
                '</figcaption>'+
                '</article>'+
                '</section></section>';
                return html;
            }
        },
        init:function(){
            var t=this;
            ymd({
                year:$("#cEdu_start_year"),
                month:$("#cEdu_start_month")
                //day:$("#cEdu_start_day")
            });
            ymd({
                year:$("#cEdu_end_year"),
                month:$("#cEdu_end_month")
                //day:$("#cEdu_end_day")
            });

            this.customerId=$("#sesCustomerId").val();
            this.getcEduList();
            this.create();
            this.cancel();
            this.save();

        },
        //获取列表
        getcEduList:function(){
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
                            if(val.upNow){
                                time=val.startTime.substring(0,4)+'.'+val.startTime.substring(5,7)+" ～ 至今";
                            }else{
                                time=val.startTime.substring(0,4)+'/'+val.startTime.substring(5,7)+" ～ "+val.endTime.substring(0,4)+'/'+val.endTime.substring(5,7);
                            };
                            html+= t.templete.returnList({
                                organization:htmlToString(val.organization),
                                certificate:$.trim(val.certificate)?htmlToString(val.certificate):'',
                                time:time,
                                cmeDesc: $.trim(val.cmeDesc)?htmlToString(val.cmeDesc):'',
                                id:val.id
                            });
                        })
                    };
                    $("#cEdu_list").html(html);
                    t.mouse();
                    t.bindEdit();
                    t.del();
                },
                error:function(){}
            });
        },
        //列表移入移出
        mouse:function(){
            $(".cEdu_list").on("mouseover",function(){
                $(this).addClass("baseinfo_after_hover");
            });
            $(".cEdu_list").on("mouseout",function(){
                $(this).removeClass("baseinfo_after_hover");
            });
        },
        
        cancel:function(){
            var t=this;
            $("#cEdu_cancel").on("click",function(){
                t.clear();
                //事件埋点
                comm.creatEvent({
                    triggerType:"全站功能按钮点击",
                    keyword:"继续教育修改取消",
                    browType:135,
                    actionId:45
                });
                return false;
            })
        },
        clear:function(){
            this.mouse();
            $("#cEdu_add").show();
            $("#cEdu_edit").hide();
            $(".cEdu_show").show();
            $("#cEducationId").val("");
            $("#cEdu_edit input").val("");
            $("#cmeDesc").val("");
            $("#cEdu_edit input").parents("section").removeClass("error");
            $("#cmeDesc").parents("section").removeClass("error");
            $(".al-tableErrorTips","#cEdu_edit").removeClass("showIb");
            $("#cEdu_edit select").each(function(i,em){
                $("option",em).eq(0).attr("selected",true);
            });
        },
        //编辑
        bindEdit:function(){
            var t=this;
            $(".cEdu_editBtn").off("click").on("click",function(){
                var parent=$(this).parents(".cEdu_list");
                $("#cEdu_add").hide();
                parent.after($("#cEdu_edit"));
                $("#cEdu_edit").show();
                $(".cEdu_show",parent).hide();
                $(".cEdu_list").die("mouseover");
                var paramJson=$.toJSON({id:$(this).attr("val")});
                $.ajax({
                    type : "post",
                    url : t.path.info,
                    data : {paramJson:paramJson},
                    dataType : "json",
                    success : function(rep){
                        if(rep&&rep.responseObject.responseData.bo_data){
                            var data=rep.responseObject.responseData.bo_data;
                            $("#cEducationId").val(data.id);//给修改添加id
                            $("#organization").val(data.organization);
                            $("#cmeDesc").val(data.cmeDesc);
                            $("#certificate").val(data.certificate);

                            var start_year=data.startTime.split("-")[0];
                            var start_month=data.startTime.split("-")[1];
                            //var start_day=data.startTime.split("-")[2];
                            var end_year=data.endTime.split("-")[0];
                            var end_month=data.endTime.split("-")[1];
                            //var end_day=data.endTime.split("-")[2];
                            gettime($("#cEdu_start_year"),start_year);
                            gettime($("#cEdu_start_month"),start_month);
                            //gettime($("#cEdu_start_day"),start_day);
                            gettime($("#cEdu_end_year"),end_year);
                            gettime($("#cEdu_end_month"),end_month);
                            //gettime($("#cEdu_start_day"),end_day);

                        }
                    },
                    error:function(){}
                });
            })
        },
        create:function(){
            $("#cEdu_add").on("click",function(){
                $(this).after($("#cEdu_edit"));
                $("#cEdu_edit").show();
                $(this).hide();
                $(".cEdu_list").die("mouseover");
            })
        },
        save:function(){
            var t=this;
            $("#cEdu_save").on("click",function(){
                var data={};
                var $obj=$("#cEdu_edit").prev();
                var id=$("#cEducationId").val();
                if(!id){//添加
                    data.customerId=t.customerId;
                }else{//修改
                    data.id=id;
                }
                data.organization=$("#organization").val();
                data.cmeDesc=$("#cmeDesc").val()||" ";
                data.certificate=$("#certificate").val()||" ";
                var sTime=$("#cEdu_start_year option:selected").val()+'/'+$("#cEdu_start_month option:selected").val();
                data.startTime=$("#cEdu_start_year option:selected").val()+'-'+$("#cEdu_start_month option:selected").val();
                var eTime=$("#cEdu_end_year option:selected").val()+'/'+$("#cEdu_end_month option:selected").val();
                data.endTime=$("#cEdu_end_year option:selected").val()+'-'+$("#cEdu_end_month option:selected").val();
                data.languageFlag=languageFlag;
                time=sTime+' ～ '+eTime;
                var isSuccess=1;
                //验证
                if(!data.organization){
                    $(".ev-organizationTips").parent().addClass("error");
                    $(".ev-organizationTips").addClass("showIb").html("<i></i>请填写培训机构名称!");
                    isSuccess=0;
                }else if(comm.getByteLen(data.organization)>100){
                    $(".ev-organizationTips").parent().addClass("error");
                    $(".ev-organizationTips").addClass("showIb").html("<i></i>最长50个中文或100个英文!");
                    isSuccess=0;
                }else{
                    $(".ev-organizationTips").parent().removeClass("error");
                    $(".ev-organizationTips").removeClass("showIb");
                };
                if(comm.getByteLen(data.cmeDesc)>1000){
                    $(".ev-cmeDescTips").parent().addClass("error");
                    $(".ev-cmeDescTips").addClass("showIb").html("<i></i>最长500个中文或1000个英文!");
                    isSuccess=0;
                }else{
                    $(".ev-cmeDescTips").parent().removeClass("error");
                    $(".ev-cmeDescTips").removeClass("showIb");
                };
                if(comm.getByteLen(data.certificate)>100){
                    $(".ev-certificateTips").parent().addClass("error");
                    $(".ev-certificateTips").addClass("showIb").html("<i></i>最长50个中文或100个英文!");
                    isSuccess=0;
                }else{
                    $(".ev-certificateTips").parent().removeClass("error");
                    $(".ev-certificateTips").addClass("showIb").find(".al-tableErrorTips").removeClass("showIb");
                };
                if(!checkEndTime(data.startTime,data.endTime)){
                    $("#cEdu_error_time").addClass("showIb");
                    isSuccess=0;
                }else{
                    $("#cEdu_error_time").removeClass("showIb");
                };
                if(isSuccess==0){
                    return;
                };
                $("#cEdu_edit").mask("");
                var paramJson=$.toJSON(data);
                $.ajax({
                    type : "post",
                    url : id? t.path.update: t.path.create,
                    data : {paramJson:paramJson},
                    dataType : "json",
                    success : function(rep){
                        $("#cEdu_edit").unmask("");
                        if(rep.responseObject.responseStatus){
                            //获取资料百分比
                            //customerInforate();
                            if(id){
                                $obj.find(".organization").text(data.organization);
                                if($.trim(data.certificate)){
                                    $obj.find(".certificate").show().text(data.certificate);
                                    $obj.find(".certificate").prev().show();
                                }else{
                                    $obj.find(".certificate").hide().text(data.certificate);
                                    $obj.find(".certificate").prev().hide();
                                }
                                if($.trim(data.cmeDesc)){
                                    $obj.find(".cmeDesc").show().text(data.cmeDesc);
                                }else{
                                    $obj.find(".cmeDesc").hide().text(data.cmeDesc);
                                }
                                $obj.find(".time02").text(time);
                            }else{
                                var html="";
                                html+= t.templete.returnList({
                                    organization:htmlToString(data.organization),
                                    certificate:$.trim(data.certificate)?htmlToString(data.certificate):'',
                                    time:time,
                                    cmeDesc: $.trim(data.cmeDesc)?htmlToString(data.cmeDesc):'',
                                    id:rep.responseObject.responsePk
                                });
                                $("#cEdu_list").append(html);
                                t.mouse();
                                t.bindEdit();
                                t.del();
                            }
                            t.clear();
                            $.topTip({mark:"success",content:"继续教育保存成功！"});
                        }else{
                            $.topTip({mark:"warn",content:"继续教育保存失败！"});
                        }
                    },
                    error:function(){}
                });
            });
        },
        del:function(){
            var t=this;
            $(".cEdu_delBtn").off("click").on("click",function(){
                var $obj = $(this).parents(".cEdu_list")
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
                        $.topTip({mark: "success", content: "继续教育删除成功！"});
                    },
                    error:function(){//ajax请求失败后执行的方法(可不传)
                        $.topTip({mark: "warn", content: "继续教育删除失败！"});
                    }
                });
            });
        }
    };

    cEdu.init();
})

