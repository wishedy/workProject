/**
 * @name:
 * @desc:
 * @example:
 * @depend:
 * @date: 2016/8/12
 * @author: sunhaibin
 */
$(function(){
    var obj={
        cid:$('#sesCustomerId').val()
    };
    var ctrl={
        path:{
            followTagUrl:PC_CALL+'customer/follow_resource/createFollowResource/',//followType4,7,  61
            tagListUrl:PC_CALL+'comm/data/property/getMapList/'
        },
        params:{
            customerId:(obj.cid!=''&&obj.cid!=undefined)?obj.cid:'',
            pageIndex:1,
            pageSize:20,
            visitSiteId:1,
            resourceNum:1,
            sortType:2,
            platformId:$('#sesDepartment').val()
        },
        init:function(){
            this.commonSearch();
            this.localFilterSearch();
        },
        //初始搜索+分页
        commonSearch:function(x){
            var t=this;
            if(x){//判断从发布登录重新获取资源
                $(".al-release_popBox").attr('reloadData',1);
                t.params.customerId = $('#sesCustomerId').val();
                t.params.platformId = $('#sesDepartment').val();
            }
            var callBack =function(o){
                t.params.pageIndex = o;
                t.getTags(function(n){
                    $('.pager').pager({pagenumber:o,pagecount:n,buttonClickCallback:callBack});
                });
            };
            t.getTags(function(n){
                $('.pager').pager({pagenumber:1,pagecount:n,buttonClickCallback:callBack});
            });

        },
        getTags:function(fn){
            var t=this;
            var _params = {paramJson: $.toJSON(t.params)};
            var _callback =function(d){
                if(d&& !$.isEmptyObject(d.responseObject.responseData)){
                    //推荐标签
                    if(d.responseObject.responseData.data_list.length){
                        var item = d.responseObject.responseData.data_list;
                        var html='';
                        $.each(item,function(i,e){
                            //var total_num = e.caseNum+ e.videoNum+ e.topicNum+ e.docNum;
                            var total_num = e.resourceNum;
                            html+= t.listTemp({
                                tagName: e.propertyName,
                                totalNum:total_num,
                                tagId:e.propertyId,
                                isFollow: parseInt(e.isFollow)
                            });
                        });

                        $('.ev_tagBox').show().html(html);
                        var pageCount = Math.ceil(d.responseObject.responseData.total_count/20);
                        fn&&fn(pageCount);
                    }else{
                        $(noMatch).insertBefore('.ev_tagBox');
                        $('.ev_tagBox').hide();
                    }
                    //热门标签
                    if(d.responseObject.responseData.hot_list.length&& t.params.pageIndex==1){
                        var _ite = d.responseObject.responseData.hot_list;
                        var _html='';
                        $.each(_ite,function(j,m){
                            if(j<5){
                                _html+= t.hotListTemplate({
                                    tagId: m.propertyId,
                                    tagName: m.propertyName,
                                    followNum: m.followNum,
                                    isFollow: parseInt(m.isFollow)
                                })
                            }
                        });
                        $('.al-discover_noMatchMain_body').hide();
                        $('.ev_hotTagBox').html(_html);
                        $('.ev_totalCount').text(d.responseObject.responseData.total_count);
                    }
                    $('.ev_tag_follow').each(function(){    //关注
                        $(this).followTag({
                            followType:61,
                            canToggle:false
                        });
                    });
                }else{
                    $('.ev_tagBox').hide();
                    $('.al-discover_noMatchMain_body').show();
                }
            };
            comm.ajax.async(t.path.tagListUrl,_params,_callback);
        },
        localFilterSearch:function(){
            var t=this;
            var val='';
            var getTag=function(str){//str 搜索的值
                var html='';
                var _temp='';
                var _temParam  = $.extend({},t.params,{resourceNum:1,propertyName:str});
                var _params = {paramJson: $.toJSON(_temParam)};
                $.ajax({
                    url: t.path.tagListUrl,
                    type:"post",
                    data:_params,
                    dataType:'json',
                    success:function(data){
                        if(data&& data.responseObject.responseData&&!$.isEmptyObject(data.responseObject.responseData)&&data.responseObject.responseData.data_list.length){
                            var ite = data.responseObject.responseData.data_list;
                            $.each(ite,function(m,me){
                                if(m<5){
                                    _temp += "<p tagId='"+me.propertyId+"'>"+me.propertyName+"</p>";
                                }
                            });
                        }
                        $('.searchTipBox').html(_temp);
                        $('.searchTipBox p').on('click',function(){
                            var href = '/pages/discover/discover_tagSubject.html#tId='+$(this).attr('tagId');
                            g_sps.jump(null,href);
                        });
                        $('body:not(".searchTipBox")').click(function(){
                            $('.searchTipBox').empty();
                        });
                    }
                });
            };
            var flag = true;
            var timer = null;
            $(".al-discoverZJ_searchBox").bind('compositionstart',function(){
                flag = false;
            });
            $(".al-discoverZJ_searchBox").bind('compositionend',function(){
                flag = true;
            });
            $('.al-discoverZJ_searchBox').on('input propertychange keyup',function(e){
                clearTimeout(timer);
                val = $('.al-discoverZJ_searchBox input').val();
                timer = setTimeout(function(){
                    if(flag){
                        if(e.which===13){//提交请求资源
                            if(val!=""){
                                t.localCommonSearch(val);
                                $('.searchTipBox').empty();
                                $('.al-discoverZJ_searchBox input').val(val);
                            }else{
                                t.commonSearch();
                            }
                        }else{
                            if(val!=""){
                                getTag(val);
                            }
                        }
                    }
                },500);


            }).find('i').on('click',function(){
                val = $('.al-discoverZJ_searchBox input').val();
                comm.creatEvent({
                    triggerType:'搜索',
                    keyword:val,
                    actionId:10
                });
                if(val!=""){
                    t.localCommonSearch(val);
                    $('.al-discoverZJ_searchBox').val(val);
                    $('.searchTipBox').empty();
                }else{
                    t.commonSearch();
                }
            });
        },
        localCommonSearch:function(val){
            var t=this;
            var callback = function(o){
                t.localSearch(val,function(n){
                   $('.pager').pager({pagenumber:o,pagecount:n,buttonClickCallback:callback});
                },o);
            };
            t.localSearch(val,function(n){
                $('.pager').pager({pagenumber:1,pagecount:n,buttonClickCallback:callback});
            },1);
        },
        //局部搜索
        localSearch:function(val,fn,x){ //搜索的值，fn,pageIndex
            var t=this;
            var _temParam  = $.extend({},t.params,{resourceNum:1,propertyName:val,pageIndex:x});
            var _params = {paramJson: $.toJSON(_temParam)};
            var _callback =function(d){
                    if(d&& !$.isEmptyObject(d.responseObject.responseData.data_list)){
                        var item = d.responseObject.responseData.data_list;
                        var html='';
                        $.each(item,function(i,e){
                            //var total_num = e.caseNum+ e.videoNum+ e.topicNum+ e.docNum;
                            var total_num = e.resourceNum;
                            html+= t.listTemp({
                                tagName: e.propertyName,
                                totalNum:total_num,
                                tagId:e.propertyId,
                                isFollow: parseInt(e.isFollow)
                            });
                        });
                        $('.ev_tagBox').show().html(html);
                        $('.ev_tag_follow').each(function(){
                            $(this).followTag({
                                followType:61,canToggle:false
                            });
                        })
                        $('.al-discover_noMatchMain_body').hide();
                        $('.ev_totalCount').text(d.responseObject.responseData.total_count);
                        var pageCount = Math.ceil(d.responseObject.responseData.total_count/20);
                        fn&&fn(pageCount);
                    }else{
                        $('.ev_tagBox').html("").hide();
                        $('.al-discover_noMatchMain_body').show();
                        $('.pager').empty();
                    }
            };
            comm.ajax.async(t.path.tagListUrl,_params,_callback);
        },
        listTemp:function(kv){
            var html = ' <article class="al-personalFollowTagItem" tagId="'+kv.tagId+'">'+
                       '     <a href="/pages/discover/discover_tagSubject.html#tId='+kv.tagId+'">'+
                       '     <h2 class="al-personalFollowTagTitle">'+comm.getStrLen(kv.tagName,60)+'</h2>'+
                       '     <p class="al-personalFollowTagNums"><span>'+kv.totalNum+'</span>个资源</p>'+
                       ' <b class="ev_tag_follow '+(kv.isFollow==1?'followedBtn':'followBtn')+'" tagId="'+kv.tagId+'" isFollow="'+kv.isFollow+'" tagName="'+kv.tagName+'"></b>'+
                       '     </a>'+
                       '     </article>';
            return html;
        },
        hotListTemplate:function(kv){
            var html = ' <div class="al-discover_MatchSide">'+
                       ' <figure class="al-discover_MatchSideText">'+
                       ' <p><a href="/pages/discover/discover_tagSubject.html#tId='+kv.tagId+'">'+comm.getStrLen(kv.tagName,30)+'</a></p>'+
                       ' <div>'+
                       '<a href="/pages/discover/discover_tagFollowers.html?tId='+kv.tagId+'">'+kv.followNum+'</a>人关注'+
                       ' </div>'+
                       ' </figure>'+
                       ' <i class="ev_tag_follow '+(kv.isFollow==1?'followedBtn':'followBtn')+'" tagId="'+kv.tagId+'" isFollow="'+kv.isFollow+'" tagName="'+kv.tagName+'"></i>'+
                       ' </div>';
            return html;
        }

    };
    ctrl.init();
    //顶部导航登录回调
    scene.TopHeadLoginCallback= function(){
        ctrl.commonSearch('reloadData');
    };
});