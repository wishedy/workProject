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
    var edu={};
    edu={
        path:{
            list:PC_CALL+"customer/education/json_list/",
            info:PC_CALL+"customer/education/info/",
            create:PC_CALL+"customer/education/create/",
            update:PC_CALL+"customer/education/update/",
            delete1:PC_CALL+"customer/education/delete/",
            education:PC_CALL+"commdata/getEducationList/",
            university:PC_CALL+"commdata/getSchoolList/",
            major:PC_CALL+"commdata/getMajorList/",
            city:PC_CALL+"commdata/getRegionList/"
        },
        templete:{
            returnList : function(options){
                var html="";
                html+='<section class="al-tableWriteComplate edu_list">'+
                '<section class="edu_show"><i class="al-tableIconMsg"></i>'+
                '<article class="al-tableWriteContent">'+
                '<h2 class="university">'+options.university+'</h2>'+
                '<p>'+
                '<span class="major">'+options.major+'</span>'+
                '<b class="al-hrLine"></b>'+
                '<span class="edu_education">'+options.education+'</span>'+
                '<b class="al-hrLine" '+(!options.city?"style='display:none'":'')+'></b>'+
                '<span class="city"'+(!options.city?"style='display:none'":'')+'>'+options.city+'</span>'+
                '<span class="al-timeRange time01">'+options.time+'</span>'+
                '</p>'+
                '<figcaption class="al-tableWriteComplateConfig">'+
                '<a href="javascript:void(0)" class="al-tableWriteComplateConfigBtn edu_editBtn" val="'+options.id+'">编辑</a>'+
                '<a href="javscript:void(0)" class="edu_delBtn" val="'+options.id+'">删除</a>'+
                '</figcaption>'+
                '</article>'+
                '</section></section>'
                return html;
            }
        },
        init:function(){
            var t=this;
            ymd({
                year:$("#edu_start_year"),
                month:$("#edu_start_month")
            });
            ymd({
                year:$("#edu_end_year"),
                month:$("#edu_end_month")
            });
            $.ajax({
                type : "post",
                url : t.path.education,
                dataType : "json",
                async:false,
                success : function(data){
                    var html="";
                    $.each(data,function(i,val){
                        html+='<option value="'+val.id+'">'+val.educationName+'</option>';
                    });
                    $("#edu_education").html(html);
                },
                error:function(){}
            });
            this.customerId=$("#sesCustomerId").val();
            this.getEduList();
            this.upNowClick();
            this.cancel();
            this.create();
            this.save();

            //学校名称的选择
            $("#university").lenovonew({
                url: t.path.university,
                showName:"schoolName",
                hiddenId:"universityId"
            });
            //专业搜索
            $("#major").lenovo({
                url: t.path.major,
                showName:"majorTitle",
                hiddenId:"majorId"
            });
            //学校所在城市
            $("#edu_city").lenovo({
                url: t.path.city,
                showName:"regionName",
                hiddenId:"edu_cityId",
                success:function(){
                    $("#edu_city").val($("#edu_city").val().split(" ")[0]);
                }
            });
        },
        //获取列表
        getEduList:function(){
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
                                university:htmlToString(val.university),
                                major:htmlToString(val.major),
                                education:val.education,
                                city: $.trim(val.city)?htmlToString(val.city):"",
                                time:time,
                                id:val.id
                            });
                        })
                    };
                    $("#edu_list").html(html);
                    t.bindEdit();
                    t.mouse();
                    t.del();
                },
                error:function(){}
            });
        },
        //列表移入移出
        mouse:function(){
            $(".edu_list").live("mouseover",function(){
                $(this).addClass("baseinfo_after_hover");
            });
            $(".edu_list").live("mouseout",function(){
                $(this).removeClass("baseinfo_after_hover");
            });
        },
        //至今点击
        upNowClick:function(){
            $("#edu_upNow").on("click",function(){
                if($(this).attr("value")==0){
                    $(".edu_time").hide();
                    $(this).attr("value",1);
                }else{
                    $(".edu_time").show();
                    $(this).attr("value",0);
                }
                $(this).toggleClass("al-tableItemCheckboxOn");
            });
        },
        cancel:function(){
            var t=this;
            $("#edu_cancel").on("click",function(){
                t.clear();
                //事件埋点
                comm.creatEvent({
                    triggerType:"全站功能按钮点击",
                    keyword:"教育背景修改取消",
                    browType:133,
                    actionId:45
                });
                return false;
            })
        },
        clear:function(){
            this.mouse();
            $("#edu_add").show();
            $("#edu_edit").hide();
            $(".edu_show").show();
            $("#educationId").val("");
            $("#edu_edit input").val("");
            $("#edu_edit input").parents("section").removeClass("error");
            $(".al-tableErrorTips","#edu_edit").removeClass("showIb");
            $(".edu_time").show();
            $("#edu_upNow").attr("value",0);
            $("#edu_upNow>span").removeClass("al-tableItemCheckboxOn");
            $("#edu_edit select").each(function(i,em){
                $("option",em).eq(0).attr("selected",true);
            })
        },
        //编辑
        bindEdit:function(){
            var t=this;
            $(".edu_editBtn").off("click").on("click",function(){
                var parent=$(this).parents(".edu_list");
                $("#edu_add").hide();
                parent.after($("#edu_edit"));
                $("#edu_edit").show();
                $(".edu_show",parent).hide();
                $(".edu_list").die("mouseover");
                var paramJson=$.toJSON({id:$(this).attr("val")});
                $.ajax({
                    type : "post",
                    url : t.path.info,
                    data : {paramJson:paramJson},
                    dataType : "json",
                    success : function(rep){
                        if(rep&&rep.responseObject.responseData.bo_data){
                            var data=rep.responseObject.responseData.bo_data;
                            $("#educationId").val(data.id);//给修改添加id
                            $("#university").val(data.university);
                            $("#major").val(data.major);
                            $("#edu_city").val(data.city);

                            var start_year=data.startTime.split("-")[0];
                            var start_month=data.startTime.split("-")[1];
                            var end_year=data.endTime.split("-")[0];
                            var end_month=data.endTime.split("-")[1];
                            gettime($("#edu_start_year"),start_year);
                            gettime($("#edu_start_month"),start_month);
                            gettime($("#edu_end_year"),end_year);
                            gettime($("#edu_end_month"),end_month);
                            if(data.upNow){
                                $(".edu_time").hide();
                                $("#edu_upNow").attr("value",1);
                                $("#edu_upNow").addClass("al-tableItemCheckboxOn");
                            };

                            $.each($("#edu_education option"),function(i,em){
                                if($(em).val()==data.educationId){
                                    $(em).attr("selected",true);
                                }
                            });

                        }
                    },
                    error:function(){}
                });
            })
        },
        create:function(){
            $("#edu_add").on("click",function(){
                $(this).after($("#edu_edit"));
                $("#edu_edit").show();
                $(this).hide();
                $(".edu_list").die("mouseover");
            })
        },
        save:function(){
            var t=this;
            $("#edu_save").off("click").on("click",function(){
                var data={};
                var $obj=$("#edu_edit").prev();
                var id=$("#educationId").val();
                if(!id){//添加
                    data.customerId=t.customerId;
                }else{//修改
                    data.id=id;
                }

                data.city=$("#edu_city").val()||" ";
                data.cityId=$("#edu_city").attr("edu_cityId")||0;
                data.universityId=$("#university").attr("universityId")||0;
                data.university=$("#university").val();
                data.major=$("#major").val();
                data.majorId=$("#major").attr("majorId")||0;
                data.education=$("#edu_education option:selected").text();
                data.educationId=$("#edu_education option:selected").val();
                var sTime=$("#edu_start_year option:selected").val()+'/'+$("#edu_start_month option:selected").val();
                data.startTime=$("#edu_start_year option:selected").val()+'-'+$("#edu_start_month option:selected").val();
                var eTime=$("#edu_end_year option:selected").val()+'/'+$("#edu_end_month option:selected").val();
                data.endTime=$("#edu_end_year option:selected").val()+'-'+$("#edu_end_month option:selected").val();
                data.upNow=0;
                data.languageFlag=languageFlag;
                var time='';
                if($("#edu_upNow").attr("value")==1){
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
                if(!data.university){
                    $(".ev-universityTips").parent().addClass("error");
                    $(".ev-universityTips").addClass("showIb").html("<i></i>请填写学校名称!");
                    isSuccess=0;
                }else if(comm.getByteLen(data.university)>100){
                    $(".ev-universityTips").parent().addClass("error");
                    $(".ev-universityTips").addClass("showIb").html("<i></i>最长50个中文或100个英文!");
                    isSuccess=0;
                }else{
                    $(".ev-universityTips").parent().removeClass("error");
                    $(".ev-universityTips").removeClass("showIb");
                };
                if(!data.major){
                    $(".ev-majorTips").parent().addClass("error");
                    $(".ev-majorTips").addClass("showIb").html("<i></i>请选择专业!");
                    isSuccess=0;
                }else if(comm.getByteLen(data.major)>50){
                    $(".ev-majorTips").parent().addClass("error");
                    $(".ev-majorTips").addClass("showIb").html("<i></i>最长25个中文或50个英文!");
                    isSuccess=0;
                }else{
                    $(".ev-majorTips").parent().removeClass("error");
                    $(".ev-majorTips").removeClass("showIb");
                };
                if(!data.education){
                    $("#edu_error").show();
                    isSuccess=0;
                }else{
                    $("#edu_error").hide();
                };
                if(!checkEndTime(data.startTime,data.endTime)){
                    $("#edu_time_error").show();
                    isSuccess=0;
                }else{
                    $("#edu_time_error").hide();
                };
                if(isSuccess==0){
                    return;
                };
                $("#edu_edit").mask("");
                var paramJson=$.toJSON(data);
                $.ajax({
                    type : "post",
                    url : id? t.path.update: t.path.create,
                    data : {paramJson:paramJson},
                    dataType : "json",
                    success : function(rep){
                        $("#edu_edit").unmask("");
                        if(rep.responseObject.responseStatus){
                            //获取资料百分比
                            //customerInforate();
                            if(id){
                                $obj.find(".university").text(data.university);
                                $obj.find(".major").text(data.major);
                                $obj.find(".edu_education").text(data.education);
                                if($.trim(data.city)){
                                    $obj.find(".city").show().text(data.city);
                                    $obj.find(".city").prev().show();
                                }else{
                                    $obj.find(".city").hide().text(data.city);
                                    $obj.find(".city").prev().hide();
                                }
                                $obj.find(".time01").text(time);
                            }else{
                                var html="";
                                html+= t.templete.returnList({
                                    university:htmlToString(data.university),
                                    major:htmlToString(data.major),
                                    education:data.education,
                                    city:$.trim(data.city)?htmlToString(data.city):"",
                                    time:time,
                                    id:rep.responseObject.responsePk
                                });
                                $("#edu_list").append(html);
                                t.bindEdit();
                                t.mouse();
                                t.del();
                            }
                            t.clear();
                            $.topTip({mark:"success",content:"教育背景保存成功！"});
                        }else{
                            $.topTip({mark:"warn",content:"教育背景保存失败！"});
                        }
                    },
                    error:function(){}
                });
            });
        },
        del:function(){
            var t=this;
            $(".edu_delBtn").off("click").on("click",function(){
                var $obj = $(this).parents(".edu_list")
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
                        $.topTip({mark: "success", content: "教育背景删除成功！"});
                    },
                    error:function(){//ajax请求失败后执行的方法(可不传)
                        $.topTip({mark: "warn", content: "教育背景删除失败！"});
                    }
                });

            });
        }
    };

    edu.init();
})

