/**
 * Created by ALLIN on 2016/9/18.
 */
/**
 * 功能描述：  我的作品
 * 使用方法:
 * 注意事件：
 * 引入来源：  作用：
 *
 * Created by LiChunHui on 2016/2/15.
 */
$(function(){
    var className="",activityId=$("#activityId").val();
    var versions=browser.versions;
    if(versions.iPhone||versions.iPad){
        className="i";
    }
    if(versions.android){
        className="a";
    }
    var data={};
    data.activityId=activityId;
    data.logoUseFlag=3;
    data.customerId=appjs.getAuthorCustomerId();//"1474255125911"
    data.pageIndex=1;
    data.pageSize=50;
    data.attUseFlag=4;
    data.dataFlag=4;
    $.ajax({
        type : "post",
        url : "/mcall/customer/trends/json_list_v2/",
        data : data,
        dataType : "json",
        success : function(rep){
            var html="";
            if(rep&&rep.responseObject&&rep.responseObject.responseData){
                if(rep.responseObject.responseData.data_list&&rep.responseObject.responseData.data_list.length>0){
                    var list=rep.responseObject.responseData.data_list;
                    $.each(list,function(i,val){
                        var trend=val;
                        var resourceId="";
                        if(trend.customer_trends.isValid===1){ //视频有效;
                            resourceId=trend.customer_trends.resourceId;
                        }
                        var attUrl="/images/img50/225_150.jpg";//默认图片
                        var auth_report="";					//审核状态
                        var auth_report_ing='<dl class="aduitBox"><dd class="aduit_wait">待审核</dd></dl>';
                        var auth_report_suc=trend.score>0?'<p class="totalScoreBox">总分：<span>'+trend.score+'</span><i>分</i></p>':'<dl class="aduitBox"><dd class="aduit_yes">审核已通过</dd></dl>';
                        var auth_report_fail='<dl class="aduitBox"><dd class="aduit_no">未达到参赛标准</dd><dd>拒绝原因：'+(jQuery.isEmptyObject(trend.approvalReason)?'':(trend.approvalReason.length>25?trend.approvalReason.substring(0,25)+'...':trend.approvalReason))+'</dd></dl>';
                        var state=trend.approvalStatus;
                        var hide="";
                        //1-待审核、2-审核已通过、4-审核未通过
                        switch(state){
                            case 4:
                                auth_report =auth_report_fail;
                                break;
                            case 2:
                                hide="style='display:block;'";
                                auth_report =auth_report_suc;
                                break;
                            default:
                                hide="style='display:none;'";
                                auth_report =auth_report_ing;
                        }
                        var resourceName=trend.customer_trends.resourceName.length > 25 ? trend.customer_trends.resourceName.substring(0, 25) + '...' : trend.customer_trends.resourceName;
                        var trendType=trend.customer_trends_type;
                        if(trendType==1){//视频
                            if(trend.cms_video_attachment[0].videoAttUrl){
                                attUrl=trend.cms_video_attachment[0].videoAttUrl;
                            }
                            time="<span>"+trend.resource_valid.playTime+"</span>";
                        }
                        var browseNum=trend.resource_valid.browseNum;//资源浏览数
                        var reviewNum=trend.customer_trends.reviewNum;//评论数
                        var upNum=trend.customer_trends.upNum;//点赞数
                        var pubTime = trend.customer_trends.opDate.split(' ')[0];
                        html+='<section class="mine_main_cont_piece" '+($('#activityId').attr('isReviewBegin')==1?hide:"")+' resourceId="'+resourceId+'" trendType="'+trendType+'" resourceName="'+trend.customer_trends.resourceName+'">'+
                            '<section class="mine_main_cont_piece_center">'+
                            '<section class="mine_main_cont_piece_center_left left">'+
                            '<a href="javascript:;" style="display:block;"><h3>'+comm.getStrLen(resourceName,40)+'</h3></a>'+
                            '<ul '+hide+'>'+
                            '<!--注：安卓类名后缀_a,ios类名后缀_i-->'+
                            '<li class="casePK_play_'+className+'">'+browseNum.toWK()+'</li>'+
                            '<li class="casePK_comment_'+className+'">'+reviewNum.toWK()+'</li>'+
                            '<li class="casePK_support_'+className+'">'+upNum.toWK()+'</li>'+
                            '<div class="clearfix"></div>'+
                            '</ul>'+
                            auth_report+
                            '</section>'+
                            '<section class="run_main_cont_piece_center_right right">'+
                            '<div class="videoImgBox">'+
                            '<a href="javascript:;" style="display:block;" target="_blank"><img src="'+attUrl+'"></a>'+
                            time+
                            '<img class="videoBtn" src="/images/img50/column/videoPK_v2/video_btn.png" />'+
                            '</div>'+
                            '<div class="up_time">'+pubTime+'</div>'+
                            '</section>'+
                            '<div class="clearfix"></div>'+
                            '</section>'+
                            '</section>'
                        $(".nowork").hide();
                    })
                }else{
                    $(".mine_main_cont").hide();
                    $(".nowork").show();
                    $(".mine_main").css("margin-top","0");
                }

            };
            $(".mine_main_cont_piece_box").html(html);
            $(".mineNum").text($(".mine_main_cont_piece:visible").length);
        },
        error:function(){}
    });
    /**
     * 处理点击事件
     */
    $(".mine_main_cont_piece_box").on("click",'.mine_main_cont_piece',function (event) {
        event.stopPropagation();
        var resourceId=$(this).attr("resourceId");
        if(resourceId){
            appjs.gotoVideoDetail($.toJSON({"resourceId":resourceId,"videoName":$(this).attr("resourceName")}))
        }
        return false;
    });
})
