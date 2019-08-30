/**
 * 功能描述：个人首页认证三部曲， 1.认证 2.选择关注的专业 3.推荐用户
 * 使用方法：module.trilogy(obj);
 *                  必要参数：opts callback ：关闭或关注完用户后执行的回调
 *
 * 注意事件：
 * 引入来源：
 * liuyutao
 */

module.trilogy = function (Obj) {
    var defaults = {
        container: "#trilogy",
        customerId: "",
        callback: function () {
            // TODO:显示您可能认识的人; 显示导航条
        }
    };
    var options = $.extend(defaults, Obj);
    var controller = {

        config: {
            recommendUserNum: 48
        },

        el: {
            main: $(options.container)
        },
        path: {
            profession: PC_CALL+"commdatas/tag/getDataTags/",
            getFollowProfessionCount: PC_CALL+"customer/follow_resource/getFollowCount/", // TODO 暂不用
            createProfession: PC_CALL+"customer/follow_resource/createFollowResource/", //添加专业
            createProfessionFollow: PC_CALL+"follow/createListFollow/", //添加专业同时，再给这个传一次值
            recommendUser: PC_CALL+"customer/recommendCustomerFirst/json_list/",   // 推荐用户列表
            createFollow: PC_CALL+"customer/follow_people/create/",      //
            getStatics: PC_CALL+"customer/index/getCustomerBaseInfo/"    // 用户统计信息
        },
        template: {
            one: function () {
                return '<div class="persanal_rz">' +
                    '       <div class="sf_rz_title font_yahei">认证你的医师身份</div>' +
                    '       <div class="sf_rz_text font_yahei">' +
                    '唯医是一个专业的医生社区，为了保障你的安全与权益，我们需要认证你的医师身份。' +
                    '认证身份需要你上传医师执业资格证或医学学位证等资料，请放心，你的资料是安全的。' +
                    '                   </div>' +
                    '   <div class="submit-btn action-auth">立即认证</div>' +
                    '</div>';
            },
            two: function () {
                return '<div class="persanal_rz">' +
                    '   <div class="sf_rz_title font_yahei">' +
                    '       <div class="x_zy_title">选择你关注的专业</div>' +
                    '       <div class="x_zy_title_checkbox action-choose">全选</div>' +
                    '       <div class="x_zy_title_close"></div>' +
                    '       <div class="clear"></div>' +
                    '   </div>' +
                    '   <div class="zy-list">' +
                    '       <ul></ul>' +
                    '   </div>' +
                    '   <div class="submit-btn  action-follow disable"><div>立即关注</div></div>' +
                    '</div>';
            },
            three: function () {
                return '<div class="persanal_rz" style="display:;">' +
                    '       <div class="sf_rz_title font_yahei">' +
                    '           <div class="x_zy_title">推荐用户</div>' +
                    '           <div class="x_zy_title_but">' +
                    '               <div class="x_zy_title_but_l disable prev"></div>' +
                    '               <div class="x_zy_title_but_r next"></div>' +
                    '               <div class="clear"></div>' +
                    '           </div>' +
                    '           <div class="x_zy_title_success">做得好！你已经入门了！</div>' +
                    '           <div class="x_zy_title_close"></div>' +
                    '           <div class="clear"></div>' +
                    '       </div>' +
                    '       <div class="p_tj_user">' +
                    '           <ul class="scroll"></ul>' +
                    '       </div>' +
                    '       <div class="p_gz_success_list">' +
                    '           <ul><li></li><li></li><li></li>' +
                    '               <li></li><li></li><li></li></ul>' +
                    '       </div>' +
                    '   </div>';
            },
            users: function (data) {
                var html = "";
                for (var i = 0; i < data.length; i++) {
                    var obj = data[i].recommend_customer;
	                if(i%4==0){
		                html += "<li><ul>";
	                }

                    html += '<li>' +
                        '	     <div class="p_tj_user_l"><img src="' + obj.recommendLogoSpec + '"></div>' +
                        '	     <div class="p_tj_user_r">' +
                        '	         <div class="p_tj_user_r_t">' + obj.recommendLastName + obj.recommendFirstName + '</div>' +
                        '	         <div class="p_tj_user_r_c">' + obj.recommendHospital + '</div>' +
                        '	         <div class="p_tj_user_r_b">' +
                        '               <div class="followBtn" customerId="' + obj.recommendCustomerId + '"></div>' +
                        '            </div>' +
                        '	     </div>' +
                        '	     <div class="clear"></div>' +
                        '	 </li>';
	                if((i+1)%4==0){
		                html += "</ul></li>";
	                }

                }
	            html += "</ul></li>";
                html += '<div class="clear"></div>';
                return html;
            }
        },
        init: function () {
            //验证是否认证过
            var t = this;
            var staticInfo = t.getStatic();     // 统计信息
            if (!staticInfo.isAuthSuccess) {    // 未认证
                t.stepOneInit();
            } else {                            // 已认证
                // 显示导航
                $(".personal_index_channel_fl").show();
                // 判断是否关注过专业
                if (!staticInfo.isFollowSpecialSuccess) {   // 若无 显示第二步 关注专业
                    t.stepTwoInit();
                } else {          // 若已关注过专业
                    if (!staticInfo.isFollowPeopleSuccess) {    // 若无关注过推荐用户
                        t.stepThreeInit();  // 显示 第三步 推荐关注专家
                    } else {
                        t.end();
                    }
                }
            }
        },
        getStatic: function () {
            var rst = {};
            var t = this;
            var param = {paramJson: $.toJSON({customerId: options.customerId, followType: 6})};
            $.ajax({
                url: t.path.getStatics,
                data: param,
                async: false,
                success: function (data) {
                    if (data.responseObject) {
                        rst.isAuthSuccess = data.responseObject.auth;
                        rst.isFollowSpecialSuccess = parseInt(data.responseObject.special_attention_num) > 0;
                        // rst.isFollowPeopleSuccess = data.responseObject.customerStatic.followpeopleNum >= 4;
                        rst.isFollowPeopleSuccess = data.responseObject.customerStatic.followOrgNum >= 4||data.responseObject.customerStatic.followpeopleNum >= 4;
                    }
                }
            });
            return rst;
        },
        /**
         * 第一步 认证初始化
         */
        stepOneInit: function () {
            var t = this;
            t.el.main.html(t.template.one());
            var rzBtn = t.el.main.find(".action-auth");
            rzBtn.on("click", function () {
	            

                user.login({               // 认证后
                    callback: function () {
                        t.stepTwoInit();  // 显示关注专业步骤
                        // 显示导航
                        $(".personal_index_channel_fl").show();
                    },
                    scene:privilegeSceneConst.eSceneTypeAuth
                });
            });
            t.bindClose();
        },
        /***
         * 第二步 显示关注专业
         */
        stepTwoInit: function () {
            var t = this;
            t.el.main.html(t.template.two());
            t.bindClose();
            var listEl = t.el.main.find("ul");
            listEl.html(t.getProfessionHtml());
            var followBtn = t.el.main.find(".action-follow");  // 关注按钮
            var allBtn = t.el.main.find(".action-choose");  // 全选按钮
            listEl.find("li").on("click", function () {
                $(this).toggleClass("on");
                if (listEl.find(".on").size() > 0) {
                    updateIds();
                    enableSubmitBtn();
                } else {
                    followBtn.off("click");
                    followBtn.addClass("disable");
                    t.dataId = "";
                    t.dataRefId = "";
                    disableSubmitBtn();
                }

            });

            allBtn.on("click", function () {                // 全选按钮
                if ($(this).hasClass("on")) {
                    listEl.find("li").removeClass("on");
                    disableSubmitBtn();
                } else {
                    listEl.find("li").addClass("on");
                    updateIds();
                    enableSubmitBtn();
                }
                $(this).toggleClass("on");
            });

            function updateIds() {
                var dataRefIds = [], dataIds = [];
                listEl.find(".on").map(function (index, el) {
                    dataIds.push($(el).find(".text").data("id"));
                    dataRefIds.push($(el).find(".text").data("refId"));
                });
                t.dataId = dataIds.join(",");
                t.dataRefId = dataRefIds.join(",");
            }


            function enableSubmitBtn() {          // 激活提交按钮
                followBtn.removeClass("disable");
                followBtn.off("click").on("click", function () {
                    t.submitFollowProfession();   // 提交关注操作
                });
            }

            function disableSubmitBtn() {         // 禁用按钮
                followBtn.off("click");
                followBtn.addClass("disable");
                t.professionIds = "";
            }


        },
        /***
         * 第三步 推荐用户
         */
        stepThreeInit: function () {
            var t = this;
            t.el.main.html(t.template.three());
            t.initRecommendUser();
            t.bindClose();
        },
        /**
         * 跳过三部曲
         */
        bindClose: function () {
            var t = this;
            t.el.main.find(".x_zy_title_close").on("click", function () {
                t.end();
            });
        },
        end: function () {
            var t = this;
            t.el.main.slideUp();
            $(".personal_index_channel_fl").show();
            options.callback();
        },
        /**
         * 提交关注专业
         */
        submitFollowProfession: function () {
            var t = this;
            var params = t.convertJSON("dataId");
            var params2 = t.convertJSON("dataRefId");
            $.ajax({
                url: t.path.createProfession,
                type: "POST",
                data: params,
                success: function (data) {
                    if (data.responseObject.responseStatus) {
                        /* $.ajax({
                         url: t.path.createProfessionFollow,
                         type: "POST",
                         data: params2,
                         success: function (data) {
                         if (data.responseObject.responseStatus) {  // 关注成功后*/
                        t.stepThreeInit();  // 第三步 关注推荐用户
                        /*         }
                         }
                         });*/
                    }
                }
            });
        },
	    /**
	     * 转换参数，生成paramJson格式的参数
	     * @param toType
	     * @returns {{}}
	     */
        convertJSON: function (toType) {
            var t = this;
            var params = {};
            var data = {};
            data.refId = t[toType];
            data.refName = t.getRefName(data.refId);
            if (toType == "dataId") {
                data.followType = 6;
            }
            params.paramJson = $.toJSON(data);
            return params;
        },
	    /**
	     *
	     * @param ids
	     * @returns {string}
	     */
        getRefName: function (ids) {
            var t = this;
            var idsAs = ids.split(",");
            var arr = [];
            for (var i = 0; i < idsAs.length; i++) {
                arr.push($.trim($("[data-id=" + idsAs[i] + "]").text()));
            }
            return arr.join(",");
        },
        /***
         * 生成学组列表
         */
        getProfessionHtml: function () {
            var html = "", params;
            var t = this;
            $.ajax({
                url: t.path.profession,
                type: "POST",
                data: params,
                async: false,
                success: function (data) {
                    $.each(data.responseObject, function (i, el) {
                        html += '<li>' +
                            '       <div class="text" data-refId="' + el.customerId + '" data-id="' + el.id + '">' + el.tagName + '</div><div class="li-close"></div>' +
                            '    </li>';
                    });
                }
            });
            html += "<div class='clear'></div>";
            return html;
        },
        /**
         * 获取关注的专业个数
         * */
        getFollowProfessionCount: function () {
            var t = this;
            var rst;
            var params = {};
            var pData = {};
            pData.followType = 6;
            params.paramJson = $.toJSON(pData);
            $.ajax({
                url: t.path.getFollowProfessionCount,
                type: "POST",
                data: params,
                async: false,
                success: function (data) {
                    rst = data.responseObject.responseMessage;
                }
            });
            return rst;
        },
        /**
         * 初始化推荐用户列表
         */
        initRecommendUser: function () {
            var t = this;
            var param = {
                paramJson: $.toJSON({
                    customerId:options.customerId,
                    firstResult: 0,
	                dataFlag:2,
                    maxResult: t.config.recommendUserNum
                })
            };

            var ul = t.el.main.find(".p_tj_user ul");
            $.ajax({
                url: t.path.recommendUser,
                data: param,
                type: "POST",
                success: function (data) {
                    if (data && data.responseObject && data.responseObject.responseData.data_list) {
                        var rows = data.responseObject.responseData.data_list;
                        ul.html(t.template.users(rows));
                        t.el.main.scrollBox({numToMove: 1, rows: 1});
                        t.bindFollowAction();
                    }
                }
            });
        },
        /**
         * 绑定关注用户按钮
         * */
        bindFollowAction: function () {
            var t = this;
            t.el.main.find(".p_tj_user .followBtn").on("click", function () {
                var btn = $(this);
                $(this).off("click"); // 避免重复点击
                $.ajax({
                    url: t.path.createFollow,
                    data: {paramJson: $.toJSON({dataFlag: 2, refId: btn.attr("customerId")})},
                    type: "POST",
                    success: function (data) {
                        if (data && data.responseObject && data.responseObject.responseStatus) {
                            btn.addClass("followed");
                            btn.off("click");
                            var origin = btn.parent().parents(".p_tj_user_r").siblings().find("img");
                            var copy = origin.clone();
                            t.putItToBottom(copy, origin);
                        } else {
                            // 关注失败 TODO
                        }

                    }
                });

            });
        },
        /**
         *  加到下面
         *  */
        putItToBottom: function (copy, origin) {
            var t = this;
            var pos = origin.offset();
            var scrollLeft = parseInt(origin.parents("ul").css("left"));
            if (!scrollLeft) scrollLeft = 0;
            var left = pos.left + scrollLeft;
            copy.css({
                "position": "absolute",
                "top": pos.top,
                "left": pos.left
            });
            var target = t.el.main.find(".p_gz_success_list li:not(.on):eq(0)");
            target.html('<div class="p_gz_success_list_img"></div>').addClass("on");
            var targetPos = target.offset();
            copy.animate({
                top: targetPos.top,
                left: targetPos.left
            }, function () {
                $(this).css({"position": "static"});
                var ul = t.el.main.find(".p_gz_success_list ul");
                if (ul.children(".on").size() > 3) {
                    t.el.main.find(".x_zy_title_success").show();
                }
                if (ul.children(".on").size() > 5) {
                    ul.append("<li></li>");
                    var l = parseInt(ul.css("marginLeft"));

                    var w = parseInt(ul.find("li").outerWidth(true));

                    ul.animate({"marginLeft": l - w});
                }
            }).appendTo(target.find("div"));
        }
    };
    controller.init(Obj);
};
