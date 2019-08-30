/**
 * Created by zhangheng on 2017/5/18.
 *
 */
$(document).ready(function(){
    var operateData = {
        //关于页面操作数据的一系列方法
        requestData:function(options){
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
        },
        getUrlName: function (name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if (r != null)return unescape(r[2]);
            return null;
        },
        showRelated: function (data) {
            var returnData = [];
            if(data){
                $.each(data, function (index, val) {
                    var jsonItem = {};
                    var timeLimitClass = "hide";
                    var collectState = $.isEmptyObject(val.collect)?"0":"1";
                    val.collectState = collectState;
                    if (val.timeLimit == "1") {
                        timeLimitClass = "";
                    }
                    jsonItem = val;
                    jsonItem.timeLimitClass = timeLimitClass;
                    returnData.push(jsonItem);
                });
            }

            return returnData;
        },
        localYiDing:function(data){
            var returnData = [];
            $.each(data,function(i,v){
                if(i>4){
                    return false;
                }
                var dataJson = {};
                dataJson.index = i+1;
                dataJson.courseNum =v.classNum;
                dataJson.id =v.seriesId;
                dataJson.imgSrc =v.seriesPicUrl;
                dataJson.title = comm.getStrLen(v.seriesTitle,30);
                var urlStr ="";
                if(v.pageStoragePath){
                    urlStr=v.pageStoragePath;
                }
                dataJson.linkUrl = urlStr;
                returnData.push(dataJson);
            });
            return returnData;
        },
        localRelatedData:function(data){
            var listData = {};
            var  returnData = [];
            var keyStr = -1;
            var relatedSize = config.parameter.relatedPageSize;//后端无分页数据，只能前端处理，默认每次展示8个
          $.each(data,function(i,v){
              if(Math.ceil(i%relatedSize)==0){
                  keyStr++;
                  listData[keyStr+""] = [];
              }
              var dataJson = {
                  "courseNum":v.catalogNum,
                   index:i+1,
                  "timeLimit":"1",
                  "title": comm.getStrLen(v.courseName, 30),
                  "id": v.courseId,
                  "imgSrc":v.courseCoverPicUrl,
                  "reviewNum": 140
              };
              if(v.isCollected=="1"){
                  dataJson.collect = {
                      "state":"1"
                  };
              }
              dataJson.linkUrl = "/pages/discover/series/discover_series_details.html?tId="+v.courseId;
              listData[keyStr+""].push(dataJson);
              returnData.push(dataJson);
          });
          config.parameter.upDateData = listData;
          return config.parameter.upDateData;
        },
        localCatalogData: function (data) {
            var returnData = [];
            $.each(data, function (i, v) {
                var childMap = [];
                $.each(v.resourceList, function (inI, inV) {
                    var courseTitle = inV.resourceName.replace(/<.*?>/ig,"");
                    var title = "";
                    if(courseTitle.length>32){
                         title =courseTitle.substring(0,32)+"...";
                    }else{
                        title =courseTitle;
                    }
                    var inDataJson = {
                        "newCourse": inV.isNew,
                        "refType": inV.resourceType,
                        resourseId:inV.resourceId,
                        pageStoragePath:inV.pageStoragePath,
                        pdfUrl:(inV.resourceType=="1")?"":inV.pageStoragePath ,
                        videoUrl: (inV.resourceType=="1")?inV.pageStoragePath:"",
                         refPcUrl:"//"+inV.pageStoragePath,
                        "seriesDirTitle":title
                    };

                    childMap.push(inDataJson);
                });
                var dataJson = {
                    "customer_info": {},
                    "sortId": v.sortId,
                    "seriesDirId": v.catalogId,
                    "child_map": childMap,
                    "seriesDirTitle": v.catalogName.replace(/<.*?>/ig,"")
                };
                returnData.push(dataJson);
            });
            return returnData;
        },
        localCourseData: function (data) {
            var courseData = {};
            courseData.series_info = {};
            courseData.teacherIntro = [];
            courseData.series_info.courseNum = data.catalogNum;
            courseData.series_info.courseTitle = data.courseName;
            courseData.series_info.browseNum = data.totalLearnNum;
            courseData.series_info.courseId = data.courseId;
            courseData.series_info.courseCoverPicUrl=data.courseCoverPicUrl;
            courseData.series_info.collect = ((parseInt(data.isCollected)==1)&&(data.isCollected.length>0))?{"state":"1"}:{};
            $.each(data.data_list, function (i, v) {
                var medicalTitle = v.medicalTitleShow;
                if(medicalTitle.length===0){
                    medicalTitle = v.medicalTitle.split(",")[0].split("_")[1];
                }

                var dataJson = {
                    "courseId": v.customerId,
                    "authorLogoUrl": v.logoUrl,
                    "linkUrl": "/pages/personal/others_contribution.html?cid="+v.customerId,
                    "company": comm.getStrLen(v.company,18),
                    "authorName": v.name,
                    "medicalTitle": medicalTitle
                };
                courseData.teacherIntro.push(dataJson);
            });
            return courseData;
        }
    };
    var config = {
        //关于页面初始化的一些配置，基本元素，基本接口，基本参数
        element: {
            courseInfo:$(".au-course-info"),//该系列课程相关信息
            teacherIntro:$(".au-teacher-intro"),//讲师简介
            catalogObj:$(".au-course-catalog"),//目录展示
            moreTeacher:$(".au-more-teacher"),//更多讲师
            relatedContent:$(".al-related-series-course"),
            relatedCourse:$(".au-related-course"),//相关课程容器
            updateObj:$(".au-related-update"),//相关课程换一批
            yiDingContent:$(".yd-related-course"),
            yiDingObj:$(".au-about-yd"),//医鼎相关课程容器
            bannerImg:$('[alt="cover"]')
        },
        ajaxPort: {
            relatedCourse:"/call/cms/course/getThisTeamPreferList/",//相关课程接口
            cancelActive:PC_CALL + "collection/delete/",//收藏取消
            creatActive:PC_CALL + "collection/create/",//收藏
            courseInfo:"/call/cms/course/getCourseAuthorList/",//系列课相关信息
            catalog:"/call/cms/course/getCatalogList/"//课程目录

        },
        parameter: {
            nameStr:"",
            collectState:operateData.getUrlName("collectState"),
            seriesId:operateData.getUrlName("tId"),
            customerId:$('#sesCustomerId').val()!=""&&$('#sesCustomerId').val()!=undefined?$('#sesCustomerId').val():"",
            relatedIndex:0,
            relatedCount:0,
            relatedPageSize:8,
            upDateData:{}
        }
    };
    var template = {
        //关于字符串生成的一系列方法
        produce:function(type,data){
            /*
             * 函数名称：produce
             * 描述：产生html字符串，不做任何逻辑判断
             * 参数说明：
             * -------1、type,规定要产生的模板类型，string,必须
             * -------2、data，动态数据，array,必须
             * 返回值说明：
             *  -------1、htmlStr，返回相应类型的html字符串，string
             * */
            //调用示例：produce("pay",data)
            var str = "";
            for(var typeNum = 0;typeNum<type.length;typeNum++){
                str+=this.demo[type[typeNum]];
                ////console.log(this.demo[type[typeNum]])
            }
            String.prototype.temp = function(obj) {
                return this.replace(/\$\w+\$/gi, function(matchs) {
                    var returns = obj[matchs.replace(/\$/g, "")];
                    return (returns + "") == "undefined"? "": returns;
                });
            };
            var htmlStr = "";
            for(var i = 0;i<data.length;i++){
                htmlStr+=str.temp(data[i]);
            }
            return htmlStr;
        },
        "demo":{
            "yiDing":'<li data-seriesId="$id$" data-href="$linkUrl$">'+
            '<a href="$linkUrl$" target="_blank"  data-log-record="true" data-actionId="11004" data-keyword="医鼎相关课程" data-triggerType = "系列课"  data-browType="206" data-log-index="$index$" data-log-id="$id$">' +
            '<figure><img src="$imgSrc$"></figure>'+
            '<fieldset>'+
            '	<p class="title">'+
            '		$title$'+
            '	</p>'+
            '	<p>'+
            '		$courseNum$课时'+
            '	</p>'+
            '</fieldset>'+
            '</a>'+
            '</li>',
            "teacherIntro":'<li data-teacherId="$courseId$" data-href="$linkUrl$">'+
                '<a href="$linkUrl$">' +
            '<img src="$authorLogoUrl$" alt="">'+
            '<p class="name">'+
            '	$authorName$'+
            '</p>'+
            '<p class="doctorTitle">'+
            '	$medicalTitle$'+
            '</p>'+
            '<p class="hospital">'+
            '	$company$'+
            '</p>'+
            '</a>'+
            '</li>',
            "relatedCourse":'<li data-seriesId="$id$">'+
            '<a href="$linkUrl$" target="_blank" data-log-record="true" data-collectState="$collectState$"  data-actionId="11008" data-keyword="相关课程" data-triggerType = "系列课"  data-browType="206" data-log-index="$index$" data-log-id="$id$">' +
            '<figure><img src="$imgSrc$"></figure>'+
            '<fieldset>'+
            '	<p class="title">'+
            '		$title$'+
            '	</p>'+
            '	<p>'+
            '		$courseNum$节课<span class="timeLimit $timeLimitClass$">限时免费</span>'+
            '	</p>'+
            '</fieldset>'+
            '</a>'+
            '</li>'
        },
        "catalog":function(data){
            var str = "";
            $.each(data, function (index, val) {
                var childStr = "";
                    $.each(val.child_map, function (po, v) {
                        var newOnOff = '';
                        var pdfOrVideo = "listVideo";
                        var iconName = "";
                        if (v.newCourse == "1") {
                            newOnOff = "<b></b>";
                        }
                        /*1-视频，17-电子书，18-文章,7-病例，2-文库*/
                        switch (parseInt(v.refType)){
                            case 1://视频
                                iconName ="视频";
                                break;
                            case 17://电子书
                                iconName ="电子书";
                                break;
                            case 18://文章
                                iconName = "文库";
                                break;
                            case 7://病例
                                iconName ="病例";
                                break;
                            case 2://病例
                                iconName ="文库";
                                break;
                        }
                        if (parseInt(v.refType)!=1) {
                            pdfOrVideo = "listPdf";
                        }
                        childStr += '<p class="' + pdfOrVideo + '" data-href="//' + v.pageStoragePath + '" data-courseId="' + v.resourseId + '">' +
                                '<a href="//'+v.pageStoragePath+'">'+
                            '	<i>'+iconName+'</i>' + v.seriesDirTitle + '' + newOnOff+
                            '</a>'+
                            '</p>';
                    });
                    childStr += "";
                    if(childStr.length===0){
                        childStr+='<p class="listNone">' +
                            '	<i></i>精彩内容敬请期待'+
                            '</p>';
                    }
                    var indexNum = index+1;
                    str += '<li data-seriesDirId="' + val.seriesDirId + '">' +
                        '<aside class="name">'+indexNum+"."+val.seriesDirTitle+'</aside>' +
                        childStr +
                        '</li>';

            });
            return str;
        }
    };
    var courseDetails = {
        init: function () {
            var t = this;//获取banner下的课程简介，获取讲师简介，获取目录信息，初始化课程收藏功能，更多讲师的展开收起效果初始化
            t.getCourseInfo().getCatalog().collectCourse().moreTeacher().related().updateCourse().browseLog();
            return t;
        },
        browseLog:function(){
            var t = this;
            comm.Log.createBrowse({href:  21+ "/"+config.parameter.seriesId, id: 199, name: '系列课课程页面',noTimeOut:1});//后台需要
            //comm.Log.createBrowse({href:window.location.href,id:206,name:'课程详情页',noTimeOut:1});
            return t;
        },
        hideTeacher:function (type) {
            var t =this;
            var teacherObj = $("[data-teacherId]");
            if(type=="default"){//如果讲师数量大于4，给予更多讲师展开，如果讲师数量小于等于四个，隐藏，这是初始化的默认操作
                if(!(teacherObj.length>4)){
                    config.element.moreTeacher.hide();
                }else{
                    teacherObj.eq(3).nextAll().hide();
                    config.element.moreTeacher.show();
                }
            }else{//当点击更多讲师的时候，将多余四个的讲师全部实现toggle效果
                $("[data-teacherId]").eq(3).nextAll().toggle();
            }
            teacherObj.each(function(i){
                if(i>0&&(i%4==0)){
                    $(this).addClass("clearBoth");
                }
            });


            return t;
        },
        catalogHover:function(){
          var t = this;
            $('.courseColumn li p').hover(function(){
                var _this = $(this);
                if(!$(this).hasClass("listNone")){
                    $(this).append('<span>在线观看</span>');
                    $(this).find("span").off("click").on("click",function(){
                        window.location.href = _this.find("a").attr("href");
                    });
                }

            },function(){
                if(!$(this).hasClass("listNone")){
                    $(this).find("span").remove();
                }
            });
            return t;
        },
        related:function(){
            //展示相关课程
            var t = this;
            operateData.requestData({
                port: config.ajaxPort.relatedCourse,
                get:true,
                postData: {
                    "courseId": config.parameter.seriesId,    //课程Id
                    "isValid": 1,
                    "customerId": config.parameter.customerId,
                    "sortType":5

                },
                success: function (req) {
                    var yidingList = [];
                    var allinmdList = [];
                    $.each(req.responseObject.responseData.data_list,function(i,v){
                       if(parseInt(v.isAllin)==1){
                           allinmdList.push(v);
                       }else{
                           yidingList.push(v);
                       }
                    });
                    $.each(req.responseObject.responseData.yiding_list,function(i,v){
                        yidingList.push(v);
                    });
                    var listNum = allinmdList.length;
                    if(listNum==0){
                        config.element.relatedContent.hide();
                    }
                    config.parameter.relatedCount = Math.ceil(listNum / config.parameter.relatedPageSize);
                    operateData.localRelatedData(allinmdList);
                    t.demoRelated();/*相关课程有医鼎相关课程和本站相关课程，其中本站相关课程有一个换一批功能，因为后台没有分页功能，数据分页是前端处理的*/
                    var localYidingData = operateData.localYiDing(yidingList);
                    if(localYidingData.length>0){
                        config.element.yiDingObj.html(template.produce(["yiDing"],localYidingData));
                        config.element.yiDingContent.show();
                    }else{
                        config.element.yiDingContent.hide();
                    }

                },
                failed: function () {
                    config.element.yiDingContent.hide();
                }
            });
            return t;
        },
        demoRelated:function(){/*换一批功能是通过控制config.parameter.relatedIndex这个参数的转变来改变数据最终展示不同的数据*/
            var relatedData =operateData.showRelated(config.parameter.upDateData[config.parameter.relatedIndex+""]);
            config.element.relatedCourse.html(template.produce(["relatedCourse"],relatedData));
            if(relatedData){
                if(relatedData.length>0){
                    config.element.relatedContent.show();
                }
            }
            $('[data-log-record]').off("mousedown").on("mousedown",function(){
                var triggerType = $(this).attr("data-triggerType");
                var keyword = $(this).attr("data-keyword");
                var browType = $(this).attr("data-browType");
                var actionId = $(this).attr("data-actionId");
                var options = {
                    triggerType:triggerType,
                    keyword:keyword,
                    browType:browType,
                    actionId:actionId
                };

                if($(this).attr("data-log-index")){
                    options.locationId = $(this).attr("data-log-index");
                }
                if($(this).attr("data-log-id")){
                    options.refId = $(this).attr("data-log-id");
                }
                if($(this).attr("data-log-special")){
                    if(JSON.parse($(this).attr("data-log-special"))){
                        comm.creatEvent(options);
                    }
                }else{
                    comm.creatEvent(options);
                }

            });
        },
        updateCourse:function(){//相关课程换一批
            var t = this;
            config.element.updateObj.off("click").on("click",function(){
                config.parameter.relatedIndex++;
                if(config.parameter.relatedIndex>config.parameter.relatedCount-1){
                    config.parameter.relatedIndex = 0;
                }
                t.demoRelated();
            });
            return t;
        },
        moreTeacher:function () {
          var t = this;
          config.element.moreTeacher.on("click",function(){
             if($(this).hasClass("teacherMore")){
                 $(this).removeClass("teacherMore").addClass("teacherUp");
             }else{
                 $(this).removeClass("teacherUp").addClass("teacherMore");
             }
              t.hideTeacher("toggle");
          });
          return t;
        },
        collectCourse: function () {
            var t = this;//收藏操作基于登录注册实现
            config.element.courseInfo.find(".au-course-collect").on("click", function () {
                var isThis = $(this);
                var activeCollect = function(){
                    operateData.requestData({
                        port: config.ajaxPort.creatActive,
                        get: true,
                        postData: {
                            "collectionType": "18",    //体系化课程为6
                            "refId": config.parameter.seriesId,
                            "customerId": config.parameter.customerId

                        },
                        success: function (req) {
                            isThis.addClass("active").attr({"data-collectid": "4879"}).html("<i></i>已收藏").attr({"data-log-special":false});
                        },
                        failed: function () {

                        }
                    });
                };
                user.login({
                    callback: function () {
                        if (!isThis.hasClass("active")) {
                            activeCollect();
                        } else {
                            operateData.requestData({
                                port: config.ajaxPort.cancelActive,
                                get: true,
                                postData: {
                                    "collectionType": "18",    //体系化课程为18
                                    "refId": config.parameter.seriesId,
                                    "customerId": config.parameter.customerId
                                },
                                success: function (req) {
                                    isThis.removeClass("active").removeAttr("data-collectid").html("<i></i>收藏").attr({"data-log-special":true});
                                },
                                failed: function () {

                                }
                            });
                        }
                    },
                    scene: privilegeSceneConst.eSceneTypeCollect
                })
                /*if ($('#sesCustomerId').val() != undefined && $('#sesCustomerId').val() != "") {//已登录


                } else {

                }*/
            });
            return t;
        },
        analysisInfo:function(data){
            var t = this;
            var courseInfo = data.series_info;
            config.element.courseInfo.attr({"data-seriesId":courseInfo.seriesId});
            var titleObj = config.element.courseInfo.find(".title");
            var collectObj = config.element.courseInfo.find(".au-course-collect");
            var reviewNumObj = config.element.courseInfo.find(".reviewNum");
            var courseNumObj = config.element.courseInfo.find(".courseNum");
            var freeTimeObj = config.element.courseInfo.find(".freeTime");
            titleObj.html(courseInfo.courseTitle);
            document.title = ""+courseInfo.courseTitle+"体系化课程-唯医,allinmd";
            $("[name='keywords']").attr({"content":""+courseInfo.courseTitle+"、"+config.parameter.nameStr+"医学系列课、专业课程"});
            var reviewNum =0;
            if(parseInt(courseInfo.browseNum)>0){
                if(courseInfo.browseNum>1000){
                    reviewNum = courseInfo.browseNum.toWKH()
                }else{
                    reviewNum = courseInfo.browseNum;
                }
            }
            reviewNumObj.html(reviewNum);
            courseNumObj.html(courseInfo.courseNum+"节课");
            freeTimeObj.addClass((courseInfo.timeLimit=="1")?"":"hide");
            if(!$.isEmptyObject(courseInfo.collect)){
                collectObj.html("<i></i>已收藏").addClass("active").show().attr({"data-log-special":false});
            }else{
                collectObj.show();
            }
            if(courseInfo.courseCoverPicUrl.length>0){
                config.element.bannerImg.attr({"src":courseInfo.courseCoverPicUrl});
                $(".header.au-series-banner").show();
            }


            /*展示讲师简介的数据*/
            config.element.teacherIntro.html(template.produce(["teacherIntro"],data.teacherIntro)).hide();
            t.hideTeacher("default");
            config.element.teacherIntro.show();
            return t;
        },
        getCatalog:function(){
          var t = this;
            operateData.requestData({
                port: config.ajaxPort.catalog,
                get:true,
                postData: {
                    "courseId": config.parameter.seriesId,
                    "isValid": 1,
                    "customerId": config.parameter.customerId,      //pc、h5不用传这个参数
                    "firstResult": 0,
                    "maxResult": 1000
                },
                success: function (req) {/*将目录真数据转换成原来的假数据格式*/
                    var catalog = operateData.localCatalogData(req.responseObject.responseData.data_list);
                    config.element.catalogObj.html(template.catalog(catalog));
                    t.catalogHover();

                },
                failed: function () {

                }
            });
          return t;
        },
        downloadApp:function(){/*复用原来代码，这里仅仅是一个弹层的展示*/
            var _tabImg= $(".Ev-downLoad_QR img");
            $(".Ev-downloadBtn").on("click", function () {
                $('.Ev-al-downLoad_PopBox').show();
                comm.setCenter($(".Ev-al-downContainer"));
            });
            $(".Ev-closePopBtn").on("click",function () {
                $('.Ev-al-downLoad_PopBox').hide();
            });
        },
        getCourseInfo:function(){
            var t = this;
            operateData.requestData({
                port: config.ajaxPort.courseInfo,
                get:true,
                postData: {
                    "customerId":config.parameter.customerId,
                    "courseId": config.parameter.seriesId,    //课程Id
                    "isValid": 1
                },
                success: function (req) {/*首先将真数据处理成原来的假数据*/
                    var courseInfo = operateData.localCourseData(req.responseObject.responseData);
                    $.each(req.responseObject.responseData.data_list,function(i,v){
                        if(v.name){
                            config.parameter.nameStr+= v.name+"、";
                        }
                    });
                    t.analysisInfo(courseInfo);
                },
                failed: function () {

                }
            });
            return t;
        }
    };
    courseDetails.init();
});