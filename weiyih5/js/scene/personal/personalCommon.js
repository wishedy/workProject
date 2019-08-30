/**
 * 功能描述：   个人中心公共方法
 * 使用方法:
 * 注意事件：
 * 引入来源：  作用：
 *
 * Created by LiChunHui on 2016/8/13.
 */
var responseData=null;//存放个人信息
var personalCommon={
    path:{
        getSpecialCount:M_CALL + "customer/message/getSpecialCount/",//获取粉丝，赞的数量
        getBigLogo:M_CALL + "comm/data/logourl/getMapById/",//获取头像
        customerInfo : M_CALL + "customer/unite/getMapById/", //客户信息
        logoUpload:M_CALL+"comm/upload_attachment/upload/",//上传图片
        getShare:M_CALL+"comm/data/share/getMapList3/"//获取分享话术
    },
    init:function(){
        this.cid=TempCache.getItem("userId");
        comm.loading.show();

        if(TempCache.getItem('userId')){//已登录
            $(".al-personalContent").removeClass("al-personalNoLogin");
            $(".ev-hasLogin").show();
            this.getInitPage();
            this.getBigLogo();
            this.updataLogo();
            this.uploadStar();//两个弹框，一个是提示，一个是等级提示
            if(TempCache.getItem('customerRole')==2||TempCache.getItem('customerRole')==3||TempCache.getItem('customerRole')==4){
                $('.al-personalShare').hide();
            }
            //埋点
            $('.icon-history').parent().on('click',function(){
                comm.creatEvent({
                    triggerType:'浏览记录',
                    keyword:"浏览记录",
                    actionId:39,
                    async:false
                });
            });
            $('.ev-draftIcon').off('click').on('click',function(){
                var cid=TempCache.getItem("userId");
                var amChannel = comm.getpara()._amChannel;
                comm.newReleaseBox({
                    imgPath:"/images/img50/case/release.png",
                    title:"编辑草稿需使用唯医骨科App",
                    solidBtnTitile:"立即使用",
                    authNoneTitle:"暂不使用",
                    data:{
                        el: ".solidBtn",
                        ios: "allinmdios://app.allinmd.cn/applinks.html?scene=11&type=52" +(amChannel?"&_amChannel="+amChannel:''),
                        ios9: "http://app.allinmd.cn/applinks.html?scene=11&type=52" +(amChannel?"&_amChannel="+amChannel:''),
                        android: "allin://com.allin.social:75235?data={scene:2,type:52"+ (amChannel?",_amChannel:"+amChannel:'')+ "}",
                    }
                });
            });
        }else{
            $(".al-personalContent a").attr("href","javascript:;");
            $('.al-personalShare').hide();
            setTimeout(function(){
                comm.loading.hide();
            },1000);
            $(".ev-noLogin").show();
            $(".al-personalGoLogin").on("click",function(){//点击跳转到登录页
                comm.creatEvent({
                    triggerType:'登录',
                    keyword:"去登录按钮(个人中心)",
                    actionId:17
                });
                TempCache.removeItem('needAuthRegist');
                user.redirectToLogin();
            })
        }
    },
	getAuthProcess:function(){
		var t=this;
		var authing =false;
		$.ajax({
			url:M_CALL+"customer/revise/auth/getMapList/",
			type:"post",
			data:{paramJson:$.toJSON({customerId:TempCache.getItem('userId')})},
			dataType:'json',
            async:false,
			success:function(res){
				if(res&&res.responseObject&&res.responseObject.responseData&&!$.isEmptyObject(res.responseObject.responseData)){
					authing = true;
				}
			}
		});
		return authing;
	},
    //初始化个人信息
    getInitPage:function(){
        var t=this;
        var data={};

        $.ajax({
            type : "post",
            url : t.path.customerInfo,
            data : {paramJson: $.toJSON({customerId: t.cid,"logoUseFlag": UseFlag.d})},
            dataType : "json",
            async:false,
            success : function(rep){
                setTimeout(function(){
                    comm.loading.hide();
                },1500);
                if(comm.hasResponseData(rep)&&rep.responseObject.responseData.data_list){
                    if(rep.responseObject.responseData.data_list.length>0){
                        responseData=rep.responseObject.responseData.data_list[0];
                        var unit=responseData.customer_unite;
                        var baseInfo=responseData.customer_baseinfo;
                        var auth=responseData.customer_auth;
                        var csc=responseData.customer_statistic;
                        var att=responseData.customer_att;
                        var authFlag = responseData.authFlag;
                        if(!TempCache.getItem("passwd")){
                            TempCache.setItem("passwd",unit.passwd);
                        }
                        if(unit.isValid==0 || (unit.passwd&&(unit.passwd!=TempCache.getItem("passwd")))){//TODO:无效用户以及其他端修改密码后本地需要退出登录
                            $.ajax({
                                url:M_CALL+"/web/user/logout/",
                                data:null,
                                dataType:'json',
                                type:'post',
                                async:false,
                                success:function(){
                                    comm.loading.hide();
                                    TempCache.clear();
                                    comm.redirect("/pages/passport/loginV2/login.html");
                                }
                            });
                        }
                        //判断头像
                        var logoUrl = "<img src=\"//img50.allinmd.cn/pages/personal/no_head.png\">";
                        if(att.logoUrl !== "") logoUrl = att.logoUrl;
                        $(".ev-logoUrl").html("<img src=\""+logoUrl+"\"/>");

                        //判断当前认证状态展示对应提示   456 改 789
                        var html = "",status = "";
                        var _role = TempCache.getItem('customerRole');
                        if(_role!=2&&_role!=3&&_role!=4){
                            switch (auth.state){
                                
                                case 2:
                                    var changeAuthing = t.getAuthProcess();//是否在认证变更中，
                                    if(changeAuthing){
										if(authFlag==1){    //变更中，并且四证已全
											html = '<aside class="uploadStar authTip"><span style="border-left:none;">执业医师审核将在3个工作日内完成，请耐心等待</span></aside>';
										}else{
											html = '<aside class="uploadStar authTip"><span style="border-left:none;">审核将在1个工作日内完成，请耐心等待</span></aside>';
										}
                                    }else{
										html = '<aside class="uploadStar"><i></i><b></b><span style="width: 72%;">上传4个标星证件，认证成为唯医执业医师拥有在唯医骨科进行执业诊疗的权限</span><a href="/pages/passport/auth/authInfo.html"><p></p></a></aside>';
									}
                                    
                                    status = "al-vipUserV1";
                                    break;
                                case 3://拒绝
                                    html = '<aside class="authTip"><p><i></i>认证未通过审核，请重新认证</p><a class="ev_goAuthTrack" href="/pages/passport/auth/auth.html">去认证</a></aside>';
                                    $('.ev-name').hide();
                                    break;
                                case -1: //未认证
                                    html = '<aside class="authTip"><p>认证后可使用唯医全部功能</p><a class="ev_goAuthTrack"  href="/pages/passport/auth/auth.html">去认证</a></aside>';
                                    $('.ev-name').hide();
                                    break;
                                case 9://二次认证  4  5
                                    html = '<aside class="uploadStar authTip"><i></i><b></b><span>V2认证未通过审核，请重新认证</span><a class="ev_goAuthTrack"  href="/pages/passport/auth/auth.html">去认证</a></aside>';
                                    status = "al-vipUserV1";
                                    break;
                                case 8:
                                    status = "al-vipUserV2";  //V2显示
                                    break;
                                case 0:
								case 1:
                                    html = '<aside class="uploadStar authTip"><span style="margin-left: 0.4rem;border-left:none;">审核将在1个工作日内完成，请耐心等待</span></aside>';
                                    break;
                                case 7:
                                    html = '<aside class="uploadStar authTip"><span style="border-left:none;">执业医师审核将在3个工作日内完成，请耐心等待</span></aside>';
                                    status = "al-vipUserV1";
                                    break;
                                //审核中
                            }
                        }else{
                            switch (auth.state){
                                case 2:
                                case 9:
                                case 8:
                                case 7:
                                    status = "al-vipUser";
                                    break;
                                case 3://拒绝
                                case -1:
                                case 1:
                                    $('.ev-name').hide();
                                    break;
								// case 1:break;
                            }
                            $('.ev_reAuthTrack').remove();
                        }
                        $('.al-personalHead').after(html);
                        $(".ev-name").parent().addClass(status);  //显示认证状态是V1还是V2
                        $('.ev_goAuthTrack').click(function(){
                            comm.creatEvent({
                                triggerType:'去认证',
                                keyword:'去认证',
                                actionId:23
                            });
                        });
                        $('.ev_reAuthTrack').click(function(){
                            comm.creatEvent({
                                triggerType:'认证资料申请变更',
                                keyword:'认证资料申请变更',
                                actionId:2518
                            });
                        });
                        //判断是否是首次进入，首次进入展示等级
                        var isFirstTimeAuth =TempCache.getItem("firstTimeAuth");
                        var showVip = function(){
							var str = '<section class="serviceTime ev_vipIntro">\n' +
							'        <aside class="serviceTimeCont">\n' +
							'            <p class="close"><img src="//img50.allinmd.cn/authentication/auth/close_grey.png"></p>\n' +
							'            <p class="title">认证权益 </p>\n' +
							'            <P class="authGrade">认证后可在唯医、医鼎、医栈、唯医骨科拥有相应权限。根据认证资料完整度，认证分为两个等级：</P>\n' +
							'            <figure class="physicianVip">\n' +
							'                <p class="titleVip1"><i></i>认证医师<span class="smallTip">上传任1资质证明</span></p>\n' +
							'                <p class="physicianText">\n' +
							'                    <span></span>\n' +
							'                    <span>在唯医、医鼎、医栈的医师操作权限</span>\n' +
							'                </p>\n' +
							'            </figure>\n' +
							'            <figure class="physicianVip">\n' +
							'                <p class="titleVip2"><i></i>执业医师<span class="smallTip">上传4个标星证件</span></p>\n' +
							'                <p class="physicianText">\n' +
							'                    <span></span>\n' +
							'                    <span style="display:inline-block;width:7.5rem;">拥有V1权限的同时，还具有在唯医骨科进行执业诊疗的权限</span>\n' +
							'                </p>\n' +
							'            </figure>\n' +
							'        </aside>\n' +
							'    </section>'
                            if($('.ev-mainInner').find('.ev_vipIntro').length==0){
                                $('.ev-mainInner').append(str);
                            }
                            comm.creatEvent({
                                triggerType:'认证-等级规则',
                                keyword:'认证-等级规则',
                                actionId:2517
                            });
                            TempCache.removeItem('firstTimeAuth');
                            TempCache.setItem('oldAuthVipShow','oldAuthVipShow');
                        };

                        if(isFirstTimeAuth == 'firstTimeAuth'){//新用户新认证通过
                            showVip();
                        }else{
                            if(auth.state==2){   //老的认证用户 显示一次等级信息提示auth.state==1||
                                if(!TempCache.getItem('oldAuthVipShow')){
                                    TempCache.setItem('oldAuthVipShow','oldAuthVipShow');
                                    showVip();
                                }
                            }
                        }

                        if( auth.state!==2 &&auth.state!=7&& auth.state!=8&& auth.state!=9){//未认证auth.state!==1 &&
                            $(".ev-noAuth").show();
                            /*if(auth.state==0){//二次提交认证
                                $(".ev-goAuth").hide();
                            }*/
                            //$(".ev-goAuth").on("click",function(){//点击跳转至认证   【这个更改】
                            //    comm.creatEvent({
                            //        triggerType:'认证',
                            //        keyword:"去认证",
                            //        actionId:23
                            //    });
                            //    user.redirectToRenZheng();
                            //});
                            $('.al-personalShare').hide();
                            var nickname = auth.lastName+auth.firstName;
                            if(nickname ==="") nickname = comm.getRegisterName(unit.email,unit.mobile);
                            $(".ev-name").text(nickname);
                        }else{
                            $(".ev-hasAuth").show();
                            var name=auth.lastName+auth.firstName;
                            $(".ev-name").text(comm.getStrLen(name,20));
                            //获取分享话术
                            var data={};
                            data.customerId=t.cid||'';
                            data.logoUseFlag=4;
                            data.pageIndex=1;
                            data.pageSize=1;
                            data.useFlag=1;
                            data.sceneType=getShareContentSense.my_index;
                            data.resourceType=ResouceType.person;
                            var param={};
                            param.paramJson= $.toJSON(data);
                            //分享
                            var href=window.location.href;
                            var url="";
                            switch (href.substring(href.lastIndexOf("/")+1)){
                                case 'personal_index.html'://个人主页
                                    url="https://m.allinmd.cn/pages/personal/others_index.html?cid="+t.cid;
                                    shareSence=shareSenceConst.personal_host;
                                    break;
                                case 'personal_contribution.html'://个人贡献
                                    url="https://m.allinmd.cn/pages/personal/others_contribution.html?cid="+t.cid;
                                    shareSence=shareSenceConst.personal_host;
                                    break;
                                case 'personal_active.html'://个人动态
                                    url="https://m.allinmd.cn/pages/personal/others_index.html?cid="+t.cid;
                                    shareSence=shareSenceConst.personal_host;
                                    break;
                                case 'personal_customerInfo.html'://个人简介
                                    url="https://m.allinmd.cn/pages/personal/others_baseInfo.html?cid="+t.cid;
                                    shareSence=shareSenceConst.personal_info;
                                    break;
                                default :
                                    url="https://m.allinmd.cn/pages/personal/others_index.html?cid="+t.cid;
                                    shareSence=shareSenceConst.personal_host;
                                    break;

                            }
                            var shareObj={};
                            shareAll({
                                url:url,
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
                                            if(rep&&rep.responseObject.responseStatus){
                                                var shareJson=rep.responseObject.responseData.data_list[0];
                                                var WechatTimeline;
                                                shareObj.picUrl = shareJson.share_comm.shareImageUrl;
                                                shareObj.title = shareJson.share_comm.shareTitle!=""?shareJson.share_comm.shareTitle:document.title;
                                                $.each(shareJson.share_channel,function(i,el){
                                                    if(el.shareChannel=='Sina'){
                                                        shareObj.sinaTitle=el.shareDesc;
                                                    }else if(el.shareChannel=="WechatFriend"){
                                                        shareObj.wxTitle = el.shareTitle;
                                                        shareObj.wxDesc = el.shareDesc.substring(0,60);
                                                    }else if(el.shareChannel=="QZone"){
                                                        shareObj.qZoneTitle=el.shareTitle;
                                                        shareObj.summary = el.shareDesc;
                                                    }else if(el.shareChannel=="WechatTimeline"){
                                                        shareObj.timeLineTitle=el.shareTitle;
                                                    }
                                                });

                                            }else{
                                                var shareSummary=comm.cutLine(auth.medicalTitle,"_",",")+auth.workplace+(baseInfo.summary?"个人简介："+baseInfo.summary:'').substring(0,60);
                                                shareObj.summary = shareSummary;
                                                shareObj.title = '推荐'+$(".ev-name").text()+'的唯医个人主页';
                                                shareObj.wxTitle = '推荐'+$(".ev-name").text()+'老师的唯医个人主页，关注可方便查看他的个人动态';
                                                shareObj.wxDesc = shareSummary;
                                                shareObj.sinaTitle = '分享'+$(".ev-name").text()+'的唯个人主页，欢迎与我沟通交流，点击关注';
                                                shareObj.desc = '分享'+$(".ev-name").text()+'的唯个人主页，欢迎与我沟通交流，点击关注';
                                                shareObj.pic = logoUrl;
                                            }
                                        },
                                        error:function(){}
                                    });
                                    return shareObj;
                                }
                            },false,$('.al-personalShare'));

                        }
                        $(".ev-fansNum").attr("num",csc.fansNum).text(csc.fansNum.toW());
                        $(".ev-followNum").attr("num",csc.followpeopleNum).text(csc.followpeopleNum.toW());
                        $(".ev-upNum").attr("num",csc.othersUpNum).text(csc.othersUpNum.toW());
                        if(location.href.indexOf('personal_contribution')>-1){//我的贡献页
                            $('[data-ev=all]').show(); //全部
                            if (csc.caseNum > 0) { $("[data-ev=case]").show(); }
                            if (csc.topicNum > 0) { $("[data-ev=topic]").show(); }
                            if (csc.videoNum > 0) { $("[data-ev=video]").show(); }
                            if (csc.docNum > 0) { $("[data-ev=doc]").show(); }
                        }
                    }
                }
            },
            error:function(){}
        });
        return responseData;
    },

    //获取大图
    getBigLogo:function(){
        var t=this;
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
                if(rep&&rep.responseObject&&rep.responseObject.responseData&&rep.responseObject.responseData.data_list){
                    var data=rep.responseObject.responseData.data_list[rep.responseObject.responseData.data_list.length-1];
                    $(".ev-bigLogo").attr("src",data.logoUrl);
                }else{
                    $(".ev-bigLogo").attr("src","//img50.allinmd.cn/authentication/auth/head_portraits.png");
                }
            },
            error:function(){}
        });
    },
    //上传头像
    updataLogo:function(){
        var t=this;
        $(".ev-logoUrl").on("click",function(){
            $(".ev-mainInner").hide();
            $(".ev-uploadInner").show();
            $(".al-appWakeUpFigure").hide();
        });
        $(".ev-backMain").on("click",function(){
            comm.creatEvent({
                triggerType:'全站功能按钮点击',
                keyword:TempCache.getItem('userId'),
                actionId:41
            });
            setTimeout(function(){
                $(".ev-mainInner").show();
                $(".ev-uploadInner").hide();
                $(".al-appWakeUpFigure").show();
            },500);
        });
        $("#ev-uploadBtn").bind("change",function(){
            Log.createBrowse(192,'添加头像');
            if(!/\.((JPEG)|(jpeg)|(jpg)|(JPG)|(png)|(PNG))$/i.test($(this).val())){
                popup('只允许上传.jpg .jpeg .png类型的图片文件');
                $(this).val("");
                return false ;
            };
            if(comm.getFileSize(document.getElementById("ev-uploadBtn"))>1048576*10){
                popup('图片不能大于10M');
                $(this).val("");
                return false ;
            }
            $(".ev-showStatus").show();//上传状态父层显示
            $(".al-loading").css("display","inline-block");//上传loading显示
            $(".ev-mainInner").show();
            $(".ev-uploadInner").hide();
            $.ajaxFileUpload({
                type: 'POST',
                url: t.path.logoUpload,
                data:{paramJson: '{imageType:1}'},
                secureuri: false,
                fileElementId: "ev-uploadBtn",//file控件id
                dataType: '',
                success: function (data, status) {
                    $("#ev-uploadBtn").val("");
                    var dataJSON = eval("(" + data.body.innerText + ")");
                    $(".al-loading").hide();//上传loading隐藏
                    if (dataJSON.responseObject.responseStatus) {
                        $(".ev-logoUrl img").attr("src",dataJSON.responseObject.responseMessage.url);
                        t.getBigLogo();
                        $(".al-loadingFinish").css("display","inline-block");//上传成功显示
                        setTimeout(function(){
                            $(".ev-showStatus").hide();//上传状态父层隐藏
                            $(".al-loadingFinish").hide();//上传成功隐藏
                        },2000);
                    } else {
                        popup("上传失败");
                        $(".ev-showStatus").hide();//上传状态父层隐藏
                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    popup("上传失败");
                    $(".ev-showStatus").hide();//上传状态父层隐藏
                }
            });
        })
    },
    uploadStar:function(){
        $('.uploadStar i').on('click',function(){
            $('.uploadStar').hide();
        });
        $('.serviceTimeCont .close').on('click',function(){
            $('.serviceTime').hide();
        });
    }

};

$(function(){
    var cid=TempCache.getItem("userId");
    var amChannel = comm.getpara()._amChannel;
    var callAppOptions = {
        ios: "allinmdios://app.allinmd.cn/applinks.html?scene=terminalPage&index=0"+(cid?"&sourceId=" + cid:"") + (amChannel?"&_amChannel="+amChannel:''),
        android: "allin://com.allin.social:75235?data={scene:3,type:0"+(cid?",sourceId:"+  cid :'')+ (amChannel?",_amChannel:"+amChannel:'')+ "}",
        ios9: "http://app.allinmd.cn/applinks.html?scene=terminalPage&index=0"+(cid?"&sourceId=" + cid:"") + (amChannel?"&_amChannel="+amChannel:''),
        runAtOnce: false
    };
    if(cid){
      comm.appWakeUp("figure", callAppOptions);//下载app层
    }
    personalCommon.init();
    comm.footerNav();
    //封面收起

    var headHeight = $(".al-personalHead").height();
    var navbarTop = $(".al-personalNavbar").height();
    //$(".al-personalNavbar").wrap('<div class="al-personalNavbarWrap"></div>');
    //$(".al-personalNavbarWrap").height($(".al-personalNavbar").outerHeight());
    var scrollHeadHeight = $(".al-personalScrollHead").height();
    var appH=$(".al-appWakeUpFigure").size()===0?0:$(".al-appWakeUpFigure").height();
    $(document).off('scroll').on("scroll", function() {
        
        if (headHeight < $(window).scrollTop()) {

            $(".al-personalHead").hide();
            $(".al-personalScrollHead").addClass('al-personalHeadFixed');
            $(".al-personalNavbar").addClass('al-personalNavbarFixed');
            $(".al-mainInner").css("paddingTop", navbarTop + scrollHeadHeight + headHeight-appH);
        } else {
            $(".al-personalHead").show();
            $(".al-personalScrollHead").removeClass('al-personalHeadFixed');
            $(".al-personalNavbar").removeClass('al-personalNavbarFixed');
            $(".al-mainInner").css("paddingTop", "0");
        }
    });
    
})
