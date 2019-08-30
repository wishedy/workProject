<template>
    <section v-if="isVal"><!--v-if="isVal"-->
       <!-- <header class="al-personalScrollHead al-personalHeadFixed" v-if="titleScroll">
            <a href="javascript:history.back(-1);" class="ev_backBtn scrollBack">
                <img src="//img50.allinmd.cn/pages/personal/arrow_back.png" alt=""/>
            </a>
            <span class="ev-name namecenter">{{orgHeadInfo.name}}</span>
            <span class="al-personalShare"></span>
        </header>-->
        <!--banner 区域开始-->
        <aside class="al-orgBanner" ref="orgBanner">
            <header class="al-headerBox">
                <p class="al-backBtn" @click="backFun"><img src="/static/images/personal/return-White.png"/></p>
                <p class="al-shareBtn"></p>
            </header>
            <h2 class="al-orgTitle">{{orgHeadInfo.name}}</h2>
            <p class="al-orgInfo" @click="wakeNewsFn">{{orgHeadInfo.introduction|textLen}}</p>
            <i class="afterLine"></i>
            <ul class="al-socialBtn">
                <li v-if="orgHeadInfo.memberNum>0" @click="commCreateEvent({id:'11472'})">
                    <router-link :to="{path:'orgMembers',query:{orgId:orgId}}">
                        <p class="num">{{orgHeadInfo.memberNum}}</p>
                        <p class="member">成员</p>
                    </router-link>
                </li>
                <li @click="commCreateEvent({id:'11473'})">
                    <router-link :to="{path:'orgFollow',query:{orgId:orgId}}">
                        <p class="num">{{orgHeadInfo.fansNum?orgHeadInfo.fansNum:0}}</p>
                        <p class="member">粉丝</p>
                    </router-link>
                </li>
                <li @click="resScroll"><p class="num">{{orgHeadInfo.resourceNum?orgHeadInfo.resourceNum:0}}</p>
                    <p class="member">资源</p></li>
            </ul>
            <button class="followBtn " :class="{active:followState==2||followState==3||followState==4}" @click="followFn">{{(followState==2||followState==3||followState==4)?'':'关注'}}</button>
        </aside>
        <!--banner 区域结束-->
        <!--新闻公告开始-->

        <aside class="al-newsNotice" v-if="newsArrList.length>0">
            <h2 class="al-newsTitle"><span>新闻公告</span><router-link :to="{path:'orgNewsBulletin',query:{orgId:orgId}}"><i @click="commCreateEvent({id:'11480'})" v-if="newsHasMore">更多</i></router-link></h2>
                <swiper :options="swiperOption" ref="mySwiper" class="al-carousel">
                    <swiper-slide v-for="(val,key) in newsArrList" :key="key"  >
                        <a  @click="commCreateEvent({id:key==0?'11478':'11479'})"
                            :href="val.h5Url?val.h5Url:'javascript:;'"
                            class="newsBody">
                            <i></i><span>{{val.newsBody|newsLen}}</span>
                        </a>
                    </swiper-slide>
                    <p class="newsLine swiper-pagination" slot="pagination"></p>
                </swiper>
            <!--</aside>-->
        </aside>
        <!--新闻公告结束-->
        <!--专栏开始-->
        <ListInfo></ListInfo>
        <!--专栏结束-->
        <!--组织简介遮罩开始-->
        <AbsPop></AbsPop>
        <!--组织简介遮罩结束-->
    </section>
    <section class="al-notOrgInfo" v-else>
        <header class="al-personalScrollHead">
            <a href="javascript:history.back(-1);" class="ev_backBtn scrollBack">
                <img class="not_found_img" src="//img50.allinmd.cn/pages/personal/arrow_back.png" alt=""/>
            </a>
        </header>
        <figure>
            <img src="/static/images/personal/nocontent.png" />
            <p>很抱歉，这个组织不见了~</p>
        </figure>

    </section>
</template>

<script>
    import { swiper, swiperSlide } from 'vue-awesome-swiper'
    import TempCache from "static/js/tempcache.js";
    import comm from 'static/js/comm.js';
    import user from 'static/js/module.user.js';
    import app from 'static/js/comm.app.js';
    import {mapActions, mapGetters} from "vuex";
    import ListInfo from './orgListInfo.vue';
    import AbsPop from './orgAbsPop.vue';
    const path={
        getShare: "/mcall/comm/data/share/getMapList3/",//获取分享话术
        getOrgInfo: "/mcall/organization/getOrgInfo/",//获取组织基本简介总概
        getNewsPager: "/mcall/organization/getNewsPager/",//新闻公告
        isFollow: "/mcall/customer/follow/people/create/",//关注接口
        unFollow: "/mcall/customer/follow/people/delete/",//取消关注接口
    };
    export default {
        name: "orgInfo",
        data() {
            return {
                orgId:comm.getpara().orgId?comm.getpara().orgId:"",//组织id
                orgHeadInfo:"",//头部信息
                tagShow:false,//专栏下拉筛选
                dataListArr:[],//专栏数据列表数组
                tagListArr:[],//专栏筛选标签数组
                newsListArr:[],//新闻公告列表
                titleScroll:false,//头部
                newsHasMore:false,//新闻公告有更多按钮
                newsArrList:[],//新闻公告数组
                swiperOption: {//以下配置不懂的，可以去swiper官网看api，链接http://www.swiper.com.cn/api/
                    notNextTick: true,
                    autoplay: false,
                    pagination : '.swiper-pagination',
                    paginationClickable :true,
                    observeParents:true,
                    onSlideChangeEnd: function(swiper){
                        swiper.startAutoplay();
                    }
                },
                followState:1,//关注状态，默认未关注
                isVal:true,//组织有效
            }
        },
        components:{
            ListInfo,//专栏列表
            AbsPop,//新闻简介
            swiper,
            swiperSlide
        },
        computed:{
            ...mapGetters(['isLoading','headShow'])
        },
        methods: {
            ...mapActions(["changeLoading",'changeNewsPop','changeHeadShow',"commCreateEvent"]),
            //资源上滑滚动
            resScroll(){
                let t=this;
                t.commCreateEvent({id:'11474'});//资源埋点
                $('html,body').animate({scrollTop:
                    $('.ev-alColumn').offset().top},800);
            },
            //点击唤醒简介弹层
            wakeNewsFn(){
                let t=this;
                t.changeNewsPop(true);
                t.commCreateEvent({id:'11471'});//点击简介埋点
            },
            //分享按钮
            shareFun(){
                let t=this;
                //获取分享话术
                let data={};
                data.customerId=t.cId||'';
                data.logoUseFlag=4;
                data.pageIndex=1;
                data.pageSize=1;
                data.useFlag=1;
                data.sceneType=87;
                data.resourceType=0;
                // data.resourceId=t.orgId;
                data.organizationId=t.orgId;
                let param={};
                param.paramJson= JSON.stringify(data);
                //分享
                let shareObj={};
                let shareSence="";
                shareAll({
                    url:window.location.href,
                    qShareLog:function(x){    //分享新浪，空间成功与否都执行
                        if(x=='sina'){
                            comm.shareLog({
                                shareType: "",
                                resourceId:"" ,
                                resourceType: "",
                                refId: "",
                                isValid: 1,
                                shareSence:shareSence,
                                shareChannel:3,
                                shareContent:shareObj.sinaTitle
                            });
                        }else{
                            comm.shareLog({
                                shareType: "",
                                resourceId:"" ,
                                resourceType: "",
                                refId: "",
                                isValid: 1,
                                shareSence:shareSence,
                                shareChannel:1,
                                shareContent:shareObj.qZoneTitle
                            });
                        }
                    },
                    fnMessageSuc:function(){//微信好友
                        comm.shareLog({
                            shareType: "",
                            resourceId:"" ,
                            resourceType: "",
                            refId: "",
                            isValid: 1,
                            shareSence:shareSence,
                            shareChannel:4,
                            shareContent:shareObj.wxTitle
                        });
                    },      //分享好友成功回调
                    fnTimelineSuc:function(){//朋友圈
                        comm.shareLog({
                            shareType: "",
                            resourceId:"" ,
                            resourceType: "",
                            refId: "",
                            isValid: 1,
                            shareSence:shareSence,
                            shareChannel:5,
                            shareContent:shareObj.timeLineTitle
                        });
                    },      //分享朋友圈成功回调
                    triggerRequest:function(){
                        $.ajax({
                            type : "post",
                            url : path.getShare,
                            data : param,
                            async:false,
                            dataType : "json",
                            success : function(rep){
                                t.commCreateEvent({id:'11481'});
                                if(rep&&rep.responseObject.responseStatus){
                                    var shareJson=rep.responseObject.responseData.data_list[0];
                                    var WechatTimeline;
                                    shareObj.pic = shareJson.share_comm.shareImageUrl;
                                    shareObj.title = shareJson.share_comm.shareTitle!=""?shareJson.share_comm.shareTitle:document.title;
                                    shareObj.url = window.location.href;
                                    $.each(shareJson.share_channel,function(i,el){
                                        if(el.shareChannel=='Sina'){
                                            shareObj.sinaTitle=el.shareDesc;
                                        }else if(el.shareChannel=="WechatFriend"){
                                            shareObj.wxTitle = el.shareTitle;
                                            shareObj.wxDesc = el.shareDesc.substring(0,60);
                                        }else if(el.shareChannel=="QZone"){
                                            shareObj.qzoneTitle=el.shareTitle;
                                            shareObj.summary = el.shareDesc;
                                        }else if(el.shareChannel=="WechatTimeline"){
                                            shareObj.timeLineTitle=el.shareTitle;
                                        }
                                    });

                                }else{
                                    var shareSummary="推荐"+t.orgHeadInfo.name+"的唯医骨科组织主页";
                                    shareObj.summary = shareSummary;
                                    shareObj.wxTitle = "推荐"+t.orgHeadInfo.name+"的唯医骨科组织主页";
                                    shareObj.wxDesc = shareSummary;
                                    shareObj.sinaTitle = "推荐"+t.orgHeadInfo.name+"的唯医骨科组织主页";
                                    shareObj.desc = "推荐"+t.orgHeadInfo.name+"的唯医骨科组织主页";
                                    shareObj.pic = "";
                                    shareObj.url = window.location.href;
                                }
                            },
                            error:function(){}
                        });
                        return shareObj;
                    }
                },false,$('.al-shareBtn'));
            },
            //顶部返回按钮
            backFun(){
                let t=this;
                if(!document.referrer){
                    window.location.href="//m.allinmd.cn";
                }else{
                    history.back();
                }
            },
            //唤醒app
            wakeup() {
                let t = this;
                let amChannel = comm.getpara()._amChannel;
                let callAppOptions = {
                    ios: "allinmdios://app.allinmd.cn/applinks.html?scene=organizationScene&organizationId="+t.orgId+"" + (amChannel ? "&_amChannel=" + amChannel : ''),
                    android: "allin://com.allin.social:75235?data={scene:3,type:86,sourceId="+t.orgId+"" + (amChannel ? ",_amChannel:" + amChannel : '') + "}",
                    ios9: "http://app.allinmd.cn/applinks.html?scene=organizationScene&organizationId="+t.orgId+"" + (amChannel ? "&_amChannel=" + amChannel : ''),
                    runAtOnce: false
                };
                app.appWakeUp("figure", callAppOptions);//下载app层
            },
            //组织简介
            orgHeaderInfo(){
                let t=this;
                comm.ajax2({
                    url: path.getOrgInfo,
                    type: "get",
                    data: {paramJson:JSON.stringify({
                            customerId: TempCache.getItem("userId") != null ? TempCache.getItem("userId") : "0",
                            organizationId:t.orgId,//组织id
                        })
                    },
                    timeout: 30000,
                    success:function(res){
                        if(comm.hasResponseData(res)){//基本信息
                            if(res.responseObject.responseData.dataList&&
                                res.responseObject.responseData.dataList.isValid==1){//判断组织有效
                                t.isVal=true;
                                t.orgHeadInfo=res.responseObject.responseData.dataList;
                                t.followState=t.orgHeadInfo.relationship&&
                                $.isEmptyObject(t.orgHeadInfo.relationship)
                                &&typeof(t.orgHeadInfo.relationship)!="object"?t.orgHeadInfo.relationship:1;
                                if(t.orgHeadInfo.headImgUrl){//头图
                                    $(".al-orgBanner").css("backgroundImage",'url('+t.orgHeadInfo.headImgUrl+')');
                                }
                            }else{//组织页无效
                                t.isVal=false;
                            }
                        }else{//组织页无效
                            t.isVal=false;
                        }
                    }
                });
            },
            //检测滚动改变定位
            winScroll(){
                let t=this;
                window.addEventListener('scroll', function (){
                    if(location.hash.indexOf("orgMembers")==-1&&location.hash.indexOf("orgNewsBulletin")==-1
                    &&location.hash.indexOf("orgFollow")==-1){//判断路由hash值 为首页时才进行专栏定位
                        let top = document.documentElement.scrollTop || document.body.scrollTop;//滚动高度
                        let headHeight =document.getElementsByClassName("al-orgBanner").length===0?0: document.getElementsByClassName("al-orgBanner")[0].offsetHeight;//头部的简介区域的高度
                        let appH = document.getElementsByClassName("al-appWakeUpFigure").length === 0 ? 0 : document.getElementsByClassName("al-appWakeUpFigure")[0].offsetHeight;//唤醒app弹层的高度
                        let newsH = document.getElementsByClassName("al-newsNotice").length === 0 ? 0 : document.getElementsByClassName("al-newsNotice")[0].offsetHeight;//新闻公告部分的高度
                        let evCon= document.getElementsByClassName("ev-alColumn").length === 0 ? 0 : document.getElementsByClassName("ev-alColumn")[0].offsetTop;//专栏区域的
                        let HeadFixed = document.getElementsByClassName("al-personalHeadFixed").length === 0 ? 0 : document.getElementsByClassName("al-personalHeadFixed")[0].offsetHeight;//固定头部的高度
                        /*  if(top>=headHeight+appH){
                              t.titleScroll=true;//组织名和头部显示
                          }else{
                              t.titleScroll=false;//组织名和头部隐藏
                          }*/
                        if(top>=headHeight+appH+newsH){//滚动区域所过高度
                            t.changeHeadShow(true);//头部定位启动
                        }else{
                            t.changeHeadShow(false);//头部定位关闭
                        }
                    }
                });
            },
            //获取新闻公告列表
            getNewsMes(){
                let t=this;
                comm.ajax2({
                    url: path.getNewsPager,
                    type: "get",//接口文档是get
                    data: {paramJson:JSON.stringify({
                            pageIndex: 1,
                            pageSize: 3,
                            organizationId: t.orgId,//组织id
                        })
                    },
                    timeout: 30000,
                    success:function(res){
                        if(comm.hasResponseData(res)&&res.responseObject.responseData.dataList
                        &&res.responseObject.responseData.dataList.length>0){//新闻公告有列表
                            let item=res.responseObject.responseData.dataList;
                            if(item.length>2){//新闻公告更多按钮
                                t.newsHasMore=true;
                            }else{
                                t.newsHasMore=false;
                            }
                            t.newsArrList.push(item[0]);
                            if(item[1]){//判断是否有第二个新闻公告再进行push数据
                                t.newsArrList.push(item[1]);
                            }
                        }else{//无新闻公告
                            t.newsArrList=[];
                        }
                    }
                });
            },
            //关注组织按钮
            followFn(){
                let t=this;
                user.privExecute({
                    operateType: 'auth',   //'login','auth','conference'
                    noNeedBack:true,
                    callback: function () {
                        t.followGoGoGo();
                    }
                });
            },
            //关注/取消关注发送请求欢乐GO
            followGoGoGo(){
                let t=this;
                if(t.followState==1){//关注
                    t.commCreateEvent({id:'11477',keyword:"关注组织"});//关注组织
                }else{//取消关注
                    t.commCreateEvent({id:'11477',keyword:"取消关注组织"});//取消关注组织
                }
                comm.ajax2({
                    url: t.followState==1?path.isFollow:path.unFollow,
                    type: "POST",//接口文档是get
                    data:  {paramJson:JSON.stringify({
                            "dataFlag":2,
                            "refId":t.orgId,
                            "followType":2,//关注组织
                        })
                    },
                    timeout: 30000,
                    success:function(res){
                        if(res.responseObject.responseStatus){//关注取消关注成功
                           if(t.followState==1){
                               t.followState=2;//对组织关注
                               t.orgHeadInfo.fansNum=t.orgHeadInfo.fansNum+1;
                           }else{
                               t.followState=1;//取消关注
                               t.orgHeadInfo.fansNum=t.orgHeadInfo.fansNum-1;
                           }
                        }else{//操作错误
                            // popup("操作失败，请稍后重试");
                        }
                    }
                });
            }
        },
        mounted() {
            let t = this;
            t.wakeup();//头部唤醒app
            t.shareFun();//头部分享按钮
            t.orgHeaderInfo();//组织头部信息，组织名，简介，成员信息关注状态
            t.winScroll();
            t.getNewsMes();
        },
        filters:{
            textLen(text){//容错截取72个汉字
                if(text){
                    return comm.getStrLen(text.toString().trim().replace(/\s/g,""),144);
                }
            },
            newsLen(text){//容错截取18个汉字
                return comm.getStrLen(text,34);
            }
        }
    }
</script>

<style>
.al-appWakeUpFigure{
    transform: translate(0,0);
}
</style>