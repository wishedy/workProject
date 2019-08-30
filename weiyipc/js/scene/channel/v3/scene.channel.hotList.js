/**
 * @name:
 * @desc:
 * @example:
 * @depend:
 * @date: 2016/8/16
 * @author: sunhaibin
 */

$(function(){
    var ctrl={
        opt:{
            cid:$('#sesCustomerId').val()
        },
        path:{
            allSee:PC_CALL+"recommend/customer/tag/json_othertags/",
            timeHot:PC_CALL+'resource/browse/json_list/'
        },
        params:{
            groupByFlag :1,// 1-每日最热  5-每周最热
            dataType:0,// 0-全部 ，1-视频 2-文库，4-话题，7-病例
            visitSiteId:1,
            scene:1,// 1-列表
            pageIndex:1,
            pageSize:20,
            platformId: $('#sesDepartment').val()||1
        },
        init:function(){
            var t=this;
            t.setParams();
            t.commonSearch();
            t.allSee();
        },
        setParams:function(){   //通过传参设置不同页面及请求
            var t=this;
            var dataType = comm.getpara().dataType;  //	全部时传0   //1,2,4,7
            var groupByFlag =comm.getpara().groupByFlag;              //1-每日最新 2-每周最新
            var resType='资源';
            switch(parseInt(dataType)){
                case 1:
                    resType='视频';
                    break;
                case 2:
                    resType='文库';
                    break;
                case 4:
                    resType='话题';
                    break;
                case 7:
                    resType='病例';
                    break;
            }
            switch(parseInt(groupByFlag)){
                case 1:
                    $('.ev_listName').text('每日最热');
                    document.title = "每日最热"+resType+" －为你精选,唯医,allinmd";
                    $('meta[name="keywords"]').attr('content',"每日最热"+resType+"，allinmd");
                    comm.Log.createBrowse({href:location.href,id:40,name:'每日最热'});
                    break;
                case 5:
                    $('.ev_listName').text('每周最热');
                    document.title = "每周最热"+resType+" －为你精选,唯医,allinmd";
                    $('meta[name="keywords"]').attr('content',"每周最热"+resType+"，allinmd");
                    comm.Log.createBrowse({href:location.href,id:41,name:'每周最热'});
                    break;
            }
            t.params = $.extend(t.params,{
                dataType: dataType,
                groupByFlag:groupByFlag
            });
        },
        commonSearch:function(){
            var t=this;
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
        renderDom:function(fn){
            var t=this;
            var paramJson ={paramJson:$.toJSON(t.params)} ;
            var callback =function(data){
                if(data&&!$.isEmptyObject(data.responseObject.responseData)&&data.responseObject.responseData.data_list.length){
                    var item =data.responseObject.responseData.data_list;
                    var html='',attUrl="",refType='';
                    $.each(item,function(i,je){
                        if(!$.isEmptyObject(je)){
                            attUrl="";
                            refType = je.itemType;
                            if(je.picNum==1){
                                attUrl=je.picUrl
                            }else if(je.picNum>1){
                                attUrl = je.picUrl.split('|')[0];
                            }
                            html+=module.indexListTem.byTypeList({
                                resUrl:je.itemUrl,
                                resName:je.itemTitle,
                                videoType:je.videoType,
                                resDesc:je.itemAbstract,
                                resAuthor:je.ownerNameStr,
                                resWatchCount:je.browseNum.toWK(),
                                commentNum:je.reviewNum.toWK(),
                                attUrl:attUrl,
                                playTime:je.playTime,
                                score:je.currentStarLevel,
                                scoreNum:je.currentScoreNum
                            }, refType);
                        }
                    });
                    $('.ev_hotEachDay').html(html);
                    $('.al-disMajorMainBox_body_innerWrap:last').css('border','none');
                    fn&&fn(Math.ceil(data.responseObject.responseData.total_count/20));
                }
            };
            comm.ajax.async(t.path.timeHot, paramJson,callback);
        },
        allSee:function(){
            var t=this;
            var param = {paramJson: $.toJSON({
                customerId: t.opt.cid!=undefined? t.opt.cid:0,
                firstResult:0,
                maxResult:5
            })};
            var callback =function(d){
                if(d&& d.responseObject.responseData&&!$.isEmptyObject(d.responseObject.responseData)&&d.responseObject.responseData.data_list){
                    var item = d.responseObject.responseData.data_list;
                    var html='';
                    $.each(item,function(i,el){
                        html+= ' <section>'+
                            '    <a href="/pages/discover/discover_tagSubject.html#tId='+el.propertyId+'">'+comm.getStrLen(el.propertyName,50)+'</a>'+
                            '        <p><span class="al-orange">'+el.propertyNum+'</span>个相关资源</p>'+
                            '    </section>';
                    });
                    $('.ev_allSee').html(html);
                }
            };
            comm.ajax.async(t.path.allSee,param,callback);
        },
        shareAction:function(firstTitle,secondTitle){

        }
    };
    ctrl.init();

})