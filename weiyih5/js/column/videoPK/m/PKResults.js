/**
 * 功能描述：
 * 使用方法:
 * 注意事件：
 * 引入来源：  作用：
 *
 * Created by LiChunHui on 2016/2/1.
 */
$(function(){
    var timer=null;
    var b=1;
    $(".EV_top").on("vclick",function(){
        MoveTop(0);
        return false;
    });
    $(window).bind("scroll",function(){
        if(b==2){
            clearInterval(timer);
        }
        b=2;
    });
    function MoveTop(target){
        clearInterval(timer);
        var iSpeed=iCur=0;
        timer=setInterval(function(){
            iCur=document.documentElement.scrollTop||document.body.scrollTop;
            iSpeed=(target-iCur)/8;
            iSpeed = iSpeed > 0 ? Math.ceil(iSpeed) : Math.floor(iSpeed);
            if(iCur==target||iSpeed==1){
                clearInterval(timer);
            }else{
                document.documentElement.scrollTop=document.body.scrollTop=iCur+iSpeed;
            }

            b=1;
        },30);
    };
    activityId=$("#activityId").val();
    $.ajax({
        type : "post",
        url : "/mcall/activity/api/introductionContent/",
        data : {"activityId":activityId},
        dataType : "json",
        success : function(rep){
            if(rep&&rep.responseObject.responseData&&rep.responseObject.responseData.message){
                $("#EV_foreword").html(rep.responseObject.responseData.message);
            }
        }
    });

    $.mobile.loading().show();
    $.ajax({
        type : "post",
        url : "/mcall/activity/api/resultPublicity/",
        data : {paramJson:$.toJSON({"activityId": activityId, "randStrand": "1,2,3"})},
        dataType : "json",
        async:false,
        success : function(rep){
            $.mobile.loading().hide();
            if(rep&&rep.responseObject.responseData){
                if(rep.responseObject.responseData.rankResultList&&rep.responseObject.responseData.rankResultList.length>0){
                    var list=rep.responseObject.responseData.rankResultList;
                    var html="";
                    var html3="";//专业标签
                    $.each(list,function(i,val){
                        propertyId=val.propertyId;
                        propertyName=val.propertyName;
                        var rank=val.rank;
                        var html2="";
                        $.each(rank,function(j,o){
                            var videoList=caseList="";
                            switch (o.ranking){
                                case "1":
                                    icon="//img50.allinmd.cn/column/videoPK/casePK03_03.png";//一等奖
                                    break;
                                case "2":
                                    icon="//img50.allinmd.cn/column/videoPK/casePK04_06.png";//二等奖
                                    break;
                                case "3":
                                    icon="//img50.allinmd.cn/column/videoPK/casePK05_08.png";//三等奖
                                    break;
                                default :
                                    break;
                            }
                            if(o.videoRanks&&o.videoRanks.length>0){
                                $.each(o.videoRanks,function(k,n){
                                    var name=n.resourceInfo.resourceName;
                                    var resourceId=n.resourceInfo.resourceId;
                                    var resourceAuthor=n.resourceInfo.resourceAuthor;
                                    var toUrl=n.resourceInfo.webStoragePath;
                                    var resourcePropertName=n.resourcePropertyInfo.propertName;//术士
                                    var company=n.activityRegisterInfo.customerCompany;
                                    if(n.activityRegisterInfo.customersocialTitle) {
                                        medical = comm.removeMedicalTitleNum(comm.cutDoctorTitle(n.activityRegisterInfo.customersocialTitle));
                                    }else{
                                        medical="";
                                    }
                                    var score=n.resultPublicity.score;//总分
                                    var preferUpNum=n.resultPublicity.preferUpNum;//赞
                                    if(comm.getLength(name)>75){
                                        name=comm.cutstr(name,75)+'...';
                                    }
                                    videoList+='<div class="casePK_text_all" toUrl="'+toUrl+'" resoureceType="video" resourceName="'+name+'" resourceId="'+resourceId+'">'+
                                    '<div class="casePK_text"><span>视频</span>'+name+'</div>'+
                                    '<div class="casePK_ul">'+
                                    '<ul>'+
                                    '<li class="chai_bg">'+resourceAuthor+'</li>'+
                                    '<li>'+medical+'</li>'+
                                    '<li class="di_bg">'+company+'</li>'+
                                    '<div class="clear"></div>'+
                                    '</ul>'+
                                    '</div>'+
                                    (resourcePropertName?'<div class="casePK_fot">术式：'+resourcePropertName+'</div>':'')+
                                    '<div class="casePK_fot_bg">'+
                                    '<div class="fot_bg_l">总分 <span>'+score+'</span></div>'+
                                    '<div class="fot_bg_r">赞 <span>'+preferUpNum+'</span></div>'+
                                    '</div>'+
                                    '</div>';
                                })
                            }
                            if(o.caseRanks&&o.caseRanks.length>0){
                                $.each(o.caseRanks,function(k,n){
                                    var name=n.resourceInfo.resourceName;
                                    var resourceId=n.resourceInfo.resourceId;
                                    var resourceAuthor=n.resourceInfo.resourceAuthor;
                                    var toUrl=n.resourceInfo.webStoragePath;
                                    var resourcePropertName=n.resourcePropertyInfo?n.resourcePropertyInfo.propertName:"";//术士
                                    var company=n.refCustomerInfo.customerCompany;
                                    if(n.activityRegisterInfo.customersocialTitle) {
                                        medical = comm.removeMedicalTitleNum(comm.cutDoctorTitle(n.activityRegisterInfo.customersocialTitle));
                                    }else{
                                        medical="";
                                    }
                                    var score=n.resultPublicity.score;//总分
                                    var preferUpNum=n.resultPublicity.preferUpNum;//赞
                                    if(comm.getLength(name)>75){
                                        name=comm.cutstr(name,75)+'...';
                                    }
                                    caseList+='<div class="casePK_text_all" toUrl="'+toUrl+'" resoureceType="case" resourceId="'+resourceId+'">'+
                                    '<div class="casePK_text"><span>病例</span>'+name+'</div>'+
                                    '<div class="casePK_ul">'+
                                    '<ul>'+
                                    '<li class="chai_bg">'+resourceAuthor+'</li>'+
                                    '<li>'+medical+'</li>'+
                                    '<li class="di_bg">'+company+'</li>'+
                                    '<div class="clear"></div>'+
                                    '</ul>'+
                                    '</div>'+
                                    (resourcePropertName?'<div class="casePK_fot">术式：'+resourcePropertName+'</div>':'')+
                                    '<div class="casePK_fot_bg">'+
                                    '<div class="fot_bg_l">总分 <span>'+score+'</span></div>'+
                                    '<div class="fot_bg_r">赞 <span>'+preferUpNum+'</span></div>'+
                                    '</div>'+
                                    '</div>';
                                })
                            }
                            if(videoList||caseList){
                                html2+='<div class="casePK_jiang"><img src="'+icon+'" alt=""/></div>'+videoList+caseList;
                            }

                        })
                        if(html2){
                            html+='<div class="casePK_mid" propertyId="'+propertyId+'"><a class="main_mid" propertyId="'+propertyId+'"></a><div class="casePK_mid_top">'+propertyName+'</div>'+html2+'<div class="casePK_blank" style="border-top:0;"></div></div>';
                        }
                        html3+='<li propertyId="'+propertyId+'"><a href="javascript:;" data-ajax="false"><div class="case_bg01">'+propertyName+'</div></a></li>';
                    });
                    html3+='<div class="clear"></div>';
                    $('.casePK_wu ul').html(html3);
                    $(".resultPublicity_EVList").html(html);
                    $(".casePK_text_all").on("vclick",function(event){
                        event.stopPropagation();
                        var toUrl=$(this).attr("toUrl");
                        if ($(this).attr("resoureceType")=="video") {//视频
                          g_sps.jump(null,toUrl);
                        }else{
                          g_sps.jump(null,toUrl);
                        }
                        return false;
                    })
                }
            }
        },
        error:function(){}
    });
    var titleH=$("#browser_title").outerHeight();
    var navH=$(".casePK_nav").outerHeight();
    $('.casePK_wu li').on("vclick",function(){
        scrollTop=0;
        propertyId=$(this).attr("propertyId");
        index=$(this).index();
        $('.casePK_wu li div').removeClass("case_bg02");
        $(this).find("div").addClass("case_bg02");

        scrollTop=$(".casePK_mid").eq(index).offset().top;
        if(scrollTop){
            setTimeout(function(){
                MoveTop(scrollTop-titleH-navH);
            },300);
            //$(document).scrollTop(scrollTop-titleH-navH);
        }
        return false;
    });
})
