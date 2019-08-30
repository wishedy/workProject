/**
 * 功能描述：3.0改版消息页面的列表
 * 使用方法:
 * 注意事件：
 * 引入来源：  作用：
 *
 * Created by ZhangHongda on 2018/09/29.
 *
 */

$(function(){
    var listBox=$(".Ev-MesListAppend");
    var apParentBox=$(".Ev-mesSysAppendClass");
    var noList=$(".Ev-mesNoList");
    var controller={
        config:{
            pageIndex:1,
            pageSize:10,
            messageType:1,//系统消息不传messageType，其余4类都传1
            dataFlag:2,
            sortType:2,
            logoUseFlag:3,
            currentTime:'',//当前系统时间
        },
        path:{
            customerInfo : PC_CALL+"customer/unite/json_info/", //个人信息
            mesRemindList:PC_CALL+"customer/message/json_remindGroupList/",//关注提醒列表
            deleteReadOp:PC_CALL+"customer/message/update3/",//删除操作和未读变成已读
            mesDoctorList:PC_CALL+"customer/message/getPeopleList/",//关注提醒获取医师列表
            mesAllStatus:PC_CALL+"customer/message/json_grouplist3/",//消息的总状态和系统消息
            mesPreferList:PC_CALL+"customer/message/json_preferList/",//赞了我的列表
            mesTrendsList:PC_CALL+"customer/message/getMapList3/",//提醒我看的列表
            getMapListByTeamId:PC_CALL+"caseFolder/team_member/getMapListByTeamId/",//病历夹 获取团队下面的成员
            updateTeamState:PC_CALL+"caseFolder/team_member/updateState/",//病历夹 接受团队邀请
            mesDataList:PC_CALL+"customer/message/getMessageCountInfo/",//改版3.0消息获取数据列表
        },
        init:function(){
            var t=this;
            t.login();

			//检查厂商角色  2019-04-11 屏蔽厂商 厂商用户隐藏掉关注分丝与收藏
			var customerRole = TempCache.getItem("customerRole");
			if(customerRole && (customerRole =="14" || customerRole =="15" )){
				$(".al-mesMainR ul").hide();
			}
        },
        ajaxFn:function(opt) {
            comm.LightBox.showloading();
            var cfg = opt;
            $.ajax({
                url: cfg.url,
                type: opt.type?opt.type:'post',
                data: {paramJson: $.toJSON(cfg.param)},
                dataType: 'json',
                async:opt.async?opt.async:true,
                success: function (data) {
                    comm.LightBox.hideloading();
                    if (data) {
                        cfg.fn(data);
                    }
                }
            });
        },
        //登录认证
        login:function(x) {
            var t=this;
            var loginStatus=$("#sesCustomerId").val();
            var _navLi= $(".Ev-ul-NavBarClick li");
            if(x){//判断从发布登录重新获取资源
                $(".al-release_popBox").attr('reloadData',1);
            }
            //var _tit= $("title");
            if(loginStatus){//已经登录
                $(".Ev-messageNoLogin").hide();
                $(".Ev-messageLogin").show();
                t.cusInfoAjax();//用户的信息
                t.openApp();
                t.local_time();//获取系统时间
                t.getDataList();//获取
            }else{//未登录
                var mesNoLogin=$(".Ev-messageNoLogin");
                mesNoLogin.show();
                t.loginClick();

            }
        },
        local_time : function(){
            var local = new Date();
            var year = local.getFullYear();
            var month = local.getMonth()+1;
            if(month<10){
                month = "0"+month;
            }
            var day = local.getDate();
            if(day<10){
                day = "0"+day;
            }
            var time = local.toTimeString().substr(0,8);
            var local_time = year+"-"+month+"-"+day+" "+time;
            this.config.currentTime = local_time;
        },
        getDataList:function () {
            var t = this;
            var param = {
                customerId:$("#sesCustomerId").val(),
                isRead:0
            };
            t.ajaxFn({
                url: t.path.mesDataList,
                param:param,
                type:'get',
                fn:function(data){
                    if(data && data.responseObject && data.responseObject.responseData && data.responseObject.responseStatus){
                        var _data = data.responseObject.responseData;
                        if(_data.isofficialRead==0){//表示有官方消息
                            $('.ev-isofficialRead i').show();
                        }else{
                            $('.ev-isofficialRead i').hide();
                        }
                        $('.ev-isofficialRead .itemTime').text(comm.date.diffDay_three(_data.isofficialReadTime,t.config.currentTime))
                        if(_data.isReceiveRead==0){//表示有待接诊提示
                            $('.ev-isReceiveRead i').show();
                        }else{
                            $('.ev-isReceiveRead i').hide();
                        }
                        $('.ev-isReceiveRead .itemTime').text(comm.date.diffDay_three(_data.isReceiveReadTime,t.config.currentTime))
                        if(_data.isReplyRead==0){//表示有患者咨询
                            $('.ev-isReplyRead i').show();
                        }else{
                            $('.ev-isReplyRead i').hide();
                        }
                        $('.ev-isReplyRead .itemTime').text(comm.date.diffDay_three(_data.isReplyReadTime,t.config.currentTime))
                        if(_data.isNoticeRead==0){//表示有通知
                            $('.ev-isNoticeRead i').show();
                        }else{
                            $('.ev-isNoticeRead i').hide();
                        }
                        $('.ev-isNoticeRead .itemTime').text(comm.date.diffDay_three(_data.isNoticeReadTime,t.config.currentTime))
                    }
                }
            });
        },
        //立即登录按钮
        loginClick:function(){
            var t=this;
            $(".Ev-MesLoginBtn").off("click").on("click",function(){
                user.login({
                    callback:function(){
                        $(".Ev-messageNoLogin").hide();
                        $(".Ev-messageLogin").show();
                        $(".al-release_popBox").attr('reloadData',1);
                        t.cusInfoAjax();//用户的信息
                        t.openApp();
                        t.local_time();//获取系统时间
                        t.getDataList();//获取
                        setTimeout(function(){
                            g_sps&&g_sps.createBrowse({pageId:474});
                        },2200);
                    },
                    scene:privilegeSceneConst.eSceneTypeLogin,
                    onAuthCancel:function(){
                        g_sps.jump(null,window.location.href);
                    }
                });
            });
        },
        //用户信息
        cusInfoAjax:function(){
            var t=this;
            var param={};
            param.customerId= $("#sesCustomerId").val();
            t.ajaxFn({
                url: t.path.customerInfo,
                param:param,
                fn:function(data){
                    if (!data || !data.responseObject.responseStatus) {
                        g_sps.jump(null,"/");
                        return false;
                    }
                    var list = data.responseObject.responseData.data_list[0];
                    var unit,_auth,csc,att;
                    unit = list.customer_unite;
                    _auth = list.customer_auth;//姓名，
                    csc = list.customer_statistic;//粉丝，点赞，关注
                    att = list.customer_att;//头像
                    //判断头像
                    var logoUrl = "//img10.allinmd.cn/default-user/user_img65.png";
                    if (att.logoUrl !== "") logoUrl = att.logoUrl;
                    $(".Ev-LogoUrl img").attr("src",logoUrl);
                    //认证状态
                    t.authState=_auth.state;
                    if (_auth.state !== 1 && _auth.state !== 2 && _auth.state !== 7 && _auth.state !== 8 && _auth.state !== 9) {//未认证
                        var nickname = _auth.lastName + _auth.firstName;
                        if (nickname === "") nickname =comm.getRegisterName(unit.email,unit.mobile);
                        $(".Ev-mesUserName").text(nickname);
                        if($(".al-mesMainR").find('.Ev-noAuth').length==0){
                            $('<span class="no_auth Ev-noAuth" style="position: relative;top:20px;background:#f5f6f8;padding:3px 10px;border-radius:25px;color:#a5a6a8;">您尚未认证</span>').insertBefore($(".Ev-mesUserTitle"));
                        }
                        //$(".Ev-mesUserTitle").text("");//职称
                        $(".Ev-mesCompany").text("尚未认证");
                    } else {
                        var name = _auth.lastName + _auth.firstName;
                        $(".Ev-mesUserName").html(name+'<i></i>');//姓名
                        $(".Ev-mesUserTitle").text(_auth.medicalTitleShow);//职称
                        $(".Ev-mesCompany").text(_auth.company);//医院
                    }
                    $(".Ev-mesFansNum").text(csc.fansNum);//粉丝
                    // $(".Ev-mesFollowNum").text(csc.followpeopleNum);//关注
                    $(".Ev-mesFollowNum").text(csc.followOrgNum?csc.followOrgNum:csc.followpeopleNum);//关注
                    $(".Ev-mesUpNum").text(csc.othersUpNum);//点赞
                }
            });
            t.getRenZhengPop();//认证弹层
        },
        openApp:function () {
            var t = this;
            $(document).on('click','.ev-iKnow',function () {
                $('.mesListPopup').hide();
                $(".al-downLoad_PopBox").show();
                comm.setCenter($(".Ev-al-downContainer"));
            });
            $(document).on('click','.Ev-closePopBtn',function () {
                $(".al-downLoad_PopBox").hide();
            });
            $(document).on('click','.mesListItem',function () {
                $('.mesListPopup').show();
            });
            $('.mesListPopup i').on('click',function () {
                $('.mesListPopup').hide();
            });
            $('.mesListPopup button').on('click',function () {
                $('.mesListPopup').hide();
            })
        },
        //认证
        getRenZhengPop:function(){
            $(document).on('click','.Ev-noAuth',function(){
				var customerRole = TempCache.getItem("customerRole");
				if(customerRole && (customerRole=="14" || customerRole=="15")){
					window.location.href = "/pages/singlePage/user/companyAuth.html"
				}

                auth.showAuthPage({
                    callback:function(){
                        $(".al-mesMainR").find('.Ev-noAuth').remove();
                        controller.login();
                    },
                    onAuthCancel:function(){},
                    privCheckFailed:function(){}
                });

            });
        },
        //关注提醒列表
        //列表数据少时自动添加高度和背景颜色
        listCssStyle:function(items){
            if(items.length<5&&items.length!=0) {
                var _h = $('.Ev-mesReviewListCon').height();
                var divH = 615-_h;
                $(".Ev-al-contentItem").append('<div class="Ev-remove" style="border:1px solid #e4e9ed;border-top:none;height:'+divH+'px;width:706px;background:#fff;"></div>');
            }
        },
    };
    controller.init();
    // scene.messageLogin = function(){
    //     $(".Ev-messageNoLogin").hide();
    //     $(".Ev-messageLogin").show();
    //     controller.cusInfoAjax();//用户的信息
    //     controller.openApp();
    //     controller.local_time();//获取系统时间
    //     controller.getDataList();//获取
    // };
    // scene.TopHeadLoginCallback= function(){
    //     controller.login('reloadData');
    // };
});