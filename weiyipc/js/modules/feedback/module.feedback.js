/**
 * 功能描述：  反馈
 * 使用方法:   module.feedback({suggestionType:3})
 * 注意事件：
 * 引入来源：comm.func , comm.light, $.topTip comm.textChange.js  作用：
 *
 * Created by LiChunHui on 2016/11/10.
 */
module.feedback=function(obj){
    var container= {
        opt: {
            wordTotal: 500, //字符总数
            zIndex: 9, //层级
            backgroundOpacity: 70, //背景透明度
            backgroundColor: "#000000" //背景颜色
        },
        path:{
            sugSubmit: PC_CALL+"customer/suggestion/create/"//意见反馈
        },
        init: function(obj){
            var _this= this;
            $.extend(_this.opt, obj);

            //遮罩结构居中 
            comm.LightBox.show(_this.opt.backgroundOpacity, _this.opt.backgroundColor);
            $("body").append(this.template());
            comm.setCenter($(".al_feedback_main"));
            //事件埋点
            comm.creatEvent({
                triggerType:"吐槽",
                keyword:"我要吐槽",
                actionId:80
            });
            //初始化事件
            _this.eventCenter.init(_this);
        },
        template: function(){
            var t=this;
            return '<div class="al_feedback_main" style="z-index:'+ t.opt.zIndex+'">'+
                '<div class="al_feedback_titleMain">'+
                '<div class="al_feedback_title">我要报错</div>'+
                '<div class="al_feedback_close ev_feedbackclose"><img src="//img10.allinmd.cn/errorReport/repBut.png"></div>'+
                '</div>'+
                '<div class="al_feedback_content">'+
                '<div class="al_feedback_textarea">'+
                '<textarea max="'+ t.opt.wordTotal+'" placeholder="请告诉我们你的想法" class="ev_suggestion"></textarea>'+
                '<span class="ev_feedbackNum">'+ t.opt.wordTotal+'</span>'+
                '</div>'+
                '<div class="al_feedback_submit">'+
                '<div class="al_feedback_sure Ev-ClickSubmit">发送</div>'+
                '<div class="al_feedback_cancel ev_feedbackclose">取消</div>'+
                '</div>'+
                '</div>'+
                '</div>';
        },
        eventCenter: {
            init: function(t){
                var _this= this;
                _this.textAreaWordTotal(t);
                _this.submitIsActive(t);
                _this.closeWindow(t);
                _this.submit(t);
            },
            //字符总数
            textAreaWordTotal: function(t){
                var _this= this;
                $(".ev_suggestion").on("input", function(){
                    comm.textChange({"$tex":$(this),"$num":$(".ev_feedbackNum"),"noTop":1});
                });
            },
            submitIsActive: function(t){
                $(".ev_suggestion").on("input", function(){
                    var total= comm.getByteLen($.trim($(this).val()));
                    if(total > 0) {
                        $(".Ev-ClickSubmit").addClass("active").attr("data-lock", "false");
                    }else{
                        $(".Ev-ClickSubmit").removeClass("active").attr("data-lock", "true");
                    }
                });
            },
            closeWindow: function(t){ //关闭窗口
                $(".ev_feedbackclose").on("click", function(){
                    comm.LightBox.hide();
                    $(".al_feedback_main").remove();
                    if($(this).hasClass("al_feedback_close")){
                        actionId=43;
                        keyword="搜索无结果反馈关闭";
                    }else{
                        actionId=45;
                        keyword="搜索无结果反馈取消";
                    }
                    //事件埋点
                    comm.creatEvent({
                        triggerType:"全站功能按钮点击",
                        keyword:keyword,
                        actionId:actionId
                    });
                });
            },
            submit: function(t){ //提交信息
                var _this= t;
                $(".Ev-ClickSubmit").on("click", function(){
                    if($(this).attr("data-lock") === "false"){
                        $(this).attr("data-lock", "true").attr("data-status", "prohibitionAgainSubmit");
                        $(".ev_suggestion").attr("readonly","readonly");

                        function succ(result){
                            var t= this.currObj;
                            $.topTip({
                                mark: "success",
                                showTime: 3,
                                content: "感谢您的反馈，我们会尽快处理！",
                                callback: function(){

                                }
                            });
                            $(".al_feedback_close").trigger("click");
                        }

                        var dataParams= {};
                        dataParams.paramJson = $.toJSON({
                            customerId:$("#sesCustomerId").val(),
                            suggestion:$(".ev_suggestion").val(),
                            customerName:TempCache.getItem("userName")?TempCache.getItem("userName"):'',
                            suggestionType:_this.opt.suggestionType,
                            visitSiteId:1//1.PC 2.h5
                        });

                        $.ajax({url:_this.path.sugSubmit,type:"post",data:dataParams,currObj:t}).done(succ);

                    }
                });
            }
        }
    };

    container.init(obj);
};
