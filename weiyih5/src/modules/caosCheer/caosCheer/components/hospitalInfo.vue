<template>
    <div class="container-hospital">
        <p class="join-res">本院已有{{authNum}}名医护人员加入唯医</p>
        <div class="join-info">
            <template v-if="assistanceList.length > 5">
                <p v-for="(item, index) in assistanceList" v-if="index < 5" class="doctor-info" :class="[item.customerRole == 5 || item.logoUrl ? 'doctor' : 'nurse']">
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
            <span class="counts" v-if="newAuthNum<10">{{newAuthNum}}/10</span>
        </div>
        <div class="progress" :style="{width: progressWith}"></div>
    </div>
</template>

<script type="text/ecmascript-6">
    export default {
        props: {
            newAuthNum:Number,
            authNum: Number,
            assistanceNum: Number,
            assistanceList: Array
        },
        data(){
            return {
                joinedCnt: 12,
                progressWith: 0,
                widths: [0, 26, 90, 152, 214, 278, 340, 404, 468, 532, 600,600,600,600]
            }
        },
        mounted(){
            this.calculateProgressWidth()
        },
        methods: {
            calculateProgressWidth () {
                this.progressWith = this.widths[this.newAuthNum] / 75+ 'rem'
            }
        },
        watch:{

        }
    };
</script>
<style lang="scss" rel="stylesheet/scss" scoped></style>


