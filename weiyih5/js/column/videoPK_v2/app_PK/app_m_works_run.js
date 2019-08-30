
/**
 * 功能描述：  PK参赛作品
 * 使用方法:
 * 注意事件：
 * 引入来源：  作用：
 *
 * Created by LiChunHui on 2016/1/20.
 */
$(function(){
    shareBackUrl = 'http://m.allinmd.cn/html/m/activity/'+$("#activityId").val()+'/personal_works.html?activityId='+$("#activityId").val();
    var PKWork={
        path:{
            getTagList:"/mcall/activity/property/getMapList/",
            getList:"/mcall/activity/resourcesList/search_list_activty/"
        },
        init:function(){
            var t = this;
            this.videoPro=[];
            this.casePro=[];
            this.mediaType="video";
            this.order="publishTime";
            this.activityType=1;
            this.browser=browser.versions;
            this.activityId=$("#activityId").val();
            this.getTags();
            this.query();
            this.bindOrders();
            this.bindMenu();
            this.searchVideo();

        },
        //解析分享链接参数对
        getInitPara:function(){
            this.para=comm.getparaNew();
            if(this.para.propertyIds || this.para.order){
                this.propertyIds=this.para.propertyIds;
                this.order=this.para.sortIds;
                var propertyIdss=this.para.propertyIds;
                var orders = this.para.sortIds;
                var vall=$(".allWorks_select li[tagid="+propertyIdss+"]").text();
                var valll=$(".sortList div[sortId="+orders+"]").text();
                $('.allWorks').text(vall);
                $('.worksSort span').text(valll);
                this.query();
            }else{
                this.query();
            }

        },
        //获取不同参赛类型下的专业
        getTags:function(){
            var t=this;
            $.ajax({
                type : "post",
                url : t.path.getTagList,
                data : {paramJson:$.toJSON({activityId:t.activityId,activityType:t.activityType,parentId:0})},
                dataType : "json",
                async:"false",
                success : function(data){
                    var vPktags='<li class="col_change">全部</li>';
                    if(data&&data.responseObject.responseData){
                        var data=data.responseObject.responseData;
                        if(t.activityType==1){//video
                            t.videoPro=data.list;
                        }else{//case
                            t.casePro=data.list;
                        }
                        if(data.list&&data.list.length>0){
                            for(var vt=0,vtl=data.list.length;vt<vtl;vt++){
                                var item=data.list[vt];
                                var isExistResource=item.cms_activity_property.isExistResource;
                                if(item.cms_activity_property.parentId===0){
                                    if (isExistResource==1){
                                        vPktags+='<li tagId="'+item.cms_activity_property.propertyId+'">'+item.cms_activity_property.propertyName +'</li>';
                                    }
                                }
                            }
                        }
                        $('.allWorks_select ul').html(vPktags);
                        t.tagClick();
                        t.getInitPara();
                    }
                }
            });
        },
        //  下拉菜单绑定
        bindMenu: function () {
            var t = this;
                $('.allWorks').on("click",function(){
                    if($(this).attr("on")=="true"){
                        $(this).attr("on","false");
                        $(this).css({
                            "background":"url(/images/img50/column/videoPK_v2/works_xiajiao.png) no-repeat right center",
                            "background-size":"0.12rem 0.06rem",
                            "color":"#909090"
                        });
                        $(".allWorks_select").hide();
                        $(".run_main_cont_piece_box").attr("scrollpagination","enabled");
                        $('#zhezhao_mask').hide();
                        $('body').css('overflow','visible');
                    }else{
                        $(this).attr("on","true");
                        $(this).css({
                            "background":"url(/images/img50/column/videoPK_v2/works_xiaojiao_blue.png) no-repeat right center",
                            "background-size":"0.12rem 0.06rem",
                            "color":"#2899e6"
                        });
                        $(".worksSort").css({
                            "background":"url(/images/img50/column/videoPK_v2/works_sort_gray.png) no-repeat right center",
                            "background-size":"0.12rem 0.22rem",
                            "color":"#909090"
                        });
                        $(".allWorks_select").show();
                        $(".run_main_cont_piece_box").attr("scrollpagination","disabled");
                    }
                    if($(".worksSort").attr("on")=="true"){
                        $(".worksSort").attr("on","false");
                        $(".sortList").hide();
                    }
                })
        },
        //专业点击
        tagClick:function(){
            var t=this;
            $(".allWorks_select ul li").on("click",function(){
                if(!$(this).hasClass("col_change")){
                    $(".allWorks_select ul li").removeClass("col_change");
                    $(this).addClass("col_change");
                    $(".allWorks").text($(this).text());
                    $(".allWorks").attr("on","false");
                    $(".allWorks_select").hide();
                    $(".run_main_cont_piece_box").attr("scrollpagination","enabled");
                    t.propertyIds=$(this).attr("tagid");
                    shareBackUrl = 'http://m.allinmd.cn/html/m/activity/'+$("#activityId").val()+'/personal_works.html?activityId='+$("#activityId").val()+'&sortIds='+t.order+'&propertyIds='+t.propertyIds;
                    t.query();
                    return false;
                }
            })
        },
        // 排序绑定
        bindOrders: function () {
            var t = this;
            // 展开与隐藏
            $(".worksSort").on("click",function(){
                if($(this).attr("on")=="true"){
                    $(this).attr("on","false");
                    $(".sortList").hide();
                }else{
                    $(this).attr("on","true");
                    $(".sortList").show();
                }
                if($(".allWorks").attr("on")=="true"){
                    $(".allWorks").attr("on","false");
                    $(".allWorks_select").hide();
                }
                return false;
            });
            // 点击排序绑定
            $(".sortList div").on("click", function () {
                $(".sortList div").removeClass("col_change");
                $(this).addClass("col_change");
                $(".worksSort span").text($(this).text())
                $(".worksSort").attr("on","false");
                $(".worksSort").css({
                    "background":"url(/images/img50/column/videoPK_v2/works_sort_blue.png) no-repeat right center",
                    "background-size":"0.12rem 0.22rem",
                    "color":"#2899e6"
                });
                $(".sortList").hide();
                var n = $(this).index();
                switch(n){
                    case 0:
                        t.order ="publishTime";
                        shareBackUrl = 'http://m.allinmd.cn/html/m/activity/'+$("#activityId").val()+'/personal_works.html?activityId='+$("#activityId").val()+'&sortIds='+t.order+'&propertyIds='+t.propertyIds;
                        break;
                    case 1:
                        t.order="browse";
                        shareBackUrl = 'http://m.allinmd.cn/html/m/activity/'+$("#activityId").val()+'/personal_works.html?activityId='+$("#activityId").val()+'&sortIds='+t.order+'&propertyIds='+t.propertyIds;
                        break;
                    case 2:
                        t.order = "preferUpNum";
                        shareBackUrl = 'http://m.allinmd.cn/html/m/activity/'+$("#activityId").val()+'/personal_works.html?activityId='+$("#activityId").val()+'&sortIds='+t.order+'&propertyIds='+t.propertyIds;
                        break;
                }
                t.query();
                return false;
            });
        },
        createHtml: function (data) {
            var t = this;
            var html = "";
            $(data.rows.items).each(function (i, n) {
                var imgList;
                var imgUrl ="";
                var pageUrl = n.toWebUrl;
                var id= n.id;
                var isPrefer= n.isPrefer;
                var refName = n.title.length > 23 ? n.title.substring(0, 25) + '...' : n.title;
                var refAuthor = n.author.length>3?n.author.substring(0,3)+'...':n.author;
                var company=$.isEmptyObject(n.company)?'':(n.company.length>8?n.company.substring(0,8)+'...':n.company);
                var time="";
                if(t.activityType==1){
                    time='<span>'+n.playTime+'</span>';
                    imgList=data.videoAttList?data.videoAttList:[];
                    $.each(imgList,function(j,val){
                        if(val.videoId==n.id){
                            imgUrl=val.videoAttUrl;
                            return;
                        }
                    });
                }else{
                    imgList=data.caseAttList?data.caseAttList:[];
                    $.each(imgList,function(j,val){
                        if(val.caseId==n.id){
                            imgUrl=val.caseAttUrl;
                            return;
                        }
                    });
                }

                var browseNum=n.browse;//资源浏览数
                var reviewNum=n.reviewNum;//评论数
                var upNum=n.upNumNew||n.upNum;//点赞数
                var pubTime = n.publishTime.split(' ')[0];
               html += '<section class="run_main_cont_piece">'+
                    '<section class="run_main_cont_piece_center">'+
                    '<section class="run_main_cont_piece_center_left left">'+
                    '<a style="display:block;" target="_blank" href="javascript:;" resourceId="'+id+'" resourceName="'+n.title+'" class="appZDtitle"><h3>'+refName+'</h3></a>'+
                    '<ul>'+
                    '<li class="casePK_play_i">'+browseNum.toWK()+'</li>'+
                    '<li class="casePK_comment_i">'+reviewNum.toWK()+'</li>'+
                    '<li class="casePK_support_i">'+upNum.toWK()+'</li>'+
                    '<div class="clearfix"></div>'+
                    '</ul>'+
                    '<dl>'+
                    '<dd>'+refAuthor+'</dd>'+
                    '<dd style="width:2.3rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">'+company+'</dd>'+
                    '<dd style="margin-right:0;"><a href="javascript:;" class="assist '+(isPrefer==0?"assist_Def":"assist_Win")+'" resourceId="'+id+'" isPrefer="'+isPrefer+'">'+(isPrefer==0?"点赞":"已赞")+'</a></dd>'+
                    '<div class="clearfix"></div>'+
                    '</dl>'+
                    '</section>'+
                    '<section class="run_main_cont_piece_center_right right">'+
                    '<div class="videoImgBox">'+
                    '<a style="display:block;" target="_blank" href="javascript:;" resourceId="'+id+'" resourceName="'+n.title+'" class="appZDimg"><img src="'+(imgUrl?imgUrl:'/images/img50/225_150.jpg')+'"></a>'+
                    '<span>'+time+'</span>'+
                    '<img class="videoBtn" src="/images/img50/column/videoPK_v2/video_btn.png" />'+
                    '</div>'+
                    '<div class="up_time">'+pubTime+'</div>'+
                    '</section>'+
                    '<section class="zhezhao_dianzanSuc">点赞成功</section>'+
                    '<section class="zhezhao_dianzanDef">取消点赞成功</section>'+
                    '<div class="clearfix"></div>'+
                    '</section>'+
                    '</section>'
            });
            return html;
        },
        query: function () {
            var t = this;
            comm.loading.show();
            var data = {pageIndex: 1, pageSize: 10};
            data.mediaType=t.mediaType;
            data.order=t.order;
            data.activityIds=t.activityId;
            data.sessionCustomerId=appjs.getAuthorCustomerId();
            if(t.propertyIds){
                data.propertyIds=t.propertyIds;
            }
            t.data = data;

            $.ajax({
                url: t.path.getList,
                data: {paramJson:$.toJSON(data)},
                type: "post",
                dataType: "json",
                success: function (data) {
                    comm.loading.hide();
                    $(".run_main_cont_piece_box").html("");
                    scrollpage = 2;
                    if (data && data.dataJson && data.dataJson.rows) {
                        var result = data.dataJson;
                        $(".worksNum").text(data.dataJson.rows.total);
                        if (data.dataJson.rows.items.length>0) {
                            t.emptyResult=false;
                            var html = t.createHtml(result);
                            $(".run_main_cont_piece_box").html(html).show();
                            $('.assist').off("click").bind("click",function(){
                                appjs.praise();
                                var refId=$(this).attr("resourceId");
                                var isPrefer=$(this).attr("isPrefer");
                                var _that = $(this);
                                if(appjs.getPraise()==true){
                                    if($(this).hasClass("assist_Def")){
                                        t.dianZan(refId,isPrefer);
                                        $(this).removeClass("assist_Def").addClass("assist_Win").html("已赞");
                                        var asNum = $(this).parents('.run_main_cont_piece_center_left').find('.casePK_support_i');
                                        var asNumA = parseInt(asNum.text())+1;
                                        asNum.text(asNumA);
                                        $(this).parents('.run_main_cont_piece_center').find('.zhezhao_dianzanSuc').show().siblings('.zhezhao_dianzanDef').hide();
                                        setTimeout(function(){ _that.parents('.run_main_cont_piece_center').find('.zhezhao_dianzanSuc').hide()},3000);
                                    }else{
                                        if($(this).hasClass("assist_Win")){
                                            t.clearZan(refId,isPrefer);
                                            $(this).removeClass("assist_Win").addClass("assist_Def").html("点赞");
                                            var asNum = $(this).parents('.run_main_cont_piece_center_left').find('.casePK_support_i');
                                            var asNumC = parseInt(asNum.text())-1;
                                            asNum.text(asNumC);
                                            $(this).parents('.run_main_cont_piece_center').find('.zhezhao_dianzanDef').show().siblings('.zhezhao_dianzanSuc').hide();
                                            setTimeout(function(){ _that.parents('.run_main_cont_piece_center').find('.zhezhao_dianzanDef').hide()},3000);
                                        }
                                    }
                                }
                            });
                            /**
                             * 处理点击事件
                             */
                            $(".appZDtitle").on("click",function(){
                                var resourceId=$(this).attr("resourceId");
                                if(resourceId){
                                    appjs.gotoVideoDetail($.toJSON({"resourceId":resourceId,"videoName":$(this).attr("resourceName")}))
                                }
                            });
                            $(".appZDimg").on("click",function(){
                                var resourceId=$(this).attr("resourceId");
                                if(resourceId){
                                    appjs.gotoVideoDetail($.toJSON({"resourceId":resourceId,"videoName":$(this).attr("resourceName")}))
                                }
                            });
                            //瀑布流
                            $(function () {
                                $(".run_main_cont_piece_box").scrollPagination({
                                    'contentPage': t.path.getList,
                                    'noParamJson': 0,
                                    'contentData': $.extend(t.data, {
                                        pageIndex: function () {
                                            return scrollpage++
                                        }
                                    }),
                                    'scrollTarget': $(window),
                                    'heightOffset': 0,
                                    'delaytime': 1000,
                                    type: "post",
                                    'beforeLoad': function () {
                                        comm.loading.show();
                                    },
                                    'afterLoad': function (elementsLoaded) {
                                        comm.loading.hide();
                                    },
                                    'loader': function (data) {
                                        if(t.emptyResult){
                                            return false;
                                        }
                                        if (data && data.dataJson && data.dataJson.rows && data.dataJson.rows.items.length>0) {
                                            var result = data.dataJson;
                                            var html = t.createHtml(result);
                                            $(".run_main_cont_piece_box").append(html).show();
                                            $('.assist').off("click").bind("click",function(){
                                                appjs.praise();
                                                var refId=$(this).attr("resourceId");
                                                var isPrefer=$(this).attr("isPrefer");
                                                var _that = $(this);
                                                if(appjs.getPraise()==true){
                                                    if($(this).hasClass("assist_Def")){
                                                        t.dianZan(refId,isPrefer);
                                                        $(this).removeClass("assist_Def").addClass("assist_Win").html("已赞");
                                                        var asNum = $(this).parents('.run_main_cont_piece_center_left').find('.casePK_support_i');
                                                        var asNumA = parseInt(asNum.text())+1;
                                                        asNum.text(asNumA);
                                                        $(this).parents('.run_main_cont_piece_center').find('.zhezhao_dianzanSuc').show().siblings('.zhezhao_dianzanDef').hide();
                                                        setTimeout(function(){ _that.parents('.run_main_cont_piece_center').find('.zhezhao_dianzanSuc').hide()},3000);
                                                    }else{
                                                        if($(this).hasClass("assist_Win")){
                                                            t.clearZan(refId,isPrefer);
                                                            $(this).removeClass("assist_Win").addClass("assist_Def").html("点赞");
                                                            var asNum = $(this).parents('.run_main_cont_piece_center_left').find('.casePK_support_i');
                                                            var asNumC = parseInt(asNum.text())-1;
                                                            asNum.text(asNumC);
                                                            $(this).parents('.run_main_cont_piece_center').find('.zhezhao_dianzanDef').show().siblings('.zhezhao_dianzanSuc').hide();
                                                            setTimeout(function(){ _that.parents('.run_main_cont_piece_center').find('.zhezhao_dianzanDef').hide()},3000);
                                                        }
                                                    }
                                                }
                                            });
                                            /**
                                             * 处理点击事件
                                             */
                                            $(".appZDtitle").on("click",function(){
                                                var resourceId=$(this).attr("resourceId");
                                                if(resourceId){
                                                    appjs.gotoVideoDetail($.toJSON({"resourceId":resourceId,"videoName":$(this).attr("resourceName")}))
                                                }
                                            })
                                            $(".appZDimg").on("click",function(){
                                                var resourceId=$(this).attr("resourceId");
                                                if(resourceId){
                                                    appjs.gotoVideoDetail($.toJSON({"resourceId":resourceId,"videoName":$(this).attr("resourceName")}))
                                                }
                                            })
                                        } else {
                                            $(".run_main_cont_piece_box").attr('scrollPagination', 'disabled');
                                            //alert("没有内容了");
                                            return false;
                                        }
                                    }
                                });
                            });
                        } else {
                            t.emptyResult = true;
                            //$(".noMore").show();
                            $(".run_main_cont_piece_box").attr('scrollPagination', 'disabled').hide();
                            return false;
                        }


                    } else {
                        //$(".noMore").show();
                        $(".run_main_cont_piece_box").attr('scrollPagination', 'disabled').hide();
                        return false;
                    }
                },
                error: function () {
                    //$(".nowork").show();
                    $(".run_main_cont_piece_box").attr('scrollPagination', 'disabled');
                    return false;
                }
            });

            comm.loading.hide();


        },

        querySearch: function (search) {
            var t = this;
            comm.loading.show();
            var data = {pageIndex: 1, pageSize: 10};
            data.mediaType=t.mediaType;
            data.order=t.order;
            data.author= search;
            data.activityIds=t.activityId;
            if(t.propertyIds){
                data.propertyIds=t.propertyIds;
            }
            t.data = data;
            $.ajax({
                url: t.path.getList,
                data: {paramJson:$.toJSON(data)},
                type: "post",
                dataType: "json",
                success: function (data) {
                    comm.loading.hide();
                    $(".run_main_cont_piece_box").html("");
                    scrollpage = 2;
                    if (data && data.dataJson && data.dataJson.rows) {
                        var result = data.dataJson;
                        $(".worksNum").text(data.dataJson.rows.total);
                        if (data.dataJson.rows.items.length>0) {
                            t.emptyResult=false;
                            var html = t.createHtml(result);
                            $(".run_main_cont_piece_box").html(html).show();
                            $('.run_main_search').show();
                            $('.assist').off("click").bind("click",function(){
                                appjs.praise();
                                var refId=$(this).attr("resourceId");
                                var isPrefer=$(this).attr("isPrefer");
                                var _that = $(this);
                                if(appjs.getPraise()==true){
                                    if($(this).hasClass("assist_Def")){
                                        t.dianZan(refId,isPrefer);
                                        $(this).removeClass("assist_Def").addClass("assist_Win").html("已赞");
                                        var asNum = $(this).parents('.run_main_cont_piece_center_left').find('.casePK_support_i');
                                        var asNumA = parseInt(asNum.text())+1;
                                        asNum.text(asNumA);
                                        $(this).parents('.run_main_cont_piece_center').find('.zhezhao_dianzanSuc').show().siblings('.zhezhao_dianzanDef').hide();
                                        setTimeout(function(){ _that.parents('.run_main_cont_piece_center').find('.zhezhao_dianzanSuc').hide()},3000);
                                    }else{
                                        if($(this).hasClass("assist_Win")){
                                            t.clearZan(refId,isPrefer);
                                            $(this).removeClass("assist_Win").addClass("assist_Def").html("点赞");
                                            var asNum = $(this).parents('.run_main_cont_piece_center_left').find('.casePK_support_i');
                                            var asNumC = parseInt(asNum.text())-1;
                                            asNum.text(asNumC);
                                            $(this).parents('.run_main_cont_piece_center').find('.zhezhao_dianzanDef').show().siblings('.zhezhao_dianzanSuc').hide();
                                            setTimeout(function(){ _that.parents('.run_main_cont_piece_center').find('.zhezhao_dianzanDef').hide()},3000);
                                        }
                                    }
                                }
                            });
                            /**
                             * 处理点击事件
                             */
                            $(".appZDtitle").on("click",function(){
                                var resourceId=$(this).attr("resourceId");
                                if(resourceId){
                                    appjs.gotoVideoDetail($.toJSON({"resourceId":resourceId,"videoName":$(this).attr("resourceName")}))
                                }
                            })
                            $(".appZDimg").on("click",function(){
                                var resourceId=$(this).attr("resourceId");
                                if(resourceId){
                                    appjs.gotoVideoDetail($.toJSON({"resourceId":resourceId,"videoName":$(this).attr("resourceName")}))
                                }
                            })
                            //瀑布流
                            $(function () {
                                $(".run_main_cont_piece_box").scrollPagination({
                                    'contentPage': t.path.getList,
                                    'noParamJson': 0,
                                    'contentData': $.extend(t.data, {
                                        pageIndex: function () {
                                            return scrollpage++
                                        }
                                    }),
                                    'scrollTarget': $(window),
                                    'heightOffset': 0,
                                    'delaytime': 1000,
                                    type: "post",
                                    'beforeLoad': function () {
                                        comm.loading.show();
                                    },
                                    'afterLoad': function (elementsLoaded) {
                                        comm.loading.hide();
                                    },
                                    'loader': function (data) {
                                        if(t.emptyResult){
                                            return false;
                                        }
                                        if (data && data.dataJson && data.dataJson.rows && data.dataJson.rows.items.length>0) {
                                            var result = data.dataJson;
                                            var html = t.createHtml(result);
                                            $(".run_main_cont_piece_box").append(html).show();
                                            $('#run_main').show();
                                            $('.assist').off("click").bind("click",function(){
                                                appjs.praise();
                                                var refId=$(this).attr("resourceId");
                                                var isPrefer=$(this).attr("isPrefer");
                                                var _that = $(this);
                                                if(appjs.getPraise()==true){
                                                    if($(this).hasClass("assist_Def")){
                                                        t.dianZan(refId,isPrefer);
                                                        $(this).removeClass("assist_Def").addClass("assist_Win").html("已赞");
                                                        var asNum = $(this).parents('.run_main_cont_piece_center_left').find('.casePK_support_i');
                                                        var asNumA = parseInt(asNum.text())+1;
                                                        asNum.text(asNumA);
                                                        $(this).parents('.run_main_cont_piece_center').find('.zhezhao_dianzanSuc').show().siblings('.zhezhao_dianzanDef').hide();
                                                        setTimeout(function(){ _that.parents('.run_main_cont_piece_center').find('.zhezhao_dianzanSuc').hide()},3000);
                                                    }else{
                                                        if($(this).hasClass("assist_Win")){
                                                            t.clearZan(refId,isPrefer);
                                                            $(this).removeClass("assist_Win").addClass("assist_Def").html("点赞");
                                                            var asNum = $(this).parents('.run_main_cont_piece_center_left').find('.casePK_support_i');
                                                            var asNumC = parseInt(asNum.text())-1;
                                                            asNum.text(asNumC);
                                                            $(this).parents('.run_main_cont_piece_center').find('.zhezhao_dianzanDef').show().siblings('.zhezhao_dianzanSuc').hide();
                                                            setTimeout(function(){ _that.parents('.run_main_cont_piece_center').find('.zhezhao_dianzanDef').hide()},3000);
                                                        }
                                                    }
                                                }
                                            });
                                            /**
                                             * 处理点击事件
                                             */
                                            $(".appZDtitle").on("click",function(){
                                                var resourceId=$(this).attr("resourceId");
                                                if(resourceId){
                                                    appjs.gotoVideoDetail($.toJSON({"resourceId":resourceId,"videoName":$(this).attr("resourceName")}))
                                                }
                                            });
                                            $(".appZDimg").on("click",function(){
                                                var resourceId=$(this).attr("resourceId");
                                                if(resourceId){
                                                    appjs.gotoVideoDetail($.toJSON({"resourceId":resourceId,"videoName":$(this).attr("resourceName")}))
                                                }
                                            });
                                        } else {
                                            $(".run_main_cont_piece_box").attr('scrollPagination', 'disabled');
                                            //alert("没有内容了");
                                            return false;
                                        }
                                    }
                                });
                            });
                        } else {
                            t.emptyResult = true;
                            //$(".noMore").show();
                            $(".run_main_cont_piece_box").attr('scrollPagination', 'disabled').hide();
                            return false;
                        }

                    } else {
                        //$(".noMore").show();
                        $(".run_main_cont_piece_box").attr('scrollPagination', 'disabled').hide();
                        return false;
                    }
                },
                error: function () {
                    //$(".nowork").show();
                    $(".run_main_cont_piece_box").attr('scrollPagination', 'disabled');
                    return false;
                }
            });

            comm.loading.hide();

        },

        //搜索：--start
        searchVideo:function(){
            //$('.run_main_cont_piece_box').html("");
            $('.run_main_search').hide();
            var t=this;
            $('.pk_works_search_input').bind("keyup",function(){
                var myEvent = event || window.event;
                var key = myEvent.keyCode;
                var search=$('.pk_works_search_input').val();
                if(search.length>0&&key == 13){    //此时为回车按下
                    t.querySearch(search);
                }else{

                }
            });
            $(".pk_works_quxiao.left").click(function(){
                $(".pk_works_search_input.left").val("");
            });
            $(".pk_searchBox_right").click(function(){
              g_sps.jump(null,"/html/app/activity/new/"+$('#activityId').val()+"/personal_works.html?activityId="+$('#activityId').val());
            })
        },
        //搜索:--end

        //点赞
        dianZan:function(refId){
            if($(".assist").hasClass("assist_Def")){
                var data = {
                    customerId:appjs.getAuthorCustomerId(),
                    refId:refId,
                    usefulType:1,
                    upDownType:1
                };
                var params={paramJson: $.toJSON(data)};
                $.ajax({
                    url:"/mcall/customer/prefer/create/",
                    type:"post",
                    data:params,
                    dataType:"json",
                    async:false,
                    success:function(data){
                    }
                });
            }else{
                if ($(".assist").hasClass("assist_Win")){
                    var data = {
                        customerId:appjs.getAuthorCustomerId(),
                        refId:refId,
                        usefulType:1,
                        upDownType:1
                    };
                    var params={paramJson: $.toJSON(data)};
                    $.ajax({
                        url:"/mcall/customer/prefer/delete/",
                        type:"post",
                        data:params,
                        dataType:"json",
                        async:false,
                        success:function(data){
                        }
                    });
                }
            }
        },

        //取消点赞
        clearZan:function(refId){
                if ($(".assist").hasClass("assist_Win")){
                    var data = {
                        customerId:appjs.getAuthorCustomerId(),
                        refId:refId,
                        usefulType:1,
                        upDownType:1
                    };
                    var params={paramJson: $.toJSON(data)};
                    $.ajax({
                        url:"/mcall/customer/prefer/delete/",
                        type:"post",
                        data:params,
                        dataType:"json",
                        async:false,
                        success:function(data){
                        }
                    });
                }else{

                }
        }
    };
    PKWork.init();
    /**
     * 处理点击事件
     */
    $(".appZDtitle").on("click",function(){
        var resourceId=$(this).attr("resourceId");
        if(resourceId){
            appjs.gotoVideoDetail($.toJSON({"resourceId":resourceId,"videoName":$(this).attr("resourceName")}))
        }
    })
    $(".appZDimg").on("click",function(){
        var resourceId=$(this).attr("resourceId");
        if(resourceId){
            appjs.gotoVideoDetail($.toJSON({"resourceId":resourceId,"videoName":$(this).attr("resourceName")}))
        }
    })
});
$(document).ready(function(){
    $(".search").focus(function () {
      g_sps.jump(null,"/pages/column/videoPK_v2/app_PK/app_search_PK_v2.html?activityId="+$('#activityId').val());
    })
});


