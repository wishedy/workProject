/**
 * 功能描述：  他人主页公共方法
 * 使用方法:
 * 注意事件：
 * 引入来源：  作用：
 *
 * Created by LiChunHui on 2016/8/23.
 */
var othersData={};
var othersCommon={};
othersCommon={
    path:{
        customerInfo : M_CALL + "customer/unite/getMapById/", //客户信息
        getBigLogo:M_CALL + "comm/data/logourl/getMapById/",//获取头像
        praise : M_CALL + "customer/prefer/create/",//赞
        praiseCancel : M_CALL + "customer/prefer/delete/", //取消赞
        getShare:M_CALL+"comm/data/share/getMapList3/"//获取分享话术
    },
    config:{

    },
    init:function(){
        this.cid=comm.getparaNew().cid&&comm.getparaNew().cid.replace(/"/g,"");
        this.refId=TempCache.getItem("userId");//登录人id
        /*if(!this.refId){//未登录
            user.redirectLogin();
            return false;
        }*/
        this.digHole();
        this.getInitPage();
        this.scroll();
        this.getBigLogo();
        //粉丝，关注，收藏跳转
        $(".ev-fansUrl").attr("href","/pages/personal/others_sns.html?action=fans&cid="+this.cid);
        $(".ev-followUrl").attr("href","/pages/personal/others_sns.html?action=follow&cid="+this.cid);
        $(".ev-collectUrl").attr("href","/pages/personal/personal_collection.html?cid="+this.cid);
        $(".ev-activeHref").attr("href","/pages/personal/others_index.html?cid="+this.cid);
        $(".ev-contributeHref").attr("href","/pages/personal/others_contribution.html?cid="+this.cid);
        $(".ev-infoHref").attr("href","/pages/personal/others_baseInfo.html?cid="+this.cid);

    },
    //埋点
    digHole:function(){
        $('.al-othersBackToIndex').click(function(){
            comm.creatEvent({
                triggerType:'全站功能按钮点击',
                keyword:"返回",
                actionId:41,
                async:false
            });
        });
    },
    //查看大图
    getBigLogo:function(){
        var t=this;
        $(".al-personalImg").on("click",function(){

            if($('.al-personalHeadImgWatcher').hasClass('getBigLogoEnd')){
                if(!$('.al-personalHeadImgWatcher').hasClass('noBigLogo')){
                    $('.al-personalHeadImgWatcher').addClass('show');
                }
            }else{
                _getBigLogo();
            }
            $('.al-personalHeadImgWatcher').on("click",function(){
                $(this).removeClass('show');
            })
        });
        function _getBigLogo(){
            var data={};
            data.refId=t.cid;
            data.logoType=10;
            data.logoUseFlag=2;
            data.visitSiteId=2;
            var param={};
            param.paramJson= $.toJSON(data);
            $.ajax({
                type : "post",
                url : t.path.getBigLogo,
                data : param,
                dataType : "json",
                success : function(rep){
                    $('.al-personalHeadImgWatcher').addClass('getBigLogoEnd');
                    if(rep&&rep.responseObject.responseData&&rep.responseObject.responseData.data_list){
                        var data=rep.responseObject.responseData.data_list[0];
                        $(".ev-bigLogo").attr("src",data.logoUrl);
                        $('.al-personalHeadImgWatcher').addClass('show');
                    }else{
                        $('.al-personalHeadImgWatcher').addClass('noBigLogo');
                    }
                },
                error:function(){}
            });
        }

    },
    //初始化个人信息
    getInitPage:function(){
        comm.loading.show();
        var t=this;
        var data={};

        $.ajax({
            type : "post",
            url : t.path.customerInfo,
            data : {paramJson: $.toJSON({customerId: t.cid,"logoUseFlag": UseFlag.d})},
            dataType : "json",
            async:false,
            success : function(rep){
                comm.loading.hide();
                if(rep&&rep.responseObject.responseData&&rep.responseObject.responseData.data_list){
                    if(rep.responseObject.responseData.data_list.length>0){
                        t.responseData=rep.responseObject.responseData.data_list[0];
                        othersData=t.responseData;
                        var unit=t.responseData.customer_unite;
                        var baseInfo=t.responseData.customer_baseinfo;
                        var auth=t.responseData.customer_auth;
                        var csc=t.responseData.customer_statistic;
                        var att=t.responseData.customer_att;
                        var cfollow= t.responseData.customer_follow_people;
                        //判断头像
                        var logoUrl = "<img src=\"//img50.allinmd.cn/pages/personal/no_head.png\">";
                        if(att.logoUrl !== "") logoUrl = att.logoUrl;
                        $(".ev-logoUrl").html("<img src=\""+logoUrl+"\"/>");
                        if(auth.state==-1 || auth.state == 3 ||auth.state ==0 ||auth.state ==1){//未认证
                            var nickname = auth.lastName+auth.firstName||baseInfo.nickname;
                            if(nickname ==="") nickname = comm.getRegisterName(unit.email,unit.mobile);;
                            $(".ev-name").text(nickname);
                            document.title = '［'+nickname+'］的学术专栏－唯医,allinmd';
                            //追加SEO变更
                            $('[name=description]').attr('content','［'+nickname+'］的学术专栏－唯医,allinmd');
                            $('[name=keywords]').attr('content','［'+nickname+'］，学术专栏，医学专栏，医师主页，医生专栏，医生交流，关注医师，唯医,allinmd');

                            $(".ev-companymedical").html('<button class="btn-deepMsg">用户尚未认证</button>');
                            $(".al-personalShare").hide();
                        }else{
                            var name=auth.lastName+auth.firstName;
                            document.title = '［'+name+'］的学术专栏－唯医,allinmd';
                            //追加SEO变更
                            $('[name=description]').attr('content','［'+name+'］的学术专栏－唯医,allinmd');
                            $('[name=keywords]').attr('content','［'+name+'］，学术专栏，医学专栏，医师主页，医生专栏，医生交流，关注医师，唯医,allinmd');

                            $(".ev-name").text(name);
                            $(".ev-name").eq(0).parent().addClass("al-vipUser");
                            var medicalTitleHtml="";companyHtml="";
                            if(auth.medicalTitleShow){
                                medicalTitleHtml='<button class="btn-deepMsg">'+auth.medicalTitleShow+'</button> ';
                            }
                            if(auth.workplace){
                                companyHtml='<button class="btn-deepMsg">'+auth.workplace+'</button>';
                            }
                            $(".ev-companymedical").html(medicalTitleHtml+companyHtml);
                        }
                        $(".ev-fansNum").attr("num",csc.fansNum).text(csc.fansNum.toW());
                        $(".ev-followNum").attr("num",csc.followpeopleNum).text(csc.followpeopleNum.toW());
                        $(".ev-upNum").attr("num",csc.othersUpNum).text(csc.othersUpNum);
                        $(".ev-collectionNum").text(csc.collectionNum.toW());
                        if(location.href.indexOf('others_contribution')>-1){//他人贡献页
                            $('[data-ev=all]').show(); //全部
                            if (csc.caseNum > 0) { $("[data-ev=case]").show(); }
                            if (csc.topicNum > 0) { $("[data-ev=topic]").show(); }
                            if (csc.videoNum > 0) { $("[data-ev=video]").show(); }
                            if (csc.docNum > 0) { $("[data-ev=doc]").show(); }
                        }
                        //关注
                        $(".ev-followBtn").follow({
                            fStatus:cfollow.relationship,
                            fId:baseInfo.customerId?baseInfo.customerId:"",
                            picStyle:2,
                            needSure:1,
                            canToggle:true,
                            addSuccess:function(){
                                $(".ev-addSuccess").show();
                                setTimeout(function(){
                                    $(".ev-addSuccess").hide();
                                },2000);
                            }
                        });
                        //赞
                        t.addPraise();
                        //分享
                        //获取分享话术
                        var data={};
                        data.customerId=t.cid||'';
                        data.logoUseFlag=4;
                        data.pageIndex=1;
                        data.pageSize=1;
                        data.useFlag=1;
                        data.sceneType=getShareContentSense.others_index;
                        data.resourceType=ResouceType.person;
                        var param={};
                        param.paramJson= $.toJSON(data);
                        var shareObj={}
                        shareAll({
                            qShareLog:function(x){    //分享新浪，空间成功与否都执行
                                if(x=='sina'){
                                    comm.shareLog({
                                        shareType: "",
                                        resourceId:"" ,
                                        resourceType: "",
                                        refId: "",
                                        isValid: 1,
                                        shareSence:shareSence,
                                        shareChannel:3,
                                        shareContent:shareObj.sinaTitle
                                    });
                                }else{
                                    comm.shareLog({
                                        shareType: "",
                                        resourceId:"" ,
                                        resourceType: "",
                                        refId: "",
                                        isValid: 1,
                                        shareSence:shareSence,
                                        shareChannel:1,
                                        shareContent:shareObj.qZoneTitle
                                    });
                                }
                            },
                            fnMessageSuc:function(){//微信好友
                                comm.shareLog({
                                    shareType: "",
                                    resourceId:"" ,
                                    resourceType: "",
                                    refId: "",
                                    isValid: 1,
                                    shareSence:shareSence,
                                    shareChannel:4,
                                    shareContent:shareObj.wxTitle
                                });
                            },      //分享好友成功回调
                            fnTimelineSuc:function(){//朋友圈
                                comm.shareLog({
                                    shareType: "",
                                    resourceId:"" ,
                                    resourceType: "",
                                    refId: "",
                                    isValid: 1,
                                    shareSence:shareSence,
                                    shareChannel:5,
                                    shareContent:shareObj.timeLineTitle
                                });
                            },      //分享朋友圈成功回调
                            triggerRequest:function(){
                                $.ajax({
                                    type : "post",
                                    url : t.path.getShare,
                                    data : param,
                                    async:false,
                                    dataType : "json",
                                    success : function(rep){
                                        shareSence=shareSenceConst.others_index;
                                        if(rep&&rep.responseObject.responseStatus){
                                            var shareJson=rep.responseObject.responseData.data_list[0];
                                            shareObj.pic = shareJson.share_comm.shareImageUrl;
                                            shareObj.title=shareJson.share_comm.shareTitle!=""?shareJson.share_comm.shareTitle:document.title;
                                            $.each(shareJson.share_channel,function(i,el){
                                                if(el.shareChannel=='Sina'){
                                                    shareObj.sinaTitle=el.shareDesc;
                                                }else if(el.shareChannel=="WechatFriend"){
                                                    shareObj.wxTitle = el.shareTitle;
                                                    shareObj.wxDesc = el.shareDesc.substring(0,60);
                                                }else if(el.shareChannel=="QZone"){
                                                    shareObj.qZoneTitle=el.shareTitle;
                                                    shareObj.qZoneSummary = el.shareDesc;
                                                }else if(el.shareChannel=="WechatTimeline"){
                                                    shareObj.timeLineTitle=el.shareTitle;
                                                }
                                            });
                                        }else{
                                            var shareSummary=comm.cutLine(auth.medicalTitle,"_",",")+auth.workplace+(baseInfo.summary?"个人简介："+baseInfo.summary:'').substring(0,60);
                                            shareObj.pic = logoUrl;
                                            shareObj.title = '推荐'+$(".ev-name").text()+'的唯医个人主页';
                                            shareObj.wxTitle = '推荐'+$(".ev-name").text()+'老师的唯医个人主页，关注可方便查看他的个人动态';
                                            shareObj.wxDesc = shareSummary;
                                            shareObj.sinaTitle = '分享'+$(".ev-name").text()+'的唯个人主页，欢迎与我沟通交流，点击关注';
                                        }

                                    },
                                    error:function(){}
                                });
                                return shareObj;
                            }
                        },false,$('.al-personalShare'));

                    }
                }
            },
            error:function(){}
        });
    },
    //点击赞
    addPraise:function(){
        var t=this;
        var prefer = t.responseData.customer_prefer;
        var csc=t.responseData.customer_statistic;
        var auth = TempCache.getItem('auth'),
            state;
        if(auth){
            state = JSON.parse(auth).state;
        }
        $("#ev-praise").on("click",function(){
            if(state==2||state==7||state==8||state==9){
				//判断是否赞过，未赞过 则赞
				if(!prefer.isValid){ //未赞过发送赞请求并＋1
					var praiseNum = parseInt(csc.othersUpNum);
					$(".ev-upNum").text(praiseNum+1);
					var params = {};
					params.paramJson = $.toJSON({
						"customerId": t.refId,
						"usefulType":9,
						"upDownType":1,
						"refId": t.cid
					});
					$.ajax({
						url : t.path.praise,
						type : "POST",
						data : params
					});
					prefer.isValid=1;
				}else{ //赞过取消点赞
					var praiseNum = parseInt($(".ev-upNum").text());
					$(".ev-upNum").text(praiseNum-1>0?praiseNum-1:0);
					var params = {};
					params.paramJson = $.toJSON({
						"customerId": t.refId,
						"usefulType":9,
						"upDownType":2,
						"refId": t.cid
					});
					$.ajax({
						url : t.path.praiseCancel,
						type : "POST",
						data : params
					});
					prefer.isValid=0;
				}
            }else{
                user.privExecute({
                    operateType:'auth',
                    callback:function(){},
                    noNeedBack:true
                });
            }
            
        })
    },

    scroll:function(){
        //页面滚动封面收起
        var headHeight = $(".al-personalHead").height();
        var navbarTop = $(".al-personalNavbar").height();
        var scrollHeadHeight = $(".al-personalScrollHead").height();
        $(window).on("scroll", function() {
            if (headHeight < $(this).scrollTop()) {
                $(".al-personalHead").hide();
                $(".al-personalScrollHead").addClass('al-personalHeadFixed');
                $(".al-personalNavbar").addClass('al-personalNavbarFixed');
                $(".al-mainInner").css("paddingTop", navbarTop  + headHeight);
            } else {
                $(".al-personalHead").show();
                $(".al-personalScrollHead").removeClass('al-personalHeadFixed');
                $(".al-personalNavbar").removeClass('al-personalNavbarFixed');
                $(".al-mainInner").css("paddingTop", "0");
            }
        });
        if ($(".al-contentPartModule").length === 0) {
            $('.al-personalContributionNone').show();
        }
    }
};
$(function(){
    var cid=comm.getparaNew().cid;
    var amChannel = comm.getpara()._amChannel;
    var callAppOptions = {
        ios: "allinmdios://app.allinmd.cn/applinks.html?scene=terminalPage&index=0&sourceId=" + cid +(amChannel?"&_amChannel="+amChannel:''),
        android: "allin://com.allin.social:75235?data={scene:3,type:0,sourceId:"+  cid + (amChannel?",_amChannel:"+amChannel:'')+ "}",
        ios9: "http://app.allinmd.cn/applinks.html?scene=terminalPage&index=0&sourceId=" + cid +(amChannel?"&_amChannel="+amChannel:''),
        runAtOnce: false
    };
    comm.appWakeUp("figure",callAppOptions);//下载app层
    othersCommon.init();

});

