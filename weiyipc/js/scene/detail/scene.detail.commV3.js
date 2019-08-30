/**
 * 功能描述：视频终端页的操作3.0
 * 使用方法:
 * 注意事件：
 * 引入来源：  作用：
 *
 * Created by HeJing on 2016/08/27.
 */


/*ie8兼容indexOf()方法*/
if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (elt /*, from*/) {
        var len = this.length >>> 0;
        var from = Number(arguments[1]) || 0;
        from = (from < 0)
            ? Math.ceil(from)
            : Math.floor(from);
        if (from < 0)
            from += len;
        for (; from < len; from++) {
            if (from in this &&
                this[from] === elt)
                return from;
        }
        return -1;
    };
}
function toggleToMobile() {
    var PC = comm.equipment.IsPC();
    if (!PC) {
        var currentUrl = location.href;
        if (currentUrl.indexOf("www.allinmd.cn") > -1) {
            location.href = currentUrl.replace("www.allinmd.cn", "m.allinmd.cn").replace("/html/", "/html/m/");
        }
    }
}
//评分数计算
function scoringCount(num, control) {
    var t = this;
    var intScoring = parseInt(num),
        decScoring = num - intScoring,
        blueStarWidth = control.find('li').width() * decScoring;
    for (var i = 0; i < intScoring; i++) {
        control.find('li').eq(i).html("<b></b>");
    }
    control.find('li').eq(intScoring).html("<b></b>");
    control.find('li').eq(intScoring).find('b').css("width", blueStarWidth);
}
//新增评分系统
function scoringSystem() {
    $.ajax({//评分接口请求
        url: PC_CALL + "customer/resource/score/getResourceComprehensiveScore/",
        type: "POST",
        dataType: "json",
        data: {
            paramJson: $.toJSON({
                "isValid": "1",
                "visitSiteId": "1",
                "myScoreCustomerId": $("#sesCustomerId").val(),
                "scoreType": $("#resourceType").val(),
                "sortType": "2",
                "refId": $("#resourceId").val(),
                "firstResult": "0",
                "maxResult": "999999"
            })
        },
        success: function (data) {
            if (data && data.responseObject && data.responseObject.responseData) {
                var items = data.responseObject.responseData,
                    scoringTotle = items.currentStarLevel,//综合评分
                    scoringPerson = items.scorePeopleNum,//评分人数
                    iScoring = items.myScoreState;//是否评过分
                //评分人数
                if (scoringPerson >= 10) {
                    $(".al-moreTen").show().siblings().hide();
                    $(".al-moreTen span").text(scoringPerson);
                    scoringCount(scoringTotle, $(".al-libraryInfo_head .al-littleScoreStarBox"));
                } else {
                    $(".al-lessTen").show().text("已有"+scoringPerson+"人评分（未达10人，暂无详情）").siblings().hide();
                    $(".al-libraryInfo_head .al-littleScoreStarBox").hide();
                }
                //是否评过分
                if (iScoring == 0) {
                    $(".al-myScorePart figure span").text("我要评分");
                    $(".al-myScorePart ul").addClass("ev-scoring");
                    $(".al-myScorePart").addClass("al-noScore al-demandScorePart").removeClass("al-yesScore");
                } else if (iScoring == 1) {
                    $(".al-myScorePart figure span").text("我的评分");
                    $(".al-myScorePart").addClass("al-yesScore").removeClass("al-noScore al-demandScorePart");
                    $(".al-videoScoreMask").remove();
                    scoringCount(items.score, $(".al-yesScore"));
                }
                //是否匿名
                $(".ev-isAnonymous").on('click', function () {
                    if ($(this).children("b").hasClass("active")) {
                        $(this).children("b").removeClass("active");
                    } else {
                        $(this).children("b").addClass("active");
                    }
                });
                //video弹层关闭
                $(".al-scorePopCloseBtn").on('click', function () {
                    $(".al-videoScoreMask").hide();
                    if ($(".Ev-videoTipBox").length > 0) {
                        var locationHref = $(".al-videoHighLight").next().find("a.Ev-padRight").attr("href");
                        if (locationHref) {
                            g_sps.jump(null, locationHref);
                        } else {
                            //comm.players[0].player.pause();//视频暂停
                        }
                    } else {
                        /*if(comm.players[0]){
                            comm.players[0].player.pause();//视频暂停
                        }*/
                    }
                });
                if ($("#resourceType").val() != 4) {
                    //公共方法调取
                    module.scoringSystem({
                        isTerminal: 0,
                        answerType: $("#resourceType").val(),        //(1视频，2文库，7病例)
                        resourceTitle: $(".al-libraryInfo_head h4").text() ? $(".al-libraryInfo_head h4").text() : $(".oe_ch").eq(0).text().trim(),      //资源名称
                        scoreTerminal: function (items) {    //终端页评分回调
                            $(".al-myScorePart figure span").text("我的评分");
                            //评分人数
                            if (scoringPerson >= 10) {
                                $(".al-moreTen span").text(parseInt(scoringPerson,10)+1);
                            } else {
                                $(".al-lessTen").show().text("已有"+ (parseInt(scoringPerson,10)+1) +"人评分（未达10人，暂无详情）").siblings().hide();
                            }
                            $(".al-myScorePart").addClass("al-yesScore").removeClass("al-noScore al-demandScorePart");
                            $(".al-videoScoreMask").remove();
                            $(".al-myScorePart ul").removeClass("ev-scoring");
                            scoringCount(items.scoreNum, $(".al-yesScore"));
                            if ($("#resourceType").val() == 1 && comm.players[0].getCurrentTime() < comm.players[0].getDurationTime() - 1) {
                                setTimeout(function () {
                                    comm.players[0].player.play();//先暂停
                                }, 3000)
                            }
                            if ($(".Ev-videoTipBox").length > 0) {
                                var locationHref = $(".al-videoHighLight").next().find("a.Ev-padRight").attr("href");
                                if (locationHref) {
                                    g_sps.jump(null, locationHref);
                                } else {
                                    comm.players[0].player.pause();//先暂停
                                }
                            }
                        },
                        scoreVideoStop: function () {
                            if ($(".resourceType") == 1) {
                                comm.players[0].player.pause();//先暂停
                            }
                        }
                    });
                }
            }
        }
    });
}
//相关产品
function relatedProducts() {
    if ($("#resourceType").val() == 1 || $("#resourceType").val() == 2 || $("#resourceType").val() == 7) {
        var libraryProducts = {
            path: {
                product: "/call/cms/resourceCategory/getMapList/"
            },
            init: function () {
                var t = this;
                $(".al-productRecommendBox h6").eq(0).html(
                    '                        推荐产品(<span class="num"></span>)\n' +
                    '                        <span class="more">More</span>\n');
                t.resourceType = $("#resourceType").val();
                t.resourceId = $("#resourceId").val();
                t.getData();
            },
            getData: function () {
                var t = this;
                var data = {
                    resourceType: t.resourceType,   //文库2 视频1 病例7
                    resourceId: t.resourceId,
                    categoryType: 4,
                    firstResult: 0,
                    maxResult: 4,
                    isValid: 1,
                    sortType: 6
                };
                var params = {paramJson: $.toJSON(data)};
                comm.LightBox.showloading();
                comm.ajax.async(t.path.product, params, function (data) {
                    $(".al-productRecommendBox").css("display", "block");
                    if (data && data.responseObject.responseData && data.responseObject.responseData.total_count) {
                        var total_count = data.responseObject.responseData.total_count;
                        $('.al-productRecommendBox .num').text(total_count);
                    }
                    if (data && data.responseObject.responseData && data.responseObject.responseData.data_list) {
                        var data_list = data.responseObject.responseData.data_list;
                        if (data_list.length > 0) {
                            t.dataProcessing(data_list);
                        }
                    }
                    if ($.isEmptyObject(data.responseObject.responseData)) {
                        $(".al-productRecommendBox").css("display", "none");
                    }
                    comm.LightBox.hideloading();
                });
            },
            dataProcessing: function (data) {
                var t = this;
                var html = '';
                for (var i = 0; i < data.length; i++) {
                    var dataItem = data[i];
                    var productId = data[i].productId;
                    if (dataItem.attPath !== '') {
                        html += '<li>' +
                            '<a href="javascript:void(0);" target="_blank" productId="' + productId + '"><img src="' + dataItem.attPath + '" data-original="' + dataItem.attPath + '" alt=""/></a>' +
                            '<div class="al-productInfo">' +
                            '<a href=javascript:void(0);" target="_blank" productId="' + productId + '">' + comm.getStrLen(dataItem.productName, 30) + '</a>' +
                            '<span>' + dataItem.brandName + '</span>' +
                            '</div>' +
                            '</li>';
                    } else {
                        html += '<li>' +
                            '<a href="javascript:void(0);" target="_blank" productId="' + productId + '"><img src="//img10.allinmd.cn/v3/terminal/productNoImg.png" alt=""/></a>' +
                            '<div class="al-productInfo">' +
                            '<a href="javascript:void(0);" target="_blank" productId="' + productId + '">' + comm.getStrLen(dataItem.productName, 30) + '</a>' +
                            '<span>' + dataItem.brandName + '</span>' +
                            '</div>' +
                            '</li>';
                    }
                }
                $('.al-productRecommendList').append(html);
                //事件埋点
                var checkMedPlus = function(){
                    $(".allinmd-QR-container").remove();
                    $(".al-mainInner").append(
                        "<div class=\"allinmd-QR-container al-downLoad_PopBox Ev-al-downLoad_PopBox\" style=\"display: block;\">"+
                        "        <div class=\"al-downContainer Ev-al-downContainer Ev-al-QR\">"+
                        "            <h6 class=\"closePopBtn Ev-closePopBtn\"></h6>"+
                        "            <figure class=\"al-downLoadContent\">"+
                        "                <figcaption>更多骨科产品，通过唯医骨科app查看</figcaption>"+
                        "                <section class=\"downLoad_QR allinmd-QR-code Ev-downLoad_QR\">"+
                        "                    <img src=\"//img10.allinmd.cn/v3/terminal/downLoad-QR.png\" alt=\"\">"+
                        "                </section>"+
                        "            </figure>"+
                        "        </div>"+
                        "    </div>"
                    )
                    $(".Ev-al-QR").off("click").on("click",function(){
                        $(".allinmd-QR-container").remove();
                    });

                };
                $('.al-productRecommendList a').on("click", function () {
                    var keyword = $(this).text();
                    var productId = $(this).attr("productId");
                    var index = $(this).parents('li').index() + 1;
                    comm.creatEvent({
                        triggerType: "引流医栈",
                        keyword: keyword,
                        actionId: 1,
                        pushMessageId: productId,
                        locationId: index
                    });
                    checkMedPlus();
                });
                t.skipProduct(checkMedPlus);
            },
            //点击more进入产品列表页
            skipProduct: function (callBack) {
                var t = this;
                $(".al-productRecommendBox .more").on("click", function () {
                    /*window.location = '/pages/scoringSystem/productListPage.html?resourceType=' + t.resourceType + '&resourceId=' + t.resourceId + '';*/
                    callBack&&callBack();
                });
            }
        };
        libraryProducts.init();
    }
}
function showLabel() {
    var tagContainer = $(".al-tagBox");
    var widthSum = 0;
    var lineNum = 1;
    var labelListLen = tagContainer.find("a").length;
    tagContainer.find("a").each(function () {
        widthSum += $(this).outerWidth();//将每行a标签的可视宽度相加
        if (lineNum < 5) {
            $(this).prev().addClass("al-lable-inline");//给前四行的所有a标签添加class
        } else {
            $(this).prev().addClass("al-lable-unnecessary");//非前四行的所有元素添加class，但是漏掉了最后一个，最后在循环外单独写一句
        }
        if (Math.floor(widthSum / 660) == 1) {//在第一次大于660的时候，也就是第一次换行的时候找到换行的第一个标签的上一个标签给其添加一个属性，标明是第一行的最后一个标签，同时给一个class,widthSum从这个元素开始，从新累加，lineNum推进到下一行
            $(this).prev().attr({"data-wrap": lineNum}).addClass("al-label-wrap");
            lineNum++;
            widthSum = $(this).outerWidth();
        }
    });
    tagContainer.find("a").eq(labelListLen - 1).addClass("al-lable-unnecessary al-label-lastOne");
    var fourWrap = $(".al-label-wrap[data-wrap='4']");
    var spreadOnOff = fourWrap.next().length > 0;
    var htmlStr = fourWrap.html();
    var fourHref = fourWrap.attr("href");
    var packUp = function () {//收起后的效果
        $(".al-lable-unnecessary").hide();
        fourWrap.html("<i></i><i></i><i></i>").removeAttr("href").addClass("al-lable-fourWrap").unbind("click").bind("click", function () {
            spread();
        });
    };
    spreadOnOff ? packUp() : "";//如果第四行的最后一个元素有下一个元素，就意味着有第五行，默认收起，否则不予操作
    var spread = function () {//展开后的效果
        fourWrap.html(htmlStr).removeClass("al-lable-fourWrap").parent().append("<a class='al-label-packUp'>收起</a>");
        $(".al-lable-unnecessary").show();
        fourWrap.unbind("mousedown").bind("mousedown", function () {
            g_sps.jump(null, fourHref);
        });
        $(".al-label-packUp").unbind("click").bind("click", function () {
            packUp();
            fourWrap.unbind("mousedown");
            $(this).remove();
        })
    };
    tagContainer.find("a").on("click", function () {
        if (($(this)&&$(this).attr("href")&&$(this).attr("href").length > 0)) {
            var href = $(this).attr("href");
            var param = {};
            var str, item;
            if (href.lastIndexOf("#") > 0) {
                str = href.substring(href.lastIndexOf("#") + 1, href.length);
                var arr = str.split("&");
                for (var i = 0; i < arr.length; i++) {
                    item = arr[i].split("=");
                    param[item[0]] = decodeURIComponent(item[1]);
                }
            }
            var tagId = param.tId;
            //事件埋点
            comm.creatEvent({
                async: false,
                triggerType: "标签",
                keyword: tagId,
                actionId: 79
            });
        }
    })
}
function getCommentHeadImg() {
    var _src = $('.al-userCommentImg img').attr('src');
    if (_src && _src.indexOf('comment_user.png') > -1) {
        var data = {};
        var params = {};
        data.customerId = $("#sesCustomerId").val();
        params.paramJson = $.toJSON(data);
        $.ajax({
            url: PC_CALL + 'customer/unite/getMapById/',
            data: params,
            type: 'post',
            dataType: 'json',
            success: function (data) {
                if (data && data.responseObject.responseData && data.responseObject.responseData.data_list && data.responseObject.responseData.data_list.length > 0) {
                    logoUrl = data.responseObject.responseData.data_list[0].customer_att.logoUrl;
                    $('.al-userCommentImg img').attr('src', logoUrl);
                }
            }
        })
    }
}
 function column(){//所属栏目展示
    $.ajax({//评分接口请求
        url: PC_CALL + "special/getResourceSpecial/",
        type: "POST",
        dataType: "json",
        data: {
            paramJson: $.toJSON({
                "isValid": "1",
                "visitSiteId": "1",
                resourceId:$("#resourceId").val(),
                resourceType:$("#resourceType").val()
                // resourceId:$("#resourceId").val(),	//string	是
                // resourceType:$("#resourceType").val()//	string	是
            })
        },
        success: function (data) {
            if(!$.isEmptyObject(data)){
                var resourceData = data.responseObject.responseData.data_list[0];
                if(resourceData.specialId){
                    var jumpObj = $(".ev-column");
                    jumpObj.attr({"href":"/pages/discover/discover_feature_detail.html?columnId="+resourceData.specialId}).find("img").attr({"src":resourceData.attUrl});
                    jumpObj.on("click",function(){
                        comm.creatEvent({
                            triggerType: "功能按钮",
                            keyword: "所属栏目",
                            actionId: 11042
                        });
                    });
                    $(".ev-theColumn").show();
                }
                $(".ev-take-part").off("click").on("click",function(){
                    var templateStr = '<!--弹层反馈-->'+
                        '<section class="feedbackPopup">'+
                        '<aside class="feedbackCont">'+
                        '<p class="close ev-close-tips" style="cursor: pointer;">'+
                        '	<img src="//img10.allinmd.cn/v3/common/icon/icon_close.png">'+
                        '</p>'+
                        '<p class="introduction">'+
                        '	菁英课堂下期将邀请张老师进行讲授，您想听什么内容呢？请告诉我们~'+
                        '</p>'+
                        '<textarea class="ev-column-text" style="resize: none;"></textarea>'+
                        '<p class="al-submit">'+
                        '	<i>提交</i>'+
                        '</p>'+
                        '</aside>'+
                        '</section>'+
                        '<!--弹层反馈 end-->';
                    $("body").append(templateStr);
                    $(".ev-close-tips").off("click").on("click",function(){
                        $(".feedbackPopup").hide().remove();
                    });
                    $(".ev-column-text").off("input propertychange").on("input propertychange",function(){
                        var isThis = $(this);
                        if(isThis.val().length){
                            $(".al-submit i").addClass("active").off("click").on("click",function(){
                                var param = {"customerId":$("#sesCustomerId").val(),"suggestion":isThis.val(),"visitSiteId":1,"suggestionType":2};
                                var callBack = function(){

                                };
                                var options = {
                                    postData: param,
                                    success: callBack,
                                    port: "/call/customer/suggestion/create/"
                                };
                                $.ajax({
                                    url: options.port,    //请求的url地址
                                    dataType: "json",   //返回格式为json
                                    async:false, //请求是否异步，默认为异步，这也是ajax重要特性
                                    data: {paramJson:$.toJSON(options.postData)},    //参数值
                                    type: "POST",   //请求方式
                                    beforeSend: function () {
                                        //请求前的处理
                                        comm.LightBox.showloading();
                                    },
                                    success: function (data) {
                                        if(data.responseObject.responseStatus){
                                            $(".ev-close-tips").trigger("click");
                                        }
                                    }
                                })
                            });
                        }else{
                            $(".al-submit i").removeClass("active").off("click");
                        }
                    }).textareaAutoHeight({minHeight:70,maxHeight:195});
                });
            }


        }
    });
}
$(function () {
  /*  setTimeout(function(){
        showLabel();
    },1000);*/
        //页面获取值 资源id与资源类型
        var refId = $("#resourceId").val(), refTy = parseInt($("#resourceType").val());
        var videoType = $("#videoType").val();
        var ebookType = $("#ebookType").val();
        var tplPath = $("#resourceTpl").val();
        //相关产品
        if (refTy != 4) {
            relatedProducts();
        }
        function qiniuVideoHandle(refType, refId, obj) { //七牛视频图片处理
            if (obj.length > 0 && $.trim(obj.attr("data-qiniuId")).length > 0) { //如果存在视频区域
                var params = {};
                params.paramJson = $.toJSON({
                    refType: refType,
                    refId: refId,
                    attUseFlag: 10,
                    qiniuId: obj.attr("data-qiniuId")
                });
                $.ajax({url: PC_CALL + "qiniu/storage/getMapVideoList/", type: "get", data: params}).done(succ);
            } else if (obj.length > 0 && $.trim(obj.attr("data-qiniuId")).length == 0) {
                obj.children().hide();
                if (refType == 7 || refType == 4) {
                    obj.append('<img src="//img10.allinmd.cn/default/qiniu900_600.jpg">');
                }
            }
            function succ(res) {
                if (!res.responseObject.responseStatus) {
                    obj.remove();
                    return false;
                }
                if (obj.length > 0 && res.responseObject.responseStatus && res.responseObject.responseData.videoListMap.length > 0) {
                    var data = res.responseObject.responseData.videoListMap[0];
                    if (data.qiniuStatus == 2) {
                        //图片替换
                        $("figure img", obj).attr("src", data.logoUrl);
                        $("figure span", obj).text(data.playTime);
                        obj.attr("data-videoSrc", data.attUrl).on("click", function () {
                            module.backgroundVideo({videoSrc: $(this).attr("data-videosrc")});
                        });
                    } else if (data.qiniuStatus == 4) {//转码失败
                        obj.children().hide();
                        obj.append('<img src="//img10.allinmd.cn/default/qiniuFailing900_600.png">');
                    } else {
                        obj.children().hide();
                        obj.append('<img src="//img10.allinmd.cn/default/qiniu900_600.jpg">');//$(".Ev-videoPic")
                    }
                }
            }
        }

    //唯医3.7付费课相关参数方法开始
    var payForClass = {
        el:{
            chatContainer:$("#reviewArea"),
            mainContent:$(".al-mainContent"),
            collegeSideBar:$(".al-college-sideBar"),
            videoChargeBox:$("#charge"),
            videoBox:$("#video #a1"),
            downLoadApp:$(".al-followCase"),
            discountCoupon:$(".al-receive-coupon"),
            buyCourse:$(".al-buyCourse-btn")
        },
        data:{
            customerId:$('#sesCustomerId').val()!=""&&$('#sesCustomerId').val()!=undefined?$('#sesCustomerId').val():"",
            videoInfo:{},
            couponInfo:{},
            videoId:$("#resourceId").val()
        },
        path:{
            coupon:PC_CALL+'coupon/getMaxReceivableCoupon/'
        },
        getCouponEvent:function(){
            var _this = this;
            _this.el.discountCoupon.off("click").on("click",function(){
                user.login({
                    callback: function () {
                        $(".al-downLoadContent figcaption").text('\n' +
                            '更多大额优惠券，打开唯医骨科app查看');
                        $('.Ev-al-downLoad_PopBox').show();
                        $("body").css({"overflow":"hidden"});
                    },
                    onClose: function () {

                    },
                    scene: privilegeSceneConst.eSceneTypeAuth,
                    noAuthTip:1
                });
            });
            _this.el.buyCourse.off("click").on("click",function(){
                console.log(_this.el.buyCourse);
                user.login({
                    callback: function () {
                        $('.Ev-al-downLoad_PopBox').show();
                        $("body").css({"overflow":"hidden"});
                    },
                    onClose: function () {

                    },
                    scene: privilegeSceneConst.eSceneTypeAuth,
                    noAuthTip:1
                });
            });
            $(".Ev-closePopBtn").on("click",function () {
                $('.Ev-al-downLoad_PopBox').hide();
                if($('.al-mainContent').attr('data-collegecoursestate')==1){
                    $(".al-downLoadContent figcaption").text('\n' +
                        '打开唯医骨科app，尽享唯医学院精品内容');
                }else {
                    $(".al-downLoadContent figcaption").text('\n' +
                        '扫一扫，安装手机客户端免费下载视频');
                }
                $("body").css({"overflow":"auto"});
            });
            return _this;
        },
        getCoupon:function(){
            var _this = this;
            var factoryOnOff = TempCache.getItem("customerRole") && (TempCache.getItem("customerRole")=="14" || TempCache.getItem("customerRole")=="15")?true:false;
            if(parseInt(payForClass.data.videoInfo.payState,10)===0&&(!factoryOnOff)){
                comm.ajax.async(_this.path.coupon, {
                    paramJson:$.toJSON({
                        customerId:_this.data.customerId?_this.data.customerId:'',
                        productId:payForClass.data.videoInfo.courseId
                    })
                }, function (data) {
                    if(data&&data.responseObject&&data.responseObject.responseData){
                        _this.data.couponInfo = data.responseObject.responseData;
                        _this.checkCouponStatus();
                    }else{
                        _this.checkCouponStatus();
                    }
                },'true',function(){},'GET');
            }
            return _this;
        },
        checkCouponStatus:function(){
            var _this = this;
            if($.isEmptyObject(_this.data.couponInfo)){
                //未配置优惠券
                _this.el.discountCoupon.remove();
            }else{
                _this.el.discountCoupon.find(".coupon-strategy").text(_this.data.couponInfo.displayName);
                _this.el.discountCoupon.find(".price-num").text(_this.data.couponInfo.couponDenomination);
                _this.el.discountCoupon.find(".price-num").addClass("price-num"+(_this.data.couponInfo.couponDenomination+'').length);
                _this.el.downLoadApp.css({marginTop:"345px"});
                _this.el.discountCoupon.show();
                //配置优惠券
            }
            return _this;
        },
        checkCourseInfo:function(){
          var _this = this;
            var pcCoverImgUrl = _this.data.videoInfo.pcCoverImgUrl;
            var courseId = _this.data.videoInfo.courseId;
            var courseName = _this.data.videoInfo.courseName;
            if(!comm.checkInvalid(courseId)){
                _this.el.collegeSideBar.find(".college-logo").css({"background":"url('"+pcCoverImgUrl+"') no-repeat center center/cover"});
                _this.el.collegeSideBar.find(".al-college-courseTitle").html(courseName);
                _this.el.collegeSideBar.show().attr({"data-courseId":courseId});
            }
          return _this;
        },
        checkVideoPayType:function(){
            var _this = this;
            var collegeCourseState = _this.data.videoInfo.cms_video.collegeCourseState;
            var payType = _this.data.videoInfo.cms_video.payType;
            /*if(parseInt(_this.data.videoInfo.payState,10)){
                //1代表已购买
                collegeCourseState = 0;
                _this.data.videoInfo.cms_video.collegeCourseState = 0;
            }else{
                //代表未购买
            }*/
            _this.el.mainContent.attr({'data-collegeCourseState':collegeCourseState,'data-payType':payType});
            if(parseInt(collegeCourseState , 10)===1){
                $(".al-downLoadContent figcaption").text('\n' +
                    '打开唯医骨科app，尽享唯医学院精品内容');
                _this.el.chatContainer.addClass('al-college-payCourse');
                $(".al-myScorePart *").unbind();
                $(".al-myScorePart").off("click").on("click",function(){
                    user.login({
                        callback: function () {
                            $('.Ev-al-downLoad_PopBox').show();
                            $("body").css({"overflow":"hidden"});
                        },
                        onClose: function () {

                        },
                        scene: privilegeSceneConst.eSceneTypeAuth,
                        noAuthTip:1
                    });
                });
            }else {
                $(".al-downLoadContent figcaption").text('\n' +
                    '扫一扫，安装手机客户端免费下载视频');
            }

            $(".Ev-closePopBtn").on("click",function () {
                $('.Ev-al-downLoad_PopBox').hide();
                $("body").css({"overflow":"auto"});
            });
            ////console.log('解绑事件');
            $("body").addClass('al-main-payBody');
            if(parseInt(collegeCourseState,10)){//是付费课
                _this.getCoupon().checkCourseInfo();
                ////console.log(payType);
                if(parseInt(payType,10)){
                    //是付费课，但是是免费课，可以试看的视频，与原有逻辑基本保持不变
                }else{
                    //是付费课，不是免费课，这时候整个页面视频就不能播放了，整个页面就不算一个视频终端页
                    _this.el.videoBox.remove();
                    ////console.log(_this.el.videoChargeBox);
                    _this.el.videoChargeBox.show();

                }
                $(".ev-detailReviewForm").remove();
            }else{
                //不是付费课，也就是原有的视频终端页，逻辑不做任何调整
                $(".ev-detailReviewForm").show();
            }

            return _this;
        },
        initElement:function(){
          var _this = this;
            var payState = _this.data.videoInfo.college.payState;
            var courseType = _this.data.videoInfo.college.courseType;//1单视频付费，2专栏付费，3会员付费
            var textStr = '购买后可继续学习观看';
            var btnStr = '';
            var vipBtnStr = '';
            var hideClassName = "hide ";
            var hideIconClassName = "";
            if(parseInt(payState,10)){
                textStr = '前往唯医骨科App学习观看';
                btnStr = '立即前往';
                hideIconClassName = "hideIcon ";

            }else{
                if(parseInt(courseType,10)===1){
                    btnStr = "原价购买："+_this.data.videoInfo.college.originalPrice+"元";
                    vipBtnStr = "会员购买："+_this.data.videoInfo.college.discountPrice+"元";
                    hideClassName = "";
                }else if((parseInt(courseType,10)===2)||(parseInt(courseType,10)===3)){
                    //跟之前付费课程逻辑相同
                    btnStr = '购买课程';
                }
            }
          $(".al-sideBar_shareBox").after("<div class=\"al-college-sideBar\" style='display: none;'>\n" +
              "                <h1 class=\"college-title\">学院课</h1>\n" +
              "                <section class=\"al-college-logo\">\n" +
              "                    <figure class=\"college-logo\"></figure>\n" +
              "                </section>\n" +
              "                <section class=\"al-college-courseTitle\">王岩 | TKA通识30讲TKA通识30讲TKA通识30讲</section>\n" +
              "            </div>");
          $("#video").append("<section class=\"al-charge-video\" id=\"charge\" style='display: none;'>\n" +
              "                                <div class=\""+hideIconClassName+"al-charge-warn\">\n" +
              "                                    <i class=\"icon\"></i>\n" +
              "                                    <span class=\"des\">"+textStr+"</span>\n" +
              "                                </div>\n" +
              "                                <div class=\""+hideClassName+"al-buyCourse-btn vip-btn\">"+vipBtnStr+"</div>\n" +
              "                                <div class=\"al-buyCourse-btn\">"+btnStr+"</div>\n" +
              "                            </section>");
          $(".al-sideBar_commentBox").after(" <!--领取优惠券开始-->\n" +
              "                <section class=\"al-receive-coupon\" style=\"display: none;\">\n" +
              "                    <div class=\"couponPrice\">\n" +
              "                        <i class=\"icon\">￥</i>\n" +
              "                        <span class=\"price-num\">60</span>\n" +
              "                    </div>\n" +
              "                    <div class=\"receive-coupon\">\n" +
              "                        <div class=\"coupon-strategy\">满200减60学院券</div>\n" +
              "                        <div class=\"getStrategyBtn\">立即领取</div>\n" +
              "                    </div>\n" +
              "                </section>\n" +
              "                <!--领取优惠券结束-->");
          _this.el = {
              chatContainer:$("#reviewArea"),
              mainContent:$(".al-mainContent"),
              collegeSideBar:$(".al-college-sideBar"),
              videoChargeBox:$("#charge"),
              videoBox:$("#video #a1"),
              downLoadApp:$(".al-followCase"),
              discountCoupon:$(".al-receive-coupon"),
              buyCourse:$(".al-buyCourse-btn")
          };
          return _this;
        },
        init:function(original){
            var _this = this;
            _this.data.videoInfo = original;
            _this.initElement().checkVideoPayType().getCouponEvent();
        }
    };
    //唯医3.7付费课相关参数方法结束

        //病例页
        if (refTy == 7) {/////////////////////////查看病例视频方法
            // $.each($(".Ev-videoPic"), function (i, em) {
            //     qiniuVideoHandle(7, refId, $(em));
            // });
            //查看病例视频，转码后处理
            // 2019-04-15 病例页倒计时返回首页
            if(TempCache.getItem("customerRole") && (TempCache.getItem("customerRole")=="14" || TempCache.getItem("customerRole")=="15")){
                comm.alertBox({
                    title:"此功能仅向医务人员开放",
                    content:"<span id='jumpCountDown'>3</span>秒后将返回首页"
                })
				setTimeout(function(){
					if(typeof g_sps!= "undefined"){
						g_sps.jump(null,"/");
					}else{
						window.location.href = "/";
					}
				},3000);

				var leftTime = 3;
				function countdown(){
					if(leftTime>0){
						setTimeout(function(){
							countdown();
							leftTime--;
						},1000);
						$("#jumpCountDown").text(leftTime);
					}
				}
				countdown();
            }




            $(".surgery").each(function(){
                $(this).find(' .videoPlayBtn').each(function(){
                    $(this).off("click").on("click",function(){
                        var isThis = $(this);
                        if(isThis.parents('.videoImg').attr("data-src").length>5){
                            module.backgroundVideo({videoSrc: isThis.parents('.videoImg').attr("data-src")});
                        }else{
                            return false;
                        }

                    })

                });
            });

            //所有查看大图功能
            var listProduce = function(container){
                var imgList = [];
                var imgBox = container.attr("data-srclist").split(",");
                var imgNameBox = container.attr("data-attnamelist").split("@_@");
                $.each(imgBox,function(i,v){
                    var str = v;
                    var start = str.indexOf('_c');
                    var endNum = str.lastIndexOf('.');
                    var imgStr = str.substring(0,start+2)+str.substring(endNum,str.length);
                    if(start>-1){
                        v = imgStr;
                    }
                    imgList.push({id:i,url:v,attName:imgNameBox[i]});
                });
                return imgList;
            };
            $(document).on("click", ".viewBigImg", function (e) {
                var container = $(this);
                var index = 0;
                if ($(e.target).parents().eq(0).index() > 0) {
                    index = $(e.target).parents().eq(0).index();
                }

                if(container.attr("data-srclist")||$(e.target).prev().attr("data-srclist")){
                    var imgList = listProduce(container);
                    module.viewBigImgAll({
                        container:container,
                        typeTitle: "",
                        imgListType:'caze',
                        id: index,
                        imgList:imgList
                    });
                }else{
                    module.viewBigImgAll({event: e, container: container, index: index});
                }

            });
            $(".surgery").find('.viewBigImg').next().on("click", function () {
                var isThis = $(this);
                var imgList = listProduce(isThis.prev());
                module.viewBigImgAll({
                    container:isThis.prev(),
                    typeTitle: "",
                    imgListType:'caze',
                    id: 5,
                    imgList:imgList
                });
            });
        }
        //话题页
        if (refTy == 4) {
            qiniuVideoHandle(4, refId, $(".Ev-videoPic"));
            //所有查看大图功能
            $(document).on("click", ".viewBigImg", function (e) {
                var container = $(this);
                var index = 0;
                if ($(e.target).parents().eq(0).index() - 1 > 0) {
                    index = $(e.target).parents().eq(0).index() - 1;
                }
                module.viewBigImgAll({event: e, container: container, index: index});
            });
        }
        if (refTy == 2 && ebookType == 18) {//电子书文章终端 span标签样式控制
            document.oncontextmenu = function () {//禁止复制粘贴
                event.returnValue = false;
            };
            document.onselectstart = function () {
                event.returnValue = false;
            };
            $("body").find("style").remove();
            $(".al-textDetails_main p>img").attr("style", "");
            $(".al-textDetails_main p span").attr("style", "").removeClass('s1 s2 s3 s4 s5');
            $(".al-textDetails_main a>img").attr("style", "width:auto;");
        }
        if(refTy ==2 && $('#resourceTpl').val()==52){
            $("body").removeClass('b1 b2 b3');
            $(".al-textDetails_main p span").attr("style", "").removeClass('s1 s2 s3 s4 s5');
        }

        //针对病例、话题、文库结束
        var controller = {
            rightInfoOnOff:true,
            path: {
                recommendUrl: PC_CALL + "video/listInTag/",//推荐视频
                getMapByIdVideo: PC_CALL + "video/getMapById3/",//右侧所属活动，关注的人
                getMapByIdTopic: PC_CALL + "topic/baseinfo/getMapById3/",//右侧所属活动，关注的人
                getMapByIdCase: PC_CALL + "case_baseinfo/getMapById3/",//右侧所属活动，关注的人
                getMapByIdDoc: PC_CALL + "customer/doc/getMapById3/",//右侧所属活动，关注的人
                follow: PC_CALL + "customer/follow_resource/create/", //关注
                cancelFollow: PC_CALL + "customer/follow_resource/delete/", //取消关注
                praise: PC_CALL + "prefer/create/", 	  //赞
                praiseCancel: PC_CALL + "prefer/delete/", //取消赞
                collect: PC_CALL + "collection/create/", //收藏
                collectCancel: PC_CALL + "collection/delete/",//收藏取消
                tCFollowList: PC_CALL + "customer/follow_resource/getMapListByRef/",//病例话题的关注列表
                shareDes: PC_CALL + "comm/data/share/getMapList3/",//分享话术
                docListUrl: PC_CALL + "customer/doc/getMapByDocList/",
                correctionURL: PC_CALL + "customer/correct/create/",//乱码反馈
                addBrowseNum: PC_CALL + 'follow/addBrowseNum/',//增加浏览数量
                getAuthorDoc:PC_CALL+"customer/doc/getMapAuthorList/",//文库编者译者请求接口
                tagUrl:PC_CALL+"cms/resource_property/jsonList/"//终端页标签接口
            },
            init: function () {
                var t = this;
                t.discussClick();
                t.corReport();
                t.readClick();
                t.updateViewdNum();//增加浏览数
                if ((refTy == 1)||(refTy == 7)) {//视频//20180607添加病例终端页情况下的相关资源请求，类型为7，张恒
                    if(parseInt(refTy,10)===7){
                        t.path.recommendUrl = '//www.allinmd.cn/call/case_baseinfo/listInTag/'
                    }
                    t.recommendVideoList();
                    if (videoType&&videoType != 19) {
                        t.getParam();
                        t.shareLoginState();
                    }
                }
                if (refTy == 2 || refTy == 7) {/*文库终端属于系列课*/
                    if (refTy == 2) {//文库
                        t.readClick();
                        t.changeOe();//OE文档切换
                        if (ebookType == 18) {//电子书文章终端页
                            t.videoPlayEvent();  //电子书文章终端页存在视频的处理
                        }else{
                            t.authorType=0;   //译者列表筛选:0-全部,2-主译,6-副主译,7-参与人员
                            t.pageOrPopFlag=0;//区别初始化和弹层点击
                            t.compilerEvent();//编者译者处理ajax
                        }
                    }
                    t.series();
                }
                t.floatCard();//右侧名片悬浮
                t.messyCodeFeedBack(); //PDF文档乱码反馈
                t.tagListAjax();//20181114终端页标签从模板生成变更成动态接口请求
            },
            //标签改成ajax请求获取
            tagListAjax:function(){
                var t=this;
                $.ajax({
                    url: t.path.tagUrl,
                    type: 'get',
                    data: {paramJson:$.toJSON({
                            resourceType:refTy,
                            resourceId:refId,
                            isValid:1,
                            vFlag:4
                    })},
                    success: function (data) {
                        if (comm.hasResponseData(data)) {
                            if(data.responseObject.responseData.dataList
                                &&data.responseObject.responseData.dataList.length>0){
                                $(".al-tagBox").show();//有标签数据的时候，标签外框展示
                                $(".video_tag_main,.video_tag_title").show();
                                var items=data.responseObject.responseData.dataList;
                                var html="";
                                $.each(items,function (i, kv) {
                                    if(tplPath==34||tplPath==33||tplPath==80) {//joa  oe joav2的文库里的标签格式
                                        if(kv.propertyType==4) {//组织的类型标签
                                            html+='<li>'+
                                                '<div class="bq_left"></div>'+
                                                '<div class="bq_center">'+
                                                '<a  href="//www.allinmd.cn/pages/channel/organization-home.html?cid='+kv.propertyId+'">'+
                                            '<i class="al-terminalOrgTag">' +
                                            '<img src="'+(kv.propertyLogoUrl?kv.propertyLogoUrl:'//img10.allinmd.cn/v3/terminal/organization_defaultIcon.png')+'">' +
                                            '</i>' +comm.getStrLen(kv.propertyName,20)+'</a>'+
                                                '</div>'+
                                                '<div class="bq_right"></div>'+
                                                '</li>';
                                        }else{
                                            html+='<li>'+
                                                '<div class="bq_left"></div>'+
                                                '<div class="bq_center">'+
                                                '<a  href="//www.allinmd.cn/pages/discover/discover_tagSubject.html#tId='+kv.propertyId+'">'+comm.getStrLen(kv.propertyName,20)+'</a>'+
                                                '</div>'+
                                                '<div class="bq_right"></div>'+
                                                '</li>';
                                        }

                                    }else{//出去joa  joav2 OE的其他终端页标签格式
                                        if(kv.propertyType==4){//组织的类型标签
                                            html+=' <a href="//www.allinmd.cn/pages/channel/organization-home.html?cid='+kv.propertyId+'">' +
                                                '<i class="al-terminalOrgTag">' +
                                                '<img src="'+(kv.propertyLogoUrl?kv.propertyLogoUrl:'//img10.allinmd.cn/v3/terminal/organization_defaultIcon.png')+'"></i>' +
                                                '<span class="al-terminalTagSpan">'+comm.getStrLen(kv.propertyName,20)+'</span>' +
                                                '</a>';
                                        }else{
                                            html+=' <a href="//www.allinmd.cn/pages/discover/discover_tagSubject.html#tId='+kv.propertyId+'">'+comm.getStrLen(kv.propertyName,20)+'</a>';
                                        }

                                    }
                                });
                                if($(".al-tagBox").length){
                                    $(".al-tagBox").html('<figcaption>标签</figcaption>'+html);
                                }
                                if($(".video_tag_main").length){//joa  oe joav2的文库里有标签
                                    $(".video_tag_main ul").html(html+'<div class="clear"></div>');
                                }else{//joa  oe joav2的文库里没有标签  先增加格式再添加标签
                                    $(".video_tag_errRight").before('<div class="video_tag_title">标签</div>' +
                                        '<div class="video_tag_main"><ul></ul></div>');
                                    $(".video_tag_main ul").html(html+'<div class="clear"></div>');
                                }
                                showLabel();//处理标签逻辑
                            }else{
                                $(".al-tagBox").hide();//没有标签数据的时候，标签外框隐藏
                                if($(".video_tag_main").length) {//joa  oe joav2的文库里原本模板有标签  接口现在没有了
                                    $(".video_tag_main,.video_tag_title").hide();
                                }
                            }
                        }else{
                            $(".al-tagBox").hide();//没有标签数据的时候，标签外框隐藏
                            if($(".video_tag_main").length) {//joa  oe joav2的文库里原本模板有标签  接口现在没有了
                                $(".video_tag_main,.video_tag_title").hide();
                            }
                        }
                    }
                });
            },
            //编者译者处理
            compilerEvent:function (kv) {
              var t=this;
              var param={
                  customerId:$('#sesCustomerId').val(),
                  docId:refId,  //传书籍id,在主页接口获取书籍id
                  logoUseFlag:4,   //传图片大小
                  visitSiteId:1,  //访问途径
                  firstResult:0,
                  maxResult:99,
                  authorType:t.authorType     //译者列表筛选:0-全部,2-主译,6-副主译,7-参与人员

              };
              var cBack=function (rep) {
                  if(comm.hasResponseData(rep)){
                      var items=rep.responseObject.responseData;
                      var _authType="";
                      if(items.authorType){//判断类型进行检测，显示筛选项
                          _authType=items.authorType.split(",");
                          $.each(_authType,function (i,e) {
                              $(".ev-screeningBox li[data-id=0]").show();//全部按钮
                              $(".ev-screeningBox li[data-id="+e+"]").show();
                          });
                      }
                      //列表请求
                      if(items.data_list&&items.data_list.length&&items.total_count) {
                          var data_list = items.data_list;
                          var html="",html2="",arrHT=[],numFlag=false,twoAuthTypeNum=0;
                          var helplessNum = 3;//区别有没有第一作者，有第一作者索引向后顺延一个
                          $.each(data_list,function (i,e) {
                              var _v=e.authorType;//排除不属于状态
                              if(t.pageOrPopFlag==0) {
                                  if (data_list.length <= 3) {//如果小于三组参与者
                                      if (_v!=1&&_v!=5&&_v!=6&&_v!=10&&_v!=11&&_v!=14&&_v!=15&&_v!=16&&_v!=17) {
                                          html2 = "";
                                          $.each(e.data_list, function (k, v) {
                                              if (e.data_list.length <= 3) {//不多于三人的情况
                                                  html2 += '<span><a href="'+(v.customerId&&v.customerId!=0?'/pages/personal/others_contribution.html?cid=' + v.customerId:'javascript:;') + '" target="_blank">' + v.authorName + '</a></span>';
                                              } else {
                                                  if (k < 3) {
                                                      html2 += '<span>' + v.authorName + '</span>';
                                                  } else {//显示等多少人
                                                      numFlag = true;
                                                  }
                                              }
                                          });
                                          html += (html2?'<p class="ev-cMoreTranList">' + e.authorTypeName + '：' + html2 + '</p>':'');
                                      }
                                  } else {//大于三组参与者，显示等多少人
                                      numFlag = true;
                                      if (i<3&&_v==1||_v==5||_v==6||_v==10||_v==11||_v==14||_v==15||_v==16||_v==17) {
                                          helplessNum = 4;
                                      }
                                      if (_v!=1&&_v!=5&&_v!=6&&_v!=10&&_v!=11&&_v!=14&&_v!=15&&_v!=16&&_v!=17) {
                                          if (i < helplessNum) {
                                              html2 = "";
                                              $.each(e.data_list, function (k, v) {
                                                  if (k < 3) {
                                                      html2 += '<span>' + v.authorName + '</span>';
                                                  }
                                              });
                                              html += (html2?'<p class="ev-cMoreTranList">' + e.authorTypeName + '：' + html2 + '</p>':'');
                                          }
                                      }
                                  }
                              }
                              if(_v!=1&&_v!=5&&_v!=6&&_v!=10&&_v!=11&&_v!=14&&_v!=15&&_v!=16&&_v!=17) {//排除第一作者和转载(和不属于文库的类型)
                                  t.morePeopleFun(arrHT, e.data_list);
                              }else{
                                  twoAuthTypeNum+=e.data_list.length;
                              }
                          });
                          if(numFlag){
                              html=html+'<p class="ev-cMoreTranList"><span>等<b> '+(items.total_count-twoAuthTypeNum)+' </b>人</span></p>';
                          }
                          if(t.pageOrPopFlag==0){
                              $(".ev-authorSeries").html(html);
                          }
                          $('.al-translatorIntrItemBox').html(arrHT);
                          if(numFlag){
                              $(".ev-authorSeries").find("a").attr("href","javascript:;");
                              t.cMoreTranListEve();//弹层存在的点击事件
                              t.bindTransformerType();//译者列表筛选点击操作处理
                          }
                      }
                      //总数有多少
                      if(t.pageOrPopFlag==0&&items.total_count){//全部
                          var total_count=items.total_count-twoAuthTypeNum;
                          $('.al-transformerNum').text(total_count);
                      }
                  }
              };
              comm.ajax.async(t.path.getAuthorDoc,{paramJson:$.toJSON(param)},cBack);
            },
            //更多参与者的列表点击事件
            cMoreTranListEve:function () {
                var t=this;
                $('.ev-cMoreTranList').off("click").on('click',function(){
                    $('.al-translatorListPop').show();
                });
                $('.closeBtn').off("click").on('click',function(){
                    $('.al-translatorListPop').hide();
                });
                $(".ev-noAllinDoctor").off("click").on('click',function(){
                    $.topTip({mark:"warn",showTime:"1.5",content:"该用户尚未注册唯医！"});
                });
            },
            //译者列表筛选点击操作处理
            bindTransformerType:function(){
                var t=this;
                $(".al-translatorSelectPart").off("click").on("click",function(e){
                    if (e.target.nodeName.toLocaleLowerCase()=='span'){
                        if($(e.target).hasClass('showAll')){
                            $('.al-translatorSelectPart ul').hide();
                            $(e.target).removeClass('showAll');
                            $('.al-translatorSelectPart b').removeClass('al-upArrowIcon');
                        }else{
                            $('.al-translatorSelectPart ul').show();
                            $(e.target).addClass('showAll');
                            $('.al-translatorSelectPart b').addClass('al-upArrowIcon');
                        }
                    } else if(e.target.nodeName.toLocaleLowerCase()=='b'){
                        if($('.al-translatorSelectPart span').hasClass('showAll')){
                            $('.al-translatorSelectPart ul').hide();
                            $('.al-translatorSelectPart span').removeClass('showAll');
                            $(e.target).removeClass('al-upArrowIcon');
                        }else{
                            $('.al-translatorSelectPart ul').show();
                            $('.al-translatorSelectPart span').addClass('showAll');
                            $(e.target).addClass('al-upArrowIcon');
                        }
                    } else if (e.target.nodeName.toLocaleLowerCase()=='li'){
                        $(e.target).addClass('active').siblings().removeClass('active');
                        $('.al-translatorSelectPart ul').hide();
                        $('.al-translatorSelectPart b').removeClass('al-upArrowIcon');
                        $('.al-translatorSelectPart span').text($(e.target).text()).removeClass('showAll');
                        t.authorType=$(e.target).data('id');
                        t.pageOrPopFlag=1;
                        t.compilerEvent();
                        //事件埋点
                        comm.creatEvent({
                            triggerType:"译者筛选项",
                            keyword:$(e.target).text(),
                            actionId:71
                        });
                    }
                });
            },
            //查看更多人的
            morePeopleFun:function (arrHT,data) {
                //弹层显示的所有列表
                for(var i=0;i<data.length;i++){
                    var dataItem = data[i];
                    arrHT.push(module.compilerList({ tempName: "userList" })({
                        cid: dataItem.customerId, //用户id
                        customerId: TempCache.getItem('userId'), //当前人ID
                        userName: dataItem.authorName, //用户名
                        logoUrl: dataItem.url, //头像
                        state: dataItem.state, //认证状态
                        medicalTitle:dataItem.medicalTitle, //职称
                        company: dataItem.company, //医院
                        relationship: dataItem.relationship, //关注关系
                        terminalFlag:1
                    }));
                }
                return arrHT;
            },
            //OE文档中英文切换
            changeOe: function () {
                if ($(".ch_en")) {
                    $(".ch_en").toggle(
                        function () {//切换成中文
                            $(this).find(".ch_en_center").text("切换到英文版");
                            $(".oe_ch").show();
                            $(".oe_en").hide();
                        },
                        function () {//切换成英文
                            $(this).find(".ch_en_center").text("切换到中文版");
                            $(".oe_ch").hide();
                            $(".oe_en").show();
                        }
                    );
                }
            },
            updateViewdNum: function () {
                var t = this;
                $.ajax({
                    url: t.path.addBrowseNum,
                    type: 'post',
                    data: {
                        refId: refId,
                        usefulType: refTy
                    },
                    success: function (data) {
                        if (data) {
                            $('#lib_rq_num').text(data.rows.responseMessage).parent().fadeIn();
                        }
                    }
                });
            },
            //PDF文档乱码反馈
            messyCodeFeedBack: function () {
                var t = this;
                if (tplPath == 31 || tplPath == 32 || tplPath == 78 || tplPath == 127) {
                    $(".Ev-correction").before('<a href="javascript:;" class="al-messyCodeFeedBack ev-messyCodeFeedBack" data-flag="1">乱码反馈</a>');
                    $(document).off("click").on("click", function (e) {
                        if ($(e.target).is(".ev-messyCodeFeedBack")) {//反馈显示
                            if ($(e.target).attr("data-flag") == 1) {//可以点击进行反馈
                                $(e.target).attr("data-flag", "0");
                                if (!$(".ev-dislikeDialog").length) {
                                    $(e.target).after('<section class="dislikeDialog ev-dislikeDialog"><img src="/js/modules/dislikeAction/images/triangle.png">' +
                                        '<span class="des" style="">文章乱码，确定反馈吗？</span>' +
                                        '<span class="dislikeBtn ev_dislikeBtn" data-flag="1">确定</span></section>');
                                } else {
                                    $(".ev-dislikeDialog").show();
                                }
                            }
                        } else if (!$(e.target).is(".ev-dislikeDialog") && !$(e.target).parents().is(".ev-dislikeDialog")) {//点击其他区域关闭
                            $(".ev_dislikeBtn").attr("data-flag", "1");
                            $(".ev-messyCodeFeedBack").attr("data-flag", "1");
                            $(".ev-dislikeDialog").hide();
                        }
                        if ($(e.target).is(".ev_dislikeBtn")) {  //确定按钮点击
                            if ($(e.target).attr("data-flag") == 1) {
                                $(e.target).attr("data-flag", "0");

                                var callback = function (rep) {
                                    if (comm.hasResponseMessage(rep)) {
                                        comm.alertBox({
                                            title: "反馈成功",
                                            content: "感谢您的反馈我们会尽快处理",
                                            ensure: "继续浏览",
                                            ensureCallback: function () {
                                                $(".ev_dislikeBtn").attr("data-flag", "1");
                                                $(".ev-messyCodeFeedBack").attr("data-flag", "1");
                                                $(".ev-dislikeDialog").hide();
                                            }
                                        });
                                    }
                                };
                                comm.ajax.async(t.path.correctionURL, {
                                    paramJson: $.toJSON({
                                        resourceType: refTy,
                                        resourceId: refId,
                                        visitSiteId: 1,
                                        reviewId: 0,
                                        dataFlag: 2,
                                        isValid: 1,
                                        correction: JSON.stringify([{
                                            correctContentOrigin: "乱码反馈",
                                            correctContentSuggest: "乱码反馈"
                                        }])
                                    })
                                }, callback);
                            }
                        }
                    });
                }
            },
            //系列课程：张恒
            series: function () {
                var t = this;
                var operateData = {
                    pageName: function () {
                        var a = location.href;
                        var b = a.split("/");
                        var c = b.slice(b.length - 1, b.length).toString(String).split(".");
                        return c.slice(0, 1);
                    },
                    requestData: function (options) {
                        var postType = (options.get) ? "GET" : "POST";//默认是post方式，除非特别传参指名要get方式。
                        var postData = {"paramJson": $.toJSON(options.postData)};
                        $.ajax({
                            url: options.port,    //请求的url地址
                            dataType: "json",   //返回格式为json
                            async: true, //请求是否异步，默认为异步，这也是ajax重要特性
                            data: postData,    //参数值
                            type: postType,   //请求方式
                            beforeSend: function () {
                                //请求前的处理
                            },
                            success: function (data) {
                                //请求成功时处理
                                var realNoData = ((data.responseObject.responseMessage) == "NO DATA");
                                var realStatus = data.responseObject.responseStatus;
                                if (realNoData || !realStatus) {
                                    options.failed && options.failed();
                                } else {
                                    options.success && options.success(data);
                                }

                            },
                            complete: function () {
                                //请求完成的处理
                            },
                            error: function () {
                                //请求出错处理
                            }
                        });
                    }
                };
                var params = {
                    "resourceId": operateData.pageName()[0],    //资源Id
                    "isValid": 1,
                    "resourceType": refTy
                };
                var templateRecommend = function (data) {
                    var reStr = "";
                    $.each(data, function (i, v) {
                        var imgStr = "";
                        var videoIcon = "";
                        var noImage = "";
                        var videoClass = "al-no-video";
                        if (parseInt(v.resourceType) == 1) {
                            videoIcon = "<b></b>";
                            if (v.picUrl.length == 0) {
                                videoClass = "al-video-resource";
                            }
                        }
                        if (v.picUrl.length != 0) {
                            imgStr = '<a target="_blank" href="//' + v.pageStoragePath + '" class="al-video-recommend">' +
                                '<img src="' + v.picUrl + '"/>' +
                                videoIcon +
                                '</a>';
                        } else {
                            noImage = "al-noImg";
                        }
                        reStr += '<figure class="al-resourceInfo ' + noImage + ' ' + videoClass + '" data="' + v.resourceId + '">' +
                            '<div>' +
                            imgStr +
                            '<a target="_blank" href="//' + v.pageStoragePath + '" class="al-recommend-other">' +
                            '<p>' + comm.getStrLen(v.resourceName, 26) + '</p>' +
                            '<figure class="course-doc-info">     <p class="userName"><i></i>' + v.browseNum + '</p>     <p class="num"><i></i>' + v.reviewNum + '</p>    </figure>' +
                            '</a>' +
                            '</div>' +
                            '</figure>';
                    });
                    return reStr;
                };
                var recommendShow = function (data) {
                    var recommendObj = $(".Ev-recommendVideoList");
                    var newArrData = [];
                    var recommendLen = 0;
                    if (data) {
                        $.each(data, function (i, v) {
                            if (i < 5) {
                                newArrData.push(v);
                            }
                            recommendLen++;
                        });
                    }
                    recommendObj.find(".al-resourceInfo").each(function (i) {
                        if ((i > recommendLen - 1) && (recommendLen - 1 > 0)) {
                            $(this).remove();
                        }
                    });
                    recommendObj.find("h6").after(templateRecommend(newArrData));
                    if (recommendObj.find(".al-resourceInfo").length > 0) {
                        recommendObj.show();
                    }
                };
                var belongCourse = function (data) {
                    var belongStr = "";
                    $.each(data, function (i, v) {
                        var imgSrc = "";
                        if (v.courseCoverPicUrl.length > 0) {
                            imgSrc = '<a href="/pages/discover/series/discover_series_details.html?tId=' + v.courseId + '" target="_blank"><img src="' + v.courseCoverPicUrl + '" alt="' + v.courseName + '"></a>';
                        }
                        belongStr += '<section class="al_dis_act_wrap ev_acts au-doc-series-img">' +
                            imgSrc +
                            '<p>' +
                            '	<a href="/pages/discover/series/discover_series_details.html?tId=' + v.courseId + '" target="_blank" class=" au-doc-series-title">' + comm.getStrLen(v.courseName, 30) + '</a>' +
                            '</p>' +
                            '</section>';
                    });
                    return belongStr;
                };
                var postData = {"paramJson": $.toJSON(params)};
                $.ajax({
                    url: "/call/cms/course/getCoursesByResource/",    //请求的url地址
                    dataType: "json",   //返回格式为json
                    async: true, //请求是否异步，默认为异步，这也是ajax重要特性
                    data: postData,    //参数值
                    type: 'POST',   //请求方式
                    success: function (data) {
                        //请求成功时处理
                        var realNoData = ((data.responseObject.responseMessage) == "NO DATA");
                        var realStatus = data.responseObject.responseStatus;
                        if (realNoData || !realStatus) {
                            recommendShow(data.responseObject.responseData.recommend_list);
                            return false;
                        } else {
                            var seriesObj = $(".au-doc-series");
                            var dataInfo = data.responseObject.responseData.data_list[0];
                            recommendShow(data.responseObject.responseData.recommend_list);
                            var courseStr = belongCourse(data.responseObject.responseData.data_list);
                            if (courseStr.length > 0) {
                                seriesObj.show().find("p").after(belongCourse(data.responseObject.responseData.data_list));
                            }
                            $("[data-href]").css({"cursor": "pointer"}).show().off("click").on("click", function () {
                                var href = $(this).attr("data-href");
                                g_sps.jump(null,href);
                            });
                        }
                    }
                });
            },
            //电子书文章终端页存在视频的处理
            videoPlayEvent: function () {
                var t = this;
                var _v = absVideoData;
                $.each($(".al-textDetails_main a"), function (i, e) {
                    var _href = $(e).attr("href");
                    var _n = _href ? (_href.substring(_href.lastIndexOf("/") + 1, _href.lastIndexOf(".html"))) : "";
                    $(e).addClass("Ev-videoImgSrc").attr({"style": "", "href": "javascript:;"}).css({
                        position: "relative",
                        display: "block"
                    });
                    if (!$(e).find("img").length) {//表格中的视频进行容错
                        $.each($(e).siblings("img"), function (i2, e2) {
                            if ($(e2).attr("src")) {
                                $(e).append('<img src="' + $(e2).attr("src") + '"/>');
                                $(e2).attr("src", "");
                                return false;
                            }
                        });
                    }
                    $.each(_v, function (k, v) {
                        if (v.videoId == _n) {
                            $(e).attr("videoSrc", v.PCMp4Url).append('<b class="Ev-videoPlayBtn"></b><span class="Ev-videoPlayTime">' + v.playTime + '</span>');
                            return false;
                        }
                    });
                    $.each($(".Ev-vAbsArticle"), function (i1, ele) {
                        if ($(ele).attr("data-videoId") == _n) {
                            $(e).after('<p style="color: #666;font-size: 14px;">' + $(ele).text() + '</p>');
                            return false;
                        }
                    });
                });
                $(".Ev-videoImgSrc").off("click").on("click", function (e) {
                    if ($(this).attr("videoSrc")) {
                        module.backgroundVideo({videoSrc: $(this).attr("videoSrc")});
                    }
                });
            },
            //视频试看的时候分享按钮的检测
            shareLoginState: function () {
                var t = this;
                t.sharaOpAjax();
                $(".Ev-followBtn .followBtn").remove();
                t.getParam();
                getCommentHeadImg();
                /*$(".Ev-shareBox figure").off("mousedown").on("mousedown", function () {
                    user.login({
                        callback: function () {
                            t.sharaOpAjax();
                            $(".Ev-followBtn .followBtn").remove();
                            t.getParam();
                            getCommentHeadImg();
                        },
                        onLoginClose: function () {
                            g_sps.jump(null,  "/pages/channel/video/video_index.html");
                        },
                        onAuthCancel: "back",     // 当点暂不认证时的处理、回退到来源页
                        scene: privilegeSceneConst.eSceneTypeVideoPlay,
                        stay: true
                    });
                });*/
            },
            //各终端页右侧属性传参判断
            getParam: function () {
                var t = this;
                var param = {
                    sessionCustomerId: $("#sesCustomerId").val(),
                    useFlag: 12,
                    visitSiteId: 1,
                    logoUseFlag: 3
                };
                if (refTy != 4) {
                    scoringSystem();
                }
                if(!t.rightInfoOnOff){//在视频终端页getParam被调用了两次，导致video/getMapById3/接口调用两次，设置变量防止接口重复调用2018111311:41
                    return false;
                }else{
                    t.rightInfoOnOff = false;
                }
                switch (parseInt(refTy)) {
                    case 1://视频
                        //视频终端页右侧资源多作者处理
                        param.videoId = refId;
                        t.rightInfo(t.path.getMapByIdVideo, param);//右侧的关注的人，点赞收藏，所属活动
                        break;
                    case 2://文库,
                        param.docId = refId;
                        t.rightInfo(t.path.getMapByIdDoc, param);//右侧的关注的人，点赞收藏，所属活动
                        break;
                    case 4://话题
                        param.topicId = refId;
                        param.attUseFlag = 10;
                        t.rightInfo(t.path.getMapByIdTopic, param);//右侧的关注的人，点赞收藏，所属活动
                        break;
                    case 7://病例
                        param.caseId = refId;
                        param.attUseFlag = 10;
                        t.rightInfo(t.path.getMapByIdCase, param);//右侧的关注的人，点赞收藏，所属活动
                        break;
                }
            },
            //电子书文章终端相关文章列表
            relateArticle: function () {
                var t = this;
                var cBack = function (data) {
                    if (data && data.responseObject && data.responseObject.responseData && data.responseObject.responseData.data_list) {
                        var items = data.responseObject.responseData.data_list;
                        var html = "";
                        var nowRefId, nowPlayNum;
                        $.each(items, function (i, e) {
                            nowRefId = e.docId;
                            if (refId == nowRefId) {
                                nowPlayNum = i;
                                return false;
                            }
                        });
                        $.each(t.sliceNeedList(items, nowPlayNum), function (k, v) {
                            var imgArticle;
                            if (v.picUrl) {
                                imgArticle = '<img src="' + v.picUrl + '" alt=""/>';
                            } else {
                                imgArticle = "";
                            }
                            html += ' <figure class="al-resourceInfo">' +
                                '<a href="' + (v.pageStoragePath ? v.pageStoragePath : 'javascript:;') + '" style="display:block;height:100%">' +
                                imgArticle +
                                '<div class="'+(v.picUrl ?'':'al-resourceInfoNoImg')+'">' +
                                '<p style="' + (v.docId == refId ? ' color:#4398db;' : "") + (v.picUrl ? '' : 'width:226px;') + '">' + comm.getStrLen(v.docName, 40) + '</p>' +
                                '<figure class="al-browseInfo">' +
                                '<span>' + v.browseNum + '</span>' +
                                '<i>' + v.reviewNum + '</i>' +
                                '</figure>' +
                                '</div>' +
                                '</a>' +
                                '</figure>';
                        });
                        $(".Ev-recommendVideoList").show().html('<h6>系列文章</h6>' + html);
                    }
                };
                comm.ajax.async(t.path.docListUrl, {
                    paramJson: $.toJSON({
                        bookId: $("#bookId").val(),
                        visitSiteId: 1,
                        scene: 2,
                        catalogueId: $("#catalogueParentId").val(),
                        pageIndex: 1,
                        pageSize: 9999,
                        sortType: 2
                    })
                }, cBack);
            },
            //系列课程逻辑截取函数
            sliceNeedList: function (arr, index) {
                var arr2 = [];
                if (arr.length - 4 > index && index > 1) {//多列表的情况
                    arr2 = arr.slice(index - 1, index + 4);
                } else if (arr.length - index <= 4) {//判断中间位置
                    arr2 = arr.slice(arr.length - 5 > 0 ? arr.length - 5 : 0, arr.length);
                } else {//列表少的情况
                    arr2 = arr.slice(0, 5)
                }
                return arr2;
            },
            //系列课：张恒
            recommendVideoSeries: function () {
                var operateData = {
                    pageName: function () {
                        var a = location.href;
                        var b = a.split("/");
                        var c = b.slice(b.length - 1, b.length).toString(String).split(".");
                        return c.slice(0, 1);
                    },
                    requestData: function (options) {
                        var postType = (options.get) ? "GET" : "POST";//默认是post方式，除非特别传参指名要get方式。
                        var postData = {"paramJson": $.toJSON(options.postData)};
                        $.ajax({
                            url: options.port,    //请求的url地址
                            dataType: "json",   //返回格式为json
                            async: true, //请求是否异步，默认为异步，这也是ajax重要特性
                            data: postData,    //参数值
                            type: postType,   //请求方式
                            success: function (data) {
                                //请求成功时处理
                                var realNoData = ((data.responseObject.responseMessage) == "NO DATA");
                                var realStatus = data.responseObject.responseStatus;
                                if (realNoData || !realStatus) {
                                    options.failed && options.failed(data);
                                } else {
                                    options.success && options.success(data);
                                }
                            }
                        });
                    }
                };
                var config = {
                    "ajaxPort": {
                        "course": "/call/cms/course/getCoursesByResource/"
                    },
                    element: {
                        title: $(".al-advContent-title"),
                        recommendContainer: $(".al-advContent-recommend"),
                        recommendObj: $(".series-recommend"),
                        moveLeft: $(".Ev-leftMove"),
                        moveRight: $(".Ev-rightMove")
                    }
                };
                var recommend = {
                    "swipe": function (container, containerImg, Imgwidth, containerLi, height, fn) {
                        var nn = containerLi.length - 3;
                        fn.init && fn.init();
                        containerImg.css({"width": parseInt(Imgwidth) * (containerLi.length + 1)});
                        var containerParent = container.parent();
                        var slider = '<i class="ev-left-move"></i><i class="ev-right-move"></i>';
                        if (containerParent.find(".ev-left-move").length == 0) {
                            containerParent.prepend(slider);
                        }
                        container.css({
                            position: "relative",
                            height: height
                        });
                        containerImg.css({
                            position: "absolute"
                        });
                        container.siblings('.ev-left-move').off("mouseover").on('mouseover', function () {
                            $(this).addClass('activation');
                        });
                        container.siblings('.ev-left-move').off("mouseout").on('mouseout', function () {
                            $(this).removeClass('activation');
                        });
                        container.siblings('.ev-right-move').off("mouseover").on('mouseover', function () {
                            $(this).addClass('activation');
                        });
                        container.siblings('.ev-right-move').off("mouseout").on('mouseout', function () {
                            $(this).removeClass('activation');
                        });
                        container.siblings('.ev-right-move').off("click").on("click", function () {
                            var left_lenght = -(containerLi.length - 4) * parseInt(Imgwidth);
                            if (nn > 0) {
                                containerImg.animate({
                                    left: "-=" + Imgwidth

                                }, 1000, fn.rightFn);
                                nn--;
                            } else {
                                nn = 0;
                                fn.rightFn && fn.rightFn();
                            }
                        });
                        container.siblings('.ev-left-move').off("click").on("click", function () {
                            nn++;
                            if (nn <= containerLi.length - 3) {
                                containerImg.animate({
                                    left: "+=" + Imgwidth
                                }, 1000, fn.leftFn);
                            } else {
                                nn = containerLi.length - 3;
                                fn.leftFn && fn.leftFn();
                            }
                        });
                    },
                    init: function () {
                        var t = this;
                        t.recommend();
                    },
                    recommend: function () {
                        var t = this;
                        var templateRecommend = function (data) {
                            var reStr = "";
                            $.each(data, function (i, v) {
                                var imgStr = "";
                                var videoIcon = "";
                                var noImage = "";
                                var videoClass = "al-no-video";
                                if (parseInt(v.resourceType) == 1) {
                                    videoIcon = "";//和原来保持统一不要icon
                                    videoClass = "";
                                }
                                if (v.picUrl.length != 0) {
                                    imgStr = '<a target="_blank" href="//' + v.pageStoragePath + '" class="al-video-recommend">' +
                                        '<img src="' + v.picUrl + '"/>' +
                                        videoIcon +
                                        '</a>';
                                } else {
                                    noImage = "al-noImg";
                                }
                                reStr += '<figure class="al-resourceInfo ' + noImage + ' ' + videoClass + '" data="' + v.resourceId + '">' +
                                    '<div class="al-resource-series">' +
                                    imgStr +
                                    '<a target="_blank" href="//' + v.pageStoragePath + '" class="al-video-title">' +
                                    '<p>' + comm.getStrLen(v.resourceName, 26) + '</p>' +
                                    '</a>' +
                                    '<span>' + (v.ownerNameStr ? comm.getStrLen(v.ownerNameStr,14) : "") + '</span>' +
                                    '</div>' +
                                    '</figure>';
                            });
                            return reStr;
                        };
                        var recommendShow = function (data) {
                            var recommendObj = $(".Ev-recommendVideoList");
                            var newArrData = [];
                            var recommendLen = 0;
                            if (data) {
                                $.each(data, function (i, v) {
                                    if (i < 5) {
                                        newArrData.push(v);
                                    }
                                    recommendLen++;
                                });
                            }
                            recommendObj.find(".al-resourceInfo").each(function (i) {
                                if ((i > recommendLen - 1) && (recommendLen - 1 > 0)) {
                                    $(this).remove();
                                }
                            });
                            if (recommendObj.find(".al-resourceInfo").eq(0).length == 0) {
                                recommendObj.find("h6").after(templateRecommend(newArrData));
                            } else {
                                recommendObj.find(".al-resourceInfo").eq(0).before(templateRecommend(newArrData));
                            }
                            if (recommendObj.find(".al-resourceInfo").length > 0) {
                                if (recommendObj.find(".al-resourceInfo").length > 5) {
                                    recommendObj.find(".al-resourceInfo").each(function (i) {
                                        if (i > 4) {
                                            $(this).remove();
                                        }
                                    });
                                }
                                recommendObj.show();
                            }
                        };
                        var recommendMethod = {
                            data: {
                                swipeData: [],
                                swipeNum: 0,
                                swipeTitle: []
                            },
                            init: function (data) {
                                var t = recommendMethod;
                                t.divisionData(data).swipeInit(t.data.swipeNum);
                            },
                            templateRecommend: function (data) {
                                var listStr = "";
                                $.each(data, function (i, v) {
                                    var videoLogoUrl = "";
                                    if (parseInt(v.resourceType) === 1) {
                                        if (v.picUrl) {
                                            videoLogoUrl = v.picUrl;
                                        }
                                        var playTime = "";
                                        if (v.playTime) {
                                            playTime = v.playTime;
                                        }
                                        var resourceName = "";
                                        if (comm.getByteLen(v.resourceName) > 48) {
                                            resourceName = comm.getStrLen(v.resourceName, 36) + comm.revCutstr(v.resourceName, 10);
                                        } else {
                                            resourceName = v.resourceName;
                                        }
                                        var highLight = "";
                                        if (parseInt(v.resourceId) == parseInt(operateData.pageName()[0])) {
                                            highLight = "al-videoHighLight";
                                        }
                                        listStr += '<li class="' + highLight + '" data-href="' + "//" + v.pageStoragePath + '"  data-resourceId="' + v.resourceId + '">' +
                                            '<a href="//' + v.pageStoragePath + '">' +
                                            '<aside class="resultAds"><img src="' + videoLogoUrl + '"><i></i><b>' + playTime + '</b></aside>' +
                                            '<aside class="name">' + resourceName + '</aside>' +
                                            '</a>' +
                                            '</li>';
                                    }
                                });
                                var demoList = $(listStr);
                                var lastLen = demoList.length - 1;
                                if (lastLen < 3) {
                                    demoList.eq(lastLen).attr({"data-last": "true"});
                                } else {
                                    demoList.each(function (i) {
                                        if (i == 2) {
                                            $(this).attr({"data-last": "true"});
                                        }
                                    });
                                }
                                return demoList;
                            },
                            changeNextPage: function (onOff) {
                                var t = recommendMethod;
                                var lastOne = $("[data-last]");
                                var imgObjLi = $(".series-recommend li");
                                if (onOff) {
                                    if (lastOne.next().length > 0) {
                                        lastOne.removeAttr("data-last").next().attr({"data-last": "false"});
                                    }
                                } else {
                                    if (lastOne.index() > 2) {
                                        lastOne.removeAttr("data-last").prev().attr({"data-last": "false"});
                                    }
                                }
                            },
                            judgeNextChange: function () {
                                var t = recommendMethod;
                                var imgObjLi = $(".series-recommend li");
                                var lastLen = imgObjLi.length - 1;
                                var lastOne = imgObjLi.eq(lastLen);
                                if (lastOne.attr("data-last")) {
                                    if (JSON.parse(lastOne.attr("data-last"))) {
                                        t.data.swipeNum++;
                                        if (t.data.swipeNum == t.data.swipeData.length) {
                                            t.data.swipeNum = 0;
                                        }
                                        t.swipeInit(t.data.swipeNum);
                                    } else {
                                        lastOne.attr({"data-last": "true"});
                                    }
                                }
                            },
                            judgePreChange: function () {
                                var t = recommendMethod;
                                var imgObjLi = $(".series-recommend li");
                                var lastOne = imgObjLi.eq(2);
                                if (imgObjLi.length < 4) {
                                    if (t.data.swipeNum == 0) {
                                        t.data.swipeNum = t.data.swipeData.length - 1;
                                    } else {
                                        t.data.swipeNum--;
                                    }
                                    t.swipeInit(t.data.swipeNum);
                                }
                                if (lastOne.attr("data-last")) {
                                    if (JSON.parse(lastOne.attr("data-last"))) {
                                        if (t.data.swipeNum == 0) {
                                            t.data.swipeNum = t.data.swipeData.length - 1;
                                        } else {
                                            t.data.swipeNum--;
                                        }
                                        t.swipeInit(t.data.swipeNum);
                                    } else {
                                        lastOne.attr({"data-last": "true"});
                                    }
                                }
                            },
                            rightFn: function () {
                                var t = recommendMethod;
                                t.changeNextPage(true);
                                t.judgeNextChange();
                            },
                            leftFn: function () {
                                var t = recommendMethod;
                                t.changeNextPage(false);
                                t.judgePreChange();
                            },
                            swipeAnimateInit: function () {
                                var containerImg = $(".al-advContent_videoBox  .series-recommend");
                                containerImg.stop();
                                containerImg.css({"left": "0"});
                            },
                            swipeInit: function (num) {
                                var t = recommendMethod;
                                $(".series-recommend").css({"left": "0"});
                                if (num == 0) {
                                    if (t.data.swipeData.length == 1) {
                                        if (parseInt(t.data.swipeData[0].resourceId) == parseInt(operateData.pageName()[0])) {
                                            config.element.recommendContainer.hide();
                                            return false;
                                        }
                                    }
                                }
                                $(".al-advContent-title").html("《" + recommendMethod.data.swipeTitle[num].courseName
                                    + "》").attr({"data-href": "/pages/discover/series/discover_series_details.html?tId=" + recommendMethod.data.swipeTitle[num].courseId});
                                config.element.recommendObj.html(t.templateRecommend(t.data.swipeData[num]));
                                if (num == 0 && t.data.swipeData.length == 1 && t.data.swipeData[0].length < 4) {
                                    return false;
                                } else {
                                    recommend.swipe($(".al-advContent_videoBox "), $(".al-advContent_videoBox  .series-recommend"), 197 + 'px', config.element.recommendObj.find("li"), "197px", {
                                        "rightFn": t.rightFn,
                                        "leftFn": t.leftFn,
                                        "init": t.swipeAnimateInit
                                    });
                                }
                                $("[data-href]").off("click").on("click", function () {
                                    var href = $(this).attr("data-href");
                                    g_sps.jump(null,href);
                                })
                            },
                            divisionData: function (data) {
                                var t = recommendMethod;
                                if (data.length > 0) {
                                    config.element.recommendContainer.show();
                                } else {
                                    config.element.recommendContainer.hide();
                                }
                                $.each(data, function (oi, ov) {
                                    var listData = [];
                                    recommendMethod.data.swipeTitle.push(ov);
                                    if (ov.resourceList.length > 0) {
                                        $.each(ov.resourceList, function (i, v) {
                                            if (parseInt(v.resourceType) == 1) {
                                                listData.push(v);
                                            }
                                        });
                                        recommendMethod.data.swipeData.push(listData);
                                    }
                                });
                                return t;
                            }
                        };
                        operateData.requestData({
                            port: config.ajaxPort.course,
                            get: true,
                            postData: {
                                "resourceId": operateData.pageName()[0],    //资源Id
                                "isValid": 1,
                                "resourceType": 1        //资源类型，1-视频，2-文库，7-病例,17-电子书，18-文章
                            },
                            success: function (req) {
                                recommendMethod.init(req.responseObject.responseData.data_list);
                                recommendShow(req.responseObject.responseData.recommend_list);
                            },
                            failed: function (req) {
                                config.element.recommendContainer.hide();
                                recommendShow(req.responseObject.responseData.recommend_list);
                            }
                        });
                        return t;
                    }
                };
                recommend.init();
            },
            //推荐视频的请求
            recommendVideoList: function () {
                var t = this;
                $.ajax({//推荐视频的请求
                    url: t.path.recommendUrl,
                    type: "get",
                    data: {
                        refId: refId
                    },
                    dataType: "json",
                    success: function (data) {
                        if (data && (data.rows[0].refVideoItems||data.rows[0].refCaseItems)) {//推荐视频有数据
                            var items = data.rows[0].refVideoItems?(data.rows[0].refVideoItems):(data.rows[0].refCaseItems);
                            var html = "";
                            if(refTy===7){
                                $.each(items, function (i, e) {
                                    if (i < 5) {
                                        html += t.caseList_template(e);
                                    }
                                });
                            }else{
                                $.each(items, function (i, e) {
                                    if (i < 5) {
                                        html += t.videoList_template(e);
                                    }
                                });
                            }

                            if (refTy == 1 || refTy == 2 || refTy == 7) {
                                if(html.length){
                                    $(".Ev-recommendVideoList").append(html).show();
                                }else{
                                    $(".Ev-recommendVideoList").append(html);
                                }
                                if (refTy == 1) {
                                    t.recommendVideoSeries();
                                }
                            } else {
                                $(".Ev-recommendVideoList").show().append(html);
                            }
                        } else {
                            if (refTy == 1) {
                                t.recommendVideoSeries();
                            }
                        }
                    },
                    failed: function () {
                        if (refTy == 1) {
                            t.recommendVideoSeries();
                        }
                    }
                });
            },
            //推荐病例的列表结构
            caseList_template:function(kv){
                var recommendVideoName = kv.caseName;
                var recommendVideoId = kv.caseId;
                if (comm.getByteLen(recommendVideoName) > 26) {
                    recommendVideoName = comm.getStrLen(recommendVideoName, 26);
                }
                if(kv.recommendCaseLogo2.length){
                    return '<figure class="al-resourceInfo" data="' + recommendVideoId + '">' +
                        '<a target="_blank" href="' + kv.pageStoragePath + '">' +
                        '<img src="' + (kv.recommendCaseLogo2.indexOf("|")>-1?kv.recommendCaseLogo2.split("|")[0]:kv.recommendCaseLogo2) + '"/>' +
                        '</a>' +
                        '<div>' +
                        '<a target="_blank" href="' + kv.pageStoragePath + '">' +
                        '<p>' + recommendVideoName + '</p>' +
                        '</a>' +
                        '<span>' + (kv.author ? kv.author : "唯医小编") + '</span>' +
                        '</div>' +
                        '</figure>';
                }else{
                    return '<figure class="al-resourceInfo al-noImg" data="' + recommendVideoId + '">' +
                        '<div>' +
                        '<a target="_blank" href="' + kv.pageStoragePath + '">' +
                        '<p>' + recommendVideoName + '</p>' +
                        '</a>' +
                        '<span>' + (kv.author ? kv.author : "唯医小编") + '</span>' +
                        '</div>' +
                        '</figure>';
                }

            },
            //推荐视频的列表结构
            videoList_template: function (kv) {
                var recommendVideoName = kv.recommendVideoName;
                var recommendVideoId = kv.recommendVideoId;
                if (comm.getByteLen(recommendVideoName) > 26) {
                    recommendVideoName = comm.getStrLen(recommendVideoName, 26);
                }
                var authorName = '';
                authorName = comm.getStrLen(kv.ownerNameStr,14);
                return '<figure class="al-resourceInfo" data="' + recommendVideoId + '">' +
                    '<a target="_blank" href="' + kv.pageStoragePath + '">' +
                    '<img src="' + kv.recommendVideoLogo2 + '"/>' +
                    '</a>' +
                    '<div>' +
                    '<a target="_blank" href="' + kv.pageStoragePath + '">' +
                    '<p>' + recommendVideoName + '</p>' +
                    '</a>' +
                    '<span>' + (authorName ? authorName : "唯医小编") + '</span>' +
                    '</div>' +
                    '</figure>';
            },
            //右侧的关注的人，视频点赞收藏，所属活动
            rightInfo: function (url, param) {
                var t = this;
                var refTy = parseInt($("#resourceType").val(),10);
                var cBack = function (rep) {
                    if (comm.hasResponseData(rep) && rep.responseObject.responseData.data_list) {
                        var items = rep.responseObject.responseData.data_list[0];
                        if(refTy == 1){//视频终端引入收费逻辑
                            payForClass.init(items);
                        }

                        t.followStatus(items);
                        t.resNumStatus(items);
                        t.activityStatus(items);
                        var name="",company="",medicalTitle="",logoUrl="",cid="";
                        if(parseInt(refTy)!=1){
                            $(".expertInfo").show();
                            $(".Ev-shareTitleName a").show();
                        }
                        switch (parseInt(refTy)) {
                            case 1://视频
                                if(items.owerNameList.length===1){
                                    $(".expertInfo").show();
                                    setTimeout(function(){
                                        $(".Ev-shareTitleName a").show();
                                    },800);
                                }else if(items.owerNameList.length>1){
                                    var authorNameListStr = '';
                                    var multipleAuthorsObj = $(".multipleAuthors");
                                    var authorLogoStr = '';
                                    var authorListStr = '';
                                    $.each(items.owerNameList,function(index,value){
                                        var multipUserFlowed = '';
                                        if(value.isFollowPeople==2){
                                            multipUserFlowed = 'multipUserFlowed';
                                        }
                                        if(authorNameListStr.length==0){
                                            authorNameListStr+=value.authorName;
                                        }

                                        authorLogoStr+="<figure class=\"multipleLogoItem\">"+
                                            "      <img src=\""+value.logoUrl+"\" alt=\"\">"+
                                            " </figure>";
                                        var flowStr = '';
                                        if(parseInt(value.refCustomerId,10)&&((value.state==2)||(value.state==4)||(value.state==7)||(value.state==8)||(value.state==9))){
                                            flowStr+='                                    <div class="multipUserFlow '+multipUserFlowed+'">'+
                                                '                                         <span class="flow">'+
                                                '                                             <i class="icon"></i>'+
                                                '                                            <i class="des">关注</i>'+
                                                '                                         </span>'+
                                                '                                         <span class="flowed">'+
                                                '                                             <i class="icon"></i>'+
                                                '                                             <i class="des">已关注</i>'+
                                                '                                         </span>'+
                                                '                                     </div>';
                                        }
                                        authorListStr+='<li class="multipleAuthorsItem" refCustomerId="'+value.refCustomerId+'">'+
                                            '                                     <div class="multipUserLogo">'+
                                            '                                         <img src="'+value.logoUrl+'" alt="">'+
                                            '                                     </div>'+
                                            '                                     <div class="multipUserInfo">'+
                                            '                                         <p class="multipUserTitle">'+
                                            '                                             <span class="userName">'+comm.getStrLen(value.authorName,20)+'</span>'+
                                            '                                             <span class="userMedicalTitle">'+value.medicalTitle+'</span>'+
                                            '                                         </p>'+
                                            '                                         <p class="multipUserCompany">'+value.hospital+
                                            '                                         </p>'+
                                            '                                     </div>'+flowStr
                                            +
                                            '                                 </li>';
                                    });
                                    setTimeout(function(){
                                        $(".Ev-shareTitleName a").html(authorNameListStr+'等人').removeAttr('href').removeAttr('target').show();
                                    },800)

                                    multipleAuthorsObj.find('.multipleAuthorsList').html(authorListStr);
                                    multipleAuthorsObj.find(".multipleAuthorsLogo").html(authorLogoStr);
                                    multipleAuthorsObj.show();
                                    multipleAuthorsObj.find(".multipleAuthorsItem").off("click").on("click",function(){
                                        var refCustomerId = $(this).attr('refCustomerId');
                                        if(parseInt(refCustomerId,10)){
                                            if(refCustomerId==$("#sesCustomerId").val()){
                                                g_sps.jump(null, "/pages/personal/personal_index.html");
                                            }else{
                                                g_sps.jump(null,'/pages/personal/others_contribution.html?cid='+refCustomerId);
                                            }
                                        }
                                    });
                                    multipleAuthorsObj.find(".multipUserFlow").off("click").on("click",function(e){
                                       var _t = $(this);
                                        var refCustomerId = $(this).parent().attr('refCustomerId');
                                       if(!_t.hasClass('multipUserFlowed')){
                                           var params = {};
                                           params.paramJson = $.toJSON({
                                               refId : refCustomerId,
                                               dataFlag : 2});
                                           user.login({
                                               callback: function () {
                                                   $.ajax({
                                                       url : "/call/customer/follow_people/create/",
                                                       type : 'POST',
                                                       data : params,
                                                       success:function(req){
                                                           if(req.responseObject.responseStatus){
                                                               _t.addClass("multipUserFlowed");
                                                           }
                                                       }
                                                   });
                                               },
                                               scene: privilegeSceneConst.eSceneTypeAttention,	// 关注场景
                                               onClose: onLoginClose,
                                               stay:true
                                           });
                                       }
                                        e.stopPropagation();
                                       return false;
                                    });
                                }
                                t.meetingStatus(items);
                                if (videoType == 19) {
                                    t.eBookStatus(items);//电子书视频的所属文章和所属章节
                                }
                                videoAuth=items.cms_video_customer;
                                name=videoAuth.lastName+videoAuth.firstName;
                                company=videoAuth.company?videoAuth.company:videoAuth.schoolName;
                                medicalTitle=videoAuth.medicalTitleShow;
                                logoUrl=items.cms_video_customer_logo.logoUrl;
                                cid=(videoAuth.customerId&&videoAuth.customerId!=0)?"/pages/personal/others_contribution.html?cid="+videoAuth.customerId:"javascript:;";
                                break;
                            case 2://文库,
                                if (ebookType == 18) {//电子书文章终端页所属章节处理
                                    t.eBookStatus(items);
                                }
                                docAuth=items.doc_customer_auth;
                                name=docAuth.lastName+docAuth.firstName;
                                company=docAuth.company?docAuth.company:docAuth.schoolName;
                                medicalTitle=docAuth.medicalTitleShow;
                                logoUrl=items.customer_att.logoUrl;
                                cid=(docAuth.customerId&&docAuth.customerId!=0)?"/pages/personal/others_contribution.html?cid="+docAuth.customerId:"javascript:;";
                                break;
                            case 4://话题
                                topicAuth=items.cms_topic_customer;
                                name=topicAuth.lastName+topicAuth.firstName;
                                company=topicAuth.company?topicAuth.company:topicAuth.schoolName;
                                medicalTitle=topicAuth.medicalTitleShow;
                                logoUrl=items.comm_data_logo_url.logoUrl;
                                cid=(topicAuth.customerId&&topicAuth.customerId!=0)?"/pages/personal/others_contribution.html?cid="+topicAuth.customerId:"javascript:;";
                                break;
                            case 7://病例
                                caseAuth=items.case_customer_auth;
                                name=caseAuth.lastName+caseAuth.firstName;
                                company=caseAuth.company?caseAuth.company:caseAuth.schoolName;
                                medicalTitle=caseAuth.medicalTitleShow;
                                logoUrl=items.case_customer_logo.logoUrl;
                                cid=(caseAuth.customerId&&caseAuth.customerId!=0)?"/pages/personal/others_contribution.html?cid="+caseAuth.customerId:"javascript:;";
                                break;
                        }
                        if($(".Ev-cAuthLogo").attr("href")&&$(".Ev-cAuthLogo").attr("href").lastIndexOf('organization-home')>-1){//OE作者

                        }else{
                            $(".Ev-cAuthLogo").attr("href",cid);
                        }
                        $(".Ev-cAuthLogo img").attr("src",logoUrl);
                        $(".Ev-cAuthName").text(name);
                        if($(".Ev-cAuthName").attr("href")&&$(".Ev-cAuthName").attr("href").lastIndexOf('organization-home')>-1){//OE作者

                        }else {
                            $(".Ev-cAuthName").attr("href", cid);
                        }
                        $(".Ev-cAuthTitle").text(medicalTitle);
                        $(".Ev-cAuthCompany").text(company);
                        if(name){
                            if(parseInt(refTy,10)===1){
                                $(".Ev-shareTitleName a").hide().text(name);
                            }else{
                                $(".Ev-shareTitleName a").text(name);
                            }
                            if($(".Ev-shareTitleName a").attr("href")&&$(".Ev-shareTitleName a").attr("href").lastIndexOf('organization-home')>-1){//OE作者

                            }else{
                                $(".Ev-shareTitleName a").attr("href",cid);
                            }
                        }
                        if(parseInt(refTy,10)!=1){
                            if(name){
                                $(".Ev-shareTitleName a").show();
                            }
                            if(parseInt($("#refCustomerId").val(),10)===parseInt(TempCache.getItem('userId'),10)){
                                $(".Ev-shareTitleName a").attr("href","https://www.allinmd.cn/pages/personal/personal_contribution.html")
                            }
                        }
                        if(cid.lastIndexOf("cid")>-1){
                            //右侧头像区域做判断是自己跳转自己贡献页
                            var _href = $(".Ev-cAuthLogo").attr("href");
                            var _cid = _href ? _href.split('cid=')[1]: "";
                            var _thisC=_cid.indexOf("&")>-1?_cid.split('&')[0]:_cid;
                            if (_thisC == $('#sesCustomerId').val()) {//是自己
                                $(".Ev-cAuthLogo,.Ev-cAuthName").attr("href", "/pages/personal/personal_contribution.html");
                            }
                        }else{
                            $(".al-library_shareBox").addClass('noUserId');
                            $(".al-followCase").addClass('noUserId');
                            $(".expertInfo").hide();
                        }
                    }
                };
                comm.ajax.async(url, {paramJson: $.toJSON(param)}, cBack);
            },
            //加入讨论按钮点击
            discussClick: function () {
                var _eArea = $(".ev-detailReviewForm");
                $(".Ev-discussBtn").off("click").on("click", function () {
					var customerRole = TempCache.getItem("customerRole");
					if(customerRole && (customerRole=="14" || customerRole=="15")){
						$.topTip({content:"此功能仅向医务人员开放",mark:'warn'});
						return false;
					}
                    var _top = _eArea.offset().top - 150;
                    $(window).scrollTop(_top);
                    _eArea.find('textarea').css('height', '90px').focus();
                    $(".ev-reviewOper").show();
                    //事件埋点
                    comm.creatEvent({
                        triggerType: "讨论",
                        keyword: "加入讨论",
                        actionId: 72
                    });
                    return false;
                });
            },
            //PDF点击进入阅读
            readClick: function(){
                $('.Ev-moreReadImg').off('click').on('click',function(e){
                    module.viewBigImgAll({
                        event: e,
                        container: $('.al-terminalDocPdfImg'),
                        imgListType:'reviewDoc',
                        resourceId:$("#resourceId").val(),
                        resourceType:$("#resourceType").val()
                    });
                })
            },
            //右侧资源的作者个人中心跳转，话题和病例的关注操作
            followStatus: function (items) {
                var t = this;
                var cAuth;
                switch (parseInt(refTy)) {
                    case 1://视频
                        cAuth = items.cms_video_customer;
                        break;
                    case 2://文库
                        cAuth = items.doc_customer_auth;
                        break;
                    case 4://话题
                        cAuth = items.cms_topic_customer;
                        break;
                    case 7://病例
                        cAuth = items.case_customer_auth;
                        break;
                        return cAuth;
                }
                if (cAuth.customerId == $("#sesCustomerId").val()) {//登录，发布是同一个人
                    $(".Ev-followBtn .followBtn").remove();
                } else {
                    $(".Ev-followBtn .followBtn").remove();
                    $(".Ev-followBtn").follow({
                        fStatus: items.isFollowPeople,
                        classStyle: "followBtn",
                        fId: cAuth.customerId ? cAuth.customerId : "",
                        picStyle: 5,
                        canToggle: false
                    });
                }
                var _alF = $(".Ev-alFollow");
                var _nlF = $(".Ev-noFollow");
                if (refTy == 4 || refTy == 7) {
                    if (refTy == 7) {//病例
                        if (cAuth.customerId == $("#sesCustomerId").val()) {//自己的病例
                            $(".Ev-EditCase").show().siblings().not("figcaption").remove();
                            $(".Ev-EditCase").on("click", function () {
                                var href = "/pages/singlePage/upload-case.html?caseId=" + $(".Ev-EditCase").attr("caseId");
                                if(t.activityId=="1513149467288"){//线下：1509331335386   线上：1513149467288
                                    href="/pages/singlePage/upload-activityCase.html?caseId=" + $(".Ev-EditCase").attr("caseId");
                                }
                                comm.ieAlert(href);
                            });
                        } else {
                            if (items.followRelationship == 1) {//关注状态
                                _alF.show().attr("enClick",'1');
                                _nlF.hide().attr("enClick",'0');
                            } else {//未关注状态
                                _nlF.show().attr("enClick",'1');
                                _alF.hide().attr("enClick",'0');
                            }
                        }
                        //上传病例,我有相似病例
                        $(".Ev-sCaseBtn").on("click", function () {
                            comm.creatEvent({
                                triggerType:"终端页功能",
                                keyword:"我有相似病例",
                                actionId:11052,
                                async:false
                            });
                            var href = "/pages/singlePage/upload-case.html";
                            comm.ieAlert(href);
                        });
                    } else {//话题
                        if (cAuth.customerId != $("#sesCustomerId").val()) {//不是自己的话题
                            $(".Ev-myselfTopic").show();
                            if (items.followRelationship == 1) {//关注状态
                                _alF.show().attr("enClick",'1');
                                _nlF.hide().attr("enClick",'0');
                            } else {//未关注状态
                                _nlF.show().attr("enClick",'1');
                                _alF.hide().attr("enClick",'0');
                            }
                        }
                    }
                    var param = {
                        followType : refTy,
                        refId : refId,
                        refName : $(".Ev-shareTitleName h4").text()
                    };
                    _alF.off("click").on("click", function () {
                        if($(this).attr("enClick")==1){//可以点击状态
                            $(this).attr("enClick","0");
                            t.followAjax(t.path.cancelFollow, param, 1);//取消关注
                        }
                    });
                    var data = {
                        followType : refTy,
                        refName : $(".Ev-shareTitleName h4").text(),
                        refId : refId
                    };
                    _nlF.off("click").on("click", function () {
                        if($(this).attr("enClick")==1) {//可以点击状态
                            $(this).attr("enClick","0");
                            t.followAjax(t.path.follow, data);//添加关注
                            //事件埋点
                            comm.creatEvent({
                                triggerType: "关注",
                                pushMessageId: data.refId,
                                actionId: (refTy == 4) ? 5 : 6
                            });
                        }
                    });
                }
            },
            //病例和话题的@功能处理和医师列表
            topicCaseOp: function () {
                var t = this;
                var _mF = $(".Ev-moreFollow");
                var _oF = $(".Ev-oneFollow");
                if (refTy == 4 || refTy == 7) {//话题和病例
                    $(".Ev-goOtherCenter a").each(function (i, em) {
                        var _text = $(em).text();
                        $(em).text("@" + _text);
                    });
                    $(".Ev-goOtherCenter a").off("click").on("click", function () {//@功能
                        var href = "/pages/personal/others_contribution.html?cid=" + $(this).attr("href").replace("?", "&");
                        g_sps.jump(null,href);
                        return false;
                    });
                    var cBack = function (rep) {
                        if (comm.hasResponseData(rep) && rep.responseObject.responseData.data_list) {
                            var _n = rep.responseObject.responseData.total_count;
                            if (_n > 0) {
                                _mF.text(_n).parents("figure").show();
                                _oF.parents("figure").hide();
                                var items = rep.responseObject.responseData.data_list;
                                var html = "";
                                $.each(items, function (i, e) {
                                    if (i < 4) {
                                        html += '<a target="_blank" href="/pages/personal/others_contribution.html?cid=' + e.customerAuth.customerId + '">' +
                                            '<img src="' + e.commDataLogoUrl.logoUrl + '" alt=""/>' +
                                            '</a>';
                                    }
                                });
                                $(".Ev-followLogoList").html(html);
                            } else {
                                _oF.text("0").parents("figure").show();
                                _mF.parents("figure").hide();
                            }
                        } else {
                            _oF.text("0").parents("figure").show();
                            _mF.parents("figure").hide();
                        }
                    };
                    comm.ajax.async(t.path.tCFollowList, {
                        paramJson: $.toJSON({
                            refId: refId,
                            sessionCustomerId: $("#sesCustomerId").val(),
                            logoUseFlag: 3,
                            followType: refTy,
                            visitSiteId: 1,
                            pageIndex: 1,
                            pageSize: 4

                        })
                    }, cBack);
                    $(".Ev-FollowList").off("click").on("click", function () {
                        var url = "/template/terminal/followList.html?rId=" + refId + "&followType=" + refTy;
                        //TODO sps跳转
                        g_sps.jump($(this), url);
                    });
                }
            },
            //病例和话题的关注和关注取消的请求
            followAjax: function (path, param, index) {
                var t = this;
                var _alF = $(".Ev-alFollow");
                var _nlF = $(".Ev-noFollow");
                var _mF = $(".Ev-moreFollow");
                var _oF = $(".Ev-oneFollow");
                var _n = parseInt(_mF.text());
                var _num = parseInt(_oF.text());
                var cBack = function (rep) {
                    if (rep && rep.responseObject && rep.responseObject.responseStatus) {
                        if (index) {//取消
                            _nlF.show().attr("enClick",'1');
                            _alF.hide().attr("enClick",'0');
                            if (_n > 0 && _n == 1) {
                                _oF.text("0").parents("figure").show();
                                _mF.parents("figure").hide();
                            } else {
                                _mF.text(_n - 1);
                            }
                            t.topicCaseOp();
                        } else {//关注了
                            _alF.show().attr("enClick",'1');
                            _nlF.hide().attr("enClick",'0');
                            if (_num == 0) {
                                _mF.text(_n + 1).parents("figure").show();
                                _oF.parents("figure").hide();
                            } else {
                                _mF.text(_n + 1);
                            }
                            t.topicCaseOp();
                        }
                    }
                };
                comm.ajax.async(path, {paramJson: $.toJSON(param)}, cBack);
            },
            //资源的点赞收藏状态及数目，话题和病例的关注人数
            resNumStatus: function (items) {
                var t = this,
                    colBox = $(".Ev-like_container"),
                    praBox = $(".Ev-zan_container");
                var vInfo;
                switch (parseInt(refTy)) {
                    case 1://视频
                        vInfo = items.cms_video;
                        break;
                    case 2://文库
                        vInfo = items.customer_doc;
                        break;
                    case 4://话题
                        vInfo = items.cms_topic;
                        break;
                    case 7://病例
                        vInfo = items.case_baseinfo;
                        break;
                        return vInfo;
                }
                $(".rq_text").text("浏览");//JOA JOAV2  OE浏览数文本错误修改
                if (refTy == 1) {
                    //浏览数
                    if (vInfo.playNum && vInfo.playNum != 0) {
                        if (parseInt(vInfo.playNum) > 9999) {
                            $("#lib_rq_num").text(vInfo.playNum.toW());//浏览数
                        } else {
                            $("#lib_rq_num").text(vInfo.playNum);//浏览数
                        }
                    } else {
                        $("#lib_rq_num").text("0");//浏览数
                    }
                } else {
                    //浏览数
                    if (vInfo.browseNum && vInfo.browseNum != 0) {
                        if (parseInt(vInfo.browseNum) > 9999) {
                            $("#lib_rq_num").text(vInfo.browseNum.toW());//浏览数
                        } else {
                            $("#lib_rq_num").text(vInfo.browseNum);//浏览数
                        }
                    } else {
                        $("#lib_rq_num").text("0");//浏览数
                    }
                }
                /*唯医2.0中终端页左侧讨论数是用//www.allinmd.cn/call/video/getMapById3/接口下的cms_video.reviewNum,但是唯医3.0后该接口下的该字段不在维护，因此把scene.detail.commV3下的2525到2533注释掉，在module.review-page.js中的95到104行，使用评论接口的总数字段展示。201906121627张恒*/
                //评论数
                /*if (vInfo.reviewNum && vInfo.reviewNum > 0) {
                    if (parseInt(vInfo.reviewNum) > 9999) {
                        $(".Ev-discussBtn span").text(vInfo.reviewNum.toW());//讨论数
                    } else {
                        $(".Ev-discussBtn span").text(vInfo.reviewNum);//讨论数
                    }
                } else {
                    $(".Ev-discussBtn span").text("0");//讨论数
                }*/
                //收藏数
                if (vInfo.collectionNum && vInfo.collectionNum > 0) {
                    if (parseInt(vInfo.collectionNum) > 9999) {
                        $(".Ev-like_container span").text(vInfo.collectionNum.toW());//收藏数
                    } else {
                        $(".Ev-like_container span").text(vInfo.collectionNum);//收藏数
                    }
                } else {
                    $(".Ev-like_container span").text("0");//收藏数
                }
                //点赞数
                if (vInfo.preferUpNum && vInfo.preferUpNum > 0) {
                    if (parseInt(vInfo.preferUpNum) > 9999) {
                        $(".Ev-zan_container span").text(vInfo.preferUpNum.toW());//点赞数
                    } else {
                        $(".Ev-zan_container span").text(vInfo.preferUpNum);//点赞数
                    }
                } else {
                    $(".Ev-zan_container span").text("0");//点赞数
                }
                if (items.collectionRelationship == 1) {//收藏关系
                    colBox.addClass("likeActive");
                } else {
                    colBox.removeClass("likeActive");
                }
                if (items.preferRelationship == 1) {//点赞关系
                    praBox.addClass("zanActive");
                } else {
                    praBox.removeClass("zanActive");
                }
                t.colBoxClick = false;
                //收藏取消收藏操作
                colBox.off("click").on("click", function () {
                    if(t.colBoxClick){
                        return false;
                    }
                    t.colBoxClick = true;
                    var param = {};
                    param.customerId = $("#sesCustomerId").val();
                    param.collectionType = refTy;
                    param.refId = refId;
                    if ($(this).hasClass("likeActive")) {//取消收藏
                        user.login({
                            callback: function () {
                                t.collectPraiseAjax(t.path.collectCancel, param, 1);
                                getCommentHeadImg();
                            },
                            scene: privilegeSceneConst.eSceneTypeCollect // 收藏
                        });
                    } else {
                        user.login({
                            callback: function () {
                                t.collectPraiseAjax(t.path.collect, param, 1);
                                getCommentHeadImg();
                            },
                            scene: privilegeSceneConst.eSceneTypeCollect // 收藏
                        });
                    }
                });
                t.praBoxClick = false;
                //点赞取消点赞操作
                praBox.off("click").on("click", function () {
                    if(t.praBoxClick){
                        return false;
                    }
                    t.praBoxClick = true;
                    var param = {};
                    param.customerId = $("#sesCustomerId").val();
                    param.refId = refId;
                    param.usefulType = refTy;
                    param.upDownType = 1;
                    if ($(this).hasClass("zanActive")) {//取消点赞
                        user.login({
                            callback: function () {
                                t.collectPraiseAjax(t.path.praiseCancel, param, 2);
                                getCommentHeadImg();
                            },
                            scene: privilegeSceneConst.eSceneTypePraiseResourse // 赞
                        });
                    } else {
                        user.login({
                            callback: function () {
                                t.collectPraiseAjax(t.path.praise, param, 2);
                                getCommentHeadImg();
                            },
                            scene: privilegeSceneConst.eSceneTypePraiseResourse // 赞
                        });
                    }
                });
            },
            //收藏,点赞的ajax请求
            collectPraiseAjax: function (path, param, tip) {
                var t = this,
                    colBox = $(".Ev-like_container"),
                    praBox = $(".Ev-zan_container");
                var pNum = $(".Ev-zan_container span");
                var cNum = $(".Ev-like_container span");
                $.ajax({
                    type: "POST",
                    url: path,
                    data: {paramJson: $.toJSON(param)},
                    dataType: "json",
                    success: function (rep) {
                        if(tip==1){//收藏
                            t.colBoxClick = false;
                        }else{
                            t.praBoxClick = false;
                        }
                        if (rep && rep.responseObject && rep.responseObject.responseStatus) {
                            if (param.upDownType) {//点赞
                                if (praBox.hasClass("zanActive")) {//取消点赞
                                    praBox.removeClass("zanActive");
                                    if (pNum.text().indexOf("万") == -1) {
                                        pNum.text(parseInt(pNum.text()) > 0 ? (parseInt(pNum.text()) - 1) : 0);
                                    }
                                } else {
                                    praBox.addClass("zanActive");
                                    if (pNum.text().indexOf("万") == -1) {
                                        pNum.text(parseInt(pNum.text()) + 1);
                                    }
                                }
                            } else {//收藏
                                if (colBox.hasClass("likeActive")) {//取消收藏
                                    colBox.removeClass("likeActive");
                                    if (cNum.text().indexOf("万") == -1) {
                                        cNum.text(parseInt(cNum.text()) > 0 ? (parseInt(cNum.text()) - 1) : 0);
                                    }
                                } else {
                                    colBox.addClass("likeActive");
                                    if (cNum.text().indexOf("万") == -1) {
                                        cNum.text(parseInt(cNum.text()) + 1);
                                    }
                                }
                            }
                        }
                    },
                    error: function () {
                        t.praBoxClick = false;
                    }
                });
            },
            //所属会议
            meetingStatus: function (items) {
                var t = this, _m = items.conference;
                if (_m && !$.isEmptyObject(_m)) {
                    $(".ev-joinMeeting").removeClass("hide");
                    $(".ev-joinMeeting a").attr('href', '/html/conference/' + parseInt(_m.conId) + '/1/meeting_index.html');
                    $(".ev-joinMeeting a>img").attr('src', _m.conMainPicUrl ? _m.conMainPicUrl : "/images/img10/default/loading/225_150.jpg");
                    $(".ev-joinMeeting span").text(comm.getStrByteLen(_m.conName, 60));
                }
            },
            //所属活动
            activityStatus: function (items) {
                var t = this,
                    act = items.activity;
                if (act.activityId != 0 || act.activityId != "") {
                    t.activityId=act.activityId;
                    $(".Ev-joinActivity").show().find("h6").eq(0).text(act.type == 1 ? "参加活动" : "所属专题");
                    $(".Ev-actName").text(comm.getStrByteLen(act.activityName, 28));
                    $(".Ev-actUrl").attr("href", act.activityUrl);
                    if (act.type == 1) {//参加活动
                        $(".Ev-actUrl img").attr("src", act.activityPicUrl);
                    } else {//所属专题
                        $(".Ev-actUrl img").attr("src", act.activityAttUrl);
                    }
                }
            },
            //电子书视频终端的所属文章和所属章节
            eBookStatus: function (data) {
                var t = this;
                var book;
                if (videoType == 19) {
                    book = data.book ? data.book : "";
                } else {
                    book = data.bookDoc ? data.bookDoc : "";
                }
                if (book && !$.isEmptyObject(book) && book.catalogueSortId) {
                    $("#catalogueId").val(book.catalogueId);
                    $("#catalogueSortId").val(book.catalogueSortId);
                    $("#catalogueParentId").val(book.catalogueParentId);
                    $("#bookId").val(book.bookId);
                    if (videoType == 19) {//电子书视频终端专享
                        //所属文章
                        $("#catalogueName").val(book.videoCatalogueName);
                        $(".Ev-joinArticle").show();
                        $(".Ev-joinArticle span").text(comm.getStrLen(book.docName, 40));
                        $(".Ev-joinArticle a").attr("href", book.pageStoragePath);
                        if (book.bookDocPicUrl) {
                            $(".Ev-joinArticle img").attr("src", book.bookDocPicUrl);
                        } else {
                            $(".Ev-joinArticle img").remove();
                            $(".Ev-joinArticle span").css("margin-left", "30px");
                        }
                    } else {
                        $("#catalogueName").val(book.docCatalogueName);
                    }
                    //所属章节（目前暂时隐藏不显示所属章节）
                    $(".Ev-joinChapter").show();
                    $(".Ev-joinChapter li>span>a").text(comm.getStrLen($("#catalogueName").val(), 40)).attr("href", "/pages/eBook/eBook_chapter.html?articleBook="
                        + parseInt(book.bookId) + "&articleCatalogue=" + parseInt(book.catalogueParentId)
                        + "&catalogueName=" + $("#catalogueName").val() + "&catalogueNum=" + parseInt(book.catalogueSortId)
                        + "&articleId=" + parseInt(book.bookId) + "#1");

                    if (videoType == 19) {//电子书视频终端专享
                        scenes&&scenes.eBookVideo&&scene.eBookVideo();
                    }
                    if (ebookType == 18) {
                        t.relateArticle();//电子书文章终端相关文章
                    }
                }
            },
            //举报纠错
            corReport: function () {
                var t = this;
                //纠错 丨 举报
                var onLoginClose;
                if (refTy == 1) {
                    onLoginClose = function () {
                        g_sps.jump(null, "/pages/channel/video/video_index.html");
                    };
                }
                if (refTy == 2) {
                    onLoginClose = function () {
                        g_sps.jump(null, "/pages/channel/doc/doc_index.html");
                    };
                }
                if (refTy == 4) {
                    onLoginClose = function () {
                        g_sps.jump(null, "/pages/channel/topic/topic_index.html");
                    };
                }
                if (refTy == 7) {
                    onLoginClose = function () {
                        g_sps.jump(null, "/pages/channel/case/case_index.html");
                    };
                }
                $(".Ev-correction").on("click", function () {
                    user.login({
                        callback: function () {
                            g_sps.jump(null, "/pages/singlePage/correction/correction.html?refType=" + refTy + "&refId=" + refId);
                        },
                        scene: 'auth',
                        onClose: onLoginClose,
                        onAuthCancel: "back" ,// 当点暂不认证时的处理、回退到来源页
                        stay:true
                    });

                });
                $(".Ev-report").on("click", function () {
                    user.login({
                        callback: function () {
                            module.report({refType: refTy, refId: refId});
                        },
                        scene: 'auth',
                        onClose: onLoginClose,
                        onAuthCancel: "back",      // 当点暂不认证时的处理、回退到来源页
                        stay:true
                    });
                });
            },
            //分享的参数就请
            sharaOpAjax: function () {
                var t = this;
                var paramLog = {};
                var param = {};
                param.resourceType = refTy;
                param.sessionCustomerId = $('#sesCustomerId').val()!=""&&$('#sesCustomerId').val()!=undefined?$('#sesCustomerId').val():"",
                param.sceneType = 6;
                setTimeout(function(){
                    switch (parseInt(refTy)) {
                        case 1://视频
                            var priceState = $(".al-mainContent").attr('data-collegecoursestate');
                            if(isNaN(parseInt(priceState,10))||(parseInt(priceState,10)===0)){
                            param.videoId = refId;
                            paramLog.shareSence = shareSenceConst.video_detail;
                            if (videoType == 19) {
                                param.sceneType = 27;
                            }
                        }else{
                                param.resourceType = 0;
                                param.sceneType = 100;
                                param.customerId = $('#sesCustomerId').val()!=""&&$('#sesCustomerId').val()!=undefined?$('#sesCustomerId').val():"";
                                param.videoName = payForClass.data.videoInfo.cms_video.videoName;
                                param.videoId	 = payForClass.data.videoInfo.cms_video.videoId;
                            }
                            break;
                        case 2://文库,
                            param.docId = refId;
                            paramLog.shareSence = shareSenceConst.doc_detail;
                            if (ebookType == 18) {
                                param.sceneType = 27;
                            }
                            break;
                        case 4://话题
                            param.topicId = refId;
                            paramLog.shareSence = shareSenceConst.topic_detail;
                            break;
                        case 7://病例
                            param.caseId = refId;
                            paramLog.shareSence = shareSenceConst.case_detail;
                            break;
                    }
                    var cBack=function(rep){
                        if (comm.hasResponseData(rep)&& rep.responseObject.responseData.data_list && rep.responseObject.responseData.data_list[0]) {
                            var items = rep.responseObject.responseData.data_list[0];
                            var sinaTitle, qqTitle, qZoneTitle, qqSummary, qZoneSummary, picUrl, shareTitle, shareDesc;
                            picUrl = items.share_comm.shareImageUrl;
                            shareTitle = items.share_comm.shareTitle != "" ? items.share_comm.shareTitle : document.title;
                            paramLog.picUrl = picUrl;
                            paramLog.shareTitle = shareTitle;
                            $.each(items.share_channel, function (i, el) {
                                if (el.shareChannel == 'Sina') {
                                    sinaTitle = el.shareTitle;
                                    shareDesc = el.shareDesc.split(':http')[0];
                                    paramLog.sinaTitle = sinaTitle;
                                    paramLog.shareDesc = shareDesc;
                                } else if (el.shareChannel == "QQFriend") {
                                    qqTitle = el.shareTitle;
                                    qqSummary = el.shareDesc;
                                    paramLog.qqTitle = qqTitle;
                                    paramLog.qqSummary = qqSummary;
                                } else if (el.shareChannel == "QZone") {
                                    qZoneTitle = el.shareTitle;
                                    qZoneSummary = el.shareDesc;
                                    paramLog.qZoneTitle = qZoneTitle;
                                    paramLog.qZoneSummary = qZoneSummary;
                                }
                            });
                            //终端固定的分享
                            var param1 = {};
                            param1.box = $(".Ev-shareBox");
                            param1.type = 3;
                            t.shareOp(param1, paramLog);
                            //底部悬浮的分享
                            var data = {};
                            data.box = $(".ev-shareContainer");
                            data.type = 2;
                            t.shareOp(data, paramLog);
                        }
                    };
                    comm.ajax.async(t.path.shareDes, {paramJson: $.toJSON(param)},cBack);
                },2000);


            },
            //分享
            shareOp: function (data, kv) {
                var wapUrl;
                if ($("#resourceWapUrl").val().indexOf("m.allinmd.cn") > -1) {
                    wapUrl = $("#resourceWapUrl").val();
                } else {
                    wapUrl = "https://m.allinmd.cn" + $("#resourceWapUrl").val();
                }
                module.share({
                    container: data.box,// 存放分享组件的父级
                    type: data.type,// 默认为 1  1 ：社交分享  2 ：页面左下角全站分享 3.终端页面的固定分享
                    url: window.location,// 分享链接， 默认取当前页链接
                    h5Url: wapUrl,//h5页面的链接会生成微信二维码
                    title: kv.shareTitle,// 分享标题
                    shareTrend: 1,//0: 不需要站内动态分享  1 ：需要站内动态分享
                    trendUrl: PC_CALL + "reprint/create/",// 分享到站内动态的接口
                    data: {
                        //dataFlag: 2,
                        refId: refId,
                        customerId: $("#sesCustomerId").val(),
                        reprintType: refTy,
                        visitSiteId: 1  //1PC 2 h5
                    },// 分享到站内动态的接口参数
                    callback: function () {
                    },// 分享到站内动态成功后回调函数
                    pic: kv.picUrl,// 分享图片
                    sinaTitle: kv.shareDesc,// 新浪分享标题
                    sinaSummary: kv.shareDesc,// 新浪分享描述
                    qqTitle: kv.qqTitle,//qq 好友分享标题
                    qqSummary: kv.qqSummary,//qq 好友分享描述
                    qqZoneTitle: kv.qZoneTitle,//qq 空间分享标题
                    qqZoneSummary: kv.qZoneSummary,//qq 空间分享描述
                    shareSinaSuc: function () {
                        comm.shareLog({
                            shareType: "",
                            resourceId: "",
                            resourceType: "",
                            refId: "",
                            shareSence: kv.shareSence,
                            shareChannel: 3,
                            shareContent: kv.shareDesc
                        });
                    },
                    shareQQSuc: function () {
                        comm.shareLog({
                            shareType: "",
                            resourceId: "",
                            resourceType: "",
                            refId: "",
                            shareSence: kv.shareSence,
                            shareChannel: 2,
                            shareContent: kv.qqTitle
                        });
                    },
                    shareQzoneSuc: function () {
                        comm.shareLog({
                            shareType: "",
                            resourceId: "",
                            resourceType: "",
                            refId: "",
                            shareSence: kv.shareSence,
                            shareChannel: 1,
                            shareContent: kv.qZoneTitle
                        });
                    }
                });
            },
            //右侧悬浮
            floatCard: function () {
                var _e = $(".Ev-floatCard");
                var top = _e.offset() ? _e.offset().top : 90;
                $(window).bind("scroll", function () {
                    var scrTop = $(window).scrollTop();
                    if (scrTop >= top) {
                        _e.css({"position": "fixed", "top": "50px"});
                    } else {
                        _e.css({"position": "absolute", "top": "0"});
                    }
                });
            }
        };
        controller.init();
        column();
        //针对病例、话题、文库
        if (refTy == 2 || refTy == 4 || refTy == 7 || videoType == 19) {
            var scenes, onLoginClose;
            if (refTy == 2) {
                scenes = privilegeSceneConst.eSceneTypeDocDetail;
                onLoginClose = function () {
                    g_sps.jump(null, "/pages/channel/doc/doc_index.html");
                };
            }
            if (refTy == 4) {
                scenes = privilegeSceneConst.eSceneTypeTopicDetail;
                onLoginClose = function () {
                    g_sps.jump(null, "/pages/channel/topic/topic_index.html");
                };
            }
            if (refTy == 7) {
                scenes = privilegeSceneConst.eSceneTypeCaseDetail;
                onLoginClose = function () {
                    g_sps.jump(null, "/pages/channel/case/case_index.html");
                };
            }
            if (videoType == 19) {
                scenes = privilegeSceneConst.eSceneTypeVideoPlay;
                onLoginClose = function () {
                    g_sps.jump(null, "/pages/channel/video/video_index.html");
                };
            }
            user.login({
                callback: function () {
                    $(".mask_body").remove();
                    if (refTy == 4 || refTy == 7) {//话题和病例
                        controller.topicCaseOp();
                    }
                    controller.getParam();
                    controller.sharaOpAjax();
                    getCommentHeadImg();
                },
                scene: scenes,
                onClose: onLoginClose,
                onAuthCancel: "back"      // 当点暂不认证时的处理、回退到来源页
            });
        }
        scene.TopHeadLoginCallback = function () {
            controller.discussClick();
            controller.corReport();
            controller.floatCard();
            controller.sharaOpAjax();
            if (refTy == 1 && videoType != 19) {//普通视频
                $(".Ev-followBtn .followBtn").remove();
                controller.recommendVideoList();
                controller.getParam();
            }
        };
    }
);
