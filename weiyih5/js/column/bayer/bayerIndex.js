/**
 * 功能描述： 拜耳例之声的首页
 * 使用方法:
 * 注意事件：
 * 引入来源：  作用：
 *
 * Created by HeJing on 2016/04/05.
 */

$(function(){

    var oneI= location.href.indexOf("bayer_index.html") > 0 || location.href.indexOf("bayer_activity.html")>0 || location.href.indexOf("bayer_case.html") > 0;
    //拜耳首页精彩现场
    //var wodfSceListTitle;
    if(oneI){
        var activityId=1460028659268/*1460028659268*/;
        var data={};
        data.activityId=activityId;
        data.pageIndex=1;
        data.pageSize=4;
        data.sortType=4;
        //$.mobile.loading().show();
        $.ajax({
            type : "post",
            url : "/mcall/case/baseinfo/json_list/",
            data : data,
            dataType : "json",
            async:false,
            success : function(rep){
                var html="";
                //$.mobile.loading().hide();
                if(rep&&rep.responseObject&&rep.responseObject.responseData){
                    if(rep.responseObject.responseData.data_list&&rep.responseObject.responseData.data_list.length>0){
                        var items=rep.responseObject.responseData.data_list;
                        indexCaseShow(items);
                    }

                };
            },
            error:function(){}
        });

    }else{
        $.each($(".Ev-BayerIndexWonderfulSceneListClick"),function(i,e){
            $(e).on("click",function(){
                var href=$(this).find("a").eq(0).attr("href");
            });
        });

    }

    raceLiveScroll();//轮播公告
    //var caseListTitle;
    $.each($(".Ev-li-BayerIndexCaseListClick"),function(index1,ele1){
        $(ele1).on("click",function(){
            var href=$(this).find("a").eq(0).attr("href");
            g_sps.jump(null,href);
        });

    });

    footerBtnScroll();//分享按钮定位

});

//Created by QiangKailiang on 2016/04/25
//赛区战况轮播功能
function raceLiveScroll(){
    var swiper2 = new Swiper('.raceLive', {
        autoplay: 3000,
        loop: true,
        autoplayDisableOnInteraction : false
    });
}


function indexCaseShow(items){//首页海选优秀病例展示
    var html="";
    $.each(items,function(i,e){
        var caseName=items[i].case_baseinfo.caseName,//标题
            webStoragePath=items[i].case_baseinfo.webStoragePath;//终端页链接
        if(getLength(caseName)>28){
            caseName=cutstr(caseName,26)+'…';
        }


        var company=items[i].case_customer_auth.company;//医院
        if(getLength(company)>16){
            company=cutstr(company,14)+'…';
        }
        var authName=items[i].case_customer_auth.lastName+items[i].case_customer_auth.firstName;//作者名

        html+='<li class="caseText Ev-CaseText">'+
            '<a href="'+webStoragePath+'" data-ajax="false">'+caseName+'</a>'+
            '<p>'+
            '<span class="doctor">'+authName+'</span>'+
            '<span class="hospital">'+company+'</span>'+
            '</p>'+
            '</li>';
    });
    $(".Ev-Li-AppendCaseList").html(html);
    footerBtnScroll();

}