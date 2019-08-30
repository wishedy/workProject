<template>
    <section class="ad-fullScreen">
        <section class="ad-editArea">
            <div class="ad-description">
                <ul>
                    <li>已有 <span>20000+</span> 厂商同仁入驻唯医</li>
                    <li>与医生同享<span>十万</span>余篇精彩内容</li>
                    <li>零距离接触骨科医生</li>
                    <li>更可将自家产品在唯医 <span>曝光展示</span></li>
                </ul>
                <div class="ad-btn-center">
                    <button class="ad-description-btn" @click="routeRegister">入驻唯医</button>
                    <img class="ad-btn-shadow" src="/static/images/factoryReg/btnBackground.png" alt="">
                </div>
            </div>
        </section>
    </section>
</template>

<script>
    export default {
        methods: {
            routeRegister(){
                comm.creatEvent({
                    triggerType:'宣传页',
                    triggerName:'入驻唯医按钮点击',
                    actionId:11698,
                    browType:397,

                });
                this.$router.push({path: 'register'});
            }
        }
    }

</script>

<style lang="scss" scoped rel="stylesheet/scss">
    .ad-fullScreen{
        background-image: url("/static/images/factoryReg/bg.png");
        background-repeat: no-repeat;
        background-size: cover;
        /*background-position: center center;*/
        width: 100%;
        height: 100vh;//100%;
        position: absolute;
        .ad-description {
            margin-top: 326px;
            span{
                font-weight: bold;
            }
            .ad-btn-center{
                text-align:center;
                margin-top: 26px;
                .ad-btn-shadow{
                    width:246px;
                    height:26px;
                    background:rgba(78,112,225,1);
                    border-radius:3px;
                    opacity:0.7;
                    filter:blur(8px);
                    margin-left: 9px;
                    margin-top: 26px;
                }
            }
            ul {
                margin-left: 51px;
                li {
                    list-style: none;
                    padding-left: 15px;
                    background: url(/static/images/factoryReg/pointer.png) no-repeat 0px 13px;
                    background-size: 10px 12px;
                    font-size: 17px;
                    line-height: 38px;
                }
            }
            span{
                color:#4E70E1;
            }
            .ad-description-btn{
                position: absolute;
                font-size: 17px;
                line-height: 48px;
                color: #ffffff;
                width:264px;
                height:48px;
                background:linear-gradient(150deg,#5c7ef3 0%,#2f58e5 100%);
                border-radius:3px;
                font-weight: bold;
                z-index: 1;
                margin-left: -4px;
            }
        }

    }
</style>