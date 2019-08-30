<template>
    <section class="popups-container">
        <div class="popups-content">
            <span :style="{ background: popupConfig.customerLogoPicUrl }" class="popups-header-img"></span>
            <span class="popups-header-bg"></span>
            <div class="popups-item-title">
                <p>恭喜您成为{{ popupConfig.departmentName }}的会员</p>
                <p>学号：{{ popupConfig.studentNum }}</p>
            </div>
            <div class="popups-item-tip">
                <p>您可观看{{ popupConfig.departmentName }}内所有课程视频内容</p>
            </div>
            <div class="popups-item-page" @click="triggerPage">
                <button>
                    打开APP，访问{{ popupConfig.departmentName }}主页<i></i>
                </button>
            </div>
            <div class="popups-item-time">会员有效期至{{ popupConfig.expireDate }}</div>
            <span class="popups-close" @click="close"></span>
        </div>
    </section>
</template>

<script>
import axios from 'axios';
import TempCache from "static/js/tempcache";
const Api = {
    afterBuyInfo: '/allingateway/base-resource-platform/customer/purchase/getProductCustomerResult/' // 购买后弹窗信息
}
export default {
    props: {
        productType: {
            type: Number,
            default: ''
        },
        productId: {
            type: Number,
            default: ''
        }
    },
    data () {
        return {
            popupConfig: {}
        }
    },
    mounted () {
        this.$nextTick(() => {
            this.getAfterBuyInfo();
        })
    },
    methods: {
         getAfterBuyInfo () {
            axios.get(Api.afterBuyInfo, {
                params: {
                    productType: this.productType,
                    customerId: TempCache.getItem('userId'),
                    productId: this.productId
                }
            }).then((res) => {
                if (res && res.data && res.data.responseData) {
                    this.popupConfig = res.data.responseData
                }
            })
        },
        triggerPage () {
            this.$emit('pageTo')
        },
        close () {
            this.$emit('close')
        }
    }
}
</script>

<style lang="scss">
@import "../../../scss/modules/utilities/_utilities.scss";
.popups-container {
    width: 100%;
    height: 100%;
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 9999;
    overflow: hidden;
    background: rgba(0,0,0,0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    .popups-content {
        width: rem3(315px);
        height: rem3(370px);
        border-radius: rem3(4px);
        background: url('/static/college/popups-bg.png') no-repeat;
        background-size: 100%;
        position: relative;
        text-align: center;
        .popups-header-bg {
            display: inline-block;
            width: rem3(80px);
            height: rem3(80px);
            border-radius: 50%;
            background: url('/static/college/popups-header.png') no-repeat;
            background-size: 100%;
            position: absolute;
            right: rem3(30px);
            top: rem3(20px);
        }
        .popups-header-bg::before {
            content: '';
            width: rem3(28px);
            height: rem3(28px);
            display: inline-block;
            background: url('/static/college/popups-kingVip.png') no-repeat;
            background-size: 100%;
            position: absolute;
            right: rem3(-3px);
            top: rem3(-3px);
        }
        .popups-header-img {
            display: inline-block;
            width: rem3(70px);
            height: rem3(70px);
            border-radius: 50%;
            background: #ddd;
            position: absolute;
            right: rem3(35px);
            top: rem3(25px);
            z-index: 1;
        }
        .popups-close {
            display: inline-block;
            width: rem3(28px);
            height: rem3(28px);
            position: absolute;
            right: 0;
            top: rem3(-48px);
            background: url('/static/college/popups-close.png') no-repeat;
            background-size: 100%;
        }
        .popups-item-title {
            margin: rem3(133px) 0 rem3(23px) 0;
            p {
                font-size: rem3(19px);
                height: rem3(26px);
                line-height: rem3(26px);
            }
        }
        .popups-item-tip {
            p {
                color: #555;
                font-size: rem3(14px);
                font-weight: 300;
                height: rem3(20px);
                line-height: rem3(20px);
            }
        }
        .popups-item-page {
            width: max-content;
            padding: 0 rem3(30px);
            height: rem3(38px);
            line-height: rem3(38px);
            background: linear-gradient(90deg,rgba(244,224,171,1) 0%,rgba(236,209,132,1) 100%);
            border-radius: rem3(19px);
            text-align: center;
            margin: 0.8rem auto 0.16rem;
            button {
                font-size: rem3(15px);
                color: #3F3E3A;
                i {
                    display: inline-block;
                    font-style: normal;
                    width: rem3(8px);
                    height: rem3(10px);
                    background: url('/static/college/popups-right.png') no-repeat;
                    background-size: 100%;
                    position: relative;
                    left: rem3(4px);
                }
            }
        }
        .popups-item-time {
            color: #787878;
            font-size: rem3(12px);
            height: rem3(17px);
            line-height: rem3(17px);
        }
    }
}
</style>