/**
 * 功能描述：  新的专业领域选择
 * 使用方法:   //专业领域
             $("#area_par").areaExpertiseSelect({
                seledCon: $("#area_sed")//存放已选择的专业
             });
 * 注意事件：
 * 引入来源：  作用：
 *
 * Created by LiChunHui on 2016/8/4.
 */
;(function($){
    $.fn.extend({
        "areaExpertiseSelect" : function(options){
            var $this=$(this);
            var controller = {
                config : {

                },
                path : {
                    dataTag:PC_CALL+"commdatas/tag/getDataTags/"
                },
                init : function(options){
                    var t=this;
                    this.options={};
                    var o = {callback:function(){}};
                    this.options = $.extend(o,options);
                    $this.css("position","relative");
                    html='<section class="al-tagSelectorBox hide ev-tagBox">'+
                    '<header class="al-tagSelectorBoxTitle">'+
                    '选择专科领域'+
                    '<span class="al-tagSelectorBoxCloseBtn ev-tagCancel"></span>'+
                    '</header>'+
                    '<section class="al-tagSelectorItem ev-tagConList">'+

                    '</section>'+
                    '<footer class="al-tagSelectorBoxFootBtn">'+
                    '<button class="al-personalAdviceSubmit ev-tagSave">确定</button>'+
                    '<button class="al-personalAdviceCancel ev-tagCancel">取消</button>'+
                    '</footer>'+
                    '</section>';
                    if(!($this.find(".ev-tagBox").length>0)){
                        $this.append(html);
                    }
                    if(comm.areaData[t.options.platformId].length>0){
                        var html="";
                        $.each(comm.areaData[t.options.platformId],function(i,val){
                            html+='<button tagid="'+val.id+'" select-status="false">'+val.tagName+'</button>';
                        });
                        $this.find(".ev-tagConList").html(html);
                        t.mouse();
                        t.listAction();
                    }else {
                        t.getData();
                    }
                },
                getData:function(){
                    var t=this;
                    var data={"pageIndex":1,"pageSize":50,"treeLevel":"2","platformId": t.options.platformId};
                    $.ajax({
                        type : "post",
                        url : t.path.dataTag,
                        data:{paramJson: $.toJSON(data)},
                        async: false,
                        dataType : "json",
                        success : function(rep){
                            if(rep){
                                if(t.options.platformId==1){
                                    comm.areaData['1']=rep.responseObject;
                                }else {
                                    comm.areaData['2']=rep.responseObject;
                                }
                                var html="";
                                $.each(rep.responseObject,function(i,val){
                                    html+='<button tagid="'+val.id+'" select-status="false">'+val.tagName+'</button>';
                                });
                                $this.find(".ev-tagConList").html(html);
                                t.mouse();
                                t.listAction();
                            }
                        }
                    });
                },
                mouse:function(){
                    var timer=null;
                    var t=this;
                    $this.find('#ev-areaSed').on("mouseover",function(){
                        timer=setTimeout(function(){
                            $this.find(".ev-tagBox").show();
                        },300);
                        t.options.mouseoverFn&&t.options.mouseoverFn();
                    });
                    $this.on("mouseout",function(){
                        clearTimeout(timer);
                    })
                },
                listAction:function(){
                    var t=this;
                    var html="";
                    $(".ev-tagConList button",$this).each(function(i,em){
                        $(em).on("click",function(){

                            if($(this).attr("select-status")=="false"){
                                $(this).addClass("active");
                                $(this).attr("select-status","true");
                            }else{
                                $(this).removeClass("active");
                                $(this).attr("select-status","false");
                            }

                        });
                    });
                    $(".ev-tagSave",$this).on("click",function(){
                        html="";
                        $(".ev-tagConList button",$this).each(function(j,obj){
                            if($(obj).attr("select-status")=="true"){
                                tagId=$(this).attr("tagid");
                                html+='<div class="al-tableTagConfigItem tagName" tagid="'+tagId+'"><span style="margin:0;">'+$(this).text()+'</span><i class="ev-tagClose" tagid="'+tagId+'"></i></div>';
                            }
                        })
                        t.options.seledCon.html(html);
                        t.clearTag();
                        $this.find(".ev-tagBox").hide();
                        t.options.fn&&t.options.fn();
                    });
                    $(".ev-tagCancel",$this).off('click').on("click",function(){
                        comm.creatEvent({
                            triggerType:'全站功能按钮点击',
                            keyword:'取消',
                            actionId:45
                        });
                        $this.find(".ev-tagBox").hide();
                    });
                },
                clearTag:function(){
                    var t=this;
                    $(".ev-tagClose",t.options.seledCon).on("click",function(){
                        tagId=$(this).attr("tagId");
                        $(this).parent().remove();
                        t.clearDownSelector(tagId);
                        t.options.fn&&t.options.fn();
                        if($(".ev-tagConList .active").length==0){
                            $("#ev-areaSed").addClass("al-selectDefault").text("选择专业");
                        }
                    });

                },
                // 取消下拉学组的其中一个选中状态
                clearDownSelector:function(tagId){
                    var t=this;
                    $.each($(".ev-tagConList button"),function(i,em){
                        if($(em).attr("tagId")==tagId){
                            $(em).removeClass("active");
                            $(em).attr("select-status","false");
                        }
                    });
                }
            };
            controller.init(options);
        }
    });
})(jQuery);

