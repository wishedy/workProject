/**
 * Created by zhangheng on 2016/8/25.
 *
 * <span class="al-contentAuthor" style="color:#3598db;border:1px solid #3598db;padding:0 5px;border-radius:1px;">手术视频</span>
 */
var allinmdH5Search = {};
$('.al-mainInner').css('paddingBottom',0);
allinmdH5Search.config = {
    'newAjaxing':false,
    "shareBtn":$(".al-scrollShareBtn"),
    "searchBox":$(".al-searchInputBar"),
    "searchInput":$(".al-searchInputBar input"),
    "searchpageSize":10,
    "lenovoPageSize":10,
    "navBox":$(".al-indexNavbar .al-indexNavbarItem"),
    "searchResultContainer":$(".al-searchResultContent"),
    "deletBtn":$(".al-searchResultContent[data-role='main'] .al-clearHistorySearch"),
    "theMoreBtn":$(".al-searchMoreUser"),
    "allBox":{
        "allPar":$(".al-searchResultContent[data-role='all']"),
        "allSource":$(".al-searchResultContent[data-role='all'] .al-content").last()
    },
    "historyBox":$(".al-searchResultContent[data-role='main'] .al-historySearchContent"),
    "historyContainer":$(".al-searchResultContent[data-role='main'] .al-searchItem").eq(1),
    "hotBox":$(".al-searchResultContent[data-role='main'] .al-hotSearchContent"),
    "hotContainer":$(".al-searchResultContent[data-role='main'] .al-searchItem").eq(0),
    "searchMethod":{
        "all":"/mcall/allsearch/searchAllNew/",
        "case":"/mcall/case/baseinfo/json_list/",
        "video":"/mcall/cms/video/json_list/",
        "meeting":"/mcall/conference/index/json_list/",
        "doctor":"/mcall/customer/unite/json_list/",
        "doc":"/mcall/cms/doc/json_list/",
        "topic":"/mcall/cms/topic/base/json_list/"
    },
    "history":{
        "requireHistory":"/mcall/allsearch/searchHistory/",
        "deletHistory":"/mcall/allsearch/updateKeyword/",
        "creatTxt":"/mcall/log/customer/keyword/createKeyword/",
    },
    "lenovoUrl":"/mcall/allsearch/searchPrompt/",
    "hot":"/mcall/allsearch/searchHot/",
    "searchVal":"",
    /*这个值是根据用户的登录状态确定的暂时设为空*/
    "userFlag":null,
    /*用户Id暂时置空*/
    "userId":TempCache.getItem("userId"),
    "vistedId":1,
    "nowIndexPage":"all",
    search:{
        all:null,case:null,video:null,topic:null,doc:null,doctor:null,meeting:null
    }
};
var _aC = allinmdH5Search.config;
allinmdH5Search.searchBegin = function(){
    //allinmdH5Search.initBoxIteams();
    $(".al-indexNavbar,.al-sortItems").show();
    $(".lenovoword").empty();
    var postData = allinmdH5Search.postData(_aC.nowIndexPage);
    var postUrl = _aC.searchMethod[_aC.nowIndexPage];
    comm.loading.show();
    _aC.shareBtn.hide();
    //allinmdH5Search.ajax(postUrl,postData,_aC.nowIndexPage=="all"?"POST":"GET",_aC.nowIndexPage);
    switch (_aC.nowIndexPage){//记录日志
        case 'all':
            $(".ev_box").attr("data-alcode-mod","461");
            _aC.search.all = allinmdH5Search.ajax(postUrl,postData,"POST",'all');
            getShare(0);//分享
            break;
        case 'case':
            $(".ev_box").attr("data-alcode-mod","555");
            _aC.search.case = allinmdH5Search.ajax(postUrl,postData,"get",'case');
            getShare(1);//分享
            break;
        case 'video':
            $(".ev_box").attr("data-alcode-mod","556");
            _aC.search.video = allinmdH5Search.ajax(postUrl,postData,"get",'video');
            getShare(2);//分享
            break;
        case 'meeting':
            $(".ev_box").attr("data-alcode-mod","557");
            _aC.search.meeting = allinmdH5Search.ajax(postUrl,postData,"get",'meeting');
            getShare(3);//分享
            break;
        case 'doctor':
            $(".ev_box").attr("data-alcode-mod","558");
            _aC.search.doctor = allinmdH5Search.ajax(postUrl,postData,"get",'doctor');
            getShare(4);//分享
            break;
        case 'doc':
            $(".ev_box").attr("data-alcode-mod","559");
            _aC.search.doc = allinmdH5Search.ajax(postUrl,postData,"get",'doc');
            getShare(5);//分享
            break;
        case 'topic':
            $(".ev_box").attr("data-alcode-mod","560");
            _aC.search.topic = allinmdH5Search.ajax(postUrl,postData,"get",'topic');
            getShare(6);//分享
            break;

    }
    document.title="搜索：［"+_aC.searchInput.val()+"］- 唯医,allinmd";
    $("meta[name=Keywords]").attr("content","［"+_aC.searchInput.val()+"］,［"+_aC.searchInput.val()+"］视频,［"+_aC.searchInput.val()+"］文章,病例,唯医,allinmd");
};
allinmdH5Search.ajax = function(url,data,method,whoajax,fn){
    $('.ev_recommendForYou').hide();
    $('.al-noContentTips').hide();
    $('.ev_box').html('').attr('scrollPagination','enabled');
    allinmdH5Search.ajaxRequest = $.ajax({
        url: url,
        data: data,
        type: method,
        cache: false,
        //timeout:10000,
        dataType: 'json',
        success: function (dat) {
            $('body').unbind('touchmove');
            if(dat&&dat.responseObject&&dat.responseObject.responseData){//&&!$.isEmptyObject(dat.responseObject.responseData)
                if(fn){
                    fn(dat);
                }else{
                    allinmdH5Search.dealData(dat,whoajax);
                }

            }else{
                allinmdH5Search.haveNothing();
                allinmdH5Search.sortSearchForbid();
                $('.ev-main').hide();
                $('.ev_box').attr('scrollPagination','disabled');
                comm.loading.hide();
            }
        },
        complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数
            if(status=='timeout'){//超时,status还有success,error等值的情况
                comm.loading.hide();
            }
        }
    });
    switch (whoajax){//记录日志
        case 'all':
            Log.createBrowse(32,'搜索全部页面',window.location.href+"?rand="+new Date().getTime()+"&keyword="+encodeURI($('.al-searchInputBar input').val()));
            break;
        case 'case':
            Log.createBrowse(61,'搜索病例页面',window.location.href+"?rand="+new Date().getTime()+"&keyword="+encodeURI($('.al-searchInputBar input').val()));
            break;
        case 'video':
            Log.createBrowse(58,'搜索视频页面',window.location.href+"?rand="+new Date().getTime()+"&keyword="+encodeURI($('.al-searchInputBar input').val()));
            break;
        case 'meeting':
            Log.createBrowse(63,'搜索会议页面',window.location.href+"?rand="+new Date().getTime()+"&keyword="+encodeURI($('.al-searchInputBar input').val()));
            break;
        case 'doctor':
            Log.createBrowse(62,'搜索医师页面',window.location.href+"?rand="+new Date().getTime()+"&keyword="+encodeURI($('.al-searchInputBar input').val()));
            break;
        case 'doc':
            Log.createBrowse(59,'搜索文库页面',window.location.href+"?rand="+new Date().getTime()+"&keyword="+encodeURI($('.al-searchInputBar input').val()));
            break;
        case 'topic':
            Log.createBrowse(60,'搜索话题页面',window.location.href+"?rand="+new Date().getTime()+"&keyword="+encodeURI($('.al-searchInputBar input').val()));
            break;
    }
    return whoajax;
};
allinmdH5Search.creatHistoryTxt = function(){
    var postData = allinmdH5Search.postData("creatHistoryTxt");
    var postUrl = _aC.history.creatTxt;
    allinmdH5Search.ajax(postUrl,postData,"post","creatHistoryTxt");
};
allinmdH5Search.dealHistoryTxt = function(data){
    //console.log(data);
}
allinmdH5Search.creatLenovo = function(data){
    $(".lenovoword").empty();
    if(data.responseObject&&data.responseObject.responseStatus){
        var str = '';
        var xhrData = data.responseObject.responseData.data_list;
        if (_aC.searchVal != "") {
            if(xhrData.length>0){
                $(".ev-lenovo").show();
                $(".ev-mainInner").hide();
                for (var i = 0; i < xhrData.length; i++) {
                    str+='<article class="al-searchResultItem lenovoword-iteam">'+ xhrData[i].propertyName +'</article>';
                }
                $(".ev-lenovo").html(str);
                $(".ev-lenovo .al-searchResultItem").each(function(index, ele) {
                    var input = _aC.searchVal,
                        place1 = $(ele).text().toLowerCase().indexOf(input.toLowerCase()),
                        replace1 = $(ele).text().splice(place1, 0, '<em>'),
                        result = replace1.splice(place1 + 4 + input.length, 0, '</em>');
                    $(ele).html(result);
                });
            }else{
                $(".ev-lenovo").empty().hide();
                $(".ev-mainInner").show();
            }

        }
        $(".lenovoword-iteam").each(function () {
            $(this).click(function () {
                $(".ev-lenovo").hide();
                $(".ev-mainInner").show();
                _aC.allBox.allPar.addClass('active');
                $(".al-indexNavbar li").removeClass("active");
                $(".al-indexNavbar li").eq(0).addClass("active");
                _aC.nowIndexPage = $(".active").attr("data-role");
                $(".al-searchResultContent").removeClass('active');
                $(".al-searchResultContent[data-role=all]").addClass('active');
                $(".lenovoword").empty();
                _aC.searchVal =$(this).text();
                _aC.searchInput.val($(this).text());
                allinmdH5Search.creatHistoryTxt();
                allinmdH5Search.searchBegin();
                return false;
            });
        });
    }else{
        $(".ev-lenovo").empty().hide();
    }

};
allinmdH5Search.postScrollData = function(method,searchType){
    var temp = {
        pageIndex: 1,
        pageSize: _aC.searchpageSize,
        searchParam: _aC.searchVal,
        logoUseFlag: 3,
        sortType:$('.al-sortItems li.sortActive').attr("searchSort"),
        useFlag: _aC.userFlag||2,//--登录传入2，不登录传入1
        searchType:searchType?1:2,         //searchType 1：模糊  2精确
        platformId:$('.platformSelect').attr('data-platformId'),
        sessionCustomerId:TempCache.getItem('userId')||""
    };
    var isData ={};
    switch(method) {
        case "all":
            isData = {
                attUseFlag: AttUseFlag.e,
                scene:1
            };
            break;
        case "case":
            isData = {
                attUseFlag: AttUseFlag.e,
                customerRole: 6,
                //sortType: 1,
                scene: 5,
                isValid:1
            };
            break;
        case "video":
            isData = {
                useFlag: userFlag.l,
                //sortType: 1,
                isValid:1
            };
            break;
        case "meeting":
            isData = {
                attUseFlag: AttUseFlag.e,
                //sortType: 1,
                isValid:1
            };
            break;
        case "doctor":
            isData = {
                customerRole: 6,
                searchType:1,
                //sortType: 2,
                isValid:1
            };
            break;
        case "doc":
            isData = {
                attUseFlag: AttUseFlag.e,
                //sortType: 2,
                isValid:1
            };
            break;
        case "topic":
            isData = {
                attUseFlag: AttUseFlag.e,
                //sortType: 2,
                isValid:1
            };
            break;
    }
    return $.extend({},temp,isData);
    //return isData;
};
allinmdH5Search.scrollPage = function (url,method) {
    /*数据盒子*/
    var pN=2;
   $('.ev_box').off("scroll").scrollPagination({
            /*请求地址*/
            'contentPage': url,
            'noParamJson': method == "all" ? 0 : 1,
            'contentData': $.extend(allinmdH5Search.postScrollData(method), {
                pageIndex: function () {
                    return pN++;
                }
            }),
            'scrollTarget': $(window),
            'heightOffset': 0,
            'delaytime': 0,
            'type': method == "all" ? "POST" : "GET",
            'beforeLoad': function () {
                comm.loading.show();
            },
            'afterLoad': function (elementsLoaded) {
                comm.loading.hide();
            },
            'loader': function (data) {
                if(method=='all'){
                    if (data.responseObject.responseData.resource_count==0) {
                        $('.ev_box').attr("scrollPagination", "disabled");
                        comm.loading.hide();
                        $('.ev_box').append('<footer class="al-searchResultStatus">' + '~没有更多了~' + '</footer>');
                        return false;
                    } else {
                        if ($.isEmptyObject(data.responseObject.responseData)) {
                            $('.ev_box').attr("scrollPagination", "disabled");
                            comm.loading.hide();
                            $('.ev_box').append('<footer class="al-searchResultStatus">' + '~没有更多了~' + '</footer>');
                            return false;
                        } else {
                            switch (method) {
                                case "all":
                                    allinmdH5Search.creatAll(data, false, "allResourceScroll");
                                    break;
                                case "case":
                                    allinmdH5Search.creatCase(data, false);
                                    break;
                                case "video":
                                    allinmdH5Search.creatVideo(data, false);
                                    break;
                                case "meeting":
                                    allinmdH5Search.creatMeeting(data, false);
                                    break;
                                case "doc":
                                    allinmdH5Search.creatDoc(data, false);
                                    break;
                                case "topic":
                                    allinmdH5Search.creatTopic(data, false);
                                    break;
                                case "doctor":
                                    allinmdH5Search.creatDoctor(data, false);
                                    break;
                                default:
                                    return;
                            }
                        }
                    }

                }else{
                    if ($.isEmptyObject(data)) {
                        $('.ev_box').attr("scrollPagination", "disabled");
                        comm.loading.hide();
                        $('.ev_box').append('<footer class="al-searchResultStatus">' + '~没有更多了~' + '</footer>');
                        return false;
                    } else {
                        if ($.isEmptyObject(data.responseObject.responseData)) {
                            $('.ev_box').attr("scrollPagination", "disabled");
                            comm.loading.hide();
                            $('.ev_box').append('<footer class="al-searchResultStatus">' + '~没有更多了~' + '</footer>');
                            return false;
                        } else {
                            switch (method) {
                                case "all":
                                    allinmdH5Search.creatAll(data, false, "allResourceScroll");
                                    break;
                                case "case":
                                    allinmdH5Search.creatCase(data, false);
                                    break;
                                case "video":
                                    allinmdH5Search.creatVideo(data, false);
                                    break;
                                case "meeting":
                                    allinmdH5Search.creatMeeting(data, false);
                                    break;
                                case "doc":
                                    allinmdH5Search.creatDoc(data, false);
                                    break;
                                case "topic":
                                    allinmdH5Search.creatTopic(data, false);
                                    break;
                                case "doctor":
                                    allinmdH5Search.creatDoctor(data, false);
                                    break;
                                default:
                                    return;
                            }
                        }
                    }
                }
            }

        });

};
function scoreDom(s,scoreNum){
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
}
allinmdH5Search.creatAll = function(data,appendOrhtml,allBoxScroll){
    if(allBoxScroll!="allResourceScroll"){
        $('.ev_docBox').hide();
        _aC.allBox.allSource.hide();
    }
    if(data.responseObject.responseStatus&&data.responseObject.responseData){
        var resList = data.responseObject.responseData.resource_list;
        var cusList = data.responseObject.responseData.customer_list;
        var cusCount = data.responseObject.responseData.customer_count||0;
        if(resList.length||cusList.length){
            switch (allBoxScroll){
                case "allResourceScroll":
                    var sourceStr = "";
                    if (resList) {
                        for (var m = 0; m < resList.length; m++) {
                            /*typeId  1-视频 2-文库  4-话题 7- 病例 ,3会议
                             */
                            var imgHtml = '';
                            var hasImgClass = '';
                            var _actTitle='';
                            if (resList[m].picUrl) {
                                if (resList[m].typeId == 1) {
                                    imgHtml = '<figure class="al-contentImgBox">' +
                                        '<a href="' + resList[m].resourceUrl + '">' +
                                        '<img src="' + resList[m].picUrl.split('|')[0] + '" alt="">' +
                                        '<i class="al-videoPlayBtn">' +
                                        '<img src="//img50.allinmd.cn/pages/index/videoPlay_btn.png" alt="">' +
                                        '</i>' +
                                        '<span class="al-videoTime">' + resList[m].playTime + '</span>' +
                                        '</a>' +
                                        '</figure>';
                                } else {
                                    imgHtml = '<figure class="al-contentImgBox">' +
                                        '<a href="' + resList[m].resourceUrl + '">' +
                                        '<img src="' + resList[m].picUrl.split('|')[0] + '" alt="">' +
                                        '</a>' +
                                        '</figure>';
                                }

                                hasImgClass = "";
                            } else {
                                imgHtml = "";
                                hasImgClass = "al-contentUpTitleDownImg";
                            }
                            if (resList[m].isShowActivityTag == 1){//活动标签
                                var _color = resList[m].activityTagColor;
                                _actTitle = '<span style="color:' + _color + ';border:1px solid ' + _color + ';padding:0 0.10667rem;margin-right: 0.26667rem;border-radius: 0.02667rem;">' + resList[m].activityTagName + '</span>';
                            }
                            //列表验证用户名和书籍名称
                            var uNameOrBName="";
                            if(resList[m].customerName&& $.trim(resList[m].customerName)){
                                if(resList[m].resourceSecondType&&(resList[m].resourceSecondType==17||resList[m].resourceSecondType==18||resList[m].resourceSecondType==19)){
                                    uNameOrBName='<span class="al-contentAuthor bookNameIcon">'+resList[m].customerName+'</span>';
                                }else{
                                    uNameOrBName='<span class="al-contentAuthor icon-contentAuthor">'+resList[m].customerName+'</span>';//icon-contentAuthor
                                }
                            }else{
                                uNameOrBName="";
                            }
                            if(resList[m].typeId==1){
                                sourceStr += '<section class="al-contentPartModule '+hasImgClass+'" data-all="all_video">' +scoreDom(resList[m].currentStarLevel,resList[m].currentScoreNum)+
                                    '<section class="al-tableBox">' +
                                    '<article class="al-contentText">' +
                                    '<a href="'+resList[m].resourceUrl+'" class="al-contentTitle"><span>'+resList[m].resourceName+'</span></a>' +
                                    '<p class="al-contentOtherMsg">' +
                                    (_actTitle?_actTitle:(resList[m].resourceSecondType==1?'<span class="al-contentAuthor" style="color:#3598db;border:1px solid #3598db;padding:0 5px;border-radius:1px;">手术视频</span>':""))+
                                    uNameOrBName +
                                    '<span class="icon-contentWatchedNum">'+resList[m].browseNum.toWK()+'</span>' +
                                    '</p>' +
                                    '</article>' +
                                    imgHtml+
                                    '</section>' +
                                    '</section>';
                            }else if(resList[m].typeId==2){
                                sourceStr += '<section class="al-contentPartModule '+hasImgClass+'" data-all="all_doc">' +scoreDom(resList[m].currentStarLevel,resList[m].currentScoreNum)+
                                    '<section class="al-tableBox">' +
                                    '<article class="al-contentText">' +
                                    '<a href="'+resList[m].resourceUrl+'" class="al-contentTitle"><span>'+resList[m].resourceName+'</span></a>' +
                                    '<p class="al-contentOtherMsg">' +_actTitle+
                                    uNameOrBName +
                                    '<span class="icon-contentWatchedNum">'+resList[m].browseNum.toWK()+'</span>' +
                                    '</p>' +
                                    '</article>' +
                                    imgHtml+
                                    '</section>' +
                                    '</section>';
                            }else if(resList[m].typeId==3){
                                sourceStr +='<section class="al-contentPartModule '+hasImgClass+'" data-all="all_meeting">' +
                                    '<article class="al-contentText">' +
                                        //'<a href="/pages/conference/meeting-place.html?conId='+resList[m].resourceId+'&conName='+resList[m].resourceName+'" class="al-contentTitle">' +
                                    '<a href="/pages/conference/meeting_detail.html?conId='+resList[m].resourceId+'" class="al-contentTitle">' +
                                    '<span>'+resList[m].resourceName+'</span>' +
                                    '</a>' +
                                    '<p class="al-contentOtherMsg">' +
                                    '<span class="al-contentSeminarTime icon-contentSeminarTime">'+comm.date.dateJoint(resList[m].startTime,resList[m].endTime,'/','-')+'</span>' +
                                    '<span class="icon-contentSeminarPlace">'+resList[m].conLocation+'</span>' +
                                    '</p></article></section>';
                            }else if(resList[m].typeId==4){
                                sourceStr += '<section class="al-contentPartModule '+hasImgClass+'" data-all="all_topic">' +
                                    '<section class="al-tableBox">' +
                                    '<article class="al-contentText">' +
                                    '<a href="'+resList[m].resourceUrl+'" class="al-contentTitle"><span>'+resList[m].resourceName+'</span></a>' +
                                    '<p class="al-contentOtherMsg">' +_actTitle+
                                    uNameOrBName +
                                    '<span class="icon-contentWatchedNum">'+resList[m].browseNum.toWK()+'</span>' +
                                    '</p>' +
                                    '</article>' +
                                    imgHtml+
                                    '</figure>' +
                                    '</section>' +
                                    '</section>';
                            }else{
                                sourceStr += '<section class="al-contentPartModule '+hasImgClass+'" data-all="all_case">' +scoreDom(resList[m].currentStarLevel,resList[m].currentScoreNum)+
                                    '<section class="al-tableBox">' +
                                    '<article class="al-contentText">' +
                                    '<a href="'+resList[m].resourceUrl+'" class="al-contentTitle"><span>'+resList[m].resourceName+'</span></a>' +
                                    '<p class="al-contentOtherMsg">' +_actTitle+
                                    uNameOrBName +
                                    '<span class="icon-contentWatchedNum">'+resList[m].browseNum.toWK()+'</span>' +
                                    '</p>' +
                                    '</article>' +
                                    imgHtml+
                                    '</section>' +
                                    '</section>';
                            }
                        }
                        _aC.historyContainer.hide(10);
                        _aC.hotContainer.hide(10);
                        if(appendOrhtml&&_aC.search.all!=null){
                            $('.ev_box').html(sourceStr).show();
                        }else{
                            _aC.search.all!=null&&$('.ev_box').append(sourceStr).show();
                        }
                        if(resList.length<10){
                            $('.ev_box').attr("scrollPagination", "disabled").append('<footer class="al-searchResultStatus">' + '~没有更多了~' + '</footer>');
                        }else{
                            $('.ev_box').attr("scrollPagination", "enabled");
                        }
                    }
                    break;
                case "justCreat":
                    var docstr = '';
                    var endNum = 2;
                    for (var t = 0; t < cusList.length; t++) {
                        if (t == endNum) {
                            break;
                        }

                        docstr += '<section class="al-doctorRecommendItem">' +
                            '<figure class="al-doctorRecommendImg">' +
                            '<figure class="al-doctorRecommendImg">' +
                            '<a href="'+cusList[t].customer_h5_page_url+'">' +
                            '<img src=' + cusList[t].customer_att.logoUrl + ' alt="">' +
                            '<i class="icon-newTips"></i>' +
                            '</a>' +
                            '</figure>' +
                            '</figure>' +
                            '<article class="al-doctorRecommendMsg">' +
                            '<a class="al-doctorRecommendName" href="'+cusList[t].customer_h5_page_url+'">' + cusList[t].customer_auth.lastName + cusList[t].customer_auth.firstName + '<i class="al-vipUser"></i></a>' +
                            '<span class="al-doctorRecommendJob">' + cusList[t].customer_auth.medicalTitleShow + '</span>' +
                            '<span class="al-doctorRecommendHospital">' + cusList[t].customer_auth.company + '</span>' +
                            '</article>' +
                            '</section>';

                    }
                    if(docstr!=""&&cusCount>2){
                        docstr += '<footer class="al-searchMoreUser">' +
                            '更多用户<i class="icon-searchMoreUser"></i>' +
                            '</footer>';
                        if(_aC.search.all!=null)$('.ev_docBox').html(docstr).show();
                    }

                    var sourceStr = "";
                    var _actTitle='';
                    if (resList) {

                        for (var m = 0; m < resList.length; m++) {
                            /*typeId  1-视频 2-文库  4-话题 7- 病例 3会议
                             */
                            var imgHtml='';
                            var hasImgClass='';
                            _actTitle=''
                            if(resList[m].picUrl){
                                if(resList[m].typeId==1){
                                    imgHtml='<figure class="al-contentImgBox">' +
                                        '<a href="'+resList[m].resourceUrl+'">' +
                                        '<img src="'+resList[m].picUrl.split('|')[0]+'" alt="">' +
                                        '<i class="al-videoPlayBtn">' +
                                        '<img src="//img50.allinmd.cn/pages/index/videoPlay_btn.png" alt="">' +
                                        '</i>' +
                                        '<span class="al-videoTime">'+resList[m].playTime+'</span>' +
                                        '</a>' +
                                        '</figure>';
                                }else{
                                    imgHtml='<figure class="al-contentImgBox">' +
                                        '<a href="'+resList[m].resourceUrl+'">' +
                                        '<img src="'+resList[m].picUrl.split('|')[0]+'" alt="">' +
                                        '</a>' +
                                        '</figure>';
                                }

                                hasImgClass="";
                            }else{
                                imgHtml="";
                                hasImgClass="al-contentUpTitleDownImg";
                            }
                            if (resList[m].isShowActivityTag == 1){//活动标签
                                var _color = resList[m].activityTagColor;
                                _actTitle = '<span style="color:' + _color + ';border:1px solid ' + _color + ';padding:0 0.10667rem;margin-right: 0.26667rem;border-radius: 0.02667rem;">' + resList[m].activityTagName + '</span>';
                            }
                            //列表验证用户名和书籍名称
                            var uNameOrBName="";
                            if(resList[m].customerName&& $.trim(resList[m].customerName)){
                                if(resList[m].resourceSecondType&&(resList[m].resourceSecondType==17||resList[m].resourceSecondType==18||resList[m].resourceSecondType==19)){
                                    uNameOrBName='<span class="al-contentAuthor bookNameIcon">'+resList[m].customerName+'</span>';
                                }else{
                                    uNameOrBName='<span class="al-contentAuthor icon-contentAuthor">'+resList[m].customerName+'</span>';//icon-contentAuthor
                                }
                            }else{
                                uNameOrBName="";
                            }
                            if(resList[m].typeId==1){
                                sourceStr += '<section class="al-contentPartModule '+hasImgClass+'" data-all="all_video">' +scoreDom(resList[m].currentStarLevel,resList[m].currentScoreNum)+
                                    '<section class="al-tableBox">' +
                                    '<article class="al-contentText">' +
                                    '<a href="'+resList[m].resourceUrl+'" class="al-contentTitle"><span>'+resList[m].resourceName+'</span></a>' +
                                    '<p class="al-contentOtherMsg">' +
                                    (_actTitle?_actTitle:(resList[m].resourceSecondType==1?'<span class="al-contentAuthor" style="color:#3598db;border:1px solid #3598db;padding:0 5px;border-radius:1px;">手术视频</span>':""))+//优先显示 活动标签
                                    uNameOrBName+
                                    '<span class="icon-contentWatchedNum">'+resList[m].browseNum.toWK()+'</span>' +
                                    '</p>' +
                                    '</article>' +
                                    imgHtml+
                                    '</section>' +
                                    '</section>';
                            }else if(resList[m].typeId==2){
                                sourceStr += '<section class="al-contentPartModule '+hasImgClass+'" data-all="all_doc">' +scoreDom(resList[m].currentStarLevel,resList[m].currentScoreNum)+
                                    '<section class="al-tableBox">' +
                                    '<article class="al-contentText">' +
                                    '<a href="'+resList[m].resourceUrl+'" class="al-contentTitle"><span>'+resList[m].resourceName+'</span></a>' +
                                    '<p class="al-contentOtherMsg">' +_actTitle+
                                    uNameOrBName+
                                    '<span class="icon-contentWatchedNum">'+resList[m].browseNum.toWK()+'</span>' +
                                    '</p>' +
                                    '</article>' +
                                    imgHtml+
                                    '</section>' +
                                    '</section>';
                            }else if(resList[m].typeId==3){
                                sourceStr +='<section class="al-contentPartModule al-contentUpTitleDownImg">' +
                                    '<article class="al-contentText">' +
                                        //'<a href="/pages/conference/meeting-place.html?conId='+resList[m].resourceId+'&conName='+resList[m].resourceName+'" class="al-contentTitle">' +
                                    '<a href="/pages/conference/meeting_detail.html?conId='+resList[m].resourceId+'" class="al-contentTitle">' +
                                    '<span>'+resList[m].resourceName+'</span>' +
                                    '</a>' +
                                    '<p class="al-contentOtherMsg">' +
                                    '<span class="al-contentSeminarTime icon-contentSeminarTime">'+comm.date.dateJoint(resList[m].startTime,resList[m].endTime,'/','-')+'</span>' +
                                    '<span class="icon-contentSeminarPlace">'+resList[m].conLocation+'</span>' +
                                    '</p></article></section>';
                            }else if(resList[m].typeId==4){
                                sourceStr += '<section class="al-contentPartModule '+hasImgClass+'" data-all="all_topic">' +
                                    '<section class="al-tableBox">' +
                                    '<article class="al-contentText">' +
                                    '<a href="'+resList[m].resourceUrl+'" class="al-contentTitle"><span>'+resList[m].resourceName+'</span></a>' +
                                    '<p class="al-contentOtherMsg">' +_actTitle+
                                    uNameOrBName+
                                    '<span class="icon-contentWatchedNum">'+resList[m].browseNum.toWK()+'</span>' +
                                    '</p>' +
                                    '</article>' +
                                    imgHtml+
                                    '</section>' +
                                    '</section>';
                            }else{
                                sourceStr += '<section class="al-contentPartModule '+hasImgClass+'" data-all="all_case">' +scoreDom(resList[m].currentStarLevel,resList[m].currentScoreNum)+
                                    '<section class="al-tableBox">' +
                                    '<article class="al-contentText">' +
                                    '<a href="'+resList[m].resourceUrl+'" class="al-contentTitle"><span>'+resList[m].resourceName+'</span></a>' +
                                    '<p class="al-contentOtherMsg">' +_actTitle+
                                    uNameOrBName+
                                    '<span class="icon-contentWatchedNum">'+resList[m].browseNum.toWK()+'</span>' +
                                    '</p>' +
                                    '</article>' +
                                    imgHtml+
                                    '</section>' +
                                    '</section>';
                            }
                        }
                        _aC.historyContainer.hide(10);
                        _aC.hotContainer.hide(10);
                        if(appendOrhtml&&_aC.search.all!=null){
                            $('.ev_box').html(sourceStr).show();
                        }else{
                            if(_aC.search.all!=null)$('.ev_box').append(sourceStr).show();
                        }
                    }
                    break;
                default:
                    var docstr = '';
                    var endNum = 2;

                    for (var t = 0; t < cusList.length; t++) {
                        if (t == endNum) {
                            break;
                        }
                        var _cid = cusList[t].customer_baseinfo.customerId;
                        docstr += '<section class="al-doctorRecommendItem">' +
                            '<figure class="al-doctorRecommendImg">' +
                            '<figure class="al-doctorRecommendImg">' +
                            '<a href="'+(_cid&&_cid!=0?'/pages/personal/others_contribution.html?cid='+_cid:"javascript:;")+'">' +
                            '<img src=' + cusList[t].customer_att.logoUrl + ' alt="">' +
                            '</a>' +
                            '</figure>' +
                            '</figure>' +
                            '<article class="al-doctorRecommendMsg">' +
                            '<a class="al-doctorRecommendName" href="'+(_cid&&_cid!=0?'/pages/personal/others_contribution.html?cid='+_cid:"javascript:;")+'">' + cusList[t].customer_auth.lastName + cusList[t].customer_auth.firstName + '<i class="al-vipUser"></i></a>' +
                            '<span class="al-doctorRecommendJob">' + cusList[t].customer_auth.medicalTitleShow + '</span>' +
                            '<span class="al-doctorRecommendHospital">' + cusList[t].customer_auth.company + '</span>' +
                            '</article>' +
                            '</section>';

                    }
                    if(docstr!=""&&cusCount>2) {
                        docstr += '<footer class="al-searchMoreUser">' +
                            '更多用户<i class="icon-searchMoreUser"></i>' +
                            '</footer>';
                        if(_aC.search.all!=null)$('.ev_docBox').html(docstr).show();
                    }else if(docstr!=""){
                        if(_aC.search.all!=null)$('.ev_docBox').html(docstr).show();
                    }

                    var sourceStr = "";
                    if (resList) {

                        for (var m = 0; m < resList.length; m++) {
                            /*typeId  1-视频 2-文库  4-话题 7- 病例
                             */
                            var imgHtml='';
                            var hasImgClass='';
                            var _actTitle="";
                            if(resList[m].picUrl){//有图
                                if(resList[m].typeId==1){
                                    imgHtml='<figure class="al-contentImgBox">' +
                                        '<a href="'+resList[m].resourceUrl+'">' +
                                        '<img src="'+resList[m].picUrl.split('|')[0]+'" alt="">' +
                                        '<i class="al-videoPlayBtn">' +
                                        '<img src="//img50.allinmd.cn/pages/index/videoPlay_btn.png" alt="">' +
                                        '</i>' +
                                        '<span class="al-videoTime">'+resList[m].playTime+'</span>' +
                                        '</a>' +
                                        '</figure>';
                                }else{//无图
                                    imgHtml='<figure class="al-contentImgBox">' +
                                        '<a href="'+resList[m].resourceUrl+'">' +
                                        '<img src="'+resList[m].picUrl.split('|')[0]+'" alt="">' +
                                        '</a>' +
                                        '</figure>';
                                }

                                hasImgClass="";
                            }else{
                                imgHtml="";
                                hasImgClass="al-contentUpTitleDownImg";
                            }
                            if (resList[m].isShowActivityTag == 1){//活动标签
                                var _color = resList[m].activityTagColor;
                                _actTitle = '<span style="color:' + _color + ';border:1px solid ' + _color + ';padding:0 0.10667rem;margin-right: 0.26667rem;border-radius: 0.02667rem;">' + resList[m].activityTagName + '</span>';
                            }
                            //列表验证用户名和书籍名称
                            var uNameOrBName="";
                            if(resList[m].customerName&& $.trim(resList[m].customerName)){
                                if(resList[m].resourceSecondType&&(resList[m].resourceSecondType==17||resList[m].resourceSecondType==18||resList[m].resourceSecondType==19)){
                                    uNameOrBName='<span class="al-contentAuthor bookNameIcon">'+resList[m].customerName+'</span>';
                                }else{
                                    uNameOrBName='<span class="al-contentAuthor icon-contentAuthor">'+resList[m].customerName+'</span>';//icon-contentAuthor
                                }
                            }else{
                                uNameOrBName="";
                            }
                            if(resList[m].typeId==1){
                                sourceStr += '<section class="al-contentPartModule '+hasImgClass+'" data-all="all_video">' +scoreDom(resList[m].currentStarLevel,resList[m].currentScoreNum)+
                                    '<section class="al-tableBox">' +
                                    '<article class="al-contentText">' +
                                    '<a href="'+resList[m].resourceUrl+'" class="al-contentTitle"><span>'+resList[m].resourceName+'</span></a>' +
                                    '<p class="al-contentOtherMsg">' +
                                    (_actTitle?_actTitle:(resList[m].resourceSecondType==1?'<span class="al-contentAuthor" style="color:#3598db;border:1px solid #3598db;padding:0 5px;border-radius:1px;">手术视频</span>':""))+
                                    uNameOrBName +
                                    '<span class="icon-contentWatchedNum">'+resList[m].browseNum.toWK()+'</span>' +
                                    '</p>' +
                                    '</article>' +
                                    imgHtml +
                                    '</section>' +
                                    '</section>';
                            }else if(resList[m].typeId==2){
                                sourceStr += '<section class="al-contentPartModule '+hasImgClass+'" data-all="all_doc">' +scoreDom(resList[m].currentStarLevel,resList[m].currentScoreNum)+
                                    '<section class="al-tableBox">' +
                                    '<article class="al-contentText">' +
                                    '<a href="'+resList[m].resourceUrl+'" class="al-contentTitle"><span>'+resList[m].resourceName+'</span></a>' +
                                    '<p class="al-contentOtherMsg">' +_actTitle+
                                    uNameOrBName +
                                    '<span class="icon-contentWatchedNum">'+resList[m].browseNum.toWK()+'</span>' +
                                    '</p>' +
                                    '</article>' +
                                    imgHtml +
                                    '</section>' +
                                    '</section>';
                            }else if(resList[m].typeId==3){
                                sourceStr +='<section class="al-contentPartModule al-contentUpTitleDownImg">' +
                                    '<article class="al-contentText">' +
                                        //'<a href="/pages/conference/meeting-place.html?conId='+resList[m].resourceId+'&conName='+resList[m].resourceName+'" class="al-contentTitle">' +
                                    '<a href="/pages/conference/meeting_detail.html?conId='+resList[m].resourceId+'" class="al-contentTitle">' +
                                    '<span>'+resList[m].resourceName+'</span>' +
                                    '</a>' +
                                    '<p class="al-contentOtherMsg">' +
                                    '<span class="al-contentSeminarTime icon-contentSeminarTime">'+comm.date.dateJoint(resList[m].startTime,resList[m].endTime,'/','-')+'</span>' +
                                    '<span class="icon-contentSeminarPlace">'+resList[m].conLocation+'</span>' +
                                    '</p></article></section>';
                            }else if(resList[m].typeId==4){
                                sourceStr += '<section class="al-contentPartModule '+hasImgClass+'" data-all="all_topic">' +
                                    '<section class="al-tableBox">' +
                                    '<article class="al-contentText">' +
                                    '<a href="'+resList[m].resourceUrl+'" class="al-contentTitle"><span>'+resList[m].resourceName+'</span></a>' +
                                    '<p class="al-contentOtherMsg">' +_actTitle+
                                    uNameOrBName +
                                    '<span class="icon-contentWatchedNum">'+resList[m].browseNum.toWK()+'</span>' +
                                    '</p>' +
                                    '</article>' +
                                    imgHtml +
                                    '</section>' +
                                    '</section>';
                            }else{
                                sourceStr += '<section class="al-contentPartModule '+hasImgClass+'" data-all="all_case">' +scoreDom(resList[m].currentStarLevel,resList[m].currentScoreNum)+
                                    '<section class="al-tableBox">' +
                                    '<article class="al-contentText">' +
                                    '<a href="'+resList[m].resourceUrl+'" class="al-contentTitle"><span>'+resList[m].resourceName+'</span></a>' +
                                    '<p class="al-contentOtherMsg">' +_actTitle+
                                    uNameOrBName +
                                    '<span class="icon-contentWatchedNum">'+resList[m].browseNum.toWK()+'</span>' +
                                    '</p>' +
                                    '</article>' +
                                    imgHtml +
                                    '</section>' +
                                    '</section>';
                            }
                        }
                        _aC.historyContainer.hide(10);
                        _aC.hotContainer.hide(10);
                        if(appendOrhtml&&_aC.search.all!=null){
                            $('.ev_box').html(sourceStr).show();
                        }else{
                            if(_aC.search.all!=null)$('.ev_box').append(sourceStr).show();
                        }
                        if(resList.length<10){
                            $('.ev_box').attr("scrollPagination", "disabled").append('<footer class="al-searchResultStatus">' + '~没有更多了~' + '</footer>');
                        }else{
                            $('.ev_box').attr("scrollPagination", "enabled");
                        }
                    }
            }
            allinmdH5Search.theMoreFriend();

            $('.al-noContentTips').hide();
        }else{
            $('.al-noContentTips').show();
            $('.al-sortItems li').click(function(){
                return false;
            });
            $('.ev-noContentRecommend').attr('scrollPagination','disabled');
        }

    }else{
        $('.al-noContentTips').show();
        $('.al-sortItems li').click(function(){
            return false;
        });
        $('.ev-noContentRecommend').attr('scrollPagination','disabled');
    }
};
allinmdH5Search.theMoreFriend = function(){
    $(".al-searchMoreUser").click(function(){
        _aC.navBox.eq(4).click();
    });
};
allinmdH5Search.creatCase = function(data,appendOrhtml){
    if(data.responseObject.responseStatus&&data.responseObject.responseData&&!$.isEmptyObject(data.responseObject.responseData)){
        var str = '';
        var xhrData = data.responseObject.responseData.data_list;
        var len = xhrData.length;
        var _actTitle='';
        for(var i = 0;i<len;i++){
            _actTitle='';
            if(xhrData[i].isShowActivityTag==1){
                var _color = xhrData[i].activityTagColor;
                _actTitle = '<span style="color:'+_color+';border:1px solid '+_color+';padding:0 0.10667rem;margin-right: 0.26667rem;border-radius: 0.02667rem;">'+xhrData[i].activityTagName+'</span>';
            }
            //列表验证用户名和书籍名称
            var uNameOrBName="";
            if(xhrData[i].case_customer_auth.lastName || xhrData[i].case_customer_auth.firstName){
                uNameOrBName='<span class="al-contentAuthor icon-contentAuthor">'+xhrData[i].case_customer_auth.lastName +""+ xhrData[i].case_customer_auth.firstName +'</span>';//icon-contentAuthor
            }else{
                uNameOrBName="";
            }
            str+='<section class="al-contentPartModule '+(xhrData[i].case_attachment.attUrl?'':'al-contentUpTitleDownImg')+'" data-all="all_case">' +scoreDom(xhrData[i].currentStarLevel?xhrData[i].currentStarLevel.currentStarLevel:undefined,xhrData[i].currentStarLevel?xhrData[i].currentStarLevel.currentScoreNum:0)+
                '<section class="al-tableBox">' +
                '<article class="al-contentText">' +
                '<a href="'+xhrData[i].case_baseinfo.webStoragePath+'" class="al-contentTitle"><span>'+xhrData[i].case_baseinfo.caseName+'</span></a>' +
                '<p class="al-contentOtherMsg">' +_actTitle+
                uNameOrBName +
                '<span class="icon-contentWatchedNum">'+xhrData[i].case_baseinfo.browseNum.toWK()+'</span>' +
                '</p>' +
                '</article>' +
                (xhrData[i].case_attachment.attUrl?'<figure class="al-contentImgBox">' +
                '<a href="'+xhrData[i].case_baseinfo.webStoragePath+'">' +
                '<img src="'+xhrData[i].case_attachment.attUrl+'" alt="">' +
                '</a>' +
                '</figure>':'') +
                '</section>' +
                '</section>';
        }
        if(appendOrhtml&&_aC.search.case!=null){
            $('.ev_box').html(str);
        }else{
            $('.ev_box').append(str);
        }

        if($('.ev_box>section').length== data.responseObject.responseData.total_count){
            $('.ev_box').attr("scrollPagination", "disabled");
        }
        if(len<10){
            $('.ev_box').attr("scrollPagination", "disabled").append('<footer class="al-searchResultStatus">' + '~没有更多了~' + '</footer>');
        }else{
            $('.ev_box').attr("scrollPagination", "enabled");
        }
        $('.al-noContentTips').hide();
    }else{
        $('.al-noContentTips').show().removeClass('recommend');
        $('.ev_box').attr("scrollPagination", "disabled");
        $('.al-sortItems li').click(function(){
            return false;
        });
        $('.ev-noContentRecommend').attr('scrollPagination','disabled');
    }

};
allinmdH5Search.creatVideo = function(data,appendOrhtml){
    if(data.responseObject.responseStatus&&data.responseObject.responseData&&!$.isEmptyObject(data.responseObject.responseData)){
        var str = '';
        var xhrData = data.responseObject.responseData.data_list;
        var len = xhrData.length;
        var _actTitle='';
        for(var i = 0;i<len;i++){
            _actTitle='';
            if(xhrData[i].isShowActivityTag==1){
                var _color = xhrData[i].activityTagColor;
                _actTitle = '<span style="color:'+_color+';border:1px solid '+_color+';padding:0 0.10667rem;margin-right: 0.26667rem;border-radius: 0.02667rem;">'+xhrData[i].activityTagName+'</span>';
            }
            //列表验证用户名和书籍名称
            var uNameOrBName="";
            if(xhrData[i].cms_video_customer_auth.lastName || xhrData[i].cms_video_customer_auth.firstName){
                if(xhrData[i].cms_video.videoType&&(xhrData[i].cms_video.videoType==17||xhrData[i].cms_video.videoType==18||xhrData[i].cms_video.videoType==19)){
                    uNameOrBName='<span class="al-contentAuthor bookNameIcon">'+xhrData[i].cms_video_customer_auth.lastName + xhrData[i].cms_video_customer_auth.firstName+""+'</span>';
                }else{
                    uNameOrBName='<span class="al-contentAuthor icon-contentAuthor">'+xhrData[i].cms_video_customer_auth.lastName + xhrData[i].cms_video_customer_auth.firstName+""+'</span>';//icon-contentAuthor
                }
            }else{
                uNameOrBName="";
            }
            str+='<section class="al-contentPartModule '+(xhrData[i].cms_video_attachment_logo.videoAttUrl?'':'al-contentUpTitleDownImg')+'" data-all="all_video">' +scoreDom(xhrData[i].currentStarLevel?xhrData[i].currentStarLevel.currentStarLevel:undefined,xhrData[i].currentStarLevel?xhrData[i].currentStarLevel.currentScoreNum:0)+
                '<section class="al-tableBox">' +
                '<article class="al-contentText">' +
                '<a href="'+xhrData[i].cms_video.webStoragePath+'" class="al-contentTitle"><span>'+xhrData[i].cms_video.videoName+'</span></a>' +
                '<p class="al-contentOtherMsg">' +
                (_actTitle?_actTitle:(xhrData[i].cms_video.videoType==1?'<span class="al-contentAuthor" style="color:#3598db;border:1px solid #3598db;padding:0 5px;border-radius:1px;">手术视频</span>':""))+
                uNameOrBName +
                '<span class="icon-contentWatchedNum">'+xhrData[i].cms_video.playNum.toWK()+'</span>' +
                '</p>' +
                '</article>' +
                (xhrData[i].cms_video_attachment_logo.videoAttUrl?'<figure class="al-contentImgBox">' +
                '<a href="'+xhrData[i].cms_video.webStoragePath+'">' +
                '<img src="'+xhrData[i].cms_video_attachment_logo.videoAttUrl+'" alt="">' +
                '<i class="al-videoPlayBtn">' +
                '<img src="//img50.allinmd.cn/pages/index/videoPlay_btn.png" alt="">' +
                '</i>' +
                '<span class="al-videoTime">'+xhrData[i].cms_video.playTime+'</span>' +
                '</a>' +
                '</figure>':'') +
                '</section>' +
                '</section>';
        }

        if(appendOrhtml&&_aC.search.video!=null){
            $('.ev_box').html(str);
        }else{
            if(_aC.search.video!=null)$('.ev_box').append(str);
        }
        if($('.ev_box>section').length== data.responseObject.responseData.total_count){
            $('.ev_box').attr("scrollPagination", "disabled");
        }
        if(len<10){
            $('.ev_box').attr("scrollPagination", "disabled").append('<footer class="al-searchResultStatus">' + '~没有更多了~' + '</footer>');
        }else{
            $('.ev_box').attr("scrollPagination", "enabled");
        }
        $('.al-noContentTips').hide();
        $('.ev_box').show();
    }else{
        $('.al-noContentTips').show().removeClass('recommend');
        $('.ev_box').attr("scrollPagination", "disabled");
        $('.al-sortItems li').click(function(){
            return false;
        });
        $('.ev-noContentRecommend').attr('scrollPagination','disabled');
    }

};
allinmdH5Search.creatMeeting = function(data,appendOrhtml){
    if(data.responseObject.responseStatus&&data.responseObject.responseData&&!$.isEmptyObject(data.responseObject.responseData)){
        var str = '';
        var xhrData = data.responseObject.responseData.data_list;
        var len = xhrData.length;
        for(var i = 0;i<len;i++){
            str+='<section class="al-contentPartModule al-contentUpTitleDownImg">' +
                '<article class="al-contentText">' +
                //'<a href="/pages/conference/meeting-place.html?conId='+xhrData[i].conId+'&conName='+xhrData[i].conName+'" class="al-contentTitle"><span>'+xhrData[i].conName+'</span></a>' +
                '<a href="/pages/conference/meeting_detail.html?conId='+xhrData[i].conId+'" class="al-contentTitle"><span>'+xhrData[i].conName+'</span></a>' +
                '<p class="al-contentOtherMsg">' +
                '<span class="al-contentSeminarTime icon-contentSeminarTime">'+comm.date.dateJoint(xhrData[i].startTime, xhrData[i].endTime,"/",'-')+'</span>' +
                '<span class="icon-contentSeminarPlace">'+xhrData[i].country + "•" + xhrData[i].city+'</span>' +
                '</p>' +
                '</article>' +
                '</section>';
        }

        if(appendOrhtml&&_aC.search.meeting!=null){
            $('.ev_box').html(str);
        }else{
            $('.ev_box').append(str);
        }
        if(len<10){
            $('.ev_box').attr("scrollPagination", "disabled").append('<footer class="al-searchResultStatus">' + '~没有更多了~' + '</footer>');
        }else{
            $('.ev_box').attr("scrollPagination", "enabled");
        }
        $('.ev_box').show();
        $('.al-noContentTips').hide();
        if($('.ev_box>section').length== data.responseObject.responseData.total_count){
            $('.ev_box').attr("scrollPagination", "disabled");
        }
    }else{
        $('.al-noContentTips').show().removeClass('recommend');
        $('.ev_box').attr("scrollPagination", "disabled");
        $('.al-sortItems li').click(function(){
            return false;
        });
        $('.ev-noContentRecommend').attr('scrollPagination','disabled');
    }

};
allinmdH5Search.creatDoc = function(data,appendOrhtml){
    if(data.responseObject.responseStatus&&data.responseObject.responseData&&!$.isEmptyObject(data.responseObject.responseData)){
        var str = '';
        var xhrData = data.responseObject.responseData.data_list;
        var len = xhrData.length;
        var _actTitle='';
        for(var i = 0;i<len;i++){
            _actTitle='';
            if(xhrData[i].isShowActivityTag==1){
                var _color = xhrData[i].activityTagColor;
                _actTitle = '<span style="color:'+_color+';border:1px solid '+_color+';padding:0 0.10667rem;margin-right: 0.26667rem;border-radius: 0.02667rem;">'+xhrData[i].activityTagName+'</span>';
            }
            //列表验证用户名和书籍名称
            var uNameOrBName="";
            if(xhrData[i].customer_auth.lastName||xhrData[i].customer_auth.firstName){
                if(xhrData[i].customer_doc.docType&&(xhrData[i].customer_doc.docType==17||xhrData[i].customer_doc.docType==18||xhrData[i].customer_doc.docType==19)){
                    uNameOrBName='<span class="al-contentAuthor bookNameIcon">'+xhrData[i].customer_auth.lastName+xhrData[i].customer_auth.firstName+'</span>';
                }else{
                    uNameOrBName='<span class="al-contentAuthor icon-contentAuthor">'+xhrData[i].customer_auth.lastName+xhrData[i].customer_auth.firstName+'</span>';//icon-contentAuthor
                }
            }else{
                uNameOrBName="";
            }
            str+='<section class="al-contentPartModule '+(xhrData[i].cms_doc_attachment_logo.docAttUrl?'':'al-contentUpTitleDownImg')+'" data-all="all_doc">' +scoreDom(xhrData[i].currentStarLevel?xhrData[i].currentStarLevel.currentStarLevel:undefined,xhrData[i].currentStarLevel?xhrData[i].currentStarLevel.currentScoreNum:0)+
                '<section class="al-tableBox">' +
                '<article class="al-contentText">' +
                '<a href="'+xhrData[i].customer_doc.webStoragePath+'" class="al-contentTitle"><span>'+xhrData[i].customer_doc.docName+'</span></a>' +
                '<p class="al-contentOtherMsg">' +_actTitle+
                uNameOrBName +
                '<span class="icon-contentWatchedNum">'+xhrData[i].customer_doc.browseNum.toWK()+'</span>' +
                '</p>' +
                '</article>' +
                (xhrData[i].cms_doc_attachment_logo.docAttUrl?'<figure class="al-contentImgBox">' +
                '<a href="'+xhrData[i].customer_doc.webStoragePath+'">' +
                '<img src="'+xhrData[i].cms_doc_attachment_logo.docAttUrl+'" alt="">' +
                '</a>' +
                '</figure>':'') +
                '</section>'+
                '</section>';
        }
        if(appendOrhtml&&_aC.search.doc!=null){
            $('.ev_box').html(str);
        }else{
            $('.ev_box').append(str);
        }
        if(len<10){
            $('.ev_box').attr("scrollPagination", "disabled").append('<footer class="al-searchResultStatus">' + '~没有更多了~' + '</footer>');
        }else{
            $('.ev_box').attr("scrollPagination", "enabled");
        }
        $('.ev_box').show();
        if($('.ev_box>section').length== data.responseObject.responseData.total_count){
            $('.ev_box').attr("scrollPagination", "disabled");
        }
        $('.al-noContentTips').hide();
    }else{
        $('.al-noContentTips').show().removeClass('recommend');
        $('.ev_box').attr("scrollPagination", "disabled");
        $('.al-sortItems li').click(function(){
            return false;
        })
        $('.ev-noContentRecommend').attr('scrollPagination','disabled');
    }

};
allinmdH5Search.creatTopic = function(data,appendOrhtml){
    if(data.responseObject.responseStatus&&data.responseObject.responseData&&!$.isEmptyObject(data.responseObject.responseData)){
        var str = '';
        var xhrData = data.responseObject.responseData.data_list;
        var len = xhrData.length;
        var _actTitle='';
        for(var i = 0;i<len;i++){
            _actTitle='';
            if(xhrData[i].isShowActivityTag==1){
                var _color = xhrData[i].activityTagColor;
                _actTitle = '<span style="color:'+_color+';border:1px solid '+_color+';padding:0 0.10667rem;margin-right: 0.26667rem;border-radius: 0.02667rem;">'+xhrData[i].activityTagName+'</span>';
            }
            //列表验证用户名和书籍名称
            var uNameOrBName="";
            if(xhrData[i].cms_topic_customer_auth.lastName || xhrData[i].cms_topic_customer_auth.firstName){
                uNameOrBName='<span class="al-contentAuthor icon-contentAuthor">'+xhrData[i].cms_topic_customer_auth.lastName +""+ xhrData[i].cms_topic_customer_auth.firstName +'</span>';//icon-contentAuthor
            }else{
                uNameOrBName="";
            }
            str+='<section class="al-contentPartModule '+(xhrData[i].cms_topic_attachment.topicAttUrl?'':'al-contentUpTitleDownImg')+'" data-all="all_topic">' +
                '<section class="al-tableBox">' +
                '<article class="al-contentText">' +
                '<a href="'+xhrData[i].cms_topic.webStoragePath+'" class="al-contentTitle"><span>'+xhrData[i].cms_topic.topicName+'</span></a>' +
                '<p class="al-contentOtherMsg">' +_actTitle+
                uNameOrBName +
                '<span class="icon-contentWatchedNum">'+xhrData[i].cms_topic.browseNum.toWK()+'</span>' +
                '</p>' +
                '</article>' +
                (xhrData[i].cms_topic_attachment.topicAttUrl?'<figure class="al-contentImgBox">' +
                '<a href="'+xhrData[i].cms_topic.webStoragePath+'">' +
                '<img src="'+xhrData[i].cms_topic_attachment.topicAttUrl+'" alt="">' +
                '</a>' +
                '</figure>':'') +
                '</section>'+
                '</section>';
        }
        if(appendOrhtml&&_aC.search.topic!=null){
            $('.ev_box').html(str);
        }else{
            $('.ev_box').append(str);
        }
        if(len<10){
            $('.ev_box').attr("scrollPagination", "disabled").append('<footer class="al-searchResultStatus">' + '~没有更多了~' + '</footer>');
        }else{
            $('.ev_box').attr("scrollPagination", "enabled");
        }
        if($('.ev_box>section').length== data.responseObject.responseData.total_count){
            $('.ev_box').attr("scrollPagination", "disabled");
        }
        $('.al-noContentTips').hide();
    }else{
        $('.al-noContentTips').show().removeClass('recommend');
        $('.ev_box').attr("scrollPagination", "disabled");
        $('.al-sortItems li').click(function(){
            return false;
        });
        $('.ev-noContentRecommend').attr('scrollPagination','disabled');
    }

};
allinmdH5Search.creatDoctor = function(xhdata,appendOrhtml){
    if(xhdata.responseObject.responseStatus&&xhdata.responseObject.responseData&&!$.isEmptyObject(xhdata.responseObject.responseData)){
        var data = xhdata.responseObject.responseData.data_list;
        var arrHT = [];
        if (data && data.length > 0) {
            $.each(data, function (i, val) {
                var logo;
                var auth;
                var base;
                var fans;
                var statistic;
                if (val.customer_att) {
                    logo = val.customer_att;
                }
                if (val.customer_auth) {
                    auth = val.customer_auth;
                }
                if (val.customer_baseinfo) {
                    base = val.customer_baseinfo;
                }
                if (val.customer_statistic) {
                    statistic = val.customer_statistic;
                }
                fans = val.customer_fans ? val.customer_fans : val.customer_follow_people;
                name = auth.lastName ? auth.lastName + auth.firstName : "";
                medicalTitle = auth.medicalTitleShow;//auth.medicalTitle?comm.strHandle.cutDoctorTitle(comm.cutLine(auth.medicalTitle,"_",",")):"";
                company = auth.company ? comm.getStrLen(auth.company, 22) : "";

                arrHT.push(module.listTemplate({tempName: "userList"})({
                    cid: base.customerId,
                    customerId: TempCache.getItem("userId"),
                    userName: name,
                    logoUrl: logo.logoUrl,
                    state: auth.state,
                    medicalTitle: medicalTitle,
                    company: company,
                    relationship: fans.relationship
                }));
            });
            if($('.ev_box>section').length== xhdata.responseObject.responseData.total_count){
                $('.ev_box').attr('scrollPagination','disabled');
            }
        }
        if(appendOrhtml&&_aC.search.doctor!=null){
            $('.ev_box').html(arrHT);
        }else{
            $('.ev_box').append(arrHT);
        }
        if(data.length<10){
            $('.ev_box').attr("scrollPagination", "disabled").append('<footer class="al-searchResultStatus">' + '~没有更多了~' + '</footer>');
        }else{
            $('.ev_box').attr("scrollPagination", "enabled");
        }
        $('.ev_box .al-doctorRecommendItem').css({paddingLeft:"0.4rem"});
        $('.al-noContentTips').hide();
    }else{
        $('.ev_box').attr('scrollPagination','disabled');
        $('.al-noContentTips').show().removeClass('recommend');
        $('.al-sortItems li').click(function(){
            return false;
        });
        $('.ev-noContentRecommend').attr('scrollPagination','disabled');
    }

};
allinmdH5Search.deletHistory = function(){

    _aC.deletBtn = $(".al-searchResultContent[data-role='main'] .al-clearHistorySearch")
    _aC.deletBtn.click(function(){

        var options = {
            "title": "确定清空历史记录吗？",// 标题文本 {string}
            "cancel": "取消", //取消按钮文本 {string}
            "ensure": "确定",// 确认按钮文本 {string}
            "ensureCallback": function () {
                var clearData = allinmdH5Search.postData("clearHistory");
                allinmdH5Search.ajax(_aC.history.deletHistory,clearData,'post',"clearHistory");
            },// 确认执行回调 {Function}
            "cancelCallback": function(){

                /*comm.releaseBox();*/
            },// 取消执行回调 {Function}
        };
        comm.confirmBox(options);
    });
};
allinmdH5Search.historyClear = function(data){
    if(data.responseObject.responseStatus){

        _aC.historyContainer.empty().css({"display":"none"});
    }

};
allinmdH5Search.creatHistory = function(data){
    if(data.responseObject.responseStatus){
        var strResult = "";
        var xhrdata = data.responseObject.responseData.data_list;
        for (var i = 0; i < xhrdata.length; i++) {

            strResult += "<p class=" + "al-historySearchItem>" + htmlToString(xhrdata[i].keyWord) + '</p>';
        }
        strResult += '<p class="al-clearHistorySearch">清空历史</p>';

        _aC.historyBox.append(strResult);

        allinmdH5Search.deletHistory();
        _aC.historyBox.find(".al-historySearchItem").each(function(i,em){
            $(this).click(function(){
                comm.creatEvent({
                    triggerType:'历史搜索',
                    keyword:$(this).text(),
                    locationId:i+1,
                    actionId:61
                });
                _aC.allBox.allPar.addClass('active');
                $(".al-indexNavbar li").removeClass("active");
                $(".al-indexNavbar li").eq(0).addClass("active");
                $(".lenovoword").empty();
                _aC.searchInput.val($(this)[0].innerText);
                _aC.searchVal = $(this)[0].innerText;
                _aC.nowIndexPage = $(".active").attr("data-role");
                allinmdH5Search.creatHistoryTxt();
                allinmdH5Search.searchBegin();
            });
        });
    }


};
allinmdH5Search.creatHot = function(data){
    if(data.responseObject.responseStatus){
        var strResult = "";
        var str = "";
        var xhrdata = data.responseObject.responseData.data_list;
        for (var i = 0; i < xhrdata.length; i++) {
            strResult += "<span class='al-hotSearchWord' keyword='"+xhrdata[i].keyWord+"'>" + comm.getStrByteLen(htmlToString(xhrdata[i].keyWord),16) + '</span>';
            if(i<=2){
                str += htmlToString(xhrdata[i].keyWord)+" | ";
            }
        }
        //$(".al-searchInputBar input").attr("placeholder",comm.getStrByteLen(str.substr(0,str.length-3),40));
        _aC.hotBox.html(strResult);
        _aC.hotBox.find(".al-hotSearchWord").each(function(i,em){

            $(this).click(function(){
                comm.creatEvent({
                    triggerType:'热门搜索',
                    keyword:$(this).text(),
                    locationId:$(this).index(),
                    actionId:60
                });
                $(".lenovoword").empty();
                _aC.allBox.allPar.addClass('active');
                $(".al-indexNavbar li").removeClass("active");
                $(".al-indexNavbar li").eq(0).addClass("active");
                _aC.searchInput.val($(this).attr("keyword"));
                _aC.searchVal = $(this).attr("keyword");
                allinmdH5Search.creatHistoryTxt();
                allinmdH5Search.searchBegin();
            });
        });
    }

};
allinmdH5Search.hotSearch = function(){
    var postData = allinmdH5Search.postData("hot");
    var postUrl = _aC.hot;
    allinmdH5Search.ajax(postUrl,postData,"post","hot");
};
allinmdH5Search.haveNothing = function(){
    $('.ev_box').hide();
    $('.ev-wrap').hide();
    $('.al-noContentTips').show().removeClass('recommend');
    $('.al-searchErrorReport').click(function(){
        comm.creatEvent({
            triggerType:'我要吐槽',
            keyword:$(this).text(),
            actionId:80,
            async:false
        });
    });
    $('.ev_recommendForYou').hide();
    $('.ev_box').attr('scrollpagination','disabled');
};
allinmdH5Search.changeIndex = function(){
    var t=this;
    _aC.navBox.each(function(i,em){
        $(em).click(function(e){
            $('.noContentRecommend').attr("scrollPagination",'disabled');
            allinmdH5Search.ajaxRequest.abort();
            e.stopPropagation();
            var role = $(this).data("role");
            $(this).addClass('active').siblings().removeClass('active');
            _aC.nowIndexPage = role;
            for(var obj in _aC.search){
                _aC.search[obj] = null;
            }
            _aC.search[role]=role;
            $('.ev_docBox').hide();
            if(_aC.searchVal){//此处不做缓存，因为每次要请求分享的内容不同，缓存会出错C.
                $('body').bind('touchmove',function(x){
                    x.preventDefault();
                });

                allinmdH5Search.searchBegin();
            }else{
                allinmdH5Search.haveNothing();
            }

        });
    });
    allinmdH5Search.sortSearch();
};
allinmdH5Search.sortSearch=function(){
    $('.al-sortItems li').off('click').on('click',function(){
        $(this).addClass('sortActive').siblings('li').removeClass('sortActive');
        var _searchSort = $(this).attr('searchSort');
        var _keyword = $('.al-searchInputBar input').val();
        if(_searchSort==1){
            comm.creatEvent({
                triggerType:'搜索资源排序',
                keyword:_keyword,
                actionId:56
            });
        }else if(_searchSort==2){
            comm.creatEvent({
                triggerType:'搜索资源排序',
                keyword:_keyword,
                actionId:57
            });
        }else{
            comm.creatEvent({
                triggerType:'搜索资源排序',
                keyword:_keyword,
                actionId:58
            });
        }
        var _role = $('.al-indexNavbar li.active').data('role');
        _aC.nowIndexPage = _role;
        if(_aC.searchVal){//此处不做缓存，因为每次要请求分享的内容不同，缓存会出错
            allinmdH5Search.searchBegin();
        }else{
            allinmdH5Search.haveNothing();
        }
    });
};
allinmdH5Search.sortSearchForbid=function(){
    $('.al-sortItems li').off('click');
};
allinmdH5Search.searchWord = function(){
    _aC.searchInput.on("click",function(){
        comm.creatEvent({
            triggerType:'搜索',
            actionId:10
        });
    });
    _aC.searchInput.keyup(function(event){
        /*如果联想词内存在内容，首先要置空*/
        if(event.which == 13) {
            //comm.creatEvent({
            //    triggerType:'搜索',
            //    keyword:"专页搜索",
            //    actionId:10
            //});
            $(".lenovoword").empty();
            $(".ev-lenovo").hide();
            $(".ev-mainInner").show();
            $('.al-searchInputBar input').blur();
            $('.al-sortItems li').removeClass('sortActive').eq(0).addClass('sortActive');
            $(".al-indexNavbar li").eq(0).addClass("active").siblings().removeClass("active");
            _aC.searchVal = _aC.searchInput.val();
            _aC.nowIndexPage =$(".active").attr("data-role");
            allinmdH5Search.searchBegin();
            Log.createBrowse(32,'搜索全部页面',window.location.href+"?rand="+new Date().getTime()+"&keyword="+encodeURI($('.al-searchInputBar input').val()));
            allinmdH5Search.creatHistoryTxt();
            comm.creatEvent({
                triggerType:'搜索',
                triggerName:'搜索-成功',
                keyword:$(this).val(),
                actionId:11044
            });
        }      //13等于回车键(Enter)键值,
        if ($(this).val()!==0) {
            $(".icon-searchCancel").show();
        }else{
            $(".icon-searchCancel").hide();
        }
    });
};
allinmdH5Search.postData = function(method,searchType){
    var isTheData = {};
    var isData = {};
    var platformId=$('.platformSelect').attr('data-platformId');//TempCache.getItem('department')||1;
    var sesId = TempCache.getItem('userId')||"";
    switch(method) {
        case "all":
            isData = {
                pageIndex: 1,
                pageSize: _aC.searchpageSize,
                searchParam: _aC.searchVal,
                logoUseFlag: 3,
                useFlag: _aC.userFlag||2,  //--登录传入2，不登录传入1
                attUseFlag: AttUseFlag.e,
                sortType: $('.al-sortItems li.sortActive').attr("searchSort"),
                scene : 1,
                searchType:searchType?searchType:2,
                platformId:platformId ,
                sessionCustomerId:sesId
            };
            return isTheData = {paramJson: $.toJSON(isData)};
        case "case":
            isData = {
                pageIndex: 1,
                pageSize: _aC.searchpageSize,
                searchParam: _aC.searchVal,
                logoUseFlag: 3,
                useFlag: _aC.userFlag||2,  //--登录传入2，不登录传入1
                attUseFlag: AttUseFlag.e,
                customerRole: 6,
                sortType: $('.al-sortItems li.sortActive').attr("searchSort"),
                scene:5,  //只输出一张图片
                isValid:1,
                searchType:searchType?searchType:2,
                platformId:platformId,
                sessionCustomerId:sesId
            };
            return isTheData = isData;
        case "video":
            isData = {
                pageIndex: 1,
                pageSize: _aC.searchpageSize,
                searchParam: _aC.searchVal,
                logoUseFlag: 3,
                useFlag: userFlag.l,
                sortType: $('.al-sortItems li.sortActive').attr("searchSort"),
                isValid:1,
                searchType:searchType?searchType:2,
                platformId:platformId,
                sessionCustomerId:sesId
            };
            return isTheData = isData;
        case "meeting":
            isData = {
                pageIndex: 1,
                pageSize: _aC.searchpageSize,
                searchParam: _aC.searchVal,
                logoUseFlag: 3,
                useFlag: _aC.userFlag||2,  //--登录传入2，不登录传入1
                attUseFlag: AttUseFlag.e,
                sortType: $('.al-sortItems li.sortActive').attr("searchSort"),
                isValid:1,
                searchType:searchType?searchType:2,
                platformId:platformId,
                sessionCustomerId:sesId
            };
            return isTheData = isData;
        case "doctor":
            isData = {
                pageIndex: 1,
                pageSize: _aC.searchpageSize,
                searchParam: _aC.searchVal,
                logoUseFlag: 3,
                useFlag: 1,  //--登录传入2，不登录传入1
                customerRole: 6,
                sortType:$('.al-sortItems li.sortActive').attr("searchSort"),
                isValid:1,
                searchType:1,
                platformId:platformId,
                sessionCustomerId:sesId
            };
            return isTheData = isData;
        case "doc":
            isData = {
                pageIndex: 1,
                pageSize: _aC.searchpageSize,
                searchParam: _aC.searchVal,
                logoUseFlag: 3,
                useFlag: _aC.userFlag||2,  //--登录传入2，不登录传入1
                attUseFlag: AttUseFlag.e,
                sortType: $('.al-sortItems li.sortActive').attr("searchSort"),
                isValid:1,
                searchType:searchType?searchType:2,
                platformId:platformId,
                sessionCustomerId:sesId
            };
            return isTheData = isData;
        case "topic":
            isData = {
                pageIndex: 1,
                pageSize: _aC.searchpageSize,
                searchParam: _aC.searchVal,
                logoUseFlag: 3,
                useFlag: _aC.userFlag||2,  //--登录传入2，不登录传入1
                attUseFlag: AttUseFlag.e,
                sortType: $('.al-sortItems li.sortActive').attr("searchSort"),
                isValid:1,
                searchType:searchType?searchType:2,
                platformId:platformId,
                sessionCustomerId:sesId
            };
            return isTheData = isData;
        case "history":
            var historyTxt = {
                "customerId": _aC.userId,
                "visitSiteId": _aC.vistedId,
                "pageIndex":1,
                "pageSize":15,
                "isRepeat":0,
                platformId: $('.platformSelect').attr('data-platformId')
            };

            return isTheData = {paramJson: $.toJSON(historyTxt)};
        case "clearHistory":
            var clearData = {
                "customerId": _aC.userId,
                "visitSiteId": _aC.vistedId,
                "isValid":0,
                platformId: $('.platformSelect').attr('data-platformId')
            };
            return isTheData= {paramJson: $.toJSON(clearData)};
        case "creatHistoryTxt":
            var pushHistoryTxt = {
                keyWord: _aC.searchVal,
                searchUrl: window.location.href,
            };
            return isTheData= {paramJson: $.toJSON(pushHistoryTxt)};
        case "lenovo":
            var postData = {
                "searchParam": _aC.searchVal,        //搜索词
                "pageIndex": 1,      //起始记录数
                "visitSiteId": "2",
                "pageSize": _aC.lenovoPageSize,         //记录条数
                platformId: $('.platformSelect').attr('data-platformId')
            };
            return isTheData = {paramJson: $.toJSON(postData)};
        case "hot":
            return {
                "start": 0,         //起始记录数
                "end": 8,       //结束记录条数
                "groupByFlag": 1,   //排行周期，默认为1，（1-天，2-周，3-月，4-年，5-7天，6-30天）
                platformId: $('.platformSelect').attr('data-platformId')
                //"dateTime":      //日期（YYYY-MM-DD）默认前一天
            };
    }
};
allinmdH5Search.searchHistory = function(){
    var postData = allinmdH5Search.postData("history");
    var postUrl = _aC.history.requireHistory;
    allinmdH5Search.ajax(postUrl,postData,"post","history");
};
allinmdH5Search.dealData = function(data,whoajax){
    allinmdH5Search.sortSearch();
    $('.ev-wrap').show();
    $('.ev_box').show();
    switch(whoajax){
        case "lenovo":
            this.creatLenovo(data);
            break;
        case "all":
            $('.ev-main').hide();
            if(data.responseObject.responseData&&!$.isEmptyObject(data.responseObject.responseData)){
                _aC.shareBtn.show();
                this.creatAll(data,true);
                this.scrollPage(_aC.searchMethod.all,whoajax);
            }else{
                _aC.shareBtn.hide();
                $('.ev_docBox').hide();
                _aC.allBox.allSource.hide();
                allinmdH5Search.haveNothing();
                allinmdH5Search.getRecommend('all');
            }
            break;
        case "case":
            $('.ev-main').hide();
            if(data.responseObject.responseData&&!$.isEmptyObject(data.responseObject.responseData)&&data.responseObject.responseData.data_list.length){
                _aC.shareBtn.show();
                this.creatCase(data,true);
                this.scrollPage(_aC.searchMethod.case,whoajax);
            }else{
                _aC.shareBtn.hide();
                allinmdH5Search.haveNothing();
                allinmdH5Search.getRecommend('case');
            }
            break;
        case "video":
            $('.ev-main').hide();
            if(data.responseObject.responseData&&!$.isEmptyObject(data.responseObject.responseData)&&data.responseObject.responseData.data_list.length){
                _aC.shareBtn.show();
                this.creatVideo(data,true);
                this.scrollPage(_aC.searchMethod.video,whoajax);
            }else{
                _aC.shareBtn.hide();
                allinmdH5Search.haveNothing();
                allinmdH5Search.getRecommend('video');
            }
            break;
        case "meeting":
            $('.ev-main').hide();
            if(data.responseObject.responseData&&!$.isEmptyObject(data.responseObject.responseData)&&data.responseObject.responseData.data_list.length){
                _aC.shareBtn.show();
                this.creatMeeting(data,true);
                this.scrollPage(_aC.searchMethod.meeting,whoajax);
            }else{
                _aC.shareBtn.hide();
                allinmdH5Search.haveNothing();
                allinmdH5Search.getRecommend('meeting');
            }
            break;
        case "doc":
            $('.ev-main').hide();
            if(data.responseObject.responseData&&!$.isEmptyObject(data.responseObject.responseData)&&data.responseObject.responseData.data_list.length){
                _aC.shareBtn.show();
                this.creatDoc(data,true);
                this.scrollPage(_aC.searchMethod.doc,whoajax);
            }else{
                _aC.shareBtn.hide();
                allinmdH5Search.haveNothing();
                allinmdH5Search.getRecommend('doc');
            }
            break;
        case "topic":
            $('.ev-main').hide();
            if(data.responseObject.responseData&&!$.isEmptyObject(data.responseObject.responseData)&&data.responseObject.responseData.data_list.length){
                _aC.shareBtn.show();
                this.creatTopic(data,true);

                this.scrollPage(_aC.searchMethod.topic,whoajax);
            }else{
                _aC.shareBtn.hide();
                allinmdH5Search.haveNothing();
                allinmdH5Search.getRecommend('topic');
            }
            break;
        case "doctor":
            $('.ev-main').hide();
            if(data.responseObject.responseData&&!$.isEmptyObject(data.responseObject.responseData)&&data.responseObject.responseData.data_list.length){
                _aC.shareBtn.show();
                this.creatDoctor(data,true);
                this.scrollPage(_aC.searchMethod.doctor,whoajax);
            }else{
                _aC.shareBtn.hide();
                allinmdH5Search.haveNothing();
                allinmdH5Search.sortSearchForbid();
            }
            break;
        case "history":
            if(data.responseObject.responseStatus){
                _aC.historyContainer.show();
            }
            this.creatHistory(data);
            break;
        case "hot":
            this.creatHot(data);
            break;
        case "clearHistory":

            this.historyClear(data);
            break;
        case "creatHistoryTxt":
            this.dealHistoryTxt(data);
        default:
            return;
    }
    comm.loading.hide();

};
allinmdH5Search.lenovoWord = function(){
    $(".icon-searchCancel").on("click",function(){
        $(this).hide();
        $(".ev-lenovo").hide();
        $(".ev-mainInner").show();
        _aC.searchInput.val("");
    });
    var timer = null;
    var nowVal = '';
    var inputSelf;
    var flag = true;
    this.config.searchInput.bind('compositionstart',function(){
        flag = false;
    });
    this.config.searchInput.bind('compositionend',function(){
        flag = true;
    });
    this.config.searchInput.bind('input propertychange',function(e){
        clearTimeout(timer);
        inputSelf = $(this);
        nowVal = inputSelf.val();
        timer = setTimeout(function(){
            _aC.searchVal = nowVal;
            if(_aC.searchVal&&flag){
                var postData = allinmdH5Search.postData("lenovo");
                var postUrl = _aC.lenovoUrl;
                allinmdH5Search.ajax(postUrl,postData,"post","lenovo");
            }else{
                $(".ev-lenovo").hide();
                $(".ev-mainInner").show();
            }
        },500);


    });
};
function switchPlatform(){
    var _platformId = TempCache.getItem('department')||1;

    if (_platformId==1) {
        $('.platformSelect').text('骨科').attr('data-platformId',1);
        $('.ev_switchPlatform li').eq(0).addClass('activeP').siblings().removeClass('activeP');
        $('.al-searchInputBar input').css('paddingLeft','1.3rem');
    } else {
        $('.platformSelect').text('手外科').attr('data-platformId',2);
        $('.ev_switchPlatform li').eq(1).addClass('activeP').siblings().removeClass('activeP');
        $('.al-searchInputBar input').css('paddingLeft','1.8rem');
    }
    $('.platformSelect').on('click',function(){
        $('.ev_switchPlatform').toggleClass('al-personalSelectorOn');
        comm.creatEvent({
            triggerType:'骨科&手外科切换',
            keyword:"骨科&手外科切换(切换按钮点击)",
            actionId:2
        });
    });
    $('.al-personalContributionSelectorItem').click(function(){
        var pId = $(this).attr('data-platformId');
        if (pId==1) {
            $('.al-searchInputBar input').css('paddingLeft','1.3rem');
        } else {
            $('.al-searchInputBar input').css('paddingLeft','1.8rem');
        }
        $('.platformSelect').text($(this).text()).attr('data-platformId',pId);
        $('.ev_switchPlatform').removeClass('al-personalSelectorOn');
        $(this).addClass('activeP').siblings().removeClass('activeP');
        //判断是否已经搜索内容，没搜索刷新历史，否则重新请求
        if ($('.ev-main').is(':visible')) {
            allinmdH5Search.hotSearch();
        }else{
            allinmdH5Search.searchBegin();
        }
        comm.creatEvent({
            triggerType:'骨科&手外科切换',
            keyword:pId==1?"骨科&手外科切换(骨科按钮点击)":"骨科&手外科切换(手外科按钮点击)",
            actionId:3
        });
    });
    $(document).on('click',function(e){
        if($('.ev_switchPlatform').hasClass('al-personalSelectorOn')){
            if(!($(e.target).hasClass('platformSelect')||$(e.target).parents().hasClass('platformSelect')||$(e.target).hasClass('ev_switchPlatform')||$(e.target).parents().hasClass('ev_switchPlatform'))){
                $('.ev_switchPlatform').removeClass('al-personalSelectorOn');
            }
        }
    });
    $(window).on('scroll',function(){$('.ev_switchPlatform').removeClass('al-personalSelectorOn');})
}
function allinmdH5SearchInit(){
    comm.textChange({"$tex":_aC.searchInput,"noTop":1});
    allinmdH5Search.lenovoWord();
    $(".al-searchResultContent[data-role='all'] .al-searchItem").eq(0).hide(10);
    $(".al-searchResultContent[data-role='all'] .al-doctorRecommend").hide(10);
    $(".al-searchResultContent[data-role='all'] .al-content").last().hide(10);
    if(_aC.userId){
        allinmdH5Search.searchHistory();
    }
    switchPlatform();
    allinmdH5Search.hotSearch();
    allinmdH5Search.changeIndex();
    allinmdH5Search.searchWord();
    allinmdH5Search.deletHistory();
};
function indexToType(index) {
    if(typeof index!="undefined"){
        return [0,7,1,3,9,2,4][index];
    }else{
        return 0;
    }

}
function getShare(index){
    var data={};
    data.attUseFlag = AttUseFlag.h;
    data.isValid = 1;
    data.logoUseFlag = 4;
    data.resourceType = indexToType(index);//资源类型 0:全部 7:病例 1:视频 3:会议 9:医师 2:文库 4:话题
    data.scene = 10;
    data.sceneType = 1;
    data.searchParam = _aC.searchInput.val();
    data.sessionCustomerId = _aC.userId?_aC.userId:"";
    data.visitSiteId = 5;
    data.platformId= $('.platformSelect').attr('data-platformId');
    data.sortType = $('.sortActive').attr('searchSort');
    data.searchType=2;
    var param={};
    param.paramJson= $.toJSON(data);

    var shareSence="";
    switch (index){
        case 0://全部
            shareSence=shareSenceConst.search_list_all;
            break;
        case 1://病例
            shareSence=shareSenceConst.search_list_case;
            break;
        case 2://视频
            shareSence=shareSenceConst.search_list_video;
            break;
        case 3://会议
            shareSence=shareSenceConst.search_list_meeting;
            break;
        case 4://医师
            shareSence=shareSenceConst.search_list_doctor;
            break;
        case 5://文库
            shareSence=shareSenceConst.search_list_doc;
            break;
        case 6://话题
            shareSence=shareSenceConst.search_list_topic;
            break;
    }
    var shareObj={};
    shareAll({
        qShareLog:function(x){    //分享新浪，空间成功与否都执行
            if(x=='sina'){
                comm.shareLog({
                    shareType: "",
                    resourceId:"" ,
                    resourceType: "",
                    refId: "",
                    isValid: 1,
                    shareSence:shareSence,
                    shareChannel:3,
                    shareContent:shareObj.sinaTitle
                });
            }else{
                comm.shareLog({
                    shareType: "",
                    resourceId:"" ,
                    resourceType: "",
                    refId: "",
                    isValid: 1,
                    shareSence:shareSence,
                    shareChannel:1,
                    shareContent:shareObj.qZoneTitle
                });
            }
        },
        fnMessageSuc:function(){//微信好友
            comm.shareLog({
                shareType: "",
                resourceId:"" ,
                resourceType: "",
                refId: "",
                isValid: 1,
                shareSence:shareSence,
                shareChannel:4,
                shareContent:shareObj.wxTitle
            });
        },      //分享好友成功回调
        fnTimelineSuc:function(){//朋友圈
            comm.shareLog({
                shareType: "",
                resourceId:"" ,
                resourceType: "",
                refId: "",
                isValid: 1,
                shareSence:shareSence,
                shareChannel:5,
                shareContent:shareObj.WechatTimeline
            });
        },      //分享朋友圈成功回调
        triggerRequest:function(){
            $.ajax({
                type : "post",
                url : M_CALL+"comm/data/share/getMapList3/",
                data : param,
                dataType : "json",
                async:false,
                success : function(rep){
                    var url="https:/pages/search/search.html?keyword="+escapeReplace(data.searchParam)+"&searchType="+index;
                    shareObj.url = url;
                    if(rep&&rep.responseObject.responseStatus){
                        var shareJson=rep.responseObject.responseData.data_list[0];
                        shareObj.pic = shareJson.share_comm.shareImageUrl;
                        shareObj.title=shareJson.share_comm.shareTitle!=""?shareJson.share_comm.shareTitle:document.title;
                        $.each(shareJson.share_channel,function(i,el){
                            if(el.shareChannel=='Sina'){
                                shareObj.sinaTitle=el.shareDesc;
                            }else if(el.shareChannel=="WechatFriend"){
                                shareObj.wxTitle = el.shareTitle;
                                shareObj.wxDesc = el.shareDesc;
                            }else if(el.shareChannel=="QZone"){
                                shareObj.qZoneTitle=el.shareTitle;
                                shareObj.summary = el.shareDesc;
                            }else if(el.shareChannel=="WechatTimeline"){
                                shareObj.timeLineTitle=el.shareTitle;
                            }
                        });
                    }
                },
                error:function(){}
            });
            return shareObj;
        }
    },false,$('.al-scrollShareBtn'));

}

$(document).ready(function(){
    //$(".al-searchInputBar input").click();
    var customerId=TempCache.getItem("userId");
    var para=comm.getparaNew();
    if (para && para.keyword != "") {
        var keyword = para.keyword;
    }
    if (para && para.searchType) {
        var currentIndex = para.searchType;
    } else {
        var currentIndex = 0;
    }
    if(para&&para.sortType){
        var sortType = para.sortType;
    }else{
        var sortType = 1;
    }
    if(para&&para.matchType){//精确搜索2，模糊搜索1
        var matchType = para.matchType;
    }else{
        var matchType=2;
    }
    var callAppOptions = {
        //el: "#callAppBtn",
        ios: "allinmdios://app.allinmd.cn/applinks.html?scene=searchList&index=" + indexToType(currentIndex) + "&searchParam=" + decodeURI(keyword) +"&sortType="+sortType+"&matchType="+matchType+ "&userID=" + customerId,
        android: "allin://com.allin.social:75235?data={scene:1,type:" + indexToType(currentIndex) + ",searchParam:" + keyword + ",sortType:" + sortType +  ",matchType:" + matchType +",customerId:'" + customerId + "'}",
        ios9: "http://app.allinmd.cn/applinks.html?scene=searchList&index=" + indexToType(currentIndex) + "&searchParam=" + decodeURI(keyword) +"&sortType="+sortType+"&matchType="+matchType+ "&userID=" + customerId,
        runAtOnce: false
    };
    comm.recognizeAppShareLink(callAppOptions);//app分享的链接强制打开app
    $(".al-searchCancel").on("click",function(){//取消
        comm.creatEvent({
            triggerType:'全站功能按钮点击',
            keyword:"取消",
            actionId:45
        });
        g_sps.jump(null,document.referrer?document.referrer:"/");
    });
    allinmdH5SearchInit();
    if(para.keyword){//关键词
        _aC.searchInput.val(para.keyword);
        _aC.searchVal=para.keyword;
        _aC.navBox.eq(currentIndex).click();
    }
    //window.onload=Log.createBrowse(78,"搜索页"); //	浏览日志
});

allinmdH5Search.getRecommend = function(who){

    var url=_aC.searchMethod[who];
    var isData={};
    var platformId = $('.platformSelect').attr('data-platformId');
    var sesId = TempCache.getItem('userId')||"";
    switch(who) {
        case "all":
            isData = {
                pageIndex: 1,
                pageSize: _aC.searchpageSize,
                searchParam: _aC.searchVal,
                logoUseFlag: 3,
                useFlag: _aC.userFlag || 2,  //--登录传入2，不登录传入1
                attUseFlag: AttUseFlag.e,
                sortType: $('.al-sortItems li.sortActive').attr("searchSort"),
                scene: 1,
                searchType: 1,
                platformId:platformId,
                sessionCustomerId:sesId
            };
            break;
        case "case":
            isData = {
                pageIndex: 1,
                pageSize: _aC.searchpageSize,
                searchParam: _aC.searchVal,
                logoUseFlag: 3,
                useFlag: _aC.userFlag || 2,  //--登录传入2，不登录传入1
                attUseFlag: AttUseFlag.e,
                customerRole: 6,
                sortType: $('.al-sortItems li.sortActive').attr("searchSort"),
                scene: 5,  //只输出一张图片
                isValid: 1,
                searchType: 1,
                platformId:platformId,
                sessionCustomerId:sesId
            };break;
        case "video":
            isData = {
                pageIndex: 1,
                pageSize: _aC.searchpageSize,
                searchParam: _aC.searchVal,
                logoUseFlag: 3,
                useFlag: userFlag.l,
                sortType: $('.al-sortItems li.sortActive').attr("searchSort"),
                isValid: 1,
                searchType: 1,
                platformId:platformId,
                sessionCustomerId:sesId
            };break;
        case "meeting":
            isData = {
                pageIndex: 1,
                pageSize: _aC.searchpageSize,
                searchParam: _aC.searchVal,
                logoUseFlag: 3,
                useFlag: _aC.userFlag || 2,  //--登录传入2，不登录传入1
                attUseFlag: AttUseFlag.e,
                sortType: $('.al-sortItems li.sortActive').attr("searchSort"),
                isValid: 1,
                searchType: 1,
                platformId:platformId,
                sessionCustomerId:sesId
            };break;
        case "doctor":
            isData = {
                pageIndex: 1,
                pageSize: _aC.searchpageSize,
                searchParam: _aC.searchVal,
                logoUseFlag: 3,
                useFlag: 1,  //--登录传入2，不登录传入1
                customerRole: 6,
                sortType: $('.al-sortItems li.sortActive').attr("searchSort"),
                isValid: 1,
                searchType: 1,
                platformId:platformId,
                sessionCustomerId:sesId
            };break;
        case "doc":
            isData = {
                pageIndex: 1,
                pageSize: _aC.searchpageSize,
                searchParam: _aC.searchVal,
                logoUseFlag: 3,
                useFlag: _aC.userFlag || 2,  //--登录传入2，不登录传入1
                attUseFlag: AttUseFlag.e,
                sortType: $('.al-sortItems li.sortActive').attr("searchSort"),
                isValid: 1,
                searchType: 1,
                platformId:platformId,
                sessionCustomerId:sesId
            };break;
        case "topic":
            isData = {
                pageIndex: 1,
                pageSize: _aC.searchpageSize,
                searchParam: _aC.searchVal,
                logoUseFlag: 3,
                useFlag: _aC.userFlag || 2,  //--登录传入2，不登录传入1
                attUseFlag: AttUseFlag.e,
                sortType: $('.al-sortItems li.sortActive').attr("searchSort"),
                isValid: 1,
                searchType: 1,
                platformId:platformId,
                sessionCustomerId:sesId
            };break;
    }
    var domTree =function(resList){
        var sourceStr = "";
        var _actTitle='';
        if (resList) {
            for (var m = 0; m < resList.length; m++) {
                /*typeId  1-视频 2-文库  4-话题 7- 病例
                 */
                var imgHtml = '';
                var hasImgClass = '';
                if (resList[m].picUrl) {//有图
                    if (resList[m].typeId == 1) {
                        imgHtml = '<figure class="al-contentImgBox">' +
                            '<a href="' + resList[m].resourceUrl + '">' +
                            '<img src="' + resList[m].picUrl.split('|')[0] + '" alt="">' +
                            '<i class="al-videoPlayBtn">' +
                            '<img src="//img50.allinmd.cn/pages/index/videoPlay_btn.png" alt="">' +
                            '</i>' +
                            '<span class="al-videoTime">' + resList[m].playTime + '</span>' +
                            '</a>' +
                            '</figure>';
                    } else {//无图
                        imgHtml = '<figure class="al-contentImgBox">' +
                            '<a href="' + resList[m].resourceUrl + '">' +
                            '<img src="' + resList[m].picUrl.split('|')[0] + '" alt="">' +
                            '</a>' +
                            '</figure>';
                    }

                    hasImgClass = "";
                } else {
                    imgHtml = "";
                    hasImgClass = "al-contentUpTitleDownImg";
                }
                _actTitle='';
                if(resList[m].isShowActivityTag==1){
                    var _color = resList[m].activityTagColor;
                    _actTitle = '<span style="color:'+_color+';border:1px solid '+_color+';padding:0 0.10667rem;margin-right: 0.26667rem;border-radius: 0.02667rem;">'+resList[m].activityTagName+'</span>';
                }
                if (resList[m].typeId == 1) {
                    sourceStr += '<section class="al-contentPartModule ' + hasImgClass + '" data-all="all_video">' +scoreDom(resList[m].currentStarLevel,resList[m].currentScoreNum)+
                        '<section class="al-tableBox">' +
                        '<article class="al-contentText">' +
                        '<a href="' + resList[m].resourceUrl + '" class="al-contentTitle"><span>' + resList[m].resourceName + '</span></a>' +
                        '<p class="al-contentOtherMsg">' +
                        (_actTitle?_actTitle:(resList[m].resourceSecondType==1?'<span class="al-contentAuthor" style="color:#3598db;border:1px solid #3598db;padding:0 5px;border-radius:1px;">手术视频</span>':""))+
                        '<span class="al-contentAuthor icon-contentAuthor">' + resList[m].customerName + '</span>' +
                        '<span class="icon-contentWatchedNum">' + resList[m].browseNum.toWK() + '</span>' +
                        '</p>' +
                        '</article>' +
                        imgHtml +
                        '</section>' +
                        '</section>';
                } else if (resList[m].typeId == 2) {
                    sourceStr += '<section class="al-contentPartModule ' + hasImgClass + '" data-all="all_doc">' +scoreDom(resList[m].currentStarLevel,resList[m].currentScoreNum)+
                        '<section class="al-tableBox">' +
                        '<article class="al-contentText">' +
                        '<a href="' + resList[m].resourceUrl + '" class="al-contentTitle"><span>' + resList[m].resourceName + '</span></a>' +
                        '<p class="al-contentOtherMsg">' +_actTitle+
                        '<span class="al-contentAuthor icon-contentAuthor">' + resList[m].customerName + '</span>' +
                        '<span class="icon-contentWatchedNum">' + resList[m].browseNum.toWK() + '</span>' +
                        '</p>' +
                        '</article>' +
                        imgHtml +
                        '</section>' +
                        '</section>';
                } else if (resList[m].typeId == 3) {
                    sourceStr += '<section class="al-contentPartModule al-contentUpTitleDownImg">' +
                        '<article class="al-contentText">' +
                        //'<a href="/pages/conference/meeting-place.html?conId=' + resList[m].resourceId + '&conName=' + resList[m].resourceName + '" class="al-contentTitle">' +
                        '<a href="/pages/conference/meeting_detail.html?conId=' + resList[m].resourceId + '" class="al-contentTitle">' +
                        '<span>' + resList[m].resourceName + '</span>' +
                        '</a>' +
                        '<p class="al-contentOtherMsg">' +
                        '<span class="al-contentSeminarTime icon-contentSeminarTime">' + comm.date.dateJoint(resList[m].startTime, resList[m].endTime, '/', '-') + '</span>' +
                        '<span class="icon-contentSeminarPlace">' + resList[m].conLocation + '</span>' +
                        '</p></article></section>';
                } else if (resList[m].typeId == 4) {
                    sourceStr += '<section class="al-contentPartModule ' + hasImgClass + '" data-all="all_topic">' +
                        '<section class="al-tableBox">' +
                        '<article class="al-contentText">' +
                        '<a href="' + resList[m].resourceUrl + '" class="al-contentTitle"><span>' + resList[m].resourceName + '</span></a>' +
                        '<p class="al-contentOtherMsg">' +_actTitle+
                        '<span class="al-contentAuthor icon-contentAuthor">' + resList[m].customerName + '</span>' +
                        '<span class="icon-contentWatchedNum">' + resList[m].browseNum.toWK() + '</span>' +
                        '</p>' +
                        '</article>' +
                        imgHtml +
                        '</section>' +
                        '</section>';
                } else {
                    sourceStr += '<section class="al-contentPartModule ' + hasImgClass + '" data-all="all_case">' +scoreDom(resList[m].currentStarLevel,resList[m].currentScoreNum)+
                        '<section class="al-tableBox">' +
                        '<article class="al-contentText">' +
                        '<a href="' + resList[m].resourceUrl + '" class="al-contentTitle"><span>' + resList[m].resourceName + '</span></a>' +
                        '<p class="al-contentOtherMsg">' +_actTitle+
                        '<span class="al-contentAuthor icon-contentAuthor">' + resList[m].customerName + '</span>' +
                        '<span class="icon-contentWatchedNum">' + resList[m].browseNum.toWK() + '</span>' +
                        '</p>' +
                        '</article>' +
                        imgHtml +
                        '</section>' +
                        '</section>';
                }
            }
        }
        return sourceStr;
    };
    $.ajax({
        url:url,
        data:(who=='all'?{paramJson:$.toJSON(isData)}:isData),
        type:(who=='all'?'post':'get'),
        dataType:"json",
        success:function(d){
            if(d.responseObject.responseData&&!$.isEmptyObject(d.responseObject.responseData)){
                    allinmdH5Search.sortSearch();
                if(who=="all") {
                    $('.al-noContentTips').addClass('recommend');
                    var resList = d.responseObject.responseData.resource_list;
                    var cusList = d.responseObject.responseData.customer_list;
                    var cusCount = d.responseObject.responseData.customer_count||0;
                    var docstr = '';


                    var endNum = 2;
                    for (var t = 0; t < cusList.length; t++) {
                        if (t == endNum) {
                            break;
                        }

                        docstr += '<section class="al-doctorRecommendItem">' +
                            '<figure class="al-doctorRecommendImg">' +
                            '<figure class="al-doctorRecommendImg">' +
                            '<a href="'+(cusList[t].customer_baseinfo.customerId&&cusList[t].customer_baseinfo.customerId!=0?'/pages/personal/others_contribution.html?cid='+cusList[t].customer_baseinfo.customerId:"javascript:;")+'">' +
                            '<img src=' + cusList[t].customer_att.logoUrl + ' alt="">' +
                            '</a>' +
                            '</figure>' +
                            '</figure>' +
                            '<article class="al-doctorRecommendMsg">' +
                            '<a class="al-doctorRecommendName" href="'+(cusList[t].customer_baseinfo.customerId&&cusList[t].customer_baseinfo.customerId!=0?'/pages/personal/others_contribution.html?cid='+cusList[t].customer_baseinfo.customerId:"javascript:;")+'">' +
                            cusList[t].customer_auth.lastName + cusList[t].customer_auth.firstName + '<i class="al-vipUser"></i></a>' +
                            '<span class="al-doctorRecommendJob">' + cusList[t].customer_auth.medicalTitleShow + '</span>' +
                            '<span class="al-doctorRecommendHospital">' + cusList[t].customer_auth.company + '</span>' +
                            '</article>' +
                            '</section>';

                    }
                    if (docstr != ""&&cusCount>2) {
                        docstr += '<footer class="al-searchMoreUser">' +
                            '更多用户<i class="icon-searchMoreUser"></i>' +
                            '</footer>';
                    }

                    if(resList.length){
                        $('.noContentRecommend').html(domTree(resList,who));
                        allinmdH5Search.sortSearch();
                    }else{
                        allinmdH5Search.sortSearchForbid();
                    }
                    $(docstr).before($('.noContentRecommend'));
                    $('.ev_recommendForYou').show();
                }else{
                    var resList = d.responseObject.responseData.data_list;
                    if(resList.length>0){
                        $('.al-noContentTips').addClass('recommend');
                        $('.noContentRecommend').html(allinmdH5Search.caseDom(resList,who));
                        $('.noContentRecommend').find('.al-doctorRecommendItem').css('paddingLeft','0.4rem');
                        $('.ev_recommendForYou').show();
                        allinmdH5Search.sortSearch();
                    }else{
                        allinmdH5Search.sortSearchForbid();
                    }

                    if(resList.length<10){
                        $('.noContentRecommend').attr("scrollPagination", "disabled").append('<footer class="al-searchResultStatus">' + '~没有更多了~' + '</footer>');
                    }else{
                        $('.noContentRecommend').attr("scrollPagination", "enabled");
                    }

                }



                var pNo = 2;
                $('.noContentRecommend').removeAttr('scrollPagination');
                $('.noContentRecommend').off("scroll").scrollPagination({
                    'contentPage': url,
                    'noParamJson': (who=="all"?0:1),
                    'contentData': $.extend({},isData,{
                        pageIndex: function () {
                            return pNo++;
                        }
                    }),
                    'scrollTarget': $(window),
                    'heightOffset': 0,
                    'delaytime': 0,
                    'type': (who=='all'?"POST":'get'),
                    'beforeLoad': function () {
                        comm.loading.show();
                    },
                    'afterLoad': function (elementsLoaded) {
                        comm.loading.hide();
                    },
                    'loader': function (data) {
                        if(who=="all"){
                            if(data.responseObject.responseData&&!$.isEmptyObject(data.responseObject.responseData)&&!$.isEmptyObject(data.responseObject.responseData.resource_list)){
                                var _resList = data.responseObject.responseData.resource_list;
                                $('.noContentRecommend').append(domTree(_resList));
                                if(_resList.length<10){
                                    $('.noContentRecommend').attr("scrollPagination", "disabled");
                                    if($('.noContentRecommend .al-searchResultStatus').length==0){
                                        $('.noContentRecommend').append('<footer class="al-searchResultStatus">' + '~没有更多了~' + '</footer>');
                                    }
                                }
                                allinmdH5Search.sortSearch();
                            }else{
                                $('.noContentRecommend').append(domTree(_resList));
                                if(_resList.length<10){
                                    $('.noContentRecommend').attr("scrollPagination", "disabled");
                                    if($('.noContentRecommend .al-searchResultStatus').length==0){
                                        $('.noContentRecommend').append('<footer class="al-searchResultStatus">' + '~没有更多了~' + '</footer>');
                                    }
                                }
                                allinmdH5Search.sortSearchForbid();
                            }
                        }else{
                            if(data.responseObject.responseData&&!$.isEmptyObject(data.responseObject.responseData)){
                                var _resList = data.responseObject.responseData.data_list;
                                $('.noContentRecommend').append(allinmdH5Search.caseDom(_resList,who));
                                $('.noContentRecommend').find('.al-doctorRecommendItem').css('paddingLeft','0.4rem');
                                if(_resList.length<10){
                                    $('.noContentRecommend').attr("scrollPagination", "disabled");
                                    if($('.noContentRecommend .al-searchResultStatus').length==0){
                                        $('.noContentRecommend').append('<footer class="al-searchResultStatus">' + '~没有更多了~' + '</footer>');
                                    }
                                }
                                allinmdH5Search.sortSearch();
                            }else{
                                $('.noContentRecommend').attr("scrollPagination", "disabled");
                                if($('.noContentRecommend .al-searchResultStatus').length==0){
                                    $('.noContentRecommend').append('<footer class="al-searchResultStatus">' + '~没有更多了~' + '</footer>');
                                }
                                allinmdH5Search.sortSearchForbid();
                            }
                        }

                    }
                });
            }else{
                $('.noContentRecommend').attr("scrollPagination", "disabled");
                allinmdH5Search.sortSearchForbid();
                $('.ev_switchPlatform').toggleClass('al-personalSelectorOn');
            }
        }

    });

};

allinmdH5Search.caseDom=function(xhrData,who){
    var str = '';
    var len = xhrData.length;
    var i=0;
    var _actTitle ='';
    switch(who) {
        case "case":
            for (i; i < len; i++) {
                _actTitle ='';
                if(xhrData[i].isShowActivityTag==1){
                    var _color = xhrData[i].activityTagColor;
                    _actTitle = '<span style="color:'+_color+';border:1px solid '+_color+';padding:0 0.10667rem;margin-right: 0.26667rem;border-radius: 0.02667rem;">'+xhrData[i].activityTagName+'</span>';
                }
                str += '<section class="al-contentPartModule ' + (xhrData[i].case_attachment.attUrl ? '' : 'al-contentUpTitleDownImg') + '" data-all="all_case">' +scoreDom(xhrData[i].currentStarLevel?xhrData[i].currentStarLevel.currentStarLevel:undefined,xhrData[i].currentStarLevel?xhrData[i].currentStarLevel.currentScoreNum:0)+
                    '<section class="al-tableBox">' +
                    '<article class="al-contentText">' +
                    '<a href="' + xhrData[i].case_baseinfo.webStoragePath + '" class="al-contentTitle"><span>' + xhrData[i].case_baseinfo.caseName + '</span></a>' +
                    '<p class="al-contentOtherMsg">' +_actTitle+
                    '<span class="al-contentAuthor icon-contentAuthor">' + xhrData[i].case_customer_auth.lastName + "" + xhrData[i].case_customer_auth.firstName + '</span>' +
                    '<span class="icon-contentWatchedNum">' + xhrData[i].case_baseinfo.browseNum.toWK() + '</span>' +
                    '</p>' +
                    '</article>' +
                    (xhrData[i].case_attachment.attUrl ? '<figure class="al-contentImgBox">' +
                    '<a href="' + xhrData[i].case_baseinfo.webStoragePath + '">' +
                    '<img src="' + xhrData[i].case_attachment.attUrl + '" alt="">' +
                    '</a>' +
                    '</figure>' : '') +
                    '</section>' +
                    '</section>';

        }
            break;
        case "video":
            for(i;i<len;i++){
                _actTitle ='';
                if(xhrData[i].isShowActivityTag==1){
                    var _color = xhrData[i].activityTagColor;
                    _actTitle = '<span style="color:'+_color+';border:1px solid '+_color+';padding:0 0.10667rem;margin-right: 0.26667rem;border-radius: 0.02667rem;">'+xhrData[i].activityTagName+'</span>';
                }
                str+='<section class="al-contentPartModule '+(xhrData[i].cms_video_attachment_logo.videoAttUrl?'':'al-contentUpTitleDownImg')+'" data-all="all_video">' +scoreDom(xhrData[i].currentStarLevel?xhrData[i].currentStarLevel.currentStarLevel:undefined,xhrData[i].currentStarLevel?xhrData[i].currentStarLevel.currentScoreNum:0)+
                    '<section class="al-tableBox">' +
                    '<article class="al-contentText">' +
                    '<a href="'+xhrData[i].cms_video.webStoragePath+'" class="al-contentTitle"><span>'+xhrData[i].cms_video.videoName+'</span></a>' +
                    '<p class="al-contentOtherMsg">' +
                    (_actTitle?_actTitle:(xhrData[i].resourceSecondType==1?'<span class="al-contentAuthor" style="color:#3598db;border:1px solid #3598db;padding:0 5px;border-radius:1px;">手术视频</span>':""))+
                    '<span class="al-contentAuthor icon-contentAuthor">'+xhrData[i].cms_video_customer_auth.lastName + xhrData[i].cms_video_customer_auth.firstName+""+'</span>' +
                    '<span class="icon-contentWatchedNum">'+xhrData[i].cms_video.playNum.toWK()+'</span>' +
                    '</p>' +
                    '</article>' +
                    (xhrData[i].cms_video_attachment_logo.videoAttUrl?'<figure class="al-contentImgBox">' +
                    '<a href="'+xhrData[i].cms_video.webStoragePath+'">' +
                    '<img src="'+xhrData[i].cms_video_attachment_logo.videoAttUrl+'" alt="">' +
                    '<i class="al-videoPlayBtn">' +
                    '<img src="//img50.allinmd.cn/pages/index/videoPlay_btn.png" alt="">' +
                    '</i>' +
                    '<span class="al-videoTime">'+xhrData[i].cms_video.playTime+'</span>' +
                    '</a>' +
                    '</figure>':'') +
                    '</section>' +
                    '</section>';
            }
            break;
        case "meeting":
            for(i;i<len;i++){
                str+='<section class="al-contentPartModule al-contentUpTitleDownImg">' +
                    '<article class="al-contentText">' +
                    //'<a href="/pages/conference/meeting-place.html?conId='+xhrData[i].conId+'&conName='+xhrData[i].conName+'" class="al-contentTitle"><span>'+xhrData[i].conName+'</span></a>' +
                    '<a href="/pages/conference/meeting_detail.html?conId='+xhrData[i].conId+'" class="al-contentTitle"><span>'+xhrData[i].conName+'</span></a>' +
                    '<p class="al-contentOtherMsg">' +
                    '<span class="al-contentSeminarTime icon-contentSeminarTime">'+comm.date.dateJoint(xhrData[i].startTime, xhrData[i].endTime,"/",'-')+'</span>' +
                    '<span class="icon-contentSeminarPlace">'+xhrData[i].country + "•" + xhrData[i].city+'</span>' +
                    '</p>' +
                    '</article>' +
                    '</section>';
            }
            break;
        case "doc":
            for(i;i<len;i++){
                _actTitle ='';
                if(xhrData[i].isShowActivityTag==1){
                    var _color = xhrData[i].activityTagColor;
                    _actTitle = '<span style="color:'+_color+';border:1px solid '+_color+';padding:0 0.10667rem;margin-right: 0.26667rem;border-radius: 0.02667rem;">'+xhrData[i].activityTagName+'</span>';
                }
                str+='<section class="al-contentPartModule '+(xhrData[i].cms_doc_attachment_logo.docAttUrl?'':'al-contentUpTitleDownImg')+'" data-all="all_doc">' +scoreDom(xhrData[i].currentStarLevel?xhrData[i].currentStarLevel.currentStarLevel:undefined,xhrData[i].currentStarLevel?xhrData[i].currentStarLevel.currentScoreNum:0)+
                    '<section class="al-tableBox">' +
                    '<article class="al-contentText">' +
                    '<a href="'+xhrData[i].customer_doc.webStoragePath+'" class="al-contentTitle"><span>'+xhrData[i].customer_doc.docName+'</span></a>' +
                    '<p class="al-contentOtherMsg">' +_actTitle+
                    '<span class="al-contentAuthor icon-contentAuthor">'+xhrData[i].customer_auth.lastName+xhrData[i].customer_auth.firstName+'</span>' +
                    '<span class="icon-contentWatchedNum">'+xhrData[i].customer_doc.browseNum.toWK()+'</span>' +
                    '</p>' +
                    '</article>' +
                    (xhrData[i].cms_doc_attachment_logo.docAttUrl?'<figure class="al-contentImgBox">' +
                    '<a href="'+xhrData[i].customer_doc.webStoragePath+'">' +
                    '<img src="'+xhrData[i].cms_doc_attachment_logo.docAttUrl+'" alt="">' +
                    '</a>' +
                    '</figure>':'') +
                    '</section>'+
                    '</section>';
            }
            break;
        case "topic":
            for(i;i<len;i++){
                _actTitle ='';
                if(xhrData[i].isShowActivityTag==1){
                    var _color = xhrData[i].activityTagColor;
                    _actTitle = '<span style="color:'+_color+';border:1px solid '+_color+';padding:0 0.10667rem;margin-right: 0.26667rem;border-radius: 0.02667rem;">'+xhrData[i].activityTagName+'</span>';
                }
                str+='<section class="al-contentPartModule '+(xhrData[i].cms_topic_attachment.topicAttUrl?'':'al-contentUpTitleDownImg')+'" data-all="all_topic">' +
                    '<section class="al-tableBox">' +
                    '<article class="al-contentText">' +
                    '<a href="'+xhrData[i].cms_topic.webStoragePath+'" class="al-contentTitle"><span>'+xhrData[i].cms_topic.topicName+'</span></a>' +
                    '<p class="al-contentOtherMsg">' +_actTitle+
                    '<span class="al-contentAuthor icon-contentAuthor">'+xhrData[i].cms_topic_customer_auth.lastName +""+ xhrData[i].cms_topic_customer_auth.firstName+'</span>' +
                    '<span class="icon-contentWatchedNum">'+xhrData[i].cms_topic.browseNum.toWK()+'</span>' +
                    '</p>' +
                    '</article>' +
                    (xhrData[i].cms_topic_attachment.topicAttUrl?'<figure class="al-contentImgBox">' +
                    '<a href="'+xhrData[i].cms_topic.webStoragePath+'">' +
                    '<img src="'+xhrData[i].cms_topic_attachment.topicAttUrl+'" alt="">' +
                    '</a>' +
                    '</figure>':'') +
                    '</section>'+
                    '</section>';
            }
            break;
        case "doctor":{
            var arrHT=[];
            $.each(xhrData, function (index, val) {
                var logo;
                var auth;
                var base;
                var fans;
                var statistic;
                if (val.customer_att) {
                    logo = val.customer_att;
                }
                if (val.customer_auth) {
                    auth = val.customer_auth;
                }
                if (val.customer_baseinfo) {
                    base = val.customer_baseinfo;
                }
                if (val.customer_statistic) {
                    statistic = val.customer_statistic;
                }

                fans = val.customer_fans ? val.customer_fans : val.customer_follow_people;
                name = auth.lastName ? auth.lastName + auth.firstName : "";
                medicalTitle = auth.medicalTitleShow;//auth.medicalTitle?comm.strHandle.cutDoctorTitle(comm.cutLine(auth.medicalTitle,"_",",")):"";
                company = auth.company ? comm.getStrLen(auth.company, 22) : "";

                arrHT.push(module.listTemplate({tempName: "userList"})({
                    cid: base.customerId,
                    customerId: TempCache.getItem("userId"),
                    userName: name,
                    logoUrl: logo.logoUrl,
                    state: auth.state,
                    medicalTitle: medicalTitle,
                    company: company,
                    relationship: fans.relationship
                }));
            });
            str=arrHT;
            break;
        }
    }
    return str;
};
