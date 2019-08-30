/**
 * 功能描述：  浏览记录
 * 使用方法:
 * 注意事件：
 * 引入来源：  作用：
 *
 * Created by LiChunHui on 2016/8/22.
 */
$(function(){
    var browse={};
    var num=2;
    browse={
        path:{
            getBrowse:M_CALL+"log/customer/browse/json_list/"//浏览记录
        },
        config:{
            pageSize:20
        },
        init:function(){
            var t= this;
            //权限
            user.privExecute({
                operateType: 'auth',   //'login','auth','conference'
                callback:function(){
                    if(TempCache.getItem('customerRole')==2||TempCache.getItem('customerRole')==3||TempCache.getItem('customerRole')==4){
                        popup('该用户没有操作权限');
                        setTimeout(function(){
                            history.back();
                        },3000);
                    }else{
                        t.cid=TempCache.getItem("userId");
                        t.getBrowse(1);
                    }
                }
            });
            this.digHole();
        },
        //返回埋点
        digHole:function(){
            $('.ev_digHole').click(function(){
                comm.creatEvent({
                    triggerType:'全站功能按钮点击',
                    keyword:"返回",
                    actionId:41,
                    async:false
                });
            });
        },
        //获取自己的浏览记录
        getBrowse:function(index){
            var t=this;
            var data={};
            data.browseTypes="4,5,9,10";
            data.customerId= t.cid;
            data.dataFlag=3;
            data.groupType=1;
            data.pageIndex=index;
            data.pageSize= t.config.pageSize;
            comm.loading.show();
            $.ajax({
                type : "post",
                url : t.path.getBrowse,
                data : data,
                dataType : "json",
                success : function(rep){
                    comm.loading.hide();
                    if(rep&&rep.responseObject.responseData&&rep.responseObject.responseData.data_list){
                        if(rep.responseObject.responseData.data_list.length>0){
                            var list=rep.responseObject.responseData.data_list;
                            var html=t.getBroweHtml(list);
                            $(".ev-browseRecordBox").append(html);
                            /*if(list.length< t.config.pageSize){
                                $(".ev-browseRecordBox").attr("scrollPagination", "disabled");
                            }*/
                            if(rep.responseObject.responseData.total_count>list.length&&index==1){
                                t.getBrowse(2);
                                num=3;
                            }
                            t.scrollPage();
                        }else{
                            if(index==1){
                                $(".ev-noBrowse").show();
                                $(".ev-browseRecordBox").hide();
                            }

                        }
                    }else{
                        if(index==1){
                            $(".ev-noBrowse").show();
                            $(".ev-browseRecordBox").hide();
                        }
                    }
                },
                error:function(){}
            });
        },
        //瀑布流
        scrollPage: function () {
            var t = this;
            var data={};
            data.browseTypes="4,5,9,10";
            data.customerId= t.cid;
            data.dataFlag=3;
            data.groupType=1;
            data.pageIndex=1;
            data.pageSize= t.config.pageSize;
            $(".ev-browseRecordBox").off("scroll").scrollPagination({
                'contentPage': t.path.getBrowse,
                'noParamJson':1,
                'contentData': $.extend(data, {
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
                'loader': function (data) {
                    if ($.isEmptyObject(data)) {
                        $(".ev-browseRecordBox").attr("scrollPagination", "disabled");
                        return false;
                    } else {
                        if ($.isEmptyObject(data.responseObject.responseData) || (data.responseObject.responseData.data_list && data.responseObject.responseData.data_list.length == 0)) {
                            $(".ev-browseRecordBox").attr("scrollPagination", "disabled");
                            return false;
                        } else {
                            var result = data.responseObject.responseData.data_list;
                            var html=t.getBroweHtml(result);
                            $(".ev-browseRecordBox").append(html);
                        }
                    }
                }
            });

        },
        getBroweHtml:function(data,n){
            result=data;
            //计算今天日期     [{dayDescription : "今天",list: {数据}},]
            var currDate = comm.date.local_time().substr(0, 10);
            //组装数据
            var groupData = [
                {dayDescription: "今天", dataStyle:"today",dataStatus: false, list: []},
                {dayDescription: "昨天", dataStyle:"yesDay", dataStatus: false, list: []},
                {dayDescription: "更早", dataStyle:"longAgo", dataStatus: false, list: []}
            ];

            for (var i = 0; i < result.length; i++) {
                if(n&&i>=n){
                    break;
                }
                var srcDate = result[i].openTime.substr(0, 10);
                if (currDate == srcDate) {//今天
                    groupData[0].dataStatus = true;
                    groupData[0].dayDescription = "今天";
                    groupData[0].list.push(result[i]);
                } else if (Date.parse(currDate) - Date.parse(srcDate) == 86400000) { //昨天
                    groupData[1].dataStatus = true;
                    groupData[1].dayDescription = "昨天";
                    groupData[1].list.push(result[i]);
                } else { //更早以前
                    groupData[2].dataStatus = true;
                    groupData[2].dayDescription = "更早";
                    groupData[2].list.push(result[i]);
                }
            };
            var html="";
            $.each(groupData,function(i,val){
                html2='';
                if(val.dataStatus){
                    $.each(val.list,function(j,o){
                        if(o.browseType){
                            switch (o.browseType){
                                case 4:
                                    browseType='视频';
                                    break;
                                case 5:
                                    browseType='文库';
                                    break;
                                case 9:
                                    browseType='话题';
                                    break;
                                case 10:
                                    browseType='病例';
                                    break;
                                default :
                                    break;
                            }
                            html2+='<a href="'+ o.browseUrl+'"><article class="al-recordListItem">'+
                                '<span class="al-recordListItemType">'+browseType+'</span>'+
                                '<article>'+
                                '<span class="al-recordListItemContent">'+ comm.getStrLen(o.refName,38)+'</span>'+
                                '</article>'+
                                '<i class="icon-arrowRight"></i>'+
                                '</article></a>';
                        }
                    })
                }
                if(html2){
                    var len=$(".ev-cBrowse").length;
                    if($(".ev-cBrowse").eq(len-1).attr("data-style")==val.dataStyle){
                        html+='<section class="al-recordList ev-cBrowse" data-style="'+val.dataStyle+'" style="margin-top:-0.2rem;">'+html2+'</section>';
                    }else{
                        html+='<section class="al-recordList ev-cBrowse" data-style="'+val.dataStyle+'"><header class="al-recordListTitle">'+val.dayDescription+'</header>'+html2+'</section>';
                    }

                }

            });
            return html;
        }
    };
    browse.init();
})
