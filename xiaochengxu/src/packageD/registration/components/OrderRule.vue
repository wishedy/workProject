<template>
    <form class="calendar-order" @submit="formSubmit" report-submit="true">
        <button type="button" :class="classType" formType="submit" @click="goOrderRule">
            <img class="order-img" src="https://m.allinmed.cn/static/image/mp/index/1.5.0/order_rule.png">预约须知
            <slot></slot>
        </button>
    </form>
</template>

<script>
/*
  * @Desc:预约须知组件
  * @Usage:
  * @Notify：
  * @Depend：
  * Created by ljx on  2019/6/3
  *
  */

import sendFormId from "common/js/HttpRequest/sendFormId"

export default {
    data () {
        return {
            classType: this.classType
        }
    },
    props: {
        'classType': {
            type: String,
            default: ''
        }
    },
    methods: {
        /** 发送formId */
        formSubmit (e) {
            sendFormId(e.target.formId)
        },
        goOrderRule () {
            wx.navigateTo({
                url: '/packageD/registration/orderRule'
            })
        }
    }
}
</script>

<style lang="scss">
.calendar-order {
    line-height: 28px;
    button {
        // width: 124px;
        height: 24px;
        line-height: 24px;
        font-size: 24px;
        padding: 0;
        background-color: #fff;
        display: flex;
        justify-content: center;
        align-items: center;
        align-content: center;
        .order-img {
            width: 24px;
            height: 24px;
            margin-right: 4px;
        }
    }
    button::after {
        border: none;
    }
    .e7ebee {
        background-color: #e7ebee;
    }
    .f2f5f7 {
        background-color: #f2f5f7;
    }
}
</style>