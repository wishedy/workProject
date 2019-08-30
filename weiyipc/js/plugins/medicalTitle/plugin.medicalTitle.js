/**
 * 功能描述：职称选择
 * 使用方法:
 * 注意事件：
 * 引入来源：  作用：
 *
 * Created by LiChunHui on 2015/4/10.
 */
;(function($){
    $.fn.extend({
        "medicalTitle" : function(options){
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
                    if($this.find(".p_l_zc_xl").length==0){
                        $this.append('<div class="p_l_zc_xl '+(t.options.en?"layerMedical":"")+'" style="display:none"><ul class="medical_con_list"></ul></div>');
                    }
                    this.getData();
                },
                getData:function(){
                    var t=this;
                    $.ajax({
                        type : "post",
                        url : t.path.medical,
                        async: false,
                        dataType : "json",
                        success : function(rep){
                            if(rep){
                                var html="";
                                $.each(rep,function(i,val){
                                    html+="<li><ul class='p_l_zc_xl_li'></ul></li>";
                                });
                                $this.find(".medical_con_list").html(html);

                                $.each($this.find(".medical_con_list ul"),function(i,em){
                                    var html2="";
                                    if(rep[i+1]){
                                        $.each(rep[i+1],function(i,val){
                                            html2+="<li class='medical_list_li' select-status='false' medicalid='"+val.id+"'>"+(t.options.en?val.medicalTitleEn:val.medicalTitle)+"</li>";
                                        });
                                    }
                                    html2+="<div class='clear'></div>";
                                    $this.find(".medical_con_list ul").eq(i).append(html2);
                                });
                                t.mouse();
                                t.listAction();
                            }
                        }
                    });
                },
                mouse:function(){
                    $this.on("mouseover",function(){
                        $this.find(".p_l_zc_xl").show();
                        $this.find(".p_l_zc_xl").css("bottom",-$this.find(".p_l_zc_xl").outerHeight());
                    });
                    $this.on("mouseout",function(){
                        $this.find(".p_l_zc_xl").hide();
                    });
                },
                listAction:function(){
                    var t=this;
                    $(".medical_con_list ul",$this).each(function(i,em){
                        $("li",$(em)).each(function(j,obj){
                            $(obj).on("mouseover",function(){
                                $("li",$(em)).removeClass("hover");
                                if($(this).attr("select-status")=="false"){
                                    $(this).addClass("hover");
                                }
                            });
                            $(obj).on("mouseout",function(){
                                $(this).removeClass("hover");
                            });
                            $(obj).on("click",function(){
                                var html="";
                                var str="";
                                if($(this).attr("select-status")=="false"){
                                    $("li",$(em)).attr("select-status","false");
                                    $("li",$(em)).removeClass("active");
                                    $(this).addClass("active");
                                    $(this).attr("select-status","true");
                                }else{
                                    $(this).removeClass("active");
                                    $(this).attr("select-status","false");
                                }
                                $(".medical_con_list ul li",$this).each(function(n,val){
                                    if($(val).attr("select-status")=="true"){
                                        html+=$(val).text()+"，";
                                        str+=$(val).attr("medicalid")+"_"+$(val).text()+",";
                                    }
                                });
                                t.options.container.html(html.substring(0,html.length-1));
                                t.options.container.attr("medicalTitle",str.substring(0,str.length-1));
                            });
                        });
                    });
                }
            };
            controller.init(options);
        }
    });
})(jQuery);



