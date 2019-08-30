/**
 * Created by zhangHeng on 2018/12/18.
 * des:PC搜索页js重构，按照唯医3.2版本开发
 * title:搜索结果页
 * 搜索类型：0、query链接搜索，1、点击联想词搜索，2、点击历史词搜索，3、点击热词搜索，4、回车键搜索，5全部搜索，6，病例，7视频8会议9医师10文库11综合12最新13最热14手术视频,15点击搜索按键16点击分页搜索
 * 资源类型：//0全部 7病例 1视频 3会议 9医师 2文库
 */
$(document).ready(function(){
    var allinmdSearch = {
        path:{
            'realSearchParam':'//gateway.allinmd.cn/base-search-service/search/mistakeWords',//纠错词
            'college':'//gateway.allinmd.cn/base-search-service/search/college/getCourseList',//唯医学院
            "case":'//gateway.allinmd.cn/base-search-service/search/case',//病例
            "doc":'//gateway.allinmd.cn/base-search-service/search/doc',//文库
            "meeting":'//gateway.allinmd.cn/base-search-service/search/conference',//会议
            "courseVideo":'//gateway.allinmd.cn/base-search-service/search/video/course',//课程视频
            "operationVideo":'//gateway.allinmd.cn/base-search-service/search/video/operation',//手术视频
            "lenovo":'//gateway.allinmd.cn/base-customer-platform/cms/search/keyword/getMapListV3',//联想词
            "hot":'//gateway.allinmd.cn/base-customer-platform/cms/search/hotkey/getMapList',//热门搜索接口
            "doctor":'//gateway.allinmd.cn/base-search-service/search/customer',//热门搜索接口
            "allList":'//gateway.allinmd.cn/base-search-service/search/all',//全部搜索接口
            "products":'//gateway.allinmd.cn/medplus-resource-platform/med/product/getSearchProducts'
        },
        el:{
            pager:$(".pager").eq(0),
            searchBtn:$(".al-searchBtn"),
            errorCorrection:$(".al-errorCorrection"),
            allNumPanel:$(".al-search_expertList"),
            countNum:$(".al-searchMain_head"),
            allDoctorContainer:$(".al-allExperList"),
            inputBar:$(".al-searchMain_topHead input"),
            tab:$(".al-searchMain_ul li"),
            filtrate:$(".al_contentItemCondition"),
            videoFiltrate:$("[data-video]"),
            hotContainer:$(".ev-hotPar"),
            historyContainer:$(".ev-historyPar"),
            deleteHistoryBar:$(".al-clearAll"),
            deleteConfirm:$(".al-deletePopBox"),
            searchPanel:$(".al-addOne"),
            totalCount:$(".al-search-totalCount"),
            lenovoContainer:$(".al-searchMain_topHead .al-searchContent")
        },
        data:{
            allList:0,//全部下的医师列表默认请求1次就够了
            totalCount:'',
            doctorTotalCount:0,
            doctorList:[],//全部下面的医师列表
            lenovoSearchParam:'',//联想词搜索的关键词
            hotList:[],//热词搜索列表
            customerId:"",//用户id
            keyWord:'',//搜索时的关键词
            hotNum:10,//PC热词限展示10个
            historyNum:10,//PC热词限展示10个
            pageIndex:0,//初始化请求第一条数据
            pageSize:20,//每次请求20条
            tabIndex:0,//默认tab栏全部点亮
            filtrateIndex:1//默认筛选栏综合点亮
        },
        init:function(){
            var t = this;
            t.getQueryKey().handleKeySearch().handleMoreDoctor().registerHandel().initTab().initFiltrateTab().initLenovo().getHotSearch().getHistorySearch().deleteHistory().feedBack().initSearchBtn();
            return t;
        },
        searchList:function(options){
            var t = this;//整个搜索逻辑的核心渲染代码
            var searchType = parseInt(options.searchType,10);
            var asyncCompleteNum = 0;//标识异步请求是否结束
            t.updateHistoryList(encodeURI(t.data.keyWord));//每次搜索一个词刷新一下历史搜索
            ////console.log("搜索类型-+-+-+【"+searchType+'】'+options.des);
            //0、query链接搜索，1、点击联想词搜索，2、点击历史词搜索，3、点击热词搜索，4、回车键搜索，5全部搜索，6，病例，7视频8会议9医师10文库11综合12最新13最热14手术视频
            var getSearchList = function(option){
                $.ajax({
                    url: option.path,    //请求的url地址
                    dataType: "json",   //返回格式为json
                    data: option.postData,    //参数值
                    type: 'GET',   //请求方式
                    beforeSend: function () {
                        //请求前的处理
                    },
                    success: function (data) {
                        if(t.checkResData(data)){
                            //数据获取成功
                            option.success&&option.success(data);
                        }else{
                            //数据获取失败
                        }
                    },
                    complete: function () {
                        //请求完成的处理
                        t.scrollTop();
                    },
                    error: function () {
                        //请求出错处理
                    }
                });
            };
            //0、query链接搜索，1、点击联想词搜索，2、点击历史词搜索，3、点击热词搜索，4、回车键搜索，5全部搜索，6，病例，7视频8会议9医师10文库11综合12最新13最热14手术视频
            var totalCount = 0;//当前请求结果的总数
            var searchAllOnOff = false;//是否是请求所有
            var searchAllCount = 0;//不包括医师数据的所有数据条数
            var searchDataListNum = 0;//记录当前请求页的数据长度，好判断分页器的显示与否
            var showAllinmdCollege = function(data){
                $(".al-allExperList").addClass('al-allExperList-college');
                var tmpl = $('#college').html();
                var compile = Handlebars.compile(tmpl);
                var result = compile(data.responseObject.responseData);
                $(".al-college-list").html(result);
                $(".al-college-searchModule").show();
                $("[data-courseId]").off("click").on("click",function(){
                    var _thisElement = $(this);
                    var courseid = _thisElement.attr("data-courseId");
                    //console.log(courseid);
                    window.location.href = '//www.allinmd.cn/pages/college/college_schedule.html?courseId='+courseid+'';
                })
            };
            var hideAllinmdCollege = function(){
                $(".al-allExperList").removeClass('al-allExperList-college');
                $(".al-college-searchModule").hide();
            };
            //console.log('隐藏');

            var searchAllData = function(){
                searchAllOnOff = true;
                if((parseInt(t.data.tabIndex,10)===0)){
                    if(t.data.allList===0){
                        getSearchList({//获取医师列表
                            postData:{
                                pageIndex:0,//	string	是
                                pageSize:t.data.pageSize,//	string	是
                                sortType:t.data.filtrateIndex,//	string	是
                                customerId:t.data.customerId,//	string	是
                                searchParam:$.trim(t.data.keyWord),//
                            },
                            path:t.path.doctor,
                            success:function(data){
                                t.data.allList++;
                                asyncCompleteNum++;
                                if(data.responseObject.responseData.dataList.length>0){
                                    t.data.doctorList = data.responseObject.responseData.dataList;
                                    searchDataListNum+=t.data.doctorList.length;
                                    t.data.doctorTotalCount = parseInt(data.responseObject.responseData.totalCount,10);
                                    totalCount+=t.data.doctorTotalCount;
                                    var tmpl = $('#expertTemplate').html();
                                    var compile = Handlebars.compile(tmpl);
                                    var result = compile(t.data);
                                    t.el.allDoctorContainer.html(result).show();
                                    //t.bindFollow(t.el.allDoctorContainer);
                                }else{
                                    //获取数据失败
                                    t.el.allDoctorContainer.html('').hide();
                                }
                            }
                        });
                    }else{
                        asyncCompleteNum++;
                        t.data.allList++;
                        searchDataListNum+=t.data.doctorList.length;
                        totalCount+=t.data.doctorTotalCount;
                    }
                }
                var paramJson = {};
                if(t.checkInvalid(t.data.customerId+'')){
                    //游客状态下
                    paramJson = {
                        collegeCourseState:0,
                        platformId:'1',//	string	是
                        pageIndex:t.data.pageIndex*t.data.pageSize,//	string	是
                        pageSize:t.data.pageSize,//	string	是
                        sortType:t.data.filtrateIndex,//	string	是
                        customerId:t.data.customerId,//	string	是
                        searchParam:$.trim(t.data.keyWord),//
                        appVersion:'3110'
                    };
                }else{
                    //非游客状态下
                    paramJson = {
                        //collegeCourseState:0,
                        platformId:'1',//	string	是
                        pageIndex:t.data.pageIndex*t.data.pageSize,//	string	是
                        pageSize:t.data.pageSize,//	string	是
                        sortType:t.data.filtrateIndex,//	string	是
                        customerId:t.data.customerId,//	string	是
                        searchParam:$.trim(t.data.keyWord),//
                        appVersion:'3110'
                    };
                }
                getSearchList({//获取全部数据列表
                    postData:paramJson,
                    path:t.path.allList,
                    success:function(data){
                        asyncCompleteNum++;
                        if(data.responseObject.responseData.dataList.length>0){
                            data.responseObject.responseData.dataList = t.checkListImage(data.responseObject.responseData.dataList);
                            searchDataListNum+=data.responseObject.responseData.dataList.length;
                            var tmpl = $('#allTemplate').html();
                            var compile = Handlebars.compile(tmpl);
                            var result = compile(data.responseObject.responseData);
                            t.el.searchPanel.html(result);
                            totalCount+=parseInt(data.responseObject.responseData.totalCount,10);
                            searchAllCount = data.responseObject.responseData.totalCount;
                        }else{
                            //获取数据失败
                            t.el.searchPanel.html('');
                        }
                    }
                });
                getSearchList({//获取唯医学院数据列表
                    postData:{
                        firstResult:0,//	string	是
                        maxResult:10000,//	string	是
                        appVersion:'3110',
                        customerId:t.data.customerId,//	string	是
                        searchParam:$.trim(t.data.keyWord),//
                    },
                    path:t.path.college,
                    success:function(data){
                        if(data.responseObject.responseData.dataList.length>0){
                            //唯医学院数据存在
                            showAllinmdCollege(data);
                        }else{
                            //获取唯医学院数据失败
                            hideAllinmdCollege(data);
                            //console.log('获取唯医学院数据失败');

                        }
                    }
                })
            };
            var searchCourseVideo = function(){
                var paramJson = {};
                if(t.checkInvalid(t.data.customerId+'')){
                    //游客状态下
                    paramJson = {
                        collegeCourseState:0,
                        pageIndex:t.data.pageIndex*t.data.pageSize,//	string	是
                        pageSize:t.data.pageSize,//	string	是
                        sortType:t.data.filtrateIndex,//	string	是
                        searchParam:$.trim(t.data.keyWord),//
                        appVersion:'3110'
                    };
                }else{
                    //非游客状态下
                    paramJson = {
                        //collegeCourseState:0,
                        pageIndex:t.data.pageIndex*t.data.pageSize,//	string	是
                        pageSize:t.data.pageSize,//	string	是
                        sortType:t.data.filtrateIndex,//	string	是
                        searchParam:$.trim(t.data.keyWord),//
                        appVersion:'3110'
                    };
                }
                getSearchList({//获取全部数据列表
                    postData:paramJson,
                    path:t.path.courseVideo,
                    success:function(data){
                        asyncCompleteNum = 2;
                        if(data.responseObject.responseData.dataList.length>0){
                            data.responseObject.responseData.dataList = t.checkListImage(data.responseObject.responseData.dataList);
                            searchDataListNum+=data.responseObject.responseData.dataList.length;
                            var tmpl = $('#videoTemplate').html();
                            var compile = Handlebars.compile(tmpl);
                            var result = compile(data.responseObject.responseData);
                            t.el.searchPanel.html(result);
                            totalCount+=parseInt(data.responseObject.responseData.totalCount,10);
                        }else{
                            //获取数据失败
                        }
                    }
                });
            };
            var searchOperateVideo = function(){
                var paramJson = {};
                if(t.checkInvalid(t.data.customerId+'')){
                    //游客状态下
                    paramJson = {
                        collegeCourseState:0,
                        sortType:1,//	string	是
                        pageIndex:t.data.pageIndex*t.data.pageSize,//	string	是
                        pageSize:t.data.pageSize,//	string	是
                        searchParam:$.trim(t.data.keyWord),//
                        appVersion:'3110'
                    };
                }else{
                    //非游客状态下
                    paramJson = {
                        //collegeCourseState:0,
                        sortType:1,//	string	是
                        pageIndex:t.data.pageIndex*t.data.pageSize,//	string	是
                        pageSize:t.data.pageSize,//	string	是
                        searchParam:$.trim(t.data.keyWord),//
                        appVersion:'3110'
                    };
                }
                getSearchList({//获取全部数据列表
                    postData:paramJson,
                    path:t.path.operationVideo,
                    success:function(data){
                        asyncCompleteNum = 2;
                        if(data.responseObject.responseData.dataList.length>0){
                            data.responseObject.responseData.dataList = t.checkListImage(data.responseObject.responseData.dataList);
                            searchDataListNum+=data.responseObject.responseData.dataList.length;
                            var tmpl = $('#videoTemplate').html();
                            var compile = Handlebars.compile(tmpl);
                            var result = compile(data.responseObject.responseData);
                            t.el.searchPanel.html(result);
                            totalCount+=parseInt(data.responseObject.responseData.totalCount,10);
                        }else{
                            //获取数据失败
                        }
                    }
                });
            }
            var searchCase = function(){
                getSearchList({//获取全部数据列表
                    postData:{
                        pageIndex:t.data.pageIndex*t.data.pageSize,//	string	是
                        pageSize:t.data.pageSize,//	string	是
                        sortType:t.data.filtrateIndex,//	string	是
                        searchParam:$.trim(t.data.keyWord)//
                    },
                    path:t.path.case,
                    success:function(data){
                        asyncCompleteNum = 2;
                        if(data.responseObject.responseData.dataList.length>0){
                            data.responseObject.responseData.dataList = t.checkListImage(data.responseObject.responseData.dataList);
                            searchDataListNum+=data.responseObject.responseData.dataList.length;
                            var tmpl = $('#caseTemplate').html();
                            var compile = Handlebars.compile(tmpl);
                            var result = compile(data.responseObject.responseData);
                            t.el.searchPanel.html(result);
                            totalCount+=parseInt(data.responseObject.responseData.totalCount,10);
                        }else{
                            //获取数据失败
                        }
                    }
                });
            };
            var searchConference = function(){
                getSearchList({//获取全部数据列表
                    postData:{
                        pageIndex:t.data.pageIndex*t.data.pageSize,//	string	是
                        pageSize:t.data.pageSize,//	string	是
                        sortType:t.data.filtrateIndex,//	string	是
                        searchParam:$.trim(t.data.keyWord)//
                    },
                    path:t.path.meeting,
                    success:function(data){
                        asyncCompleteNum = 2;
                        if(data.responseObject.responseData.dataList.length>0){
                            var tmpl = $('#meetingTemplate').html();
                            var compile = Handlebars.compile(tmpl);
                            var result = compile(data.responseObject.responseData);
                            searchDataListNum+=data.responseObject.responseData.dataList.length;
                            t.el.searchPanel.html(result);
                            totalCount+=parseInt(data.responseObject.responseData.totalCount,10);
                        }else{
                            //获取数据失败
                        }
                    }
                });
            };
            var searchDoctor = function(){
                getSearchList({//获取全部数据列表
                    postData:{
                        customerId:t.data.customerId,
                        pageIndex:t.data.pageIndex*t.data.pageSize,//	string	是
                        pageSize:t.data.pageSize,//	string	是
                        sortType:t.data.filtrateIndex,//	string	是
                        searchParam:$.trim(t.data.keyWord)//
                    },
                    path:t.path.doctor,
                    success:function(data){
                        asyncCompleteNum = 2;
                        if(data.responseObject.responseData.dataList.length>0){
                            var tmpl = $('#doctorTemplate').html();
                            var compile = Handlebars.compile(tmpl);
                            var result = compile(data.responseObject.responseData);
                            searchDataListNum+=data.responseObject.responseData.dataList.length;
                            t.el.searchPanel.html(result);
                            totalCount+=parseInt(data.responseObject.responseData.totalCount,10);
                            t.bindFollow(t.el.searchPanel);
                        }else{
                            //获取数据失败
                        }
                    }
                });
            };
            var searchDoc = function(){
                getSearchList({//获取全部数据列表
                    postData:{
                        pageIndex:t.data.pageIndex*t.data.pageSize,//	string	是
                        pageSize:t.data.pageSize,//	string	是
                        sortType:t.data.filtrateIndex,//	string	是
                        searchParam:$.trim(t.data.keyWord)//
                    },
                    path:t.path.doc,
                    success:function(data){
                        asyncCompleteNum = 2;
                        if(data.responseObject.responseData.dataList.length>0){
                            var tmpl = $('#docTemplate').html();
                            var compile = Handlebars.compile(tmpl);
                            data.responseObject.responseData.dataList = t.checkListImage(data.responseObject.responseData.dataList);
                            var result = compile(data.responseObject.responseData);
                            searchDataListNum+=data.responseObject.responseData.dataList.length;
                            t.el.searchPanel.html(result);
                            totalCount+=parseInt(data.responseObject.responseData.totalCount,10);
                        }else{
                            //获取数据失败
                        }
                    }
                });
            };
            var searchPoduct = function(){
                /*firstResult	Integer
分页参数	0
maxResult	Integer
分页参数	10
dataType	Integer	是	返回数据类型	1-全部 2产品列表
searchParam*/
                getSearchList({//获取全部数据列表
                    postData:{
                        firstResult:t.data.pageIndex*t.data.pageSize,//	string	是
                        maxResult:t.data.pageSize,//	string	是
                        dataType:2,//	string	是
                        searchParam:$.trim(t.data.keyWord)//
                    },
                    path:t.path.products,
                    success:function(data){
                        asyncCompleteNum = 2;
                        if(data.responseObject.responseData.dataList.length>0){
                            //console.log(data.responseObject.responseData.dataList);
                            var tmpl = $('#productTemplate').html();
                            var compile = Handlebars.compile(tmpl);
                            data.responseObject.responseData.dataList = t.checkListImage(data.responseObject.responseData.dataList);
                            var result = compile(data.responseObject.responseData);
                            searchDataListNum+=data.responseObject.responseData.dataList.length;
                            t.el.searchPanel.html(result);
                            //debugger;
                            totalCount+=parseInt(data.responseObject.responseData.dataCount,10);
                            t.el.totalCount.show().find(".al-search-totalCountInner").html('为您找到'+totalCount+'个结果');
                            t.checkProduct();
                        }else{
                            //获取数据失败
                        }
                    }
                });
            };
            var filtreteSearch = function(){
                switch (t.data.tabIndex){
                    case 0://全部
                        searchAllData();
                        break;
                    case 1://病例
                        searchCase();
                        hideAllinmdCollege();
                        break;
                    case 2://视频
                        searchCourseVideo();
                        hideAllinmdCollege();
                        break;
                }
            };
            switch (searchType){
                case 0://query链接搜索
                case 1://点击联想词搜索
                case 2://点击历史词搜索
                case 3://点击热词搜索
                case 4://回车键搜索
                case 5://全部搜索
                case 15://点击搜索按钮搜索
                    if(searchType>0){
                        t.initSearchPage();
                    }
                    searchAllData();
                    break;
                case 6://病例tab搜索
                    searchCase();
                    hideAllinmdCollege();
                    break;
                case 7://视频tab搜索
                    searchCourseVideo();
                    hideAllinmdCollege();
                    break;
                case 8://会议tab搜索
                    searchConference();
                    hideAllinmdCollege();
                    break;
                case 9://医师tab搜索
                    searchDoctor();
                    hideAllinmdCollege();
                    break;
                case 10://文库tab搜索
                    hideAllinmdCollege();
                    searchDoc();
                    break;
                case 17://产品tab搜索
                    searchPoduct();
                    hideAllinmdCollege();
                    break;
                case 11://综合tab搜索
                case 12://最新tab搜索
                case 13://最热tab搜索
                    t.data.pageIndex = 0;
                    filtreteSearch();
                    break;
                case 14://手术视频tab搜索
                    t.data.pageIndex = 0;
                    searchOperateVideo();
                    break;
                case 16://点击分页
                    switch (parseInt(t.data.tabIndex,10)) {
                        case 0:
                            searchAllData();
                            break;
                        case 1:
                            searchCase();
                            hideAllinmdCollege();
                            break;
                        case 2:
                            if(parseInt(t.data.filtrateIndex,10)===4){
                                searchOperateVideo();
                            }else{
                                searchCourseVideo();
                            }
                            break;
                        case 3:
                            searchConference();
                            hideAllinmdCollege();
                            break;
                        case 4:
                            searchDoctor();
                            hideAllinmdCollege();
                            break;
                        case 5:
                            searchDoc();
                            hideAllinmdCollege();
                            break;
                        case 12:
                            searchPoduct();
                            hideAllinmdCollege();
                            break;
                    }

                    break;
            }

            var PageClick = function(pageclickednumber){
                t.data.pageIndex = parseInt(pageclickednumber,10)-1;
                t.searchList({
                    searchType:16,
                    des:'分页器'+$.trim($(".al-searchMain_ul .active"))+'点击搜索'
                });
            };
            clearInterval(countInterval);
            var countInterval = setInterval(function(){
                //console.log(asyncCompleteNum);
                if(asyncCompleteNum===2){
                    t.setTotalCount(totalCount);
                    if(searchDataListNum<t.data.pageSize&&t.data.pageIndex===0){//？？？原来写的t.data.pageIndex===1应该是判断是第一页，所以改成了0
                        t.el.pager.hide();
                    }else{
                        if(searchAllOnOff){
                            t.el.pager.pager({
                                pagenumber: t.data.pageIndex+1,
                                pagecount: Math.ceil(searchAllCount / t.data.pageSize),
                                buttonClickCallback: PageClick
                            });
                        }else{
                            //console.log('这里');
                            t.el.pager.pager({
                                pagenumber: t.data.pageIndex+1,
                                pagecount: Math.ceil(totalCount / t.data.pageSize),
                                buttonClickCallback: PageClick
                            });
                        }
                    }
                    clearInterval(countInterval);
                }
            },400);
        },
        initSearchBtn:function(){
          var t = this;
          t.el.searchBtn.off("click").on("click",function(){
              var searchParam = $.trim(t.el.inputBar.val());
              if(t.checkInvalid(searchParam)){
                  return false;
              }else{
                  t.setKeyWord({txt:searchParam,des:'点击搜索按钮',searchType:15});
              }

          });
        },
        checkMedPlus:function(){
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

        },
        checkProduct:function(){
          var t = this;
            $('.al-productItem').off("click").on("click",function(){
                t.checkMedPlus();
            });
        },
        feedBack:function(){
          var t = this;
            $(".al-addOne").off("click").on("click",".al_searchMain_error",function(){
                module.feedback({
                    suggestionType:3
                });
            });
            return t;
        },
        searchNothing:function(){
          var t = this;
          var tmpl = $('#nothingTemplate').html();
          t.el.searchPanel.html(tmpl);
            t.el.allDoctorContainer.html('').hide();
        },
        initSearchPage:function(){
          var t = this;
          t.data.allList = 0;
          t.data.pageIndex = 0;
          t.el.tab.eq(0).addClass('active').siblings().removeClass('active');
          t.data.tabIndex = 0;
          t.el.filtrate.show();
          t.el.filtrate.find("li").eq(0).addClass("active").siblings().removeClass('active');
          t.data.filtrateIndex = 1;
          t.el.videoFiltrate.hide();
          t.el.totalCount.hide();
        },
        scrollTop:function(){
            $(window).scrollTop(0);  //点击页码回到顶部----公共方法----
        },
        updateHistoryList:function(keyWord){
          var t = this;
            var list = [];
          var searchHistoryList = comm.cookie.get("searchHistoryList"+t.data.customerId);
          if(searchHistoryList&&(JSON.parse(decodeURIComponent(searchHistoryList))).length>0){
              var hasData = true;
              list = JSON.parse(decodeURIComponent(searchHistoryList));
              for(var num = 0;num<list.length;num++){
                  if($.trim(keyWord)===$.trim(list[num]['searchKey'])){
                      hasData = false;
                  }
              }
              if(hasData){
                  list.unshift({
                      searchKey:keyWord
                  });
              }
          }else{
               list = [
                  {
                      searchKey:keyWord
                  }
              ];
          }
            var  lastList = list.slice(0,t.data.historyNum);
            comm.cookie.set("searchHistoryList"+t.data.customerId,encodeURIComponent(JSON.stringify(lastList)),365*5);
          t.getHistorySearch();

        },
        changeList:function(data){
            var originalData = JSON.parse(JSON.stringify(data));
            for(var num = 0;num<originalData.length;num++){
                var item = originalData[num];
                item.searchKey = decodeURI(item.searchKey);
            }
            return originalData;
        },
        checkListImage:function(list){
            var t = this;
            var originalData = JSON.parse(JSON.stringify(list));
            for(var num = 0;num<originalData.length;num++){
                var dataItem = originalData[num];
                originalData[num]['haveImage'] = !t.checkInvalid(dataItem['picUrl']);
            }
            return originalData;
        },
        handleMoreDoctor:function(){
          var t = this;
          $(".al-searchMain").on("click",'.al-expertBoxMore',function(){
              $(".al-searchMain_ul li[data-id='5']").trigger("click");
          });
          return t;
        },
        bindFollow:function(elementList){
            var btnTypeOnOff = elementList.find(".ev-followBtn").length>0;
            elementList.find(".ev-followAllBtn,.ev-followBtn").each(function(i,em){
                var fid=$(em).attr("data-id");
                var relationship=parseInt($(em).attr("relationship"));
                $(em).follow({fStatus:relationship,classStyle:"gz_but",fId:fid,picStyle:8,canToggle:false});
                if(btnTypeOnOff){
                    $(em).find(".gz_but img").attr({"src":"//img10.allinmd.cn/v3/common/followBtn/docList_followBtn.png"});
                }
            });
            return elementList;
        },
        setTotalCount:function(num){
          var t = this;
            t.data.totalCount = isNaN(parseInt(num,10))?0:parseInt(num,10);
            //console.log(t.data.totalCount);
            if(t.data.totalCount==0){
                t.searchNothing();
                t.el.allNumPanel.show();
            }else{
                if(t.data.tabIndex!==0){
                    t.el.allNumPanel.hide();
                }
            }
            t.el.countNum.show().find('span').html(t.data.totalCount);
        },
        deleteHistory:function(){
          var t = this;//删除搜索历史
          t.el.deleteHistoryBar.off("click").on("click",function(){
              var _isThis = $(this);
              t.el.deleteConfirm.show();
              t.el.deleteConfirm.find(".al-deletePromptClose,.deleteFooter_cancel").off("click").on("click",function(){
                  t.el.deleteConfirm.hide();
              });
              t.el.deleteConfirm.find(".deleteFooter_sure").off("click").on("click",function(){
                  t.el.deleteConfirm.hide();
                  t.el.historyContainer.hide().find("ul").html('');
                  t.data.historyList = [];
                  comm.cookie.deleteFn("searchHistoryList"+t.data.customerId);
              });
              t.el.deleteConfirm.find(".deleteFooter_cancel").off("click").on("click",function(){
                  t.el.deleteConfirm.hide();
                  //t.el.historyContainer.hide().find("ul").html('');
              });
          });
          return t;
        },
        setKeyWord:function(option){
            var t = this;
            var postData = {
                searchParam:$.trim(option.txt)
            };
            $.ajax({
                url: t.path.realSearchParam,    //请求的url地址
                dataType: "json",   //返回格式为json
                data: postData,    //参数值
                type: 'GET',   //请求方式
                beforeSend: function () {
                    //请求前的处理
                },
                success: function (data) {
                    if(t.checkResData(data)){
                        //数据获取成功
                        var dataList=data.responseObject.responseData.dataList;
                        if(dataList.length>0){
                            t.el.errorCorrection.show().html(dataList[0]['realSearchParam']);
                        }else{
                            t.el.errorCorrection.hide().html('');
                            //数据获取失败
                        }
                    }else{
                        t.el.errorCorrection.hide().html('');
                        //数据获取失败
                    }
                },
                complete: function () {
                    //请求完成的处理
                    t.data.keyWord = $.trim(option.txt);
                    t.el.inputBar.val($.trim(option.txt));
                    t.el.lenovoContainer.html('').hide();
                    t.searchList({
                        des:option.des,
                        searchType:option.searchType
                    });
                },
                error: function () {
                    //请求出错处理
                }
            });
            return t;
        },
        formateDate:function(time){
            var t = this;
            //2014-10-12 16:00:00
            time = time.replace(/-/g,'/');
            if(t.checkInvalid(time)){
                return '';
            }else{
                var today = new Date();//获得当前日期
                var year = today.getFullYear();//获得年份
                var meetYear = parseInt(time.substring(0,4),10);
                var reg = /\d{2}\/\d{2}\s/g;
                if(meetYear<year){
                    return meetYear+'/'+(time.match(reg))[0];
                }else{
                    return (time.match(reg))[0];
                }
            }
        },
        handleKeySearch:function(){
          var t = this;
          $(".al-mainInner").on("click",".ev-search-keyWord",function(e){
              var _isThis = $(this);
              var keyWordType = parseInt(_isThis.attr("data-keyWordType"),10);
              var searchDes = '';
              switch (keyWordType){
                  case 1:
                      searchDes = '联想词点击请求搜索';
                      break;
                  case 2:
                      searchDes = '历史词点击请求搜索';
                      break;
                  case 3:
                      searchDes = '热词点击请求搜索';
                      break;
              }
              t.setKeyWord({txt:_isThis.text(),des:searchDes,searchType:keyWordType});
          });
          return t;
        },
        registerHandel:function(){
          var t = this;
            Handlebars.registerHelper('formateMeetingDate',function(v1,v2){
                return t.formateDate(v1)+'-'+t.formateDate(v1);
            });
            Handlebars.registerHelper('formNewestNum',function(v1){
                return '更新至第'+parseInt(v1,10)+'讲';
            });
            Handlebars.registerHelper('checkNewNum',function(v1,v2,options){
                if((parseInt(v1,10)===parseInt(v2,10))&&(parseInt(v1,10)!==0)){
                    return  '';
                }else if((parseInt(v1,10)===0)||(parseInt(v2,10)===0)){
                    return  '';
                }else{
                    return  options.fn(this);
                }
            });
            Handlebars.registerHelper('preWord',function(v,options){
                var type = parseInt(v,10);
                if (type === 2) {
                    return options.fn(this);
                } else {
                    return "";
                }
            });
            Handlebars.registerHelper('checkPrice',function(v,options){
                if (!comm.checkInvalid(v)) {
                    if((!isNaN(parseInt(v,10)))&&parseInt(v,10)!==0){
                        return options.fn(this);
                    }else{
                        return "";
                    }
                } else {
                    return "";
                }
            });
            Handlebars.registerHelper('college',function(v,options){
                var type = parseInt(v,10);
                if (type === 1) {
                    return options.fn(this);
                } else {
                    return "";
                }
            });
            Handlebars.registerHelper('hideOnOff',function(v){
                var type = parseInt(v,10);
                if(t.checkInvalid(v)){
                    return 'hide';
                }else{
                    if (type === 1) {
                        return '';
                    } else {
                        return "hide";
                    }
                }
            });
            Handlebars.registerHelper('authorStr',function(v){
                if(t.checkInvalid(v)){
                    return '';
                }else{
                    var moreOnOff = v.indexOf(",")>-1;
                    var authorStr = moreOnOff?v.split(",")[0]+'等人':v;
                    return authorStr;
                }
            });
            Handlebars.registerHelper('moreDoctor',function(v,options){
                var index = parseInt(v,10);
                if (index <2) {
                    return options.fn(this);
                } else if(index ===2) {
                    return "<div class=\"al-expertBoxMore\"><p class=\"al-moreExpert\">更多</p><i class='icon'></i></div>";
                }else{
                    return '';
                }
            });
            Handlebars.registerHelper('checkCustomerIdHref',function(v){
                if(t.checkInvalid(v)){
                    return 'javascript:void(0);'
                }else{
                    if(v==t.data.customerId){
                        return '/pages/personal/personal_contribution.html';
                    }else{
                        return '/pages/personal/others_contribution.html?cid='+v;
                    }
                }
            });
            Handlebars.registerHelper("recommendClass",function(v){
                var type = parseInt(v,10);
                if(type===1){
                    return "recommend";
                } else{
                    return "";
                }

            });
            Handlebars.registerHelper("highLightKeyWord",function(v){
                var type = parseInt(v,10);
                if(type===1){
                    return "recommendType";
                } else{
                    return "";
                }

            });
            Handlebars.registerHelper("openUrlType",function(v){
                if(t.checkInvalid(v)){
                    return '_self'
                }else{
                    return '_blank';
                }

            });
            Handlebars.registerHelper("checkPageUrl",function(v){
                if(t.checkInvalid(v)){
                    return 'javascript:void(0);'
                }else{
                    return v;
                }

            });
            Handlebars.registerHelper("resource",function(v,options){
                var type = parseInt(v,10);
                if(type===1||type===2||type===7){
                    return options.fn(this);
                } else{
                    return "";
                }

            });
            Handlebars.registerHelper("checkCourseType",function(v,options){
                var type = parseInt(v,10);
                if(type===3){
                    return options.fn(this);
                } else{
                    return "";
                }

            });
            Handlebars.registerHelper("checkDes",function(v1,v2){
                var type = parseInt(v1,10);
                if(type===3){
                    return "会员免费";
                } else{
                    return v2+"元";
                }

            });
            Handlebars.registerHelper('toW',function(v){
                var num = parseInt(v,10);
                return num.toWan();
            });
            Handlebars.registerHelper("resourceCustomer",function(v){
                if(t.checkInvalid(v)){
                    return "hide";
                } else{
                    return "";
                }
            });
            Handlebars.registerHelper("formatLenovoKeyword",function(v){
                var r = RegExp(t.data.lenovoSearchParam,"g");
                return new Handlebars.SafeString((v).replace(r,"<em>"+t.data.lenovoSearchParam+"</em>"));

            });
          return t;
        },
        initFiltrateTab:function(){
          var t = this;//初始化综合、最新、最热的筛选搜索
          t.el.filtrate.find("li").off("click").on("click",function(){
             var _isThis = $(this);
             var tabIndex = parseInt(_isThis.attr("sortType"),10);
             if(t.data.filtrateIndex===parseInt(tabIndex,10)){
                 return false;
             }else{
                 t.data.filtrateIndex=parseInt(tabIndex,10);
                 _isThis.addClass('active').siblings().removeClass("active");
                 var searchDes = '';
                 switch (tabIndex){
                     case 1:
                         searchDes = '综合点击搜索';
                         break;
                     case 2:
                         searchDes = '最新点击搜索';
                         break;
                     case 3:
                         searchDes = '最热点击搜索';
                         break;
                     case 4:
                         searchDes = '手术视频点击搜索';
                         break;
                 }
                 t.searchList({
                     des:searchDes,
                     searchType:(10+tabIndex)
                 });
             }
          });
          return t;
        },
        initTab:function(){
            var t = this;
            t.el.tab.off("click").on("click",function(){
                var _isThis = $(this);
                var tabIndex = parseInt(_isThis.attr('index'),10);
                if(tabIndex===t.data.tabIndex){
                    return false;
                }else{
                    _isThis.addClass('active').siblings().removeClass('active');//点亮当前的tab
                    t.el.filtrate.find("li").eq(0).addClass('active').siblings().removeClass('active');//点亮当前的tab
                    t.data.filtrateIndex = 1;//还原二级筛选的默认值
                    t.data.pageIndex = 0;
                    t.data.tabIndex = parseInt(tabIndex,10);//保存当前的索引值
                    if(t.data.tabIndex>2){
                        t.el.filtrate.hide();
                    }else if(t.data.tabIndex===2){
                        t.el.videoFiltrate.show();
                        t.el.filtrate.show();
                    }else{
                        t.el.videoFiltrate.hide();
                        t.el.filtrate.show();
                    }
                    if(t.data.tabIndex===0){//纠错词，总数和全部下的讲师列表只在全部下展示
                        t.el.allNumPanel.show();
                    }else{
                        t.el.allNumPanel.hide();
                    }
                    var searchDes = "";
                    switch (t.data.tabIndex){
                        case 0:
                            searchDes = '点击全部搜索';
                            break;
                        case 1:
                            searchDes = '点击病例搜索';
                            break;
                        case 2:
                            searchDes = '点击视频搜索';
                            break;
                        case 3:
                            searchDes = '点击会议搜索';
                            break;
                        case 4:
                            searchDes = '点击医师搜索';
                            break;
                        case 5:
                            searchDes = '点击文库搜索';
                            break;
                    }
                    t.searchList({
                        des:searchDes,
                        searchType:(5+t.data.tabIndex)
                    });
                }
            });
            return t;
        },
        getHotSearch:function(){
          //获取热门搜索
          var t = this;
          var postData = {
              sortType:1
          };
            $.ajax({
                url: t.path.hot,    //请求的url地址
                dataType: "json",   //返回格式为json
                data: postData,    //参数值
                type: 'GET',   //请求方式
                beforeSend: function () {
                    //请求前的处理
                },
                success: function (data) {
                    if(t.checkResData(data)){
                        //数据获取成功
                        var dataList=data.responseObject.responseData.dataList;
                        t.data.hotList=dataList.slice(0,t.data.hotNum);
                        if(t.data.hotList.length>0){
                            var tmpl = $('#hotTemplate').html();
                            var compile = Handlebars.compile(tmpl);
                            var result = compile(t.data);
                            t.el.hotContainer.show().find("ul").html(result);
                        }else{
                            //数据获取失败
                        }
                    }else{
                        //数据获取失败
                    }
                },
                complete: function () {
                    //请求完成的处理
                },
                error: function () {
                    //请求出错处理
                }
            });
          return t;
        },
        correctRecommendType:function(list){
          var t = this;//之所以写这个方法是因为正常的预填充词recommendType为2，但是后台将这个字段写死为0，前端过滤纠正一下，方便判断
          var originalList = JSON.parse(JSON.stringify(list));
          for(var i = 0;i<originalList.length;i++){
              originalList[i]['recommendType']=2;
          }
          return originalList;
        },
        getHistorySearch:function(){
            //获取历史搜索
          var t = this;
            if(comm.cookie.get("searchHistoryList"+t.data.customerId)){
                t.data.historyList = JSON.parse(decodeURIComponent(comm.cookie.get("searchHistoryList"+t.data.customerId)));
                t.data.historyList = t.changeList(t.data.historyList);
                var tmpl = $('#historyTemplate').html();
                var compile = Handlebars.compile(tmpl);
                t.data.historyList = t.data.historyList.slice(0,t.historyNum);
                var result = compile(t.data);
                t.data.historyList.length>0?t.el.historyContainer.show().find("ul").html(result):t.el.historyContainer.hide().find("ul").html('');
            }
          return t;
        },
        initLenovo:function(){
            //初始化联想词逻辑
          var t = this;
          var newFlag = true;
          var newTimer = null;
          $('body').off("mouseup").on("mouseup",function(e){
             if(!$(e.target).hasClass("ev-search-keyWord")){
                 t.el.lenovoContainer.html('').hide();
             }
          });
          t.el.inputBar.off("compositionstart").on("compositionstart",function(){
              newFlag = false;
          });
            t.el.inputBar.off("compositionend").on("compositionstart",function(){
                newFlag = true;
            });
            t.el.inputBar.off("input propertychange keyup").on("input propertychange keyup",function(event){
                clearTimeout(newTimer);
                t.data.lenovoSearchParam = $.trim(event.target.value);
                if(newFlag&&!t.checkInvalid(t.data.lenovoSearchParam)){
                    var postData = {
                        "searchParam":t.data.lenovoSearchParam
                    };
                    if (event.keyCode == 13) {
                        t.el.lenovoContainer.html('').hide();
                        t.setKeyWord({txt:$.trim(event.target.value),des:'回车键搜索',searchType:4});
                        clearTimeout(newTimer);
                        return false;
                    }
                    newTimer = setTimeout(function(){
                        $.ajax({
                            url: t.path.lenovo,    //请求的url地址
                            dataType: "json",   //返回格式为json
                            data: postData,    //参数值
                            type: 'GET',   //请求方式
                            beforeSend: function () {
                                //请求前的处理
                            },
                            success: function (data) {
                                if(t.checkResData(data)){
                                    //数据获取成功
                                    var dataList=data.responseObject.responseData.dataList;
                                    if(dataList.length>0){
                                        var tmpl = $('#lenovoTemplate').html();
                                        var compile = Handlebars.compile(tmpl);
                                        var result = compile(data.responseObject.responseData);
                                        t.el.lenovoContainer.html(result).show();
                                    }else{
                                        //数据获取失败
                                        t.el.lenovoContainer.html('').hide();
                                    }
                                }else{
                                    t.el.lenovoContainer.html('').hide();
                                    //数据获取失败
                                }
                            },
                            complete: function () {
                                //请求完成的处理
                            },
                            error: function () {
                                t.el.lenovoContainer.html('').hide();
                                //请求出错处理
                            }
                        });
                    },500);
                }else{
                    //获取数据失败
                    t.el.lenovoContainer.html('').hide();
                }
            });
          return t;
        },
        getQueryKey:function(){
            var t = this;//获取其他页面来源的query参数keyword
            var para=comm.getpara();
            if(!t.checkInvalid(para.keyword)){
                t.setKeyWord({txt:para.keyword,des:'URL参数请求的搜索',searchType:0});
                document.title="搜索：［"+para.keyword+"］- 唯医,allinmd";
                $("meta[name=Keywords]").attr("content","［"+para.keyword+"］,［"+para.keyword+"］视频,［"+para.keyword+"］文章,病例,唯医,allinmd");
            }
            t.data.customerId = t.checkInvalid($('#sesCustomerId').val())?"":$('#sesCustomerId').val();
            return t;
        },
        checkInvalid:function(val) {
            if (((typeof val == 'string') && (val.length == 0)) || (val == undefined) || (val == 'undefined') || (val == 'null') || (typeof val == 'undefined') || (typeof val == 'null') || (val == null)) {
                return true;
            } else {
                return false;
            }
        },
        checkResData:function(data){
            if(data&&data.responseObject&&data.responseObject.responseData&&(!$.isEmptyObject(data.responseObject.responseData))){
                    return true;
            }else{
                    return false;
            }
        }
    };
    allinmdSearch.init();
});
