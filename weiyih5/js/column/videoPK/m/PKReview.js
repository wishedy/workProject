/**
 * 功能描述： 专家审核
 * 使用方法:
 * 注意事件：
 * 引入来源：  作用：
 *
 * Created by LiChunHui on 2016/1/21.
 */
$(function(){
    var PKAudit={
        path:{
            getActivityId:"/mcall/cms/activity/getActivityMapList/",
            getReview:"/mcall/activity/api/getCustomerReviewResource/"
        },
        init:function(){
            this.resourceStatus=1;
            this.refType=1;//1：视频 7：病例
            this.browser=browser.versions;

            this.getActId();
            this.query();
            this.bindOrders();
            this.tabChange();
            var t=this;
            /**
             * 处理点击事件
             */
            $(".prod_list").on("vclick",'.list_con',function () {
                var resourceId=$(this).attr("resourceId");
                if (t.refType==1) {//视频
                    appjs.gotoVideoDetail($.toJSON({"resourceId":resourceId,"videoName":$(this).attr("resourceName")}))
                }else{
                    appjs.gotoCaseDetail($.toJSON({resourceId:resourceId}))
                }
                return false;
            });
        },
        //获取活动id
        getActId:function(){
            var t=this;
            $.ajax({
                type : "post",
                url : t.path.getActivityId,
                data : {},
                async:false,
                dataType : "json",
                success : function(rep){
                    if(rep&&rep.responseObject&&rep.responseObject.responseData){
                        if(rep.responseObject.responseData.list&&rep.responseObject.responseData.list.length>0){
                            t.activityId=rep.responseObject.responseData.list[0].activityId;
                        }

                    }
                },
                error:function(){}
            });
        },
        //类型点击切换
        tabChange:function(){
            var t=this;
            $(".tab_btnEV a").each(function(i,em){
                $(em).on("vclick",function(){
                    $(".tab_btnEV a").removeClass("cur");
                    $(this).addClass("cur");
                    t.refType=$(em).attr("type");
                    t.query();
                })
            })
        },
        // 排序绑定
        bindOrders: function () {
            var t = this;
            // 展开与隐藏
            $(".casePK_r").on("vclick",function(){
                if($(this).attr("on")=="true"){
                    $(this).attr("on","false");
                    $(".casePK_rList").hide();
                }else{
                    $(this).attr("on","true");
                    $(".casePK_rList").show();
                }
                return false;
            })

            // 点击排序绑定
            $(".casePK_rList li").on("vclick", function () {
                $(".casePK_rList li").removeClass("cur");
                $(this).addClass("cur");
                $(".casePK_r").attr("on","false");
                $(".casePK_rList").hide();
                var n = $(this).index();
                switch(n){
                    case 0:
                        t.resourceStatus ="1";
                        $(".work_title").text("待审作品");
                        break;
                    case 1:
                        t.resourceStatus="2";
                        $(".work_title").text("已审作品");
                        break;
                };
                t.query();
                return false;
            });
        },
        createHtml: function (data) {
            var t = this;
            var html = "";
            $(data).each(function (i, n) {

                var imgUrl = n.attachmentInfo.attachmentUrl?n.attachmentInfo.attachmentUrl:"//img50.allinmd.cn/default_list_225_150.jpg";
                var pageUrl = n.resourceInfo.pageStoragePath;
                var id= n.resourceInfo.refId;
                var refName = n.resourceInfo.refName.length > 22 ? n.resourceInfo.refName.substring(0, 22) + '...' : n.resourceInfo.refName;
                var refAuthor = n.resourceInfo.refAuthor;
                var time="";
                var propertName= n.propertyInfo.propertName;//.length > 28 ? n.propertyInfo.propertName.substring(0, 28) + '...' : n.propertyInfo.propertName;
                if(t.refType==1){
                    time='<p>'+n.resourceInfo.playTime+'</p>';
                }
                var score="";
                if(t.resourceStatus==2){
                    score='<div class="casePK_score casePK_review"><span>'+n.resourceInfo.score+'</span>分</div>';
                }
                html += '<div class="list_con" resourceId="'+id+'" resourceName="'+n.resourceInfo.refName+'">'+
                '<div class="list_z">'+
                '<a href="javascript:;" target="_blank">' +
                '<img src="'+imgUrl+'" alt="" width="100%;">'+
                time+
                ' </a>'+
                '</div>'+
                '<div class="list_y">'+
                '<a href="javascript:;" target="_blank">'+
                '<h5 class="bt">'+refName+'</h5>'+
                '</a>'+
                '<div class="casePK_info">'+
                '<ul>'+
                    '<li class="casePK_author_i">'+refAuthor+'</li>'+
                    '<li></li>'+
                    ' <div class="clear"></div>'+
                    '</ul>'+
                score+
                '<div class="casePK_txt">术式：'+propertName+'</div>'+
                '</div>'+
                '</div>'+
                '</div>';
            });
            return html;
        },
        query: function () {
            var t = this;
            $.mobile.loading().show();
            var data = {pageIndex: 1, pageSize: 10};
            data.activityId=t.activityId, //活动编号
            data.resourceStatus=t.resourceStatus,//审核状态 (1.待审核 2.已审核)
            data.customerId=appjs.getAuthorCustomerId();//"1448615798782",//专家ID
            data.useFlag= "3",//PC标识
            data.attUseFlag= "8",//PC标识
            data.refType=t.refType//资源类型(1.视频 7.病例) 注:可以不填写,显示所有
            t.data = data;

            $.ajax({
                url: t.path.getReview,
                data: {paramJson:$.toJSON(data)},
                type: "post",
                dataType: "json",
                success: function (data) {
                    $.mobile.loading().hide();
                    $(".prod_list").html("");
                    scrollpage = 2;
                    if (data && data.responseObject.responseStatus && data.responseObject.responseData && data.responseObject.responseData.pageMap) {
                        $(".work_num").text("（"+data.responseObject.responseData.pageMap.total+"）");
                        var result = data.responseObject.responseData.pageMap.items;
                        if (result.length) {

                            var html = t.createHtml(result);
                            $(".prod_list").html(html).show();

                            //瀑布流
                            (function () {
                                $(".prod_list").scrollPagination({
                                    'contentPage': t.path.getReview,
                                    'noParamJson': 0,
                                    'contentData': $.extend(t.data, {
                                            pageIndex: function () {
                                                return scrollpage++;
                                            }
                                     }),
                                    'scrollTarget': $(window),
                                    'heightOffset': 0,
                                    'delaytime': 1000,
                                    type: "post",
                                    'beforeLoad': function () {
                                        $.mobile.loading().show();
                                    },
                                    'afterLoad': function (elementsLoaded) {
                                        $.mobile.loading().hide();
                                    },
                                    'loader': function (data) {
                                        if ($.isEmptyObject(data.responseObject.responseData.pageMap.items)) {
                                            $(".prod_list").attr('scrollPagination', 'disabled');
                                            //alert("没有内容了");
                                            return false;
                                        } else {
                                            var result = data.responseObject.responseData.pageMap.items;
                                            var html = t.createHtml(result);
                                            $(".prod_list").append(html).show();

                                        }
                                    }
                                });
                            })();
                        } else {
                            t.emptyResult = true;
                            $(".noResult").show();
                            $(".prod_list").hide();
                        }


                    } else {
                        $(".noResult").show();
                        $(".prod_list").attr('scrollPagination', 'disabled').hide();
                        return false;
                    }
                },
                error: function () {
                    $(".none").show();
                    $(".prod_list").attr('scrollPagination', 'disabled');
                    //alert("没有内容了");
                    return false;
                }
            });

            $.mobile.loading("hide");

        }
    };
    PKAudit.init();
})
