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
                   scoreMessage:function(){}          //（可选）（仅消息页打开评分详情弹层回调）
                 })
 * 注意事件：
 * 引入来源： comm.textChange({}),
 *     作用：
 *
 * Created by JuKun on 2016/12/27.
 */
$(function(){
    window.FastClick&&FastClick.attach(document.body);
    comm.slideTabs();
    $(".al-personalContributionSelector h2").on("click", function() {
        if ($(".al-personalContributionSelector").hasClass('al-personalSelectorOn')) {
            $(".al-personalContributionSelector").removeClass('al-personalSelectorOn');
        } else {
            $(".al-personalContributionSelector").addClass('al-personalSelectorOn');
        }

    });
    $(".al-personalContributionSelectorItem").on("click", function() {
        $(this).addClass('active').siblings().removeClass('active');
        $(this).parents(".al-personalContributionSelector").removeClass('al-personalSelectorOn');
        $(this).parents(".al-personalContributionSelector").find('h2').text($(this).text());
    });
});
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
            scoreReceive:M_CALL+"comm/data/score/level/json_list/",
            scoreSubmit:M_CALL+"customer/resource/score/create/",
            scoreDetail:M_CALL+"customer/resource/score/getComprehensiveScore/",
            scoreDetailScroll:M_CALL+"customer/resource/score/json_list/"
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
                    _this.op.customerId=localStorage.getItem("userId");     //用户ID
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
            $('.ev-scoring .ev-startItem').each(function(i,em){
                $(em).off('click').on("click",function(){
                    // 厂商医助不需要评分
                    if(TempCache.getItem("customerRole") === "13" ||
                        TempCache.getItem("customerRole") === "14" ||
                        TempCache.getItem("customerRole") === "15"){
                        comm.toastFactoryAuth(null);
                    }else { // 原逻辑
                        if (TempCache.getItem('customerRole') == 3 || TempCache.getItem("customerRole") == 2 || TempCache.getItem("customerRole") == 4) {//厂商无评分权限
                            popup('该用户没有操作权限');
                        } else {
                            comm.creatEvent({
                                triggerType: '评分功能',
                                keyword: '评分功能',
                                actionId: 31,
                                refId: $('#resourceId').val(),
                                refType: $('#relationType').val()
                            });
                            obj.scoreVideoStop();
                            var elementClick = $(this);
                            user.privExecute({
                                operateType: 'auth',   //'login','auth','conference'
                                callback: function () {
                                    if(obj.classObj){
                                        // payType 0付费 1免费
                                        // collegeCourseState 1付费课 0普通视频
                                        // payState 0未购买 1已购买

                                        if(obj.classObj.collegeCourseState==1 ){
                                            if(obj.classObj.payStateType==0){
                                                popup('购买课程后您可以继续使用相关功能');
                                            }else {
                                                obj.classObj.callBack&&obj.classObj.callBack();
                                            }
                                        }else {
                                            _this.evScoring({esv: esv, element: elementClick});
                                            Log.createBrowse(168, '评分界面');
                                        }
                                    }else {
                                        _this.evScoring({esv: esv, element: elementClick});
                                        Log.createBrowse(168, '评分界面');
                                    }

                                },
                                noNeedBack: true
                            });


                        }
                    }
                  return false;
                });
            })
        },
        //评分处理
        evScoring:function(essv){
            var _this=this;
            $('body').append(_this.scoreTemplate({answerType:essv.esv.answerType,receiveData:essv.esv.receiveData,resourceTitle:essv.esv.resourceTitle}));
            //首次进入评分页是星星数量的控制及两处对应文案的显示
            var StartIndex=$(essv.element).index(),
                startElement=$('.al-scorePagePopBox').find('.al-bigScoreStarBox li b').hide();
            for(var i=0;i<=StartIndex;i++){
              $(startElement[i]).show().addClass('active');
            }
            if(obj.answerType!==undefined&&obj.answerType!==""&&obj.answerType==1){
                var isAnonymous=$('.ev-isAnonymous').children('b');
                if(isAnonymous.length>0){
                    if(isAnonymous.hasClass('active')){
                        $('.al-anonymousScore span').children().addClass('al-selectedBtn');
                    }else{
                        $('.al-anonymousScore span').children().removeClass('al-selectedBtn');
                    }
                }
            }
            $('.al-scorePagePopBox').find('.al-scoreResultText').hide().eq(StartIndex).show();
            $('.al-scorePagePopBox').find('.al-scoreQuesTitle[data-id='+StartIndex+']').show().siblings('.al-scoreQuesTitle').hide();
            $('.al-mainInner').hide();
            $('.al-scorePopBox').show().find('.al-scoreContentBox').show();
            //初始化事件
            _this.eventCenter.init(_this);
        },
        //评分详情验证登录认证
        evScoreDetail:function(esdv){
            var _this=this;
            $('.ev-scoreDetail').on("click",function(){
                if(TempCache.getItem('customerRole')=== "14" ||
                    TempCache.getItem("customerRole")=== "15" ||
                    TempCache.getItem("customerRole")=== "13"){
                    comm.toastFactoryAuth(null);
                }else{
                    if(TempCache.getItem('customerRole')==3||TempCache.getItem("customerRole")==2||TempCache.getItem("customerRole")==4){   //厂商无评分权限
                        popup('该用户没有操作权限');
                    }else{
                        var elementClick=$(this);
                        var scoreNum = $(this).find('.scoreNum').text();
                        if(scoreNum>=10){
                            user.privExecute({
                                operateType: 'auth',   //'login','auth','conference'
                                callback: function () {
                                    comm.creatEvent({
                                        triggerType: "终端页功能",
                                        keyword: "评分详情",
                                        actionId: 11050,
                                        async:false
                                    });
                                    _this.evScoreDetailResult({element:elementClick});
                                },
                                noNeedBack:true
                            });
                        }else{
                            //popup("评分未达10人，暂无详情");
                        }
                    }

                }

            });
        },
        //评分详情处理
        evScoreDetailResult:function(eDRv){
            var _this=this;
            if(obj.isTerminal==1){
                _this.op.resourceTitle=$(eDRv.element).data('title');
                _this.op.resourceUrl=$(eDRv.element).data('resourceurl');
                //综合评分参数
                _this.op.resourceId=$(eDRv.element).data('refid');      //资源Id
                _this.op.answerType=$(eDRv.element).data('answertype'); //资源类型(1视频，2文库，7病例)
                _this.op.answerType=$(eDRv.element).data('refcustomerid'); //资源作者Id
                _this.op.customerId=localStorage.getItem("userId");  //用户Id
            }
            window.location='/pages/scoringSystem/scoreDetails.html?answerType='+_this.op.answerType+"&refId="+_this.op.resourceId+"&myScoreCustomerId="+_this.op.customerId+"&resourceTitle="+_this.op.resourceTitle+"&isTerminal="+obj.isTerminal+"&refCustomerId="+_this.op.refCustomerId
        },
        //Dome处理
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
                ''+_levelQuesTitle+'<ul class="al-scoreTagSelect">'+_tipsHtml+'<li class="al-scoreOtherQues">其他原因</li></ul><div class="al-scorePageInputBox" style="display:none;"><textarea  name="" id="" max="100" cols="0" rows="0" placeholder="请输入你的想法"></textarea>' +
                '<span class="al-NumPrompt"></span></div><div class="al-scorePageEmptyBox" style="display:none;"></div></figure></div>' +
                '<footer class=" al-scorePageNoSubmitBtn al-scorePageFooterSubmitBtn"><i></i><span>提交</span></footer></section>';
            return _scoreHtml;
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
                    comm.creatEvent({
                        triggerType:'全站功能按钮点击',
                        keyword:'关闭评分',
                        actionId:43,
                        refId:$('#resourceId').val(),
                        refType:$('#relationType').val()
                    });
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
                $('.al-scorePagePopBox').find('.al-bigScoreStarBox li').on("click",function(){
                    $(this).siblings().children().hide().removeClass('active');
                    $(this).children().show().addClass('active');
                    $(this).prevAll().children().show().addClass('active');
                    var startNum=$(this).parent().find('.active').length-1;
                    $('.al-scorePagePopBox').find('.al-scoreResultText').hide().removeClass('active').eq(startNum).show().addClass('active');
                    $('.al-scorePagePopBox').find('.al-scoreQuesTitle[data-id='+startNum+']').show().addClass('active').siblings('.al-scoreQuesTitle').hide().removeClass('active');
                });
                //匿名
                $('.al-anonymousScore span').on("click",function(){
                    if (t.op.answerType>0&& t.op.answerType==1){
                        if($('.al-videoScorePopBox').length>0){
                            $('.al-videoScorePopBox').find('.al-anonymousScoreText').children("b").toggleClass('active');
                        }
                    }
                    $(this).children().toggleClass('al-selectedBtn');
                });
                //标签
                $('.al-scoreTagSelect li').on("click",function(){
                    $(this).toggleClass('active');
                    if($('.al-scoreOtherQues').hasClass('active')){
                        $('.al-scorePagePopBox').find('.al-scorePageInputBox').show();
                        //$('.al-scorePagePopBox').find('.al-scorePageEmptyBox').hide();
                    }else{
                        $('.al-scorePagePopBox').find('.al-scorePageInputBox').hide();
                        //$('.al-scorePagePopBox').find('.al-scorePageEmptyBox').show();
                    }
                })
            },
            scoreSubmitBtn:function(t){
                $('.al-scorePagePopBox').find('.al-scorePageFooterSubmitBtn').attr("on","true");
                $('.al-scorePagePopBox').find('.al-scorePageFooterSubmitBtn').on("click",function(){
                    var $this = $(this);
                    if($(this).attr("on")=="true"){
                        $(this).attr("on","false");
                        $(this).addClass('al-scorePageSubmitIngBtn').children('span').text("正在提交");
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
                            "isAnonymous":isAnonymous.length>0?"0":"1"                 //是否匿名(0-匿名、1-不匿名)
                        };
                        t.scoreAsync({
                            data:data,
                            path: t.path.scoreSubmit,
                            scoreBack:function(data){
                                $this.attr("on","true");
                                $('.al-scorePagePopBox').find('.al-scorePageFooterSubmitBtn').removeClass('al-scorePageSubmitIngBtn').addClass('al-scorePageSubmitOkBtn').off("click").children('span').text("提交成功");
                                $('.al-scorePagePopBox').delay(3000).hide(0);
                                $('.ev-scoring .ev-startItem').off("click");
                                $('.al-mainInner').show();
                                setTimeout(function(){
                                    popup("你的评价已生效，感谢您的参与");
                                },3000);
                                obj.scoreTerminal({scoreNum:scoreNum});
                            }
                        })
                    }

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
                },
                error : function(){
                    // comm.LightBox.hideloading();
                }
            });
        }
    };
    container.init(obj);
};
//评分数计算
function scoringCount(num,control){
    var intScoring = parseInt(num),
        decScoring = num - intScoring,
        blueStarWidth = control.find('li').width() * decScoring
    for(var i=0;i<intScoring;i++){
        control.find('li').eq(i).html("<b></b>")
    }
    control.find('li').eq(intScoring).html("<b></b>")
    control.find('li').eq(intScoring).find('b').css("width",blueStarWidth)
}
//新增评分系统
function scoringSystem(player2,title,classObj){
    $.ajax({//评分接口请求
        url: M_CALL + "customer/resource/score/getResourceComprehensiveScore/",
        type: "POST",
        dataType: "json",
        data: {
            paramJson: $.toJSON({
                "isValid":"1",
                "visitSiteId":"2",
                "myScoreCustomerId":localStorage.getItem("userId"),
                "scoreType":$("#relationType").val(),
                "sortType":"2",
                "refId":$("#resourceId").val(),
                "firstResult":"0",
                "maxResult":"999999"
            })
        },
        success: function (data) {
            if (data && data.responseObject && data.responseObject.responseData) {
                var items = data.responseObject.responseData,
                    scoringTotle = items.currentStarLevel, //综合评分
                    scoringPerson = items.currentScoreNum, //评分人数items.currentScoreNum
                    iScoring = items.myScoreState;         //是否评过分
                $(".scoreNum").text(scoringPerson);
                //评分人数
                if(scoringPerson>=10){
                    $(".al-myScoreBox p").addClass("ev-scoreDetail").css('minHeight','auto');
                    $(".ev-scoreNum").text(scoringTotle).parents(".ev-scoreNumBox").show();
                    scoringCount(scoringTotle,$(".al-terminalHeader .al-littleScoreStarBox"));
                }else{
                    $(".al-myScoreBox p").addClass("al-scoreNumLess");
                    $(".al-terminalHeader .al-littleScoreStarBox").hide();
                    $(".al-scoreNumLess").click(function(){popup("评分未达10人，暂无详情");})
                }
                //是否评过分
                if(iScoring == 0){
                    $(".al-myScoreBox ul").addClass("ev-scoring");
                    $(".al-termianlVideoHeader").addClass("EV-notScore");
                }else if(iScoring == 1){
                    $(".iScore").text("我的评分");
                    $(".al-myScoreBox").removeClass("al-iAskScore");
                    $(".al-videoScorePopBox").remove();
                    $(".al-termianlVideoHeader").removeClass("EV-notScore");
                    scoringCount(items.score,$(".al-myScoreBox .al-littleScoreStarBox"));
                }
                //是否匿名
                $(".al-anonymousScoreText").on('click',function () {
                    if ($(this).children("b").hasClass("active")) {
                        $(this).children("b").removeClass("active");
                    } else {
                        $(this).children("b").addClass("active");
                    }
                });
                //公共方法调取
                module.scoringSystem({
                    classObj:classObj,
                    isTerminal:0,
                    answerType:$("#relationType").val(),        //(1视频，2文库，7病例)
                    resourceTitle:title?title:($(".Ev-caseTitle h2").length>1?$(".Ev-caseTitle h2").eq(1).text().trim():$(".Ev-caseTitle h2").text().trim()),      //资源名称
                    scoreTerminal:function(items){    //终端页评分回调
                        $(".iScore").text("我的评分");
                        $(".al-myScoreBox").removeClass("al-iAskScore");
                        $(".al-videoScorePopBox").remove();
                        $(".al-termianlVideoHeader").removeClass("EV-notScore");
                        scoringCount(items.scoreNum,$(".al-myScoreBox .al-littleScoreStarBox"));
                        if($(".relationType")==1&&player2.player.currentTime()<player2.player.duration()-1){
                            setTimeout(function(){player2.player.play();},3000)
                        }
                        if($(".Ev-seriesVideo .Ev-sVideoAppend article").length>0){
                            var locationHref=$(".Ev-highLight").next().find(".text").attr("href");
                            if (!locationHref) {//没有下一个了，当前播放在最后
                                player2.player.pause();
                            } else {
                                g_sps.jump(null,locationHref);
                            }
                        }
                    },
                    scoreVideoStop:function(){
                        if($(".relationType")==1){
                            player2.player.pause();
                        }
                    }
                });
            }
        }
    });
}
