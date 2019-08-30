/**
 * 功能描述：  时分选择器
 * 使用方法:   $(obj).timeDivision({});
 * 注意事件：
 * 引入来源：  作用：
 *
 * Created by LiChunHui on 2016/11/24.
 */
;(function($){
    $.fn.extend({
        "timeDivision" : function(options){
            var $this=$(this);
            var controller = {
                config : {

                },
                template:{
                    hour:function(){
                        return '<ul class="al-webcast_selectHour ev_hourContent"></ul>';
                    },
                    minute:function(){
                        return '<ul class="al-webcast_selectHour al-webcast-selectMinute ev_minuteContent"></ul>';
                    }
                },
                init : function(options){
                    var t=this;
                    this.options={};
                    var o = {callback:function(){}};
                    this.options = $.extend(o,options);
                    if(!$this.find(".ev_hourContent").length){
                        this.initDom();
                    }
                    $this.on("click",function(){
                        $this.find(".ev_hourContent").show();
                        $this.find(".ev_minuteContent").hide();
                        return false;
                    });
                    $(document).on("click",function(){
                        $this.find(".ev_hourContent").hide();
                        $this.find(".ev_minuteContent").hide();
                    });
                    $this.find(".ev_minuteContent").on("click",function(ev){
                        ev.stopPropagation();
                        return false;
                    });
                    this.select();
                },
                //获取本地时间
                local_time : function(){
                    var local = new Date();
                    var hour = local.toTimeString().substr(0,2);
                    var minute = local.toTimeString().substr(3,2);
                    return {
                        hour:hour,
                        minute:minute
                    };
                },
                //结构初始化
                initDom:function(){
                    var t=this;
                    $this.append(t.template.hour());
                    var html="";
                    var time=this.local_time();
                    for(var i=0;i<24;i++){
                        var hour="";
                        if(i<10){
                            hour="0"+i;
                        }else{
                            hour=i;
                        }
                        if(hour<time.hour){
                            html+='<li>'+hour+':00</li>';
                        }else{
                            html+='<li class="al-maySelect" hour="'+hour+'">'+hour+':00</li>';
                        }
                    }
                    $this.find(".ev_hourContent").html(html);
                    $this.append(t.template.minute());
                },
                //选择
                select:function(){
                    var t=this;
                    $this.find(".ev_hourContent .al-maySelect").on("click",function(){
                        $this.find(".ev_hourContent .al-maySelect").removeClass("active");
                        $(this).addClass("active");
                        setTimeout(function(){
                            $this.find(".ev_hourContent").hide();
                            $this.find(".ev_minuteContent").show();
                        },300);
                        t.createSelectedItem($(this).attr("hour"));
                        return false;
                    })
                },
                // 选中后添加关键词
                createSelectedItem:function(hour){
                    var t=this;
                    var html="";
                    var time=this.local_time();
                    for(var i=0;i<12;i++){
                        var minute="";
                        if((i*5)<10){
                            minute="0"+(i*5);
                        }else{
                            minute=i*5;
                        }
                        if(minute<time.minute&&hour==time.hour){
                            html+='<li>'+hour+':'+minute+'</li>';
                        }else{
                            html+='<li class="al-maySelect">'+hour+':'+minute+'</li>';
                        }
                    }
                    $this.find(".ev_minuteContent").html(html);
                    $this.find(".ev_minuteContent .al-maySelect").on("click",function(){
                        $this.find(".ev_minuteContent .al-maySelect").removeClass("active");
                        $(this).addClass("active");
                        t.options.container.text($(this).text());
                        setTimeout(function(){
                            $this.find(".ev_minuteContent").hide();
                        },300);
                        return false;
                    })
                }

            };
            controller.init(options);
        }
    });
})(jQuery);

