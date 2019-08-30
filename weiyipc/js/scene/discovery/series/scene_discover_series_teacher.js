/**
 * @name:   受欢迎的讲师
 * @desc:
 * @example:
 * @depend:
 * @date: 2017/6/9
 * @author: zhangHeng
 */
$(document).ready(function(){
    var operateData = {
        //关于页面操作数据的一系列方法
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
        },
        getUrlName: function (name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if (r != null)return unescape(r[2]);
            return null;
        },
        pageName: function () {
            var a = location.href;
            var b = a.split("/");
            var c = b.slice(b.length - 1, b.length).toString(String).split(".");
            return c.slice(0, 1);
        }
    };
    var config = {
        //关于页面初始化的一些配置，基本元素，基本接口，基本参数
        element: {
            "teacherObj":$(".ev_doctorBox")
        },
        ajaxPort: {
            welcomeTeacher:"/call/cms/course/getHotAuthorList/",
            share: PC_CALL + 'comm/data/share/getMapList3/'//分享接口
        },
        parameter: {
            pageSize:10,
            pageIndex:0,
            pageName: operateData.pageName()[0],
            courseType:parseInt(operateData.getUrlName("courseType")),
            courseSubjectTeamId:[0,9,7,2]
        }
    };
    var template = {
        teacher:function (data) {
            var templateStr=[];
            var keyStr = "";
            $.each(data,function(strI,strV){
                var strFun = function(str){
                    if(str){
                        return str+"、";
                    }else{
                        return "";
                    }

                };
               if(strI<5){
                   keyStr+=(strFun(strV.name)+strFun(strV.company)+comm.cutLine(comm.strHandle.cutDoctorTitle((strV.medicalTitle),"_",",")));
               }
            });
            $("[name='keywords']").attr({"content":""+keyStr});
            $.each(data,function(i,v){
                var listStr = "";
                var medicalTitle = comm.cutLine(comm.strHandle.cutDoctorTitle(v.medicalTitle),"_",",");
                if(i<3&&(parseInt(config.parameter.pageIndex)==0)){
                    $.each(v.videoList,function(videoI,videoV){
                        listStr+='<li><a href="'+videoV.pageStoragePath+'" target="_blank">'+videoV.videoName.replace(/<.*?>/ig,"")+'</a></li>';
                    });
                    $.each(v.caseList,function(caseI,caseV){
                        listStr+='<li><a href="'+caseV.pageStoragePath+'" target="_blank">'+caseV.caseName.replace(/<.*?>/ig,"")+'</a></li>';
                    });
                    $.each(v.docList,function(docI,docV){
                        listStr+='<li><a href="'+docV.pageStoragePath+'" target="_blank">'+docV.docName.replace(/<.*?>/ig,"")+'</a></li>';
                    });
                    listStr = '<ul class="al-doctorMsg_ul al-doctorMsg_template">'+listStr+
                        '</ul>';
                }
                var totalContributions = $.isEmptyObject(v.totalContributions)?0:v.totalContributions;
                var totalComment = $.isEmptyObject(v.totalComments)?0:v.totalComments;
                var totalFans = $.isEmptyObject(v.totalFans)?0:v.totalFans;
                var medicalClass=(medicalTitle.length>0)?"":"hide";
                var demoItem='<section class="al-doctorRecommend">'+
                    '<figure class="al-doctorImg">'+
                        "<a href='/pages/personal/others_contribution.html?cid="+v.customerId+"' target='_blank'>"+
                    '<img src="'+v.logoUrl+'" alt=""></a>'+
                    '</figure>'+
                    '<article class="al-doctorMsg">'+
                    '<figcaption class="al-doctorMsgContent">'+
                    '<a href="/pages/personal/others_contribution.html?cid='+v.customerId+'" target="_blank">'+v.name+'<i class="al-vipUser"></i></a>'+
                    '<p>'+
                    '	<span class="al-doctorJob '+medicalClass +'">'+medicalTitle+'</span>'+
                    '	<span class="al-doctorHospital">'+v.company+'</span>'+
                    '</p>'+
                    '</figcaption>'+
                    '<a href="javascript:;" class="al-followBtn">'+
                    '</a>'+
                    listStr+
                    '</article>'+
                    '</section>';
                var newDom=$(demoItem);/*在这里有一个注意事项：如果想把字符串当做dom对象进行操作，直接$(字符串)不能用，必须把它存在一个变量里，然后对变量进行操作*/
                newDom.find('.al-followBtn').follow({fId:v.customerId,fStatus:parseInt(v.isFollower)+1,picStyle:4,canToggle:false});
                templateStr.push(newDom);
            });
            return templateStr;
        }
    };
    var teacher = {
        init:function(){
            var t = this;/*受欢迎的讲师只有两个展示，一个受欢迎讲师的列表，一个可能认识的人列表，受欢迎讲师列表分页展示*/
            //comm.Log.createBrowse({href:window.location.href,id:210,name:'受欢迎讲师'});
            t.authYouKnow().expTeacher();
                return t;
        },
        expTeacher:function(){
          var t = this;
            operateData.requestData({
                port: config.ajaxPort.welcomeTeacher,
                get:true,
                postData: {
                    "sortType": 4,
                    "firstResult": config.parameter.pageIndex*config.parameter.pageSize,
                    "maxResult": config.parameter.pageIndex*config.parameter.pageSize+config.parameter.pageSize,
                    "courseSubjectTeamId": config.parameter.courseSubjectTeamId[config.parameter.courseType]                     //0-推荐，2-关节，7-脊柱，9-创伤
                },
                success: function (req) {
                    var pageNum =  Math.ceil(req.responseObject.responseData.data_size/config.parameter.pageSize);
                    config.element.teacherObj.html(template.teacher(req.responseObject.responseData.data_list));
                    $('.pager').pager({
                        pagenumber: config.parameter.pageIndex+1,
                        pagecount: pageNum,
                        buttonClickCallback: t.pageClick
                    });
                    $(".al-doctorMsgContent").off("click").on("click",function(){
                       var href=$(this).find("a").attr("href");
                        g_sps.jump(null,href,true);
                    });
                },
                failed: function () {
                    
                }
            });
          return t;
        },
        pageClick:function(num){
            var t = teacher;
            if(num==config.parameter.pageIndex+1){
                return false
            }else{
                config.parameter.pageIndex = num-1;
                t.expTeacher();
            }
            return t;
        },
        authYouKnow:function(){
            var t = this;
            module.personYouKnow({
                container:$('.ev_mayKnowPerson'),
                url: config.ajaxPort.enjoyedTeacher,
                contribution:"contribution",
                platformId: parseInt($('#sesDepartment').val())
            });
            return t;
        }
    };
    teacher.init();
});