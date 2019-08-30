<template>
    <div id="head">
        <section v-show="header1" style="position: fixed;z-index: 4;top:0;left: 0;right: 0;">
            <WakeApp :options="wakeData" style="position: unset;"></WakeApp>
        </section>
        <header class="fixedHeader al-indexHeader" v-show="header1" :style="header1?'background:#fff':''" style="top:1.44rem;">
            <figure class="al-indexHeaderItem">
                <a @click="ev_backBtn">
                    <img src="//img50.allinmd.cn/pages/personal/arrow_back.png" alt="">
                </a>
            </figure>
            <figure class="al-indexHeaderItem">
                <h1 class="seoName">骨课大讲堂</h1>
            </figure>
            <figure class="al-indexHeaderItem ev-checkRule">
                <figcaption class="al-scrollShareBtn evShare1"  ref="evShare">
                    分享
                </figcaption>
            </figure>
        </header>


        <header class="header" :style="header2?'':'visibility:hidden'">
            <aside class="discoverNav">
                <figure @click="ev_backBtn"><img src="//img50.allinmd.cn/v3/discover/back_find.png"> </figure>
                <figure></figure>
                <figure>
                    <figcaption class="al-scrollShareBtn evShare2" ref="evShare">分享
                        <!--分享提示-->
                        <section class="shareTip" style="display: none">
                            快邀好友一起来看精彩栏目吧
                        </section>
                        <!--分享提示 End-->
                    </figcaption>
                </figure>
            </aside>
        </header>
    </div>

</template>
<script>
    import comm from "static/js/comm"
    import TempCache from "static/js/tempcache";
    import WakeApp from  'components/WakeApp/WakeApp.vue';
    export default {
        data(){
            return {
                wakeData:{
                    el: ".al-newWakeUpAppBtn",
                    ios: "allinmdios://app.allinmd.cn/applinks.html",
                    ios9: "http://app.allinmd.cn/applinks.html",
                    android: "allin://com.allin.social:75235?data={}"
                },
                header1:false,
                header2:true,
                shareParams:{
                    sceneType:76,//TODO 20180608 lichunhui update 分享参数固定76
                    customerId:TempCache.getItem('userId')||"",
                    resourceType: 0,                               //资源类型传0，代表所有类型
                    platformId:TempCache.getItem('department')||1,
                    specialId:comm.getpara().columnId || ""
                }
            }
        },
        components:{
            WakeApp
        },
        watch:{
            "$store.state.header"(string){
                if (parseInt(string, 10) === 1) {
                    this.header1 = true;
                    this.header2 = false;
                }else if(parseInt(string, 10) === 0){
                    this.header1 = false;
                    this.header2 = true;
                }
            },
            "$store.state.sceneType"(n){
                /*this.shareParams.sceneType = n;
                if(this.shareParams.sceneType){
                	this.share();
				}*/
            },
        },
        methods:{
            ev_backBtn(){
                comm.creatEvent({
                    triggerType:'全站功能按钮点击',
                    keyword:"返回",
                    actionId:41,
                    async:false
                });
                window.history.back();
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
                        return shareObj;
                    }
                }, false, $('.evShare2,.evShare1'));
            }
        },
        mounted(){
          this.share();
        }
    }
</script>
