/**
 * Created by ALLIN on 2017/1/11.
 */
$(function(){
    var productList={
        path:{
            product:"/call/cms/resourceCategory/getMapList/"
        },
        init:function(){
            var t=this;
            t.param=comm.getpara();
            t.resourceType=t.param.resourceType;//resourceType=2&resourceId=1397806174907
            t.resourceId=t.param.resourceId;
            t.getData();
        },
        getData:function(){
            var t=this;
            var data={
                resourceType:t.resourceType,         //文库2 视频1 病例7
                resourceId:t.resourceId,
                categoryType:4,
                pageIndex:1,
                pageSize:15,       //每次加载15条数据
                isValid:1,
                sortType:5
            };
            t.data=data;
            var params={paramJson: $.toJSON(data)};
            comm.LightBox.showloading();
            comm.ajax.async(t.path.product,params,function(data){
                if(data&&data.responseObject.responseData&&data.responseObject.responseData.total_count){
                    var total_count=data.responseObject.responseData.total_count;
                    $('.al-productListDetailsBox .num').text(total_count);
                }
                if(data&&data.responseObject.responseData&&data.responseObject.responseData.data_list){
                    var data_list = data.responseObject.responseData.data_list;
                    if (data_list.length > 0){
                        t.dataProcessing(data_list);
                    }
                }
                t.scrollPage();
                comm.LightBox.hideloading();
            });
        },
        dataProcessing:function(data){
            var t=this;
            var html='';
            for(var i=0;i<data.length;i++){
                var dataItem = data[i];
                var productId=data[i].productId;
                if(dataItem.attPath!==''){
                    html+='<li productId="'+productId+'">'+
                        '<a href="https://www.medplus.net/" class="al-productImgShow"><img src="'+dataItem.attPath+'" data-original="' + dataItem.attPath + '" alt=""/></a>'+
                        '<a href="https://www.medplus.net/" class="al-productInfoName">'+dataItem.productName+'</a>'+
                        '<span>'+dataItem.brandName+'</span>'+
                        '</li>';
                }else{
                    html+='<li productId="'+productId+'">'+
                        '<a href="https://www.medplus.net/" class="al-productImgShow"><img src="//img10.allinmd.cn/v3/terminal/productListNoImg.png" alt=""/></a>'+
                        '<a href="https://www.medplus.net/" class="al-productInfoName">'+dataItem.productName+'</a>'+
                        '<span>'+dataItem.brandName+'</span>'+
                        '</li>';
                }
            }
            $('.al-productDetailsContainer').append(html);
            //事件埋点
            $('.al-productDetailsContainer li').on("click",function(){
                var keyword=$(this).find(".al-productInfoName").text();
                var productId=$(this).attr("productId");
                var index=$(this).index()+1;
                comm.creatEvent({
                    triggerType:"引流医栈",
                    keyword:keyword,
                    actionId:1,
                    pushMessageId:productId,
                    locationId:index
                    //refType:t.resourceType
                });
            });
        },
        scrollPage:function () {
            var t = this;
            var num=2;
            $(".al-productDetailsContainer").off("scroll").scrollPagination({
                'contentPage': t.path.product,
                'contentData': $.extend(t.data, {
                    pageIndex: function () {
                        ////console.log(num);
                        return num++;
                    }
                }),
                'scrollTarget': $(window),
                'heightOffset': 0,
                'delaytime': 1000,
                'type': "POST",
                'beforeLoad': function () {
                    comm.LightBox.showloading();
                },
                'afterLoad': function (elementsLoaded) {
                    comm.LightBox.hideloading();
                },
                'loader': function (data) {
                    if ($.isEmptyObject(data)) {
                        $(".al-productDetailsContainer").attr("scrollPagination", "disabled");
                        return false;
                    } else {
                        if ($.isEmptyObject(data.responseObject.responseData) || (data.responseObject.responseData.data_list && data.responseObject.responseData.data_list.length == 0)) {
                            $(".al-productDetailsContainer").attr("scrollPagination", "disabled");
                            return false;
                        }
                        else {
                            var result = data.responseObject.responseData.data_list;
                            var html=t.dataProcessing(result);
                            $(".al-productDetailsContainer").append(html);
                        }
                    }
                }
            });
        }
    }
    productList.init();
});