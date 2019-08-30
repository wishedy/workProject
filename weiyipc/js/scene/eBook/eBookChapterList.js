/**
 * Created by ALLIN on 2016/11/30.
 */

$(function(){
    var chapterList={
        path:{
            articleList:'/call/customer/doc/getMapByDocList/',
            videoList:'/call/customer/video/getMapByVideoList/',
            header:'/call/customer/doc/getMapByBookList/',
            catalogue:'/call/book/catalogue/getMapList/',
            share:"/call/comm/data/share/getMapList3/"    //分享话术
        },
        init:function(){
            var t=this;
            t.visitSiteId=1;
            t.pageIndex=1;
            t.pageSize=10;
            t.book=comm.getpara();
            t.sortTypeA=2;
            t.sortTypeV=0;
            //t.getArticleListData();//进来不要默认加载，让trigger的加载左侧资源
            //t.getVideoListData();
            t.getBookAsideData();
            t.getCatalogueData();
            t.tabChange();
            t.tabLocation();
            t.bindArticleOrder();
            t.bindVideoOrder();
            //t.getShareData();
            t.closeChoose();
            t.closeChoose_1();
        },
        getArticleListData:function(){
            var t=this;
            var params_article={paramJson: $.toJSON({
                bookId:t.book.articleBook,
                visitSiteId:t.visitSiteId,
                scene:2,
                catalogueId:t.book.articleCatalogue,
                pageIndex:t.pageIndex,
                pageSize:t.pageSize,
                sortType:t.sortTypeA   //为18按浏览数排序,为19按评论数排序,2默认排序
            })};
            //$('.al-chapterTitle i').text(comm.numToChinese(t.book.catalogueNum));
            $('.al-chapterTitle span').text(comm.getStrLen(t.book.catalogueName,40));
            $('.al-chapterTitle b').text(t.articleNum);
            comm.ajax.async(t.path.articleList,params_article,function(data){
                if(data&&data.responseObject.responseData&&data.responseObject.responseData.total_count){
                    var total_count=data.responseObject.responseData.total_count;
                    t.articleCount=total_count;
                    $('.collectVideoNum').text(total_count);
                }
                t.loadArticleList(data);
                $(".pager.article").pager({ pagenumber: 1, pagecount:Math.ceil(total_count/t.pageSize), buttonClickCallback: PageClick });
                //t.getShareData();
            });
            PageClick = function(pageclickednumber){
                var params_article_1={paramJson: $.toJSON({
                    bookId:t.book.articleBook,
                    visitSiteId:t.visitSiteId,
                    scene:2,
                    catalogueId:t.book.articleCatalogue,
                    pageIndex:pageclickednumber,
                    pageSize:t.pageSize,
                    sortType:t.sortTypeA    //为18按浏览数排序,为19按评论数排序,2默认排序
                })};
                comm.ajax.async(t.path.articleList,params_article_1,function(data){
                    if(data&&data.responseObject.responseData&&data.responseObject.responseData.total_count){
                        var total_count=data.responseObject.responseData.total_count;
                        $('.collectVideoNum').text(total_count);
                    }
                    t.loadArticleList(data);
                    $(".pager.article").pager({ pagenumber:pageclickednumber , pagecount:Math.ceil(total_count/t.pageSize), buttonClickCallback: PageClick });
                });
            };
        },
        getVideoListData:function(){
            var t=this;
            var params_video={paramJson: $.toJSON( {
                bookId: t.book.articleBook,
                visitSiteId: t.visitSiteId,
                scene:10,
                catalogueId: t.book.articleCatalogue,
                videoEbookCatagory:t.sortTypeV,         //0-全部 1-视诊/触诊 2-活动度 3-肌力检查 4-操作 5-特殊检查
                pageIndex:t.pageIndex,
                pageSize:t.pageSize
            })};
            $('.al-chapterTitle b').text(t.articleNum);
            comm.ajax.async(t.path.videoList,params_video,function(data){
                if(data&&data.responseObject.responseData&&data.responseObject.responseData.total_count){
                    var total_count=data.responseObject.responseData.total_count;
                    t.videoCount=total_count;
                    $('.collectCaseNum').text(total_count);
                }
                t.loadVideoList(data);
                $(".pager.video").pager({ pagenumber: 1, pagecount:Math.ceil(total_count/t.pageSize), buttonClickCallback: PageClick_one });
            });
            PageClick_one = function(pageclickednumber){
                var params_video_1={paramJson: $.toJSON({
                    bookId: t.book.articleBook,
                    visitSiteId: t.visitSiteId,
                    scene:10,
                    catalogueId: t.book.articleCatalogue,
                    videoEbookCatagory:t.sortTypeV,
                    pageIndex:pageclickednumber,
                    pageSize:t.pageSize
                })};
                comm.ajax.async(t.path.videoList,params_video_1,function(data){
                    if(data&&data.responseObject.responseData&&data.responseObject.responseData.total_count){
                        var total_count=data.responseObject.responseData.total_count;
                        $('.collectCaseNum').text(total_count);
                    }
                    t.loadVideoList(data);
                    $(".pager.video").pager({ pagenumber:pageclickednumber , pagecount:Math.ceil(total_count/t.pageSize), buttonClickCallback: PageClick_one });
                });
            };
        },
        getBookAsideData:function(){
            var t=this;
            var params_header={paramJson: $.toJSON({
                docId:t.book.articleId.split('#')[0],
                visitSiteId:t.visitSiteId,
                pageIndex:t.pageIndex,
                pageSize:t.pageSize,
                scene:14
            })};
            comm.ajax.async(t.path.header,params_header,function(data){
                //console.log(data);
                if(data&&data.responseObject.responseData&&data.responseObject.responseData.data_list){
                    var data_list=data.responseObject.responseData.data_list;
                    if(data_list.length>0){
                        t.loadBookAside(data_list);
                    }
                }
            });
        },
        getCatalogueData:function(){
            var t=this;
            var params_catalogue={paramJson: $.toJSON({bookId:t.book.articleBook})};
            comm.ajax.async(t.path.catalogue,params_catalogue,function(data){
                if(data&&data.responseObject.responseData&&data.responseObject.responseData.data_list) {
                    var data_list = data.responseObject.responseData.data_list;
                    if (data_list.length > 0){
                        t.loadCatalogueAside(data_list);
                    }
                }
            });
        },
        scoreDom:function(s,scoreNum){
            var score="";
            if(scoreNum<10){return ""}
            var num = parseInt(s);
            var flot =(s-num)*100+"%";
            if(num==0){
                score='<div class="al-resourceTypeBox" style="margin-bottom:7px;"><ul class="al-littleScoreStarBox"><li><b style="width:'+flot+';background-position:0 0;"></b></li><li></li><li></li><li></li><li></li></ul></div>';
            }else if(num==1){
                score='<div class="al-resourceTypeBox" style="margin-bottom:7px;"><ul class="al-littleScoreStarBox"><li><b></b></li><li><b style="width:'+flot+';background-position:0 0;"></b></li><li></li><li></li><li></li></ul></div>';
            }else if(num==2){
                score='<div class="al-resourceTypeBox" style="margin-bottom:7px;"><ul class="al-littleScoreStarBox"><li><b></b></li><li><b></b></li><li><b style="width:'+flot+';background-position:0 0;"></b></li><li></li><li></li></ul></div>';
            }else if(num==3){
                score='<div class="al-resourceTypeBox" style="margin-bottom:7px;"><ul class="al-littleScoreStarBox"><li><b></b></li><li><b></b></li><li><b></b></li><li><b style="width:'+flot+';background-position:0 0;"></b></li><li></li></ul></div>';
            }else if(num==4){
                score='<div class="al-resourceTypeBox" style="margin-bottom:7px;"><ul class="al-littleScoreStarBox"><li><b></b></li><li><b></b></li><li><b></b></li><li><b></b></li><li><b style="width:'+flot+';background-position:0 0;"></b></li></ul></div>';
            }else if(num>=5){
                score='<div class="al-resourceTypeBox" style="margin-bottom:7px;"><ul class="al-littleScoreStarBox"><li><b></b></li><li><b></b></li><li><b></b></li><li><b></b></li><li><b></b></li></ul></div>';
            }
            return score;
        },
        loadArticleList:function(data){
            var t=this;
            if(data&&data.responseObject.responseData&&data.responseObject.responseData.data_list) {
                var data_list = data.responseObject.responseData.data_list;
                if (data_list.length > 0){
                    var html='';
                    for(var i=0;i<data_list.length;i++) {
                        var dataItem = data_list[i];
                        if(data_list.length>=3){
                            t.firstDocName=data_list[0].docName;
                            t.secondDocName=data_list[1].docName;
                            t.threeDocName=data_list[2].docName;
                        }else{
                            t.firstDocName=data_list[0]?data_list[0].docName:"";
                            t.secondDocName=data_list[1]?data_list[1].docName:"";
                            t.threeDocName=data_list[2]?data_list[2].docName:"";
                            data_list[i].docName?data_list[i].docName:'';
                        }
                        if (dataItem.picUrl !== '') {
                            html+='<section class="al-disMajorMainBox_body">'+ t.scoreDom(dataItem.currentStarLevel,dataItem.currentScoreNum)+
                                '<section class="al-disMajorMainBox_body_innerWrap">'+
                                '<figure class="al-disMajorMainBox_bodyText">'+
                                '<h2><a href="'+dataItem.pageStoragePath+'" target="_blank">'+comm.getStrByteLen(dataItem.docName,48)+'</a></h2>'+
                                '<p>'+comm.getStrLen(dataItem.docAbstract,108)+'</p>'+
                                '<div>'+
                                '<span><i class="read"></i>'+dataItem.browseNum.toWK()+'</span>'+
                                '<span><i class="comment"></i>'+dataItem.reviewNum.toWK()+'</span>'+
                                '</div>'+
                                '</figure>'+
                                '<figure class="al-disMajorMainBox_bodyImg">'+
                                '<a href="'+dataItem.pageStoragePath+'" target="_blank">'+
                                '<img src="'+dataItem.picUrl+'" data-original="'+dataItem.picUrl+'" alt=""/>'+
                                '</a>'+
                                '</figure>'+
                                '</section>'+
                                '</section>';
                        }else{
                            html+='<section class="al-disMajorMainBox_body">'+t.scoreDom(dataItem.currentStarLevel,dataItem.currentScoreNum)+
                                '<section class="al-disMajorMainBox_body_innerWrap">'+
                                '<figure class="al-disMajorMainBox_bodyText noAttImg">'+
                                '<h2><a href="'+dataItem.pageStoragePath+'" target="_blank">'+comm.getStrByteLen(dataItem.docName,72)+'</a></h2>'+
                                '<p>'+comm.getStrLen(dataItem.docAbstract,108)+'</p>'+
                                '<div>'+
                                '<span><i class="read"></i>'+dataItem.browseNum.toWK()+'</span>'+
                                '<span><i class="comment"></i>'+dataItem.reviewNum.toWK()+'</span>'+
                                '</div>'+
                                '</figure>'+
                                '</section>'+
                                '</section>';
                        }
                    }
                    $('.al-articleListContent.article').html(html);
                    t.getShareData();
                }
            }
            if($.isEmptyObject(data.responseObject.responseData)){
                $('.al-articleListContent.article').empty();
                $('.al-articleListContent.article').append('<div class="al-noFansTips">暂无内容</div>');
                $('.collectVideoNum').text(0);
                //$('.al-eBookSelectChoice.article').hide();
            }
        },
        loadVideoList:function(data){
            var t=this;
            if(data&&data.responseObject.responseData&&data.responseObject.responseData.data_list) {
                var data_list = data.responseObject.responseData.data_list;
                if (data_list.length > 0){
                    var html='';
                    for(var i=0;i<data_list.length;i++) {
                        var dataItem = data_list[i];
                        html+='<section class="al-disMajorMainBox_body">'+t.scoreDom(dataItem.currentStarLevel,dataItem.currentScoreNum)+
                            '<section class="al-disMajorMainBox_body_innerWrap">'+
                            '<figure class="al-disMajorMainBox_bodyText">'+
                            '<h2><a href="'+dataItem.pageStoragePath+'" target="_blank">'+ dataItem.videoName+'</a></h2>'+
                            '<p>'+comm.getStrLen(dataItem.videoAbstract,108)+'</p>'+
                            '<div>'+
                            '<span><i class="read"></i>'+dataItem.browseNum.toWK()+'</span>'+
                            '<span><i class="comment"></i>'+dataItem.reviewNum.toWK()+'</span>'+
                            '</div>'+
                            '</figure>'+
                            '<figure class="al-disMajorMainBox_bodyImg">'+
                            '<a href="'+dataItem.pageStoragePath+'" target="_blank">'+
                            '<img src="'+dataItem.picUrl+'" data-original="'+dataItem.picUrl+'" alt=""/>'+
                            '<b></b>'+
                            '<span>'+dataItem.playTime+'</span>'+
                            '</a>'+
                            '</figure>'+
                            '</section>'+
                            '</section>';
                    }
                    $('.al-articleListContent.video').html(html);
                }
            }
            if($.isEmptyObject(data.responseObject.responseData)){
                $('.al-articleListContent.video').empty();
                $('.al-articleListContent.video').append('<div class="al-noFansTips">暂无内容</div>');
                $('.collectCaseNum').text(0);
               //$('.al-eBookSelectChoice.video').hide();
            }
        },
        loadBookAside:function(data){
            var t=this;
            var html='';
            for(var i=0;i<data.length;i++){
                var dataItem = data[i];
                var bookName=comm.getStrLen(dataItem.docName,76);
                t.bookName=bookName;
                html+='<a href="/pages/eBook/eBook_details.html?bId='+ t.book.articleBook+'"><img src="'+dataItem.picUrl+'" data-original="'+dataItem.picUrl+'" alt=""/></a>'+
                    '<figure>'+
                    '<a href="/pages/eBook/eBook_details.html?bId='+ t.book.articleBook+'"><h4>'+bookName+'</h4></a>'+
                    '<a target="_blank;" href="/pages/eBook/eBookReading.html?bId='+ t.book.articleBook+'&bName='+bookName+'" class="Ev-allReading">全书阅读</a>'+
                    '</figure>';
            }
            $('.al-wholeBookRed').html(html);
            $('title').text(t.book.catalogueName+'-'+t.bookName+'唯医,allinmd');
        },
        loadCatalogueAside:function(data){
            var t=this;
            var html='';
            //var n=data.length>5?5:data.length;
            var n=data.length;
            var dataItem;
            for(var i=0;i<data.length;i++){
                dataItem = data[i];
                t.sumNum=dataItem.sumNum;
                html+='<li data-catalogue="'+dataItem.catalogueId+'" data-book="'+dataItem.bookId+'" data-docNum="'+dataItem.docNum+'" data-cataname="'+dataItem.catalogueName+'" data-docNum='+dataItem.docNum+'" data-catanum="'+dataItem.sumNum+'" data-cataorder="'+dataItem.catalogueSortId+'">'+
                    '<span>'+dataItem.catalogueName+'</span><b>'+dataItem.sumNum+'</b>'+//'<i>'+comm.numToChinese(dataItem.catalogueSortId)+'</i>
                    '</li>';
            }
            $('.al-chapterDetails').html(html);
            $('.al-chapterDetails li').hide().slice(0,5).show();
            var m=$('.al-chapterDetails li span').index(this);
            t.chapterChange(n,m);
            t.articleList(data);
            $('.al-chapterDetails li[data-catalogue="'+t.book.articleCatalogue+'"] span').trigger('click');
        },
        tabChange:function(event){
            var t=this;
            $('.al-contentTabsItem').on('click',function(){
                var n=$(this).index();
                switch(n){
                    case 0:
                        // comm.Log.createBrowse({href: location.href, id: 164, name: '章节列表页-文章Tab'});
                        setTimeout(function(){
                            g_sps&&g_sps.createBrowse({pageId:415});
                        },2200);

                        break;
                    case 1:
                        // comm.Log.createBrowse({href: location.href, id: 165, name: '章节列表页-视频Tab'});
                        setTimeout(function(){
                            g_sps&&g_sps.createBrowse({pageId:416});
                        },2200);

                        break;
                }
                $(this).addClass('active').siblings('.al-contentTabsItem').removeClass('active');
                $('.al-articleListContent').eq(n).show().siblings('.al-articleListContent').hide();
                $('.al-eBookSelectChoice').hide();
                if($('.al-eBookSelectChoice').eq(n).attr('hsData')==1){
                    $('.al-eBookSelectChoice').eq(n).show();
                }
                $('.pager').eq(n).show().siblings('.pager').hide();
                return false;
            });
        },
        tabLocation:function(){
            var t=this;
            var tag=t.book.articleId.split('#')[1];
            if(tag==1){
                $('.al-contentTabsItem.article').addClass('active').siblings('.al-contentTabsItem.video').removeClass('active');
                $('.al-articleListContent.article').show().siblings('.al-articleListContent.video').hide();
                $('.al-eBookSelectChoice').hide();
                if($('.al-eBookSelectChoice.article').attr('hsData')==1){
                    $('.al-eBookSelectChoice').eq(n).show();
                }
                $('.pager.article').show().siblings('.pager.video').hide();
            }else if(tag==2){
                $('.al-contentTabsItem.video').addClass('active').siblings('.al-contentTabsItem.article').removeClass('active');
                $('.al-articleListContent.video').show().siblings('.al-articleListContent.article').hide();
                $('.al-eBookSelectChoice').hide();
                if($('.al-eBookSelectChoice.article').attr('hsData')==1){
                    $('.al-eBookSelectChoice').eq(n).show();
                }
                $('.pager.video').show().siblings('.pager.article').hide();
            }
        },
        bindArticleOrder:function(){
            var t=this;
            $(".al-eBookSelectChoice.article").on("click",function(e){
                if (e.target.nodeName.toLocaleLowerCase()=='span'){
                    if($(e.target).hasClass('showAll')){
                        $('.al-eBookSelectChoice.article ul').hide();
                        $(e.target).removeClass('showAll');
                        $('.al-eBookSelectChoice.article b').removeClass('topArrow');
                    }else{
                        $('.al-eBookSelectChoice.article ul').show();
                        $(e.target).addClass('showAll');
                        $('.al-eBookSelectChoice.article b').addClass('topArrow');
                    }
                } else if(e.target.nodeName.toLocaleLowerCase()=='b'){
                    if($('.al-eBookSelectChoice.article span').hasClass('showAll')){
                        $('.al-eBookSelectChoice.article ul').hide();
                        $('.al-eBookSelectChoice.article span').removeClass('showAll');
                        $(e.target).removeClass('topArrow');
                    }else{
                        $('.al-eBookSelectChoice.article ul').show();
                        $('.al-eBookSelectChoice.article span').addClass('showAll');
                        $(e.target).addClass('topArrow');
                    }
                } else if (e.target.nodeName.toLocaleLowerCase()=='li'){
                    $(e.target).addClass('active').siblings().removeClass('active');
                    $('.al-eBookSelectChoice.article ul').hide();
                    $('.al-eBookSelectChoice.article b').removeClass('topArrow');
                    $('.al-eBookSelectChoice.article span').text($(e.target).text()).removeClass('showAll');
                    var n = $(e.target).index();
                    switch(n){
                        case 0:
                            t.sortTypeA=2;
                            break;
                        case 1:
                            t.sortTypeA=18;
                            break;
                        case 2:
                            t.sortTypeA=19;
                            break;
                    }
                    t.getArticleListData();
                }
            });
        },
        bindVideoOrder:function(){
            var t=this;
            $(".al-eBookSelectChoice.video").on("click",function(e) {
                if (e.target.nodeName.toLocaleLowerCase() == 'span') {
                    if ($(e.target).hasClass('showAll')) {
                        $('.al-eBookSelectChoice.video ul').hide();
                        $(e.target).removeClass('showAll');
                        $('.al-eBookSelectChoice.video b').removeClass('topArrow');
                    } else {
                        $('.al-eBookSelectChoice.video ul').show();
                        $(e.target).addClass('showAll');
                        $('.al-eBookSelectChoice.video b').addClass('topArrow');
                    }
                } else if(e.target.nodeName.toLocaleLowerCase()=='b'){
                    if($('.al-eBookSelectChoice.video span').hasClass('showAll')){
                        $('.al-eBookSelectChoice.video ul').hide();
                        $('.al-eBookSelectChoice.video span').removeClass('showAll');
                        $(e.target).removeClass('topArrow');
                    }else{
                        $('.al-eBookSelectChoice.video ul').show();
                        $('.al-eBookSelectChoice.video span').addClass('showAll');
                        $(e.target).addClass('topArrow');
                    }
                } else if (e.target.nodeName.toLocaleLowerCase()=='li') {
                    $(e.target).addClass('active').siblings().removeClass('active');
                    $('.al-eBookSelectChoice.video ul').hide();
                    $('.al-eBookSelectChoice.video b').removeClass('topArrow');
                    $('.al-eBookSelectChoice.video span').text($(e.target).text()).removeClass('showAll');
                    t.sortTypeV=$(e.target).data('id');
                    //var n = $(e.target).index();
                    //switch(n){
                    //    case 0:
                    //        t.sortTypeV=0;
                    //        break;
                    //    case 1:
                    //        t.sortTypeV=1;
                    //        break;
                    //    case 2:
                    //        t.sortTypeV=2;
                    //        break;
                    //    case 3:
                    //        t.sortTypeV=3;
                    //        break;
                    //    case 4:
                    //        t.sortTypeV=4;
                    //        break;
                    //    case 5:
                    //        t.sortTypeV=5;
                    //        break;
                    //}
                    t.getVideoListData();
                }
            });
        },
        //点击右边章节目录实现文章和视频列表的加载、分页
        articleList:function(data){
            //console.log(data);
            var t=this;
            var n=data.length;
            $('.al-chapterDetails').off('click').on('click','li span',function(){
                $(this).addClass('active disabled').parent().siblings('li').children('span').removeClass('active disabled');
                var articleCatalogue=$(this).parent().data('catalogue');
                var articleBook=$(this).parent().data('book');
                var catalogueName=$(this).parent().data('cataname');
                var articleNum=$(this).parent().data('catanum');
                t.book.bookId=articleBook;
                t.book.catalogueName=catalogueName;
                t.book.articleCatalogue=articleCatalogue;
                t.articleNum=articleNum;
                t.docNum = $(this).parent().data('docnum');
                var catalogueNum=$(this).parent().data('cataorder');
                //$('.al-chapterTitle i').text(comm.numToChinese(catalogueNum));
                $('.al-chapterTitle span').text(comm.getStrLen(catalogueName,40));
                $('.al-chapterTitle b').text(articleNum);
                var params_article={paramJson: $.toJSON({
                    bookId:articleBook,
                    visitSiteId:t.visitSiteId,
                    scene:2,
                    catalogueId:articleCatalogue,
                    pageIndex:t.pageIndex,
                    pageSize:t.pageSize,
                    sortType:t.sortTypeA    //为18按浏览数排序,为19按评论数排序,2默认排序
                })};
                comm.ajax.async(t.path.articleList,params_article,function(data){
                    if(data&&data.responseObject.responseData&&data.responseObject.responseData.total_count){
                        var total_count=data.responseObject.responseData.total_count;
                        $('.collectVideoNum').text(total_count);
                        $(".ev-shareContainer").show();
                        $('.al-eBookSelectChoice.article').attr('hsData',1);
                        if($('.al-contentTabsItem.article').hasClass('active')){
                            $('.al-eBookSelectChoice.article').show();
                        }
                    }else{
                        $(".ev-shareContainer").hide();
                        $('.al-eBookSelectChoice.article').attr('hsData',0).hide();
                    }
                    t.loadArticleList(data);
                    $(".pager.article").pager({ pagenumber: 1, pagecount:Math.ceil(total_count/t.pageSize), buttonClickCallback: PageClick_two });
                });
                PageClick_two = function(pageclickednumber){
                    var params_article_1={paramJson: $.toJSON({
                        bookId:articleBook,
                        visitSiteId:t.visitSiteId,
                        scene:2,
                        catalogueId:articleCatalogue,
                        pageIndex:pageclickednumber,
                        pageSize:t.pageSize,
                        sortType:t.sortTypeA   //为18按浏览数排序,为19按评论数排序,2默认排序
                    })};
                    comm.ajax.async(t.path.articleList,params_article_1,function(data){
                        if(data&&data.responseObject.responseData&&data.responseObject.responseData.total_count){
                            var total_count=data.responseObject.responseData.total_count;
                            $('.collectVideoNum').text(total_count);
                        }
                        t.loadArticleList(data);
                        $(".pager.article").pager({ pagenumber:pageclickednumber , pagecount:Math.ceil(total_count/t.pageSize), buttonClickCallback: PageClick_two});
                    });
                };
                var params_video={paramJson: $.toJSON( {
                    bookId:articleBook,
                    visitSiteId: t.visitSiteId,
                    scene:10,
                    catalogueId:articleCatalogue,
                    videoEbookCatagory:t.sortTypeV,         //0-全部 1-视诊/触诊 2-活动度 3-肌力检查 4-操作 5-特殊检查
                    pageIndex:t.pageIndex,
                    pageSize:t.pageSize
                })};
                comm.ajax.async(t.path.videoList,params_video,function(data){
                    if(data&&data.responseObject.responseData&&data.responseObject.responseData.total_count){
                        var total_count=data.responseObject.responseData.total_count;
                        var catagoryList=data.responseObject.responseData.catagory_list[0];
                        $('.collectCaseNum').text(total_count);
                        $(".al-OrderSelectItem").eq(1).show();
                        $(".al-OrderSelectItem").eq(1).find("li").show();
                        //视频筛选条件的显示与隐藏
                        if(total_count==0){
                            $(".al-OrderSelectItem").eq(1).hide();
                            $(".al-OrderSelectItem").eq(1).find("li").hide();
                        }
                        if(catagoryList.VisionCount==0){
                            $(".al-OrderSelectItem").eq(1).find("li").eq(1).hide();
                        }
                        if(catagoryList.ActivityCount==0){
                            $(".al-OrderSelectItem").eq(1).find("li").eq(2).hide();
                        }
                        if(catagoryList.strengthCount==0){
                            $(".al-OrderSelectItem").eq(1).find("li").eq(3).hide();
                        }
                        if(catagoryList.operatingCount==0){
                            $(".al-OrderSelectItem").eq(1).find("li").eq(4).hide();
                        }
                        if(catagoryList.specialCount==0){
                            $(".al-OrderSelectItem").eq(1).find("li").eq(5).hide();
                        }
                        $(".ev-shareContainer").show();
                        $('.al-eBookSelectChoice.video').attr('hsData',1);
                        if($('.al-contentTabsItem.video').hasClass('active')) {
                            $('.al-eBookSelectChoice.video').show()
                        }
                    }else{
                        $(".al-OrderSelectItem").eq(1).hide();
                        $(".al-OrderSelectItem").eq(1).find("li").hide();
                        $(".ev-shareContainer").hide();
                        $('.al-eBookSelectChoice.video').attr('hsData',0).hide();
                    }
                    t.loadVideoList(data);
                    $(".pager.video").pager({ pagenumber: 1, pagecount:Math.ceil(total_count/t.pageSize), buttonClickCallback: PageClick_three });
                });
                PageClick_three = function(pageclickednumber){
                    var params_video_1={paramJson: $.toJSON({
                        bookId: articleBook,
                        visitSiteId: t.visitSiteId,
                        scene:10,
                        catalogueId: articleCatalogue,
                        videoEbookCatagory:t.sortTypeV,
                        pageIndex:pageclickednumber,
                        pageSize:t.pageSize
                    })};
                    comm.ajax.async(t.path.videoList,params_video_1,function(data){
                        if(data&&data.responseObject.responseData&&data.responseObject.responseData.total_count){
                            var total_count=data.responseObject.responseData.total_count;
                            $('.collectCaseNum').text(total_count);
                        }
                        t.loadVideoList(data);
                        $(".pager.video").pager({ pagenumber:pageclickednumber , pagecount:Math.ceil(total_count/t.pageSize), buttonClickCallback: PageClick_three });
                    });
                };

                //点击显示5条目录数据
                var m=$('.al-chapterDetails li span').index(this);
                t.chapterChange(n,m);
                return false;
            });
        },

        //滚动页面关闭筛选菜单
        closeChoose:function(){
            var t=this;
            $(window).scroll(function(){
                $('.al-OrderSelectItem').hide();
                $('.al-eBookSelectChoice b').removeClass('topArrow');
                $('.al-eBookSelectChoice span').removeClass('showAll');
            });
        },
        //点击除‘筛选菜单’外的区域关闭筛选菜单
        closeChoose_1:function(){
            var t=this;
            $("body").on("click",function(e){
                if (!$(e.target).parent().hasClass('al-eBookSelectChoice')){
                    $(".al-OrderSelectItem").hide();
                    $(".al-eBookSelectChoice span").removeClass("showAll");
                    $('.al-eBookSelectChoice b').removeClass('topArrow');
                }
            })
        },
        //分享话术
        getShareData:function(){
            var t=this;
            var refId =t.book.articleBook;
            var activeLi = $('.al-chapterDetails span.active').parent();
            var _url = '/pages/eBook/eBook_chapter.html?articleBook='+comm.getpara().articleBook+'&articleCatalogue='+activeLi.attr('data-catalogue')+'&catalogueName='+activeLi.attr('data-cataname')+'&catalogueNum='+activeLi.attr('data-catanum')+'&bookName='+comm.getpara().bookName+'&articleId='+comm.getpara().articleId+'#'+activeLi.attr('data-cataorder');
            module.share({
                container:$(".ev-shareContainer"),// 存放分享组件的父级
                type: 2,// 默认为 1  1 ：社交分享  2 ：页面左下角全站分享 3.终端页面的固定分享
                url: window.location,// 分享链接， 默认取当前页链接
                h5Url: "",//电子书目录url过长采用数据接口返回的短链接//"http://m.allinmd.cn/pages/eBook/eBook_chapter.html"+location.search+location.hash, //h5页面的链接会生成微信二维码
                title: "",// 分享标题
                shareTrend:0,//0: 不需要站内动态分享  1 ：需要站内动态分享
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
                sinaSummary: '',// 新浪分享描述
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
                        docId:t.book.articleId.split("#")[0],
                        visitSiteId:1,
                        resourceType:0,
                        sceneType:27,
                        sessionCustomerId: $("#sesCustomerId").val(),
                        catalogueName:t.book.catalogueName,
                        catalogueNum:t.book.catalogueNum,
                        firstDocName: t.firstDocName,
                        secondDocName: t.secondDocName,
                        threeDocName: t.threeDocName,
                        docCount:t.docNum,
                        catalogueId:activeLi.attr('data-catalogue')
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
                                content.h5Url = item.share_comm.shareUrl;
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
        //本书章节显示内容的变化
        chapterChange:function(n,m){
            if(n-m<=3){
                $('.al-chapterDetails li').hide().slice(-5).show();
            }else if(n-m>3){
                if(m==0||m==1){
                    $('.al-chapterDetails li').hide().slice(0,5).show();
                }else{
                    $('.al-chapterDetails li').hide().slice(m-1,m+4).show();
                }
            }
        },
        typeList:function(ev){
            if(ev.ActivityCount==0){//活动度
                $('.al-personalContributionTitle.video').siblings().find('li:nth-child(3)').css("display","none");
            }else{
                $('.al-personalContributionTitle.video').siblings().find('li:nth-child(3)').css("display","block");
            }
            if(ev.VisionCount==0){//视诊/触诊
                $('.al-personalContributionTitle.video').siblings().find('li:nth-child(2)').css("display","none");
            }else{
                $('.al-personalContributionTitle.video').siblings().find('li:nth-child(2)').css("display","block");
            }
            if(ev.operatingCount==0){//操作
                $('.al-personalContributionTitle.video').siblings().find('li:nth-child(5)').css("display","none");
            }else{
                $('.al-personalContributionTitle.video').siblings().find('li:nth-child(5)').css("display","block");
            }
            if(ev.specialCount==0){//特殊检查
                $('.al-personalContributionTitle.video').siblings().find('li:nth-child(6)').css("display","none");
            }else{
                $('.al-personalContributionTitle.video').siblings().find('li:nth-child(6)').css("display","block");
            }
            if(ev.strengthCount==0){//肌力检查
                $('.al-personalContributionTitle.video').siblings().find('li:nth-child(4)').css("display","none");
            }else{
                $('.al-personalContributionTitle.video').siblings().find('li:nth-child(4)').css("display","block");
            }
        }
    }
    chapterList.init();
});