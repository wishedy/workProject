/**
 * 功能描述：
 * 使用方法:
 * 注意事件：
 * 引入来源：
 *     作用：
 *
 * Created by JuKun on 2016/11/3.
 */
var testPerson={};
testPerson.one={
    questionLoad:function(Qv){
        var questionnaire={
            config:{

            },
            init:function(){
                var t=this;
                t.questionDataLoad(Qv);
            },
            questionDataLoad:function(Kv){
                var t=this;
                var qItem=Kv.resTemplate.bo.responseData.data_list?Kv.resTemplate.bo.responseData.data_list:'';
                $.each(qItem,function(i,val){
                    if(val.componentType&&val.componentType==7){
                        var questionnaireType=val.questionnaireType;
                        switch (parseInt(questionnaireType)){
                            case 1:
                                var questionData=val.colQuestionnaireMap[0]?val.colQuestionnaireMap[0]:'',
                                    colMenuLayoutModuleId=val.colMenuLayoutModuleId,
                                    columnId=val.columnId;
                                //title=val.title;
                                t.doQueResult({
                                    data:val,
                                    questionData:questionData,
                                    colMenuLayoutModuleId:colMenuLayoutModuleId,
                                    columnId:columnId,
                                    questionnaireType:questionnaireType
                                });
                                break;
                            case 2:
                                var voteData=val.colQuestionnaireMap[0]?val.colQuestionnaireMap[0]:'',
                                    voteColMenuLayoutModuleId=val.colMenuLayoutModuleId,
                                    voteColumnId=val.columnId;
                                t.voteResult({
                                    data:val,
                                    voteData:voteData,
                                    colMenuLayoutModuleId:voteColMenuLayoutModuleId,
                                    columnId:voteColumnId,
                                    questionnaireType:questionnaireType
                                });
                                break;
                        }
                    }
                });
            },
            //处理数据
            doQueResult:function(Lma) {
                var t = this,
                    attHtml = '',
                    quesHtml = '',
                    _totalHtml = '',
                    quesHtmlCon = '',
                    quesBtn = '',
                    totalHtml = '',
                    title=Lma.questionData.questionnaireTitle.length>0?Lma.questionData.questionnaireTitle:'', //问卷标题
                    quesSummary=Lma.questionData.questionnaireSummary,     //问卷说明
                    quesSummaryPic=Lma.questionData.colQuestionnaireAttachmentList,   //问卷说明附件
                    titleCut=t.quesCutWord(title,60);
                attHtml += t.attHtml(Lma);
                quesHtml += t.questionHtmlA(Lma);
                quesBtn += t.doSelectBtnHtml(Lma);
                quesHtmlCon += '<div>' + quesHtml + '</div>';
                totalHtml += attHtml + quesHtmlCon;
                if ($('div[data-id=' + Lma.colMenuLayoutModuleId + ']').parents('.sp_container').hasClass('sp_container_l')) {
                    _totalHtml += '<div class="al-questionBox questionnaire-l_content">' + totalHtml + '</div>';
                }
                if ($('div[data-id=' + Lma.colMenuLayoutModuleId + ']').parents('.sp_container').hasClass('sp_container_m')) {
                    _totalHtml += '<div class="al-questionBox questionnaire-m_content">' + totalHtml + '</div>';
                }
                if ($('div[data-id=' + Lma.colMenuLayoutModuleId + ']').parents('.sp_container').hasClass('sp_container_s')) {
                    _totalHtml += '<div class="al-questionBox questionnaire-s_content">' + totalHtml + '</div>';
                }
                $('.sp_container [data-id=' + Lma.colMenuLayoutModuleId + ']').find('.resource_list ').html(_totalHtml).attr({userType:Lma.questionData.userType,customerStatusQuestionnaire:Lma.questionData.customerStatusQuestionnaire,qId:Lma.questionData.questionnaireId});
                $('.sp_container [data-id=' + Lma.colMenuLayoutModuleId + ']').find('.al-questionBox').append(quesBtn);
                $('div[data-id=' + Lma.colMenuLayoutModuleId + ']').find('.total_title span').text(titleCut);
                $("textarea").textareaAutoHeight({minHeight:60,maxHeight:140});//将填写的内容区进行样式修改，最小2行最大5行
                if(quesSummary.length==0&&quesSummaryPic.length>0){
                    $('div[data-id=' + Lma.colMenuLayoutModuleId + ']').find('.questionnaire-m_contentTopicMorePicBox').css("margin-top",0);
                    $('div[data-id=' + Lma.colMenuLayoutModuleId + ']').find('.questionnaire-s_contentTopicMorePicBox').css("padding-top",0);
                }
                $('div[data-id=' + Lma.colMenuLayoutModuleId + ']').find('.total_title').css({"height":"auto","line-height":"26px","padding-top":"13px","padding-bottom":"13px","word-break":"break-all"});
                //$('div[data-id=' + Lma.colMenuLayoutModuleId + ']').find('.total_title').children('.al-questionnaireAboutTitleTip').css("display","inline");


                //问卷样式修改
                if ($('div[data-id=' + Lma.colMenuLayoutModuleId + ']').parents('.sp_container').hasClass('sp_container_l')) {
                    var quesElement=$('div[data-id=' + Lma.colMenuLayoutModuleId + ']').find('.al-questionnairePageList');
                    for (var i=0;i<quesElement.length;i++){
                        var quesLastElements=$(quesElement[i]).find('.al-questionList'),
                            lastElementType=$(quesLastElements).last().data('type');
                        $(quesLastElements).css("margin-top","67.5px").first().css("margin-top","0");
                        if(lastElementType==1){
                            $(quesLastElements).last().css("margin-bottom","63.5px")
                        }else if(lastElementType==2){
                            $(quesLastElements).last().css("margin-bottom","52px")
                        }else{
                            $(quesLastElements).last().css("margin-bottom","50px")
                        }
                    }
                }
                if ($('div[data-id=' + Lma.colMenuLayoutModuleId + ']').parents('.sp_container').hasClass('sp_container_m')) {
                    var quesElement=$('div[data-id=' + Lma.colMenuLayoutModuleId + ']').find('.al-questionnairePageList');
                    for (var i=0;i<quesElement.length;i++){
                        var quesLastElements=$(quesElement[i]).find('.al-questionList'),
                            lastElementType=$(quesLastElements).last().data('type');
                        $(quesLastElements).css("margin-top","47.5px").first().css("margin-top","0");
                        if(lastElementType==1||lastElementType==2){
                            $(quesLastElements).last().css("margin-bottom","42px")
                        }else{
                            $(quesLastElements).last().css("margin-bottom","40px")
                        }
                    }
                }
                if ($('div[data-id=' + Lma.colMenuLayoutModuleId + ']').parents('.sp_container').hasClass('sp_container_s')) {
                    var quesElement=$('div[data-id=' + Lma.colMenuLayoutModuleId + ']').find('.al-questionnairePageList');
                    for (var i=0;i<quesElement.length;i++){
                        var quesLastElements=$(quesElement[i]).find('.al-questionList'),
                            lastElementType=$(quesLastElements).last().data('type');
                        $(quesLastElements).css("margin-top","33px").first().css("margin-top","0");
                        if(lastElementType==1||lastElementType==2){
                            $(quesLastElements).last().css("margin-bottom","27.5px")
                        }else{
                            $(quesLastElements).last().css("margin-bottom","34px")
                        }
                    }
                    //$('div[data-id=' + Lma.colMenuLayoutModuleId + ']').find('.total_title').css({"height":"auto","line-height":"26px","padding-top":"13px","padding-bottom":"13px"});
                    //$('div[data-id=' + Lma.colMenuLayoutModuleId + ']').find('.total_title').children('.al-questionnaireAboutTitleTip').css("display","inline");
                    $('div[data-id=' + Lma.colMenuLayoutModuleId + ']').find('.questionnaire-s_open').on("click",function(){
                       $(this).parent().hide();
                       $(this).parent().siblings().show();
                    })
                }
                t.selectStatus(Lma);
                t.questionAction(Lma);
                t.quesViewBigImg(Lma);
            },
            voteResult:function(vRv){
                var t=this,
                    _voteAttHtml='',
                    _voteQuesHtml='',
                    _voteBtnHtml='',
                    _voteHtmlBox='',
                    _totalHtml='',
                    title=vRv.voteData.questionnaireTitle.length>0?vRv.voteData.questionnaireTitle:'',
                    titleCut=t.quesCutWord(title,60);
                _voteAttHtml+= t.attHtml(vRv);
                _voteQuesHtml+= t.voteQuesHtml(vRv);
                _voteBtnHtml+= t.voteBtnHtml(vRv);
                _voteHtmlBox=_voteAttHtml+_voteQuesHtml;
                if ($('div[data-id=' + vRv.colMenuLayoutModuleId + ']').parents('.sp_container').hasClass('sp_container_l')) {
                    _totalHtml += '<div class="al-questionBox questionnaire-l_content">' + _voteHtmlBox + '</div>';
                }
                if ($('div[data-id=' + vRv.colMenuLayoutModuleId + ']').parents('.sp_container').hasClass('sp_container_m')) {
                    _totalHtml += '<div class="al-questionBox questionnaire-m_content">' + _voteHtmlBox + '</div>';
                }
                if ($('div[data-id=' + vRv.colMenuLayoutModuleId + ']').parents('.sp_container').hasClass('sp_container_s')) {
                    _totalHtml += '<div class="al-questionBox questionnaire-s_content">' + _voteHtmlBox + '</div>';
                }
                $('.sp_container [data-id=' + vRv.colMenuLayoutModuleId + ']').find('.resource_list ').html(_totalHtml);
                $('.sp_container [data-id=' + vRv.colMenuLayoutModuleId + ']').find('.al-questionBox').append(_voteBtnHtml);
                $('div[data-id=' + vRv.colMenuLayoutModuleId + ']').find('.total_title span').text(titleCut);
                if ($('div[data-id=' + vRv.colMenuLayoutModuleId + ']').parents('.sp_container').hasClass('sp_container_s')) {
                    $('div[data-id=' + vRv.colMenuLayoutModuleId + ']').find('.total_title').css({"height":"auto","line-height":"26px","padding-top":"13px","padding-bottom":"13px","word-break":"break-all"});
                    $('div[data-id=' + vRv.colMenuLayoutModuleId + ']').find('.total_title').children('.al-questionnaireAboutTitleTip').css("display","inline");
                    $('div[data-id=' + vRv.colMenuLayoutModuleId + ']').find('.questionnaire-s_open').on("click",function(){
                        $(this).parent().hide();
                        $(this).parent().siblings().show();
                    })
                }
                t.voteSelectStatus(vRv);
                t.quesViewBigImg(vRv);
            },
            //简介Dome
            attHtml:function(aHA){
                var aHAdata=aHA.data,
                    quesMap=aHAdata.colQuestionnaireMap[0]?aHAdata.colQuestionnaireMap[0]:'',
                    quesAttList=quesMap.colQuestionnaireAttachmentList?quesMap.colQuestionnaireAttachmentList:'',  //问卷简介图集
                    questionnaireSummary=quesMap.questionnaireSummary,           //问卷简介
                    summary=quesMap.questionnaireSummary?comm.getStrLen(quesMap.questionnaireSummary,110*2):"",       //简介内容 原来是110*2
                    cqCreateTime=quesMap.cqCreateTime,    //开始时间
                    cqEndTime=quesMap.cqEndTime,          //结束时间
                    layoutModule=aHAdata.layoutModule,    //模板样式
                    _attPicContent='',
                    _attPicHtml='',
                    _attHtml='';
                if($('div[data-id='+aHA.colMenuLayoutModuleId+']').parents('.sp_container').hasClass('sp_container_l')){
                    if(quesAttList.length>1){
                        if(quesAttList.length>2){
                            _attPicHtml='<section class="questionnaire-l_contentTopicMorePicBox al-quesViewBigBox"><span class="questionnaire-l_contentSelectMorePicItem1 al-quesViewBigItem">' +
                                '<img class="questionnaire-l_contentSelectMorePicItem1Photo" src="'+quesAttList[0].cqaQuestionnaireAttUr+'" alt="" data-time="'+quesAttList[0].cqaCreateTime+'">' +
                                '<section class="questionnaire-l-contentSelectPic_cover"></section><section class="questionnaire-l-contentSelectPic_viewBigPic">' +
                                '<img src="/images/img00/column/specialTemplate/Questionnaire_search.png" alt=""><span>点击查看大图</span></section></span>' +
                                '<span class="questionnaire-l_contentSelectMorePicItem1 al-quesViewBigItem">' +
                                '<img class="questionnaire-l_contentSelectMorePicItem1Photo" src="'+quesAttList[1].cqaQuestionnaireAttUr+'" alt="" data-time="'+quesAttList[1].cqaCreateTime+'"> ' +
                                '<section class="questionnaire-l-contentSelectPic_cover"></section><section class="questionnaire-l-contentSelectPic_viewBigPic"><img src="/images/img00/column/specialTemplate/Questionnaire_search.png" alt=""> ' +
                                '<span>点击查看大图</span></section></span><span class="questionnaire-l_contentSelectMorePicItem1 al-quesViewBigItem">' +
                                '<img class="questionnaire-l_contentSelectMorePicItem1Photo" src="'+quesAttList[2].cqaQuestionnaireAttUr+'" alt="" data-time="'+quesAttList[2].cqaCreateTime+'">' +
                                '<section class="questionnaire-l-contentSelectPic_cover"></section><section class="questionnaire-l-contentSelectPic_viewBigPic">' +
                                '<img src="/images/img00/column/specialTemplate/Questionnaire_search.png" alt=""><span>点击查看大图</span></section></span></section>';
                        }else{
                            _attPicHtml='<section class="questionnaire-l_contentTopicMorePicBox al-quesViewBigBox"><span class="questionnaire-l_contentSelectMorePicItem1 al-quesViewBigItem">' +
                                '<img class="questionnaire-l_contentSelectMorePicItem1Photo" src="'+quesAttList[0].cqaQuestionnaireAttUr+'" alt="" data-time="'+quesAttList[0].cqaCreateTime+'">' +
                                '<section class="questionnaire-l-contentSelectPic_cover"></section><section class="questionnaire-l-contentSelectPic_viewBigPic">' +
                                '<img src="/images/img00/column/specialTemplate/Questionnaire_search.png" alt=""><span>点击查看大图</span></section></span>' +
                                '<span class="questionnaire-l_contentSelectMorePicItem1 al-quesViewBigItem">' +
                                '<img class="questionnaire-l_contentSelectMorePicItem1Photo" src="'+quesAttList[1].cqaQuestionnaireAttUr+'" alt="" data-time="'+quesAttList[1].cqaCreateTime+'"> ' +
                                '<section class="questionnaire-l-contentSelectPic_cover"></section><section class="questionnaire-l-contentSelectPic_viewBigPic"><img src="/images/img00/column/specialTemplate/Questionnaire_search.png" alt=""> ' +
                                '<span>点击查看大图</span></section></span></section>';
                        }
                    }
                    switch (quesAttList.length){
                        case 0:
                            if(questionnaireSummary.length>0){
                                _attHtml='<div class="al-voteDetail al-l-quesSummaryD"><section class="questionnaire-l_contentTopicMore"><p class="questionnaire_topicDescribe al-quesNoPic">'+questionnaireSummary+'</p> ' +
                                    '</section></div>';
                            }else{
                                _attHtml='';
                            }
                            break;
                        case 1:
                            _attHtml='<div class="questionnaire-l_contentTopic al-voteDetail"><div class="al-quesViewBigBox"><section class="questionnaire-l_contentTopicLeft al-quesViewBigItem">' +
                                '<img class="questionnaire-l_contentTopicLeftPhoto" src="'+quesAttList[0].cqaQuestionnaireAttUr+'" alt="" data-time="'+quesAttList[0].cqaCreateTime+'">' +
                                '<section class="questionnaire-l-contentSelectPic_cover"></section><section class="questionnaire-l-contentSelectPic_viewBigPic">' +
                                '<img src="/images/img00/column/specialTemplate/Questionnaire_search.png" alt=""><span>点击查看大图</span></section></section></div>' +
                                '<section class="questionnaire-l_contentTopicRight"><p class="questionnaire_topicDescribe">'+questionnaireSummary+'</p> ' +
                                '</section></div>';
                            break;
                        case 2:
                            _attHtml='<div class="al-voteDetail al-l-quesSummaryD"><section class="questionnaire-l_contentTopicMore"><p class="questionnaire_topicDescribe">'+questionnaireSummary+'</p>' +
                                '</section>'+_attPicHtml+'</div>';
                            break;
                        case 3:
                            _attHtml='<div class="al-voteDetail al-l-quesSummaryD"><section class="questionnaire-l_contentTopicMore"><p class="questionnaire_topicDescribe">'+questionnaireSummary+'</p> ' +
                                '</section>'+_attPicHtml+'</div>';
                            break;

                    }
                }
                if($('div[data-id='+aHA.colMenuLayoutModuleId+']').parents('.sp_container').hasClass('sp_container_m')){
                    if(quesAttList.length>0){
                        $.each(quesAttList,function(k,kal){
                            _attPicHtml+='<span class="questionnaire-m_contentSelectMorePicItem1 al-quesViewBigItem">' +
                                '<img class="questionnaire-m_contentSelectMorePicItem1Photo" src="'+kal.cqaQuestionnaireAttUr+'" alt="" data-time="'+kal.cqaCreateTime+'"> ' +
                                '<section class="questionnaire-m-contentSelectPic_cover"></section><section class="questionnaire-m-contentSelectPic_viewBigPic"><img src="/images/img00/column/specialTemplate/Questionnaire_search.png" alt=""> ' +
                                '<span>点击查看大图</span></section></span>'
                        });
                        _attPicContent+='<section class="questionnaire-m_contentTopicMorePicBox al-quesViewBigBox">'+_attPicHtml+'</section>';
                        if(questionnaireSummary.length>0){
                            _attHtml+='<div class="al-voteDetail al-m-quesSummaryD"><section class="questionnaire-m_contentTopicMore"><p class="questionnaire_topicDescribe">'+questionnaireSummary+' </p></section>'+_attPicContent+'</div>';
                        }else{
                            _attHtml+='<div class="al-voteDetail al-m-quesSummaryD">'+_attPicContent+'</div>';
                        }
                    }else{
                        if(questionnaireSummary.length>0){
                            _attHtml+='<div class="al-voteDetail al-m-quesSummaryD"><section class="questionnaire-m_contentTopicMore"><p class="questionnaire_topicDescribe al-quesNoPic">'+questionnaireSummary+' </p></section>'+_attPicContent+'</div>';
                        }else{
                            _attHtml+='';
                        }
                    }
                }
                if($('div[data-id='+aHA.colMenuLayoutModuleId+']').parents('.sp_container').hasClass('sp_container_s')){
                    if(quesAttList.length>0){
                        $.each(quesAttList,function(l,kal){
                            _attPicHtml+='<span class="questionnaire-s_contentSelectMorePicItem1 al-quesViewBigItem">' +
                                '<img class="questionnaire-s_contentSelectMorePicItem1Photo" src="'+kal.cqaQuestionnaireAttUr+'" alt="" data-time="'+kal.cqaCreateTime+'"> ' +
                                '<section class="questionnaire-s-contentSelectPic_cover"></section><section class="questionnaire-s-contentSelectPic_viewBigPic">' +
                                '<img src="/images/img00/column/specialTemplate/Questionnaire_search.png" alt=""><span>点击查看大图</span></section></span>'
                        });
                        _attPicContent+='<section class="questionnaire-s_contentTopicMorePicBox al-quesViewBigBox">'+_attPicHtml+'</section>';
                        if(questionnaireSummary.length>0){
                            _attHtml+='<div class="al-voteDetail al-s-quesSummaryD"><section class="questionnaire-s_contentTopicMore"><p class="questionnaire-s_topicDescribe">'+summary+'<span class="questionnaire-s_open">'+(questionnaireSummary.length>summary.length?"展开":"")+'</span></p>' +
                                '<p class="questionnaire-s_topicDescribe al-quesHide">'+questionnaireSummary+'</p></section>'+_attPicContent+'</div>';
                        }else{
                                _attHtml+='<div class="al-voteDetail al-s-quesSummaryD">'+_attPicContent+'</div>';
                            }
                    }else{
                        if(questionnaireSummary.length>0){
                            _attHtml+='<div class="al-voteDetail al-s-quesSummaryD"><section class="questionnaire-s_contentTopicMore"><p class="questionnaire-s_topicDescribe al-quesNoPic">'+summary+'<span class="questionnaire-s_open">'+(questionnaireSummary.length>summary.length?"展开":"")+'</span></p>' +
                                '<p class="questionnaire-s_topicDescribe al-quesHide">'+questionnaireSummary+'</p></section>'+_attPicContent+'</div>';
                        }else{
                            _attHtml+='';
                        }
                    }
                }
                return _attHtml;
            },
            //问卷Dome
            questionHtmlA:function(qHA){
                var t=this,
                    html='',
                    questionPage=[],
                    qHAData=qHA.data.colQuestionnaireMap?qHA.data.colQuestionnaireMap[0]:'',
                    isPage=parseInt(qHAData.isPage),
                    m=parseInt(qHAData.pageNum);   //每页显示题数量
                if(isPage==1){
                    for (var q= 0;q<qHAData.colQuestionMapList.length;q+=m){
                        questionPage.push(qHAData.colQuestionMapList.slice(q,q+m))
                    }
                }else{
                    for (var q= 0;q<qHAData.colQuestionMapList.length;q++){
                        questionPage.push(qHAData.colQuestionMapList.slice(q,q+1))
                    }
                }
                $.each(questionPage,function(d,plv){
                    var _html='';
                    $.each(plv,function(h,hlv){
                        var questionId=hlv.questionId,              //题目ID
                            questionOrder=hlv.questionOrder,        //题目序号
                            questionType=hlv.questionType,           //题目类型（1单选、2多选、3填空)
                            questionIsRequiredStatus=hlv.questionIsRequiredStatus,  //是否必填
                            cQuestionAttList=hlv.cQuestionAttList,   //题目图集
                            questionContent=hlv.questionContent,     //题目内容
                            colQuestionOptionMapList=hlv.colQuestionOptionMapList;   //题目选项集合
                        switch (parseInt(questionType)){
                            case 1:   //单题
                                _html+=t.doSelectOne({
                                    colMenuLayoutModuleId:qHA.colMenuLayoutModuleId,
                                    questionId:questionId,
                                    questionType:questionType,
                                    questionIsRequiredStatus:questionIsRequiredStatus,
                                    cQuestionAttList:cQuestionAttList,
                                    questionContent:questionContent,
                                    colQuestionOptionMapList:colQuestionOptionMapList,
                                    numberK:questionOrder
                                });
                                break;
                            case 2:  //多题
                                _html+=t.doSelectTwo({
                                    colMenuLayoutModuleId:qHA.colMenuLayoutModuleId,
                                    questionId:questionId,
                                    questionType:questionType,
                                    questionIsRequiredStatus:questionIsRequiredStatus,
                                    questionOptionMin:hlv.questionOptionMin,  //最少选项
                                    questionOptionMax:hlv.questionOptionMax,  //最多选项
                                    cQuestionAttList:cQuestionAttList,
                                    questionContent:questionContent,
                                    colQuestionOptionMapList:colQuestionOptionMapList,
                                    numberK:questionOrder
                                });
                                break;
                            case 3:   //简答题
                                _html+=t.doSelectThree({
                                    colMenuLayoutModuleId:qHA.colMenuLayoutModuleId,
                                    questionId:questionId,
                                    questionType:questionType,
                                    questionIsRequiredStatus:questionIsRequiredStatus,
                                    cQuestionAttList:cQuestionAttList,
                                    questionContent:questionContent,
                                    colQuestionOptionMapList:colQuestionOptionMapList,
                                    numberK:questionOrder
                                });
                                break;
                        }
                    });
                    html+='<div class="al-questionnairePageList">'+_html+'</div>'
                });
                return html;
            },
            questionTm:function(qTm){
                var t=this,
                    _tmPicHtml='',
                    _tmHTML='',
                    selectTip='',
                    selectTips='',
                    questionnaireType=qTm.questionnaireType?qTm.questionnaireType:'',   //问卷类型  （1问卷 2投票）
                    questionContent=t.quesCutWord(qTm.questionContent,400),     //题目内容
                    questionIsRequiredStatus=qTm.questionIsRequiredStatus,   //是否必选
                    questionType=qTm.questionType,            //问题类型 （1单选 2多选 3填空）
                    quesNumK=qTm.numberK+".",
                    quesNumOreder=questionnaireType==2?"":quesNumK,
                    cQuestionAttList=qTm.cQuestionAttList;
                switch (parseInt(questionType)){
                    case 1:
                        selectTips=questionIsRequiredStatus==1?"(必选)":'';
                        break;
                    case 2:
                        var questionOptionMin=qTm.questionOptionMin,
                            questionOptionMax=qTm.questionOptionMax,
                            selectNum="请选择"+questionOptionMin+'-'+questionOptionMax+"项";
                        selectTips=questionIsRequiredStatus==1?"(必选,"+selectNum+")":"";
                        break;
                    case 3:
                        selectTips=questionIsRequiredStatus==1?"(必填)":'';
                        break;
                }
                if($('div[data-id='+qTm.colMenuLayoutModuleId+']').parents('.sp_container').hasClass('sp_container_l')){
                    var quesClass=questionnaireType==2?"questionnaire-l_contentSelectNumVote":"questionnaire-l_contentSelectNum";
                    if(cQuestionAttList.length>0){
                        $.each(cQuestionAttList,function(i,val){
                            _tmPicHtml+='<span class="questionnaire-l_contentSelectPicBoxItem2 al-quesViewBigItem">' +
                                '<img class="questionnaire-l_contentSelectPicBoxItem2Photo" src="'+val.cquestionAttUrl+'" alt="" data-time="'+val.cQuestionAttcreateTime+'">' +
                                '<section class="questionnaire-l-contentSelectPic_cover"></section><section class="questionnaire-l-contentSelectPic_viewBigPic">' +
                                '<img src="/images/img00/column/specialTemplate/Questionnaire_search.png" alt=""><span>点击查看大图</span></section></span>'
                        });
                        _tmHTML='<div class="questionnaire-l_contentSelectTitle2"><span class="'+quesClass+'">'+quesNumOreder+'</span>' +
                            '<span class="questionnaire-l_contentSelectItem">'+questionContent+'<span class="questionnaire_selectTip">'+selectTips+'</span><span class="al-questionNotAnswer"></span></span>' +
                            '</div><div class="questionnaire-l_contentSelectPicBox al-quesViewBigBox">'+_tmPicHtml+'</div>'
                    }else{
                        _tmHTML='<div class="questionnaire-l_contentSelectTitle2 al-noPicQuesTm-l"><span class="'+quesClass+'">'+quesNumOreder+'</span>' +
                            '<span class="questionnaire-l_contentSelectItem">'+questionContent+'<span class="questionnaire_selectTip">'+selectTips+'</span><span class="al-questionNotAnswer"></span></span></div>'
                    }
                }
                if($('div[data-id='+qTm.colMenuLayoutModuleId+']').parents('.sp_container').hasClass('sp_container_m')){
                    var quesClass=questionnaireType==2?"questionnaire-m_contentSelectNumVote":"questionnaire-m_contentSelectNum";
                    if(cQuestionAttList.length>0){
                        $.each(cQuestionAttList,function(i,val){
                            _tmPicHtml+='<span class="questionnaire-m_contentSelectPicBoxItem2 al-quesViewBigItem">' +
                                '<img class="questionnaire-m_contentSelectPicBoxItem2Photo" src="'+val.cquestionAttUrl+'" alt="" data-time="'+val.cQuestionAttcreateTime+'"> ' +
                                '<section class="questionnaire-m-contentSelectPic_cover"></section><section class="questionnaire-m-contentSelectPic_viewBigPic">' +
                                '<img src="/images/img00/column/specialTemplate/Questionnaire_search.png" alt=""><span>点击查看大图</span></section></span>'
                        });
                        _tmHTML='<div class="questionnaire-m_contentSelectTitle2"><span class="'+quesClass+'">'+quesNumOreder+'</span>' +
                            '<span class="questionnaire-m-contentSelectItem">'+questionContent+'<span class="questionnaire_selectTip">'+selectTips+'</span><span class="al-questionNotAnswer"></span></span> ' +
                            '</div><div class="questionnaire-m_contentSelectPicBox al-quesViewBigBox">'+_tmPicHtml+'</div>'
                    }else{
                        _tmHTML='<div class="questionnaire-m_contentSelectTitle2 al-noPicQuesTm-m"><span class="'+quesClass+'">'+quesNumOreder+'</span>' +
                            '<span class="questionnaire-m-contentSelectItem">'+questionContent+'<span class="questionnaire_selectTip">'+selectTips+'</span><span class="al-questionNotAnswer"></span></span></div>'
                    }
                }
                if($('div[data-id='+qTm.colMenuLayoutModuleId+']').parents('.sp_container').hasClass('sp_container_s')){
                    var quesClass=questionnaireType==2?"questionnaire-s_contentSelectNumVote":"questionnaire-s_contentSelectNum";
                    if(cQuestionAttList.length>0){
                        $.each(cQuestionAttList,function(i,val){
                            _tmPicHtml+='<span class="questionnaire-s_contentSelectMorePicItem1 al-quesViewBigItem">' +
                                '<img class="questionnaire-s_contentSelectMorePicItem2Photo" src="'+val.cquestionAttUrl+'" alt="" data-time="'+val.cQuestionAttcreateTime+'"> ' +
                                '<section class="questionnaire-s-contentSelectPic_cover"></section><section class="questionnaire-s-contentSelectPic_viewBigPic"><img src="/images/img00/column/specialTemplate/Questionnaire_search.png" alt=""> ' +
                                '<span>点击查看大图</span></section></span>'
                        });
                        _tmHTML='<div class="questionnaire-s_contentSelectTitle"><span class="'+quesClass+'">'+quesNumOreder+'</span>' +
                            '<span class="questionnaire-s_contentSelectItem">'+questionContent+'<span class="questionnaire_selectTip">'+selectTips+'</span><span class="al-questionNotAnswer"></span></span>' +
                            '</div><div class="questionnaire-s_contentSelectPicBox al-quesViewBigBox">'+_tmPicHtml+'</div>'
                    }else{
                        _tmHTML='<div class="questionnaire-s_contentSelectTitle al-noPicQuesTm-s"><span class="'+quesClass+'">'+quesNumOreder+'</span>' +
                            '<span class="questionnaire-s_contentSelectItem">'+questionContent+'<span class="questionnaire_selectTip">'+selectTips+'</span><span class="al-questionNotAnswer"></span></span></div>'
                    }
                }
                return _tmHTML;
            },
            doSelectOne:function(sOne){
                var t=this,
                    quesTM= t.questionTm(sOne),
                    optionTotalHtml='',
                    quesTMBox='',
                    colQuestionOptionMapList=sOne.colQuestionOptionMapList;  //选项集
                $.each(colQuestionOptionMapList,function(q,cql){
                    var  optionHtmlPic='',
                        optionHtml='',
                        cqoContents=cql.cqoContent?cql.cqoContent:"选项",
                        cqoContent=t.quesCutWord(cqoContents,400);       //选项内容 200字
                    if($('div[data-id='+sOne.colMenuLayoutModuleId+']').parents('.sp_container').hasClass('sp_container_l')){
                        if(cql.cqoPicUrl.length>0){
                            optionHtmlPic+='<section class="questionnaire-l_contentSelectBoxPic al-quesViewBigItem">' +
                                '<img class="questionnaire-l-contentSelectPic" src="'+cql.cqoPicUrl+'" alt="" data-time="'+cql.cqoCreateTime+'">' +
                                '<section class="questionnaire-l-contentSelectPic_cover"></section><section class="questionnaire-l-contentSelectPic_viewBigPic"><img src="/images/img00/column/specialTemplate/Questionnaire_search.png" alt=""> ' +
                                '<span>点击查看大图</span></section></section>'
                        }
                        optionHtml+='<div class="questionnaire-l_contentSelectBox"><div class="al-quesViewBigBox">'+optionHtmlPic+'</div><section class="questionnaire-l-selectCheckBox al-selectItem" data-mark="'+cql.cqoMark+'">' +
                            '<span class="questionnaire-l-selectItemPic al-selectItemBack"></span> ' +
                            '<span class="questionnaire-l-selectItemVote"><span class="questionnaire-l-selectItem">'+cql.cqoMark+'.</span><span class="questionnaire-l-selectItemWord">'+cqoContent+'</span></span></section></div>'
                    }
                    if($('div[data-id='+sOne.colMenuLayoutModuleId+']').parents('.sp_container').hasClass('sp_container_m')){
                        if(cql.cqoPicUrl.length>0){
                            optionHtmlPic+='<section class="questionnaire-m_contentSelectBoxPic al-quesViewBigItem">' +
                                '<img class="questionnaire-m-contentSelectPic" src="'+cql.cqoPicUrl+'" alt="" data-time="'+cql.cqoCreateTime+'">' +
                                '<section class="questionnaire-m-contentSelectPic_cover"></section><section class="questionnaire-m-contentSelectPic_viewBigPic"><img src="/images/img00/column/specialTemplate/Questionnaire_search.png" alt=""> ' +
                                '<span>点击查看大图</span></section></section>'
                        }
                        optionHtml+='<div class="questionnaire-m_contentSelectBox"><div class="al-quesViewBigBox">'+optionHtmlPic+'</div><section class="questionnaire-m-selectCheckBox al-selectItem" data-mark="'+cql.cqoMark+'"><span class="questionnaire-m-selectItemPic al-selectItemBack"></span>' +
                            '<span class="questionnaire-m-selectItemVote">' +
                            '<span class="questionnaire-m-selectItem">'+cql.cqoMark+'.</span><span class="questionnaire-m-selectItemWord">'+cqoContent+'</span></span></section></div>'
                    }
                    if($('div[data-id='+sOne.colMenuLayoutModuleId+']').parents('.sp_container').hasClass('sp_container_s')){
                        if(cql.cqoPicUrl.length>0){
                            optionHtmlPic+='<section class="questionnaire-s_contentSelectBoxPic al-quesViewBigItem">' +
                                '<img class="questionnaire-s-contentSelectPic" src="'+cql.cqoPicUrl+'" alt="" data-time="'+cql.cqoCreateTime+'">' +
                                '<section class="questionnaire-s-contentSelectPic_cover"></section><section class="questionnaire-s-contentSelectPic_viewBigPic"><img src="/images/img00/column/specialTemplate/Questionnaire_search.png" alt=""> ' +
                                '<span>点击查看大图</span></section></section>'
                        }
                        optionHtml+='<div class="questionnaire-s_contentSelectBox"><div class="al-quesViewBigBox">'+optionHtmlPic+'</div><section class="questionnaire-s-selectCheckBox al-selectItem" data-mark="'+cql.cqoMark+'"><span class="questionnaire-s-selectItemPic al-selectItemBack"></span>' +
                            '<span class="questionnaire-s-selectItemVote"><span class="questionnaire-s-selectItem">'+cql.cqoMark+'.</span><span class="questionnaire-s-selectItemWord">'+cqoContent+'</span></span></section></div>'
                    }
                    optionTotalHtml+=optionHtml;
                });
                quesTMBox+='<div class="al-questionList" data-id="'+sOne.questionId+'" data-type="'+sOne.questionType+'" data-required="'+sOne.questionIsRequiredStatus+'">'+quesTM+optionTotalHtml+'</div>';
                return quesTMBox;
            },
            doSelectTwo:function(sTwo){
                var t=this,
                    quesTM= t.questionTm(sTwo),
                    optionTotalHtml='',
                    quesTMBox='',
                    questionOptionMin=sTwo.questionOptionMin,   //最少选项
                    questionOptionMax=sTwo.questionOptionMax,   //最多选项
                    colQuestionOptionMapList=sTwo.colQuestionOptionMapList;  //选项集
                $.each(colQuestionOptionMapList,function(q,cql){
                    var  optionHtmlPic='',
                        optionHtml='',
                        cqoContents=cql.cqoContent?cql.cqoContent:"选项",
                        cqoContent=t.quesCutWord(cqoContents,400);       //选项内容
                    if($('div[data-id='+sTwo.colMenuLayoutModuleId+']').parents('.sp_container').hasClass('sp_container_l')){
                        if(cql.cqoPicUrl.length>0){
                            optionHtmlPic+='<section class="questionnaire-l_contentSelectBoxPic al-quesViewBigItem">' +
                                '<img class="questionnaire-l-contentSelectPic" src="'+cql.cqoPicUrl+'" alt="" data-time="'+cql.cqoCreateTime+'">' +
                                '<section class="questionnaire-l-contentSelectPic_cover"></section><section class="questionnaire-l-contentSelectPic_viewBigPic"><img src="/images/img00/column/specialTemplate/Questionnaire_search.png" alt=""> ' +
                                '<span>点击查看大图</span></section></section>'
                        }
                        optionHtml+='<div class="questionnaire-l_contentSelectBox"><div class="al-quesViewBigBox">'+optionHtmlPic+'</div><section class="questionnaire-l_contentMultiSelectBox al-selectItem" data-mark="'+cql.cqoMark+'">' +
                            '<span class="questionnaire-l_contentMultiSelectCheck al-selectItemBack"></span><span class="questionnaire-l-selectItemVote"><span class="questionnaire-l-selectItem">'+cql.cqoMark+'.</span>' +
                            '<span class="questionnaire-l-selectItemWord">'+cqoContent+'</span></span></section></div>'
                    }
                    if($('div[data-id='+sTwo.colMenuLayoutModuleId+']').parents('.sp_container').hasClass('sp_container_m')){
                        if(cql.cqoPicUrl.length>0){
                            optionHtmlPic+='<section class="questionnaire-m_contentSelectBoxPic al-quesViewBigItem">' +
                                '<img class="questionnaire-m-contentSelectPic" src="'+cql.cqoPicUrl+'" alt="" data-time="'+cql.cqoCreateTime+'">' +
                                '<section class="questionnaire-m-contentSelectPic_cover"></section><section class="questionnaire-m-contentSelectPic_viewBigPic"><img src="/images/img00/column/specialTemplate/Questionnaire_search.png" alt=""> ' +
                                '<span>点击查看大图</span></section></section>'
                        }
                        optionHtml+='<div class="questionnaire-m_contentSelectBox"><div class="al-quesViewBigBox">'+optionHtmlPic+'</div><section class="questionnaire-m_contentMultiSelectBox al-selectItem" data-mark="'+cql.cqoMark+'">' +
                            '<span class="questionnaire-l_contentMultiSelectCheck al-selectItemBack"></span><span class="questionnaire-m-selectItemVote">' +
                            '<span class="questionnaire-m-selectItem">'+cql.cqoMark+'.</span><span class="questionnaire-m-selectItemWord">'+cqoContent+'</span></span></section></div>'
                    }
                    if($('div[data-id='+sTwo.colMenuLayoutModuleId+']').parents('.sp_container').hasClass('sp_container_s')){
                        if(cql.cqoPicUrl.length>0){
                            optionHtmlPic+='<section class="questionnaire-s_contentSelectBoxPic al-quesViewBigItem">' +
                                '<img class="questionnaire-s-contentSelectPic" src="'+cql.cqoPicUrl+'" alt="" data-time="'+cql.cqoCreateTime+'">' +
                                '<section class="questionnaire-s-contentSelectPic_cover"></section><section class="questionnaire-s-contentSelectPic_viewBigPic"><img src="/images/img00/column/specialTemplate/Questionnaire_search.png" alt=""> ' +
                                '<span>点击查看大图</span></section></section>'
                        }
                        optionHtml+='<div class="questionnaire-s_contentSelectBox"><div class="al-quesViewBigBox">'+optionHtmlPic+'</div><section class="questionnaire-s_contentMultiSelectBox al-selectItem" data-mark="'+cql.cqoMark+'">' +
                            '<span class="questionnaire-l_contentMultiSelectCheck al-selectItemBack"></span><span class="questionnaire-s-selectItemVote">' +
                            '<span class="questionnaire-s-selectItem">'+cql.cqoMark+'.</span><span class="questionnaire-s-selectItemWord">'+cqoContent+'</span></span></section></div>'
                    }
                    optionTotalHtml+=optionHtml;
                });
                quesTMBox+='<div class="al-questionList" data-id="'+sTwo.questionId+'" data-type="'+sTwo.questionType+'" data-required="'+sTwo.questionIsRequiredStatus+'" data-max="'+questionOptionMax+'" data-min="'+questionOptionMin+'">'+quesTM+optionTotalHtml+'</div>';
                return quesTMBox;
            },
            doSelectThree:function(sThree){
                var t=this,
                    quesTM= t.questionTm(sThree),
                    textareaHtml='',
                    quesTMBox='';

                    if($('div[data-id='+sThree.colMenuLayoutModuleId+']').parents('.sp_container').hasClass('sp_container_l')){
                        textareaHtml+='<div class="questionnaire-l_contentQuestionBox"><form action="">' +
                            '<textarea class="questionnaire-l_contentQuestionArea al-questionnaireAreaP" name="" id="mq" cols="30" rows="10" placeholder="请输入内容"></textarea></form></div>'
                    }
                    if($('div[data-id='+sThree.colMenuLayoutModuleId+']').parents('.sp_container').hasClass('sp_container_m')){
                        textareaHtml+='<div class="questionnaire-m_contentQuestionBoxM"><form action=""><textarea class="questionnaire-m_contentQuestionAreaM al-questionnaireAreaP" name="" id="233" cols="30" rows="10" placeholder="请输入内容"></textarea> ' +
                            '</form></div>'
                    }
                    if($('div[data-id='+sThree.colMenuLayoutModuleId+']').parents('.sp_container').hasClass('sp_container_s')){
                        textareaHtml+='<div class="questionnaire-s_contentQuestionBoxM"><form action=""><textarea class="questionnaire-s_contentQuestionAreaM al-questionnaireAreaP" name="" id="31" cols="30" rows="10" placeholder="请输入内容"></textarea> ' +
                            '</form></div>'
                    }

                quesTMBox+='<div class="al-questionList" data-id="'+sThree.questionId+'" data-type="'+sThree.questionType+'" data-required="'+sThree.questionIsRequiredStatus+'">'+quesTM+textareaHtml+'</div>';
                return quesTMBox;
            },
            doSelectBtnHtml:function(SBh){
                var questionData=SBh.questionData,
                    upDownBtnHtml='',
                    cqStartTime=questionData.cqStartTime?Date.parse((questionData.cqStartTime).replace(/-/g,"/")):'',    //开始时间
                    cqEndTime=questionData.cqEndTime?Date.parse((questionData.cqEndTime).replace(/-/g,"/")):'',              //结束时间
                    cqStartTimeLocal = questionData.cqStartTime?comm.date.date_word(questionData.cqStartTime)+questionData.cqStartTime.substring(11,13)+"时"+questionData.cqStartTime.substring(14,16)+"分":"";
                    beginTime = cqStartTimeLocal?cqStartTimeLocal.substring(5):""
                    today=Date.parse(new Date()),                 //系统当前时间
                    isPage=questionData.isPage,                   //是否分页
                    upPage=(isPage==1?"上一页":"上一题"),
                    downPage=(isPage==1?"下一页":"下一题");

                if($('div[data-id='+SBh.colMenuLayoutModuleId+']').parents('.sp_container').hasClass('sp_container_l')){
                    if((cqStartTime&&cqStartTime<today)&&(cqEndTime&&cqEndTime>today)){ // 开始时间<当前时间<结束时间
                        upDownBtnHtml+='<section class="questionnaire-l_contentUpDown"><div class="questionnaire-l_contentUpDownL al-prevBtn">'+upPage+'</div>' +
                            '<div class="questionnaire-l_contentUpDownR al-nextBtn">'+downPage+'</div><div class="questionnaire-l_contentUpDownRDefault al-nextBtnDefault">'+downPage+'</div></section>' +
                            '<section class="al-questionnaireVoteResult"></section><section class="al-questionnaireShowTips"></section><section class="al-questionnaireViewBig"></section>';
                    }else if(cqStartTime&&cqStartTime>today){// 开始时间》当前时间 未开始
                        upDownBtnHtml+='<div class="questionnaire-l_contentUpDown">' +
                            '<div class="questionnaire-l_contentUpDownRDefault center">'+downPage+'</div></div><section class="al-questionnaireViewBig"></section>';
                        $('.sp_container [data-id='+SBh.colMenuLayoutModuleId+']').find('.total_title').append('<div class="al-questionnaireAboutTitleTip">(问卷将于'+beginTime+'开启，敬请期待！)</div>');
                        $('.sp_container [data-id='+SBh.colMenuLayoutModuleId+']').attr('outTime',1);   //添加不在问卷时间内标记

                        if($('.sp_container [data-id='+SBh.colMenuLayoutModuleId+']').find('.total_title').hasClass('total_title_left')){
                            $('.sp_container [data-id='+SBh.colMenuLayoutModuleId+']').find('.al-questionnaireAboutTitleTip').addClass('total_title_left').css({display:'block',fontSize:'15px'});
                        }else if($('.sp_container [data-id='+SBh.colMenuLayoutModuleId+']').find('.total_title').hasClass('total_title_center')){
                            $('.sp_container [data-id='+SBh.colMenuLayoutModuleId+']').find('.al-questionnaireAboutTitleTip').addClass('total_title_center').css({display:'block',fontSize:'15px'});
                        } if($('.sp_container [data-id='+SBh.colMenuLayoutModuleId+']').find('.total_title').hasClass('total_title_right')){
                            $('.sp_container [data-id='+SBh.colMenuLayoutModuleId+']').find('.al-questionnaireAboutTitleTip').addClass('total_title_right').css({display:'block',fontSize:'15px'});
                        }
                    }else {
                        upDownBtnHtml+='<div class="questionnaire-l_contentUpDown">' +
                            '<div class="questionnaire-l_contentUpDownRDefault center">'+downPage+'</div></div><section class="al-questionnaireViewBig"></section>';
                        $('.sp_container [data-id='+SBh.colMenuLayoutModuleId+']').find('.total_title').append('<i class="al-questionnaireAboutTitleTip">(很抱歉，此问卷已结束)</i>');
                        $('.sp_container [data-id='+SBh.colMenuLayoutModuleId+']').attr('outTime',1);//添加不在问卷时间内标记
                    }
                }
                if($('div[data-id='+SBh.colMenuLayoutModuleId+']').parents('.sp_container').hasClass('sp_container_m')){
                    if((cqStartTime&&cqStartTime<today)&&(cqEndTime&&cqEndTime>today)){ // 开始时间<当前时间<结束时间
                        upDownBtnHtml+='<section class="questionnaire-m_contentUpDown"><div class="questionnaire-m_contentUpDownL al-prevBtn">'+upPage+'</div>' +
                            '<div class="questionnaire-m_contentUpDownR al-nextBtn">'+downPage+'</div><div class="questionnaire-m_contentUpDownRDefault al-nextBtnDefault">'+downPage+'</div></section>' +
                            '<section class="al-questionnaireVoteResult"></section><section class="al-questionnaireShowTips"></section><section class="al-questionnaireViewBig"></section>';
                    }else if(cqStartTime&&cqStartTime>today){// 开始时间》当前时间 未开始
                        upDownBtnHtml+='<div class="questionnaire-m_contentUpDown">' +
                            '<div class="questionnaire-m_contentUpDownRDefault center">'+downPage+'</div></div><section class="al-questionnaireViewBig"></section>';
                        $('.sp_container [data-id='+SBh.colMenuLayoutModuleId+']').find('.total_title').append('<div class="al-questionnaireAboutTitleTip" style="display:block;">(问卷将于'+beginTime+'开启，敬请期待！)</div>');
                        $('.sp_container [data-id='+SBh.colMenuLayoutModuleId+']').attr('outTime',1);//添加不在问卷时间内标记

                        if($('.sp_container [data-id='+SBh.colMenuLayoutModuleId+']').find('.total_title').hasClass('total_title_left')){
                            $('.sp_container [data-id='+SBh.colMenuLayoutModuleId+']').find('.al-questionnaireAboutTitleTip').addClass('total_title_left').css({display:'block',fontSize:'15px'});
                        }else if($('.sp_container [data-id='+SBh.colMenuLayoutModuleId+']').find('.total_title').hasClass('total_title_center')){
                            $('.sp_container [data-id='+SBh.colMenuLayoutModuleId+']').find('.al-questionnaireAboutTitleTip').addClass('total_title_center').css({display:'block',fontSize:'15px'});
                        } if($('.sp_container [data-id='+SBh.colMenuLayoutModuleId+']').find('.total_title').hasClass('total_title_right')){
                            $('.sp_container [data-id='+SBh.colMenuLayoutModuleId+']').find('.al-questionnaireAboutTitleTip').addClass('total_title_right').css({display:'block',fontSize:'15px'});
                        }
                    }else {
                        upDownBtnHtml+='<div class="questionnaire-m_contentUpDown">' +
                            '<div class="questionnaire-m_contentUpDownRDefault center">'+downPage+'</div></div><section class="al-questionnaireViewBig"></section>';
                        $('.sp_container [data-id='+SBh.colMenuLayoutModuleId+']').find('.total_title').append('<i class="al-questionnaireAboutTitleTip">(很抱歉，此问卷已结束)</i>');
                        $('.sp_container [data-id='+SBh.colMenuLayoutModuleId+']').attr('outTime',1);//添加不在问卷时间内标记
                    }
                }
                if($('div[data-id='+SBh.colMenuLayoutModuleId+']').parents('.sp_container').hasClass('sp_container_s')){
                    if((cqStartTime&&cqStartTime<today)&&(cqEndTime&&cqEndTime>today)){ // 开始时间<当前时间<结束时间
                        upDownBtnHtml+='<section class="questionnaire-s_contentUpDown"><div class="questionnaire-s_contentUpDownL al-prevBtn">'+upPage+'</div>' +
                            '<div class="questionnaire-s_contentUpDownR al-nextBtn">'+downPage+'</div><div class="questionnaire-s_contentUpDownRDefault al-nextBtnDefault">'+downPage+'</div></section>' +
                            '<section class="al-questionnaireVoteResult"></section><section class="al-questionnaireShowTips"></section><section class="al-questionnaireViewBig"></section>';
                    }else if(cqStartTime&&cqStartTime>today){// 开始时间》当前时间 未开始
                        upDownBtnHtml+='<div class="questionnaire-s_contentUpDown">' +
                            '<div class="questionnaire-s_contentUpDownRDefault center">'+downPage+'</div></div><section class="al-questionnaireViewBig"></section>';
                        $('.sp_container [data-id='+SBh.colMenuLayoutModuleId+']').find('.total_title').append('<div class="al-questionnaireAboutTitleTip" style="display: block;" >(问卷将于'+beginTime+'开启，敬请期待！)</div>');
                        $('.sp_container [data-id='+SBh.colMenuLayoutModuleId+']').attr('outTime',1);//添加不在问卷时间内标记

                        if($('.sp_container [data-id='+SBh.colMenuLayoutModuleId+']').find('.total_title').hasClass('total_title_left')){
                            $('.sp_container [data-id='+SBh.colMenuLayoutModuleId+']').find('.al-questionnaireAboutTitleTip').addClass('total_title_left').css({display:'block',fontSize:'15px'});
                        }else if($('.sp_container [data-id='+SBh.colMenuLayoutModuleId+']').find('.total_title').hasClass('total_title_center')){
                            $('.sp_container [data-id='+SBh.colMenuLayoutModuleId+']').find('.al-questionnaireAboutTitleTip').addClass('total_title_center').css({display:'block',fontSize:'15px'});
                        } if($('.sp_container [data-id='+SBh.colMenuLayoutModuleId+']').find('.total_title').hasClass('total_title_right')){
                            $('.sp_container [data-id='+SBh.colMenuLayoutModuleId+']').find('.al-questionnaireAboutTitleTip').addClass('total_title_right').css({display:'block',fontSize:'15px'});
                        }
                    }else {
                        upDownBtnHtml+='<div class="questionnaire-s_contentUpDown">' +
                            '<div class="questionnaire-s_contentUpDownRDefault center">'+downPage+'</div></div><section class="al-questionnaireViewBig"></section>';
                        $('.sp_container [data-id='+SBh.colMenuLayoutModuleId+']').find('.total_title').append('<i class="al-questionnaireAboutTitleTip">(很抱歉，此问卷已结束)</i>');
                        $('.sp_container [data-id='+SBh.colMenuLayoutModuleId+']').attr('outTime',1);//添加不在问卷时间内标记
                    }
                }
                return upDownBtnHtml;
            },
            //投票Dome
            voteQuesHtml:function(vQh){
                var t=this,
                    _html='',
                    voteData=vQh.voteData.colQuestionMapList?vQh.voteData.colQuestionMapList[0]:'',  //投票题集
                    questionId=voteData.questionId,              //题目ID
                    questionOrder=voteData.questionOrder,        //题目序号
                    questionType=voteData.questionType,           //题目类型（1单选、2多选、3填空)
                    questionIsRequiredStatus=voteData.questionIsRequiredStatus,  //是否必填
                    cQuestionAttList=voteData.cQuestionAttList,   //题目图集
                    questionContent=voteData.questionContent,     //题目内容
                    colQuestionOptionMapList=voteData.colQuestionOptionMapList;   //题目选项集合
                switch (parseInt(questionType)){
                    case 1:   //单题
                        _html+=t.doSelectOne({
                            questionnaireType:vQh.questionnaireType,
                            colMenuLayoutModuleId:vQh.colMenuLayoutModuleId,
                            questionId:questionId,
                            questionType:questionType,
                            questionIsRequiredStatus:questionIsRequiredStatus,
                            cQuestionAttList:cQuestionAttList,
                            questionContent:questionContent,
                            colQuestionOptionMapList:colQuestionOptionMapList,
                            numberK:questionOrder
                        });
                        break;
                    case 2:  //多题
                        _html+=t.doSelectTwo({
                            questionnaireType:vQh.questionnaireType,
                            colMenuLayoutModuleId:vQh.colMenuLayoutModuleId,
                            questionId:questionId,
                            questionType:questionType,
                            questionIsRequiredStatus:questionIsRequiredStatus,
                            questionOptionMin:voteData.questionOptionMin,  //最少选项
                            questionOptionMax:voteData.questionOptionMax,  //最多选项
                            cQuestionAttList:cQuestionAttList,
                            questionContent:questionContent,
                            colQuestionOptionMapList:colQuestionOptionMapList,
                            numberK:questionOrder
                        });
                        break;
                }
                return _html;
            },
            voteBtnHtml:function(vBh){
                var _btnHtml='';
                var todayVote=Date.parse(new Date()),
                    questionData=vBh.voteData,
                    cqStartTime=questionData.cqStartTime?Date.parse((questionData.cqStartTime).replace(/-/g,"/")):'',    //开始时间
                    cqEndTime=questionData.cqEndTime?Date.parse((questionData.cqEndTime).replace(/-/g,"/")):'',              //结束时间
                    overTime=todayVote>cqEndTime?"已结束":"投票",
                    preTime=todayVote<cqStartTime?"未开始":"投票";
                if($('div[data-id='+vBh.colMenuLayoutModuleId+']').parents('.sp_container').hasClass('sp_container_l')){
                    if(cqStartTime==""&&cqEndTime==""||cqStartTime<todayVote&&todayVote<cqEndTime||cqStartTime==""&&todayVote<cqEndTime||cqStartTime<todayVote&&cqEndTime==""){
                        if(questionData.customerStatusQuestionnaire>0){
                            _btnHtml+='<div class="questionnaire-l_contentVote"><div class="questionnaire-l_contentVoteBtnDis voted">已投票</div>' +
                                '<div class="questionnaire-l_contentVoteResult al-voteViewR" style="display: '+(questionData.isShowResult==2?"block":"none")+'">查看结果</div></div>' +
                                '<section class="al-questionnaireVoteResult"></section><section class="al-questionnaireViewBig"></section>';
                        }else{
                            _btnHtml+=' <div class="questionnaire-l_contentVote"><div class="questionnaire-l_contentVoteBtnDis voted hide">已投票</div>' +
                                '<div class="questionnaire-l_contentVoteBtn al-voteDoing">投票</div>' +
                                '<div class="questionnaire-l_contentVoteResult al-voteViewR" style="display: '+(questionData.isShowResult==2?"block":"none")+'">查看结果</div></div>' +
                                '<section class="al-questionnaireVoteResult"></section><section class="al-voteShowTips"></section><section class="al-questionnaireViewBig"></section>'
                        }
                    }else{
                        _btnHtml+='<div class="questionnaire-l_contentVote"><div class="questionnaire-l_contentVoteBtnDis voted">'+(todayVote>cqEndTime?overTime:preTime)+'</div>' +
                            '<div class="questionnaire-l_contentVoteResult al-voteViewR" style="display: '+(questionData.isShowResult==2?"block":"none")+'">查看结果</div></div>' +
                            '<section class="al-questionnaireVoteResult"></section><section class="al-questionnaireViewBig"></section>';
                    }
                }
                if($('div[data-id='+vBh.colMenuLayoutModuleId+']').parents('.sp_container').hasClass('sp_container_m')){
                    if(cqStartTime==""&&cqEndTime==""||cqStartTime<todayVote&&todayVote<cqEndTime||cqStartTime==""&&todayVote<cqEndTime||cqStartTime<todayVote&&cqEndTime==""){
                        if(questionData.customerStatusQuestionnaire>0){
                            _btnHtml+='<div class="questionnaire-m_contentVote"><div class="questionnaire-l_contentVoteBtnDis voted">已投票</div>' +
                                '<div class="questionnaire-l_contentVoteResult al-voteViewR" style="display: '+(questionData.isShowResult==2?"block":"none")+'">查看结果</div></div>' +
                                '<section class="al-questionnaireVoteResult"></section><section class="al-questionnaireViewBig"></section>'
                        }else{
                            _btnHtml+='<div class="questionnaire-m_contentVote"><div class="questionnaire-l_contentVoteBtnDis voted hide">已投票</div>' +
                                '<div class="questionnaire-l_contentVoteBtn al-voteDoing">投票</div>' +
                                '<div class="questionnaire-l_contentVoteResult al-voteViewR" style="display: '+(questionData.isShowResult==2?"block":"none")+'">查看结果</div></div>' +
                                '<section class="al-questionnaireVoteResult"></section><section class="al-voteShowTips"></section><section class="al-questionnaireViewBig"></section>'
                        }
                    }else{
                        _btnHtml+='<div class="questionnaire-m_contentVote"><div class="questionnaire-l_contentVoteBtnDis voted">'+(todayVote>cqEndTime?overTime:preTime)+'</div>' +
                            '<div class="questionnaire-l_contentVoteResult al-voteViewR" style="display: '+(questionData.isShowResult==2?"block":"none")+'">查看结果</div></div>' +
                            '<section class="al-questionnaireShowTips"></section><section class="al-questionnaireVoteResult"></section><section class="al-questionnaireViewBig"></section>'
                    }
                }
                if($('div[data-id='+vBh.colMenuLayoutModuleId+']').parents('.sp_container').hasClass('sp_container_s')){
                    if(cqStartTime==""&&cqEndTime==""||cqStartTime<todayVote&&todayVote<cqEndTime||cqStartTime==""&&todayVote<cqEndTime||cqStartTime<todayVote&&cqEndTime==""){
                        if(questionData.customerStatusQuestionnaire>0){
                            _btnHtml+='<div class="questionnaire-s_contentVote"><div class="questionnaire-s_contentVoteBtnDis voted">已投票</div>' +
                                '<div class="questionnaire-s_contentVoteResult al-voteViewR" style="display: '+(questionData.isShowResult==2?"block":"none")+'">查看结果</div></div>' +
                                '<section class="al-questionnaireVoteResult"></section><section class="al-questionnaireViewBig"></section>'
                        }else{
                            _btnHtml+='<div class="questionnaire-s_contentVote"><div class="questionnaire-s_contentVoteBtnDis voted hide">已投票</div>' +
                                '<div class="questionnaire-s_contentVoteBtn al-voteDoing">投票</div>' +
                                '<div class="questionnaire-s_contentVoteResult al-voteViewR" style="display: '+(questionData.isShowResult==2?"block":"none")+'">查看结果</div></div>' +
                                '<section class="al-questionnaireVoteResult"></section><section class="al-voteShowTips"></section><section class="al-questionnaireViewBig"></section>'
                        }
                    }else{
                        _btnHtml+='<div class="questionnaire-s_contentVote"><div class="questionnaire-s_contentVoteBtnDis voted">'+(todayVote>cqEndTime?overTime:preTime)+'</div>' +
                            '<div class="questionnaire-s_contentVoteResult al-voteViewR" style="display: '+(questionData.isShowResult==2?"block":"none")+'">查看结果</div></div>' +
                            '<section class="al-questionnaireVoteResult"></section><section class="al-questionnaireViewBig"></section>'
                    }
                }
                return _btnHtml;
            },
            doVoteResultHtml:function(dVRt){
                var _reHtmlL='',
                    _reHtmlC='',
                    resultList=dVRt.data_list,    //选项集合
                    questionContent=dVRt.questionContent?comm.getStrLen(dVRt.questionContent,300*2):"",  //题目内容96*2
                    totalCount=parseInt(dVRt.questionOptionCount);  //总人数
                $.each(resultList,function(a,Pv){
                    var reVoteMark=Pv.questionOption,
                        questionOptionCount=parseInt(Pv.questionOptionCount),  //选项小计
                        votePercent=Math.round(((questionOptionCount/totalCount)>0?questionOptionCount/totalCount:0)*100)+"%";
                    _reHtmlL+='<figure class="al-online_ResultContent"><span class="al-online_ResultNum"><span class="al-onlineOptionItem">'+reVoteMark+'.</span>选项</span><span class="al-online_ResultProcess">' +
                        '<span class="al-online_ResultProcessB"></span><span class="al-online_ResultProcessP" data-process="'+votePercent+'"></span></span><span class="al-resultPercent">'+votePercent+'</span>' +
                        '<span class="al-resultItemNum">'+questionOptionCount+'票</span></figure>';
                });
                _reHtmlC+='<div class="al-online_cover voteResult"><div class="al-viewResultBox"><div class="al-online_voteResult"><header class="al-onlineVote"><span>投票结果</span>' +
                    '<b class="al-voteResultClose"></b></header><section class="al-online_voteResult_Main"><p class="al-online_voteTitle"><span class="al-online_voteTitleT"></span>' +
                    '<span class="al-online_voteTitleW">'+questionContent+'</span></p>'+_reHtmlL+'</section></div></div></div>';
                return _reHtmlC;
            },
            //分享Dome
            doShareHtml:function(dShare){
                var t=this,
                    _shareHtml='',
                    _shareComm='';
                var _cusName="";

                if($('#sesCustomerId').val()&&$('#sesCustomerId').data().userName){
                    _cusName = "尊敬的"+$('#sesCustomerId').data().userName+"，";
                }
                _shareComm+='<section id="al-quesShareCon" class="al-shareBox al-quesShareCon">' +
                    '<figure class="al-shareListItem ev-ttrend al-quesShare al-quesShareConTs" style="margin-left:8px"><img src="//img10.allinmd.cn/v3/common/icon/share_inset_no.png" alt="">' +
                    '<figcaption>唯医朋友圈</figcaption></figure>' +
                    '<figure class="al-shareListItem ev-tweixin al-quesShare" style="width:48px"><img src="//img10.allinmd.cn/v3/common/icon/share_weixin.png" alt="">' +
                    '<figcaption>微信</figcaption></figure>' +
                    '<figure class="al-shareListItem ev-tsina al-quesShare" style="width:48px"><img src="//img10.allinmd.cn/v3/common/icon/share_weibo.png" alt="">' +
                    '<figcaption>微博</figcaption></figure>' +
                    '<figure class="al-shareListItem ev-tqzone al-quesShare" style="margin-left:4px;margin-right:4px"><img src="//img10.allinmd.cn/v3/common/icon/share_zone.png" alt="">' +
                    '<figcaption>QQ空间</figcaption></figure>' +
                    '<figure class="al-shareListItem ev-tqq al-quesShare" style="width:48px"><img src="//img10.allinmd.cn/v3/common/icon/share_qq.png" alt="">' +
                    '<figcaption>QQ</figcaption></figure>' +
                    '<section class="al-weixinErweiCodeBox ev-erweima hide" style="display: none;"><span>使用微信扫描二维码</span><img src="//img10.allinmd.cn/v3/friends/weixin_share.jpg" alt="">' +
                    '</section></section>';

                if ($('div[data-id=' + dShare.colMenuLayoutModuleId + ']').parents('.sp_container').hasClass('sp_container_l')) {
                    _shareHtml='<div class="questionnaire-l_content"><p class="questionnaire-l_shareTitle">'+_cusName+dShare.endContent+'</p>' +
                        '<figure class="questionnaire-l_shareBtn" data-content="'+dShare.shareContent+'" data-picurl="'+dShare.sharePicUrl+'" data-title="'+dShare.share_title+'">' +
                        '<div class="al-backToTop al-questionnaire"><div class="questionnaire-l_shareWord al-shareBtn  " style="display: '+(dShare.isShareState==1?"inline-block":"none")+'">分享'+_shareComm+'</div></div></figure></div>'
                }
                if ($('div[data-id=' + dShare.colMenuLayoutModuleId + ']').parents('.sp_container').hasClass('sp_container_m')) {
                    _shareHtml='<div class="questionnaire-m_content"><p class="questionnaire-m_shareTitle">'+_cusName+dShare.endContent+'</p>' +
                        '<figure class="questionnaire-m_shareBtn" data-content="'+dShare.shareContent+'" data-picurl="'+dShare.sharePicUrl+'" data-title="'+dShare.share_title+'">' +
                        '<div class="al-backToTop al-questionnaire"><div class="questionnaire-m_shareWord al-shareBtn " style="display: '+(dShare.isShareState==1?"inline-block":"none")+'">分享'+_shareComm+'</div></div></figure></div>'
                }
                if ($('div[data-id=' + dShare.colMenuLayoutModuleId + ']').parents('.sp_container').hasClass('sp_container_s')) {
                    _shareHtml='<div class="questionnaire-s_content" ><p class="questionnaire-s_shareTitle">'+_cusName+dShare.endContent+'</p>' +
                        '<figure class="questionnaire-s_shareBtn" data-content="'+dShare.shareContent+'" data-picurl="'+dShare.sharePicUrl+'" data-title="'+dShare.share_title+'">' +
                        '<div class="al-backToTop al-questionnaire"><div class="questionnaire-s_shareWord al-shareBtn " style="display: '+(dShare.isShareState==1?"inline-block":"none")+'">分享'+_shareComm+'</div></div></figure></div>'
                }
                $('div[data-id='+dShare.colMenuLayoutModuleId+']').find('.resource_list').html(_shareHtml);
                $('.sp_container [data-id='+dShare.colMenuLayoutModuleId+']').attr("data-submitted","1");
                t.questionnaireShare(dShare.colMenuLayoutModuleId);
                $('div[data-id='+dShare.colMenuLayoutModuleId+']').find('.al-shareBtn').on("click",function(){
                    $(this).find('#al-quesShareCon').toggle();
                    return false;
                });

            },
            //逻辑部分
            questionAction:function(qvl){
               var t=this,
                   isPage=qvl.questionData.isPage,   //是否分页 （1分页 0不分页）
                   pageList=$('.sp_container [data-id=' + qvl.colMenuLayoutModuleId + ']').find('.al-questionnairePageList').hide();
                $(pageList[0]).show().addClass('active');
                $('.sp_container [data-id=' + qvl.colMenuLayoutModuleId + ']').find('.al-prevBtn').hide().siblings('.al-nextBtn').addClass('center');
                if(isPage==1){
                    $('.sp_container [data-id=' + qvl.colMenuLayoutModuleId + ']').find('.al-nextBtnDefault').addClass('center').hide();
                    t.questionBtn(qvl)
                }else{
                    var quesElement=$('div[data-id=' + qvl.colMenuLayoutModuleId + ']').find('.al-questionnairePageList.active').children();
                    if($(quesElement).data('required')==1){
                        $('div[data-id=' + qvl.colMenuLayoutModuleId + ']').find('.al-nextBtnDefault').show().addClass('center').siblings('.al-nextBtn').hide();
                    }else{
                        $('div[data-id=' + qvl.colMenuLayoutModuleId + ']').find('.al-nextBtnDefault').hide();
                    }
                    t.questionBtn(qvl);
                }

                if ($('div[data-id=' + qvl.colMenuLayoutModuleId + ']').parents('.sp_container').hasClass('sp_container_l')) {
                    if(pageList.length==1){
                        $('.sp_container [data-id=' + qvl.colMenuLayoutModuleId + ']').find('.questionnaire-l_contentUpDownR').text("提交").addClass('submitted').siblings('.questionnaire-l_contentUpDownRDefault').text("提交");
                    }
                    //t.questionBtn(qvl);
                }
                if ($('div[data-id=' + qvl.colMenuLayoutModuleId + ']').parents('.sp_container').hasClass('sp_container_m')) {
                    if(pageList.length==1){
                        $('.sp_container [data-id=' + qvl.colMenuLayoutModuleId + ']').find('.questionnaire-m_contentUpDownR').text("提交").addClass('submitted').siblings('.questionnaire-m_contentUpDownRDefault').text("提交");
                    }
                    //t.questionBtn(qvl);
                }
                if ($('div[data-id=' + qvl.colMenuLayoutModuleId + ']').parents('.sp_container').hasClass('sp_container_s')) {
                    if(pageList.length==1){
                        $('.sp_container [data-id=' + qvl.colMenuLayoutModuleId + ']').find('.questionnaire-s_contentUpDownR').text("提交").addClass('submitted').siblings('.questionnaire-s_contentUpDownRDefault').text("提交");
                    }
                    //t.questionBtn(qvl);
                }

            },
            questionBtn:function(qvl){
                var t=this;
                $('.sp_container [data-id=' + qvl.colMenuLayoutModuleId + ']').find('.al-nextBtn').hover(function(){
                    $(this).addClass('hover');
                },function(){
                    $(this).removeClass('hover');
                }).mousedown(function(){
                    $(this).addClass("next");
                }).mouseup(function(){
                    $(this).removeClass("next");
                //}).on("click",function(){
                    $(this).addClass("checked");
                    if(parseInt(qvl.questionData.userType)!==3){
                        if (parseInt(qvl.questionData.userType)==1){
                            var logType=privilegeSceneConst.eSceneTypeLogin;
                            if($('#sesCustomerId').val()){
                                t.nextQues(qvl);
                            }else{
                                user.login({
                                    callback: function () {
                                        t.nextQues(qvl);
                                    },
                                    scene: logType,
                                    onClose:function(){
                                    },
                                    onAuthCancel:function(){//必须刷新，否则之前请求的数据是未登录状态下的，会显示已答过问卷
                                        g_sps.jump(null,location.href);
                                    }
                                    //noAuthReload:true
                                });
                            }
                        }else{
                            var logType=privilegeSceneConst.eSceneTypeAuth;
                            if($('#sesAuth').val()==2||$('#sesAuth').val()==7||$('#sesAuth').val()==8||$('#sesAuth').val()==9){
                                t.nextQues(qvl);
                            }else{
                                user.login({
                                    callback: function () {
                                        t.nextQues(qvl);
                                    },
                                    scene: logType,
                                    onClose:function(){
                                    },
                                    onAuthCancel:function(){
                                        g_sps.jump(null,location.href);
                                    },
                                    stay:true
                                    //noAuthReload:true
                                });
                            }
                        }
                        //user.login({
                        //    callback: function () {
                        //        t.nextQues(qvl);
                        //    },
                        //    scene: logType,
                        //    onClose:function(){
                        //    },
                        //    onAuthCancel:'stay'
                        //    //noAuthReload:true
                        //});
                    }else{
                        t.nextQues(qvl);
                    }
                }).removeClass('default');
                $('.sp_container [data-id=' + qvl.colMenuLayoutModuleId + ']').find('.al-prevBtn').hover(function(){
                        $(this).addClass('hover');
                    },function(){$(this).removeClass('hover');
                    }).mousedown(function(){
                        $(this).addClass("previous");
                    }).mouseup(function(){
                        $(this).removeClass("previous");
                        $(this).addClass("checked");
                    t.preQues(qvl);
                    }).removeClass('default');
            },
            preQues:function(pQv){
                var isPage=pQv.questionData.isPage,   //是否分页
                    btnText=isPage==1?"下一页":"下一题",
                    questionIndex=$('div[data-id=' + pQv.colMenuLayoutModuleId + ']').find('.al-questionnairePageList.active').index()+1;   //当前题索引
                $('.sp_container [data-id=' + pQv.colMenuLayoutModuleId + ']').find('.al-nextBtn').show().text(btnText).removeClass('submitted').siblings('.al-nextBtnDefault').hide().text(btnText);
                if(questionIndex==2){
                    $('.sp_container [data-id=' + pQv.colMenuLayoutModuleId + ']').find('.al-prevBtn').hide().siblings('.al-nextBtn').addClass('center');
                    $('div[data-id=' + pQv.colMenuLayoutModuleId + ']').find('.al-voteDetail').show();
                    $('div[data-id=' + pQv.colMenuLayoutModuleId + ']').find('.al-questionBox').removeClass('al-questionTop');
                }
                $('div[data-id=' + pQv.colMenuLayoutModuleId + ']').find('.al-questionnairePageList.active').removeClass('active').hide().prev().show().addClass('active');
            },
            nextQues:function(nQl){
                var t=this,
                    questionCount=nQl.data.totalCount,
                    submitted='',
                    isPage=nQl.questionData.isPage,       //是否分页
                    offsettop=$('.sp_container [data-id='+nQl.colMenuLayoutModuleId+']').offset().top;
                //多题时 先验证必答题是否完成 再显示下一题
                var selectBox=$('div[data-id=' + nQl.colMenuLayoutModuleId + ']').find('.al-questionnairePageList.active'),
                    selectedNum=$('div[data-id=' + nQl.colMenuLayoutModuleId + ']').find('.al-questionnairePageList.active').children(),
                    questionIndex=$('div[data-id=' + nQl.colMenuLayoutModuleId + ']').find('.al-questionnairePageList.active').index()+1;   //当前题索引
                $('div[data-id=' + nQl.colMenuLayoutModuleId + ']').find('.al-voteDetail').hide();
                $('div[data-id=' + nQl.colMenuLayoutModuleId + ']').find('.al-questionBox').addClass('al-questionTop');
                if(isPage==1){
                    var judgeKey='';
                    $.each(selectedNum,function(u,ulv){
                        judgeKey+=$(ulv).data('required');
                    });
                    var c = "1"; // 要计算的字符
                    var regex = new RegExp(c, 'g'); // 用g整个字符串都匹配
                    var result = judgeKey.match(regex);
                    var count = !result ? 0 : result.length;
                    var selected=$(selectBox).find('.al-questionList.selected[data-required=1]').length;
                    var questionCountPage=$('div[data-id=' + nQl.colMenuLayoutModuleId + ']').find('.al-questionnairePageList').length;
                    if(selected>=count){
                        if(questionIndex<questionCountPage){
                            $('div[data-id=' + nQl.colMenuLayoutModuleId + ']').find('.al-questionnairePageList.active').removeClass('active').hide().next().show().addClass('active');
                            $('.sp_container [data-id=' + nQl.colMenuLayoutModuleId + ']').find('.al-prevBtn').show().siblings('.al-nextBtn').removeClass('center');
                            $('.sp_container [data-id=' + nQl.colMenuLayoutModuleId + ']').find('.al-nextBtnDefault').removeClass('center');
                            if(questionIndex==questionCountPage-1){
                                $('.sp_container [data-id=' + nQl.colMenuLayoutModuleId + ']').find('.al-nextBtnDefault').text("提交").siblings('.al-nextBtn').text("提交").addClass('submitted');
                            }
                            $(window).scrollTop(offsettop);
                        }else{
                            //多题提交数据
                            submitted=$('.sp_container [data-id='+nQl.colMenuLayoutModuleId+']').data('submitted')?$('.sp_container [data-id='+nQl.colMenuLayoutModuleId+']').data('submitted'):"";
                            if(nQl.questionData.customerStatusQuestionnaire>0||submitted==1){
                                var showTipsHtmlSub='<section class="questionnaire-m_alertTip"><p class="questionnaire-m_alertTipWord">您已填写过该问卷，请勿重复提交！</p></section>';
                                $('div[data-id=' + nQl.colMenuLayoutModuleId + ']').find('.al-questionnaireShowTips').html(showTipsHtmlSub).show().delay(3000).hide(0);
                            }else{
                                t.doSubmitted(nQl);
                            }
                        }
                    }else{
                        var tipElements=$('div[data-id=' + nQl.colMenuLayoutModuleId + ']').find('.al-questionnairePageList.active').children(),
                            tipIndex='';
                        $.each(tipElements,function(w,wlv){
                            if($(wlv).data('required')==1){
                                if($(wlv).hasClass('selected')){
                                }else{
                                    tipIndex=$(wlv).index();
                                    return false;
                                }
                            }
                        });
                        var tipElementItem=$(selectedNum)[tipIndex],        //未答题的第一道题元素
                            tipAddress=$($(selectedNum)[tipIndex]).offset().top-50;
                        var showTipsHtml=t.quNumCheck({
                            colMenuLayoutModuleId: nQl.colMenuLayoutModuleId,
                            columnId: nQl.columnId,
                            data: nQl.data,
                            questionData: nQl.questionData,
                            questionnaireType: nQl.questionnaireType,
                            isPage:nQl.questionData.isPage,
                            tipElementItem:tipElementItem   //未答题的第一道题元素
                        });
                        $('div[data-id=' + nQl.colMenuLayoutModuleId + ']').find('.al-questionnaireShowTips').html(showTipsHtml).show().delay(3000).hide(0);
                        $(tipElementItem).find('.al-questionNotAnswer').text("请作答").show();
                        $(window).scrollTop(tipAddress);
                    }
                }else{
                    if(questionIndex<questionCount){
                        $('div[data-id=' + nQl.colMenuLayoutModuleId + ']').find('.al-questionnairePageList.active').removeClass('active').hide().next().show().addClass('active');
                        $('.sp_container [data-id=' + nQl.colMenuLayoutModuleId + ']').find('.al-prevBtn').show().siblings('.al-nextBtn').removeClass('center');
                        $('.sp_container [data-id=' + nQl.colMenuLayoutModuleId + ']').find('.al-nextBtnDefault').removeClass('center');
                        var quesElement=$('div[data-id=' + nQl.colMenuLayoutModuleId + ']').find('.al-questionnairePageList.active').children(),
                            questionType=$(quesElement).data('type');
                        if(questionType==3){
                            $(quesElement).find('.al-questionnaireAreaP').on("keyup",function(){
                                if($(this).val().length>0){
                                    $(this).closest('.al-questionList.active').addClass('selected');
                                    $('div[data-id=' + nQl.colMenuLayoutModuleId + ']').find('.al-nextBtnDefault').hide().siblings('.al-nextBtn').show();
                                }else{
                                    $(this).closest('.al-questionList.active').removeClass('selected');
                                    $('div[data-id=' + nQl.colMenuLayoutModuleId + ']').find('.al-nextBtnDefault').show().siblings('.al-nextBtn').hide();
                                }
                            });
                        }
                        if($(quesElement).data('required')==1){
                               if($(quesElement).hasClass('selected')){
                                   $('div[data-id=' + nQl.colMenuLayoutModuleId + ']').find('.al-nextBtnDefault').hide().siblings('.al-nextBtn').show();
                               }else{
                                   $('div[data-id=' + nQl.colMenuLayoutModuleId + ']').find('.al-nextBtnDefault').show().siblings('.al-nextBtn').hide();
                               }
                        }else{
                            $('div[data-id=' + nQl.colMenuLayoutModuleId + ']').find('.al-nextBtnDefault').hide();
                        }
                        if(questionIndex==questionCount-1){
                            $('div[data-id=' + nQl.colMenuLayoutModuleId + ']').find('.al-nextBtnDefault').text("提交").siblings('.al-nextBtn').text("提交");
                        }
                        $(window).scrollTop(offsettop);

                    }else{
                        //提交数据
                        submitted=$('.sp_container [data-id='+nQl.colMenuLayoutModuleId+']').data('submitted')?$('.sp_container [data-id='+nQl.colMenuLayoutModuleId+']').data('submitted'):"";
                        if(nQl.questionData.customerStatusQuestionnaire>0||submitted==1){
                            var showTipsHtmlSub='<section class="questionnaire-m_alertTip"><p class="questionnaire-m_alertTipWord">您已填写过该问卷，请勿重复提交！</p></section>';
                            $('div[data-id=' + nQl.colMenuLayoutModuleId + ']').find('.al-questionnaireShowTips').html(showTipsHtmlSub).show().delay(3000).hide(0);
                        }else{
                            t.doSubmitted(nQl);
                        }
                    }
                }
            },
            doSubmitted:function(Suv){
                var t=this;
                var submitListCon=Suv.questionnaireType==1?$('.sp_container [data-id='+Suv.colMenuLayoutModuleId+']').find('.al-questionList.selected'):$('.sp_container [data-id='+Suv.colMenuLayoutModuleId+']').find('.al-questionList.selected'),
                    recommendListMap=[];
                $.each(submitListCon,function(L,mal){
                    var refId=$(mal).data('id'),  //题目ID
                        refType=$(mal).data('type'), //题目类型
                        refListItem='';  //选中的选项
                    switch (refType){
                        case 1:
                            var refCqomark=$(mal).find('.al-selectItemBack.checked').parent().data('mark');
                            refListItem={
                                questionId:refId,
                                questionType:refType,
                                optionMark:refCqomark
                            };
                            break;
                        case 2:
                            refCqomark=$(mal).find('.al-selectItemBack.checked').parent();
                            var refCqomarked='';
                            $.each(refCqomark,function(l,Mv){
                                refCqomarked+=$(Mv).data('mark')+",";
                            });
                            refListItem={
                                questionId:refId,
                                questionType:refType,
                                optionMark:refCqomarked.substring(0,refCqomarked.length-1)
                            };
                            break;
                        case 3:
                            var answerContent=$(mal).find('.al-questionnaireAreaP').val();
                            refListItem={
                                questionId:refId,
                                questionType:3,
                                answerContent:answerContent
                            };
                            break;
                    }
                    recommendListMap.push(refListItem);
                });
                if(Suv.questionnaireType==1){
                    t.questionAnswer({
                        questionnaireId:Suv.questionData.questionnaireId,       // 问卷ID
                        questionnaireType:Suv.questionnaireType,  //问卷类型 （1问卷 2投票）
                        recommendListMap:recommendListMap,
                        colMenuLayoutModuleId:Suv.colMenuLayoutModuleId,
                        isShareState:Suv.questionData.isShareState,            //是否分享
                        isPage:Suv.questionData.isPage,                    //是否分页
                        endContent:Suv.questionData.endContent,    //结束话术
                        shareContent:Suv.questionData.shareContent,          //分享内容
                        sharePicUrl:Suv.questionData.sharePicUrl,            //分享图片URL
                        share_title:Suv.questionData.share_title
                    })
                }else{
                    t.questionAnswer({
                        questionnaireId:Suv.voteData.questionnaireId,       // 问卷ID
                        questionnaireType:Suv.questionnaireType,  //问卷类型 （1问卷 2投票）
                        recommendListMap:recommendListMap,
                        colMenuLayoutModuleId:Suv.colMenuLayoutModuleId,
                        isShareState:Suv.voteData.isShareState,            //是否分享
                        isPage:Suv.voteData.isPage,                    //是否分页
                        endContent:Suv.voteData.endContent,    //结束话术
                        shareContent:Suv.voteData.shareContent,          //分享内容
                        sharePicUrl:Suv.voteData.sharePicUrl,            //分享图片URL
                        share_title:Suv.voteData.share_title
                    })
                }

            },
            questionAnswer:function(Rv){  //提交问卷数据
                var t=this;
                var reData={
                    customerId:$("#sesCustomerId").val()?$("#sesCustomerId").val():0,
                    questionnaireId:Rv.questionnaireId,
                    recommendListMap:JSON.stringify(Rv.recommendListMap)
                };
                var params={paramJson: $.toJSON(reData)};
                $.ajax({
                    url : "/call/col/question/answer/create/",
                    type : "POST",
                    data :  params,
                    async : false,
                    time : 5000,
                    success : function(data){
                        //comm.LightBox.hideloading();
                        //获取专题的调查问卷的问卷ID缓存
                        var idArr=JSON.parse(TempCache.getItem("themeQuestionnaireId"))||[];
                        if(idArr){
                            idArr.push(Rv.questionnaireId);
                        }
                        //重新给专题的调查问卷的问卷ID添加缓存 （作为下次在浏览器再填写调差问卷时不让填写的依据）
                        TempCache.setItem("themeQuestionnaireId",JSON.stringify(idArr));
                        t.doShareHtml(Rv);
                    },
                    error : function(){
                        // comm.LightBox.hideloading();
                    }
                });
            },
            selectStatus:function(Kv){  //选择事件（改变选择图标状态）
                var t=this,
                    colMenuLayoutModuleId=Kv.colMenuLayoutModuleId,
                    isPage=Kv.questionData.isPage;
                $('div[data-id='+colMenuLayoutModuleId+']').find('.al-selectItem').on("click",function(){
                    var outTime = $(this).parents('.resource_list').parent().attr('outTime');
                    var _usType = $(this).parents('.resource_list').attr('userType');
                    var customerStatusQuestionnaire = $(this).parents('.resource_list').attr('customerStatusQuestionnaire');
                    var isFirstClick = $(this).parents('.resource_list').attr('isFirstClick');
                    var qId = $(this).parents('.resource_list').attr('qId');//第一次点击的时候做判断，本地是否填过问卷
                    var hasAnswered = false;
                    var themeQuestionnaireId = TempCache.getItem('themeQuestionnaireId');
                    if(themeQuestionnaireId){
                        if(themeQuestionnaireId.indexOf(qId)>-1){   //本地有问卷id,则说明已填过
                            hasAnswered = true;
                        }
                    }
                    if(outTime){//如果时间不在问卷时间内，不做任何操作
                        return false;
                    }
                    if(!isFirstClick) {
                        if (_usType == 1 && $('#sesCustomerId').length == 0) {//未登录
                            user.login({
                                scene: 'login',
                                callback: function () {
                                    g_sps.jump(null,location.href);
                                }
                            });

                        } else if (_usType == 2 && !($('#sesAuth').val() == 2||$('#sesAuth').val()==7||$('#sesAuth').val()==8||$('#sesAuth').val()==9)) { //认证权限，未认证
                            user.login({
                                scene: 'auth',
                                callback: function () {
                                    g_sps.jump(null,location.href);
                                },
                                stay:true
                            });
                        } else {
                            $(this).parents('.resource_list').attr('isFirstClick',1);
                            if(customerStatusQuestionnaire>0||hasAnswered){
                                var showTipsHtmlSub='<section class="questionnaire-m_alertTip"><p class="questionnaire-m_alertTipWord">您已填写过该问卷，请勿重复提交！</p></section>';
                                $('div[data-id=' + colMenuLayoutModuleId + ']').find('.al-questionnaireShowTips').html(showTipsHtmlSub).show().delay(3000).hide(0);
                            }else{
                                var questionType=$(this).closest('.al-questionList').data('type'),
                                    questionRequire=$(this).closest('.al-questionList').data('required');
                                if(questionType==1){
                                    $(this).parent().parent().find(".al-selectItemBack").removeClass("checked");
                                    $(this).children(".al-selectItemBack").addClass("checked").closest('.al-questionList').addClass('selected');
                                    if(isPage==0){
                                        $('div[data-id=' + Kv.colMenuLayoutModuleId + ']').find('.al-nextBtnDefault').hide().siblings('.al-nextBtn').show();
                                    }
                                }
                                if(questionType==2){
                                    $(this).children(".al-selectItemBack").toggleClass("checked");
                                    var selectNum=$(this).closest('.al-questionList').find('.checked'),
                                        selectMin=$(this).closest('.al-questionList').data('min'),
                                        selectMax=$(this).closest('.al-questionList').data('max');
                                    if(questionRequire==1){
                                        if(selectMin>0&&selectMax>0){
                                            if(selectNum.length>=selectMin&&selectNum.length<=selectMax){
                                                $(this).closest('.al-questionList').addClass('selected');
                                                if(isPage==0){
                                                    $('div[data-id=' + Kv.colMenuLayoutModuleId + ']').find('.al-nextBtnDefault').hide().siblings('.al-nextBtn').show();
                                                }
                                            }else{
                                                $(this).closest('.al-questionList').removeClass('selected');
                                                if(isPage==0){
                                                    $('div[data-id=' + Kv.colMenuLayoutModuleId + ']').find('.al-nextBtnDefault').show().siblings('.al-nextBtn').hide();
                                                }
                                            }
                                        }
                                        if(selectMin>0&&selectMax==0){
                                            if(selectNum.length>=selectMin){
                                                $(this).closest('.al-questionList').addClass('selected');
                                                if(isPage==0){
                                                    $('div[data-id=' + Kv.colMenuLayoutModuleId + ']').find('.al-nextBtnDefault').hide().siblings('.al-nextBtn').show();
                                                }
                                            }else{
                                                $(this).closest('.al-questionList').removeClass('selected');
                                                if(isPage==0){
                                                    $('div[data-id=' + Kv.colMenuLayoutModuleId + ']').find('.al-nextBtnDefault').show().siblings('.al-nextBtn').hide();
                                                }
                                            }
                                        }
                                        if(selectMin==0&&selectMax>0){
                                            if(selectNum.length<=selectMax){
                                                $(this).closest('.al-questionList').addClass('selected');
                                                if(isPage==0){
                                                    $('div[data-id=' + Kv.colMenuLayoutModuleId + ']').find('.al-nextBtnDefault').hide().siblings('.al-nextBtn').show();
                                                }
                                            }else{
                                                $(this).closest('.al-questionList').removeClass('selected');
                                                if(isPage==0){
                                                    $('div[data-id=' + Kv.colMenuLayoutModuleId + ']').find('.al-nextBtnDefault').show().siblings('.al-nextBtn').hide();
                                                }
                                            }
                                        }
                                        if(selectMin==0&&selectMax==0){
                                            if(selectNum.length>0){
                                                $(this).closest('.al-questionList').addClass('selected');
                                            }else{
                                                $(this).closest('.al-questionList').removeClass('selected');
                                            }
                                        }
                                    }else{
                                        if(selectNum.length>0){
                                            $(this).closest('.al-questionList').addClass('selected');
                                        }else{
                                            $(this).closest('.al-questionList').removeClass('selected');
                                        }
                                    }
                                }
                            }
                        }
                    }else{
                        $(this).parents('.resource_list').attr('isFirstClick',1);
                        if(customerStatusQuestionnaire>0||hasAnswered){
                            var showTipsHtmlSub='<section class="questionnaire-m_alertTip"><p class="questionnaire-m_alertTipWord">您已填写过该问卷，请勿重复提交！</p></section>';
                            $('div[data-id=' + colMenuLayoutModuleId + ']').find('.al-questionnaireShowTips').html(showTipsHtmlSub).show().delay(3000).hide(0);
                        }else{
                            var questionType=$(this).closest('.al-questionList').data('type'),
                                questionRequire=$(this).closest('.al-questionList').data('required');
                            if(questionType==1){
                                $(this).parent().parent().find(".al-selectItemBack").removeClass("checked");
                                $(this).children(".al-selectItemBack").addClass("checked").closest('.al-questionList').addClass('selected');
                                if(isPage==0){
                                    $('div[data-id=' + Kv.colMenuLayoutModuleId + ']').find('.al-nextBtnDefault').hide().siblings('.al-nextBtn').show();
                                }
                            }
                            if(questionType==2){
                                $(this).children(".al-selectItemBack").toggleClass("checked");
                                var selectNum=$(this).closest('.al-questionList').find('.checked'),
                                    selectMin=$(this).closest('.al-questionList').data('min'),
                                    selectMax=$(this).closest('.al-questionList').data('max');
                                if(questionRequire==1){
                                    if(selectMin>0&&selectMax>0){
                                        if(selectNum.length>=selectMin&&selectNum.length<=selectMax){
                                            $(this).closest('.al-questionList').addClass('selected');
                                            if(isPage==0){
                                                $('div[data-id=' + Kv.colMenuLayoutModuleId + ']').find('.al-nextBtnDefault').hide().siblings('.al-nextBtn').show();
                                            }
                                        }else{
                                            $(this).closest('.al-questionList').removeClass('selected');
                                            if(isPage==0){
                                                $('div[data-id=' + Kv.colMenuLayoutModuleId + ']').find('.al-nextBtnDefault').show().siblings('.al-nextBtn').hide();
                                            }
                                        }
                                    }
                                    if(selectMin>0&&selectMax==0){
                                        if(selectNum.length>=selectMin){
                                            $(this).closest('.al-questionList').addClass('selected');
                                            if(isPage==0){
                                                $('div[data-id=' + Kv.colMenuLayoutModuleId + ']').find('.al-nextBtnDefault').hide().siblings('.al-nextBtn').show();
                                            }
                                        }else{
                                            $(this).closest('.al-questionList').removeClass('selected');
                                            if(isPage==0){
                                                $('div[data-id=' + Kv.colMenuLayoutModuleId + ']').find('.al-nextBtnDefault').show().siblings('.al-nextBtn').hide();
                                            }
                                        }
                                    }
                                    if(selectMin==0&&selectMax>0){
                                        if(selectNum.length<=selectMax){
                                            $(this).closest('.al-questionList').addClass('selected');
                                            if(isPage==0){
                                                $('div[data-id=' + Kv.colMenuLayoutModuleId + ']').find('.al-nextBtnDefault').hide().siblings('.al-nextBtn').show();
                                            }
                                        }else{
                                            $(this).closest('.al-questionList').removeClass('selected');
                                            if(isPage==0){
                                                $('div[data-id=' + Kv.colMenuLayoutModuleId + ']').find('.al-nextBtnDefault').show().siblings('.al-nextBtn').hide();
                                            }
                                        }
                                    }
                                    if(selectMin==0&&selectMax==0){
                                        if(selectNum.length>0){
                                            $(this).closest('.al-questionList').addClass('selected');
                                        }else{
                                            $(this).closest('.al-questionList').removeClass('selected');
                                        }
                                    }
                                }else{
                                    if(selectNum.length>0){
                                        $(this).closest('.al-questionList').addClass('selected');
                                    }else{
                                        $(this).closest('.al-questionList').removeClass('selected');
                                    }
                                }
                            }
                        }
                    }

                });
                var textArea= $('div[data-id='+Kv.colMenuLayoutModuleId+']').find('.al-questionnaireAreaP').closest('.al-questionList');
                for (var y=0;y<textArea.length;y++){
                    if($(textArea[y]).data('type')==3){
                        $(textArea[y]).find('.al-questionnaireAreaP').on("keyup",function(){
                            if($(this).val().length>0){
                                $(this).closest('.al-questionList').addClass('selected');
                                if(isPage==0){
                                    $('div[data-id=' + Kv.colMenuLayoutModuleId + ']').find('.al-nextBtnDefault').hide().siblings('.al-nextBtn').show();
                                }
                            }else{
                                $(this).closest('.al-questionList').removeClass('selected');
                                if(isPage==0){
                                    var checkElement=$('div[data-id=' + Kv.colMenuLayoutModuleId + ']').find('.al-questionnairePageList.active'),
                                        required=$(checkElement).find('.al-questionList').data('required');
                                    if(required==0){
                                    }else{
                                        $('div[data-id=' + Kv.colMenuLayoutModuleId + ']').find('.al-nextBtnDefault').show().siblings('.al-nextBtn').hide();
                                    }

                                }
                            }
                        });
                    }
                }
            },
            voteSelectStatus:function(vSs){
                var t=this;
                if(vSs.voteData.isShowResult==1){
                    $('.sp_container [data-id='+vSs.colMenuLayoutModuleId+']').find('.voted').css({"float":"none","margin":"0 auto"});
                    $('.sp_container [data-id='+vSs.colMenuLayoutModuleId+']').find('.al-voteDoing').css({"float":"none","margin":"0 auto"});
                }
                //选择题处理选项点击
                $('.sp_container [data-id='+vSs.colMenuLayoutModuleId+']').find('.al-selectItem').on("click",function(){
                    var dataType=$(this).closest('.al-questionList').data('type'),
                        dataRequired=$(this).closest('.al-questionList').data('require');
                    if(dataType==1){    //单选题
                        $(this).closest('.al-questionList').find('.al-selectItemBack').removeClass('checked');
                        $(this).find('.al-selectItemBack').addClass('checked').closest('.al-questionList').addClass('selected');
                    }else if(dataType==2){
                        $(this).find('.al-selectItemBack').toggleClass('checked');
                        var checkNumCount=$(this).closest('.al-questionList').find('.al-selectItemBack.checked'),
                            optionmin=$(this).closest('.al-questionList').data('min'),
                            optionmax=$(this).closest('.al-questionList').data('max');
                        if(checkNumCount.length>=optionmin&&checkNumCount.length<=optionmax){
                            $(this).closest('.al-questionList').addClass('selected');
                        }else{
                            $(this).closest('.al-questionList').removeClass('selected');
                        }
                    }
                });
                //点击投票按钮
                $('.sp_container [data-id='+vSs.colMenuLayoutModuleId+']').find('.al-voteDoing').hover(function(){
                    $(this).addClass('hover');
                },function(){
                    $(this).removeClass('hover');
                }).mousedown(function(){
                    $(this).addClass("next");
                }).mouseup(function(){
                    $(this).removeClass("next");
                    $(this).addClass("checked");
                    if($('.sp_container [data-id='+vSs.colMenuLayoutModuleId+']').find('.al-questionList').hasClass('selected')){
                        if(parseInt(vSs.voteData.userType)!==3){
                            if (parseInt(vSs.voteData.userType)==1){
                                var logType=privilegeSceneConst.eSceneTypeLogin;
                                if($('#sesCustomerId').val()){
                                    t.voteShared(vSs)
                                }else{
                                    user.login({
                                        callback: function () {
                                            t.voteShared(vSs);
                                        },
                                        scene: logType,
                                        onClose:function(){
                                        },
                                        onAuthCancel:function(){
                                            g_sps.jump(null,location.href);
                                        }
                                        //noAuthReload:true
                                    });
                                }

                            }else{
                                var logType=privilegeSceneConst.eSceneTypeAuth;
                                if($('#sesAuth').val()==2||$('#sesAuth').val()==7||$('#sesAuth').val()==8||$('#sesAuth').val()==9){
                                    t.voteShared(vSs);
                                }else{
                                    user.login({
                                        callback: function () {
                                            t.voteShared(vSs);
                                        },
                                        scene: logType,
                                        onClose:function(){
                                        },
                                        onAuthCancel:function(){
                                            g_sps.jump(null,location.href);
                                        },
                                        stay:true
                                        //noAuthReload:true
                                    });
                                }

                            }
                            //
                            //user.login({
                            //    callback: function () {
                            //        t.voteShared(vSs);
                            //    },
                            //    scene: logType,
                            //    onClose:function(){
                            //    },
                            //    onAuthCancel:'stay'
                            //    //noAuthReload:true
                            //});
                        }else{
                            t.voteShared(vSs);
                        }
                    }else{
                        var showTipsHtml=t.quNumCheck(vSs);
                        $('div[data-id=' + vSs.colMenuLayoutModuleId + ']').find('.al-voteShowTips').html(showTipsHtml).show().delay(3000).hide(0);
                    }

                }).removeClass('default');

                $('.sp_container [data-id='+vSs.colMenuLayoutModuleId+']').find('.al-voteViewR').hover(function(){
                    $(this).addClass('hover');
                },function(){
                    $(this).removeClass('hover');
                }).mousedown(function(){
                    $(this).addClass("next");
                }).mouseup(function(){
                    $(this).removeClass("next");
                    $(this).addClass("checked");
                    t.voteViewResult(vSs);

                }).removeClass('default');

            },
            voteShared:function(vSd){
                var t=this,
                    customerStatusQuestionnaire=vSd.voteData.customerStatusQuestionnaire;
                if(customerStatusQuestionnaire>0){
                    return false;
                }else{
                    t.doSubmitted(vSd);
                }
            },
            //问卷、投票多选题选项数量校验
            quNumCheck:function(mId){
                var quElement=mId.questionnaireType==1?mId.tipElementItem:$('.sp_container [data-id='+mId.colMenuLayoutModuleId+']'),
                    tipContentVote='',
                    showTipsHtml='';
                if(mId.questionnaireType==1){
                    var isPage=mId.isPage,
                        quType=$(quElement).data('type'),
                        optionMax=$(quElement).data('max'),
                        optionSelected =$(quElement).find('.questionnaire-l_contentMultiSelectCheck.checked').length,
                        quesTextTip=isPage==1?"必填题未全部作答,请先完成!":"必填题未全部作答,请先完成再提交!";
                    if(quType==2){
                        tipContentVote=optionSelected>optionMax?"此题最多可选"+optionMax+"项":quesTextTip;
                    }else{
                        tipContentVote=quesTextTip;
                    }
                }else{
                    var quType=$(quElement).find('.al-questionList').data('type'),
                        optionMax=$(quElement).find('.al-questionList').data('max'),
                        optionSelected =$(quElement).find('.questionnaire-l_contentMultiSelectCheck.checked').length,
                        quesTextTip="必填题未全部作答,请先完成再提交!";
                    tipContentVote=optionSelected>optionMax?"此题最多可选"+optionMax+"项":quesTextTip;
                }
                showTipsHtml+='<section class="questionnaire-m_alertTip"><p class="questionnaire-m_alertTipWord">'+tipContentVote+'</p></section>';
                return showTipsHtml;
            },
            voteViewResult:function(vvR){
                var t=this,
                    voteBase=vvR.voteData.colQuestionMapList.length>0?vvR.voteData.colQuestionMapList[0]:'';
                t.questionResult({
                    questionnaireId:vvR.voteData.questionnaireId,    //问卷Id
                    questionId:voteBase.questionId,   //题目ID
                    questionType:voteBase.questionType,  //题目类型
                    backResult:function(data){
                        if(data&&data.responseObject&&data.responseObject.responseData){
                            var voteResultData=data.responseObject.responseData;
                            var _voteResultHtml=t.doVoteResultHtml(voteResultData);
                            $('.sp_container [data-id='+vvR.colMenuLayoutModuleId+']').find('.al-questionnaireVoteResult').html(_voteResultHtml);
                            t.voteResultProcess({
                                colMenuLayoutModuleId:vvR.colMenuLayoutModuleId
                            });
                            $('.sp_container [data-id='+vvR.colMenuLayoutModuleId+']').find('.al-online_cover.voteResult').show();
                            $('body').addClass('al-questionnaireScroll').css("overflow","");
                            $($('.sp_container [data-id='+vvR.colMenuLayoutModuleId+']').find('.al-online_cover.voteResult')).find('.al-voteResultClose').on("click",function(){
                                $(this).closest('.al-online_cover.voteResult').hide();
                                $('body').removeClass('al-questionnaireScroll');
                            })
                        }
                    }
                });
            },
            voteResultProcess:function(vRPv){
                var voteElement=$('.sp_container [data-id='+vRPv.colMenuLayoutModuleId+']').find('.al-online_cover.voteResult'),
                    processWidth=$(voteElement).find('.al-online_ResultProcessB').width(),
                    backProcessContent=$(voteElement).find('.al-online_ResultProcessP');
                $.each(backProcessContent,function(u,bPc){
                    var backProcessData=$(bPc).data('process'), //百分数
                        backProcessWidth=Math.round(processWidth*((backProcessData.replace("%",""))/100));  //进度width
                    $(bPc).css("width",backProcessWidth);
                });
            },
            questionResult:function(Lrv){  //查看投票数据
                var reData={
                    questionId:Lrv.questionId,
                    customerId:TempCache.getItem('userId')?TempCache.getItem('userId'):0,
                    questionType:Lrv.questionType,
                    questionnaireId:Lrv.questionnaireId,
                    isShowPeople:''
                };
                var params={paramJson: $.toJSON(reData)};
                $.ajax({
                    url : "/call/col/question/answer/getCQASpecialCount/",
                    type : "POST",
                    data :  params,
                    async : false,
                    time : 5000,
                    success : function(data){
                        //comm.LightBox.hideloading();
                        Lrv.backResult(data);
                    },
                    error : function(){
                        // comm.LightBox.hideloading();
                    }
                });
            },
            //微信/空间/微博分享功能
            questionnaireShare: function(qnSv) {
                var themeId = $('#themeId').val(),// "1480647316221";
                    qSelement=$('div[data-id=' + qnSv+ ']').find('.al-shareBtn').parent().parent(),
                    shareTitle = $(qSelement).data('title'),
                    shareUrl = $(qSelement).data('picurl'),
                    shareContent = $(qSelement).data('content');
                module.share({
                    container:$(".al-shareBtn"),//存放分享组件的父级
                    type:3,//默认为1  1：社交分享  2：页面左下角全站分享,3.终端页面的固定分享,4.终端评论区分享，消息的评论我的，只分享到唯医朋友圈
                    url:window.location.href,//分享链接， 默认取当前页链接
                    hiddenEl:$('#shareLoc'),
                    h5Url:'',//微信分享生成二维码的链接
                    title:shareTitle,//分享标题
                    shareTrend:0,//0:不需要站内动态分享  1：需要站内动态分享
                    trendUrl:'',//分享到站内动态的接口
                    data:{},//分享到站内动态的接口参数
                    callback:function(){},//分享到站内动态成功后回调函数
                    pic:shareUrl,//分享图片
                    sinaTitle:shareTitle,//新浪分享标题
                    sinaSummary:shareContent,//新浪分享描述
                    qqTitle:shareTitle,//qq好友分享标题
                    qqSummary:shareContent,//qq好友分享描述
                    qqZoneTitle:shareTitle,//qq空间分享标题
                    qqZoneSummary:shareContent,//qq空间分享描述
                    shareQQSuc:function(){},//分享qq成功
                    shareQzoneSuc:function(){},//分享qzone成功
                    shareSinaSuc:function(){}//分享sina成功
                });
            },
            //查看大图

            quesViewBigImg:function(qVBi){
                $('div[data-id=' + qVBi.colMenuLayoutModuleId + ']').find('.al-quesViewBigItem').on("click",function(){
                    var quesThemId=qVBi.colMenuLayoutModuleId,
                        quesImgData=[],
                        index=$(this).index()+1,
                        quesImgItem=$(this).closest('.al-quesViewBigBox').find('.al-quesViewBigItem');
                    $.each(quesImgItem,function(i,val){
                        var time=$($(val).children("img")).data('time'),
                            imgBase={
                            "name": '',
                            "src": $($(val).children("img")).attr("src"),
                            "time": time.substring(0,time.length-2)
                        };
                        quesImgData.push(imgBase);
                    });
                    alViewBigImg.createHtml(quesImgData,index,quesThemId);
                    $('body').addClass('al-questionnaireScroll');
                });
            },
            //字符截取
            quesCutWord:function(str,len){
                var strlen= 0,s = "";
                for(var i = 0;i < str.length; i++) {
                    s = s + str.charAt(i);
                    if (str.charCodeAt(i) > 128) {
                        strlen = strlen + 2;
                        if(strlen >= len){
                            return s.substring(0,s.length);
                        }
                    } else {
                        strlen = strlen + 1;
                        if(strlen >= len){
                            return s.substring(0,s.length-2);
                        }
                    }
                }
                return s;
            }
        };
        questionnaire.init();
    }
};

