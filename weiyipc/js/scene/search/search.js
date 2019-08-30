/**
 * Created by ALLIN on 2016/8/26.
 */

/**
 * 搜索结果页
 * */
var sortType=1;//1：相关度；2：发布时间:3:浏览数
var dataId=1;
var customerId="";
//反馈
function feedback(){
    $(".al_searchMain_error").on("click",function(){
        module.feedback({
            suggestionType:3
        });
    })
}
var fomateData ={
    //3.2搜索改版，实现新数据向老数据格式转换
    doctor:function(item){

    }
};
function cutAuthName(str){
    return comm.getStrByteLen(str,30);
}
function voidHref(str,type){
    var nothingOnOff = false;
    if(((str == "null")||(typeof str == "null")||(str == "undefined")||(typeof str == "undefined"))){
        nothingOnOff = true;
    }
    if((typeof  str==='string')&&(str.length===0)){
        nothingOnOff = true;
    }
    if((type===0)){
        if(nothingOnOff){
            return 'javascript:void(0);';
        }else{
            return str;
        }
    }else if(type&&(type===1)){
        if(nothingOnOff){
            return '_self';
        }else{
            return '_blank';
        }
    }
    else if(type&&(type===3)){
        if(nothingOnOff){
            return '0';
        }else{
            return '1';
        }
    }
}
function preventHref(){
    $("[voidhref='0']").off('mousedown').on("mounsedown",function(e){
        e.preventDefault();
        return false;
    });
}
//分页事件添加
function createEvent(pageclickednumber,buttonLabel){
    var actionId;
    switch (buttonLabel){
        case "首页":
            actionId=64;
            break;
        case "上一页":
            actionId=66;
            break;
        case "下一页":
            actionId=65;
            break;
        case "末页":
            actionId=67;
            break;
        default :
            actionId=68;
            break;
    }
    //事件埋点
    comm.creatEvent({
        triggerType:"翻页导航",
        pushMessageId:buttonLabel?buttonLabel:pageclickednumber,
        actionId:actionId
    });
}
var newFlag = true;
var newTimer = null;
$(".al-searchMain_topHead input").bind('compositionstart',function(){
    newFlag = false;
});
$(".al-searchMain_topHead input").bind('compositionend',function(){
    newFlag = true;
});
//搜索结果页搜索:start
$(".al-searchMain_topHead input").on("input propertychange keyup",function(event){
    clearTimeout(newTimer);
    $(".al-headerSearch input").attr("value","");
    var searchParam=$.trim($(this).val());
    newTimer=setTimeout(function(){
        if(searchParam&&newFlag){
            lenoveFn(searchParam);
        }
    },500);

    //全部搜索:start
    //输入框无输入值时隐藏联想提示框,否则当用户回车时搜索匹配的全部资源
    if(searchParam.length<=0){
        $(".al-searchMain_topHead .al-searchContent").html("").hide();
    }else {
        //当用户键入会车时搜索匹配的全部
        if (event.keyCode == 13) {
            $(".al-searchMain_topHead .al-searchContent").html("").hide();
            $('.al-searchMain .al-search_expertList').html("");
            $('.al-searchMain .al-addOne').html("");
            $('.al-searchMain').hide();
            var aa=searchParam;
            //事件埋点
            var _type = $('.al-searchMain_ul li.active').text();
            var _bType =32;
            switch(_type){
                case "视频":_bType =58;break;
                case "文库":_bType =59;break;
                case "话题":_bType =60;break;
                case "病例":_bType =61;break;
                case "医师":_bType =62;break;
                case "会议":_bType =63;break;
            }
            comm.creatEvent({
                triggerType:"搜索",
                keyword:aa,
                actionId:11,
                browType:_bType
            });
            createKeyword(aa);
            resultAllSearch(aa);  //结果页搜索全部方法

        }
    }
    //全部搜索:end
});
//联想输入方法
function lenoveFn(searchParam){
    var html="";
    var lenoverJson={
        //"opUsr":customerId,
        //"treeLevel":'',          //级别ID    （3-）
        "searchParam":searchParam//,        //搜索词
        //"pageIndex":1,         //起始记录数
        //"visitSiteId":1,     // 站点id
        //"pageSize":'',          //记录条数
        //'platformId': $('#sesDepartment').val()
    };
    if(searchParam.length>0){
        comm.ajax.async('//gateway.allinmd.cn/base-customer-platform/cms/search/keyword/getMapListV3',lenoverJson,function(data){
            if(data&&data.responseObject&&data.responseObject.responseData&&!$.isEmptyObject(data.responseObject.responseData)){
                ////console.log(data.responseObject.responseData);
                var data_list=data.responseObject.responseData.dataList;
                if(data_list&&data_list.length>0){
                    var array=data_list;//.slice(0,4);
                    $.each(array,function(i,val){
                       // //console.log(val.keyWord);
                        var r = RegExp(searchParam,"i");
                        var keyWord = val.keyWord;
                        var  propertyName = (keyWord).replace(r,"<em>"+searchParam+"</em>");
                        html+="<a href='javascript:;'>"+propertyName+"</a>";
                    });
                    if (searchParam.length>0){
                        $(".al-searchMain_topHead .al-searchContent").show();
                        $(".al-searchMain_topHead .al-searchContent").html(html);
                        preventHref();
                        //弹出下拉列表搜索:--start
                        $('.al-searchMain_topHead .al-searchContent a').bind("click",function(){
                            var aa=$(this).text();
                            $(".al-searchMain_topHead input").val(aa);
                            resultAllSearch(aa);
                            createKeyword(aa);
                            $(".al-searchMain_topHead .al-searchContent").html("").hide();
                        });
                        //弹出下拉列表搜索:--end
                    }
                }else{
                    //搜索无匹配结果时下拉框隐藏
                    $(".al-searchMain_topHead .al-searchContent").html("").hide();
                }
            }
        },function(data){
            //console.log(data);
            //console.log('数据获取失败')
        },'GET');
    }

}
//点击搜索按钮时搜索匹配全部资源:--start
$('.al-searchMain_topHead span').click(function(){
    var aa=$('.al-searchMain_topHead input').val();
    if(aa.length>0){
        $(".al-searchMain_topHead .al-searchContent").hide();

        //事件埋点
        var _type = $('.al-searchMain_ul li.active').text();
        var _bType =32;
        switch(_type){
            case "视频":_bType =58;break;
            case "文库":_bType =59;break;
            case "话题":_bType =60;break;
            case "病例":_bType =61;break;
            case "医师":_bType =62;break;
            case "会议":_bType =63;break;

        }
        comm.creatEvent({
            triggerType:"搜索",
            keyword:aa,
            actionId:11,
            browType:_bType
        });

        resultAllSearch(aa);
        createKeyword(aa);
    }
});
//点击搜索按钮时搜索匹配全部资源:--end
//全部搜索结果整个卡片跳转链接
/*$(".al-addOne").off("click").on("click",".al-disMajorMainBox_body",function(){
    window.location.href = $(this).find("a").attr("href");
    return false;
});*/
//医师搜索结果整个卡片跳转链接
/*$(".al-personal").off("click").on("click",".al-doctorRecommend",function(){
    window.location.href = $(this).find("a").attr("href");
});*/
//搜索结果页联想搜索:end
function domHtmlWithImg(kv){//病例，话题，文库 有图片
    var timestamp = Date.parse(new Date());//时间戳
    var activityTag="";
    if(kv.isShowActivityTag){//活动资源标识
        var color=kv.activityTagColor;
        activityTag='<span class="al-contentActivityTag" style="border-color:'+color+';color:'+color+'">'+kv.activityTagName+'</span>';
        //activityTag='<span class="al-contentActivityTag" style="border-color:red;color:red">万例挑一</span>';
    }
    var _html ='<section class="al-disMajorMainBox_body">'+scoreDom(kv.score,kv.scoreNum)+'<figure class="al-disMajorMainBox_bodyText">' +
        '<a href="'+kv.resourceUrl+'" target="_blank"><span data-id="'+kv.resourceId+'">'+comm.getStrLen(kv.resourceName,40)+'</span></a><p>'+comm.getStrLen(kv.itemAbstract,100)+'</p> <div> ' +
        activityTag+
        (function(){
            var str='';
            if(kv.customerName){
                str+='      <span><i class="user'+((kv.videoType&&(kv.videoType==17||kv.videoType==18||kv.videoType==19))?' authorNoUserId':'')+'"></i>' + cutAuthName(kv.customerName) + '</span>';
            }
            return str;
        }())+
        '<span><i class="read"></i>'+kv.browseNum+'</span></div></figure>' +
        '<figure class="al-disMajorMainBox_bodyImg"><a href="'+kv.resourceUrl+'" target="_blank"><img src="'+kv.picUrl.split('|')[0]+'?'+timestamp+'" alt=""/></a>' +
        '</figure></section>';
    return _html;
}
function domHtmlNoImg(kv){
    var activityTag="";
    if(kv.isShowActivityTag){//活动资源标识
        var color=kv.activityTagColor;
        activityTag='<span class="al-contentActivityTag" style="border-color:'+color+';color:'+color+'">'+kv.activityTagName+'</span>';
        //activityTag='<span class="al-contentActivityTag" style="border-color:red;color:red">万例挑一</span>';
    }
    var _html='<section class="al-contentInALine">'+scoreDom(kv.score,kv.scoreNum)+'<article class="al-contentText">' +
        '<a href="'+voidHref(kv.resourceUrl,0)+'" voidHref="'+voidHref(kv.resourceUrl,3)+'" class="al-contentTitle ev-sRList" target="'+voidHref(kv.resourceUrl,1)+'" data-id="'+kv.resourceId+'" data-type="'+kv.typeId+'"><span>'+comm.getStrLen(kv.resourceName,60)+'</span></a> ' +
        '<p class="al-contentMainText"><span>'+comm.getStrLen(kv.itemAbstract,100)+'</span></p><p class="al-contentOtherMsg">' +
        activityTag+
        (function(){
            var str='';
            if(kv.typeId==1){
                str=(kv.videoType&&kv.videoType==1?'<span class="surgeryVideoTag">手术视频</span>':'');
            }
            return str;
        }())+
        (function(){
            var str='';
            if(kv.customerName){
                str+='      <span><i class="al-contentAuthor'+((kv.videoType&&(kv.videoType==17||kv.videoType==18||kv.videoType==19))?' authorNoUserId':'')+'"></i>' + cutAuthName(kv.customerName) + '</span>';
            }
            return str;
        }())+
        '<span>' +
        '<i class="al-contentWatchedNum"></i>'+kv.browseNum+'</span></p></article></section>';
    return _html;
}
function videoDomWithImg(kv){
    var timestamp = Date.parse(new Date());//时间戳
    var videoPic=kv.picUrl.split('|')[0];
    if(videoPic.lastIndexOf("?")>-1){
        videoPic=videoPic+timestamp;
    }else{
        videoPic=videoPic+"?"+timestamp;
    }
    var activityTag="";
    if(kv.isShowActivityTag){//活动资源标识
        var color=kv.activityTagColor;
        activityTag='<span class="al-contentActivityTag" style="border-color:'+color+';color:'+color+'">'+kv.activityTagName+'</span>';
        //activityTag='<span class="al-contentActivityTag" style="border-color:red;color:red">万例挑一</span>';
    }
    var _html='<section class="al-disMajorMainBox_body">'+scoreDom(kv.score,kv.scoreNum)+'<figure class="al-disMajorMainBox_bodyText">' +
        '<a href="'+kv.resourceUrl+'" target="_blank" data-type="'+kv.typeId+'" data-id="'+kv.resourceId+'" class="ev-sRList"><span data-id="'+kv.resourceId+'">'+comm.getStrLen(kv.resourceName,46)+'</span></a><p>'+comm.getStrLen(kv.itemAbstract,100)+'</p><div>' +
        activityTag+(kv.videoType==1?'<span class="surgeryVideoTag">手术视频</span>':'')+
        (function(){
            var str='';
            if(kv.customerName){
                str+='      <span data-id="'+kv.customerId+'"><i class="user'+((kv.videoType&&(kv.videoType==17||kv.videoType==18||kv.videoType==19))?' authorNoUserId':'')+'"></i>' + cutAuthName(kv.customerName) + '</span>';
            }
            return str;
        }())+
        '<span><i class="read"></i>'+kv.browseNum+'</span></div></figure>' +
        '<figure class="al-disMajorMainBox_bodyImg"><a href="'+kv.resourceUrl+'" target="_blank" data-type="'+kv.typeId+'" data-id="'+kv.resourceId+'" class="ev-sRList"><img src="'+videoPic+'" alt=""/>' +
        '<b></b><span>'+kv.playTime+'</span></a></figure></section>';
    return _html;
}
function meetingDom(kv){
    var _html='<section class="al-contentInALine">'+scoreDom(kv.score,kv.scoreNum)+'<article class="al-contentText"><a href="'+voidHref(kv.conUrl,0)+'" voidHref="'+voidHref(kv.conUrl,3)+'" class="al-contentTitle ev-sRList" target="'+voidHref(kv.conUrl,1)+'" data-type="'+kv.typeId+'" data-id="'+kv.resourceId+'">' +
        '<span>'+kv.conName+'</span></a>' +
        (kv.conMainPicUrl?'<figure class="al-contentImgBox"><a href="'+kv.conUrl+'" target="_blank" data-id="'+kv.resourceId+'" data-type="'+kv.typeId+'" class="ev-sRList"><img src="'+kv.conMainPicUrl.split('|')[0]+'" alt=""><i class="al-mark"><img src="//img10.allinmd.cn/v3/common/icon/mark_meeting.png" alt=""></i></a></figure>':'') +
        '<div class="al-meeting_timePlace">' +
        '<figure class="al-meeting_time"><i class="al-meetingTimeIcon"></i><span>'+comm.date.dateJoint(kv.startTime,kv.endTime,'/','-')+'</span></figure>' +
        '<figure class="al-meeting_place"><i class="al-meetingPlaceIcon"></i><span>'+kv.conLocation+'</span>' +
        '</figure></div></article></section>';
    return _html;
}
function scoreDom(s,scoreNum){
    var score='';
    if(scoreNum<10)return '';
    var num = parseInt(s);
    var flot =(s-num)*100+"%";
    if(num==0){
        score='<div class="al-resourceTypeBox" style="margin-bottom:7px;"><ul class="al-littleScoreStarBox"><li><b style="width:'+flot+';background-position:0 0;"></b></li><li></li><li></li><li></li><li></li></ul></div>';
    }else if(num==1){
        score='<div class="al-resourceTypeBox" style="margin-bottom:7px;"><ul class="al-littleScoreStarBox"><li><b></b></li><li><b style="width:'+flot+';background-position:0 0;"></b></li><li></li><li></li><li></li></ul></div>';
    }else if(num==2){
        score='<div class="al-resourceTypeBox" style="margin-bottom:7px;"><ul class="al-littleScoreStarBox"><li><b></b></li><li><b></b></li><li><b style="width:'+flot+';background-position:0 0;"></b></li><li></li><li></li></ul></div>';
    }else if(num==3){
        score='<div class="al-resourceTypeBox" style="margin-bottom:7px;"><ul class="al-littleScoreStarBox"><li><b></b></li><li><b></b></li><li><b></b></li><li><b style="width:'+flot+';background-position:0 0;"></b></li><li></li></ul></div>';
    }else if(num==4){
        score='<div class="al-resourceTypeBox" style="margin-bottom:7px;"><ul class="al-littleScoreStarBox"><li><b></b></li><li><b></b></li><li><b></b></li><li><b></b></li><li><b style="width:'+flot+';background-position:0 0;"></b></li></ul></div>';
    }else if(num>=5){
        score='<div class="al-resourceTypeBox" style="margin-bottom:7px;"><ul class="al-littleScoreStarBox"><li><b></b></li><li><b></b></li><li><b></b></li><li><b></b></li><li><b></b></li></ul></div>';
    }
    return score;
}
//结果页关键词搜索全部资源 方法:--start
function resultAllSearch(aa){

    var html="";
    $('.al-searchMain').hide();
    var searchParam=aa;
    /*var allJson={
        "pageIndex":1,
        "pageSize":10,
        "searchParam": searchParam,//搜索关键词
        "logoUseFlag":UseFlag.c,
        "useFlag":$("#sesCustomerId").val()?2:1,//  --登录传入2，不登录传入1
        "attUseFlag":AttUseFlag.c,
        "sortType":sortType,//1：相关度；2：发布时间:3:浏览数
        "searchType":2,//1：模糊  2精确
        "scene":1,
        'platformId': $('#sesDepartment').val(),
        "sessionCustomerId":customerId,
        "opUsr":customerId
    };*/
    var allJson={
        "pageIndex":1,
        "pageSize":10,
        "searchParam": searchParam,//搜索关键词
        //"logoUseFlag":UseFlag.c,
        //"useFlag":$("#sesCustomerId").val()?2:1,//  --登录传入2，不登录传入1
        //"attUseFlag":AttUseFlag.c,
        "sortType":sortType,//1：相关度；2：发布时间:3:浏览数
        //"searchType":2,//1：模糊  2精确
        //"scene":1,
        'platformId': $('#sesDepartment').val(),
        "customerId":customerId,
        //"opUsr":customerId
    };
    var params= allJson;
    dataId=$('.al-searchMain_ul li').data('id');
    $(".al-searchMain_ul li").removeClass("active").attr("data-hadSearch","no");
    $(".al-searchMain_ul li").eq(0).addClass("active").attr("data-hadSearch","yes");
    $(".pager").hide();
    function addAll(data_list,totalCount,countCustomer){
        var html="";
        $("[data-target=1] .al-search_expertList").html("");
        if(data_list.customer_list||data_list.resource_list){
            $(".ev-allSearch").show();
            $(".ev-recommend").eq(0).hide();
            $(".recommendCon").eq(0).html("");
            var listCustomer=data_list.customer_list;
            var listResource=data_list.resource_list;
            html+='<header class="al-searchMain_head" style="border:none;">为您找到相关结果 <span>'+totalCount+'</span>个</header>';
            if(countCustomer>0){
                $.each(listCustomer,function(i,val){
                    if(val instanceof Array){
                        $.each(val ,function (j,vale) {
                        });
                    }else{
                        var logoUrl=val.customer_att.logoUrl;
                        var lastName=val.customer_auth.lastName;
                        var firstName=val.customer_auth.firstName?comm.getStrLen(val.customer_auth.firstName,5*2):"";
                        var titleShow=val.customer_auth.medicalTitleShow;
                        var company=val.customer_auth.company?comm.getStrLen(val.customer_auth.company,10*2):"";
                        var customerId=val.customer_baseinfo.customerId;
                        var relationship=val.customer_follow_people.relationship;
                    }
                    html+='<div class="al-expertBox">' +
                        '<a target="_blank" href="/pages/personal/'+(customerId==$('#sesCustomerId').val()?"personal_index":"others_contribution")+'.html?cid='+customerId+'" data-id="'+customerId+'" data-type="9">' +
                        '<img src="'+logoUrl+'" class="al-expert_headImg"></a>' +
                        '<figure class="al-expertTitle">' +
                        '<a target="_blank" href="/pages/personal/'+(customerId==$('#sesCustomerId').val()?"personal_index":"others_contribution")+'.html?cid='+customerId+'" class="active" data-id="'+customerId+'" data-type="9">'+ lastName+''+firstName +'</a>' +
                        (customerId==$('#sesCustomerId').val()?"":
                            '<i relationship="'+relationship+'" data-id="'+customerId+'" class="ev-followAllBtn"></i>' )+
                        '<span>'+titleShow+'</span>' +
                        '<span>'+company+'</span></figure></div>';
                });
                if(countCustomer>3){
                    html+='<div class="al-expertBox"><p class="al-moreExpert">查看更多医师 >></p></div>';
                }
                $("[data-target=1] .al-search_expertList").html(html);
                preventHref();
                //搜索列表医生埋点
                $('.al-search_expertList .al-expertBox a').off('click').on('click',function (e) {
                    e.preventDefault();
                    comm.creatEvent({
                        triggerType:1,
                        actionId:11049,
                        refId:$(this).attr('data-id'),
                        refType:9,
                        async:false
                    });
                    var reg = /(?:http(?:s|):\/\/|)(?:(?:\w*?)\.|)(?:\w*?)\.(?:\w{2,4})(?:\?.*|\/.*|)$/ig
                    if(reg.test($(this).attr('href'))) {
                        g_sps.jump(null, $(this).attr('href'), true);
                    }
                });


                var fid,relationship;
                $(".al-expertBox .ev-followAllBtn").each(function(i,em){
                    fid=$(em).attr("data-id");
                    relationship=parseInt($(em).attr("relationship"));
                    $(em).follow({fStatus:relationship,classStyle:"gz_but",fId:fid,picStyle:8,canToggle:false});
                });
                alldoList(listResource);
                function alldoList(listResource){
                    var html="";
                    $.each(listResource,function(i,val){
                        if(val instanceof Array){
                            $.each(val ,function (j,vale) {
                                var aa=vale.bb.cc;
                            });
                        }else{
                            var typeId=val.typeId;
                            var browseNum=val.browseNum.toWK();
                            var company=val.company;
                            var customerId=val.customerId;
                            var customerName=val.customerName;
                            var endTime=val.endTime;
                            var picNum=val.picNum;
                            var picUrl=val.picUrl;
                            var playTime=val.playTime;
                            var resourceId=val.resourceId;
                            var resourceName=val.resourceName;
                            var itemAbstract=val.itemAbstract?val.itemAbstract:"";
                            var resourceUrl=/\/\/www.allinmd.cn/.test(val.resourceUrl)?val.resourceUrl:val.resourceUrl;
                            var reviewNum=val.reviewNum.toWK();
                            var startTime=val.startTime;
                            var tplPath=val.tplPath;
                            var conLocation = val.conLocation;
                            var score = val.currentStarLevel;
                            var scoreNum = val.currentScoreNum;
                            // //console.log(company);
                            switch (typeId){
                                case 1:   //视频
                                    customerName=val.ownerNameStr;
                                    if(picNum==0){
                                        html+=domHtmlNoImg({
                                            resourceUrl:resourceUrl,
                                            resourceId:resourceId,
                                            resourceName:resourceName,
                                            customerName:customerName,
                                            browseNum:browseNum,
                                            itemAbstract:itemAbstract,
                                            videoType:val.videoType,
                                            score:score,
                                            scoreNum:scoreNum,
                                            isShowActivityTag:val.isShowActivityTag,
                                            activityTagName:val.activityTagName,
                                            activityTagColor:val.activityTagColor,
                                            typeId:typeId
                                        });
                                    }else{
                                        html+=videoDomWithImg({
                                            resourceUrl:resourceUrl,
                                            resourceId:resourceId,
                                            resourceName:resourceName,
                                            customerName:customerName,
                                            browseNum:browseNum,
                                            picUrl:picUrl,
                                            itemAbstract:itemAbstract,
                                            playTime:playTime,
                                            videoType:val.videoType,
                                            score:score,
                                            scoreNum:scoreNum,
                                            isShowActivityTag:val.isShowActivityTag,
                                            activityTagName:val.activityTagName,
                                            activityTagColor:val.activityTagColor,
                                            typeId:typeId
                                        });
                                    }

                                    break;
                                case 3:
                                    html+=meetingDom({
                                        conUrl:resourceUrl,
                                        conName:resourceName,
                                        conMainPicUrl:picUrl,
                                        startTime:startTime,
                                        endTime:endTime,
                                        resourceId:resourceId,
                                        conLocation:conLocation,
                                        typeId:typeId
                                    })
                                    break;
                                default:
                                    if(typeId==4){//话题
                                        resourceName=resourceName?resourceName:'话题医起聊';
                                    }
                                    if(picUrl.length>0){
                                        html+=domHtmlWithImg({
                                            resourceUrl:resourceUrl,
                                            resourceId:resourceId,
                                            resourceName:resourceName,
                                            customerName:customerName,
                                            browseNum:browseNum,
                                            picUrl:picUrl,
                                            itemAbstract:itemAbstract,
                                            score:score,
                                            scoreNum:scoreNum,
                                            isShowActivityTag:val.isShowActivityTag,
                                            activityTagName:val.activityTagName,
                                            activityTagColor:val.activityTagColor,
                                            typeId:typeId
                                        });
                                    }else{
                                        html+=domHtmlNoImg({
                                            resourceUrl:resourceUrl,
                                            resourceId:resourceId,
                                            resourceName:resourceName,
                                            customerName:customerName,
                                            browseNum:browseNum,
                                            itemAbstract:itemAbstract,
                                            videoType:val.videoType,
                                            score:score,
                                            scoreNum:scoreNum,
                                            isShowActivityTag:val.isShowActivityTag,
                                            activityTagName:val.activityTagName,
                                            activityTagColor:val.activityTagColor,
                                            typeId:typeId
                                        });
                                    }

                            }
                        }
                    });
                    $(".al-addOne").html(html);
                    preventHref();
                    //搜索列表全部有医生
                    $('.ev-sRList').off('click').on('click',function (e) {
                        e.preventDefault();
                        comm.creatEvent({
                            triggerType:1,
                            actionId:11049,
                            refId:$(this).attr('data-id'),
                            refType:$(this).attr('data-type'),
                            async:false
                        });
                        var reg = /(?:http(?:s|):\/\/|)(?:(?:\w*?)\.|)(?:\w*?)\.(?:\w{2,4})(?:\?.*|\/.*|)$/ig
                        if(reg.test($(this).attr('href'))) {
                            g_sps.jump(null, $(this).attr('href'), true);
                        }
                    });
                    $(".pager").eq(dataId-1).show();
                    $("[data-target=1]").show();
                    shareAction(allJson,shareSenceConst.search_list_all,searchParam,0);
                }
                $('.al-expertBox').bind("click",function(){
                    lookMore(searchParam);
                });
            }else{  //搜索全部没有用户时，只遍历listResource
                var html="";
                html+='<header class="al-searchMain_head">为您找到相关结果 <span>'+totalCount+'</span>个</header>';
                $.each(listResource,function(i,val){
                    if(val instanceof Array){
                        $.each(val ,function (j,vale) {
                            var aa=vale.bb.cc;
                        });
                    }else{
                        var typeId=val.typeId;
                        var browseNum=val.browseNum.toWK();
                        var company=val.company;
                        var customerId=val.customerId;
                        var customerName=val.customerName;
                        var endTime=val.endTime;
                        var picNum=val.picNum;
                        var picUrl=val.picUrl;
                        var playTime=val.playTime;
                        var resourceId=val.resourceId;
                        var resourceName=val.resourceName?val.resourceName:"";
                        var itemAbstract=val.itemAbstract?val.itemAbstract:"";
                        var resourceUrl=/\/\/www.allinmd.cn/.test(val.resourceUrl)?val.resourceUrl:val.resourceUrl;
                        var reviewNum=val.reviewNum.toWK();
                        var startTime=val.startTime;
                        var tplPath=val.tplPath;
                        var conLocation =val.conLocation;
                        var score = val.currentStarLevel;
                        var scoreNum  =val.currentScoreNum;
                        switch (typeId){
                            case 1:   //视频
                                customerName=val.ownerNameStr;
                                if(picNum==0){
                                    html+=domHtmlNoImg({
                                        resourceUrl:resourceUrl,
                                        resourceId:resourceId,
                                        resourceName:resourceName,
                                        customerName:customerName,
                                        browseNum:browseNum,
                                        itemAbstract:itemAbstract,
                                        videoType:val.resourceSecondType,
                                        score:score,
                                        scoreNum:scoreNum,
                                        isShowActivityTag:val.isShowActivityTag,
                                        activityTagName:val.activityTagName,
                                        activityTagColor:val.activityTagColor,
                                        typeId:typeId
                                    });
                                }else{
                                    html+=videoDomWithImg({
                                        resourceUrl:resourceUrl,
                                        resourceId:resourceId,
                                        resourceName:resourceName,
                                        customerName:customerName,
                                        browseNum:browseNum,
                                        picUrl:picUrl,
                                        itemAbstract:itemAbstract,
                                        playTime:playTime,
                                        videoType:val.resourceSecondType,
                                        score:score,
                                        scoreNum:scoreNum,
                                        isShowActivityTag:val.isShowActivityTag,
                                        activityTagName:val.activityTagName,
                                        activityTagColor:val.activityTagColor,
                                        typeId:typeId
                                    });
                                }
                                break;
                            case 3:
                                html+=meetingDom({
                                    conUrl:resourceUrl,
                                    conName:resourceName,
                                    conMainPicUrl:picUrl,
                                    resourceId:resourceId,
                                    startTime:startTime,
                                    endTime:endTime,
                                    conLocation:conLocation,
                                    typeId:typeId
                                })
                                break;
                            default:   //话题
                                if(typeId==4){//话题
                                    resourceName=resourceName?resourceName:'话题医起聊';
                                }
                                if(picUrl.length>0){
                                    html+=domHtmlWithImg({
                                        resourceUrl:resourceUrl,
                                        resourceId:resourceId,
                                        resourceName:resourceName,
                                        customerName:customerName,
                                        browseNum:browseNum,
                                        videoType:val.resourceSecondType,
                                        picUrl:picUrl,
                                        itemAbstract:itemAbstract,
                                        score:score,
                                        scoreNum:scoreNum,
                                        isShowActivityTag:val.isShowActivityTag,
                                        activityTagName:val.activityTagName,
                                        activityTagColor:val.activityTagColor,
                                        typeId:typeId
                                    });
                                }else{
                                    html+=domHtmlNoImg({
                                        resourceUrl:resourceUrl,
                                        resourceId:resourceId,
                                        resourceName:resourceName,
                                        customerName:customerName,
                                        browseNum:browseNum,
                                        itemAbstract:itemAbstract,
                                        videoType:val.resourceSecondType,
                                        score:score,
                                        scoreNum:scoreNum,
                                        isShowActivityTag:val.isShowActivityTag,
                                        activityTagName:val.activityTagName,
                                        activityTagColor:val.activityTagColor,
                                        typeId:typeId
                                    });
                                }
                        }
                    }
                });
                $(".al-addOne").html(html);
                preventHref();
                //搜索列表全部无医生
                $('.ev-sRList').off('click').on('click',function (e) {
                    e.preventDefault();
                    comm.creatEvent({
                        triggerType:1,
                        actionId:11049,
                        refId:$(this).attr('data-id'),
                        refType:$(this).attr('data-type'),
                        async:false
                    });
                    var reg = /(?:http(?:s|):\/\/|)(?:(?:\w*?)\.|)(?:\w*?)\.(?:\w{2,4})(?:\?.*|\/.*|)$/ig
                    if(reg.test($(this).attr('href'))) {
                        g_sps.jump(null, $(this).attr('href'), true);
                    }
                });
                $(".pager").eq(dataId-1).show();
                $("[data-target=1]").show();
                shareAction(allJson,shareSenceConst.search_list_all,searchParam,0);
            }
        }else{
            //无结果页
            html+='<header class="al-searchMain_head">为您找到相关结果 <span>0</span> 个</header>'+
                '<section class="al-searchMain_imgBox"><img src="//img10.allinmd.cn/v3/search/search_noResult.png" alt=""/><section class="al_searchMain_error">我要报错</section></section>';
            $("[data-target=1] .al-addOne").html(html);
            preventHref();
            $("[data-target=1]").show();
            $('.ev-shareContainer').hide();
            //TODO:添加推荐
            recommend();
            $(".ev_searchSiteName").click();
            //反馈
            feedback();
        }
        if(comm.getpara().type=='conference'){
            $(".al-searchMain_ul li").eq(3).click();
        }
    }
    function pageClick(data_list){     //---除了匹配第一页有搜索总数、其他页面没有-----

        $("[data-target=1] .al-search_expertList").html("");
        if(data_list.resource_list){
            var listResource=data_list.resource_list;
            var html="";
            $.each(listResource,function(i,val){
                if(val instanceof Array){
                    $.each(val ,function (j,vale) {
                    });
                }else{
                    var typeId=val.typeId;
                    var browseNum=val.browseNum.toWK();
                    var company=val.company;
                    var customerId=val.customerId;
                    var customerName=val.customerName;
                    var endTime=val.endTime;
                    var picNum=val.picNum;
                    var picUrl=val.picUrl;
                    var playTime=val.playTime;
                    var resourceId=val.resourceId;
                    var resourceName=val.resourceName?val.resourceName:"";
                    var itemAbstract=val.itemAbstract?val.itemAbstract:"";
                    var resourceUrl=/\/\/www.allinmd.cn/.test(val.resourceUrl)?val.resourceUrl:val.resourceUrl;
                    var reviewNum=val.reviewNum.toWK();
                    var startTime=val.startTime;
                    var tplPath=val.tplPath;
                    var conLocation = val.conLocation;
                    var score = val.currentStarLevel;
                    var scoreNum =val.currentScoreNum;
                    switch (typeId){
                        case 1:   //视频
                            customerName=val.ownerNameStr;
                            if(picNum==0){
                                html+=domHtmlNoImg({
                                    resourceUrl:resourceUrl,
                                    resourceId:resourceId,
                                    resourceName:resourceName,
                                    customerName:customerName,
                                    browseNum:browseNum,
                                    itemAbstract:itemAbstract,
                                    videoType:val.videoType,
                                    score:score,
                                    scoreNum:scoreNum,
                                    isShowActivityTag:val.isShowActivityTag,
                                    activityTagName:val.activityTagName,
                                    activityTagColor:val.activityTagColor,
                                    typeId:typeId
                                });
                            }else{
                                html+=videoDomWithImg({
                                    resourceUrl:resourceUrl,
                                    resourceId:resourceId,
                                    resourceName:resourceName,
                                    customerName:customerName,
                                    browseNum:browseNum,
                                    picUrl:picUrl,
                                    itemAbstract:itemAbstract,
                                    playTime:playTime,
                                    videoType:val.resourceSecondType,
                                    score:score,
                                    scoreNum:scoreNum,
                                    isShowActivityTag:val.isShowActivityTag,
                                    activityTagName:val.activityTagName,
                                    activityTagColor:val.activityTagColor,
                                    typeId:typeId
                                });
                            }
                            break;
                        case 3:
                            html+=meetingDom({
                                conUrl:resourceUrl,
                                conName:resourceName,
                                conMainPicUrl:picUrl,
                                startTime:startTime,
                                endTime:endTime,
                                conLocation:conLocation,
                                resourceId:resourceId,
                                typeId:typeId
                            })
                            break;
                        default:   //话题
                            if(typeId==4){//话题
                                resourceName=resourceName?resourceName:'话题医起聊';
                            }
                            if(picUrl.length>0){
                                html+=domHtmlWithImg({
                                    resourceUrl:resourceUrl,
                                    resourceId:resourceId,
                                    resourceName:resourceName,
                                    customerName:customerName,
                                    browseNum:browseNum,
                                    videoType:val.videoType,
                                    picUrl:picUrl,
                                    itemAbstract:itemAbstract,
                                    score:score,
                                    scoreNum:scoreNum,
                                    isShowActivityTag:val.isShowActivityTag,
                                    activityTagName:val.activityTagName,
                                    activityTagColor:val.activityTagColor,
                                    typeId:typeId
                                });
                            }else{
                                html+=domHtmlNoImg({
                                    resourceUrl:resourceUrl,
                                    resourceId:resourceId,
                                    resourceName:resourceName,
                                    customerName:customerName,
                                    browseNum:browseNum,
                                    itemAbstract:itemAbstract,
                                    videoType:val.videoType,
                                    score:score,
                                    scoreNum:scoreNum,
                                    isShowActivityTag:val.isShowActivityTag,
                                    activityTagName:val.activityTagName,
                                    activityTagColor:val.activityTagColor,
                                    typeId:typeId
                                });
                            }
                    }
                }
            });
            $(".al-addOne").html(html);
            preventHref();
            //搜索列表全部无医生
            $('.ev-sRList').off('click').on('click',function (e) {
                e.preventDefault();
                comm.creatEvent({
                    triggerType:1,
                    actionId:11049,
                    refId:$(this).attr('data-id'),
                    refType:$(this).attr('data-type'),
                    async:false
                });
                var reg = /(?:http(?:s|):\/\/|)(?:(?:\w*?)\.|)(?:\w*?)\.(?:\w{2,4})(?:\?.*|\/.*|)$/ig
                if(reg.test($(this).attr('href'))) {
                    g_sps.jump(null, $(this).attr('href'), true);
                }
            });
            $(".pager").eq(0).show();
            $("[data-target=1]").show();
            shareAction(allJson,shareSenceConst.search_list_all,searchParam,0);
        }
    }
    function searchAll(){
        comm.ajax.async("//gateway.allinmd.cn/base-search-service/search/all", params,function(data){
            comm.LightBox.hideloading();
            if(data&&data.responseObject&&data.responseObject.responseData){
                //console.log(data)
                var data_list=data.responseObject.responseData;
                var countResource=data.responseObject.responseData.resource_count;
                var countCustomer=data.responseObject.responseData.customer_count;
                var totalCount=countResource+countCustomer;
                var pagecount=Math.ceil(countResource/allJson.pageSize);//总页数
                addAll(data_list,totalCount,countCustomer);
                $(".pager").eq(dataId-1).pager({pagenumber:1, pagecount: pagecount, buttonClickCallback: PageClick});
                if(data_list.length<allJson.pageSize){
                    $(".pager").hide();
                }
            }else{
                var _html='<header class="al-searchMain_head">为您找到相关结果 <span>0</span> 个</header>'+
                    '<section class="al-searchMain_imgBox"><img src="//img10.allinmd.cn/v3/search/search_noResult.png" alt=""/><section class="al_searchMain_error">我要报错</section></section>';
                $('.al-searchMain').hide();
                $('.al-searchMain[data-target=1]').show();
                $('.al-searchMain[data-target=1] .al-search_expertList').html("");
                $('.al-searchMain[data-target=1] .al-addOne').html(_html);
                preventHref();
                $(".pager").eq(0).empty();
                $('.ev-shareContainer').hide();
                //TODO:添加推荐
                recommend();
                $(".ev_searchSiteName").click();
                //反馈
                feedback();
            }
        },function(){
            //console.log('请求数据失败');
        },'GET');
    }
    comm.ajax.async("//gateway.allinmd.cn/base-search-service/search/customer", {
        "pageIndex":1,
        "pageSize":10,
        "searchParam": searchParam,//搜索关键词
        //"logoUseFlag":UseFlag.c,
        //"useFlag":$("#sesCustomerId").val()?2:1,//  --登录传入2，不登录传入1
        //"attUseFlag":AttUseFlag.c,
        "sortType":sortType,//1：相关度；2：发布时间:3:浏览数
        //"searchType":2,//1：模糊  2精确
        //"scene":1,
        "customerId":customerId,
        //"opUsr":customerId
    },function(data){
        if(data&&data.responseObject&&data.responseObject.responseData){
            //console.log(data);
            searchAll();
        }else{}
    },function(){
        //console.log('请求数据失败');
    },'GET');

    PageClick = function(pageclickednumber,buttonLabel){
        allJson.pageIndex = pageclickednumber;//加载第几页；
        var params= {paramJson:$.toJSON(allJson)};
        comm.ajax.async("/call/search/searchAllNew/", params,function(data){
            if(data&&data.responseObject&&data.responseObject.responseData){
                var countResource=data.responseObject.responseData.resource_count;
                var countCustomer=data.responseObject.responseData.customer_count;
                var totalCount=countCustomer+countResource;
                var pagecount=Math.ceil(countResource/allJson.pageSize);//总页数
                var data_list=data.responseObject.responseData;
                if(pageclickednumber==1){
                    addAll(data_list,totalCount,countCustomer);
                }else{
                    pageClick(data_list);
                }
                $(".pager").eq(0).pager({ pagenumber: pageclickednumber, pagecount: pagecount, buttonClickCallback: PageClick });
                if(data_list.length<allJson.pageSize){
                    $(".pager").hide();
                }
                scrollTop();
            }else{
                var _html='<header class="al-searchMain_head">为您找到相关结果 <span>0</span> 个</header>'+
                    '<section class="al-searchMain_imgBox"><img src="//img10.allinmd.cn/v3/search/search_noResult.png" alt=""/><section class="al_searchMain_error">我要报错</section></section>';
                $('.al-searchMain').hide();
                $('.al-searchMain[data-target=1]').show();
                $('.al-searchMain[data-target=1] .al-search_expertList').html("");
                $('.al-searchMain[data-target=1] .al-addOne').html(_html);
                preventHref();
                $(".pager").eq(0).empty();
                $('.ev-shareContainer').hide();
            }
        });
        createEvent(pageclickednumber,buttonLabel);
    };

}

//推荐
function recommend(){
    function addReHTml(data_list){
        if(data_list.resource_list) {
            //$(".ev-allSearch").hide();
            $(".ev-recommend").eq(0).show();
            $(".pager").eq(0).show();
            var listResource = data_list.resource_list;
            var html = "";
            $.each(listResource, function (i, val) {
                if (val instanceof Array) {
                    $.each(val, function (j, vale) {
                    });
                } else {
                    var typeId = val.typeId;
                    var browseNum = val.browseNum.toWK();
                    var company = val.company;
                    var customerId = val.customerId;
                    var customerName = val.customerName;
                    var endTime = val.endTime;
                    var picNum = val.picNum;
                    var picUrl = val.picUrl;
                    var playTime = val.playTime;
                    var resourceId = val.resourceId;
                    var resourceName = val.resourceName ? val.resourceName : "";
                    var itemAbstract = val.itemAbstract ? val.itemAbstract : "";
                    var resourceUrl = /\/\/www.allinmd.cn/.test(val.resourceUrl) ? val.resourceUrl : val.resourceUrl;
                    var reviewNum = val.reviewNum.toWK();
                    var startTime = val.startTime;
                    var tplPath = val.tplPath;
                    var conLocation = val.conLocation;
                    var score = val.currentStarLevel;
                    var scoreNum=val.currentScoreNum;
                    switch (typeId) {
                        case 1:   //视频
                            customerName = val.ownerNameStr;
                            if (picNum == 0) {
                                html += domHtmlNoImg({
                                    resourceUrl: resourceUrl,
                                    resourceId: resourceId,
                                    resourceName: resourceName,
                                    customerName: customerName,
                                    browseNum: browseNum,
                                    itemAbstract: itemAbstract,
                                    videoType:val.videoType,
                                    score:score,
                                    scoreNum:scoreNum,
                                    isShowActivityTag:val.isShowActivityTag,
                                    activityTagName:val.activityTagName,
                                    activityTagColor:val.activityTagColor,
                                    typeId:typeId
                                });
                            } else {
                                html += videoDomWithImg({
                                    resourceUrl: resourceUrl,
                                    resourceId: resourceId,
                                    resourceName: resourceName,
                                    customerName: customerName,
                                    browseNum: browseNum,
                                    picUrl: picUrl,
                                    itemAbstract: itemAbstract,
                                    playTime: playTime,
                                    videoType:val.resourceSecondType,
                                    score:score,
                                    scoreNum:scoreNum,
                                    isShowActivityTag:val.isShowActivityTag,
                                    activityTagName:val.activityTagName,
                                    activityTagColor:val.activityTagColor,
                                    typeId:typeId
                                });
                            }
                            break;
                        case 3:
                            html += meetingDom({
                                conUrl: resourceUrl,
                                conName: resourceName,
                                conMainPicUrl: picUrl,
                                startTime: startTime,
                                endTime: endTime,
                                conLocation: conLocation,
                                resourceId: resourceId,
                                typeId:typeId
                            });
                            break;
                        default:   //话题
                            if(typeId==4){//话题
                                resourceName=resourceName?resourceName:'话题医起聊';
                            }
                            if (picUrl.length > 0) {
                                html += domHtmlWithImg({
                                    resourceUrl: resourceUrl,
                                    resourceId: resourceId,
                                    resourceName: resourceName,
                                    customerName: customerName,
                                    browseNum: browseNum,
                                    picUrl: picUrl,
                                    itemAbstract: itemAbstract,
                                    score:score,
                                    scoreNum:scoreNum,
                                    isShowActivityTag:val.isShowActivityTag,
                                    activityTagName:val.activityTagName,
                                    activityTagColor:val.activityTagColor,
                                    typeId:typeId
                                });
                            } else {
                                html += domHtmlNoImg({
                                    resourceUrl: resourceUrl,
                                    resourceId: resourceId,
                                    resourceName: resourceName,
                                    customerName: customerName,
                                    browseNum: browseNum,
                                    itemAbstract: itemAbstract,
                                    videoType:val.videoType,
                                    score:score,
                                    scoreNum:scoreNum,
                                    isShowActivityTag:val.isShowActivityTag,
                                    activityTagName:val.activityTagName,
                                    activityTagColor:val.activityTagColor,
                                    typeId:typeId
                                });
                            }
                    }
                }
            });
            return html;
        }
    }
    var searchKey=$(".al-searchMain_topHead input").val();
    if(searchKey.length>0){
        var searchParam=searchKey;
    }else{
        var searchParam=$(".al-headerSearch input").val();
    }
    var allJson={
        "pageIndex":1,
        "pageSize":10,
        "searchParam": searchParam,//搜索关键词
        "logoUseFlag":UseFlag.c,
        "useFlag":$("#sesCustomerId").val()?2:1,//  --登录传入2，不登录传入1
        "attUseFlag":AttUseFlag.c,
        "sortType":sortType,//1：相关度；2：发布时间:3:浏览数
        "searchType":1,//1：模糊  2精确
        "scene":1,
        "platformId": $('#sesDepartment').val(),
        "sessionCustomerId":customerId,
        "opUsr":customerId
    };
    var params= {paramJson:$.toJSON(allJson)};
    comm.ajax.async("/call/search/searchAllNew/", params,function(data){
        comm.LightBox.hideloading();
        if(data&&data.responseObject&&data.responseObject.responseData){
            var data_list=data.responseObject.responseData;
            var countResource=data.responseObject.responseData.resource_count;
            var countCustomer=data.responseObject.responseData.customer_count;
            var totalCount=countResource+countCustomer;
            var pagecount=Math.ceil(countResource/allJson.pageSize);//总页数
            var html=addReHTml(data_list);
            $(".ev-recommendCon").eq(0).html(html);
            preventHref();
            $(".pager").eq(0).pager({pagenumber:1, pagecount: pagecount, buttonClickCallback: PageClick});
            if(data_list.length<allJson.pageSize){
                $(".pager").hide();
            }
        }else{
            $(".pager").eq(0).empty();
            $('.ev-shareContainer').hide();
            $(".ev_searchSiteName").click();
        }
    });
    PageClick = function(pageclickednumber,buttonLabel){
        allJson.pageIndex = pageclickednumber;//加载第几页；
        var params= {paramJson:$.toJSON(allJson)};
        comm.ajax.async("/call/search/searchAllNew/", params,function(data){
            if(data&&data.responseObject&&data.responseObject.responseData){
                var countResource=data.responseObject.responseData.resource_count;
                var countCustomer=data.responseObject.responseData.customer_count;
                var totalCount=countCustomer+countResource;
                var pagecount=Math.ceil(countResource/allJson.pageSize);//总页数
                var data_list=data.responseObject.responseData;
                var html=addReHTml(data_list);
                $(".ev-recommendCon").eq(0).html(html);
                preventHref();
                $(".pager").eq(0).pager({ pagenumber: pageclickednumber, pagecount: pagecount, buttonClickCallback: PageClick });
                if(data_list.length<allJson.pageSize){
                    $(".pager").hide();
                }
                scrollTop();
            }
        });
        createEvent(pageclickednumber,buttonLabel);
    };
}

//其他类型的推荐
function recommendOthers(num){
    var searchKey=$(".al-searchMain_topHead input").val();
    if(searchKey.length>0){
        var searchParam=searchKey;
    }else{
        var searchParam=$(".al-headerSearch input").val();
    }

    dataId=num;
    var addr="/call/search";
    var urlarr=[
        "/searchAllNew/",
        "/searchCase/",
        "/searchVideo/",
        "/searchConference/",
        "/searchUser/",
        "/searchDoc/",
        "/searchTopic/"
    ];
    switch (num) {
        case 2:                 //加载病例
            url = urlarr[1];        //病例资源地址
            var Case = {
                attUseFlag: AttUseFlag.h,
                pageIndex: 1,
                pageSize: 10,
                searchParam: searchParam,//搜索关键词
                logoUseFlag: UseFlag.d,
                sortType: sortType,
                searchType: 1,//1：模糊  2精确
                sessionCustomerId:customerId,
                platformId: $('#sesDepartment').val(),
                opUsr:customerId
            };

        function addCase1(data_list, totalCount) {
            var html = "";
            // var total_count=totalCount;
            //html+='<header class="al-searchMain_head">为您找到相关结果 <span>'+total_count+'</span> 个'
            if (data_list && data_list.length > 0) {
                $(".ev-recommend").eq(dataId-1).show();
                $(".pager").eq(dataId-1).show();
                var total_count = totalCount;
                $.each(data_list, function (i, val) {
                    if (val instanceof Array) {
                        $.each(val, function (j, vale) {
                        });
                    } else {
                        var caseName = val.case_baseinfo.caseName;
                        var caseId = val.case_baseinfo.caseId;
                        var mainNarrate = val.case_baseinfo.mainNarrate;
                        var firstName = val.case_customer_auth.firstName;
                        var lastName = val.case_customer_auth.lastName;
                        var reviewNum = val.case_baseinfo.reviewNum.toWK();
                        var attUrl = val.case_attachment.attUrl;     //图片地址
                        var url = val.case_baseinfo.pageStoragePath;  //url
                        var browseNum = val.case_baseinfo.browseNum.toWK();
                        var isShowActivityTag=val.isShowActivityTag;
                        var activityTagName=val.activityTagName;
                        var activityTagColor=val.activityTagColor;
                    }
                    var activityTag="";
                    if(isShowActivityTag){//活动资源标识
                        var color=activityTagColor;
                        activityTag='<span class="al-contentActivityTag" style="border-color:'+color+';color:'+color+'">'+activityTagName+'</span>';
                        //activityTag='<span class="al-contentActivityTag" style="border-color:red;color:red">万例挑一</span>';
                    }
                    if (attUrl.length > 0) {
                        var timestamp = Date.parse(new Date());
                        html += '</header><section class="al-disMajorMainBox_body">'+scoreDom(val.currentStarLevel?val.currentStarLevel.currentStarLevel:undefined,val.currentStarLevel?val.currentStarLevel.currentScoreNum:0)+'<figure class="al-disMajorMainBox_bodyText">' +
                            '<a  href="' + voidHref(url,0) + '" voidHref="'+voidHref(url,3)+'"  class="al-contentTitle ev-sRList" data-id="' + caseId + '" target="'+voidHref(url,1)+'" data-type="7">' +
                            '<span>' + comm.getStrLen(caseName, 50) + '</span></a><p>' + mainNarrate + '</p><div>' +
                            activityTag+
                            (function(){
                                var str='';
                                if(firstName||lastName){
                                    str+='      <span><i class="user"></i>' + cutAuthName(lastName + firstName) + '</span>';
                                }
                                return str;
                            }())+
                            '<span><i class="read"></i>' + browseNum + '</span></div></figure>' +
                            '<figure class="al-disMajorMainBox_bodyImg"><a href="' + url + '" class="al-contentTitle" data-id="' + caseId + '" target="_blank"><img src="' + attUrl.split('|')[0] + '?' + timestamp + '" alt=""/></a>' +
                            '</figure></section>';
                    } else {
                        html += '<section class="al-contentInALine">'+scoreDom(val.currentStarLevel?val.currentStarLevel.currentStarLevel:undefined,val.currentStarLevel?val.currentStarLevel.currentScoreNum:0)+'<article class="al-contentText">' +
                            '<a href="' + voidHref(url,0) + '" voidHref="'+voidHref(url,3)+'"  class="al-contentTitle ev-sRList" data-id="' + caseId + '" data-type="7" target="'+voidHref(url,1)+'"><span>' + comm.getStrLen(caseName, 50) + '</span></a> ' +
                            '<p class="al-contentMainText"><span>' + mainNarrate + '</span></p><p class="al-contentOtherMsg">' +
                            activityTag+
                            (function(){
                                var str='';
                                if(firstName||lastName){
                                    str+='      <span><i class="al-contentAuthor"></i>' + cutAuthName(lastName + firstName )+ '</span>';
                                }
                                return str;
                            }())+
                            '<span>' +
                            '<i class="al-contentWatchedNum"></i>' + browseNum + '</span></p></article></section>';
                    }
                })
            }
            $(".pager").eq(dataId - 1).show();
            $(".ev-recommendCon").eq(dataId - 1).html(html);
            preventHref();
            //搜索列表病例列表
            $('.ev-sRList').off('click').on('click',function (e) {
                e.preventDefault();
                comm.creatEvent({
                    triggerType:1,
                    actionId:11049,
                    refId:$(this).attr('data-id'),
                    refType:$(this).attr('data-type'),
                    async:false
                });
                var reg = /(?:http(?:s|):\/\/|)(?:(?:\w*?)\.|)(?:\w*?)\.(?:\w{2,4})(?:\?.*|\/.*|)$/ig
                if(reg.test($(this).attr('href'))) {
                    g_sps.jump(null, $(this).attr('href'), true);
                }
            });
        }

            comm.ajax.async(addr + url, Case, function (data) {
                if (data && data.responseObject && data.responseObject.responseData && !$.isEmptyObject(data.responseObject.responseData) && data.responseObject.responseData.data_list.length) {
                    $(".al-al-searchMain_head span").text(data.responseObject.responseData.total_count);
                    var totalCount = data.responseObject.responseData.total_count;
                    var pagecount = Math.ceil(totalCount / Case.pageSize);//总页数
                    $(".al-al-searchMain_head span").text(totalCount);
                    var data_list = data.responseObject.responseData.data_list;
                    addCase1(data_list, totalCount);
                    $(".pager").eq(dataId - 1).pager({
                        pagenumber: 1,
                        pagecount: pagecount,
                        buttonClickCallback: PageClick
                    });
                    if(data_list.length<Case.pageSize){
                        $(".pager").hide();
                    }
                } else {
                    $(".pager").eq(dataId - 1).hide();
                    $(".ev-recommend").eq(dataId-1).hide();
                    $(".ev-recommendCon").eq(dataId - 1).html("");
                    $(".ev_searchSiteName").click();
                }
            });
            PageClick = function (pageclickednumber,buttonLabel) {
                Case.pageIndex = pageclickednumber;//加载第几页；
                comm.ajax.async(addr + url, Case, function (data) {
                    if (data && data.responseObject && data.responseObject.responseData && !$.isEmptyObject(data.responseObject.responseData) && data.responseObject.responseData.data_list.length) {
                        var totalCount = data.responseObject.responseData.total_count;
                        var pagecount = Math.ceil(totalCount / Case.pageSize);//总页数
                        addCase1(data.responseObject.responseData.data_list);
                        $(".pager").eq(dataId - 1).pager({
                            pagenumber: pageclickednumber,
                            pagecount: pagecount,
                            buttonClickCallback: PageClick
                        });//初始化加载第一页的时候如果数据不足一页不用展示分页器
                        if((parseInt(pageclickednumber,10)===1)&&data.responseObject.responseData.data_list.length<Case.pageSize){
                            $(".pager").hide();
                        }
                        scrollTop();
                    }
                });
                createEvent(pageclickednumber,buttonLabel);
            };

            break;
        case 3:                  //加载视频
            url = urlarr[2];       //视频资源地址
            var video = {
                useFlag: UseFlag.c,
                pageIndex: 1,
                pageSize: 10,
                searchParam: searchParam,  //搜索关键词
                logoUseFlag: UseFlag.d,
                sortType: sortType,
                searchType: 1,//1：模糊  2精确
                sessionCustomerId:customerId,
                opUsr:customerId,
                platformId: $('#sesDepartment').val()
            };

        function addVideo1(data_list, totalCount) {
            var html = "";
            //var total_count=totalCount;
            // html+='<header class="al-searchMain_head">为您找到相关结果 <span>'+total_count+'</span> 个</header>';
            if (data_list && data_list.length > 0) {
                $(".ev-recommend").eq(dataId-1).show();
                $(".pager").eq(dataId-1).show();
                $.each(data_list, function (i, val) {
                    if (val instanceof Array) {
                        $.each(val, function (j, vale) {
                            var aa = vale.bb.cc;
                        });
                    } else {
                        var videoName = val.cms_video.videoName ? comm.getStrLen(val.cms_video.videoName, 23 * 2) : "";
                        var videoAbstract = val.cms_video.videoAbstract ? comm.getStrLen(val.cms_video.videoAbstract, 45 * 2) : "";
                        var lastName = val.cms_video_customer_auth.lastName;
                        var firstName = val.cms_video_customer_auth.firstName;
                        var customerName=val.cms_video.ownerNameStr;
                        var reviewNum = val.cms_video.reviewNum;
                        var videoAttUrl = val.cms_video_attachment_logo.videoAttUrl;
                        var playTime = val.cms_video.playTime;
                        var videoId = val.cms_video.videoId;
                        var url = val.cms_video.pageStoragePath;
                        var playNum = val.cms_video.playNum;
                        var videoType= val.cms_video.videoType;
                        var isShowActivityTag=val.isShowActivityTag;
                        var activityTagName=val.activityTagName;
                        var activityTagColor=val.activityTagColor;
                        var videoType=(val.cms_video.videoType?val.cms_video.videoType:'');
                    }
                    var timestamp = Date.parse(new Date());//时间戳
                    var videoPic = videoAttUrl.split('|')[0];
                    if (videoPic.lastIndexOf("?") > -1) {
                        videoPic = videoPic + timestamp;
                    } else {
                        videoPic = videoPic + "?" + timestamp;
                    }
                    var activityTag="";
                    if(isShowActivityTag){//活动资源标识
                        var color=activityTagColor;
                        activityTag='<span class="al-contentActivityTag" style="border-color:'+color+';color:'+color+'">'+activityTagName+'</span>';
                        //activityTag='<span class="al-contentActivityTag" style="border-color:red;color:red">万例挑一</span>';
                    }
                    html += '<section class="al-disMajorMainBox_body">'+scoreDom(val.currentStarLevel?val.currentStarLevel.currentStarLevel:undefined,val.currentStarLevel?val.currentStarLevel.currentScoreNum:0)+'<figure class="al-disMajorMainBox_bodyText">' +
                        '<a href="' + url + '" target="_blank" class="ev-sRList" data-type="1" data-id="'+videoId+'"><span>' + videoName + '</span></a><p>' + videoAbstract + '</p><div>' +
                        activityTag+(videoType==1?'<span class="surgeryVideoTag">手术视频</span>':'')+
                        (function(){
                            var str='';
                            if(firstName||lastName){
                                str+='      <span><i class="user'+((videoType&&(videoType==17||videoType==18||videoType==19))?' authorNoUserId':'')+'"></i>' + cutAuthName(customerName) + '</span>';
                            }
                            return str;
                        }())+
                        '<span><i class="read"></i>' + playNum + '</span></div></figure>' +
                        '<figure class="al-disMajorMainBox_bodyImg"><a class="ev-sRList" href="' + url + '" target="_blank" data-type="1" data-id="'+videoId+'"><img src="' + videoPic + '" alt=""/>' +
                        '<b></b><span>' + playTime + '</span></a></figure></section>';
                })
            }
            $(".pager").eq(dataId - 1).show();
            $(".ev-recommendCon").eq(dataId - 1).html(html);
            preventHref();
            //推荐搜索列表视频列表
            $('.ev-sRList').off('click').on('click',function (e) {
                e.preventDefault();
                comm.creatEvent({
                    triggerType:1,
                    actionId:11049,
                    refId:$(this).attr('data-id'),
                    refType:$(this).attr('data-type'),
                    async:false
                });
                var reg = /(?:http(?:s|):\/\/|)(?:(?:\w*?)\.|)(?:\w*?)\.(?:\w{2,4})(?:\?.*|\/.*|)$/ig
                if(reg.test($(this).attr('href'))) {
                    g_sps.jump(null, $(this).attr('href'), true);
                }
            });
        }
            comm.ajax.async(addr + url, video, function (data) {
                if (data && data.responseObject && data.responseObject.responseData && !$.isEmptyObject(data.responseObject.responseData) && data.responseObject.responseData.data_list.length) {
                    $(".al-al-searchMain_head span").text(data.responseObject.responseData.total_count);
                    var totalCount = data.responseObject.responseData.total_count;
                    var pagecount = Math.ceil(totalCount / video.pageSize);//总页数
                    $(".al-al-searchMain_head span").text(totalCount);
                    var data_list = data.responseObject.responseData.data_list;
                    addVideo1(data_list, totalCount);
                    $(".pager").eq(dataId - 1).pager({
                        pagenumber: 1,
                        pagecount: pagecount,
                        buttonClickCallback: PageClick
                    });
                    if(data_list.length<video.pageSize){
                        $(".pager").hide();
                    }
                } else {
                    $(".pager").eq(dataId - 1).hide();
                    $(".ev-recommend").eq(dataId-1).hide();
                    $(".ev-recommendCon").eq(dataId - 1).html("");
                    $(".ev_searchSiteName").click();
                }
            });
            PageClick = function (pageclickednumber,buttonLabel) {
                video.pageIndex = pageclickednumber;//加载第几页；
                comm.ajax.async(addr + url, video, function (data) {
                    if (data && data.responseObject && data.responseObject.responseData && !$.isEmptyObject(data.responseObject.responseData) && data.responseObject.responseData.data_list.length) {
                        var totalCount = data.responseObject.responseData.total_count;
                        var pagecount = Math.ceil(totalCount / video.pageSize);//总页数
                        addVideo1(data.responseObject.responseData.data_list, totalCount);
                        $(".pager").eq(dataId - 1).pager({
                            pagenumber: pageclickednumber,
                            pagecount: pagecount,
                            buttonClickCallback: PageClick
                        });//初始化加载第一页的时候如果数据不足一页不用展示分页器
                        if((parseInt(pageclickednumber,10)===1)&&data.responseObject.responseData.data_list.length<video.pageSize){
                            $(".pager").hide();
                        }
                        scrollTop();
                    }
                });
                createEvent(pageclickednumber,buttonLabel);
            };
            break;
        case 4:                 //加载会议--begin--
            url = urlarr[3];              //会议资源地址
            var conference = {
                "attUseFlag": AttUseFlag.h,
                "pageIndex": 1,
                "pageSize": 10,
                "searchParam": searchParam,         //搜索关键词
                "logoUseFlag": UseFlag.d,
                "sortType": sortType,
                searchType: 1,//1：模糊  2精确
                'sessionCustomerId':customerId,
                "opUsr":customerId,
                platformId: $('#sesDepartment').val()
            };

        function addConfe1(data_list) {
            var html = "";
            if (data_list && data_list.length > 0) {
                $(".ev-recommend").eq(dataId-1).show();
                $(".pager").eq(dataId-1).show();
                $.each(data_list, function (i, val) {
                    if (val instanceof Array) {
                        $.each(val, function (j, vale) {
                        });
                    } else {
                        var conName = val.conName;
                        var country = val.country;
                        var city = val.city;
                        var conId = val.conId;
                        var conUrl = val.menuUrlAllin_detail;
                        var conMainPicUrl = val.conMainPicUrl;
                        var startTime = val.startTime;
                        var d = new Date(startTime);
                        var ystartTime = startTime.substring(0,4)+"/"+startTime.substring(5,7)+"/"+startTime.substring(8,10);//formatDate(d, 'yyyy/MM/dd');
                        var endTime = val.endTime;
                        var endd = new Date(endTime);
                        var yendTime = endTime.substring(5,7)+"/"+endTime.substring(8,10);//formatDate(endd, 'MM/dd');

                        function formatDate(date, fmt) {
                            var o = {
                                "M+": date.getMonth() + 1, //月份
                                "d+": date.getDate(), //日
                                "h+": date.getHours(), //小时
                                "m+": date.getMinutes(), //分
                                "s+": date.getSeconds(), //秒
                                "q+": Math.floor((date.getMonth() + 3) / 3), //季度
                                "S": date.getMilliseconds() //毫秒
                            };
                            if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
                            for (var k in o)
                                if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
                            return fmt;
                        }
                    }
                    html += '<section class="al-contentInALine"><article class="al-contentText"><a href="' + voidHref(conUrl,0) + '" voidHref="'+voidHref(conUrl,3)+'"  class="al-contentTitle ev-sRList" target="'+voidHref(conUrl,1)+'" data-type="3" data-id="'+conId+'">' +
                        '<span>' + conName + '</span></a>' +
                        (conMainPicUrl?'<figure class="al-contentImgBox"><a href="' + conUrl + '" target="_blank" class="ev-sRList" data-type="3" data-id="'+conId+'"><img src="' + conMainPicUrl + '" alt=""><i class="al-mark"><img src="//img10.allinmd.cn/v3/common/icon/mark_meeting.png" alt=""></i></a></figure>':'') +
                        '<div class="al-meeting_timePlace">' +
                        '<figure class="al-meeting_time"><i class="al-meetingTimeIcon"></i><span>' + ystartTime + '<b class="al-line">-</b>' + yendTime + '</span></figure>' +
                        '<figure class="al-meeting_place"><i class="al-meetingPlaceIcon"></i><span>' + country + '<b class="roundDot">·</b>' + city + '</span>' +
                        '</figure></div></article></section>';
                })
            }
            $(".pager").eq(dataId - 1).show();
            $(".ev-recommendCon").eq(dataId - 1).html(html);
            preventHref();
            //推荐搜索列表会议列表
            $('.ev-sRList').off('click').on('click',function (e) {
                e.preventDefault();
                comm.creatEvent({
                    triggerType:1,
                    actionId:11049,
                    refId:$(this).attr('data-id'),
                    refType:$(this).attr('data-type'),
                    async:false
                });
                var reg = /(?:http(?:s|):\/\/|)(?:(?:\w*?)\.|)(?:\w*?)\.(?:\w{2,4})(?:\?.*|\/.*|)$/ig
                if(reg.test($(this).attr('href'))) {
                    g_sps.jump(null, $(this).attr('href'), true);
                }
            });
        }
            comm.ajax.async(addr + url, conference, function (data) {
                if (data && data.responseObject && data.responseObject.responseData && !$.isEmptyObject(data.responseObject.responseData) && data.responseObject.responseData.data_list.length) {
                    $(".al-al-searchMain_head span").text(data.responseObject.responseData.total_count);
                    var totalCount = data.responseObject.responseData.total_count;
                    var pagecount = Math.ceil(totalCount / conference.pageSize);//总页数
                    //$(".al-al-searchMain_head span").text(totalCount);
                    var data_list = data.responseObject.responseData.data_list;
                    addConfe1(data_list);
                    $(".pager").eq(dataId - 1).pager({
                        pagenumber: 1,
                        pagecount: pagecount,
                        buttonClickCallback: PageClick
                    });
                    if(data_list.length<conference.pageSize){
                        $(".pager").hide();
                    }
                } else {
                    $(".pager").eq(dataId - 1).hide();
                    $(".ev-recommend").eq(dataId-1).hide();
                    $(".ev-recommendCon").eq(dataId - 1).html("");
                    $(".ev_searchSiteName").click();
                }
            });
            PageClick = function (pageclickednumber,buttonLabel) {
                conference.pageIndex = pageclickednumber;//加载第几页；
                comm.ajax.async(addr + url, conference, function (data) {
                    if (data && data.responseObject && data.responseObject.responseData && !$.isEmptyObject(data.responseObject.responseData) && data.responseObject.responseData.data_list.length) {
                        var totalCount = data.responseObject.responseData.total_count;
                        var pagecount = Math.ceil(totalCount / conference.pageSize);//总页数
                        addConfe1(data.responseObject.responseData.data_list);
                        $(".pager").eq(dataId - 1).pager({
                            pagenumber: pageclickednumber,
                            pagecount: pagecount,
                            buttonClickCallback: PageClick
                        });//初始化加载第一页的时候如果数据不足一页不用展示分页器
                        if((parseInt(pageclickednumber,10)===1)&&data.responseObject.responseData.data_list.length<conference.pageSize){
                            $(".pager").hide();
                        }
                        scrollTop();
                    }
                });
                createEvent(pageclickednumber,buttonLabel);
            };

            $("[data-target=" + dataId + "]").css("display", "block");
            break;              //加载会议--END--
        case 5:                  //加载医师--begin--
            url = urlarr[4];        //医师资源地址
            var userJson = {
                pageIndex: 1,
                pageSize: 10,
                sortType: sortType,
                searchParam: searchParam,//搜索关键词
                attUseFlag: AttUseFlag.c,
                logoUseFlag: UseFlag.c,
                dataFlag: $("#sesCustomerId").val() != undefined ? 2 : 1,
                isValid: 1,
                searchType: 1,//1：模糊  2精确
                sessionCustomerId:customerId,
                opUsr:customerId,
                platformId: $('#sesDepartment').val()
            };

        function addUserHtml1(data_list) {
            if (data_list && data_list.length > 0) {
                $(".ev-recommend").eq(dataId-1).show();
                $(".pager").eq(dataId-1).show();
                var arrHT = [];
                $.each(data_list, function (i, val) {
                    var logo;
                    var user;
                    var statistic;
                    if (val.customer_att) {
                        logo = val.customer_att;
                    }
                    if (val.customer_auth) {
                        user = val.customer_auth;
                    }
                    if (val.customer_statistic) {
                        statistic = val.customer_statistic;
                    }
                    name = user.lastName + user.firstName;
                    medicalTitle = user.medicalTitleShow;
                    company = user.company ? comm.getStrLen(user.company, 46) : "";
                    contribuNum = statistic.caseNum + statistic.docNum + statistic.topicNum + statistic.videoNum;//贡献值
                    arrHT.push(module.resourceListTemplate({tempName: "userList"})({
                        cid: user.customerId,
                        customerId: $('#sesCustomerId').val(),
                        userName: name,
                        logoUrl: logo.logoUrl,
                        state: user.state,
                        medicalTitle: medicalTitle,
                        company: company,
                        contribuNum: contribuNum,
                        reviewNum: statistic.reviewNum,
                        fansNum: statistic.fansNum,
                        relationship: val.customer_follow_people.relationship
                    }));
                });
                $(".pager").eq(dataId - 1).show();
                $(".ev-recommendCon").eq(dataId - 1).html(arrHT);
                preventHref();
                //推荐搜索列表医师列表
                $('.ev-sRList').off('click').on('click',function (e) {
                    e.preventDefault();
                    comm.creatEvent({
                        triggerType:1,
                        actionId:11049,
                        refId:$(this).attr('data-id'),
                        refType:$(this).attr('data-type'),
                        async:false
                    });
                    var reg = /(?:http(?:s|):\/\/|)(?:(?:\w*?)\.|)(?:\w*?)\.(?:\w{2,4})(?:\?.*|\/.*|)$/ig
                    if(reg.test($(this).attr('href'))) {
                        g_sps.jump(null, $(this).attr('href'), true);
                    }
                });
            } else {

            }
        };
            comm.ajax.async(addr + url, userJson, function (data) {
                if (data && data.responseObject && data.responseObject.responseData && !$.isEmptyObject(data.responseObject.responseData) && data.responseObject.responseData.data_list.length) {
                    var totalCount = data.responseObject.responseData.total_count;
                    var pagecount = Math.ceil(totalCount / userJson.pageSize);//总页数
                    //$(".al-searchMain_head span").text(totalCount);
                    var data_list = data.responseObject.responseData.data_list;
                    addUserHtml1(data_list);
                    $(".pager").eq(dataId - 1).pager({
                        pagenumber: 1,
                        pagecount: pagecount,
                        buttonClickCallback: PageClick
                    });
                    if(data_list.length<userJson.pageSize){
                        $(".pager").hide();
                    }
                } else {
                    $(".pager").eq(dataId - 1).hide();
                    $(".ev-recommend").eq(dataId-1).hide();
                    $(".ev-recommendCon").eq(dataId - 1).html("");
                    $(".ev_searchSiteName").click();
                }
            });
            PageClick = function (pageclickednumber,buttonLabel) {
                userJson.pageIndex = pageclickednumber;
                comm.ajax.async(addr + url, userJson, function (data) {
                    if (data && data.responseObject && data.responseObject.responseData && !$.isEmptyObject(data.responseObject.responseData) && data.responseObject.responseData.data_list.length) {
                        var totalCount = data.responseObject.responseData.total_count;
                        var pagecount = Math.ceil(totalCount / userJson.pageSize);//总页数
                        $(".pager").eq(dataId - 1).pager({
                            pagenumber: pageclickednumber,
                            pagecount: pagecount,
                            buttonClickCallback: PageClick
                        });//初始化加载第一页的时候如果数据不足一页不用展示分页器
                        if((parseInt(pageclickednumber,10)===1)&&data.responseObject.responseData.data_list.length<userJson.pageSize){
                            $(".pager").hide();
                        }
                        addUserHtml1(data.responseObject.responseData.data_list);
                        scrollTop();
                    }
                });
                createEvent(pageclickednumber,buttonLabel);
            };

            $("[data-target=" + dataId + "]").css("display", "block");
            break;            //加载医师--END--
        case 6:                  //加载文库
            url = urlarr[5];       //文库资源地址
            var Doc = {
                attUseFlag: AttUseFlag.h,
                pageIndex: 1,
                pageSize: 10,
                searchParam: searchParam,//搜索关键词
                logoUseFlag: UseFlag.d,
                sortType: sortType,
                searchType: 1,//1：模糊  2精确
                sessionCustomerId:customerId,
                opUsr:customerId,
                platformId: $('#sesDepartment').val()
            };

        function addHtml1(data_list) {
            var html = "";
            if (data_list && data_list.length > 0) {
                $(".ev-recommend").eq(dataId-1).show();
                $(".pager").eq(dataId-1).show();
                $.each(data_list, function (i, val) {
                    var _score='';
                    if (val instanceof Array) {
                        $.each(val, function (j, vale) {
                        });
                    } else {
                        var docName = val.customer_doc.docName ? comm.getStrLen(val.customer_doc.docName, 23 * 2) : "";
                        var docAbstract = val.customer_doc.docAbstract ? comm.getStrLen(val.customer_doc.docAbstract, 45 * 2) : "";
                        var docAttUrl = val.cms_doc_attachment_logo.docAttUrl; //图片地址
                        var lastName = val.customer_auth.lastName;
                        var firstName = val.customer_auth.firstName;
                        var customerId = val.customer_auth.customerId;
                        var reviewNum = val.customer_doc.reviewNum.toWK();
                        var pageStoragePath = val.customer_doc.pageStoragePath;
                        var docId = val.customer_doc.docId;
                        var browseNum = val.customer_doc.browseNum.toWK();
                        _score = scoreDom(val.currentStarLevel?val.currentStarLevel.currentStarLevel:undefined,val.currentStarLevel?val.currentStarLevel.currentScoreNum:0);
                        var isShowActivityTag=val.isShowActivityTag;
                        var activityTagName=val.activityTagName;
                        var activityTagColor=val.activityTagColor;
                        var videoType=(val.customer_doc.docType?val.customer_doc.docType:'');
                    }
                    var activityTag="";
                    if(isShowActivityTag){//活动资源标识
                        var color=activityTagColor;
                        activityTag='<span class="al-contentActivityTag" style="border-color:'+color+';color:'+color+'">'+activityTagName+'</span>';
                        //activityTag='<span class="al-contentActivityTag" style="border-color:red;color:red">万例挑一</span>';
                    }
                    if (docAttUrl.length > 0) {
                        var timestamp = Date.parse(new Date());
                        html += '<section class="al-disMajorMainBox_body">'+_score+'<figure class="al-disMajorMainBox_bodyText">' +
                            '<a href="' + pageStoragePath + '" target="_blank" class="ev-sRList" data-id="' + docId + '" data-type="2"><span data-id="' + docId + '">' + docName + '</span></a><p>' + docAbstract + '</p><div>' +
                            activityTag+
                            (function(){
                                var str='';
                                if(firstName||lastName){
                                    str+='      <span><i class="user'+((videoType&&(videoType==17||videoType==18||videoType==19))?' authorNoUserId':'')+'"></i>' + cutAuthName(lastName + firstName) + '</span>';
                                }
                                return str;
                            }())+
                            '<span><i class="read"></i>' + browseNum + '</span>' +
                            '</div></figure><figure class="al-disMajorMainBox_bodyImg"><a class="ev-sRList" data-id="' + docId + '" data-type="2" href="' + pageStoragePath + '" target="_blank"><img src="' + docAttUrl.split('|')[0] + '?' + timestamp + '" alt=""/></a></figure></section>';
                    } else {
                        html += '<section class="al-contentInALine">'+_score+'<article class="al-contentText">' +
                            '<a href="' + voidHref(pageStoragePath,0) + '" voidHref="'+voidHref(pageStoragePath,3)+'"  target="'+voidHref(pageStoragePath,1)+'" class="al-contentTitle ev-sRList" data-id="' + docId + '" data-type="2"><span>' + docName + '</span></a> ' +
                            '<p class="al-contentMainText"><span>' + docAbstract + '</span></p><p class="al-contentOtherMsg">' +
                            activityTag+
                            (function(){
                                var str='';
                                if(firstName||lastName){
                                    str+='      <span><i class="al-contentAuthor'+((videoType&&(videoType==17||videoType==18||videoType==19))?' authorNoUserId':'')+'"></i>' + cutAuthName(lastName + firstName) + '</span>';
                                }
                                return str;
                            }())+
                            '<span>' +
                            '<i class="al-contentWatchedNum"></i>' + browseNum + '</span></p></article></section>';
                    }
                })
            }
            $(".pager").eq(dataId - 1).show();
            $(".ev-recommendCon").eq(dataId - 1).html(html);
            preventHref();
            //推荐搜索列表文库列表
            $('.ev-sRList').off('click').on('click',function (e) {
                e.preventDefault();
                comm.creatEvent({
                    triggerType:1,
                    actionId:11049,
                    refId:$(this).attr('data-id'),
                    refType:$(this).attr('data-type'),
                    async:false
                });
                var reg = /(?:http(?:s|):\/\/|)(?:(?:\w*?)\.|)(?:\w*?)\.(?:\w{2,4})(?:\?.*|\/.*|)$/ig
                if(reg.test($(this).attr('href'))) {
                    g_sps.jump(null, $(this).attr('href'), true);
                }
            });
        };
            comm.ajax.async(addr + url, Doc, function (data) {
                if (data && data.responseObject && data.responseObject.responseData && !$.isEmptyObject(data.responseObject.responseData) && data.responseObject.responseData.data_list.length) {
                    $(".al-al-searchMain_head span").text(data.responseObject.responseData.total_count);
                    var totalCount = data.responseObject.responseData.total_count;
                    var pagecount = Math.ceil(totalCount / Doc.pageSize);//总页数
                    $(".al-al-searchMain_head span").text(totalCount);
                    var data_list = data.responseObject.responseData.data_list;
                    addHtml1(data_list, totalCount);
                    $(".pager").eq(dataId - 1).pager({
                        pagenumber: 1,
                        pagecount: pagecount,
                        buttonClickCallback: PageClick
                    });
                    if(data_list.length<Doc.pageSize){
                        $(".pager").hide();
                    }
                } else {
                    $(".pager").eq(dataId - 1).hide();
                    $(".ev-recommend").eq(dataId-1).hide();
                    $(".ev-recommendCon").eq(dataId - 1).html("");
                    $(".ev_searchSiteName").click();
                }
            });
            PageClick = function (pageclickednumber,buttonLabel) {
                Doc.pageIndex = pageclickednumber;//加载第几页；
                comm.ajax.async(addr + url, Doc, function (data) {
                    if (data && data.responseObject && data.responseObject.responseData && !$.isEmptyObject(data.responseObject.responseData) && data.responseObject.responseData.data_list.length) {
                        var totalCount = data.responseObject.responseData.total_count;
                        var pagecount = Math.ceil(totalCount / Doc.pageSize);//总页数
                        addHtml1(data.responseObject.responseData.data_list, totalCount);
                        $(".pager").eq(dataId - 1).pager({
                            pagenumber: pageclickednumber,
                            pagecount: pagecount,
                            buttonClickCallback: PageClick
                        });//初始化加载第一页的时候如果数据不足一页不用展示分页器
                        if((parseInt(pageclickednumber,10)===1)&&data.responseObject.responseData.data_list.length<Doc.pageSize){
                            $(".pager").hide();
                        }
                        scrollTop();
                    } else {

                    }
                });
                createEvent(pageclickednumber,buttonLabel);
            };

            $("[data-target=" + dataId + "]").css("display", "block");
            break;
        case 7:                  //加载话题
            comm.Log.createBrowse({href: location.href, id: 60, name: '搜索话题页面',platformId: $('#sesDepartment').val(),noTimeOut:1});
            url = urlarr[6];       //话题资源地址
            var topic = {
                attUseFlag: AttUseFlag.h,
                pageIndex: 1,
                pageSize: 10,
                searchParam: searchParam,//搜索关键词
                logoUseFlag: UseFlag.d,
                sortType: sortType,
                searchType: 1,//1：模糊  2精确
                sessionCustomerId:customerId,
                opUsr:customerId,
                platformId: $('#sesDepartment').val()
            };

        function addTopHtml1(data_list) {
            var html = "";
            //html+='<header class="al-searchMain_head">为您找到相关结果 <span>'+total_count+'</span> 个</header>';
            if (data_list && data_list.length > 0) {
                $(".ev-recommend").eq(dataId-1).show();
                $(".pager").eq(dataId-1).show();
                $.each(data_list, function (i, val) {
                    if (val instanceof Array) {
                        $.each(val, function (j, vale) {
                            var aa = vale.bb.cc;
                        });
                    } else {
                        var topicName = val.cms_topic.topicName ? comm.getStrLen(val.cms_topic.topicName, 23 * 2) : "话题医起聊"; //名字
                        var topicId = val.cms_topic.topicId;
                        var lastName = val.cms_topic_customer_auth.lastName;
                        var firstName = val.cms_topic_customer_auth.firstName;
                        var customerId = val.cms_topic.customerId;
                        var topicDiscuss = val.cms_topic.topicDiscuss ? comm.getStrLen(val.cms_topic.topicDiscuss, 43 * 2) : "";
                        var reviewNum = val.cms_topic.reviewNum.toWK();
                        var topicAttUrl = val.cms_topic_attachment.topicAttUrl; //图片地址
                        var pageStoragePath = val.cms_topic.pageStoragePath;  //url
                        var browseNum = val.cms_topic.browseNum.toWK();
                        var isShowActivityTag=val.isShowActivityTag;
                        var activityTagName=val.activityTagName;
                        var activityTagColor=val.activityTagColor;
                        var videoType=(val.cms_topic_customer_auth.videoType?val.cms_topic_customer_auth.videoType:'');
                    }
                    var activityTag="";
                    if(isShowActivityTag){//活动资源标识
                        var color=activityTagColor;
                        activityTag='<span class="al-contentActivityTag" style="border-color:'+color+';color:'+color+'">'+activityTagName+'</span>';
                        //activityTag='<span class="al-contentActivityTag" style="border-color:red;color:red">万例挑一</span>';
                    }
                    if (topicAttUrl.length > 0) {
                        var timestamp = Date.parse(new Date());
                        html += '<section class="al-disMajorMainBox_body"><figure class="al-disMajorMainBox_bodyText">' +
                            '<a href="' + pageStoragePath + '" target="_blank" data-id="' + topicId + '" class="ev-sRList" data-type="4"><span>' + topicName + '</span></a><p>' + topicDiscuss + '</p> <div>' +
                            activityTag+
                            (function(){
                                var str='';
                                if(firstName||lastName){
                                    str+='      <span><i class="user'+((videoType&&(videoType==17||videoType==18||videoType==19))?' authorNoUserId':'')+'"></i>' + cutAuthName(lastName + firstName) + '</span>';
                                }
                                return str;
                            }())+
                            '<span><i class="read"></i>' + browseNum + '</span></div></figure>' +
                            '<figure class="al-disMajorMainBox_bodyImg"><a href="' + pageStoragePath + '" target="_blank" data-id="' + topicId + '" class="ev-sRList" data-type="4"><img src="' + topicAttUrl.split('|')[0] + '?' + timestamp + '" alt=""/></a>' +
                            '</figure></section>';
                    } else {
                        html += '<section class="al-contentInALine"><article class="al-contentText">' +
                            '<a href="' + voidHref(pageStoragePath,0) + '" voidHref="'+voidHref(pageStoragePath,3)+'"  target="'+voidHref(pageStoragePath,1)+'" class="al-contentTitle ev-sRList" data-id="' + topicId + '" data-type="4"><span>' + topicName + '</span></a> ' +
                            '<p class="al-contentMainText"><span>' + topicDiscuss + '</span></p><p class="al-contentOtherMsg">' +
                            activityTag+
                            (function(){
                                var str='';
                                if(firstName||lastName){
                                    str+='      <span data-id="' + customerId + '"><i class="al-contentAuthor'+((videoType&&(videoType==17||videoType==18||videoType==19))?' authorNoUserId':'')+'"></i>' + cutAuthName(lastName + firstName )+ '</span>';
                                }
                                return str;
                            }())+
                            '<span>' +
                            '<i class="al-contentWatchedNum"></i>' + browseNum + '</span></p></article></section>';
                    }
                })
            } else {
                html += '<header class="al-searchMain_head">为您找到相关结果 <span>0</span> 个</header>' +
                    '<section class="al-searchMain_imgBox"><img src="//img10.allinmd.cn/v3/search/search_noResult.png" alt=""/><section class="al_searchMain_error">我要报错</section></section>';
            }
            $(".pager").eq(dataId - 1).show();
            $(".ev-recommendCon").eq(dataId - 1).html(html);
            preventHref();
            //推荐搜索列表话题列表
            $('.ev-sRList').off('click').on('click',function (e) {
                e.preventDefault();
                comm.creatEvent({
                    triggerType:1,
                    actionId:11049,
                    refId:$(this).attr('data-id'),
                    refType:$(this).attr('data-type'),
                    async:false
                });
                var reg = /(?:http(?:s|):\/\/|)(?:(?:\w*?)\.|)(?:\w*?)\.(?:\w{2,4})(?:\?.*|\/.*|)$/ig
                if(reg.test($(this).attr('href'))) {
                    g_sps.jump(null, $(this).attr('href'), true);
                }
            });
        }
            comm.ajax.async(addr + url, topic, function (data) {
                if (data && data.responseObject && data.responseObject.responseData && !$.isEmptyObject(data.responseObject.responseData) && data.responseObject.responseData.data_list.length) {
                    $(".al-al-searchMain_head span").text(data.responseObject.responseData.total_count);
                    var totalCount = data.responseObject.responseData.total_count;
                    var pagecount = Math.ceil(totalCount / topic.pageSize);//总页数
                    $(".al-al-searchMain_head span").text(totalCount);
                    var data_list = data.responseObject.responseData.data_list;
                    addTopHtml1(data_list, totalCount);
                    $(".pager").eq(dataId - 1).pager({
                        pagenumber: 1,
                        pagecount: pagecount,
                        buttonClickCallback: PageClick
                    });
                    if(data_list.length<topic.pageSize){
                        $(".pager").hide();
                    }
                } else {
                    $(".pager").eq(dataId - 1).hide();
                    $(".ev-recommend").eq(dataId-1).hide();
                    $(".ev-recommendCon").eq(dataId - 1).html("");
                    $(".ev_searchSiteName").click();
                }
            });
            PageClick = function (pageclickednumber,buttonLabel) {
                topic.pageIndex = pageclickednumber;//加载第几页；
                comm.ajax.async(addr + url, topic, function (data) {
                    if (data && data.responseObject && data.responseObject.responseData && !$.isEmptyObject(data.responseObject.responseData) && data.responseObject.responseData.data_list.length) {
                        var totalCount = data.responseObject.responseData.total_count;
                        var pagecount = Math.ceil(totalCount / topic.pageSize);//总页数
                        addTopHtml1(data.responseObject.responseData.data_list);
                        $(".pager").eq(dataId - 1).pager({
                            pagenumber: pageclickednumber,
                            pagecount: pagecount,
                            buttonClickCallback: PageClick
                        });//初始化加载第一页的时候如果数据不足一页不用展示分页器
                        if((parseInt(pageclickednumber,10)===1)&&data.responseObject.responseData.data_list.length<topic.pageSize){
                            $(".pager").hide();
                        }
                        scrollTop();
                    } else {

                    }
                });
                createEvent(pageclickednumber,buttonLabel);
            };
            $("[data-target=" + dataId + "]").css("display", "block");
            break;
    }
}
//关键词搜索全部资源方法:--end

//tab选项卡:--start--
var tab=$(".al-searchMain_ul li");

//相关性，最新，最热点击事件
$(".al_contentItemCondition li").on("click",function(){
    $(".al_contentItemCondition li").removeClass("active");
    $('.al-searchMain_topHead .al-searchContent').hide();
    $(this).addClass("active");
    sortType=$(this).attr("sortType");
    tab.eq(dataId-1).click();
    var actionId;
    switch(parseInt(sortType)){
        case 1://相关性
            actionId=56;
            break;
        case 2://最新
            actionId=57;
            break;
        case 3://最热
            actionId=58;
            break;
    }
    //事件埋点
    comm.creatEvent({
        triggerType:"搜索资源排序",
        keyword:$(this).text(),
        actionId:actionId
    });
});

tab.click(function(){
    $('.al-searchMain_topHead .al-searchContent').hide();
    var searchKey=$(".al-searchMain_topHead input").val();
    if(searchKey.length>0){
        var searchParam=searchKey;
    }else{
        var searchParam=$(".al-headerSearch input").val();
    }
    if(searchParam.length>0){
        dataId=$(this).data('id');
        var addr="/call/search";
        var urlarr=[
            "/searchAllNew/",
            "/searchCase/",
            "/searchVideo/",
            "/searchConference/",
            "/searchUser/",
            "/searchDoc/",
            "/searchTopic/"
        ];
        var html="";
        $('.al-searchMain').hide();
        $(".ev-recommend").hide();
        $(".pager").hide();
        tab.removeClass("active");
        $(this).addClass("active");
        switch (dataId) {
            case 1://加载全部
                comm.Log.createBrowse({href:location.href,id:32,name:'搜索全部页面',platformId: $('#sesDepartment').val(),noTimeOut:1});
                var allJson={
                    "pageIndex":1,
                    "pageSize":10,
                    "searchParam": searchParam,//搜索关键词
                    "logoUseFlag":UseFlag.c,
                    "useFlag":$("#sesCustomerId").val()?2:1,//  --登录传入2，不登录传入1
                    "attUseFlag":AttUseFlag.c,
                    "sortType":sortType,//1：相关度；2：发布时间:3:浏览数
                    "searchType":2,//1：模糊  2精确
                    "scene":1,
                    "platformId": $('#sesDepartment').val(),
                    'sessionCustomerId':customerId,
                    "opUsr":customerId
                };
                var params= {paramJson:$.toJSON(allJson)};
                dataId=$('.al-searchMain_ul li').data('id');
                $(".pager").hide();
            function addAll(data_list,totalCount,countCustomer){
                var html="";
                $("[data-target=1] .al-search_expertList").html("");
                if(data_list.customer_list||data_list.resource_list){
                    $(".ev-allSearch").show();
                    $(".ev-recommend").eq(0).hide();
                    $(".recommendCon").eq(0).html("");
                    var listCustomer=data_list.customer_list;
                    var listResource=data_list.resource_list;
                    html+='<header class="al-searchMain_head">为您找到相关结果 <span>'+totalCount+'</span>个</header>';
                    if(countCustomer>0){
                        $.each(listCustomer,function(i,val){
                            if(val instanceof Array){
                                $.each(val ,function (j,vale) {
                                    //var aa=vale.bb.cc;
                                });
                            }else{
                                var logoUrl=val.customer_att.logoUrl;
                                var lastName=val.customer_auth.lastName;
                                var firstName=val.customer_auth.firstName?comm.getStrLen(val.customer_auth.firstName,5*2):"";
                                var titleShow=val.customer_auth.medicalTitleShow;
                                var company=val.customer_auth.company?comm.getStrLen(val.customer_auth.company,10*2):"";
                                var customerId=val.customer_baseinfo.customerId;
                                var relationship=val.customer_follow_people.relationship;
                            }
                            html+='<div class="al-expertBox"><a  target="_blank" href="/pages/personal/others_contribution.html?cid='+customerId+'" data-id="'+customerId+'"><img src="'+logoUrl+'" class="al-expert_headImg"></a><figure class="al-expertTitle">' +
                                '<a  target="_blank" href="/pages/personal/others_contribution.html?cid='+customerId+'" class="active">'+ lastName+''+firstName +'</a><i relationship="'+relationship+'" data-id="'+customerId+'" class="ev-followAllBtn"></i><span>'+titleShow+'</span>' +
                                '<span>'+company+'</span></figure></div>';
                        });
                        if(countCustomer>3){
                            html+='<div class="al-expertBox"><p class="al-moreExpert">查看更多医师 >></p></div>';
                        }
                        $("[data-target=1] .al-search_expertList").html(html);
                        preventHref();
                        $(".al-expertBox i").each(function(i,em){
                            var fid=$(em).attr("data-id");
                            var relationship=parseInt($(em).attr("relationship"));
                            $(em).follow({fStatus:relationship,classStyle:"gz_but",fId:fid,picStyle:8,canToggle:false});
                        });
                        alldoList(listResource);
                        function alldoList(listResource){
                            var html="";
                            $.each(listResource,function(i,val){
                                if(val instanceof Array){
                                    $.each(val ,function (j,vale) {
                                        var aa=vale.bb.cc;
                                    });
                                }else{
                                    var typeId=val.typeId;
                                    var browseNum=val.browseNum.toWK();
                                    var company=val.company;
                                    var customerId=val.customerId;
                                    var customerName=val.customerName;
                                    var endTime=val.endTime;
                                    var picNum=val.picNum;
                                    var picUrl=val.picUrl;
                                    var playTime=val.playTime;
                                    var resourceId=val.resourceId;
                                    var resourceName=val.resourceName?val.resourceName:"";
                                    var itemAbstract=val.itemAbstract?val.itemAbstract:"";
                                    var resourceUrl=val.resourceUrl;
                                    var reviewNum=val.reviewNum.toWK();
                                    var startTime=val.startTime;
                                    var tplPath=val.tplPath;
                                    var conLocation =val.conLocation;
                                    var score = val.currentStarLevel;
                                    var scoreNum =val.currentScoreNum;
                                    // //console.log(company);
                                    switch (typeId){
                                        case 1:   //视频
                                            customerName=val.ownerNameStr;
                                            if(picNum==0){
                                                html+=domHtmlNoImg({
                                                    resourceUrl:resourceUrl,
                                                    resourceId:resourceId,
                                                    resourceName:resourceName,
                                                    customerName:customerName,
                                                    browseNum:browseNum,
                                                    itemAbstract:itemAbstract,
                                                    videoType:val.videoType,
                                                    score:score,
                                                    scoreNum:scoreNum,
                                                    isShowActivityTag:val.isShowActivityTag,
                                                    activityTagName:val.activityTagName,
                                                    activityTagColor:val.activityTagColor,
                                                    typeId:typeId
                                                });
                                            }else{
                                                html+=videoDomWithImg({
                                                    resourceUrl:resourceUrl,
                                                    resourceId:resourceId,
                                                    resourceName:resourceName,
                                                    customerName:customerName,
                                                    browseNum:browseNum,
                                                    picUrl:picUrl,
                                                    itemAbstract:itemAbstract,
                                                    playTime:playTime,
                                                    videoType:val.videoType,
                                                    score:score,
                                                    scoreNum:scoreNum,
                                                    isShowActivityTag:val.isShowActivityTag,
                                                    activityTagName:val.activityTagName,
                                                    activityTagColor:val.activityTagColor,
                                                    typeId:typeId
                                                });
                                            }
                                            break;
                                        case 3:
                                            html+=meetingDom({
                                                conUrl:resourceUrl,
                                                conName:resourceName,
                                                conMainPicUrl:picUrl,
                                                startTime:startTime,
                                                endTime:endTime,
                                                conLocation:conLocation,
                                                resourceId:resourceId,
                                                typeId:typeId
                                            });
                                            break;
                                        default:   //话题
                                            if(typeId==4){//话题
                                                resourceName=resourceName?resourceName:'话题医起聊';
                                            }
                                            if(picUrl.length>0){
                                                html+=domHtmlWithImg({
                                                    resourceUrl:resourceUrl,
                                                    resourceId:resourceId,
                                                    resourceName:resourceName,
                                                    customerName:customerName,
                                                    browseNum:browseNum,
                                                    picUrl:picUrl,
                                                    itemAbstract:itemAbstract,
                                                    videoType:val.videoType,
                                                    score:score,
                                                    scoreNum:scoreNum,
                                                    isShowActivityTag:val.isShowActivityTag,
                                                    activityTagName:val.activityTagName,
                                                    activityTagColor:val.activityTagColor,
                                                    typeId:typeId
                                                });
                                            }else{
                                                html+=domHtmlNoImg({
                                                    resourceUrl:resourceUrl,
                                                    resourceId:resourceId,
                                                    resourceName:resourceName,
                                                    customerName:customerName,
                                                    browseNum:browseNum,
                                                    itemAbstract:itemAbstract,
                                                    videoType:val.videoType,
                                                    score:score,
                                                    scoreNum:scoreNum,
                                                    isShowActivityTag:val.isShowActivityTag,
                                                    activityTagName:val.activityTagName,
                                                    activityTagColor:val.activityTagColor,
                                                    typeId:typeId
                                                });
                                            }
                                    }
                                }
                            });
                            $(".al-addOne").html(html);
                            preventHref();
                            //搜索列表全部列表
                            $('.ev-sRList').off('click').on('click',function (e) {
                                e.preventDefault();
                                comm.creatEvent({
                                    triggerType:1,
                                    actionId:11049,
                                    refId:$(this).attr('data-id'),
                                    refType:$(this).attr('data-type'),
                                    async:false
                                });
                                var reg = /(?:http(?:s|):\/\/|)(?:(?:\w*?)\.|)(?:\w*?)\.(?:\w{2,4})(?:\?.*|\/.*|)$/ig
                                if(reg.test($(this).attr('href'))) {
                                    g_sps.jump(null, $(this).attr('href'), true);
                                }
                            });
                            $(".pager").eq(dataId-1).show();
                            $("[data-target=1]").show();
                            shareAction(allJson,shareSenceConst.search_list_all,searchParam,0);
                        }
                        $('.al-expertBox .al-moreExpert').bind("click",function(){
                            lookMore(searchParam);
                        });
                    }else{
                        var html="";
                        html+='<header class="al-searchMain_head">为您找到相关结果 <span>'+totalCount+'</span>个</header>';   //---除了匹配第一页有搜索总数、其他页面没有-----
                        $.each(listResource,function(i,val){
                            if(val instanceof Array){
                                $.each(val ,function (j,vale) {
                                    var aa=vale.bb.cc;
                                });
                            }else{
                                var typeId=val.typeId;
                                var browseNum=val.browseNum.toWK();
                                var company=val.company;
                                var customerId=val.customerId;
                                var customerName=val.customerName;
                                var endTime=val.endTime;
                                var picNum=val.picNum;
                                var picUrl=val.picUrl;
                                var playTime=val.playTime;
                                var resourceId=val.resourceId;
                                var resourceName=val.resourceName?val.resourceName:"";
                                var itemAbstract=val.itemAbstract?val.itemAbstract:"";
                                var resourceUrl=val.resourceUrl;
                                var reviewNum=val.reviewNum.toWK();
                                var startTime=val.startTime;
                                var tplPath=val.tplPath;
                                var conLocation =val.conLocation;
                                var score = val.currentStarLevel;
                                var scoreNum =val.currentScoreNum;
                                switch (typeId){
                                    case 1:   //视频
                                        customerName=val.ownerNameStr;
                                        if(picNum==0){
                                            html+=domHtmlNoImg({
                                                resourceUrl:resourceUrl,
                                                resourceId:resourceId,
                                                resourceName:resourceName,
                                                customerName:customerName,
                                                browseNum:browseNum,
                                                itemAbstract:itemAbstract,
                                                videoType:val.videoType,
                                                score:score,
                                                scoreNum:scoreNum,
                                                isShowActivityTag:val.isShowActivityTag,
                                                activityTagName:val.activityTagName,
                                                activityTagColor:val.activityTagColor,
                                                typeId:typeId
                                            });
                                        }else{
                                            html+=videoDomWithImg({
                                                resourceUrl:resourceUrl,
                                                resourceId:resourceId,
                                                resourceName:resourceName,
                                                customerName:customerName,
                                                browseNum:browseNum,
                                                picUrl:picUrl,
                                                itemAbstract:itemAbstract,
                                                playTime:playTime,
                                                videoType:val.resourceSecondType,
                                                score:score,
                                                scoreNum:scoreNum,
                                                isShowActivityTag:val.isShowActivityTag,
                                                activityTagName:val.activityTagName,
                                                activityTagColor:val.activityTagColor,
                                                typeId:typeId
                                            });
                                        }
                                        break;
                                    case 3:
                                        html+=meetingDom({
                                            conUrl:resourceUrl,
                                            conName:resourceName,
                                            conMainPicUrl:picUrl,
                                            startTime:startTime,
                                            endTime:endTime,
                                            conLocation:conLocation,
                                            resourceId:resourceId,
                                            typeId:typeId
                                        })
                                        break;
                                    default:   //话题
                                        if(typeId==4){//话题
                                            resourceName=resourceName?resourceName:'话题医起聊';
                                        }
                                        if(picUrl.length>0){
                                            html+=domHtmlWithImg({
                                                resourceUrl:resourceUrl,
                                                resourceId:resourceId,
                                                resourceName:resourceName,
                                                customerName:customerName,
                                                browseNum:browseNum,
                                                videoType:val.videoType,
                                                picUrl:picUrl,
                                                itemAbstract:itemAbstract,
                                                score:score,
                                                scoreNum:scoreNum,
                                                isShowActivityTag:val.isShowActivityTag,
                                                activityTagName:val.activityTagName,
                                                activityTagColor:val.activityTagColor,
                                                typeId:typeId
                                            });
                                        }else{
                                            html+=domHtmlNoImg({
                                                resourceUrl:resourceUrl,
                                                resourceId:resourceId,
                                                resourceName:resourceName,
                                                customerName:customerName,
                                                browseNum:browseNum,
                                                itemAbstract:itemAbstract,
                                                videoType:val.videoType,
                                                score:score,
                                                scoreNum:scoreNum,
                                                isShowActivityTag:val.isShowActivityTag,
                                                activityTagName:val.activityTagName,
                                                activityTagColor:val.activityTagColor,
                                                typeId:typeId
                                            });
                                        }
                                }
                            }
                        });
                        $(".al-addOne").html(html);
                        preventHref();
                        //搜索列表全部列表
                        $('.ev-sRList').off('click').on('click',function (e) {
                            e.preventDefault();
                            comm.creatEvent({
                                triggerType:1,
                                actionId:11049,
                                refId:$(this).attr('data-id'),
                                refType:$(this).attr('data-type'),
                                async:false
                            });
                            var reg = /(?:http(?:s|):\/\/|)(?:(?:\w*?)\.|)(?:\w*?)\.(?:\w{2,4})(?:\?.*|\/.*|)$/ig
                            if(reg.test($(this).attr('href'))) {
                                g_sps.jump(null, $(this).attr('href'), true);
                            }
                        });
                        $(".pager").eq(dataId-1).show();
                        $("[data-target=1]").show();
                        shareAction(allJson,shareSenceConst.search_list_all,searchParam,0);
                    }
                }else{
                    //无结果页地址
                    html+='<header class="al-searchMain_head">为您找到相关结果 <span>0</span> 个</header>'+
                        '<section class="al-searchMain_imgBox"><img src="//img10.allinmd.cn/v3/search/search_noResult.png" alt=""/><section class="al_searchMain_error">我要报错</section></section>';
                    $("[data-target=1] .al-addOne").html(html);
                    preventHref();
                    $("[data-target=1]").show();
                    //todo 推荐
                    recommend();
                    $(".ev_searchSiteName").click();
                    //反馈
                    feedback();
                }
            }
            function pageClick(data_list){
                $("[data-target=1] .al-search_expertList").html("");
                if(data_list.resource_list){
                    var listResource=data_list.resource_list;
                    var html="";
                    $.each(listResource,function(i,val){
                        if(val instanceof Array){
                            $.each(val ,function (j,vale) {
                            });
                        }else{
                            var typeId=val.typeId;
                            var browseNum=val.browseNum.toWK();
                            var company=val.company;
                            var customerId=val.customerId;
                            var customerName=val.customerName;
                            var endTime=val.endTime;
                            var picNum=val.picNum;
                            var picUrl=val.picUrl;
                            var playTime=val.playTime;
                            var resourceId=val.resourceId;
                            var resourceName=val.resourceName?val.resourceName:"";
                            var itemAbstract=val.itemAbstract?val.itemAbstract:"";
                            var resourceUrl=val.resourceUrl;
                            var reviewNum=val.reviewNum.toWK();
                            var startTime=val.startTime;
                            var tplPath=val.tplPath;
                            var conLocation =val.conLocation;
                            var score =val.currentStarLevel;
                            var scoreNum = val.currentScoreNum;
                            switch (typeId){
                                case 1:   //视频
                                    if(picNum==0){
                                        customerName=val.ownerNameStr;
                                        html+=domHtmlNoImg({
                                            resourceUrl:resourceUrl,
                                            resourceId:resourceId,
                                            resourceName:resourceName,
                                            customerName:customerName,
                                            browseNum:browseNum,
                                            itemAbstract:itemAbstract,
                                            videoType:val.videoType,
                                            score:score,
                                            scoreNum:scoreNum,
                                            isShowActivityTag:val.isShowActivityTag,
                                            activityTagName:val.activityTagName,
                                            activityTagColor:val.activityTagColor,
                                            typeId:typeId
                                        });
                                    }else{
                                        html+=videoDomWithImg({
                                            resourceUrl:resourceUrl,
                                            resourceId:resourceId,
                                            resourceName:resourceName,
                                            customerName:customerName,
                                            browseNum:browseNum,
                                            picUrl:picUrl,
                                            itemAbstract:itemAbstract,
                                            playTime:playTime,
                                            videoType:val.videoType,
                                            score:score,
                                            scoreNum:scoreNum,
                                            isShowActivityTag:val.isShowActivityTag,
                                            activityTagName:val.activityTagName,
                                            activityTagColor:val.activityTagColor,
                                            typeId:typeId
                                        });
                                    }
                                    break;
                                case 3:
                                    html+=meetingDom({
                                        conUrl:resourceUrl,
                                        conName:resourceName,
                                        conMainPicUrl:picUrl,
                                        startTime:startTime,
                                        endTime:endTime,
                                        conLocation:conLocation,
                                        resourceId:resourceId,
                                        typeId:typeId
                                    });
                                    break;
                                default:   //话题
                                    if(typeId==4){//话题
                                        resourceName=resourceName?resourceName:'话题医起聊';
                                    }
                                    if(picUrl.length>0){
                                        html+=domHtmlWithImg({
                                            resourceUrl:resourceUrl,
                                            resourceId:resourceId,
                                            resourceName:resourceName,
                                            customerName:customerName,
                                            browseNum:browseNum,
                                            picUrl:picUrl,
                                            itemAbstract:itemAbstract,
                                            videoType:val.videoType,
                                            score:score,
                                            scoreNum:scoreNum,
                                            isShowActivityTag:val.isShowActivityTag,
                                            activityTagName:val.activityTagName,
                                            activityTagColor:val.activityTagColor,
                                            typeId:typeId
                                        });
                                    }else{
                                        html+=domHtmlNoImg({
                                            resourceUrl:resourceUrl,
                                            resourceId:resourceId,
                                            resourceName:resourceName,
                                            customerName:customerName,
                                            browseNum:browseNum,
                                            videoType:val.videoType,
                                            itemAbstract:itemAbstract,
                                            score:score,
                                            scoreNum:scoreNum,
                                            isShowActivityTag:val.isShowActivityTag,
                                            activityTagName:val.activityTagName,
                                            activityTagColor:val.activityTagColor,
                                            typeId:typeId
                                        });
                                    }
                            }
                        }
                    });
                    $(".al-addOne").html(html);
                    preventHref();
                    //搜索列表全部列表
                    $('.ev-sRList').off('click').on('click',function (e) {
                        e.preventDefault();
                        comm.creatEvent({
                            triggerType:1,
                            actionId:11049,
                            refId:$(this).attr('data-id'),
                            refType:$(this).attr('data-type'),
                            async:false
                        });
                        var reg = /(?:http(?:s|):\/\/|)(?:(?:\w*?)\.|)(?:\w*?)\.(?:\w{2,4})(?:\?.*|\/.*|)$/ig
                        if(reg.test($(this).attr('href'))) {
                            g_sps.jump(null, $(this).attr('href'), true);
                        }
                    });
                    $(".pager").eq(0).show();
                    $("[data-target=1]").show();
                    shareAction(allJson,shareSenceConst.search_list_all,searchParam,0);
                }
            }
                comm.ajax.async("/call/search/searchAllNew/", params,function(data){
                    comm.LightBox.hideloading();
                    if(data&&data.responseObject&&data.responseObject.responseData&&!$.isEmptyObject(data.responseObject.responseData)&&((data.responseObject.responseData.resource_list&&data.responseObject.responseData.resource_list.length)||(data.responseObject.responseData.customer_list&&data.responseObject.responseData.customer_list.length))){
                        var data_list=data.responseObject.responseData;
                        var countResource=data.responseObject.responseData.resource_count;
                        var countCustomer=data.responseObject.responseData.customer_count;
                        var totalCount=countResource+countCustomer;
                        var pagecount=Math.ceil(countResource/allJson.pageSize);//总页数
                        addAll(data_list,totalCount,countCustomer);
                        $(".pager").eq(dataId-1).pager({pagenumber:1, pagecount: pagecount, buttonClickCallback: PageClick});
                        if(data_list.length<allJson.pageSize){
                            $(".pager").hide();
                        }
                    }else{
                        var _html='<header class="al-searchMain_head">为您找到相关结果 <span>0</span> 个</header>'+
                            '<section class="al-searchMain_imgBox"><img src="//img10.allinmd.cn/v3/search/search_noResult.png" alt=""/><section class="al_searchMain_error">我要报错</section></section>';
                        $('.al-searchMain').hide();
                        $('.al-searchMain[data-target=1]').show();
                        $('.al-searchMain[data-target=1] .al-search_expertList').html("");
                        $('.al-searchMain[data-target=1] .al-addOne').html(_html);
                        preventHref();
                        $(".pager").eq(dataId-1).empty();
                        $('.ev-shareContainer').hide();
                        //TODO:添加推荐
                        recommend();
                        $(".ev_searchSiteName").click();
                        //反馈
                        feedback();
                    }
                });
                PageClick = function(pageclickednumber,buttonLabel){
                    allJson.pageIndex = pageclickednumber;//加载第几页；
                    var params= {paramJson:$.toJSON(allJson)};
                    comm.ajax.async("/call/search/searchAllNew/", params,function(data){
                        if(data&&data.responseObject&&data.responseObject.responseData&&!$.isEmptyObject(data.responseObject.responseData)&&data.responseObject.responseData.resource_list.length){
                            var countResource=data.responseObject.responseData.resource_count;
                            var countCustomer=data.responseObject.responseData.customer_count;
                            var totalCount=countCustomer+countResource;
                            var pagecount=Math.ceil(countResource/allJson.pageSize);//总页数
                            var data_list=data.responseObject.responseData;
                            if(pageclickednumber==1){
                                addAll(data_list,totalCount,countCustomer);
                            }else{
                                pageClick(data_list);
                            }
                            $(".pager").eq(0).pager({ pagenumber: pageclickednumber, pagecount: pagecount, buttonClickCallback: PageClick });//初始化加载第一页的时候如果数据不足一页不用展示分页器
                            if((parseInt(pageclickednumber,10)===1)&&data_list.length<allJson.pageSize){
                                $(".pager").hide();
                            }
                            scrollTop();
                        }else{
                            var _html='<header class="al-searchMain_head">为您找到相关结果 <span>0</span> 个</header>'+
                                '<section class="al-searchMain_imgBox"><img src="//img10.allinmd.cn/v3/search/search_noResult.png" alt=""/><section class="al_searchMain_error">我要报错</section></section>';
                            $('.al-searchMain').hide();
                            $('.al-searchMain[data-target=1]').show();
                            $('.al-searchMain[data-target=1] .al-search_expertList').html("");
                            $('.al-searchMain[data-target=1] .al-addOne').html(_html);
                            preventHref();
                            $(".pager").eq(dataId-1).empty();
                            $('.ev-shareContainer').hide();
                            //反馈
                            feedback();
                        }
                    });
                    createEvent(pageclickednumber,buttonLabel);
                };
                $("[data-target="+dataId+"]").show();
                break;
            case 2:                 //加载病例
                comm.Log.createBrowse({href:location.href,id:61,name:'搜索病例页面',platformId:$('#sesDepartment').val(),noTimeOut:1});
                url=urlarr[1];        //病例资源地址
                var Case={
                    attUseFlag:AttUseFlag.h,
                    pageIndex:1,
                    pageSize:10,
                    searchParam: searchParam,//搜索关键词
                    logoUseFlag:UseFlag.d,
                    sortType:sortType,
                    searchType:2,//1：模糊  2精确
                    sessionCustomerId:customerId,
                    opUsr:customerId,
                    platformId: $('#sesDepartment').val()
                };
            function addCase(data_list,totalCount){
                var html="";
                // var total_count=totalCount;
                //html+='<header class="al-searchMain_head">为您找到相关结果 <span>'+total_count+'</span> 个'
                if(data_list&&data_list.length>0){
                    $(".ev-recommend").eq(dataId-1).hide();
                    var total_count=totalCount;
                    $.each(data_list,function(i,val){
                        if(val instanceof Array){
                            $.each(val ,function (j,vale) {
                            });
                        }else{
                            var caseName=val.case_baseinfo.caseName;
                            var caseId=val.case_baseinfo.caseId;
                            var mainNarrate=val.case_baseinfo.mainNarrate;
                            var firstName=val.case_customer_auth.firstName;
                            var lastName=val.case_customer_auth.lastName;
                            var reviewNum=val.case_baseinfo.reviewNum.toWK();
                            var attUrl=val.case_attachment.attUrl;     //图片地址
                            var url=val.case_baseinfo.pageStoragePath;  //url
                            var browseNum =val.case_baseinfo.browseNum.toWK();
                            var isShowActivityTag=val.isShowActivityTag;
                            var activityTagName=val.activityTagName;
                            var activityTagColor=val.activityTagColor;
                        }
                        var activityTag="";
                        if(isShowActivityTag){//活动资源标识
                            var color=activityTagColor;
                            activityTag='<span class="al-contentActivityTag" style="border-color:'+color+';color:'+color+'">'+activityTagName+'</span>';
                            //activityTag='<span class="al-contentActivityTag" style="border-color:red;color:red">万例挑一</span>';
                        }
                        if(attUrl.length>0){
                            var timestamp = Date.parse(new Date());
                            html+='</header><section class="al-disMajorMainBox_body">'+scoreDom(val.currentStarLevel?val.currentStarLevel.currentStarLevel:undefined,val.currentStarLevel?val.currentStarLevel.currentScoreNum:0)+'<figure class="al-disMajorMainBox_bodyText">' +
                                '<a href="'+voidHref(url,0)+'" voidHref="'+voidHref(url,3)+'"  class="al-contentTitle ev-sRList" data-id="'+caseId+'" target="'+voidHref(url,1)+'" data-type="2">'+
                                '<span>'+comm.getStrLen(caseName,50)+'</span></a><p>'+mainNarrate+'</p><div>' +
                                activityTag+
                                (function(){
                                    var str='';
                                    if(firstName||lastName){
                                        str+='      <span><i class="user"></i>' + cutAuthName(lastName + firstName) + '</span>';
                                    }
                                    return str;
                                }())+
                                '<span><i class="read"></i>'+browseNum+'</span></div></figure>' +
                                '<figure class="al-disMajorMainBox_bodyImg"><a href="'+url+'" data-id="'+caseId+'" target="_blank" data-type="2" class="ev-sRList"><img src="'+attUrl.split('|')[0]+'?'+timestamp+'" alt=""/></a>' +
                                '</figure></section>';
                        }else {
                            html+='<section class="al-contentInALine">'+scoreDom(val.currentStarLevel?val.currentStarLevel.currentStarLevel:undefined,val.currentStarLevel?val.currentStarLevel.currentScoreNum:0)+'<article class="al-contentText">' +
                                '<a href="'+voidHref(url,0)+'" voidHref="'+voidHref(url,3)+'"  class="al-contentTitle ev-sRList" data-id="'+caseId+'" target="'+voidHref(url,1)+'" data-type="2"><span>'+comm.getStrLen(caseName,50)+'</span></a> ' +
                                '<p class="al-contentMainText"><span>'+mainNarrate+'</span></p><p class="al-contentOtherMsg">' +
                                activityTag+
                                (function(){
                                    var str='';
                                    if(firstName||lastName){
                                        str+='      <span><i class="al-contentAuthor"></i>' + cutAuthName(lastName + firstName) + '</span>';
                                    }
                                    return str;
                                }())+
                                '<span>' +
                                '<i class="al-contentWatchedNum"></i>'+browseNum+'</span></p></article></section>';
                        }
                    })
                }else{
                    html+='<header class="al-searchMain_head">为您找到相关结果 <span>0</span> 个</header>'+
                        '<section class="al-searchMain_imgBox"><img src="//img10.allinmd.cn/v3/search/search_noResult.png" alt=""/><section class="al_searchMain_error">我要报错</section></section>';
                }
                $(".pager").eq(dataId-1).show();
                $("[data-target="+dataId+"]").html(html);
                preventHref();
                //搜索列表病例列表
                $('.ev-sRList').off('click').on('click',function (e) {
                    e.preventDefault();
                    comm.creatEvent({
                        triggerType:1,
                        actionId:11049,
                        refId:$(this).attr('data-id'),
                        refType:$(this).attr('data-type'),
                        async:false
                    });
                    var reg = /(?:http(?:s|):\/\/|)(?:(?:\w*?)\.|)(?:\w*?)\.(?:\w{2,4})(?:\?.*|\/.*|)$/ig
                    if(reg.test($(this).attr('href'))) {
                        g_sps.jump(null, $(this).attr('href'), true);
                    }
                });
                //反馈
                feedback();
                shareAction(Case,shareSenceConst.search_list_case,searchParam,1);
            }
                $("[data-target="+dataId+"]").html("");
                comm.ajax.async(addr+url, Case,function(data){
                    if(data&&data.responseObject&&data.responseObject.responseData&&!$.isEmptyObject(data.responseObject.responseData)&&data.responseObject.responseData.data_list.length){
                        $(".al-al-searchMain_head span").text(data.responseObject.responseData.total_count);
                        var totalCount=data.responseObject.responseData.total_count;
                        var pagecount=Math.ceil(totalCount/Case.pageSize);//总页数
                        $(".al-al-searchMain_head span").text(totalCount);
                        var data_list=data.responseObject.responseData.data_list;
                        addCase(data_list,totalCount);
                        $(".pager").eq(dataId-1).pager({pagenumber:1, pagecount: pagecount, buttonClickCallback: PageClick});
                        if(data_list.length<Case.pageSize){
                            $(".pager").hide();
                        }
                    }else{
                        var _html='<header class="al-searchMain_head">为您找到相关结果 <span>0</span> 个</header>'+
                            '<section class="al-searchMain_imgBox"><img src="//img10.allinmd.cn/v3/search/search_noResult.png" alt=""/><section class="al_searchMain_error">我要报错</section></section>';
                        $('.al-searchMain').hide();
                        $('.al-searchMain[data-target='+dataId+']').show().html(_html);
                        preventHref();
                        $(".pager").eq(dataId-1).empty();
                        $('.ev-shareContainer').hide();
                        //推荐
                        recommendOthers(dataId);
                        //反馈
                        feedback();
                    }
                });
                PageClick = function(pageclickednumber,buttonLabel){
                    Case.pageIndex = pageclickednumber;//加载第几页；
                    comm.ajax.async(addr+url, Case,function(data){
                        if(data&&data.responseObject&&data.responseObject.responseData&&!$.isEmptyObject(data.responseObject.responseData)&&data.responseObject.responseData.data_list.length){
                            var totalCount=data.responseObject.responseData.total_count;
                            var pagecount=Math.ceil(totalCount/Case.pageSize);//总页数
                            addCase(data.responseObject.responseData.data_list);
                            $(".pager").eq(dataId-1).pager({ pagenumber: pageclickednumber, pagecount: pagecount, buttonClickCallback: PageClick });//初始化加载第一页的时候如果数据不足一页不用展示分页器
                            if((parseInt(pageclickednumber,10)===1)&&data.responseObject.responseData.data_list.length<Case.pageSize){
                                $(".pager").hide();
                            }
                            scrollTop();
                        }else{
                            var _html='<header class="al-searchMain_head">为您找到相关结果 <span>0</span> 个</header>'+
                                '<section class="al-searchMain_imgBox"><img src="//img10.allinmd.cn/v3/search/search_noResult.png" alt=""/><section class="al_searchMain_error">我要报错</section></section>';
                            $('.al-searchMain').hide();
                            $('.al-searchMain[data-target='+dataId+']').show().html(_html);
                            preventHref();
                            $(".pager").eq(dataId-1).empty();
                            $('.ev-shareContainer').hide();
                        }
                    });
                    createEvent(pageclickednumber,buttonLabel);
                };
                $("[data-target="+dataId+"]").css("display","block");
                break;
            case 3:                  //加载视频
                comm.Log.createBrowse({href:location.href,id:58,name:'搜索视频页面',platformId: $('#sesDepartment').val(),noTimeOut:1});
                url=urlarr[2];       //视频资源地址
                var video = {
                    useFlag:UseFlag.c,
                    pageIndex:1,
                    pageSize:10,
                    searchParam: searchParam,  //搜索关键词
                    logoUseFlag:UseFlag.d,
                    sortType:sortType,
                    searchType:2,//1：模糊  2精确
                    sessionCustomerId:customerId,
                    opUsr:customerId,
                    platformId: $('#sesDepartment').val()
                };
            function addVideo(data_list,totalCount){
                var html="";
                //var total_count=totalCount;
                // html+='<header class="al-searchMain_head">为您找到相关结果 <span>'+total_count+'</span> 个</header>';
                if(data_list&&data_list.length>0){
                    $(".ev-recommend").eq(dataId-1).hide();
                    $.each(data_list,function(i,val){
                        if(val instanceof Array){
                            $.each(val ,function (j,vale) {
                                var aa=vale.bb.cc;
                            });
                        }else{
                            var videoName=val.cms_video.videoName?comm.getStrLen(val.cms_video.videoName,23*2):"";
                            var videoAbstract=val.cms_video.videoAbstract?comm.getStrLen(val.cms_video.videoAbstract,45*2):"";
                            var lastName=val.cms_video_customer_auth.lastName;
                            var firstName=val.cms_video_customer_auth.firstName;
                            var customerName=val.cms_video.ownerNameStr;
                            var reviewNum=val.cms_video.reviewNum;
                            var videoAttUrl=val.cms_video_attachment_logo.videoAttUrl;
                            var playTime=val.cms_video.playTime;
                            var url=val.cms_video.pageStoragePath;
                            var playNum = val.cms_video.playNum;
                            var videoType = val.cms_video.videoType;
                            var videoId = val.cms_video.videoId;
                            var isShowActivityTag=val.isShowActivityTag;
                            var activityTagName=val.activityTagName;
                            var activityTagColor=val.activityTagColor;
                        }
                        var activityTag="";
                        if(isShowActivityTag){//活动资源标识
                            var color=activityTagColor;
                            activityTag='<span class="al-contentActivityTag" style="border-color:'+color+';color:'+color+'">'+activityTagName+'</span>';
                            //activityTag='<span class="al-contentActivityTag" style="border-color:red;color:red">万例挑一</span>';
                        }
                        var timestamp = Date.parse(new Date());//时间戳
                        var videoPic=videoAttUrl.split('|')[0];
                        if(videoPic.lastIndexOf("?")>-1){
                            videoPic=videoPic+timestamp;
                        }else{
                            videoPic=videoPic+"?"+timestamp;
                        }
                        html+='<section class="al-disMajorMainBox_body">'+scoreDom(val.currentStarLevel?val.currentStarLevel.currentStarLevel:undefined,val.currentStarLevel?val.currentStarLevel.currentScoreNum:0)+'<figure class="al-disMajorMainBox_bodyText">' +
                            '<a class="ev-sRList" href="'+url+'" target="_blank" data-id="'+videoId+'" data-type="1"><span>'+videoName+'</span></a><p>'+videoAbstract+'</p><div>' +
                            activityTag+(videoType==1?'<span class="surgeryVideoTag">手术视频</span>':'')+
                            (function(){
                                var str='';
                                if(firstName||lastName){
                                    str+='      <span><i class="user'+((videoType&&(videoType==17||videoType==18||videoType==19))?' authorNoUserId':'')+'"></i>' + cutAuthName(customerName) + '</span>';
                                }
                                return str;
                            }())+
                            '<span><i class="read"></i>'+playNum+'</span></div></figure>' +
                            '<figure class="al-disMajorMainBox_bodyImg"><a class="ev-sRList" href="'+url+'" target="_blank" data-id="'+videoId+'" data-type="1"><img src="'+videoPic+'" alt=""/>' +
                            '<b></b><span>'+playTime+'</span></a></figure></section>';
                    })
                }else{
                    html+='<header class="al-searchMain_head">为您找到相关结果 <span>0</span> 个</header>'+
                        '<section class="al-searchMain_imgBox"><img src="//img10.allinmd.cn/v3/search/search_noResult.png" alt=""/><section class="al_searchMain_error">我要报错</section></section>';
                }
                $(".pager").eq(dataId-1).show();
                $("[data-target="+dataId+"]").html(html);
                preventHref();
                //搜索列表视频列表
                $('.ev-sRList').off('click').on('click',function (e) {
                    e.preventDefault();
                    comm.creatEvent({
                        triggerType:1,
                        actionId:11049,
                        refId:$(this).attr('data-id'),
                        refType:$(this).attr('data-type'),
                        async:false
                    });
                    var reg = /(?:http(?:s|):\/\/|)(?:(?:\w*?)\.|)(?:\w*?)\.(?:\w{2,4})(?:\?.*|\/.*|)$/ig
                    if(reg.test($(this).attr('href'))) {
                        g_sps.jump(null, $(this).attr('href'), true);
                    }
                });
                //反馈
                feedback();
                shareAction(video,shareSenceConst.search_list_video,searchParam,2);
            }
                $("[data-target="+dataId+"]").html("");
                comm.ajax.async(addr+url, video,function(data){
                    if(data&&data.responseObject&&data.responseObject.responseData&&!$.isEmptyObject(data.responseObject.responseData)&&data.responseObject.responseData.data_list.length){
                        $(".al-al-searchMain_head span").text(data.responseObject.responseData.total_count);
                        var totalCount=data.responseObject.responseData.total_count;
                        var pagecount=Math.ceil(totalCount/video.pageSize);//总页数
                        $(".al-al-searchMain_head span").text(totalCount);
                        var data_list=data.responseObject.responseData.data_list;
                        addVideo(data_list,totalCount);
                        $(".pager").eq(dataId-1).pager({pagenumber:1, pagecount: pagecount, buttonClickCallback: PageClick});
                        if(data_list.length<video.pageSize){
                            $(".pager").hide();
                        }
                    }else{
                        var _html='<header class="al-searchMain_head">为您找到相关结果 <span>0</span> 个</header>'+
                            '<section class="al-searchMain_imgBox"><img src="//img10.allinmd.cn/v3/search/search_noResult.png" alt=""/><section class="al_searchMain_error">我要报错</section></section>';
                        $('.al-searchMain').hide();
                        $('.al-searchMain[data-target='+dataId+']').show().html(_html);
                        preventHref();
                        $(".pager").eq(dataId-1).empty();
                        $('.ev-shareContainer').hide();
                        //推荐
                        recommendOthers(dataId);
                        //反馈
                        feedback();
                    }
                });
                PageClick = function(pageclickednumber,buttonLabel){
                    video.pageIndex = pageclickednumber;//加载第几页；
                    comm.ajax.async(addr+url, video,function(data){
                        if(data&&data.responseObject&&data.responseObject.responseData&&!$.isEmptyObject(data.responseObject.responseData)&&data.responseObject.responseData.data_list.length){
                            var totalCount=data.responseObject.responseData.total_count;
                            var pagecount=Math.ceil(totalCount/video.pageSize);//总页数
                            addVideo(data.responseObject.responseData.data_list,totalCount);
                            $(".pager").eq(dataId-1).pager({ pagenumber: pageclickednumber, pagecount: pagecount, buttonClickCallback: PageClick });//初始化加载第一页的时候如果数据不足一页不用展示分页器
                            if((parseInt(pageclickednumber,10)===1)&&data.responseObject.responseData.data_list.length<video.pageSize){
                                $(".pager").hide();
                            }
                            scrollTop();
                        }else{
                            var _html='<header class="al-searchMain_head">为您找到相关结果 <span>0</span> 个</header>'+
                                '<section class="al-searchMain_imgBox"><img src="//img10.allinmd.cn/v3/search/search_noResult.png" alt=""/><section class="al_searchMain_error">我要报错</section></section>';
                            $('.al-searchMain').hide();
                            $('.al-searchMain[data-target='+dataId+']').show().html(_html);
                            preventHref();
                            $(".pager").eq(dataId-1).empty();
                            $('.ev-shareContainer').hide();
                        }
                    });
                    createEvent(pageclickednumber,buttonLabel);
                };
                $("[data-target="+dataId+"]").show();
                break;
            case 4:                 //加载会议--begin--
                comm.Log.createBrowse({href:location.href,id:63,name:'搜索会议页面',platformId: $('#sesDepartment').val(),noTimeOut:1});
                url=urlarr[3];              //会议资源地址
                var conference={
                    "attUseFlag":AttUseFlag.h,
                    "pageIndex":1,
                    "pageSize":10,
                    "searchParam": searchParam,         //搜索关键词
                    "logoUseFlag":UseFlag.d,
                    "sortType":sortType,
                    sessionCustomerId:customerId,
                    opUsr:customerId,
                    platformId: $('#sesDepartment').val(),
                    searchType:2//1：模糊  2精确
                };
            function addConfe(data_list){
                var html="";
                if(data_list&&data_list.length>0){
                    $(".ev-recommend").eq(dataId-1).hide();
                    $.each(data_list,function(i,val){
                        if(val instanceof Array){
                            $.each(val ,function (j,vale) {
                            });
                        }else{
                            var conName=val.conName;
                            var country=val.country;
                            var city=val.city;
                            var conId=val.conId;
                            var conUrl=val.menuUrlAllin_detail;
                            var conMainPicUrl=val.conMainPicUrl;
                            var startTime=val.startTime;
                            var d=new Date(startTime);
                            var ystartTime = startTime.substring(0,4)+"/"+startTime.substring(5,7)+"/"+startTime.substring(8,10);//formatDate(d, 'yyyy/MM/dd');
                            var endTime = val.endTime;
                            var endd = new Date(endTime);
                            var yendTime = endTime.substring(5,7)+"/"+endTime.substring(8,10);//formatDate(endd, 'MM/dd');
                            function formatDate(date,fmt) {
                                var o = {
                                    "M+": date.getMonth() + 1, //月份
                                    "d+": date.getDate(), //日
                                    "h+": date.getHours(), //小时
                                    "m+": date.getMinutes(), //分
                                    "s+": date.getSeconds(), //秒
                                    "q+": Math.floor((date.getMonth() + 3) / 3), //季度
                                    "S": date.getMilliseconds() //毫秒
                                };
                                if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
                                for (var k in o)
                                    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
                                return fmt;
                            }
                        }
                        html+='<section class="al-contentInALine"><article class="al-contentText"><a href="'+voidHref(conUrl,0)+'" voidHref="'+voidHref(conUrl,3)+'"  class="al-contentTitle ev-sRList" target="'+voidHref(conUrl,1)+'" data-id="'+conId+'" data-type="3">' +
                            '<span>'+conName+'</span></a>' +
                            (conMainPicUrl?'<figure class="al-contentImgBox"><a class="ev-sRList" href="' + conUrl + '" target="_blank" data-id="'+conId+'" data-type="3"><img src="' + conMainPicUrl + '" alt=""><i class="al-mark"><img src="//img10.allinmd.cn/v3/common/icon/mark_meeting.png" alt=""></i></a></figure>':'') +
                            '<div class="al-meeting_timePlace">' +
                            '<figure class="al-meeting_time"><i class="al-meetingTimeIcon"></i><span>'+ystartTime+'<b class="al-line">-</b>'+yendTime+'</span></figure>' +
                            '<figure class="al-meeting_place"><i class="al-meetingPlaceIcon"></i><span>'+country+'<b class="roundDot">·</b>'+city+'</span>' +
                            '</figure></div></article></section>';
                    })
                }else{
                    html+='<header class="al-searchMain_head">为您找到相关结果 <span>0</span> 个</header>'+
                        '<section class="al-searchMain_imgBox"><img src="//img10.allinmd.cn/v3/search/search_noResult.png" alt=""/><section class="al_searchMain_error">我要报错</section></section>';
                }
                $(".pager").eq(dataId-1).show();
                $("[data-target="+dataId+"]").html(html);
                preventHref();
                //搜索列表会议列表
                $('.ev-sRList').off('click').on('click',function (e) {
                    e.preventDefault();
                    comm.creatEvent({
                        triggerType:1,
                        actionId:11049,
                        refId:$(this).attr('data-id'),
                        refType:$(this).attr('data-type'),
                        async:false
                    });
                    var reg = /(?:http(?:s|):\/\/|)(?:(?:\w*?)\.|)(?:\w*?)\.(?:\w{2,4})(?:\?.*|\/.*|)$/ig
                    if(reg.test($(this).attr('href'))){
                        g_sps.jump(null,$(this).attr('href'),true);
                    }
                });
                //反馈
                feedback();
                shareAction(conference,shareSenceConst.search_list_meeting,searchParam,3);
            }

                $("[data-target="+dataId+"]").html("");
                comm.ajax.async(addr+url, conference,function(data){
                    if(data&&data.responseObject&&data.responseObject.responseData&&!$.isEmptyObject(data.responseObject.responseData)&&data.responseObject.responseData.data_list.length){
                        $(".al-al-searchMain_head span").text(data.responseObject.responseData.total_count);
                        var totalCount=data.responseObject.responseData.total_count;
                        var pagecount=Math.ceil(totalCount/conference.pageSize);//总页数
                        //$(".al-al-searchMain_head span").text(totalCount);
                        var data_list=data.responseObject.responseData.data_list;
                        addConfe(data_list);
                        $(".pager").eq(dataId-1).pager({pagenumber:1, pagecount: pagecount, buttonClickCallback: PageClick});
                        if(data_list.length<conference.pageSize){
                            $(".pager").hide();
                        }
                    }else{
                        var _html='<header class="al-searchMain_head">为您找到相关结果 <span>0</span> 个</header>'+
                            '<section class="al-searchMain_imgBox"><img src="//img10.allinmd.cn/v3/search/search_noResult.png" alt=""/><section class="al_searchMain_error">我要报错</section></section>';
                        $('.al-searchMain').hide();
                        $('.al-searchMain[data-target='+dataId+']').show().html(_html);
                        preventHref();
                        $(".pager").eq(dataId-1).empty();
                        $('.ev-shareContainer').hide();
                        //推荐
                        recommendOthers(dataId);
                        //反馈
                        feedback();
                    }
                });
                PageClick = function(pageclickednumber,buttonLabel){
                    conference.pageIndex = pageclickednumber;//加载第几页；
                    comm.ajax.async(addr+url, conference,function(data){
                        if(data&&data.responseObject&&data.responseObject.responseData&&!$.isEmptyObject(data.responseObject.responseData)&&data.responseObject.responseData.data_list.length){
                            var totalCount=data.responseObject.responseData.total_count;
                            var pagecount=Math.ceil(totalCount/conference.pageSize);//总页数
                            addConfe(data.responseObject.responseData.data_list);
                            $(".pager").eq(dataId-1).pager({ pagenumber: pageclickednumber, pagecount: pagecount, buttonClickCallback: PageClick });//初始化加载第一页的时候如果数据不足一页不用展示分页器
                            if((parseInt(pageclickednumber,10)===1)&&data.responseObject.responseData.data_list.length<conference.pageSize){
                                $(".pager").hide();
                            }
                            scrollTop();
                        }else{
                            var _html='<header class="al-searchMain_head">为您找到相关结果 <span>0</span> 个</header>'+
                                '<section class="al-searchMain_imgBox"><img src="//img10.allinmd.cn/v3/search/search_noResult.png" alt=""/><section class="al_searchMain_error">我要报错</section></section>';
                            $('.al-searchMain').hide();
                            $('.al-searchMain[data-target='+dataId+']').show().html(_html);
                            preventHref();
                            $(".pager").eq(dataId-1).empty();
                            $('.ev-shareContainer').hide();
                        }
                    });
                    createEvent(pageclickednumber,buttonLabel);
                };

                $("[data-target="+dataId+"]").show();
                break;              //加载会议--END--
            case 5:                  //加载医师--begin--
                comm.Log.createBrowse({href:location.href,id:62,name:'搜索医师页面',platformId: $('#sesDepartment').val(),noTimeOut:1});
                url=urlarr[4];        //医师资源地址
                var userJson={
                    pageIndex:1,
                    pageSize:10,
                    sortType:sortType,
                    searchParam: searchParam,//搜索关键词
                    attUseFlag:AttUseFlag.c,
                    logoUseFlag:UseFlag.c,
                    dataFlag:$("#sesCustomerId").val()!=undefined?2:1,
                    isValid:1,
                    platformId: $('#sesDepartment').val(),
                    opUsr:customerId,
                    sessionCustomerId:customerId,
                    searchType:1//1：模糊  2精确
                };
            function addUserHtml(data_list){
                if(data_list&&data_list.length>0){
                    $(".ev-recommend").eq(dataId-1).hide();
                    var arrHT=[];
                    $.each(data_list,function(i,val){
                        var logo; var user; var statistic;
                        if(val.customer_att){
                            logo=val.customer_att;
                        }
                        if(val.customer_auth){
                            user=val.customer_auth;
                        }
                        if(val.customer_statistic){
                            statistic=val.customer_statistic;
                        }
                        name=user.lastName+user.firstName;
                        medicalTitle=user.medicalTitleShow;
                        company=user.company?comm.getStrLen(user.company,46):"";
                        contribuNum=statistic.caseNum+statistic.docNum+statistic.topicNum+statistic.videoNum;//贡献值
                        arrHT.push(module.resourceListTemplate({tempName:"userList"})({
                            cid:user.customerId,
                            customerId:$('#sesCustomerId').val(),
                            userName:name,
                            logoUrl:logo.logoUrl,
                            state:user.state,
                            medicalTitle:medicalTitle,
                            company:company,
                            contribuNum:contribuNum,
                            reviewNum:statistic.reviewNum,
                            fansNum:statistic.fansNum,
                            relationship:val.customer_follow_people.relationship
                        }));
                    });
                    $(".pager").eq(dataId-1).show();
                    $("[data-target="+dataId+"]").html(arrHT);
                    preventHref();
                    //搜索列表医师列表
                    $('.ev-sRList').off('click').on('click',function (e) {
                        e.preventDefault();
                        comm.creatEvent({
                            triggerType:1,
                            actionId:11049,
                            refId:$(this).attr('data-id'),
                            refType:$(this).attr('data-type'),
                            async:false
                        });
                        var reg = /(?:http(?:s|):\/\/|)(?:(?:\w*?)\.|)(?:\w*?)\.(?:\w{2,4})(?:\?.*|\/.*|)$/ig
                        if(reg.test($(this).attr('href'))) {
                            g_sps.jump(null, $(this).attr('href'), true);
                        }
                    });
                    shareAction(userJson,shareSenceConst.search_list_doctor,searchParam,4);
                }else{
                    html+='<header class="al-searchMain_head">为您找到相关结果 <span>0</span> 个</header>'+
                        '<section class="al-searchMain_imgBox"><img src="//img10.allinmd.cn/v3/search/search_noResult.png" alt=""/><section class="al_searchMain_error">我要报错</section></section>';
                    $("[data-target="+dataId+"]").html(html);
                    preventHref();
                    //反馈
                    feedback();
                }
            };
                $("[data-target="+dataId+"]").html("");
                comm.ajax.async(addr+url, userJson,function(data){
                    if(data&&data.responseObject&&data.responseObject.responseData&&!$.isEmptyObject(data.responseObject.responseData)&&data.responseObject.responseData.data_list.length){
                        var totalCount=data.responseObject.responseData.total_count;
                        var pagecount=Math.ceil(totalCount/userJson.pageSize);//总页数
                        //$(".al-searchMain_head span").text(totalCount);
                        var data_list=data.responseObject.responseData.data_list;
                        addUserHtml(data_list);
                        $(".pager").eq(dataId-1).pager({pagenumber:1, pagecount: pagecount, buttonClickCallback: PageClick});
                        if(data_list.length<userJson.pageSize){
                            $(".pager").hide();
                        }
                    }else{
                        var _html='<header class="al-searchMain_head">为您找到相关结果 <span>0</span> 个</header>'+
                            '<section class="al-searchMain_imgBox"><img src="//img10.allinmd.cn/v3/search/search_noResult.png" alt=""/><section class="al_searchMain_error">我要报错</section></section>';
                        $('.al-searchMain').hide();
                        $('.al-searchMain[data-target='+dataId+']').show().html(_html);
                        preventHref();
                        $(".pager").eq(dataId-1).empty();
                        $('.ev-shareContainer').hide();
                        //推荐
                        //recommendOthers(dataId);
                        //反馈
                        feedback();
                    }
                });
                PageClick = function(pageclickednumber,buttonLabel){
                    userJson.pageIndex = pageclickednumber;
                    comm.ajax.async(addr+url, userJson,function(data){
                        if(data&&data.responseObject&&data.responseObject.responseData&&!$.isEmptyObject(data.responseObject.responseData)&&data.responseObject.responseData.data_list.length){
                            var totalCount=data.responseObject.responseData.total_count;
                            var pagecount=Math.ceil(totalCount/userJson.pageSize);//总页数
                            $(".pager").eq(dataId-1).pager({ pagenumber: pageclickednumber, pagecount: pagecount, buttonClickCallback: PageClick });//初始化加载第一页的时候如果数据不足一页不用展示分页器
                            if((parseInt(pageclickednumber,10)===1)&&data.responseObject.responseData.data_list.length<userJson.pageSize){
                                $(".pager").hide();
                            }
                            addUserHtml(data.responseObject.responseData.data_list);
                            scrollTop();
                        }else{
                            var _html='<header class="al-searchMain_head">为您找到相关结果 <span>0</span> 个</header>'+
                                '<section class="al-searchMain_imgBox"><img src="//img10.allinmd.cn/v3/search/search_noResult.png" alt=""/><section class="al_searchMain_error">我要报错</section></section>';
                            $('.al-searchMain').hide();
                            $('.al-searchMain[data-target='+dataId+']').show().html(_html);
                            preventHref();
                            $(".pager").eq(dataId-1).empty();
                            $('.ev-shareContainer').hide();
                        }
                    });
                    createEvent(pageclickednumber,buttonLabel);
                };

                $("[data-target="+dataId+"]").show();
                break;            //加载医师--END--
            case 6:                  //加载文库
                comm.Log.createBrowse({href:location.href,id:59,name:'搜索文库页面',platformId: $('#sesDepartment').val(),noTimeOut:1});
                url=urlarr[5];       //文库资源地址
                var Doc={
                    attUseFlag:AttUseFlag.h,
                    pageIndex:1,
                    pageSize:10,
                    searchParam: searchParam,//搜索关键词
                    logoUseFlag:UseFlag.d,
                    sortType:sortType,
                    sessionCustomerId:customerId,
                    opUsr:customerId,
                    platformId: $('#sesDepartment').val(),
                    searchType:2//1：模糊  2精确
                };
            function addHtml(data_list){
                var html="";
                if(data_list&&data_list.length>0){
                    $(".ev-recommend").eq(dataId-1).hide();
                    $.each(data_list,function(i,val){
                        if(val instanceof Array){
                            $.each(val ,function (j,vale) {
                            });
                        }else{
                            var docName=val.customer_doc.docName?comm.getStrLen(val.customer_doc.docName,23*2):"";
                            var docAbstract=val.customer_doc.docAbstract?comm.getStrLen(val.customer_doc.docAbstract,45*2):"";
                            var docAttUrl=val.cms_doc_attachment_logo.docAttUrl; //图片地址
                            var lastName=val.customer_auth.lastName;
                            var firstName=val.customer_auth.firstName;
                            var customerId=val.customer_auth.customerId;
                            var reviewNum=val.customer_doc.reviewNum.toWK();
                            var pageStoragePath=val.customer_doc.pageStoragePath;
                            var docId=val.customer_doc.docId;
                            var browseNum = val.customer_doc.browseNum.toWK();
                            var isShowActivityTag=val.isShowActivityTag;
                            var activityTagName=val.activityTagName;
                            var activityTagColor=val.activityTagColor;
                            var videoType=(val.customer_doc.docType?val.customer_doc.docType:'');
                        }
                        var activityTag="";
                        if(isShowActivityTag){//活动资源标识
                            var color=activityTagColor;
                            activityTag='<span class="al-contentActivityTag" style="border-color:'+color+';color:'+color+'">'+activityTagName+'</span>';
                            //activityTag='<span class="al-contentActivityTag" style="border-color:red;color:red">万例挑一</span>';
                        }
                        if(docAttUrl.length>0){
                            var timestamp = Date.parse(new Date());
                            html+='<section class="al-disMajorMainBox_body">'+scoreDom(val.currentStarLevel?val.currentStarLevel.currentStarLevel:undefined,val.currentStarLevel?val.currentStarLevel.currentScoreNum:0)+'<figure class="al-disMajorMainBox_bodyText">' +
                                '<a class="ev-sRList" href="'+pageStoragePath+'" target="_blank" data-id="'+docId+'" data-type="2"><span data-id="'+docId+'">'+docName+'</span></a><p>'+docAbstract+'</p><div>' +
                                activityTag+
                                (function(){
                                    var str='';
                                    if(firstName||lastName){
                                        str+='      <span><i class="user'+((videoType&&(videoType==17||videoType==18||videoType==19))?' authorNoUserId':'')+'"></i>' + cutAuthName(lastName + firstName) + '</span>';
                                    }
                                    return str;
                                }())+
                                '<span><i class="read"></i>'+browseNum+'</span>' +
                                '</div></figure><figure class="al-disMajorMainBox_bodyImg"><a class="ev-sRList" href="'+pageStoragePath+'" target="_blank" data-id="'+docId+'" data-type="2"><img src="'+docAttUrl.split('|')[0]+'?'+timestamp+'" alt=""/></a></figure></section>';
                        }else{
                            html+='<section class="al-contentInALine">'+scoreDom(val.currentStarLevel?val.currentStarLevel.currentStarLevel:undefined,val.currentStarLevel?val.currentStarLevel.currentScoreNum:0)+'<article class="al-contentText">' +
                                '<a href="'+voidHref(pageStoragePath,0)+'" voidHref="'+voidHref(pageStoragePath,3)+'"  target="'+voidHref(pageStoragePath,1)+'" class="al-contentTitle ev-sRList" data-id="'+docId+'" data-type="2"><span>'+docName+'</span></a> ' +
                                '<p class="al-contentMainText"><span>'+docAbstract+'</span></p><p class="al-contentOtherMsg">' +
                                activityTag+
                                (function(){
                                    var str='';
                                    if(firstName||lastName){
                                        str+='      <span><i class="al-contentAuthor'+((videoType&&(videoType==17||videoType==18||videoType==19))?' authorNoUserId':'')+'"></i>' + cutAuthName(lastName + firstName) + '</span>';
                                    }
                                    return str;
                                }())+
                                '<span>' +
                                '<i class="al-contentWatchedNum"></i>'+browseNum+'</span></p></article></section>';
                        }
                    })
                }else{
                    html+='<header class="al-searchMain_head">为您找到相关结果 <span>0</span> 个</header>'+
                        '<section class="al-searchMain_imgBox"><img src="//img10.allinmd.cn/v3/search/search_noResult.png" alt=""/><section class="al_searchMain_error">我要报错</section></section>';
                }
                $(".pager").eq(dataId-1).show();
                $("[data-target="+dataId+"]").html(html);
                preventHref();
                //搜索列表文库列表
                $('.ev-sRList').off('click').on('click',function (e) {
                    e.preventDefault();
                    comm.creatEvent({
                        triggerType:1,
                        actionId:11049,
                        refId:$(this).attr('data-id'),
                        refType:$(this).attr('data-type'),
                        async:false
                    });
                    var reg = /(?:http(?:s|):\/\/|)(?:(?:\w*?)\.|)(?:\w*?)\.(?:\w{2,4})(?:\?.*|\/.*|)$/ig
                    if(reg.test($(this).attr('href'))) {
                        g_sps.jump(null, $(this).attr('href'), true);
                    }
                });
                shareAction(Doc,shareSenceConst.search_list_doc,searchParam,5);
                //反馈
                feedback();
            };
                $("[data-target="+dataId+"]").html("");
                comm.ajax.async(addr+url, Doc,function(data){
                    if(data&&data.responseObject&&data.responseObject.responseData&&!$.isEmptyObject(data.responseObject.responseData)&&data.responseObject.responseData.data_list.length){
                        $(".al-al-searchMain_head span").text(data.responseObject.responseData.total_count);
                        var totalCount=data.responseObject.responseData.total_count;
                        var pagecount=Math.ceil(totalCount/Doc.pageSize);//总页数
                        $(".al-al-searchMain_head span").text(totalCount);
                        var data_list=data.responseObject.responseData.data_list;
                        addHtml(data_list,totalCount);
                        $(".pager").eq(dataId-1).pager({pagenumber:1, pagecount: pagecount, buttonClickCallback: PageClick});
                        if(data_list.length<Doc.pageSize){
                            $(".pager").hide();
                        }
                    }else{
                        var _html='<header class="al-searchMain_head">为您找到相关结果 <span>0</span> 个</header>'+
                            '<section class="al-searchMain_imgBox"><img src="//img10.allinmd.cn/v3/search/search_noResult.png" alt=""/><section class="al_searchMain_error">我要报错</section></section>';
                        $('.al-searchMain').hide();
                        $('.al-searchMain[data-target='+dataId+']').show().html(_html);
                        preventHref();
                        $(".pager").eq(dataId-1).empty();
                        $('.ev-shareContainer').hide();
                        //推荐
                        recommendOthers(dataId);
                        //反馈
                        feedback();
                    }
                });
                PageClick = function(pageclickednumber,buttonLabel){
                    Doc.pageIndex = pageclickednumber;//加载第几页；
                    comm.ajax.async(addr+url, Doc,function(data){
                        if(data&&data.responseObject&&data.responseObject.responseData&&!$.isEmptyObject(data.responseObject.responseData)&&data.responseObject.responseData.data_list.length){
                            var totalCount=data.responseObject.responseData.total_count;
                            var pagecount=Math.ceil(totalCount/Doc.pageSize);//总页数
                            addHtml(data.responseObject.responseData.data_list,totalCount);
                            $(".pager").eq(dataId-1).pager({ pagenumber: pageclickednumber, pagecount: pagecount, buttonClickCallback: PageClick });//初始化加载第一页的时候如果数据不足一页不用展示分页器
                            if((parseInt(pageclickednumber,10)===1)&&data.responseObject.responseData.data_list.length<Doc.pageSize){
                                $(".pager").hide();
                            }
                            scrollTop();
                        }else{
                            var _html='<header class="al-searchMain_head">为您找到相关结果 <span>0</span> 个</header>'+
                                '<section class="al-searchMain_imgBox"><img src="//img10.allinmd.cn/v3/search/search_noResult.png" alt=""/><section class="al_searchMain_error">我要报错</section></section>';
                            $('.al-searchMain').hide();
                            $('.al-searchMain[data-target='+dataId+']').show().html(_html);
                            preventHref();
                            $(".pager").eq(dataId-1).empty();
                            $('.ev-shareContainer').hide();
                        }
                    });
                    createEvent(pageclickednumber,buttonLabel);
                };

                $("[data-target="+dataId+"]").show();
                break;
            case 7:                  //加载话题
                comm.Log.createBrowse({href:location.href,id:60,name:'搜索话题页面',platformId: $('#sesDepartment').val(),noTimeOut:1});
                url=urlarr[6];       //话题资源地址
                var topic={
                    attUseFlag:AttUseFlag.h,
                    pageIndex:1,
                    pageSize:10,
                    searchParam: searchParam,//搜索关键词
                    logoUseFlag:UseFlag.d,
                    sortType:sortType,
                    sessionCustomerId:customerId,
                    opUsr:customerId,
                    platformId: $('#sesDepartment').val(),
                    searchType:2//1：模糊  2精确
                };
            function addTopHtml(data_list){
                var html="";
                //html+='<header class="al-searchMain_head">为您找到相关结果 <span>'+total_count+'</span> 个</header>';
                if(data_list&&data_list.length>0){
                    $(".ev-recommend").eq(dataId-1).hide();
                    $.each(data_list,function(i,val){
                        if(val instanceof Array){
                            $.each(val ,function (j,vale) {
                                var aa=vale.bb.cc;
                            });
                        }else{
                            var topicName=val.cms_topic.topicName?comm.getStrLen(val.cms_topic.topicName,23*2):"话题医起聊"; //名字
                            var topicId=val.cms_topic.topicId;
                            var lastName=val.cms_topic_customer_auth.lastName;
                            var firstName=val.cms_topic_customer_auth.firstName;
                            var customerId=val.cms_topic.customerId;
                            var topicDiscuss=val.cms_topic.topicDiscuss?comm.getStrLen(val.cms_topic.topicDiscuss,43*2):"";
                            var reviewNum=val.cms_topic.reviewNum.toWK();
                            var topicAttUrl=val.cms_topic_attachment.topicAttUrl; //图片地址
                            var pageStoragePath=val.cms_topic.pageStoragePath;  //url
                            var browseNum = val.cms_topic.browseNum.toWK();
                            var isShowActivityTag=val.isShowActivityTag;
                            var activityTagName=val.activityTagName;
                            var activityTagColor=val.activityTagColor;
                            var videoType=(val.cms_topic_customer_auth.videoType?val.cms_topic_customer_auth.videoType:'');
                        }
                        var activityTag="";
                        if(isShowActivityTag){//活动资源标识
                            var color=activityTagColor;
                            activityTag='<span class="al-contentActivityTag" style="border-color:'+color+';color:'+color+'">'+activityTagName+'</span>';
                            //activityTag='<span class="al-contentActivityTag" style="border-color:red;color:red">万例挑一</span>';
                        }
                        if(topicAttUrl.length>0){
                            var timestamp = Date.parse(new Date());
                            html+='<section class="al-disMajorMainBox_body"><figure class="al-disMajorMainBox_bodyText">' +
                                '<a class="ev-sRList" href="'+pageStoragePath+'" target="_blank" data-id="'+topicId+'" data-type="4"><span>'+topicName+'</span></a><p>'+topicDiscuss+'</p> <div>' +
                                activityTag+
                                (function(){
                                    var str='';
                                    if(firstName||lastName){
                                        str+='      <span><i class="user'+((videoType&&(videoType==17||videoType==18||videoType==19))?' authorNoUserId':'')+'"></i>' + cutAuthName(lastName + firstName) + '</span>';
                                    }
                                    return str;
                                }())+
                                '<span><i class="read"></i>'+browseNum+'</span></div></figure>' +
                                '<figure class="al-disMajorMainBox_bodyImg"><a class="ev-sRList" href="'+pageStoragePath+'" target="_blank" data-id="'+topicId+'" data-type="4"><img src="'+topicAttUrl.split('|')[0]+'?'+timestamp+'" alt=""/></a>' +
                                '</figure></section>';
                        }else{
                            html+='<section class="al-contentInALine"><article class="al-contentText">' +
                                '<a href="'+voidHref(pageStoragePath,0)+'" voidHref="'+voidHref(pageStoragePath,3)+'"  target="'+voidHref(pageStoragePath,1)+'" class="al-contentTitle ev-sRList" data-id="'+topicId+'" data-type="4"><span>'+topicName+'</span></a> ' +
                                '<p class="al-contentMainText"><span>'+topicDiscuss+'</span></p><p class="al-contentOtherMsg">' +
                                activityTag+
                                (function(){
                                    var str='';
                                    if(firstName||lastName){
                                        str+='      <span data-id="' + customerId + '"><i class="al-contentAuthor'+((videoType&&(videoType==17||videoType==18||videoType==19))?' authorNoUserId':'')+'"></i>' + cutAuthName(lastName + firstName )+ '</span>';
                                    }
                                    return str;
                                }())+
                                '<span>' +
                                '<i class="al-contentWatchedNum"></i>'+browseNum+'</span></p></article></section>';
                        }
                    })
                }else{
                    html+='<header class="al-searchMain_head">为您找到相关结果 <span>0</span> 个</header>'+
                        '<section class="al-searchMain_imgBox"><img src="//img10.allinmd.cn/v3/search/search_noResult.png" alt=""/><section class="al_searchMain_error">我要报错</section></section>';
                }
                $(".pager").eq(dataId-1).show();
                $("[data-target="+dataId+"]").html(html);
                preventHref();
                //搜索列表话题列表
                $('.ev-sRList').off('click').on('click',function (e) {
                    e.preventDefault();
                    comm.creatEvent({
                        triggerType:1,
                        actionId:11049,
                        refId:$(this).attr('data-id'),
                        refType:$(this).attr('data-type'),
                        async:false
                    });
                    var reg = /(?:http(?:s|):\/\/|)(?:(?:\w*?)\.|)(?:\w*?)\.(?:\w{2,4})(?:\?.*|\/.*|)$/ig
                    if(reg.test($(this).attr('href'))) {
                        g_sps.jump(null, $(this).attr('href'), true);
                    }
                });
                shareAction(topic,shareSenceConst.search_list_topic,searchParam,6);
                //反馈
                feedback();
            }
                $("[data-target="+dataId+"]").html("");
                comm.ajax.async(addr+url, topic,function(data){
                    if(data&&data.responseObject&&data.responseObject.responseData&&!$.isEmptyObject(data.responseObject.responseData)&&data.responseObject.responseData.data_list.length){
                        $(".al-al-searchMain_head span").text(data.responseObject.responseData.total_count);
                        var totalCount=data.responseObject.responseData.total_count;
                        var pagecount=Math.ceil(totalCount/topic.pageSize);//总页数
                        $(".al-al-searchMain_head span").text(totalCount);
                        var data_list=data.responseObject.responseData.data_list;
                        addTopHtml(data_list,totalCount);
                        $(".pager").eq(dataId-1).pager({pagenumber:1, pagecount: pagecount, buttonClickCallback: PageClick});
                        if(data_list.length<topic.pageSize){
                            $(".pager").hide();
                        }
                    }else{
                        var _html='<header class="al-searchMain_head">为您找到相关结果 <span>0</span> 个</header>'+
                            '<section class="al-searchMain_imgBox"><img src="//img10.allinmd.cn/v3/search/search_noResult.png" alt=""/><section class="al_searchMain_error">我要报错</section></section>';
                        $('.al-searchMain').hide();
                        $('.al-searchMain[data-target='+dataId+']').show().html(_html);
                        preventHref();
                        $(".pager").eq(dataId-1).empty();
                        $('.ev-shareContainer').hide();
                        //推荐
                        recommendOthers(dataId);
                        //反馈
                        feedback();
                    }
                });
                PageClick = function(pageclickednumber,buttonLabel){
                    topic.pageIndex = pageclickednumber;//加载第几页；
                    comm.ajax.async(addr+url, topic,function(data){
                        if(data&&data.responseObject&&data.responseObject.responseData&&!$.isEmptyObject(data.responseObject.responseData)&&data.responseObject.responseData.data_list.length){
                            var totalCount=data.responseObject.responseData.total_count;
                            var pagecount=Math.ceil(totalCount/topic.pageSize);//总页数
                            addTopHtml(data.responseObject.responseData.data_list);
                            $(".pager").eq(dataId-1).pager({ pagenumber: pageclickednumber, pagecount: pagecount, buttonClickCallback: PageClick });//初始化加载第一页的时候如果数据不足一页不用展示分页器
                            if((parseInt(pageclickednumber,10)===1)&&data.responseObject.responseData.data_list.length<topic.pageSize){
                                $(".pager").hide();
                            }
                            scrollTop();
                        }else{
                            var _html='<header class="al-searchMain_head">为您找到相关结果 <span>0</span> 个</header>'+
                                '<section class="al-searchMain_imgBox"><img src="//img10.allinmd.cn/v3/search/search_noResult.png" alt=""/><section class="al_searchMain_error">我要报错</section></section>';
                            $('.al-searchMain').hide();
                            $('.al-searchMain[data-target='+dataId+']').show().html(_html);
                            preventHref();
                            $(".pager").eq(dataId-1).empty();
                            $('.ev-shareContainer').hide();
                        }
                    });
                    createEvent(pageclickednumber,buttonLabel);
                };

                $("[data-target="+dataId+"]").show();
                break;
        }
    }else{
        return false;
    }
});
//tab选项卡:--end--

//获取热门搜索和历史记录:start--
$(function(){
    /*站点（骨科，手外科）切换*/
    //默认选中相应站点
    if(TempCache.getItem("sesDepartment")||$("#sesDepartment").val()){
        var i=TempCache.getItem("sesDepartment")||$("#sesDepartment").val();
        if($("#sesDepartment").length==0){
            $("body").append('<input type="hidden" id="sesDepartment" value="'+ (i) +'">');
        }else{
            $("#sesDepartment").val(i);
        }
        $(".al_search_siteBar li").eq(i-1).addClass("active");
        if(i==2){
            $(".ev_searchSiteName").text("手外科");
        }
    }else{
        $(".al_search_siteBar li").eq(0).addClass("active");
    }
    $(".ev_searchSiteName").attr("on","true");
    //点击时下拉列表显示
    $(".ev_searchSiteName").on("click",function(){
        if($(this).attr("on")=="true"){
            $(this).attr("on","false");
            $(".al_search_siteBar").show();
            //事件埋点
            comm.creatEvent({
                triggerType:"骨科&手外科切换",
                keyword:"骨科&手外科切换",
                actionId:2
            });
        }else{
            $(this).attr("on","true");
            $(".al_search_siteBar").hide();
        }
        return false;
    });
    $(document).bind("click",function(){
        $(".al_search_siteBar").hide();
    });
    //下拉列表点击切换站点
    $(".al_search_siteBar li").on("click",function(){
        if(!$(this).hasClass("active")){
            $(".al_search_siteBar li").removeClass("active");
            $(this).addClass("active");
            var text=$(this).text();
            $(".ev_searchSiteName").text(text);
            $(".ev_searchSiteName").click();
            //侧导航相应修改
            var i=$(this).index();
            //TempCache.setItem("sesDepartment",i+1);
            //$(".al_siteSwitch_popBox div").attr("on","false");
            //$(".al_siteSwitch_popBox div").eq(i).attr("on","true");
            //$(".ev_siteSwitchName").text(text);
            if($("#sesDepartment").length==0){
                $("body").append('<input type="hidden" id="sesDepartment" value="'+ (i+1) +'">');
            }else{
                $("#sesDepartment").val(i+1);
            }
            tab.eq(dataId-1).click();
            searchHistory();
            searchHot();
            //事件埋点
            comm.creatEvent({
                triggerType:"骨科&手外科切换",
                keyword:text,
                actionId:3
            });
        }
    });

    customerId=$('#sesCustomerId').val()!=undefined?$('#sesCustomerId').val():"";
    var para=comm.getpara();
    if(para.keyword){
        document.title="搜索：［"+para.keyword+"］- 唯医,allinmd";
        $("meta[name=Keywords]").attr("content","［"+para.keyword+"］,［"+para.keyword+"］视频,［"+para.keyword+"］文章,病例,唯医,allinmd");
        comm.LightBox.showloading();
        $(".al-headerSearch input").val(para.keyword);
        $(".al-searchMain_topHead input").val(para.keyword);
        resultAllSearch(para.keyword);
        createKeyword();
    }
    //搜索记录:--start--
    searchHistory();
    //搜索记录--END--

    //热门搜索--start--
    searchHot();
    function searchHot(){
        var hotJson={
            /*"start"  :0 ,        //起始记录数
            "end"    :8  ,       //结束记录条数
            "groupByFlag" :'' ,  //排行周期，默认为1，（1-天，2-周，3-月，4-年，5-7天，6-30天）
            "dateTime": '',            //日期（YYYY-MM-DD），默认前一天
            "platformId": $('#sesDepartment').val(),
            "opUsr":customerId*/
            sortType:1
        };
        var paramsHot= hotJson ;
        comm.ajax.async("//gateway.allinmd.cn/base-customer-platform/cms/search/hotkey/getMapList",paramsHot,function(data){
            if(data&&data.responseObject&&data.responseObject.responseData){
                var data_list=data.responseObject.responseData.dataList;
                var preList=data.responseObject.responseData.preList;
                var hotNum = preList.length>0?4:5;
                var html="";
                var str="";
                if(data_list&&data_list.length>0){
                    var hotArray=data_list.slice(0,hotNum);
                    $.each(hotArray,function(i,val){
                        var keyWord=val.searchKey;
                        var recommendType=parseInt(val.recommendType,10);
                        var recommendTypeClass = (recommendType===1)?'recommend':'';
                        ////console.log(val.searchKey);
                        html+='<li><a href="javascript:;" class="'+recommendTypeClass+'">'+htmlToString(keyWord)+'</a></li>';
                        if(i<=2){
                            str+=htmlToString(keyWord)+" | ";
                        }
                    });
                    var hotHtmlStr = '';
                    if(hotNum===4){
                        hotHtmlStr+='<li><a href="javascript:;"><i class="icon"></i>'+htmlToString(preList[0]['searchKey'])+'</a></li>';
                        hotHtmlStr+=html;
                    }else{
                        hotHtmlStr=html;
                    }
                    $(".al-headerSearch input").attr("placeholder",comm.getStrByteLen(str.substr(0,str.length-3),20));

                    $(".al-hotSearch_ul.al-hot").html(hotHtmlStr);
                    preventHref();
                    $('.al-hotSearch_ul.al-hot li a').bind("click",function(){
                        var aa=$(this)[0].innerText;
                        $(".al-searchMain_topHead input").val(aa);
                        resultAllSearch(aa);
                        createKeyword(aa);
                        var index=$(this).parent().index()+1;
                        //事件埋点
                        comm.creatEvent({
                            triggerType:"搜索",
                            keyword:aa,
                            locationId:index,
                            actionId:60
                        });
                    });
                }
            }
        });
    }

    //热门搜索--END--

});
//获取热门搜索和历史记录:end--

//清空里历史记录:--start--
$('.al-systemMes_deleteFooter span').click(function(){
    var clearHistory=$(this).text();
    var customerId=$("#sesCustomerId").val();
    if (customerId&&clearHistory=="确定"){
        var clearJSON={
            "customerId"  :customerId,         //起始记录数
            "isValid":0
        };
        var params={paramJson: $.toJSON(clearJSON)};
        $.ajax({
            type: 'POST',
            url:"/call/search/updateKeyword/",
            data: params ,
            dataType: "json",
            success: function(data){
                searchHistory(); //清空历史记录后 再获取历史记录
            }
        });
        $('.al-deletePopBox').hide();
    }else{
        $('.al-deletePopBox').hide();
    }
});
//清空里历史记录:--end--

//获取历史记录:--start--
function searchHistory(){
    if($("#sesCustomerId").val()){//用户已登录
        var dataFlag=2;
        var customerId=$("#sesCustomerId").val();//获取用户ID 待完善----
    }else{
        var dataFlag=1;
    }
    var userJson={
        "customerId":customerId||'', //用户id
        "visitSiteId":1 , //站点id
        "isRepeat":0,
        'platformId': $('#sesDepartment').val()
    };
    var params={paramJson: $.toJSON(userJson)};
    comm.ajax.async("/call/search/searchHistory/",params,function(data){
        if(data&&data.responseObject&&data.responseObject.responseData){
            var data_list=data.responseObject.responseData.data_list;
            var html="";
            if(data_list&&data_list.length>0){
                $(".ev-historyPar").show();
                var historyArray=data_list.slice(0,5);
                $.each(historyArray,function(i,val){
                    var keyWord=val.keyWord;
                    html+='<li><a href="javascript:;">'+htmlToString(keyWord)+'</a></li>';
                });
                $(".al-hotSearch_ul.al-searchHistory_ul").html(html);
                preventHref();
                $('.al-hotSearch_ul.al-searchHistory_ul li a').bind("click",function(){
                    var aa=$(this)[0].innerText;
                    $(".al-searchMain_topHead input").val(aa);
                    resultAllSearch(aa);
                    createKeyword(aa);
                    var index=$(this).parent().index()+1;
                    //事件埋点
                    comm.creatEvent({
                        triggerType:"搜索",
                        keyword:aa,
                        locationId:index,
                        actionId:61
                    });
                });
            }else{
                $(".al-hotSearch_ul.al-searchHistory_ul").html(html);
                preventHref();
                //$('.al-sideBar_HotSearch.hide.ev-historyPar').hide();
            }
        }
    });
}
//获取历史记录:--end--

//创建历史记录:--start--  <在搜索时调用此方法>
function createKeyword() {
    var customerId = $("#sesCustomerId").val();
    var keyWords = $(".al-searchMain_topHead input").val();
    if(keyWords.length>0){
        var keyWord=keyWords;
    }else {
        var keyWord=$(".al-headerSearch input").val();
    }
    var searchUrl = location.href;
    //if (customerId) {
    var createKeywordJSON = {
        "customerId":customerId||'',
        "keyWord": keyWord,
        "searchUrl": searchUrl,
        'platformId': $('#sesDepartment').val()
    };
    var params = {paramJson: $.toJSON(createKeywordJSON)};
    $.ajax({
        type: 'POST',
        url: "/call/log/customer/keyword/createKeyword/" ,
        data: params ,
        success: function(data){
        } ,
        dataType: "json"
    });
    //}
}
//创建历史记录:--end--

//watchMore:start
function lookMore(searchParam){
    comm.Log.createBrowse({href:location.href,id:62,name:'搜索医师页面',platformId: $('#sesDepartment').val(),noTimeOut:1});
    $('.al-searchMain').hide();
    $("[data-target=5]").html("");
    $(".al-searchMain[data-target=5]").show();
    $(".al-searchMain_ul li").removeClass("active");
    $(".al-searchMain_ul li[data-id=5]").addClass("active").attr("data-hadsearch","yes");
    dataId=5;
    $(".pager").hide();
    if($("#sesCustomerId").val()){//用户已登录
        var dataFlag=2;
        //var customerId=$("#sesCustomerId").val();//获取用户ID
    }else{
        var dataFlag=1;
    }
    var userJson={
        pageIndex:1,
        pageSize:10,
        sortType:sortType,
        searchParam: searchParam,//搜索关键词
        attUseFlag:AttUseFlag.c,
        logoUseFlag:UseFlag.c,
        opUsr:customerId,
        dataFlag:dataFlag,
        isValid:1
    };
    function addUserHtml(data_list){
        if(data_list&&data_list.length>0){
            var arrHT=[];
            $.each(data_list,function(i,val){
                var logo; var user; var statistic;
                if(val.customer_att){
                    logo=val.customer_att;
                }
                if(val.customer_auth){
                    user=val.customer_auth;
                }
                if(val.customer_statistic){
                    statistic=val.customer_statistic;
                }
                name=user.lastName+user.firstName;
                medicalTitle=user.medicalTitleShow;
                company=user.company?comm.getStrLen(user.company,46):"";
                contribuNum=statistic.caseNum+statistic.docNum+statistic.topicNum+statistic.videoNum;//贡献值
                arrHT.push(module.resourceListTemplate({tempName:"userList"})({
                    cid:user.customerId,
                    userName:name,
                    logoUrl:logo.logoUrl,
                    state:user.state,
                    medicalTitle:medicalTitle,
                    company:company,
                    contribuNum:contribuNum,
                    reviewNum:statistic.reviewNum,
                    fansNum:statistic.fansNum,
                    relationship:val.customer_follow_people.relationship
                }));
            });
            $("[data-target=5]").html(arrHT);
            preventHref();
            $(".pager").eq(dataId-1).show();
        }else{
            html+='<header class="al-searchMain_head">为您找到相关结果 <span>0</span> 个</header>'+
                '<section class="al-searchMain_imgBox"><img src="//img10.allinmd.cn/v3/search/search_noResult.png" alt=""/><section class="al_searchMain_error">我要报错</section></section>';
            $("[data-target=5]").html(html);
            preventHref();
            //反馈
            feedback();
        }
    }
    comm.ajax.async("/call/search/searchUser/", userJson,function(data){
        if(data&&data.responseObject&&data.responseObject.responseData){
            var totalCount=data.responseObject.responseData.total_count;
            var pagecount=Math.ceil(totalCount/userJson.pageSize);//总页数
            $(".al-al-searchMain_head span").text(totalCount);
            var data_list=data.responseObject.responseData.data_list;
            addUserHtml(data_list);
            $(".pager").eq(dataId-1).pager({pagenumber:1, pagecount: pagecount, buttonClickCallback: PageClick});
            if(data_list.length<userJson.pageSize){
                $(".pager").hide();
            }
        }
    });
    PageClick = function(pageclickednumber,buttonLabel){
        userJson.pageIndex = pageclickednumber;
        comm.ajax.async("/call/search/searchUser/", userJson,function(data){
            if(data&&data.responseObject&&data.responseObject.responseData){
                var totalCount=data.responseObject.responseData.total_count;
                var pagecount=Math.ceil(totalCount/userJson.pageSize);//总页数
                $(".pager").eq(dataId-1).pager({ pagenumber: pageclickednumber, pagecount: pagecount, buttonClickCallback: PageClick });//初始化加载第一页的时候如果数据不足一页不用展示分页器
                if((parseInt(pageclickednumber,10)===1)&&data.responseObject.responseData.data_list.length<userJson.pageSize){
                    $(".pager").hide();
                }
                addUserHtml(data.responseObject.responseData.data_list);
                scrollTop();
            }
        });
        createEvent(pageclickednumber,buttonLabel);
    };
    $("[data-target=5]").show();
}
//watchMore:end

function scrollTop(){
    $(window).scrollTop(0);  //点击页码回到顶部----公共方法----
}

function shareAction(param,shareSence,keyword,searchType){
    $('.al-shareBox').hide();
    var t=this;
    var resourceType;
    var hash ='';
    switch(searchType){//0 7 1 3 9 2 4
        case 0:resourceType=0;hash='#/all';break;
        case 1:resourceType=7;hash='#/case';break;
        case 2:resourceType=1;hash='#/video';break;
        case 3:resourceType=3;hash='#/meeting';break;
        case 4:resourceType=9;hash='#/doctor';break;
        case 5:resourceType=2;hash='#/doc';break;
        case 6:resourceType=4;hash='#/topic';break;
    }
    var o = $.extend({},param,{"sceneType":1,"resourceType":resourceType,"visitSiteId":1,"scene":10,"isValid":1,sortType:sortType});
    var sinaTitle="";var qqTitle="";var qZoneTitle="";
    module.share({
        container:$ ( ".ev-shareContainer" ),// 存放分享组件的父级
        type:2,// 默认为 1  1 ：社交分享  2 ：页面左下角全站分享
        url:'https://www.allinmd.cn/pages/search/search.html?keyword='+escapeReplace(keyword)+"&searchType="+searchType,// 分享链接， 默认取当前页链接
        h5Url:'https://m.allinmd.cn/dist/search/search.html?keyword='+encodeURIComponent(keyword)+hash,//h5页面的链接会生成微信二维码
        title:"",// 分享标题
        shareTrend:0,//0: 不需要站内动态分享  1 ：需要站内动态分享
        trendUrl:'',// 分享到站内动态的接口
        data:{},// 分享到站内动态的接口参数
        callback:function(){},// 分享到站内动态成功后回调函数
        triggerRequest:function(content){//事件点击
            $.ajax({
                url: PC_CALL+'comm/data/share/getMapList3/',
                type: "post",
                data: {paramJson: $.toJSON(o)},
                dataType: 'json',
                async:false,
                success: function (d) {
                    if (d && d.responseObject.responseData && !$.isEmptyObject(d.responseObject.responseData) && d.responseObject.responseData.data_list.length) {
                        var item = d.responseObject.responseData.data_list[0];
                        content.pic = item.share_comm.shareImageUrl;
                        content.title=item.share_comm.shareTitle!=""?item.share_comm.shareTitle:document.title;
                        $.each(item.share_channel,function(i,el){
                            if(el.shareChannel=='Sina'){
                                sinaTitle=content.sinaTitle=el.shareDesc;
                            }else if(el.shareChannel=="QQFriend"){
                                qqTitle=content.qqTitle = el.shareTitle;
                                content.qqSummary = el.shareDesc;
                            }else if(el.shareChannel=="QZone"){
                                qZoneTitle=content.qqZoneTitle=el.shareTitle;
                                content.qqZoneSummary = el.shareDesc;
                            }
                        });
                    }
                }

            });
        },
        shareSinaSuc:function(){
            comm.shareLog({
                shareType: "",
                resourceId:"" ,
                resourceType: "",
                refId: "",
                shareSence:shareSence,
                shareChannel:3,
                shareContent:sinaTitle
            });
        },
        shareQQSuc:function(){
            comm.shareLog({
                shareType: "",
                resourceId:"" ,
                resourceType: "",
                refId: "",
                shareSence:shareSence,
                shareChannel:2,
                shareContent:qqTitle
            });
        },
        shareQzoneSuc:function(){
            comm.shareLog({
                shareType: "",
                resourceId:"" ,
                resourceType: "",
                refId: "",
                shareSence:shareSence,
                shareChannel:1,
                shareContent:qZoneTitle
            });
        },
    });
}
