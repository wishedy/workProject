//评分数计算
function scoringCount(num,control){
    var intScoring = parseInt(num),
        decScoring = num - intScoring,
        blueStarWidth = control.find('li').width() * decScoring;
    for(var i=0;i<intScoring;i++){
        control.find('li').eq(i).append("<b></b>")
    }
    control.find('li').eq(intScoring).append("<b></b>");
    control.find('li').eq(intScoring).find('b').css("width",blueStarWidth);
}
//新增评分系统
function scoringSystem(){
    $.ajax({//评分接口请求
        url: M_CALL + "customer/resource/score/getResourceComprehensiveScore/",
        type: "POST",
        dataType: "json",
        data: {
            paramJson: $.toJSON({
                "isValid":"1",
                "visitSiteId":"2",
                "myScoreCustomerId":localStorage.getItem("userId"),
                "scoreType":$("#resourceType").val(),
                "sortType":"2",
                "refId":$("#resourceId").val(),
                "firstResult":"0",
                "maxResult":"999999"
            })
        },
        success: function (data) {
            if (data && data.responseObject && data.responseObject.responseData) {
                var items = data.responseObject.responseData,
                    scoringTotle = items.currentStarLevel,//综合评分
                    scoringPerson = items.currentScoreNum,//评分人数items.currentScoreNum
                    iScoring = items.myScoreState;//是否评过分
                $(".scoreNum").text(scoringPerson);
                //评分人数
                if(scoringPerson>=10){
                    $(".al-myScoreBox p").addClass("ev-scoreDetail");
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
                //关闭video弹层
                $(".al-scorePopCloseBtn").on('click',function(){
                    $(".al-videoScorePartBox").hide();
                });
                //公共方法调取
                module.scoringSystem({
                    isTerminal:0,
                    answerType:$("#relationType").val(),        //(1视频，2文库，7病例)
                    resourceTitle:$(".al-terminalVideoTitle h2").text(),      //资源名称
                    scoreTerminal:function(items){    //终端页评分回调
                        $(".iScore").text("我的评分");
                        $(".al-myScoreBox").removeClass("al-iAskScore");
                        $(".al-videoScorePopBox").remove();
                        $(".al-termianlVideoHeader").removeClass("EV-notScore");
                        scoringCount(items.scoreNum,$(".al-myScoreBox .al-littleScoreStarBox"));
                        if(CKobject.getObjectById('CKa1').getStatus().time<CKobject.getObjectById('CKa1').getStatus().totalTime-1){
                            setTimeout(function(){CKobject.getObjectById('CKa1').videoPlay()},3000);
                        }
                        if($(".Ev-seriesVideo .Ev-sVideoAppend article").length>0){
                            var locationHref=$(".Ev-highLight").next().find(".text").attr("href");
                            if (!locationHref) {//没有下一个了，当前播放在最后
                                CKobject.getObjectById('CKa1').videoPause();
                            } else {
                              g_sps.jump(null,locationHref);
                            }
                        }
                    },
                    scoreVideoStop:function(){
                        CKobject.getObjectById('CKa1').videoPause();
                    }
                });
            }
        }
    });
}
