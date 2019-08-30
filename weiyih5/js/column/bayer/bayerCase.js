/**
 * 功能描述： 拜耳例之声的优秀病例页面
 * 使用方法:
 * 注意事件：
 * 引入来源：  作用：
 *
 * Created by HeJing on 2016/04/05.
 */

$(function(){
    var activityId=1460028659268/*1460028659268   1459416619774*/;
    var pageIndex=1;
    var data={};

    data.activityId=activityId;
    data.pageIndex=pageIndex;
    data.pageSize=10;
    data.sortType=4;
    //$.mobile.loading().show();
    $.ajax({
        type : "post",
        url : "/mcall/case/baseinfo/json_list/",
        data : data,
        dataType : "json",
        success : function(rep){
            //$.mobile.loading().hide();
            if(rep&&rep.responseObject&&rep.responseObject.responseData){
                if(rep.responseObject.responseData.data_list&&rep.responseObject.responseData.data_list.length>0){
                    var items=rep.responseObject.responseData.data_list;
                    var totalCount=rep.responseObject.responseData.total_count;
                    bayerCaseShow(items);
                    footerBtnScroll();
                    if(totalCount>10){
                        $(".Ev-LoadMore").show();
                    }

                }
            }
        },
        error:function(){}
    });

        $(".Ev-LoadMoreBtn").on("click",function(){
            //$.mobile.loading().show();
            $.ajax({
                type : "post",
                url : "/mcall/case/baseinfo/json_list/",
                data : {activityId:activityId,sortType:4,pageIndex:++pageIndex,pageSize:10},
                dataType : "json",
                success : function(rep){
                    //$.mobile.loading().hide();
                    if(rep&&rep.responseObject&&rep.responseObject.responseData){
                        if(rep.responseObject.responseData.data_list&&rep.responseObject.responseData.data_list.length>0){
                            var items=rep.responseObject.responseData.data_list;
                            if(items.length<10){
                                $(".Ev-LoadMore").hide();
                            }
                            bayerCaseShow(items);
                        }
                    }
                },
                error:function(){}
            });
        });
});

function bayerCaseShow(items){//优秀病例展示
    var html="";

    $.each(items,function(i,e){
        var caseForArea=items[i].caseForArea;//赛区
        var caseName=items[i].case_baseinfo.caseName,//标题
            webStoragePath=items[i].case_baseinfo.webStoragePath,//终端页链接
            browseNum=items[i].case_baseinfo.browseNum;//浏览数
        if(getLength(caseName)>34){
            caseName=cutstr(caseName,32)+'…';
        }
        var company=items[i].case_customer_auth.company;//医院

        var authName=items[i].case_customer_auth.lastName+items[i].case_customer_auth.firstName;//作者名

        var imgUrl=items[i].case_attachment.attUrl;//图片地址
        if(imgUrl==undefined){
            imgUrl="//img00.allinmd.cn/default/225_150.jpg";
        }
    html+='<section class="caseList Ev-CaseList">'+
        '<figure class="caseImg">'+
            '<a href="'+webStoragePath+'" data-ajax="false">'+
            '<img src="'+imgUrl+'" alt="">'+
            '</a>'+
            '</figure>'+
            '<article class="caseText">'+
            '<a href="'+webStoragePath+'" data-ajax="false"><span class="area">['+caseForArea+'] </span>'+caseName+'</a>'+
            '<p>'+
            '<span class="userName">'+authName+'</span>'+
        '<span class="watchNum">浏览: '+browseNum+'</span>'+
        '</p>'+
        '</article>'+
    '</section>';
    });

    $(".Ev-LoadMore").before(html);
    footerBtnScroll();
    if (($(".main").height()-$(".pageFooter").height())<document.documentElement.clientHeight){
        $(".pageFooter").css({
            position:"absolute",
            bottom:0,
            left:0,
            right:0
        });
        $(".footerBtn").css("bottom","1.6rem");
    }else{
        $(".footerBtn").css("bottom","0rem");
    }

    $.each($(".Ev-CaseList"),function(index1,ele1){
        $(ele1).on("click",function(){
            var href=$(this).find("a").eq(0).attr("href");
            g_sps.jump(null,href);
        });

    })


}


