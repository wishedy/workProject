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
            pageSize: 10,
            pageIndex: 1,
            sortType: 4,
            activityId:1459416619774/*1459416619774 1460028659268*/
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
            var items;
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
                        items=data.responseObject.responseData.data_list;
                        t.indexListContent(items);
                    }
                }
            });

        },

        indexListContent:function(items){//优秀病例页列表内容
            var html="";
            $.each(items,function(i,e){
                var caseName=items[i].case_baseinfo.caseName,//标题
                    pageStoragePath=items[i].case_baseinfo.pageStoragePath;//终端页链接


                var authName=items[i].case_customer_auth.lastName+items[i].case_customer_auth.firstName;//作者名
                var company=items[i].case_customer_auth.company;//医院

                var createTime=items[i].case_supplement.createTime.substr(items[i].case_supplement.createTime,10);//创建时间

                html+='<li>'+
                    '<div class="disLi">'+
                    '<div class="disText"><a href="'+pageStoragePath+'" target="_blank">'+comm.getStrLen(caseName,52)+'</a></div>'+
                    '<div class="disLiBot">'+
                    '<div class="disName">'+authName+'</div>'+
                    '<div class="disAdd">'+comm.getStrLen(company,18)+'</div>'+
                    '<div class="disDate">'+createTime+'</div>'+
                    '<div class="clear"></div>'+
                    '</div>'+
                    '</div>'+
                    '</li>';
            });
            $("#Ev-Clear").before(html);
        }
    };
    controller.init();
});