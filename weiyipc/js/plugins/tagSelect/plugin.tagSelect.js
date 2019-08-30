/**
 * 功能描述：
 * 使用方法:  $("#group").tagSelect({
                    parCon:"#group_edit_con",//父级
                    tagCon:"#group_data",//存放tag数据
                    tagName:"p_baseinfo_tag_text",//放tagName的class名
                    tagClose:"p_baseinfo_tag_close",//关闭按钮名
                    seledCon:"#group_edit_ul"//存放选着好后的tag
                });
 * 注意事件：
 * 引入来源：  作用：
 *
 * Created by LiChunHui on 2015/4/9.
 */
;(function($){
    $.fn.extend({
        "tagSelect" : function(options){
            var $this=$(this);
            var controller = {
                config : {

                },
                init : function(options){
                    var t=this;
                    this.options={};
                    var o = {callback:function(){}};
                    this.options = $.extend(o,options);
                    this.select();
                },
                select:function(){
                    var t=this;
                    $this.find(t.options.parCon).bind("mouseover",function(){
                        $this.find(t.options.tagCon).css("bottom",-$this.find(t.options.tagCon).outerHeight());
                        $this.find(t.options.tagCon).show();
                    });
                    $this.find(t.options.parCon).bind("mouseout",function(){
                        $this.find(t.options.tagCon).hide();
                    });
                    //下拉学组鼠标移入
                    $this.find(t.options.tagCon).find("li").live("mouseover",function(){
                        if($(this).attr("select-status")===undefined || $(this).attr("select-status")==="false"){//未选择
                            $this.find(t.options.tagCon).find("li").removeClass("active");
                            $(this).addClass("active");
                        }
                    });
                    //下拉学组鼠标移出
                    $this.find(t.options.tagCon).find("li").live("mouseout",function(){
                        $this.find(t.options.tagCon).find("li").removeClass("active");
                    });
                    //下拉学组鼠标点击
                    $this.find(t.options.tagCon).find("li").off("click").on("click",function(){
                        var tagName=$(this).text();
                        var tagId=$(this).attr("tagId");

                        if($(this).attr("select-status")===undefined || $(this).attr("select-status")==="false"){//未选择
                            $(this).addClass("disable");
                            $(this).attr("select-status","true");
                            t.createSelectedItem(tagName,tagId);
                        }else{                                   //已选择
                            $(this).removeClass("disable");
                            $(this).attr("select-status","false");
                            t.clearTag(tagId);
                        }

                    });
                    $this.find(t.options.seledCon).find("."+t.options.tagClose).click(function(){
                        var tagId=$(this).prev().attr("tagId");
                        t.clearTag(tagId);
                        t.clearDownSelector($(this).prev());
                    });
                },
                // 选中后添加关键词
                createSelectedItem:function(keyName,tagId){
                    var t = this;

                    var el = $("<li><div class='"+ t.options.tagName+" tagName' tagId="+tagId+">"+keyName+"</div>"+
                    "<div class='"+ t.options.tagClose+"'><img src='//img00.allinmd.cn/personal/baseinfo_close.png' /></div>"+
                    "</li>");

                    el.find("."+t.options.tagClose).click(function(){
                        t.clearTag(tagId);
                        t.clearDownSelector(el.find(".tagName"));
                    });

                    $this.find(t.options.seledCon).append(el);
                },
                // 清除标签
                clearTag:function(tagId){
                    var t=this;
                    $.each($("li",$this.find(t.options.seledCon)),function(i,em){
                        if($(em).find(".tagName").attr("tagId")==tagId){
                            $(em).remove();
                        }
                    });

                },
                // 取消下拉学组的其中一个选中状态
                clearDownSelector:function(obj){
                    var t=this;
                    $.each($("ul li",$this.find(t.options.tagCon)),function(i,em){
                        if($(em).attr("tagId")===obj.attr("tagId")){
                            $(em).removeClass("disable");
                            $(em).attr("select-status","false");
                        }
                    });

                }
            };
            controller.init(options);
        }
    });
})(jQuery);


