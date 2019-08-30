/**
 * @name:
 * @desc:
 * @example:
 * @depend:
 * @date: 2016/8/26
 * @author: sunhaibin
 */
$(function(){
    var naviType={
        getRes:function(){
            var _name="case";
            var _naType=8;
            var _channelId=113;
            var location = window.location.href;
            var resourceId=7;
            if(/video/.test(location)){
                _name ='video';
                _naType=5;
                _channelId=78;
                resourceId=1;
            }else if(/doc/.test(location)){
                _name = 'doc';
                _naType=6;
                _channelId=81;
                resourceId=2;
            }else if(/topic/.test(location)){
                _name = 'topic';
                _naType=7;
                _channelId=114;
                resourceId=4;
            }
            return{
                getName:function(){
                    return PC_CALL+"customer/recommendResourceItem/json_"+_name+"/";
                },
                getType:function(){
                    return _naType;
                },
                getChannelId:function(){
                  return _channelId;
                },
                getResourceId:function(){
                    return resourceId;
                }
            }
        }
    };
    var ctrl={
        opt:{
            cid:  $('#sesCustomerId').val()!=undefined?$('#sesCustomerId').val():"" //1399533638818//
        },
        path:{
            getTags:PC_CALL+'discovery/search/getMapList/',
            dynamicEntry:PC_CALL+"navigation/scheduling/json_list/",
            banner:PC_CALL + 'ad/position/profile/getMapList/',             //banner
            getRecommendDoctor:PC_CALL+"customer/recommendCustomerFirst/json_list3/",    //推荐医师
            getRecommendTag:PC_CALL+'recommend/customer/tag/json_list/',                 //推荐标签
            topNList:PC_CALL+"cms/resource/json_list/"
        },
        number:{
            tagPage:0,
            docPage:0,
            topNpage:0
        },
        params:{
            customerId: $('#sesCustomerId').val()!=undefined?$('#sesCustomerId').val():"",  //1399533638818
            pageIndex:1,
            pageSize:10,
            scene:10,
            flag:1,
            score:0,
            sessionCustomerId:$('#sesCustomerId').val()||"",
            platformId: $('#sesDepartment').val()
        },
        init:function(x){
            var t=this;
            if(x){
                $(".al-release_popBox").attr('reloadData',1);
                t.params.customerId = $('#sesCustomerId').val();
                t.params.platformId = $('#sesDepartment').val();
            }
            t.tagDom2 = "";
            t.TOP2="";
            $('.al-mainSidebarItem').eq(0).addClass('active');  //首页加active
            t.bannerLoad();
            t.getRes();
            t.dynamicEntry();
            t.getSideTags();
        },
        //轮播图加载
        bannerLoad:function(){
            var t=this;
            var param = {paramJson: $.toJSON({
                firstResult: 0,
                maxResult: 100,
                visitSiteId:1,//pc 1  h52
                channelId:naviType.getRes().getChannelId(), //channelId:''//113-病例 78-视频 81-文库 114-话题  68-首页
                isIndex:"",//是否是首页,首页传1，频道页不传值
                platformId:$('#sesDepartment').val()||1,
                customerId:$("#sesCustomerId").val()
            })};
            var callback =function(d){
                comm.localData.storeLocalData(t.path.banner,d);
                if(d&&!$.isEmptyObject(d.responseObject.responseData)&& d.responseObject.responseData.data_list.length){
                    var item = d.responseObject.responseData.data_list[0];
                    var html="";
                    if(item.ad_profile_attachment&&item.ad_profile_attachment.length){
                        $.each(item.ad_profile_attachment,function(i,el){
                            var _target="";
                            if(el.linkUrl.lastIndexOf("www.medplus.net")>-1){
                                _target="target='_href'";
                            }
                            if(!$("#sesCustomerId").val()&&el.linkUrl.lastIndexOf("personal_customerInfo")>-1){//TODO:推广 V1用户去补全四证其他状态不显示此广告位

                            }else{
                                if($("#sesAuth").val()!=2&&el.linkUrl.lastIndexOf("personal_customerInfo")>-1){

                                }else{
                                    html+='<figure class="swiper-slide" adId="'+el.id+'">'+
                                        '<a href="'+el.linkUrl+'" '+_target+'>'+
                                        '<img src="'+el.adAttUrl+'" alt="'+el.adAttName+'">'+
                                        '</a>'+
                                        '</figure>';
                                }
                            }
                        });
                        $('.swiper-wrapper').html(html);
                        if($('.swiper-wrapper .swiper-slide').length>1){
                            var mySwiper = new Swiper('.swiper-container',{
                                loop: true,
                                pagination: ".al-pagination",
                                autoplay: 3000,
                                paginationClickable: true,
                                autoplayDisableOnInteraction: false,
                                speed: 1000
                            });
                            $('.swiper-container').on("mouseover",function(){
                                $('.swiper-button-prev').show();
                                $('.swiper-button-next').show();
                            }).on("mouseout",function(){
                                $('.swiper-button-prev').hide();
                                $('.swiper-button-next').hide();
                            });
                            $('.swiper-button-prev').on('click', function(e){
                                e.preventDefault();
                                mySwiper.swipePrev();
                            });
                            $('.swiper-button-next').on('click', function(e){
                                e.preventDefault();
                                mySwiper.swipeNext();
                            });
                            $('.swiper-container .swiper-slide').on("click",function(){
                                var locationId='',
                                    slideLength=$('.swiper-container .swiper-slide').length,
                                    index=$(this).index();
                                switch (index){
                                    case 0:
                                        locationId=slideLength-2;
                                        break;
                                    case slideLength:
                                        locationId=1;
                                        break;
                                    case slideLength-1:
                                        locationId=index-1;
                                        break;
                                    default:
                                        locationId=index;
                                        break;
                                }
                                var param=$("a",$(this)).attr("href")+"$"+$(this).attr("adId");
                                //事件埋点
                                comm.creatEvent({
                                    async:false,
                                    triggerType:"广告",
                                    keyword:$(this).find("img").attr("alt"),
                                    locationId:locationId,
                                    param:param,
                                    actionId:14
                                });
                            })
                        }

                    }
                }
            };
            comm.localData.getLocalData({
                path: t.path.banner,
                exhibitionData: callback,
                requestData: function () {
                    comm.ajax.async(t.path.banner,param,callback);
                }
            });

        },
        testInvalid:function(val){
            if(((typeof val =='string')&&(val.length==0))||(val==undefined)||(val=='undefined')||(val=='null')||(typeof val=='undefined')||(typeof val=='null')||(val==null)){
                return true;
            }else{
                return false;
            }
        },
        dynamicEntry:function(){
            var t=this;
            var params={paramJson: $.toJSON({navigationType:naviType.getRes().getType(),visitSiteId:1,sessionCustomerId:$('#sesCustomerId').val()||"",customerId:$('#sesCustomerId').val()||"",platformId:$('#sesDepartment').val()})};//naviType.getRes().getType()
            var callback=function(o){
                comm.localData.storeLocalData(t.path.dynamicEntry,o);
                if(o&&o.responseObject.responseData&& !$.isEmptyObject(o.responseObject.responseData)){
                    if(o.responseObject.responseData.up_data_list.length>0){//左侧动态入口
                        var res = o.responseObject.responseData.up_data_list;//最多取5个
                        var html='';
                        $.each(res,function(i,ele){
                            html+='<section class="al-recommendLinksWrap" data-id="'+ele.navigationSort+'" data-name="'+ele.navigationName+'">'+
                            '<a href="'+ele.navigationPath+'" class="al-recommendLinkItem">'+
                            '<img src="'+ele.navigationLogo+'" alt="">'+
                            '<figcaption>'+ele.navigationName+'</figcaption>'+
                            '</a>'+
                            '</section>';
                        });
                        $('.al-recommendLinks').show().html(html);
                        var _len = $('.al-recommendLinks>section').length;

                        $('.al-recommendLinks a').on("click",function(){
                            var locationId=$(this).parent().attr('data-id'),
                                text=$(this).parent().attr('data-name');
                            //事件埋点
                            comm.creatEvent({
                                async:false,
                                triggerType:"动态入口",
                                locationId:locationId,
                                keyword:text,
                                actionId:63
                            });
                        })
                    }
                    if(o.responseObject.responseData.down_data_list.length>0){//右侧动态入口
                        var res = o.responseObject.responseData.down_data_list;
                        //var class_name ="";
                        /*if(res.length==3){
                            class_name ='al-dyn-three';
                        }else if(res.length>=4){
                            class_name ='al-dyn-four';
                        }*/
                        var html='';
                        $.each(res,function(i,ele){
                            if(i<4){
                                html+='<figure class="al-dyn-item" data-id="'+ele.navigationSort+'" data-name="'+ele.navigationName+'">'+
                                '<a href="'+ele.navigationPath+'">'+
                                '<img src="'+ele.navigationLogo+'" alt=""/>'+
                                //'<p>'+ele.navigationName+'</p>'+
                                '</a>'+
                                '</figure>';
                            }
                        })
                        $('.al-dyn-entry').show().html(html);
                        $('.al-dyn-item:gt(1)').css('borderTop','1px solid #e9edf1');
                        $('.al-dyn-entry a').on("click",function(){
                            var locationId=$(this).parent().attr('data-id'),
                                text=$(this).parent().attr('data-name');
                            //事件埋点
                            comm.creatEvent({
                                async:false,
                                triggerType:'功能',
                                triggerName:'动态入口',
                                locationId:locationId,
                                keyword:text,
                                actionId:63
                            });
                        })
                    };

                }

            };
            comm.localData.getLocalData({
                path: t.path.dynamicEntry,
                exhibitionData: callback,
                requestData: function () {
                    comm.ajax.async(t.path.dynamicEntry,params,callback);
                }
            });
            //comm.ajax.async(t.path.dynamicEntry,params,callback);
        },
        getRes:function(x){
            var t=this;
            t.params.customerId = $('#sesCustomerId').length?$('#sesCustomerId').val():"";
            t.params.pageIndex = 1;
            t.params.platformId = $('#sesDepartment').val()||1;
            t.params.score = 0;
            var _params = {paramJson: $.toJSON(t.params)};
            var localDataRender = function(data){
					if(data&&!$.isEmptyObject(data.responseObject.responseData)&&data.responseObject.responseData.data_list.length) {
						var item = data.responseObject.responseData.data_list;
						var scoreList = data.responseObject.responseData.score_list;
						if (scoreList && scoreList.length > 0) {
							for (var i in scoreList[0]) {
								if (i == 1) {
									t.params.score = scoreList[0][i];
								}
							}
						}
						var itemLength = item.length;
						var html = '';
						var _temp = "";
						var attLength = 0, attUrl = "";
						$.each(item, function (i, me) {
							attLength = me.picNum;
							if (attLength > 0) {
								attUrl = me.picUrl.split('|');
								for (var i = 0, l = attUrl.length; i < l; i++) {
									if (attUrl[i].indexOf('http') == -1) {
										attUrl.splice(i, 1);
									}
								}
								attLength = attUrl.length;
							} else {
								attUrl = "";
							}
							_temp = module.indexListTem.list({
								refType: me.itemType,
								resUrl: me.itemUrl,
								videoType: me.videoType,
								resName: me.itemTitle == "" ? "&nbsp;" : me.itemTitle,
								resDesc: me.itemAbstract,
								isAward: me.isAward,
								isAttend: me.isAttend,
								isNew: me.isNew,
								isHot: me.isHot,
								tplPath: me.tplPath,
								resAuthor: ctrl.testInvalid(me.ownerNameStr)?me.ownerName:me.ownerNameStr,
								resWatchCount: me.browseNum.toWK(),
								playTime: me.playTime,
								attLength: attLength,
								attUrl: attUrl,
								id: me.itemId,
								score: me.currentStarLevel,
								scoreNum: me.currentScoreNum,
								isShowActivityTag: me.isShowActivityTag,
								activityTagName: me.activityTagName,
								activityTagColor: me.activityTagColor
							});
							html += _temp;
						});
						$('.ev_resBox').html(html);
					}
            };
            var _callback =function(data){
                comm.localData.storeLocalData(naviType.getRes().getName(),data);
                if(data&&!$.isEmptyObject(data.responseObject.responseData)&&data.responseObject.responseData.data_list.length){
                    var item = data.responseObject.responseData.data_list;
                    var scoreList=data.responseObject.responseData.score_list;
                    if(scoreList&&scoreList.length>0){
                        for (var i in scoreList[0]){
                            if(i==1){
                                t.params.score=scoreList[0][i];
                            }
                        }
                    }
                    var itemLength = item.length;
                    var html='';
                    var _temp="";
                    var attLength= 0,attUrl="";
                    $.each(item,function(i,me){
                        attLength = me.picNum;
                        if(attLength>0){
                            attUrl=me.picUrl.split('|');
                            for(var i= 0,l=attUrl.length;i<l;i++){
                                if(attUrl[i].indexOf('http')==-1){
                                    attUrl.splice(i,1);
                                }
                            }
                            attLength = attUrl.length;
                        }else{
                            attUrl="";
                        }
                        _temp = module.indexListTem.list({
                            refType:me.itemType,
                            resUrl:me.itemUrl,
                            videoType:me.videoType,
                            resName:me.itemTitle==""?"&nbsp;":me.itemTitle,
                            resDesc:me.itemAbstract,
                            isAward:me.isAward,
                            isAttend:me.isAttend,
                            isNew:me.isNew,
                            isHot:me.isHot,
                            tplPath:me.tplPath,
                            resAuthor:ctrl.testInvalid(me.ownerNameStr)?me.ownerName:me.ownerNameStr,
                            resWatchCount:me.browseNum.toWK(),
                            playTime:me.playTime,
                            attLength:attLength,
                            attUrl:attUrl,
                            id:me.itemId,
                            score:me.currentStarLevel,
                            scoreNum:me.currentScoreNum,
                            isShowActivityTag:me.isShowActivityTag,
                            activityTagName:me.activityTagName,
                            activityTagColor:me.activityTagColor
                        });
                        html+=_temp;
                    });
                    $('.ev_resBox').html(html);
                    if(x){//判断从发布登录重新获取资源
                        $(".al-release_popBox").attr('reloadData',1);
                    }
                    if(itemLength>4){
                        t.topNList();
                    }
                    if(itemLength>7){
                        t.tagRecList();
                    }
                    if(itemLength>19){
                        t.docRecList();
                    }
                    $(".lazyImg").lazyload({
                        effect:"fadeIn",
                        event:"scrollstop"
                    });
                    t.setImgWidth();
                    module.dislikeAction();
                    t.viewBigImg();
                    t.scrollPage();
                }
            };
            comm.localData.getLocalData({
                path: naviType.getRes().getName(),
                exhibitionData: localDataRender,
                requestData: function () {
                    comm.ajax.async(naviType.getRes().getName(),_params,_callback);
                }
            });
            //comm.ajax.async(naviType.getRes().getName(),_params,_callback);
        },
        //推荐标签
        tagRecList:function(noLoading){
            var t=this;
            var _params ={paramJson: $.toJSON({
                customerId: t.opt.cid!=""&&t.opt.cid!=undefined?t.opt.cid:"",
                pageIndex:t.number.tagPage+1,
                pageSize:20,
                scene:10,
                flag:1,
                score:t.tagRecScore?t.tagRecScore:0,
                sessionCustomerId:$('#sesCustomerId').val()||"",
                platformId:$('#sesDepartment').val()
            })};
            var _callback =function(q){
                if(q&& q.responseObject.responseData&&!$.isEmptyObject(q.responseObject.responseData)&&q.responseObject.responseData.data_list){
                    var item =q.responseObject.responseData.data_list;
                    var html="",html2="";
                    $.each(item,function(i,e){
                        if(!comm.checkInvalid(e.propertyName)){
                            if(i<10){
                                html+='<a href="/pages/discover/discover_tagSubject.html#tId='+ e.propertyId+'" class="al-contentTagItem" tagId="'+ e.propertyId+'">'+ comm.getStrLen(e.propertyName,18)+'</a>';
                            }else if(i>=10){
                                html2+='<a href="/pages/discover/discover_tagSubject.html#tId='+ e.propertyId+'" class="al-contentTagItem" tagId="'+ e.propertyId+'">'+ comm.getStrLen(e.propertyName,18)+'</a>';
                            }
                        }
                    })
                    var tagDom="",tagDom2="";
                    if(html!="") {
                        tagDom = ' <section class="al-contentItem al_mtb_20">' +
                            '   <header class="al-contentItemTitle">' +
                            '   <h2>标签推荐</h2>' +        //<i class="al-contentItemTitleIcon"></i>
                            '   </header>' +
                            '   <section class="al-contentTagRecommend">' +
                            html +
                            '   </section>' +
                            '   </section>';
                        //$('.ev_flow').eq(6+ t.number.tagPage*20).after(tagDom);
                        $('.ev_flow').eq(6+ t.number.tagPage*20).css('borderBottom','1px solid #ebe9ed').after(tagDom);
                        $('.ev_flow').eq(6+ t.number.tagPage*20).find('.al-contentText,.al-tableBoxInnerWrap').css('borderBottom','none');
                        $(".ev_operateTag").off("click").on("click",function(){
                            //事件埋点
                            comm.creatEvent({
                                async:false,
                                triggerType:"广告",
                                keyword:$(this).attr("tagName"),
                                actionId:62,
                                refId:$(this).attr("tagId"),
                                pushMessageId:$(this).attr("itemId")
                            });
                        });
                    }
                    if(html2!='') {
                        tagDom2= ' <section class="al-contentItem al_mtb_20">' +
                            '   <header class="al-contentItemTitle">' +
                            '   <h2>标签推荐</h2>' +        //<i class="al-contentItemTitleIcon"></i>
                            '   </header>' +
                            '   <section class="al-contentTagRecommend">' +
                            html2 +
                            '   </section>' +
                            '   </section>';
                        t.tagDom2 = tagDom2;
                        //$('.ev_flow').eq(16+ t.number.tagPage*20).after(tagDom2);
                    }
                    var scoreList = q.responseObject.responseData.score_list;
                    if(scoreList&&scoreList.length>0){
                        for (var i in scoreList[0]){
                            if(i==1){
                                t.tagRecScore=scoreList[0][i];
                            }
                        }
                    }
                }
                t.number.tagPage++;
            };
            comm.ajax.async(t.path.getRecommendTag,_params,_callback,(noLoading?"true":""));
        },
        //医师推荐列表
        docRecList:function(noLoading){
            var t=this;
            var _params ={paramJson: $.toJSON({
                customerId: t.opt.cid!=""&& t.opt.cid!=undefined? t.opt.cid:"",
                pageIndex:t.number.docPage+1,
                pageSize:3,
                scene:10,
                flag:1,
                score:t.docRecScore?t.docRecScore:0,
                sessionCustomerId:$('#sesCustomerId').val()||"",
                platformId:$('#sesDepartment').val()
            })};
            var callback =function(d){
                if(d&& d.responseObject.responseData&&!$.isEmptyObject(d.responseObject.responseData)&&d.responseObject.responseData.data_list){
                    var item =d.responseObject.responseData.data_list;
                    var len =$('.ev_flow').length;//<i class="al-contentItemTitleIcon"></i>
                    var docDom ='<section class="al-contentItem al_mtb_20"><header class="al-contentItemTitle"><h2>医师推荐</h2></header><section class="ev-docRecommend01"></section></section>';
                    $(docDom).insertAfter($('.ev_flow').eq(19+t.number.docPage*15));
                    $('.ev_flow').eq(19+t.number.docPage*15).css('borderBottom','1px solid #e9ebed').find('.al-contentText,.al-tableBoxInnerWrap').css('borderBottom','none');
                    $('.ev-docRecommend01').eq(t.number.docPage).html(module.indexListTem.docRecommendList(item))
                        .find('.al-doctorMsg:eq(2)').css('borderBottom','none');
                    t.number.docPage++;
                    var scoreList = d.responseObject.responseData.score_list;
                    if(scoreList&&scoreList.length>0){
                        for (var i in scoreList[0]){
                            if(i==1){
                                t.docRecScore=scoreList[0][i];
                            }
                        }
                    }
                    $(".ev_operate").off("click").on("click",function(){
                        //事件埋点
                        comm.creatEvent({
                            triggerType:"广告",
                            keyword:$(this).attr("username"),
                            actionId:62,
                            refId:$(this).attr("itemId"),
                            pushMessageId:$(this).attr("itemId")
                        });
                    });
                }
            };
            comm.ajax.async(t.path.getRecommendDoctor,_params,callback,(noLoading?"true":""));
        },
        topNList:function(){
            var t=this;
            $.ajax({
                url: t.path.topNList,
                type:"post",
                data:{paramJson: $.toJSON({channelId:naviType.getRes().getResourceId(),firstResult:(0+ parseInt(t.number.topNpage*2)),maxResult:2,sessionCustomerId:$('#sesCustomerId').val()||"",platformId:$('#sesDepartment').val()})},
                dataType:'json',
                success:function(d){
                    if(d&& d.responseObject.responseData&&!$.isEmptyObject(d.responseObject.responseData)&& d.responseObject.responseData.data_list.length){
                        var item = d.responseObject.responseData.data_list;
                        $.each(item,function(i,el){
                            if(el.data_list.length>0){
                                var _el = el.data_list;
                                if(el.itemType==15){//top5榜单
                                    var topHtml='';
                                    var attUrl;
                                    var topDom='';
                                    $.each(_el,function(j,jl){
                                        attUrl=jl.picUrl.split('|')[0];
                                        //attUrl
                                        topHtml+=module.indexListTem.topNList({
                                            attUrl:attUrl,
                                            resUrl:jl.itemUrl,
                                            resName:jl.itemTitle,
                                            resDesc:jl.itemTitle,
                                            itemId:jl.itemId,
                                            itemType:jl.itemType
                                        });
                                    })
                                    topDom ='<section class="al-contentItem al_mtb_20">'+
                                        '<header class="al-contentItemTitle">'+
                                        '<h2>'+el.itemName+'</h2>'+
                                        '</header>'+
                                        '<section class="al-videoAlbumRank">'+
                                        topHtml+
                                        '</section></section>';
                                    //$('.ev_flow').eq((el.itemLocation-2)+ t.number.topNpage*20).after(topDom);

                                }
                                if(el.itemType==16||el.itemType==14){    //16 专题  14广告 同一种样式
                                    var speHtml="";
                                    $.each(_el,function(spi,spl){
                                        speHtml+=module.indexListTem.special({
                                            resUrl:spl.itemUrl,
                                            attUrl:spl.picUrl.split('|')[0],
                                            resName:spl.itemTitle,
                                            itemId:spl.itemId,
                                            itemType:spl.itemType,
                                            index:parseInt(t.number.topNpage*2)
                                        });
                                    });
                                    //$('.ev_flow').eq((el.itemLocation-2)+ t.number.topNpage*20).after(speHtml);
                                }
                                if(el.itemType==12){//活动
                                    var actHtml ="";
                                    $.each(_el,function(ai,al){
                                        actHtml+= module.indexListTem.activityList({
                                            resUrl:al.itemUrl,
                                            attUrl:al.picUrl.split('|')[0],
                                            resName:al.itemTitle,
                                            itemId:al.itemId,
                                            itemType:al.itemType,
                                            index:parseInt(t.number.topNpage*2)
                                        })
                                    });

                                }
                                if(el.itemType==13){
                                    var serHtml="";
                                    var serDom="";
                                    _el = _el.slice(0,9);
                                    $.each(_el,function(si,sl){
                                        serHtml+=module.indexListTem.tagVideoList({
                                            resUrl:sl.itemUrl,
                                            attUrl:sl.picUrl,
                                            playTime:sl.playTime,
                                            resName:sl.itemTitle,
                                            itemType:sl.itemType,
                                            itemId:sl.itemId
                                        })
                                    });
                                    serDom = '<section class="al-contentItem al_mtb_20">'+
                                        '      <header class="al-contentItemTitle">'+
                                        '      <h2>'+el.itemName+'</h2>'+
                                        '  </header>'+
                                        '  <section class="al-videoAlbumContent">'+
                                        serHtml+
                                        '</section></section>';

                                }
                                if(el.itemType==1||el.itemType==2||el.itemType==4||el.itemType==7){
                                    var _resHtml = "";
                                    $.each(_el,function(rei,rel) {

                                        var _attLength = rel.picNum;
                                        var _attUrl = "";
                                        if (_attLength != 0) {
                                            _attUrl = rel.picUrl.split('|');
                                            for(var i= 0,l=_attUrl.length;i<l;i++){//处理  【http://111,01:02:03,http://www】问题
                                                if(_attUrl[i]&&_attUrl[i].indexOf('http')==-1){
                                                    _attUrl.splice(i,1);
                                                }
                                            }
                                            _attLength = _attUrl.length;
                                        }
                                        if(rel.tplPath==286){
                                            var _temHtm = module.indexListTem.release({
                                                resUrl:rel.itemUrl,
                                                attUrl:_attUrl,
                                                resName:rel.itemTitle,
                                                itemId:rel.itemId,
                                                itemType:rel.itemType,
                                                index:parseInt(t.number.topNpage*2)
                                            })
                                        }else {
                                            var _temHtm = module.indexListTem.list({
                                                refType: rel.itemType,
                                                resUrl: rel.itemUrl,
                                                resName: rel.itemTitle,
                                                resDesc: rel.itemAbstract,
                                                isAward: 0,
                                                isAttend: 0,
                                                isNew: 0,
                                                isHot: rel.isHot,
                                                tplPath: rel.tplPath,
                                                resAuthor: ctrl.testInvalid(rel.ownerNameStr)?rel.ownerName:rel.ownerNameStr,
                                                resWatchCount: rel.browseNum.toWK(),
                                                attUrl: _attUrl,
                                                attLength: _attLength,
                                                id: rel.itemId,
                                                playTime: rel.playTime,
                                                videoType: rel.videoType,
                                                score:rel.currentStarLevel,
                                                scoreNum:rel.currentScoreNum,
                                                isShowActivityTag:rel.isShowActivityTag,
                                                activityTagName:rel.activityTagName,
                                                activityTagColor:rel.activityTagColor
                                            });
                                        }
                                        _resHtml += _temHtm;
                                    });
                                    _resHtml =_resHtml.replace(/ev_flow/,'');   //去除ev_flow类，不占用推荐流位置
                                }
                                if(el.itemType==3){
                                    var meetHtml ="";
                                    $.each(_el,function(mi,ml){
                                        meetHtml+= module.indexListTem.conferenceList({
                                            resUrl:ml.itemUrl,
                                            resName:ml.itemTitle,
                                            attUrl:ml.picUrl,
                                            startTime:ml.startTime,
                                            endTime:ml.endTime,
                                            place:ml.conLocation,
                                            itemId:ml.itemId,
                                            itemType:ml.itemType,
                                            index:parseInt(t.number.topNpage*2)
                                        });
                                    });
                                    //$('.ev_flow').eq((el.itemLocation-2)+ t.number.topNpage*20).after(meetHtml);
                                }
                                var TOP1="",TOP2="";
                                var TOP1_type,TOP2_type;
                                if(i==0){
                                    switch(parseInt(el.itemType)){
                                        case 15:TOP1 = topDom;TOP1_type=1;break;
                                        case 16:
                                        case 14:TOP1 =speHtml;break;
                                        case 12:TOP1 = actHtml;break;
                                        case 13:TOP1=serDom;TOP1_type=1;break;
                                        case 1:
                                        case 2:
                                        case 4:
                                        case 7:TOP1=_resHtml;break;
                                        case 3:TOP1=meetHtml;break;
                                    }
                                }else if(i==1){
                                    switch(parseInt(el.itemType)){
                                        case 15:TOP2 = topDom;TOP2_type=1;break;
                                        case 16:
                                        case 14:TOP2 =speHtml;break;
                                        case 12:TOP2 = actHtml;break;
                                        case 13:TOP2=serDom;TOP2_type=1;break;
                                        case 1:
                                        case 2:
                                        case 4:
                                        case 7:TOP2=_resHtml;break;
                                        case 3:TOP2=meetHtml;break;
                                    }
                                }
                                if(TOP1_type==1){
                                    $('.ev_flow').eq(3+ t.number.topNpage*20).css('borderBottom','1px solid #e4e9ed').after(TOP1);
                                    $('.ev_flow').eq(3+ t.number.topNpage*20).find('.al-contentText,.al-tableBoxInnerWrap').css('borderBottom','none');
                                }else{
                                    $('.ev_flow').eq(3+ t.number.topNpage*20).after(TOP1);
                                }
                                $(".ev_operate").off("click").on("click",function(){
                                    var pageIndex=$(this).attr("index")+1;
                                    //事件埋点
                                    comm.creatEvent({
                                        async:false,
                                        locationId:pageIndex+"-"+$(this).index(),
                                        triggerType:"广告",
                                        keyword:$(this).find("a").eq(0).text(),
                                        actionId:62,
                                        pushMessageId:$(this).attr("itemId"),
                                        refId:$(this).attr("itemId"),
                                        refType:$(this).attr("itemType")
                                    });
                                });
                                t.TOP2 = TOP2;
                                t.TOP2_type = TOP2_type;
                                $(".lazyImg").lazyload({
                                    //effect:"fadeIn",
                                    //event:"scrollstop"
                                    effect:"show",
                                    event:"scroll"
                                });
                            }
                        })

                    }
                    t.number.topNpage++;
                }

            });
        },
        getSideTags:function(){
            var t=this;
            var params = {paramJson: $.toJSON({firstResult:0,maxResult:5,visitSiteId:1,platformId:$('#sesDepartment').val()||1,sessionCustomerId:$('#sesCustomerId').val()||""})};
            var callback = function(data){
                comm.localData.storeLocalData(t.path.getTags,data);
                if(data&& data.responseObject.responseData&&!$.isEmptyObject(data.responseObject.responseData)&&data.responseObject.responseData.data_list){
                    var item =data.responseObject.responseData.data_list;
                    var opes =item.operationMapList;        //术士
                    var diseases =item.diseaseMapList;      //疾病
                    var specias =item.specialtyMapList;     //专业
                    if(specias.length){
                        var spe_html='';
                        $.each(specias,function(si,se){
                            spe_html+='<p><a href="/pages/discover/discover_major.html#type=major&tId='+se.refId+'">'+comm.getStrLen(se.refRename,26)+'</a></p>';
                        })
                        $('.ev_major').html(spe_html);
                    }
                    if(diseases.length){
                        var dis_html='';
                        $.each(diseases,function(di,de){
                            dis_html+='<p><a href="/pages/discover/discover_major.html#type=disease&tId='+de.refId+'">'+comm.getStrLen(de.refRename,26)+'</a></p>';
                        })
                        $('.ev_disease').html(dis_html);
                    }
                    if(opes.length){ //术士
                        var opes_html='';
                        $.each(opes,function(oi,oe){
                            opes_html+= '<p><a href="/pages/discover/discover_major.html#type=operation&tId='+oe.refId+'">'+comm.getStrLen(oe.refRename,26)+'</a></p>';
                        });
                        $('.ev_opes').html(opes_html);
                    }
                }
            };
            comm.localData.getLocalData({
                path: t.path.getTags,
                exhibitionData: callback,
                requestData: function () {
                    comm.ajax.async(t.path.getTags,params,callback);
                }
            });

        },
        setImgWidth:function(){
            var rem =function(opx) {
                var px = parseInt(opx);
                return (px / 75) + 'rem';
            };
            $(".al-contentUpTitleDownImg .al-contentMiddleImg").each(function(index, element) {
                var ele = $(element).find('li');
                switch (ele.length) {
                    case 2:
                        ele.width(rem(270));
                        ele.height(rem(180));
                        break;
                }
            });
        },
        viewBigImg:function(){
            $('.al-contentImgList>a').off("click").on('click',function(){
                var src = $(this).attr("href");
                var _a = $(this).parent().find("a");
                var _l = 0;
                for(var i=0; i<_a.length;i++){
                    if(/http/g.test(_a.eq(i).attr("href"))){
                        _l ++;
                    }
                }
                if(!/http/g.test(src)){
                    module.viewBigImgAll({
                        container:$(this).parent(),
                        typeTitle: "",
                        index: $(this).index()-_l,
                        reverse:"reverse"
                    });
                }
            })
        },
        scrollPage:function(){
            var t=this;
            var pagenumber=2;
            var f = t.params.firstResult;
            var m = t.params.maxResult;
            var top = 200;//$('.ev_scrollPage').offset().top;
            $('.ev_resBox').scrollPagination({
                'contentPage': naviType.getRes().getName(),
                'contentData': $.extend(t.params, {
                    pageIndex: function () {
                        return pagenumber++;
                    }
                }),
                'scrollTarget': $(window),
                'heightOffset': 1000, // it gonna request when scroll is 10 pixels before the page ends
                'delaytime': 1000,
                'type': "post",
                'dataType':"json",
                'beforeLoad': function () {
                    $('.al-loadMoreImg').show();
                },
                'afterLoad': function (elementsLoaded) {
                    $('.al-loadMoreImg').hide();
                },
                'loader': function (data) {
                    if ($.isEmptyObject(data)) {
                        $(".ev_resBox").attr("scrollPagination", "disabled");
                        //alert("没有内容了");
                        return false;
                    } else {
                        if ($.isEmptyObject(data.responseObject.responseData) || (data.responseObject.responseData.data_list && data.responseObject.responseData.data_list.length == 0)) {
                            $(".ev_resBox").attr("scrollPagination", "disabled");
                            //alert("没有内容了2");
                            return false;
                        } else {
                            var items = data.responseObject.responseData.data_list;
                            var scoreList=data.responseObject.responseData.score_list;
                            if(scoreList&&scoreList.length>0){
                                for (var i in scoreList[0]){
                                    if(i==1){
                                        t.params.score=scoreList[0][i];
                                    }
                                }
                            }
                            var itemsLength = items.length;
                            var html='',attUrl,attLength,_html,picUrl;
                            $.each(items,function(_ei,_elei){
                                attLength = _elei.picNum;
                                if(attLength!=0){
                                    attUrl = _elei.picUrl.split('|');
                                    for(var i= 0,l=attUrl.length;i<l;i++){
                                        if(attUrl[i].indexOf('http')==-1){
                                            attUrl.splice(i,1);
                                        }
                                    }
                                    attLength = attUrl.length;
                                }else{
                                    attUrl="";
                                }
                                _html = module.indexListTem.list({
                                    refType:_elei.itemType,
                                    resUrl:_elei.itemUrl,
                                    resName:_elei.itemTitle,
                                    resDesc:_elei.itemAbstract,
                                    isAward:_elei.isAward,
                                    isAttend:_elei.isAttend,
                                    isNew:_elei.isNew,
                                    isHot:_elei.isHot,
                                    tplPath:_elei.tplPath,
                                    resAuthor:ctrl.testInvalid(_elei.ownerNameStr)?_elei.ownerName:_elei.ownerNameStr,
                                    resWatchCount:_elei.browseNum.toWK(),
                                    attUrl:attUrl,
                                    attLength:attLength,
                                    id:_elei.itemId,
                                    playTime:_elei.playTime,
                                    score:_elei.currentStarLevel,
                                    scoreNum:_elei.currentScoreNum,
                                    isShowActivityTag:_elei.isShowActivityTag,
                                    activityTagName:_elei.activityTagName,
                                    activityTagColor:_elei.activityTagColor
                                });
                                html+=_html;
                            });
                            $('.ev_resBox').append(html);

                            if(pagenumber%2==0){
                                if(itemsLength>4){
                                    t.topNList();
                                }
                                if(itemsLength>7){
                                    t.tagRecList(true);
                                }
                                //if(itemsLength>19){
                                //t.docRecList(true);
                                //}
                            }else{
                                var _evTagDom = $('.ev_flow').eq(16+ (t.number.tagPage-1)*20);
                                _evTagDom.css('borderBottom','1px solid #e9ebed').after(t.tagDom2);
                                _evTagDom.find('.al-contentText,.al-tableBoxInnerWrap').css('borderBottom','none');
                                //$('.ev_flow').eq(16+ (t.number.tagPage-1)*20).after(t.tagDom2);

                                t.tagDom2="";
                                var _topDom = $('.ev_flow').eq(13+ (t.number.topNpage-1)*20);
                                _topDom.after(t.TOP2);
                                if(t.TOP2_type==1){
                                    _topDom.css('borderBottom','1px solid #e9ebed').find('.al-contentText,.al-tableBoxInnerWrap').css('borderBottom','none');
                                }
                                t.TOP2="";
                                t.docRecList(true);
                            }
                            //推荐资源添加事件埋点
                            $(".ev_operate").off("click").on("click",function(){
                                //事件埋点
                                comm.creatEvent({
                                    async:false,
                                    locationId:$(this).index()+1,
                                    triggerType:"广告",
                                    keyword:$(this).find("a").eq(0).text()||$(this).find("a").eq(1).text(),
                                    actionId:62,
                                    pushMessageId:$(this).attr("itemId"),
                                    refId:$(this).attr("itemId"),
                                    refType:$(this).attr("itemType")
                                });
                            });
                            //推荐标签添加事件埋点
                            $(".ev_operateTag").off("click").on("click",function(){
                                //事件埋点
                                comm.creatEvent({
                                    async:false,
                                    triggerType:"广告",
                                    keyword:$(this).text(),
                                    actionId:62,
                                    pushMessageId:$(this).attr("itemId"),
                                    refId:$(this).attr("tagId")
                                });
                            });
                            $(".lazyImg").lazyload({
                                //effect:"fadeIn",
                                //event:"scrollstop"
                                effect:"show",
                                event:"scroll"
                            });
                            module.dislikeAction();
                            t.viewBigImg();
                            if(items.length< t.params.pageSize){
                                $(".ev_resBox").attr("scrollPagination", "disabled");
                                //alert("没有内容了3");
                                return false;
                            }
                        }
                    }
                }
            });
        }
    };
    ctrl.init();
    $(document).on('click','.al-contentImgList>a',function(){
        var _index = $(this).index();
        var _src = $(this).parent('.al-contentImgList').find('img').eq(0).attr('src');
        if(/vpro/g.test(_src)){
            if(_index==0||_index==1){
                _index = 0;
            }else{
                _index = _index-1;
            }
        }

    });
    scene.TopHeadLoginCallback= function(){
        ctrl.init('reloadData');
    };
});
