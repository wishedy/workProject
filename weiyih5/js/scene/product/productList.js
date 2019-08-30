/**
 * Created by ALLIN on 2017/1/10.
 */
$(function(){
    //Log.createBrowse(174,'相关产品');
    var productList={
        path:{
            product:"/mcall/cms/resourceCategory/getMapList/"
        },
        init:function(){
            var t=this;
            t.param=comm.getpara();
            t.resourceType=t.param.resourceType;
            t.resourceId=t.param.resourceId;
            t.getData();
            t.backBtnClick();
        },
        getData:function(){
            var t=this;
            var data={
                resourceType:t.resourceType,    //文库2 视频1 病例7
                resourceId:t.resourceId,
                categoryType:4,
                pageIndex:1,
                pageSize:15,
                isValid:1,
                sortType:5
            };
            t.data=data;
            var params={paramJson: $.toJSON(data)};
            comm.loading.show();
            comm.ajax.async(t.path.product,params,function(data){
                if(data&&data.responseObject.responseData&&data.responseObject.responseData.data_list){
                    var data_list = data.responseObject.responseData.data_list;
                    if (data_list.length > 0){
                        t.dataProcessing(data_list);
                    }
                    if(data_list.length<15){
                        $(".al-productPageListBox").attr("scrollPagination", "disabled");
                    }
                }
                t.scrollPage();
                comm.loading.hide();
            });
        },
        dataProcessing:function(data){
            var t=this;
            var html='';
            for(var i=0;i<data.length;i++){
                var dataItem = data[i];
                var productId=data[i].productId;
                if(parseInt(dataItem.operationType,10)===1){
                    if (dataItem.attPath !== '') {
                        html += '<li>' +
                            '<a href="' + dataItem.webStoragePath + '?from=2&visitSiteId=2" class="ev_digHole">' +
                            '<img src="' + dataItem.attPath + '" data-original="' + dataItem.attPath + '" alt=""/>' +
                            '<p class="al-productRecommendText">' + comm.getStrLen(dataItem.productName, 16) + '</p>' +
                            '</a>' +
                            '</li>';
                    } else {
                        html += '<li>' +
                            '<a href="' + dataItem.webStoragePath + '?from=2&visitSiteId=2" class="ev_digHole">' +
                            '<img src="//img50.allinmd.cn/score/productNoImg.png"  alt=""/>' +
                            '<p class="al-productRecommendText">' + comm.getStrLen(dataItem.productName, 16) + '</p>' +
                            '</a>' +
                            '</li>';
                    }
                }else if(parseInt(dataItem.operationType,10)===2){
                    if((parseInt(dataItem.customerId,10)===parseInt(cId,10))&&(parseInt(dataItem.customerId,10)!=0)){//我打的产品
                        if (dataItem.attPath !== '') {
                            html += '<li>' +
                                '<a href="' + dataItem.webStoragePath + '?from=2&visitSiteId=2" class="ev_digHole">' +
                                '<div class="imageWrapper"><span class="icon"></span>'+
                                '<img src="' + dataItem.attPath + '" data-original="' + dataItem.attPath + '" alt=""/></div>' +
                                '<p class="al-productRecommendText">' + comm.getStrLen(dataItem.productName, 16) + '</p>' +
                                '</a>' +
                                '</li>';
                        } else {
                            html += '<li>' +
                                '<a href="' + dataItem.webStoragePath + '?from=2&visitSiteId=2" class="ev_digHole">' +
                                '<img src="//img50.allinmd.cn/score/productNoImg.png"  alt=""/>' +
                                '<p class="al-productRecommendText">' + comm.getStrLen(dataItem.productName, 16) + '</p>' +
                                '</a>' +
                                '</li>';
                        }
                    }else{
                        if (dataItem.attPath !== '') {
                            html += '<li>' +
                                '<a href="' + dataItem.webStoragePath + '?from=2&visitSiteId=2" class="ev_digHole">' +
                                '<img src="' + dataItem.attPath + '" data-original="' + dataItem.attPath + '" alt=""/>' +
                                '<p class="al-productRecommendText">' + comm.getStrLen(dataItem.productName, 16) + '</p>' +
                                '</a>' +
                                '</li>';
                        } else {
                            html += '<li>' +
                                '<a href="' + dataItem.webStoragePath + '?from=2&visitSiteId=2" class="ev_digHole">' +
                                '<img src="//img50.allinmd.cn/score/productNoImg.png"  alt=""/>' +
                                '<p class="al-productRecommendText">' + comm.getStrLen(dataItem.productName, 16) + '</p>' +
                                '</a>' +
                                '</li>';
                        }
                    }

                }
            }
            $('.al-productPageListBox').append(html);
            $('.al-productPageListBox li a').click(function(){
                var _rd = $(this).parents("li").attr("productId");
                comm.creatEvent({
                    triggerType:'引流医栈',
                    keyword:$(this).parents("li").find('.al-productCompany').text(),
                    actionId:1,
                    pushMessageId:_rd,
                    locationId:$(this).parents("li").index()+1
                });
            });
        },
        backBtnClick:function(){
            $(".al-indexHeaderItem img").on("click", function() {
                if (document.referrer.lastIndexOf("/passport/") > -1 || document.referrer.indexOf("seminar") > -1 || !document.referrer) {
                  g_sps.jump(null,"/");
                } else {
                    history.back();
                }
                return false;
            })
        },
        scrollPage:function () {
            var t = this;
            var num=2;
            $(".al-productPageListBox").off("scroll").scrollPagination({
                'contentPage': t.path.product,
                'contentData': $.extend(t.data, {
                    pageIndex: function () {
                        return num++;
                    }
                }),
                'scrollTarget': $(window),
                'heightOffset': 0,
                'delaytime':0,
                'type': "POST",
                'beforeLoad': function () {
                    comm.loading.show();
                },
                'afterLoad': function (elementsLoaded) {
                    comm.loading.hide();
                },
                'loader': function (data) {
                    if ($.isEmptyObject(data)) {
                        $(".al-productPageListBox").attr("scrollPagination", "disabled");
                        return false;
                    } else {
                        if ($.isEmptyObject(data.responseObject.responseData) || (data.responseObject.responseData.data_list && data.responseObject.responseData.data_list.length == 0)) {
                            $(".al-productPageListBox").attr("scrollPagination", "disabled");
                            return false;
                        }
                        else {
                            var result = data.responseObject.responseData.data_list;
                            var html=t.dataProcessing(result);
                            $(".al-productPageListBox").append(html);
                            if(result.length<15){
                                $(".al-productPageListBox").attr("scrollPagination", "disabled");
                            }
                        }
                    }
                }
            });
        }
    };
    productList.init();
});