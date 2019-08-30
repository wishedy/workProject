
<template>
    <header class="al-indexHeader" data-alcode-mod='401'>
        <figure class="al-indexHeaderItem">
            <a href="javascript:void(0)" class="ev_backBtn" @click="back"  v-show="headerConfig.backOnOff">
                <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAAiCAYAAAA6RwvCAAAAAXNSR0IArs4c6QAAAN1JREFUWAntmGsKwjAQhIOH8Bj1UQ/U4wrSk1j1CHUWHAgh9oeB2QWzsCyltPN1suTRlNrigsdn5BW5b3vV708bxAu5fnJClUcJcQeB3JEaxKC2YoRgPhzmhDvE4gXxhDAbMwzEAVDSOEOtdKJDWF9YT3Qn6MRR2pUQOyHzxnzg2gXChDlP/C8ETEi3wgkbInns5IobguaAe3+Qr8PQibKGmEsIVVtx5RPbFox80eswdOBbtZ17vhi67E0IFx5mIKm6hjhg8aNDwdTOv/JDOJ0pYSbe8KgGMyObf9S8ATFWhMFix94CAAAAAElFTkSuQmCC" alt="">
            </a>
            <a href="javascript:void(0)" class="ev_backBtnWhite" @click="back"  v-show="headerConfig.backOnOffWhite">
                <img src="http://img50.allinmd.cn/v3/vipShop/back.png" >
            </a>
        </figure>
        <figure class="al-indexHeaderItem" v-cloak :style="{width:centerStatus}">
            <h1>{{headerConfig.title}}</h1>
        </figure>
        <figure class="al-indexHeaderItem">
            <a href="javascript:void(0)" class="whiteSearch productListSearch" v-if="searchWhiteBtn" @click.stop="searchFn"><i></i></a> <!-- 产品列表局部搜索使用，白色搜索图标，使用时传入showSearchWhite即可 -->
            <a href="javascript:void(0)" class="blackSearch productListSearch" v-if="searchBlackBtn" @click.stop="searchFn"><i></i></a> <!-- 产品列表局部搜索使用，黑色搜索图标，使用时传入showSearchBlack即可 -->
            <a href="javascript:void(0)" class="search productListSearch" v-if="searchBtn" @click.stop="searchFn"><i></i></a> <!-- 产品列表局部搜索使用，使用时传入showSearch即可 -->
            <a href="/dist/feedback.html" class="feedback" v-if="feedbackBtn"><i></i>反馈</a>
            <a href="javascript:void(0)" :class="shareWhiteBtn?'shareWhite':'share'" v-if="shareBtn" ref="evShare" @click.stop="shareBegin"><i></i>{{(shareTitle&&shareTitle.length==0)?"分享":''}}</a>
            <a href="javascript:void(0)" class="share" v-if="headerConfig.editOnOff"><i></i>编辑</a>
            <a href="javascript:void(0)" v-if="headerConfig.release" @click="releaseCallApp" style="color:#2899e6;">+发布</a>
            <router-link tag="a" to="/rule" name="rule" active-class="active" v-if="headerConfig.rule" class="rules" style="font-size:0.4rem;"><i></i>规则</router-link>
            <a href="javascript:void(0)" class="ebookShare" v-if="ebookShareBtn" ref="evShare"></a> <!-- 书籍详情页使用,使用class="ebookShare"在下面 -->
        </figure>
    </header>
</template>{
<script type="text/ecmascript-6">
    /**
     * @Desc：公共头部分
     * @Usage: 组件绑定自定义属性:header-config="headerConfig",data方法内return如下,可根据情况自定义参数
     *  headerConfig:{
                    title:"热门活动",    *标题项
                    share:{             ..自定义分享项
                        onOff:false,
                        params:
                            "sceneType": "71",
                            "resourceType": 0,
                            "platformId": 1
                        },
                        shareWhiteBtn:false,  ..分享按钮是否是白色，传入true即为白色
                    },
                    feedback: {         ..自定义反馈项
                        onOff: false
                    },
                    showSearch:{  ..搜索
                        onOrOff:true,
                    },
                }
     * @Notify：自定义项如不需要可以不写
     * @Depend：*必填   ..根据使用填写
     *
     * Created by zhangheng on 17/11/9.
     * 11.23更新组件 [变量控制是否显示反馈及分享]
     */
    import comm from "static/js/comm.js";
    import user from 'static/js/module.user.js';
    import App from 'static/js/comm.app.js';
    const $ = require('jquery');
    export default {
        data(){
            return {
                shareTitle:'',
                feedbackBtn:false,
                shareBtn:false,
                shareWhiteBtn: false,
                shareParam:{},
                ruleBtn:false,
                ebookShareBtn:false,
                centerStatus:'',
                release:false,
                searchBtn:false,//是否显示搜索
                eventId:'',//事件埋点id
                searchBlackBtn: false, // 是否显示黑色搜索
                searchWhiteBtn: false, // 是否显示白色搜索
                whiteColorShare: false,//是否显示白色分享按钮
                sourceId:'',//品牌页sourceId，用来判断跳转指定的品牌页面
            }
        },
        props:["headerConfig"],
        mounted(){
            let t = this;
            t.thirdRight();
            if(this.shareBtn || this.ebookShareBtn){
                this.$nextTick(function(){
					t.share();
                });
            }
        },
        watch:{
            'headerConfig.share.onOff'(n){
                let t = this;
                if(n){
                    t.thirdRight();
                    if(this.shareBtn || this.ebookShareBtn){
                        this.$nextTick(function(){
                            t.share();
                        });
                    }
                }else{
                    t.thirdRight();
                }

            },
            'headerConfig.share.params'(n){
                let t = this;
                t.thirdRight();
                if(this.shareBtn || this.ebookShareBtn){
                    this.$nextTick(function(){
                        t.share();
                    });
                }
            }
        },
        methods:{
            back(){
                let t = this;
                comm.creatEvent({
                    triggerType:'全站功能按钮点击',
                    keyword:"返回",
                    actionId:41,
                    async:false
                });
                if(this.headerConfig.backFn){
                    this.headerConfig.backFn();
                }else{
                    if(window.history.length>1){
                        if(t.$router){
                            t.$router.go(-1);
                        }else {
                            //判断是支付详情页并且已经在优惠券页面选择了优惠券即导航上带有优惠券信息
                            if(window.location.href.indexOf('couponList.html')>0&&window.location.href.indexOf('jumpFrom')>0){
                               let hrefUrl = window.location.href.substring(window.location.href.indexOf('jumpFrom')+9,window.location.href.length)
                                window.location.replace(hrefUrl)
                            }else{
                                history.back(-1);
                            }
                        }
                    }else{
                        g_sps.jump(null,'/');
                    }

                }
            },
            thirdRight(){
            	if(this.headerConfig.share&&this.headerConfig.share.params){
            		this.shareParams = this.headerConfig.share.params;
                }
                if(this.headerConfig.share){
                    this.shareBtn = this.headerConfig.share.onOff;
                    this.shareTitle = this.headerConfig.share.title;
                    this.shareWhiteBtn = this.headerConfig.share.shareWhiteBtn;
                }
                if(this.headerConfig.feedback){
                    this.feedbackBtn = this.headerConfig.feedback.onOff;
                }
                if(this.headerConfig.rule){
                    this.ruleBtn = this.headerConfig.rule;
                }
                if(this.headerConfig.ebookShare){
                    this.ebookShareBtn = this.headerConfig.ebookShare;
                    this.centerStatus = 'auto';
                }
                if(this.headerConfig.showSearch){
                    this.searchBtn = this.headerConfig.showSearch.onOrOff;
                    this.eventId  = this.headerConfig.showSearch.eventId;
                }
                if(this.headerConfig.showSearchBlack){
                    this.searchBlackBtn = this.headerConfig.showSearchBlack.onOrOff;
                    this.eventId  = this.headerConfig.showSearchBlack.eventId;
                }
                if(this.headerConfig.showSearchWhite){
                    this.searchWhiteBtn = this.headerConfig.showSearchWhite.onOrOff;
                    this.eventId  = this.headerConfig.showSearchWhite.eventId;
                    this.sourceId = this.headerConfig.showSearchWhite.sourceId;
                }
            },
            share(){
                let t = this;
                    let shareObj ={};
                    shareAll({
                        fnMessageSuc: function () {
                            comm.shareLog({
                                shareType: "",
                                resourceId: "",
                                resourceType: "",
                                refId: "",
                                isValid: 1,
                                shareSence:"",
                                shareChannel: 4,
                                shareContent: shareObj.wxTitle
                            });
                        },
                        fnTimelineSuc: function () {
                            comm.shareLog({
                                shareType: "",
                                resourceId: "",
                                resourceType: "",
                                refId: "",
                                isValid: 1,
                                shareSence: "",
                                shareChannel: 5,
                                shareContent: shareObj.timeLineTitle
                            });
                        },
                        qShareLog: function (x) {
                            if (x === 'qzone') {
                                comm.shareLog({
                                    shareType: "",
                                    resourceId: "",
                                    resourceType: "",
                                    refId: "",
                                    isValid: 1,
                                    shareSence: "",
                                    shareChannel: 1,
                                    shareContent: shareObj.summary
                                });
                            } else if (x === 'sina') {
                                comm.shareLog({
                                    shareType: "",
                                    resourceId: "",
                                    resourceType: "",
                                    refId: "",
                                    isValid: 1,
                                    shareSence: "",
                                    shareChannel: 3,
                                    shareContent: shareObj.sinaTitle
                                });
                            }
                        },
                        triggerRequest:function(){
                            let getShareData = ()=>{
                                $.ajax({
                                    url:"/mcall/comm/data/share/getMapList3/",
                                    data: {
                                        paramJson: JSON.stringify(t.shareParams)
                                    },
                                    async:false,
                                    dataType:"json",
                                    success:function(data){
                                        if(comm.hasResponseData(data)){
                                            var sList = data.responseObject.responseData.data_list[0].share_channel;
                                            shareObj = {
                                                title: '',
                                                summary: '',
                                                sinaTitle: '',
                                                wxTitle: '',
                                                wxDesc: '',
                                            };
                                            shareObj.pic = data.responseObject.responseData.data_list[0].share_comm.shareImageUrl;
                                            $(sList).each(function (index, element) {
                                                if (element.shareChannel === 'QZone') {
                                                    shareObj.title = element.shareTitle;
                                                    shareObj.summary = element.shareDesc;
                                                }
                                                if (element.shareChannel === 'Sina') {
                                                    shareObj.sinaTitle = element.shareDesc;
                                                }
                                                if (element.shareChannel === 'WechatFriend') {
                                                    shareObj.wxTitle = element.shareTitle;
                                                    shareObj.wxDesc = element.shareDesc;
                                                }
                                                if (element.shareChannel === 'WechatTimeline') {
                                                    shareObj.timeLineTitle = element.shareTitle;
                                                }

                                            });

                                        }
                                    }
                                });
                            };
                            getShareData();
                            return shareObj;
                        }
                    }, false, $(t.$refs.evShare));
            },
			releaseCallApp(){
                let amChannel = comm.getpara()._amChannel;
				App.newReleaseBox({
					imgPath:"//img50.allinmd.cn/case/release.png",
					title:"发布内容需使用唯医骨科App",
					solidBtnTitile:"立即使用",
					authNoneTitle:"暂不发布",
					data:{
                      el: ".solidBtn",
                      ios: "allinmdios://app.allinmd.cn/applinks.html?scene=11&type=7"+(amChannel?"&_amChannel="+amChannel:''),
                      ios9: "http://app.allinmd.cn/applinks.html?scene=11&type=7"+(amChannel?"&_amChannel="+amChannel:''),
                      android: "allin://com.allin.social:75235?data={scene:11,type:51,"+(amChannel?",_amChannel:"+amChannel:'')+ "}"
					}
				});
				return false;
            },
            shareBegin(){
                let _this = this;
                _this.$emit("triggerShare");
            },
            //产品列表页点击搜索显示引导弹层
            searchFn(){
                let amChannel = comm.getpara()._amChannel;
                let openAppParmas = {};//打开app弹层数据
                switch (parseInt(this.eventId)) {
                    case 11880:
                        comm.creatEvent({
                            triggerType:'唤醒app',
                            actionId:11880
                        });
                        let androidParams = `{scene:3,type:88,sourceId:${this.sourceId},tplPath:0}`;
                        let iosParams = `?scene=brandDetailScene&brandId=${this.sourceId}`;
                        openAppParmas = {
                            ios: "allinmdios://app.allinmd.cn/applinks.html"+iosParams,
                            ios9: "http://app.allinmd.cn/applinks.html"+iosParams,
                            android: "allin://com.allin.social:75235?data="+androidParams,
                        };
                        break;
                    case 8:
                        comm.creatEvent({
                            triggerType:'搜索',//唯品汇首页搜索
                            actionId:8
                        });
                         openAppParmas = {
                            ios:"allinmdios://app.allinmd.cn/applinks.html?scene=2&type=108"+(amChannel?"&_amChannel="+amChannel:''),
                            ios9:"http://app.allinmd.cn/applinks.html?scene=2&type=108"+(amChannel?"&_amChannel="+amChannel:''),
                            android:"allin://com.allin.social:75235?data={scene:2,type:108,"+(amChannel?",_amChannel:"+amChannel:'')+ "}"
                        };
                        break;
                }
                App.newReleaseBox({
                    imgPath:"//img50.allinmd.cn/case/release.png",
                    title:"搜索药械需要打开唯医骨科App",
                    solidBtnTitile:"立即打开",
                    authNoneTitle:"暂不打开",
                    data:{
                        el: ".solidBtn",
                        ios: openAppParmas.ios,
                        ios9: openAppParmas.ios9,
                        android: openAppParmas.android
                    }
                });
                return false;
            },
        }
    }
</script>
<style scoped lang="scss">
    @import "../../../scss/modules/utilities/_utilities.scss";
    .al-indexHeaderItem .feedback i {
        content: "";
        display: inline-block;
        background: url('assest/course_feedback.png') no-repeat;
        width: rem(28px);
        height: rem(28px);
        background-size:contain ;
        vertical-align: middle;
        margin-right: rem(10px);
        background-size: contain;
    }
    .al-indexHeaderItem .share i{
        content: "";
        display: inline-block;
        background: url('assest/new_share.png') no-repeat;
        width: rem(48px);
        height: rem(48px);
        background-size:contain ;
        vertical-align: middle;
        margin-right: rem(10px);
    }
    .al-indexHeaderItem .shareWhite i{
        content: "";
        display: inline-block;
        background: url('assest/share.png') no-repeat;
        width: rem(32px);
        height: rem(32px);
        background-size:contain ;
        vertical-align: sub;
        // margin-right: rem(10px);
    }
    .al-indexHeaderItem .whiteSearch i{
        content: "";
        display: inline-block;
        background: url("assest/search.png") no-repeat;
        width: rem(40px);
        height: rem(40px);
        background-size:contain ;
        vertical-align: middle;
        // margin-right: rem(56px);
    }
    .al-indexHeaderItem .blackSearch i{
        content: "";
        display: inline-block;
        background: url("assest/blackSearch.svg") no-repeat;
        width: rem(40px);
        height: rem(40px);
        background-size:contain ;
        vertical-align: middle;
        // margin-right: rem(56px);
    }
    .al-indexHeaderItem .search i{
        content: "";
        display: inline-block;
        background: url("assest/blackSearch.svg") no-repeat;
        width: rem(40px);
        height: rem(40px);
        background-size:contain ;
        vertical-align: middle;
        margin-right: rem(17px);
    }
    .al-indexHeaderItem .rules i {
        display: inline-block;
        background: url('//img50.allinmd.cn/pages/discover/billboard/icon-questionmark.png') no-repeat;
        width: .4rem;
        height: .4rem;
        background-size: contain;
        vertical-align: middle;
        margin-right: .13333rem;
    }
    .ebookShare {
        background: url('//img50.allinmd.cn/detail/share.png') no-repeat;
        width: 1.86667rem;
        height: .72rem;
        background-size: contain;
        display: inline-block;
        vertical-align: middle;
    }
    .al-indexHeader h1{
        font-weight: normal;
    }
    .al-indexHeader{
        .al-indexHeaderItem{
            &:nth-child(2){
                h1{
                    font-size: rem(34px);
                }
            }
            &:nth-child(1){
                a{
                    margin-left: 0 !important;
                    img{
                      width: rem(34px);
                        height: rem(34px);

                    }
                }
                .ev_backBtnWhite {
                    img {
                        width: rem(20px);
                        height: rem(34px);
                    }
                }
            }
            &:nth-child(3) a {
                color: #626f8c;
                font-size: rem(28px);
            }
        }
    }

</style>
