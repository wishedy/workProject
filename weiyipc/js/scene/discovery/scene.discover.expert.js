/**
 * @name:
 * @desc:   发现专家页面
 * @example:
 * @depend:
 * @date: 2016/8/10
 * @author: sunhaibin
 */

$(function(){
    var ctrl={
        opt:{
            url:PC_CALL+"",  //专家请求列表
            mayKnowUrl:PC_CALL+'customer/pundits/getRecommendedmayKnowPundits/', //可能认识的专家
            applyAuth:PC_CALL+'customer/pundits/apply/create/'  ,               //申请权威专家
            searchByName:PC_CALL+"customer/pundits/getSearchPunditsCustomerName/",   //通过权威专家名称搜索结果
            doctorList:PC_CALL+"customer/pundits/getPunditsCustomerList/"   ,       //专家列表
            getShareContent:PC_CALL+'comm/data/share/getMapList3/'
        },
        init:function(){
            var t=this;
            t.doctorsSearch();      //普通搜索
            t.searchByName();       //按名搜索
            t.youMayKnow();
            t.placeH();
            t.authApplyProtext();   //申请权威专家
            t.applyAuthorSubmit();
            $('.al-discoverZJ_searchBox input').placeholder({text:"请输入关键词"});
            $('.ev_doctorBox').on('click','.al-doctorRecommend',function(eve){
                if(eve.target.nodeName=='A'||$(eve.target).parents()[0].nodeName=='A'||$(eve.target).hasClass('ev-followBtn')||$(eve.target).parents().hasClass('ev-followBtn')){

                }else{
                    var _href = $(this).find('.al-doctorImg a').attr('href');
                    g_sps.jump(null,_href,true);
                    eve.stopPropagation();
                    return false;
                }

            });
        },
        params:{
            pageSize:10
        },
        doctorsSearch:function(){
            var t=this;
            var callback =function(m){
                t.docSearch(function(n){
                    $('.pager').pager({pagenumber:m,pagecount:n,buttonClickCallback:callback});
                },m)
            };
            t.docSearch(function(n){
                $('.pager').pager({pagenumber:1,pagecount:n,buttonClickCallback:callback});
            },1);
        },
        //普通搜索
        docSearch:function(fn,pageIndex){
            var t=this;
            var _o={
                pageSize: t.params.pageSize,pageIndex:pageIndex,logoUseFlag:10,sortType:6,sessionCustomerId:$('#sesCustomerId').val()||"",platformId: $('#sesDepartment').val()||1
            };
            var _params = {paramJson: $.toJSON(_o)};
            var _callback =function(d){
                if(d&& d.responseObject.responseData&&!$.isEmptyObject(d.responseObject.responseData)&&d.responseObject.responseData.data_list.length){
                    var item = d.responseObject.responseData.data_list;
                    var arr=[];
                    var _temp ='';
                    var contribution='';
                    var lisname = '';
                    var firstName = item[0].customerPunditsEntity.customerName;
                    var secondName =item[1]&&item[1].customerPunditsEntity.customerName;
                    $.each(item,function(j,je){
                        _temp = module.resourceListTemplate({tempName:'userList'})({
                            cid:je.customerPunditsEntity.customerId,
                            customerId:$('#sesCustomerId').val()!=""&&$('#sesCustomerId').val()!=undefined?$('#sesCustomerId').val():"",
                            userName:je.customerPunditsEntity.customerName,
                            state:2,
                            medicalTitle:je.customerPunditsEntity.medicalTitleShow!=undefined?je.customerPunditsEntity.medicalTitleShow:'',
                            company:je.customerPunditsEntity.company,
                            contribuNum:je.customerStatistic.contributionCount,
                            reviewNum:je.customerStatistic.reviewNum,
                            fansNum:je.customerStatistic.fansNum,
                            relationship:je.customerPunditsEntity.relationship,
                            logoUrl:je.customerAtt.logoUrl
                        });
                        if(pageIndex==1&&j<3&&!$.isEmptyObject(je.customerTrends)&&je.customerTrends.length){
                            contribution='';
                            lisname="";
                            $.each(je.customerTrends.slice(0,5),function(k,ke){
                                lisname +=  '<li><a href="'+ke.refPageStoragePathUrl+'">'+comm.getStrLen(ke.refName,70)+'</a></li>';
                            });
                            contribution='<ul class="al-doctorMsg_ul">'+lisname+'</ul>';
                            $(_temp).find('.al-followBtn').after(contribution);
                        }

                        arr.push(_temp);
                    });
                    $('.ev_noMathZj').hide();
                    $('.ev_doctorBox').html(arr);//
                    // var _totalCount=d.responseObject.responseData.punditsCustomerCount;//punditsCustomerCount有效和无效数据总和bug55365
                    var _totalCount=d.responseObject.responseData.realPunditsNum;//realPunditsNum有效数据bug55365
                    $('.ev_totalCount').html(_totalCount);
                    var pageCount = Math.ceil(_totalCount/t.params.pageSize);
                    t.shareAction($.extend(_o,{dataShare:0}));
                    fn(pageCount);
                }else{
                    $('.ev_totalCount').html(0);
                    $('.pager').empty();
                    $('.ev_doctorBox').html("");
                    $('.ev_noMathZj').show();
                    $('.ev-shareContainer').hide();
                }

            };
            comm.ajax.async(t.opt.doctorList,_params,_callback);

        },
        //按人名搜索
        searchByName:function(){
            var t=this;
            var val='';
            var getTag=function(str,e){
                var html='';
                var _temp='';
                $.ajax({
                    url: t.opt.searchByName,
                    type:"post",
                    data:{paramJson: $.toJSON({"pageSize":5,"pageIndex":1,"logoUseFlag":10,"sortType":4,firstName:str,"sessionCustomerId":$('#sesCustomerId').val()||"",platformId: $('#sesDepartment').val()||1})},
                    dataType:'json',
                    success:function(data){
                        if(data&& data.responseObject.responseData&&!$.isEmptyObject(data.responseObject.responseData)&&data.responseObject.responseData.data_list.length){
                            var ite = data.responseObject.responseData.data_list;
                            $.each(ite,function(m,me){
                                _temp += "<p cid='"+me.customerPunditsEntity.customerId+"'>"+me.customerPunditsEntity.customerName+"</p>"
                            });
                        }
                        $('.searchTipBox').html(_temp);
                        $('.searchTipBox p').on('click',function(){
                            var cid = $(this).attr('cid');
                            if(cid==$('#sesCustomerId').val()){
                                g_sps.jump(null,'/pages/personal/personal_index.html?cid='+cid,true);
                            }else{
                                g_sps.jump(null,'/pages/personal/others_contribution.html?cid='+cid,true);
                            }
                        });
                        $('body:not(".searchTipBox")').click(function(){
                            $('.searchTipBox').empty();
                        });
                    }
                });
            };
            var flag = true;
            var timer = null;
            $(".al-discoverZJ_searchBox").bind('compositionstart',function(){
                flag = false;
            });
            $(".al-discoverZJ_searchBox").bind('compositionend',function(){
                flag = true;
            });
            $('.al-discoverZJ_searchBox').on('input propertychange keyup',function(e){
                clearTimeout(timer);
                val = $('.al-discoverZJ_searchBox input').val();
                timer = setTimeout(function(){
                    if(flag){
                        if(val!=''){
                            if(e.which===13){//提交请求资源
                                t.commDocSearch(val);
                                $('.al-discoverZJ_searchBox input').val(val);
                                $('.searchTipBox').empty();
                            }else{//请求人名tag
                                getTag(val);
                            }
                        }else{
                            if(e.which==13){
                                t.doctorsSearch();
                                $('.searchTipBox').empty();
                            }
                        }
                    }
                },500);

            }).find('i').on('click',function(){
                val = $('.al-discoverZJ_searchBox input').val();
                comm.creatEvent({
                    triggerType:'搜索',
                    keyword:val,
                    actionId:10
                });
                if(val!=""){
                    t.commDocSearch(val);
                    $('.al-discoverZJ_searchBox').val(val);
                    $('.searchTipBox').empty();
                }else{
                    t.doctorsSearch();
                    $('.searchTipBox').empty();
                }
            });
        },
        placeH:function(){
            $.fn.iePlaceHolder = function(text) {
                $(this).each(function(index, el) {
                    return $(this).focus(function() {
                        if ($(this).val() === text) {
                            $(this).val("");
                        } else {
                            return;
                        }
                    }).blur(function() {
                        if ($(this).val().length === 0) {
                            $(this).val(text);
                        } else {
                            return;
                        }
                    }).blur();
                });
                return $(this);
            };
            if (/MSIE/g.test(navigator.userAgent)) {
                $(".ev_tx").iePlaceHolder("请描述你的优势").css('color','#aaa');
            }
        },
        //权威专家申请
        authApplyProtext:function(){
            var t=this;
            var cid;
                $('.ev_applyNow').click(function(){
                    cid = $('#sesCustomerId').val();
                    if(cid!=undefined&&cid!=""){//已登录
                        if($("#sesAuth").val() == 2||$("#sesAuth").val()==7||$("#sesAuth").val()==8||$("#sesAuth").val()==9){
                            $('.al-discoverZj_login').hide();
                            $('.al-discover_sidebarMain').show();
                            t.applyAuthorSubmit();
                            t.authApplyLeave();     //在申请专家表单展示时，离开页面提示
                        }else{
                            $('.al-discoverZj_login').hide().eq(1).show();
                            if($("#sesAuth").val() == 1){//v1待审核
                                $(".al-authState").html('<i></i>V1审核中');
                            }
                        }
                        comm.Log.createBrowse({href:location.href,id:114,name:'权威专家申请'});
                    }else{//未登录
                        $('.al-discoverZj_login').hide().eq(2).show();
                        $('.ev_loginNow').click(function(){//点击登录
                            user.login({
                                callback:function(){
                                    $('.al-discoverZj_login').hide();
                                    $('.al-discover_sidebarMain').show();
                                    t.applyAuthorSubmit();
                                    t.authApplyLeave();     //在申请专家表单展示时，离开页面提示
                                },
                                onAuthCancel:function(){
                                    $('.module-user').remove();
                                    $('#lightbox').hide();
                                    $('.al-discoverZj_login').hide().eq(1).show();
                                },
                                privCheckFailed:function() {
                                    $('.module-user').remove();
                                    $('#lightbox').hide();
                                    $('.al-discoverZj_login').hide().eq(1).show();
                                },
                                scene:privilegeSceneConst.eSceneTypeAuth
                            })
                        });
                    }
                });
                $('.ev_authNow').on('click',function(){
                    user.login({
                        callback:function(){
                            $('.al-discoverZj_login').hide();
                            $('.al-discover_sidebarMain').show();
                            t.applyAuthorSubmit();
                            t.authApplyLeave();     //在申请专家表单展示时，离开页面提示
                        },
                        scene: privilegeSceneConst.eSceneTypeAuth,
                        onAuthCancel:function(){
                            $('.module-user').remove();
                            $('#lightbox').hide();
                            $('.al-discoverZj_login').hide().eq(1).show();
                        },
                    });
                });

        },
        applyAuthorSubmit:function(){
            var t=this;
            var checkNumber=function(no){
                if((/^1[3|4|5|7|8]\d{9}$/.test(no))||/^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/.test(no)){
                    return true;
                }else{
                    return false;
                }
            };
            var applyCustomerName='',
                applyMobile='',
                applyReason='',
                noEmpty=true;
            $('.ev_applicant').val(($.cookie('applyName')!=""&&$.cookie('applyName')!=undefined?$.cookie('applyName'):$('#sesCustomerId').data('name')));//初始化名字，电话,如果有cookie,取cookie,没有取默认
            $('.ev_applicantNo').val(($.cookie('applyNumber')!=""&&$.cookie('applyNumber')!=undefined?$.cookie('applyNumber'):TempCache.getItem("mobile")));
            $('.ev_tx').val(($.cookie('applyReason')!=""&&$.cookie('applyReason')!=undefined?$.cookie('applyReason'):""));
            $('.ev_applySub').off('click').click(function(){
                if($(this).attr('disable')=='true'){
                    return false;
                }else{

                    noEmpty=true;
                    applyCustomerName= $.trim($('.ev_applicant').val());
                    applyMobile=$.trim($('.ev_applicantNo').val());
                    applyReason=$.trim($('.ev_tx').val());
                    $.each($('.ev_apply'),function(i,e){
                        if($(e).val()==""||$(e).val()=="请描述你的优势"){
                            noEmpty =false;
                            $(e).focus();
                            return ;
                        }
                    });
                    if(!checkNumber(applyMobile)){
                        $('.ev_applicantNo').focus();
                        noEmpty =false;
                    }
                    var _params ={
                        customerId:$('#sesCustomerId').val(),
                        customerName:$('#sesCustomerId').data('name'),
                        applyCustomerName:applyCustomerName,
                        applyMobile:applyMobile,
                        applyReason:applyReason,
                        updatePlatformId:$('#sesDepartment').val()||1
                    };

                    if(noEmpty===true){
                        comm.LightBox.showloading();
                        $('.ev_applySub').attr('disable','true');
                        $.ajax({
                            url: t.opt.applyAuth,
                            type:"post",
                            data:{paramJson:$.toJSON(_params)},
                            dataType:'json',
                            success:function(d){
                                comm.LightBox.hideloading();
                                $('.ev_applySub').attr('disable','false');
                                $('.ev_tx').val("");
                                $('.al-discover_sidebarMain').hide();
                                $('.al-discoverZj_login').hide().eq(0).show();
                                $.topTip({mark:"success",showTime:2,content:"发送成功，请静候佳音"});
                                $.removeCookie('applyName');
                                $.removeCookie('applyNumber');
                                $.removeCookie('applyReason');
                            },
                            error:function(){
                                comm.LightBox.hideloading();
                                $('.ev_applySub').attr('disable','false');
                            }
                        });
                    }
                }
            });
            $('.ev_cancelApply').off('click').click(function(){
                applyCustomerName= $.trim($('.ev_applicant').val());
                applyMobile=$.trim($('.ev_applicantNo').val());
                applyReason=$.trim($('.ev_tx').val());
                if(applyCustomerName!=""||applyMobile!=""||applyReason!=""){
                    $.makeSurePopup({
                        title:"放弃编辑",//弹窗标题
                        content01:"确定放弃当前编辑的内容吗？",//弹窗内容字体会加粗 (可不传)
                        content:"",//弹窗内容
                        url:"",//ajax请求接口（可不传，不传就不发请求）
                        param:"",//ajax请求参数(可不传)
                        toJSON:1,//传参是否为paramJSPN 0或1，默认为1
                        callback:function(){
                            $('.ev_tx').val("");
                            $('.al-discover_sidebarMain').hide();
                            $('.al-discoverZj_login').hide().eq(0).show();
                        },//点击确认后执行的方法（有发送请求时，是请求成功后执行的方法)
                        error:function(){}//ajax请求失败后执行的方法(可不传)
                    });
                }else{
                    $('.al-discover_sidebarMain').hide();
                    $('.al-discoverZj_login').hide().eq(0).show();
                }
                //事件埋点
                comm.creatEvent({
                    triggerType:"全站功能按钮点击",
                    keyword:"申请权威专家取消",
                    browType:114,
                    actionId:45
                });
            })
        },
        authApplyLeave:function(){
            var t=this;
            var applyCustomerName= $.trim($('.ev_applicant').val());
            var applyMobile=$.trim($('.ev_applicantNo').val());
            var applyReason=$.trim($('.ev_tx').val());
            $('body a').not('.ev_applySub, .ev_cancelApply, .ev_applyNow, .ev_authNow').on('click',function(e){
                if($('.ev_apply').is(':visible')){
                    if(!$(this).hasClass('al-followBtn')&&$(this).attr('target')!='_blank') {//不是关注按钮
                        var href = $(this).attr('href');
                        if (applyCustomerName != "" || applyMobile != "" || applyReason != "") {
                            $.makeSurePopup({
                                title: "放弃编辑",//弹窗标题
                                content01: "确定放弃当前编辑的内容吗？",//弹窗内容字体会加粗 (可不传)
                                content: "",//弹窗内容
                                url: "",//ajax请求接口（可不传，不传就不发请求）
                                param: "",//ajax请求参数(可不传)
                                toJSON: 1,//传参是否为paramJSPN 0或1，默认为1
                                callback: function () {
                                    $.topTip({mark: "success", showTime: 2, content: "您的申请信息已被保存，下次可以继续编辑"});
                                    $.cookie('applyName', $.trim($('.ev_applicant').val()), {expires: 365});
                                    $.cookie('applyNumber', $.trim($('.ev_applicantNo').val()), {expires: 365});
                                    $.cookie('applyReason', $.trim($('.ev_tx').val()), {expires: 365});
                                    setTimeout(function () {
                                        g_sps.jump(null, href);
                                    }, 2000);

                                },//点击确认后执行的方法（有发送请求时，是请求成功后执行的方法)
                                error: function () {
                                }//ajax请求失败后执行的方法(可不传)
                            });
                            return false;
                        } else {
                            //return false;
                        }
                    }
                    //e.preventDefault();
                }
            });

        },
        commDocSearch:function(val){//搜索
            var t=this;
            var callback =function(o){
                t.getResource(val,function(n){
                    $('.pager').pager({pagenumber:o,pagecount:n,buttonClickCallback:callback});
                },o)
            };
            t.getResource(val,function(n){
                $('.pager').pager({pagenumber:1,pagecount:n,buttonClickCallback:callback});
            },1)
        },
        getResource:function(str,fn,pageIndex){//值，fn,pageindex
            var t=this;
            var _o={pageSize:t.params.pageSize,pageIndex:pageIndex,logoUseFlag:10,firstName:str,sessionCustomerId:$('#sesCustomerId').val()!=undefined?$('#sesCustomerId').val():"",platformId: $('#sesDepartment').val()||1};
            var _params = {paramJson: $.toJSON(_o)};
            var _callback = function(d){
                if(d&& d.responseObject.responseData&&!$.isEmptyObject(d.responseObject.responseData)&&d.responseObject.responseData.data_list.length){
                    var item = d.responseObject.responseData.data_list;
                    var arr=[];
                    var _temp ='';
                    $.each(item,function(j,je){
                        _temp = module.resourceListTemplate({tempName:'userList'})({
                            cid:je.customerPunditsEntity.customerId,
                            customerId:$('#sesCustomerId').val()!=""&&$('#sesCustomerId').val()!=undefined?$('#sesCustomerId').val():"",
                            userName:je.customerPunditsEntity.customerName,
                            state:2,
                            medicalTitle:je.customerPunditsEntity.medicalTitleShow!=undefined?je.customerPunditsEntity.medicalTitleShow:"",
                            company:je.customerPunditsEntity.company,
                            contribuNum:je.customerStatistic.contributionCount,
                            reviewNum:je.customerStatistic.reviewNum,
                            fansNum:je.customerStatistic.fansNum,
                            relationship:je.customerPunditsEntity.relationship,
                            logoUrl:je.customerAtt.logoUrl
                        });
                        arr.push(_temp);
                    });
                    $('.ev_noMathZj').hide();
                    $('.ev_doctorBox').html(arr);
                    // var _totalCount =d.responseObject.responseData.punditsCustomerCount;
                    // var _totalCount=d.responseObject.responseData.punditsCustomerCount;//punditsCustomerCount有效和无效数据总和bug55365
                    var _totalCount=d.responseObject.responseData.realPunditsNum;//realPunditsNum有效数据bug55365
                    $('.ev_totalCount').html(_totalCount);
                    var pageCount = Math.ceil(_totalCount/t.params.pageSize);
                    t.shareAction($.extend(_o,{dataShare:1}));
                    $('.pager').empty();
                    fn(pageCount);
                }else{
                    $('.ev_totalCount').html(0);
                    $('.pager').empty();
                    $('.ev_doctorBox').html("");
                    $('.ev_noMathZj').show();
                    $('.ev-shareContainer').hide();
                }

            };
            comm.ajax.async(t.opt.searchByName,_params,_callback);
        },
        shareAction:function(param){
            var t=this;
            $('.al-shareBox').hide();
            var sinaTitle=""; var qqTitle=""; var qZoneTitle="";
            module.share({
                container:$ ( ".ev-shareContainer" ),// 存放分享组件的父级
                type:2,// 默认为 1  1 ：社交分享  2 ：页面左下角全站分享
                url:document.location.href,// 分享链接， 默认取当前页链接
                h5Url:'',//h5页面的链接会生成微信二维码
                title:"",// 分享标题
                shareTrend:0,//0: 不需要站内动态分享  1 ：需要站内动态分享
                trendUrl:'',// 分享到站内动态的接口
                data:{},// 分享到站内动态的接口参数
                callback:function(){},// 分享到站内动态成功后回调函数
                triggerRequest:function(content){//事件点击
                    //获取分享话术
                    var o = $.extend(param,{"sceneType":getShareContentSense.professor,"resourceType":0});
                    $.ajax({
                        url: t.opt.getShareContent,
                        type: "post",
                        data: {paramJson: $.toJSON(o)},
                        dataType: 'json',
                        async:false,
                        success: function (d) {
                            if (d && d.responseObject.responseData && !$.isEmptyObject(d.responseObject.responseData) && d.responseObject.responseData.data_list.length) {
                                var item = d.responseObject.responseData.data_list[0];
                                content.pic = item.share_comm.shareImageUrl;
                                content.title=item.share_comm.shareTitle!=""?item.share_comm.shareTitle:document.title;
                                $.each(item.share_channel,function(i,el){
                                    if(el.shareChannel=='Sina'){
                                        sinaTitle=content.sinaTitle=el.shareDesc;
                                    }else if(el.shareChannel=="QQFriend"){
                                        qqTitle=content.qqTitle = el.shareTitle;
                                        content.qqSummary = el.shareDesc;
                                    }else if(el.shareChannel=="QZone"){
                                        qZoneTitle=content.qqZoneTitle=el.shareTitle;
                                        content.qqZoneSummary = el.shareDesc;
                                    }
                                });
                            }
                        }

                    });
                },
                shareSinaSuc:function(){
                    comm.shareLog({
                        shareType: "",
                        resourceId:"" ,
                        resourceType: "",
                        refId: "",
                        shareSence:shareSenceConst.discover_professor,
                        shareChannel:3,
                        shareContent:sinaTitle
                    });
                },
                shareQQSuc:function(){
                    comm.shareLog({
                        shareType: "",
                        resourceId:"" ,
                        resourceType: "",
                        refId: "",
                        shareSence:shareSenceConst.discover_professor,
                        shareChannel:2,
                        shareContent:qqTitle
                    });
                },
                shareQzoneSuc:function(){
                    comm.shareLog({
                        shareType: "",
                        resourceId:"" ,
                        resourceType: "",
                        refId: "",
                        shareSence:shareSenceConst.discover_professor,
                        shareChannel:1,
                        shareContent:qZoneTitle
                    });
                }
            });
        },
        youMayKnow:function(){
            module.personYouKnow({
                container:$('.ev_mayKnowPerson')
            });
        }
    };
    ctrl.init();
    scene.TopHeadLoginCallback= function(){
        ctrl.init('reloadData');
    };
});
