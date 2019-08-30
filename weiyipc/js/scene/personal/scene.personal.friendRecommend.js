/**
 * 功能描述：  推荐医师
 * 使用方法:
 * 注意事件：
 * 引入来源：  作用：
 *
 * Created by LiChunHui on 2016/8/29.
 */
$(function(){
    //user.login({
    //    callback: function () {
    //        friendRecommend.init();
    //    },
    //    scene: privilegeSceneConst.eSceneTypeLogin,
    //    onClose:function(){
    //        window.location.href="/";
    //    },
    //    onAuthCancel:'back'
    //});
    var friendRecommend={
        path:{
            reDoc:PC_CALL+"customer/recommendCustomerFirst/json_list3/" //PC_CALL+"customer/auth/getRecommendList/"//推荐医师
        },
        config:{
            pageSize:9
        },
        init:function(){
            this.getReDoc();

            //接入可能认识
            module.personYouKnow({
                container:$('.ev-discoverDoctor')
            });
        },
        //获取推荐医师列表
        getReDoc:function(){
            comm.LightBox.showloading();
            var t=this;
            var data={};
            var param={};
            /*data.sessionCustomerId = $('#sesCustomerId').val()||"";
             data.sortType=4;
             data.recommendAreasExpertiset= t.areasExpertise;
             data.recommendCompany= t.company;
             data.logoUseFlag=3;
             data.pageIndex=1;
             data.pageSize= t.config.pageSize;*/
            data.customerId=$('#sesCustomerId').val()||"";
            data.pageIndex=1;
            data.pageSize=t.config.pageSize;
            data.scene=10;
            data.sessionCustomerId=$('#sesCustomerId').val()||"";
            data.platformId=$('#sesDepartment').val()||1;
            data.isHome=0;
            data.flag=1;
            data.score=0;
            param.paramJson= $.toJSON(data);
            $.ajax({
                type : "post",
                url : t.path.reDoc,
                data : param,
                dataType : "json",
                success : function(rep){
                    comm.LightBox.hideloading();
                    if(rep&&rep.responseObject.responseData){
                        var repData=rep.responseObject.responseData;
                        var scoreList=repData.score_list;
                        var rows=repData.data_list;
                        t.getHtml(rows);
                        if(scoreList&&scoreList.length>0){
                            for (var i in scoreList[0]){
                                if(i==1){
                                    data.score=scoreList[0][i];
                                }
                            }
                        }
                        t.scrollPage(data);
                        /*if(!t.pagecount){
                            t.pagecount=Math.ceil(repData.total_count/t.config.pageSize);
                        }

                        $(".pager").pager({pagenumber:1, pagecount: t.pagecount, buttonClickCallback: PageClick});*/
                    }

                },
                error:function(){}
            });

            /*PageClick = function(pageclickednumber){
                comm.LightBox.showloading();
                data.pageIndex=pageclickednumber;
                param.paramJson= $.toJSON(data);
                $.ajax({
                    type : "post",
                    url : t.path.reDoc,
                    data : param,
                    dataType : "json",
                    success : function(rep){
                        comm.LightBox.hideloading();
                        if(rep&&rep.responseObject.responseData){
                            var repData=rep.responseObject.responseData;
                            var rows=repData.data_list;
                            var scoreList=repData.score_list;
                            t.getHtml(rows);
                            if(scoreList&&scoreList.length>0){
                                for (var i in scoreList[0]){
                                    if(i==1){
                                        data.score=scoreList[0][i];
                                    }
                                }
                            }
                            //pagecount=Math.ceil(repData.total_count/t.config.pageSize);
                            $(".pager").pager({ pagenumber: pageclickednumber, pagecount: t.pagecount, buttonClickCallback: PageClick });
                        }
                    },
                    error:function(){}
                });
            };*/

        },
        //瀑布流
        scrollPage:function(data){
            var t=this;
            var pagenumber=2;
            $(".ev-recommend").scrollPagination({
                'contentPage': t.path.reDoc,
                'contentData': $.extend(data, {
                    pageIndex: function () {
                        return pagenumber++;
                    }
                }),
                'scrollTarget': $(window),
                'heightOffset': 0, // it gonna request when scroll is 10 pixels before the page ends
                'delaytime': 1000,
                'type': "post",
                'dataType':"json",
                'beforeLoad': function () {
                    comm.LightBox.showloading();
                },
                'afterLoad': function (elementsLoaded) {
                    comm.LightBox.hideloading();
                },
                'loader': function (rep) {
                    if ($.isEmptyObject(rep)) {
                        $(".ev-recommend").attr("scrollPagination", "disabled");
                        return false;
                    } else {
                        if ($.isEmptyObject(rep.responseObject.responseData) || (rep.responseObject.responseData.data_list && rep.responseObject.responseData.data_list.length == 0)) {
                            $(".ev-recommend").attr("scrollPagination", "disabled");
                            return false;
                        } else {
                            if(rep&&rep.responseObject.responseData){
                                var repData=rep.responseObject.responseData;
                                var rows=repData.data_list;
                                var scoreList=repData.score_list;
                                t.getHtml(rows);
                                if(scoreList&&scoreList.length>0){
                                    for (var i in scoreList[0]){
                                        if(i==1){
                                            data.score=scoreList[0][i];
                                        }
                                    }
                                }

                            }
                        }
                    }
                }
            });
        },
        getHtml:function(rows){
            var _t=this;
            var arrHT=[];
            if(rows&&rows.length>0){
                $.each(rows,function(i,val){
                    var logo; var user; var statistic;
                    /* if(val.customer_att){
                     logo=val.customer_att;
                     }
                     if(val.customer_doctor){
                     user=val.customer_doctor;
                     }*/
                    if(val.customer_statistic){
                        statistic=val.customer_statistic;
                    }

                    name=val.customerName?val.customerName:"";
                    medicalTitle=val.medicalTitle;//comm.strHandle.cutDoctorTitle(comm.cutLine(user.medical_title,"_",","))?comm.strHandle.cutDoctorTitle(comm.cutLine(user.medical_title,"_",",")):"";
                    company=val.company?comm.getStrLen(val.company,22):"";

                    contribuNum=statistic.caseNum+statistic.docNum+statistic.topicNum+statistic.videoNum;//贡献值
                    arrHT.push(module.resourceListTemplate({tempName:"squUserList"})({
                        cid:val.customerId,
                        userName:name,
                        logoUrl:val.logoUrl,
                        state:2,
                        medicalTitle:medicalTitle,
                        company:company,
                        contribuNum:contribuNum?contribuNum.toWK():0,
                        reviewNum:statistic.reviewNum?statistic.reviewNum.toWK():0,
                        fansNum:statistic.fansNum?statistic.fansNum.toWK():0,
                        relationship:val.relationship
                    }));
                });
                if(rows.length<_t.config.pageSize){//一页的数据小于每页条数时
                    $(".ev-recommend").attr("scrollPagination", "disabled");
                }
            }else{
                $(".ev-recommend").attr("scrollPagination", "disabled");
            }
            //$(".ev-recommend").empty();
            $(".ev-recommend").append(arrHT);
        }
    };
    friendRecommend.init();
})
