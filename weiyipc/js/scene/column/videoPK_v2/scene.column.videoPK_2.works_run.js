/**
 * 功能描述：videoPK-全部作品列表
 * 使用方法:
 * 注意事件：
 * 引入来源：  作用：
 * created by Sunhaibin on 2015-11-20
 * */

$(function(){
    comm.scrollFloating({float:$('.works_lists_nav'),maxObj:$('.works_lists'),top:70});
    module.videoPKShare({});
    var videoPK_allwork={
        config:{
            url:PC_CALL+"resources/search/search_list_activty/",
            getMapList:PC_CALL+"activity/property/getMapList/",
            title_url:"",
            activityId:$("#activityId").val()
        },
        init:function(){
            var t = this;
            t.mediaType="video";
            t.order="publishTime";
            t.activityType=1;
            t.getTags();
            t.commonSearch();
            t.searchBtn();
            t.leftBtn();
            t.topBtn();
        },
        commonSearch:function(tagid,aa){
            var t = this;
            var auth=aa;
            var l = $("#sesCustomerId").val();
            t.ajaxFn({
                url:t.config.url,
                param:{sessionCustomerId:l,author:auth,mediaType:t.mediaType,order:t.order,pageIndex:1,activityIds:t.config.activityId,propertyIds
                    :tagid},
                fn:function(data){
                    t.addHtml(data);
                    $(".pager").pager({ pagenumber: 1, pagecount: data.dataJson.rows.pageCount, buttonClickCallback: PageClick });
                }
            });
            PageClick = function(pageclickednumber){
                t.ajaxFn({
                    url: t.config.url,
                    param:{visitSiteId:1,mediaType:t.mediaType,order:t.order,pageIndex:pageclickednumber,activityIds:t.config.activityId,propertyIds
                        :tagid},
                    fn:function(data){
                        $(".pager").pager({ pagenumber: pageclickednumber, pagecount: data.dataJson.rows.pageCount, buttonClickCallback: PageClick });
                        t.addHtml(data);
                    }
                });
            };
        },
        ajaxFn:function(opt){
            comm.LightBox.showloading();
            var o=opt;
            $.ajax({
                url:o.url,
                type:'post',
//      		data:{paramJson:$.toJSON(o.param)},
                data:o.param,
                dataType:'json',
                success:function(data){
                    comm.LightBox.hideloading();
                    if(data){
                        o.fn(data)
                    }
                },
                error:function(XMLHttpRequest,textStatus,errorThrown){
//      			alert(textStatus+" "+errorThrown);
                }
            })
        },
        getTags:function(){
            var t=this;
            t.ajaxFn({		//
                url:t.config.getMapList,
                param:{paramJson:$.toJSON({activityId:t.config.activityId,activityType:t.activityType,parentId:0})},
                fn:function(data){
                    var vPktags='<li class="nav_on">全部</li>';
                    if(data&&data.responseObject.responseData){
                        var data=data.responseObject.responseData;
                        if(data.list&&data.list.length>0){
                            for(var vt=0,vtl=data.list.length;vt<vtl;vt++){
                                var item=data.list[vt];
                                var isExistResource=item.cms_activity_property.isExistResource;
                                if(item.cms_activity_property.parentId===0){
                                    if(isExistResource==1){
                                        vPktags+='<li tagId="'+item.cms_activity_property.propertyId+'">'+item.cms_activity_property.propertyName +'</li>';
                                    }
                                }
                            }
                        }
                        $('.works_lists_nav li').remove();
                        $('.works_lists_nav ul').append(vPktags);
                    }
                }
            })
        },
        searchBtn:function (){
            var t = this;
            $(".search input").bind("keyup",function(event){
                var searchParam=$(this).val();
                var html="";
                <!--联想搜索:start-->
                //if (event.keyCode==32||event.keyCode==8||event.keyCode>=48&&event.keyCode<=105){
                //    var lenoverJson={
                //        "treeLevel":'',          //级别ID    （3-）
                //        "searchParam":searchParam,        //搜索词
                //        "pageIndex":1,         //起始记录数
                //        "visitSiteId":"2",     // 站点id
                //        "pageSize":6           //记录条数
                //    };
                //    var params= {paramJson:$.toJSON(lenoverJson)};
                //    $.ajax({
                //        type : "post",
                //        url : "/call/search/searchPrompt/",
                //        data : params,
                //        dataType : "json",
                //        success : function(data){
                //            if(data&&data.responseObject&&data.responseObject.responseData){
                //                var data_list=data.responseObject.responseData.data_list;
                //                if(data_list&&data_list.length>0){
                //                    var array=data_list.slice(0,6);
                //                    $.each(array,function(i,val){
                //                        var propertyName=val.propertyName;
                //                        html+='<dd>'+propertyName+'</dd>';
                //                    });
                //                    if (searchParam.length>0){
                //                        $(".search .searchSelect").show();
                //                        $(".search .searchSelect").html(html);
                //                        <!--弹出下拉列表搜索:start-->
                //                        $('.search .searchSelect dd').bind("click",function(){
                //                            var aa=$(this).text();
                //                            $(".search input").val(aa);
                //                            $(".search .searchSelect").html("");
                //                            $(".search .searchSelect").hide();
                //                            var tg =$('.works_lists_nav').find('li.nav_on').attr('tagid');
                //                            t.commonSearch(tg,aa);
                //                            $('.works_lists_nav li').eq(0).siblings().hide();
                //                            $('.works_run_cont_center').css('padding-top','0');
                //                            $('.backBtn').show();
                //                            $('.page-container').hide();
                //                        });
                //                        <!--弹出下拉列表搜索:end-->
                //                    }
                //                }else{
                //                    //搜索无匹配结果时下拉框隐藏
                //                    $(".search .searchSelect").html("");
                //                    $(".search .searchSelect").hide();
                //                }
                //            }
                //        }
                //    });
                //
                //}
                <!--联想搜索:END-->
                //输入框无输入值时隐藏联想提示框,否则当用户回车时搜索匹配的全部资源
                if(searchParam.length<=0){
                    $(".search .searchSelect").css("display","none");
                    $(".search .searchSelect").html("");
                }else{
                    //当用户键入会车时搜索匹配的全部
                    var ev=event||window.event;
                    if (ev.keyCode==13){
                        $(".search .searchSelect").css("display","none");
                        $(".search .searchSelect").html("");
                        var tg =$('.works_lists_nav').find('li.nav_on').attr('tagid');
                        t.commonSearch(tg,searchParam);
                        $('.works_lists_nav li').eq(0).siblings().hide();
                        $('.works_run_cont_center').css('padding-top','0');
                        $('.backBtn').show();
                        $('.page-container').hide();
                    }
                }
            });
        },
        leftBtn:function(){
            var t= this;
            $('.works_lists_nav').on('click','li', function(){
                $(this).addClass('nav_on').siblings('li').removeClass('nav_on');
                var tagid = $(this).attr("tagid");
                t.commonSearch(tagid);
                return false;
            })
        },
        topBtn:function(){
            var t= this;
            $(".searchBox li:not(.search)").each(function(){
                $(this).on("click",function(e){
                    $(this).addClass("search_on").siblings('li').removeClass('search_on');
                    var index = $(this).index();
                    var tgs =$('.works_lists_nav').find('li.nav_on').attr('tagid');
                    switch(index){
                        case 1:
                            t.order = "preferUpNum";
                            break;
                        case 0:
                            t.order="publishTime";
                            break;
                        case 2:
                            t.order ="browse";
                    };
                    t.commonSearch(tgs);
                    e.preventDefault();
                })
            })

        },
        addHtml:function(data){
            var t=this;
            var content='';
            var per_jump = "";
            if(data&&data.dataJson.rows&&data.dataJson.rows.total>0){
                for(var i=0,l=data.dataJson.rows.items.length;i<l;i++){
                    var imgUrl='/images/img10/default/loading/225_150.jpg',playTime = "",tximgUrl = "";
                    var item = data.dataJson.rows.items[i];
                    //获取头像
                    if(item.customerLogoUrl){
                        tximgUrl = item.customerLogoUrl.logoUrl
                    }else{
                        tximgUrl = "/images/img10/default-user/doctor01.jpg"
                    }

                    //判断头像跳转是否是自己
                    if($("#sesCustomerId").val()){
                        if(item.customerId==$("#sesCustomerId").val()){
                            per_jump = "javascript:;"
                        }else{
                            per_jump = "/pages/personal/others_contribution.html?cid="+item.customerId
                        }
                    }else{
                        per_jump = "/pages/personal/others_contribution.html?cid="+item.customerId
                    }

                    if(t.mediaType=="case"){
                        if(data.dataJson.caseAttList){
                            for(var j=0,len=data.dataJson.caseAttList.length;j<len;j++){
                                var cL = data.dataJson.caseAttList[j];
                                if(item.id==cL.caseId){
                                    imgUrl=cL.caseAttUrl;

                                }
                            }
                        }

                    }else if(t.mediaType=="video"){
                        playTime = "<span>"+item.playTime+"</span>";
                        if(data.dataJson.videoAttList){
                            for(var j1=0,len1=data.dataJson.videoAttList.length;j1<len1;j1++){
                                var vL = data.dataJson.videoAttList[j1];
                                if(item.id==vL.videoId){
                                    imgUrl=vL.videoAttUrl;
                                }
                            }
                        }
                    }
                    content  += "<div class='works_lists_piece'>"+
                        "<div class='works_lists_piece_left'>"+
                        "<a href='"+item.toUrl+"'><h3>"+comm.getStrLen(item.title,40)+"</h3></a>"+
                        "<p>"+comm.getStrLen(item.summay,88)+"</p>"+
                        "<ul>"+
                        "<li class='play_number'>"+item.browse+"</li>"+
                        "<li class='discuss_number'>"+item.reviewNum+"</li>"+
                        "<li class='assist_number'>"+(item.upNumNew==""||item.upNumNew==undefined?"0":item.upNumNew)+"</li>"+
                        "<li>"+item.publishTime.substring(0,10)+"</li>"+
                        "</ul>"+
                        "</div>"+
                        "<div class='works_lists_piece_center'>"+
                        "<a href='"+item.toUrl+"'>"+
                        "<img src='" +imgUrl+ "'>"+
                        "</a>"+
                        playTime+
                        '<img class="video_btn" src="/images/img10/v3/common/icon/video_btn.png">'+
                        "</div>"+
                        "<div class='works_lists_piece_right'>"+
                        "<dl>"+
                        "<dt><a href='"+per_jump+"'><img src='"+tximgUrl+"'></a></dt>"+
                        "<dd class='doc_name'><a href='"+per_jump+"'>"+comm.getStrLen(item.author,12)+"</a></dd>"+
                        "<dd class='hos_name'><a href='"+per_jump+"'>"+comm.getStrLen(($.isEmptyObject(item.company)?"":item.company),16)+"</a></dd>"+
                        "<dd class='assist "+(item.isPrefer==0?"assist_Def":"assist_Win")+"'>"+(item.isPrefer==0?"点赞":"已赞")+"</dd>"+
                        "</dl>"+
                        "</div>"+
                        "<div style='clear:both;'></div>"+
                        "<p class='zanWin'>点赞成功</p>"+
                        "<p class='zanDef'>取消点赞成功</p>"+
                        "</div>"

                }
                $('.works_lists_piece_box').empty().append(content);
                $('.works_lists').css({minHeight:$('.works_lists_nav')[0].offsetHeight+100});
                $(".works_lists_piece_box img").lazyload({
                    effect:"fadeIn",
                    event:"scrollstop"
                });
                //点赞
                $('.assist').click(function(){
                    var _that = $(this);
                    var asIndex = $('.assist').index($(this));
                    var videoID = data.dataJson.rows.items[asIndex].id;
                    //var isZan = data.dataJson.rows.items[asIndex].isPrefer;
                    user.login({
                        callback:function(){
                            var params = {paramJson: $.toJSON({
                                customerId:$("#sesCustomerId").val(),
                                refId:videoID,
                                usefulType:1,
                                upDownType:1
                            })}
                            if(_that.hasClass('assist_Def')){
                                $.ajax({
                                    url:"/call/prefer/create/",
                                    type:"post",
                                    data:params,
                                    dataType:'json',
                                    success:function(data) {
                                        _that.removeClass('assist_Def').addClass('assist_Win').html("已 赞").parents('.works_lists_piece_right').siblings('.zanWin').show().siblings('.zanDef').hide();
                                        setTimeout(function(){ _that.parents('.works_lists_piece_right').siblings('.zanWin').hide()},3000);
                                        var asNum = _that.parents('.works_lists_piece_right').siblings('.works_lists_piece_left').find('.assist_number');
                                        var asNumA = parseInt(asNum.text())+1;
                                        asNum.text(asNumA);
                                    }
                                })
                            }else{
                                $.ajax({
                                    url:"/call/prefer/delete/",
                                    type:"post",
                                    data:params,
                                    dataType:'json',
                                    success:function(data) {
                                        _that.removeClass('assist_Win').addClass('assist_Def').html("点 赞").parents('.works_lists_piece_right').siblings('.zanDef').show().siblings('.zanWin').hide();
                                        setTimeout(function(){ _that.parents('.works_lists_piece_right').siblings('.zanDef').hide() },3000);
                                        var asNum = _that.parents('.works_lists_piece_right').siblings('.works_lists_piece_left').find('.assist_number');
                                        var asNumC = parseInt(asNum.text())>1?parseInt(asNum.text())-1:0;
                                        asNum.text(asNumC);
                                    }
                                })
                            }
                        },
                        scene:privilegeSceneConst.eSceneTypeFellow
                    });
                })
                $(this).parents('.works_lists_piece_right').siblings('.works_lists_piece_center').children('a').attr('href');
            }else{
                $('.works_lists_piece_box').empty().append('<p class="works_lists_no_search"></p>');
                $('.works_lists').css({minHeight:$('.works_lists_nav')[0].offsetHeight+100});
            }
        }
    }
    videoPK_allwork.init();
})

