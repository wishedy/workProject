<template>
    <section class="al-mainInner">
        <header class="al-indexHeader" data-alcode-mod='401' id="header">
            <figure class="al-indexHeaderItem">
                <a href="javascript:void(0)" ><i></i></a>
            </figure>
            <figure class="al-indexHeaderItem">
                <span>消息</span>
            </figure>
            <figure class="al-indexHeaderItem">
                <a href="javascript:void(0)" ><i></i></a>
            </figure>
        </header>
        <section class="al-message-container">
            <div class="al-message-checkApp">
                <p class="al-message-sign">
                    在App中查看所有未读消息
                </p>
                <p class="al-open-app open-app-btn">
                    打开App
                </p>
            </div>
            <ul class="al-message-list">
                <!--<li class="al-message-item">-->
                    <!--<figure class="al-message-logo">-->
                        <!--&lt;!&ndash;dot 点;num 两位数字;more 两位数+;&ndash;&gt;-->
                        <!--<i class="tips dot"></i>-->
                        <!--<img src="http://img1.imgtn.bdimg.com/it/u=1444721306,2859174573&fm=26&gp=0.jpg" alt="">-->
                    <!--</figure>-->
                    <!--<article class="al-message-info">-->
                        <!--<p class="al-message-title">-->
                            <!--<span class="title">待接诊提示</span>-->
                            <!--<span class="al-message-tips patient">报道患者</span>-->
                        <!--</p>-->
                        <!--<p class="al-message-content">-->
                            <!--陈力等3人向你问诊陈力等3人向你问诊陈力等3人向你问诊-->
                        <!--</p>-->
                    <!--</article>-->
                    <!--<p class="al-message-time">13分钟前</p>-->
                <!--</li>-->
                <!--<li class="al-message-item">-->
                    <!--<figure class="al-message-logo">-->
                        <!--<i class="tips num">12</i>-->
                        <!--<img src="http://img1.imgtn.bdimg.com/it/u=1444721306,2859174573&fm=26&gp=0.jpg" alt="">-->
                    <!--</figure>-->
                    <!--<article class="al-message-info">-->
                        <!--<p class="al-message-title">-->
                            <!--<span class="title">待接诊提示</span>-->
                            <!--&lt;!&ndash;patient:报道患者，topping:置顶，pay:付费&ndash;&gt;-->

                            <!--<span class="al-message-tips topping"><i class="icon"></i>置顶</span>-->

                        <!--</p>-->
                        <!--<p class="al-message-content">-->
                            <!--陈力等3人向你问诊陈力等3人向你问诊陈力等3人向你问诊-->
                        <!--</p>-->
                    <!--</article>-->
                    <!--<p class="al-message-time">13分钟前</p>-->
                <!--</li>-->
                <!--<li class="al-message-item">-->
                    <!--<figure class="al-message-logo">-->
                        <!--<i class="tips more">99+</i>-->
                        <!--<img src="http://img1.imgtn.bdimg.com/it/u=1444721306,2859174573&fm=26&gp=0.jpg" alt="">-->
                    <!--</figure>-->
                    <!--<article class="al-message-info">-->
                        <!--<p class="al-message-title">-->
                            <!--<span class="title">待接诊提示</span>-->

                            <!--<span class="al-message-tips pay">付费</span>-->
                        <!--</p>-->
                        <!--<p class="al-message-content">-->
                            <!--陈力等3人向你问诊陈力等3人向你问诊陈力等3人向你问诊-->
                        <!--</p>-->
                    <!--</article>-->
                    <!--<p class="al-message-time">13分钟前</p>-->
                <!--</li>-->
                <li @click="itemCli">
                    <div class="itemNum">
                        <img src="/static/images/messages/wait.png" alt="">
                        <i v-show="dataList.isReceiveRead==0"></i>
                    </div>
                    <div class="itemType">待接诊提示</div>
                    <div class="itemTime" v-text="commdateFn(dataList.isReceiveReadTime)"></div>
                </li>
                <li @click="itemCli">
                    <div class="itemNum">
                        <img src="/static/images/messages/Patient.png" alt="">
                        <i v-show="dataList.isReplyRead==0"></i>
                    </div>
                    <div class="itemType">患者咨询</div>
                    <div class="itemTime" v-text="commdateFn(dataList.isReplyReadTime)"></div>
                </li>
                <li @click="itemCli">
                    <div class="itemNum">
                        <img src="/static/images/messages/notice.png" alt="">
                        <i v-show="dataList.isNoticeRead==0"></i>
                    </div>
                    <div class="itemType">通知提示</div>
                    <div class="itemTime" v-text="commdateFn(dataList.isNoticeReadTime)"></div>
                </li>
                <li @click="itemCli">
                    <div class="itemNum">
                        <img src="/static/images/messages/official.png" alt="">
                        <i v-show="dataList.isofficialRead==0"></i>
                    </div>
                    <div class="itemType">唯医官方</div>
                    <div class="itemTime" v-text="commdateFn(dataList.isofficialReadTime)"></div>
                </li>
            </ul>
        </section>
        <section class="mask" v-show="isShowPopup">
            <article class="layer">
                <i class="close" @click="closePopupBtn"></i>
                <h1 class="title">消息提示</h1>
                <p class="des">查看所有消息详情，请打开唯医骨科
                    App</p>
                <div class="abbreviation"></div>
                <div class="open-app-btn">打开App</div>
            </article>
        </section>
        <CommFooterBar :isActive="2"></CommFooterBar>
    </section>
</template>

<script type="text/ecmascript-6">

    import axios from "axios";
    import TempCache from "static/js/tempcache.js"
    import user from "static/js/module.user";
    import comm from 'static/js/comm.js';
    import commapp from 'static/js/comm.app';
    import commdate from 'static/js/comm.date.js';
    import app from 'static/js/comm.app';
    import {mapActions,mapGetters} from "vuex";
    import CommFooterBar from "components/Footer/Footer.vue";
    export default {
        components:{
            CommFooterBar
        },
        computed:{
            footerType(){
                // return (this.$route.path).substring(1,100)==='messageIndex'
            }
        },
        data(){
            return{
                isShowPopup:false,
                path:{
                    dataList:'/mcall/customer/message/getMessageCountInfo/',//请求消息地址
                },
                dataList:''
            };
        },
        methods:{
            listenToMyBoy (somedata){
                this.accept(somedata);
            },
            closePopupBtn(){
                let t = this;
                t.isShowPopup = false
            },
            itemCli(){
                let t = this;
                t.isShowPopup = true
            },
            getDataList(){
                let t = this;
                axios({
                    url: t.path.dataList,
                    method: "post",
                    data: {customerId: TempCache.getItem("userId"), isRead: 0},
                    transformRequest: [function(data) {
                        return "paramJson=" + JSON.stringify(data);
                    }],
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest'
                    },
                    timeout: 30000,
                    responseType:'json'
                }).then(function(res){
                    if(comm.hasResponseData(res.data)){
                        t.dataList = res.data.responseObject.responseData;
                    }
                });
            },
            callApp(){
                let amChannel = comm.getpara()._amChannel;
                commapp.bindCallApp({
                    el: ".open-app-btn",
                    ios: "allinmdios://app.allinmd.cn/applinks.html?scene=messageListScene" + (amChannel?"&_amChannel="+amChannel:''),
                    ios9: "http://app.allinmd.cn/applinks.html?scene=messageListScene" + (amChannel?"&_amChannel="+amChannel:''),
                    android: "allin://com.allin.social:75235?data={scene:8,type:0" + (amChannel?",_amChannel:"+amChannel:'')+ "}",
                });
            },
            commdateFn(data){
                if(data){
                    return commdate.diffDay_three(data,commdate.local_time())
                }else{
                    return ''
                }
            }
        },
        mounted(){
            this.getDataList();
            this.callApp();//打开app
        },
        beforeMount(){
            user.privExecute({
                callback: function() {},
                operateType: "login"
            })
        }
    }
</script>

<style lang="scss" rel="stylesheet/scss">
    @import "scss/base";
    @import "scss/pages/message/message_index";
    @import "scss/pages/message/message_new";
</style>



