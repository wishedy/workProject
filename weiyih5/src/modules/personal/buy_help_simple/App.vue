<template>
    <section class="al-mainInner" style="padding-bottom: 0">
        <router-view></router-view>
        <section ref="evShare" style="display: none">
        </section>
    </section>
</template>

<script type="text/ecmascript-6">
    import {shareAll} from '@allin/wap-share';
    import comm from 'static/js/comm.js'
    const  $ =  require('jquery')
    window.shareAll = shareAll;
    export default {
        components: {

        },
        data(){
            return {
                customerId:'148421298212',
                invitateCustomerId:'1465790024634'
            }
        },
        beforeMount(){
        },
        computed:{

        },
        mounted(){

            if(comm.isWeiXin()){
                document.addEventListener('WeixinJSBridgeReady',()=>{
                  this.share();
                })
            }

        },
        methods: {
            share () { //分享
                let t = this;
                let shareObj ={};
                shareAll({
                    fnMessageSuc: function () {

                    },
                    fnTimelineSuc: function () {

                    },
                    qShareLog: function (x) {

                    },
                    triggerRequest:function(){
                        $.ajax({
                            url: "/mcall/comm/data/share/getMapList3/",
                            data: {
                                paramJson: JSON.stringify(t.createShareData())
                            },
                            type: "post",
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
                                    shareObj.url = data.responseObject.responseData.data_list[0].share_comm.shareUrl;
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
                }, true, $(t.$refs.evShare));
            },
            createShareData(){
                let cid =  this.customerId ? this.customerId : ''
                let json = {
                    sceneType: 103,
                    customerId: cid,
                    invitateCustomerId: this.invitateCustomerId
                }
                return json;
            }
        },
        watch:{

        }
    };
</script>
<style lang="scss" rel="stylesheet/scss">
    @import "scss/pages/payHelp/payHelp.scss";
</style>


