/**
 * 功能描述：  我的草稿列表
 * 使用方法:
 * 注意事件：
 * 引入来源：  作用：
 *
 * Created by LiChunHui on 2016/8/22.
 */
$(function(){
    var draft={};
    //Log.createBrowse(88,'草稿页');
    draft={
        path:{
            draftList:M_CALL+'customer/draft/getCustomerDraftList/'
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
            this.cid=TempCache.getItem("userId")||"";
            TempCache.setItem('readDraftTime',comm.date.local_time());    //cookie记录上次查看赞的时间
            this.getDraft();
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
        //配置参数
        getParam:function(){
            var data={};
            data.attUseFlag=3;
            data.sortType=1;
            data.useFlag=UseFlag.c;
            data.pageIndex=1;
            data.pageSize=this.config.pageSize;
            return data;
        },
        //获取列表
        getDraft:function(){
            var t=this;
            comm.loading.show();
            $.ajax({
                type : "post",
                url : t.path.draftList,
                data : t.getParam(),
                dataType : "json",
                success : function(rep){
                    comm.loading.hide();
                    if(rep&&rep.responseObject.responseData&&rep.responseObject.responseData.data_list){
                        if(rep.responseObject.responseData.data_list.length>0){
                            var list=rep.responseObject.responseData.data_list;
                            var html=t.getDraftHtml(list);
                            $(".ev-draftBox section").append(html);
                            $(".ev-draftBox .al-recordList a").off('click').on('click',function(){
                                if($(this).attr('href')=="javascript:;"){
                                    var refId = $(this).attr('data-caseId');
                                    t.releaseData(refId);
                                }
                            });
                            /*if(list.length< t.config.pageSize){
                             $(".ev-browseRecordBox").attr("scrollPagination", "disabled");
                             }*/
                            t.scrollPage();
                        }else{
                            $(".ev-noDraft").show();
                            $(".ev-draftBox").hide();
                        }
                    }else{
                        $(".ev-noDraft").show();
                        $(".ev-draftBox").hide();
                    }
                },
                error:function(){}
            });
        },
        //瀑布流
        scrollPage: function () {
            var t = this;
            var num=2;
            $(".ev-draftBox").off("scroll").scrollPagination({
                'contentPage': t.path.draftList,
                'noParamJson':1,
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
                        $(".ev-draftBox").attr("scrollPagination", "disabled");
                        return false;
                    } else {
                        if ($.isEmptyObject(data.responseObject.responseData) || (data.responseObject.responseData.data_list && data.responseObject.responseData.data_list.length == 0)) {
                            $(".ev-draftBox").attr("scrollPagination", "disabled");
                            return false;
                        } else {
                            var result = data.responseObject.responseData.data_list;
                            var html=t.getDraftHtml(result);
                            $(".ev-draftBox section").append(html);
                            $(".ev-draftBox .al-recordList a").off('click').on('click',function(){
                                if($(this).attr('href')=="javascript:;"){
                                    var refId = $(this).attr('data-caseId');
                                    t.releaseData(refId);
                                }
                            });
                        }
                    }
                }
            });

        },
        //草稿列表的dom
        getDraftHtml:function(data){
            var html="";var caseId ="";
            $.each(data,function(i,val){
                title="";time="";type="";
                switch (val.refType){
                    case 7://病例
                        type="病例";
                        if(htmlToString(val.case_baseinfo.caseName)){
                            title=htmlToString(comm.getStrLen(val.case_baseinfo.caseName,70));
                        }else if(htmlToString(val.case_baseinfo.mainNarrate)){
                            var sexId=val.case_baseinfo.sexId;
                            var sex="";
                            var age="";
                            var massage="";
                            if(sexId==1){
                                sex="男";
                            }else if(sexId==2){
                                sex="女";
                            }
                            if(val.case_baseinfo.age){
                                age=val.case_baseinfo.age+"岁 ";
                            }
                            if(sex||age){
                                massage="患者信息:"+sex+age;
                            }
                            var content=massage+"主诉:"+htmlToString(val.case_baseinfo.mainNarrate);
                            title=comm.getStrLen(content,70);
                        }else{
                            title="【影像】";
                        }
                        publishTime=val.last_update_time?val.last_update_time:val.case_baseinfo.publishTime;
                        time=publishTime.substring(0,10);
                        // url="/pages/case/case_upload.html?caseId="+val.case_baseinfo.caseId+"&draft=1";
                        url="javascript:;";
                        caseId = val.case_baseinfo.caseId;
                        break;
                    case 4://话题
                        type="话题";
                        title=htmlToString(comm.getStrLen(val.cms_topic.topicName,70));
                        publishTime=val.last_update_time?val.last_update_time:val.cms_topic.publishTime;
                        time=publishTime.substring(0,10);
                        url="/pages/topic/topic_upload.html?topicId="+val.cms_topic.topicId+"&draft=1";
                        break;
                    case 8://评论
                        type="评论";
                        if(htmlToString(val.customer_review.reviewContent)){
                            var content=val.customer_review.reviewContent.replace(/<a/g,"<p style='display:inline-block'").replace(/a>/g,"p>");
                            title=htmlToString(comm.getStrLen(content,70));
                        }else{
                            title="【影像】";
                        }
                        publishTime=val.last_update_time?val.last_update_time:val.customer_review.publishTime;
                        time=publishTime.substring(0,10);
                        url="/pages/common/comment.html?id="+val.customer_review.id+"&draft=1";
                        break;
                }
                html+='<a href="'+url+'" data-caseId="'+caseId+'"><article class="al-recordListItem">'+
                '<span class="al-recordListItemType">'+type+'</span>'+
                '<article>'+
                '<span class="al-recordListItemContent">'+title+'</span>'+
                '<p class="al-recordListItemTime">'+time+'</p>'+
                '</article>'+
                '</article></a>';
            });
            return html;
        },
        releaseData:function(refId){
            var t = this;
            var amChannel = comm.getpara()._amChannel;
            comm.newReleaseBox({
                imgPath:"/images/img50/case/release.png",
                title:"编辑病例需使用唯医骨科App",
                solidBtnTitile:"立即使用",
                authNoneTitle:"暂不编辑",
                data:{
                    el: ".solidBtn",
                    ios: "allinmdios://app.allinmd.cn/applinks.html?scene=11&type=52&sourceId="+refId+"&userId="+t.cid+"&tplPath=0" +(amChannel?"&_amChannel="+amChannel:''),
                    ios9: "http://app.allinmd.cn/applinks.html?scene=11&type=52&sourceId="+refId+"&userId="+t.cid+"&tplPath=0" +(amChannel?"&_amChannel="+amChannel:''),
                    android: "allin://com.allin.social:75235?data={scene:11,type:52,sourceId:"+refId+",userId:"+t.cid+",tplPath:0"+ (amChannel?",_amChannel:"+amChannel:'')+ "}",
                }
            });
        }
    };

    draft.init();
})
