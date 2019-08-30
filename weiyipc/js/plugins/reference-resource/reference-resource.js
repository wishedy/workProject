/**
 * 功能描述：  评论引用资源
 * 使用方法:
 * 注意事件：
 * 引入来源：  作用：
 *
 * Created by LiChunHui on 2016/6/12.
 */
;(function($){
    $.fn.extend({
        "referenceResource":function(options){
            var $this=$(this);
            var controller={
                config : {
                    myFellowSize:100,//我的关注人列表
                    pageSize:20//默认列出20个搜索资源的结果
                },
                path : {
                    myFellowUrl:PC_CALL+"customer/follow_people/json_list/",
                    resourceUrl:PC_CALL+"customer/quote/json_list/"
                },
                el : {
                	resource:$this.find(".btn_place"),//存放引用资源button位置
                	resourceText:$this.find(".peferRes_text")//存放引用资源显示位置
                },
                template : {
                    resourceHtml:'<div class="at_rs_bg Ev-resourceBtn">引用资源</div>',
                    resourceTextHtml:'<div class="tx_who_look">'+
                    '<div class="tx_title">引用资源</div>'+
                    '<div class="tx_text Ev-resourceName">' +

                    '</div>'+
                    '<input type="text" class="resourceInput Ev-resourceInput" placeholder="请在此搜索资源信息"/>'+
                    '<div class="clear"></div>'+
                    '<div class="at_personal_name Ev-rsCon">'+
                    '<ul class="Ev-resourceList">'+

                    '</ul>'+
                    '</div>'+
                    '</div>'
                },
                init:function(options){
                    var t=this;
                    this.options={};
                    var o={};
                    this.options= $.extend(o,options);
                    this.el.resource.append(t.template.resourceHtml);
                    this.el.resourceText.append(t.template.resourceTextHtml);
                    this.bindPeferResBtn();
                },
                getResource:function(data){
                    var html="";
                    $.each(data,function(i,val){
                        resourceName=comm.getStrLen(val.resourceName,35);
                        html+='<li typeId="'+val.type_id+'" resourceId="'+val.resourceId+'" resourceName="'+comm.getStrLen(val.resourceName,60)+'">'+
                        '<div class="at_rs_con font_yahei"><span class="at_rs_type">【'+val.type_name+'】</span><span class="at_rs_title">'+resourceName+'</span><span class="at_rs_name">'+comm.getStrLen(val.customerName,16)+'</span><span>'+comm.getStrLen(val.company,20)+'</span></div>'+
                        '<div class="clear"></div>'+
                        '</li>';
                    });
                    return html;
                },
                //引用资源按钮
                bindPeferResBtn:function(){
                    var t=this;
                    var resourceInput=$this.find(".Ev-resourceInput");
                    $(".Ev-resourceBtn").on("mouseover",function(){
                        $(this).addClass("at_rs_bg_hover");
                    });
                    $(".Ev-resourceBtn").on("mouseout",function(){
                        $(this).removeClass("at_rs_bg_hover");
                    });
                    $(".Ev-resourceBtn").on("click",function(){
                        $(this).addClass("at_rs_bg_hover");
                        t.el.resourceText.show()
                        //resourceInput.focus();
                        return false;
                    });
                    t.inputChange(resourceInput);
                    t.remove(resourceInput);
                    t.docClick();
                },
                inputChange : function(obj){
                    var t=this;
                    var val = "",val2 = "",changeInterval;
                    obj.on("focus",function(){
                        changeInterval = setInterval(function(){
                            val2 = obj.val();
                            if(val !== val2){
                                changeHandler();
                            }
                        },500);
                    });
                    obj.on("blur",function(){
                        clearInterval(changeInterval);
                    });
                    obj.on("change",function(){
                        if(val !== val2){
                            changeHandler();
                        }
                    });
                    function changeHandler(){
                        if(obj.val()!==""){
                            var data={
                                customerId: t.options.customerId,
                                queryPara:obj.val(),
                                pageIndex:1,
                                pageSize: t.config.pageSize,
                                visitSiteId:1,
                                appVersion:3110
                            };
                            var param={};
                            param.paramJson= $.toJSON(data);
                            $.ajax({
                                type : "post",
                                url : t.path.resourceUrl,
                                data : param,
                                dataType : "json",
                                success : function(rep){
                                    val = val2;
                                    if(rep&&rep.responseObject.responseData.data_list&&rep.responseObject.responseData.data_list.length>0) {
                                        $this.find(".Ev-rsCon").show();
                                        $this.find(".Ev-resourceList").html(t.getResource(rep.responseObject.responseData.data_list));
                                        t.hover();
                                        t.bindLiClick();
                                    }

                                },
                                error:function(){

                                }
                            });
                        }
                    }

                },
                bindLiClick : function(){
                    var t=this;
                    $this.find(".Ev-rsCon li").each(function(i,em){
                        $(em).on("click",function(){
                            $this.find(".Ev-resourceName").html('<span quoteTypeId="'+$(em).attr("typeId")+'" resourceId="'+$(em).attr("resourceId")+'">'+$(em).attr("resourceName")+'</span>');
                            $this.find(".Ev-resourceInput").val("").attr("placeholder","");
                            $this.find(".Ev-rsCon").hide();
                            $this.find(".Ev-resourceList").empty();
                            t.options.callback()&&t.options.callback();
                            return false;
                        });
                    });
                },
                hover : function(){
                    $this.find(".Ev-rsCon li").each(function(i,em){
                        $(em).on("mouseover",function(){
                            $this.find(".Ev-rsCon li").removeClass("hover");
                            $(this).addClass("hover");
                        });

                    });
                },
                docClick : function(){
                    $(document).bind("click",function(){
                        $this.find(".Ev-rsCon").hide();
                        $this.find(".Ev-resourceList").empty();
                    });
                },
                remove : function(obj) {
                    var t=this;
                    obj.keydown(function (ev) {
                        //alert(ev.keyCode);   //13:enter键,188:逗号
                        if(ev.keyCode == "13"){
                            ev.preventDefault();
                            return false;
                        }else if (ev.keyCode == "8"){//删除
                            if (obj.val() === "") {
                                $this.find(".Ev-resourceName").empty();
                                $this.find(".Ev-resourceInput").attr("placeholder","请在此搜索资源信息");
                                t.options.callback&&t.options.callback();
                            }
                        }

                    });
                },
                mouse : function(){
                    $this.find(".tx_who_look").on("mouseover",function(){
                        $(this).addClass("tx_who_look_hover");
                    }).on("mouseout",function(){
                        $(this).removeClass("tx_who_look_hover");
                    });
                }
            };
            controller.init(options);
        }
    })
})(jQuery);
