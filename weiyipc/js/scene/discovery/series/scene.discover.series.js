/**
 * Created by zhangheng on 2017/5/17.
 *
 */
$(document).ready(function(){
    var config = {
        //关于页面初始化的一些配置，基本元素，基本接口，基本参数
        element: {
            seriesTab:$(".au-series-tab"),//tab栏切换元素
            contentObj:$(".au-series-container"),//正中间展示系列课程数据的容器
            yiDingModule:$(".ydCourse"),//医鼎相关课程的容器
            yiDingObj:$(".au-about-yd"),//医鼎相关课程容器
            welcomeTeacher:$(".ev_mayKnowPerson"),//受欢迎的讲师的容器
            moreTeacher:$(".al_dis_professor .al_dis_more").eq(0)//更多讲师的按钮
        },
        ajaxPort: {
            courseType:"/call/cms/course/getHotCourseList/",//tab切换时的接口
            welcomeTeacher:"/call/cms/course/getHotAuthorList/",//受欢迎的讲师
            enjoyedTeacher:"/call/customer/pundits/getPunditsCustomerList/"//受欢迎的讲师

        },
        parameter: {
            "platformId": $('#sesDepartment').val() == undefined ? 1 : $('#sesDepartment').val(),
            customerId:$('#sesCustomerId').val()!=""&&$('#sesCustomerId').val()!=undefined?$('#sesCustomerId').val():"",
            pageIndex:0,//分页器的索引值
            pageCount:0,//分页器总个数
            pageSize:15,//每次请求的条数为15条，这里设置可以随时更改，视产品需求而定
            courseType:0,//推荐课程，创伤课程，记住课程，关节课程,
            courseSubjectTeamId:[0,9,7,2]//tab切换的类型值
        }
    };
    var operateData = {
        //关于页面操作数据的一系列方法
        localCtnData:function(data){
            var returnData = [];
            $.each(data, function (i, v) {
                var dataJson = {};
                var timeLimit = (v.coursePrice>0)?"0":"1";
                dataJson.collect = {};
                if(v.isCollected!=0){
                    dataJson.collect.state = "1";
                }
                dataJson.linkUrl = "/pages/discover/series/discover_series_details.html?tId=" + v.courseId;
                dataJson.courseNum = v.catalogNum;
                dataJson.reviewNum = (v.totalLearnNum>0)?v.totalLearnNum.toWKH():v.totalLearnNum;
                dataJson.title = comm.getStrLen(v.courseName, 24);
                dataJson.id = v.courseId;
                dataJson.timeLimit = timeLimit;
                dataJson.imgSrc = v.courseCoverPicUrl;

                returnData.push(dataJson);
            });
            // //console.log(returnData)
            return returnData;
        },
        localYiDing:function(data){
            var returnData = [];
           $.each(data,function(i,v){
                var dataJson = {};
                if(i>4){
                    return false;
                }
               dataJson.index = i+1;
                dataJson.courseNum =v.classNum;
                dataJson.id =v.seriesId;
                dataJson.imgSrc =v.seriesPicUrl;
                dataJson.title = comm.getStrLen(v.seriesTitle, 30);
                dataJson.linkUrl = v.pageStoragePath;
                returnData.push(dataJson);
           });
           return returnData;
        },
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
        showSeriesList:function(data){//将系列课程数据进行前端展示逻辑的处理
            var returnData = [];
            $.each(data,function(index,val){
                var jsonItem = {};
                var collectClass = "";
                var collectId = "";
                // //console.log(val.collect,$.isEmptyObject(val.collect))
                if($.isEmptyObject(val.collect)){
                    collectClass = "hide";
                }else{
                    collectId = val.collect.collectId;
                }
                var timeLimitClass = "hide";
                if(Number(val.timeLimit)===1){
                    timeLimitClass = "";
                }
                jsonItem = val;
                jsonItem.collectClass = collectClass;
                jsonItem.collectId = collectId;
                jsonItem.timeLimitClass = timeLimitClass;
                returnData.push(jsonItem);
            });
            return returnData;
        }
    };
    var template = {
        welcomeTeacher:function(data){
            var welcomeTeacherDomList = [];
          $.each(data,function(i,v){
              if(i>3){
                  return false;
              }
              var teacherItem = '<div class="al-discover_knowZj">'+
                  '	<a href="/pages/personal/others_contribution.html?cid='+v.customerId+'" target="_blank" class="al-discover_ZjUser"><img src="'+v.logoUrl+'" alt=""></a><figure class="al-discover_ZjDetail"><a href="/pages/personal/others_contribution.html?cid='+v.customerId+'" target="_blank">'+v.name+'</a>'+
                  '	<p>'+comm.cutLine(comm.strHandle.cutDoctorTitle(v.medicalTitle),"_",",")+''+
                  '	</p>'+
                  '	<p class="al-dis-company">'+
                  '		'+v.company+''+
                  '	</p>'+
                  '	<div class="follow">'+
                  '	</div>'+
                  '	</figure>'+
                  '</div>';
              var htmlDom =$(teacherItem);
              htmlDom.find('.follow').follow({fId:v.customerId,fStatus:parseInt(v.isFollower)+1,picStyle:5,canToggle:false});
              welcomeTeacherDomList.push(htmlDom);
          }) ;
          return welcomeTeacherDomList;
        },
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
            "welcomeTeacher":'<div class="al-discover_knowZj">'+
            '	<a href="/pages/personal/others_contribution.html?cid=$customerId$" target="_blank" class="al-discover_ZjUser"><img src="$logoUrl$" alt=""></a><figure class="al-discover_ZjDetail"><a href="/pages/personal/others_contribution.html?cid=$customerId$" target="_blank">$name$</a>'+
            '	<p>$medicalTitle$'+
            '	</p>'+
            '	<p class="al-dis-company">'+
            '		$company$'+
            '	</p>'+
            '	<div class="follow">'+
            '	</div>'+
            '	</figure>'+
            '</div>',
            "yiDing":'<li data-seriesId="$id$" data-href="$linkUrl$" data-log-record="true" data-actionId="11004" data-keyword="医鼎相关课程" data-triggerType = "系列课"  data-browType="202" data-log-index="$index$" data-log-id="$id$">'+
            '<a href="$linkUrl$" target="_blank">' +
            '<figure><img src="$imgSrc$"></figure>'+
            '<fieldset>'+
            '	<p class="title">'+
            '		$title$'+
            '	</p>'+
            '	<p>'+
            '		$courseNum$课时'+
            '	</p>'+
            '</fieldset>'+
            "</a>"+
            '</li>',
            "content":'<li data-href="$linkUrl$" data-seriesId="$id$">'+
                '<a href="$linkUrl$">' +
            '<img src="$imgSrc$">'+
             '<aside class="title">$title$</aside>'+
            '<aside class="classNum"><i></i>$reviewNum$<span>$courseNum$节课</span><span class="collection $collectClass$" data-collectId="$collectId$"><i></i>已收藏</span></aside>'+
            '<aside class="function"><span class="timeLimit $timeLimitClass$">限时免费</span></aside>'+
            "</a>"+
            '</li>'
        }
    };
    var courseSerial = {
        //页面中用的的工具性方法
        init:function(){
            var t = this;//初始化的时候需要展示推荐的系列课程的相关数据，在点击tab切换的时候点击分页器的时候也触发系列课程的相关数据展示
            /*初始化展示相关推荐的数据，初始换tab切换的点击事件，初始化可能认识人的数据，（这不分后台接口有变化，是自己展示的数据）*/
            //comm.Log.createBrowse({href:window.location.href,id:202,name:'系列课-推荐、创伤、脊柱、关节'});
            setTimeout(function(){
                g_sps&&g_sps.createBrowse({pageId:202})
            },2000);
            t.demoContent().tabSwitch().authYouKnow();
            return t;
        },
        pageClick:function(num){//分页器点击回调
            var t = courseSerial;
            // //console.log(num)
            if(num-1==config.parameter.pageIndex){
                return false;
            }
            config.parameter.pageIndex = num-1;
            t.demoContent();
            //debugger;
            return t;

        },
        demoContent:function(){
            //展示中间的内容，和医鼎相课程
            var t = courseSerial;
            operateData.requestData({
                port: config.ajaxPort.courseType,
                get:true,
                postData: {
                    "customerId": config.parameter.customerId,
                    "isValid": 1,
                    "platformId": config.parameter.platformId,
                    "firstResult": config.parameter.pageIndex * config.parameter.pageSize,
                    "maxResult": config.parameter.pageSize,
                    "sortType": 5,                  // tab默认页传“5”，
                    "courseSubjectTeamId": config.parameter.courseSubjectTeamId[config.parameter.courseType]   //学组id，发现页传“-1”，tab默认页传0，2-关节，7-脊柱，9-创伤
                },
                success: function (req) {
                    var listNum = req.responseObject.responseData.data_size;
                    var pageNum = Math.ceil(listNum / config.parameter.pageSize);
                    var localData = operateData.localCtnData(req.responseObject.responseData.data_list);
                    config.parameter.contentData = operateData.showSeriesList(localData);
                    config.element.contentObj.html(template.produce(["content"],config.parameter.contentData));
                    var localYidingData = operateData.localYiDing(req.responseObject.responseData.yiding_list);
                    if(localYidingData.length>0){
                        config.element.yiDingObj.html(template.produce(["yiDing"],localYidingData));
                        config.element.yiDingModule.show();
                    }else{
                        config.element.yiDingModule.hide();
                    }
                    if(listNum>15){
                        $('.pager').pager({
                            pagenumber: config.parameter.pageIndex+1,
                            pagecount: pageNum,
                            buttonClickCallback: t.pageClick
                        });
                    }
                },
                failed: function () {
                    config.element.contentObj.html("");
                    config.element.yiDingModule.hide();
                }
            });
            return t;
        },
        authYouKnow:function(){//受欢迎的讲师展示
            var t=this;
            operateData.requestData({
                port: config.ajaxPort.welcomeTeacher,
                get:true,
                postData: {
                    "platformId": config.parameter.platformId,
                    "firstResult": 0,
                    "maxResult": 5,
                    "customerId":config.parameter.customerId,
                    "sortType": 4,
                    "courseSubjectTeamId": config.parameter.courseSubjectTeamId[config.parameter.courseType]                      //0-推荐，2-关节，7-脊柱，9-创伤

                },
                success: function (req) {
                    var listData = [];
                    $.each(req.responseObject.responseData.data_list,function(i,v){
                        var medicalTitle = "";
                        if(v.medicalTitle.indexOf("_")==-1){
                            medicalTitle = v.medicalTitle;
                        }else{
                            medicalTitle = v.medicalTitle.split(",")[0].split("_")[1];

                        }
                       v.medicalTitle = medicalTitle;
                       listData.push(v);
                    });
                    config.element.welcomeTeacher.html(template.welcomeTeacher(listData));
                    config.element.moreTeacher.attr({"href":"/pages/discover/series/discover_series_teacher.html?courseType="+config.parameter.courseType});
                    $(".al-discover_know").show();
                },
                failed: function () {
                    config.element.moreTeacher.attr({"href":"/pages/discover/series/discover_series_teacher.html?courseType="+config.parameter.courseType});
                    $(".al-discover_know").hide();
                }
            });
            return t;
        },
        tabSwitch:function () {//顶部tab切换,切换是系列课列表，医鼎相关课程，受欢迎的讲师同时联动
            var t = this;
            config.element.seriesTab.each(function(i){
                var platformId = $('#sesDepartment').val() == undefined ? 1 : $('#sesDepartment').val();
                if(parseInt(platformId)==2){
                    if(i==0){
                        $(this).show();
                    }
                }else{
                    $(this).show();
                }
            });
            config.element.seriesTab.off("click").on("click",function(){
                if(config.parameter.courseType == $(this).index()){
                    return false;
                }else{
                    $(".pager").html("");
                    config.parameter.courseType = $(this).index();
                    $(".classesList").attr({"data-alcode-mod":649+$(this).index()});
                    $(this).addClass("active").siblings(".active").removeClass("active");
                    config.parameter.pageIndex = 0;//在每次点击tab栏选项的时候pageIndex初始化应该是第一页的展示
                    t.demoContent();
                    t.authYouKnow();
                }

            });
            return t;
        }
    };
    courseSerial.init();
});