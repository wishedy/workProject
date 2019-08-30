/**
 * 功能描述：
 * 使用方法:
 * 注意事件：
 * 引入来源：plugin.follow.js  作用：关注关系
 *
 * Created by LiChunHui on 2015/3/18.
 */
$(function(){

    var search={};
    search={
        config : {
            addAll:true,
            pageSize:20,
            conSize:3,
            logoPath:"//img05.allinmd.cn/",
            searchParam:$("#searchParam").val(),
            pagecount:$("#pageCount").val()
        },
        el : {
            pagination:$(".pagination")//分页按钮
        },
        path : {
            searchAll:PC_CALL+"search/searchAll/",
            caze:PC_CALL+"search/searchCase/",
            topic:PC_CALL+"search/searchTopic/",
            video:PC_CALL+"search/searchVideo/",
            conference:PC_CALL+"search/searchConference/",
            doc:PC_CALL+"search/searchDoc/",
            user:PC_CALL+"search/searchUser/"
        },
        init:function(){
            var t=this;
            t.para=comm.getpara();
            $(".word").text(t.config.searchParam?comm.getStrLen(t.config.searchParam,56):"");
            this.leftBtn();
            //右边跟随浮动
            comm.scrollFloating({
                float:$(".list_cont_left"),
                maxObj:$(".list_cont_right")
            });
            if(t.para.searchType=="conference"){
                $("#leftBtn li").eq(3).click();
            }else{
                /*$("#leftBtn li").each(function(i,em){
                    type=$(em).attr("type");
                    if($(em).find("span").text()>0){
                        $("#leftBtn li").removeClass("hover");
                        $(em).addClass("hover");
                        if(type!="user"){
                            t.commonSearch(type);
                        }else{
                            t.userSearch();
                        }
                        return false;
                    }
                })*/
                t.searchAll();
                $(".EV_userMore").on("click",function(){
                    $("#leftBtn li").eq(5).click();
                });
                $(".EV_conMore").on("click",function(){
                    $("#leftBtn li").eq(3).click();
                })
            }

        },
        leftBtn:function(){
            var t=this;
            $("#leftBtn li").bind("click",function(){
                t.config.addAll=false;
                type=$(this).attr("type");
                if($(this).attr("class")!="hover"){
                    $("#leftBtn li").removeClass("hover");
                    $(this).addClass("hover");
                    if(type!="user"){
                        t.commonSearch(type);
                    }else{
                        $(".EV_text").text("有关的用户内容");
                        t.userSearch();
                    }
                };

            });
        },
        searchAll:function(){
            var t=this;
            var data={
                searchParam: t.config.searchParam,
                logoUseFlag:UseFlag.c,
                useFlag:$("#sesCustomerId").val()?2:1,//  --登录传入2，不登录传入1
                attUseFlag:AttUseFlag.c,
                sortType:1
            };
            this.ajaxFn({
                url:t.path.searchAll,
                param:data,
                fn:function(data){
                    var caseHtml="",videoHtml="",docHtml="",topicHtml="",conHtml="",userHtml="",arrHT = [];
                    var sessionId = $("#sesCustomerId").val();
                    if(!t.config.addAll){
                        return false;
                    }
                    if(data&&data.responseObject&&data.responseObject.responseData){
                        $(".result").text(data.responseObject.responseData.total_count||0);
                        var data_list=data.responseObject.responseData.data_list;
                        if(data_list&&data_list.length>0){
                            $.each(data_list,function(i,val){
                                column_type=parseInt(val.column_type);
                                $.each(val.column_data,function(j,o){
                                    n = 11;
                                    var item = o;
                                    var time = title = author = source= summary='';
                                    var hasImg = imgUrl= toUrl = followNum = type = '';
                                    var num = 1;
                                    switch (column_type) {
                                        case 7://病例
                                            time = item.publishTime?item.publishTime.substring(0,10):'';
                                            title = item.name;
                                            imgUrl = item.logoUrl;
                                            toUrl = item.pageStoragePath;
                                            author = item.author;
                                            source ='';
                                            followNum= item.browseNum;
                                            summary = item.mainNarrate;
                                            hasImg = '<div class="search_all_right"><a href="' + toUrl + '" target="_blank"><img src="//img10.allinmd.cn/default/225_150.jpg" data-original="' + imgUrl + '" width="225" height="150"></a></div>';
                                            num=2;
                                            n=7;
                                            type="case";
                                            caseHtml+= '<li>' +
                                            '<div class="search_all_left search_'+type+'_icon"></div>' +
                                            '<div class="search_all_center0'+num+'">' +
                                            '<div class="search_all_c01_title"><a href="'+toUrl+'" target="_blank">'+title+'</a></div>' +

                                            '<div class="search_list_r_author">' +
                                            '<ul>' +
                                            (author?'<li>'+comm.getStrLen(author,n)+'</li><li class="pointer"></li>':'' )+
                                            (source?'<li>来源：'+comm.getStrLen(source,n)+'</li><li class="pointer"></li>':'' )+
                                            '<li>'+(type==="video"?'播放':'阅读')+'：'+followNum+'</li>' +
                                            '<li class="time">'+time+'</li>' +
                                            '<div class="clear"></div>' +
                                            '</ul>' +
                                            '</div>' +
                                            (summary.length>0? '<div class="search_list_text">'+(summary.replace(/</g,"&lt;").replace(/>/g,"&gt;"))+'</div>' : '') +
                                            '</div>' +
                                            hasImg +
                                            '<div class="clear"></div>' +
                                            '</li>';;
                                            break;
                                        case 1://视频
                                            time = item.publishTime?item.publishTime.substring(0,10):'';
                                            title = item.name;
                                            imgUrl = item.logoUrl;
                                            toUrl = item.pageStoragePath;
                                            author = item.author;
                                            source = item.videoSource;
                                            followNum= item.browseNum;
                                            summary = item.videoAbstract?item.videoAbstract:'';
                                            if(title){
                                                title=comm.getStrLen(title,50*2);
                                            }
                                            playTime = item.playTime;
                                            hasImg = '<div class="search_all_right">' +
                                            '<div class="v_tj_img">' +
                                            '<a href="' + toUrl + '" target="_blank"><img src="//img10.allinmd.cn/default/225_150.jpg" data-original="' + imgUrl + '"><div class="v_tj_img_time_bg"></div> <div class="v_tj_img_time">'+playTime+'</div></a>' +
                                            '</div>' +
                                            '</div>';
                                            num = 2;
                                            n=7;
                                            type="video";
                                            videoHtml+= '<li>' +
                                            '<div class="search_all_left search_'+type+'_icon"></div>' +
                                            '<div class="search_all_center0'+num+'">' +
                                            '<div class="search_all_c01_title"><a href="'+toUrl+'" target="_blank">'+title+'</a></div>' +

                                            '<div class="search_list_r_author">' +
                                            '<ul>' +
                                            (author?'<li>'+comm.getStrLen(author,n)+'</li><li class="pointer"></li>':'' )+
                                            (source?'<li>来源：'+comm.getStrLen(source,n)+'</li><li class="pointer"></li>':'' )+
                                            '<li>'+(type==="video"?'播放':'阅读')+'：'+followNum+'</li>' +
                                            '<li class="time">'+time+'</li>' +
                                            '<div class="clear"></div>' +
                                            '</ul>' +
                                            '</div>' +
                                            (summary.length>0? '<div class="search_list_text">'+(summary.replace(/</g,"&lt;").replace(/>/g,"&gt;"))+'</div>' : '') +
                                            '</div>' +
                                            hasImg +
                                            '<div class="clear"></div>' +
                                            '</li>';;
                                            break;
                                        case 2://文库
                                            time = item.publishTime?item.publishTime.substring(0,10):'';
                                            title = item.name;
                                            imgUrl = item.logoUrl;
                                            toUrl = item.pageStoragePath;
                                            author = item.author;
                                            source = item.docSource;
                                            followNum= item.browseNum;
                                            summary = item.docAbstract?item.docAbstract:'';

                                            if(item.attWidth === "225" || item.attWidth === "0"){
                                                hasImg = '<div class="search_all_right"><a href="' + toUrl + '" target="_blank"><img src="//img10.allinmd.cn/default/225_150.jpg" data-original="' + imgUrl + '"></a></div>';
                                                num = 2;
                                                n=7;

                                            }else{
                                                hasImg = '<div class="search_all_right"><a href="' + toUrl + '" target="_blank"><img src="//img10.allinmd.cn/default/110_150.jpg" data-original="' + imgUrl + '"></a></div>';
                                                num = 3;
                                                n=11;
                                            }
                                            type="doc";
                                            docHtml+= '<li>' +
                                            '<div class="search_all_left search_'+type+'_icon"></div>' +
                                            '<div class="search_all_center0'+num+'">' +
                                            '<div class="search_all_c01_title"><a href="'+toUrl+'" target="_blank">'+title+'</a></div>' +

                                            '<div class="search_list_r_author">' +
                                            '<ul>' +
                                            (author?'<li>'+comm.getStrLen(author,n)+'</li><li class="pointer"></li>':'' )+
                                            (source?'<li>来源：'+comm.getStrLen(source,n)+'</li><li class="pointer"></li>':'' )+
                                            '<li>'+(type==="video"?'播放':'阅读')+'：'+followNum+'</li>' +
                                            '<li class="time">'+time+'</li>' +
                                            '<div class="clear"></div>' +
                                            '</ul>' +
                                            '</div>' +
                                            (summary.length>0? '<div class="search_list_text">'+(summary.replace(/</g,"&lt;").replace(/>/g,"&gt;"))+'</div>' : '') +
                                            '</div>' +
                                            hasImg +
                                            '<div class="clear"></div>' +
                                            '</li>';;
                                            break;
                                        case 4://话题
                                            time = item.publishTime?item.publishTime.substring(0,10):'';
                                            title = item.name;
                                            imgUrl = item.logoUrl;
                                            toUrl = item.pageStoragePath;
                                            author = item.author;
                                            source ='';
                                            followNum= item.browseNum;
                                            summary = item.topicDiscuss;
                                            if (title) {
                                                title = title;
                                            } else if (!title && summary) {
                                                title = summary.substring(0, 20);
                                            } else if (!title && !summary) {
                                                title = "看图讨论";
                                            }
                                            hasImg = '<div class="search_all_right"><a href="' + toUrl + '" target="_blank"><img src="//img10.allinmd.cn/default/loading/225_150.jpg" data-original="' + imgUrl + '" width="225" height="150"></a></div>';
                                            num=2;
                                            n=7;
                                            type="topic";
                                            topicHtml+= '<li>' +
                                            '<div class="search_all_left search_'+type+'_icon"></div>' +
                                            '<div class="search_all_center0'+num+'">' +
                                            '<div class="search_all_c01_title"><a href="'+toUrl+'" target="_blank">'+title+'</a></div>' +

                                            '<div class="search_list_r_author">' +
                                            '<ul>' +
                                            (author?'<li>'+comm.getStrLen(author,n)+'</li><li class="pointer"></li>':'' )+
                                            (source?'<li>来源：'+comm.getStrLen(source,n)+'</li><li class="pointer"></li>':'' )+
                                            '<li>'+(type==="video"?'播放':'阅读')+'：'+followNum+'</li>' +
                                            '<li class="time">'+time+'</li>' +
                                            '<div class="clear"></div>' +
                                            '</ul>' +
                                            '</div>' +
                                            (summary.length>0? '<div class="search_list_text">'+(summary.replace(/</g,"&lt;").replace(/>/g,"&gt;"))+'</div>' : '') +
                                            '</div>' +
                                            hasImg +
                                            '<div class="clear"></div>' +
                                            '</li>';;
                                            break;
                                        case 3://会议
                                            if(j<2){
                                                imgUrl = item.conMainPicUrl;
                                                toUrl = item.menuUrlAllin_detail;
                                                conIntro = item.conIntro?comm.getStrLen(item.conIntro,58*2):'';
                                                country = item.country;
                                                city = item.city;
                                                startTime = item.startTime?item.startTime.substring(0,4)+'.'+item.startTime.substring(5,7)+'.'+item.startTime.substring(8,10):'';
                                                endTime = item.endTime?item.endTime.substring(0,4)+'.'+item.endTime.substring(5,7)+'.'+item.endTime.substring(8,10):'';
                                                conHtml+='<li style="border-bottom:none">' +
                                                '<div class="met_list">'+
                                                '<div class="met_listTop"><a href="'+toUrl+'" target="_blank"><img src="'+imgUrl+'" alt=""/></a></div>'+
                                                '<div class="met_listBot">'+
                                                '<div class="metTop">'+
                                                '<div class="metDate"><a href="'+toUrl+'" target="_blank"><span class="dateImg"></span>'+startTime+' - '+endTime+'</a></div>'+
                                                '<div class="metText"><a href="'+toUrl+'" target="_blank"><span class="location"></span>'+country+' · '+city+'</a></div>'+
                                                '<div class="clear"></div>'+
                                                '</div>'+
                                                '<div class="metBotText"><a href="'+toUrl+'" target="_blank">'+conIntro+'</a></div>'+
                                                '</div>'+
                                                '</div>' +
                                                '</li>';
                                            }

                                            break;
                                        case 9://用户
                                            cid = item.id;

                                            if(item.state==1 || item.state==2){
                                                nnHT = '<a class="user_index" href="/pages/personal/home.html?cid='+ cid +'" data-customer-id="'+ cid +'" target="_blank">'+item.name+'</a>';
                                                imgHT = '<a class="user_index" href="/pages/personal/home.html?cid='+ cid +'" data-customer-id="'+ cid +'"><img src="//img10.allinmd.cn/default/65_65.jpg" data-original="'+item.logoUrl+'"></a>';
                                            }else{
                                                nnHT = item.name;
                                                imgHT = '<img src="//img10.allinmd.cn/default/65_65.jpg" data-original="'+item.logoUrl+'">';
                                            }

                                            userHtml ='<li>'+
                                            '<div class="list_info_bg" style="height:112px">'+
                                            '<div class="info_left">'+imgHT+'</div>'+
                                            '<div class="info_right">'+
                                            '<div class="info_name">'+nnHT+'</div>'+
                                            '<div class="info_zhiwei">'+(item.medicalTitle?'<span>'+ t.getMedical_title(item.medicalTitle)+'</span>':'')+comm.getStrLen(item.author,24)+'</div>'+ //item.unit
                                            '<div class="info_jh">'+
                                            '<div class="info_gz" style="padding-left:0;">关注<span class="info_num">'+(item.followOrgNum?item.followOrgNum:item.followpeopleNum)+'</span></div>'+
                                            '<div class="info_gz">粉丝<span class="info_num">'+item.fansNum+'</span></div>'+
                                            '<div class="info_gz" style="border:none;">动态<span class="info_num">'+item.trendsNum+'</span></div>'+
                                            '<div class="clear"></div>'+
                                            '</div>'+
                                            '<div class="gz_but follow_'+i+'"></div>'+
                                            '</div>'+
                                            '<div class="clear"></div>'+
                                            '</div>'+
                                            '</li>';

                                            if(cid == sessionId || (item.state !=1 && item.state !=2) || cid == null){
                                                arrHT.push($(userHtml));
                                            }else{
                                                var temp = $(userHtml);
                                                temp.find(".follow_"+i).follow({fStatus:item.relation?item.relation:0,classStyle:"gz_but",fId:cid?cid:""});
                                                arrHT.push(temp);
                                            };
                                            break;
                                        default :
                                            num=1;
                                            n=11;
                                            hasImg = '';
                                    }

                                })

                            })

                            if(arrHT.length>0){
                                arrHT.push($('<div class="clear"></div>'));
                                $("#Ev_all_user").html(arrHT);
                                $("#floor02").show();
                            }
                            if(conHtml){
                                $("#Ev_all_con").html(conHtml);
                                $("#floor03").show();
                            }
                            var html1=html2="";
                            if(arrHT.length<=0&&conHtml==""){
                                html1=caseHtml+videoHtml+docHtml+topicHtml;
                                html2="";
                            }else if(caseHtml){
                                html1=caseHtml;
                                html2=videoHtml+docHtml+topicHtml;
                            }else if(videoHtml){
                                html1=videoHtml;
                                html2=docHtml+topicHtml;
                            }else if(docHtml){
                                html1=docHtml;
                                html2=topicHtml;
                            }else if(topicHtml){
                                html1=topicHtml;
                                html2="";
                            }
                            if(html1){
                                $("#search_list").html(html1);
                            }
                            if(html2){
                                $("#floor04").show();
                                $("#Ev_all_oth").html(html2);
                            }
                            // 延迟加载
                            $(".search_all_right img").lazyload({
                                effect:"fadeIn",
                                event:"scrollstop"
                            });
                            $(".info_left img").lazyload({
                                effect:"fadeIn",
                                event:"scrollstop"
                            });
                        }
                    }
                }
            });

        },
        commonSearch:function(type){
            var t=this;
            url=t.path[type];

            switch (type){
                case 'caze':
                    $(".EV_text").text("有关的病例内容");
                    break;
                case 'topic':
                    $(".EV_text").text("有关的话题内容");
                    break;
                case 'video':
                    $(".EV_text").text("有关的视频内容");
                    break;
                case 'conference':
                    $(".EV_text").text("有关的会议内容");
                    break;
                case 'doc':
                    $(".EV_text").text("有关的文章内容");
                    break;
                default :
                    $(".EV_text").text("有关的内容");
                    break;
            }

            this.ajaxFn({
                 url:url,
                 param: t.getParams(type),
                 fn:function(data){
                     t.addHtml(data,type);
                     $(".pager").pager({pagenumber:1, pagecount: t.config.pagecount, buttonClickCallback: PageClick});
                 }
            });
            PageClick = function(pageclickednumber){
                var params= t.getParams(type);
                params.pageIndex = pageclickednumber;

                t.ajaxFn({
                    url: url,
                    param: params,
                    fn:function(data){
                        $(".pager").pager({ pagenumber: pageclickednumber, pagecount: t.config.pagecount, buttonClickCallback: PageClick });
                        t.addHtml(data,type);
                    }
                });
            };
        },
        userSearch:function(){
            var t=this;
            if($("#sesCustomerId").val()){//用户已登录
                dataFlag=2;
            }else{
                dataFlag=1;
            }
            this.ajaxFn({
                url:t.path.user ,
                param:{pageIndex:1,pageSize:t.config.pageSize,sortType:2,searchParam: t.config.searchParam,attUseFlag:AttUseFlag.c,logoUseFlag:UseFlag.c,dataFlag:dataFlag,isValid:1},
                fn:function(data){
                    t.addUserHtml(data);
                    $(".pager").pager({pagenumber:1, pagecount: t.config.pagecount, buttonClickCallback: PageClick});
                }
            });
            PageClick = function(pageclickednumber){
                t.ajaxFn({
                    url: t.path.user,
                    param:{pageIndex: pageclickednumber,sortType:2,pageSize:t.config.pageSize,searchParam: t.config.searchParam,attUseFlag:AttUseFlag.c,logoUseFlag:UseFlag.c,dataFlag:dataFlag,isValid:1},
                    fn:function(data){
                        $(".pager").pager({ pagenumber: pageclickednumber, pagecount: t.config.pagecount, buttonClickCallback: PageClick });
                        t.addUserHtml(data);
                    }
                });
            };
        },
        ajaxFn:function(opt){
            comm.LightBox.showloading();
            var o=opt;
            $.ajax({
                url: o.url,
                type: "post",
                data: o.param,
                dataType:"json",
                success: function (data) {
                    comm.LightBox.hideloading();
                    if(data){
                        o.fn(data);
                    }
                },
                error: function(XMLHttpRequest, textStatus, errorThrown){
                    //alert(textStatus+" "+errorThrown);
                }
            });
        },
        addHtml:function(data,type) {
            var t=this;
            html = '';
            $("#floor_user").hide();
            $("#floor02").hide();
            $("#floor03").hide();
            $("#floor04").hide();
            if (data.responseObject.responseData.data_list&&data.responseObject.responseData.data_list.length>0) {

                for (var i = 0; i < data.responseObject.responseData.data_list.length; i++) {
                    n = 11;
                    var item = data.responseObject.responseData.data_list[i];
                    var time = title = author = source= summary='';
                    var hasImg = imgUrl= toUrl = followNum = type1 = '';
                    var num = 1;
                    switch (type){
                        case 'doc':
                            time = item.customer_doc.publishTime?item.customer_doc.publishTime.substring(0,10):'';
                            title = item.customer_doc.docName.length > 0 ? item.customer_doc.docName : '';
                            imgUrl = item.cms_doc_attachment_logo === undefined ? "":item.cms_doc_attachment_logo.docAttUrl;
                            toUrl = item.customer_doc.pageStoragePath;
                            author = item.customer_auth?item.customer_auth.lastName+item.customer_auth.firstName:'';
                            source = item.customer_doc.docSource;
                            followNum= item.customer_doc.browseNum;
                            summary = item.customer_doc.docAbstract?item.customer_doc.docAbstract:'';

                            if(item.cms_doc_attachment_logo.attWidth === "225" || item.cms_doc_attachment_logo.attWidth === "0"){
                                hasImg = '<div class="search_all_right"><a href="' + toUrl + '" target="_blank"><img src="//img10.allinmd.cn/default/225_150.jpg" data-original="' + imgUrl + '"></a></div>';
                                num = 2;
                                n=7;

                            }else{
                                hasImg = '<div class="search_all_right"><a href="' + toUrl + '" target="_blank"><img src="//img10.allinmd.cn/default/110_150.jpg" data-original="' + imgUrl + '"></a></div>';
                                num = 3;
                                n=11;
                            }

                            break;
                        case 'video':
                            time = item.cms_video.publishTime?item.cms_video.publishTime.substring(0,10):'';
                            title = item.cms_video.videoName.length > 0 ? item.cms_video.videoName : '';
                            imgUrl = item.cms_video_attachment_logo.videoAttUrl?item.cms_video_attachment_logo.videoAttUrl:'';
                            toUrl = item.cms_video.pageStoragePath;
                            author = item.cms_video_customer_auth?item.cms_video_customer_auth.lastName+item.cms_video_customer_auth.firstName:'';
                            source = item.cms_video.videoSource;
                            followNum= item.cms_video.playNum;
                            summary = item.cms_video.videoAbstract?item.cms_video.videoAbstract:'';
                            if(title){
                                title=comm.getStrLen(title,50*2);
                            }
                            playTime = item.cms_video.playTime;
                            hasImg = '<div class="search_all_right">' +
                            '<div class="v_tj_img">' +
                            '<a href="' + toUrl + '" target="_blank"><img src="//img10.allinmd.cn/default/225_150.jpg" data-original="' + imgUrl + '"><div class="v_tj_img_time_bg"></div> <div class="v_tj_img_time">'+playTime+'</div></a>' +
                            '</div>' +
                            '</div>';
                            num = 2;
                            n=7;
                            break;
                        case 'conference':
                            imgUrl = item.conMainPicUrl;
                            toUrl = item.menuUrlAllin_detail;
                            conIntro = item.conIntro?comm.getStrLen(item.conIntro,58*2):'';
                            country = item.country;
                            city = item.city;
                            startTime = item.startTime?item.startTime.substring(0,4)+'.'+item.startTime.substring(5,7)+'.'+item.startTime.substring(8,10):'';
                            endTime = item.endTime?item.endTime.substring(0,4)+'.'+item.endTime.substring(5,7)+'.'+item.endTime.substring(8,10):'';
                            break;
                        case 'caze':
                            time = item.case_baseinfo.publishTime?item.case_baseinfo.publishTime.substring(0,10):'';
                            title = item.case_baseinfo.caseName.length > 0 ? item.case_baseinfo.caseName : '';
                            imgUrl = item.case_attachment.attUrl?item.case_attachment.attUrl:'';
                            toUrl = item.case_baseinfo.pageStoragePath;
                            author = item.case_customer_auth?item.case_customer_auth.lastName+item.case_customer_auth.firstName:'';
                            source ='';
                            followNum= item.case_baseinfo.browseNum;
                            summary = item.case_baseinfo.mainNarrate;
                            hasImg = '<div class="search_all_right"><a href="' + toUrl + '" target="_blank"><img src="//img10.allinmd.cn/default/225_150.jpg" data-original="' + imgUrl + '" width="225" height="150"></a></div>';
                            num=2;
                            n=7;
                            type1="case";
                            break;
                        case 'topic':
                            time = item.cms_topic.publishTime?item.cms_topic.publishTime.substring(0,10):'';
                            title = item.cms_topic.topicName.length > 0 ? item.cms_topic.topicName : '';
                            imgUrl = item.cms_topic_attachment.topicAttUrl?item.cms_topic_attachment.topicAttUrl:'';
                            toUrl = item.cms_topic.pageStoragePath;
                            author = item.cms_topic_customer_auth?item.cms_topic_customer_auth.lastName+item.cms_topic_customer_auth.firstName:'';
                            source ='';
                            followNum= item.cms_topic.browseNum;
                            summary = item.cms_topic.topicDiscuss;
                            if (title) {
                                title = title;
                            } else if (!title && summary) {
                                title = summary.substring(0, 20);
                            } else if (!title && !summary) {
                                title = "看图讨论";
                            }
                            hasImg = '<div class="search_all_right"><a href="' + toUrl + '" target="_blank"><img src="//img10.allinmd.cn/default/loading/225_150.jpg" data-original="' + imgUrl + '" width="225" height="150"></a></div>';
                            num=2;
                            n=7;
                            break;
                        default :
                            num=1;
                            n=11;
                            hasImg = '';
                    }

                    if(type=="conference"){
                        html+='<li style="border-bottom:none">' +
                        '<div class="met_list">'+
                        '<div class="met_listTop"><a href="'+toUrl+'" target="_blank"><img src="'+imgUrl+'" alt=""/></a></div>'+
                        '<div class="met_listBot">'+
                        '<div class="metTop">'+
                        '<div class="metDate"><a href="'+toUrl+'" target="_blank"><span class="dateImg"></span>'+startTime+' - '+endTime+'</a></div>'+
                        '<div class="metText"><a href="'+toUrl+'" target="_blank"><span class="location"></span>'+country+' · '+city+'</a></div>'+
                        '<div class="clear"></div>'+
                        '</div>'+
                        '<div class="metBotText"><a href="'+toUrl+'" target="_blank">'+conIntro+'</a></div>'+
                        '</div>'+
                        '</div>' +
                        '</li>';
                    }else{
                        html += '<li>' +
                        '<div class="search_all_left search_'+(type1?type1:type)+'_icon"></div>' +
                        '<div class="search_all_center0'+num+'">' +
                        '<div class="search_all_c01_title"><a href="'+toUrl+'" target="_blank">'+title+'</a></div>' +

                        '<div class="search_list_r_author">' +
                        '<ul>' +
                        (author?'<li>'+comm.getStrLen(author,n)+'</li><li class="pointer"></li>':'' )+
                        (source?'<li>来源：'+comm.getStrLen(source,n)+'</li><li class="pointer"></li>':'' )+
                        '<li>'+(type==="video"?'播放':'阅读')+'：'+followNum+'</li>' +
                        '<li class="time">'+time+'</li>' +
                        '<div class="clear"></div>' +
                        '</ul>' +
                        '</div>' +
                        (summary.length>0? '<div class="search_list_text">'+(summary.replace(/</g,"&lt;").replace(/>/g,"&gt;"))+'</div>' : '') +
                        '</div>' +
                        hasImg +
                        '<div class="clear"></div>' +
                        '</li>';
                    }

                }
            }
            this.changeHidden(data,type);
            this.config.pagecount=$("#pageCount").val();
            $("#floor01").show();
            $("#search_list").html(html||"<li class='no_content'>没有找到内容...</li>");
            $(".result").text(data.responseObject.responseData.total_count||0);
            if(!html){
                t.el.pagination.hide();
            }else{
                t.el.pagination.show();
            }
            // 延迟加载
            $(".search_all_right img").lazyload({
                effect:"fadeIn",
                event:"scrollstop"
            });
        },
        addUserHtml:function(data){
            var t=this;
            $("#floor01").hide();
            $("#floor02").hide();
            $("#floor03").hide();
            $("#floor04").hide();
            var total=0;

            if(data.responseObject.responseData&&data.responseObject.responseData.data_list&&data.responseObject.responseData.data_list.length>0){
                total=data.responseObject.responseData.total_count;

                var userHtml="",uHtml = "",arrHT = [];

                var sessionId = $("#sesCustomerId").val();
                var nnHT = "",imgHT = "",unit="",item = "";
                var logoUrl='';

                var dataJson = data.responseObject.responseData.data_list;
                var cid = "";

                for(var i= 0,len = dataJson.length; i<len; i++){
                    item = dataJson[i];
                    cid = item.customer_baseinfo.customerId;

                    if(item.customer_auth.state==1 || item.customer_auth.state==2){
                        name=item.customer_auth.firstName&&typeof item.customer_auth.firstName!='object' ?(item.customer_auth.lastName+item.customer_auth.firstName) : '';
                        if(name){
                            name=comm.getStrLen(name,13*2);
                        }
                        nnHT = '<a class="user_index" href="javascript:void(0)" data-customer-id="'+ cid +'" target="_blank">'+name+'</a>';
                        imgHT = '<a class="user_index" href="javascript:;" data-customer-id="'+ cid +'"><img src="//img10.allinmd.cn/default/65_65.jpg" data-original="'+item.customer_att.logoUrl+'"></a>';
                    }else{
                        nnHT = item.customer_baseinfo.nickname;
                        imgHT = '<img src="//img10.allinmd.cn/default/65_65.jpg" data-original="'+item.customer_att.logoUrl+'">';
                    }

                    userHtml ='<li>'+
                        '<div class="list_info_bg" style="height:112px">'+
                            '<div class="info_left">'+imgHT+'</div>'+
                            '<div class="info_right">'+
                                '<div class="info_name">'+nnHT+'</div>'+
                                '<div class="info_zhiwei">'+(item.customer_auth.medicalTitle?'<span>'+ t.getMedical_title(item.customer_auth.medicalTitle)+'</span>':'')+comm.getStrLen(item.customer_auth.company,24)+'</div>'+ //item.unit
                                '<div class="info_jh">'+
                                    '<div class="info_gz" style="padding-left:0;">关注<span class="info_num">'+(item.customer_statistic.followOrgNum?item.customer_statistic.followOrgNum:item.customer_statistic.followOrgNum)+'</span></div>'+
                                    '<div class="info_gz">粉丝<span class="info_num">'+item.customer_statistic.fansNum+'</span></div>'+
                                    '<div class="info_gz" style="border:none;">动态<span class="info_num">'+item.customer_statistic.trendsNum+'</span></div>'+
                                    '<div class="clear"></div>'+
                                '</div>'+
                                '<div class="gz_but follow_'+i+'"></div>'+
                            '</div>'+
                            '<div class="clear"></div>'+
                        '</div>'+
                    '</li>';

                    if(cid == sessionId || (item.customer_auth.state !=1 && item.customer_auth.state !=2) || cid == null){
                        arrHT.push($(userHtml));
                    }else{
                        var temp = $(userHtml);
                        temp.find(".follow_"+i).follow({fStatus:item.customer_follow_people.relationship?item.customer_follow_people.relationship:0,classStyle:"gz_but",fId:cid?cid:""});
                        arrHT.push(temp);
                    };
                }
                this.changeHidden(data,"user");
            }

            this.config.pagecount=$("#pageCount").val();
            $("#floor_user").show();

            $("#floor_user ul").html(arrHT !==undefined ?arrHT:"<li class='no_content'>没有找到内容...</li>");
            $(".result").text(total);
            if(arrHT === undefined ){
                t.el.pagination.hide();
            }else{
                t.el.pagination.show();
            }
            $(".user_index").on('click',function(){
                var customer_id = $(this).data('customer-id');
                //user.login({
                    //callback:function(){
                    g_sps.jump(null,'/pages/personal/home.html?cid=' +customer_id);
                    //},
                   // operateType:"respond",
                   // customer_id:customer_id
                //})
            });

            // 延迟加载
            $(".info_left img").lazyload({
                effect:"fadeIn",
                event:"scrollstop"
            });
        },
        getMedical_title : function(data){
            if(data && typeof data!= "object"){
                var arr=data.split(",");
                var arr2=[];
                for(var i=0; i<1; i++){
                    arr2.push(arr[i].split("_")[1]);
                }
                return arr2.join(" ");
            }else{
                return '';
            }

        },
        getParams: function(type){
            var t = this,params = {};
            switch(type){
                case "caze":
                    params = {attUseFlag:AttUseFlag.h,pageIndex:1,pageSize:t.config.pageSize,searchParam: t.config.searchParam,logoUseFlag:UseFlag.d,sortType:1};
                    break;
                case "video":
                    params = {useFlag:UseFlag.c,pageIndex:1,pageSize:t.config.pageSize,searchParam: t.config.searchParam,logoUseFlag:UseFlag.d,sortType:1}
                    break;
                case "conference":
                    params = {attUseFlag:AttUseFlag.h,pageIndex:1,pageSize:t.config.conSize,searchParam: t.config.searchParam,logoUseFlag:UseFlag.d,sortType:1};
                    break;
                case "topic":
                    params = {attUseFlag:AttUseFlag.h,pageIndex:1,pageSize:t.config.pageSize,searchParam: t.config.searchParam,logoUseFlag:UseFlag.d,sortType:2}
                    break;
                case "doc":
                    params = {attUseFlag:AttUseFlag.h,pageIndex:1,pageSize:t.config.pageSize,searchParam: t.config.searchParam,logoUseFlag:UseFlag.d,sortType:2}
                    break;
                default:
            };
            return params;
        },
        changeHidden:function(data,type){
            var total=data.responseObject.responseData.total_count;
            var size=type!="conference"?data.responseObject.responseData.page_size:this.config.conSize;
            $("#total").val(total);
            $("#pageIndex").val(data.responseObject.responseData.page_no);
            $("#pageSize").val(size);
            $("#pageCount").val(Math.ceil(total/size));
        }

    };

    search.init();

})





//if(data.dataJson.attList){
//    for(var j=0; j<data.dataJson.attList.length; j++){
//        if(data.dataJson.attList[j].refId==item.customer_id){
//            logoUrl=data.dataJson.attList[j].logoUrl;
//        }
//    }
//}

/*if(data.dataJson.statistics){
 for(var j=0; j<data.dataJson.statistics.length; j++){
 if(data.dataJson.statistics[j].customerId==item.customer_id){
 followNum=data.dataJson.statistics[j].followpeopleNum;
 fansNum=data.dataJson.statistics[j].fansNum;
 trendsNum=data.dataJson.statistics[j].trendsNum;
 }
 }
 }*/
