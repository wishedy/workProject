/**
 * 功能描述： 拜耳例之声的优秀病例页面展示
 * 使用方法:
 * 注意事件：
 * 引入来源：  作用：
 *
 * Created by HeJing on 2016/04/05.
 */
//优秀病例页面的显示
$(function(){
    var controller= {
        config: {
            url: PC_CALL + "case_baseinfo/json_list/",//列表的请求
            pageSize: 20,
            pageIndex: 1,
            sortType: 4,
            activityId:1460028659268  /*1459416619774 1460028659268*/
        },
        ajaxFn:function(opt) {
            comm.LightBox.showloading();
            var cfg = opt;
            $.ajax({
                url: cfg.url,
                type: 'post',
                data: {paramJson: $.toJSON(cfg.param)},
                dataType: 'json',
                success: function (data) {
                    comm.LightBox.hideloading();
                    if (data) {
                        cfg.fn(data);
                    }
                }
            });
        },
        init: function () {//优秀病例页面的显示
            var t=this;
            var cfg= t.config;
//页面显示页码显示页面显示页码显示页面显示页码显示页面显示页码显示页面显示页码显示
            var items;
            var totalPageNum;
            t.ajaxFn({
                url: cfg.url,
                param:{
                    pageIndex:cfg.pageIndex,
                    pageSize:cfg.pageSize,
                    sortType:cfg.sortType,
                    activityId:cfg.activityId
                },
                fn:function(data){
                    if(data&&data.responseObject.responseData){
                        totalPageNum=Math.ceil(data.responseObject.responseData.total_count/data.responseObject.responseData.page_size);
                        items=data.responseObject.responseData.data_list;
                        t.diseaseListContent(items);
                        $(".pager").pager({pagenumber: 1, pagecount:totalPageNum, buttonClickCallback: PageClick });
                    }
                }
            });
            PageClick = function(pageclickednumber){
                t.ajaxFn({
                    url: t.config.url,
                    param:{
                        pageIndex:pageclickednumber,
                        pageSize:cfg.pageSize,
                        sortType:cfg.sortType,
                        activityId:cfg.activityId
                    },
                    fn:function(data){
                        $(".pager").pager({pagenumber:pageclickednumber, pagecount:totalPageNum, buttonClickCallback: PageClick});
                        if(data&&data.responseObject.responseData) {
                            items = data.responseObject.responseData.data_list;
                            t.diseaseListContent(items);
                        }
                    }
                });
            };
        },

        diseaseListContent:function(items){//优秀病例页列表内容
            var html="";
            $.each(items,function(i,e){
                var caseForArea=items[i].caseForArea;
                var caseName=items[i].case_baseinfo.caseName,//标题
                    pageStoragePath=items[i].case_baseinfo.pageStoragePath,//终端页链接
                    mainNarrate=items[i].case_baseinfo.mainNarrate,//主诉
                    browseNum=items[i].case_baseinfo.browseNum;//浏览数

                var authName=items[i].case_customer_auth.lastName+items[i].case_customer_auth.firstName;//作者名

                var createTime=items[i].case_supplement.createTime.substr(items[i].case_supplement.createTime,10);//创建时间

                var imgUrl=items[i].case_attachment.attUrl;//图片地址
                if(imgUrl==undefined){
                    imgUrl="//img10.allinmd.cn/default/225_150.jpg";
                }


                html+=' <li>'+
                    '<div class="diseImg"><a href="'+pageStoragePath+'" target="_blank"><img src="'+imgUrl+'"/></a></div>'+
                    '<div class="diseInt">'+
                    '<div class="intTit"><a href="'+pageStoragePath+'" target="_blank"><span>['+caseForArea+'] </span>'+comm.getStrLen(caseName,62)+'</a></div>'+
                    '<div class="intMid">'+
                    '<span>作者：'+authName+'</span>'+
                    '<span class="dot"></span>'+
                    '<span>浏览：'+browseNum+'</span>'+
                    '<span class="intDate">'+createTime+'</span>'+
                    '<div class="clear"></div>'+
                    '</div>'+
                    '<div class="intBot">'+comm.getStrLen(mainNarrate,148)+'</div>'+
                    '</div>'+
                    '<div class="clear"></div>'+
                    '</li>';
            });
            $(".Ev-ul-AppendDisListContent").html(html);
            $(".Ev-ul-AppendDisListContent li").last().css("border","none");
        }


    };
    controller.init();
});