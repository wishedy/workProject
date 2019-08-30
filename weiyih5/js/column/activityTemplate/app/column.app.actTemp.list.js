/**
 * 功能描述：  专题模板
 * 使用方法:
 * 注意事件：
 * 引入来源：
 * 作用：公共方法
 * Created by HJ on 2017/7/3.
 */
var spTemp_list = {};
spTemp_list.one = {
    spTemp_listLoad: function (ev) {
        var myList = {
            config: {
                url: M_CALL + "activity/column/recommend/getResourceMapList/",//分页请求接口
                screeningUrl: M_CALL + "activity/menu/layout/module/getColumnChooseRecommendMap/"//筛选确定选择的接口
            },
            init: function () {
                var t = this;
                t.addList(ev);
                t.videoMore();
                t.videoDetailClick();
                t.checkEndTime();
                t.checkMoreClick();
                t.doctorList();//3.7医师列表交互
            },
            /*** 处理点击事件 */
            appClickEvent:function(){
                var t=this;
                //新闻专家列表展开更多操作
                $(".ev-openMore").off("click").on("click",function(){
                    if($(this).hasClass("pickUp")){//收起操作
                        $(".listCont").eq(0).css("margin-bottom","0").siblings(".listCont").hide();
                        $(this).removeClass("pickUp").text("展开更多").show();
                    }else{//展开操作
                        $(".listCont").eq(0).css("margin-bottom","0.8rem").siblings().show();
                        $(this).addClass("pickUp").text("收起").show().prev(".listCont").css("margin-bottom","0");
                    }
                    t.navFixed();
                });
                $(".ev-appClickList").off("click").on("click", function () {
                    var resourceId,resourceType,tplPath;
                    if($(this).attr("resourceId")){
                        resourceId = $(this).attr("resourceId");
                        resourceType = $(this).attr("resourceType");
                        tplPath = $(this).attr("tplPath");
                    }else{
                        resourceId = $(this).find(".appZDtitle").attr("resourceId");
                        resourceType = $(this).find(".appZDtitle").attr("resourceType");
                        tplPath = $(this).find(".appZDtitle").attr("tplPath");
                    }
                    appjs.gotoTerminalDetailVC($.toJSON({
                        "resourceId": resourceId,
                        "resourceType": resourceType,
                        "tplPath": tplPath
                    }));
                });
                $(".ev-appClickPerson").off("click").on("click", function () {
                    var resourceId = $(this).find(".appPerTitle").attr("resourceid");
                    if (resourceId) {
                        appjs.gotoPersonalCenter($.toJSON({"customerId": resourceId}))
                    }
                });
                $(".appVideoLive").off("click").on("click", function () {
                    var conId = $(this).attr("conid"),
                        conSubId = $(this).attr("consubid");
                    appjs.gotoConferenceLive($.toJSON({'conSubId': conSubId, 'conId': conId}));
                });
                $(".appResouSans").off("click").on("click", function () {
                    var appResouUrl = $(this).attr("appresouurl");
                    if (appResouUrl) {
                        appjs.gotoAdPage($.toJSON({"adLinkUrl": appResouUrl}))
                    }
                });
                $(".appThemeUrl").off("click").on("click", function () {
                    var appuUrl = $(this).attr("appUrl");
                    if (appuUrl) {
                        appjs.gotoAdPage($.toJSON({"adLinkUrl": appuUrl}))
                    }
                });
            },
            //查看更多按钮点击处理，查看详情按钮点击处理
            checkMoreClick: function () {
                $(".checkMore").off("click").on("click", function () {
                    var _num = $(this).find("a").attr("h5url").substr($(this).find("a").attr("h5url").indexOf("=") + 1);
                    $('.spTemp_total_nav_list li span[data-navText=' + _num + ']').click();
                    backToTop(0);
                    return false;
                });
                $(".ev-actDetailBtn").off("click").on("click", function () {
                    var _num = $(this).attr("h5url").substr($(this).attr("h5url").indexOf("=") + 1);
                    $('.spTemp_total_nav_list li span[data-navText=' + _num + ']').click();
                    backToTop(0);
                    return false;
                });
                function backToTop(delay) {
                    $('html,body').animate({
                        scrollTop: 0
                    }, delay, "swing");
                }
            },
            //封装请求函数
            ajaxFn: function (opt) {
                var o = opt;
                $.ajax({
                    url: o.url,
                    type: 'post',
                    data: o.param,
                    dataType: 'json',
                    success: function (data) {
                        if (data) {
                            o.fn(data)
                        }
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                    }
                })
            },
            //点赞
            dianZan: function (refId,refType) {
                var data = {
                    customerId: appjs.getAuthorCustomerId() ? appjs.getAuthorCustomerId() : '',
                    refId: refId,
                    usefulType:refType?refType:9,
                    upDownType: 1
                };
                var params = {
                    paramJson: $.toJSON(data)
                };
                $.ajax({
                    url: M_CALL + "customer/prefer/create/",
                    type: "post",
                    data: params,
                    dataType: "json",
                    async: false,
                    success: function (data) {
                    }
                });
            },
            clearZan: function (refId,refType) {
                var data = {
                    customerId: appjs.getAuthorCustomerId() ? appjs.getAuthorCustomerId() : '',
                    refId: refId,
                    usefulType: refType?refType:9,
                    upDownType: 1
                };
                var params = {
                    paramJson: $.toJSON(data)
                };
                $.ajax({
                    url: M_CALL + "customer/prefer/delete/",
                    type: "post",
                    data: params,
                    dataType: "json",
                    async: false,
                    success: function (data) {
                    }
                });
            },
            clickPraise: function (c, b) {
                var t = this;
                $(c).find('.spTemp_praise').off("click").on("click", function (event) {
                    appjs.praise();
                    var _that = $(this);
                    var refId = _that.attr("resourceId");
                    var refType = _that.attr("refType")?_that.attr("refType"):"";
                    if (appjs.getPraise() == true) {
                        if (_that.hasClass("spTemp_praise_no")) {
                            t.dianZan(refId, refType);
                            _that.removeClass("spTemp_praise_no").addClass("spTemp_praise_yes").html("已赞");
                            var asNum = _that.parents(c).find(b);
                            var asNumA = parseInt(asNum.text()) + 1;
                            asNum.text(asNumA);
                            _that.parents(c).find('.zhezhao_dianzanSuc').show().siblings('.zhezhao_dianzanDef').hide();
                            setTimeout(function () {
                                _that.parents(c).find('.zhezhao_dianzanSuc').hide()
                            }, 3000);
                        } else if (_that.hasClass("spTemp_praise_yes")) {
                            t.clearZan(refId, refType);
                            _that.removeClass("spTemp_praise_yes").addClass("spTemp_praise_no").html("点赞");
                            var asNum = _that.parents(c).find(b);
                            var asNumC = parseInt(asNum.text()) > 0 ? (parseInt(asNum.text()) - 1) : 0;
                            asNum.text(asNumC);
                            _that.parents(c).find('.zhezhao_dianzanDef').show().siblings('.zhezhao_dianzanSuc').hide();
                            setTimeout(function () {
                                _that.parents(c).find('.zhezhao_dianzanDef').hide()
                            }, 3000);
                        }
                        event.stopPropagation();
                    }
                    return false;
                });
            },
            //创建展开更多DOM
            unfoldMoreHtml: function () {
                var unfoldMore = $('<div class="unfoldMore"><p>展开更多</p></div>');
                return unfoldMore;
            },
            //直播时间比较
            checkEndTime: function () {
                if ($(".video_live_box").length > 0 && !$(".video_live_box").find(".ev-actDetailBtn").length) {
                    var beginTime = $("#videoComponent").attr("begintime");
                    var begin = Date.parse(beginTime.replace(/-/g, "/"));
                    var endTime = $("#videoComponent").attr("endtime");
                    var end = Date.parse(endTime.replace(/-/g, "/"));
                    var now = new Date().getTime();
                    if (begin < now && now < end) {
                        $('.gsVideo').show().siblings().remove();
                    } else if (begin > now) {
                        $('.beginTime').show().siblings().remove();
                    } else if (now > end) {
                        $('.endTime').show().siblings().remove();
                    }
                }
            },
            //普通视频点击跳转
            videoDetailClick: function () {
                $(".ev-actDetailIntro").off("click").on("click", function () {
                    var resourceId = $(this).attr("resourceid"),
                        resourceType = $(this).attr("resourcetype"),
                        tplPath = $(this).attr("tplpath");
                    appjs.gotoTerminalDetailVC($.toJSON({
                        "resourceId": resourceId,
                        "resourceType": resourceType,
                        "tplPath": tplPath
                    }));
                });
            },
            //视频简介展开更多
            videoMore: function () {
                var t = this;
                if ($(".video_live_introt_down") && $(".video_live_introt_down").text().length > 66) {
                    var videoAllIntro = $(".video_live_introt_down").text();
                    var videoIntro = comm.getStrLen($(".video_live_introt_down").text(), 132);
                    $(".video_live_introt_down").text(videoIntro);
                    $(".video_intro_more").show();
                }
                $(".video_intro_more span").on("click", function () {
                    if ($(".video_intro_more").hasClass("video_intro_more_spread")) {
                        $(".video_live_introt_down").text(videoAllIntro);
                        $(this).parent(".video_intro_more").addClass("video_intro_more_pack").removeClass("video_intro_more_spread").end().text("收起")
                    } else if ($(".video_intro_more").hasClass("video_intro_more_pack")) {
                        $(".video_live_introt_down").text(videoIntro);
                        $(this).parent(".video_intro_more").addClass("video_intro_more_spread").removeClass("video_intro_more_pack").end().text("展开")
                    }
                })
            },
            //新闻轮播
            newsSwiper: function () {
                var act_news_swiper = new Swiper('.act_news_swiper', {
                    autoplay: 3000,
                    loop: true,
                    autoplayDisableOnInteraction: false
                });
            },
            themeNewsHtml: function (data) {
                var t = this;
                var themeNewsHtml = '',
                    moduleItem = data.moduleItem,
                    item = data.item,
                    aa = item.componentType,
                    dataId = data.dataId;
                if (moduleItem && moduleItem.length > 0) {
                    for (var j = 0; j < moduleItem.length; j++) {
                        var listItem = moduleItem[j];
                        themeNewsHtml += listItem.cnNewsBody;
                    }
                }
                //新闻列表
                if ($('.sp_container_l div[data-id=' + dataId + ']') && aa == 4) {
                    $('.sp_container_l div[data-id=' + dataId + ']').children('.theme_news').html(themeNewsHtml);
                }
                t.appClickEvent();
            },
            //TODO：3.7改版支持最后一届万例挑一：医师列表
            /*
            * 思路：模板中配置带有独立class标识的新闻，利用这个class进行追加在前端写死的维护好的json数据并将数据进行循环。
            *       json文件'/js/column/activityTemplate/doctorLists.json'。
            *
            * 功能：
            *   1，根据二级导航选择数据进行对应展示。
            *   2，展地区、医师列表。
            *   3，根据地区展示相应的医师列表。
            *   4，展开地区，并在选择地区后收起展开列表、
            *   5，点击医师跳转到对应的战队详情页。
            *   6，扫描二维码进行加入战队进入报名流程。
            *   7，点击加入战队后进入报名流程。
            *   8，保存二维码图片。
            *   9，分享。
            *
            * 注意：
            *   后台随意配置Tab位置，但在二级菜单中顺序配置时，关节的新闻中必须加入nav1类，否则会导致数据对应错误。
            * */

            doctorList:function(){
                var t = this;
                //如果是新闻并且是医师列表页
                if($('.theme_news').length>0 && $('.teacherIntroduction').length>0){
                    if($('.teacherIntroduction').hasClass('nav1')){
                        t.getDoctorsFn(1);
                    }else if($('.teacherIntroduction').hasClass('nav2')){
                        t.getDoctorsFn(2);
                    }else{
                        t.getDoctorsFn(3);
                    }
                }
            },
            //通过参数获取医师列表
            getDoctorsFn(leve){
                var t = this;
                var leve = parseInt(leve-1);
                $.ajax({
                    url: '/js/column/activityTemplate/doctorLists.json',
                    type: "get",//请求方式为get
                    dataType: "json", //返回数据格式为json
                    success: function (data) {
                        if (data && data.doctorList) {
                            //地区HTML
                            //循环所有的数据
                            var areaHtml = '';//收起时的地区
                            var allAreaHtml = '';
                            var isHaveDoc = false;//表示有医师列表
                            if(data.doctorList[leve] && data.doctorList[leve].areaList && data.doctorList[leve].areaList.dataList){
                                for(var i in data.doctorList[leve].areaList.dataList){
                                    if(i<data.doctorList[leve].areaList.dataList.length){//加入判断否则在循环时会循环出最后一个undefined
                                        if(i<=9){
                                            areaHtml += '<li data-index="'+i+'" data-id="'+data.doctorList[leve].areaList.dataList[i].doctorIds+'">'+data.doctorList[leve].areaList.dataList[i].areaName+'</li>'
                                        }
                                        allAreaHtml += '<li data-index="'+i+'" data-id="'+data.doctorList[leve].areaList.dataList[i].doctorIds+'">'+data.doctorList[leve].areaList.dataList[i].areaName+'</li>'
                                    }
                                }
                            }
                            //总体的HTML
                            var domHtml = ' <div class="areaCont">' +
                                '                            <ul class="areaHtml">' +
                                areaHtml+
                                '                               <li class="areaIcon">' +
                                '                                   <img src="/images/img50/column/activityTemplate/areaIcon2.png" alt="">' +
                                '                               </li>' +
                                '                            </ul>' +
                                '                           <ul class="allAreaHtml">' +
                                allAreaHtml+
                                '</ul>' +
                                '                        </div>' +
                                '                        <div class="doctorList">' +
                                '                            <ul></ul>' +
                                '                        </div>' +
                                '                        <div class="isNoneDate" style="display: none">' +
                                '                            导师即将公布，请耐心等待…' +
                                '                        </div>';
                            $('.theme_news .teacherIntroduction').html(domHtml);
                            var areaH = 0;
                            //地区点击事件
                            $('.areaCont li').off('click').on('click',areaHtmlChildrenOnClick);
                            //地区点击事件处理函数
                            function areaHtmlChildrenOnClick(){
                                areaH = $('.areaHtml').height();//保存原始高度，用来点击某个地区后处理收起的样式。
                                isHaveDoc = false;//初始化默认为没有医师列表
                                if($(this).hasClass('areaIcon')){//如果是点击的展开按钮
                                    $('.areaCont').eq(0).css('overflow','scroll');
                                    $('.areaCont').eq(0).css('height',$('.areaCont .allAreaHtml').height());
                                    $('.areaHtml').hide();
                                    $('.allAreaHtml').show();
                                }
                                else{
                                    if($(this).parents().hasClass('allAreaHtml')){//如果是点击的全部地区，则进行两行展示地区的更新
                                        var line = parseInt($(this).attr('data-index')/5);//获取到第几行
                                        var indexSmall = 0;//两行展示的最小索引
                                        var indexBig = 0;//两行展示的最大索引
                                        var newAreaHtml = '';//重新生成的新的两行展示的地区
                                        if(line==0){//如果是第一行
                                            indexSmall = 0;
                                            indexBig = 10;
                                        }else{
                                            indexSmall = parseInt((line-1)*5);
                                            indexBig = parseInt((line+1)*5);
                                        }
                                        for(var m = indexSmall;m<indexBig;m++){//循环两个节点之间的地区
                                            if(data.doctorList[leve].areaList.dataList[m]){
                                                newAreaHtml += '<li data-index="'+m+'" data-id="'+data.doctorList[leve].areaList.dataList[m].doctorIds+'">'+data.doctorList[leve].areaList.dataList[m].areaName+'</li>'
                                            }
                                        }
                                        newAreaHtml += '<li class="areaIcon">' +
                                            '                                <img src="/images/img50/column/activityTemplate/areaIcon2.png" alt="">' +
                                            '           </li>';
                                        $('.areaHtml').html(newAreaHtml);
                                    }
                                    //样式处理
                                    $('.areaCont').eq(0).css('overflow','hidden');
                                    $('.areaCont').eq(0).css('height',areaH);
                                    $('.areaHtml').show();//两行展示
                                    $('.allAreaHtml').hide();//全部隐藏
                                    $('.areaHtml li').removeClass('active');
                                    $('.areaHtml li[data-index="'+$(this).attr("data-index")+'"]').addClass('active');//nice!
                                    $('.allAreaHtml li').removeClass('active');
                                    $('.allAreaHtml li[data-index="'+$(this).attr("data-index")+'"]').addClass('active');
                                    var docIds = '';
                                    var docHtml = '';
                                    if($(this).attr('data-id')){//取到该地区下所有的医生的id
                                        docIds = $(this).attr('data-id')!=''?$(this).attr('data-id').split(','):'';
                                    }
                                    //医师结构
                                    if(docIds.length<=0){//不存在配置的医师，即在地区中没有配置相应医师
                                        $('.isNoneDate').show();
                                        $('.doctorList').hide();
                                    }else{//如果配置了相应的医师，默认为不存在，当循环出现匹配的医师后，进行展示医师列表，隐藏即将公布样式
                                        $('.isNoneDate').hide();
                                        $('.doctorList').show();
                                        var areaIndex = $('.allAreaHtml li[class=active]').index();
                                        if(data.doctorList[leve] && data.doctorList[leve].areaList && data.doctorList[leve].areaList.dataList && data.doctorList[leve].areaList.dataList[areaIndex].docDataList){
                                            var dataList = data.doctorList[leve].areaList.dataList[areaIndex].docDataList;
                                            for(var n in dataList){
                                                if(dataList.length>0 && n<dataList.length){
                                                    isHaveDoc = true;//存在医师
                                                    var actId = $('#activityId').val();
                                                    docHtml += '<li class="doctorItem" data-jumpUrl="'+(dataList[n].teamBgImg?'/pages/column/activityTemplate/activity_appTeamDesc.html?leve='+leve+'&areaLeve='+areaIndex+'&docLeve='+n:'javascript:;')+'">' +
                                                        '                                    <div class="doctorPic">' +
                                                        '                                        <img crossOrigin="anonymous" src="'+dataList[n].coverPicUrl+'" alt="">' +
                                                        '                                    </div>' +
                                                        '                                    <div class="doctorDesc">' +
                                                        '                                        <p class="itemName">' +
                                                        '                                            <span>'+comm.getStrLen(dataList[n].doctorName,14)+'</span>' +
                                                        '                                            <a href="javascript:;">查看详情</a>' +
                                                        '                                        </p>' +
                                                        '                                        <p class="itemAuth isPadding">'+dataList[n].medicalTitleShow+'</p>' +
                                                        '                                        <p class="itemAuth">'+comm.getStrLen(dataList[n].hospitalName,28)+'</p>' +
                                                        '                                    </div>' +
                                                        '                                </li>';
                                                }
                                            }
                                            $('.doctorList ul').html(docHtml);
                                            $('.doctorItem').on('click',function () {
                                                window.location.href = $(this).attr('data-jumpUrl')
                                            })
                                        }
                                        if(isHaveDoc){//如果存在医师
                                            $('.isNoneDate').hide();
                                            $('.doctorList').show();
                                        }else{
                                            $('.isNoneDate').show();
                                            $('.doctorList').hide();
                                        }
                                    }
                                    // 重新生成的头两行，需要重新添加点击事件，但是不会影响已有的“全部地区”的 li 元素上的点击事件
                                    $('.areaHtml li').off('click').on('click',areaHtmlChildrenOnClick);
                                }
                            }
                            $('.areaCont li').eq(0).trigger("click");
                        }
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        console.log('失败')
                    }
                })
            },
            //创建资源列表DOM
            resourceListHtml: function (data) {
                var t = this,promoteFlag="";
                var resourceListHtml = '',
                    item = data.item,
                    moduleItem = data.moduleItem,
                    isSocial = data.isSocial,
                    dataId = data.dataId,
                    preferUpOrScore = "",
                    act_type_res = "",
                    aa = item.componentType;

                if (item.interactiveOperation) {
                    var isHasPre = item.interactiveOperation; //是否有点赞
                }
                if (moduleItem && moduleItem.length > 0) {
                    for (var j = 0; j < moduleItem.length; j++) {
                        var listItem = moduleItem[j],
                            resouTyp = listItem.resourceType,
                            refId = listItem.refId, //关联ID
                            isPrefer = listItem.customerPreferIsValid, //是否点赞
                            resou_socialNum = "", //资源列表社交内容
                            video_play_time = "", //视频播放时间
                            videoBtn = ""; //视频播放按钮
                        //判断资源类型
                        switch (parseInt(resouTyp)) {
                            case 1:
                                video_play_time = '<span class="spTemp_list_videoTime">' + listItem.playTime + '</span>';
                                videoBtn = '<i class="btn_small"><img src="/images/img50/column/specialTemplate/play-btn-small.png" alt=""></i>';
                                act_type_res = '<span class="act_icons video_icon">视频</span>';
                                break;
                            case 2:
                                act_type_res = '<span class="act_icons doc_icon">文库</span>';
                                break;
                            case 4:
                                act_type_res = '<span class="act_icons topic_icon">话题</span>';
                                break;
                            case 7:
                                act_type_res = '<span class="act_icons case_icon">病例</span>';
                                break;
                        }
                        //判断有几个社交内容
                        if (isSocial) {
                            for (var k = 0; k < isSocial.length; k++) {
                                switch (parseInt(isSocial[k])) {
                                    case 1:
                                        resou_socialNum += '<li class="resource_list_stat_liulan">' + (listItem.browseNum ? listItem.browseNum.toWK() : "0") + '</li>';
                                        break;
                                    case 2:
                                        resou_socialNum += '<li class="resource_list_stat_shoucang">' + (listItem.collectionNum ? listItem.collectionNum.toWK() : "0") + '</li>';
                                        break;
                                    case 3:
                                        resou_socialNum += '<li class="resource_list_stat_pinglun">' + (listItem.reviewNum ? listItem.reviewNum.toWK() : "0") + '</li>';
                                        break;
                                    case 4:
                                        resou_socialNum += '<li class="resource_list_stat_dianzan">' + ((isPrefer==1&&listItem.preferUpNum==0)?"1":(listItem.preferUpNum ? listItem.preferUpNum.toWK() : "0")) + '</li>';
                                        break;
                                }
                            }
                        }
                        //判断点赞状态
                        if (isHasPre == 1) {
                            preferUpOrScore = '<span class="spTemp_praise ' + (isPrefer == 0 ? "spTemp_praise_no" : "spTemp_praise_yes") +
                                '" resourceId="' + refId + '" isPrefer="' + isPrefer + '" refType="'+resouTyp+'">' + (isPrefer == 0 ? "点赞" : "已赞") + '</span>';

                        } else if (isHasPre == 2) {
                            preferUpOrScore = (listItem.scoreResult != undefined) ? '<i class="act_scoreResult">' + listItem.scoreResult + '</i><i class="fen_font">分</i>' : '';
                        } else {
                            preferUpOrScore = "";
                        }
                        var name = listItem.author;
                        var manyAuthor = false;
                        if(resouTyp == 1){//视频
                            name = listItem.ownerNameStr;
                            if(name&&name.split(",").length&&name.split(",").length>=2){//多作者
                                manyAuthor = true;
                            }
                        }
                        //判断是否有图片
                        if (listItem.coverPicUrl) {
                            if (item.isShowPromoted != 0 && (item.isShowPromoted == listItem.isPromoted)) {//晋级
                                if (listItem.promotedName && $.trim(listItem.promotedName)) {//晋级阶段名称存在
                                    if (comm.getByteLen(listItem.promotedName) > 5) {//三个字，大样式
                                        promoteFlag = '<b class="bigImg">晋级' + listItem.promotedName + '</b>';
                                    } else {
                                        promoteFlag = '<b class="smallImg">晋级' + listItem.promotedName + '</b>';
                                    }
                                } else {
                                    promoteFlag = '<b></b>';
                                }
                            } else {//未晋级
                                promoteFlag = "";
                            }

                            resourceListHtml += '<section class="spTemp_list_resource ev-appClickList case_content res_list_border">' +
                                '<section class="spTemp_list_resource_left ' + ($("div[data-id=" + dataId + "] .resource_list").hasClass("resource_list_leftImg_rightArt") ? "spTemp_right" : "spTemp_left") + '">' +
                                '<section class="al-actListTitleBox"><h3 class="spTemp_list_resource_title"><a href="javascript:;" resourceId="' + refId + '" resourceType="' + listItem.resourceType + '" tplPath="' + listItem.tplPath + '" class="appZDtitle">' + ((item.isShowArea == 1 && listItem.resourceForArea) ? '<span class="al-actAreaColor">【' + listItem.resourceForArea + '】</span>' + comm.getStrLen(listItem.title, 28) : comm.getStrLen(listItem.title, 40)) + '</a></h3>' +
                                '<p class="act_list_type">' + act_type_res +
                                '<span>' + (name?comm.getStrLen(name, manyAuthor?24:8):"" )+ '</span>' +
                                '<span '+(manyAuthor?'style="display:none"':'')+'>' + (listItem.hospitalName ? comm.getStrLen(listItem.hospitalName, 14) : "") + '</span>' +
                                '</p></section>' + ($("div[data-id=" + dataId + "] .resource_list").hasClass("resource_list_leftImg_rightArt") ? '<section class="activityPraise">' +
                                '<ul>' + resou_socialNum + '</ul><div class="praiseCont">' + preferUpOrScore + '</div>' + '</section>' : '<ul>' + resou_socialNum + '</ul>') +
                                '</section>' +
                                '<section class="spTemp_list_resource_right ' + ($("div[data-id=" + dataId + "] .resource_list").hasClass("resource_list_leftImg_rightArt") ? "spTemp_left" : "spTemp_right") + '">' +
                                '<div class="spTemp_list_resource_imgBox">' +
                                '<a href="javascript:;"><img src="' + listItem.coverPicUrl + '">' + videoBtn +  promoteFlag+'</a>' +
                                video_play_time +
                                ($("div[data-id=" + dataId + "] .resource_list").hasClass("resource_list_leftImg_rightArt") ? '' : '<div class="praiseCont">' + preferUpOrScore + '</div>') +
                                '</div>' +
                                '</section>' +
                                '<section class="zhezhao_dianzanSuc">点赞成功</section>' +
                                '<section class="zhezhao_dianzanDef">取消点赞成功</section>' +
                                '</section>'
                        } else {
                            if(item.isShowPromoted != 0 && (item.isShowPromoted == listItem.isPromoted)) {//晋级
                                    if (listItem.promotedName && $.trim(listItem.promotedName)) {//晋级阶段名称存在
                                        if (comm.getByteLen(listItem.promotedName) > 5) {//三个字，大样式
                                            promoteFlag = '<i class="promotion bigImg">晋级' + listItem.promotedName + '</i>';
                                        } else {
                                            promoteFlag = '<i class="promotion smallImg">晋级' + listItem.promotedName + '</i>';
                                        }
                                    } else {
                                        promoteFlag = '<i class="promotion"></i>';
                                    }
                                } else {//未晋级
                                    promoteFlag = "";
                                }
                            resourceListHtml += '<section class="spTemp_list_resource ev-appClickList case_content res_list_border">' +promoteFlag+
                                '<h3 class="spTemp_list_resource_title"><a href="javascript:;" resourceId="' + refId + '" resourceType="' + listItem.resourceType + '" tplPath="' + listItem.tplPath + '" class="appZDtitle">' + ((item.isShowArea == 1 && listItem.resourceForArea) ? '<span class="al-actAreaColor">【' + listItem.resourceForArea + '】</span>' + comm.getStrLen(listItem.title, 40) : comm.getStrLen(listItem.title, 50)) + '</a></h3>' +
                                '<p class="act_list_type">' +
                                act_type_res +
                                '<span>' + (name?comm.getStrLen(name, manyAuthor?24:8):"" )+ '</span>' +
                                '<span '+(manyAuthor?'style="display:none"':'')+'>' + (listItem.hospitalName ? comm.getStrLen(listItem.hospitalName, 14) : "") + '</span>' +
                                (!isSocial? '<p class="praiseCont praiseContPo">' +
                                preferUpOrScore +'</p>':"")+
                                '</p>' +
                                '<section class="activityPraise">' +
                                '<ul>' +
                                resou_socialNum +
                                '</ul>' +
                                (isSocial? '<p class="praiseCont">' +
                                preferUpOrScore +
                                '</p>':"")+
                                '</section>' +
                                '<section class="zhezhao_dianzanSuc">点赞成功</section>' +
                                '<section class="zhezhao_dianzanDef">取消点赞成功</section>' +
                                '</section>'
                        }
                    }
                }
                //资源列表
                if ($('.sp_container_l div[data-id=' + dataId + ']').length && aa == 1) {
                    if (item.isShowMore && item.isShowMore == 1) {
                        resourceListHtml = resourceListHtml + '<div class="checkMore"><p><a href="javascript:;" h5url="' + item.moreWebUrl.replace("/m/", "/app/") + '">查看更多</a></p></div>';
                    } else if (item.isPage == 1 && parseInt(item.pageNum) < parseInt(item.totalCount)) {  //判断是否有分页，添加展开更多DOM及事件
                        //创建资源列表请求分页时的起始页
                        var resourcePage = 2;
                        //创建展开更多DOM
                        var unfoldMore = this.unfoldMoreHtml();
                        $('.sp_container_l div[data-id=' + dataId + ']').children('.resource_list').append(unfoldMore).find('.unfoldMore').addClass("reList");
                        var unfoldMore = $('.sp_container_l div[data-id=' + dataId + ']').children('.resource_list').find('.unfoldMore');
                        var className = unfoldMore.attr("class");
                        unfoldMore.on("click", function () {
                            comm.loading.show();
                            t.addPaging(className, item, dataId, resourcePage, isSocial);
                            resourcePage++;
                        });
                    }
                }
                return resourceListHtml;
            },
            //创建会员列表DOM
            vipListHtml: function (data) {
                var t = this;
                var vipListHtml = '',
                    item = data.item,
                    moduleItem = data.moduleItem,
                    isSocial = data.isSocial,
                    dataId = data.dataId,
                    preferUp = "",
                    aa = item.componentType;
                if (item.interactiveOperation) {
                    var isHasPre = item.interactiveOperation; //是否有点赞
                }
                if (moduleItem && moduleItem.length > 0) {
                    for (var j = 0; j < moduleItem.length; j++) {
                        var listItem = moduleItem[j],
                            refId = listItem.refId, //关联ID
                            isPrefer = listItem.customerPreferIsValid, //是否点赞
                            vip_socialNum = "", //会员列表社交内容
                            companyNum = 24; //医院的截取数
                        //判断点赞状态
                        if (isHasPre == 1) {
                            companyNum = 14;
                            preferUp = '<span class="spTemp_praise ' + (isPrefer == 0 ? "spTemp_praise_no" : "spTemp_praise_yes") + '" resourceId="' + refId + '" isPrefer="' + isPrefer + '">' + (isPrefer == 0 ? "点赞" : "已赞") + '</span>';
                        }
                        //判断有几个社交内容
                        if (isSocial) {
                            for (var k = 0; k < isSocial.length; k++) {
                                switch (parseInt(isSocial[k])) {
                                    case 3:
                                        if (listItem.customerStatistic) {
                                            vip_socialNum += '<li><span>评论</span><span>' + listItem.customerStatistic.reviewNum.toWK() + '</span></li>';
                                        }
                                        break;
                                    case 4:
                                        if (listItem.customerStatistic) {
                                            vip_socialNum += '<li><span>赞</span><span class="vip_list_dianzan">' + ((isPrefer==1&&listItem.customerStatistic.othersUpNum==0)?"1":listItem.customerStatistic.othersUpNum.toWK()) + '</span></li>';
                                        }
                                        break;
                                    case 5:
                                        if (listItem.customerStatistic) {
                                            vip_socialNum += '<li><span>粉丝</span><span>' + listItem.customerStatistic.fansNum.toWK() + '</span></li>';
                                        }
                                        break;
                                    case 6:
                                        if (listItem.customerStatistic) {
                                            vip_socialNum += '<li><span>关注</span><span>' + listItem.customerStatistic.followTrendsNum.toWK() + '</span></li>';
                                        }
                                        break;
                                    case 7:
                                        if (listItem.customerStatistic) {
                                            vip_socialNum += '<li><span>贡献</span><span>' + listItem.customerStatistic.contributionCount.toWK() + '</span></li>';
                                        }
                                        break;
                                }
                            }
                        }
                        vipListHtml += '<section class="spTemp_list_member ev-appClickPerson">' +
                            '<section class="spTemp_list_member_left spTemp_left"><img src="' + listItem.coverPicUrl + '"></section>' +
                            '<section class="spTemp_list_member_center spTemp_left">' +
                            '<h3 class="spTemp_list_member_title appPerTitle" resourceid="' + refId + '">' + (listItem.title ? comm.getStrLen(listItem.title, 26) : "") + '</h3>' +
                            '<ul class="spTemp_list_member_intro">' +
                            '<li>' + listItem.medicalTitleShow + '</li>' +
                            '<li>' + (listItem.hospitalName ? comm.getStrLen(listItem.hospitalName, companyNum) : "") + '</li>' +
                            '</ul>' +
                            '<ul class="spTemp_list_member_info">' + vip_socialNum + '</ul>' +
                            '</section>' +
                            '<section class="spTemp_list_member_right spTemp_right">' + preferUp + '</section>' +
                            '<section class="zhezhao_dianzanSuc">点赞成功</section>' +
                            '<section class="zhezhao_dianzanDef">取消点赞成功</section>' +
                            '</section>'
                    }
                }
                //会员列表
                if ($('.sp_container_l div[data-id=' + dataId + ']') && aa == 2) {
                    if (item.isShowMore && item.isShowMore == 1) {
                        vipListHtml = vipListHtml + '<div class="checkMore"><p><a href="javascript:;" h5url="' + item.moreWebUrl.replace("/m/", "/app/") + '">查看更多</a></p></div>';
                    } else if (item.isPage == 1 && parseInt(item.pageNum) < parseInt(item.totalCount)) { //判断是否有分页，添加展开更多DOM及事件
                        //创建专题列表请求分页时的起始页
                        var vipPage = 2;
                        //创建展开更多DOM
                        var unfoldMore = this.unfoldMoreHtml();
                        $('.sp_container_l div[data-id=' + dataId + ']').append(unfoldMore).find('.unfoldMore').addClass("viList");
                        var unfoldMore = $('.sp_container_l div[data-id=' + dataId + ']').children('.vip_list').append(unfoldMore).find('.unfoldMore');
                        var className = unfoldMore.attr("class");
                        unfoldMore.on("click", function () {
                            comm.loading.show();
                            t.addPaging(className, item, dataId, vipPage, isSocial);
                            vipPage++;
                        });
                    }
                }
                return vipListHtml;
            },
            //创建排行榜DOM
            rankListHtml: function (data) {
                var t = this;
                var rankListHtml = "",
                    item = data.item,
                    moduleItem = data.moduleItem,
                    isSocial = data.isSocial,
                    dataId = data.dataId,
                    bb = item.recommendType, //排行榜类型 1:病例排行 2:专家排行
                    aa = 3;
                if (moduleItem && moduleItem.length > 0) {
                    for (var k = 0; k < moduleItem.length; k++) {
                        var compItem = moduleItem[k],
                            vip_socialNum = "", //专家排行社交内容
                            res_socialNum = "",//资源排行榜社交内容
                            refId = compItem.refId, //关联ID
                            rankNum = "",
                            _numIcon = "",
                            res_type = "",
                            _vPlayBtn = "",
                            _vTimeBtn = "";
                        var _thisDiv = $("div[data-id=" + dataId + "] .resource_rank");
                        //判断有几个社交内容
                        if (isSocial) {
                            for (var j = 0; j < isSocial.length; j++) {
                                switch (parseInt(isSocial[j])) {
                                    case 1:
                                        res_socialNum += '<li class="resource_list_stat_liulan">' + (compItem.browseNum ? compItem.browseNum.toWK() : "0") + '</li>';
                                        break;
                                    case 2:
                                        res_socialNum += '<li class="resource_list_stat_shoucang">' + (compItem.collectionNum ? compItem.collectionNum.toWK() : "0") + '</li>';
                                        break;
                                    case 3:
                                        res_socialNum += '<li class="resource_list_stat_pinglun">' + (compItem.reviewNum ? compItem.reviewNum.toWK() : "0") + '</li>';
                                        if (compItem.customerStatistic) {
                                            vip_socialNum += '<li><span>评论</span><span>' + compItem.customerStatistic.reviewNum.toWK() + '</span></li>';
                                        }
                                        break;
                                    case 4:
                                        res_socialNum += '<li class="resource_list_stat_dianzan">' + (compItem.preferUpNum ? compItem.preferUpNum.toWK() : "0") + '</li>';
                                        if (compItem.customerStatistic) {
                                            vip_socialNum += '<li><span>赞</span><span>' + compItem.customerStatistic.othersUpNum.toWK() + '</span></li>';
                                        }
                                        break;
                                    case 5:
                                        if (compItem.customerStatistic) {
                                            vip_socialNum += '<li><span>粉丝</span><span>' + compItem.customerStatistic.fansNum.toWK() + '</span></li>';
                                        }
                                        break;
                                    case 7:
                                        if (compItem.customerStatistic) {
                                            vip_socialNum += '<li><span>贡献</span><span>' + compItem.customerStatistic.contributionCount.toWK() + '</span></li>';
                                        }
                                        break;
                                }
                            }
                        }
                        //判断排行版前面显示数字
                        if (item.pageIndex) {
                            rankNum = k + 1 + (item.pageIndex - 1) * item.pageSize
                        } else {
                            rankNum = k + 1
                        }
                        //判断会员排行榜2  资源排行榜1
                        if (aa == 3 && bb == 2) {
                            rankListHtml += '<div class="expert_content ev-appClickPerson">' +
                                '<p class="' + (rankNum < 4 ? 'num' : 'num_1') + '"><span>' + rankNum + '</span></p>' +
                                '<div class="expert_info">' +
                                '<p class="pic"><a href="javascript:;"><img src="' + compItem.coverPicUrl + '"></a></p>' +
                                '<div class="expert_info_cont">' +
                                '<p class="expert_name"><a href="javascript:;" class="name appPerTitle" resourceid="' + refId + '">' + compItem.title + '</a>' + (rankNum < 4 ? '<i class="vipUser"></i>' : "") + '</p>' +
                                '<p class="expert_prof"><span class="prof">' + compItem.medicalTitleShow + '</span><span>' + (compItem.hospitalName ? comm.getStrLen(compItem.hospitalName, 20) : "") + '</span></p>' +
                                '<ul class="spTemp_list_member_info">' +
                                vip_socialNum +
                                '</ul>' +
                                '</div>' +
                                '</div>' +
                                '</div>'
                        }
                        //判断资源类型
                        if (compItem) {
                            switch (parseInt(compItem.resourceType)) {
                                case 1:
                                    res_type = '<span class="act_icons video_icon">视频</span>';
                                    break;
                                case 2:
                                    res_type = '<span class="act_icons doc_icon">文库</span>';
                                    break;
                                case 4:
                                    res_type = '<span class="act_icons topic_icon">话题</span>';
                                    break;
                                case 7:
                                    res_type = '<span class="act_icons case_icon">病例</span>';
                                    break;
                                    return res_type;
                            }
                        }

                        if (item.isShowSort != 0) {
                            _numIcon = '<i class="actLabel" style="background:url('
                                + (rankNum < 4 ? "/images/img50/column/specialTemplate/label.png" : "/images/img50/column/specialTemplate/lable_gray.png")
                                + ') no-repeat;background-size:cover;">' + (rankNum < 10 ? 0 + rankNum : rankNum) + '</i>';
                        } else {
                            _numIcon = "";
                        }

                        if (compItem.resourceType == 1) {
                            _vPlayBtn = '<i class="btn_small"><img src="/images/img50/column/specialTemplate/play-btn-small.png" alt=""></i>';
                            _vTimeBtn = '<span class="spTemp_list_videoTime">' + compItem.playTime + '</span>';
                        } else {
                            _vPlayBtn = "";
                            _vTimeBtn = "";
                        }
                        var _contextNum = compItem.coverPicUrl ? comm.getStrLen(compItem.title, 20) : comm.getStrLen(compItem.title, 50);
                        var promoteFlag="";
                        var name = compItem.author;
                        var manyAuthor = false;
                        if(compItem.resourceType == 1){//视频
                            name = compItem.ownerNameStr;
                            if(name&&name.split(",").length&&name.split(",").length>=2){//多作者
                                manyAuthor = true;
                            }
                        }
                        //资源排行榜
                        if (aa == 3 && bb == 1) {
                            //判断是否有图片
                            if (compItem.coverPicUrl) {//resPic图片展示 _divClass外层class不同三种情况的 _downList点赞条社交操作  _numIcon排行榜排名
                                if (item.isShowPromoted != 0 && (item.isShowPromoted == compItem.isPromoted)) {
                                    if (compItem.promotedName && $.trim(compItem.promotedName)) {//晋级阶段名称存在
                                        if (comm.getByteLen(compItem.promotedName) > 5) {//三个字，大样式
                                            promoteFlag = '<b class="bigImg">晋级' + compItem.promotedName + '</b>';
                                        } else {
                                            promoteFlag = '<b class="smallImg">晋级' + compItem.promotedName + '</b>';
                                        }
                                    } else {
                                        promoteFlag = '<b></b>';
                                    }
                                } else {//未晋级
                                    promoteFlag = "";
                                }
                                if (_thisDiv.hasClass("resource_rank_leftImg_rightArt")) {//左图右文
                                    rankListHtml += '<div class="case_content ev-appClickList rank_list_border' + (item.isShowSort == 0 ? ' case_content_noNum' : '') + ' ">' +
                                        '<div class="case_cont_left spTemp_right">' +
                                        '<section class="al-actListTitleBox">' +
                                        '<p class="title">' +
                                        '<a href="javascript:;" resourceId="' + refId + '" resourceType="' + compItem.resourceType + '" tplPath="' + compItem.tplPath + '" class="appZDtitle">' +
                                        ((item.isShowArea == 1 && compItem.resourceForArea) ? '<span class="al-actAreaColor">【' + compItem.resourceForArea + '】</span>' + _contextNum : _contextNum) +
                                        '</a></p>' +
                                        '<p class="act_list_type">' + res_type +
                                        '<span>' + (name?comm.getStrLen(name, manyAuthor?24:8):"") + '</span>' +
                                        '<span '+(manyAuthor?'style="display: none"':'')+'>' + (compItem.hospitalName ? comm.getStrLen(compItem.hospitalName, 14) : "") + '</span></p></section>' +
                                        '<section class="activityPraise">' +
                                        '<ul>' + res_socialNum + '</ul>' +
                                        '</section></div>' +
                                        '<p class="case_cont_right spTemp_left">' +
                                        '<a href="javascript:;">' +
                                        '<img class="bg" src="' + compItem.coverPicUrl.split('|')[0] + '">' +
                                        _vPlayBtn +promoteFlag+ '</a>' + _vTimeBtn + _numIcon + '</p></div>';
                                } else {//左文右图
                                    rankListHtml += '<div class="case_content ev-appClickList rank_list_border' + (item.isShowSort == 0 ? ' case_content_noNum' : '') + ' ">' +
                                        '<div class="act_case_cont_left spTemp_left">' +
                                        _numIcon +
                                        '<section class="al-actListTitleBox"><p class="title"><a href="javascript:;" resourceId="' + refId + '" resourceType="' + compItem.resourceType + '" tplPath="' + compItem.tplPath + '" class="appZDtitle">'
                                        + ((item.isShowArea == 1 && compItem.resourceForArea) ? '<span class="al-actAreaColor">【' + compItem.resourceForArea + '】</span>' + _contextNum : _contextNum) +
                                        '</a></p>' +
                                        '<p class="act_list_type">' + res_type + '<span>' + (name?comm.getStrLen(name, manyAuthor?20:8):"") + '</span>' +
                                        '<span '+(manyAuthor?'style="display: none"':'')+'>' + (compItem.hospitalName ? comm.getStrLen(compItem.hospitalName, 10) : "") + '</span></p></section>' +
                                        '<ul>' + res_socialNum + '</ul></div><p class="case_cont_right spTemp_right">' +
                                        '<a href="javascript:;"><img class="bg" src="' + compItem.coverPicUrl.split('|')[0] + '">' + _vPlayBtn + promoteFlag+'</a>'
                                        + _vTimeBtn + '</p></div></div>';
                                }
                            } else {//没有图
                                var _flagClass = "";//排行榜
                                if (item.isShowPromoted != 0 && (item.isShowPromoted == compItem.isPromoted)) {//晋级
                                    if (compItem.promotedName && $.trim(compItem.promotedName)) {//晋级阶段名称存在
                                        if (comm.getByteLen(compItem.promotedName) > 5) {//三个字，大样式
                                            promoteFlag = '<i class="promotion bigImg">晋级' + compItem.promotedName + '</i>';
                                        } else {
                                            promoteFlag = '<i class="promotion smallImg">晋级' + compItem.promotedName + '</i>';
                                        }
                                    } else {
                                        promoteFlag = '<i class="promotion"></i>';
                                    }
                                    _flagClass = item.isShowSort == 0 ? ' noNumWidthChange' : ' widthChange'
                                } else {//未晋级
                                    promoteFlag = "";
                                }
                                rankListHtml += '<div class="case_content ev-appClickList rank_list_border' + (item.isShowSort == 0 ? ' case_content_noNum' : '') + ' ">' + promoteFlag +
                                    '<div class="act_case_cont spTemp_left">' +
                                    _numIcon +
                                    '<p class="title'+_flagClass+'"><a href="javascript:;" resourceId="' + refId + '" resourceType="' + compItem.resourceType + '" tplPath="' + compItem.tplPath + '" class="appZDtitle">'
                                    + ((item.isShowArea == 1 && compItem.resourceForArea) ? '<span class="al-actAreaColor">【' + compItem.resourceForArea + '】</span>' + _contextNum : _contextNum) + '</a></p>' +
                                    '<p class="act_list_type">' + res_type + '<span>' + (name?comm.getStrLen(name, manyAuthor?24:8):"") + '</span>' +
                                    '<span '+(manyAuthor?'style="display: none"':'')+'>' + (compItem.hospitalName ? comm.getStrLen(compItem.hospitalName, 14) : "") + '</span></p>' +
                                    '<section class="activityPraise"><ul>' + res_socialNum + '</ul></section></div></div>';
                            }
                        }
                    }
                }
                //病例排行
                if ($('.sp_container_l div[data-id=' + dataId + ']') && bb == 1) {
                    if (item.isShowMore && item.isShowMore == 1) {
                        rankListHtml = rankListHtml + '<div class="checkMore"><p><a href="javascript:;" h5url="' + item.moreWebUrl.replace("/m/", "/app/") + '">查看更多</a></p></div>';
                    } else if (item.isPage == 1 && parseInt(item.pageNum) < parseInt(item.totalCount)) { //判断是否有分页，添加展开更多DOM及事件
                        //创建病例排行列表请求分页时的起始页
                        var resourceRankPage = 2;
                        //创建展开更多DOM
                        var unfoldMore = this.unfoldMoreHtml();
                        $('.sp_container_l div[data-id=' + dataId + ']').children('.resource_rank').append(unfoldMore).find('.unfoldMore').addClass("reRankList");
                        var unfoldMore = $('.sp_container_l div[data-id=' + dataId + ']').children('.resource_rank').append(unfoldMore).find('.unfoldMore');
                        var className = unfoldMore.attr("class");
                        unfoldMore.on("click", function () {
                            comm.loading.show();
                            t.addPaging(className, item, dataId, resourceRankPage, isSocial);
                            resourceRankPage++;
                        });
                    }
                }
                //专家排行
                if ($('.sp_container_l div[data-id=' + dataId + ']') && bb == 2) {
                    //判断是否有分页，添加展开更多DOM及事件
                    if (item.isShowMore && item.isShowMore == 1) {
                        rankListHtml = rankListHtml + '<div class="checkMore"><p><a href="javascript:;" h5url="' + item.moreWebUrl.replace("/m/", "/app/") + '">查看更多</a></p></div>';
                    } else if (item.isPage == 1 && parseInt(item.pageNum) < parseInt(item.totalCount)) {
                        //创建专家排行列表请求分页时的起始页
                        var expertRankPage = 2;
                        //创建展开更多DOM
                        var unfoldMore = this.unfoldMoreHtml();
                        $('.sp_container_l div[data-id=' + dataId + ']').children('.expert_rank').append(unfoldMore).find('.unfoldMore').addClass("viRankList");
                        var unfoldMore = $('.sp_container_l div[data-id=' + dataId + ']').children('.expert_rank').append(unfoldMore).find('.unfoldMore');
                        var className = unfoldMore.attr("class");
                        unfoldMore.on("click", function () {
                            comm.loading.show();
                            t.addPaging(className, item, dataId, expertRankPage, isSocial);
                            expertRankPage++;
                        });
                    }
                }

                return rankListHtml;
            },
            //创建推荐位DOM
            posidListHtml: function (data) {
                var t = this;
                var posidListHtml = "",
                    item = data.item,
                    moduleItem = data.moduleItem,
                    dataId = data.dataId,
                    aa = item.componentType;
                if (moduleItem && moduleItem.length > 0) {
                    if (moduleItem.length > 4) {
                        moduleItem.length = 4;
                    }
                    for (var j = 0; j < moduleItem.length; j++) {
                        var listItem = moduleItem[j],
                            resouTyp = listItem.resourceType,
                            resouTypCont = "",
                            video_play_time = "", //视频播放时间
                            videoBtn_small = "", //视频播放按钮
                            videoBtn_big = "";//视频播放按钮
                        //判断资源类型
                        if (resouTyp == 1) {
                            video_play_time = '<span class="videoTime">' + listItem.playTime + '</span>';
                            videoBtn_small = '<i class="btn_small"><img src="/images/img50/column/specialTemplate/play-btn-small.png"></i>';
                            videoBtn_big = '<i class="btn_big"><img src="/images/img50/column/specialTemplate/play-btn-small.png"></i>';
                        }
                        //判断有几个资源，样式的改变
                        if (moduleItem.length == 1) {
                            posidListHtml = ""
                        } else if (moduleItem.length == 2 || moduleItem.length >= 4) {
                            if (item.recommendType == 3) {
                                posidListHtml += '<a href="javascript:;" class="recommend_intro2_content ev-appClickList appResouSans" appresouurl = "' + listItem.appUrl + '">' +
                                    '<dl>' +
                                    '<dt><img class="bg" src="' + listItem.coverPicUrl + '" alt="">' + videoBtn_big + '<i class="label"><img src="' + listItem.logoPicUrl + '"></i>' + video_play_time + '</dt>' +
                                    '<dd>' + (listItem.title ? comm.getStrLen(listItem.title, 30) : "") + '</dd>' +
                                    '</dl>' +
                                    '</a>'
                            } else {
                                posidListHtml += '<a href="javascript:;" class="recommend_intro2_content ev-appClickList appZDtitle" resourceId="' + listItem.refId + '" resourceType="' + listItem.resourceType + '" tplPath="' + listItem.tplPath + '">' +
                                    '<dl>' +
                                    '<dt><img class="bg" src="' + listItem.coverPicUrl + '" alt="">' + videoBtn_big + '<i class="label"><img src="' + listItem.logoPicUrl + '"></i>' + video_play_time + '</dt>' +
                                    '<dd>' + (listItem.title ? comm.getStrLen(listItem.title, 30) : "") + '</dd>' +
                                    '</dl>' +
                                    '</a>'
                            }
                        } else if (moduleItem.length == 3) {
                            if (item.recommendType == 3) {
                                posidListHtml += '<a href="javascript:;" class="recommend_intro3_content appResouSans" appresouurl = "' + listItem.appUrl + '">' +
                                    '<dl>' +
                                    '<dt><img class="bg" src="' + listItem.coverPicUrl + '" alt="">' + videoBtn_big + '<i class="label"><img src="' + listItem.logoPicUrl + '"></i>' + video_play_time + '</dt>' +
                                    '<dd>' + (listItem.title ? comm.getStrLen(listItem.title, 30) : "") + '</dd>' +
                                    '</dl>' +
                                    '</a>'
                            } else {
                                posidListHtml += '<a href="javascript:;" class="recommend_intro3_content ev-appClickList appZDtitle" resourceId="' + listItem.refId + '" resourceType="' + listItem.resourceType + '" tplPath="' + listItem.tplPath + '">' +
                                    '<dl>' +
                                    '<dt><img class="bg" src="' + listItem.coverPicUrl + '" alt="">' + videoBtn_big + '<i class="label"><img src="' + listItem.logoPicUrl + '"></i>' + video_play_time + '</dt>' +
                                    '<dd>' + (listItem.title ? comm.getStrLen(listItem.title, 30) : "") + '</dd>' +
                                    '</dl>' +
                                    '</a>'
                            }
                        }
                    }
                    if ($('.sp_container_l div[data-id=' + dataId + ']') && aa == 5) {
                        $('.sp_container_l div[data-id=' + dataId + ']').children('.posid_list').append(posidListHtml);
                    }
                    t.appClickEvent();//列表点击事件
                }
            },
            //创建筛选资源列表
            screeningListHtml: function (data) {
                var t = this, promoteFlag = "";
                var screeningListHtml = '',
                    item = data.item,
                    moduleItem = data.moduleItem,
                    dataId = data.dataId,
                    preferUpOrScore = "",
                    act_type_res = "";
                if (moduleItem && moduleItem.length > 0) {
                    for (var j = 0; j < moduleItem.length; j++) {
                        var listItem = moduleItem[j],
                            resouTyp = listItem.resourceType,
                            refId = listItem.refId, //关联ID
                            isPrefer = listItem.customerPreferIsValid, //是否点赞
                            resou_socialNum = "", //资源列表社交内容
                            video_play_time = "", //视频播放时间
                            videoBtn = ""; //视频播放按钮
                        //判断资源类型
                        switch (parseInt(resouTyp)) {
                            case 1:
                                video_play_time = '<span class="spTemp_list_videoTime">' + listItem.playTime + '</span>';
                                videoBtn = '<i class="btn_small"><img src="/images/img50/column/specialTemplate/play-btn-small.png" alt=""></i>';
                                act_type_res = '<span class="act_icons video_icon">视频</span>';
                                break;
                            case 2:
                                act_type_res = '<span class="act_icons doc_icon">文库</span>';
                                break;
                            case 4:
                                act_type_res = '<span class="act_icons topic_icon">话题</span>';
                                break;
                            case 7:
                                act_type_res = '<span class="act_icons case_icon">病例</span>';
                                break;
                        }
                        resou_socialNum = '<li class="resource_list_stat_liulan">' + (listItem.browseNum ? listItem.browseNum.toWK() : "0") + '</li><li class="resource_list_stat_dianzan">' + ((isPrefer==1&&listItem.preferUpNum==0)?"1":(listItem.preferUpNum ? listItem.preferUpNum.toWK() : "0")) + '</li>';
                        //判断点赞状态
                        if (listItem.scoreResult == 0) {//显示点赞
                            preferUpOrScore = '<span class="spTemp_praise ' + (isPrefer == 0 ? "spTemp_praise_no" : "spTemp_praise_yes") +
                                '" resourceId="' + refId + '" isPrefer="' + isPrefer + '" refType="'+resouTyp+'">' + (isPrefer == 0 ? "点赞" : "已赞") + '</span>';
                        } else {//显示评分
                            preferUpOrScore = (listItem.scoreResult != undefined) ? '<span class="act_scoreResult">' + listItem.scoreResult + '</span><span class="fen_font">分</span>' : '';
                        }
                        var name = listItem.author;
                        var manyAuthor = false;
                        if(resouTyp == 1){//视频
                            name = listItem.ownerNameStr;
                            if(name&&name.split(",").length&&name.split(",").length>=2){//多作者
                                manyAuthor = true;
                            }
                        }
                        //判断是否有图片
                        if ((resouTyp == 4 && listItem.coverPicUrl) || (resouTyp == 1 || resouTyp == 7)) {//文库默认无图
                            var coverPicUrl = "";
                            if (resouTyp == 1 || resouTyp == 7) {
                                coverPicUrl = listItem.coverPicUrl ? listItem.coverPicUrl.split('|')[0] : "/images/img50/225_150.jpg";
                            } else {
                                coverPicUrl = listItem.coverPicUrl.split('|')[0];
                            }
                            if (item.isShowPromoted != 0 && (item.isShowPromoted == listItem.isPromoted)) {//晋级
                                    if (listItem.promotedName && $.trim(listItem.promotedName)) {//晋级阶段名称存在
                                        if (comm.getByteLen(listItem.promotedName) > 5) {//三个字，大样式
                                            promoteFlag = '<b class="bigImg">晋级' + listItem.promotedName + '</b>';
                                        } else {
                                            promoteFlag = '<b class="smallImg">晋级' + listItem.promotedName + '</b>';
                                        }
                                    } else {
                                        promoteFlag = '<b></b>';
                                    }
                                } else {//未晋级
                                    promoteFlag = "";
                                }
                            screeningListHtml += '<section class="spTemp_list_resource ev-appClickList case_content scr_list_border">' +
                                '<section class="spTemp_list_resource_left ' + ($("div[data-id=" + dataId + "] .resource_list").hasClass("resource_list_leftImg_rightArt") ? "spTemp_right" : "spTemp_left") + '">' +
                                '<section class="al-actListTitleBox"><h3 class="spTemp_list_resource_title"><a href="javascript:;" resourceId="' + refId + '" resourceType="' + listItem.resourceType + '" tplPath="' + listItem.tplPath + '" class="appZDtitle">' + ((item.isShowArea == 1 && listItem.resourceForArea) ? '<span class="al-actAreaColor">【' + listItem.resourceForArea + '】</span>' + comm.getStrLen(listItem.title, 28) : comm.getStrLen(listItem.title, 40)) + '</a></h3>' +
                                '<p class="act_list_type">' + act_type_res +
                                '<span>' + (name?comm.getStrLen(name, manyAuthor?24:8):"") + '</span>' +
                                '<span '+(manyAuthor?'style="display:none"':'')+'>' + (listItem.hospitalName ? comm.getStrLen(listItem.hospitalName, 14) : "") + '</span>' +
                                '</p></section>' + ($("div[data-id=" + dataId + "] .resource_list").hasClass("resource_list_leftImg_rightArt") ? '<section class="activityPraise">' +
                                '<ul>' + resou_socialNum + '</ul><div class="praiseCont">' + preferUpOrScore + '</div>' + '</section>' : '<ul>' + resou_socialNum + '</ul>') +
                                '</section>' +
                                '<section class="spTemp_list_resource_right ' + ($("div[data-id=" + dataId + "] .resource_list").hasClass("resource_list_leftImg_rightArt") ? "spTemp_left" : "spTemp_right") + '">' +
                                '<div class="spTemp_list_resource_imgBox">' +
                                '<a href="javascript:;"><img src="' + coverPicUrl + '">' + videoBtn + promoteFlag +'</a>' +
                                video_play_time +
                                ($("div[data-id=" + dataId + "] .resource_list").hasClass("resource_list_leftImg_rightArt") ? '' : '<div class="praiseCont">' + preferUpOrScore + '</div>') +
                                '</div>' +
                                '</section>' +
                                '<section class="zhezhao_dianzanSuc">点赞成功</section>' +
                                '<section class="zhezhao_dianzanDef">取消点赞成功</section>' +
                                '</section>';
                        } else {//文库默认无图，话题有图显示无图不显示
                            if (item.isShowPromoted != 0 && (item.isShowPromoted == listItem.isPromoted)) {//晋级
                                if (listItem.promotedName && $.trim(listItem.promotedName)) {//晋级阶段名称存在
                                    if (comm.getByteLen(listItem.promotedName) > 5) {//三个字，大样式
                                        promoteFlag = '<i class="promotion bigImg">晋级' + listItem.promotedName + '</i>';
                                    } else {
                                        promoteFlag = '<i class="promotion smallImg">晋级' + listItem.promotedName + '</i>';
                                    }
                                } else {
                                    promoteFlag = '<i class="promotion"></i>';
                                }
                            } else {//未晋级
                                promoteFlag = "";
                            }
                            screeningListHtml += '<section class="spTemp_list_resource ev-appClickList case_content scr_list_border">' +
                                promoteFlag +
                                '<h3 class="spTemp_list_resource_title"><a href="javascript:;" resourceId="' + refId + '" resourceType="' + listItem.resourceType + '" tplPath="' + listItem.tplPath + '" class="appZDtitle">' + ((item.isShowArea == 1 && listItem.resourceForArea) ? '<span class="al-actAreaColor">【' + listItem.resourceForArea + '】</span>' + comm.getStrLen(listItem.title, 40) : comm.getStrLen(listItem.title, 50)) + '</a></h3>' +
                                '<p class="act_list_type">' +
                                act_type_res +
                                '<span>' + (name?comm.getStrLen(name, manyAuthor?24:8):"") + '</span>' +
                                '<span '+(manyAuthor?'style="display:none"':'')+'>' + (listItem.hospitalName ? comm.getStrLen(listItem.hospitalName, 14) : "") + '</span></p>' +
                                (listItem.h5Url?'<section class="activityPraise">' +
                                '<ul>' +
                                resou_socialNum +
                                '</ul>' +
                                '<div class="praiseCont">' +
                                preferUpOrScore +
                                '</div>' +
                                '</section>' +
                                '<section class="zhezhao_dianzanSuc">点赞成功</section>' +
                                '<section class="zhezhao_dianzanDef">取消点赞成功</section>':'') +
                                '</section>';
                        }
                    }
                    //添加点赞事件
                    var _kv = $('.sp_container_l div[data-id=' + dataId + ']').children('.ev-resource_list');
                    if (data.dataScroll) {//来自瀑布流
                        _kv.append(screeningListHtml);
                    } else {//来自正常铺设
                        _kv.html(screeningListHtml);
                        //分页判断
                        if (item.totalCount && parseInt(item.totalCount) > 20) {
                            _kv.attr("scrollPagination", "enabled");
                            //区分筛选和正常铺设
                            if (!data.dataScreening) {//正常加载铺设
                                var isNormal = true;
                                t.scrollPage(data);
                            } else {//筛选的瀑布流
                                t.scrollPage(data, data.dataScreening);
                            }
                        } else {
                            _kv.attr("scrollPagination", "disabled");
                        }
                    }
                    t.clickPraise('.spTemp_list_resource', '.resource_list_stat_dianzan');
                    t.appClickEvent();//列表点击事件
                    if (!data.isScrFlag) {
                        t.chReListMapHtml(item);
                    }
                    t.scrBtnClick(item, dataId);//筛选项的点击事件
                    t.screeningEveClick(item, dataId);
                    ev.fn && ev.fn();
                }
            },
            //添加各个列表
            addList: function (ev) {
                var t = this;
                var _kv = "";
                var isSocial = "";
                if (ev.resTemplate && ev.resTemplate.bo.responseData) {
                    var dataItem = ev.resTemplate.bo.responseData.data_list;
                    if (dataItem && dataItem.length > 0) {
                        for (var i = 0; i < dataItem.length; i++) {
                            var item = dataItem[i],
                                dataId = item.colMenuLayoutModuleId,
                                aa = item.componentType,
                                moduleTitle = item.title,//组件标题
                                moduleItem = item.recommendResourceListMap,
                                resourceSource = item.resourceSource,
                                resourcePageNum = item.pageNum,
                                recommendType = item.recommendType,
                                isRanking = item.isRanking,
                                interactiveOperation = item.interactiveOperation,
                                resourceNum = item.resourceNum,
                                resourceTagId = item.resourceTagId,
                                resourceType = item.resourceType,
                                resourceEndTime = item.resourceEndTime,
                                resourceOwnType = item.resourceOwnType,
                                resourceSortType = item.resourceSortType,
                                resourceStartTime = item.resourceStartTime;
                            if (item.settingElement) {
                                isSocial = item.settingElement.split(','); //社交选项
                            } else {
                                isSocial = "";
                            }
                            //资源列表
                            if (item.componentType == 1) {
                                //创建资源列表DOM
                                var resourceListHtml = t.resourceListHtml({
                                    item: item,
                                    moduleItem: moduleItem,
                                    isSocial: isSocial,
                                    dataId: dataId
                                });
                                //组件名称
                                $('div[data-id=' + dataId + '] .total_title').children('span').text(moduleTitle);
                                //添加资源列表DOM
                                _kv = $('.sp_container_l div[data-id=' + dataId + ']').children('.resource_list');
                                if (_kv.find('.checkMore').length) {
                                    _kv.find('.checkMore').before(resourceListHtml);
                                } else if (_kv.find('.unfoldMore').length) {
                                    _kv.find('.unfoldMore').before(resourceListHtml);
                                } else {
                                    _kv.append(resourceListHtml);
                                }
                                //添加点赞事件
                                t.clickPraise('.spTemp_list_resource', '.resource_list_stat_dianzan');
                                t.appClickEvent();//列表点击事件
                            }
                            //会员列表
                            if (item.componentType == 2) {
                                //创建会员列表DOM
                                var vipListHtml = t.vipListHtml({
                                    item: item,
                                    moduleItem: moduleItem,
                                    isSocial: isSocial,
                                    dataId: dataId
                                });
                                //组件名称
                                $('div[data-id=' + dataId + '] .total_title').children('span').text(moduleTitle);
                                //添加会员列表DOM
                                _kv = $('.sp_container_l div[data-id=' + dataId + ']').children('.vip_list');
                                if (_kv.find('.checkMore').length) {
                                    _kv.find('.checkMore').before(vipListHtml);
                                } else if (_kv.find('.unfoldMore').length) {
                                    _kv.find('.unfoldMore').before(vipListHtml);
                                } else {
                                    _kv.append(vipListHtml);
                                }
                                //添加点赞事件
                                t.clickPraise(".spTemp_list_member", ".vip_list_dianzan");
                                t.appClickEvent();//列表点击事件
                            }
                            //排行榜列表
                            if (item.componentType == 3) {
                                //创建排行榜DOM
                                var rankListHtml = t.rankListHtml({
                                    item: item,
                                    moduleItem: moduleItem,
                                    isSocial: isSocial,
                                    dataId: dataId
                                });
                                //组件名称
                                $('div[data-id=' + dataId + '] .total_title').children('span').text(moduleTitle);
                                //资源排行榜
                                if (recommendType == 1) {
                                    _kv = $('.sp_container_l div[data-id=' + dataId + ']').children('.resource_rank');
                                    if (_kv.find('.checkMore').length) {
                                        _kv.find('.checkMore').before(rankListHtml);
                                    } else if (_kv.find('.unfoldMore').length) {
                                        _kv.find('.unfoldMore').before(rankListHtml);
                                    } else {
                                        _kv.append(rankListHtml);
                                    }
                                } else if (recommendType == 2) {	//会员排行榜
                                    _kv = $('.sp_container_l div[data-id=' + dataId + ']').children('.expert_rank');
                                    if (_kv.find('.checkMore').length) {
                                        _kv.find('.checkMore').before(rankListHtml);
                                    } else if (_kv.find('.unfoldMore').length) {
                                        _kv.find('.unfoldMore').before(rankListHtml);
                                    } else {
                                        _kv.append(rankListHtml);
                                    }
                                }
                                t.appClickEvent();//列表点击事件
                            }
                            //新闻列表
                            if (item.componentType == 4) {
                                t.themeNewsHtml({
                                    item: item,
                                    moduleItem: moduleItem,
                                    dataId: dataId
                                });
                                //组件名称
                                $('div[data-id=' + dataId + '] .total_title').children('span').text(moduleTitle);
                                t.newsSwiper();
                            }
                            //推荐位列表
                            if (item.componentType == 5) {
                                t.posidListHtml({
                                    item: item,
                                    moduleItem: moduleItem,
                                    dataId: dataId
                                });
                                //组件名称
                                $('div[data-id=' + dataId + '] .total_title').children('span').text(moduleTitle);
                            }
                            //筛选列表
                            if (item.componentType == 10) {
                                if (item.recommendResourceListMap && item.recommendResourceListMap.length > 0) {//有筛选列表的时候
                                    t.screeningListHtml({
                                        item: item,
                                        moduleItem: moduleItem,
                                        dataId: dataId
                                    });
                                    //组件名称
                                    $('div[data-id=' + dataId + '] .ev-totalTitle').text(moduleTitle);
                                    $('div[data-id=' + dataId + '] .ev-scrListNum').text("(" + item.chooseRecommendListMap[0].resourceCount + ")");
                                    ev.fn && ev.fn();
                                } else {//无筛选列表的时候
                                    //显示默认图
                                    $(".screeningList,.ev-resource_list").hide();
                                    $(".ev-noResponse").show();//无列表
                                }
                            }
                        }
                    }
                }
            },
            //添加分页功能,展开更多点击事件
            addPaging: function (className, item, dataId, paging, isSocial) {
                var className = className,
                    paging = paging;
                var t = this;
                this.ajaxFn({
                    url: this.config.url,
                    param: {
                        paramJson: $.toJSON({
                            pageIndex: paging,
                            customerId: item.customerId ? item.customerId : '',
                            visitSiteId: 2,
                            pageSize: item.pageNum,
                            columnId: item.columnId,
                            isRanking: item.isRanking,
                            recommendType: item.recommendType,
                            interactiveOperation: item.interactiveOperation,
                            resourceSource: item.resourceSource,
                            resourceNum: item.resourceNum,
                            resourceTagId: item.resourceTagId,
                            resourceType: item.resourceType,
                            resourceEndTime: item.resourceEndTime,
                            resourceOwnType: item.resourceOwnType,
                            resourceSortType: item.resourceSortType,
                            resourceStartTime: item.resourceStartTime,
                            rankingResourceType: item.rankingResourceType,
                            searchParam: item.resourceTagName,
                            isShowSort: item.isShowSort,
                            isShowArea: item.isShowArea,
                            isShowPromoted: item.isShowPromoted?item.isShowPromoted:0
                        })
                    },
                    fn: function (data) {
                        comm.loading.hide();
                        var item = data.bo.responseData.data_list[0],
                            moduleItem = item.recommendResourceListMap;
                        switch (className) {
                            //资源列表的回调函数
                            case 'unfoldMore reList':
                                var resourceListHtml = t.resourceListHtml({
                                    item: item,
                                    moduleItem: moduleItem,
                                    isSocial: isSocial,
                                    dataId: dataId
                                });
                                $('.sp_container_l div[data-id=' + dataId + ']').children('.resource_list').find('.unfoldMore').before(resourceListHtml);
                                //添加点赞事件
                                t.clickPraise('.spTemp_list_resource', '.resource_list_stat_dianzan');
                                break;
                            //会员列表的回调函数
                            case 'unfoldMore viList':
                                var vipListHtml = t.vipListHtml({
                                    item: item,
                                    moduleItem: moduleItem,
                                    isSocial: isSocial,
                                    dataId: dataId
                                });
                                $('.sp_container_l div[data-id=' + dataId + ']').children('.vip_list').find('.unfoldMore').before(vipListHtml);
                                //添加点赞事件
                                t.clickPraise(".spTemp_list_member", ".vip_list_dianzan");
                                break;
                            //资源排行榜的回调函数
                            case 'unfoldMore reRankList':
                                var rankListHtml = t.rankListHtml({
                                    item: item,
                                    moduleItem: moduleItem,
                                    isSocial: isSocial,
                                    dataId: dataId
                                });
                                $('.sp_container_l div[data-id=' + dataId + ']').children('.resource_rank').find('.unfoldMore').before(rankListHtml);
                                break;
                            //会员排行榜的回调函数
                            case 'unfoldMore viRankList':
                                var rankListHtml = t.rankListHtml({
                                    item: item,
                                    moduleItem: moduleItem,
                                    isSocial: isSocial,
                                    dataId: dataId
                                });
                                $('.sp_container_l div[data-id=' + dataId + ']').children('.expert_rank').find('.unfoldMore').before(rankListHtml);
                                break;
                            default:
                                break;
                        }
                        t.appClickEvent();
                    }
                });
                //再请求下一页数据,判断是否显示展开更多DOM
                this.ajaxFn({
                    url: this.config.url,
                    param: {
                        paramJson: $.toJSON({
                            pageIndex: paging + 1,
                            customerId: item.customerId ? item.customerId : '',
                            visitSiteId: 2,
                            pageSize: item.pageNum,
                            columnId: item.columnId,
                            isRanking: item.isRanking,
                            recommendType: item.recommendType,
                            interactiveOperation: item.interactiveOperation,
                            resourceSource: item.resourceSource,
                            resourceNum: item.resourceNum,
                            resourceTagId: item.resourceTagId,
                            resourceType: item.resourceType,
                            resourceEndTime: item.resourceEndTime,
                            resourceOwnType: item.resourceOwnType,
                            resourceSortType: item.resourceSortType,
                            resourceStartTime: item.resourceStartTime,
                            rankingResourceType: item.rankingResourceType,
                            searchParam: item.resourceTagName,
                            isShowSort: item.isShowSort,
                            isShowArea: item.isShowArea,
                            isShowPromoted: item.isShowPromoted?item.isShowPromoted:0
                        })
                    },
                    fn: function (data) {
                        comm.loading.hide();
                        var item = data.bo.responseData.data_list[0],
                            moduleItem = item.recommendResourceListMap;
                        switch (className) {
                            //资源列表的回调函数
                            case 'unfoldMore reList':
                                if (item.recommendResourceListMap.length == 0) {
                                    $('.sp_container_l div[data-id=' + dataId + ']').children('.resource_list').find('.unfoldMore').hide();
                                }
                                break;
                            //会员列表的回调函数
                            case 'unfoldMore viList':
                                if (item.recommendResourceListMap.length == 0) {
                                    $('.sp_container_l div[data-id=' + dataId + ']').children('.vip_list').find('.unfoldMore').hide();
                                }
                                break;
                            //资源排行榜的回调函数
                            case 'unfoldMore reRankList':
                                if (item.recommendResourceListMap.length == 0) {
                                    $('.sp_container_l div[data-id=' + dataId + ']').children('.resource_rank').find('.unfoldMore').hide();
                                }
                                break;
                            //会员排行榜的回调函数
                            case 'unfoldMore viRankList':
                                if (item.recommendResourceListMap.length == 0) {
                                    $('.sp_container_l div[data-id=' + dataId + ']').children('.expert_rank').find('.unfoldMore').hide();
                                }
                                break;
                            default:
                                break;
                        }
                    }
                });
            },
            //筛选项的点击事件
            scrBtnClick: function (item, dataId) {
                var t = this;
                $(".ev-screeningBtn").off("click").on("click", function () {
                    if (!$(".ev-activityScreen").length) {
                        if ($(this).attr("data-flag") == 1) {
                            $(this).attr("data-flag", "0");
                            t.chReListMapHtml(item);
                            t.screeningEveClick(item, dataId);
                        }
                    }
                    $("body,html").css({
                        overflow:"hidden",
                        height:"100%"
                    });
                    $(".ev-activityScreen").show().on("touchmove",function(e){
                        e.stopPropagation();
                    });//筛选弹层显示
                    if(appjs.appHiddenNavView){//app端顶部隐藏
                        appjs.appHiddenNavView(true);
                    }
                    if (!t.noAllChoose) {
                        $(".ev-firstTab[data-all=1]").addClass("active");
                    }
                    $(".ev-sureBtn").addClass("hover");
                });
            },
            //循环筛选结构
            chReListMapHtml: function (item) {
                var t = this;
                var htmls, html = "", html2 = "", html3 = "";
                html = "";
                $.each(item.chooseRecommendListMap, function (i, e) {
                    if (e.property_2 && e.property_2.length) {//存在二级菜单的时候
                        html2 = "";
                        $.each(e.property_2, function (k, v) {
                            if (v.property_3 && v.property_3.length) {//存在第三级菜单
                                html3 = "";
                                $.each(v.property_3, function (j, s) {
                                    html3 += '<p class="ev-thirdTab ' + (j != 0 ? ' ev-thirdSiblingsLi' : '') + '"'
                                        + (j == 0 ? ' data-all="1"' : '') + ' data-prFPath="' + s.propertyFullPath + '" data-proId="'
                                        + s.propertyId + '"><b></b><span>' + s.propertyName + '</span></p>';
                                });
                                html2 += '<div class="ev-secondTab"' + (k == 0 ? ' data-all="1"' : '') + ' data-prFPath="' + v.propertyFullPath
                                    + '" data-proId="' + v.propertyId + '"><span>' + v.propertyName + '</span><i></i>' +
                                    '<div class="menuThird">' +
                                    html3 +
                                    '</div>' +
                                    '</div>'
                            } else {//不存在三级菜单
                                html2 += '<div class="ev-secondTab"' + (k == 0 ? ' data-all="1"' : '') + ' data-prFPath="' + v.propertyFullPath
                                    + '" data-proId="' + v.propertyId + '"><span style="padding-bottom: 0;">' + v.propertyName + '</span></div>'
                            }
                        });
                        html += '<li class="ev-firstTab"' + (i == 0 ? ' data-all="1"' : '') + ' data-prFPath="' + e.propertyFullPath + '" data-proId="' + e.propertyId
                            + '"><span>' + e.propertyName + '</span><i></i><div class="menuSecond">' + html2 + '</div></li>';
                    } else {//不存在二级菜单
                        html += '<li class="ev-firstTab"' + (i == 0 ? ' data-all="1"' : '') + ' data-prFPath="' + e.propertyFullPath + '" data-proId="' + e.propertyId
                            + '"><span>' + e.propertyName + '</span></li>';
                    }
                });
                htmls = '<section class="activityScreen ev-activityScreen" style="display: none;">' +
                    '<section class="activityScreenCont">' +
                    '<ul class="screenList">' +
                    '<aside class="screenTitle">筛选</aside>' +
                    html +
                    '</ul>' +
                    '</section>' +
                    '<section class="bottomFixed">' +
                    '<button class="ev-resetBtn">重置</button>' +
                    '<button class="ev-sureBtn hover" data-flag="1">确定</button>' +
                    '</section>' +
                    '</section>';
                $("body").append(htmls);
            },
            //筛选列表中的各事件点击事件
            screeningEveClick: function (item, dataId) {
                var t = this;
                //第一层菜单点击
                $(".ev-firstTab").off("click").on("click", function (e) {
                    if (!$(e.target).is(".menuSecond") && !$(e.target).parents().is(".menuSecond")) {
                        if (!$(this).hasClass("active") || !$(this).hasClass("activeUp")) {//展开操作步骤
                            $(this).addClass("activeUp active").siblings().removeClass("active");
                            //点击一级菜单的时候去掉其他二三级的选择
                            $(this).siblings().removeClass("active").find(".ev-secondTab").removeClass("active")
                                .find(".ev-thirdTab").removeClass("active").find("b").removeClass("onclick");
                            //判断点击张开二级菜单的时候有没有选中，有选中项不选中全部按钮项
                            var _aBtnFlag = true;
                            $.each($(this).find(".ev-secondTab"), function (i, e) {
                                if ($(e).hasClass("active")) {
                                    _aBtnFlag = false;
                                    return false;
                                } else {
                                    _aBtnFlag = true;
                                }
                            });
                            if ($(this).find(".menuSecond").length) {//存在二级菜单
                                $(this).find(".menuSecond").show();
                                if (_aBtnFlag) {
                                    $(this).find(".ev-secondTab[data-all=1]").addClass("active");//默认选中全部
                                }
                            }
                        } else {//收起操作步骤
                            $(this).removeClass("activeUp");
                            if ($(this).find(".menuSecond").length) {//存在二级菜单
                                $(this).find(".menuSecond,.menuThird").hide();
                                $(this).find(".ev-secondTab").removeClass("activeUp");//选中状态展开按钮取消或者收起
                            }
                        }
                        //判断点击一级菜单项，下属二三级菜单项有没有选中，从而判定确定按钮是否可以点击
                        var _hoverFlag = true;//默认只有一级菜单项的时候
                        if ($(this).find(".ev-secondTab").length) {
                            $.each($(this).find(".ev-secondTab"), function (k, v) {
                                if ($(v).hasClass("active")) {
                                    if ($(v).find(".ev-thirdTab").length) {//有第三级菜单选项
                                        $.each($(v).find(".ev-thirdTab"), function (j, s) {
                                            if ($(s).hasClass("active")) {
                                                _hoverFlag = true;
                                            } else {
                                                _hoverFlag = false;
                                                return false;
                                            }
                                        });
                                    } else {//只有二级菜单想的时候
                                        _hoverFlag = true;
                                    }
                                }
                            });
                        }
                        if (_hoverFlag) {
                            $(".ev-sureBtn").addClass("hover");
                        } else {
                            $(".ev-sureBtn").removeClass("hover");
                        }
                    }
                });
                //第二层菜单点击
                $(".ev-secondTab").off("click").on("click", function (e) {
                    if (!$(e.target).is(".menuThird") && !$(e.target).parents().is(".menuThird")) {
                        if (!$(this).hasClass("active") || !$(this).hasClass("activeUp")) {//展开操作步骤
                            $(this).addClass("activeUp active").siblings().removeClass("active").
                                find(".ev-thirdTab").removeClass("active").find("b").removeClass("onclick");
                            //去掉第一级别的菜单选择
                            $(this).parents(".ev-firstTab").addClass("active").siblings().removeClass("active");
                            if ($(this).find(".menuThird").length) {//存在三级菜单
                                $(this).find(".menuThird").show().find(".ev-thirdTab").addClass("active").find("b").addClass("onclick");
                            }
                        } else {//收起操作步骤
                            $(this).removeClass("activeUp");
                            if ($(this).find(".menuThird").length) {//存在三级菜单
                                $(this).find(".menuThird").hide();
                            }
                        }
                        //判断点击二级菜单项，下属三级菜单项有没有选中，从而判定确定按钮是否可以点击
                        var _hoverFlag = true;//默认只有一级菜单项的时候
                        if ($(this).find(".ev-thirdTab").length) {
                            $.each($(this).find(".ev-thirdTab"), function (k, v) {
                                if ($(v).hasClass("active")) {
                                    _hoverFlag = true;
                                } else {
                                    _hoverFlag = false;
                                    return false;
                                }
                            });
                        }
                        if (_hoverFlag) {
                            $(".ev-sureBtn").addClass("hover");
                        } else {
                            $(".ev-sureBtn").removeClass("hover");
                        }
                    }
                });
                //第三层菜单点击
                $(".ev-thirdTab").off("click").on("click", function () {
                    if ($(this).attr("data-all") == 1) {//点击的是第三季菜单的第一项，全部按钮
                        if (!$(this).hasClass("active")) {//全选按钮选中
                            $(this).parents(".ev-secondTab").find(".ev-thirdTab").addClass("active").find("b").addClass("onclick");//当前点击全部增加高亮
                            //给其他选项的三级菜单二级菜单一级菜单进行取消高亮选中
                            $(this).parents(".ev-firstTab").siblings().removeClass("active").find(".ev-secondTab").removeClass("active")
                                .find(".ev-thirdTab").removeClass("active").find("b").removeClass("onclick");
                            $(this).parents(".ev-secondTab").siblings().removeClass("active").find(".ev-thirdTab")
                                .removeClass("active").find("b").removeClass("onclick");
                            //点击第三层菜单的时候点亮第一，二层菜单
                            $(this).parents(".ev-firstTab,.ev-secondTab").addClass("activeUp active").siblings().removeClass("active");
                        } else {//全选按钮取消
                            $(this).parents(".ev-secondTab").find(".ev-thirdTab").removeClass("active").find("b").removeClass("onclick");
                        }
                    } else {
                        var flag = false;
                        if (!$(this).hasClass("active")) {//第三级菜单点击选中
                            $(this).addClass("active").find("b").addClass("onclick");//给当前点击项加高亮显示
                            //给其他选项的三级菜单二级菜单一级菜单进行取消高亮选中
                            $(this).parents(".ev-firstTab").siblings().removeClass("active").find(".ev-secondTab").removeClass("active")
                                .find(".ev-thirdTab").removeClass("active").find("b").removeClass("onclick");
                            $(this).parents(".ev-secondTab").siblings().removeClass("active").find(".ev-thirdTab")
                                .removeClass("active").find("b").removeClass("onclick");
                            //点击第三层菜单的时候点亮第一，二层菜单
                            $(this).parents(".ev-firstTab,.ev-secondTab").addClass("activeUp active").siblings().removeClass("active");
                        } else {//第三级菜单点击取消
                            $(this).removeClass("active").find("b").removeClass("onclick");
                        }
                        //验证全选按钮开始
                        var liItems = $(this).parents(".ev-secondTab").find(".ev-thirdSiblingsLi");
                        $.each(liItems, function (i, e) {
                            if ($(e).hasClass("active")) {
                                flag = true;
                            } else {
                                flag = false;
                                return false;
                            }
                        });
                        if (flag) {//全选按钮选中
                            $(this).parents(".ev-secondTab").find(".ev-thirdTab[data-all=1]").addClass("active").find("b").addClass("onclick");
                        } else {//全选按钮并未选中
                            $(this).parents(".ev-secondTab").find(".ev-thirdTab[data-all=1]").removeClass("active").find("b").removeClass("onclick");
                        }
                        //验证全选按钮结束
                    }
                    var sureFlag = false;
                    //验证第三季有没有勾选，控制确认按钮
                    $.each($(this).parents(".ev-secondTab").find(".ev-thirdTab"), function (i, e) {
                        if ($(e).hasClass("active")) {
                            sureFlag = true;
                            return false;
                        } else {
                            sureFlag = false;
                        }
                    });
                    if (sureFlag) {//有选中的才进行按钮可点击
                        $(".ev-sureBtn").addClass("hover");
                    } else {
                        $(".ev-sureBtn").removeClass("hover");
                    }
                });
                //点击空白处弹层关闭
                $(".ev-activityScreen").off("click").on("click", function (e) {
                    if (!$(e.target).is(".activityScreenCont") && !$(e.target).is(".bottomFixed")
                        && !$(e.target).parents().is(".activityScreenCont") && !$(e.target).parents().is(".bottomFixed")) {//判断点击空白处关闭弹层
                        t.popCloseFun();
                    }
                });
                //重置按钮点击
                $(".ev-resetBtn").off("click").on("click", function () {
                    $(".ev-firstTab,.ev-secondTab,.ev-thirdTab").removeClass("active activeUp");//选中状态展开按钮取消或者收起
                    $(".menuSecond,.menuThird").hide();//展开的二级三级菜单收起
                    $(".ev-thirdTab>b").removeClass("onclick");//三级多选选中取消
                    $(".ev-firstTab[data-all=1]").addClass("active");//全部默认选中
                });
                //确定按钮点击事件(第一级第二级菜单点击的时候都为单选，第三级菜单点击的时候可以是多选/单选)
                $(".ev-sureBtn").off("click").on("click", function () {
                    if ($(this).hasClass("hover")) {//确认按钮可点击状态
                        if ($(this).attr("data-flag") == 1) {
                            $(this).attr("data-flag", "0");
                            var propertyFullPath = "", isSelect = "", proIdList = [], proFuPath = [], propertyIdList = "";
                            $.each($(".ev-firstTab"), function (i, e) {//第一层可点击菜单遍历0
                                if ($(e).hasClass("active")) {
                                    if ($(e).find(".ev-secondTab").length) {//有第二级菜单的情况
                                        $.each($(e).find(".ev-secondTab"), function (k, v) {// 第二层可点击菜单的遍历
                                            if ($(v).hasClass("active")) {
                                                if ($(v).find(".ev-thirdTab").length) {//有第三级菜单的情况
                                                    if ($(v).find(".ev-thirdTab[data-all=1]").hasClass("active")) {//第三级菜单的全选按钮选中
                                                        propertyFullPath = $(v).attr("data-prFPath");
                                                        isSelect = 0;
                                                    } else {
                                                        proIdList = [];
                                                        proFuPath = [];
                                                        $.each($(v).find(".ev-thirdTab"), function (j, s) {//第三层可点击菜单的遍历
                                                            if (j != 0) {//出去第一个选项（全部）
                                                                if ($(s).hasClass("active")) {
                                                                    proIdList.push($(s).attr("data-proId"));
                                                                    proFuPath.push($(s).attr("data-prFPath"));
                                                                }
                                                            }
                                                        });
                                                    }
                                                } else {//只有二级菜单的情况
                                                    isSelect = 0;
                                                    if ($(e).find(".ev-secondTab[data-all=1]").hasClass("active")) {//第三级菜单的全选按钮选中
                                                        propertyFullPath = $(e).attr("data-prFPath");
                                                    } else {
                                                        propertyFullPath = $(v).attr("data-prFPath");
                                                    }
                                                }
                                            }
                                        });
                                    } else {//只有第一级菜单的时候
                                        if ($(e).attr("data-all") == 1) {//第一级菜单全部按钮
                                            isSelect = "";
                                            propertyFullPath = "";
                                        } else {//第一级菜单非全部按钮
                                            isSelect = 0;
                                            propertyFullPath = $(e).attr("data-prFPath");
                                        }
                                    }
                                }
                            });
                            if (proFuPath.length && proIdList.length) {//单选
                                if (proFuPath.length == 1 && proIdList.length == 1) {
                                    propertyFullPath = proFuPath[0];
                                    isSelect = 0;
                                } else {//多选
                                    isSelect = 1;
                                    propertyIdList = proFuPath.join(",");
                                }
                            }
                            var param = {
                                paramJson: $.toJSON({
                                    columnId: item.columnId,
                                    visitSiteId: 2,
                                    pageIndex: 1,
                                    pageSize: 20,
                                    propertyFullPath: propertyFullPath,//单选时传的参数
                                    propertyIdList: propertyIdList,//多选的时候传的参数
                                    isSelect: isSelect,//是否是多选0单选，1多选
                                    customerId: appjs.getAuthorCustomerId() ? appjs.getAuthorCustomerId() : ''
                                })
                            };
                            var callback = function (rep) {
                                if (rep && rep.bo && rep.bo.responseData && !$.isEmptyObject(rep.bo.responseData) &&
                                    rep.bo.responseData.data_list && rep.bo.responseData.data_list.length) {
                                    if (rep.bo.responseData.data_list[0].recommendResourceListMap && rep.bo.responseData.data_list[0].recommendResourceListMap.length) {//筛选列表有结果
                                        $.each(rep.bo.responseData.data_list, function (i, e) {
                                            var moduleItem = e.recommendResourceListMap;
                                            t.screeningListHtml({
                                                item: e,
                                                moduleItem: moduleItem,
                                                dataId: dataId,
                                                dataScreening: 1,
                                                propertyFullPath: propertyFullPath,//单选时传的参数
                                                propertyIdList: propertyIdList,//多选的时候传的参数
                                                isSelect: isSelect,//是否是多选0单选，1多选
                                                isScrFlag:1
                                            });
                                            $(".ev-scrListNum").text("（" + e.totalCount + "）");
                                        });
                                    } else {//筛选列表无结果情况
                                        $(".ev-scrListNum").text("（0）");
                                        $('.sp_container_l div[data-id=' + dataId + ']').children('.resource_list').attr("scrollPagination", "disabled").html('<figure class="noScreeningList"><img src="/images/img50/column/activityTemplate/noneResponse.png"/></figure>');
                                    }
                                    t.popCloseFun();
                                    $(".ev-sureBtn").attr("data-flag", "1");
                                }
                            };
                            comm.ajax.async(t.config.screeningUrl, param, callback);
                        }
                    }
                });
            },
            //弹层关闭的一些相关操作
            popCloseFun: function () {
                $(".ev-activityScreen").hide();//筛选弹层关闭
                if(appjs.appHiddenNavView){//app端顶部显示
                    appjs.appHiddenNavView(false);
                }
                $(".ev-screeningBtn").attr("data-flag", "1");//筛选按钮可点击
                $("body,html").css({overflow:"",height:"auto"}).unbind("touchmove");
                this.noAllChoose = 1;
            },
            //筛选组件的瀑布流
            scrollPage: function (data, flag) {
                var t = this,
                    item = data.item,
                    dataId = data.dataId,
                    _ev = $('.sp_container_l div[data-id=' + dataId + ']').children('.ev-resource_list');
                var pageIndex = 2;
                var param = {
                    columnId: item.columnId,
                    visitSiteId: 2,
                    pageIndex: pageIndex,
                    pageSize: 20,
                    propertyFullPath: data.propertyFullPath ? data.propertyFullPath : "",//单选时传的参数
                    propertyIdList: data.propertyIdList ? data.propertyIdList : "",//多选的时候传的参数
                    isSelect: data.isSelect ? data.isSelect : "0",//是否是多选0单选，1多选
                    customerId: appjs.getAuthorCustomerId() ? appjs.getAuthorCustomerId() : ''
                };
                _ev.off("scroll").scrollPagination({
                    'contentPage': t.config.screeningUrl,
                    'contentData': $.extend(param, {
                        pageIndex: function () {
                            return pageIndex++;
                        }
                    }),
                    'scrollTarget': $(window),
                    'heightOffset': 0,
                    'delaytime': 0,
                    'type': "post",
                    'beforeLoad': function () {
                        comm.loading.show();
                    },
                    'afterLoad': function (elementsLoaded) {
                        comm.loading.hide();
                    },
                    'loader': function (rep) {
                        if ($.isEmptyObject(rep)) {
                            _ev.attr("scrollPagination", "disabled");
                            return false;
                        } else {
                            if (rep && rep.bo && rep.bo.responseData && !$.isEmptyObject(rep.bo.responseData) &&
                                rep.bo.responseData.data_list && rep.bo.responseData.data_list.length) {
                                if (rep.bo.responseData.data_list[0].recommendResourceListMap && rep.bo.responseData.data_list[0].recommendResourceListMap.length) {//筛选列表有结果
                                    $.each(rep.bo.responseData.data_list, function (i, e) {
                                        var moduleItem = e.recommendResourceListMap;
                                        if (flag) {//筛选的瀑布流
                                            t.screeningListHtml({
                                                item: e,
                                                moduleItem: moduleItem,
                                                dataId: dataId,
                                                dataScreening: 1,
                                                propertyFullPath: data.propertyFullPath,//单选时传的参数
                                                propertyIdList: data.propertyIdList,//多选的时候传的参数
                                                isSelect: data.isSelect,//是否是多选0单选，1多选
                                                dataScroll: 1,
                                                isScrFlag:1
                                            });
                                        } else {//正常的瀑布流
                                            t.screeningListHtml({
                                                item: e,
                                                moduleItem: moduleItem,
                                                dataId: dataId,
                                                dataScroll: 1,
                                                isScrFlag:1
                                            });
                                        }
                                    });
                                } else {
                                    _ev.attr("scrollPagination", "disabled");
                                    return false;
                                }
                            } else {
                                _ev.attr("scrollPagination", "disabled");
                                return false;
                            }
                        }
                    }
                });
            }
        };
        myList.init();
    }
};