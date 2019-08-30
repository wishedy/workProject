/**
 * 功能描述：   确认弹窗（有弹窗标题，内容，确认和取消按钮）
 * 使用方法:    $.makeSurePopup({
 *                  title:"",//弹窗标题
 *                  content01:"",//弹窗内容字体会加粗 (可不传)
 *                  content:"",//弹窗内容
 *                  ensure:"确认",//确认按钮文字内容 默认 “确认”
 *                  cancel:"取消",//取消按钮文字内容 默认 “取消”
 *                  ensureClass:'al-msgDeleteConfirm',//确认按钮class
 *                  cancelClass:'al-msgDeleteCancel',//取消按钮class
 *                  url:"",//ajax请求接口（可不传，不传就不发请求）
 *                  param:"",//ajax请求参数(可不传)
 *                  toJSON:1,//传参是否为paramJSPN 0或1，默认为1
 *                  callback:function(){},//点击确认后执行的方法（有发送请求时，是请求成功后执行的方法)
 *                  error:function(){}//ajax请求失败后执行的方法(可不传)
 *             })
 * 注意事件：
 * 引入来源：  需要引入scss  /scss/components/_makeSurePopup.scss  在主文件编译   作用：
 *
 * Created by LiChunHui on 2016/8/6.
 */
$.makeSurePopup = function(obj){
    var controller = {
        init : function(obj){
            var t=this;
            this.options={};
            var o = {callback:function(){},toJSON:1,ensure:"确认",ensureClass:'al-msgDeleteConfirm',cancel:"取消",cancelClass:'al-msgDeleteCancel'};
            this.options = $.extend(o,obj);
            this.addHtml();
        },
        addHtml:function(){
            var t=this;
            html='<section class="al-msgDeleteModal ev-makeSurePopup" id="ev-makeSurePopup" style="z-index: 8">'+
            '<h2>'+ t.options.title+'<i class="icon-close ev-makeCancel"></i></h2>'+
            '<section class="al-msgDeleteContent">'+
            '<i class="al-iconAsk"></i>'+
            '<article class="'+(t.options.content01?'':'al-msgNoTitle')+'">'+
            (t.options.content01?'<h3>'+ t.options.content01+'</h3>':'')+
            '<span>'+ t.options.content+'</span>'+
            '</article>'+
            '</section>'+
            '<section class="al-msgDeleteBtn">'+
            '<button class="'+ t.options.ensureClass+' ev-makeSure">'+ t.options.ensure+'</button>'+
            '<button class="'+ t.options.cancelClass+' ev-makeCancel">'+ t.options.cancel+'</button>'+
            '</section>'+
            '</section>';

            comm.LightBox.show(75,"#3c3c3d");
            comm.LightBox.setZIndex(8);
            $("body").append(html);
            this.action();
        },
        action:function(){
            var t=this;
            //确认按钮
            $(".ev-makeSure").on("click",function(){
                comm.LightBox.hide();
                $(".ev-makeSurePopup").remove();
                if(t.options.url){
                    comm.LightBox.showloading();
                    var data = t.options.param;
                    var param = {};
                    if(t.options.toJSON){
                        param.paramJson= $.toJSON(data);
                    }else{
                        param=data;
                    }
                    $.ajax({
                        type : t.options.type?t.options.type:"post",
                        url : t.options.url,
                        data : param,
                        dataType : "json",
                        success : function(rep){
                            comm.LightBox.hideloading();
                            if (rep.responseObject.responseStatus) {
                                t.options.callback();
                            } else {
                                t.options.error();
                            }
                        },
                        error:function(){t.options.error();}
                    });
                }else{
                    t.options.callback();
                }

            })
            //取消
            $(".ev-makeCancel").on("click",function(){
                comm.LightBox.hide();
                $(".ev-makeSurePopup").remove();
                if($(this).hasClass("icon-close")){
                    actionId=43;
                    keyword="确认弹窗关闭";
                }else{
                    actionId=45;
                    keyword="确认弹窗取消";
                }
                //事件埋点
                comm.creatEvent({
                    triggerType:"全站功能按钮点击",
                    keyword:keyword,
                    actionId:actionId
                });
            })
        }
    };
    controller.init(obj);
};
