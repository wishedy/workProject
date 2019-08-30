/**
 * 功能描述：  评论引用资源
 * 使用方法:
 * 注意事件：
 * 引入来源：  作用：
 *
 * Created by LiChunHui on 2016/6/12.
 */
;
(function($) {
    $.fn.extend({
        "referenceResource": function(options) {
            var $this = $(this);
            var controller = {
                config: {
                    myFellowSize: 100, //我的关注人列表
                    pageSize: 30 //默认列出30个搜索资源的结果
                },
                path: {
                    myFellowUrl: PC_CALL + "customer/follow_people/json_list/",
                    resourceUrl: PC_CALL + "customer/quote/json_list/"
                },
                el: {
                    resource: $this.find(".btn_place"), //存放引用资源button位置
                    resourceText: $this.find(".peferRes_text") //存放引用资源显示位置
                },
                template: {
                    resourceHtml: '<li class="at_bg Ev-resourceBtn al-commentBtnItem">' +
                        '<i class="al-commentBtnImg al-commentQuote"></i> 引用' +
                        '</li>',
                    // resourceTextHtml: '<article class="tx_who_look al-commentQuoteContent">' +
                    //     '<span style="float:left;">引用资源</span>' +
                    //     '<article class="tx_text Ev-resourceName">' +
                    //     '</article>' +
                    //     '<input type="text" class="resourceInput Ev-resourceInput" style="border: none;"/>' +
                    //     //'<div class="clear"></div>'+
                    //     '<article class="at_personal_name Ev-rsCon">' +
                    //     '<ul class="Ev-resourceList">' +

                    //     '</ul>' +
                    //     '</article>' +
                    //     '</section>'


                    /*
                     *样式结构更新
                     *Fixed by qiangkailiang on 2016/08/17
                     */
                    resourceTextHtml: '<article class="tx_who_look al-commentQuoteContent">' +
                        '<span class="al-resourceTitle">引用资源</span>' +
                        '<article class="tx_text Ev-resourceName">' +
                        '</article>' +
                        '<input type="text" class="resourceInput Ev-resourceInput" style="border: none;" placeholder="请在此搜索资源信息"/>' +
                        '<section class="al-commentQuoteSearch Ev-rsCon">' +
                        '<section class="al-commentQuoteSearchInner">' +
                        '<section class="al-commentQuoteItemBox Ev-resourceList">' +
                        // Here's Content!
                        '</section>' +
                        '</section>' +
                        '</section>'+
                        '</article>'
                },
                init: function(options) {
                    var t = this;
                    this.options = {};
                    var o = {};
                    this.options = $.extend(o, options);
                    this.el.resource.append(t.template.resourceHtml);
                    this.el.resourceText.append(t.template.resourceTextHtml);
                    this.bindPeferResBtn();
                },
                getResource: function(data) {
                    var html = "";
                    $.each(data, function(i, val) {
                        resourceName = comm.getStrLen(val.resourceName, 35);

                        // html += '<li typeId="' + val.type_id + '" resourceId="' + val.resourceId + '" resourceName="' +
                        //     comm.getStrLen(val.resourceName, 60) + '">' +
                        //     '<div class="at_rs_con font_yahei"><span class="at_rs_type">[' +
                        //     val.type_name + ']</span><span class="at_rs_title">' +
                        //     resourceName + '</span><span class="at_rs_name">' +
                        //     comm.getStrLen(val.customerName, 16) + '</span><span>' +
                        //     comm.getStrLen(val.company, 20) +
                        //     '</span></div>' + '</li>';

                        /*
                         *样式结构更新
                         *Fixed by qiangkailiang on 2016/08/17
                         */
                        html += '<section class="al-commentQuoteSearchItem" typeId=' + val.type_id +
                            '" resourceId="' + val.resourceId + '>' +
                            '"resourceName="' + comm.getStrLen(val.resourceName, 60) + '">' +
                            '<span class="al-commentQuoteSearchClass">' +
                            val.type_name +
                            '</span>' +
                            '<article class="al-commentQuoteSearchContent al-commentQuoteSearchContentReaded">' +
                            '<h2>' + resourceName +
                            // '<span class="al-commentQuoteSearchContentReadedTips"><b></b>已浏览</span>' +
                            '</h2>' +
                            '<p><em class="al-contentAuthor"></em>' + comm.getStrLen(val.ownerNameStr, 16) + '</p>' +
                            '</article>' +
                            '</section>';
                    });
                    return html;
                },
                //引用资源按钮
                bindPeferResBtn: function() {
                    var t = this;
                    var resourceInput = $this.find(".Ev-resourceInput");
                    $(".Ev-resourceBtn").on("mouseover", function() {
                        $(this).addClass("at_rs_bg_hover");
                    });
                    $(".Ev-resourceBtn").on("mouseout", function() {
                        $(this).removeClass("at_rs_bg_hover");
                    });
                    $(".Ev-resourceBtn").on("click", function() {

                        $(this).addClass("at_rs_bg_hover");
                        t.el.resourceText.show();
                        /**
                         * 处理终端页下面评论引用资源不能完全显示问题 -sunhaibin
                         * */
                        var maxH = $(document).height()-t.el.resourceText.offset().top-100;
                        if(maxH<400){
                            t.el.resourceText.find('.Ev-rsCon').css('maxHeight',maxH);
                        }
                            //resourceInput.focus();
                        return false;
                    });
                    t.inputChange(resourceInput);
                    t.remove(resourceInput);
                    t.docClick();
                },
                inputChange: function(obj) {
                    var t = this;
                    var flag = true;
                    var timer = null;
                    obj.on('compositionstart',function(){
                        flag = false;
                    });
                    obj.on('compositionend',function(){
                        flag = true;
                    });
                    obj.on("input propertychange",function(){
                        clearTimeout(timer);
                        timer=setTimeout(function(){
                            if(obj.val()&&flag){
                                changeHandler();
                            }
                        },500);
                    });
                    function changeHandler() {
                        if (obj.val() !== "") {
                            var data = {
                                customerId: t.options.customerId,
                                queryPara: obj.val(),
                                pageIndex: 1,
                                pageSize: t.config.pageSize,
                                visitSiteId: 1,
                                appVersion:3110
                            };
                            var param = {};
                            param.paramJson = $.toJSON(data);
                            $.ajax({
                                type: "post",
                                url: t.path.resourceUrl,
                                data: param,
                                dataType: "json",
                                success: function(rep) {
                                    if (rep && rep.responseObject.responseData.data_list && rep.responseObject.responseData.data_list.length > 0) {
                                        $this.find(".Ev-rsCon").show();
                                        $this.find(".Ev-resourceList").html(t.getResource(rep.responseObject.responseData.data_list));
                                        t.hover();
                                        t.bindLiClick();
                                    }

                                },
                                error: function() {

                                }
                            });
                        }
                    }

                },
                bindLiClick: function() {
                    var t = this;
                    $this.find(".Ev-rsCon .al-commentQuoteSearchItem").each(function(i, em) {
                        $(em).on("click", function() {
                            $this.find(".Ev-resourceName").html('<span quoteTypeId="' + $(em).attr("typeId") + '" resourceId="' + $(em).attr("resourceId") + '">' + $(em).attr("resourceName") + '</span>');
                            $this.find(".Ev-resourceInput").val("").attr("placeholder", "");
                            $this.find(".Ev-rsCon").hide();
                            $this.find(".Ev-resourceList").empty();
                            t.options.callback() && t.options.callback();
                            return false;
                        });
                    });
                },
                hover: function() {
                    $this.find(".Ev-rsCon .al-commentQuoteSearchItem").each(function(i, em) {
                        $(em).on("mouseover", function() {
                            $this.find(".Ev-rsCon li").removeClass("hover");
                            $(this).addClass("hover");
                        });

                    });
                },
                docClick: function() {
                    $(document).bind("click", function() {
                        $this.find(".Ev-rsCon").hide();
                        $this.find(".Ev-resourceList").empty();
                    });
                },
                remove: function(obj) {
                    var t = this;
                    obj.keydown(function(ev) {
                        //alert(ev.keyCode);   //13:enter键,188:逗号
                        if (ev.keyCode == "13") {
                            ev.preventDefault();
                            return false;
                        } else if (ev.keyCode == "8") { //删除
                            if (obj.val() === "") {
                                $this.find(".Ev-resourceName").empty();
                                $this.find(".Ev-resourceInput").attr("placeholder", "请在此搜索资源信息");
                                t.options.callback && t.options.callback();
                            }
                        }

                    });
                },
                mouse: function() {
                    $this.find(".tx_who_look").on("mouseover", function() {
                        $(this).addClass("tx_who_look_hover");
                    }).on("mouseout", function() {
                        $(this).removeClass("tx_who_look_hover");
                    });
                }
            };
            controller.init(options);
        }
    })
})(jQuery);
