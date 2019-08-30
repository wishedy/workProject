/**
 * Created by ALLIN on 2016/11/30.
 */

$(function(){
    var bookDetails={
        path:{
            header:'/call/customer/doc/getMapByBookList/',  //头部信息
            article:'/call/customer/doc/getMapByDocList/',  //左侧文章
            catalogue:'/call/book/catalogue/getMapList/',   //栏目
            transformer:'/call/customer/doc/getMapAuthorList/', //编者
            share:"/call/comm/data/share/getMapList3/", //分享话术
            collect:"/call/collection/create/",         //收藏
            cancelCollect:"/call/collection/delete/"    //取消收藏
        },
        init:function(){
            var t=this;
            //comm.Log.createBrowse({href: location.href, id: 159, name: '书籍主页'});
            setTimeout(function(){
                g_sps&&g_sps.createBrowse({pageId:103});
            },2200);

            t.param=comm.getpara();
            t.visitSiteId=1;
            t.pageIndex=1;
            t.pageSize=10;
            t.docId= t.param.bId;
            t.bookId= t.param.bId;
            t.reviewId = t.param.reviewId;
            t.sortType=18;    //为18按浏览数排序,为19按评论数排序
            t.authorType=0;   //译者列表筛选:0-全部,2-主译,6-副主译,7-参与人员
            t.pageOrPopFlag=0;//区别初始化和弹层点击
            t.getHeaderData();
            //t.getCatalogueData();  //
            t.getReview();
            //t.bindArticleOrder();  //
            t.bindTransformerType();
            t.navScroll();
            t.getShareData();
            t.tabChange();
            t.series();
            $('#resourceId').val(comm.getpara().bId);

        },
        //全书阅读按钮点击事件埋点
        allReadBtnClick:function () {
            var t=this;
            $(".al-ebookDetailBtn a").off("click").on("click",function () {
                comm.creatEvent({
                    triggerType:"电子书全书阅读",
                    keyword:"全书阅读",
                    actionId:11066,
                    async:false
                });
            });
        },

        //系列课
        series:function(){
            var operateData = {
                pageName: function () {
                    var a = location.href;
                    var b = a.split("/");
                    var c = b.slice(b.length - 1, b.length).toString(String).split(".");
                    return c.slice(0, 1);
                },
                requestData:function(options){
                    var postType = (options.get) ? "GET" : "POST";//默认是post方式，除非特别传参指名要get方式。
                    var postData = {"paramJson": $.toJSON(options.postData)};
                    $.ajax({
                        url: options.port,    //请求的url地址
                        dataType: "json",   //返回格式为json
                        async: true, //请求是否异步，默认为异步，这也是ajax重要特性
                        data: postData,    //参数值
                        type: postType,   //请求方式
                        beforeSend: function () {
                            //请求前的处理
                        },
                        success: function (data) {
                            //请求成功时处理
                            var realNoData = ((data.responseObject.responseMessage) == "NO DATA");
                            var realStatus = data.responseObject.responseStatus;
                            if (realNoData || !realStatus) {
                                options.failed && options.failed();
                            } else {
                                options.success && options.success(data);
                            }

                        },
                        complete: function () {
                            //请求完成的处理
                        },
                        error: function () {
                            //请求出错处理
                        }
                    });
                }
            };
            var t = this;
            var params = {
                "resourceId": operateData.pageName()[0],    //资源Id
                "isValid": 1,
                "resourceType": 2
            };
            var templateRecommend = function(data){
                var reStr ="";
                $.each(data,function(i,v){
                    var imgStr = "";
                    var videoIcon = "";
                    var noImage = "";
                    if(parseInt(v.resourceType)==1){
                        videoIcon = "<b></b>"
                    }
                    if(v.picUrl.length!=0){
                        imgStr = '<a target="_blank" href="//' + v.pageStoragePath + '" class="al-video-recommend">' +
                            '<img src="' + v.picUrl + '"/>' +
                            videoIcon+
                            '</a>' ;
                    }else{
                        noImage = "al-noImg";
                    }
                    reStr+='<figure class="al-resourceInfo '+noImage+'" data="' + v.resourceId + '">' +
                        '<div>' +
                        imgStr+
                        '<a target="_blank" href="//' + v.pageStoragePath + '">' +
                        '<p>' + comm.getStrLen(v.resourceName,26) + '</p>' +
                        '</a>' +
                        '<span>' + (v.videoAuthor ? v.videoAuthor : "唯医小编") + '</span>' +
                        '</div>' +
                        '</figure>';
                });
                return reStr;
            };
            var recommendShow=function(data){
                var recommendObj = $(".Ev-recommendVideoList");
                var newArrData = [];
                var recommendLen = 0;
                if(data){
                    $.each(data,function(i,v){
                        if(i<5){
                            newArrData.push(v);
                        }
                        recommendLen++;
                    });
                }

                recommendObj.find(".al-resourceInfo").each(function(i){
                    if(i<recommendLen){
                        $(this).remove();
                    }
                });
                recommendObj.find("h6").after(templateRecommend(newArrData));
                if(recommendObj.find(".al-resourceInfo").length>0){
                    recommendObj.show();
                }
            };
            var postData = {"paramJson": $.toJSON(params)};
            $.ajax({
                url: "/call/cms/course/getCoursesByResource/",    //请求的url地址
                dataType: "json",   //返回格式为json
                async: true, //请求是否异步，默认为异步，这也是ajax重要特性
                data: postData,    //参数值
                type: 'POST',   //请求方式
                beforeSend: function () {
                    //请求前的处理
                },
                success: function (data) {
                    //请求成功时处理
                    var realNoData = ((data.responseObject.responseMessage) == "NO DATA");
                    var realStatus = data.responseObject.responseStatus;
                    if (realNoData || !realStatus) {
                        recommendShow(data.responseObject.responseData.recommendList);
                        return false;
                    } else {
                        var dataInfo = data.responseObject.responseData.data_list[0];
                        recommendShow(data.responseObject.responseData.recommendList);
                        var seriesObj = $(".au-doc-series");
                        var seriesTitleObj = $(".au-doc-series .au-doc-series-title").eq(0);
                        var seriesTitle = dataInfo.courseName;
                        var imgObj = $(".au-doc-series-img img");
                        var imgSrc = dataInfo.courseCoverPicUrl;
                        var courseTitle = seriesTitle;
                        var title = "";
                        if (courseTitle.length > 15) {
                            title = courseTitle.substring(0, 15) + "...";
                        } else {
                            title = courseTitle;
                        }
                        seriesTitleObj.html(title);
                        imgObj.attr({"src": imgSrc});
                        var collectState = (dataInfo.collected == "0") ? "" : "1";
                        if (collectState) {
                            seriesObj.attr({"data-href": "/pages/discover/series/discover_series_details.html?tId=" + dataInfo.courseId});
                        } else {
                            seriesObj.attr({"data-href": "/pages/discover/series/discover_series_details.html?tId=" + dataInfo.courseId});
                        }
                        $("[data-href]").css({"cursor":"pointer"}).show().off("click").on("click", function () {
                            var href = $(this).attr("data-href");
                            g_sps.jump(null,href);
                        });
                    }

                },
                complete: function () {
                    //请求完成的处理
                },
                error: function () {
                    //请求出错处理
                }
            });
        },
        //书籍目录请求ajax
        getCatalogueData:function(){
            var t=this;
            var params_catalogue={paramJson: $.toJSON({bookId:t.bookId})};
            comm.ajax.async(t.path.catalogue,params_catalogue,function(data){
                if(data&&data.responseObject.responseData&&data.responseObject.responseData.data_list) {
                    var data_list = data.responseObject.responseData.data_list;
                    if (data_list.length > 0){
                        t.loadCatalogue(data_list);
                    }
                }
            });
        },
        //右侧加载推荐文章ajax请求
        getArticleData:function(){
            var t=this;
            var params_article={paramJson: $.toJSON({
                bookId:t.bookId,
                visitSiteId:t.visitSiteId,
                pageIndex:t.pageIndex,
                pageSize:t.pageSize,
                scene:2,
                sortType:t.sortType
            })};
            comm.ajax.async(t.path.article,params_article,function(data){
                if(data&&data.responseObject.responseData&&data.responseObject.responseData.data_list) {
                    var data_list = data.responseObject.responseData.data_list;
                    if (data_list.length > 0){
                        t.loadArticle(data_list);
                    }
                }
            });
        },
        //书籍顶部图片全书阅读
        getHeaderData:function(){
            var t=this;
            var params_header={paramJson: $.toJSON({
                docId:t.docId,
                visitSiteId:t.visitSiteId,
                pageIndex:t.pageIndex,
                pageSize:t.pageSize,
                scene:14,
                sessionCustomerId:TempCache.getItem('userId') || ""
            })};
            comm.ajax.async(t.path.header,params_header,function(data){
                if(data&&data.responseObject.responseData&&data.responseObject.responseData.data_list){
                    var data_list=data.responseObject.responseData.data_list;
                    if(data_list.length>0){
                        t.loadBookHeader(data_list);
                    }
                }
                t.getTransformerData();
            });
        },
        //译者列表请求ajax
        getTransformerData:function(){
            var t=this;
            var params_transformer={paramJson: $.toJSON({
                customerId:$('#sesCustomerId').val()?$('#sesCustomerId').val():"",
                docId:t.docId,  //传书籍id,在主页接口获取书籍id
                logoUseFlag:4,   //传图片大小
                visitSiteId:t.visitSiteId,  //访问途径
                firstResult:0,
                maxResult:99,
                authorType:t.authorType     //译者列表筛选:0-全部,2-主译,6-副主译,7-参与人员
            })};
            var cBack=function(rep){
                if(comm.hasResponseData(rep)){
                    var items=rep.responseObject.responseData;
                    var _authType="";
                    if(items.authorType){//判断类型进行检测，显示筛选项
                        _authType=items.authorType.split(",");
                        if(t.pageOrPopFlag==0){
                            if(_authType.length>2){
                                $(".ev-cMoreTranList").show();//书籍参与者显示
                            }else{
                                $(".ev-cMoreTranList").hide();//书籍参与者隐藏
                            }
                        }
                        $.each(_authType,function (i,e) {
                            $(".ev-screeningBox li[data-id=0]").show();//全部按钮
                            $(".ev-screeningBox li[data-id="+e+"]").show();
                        });
                    }else{//列表不存在，书籍参与者直接不显示
                        $(".ev-bookPartner").hide();
                    }

                    //列表请求
                    if(rep.responseObject.responseData.data_list&&rep.responseObject.responseData.data_list.length) {
                        var data_list = rep.responseObject.responseData.data_list;
                        var html="",html2="",arrHT=[],twoAuthTypeNum=0;
                        var helplessNum = 2;//区别有没有第一作者，有第一作者索引向后顺延一个
                        $.each(data_list,function (i,e) {
                            var _v=e.authorType;
                            if(_v==1||_v==3||_v==4||_v==5||_v==12||_v==13){//不属于书籍的类型进行判断
                                twoAuthTypeNum+=e.data_list.length;
                            }
                            if(i<2&&_v==1||_v==3||_v==4||_v==5||_v==12||_v==13) {
                                helplessNum = 3;
                            }
                            if(_v!=1&&_v!=3&&_v!=4&&_v!=5&&_v!=12&&_v!=13){//排除不属于书籍的所有类型,hehe
                                if(i<helplessNum&&!t.authorType){//显示前两个类别
                                    html+='<div class="al-tranListBox"><span>'+(e.authorTypeName=='第一译者'?'主&nbsp;&nbsp;&nbsp;译':e.authorTypeName)+'：</span>'+
                                        '<p>'+ t.transNameFun(e.data_list)+'</p>'+
                                        '</div>';
                                }
                                //弹层显示的所有列表
                                for(var i=0;i<e.data_list.length;i++){
                                    var dataItem = e.data_list[i];
                                    arrHT.push(module.compilerList({ tempName: "userList" })({
                                        cid: dataItem.customerId, //用户id
                                        customerId: TempCache.getItem('userId'), //当前人ID
                                        userName: dataItem.authorName, //用户名
                                        logoUrl: dataItem.url, //头像
                                        state: dataItem.state, //认证状态
                                        medicalTitle:dataItem.medicalTitle, //职称
                                        company: dataItem.company, //医院
                                        relationship: dataItem.relationship, //关注关系
                                        terminalFlag:1
                                    }));
                                }
                            }

                        });
                        if(t.pageOrPopFlag==0){
                            $(".ev-cMoreTranList").before(html);
                        }
                        $('.al-translatorIntrItemBox').html(arrHT);
                        t.cMoreTranListEve();//弹层存在的点击事件
                    }

                    //总数有多少
                    if(t.pageOrPopFlag==0&&items.total_count){
                        var total_count=items.total_count- twoAuthTypeNum;
                        $('.al-transformerNum').text(total_count);
                    }
                }else{
                    $(".ev-bookPartner").hide();
                    $('.al-translatorIntrItemBox').empty().append('<div class="al-noFansTips">暂无内容</div>');
                    $('.al-transformerNum').text(0);
                    $('.al-translatorSelectPart').hide();
                }
            };
            comm.ajax.async(t.path.transformer,params_transformer,cBack);
        },
        //书籍参与者的html结构处理
        transNameFun:function (data) {
            var t=this;
            var html="";
            $.each(data,function (i, e) {
               html+='<a class="'+(e.customerId==0?'ev-noAllinDoctor':'')+'" href="'+(e.customerId&&e.customerId!=0?"/pages/personal/others_contribution.html?cid="+e.customerId:"javascript:;")+'" target="_blank">'+e.authorName+'</a>';
            });
            return html;
        },
        //更多书籍参与者的列表点击事件
        cMoreTranListEve:function () {
            $('.ev-cMoreTranList').off("click").on('click',function(){
                $('.al-translatorListPop').show();
                // comm.Log.createBrowse({href: location.href, id: 163, name: '译者列表页'});
                setTimeout(function(){
                    g_sps&&g_sps.createBrowse({pageId:405});
                },2200);

            });
            $('.closeBtn').off("click").on('click',function(){
                $('.al-translatorListPop').hide();
                //事件埋点
                comm.creatEvent({
                    triggerType:"全站功能按钮点击",
                    keyword:"电子书书籍详情页译者列表关闭",
                    actionId:43
                });
            });
            $(".ev-noAllinDoctor").off("click").on('click',function(){
                $.topTip({mark:"warn",showTime:"1.5",content:"该用户尚未注册唯医！"});
            });
        },
        //顶部书籍图片和简介部分
        loadBookHeader:function(data){
            var t=this;
            var html1='';
                var dataItem=data[0];
                var reviewNum=dataItem.reviewNum;
                var bookName=comm.getStrLen(dataItem.docName,76);
                t.bookName=bookName;
            var url ="";
            if(dataItem.bookFormat=="epub"){
                url = '"/pages/eBook/eBookReading.html?bId='+ t.bookId+'&bName='+ t.bookName+'"';
            }else if(dataItem.bookFormat=="pdf"){
                if(comm.browser.isIe8()||comm.browser.isIe9()){
                    url = '"/pages/eBook/eBook_pdf.html?title='+dataItem.docName+'&link='+dataItem.bookUrl.replace("https","http")+'"';
                }else{
                    url = '"/pages/eBook/eBook_pdf.html?title='+dataItem.docName+'&link='+window.btoa(dataItem.bookUrl.replace("https","http"))+'"';
                }

            }else if(dataItem.bookFormat==""){
                url = 'javascript:;';
            }
            if(!dataItem.picUrl){
                dataItem.picUrl = '/images/img10/v3/eBook/book_img_default.png';
            }
            html1='<figure class="al-eBookShow">'+
                '<img src="'+dataItem.picUrl+'" data-original="'+dataItem.picUrl+'" alt=""/>'+
                '</figure>'+
                '<figure class="al-eBookShowInfo" data-alcode-mod="277">'+
                '<h5>'+bookName+'</h5>'+
                '<p>浏览：<span>'+dataItem.browseNum+'</span></p>'+
                '<p class="al-ebookDetailBtn">' +
                '<a target="_blank" href='+url+' class="al-readWholeBookBtn">全书阅读</a>' +
                '<a class="al-collageBtn">收藏书籍</a>'+
                '</p>'+
                '</figure>';
            $(".al-booksIntrText").text(dataItem.docAbstract);
            $('.al-eBookDetailsHead').prepend(html1);
            $('.ev_bookCommentCount').html(reviewNum);
            document.title = bookName+' - 书籍,唯医,allinmd';
            if(dataItem.collectionRelationship==1){
                $('.al-collageBtn').addClass('active').html('已收藏');
            }

            if(dataItem.hasBook==1 && dataItem.hasArticle==1){  //有整书,有散书
                $("#naver").show();
                t.getCatalogueData();
                t.bindArticleOrder();
                t.getArticleData();
            }
            if(dataItem.hasBook==1 && dataItem.hasArticle==0){  //有整书,无散书
                $('#naver li:eq(1)').remove();
                $('#md-bookListLink').remove();
                $('.al-eBookSideBar').remove();
                $("#naver").show();
            }
            if(dataItem.hasBook==0 && dataItem.hasArticle==1){  //无整书,有散书
                $("#naver").show();
                t.getCatalogueData();
                t.bindArticleOrder();
                t.getArticleData();
                $('.al-readWholeBookBtn').attr('style','display:none')
            }
            if(dataItem.hasBook==0 && dataItem.hasArticle==0){  //无整书,散书
                $("#naver").show();
                $('#naver li:eq(0),#naver li:eq(1)').remove();
                $('.al-booksIntrBox').remove();
                $('#md-bookListLink').remove();
                $('.al-readWholeBookBtn').attr('style','display:none')
            }
            //t.getArticleData();
            t.collect();
            // t.allReadBtnClick();
        },
        //目录请求处理html结构
        loadCatalogue:function(data){
            var t=this;
            var html='';
            for(var i=0;i<data.length;i++){
                var dataItem = data[i];
                html+='<div class="al-bookListItem">'+
                    '<figure class="al-bookListContent">'+
                    '<h4 data-catalogue="'+dataItem.catalogueId+'" data-book="'+dataItem.bookId+'" data-cataname="'+dataItem.catalogueName+'" data-catanum="'+dataItem.catalogueSortId+'" data-doc="'+ t.docId+'" data-bookname="'+t.bookName+'">'+dataItem.catalogueName+'<b>'+dataItem.sumNum+'</b></h4>'+
                    '<div class="al-allArticleAndVideoBox">'+
                    '<span class="al-allArticle" data-catalogue="'+dataItem.catalogueId+'" data-book="'+dataItem.bookId+'" data-cataname="'+dataItem.catalogueName+'" data-catanum="'+dataItem.catalogueSortId+'" data-doc="'+ t.docId+'" data-bookname="'+t.bookName+'">全部文章<i>'+dataItem.docNum+'</i></span>'+
                    '<span class="al-allVideo" data-catalogue="'+dataItem.catalogueId+'" data-book="'+dataItem.bookId+'" data-cataname="'+dataItem.catalogueName+'" data-catanum="'+dataItem.catalogueSortId+'" data-doc="'+ t.docId+'" data-bookname="'+t.bookName+'">全部视频<i>'+dataItem.videoNum+'</i></span>'+
                    '</div>'+
                    '</figure>'+
                    '</div>';
            }
            $('.al-bookListInfo').append(html);
            t.articleList();
        },
        //加载右侧推荐文章dom
        loadArticle:function(data){
            var t=this;
            var html='';
            for(var i=0;i<data.length;i++){
                var dataItem = data[i];
                if(dataItem.picUrl!==''){
                    html+='<figure class="al-resourceInfo">'+
                        '<a href="'+dataItem.pageStoragePath+'" target="_blank">'+
                        '<img src="'+dataItem.picUrl+'" data-original="'+dataItem.picUrl+'" alt=""/>'+
                        '</a>'+
                        '<div>'+
                        '<a href="'+dataItem.pageStoragePath+'" target="_blank">'+
                        '<p>'+dataItem.docName+'</p>'+
                        '</a>'+
                        '<figure class="al-browseInfo">'+
                        '<span>'+dataItem.browseNum.toWK()+'</span>'+
                        '<i>'+dataItem.reviewNum.toWK()+'</i>'+
                        '</figure>'+
                        '</div>'+
                        '</figure>';
                }else{
                    html+='<figure class="al-resourceInfo">'+
                        '<div class="al-resourceInfoNoImg">'+
                        '<a href="'+dataItem.pageStoragePath+'" target="_blank">'+
                        '<p>'+dataItem.docName+'</p>'+
                        '</a>'+
                        '<figure class="al-browseInfo">'+
                        '<span>'+dataItem.browseNum.toWK()+'</span>'+
                        '<i>'+dataItem.reviewNum.toWK()+'</i>'+
                        '</figure>'+
                        '</div>'+
                        '</figure>';
                }
            }
            $('.al-contentArticle').html(html);
        },
        //推荐文章最多浏览、做多评论点击处理
        bindArticleOrder:function(){
            var t=this;
            $('.al-personalContributionSelectorItem').on('click',function(){
                $(this).addClass('active').siblings('.al-personalContributionSelectorItem').removeClass('active');
                var n = $(this).index();
                switch(n){
                    case 0:
                        t.sortType=18;
                        break;
                    case 2:
                        t.sortType=19;
                        break;
                }
                t.getArticleData();
            });
        },
        //译者列表筛选点击操作处理
        bindTransformerType:function(){
            var t=this;
            $(".al-translatorSelectPart").on("click",function(e){
                if (e.target.nodeName.toLocaleLowerCase()=='span'){
                    if($(e.target).hasClass('showAll')){
                        $('.al-translatorSelectPart ul').hide();
                        $(e.target).removeClass('showAll');
                        $('.al-translatorSelectPart b').removeClass('al-upArrowIcon');
                    }else{
                        $('.al-translatorSelectPart ul').show();
                        $(e.target).addClass('showAll');
                        $('.al-translatorSelectPart b').addClass('al-upArrowIcon');
                    }
                } else if(e.target.nodeName.toLocaleLowerCase()=='b'){
                    if($('.al-translatorSelectPart span').hasClass('showAll')){
                        $('.al-translatorSelectPart ul').hide();
                        $('.al-translatorSelectPart span').removeClass('showAll');
                        $(e.target).removeClass('al-upArrowIcon');
                    }else{
                        $('.al-translatorSelectPart ul').show();
                        $('.al-translatorSelectPart span').addClass('showAll');
                        $(e.target).addClass('al-upArrowIcon');
                    }
                } else if (e.target.nodeName.toLocaleLowerCase()=='li'){
                    $(e.target).addClass('active').siblings().removeClass('active');
                    $('.al-translatorSelectPart ul').hide();
                    $('.al-translatorSelectPart b').removeClass('al-upArrowIcon');
                    $('.al-translatorSelectPart span').text($(e.target).text()).removeClass('showAll');
                    t.authorType=$(e.target).data('id');
                    t.pageOrPopFlag=1;
                   /* if(t.authorType==0){
                        $('.ev_transTypeName').text('译者');
                    }else{
                        $('.ev_transTypeName').text($(e.target).text());
                    }*/
                    t.getTransformerData();
                    //事件埋点
                    comm.creatEvent({
                        triggerType:"译者筛选项",
                        keyword:$(e.target).text(),
                        actionId:71
                    });
                }
            });
        },
        //跳转sps处理
        skipFun:function(ev){
            var articleCatalogue=$(ev.ele).data('catalogue');
            var articleBook=$(ev.ele).data('book');
            var catalogueName=$(ev.ele).data('cataname');
            var catalogueNum=$(ev.ele).data('catanum');
            var articleId=$(ev.ele).data('doc');
            var bookName=$(ev.ele).data('bookname');
            var loc = '/pages/eBook/eBook_chapter.html?articleBook='+articleBook+
            '&articleCatalogue='+articleCatalogue+
            '&catalogueName='+catalogueName+
            '&catalogueNum='+catalogueNum+
            '&bookName='+bookName+
            '&articleId='+articleId+
            '#'+ev.a+'';
            //sps跳转
            g_sps.jump($(ev.ele),loc);
        },
        //点击跳转到章节列表
        articleList:function(){
            var t=this,
                a='';
            $('.al-bookListContent h4').on('click',function(){
                a=1;
                t.skipFun({
                    ele:this,
                    a:a
                });
            });
            $('.al-allArticle').on('click',function(){
                a=1;
                t.skipFun({
                    ele:this,
                    a:a
                });
            });
            $('.al-allVideo').on('click',function(){
                a=2;
                t.skipFun({
                    ele:this,
                    a:a
                });
            });
        },
        //页面滚动导航栏定位到顶部
        navScroll:function(){
            var t = this;
            var navTop = $('#naver').offset().top;
            $(window).scroll(function(){
                var scrollTop = $(document).scrollTop();

                if(scrollTop>=navTop-70){
                    $('#naver').css({
                        "position":"absolute",
                        "top":scrollTop-21,
                        "background":'#fff',
                        "z-index":2
                    });
                }else{
                    $('#naver').css({
                        "position": "absolute",
                        "width": "663px",
                        "top": "270px",
                        "left": "0",
                        "background":'#fff'
                    });
                }
                t.scrollTagLocation();
            })
        },
        //页面滚动自动定位标签
        scrollTagLocation:function(){
            var t = this;
            $(".target_nav").each(function(i,em){
                var scrollTop=$(document).scrollTop();
                if(scrollTop>$(".target_nav").eq(i).offset().top-100){
                    $(".al-eBook_ProductInfo li").eq(i).addClass("active").siblings().removeClass("active");
                }
                if(scrollTop==$(document).height()-$(window).height()){
                    $(".al-eBook_ProductInfo li").eq($(".al-eBook_ProductInfo li").length-1).addClass("active").siblings().removeClass("active");
                }
            });
        },
        //导航栏标签切换
        tabChange:function(){
            var t=this;
            $('.al-eBook_ProductInfo li').on('click',function(e){
                e.preventDefault();
                var n=$(this).index();
                switch(n){
                    case 0:
                        // comm.Log.createBrowse({href: location.href, id: 160, name: '书籍主页-简介Tab'});
                        setTimeout(function(){
                            g_sps&&g_sps.createBrowse({pageId:396});
                        },2200);

                        break;
                    case 1:
                        // comm.Log.createBrowse({href: location.href, id: 161, name: '书籍主页-目录Tab'});
                        setTimeout(function(){
                            g_sps&&g_sps.createBrowse({pageId:400});
                        },2200);

                        break;
                    case 2:
                        // comm.Log.createBrowse({href: location.href, id: 162, name: '书籍主页-评论Tab'});
                        setTimeout(function(){
                            g_sps&&g_sps.createBrowse({pageId:404});
                        },2200);

                        break;
                }
                t.scrollToPlace($(this).find('a').attr('href'));
            });
        },
        //简介目录评论tab切换，scroll处理
        scrollToPlace:function(elemId){
            var p=elemId||"body";
            var offset = $(p).offset();     //得到elemId这个元素层的offset，包含两个值：top和left
            $("body,html").scrollTop(offset.top-65);
        },
        //评论
        getReview:function(){
            var t=this;
            module.reviewBox({
                scene: 'terminal',
                context:$('.ev-detailReviewForm'),
                refId: t.param.bId,
                type: $("#resourceType").val(),//17
                callback:function(){
                    if($(".ev-listSortOld").hasClass("al-oldNews")){
                        $(".ev-listSortOld").click();//最旧
                    }else{
                        $(".ev-listSortNew").click();//最新
                    }

                }
            });
            //回复列表最新最旧事件绑定
            $(".ev-listSortOld").data("sortType",1).on('click', function(){ //最旧
                $('.ev-list').empty();
                module.reviewPage({name:'eBook',sortType: 1,$context: $('.ev-list'),scene: 'terminal',refType: $("#resourceType").val(),refId: t.param.bId,callback:function(){
                    if(t.param.reviewId){//如果是从动态，朋友圈，评论过来的，点击评论
                        //$('body').animate({scrollTop:$('#reviewArea').offset().top},500); pageIndex:1,
                        $('#naver li').eq(2).click();
                    }
                }
                });
                $(this).addClass("al-oldNews");
                $(".ev-listSortNew").removeClass("al-oldNews");
            });

            $(".ev-listSortNew").data("sortType",3).on('click', function(){ //最新
                $('.ev-list').empty();
                module.reviewPage({name:'eBook',sortType: 3,$context: $('.ev-list'),scene: 'terminal',refType: $("#resourceType").val(),refId: t.param.bId,callback:function(){
                    if(t.param.reviewId){//如果是从动态，朋友圈，评论过来的，点击评论pageIndex:1,
                        $('body').animate({scrollTop:$('#reviewArea').offset().top},500);
                    }
                }});//$("#resourceType").val()
                $(this).addClass("al-oldNews");
                $(".ev-listSortOld").removeClass("al-oldNews");
            });


            //默认为最旧
            $(".ev-listSortOld").click();

            //终端页评论区域个人中心跳转
            var href;
            $(".Ev-mesPersonalCenter").off("click").on("click",function(){
                //debugger;
                href=$(this).attr("data-perCenter");
                g_sps.jump(null,href,true);
            });
        },
        //分享话术
        getShareData:function(){
            var t=this;
            var refId =t.bookId;
            module.share({
                container:$(".ev-shareContainer"),// 存放分享组件的父级
                type: 2,// 默认为 1  1 ：社交分享  2 ：页面左下角全站分享 3.终端页面的固定分享
                url: window.location,// 分享链接， 默认取当前页链接
                h5Url: "https://m.allinmd.cn/dist/eBook/eBook_details.html"+location.search, //h5页面的链接会生成微信二维码
                title: "",// 分享标题
                shareTrend: 1,//0: 不需要站内动态分享  1 ：需要站内动态分享
                trendUrl: PC_CALL + "reprint/create/",// 分享到站内动态的接口
                data: {
                    //dataFlag: 2,
                    refId: refId,
                    customerId: $("#sesCustomerId").val(),
                    reprintType: 2,
                    visitSiteId: 1  //1PC 2 h5
                },// 分享到站内动态的接口参数
                callback: function () {},// 分享到站内动态成功后回调函数
                pic: "",// 分享图片
                weiXinTitle:"",//微信分享标题
                weiXinSummary:"",//微信分享描述
                friCircleTitle:"",//朋友圈分享标题
                friCircleSummary:"",//朋友圈分享描述
                sinaTitle: "",// 新浪分享标题
                sinaSummary:'',// 新浪分享描述
                qqTitle: "",//qq 好友分享标题
                qqSummary: "",//qq 好友分享描述
                qqZoneTitle: "",//qq 空间分享标题
                qqZoneSummary: "",//qq 空间分享描述
                SMSTitle:"",//短信分享标题
                SMSSummary:"",//短信分享描述
                emailTitle:"",//邮件分享标题
                emailSummary:"", //邮件分享描述
                triggerRequest:function(content){//事件点击
                    //获取分享话术
                    var params={};
                    var params_share={paramJson: $.toJSON({
                        attUseFlag:3,
                        useFlag:3,
                        docId:t.bookId,
                        visitSiteId:1,
                        resourceType:17,//17,
                        sceneType:27,
                        sessionCustomerId: $("#sesCustomerId").val()
                    })};
                    $.ajax({
                        url: t.path.share,
                        type: "post",
                        data: params_share,
                        dataType: 'json',
                        async:false,
                        success: function (d) {
                            if (d && d.responseObject.responseData && !$.isEmptyObject(d.responseObject.responseData) && d.responseObject.responseData.data_list.length) {
                                var item = d.responseObject.responseData.data_list[0];
                                content.pic = item.share_comm.shareImageUrl;
                                if(!content.pic){
                                    content.pic="//img10.allinmd.cn/v3/terminal/webcastNoImg.png";
                                }
                                content.title=item.share_comm.shareTitle!=""?item.share_comm.shareTitle:document.title;
                                $.each(item.share_channel,function(i,el){
                                    if(el.shareChannel=='Sina'){
                                        content.sinaTitle=el.shareDesc;
                                    }else if(el.shareChannel=="QQFriend"){
                                        content.qqTitle = el.shareTitle;
                                        content.qqSummary = el.shareDesc;
                                    }else if(el.shareChannel=="QZone"){
                                        content.qqZoneTitle=el.shareTitle;
                                        content.qqZoneSummary = el.shareDesc;
                                    }
                                });
                            }
                        }

                    });
                }
            });

        },
        collect:function(){
            var t = this;
            $('.al-collageBtn').off('click').on('click',function(){
                var that = $(this);
                comm.creatEvent({
                    triggerType:"电子书全书阅读",
                    keyword:"全书阅读",
                    actionId:11066,
                    async:false
                });
                user.login({
                    callback: function () {
                        var params={
                            paramJson: $.toJSON({
                                "collectionType":"17",
                                "refId":t.param.bId,
                                "customerId":TempCache.getItem('userId') || ""
                            })
                        };
                        if(that.hasClass('active')){
                            var callback = function(data){
                                if(data.responseObject.responseStatus){
                                    that.removeClass('active').html('收藏书籍');
                                }
                            };
                            comm.ajax.async(t.path.cancelCollect,params,callback);
                        }else{
                            var callback = function(data){
                                if(data.responseObject.responseStatus){
                                    that.addClass('active').html('已收藏');
                                }
                            };
                            comm.ajax.async(t.path.collect,params,callback);
                        }
                    },
                    scene: privilegeSceneConst.eSceneTypeCollect
                });

            });
        }
    };
    bookDetails.init();
});