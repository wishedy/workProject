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
    var opus={};
    opus={
        path:{
            list:PC_CALL+"customer/opus/json_list/",
            info:PC_CALL+"customer/opus/info/",
            create:PC_CALL+"customer/opus/create/",
            update:PC_CALL+"customer/opus/update/",
            delete1:PC_CALL+"customer/opus/delete/"
        },
        templete:{
            returnList : function(options){
                var html="";
                html+='<section class="al-tableWriteComplate opus_list">'+
                '<section class="opus_show"><i class="al-tableIconMonographs"></i>'+
                '<article class="al-tableWriteContent">'+
                '<h2 class="opusName">'+options.opusName+'</h2>'+
                '<p>'+
                '<span class="publisher">'+options.publisher+'</span>'+
                '<b class="al-hrLine"></b>'+
                '<span class="authorType">'+options.authorType+'</span>'+
                '<span class="al-timeRange time06">'+options.time+'</span>'+
                '</p>'+
                '<p><span class="al-infor information" '+(options.information?'':'style="display: none;"')+'>'+options.information+'</span></p>'+
                '<figcaption class="al-tableWriteComplateConfig">'+
                '<a href="javascript:void(0)" class="al-tableWriteComplateConfigBtn opus_editBtn" val="'+options.id+'">编辑</a>'+
                '<a href="javscript:void(0)" class="opus_delBtn" val="'+options.id+'">删除</a>'+
                '</figcaption>'+
                '</article>'+
                '</section></section>';
                return html;
            }
        },
        init:function(){
            var t=this;
            ymd({
                year:$("#pubYear"),
                month:$("#pubMonth")
            });
            this.customerId=$("#sesCustomerId").val();
            this.getOpusList();
            this.cancel();
            this.create();
            this.save();
        },
        //获取列表
        getOpusList:function(){
            var t=this;
            $.ajax({
                type : "post",
                url : t.path.list,
                data:{dataFlag:2,languageFlag:languageFlag},
                dataType : "json",
                success : function(data){
                    var html="",authorType="";
                    if(data.responseObject.responseData.data_list&&data.responseObject.responseData.data_list.length>0) {
                        var list = data.responseObject.responseData.data_list;
                        $.each(list,function(i,val){
                            switch(val.authorType){
                                case 1:
                                    authorType="第一作者";
                                    break;
                                case 2:
                                    authorType="第一译者";
                                    break;
                                case 3:
                                    authorType="联合作者";
                                    break;
                                case 4:
                                    authorType="联合译者";
                                    break;
                            }
                            time=val.publicationTime.substring(0,4)+"."+val.publicationTime.substring(5,7);
                            html+= t.templete.returnList({
                                opusName:htmlToString(val.opusName),
                                publisher:htmlToString(val.publisher),
                                authorType:authorType,
                                time:time,
                                information: $.trim(val.information)?htmlToString(val.information):'',
                                id:val.id
                            });
                        })
                    };
                    $("#opus_list").html(html);
                    t.mouse();
                    t.bindEdit();
                    t.del();
                },
                error:function(){}
            });
        },
        //列表移入移出
        mouse:function(){
            $(".opus_list").live("mouseover",function(){
                $(this).addClass("baseinfo_after_hover");
            });
            $(".opus_list").live("mouseout",function(){
                $(this).removeClass("baseinfo_after_hover");
            });
        },
        cancel:function(){
            var t=this;
            $("#opus_cancel").on("click",function(){
                t.clear();
                //事件埋点
                comm.creatEvent({
                    triggerType:"全站功能按钮点击",
                    keyword:"学术专著修改取消",
                    browType:139,
                    actionId:45
                });
                return false;
            })
        },
        clear:function(){
            this.mouse();
            $("#opus_add").show();
            $("#opus_edit").hide();
            $(".opus_show").show();
            $("#opusId").val("");
            $("#opus_edit input").val("");
            $("#opus_edit input").parents("section").removeClass("error");
            $(".al-tableErrorTips","#opus_edit").removeClass("showIb");
            $("#information").val("");
            $("#opus_edit select").each(function(i,em){
                $("option",em).eq(0).attr("selected",true);
            })
        },
        //编辑
        bindEdit:function(){
            var t=this;
            $(".opus_editBtn").off("click").on("click",function(){
                var parent=$(this).parents(".opus_list");
                $("#opus_add").hide();
                parent.after($("#opus_edit"));
                $("#opus_edit").show();
                $(".opus_show",parent).hide();
                $(".opus_list").die("mouseover");
                var paramJson=$.toJSON({id:$(this).attr("val")});
                $.ajax({
                    type : "post",
                    url : t.path.info,
                    data : {paramJson:paramJson},
                    dataType : "json",
                    success : function(rep){
                        if(rep&&rep.responseObject.responseData.bo_data){
                            var data=rep.responseObject.responseData.bo_data;
                            $("#opusId").val(data.id);//给修改添加id
                            $("#opusName").val(data.opusName);
                            $("#publisher").val(data.publisher);
                            $("#information").val(data.information);

                            var pubYear=data.publicationTime.substring(0,4);
                            var pubMonth=data.publicationTime.substring(5,7);
                            gettime($("#pubYear"),pubYear);
                            gettime($("#pubMonth"),pubMonth);

                            $.each($("#authorType option"),function(i,em){
                                if($(em).val()==data.authorType){
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
            $("#opus_add").on("click",function(){
                $(this).after($("#opus_edit"));
                $("#opus_edit").show();
                $(this).hide();
                $(".opus_list").die("mouseover");
            })
        },
        save:function(){
            var t=this;
            $("#opus_save").off("click").on("click",function(){
                var data={};
                var $obj=$("#opus_edit").prev();
                var id=$("#opusId").val();
                if(!id){//添加
                    data.customerId=t.customerId;
                }else{//修改
                    data.id=id;
                }
                data.opusName=$("#opusName").val();
                data.publisher=$("#publisher").val();
                data.information=$("#information").val()||" ";
                data.authorType=$("#authorType option:selected").val();
                var time=$("#pubYear option:selected").val()+'.'+$("#pubMonth option:selected").val();
                data.publicationTime=$("#pubYear option:selected").val()+'-'+$("#pubMonth option:selected").val()+"-01";
                data.languageFlag=languageFlag;
                var isSuccess=1;
                //验证
                if(!data.opusName){
                    $(".ev-opusNameTips").parent().addClass("error");
                    $(".ev-opusNameTips").addClass("showIb").html("<i></i>请填写学术论著的标题！");
                    isSuccess=0;
                }else if(comm.getByteLen(data.opusName)>200){
                    $(".ev-opusNameTips").parent().addClass("error");
                    $(".ev-opusNameTips").addClass("showIb").html("<i></i>最长100个中文或200个英文！");
                    isSuccess=0;
                }else{
                    $(".ev-opusNameTips").parent().removeClass("error");
                    $(".ev-opusNameTips").removeClass("showIb");
                };
                if(!data.publisher){
                    $(".ev-publisherTips").parent().addClass("error");
                    $(".ev-publisherTips").addClass("showIb").html("<i></i>请填写出版机构名称！");
                    isSuccess=0;
                }else if(comm.getByteLen(data.publisher)>200){
                    $(".ev-publisherTips").parent().addClass("error");
                    $(".ev-publisherTips").addClass("showIb").html("<i></i>最长100个中文或200个英文！");
                    isSuccess=0;
                }else{
                    $(".ev-publisherTips").parent().removeClass("error");
                    $(".ev-publisherTips").removeClass("showIb");
                };
                if(data.authorType==="0"){
                    $(".ev-authorTypeTips").addClass("showIb").html("<i></i>请选择你对本文的著作身份！");
                    isSuccess=0;
                }else{
                    $(".ev-authorTypeTips").removeClass("showIb");
                };
                if(comm.getByteLen(data.information)>4000){
                    $(".ev-pubMonthTips").parent().addClass("error");
                    $(".ev-pubMonthTips").addClass("showIb").html("<i></i>最长2000个中文！");
                    isSuccess=0;
                }else{
                    $(".ev-pubMonthTips").parent().removeClass("error");
                    $(".ev-pubMonthTips").removeClass("showIb");
                };

                if(isSuccess==0){
                    return;
                };
                authorType=$("#authorType option:selected").text()
                $("#opus_edit").mask("");
                var paramJson=$.toJSON(data);
                $.ajax({
                    type : "post",
                    url : id? t.path.update: t.path.create,
                    data : {paramJson:paramJson},
                    dataType : "json",
                    success : function(rep){
                        $("#opus_edit").unmask("");
                        if(rep.responseObject.responseStatus){
                            //获取资料百分比
                            //customerInforate();
                            if(id){
                                $obj.find(".opusName").text(data.opusName);
                                $obj.find(".publisher").text(data.publisher);
                                $obj.find(".authorType").text(authorType);
                                if($.trim(data.information)){
                                    $obj.find(".information").show().text(data.information);
                                }else{
                                    $obj.find(".information").hide().text(data.information);
                                }
                                $obj.find(".time06").text(time);
                            }else{

                                var html="";
                                html+= t.templete.returnList({
                                    opusName:htmlToString(data.opusName),
                                    publisher:htmlToString(data.publisher),
                                    authorType:authorType,
                                    time:time,
                                    information: $.trim(data.information)?htmlToString(data.information):'',
                                    id:rep.responseObject.responsePk
                                });
                                $("#opus_list").append(html);
                                t.mouse();
                                t.bindEdit();
                                t.del();
                            }
                            t.clear();
                            $.topTip({mark:"success",content:"学术专著保存成功！"});
                        }else{
                            $.topTip({mark:"warn",content:"学术专著保存失败！"});
                        }
                    },
                    error:function(){}
                });
            });
        },
        del:function(){
            var t=this;
            $(".opus_delBtn").off("click").on("click",function(){
                var $obj = $(this).parents(".opus_list");
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
                        $.topTip({mark: "success", content: "学术专著删除成功！"});
                    },
                    error:function(){//ajax请求失败后执行的方法(可不传)
                        $.topTip({mark: "warn", content: "学术专著删除失败！"});
                    }
                });

            });
        }
    };

    opus.init();
})
