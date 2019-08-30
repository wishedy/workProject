/**
 * 功能描述：   查看大图  在一个图片列表上绑定此模块，当点击其中一幅图时，展开
 * 使用方法:    module.viewBigImg({
 *                  container:".viewBigImg",    // 需要绑定 浏览大图功能 的 图片列表容器
 *                  typeTitle:""                // 图片列表 分类名称 比如 “术前”，“术后”，“新闻” 为空不显示
 *              })
 * 注意事件
 * 引入来源：  作用：
 *
 * Created by LiuYuTao on 2015/3/4.
 */

module.viewBigImgAll = function (Obj) {
    var defaultsOpt = {
        container: null,    // 需要绑定 浏览大图功能 的 图片列表容器
        typeTitle: "",                // 图片列表 分类名称 比如 “术前”，“术后”，“新闻” 为空不显示
        index: 0
    };

    var options = $.extend(defaultsOpt, Obj);

    var el = options.container;
    var controller = {
        path: {
            caze: PC_CALL+"case_attachment/json_list/",       // 病例获取图片列表
            topic: PC_CALL+"topic/attachment/json_list/",      // 话题获取图片列表
            review: PC_CALL+"review/json_list_att/",        // 话题获取图片列表
            reviewDoc:PC_CALL+"cms/pdf/pic/json_list/"      //2018年6月7日新增文库查看图集
        },
        el: {
            originList: el
        },
        imgListType: "", // 图片列表类型， 分病例 话题 与评论
        picType: "width", // 当前图片大小适应类型
        template: {
            main: function () {
                var contentStr = '';
                if(comm.browser.isIeOrEdge()){
                    contentStr+='                <div width="100%" height="100%"   class="view_bigImage_table">' +
                        '                           <div>' +
                        ' <div align="center" valign="middle"><img src=""  />' +
                        '                           </div></div>' +
                        '                        </div>' ;
                }else{
                    contentStr+='<table width="100%" height="100%" class="view_bigImage_table" > +\n' +
                        '                                               <tr><td align="center" valign="middle"><img src=""  /> +\n' +
                        '                                               </td></tr> +\n' +
                        '                                            </table> ';
                }
                return '<div class="view_big_img_wrap"><div class="view_big_img">' +
                    // '        <div class="view_big_img_bg"></div>' +
                    '        <div class="view_big_img_content">' +
                    '            <div class="view_big_img_center">' +
                    '                    <div class="view_img_close"><img src="//modules.allinmd.cn/view-big-img/images/closeNew.png" /></div>' +
                    '                <div class="view_img_top" id="vbi-scrollList">' +
                    '                    <div class="view_top_img_left_mr prev"></div>' +
                    '                    <div class="view_img_top_cont">' +
                    '                        <ul class="scroll">' +
                    '                            <li><div class="small_img_mr"></div><img src="//modules.allinmd.cn/view-big-img/images/mr_small_img.png" /></li>' +
                    '                        </ul>' +
                    '<div class="view_img_num" id="vbi-imgIndex"><span>2</span> / 7<i></i></div>'+
                    '                    </div>' +
                    '                    <div class="view_top_img_right_hover next"></div>' +
                    '                    <div class="clear"></div>' +
                    '                </div>' +
                    '                <div class="view_big_img_cont_bg">' +

                    '                    <div class="view_img_cont_top">' +
                    '                        <div class="view_img_sh_zt hide"></div>' +
                    '                        <div class="view_img_title font_yahei hide" id="vbi-imgTitle"></div>' +
                    //'                        <div class="view_img_num" id="vbi-imgIndex"></div>' +
                    //'                        <div class="view_img_time font_yahei" id="uploadTime"></div>' +
                    '                        <div class="clear"></div>' +
                    '                    </div>' +
                    '                    <div class="view_img_tp">' +
                    '                        <s class="prev" title="上一张"></s>' +
                    '                        <s class="next" title="下一张"></s>' +
                    '                        <div class="view_img_but view_img_shck font_yahei" id="vbi-setSizeBtn">适合窗口</div>' +
                    '                        <div class="view_img_but view_img_shck font_yahei" id="vbi-rotateBtn" style="margin-right:96px;">旋转图片</div>' +
                    '                        <div class="view_img_but view_img_view_yt font_yahei" id="vbi-viewOrigImg">查看原图</div>' +
                    contentStr+
                    '                   </div>' +
                    '                </div>' +
                    '            </div>' +
                    '        </div>' +
                    '    </div>' +
                    '</div>';
            }
        },
        init: function () {
            var t = this;
            t.currentIndex = options.index;
            /*  if (imgType == "remote") {
             if (!options.caseId || !options.caseCategoryId) {
             alert("参数不足");
             return;
             }
             }*/
            if($(options.container).find("img").length==0){
                return;
            }
            t.checkImgListType();
            t.openDialog();                     // 打开弹层

            t.dialog.find(".view_img_top_cont ul li:eq(" + t.currentIndex + ")").click();    // 默认点击第一项

            var topC_W = $('.view_img_top_cont').width();
            var topC_li_W = $('.view_img_top_cont li').width()+15; //15为margin-right
            var liLen = $('.view_img_top_cont li').length;
            var _num  = topC_W/topC_li_W;
            var maxLeft = $('.view_img_top_cont .scroll').width()-topC_W/2;
            var activeImg = $("ul.scroll li.active img");
            if(t.currentIndex+1>=_num){

                // if(activeImg.offset().left-topC_W/2>maxLeft){
                // 	$('.view_img_top_cont .scroll').css('left',-maxLeft-30+'px');
                // }else{
                // 	$('.view_img_top_cont .scroll').css('left',-(activeImg.offset().left-topC_W+10)+'px');
                // }
                var whichScreen = t.currentIndex/Math.floor(_num);
                if(whichScreen>1){//判断第几屏，点几次
                    for(i=0;i<whichScreen-1;i++){
                        $('#vbi-scrollList .next').click();
                    }
                }
            }
            $(document).bind('keyup',function(e){
                if(e.keyCode==37){
                    $('.view_img_tp .prev').click();
                }else if(e.keyCode==39){
                    $('.view_img_tp .next').click();
                }
                e.preventDefault();
                return false;
            });

        },
        checkImgListType: function () {
            var t = this;
            t.values = {};

            t.values.caseId = $(options.container).attr("caseId");
            t.values.topicId = $(options.container).attr("topicId");
            t.values.reviewId = $(options.container).attr("reviewId");
            t.values.caseCategoryId = $(options.container).attr("caseCategoryId");

            t.values.refType = options.resourceType;
            t.values.refId = options.resourceId;

            if (t.values.topicId != undefined) {
                t.imgListType = "topic";
            }
            if (t.values.reviewId != undefined) {
                t.imgListType = "review";
            }
            if (t.values.caseId != undefined) {
                t.imgListType = "caze"; //case 在ie8报错
            }
            if(t.values.refId != undefined) {
                t.imgListType = "reviewDoc";
            }
        },
        /**
         *  绑定按钮
         */
        bindBtns: function () {
            var t = this;
            t.dialog.find(".view_img_close").on("click", function () {    // 关闭
                t.close();
                //事件埋点
                comm.creatEvent({
                    triggerType:"全站功能按钮点击",
                    keyword:"查看大图弹层关闭",
                    actionId:43
                });
            });

            t.dialog.find("#vbi-setSizeBtn").on("click", function () {
                if ($(this).text() == "适合窗口") {
                    $(this).text("适合宽度");
                    t.picType = "window";
                    t.setSize(t.picType);    // 适合窗口
                } else {
                    t.picType = "width";
                    $(this).text("适合窗口").show();
                    t.setSize(t.picType);     // 适合宽度
                }

            });
            t.angle = 0;
            t.prevHeight = $('.view_img_tp').height();

            $('.view_img_tp .view_bigImage_table').css('position','relative');
            t.dialog.find("#vbi-rotateBtn").on("click", function () {
                t.angle+=90;

                if(t.angle==360){
                    t.angle = 0;
                }
                var width = $('.view_img_tp img').width();
                var height = $('.view_img_tp img').height();
                var ratio = 1;
                var mTop = 0;
                var tableW = $('.view_img_tp .view_bigImage_table').width();
                if(t.angle==90||t.angle==270){
                    if(width+148>t.prevHeight){
                        if(height>tableW){
                            $('.view_img_tp').css({"height":width*tableW/height+148});
                        }else{
                            $('.view_img_tp').css({"height":width});
                        }
                    }else{
                        $('.view_img_tp').css({"height":t.prevHeight});
                    }
                    if(height>tableW){//940为图片展示最大宽度
                        ratio = tableW/height*100+"%";  //图片高度太大时旋转横屏后压缩
                    }
                    $('.view_img_tp img').css({"transform":'rotate('+t.angle+'deg)',zoom:ratio}).attr({zoomW:height*tableW/height,zoomH:width*tableW/height});
                    mTop = $('.view_img_tp img').width() - width*tableW/height;
                    if(comm.browser.isIeOrEdge()){
                        $('.view_img_tp img').css({marginTop:ratio==1?0:(80-mTop)});
                        if(height>width){
                            $('.view_img_tp img').css({marginTop:80-((height-width)/2)});
                        }
                    }else{
                        $('.view_img_tp img').css({marginTop:ratio==1?0:-mTop});
                        if(height>width){
                            $('.view_img_tp img').css({marginTop:-((height-width)/2)});
                        }
                    }

                }else{
                    if(height+148>t.prevHeight){
                        $('.view_img_tp').css({"height":height});
                    }else{
                        $('.view_img_tp').css({"height":t.prevHeight});
                    }
                    $('.view_img_tp img').css({"transform":'rotate('+t.angle+'deg)',zoom:1});
                    $('.view_img_tp img').css({marginTop:0});
                }

            }).on('selectstart',function(){
                return false;
            });

            t.dialog.find("#vbi-viewOrigImg").on("click", function () {
                var href = "/pages/singlePage/viewOriginalImg/viewOriginalImg.html?" + t.getHrefParam(t.imgListType);
                if (t.currentIndex) {
                    href += "&index=" + t.currentIndex;
                }
                g_sps.jump(null,href,true);
            }).on('selectstart',function(){
                return false;
            });
        },
        /**
         * 切换图片
         * imgObj   图片对象
         */
        changeImg: function (imgObj) {
            var t = this;
            t.dialog.find("#vbi-imgTitle").html(imgObj.title);   //  更新标题
            t.dialog.find("#vbi-imgIndex span").html(imgObj.index + 1);   //  更新数字
            //旋转-角度恢复默认
            t.angle = 0;
            t.dialog.find(".view_img_tp img").css({'transform':'rotate(0deg)',zoom:1,marginTop:0});
            //新增图片url截取
            if(Obj.srcSplit){
                t.dialog.find(".view_img_tp img").attr("src", /_t_\d_\d/g.test(imgObj.src)?imgObj.src.replace(/_t_\d_\d/g,''):imgObj.src);
            }else{
                t.dialog.find(".view_img_tp img").attr("src", imgObj.src);
            }
            imgObj.uploadTime&&t.dialog.find("#uploadTime").text("上传于：" + imgObj.uploadTime.split(".")[0]);
            t.setSize(t.picType);
            var activeImg = $("ul.scroll li.active img");
            var title = activeImg.attr("title");
            if(title&&activeImg.attr("title").length>36){
                title = (activeImg.attr("title")).substring(0,36)+"...";
            }


            $("#vbi-imgIndex").find("i").attr({"data-text":activeImg.attr("title")}).html(title);
            title&&t.subText();
        },

        bindWindonResize: function () {
            var t = this;
            $(window).on("resize", function () {
                t.resize();
            });
        },
        unbindWindonResize: function () {
            var t = this;
            $(window).off("resize");
        },
        resize: function () {
            var t = this;
            t.dialog.css({
                width: $(window).width(),
                height: $(window).height()
            });

            // 图片列表宽度
            var topConWidth = $(window).width() > 1080 ? 1000 : $(window).width() - 80;
            var scrollCtrlConWidth = t.topContainer.find(".prev").outerWidth(true) +   // 图片列表控制按钮宽度
                t.topContainer.find(".next").outerWidth(true);

            if (t.topContainer.find("ul.scroll").width() > (topConWidth - scrollCtrlConWidth)) {     // 若图片列表宽度 大于 区域最大宽度 需要隐藏时
                t.topContainer.find(".view_img_top_cont").width(topConWidth - scrollCtrlConWidth); // 改变显示区宽度
            }
            if(t.scrollbox!=undefined){
                t.scrollbox.resize(topConWidth - scrollCtrlConWidth);
            }


            // 顶部列表容器
            t.topContainer.width(topConWidth);

            // 改变图片容器宽度
            var padding = parseInt(t.dialog.find(".view_big_img_cont_bg").css("padding-left")) * 2;
            if ($(window).width() < 1080) {
                t.dialog.find(".view_big_img_center").width($(window).width() - 80);
            } else {
                t.dialog.find(".view_big_img_center").width(1000);
            }


            if (t.dialog.find("#vbi-setSizeBtn").text() == "适合宽度") {// 当前为适合窗口状态 容器及图片大小需随之变化
                t.setSize("window");
            } else {
                t.setSize("width");
            }
        },
        /**
         * 弹出图片列表展示层
         */
        openDialog: function () {
            var t = this;
            t.dialog = $(t.template.main());
            $("body").append(t.dialog);

            t.topContainer = t.dialog.find(".view_img_top");
            t.picContainer = t.dialog.find(".view_img_tp");
            t.img = t.dialog.find(".view_img_tp img");

            if(comm.LightBox.count>0){
                comm.LightBox.count++;
                comm.LightBox.zIndexUp();
            }else{
                comm.LightBox.show(60, "#000");  // 遮罩
            }
            if(options.imgList){//获取本地图片
                t.getLocaImgList();
                $("#vbi-setSizeBtn").css({right:'10px'});
                $("#vbi-viewOrigImg").hide();
            }else{
                t.getImgList();
            }
            t.resize();
            t.setCss();
            t.bindBtns();

            t.bindWindonResize();
            t.setTypeTitle();
            t.dialog.find("#vbi-imgIndex").html("<span></span> / " + t.pictureSize+"<i></i>");
            t.initNextPrevBtns();

        },
        /**
         *  专题标题
         */
        setTypeTitle: function () {
            var t = this;
            if (options.typeTitle !== "") {

                t.dialog.find(".view_img_sh_zt").html(options.typeTitle).show();
            }
            //console.log(options.typeTitle)
        },
        /*图片描述处理方法*/
        subText: function () {
            var t = this;
            $('.view_img_top_cont').hover(function(){
                var isThis = $(this).find(".view_img_num");
                var textStr ="";
                if(isThis.find('i').attr('data-text').length>100){
                    textStr = isThis.find('i').attr('data-text').substring(0,100);
                }else{
                    textStr = isThis.find('i').attr('data-text');
                }
                isThis.find('i').text(textStr);

            },function(){
                var isThis = $(this).find(".view_img_num");
                var textStr = "";
                if(isThis.find('i').attr('data-text').length>42){
                    textStr = isThis.find('i').attr('data-text').substring(0,36)+"...";
                }else{
                    textStr = isThis.find('i').attr('data-text');
                }
                isThis.find('i').text(textStr);
            })
        },

        setCss: function () {
            var t = this;
            if(t.scrollbox!=undefined){
                $("body").css({
                    position: "relative",
                    overflow: "hidden"
                });
            }
            var scrollPos;
            if (typeof window.pageYOffset != 'undefined') {
                scrollPos = window.pageYOffset;
            }
            else if (typeof document.compatMode != 'undefined' && document.compatMode != 'BackCompat') {
                scrollPos = document.documentElement.scrollTop;
            }
            else if (typeof document.body != 'undefined') {
                scrollPos = document.body.scrollTop;
            }

            t.dialog.css({
                position: "absolute",
                top: scrollPos,
                width: $(window).width(),
                zIndex: comm.LightBox.getZIndex()+1,
                overflowY: "scroll",
                height: $(window).height()
            });

            t.setSize("width");
        },
        initImgList: function () {
            var t = this;
            var liLen = $('.view_img_top_cont li').length;

            var maxUlConWidth = t.dialog.find(".view_big_img_cont_bg").outerWidth(true) - t.topContainer.find(".prev").outerWidth(true) -  // 图片列表的父级容器可允许的最大宽度
                t.topContainer.find(".next").outerWidth(true);


            if (t.topContainer.find("ul.scroll").width() > maxUlConWidth) {     // 图片列表的长度 超出最大长度
                t.topContainer.find(".view_img_top_cont").width(maxUlConWidth);
                //console.log(maxUlConWidth)
            } else {                                                            // 未超出
                t.topContainer.find(".view_img_top_cont").width('80%');
                t.topContainer.find(".prev,.next").addClass("disable");
            }

            t.scrollbox = t.dialog.find("#vbi-scrollList").scrollBox({             // 调用滚动插件
                numToMove: Math.floor(maxUlConWidth / 99),  // 每次滑动的个数
                liClickHdl: function (li) {
                    var img = $(li).find("img");
                    t.currentIndex = $(li).index();
                    var imgObj = {
                        index: t.currentIndex,
                        src: img.attr("src"),
                        title: img.attr("title"),
                        uploadTime: img.attr("uploadTime"),
                        totalLen:liLen
                    };
                    $(li).addClass("active").siblings(".active").removeClass("active");
                    setTimeout(function () {
                        t.changeImg(imgObj);        // 切换图片
                    }, 300);

                }
            });

        },
        /**
         * 获取某类型的图片属性名称
         * @param type 类型
         */
        getPicKey: function (type) {
            var obj = {
                topic: "topicAttUrl",
                caze: "attUrl",         //case ie8报错
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
                        topicAttType: 9//2,
                    };

                    break;
                case "caze":
                    rst = {
                        caseId: t.values.caseId,
                        caseCategoryId: t.values.caseCategoryId,
                        caseAttType: 9//9
                    };
                    break;
                case "review":
                    rst = {
                        reviewId: t.values.reviewId,
                        reviewAttType: 9//2
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
        /**
         * 组装地址参数
         * @param type 类型
         * @returns String
         */
        getHrefParam: function (type) {
            var t = this;
            var rst = {};
            switch (type) {
                case "topic":
                    rst = "&topicId=" + t.values.topicId;
                    break;
                case "caze":
                    rst = "&caseId=" + t.values.caseId;
                    if(t.values.caseCategoryId!=undefined){
                        rst +="&caseCategoryId=" + t.values.caseCategoryId;
                    }
                    break;
                case "review":
                    rst = "&reviewId=" + t.values.reviewId;
                    break;
                case "reviewDoc":
                    rst = "&refId=" +  t.values.refId+"&refType="+t.values.refType;
                    break;
            }
            return rst;
        },
        getLocaImgList:function(){
            var t=this;
            var rst = options.imgList;
            var html = "";
            t.pictureSize = rst.length;

            $.each(rst, function (i, val) {
                html += "<li listid='"+val.id+"'><div class='small_img_mr'></div>" +
                    "   <img src='" + val.url + "' title='"+val.attName+"'/></li>";
            });
            t.dialog.find("ul.scroll").html(html);
            if(options.id){
                t.dialog.find(".scroll li").each(function(i,em){
                    if(options.id==$(em).attr("listid")){
                        t.currentIndex=$(em).index();
                        return;
                    }
                });
            }

            t.liOuterWidth = t.dialog.find("ul.scroll li:eq(0)").outerWidth(true);

            t.initImgList();

            t.dialog.find("ul.scroll").css({
                width:(99 * (t.pictureSize)+107)+15
            });
            t.dialog.find("ul.scroll").css({"position":"inherit"});
            $(".view_img_top_cont").css({"height":"",width:$(".view_img_top_cont").width()-15});
            var maxUlConWidth = t.dialog.find(".view_big_img_cont_bg").outerWidth(true) - t.topContainer.find(".prev").outerWidth(true) -  // 图片列表的父级容器可允许的最大宽度
                t.topContainer.find(".next").outerWidth(true);


            if (t.topContainer.find("ul.scroll").width() > maxUlConWidth) {     // 图片列表的长度 超出最大长度
                t.topContainer.find(".view_img_top_cont").width(maxUlConWidth);
            } else {                                                            // 未超出
                t.topContainer.find(".view_img_top_cont").width('80%');
                t.topContainer.find(".prev,.next").addClass("disable");
            }
            if(options.id){
                // t.topContainer.find(".next").click();
            }
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
                        if(options.reverse){
                            for(var j=rst.length-1; j>=0;j--){
                                html += "<li listid='"+rst.id+"'><div class='small_img_mr'></div>" +
                                    "   <img src='" + rst[j][t.getPicKey(t.imgListType)] + "' title='" + (rst[j].caseAttName || "") + "' uploadTime='" + (rst[j].uploadTime && rst[j].uploadTime) + "' /></li>";
                            }
                        }else{
                            $.map(rst, function (elem, i) {
                                html += "<li listid='"+elem.id+"'><div class='small_img_mr'></div>" +
                                    "   <img src='" + elem[t.getPicKey(t.imgListType)] + "' title='" + (elem.caseAttName || "") + "' uploadTime='" + (elem.uploadTime && elem.uploadTime) + "' /></li>";
                            });
                        }

                        t.dialog.find("ul.scroll").html(html);
                        if(options.id){
                            t.dialog.find(".scroll li").each(function(i,em){
                                if(options.id==$(em).attr("listid")){
                                    t.currentIndex=$(em).index();
                                    return;
                                }
                            });
                        }

                        t.liOuterWidth = t.dialog.find("ul.scroll li:eq(0)").outerWidth(true);

                        t.initImgList();

                        t.dialog.find("ul.scroll").css({
                            width:(99 * (t.pictureSize)+107)+15
                        });
                        t.dialog.find("ul.scroll").css({"position":"inherit"});
                        $(".view_img_top_cont").css({"height":"",width:$(".view_img_top_cont").width()-15});
                        var maxUlConWidth = t.dialog.find(".view_big_img_cont_bg").outerWidth(true) - t.topContainer.find(".prev").outerWidth(true) -  // 图片列表的父级容器可允许的最大宽度
                            t.topContainer.find(".next").outerWidth(true);


                        if (t.topContainer.find("ul.scroll").width() > maxUlConWidth) {     // 图片列表的长度 超出最大长度
                            t.topContainer.find(".view_img_top_cont").width(maxUlConWidth);
                        } else {                                                            // 未超出
                            t.topContainer.find(".view_img_top_cont").width('80%');
                            t.topContainer.find(".prev,.next").addClass("disable");
                        }
                        if(options.id){
                            t.topContainer.find(".next").click();
                        }
                    }else{
                        //请求大图无数据
                        $('.view_big_img_wrap').remove();
                        comm.LightBox.hide();
                        //console.log('图片集请求发生问题!');
                        return false;
                    }
                }
            });
        },

        /**
         * 关闭对话框
         */
        close: function () {
            $(document).unbind('keyup');
            var t = this;
            t.dialog.remove();

            if(comm.LightBox.count>1){
                comm.LightBox.count--;
                comm.LightBox.zIndexDown();
            }else{
                comm.LightBox.hide();
            }
            $("body").css({
                position: "static",
                overflow: "scroll"
            });
            t.unbindWindonResize();
        },
        /**
         * 设置图片显示 大小 "window" 按窗口 ，"width" 按高宽 ，"origin" 原图大小
         * @param type
         */
        setSize: function (type) {
            var t = this,
                bg = t.dialog.find(".view_big_img_cont_bg"),
                bg_cont_top = bg.find(".view_img_cont_top"),
                containerHeight = $(window).height() - parseInt(t.dialog.find(".view_big_img_center").css("paddingTop")) * 2 - t.dialog.find(".view_img_top").height() - parseInt(bg.css("paddingTop")) * 2,   // 容器高度
                maxHeight = containerHeight - bg_cont_top.height() - parseInt(bg_cont_top.css("margin-bottom")),

                minHeight = maxHeight,
                maxWidth = bg.width();    // 图片最大宽度

            maxHeight = maxHeight > 100 ? maxHeight : 100;  // 最低不小于100     // 最小值限制
            maxWidth = maxWidth > 200 ? maxWidth : 200;  // 最窄不小于200    // 最小值限制

            if (type == "window") {

                // step1 使滑动条度部容器高度随窗口改变
                bg.animate("height", containerHeight);
                // step2  设置图片高宽
                // 图片最大高度 ，容器最大高度 减去 容器内边距 减去 容器内头部高度
                if(t.angle==90||t.angle==270){
                    if(maxHeight<t.img.width()){
                        maxHeight = t.img.width()+300;
                    }
                }
                comm.setImgSize(maxHeight, maxWidth, t.img.get(0));  // 等比缩放图片

                // step3  设置 图片容器高宽

                t.picContainer.height(maxHeight);                  // 设置 图片容器高度，用来处理居中
            }
            if (type == "width") {  // 适应宽度
                //t.dialog.css("overflow-x","scroll");
                // step1 使滑动条度部容器高度自适应
                var bg = t.dialog.find(".view_big_img_cont_bg");
                bg.css("height", "auto");
                // step2  设置图片高宽
                comm.setImgSize(8000, maxWidth, t.img.get(0));  // 等比缩放图片
                // step3  设置 图片容器高宽
                minHeight = minHeight > t.img.height() ? minHeight : t.img.height();
                if(t.angle==90||t.angle==270){
                    if(minHeight<t.img.width()){
                        minHeight = t.img.width()+300;
                    }
                }
                t.picContainer.height(minHeight);                  // 设置 图片容器高度，用来处理居中

                //console.log(minHeight)
            }

        },
        /***
         * 在图片上的上下控制按钮 初始化
         */
        initNextPrevBtns: function () {
            var t = this;
            t.picContainer.find(".prev").on("click", function () {
                if(t.currentIndex==0){return false;}
                t.scrollbox.prevLi();
                t.currentIndex--;
                t.topContainer.find(".active").click();
            }).on('selectstart',function(){
                return false;
            });
            t.picContainer.find(".next").on("click", function () {
                if(t.currentIndex ==  t.dialog.find(".scroll li").length-1){
                    return false
                }
                t.scrollbox.nextLi();
                t.currentIndex++;
                t.topContainer.find(".active").click();
            }).on('selectstart',function(){
                return false;
            });


        }
    };

    controller.init();
    return {};
};
