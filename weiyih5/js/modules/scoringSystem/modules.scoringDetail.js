/**
 * 功能描述：评分系统--评分详情页
 * 使用方法: url需携带一下参数：answerType 资源类型,
 *                              refId 资源id,
 *                              myScoreCustomerId 用户ID,
 * 注意事件：
 * 引入来源：
 *     作用：
 *
 * Created by JuKun on 2017/1/16.
 */

module.scoringSystemDetail=function(){
    //Log.createBrowse(167,'评分详情页');
    var container={
        op:{
            answerType:'',
            resourceId:'',
            resourceTitle:'',
            resourceUrl:'',
            customerId:'',
            refCustomerId:'',
            refName:'',
            data:''
        },
        path:{
            scoreReceive:M_CALL+"comm/data/score/level/json_list/",
            scoreSubmit:M_CALL+"customer/resource/score/create/",
            scoreDetail:M_CALL+"customer/resource/score/getComprehensiveScore/",
            scoreDetailScroll:M_CALL+"customer/resource/score/json_list/"
        },
        init:function(){
            var _this=this,
                receiveData='',
                scoreDetailPara=getpara();
            _this.op.answerType=scoreDetailPara.answerType;    //资源类型
            _this.op.resourceId=scoreDetailPara.refId;         //资源ID
            _this.op.refName=scoreDetailPara.resourceTitle;           //资源名称
            _this.op.refCustomerId=scoreDetailPara.refCustomerId;           //资源作者Id
            _this.op.customerId=scoreDetailPara.myScoreCustomerId;    //用户ID
            _this.evScoreDetailResult();
        },
        evScoreDetailResult:function(){
            var _this=this,
                receiveData='',
                reData={
                    "isValid":"1","visitSiteId":"2","sortType":"2","answerType":_this.op.answerType,"refId": _this.op.resourceId,"firstResult":"0","maxResult":"9999999"
                },
                reDataScroll={
                    "isValid":"1","scene":"10","visitSiteId":"2","sortType":"2","scoreType":_this.op.answerType,"myScoreCustomerId":_this.op.customerId,"refId": _this.op.resourceId,"pageIndex":"1","pageSize":"20"
                };
            _this.data=reDataScroll;
            _this.scoreAsync({
                data:reData,
                path:_this.path.scoreDetail,    //评分详情基础数据URL
                scoreBack:function(data){
                    if(data&&data.responseObject&&data.responseObject.responseData){
                        receiveData=data.responseObject.responseData;
                        $('.al-mainInner').append(_this.detailTemplate({receiveData:receiveData})).show();
                        _this.scoreCalculation(receiveData.currentStarLevel.currentStarLevel);
                        _this.scoreDetailScrollData(reDataScroll);
                    }
                }
            });
        },
        scoreDetailScrollData:function(Data){
            var _this=this,
                receiveData='',
                receiveDataMy='';
            _this.scoreAsync({
                data:Data,
                path:_this.path.scoreDetailScroll,    //评分详情瀑布流数据URL
                scoreBack:function(data){
                    if(data&&data.responseObject&&data.responseObject.responseData){
                        receiveData=data.responseObject.responseData.data_list?data.responseObject.responseData.data_list:"";
                        receiveDataMy=data.responseObject.responseData.data_list?data.responseObject.responseData.myScoreMap:"";
                        $('.al-scoreCommentBox').append(_this.detailTemplateScroll({receiveData:receiveData,receiveDataMy:receiveDataMy}));
                        $('.al-mainInner').append(_this.detailTemplateMyScore({receiveDataMy:receiveDataMy}));
                        _this.scrollPage();
                        _this.eventCenterDetail.init(_this);
                    }
                }
            });
        },
        scoreCalculation:function(sN){
            var scoreNumUp=Math.ceil(sN),
                scoreInt=Math.floor(sN),
                scoreFloat=Math.round((sN-scoreInt)*100)/100,
                scoreItemWidth=$('.al-mainInner').find('.al-bigScoreStarBox li').width();
            if(scoreFloat>0){
                $($('.al-mainInner').find('.al-bigScoreStarBox li')[scoreNumUp-1]).children().css("width",scoreItemWidth*scoreFloat);
            }
        },
        //Dome处理
        detailTemplate:function(dtv){
            var _this=this,
                _scoreDetailHtml='',
                _scoreHtmlNumTotal='',
                _scoreDetailHtmlHide='',
                //scoreTerminalTitle=obj.resourceTitle,
                highData=dtv.receiveData.highPraiseLabelGroup,
                badData=dtv.receiveData.badReviewLabelGroup,
                levelTotal=highData.length+badData.length,
                levelData=dtv.receiveData.currentStarLevel,
                currentScoreNum=levelData.currentScoreNum,
                levelStartItem=Math.ceil(levelData.currentStarLevel);
                //scoreResourceUrl=(obj.isTerminal==0?"javascript:;":_this.op.resourceUrl);
            if(levelTotal>2){
                if(highData.length>=2){
                    $.each(highData.slice(0,2),function(i,val){
                        var _list=val.split('_');
                        _scoreDetailHtml+='<figure class="al-scoreDetailsTagItem">'+_list[0]+"("+_list[1]+")"+'<b></b></figure>';
                    });
                }else if(highData.length>0){
                    $.each(highData,function(i,val){
                        var _list=val.split('_');
                        _scoreDetailHtml+='<figure class="al-scoreDetailsTagItem">'+_list[0]+"("+_list[1]+")"+'<b></b></figure>';
                    });
                }else{
                    $.each(badData.slice(0,1),function(i,val){
                        var _list=val.split('_');
                        _scoreDetailHtml+='<figure class="al-scoreDetailsTagItem">'+_list[0]+"("+_list[1]+")"+'<b class="badIcon"></b></figure>';
                    });
                }
                if(highData.length>0){
                    $.each(highData,function(i,val){
                        var _list=val.split('_');
                        _scoreDetailHtmlHide+='<figure class="al-scoreDetailsTagItem">'+_list[0]+"("+_list[1]+")"+'<b></b></figure>';
                    });
                }
                if(badData.length>0){
                    $.each(badData,function(i,val){
                        var _list=val.split('_');
                        _scoreDetailHtmlHide+='<figure class="al-scoreDetailsTagItem">'+_list[0]+"("+_list[1]+")"+'<b class="badIcon"></b></figure>';
                    });
                }
            }else{
                if(highData.length>0){
                    $.each(highData,function(i,val){
                        var _list=val.split('_');
                        _scoreDetailHtml+='<figure class="al-scoreDetailsTagItem">'+_list[0]+"("+_list[1]+")"+'<b></b></figure>';
                    });
                }
                if(badData.length>0){
                    $.each(badData,function(i,val){
                        var _list=val.split('_');
                        _scoreDetailHtml+='<figure class="al-scoreDetailsTagItem">'+_list[0]+"("+_list[1]+")"+'<b class="badIcon"></b></figure>';
                    });
                }
            }
            for (var k=1;k<=levelStartItem;k++){
                _scoreHtmlNumTotal+='<li><b></b></li>'
            }
            if(levelStartItem<5){
                for (var l=1;l<=5-levelStartItem;l++){
                    _scoreHtmlNumTotal+='<li></li>'
                }
            }
            return '<header class="al-indexHeader"><figure class="al-indexHeaderItem ev-backToMain"><a href="javascript:;"><img src="//img50.allinmd.cn/pages/personal/arrow_back.png" alt=""> ' +
                '</a></figure><figure class="al-indexHeaderItem"><h1>'+currentScoreNum+'人评分</h1></figure><figure class="al-indexHeaderItem"></figure></header><section class="al-overallScorePart"> ' +
                '<h3>综合评分<span>'+levelData.currentStarLevel+'分</span></h3><ul class="al-bigScoreStarBox">'+_scoreHtmlNumTotal+'</ul>' +
                '<div class="al-scoreTagSwitchArea"><section class="al-scoreDetailsTagBox show">'+_scoreDetailHtml+'</section>' +
                '<section class="al-scoreDetailsTagBox hide" style="display: none">'+_scoreDetailHtmlHide+'</section>' +
                '<article class="al-scoreDetailsTag"><span class="al-scoreDetailShow" style="display: '+(levelTotal>2?"block":"none")+'">展开<i class="al-scoreTagOpenIcon"></i></span>' +
                '<span class="al-scoreDetailHide" style="display: none">收起<i></i></span></article></div></section><div class="al-scoreCommentBox"></div>';
        },
        detailTemplateMyScore:function(dmv){
            var myScoreState=dmv.receiveDataMy.myScoreState,  // 0未评分 1已评分
                _scoreHtmlNum='';
            if(myScoreState==0){
                return '<footer class="al-scoreDetailsFoot">立即评分</footer>';
            }else{
                var scoreNum=parseInt(dmv.receiveDataMy.score);
                for (var k=1;k<=scoreNum;k++){
                    _scoreHtmlNum+='<li><b></b></li>'
                }
                if(scoreNum<5){
                    for (var l=1;l<=5-scoreNum;l++){
                        _scoreHtmlNum+='<li></li>'
                    }
                }
                return '<footer class="al-myScorePart">我的评分 <ul class="al-littleScoreStarBox">'+_scoreHtmlNum+'</ul></footer>';
            }
        },
        detailTemplateScroll:function(dsv){
            var _scoreScrollHtml='',
                scoreDetailScroll=dsv.receiveData;
            $.each(scoreDetailScroll,function(i,val){
                var _scoreScrollTipHtml='',
                    _scoreHtmlNum='',
                    scoreAnswerContent=val.scoreAnswerContent.split(','),
                    scoreDate=comm.date.diffDay_one(val.createTime,comm.date.local_time()),
                    isAnonymous=val.isAnonymous,
                    userHomeUrl=isAnonymous==0?"javascript:;":"//www.allinmd.cn/pages/personal/others_contribution.html?cid="+val.customerId;
                if(val.scoreAnswerContent.length>0){
                    $.each(scoreAnswerContent,function(i,vally){
                        _scoreScrollTipHtml+='<figure class="al-scoreDetailsTagItem">'+vally+'<b class="'+(val.scoreAnswerBehalf==2?"badIcon":"")+'"></b></figure>';
                    });
                }
                val.score = parseInt(val.score)>5?5:val.score;//评分大于5分显示5分
                for (var k=1;k<=val.score;k++){
                    _scoreHtmlNum+='<li><b></b></li>'
                }
                if(val.score<5){
                    for (var l=1;l<=5-val.score;l++){
                        _scoreHtmlNum+='<li></li>'
                    }
                }
                _scoreScrollHtml+='<article class="al-scoreCommentItem"><figure class="al-scoreCommentUserBox">' +
                    '<a href="'+userHomeUrl+'"><img src="'+(isAnonymous==0?"//img10.allinmd.cn/v3/terminal/anonymousUserImg2.png":val.customerLogoUrl)+'" alt=""/></a>' +
                    '<article class="al-scoreUserDetails"><span class="al-userName">'+(isAnonymous==0?"匿名":val.customerName)+'<i style="display: '+(isAnonymous==0?"none":"inline-block")+'"></i></span>' +
                    '<span class="al-commentTime">'+scoreDate+'</span><p class="al-userTitle">'+val.medicalTitleShow+'</p></article></figure>' +
                    '<ul class="al-littleScoreStarBox">'+_scoreHtmlNum+'</ul>' +
                    '<section class="al-scoreDetailsTagBox">'+_scoreScrollTipHtml+'</section>' +
                    '<p class="al-scoreCommentText">'+val.otherContent+'</p></article>';
            });
            return _scoreScrollHtml;
        },
        //详情页瀑布流
        scrollPage:function () {
            var _t = this;
            var num=2;
            $(".al-mainInner").off("scroll").scrollPagination({
                'contentPage': _t.path.scoreDetailScroll,
                'contentData': $.extend(_t.data, {
                    pageIndex: function () {
                        return num++;
                    }
                }),
                //'scrollTarget':$('.al-mainInner'),
                'scrollTarget':$(window),
                'heightOffset':0,
                'delaytime': 1000,
                'type': "POST",
                'beforeLoad': function () {
                    comm.loading.show();
                },
                'afterLoad': function (elementsLoaded) {
                    comm.loading.hide();
                },
                'loader': function (data) {
                    if ($.isEmptyObject(data)) {
                        $(".al-mainInner").attr("scrollPagination", "disabled");
                        return false;
                    } else {
                        if ($.isEmptyObject(data.responseObject.responseData) || (data.responseObject.responseData.data_list && data.responseObject.responseData.data_list.length == 0)) {
                            $(".al-mainInner").attr("scrollPagination", "disabled");
                            return false;
                        }
                        else {
                            var result = data.responseObject.responseData.data_list;
                            var html=_t.detailTemplateScroll({receiveData:result});
                            $(".al-scoreCommentBox").append(html);
                        }
                    }
                }
            });
        },
        //评分详情事件
        eventCenterDetail:{
            init:function(t){
                var _t=this;
                _t.click(t);
            },
            click:function(t){
                $('.al-mainInner').find('.ev-backToMain').on("click",function(){
                    if (document.referrer.lastIndexOf("/passport/") > -1 || document.referrer.indexOf("seminar") > -1 || !document.referrer) {
                      g_sps.jump(null,"/");
                    } else {
                        history.back();
                    }
                    return false;
                });
                //标签展开
                $('.al-mainInner').find('.al-scoreDetailShow').on("click",function(){
                    $(this).hide().siblings().show();
                    $('.al-mainInner').find('.al-scoreDetailsTagBox.show').hide().siblings('.al-scoreDetailsTagBox.hide').show();
                });
                //标签收起
                $('.al-mainInner').find('.al-scoreDetailHide').on("click",function(){
                    $(this).hide().siblings().show();
                    $('.al-mainInner').find('.al-scoreDetailsTagBox.hide').hide().siblings('.al-scoreDetailsTagBox.show').show();
                });
                //立即评分
                $('.al-scoreDetailsFoot').on('click',function(){
                    // 厂商\医助不允许评分
                    if(TempCache.getItem("customerRole") === "14" ||
                        TempCache.getItem("customerRole") === "15" ||
                        TempCache.getItem("customerRole") === "13"){

                        comm.toastFactoryAuth(null);
                        
                    }else{
                        var _this=t,
                            reData={
                            "isValid":"1",
                            "sortType":"3",
                            "cdscSortType":"2",
                            "resourceTitle":_this.op.refName,  //资源名称
                            "answerType":_this.op.answerType,       //资源类型
                            "firstResult":"0",
                            "maxResult":"9999999"
                        };
                        _this.scoreAsync({
                            data:reData,
                            path:_this.path.scoreReceive,
                            scoreBack:function(data){
                                if(data&&data.responseObject&&data.responseObject.responseData){
                                    var receiveData=data.responseObject.responseData;
                                    _this.evScoring({answerType: _this.op.answerType,receiveData:receiveData,resourceTitle:_this.op.refName});//评分
                                }
                            }
                        });
                    }
                })
            }
        },
        evScoring:function(essv){
            var _this=this;
            $('body').append(_this.scoreTemplate({answerType:essv.answerType,receiveData:essv.receiveData,resourceTitle:essv.resourceTitle}));
            $('.al-scorePagePopBox').find('.al-bigScoreStarBox li b').hide();
            $('.al-scorePagePopBox').find('.al-scoreResultText').hide();
            $('.al-scorePagePopBox').find('.al-scoreQuesTitle[data-id='+4+']').show().siblings('.al-scoreQuesTitle').hide();
            $('.al-mainInner').hide();
            $('.al-scorePopBox').show().find('.al-scoreContentBox').show();
            //初始化事件
            _this.eventCenter.init(_this);
        },
        //评分Dome
        scoreTemplate:function(sv){
            var _scoreHtml='',
                _levelWordHtml='',
                _levelQuesTitle='',
                _tipsHtml='',
                scoreLevelWord=sv.receiveData?sv.receiveData.data_list:'',
                scoreAnswerTitle=sv.receiveData?sv.receiveData.cdsc_List:'',
                resourceTitle=comm.getStrLen(sv.resourceTitle,26);
            $.each(scoreLevelWord,function(i,val){
                _levelWordHtml+='<p class="al-scoreResultText" data-id="'+i+'">'+val.scoreGuide+'</p>';
                _levelQuesTitle+='<figcaption class="al-scoreQuesTitle" data-id="'+i+'">'+val.scoreQuestion+'</figcaption>';
            });
            $.each(scoreAnswerTitle,function(i,val){
                _tipsHtml+='<li data-id="'+i+'" class="ev-scoreTag">'+val.answerTitle+'</li>';
            });
            _scoreHtml+='<section class="al-scorePagePopBox"><header class="al-indexHeader al-scorePageHead"><figure class="al-indexHeaderItem ev-scoreCloseBtn al-scoreCloseBtn">' +
                '关闭</figure><figure class="al-indexHeaderItem"><h1>评分</h1></figure><figure class="al-indexHeaderItem"></figure></header><div class="al-scoreMainContentBox">' +
                '<h3 class="al-resourcesTitle">'+resourceTitle+'</h3><ul class="al-bigScoreStarBox"><li><b></b></li><li><b></b></li><li><b></b></li><li><b></b></li><li><b></b></li></ul> ' +
                ''+_levelWordHtml+'<p class="al-anonymousScore"><span><i class="al-selectBtn"></i>匿名评分</span></p><figure class="al-scoreContentTagList">' +
                ''+_levelQuesTitle+'<ul class="al-scoreTagSelect">'+_tipsHtml+'<li class="al-scoreOtherQues">其他原因</li></ul><div class="al-scorePageInputBox" style="visibility: hidden"><textarea  name="" id="" max="100" cols="0" rows="0" placeholder="请输入你的想法"></textarea>' +
                '<span class="al-NumPrompt"></span></div></figure></div>' +
                '<footer class=" al-scorePageNoSubmitBtn"><i></i><span>提交</span></footer></section>';
            return _scoreHtml;
        },
        //评分事件
        eventCenter:{
            init:function(t){
                var _t=this;
                _t.close(t);
                _t.startSelect(t);
            },
            close:function(t){
                //关闭评分页弹层
                $('.al-scoreCloseBtn').on("click",function(){
                    comm.confirmBox({
                        title: '你的评价有助于提升资源的整体质量，真的要放弃吗？',
                        cancel: '不打了',
                        ensure: '继续打分',
                        callBack: function() {
                            return false;
                        },
                        cancelCallback: function() {
                            $('.al-scoreCloseBtn').closest('.al-scorePagePopBox').remove();
                            $('.al-mainInner').show();
                        }
                    });
                });
                //输入框
                comm.textChange({
                    "$tex":$('.al-scorePagePopBox').find('.al-scorePageInputBox textarea'),
                    "$num":$('.al-scorePagePopBox').find('.al-NumPrompt'),
                    "noTop":1,
                    "numTip":10
                })
            },
            startSelect:function(t){
                var _t=this;
                $('.al-scorePagePopBox').find('.al-bigScoreStarBox li').on("click",function(){
                    $('.al-scorePagePopBox').find('.al-scorePageNoSubmitBtn').addClass('al-scorePageFooterSubmitBtn');
                    $(this).siblings().children().hide().removeClass('active');
                    $(this).children().show().addClass('active');
                    $(this).prevAll().children().show().addClass('active');
                    var startNum=$(this).parent().find('.active').length-1;
                    $('.al-scorePagePopBox').find('.al-scoreResultText').hide().removeClass('active').eq(startNum).show().addClass('active');
                    $('.al-scorePagePopBox').find('.al-scoreQuesTitle[data-id='+startNum+']').show().addClass('active').siblings('.al-scoreQuesTitle').hide().removeClass('active');
                    _t.scoreSubmitBtn(t);
                });
                //匿名
                $('.al-anonymousScore span').on("click",function(){
                    $(this).children().toggleClass('al-selectedBtn');
                });
                //标签
                $('.al-scoreTagSelect li').on("click",function(){
                    $(this).toggleClass('active');
                    if($('.al-scoreOtherQues').hasClass('active')){
                        $('.al-scorePagePopBox').find('.al-scorePageInputBox').css("visibility","visible");
                    }else{
                        $('.al-scorePagePopBox').find('.al-scorePageInputBox').css("visibility","hidden");
                    }
                })
            },
            scoreSubmitBtn:function(t){
                $('.al-scorePagePopBox').find('.al-scorePageFooterSubmitBtn').attr("on","true");
                $('.al-scorePagePopBox').find('.al-scorePageFooterSubmitBtn').off("click").on("click",function(){
                    var $this = $(this);
                    if($(this).attr("on")=="true"){
                        $(this).attr("on","false");
                        $(this).addClass('al-scorePageSubmitIngBtn').children('span').text("正在提交");
                        $(this).off("click");
                        var scoreNum=$('.al-scorePagePopBox').find('.al-bigScoreStarBox').find('.active').length,
                            otherContent=$('.al-scorePagePopBox').find('.al-scorePageInputBox textarea').val(),
                            isAnonymous=$('.al-scorePagePopBox').find('.al-anonymousScore').find('.al-selectedBtn'),
                            scoreAnswerContentTotal=$('.al-scorePagePopBox').find('.al-scoreTagSelect').children('.ev-scoreTag.active'),
                            _scoreAnswerContent='',
                            scoreAnswerContent='';
                        if(scoreAnswerContentTotal.length>0) {
                            for (var i = 0; i < scoreAnswerContentTotal.length; i++) {
                                _scoreAnswerContent += $(scoreAnswerContentTotal[i]).text() + ',';
                            }
                            scoreAnswerContent=_scoreAnswerContent.substring(0,_scoreAnswerContent.length-1);
                        }
                        var data={
                            "customerId":t.op.customerId,     //用户ID  (t.op.customerId)
                            "scoreType": t.op.answerType,     //资源类型
                            "refId": t.op.resourceId,         //资源ID
                            "refName": t.op.refName,          //资源名称
                            "refCustomerId":t.op.refCustomerId,  //作者ID （t.op.refCustomerId）
                            "score":scoreNum>5?5:scoreNum,                 //个数
                            "scoreAnswerBehalf":scoreNum>3?"1":"2",  // 1 2差评
                            "scoreGuide": $('.al-scorePagePopBox').find('.al-scoreResultText[data-id='+(scoreNum-1)+']').text(),            //引导语
                            "scoreQuestion": $('.al-scorePagePopBox').find('.al-scoreQuesTitle[data-id='+(scoreNum-1)+']').text(),    //问题
                            "scoreAnswerContent":scoreAnswerContent,   //标签
                            "isOther":otherContent.length>0?"1":"0",   //1有 0没有
                            "otherContent":otherContent,      //文本框内容
                            "isAnonymous":isAnonymous.length>0?"0":"1"       //是否匿名(0-匿名、1-不匿名)
                        };
                        t.scoreAsync({
                            data:data,
                            path: t.path.scoreSubmit,
                            scoreBack:function(data){
                                $this.attr("on","true");
                                if(location.href.lastIndexOf("scoreDetails.html")>-1){//评分详情页
                                    popup("你的评价已生效，感谢您的参与");
                                    setTimeout(function(){
                                        window.location.reload();
                                    },2000)
                                }else{
                                    $('.al-scorePagePopBox').find('.al-scorePageFooterSubmitBtn').removeClass('al-scorePageSubmitIngBtn').addClass('al-scorePageSubmitOkBtn').off("click").children('span').text("提交成功");
                                    $('.al-scorePagePopBox').delay(3000).hide(0);
                                    $('.al-mainInner').show();
                                    $('.al-mainInner').find('.al-scoreDetailsFoot').remove();
                                    var _html=t.detailTemplateMyScore({receiveDataMy:{myScoreState:1,score:scoreNum}});
                                    $('.al-mainInner').append(_html);
                                    setTimeout(function(){
                                        popup("你的评价已生效，感谢您的参与");
                                    },3000)
                                }

                            }
                        })
                    }

                })
            }
        },
        scoreAsync:function(sv){  //异步数据
            var t=this,
                params={paramJson: $.toJSON(sv.data)};
            $.ajax({
                url : sv.path,
                type : "POST",
                data :  params,
                //async : false,
                time : 5000,
                success : function(data){
                    //comm.LightBox.hideloading();
                    sv.scoreBack(data);
                },
                error : function(){
                     //comm.LightBox.hideloading();
                }
            });
        }
    };
    container.init();
};
module.scoringSystemDetail();