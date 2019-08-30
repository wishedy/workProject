/**
 * 功能描述：为你推荐 模块，有三个选项卡 猜你喜欢，观看记录，我的收藏
 *         若未登录 ，后两项显示 请登录提示
 * 使用方法:
 * 注意事件：
 * 引入来源：  作用：
 *
 * Created by LiuYuTao on 2015/3/16.
 */

module.recommendForYou = function(Obj){
    var defaults = {
        container:"#recommend-for-you"
    };

    var options = $.extend(defaults, Obj);

    var scrollBoxTemp = null;
	var controller = {

        config : {pageSize : 4}, //翻页数量


        path : {
            guess:PC_CALL+"video/jsonRecommendVideolist/", //关注
            history:PC_CALL+"video/jsonRecommendVideolist/", // 观看记录
            favourite:PC_CALL+"video/jsonRecommendVideolist/"    // 收藏
        },

        template : {

            list:function(data){
                var html = "<ul>";
                for (var i = 0; i < data.length; i++) {
                    var obj = data[i];
                    html += '<li>' +
                        '         <div class="v_tj_img"><a href="'+ obj.cms_video.pageStoragePath +'" target="_blank"><img src="'+ obj.cms_video_att.videoAttUrl +'"></a>' +
                        '                <div class="v_tj_img_time_bg"></div>' +
                        '                <div class="v_tj_img_time">'+ obj.cms_video.playTime +'</div>' +
                        '         </div>' +
                        '         <div class="v_tj_name"><a href="'+ obj.cms_video.pageStoragePath +'" target="_blank">'+ comm.getStrLen(obj.cms_video.videoName,26) +'</a></div>' +
                        '     </li>';
                }
                html += '<div class="clear"></div></ul>';

                return html;

            },
            loading:function(){
                return ' <div class="spinner loading-margin">' +
                '                    <div class="bounce1"></div>' +
                '                    <div class="bounce2"></div>' +
                '                    <div class="bounce3"></div>' +
                '                </div>';
            },
            empty: function (val) {
                return '<div class="v_tj_list v_tj_list_no_jilu ">' +
                    '         <div class="small_tuijie_text font_yahei"> '+ val +'</div>' +
                    '         <div class="clear"></div>' +
                    '   </div>';
            }
        },
        el:{
            container:$(options.container)
        },
        init : function(Obj){
            var t = this;
            t.checkIsLogin();

            t.bindTab();
            t.el.container.find(".video_tj_li li:eq(0)").click();
        },
        /**
         * 判断是否登录
         * 登录后 后两个选项卡将显示loading
         * 否则显示登录提示
         */
        checkIsLogin: function () {
            var t = this;
            if(user.getLoginStatus()){        // 已登录
                t.el.container.find(".history,.favourite").html(t.template.loading());
            }else{                  // 未登录
                t.el.container.find(".history .small_tuijie_but")
                    .on("click", function () {

                        user.login({
                            callback: function () {
                                t.loadData(1);
                                t.loadData(2);
                            },
                            scene:privilegeSceneConst.eSceneTypeLogin
                    });
                    });

                t.el.container.find(".favourite .small_tuijie_but")   //
                    .on("click", function () {

                        user.login({
                            callback: function () {
                                t.loadData(1);
                                t.loadData(2);
                            },
	                        scene:privilegeSceneConst.eSceneTypeLogin
                        });
                    });
            }
        },
        /**
         * 绑定标签
         */
        bindTab: function () {
            var t = this;
            var container = t.el.container;
            container.find(".video_tj_li li").each(function () {

                $(this).on("click", function () {

                    var text = "",index;
                    var li = $(this);
                    index = li.index();
                    var tabItem = container.find(".tab-item:eq(" + index + ")");
                    container.find(".scroll").removeClass("scroll");
                    tabItem.show().siblings().hide();
                    li.addClass("hover").siblings().removeClass("hover");
                    if(tabItem.attr("loaded") && tabItem.attr("loaded") == "true"){   // 已加载
                        if(tabItem.attr("liSize") && tabItem.attr("liSize")>0) {  // 有数据
                            container.find(".l_r_but").show();
                            tabItem.find("ul").addClass("scroll");
                            // 绑定滚动
                            t.bindScroll();
                        }else { // 无数据
                            container.find(".l_r_but").hide();
                        }
                    }else { // 未加载
                        if(index===0){
                            t.loadData(0);
                        }else{
                            if(user.getLoginStatus()){
                                t.loadData(index);
                            }
                        }

                    }
                });
            });
        },
        bindScroll: function () {
            var t = this;
            if (t.scrollBoxTemp) {
                t.scrollBoxTemp.destroy();
            }
            t.el.container.find(".scroll").css("left",0);
            t.scrollBoxTemp = t.el.container.scrollBox({ numToMove:4 });
        },
        /***
         * 加载数据
         */
        loadData: function (index) {
            var t = this,type;
            type = index>0?(index ==1 ? "history":"favourite"):"guess";
            $.ajax({
                url: t.path[type],
                dataType:"json",
                data:{paramJson: $.toJSON(  {
                            pageSize:8,
                            pageIndex:1,
                            useFlag:"2",
                            recommendColumnsFlag:index+1
                        })
                },
                type:"POST",
                success: function (data) {

                    var typeCon  = t.el.container.find("." + type);
                    var liWidth,text;
                    if(data.responseObject && data.responseObject.responseData && data.responseObject.responseData.data_list && data.responseObject.responseData.data_list.length>0){  // 若有数据
                        var rows = data.responseObject.responseData.data_list;
                        typeCon.html(
                              t.template.list(rows)
                         ).attr({"loaded":"true","liSize":rows.length})
                          .find("ul").addClass("scroll");
                        liWidth = typeCon.find("li:eq(0)").outerWidth(true);
                        typeCon.find("ul").width(rows.length * liWidth);
                        t.el.container.find(".l_r_but").show();
                        t.bindScroll();
                    }else{

                        if(index > 0 ){
                            text = (index == 1)?"你还没有观看过视频哦！":"暂无收藏内容！";
                        }
                        typeCon.html(t.template.empty(text)).attr({"loaded":"true","liSize":0});
                    }



                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    //alert("error");
                }
            });
        }
	};

	controller.init(Obj);

};