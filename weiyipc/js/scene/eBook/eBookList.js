/**
 * Created by DingLindong on 2017/12/6.
 */
$(function(){
    var eBookList = {
        path:{
            list:"/call/customer/doc/getEBookList/"
        },
        params:{
            scene:1,
            visitSiteId:1,
            pageIndex:1,
            pageSize:20
        },
        init:function(){
            var t = this;
            //t.registerHandel();
            t.commonSearch();
        },
        //先执行各方法
        //registerHandel:function(){
            //Handlebars.registerHelper("toWKH",function(v){
            //    return v.toWKH();
            //});
            //Handlebars.registerHelper("types",function(v){
            //    var str = '';
            //    switch(parseInt(v)){
            //        case 1:
            //            str = '书籍';break;
            //        case 2:
            //            str = '杂志';break;
            //        case 3:
            //            str = '期刊';break;
            //    }
            //    return str;
            //});
            //Handlebars.registerHelper("url",function(v){
            //    if(v){
            //        return v;
            //    }else{
            //        return '/images/img10/v3/eBook/book_img_default.png'
            //    }
            //});
            //return this;
        //},
        commonSearch:function(){
            var t = this;
            var pageClickCallback =function(o){
                t.params.pageIndex = o;
                t.renderDom(function(n){
                    $('.pager').pager({pagenumber:o,pagecount:n,buttonClickCallback:pageClickCallback})
                });
            };
            t.renderDom(function(n){
                $('.pager').pager({pagenumber:1,pagecount:n,buttonClickCallback:pageClickCallback})
            })
        },
        //接着开始铺数据
        renderDom:function(fn){
            var t = this;
            var param = {
                paramJson: $.toJSON(
                    t.params
                )};
            var callback = function(data){
                if(comm.hasResponseData(data)){
                    var dataList = data.responseObject.responseData;
                    var pageCount=Math.ceil(dataList.total_count/t.params.pageSize);
                    if(dataList.data_list.length){
                        var str = '',pic = '';
                        $.each(dataList.data_list,function(i,v){
                            if(v.picUrl){
                                pic = v.picUrl;
                            }else{
                                pic = '/images/img10/v3/eBook/book_img_default.png'
                            }
                            str += '<li>' +
                            '<a href="/pages/eBook/eBook_details.html?bId='+v.resourceId+'">' +
                            '<aside class="eBookListLi">' +
                            '<figure class="bookImg">' +
                            '<img src="'+pic+'" alt="">' +
                            '</figure><aside class="bookDetail">' +
                            '<p class="bookName">'+v.title+'</p>' +
                            '<p class="bookIntroduction">'+v.briefIntro+'</p>' +
                            '<div class="bookTag"><p><span>'+ v.browseNum+'</span>浏览</p><p><span>'+ v.reviewNum+'</span>评论</p></div>' +
                            '</aside></aside></a></li>'
                        });
                        $('.eBookList ul.list').html(str);
                        fn&&fn(pageCount);
                    }
                }
            };
            comm.ajax.async(t.path.list,param,callback);
        }
    };
    eBookList.init();
});