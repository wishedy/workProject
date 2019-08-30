/**
 * 功能描述：  发现——首页
 * 使用方法:
 * 注意事件：
 * 引入来源：  作用：发现页改版
 *
 * Created by dinglindong on 2016/08/18.
 */

$(function() {
    var discoverIndex = {
        opt: {
            tagNum: 0,
            tagRecScore:0,   //标签score
            count:0
        },
        params: {
            "score":0,
            "flag":1,
            "visitSiteId":2,
            "platformId":TempCache.getItem('department')||1,
            "pageIndex":1,
            "pageSize":10,
            "customerId":TempCache.getItem("userId") != null ? TempCache.getItem("userId") : ""
        },
        path:{
            info:"/mcall/recommend/discover/item/getMapListByDiscover/",    //发现详情
            recomendTags:"/mcall/recommend/customer/tag/json_list/",        //推荐标签
            collectioned: "/mcall/customer/collection/create/",             //收藏
            cancel:"/mcall/customer/collection/delete/",                    //取消收藏
            follow:"/mcall/customer/follow/resource/create/",               //关注
            cancelFollow:"/mcall/customer/follow/resource/delete/"          //取消关注
        },
        init: function() {
            var t = this;
            //window.onload = Log.createBrowse(43, '发现首页');
            comm.footerNav();
            // comm.releaseBox();
            t.header();           //头部信息
            t.discoverV2();       //发现页聚合数据
            t.scrollPage();       //滚动加载
        },
        header:function(){
            var t =this;
            //搜索
            var data={
                "pageIndex":1,
                "pageSize" : 2,
                groupByFlag:1,
                platformId:1
            };
            $.ajax({
                type : "post",
                url : M_CALL + "allsearch/searchHot/",
                data : data,
                dataType : "json",
                success : function(data){
                    if(data.responseObject.responseStatus){
                        var xhrdata = data.responseObject.responseData.data_list;
                        var str="";
                        $.each(xhrdata,function(i,val){
                            if(i<=2){
                                str += htmlToString(xhrdata[i].keyWord)+" | ";
                            }
                        });
                        $(".searchCont .searchInput").html('<i></i>'+comm.getStrByteLen(str.substr(0,str.length-3),40)).click(function(){
                            comm.creatEvent({
                                triggerType:'搜索',
                                actionId:9,
                                async:false
                            });
                            g_sps.jump(null,'/dist/search/search.html');
                        });

                    }else{
                        $(".searchCont .searchInput").click(function(){
                            comm.creatEvent({
                                triggerType:'搜索',
                                actionId:9,
                                async:false
                            });
                          g_sps.jump(null,'/dist/search/search.html');
                        });
                    }
                },
                error:function(){}
            });
            if(t.params.platformId==2){
                $('.pickDown li:nth-child(3)').remove();
                $('.pickUp ul li:nth-child(3)').remove();
            }
            //if(TempCache.getItem('firstTag') == 'true'){
            //    $('.listMore p').attr('style','display:block');
            //}
            //if(TempCache.getItem('clickTag') == 'true'){
            //    $('.listMore p').attr('style','display:none');
            //}
            //$('.listMore p').on('click',function(event){
            //    event.stopPropagation();
            //});
            //收起展开
            $('.listMore').on('click',function(){
                $('html body').animate({ scrollTop: 0 },0);
                $("body,html").css({
                    overflow:"hidden",
                    height:"100%"
                });
                comm.creatEvent({
                    triggerType:'展开',
                    actionId:11024
                });
                $('.pickUpCont').show();
                $("html,body").on("touchmove", function (e) {
                    e.preventDefault();
                });
                //$('.listMore p').attr('style','display:none');
                //TempCache.setItem('clickTag','true');
            });
            $('.pickUp p').on('click',function(){
                $('.pickUpCont').hide();
                $("html,body").unbind("touchmove");
                $("body,html").css({
                    overflow:"",
                    height:""
                });
            });
            $('.pickUp').on('click',function(event){
                event.stopPropagation();
            });
            $('.pickUpCont').on('click',function(){
                $('.pickUpCont').hide();
            });
            //<p><img src="//img50.allinmd.cn/v3/discover/prompt04.png"></p>
            //左右滑动
            var swiper = new Swiper('.swiper-container', {
                slidesPerView: "auto",
                paginationClickable: true,
                freeMode: true,
                observer: true
            });
            $('.pickDown li').off('click').on('click',function(){
                var t =$(this);
                comm.creatEvent({
                    triggerType:'发现页顶部入口',
                    keyword:t.find('img').attr('alt'),
                    location_id: t.attr('data-flag'),
                    actionId:11036
                });
            });
            $('.pickUp ul li').off('click').on('click',function(){
                var t =$(this);
                comm.creatEvent({
                    triggerType:'发现页顶部入口',
                    keyword:t.find('img').attr('alt'),
                    location_id:t.attr('data-flag'),
                    actionId:11036
                });
            });

        },
        discoverV2:function(){
            var t = this;
            //comm.loading.show();
            //先加载本地缓存数据，请求结束后替换
            if(TempCache.getItem('discoverFirstScreenData')){
                var _tempData = JSON.parse(TempCache.getItem('discoverFirstScreenData'));
                var item = _tempData.dataJson.responseData.data_list;
                var scoreList = _tempData.dataJson.responseData.score_list;
                if(item.length>0) {
                    t.disposeDOM(item,scoreList);
                }
            }
            t.ajaxFn({
                url:t.path.info,
                param:{paramJson: $.toJSON({
                    "score": t.params.score,
                    "flag":1,
                    "visitSiteId":2,
                    "platformId":TempCache.getItem('department')||1,
                    "pageIndex":1,
                    "pageSize":10,
                    "customerId":TempCache.getItem("userId") != null ? TempCache.getItem("userId") : ""
                })},
                fn:function(data) {
                    //comm.loading.hide();
                    //if(comm.hasResponseData(data)){
                    if (data && data.dataJson && data.dataJson.responseData && !$.isEmptyObject(data.dataJson.responseData)) {
                        TempCache.setItem('discoverFirstScreenData',JSON.stringify(data));
                        var item = data.dataJson.responseData.data_list;
                        var scoreList = data.dataJson.responseData.score_list;
                        if(item.length>0) {
                            if(scoreList && scoreList.length>0){
                                t.params.score=scoreList[0].minRecommendTime;
                            }
                            t.disposeDOM(item,scoreList);
                        }
                        t.courseCollect(); //系列课收藏
                        t.columnFollow();  //特栏目关注
                        t.recommendTag();  //推荐标签执行
                        if (item.length < t.params.maxResult) {
                            $('.columnListDown').attr("scrollPagination", "disabled").append('<section class="lastTime">~  没有更多了  ~</section>')
                        }
                    }
                },
                error:function(){
                    comm.loading.hide();
                }
            });
        },
        disposeDOM:function(item,scoreList,scroll){
            var t = this;
            var time = "",html = "",activitionState = "",subjectState = "",collect = "",follow = "",str = "";
            for(var i=0,le=item.length;i<le;i++){
                //发现引导2017/12/06
                //if(i==0 && !scroll){
                //    str = '<span class="promptDetail" style="display: none"><img src="//img50.allinmd.cn/v3/discover/prompt03.png"></span>';
                //}else{
                //    str = '';
                //}
                if(item[i].itemTitle!=""){
                    switch (parseInt(item[i].itemType)){
                        case 1:
                            switch(parseInt(item[i].isFollow)){
                                case 0:
                                    follow ='<button class="Ev-FollowBtn" follow-id="'+item[i].itemId+'">关注</button>';
                                    break;
                                case 1:
                                    follow ='<button class="Ev-FollowBtn active" follow-id="'+item[i].itemId+'">已关注</button>';
                            }
                            time = comm.date.thirdRule(item[i].recommendDate, comm.date.local_time());
                            html += '<section class="goingActivity">'+
                            '<section class="columnLeftRight">'+
                            '<figure class="ads"><a href="/pages/discover/discover_feature_detail.html?columnId='+item[i].itemId+'"><img src="'+item[i].picUrl+'"></a></figure>'+
                            '<aside class="textCont">'+
                            '<div>'+
                            '<a href="/pages/discover/discover_feature_detail.html?columnId='+item[i].itemId+'"><span class="itemTitle">'+item[i].itemTitle+'</span></a>'+follow+'</div>'+
                            '<p class="describe"><a href="/pages/discover/discover_feature_detail.html?columnId='+item[i].itemId+'">'+item[i].itemGroup+'</a></p>'+
                            '<p class="introduction"><a href="/pages/discover/discover_feature_detail.html?columnId='+item[i].itemId+'">'+comm.getStrLen(item[i].content,28)+'</a></p>'+
                            '</aside>'+
                            '</section>'+
                            '<aside class="goingTime">'+
                            '<ul class="text">'+
                            '<li class="timer"><i></i>'+time+'</li>'+
                            '</ul>'+
                            '<div class="hotActivity"><a href="/pages/discover/discover_feature_column.html">特色栏目<i></i></a>'+str+'</div>'+
                            '</aside>'+
                            '</section>';
                            break;
                        case 2:
                            switch(parseInt(item[i].isCollection)){
                                case 0:
                                    collect ='<button>收藏</button>';
                                    break;
                                case 1:
                                    collect ='<button class="active">已收藏</button>';
                            }
                            time = comm.date.thirdRule(item[i].recommendDate, comm.date.local_time());

                            item[i].itemGroup = comm.getStrLen(item[i].itemGroup,12);

                            html += '<section class="goingActivity">'+
                            '<section class="course" course-id="'+item[i].itemId+'">'+
                            '<aside class="courseLeft ">' +
                            '<a href="/pages/discover/series/discover_series_details.html?tId='+item[i].itemId+'">' +
                            '<p class="courseTitle">'+item[i].itemTitle+'</p>' +
                            '<p class="courseNum"><span>'+item[i].itemGroup+'系列课</span><i>'+item[i].catalogNum+'节课</i><b>'+item[i].resourceNum.toWKH()+'个资源</b></p>' +
                            '</a>' +
                            '</aside>'+
                            '<aside class="courseRight collection">'+collect+'</aside>'+
                            '</section>'+
                            '<aside class="goingTime">'+
                            '<ul class="text">'+
                            '<li class="timer"><i></i>'+time+'</li>'+
                            '<li class="viewNum"><i></i>'+item[i].browseNum.toWKH()+'</li>'+
                            '</ul>'+
                            '<div class="hotActivity"><a href="/pages/discover/series/discover_series_course.html">系列课<i></i></a>'+str+'</div>'+
                            '</aside>'+
                            '</section>';
                            break;
                        case 3:
                            time = comm.date.thirdRule(item[i].recommendDate, comm.date.local_time());
                            switch (parseInt(item[i].state)) {
                                case 1:
                                    activitionState = '<i class="new"><img src="//img50.allinmd.cn/pages/discover/mark_hot.png" alt=""></i>';
                                    break;
                                case 2:
                                    activitionState = '<i class="hot"><img src="//img50.allinmd.cn/pages/discover/mark_new.png" alt=""></i>';
                                    break;
                                case 3:
                                    activitionState = '<i class="going"><img src="//img50.allinmd.cn/pages/discover/mark_living_now.png" alt=""></i>';
                                    break;
                                case 4:
                                    activitionState = '<i class="goEnd"><img src="//img50.allinmd.cn/pages/discover/review.png" alt=""></i>';
                                    break;

                            }
                            html += '<section class="goingActivity">' +
                            '<figure class="goingImg"><a href="'+item[i].itemUrl+'"><img src="'+item[i].picUrl+'"></a>'+activitionState+'</figure>'+
                            '<p class="goingText"><a href="'+item[i].itemUrl+'">'+item[i].itemTitle +'</a></p>'+
                            '<aside class="goingTime">'+
                            '<ul class="text">'+
                            '<li class="timer"><i></i>'+time+'</li>'+
                            '</ul>'+
                            '<div class="hotActivity"><a href="/pages/discover/discover_hotActivity.html">热门活动<i></i></a>'+str+'</div>'+
                            '</aside>'+
                            '</section>';
                            break;
                        case 4:
                            switch (parseInt(item[i].itemGroup)) {
                                case 0:
                                    subjectState = '待分组';
                                    break;
                                case 1:
                                    subjectState = '基础骨病';
                                    break;
                                case 2:
                                    subjectState = '骨科技术';
                                    break;
                                case 3:
                                    subjectState = '精品栏目';
                                    break;
                                case 4:
                                    subjectState = '特色专题';
                                    break;
                            }
                            time = comm.date.thirdRule(item[i].recommendDate, comm.date.local_time());
                            html += '<section class="goingActivity">' +
                            '<figure class="goingImg"><a href="'+item[i].itemUrl+'"><img src="'+item[i].picUrl+'"></a><span>'+subjectState+'</span></figure>'+
                            '<p class="goingText"><a href="'+item[i].itemUrl+'">'+item[i].itemTitle+'</a></p>'+
                            '<aside class="goingTime">'+
                            '<ul class="text">'+
                            '<li class="timer"><i></i>'+time+'</li>'+
                            '</ul>'+
                            '<div class="hotActivity"><a href="/pages/discover/discover_subject.html">推荐专题<i></i></a>'+str+'</div>'+
                            '</aside>'+
                            '</section>';
                            break;
                    }
                }

            }
            if(scroll==2){
                $('.columnListDown').append(html);
            }else{
                $('.columnListDown').html(html);
            }

            //if(TempCache.getItem('firstTag') != 'true'){
            //    $('.promptDetail').attr('style','display:block');
            //}
            $('.hotActivity').off('click').on('click',function(){
                var t = $(this);
                comm.creatEvent({
                    triggerType:'发现页到列表页入口',
                    keyword:t.text(),
                    actionId:11037
                });
                //$('.promptDetail').attr('style','display:none');
                //TempCache.setItem('firstTag','true');
            });

            //$('.promptDetail').on('click',function(event){
            //    event.stopPropagation();
            //})
        },
        courseCollect:function(){
            var that = this;
            $('.collection').off('click').on('click',function () {
                var t = $(this);
                user.privExecute({
                    operateType: 'auth',
                    noNeedBack:true,
                    callback: function () {
                        if (TempCache.getItem("customerRole") == 2 || TempCache.getItem("customerRole") == 3 || TempCache.getItem("customerRole") == 4) {

                        } else {
                            if (!t.find('button').hasClass('active')) {
                                comm.creatEvent({
                                    triggerType:'收藏',
                                    actionId:82,
                                    keyword: t.prev().find('.courseTitle').text(),
                                    push_message_id:t.parent('.course').attr('course-id'),
                                    location_id:111,
                                    async:false
                                });
                                that.ajaxFn({
                                    url:that.path.collectioned,
                                    param: {
                                        paramJson: $.toJSON({
                                            "collectionType": "18",
                                            "refId": t.parent('.course').attr('course-id'),
                                            "customerId": TempCache.getItem("userId")
                                        })
                                    },
                                    fn: function (data) {
                                        if (data.responseObject.responseStatus == true) {
                                            popupFn("收藏成功", 1500);
                                            t.find('button').attr('class','active').html("已收藏");
                                        }
                                    }
                                });
                            } else {
                                comm.creatEvent({
                                    triggerType:'收藏',
                                    actionId:82,
                                    keyword:t.prev().find('.courseTitle').text(),
                                    push_message_id:t.parent('.course').attr('course-id'),
                                    location_id:111111,
                                    async:false
                                });
                                that.ajaxFn({
                                    url: that.path.cancel,
                                    type:"post",
                                    param: {
                                        paramJson: $.toJSON({
                                            "collectionType": "18",
                                            "refId":  t.parent('.course').attr('course-id'),
                                            "customerId": TempCache.getItem("userId")
                                        })
                                    },
                                    fn: function (data) {
                                        if (data.responseObject.responseStatus == true) {
                                            popupFn("取消收藏成功", 1500);
                                            t.find('button').removeClass('active').html("收藏");
                                        }
                                    }
                                });
                            }
                        }
                    }
                });
            });
        },
        columnFollow:function(){
            var t = this;
            $(".Ev-FollowBtn").off("click").on("click", function () {//关注，点击进行关注
                var that = $(this);
                user.privExecute({
                    operateType: 'auth',
                    noNeedBack:true,
                    callback: function () {
                        if(that.hasClass('active')){
                            $('.al-unfollow').addClass('on');
                            $('#EV-unfollowBtn').off("click").on("click",function(){
                                comm.creatEvent({
                                    triggerType:'关注',
                                    keyword:that.prev().text(),
                                    push_message_id:that.attr('follow-id'),
                                    actionId:11022,
                                    browsetype:43
                                });
                                t.ajaxFn({
                                    url: t.path.cancelFollow,
                                    param:{paramJson: $.toJSON({
                                        "refId": that.attr('follow-id'),
                                        "followType":"8",
                                        "refName": that.prev().text(),
                                        "customerId": t.params.customerId
                                    })
                                    },
                                    fn: function (data) {
                                        if (data && data.responseObject && data.responseObject.responseStatus) {
                                            $('.al-unfollow').removeClass('on');
                                            that.removeClass('active').html('关注');
                                        }
                                    },
                                    error: function () {
                                        comm.loading.hide();
                                    }
                                });
                            });
                            $('#EV-cancelUploadImg').off("click").on("click",function(){
                                $('.al-unfollow').removeClass('on');
                            });
                        }else{
                            comm.creatEvent({
                                triggerType:'关注',
                                keyword:that.prev().text(),
                                actionId:11022,
                                push_message_id:that.attr('follow-id'),
                                browsetype:43
                            });
                            t.ajaxFn({
                                url: t.path.follow,
                                param:{paramJson: $.toJSON({
                                    "refId": that.attr('follow-id'),
                                    "followType":"8",
                                    "refName": that.prev().text(),
                                    "customerId": t.params.customerId
                                })
                                },
                                fn:function(data) {
                                    comm.loading.hide();
                                    if (data && data.responseObject && data.responseObject.responseStatus) {
                                        popup('已关注');
                                        that.addClass('active').html('已关注');
                                    }
                                },
                                error:function(){
                                    comm.loading.hide();
                                }
                            });
                        }
                    }
                });

            });
        },
        recommendTag:function(){
            var t = this;
            //comm.loading.show();
            t.ajaxFn({
                url: t.path.recomendTags,
                param:{paramJson: $.toJSON({
                        "score": t.opt.tagRecScore,
                        "flag":1,
                        "visitSiteId":2,
                        "platformId":TempCache.getItem('department')||1,
                        "pageIndex":1,
                        "pageSize":10,
                        "customerId":TempCache.getItem("userId") != null ? TempCache.getItem("userId") : ""
                    })
                },
                fn:function(data) {
                    //comm.loading.hide();
                    if(comm.hasResponseData(data)){
                        t.opt.tagNum++;
                        var item = data.responseObject.responseData.data_list;
                        var scoreList = data.responseObject.responseData.score_list;
                        if(item.length>0) {
                            t.tagDOM(item,scoreList);
                        }
                    }
                },
                error:function(){
                    comm.loading.hide();
                }
            });
        },
        tagDOM:function(item,scoreList){
            var t = this;
            var str = "",html = "";
            for(var i=0,le=item.length;i<le;i++){
                if(comm.getByteLen(item[i].propertyName)>18){
                    item[i].propertyName = comm.getStrLen(item[i].propertyName,18);
                }
                str += '<li><a href="/pages/discover/discover_tagSubject.html?tId='+item[i].propertyId+'" tagid="'+item[i].propertyId+'">'+item[i].propertyName+'<span>'+item[i].resourceNum+'</span></a></li>';//comm.getStrLen(,12)
            }
            html += '<section class="goingActivity">'+
            '<ul class="tagList">'+str+'</ul>'+
            '<aside class="goingTime">'+
            '<div class="hotActivity"><span style="margin-right:0.37rem">推荐标签</span></div>'+
            '</aside>'+
            '</section>';
            if(t.opt.count==0){
                $('.goingActivity').eq(4 +(t.opt.tagNum-1)*10).after(html);
            }else{
                $('.goingActivity').eq(4+t.opt.count+(t.opt.tagNum-1)*10).after(html);
            }
            t.opt.count++;
            if(scoreList && scoreList.length>0){
                t.opt.tagRecScore=scoreList[0].minRecommendTime;
            }
        },
        scrollPage: function() {
            var t = this;
            var pagenumber = 2;
            $('.columnListDown').scrollPagination({
                'contentPage': t.path.info,
                'contentData': $.extend(t.params, {
                    pageIndex: function() {
                        return pagenumber++;
                    }
                }),
                'scrollTarget': $(window),
                //'heightOffset': $(window).height(), // it gonna request when scroll is 10 pixels before the page ends
                'delaytime': 0,
                'type': "post",
                'dataType': "json",
                'beforeLoad': function() {
                    comm.loading.show();

                },
                'afterLoad': function() {
                    comm.loading.hide();
                },
                'loader': function(data) {
                    comm.loading.hide();
                    if ($.isEmptyObject(data)) {
                        $(".columnListDown").attr("scrollPagination", "disabled").append('<section class="lastTime">~  没有更多了  ~</section>');
                        //alert("没有内容了");
                        return false;
                    } else {
                        if ($.isEmptyObject(data.dataJson.responseData) || (data.dataJson.responseData.data_list && data.dataJson.responseData.data_list.length == 0)) {
                            $(".columnListDown").attr("scrollPagination", "disabled").append('<section class="lastTime">~  没有更多了  ~</section>');
                            //alert("没有内容了2");
                            return false;
                        } else {
                            var items = data.dataJson.responseData.data_list;
                            var scoreList = data.dataJson.responseData.score_list;
                            var second = 2;  // 代表是请求第二次
                            if(scoreList && scoreList.length>0){
                                t.params.score=scoreList[0].minRecommendTime;
                            }
                            t.disposeDOM(items,scoreList,second);
                            t.courseCollect();  //系列课收藏
                            t.columnFollow();   //特栏目关注
                            t.recommendTag();
                            if (items.length < t.params.pageSize) {
                                $(".columnListDown").attr("scrollPagination", "disabled").append('<section class="lastTime">~  没有更多了  ~</section>');
                                return false;
                            }
                        }
                    }
                }
            });
        },
        ajaxFn:function(obj){
            comm.loading.show();
            $.ajax({
                url: obj.url,
                data: obj.param,
                dataType:'json',
                type:'post',
                success:function(data){
                    comm.loading.hide();
                    if(data){
                        obj.fn(data);
                    }
                }
            })
        }
    };
    discoverIndex.init();
});
