/**
 * Created by ALLIN on 2016/9/7.
 */
/**
 * 功能描述：videoPK-个人作品列表及分享
 * 使用方法:
 * 注意事件：
 * 引入来源： module.videoPKShare 作用：
 * created by Sunhaibin on 2015-11-20
 * */
function videoPK_personal_center(){
    var vPK_mywork={
        config:{
            left:($(window).width()-713)/2,
            top:$(document).scrollTop()+100,
            $showArea:$('.works_mine_lists'),
            url:PC_CALL+"customer/trends/json_list/",
            pageIndex:1,
            pageSize:50,
            attUseFlag:AttUseFlag.c,
            logoUseFlag:3,
            dataFlag:4,
            customerId:$("#sesCustomerId").val(),
            sessionCustomerId:$("#sesCustomerId").val(),
            activityId:$("#activityId").val(),
            width:100,
            height:100
        },
        init:function(){
            var t=this;
            var o =t.config;
            t.ajaxFn({
                url:o.url,
                param:{
                    pageIndex:o.pageIndex,
                    pageSize:o.pageSize,
                    attUseFlag:o.attUseFlag,
                    logoUseFlag:o.attUseFlag,
                    dataFlag:o.dataFlag,
                    customerId:o.customerId,
                    sessionCustomerId:o.sessionCustomerId,
                    activityId:o.activityId
                },
                fn:function(data){
                    t.addHtml(data);
                }

            })
            t.shareQQ();
            t.shareQzone();
        },
        ajaxFn:function(opt){
            comm.LightBox.showloading();
            var o=opt;
            $.ajax({
                url:o.url,
                type:'post',
                data:{paramJson:$.toJSON(o.param)},
                dataType:'json',
                success:function(data){
                    comm.LightBox.hideloading();
                    if(data) o.fn(data);
                }
            })
        },
        addHtml:function(data){
            var t =this;
            var content="";
            if(data&&data.responseObject.responseData){
                var dataItem=data.responseObject.responseData.data_list;
                if(dataItem&&dataItem.length>0){//存在数据
                    $(".works_mine_lists_top span").text("（"+dataItem.length+"）");
                    for(var i=0,l=dataItem.length;i<l;i++){
                        var item = dataItem[i],
                            state = item.approvalStatus,
                            hide="style='display:none;'",
                            finalScore = item.score,		//得分
                            authName=item.customer_auth.lastName+item.customer_auth.firstName,	//作者名称
                            auth_report="",					//审核状态
                            shareBtns="",					//分享按钮
                            playTime='',					//播放时间及背景
                            imgUrl='/images/img00/column/videoPK_v2/video.png',						//图片链接
                            deadLink="javascript:;",		//无效链接
                            shareBtn_suc = '<li>'+
                                '<span style="margin-right:0;">分享至：</span>'+
                                '<span class="works_mine_lists_shareQQ shareQQ"><a href="javascript:;"><img src="//img00.allinmd.cn/column/videoPK_v2/myworks_QQ.png" alt=""></a></span>'+
                                '<span class="works_mine_lists_shareWeiXin shareWx"><a href="javascript:;"><img src="//img00.allinmd.cn/column/videoPK_v2/myworks_WeiXin.png" alt=""></a><img src="//img00.allinmd.cn/column/videoPK_v2/2D_saomiao.png" class="d2_saomiao"></span>'+
                                '<span class="works_mine_lists_shareQQKongJian shareQzone"><a href="javascript:;"><img src="//img00.allinmd.cn/column/videoPK_v2/myworks_quan.png" alt=""></a></span>'+
                                '<div style="clear: both;"></div>'+
                                '</li>',
                            auth_report_ing="<div class='audit_wait'>待审核</div>",
                            auth_report_suc=$('#activityId').attr('isReviewBegin')==1?"<div class='audit_finish'>报名已结束，评审正在紧张进行中，请关注初选结果...</div>":"<div class='audit_yes'>审核已通过</div>",
                            auth_report_fail="<div class='audit_no'>未达到参赛标准<span class='no_reason'>拒绝原因： "+(jQuery.isEmptyObject(item.approvalReason)?'':item.approvalReason.substring(0,31))+"</span></div>";

                        //判断是视频还是病例，如果是视频：
                        //1 :有播放时间playTime，2:获取视频图片，3:如果状态为有效则有链接，有分享、判断审核状态
                        if(item.customer_trends_type&&item.customer_trends_type===1){

                            //1.有无播放时间
                            playTime="<span>"+(item.resource_valid.playTime==undefined?'00:00:00':item.resource_valid.playTime)+"</span>";
                            //2:获取视频图片
                            if(item.cms_video_attachment){												// 	视频图片是否存在
                                for(var k=0,len=item.cms_video_attachment.length;k<len;k++){
                                    if(item.cms_video_attachment[k].videoAttUrl&&item.cms_video_attachment[k].videoAttUrl!=""){			//视频图片存在&&不为空
                                        imgUrl = item.cms_video_attachment[k].videoAttUrl;				//imgUrl = 视频图片
                                        break;
                                    }
                                }
                            }
                            //3:如果状态为有效则有链接，有分享、判断审核状态
                            //4期新加，如果activityId的属性isResultShowBegin存在，则显示分数
                            if(item.customer_trends.isValid===1){										//视频有效
                                deadLink=item.customer_trends.headerUrl;
                                shareBtns=shareBtn_suc;
                                //1-提交审核、2-审核通过，4-审核拒绝'
                                if($('#activityId').attr('isResultShowBegin')||$('#activityId').attr('isReviewBegin')==1){
                                    /**审核通过显示评分，拒绝显示拒绝*/
                                    switch(state){
                                        case 4:
                                            auth_report =auth_report_fail;
                                            break;
                                        case 2:
                                            auth_report=(finalScore>0?'<div class="totleScore"><i>总分：</i><span>'+finalScore+'</span></div>':auth_report_suc);
                                            break;
                                        default:
                                            auth_report =auth_report_ing;
                                    }
                                }else{
                                    switch(state){
                                        case 4:
                                            auth_report =auth_report_fail;
                                            break;
                                        case 2:
                                            auth_report =auth_report_suc;
                                            break;
                                        default:
                                            auth_report =auth_report_ing;
                                    }
                                }

                            }else{
                                //1-提交审核、2-审核通过，4-审核拒绝'
                                switch(state){
                                    case 4:
                                        auth_report =auth_report_fail;
                                        break;
                                    case 2:
                                        auth_report =auth_report_suc;
                                        break;
                                    default:
                                        auth_report =auth_report_ing;
                                }
                            }
                        }
                        //添加dom
                        content += "<div class='works_mine_lists_piece' "+(state==1&&$('#activityId').attr('isReviewBegin')==1?hide:"")+">"+
                                        "<div class='works_mine_lists_piece_left'>"+
                                            "<a target='_blank' href='"+deadLink+"' class='authNameBox'><h3 authName='"+authName+"'>"+comm.getStrLen(item.customer_trends.resourceName,50)+"</h3></a>"+
                                            "<p class='authCont'>"+(item.customer_trends.trendContent!="该用户发言已被管理员屏蔽！"?comm.getStrLen(item.customer_trends.trendContent,150):"已被管理员屏蔽！")+"</p>"+
                                            "<ul>"+
                                            "<li>"+(item.resource_valid.browseNum==undefined?0:item.resource_valid.browseNum)+"</li>"+
                                            "<li>"+(item.customer_trends.reviewNum==undefined?0:item.customer_trends.reviewNum)+"</li>"+
                                            "<li>"+(item.customer_trends.upNum==undefined?0:item.customer_trends.upNum)+"</li>"+
                                            shareBtns+
                                            "<li style='float:right;margin-right:0;'>"+item.customer_trends.opDate.substring(0,10)+"</li>"+
                                            "<div style='clear: both;'></div>"+
                                            "</ul>"+
                                            auth_report+
                                        "</div>"+
                                        "<div class='works_mine_lists_piece_right'>"+
                                            "<a target='_blank' href='"+deadLink+"'><img src='"+imgUrl+"' class='tupian'></a>"+
                                            playTime+
                                            '<img class="video_btn" src="/images/img10/v3/common/icon/video_btn.png">'+
                                        "</div>"+
                                        "<div style='clear: both;'></div>"+
                                    "</div>"
                    }
                    $(".works_mine_content").show();//外层的大div显示，html中隐藏了
                    $(".works_center_main").eq(0).hide();
                    $(".works_center_main").eq(1).show();
                    t.config.$showArea.html(content);
                    t.shareWeiXin();
                    $(".works_mine_lists img").lazyload({effect:"fadeIn",event:"scrollstop"});
                }else{//不存在数据
                    $(".works_mine_content").eq(0).show();
                    $(".works_center_main").eq(0).show();
                    $('.no_up_reg').eq(0).show();
                    if($('#activityId').attr('isResultShowBegin')){//如果结果公示开始//0:未知错误 1:结果公示中 -1:过期
                        //$('.no_up_reg').eq(0).find('p').text('活动已结束，一大波获奖作品已经袭来').css('width','350px');
                        //$('#tanchu_login')
                        //    .css({'background':'url("//img00.allinmd.cn/column/videoPK/gr_upl04.png") no-repeat'})
                        //    .off('click')
                        //    .attr('href',"/v2/pages/column/videoPK/pk4_results.html");
                    }else{
                        //如果（评分开始）//1:开始 -1:未开始，//或如果上传截止//0:未知错误 1:未截止 -1:截止
                        if($('#activityId').attr('isReviewBegin')==1||$('#activityId').attr('isSignUpOver')==-1){
                            $('.no_up_reg').eq(0).find('p').text('报名已结束，评审正在紧张进行中，请关注初选结果...');
                            $('#works_gr_upload_now').text('查看参选作品').attr('href',"/html/activity/"+$('#activityId').val()+"/personal_works.html?activityId="+$('#activityId').val());
                        }else{
                            $('.no_up_reg').eq(0).find('p').text('你还没有上传过作品！');
                            $('#works_gr_upload_now').text('立即上传');
                            module.videoCasePk2({
                                enrollBtn:$("#works_gr_upload_now"),
                                toTop:1,
                                top: 100,
                                left: t.config.left,
                                activityId: t.config.activityId,
                                needGoDetail:1,//需要跳终端
                                enrollCallBack:function(){//报名成功后回调
                                    $(".nav_apply a").text("立即上传");
                                },
                                publishBack:function(){
                                    t.init();
                                },
                                videoPKList:function(){
                                    t.init();
                                }
                            });
                        }
                    }

                }
            }
            //兼容ie和360浏览器
            var noUpW = -$(".no_up_center").width()/2,
                noUpH = -$(".no_up_center").height()/2,
                noRegW = -$(".no_reg_center").width()/2,
                noRegH = -$(".no_reg_center").height()/2;
            $(".no_up_center").css({
                "margin-left":noUpW,
                "margin-top":noUpH
            })
            $(".no_reg_center").css({
                "margin-left":noRegW,
                "margin-top":noRegH
            })
        },
        shareQQ:function(){
            var t = this;
            $(".works_center_main").on('click','.shareQQ',function(e){
                var $this =  $(this).parents('.works_mine_lists_piece');
                var imgSource =$this.find('.tupian').eq(0).attr('src');
                var url=encodeURIComponent($this.find('.authNameBox').attr("href")),
                    t=encodeURIComponent($this.find('h3').text()),
                    pSrc=encodeURIComponent(imgSource),
                    openurl = 'http://connect.qq.com/widget/shareqq/index.html?',
                    desc = encodeURIComponent("我参与了《第二届骨科规范化手术视频征集评选》，快来为我点赞加油吧！");

                var alink = openurl+"url=https:"+url+"&pics="+pSrc+"&title="+t+"&summary="+desc;
                g_sps.jump(null,alink,true);
                return false;
            })
        },
        shareQzone:function(){
            var t = this;
            $(".works_center_main").on('click','.shareQzone',function(e){
                var $this =  $(this).parents('.works_mine_lists_piece');
                var imgSource =$this.find('.tupian').eq(0).attr('src');
                var t=encodeURIComponent($this.find('h3').text()),
                    pSrc=encodeURIComponent(imgSource),
                    url=encodeURIComponent($this.find('.authNameBox').attr("href")),
                    desc =encodeURIComponent("我参与了《第二届骨科规范化手术视频征集评选》，快来为我点赞加油吧！"),
                    openurl="http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?";
                var aLink = openurl+"url=https:"+url+"&summary="+desc+"&pics="+pSrc+"&title="+t;
                window.open(aLink,'_blank');
                return false;
            })
        },
        shareWeiXin:function(){
            var t = this;
            $(".works_mine_lists_shareWeiXin").mouseenter(function(){
                $(this).children(".d2_saomiao").show()
            })
            $(".works_mine_lists_shareWeiXin").mouseleave(function(){
                $(this).children(".d2_saomiao").hide()
            })
        }
    };

    if($("#sesCustomerId").val()){//已登录
        if($("#activityId").attr("expert")==1){//专家
            vPKCheck();
        }else{//唯医会员，普通用户
            vPK_mywork.init();
        }
    }else{//未登录
        $(".works_mine_content").show();
        $(".works_center_main").eq(0).show();
        $(".no_up_reg").eq(1).show();
        //兼容ie和360浏览器
        var noUpW = -$(".no_up_center").width()/2,
            noUpH = -$(".no_up_center").height()/2,
            noRegW = -$(".no_reg_center").width()/2,
            noRegH = -$(".no_reg_center").height()/2;
        $(".no_up_center").css({
            "margin-left":noUpW,
            "margin-top":noUpH
        })
        $(".no_reg_center").css({
            "margin-left":noRegW,
            "margin-top":noRegH
        })
        $("#tanchu_login").on("click",function(){
            user.login({
                callback:function(){
                    g_sps.jump(null,location.href);
                },
                scene:privilegeSceneConst.eSceneTypeFellow
            });
        });
    }

}
$(function(){
    //comm.Log.createBrowse({href:location.href,id:82,name:'活动-我的作品'});
    videoPK_personal_center();
})
scene.TopHeadLoginCallback=function(){g_sps.jump(null,location.href);}
