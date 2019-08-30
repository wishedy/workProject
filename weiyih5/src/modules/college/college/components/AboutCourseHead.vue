<template>
    <section>
        <div class="about-row-one">
            <header v-show="checkApp">
                <a class="about-back" @click="$router.go(-1)">
                    <em></em>
                </a>
                <a class="about-share">
                    <em></em>
                </a>
            </header>
        </div>
    </section>
</template>

<script>
    import HeaderBar from 'components/HeaderBar/HeaderBar';
    import comm from 'static/js/comm.js';

    export default {
        components: {
            HeaderBar
        },
        props: {
            customerId: {
                default: '',
                type: String
            }
        },
        data() {
            return {
                appPort: false,
                shareParams: {
                    sceneType: '98',
                    customerId: this.customerId || ''
                }
            }
        },
        computed: {
            checkApp: function () {
                if (!(typeof appjs == "undefined" || appjs == null || appjs == "")) {
                    return this.appPort = false;
                } else {
                    return this.appPort = true;
                }
            }
        },
        mounted() {
            this.share();
        },
        methods: {
            share() {
                let t = this;
                let shareObj = {};
                shareAll({
                    fnMessageSuc: function () {
                        comm.shareLog({
                            shareType: "",
                            resourceId: "",
                            resourceType: "",
                            refId: "",
                            isValid: 1,
                            shareSence: "",
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
                    triggerRequest: function () {
                        $.ajax({
                            url: "/mcall/comm/data/share/getMapList3/",
                            data: {
                                paramJson: JSON.stringify(t.shareParams)
                            },
                            type: "post",
                            async: false,
                            dataType: "json",
                            success: function (data) {
                                if (comm.hasResponseData(data)) {
                                    var sList = data.responseObject.responseData.data_list[0].share_channel;
                                    shareObj = {
                                        url:'',
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
                }, false, $('.about-share'));
            }
        }
    }
</script>