/**
 * @component-name:
 * @desc: 病例评论部分
 *          const ConfigUrlMixin 定义请求地址，一个类型伪常量
 *          const StyleBase 定义样式，之后通过mixin复用到组件中
 *          共四个组件 DetailComment
 *                          {1:CommentImgs  评论中图片组件
 *                          {2：CommentVideos 评论中视频组件
 *                          {3:DialogCheck    查看对话组件{
 *                                                      smallLiDom 评论li Dom结构
 *                                                      }
 * @example:
 * @depend:
 * @date: 2016/6/14
 * @author: sunhaibin
 */

var href=window.location.href;
function local_time(){
    var local = new Date();
    var year = local.getFullYear();
    var month = local.getMonth()+1;
    if(month<10){
        month = "0"+month;
    }
    var day = local.getDate();
    if(day<10){
        day = "0"+day;
    }
    var time = local.toTimeString().substr(0,8);
    var local_time = year+"-"+month+"-"+day+" "+time;
    return local_time;
}
function diffDay_one(dateStrBefore, dateStrAfter) {
    if(dateStrBefore==undefined){
        return;
    }
    var dateStrBefore1 = dateStrBefore.substr(0,19); //发布时间
    var dateStrAfter1 = dateStrAfter.substr(0,19); //传入系统时间
    var dateStrBefore2 = dateStrBefore1.replace(/\-/g, '/');
    var dateStrAfter2 = dateStrAfter1.replace(/\-/g, '/');

    var days = 1000 * 60 * 60 * 24;
    var day1 = Date.parse(dateStrBefore2);
    var day2 = Date.parse(dateStrAfter2);
    if (isNaN(day1)) {
        alert(dateStrBefore + "格式不正确");
        return NaN;
    }
    if (isNaN(day2)) {
        alert(dateStrAfter + "格式不正确");
        return NaN;
    }
    var d = parseInt((day2 - day1) / days);
    if(d<1){//秒分小时
        var dateStrB = new Date(dateStrBefore.replace(/\-/g, '/').substring(0,18));
        var dateStrA = new Date(dateStrAfter.replace(/\-/g, '/'));
        var A_B = (dateStrA.getTime()-dateStrB.getTime())/1000;
        if(A_B<60){ //
            return "刚刚";//A_B+"秒前";
        }else{
            A_B = parseInt(A_B/60);
            if(A_B<60){//
                return A_B+"分钟前";
            }else{
                A_B = parseInt(A_B/60);
                if(A_B<60){
                    return A_B+"小时前";
                }
            }
        }
    }else{
        if(d<8){
            return d+"天前";
        }else{
            return dateStrBefore.substr(0,10); //显示日期
            //return dateStrBefore; //显示到秒
        }

    }
}

if(href.lastIndexOf("?")>-1){
    href=href.split("?")[0];
}
var pageIndex=1;
var ConfigUrlMixin ={
    getDefaultProps: function () {
        return{
            reply: "/mcall/customer/review/create/", //回复
            removeReply : "/mcall/customer/review/delete/", //删除
            praise: "/mcall/customer/prefer/create/", //赞
            praiseD: "/mcall/customer/prefer/delete/", //取消赞
            chat: "/mcall/customer/review/json_list/", //查看对话
            reviewType:$("#relationType").val()
        };
    }
};
var CommentImgs =React.createClass({
    componentDidMount:function(){

         //点击查看大图

        bigPicShow&&bigPicShow.init({
            /**
             * 指定多个class|| ID
             * */
            domIdList:[".al-terminalCommentImgBox"],
            topSwiperOptions: {
                isInit:true,//是否需要初始化,
                onInit:function(sipwer){
                    /**
                     * 为"还有几张"增加点击事件
                     * */

                },
                zoom:true,

            },
            imgClickCallBack:function(index,ele){
                if(comm.players.length){
                    for(var i=0;i<comm.players.length;i++){
                        comm.players[i]&&comm.players[i].player.pause();
                    }
                }
                Log.createBrowse(188,'点击大图');
                $('html').attr('sT',$(window).scrollTop());
                $('html,body').css({height:'100%',overflow:'hidden'});
                $('.ev-topTitle').html($(ele).parents('.Ev-imgCtrl').attr('typeTitle'));
            },
            bottomSwiperOptions: {
                isInit:false,//是否需要初始化,
            },
            closeCallBack:function(){
                $('html,body').css({height:'auto',overflow:'auto'});
                $(window).scrollTop($('html').attr('sT')||0);
                $('html').removeAttr('sT');
            },
            theme:'dark',
            topTitle:{
                isInit:true,
                title:""
            }
        });
        $(".alImgHasMore").on("click",function(){
            $(this).siblings("img").click();
        });
    var len=0;
    $.each($('.al-terminalCommentImgMore'),function(i,ele){
        len = $(ele).find('.al-terminalCommentImg').length;
        if(len>6){
            $(ele).find('.al-terminalCommentImg:gt(5)').css('display','none');
            if($(ele).find('.alImgHasMore').length==0){
                $(ele).find('.al-terminalCommentImg').eq(5).append('<div class="alImgHasMore">还有'+(len-6)+'张></div>');
            }
        }
    });
     return false;

},
    render:function(){
        var s=this.style;
        var len = this.props.imgList.length;
        var lis = this.props.imgList.map(function(e,i){
                return  <figure className="al-terminalCommentImg"  key={e.id}  id={e.id}>
                            <img src={e.attUrl} alt="" data-attwidth={e.originalAttWidth} data-attheight={e.originalAttHeight}/>
                        </figure>;

        });
        return(
                (len===0)?(<div></div>):
                    (
                    <section className={len==1?"al-terminalCommentImgBox al-terminalCommentImgOne ev-picList":"al-terminalCommentImgBox al-terminalCommentImgMore ev-picList"}>
                        {lis}
                    </section>
                    )
        );
    }
});
var CommentVideos = React.createClass({
    componentDidMount: function () {
        var t=this;
        //var vWidth = $('.decorBox').width();
        //var vHeight = parseInt(vWidth*9/16);
        $('.ev-commentPlayBtn').off('touchend').on('touchend',function(event){
            var vWidth = $(this).siblings('.decorBox').width();
            var vHeight = $(this).siblings('.decorBox').parent().height();
            var poster = $(this).siblings('.decorBox').attr('src');
            $(this).css('opacity',0);
            $(this).siblings('.decorBox,.al-videoTime').css('opacity',0);
            var parents = $(this).parents('.al-terminalImg');
            if(parents.find('video').length===0){
                //var v = "<video class='commentVideo' controls src='"+parents.attr('data-atturl')+"' style='width:"+vWidth+"px;height:"+vHeight+"px'></video>"
                //parents.append(v).find('video')[0].play();
                var n = $('video').length+2;
                var videoItem = ' <video id="CKa'+n+'" class="video-js vjs-default-skin vjs-no-flex vjs-big-play-centered">'+
                    '  <source src="'+parents.attr('data-atturl')+'">'+
                    '  </video>';
                $(this).siblings('.decorBox').hide();
                parents.append(videoItem);
                var players =[];
                    players[n] = new AllinmdPlayer('CKa'+n, {
                    width: vWidth,
                    height: vHeight,
                    poster: poster,  //播放之前需要放置的海报图片
                    //设置播放权限时间，使用时需保证allow值为true
                    limitPlayTime: {
                        allow: false,
                        value: 180
                    },//设置允许最大的快进时长，用于限制用户拖拽至不允许播放的时间点，使用时需保证allow值为true
                    setMaxPlayTime: {
                        allow: false,
                        value: 0
                    },
                    isH5:true
                }, function () {
                    var isIOS = comm.browser.versions.ios;
                    var ua = navigator.userAgent.toLowerCase();
                    var isAndroidChrome = /chrome\/[\d|.]+ mobile safari\/[\d|.]+$/g.test(ua);  //android手机chrome浏览器
                    if(isIOS||isAndroidChrome){  //ios放出全屏（版本10以下playsinline无效，暂无解决方法）
                        $('.vjs-fullscreen-control').show().css('marginRight','0.1rem');
                        $('.allinmd-time-elements').css({
                            float:'left',
                            margin:"2px 0 0 0"
                        });
                    }
                });
                if(comm.players){
                    comm.players.push(players[n]);
                }

                players[n].player.play();
                players[n].player.on('play',function(){
                    var _player = players[n].player;
                    $.each(comm.players,function(ix,plea){
                            if(_player != plea.player){
                                plea.player.pause();
                            }
                    });
                });
                event.stopPropagation();
                return;
            }else{
                return false;
            }
        });

    },
    render: function () {
        React.initializeTouchEvents(true);
        var s=this.style;
        var len = this.props.videoList.length;
        var t=this;
        var vLists =this.props.videoList.map(function(e,i){
            if(e.qiniuStatus==2){
                return <section className="al-terminalImgVideo">
                            <figure className="al-terminalImg" key={i} data-atturl={e.attUrl} style={{'min-height':"3.111rem"}}>
                                <img src={e.attLogoUrl} alt="" className="decorBox ev-VideoPic"/>
                                    <i className="al-terminalVideoBtn ev-commentPlayBtn">
                                        <img src="//img50.allinmd.cn/pages/case/video.png" alt="" className="ev-VideoPic"/>
                                    </i>
                                <span className="al-videoTime">{e.playTime}</span>
                            </figure>
                        </section>
            }else if(e.qiniuStatus==1){
                return  <section className="al-terminalImgVideo">
                            <figure className="al-terminalImg" key={i}>
                                <img src='//img50.allinmd.cn/case/videoFormating.jpg' alt="" className="ev-VideoPic"/>
                            </figure>
                        </section>

            } else if(e.qiniuStatus==4){
                return  <section className="al-terminalImgVideo">
                    <figure className="al-terminalImg" key={i}>
                        <img src='//img50.allinmd.cn/case/videoFailing.jpg' alt="" className="ev-VideoPic"/>
                    </figure>
                </section>
            }else{
                return <div></div>;
            }
            });
            return (
                (len==0)?(<div></div>):(<div>{vLists}</div>)
        );
    }
});
var DetailComment = React.createClass({
    mixins:[ConfigUrlMixin],
    getInitialState: function () {
        return {
            dataList:[],
            ajaxState:false,
            customerId:$('.al-terminalAuthorImg a').attr('href')!=undefined?$('.al-terminalAuthorImg a').attr('href').split('cid=')[1]:0,
            praiseState:false,
            refName:($('.al-terminalContentTitle h2').text()||$('.videoIntroduction .al-titleName').text()).replace(/%/g,"@+@")
        };
    },
    componentDidMount: function () {
        var t=this;
        dataFetch(t);
        $(".al-terminalSortChangeItem").on("click", function() {
            $(this).addClass('active').siblings().removeClass('active');
            pageIndex=1;
            dataFetch(t);
            return false;
        });

    },
    praise:function(e){
        var t=this;
        var userId = TempCache.getItem('userId');

        var state;
        var auth = TempCache.getItem('auth');
        if(auth&&auth!=null){
            state = JSON.parse(auth).state;
        }
        var praising =this.state.praiseState;
        if(TempCache.getItem("customerRole") === "14"){
            // 审核与二次认证
            if(user.getRenZhengInfo().state === 0 || user.getRenZhengInfo().state === 1){
                comm.alertBox({
                    "title":"认证资料审核将在1-3个工作日内完成，请耐心等待 ",
                    "ensure":"知道了",
                });
            }else{
                // 厂商未认证时,直接去APP认证,认证后可以看
                var androidParam = "{}";
                var iosParam = "";
                comm.newReleaseBox({
                    imgPath:"/images/img50/case/release.png",
                    title:"厂商认证需使用唯医骨科App",
                    solidBtnTitile:"立即使用",
                    authNoneTitle:"暂不使用",
                    data:{
                        el: ".solidBtn",
                        ios: "allinmdios://app.allinmd.cn/applinks.html?"+iosParam,
                        ios9: "http://app.allinmd.cn/applinks.html?"+iosParam,
                        android: "allin://com.allin.social:75235?data="+androidParam
                    }
                });
            }
        }else{
            // 认证厂商医助可以赞
            if(state==2||state==7||state==8||state==9 || (
                TempCache.getItem("customerRole") === "15" ||
                TempCache.getItem("customerRole") === "13")) {
                var eT = $(e.target).parents('.ev-praise')||$(e.target);
                var isPraised = (eT.find('i').attr('class')=="icon-terminalLiked")?true:false;

                var refId = $(eT).parents('.al-terminalCommentItem').attr('data-reactid').replace(/.0.\$/, '');
                var paramJson = {
                    "customerId": userId, "upDownType": 1, "refId": refId, "usefulType": 8
                };
                if (isPraised === false&&praising == false) {
                    comm&&comm.creatEvent&&comm.creatEvent({
                        triggerType:'评论区点赞',
                        trigger_name:"评论区点赞",
                        keyword:eT.parents('.al-terminalCommentItem').find('h3 a').attr('href').split('=')[1],
                        actionId:75
                    });
                    t.setState({praiseState:true});
                    $.ajax({
                        url: this.props.praise,
                        type: "post",
                        data: {paramJson: $.toJSON(paramJson)},
                        dataType: 'json',
                        success: function (data) {
                            popup("点赞成功");
                            t.setState({praiseState:false});
                            eT.find('i').removeClass('icon-terminalLike').addClass('icon-terminalLiked');
                            eT.find('span').text(parseInt(eT.find('span').text())+1);
                        }
                    });
                } else if (isPraised === true&&praising==false) {
                    t.setState({praiseState:true});
                    $.ajax({
                        url: this.props.praiseD,
                        type: "post",
                        data: {paramJson: $.toJSON(paramJson)},
                        dataType: 'json',
                        success: function (data) {
                            popup("点赞取消");
                            t.setState({praiseState:false});
                            eT.find('i').removeClass('icon-terminalLiked').addClass('icon-terminalLike');
                            eT.find('span').text(parseInt(eT.find('span').text())-1);
                        }
                    });
                }
            }else{
                user.privExecute({
                    operateType: 'auth',
                    noNeedBack:true,
                    callback:function(){}
                })
            }
        }
    },
    render: function () {
        React.initializeTouchEvents(true);
        console.log('执行');
        var s=this.style;
        var t=this;
        var type = function(x){
            switch(x){
                case 1:
                    return '视频';break;
                case 7:
                    return '病例';break;
                case 2:
                    return '文库';break;
                case 4:
                    return '话题';break;
            }
        };
        var authCustomerId =t.state.customerId;
        var lis =this.state.dataList.map(function(e,i){
            //处理评论中a标签被截断问题
            var temp="";
            // var _str = comm.getStrLen(e.parent_review_insite.reviewContent,140).replace(/<(\/*?[b-z].*?)>/g,"&lt;$1&gt;").replace(/&lt;br\/&gt;/g,'<br/>');
            // if(_str.indexOf("<a")>-1){
            //     if(_str.match(/<a/g).length>_str.match(/<\/a/g).length){
            //         _str = _str.substring(0,_str.lastIndexOf('<a'));
            //     }
            //     temp =_str.replace(/href=/g,"data-ajax=false style='color:#2899e6;' href=/pages/personal/others_contribution.html?cid=");
            // }else{
            //     temp=_str;
            // }
			var _str = e.parent_review_insite.reviewContent.replace(/<(\/*?[b-z].*?)>/g,"&lt;$1&gt;").replace(/&lt;br\/&gt;/g,'<br/>');
			temp =_str.replace(/href=/g," style='color:#2899e6;' href=/dist/personal/others_index.html?cid=");
            var isValExist = function(obj){
                if($.isEmptyObject(obj) || obj.length == 0){
                    return false;
                }
                return true;
            };
            var sttyle= {overflow:'hidden',textOverflow: 'ellipsis',display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical',overflow: 'hidden'};
            return (
                <section key={e.customer_review.id} className='al-terminalCommentItem' data-refId= {e.customer_review.refId}>
                    <header className="al-terminalCommentItemHeader">
                        <figure className="al-terminalCommentItemImg">
                            <a href={"/dist/personal/others_index.html?cid="+(e.customer_auth.customerId)} data-ajax="false">
                                <img src={isValExist(e.customer_att.logoUrl)?e.customer_att.logoUrl:"//img00.allinmd.cn/default/customer/35_35.jpg"} />
                            </a>
                        </figure>
                        <figcaption className="al-terminalCommentItemHeadMsg">
                            <h3>
                                <a href={"/dist/personal/others_index.html?cid="+(e.customer_auth.customerId)}>
                                {e.customer_auth.lastName+e.customer_auth.firstName}
                                </a>
                                <i className={(e.customer_auth.state==1||e.customer_auth.state==2||e.customer_auth.state==7||e.customer_auth.state==8||e.customer_auth.state==9)?"al-vipUser":""}></i>
                                {e.customer_review.refCustomerIdStr.lastIndexOf(e.customer_auth.customerId)>-1?(<span className="detail-publisher">楼主</span>):""}
                                {parseInt(e.college_course_info.studentNum,10)?(<span className="communication-num">NO.{e.college_course_info.studentNum}</span>):""}
                                {parseInt(e.college_course_info.teacher,10)?(<span className="communication-teacher">讲师</span>):""}
                            </h3>
                            <p>{e.customer_auth.company}</p>
                                <span className="al-terminalCommentTime">
                                    {diffDay_one((e.customer_review.publishTime),local_time())}
                                </span>
                        </figcaption>
                    </header>
                    <article className="al-terminalCommentContent">
                        {e.customer_review.parentId == 0 ? "" :
                            <p className="quoteComment" style={sttyle}>
                                {e.parent_customer_auth.lastName+e.parent_customer_auth.firstName+":"}
                                <span dangerouslySetInnerHTML={{__html:temp }} />
                            </p>
                                }
                        <p className="content">
                            <span dangerouslySetInnerHTML={{__html:(e.customer_review.reviewContent).replace(/<(\/*?[b-z].*?)>/g,"&lt;$1&gt;").replace(/&lt;br\/&gt;/g,'<br/>').replace(/href=/g," style='color:#2899e6;' href=/dist/personal/others_index.html?cid=") }} />
                        </p>

                    </article>
                    {e.customer_review_insite_attachment_video.length>0?<CommentVideos videoList = {e.customer_review_insite_attachment_video}/>:""}
                    {e.customer_review_insite_attachment.length>0?<CommentImgs imgList = {e.customer_review_insite_attachment}/>:""}
                    {(e.customer_quote.length>0)&&<p className="quote">引用{type(e.customer_quote[0].refQuoteType)}<a href={e.customer_quote[0].web_storage_path}>《{e.customer_quote[0].refQuoteName}》</a></p>}
                    {(/eBook_details/g.test(window.location.href))?"":e.customer_review.parentId>0?
                        (<section className="al-al-terminalCommentSns"  data-parentid={e.customer_review.parentId} data-cid={e.customer_review.refId} data-reviewId={e.customer_review.id} ref='checkDialog' >

                            <a className="al-checkComment"
                                    href={"/dist/personal/details_discuss.html?" +
                                 "refCustomerId="+e.customer_review.customerId+
                                 "&refId="+e.customer_review.refId+
                                 "&refType="+e.customer_review.reviewType+
                                 "&reviewId="+e.customer_review.id+
                                 "&refName="+t.state.refName+
                                 "&refUrl="+location.href.split('?')[0]
                                 }>查看讨论</a>

                            <article className="al-terminalCommentSnsMsg">
                                <a href={'/pages/common/comment.html' +
                                        '?resourceId='+e.customer_review.refId+
                                        '&username='+e.customer_auth.lastName+e.customer_auth.firstName+
                                        '&type='+$('#relationType').val()+
                                        '&parentId='+e.customer_review.id} identity='reply' className="al-terminalCommentSnsItem ev-review" data-ajax="false">
                                    <i className="icon-terminalComment">
                                        <span>{e.customer_review.reviewNum}</span>
                                    </i>
                                </a>
                                <button className="al-terminalCommentSnsItem ev-praise" onTouchEnd = {t.praise}>
                                    <i className={e.customer_prefer.isValid==1?"icon-terminalLiked":"icon-terminalLike"}>
                                        <span>{e.customer_prefer.isValid==1?(e.customer_review.upNum==0?1:e.customer_review.upNum):e.customer_review.upNum}</span>
                                    </i>
                                </button>
                                <a className="al-terminalCommentSnsItem"
                                   href={"/dist/personal/details_discuss.html?" + //details_content.html redmine##39902
                                 "refCustomerId="+e.customer_review.customerId+
                                 "&refId="+e.customer_review.refId+
                                 "&refType="+e.customer_review.reviewType+
                                 "&reviewId="+e.customer_review.id+
                                 "&refName="+t.state.refName+
                                 "&refUrl="+href
                                 }
                                    >
                                    <span className="more"></span>
                                </a>
                            </article>
                        </section>):
                        (<article className="al-terminalCommentSnsMsg">
                            <a href={'/pages/common/comment.html' +
                                        '?resourceId='+e.customer_review.refId+
                                        '&username='+e.customer_auth.lastName+e.customer_auth.firstName+
                                        '&type='+$('#relationType').val()+
                                        '&parentId='+e.customer_review.id} identity='reply' className="al-terminalCommentSnsItem ev-review" data-ajax="false">
                                <i className="icon-terminalComment">
                                    <span>{e.customer_review.reviewNum}</span>
                                </i>
                            </a>
                            <button className="al-terminalCommentSnsItem ev-praise" onTouchEnd = {t.praise}>
                                <i className={e.customer_prefer.isValid==1?"icon-terminalLiked":"icon-terminalLike"}>
                                    <span>{e.customer_prefer.isValid==1?(e.customer_review.upNum==0?1:e.customer_review.upNum):e.customer_review.upNum}</span>
                                </i>
                            </button>
                            <a className="al-terminalCommentSnsItem"
                               href={"/dist/personal/details_content.html?" +
                                 "refCustomerId="+e.customer_review.customerId+
                                 "&refId="+e.customer_review.refId+
                                 "&refType="+e.customer_review.reviewType+
                                 "&reviewId="+e.customer_review.id+
                                 "&refName="+t.state.refName+
                                 "&refUrl="+href
                                 }
                                >
                                <span className="more"></span>
                            </a>
                        </article>)
                    }




                </section>
            );
        });

        return (
            <div>{lis}</div>
        );
    }
});

$(function(){
    setTimeout(function(){
        React.render(<DetailComment />,document.getElementById('EQ_newReplyList'));
        if($('.ev_commentNav').length)$('.ev_commentNav').show();
        $('.ev-review').on('click',function(e){
            // 厂商医助不可以评论
            if(TempCache.getItem("customerRole") === "14" ||
                TempCache.getItem("customerRole") === "15" ||
                TempCache.getItem("customerRole") === "13"){
                comm.toastFactoryAuth(null);
                e.preventDefault();
            }else { // 原逻辑
                if(localStorage.getItem('customerRole')==3||localStorage.getItem('customerRole')==2||localStorage.getItem('customerRole')==4){
                    popup('该用户没有操作权限');
                    e.preventDefault();
                }else{
                    TempCache.setItem('commentFromPage',window.location.href);
                }
            }
        });
    },100);
    $("#EQ_newReplyList").on("click",'.alImgHasMore',function(){
        $(this).siblings("img").click();
    });
});
function dataFetch(o,reset){
    var data=[];
    var webParams = {
        refId : $("#resourceId").val()||comm.getpara().bId,
        relationType :$("#relationType").val(),
        replyUp : false,         //是否置顶回复
        canAjax:true,
        hasMore:true
    };
    var url = "/mcall/customer/review/json_list/",params={};
    params = {
        dataFlag:1,
        reviewType:webParams.relationType,
        sortType:parseInt($('.al-terminalSortChangeItem.active').attr('sortType')),
        scene:2,
        reviewStatus:1,
        logoUseFlag:3,
        attUseFlag:3,
        refId:webParams.refId,
        pageSize:20

    };

    var getData_setState = function(){
        if(webParams.canAjax&&webParams.hasMore){
            webParams.canAjax =false;
            if(comm&&comm.loading){
                comm.loading.show();
            }
            params.sortType = parseInt($('.al-terminalSortChangeItem.active').attr('sortType'));
            params.pageIndex = pageIndex;
            $.ajax({
                url:url,
                type:"post",
                data:params,
                dataType:'json',
                async:false,
                success:function(res){
                    if(comm&&comm.loading){
                        comm.loading.hide();
                    }
                    if(res&&!$.isEmptyObject(res.responseObject.responseData)&&res.responseObject.responseData.data_list.length){
                        data = data.concat(res.responseObject.responseData.data_list);
                        o.setState({dataList:data});

                        webParams.canAjax=true;
                        if(res.responseObject.responseData.data_list.length<20){
                            $('.al-terminalFinish').show();
                            webParams.hasMore =false;
                            return false;
                        }else{
                            $('.al-terminalFinish').hide();
                        }
                        $('.al-terminalNoComment').hide();
                    }else{
                        webParams.canAjax =false;
                        if(pageIndex===1){
                            $('.al-terminalNoComment').show();
                            $('.al-terminalFinish').hide();
                            webParams.hasMore =false;
                        }else{
                            $('.al-terminalNoComment').hide();
                            $('.al-terminalFinish').show();
                            webParams.hasMore =false;
                        }
                        return false;
                    }
                }
            });
            ($('.ui-loader').css('display')=='block')&&setTimeout(function(){
                if(comm&&comm.loading){
                    comm.loading.hide();
                }
            },5000);
            pageIndex++;
        }else{
            return false;
        }
    };
    getData_setState();
    $(window).on('scroll',function(){
        if($('#EQ_newReplyList section').length) {
            if ($(window).scrollTop() >= $(document).height() - $(window).height()-100) {
                getData_setState();
                if(window.location.href.lastIndexOf("eBook")>-1){
                    if($(".comment").hasClass("active")){
                        $(".slide-wrapper").height($(".slide-content[data-role=comment]").innerHeight());
                    }
                }
                return false;
            }
        }
    })
}
