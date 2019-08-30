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
    var occ={};
    occ={
        path:{
            list:PC_CALL+"customer/occupation/json_list/",
            info:PC_CALL+"customer/occupation/info/",
            create:PC_CALL+"customer/occupation/create/",
            update:PC_CALL+"customer/occupation/update/",
            delete1:PC_CALL+"customer/occupation/delete/",
            unit:PC_CALL+"commdata/getHospitalList/",
            department:PC_CALL+"commdata/getDepartmentList/"
        },
        templete:{
            returnList : function(options){
                var html="";
                html+='<section class="al-tableWriteComplate occ_list">'+
                '<section class="occ_show"><i class="al-tableIconJob"></i>'+
                '<article class="al-tableWriteContent">'+
                '<h2 class="unit">'+options.unit+'</h2>'+
                '<p>'+
                '<span class="department">'+options.department+'</span>'+
                '<b class="al-hrLine"></b>'+
                '<span class="medicalTitle">'+options.medicalTitle+'</span>'+
                '<span class="al-timeRange time00">'+options.time+'</span>'+
                '</p>'+
                '<figcaption class="al-tableWriteComplateConfig">'+
                '<a href="javascript:void(0)" class="al-tableWriteComplateConfigBtn occ_editBtn" val="'+options.id+'">编辑</a>'+
                '<a href="javscript:void(0)" class="occ_delBtn" val="'+options.id+'">删除</a>'+
                '</figcaption>'+
                '</article>'+
                '</section></section>';
                return html;
            }
        },
        init:function(){
            var t=this;
            ymd({
                year:$("#occ_start_year"),
                month:$("#occ_start_month")
            });
            ymd({
                year:$("#occ_end_year"),
                month:$("#occ_end_month")
            });
            this.customerId=$("#sesCustomerId").val();
            this.getOccList();
            this.upNowClick();
            this.cancel();
            this.create();
            this.save();
            //职称的选择
            $("#occmed_par").medicalTitleV3({
                container:$("#occmed_title"),//存放已选择的职称
                defaultHide:1
            });
            //单位搜索
            $("#unit").lenovo({
                url: t.path.unit,
                showName:"hospitalName", //显示出的值
                id:"hospitalAddress",   //自定义属性值
                hiddenId:"address",    //自定义属性
                success:function(){
                    $("#address").val($("#unit").attr("address"));
                }
            });
            //科室搜索
            $("#department").lenovo({
                url: t.path.department,
                showName:"departmentName"
            });
        },
        //获取列表
        getOccList:function(){
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
                                time=val.startTime.substring(0,7).replace("-","/")+" ～ 至今";
                            }else{
                                time=val.startTime.substring(0,7).replace("-","/")+" ～ "+val.endTime.substring(0,7).replace("-","/");
                            };

                            html+= t.templete.returnList({
                                unit:htmlToString(val.unit),
                                department:htmlToString(val.department),
                                medicalTitle:comm.cutLine(val.medicalTitle,"_","，"),
                                time:time,
                                id:val.id
                            });
                        })
                    };
                    $("#occ_list").html(html);
                    t.mouse();
                    t.bindEdit();
                    t.del();
                },
                error:function(){}
            });
        },
        //列表移入移出
        mouse:function(){
            $(".occ_list").on("mouseover",function(){
               $(this).addClass("baseinfo_after_hover");
            });
            $(".occ_list").on("mouseout",function(){
                $(this).removeClass("baseinfo_after_hover");
            });
        },
        //至今点击
        upNowClick:function(){
            $("#occ_upNow").on("click",function(){
                if($(this).attr("value")==0){
                    $(".occ_time").hide();
                    $(this).attr("value",1);
                }else{
                    $(".occ_time").show();
                    $(this).attr("value",0);
                }
                $(this).toggleClass("al-tableItemCheckboxOn");
            });
        },
        cancel:function(){
            var t=this;
            $("#occ_cancel").on("click",function(){
                t.clear();
                //事件埋点
                comm.creatEvent({
                    triggerType:"全站功能按钮点击",
                    keyword:"工作经历修改取消",
                    actionId:45
                });
                return false;
            })
        },
        clear:function(){
            this.mouse();
            $("#occ_add").show();
            $("#occ_edit").hide();
            $(".occ_show").show();
            $("#occupationId").val("");
            $("#occ_edit input").val("");
            $("#occ_edit input").parents("section").removeClass("error");
            $("#occmed_par").removeClass("showIb");
            $(".al-tableErrorTips","#occ_edit").removeClass("showIb");
            $("#occmed_title").attr("medicaltitle","").text("");
            $("#occmed_par").parent().removeClass("error");
            $("#occmed_par .ev-medicalLiList").attr("select-status","false");
            $("#occmed_par .ev-medicalLiList").removeClass("active");
            $(".occ_time").show();
            $("#occ_upNow").attr("value",0);
            $("#occ_upNow").removeClass("al-tableItemCheckboxOn");
            $("#occ_edit select").each(function(i,em){
                $("option",em).eq(0).attr("selected",true);
            })
        },
        //编辑
        bindEdit:function(){
            var t=this;
            $(".occ_editBtn").off("click").on("click",function(){
                var parent=$(this).parents(".occ_list");
                $("#occ_add").hide();
                parent.after($("#occ_edit"));
                $("#occ_edit").show();
                $(".occ_show",parent).hide();
                $(".occ_list").die("mouseover");
                var paramJson=$.toJSON({id:$(this).attr("val")});
                $.ajax({
                    type : "post",
                    url : t.path.info,
                    data : {paramJson:paramJson},
                    dataType : "json",
                    success : function(rep){
                        if(rep&&rep.responseObject.responseData.bo_data){
                            var data=rep.responseObject.responseData.bo_data;
                            $("#occupationId").val(data.id);//给修改添加id
                            $("#unit").val(data.unit);
                            $("#department").val(data.department);

                            var medical=data.medicalTitle;
                            var medical1=medical.split(",");
                            var medicalTitle="";
                            var ids=[];
                            $.each(medical1,function(i,val){
                                if(val){
                                    if(val.split("_")[1]){
                                        ids.push(val.split("_")[0]);
                                        medicalTitle+=(val.split("_")[1]+"，");
                                    }else{
                                        medicalTitle+=(val+"，");
                                    }
                                }
                            });
                            $("#occmed_title").attr("medicalTitle",medical);
                            $("#occmed_title").text(medicalTitle.substring(0,medicalTitle.length-1));
                            //清空职称的选中状态
                            $("#occmed_par .ev-medicalLiList").attr("select-status","false");
                            $("#occmed_par .ev-medicalLiList").removeClass("active");
                            //比对是对应职称选中
                            $("#occmed_par .al-tagSelectorList:gt(0)").hide();
                            $.each($("#occmed_par .ev-medicalLiList"),function(i,em){
                                $.each(ids,function(j,val){
                                    if(val==3||val==4){
                                        $("#occmed_par .al-tagSelectorList:gt(0)").show();
                                    }
                                    if($(em).attr("medicalid")==val){
                                        $(em).attr("select-status","true");
                                        $(em).addClass("active");
                                    }
                                });
                            });
                            $("#address").val(data.address);
                            var start_year=data.startTime.split("-")[0];
                            var start_month=data.startTime.split("-")[1];
                            var end_year=data.endTime.split("-")[0];
                            var end_month=data.endTime.split("-")[1];
                            gettime($("#occ_start_year"),start_year);
                            gettime($("#occ_start_month"),start_month);
                            gettime($("#occ_end_year"),end_year);
                            gettime($("#occ_end_month"),end_month);
                            if(data.upNow){
                                $(".occ_time").hide();
                                $("#occ_upNow").attr("value",1);
                                $("#occ_upNow").addClass("al-tableItemCheckboxOn");
                            }
                        }
                    },
                    error:function(){}
                });
            })
        },
        create:function(){
            $("#occ_add").on("click",function(){
                $(this).after($("#occ_edit"));
                $("#occ_edit").show();
                $(this).hide();
                $(".occ_list").die("mouseover");
            })
        },
        save:function(){
            var t=this;
            $("#occ_save").on("click",function(){
                var data={};
                var $obj=$("#occ_edit").prev();
                var id=$("#occupationId").val();
                if(!id){//添加
                    data.customerId=t.customerId;
                }else{//修改
                    data.id=id;
                }
                data.unit=$("#unit").val();
                data.department=$("#department").val();
                data.medicalTitle=$("#occmed_title").attr("medicalTitle");
                //data.occupation=$("#occupation").val();
                data.address=$("#address").val()||" ";
                var sTime=$("#occ_start_year option:selected").val()+'/'+$("#occ_start_month option:selected").val();
                data.startTime=$("#occ_start_year option:selected").val()+'-'+$("#occ_start_month option:selected").val();
                var eTime=$("#occ_end_year option:selected").val()+'/'+$("#occ_end_month option:selected").val();
                data.endTime=$("#occ_end_year option:selected").val()+'-'+$("#occ_end_month option:selected").val();
                data.upNow=0;
                data.languageFlag=languageFlag;
                var time='';
                if($("#occ_upNow").attr("value")==1){
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
                if(!data.unit){
                    $(".ev-unitTips").parent().addClass("error");
                    $(".ev-unitTips").addClass("showIb").html("<i></i>请填写工作单位!");
                    isSuccess=0;
                }else if(comm.getByteLen(data.unit)>200){
                    $(".ev-unitTips").parent().addClass("error");
                    $(".ev-unitTips").addClass("showIb").html("<i></i>最长100个中文或200个英文!");
                    isSuccess=0;
                }else{
                    $(".ev-unitTips").parent().removeClass("error");
                    $(".ev-unitTips").removeClass("showIb");
                };
                if(!data.department){
                    $(".ev-departmentTips").parent().addClass("error");
                    $(".ev-departmentTips").addClass("showIb").html("<i></i>请选择科室或部门!");
                    isSuccess=0;
                }else if(comm.getByteLen(data.department)>50){
                    $(".ev-departmentTips").parent().addClass("error");
                    $(".ev-departmentTips").addClass("showIb").html("<i></i>最长25个中文或50个英文!");
                    isSuccess=0;
                }else{
                    $(".ev-departmentTips").parent().removeClass("error");
                    $(".ev-departmentTips").removeClass("showIb");
                };
                if(!data.medicalTitle){
                    $("#occmed_par").parent().addClass("error");
                    $("#occmed_par").parent().find(".al-tableErrorTips").addClass("showIb");
                    isSuccess=0;
                }else{
                    $("#occmed_par").parent().removeClass("error");
                    $("#occmed_par").find(".al-tableErrorTips").removeClass("showIb");
                };

                if(comm.getByteLen(data.address)>100){
                    $(".ev-addressTips").parent().addClass("error");
                    $(".ev-addressTips").addClass("showIb");
                    isSuccess=0;
                }else{
                    $(".ev-addressTips").parent().removeClass("error");
                    $(".ev-addressTips").removeClass("showIb");
                }
                if(!checkEndTime(data.startTime,data.endTime)){
                    $("#occ_time_error").show();
                    isSuccess=0;
                }else{
                    $("#occ_time_error").hide();
                };
                if(isSuccess==0){
                    return;
                };
                $("#occ_edit").mask("");
                var paramJson=$.toJSON(data);
                $.ajax({
                    type : "post",
                    url : id? t.path.update: t.path.create,
                    data : {paramJson:paramJson},
                    dataType : "json",
                    success : function(rep){
                        $("#occ_edit").unmask("");
                        if(rep.responseObject.responseStatus){
                            //获取资料百分比
                            //customerInforate();
                            if(id){
                                $obj.find(".unit").text(data.unit);
                                $obj.find(".department").text(data.department);
                                $obj.find(".medicalTitle").text($("#occmed_title").text());

                                $obj.find(".time00").text(time);
                            }else{

                                var html="";
                                html+= t.templete.returnList({
                                    unit:htmlToString(data.unit),
                                    department:htmlToString(data.department),
                                    medicalTitle:$("#occmed_title").text(),
                                    //occupation:data.occupation,
                                    time:time,
                                    id:rep.responseObject.responsePk
                                });
                                $("#occ_list").append(html);
                                t.mouse();
                                t.bindEdit();
                                t.del();
                            }
                            t.clear();
                            $.topTip({mark:"success",content:"工作经历保存成功！"});
                        }else{
                            $.topTip({mark:"warn",content:"工作经历保存失败！"});
                        }
                    },
                    error:function(){}
                });
            });
        },
        del:function(){
            var t=this;
            $(".occ_delBtn").off("click").on("click",function(){
                var $obj = $(this).parents(".occ_list");
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
                        $.topTip({mark: "success", content: "工作经历删除成功！"});
                    },
                    error:function(){//ajax请求失败后执行的方法(可不传)
                        $.topTip({mark: "warn", content: "工作经历删除失败！"});
                    }
                });
            });
        }
    };

    occ.init();
})

