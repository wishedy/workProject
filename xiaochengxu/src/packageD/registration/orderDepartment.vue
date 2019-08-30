<template>
    <section class="department">
        <section class="department-bg"></section>
        <section class="department-info">
            <span class="department-select">选择科室：</span>
            <section class="department-list">
                <section class="department-item" :class="{'item-no-border' : idx===0}" v-for="(department, idx) in departmentList" :key="idx" @click="goOrderTime(idx, department.deptCode, department.deptName)">
                    <div class="department-logo">
                        <img v-if="idx%4 === 0" src="https://m.allinmed.cn/static/image/mp/index/1.5.0/subject_one.png">
                        <img v-if="idx%4 === 1" src="https://m.allinmed.cn/static/image/mp/index/1.5.0/subject_two.png">
                        <img v-if="idx%4 === 2" src="https://m.allinmed.cn/static/image/mp/index/1.5.0/subject_three.png">
                        <img v-if="idx%4 === 3" src="https://m.allinmed.cn/static/image/mp/index/1.5.0/subject_four.png">
                    </div>
                    <div class="department-content">
                        <h3>{{department.deptName}}</h3>
                        <span>{{department.deptDesc}}</span>
                    </div>
                    <div class="department-next">
                        <img src="https://m.allinmed.cn/static/image/mp/index/1.5.0/department_go.png">
                    </div>
                </section>
            </section>
        </section>
        <section class="order-rule">
            <div class="order-rule-btn">
                <order-rule :classType="'e7ebee'">
                    <img src="https://m.allinmed.cn/static/image/mp/index/1.5.0/order_rule_go.png">
                </order-rule>
            </div>
        </section>
        <section class="promise-popup" v-if="showPromisePopup">
            <section class="department-promise">
                <section class="promise-bg"></section>
                <section class="promise-btn">
                    <form class="promise-allow" @submit="formSubmit" report-submit="true">
                        <button open-type="getUserInfo" type="button" formType="submit" @getuserinfo="getInfo">授权微信用户信息</button>
                    </form>
                </section>
                <section class="promise-agreement">
                    <div class="promise-select"></div>
                    <span>我已认真阅读，理解并同意《唯医互联网骨科医院服务协议》</span>
                </section>
            </section>
            <ensureConfirm v-if="ensureShow" :ensureParams="ensureParams" @ensureClickEvent="goToSetting"></ensureConfirm>
            <!-- <section class="department-promise-close" @click="closePromisePopup"></section> -->
        </section>
    </section>
</template>

<script>
/*
  * @Desc:选择科室
  * @Usage:
  * @Notify：
  * @Depend：
  * Created by ljx on  2019/6/3
  *
  */

import api from 'common/js/util/util'
import dataLog from 'common/js/dataLog/dataLog'
import miniLogin from "common/js/miniUtil/miniLogin"
import sendFormId from "common/js/HttpRequest/sendFormId"

import orderRule from "./components/OrderRule"
import ensureConfirm from "components/ensure"

const XHRList = {
    getDepartmentList: api.httpEnv() + '/mcall/tocure/register/basic/getHospitalDeptList/'
}

export default {
    data () {
        return {
            city: '北京市',
            departmentList: [],
            alert: '目前仅支持重庆唯医骨科医院',
            showPromisePopup: true,
            ensureShow: false,
            ensureParams: {
                content: "唯医骨科需获取您的授权信息，以方便您后续使用",
                ensure: "确定",
                type: "openSetting"
            },
        }
    },
    components: {
        orderRule,
        ensureConfirm
    },
    onLoad () {
        let that = this
        // 扫码进入判断权限
        if (wx.getStorageSync('openId')) {
            that.showPromisePopup = false
        } else {
            that.showPromisePopup = true
        }
        // 获取我的位置，并推荐重庆唯医骨科
        if (!that.showPromisePopup) {
            that.getLocation()
        }
    },
    onShow () {
        dataLog.enterBrowse()
        this.ensureShow = false
        this.getDepartmentList()
    },
    onHide(){
        dataLog.leaveBrowse()
    },
    methods: {
        /** 发送formId */
        formSubmit (e) {
            sendFormId(e.target.formId)
        },
        // 获取用户信息
        getInfo (e) {
            if (e.target.userInfo) {
                this.ensureShow = false
                miniLogin({
                    successCallBack: (res) => {
                        this.showPromisePopup = false
                        this.getLocation()
                    },
                    failCallBack: (res) => {
                    }
                })
            } else {
                this.ensureShow = true
            }
        },
        // 获取科室列表
        getDepartmentList () {
            let that = this
            wx.showLoading({
                title: "正在加载..."
            })
            api.ajax({
                url: XHRList.getDepartmentList,
                method: 'get',
                // data: {},
                done(result) {
                    wx.hideLoading()
                    if (result && result.responseObject && result.responseObject.responseData && result.responseObject.responseData.dataList) {
                        for (let dept of result.responseObject.responseData.dataList) {
                            if (typeof(dept.deptDesc) === 'object') {
                                dept.deptDesc = ''
                            } else if (typeof(dept.deptDesc) === 'string') {
                                // 不处理
                            } else {
                                dept.deptDesc = JSON.stringify(dept.deptDesc)
                            }
                        }
                        that.departmentList = result.responseObject.responseData.dataList
                    }
                }
            })
        },
        // 跳转到预约时间页
        goOrderTime (id, departmentCode, departmentName) {
            switch (id) {
                case 0:
                    dataLog.createTrack({
                        actionId: 14242,
                    })
                    break
                case 1:
                    dataLog.createTrack({
                        actionId: 14243,
                    })
                    break
                case 2:
                    dataLog.createTrack({
                        actionId: 14244,
                    })
                    break
                case 3:
                    dataLog.createTrack({
                        actionId: 14245,
                    })
                    break
                default:
                    break
            }
            let query = {
                departmentCode: departmentCode,
                departmentName: departmentName
            }
            query = encodeURIComponent(JSON.stringify(query))
            wx.navigateTo({
                url: '/packageD/registration/orderTime?query=' + query
            })
            // if (wx.getStorageSync('openId')) {
            //     // that.showPromisePopup = false
            //     wx.navigateTo({
            //         url: '/packageD/registration/orderTime?departmentID=' + id
            //     })
            // } else {
            //     this.showPromisePopup = true
            // }
        },
        // 获取当前位置
        getLocation () {
            let that = this
            api.getLocationCity({
                name: "重庆市"
            }).then((data) => {
                let name = data.cityName
                // 设置提示文案
                if (data.isfail) {
                    that.alert = '未获取到您的定位，目前仅支持重庆唯医骨科医院'
                } else if (data.isCover) {
                    that.alert = '根据您的定位，为您推荐重庆唯医骨科医院'
                } else if (!data.isCover) {
                    that.alert = `您的定位在${name}，目前仅支持重庆唯医骨科医院`
                }
                // 判断所在城市是否改变
                if (wx.getStorageSync('locationCity')) {
                    let locationCity = wx.getStorageSync('locationCity')
                    if (locationCity !== name) {
                        that.city = name
                        // 弹窗
                        wx.showModal({
                            title: '',
                            content: that.alert,
                            showCancel: false,
                            confirmText: '我知道啦',
                            success(res) {
                            }
                        })
                        wx.setStorageSync('locationCity', name)
                    } else {
                    }
                } else {
                    // 弹窗
                    wx.showModal({
                        title: '',
                        content: that.alert,
                        showCancel: false,
                        confirmText: '我知道啦',
                        success(res) {
                        }
                    })
                    wx.setStorageSync('locationCity', name)
                }
            })
        },
        // 去设置权限
        goToSetting(e) {
            if (e.mp.detail.authSetting.scoped.userInfo) {
                this.ensureShow = false
                miniLogin({
                    successCallBack: (res) => {
                    }
                })
            } else {
                this.ensureShow = true
            }
        },
        // 关闭授权弹窗按钮
        // closePromisePopup () {
        //     this.showPromisePopup = false
        // }
    }
}
</script>

<style lang="scss" scoped>
.department {
    width: 750px;
    height: 100%;
    background-color: #f2f5f7;
    .department-bg {
        width: 750px;
        height: 296px;
        background-color: #48bafb;
        background-image: url("https://m.allinmed.cn/static/image/mp/index/1.5.0/department_bg.png");
        background-size: 750px 296px;
    }
    .department-info {
        width: 702px;
        margin: 0 24px;
        margin-top: -152px;
        padding: 18px 0 16px 0;
        border-radius: 8px;
        z-index: 5;
        background-color: #fff;
        box-shadow: 0px 6px 20px rgba(217,217,217,0.35);
        .department-select {
            width: 140px;
            height: 40px;
            padding: 0 36px;
            line-height: 40px;
            color: #3a3a3a;
            font-size: 28px;
        }
        .department-list {
            width: 630px;
            // height: 798px;
            min-height: 578px;
            display: flex;
            flex-direction: column;
            margin: 0 36px;
            margin-top: 20px;
            .department-item {
                display: flex;
                padding: 40px 0;
                border-top: 1px solid #f2f2f2;
                flex-direction: row;
                .department-logo {
                    width: 60px;
                    height: 60px;
                    margin-left: -8px;
                    img {
                        width: 60px;
                        height: 60px;
                        margin-top: -2px;
                    }
                }
                .department-content {
                    width: 500px;
                    margin: 0 0 0 17px;
                    h3 {
                        height: 32px;
                        line-height: 32px;
                        margin-bottom: 10px;
                        line-height: 32px;
                        color: #08112b;
                        font-size: 32px;
                        font-weight: bold;
                        font-family: PingFangSC-Medium;
                    }
                    span {
                        display: block;
                        line-height: 30px;
                        color: #9e9e9e;
                        font-size: 26px;
                        align-content: center;
                    }
                }
                .department-next {
                    width: 26px;
                    height: 26px;
                    line-height: 26px;
                    img {
                        width: 26px;
                        height: 26px;
                        margin-left: 46px;
                        margin-top: 28px;
                    }
                }
            }
            .item-no-border {
                border: none;
            }
        }
    }
    .order-rule {
        width: 750px;
        height: 168px;
        display: flex;
        justify-content: center;
        align-items: center;
        align-content: center;
        .order-rule-btn {
            width: 202px;
            height: 48px;
            margin-top: -10px;
            display: flex;
            justify-content: center;
            align-items: center;
            align-content: center;
            background-color: #e7ebee;
            border-radius: 24px;
            img {
                width: 24px;
                height: 24px;
            }
        }
    }
    .promise-popup {
        width: 750px;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        align-content: center;
        position: fixed;
        top: 0;
        left: 0;
        border-radius: 8px;
        background-color: rgba(0, 0, 0, 0.7);
        .department-promise {
            width: 564px;
            height: 760px;
            border-radius: 8px;
            background-color: #fff;
            .promise-bg {
                width: 564px;
                height: 520px;
                background-image: url("https://m.allinmed.cn/static/image/mp/index/1.5.0/popup_img.png");
                background-size: 564px 520px;
            }
            .promise-btn {
                width: 564px;
                height: 96px;
                .promise-allow {
                    width: 440px;
                    height: 92px;
                    button {
                        width: 440px;
                        height: 92px;
                        line-height: 92px;
                        color: #fff;
                        border: none;
                        font-size: 32px;
                        font-weight: bold;
                        font-family: PingFangSC-Medium;
                        background-color: #2ea9fe;
                        box-shadow: 0 8px 16px rgba(46, 169, 254, 0.5);
                    }
                    button:after {
                        border: none;
                    }
                    .agreement-select {
                        background-color: #2ea9fe;
                    }
                }
            }
            .promise-agreement {
                width: 564px;
                height: 78px;
                margin-top: 36px;
                display: flex;
                align-items: flex-start;
                align-content: center;
                justify-content: center;
                .promise-select {
                    width: 32px;
                    height: 32px;
                    margin-right: 16px;
                    background-image: url("https://m.allinmed.cn/static/image/mp/index/1.5.0/popup_check.png");
                    background-size: 32px 32px;
                }
                span {
                    display: inline-block;
                    width: 390px;
                    height: 78px;
                    text-align: left;
                    color: #666;
                    font-size: 26px;
                    line-height: 36px;
                }
            }
        }
        .department-promise-close {
            width: 64px;
            height: 64px;
            margin-top: 58px;
            background-image: url("https://m.allinmed.cn/static/image/mp/index/1.5.0/department_popup_close.png");
            background-size: 64px 64px;
        }
    }
}
</style>
