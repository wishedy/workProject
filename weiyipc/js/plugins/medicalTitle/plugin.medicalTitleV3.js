/**
 * 功能描述：  新的职称选择
 * 使用方法:   //职称的选择
              $("#occmed_par").medicalTitleV3({
                 container:$("#occmed_title"),//存放已选择的职称
                 defaultHide:1//默认隐藏  选择医师展开
              });
 * 注意事件：
 * 引入来源：  作用：
 *
 * Created by LiChunHui on 2016/8/4.
 */
;(function($){
    $.fn.extend({
        "medicalTitleV3" : function(options){
            var $this=$(this);
            var controller = {
                config : {

                },
                path : {
                    medical:PC_CALL+"commdata/getMedicalTitleList/"
                },
                init : function(options){
                    var t=this;
                    this.options={};
                    var o = {callback:function(){}};
                    this.options = $.extend(o,options);
                    $this.css("position","relative");
                    html='<section class="al-tagSelectorBox ev-medicalBox" style="display: none">'+
                    '<header class="al-tagSelectorBoxTitle">选择职称'+
                    '<span class="al-tagSelectorBoxCloseBtn ev-medCancel"></span>'+
                    '</header>'+
                    '<section class="al-tagSelectorItem ev-medicalConList">'+

                    '</section>'+
                    '<footer class="al-tagSelectorBoxFootBtn">'+
                    '<button class="al-personalAdviceSubmit ev-medSave">确定</button>'+
                    '<button class="al-personalAdviceCancel ev-medCancel">取消</button>'+
                    '</footer></section>'
                    if(!($this.find(".ev-medicalBox").length>0)){
                        $this.append(html);
                    }

                    this.getData();
                },
                getData:function(){
                    var t=this;
                    $.ajax({
                        type : "post",
                        url : t.path.medical,
                        data:{paramJson: $.toJSON({pageIndex:1,pageSize:100})},
                        async: false,
                        dataType : "json",
                        success : function(rep){
                            if(rep){
                                var html="";
                                var newArr=[];
                                $.each(rep,function(i,val){
                                    newArr[i-1]=i;
                                });
                                $.each(newArr,function(i,val){
                                    if(t.options.defaultHide){
                                        if(i==0){
                                            html+='<article class="al-tagSelectorList"></article>';
                                        }else{
                                            html+='<article class="al-tagSelectorList hide"></article>';
                                        }
                                    }else{
                                        html+='<article class="al-tagSelectorList"></article>';
                                    }
                                });
                                $this.find(".ev-medicalConList").html(html);

                                $.each($this.find(".ev-medicalConList article"),function(i,em){
                                    var html2="";
                                    $.each(rep[i+1],function(i,val){
                                        html2+="<span class='ev-medicalLiList' select-status='false' medicalid='"+val.id+"'>"+(t.options.en?val.medicalTitleEn:val.medicalTitle)+"</span>";
                                    });
                                    //修改
                                    if(i==0){
                                        html2 += "<span class='ev-medicalLiList' select-status='false' medicalid='0'>其它</span>";
                                    }
                                    $this.find(".ev-medicalConList article").eq(i).append(html2);
                                });
                                t.mouse();
                                t.listAction();
                            }
                        }
                    });
                },
                mouse:function(){
                    var timer=null;
                    var t=this;
                    var par=$this.find('#ev-medTitle').length>0?$this.find('#ev-medTitle'):$this;
                    par.on("mouseover",function(){
                        t.options.mouseoverFn&&t.options.mouseoverFn();
                        timer=setTimeout(function() {
                            $this.find(".ev-medicalBox").show();
                            if($(".ev-tagBox").length>0){
                                $(".ev-tagBox").hide();
                            }
                        },300);
                    });
                    $this.on("mouseout",function(){
                        clearTimeout(timer);
                    });
                },
                listAction:function(){
                    var t=this;
                    var html="";
                    var str="";
                    $(".ev-medicalConList article",$this).each(function(i,em){
                        $("span",$(em)).each(function(j,obj){
                            /*$(obj).on("mouseover",function(){
                                $("span",$(em)).removeClass("hover");
                                if($(this).attr("select-status")=="false"){
                                    $(this).addClass("hover");
                                }
                            });
                            $(obj).on("mouseout",function(){
                                $(this).removeClass("hover");
                            });*/
                            $(obj).on("click",function(){
                                html="";
                                str="";
                                if($(this).attr("select-status")=="false"){
                                    //修改
                                    if($(this).attr("medicalid")!=0){
                                        $("span", $(em)).attr("select-status", "false");
                                        $("span", $(em)).removeClass("active");
                                        $(this).addClass("active");
                                    }

                                    $(this).attr("select-status","true");
                                    if(t.options.defaultHide){
                                        if($(this).attr("medicalid")==0||$(this).attr("medicalid")==3||$(this).attr("medicalid")==4){//选择主任医师和副主任医师
                                            $(".ev-medicalConList article",$this).show();
                                        }else{
                                            if(i==0){
                                                $(".ev-medicalConList article:gt(0)",$this).hide();
                                                $(".ev-medicalConList article:gt(0) span",$this).removeClass("active").attr("select-status","false");
                                            }

                                        }
                                    }
                                }else{
                                    $(this).removeClass("active");
                                    $(this).attr("select-status","false");
                                    if(t.options.defaultHide){
                                        if($(this).attr("medicalid")==0||$(this).attr("medicalid")==3||$(this).attr("medicalid")==4){//选择主任医师和副主任医师
                                            $(".ev-medicalConList article:gt(0)",$this).hide();
                                            $(".ev-medicalConList article:gt(0) span",$this).removeClass("active").attr("select-status","false");
                                        }
                                    }
                                }
                                $(".ev-medicalConList article span",$this).each(function(n,val){
                                    if($(val).attr("select-status")=="true"&&$(val).attr("medicalid")>0){
                                        html+=$(val).text()+"，";
                                        str+=$(val).attr("medicalid")+"_"+$(val).text()+",";
                                    }
                                });

                            });
                        });
                    });
                    $(".ev-medSave",$this).on("click",function(){
                        t.options.container.html(html.substring(0,html.length-1));
                        t.options.container.attr("medicalTitle",str.substring(0,str.length-1));
                        $this.find(".ev-medicalBox").hide();
                        t.options.fn&&t.options.fn();
                    });
                    $(".ev-medCancel",$this).on("click",function(){
                        $this.find(".ev-medicalBox").hide();
                        if($(this).hasClass("al-tagSelectorBoxCloseBtn")){
                            //事件埋点
                            comm.creatEvent({
                                triggerType:"全站功能按钮点击",
                                keyword:"职称选择弹层关闭",
                                actionId:43
                            });
                        }else{
                            //事件埋点
                            comm.creatEvent({
                                triggerType:"全站功能按钮点击",
                                keyword:"职称选择弹层取消",
                                actionId:45
                            });
                        }
                    })
                }
            };
            controller.init(options);
        }
    });
})(jQuery);
