<template>
    <div class="container-hospital2">
        <p class="join-res">本院已有{{authNum}}名医护人员加入唯医</p>
        <div class="join-info">
            <template v-if="assistanceList.length > 5">
                <p v-for="(item, index) in assistanceList" v-if="index < 5" class="doctor-info" :class="[item.customerRole == 5 ? 'doctor' : 'nurse']">
                    <img v-if="item.logoUrl" class="headphoto" :src="item.logoUrl">
                    <span v-if="!item.logoUrl">{{item.customerName.slice(-2)}}</span>
                    <img v-if="item.logoState" class="new" src="/static/images/caoscheer/new.png">
                </p>
                <p class="doctor-info more">&nbsp;</p>
            </template>
            <template v-else>
                <p v-for="(item, index) in assistanceList" class="doctor-info"  :class="[item.customerRole == 5 || item.logoUrl ? 'doctor' : 'nurse']">
                    <img v-if="item.logoUrl" class="headphoto" :src="item.logoUrl">
                    <span v-if="!item.logoUrl">{{item.customerName.slice(-2)}}</span>
                    <img v-if="item.logoState" class="new" src="/static/images/caoscheer/new.png">
                </p>
            </template>
        </div>
        <div class="divide-line">
            <i class="line"></i><span class="txt">{{assistanceNum}}人助力</span><i class="line"></i>
        </div>
        <div class="tip-box">
            <span class="tip" v-if="newAuthNum<10">距离团队获得大奖还差{{10 - newAuthNum}}人</span>
            <span class="tip" v-if="newAuthNum>=10">恭喜获得团队大奖！</span>
            <span class="counts"  v-if="newAuthNum<10">{{newAuthNum}}/10</span>
        </div>
        <div class="progress" :style="{width: progressWith}"></div>
        <div class="unapproved" v-if="hasUnAssistanceList">
            <p  class="unapproved-item" v-for="(item, index) in unAssistanceList" v-if="index < 3">
                <span class="customer-name"><em class="u-customerName">{{item.customerName}}</em></span>
                <span class="medical-title">{{item.medicalTitle}}</span>
            </p>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    const  $ =  require('jquery');
    export default {
        props: {
            newAuthNum:Number,
            authNum: Number,
            assistanceNum: Number,
            assistanceList: Array,
            unAssistanceList: Array
        },
        data () {
            return {
                progressWith: 0,
                widths: [0, 26, 90, 152, 214, 278, 340, 404, 468, 532, 600,600,600,600],
                hasUnAssistanceList: false
            }
        },
        mounted () {
            if (this.unAssistanceList.length > 0) {
                this.hasUnAssistanceList = true
            }
            if (!this.hasUnAssistanceList) {
                $('.container-invite').css({
                    "background": "url('/static/images/caoscheer/bg_invite2.png') no-repeat center -0.123rem/cover",
                    "height": "71.333rem",
                    "width":"100vw"
                });
                $('.container-rank').css({"bottom": "20.586rem"})
                $('.btn-invite').css({"bottom": "46.88rem"})
            }
            this.calculateProgressWidth()
        },
        methods: {
            calculateProgressWidth () {
                this.progressWith = this.widths[this.newAuthNum] / 75+ 'rem'
            }
        }
    };
</script>
<style lang="scss" rel="stylesheet/scss" scoped></style>


