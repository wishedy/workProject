/**
 * 功能描述：  我的预约列表
 * 使用方法:
 * 注意事件：
 * 引入来源：  作用：
 *
 * Created by LiChunHui on 2016/11/30.
 */
$(function(){
    var myOrderList={};
    myOrderList={
        path:{
            list:PC_CALL+"broadcast/home/getMapList/",
            deleteOrder:PC_CALL+"broadcast/home/update/"
        },
        init:function(){
            this.getList();
            //comm.Log.createBrowse({href:location.href,id:157,name:'UGC直播-我的预约'});
        },
        //全部列表
        getList:function(){
            var t=this;
            var data={};
            data.visitSiteId=1;
            data.isHome=0;
            data.isSubscribe=1;
            data.sessionCustomerId=$("#sesCustomerId").val();
            data.pageIndex=1;
            data.pageSize=10;
            comm.LightBox.showloading();
            $.ajax({
                type : "post",
                url : t.path.list,
                data : {paramJson:$.toJSON(data)},
                dataType : "json",
                success : function(rep){
                    comm.LightBox.hideloading();
                    if(rep&&rep.responseObject.responseData){
                        var repData=rep.responseObject.responseData;
                        if(repData.data_list&&repData.data_list.length>0){
                            var data_list=repData.data_list;
                            var html=t.addHtml(data_list);//我的预约
                            $("#ev_myOrder").html(html);
                            t.deleteOrder();
                            var pagecount=Math.ceil(repData.total_count/10);//总页数
                            $(".pager").pager({pagenumber:1, pagecount: pagecount, buttonClickCallback: PageClick});
                        }else{
                            var html='<!--无直播内容时-->'+
                                '<div class="al-noWebcastContent">'+
                                '<img src="//img10.allinmd.cn/v3/webcast/noWebcastContentImg.png" alt=""/>'+
                                '</div>';
                            $("#ev_myOrder").html(html);
                        }
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
                                $("#ev_myOrder").html(html);
                                t.deleteOrder();
                                var pagecount=Math.ceil(repData.total_count/10);//总页数
                                $(".pager").pager({pagenumber:pageclickednumber, pagecount: pagecount, buttonClickCallback: PageClick});
                            }
                        }
                    },
                    error:function(){}
                });
            }
        },
        //取消预约
        deleteOrder:function(){
            var t=this;
            $(".al-deleteLivingBtn").on("click",function(){
                var $this=$(this);
                var data={
                    sessionCustomerId:$("#sesCustomerId").val(),
                    liveId:$this.attr("liveId"),
                    visitSiteId:1,
                    isCancel:0
                };
                $.makeSurePopup({
                    title:"取消预约",//弹窗标题
                    content01:"确定取消预约吗？",//弹窗内容字体会加粗 (可不传)
                    content:"取消预约后将无法收到预约提示",//弹窗内容
                    url: t.path.deleteOrder,//ajax请求接口（可不传，不传就不发请求）
                    param:data,//ajax请求参数(可不传)
                    toJSON:1,//传参是否为paramJSPN 0或1，默认为1
                    callback:function(){
                        t.getList();
                    },//点击确认后执行的方法（有发送请求时，是请求成功后执行的方法)
                    error:function(){}//ajax请求失败后执行的方法(可不传)
                })

            })
        },
        //dom操作
        addHtml:function(list){
            var liveType=[{className:'al-caseColor',name:'手术直播'},{className:'al-conferenceColor',name:'学术会议'},{className:'al-hickeyColor',name:'产品推荐'},{className:'al-hickeyColor',name:'器械操作'},{className:'al-conferenceColor',name:'手术解说'},{className:'al-caseColor',name:'病例讨论'},{className:'al-conferenceColor',name:'课程讲解'},{className:'al-hickeyColor',name:'会议直播'},{className:'al-hickeyColor',name:'学术讨论'},{className:'al-conferenceColor',name:'其他'}];
            var html="";
            var defaultImg="//img10.allinmd.cn/v3/terminal/webcastNoImg.png";
            $.each(list,function(i,val){
                startTime="";
                orderBtn="";
                switch (parseInt(val.liveState)){
                    case 1://预约
                        liveIcon="al-videoOrderImg";
                        liveUrl='/pages/live/living_watch.html?liveId='+val.liveId;
                        subtractionDate="------";
                        followNum=val.onlineNum.toW()+"人预约";
                        startTime='<p>开始:<span>'+val.liveStartTime+'</span></p>';
                        break;
                    case 2://未开始
                        liveIcon="al-videoNoBeginImg";
                        liveUrl="/pages/live/living_watch.html?liveId="+val.liveId;
                        subtractionDate="------";
                        followNum=val.onlineNum.toW()+"人预约";
                        startTime='<p>开始:<span>'+val.liveStartTime+'</span></p>';
                        break;
                    case 3://直播中
                        liveIcon="al-videoLivingImg";
                        liveUrl='/pages/live/living_watch.html?liveId='+val.liveId;
                        subtractionDate="已进行"+comm.date.vsLocalTime(val.liveEnterTime?val.liveEnterTime:val.liveStartTime);
                        followNum=val.onlineNum.toW();
                        startTime='<p>开始:<span>'+val.liveStartTime+'</span></p>';
                        break;
                    case 4://结束
                        liveIcon="al-videoEndImg";
                        liveUrl="javascript:;";
                        subtractionDate=val.subtractionDate;
                        followNum=val.followNum.toW();
                        startTime='<p>开始:<span>'+val.liveStartTime+'</span></p>';
                        break;
                    case 5://完成
                        liveIcon="al-videoEndImg";
                        liveUrl="javascript:;";
                        subtractionDate=val.subtractionDate;
                        followNum=val.onlineNum.toW();
                        startTime='<p>开始:<span>'+val.liveStartTime+'</span></p>';
                        break;
                    default :
                        liveUrl="javascript:;";
                        subtractionDate="------";
                        followNum=val.followNum.toW()+"人预约";
                        break;

                }
                var liveTypeNum=val.liveType-1;
                if(liveTypeNum<0){
                    liveTypeNum=0;
                }
                html+='<figure class="al-videoItem">'+
                '<div class="al-videoDemo">'+
                '<a href="'+liveUrl+'"><b class="'+liveIcon+'"></b>'+
                '<img src="'+(val.attUrl?val.attUrl:defaultImg)+'" alt=""/></a>'+
                '</div>'+
                '<div class="al-videoLivingContent">'+
                '<a href="'+liveUrl+'"><h4>'+val.liveTitle+'</h4></a>'+
                '<figure class="al-livingTimeAndUser">'+
                (val.authInfo?'<p class="al-livingOrderUser">'+
                '<a href="/pages/personal/others_contribution.html?cid='+val.authInfo.authCustomerId+'" class="al-orderUserHeadImg"><img src="'+val.authInfo.logoUrl+'" alt="span"/></a>'+
                '<a href="/pages/personal/others_contribution.html?cid='+val.authInfo.authCustomerId+'"><span class="al-orderUserName">'+val.authInfo.authName+'</span></a>'+
                '</p>':'')+
                '<p class="al-livingTime"><b></b><span>'+subtractionDate+'</span></p>'+
                '<p class="al-livingUser"><b></b><span>'+followNum+'</span></p>'+
                '</figure>'+
                '<figure class="al-livingDate">'+
                '<p class="al-livingTheme '+liveType[liveTypeNum].className+'">'+liveType[liveTypeNum].name+'</p>'+
                startTime+
                '</figure>'+
                '</div>'+
                '<div class="al-deleteLivingBtn" liveId="'+val.liveId+'">删除</div>'+
                '</figure>';
            });
            return html;
        }
    };

    myOrderList.init();
});

