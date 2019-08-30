/**
 * 功能描述：    查看原图
 * 使用方法:
 * 注意事件：
 * 引入来源：  作用：
 *
 * Created by LiuYuTao on 2015/3/10.
 */


module.viewOriginalImg = function (Obj) {
    var defaults = {
        topicId: null,
        caseId: null,
        reviewId: null,
        caseCategoryId: null,
        index: 0
    };
    var options = $.extend(defaults, Obj);

    var controller = {

        config: {},
        path: {
            caze: PC_CALL+"case_attachment/json_list/",       // 病例获取图片列表
            topic: PC_CALL+"topic/attachment/json_list/",      // 话题获取图片列表
            review: PC_CALL+"review/json_list_att/",      // 话题获取图片列表
            reviewDoc:PC_CALL+"cms/pdf/pic/json_list/"      //2018年6月7日新增文库查看图集
        },
        template: {},

        init: function (Obj) {
            var t = this;
            t.currentIndex = options.index;
            t.dialog = $("#container");
            t.topContainer = t.dialog.find(".view_img_top");
            t.picContainer = t.dialog.find(".view_img_tp");
            t.top = $(".view_big_img_center");
            t.bottom = $("#imgShowContainer");

            t.checkImgListType();
            t.getImgList();
            t.changeSize();
            t.bindChangeSize();
        },
        initImgList: function () {
            var t = this;
            var maxUlConWidth = t.dialog.find(".view_img_top").outerWidth(true) - t.topContainer.find(".prev").outerWidth(true) -  // 图片列表的父级容器可允许的最大宽度
                t.topContainer.find(".next").outerWidth(true);
            if (t.topContainer.find("ul.scroll").width() > maxUlConWidth) {     // 图片列表的长度 超出最大长度
                t.topContainer.find(".view_img_top_cont").width(maxUlConWidth);
            } else {                                                            // 未超出
                t.topContainer.find(".view_img_top_cont").width(t.topContainer.find("ul.scroll").width());
                t.topContainer.find(".prev,.next").addClass("disable");
            }

            t.scrollbox = t.dialog.find("#vbi-scrollList").scrollBox({             // 调用滚动插件
                numToMove: Math.floor(maxUlConWidth / 85),  // 每次滑动的个数
                liClickHdl: function (li) {
                    var img = $(li).find("img");
                    var imgObj = {
                        index: $(li).index(),
                        src: img.attr("src"),
                        title: img.attr("title")
                    };
                    $(li).addClass("active").siblings(".active").removeClass("active");
                    t.changeImg(imgObj);        // 切换图片
                }
            });

            t.dialog.find("#vbi-scrollList li:eq(" + options.index + ")").click();    // 默认点击第一项
        },
        checkImgListType: function () {
            var t = this;
            t.values = {};
            t.values.caseId = options.caseId;
            t.values.topicId = options.topicId;
            t.values.reviewId = options.reviewId;
            t.values.caseCategoryId = options.caseCategoryId;

            t.values.refType = options.refType;
            t.values.refId = options.refId;

            if (t.values.topicId != undefined && t.values.topicId != null) {
                t.imgListType = "topic";
            }
            if (t.values.reviewId != undefined && t.values.reviewId != null) {
                t.imgListType = "review";
            }
            if (t.values.caseId != undefined && t.values.caseId != null) {
                t.imgListType = "caze";
            }
            if(t.values.refId != undefined) {
                t.imgListType = "reviewDoc";
            }
        },
        /**
         * 获取某类型的图片属性名称
         * @param type 类型
         */
        getPicKey: function (type) {
            var obj = {
                topic: "topicAttUrl",
                caze: "attUrl",
                review: "reviewAttUrl",
                reviewDoc:'attUrl'
            };
            return obj[type];
        },
        /**
         * 组装上送参数
         * @param type 类型
         * @returns {{}}
         */
        getParam: function (type) {
            var t = this;
            var rst = {};
            switch (type) {
                case "topic":
                    rst = {
                        topicId: t.values.topicId,
                        topicAttType: 9,
                    };

                    break;
                case "caze":
                    rst = {
                        caseId: t.values.caseId,
                        caseAttType: 9
                    };
                    if(t.values.caseCategoryId!=undefined){
                        rst.caseCategoryId=t.values.caseCategoryId;
                    }
                    break;
                case "review":
                    rst = {
                        reviewId: t.values.reviewId,
                        reviewAttType: 9
                    };
                    break;
                case "reviewDoc":
                    rst = {
                        resourceId: t.values.refId,
                        resourceType: t.values.refType,
                        pageIndex: 1,
                        pageSize: 10000,
                        sortType:3
                    };
                    break;
            }
            rst.attUseFlag = 2;
            if (type != "caze") {
                rst = {paramJson: $.toJSON(rst)};
            }
            return rst;
        },
        //获取图片列表
        getImgList: function () {
            var t = this;
            $.ajax({
                url: t.path[t.imgListType],
                data: t.getParam(t.imgListType),
                type: t.imgListType == "caze" ? "GET" : "POST",
                async: false,
                success: function (data) {
                    if (data && data.responseObject && data.responseObject.responseStatus && data.responseObject.responseData) {
                        var rst = data.responseObject.responseData.data_list;
                        var html = "";
                        t.pictureSize = rst.length;
                        /*$.map(rst, function (elem, i) {
                            html += "<li><div class='small_img_mr'></div>" +
                                "   <img src='" + elem.attUrl + "' title='" + (elem.caseAttName || "") + "' /></li>";
                        });*/
                        $.map(rst, function (elem, i) {
                            html += "<li><div class='small_img_mr'></div>" +
                                "   <img src='" + elem[t.getPicKey(t.imgListType)] + "' title='" + (elem.caseAttName || "") + "' uploadTime='" + (elem.uploadTime && elem.uploadTime) + "' /></li>";
                        });
                        t.dialog.find("ul.scroll").html(html);

                        t.liOuterWidth = t.dialog.find("ul.scroll li:eq(0)").outerWidth(true);
                        t.dialog.find("ul.scroll").css({
                            width: 85 * (t.pictureSize-1)+103+15* (t.pictureSize)
                            //width: 85 * (t.pictureSize)+20* (t.pictureSize)
                        });

                        t.initImgList();
                    }
                }
            });
        },
        changeImg: function (imgObj) {
            var t = this;
            $("#imgShowContainer").html("<img src='" + imgObj.src + "' />");
        },
        changeSize: function () {
            var t = this;
            var height = $(window).height() - t.top.outerHeight(true) - parseInt(t.bottom.css("marginTop")) - parseInt(t.bottom.css("paddingTop")) * 2 - 5;
            t.bottom.height(height);
        },
        bindChangeSize: function () {
            var t = this;
            $(window).on("resize", function () {
                t.changeSize();
            });
        }
    };

    controller.init(Obj);

};