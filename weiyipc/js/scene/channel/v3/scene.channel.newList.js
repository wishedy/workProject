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
            timeHot:PC_CALL+'customer/trends/getMapListByTime/'
        },
        params:{
            sessionCustomerId:$('#sesCustomerId').val()!=undefined?$('#sesCustomerId').val():'',
            opId:0,             //0只查询发布状态的
            dateType:2,         //1-每日最新 2-每周最新
            trendTypes:'1,2,4,7',  		//	全部时传1,2,4,7
            logoUseFlag:UseFlag.c,
            attUseFlag:AttUseFlag.c,
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
            var _a = comm.getpara().trendTypes;
            var _b =comm.getpara().dateType;
            var trendType=_a!=undefined?_a:0;           //	全部时传1,2,4,7
            var dateType =_b!=undefined?_b:1;          //1-每日最新 2-每周最新
            var resType='资源';
            var _tType;
            switch(parseInt(trendType)){
                case 1:
                    _tType =1;
                    resType='视频';
                    break;
                case 2:
                    _tType=2;
                    resType='文库';
                    break;
                case 4:
                    _tType=4;
                    resType='话题';
                    break;
                case 7:
                    _tType=7;
                    resType='病例';
                    break;
                default:
                    _tType ="1,2,4,7";
            }
            switch(parseInt(dateType)){
                case 1:
                    $('.ev_sName').text('每日最新');
                    document.title = "每日最新"+resType+" －为你精选,唯医,allinmd";
                    $('meta[name="keywords"]').attr('content',"每日最新"+resType+"，allinmd");
                    comm.Log.createBrowse({href:location.href,id:38,name:'每日最新'});
                    break;
                case 2:
                    $('.ev_sName').text('每周最新');
                    document.title = "每周最新"+resType+" －为你精选,唯医,allinmd";
                    $('meta[name="keywords"]').attr('content',"每周最新"+resType+"，allinmd");
                    comm.Log.createBrowse({href:location.href,id:39,name:'每周最新'});
                    break;
            }


            t.params = $.extend(t.params,{
                trendTypes: _tType,
                dateType:dateType
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
                    var html='',sDom="",attUrl="",refType='',trend,c_auth;
                    $.each(item,function(i,je){
                        refType = je.customer_trends_type;
                        trend = je.customer_trends;
                        c_auth = je.customer_auth;
                        if(refType==1){
                            attUrl = je.cms_video_attachment_logo==""?"":je.cms_video_attachment_logo.videoAttUrl;
                        }else if(refType==2){
                            attUrl = je.cms_doc_attachment_logo==""?"":je.cms_doc_attachment_logo.docAttUrl;
                        }else if(refType==4){
                            attUrl = je.cms_topic_attachment_logo==""?"":je.cms_topic_attachment_logo.topicAttUrl;
                        }else if(refType==7){
                            attUrl = je.case_attachment_logo==""?"":je.case_attachment_logo.attUrl;
                        }
                        var authorName = '';
                        if(refType==1){
                            authorName = comm.getStrLen(c_auth.ownerNameStr,30);
                        }else{
                            authorName = c_auth.lastName+c_auth.firstName;
                        }
                        sDom=module.indexListTem.byTypeList({
                            resUrl:trend.resourceUrl,
                            resName:trend.resourceName,
                            videoType:je.videoType,
                            resDesc:trend.trendContent,//主诉
                            resAuthor:authorName,
                            resWatchCount:je.resource_valid.browseNum?je.resource_valid.browseNum.toWK():0,
                            commentNum:je.resource_valid.reviewNum?je.resource_valid.reviewNum.toWK():0,
                            attUrl:attUrl,
                            playTime:je.resource_valid.playTime,
                            score:je.currentStarLevel,
                            scoreNum:je.currentScoreNum
                        }, refType);
                        html+= sDom;
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