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
    var patent={};
    patent={
        path:{
            list:PC_CALL+"customer/patent/json_list/",
            info:PC_CALL+"customer/patent/info/",
            create:PC_CALL+"customer/patent/create/",
            update:PC_CALL+"customer/patent/update/",
            delete1:PC_CALL+"customer/patent/delete/",
            country:PC_CALL+"comm/data/region/json_list/"
        },
        templete:{
            returnList : function(options){
                var html="";
                html+='<section class="al-tableWriteComplate patent_list">'+
                '<section class="patent_show"><i class="al-tableIconPatent"></i>'+
                '<article class="al-tableWriteContent">'+
                '<h2 class="patentName">'+options.patentName+'</h2>'+
                '<p>'+
                '<span class="patentCode">'+options.patentCode+'</span>'+
                '<b class="al-hrLine"></b>'+
                '<span class="country">'+options.country+'</span>'+
                '<span class="al-timeRange time07">'+options.time+'</span>'+
                '</p>'+
                '<figcaption class="al-tableWriteComplateConfig">'+
                '<a href="javascript:void(0)" class="al-tableWriteComplateConfigBtn patent_editBtn" val="'+options.id+'">编辑</a>'+
                '<a href="javscript:void(0)" class="patent_delBtn" val="'+options.id+'">删除</a>'+
                '</figcaption>'+
                '</article>'+
                '</section></section>';
                return html;
            }
        },
        init:function(){
            var t=this;
            ymd({
                year:$("#patYear"),
                month:$("#patMonth")
            });
            this.customerId=$("#sesCustomerId").val();
            this.getPatList();
            this.getCountry();
            this.cancel();
            this.create();
            this.save();
        },
        //获取国家
        getCountry:function(){
            var t=this;
            $.ajax({
                type: "POST",
                url:  t.path.country,
                data:{treeLevel:1,pageIndex:1,pageSize:100},
                dataType: "json",
                async: false,
                success: function(data){
                    var html="";
                    if(data.responseObject.responseData.data_list){
                        $.each(data.responseObject.responseData.data_list,function(i,val){
                            html+="<option value="+val.regionName+">"+val.regionName+"</option>"
                        })
                        $("#country").html(html);
                    }
                }
            });
        },
        //获取列表
        getPatList:function(){
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

                            time=val.patentTime.substring(0,4)+"."+val.patentTime.substring(5,7);
                            html+= t.templete.returnList({
                                patentName:htmlToString(val.patentName),
                                patentCode:htmlToString(val.patentCode),
                                country:val.country,
                                time:time,
                                id:val.id
                            });
                        })
                    };
                    $("#patent_list").html(html);
                    t.bindEdit();
                    t.mouse();
                    t.del();
                },
                error:function(){}
            });
        },
        //列表移入移出
        mouse:function(){
            $(".patent_list").live("mouseover",function(){
                $(this).addClass("baseinfo_after_hover");
            });
            $(".patent_list").live("mouseout",function(){
                $(this).removeClass("baseinfo_after_hover");
            });
        },
        cancel:function(){
            var t=this;
            $("#patent_cancel").on("click",function(){
                t.clear();
                //事件埋点
                comm.creatEvent({
                    triggerType:"全站功能按钮点击",
                    keyword:"发明专利修改取消",
                    browType:140,
                    actionId:45
                });
                return false;
            })
        },
        clear:function(){
            this.mouse();
            $("#patent_add").show();
            $("#patent_edit").hide();
            $(".patent_show").show();
            $("#patentId").val("");
            $("#patent_edit input").val("");
            $("#patent_edit input").parents("section").removeClass("error");
            $(".al-tableErrorTips","#patent_edit").removeClass("showIb");
            $("#patent_edit select").each(function(i,em){
                $("option",em).eq(0).attr("selected",true);
            })
        },
        //编辑
        bindEdit:function(){
            var t=this;
            $(".patent_editBtn").off("click").on("click",function(){
                var parent=$(this).parents(".patent_list");
                $("#patent_add").hide();
                parent.after($("#patent_edit"));
                $("#patent_edit").show();
                $(".patent_show",parent).hide();
                $(".patent_list").die("mouseover");
                var paramJson=$.toJSON({id:$(this).attr("val")});
                $.ajax({
                    type : "post",
                    url : t.path.info,
                    data : {paramJson:paramJson},
                    dataType : "json",
                    success : function(rep){
                        if(rep&&rep.responseObject.responseData.bo_data){
                            var data=rep.responseObject.responseData.bo_data;
                            $("#patentId").val(data.id);//给修改添加id
                            $("#patentName").val(data.patentName);
                            $("#patentCode").val(data.patentCode);

                            var patYear=data.patentTime.substring(0,4);
                            var patMonth=data.patentTime.substring(5,7);
                            gettime($("#patYear"),patYear);
                            gettime($("#patMonth"),patMonth);

                            $.each($("#country option"),function(i,em){
                                if($(em).val()==data.country){
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
            $("#patent_add").on("click",function(){
                $(this).after($("#patent_edit"));
                $("#patent_edit").show();
                $(this).hide();
                $(".patent_list").die("mouseover");
            })
        },
        save:function(){
            var t=this;
            $("#patent_save").off("click").on("click",function(){
                var data={};
                var $obj=$("#patent_edit").prev();
                var id=$("#patentId").val();
                if(!id){//添加
                    data.customerId=t.customerId;
                }else{//修改
                    data.id=id;
                }
                data.patentName=$("#patentName").val();
                data.patentCode=$("#patentCode").val();
                data.country=$("#country option:selected").val();
                var time=$("#patYear option:selected").val()+'.'+$("#patMonth option:selected").val();
                data.patentTime=$("#patYear option:selected").val()+'-'+$("#patMonth option:selected").val();
                data.languageFlag=languageFlag;
                var isSuccess=1;
                //验证
                if(!data.patentName){
                    $(".ev-patentNameTips").parent().addClass("error");
                    $(".ev-patentNameTips").addClass("showIb").html("<i></i>请填写专利名称！");
                    isSuccess=0;
                }else if(comm.getByteLen(data.patentName)>200){
                    $(".ev-patentNameTips").parent().addClass("error");
                    $(".ev-patentNameTips").addClass("showIb").html("<i></i>最长100个中文或200个英文！");
                    isSuccess=0;
                }else{
                    $(".ev-patentNameTips").parent().removeClass("error");
                    $(".ev-patentNameTips").removeClass("showIb");
                };
                if(!data.patentCode){
                    $(".ev-patentCodeTips").parent().addClass("error");
                    $(".ev-patentCodeTips").addClass("showIb").html("<i></i>请填写专利编号！");
                    isSuccess=0;
                }else if(!(/[a-zA-Z0-9]{1,200}$/.test(data.patentCode))){
                    $(".ev-patentCodeTips").parent().addClass("error");
                    $(".ev-patentCodeTips").addClass("showIb").html("<i></i>请填写正确的专利编号！");
                    isSuccess=0;
                }else if(comm.getByteLen(data.patentCode)>200){
                    $(".ev-patentCodeTips").parent().addClass("error");
                    $(".ev-patentCodeTips").addClass("showIb").html("<i></i>最长200个字符！");
                    isSuccess=0;
                }else{
                    $(".ev-patentCodeTips").parent().removeClass("error");
                    $(".ev-patentCodeTips").removeClass("showIb");
                };

                if(isSuccess==0){
                    return;
                };
                $("#patent_edit").mask("");
                var paramJson=$.toJSON(data);
                $.ajax({
                    type : "post",
                    url : id? t.path.update: t.path.create,
                    data : {paramJson:paramJson},
                    dataType : "json",
                    success : function(rep){
                        $("#patent_edit").unmask("");
                        if(rep.responseObject.responseStatus){
                            //获取资料百分比
                            //customerInforate();
                            if(id){
                                $obj.find(".patentName").text(data.patentName);
                                $obj.find(".patentCode").text(data.patentCode);
                                $obj.find(".country").text(data.country);
                                $obj.find(".time07").text(time);
                            }else{

                                var html="";
                                html+= t.templete.returnList({
                                    patentName:htmlToString(data.patentName),
                                    patentCode:htmlToString(data.patentCode),
                                    country:data.country,
                                    time:time,
                                    id:rep.responseObject.responsePk
                                });
                                $("#patent_list").append(html);
                                t.bindEdit();
                                t.mouse();
                                t.del();
                            }
                            t.clear();
                            $.topTip({mark:"success",content:"发明专利保存成功！"});
                        }else{
                            $.topTip({mark:"warn",content:"发明专利保存失败！"});
                        }
                    },
                    error:function(){}
                });
            });
        },
        del:function(){
            var t=this;
            $(".patent_delBtn").off("click").on("click",function(){
                var $obj = $(this).parents(".patent_list");
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
                        $.topTip({mark: "success", content: "发明专利删除成功！"});
                    },
                    error:function(){//ajax请求失败后执行的方法(可不传)
                        $.topTip({mark: "warn", content: "发明专利删除失败！"});
                    }
                });
            });
        }
    };

    patent.init();
})
