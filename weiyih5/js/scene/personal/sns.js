/**
 * 功能描述：  粉丝关注赞
 * 使用方法:
 * 注意事件：
 * 引入来源：  作用：
 *
 * Created by LiChunHui on 2016/8/19.
 */
$(function(){
    var sns={};
    sns={
        path:{
            getSpecialCount:M_CALL + "customer/message/getSpecialCount/",//获取粉丝，赞的数量
            customerInfo : "/mcall/customer/unite/json_list/",//客户信息
            fansList : M_CALL+"customer/follow/fans/json_list/",//粉丝列表
            followList : M_CALL+"customer/follow/people/json_list/", //关注列表
            praiseList : M_CALL+"customer/prefer/json_list/",//赞列表
            reDoc:M_CALL+"customer/auth/getRecommendList/"//推荐医师
        },
        config:{
            pageSize:10
        },
        init:function(){
            //权限
            user.privExecute({
                operateType: 'auth',   //'login','auth','conference'
                callback:function(){}
            });
            this.cid=TempCache.getItem("userId");
            this.para=comm.getpara();
            if(this.para.action){
                this.type=this.para.action;
            }else{
                this.type="fans";
            }
            if(this.type!=="follow") {
                this.getSpecialCount();
            }
            this.getUserList();
            this.digHole();
        },
        //返回埋点
        digHole:function(){
            $('.ev_digHole').click(function(){
                comm.creatEvent({
                    triggerType:'全站功能按钮点击',
                    keyword:"返回",
                    actionId:41,
                    async:false
                });
            });
        },
        getSpecialCount :function(){
            var t=this;
            var data={};
            data.readTrendTime = TempCache.getItem("readTrendTime");
            data.readFansTime = TempCache.getItem("readFansTime");
            data.readPreferTime = TempCache.getItem("readPreferTime");
            data.platformId= TempCache.getItem("department");
            var param={};
            param.paramJson= $.toJSON(data);
            var json={};
            $.ajax({
                type : "post",
                url : t.path.getSpecialCount,
                data : param,
                async : false,
                dataType : "json",
                success : function(rep){
                    if(rep&&rep.responseObject.responseData){
                        if(rep.responseObject.responseData.data_list&&rep.responseObject.responseData.data_list.length>0){
                            var list=rep.responseObject.responseData.data_list[0];
                            /*if(list.fansNum>0){//有新的粉丝加徽标
                                $(".al-personalFollowNum").eq(0).append('<i class="al-newNumTips"></i>');
                            }else{
                                $(".al-personalFollowNum").eq(0).find("i").remove();
                            }
                            if(list.preferNum>0){//有新的关注人加徽标
                                $(".al-personalFollowNum").eq(2).append('<i class="al-newNumTips"></i>');
                            }else{
                                $(".al-personalFollowNum").eq(2).find("i").remove();
                            }*/
                            t.newFansNum=list.fansNum;//新增粉丝数
                            t.newUpNum=list.preferNum;//新增赞数

                        }
                    }
                },
                error:function(){}
            });
        },
        //参数配置
        getParam:function(pageIndex){
            var t =this;
            var data={};
            if(t.type!=="praise"){
                data.customerId=t.cid;
                data.sessionCustomerId= t.cid;
                data.dataFlag=3;
                data.useFlag=UseFlag.c;
                data.logoUseFlag=3;
                data.pageIndex=pageIndex;//第几页
                data.pageSize= t.config.pageSize;//每一页的数量
            }else{ //赞方式
                data.upDownType=1;
                data.usefulType = 9;
                data.refId=t.cid;
                data.dataFlag=1;
                data.attUseFlag=8;
                data.useFlag=UseFlag.c;
                data.logoUseFlag=3;
                data.pageIndex=pageIndex;//第几页
                data.pageSize= t.config.pageSize;//每一页的数量
            }
            return data;
        },
        getUserList:function(){
            var t=this;
            //this.specialCount=getSpecialCount();
            switch (t.type){
                case "praise"://赞
                    url= t.path.praiseList;
                    $(".ev-listTitle").text("点赞");
                    document.title="点赞－唯医,allinmd";
                    $(".ev-imgPar").css({
                        "width": "2.44rem",
                        "height": "4.22667rem"
                    });
                    $(".ev-noListTitle").text("多与大家互动，让更多人认识你");
                    $(".ev-noListImg").attr("src","//img50.allinmd.cn/pages/index/no_like.png");
                    TempCache.setItem('readPreferTime',comm.date.local_time());    //cookie记录上次查看赞的时间
                    break;
                case "fans"://粉丝
                    url= t.path.fansList;
                    $(".ev-listTitle").text("粉丝");
                    document.title="粉丝－唯医,allinmd";
                    $(".ev-noListTitle").text("先关注别人");
                    $(".ev-noListImg").attr("src","//img50.allinmd.cn/pages/index/no_fans.png");
                    TempCache.setItem('readFansTime',comm.date.local_time());    //cookie记录上次查看粉丝的时间
                    break;
                case "follow"://关注
                    url= t.path.followList;
                    $(".ev-listTitle").text("关注");
                    document.title="关注－唯医,allinmd";
                    $(".ev-imgPar").css({
                        "width": "3.84rem",
                        "height": "4.2rem"
                    });
                    $(".ev-noListTitle").text("他们有很多病例");
                    $(".ev-noListImg").attr("src","//img50.allinmd.cn/pages/index/no_follow.png");
                    break;
            }
            comm.loading.show()
            $.ajax({
                type : "post",
                url : url,
                data : t.getParam(1),
                dataType : "json",
                success : function(rep){
                    comm.loading.hide();
                    if(rep&&rep.responseObject.responseData&&rep.responseObject.responseData.data_list&&rep.responseObject.responseData.data_list.length>0){
                        t.getHtml(rep.responseObject.responseData.data_list);
                        if(rep.responseObject.responseData.data_list.length<t.config.pageSize){
                            $(".ev-listCon").attr("scrollPagination", "disabled");
                            return;
                        }
                        t.scrollPage(url);
                    }else{
                        $(".ev-hasList").hide();
                        $(".ev-noList").show();
                        t.getReDoc();
                    }
                },
                error:function(){}
            });
        },
        //加载dom
        getHtml:function(data){
            var t=this;
            var html="";
            var arrHT=[];
            var num=0;
            switch (t.type){
                case "praise"://赞
                    //rows=data.responseData.data_list;
                    num=this.newUpNum;
                    break;
                case "fans"://粉丝
                    //rows= data;
                    num=this.newFansNum;
                    break;
                case "follow"://关注
                    //rows= data.responseData.data_list;
                    break;
            }

            if(data&&data.length>0){
                $.each(data,function(i,val){
                    var logo; var auth; var base; var fans; var statistic;
                    if(val.customer_att){
                        logo=val.customer_att;
                    }
                    if(val.customer_auth){
                        auth=val.customer_auth;
                    }
                    if(val.customer_baseinfo){
                        base=val.customer_baseinfo;
                    }
                    if(val.customer_statistic){
                        statistic=val.customer_statistic;
                    }

                    fans=val.customer_fans?val.customer_fans:val.customer_people;
                    name=auth.lastName?auth.lastName+auth.firstName:"";
                    medicalTitle=auth.medicalTitleShow;//auth.medicalTitle?comm.strHandle.cutDoctorTitle(comm.cutLine(auth.medicalTitle,"_",",")):"";
                    company=auth.workplace?comm.getStrLen(auth.workplace,22):"";

                    if(t.type === "praise"){ //赞时customerId从auth中取
                        fans = {};
                        fans.relationship = val.customer_relationship;
                        base.customerId = val.customer_auth.customerId;
                    }
                    arrHT.push(module.listTemplate({tempName:"userList"})({
                        cid:base.customerId,
                        customerId: t.cid,
                        tips:(i<num?1:0),
                        userName:name,
                        logoUrl:logo.logoUrl,
                        state:auth.state,
                        medicalTitle:medicalTitle,
                        company:company,
                        relationship:fans.relationship
                    }));
                });
            }
            $(".ev-listCon").append(arrHT);
        },
        //瀑布流
        scrollPage: function (url) {
            var t = this;
            var num=2;
            $(".ev-listCon").off("scroll").scrollPagination({
                'contentPage': url,
                'noParamJson': 1,
                'contentData': $.extend(t.getParam(), {
                    pageIndex: function () {
                        return num++;
                    }
                }),
                'scrollTarget': $(window),
                'heightOffset': $(window).height(), // it gonna request when scroll is 10 pixels before the page ends
                'delaytime': 0,
                'type': "POST",
                'beforeLoad': function () {
                    comm.loading.show();
                },
                'afterLoad': function (elementsLoaded) {
                    comm.loading.hide();
                },
                'loader': function (data) {
                    if ($.isEmptyObject(data)) {
                        $(".ev-listCon").attr("scrollPagination", "disabled");
                        return false;
                    } else {
                        if ($.isEmptyObject(data.responseObject.responseData) || (data.responseObject.responseData.data_list && data.responseObject.responseData.data_list.length == 0)) {
                            $(".ev-listCon").attr("scrollPagination", "disabled");
                            return false;
                        } else {
                            var result = data.responseObject.responseData.data_list;
                            t.getHtml(result);
                        }
                    }
                }
            });

        },
        //获取推荐医师列表
        getReDoc:function(pageIndex){
            comm.loading.show();
            var t=this;
            var data={};
            var param={};
            data.sessionCustomerId=t.cid;
            data.sortType=4;
            data.recommendAreasExpertiset= t.areasExpertise;
            data.recommendCompany= t.company;
            data.logoUseFlag=3;
            data.pageIndex=pageIndex?pageIndex:1;
            data.pageSize=6;
            param.paramJson= $.toJSON(data);
            $.ajax({
                type : "post",
                url : t.path.reDoc,
                data : param,
                dataType : "json",
                success : function(rep){
                    comm.loading.hide();
                    var rows=rep.responseObject.responseData.data_list;
                    var arrHT=[];
                    if(rows&&rows.length>0){
                        $.each(rows,function(i,val){
                            var logo; var user; var statistic;
                            if(val.customer_att){
                                logo=val.customer_att;
                            }
                            if(val.customer_doctor){
                                user=val.customer_doctor;
                            }
                            if(val.customer_statistic){
                                statistic=val.customer_statistic;
                            }
                            name=user.last_name?user.last_name+user.first_name:"";
                            medicalTitle=user.medical_title?comm.cutDoctorTitle(comm.cutLine(user.medical_title,"_",",")):"";
                            company=user.workplace?comm.getStrLen(user.workplace,22):"";

                            arrHT.push(module.listTemplate({tempName:"userList"})({
                                cid:user.customer_id,
                                customerId: t.cid,
                                userName:name,
                                logoUrl:logo.logoUrl,
                                state:user.state,
                                medicalTitle:medicalTitle,
                                company:company,
                                relationship:val.relationship
                            }));
                        });
                    }

                    $(".ev-reDoc").html(arrHT);
                },
                error:function(){}
            });
        }
    };

    sns.init();
})
