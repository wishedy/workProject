/**
 * 功能描述：  我的作品
 * 使用方法:
 * 注意事件：
 * 引入来源：  作用：
 *
 * Created by LiChunHui on 2016/2/15.
 */
$(function(){
    user.privExecute({
        operateType: 'login',
        callback: function () {
            //window.location.href = "/html/pages/column/videoPK/m/myWorks.html";
        }
    });
    var activityId="";
    var className="";
    var versions=browser.versions;
    if(versions.iPhone||versions.iPad){
        className="i";
    }
    if(versions.android){
        className="a";
    }

    activityId=$("#activityId").val();
    var data={};
    data.activityId=activityId;
    data.logoUseFlag=3;
    data.customerId=localStorage.getItem("userId");//会员ID由app提供

    data.pageIndex=1;
    data.pageSize=50;
    data.attUseFlag=4;
    data.dataFlag=4;
    $.mobile.loading().show();
    $.ajax({
        type : "post",
        url : "/mcall/customer/trends/json_list_v2/",
        data : data,
        dataType : "json",
        success : function(rep){
            var html="";
            $.mobile.loading().hide();
            if(rep&&rep.responseObject&&rep.responseObject.responseData){
                if(rep.responseObject.responseData.data_list&&rep.responseObject.responseData.data_list.length>0){
                    var list=rep.responseObject.responseData.data_list;
                    $.each(list,function(i,val){
                        var trend=val;
                        var resourceId="";
                        var resourceUrl="";		//无效链接
                        if(trend.customer_trends.isValid===1){										//视频有效
                            resourceUrl=trend.customer_trends.resourceUrl;
                            resourceId=trend.customer_trends.resourceId;
                        }
                        var attUrl="//img50.allinmd.cn/default_list_225_150.jpg";

                        var auth_report="";					//审核状态
                        var auth_report_score='<div class="casePK_score">总分<span>92</span></div>';
                        var auth_report_ing='<div class="casePK_wait">待审核</div>';
                        var auth_report_suc='<div class="casePK_yes">审核已通过</div>';
                        var auth_report_fail='<div class="casePK_no">审核未通过</div><div>拒绝原因：'+(jQuery.isEmptyObject(trend.approvalReason)?'':(trend.approvalReason.length>25?trend.approvalReason.substring(0,25)+'...':trend.approvalReason))+'</div>';

                        var state=trend.approvalStatus;
                        var hide="";
                        if(trend.customer_trends_type&&trend.customer_trends_type===7){//病例
                            //1-提交审核、2-一级审核通过，3-审核拒绝'
                            switch(state){
                                case 3:
                                    hide="style='display:none;'";
                                    auth_report =auth_report_fail;
                                    break;
                                case 2:
                                    auth_report =auth_report_suc;
                                    break;
                                default:
                                    auth_report =auth_report_ing;
                            }
                        }else{                                                      //视频
                            //1-提交审核、2-审核通过，4-审核拒绝'
                            switch(state){
                                case 4:
                                    hide="style='display:none;'";
                                    auth_report =auth_report_fail;
                                    break;
                                case 2:
                                    auth_report =auth_report_suc;
                                    break;
                                default:
                                    auth_report =auth_report_ing;
                            }
                        }


                        var resourceName=trend.customer_trends.resourceName.length > 22 ? trend.customer_trends.resourceName.substring(0, 22) + '...' : trend.customer_trends.resourceName;
                        var trendType=trend.customer_trends_type;
                        if(trendType==1){//视频
                            if(trend.cms_video_attachment[0].videoAttUrl){
                                attUrl=trend.cms_video_attachment[0].videoAttUrl;
                            }
                            time="<p>"+trend.resource_valid.playTime+"</p>";
                            iconName="play";
                        }
                        if(trendType==7){//病例
                            if(trend.case_attachment_list[0]&&trend.case_attachment_list[0].attUrl){
                                attUrl=trend.case_attachment_list[0].attUrl;
                            }
                            time="";
                            iconName="eye";
                        }
                        var browseNum=trend.resource_valid.browseNum;//资源浏览数
                        var reviewNum=trend.customer_trends.reviewNum;//评论数
                        var upNum=trend.customer_trends.upNum;//点赞数
                        html+='<div class="list_con" resourceUrl="'+resourceUrl+'" trendType="'+trendType+'" resourceName="'+trend.customer_trends.resourceName+'">'+
                        '<div class="list_z">'+
                        '<a href="javascript:;">'+
                        '<img src="'+attUrl+'" alt="" width="100%;">'+
                        time+
                        '</a>'+
                        '</div>'+
                        '<div class="list_y">'+
                        '<a href="javascript:;">'+
                        '<h5 class="bt">'+resourceName+'</h5>'+
                        '</a>'+
                        '<div class="casePK_info">'+
                        '<ul '+hide+'>'+
                        '<!--注：安卓类名后缀_a,ios类名后缀_i-->'+
                        '<li class="casePK_'+iconName+'_'+className+'">'+browseNum.toWK()+'</li>'+
                        '<li class="casePK_comment_'+className+'">'+reviewNum.toWK()+'</li>'+
                        '<li class="casePK_support_'+className+'">'+upNum.toWK()+'</li>'+
                        '<div class="clear"></div>'+
                        '</ul>'+
                        auth_report+
                        '</div>'+
                        '</div>'+
                        '</div>'
                    })
                }else{
                    $(".prod_list").hide();
                    $(".videoPK_noWork").show();
                }

            };
            $(".prod_list").html(html);

        },
        error:function(){}
    });
    /**
     * 处理点击事件
     */
    $(".prod_list").on("vclick",'.list_con',function (event) {
        event.stopPropagation();
        var resourceUrl=$(this).attr("resourceUrl");
        if(resourceUrl){
          g_sps.jump(null,resourceUrl);
        }
        return false;
    });
})
