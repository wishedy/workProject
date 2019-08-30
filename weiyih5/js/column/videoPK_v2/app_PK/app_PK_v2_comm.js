/**
 * Created by ALLIN on 2016/9/12.
 */
/**
 * 功能描述：
 * 使用方法:
 * 注意事件：
 * 引入来源：  作用：
 *
 * Created by LiChunHui on 2016/2/15.
 */
var browser = {
    versions: function () {
        var u = navigator.userAgent, app = navigator.appVersion;
        return {//移动终端浏览器版本信息
            trident: u.indexOf('Trident') > -1, //IE内核
            presto: u.indexOf('Presto') > -1, //opera内核
            webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
            gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
            mobile: !!u.match(/AppleWebKit.*Mobile.*/) || !!u.match(/AppleWebKit/), //是否为移动终端
            ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
            android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
            iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1, //是否为iPhone或者QQHD浏览器
            iPad: u.indexOf('iPad') > -1, //是否iPad
            webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
        };
    }(),
    language: (navigator.browserLanguage || navigator.language).toLowerCase()
};
function getpara()//获取参数的函数
{
    var url=document.URL;
    var param={};
    var str,item;
    if(url.lastIndexOf("?")>0)
    {
        str=url.substring(url.lastIndexOf("?")+1,url.length);
        var arr=str.split("&");
        for(var i=0;i<arr.length;i++)
        {
            item =  arr[i].split("=");
            param[item[0]] = decodeURI(item[1]);
        }

    }
    return param;
}
$(function(){
    adjustNavWidth();
    //向下滚动nav置顶
    if($(".naver").length>0&&location.href.indexOf('semifinals_result')==-1){
        var navTop = $('.naver').offset().top;
        var scrollTop =0;
        $(window).scroll(function(){
            scrollTop = $(document).scrollTop();
            if(scrollTop>=navTop){
                $('.naver').css({
                    "position":"fixed",
                    "left":"0",
                    "top":"0",
                    "background":'#fff',
                    "z-index":"11"

                })
            }else{
                $('.naver').css("position","static")
            }
        })
    }else{
        //结果公示页滑动导航处理
        var navTop = $('.resultTag').length>0&&$('.resultTag').offset().top;
        var scrollTop = 0;
        $('.resultTagWrap').height($('.resultTag').outerHeight());
        //公示类title各自对应的距顶部高度
        var sTop = [];  //[1151, 8091, 14569, 21097, 23307, 25923, 27133, 28346]
        $('.resultType').each(function(){
            sTop.push(parseInt($(this).offset().top));
        });
        $(window).scroll(function(){
            scrollTop = $(document).scrollTop();
            if(scrollTop>=navTop){
                $('.resultTag').css({
                    "position":"fixed",
                    "left":"0",
                    "top":"0",
                    "background":'#fff',
                    "z-index":"11",
                    marginTop:0
                })
            }else{
                $('.resultTag').css("position","static");
                $('.resultTag li').removeClass('active');
            }
            if(scrollTop+$(window).height()==$(document).height()){
                $('.resultTag li').removeClass('active').eq(7).addClass('active');
            }else{
                for(var i=7;i>=0;i--){
                    if(scrollTop> sTop[i]-$('.resultTag').outerHeight()){
                        $('.resultTag li').removeClass('active').eq(i).addClass('active');
                        break;
                    }
                }
            }
        });
        $('.resultTag li a').click(function(e){
            var anchorName = $(this).attr('href');
            $(window).scrollTop($(anchorName).offset().top-$('.resultTag').outerHeight());
            e.preventDefault();
        });
    }
    //评分是否开始
    if(location.href.indexOf("app_primary_result")==-1 && location.href.indexOf("app_semifinals_result")==-1){
        $(".naver li").eq(0).after('<li><a href="/pages/column/videoPK_v2/app_PK/app_primary_result.html?activityId='+$("#activityId").val()+'" data-ajax="false">初选结果</a></li>');
        adjustNavWidth();
    }

    //jq:tab切换效果展示：
    $(".expert_nav li").each(function(t, n) {
        $(".expert_list_cont").find(".zj_list li:gt(5)").hide();
        $(n).on("click", function() {
                var i = $(this).index();
                $(".expert_nav li div").removeClass("new"),
                    $(this).find("div").addClass("new"),
                    $(".expert_list_cont").hide();
                var conCur = $(".expert_list_cont").eq(i).show() ;
                var overList = 	$(".expert_list_cont").eq(i).find(".zj_list li:gt(5)").hide();
                var more =  conCur.find(".more")
                conCur.find(".more").off("click").on("click", function () {
                    show();
                });


                function show(){
                    more.off("click").on("click",function(){
                        hide();
                    }).text("收起更多").addClass("close_more");
                    overList.slideDown();
                }

                function hide(){
                    more.off("click").on("click",function(){
                        show();
                    }).text("展开更多").removeClass("close_more");
                    overList.slideUp();
                }
            }
        );
    });
    $(".expert_nav li:eq(0)").click();

    //初审结果页点击跳转app终端页
    $('.mine_main_cont a').on('click',function(e){
        e.preventDefault();
        var _href = $(this).attr('href');
        var resourceId = _href.substring(_href.lastIndexOf('/')+1,_href.lastIndexOf('.'));
        var resName = $(this).parents('.run_main_cont_piece').attr('resourcename');
        appjs.gotoVideoDetail($.toJSON({"resourceId":resourceId,"videoName":resName}));
    });

    //点击显示更多
    $('.showMore').toggle(
        function(){
            $(this).children().css({
                'background':'url(/images/img50/column/videoPK_v2/blueUp.png) no-repeat right center',
                'background-size':'0.1rem 0.06rem'
            }).html('收起全部');
            $('.cont_ranges').css('height','41rem')
        },
        function(){
            $(this).children().css({
                'background':'url(/images/img50/column/videoPK_v2/blueDown.png) no-repeat right center',
                'background-size':'0.1rem 0.06rem'
            }).html('展示更多');
            $('.cont_ranges').css('height','9.98rem')
        }
    );
    //获取activityId

    var y = /^[0-9]*$/;
    var activityId =1472178139520;  //线上初赛结果页没有参数
    if(y.test(getpara().activityId)){
        activityId=getpara().activityId;
    }else if(getpara().activityId){
        activityId=getpara().activityId.split('#')[0];
    }
    $("#activityId").val(activityId);
    var customerId=appjs.getAuthorCustomerId();//"1474255125911"
    var lia = $(".naver li").eq($(".naver li").length-1);
    //是否是专家评委
    if(customerId){
        $.ajax({
            type : "post",
            url : "/mcall/activity/api/isReviewer/",
            data : {paramJson:$.toJSON({"customerId":customerId,activityId:activityId})},
            dataType : "json",
            async:false,
            success : function(rep){
                if(rep&&rep.responseObject&&rep.responseObject.responseData){
                    if(rep.responseObject.responseData.isReviewer=="1"){//是专家
                        lia.show();
                        lia.find("a").text("待评作品").attr("href","/pages/column/videoPK_v2/app_PK/app_m_assessWorks.html?activityId="+$('#activityId').val());
                    }else{
                        lia.show();
                    }
                }
            },
            error:function(){}
        });
    }else{
        lia.hide();
    }
    //评分是否开始
    $.ajax({
        type:'post',
        url:M_CALL+"activity/event/isReviewBegin/",
        data:{paramJson:$.toJSON({ activityId:$("#activityId").val()})},
        dataType:"json",
        async:false,
        success:function(data){
            if (data && data.responseObject.responseData) {
                var isReviewBegin = data.responseObject.responseData.expireStatus;
                $('#activityId').attr('isReviewBegin',isReviewBegin);//1是已经开始了,-1没开始
            }
        }
    });
    //报名入口是否开放
    if($('#activityId').attr('isReviewBegin')==1){
        $(".onlyShare").show().siblings(".apply_and_share").hide();
    }else{
        if($('#activityId').attr('isReviewer')==1){
            $(".onlyShare").show().siblings(".apply_and_share").hide();
        }else{
            $(".onlyShare").hide().siblings(".apply_and_share").show();
        }
    }

    //活动状态
    $.ajax({
        type : "post",
        url : "/mcall/cms/activity/isResultShowBegin/",
        data : {paramJson:$.toJSON({"activityId":activityId})},
        dataType : "json",
        async:false,
        success : function(rep){
            if(rep&&rep.responseObject&&rep.responseObject.responseData){
                status=rep.responseObject.responseData.expireStatus;
                $("body").append("<input type='hidden' value='"+status+"' id='status'/>");
                if(status==1){//1:结果公示中 -1:过期
                    if(location.href.indexOf("app_semifinals_result")==-1) {
                        $(".naver li").eq(0).before('<li><a href="/pages/column/videoPK_v2/app_PK/app_semifinals_result.html?activityId=' + $("#activityId").val() + '">结果公示</a></li>');
                        adjustNavWidth();
                    }
                }
            }
        },
        error:function(){}
    });

    function adjustNavWidth(){  //调整导航宽度
        var space=0;
        $('.naver li').each(function(i,el){
            if(i<4){
                space += $(el).outerWidth();
            }
        });
        space = $('.naver').width() - space;
        $('.naver li').css('margin',0);
        $('.naver li:eq(1),.naver li:eq(2),.naver li:eq(3)').css({margin:'0 '+space/8+"px"});
    }


});

