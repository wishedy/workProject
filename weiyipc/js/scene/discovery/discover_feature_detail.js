/**
 * 功能描述：  发现——专栏详情页
 * 使用方法:
 * 注意事件：
 * 引入来源：  作用：发现页改版
 *
 * Created by zhangheng on 2017/10/10.
 */
$(document).ready(function () {
    var bigLecture = {
        path: {
            detailInfo: "/call/special/getSpecialInfo/",
            doctorInfo: "/call/special/getRecommendAuthor/",
            tabList: "/call/special/getSpecialCategoryList/",
            resourceList: "/call/special/getSpecialCategoryResourceList/",
            "share": PC_CALL + 'comm/data/share/getMapList3/',//分享接口
            fellowOn: PC_CALL + "call/customer/follow_resource/create/",
            fellowOff: PC_CALL + "customer/follow_resource/delete/"
        },
        parameter: {
            platformId: $('#sesDepartment').val() == undefined ? 1 : $('#sesDepartment').val(),
            customerId: $('#sesCustomerId').val() != "" && $('#sesCustomerId').val() != undefined ? $('#sesCustomerId').val() : "",
            columnId: comm.getpara().columnId,
            tabList: null,
            categoryId: "",
            categoryLevel: "",
            sceneType: [77,76,78],
            columnType: -1,
            pageSize: 10,
            pageIndex: 0,
            sortType: 0
        },
        el: {
            firstIndexTab: $(".typeNavText"),
            banner: $(".bannerCont"),
            doctor: $(".personalCont"),
            secondIndexTab: $(".al-tab-secondIndex"),
            resourceList: $(".boneClassList"),
            sort: $(".ev-change-sort"),
            fellow: null
        },
        lazyLoading: function () {
            var t = this;
            var param = {
                customerId: t.parameter.customerId,
                specialId: t.parameter.columnId,
                categoryId: t.parameter.categoryId,
                visitSiteId: 1,
                sortType: 0,
                categoryLevel: t.parameter.categoryLevel,
                maxResult: t.parameter.pageSize
            };
            var hasData = function (r) {
                if (r) {
                    if ($.isEmptyObject(r.responseObject)) {
                        return false;
                    } else {
                        if ($.isEmptyObject(r.responseObject.responseData)) {
                            return false;
                        } else {
                            return true;
                        }
                    }
                } else {
                    return false;
                }
            };
            var options = {
                success: function (data) {
                    t.templateResource(data.responseObject.responseData, true);
                    if (data.responseObject.responseData.data_list.length !== t.parameter.pageSize) {
                        t.el.resourceList.attr({"scrollpagination": "disabled"}).off("scroll");
                    }
                },
                failed: function () {
                    t.el.resourceList.attr({"scrollpagination": "disabled"}).off("scroll");
                }
            };
            var scrollOption = {
                /*请求地址*/
                'contentPage': t.path.resourceList,
                /*refid习题id*/
                'contentData': $.extend(param, {
                    "firstResult": function () {

                        return t.parameter.pageIndex * t.parameter.pageSize;
                    }
                }),
                'scrollTarget': $(window),
                'heightOffset': 0,
                'delaytime': 1000,
                'type': "POST",
                'beforeLoad': function () {
                    t.parameter.pageIndex++;
                    comm.LightBox.showloading();
                },
                'afterLoad': function (elementsLoaded) {
                    comm.LightBox.hideloading();
                },
                'loader': function (data) {
                    var hasOnOff = hasData(data);
                    if (hasOnOff) {
                        var diyOnOff = false;
                        if (options.diyCheck) {
                            diyOnOff = options.diyCheck(data);
                        }
                        var realNoData = ((data.responseObject.responseMessage) == "NO DATA");
                        var realStatus = data.responseObject.responseStatus;
                        var len = (data.responseObject.responseData.data_list) ? (data.responseObject.responseData.data_list.length == 0) : true;
                        if (realNoData || !realStatus || len || diyOnOff) {
                            options.failed && options.failed(data);
                        } else {
                            options.success && options.success(data);
                        }
                    } else {
                        options.failed && options.failed(data);
                    }
                }
            };
            t.el.resourceList.scrollPagination(scrollOption);
        },
        templateBanner: function (d) {
            var t = this;
            var myTemplate = Handlebars.compile($("#al-tpl-banner").html());
            t.el.banner.before(myTemplate(d));
            var contentObj = $(".introductions").find("[data-text]");
            var pickUpObj = $(".moreOpen");
            var contentStr = contentObj.attr("data-text");
            ////console.log(d);
            var infoData = d.data_list[0];
            var seoDescribe = infoData.seoDescribe;
            var seoKeyword = infoData.seoKeyword;
            var seoName = infoData.seoName;
            document.title = seoName;
            var metas = document.getElementsByTagName("meta");
            metas[0].name =seoKeyword;
            metas[0].content=seoDescribe;
            ////console.log(seoDescribe,seoKeyword,seoName)
            if(contentStr.length>contentObj.text().length){
                pickUpObj.removeClass("hide").css({"cursor":"pointer"}).off("click").on("click",function(){
                    $(this).toggleClass("pickUp");
                    if($(this).hasClass("pickUp")){
                        $(this).html("收起");
                        contentObj.html(contentObj.attr("data-text"));
                        comm.creatEvent({
                            triggerType: "特色栏目详情页",
                            keyword: "栏目介绍-更多信息",
                            browType: 218,
                            actionId: 11041,
                            browseTypeUrl:t.parameter.columnId+"/"+218
                        });
                    }else{
                        $(this).html("展开");
                        contentObj.html(comm.getStrLen(contentObj.attr("data-text"),180));
                    }
                });
            }

            t.fellowClass();
            return t;
        },
        shareInit: function () {
            var t = this;
            var shareType = t.parameter.sceneType[t.parameter.columnType-1];
            var param = {
                "sceneType": 76,          //
                "resourceType": 0,          //资源类型传0，代表所有类型
                "visitSiteId": 1,           //1-PC
                'sessionCustomerId': t.parameter.customerId,
                "specialId":t.parameter.columnId,
                customerId: t.parameter.customerId
            };
            //var o = $.extend(param, {"sceneType": shareType});
            var sinaTitle = "";
            var qqTitle = "";
            var qZoneTitle = "";
            module.share({
                container: $(".ev-shareContainer"),// 存放分享组件的父级
                type: 2,// 默认为 1  1 ：社交分享  2 ：页面左下角全站分享
                url: document.location.href,// 分享链接， 默认取当前页链接
                h5Url: document.location.href,//h5页面的链接会生成微信二维码
                title: "",// 分享标题
                shareTrend: 0,//0: 不需要站内动态分享  1 ：需要站内动态分享
                trendUrl: '',// 分享到站内动态的接口
                data: {},// 分享到站内动态的接口参数
                callback: function () {
                },// 分享到站内动态成功后回调函数
                triggerRequest: function (content) {//事件点击
                    $.ajax({
                        url: t.path.share,
                        type: "post",
                        data: {paramJson: $.toJSON(param)},
                        dataType: 'json',
                        async: false,
                        success: function (d) {
                            if (d && d.responseObject.responseData && !$.isEmptyObject(d.responseObject.responseData) && d.responseObject.responseData.data_list.length) {
                                var item = d.responseObject.responseData.data_list[0];
                                content.pic = item.share_comm.shareImageUrl;
                                content.title = item.share_comm.shareTitle != "" ? item.share_comm.shareTitle : document.title;
                                $.each(item.share_channel, function (i, el) {
                                    if (el.shareChannel == 'Sina') {
                                        sinaTitle = content.sinaTitle = el.shareDesc;
                                    } else if (el.shareChannel == "QQFriend") {
                                        qqTitle = content.qqTitle = el.shareTitle;
                                        content.qqSummary = el.shareDesc;
                                    } else if (el.shareChannel == "QZone") {
                                        qZoneTitle = content.qqZoneTitle = el.shareTitle;
                                        content.qqZoneSummary = el.shareDesc;
                                    }
                                });
                            }
                        }

                    });
                },
                shareSinaSuc: function () {
                    comm.shareLog({
                        shareType: "",
                        resourceId: "",
                        resourceType: "",
                        refId: "",
                        shareSence: shareSenceConst.discover_by_subject,
                        shareChannel: 3,
                        shareContent: sinaTitle
                    });
                },
                shareQQSuc: function () {
                    comm.shareLog({
                        shareType: "",
                        resourceId: "",
                        resourceType: "",
                        refId: "",
                        shareSence: shareSenceConst.discover_by_subject,
                        shareChannel: 2,
                        shareContent: qqTitle
                    });
                },
                shareQzoneSuc: function () {
                    comm.shareLog({
                        shareType: "",
                        resourceId: "",
                        resourceType: "",
                        refId: "",
                        shareSence: shareSenceConst.discover_by_subject,
                        shareChannel: 1,
                        shareContent: qZoneTitle
                    });
                }
            });
        },
        registerHandel: function () {
            var t = this;
            Handlebars.registerHelper("followClass", function (v) {
                if (parseInt(v) === 0) {
                    return '<p class="fellowBtn ev-follow">关注</p>'
                } else {
                    return '<p class="fellowBtn active">已关注</p>'
                }
            });
            Handlebars.registerHelper("noneChange", function (v) {
                //console.log(v);
                if (parseInt(v) === 0) {
                    return ''
                } else {
                    return 'none'
                }
            });
            Handlebars.registerHelper("noneImgLogo", function (v) {
                if (parseInt(v) <3) {
                    return ''
                } else {
                    return 'none'
                }
            });

            Handlebars.registerHelper("ellipsis", function (v, len) {
                return comm.getStrLen(v, len);
            });
            Handlebars.registerHelper("listIntroduction",function(v1,v2){
                var type = parseInt(v1,10);
                if(!v2){
                    return "listIntroductionLong";
                }
            });
            Handlebars.registerHelper("hideImgOnOff",function(v1,v2){
                var type = parseInt(v1,10);
                    if(!v2){
                        return "hide";
                }
            });
            Handlebars.registerHelper("afterVisited",function(v){
                if (parseInt(v, 10) === 0) {
                    return "";
                } else {
                    return "afterVisit";
                }
            });
            Handlebars.registerHelper("hideOnOff", function (v) {
                var type = parseInt(v);
                if (type === 19 || type === 1) {
                    return "";
                } else {
                    return "hide";
                }
            });
            Handlebars.registerHelper("changePlayTime", function (v) {
                if (parseInt(v[0], 10) === 0 && parseInt(v[1], 10) === 0) {
                    return v.substring(3, 20);
                } else {
                    return v;
                }
            });
            Handlebars.registerHelper("activeTabClass", function (v) {
                if (parseInt(v, 10) === 0) {
                    return 'active';
                } else {
                    return '';
                }
            });
            Handlebars.registerHelper("typeName", function (v) {
                var nameStr = "";
                switch (parseInt(v)) {
                    case 17:
                        nameStr = "电子书";
                        break;
                    case 18:
                        nameStr = "文章";
                        break;
                    case 19:
                        nameStr = "电子书视频";
                        break;
                    case 1:
                        nameStr = "视频";
                        break;
                    case 2:
                        nameStr = "文库";
                        break;
                    case 4:
                        nameStr = "话题";
                        break;
                    case 7:
                        nameStr = "病例";
                        break;
                }
                return nameStr;
            });
            Handlebars.registerHelper("showTime", function (nowTime) {
                if(nowTime){
                    return '<span class="num"><i></i>'+comm.date.thirdRule(nowTime, comm.date.local_time())+'</span>'
                }else{
                    return "";
                }

            });
            Handlebars.registerHelper("towkH", function (v) {
                return v.toWKH();
            });
            Handlebars.registerHelper("htmToString", function (v) {
                return comm.getStrLen(htmlToString(v), 68);
            });
            Handlebars.registerHelper("isNew", function (v, options) {
                if (parseInt(v, 10) === 1) {
                    return options.fn(this);
                } else {
                    return "";
                }
            });
            Handlebars.registerHelper("hasId",function(v1){
                if(parseInt(v1,10)>0){
                    return '/pages/personal/others_contribution.html?cid='+v1;
                }else{
                    return 'javascript:void(0);';
                }

            });
            Handlebars.registerHelper("dealAuthorLogo",function(v,v2){
                var v1 = parseInt(v,10);
                ////console.log(v1);
                if((v1 === 17) || (v1 === 18) || (v1 === 19)){
                    return '//img10.allinmd.cn/v3/common/icon/icon-book.png';
                }else{
                    return v2;
                }
            });
            Handlebars.registerHelper("logoClass",function(v){
               if(!v){
                   return "hide";
               } else{
                   return "";
               }

            });
            Handlebars.registerHelper("dealAuthor", function (v1, v2) {
                if ((v2.length === 0) && ((parseInt(v1, 10) === 17) || (parseInt(v1, 10) === 18) || (parseInt(v1, 10) === 19))) {
                    return "";
                } else {
                    if (v2.length !== 0) {
                        return comm.getStrLen(v2,24);
                    } else {
                        return "";
                    }
                }
            });
            Handlebars.registerHelper('videoAuthor',function(v,options){
                var type = parseInt(v);
                if (type!== 1) {
                    return options.fn(this);
                } else {
                    return "";
                }
            });
            Handlebars.registerHelper('videoMoreAuthor',function(v,options){
                var type = parseInt(v);
                if (type === 1) {
                    return options.fn(this);
                } else {
                    return "";
                }
            });
            Handlebars.registerHelper("videoIcon", function (v, options) {
                var type = parseInt(v);
                if (type === 19 || type === 1) {
                    return options.fn(this);
                } else {
                    return "";
                }
            });
            //debugger;

            return t;
        },
        detailInfoShow: function () {
            var t = this;
            var param = {
                customerId: t.parameter.customerId,
                specialId: t.parameter.columnId
            };
            comm.LightBox.showloading();
            var callBack = function (d) {
                var data = {
                    data_list: []
                };
                data.data_list = d.responseObject.responseData.data_list;
                t.parameter.columnType = parseInt(data.data_list[0].specialType);
                t.shareInit();
                comm.LightBox.hideloading();
                t.templateBanner(data);
            };
            var options = {
                postData: param,
                success: callBack,
                port: t.path.detailInfo
            };
            comm.ajax.request(options);
            return t;
        },
        templateDoctor: function (d) {
            var t = this;
            var doctorWrapper = $(".bannerCont");
            if(d.data_list.length){
                var myTemplate = Handlebars.compile($("#al-tpl-recommendDoctor").html());
                t.el.doctor.html(myTemplate(d)).parent().show();
                $(".ev-doctor-introduce").each(function(){
                    if($(this).find("span").text().length===0){
                        $(this).attr({"href":"javascript:void(0);"});
                    }
                });
                doctorWrapper.show();
            }else{
                doctorWrapper.hide();
            }

            return t;
        },
        templateResource: function (d, appendOnOff) {
            var t = this;
            $.each(d.data_list,function(index,value){
                value.owerNameListStr = JSON.stringify(value.owerNameList);
                value.owerLen=(value.owerNameList.length>1);
            });
            var myTemplate = Handlebars.compile($("#al-tpl-resourceList").html());
            if (appendOnOff) {
                t.el.resourceList.append(myTemplate(d));
            } else {
                t.el.resourceList.html(myTemplate(d)).removeAttr("scrollpagination");
            }
            $(".perMsg").off("click").on("click",function(){
                var isThis = $(this);
                if(isThis.find(".perMsg-authorName").length){
                    var jsonList = JSON.parse(isThis.attr('owernamelist'));
                    var nameStr = '';
                    $.each(jsonList,function(index,vaule){
                        if(nameStr.length==0){
                            nameStr+=vaule.authorName;
                        }else{
                            nameStr+=","+vaule.authorName;
                        }
                    });
                    $(".Ev-mesDocPopTextName").html(comm.getStrLen(nameStr,30));
                    $('.Ev-mesDocListBox').html(t.doctorListHtml(jsonList));
                    $(".Ev-mesDoctorList").show();
                }
            });
            $(".Ev-mesDocPopCloseBtn").off("click").on("click",function(){
                $(".Ev-mesDoctorList").hide();
                $(".Ev-mesDocPopTextName").html('');
            });
            return t;
        },
        doctorListHtml:function(items){
            var arrHT=[];
            $.each(items,function(i,e){
                arrHT.push(module.resourceListTemplate({tempName:"userList"})({
                    cid:e.refCustomerId,
                    userName:e.authorName,
                    logoUrl:e.logoUrl,
                    state: 2,
                    medicalTitle: e.medicalTitle,
                    company: comm.getStrLen(e.hospital,24),
                    contribuNum:0,
                    reviewNum:0,
                    fansNum:0,
                    relationship:e.isFollowPeople
                }));
            });
            $.each(arrHT,function(index,vaule){
               var isThis = $(vaule);
                isThis.find(".al-doctorMsgContent p").eq(1).remove();
                var cid = isThis.find('.ev-sRList').attr("data-id");
                if((!parseInt(cid,10))||(parseInt(items[index].state,10)===5)){
                    if(!parseInt(cid,10)){
                        isThis.find('.ev-sRList').attr({'href':'javascript:;'})
                    }
                    isThis.find(".ev-followBtn").remove();
                }
            });
            return arrHT;
        },
        showResourceList: function () {
            $('.boneClassList').attr('style','height:300px');
            comm.LightBox.showloading();
            var t = this;
            var param = {
                customerId: t.parameter.customerId,
                specialId: t.parameter.columnId,
                categoryId: t.parameter.categoryId,
                visitSiteId: 1,
                sortType: t.parameter.sortType,
                categoryLevel: t.parameter.categoryLevel,
                firstResult: t.parameter.firstResult,
                maxResult: t.parameter.pageSize,
                platformId:t.parameter.platformId

            };
            var callBack = function (d) {
                t.templateResource(d.responseObject.responseData, false);
                if (d.responseObject.responseData.data_list.length === t.parameter.pageSize) {
                    comm.LightBox.hideloading();
                    $('.boneClassList').attr('style','');
                    t.lazyLoading();
                }

            };
            var options = {
                postData: param,
                success: callBack,
                port: t.path.resourceList
            };
            comm.ajax.request(options);


            return t;
        },
        statisticsSecond: function (data) {
            var t = this;
            var returnData = [];
            var originalData = JSON.parse(JSON.stringify(data));
            var dataJson = {
                resourceNum: 0,
                sonCategoryId: "",
                sonCategoryName: "全部"
            };
            $.each(originalData.data_list, function (i, v) {
                var dataJson = {
                    resourceNum: v.totalResourceNum,
                    sonCategoryId: "",
                    sonCategoryName: "全部",
                    treeLevel: ""
                };
                if (v.sonCategoryList) {
                    //v.sonCategoryList.unshift(dataJson);
                    $.each(v.sonCategoryList, function (si, sv) {
                        if (sv.sonCategoryId.length !== "" && sv.sonCategoryName !== "全部") {
                            sv.treeLevel = 2;
                            returnData.push(sv);
                        }
                    });
                }
            });
            dataJson.resourceNum = originalData.data_list[0]["totalResourceNum"];
            returnData.unshift(dataJson);
            originalData.data_list[0]["sonCategoryList"] = returnData;
            originalData.data_list[0]["treeLevel"] = "";
            var dataJsonAdd = {
                resourceNum: 11,
                sonCategoryId: "11",
                sonCategoryName: "测试二级栏",
                treeLevel: "2"
            };
            /*for(var num = 0;num<100;num++){
                originalData.data_list[0].sonCategoryList.push(dataJsonAdd);
            }*/
            var JsonList = originalData.data_list[0].sonCategoryList;
            var newList = [];
            newList.push(JsonList[0]);
            originalData.data_list[0].sonCategoryList = newList;
            t.parameter.tabList = originalData;
            return t;
        },
        showDoctorInfo: function () {
            var t = this;
            var param = {
                customerId: t.parameter.customerId,
                specialId: t.parameter.columnId
            };
            var callBack = function (d) {
                t.templateDoctor(d.responseObject.responseData);
            };
            var options = {
                postData: param,
                success: callBack,
                port: t.path.doctorInfo
            };
            comm.ajax.request(options);
            return t;
        },
        templateTab: function (d) {
            var t = this;
            var myTemplate = Handlebars.compile($("#al-tpl-firstIndex").html());
            var secondTabTemplate = Handlebars.compile($("#al-tpl-secondIndex").html());

            t.el.firstIndexTab.html(myTemplate(d));
            t.el.secondIndexTab.html(secondTabTemplate(d.data_list[0]));
            t.pickUpSecond();
            return t;
        },
        pickUpSecond:function(){
          var t = this;
          var secondIndexObj = $(".al-tab-secondIndex");
          var actualHeight = secondIndexObj.height();
          ////console.log(actualHeight);
            ////console.log((actualHeight))
          if((actualHeight>=45)&&($(".ev-secondLevel").length>5)){
              ////console.log($(".ev-pick-list"))
              $(".ev-pick-list").removeClass("hide").addClass("pickUp viewMore").text("展开").off("click").on("click",function(){
                  secondIndexObj.toggleClass("al-tab-more");
                  $(this).toggleClass("viewMore");
                  if($(this).hasClass("viewMore")){
                      $(this).text("展开");
                  }else{
                      $(this).text("收起");
                  }
              });
              secondIndexObj.addClass("al-tab-more");
          }else{
              $(".ev-pick-list").addClass("hide");
          }

          return t;
        },
        tabContent: function () {
            var t = this;
            $(".ev-tabContent").off("click").on("click", function () {
                var isThis = $(this);

                var tabId = isThis.attr("data-categoryId").length ? parseInt(isThis.attr("data-categoryId"), 10) : -1;
                var tabLevel = isThis.attr("data-treeLevel").length ? parseInt(isThis.attr("data-treeLevel"), 10) : -1;
                var nowTabId = t.parameter.categoryId ? parseInt(t.parameter.categoryId, 10) : -1;
                var nowTabLevel = t.parameter.categoryLevel ? parseInt(t.parameter.categoryLevel, 10) : -1;
                var tabOnOff = (tabId === nowTabId) && (tabLevel === nowTabLevel);
                ////console.log(tabId,nowTabId,tabLevel,nowTabLevel)
                if (tabOnOff) {
                    return false
                } else {
                    if (isThis.hasClass("ev-firstLevel")) {
                        var secondTabTemplate = Handlebars.compile($("#al-tpl-secondIndex").html());
                        t.el.secondIndexTab.html(secondTabTemplate(t.parameter.tabList.data_list[isThis.index()]));
                        t.tabContent();

                        if (tabId > 0) {
                            t.parameter.categoryId = tabId;
                            t.parameter.categoryLevel = tabLevel;
                            $(".screenCont").show();
                        } else {
                            t.parameter.categoryId = "";
                            t.parameter.categoryLevel = "1";
                            $(".screenCont").hide();
                        }
                        t.pickUpSecond();
                        comm.creatEvent({
                            triggerType: "筛选排序",
                            keyword: isThis.text(),
                            browType: 218,
                            actionId: 11039,
                            browseTypeUrl:t.parameter.categoryId+"/"+218
                        });
                    }
                    if(isThis.hasClass("ev-secondLevel")){
                        if(tabId<0){
                            var firstLevel = $(".ev-firstLevel.active");
                            var firstLevelId = firstLevel.attr("data-categoryId").length>0 ? parseInt(firstLevel.attr("data-categoryId"), 10) : -1;
                            t.parameter.categoryId = "";
                            if(firstLevelId>0){
                                t.parameter.categoryId =firstLevelId;
                            }
                            t.parameter.categoryLevel = 1;
                        }else{
                            t.parameter.categoryId = tabId;
                            t.parameter.categoryLevel = tabLevel;
                        }
                        var togglePick = $(".ev-pick-list.pickUp");
                        if(!togglePick.hasClass("viewMore")){
                            $(".al-tab-secondIndex").scrollTop(0)
                            togglePick.trigger("click");

                        }
                        //t.sortTab(t.parameter.categoryId,t.parameter.tabList.data_list[$(".ev-firstLevel.active").index()].sonCategoryList,isThis.index());
                    }
                    $(".ev-change-sort").eq(1).addClass("active").siblings().removeClass("active");
                    t.parameter.pageIndex = 0;
                    t.showResourceList();
                    isThis.addClass("active").siblings().removeClass("active");
                }
            });
            return t;
        },
        sortTab:function(id,data,sortIndex){
          var t= this;
          ////console.log(id,data,sortIndex);
          var returnData = [];
          var dataJson = {};
          var allOnOff = false;
          $.each(data,function(i,v){
              if(id){
                  if(parseInt(id,10)===parseInt(v.sonCategoryId,10)){
                    dataJson = v;
                  }else{
                      returnData.push(v);
                  }
              }else{
                  allOnOff = true;
              }
          });
          if(allOnOff){
              returnData  = data;
          }else{
              returnData.splice(sortIndex-1, 0,dataJson);
          }
            ////console.log(returnData)
          return t;
        },
        changeSort: function () {
            var t = this;
            t.el.sort.off("click").on("click", function () {
                var nowIndex = ($(".ev-change-sort.active").index()===0)?1:0;
                var clickIndex = $(this).index();
                if(clickIndex===0){
                    clickIndex=1;
                    comm.creatEvent({
                        triggerType: "筛选排序",
                        keyword: "最新",
                        browType: 218,
                        actionId: 57,
                        browseTypeUrl:t.parameter.columnId+"/"+218
                    });
                }else{
                    clickIndex = 0;
                    comm.creatEvent({
                        triggerType: "筛选排序",
                        keyword: "默认",
                        browType: 218,
                        actionId: 11040,
                        browseTypeUrl:t.parameter.columnId+"/"+218
                    });
                }
                if (clickIndex === nowIndex) {
                    return false;
                } else {
                    t.parameter.sortType = clickIndex;
                    t.parameter.pageIndex = 0;
                    $(this).addClass("active").siblings().removeClass("active");
                    t.showResourceList();

                }
            }).css({"cursor": "pointer"});
            return t;
        },
        fellowClass: function () {
            var t = this;
            var fellowCallBack = function (obj) {
                var onOff = obj.hasClass("active");
                var param = {
                    "refId": t.parameter.columnId,
                    "followType": "8",
                    "customerId": t.parameter.customerId
                };
                var callBack = function (data) {
                    if (onOff) {
                        obj.removeClass("active").html("关注");
                    } else {
                        obj.addClass("active").html("已关注");
                    }

                };
                var options = {
                    postData: param,
                    success: callBack
                };
                if (onOff) {
                    options.port = t.path.fellowOff;
                } else {
                    options.port = t.path.fellowOn;
                }
                function requestFollow(){
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
                                comm.LightBox.hideloading();
                                options.success();
                            }
                        }});
                }
                if(onOff){
                    $.makeSurePopup({
                        title: "取消关注",//弹窗标题
                        content01: "确定取消关注吗？",//弹窗内容字体会加粗 (可不传)
                        content: "取消后将不再收到该栏目的更新提醒",//弹窗内容
                        url: t.path.fellowOff,//ajax请求接口（可不传，不传就不发请求）
                        param: options.postData,//ajax请求参数(可不传)
                        toJSON: 1,//传参是否为paramJSPN 0或1，默认为1
                        callback: function () {
                            obj.removeClass("active").html("关注");
                        },//点击确认后执行的方法（有发送请求时，是请求成功后执行的方法)
                        error: function () {
                        }//ajax请求失败后执行的方法(可不传)
                    });
                }else{
                    requestFollow();
                }


            };
            t.el.fellow = $(".fellowBtn");
            function tips(){
                if(!TempCache.getItem("columnDetail")){
                    if(t.el.fellow.find(".promptBoneClass").length===0){
                        t.el.fellow.append('<span class="promptBoneClass">关注栏目，获取上新提醒 </span>');
                        $(".promptBoneClass").off("click").on("click",function(e){
                           e.stopPropagation();
                           return false;
                        });

                    }
                }else{
                    $(".promptBoneClass").remove();
                }

            }
            tips();
            t.el.fellow.off("click").on("click", function () {
				TempCache.setItem("columnDetail","isHas");
                comm.creatEvent({
                    triggerType: "发现页改版",
                    keyword: document.title,
                    browType: 218,
                    actionId: 11022,
                    pushMessageId:t.parameter.columnId
                });
                var isThis = $(this);
                user.login({
                    callback: function () {
                        // debugger;
                        tips();
                        fellowCallBack(isThis);
                    },
                    scene: privilegeSceneConst.eSceneTypeAttentionList
                })
            }).css({"cursor":"pointer"});
            return t;
        },
        showTabList: function () {
            var t = this;
            var param = {
                customerId: t.parameter.customerId,
                specialId: t.parameter.columnId
            };
            var callBack = function (d) {
                t.parameter.tabList = d.responseObject.responseData;
                t.statisticsSecond(d.responseObject.responseData).templateTab(t.parameter.tabList).tabContent();

            };
            var options = {
                postData: param,
                success: callBack,
                port: t.path.tabList
            };
            comm.ajax.request(options);
            return t;
        },
        init: function () {
            var t = this;
            t.registerHandel().detailInfoShow().showDoctorInfo().showTabList().showResourceList().changeSort();
            return t;
        }
    };
    bigLecture.init();
});