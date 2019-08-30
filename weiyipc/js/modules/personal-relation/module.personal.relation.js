/**
 * 功能描述：  个人中心包括他人（收藏列表，）
 * 使用方法:
 * 注意事件：
 * 引入来源：  <script src="/js/modules/resource-list-template/module.resource-list-template.js"></script>
 * 作用：
 *
 * Created by LiChunHui on 2016/7/28.
 */
module.personalRelation=function(Obj){
    var controller={
        path:{
            collection : PC_CALL+"customer/trends/json_list/",//收藏
            collectionD: PC_CALL + "collection/create/",//取消收藏
            docC: PC_CALL + "customer/doc/delete/",//文库删除
            videoC: PC_CALL + "customer/video/delete/",//视频删除
            cazeC: PC_CALL + "case_baseinfo/delete/",//病例删除
            topicC: PC_CALL + "topic/baseinfo/delete/" //话题删除
        },
        config:{
            pageSize:20,
            defaultImg:"//img10.allinmd.cn/default/loading/225_150.jpg"
        },
        init:function(Obj){
            var t = this;
            t.options={};
            var o={};
            t.options= $.extend(o,Obj);
            this.collectionFn();
        },
        getParam:function(pageIndex){
            var t =this;
            var data={};
            var params={};
            data.pageIndex=pageIndex;//第几页
            data.pageSize= t.options.pageSize;//每一页的数量
            data.scene=Scene.b;
            data.logoUseFlag=3;
            data.attUseFlag=AttUseFlag.c;
            data.dataFlag=8;
            data.customerId=t.options.customerId;
            data.isCollection=1;
            data.sessionCustomerId=$("#sesCustomerId").val();
            params.paramJson = $.toJSON(data);
            return params;
        },
        collectionFn:function(){
            var t=this;
            $.ajax({
                type : "post",
                url : t.path.collection,
                data : t.getParam(1),
                dataType : "json",
                success : function(rep){
                    if(rep&&rep.responseObject.responseData){
                        t.getHtml(rep.responseObject.responseData);
                        if(t.options.pager){//需要有分页
                            t.options.pagination.pager({pagenumber:1, pagecount: pagecount, buttonClickCallback: PageClick});
                        }
                    }else{
                    }
                },
                error:function(){}
            });
            if(t.options.pager){//需要有分页
                PageClick = function(pageclickednumber){
                    $.ajax({
                        type : "post",
                        url : t.path.collection,
                        data : t.getParam(pageclickednumber),
                        dataType : "json",
                        success : function(rep){
                            if(rep&&rep.responseObject.responseData){
                                t.getHtml(rep.responseObject.responseData);
                                t.options.pagination.pager({ pagenumber: pageclickednumber, pagecount: pagecount, buttonClickCallback: PageClick });
                            }
                        },
                        error:function(){}
                    });
                };
            }

        },
        getHtml:function(data){
            var t=this;
            if(data.data_list&&data.data_list.length>0){
                var html="";
                $.each(data.data_list,function(i,val){
                    trends=val.customer_trends;
                    username=val.customer_auth.lastName+val.customer_auth.firstName;
                    pic="";
                    switch (val.customer_trends_type){
                        case 1:
                            pic=val.cms_video_attachment.length>0?val.cms_video_attachment[0].videoAttUrl:t.config.defaultImg;
                            break;
                        case 2:
                            pic=val.cms_doc_attachment.length>0?val.cms_doc_attachment[0].docAttUrl:t.config.defaultImg;
                            break;
                        case 4:
                            pic=val.cms_topic_attachment.length>0?val.cms_topic_attachment[0].topicAttUrl: t.config.defaultImg;
                            break;
                        case 7:
                            pic=val.case_attachment_list.length>0?val.cms_case_attachment[0].caseAttUrl: t.config.defaultImg;
                            break;
                        default :
                            pic="";
                            break;
                    }
                    playNum=val.resource_valid?val.resource_valid.playTime:'';
                    if(val.customer_trends_type!==8){
                        html+=module.resourceListTemplate({tempName : "resource"})({
                            resType:val.customer_trends_type,//资源类型传数字  1-视频，2-文库，3-会议，4-话题 ,7-病例,
                            resId:trends.resourceId,//资源id
                            resName:trends.resourceName,//标题
                            resContent:trends.trendContent,//内容
                            userName:username==''?'唯医小编':username,//作者
                            reviewNum:trends.reviewNum,//观看数
                            resPic:pic,//缩略图
                            playNum:playNum,//视频的时长   有值才传
                            resUrl:trends.resourceUrl//资源链接
                        });
                    }
                })
                t.options.container.html(html);
            }else{
                t.options.error();
            }

        }
    };
    controller.init(Obj);
};
