/**
 * 功能描述：  直播列表
 * 使用方法:
 * 注意事件：
 * 引入来源：  作用：
 *
 * Created by LiChunHui on 2016/11/30.
 */
$(function(){
   var liveList={};
    liveList={
        path:{
            allList:PC_CALL+"broadcast/home/getMapList/",
            order:PC_CALL+"broadcast/audience/create/"
        },
        init:function(){
            //comm.Log.createBrowse({href:location.href,id:156,name:'UGC直播-直播列表'});
            this.getAllList();
        },
        //全部列表
        getAllList:function(){
            var t=this;
            var data={};
            data.visitSiteId=1;
            data.isHome=1;
            data.sessionCustomerId=$("#sesCustomerId").val();
            data.pageIndex=1;
            data.pageSize=10;
            comm.LightBox.showloading();
            $.ajax({
                type : "post",
                url : t.path.allList,
                data : {paramJson:$.toJSON(data)},
                dataType : "json",
                success : function(rep){
                    comm.LightBox.hideloading();
                    if(rep&&rep.responseObject.responseData){
                        var repData=rep.responseObject.responseData;
                        if(repData.data_list&&repData.data_list.length>0){
                            var data_list=repData.data_list;
                            var html=t.addHtml(1,data_list);//全部
                            $("#ev_allList").html(html);
                            t.order();
                            var pagecount=Math.ceil(repData.total_count/10);//总页数
                            $(".pager").pager({pagenumber:1, pagecount: pagecount, buttonClickCallback: PageClick});
                        }else{
                            var html='<!--无直播内容时-->'+
                                '<div class="al-noWebcastContent">'+
                                '<img src="//img10.allinmd.cn/v3/webcast/noWebcastContentImg.png" alt=""/>'+
                                '</div>';
                            $("#ev_allList").html(html);
                        }
                        if(repData.order_list&&repData.order_list.length>0){
                            var order_list=repData.order_list;
                            $(".myOrder").show();
                            var html=t.addHtml(2,order_list);//我的预约
                            $("#ev_myOrder").html(html);
                        }
                        $(".live_end").on("click",function(){
                            $.topTip({content:"直播已结束",mark:'warn'});
                        })
                    }
                },
                error:function(){}
            });
            //分页
            PageClick = function(pageclickednumber){
                data.pageIndex=pageclickednumber;
                comm.LightBox.showloading();
                $.ajax({
                    type : "post",
                    url : t.path.allList,
                    data : {paramJson:$.toJSON(data)},
                    dataType : "json",
                    success : function(rep){
                        comm.LightBox.hideloading();
                        if(rep&&rep.responseObject.responseData){
                            var repData=rep.responseObject.responseData;
                            if(repData.data_list&&repData.data_list.length>0){
                                var data_list=repData.data_list;
                                var html=t.addHtml(1,data_list);//全部
                                $("#ev_allList").html(html);
                                $(".live_end").on("click",function(){
                                    $.topTip({content:"直播已结束",mark:'warn'});
                                })
                                t.order();
                                var pagecount=Math.ceil(repData.total_count/10);//总页数
                                $(".pager").pager({pagenumber:pageclickednumber, pagecount: pagecount, buttonClickCallback: PageClick});
                            }
                        }
                    },
                    error:function(){}
                });
            }
        },
        //预约
        order:function(){
            var t=this;
            $(".al-videoLivingBtn").on("click",function(){
                var $this=$(this);
                if($(this).attr("isOrder")=="0"){
                    var liveId=$(this).attr("liveId");
                    user.login({
                        callback: function () {
                            var data={};
                            data.sessionCustomerId=$("#sesCustomerId").val();
                            data.liveId=liveId;
                            data.liveUserRole=1;
                            data.state=0;
                            data.isSpeak=0;
                            data.isShield=0;
                            data.siteId=1;
                            $.ajax({
                                type : "post",
                                url : t.path.order,
                                data : {paramJson: $.toJSON(data)},
                                dataType : "json",
                                success : function(rep){
                                    if(rep&&rep.responseObject.responseStatus){
                                        /*$this.attr("isOrder","1");
                                        $this.find("a").text("已预约");
                                        $this.addClass("al-alreadyOrderBtn");*/
                                        t.getAllList();
                                    }
                                },
                                error:function(){}
                            });
                        },
                        scene: privilegeSceneConst.eSceneTypeAuth,
                        onClose:function(){
                            //history.back(-1);
                        },
                        noAuthReload:true
                    });

                }
            })
        },
        //dom操作 type=1//全部 =2//我的预约
        addHtml:function(type,list){
            var liveType=[{className:'al-caseColor',name:'手术直播'},{className:'al-conferenceColor',name:'学术会议'},{className:'al-hickeyColor',name:'产品推荐'},{className:'al-hickeyColor',name:'器械操作'},{className:'al-conferenceColor',name:'手术解说'},{className:'al-caseColor',name:'病例讨论'},{className:'al-conferenceColor',name:'课程讲解'},{className:'al-hickeyColor',name:'会议直播'},{className:'al-hickeyColor',name:'学术讨论'},{className:'al-conferenceColor',name:'其他'}];
            var html="";
            var defaultImg="//img10.allinmd.cn/v3/terminal/webcastNoImg.png";
            $.each(list,function(i,val){
                startTime="";
                orderBtn="";
                liveEnd="";
                switch (parseInt(val.liveState)){
                    case 1://预约
                        liveIcon="al-videoOrderImg";
                        liveUrl='javascript:;';
                        subtractionDate="------";
                        followNum=val.onlineNum.toW()+"人预约";
                        if(type==2){//预约
                            startTime='<p>开始:<span>'+val.liveStartTime+'</span></p>';
                        }else{//全部
                            if(val.isOrder==0){//未预约
                                startTime='<p>开始:<span>'+val.liveStartTime+'</span></p>';
                            }
                            orderBtn='<div liveId='+val.liveId+' isOrder='+val.isOrder+' class="al-videoLivingBtn '+(val.isOrder=="1"?'al-alreadyOrderBtn':'')+'"><a href="javascript:;">'+(val.isOrder=="1"?'已预约':'立即预约')+'</a></div>';
                        }
                        break;
                    case 2://未开始
                        liveIcon="al-videoNoBeginImg";
                        liveUrl='javascript:;';
                        subtractionDate="------";
                        followNum=val.onlineNum.toW()+"人预约";
                        if(type==2){//预约
                            startTime='<p>开始:<span>'+val.liveStartTime+'</span></p>';
                        }else{//全部
                            if(val.isOrder==0){//未预约
                                startTime='<p>开始:<span>'+val.liveStartTime+'</span></p>';
                            }
                            orderBtn='<div liveId='+val.liveId+' isOrder='+val.isOrder+' class="al-videoLivingBtn '+(val.isOrder=="1"?'al-alreadyOrderBtn':'')+'"><a href="javascript:;">'+(val.isOrder=="1"?'已预约':'立即预约')+'</a></div>';
                        }
                        break;
                    case 3://直播中
                        liveIcon="al-videoLivingImg";
                        liveUrl='/pages/live/living_watch.html?liveId='+val.liveId;
                        subtractionDate="已进行"+comm.date.vsLocalTime(val.liveEnterTime?val.liveEnterTime:val.liveStartTime);
                        followNum=val.onlineNum.toW();
                        if(type==2){
                            startTime='<p>开始:<span>'+val.liveStartTime+'</span></p>';
                        }
                        break;
                    case 4://结束
                        liveIcon="al-videoEndImg";
                        liveUrl="javascript:;";
                        subtractionDate=val.subtractionDate;
                        followNum=val.followNum.toW();
                        if(type==2){
                            startTime='<p>开始:<span>'+val.liveStartTime+'</span></p>';
                        }
                        liveEnd="live_end";//直播已结束
                        break;
                    case 5://完成
                        liveIcon="al-videoEndImg";
                        liveUrl="javascript:;";
                        subtractionDate=val.subtractionDate;
                        followNum=val.onlineNum.toW();
                        if(type==2){
                            startTime='<p>开始:<span>'+val.liveStartTime+'</span></p>';
                        }
                        liveEnd="live_end";//直播已结束
                        break;
                    default :
                        liveUrl="javascript:;";
                        subtractionDate="------";
                        followNum=val.followNum.toW()+"人预约";
                        liveEnd="live_end";//直播已结束
                        break;

                }
                var liveTypeNum=val.liveType-1;
                if(liveTypeNum<0){
                    liveTypeNum=0;
                }
                html+='<figure class="al-videoItem">'+
                '<div class="al-videoDemo">'+
                '<a href="'+liveUrl+'" target="_blank" class="'+liveEnd+'"><b class="'+liveIcon+'"></b>'+
                '<img src="'+(val.attUrl?val.attUrl:defaultImg)+'" alt=""/></a>'+
                '</div>'+
                '<div class="al-videoLivingContent">'+
                '<a href="'+liveUrl+'" target="_blank" class="'+liveEnd+'"><h4>'+val.liveTitle+'</h4></a>'+
                '<figure class="al-livingTimeAndUser">'+
                (val.authInfo?'<p class="al-livingOrderUser">'+
                '<a href="/pages/personal/others_contribution.html?cid='+val.authInfo.authCustomerId+'" class="al-orderUserHeadImg"><img src="'+val.authInfo.logoUrl+'" alt="span"/></a>'+
                '<a href="/pages/personal/others_contribution.html?cid='+val.authInfo.authCustomerId+'"><span class="al-orderUserName">'+val.authInfo.authName+'</span></a>'+
                '</p>':'')+
                (type==2?'<p class="al-livingTime"><b></b><span>'+subtractionDate+'</span></p>':'')+
                '<p class="al-livingUser"><b></b><span>'+followNum+'</span></p>'+
                '</figure>'+
                '<figure class="al-livingDate">'+
                '<p class="al-livingTheme '+liveType[liveTypeNum].className+'">'+liveType[liveTypeNum].name+'</p>'+
                startTime+
                '</figure>'+
                '</div>'+
                orderBtn+
                //'<div class="al-deleteLivingBtn">删除</div>'+
                '</figure>';
            });
            return html;
        }
    };

    liveList.init();
});

