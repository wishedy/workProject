/**
 * 功能描述：
 * 使用方法:
 * 注意事件：
 * 引入来源：
 *     作用：
 *
 * Created by JuKun on 2016/11/22.
 */

var questionnaire={};
questionnaire.one={
    question_listLoad:function(Kv){
        var questionList={
            init:function(){
                var t=this;
                t.questionDataLoad(Kv);
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
            doQueResult:function(Lv){
                var t=this,
                    qData=Lv.questionData,
                    questionnaireId=qData.questionnaireId,    //问卷ID
                    title=comm.cutstr(qData.questionnaireTitle,60),   //问卷标题
                    cqStartTime=qData.cqStartTime?Date.parse((qData.cqStartTime).replace(/-/g,"/")):'',  //开始时间戳
                    cqStartTimeLocal = qData.cqStartTime?comm.date.date_word(qData.cqStartTime)+qData.cqStartTime.substring(11,13)+"时"+qData.cqStartTime.substring(14,16)+"分":"";
                    cqEndTime=qData.cqEndTime?Date.parse((qData.cqEndTime).replace(/-/g,"/")):'',    //结束时间戳
                    customerStatusQuestionnaire=qData.customerStatusQuestionnaire,  //大于0已填
                    userType=qData.userType,                  //(1-需登录、2-需认证、3-无限制)
                    isPage=qData.isPage,                      //是否分页
                    isShareState=qData.isShareState,          //是否分享活动页
                    endContent=qData.endContent,              //结束话术
                    shareContent=qData.shareContent,          //分享内容
                    sharePicUrl=qData.sharePicUrl,            //分享图片URL
                    share_title=qData.share_title,            //分享标题
                    summary=qData.questionnaireSummary?comm.getStrLen(qData.questionnaireSummary,110*2):"",    //简介内容
                    summaryAll=qData.questionnaireSummary?qData.questionnaireSummary:'',
                    pageNum=qData.pageNum,                    //每页题数量
                    totalCount=qData.colQuestionMapList.length,    //总题数量
                    colQuestionnaireAttachmentList=(qData.colQuestionnaireAttachmentList?qData.colQuestionnaireAttachmentList:''),   //简介图片集合
                    colQuestionMapList=qData.colQuestionMapList?qData.colQuestionMapList:'';     //题集
                var introHTML=t.AttachmentList(colQuestionnaireAttachmentList,summary,summaryAll,isPage,pageNum,questionnaireId),
                    questionListHtml=t.doQuestionList({colQuestionMapList:colQuestionMapList,isPage:isPage,pageNum:pageNum}),
                    doUpDownBtnHtml=t.doUpDownBtn({cqStartTime:cqStartTime,cqEndTime:cqEndTime,colMenuLayoutModuleId:Lv.colMenuLayoutModuleId,isaPage:isPage,totalCount:totalCount,pageNum:pageNum,cqStartTimeLocal:cqStartTimeLocal}),
                    questionListConHtml='';
                questionListConHtml+='<div>'+questionListHtml+'</div>';
                introHTML+=questionListConHtml+doUpDownBtnHtml;
                //组件名称
                $('div[data-id=' + Lv.colMenuLayoutModuleId + '] .total_title').children('span').text(title).css("display","inline");
                $('.sp_container [data-id='+Lv.colMenuLayoutModuleId+']').find('.questionnaire_list').append(introHTML);
                $('.sp_container [data-id='+Lv.colMenuLayoutModuleId+']').find('.al-questionnaireAboutOpen').on("click",function(){
                    $(this).parent().hide().siblings('.al-questionnaireAboutWord.showAll').show();
                });
                //样式修改
                if(summary.length==0||summary==''){
                    if(colQuestionnaireAttachmentList.length==0){
                        $('.sp_container [data-id='+Lv.colMenuLayoutModuleId+']').find('.al-questionnaireAbout').css("margin-bottom","0");
                    }
                }
                t.actioning({
                    questionnaireId:questionnaireId,  //问卷Id
                    questionnaireType:Lv.questionnaireType,
                    colMenuLayoutModuleId:Lv.colMenuLayoutModuleId,
                    userType:userType,   //用户权限类型
                    isPage:isPage,
                    pageNum:pageNum,
                    endContent:endContent,
                    questionCount:colQuestionMapList.length,
                    isShareState:isShareState,   //是否分享
                    cqStartTime:cqStartTime,
                    cqEndTime:cqEndTime,
                    customerStatusQuestionnaire:customerStatusQuestionnaire,  //用户状态 大于零已填写
                    shareContent:shareContent,          //分享内容
                    sharePicUrl:sharePicUrl,            //分享图片URL
                    share_title:share_title
                });
                t.viewBigImg(Lv);
            },
            AttachmentList:function(colQuestionnaireAttachmentList,summary,summaryAll,isPage,pageNum,questionnaireId){       //加载简介Dom
                var introHtml='',
                    introPicOne='',
                    introPicTwo='',
                    introPicThree='';
                if(colQuestionnaireAttachmentList.length>2){
                    introPicOne=colQuestionnaireAttachmentList[0].cqaQuestionnaireAttUr;
                    introPicTwo=colQuestionnaireAttachmentList[1].cqaQuestionnaireAttUr;
                    introPicThree=colQuestionnaireAttachmentList[2].cqaQuestionnaireAttUr;
                }else if(colQuestionnaireAttachmentList.length>1){
                    introPicOne=colQuestionnaireAttachmentList[0].cqaQuestionnaireAttUr;
                    introPicTwo=colQuestionnaireAttachmentList[1].cqaQuestionnaireAttUr;
                }else if(colQuestionnaireAttachmentList.length>0){
                    introPicOne=colQuestionnaireAttachmentList[0].cqaQuestionnaireAttUr;
                }
                if (colQuestionnaireAttachmentList.length>0) {
                    if (colQuestionnaireAttachmentList.length == 1) {  //简介1张图
                        introHtml += '<section class="al-questionnaireAbout" data-ispage="'+isPage+'" data-pagenum="'+pageNum+'" data-questionnaireid="'+questionnaireId+'">' +
                            '<p class="al-questionnaireAboutWord" style="display: '+ (summary.length>0?"block":"none")+'">' + summary + '<span class="al-questionnaireAboutOpen">'+(summaryAll.length>summary.length?"展开":"")+'</span></p>' +
                            '<p class="al-questionnaireAboutWord showAll">' + summaryAll + '</p>' +
                            '<figure class="al-questionnaireAboutPicBox al-quesViewBig"><span class="al-questionnaireAboutPicOne al-quesViewBigList">' +
                            '<img class="al-questionnaireAboutPicItem" src="' + introPicOne + '" alt=""><div class="al-questionnaireSelectViewBig"><p class="al-questionnaireSelectViewBigWord">查看大图</p>' +
                            '</div></span></figure></section>'
                    } else if (colQuestionnaireAttachmentList.length == 2) {                    //简介2张图
                        introHtml += '<section class="al-questionnaireAbout" data-ispage="'+isPage+'" data-pagenum="'+pageNum+'" data-questionnaireid="'+questionnaireId+'">' +
                            '<p class="al-questionnaireAboutWord" style="display: '+ (summary.length>0?"block":"none")+'">' + summary + '<span class="al-questionnaireAboutOpen">'+(summaryAll.length>summary.length?"展开":"")+'</span></p>' +
                            '<p class="al-questionnaireAboutWord showAll">' + summaryAll + '</p>' +
                            '<figure class="al-questionnaireAboutPicBox two al-quesViewBig"><span class="al-questionnaireAboutPicTwo al-quesViewBigList">' +
                            '<img class="al-questionnaireAboutPicItemTwo" src="' + introPicOne + '" alt=""><div class="al-questionnaireSelectViewBig"><p class="al-questionnaireSelectViewBigWord">查看大图</p></div></span>' +
                            '<span class="al-questionnaireAboutPicTwo al-quesViewBigList"><img class="al-questionnaireAboutPicItemTwo" src="' + introPicTwo + '" alt=""><div class="al-questionnaireSelectViewBig">' +
                            '<p class="al-questionnaireSelectViewBigWord">查看大图</p> </div></span></figure></section>'
                    } else {
                        introHtml += '<section class="al-questionnaireAbout" data-ispage="'+isPage+'" data-pagenum="'+pageNum+'" data-questionnaireid="'+questionnaireId+'">' +
                            '<p class="al-questionnaireAboutWord" style="display: '+ (summary.length>0?"block":"none")+'">' + summary + '<span class="al-questionnaireAboutOpen">'+(summaryAll.length>summary.length?"展开":"")+'</span></p>' +
                            '<p class="al-questionnaireAboutWord showAll">' + summaryAll + '</p>' +
                            '<figure class="al-questionnaireAboutPicBox three al-quesViewBig"><span class="al-questionnaireAboutPicThree al-quesViewBigList">' +
                            '<img class="al-questionnaireAboutPicItemTwo" src="' + introPicOne + '" alt=""><div class="al-questionnaireSelectViewBig"><p class="al-questionnaireSelectViewBigWord">查看大图</p></div></span>' +
                            '<span class="al-questionnaireAboutPicThree al-quesViewBigList"><img class="al-questionnaireAboutPicItemTwo" src="' + introPicTwo + '" alt=""><div class="al-questionnaireSelectViewBig">' +
                            '<p class="al-questionnaireSelectViewBigWord">查看大图</p></div></span><span class="al-questionnaireAboutPicThree al-quesViewBigList"><img class="al-questionnaireAboutPicItemTwo" src="' + introPicThree + '" alt="">' +
                            '<div class="al-questionnaireSelectViewBig"><p class="al-questionnaireSelectViewBigWord">查看大图</p></div></span></figure></section>'
                    }
                }else{
                    introHtml += '<section class="al-questionnaireAbout" data-ispage="'+isPage+'" data-pagenum="'+pageNum+'" data-questionnaireid="'+questionnaireId+'">' +
                        '<p class="al-questionnaireAboutWord" style="display: '+ (summary.length>0?"block":"none")+'">' + summary + '<span class="al-questionnaireAboutOpen">'+(summaryAll.length>summary.length?"展开":"")+'</span></p>' +
                        '<p class="al-questionnaireAboutWord showAll">' + summaryAll + '</p>' +
                        '</section>'
                }
                return introHtml;
            },
            doSelectOne:function(sOv){    //单选题
                var _html='',
                    _selHtml='',
                    _RhtmlOne='',
                    optionNum1="(必选)",
                    cQuestionAttList1='',
                    cQuestionAttList2='',
                    cQuestionAttList3='';
                if(sOv.cQuestionAttList.length>2){
                    cQuestionAttList1=sOv.cQuestionAttList[0].cquestionAttUrl;
                    cQuestionAttList2=sOv.cQuestionAttList[1].cquestionAttUrl;
                    cQuestionAttList3=sOv.cQuestionAttList[2].cquestionAttUrl;
                    _html+='<section class="al-questionnaireMain"><span class="al-questionnaireMainNum">'+sOv.numberK+'.</span>' +
                        '<div class="al-questionnaireMainStem">'+sOv.questionContent+'<span class="al-questionMultiTip">'+(sOv.questionIsRequiredStatus==1?optionNum1:"")+'</span>' +
                        '<span class="al-questionNotAnswer"></span></div> ' +
                        '<figure class="al-questionnaireAboutMultiplyThree al-quesViewBig"><span class="al-questionnaireAboutMultiplyThreePic al-quesViewBigList"> ' +
                        '<img class="al-questionnaireAboutMultiplyItem three" src="'+cQuestionAttList1+'" alt=""> ' +
                        '<div class="al-questionnaireSelectViewBig"><p class="al-questionnaireSelectViewBigWord">查看大图</p></div></span>' +
                        '<span class="al-questionnaireAboutMultiplyThreePic al-quesViewBigList">' +
                        '<img class="al-questionnaireAboutMultiplyItem three" src="'+cQuestionAttList2+'" alt=""> ' +
                        '<div class="al-questionnaireSelectViewBig"> <p class="al-questionnaireSelectViewBigWord">查看大图</p> </div> </span> ' +
                        '<span class="al-questionnaireAboutMultiplyThreePic al-quesViewBigList"> ' +
                        '<img class="al-questionnaireAboutMultiplyItem three" src="'+cQuestionAttList3+'" alt=""> ' +
                        '<div class="al-questionnaireSelectViewBig"><p class="al-questionnaireSelectViewBigWord">查看大图</p></div></span></figure></section>';

                }else if(sOv.cQuestionAttList.length>1){  //题目2图
                    cQuestionAttList1=sOv.cQuestionAttList[0].cquestionAttUrl;
                    cQuestionAttList2=sOv.cQuestionAttList[1].cquestionAttUrl;
                    _html+=' <section class="al-questionnaireMain"><span class="al-questionnaireMainNum">'+sOv.numberK+'.</span>' +
                        '<div class="al-questionnaireMainStem">'+sOv.questionContent+'<span class="al-questionMultiTip">'+(sOv.questionIsRequiredStatus==1?optionNum1:"")+'</span>' +
                        '<span class="al-questionNotAnswer"></span></div> ' +
                        '<figure class="al-questionnaireAboutMultiplyTwo al-quesViewBig"><span class="al-questionnaireAboutMultiplyTwoPic al-quesViewBigList">' +
                        '<img class="al-questionnaireAboutMultiplyItem two" src="'+cQuestionAttList1+'" alt="">' +
                        '<div class="al-questionnaireSelectViewBig"><p class="al-questionnaireSelectViewBigWord">查看大图</p></div></span>' +
                        '<span class="al-questionnaireAboutMultiplyTwoPic al-quesViewBigList">' +
                        '<img class="al-questionnaireAboutMultiplyItem two" src="'+cQuestionAttList2+'" alt="">' +
                        '<div class="al-questionnaireSelectViewBig"><p class="al-questionnaireSelectViewBigWord">查看大图</p></div></span></figure></section>';
                }else if(sOv.cQuestionAttList.length>0){  //题目1图
                    cQuestionAttList1=sOv.cQuestionAttList[0].cquestionAttUrl;
                    _html+='<section class="al-questionnaireMain"><span class="al-questionnaireMainNum">'+sOv.numberK+'.</span>' +
                        '<div class="al-questionnaireMainStem">'+sOv.questionContent+'<span class="al-questionMultiTip">'+(sOv.questionIsRequiredStatus==1?optionNum1:"")+'</span>' +
                        '<span class="al-questionNotAnswer"></span></div>' +
                        '<figure class="al-questionnaireAboutMultiply al-quesViewBig"><span class="al-questionnaireAboutMultiplyItemBox al-quesViewBigList">' +
                        '<img class="al-questionnaireAboutMultiplyItem" src="'+cQuestionAttList1+'" alt=""> ' +
                        '<div class="al-questionnaireSelectViewBig"><p class="al-questionnaireSelectViewBigWord">查看大图</p></div></span></figure></section>';
                }else{                                     //题目无图
                    _html+='<section class="al-questionnaireMain"><span class="al-questionnaireMainNum">'+sOv.numberK+'.</span>' +
                        '<div class="al-questionnaireMainStem">'+sOv.questionContent+'<span class="al-questionMultiTip">'+(sOv.questionIsRequiredStatus==1?optionNum1:"")+'</span>' +
                        '<span class="al-questionNotAnswer"></span></div></section>';
                }
                $.each(sOv.colQuestionOptionMapList,function(i,val){
                    var cqoContent=comm.cutstr(val.cqoContent,400),       //选项内容
                        cqoMark=val.cqoMark,               //选项标示（A、B、C、D）
                        cqoPicUrl=val.cqoPicUrl;           //选项图片地址
                    if(cqoPicUrl.length>0){
                        _selHtml+=' <section class="al-questionnaireSelectItem"><div class="al-questionnaireSelectPicBox al-quesViewBigList">' +
                            '<img class="al-questionnaireSelectPicDetail" src="'+cqoPicUrl+'" alt="">' +
                            '<div class="al-questionnaireSelectViewBig"><p class="al-questionnaireSelectViewBigWord">查看大图</p></div></div>' +
                            '<div class="al-questionnaireSelectBtnBox" data-cqomark="'+cqoMark+'"><span class="al-questionnaireSelectBtn"></span><div class="al-questionnaireSelectMain">' +
                            '<span class="al-questionnaireSelectMainNum">'+cqoMark+'.</span><span class="al-questionnaireSelectMainWord">'+(cqoContent.length>0?cqoContent:"选项")+'</span></div></div></section>'
                    }else{
                        _selHtml+=' <section class="al-questionnaireSelectItem"><div class="al-questionnaireSelectBtnBox noPic" data-cqomark="'+cqoMark+'">' +
                            '<span class="al-questionnaireSelectBtn"></span><div class="al-questionnaireSelectMain"><span class="al-questionnaireSelectMainNum">'+cqoMark+'.</span>' +
                            '<span class="al-questionnaireSelectMainWord">'+(cqoContent.length>0?cqoContent:"选项")+'</span></div></div></section>'
                    }
                });
                _html+=_selHtml;
                _RhtmlOne+='<div class="al-questionList" data-type="'+sOv.questionType+'" data-id="'+sOv.questionId+'" data-required="'+sOv.questionIsRequiredStatus+'" data-sort="'+sOv.numberK+'">'+_html+'</div>';
                return _RhtmlOne;
            },
            doSelectTwo:function(sTv){    //多选题
                var _htmlTwo='',
                    _selHtmlTwo='',
                    _RhtmlTwo='',
                    optionNum2="(必选,请选择"+(sTv.questionOptionMin)+"-"+(sTv.questionOptionMax)+"项)",
                    cQuestionAttList1='',
                    cQuestionAttList2='',
                    cQuestionAttList3='';
                if(sTv.cQuestionAttList>2){     //题干3图
                    cQuestionAttList1=sTv.cQuestionAttList[0].cquestionAttUrl;
                    cQuestionAttList2=sTv.cQuestionAttList[1].cquestionAttUrl;
                    cQuestionAttList3=sTv.cQuestionAttList[2].cquestionAttUrl;
                    _htmlTwo+='<section class="al-questionnaireMain multipleChoice"><span class="al-questionnaireMainNum">'+sTv.numberK+'.</span>' +
                        '<div class="al-questionnaireMainStem">'+sTv.questionContent+' <span class="al-questionMultiTip">'+(sTv.questionIsRequiredStatus==1?optionNum2:"")+'</span>' +
                        '<span class="al-questionNotAnswer"></span></div> ' +
                        '<figure class="al-questionnaireAboutMultiplyThree al-quesViewBig"><span class="al-questionnaireAboutMultiplyThreePic al-quesViewBigList">' +
                        '<img class="al-questionnaireAboutMultiplyItem three" src="'+cQuestionAttList1+'" alt="">' +
                        '<div class="al-questionnaireSelectViewBig"><p class="al-questionnaireSelectViewBigWord">查看大图</p></div></span>' +
                        '<span class="al-questionnaireAboutMultiplyThreePic al-quesViewBigList"><img class="al-questionnaireAboutMultiplyItem three" src="'+cQuestionAttList2+'" alt=""> ' +
                        '<div class="al-questionnaireSelectViewBig"><p class="al-questionnaireSelectViewBigWord">查看大图</p></div></span>' +
                        '<span class="al-questionnaireAboutMultiplyThreePic al-quesViewBigList"><img class="al-questionnaireAboutMultiplyItem three" src="'+cQuestionAttList3+'" alt=""> ' +
                        '<div class="al-questionnaireSelectViewBig"><p class="al-questionnaireSelectViewBigWord">查看大图</p></div></span></figure></section>'
                }else if(sTv.cQuestionAttList>1){    //题干2图
                    cQuestionAttList1=sTv.cQuestionAttList[0].cquestionAttUrl;
                    cQuestionAttList2=sTv.cQuestionAttList[1].cquestionAttUrl;
                    _htmlTwo+='<section class="al-questionnaireMain multipleChoice"><span class="al-questionnaireMainNum">'+sTv.numberK+'.</span>' +
                        '<div class="al-questionnaireMainStem">'+sTv.questionContent+' <span class="al-questionMultiTip">'+(sTv.questionIsRequiredStatus==1?optionNum2:"")+'</span>' +
                        '<span class="al-questionNotAnswer"></span></div> ' +
                        '<figure class="al-questionnaireAboutMultiplyTwo al-quesViewBig"><span class="al-questionnaireAboutMultiplyTwoPic al-quesViewBigList"><img class="al-questionnaireAboutMultiplyItem two" src="'+cQuestionAttList1+'" alt=""> ' +
                        '<div class="al-questionnaireSelectViewBig"><p class="al-questionnaireSelectViewBigWord">查看大图</p></div></span>' +
                        '<span class="al-questionnaireAboutMultiplyTwoPic al-quesViewBigList"><img class="al-questionnaireAboutMultiplyItem two" src="'+cQuestionAttList2+'" alt=""> ' +
                        '<div class="al-questionnaireSelectViewBig"><p class="al-questionnaireSelectViewBigWord">查看大图</p></div></span></figure></section>'
                } else if(sTv.cQuestionAttList>0){   //题干1图
                    cQuestionAttList1=sTv.cQuestionAttList[0].cquestionAttUrl;
                    _htmlTwo+='<section class="al-questionnaireMain multipleChoice"><span class="al-questionnaireMainNum">'+sTv.numberK+'.</span>' +
                        '<div class="al-questionnaireMainStem">'+sTv.questionContent+' <span class="al-questionMultiTip">'+(sTv.questionIsRequiredStatus==1?optionNum2:"")+'</span>' +
                        '<span class="al-questionNotAnswer"></span></div> ' +
                        '<figure class="al-questionnaireAboutMultiply al-quesViewBig"><span class="al-questionnaireAboutMultiplyItemBox al-quesViewBigList">' +
                        '<img class="al-questionnaireAboutMultiplyItem" src="'+cQuestionAttList1+'" alt="">' +
                        '<div class="al-questionnaireSelectViewBig"><p class="al-questionnaireSelectViewBigWord">查看大图</p></div></span></figure></section>'
                }else{          //题干无图
                    _htmlTwo+='<section class="al-questionnaireMain multipleChoice"><span class="al-questionnaireMainNum">'+sTv.numberK+'.</span>' +
                        '<div class="al-questionnaireMainStem">'+sTv.questionContent+' <span class="al-questionMultiTip">'+(sTv.questionIsRequiredStatus==1?optionNum2:"")+'</span>' +
                        '<span class="al-questionNotAnswer"></span></div></section>'
                }
                $.each(sTv.colQuestionOptionMapList,function(j,val){
                    var cqoContent=comm.cutstr(val.cqoContent,120),       //选项内容
                        cqoMark=val.cqoMark,               //选项标示（A、B、C、D）
                        cqoPicUrl=val.cqoPicUrl;           //选项图片地址
                    if(cqoPicUrl!==" "&&cqoPicUrl.length>0){ //选项有图
                        _selHtmlTwo += '<section class="al-questionnaireSelectItem"><div class="al-questionnaireSelectPicBox multipleChoice al-quesViewBigList">' +
                            '<img class="al-questionnaireSelectPicDetail" src="'+cqoPicUrl+'" alt="">' +
                            '<div class="al-questionnaireSelectViewBig"><p class="al-questionnaireSelectViewBigWord">查看大图</p></div></div>' +
                            '<div class="al-questionnaireSelectBtnBox multipleChoice" data-cqomark="'+cqoMark+'"><span class="al-questionnaireSelectBtn multipleChoice"></span>' +
                            '<div class="al-questionnaireSelectMain"><span class="al-questionnaireSelectMainNum">' + cqoMark + '.</span>' +
                            '<span class="al-questionnaireSelectMainWord">' + (cqoContent.length > 0 ? cqoContent : "选项") + '</span></div></div></section>'
                    }else {
                        _selHtmlTwo += '<section class="al-questionnaireSelectItem"><div class="al-questionnaireSelectBtnBox multipleChoice" data-cqomark="'+cqoMark+'">' +
                            '<span class="al-questionnaireSelectBtn multipleChoice" ></span><div class="al-questionnaireSelectMain">' +
                            '<span class="al-questionnaireSelectMainNum">' + cqoMark + '.</span>' +
                            '<span class="al-questionnaireSelectMainWord">' + (cqoContent.length > 0 ? cqoContent : "选项") + '</span> ' +
                            '</div></div></section>'
                    }
                });
                _htmlTwo+=_selHtmlTwo;
                _RhtmlTwo+='<div class="al-questionList" data-type="'+sTv.questionType+'" data-id="'+sTv.questionId+'" data-required="'+sTv.questionIsRequiredStatus+'" data-optionmin="'+sTv.questionOptionMin+'" data-optionmax="'+sTv.questionOptionMax+'" data-sort="'+sTv.numberK+'">'+_htmlTwo+'</div>';
                return _RhtmlTwo;
            },
            doSelectThree:function(sDv){    //填空题
                var _htmlThree='',
                    _RhtmlThree='',
                    optionNum3="(必填)",
                    cQuestionAttList1='',
                    cQuestionAttList2='',
                    cQuestionAttList3='';
                if(sDv.cQuestionAttList>2){     //题干3图
                    cQuestionAttList1=sDv.cQuestionAttList[0].cquestionAttUrl;
                    cQuestionAttList2=sDv.cQuestionAttList[1].cquestionAttUrl;
                    cQuestionAttList3=sDv.cQuestionAttList[2].cquestionAttUrl;
                    _htmlThree+='<section class="al-questionnaireMain multipleChoice"><span class="al-questionnaireMainNum">'+sDv.numberK+'.</span>' +
                        '<div class="al-questionnaireMainStem">'+sDv.questionContent+'<span class="al-questionMultiTip">'+(sDv.questionIsRequiredStatus==1?optionNum3:"")+'</span>' +
                        '<span class="al-questionNotAnswer"></span></div>' +
                        '<figure class="al-questionnaireAboutMultiplyThree al-quesViewBig"><span class="al-questionnaireAboutMultiplyThreePic al-quesViewBigList">' +
                        '<img class="al-questionnaireAboutMultiplyItem three" src="'+cQuestionAttList1+'" alt=""> ' +
                        '<div class="al-questionnaireSelectViewBig"><p class="al-questionnaireSelectViewBigWord">查看大图</p></div></span><span class="al-questionnaireAboutMultiplyThreePic al-quesViewBigList"> ' +
                        '<img class="al-questionnaireAboutMultiplyItem three" src="'+cQuestionAttList2+'" alt=""><div class="al-questionnaireSelectViewBig"> ' +
                        '<p class="al-questionnaireSelectViewBigWord">查看大图</p></div></span><span class="al-questionnaireAboutMultiplyThreePic al-quesViewBigList">' +
                        '<img class="al-questionnaireAboutMultiplyItem three" src="'+cQuestionAttList3+'" alt=""><div class="al-questionnaireSelectViewBig">' +
                        '<p class="al-questionnaireSelectViewBigWord">查看大图</p></div></span></figure></section>'
                }else if(sDv.cQuestionAttList>1){    //题干2图
                    cQuestionAttList1=sDv.cQuestionAttList[0].cquestionAttUrl;
                    cQuestionAttList2=sDv.cQuestionAttList[1].cquestionAttUrl;
                    _htmlThree+='<section class="al-questionnaireMain multipleChoice MoreQuestion"><span class="al-questionnaireMainNum">'+sDv.numberK+'.</span>' +
                        '<div class="al-questionnaireMainStem">'+sDv.questionContent+'<span class="al-questionMultiTip">'+(sDv.questionIsRequiredStatus==1?optionNum3:"")+'</span>' +
                        '<span class="al-questionNotAnswer"></span></div> ' +
                        '<figure class="al-questionnaireAboutMultiplyTwo al-quesViewBig"><span class="al-questionnaireAboutMultiplyTwoPic al-quesViewBigList">' +
                        '<img class="al-questionnaireAboutMultiplyItem two" src="'+cQuestionAttList1+'" alt="">' +
                        '<div class="al-questionnaireSelectViewBig"><p class="al-questionnaireSelectViewBigWord">查看大图</p></div></span>' +
                        '<span class="al-questionnaireAboutMultiplyTwoPic al-quesViewBigList">' +
                        '<img class="al-questionnaireAboutMultiplyItem two" src="'+cQuestionAttList2+'" alt="">' +
                        '<div class="al-questionnaireSelectViewBig"><p class="al-questionnaireSelectViewBigWord">查看大图</p></div></span></figure></section>'
                } else if(sDv.cQuestionAttList>0){   //题干1图
                    cQuestionAttList1=sDv.cQuestionAttList[0].cquestionAttUrl;
                    _htmlThree+='<section class="al-questionnaireMain multipleChoice MoreQuestion"><span class="al-questionnaireMainNum">'+sDv.numberK+'.</span>' +
                        '<div class="al-questionnaireMainStem">'+sDv.questionContent+'<span class="al-questionMultiTip">'+(sDv.questionIsRequiredStatus==1?optionNum3:"")+'</span>' +
                        '<span class="al-questionNotAnswer"></span></div> ' +
                        '<figure class="al-questionnaireAboutMultiply al-quesViewBig"><span class="al-questionnaireAboutMultiplyItemBox al-quesViewBigList">' +
                        '<img class="al-questionnaireAboutMultiplyItem" src="'+cQuestionAttList1+'" alt="">' +
                        '<div class="al-questionnaireSelectViewBig"><p class="al-questionnaireSelectViewBigWord">查看大图</p></div></span></figure></section>'
                }else{          //题干无图
                    _htmlThree+='<section class="al-questionnaireMain multipleChoice"><span class="al-questionnaireMainNum">'+sDv.numberK+'.</span>' +
                        '<div class="al-questionnaireMainStem">'+sDv.questionContent+'<span class="al-questionMultiTip">'+(sDv.questionIsRequiredStatus==1?optionNum3:"")+'</span>' +
                        '<span class="al-questionNotAnswer"></span></div></section>'
                }
                _htmlThree+='<section class="al-questionnaireTextAreaItem">' +
                    '<textarea class="al-questionnaireAreaM" name="" id="2333" cols="30" rows="10" placeholder="请输入内容"></textarea></section>';
                _RhtmlThree+='<div class="al-questionList" data-type="'+sDv.questionType+'" data-id="'+sDv.questionId+'" data-required="'+sDv.questionIsRequiredStatus+'" data-sort="'+sDv.numberK+'">'+_htmlThree+'</div>';
                return _RhtmlThree;
            },
            doUpDownBtn:function(Tmv){
                var upDownBtnHtml='',
                    pageNum=Tmv.pageNum,
                    totalCount=Tmv.totalCount,
                    upPage=Tmv.isaPage==1?"上一页":"上一题",
                    downPage=Tmv.isaPage==1?"下一页":"下一题";
                if(Tmv.isaPage==1){
                    downPage=totalCount<=pageNum?"提交":downPage;
                }else{
                    downPage=totalCount<=1?"提交":downPage;
                }
                var today=Date.parse(new Date());
                if((Tmv.cqStartTime&&Tmv.cqStartTime<today)&&(Tmv.cqEndTime&&today<Tmv.cqEndTime)){   //问卷在进行中 开始时间存在并小于当前时间、结束时间大于当前时间
                    upDownBtnHtml+='<section class="al-questionnaireUpDownBtnBox"><div class="al-questionnaireUpBtn">'+upPage+'</div>' +
                        '<div class="al-questionnaireDownBtn">'+downPage+'</div><div class="al-questionnaireDownBtnDisable hide">'+downPage+'</div></section>' +
                        '<section class="al-questionnaireVoteResult"></section><section class="al-questionnaireShowTips"></section>';
                }else if(Tmv.cqStartTime&&Tmv.cqStartTime>today){//开始时间存在并大于当前时间
                    upDownBtnHtml+='<section class="al-questionnaireUpDownBtnBox">' +
                        '<div class="al-questionnaireDownBtnDisable first">'+downPage+'</div><div class="al-questionnaireDownBtnDisable hide">'+downPage+'</div></section>' +
                        '<section class="al-questionnaireVoteResult"></section><section class="al-questionnaireShowTips"></section>';
                    $('.sp_container [data-id='+Tmv.colMenuLayoutModuleId+']').find('.total_title').append('<div class="al-questionnaireAboutWord" style="color: #F34B4B;margin-bottom:0;display:block;font-size:15px;">(问卷将于'+Tmv.cqStartTimeLocal.substring(5)+'开启，敬请期待！)</div>');
                    $('.sp_container [data-id='+Tmv.colMenuLayoutModuleId+']').attr('outTime',1);
                } else{ //结束时间小于当前时间
                    upDownBtnHtml+='<section class="al-questionnaireUpDownBtnBox">' +
                        '<div class="al-questionnaireDownBtnDisable first">'+downPage+'</div><div class="al-questionnaireDownBtnDisable hide">'+downPage+'</div></section>' +
                        '<section class="al-questionnaireVoteResult"></section><section class="al-questionnaireShowTips"></section>';
                    $('.sp_container [data-id='+Tmv.colMenuLayoutModuleId+']').find('.total_title').append('<i class="al-questionnaireAboutTitleTip">(很抱歉，此问卷已结束)</i>');
                    $('.sp_container [data-id='+Tmv.colMenuLayoutModuleId+']').attr('outTime',1);
                }
                return upDownBtnHtml;
            },
            doShareHtml:function(Sv){
                var t=this;
                var shareHtml='<div class="al-questionnaireContent"><section class="al-questionnaireSharedM"><p class="al-questionnaireSharedTitle">'+(Sv.endContent.length>0?(TempCache.getItem('trueName')?("尊敬的"+TempCache.getItem('trueName')+"，"+Sv.endContent):Sv.endContent):"感谢您的参与！")+'</p> ' +
                    '<div class="al-questionnaireSharedBtn" style="display: '+(Sv.isShareState==1?"block":"none")+'" data-sharetitle="'+Sv.share_title+'" data-sharepicurl="'+Sv.sharePicUrl+'" data-sharecontent="'+Sv.shareContent+'">分享</div></section></div>';
                $('.sp_container [data-id='+Sv.colMenuLayoutModuleId+']').find('.questionnaire_list').html(shareHtml).siblings('.total_title').hide();
                $('.sp_container [data-id='+Sv.colMenuLayoutModuleId+']').find('.questionnaire_list').attr("data-submitted","1");
                t.shareAction(Sv);
            },
            doShowTips:function(dSTv){
                var _showTipHtml='<section class="al-questionnaireModalMask"><section class="al-questionnaireConfirmModal"><article class="al-questionnaireModalContent"><article>' +
                    '<p>'+dSTv.tipContent+'</p></article></article></section></section>';
                $('.sp_container [data-id='+dSTv.colMenuLayoutModuleId+']').find('.al-questionnaireShowTips').html(_showTipHtml).show().delay(3000).hide(0);
            },
            doQuestionList:function(qLv){
                var t=this,
                    questionPage=[],
                    m=parseInt(qLv.pageNum),
                    html='';
                if(qLv.isPage==0){
                    $.each(qLv.colQuestionMapList,function(i,val){
                        var questionId=val.questionId,              //题目ID
                            questionType=parseInt(val.questionType),           //题目类型（1单选、2多选、3填空)
                            questionIsRequiredStatus=val.questionIsRequiredStatus,  //是否必填
                            cQuestionAttList=val.cQuestionAttList,   //题目图集
                            questionContent=comm.cutstr(val.questionContent,400),     //题目内容
                            colQuestionOptionMapList=val.colQuestionOptionMapList;   //题目选项集合
                        switch (questionType){
                            case 1:   //单题
                                html+=t.doSelectOne({
                                    questionId:questionId,
                                    questionType:questionType,
                                    questionIsRequiredStatus:questionIsRequiredStatus,
                                    cQuestionAttList:cQuestionAttList,
                                    questionContent:questionContent,
                                    colQuestionOptionMapList:colQuestionOptionMapList,
                                    numberK:i+1
                                });
                                break;
                            case 2:  //多题
                                html+=t.doSelectTwo({
                                    questionId:questionId,
                                    questionType:questionType,
                                    questionIsRequiredStatus:questionIsRequiredStatus,
                                    questionOptionMin:val.questionOptionMin,  //最少选项
                                    questionOptionMax:val.questionOptionMax,  //最多选项
                                    cQuestionAttList:cQuestionAttList,
                                    questionContent:questionContent,
                                    colQuestionOptionMapList:colQuestionOptionMapList,
                                    numberK:i+1
                                });
                                break;
                            case 3:   //简答题
                                html+=t.doSelectThree({
                                    questionId:questionId,
                                    questionType:questionType,
                                    questionIsRequiredStatus:questionIsRequiredStatus,
                                    cQuestionAttList:cQuestionAttList,
                                    questionContent:questionContent,
                                    colQuestionOptionMapList:colQuestionOptionMapList,
                                    numberK:i+1
                                });
                                break;

                        }
                    });
                }else{
                    for (var q= 0;q<qLv.colQuestionMapList.length;q+=m){
                        questionPage.push(qLv.colQuestionMapList.slice(q,q+m))
                    }
                    $.each(questionPage,function(d,plv){
                        var _html='';
                        $.each(plv,function(h,hlv){

                            var questionId=hlv.questionId,              //题目ID
                                questionOrder=hlv.questionOrder,        //题目序号
                                questionType=hlv.questionType,           //题目类型（1单选、2多选、3填空)
                                questionIsRequiredStatus=hlv.questionIsRequiredStatus,  //是否必填
                                cQuestionAttList=hlv.cQuestionAttList,   //题目图集
                                questionContent=comm.cutstr(hlv.questionContent,400),     //题目内容
                                colQuestionOptionMapList=hlv.colQuestionOptionMapList;   //题目选项集合
                            switch (parseInt(questionType)){
                                case 1:   //单题
                                    _html+=t.doSelectOne({
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
                    })
                }
                return html;
            },
            actioning:function(Ev){
                //单题(0)
                var t=this,
                    moment=Date.parse(new Date()),
                    currentQuestion=$('.sp_container [data-id='+Ev.colMenuLayoutModuleId+']').find('.al-questionList'),
                    userType=parseInt(Ev.userType);
                var offsettop=$('.sp_container [data-id='+Ev.colMenuLayoutModuleId+']').offset().top;
                if(Ev.isPage==0){
                    $(currentQuestion).hide();
                    $(currentQuestion[0]).show().addClass("active");
                    $('.sp_container [data-id='+Ev.colMenuLayoutModuleId+']').find('.al-questionnaireUpBtnDisable').hide();
                    $('.sp_container [data-id='+Ev.colMenuLayoutModuleId+']').find('.al-questionnaireUpBtn').hide().siblings('.al-questionnaireDownBtn').addClass('first');
                    $('.sp_container [data-id='+Ev.colMenuLayoutModuleId+']').find('.al-questionList').addClass('noPage');
                    var questionChecked=$('.sp_container [data-id='+Ev.colMenuLayoutModuleId+']').find('.al-questionList.active');
                    if(Ev.questionCount==1){
                        $('.sp_container [data-id='+Ev.colMenuLayoutModuleId+']').find('.al-questionnaireDownBtn').addClass('submitted').text("提交").siblings('.al-questionnaireDownBtnDisable.hide').text("提交");
                    }
                    if($(questionChecked).data('required')==1){
                        $('.sp_container [data-id='+Ev.colMenuLayoutModuleId+']').find('.al-questionnaireDownBtn').hide().siblings('.al-questionnaireDownBtnDisable.hide').addClass('first').show();
                    }
                    //点击下一题
                    $('.sp_container [data-id='+Ev.colMenuLayoutModuleId+']').find('.al-questionnaireDownBtn').on("click",function(){
                        if(parseInt(Ev.userType)!==3){
                            appjs.joinInAuthority($.toJSON({"authority":userType}));
                            if(appjs.hasAuthority()==true){
                                $('.sp_container [data-id='+Ev.colMenuLayoutModuleId+']').find('.al-questionnaireAbout').hide();
                                var elementItem=$('.sp_container [data-id='+Ev.colMenuLayoutModuleId+']').find('.al-questionList.active'),
                                    dataType=$(elementItem).data('type'),
                                    dataRequired=$(elementItem).data('required'),  //是否必填(0 非必填 1 必填)
                                    questionIndex=$(elementItem).index()+1;   //当前题索引
                                if(Ev.questionCount>1){
                                    $('.sp_container [data-id='+Ev.colMenuLayoutModuleId+']').find('.al-questionnaireDownBtn').removeClass('first').siblings('.al-questionnaireDownBtnDisable.hide').removeClass('first');
                                }
                                if(questionIndex!==Ev.questionCount-1){
                                    $(window).scrollTop(offsettop);
                                }
                                if(questionIndex<Ev.questionCount){
                                    $('.sp_container [data-id='+Ev.colMenuLayoutModuleId+']').find('.al-questionnaireUpBtn').show();
                                    $('.sp_container [data-id='+Ev.colMenuLayoutModuleId+']').find('.al-questionList.active').removeClass('active').hide().next().show().addClass('active'); //加载下一题
                                    var questionCheckeds=$('.sp_container [data-id='+Ev.colMenuLayoutModuleId+']').find('.al-questionList.active');
                                    if($(questionCheckeds).data('required')==1){
                                        var checkNumCount=$(questionCheckeds).find('.al-questionnaireSelectBtn.checked'),
                                            optionmin=$(questionCheckeds).data('optionmin'),
                                            optionmax=$(questionCheckeds).data('optionmax'),
                                            dataTypes=$(questionCheckeds).data('type');
                                        if(dataTypes==2){
                                            if(checkNumCount.length!=0&&checkNumCount.length>=optionmin&&checkNumCount.length<=optionmax){
                                                $('.sp_container [data-id='+Ev.colMenuLayoutModuleId+']').find('.al-questionnaireDownBtn').show().siblings('.al-questionnaireDownBtnDisable.hide').hide();  //可以点击下一题
                                                if(questionIndex==Ev.questionCount-1){
                                                    $('.sp_container [data-id='+Ev.colMenuLayoutModuleId+']').find('.al-questionnaireDownBtn').text("提交").addClass('submitted').siblings('.al-questionnaireDownBtnDisable.hide').text("提交");
                                                }
                                            }else{
                                                if (questionIndex==Ev.questionCount-1){
                                                    $('.sp_container [data-id='+Ev.colMenuLayoutModuleId+']').find('.al-questionnaireDownBtn').text("提交").addClass('submitted').hide().siblings('.al-questionnaireDownBtnDisable.hide').text("提交").show();
                                                }else{
                                                    $('.sp_container [data-id='+Ev.colMenuLayoutModuleId+']').find('.al-questionnaireDownBtn').hide().siblings('.al-questionnaireDownBtnDisable.hide').show();
                                                }
                                            }
                                        } else if(dataTypes==1){
                                            if(checkNumCount.length==1){
                                                $('.sp_container [data-id='+Ev.colMenuLayoutModuleId+']').find('.al-questionnaireDownBtn').show().siblings('.al-questionnaireDownBtnDisable.hide').hide();
                                                if(questionIndex==Ev.questionCount-1){
                                                    $('.sp_container [data-id='+Ev.colMenuLayoutModuleId+']').find('.al-questionnaireDownBtn').text("提交").addClass('submitted').siblings('.al-questionnaireDownBtnDisable.hide').text("提交");
                                                }
                                            }else{
                                                if(questionIndex==Ev.questionCount-1){
                                                    $('.sp_container [data-id='+Ev.colMenuLayoutModuleId+']').find('.al-questionnaireDownBtn').text("提交").addClass('submitted').hide().siblings('.al-questionnaireDownBtnDisable.hide').text("提交").show();
                                                }else {
                                                    $('.sp_container [data-id='+Ev.colMenuLayoutModuleId+']').find('.al-questionnaireDownBtn').hide().siblings('.al-questionnaireDownBtnDisable.hide').show();
                                                }
                                            }
                                        }else {
                                            if($(questionCheckeds).find('.al-questionnaireAreaM').val().length>0){
                                                $('.sp_container [data-id='+Ev.colMenuLayoutModuleId+']').find('.al-questionnaireDownBtn').show().siblings('.al-questionnaireDownBtnDisable.hide').hide();
                                                if(questionIndex==Ev.questionCount-1){
                                                    $('.sp_container [data-id='+Ev.colMenuLayoutModuleId+']').find('.al-questionnaireDownBtn').text("提交").addClass('submitted').siblings('.al-questionnaireDownBtnDisable.hide').text("提交");
                                                }
                                            }else{
                                                if(questionIndex==Ev.questionCount-1){
                                                    $('.sp_container [data-id='+Ev.colMenuLayoutModuleId+']').find('.al-questionnaireDownBtn').text("提交").addClass('submitted').siblings('.al-questionnaireDownBtnDisable.hide').text("提交");
                                                }
                                                $('.sp_container [data-id='+Ev.colMenuLayoutModuleId+']').find('.al-questionnaireDownBtn').hide().siblings('.al-questionnaireDownBtnDisable.hide').show();
                                                var textareas=$('.sp_container [data-id='+Ev.colMenuLayoutModuleId+']').find('.al-questionList.active');
                                                $(textareas).find('.al-questionnaireAreaM').bind("keyup change input cut paste",function(){
                                                    if($(this).val().length>0){
                                                        $(this).closest('.al-questionList.active').addClass('selected');
                                                        $('.sp_container [data-id='+Ev.colMenuLayoutModuleId+']').find('.al-questionnaireDownBtn').show().siblings('.al-questionnaireDownBtnDisable.hide').hide();
                                                    }else{
                                                        $(this).closest('.al-questionList.active').removeClass('selected');
                                                        $('.sp_container [data-id='+Ev.colMenuLayoutModuleId+']').find('.al-questionnaireDownBtn').hide().siblings('.al-questionnaireDownBtnDisable.hide').show();
                                                    }
                                                });
                                            }
                                        }
                                    }else{
                                        //填空题作答判断(非必填题）
                                        var textareass=$('.sp_container [data-id='+Ev.colMenuLayoutModuleId+']').find('.al-questionList.active');
                                        $(textareass).find('.al-questionnaireAreaM').bind("keyup change input cut paste",function(){
                                            if($(this).val().length>0){
                                                $(this).closest('.al-questionList.active').addClass('selected');
                                            }else{
                                                $(this).closest('.al-questionList.active').removeClass('selected');
                                            }
                                        });
                                        if (questionIndex==Ev.questionCount-1){
                                            $('.sp_container [data-id='+Ev.colMenuLayoutModuleId+']').find('.al-questionnaireDownBtn').text("提交").addClass('submitted').siblings('.al-questionnaireDownBtnDisable.hide').text("提交");
                                        }else{
                                            $('.sp_container [data-id='+Ev.colMenuLayoutModuleId+']').find('.al-questionnaireDownBtn').show().siblings('.al-questionnaireDownBtnDisable.hide').hide();
                                        }

                                    }
                                }else {
                                    //处理最后提交
                                    if(Ev.customerStatusQuestionnaire>0){
                                        var tipContent="您已填写过该问卷，请勿重复提交！";
                                        t.doShowTips({tipContent:tipContent,colMenuLayoutModuleId:Ev.colMenuLayoutModuleId});
                                    }else{
                                        t.doSubmitted(Ev);
                                    }
                                }
                            }
                        }else{
                            //无用户权限限制情况下
                            $('.sp_container [data-id='+Ev.colMenuLayoutModuleId+']').find('.al-questionnaireAbout').hide();
                            var elementItem=$('.sp_container [data-id='+Ev.colMenuLayoutModuleId+']').find('.al-questionList.active'),
                                dataType=$(elementItem).data('type'),
                                dataRequired=$(elementItem).data('required'),  //是否必填(0 非必填 1 必填)
                                questionIndex=$(elementItem).index()+1;   //当前题索引
                            if(Ev.questionCount>1){
                                $('.sp_container [data-id='+Ev.colMenuLayoutModuleId+']').find('.al-questionnaireDownBtn').removeClass('first').siblings('.al-questionnaireDownBtnDisable.hide').removeClass('first');
                            }
                            if(questionIndex!=Ev.questionCount){
                                $(window).scrollTop(offsettop);
                            }
                            if(questionIndex<Ev.questionCount){
                                $('.sp_container [data-id='+Ev.colMenuLayoutModuleId+']').find('.al-questionnaireUpBtn').show();
                                $('.sp_container [data-id='+Ev.colMenuLayoutModuleId+']').find('.al-questionList.active').removeClass('active').hide().next().show().addClass('active'); //加载下一题
                                var questionCheckeds=$('.sp_container [data-id='+Ev.colMenuLayoutModuleId+']').find('.al-questionList.active');
                                if($(questionCheckeds).data('required')==1){
                                    var checkNumCount=$(questionCheckeds).find('.al-questionnaireSelectBtn.checked'),
                                        optionmin=$(questionCheckeds).data('optionmin'),
                                        optionmax=$(questionCheckeds).data('optionmax'),
                                        dataTypes=$(questionCheckeds).data('type');
                                    if(dataTypes==2){
                                        if(checkNumCount.length!=0&&checkNumCount.length>=optionmin&&checkNumCount.length<=optionmax){
                                            $('.sp_container [data-id='+Ev.colMenuLayoutModuleId+']').find('.al-questionnaireDownBtn').show().siblings('.al-questionnaireDownBtnDisable.hide').hide();  //可以点击下一题
                                            if(questionIndex==Ev.questionCount-1){
                                                $('.sp_container [data-id='+Ev.colMenuLayoutModuleId+']').find('.al-questionnaireDownBtn').text("提交").addClass('submitted').siblings('.al-questionnaireDownBtnDisable.hide').text("提交");
                                            }
                                        }else{
                                            if (questionIndex==Ev.questionCount-1){
                                                $('.sp_container [data-id='+Ev.colMenuLayoutModuleId+']').find('.al-questionnaireDownBtn').text("提交").addClass('submitted').hide().siblings('.al-questionnaireDownBtnDisable.hide').text("提交").show();
                                            }else{
                                                $('.sp_container [data-id='+Ev.colMenuLayoutModuleId+']').find('.al-questionnaireDownBtn').hide().siblings('.al-questionnaireDownBtnDisable.hide').show();
                                            }
                                        }
                                    } else if(dataTypes==1){
                                        if(checkNumCount.length==1){
                                            $('.sp_container [data-id='+Ev.colMenuLayoutModuleId+']').find('.al-questionnaireDownBtn').show().siblings('.al-questionnaireDownBtnDisable.hide').hide();
                                            if(questionIndex==Ev.questionCount-1){
                                                $('.sp_container [data-id='+Ev.colMenuLayoutModuleId+']').find('.al-questionnaireDownBtn').text("提交").addClass('submitted').siblings('.al-questionnaireDownBtnDisable.hide').text("提交");
                                            }
                                        }else{
                                            if(questionIndex==Ev.questionCount-1){
                                                $('.sp_container [data-id='+Ev.colMenuLayoutModuleId+']').find('.al-questionnaireDownBtn').text("提交").addClass('submitted').hide().siblings('.al-questionnaireDownBtnDisable.hide').text("提交").show();
                                            }else {
                                                $('.sp_container [data-id='+Ev.colMenuLayoutModuleId+']').find('.al-questionnaireDownBtn').hide().siblings('.al-questionnaireDownBtnDisable.hide').show();
                                            }
                                        }
                                    }else {
                                        if($(questionCheckeds).find('.al-questionnaireAreaM').val().length>0){
                                            $('.sp_container [data-id='+Ev.colMenuLayoutModuleId+']').find('.al-questionnaireDownBtn').show().siblings('.al-questionnaireDownBtnDisable.hide').hide();
                                            if(questionIndex==Ev.questionCount-1){
                                                $('.sp_container [data-id='+Ev.colMenuLayoutModuleId+']').find('.al-questionnaireDownBtn').text("提交").addClass('submitted').siblings('.al-questionnaireDownBtnDisable.hide').text("提交");
                                            }
                                        }else{
                                            if(questionIndex==Ev.questionCount-1){
                                                $('.sp_container [data-id='+Ev.colMenuLayoutModuleId+']').find('.al-questionnaireDownBtn').text("提交").addClass('submitted').siblings('.al-questionnaireDownBtnDisable.hide').text("提交");
                                            }
                                            $('.sp_container [data-id='+Ev.colMenuLayoutModuleId+']').find('.al-questionnaireDownBtn').hide().siblings('.al-questionnaireDownBtnDisable.hide').show();
                                            var textareas=$('.sp_container [data-id='+Ev.colMenuLayoutModuleId+']').find('.al-questionList.active');
                                            $(textareas).find('.al-questionnaireAreaM').bind("keyup change input cut paste",function(){
                                                if($(this).val().length>0){
                                                    $(this).closest('.al-questionList.active').addClass('selected');
                                                    $('.sp_container [data-id='+Ev.colMenuLayoutModuleId+']').find('.al-questionnaireDownBtn').show().siblings('.al-questionnaireDownBtnDisable.hide').hide();
                                                }else{
                                                    $(this).closest('.al-questionList.active').removeClass('selected');
                                                    $('.sp_container [data-id='+Ev.colMenuLayoutModuleId+']').find('.al-questionnaireDownBtn').hide().siblings('.al-questionnaireDownBtnDisable.hide').show();
                                                }
                                            });
                                        }
                                    }
                                }else{
                                    //填空题作答判断
                                    var textareass=$('.sp_container [data-id='+Ev.colMenuLayoutModuleId+']').find('.al-questionList.active');
                                    $(textareass).find('.al-questionnaireAreaM').bind("keyup change input cut paste",function(){
                                        if($(this).val().length>0){
                                            $(this).closest('.al-questionList.active').addClass('selected');
                                        }else{
                                            $(this).closest('.al-questionList.active').removeClass('selected');
                                        }
                                    });
                                    if(questionIndex==Ev.questionCount-1){
                                        $('.sp_container [data-id='+Ev.colMenuLayoutModuleId+']').find('.al-questionnaireDownBtn').text("提交").addClass('submitted').siblings('.al-questionnaireDownBtnDisable.hide').text("提交");
                                    }else{
                                        $('.sp_container [data-id='+Ev.colMenuLayoutModuleId+']').find('.al-questionnaireDownBtn').show().siblings('.al-questionnaireDownBtnDisable.hide').hide();
                                    }
                                }
                            }else {
                                //处理最后提交
                                if(Ev.customerStatusQuestionnaire>0){
                                    var tipContent="您已填写过该问卷，请勿重复提交！";
                                    t.doShowTips({tipContent:tipContent,colMenuLayoutModuleId:Ev.colMenuLayoutModuleId});
                                }else{
                                    t.doSubmitted(Ev);
                                }
                            }
                        }
                    });
                    //点击上一题
                    $('.sp_container [data-id='+Ev.colMenuLayoutModuleId+']').find('.al-questionnaireUpBtn').on("click",function(){
                        $('.sp_container [data-id='+Ev.colMenuLayoutModuleId+']').find('.al-questionnaireDownBtn').show().siblings('.al-questionnaireDownBtnDisable.hide').hide();
                        var questionIndexs=$('.sp_container [data-id='+Ev.colMenuLayoutModuleId+']').find('.al-questionList.active').index()+1; //当前题索引
                        if(questionIndexs==2){
                            $('.al-questionnaireAbout').show();
                            $(this).hide().siblings('.al-questionnaireDownBtn').addClass('first').text("下一题").removeClass('submitted').siblings('.al-questionnaireDownBtnDisable.hide').addClass('first').text("下一题");
                            $('.sp_container [data-id='+Ev.colMenuLayoutModuleId+']').find('.al-questionList.active').removeClass('active').hide().prev().show().addClass('active');
                        }else if (questionIndexs<=Ev.questionCount){
                            $('.sp_container [data-id='+Ev.colMenuLayoutModuleId+']').find('.al-questionnaireDownBtn').text("下一题").show().removeClass('submitted').siblings('.al-questionnaireDownBtnDisable').text("下一题").hide();
                            $('.sp_container [data-id='+Ev.colMenuLayoutModuleId+']').find('.al-questionList.active').removeClass('active').hide().prev().show().addClass('active');
                        }
                    });
                    //选择题处理选项点击
                    $('.sp_container [data-id='+Ev.colMenuLayoutModuleId+']').attr({userType:Ev.userType,customerStatusQuestionnaire:Ev.customerStatusQuestionnaire,qId:Ev.questionnaireId});
                    $('.sp_container [data-id='+Ev.colMenuLayoutModuleId+']').find('.al-questionnaireSelectBtnBox').on("click",function(){
                        var outTime = $(this).parents('.isComp').attr('outTime');
                        var _usType = $(this).parents('.isComp').attr('userType');
                        var maxOpt = $(this).parents('.al-questionList').attr('data-optionmax')?parseInt($(this).parents('.al-questionList').attr('data-optionmax')):0; //最多选项
                        var checkedNum = $(this).parents('.al-questionList').find('.checked').length;   //已选项

                        var customerStatusQuestionnaire = $(this).parents('.isComp').attr('customerStatusQuestionnaire');
                        var dataType=$(this).closest('.al-questionList').data('type'),
                            dataRequired=$(this).closest('.al-questionList').data('required');
                        var qId = $(this).parents('.isComp').attr('qId');//问卷id
                        var hasAnsweredThis = false;    //已答过该问卷
                        if(typeof TempCache.getItem('qId')=='string'){  //本地已答问卷缓存非空
                            if(TempCache.getItem('qId').indexOf(qId)>-1){
                                hasAnsweredThis = true;
                            }
                        }
                        if(outTime){    //不在问卷时间范围内
                            return false;
                        }
                        if(maxOpt&&checkedNum>=maxOpt&&$(this).find('.checked').length==0){//最多选项
                            var tipContent="此题最多可选"+maxOpt+"项";
                            t.doShowTips({tipContent:tipContent,colMenuLayoutModuleId:Ev.colMenuLayoutModuleId});
                            return false;
                        }
                            if(_usType!=3) {
                                appjs.joinInAuthority($.toJSON({"authority":_usType}));
                                if(appjs.hasAuthority()==true){
                                    $(this).parents('.isComp').find('.total_title span').html('已登录');
                                    if (customerStatusQuestionnaire > 0||hasAnsweredThis) {
                                        var tipContent = "您已填写过该问卷，请勿重复提交！";
                                        t.doShowTips({
                                            tipContent: tipContent,
                                            colMenuLayoutModuleId: Ev.colMenuLayoutModuleId
                                        });
                                    }else {
                                        if (dataType == 1) {    //单选题
                                            $(this).closest('.al-questionList').find('.al-questionnaireSelectBtn').removeClass('checked');
                                            $(this).find('.al-questionnaireSelectBtn').addClass('checked').closest('.al-questionList.active').addClass('selected');
                                            if (dataRequired == 1) {
                                                $('.sp_container [data-id=' + Ev.colMenuLayoutModuleId + ']').find('.al-questionnaireDownBtn').show().siblings('.al-questionnaireDownBtnDisable.hide').hide();
                                            }
                                        } else if (dataType == 2) {
                                            $(this).find('.al-questionnaireSelectBtn').toggleClass('checked');
                                            var checkNumCount = $(this).closest('.al-questionList').find('.al-questionnaireSelectBtn.checked'),
                                                optionmin = $(this).closest('.al-questionList').data('optionmin'),
                                                optionmax = $(this).closest('.al-questionList').data('optionmax');
                                            if (dataRequired == 1) {
                                                if (checkNumCount.length >= optionmin && checkNumCount.length <= optionmax) {
                                                    $('.sp_container [data-id=' + Ev.colMenuLayoutModuleId + ']').find('.al-questionnaireDownBtn').show().siblings('.al-questionnaireDownBtnDisable.hide').hide();  //可以点击下一题
                                                    $(this).closest('.al-questionList.active').addClass('selected');
                                                } else {
                                                    $('.sp_container [data-id=' + Ev.colMenuLayoutModuleId + ']').find('.al-questionnaireDownBtn').hide().siblings('.al-questionnaireDownBtnDisable.hide').show();
                                                    $(this).closest('.al-questionList.active').removeClass('selected');
                                                }
                                            } else {
                                                if (checkNumCount.length > 0) {
                                                    $(this).closest('.al-questionList.active').addClass('selected');
                                                } else {
                                                    $(this).closest('.al-questionList.active').removeClass('selected');
                                                }
                                            }
                                        }
                                    }
                                }
                            }else{
                                if (customerStatusQuestionnaire > 0||hasAnsweredThis) {
                                    var tipContent = "您已填写过该问卷，请勿重复提交！";
                                    t.doShowTips({
                                        tipContent: tipContent,
                                        colMenuLayoutModuleId: Ev.colMenuLayoutModuleId
                                    });
                                }else {
                                    if (dataType == 1) {    //单选题
                                        $(this).closest('.al-questionList').find('.al-questionnaireSelectBtn').removeClass('checked');
                                        $(this).find('.al-questionnaireSelectBtn').addClass('checked').closest('.al-questionList.active').addClass('selected');
                                        if (dataRequired == 1) {
                                            $('.sp_container [data-id=' + Ev.colMenuLayoutModuleId + ']').find('.al-questionnaireDownBtn').show().siblings('.al-questionnaireDownBtnDisable.hide').hide();
                                        }
                                    } else if (dataType == 2) {
                                        $(this).find('.al-questionnaireSelectBtn').toggleClass('checked');
                                        var checkNumCount = $(this).closest('.al-questionList').find('.al-questionnaireSelectBtn.checked'),
                                            optionmin = $(this).closest('.al-questionList').data('optionmin'),
                                            optionmax = $(this).closest('.al-questionList').data('optionmax');
                                        if (dataRequired == 1) {
                                            if (checkNumCount.length >= optionmin && checkNumCount.length <= optionmax) {
                                                $('.sp_container [data-id=' + Ev.colMenuLayoutModuleId + ']').find('.al-questionnaireDownBtn').show().siblings('.al-questionnaireDownBtnDisable.hide').hide();  //可以点击下一题
                                                $(this).closest('.al-questionList.active').addClass('selected');
                                            } else {
                                                $('.sp_container [data-id=' + Ev.colMenuLayoutModuleId + ']').find('.al-questionnaireDownBtn').hide().siblings('.al-questionnaireDownBtnDisable.hide').show();
                                                $(this).closest('.al-questionList.active').removeClass('selected');
                                            }
                                        } else {
                                            if (checkNumCount.length > 0) {
                                                $(this).closest('.al-questionList.active').addClass('selected');
                                            } else {
                                                $(this).closest('.al-questionList.active').removeClass('selected');
                                            }
                                        }
                                    }
                                }
                            }
                    });
                    //填空题事件处理
                    var textarea=$('.sp_container [data-id='+Ev.colMenuLayoutModuleId+']').find('.al-questionList.active');
                    if($(textarea).data('type')==3){
                        $(textarea).find('.al-questionnaireAreaM').bind("keyup change input cut paste",function(){
                            if($(this).val().length>0){
                                $(this).closest('.al-questionList.active').addClass('selected');
                                $('.sp_container [data-id='+Ev.colMenuLayoutModuleId+']').find('.al-questionnaireDownBtn').show().siblings('.al-questionnaireDownBtnDisable.hide').hide();
                            }else{
                                $(this).closest('.al-questionList.active').removeClass('selected');
                                var required=$(textarea).data('required');
                                if(required==0){
                                }else{
                                    $('.sp_container [data-id='+Ev.colMenuLayoutModuleId+']').find('.al-questionnaireDownBtn').hide().siblings('.al-questionnaireDownBtnDisable.hide').show();
                                }
                            }
                        });
                    }
                }else{
                    //多题情况(isPage 1)
                    var textArea='',
                        questionPageList=$('.sp_container [data-id='+Ev.colMenuLayoutModuleId+']').find('.al-questionnairePageList').hide();  //多题集合
                    $(questionPageList[0]).show().addClass('active');
                    if(Ev.pageNum>=Ev.questionCount){
                        $('.sp_container [data-id='+Ev.colMenuLayoutModuleId+']').find('.al-questionnaireDownBtn').text("提交").addClass('submitted');
                    }
                    $('.sp_container [data-id='+Ev.colMenuLayoutModuleId+']').find('.al-questionnaireUpBtn').hide().siblings('.al-questionnaireDownBtn').addClass('first');
                    textArea=$('.sp_container [data-id='+Ev.colMenuLayoutModuleId+']').find('.al-questionnairePageList.active').children();
                    //多题点下一页
                    for (var y=0;y<textArea.length;y++){
                        if($(textArea[y]).data('type')==3){
                            $(textArea[y]).find('.al-questionnaireAreaM').bind("keyup change input cut paste",function(){
                                if($(this).val().length>0){
                                    $(this).closest('.al-questionList').addClass('selected');
                                }else{
                                    $(this).closest('.al-questionList').removeClass('selected');
                                }
                            });
                        }
                    }
                    $('.sp_container [data-id='+Ev.colMenuLayoutModuleId+']').find('.al-questionnaireDownBtn').on("click",function(){
                        if(parseInt(Ev.userType)!==3){
                            //appjs.praise();
                            appjs.joinInAuthority($.toJSON({"authority":userType}));
                            if(appjs.hasAuthority()==true){
                                var questionPageCurrent=$('.sp_container [data-id='+Ev.colMenuLayoutModuleId+']').find('.al-questionnairePageList.active'),
                                    questionPageIndex=$(questionPageCurrent).index()+1;   //当前题索引
                                //验证当前必答题是否答完
                                var currentListBox=$(questionPageCurrent).find('.al-questionList'),
                                    judgeKey='';
                                $.each(currentListBox,function(u,ulv){
                                    judgeKey+=$(ulv).data('required');
                                });
                                var c = "1"; // 要计算的字符
                                var regex = new RegExp(c, 'g'); // 用g整个字符串都匹配
                                var result = judgeKey.match(regex);
                                var count = !result ? 0 : result.length;
                                var selected=$(questionPageCurrent).find('.al-questionList.selected[data-required=1]').length;
                                //submitted=$('.sp_container [data-id='+Ev.colMenuLayoutModuleId+']').find('.questionnaire_list').data('submitted')?$('.sp_container [data-id='+Ev.colMenuLayoutModuleId+']').find('.questionnaire_list').data('submitted'):"";
                                if(selected>=count){
                                    if(questionPageIndex<questionPageList.length){
                                        $(window).scrollTop(offsettop);
                                        $('.al-questionnaireAbout').hide();
                                        $('.sp_container [data-id='+Ev.colMenuLayoutModuleId+']').find('.al-questionnaireUpBtnDisable').hide().siblings('.al-questionnaireUpBtn').show();
                                        $('.sp_container [data-id='+Ev.colMenuLayoutModuleId+']').find('.al-questionnairePageList.active').hide().removeClass('active').next().show().addClass('active');
                                        if(Ev.pageNum>=Ev.questionCount){
                                        }else{
                                            $('.sp_container [data-id='+Ev.colMenuLayoutModuleId+']').find('.al-questionnaireDownBtn').removeClass("first").siblings('.al-questionnaireUpBtn').show();
                                        }
                                        textArea=$('.sp_container [data-id='+Ev.colMenuLayoutModuleId+']').find('.al-questionnairePageList.active').children();
                                        for (var y=0;y<textArea.length;y++){
                                            if($(textArea[y]).data('type')==3){
                                                $(textArea[y]).find('.al-questionnaireAreaM').bind("keyup change input cut paste",function(){
                                                    if($(this).val().length>0){
                                                        $(this).closest('.al-questionList').addClass('selected');
                                                    }else{
                                                        $(this).closest('.al-questionList').removeClass('selected');
                                                    }
                                                });
                                            }
                                        }
                                        if (questionPageIndex==questionPageList.length-1){
                                            $('.sp_container [data-id='+Ev.colMenuLayoutModuleId+']').find('.al-questionnaireDownBtn').text("提交").addClass('submitted');
                                        }
                                    }else{
                                        if(Ev.customerStatusQuestionnaire>0){
                                            var tipContent="您已填写过该问卷,请勿重复提交!";
                                            t.doShowTips({tipContent:tipContent,colMenuLayoutModuleId:Ev.colMenuLayoutModuleId});
                                        }else{
                                            t.doSubmitted(Ev);
                                        }
                                    }
                                }else{
                                    var tipElements=$('div[data-id=' + Ev.colMenuLayoutModuleId + ']').find('.al-questionnairePageList.active').children(),
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
                                    var tipElementItem=$(currentListBox)[tipIndex],        //未答题的第一道题元素
                                        tipAddress=$($(currentListBox)[tipIndex]).offset().top-50,
                                        tipContentDisable=t.quNumCheck({
                                            colMenuLayoutModuleId: Ev.colMenuLayoutModuleId,
                                            columnId: Ev.columnId,
                                            questionnaireType: Ev.questionnaireType,
                                            isPage:Ev.isPage,
                                            tipElementItem:tipElementItem   //未答题的第一道题元素
                                        });
                                    t.doShowTips({tipContent:tipContentDisable,colMenuLayoutModuleId:Ev.colMenuLayoutModuleId});
                                    $(tipElementItem).find('.al-questionNotAnswer').text("请作答");
                                    $(window).scrollTop(tipAddress);
                                }
                            }
                        }else{
                            var questionPageCurrent=$('.sp_container [data-id='+Ev.colMenuLayoutModuleId+']').find('.al-questionnairePageList.active'),
                                questionPageIndex=$(questionPageCurrent).index()+1;   //当前题索引
                            //验证当前必答题是否答完
                            var currentListBox=$(questionPageCurrent).find('.al-questionList'),
                                judgeKey='';
                            $.each(currentListBox,function(u,ulv){
                                judgeKey+=$(ulv).data('required');
                            });
                            var c = "1"; // 要计算的字符
                            var regex = new RegExp(c, 'g'); // 用g整个字符串都匹配
                            var result = judgeKey.match(regex);
                            var count = !result ? 0 : result.length;
                            var selected=$(questionPageCurrent).find('.al-questionList.selected[data-required=1]').length;
                            //submitted=$('.sp_container [data-id='+Ev.colMenuLayoutModuleId+']').find('.questionnaire_list').data('submitted')?$('.sp_container [data-id='+Ev.colMenuLayoutModuleId+']').find('.questionnaire_list').data('submitted'):"";
                            if(selected>=count){
                                if(questionPageIndex<questionPageList.length){
                                    $(window).scrollTop(offsettop);
                                    $('.al-questionnaireAbout').hide();
                                    $('.sp_container [data-id='+Ev.colMenuLayoutModuleId+']').find('.al-questionnaireUpBtnDisable').hide().siblings('.al-questionnaireUpBtn').show();
                                    $('.sp_container [data-id='+Ev.colMenuLayoutModuleId+']').find('.al-questionnairePageList.active').hide().removeClass('active').next().show().addClass('active');
                                    if(Ev.pageNum>=Ev.questionCount){
                                    }else{
                                        $(this).removeClass("first").siblings('.al-questionnaireUpBtn').show();
                                    }
                                    textArea=$('.sp_container [data-id='+Ev.colMenuLayoutModuleId+']').find('.al-questionnairePageList.active').children();
                                    for (var y=0;y<textArea.length;y++){
                                        if($(textArea[y]).data('type')==3){
                                            $(textArea[y]).find('.al-questionnaireAreaM').bind("keyup change input cut paste",function(){
                                                if($(this).val().length>0){
                                                    $(this).closest('.al-questionList').addClass('selected');
                                                }else{
                                                    $(this).closest('.al-questionList').removeClass('selected');
                                                }
                                            });
                                        }
                                    }
                                    if (questionPageIndex==questionPageList.length-1){
                                        $('.sp_container [data-id='+Ev.colMenuLayoutModuleId+']').find('.al-questionnaireDownBtn').text("提交").addClass('submitted');
                                    }
                                }else{
                                    if(Ev.customerStatusQuestionnaire>0){
                                        var tipContent="您已填写过该问卷,请勿重复提交！";
                                        t.doShowTips({tipContent:tipContent,colMenuLayoutModuleId:Ev.colMenuLayoutModuleId});
                                    }else{
                                        t.doSubmitted(Ev);
                                    }
                                }
                            }else{
                                var tipElements=$('div[data-id=' + Ev.colMenuLayoutModuleId + ']').find('.al-questionnairePageList.active').children(),
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
                                var tipElementItem=$(currentListBox)[tipIndex],        //未答题的第一道题元素
                                    tipAddress=$($(currentListBox)[tipIndex]).offset().top-50,
                                    tipContentDisable=t.quNumCheck({
                                        colMenuLayoutModuleId: Ev.colMenuLayoutModuleId,
                                        columnId: Ev.columnId,
                                        questionnaireType: Ev.questionnaireType,
                                        isPage:Ev.isPage,
                                        tipElementItem:tipElementItem   //未答题的第一道题元素
                                    });
                                t.doShowTips({tipContent:tipContentDisable,colMenuLayoutModuleId:Ev.colMenuLayoutModuleId});
                                $(tipElementItem).find('.al-questionNotAnswer').text("请作答");
                                $(window).scrollTop(tipAddress);
                            }
                        }
                    });
                    //多题点上一页
                    $('.sp_container [data-id='+Ev.colMenuLayoutModuleId+']').find('.al-questionnaireUpBtn').on("click",function(){
                        $(window).scrollTop(offsettop);
                        var questionPageCurrents=$('.sp_container [data-id='+Ev.colMenuLayoutModuleId+']').find('.al-questionnairePageList.active'),
                            questionPageIndexs=$(questionPageCurrents).index()+1;   //当前题索引
                        $('.sp_container [data-id='+Ev.colMenuLayoutModuleId+']').find('.al-questionnaireDownBtn').text("下一页").removeClass('submitted').siblings('.al-questionnaireDownBtnDisable.hide').text("下一页").hide();
                        $(this).siblings('.al-questionnaireDownBtn').show();
                        $('.sp_container [data-id='+Ev.colMenuLayoutModuleId+']').find('.al-questionnairePageList.active').removeClass('active').hide().prev().show().addClass('active');
                        textArea=$('.sp_container [data-id='+Ev.colMenuLayoutModuleId+']').find('.al-questionnairePageList.active').children();
                        for (var y=0;y<textArea.length;y++){
                            if($(textArea[y]).data('type')==3){
                                $(textArea[y]).find('.al-questionnaireAreaM').bind("keyup change input cut paste",function(){
                                    if($(this).val().length>0){
                                        $(this).closest('.al-questionList').addClass('selected');
                                    }else{
                                        $(this).closest('.al-questionList').removeClass('selected');
                                    }
                                });
                            }
                        }
                        if(questionPageIndexs==2){
                            $('.al-questionnaireAbout').show();
                            $(this).hide().siblings('.al-questionnaireDownBtn').addClass('first');
                        }
                    });
                    //选项选择处理
                    $('.sp_container [data-id='+Ev.colMenuLayoutModuleId+']').attr({userType:Ev.userType,customerStatusQuestionnaire:Ev.customerStatusQuestionnaire,qId:Ev.questionnaireId});
                    $('.sp_container [data-id='+Ev.colMenuLayoutModuleId+']').find('.al-questionnaireSelectBtnBox').on("click",function(){
                        var outTime = $(this).parents('.isComp').attr('outTime');
                        var _usType = $(this).parents('.isComp').attr('userType');
                        var maxOpt = $(this).parents('.al-questionList').attr('data-optionmax')?parseInt($(this).parents('.al-questionList').attr('data-optionmax')):0; //最多选项
                        var checkedNum = $(this).parents('.al-questionList').find('.checked').length;   //已选项

                        var customerStatusQuestionnaire = $(this).parents('.isComp').attr('customerStatusQuestionnaire');
                        var qId = $(this).parents('.isComp').attr('qId');//问卷id
                        var hasAnsweredThis = false;    //已答过该问卷
                        if(typeof TempCache.getItem('qId')=='string'){  //本地已答问卷缓存非空
                            if(TempCache.getItem('qId').indexOf(qId)>-1){
                                hasAnsweredThis = true;
                            }
                        }
                        if(outTime){    //不在问卷时间范围内
                            return false;
                        }

                        if(maxOpt&&checkedNum>=maxOpt&&$(this).find('.checked').length==0){//最多选项
                            var tipContent="此题最多可选"+maxOpt+"项";
                            t.doShowTips({tipContent:tipContent,colMenuLayoutModuleId:Ev.colMenuLayoutModuleId});
                            return false;
                        }
                        if(_usType!=3){
                            appjs.joinInAuthority($.toJSON({"authority":_usType}));
                            if(appjs.hasAuthority()==true){
                                $(this).parents('.isComp').find('.total_title span').html('已登录');
                                if(customerStatusQuestionnaire>0||hasAnsweredThis){
                                    var tipContent="您已填写过该问卷，请勿重复提交！";
                                    t.doShowTips({tipContent:tipContent,colMenuLayoutModuleId:Ev.colMenuLayoutModuleId});
                                }else {
                                    var dataType = $(this).closest('.al-questionList').data('type'),
                                        dataRequired = $(this).closest('.al-questionList').data('required');
                                    if (dataType == 1) {    //单选题
                                        $(this).closest('.al-questionList').find('.al-questionnaireSelectBtn').removeClass('checked');
                                        $(this).find('.al-questionnaireSelectBtn').addClass('checked').closest('.al-questionList').addClass('selected');
                                    } else if (dataType == 2) {
                                        $(this).find('.al-questionnaireSelectBtn').toggleClass('checked');
                                        var checkNumCount = $(this).closest('.al-questionList').find('.al-questionnaireSelectBtn.checked'),
                                            optionmin = $(this).closest('.al-questionList').data('optionmin'),
                                            optionmax = $(this).closest('.al-questionList').data('optionmax');
                                        if (dataRequired == 1) {
                                            if (checkNumCount.length >= optionmin && checkNumCount.length <= optionmax) {
                                                //可以点击下一题
                                                $(this).closest('.al-questionList').addClass('selected');
                                            } else {
                                                $(this).closest('.al-questionList').removeClass('selected');
                                            }
                                        } else {
                                            if (checkNumCount.length > 0) {
                                                $(this).closest('.al-questionList').addClass('selected');
                                            } else {
                                                $(this).closest('.al-questionList').removeClass('selected');
                                            }
                                        }
                                    }
                                }
                            }
                        }else{
                            if(customerStatusQuestionnaire>0||hasAnsweredThis){
                                var tipContent="您已填写过该问卷，请勿重复提交！";
                                t.doShowTips({tipContent:tipContent,colMenuLayoutModuleId:Ev.colMenuLayoutModuleId});
                            }else {
                                var dataType = $(this).closest('.al-questionList').data('type'),
                                    dataRequired = $(this).closest('.al-questionList').data('required');
                                if (dataType == 1) {    //单选题
                                    $(this).closest('.al-questionList').find('.al-questionnaireSelectBtn').removeClass('checked');
                                    $(this).find('.al-questionnaireSelectBtn').addClass('checked').closest('.al-questionList').addClass('selected');
                                } else if (dataType == 2) {
                                    $(this).find('.al-questionnaireSelectBtn').toggleClass('checked');
                                    var checkNumCount = $(this).closest('.al-questionList').find('.al-questionnaireSelectBtn.checked'),
                                        optionmin = $(this).closest('.al-questionList').data('optionmin'),
                                        optionmax = $(this).closest('.al-questionList').data('optionmax');
                                    if (dataRequired == 1) {
                                        if (checkNumCount.length >= optionmin && checkNumCount.length <= optionmax) {
                                            //可以点击下一题
                                            $(this).closest('.al-questionList').addClass('selected');
                                        } else {
                                            $(this).closest('.al-questionList').removeClass('selected');
                                        }
                                    } else {
                                        if (checkNumCount.length > 0) {
                                            $(this).closest('.al-questionList').addClass('selected');
                                        } else {
                                            $(this).closest('.al-questionList').removeClass('selected');
                                        }
                                    }
                                }
                            }
                        }
                    });
                }

            },
            doSubmitted:function(Suv){
                var t=this;
                var submitListCon=(Suv.questionnaireType==1)?($('.sp_container [data-id='+Suv.colMenuLayoutModuleId+']').find('.al-questionList.selected')):($('.sp_container [data-id='+Suv.colMenuLayoutModuleId+']').find('.al-voteList')),
                    recommendListMap=[];
                $.each(submitListCon,function(L,mal){
                    var refId=$(mal).data('id'),  //题目ID
                        refType=$(mal).data('type'), //题目类型
                        refListItem='';  //选中的选项
                    switch (refType){
                        case 1:
                            var refCqomark=$(mal).find('.al-questionnaireSelectBtn.checked').parent().data('cqomark');
                            refListItem={
                                questionId:refId,
                                questionType:refType,
                                optionMark:refCqomark
                            };
                            break;
                        case 2:
                            refCqomark=$(mal).find('.al-questionnaireSelectBtn.checked').parent();
                            var refCqomarked='';
                            $.each(refCqomark,function(l,Mv){
                                refCqomarked+=$(Mv).data('cqomark')+",";
                            });
                            refListItem={
                                questionId:refId,
                                questionType:refType,
                                optionMark:refCqomarked.substring(0,refCqomarked.length-1)
                            };
                            break;
                        case 3:
                            var answerContent=$(mal).find('.al-questionnaireAreaM').val();
                            refListItem={
                                questionId:refId,
                                questionType:3,
                                answerContent:answerContent
                            };
                            break;
                    }
                    recommendListMap.push(refListItem);
                });
                t.questionAnswer({
                    questionnaireId:Suv.questionnaireId,       // 问卷ID
                    questionnaireType:Suv.questionnaireType,  //问卷类型 （1问卷 2投票）
                    recommendListMap:recommendListMap,
                    colMenuLayoutModuleId:Suv.colMenuLayoutModuleId,
                    isShareState:Suv.isShareState,            //是否分享
                    isPage:Suv.isPage,                    //是否分页
                    endContent:Suv.endContent,    //结束话术
                    shareContent:Suv.shareContent,          //分享内容
                    sharePicUrl:Suv.sharePicUrl,            //分享图片URL
                    share_title:Suv.share_title
                })
            },
            questionAnswer:function(Rv){  //提交问卷数据
                var t=this,
                    customerId='',
                    checkUser=appjs.getAuthorCustomerId();
                if(checkUser==""||checkUser==undefined||checkUser==null){
                    customerId=0;
                }else{
                    customerId=appjs.getAuthorCustomerId();
                }
                var reData={
                    customerId:customerId,
                    questionnaireId:Rv.questionnaireId,
                    recommendListMap:JSON.stringify(Rv.recommendListMap)
                };
                var params={paramJson: $.toJSON(reData)};
                $.ajax({
                    url : "/mcall/col/question/answer/create/",
                    type : "POST",
                    data :  params,
                    async : false,
                    time : 5000,
                    success : function(data){
                        //comm.LightBox.hideloading();
                        t.doShareHtml(Rv);
                    },
                    error : function(){
                        // comm.LightBox.hideloading();
                    }
                });
            },

            //投票模块
            voteResult:function(vLv){
                //console.log(vLv);
                var t=this,
                    voteData=vLv.voteData,
                    questionnaireId=voteData.questionnaireId,    //问卷ID
                    title=comm.cutstr(voteData.questionnaireTitle,60),                        //问卷标题
                    cqStartTime=voteData.cqStartTime?Date.parse((voteData.cqStartTime).replace(/-/g,"/")):'',       //开始时间
                    cqEndTime=voteData.cqEndTime?Date.parse((voteData.cqEndTime).replace(/-/g,"/")):'',         //结束时间
                    isShareState=voteData.isShareState,          //是否分享活动页
                    isShowResult=voteData.isShowResult,          //是否查看结果
                    userType=voteData.userType,                  //(1-需登录、2-需认证、3-无限制)
                    isPage=voteData.isPage,                      //是否分页
                    endContent=voteData.endContent,              //结束话术
                    shareContent=voteData.shareContent,          //分享内容
                    sharePicUrl=voteData.sharePicUrl,            //分享图片URL
                    share_title=voteData.share_title,            //分享标题
                    customerStatusQuestionnaire=voteData.customerStatusQuestionnaire,  //是否投票
                    summary=voteData.questionnaireSummary?comm.getStrLen(voteData.questionnaireSummary,110*2):"",       //简介内容
                    summaryAll=voteData.questionnaireSummary,
                    colQuestionnaireAttachmentList=voteData.colQuestionnaireAttachmentList?voteData.colQuestionnaireAttachmentList:"",   //简介图片集合
                    colQuestionMapList=voteData.colQuestionMapList[0]?voteData.colQuestionMapList[0]:"",    //题集合
                    voteHtml=t.doVoteHtml({
                        colQuestionMapList:colQuestionMapList,
                        colQuestionnaireAttachmentList:colQuestionnaireAttachmentList,
                        summary:summary,
                        summaryAll:summaryAll
                    }),
                    voteBtnHtml= t.doBtnHtml({
                        cqStartTime:cqStartTime,
                        cqEndTime:cqEndTime,
                        customerStatusQuestionnaire:customerStatusQuestionnaire,
                        isShowResult:isShowResult
                    });
                //组件名称
                $('div[data-id=' + vLv.colMenuLayoutModuleId + '] .total_title').children('span').text(title);
                $('.sp_container [data-id='+vLv.colMenuLayoutModuleId+']').find('.questionnaire_list').append(voteHtml+voteBtnHtml);
                $('.sp_container [data-id='+vLv.colMenuLayoutModuleId+']').find('.al-questionnaireAboutOpen').on("click",function(){
                    $(this).parent().hide().siblings('.al-questionnaireAboutWord.showAll').show();
                });
                //样式修改
                if(summary.length==0||summary==''){
                    if(colQuestionnaireAttachmentList.length==0){
                        $('.sp_container [data-id='+vLv.colMenuLayoutModuleId+']').find('.al-questionnaireAbout').css("margin-bottom","0");
                    }
                }
                t.voteAction({
                    colMenuLayoutModuleId:vLv.colMenuLayoutModuleId,
                    questionnaireId:questionnaireId,          //问卷ID
                    questionnaireType:vLv.questionnaireType,  //问卷类型 （1问卷 2投票）
                    columnId:vLv.columnId,
                    isShareState:isShareState,
                    isShowResult:isShowResult,
                    endContent:endContent,
                    colQuestionMapList:colQuestionMapList,
                    userType:userType,
                    isPage:isPage,
                    shareContent:shareContent,          //分享内容
                    sharePicUrl:sharePicUrl,            //分享图片URL
                    share_title:share_title
                });
            },
            doVoteHtml:function(voteVal){
                var t=this,
                    voteItem=voteVal.colQuestionMapList,
                    voteType=voteItem.questionType,
                    _voteHtml='',
                    _voteHtmlL='',
                    _attVoteHtml=t.AttachmentVoteList(voteVal);
                switch (parseInt(voteType)){
                    case 1:
                        _voteHtml=t.doVoteHtml1(voteVal);
                        break;
                    case 2:
                        _voteHtml=t.doVoteHtml2(voteVal);
                        break;
                }
                _voteHtmlL+='<div class="al-voteContent" data-type="" data-id="">'+_attVoteHtml+_voteHtml+'</div>';
                return _voteHtmlL;
            },
            AttachmentVoteList:function(h){       //加载简介Dom
                var introHtml='',
                    introPicOne='',
                    introPicTwo='',
                    introPicThree='';
                if(h.colQuestionnaireAttachmentList.length>2){
                    introPicOne= h.colQuestionnaireAttachmentList[0].cqaQuestionnaireAttUr;
                    introPicTwo=h.colQuestionnaireAttachmentList[1].cqaQuestionnaireAttUr;
                    introPicThree=h.colQuestionnaireAttachmentList[2].cqaQuestionnaireAttUr;
                }else if(h.colQuestionnaireAttachmentList.length>1){
                    introPicOne=h.colQuestionnaireAttachmentList[0].cqaQuestionnaireAttUr;
                    introPicTwo=h.colQuestionnaireAttachmentList[1].cqaQuestionnaireAttUr;
                }else if(h.colQuestionnaireAttachmentList.length>0){
                    introPicOne=h.colQuestionnaireAttachmentList[0].cqaQuestionnaireAttUr;
                }
                if (h.colQuestionnaireAttachmentList.length>0) {
                    if (h.colQuestionnaireAttachmentList.length == 1) {  //简介1张图
                        introHtml += '<section class="al-questionnaireAbout" >' +
                            '<p class="al-questionnaireAboutWord" style="display: '+ (h.summary.length>0?"block":"none")+'">' + h.summary + '<span class="al-questionnaireAboutOpen">'+(h.summaryAll.length>h.summary.length?"展开":"")+'</span></p>' +
                            '<p class="al-questionnaireAboutWord showAll">' + h.summaryAll + '</p>' +
                            '<figure class="al-questionnaireAboutPicBox al-quesViewBig"><span class="al-questionnaireAboutPicOne al-quesViewBigList">' +
                            '<img class="al-questionnaireAboutPicItem" src="' + introPicOne + '" alt=""> <div class="al-questionnaireSelectViewBig"><p class="al-questionnaireSelectViewBigWord">查看大图</p></div></span></figure></section>'
                    } else if (h.colQuestionnaireAttachmentList.length == 2) {                    //简介2张图
                        introHtml += '<section class="al-questionnaireAbout"><p class="al-questionnaireAboutWord" style="display: '+ (h.summary.length>0?"block":"none")+'">' + h.summary + '<span class="al-questionnaireAboutOpen">'+(h.summaryAll.length>h.summary.length?"展开":"")+'</span></p>' +
                            '<p class="al-questionnaireAboutWord showAll">' + h.summaryAll + '</p>' +
                            '<figure class="al-questionnaireAboutPicBox two al-quesViewBig"><span class="al-questionnaireAboutPicTwo al-quesViewBigList">' +
                            '<img class="al-questionnaireAboutPicItemTwo" src="' + introPicOne + '" alt=""> <div class="al-questionnaireSelectViewBig"><p class="al-questionnaireSelectViewBigWord">查看大图</p></div></span>' +
                            '<span class="al-questionnaireAboutPicTwo al-quesViewBigList"><img class="al-questionnaireAboutPicItemTwo" src="' + introPicTwo + '" alt=""> <div class="al-questionnaireSelectViewBig"><p class="al-questionnaireSelectViewBigWord">查看大图</p></div></span></figure></section>'
                    } else {
                        introHtml += '<section class="al-questionnaireAbout"><p class="al-questionnaireAboutWord" style="display: '+ (h.summary.length>0?"block":"none")+'">' + h.summary + '<span class="al-questionnaireAboutOpen">'+(h.summaryAll.length>h.summary.length?"展开":"")+'</span></p>' +
                            '<p class="al-questionnaireAboutWord showAll">' + h.summaryAll + '</p>' +
                            '<figure class="al-questionnaireAboutPicBox three al-quesViewBig"><span class="al-questionnaireAboutPicThree al-quesViewBigList">' +
                            '<img class="al-questionnaireAboutPicItemTwo" src="' + introPicOne + '" alt=""> <div class="al-questionnaireSelectViewBig"><p class="al-questionnaireSelectViewBigWord">查看大图</p></div></span>' +
                            '<span class="al-questionnaireAboutPicThree al-quesViewBigList">' +
                            '<img class="al-questionnaireAboutPicItemTwo" src="' + introPicTwo + '" alt=""> <div class="al-questionnaireSelectViewBig"><p class="al-questionnaireSelectViewBigWord">查看大图</p></div></span> ' +
                            '<span class="al-questionnaireAboutPicThree al-quesViewBigList">' +
                            '<img class="al-questionnaireAboutPicItemTwo" src="' + introPicThree + '" alt=""> <div class="al-questionnaireSelectViewBig"><p class="al-questionnaireSelectViewBigWord">查看大图</p></div></span> </figure> </section>'
                    }
                }else{
                    if(h.summary.length>0){
                        introHtml += '<section class="al-questionnaireAbout" >' +
                            '<p class="al-questionnaireAboutWord" style="display: '+ (h.summary.length>0?"block":"none")+'">' + h.summary + '<span class="al-questionnaireAboutOpen">'+(h.summaryAll.length>h.summary.length?"展开":"")+'</span></p>' +
                            '<p class="al-questionnaireAboutWord showAll">' + h.summaryAll + '</p>' +
                            '</section>'
                    }else{
                        introHtml='';
                    }
                }
                return introHtml;
            },
            doVoteHtml1:function(tv1){
                var _html1='',
                    _html11='',
                    _vHtmlOne='',
                    voteList=tv1.colQuestionMapList,
                    votePicList=tv1.colQuestionnaireAttachmentList,  //简介图集
                    questionId=voteList.questionId,               //题目ID
                    questionContent=comm.cutstr(voteList.questionContent,600),     //投票题目内容
                    questionType=voteList.questionType,           //题目类型
                    cQuestionAttList=voteList.cQuestionAttList,   //题目图集
                    questionIsRequiredStatus=voteList.questionIsRequiredStatus,  //是否为必选
                    colQuestionOptionMapList=voteList.colQuestionOptionMapList;  //选项集合
                if(cQuestionAttList.length>2){
                    _vHtmlOne+='<figure class="al-questionnaireAboutMultiplyThree al-quesViewBig"><span class="al-questionnaireAboutMultiplyThreePic al-quesViewBigList">' +
                        '<img class="al-questionnaireAboutMultiplyItem three" src="'+cQuestionAttList[0].cquestionAttUrl+'" alt=""><div class="al-questionnaireSelectViewBig">' +
                        '<p class="al-questionnaireSelectViewBigWord">查看大图</p></div></span><span class="al-questionnaireAboutMultiplyThreePic al-quesViewBigList">' +
                        '<img class="al-questionnaireAboutMultiplyItem three" src="'+cQuestionAttList[1].cquestionAttUrl+'" alt=""><div class="al-questionnaireSelectViewBig">' +
                        '<p class="al-questionnaireSelectViewBigWord">查看大图</p></div></span><span class="al-questionnaireAboutMultiplyThreePic al-quesViewBigList">' +
                        '<img class="al-questionnaireAboutMultiplyItem three" src="'+cQuestionAttList[2].cquestionAttUrl+'" alt=""><div class="al-questionnaireSelectViewBig">' +
                        '<p class="al-questionnaireSelectViewBigWord">查看大图</p></div></span></figure>';
                }else if(cQuestionAttList.length>1){
                    _vHtmlOne+='<figure class="al-questionnaireAboutMultiplyTwo al-quesViewBig"><span class="al-questionnaireAboutMultiplyTwoPic al-quesViewBigList">' +
                        '<img class="al-questionnaireAboutMultiplyItem two" src="'+cQuestionAttList[0].cquestionAttUrl+'" alt="">' +
                        '<div class="al-questionnaireSelectViewBig"><p class="al-questionnaireSelectViewBigWord">查看大图</p></div></span><span class="al-questionnaireAboutMultiplyTwoPic al-quesViewBigList"> ' +
                        '<img class="al-questionnaireAboutMultiplyItem two" src="'+cQuestionAttList[1].cquestionAttUrl+'" alt=""><div class="al-questionnaireSelectViewBig"> ' +
                        '<p class="al-questionnaireSelectViewBigWord">查看大图</p></div></span></figure>';
                }else if(cQuestionAttList.length>0){
                    _vHtmlOne+='<figure class="al-questionnaireAboutMultiply al-quesViewBig"><span class="al-questionnaireAboutMultiplyItemBox al-quesViewBigList">' +
                        '<img class="al-questionnaireAboutMultiplyItem" src="'+cQuestionAttList[0].cquestionAttUrl+'" alt=""><div class="al-questionnaireSelectViewBig"> ' +
                        '<p class="al-questionnaireSelectViewBigWord">查看大图</p></div></span></figure>';
                }else{
                    _vHtmlOne+='';
                }
                _html1+=' <section class="al-questionnaireMain"><span class="al-questionnaireMainNum Vote"></span> ' +
                    '<div class="al-questionnaireMainStem Vote">'+questionContent+'</div>'+_vHtmlOne+'</section>';
                $.each(colQuestionOptionMapList,function(w,uLv){
                    var cqoContent=comm.cutstr(uLv.cqoContent,400),       //选项内容
                        cqoMark=uLv.cqoMark,              //选项标示（A、B、C、D）
                        cqoPicUrl=uLv.cqoPicUrl;          //选项图片地址
                    if(cqoPicUrl.length>0){
                        _html11+='<section class="al-questionnaireSelectItem"><div class="al-questionnaireSelectPicBox al-quesViewBigList"><img class="al-questionnaireSelectPicDetail" src="'+cqoPicUrl+'" alt=""> ' +
                            '<div class="al-questionnaireSelectViewBig"><p class="al-questionnaireSelectViewBigWord">查看大图</p></div></div><div class="al-questionnaireSelectBtnBox" data-cqomark="'+cqoMark+'"> ' +
                            '<span class="al-questionnaireSelectBtn"></span><div class="al-questionnaireSelectMain"><span class="al-questionnaireSelectMainNum">'+cqoMark+'.</span>' +
                            '<span class="al-questionnaireSelectMainWord">' + (cqoContent.length > 0 ? cqoContent : "选项") + '</span></div></div></section>'
                    }else{
                        _html11+='<section class="al-questionnaireSelectItem"><div class="al-questionnaireSelectBtnBox noPic" data-cqomark="'+cqoMark+'"> ' +
                            '<span class="al-questionnaireSelectBtn"></span><div class="al-questionnaireSelectMain"><span class="al-questionnaireSelectMainNum">'+cqoMark+'.</span>' +
                            '<span class="al-questionnaireSelectMainWord">' + (cqoContent.length > 0 ? cqoContent : "选项") + '</span></div></div></section>'
                    }

                });
                _html1+='<div class="al-voteList" data-type="'+questionType+'" data-require="'+questionIsRequiredStatus+'" data-id="'+questionId+'">'+_html11+'</div>';
                return _html1;
            },
            doVoteHtml2:function(tv2){
                var _html2='',
                    voteLists=tv2.colQuestionMapList,
                    questionContent=comm.cutstr(voteLists.questionContent,600),       //投票题目内容
                    cQuestionAttList=voteLists.cQuestionAttList,     //题干图集
                    questionId=voteLists.questionId,                //题目ID
                    questionType=voteLists.questionType,         //题目类型
                    questionOptionMax=voteLists.questionOptionMax,    //最多选项
                    questionOptionMin=voteLists.questionOptionMin,    //最多选项
                    questionIsRequiredStatus=voteLists.questionIsRequiredStatus, //是否必选
                    colQuestionOptionMapList=voteLists.colQuestionOptionMapList;  //选项集合;
                var _selHtmlTwo='',
                    _vHtmlTwo='',
                    optionNum2="(请选择"+(questionOptionMin)+"-"+(questionOptionMax)+")";
                if(cQuestionAttList.length>2){
                    _vHtmlTwo+='<figure class="al-questionnaireAboutMultiplyThree al-quesViewBig"><span class="al-questionnaireAboutMultiplyThreePic al-quesViewBigList">' +
                        '<img class="al-questionnaireAboutMultiplyItem three" src="'+cQuestionAttList[0].cquestionAttUrl+'" alt=""><div class="al-questionnaireSelectViewBig">' +
                        '<p class="al-questionnaireSelectViewBigWord">查看大图</p></div></span><span class="al-questionnaireAboutMultiplyThreePic al-quesViewBigList">' +
                        '<img class="al-questionnaireAboutMultiplyItem three" src="'+cQuestionAttList[1].cquestionAttUrl+'" alt=""><div class="al-questionnaireSelectViewBig">' +
                        '<p class="al-questionnaireSelectViewBigWord">查看大图</p></div></span><span class="al-questionnaireAboutMultiplyThreePic al-quesViewBigList">' +
                        '<img class="al-questionnaireAboutMultiplyItem three" src="'+cQuestionAttList[2].cquestionAttUrl+'" alt=""><div class="al-questionnaireSelectViewBig">' +
                        '<p class="al-questionnaireSelectViewBigWord">查看大图</p></div></span></figure>';
                }else if(cQuestionAttList.length>1){
                    _vHtmlTwo+='<figure class="al-questionnaireAboutMultiplyTwo al-quesViewBig"><span class="al-questionnaireAboutMultiplyTwoPic al-quesViewBigList">' +
                        '<img class="al-questionnaireAboutMultiplyItem two" src="'+cQuestionAttList[0].cquestionAttUrl+'" alt="">' +
                        '<div class="al-questionnaireSelectViewBig"><p class="al-questionnaireSelectViewBigWord">查看大图</p></div></span><span class="al-questionnaireAboutMultiplyTwoPic al-quesViewBigList"> ' +
                        '<img class="al-questionnaireAboutMultiplyItem two" src="'+cQuestionAttList[1].cquestionAttUrl+'" alt=""><div class="al-questionnaireSelectViewBig"> ' +
                        '<p class="al-questionnaireSelectViewBigWord">查看大图</p></div></span></figure>';
                }else if(cQuestionAttList.length>0){
                    _vHtmlTwo+='<figure class="al-questionnaireAboutMultiply al-quesViewBig"><span class="al-questionnaireAboutMultiplyItemBox al-quesViewBigList">' +
                        '<img class="al-questionnaireAboutMultiplyItem" src="'+cQuestionAttList[0].cquestionAttUrl+'" alt=""><div class="al-questionnaireSelectViewBig"> ' +
                        '<p class="al-questionnaireSelectViewBigWord">查看大图</p></div></span></figure>';
                }else{
                    _vHtmlTwo+='';
                }

                _html2+='<section class="al-questionnaireMain multipleChoice"><span class="al-questionnaireMainNum Vote"></span>' +
                    '<div class="al-questionnaireMainStem Vote">'+questionContent+'<span class="al-questionMultiTip">'+(questionIsRequiredStatus==1?optionNum2:"")+'</span></div>'+_vHtmlTwo+'</section>';
                $.each(colQuestionOptionMapList,function(j,val){
                    var cqoContent=comm.cutstr(val.cqoContent,400),       //选项内容
                        cqoMark=val.cqoMark,               //选项标示（A、B、C、D）
                        cqoPicUrl=val.cqoPicUrl;           //选项图片地址
                    if(cqoPicUrl!==" "&&cqoPicUrl.length>0){ //选项有图
                        _selHtmlTwo += '<section class="al-questionnaireSelectItem"><div class="al-questionnaireSelectPicBox multipleChoice al-quesViewBigList">' +
                            '<img class="al-questionnaireSelectPicDetail" src="'+cqoPicUrl+'" alt="">' +
                            '<div class="al-questionnaireSelectViewBig"><p class="al-questionnaireSelectViewBigWord">查看大图</p></div></div><div class="al-questionnaireSelectBtnBox multipleChoice" data-cqomark="'+cqoMark+'">' +
                            '<span class="al-questionnaireSelectBtn multipleChoice"></span><div class="al-questionnaireSelectMain"><span class="al-questionnaireSelectMainNum">'+cqoMark+'.</span>' +
                            '<span class="al-questionnaireSelectMainWord">' + (cqoContent.length > 0 ? cqoContent : "选项") + '</span></div></div></section>'
                    }else {
                        _selHtmlTwo += '<section class="al-questionnaireSelectItem"><div class="al-questionnaireSelectBtnBox multipleChoice" data-cqomark="'+cqoMark+'"><span class="al-questionnaireSelectBtn multipleChoice"></span> ' +
                            '<div class="al-questionnaireSelectMain"><span class="al-questionnaireSelectMainNum">'+cqoMark+'.</span>' +
                            '<span class="al-questionnaireSelectMainWord">' + (cqoContent.length > 0 ? cqoContent : "选项") + '</span>' +
                            '</div></div></section>'
                    }
                });
                _html2+='<div class="al-voteList" data-id="'+questionId+'" data-type="'+questionType+'" data-require="'+questionIsRequiredStatus+'" data-optionmin="'+questionOptionMin+'" data-optionmax="'+questionOptionMax+'">'+_selHtmlTwo+'</div>';;
                return _html2;
            },
            doBtnHtml:function(BLv){
                var _btnHtml='';
                var todayVote=Date.parse(new Date()),
                    overTime=todayVote>BLv.cqEndTime?"已结束":"投票",
                    preTime=todayVote<BLv.cqStartTime?"未开始":"投票";
                if(BLv.cqStartTime==""&&BLv.cqEndTime==""||BLv.cqStartTime<todayVote&&todayVote<BLv.cqEndTime||BLv.cqStartTime==""&&todayVote<BLv.cqEndTime||BLv.cqStartTime<todayVote&&BLv.cqEndTime==""){
                    if(BLv.customerStatusQuestionnaire>0){
                        _btnHtml+=' <section class="al-questionnaireUpDownBtnBox"><div class="al-questionnaireUpBtnVoted Vote ">已投票</div>' +
                            '<div class="al-questionnaireDownBtn Vote " style="display: '+(BLv.isShowResult==2?"block":"none")+'">查看结果</div></section>' +
                            '<section class="al-questionnaireVoteResult"></section><section class="al-questionnaireShowTips"></section>'
                    }else{
                        _btnHtml+=' <section class="al-questionnaireUpDownBtnBox"><div class="al-questionnaireUpBtnVoted Vote hide">已投票</div>' +
                            '<div class="al-questionnaireUpBtn Vote ">投票</div><div class="al-questionnaireDownBtn Vote " style="display: '+(BLv.isShowResult==2?"block":"none")+'">查看结果</div></section>' +
                            '<section class="al-questionnaireVoteResult"></section><section class="al-questionnaireShowTips"></section>'
                    }
                }else{
                    _btnHtml+=' <section class="al-questionnaireUpDownBtnBox"><div class="al-questionnaireUpBtnDisable Vote ">'+(todayVote>BLv.cqEndTime?overTime:preTime)+'</div>' +
                        '<div class="al-questionnaireDownBtn Vote " style="display: '+(BLv.isShowResult==2?"block":"none")+'">查看结果</div></section><section class="al-questionnaireVoteResult"></section>' +
                        '<section class="al-questionnaireShowTips"></section>'
                }
                return _btnHtml;
            },
            doVoteResultHtml:function(vRDv){
                var _reHtmlL='',
                    _reHtmlC='',
                    resultList=vRDv.data_list,    //选项集合
                    questionContent=comm.cutstr(vRDv.questionContent,40)+"...",  //题目内容
                    totalCount=parseInt(vRDv.questionOptionCount);  //总人数
                $.each(resultList,function(a,Pv){
                    var reVoteMark=Pv.questionOption,
                        questionOptionCount=parseInt(Pv.questionOptionCount),  //选项小计
                        votePercent=Math.round(((questionOptionCount/totalCount)>0?questionOptionCount/totalCount:0)*100)+"%";
                    _reHtmlL+='<figure class="al-online_ResultContent"><span class="al-online_ResultNum">'+reVoteMark+'.选项</span><span class="al-online_ResultProcess"> ' +
                        '<span class="al-online_ResultProcessB" data-process="'+votePercent+'"></span></span><span class="al-resultPercent">'+votePercent+'</span>' +
                        '<span class="al-resultItemNum">'+questionOptionCount+'票</span></figure>';
                });
                _reHtmlC+='<div class="al-m-online_cover voteResult"><div class="al-m-viewResultBox"><div class="al-online_voteResult"><header class="al-onlineVote"><span>投票结果</span> ' +
                    '<span class="al-voteResultCloseBox"><b class="al-voteResultClose"></b></span></header><section id="al-quesScroll"><section class="al-online_voteResult_Main"><p class="al-online_voteTitle"><span class="al-online_voteTitleT"></span>' +
                    '<span class="al-online_voteTitleW">'+questionContent+'</span></p>'+_reHtmlL+'</section></section></div></div></div>';
                return _reHtmlC;
            },
            voteAction:function(ELv){
                var t=this,
                    userType=parseInt(ELv.userType);
                if(ELv.isShowResult==1){
                    $('.sp_container [data-id='+ELv.colMenuLayoutModuleId+']').find('.al-questionnaireUpBtnVoted.hide').css({"float":"none","margin":"0 auto"});
                    $('.sp_container [data-id='+ELv.colMenuLayoutModuleId+']').find('.al-questionnaireUpBtn.Vote').css({"float":"none","margin":"0 auto"});
                }else{
                    $("body").attr('id',"wrapper");
                    t.questionResult({
                        questionnaireId:ELv.questionnaireId,    //问卷Id
                        questionId:ELv.colQuestionMapList.questionId,   //题目ID
                        questionType:ELv.colQuestionMapList.questionType,  //题目类型
                        backResult:function(data){
                            if(data&&data.responseObject&&data.responseObject.responseData){
                                var voteResultData=data.responseObject.responseData;
                                var _voteResultHtml=t.doVoteResultHtml(voteResultData);
                                $('.sp_container [data-id='+ELv.colMenuLayoutModuleId+']').find('.al-questionnaireVoteResult').html(_voteResultHtml);
                                t.voteResultProcess({
                                    colMenuLayoutModuleId:ELv.colMenuLayoutModuleId
                                });
                                $('.sp_container [data-id='+ELv.colMenuLayoutModuleId+']').find('#al-quesScroll').css("overflow-y","scroll");
                            }
                        }
                    });
                }
                //选择题处理选项点击
                $('.sp_container [data-id='+ELv.colMenuLayoutModuleId+']').attr({userType:ELv.userType,customerStatusQuestionnaire:ELv.customerStatusQuestionnaire,qId:ELv.questionnaireId});
                $('.sp_container [data-id='+ELv.colMenuLayoutModuleId+']').find('.al-questionnaireSelectBtnBox').on("click",function(){
                    var outTime = $(this).parents('.isComp').attr('outTime');
                    var _usType = $(this).parents('.isComp').attr('userType');
                    var maxOpt = $(this).parents('.al-questionList').attr('data-optionmax')?parseInt($(this).parents('.al-questionList').attr('data-optionmax')):0; //最多选项
                    var checkedNum = $(this).parents('.al-questionList').find('.checked').length;   //已选项

                    var customerStatusQuestionnaire = $(this).parents('.isComp').attr('customerStatusQuestionnaire');
                    var qId = $(this).parents('.isComp').attr('qId');//问卷id
                    var hasAnsweredThis = false;    //已答过该问卷
                    if(typeof TempCache.getItem('qId')=='string'){  //本地已答问卷缓存非空
                        if(TempCache.getItem('qId').indexOf(qId)>-1){
                            hasAnsweredThis = true;
                        }
                    }
                    if(outTime){    //不在问卷时间范围内
                        return false;
                    }
                    if(maxOpt&&checkedNum>=maxOpt&&$(this).find('.checked').length==0){//最多选项
                        var tipContent="此题最多可选"+maxOpt+"项";
                        t.doShowTips({tipContent:tipContent,colMenuLayoutModuleId:ELv.colMenuLayoutModuleId});
                        return false;
                    }
                    if(_usType!=3) {
                        appjs.joinInAuthority($.toJSON({"authority":_usType}));
                        if(appjs.hasAuthority()==true){
                            $(this).parents('.isComp').find('.total_title span').html('已登录');
                            if (customerStatusQuestionnaire > 0||hasAnsweredThis) {
                                var tipContent = "您已填写过该问卷，请勿重复提交！";
                                t.doShowTips({
                                    tipContent: tipContent,
                                    colMenuLayoutModuleId: ELv.colMenuLayoutModuleId
                                });
                            }else {
                                var dataType = $(this).closest('.al-voteList').data('type'),
                                    dataRequired = $(this).closest('.al-voteList').data('require');
                                if (dataType == 1) {    //单选题
                                    $(this).closest('.al-voteList').find('.al-questionnaireSelectBtn').removeClass('checked');
                                    $(this).find('.al-questionnaireSelectBtn').addClass('checked').closest('.al-voteContent').addClass('selected');
                                } else if (dataType == 2) {
                                    $(this).find('.al-questionnaireSelectBtn').toggleClass('checked');
                                    var checkNumCount = $(this).closest('.al-voteList').find('.al-questionnaireSelectBtn.checked'),
                                        optionmin = $(this).closest('.al-voteList').data('optionmin'),
                                        optionmax = $(this).closest('.al-voteList').data('optionmax');
                                    if (checkNumCount.length >= optionmin && checkNumCount.length <= optionmax) {
                                        $(this).closest('.al-voteContent').addClass('selected');
                                    } else {
                                        $(this).closest('.al-voteContent').removeClass('selected');
                                    }
                                }
                            }
                        }
                    }else {
                        if (customerStatusQuestionnaire > 0||hasAnsweredThis) {
                            var tipContent = "您已填写过该问卷，请勿重复提交！";
                            t.doShowTips({
                                tipContent: tipContent,
                                colMenuLayoutModuleId: ELv.colMenuLayoutModuleId
                            });
                        }else {
                            var dataType = $(this).closest('.al-voteList').data('type'),
                                dataRequired = $(this).closest('.al-voteList').data('require');
                            if (dataType == 1) {    //单选题
                                $(this).closest('.al-voteList').find('.al-questionnaireSelectBtn').removeClass('checked');
                                $(this).find('.al-questionnaireSelectBtn').addClass('checked').closest('.al-voteContent').addClass('selected');
                            } else if (dataType == 2) {
                                $(this).find('.al-questionnaireSelectBtn').toggleClass('checked');
                                var checkNumCount = $(this).closest('.al-voteList').find('.al-questionnaireSelectBtn.checked'),
                                    optionmin = $(this).closest('.al-voteList').data('optionmin'),
                                    optionmax = $(this).closest('.al-voteList').data('optionmax');
                                if (checkNumCount.length >= optionmin && checkNumCount.length <= optionmax) {
                                    $(this).closest('.al-voteContent').addClass('selected');
                                } else {
                                    $(this).closest('.al-voteContent').removeClass('selected');
                                }
                            }
                        }
                    }
                });
                $('.sp_container [data-id='+ELv.colMenuLayoutModuleId+']').find('.al-questionnaireUpBtn.Vote ').on("touchstart",function(ev){
                    $(this).addClass("touched");
                    ev.preventDefault();
                }).on("touchend",function(ev){
                    $(this).removeClass("touched");
                    if(userType!==3){
                        appjs.joinInAuthority($.toJSON({"authority":userType}));
                        if(appjs.hasAuthority()==true){
                                var selectStatus=$('.sp_container [data-id='+ELv.colMenuLayoutModuleId+']').find('.al-questionnaireUpBtn.Vote ').parent().siblings('.al-voteContent');
                                if($(selectStatus).hasClass('selected')){
                                    t.doSubmitted(ELv);
                                    $('.sp_container [data-id='+ELv.colMenuLayoutModuleId+']').find('.al-questionnaireUpBtn.Vote ').closest('.al-questionnaireUpDownBtnBox').siblings('.al-voteContent').find('.al-questionnaireSelectBtn').removeClass('checked');
                                    $('.sp_container [data-id='+ELv.colMenuLayoutModuleId+']').find('.al-questionnaireUpBtn.Vote ').hide().siblings('.al-questionnaireUpBtnVoted.hide').show();
                                }else{
                                    var tipContentVote=t.quNumCheck({
                                        colMenuLayoutModuleId:ELv.colMenuLayoutModuleId,
                                        questionnaireType:ELv.questionnaireType
                                    });  //校验用户选项是否超出
                                    t.doShowTips({tipContent:tipContentVote,colMenuLayoutModuleId:ELv.colMenuLayoutModuleId});
                                }
                            }
                    }else{
                        var selectStatus=$('.sp_container [data-id='+ELv.colMenuLayoutModuleId+']').find('.al-questionnaireUpBtn.Vote ').parent().siblings('.al-voteContent');
                        if($(selectStatus).hasClass('selected')){
                            t.doSubmitted(ELv);
                            $('.sp_container [data-id='+ELv.colMenuLayoutModuleId+']').find('.al-questionnaireUpBtn.Vote ').closest('.al-questionnaireUpDownBtnBox').siblings('.al-voteContent').find('.al-questionnaireSelectBtn').removeClass('checked');
                            $('.sp_container [data-id='+ELv.colMenuLayoutModuleId+']').find('.al-questionnaireUpBtn.Vote ').hide().siblings('.al-questionnaireUpBtnVoted.hide').show();
                        }else{
                            var tipContentVote=t.quNumCheck({
                                colMenuLayoutModuleId:ELv.colMenuLayoutModuleId,
                                questionnaireType:ELv.questionnaireType
                            });  //校验用户选项是否超出
                            t.doShowTips({tipContent:tipContentVote,colMenuLayoutModuleId:ELv.colMenuLayoutModuleId});
                        }
                    }
                });
                $('.sp_container [data-id='+ELv.colMenuLayoutModuleId+']').find('.al-questionnaireDownBtn.Vote').on("touchstart",function(ev){
                    $(this).addClass("touched");
                    ev.preventDefault();
                }).on("touchend",function(ev){
                    $(this).removeClass("touched");
                    $('.sp_container [data-id='+ELv.colMenuLayoutModuleId+']').find('.al-m-online_cover.voteResult').show();
                    t.stop();
                    $($('.sp_container [data-id='+ELv.colMenuLayoutModuleId+']').find('.al-m-online_cover.voteResult')).find('.al-voteResultCloseBox').on("click",function(){
                        $(this).closest('.al-m-online_cover.voteResult').hide();
                        t.move();
                    });
                });
                t.viewBigImg(ELv);
            },
            voteResultProcess:function(vRPv){
                var voteElement=$('.sp_container [data-id='+vRPv.colMenuLayoutModuleId+']').find('.al-m-online_cover.voteResult'),
                    processWidth=$(voteElement).find('.al-online_ResultProcess').width(),
                    backProcessContent=$(voteElement).find('.al-online_ResultProcessB');
                $.each(backProcessContent,function(u,bPc){
                    var backProcessData=$(bPc).data('process'), //百分数
                        backProcessWidth=Math.round(processWidth*((backProcessData.replace("%",""))/100));  //进度width
                    $(bPc).css("width",backProcessWidth);
                });
            },
            shareAction:function(Svv){
                $('.sp_container [data-id='+Svv.colMenuLayoutModuleId+']').find('.al-questionnaireSharedBtn').on("click",function(){
                    //分享
                    var shareData=$('.sp_container [data-id='+Svv.colMenuLayoutModuleId+']').find('.al-questionnaireSharedBtn'),
                        //themeId = $('#themeId').val(),// "1480647316221";
                        shareTitle = $(shareData).data('sharetitle'),   //分享标题
                        shareUrl = $(shareData).data('sharepicurl'),    //分享图片
                        url=window.location.href.replace("/app/","/m/") + '?navText=' + $('#shareLoc').val(),
                        shareContent = $(shareData).data('sharecontent');   //分享内容
                    appjs.share($.toJSON({"url":url,
                            "imgUrl":shareUrl,
                            "sinaContent":shareContent != undefined && shareContent != "" ? shareTitle+"——"+shareContent+" 点击查看："+url : shareTitle+"——"+"汇集海量手术视频、医学文献、病例讨论、会议回放资源。医生专业互动社区。"+" 点击查看："+url,//新浪簡介
                            "qqTitle":shareTitle != undefined && shareTitle.shareTitle != "" ? shareTitle : document.title, //qq微信title,
                            "qqContent":shareContent != undefined && shareContent != "" ? shareContent : "汇集海量手术视频、医学文献、病例讨论、会议回放资源。医生专业互动社区。",//qq微信簡介
                            "messageContent":shareContent != undefined && shareContent != "" ? shareTitle+"——"+shareContent+" 点击查看："+url : shareTitle+"——"+"汇集海量手术视频、医学文献、病例讨论、会议回放资源。医生专业互动社区。"+" 点击查看："+url,//短信
                            "emailTitle":shareTitle != undefined && shareTitle.shareTitle != "" ? "（分享自：唯医）"+shareTitle+"  点击查看" : "（分享自：唯医）"+document.title+"  点击查看", //qq微信title,
                            "emailContent":shareContent != undefined && shareContent != "" ? shareContent+"查看详情"+url : "汇集海量手术视频、医学文献、病例讨论、会议回放资源。医生专业互动社区。"+"查看详情"+url//youxiang
                        })
                    );
                })
            },
            questionResult:function(Lrv){  //查看结果数据
                var customerId='',
                    checkUser=appjs.getAuthorCustomerId();
                if(checkUser==""||checkUser==undefined||checkUser==null){
                    customerId=0;
                }else{
                    customerId=appjs.getAuthorCustomerId();
                }
                var reData={
                    questionId:Lrv.questionId,
                    customerId:customerId,
                    questionType:Lrv.questionType,
                    questionnaireId:Lrv.questionnaireId,
                    isShowPeople:''
                };

                var params={paramJson: $.toJSON(reData)};
                $.ajax({
                    url : "/mcall/col/question/answer/getCQASpecialCount/",
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
            //问卷、投票选项数量校验
            quNumCheck:function(mId){
                var quElement=mId.questionnaireType==1?mId.tipElementItem:$('.sp_container [data-id='+mId.colMenuLayoutModuleId+']'),
                    tipContentVote='';
                if(mId.questionnaireType==1){
                    var isPage=mId.isPage,
                        quType=$(quElement).data('type'),
                        optionMax='',
                        optionSelected =$(quElement).find('.al-questionnaireSelectBtn.checked').length,
                        quesTextTip=isPage==1?"必填题未全部作答,请先完成!":"必填题未全部作答,请先完成再提交!";
                    if(quType==2){
                        optionMax=$(quElement).data('optionmax');
                        tipContentVote=optionSelected>optionMax?"此题最多可选"+optionMax+"项":quesTextTip;
                    }else{
                        tipContentVote=quesTextTip;
                    }
                }else{
                    var quType=$(quElement).find('.al-voteList').data('type'),
                        require=$(quElement).find('.al-voteList').data('require'),
                        optionMax='',
                        optionSelected =$(quElement).find('.al-questionnaireSelectBtn.checked').length;
                    if(quType==2){
                        optionMax=$(quElement).find('.al-voteList').data('optionmax');
                        tipContentVote=optionSelected>optionMax?"此题最多可选"+optionMax+"项":"必填题未全部作答,请先完成再提交!";
                    }else{
                        tipContentVote="必填题未全部作答,请先完成再提交!";
                    }
                }
                return tipContentVote;
            },
            //查看大图
            viewBigImg:function(obv){
                var viewPicBox=$('.sp_container [data-id='+obv.colMenuLayoutModuleId+']').find('.al-quesViewBigList'),
                    gallary='';
                $('.al-quesViewBigList').parent().addClass('ev-picList');
                $.each(viewPicBox,function(index,obj){
                    $(obj).on("click", function () {
                        var openIndex=$(this).index();
                        gallary = $(obj).picShowComment({open: openIndex});
                        return false;
                    });
                    //$(window).on("orientationchange", function () {
                    //    if ($(".pswp").size() > 0) {
                    //        gallary.updateSize();
                    //    }
                    //});
                });
            },
            stop:function(){
                $('body').addClass('al-questionnaireScroll');
                //var myScroll = new iScroll('al-quesScroll');
                //new iScroll('al-quesScroll');
            },
            move:function(){
                $('body').removeClass('al-questionnaireScroll');
            }
        };
        questionList.init();
    }
};
