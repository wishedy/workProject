/**
 * 功能描述：评分系统（视频 文库 病例，消息）
 * 使用方法: ".ev-scoring" 评分父容器类名
 *           ".ev-startItem" 评分事件绑定类名
 *           ".ev-scoreDetail" 评分详情事件绑定类名
 * module.scoringSystem({
                   isTerminal:'',      //（必选）（0终端页，1非终端页）
                   answerType:'',      //(可选)资源名称类型(仅终端页，1视频，2文库，7病例)
                   resourceTitle:'',   //(可选)资源名称（仅终端页）
                   scoreTerminal:function(Object){},  //（可选,Object.scoreNum）（终端页评分成功回调,返回值1-5）
                   scoreVideoStop:function(){};       //（可选）（仅视频终端页 暂停视频）
                   scoreTerminalVideo:function(){},   //（可选）（仅视频终端页 视频蒙层评分入口）
                   scoreMessage:function(){}          //（可选）（仅消息页打开评分详情弹层回调）
                 })
 * 注意事件：
 * 引入来源： comm.textChange({})
 *     作用：
 *
 * Created by JuKun on 2016/12/27.
 */
module.scoringSystem=function(obj){
    var container={
        op:{
            wordTotal:500,
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
            scoreReceive:PC_CALL+"comm/data/score/level/json_list/",
            scoreSubmit:PC_CALL+"customer/resource/score/create/",
            scoreDetail:PC_CALL+"customer/resource/score/getComprehensiveScore/",
            scoreDetailScroll:PC_CALL+"customer/resource/score/json_list/"
        },
        init:function(obj){
            var _this=this,
                receiveData='',
                answerType=obj.isTerminal==0?obj.answerType:'',  //终端页类型(1视频，2文库，7病例)
                resourceTitle=obj.isTerminal==0?obj.resourceTitle:'',  //资源名称
                reData={
                    "isValid":"1",
                    "sortType":"3",
                    "cdscSortType":"2",
                    "resourceTitle":resourceTitle,  //资源名称
                    "answerType":answerType,       //资源类型
                    "firstResult":"0",
                    "maxResult":"9999999"
                };
            _this.op.resourceTitle=resourceTitle;
            switch (obj.isTerminal){
                case 0:
                    _this.op.answerType=answerType;
                    _this.op.resourceId=$('#resourceId').val();        //资源ID
                    _this.op.refName=resourceTitle;                    //资源名称
                    _this.op.customerId=$('#sesCustomerId').val();     //用户ID
                    _this.op.refCustomerId=$('#refCustomerId').val();  //作者ID
                    _this.scoreAsync({
                        data:reData,
                        path:_this.path.scoreReceive,
                        scoreBack:function(data){
                            if(data&&data.responseObject&&data.responseObject.responseData){
                                receiveData=data.responseObject.responseData;
                                _this.evScore({answerType:answerType,receiveData:receiveData,resourceTitle:resourceTitle});      //评分
                            }
                        }
                    });
                    _this.evScoreDetail();
                    break;
                case 1:
                    _this.evScoreDetail();
                    break;
            }
        },
        //点击我要评分验证登录认证
        evScore:function(esv){
            var _this=this;
            if(!$("body").attr("scorClick")){
                $("body").attr("scorClick","false");
            }
            var startItem = $('.ev-scoring .ev-startItem');
            startItem.hover(function(){
                $(this).addClass("al-colorFull").prevAll().addClass("al-colorFull");
            },function(){
                $(".al-colorFull").removeClass("al-colorFull");
            });
            startItem.on("click",function(){
                obj.scoreVideoStop();
                var elementClick=$(this);
                if($("body").attr("scorClick")=="false"){
                    $("body").attr("scorClick","true");
                    user.login({
                        callback: function () {
                            if(_this.op.answerType==1){
                                videoScore({
                                    vScoreBack:function(isScoring){
                                        $("body").attr("scorClick","false");
                                        if(isScoring==0){
                                            _this.evScoring({esv:esv,element:elementClick});
                                        }
                                    }
                                })
                            }else{
                                $("body").attr("scorClick","false");
                                _this.evScoring({esv:esv,element:elementClick});
                            }
                        },
                        scene: privilegeSceneConst.eSceneDoctorOnly,
                        onClose:function(){
                            history.back(-1);
                        },
                        onAuthCancel:"back",
                        stay:true
                    });
                    comm.creatEvent({
                        triggerType:"评分",
                        keyword:"我要评分",
                        actionId:31,
                        refId:$('#resourceId').val(),
                        refType:$("#resourceType").val()
                    });
                }

            });
        },
        //评分处理
        evScoring:function(essv){
            var _this=this;
            $('body').append(_this.scoreTemplate({answerType:essv.esv.answerType,receiveData:essv.esv.receiveData,resourceTitle:essv.esv.resourceTitle}));
            //首次进入评分页是星星数量的控制及两处对应文案的显示
            var StartIndex=$(essv.element).index(),
                startElement=$('.al-scoreContentBox').find('.al-bigScoreStarBox li b').hide();
            for(var i=0;i<=StartIndex;i++){
                $(startElement[i]).show().addClass('active');
            }
            if(obj.answerType!==undefined&&obj.answerType!==""&&obj.answerType==1){
                var isAnonymous=$('.ev-isAnonymous').children();
                if($(isAnonymous).hasClass('active')){
                }else{
                    $('.al-anonymousScore span').children().removeClass('active');
                }
            }
            $('.al-scoreContentBox').find('.al-scoreText').hide().eq(StartIndex).show();//尽量用连缀
            $('.al-scoreContentBox').find('.al-scoreQuesTitle[data-id='+StartIndex+']').show().siblings('.al-scoreQuesTitle').hide();
            $('body').css("overflow","hidden");
            $('.al-scorePopBox').show().find('.al-scoreContentBox').show();
            //初始化事件
            _this.eventCenter.init(_this);
        },
        //评分详情验证登录认证
        evScoreDetail:function(esdv){
            var _this=this;
            $('body').append('<div class="al-scoreDetailsPopBox"></div>');
            $('.ev-scoreDetail').on("click",function(){
                var elementClick=$(this);
                    user.login({
                        callback: function () {
                            comm.creatEvent({
                                triggerType: "终端页功能",
                                keyword: "评分详情",
                                actionId: 11050
                            });
                            _this.evScoreDetailResult({element:elementClick});
                        },
                        scene: privilegeSceneConst.eSceneTypeAuth,
                        onClose:function(){
                            history.back(-1);
                        },
                        onAuthCancel:"back",
                        stay:true
                    });
            });
        },
        //评分详情处理
        evScoreDetailResult:function(eDRv){
            var _this=this,
                receiveData='',
                reData={
                    "isValid":"1","visitSiteId":"1","sortType":"2","answerType":_this.op.answerType,"refId":_this.op.resourceId,"firstResult":"0","maxResult":"9999999"
                },
                reDataScroll={
                    "isValid":"1","scene":"10","visitSiteId":"1","sortType":"2","scoreType":_this.op.answerType,"myScoreCustomerId":_this.op.customerId,"refId":_this.op.resourceId,"pageIndex":"1","pageSize":"20"
                };
            if(obj.isTerminal==1){
                _this.op.resourceTitle=$(eDRv.element).data('title');
                _this.op.resourceUrl=$(eDRv.element).data('resourceurl');
                //综合评分参数
                reData.refId=$(eDRv.element).data('refid');  //资源Id
                reData.answerType=$(eDRv.element).data('answertype');         //资源类型(1视频，2文库，7病例)
                //综合评分瀑布流参数
                reDataScroll.myScoreCustomerId=$('#sesCustomerId').val();  //用户Id
                reDataScroll.refId=$(eDRv.element).data('refid');         //资源Id
                reDataScroll.scoreType=$(eDRv.element).data('answertype');     //资源类型(1视频，2文库，7病例)
            }
            _this.data=reDataScroll;
            _this.scoreAsync({
                data:reData,
                path:_this.path.scoreDetail,    //评分详情基础数据URL
                scoreBack:function(data){
                    if(data&&data.responseObject&&data.responseObject.responseData){
                        receiveData=data.responseObject.responseData;
                        $('.al-scoreDetailsPopBox').html(_this.detailTemplate({receiveData:receiveData})).show();
                        _this.scoreCalculation(receiveData.currentStarLevel.currentStarLevel);
                        if(comm.browser.isIe8()){//ie8不支持transform
                            var boxHeight=$('.al-scoreDetailsContentBox');
                            boxHeight.css({'margin-left':'-354px','margin-top':-boxHeight.height()/2+'px'})
                        }
                        $("body").css("overflow","hidden");
                        _this.scoreDetailScrollData(reDataScroll);
                    }
                }
            });
        },
        scoreDetailScrollData:function(Data){
            var _this=this,
                receiveData='';
            _this.scoreAsync({
                data:Data,
                path:_this.path.scoreDetailScroll,    //评分详情瀑布流数据URL
                scoreBack:function(data){
                    if(data&&data.responseObject&&data.responseObject.responseData){
                        receiveData=data.responseObject.responseData.data_list?data.responseObject.responseData.data_list:"";
                        $('.al-scoreDetailsPopBox .al-scoreCommentPartBox').append(_this.detailTemplateScroll({receiveData:receiveData}));
                        _this.scrollPage();
                    }
                }
            });
            _this.eventCenterDetail.init(_this);
        },
        scoreCalculation:function(sN){
            var scoreNumUp=Math.ceil(sN),
                scoreInt=Math.floor(sN),
                scoreFloat=Math.round((sN-scoreInt)*100)/100,
                scoreItemWidth=$('.al-scoreDetailsPopBox').find('.al-bigScoreStarBox li').width();
            if(scoreFloat>0){
                $($('.al-scoreDetailsPopBox').find('.al-bigScoreStarBox li')[scoreNumUp-1]).children().css("width",scoreItemWidth*scoreFloat);
            }
        },
        //Dome处理
        scoreTemplate:function(sv){
            var _scoreHtml='',
                _levelWordHtml='',
                _levelQuesTitle='',
                _tipsHtml='',
                scoreLevelWord=sv.receiveData?sv.receiveData.data_list:'',
                scoreAnswerTitle=sv.receiveData?sv.receiveData.cdsc_List:'';
            $.each(scoreLevelWord,function(i,val){
                _levelWordHtml+='<p class="al-scoreText" data-id="'+i+'">'+val.scoreGuide+'</p>';
                _levelQuesTitle+='<figcaption class="al-scoreQuesTitle" data-id="'+i+'">'+val.scoreQuestion+'</figcaption>';
            });
            $.each(scoreAnswerTitle,function(i,val){
                _tipsHtml+='<li data-id="'+i+'">'+val.answerTitle+'</li>';
            });
            _scoreHtml+='<div class="al-scorePopBox"><figure class="al-scoreContentBox"><section class="al-closeContent"><b class="al-scoreCloseBtn"></b></section><section class="al-contentBox"><figcaption>'+sv.resourceTitle+'</figcaption>' +
                '<ul class="al-bigScoreStarBox"><li><b></b></li><li><b></b></li><li><b></b></li><li><b></b></li><li><b></b></li></ul>'+_levelWordHtml+'' +
                '<p class="al-anonymousScore"><span><b></b>匿名评分</span></p><figure class="al-contentDefect">'+_levelQuesTitle+'' +
                '<ul class="al-contentMatterItem">'+_tipsHtml+'</ul>' +
                '<div class="al-scopeFeedback"><textarea name="" id="" max="100" cols="0" rows="0" placeholder="请输入你的想法"></textarea><span class="active al-scoringNum"></span></div>' +
                '<p class="al-scoreBtn"><span class="al-scoreCancelBtn">取消</span><span class="al-submitBtn">提交</span></p></figure></section></figure></div>';
            return _scoreHtml;
        },
        detailTemplate:function(dtv){
            var _this=this,
                _scoreDetailHtml='',
                _scoreHtmlNumTotal='',
                scoreTerminalTitle=obj.resourceTitle,
                highData=dtv.receiveData.highPraiseLabelGroup,
                badData=dtv.receiveData.badReviewLabelGroup,
                levelData=dtv.receiveData.currentStarLevel,
                levelStartItem=Math.ceil(levelData.currentStarLevel),
                scoreResourceUrl=(obj.isTerminal==0?"javascript:;":_this.op.resourceUrl);
            if(levelStartItem>5){//如果评分大于5
                levelStartItem=5;
            }
            $.each(highData,function(i,val){
                var _list=val.split('_');
                _scoreDetailHtml+='<li>'+_list[0]+'<span>('+_list[1]+')<b></b></span></li>'
            });
            $.each(badData,function(i,val){
                var _list=val.split('_');
                _scoreDetailHtml+='<li>'+_list[0]+'<span>('+_list[1]+')<b class="active"></b></span></li>'
            });
            for (var k=1;k<=levelStartItem;k++){
                _scoreHtmlNumTotal+='<li><b></b></li>'
            }
            if(levelStartItem<5){
                for (var l=1;l<=5-levelStartItem;l++){
                    _scoreHtmlNumTotal+='<li></li>'
                }
            }
            return '<figure class="al-scoreDetailsContentBox"><figure class="al-closeContent"><i class="al-scorePopCloseBtn"></i></figure><section class="al-scoreContent"><figcaption><a href="'+scoreResourceUrl+'">' +
                '<span class="al-scoreDetailsTitle">'+scoreTerminalTitle+'</span><b class="al-scoreDetailsArrowIcon" style="display:'+(obj.isTerminal==0?"none":"inline-block")+'"></b></a></figcaption><div class="al-overallScoreBox">' +
                '<header>综合评分<span>'+(levelData.currentStarLevel>5?5.0:levelData.currentStarLevel)+'分</span></header>' +
                '<ul class="al-bigScoreStarBox">'+_scoreHtmlNumTotal+'</ul></div>' +
                '<ul class="al-overallTagListBox">'+_scoreDetailHtml+'</ul>' +
                '<p class="al-scoreDetailsPopLine"></p><div class="al-scoreCommentPartBox"></div></section></figure>'
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
                    //todo 新增cid==0,不跳转
                    userHomeUrl=(isAnonymous||val.customerId==0)?"javascript:;":"/pages/personal/others_contribution.html?cid="+val.customerId;
                if(val.scoreAnswerContent.length>0){
                    $.each(scoreAnswerContent,function(i,vally){
                        _scoreScrollTipHtml+='<li>'+vally+'<b class="'+(val.scoreAnswerBehalf==2?"active":"")+'"></b></li>';
                    });
                }
                var score=val.score;
                if(score>5){//如果评分大于5
                    score=5;
                }
                for (var k=1;k<=score;k++){
                    _scoreHtmlNum+='<li><b></b></li>'
                }
                if(val.score<5){
                    for (var l=1;l<=5-val.score;l++){
                        _scoreHtmlNum+='<li></li>'
                    }
                }
                _scoreScrollHtml+= '<section class="al-scoreDetailsCommentPart"><a href="'+userHomeUrl+'" class="al-scoreCommentUserImg"><img src="'+(isAnonymous==0?"//img10.allinmd.cn/v3/terminal/anonymousUserImg2.png":val.customerLogoUrl)+'" alt=""></a>' +
                    '<div class="al-scoreUserCommentInfo"><a href="javascript:;" class="al-scoreCommentUserName">'+(isAnonymous==0?"匿名":val.customerName)+'<i class="al-vipUser" style="display: '+(isAnonymous==0?"none":"inline-block")+'"></i></a><span class="al-scoreCommentTime">'+scoreDate+'</span>' +
                    '<p>'+val.medicalTitleShow+'</p></div><ul class="al-littleScoreStarBox">'+_scoreHtmlNum+'</ul>' +
                    '<ul class="al-overallTagListBox">'+_scoreScrollTipHtml+'</ul>' +
                    '<p class="al-userScoreCommentText">'+val.otherContent+'</p></section>'
            });
            return _scoreScrollHtml;
        },
        //详情页瀑布流
        scrollPage:function () {
            var _t = this;
            var num=2;
            $(".al-scoreCommentPartBox").off("scroll").scrollPagination({
                'contentPage': _t.path.scoreDetailScroll,
                'contentData': $.extend(_t.data, {
                    pageIndex: function () {
                        return num++;
                    }
                }),
                'scrollTarget':$('.al-scoreDetailsContentBox'),
                'heightOffset':0,
                'delaytime': 1000,
                'type': "POST",
                'beforeLoad': function () {
                    comm.LightBox.showloading();
                },
                'afterLoad': function (elementsLoaded) {
                    comm.LightBox.hideloading();
                },
                'loader': function (data) {
                    if ($.isEmptyObject(data)) {
                        $(".al-scoreCommentPartBox").attr("scrollPagination", "disabled");
                        return false;
                    } else {
                        if ($.isEmptyObject(data.responseObject.responseData) || (data.responseObject.responseData.data_list && data.responseObject.responseData.data_list.length == 0)) {
                            $(".al-scoreCommentPartBox").attr("scrollPagination", "disabled");
                            return false;
                        }
                        else {
                            var result = data.responseObject.responseData.data_list;
                            var html=_t.detailTemplateScroll({receiveData:result});
                            $(".al-scoreCommentPartBox").append(html);
                        }
                    }
                }
            });
        },
        //评分事件
        eventCenter:{
            init:function(t){
                var _t=this;
                _t.close(t);
                _t.startSelect(t);
                _t.scoreSubmitBtn(t);
            },
            close:function(t){
                //关闭评分页弹层
                $('.al-scoreCloseBtn').on("click",function(){
                    $(this).closest('.al-scorePopBox').remove();
                    $("body").css("overflow","");
                    //事件埋点
                    comm.creatEvent({
                        triggerType:"全站功能按钮点击",
                        keyword:"终端页评分功能关闭",
                        actionId:43,
                        refType: $('#resourceTyps').val(),
                        refId: $('#resourceId').val()
                    });
                });
                $('.al-scoreContentBox').find('.al-scoreCancelBtn').on("click",function(){
                    $(this).closest('.al-scorePopBox').remove();
                    $("body").css("overflow","");
                    //事件埋点
                    comm.creatEvent({
                        triggerType:"全站功能按钮点击",
                        keyword:"终端页评分功能取消",
                        actionId:45,
                        refType: $('#resourceTyps').val(),
                        refId: $('#resourceId').val()
                    });
                });
                //输入框
                comm.textChange({
                    "$tex":$('.al-scoreContentBox').find('.al-scopeFeedback textarea'),
                    "$num":$('.al-scoreContentBox').find('.al-scoringNum'),
                    "noTop":1,
                    "numTip":10
                })
            },
            startSelect:function(t){
                $('.al-scoreContentBox').find('.al-bigScoreStarBox li').on("click",function(){
                    $(this).siblings().children().hide().removeClass('active');
                    $(this).children().show().addClass('active');
                    $(this).prevAll().children().show().addClass('active');
                    var startNum=$(this).parent().find('.active').length-1;
                    $('.al-scoreContentBox .al-scoreText').removeClass('active').hide().eq(startNum).show().addClass('active');
                    $('.al-scoreContentBox').find('.al-scoreQuesTitle[data-id='+startNum+']').show().addClass('active').siblings('.al-scoreQuesTitle').removeClass('active').hide();
                });
                //匿名
                $('.al-anonymousScore span').on("click",function(){
                    if (t.op.answerType>0&& t.op.answerType==1){
                        if($('.al-videoScoreMask').length>0){
                            $('.al-videoScoreMask').find('.ev-isAnonymous').children().toggleClass('active');
                        }
                    }
                    $(this).children().toggleClass('active');
                });
                //标签
                $('.al-contentMatterItem li').on("click",function(){
                    $(this).toggleClass('active');
                })
            },
            scoreSubmitBtn:function(t){
                $('.al-scoreContentBox').find('.al-scoreBtn .al-submitBtn').on("click",function(){
                    $(this).addClass('al-submitIngBtn').text("正在提交");
                    var scoreNum=$('.al-scoreContentBox').find('.al-bigScoreStarBox').find('.active').length,
                        otherContent=$('.al-scoreContentBox').find('.al-scopeFeedback textarea').val(),
                        isAnonymous=$('.al-scoreContentBox').find('.al-anonymousScore').find('.active'),
                        scoreAnswerContentTotal=$('.al-scoreContentBox').find('.al-contentMatterItem .active'),
                        _scoreAnswerContent='',
                        scoreAnswerContent='';
                    if(scoreAnswerContentTotal.length>0) {
                        for (var i = 0; i < scoreAnswerContentTotal.length; i++) {
                            _scoreAnswerContent += $(scoreAnswerContentTotal[i]).text() + ',';
                        }
                        scoreAnswerContent=_scoreAnswerContent.substring(0,_scoreAnswerContent.length-1);
                    }
                    var data={
                        "customerId":$('#sesCustomerId').val(),     //用户ID  (t.op.customerId)
                        "scoreType": t.op.answerType,     //资源类型
                        "refId": t.op.resourceId,         //资源ID
                        "refName": t.op.refName,          //资源名称
                        "refCustomerId":t.op.refCustomerId,  //作者ID （t.op.refCustomerId）
                        "score":scoreNum>5?5:scoreNum,                 //个数
                        "scoreAnswerBehalf":scoreNum>3?"1":"2",  // 1 2差评
                        "scoreGuide": $('.al-scoreContentBox').find('.al-scoreText[data-id='+(scoreNum-1)+']').text(),            //引导语
                        "scoreQuestion": $('.al-scoreContentBox').find('.al-scoreQuesTitle[data-id='+(scoreNum-1)+']').text(),    //问题
                        "scoreAnswerContent":scoreAnswerContent,   //标签
                        "isOther":otherContent.length>0?"1":"0",   //1有 0没有
                        "otherContent":otherContent,      //文本框内容
                        "isAnonymous":isAnonymous.length>0?"0":"1"                 //是否匿名(0-匿名、1-不匿名)
                    };
                    t.scoreAsync({
                        data:data,
                        path: t.path.scoreSubmit,
                        scoreBack:function(data){
                            $('.al-scoreContentBox').find('.al-scoreBtn .al-submitBtn').text("提交成功").removeClass('al-submitIngBtn').addClass('al-submitSuccessBtn').off("click");
                            $('.al-scorePopBox').delay(3000).hide(0);
                            $('.ev-scoring .ev-startItem').off("click");
                            obj.scoreTerminal({scoreNum:scoreNum});
                            $("body").css("overflow","");
                        }
                    })
                })
            }
        },
        //评分详情事件
        eventCenterDetail:{
            init:function(t){
                var _t=this;
                _t.click();
            },
            click:function(){
                $('.al-scoreDetailsPopBox').find('.al-scorePopCloseBtn').on("click",function(){
                    $("body").css("overflow","");
                    $(this).closest('.al-scoreDetailsPopBox').html("").hide();

                })
            }
        },
        //Ajax
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
                    //console.log(data);
                },
                error : function(){
                    // comm.LightBox.hideloading();
                }
            });
        }
    };
    container.init(obj);
};
//module.scoringSystem({
//    isTerminal:0,
//    answerType:1,        //资源类型(1视频，2文库，7病例)
//    resourceTitle:"《你好我是一个资源名称1111111》",      //资源名称
//    scoreTerminal:function(sTv){
//        alert(sTv.scoreNum);
//    },
//    scoreVideoStop:function(){
//
//    },
//    scoreTermeVideo:function(sTv){
//        alert(sTv);
//    },
//    scoreMessage:function(){
//
//    }
//});