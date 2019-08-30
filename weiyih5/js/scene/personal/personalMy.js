var personalMy = {
    $listNav: null, //导航
    $listContext: null, //输出的上下文环境
    type: null, //场景
    refType: 7, //类型1视频2文库4话题7病例8评论17书籍
    isSelf: false,
    init: function(opts) {
        this.$listContext = opts.$listContext;
        this.$listNav = opts.$listNav;
        this.type = opts.type;
        this.refType = opts.refType;
        //区分他人与自己时
        this.cid = getpara().cid;
        var uid = localStorage.getItem('userId');
        this.searchFollowTags();
        if (this.cid == uid || (location.pathname == "/pages/personal/personal_collection.html" && this.cid === undefined)) {
            this.cid = uid;
            this.isSelf = true;
        }
        this.callApp();
        if (document.referrer.indexOf('search') != -1 || document.referrer.indexOf('seminar') != -1) {
            $(".al-personNavbarItem").removeClass('active');
            $(".ev-followNav [data-role='tag']").addClass('active');

            this.refType = 61;
        }
        switch (this.type) {
            case "collection":
                user.privExecute({
                    operateType: 'auth', //'login','auth','conference'
                    callback: function() {}
                });
                if (this.isSelf) { //自己时记录已读时间
                    //权限
                    TempCache.setItem('readCollectionTime', comm.date.local_time()); //cookie记录上次查看收藏的时间
                    Log.createBrowse(95,'收藏页');
                } else { //他人收藏
                    /*if(!uid){//权限未登录
                        user.redirectLogin();
                    }*/
                    Log.createBrowse(96,'TA的收藏');
                    //他的收藏 sps alcode修改
                    $("body").attr("data-alcode",'276');
                    $(".ev-list").attr("data-alcode-mod","567");
                }
                this.setListNav();
                this.apply();
                this.toggleNav();
                break;
            case "follow":
                //权限
                user.privExecute({
                    operateType: 'auth', //'login','auth','conference'
                    callback: function() {}
                });
                Log.createBrowse(97,'关注资源页');
                this.apply();
                this.toggleNav();
                break;
            case "history":
                this.apply();
                //Log.createBrowse(98,'浏览记录');
            default:
        }
    },
    getUrlParams: function() {
        switch (this.type) {
            case "collection":
                this.url = M_CALL + 'customer/collection/json_list/';
                this.params = {
                    collectionType: this.refType,
                    attUseFlag: AttUseFlag.e, //300*200 新的
                    logoUseFlag: 2,
                    customerId: this.cid ? this.cid : localStorage.getItem('userId'),
                    pageIndex: 1,
                    pageSize: 20
                };
                break;
            case "follow":
                this.url = M_CALL + 'customer/follow/resource/getMapList3/';
                this.params = {
                    paramJson: $.toJSON({
                        customerId: localStorage.getItem('userId'),
                        followType: this.refType, //            4话题7病例61标签
                        pageIndex: 1,
                        pageSize: 20,
                        logoUseFlag: 2,
                        attUseFlag: AttUseFlag.e, //300*200 新的
                        visitSiteId: 2
                    })
                }
                break;
            case "history":
                this.url = M_CALL + 'log/customer/browse/json_list/';
                this.params = {
                    paramJson: $.toJSON({
                        browseTypes: '4,5,9,10', //4-视频内容页,5-文库内容页,9-话题内容页,10-病例内容页
                        customerId: localStorage.getItem('userId'),
                        dataFlag: 3,
                        groupType: 1,
                        pageIndex: 1,
                        pageSize: 100
                    })
                }
            default:
        }
    },
    toggleNav: function() {
        var _this = this;
        _this.$listNav.find("figure").off("click").on('click', function() {
            if ($(this).hasClass('active')) {
                return false;
            }
            $(this).addClass('active').siblings().removeClass('active');
            switch ($(this).attr('data-role')) {
                case 'video':
                    _this.refType = 1;
                    if(_this.isSelf){
                        Log.createBrowse(182,'我的收藏-视频');
                        $(".ev-list").attr("data-alcode-mod","562");
                    }else{
                        Log.createBrowse(190,'他人收藏-视频');
                        $(".ev-list").attr("data-alcode-mod","570");
                    }
                    break;
                case 'case':
                    $('.ev-searchTag').hide();
                    if(_this.type=="collection") {
                        if (_this.isSelf) {
                            Log.createBrowse(181, '我的收藏-病例');
                            $(".ev-list").attr("data-alcode-mod", "471");
                        } else {
                            Log.createBrowse(189, '他人收藏-病例');
                            $(".ev-list").attr("data-alcode-mod", "567");
                        }
                    }else{
                        $(".ev-list").attr("data-alcode-mod", "473");
                    }
                    _this.refType = 7;
                    break;
                case 'doc':
                    _this.refType = 2;
                    if(_this.isSelf) {
                        Log.createBrowse(183, '我的收藏-文库');
                        $(".ev-list").attr("data-alcode-mod","563");
                    }else{
                        Log.createBrowse(191, '他人收藏-文库');
                        $(".ev-list").attr("data-alcode-mod","569");
                    }
                    break;
                case 'topic':
                    $('.ev-searchTag').hide();
                    if(_this.type=="collection") {
                        if (_this.isSelf) {
                            Log.createBrowse(187, '我的收藏-话题');
                            $(".ev-list").attr("data-alcode-mod", "564");
                        } else {
                            Log.createBrowse(195, '他人收藏-话题');
                            $(".ev-list").attr("data-alcode-mod", "568");
                        }
                    }else{
                        $(".ev-list").attr("data-alcode-mod", "573");
                    }
                    _this.refType = 4;
                    break;
                case 'comment':
                    _this.refType = 8;
                    if(_this.isSelf) {
                        Log.createBrowse(185, '我的收藏-评论');
                        $(".ev-list").attr("data-alcode-mod","565");
                    }else{
                        Log.createBrowse(193, '他人收藏-评论');
                        $(".ev-list").attr("data-alcode-mod","571");
                    }
                    break;
                case 'tag':
                    $('.ev-searchTag').show();
                    _this.refType = 61;
                    $(".ev-list").attr("data-alcode-mod", "574");
                    break;
                case 'book':
                    _this.refType=17;
                    if(_this.isSelf) {
                        Log.createBrowse(186, '我的收藏-书籍');
                        $(".ev-list").attr("data-alcode-mod","566");
                    }else{
                        Log.createBrowse(194, '他人收藏-书籍');
                        $(".ev-list").attr("data-alcode-mod","572");
                    }
                    break;
                case 'course':
                    _this.refType=18;
                    break;
                default:
                    _this.refType = 1;
            }
            _this.$listContext.html('');
            _this.apply();
        });
    },
    adapterData: function(kv) {
        var kvObj = {};
        switch (this.type) {
            case "collection":

                switch (this.refType) {
                    case 7:
                        kvObj = {
                            title: htmlToString(kv.case_baseinfo.caseName),
                            reviewNum: kv.case_baseinfo.reviewNum.toWK(),
                            browseNum: kv.case_baseinfo.browseNum.toWK(),
                            refLogoUrl: kv.case_attachment.attUrl,
                            refUrl: kv.case_baseinfo.webStoragePath,
                            score:kv.case_baseinfo.currentStarLevel,
                            scoreNum:kv.case_baseinfo.currentScoreNum,
                            videoType:1
                        };
                        break;
                    case 1:
                        kvObj = {
                            title: htmlToString(kv.cms_video.videoName),
                            reviewNum: kv.cms_video.reviewNum.toWK(),
                            browseNum: kv.cms_video.playNum.toWK(),
                            refLogoUrl: kv.cms_video_attachment.videoAttUrl,
                            refUrl: kv.cms_video.webStoragePath,
                            playTime: kv.cms_video.playTime,
                            score:kv.cms_video.currentStarLevel,
                            scoreNum:kv.cms_video.currentScoreNum,
                            videoType:kv.cms_video.videoType
                        };
                        break;
                    case 2:
                        kvObj = {
                            title: htmlToString(kv.cms_doc.docName),
                            reviewNum: kv.cms_doc.reviewNum.toWK(),
                            browseNum: kv.cms_doc.browseNum.toWK(),
                            refLogoUrl: kv.cms_doc_attachment.docAttUrl,
                            refUrl: kv.cms_doc.webStoragePath,
                            score:kv.cms_doc.currentStarLevel,
                            scoreNum:kv.cms_doc.currentScoreNum,
                            videoType:kv.cms_doc.docType
                        };
                        break;
                    case 4:
                        kvObj = {
                            title: htmlToString(kv.cms_topic.topicName),
                            reviewNum: kv.cms_topic.reviewNum.toWK(),
                            browseNum: kv.cms_topic.browseNum.toWK(),
                            refLogoUrl: kv.cms_topic_attachment.topicAttUrl,
                            refUrl: kv.cms_topic.webStoragePath,
                            videoType:1
                        };
                        break;
                    case 17:
                        kvObj = { title: htmlToString(kv.cms_book.docName),
                            tplPath:kv.cms_book.tplPath,
                            reviewNum: kv.cms_book.reviewNum.toWK(),
                            browseNum: kv.cms_book.browseNum.toWK(),
                            refLogoUrl: kv.cms_book_attachment.docAttUrl,
                            //refUrl: '/pages/eBook/eBook_details.html?bId='+kv.customer_collection.refId
                            refUrl:"javascript:;",
                            bookId:kv.cms_book.docId,
                            videoType:17
                        };
                        break;
                    default:
                }
                kvObj.resourceIsValid = kv.resource_valid.resourceValid;
                kvObj.author = kv.publish_customer.lastName + kv.publish_customer.firstName;
                break;
            case "follow":
                switch (this.refType) {
                    case 7:
                        kvObj.refLogoUrl = kv.resource_att.attUrl;
                        kvObj.title = htmlToString(kv.resource.resourceName);
                        kvObj.browseNum = kv.resource.browseNum == '' ? 0 : kv.resource.browseNum.toWK();
                        kvObj.reviewNum = kv.resource.reviewNum == '' ? 0 : kv.resource.reviewNum.toWK();
                        kvObj.refUrl = kv.resource.webStoragePath;
                        kvObj.author = kv.customer_auth.lastName + kv.customer_auth.firstName;
                        kvObj.resourceIsValid = kv.resource.isValid;
                        kvObj.score = kv.currentStarLevel;
                        kvObj.scoreNum = kv.currentScoreNum;
                        kvObj.videoType = 1;
                        break;
                    case 4:
                        kvObj.refLogoUrl = kv.resource_att.topicAttUrl;
                        kvObj.title = htmlToString(kv.resource.resourceName);
                        kvObj.browseNum = kv.resource.browseNum == '' ? 0 : kv.resource.browseNum.toWK();
                        kvObj.reviewNum = kv.resource.reviewNum == '' ? 0 : kv.resource.reviewNum.toWK();
                        kvObj.refUrl = kv.resource.webStoragePath;
                        kvObj.author = kv.customer_auth.lastName + kv.customer_auth.firstName;
                        kvObj.resourceIsValid = kv.resource.isValid;
                        kvObj.videoType = 1;
                        break;
                    case 61:
                        kvObj.id = kv.resource.id;
                        kvObj.tagName = htmlToString(kv.resource.propertyName);
                        break;
                    default:
                }

                break;
            case "history":
                var wordType = '';
                switch (kv.browseType) {
                    case 4:
                        wordType = "视频";
                        break;
                    case 5:
                        wordType = "文库";
                        break;
                    case 9:
                        wordType = "话题";
                        break;
                    case 10:
                        wordType = "病例";
                        break;
                }

                kvObj = {
                    //4-视频内容页,5-文库内容页,9-话题内容页,10-病例内容页
                    browseType: wordType,
                    openTime: kv.openTime,
                    title: htmlToString(kv.refName),
                    refUrl: kv.browseUrl
                };
                break;
        }
        return kvObj;
    },
    callApp:function(){
        var t=this;
        $(document).on('click','.ev_callAppBook',function(){
            var refId =$(this).attr('bookId');
            //console.log(refId);
            var amChannel = comm.getpara()._amChannel;
            var callAppOptions ={
                ios: "allinmdios://app.allinmd.cn/applinks.html?scene=terminalPage&index=2&sourceId=" + refId + "&tplPath=286&share=app&visitSiteId=5" + (amChannel?"&_amChannel="+amChannel:''),
                android: "allin://com.allin.social:75235?data={scene:3,type:2,sourceId:"+ refId +",tplPath:286"+ (amChannel?",_amChannel:"+amChannel:'')+ "}",
                ios9: "http://app.allinmd.cn/applinks.html?scene=terminalPage&index=2&sourceId=" + refId+ "&tplPath=286&share=app&visitSiteId=5" + (amChannel?"&_amChannel="+amChannel:''),
                runAtOnce: false
            };
            comm.appWakeUp("confirm", callAppOptions);//唤醒app弹层
        });

    },
    apply: function(setDataList) {  //setDataList标识是否瀑布流之后

        $('.ev-followTag').hide();

        if(!setDataList){ this.getUrlParams(); } //初始化时取一次参数，之后不再取

        comm.loading.show();

        if (this.type == "collection" && this.refType === 8) {
            //接入回复
            var opts = {
                $context: $('.ev-list'),
                customerId: this.cid,
                sessionCustomerId: localStorage.getItem("userId"),
                scene: "collectReview"
            };
            module.reviewList(opts);
            comm.loading.hide();
        } else if (this.refType == 61) { //关注里的标签
            if(setDataList){
                if (!res || !res.responseObject.responseStatus || !res.responseObject.responseData || !res.responseObject.responseData.data_list) {
                    this.$listContext.attr('scrollPagination', 'disabled');
                }else{
                    var list = setDataList.responseObject.responseData.data_list;
                    var html = '';
                    for (var x = 0; x < list.length; x++) {
                        html += this.followTagTemplate(this.adapterData(list[x]));
                    }
                    this.$listContext.append(html);
                }
            }else{
                var _this = this;
                $.ajax({
                    url: this.url,
                    type: 'POST',
                    data: this.params,
                    _this: this,
                    success: function (res) {
                        //var _this = this._this;
                        if (!res || !res.responseObject.responseStatus || !res.responseObject.responseData || !res.responseObject.responseData.data_list) {
                            //_this.$listNav && _this.$listNav.hide();
                            _this.$listContext.attr('scrollPagination', 'disabled');
                            $('.ev-searchTag').hide();
                            _this.$listContext.append(_this.nullDataTemplate());
                            $('.ev-followTag').show();
                            $('.ev-followTag').on('click', function () {
                              g_sps.jump(null,'/pages/discover/discover_tag.html');
                            });

                            comm.loading.hide();
                        } else {
                            $(".ev-searchTag").show();
                            $('.ev-followTag').show();
                            var list = res.responseObject.responseData.data_list;
                            var html = '';

                            for (var x = 0; x < list.length; x++) {
                                html += _this.followTagTemplate(_this.adapterData(list[x]));
                            }

                            _this.$listContext.append(html);
                            comm.loading.hide();
                        }

                        // $(".ev-searchTag").on('click', function(){
                        //  window.location.href= '/pages/discover/discover_searchTag.html?search=active';
                        // });

                    }
                });
            }

        } else {  //其它 收藏 里的非评论与关注里的非标签
            var isThis = this;
            function ctrlCourse(data){
                function dealData(indata){
                    var returnData = [];
                    $.each(indata,function(i,v){
                        var dataJson = {};
                        var timeLimit = (v.customer_collection.price>0)?"0":"1";
                        dataJson.collect = {};
                        dataJson.collect.state = "1";
                        dataJson.courseNum = v.customer_collection.catalogNum.toWK();
                        dataJson.reviewNum = v.customer_collection.totalLearnNum.toWK();
                        dataJson.title = v.customer_collection.refName;
                        dataJson.id = v.customer_collection.refId;
                        dataJson.timeLimit = timeLimit;
                        dataJson.imgSrc = v.customer_collection.coverPicUrl;
                        dataJson.linkUrl = "/pages/discover/series/discover_series_details.html?tId=" + v.customer_collection.refId+"#code=1";
                        returnData.push(dataJson);
                    });
                    return returnData;
                }
                function demoStr(strdata){
                    var str = "";
                    $.each(strdata,function (i,v) {
                        var s = comm.getStrLen(v.title, 40);
                        v.title = s;
                        //str+='<li data-href="'+v.linkUrl+'" data-seriesId="'+v.id+'">'+
                        //    '<img src="'+v.imgSrc+'">'+
                        //    '<aside>'+
                        //    '<p>'+
                        //    v.title+
                        //    '</p>'+
                        //    '<p>'+
                        //    '	<i></i>'+v.reviewNum+'<span>'+v.courseNum+'节课</span>'+
                        //    '</p>'+
                        //    '<p class="'+v.timeLimitClass+'">'+
                        //    '	限时免费'+
                        //    '</p>'+
                        //    '</aside>'+
                        //    '</li>';

                         str+='<li data-href="'+v.linkUrl+'" data-seriesId="'+v.id+'">'+
                            '<a href="'+v.linkUrl+'"><img src="'+v.imgSrc+'"></a>'+
                            '<aside>'+
                            '<p><a href="'+v.linkUrl+'">'+
                            v.title+
                            '</a></p>'+
                            '<p>'+
                            '<span><i></i>'+v.reviewNum+'</span><span>'+v.courseNum+'节课</span>'+
                            '</p>'+
                            '</aside>'+
                            '</li>';
                    });
                    return str;
                }
                return demoStr(dealData(data));
            }
            if(!setDataList) {  //初始化时
                $.ajax({
                    url: this.url,
                    type: 'POST',
                    data: this.params,
                    _this: this,
                    success: function (res) {
                        var _this = this._this;

                        if(isThis.type == "collection" && isThis.refType === 18){
                            var noDataObj = $(".al-noContentTips");
                            var contentList = $(".ev-list");
                            function noSeries(){
                                $(window).off("scroll");
                                noDataObj.show();
                            }
                            function hideNoData(){
                                noDataObj.hide();
                            }
                            function openHref(){
                                $("[data-href]").off("click").on("click",function(){
                                    var href = $(this).attr("data-href");
                                  g_sps.jump(null,href);
                                });
                            }
                            function scrollSeriesPage(){
                                $(".ev-list").scrollPagination({
                                    'contentPage': personalMy.url,
                                    'contentData': {
                                        customerId: personalMy.cid,
                                        collectionType: function() {
                                            return personalMy.params.collectionType;
                                        }, //类型变化params.refType
                                        logoUseFlag: 2,
                                        attUseFlag: AttUseFlag.e, //300*200 新的
                                        visitSiteId: 2,
                                        pageIndex: function() {
                                            personalMy.params.pageIndex= personalMy.params.pageIndex + 1;
                                            return personalMy.params.pageIndex;
                                        },
                                        pageSize: 20
                                    },
                                    'scrollTarget': $(window),
                                    'heightOffset': 10,
                                    'delaytime': 0,
                                    'beforeLoad': function() { comm.loading.show(); },
                                    'afterLoad': function(elementsLoaded) { comm.loading.hide(); },
                                    'loader': function(data) {
                                        var realNoData = ((data.responseObject.responseMessage) == "NO DATA");
                                        var realStatus = data.responseObject.responseStatus;
                                        if (realNoData || !realStatus) {
                                            noSeries();
                                        }else{
                                            var len = res.responseObject.responseData.data_list.length;
                                            if(len<20){
                                                contentList.find(".courseList").append(ctrlCourse(data.responseObject.responseData.data_list)).after('<section class="al-personalContributionOver"><span>~</span>没有更多了<span>~</span></section>');
                                                _this.$listContext.attr('scrollPagination', 'disabled');
                                            }else{
                                                contentList.append('<ul class="courseList data_list">'+ctrlCourse(res.responseObject.responseData.data_list)+'</ul>');
                                            }
                                            hideNoData();
                                            openHref();
                                        }

                                    }
                                });
                            }
                            var realNoData = ((res.responseObject.responseMessage) == "NO DATA");
                            var realStatus = res.responseObject.responseStatus;
                            if (realNoData || !realStatus) {
                                noSeries();
                            } else {
                                hideNoData();
                                var len = res.responseObject.responseData.data_list.length;
                                if(len<20){
                                    contentList.html('<ul class="courseList data_list">'+ctrlCourse(res.responseObject.responseData.data_list)+'</ul>'+_this.endDataTemplate());
                                    _this.$listContext.attr('scrollPagination', 'disabled');
                                }else{
                                    contentList.html('<ul class="courseList data_list">'+ctrlCourse(res.responseObject.responseData.data_list)+'</ul>');
                                    _this.$listContext.attr('scrollPagination', 'enabled');
                                    //scrollSeriesPage();
                                }
                                openHref();
                            }
                        }
                        if (!res || !res.responseObject.responseStatus || !res.responseObject.responseData || !res.responseObject.responseData.data_list) {
                            if (_this.type === "collection") {
                                //_this.$listNav && _this.$listNav.hide();
                            }else{
                                _this.$listContext.append(_this.nullDataTemplate());
                            }

                            comm.loading.hide();
                        } else {
                            var list = res.responseObject.responseData.data_list;
                            var html = '';
                            if (_this.type === "history") {
                                html = _this.handleHistoryTemplate(list);
                            } else {
                                for (var x = 0; x < list.length; x++) {
                                    if (_this.type === "collection") {
                                        html += _this.itemTemplate(_this.adapterData(list[x]));
                                    } else {
                                        //if (list[x].resource.isValid) {
                                            html += _this.itemTemplate(_this.adapterData(list[x]));
                                        //}
                                    }

                                }
                            }
                            if(isThis.refType!= 18){
                                _this.$listContext.append(html);
                                if (list.length < 20) {
                                    _this.$listContext.append(_this.endDataTemplate()).attr('scrollPagination', 'disabled');
                                }
                            }
                            comm.loading.hide();
                            if(_this.type == "follow"){
                                followWaterfall();
                            }else if(_this.type == "collection"){
                                collectionWaterfall();
                            }
                        }

                    }
                });
            }else{  //瀑布流加载后
                var _this = this;
                var res= setDataList;
                if (!res || !res.responseObject.responseStatus || !res.responseObject.responseData || !res.responseObject.responseData.data_list) {
                    if (_this.type === "collection") {
                        _this.$listNav && _this.$listNav.hide();
                    }

                    if(_this.params.pageIndex == 1){
                        _this.$listContext.append(_this.nullDataTemplate());
                        comm.loading.hide();
                    }
                } else {
                    var list = res.responseObject.responseData.data_list;
                    var html = '';
                    if (_this.type === "history") {
                        html = _this.handleHistoryTemplate(list);
                    } else {
                        for (var x = 0; x < list.length; x++) {
                            if (_this.type === "collection") {
                                html += _this.itemTemplate(_this.adapterData(list[x]));
                            } else {
                                //if (list[x].resource.isValid) {
                                    html += _this.itemTemplate(_this.adapterData(list[x]));
                                //}
                            }

                        }
                    }
                    _this.$listContext.append(html);
                    if (list.length < 20) {
                        if(_this.refType==18){
                            var contentList = $(".ev-list");
                            contentList.find(".courseList").append(ctrlCourse(res.responseObject.responseData.data_list));
                            $("[data-href]").off("click").on("click",function(){
                                var href = $(this).attr("data-href");
                                g_sps.jump(null,href);
                            });
                        }
                        _this.$listContext.append(_this.endDataTemplate()).attr('scrollPagination', 'disabled');
                    }

                    comm.loading.hide();
                    if(_this.type == "follow"){
                        followWaterfall();
                    }else if(_this.type == "collection"){
                        collectionWaterfall();
                    }
                }

            }
        }


        function followWaterfall() { //关注瀑布流 不含标签 paramJson
            $(".ev-list").scrollPagination({
                'contentPage': personalMy.url,
                'contentData': {
                    customerId: localStorage.getItem('userId'),
                    followType: function() {
                        var params = JSON.parse(personalMy.params.paramJson);
                        return params.followType;
                    }, //类型变化params.refType
                    logoUseFlag: 2,
                    attUseFlag: AttUseFlag.e, //300*200 新的
                    visitSiteId: 2,
                    pageIndex: function() {
                        var params = JSON.parse(personalMy.params.paramJson);
                        params.pageIndex = params.pageIndex + 1;
                        personalMy.params.paramJson= $.toJSON(params);

                        return params.pageIndex;
                    },
                    pageSize: 20
                },
                'scrollTarget': $(window),
                'heightOffset': 10,
                'delaytime': 0,
                'beforeLoad': function() { comm.loading.show(); },
                'afterLoad': function(elementsLoaded) { comm.loading.hide(); },
                'loader': function(data) {
                    if($("[scrollPagination]").attr("scrollPagination") =="enabled"){
                        personalMy.apply(data);
                    }
                }
            });
        }

        function collectionWaterfall() { //收藏瀑布流 不含评论 非paramJson
            $(".ev-list").scrollPagination({
                'contentPage': personalMy.url,
                'contentData': {
                    customerId: personalMy.cid,
                    collectionType: function() {
                        return personalMy.params.collectionType;
                    }, //类型变化params.refType
                    logoUseFlag: 2,
                    attUseFlag: AttUseFlag.e, //300*200 新的
                    visitSiteId: 2,
                    pageIndex: function() {
                        personalMy.params.pageIndex= personalMy.params.pageIndex + 1;
                        return personalMy.params.pageIndex;
                    },
                    pageSize: 20
                },
                'scrollTarget': $(window),
                'heightOffset': 10,
                'delaytime': 0,
                'beforeLoad': function() { comm.loading.show(); },
                'afterLoad': function(elementsLoaded) { comm.loading.hide(); },
                'loader': function(data) {
                    if($("[scrollPagination]").attr("scrollPagination") =="enabled"){
                        personalMy.apply(data);
                        //dataList(data);
                    }
                }
            });
        }
    },
    followTagTemplate: function(kv) {
        return '<article class="al-searchResultItem"><a href="/pages/discover/discover_tagSubject.html?tId=' + kv.id + '">' + kv.tagName + ' <i class="icon-arrowRight"></i></a></article>';
    },
    scoreDom:function(s,scoreNum){
        var score="";
        if(scoreNum<10){return ""}
        var num = parseInt(s);
        var flot =(s-num)*100+"%";
        if(num==0){
            score='<div class="al-resourceTypeBox" style="margin-bottom:7px;"><ul class="al-littleScoreStarBox"><li><b style="width:'+flot+'"></b></li><li></li><li></li><li></li><li></li></ul></div>';
        }else if(num==1){
            score='<div class="al-resourceTypeBox" style="margin-bottom:7px;"><ul class="al-littleScoreStarBox"><li><b></b></li><li><b style="width:'+flot+'"></b></li><li></li><li></li><li></li></ul></div>';
        }else if(num==2){
            score='<div class="al-resourceTypeBox" style="margin-bottom:7px;"><ul class="al-littleScoreStarBox"><li><b></b></li><li><b></b></li><li><b style="width:'+flot+'"></b></li><li></li><li></li></ul></div>';
        }else if(num==3){
            score='<div class="al-resourceTypeBox" style="margin-bottom:7px;"><ul class="al-littleScoreStarBox"><li><b></b></li><li><b></b></li><li><b></b></li><li><b style="width:'+flot+'"></b></li><li></li></ul></div>';
        }else if(num==4){
            score='<div class="al-resourceTypeBox" style="margin-bottom:7px;"><ul class="al-littleScoreStarBox"><li><b></b></li><li><b></b></li><li><b></b></li><li><b></b></li><li><b style="width:'+flot+'"></b></li></ul></div>';
        }else if(num==5){
            score='<div class="al-resourceTypeBox" style="margin-bottom:7px;"><ul class="al-littleScoreStarBox"><li><b></b></li><li><b></b></li><li><b></b></li><li><b></b></li><li><b></b></li></ul></div>';
        }
        return score;
    },
    itemTemplate: function(kv) {
	    var refType = this.refType;
        var t=this;
        return '<section class="al-contentPartModule">' +t.scoreDom(kv.score,kv.scoreNum)+
            '<section class="al-tableBox">' +
	        (function (kv) {
		        var html = "";
		        switch(refType){
			        case 1: desc="视频"; break;
			        case 2:
                        if(kv.tplPath==286){
                            desc="书籍";
                        }else{
                            desc="文章";
                        }
                        break;
			        case 4: desc="话题"; break;
			        case 7: desc="病例"; break;
                    case 17: desc="书籍"; break;
			        default: desc= "评论";
		        }
                //列表验证用户名和书籍名称
                var uNameOrBName="";
                if(kv.author&& $.trim(kv.author)){
                    if(kv.videoType&&(kv.videoType==17||kv.videoType==18||kv.videoType==19)){
                        uNameOrBName='<span class="al-contentAuthor bookNameIcon">'+kv.author+'</span>';
                    }else{
                        uNameOrBName='<span class="al-contentAuthor icon-contentAuthor">'+kv.author+'</span>';//icon-contentAuthor
                    }
                }else{
                    uNameOrBName="";
                }
		        switch(kv.resourceIsValid){
			        case 1:
				        html= '<article class="al-contentText">' +
					        '<a href="' + kv.refUrl + '" class="al-contentTitle '+(kv.tplPath==286?"ev_callAppBook":"")+'"'+(kv.tplPath==286?'bookId='+kv.bookId:"")+' ><span>' + (refType==4&&kv.title==""?"话题医起聊":kv.title) + '</span></a>' +
						        //'<p class="al-contentOtherMsg">'+
						        //'<span class="al-contentWatchedNum"><i class="icon-contentAuthor"></i>'+kv.author+'</span>'+
						        //'<span class="al-contentLikeNum"><i class="icon-likeNum"></i>'+kv.browseNum+'asdfasdf</span>'+
						        //'</p>'+
					        '<p class="al-contentOtherMsg">' +
                            (refType==17||kv.tplPath==286?"":uNameOrBName )+
					        '<span class="icon-contentWatchedNum">' + kv.browseNum.toWK() + '</span>' +
                            (refType==17||kv.tplPath==286?"":('<span class="icon-tagComment">' + kv.reviewNum.toWK() + '</span>' ))+
					        '</p>' +
						        //'<span class="al-contentDelete">x</span>'+
					        '</article>';
				        break;

			        case 0: html =
                        '<a href="' + kv.refUrl + '" class="al-contentTitle">'+
                        '<article class="al-contentText" style="color:#aaaaaa;"><span>该' + desc + '已被系统屏蔽</span></article>' + // class="al-commentShareContent"
                        '<p class="al-contentOtherMsg">' +
                        uNameOrBName +
                        '<span class="icon-contentWatchedNum">' + kv.browseNum.toWK() + '</span>' +
                        '<span class="icon-tagComment">' + kv.reviewNum.toWK() + '</span>' +
                        '</p></a>';
                        break;
                    case 2: html =
                        '<a href="' + kv.refUrl + '" class="al-contentTitle">'+
                        '<article class="al-contentText" style="color:#aaaaaa;"><span>该' + desc + '已被用户删除</span></article>' + // class="al-commentShareContent"
                        '<p class="al-contentOtherMsg">' +
                        uNameOrBName +
                        '<span class="icon-contentWatchedNum">' + kv.browseNum.toWK() + '</span>' +
                        '<span class="icon-tagComment">' + kv.reviewNum.toWK() + '</span>' +
                        '</p></a>';
                        break;
			        case 3: html = '<a href="' + kv.refUrl + '" class="al-contentTitle">'+
                        '<article class="al-contentText" style="color:#aaaaaa;"><span>该' + desc + '已被作者删除</span></article>' + // class="al-commentShareContent"
                        '<p class="al-contentOtherMsg">' +
                        uNameOrBName +
                        '<span class="icon-contentWatchedNum">' + kv.browseNum.toWK() + '</span>' +
                        '<span class="icon-tagComment">' + kv.reviewNum.toWK() + '</span>' +
                        '</p></a>';
                        break;
			        default: html= '';
		        }
		        return html;
	        })(kv) +

            (function(kv) {
                if (kv.refLogoUrl && kv.resourceIsValid!=3 && kv.resourceIsValid!=2 && kv.resourceIsValid!=0) {
                    return '<figure class="al-contentImgBox" '+(refType==17?'style="width:1.6rem;"':"")+'>' +
                        '<a href="' + kv.refUrl + '" class="'+(kv.refType==17||kv.tplPath==286?"ev_callAppBook":"")+'" '+(kv.tplPath==286?'bookId='+kv.bookId:"")+'>' +
                        '<img src="' + kv.refLogoUrl + '" alt="' + kv.title + '">' +
                        (function(playTime) {
                            if (playTime) {
                                return '<i class="al-videoPlayBtn">' +
                                    '<img src="//img50.allinmd.cn/pages/index/videoPlay_btn.png" alt="">' +
                                    '</i>' +
                                    '<span class="al-videoTime">' + playTime + '</span>';
                            } else {
                                return '';
                            }
                        })(kv.playTime) +
                        '</a>' +
                        '</figure>';
                } else {
                    return '';
                }
            })(kv) +
            '</section>' +
            '</section>'
    },
    endDataTemplate: function() {
        return '<section class="al-personalContributionOver">' +
            '<span>~</span>没有更多了<span>~</span>' +
            '</section>';
    },
    nullDataTemplate: function() {
        var picUrl = '';
        switch (this.type) {
            case "collection":
                picUrl = '//img50.allinmd.cn/pages/personal/no_collect.png';
                break;
            case "follow":
                switch (this.refType) {
                    case 7:
                        picUrl = '//img50.allinmd.cn/pages/personal/no_follow_case.png';
                        break;
                    case 4:
                        picUrl = '//img50.allinmd.cn/pages/personal/no_follow_topic.png';
                        break;
                    default:
                        picUrl = '//img50.allinmd.cn/pages/personal/no_follow_tags.png';
                }
                break;
            case "history":
                picUrl = '//img50.allinmd.cn/pages/personal/no_browsed.png';
                break;
            default:
        }
        return '<section class="al-noContentTips" style="background-color: #eff4f8;">' +
            '<figure>' +
            '<img src="' + picUrl + '" alt="暂无数据">' +
            '</figure>' +
            '</section>';
    },
    handleHistoryTemplate: function(list) {
        function when(date) {
            var Y_M_D_Arr = date.split(' ')[0].split('-');
            var nowDay = new Date().getDate();
            if (new Date().getFullYear() > parseInt(Y_M_D_Arr[0])) {
                return '更早'
            }
            if (new Date().getMonth() > parseInt(Y_M_D_Arr[1])) {
                return '更早'
            }
            if (nowDay === parseInt(Y_M_D_Arr[2])) {
                return '今天'
            }
            if (nowDay === parseInt(Y_M_D_Arr[2]) + 1) {
                return '昨天'
            }
            return '更早';
        }

        var wrapHtml = '',
            html = [];
        for (var x = 0; x < list.length; x++) {
            var kv = this.adapterData(list[x]);
            kv.openTime = when(kv.openTime);

            var date_Arr = [];
            if (html.length > 0) {
                for (var z = 0; z < html.length; z++) {
                    if (!existDate(kv.openTime, date_Arr)) {
                        date_Arr.push($.trim(html[z].find('header').text()));
                    };
                }
            }

            if (!existDate(kv.openTime, date_Arr)) {
                wrapHtml = this.historyGroupTemplate(kv.openTime);
                wrapHtml = $(wrapHtml);
                wrapHtml.append(this.historyItemTemplate(kv));
            } else {
                for (var x1 = 0; x1 < date_Arr.length; x1++) {
                    if (kv.openTime === date_Arr[x1]) {
                        $(html[x1]).append(this.historyItemTemplate(kv))
                    }
                }
            }

            html.push(wrapHtml);
        }

        return html;

        function existDate(date, date_Arr) {
            for (var x in date_Arr) {
                if (date_Arr[x] === date) return true;
            }
            return false;
        }
    },
    historyGroupTemplate: function(when) {
        return '<section class="al-recordList ev-groupHistory">' +
            '<header class="al-recordListTitle">' + when + ' </header>' +
            '</section>';
    },
    historyItemTemplate: function(kv) {
        return '<a href="' + kv.refUrl + '">' +
            '<article class="al-recordListItem">' +
            '<span class="al-recordListItemType">' + kv.browseType + '</span>' +
            '<article>' +
            '<span class="al-recordListItemContent">' + kv.title + '</span>' +
            '</article>' +
            '<i class="icon-arrowRight"></i>' +
            '</article>' +
            '</a>';
    },
    setListNav: function() {
        var _this = this;
        var url = M_CALL + 'customer/collection/getResourceNum/';
        var params = {};
        if (!_this.isSelf) { params.paramJson = $.toJSON({ customerId: getpara().cid }); }
        $.ajax({
            url: url,
            data: params,
            success: function(res) {
                if (!res || !res.responseObject.responseStatus || !res.responseObject.responseData || !res.responseObject.responseData.data_list) {
                    _this.$listNav.hide();
                    _this.$listContext.append(_this.nullDataTemplate());
                } else {
                    var data = res.responseObject.responseData.data_list;
                    if (data.caseNum == 0) { _this.$listNav.find('[data-role="case"]').attr("num",0).hide(); }
                    if (data.docNum == 0) { _this.$listNav.find('[data-role="doc"]').attr("num",0).hide(); }
                    if (data.reviewNum == 0) { _this.$listNav.find('[data-role="comment"]').attr("num",0).hide(); }
                    if (data.topicNum == 0) { _this.$listNav.find('[data-role="topic"]').attr("num",0).hide(); }
                    if (data.videoNum == 0) { _this.$listNav.find('[data-role="video"]').attr("num",0).hide(); }
                    if (data.ebookNum == 0) { _this.$listNav.find('[data-role="book"]').attr("num",0).hide(); }
                    if (data.courseNum == 0) { _this.$listNav.find('[data-role="course"]').attr("num",0).hide(); }
                    if (data.caseNum == 0 && data.docNum == 0 && data.reviewNum == 0 && data.topicNum == 0 && data.videoNum == 0&&data.ebookNum==0&&data.courseNum==0) {
                        _this.$listNav.hide();
                        _this.$listContext.append(_this.nullDataTemplate());
                    }
                    $.each(_this.$listNav.find(".al-personNavbarItem"),function(i,em){
                        if($(em).attr("num")!=0){
                            $(em).click();
                            return false;
                        }
                    });
                    if($('.al-personNavbarItem:visible').length>4){
                        var swiper = new Swiper('.swiper-container', {
                            slidesPerView: "auto",
                            freeMode:true
                        });
                    }

                }
            }
        });

    },
    // @method 已关注标签搜索
    // @author qiangkailiang 
    //      on 2016/09/22
    searchFollowTags: function() {
        var that = this,
            sTemplate = "";
        that.v1 = "";
        that.v2 = "";
        $(".ev-searchTag input").on("focus", function() {

            ti = setTimeout(function() {
                that.v2 = $(".ev-searchTag input").val();
                if (that.v1 != that.v2) {
                    var data = {
                        logoUseFlag: 3,
                        sortType: 2,
                        customerId: localStorage.getItem('userId'),
                        maxResult: 1000,
                        attUseFlag: 5,
                        followType: 61,
                        refName: $('.ev-searchTag input').val(),
                        firstResult: 0,
                        visitSiteId: 2
                    };
                    ajaxFollowList(data);
                }
            }, 500);
        });

        $(".ev-searchTag input").on("blur", function() {
            //clearInterval(ti);
            clearTimeout(ti);
        });
        var timer = null;
        var nowVal = '';
        var inputSelf;
        var flag = true;
        $(".ev-searchTag input").on('compositionstart',function(){
            flag = false;
        });
        $(".ev-searchTag input").on('compositionend',function(){
            flag = true;
        });
        $(".ev-searchTag input").on("change propertychange", function() {
            that.v2 = $(".ev-searchTag input").val();
            clearTimeout(timer);
            clearTimeout(ti);
            inputSelf = $(this);
            timer = setTimeout(function(){
                if (that.v1 != that.v2 && flag) {
                    var data = {
                        logoUseFlag: 3,
                        sortType: 2,
                        customerId: localStorage.getItem('userId'),
                        maxResult: 1000,
                        attUseFlag: 5,
                        followType: 61,
                        refName: $('.ev-searchTag input').val(),
                        firstResult: 0,
                        visitSiteId: 2
                    };
                    ajaxFollowList(data);
                }
            },500);

        });
        comm.inputFocus({
            focusCallback: function() {
                $(".ev-list").hide();
                $(".ev-searchList").show();
                $(".ev-searchTag input").addClass('focus');
                setTimeout(function(){
                    $(".al-searchCancel").css('display', 'inline-block');
                },200)

            },
            inputCallback: function() {
                $(".al-searchFocusMask").removeClass('al-searchFocusMaskShow');
                $('.ev-initList').hide();
                $('.ev-searchList').show();
                $(".icon-searchCancel").show();
                $(".ev-searchList").children().remove();

            },
            emptyCallback: function() {
                $(".ev-searchList").children().remove();
                $(".icon-searchCancel").hide();
            },
            clearCallback: function() {
                $(".ev-searchList").children().remove();
                $('.al-noContentTips').hide();
                $(".al-searchFocusMask").addClass('al-searchFocusMaskShow');
            },
            cancelCallback: function() {
                $(".ev-list").show();
                $(".ev-searchList").hide();
                $(".ev-searchTag input").removeClass('focus');
                $(".al-searchCancel").hide();
            }
        });


        function ajaxFollowList(data) {
            $.ajax({
                    url: '/mcall/customer/follow/resource/getMapList3/',
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        paramJson: $.toJSON(data)
                    },
                    beforeSend: function() {
                        comm.loading.show();
                    }
                })
                .done(function(data) {
                    $(".ev-searchList").children().remove();
                    var sList = data.responseObject.responseData.data_list;
                    if(sList){
                        $(sList).each(function(index, element) {
                            sTemplate = '<section class="al-searchResult">' +
                                '<a href="/pages/discover/discover_tagSubject.html?tId=' + element.resource.propertyId + '" class="al-searchResultItem">' + element.resource.propertyName + '</a>' +
                                '</section>';
                            $(".ev-searchList").append(sTemplate);
                        });
                    }else{
                        if($(".ev-searchList").find('.al-noContentTips').length==0){
                            $(".ev-searchList").append(that.nullDataTemplate());
                        }
                    }

                    that.v1 = that.v2;
                    comm.loading.hide();
                })
                .fail(function() {
                    console.log("XHR error...");
                });

        }
    }

};

$(function() {
    switch (location.pathname) {
        case "/pages/personal/personal_collection.html": //我的收藏
            personalMy.init({
                $listContext: $('.ev-list'),
                $listNav: $('.ev-collectionNav'),
                type: "collection",
                refType: 7
            });
            break;
        case "/pages/personal/personal_myFollow.html": //我的关注
            personalMy.init({
                $listContext: $('.ev-list'),
                $listNav: $('.ev-followNav'),
                type: "follow",
                refType: 7
            });
            break;
        case "/pages/personal/personal_browsed.html": //历史记录
            personalMy.init({
                $listContext: $('.ev-list'),
                type: "history"
            });
            break;
        default:
    }
    $('.ev_digHole').click(function(){
        comm.creatEvent({
            triggerType:'全站功能按钮点击',
            keyword:"返回",
            actionId:41,
            async:false
        });
    });
});
