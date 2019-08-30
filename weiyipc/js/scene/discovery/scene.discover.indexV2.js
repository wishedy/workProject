/**
 * 功能描述：  发现——首页
 * 使用方法:
 * 注意事件：
 * 引入来源：  作用：发现页改版
 *
 * Created by zhangheng on 2016/08/18.
 */

$(function() {
    var discoverV2 = {
        path:{
            polymerization:"/call/recommend/discover/item/getMapListByDiscover/",
            tagId:"/call/recommend/customer/tag/json_list/",
            fellowOn: PC_CALL + "call/customer/follow_resource/create/",
            fellowOff: PC_CALL + "customer/follow_resource/delete/",
            cancelActive:PC_CALL + "collection/delete/",//收藏取消
            createActive:PC_CALL + "collection/create/"//收藏
        },
        el: {
            discoverOutContainer: $(".discoverV2"),
            discoverInnerContainer: $('.discoverLeft'),
            allinSquare:$(".allinSquare")
        },
        parameter: {
            scrollTimeList:{},
            tagScrollList:{},
            discoverPageSize:10,
            discoverPageIndex:0,
            tagIndex:0,
            platformId: $('#sesDepartment').val() == undefined ? 1 : $('#sesDepartment').val(),
            customerId:$('#sesCustomerId').val()!=""&&$('#sesCustomerId').val()!=undefined?$('#sesCustomerId').val():""
        },
        jumpResource:function(){
          var t = this;
          var jumpList = $(".ev-jump-item");

          // ////console.log(TempCache.getItem("openDiscoverIndexResource"));
          if(!TempCache.getItem("openDiscoverIndexResource")){
              if(jumpList.eq(0).parent().find(".promptDiscover").length===0){
                  jumpList.eq(0).parent().append('<span class="promptDiscover">点击查看更多内容</span>');
              }
          }

            jumpList.off("click").on("click", function () {
                var jumpObj = $(this);
               // debugger;
                comm.creatEvent({
                    triggerType: "发现页到列表页入口",
                    keyword: (jumpObj.text()==="系列课")?(jumpObj.parents(".al-discover_module").find(".introduction").text()):(jumpObj.parents(".al-discover_module").find(".title").text()),
                    browType: 43,
                    locationId:jumpObj.parents(".al-discover_module").index(),
                    actionId: 45
                });
				TempCache.setItem("openDiscoverIndexResource", "isHas");
            });
          return t;
        },
        exhibitionDiscover: function (data,pro) {
            var t = this;
            var dataList = data;
            var updateData = [];
            ////////console.log(data)
            // ////console.log(t.parameter.tagScrollList)
            var score = null;
            if(t.parameter.tagIndex===0){
                score = 0;
            }else{

                score = ($.isEmptyObject(t.parameter.tagScrollList))?0:t.parameter.tagScrollList.minRecommendTime;
            }
            // ////console.log(score);
            var param = {
                "customerId": t.parameter.customerId,
                "pageIndex": 1+t.parameter.tagIndex,
                "pageSize": 10,
                "scene": 10,
                "flag": 1,
                "score": score,
                "sessionCustomerId": t.parameter.customerId,
                platformId: t.parameter.platformId	//string	是	1：骨科 2：手外科	1
            };
            function templateContent(d){
                var myTemplate = Handlebars.compile($("#al-tpl-discover").html());
                if(pro){
                    t.el.discoverInnerContainer.html(myTemplate(d));
                }else{
                    t.el.discoverInnerContainer.append(myTemplate(d));
                }
                t.parameter.tagIndex++;
                t.collectSeries();
                t.fellowResource();
                t.jumpResource();
            }
            var callBack = function(d){
                $.each(dataList,function(i,v){
                    if(i===5){
                        //////console.log(d.responseObject.responseData.data_list);
                        t.parameter.tagScrollList = d.responseObject.responseData.score_list[0];
                        updateData.push({tagList:d.responseObject.responseData.data_list,tag:true});
                    }
                        updateData.push(v);

                });
                templateContent(updateData);


            };
            var failedCallBack = function(){
                templateContent(data);
            };
            var options = {
                postData: param,
                success: callBack,
                port: t.path.tagId,
                failed:failedCallBack
            };
            t.request(options);
            return t;
        },
        collectSeries:function(){
          var t = this;
          $(".ev-collectSeries").off("click").on("click",function(){
              var isThis = $(this);
              var seriesOnOff = isThis.parents(".al-discover_module").find(".ev-jump-item").text()==="系列课";
              comm.creatEvent({
                  triggerType: "收藏",
                  keyword: (seriesOnOff)?(isThis.parents(".al-discover_module").find(".introduction").text()):(isThis.parents(".al-discover_module").find(".title").text()),
                  browType: 43,
                  actionId: 11022,
                  locationId:isThis.parents(".al-discover_module").index()+1,
                  pushMessageId:$(this).parents(".al-discover_module").attr("data-resourceid")
              });
              var activeCollect = function(obj){
                  var onOff = obj.hasClass("collaged");
                  var port = "";
                  if (onOff) {
                      port = t.path.cancelActive;
                  } else {
                      port = t.path.createActive;
                  }
                  var postData = {
                      "collectionType": "18",    //体系化课程为6
                      "refId": obj.parents("[data-resourceid]").attr("data-resourceid"),
                      "customerId": t.parameter.customerId
                  };
                  $.ajax({
                      url: port,    //请求的url地址
                      dataType: "json",   //返回格式为json
                      async:false, //请求是否异步，默认为异步，这也是ajax重要特性
                      data: {paramJson:$.toJSON(postData)},    //参数值
                      type: "POST",   //请求方式
                      beforeSend: function () {
                          //请求前的处理
                          comm.LightBox.showloading();
                      },
                      success: function (data) {
                          if(data.responseObject.responseStatus){
                              comm.LightBox.hideloading();
                              if (onOff) {
                                  obj.removeClass("collaged").html('<a href="javascript:;"><i></i>收藏</a>').addClass("collage");
                              } else {
                                  obj.addClass("collaged").html("已收藏").removeClass("collage");
                              }
                          }
                      },
                      failed: function () {

                      }
                  });
              };
              user.login({
                  callback: function () {
                      activeCollect(isThis);
                  },
                  scene: privilegeSceneConst.eSceneTypeCollect
              })
          }).css({"cursor":"pointer"});
          return t;
        },
        fellowResource:function(){
          var t = this;
            var fellowCallBack = function (obj) {
                var onOff = obj.hasClass("collaged");
                var param = {
                    "refId": obj.parents("[data-resourceid]").attr("data-resourceid"),
                    "followType": "8",
                    "customerId": t.parameter.customerId
                };
                var callBack = function (data) {
                    if (onOff) {
                        obj.removeClass("collaged").html("<a href='javascript:;'><i></i>关注</a>");
                    } else {
                        obj.addClass("collaged").html("已关注");
                    }

                };
                var options = {
                    postData: param,
                    success: callBack
                };
                if (onOff) {
                    options.port = t.path.fellowOff;
                    $.makeSurePopup({
                        title: "取消关注",//弹窗标题
                        content01: "确定取消关注吗？",//弹窗内容字体会加粗 (可不传)
                        content: "取消后将不再收到该栏目的更新提醒",//弹窗内容
                        url: t.path.fellowOff,//ajax请求接口（可不传，不传就不发请求）
                        param: options.postData,//ajax请求参数(可不传)
                        toJSON: 1,//传参是否为paramJSPN 0或1，默认为1
                        callback: function () {
                            obj.removeClass("collaged").html("<a href='javascript:;'><i></i>关注</a>");
                        },//点击确认后执行的方法（有发送请求时，是请求成功后执行的方法)
                        error: function () {
                        }//ajax请求失败后执行的方法(可不传)
                    });
                } else {
                    options.port = t.path.fellowOn;
                    requestFollow();
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
                        }}
                    );
                }


            };
          $(".ev-column").css({"cursor":"pointer"}).off("click").on("click",function(){
              var isThis = $(this);
              comm.creatEvent({
                  triggerType: "关注",
                  keyword: isThis.parents(".al-discover_module").find(".title").text(),
                  browType: 43,
                  actionId: 11022,
                  locationId:isThis.parents(".al-discover_module").index()+1,
                  pushMessageId:$(this).parents(".al-discover_module").attr("data-resourceid")
              });
              var fellowObj = $(this);
                 user.login({
                     callback: function () {
                         //fellowObj.addClass("collaged").html("已关注");
                         fellowCallBack(fellowObj);
                     },
                     scene: privilegeSceneConst.eSceneTypeAttentionList
                 })
          });
          return t;
        },
        scrollPage: function () {
            var t = this;
            var postData = {
                flag: 1,//string	是	1：上拉加载 0：下拉刷新	0
                visitSiteId: 2,//	string	是	站点	1
                "customerId": t.parameter.customerId,
                platformId: t.parameter.platformId,	//string	是	1：骨科 2：手外科	1
            };
            var scrollOption = {
                /*请求地址*/
                'contentPage': t.path.polymerization,
                'contentData': $.extend(postData, {
                    score:function(){
                        //////console.log(t.parameter.scrollTimeList)
                        return t.parameter.scrollTimeList[0].minRecommendTime;
                    },
                    "maxResult": function(){
                        return t.parameter.discoverPageSize;
                    },
                    "firstResult":function(){
                        return t.parameter.discoverPageIndex*t.parameter.discoverPageSize;
                    }
                }),
                'scrollTarget': $(window),
                'heightOffset': 0,
                'delaytime': 1000,
                'type': "POST",
                'beforeLoad': function () {
                    t.parameter.discoverPageIndex++;

                    $('#ctrollerLoading').show();
                    comm.LightBox.showloading();
                },
                'afterLoad': function (elementsLoaded) {
                    $('#ctrollerLoading').hide();
                    comm.LightBox.hideloading();

                },
                'loader': function (data) {
                    var d = data;
                    t.parameter.scrollTimeList = d.dataJson.responseData.score_list;
                    if(d.dataJson.responseData.data_list&&d.dataJson.responseData.data_list.length){
                        //////console.log(t.filterData(d.dataJson.responseData.data_list))
                        t.exhibitionDiscover(t.filterData(d.dataJson.responseData.data_list),false);
                    }else{
                        t.el.discoverOutContainer.off("scroll").attr({"scrollpagination":"disabled"});
                        var bottomTips = $(".lastTime");
                        if(bottomTips.length===0){
                            t.el.discoverInnerContainer.append("<section class=\"lastTime\">~ 到底了 ~</section>");
                        }
                    }
                }
            };
            t.el.discoverOutContainer.off("scroll").scrollPagination(scrollOption);
            return t;
        },
        registerHandel:function(){
            var t = this;
            Handlebars.registerHelper("hideOnOff",function(v){
               if(v){
                   return "";
               }else{
                   return "hide";
               }

            });
            Handlebars.registerHelper("columnName", function (v) {
                var returnName = "";
                switch (parseInt(v)-1){
                    case 0:
                        returnName="骨科大讲堂";
                        break;
                    case 1:
                        returnName="菁英课堂";
                        break;
                    case 2:
                        returnName="骨切磋";
                        break;
                }
                return returnName;
            });
            Handlebars.registerHelper("ellipsis", function (v, len) {
                return comm.getStrLen(v, len);
            });
            Handlebars.registerHelper("compare", function (v, options) {
                //////console.log(v);
                if (parseInt(v, 10) === 1) {
                    return '<p class="ev-collectSeries fellow  collaged">已收藏</p>';
                } else {
                    return '<p class="ev-collectSeries fellow collage"><a href="javascript:;"><i></i>收藏</a></p>';
                }
            });
            Handlebars.registerHelper("fellow", function (v, op) {
                if (parseInt(v, 10) === 1) {
                    return '<p class="ev-column fellow collaged">已关注</p>';
                } else {
                    return op.fn(this);
                }

            });
            Handlebars.registerHelper("activityState",function(v,options){
                var stateStr = "";
                var arr= [ "无状态","最热","NEW","正在进行","精彩回顾"];
                ////console.log(v)
               switch (parseInt(v,10)){
                   case 0:
                       stateStr = "";
                       break;
                   case 1:
                   case 2:
                       stateStr = '<p class="newState"><i></i>'+arr[v]+'</p>';
                       break;
                   case 3:
                       stateStr = '<p class="going"><i></i>'+arr[v]+'</p>';
                       break;
                   case 4:
                       stateStr = '<p class="ending"><i></i>'+arr[v]+'</p>';
                       break;
               }
               ////console.log(stateStr)
               return stateStr;
            });
            Handlebars.registerHelper("itemGoupType",function(v){
                var arr= [ "待分组","基础骨病","骨科技术","精品栏目","特色专题"];
                return arr[parseInt(v,10)];
            });
          return t;
        },
        filterData:function(d){
          var t = this;
          var returnData = [];

          $.each(d,function(i,v){
             //  1-特色栏目，2-系列课，3-热门活动，4-专题汇总
             switch (parseInt(v.itemType)){
                 case 1:
                     v.feature = true;
                     break;
                 case 2:
                     v.series = true;
                     break;
                 case 3:
                     v.activity = true;
                     break;
                 case 4:
                    v.special = true;
                     break;
             }
             v.recommendShowDate = comm.date.thirdRule(v.recommendDate,comm.date.local_time());
             returnData.push(v);
          });
          return returnData;
        },
        requestColumn:function(){
          var t = this;
            var param = {
                customerId:t.parameter.customerId,
                score: 0,//	string	是	时间戳，刚进来时传0，加载当前时间最新数据	1505872834999
                flag: 1,//string	是	1：上拉加载 0：下拉刷新	0
                visitSiteId: 1,//	string	是	站点	1
                platformId: t.parameter.platformId,	//string	是	1：骨科 2：手外科	1
                firstResult: t.parameter.discoverPageIndex,//	string	是
                maxResult: t.parameter.discoverPageSize	//string	是
            };
            var callBack = function(d){
                comm.localData.storeLocalData(t.path.polymerization,d);
                t.parameter.scrollTimeList = d.dataJson.responseData.score_list;
                //////console.log(t.parameter.scrollTimeList);
                t.exhibitionDiscover(t.filterData(d.dataJson.responseData.data_list),true);
            };
            var failedCallBack = function(){
                //////console.log("失败");
            };
            var options = {
                postData: param,
                success: callBack,
                port: t.path.polymerization
            };
            comm.localData.getLocalData({
                path: t.path.polymerization,
                exhibitionData: callBack,
                requestData: function () {
                    t.request(options);
                }
            });


          return t;
        },
        request: function(options){
            var postType = (options.get) ? "GET" : "POST";//默认是post方式，除非特别传参指名要get方式。
            var async = (options.async)?false:true;
            var postData = {"paramJson": $.toJSON(options.postData)};
            var loading = options.noLoading ? 0 : 1;
            var hasData = function(r){
                if(r){
                    if($.isEmptyObject(r.dataJson)){
                        return false;
                    }else{
                        if($.isEmptyObject(r.dataJson.responseData)){
                            return false;
                        }else{
                            return true;
                        }
                    }
                }else{
                    return false;
                }
            };
            $.ajax({
                url: options.port,    //请求的url地址
                dataType: "json",   //返回格式为json
                async:async, //请求是否异步，默认为异步，这也是ajax重要特性
                data: postData,    //参数值
                type: postType,   //请求方式
                beforeSend: function () {
                    //请求前的处理
                    if(loading){
                        comm.LightBox.showloading();
                    }
                },
                success: function (data) {
                    //请求成功时处理
                    if(data.responseObject){
                        data.dataJson = data.responseObject;
                    }
                    var hasOnOff = hasData(data);
                    if(loading) {
                        comm.LightBox.hideloading();
                    }
                    if(hasOnOff){
                        var diyOnOff = false;
                        if(options.diyCheck){
                            diyOnOff = options.diyCheck(data);
                        }
                        var realNoData = ((data.dataJson.responseMessage) == "NO DATA");
                        var realStatus = data.dataJson.responseStatus;
                        var len  =(data.dataJson.responseData.data_list)?(data.dataJson.responseData.data_list.length==0):true;
                        if (realNoData || !realStatus||len||diyOnOff) {
                            options.failed && options.failed(data);
                        } else {
                            options.success && options.success(data);
                        }
                    }else{
                        options.failed && options.failed(data);
                    }


                },
                complete: function () {
                    //请求完成的处理
                },
                error: function () {
                    //请求出错处理
                    options.failed && options.failed();
                }
            });
        },
        platformShow:function(){
          var t = this;
            if(parseInt(t.parameter.platformId)===1){
                t.el.allinSquare.show().find("li").show();
            }else{
                t.el.allinSquare.show().find('[data-surgery]').hide();
                t.el.allinSquare.find("li:not('[data-surgery]')").show();
            }
            $("[data-log]").off("click").on("click",function(){
                var isThis = $(this);
                comm.creatEvent({
                    triggerType: "发现页改版",
                    keyword: isThis.attr("data-log"),
                    browType: 43,
                    actionId: 11036,
                    locationId:isThis.index()+1
                });
            });
          return t;
        },
        init:function(){
          var t = this;
			TempCache.setItem("discoverIndexTips","1");
          t.registerHandel().platformShow().requestColumn().scrollPage();
        }
    };
    discoverV2.init();
});
