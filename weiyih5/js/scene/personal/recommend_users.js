/**
 * @name:
 * @desc:
 * @example:
 * @depend:
 * @date: 2016/9/9
 * @author: sunhaibin
 */

$(function(){
    var sns={};
    sns={
        path:{
            reDoc:M_CALL+"recommend/customer/first/json_list3/"
        },
        config:{
            pageSize:10
        },
        params:{
            sessionCustomerId:TempCache.getItem('userId')!=null?TempCache.getItem('userId'):"",
            customerId:TempCache.getItem('userId')!=null?TempCache.getItem('userId'):"",
            pageIndex:1,
            pageSize:10,
            scene:10,
            isHome:1,
            platformId:TempCache.getItem('department'),
            flag:1,
            score:0
        },
        init:function() {
            var t=this;
            t.back();
            t.cid=TempCache.getItem("userId");
            t.getReDoc();
        },
        back:function(){
            $('.ev_back').click(function(){
                if(document.referrer===window.location.href){
                  g_sps.jump(null,'/');
                } else{
                  g_sps.jump(null,document.referrer);
                }
            });
        },
        noMoreDom:function(){
            return '<section class="listNoMore">~  没有更多了  ~</section>';
        },
        //瀑布流
        scrollPage: function() {
            var t = this;
            var num=2;
            $(".ev-reDoc").off("scroll").scrollPagination({
                'contentPage': t.path.reDoc,
                'contentData': $.extend(t.params, {
                    pageIndex: function () {
                        return num++;
                    }
                }),
                'scrollTarget': $(window),
                'heightOffset': $(window).height(), // it gonna request when scroll is 10 pixels before the page ends
                'delaytime': 0,
                'type': "POST",
                'beforeLoad': function () {
                    comm.loading.show();
                },
                'afterLoad': function (elementsLoaded) {
                    comm.loading.hide();
                },
                'fail':function(){
                    comm.loading.hide();
                },
                'loader': function (data) {
                    if ($.isEmptyObject(data)) {
                        $(".ev-reDoc").attr("scrollPagination", "disabled").append(t.noMoreDom());
                        return false;
                    } else {
                        if ($.isEmptyObject(data.responseObject.responseData) || (data.responseObject.responseData.data_list && data.responseObject.responseData.data_list.length == 0)) {
                            $(".ev-reDoc").attr("scrollPagination", "disabled").append(t.noMoreDom());
                            return false;
                        } else {
                            var rows=data.responseObject.responseData.data_list;
                            var arrHT=[];
                            var scoreList = data.responseObject.responseData.score_list;
                            if(scoreList&&scoreList[0]){
                                for(var _i in scoreList[0]){
                                    if(_i==1){
                                        t.params.score = scoreList[0][1];
                                    }
                                }
                            }
                            if(rows&&rows.length>0){
                                $.each(rows,function(i,val){
                                    arrHT.push(module.listTemplate({tempName:"userList"})({
                                        cid:val.customerId,
                                        customerId: t.cid,
                                        userName:comm.getStrLen(val.customerName,20),
                                        logoUrl:val.logoUrl,
                                        state:2,//没有state
                                        medicalTitle:val.medicalTitle,
                                        company:val.workplace,
                                        relationship:val.relationship
                                    }));
                                });
                                $(".ev-reDoc").append(arrHT);
                            }
                            if(rows.length<10){
                                $(".ev-reDoc").attr("scrollPagination", "disabled").append(t.noMoreDom());
                            }
                        }
                    }
                }
            });

        },
        //获取推荐医师列表
        getReDoc:function(){
            comm.loading.show();
            var t=this;
            var param={};
            param.paramJson= $.toJSON(t.params);
            $.ajax({
                type : "post",
                url : t.path.reDoc,
                data : param,
                dataType : "json",
                success : function(rep){
                    comm.loading.hide();
                    var rows=rep.responseObject.responseData.data_list;
                    var scoreList = rep.responseObject.responseData.score_list;
                    if(scoreList&&scoreList[0]){
                        for(var _i in scoreList[0]){
                            if(_i==1){
                                t.params.score = scoreList[0][1];
                            }
                        }
                    }
                    var arrHT=[];
                    if(rows&&rows.length>0){
                        $.each(rows,function(i,val){
                            arrHT.push(module.listTemplate({tempName:"userList"})({
                                cid:val.customerId,
                                customerId: t.cid,
                                userName:comm.getStrLen(val.customerName,20),
                                logoUrl:val.logoUrl,
                                state:2,//没有state
                                medicalTitle:val.medicalTitle,
                                company:val.workplace,
                                relationship:val.relationship
                            }));
                        });
                    }
                    if(rows&&rows.length<10){
                        $(".ev-reDoc").attr("scrollPagination", "disabled").append(t.noMoreDom());
                    }
                    $(".ev-reDoc").html(arrHT);
                    t.scrollPage();
                },
                error:function(){}
            });
        }
    };

    sns.init();
})
