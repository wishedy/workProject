<template>
    <section class="doctor">
        <section class="doctor-title">
            <span class="doctor-department"><span style="color: #888;">科室:</span>{{department}}</span>
            <span class="doctor-time"><span style="color: #888;">日期:</span>{{date}}</span>
            <order-rule :classType="'f2f5f7'"></order-rule>
        </section>
        <section class="doctor-list">
            <section class="doctor-item" v-show="!noDoctor" v-for="(doctor, idx) in doctors" :key="idx">
                <div class="doctor-name">
                    <img v-if="doctor.avatarUrl" :src="doctor.avatarUrl">
                    <img v-else class="default-img">
                    <div class="doctor-name-right">
                        <span class="name">{{doctor.doctorName}}</span>
                        <span class="title" v-if="doctor.clinicType">{{doctor.clinicType}}</span>
                        <!-- <span class="title" v-else>医师</span> -->
                    </div>
                </div>
                <div class="doctor-good">
                    <span v-if="doctor.expertArea"><span>擅长：</span>{{doctor.expertArea}}</span>
                    <span v-else><span>擅长：</span>暂无数据</span>
                </div>
                <form class="doctor-order-btn" @submit="formSubmit" report-submit="true">
                    <button @click="selectTime(doctor.doctorId, doctor.doctorCode, doctor.doctorName, doctor.clinicType, doctor.sumFee)">
                        <span>免费挂号
                            <img src="https://m.allinmed.cn/static/image/mp/index/1.5.0/order_no_go.png">
                        </span>
                    </button>
                </form>
            </section>
            <section v-if="noDoctor" class="no-doctor-item">
                <img src="https://m.allinmed.cn/static/image/mp/index/1.5.0/doctor_list_none.png" />
                <span>如遇到页面错误，您可以向我们进行反馈</span>
                <form class="doctor-advice-btn" @submit="formSubmit" report-submit="true">
                    <button @click="goToPage()">建议反馈</button>
                </form>
            </section>
        </section>
        <section class="select-time" v-if="showSelectTime">
            <div class="select-time-popup">
                <div class="select-time-title">
                    <img src="https://m.allinmed.cn/static/image/mp/index/1.5.0/select_time.png">
                    <span>选择挂号时间</span>
                </div>
                <div class="select-time-item">
                    <span class="time-am">上午</span>
                    <span class="time-am-hours">08:00-12:00</span>
                    <form class="select-time-order" @submit="formSubmit" report-submit="true">
                        <button type="button" class="no-select" v-if="isMoningOver" formType="submit">已结束</button>
                        <button type="button" class="no-select" v-if="!isMoningOver && !moningHasNo" formType="submit">已约满</button>
                        <button type="button" v-if="!isMoningOver && moningHasNo && hasPhone" formType="submit" @click="goPerson('上午')">挂号
                            <img src="https://m.allinmed.cn/static/image/mp/index/1.5.0/order_no_go.png">
                        </button>
                        <button v-if="!isMoningOver && moningHasNo && !hasPhone" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber($event, '上午')">挂号
                            <img src="https://m.allinmed.cn/static/image/mp/index/1.5.0/order_no_go.png">
                        </button>
                    </form>
                </div>
                <div class="select-time-item pm">
                    <span class="time-am">下午</span>
                    <span class="time-am-hours">14:00-17:30</span>
                    <form class="select-time-order" @submit="formSubmit" report-submit="true">
                        <button type="button" class="no-select" v-if="isAfternoonOver" formType="submit">已结束</button>
                        <button type="button" class="no-select" v-if="!isAfternoonOver && !afternoonHasNo" formType="submit">已约满</button>
                        <button type="button" v-if="!isAfternoonOver && afternoonHasNo && hasPhone" formType="submit" @click="goPerson('下午')">挂号
                            <img src="https://m.allinmed.cn/static/image/mp/index/1.5.0/order_no_go.png">
                        </button>
                        <button v-if="!isAfternoonOver && afternoonHasNo && !hasPhone" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber($event, '上午')">挂号
                            <img src="https://m.allinmed.cn/static/image/mp/index/1.5.0/order_no_go.png">
                        </button>
                    </form>
                </div>
            </div>
            <div class="select-time-close" @click="closeSelectTime"></div>
        </section>
    </section>
</template>

<script>
/*
  * @Desc:预约医生列表
  * @Usage:
  * @Notify：
  * @Depend：
  * Created by ljx on  2019/6/3
  *
  */

import api from 'common/js/util/util'
import dataLog from 'common/js/dataLog/dataLog'
import sendFormId from "common/js/HttpRequest/sendFormId"
import miniLogin from "common/js/miniUtil/miniLogin"
// 绑定手机号
import bindMobile from "common/js/auth/bindMobile"

import orderRule from "./components/OrderRule"

const XHRList = {
    getDoctorList: api.httpEnv() + '/mcall/tocure/register/basic/getDeptDoctorList/',
    getDoctorTime: api.httpEnv() + '/mcall/tocure/register/basic/getTimeIntervalBomb/',
    getPhoneNumber: api.httpEnv() + '/mcall/patient/customer/unite/v1/minAuthPhone/'
}

export default {
    data () {
        return {
            departmentCode: 1,
            department: '康复科',
            date: '2019-01-01',
            doctors: [],
            noDoctor: false,
            // 预约信息
            doctor: {
                id: '',
                code: '',
                name: '',
                title: '',
                time: '',
                cost: ''
            },
            // 预约时间弹窗
            showSelectTime: false,
            moningHasNo: true,
            afternoonHasNo: true,
            isMoningOver: false,
            isAfternoonOver: false,
            hasPhone: false,
            clickLimit: true
        }
    },
    components: {
        orderRule
    },
    onLoad (option) {
        let info = JSON.parse(decodeURIComponent(option.query))
        this.departmentCode = info.departmentCode
        this.department = info.departmentName
        this.date = info.date
    },
    onShow() {
        dataLog.enterBrowse()
        this.doctors = []
        this.doctor = {
            code: '',
            name: '',
            title: '',
            time: '',
            cost: ''
        },
        this.noDoctor = false,
        this.showSelectTime = false,
        this.moningHasNo = true,
        this.afternoonHasNo = true,
        this.isMoningOver = false,
        this.isAfternoonOver = false,
        this.hasPhone = false
        this.clickLimit = true
        // this.hasPhone = wx.getStorageSync('mobile') && wx.getStorageSync('mobile') !== '' ? true : false
        this.getDoctor()
    },
    onHide () {
        dataLog.leaveBrowse()
        this.showSelectTime = false
    },
    methods: {
        /** 发送formId */
        formSubmit (e) {
            sendFormId(e.target.formId)
        },
        // 获取医生信息
        getDoctor () {
            let that = this
            that.hasPhone = wx.getStorageSync('mobile') && wx.getStorageSync('mobile') !== '' ? true : false
            wx.showLoading({
                title: "正在加载..."
            })
            api.ajax({
                url: XHRList.getDoctorList,
                method: 'post',
                data: {
                    deptCode: that.departmentCode,
                    registDate: that.date.split('-').join('/')
                },
                done (result) {
                    wx.hideLoading()
                    wx.hideToast()
                    if (result && result.responseObject && result.responseObject.responseData && result.responseObject.responseData.dataList) {
                        if (result.responseObject.responseData.dataList.length !== 0) {
                            that.noDoctor = false
                            for (let doctor of result.responseObject.responseData.dataList) {
                                doctor.expertArea = doctor.expertArea.substr(0,200)
                            }
                        } else {
                            that.noDoctor = true
                        }
                        that.doctors = result.responseObject.responseData.dataList
                    } else {
                        that.noDoctor = true
                    }
                }
            })
        },
        // 获取上下午是否有号
        selectTime (id = 'id', code = '编号', name = '姓名', title = '职称', cost = '费用') {
            this.doctor.id = id
            this.doctor.code = code
            this.doctor.name = name
            this.doctor.title = title
            this.doctor.cost = cost
            if (this.clickLimit) {
                this.clickLimit = false
                this.getSelectTime('checkDoctor')
            }
            // this.showSelectTime = true
        },
        getSelectTime (check = '', time = '') {
            let that = this
            wx.showLoading({
                title: "正在加载..."
            })
            api.ajax({
                url: XHRList.getDoctorTime,
                method: 'post',
                data: {
                    deptCode: that.departmentCode,
                    doctorCode: that.doctor.code,
                    clinicTime: that.date.replace(/-/g,'/')
                },
                done(result) {
                    if (result && result.responseObject && result.responseObject.responseData && result.responseObject.responseData) {
                        let info = result.responseObject.responseData
                        let ymd = Number(info.currentTime.substr(0,10).replace(/-/g,''))
                        let hour = Number(info.currentTime.substr(11,2))
                        let min = Number(info.currentTime.substr(14,2))
                        // if (!info.haveMorningClinic) {
                        //     that.moningHasNo = false
                        // } 
                        // if (!info.havaAfternoonClinic) {
                        //     that.afternoonHasNo = false
                        // }
                        // if (hour >= 12 && (hour <= 17 && min <= 30)) {
                        //     that.isMoningOver = true
                        // } else if (hour >= 18 || (hour === 17 && min > 30)) {
                        //     that.isAfternoonOver = true
                        // }
                        if (check === 'checkDoctor') {
                            that.showSelectTime = true
                            // 点击免费挂号时，检查医生是否有号，没有号刷新医生列表
                            if (!info.haveMorningClinic && !info.havaAfternoonClinic) {
                                // that.showSelectTime = true
                                wx.showToast({
                                    title: '当前号源已发生变化，为您刷新到最新列表',
                                    icon: 'none',
                                    duration: 1000,
                                    success: () => {
                                        setTimeout(function () {
                                            that.getDoctor()
                                            that.clickLimit = true
                                        }, 1000)
                                    }
                                })
                            } else {
                                that.clickLimit = true
                            }
                        } else if (check === 'checkTime') {
                            // 点击挂号时，检查是否过期、是否有号
                            if (!info.haveMorningClinic && time === '上午') {
                                that.moningHasNo = false
                            } 
                            if (!info.havaAfternoonClinic && time === '下午') {
                                that.afternoonHasNo = false
                            }
                            if (!that.afternoonHasNo && !info.haveMorningClinic) {
                                that.showSelectTime = false
                                wx.showToast({
                                    title: '当前号源已发生变化，为您刷新到最新列表',
                                    icon: 'none',
                                    duration: 1000,
                                    success: () => {
                                        setTimeout(function () {
                                            that.getDoctor()
                                        }, 1000)
                                    }
                                })
                            }
                        }
                        // 判断过期
                        let sYmd = Number(that.date.replace(/-/g,''))
                        if (sYmd <= ymd && hour >= 12) {
                            that.isMoningOver = true
                        } 
                        if (sYmd <= ymd && (hour >= 18 || (hour === 17 && min > 30))) {
                            that.isAfternoonOver = true
                        }
                        wx.hideLoading()
                        // that.showSelectTime = true
                    }
                }
            })
        },
        // 获取手机号
        getPhoneNumber (e, time) {
            let that = this
            if (e.target.encryptedData) {
                let encryptedData = e.target.encryptedData
                let iv = e.target.iv
                api.ajax({
                    url: XHRList.getPhoneNumber,
                    method: 'post',
                    data: {
                        encryptedData: encodeURIComponent(encryptedData),
                        iv: encodeURIComponent(iv),
                        sessionKey: wx.getStorageSync('sessionKey'),
                        visitSiteId: 24
                    },
                    done(result) {
                        if (result && result.responseObject && result.responseObject.responseData && result.responseObject.responseData.phoneNumber) {
                            let phoneNumber = result.responseObject.responseData.phoneNumber
                            wx.setStorageSync('mobile', phoneNumber)
                            that.hasPhone = true
                            if (wx.getStorageSync('userId')) {
                                that.clickLimit = true
                                that.goPerson(time)
                                that.showSelectTime = false
                            } else {
                                that.bindPhone(phoneNumber, time)
                            }
                        }
                    }
                })
            } else {
                console.log(`用户拒绝`)
            }
        },
        bindPhone (phone, time) {
            let that = this
            bindMobile({
                account: phone,
                encryptedData: wx.getStorageSync('encryptedData'),
                sessionKey: wx.getStorageSync('sessionKey'),
                iv: wx.getStorageSync('iv'),
                visitSiteId:'24'
            }).then(res => {
                if (res.responseObject.responseStatus) {
                    let responsePk = res.responseObject.responsePk
                    wx.setStorageSync('userId', responsePk)
                    that.clickLimit = true
                    that.goPerson(time)
                    that.showSelectTime = false
                }
            })
        },
        // 跳转到就诊人页面
        goPerson (time = '下午') {
            if (this.clickLimit) {
                this.clickLimit = false
                this.doctor.time = time
                this.getSelectTime('checkTime', time)
                let query = {
                    doctorId: this.doctor.id,
                    doctorCode: this.doctor.code,
                    doctorName: this.doctor.name,
                    cost: this.doctor.cost,
                    deptCode: this.departmentCode,
                    deptName: this.department,
                    regDate: this.date,
                    hbTime: time === '上午' ? '08:00-12:00' : '14:00-17:30',
                    clinicDuration: time,
                    medicalTitle: this.doctor.title
                }
                console.log(query)
                query = encodeURIComponent(JSON.stringify(query))
                if ((time === '上午' && this.moningHasNo === true) || (time === '下午' && this.afternoonHasNo === true)) {
                    console.log('ljx')
                    wx.navigateTo({
                        url: '/packageD/registration/orderPerson?query=' + query
                    })
                }
            }
        },
        // 关闭选择时间弹窗
        closeSelectTime () {
            this.showSelectTime = false
        },
        // 跳转到反馈页面
        goToPage () {
            wx.navigateTo({
                url: '/pages/feedback/feedback'
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.doctor {
    width: 750px;
    // min-height: 1334px;
    min-height: 100%;
    background-color: #f2f5f7;
    .doctor-title {
        width: 690px;
        height: 68px;
        color: #444;
        line-height: 68px;
        padding: 0 30px;
        padding-top: 18px;
        display: flex;
        flex-direction: row;
        align-items: center;
        position: fixed;
        top: 0;
        left: 0;
        background-color: #f2f5f7;
        z-index: 1;
        .doctor-department,
        .doctor-time {
            height: 28px;
            line-height: 28px;
            font-size: 28px;
            span {
                margin-right: 10px;
            }
        }
        .doctor-time {
            margin-left: 30px;
            flex: 1;
        }
    }
    .doctor-list {
        width: 690px;
        margin: 0 30px;
        padding-top: 112px;
        padding-bottom: 50px;
        .doctor-item {
            width: 690px;
            background-color: #fff;
            border-radius: 8px;
            margin-bottom: 50px;
            box-shadow: 0px 6px 20px rgba(217, 217, 217, 0.35);
            .doctor-name {
                width: 630px;
                height: 152px;
                padding: 0 36px;
                padding-left: 52px;
                display: flex;
                align-items: center;
                img {
                    width: 160px;
                    height: 160px;
                    margin-top: -8px;
                    border-radius: 8px;
                    box-shadow: 0px 6px 16px rgba(0, 0, 0, 0.13);
                }
                .default-img {
                    background-color: #e7ebee;
                    box-shadow: 0px 6px 16px rgba(0, 0, 0, 0.13);
                }
                .doctor-name-right {
                    height: 152px;
                    margin-left: 40px;
                    margin-top: 14px;
                    display: flex;
                    flex-direction: column;
                    flex: 1;
                    align-items: flex-start;
                    justify-content: center;
                    .name {
                        height: 38px;
                        margin-top: 14px;
                        line-height: 38px;
                        color: #333;
                        font-size: 38px;
                        font-family: PingFangSC-Medium;
                        font-weight: bold;
                    }
                    .title {
                        height: 34px;
                        margin-top: 16px;
                        padding: 0 18px 0 40px;
                        line-height: 34px;
                        color: #fff;
                        font-size: 22px;
                        background-color: #f5a623;
                        background-image: url("https://m.allinmed.cn/static/image/mp/index/1.5.0/doctor_title.png");
                        background-size: 22px 22px;
                        background-repeat: no-repeat;
                        background-position: 16px 7px;
                        border-radius: 17px;
                    }
                    .time {
                        line-height: 28px;
                        color: #333;
                    }
                }
            }
            .doctor-good {
                width: 600px;
                margin-left: 54px;
                margin-top: 44px;
                padding: 0;
                line-height: 44px;
                color: #666;
                font-size: 28px;
                span {
                    span {
                        color: #444;
                        font-family: PingFangSC-Medium;
                        font-weight: 500;
                    }
                }
            }
            .doctor-order-btn {
                width: 690px;
                height: 120px;
                padding: 0;
                font-size: 30px;
                line-height: 30px;
                z-index: 2;
                button {
                    width: 690px;
                    height: 120px;
                    margin-top: -2px;
                    color: #2ea9fe;
                    font-size: 34px;
                    line-height: 34px;
                    font-family: PingFangSC-Medium;
                    font-weight: bold;
                    background-color: #fff;
                    background-image: url("https://m.allinmed.cn/static/image/mp/index/1.5.0/doctor_order_btn_bg.png");
                    background-repeat: no-repeat;
                    background-size: 690px 120px;
                    display: flex;
                    justify-content: center;
                    align-content: center;
                    align-items: center;
                    span {
                        img {
                            width: 22px;
                            height: 22px;
                            margin-left: -10px;
                        }
                    }
                }
                button::after {
                    border: none;
                }
            }
        }
        .no-doctor-item {
            width: 690px;
            display: flex;
            flex-direction: column;
            justify-content: start;
            align-items: center;
            img {
                width: 184px;
                height: 184px;
                margin-top: 210px;
                font-size: 28px;
                line-height: 30px;
                color: #555;
            }
            span {
                width: 690px;
                margin-top: 40px;
                line-height: 30px;
                text-align: center;
                color: #999;
                font-size: 30px;
            }
            .doctor-advice-btn {
                width: 520px;
                height: 96px;
                margin-top: 120px;
                button {
                    background-color: #f2f5f7;
                    border: 1px solid #2ea9fe;
                    color: #2ea9fe;
                    font-size: 36px;
                    line-height: 96px;

                }
            }
        }
    }
    .select-time {
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
        background-color: rgba(0, 0, 0, 0.7);
        z-index: 2;
        .select-time-popup {
            width: 580px;
            height: 526px;
            padding: 0 30px;
            background-color: #fff;
            border-radius: 16px;
            .select-time-title {
                width: 580px;
                height: 140px;
                display: flex;
                padding-top: 18px;
                justify-content: center;
                align-content: center;
                align-items: center;
                img {
                    width: 36px;
                    height: 36px;
                    margin-right: 4px;
                }
                span {
                color: #333;
                font-size: 30px;
                }
            }
            .select-time-item {
                width: 522px;
                height: 124px;
                padding: 0 36px;
                padding-right: 22px;
                display: flex;
                align-content: center;
                align-items: center;
                background-color: #f2f5f7;
                border-radius: 8px;
                .time-am {
                    width: 80px;
                    height: 44px;
                    border-radius: 4px;
                    background-color: #f5a623;
                    line-height: 44px;
                    text-align: center;
                    font-family: PingFangSC-Medium;
                    font-weight: bold;
                    color: #fff;
                    font-size: 28px;
                }
                .time-am-hours {
                    width: 208px;
                    height: 36px;
                    margin-left: 12px;
                    line-height: 36px;
                    color: #444;
                    font-family: PingFangSC-Medium;
                    font-weight: bold;
                    font-size: 36px;
                    flex: 1;
                }
                .select-time-order {
                    height: 60px;
                    button {
                        height: 60px;
                        padding-left: 36px;
                        background-color: #f2f5f7;
                        border: 2px solid #2ea9fe;
                        border-radius: 60px;
                        line-height: 60px;
                        text-align: center;
                        color: #2ea9fe;
                        font-size: 28px;
                        font-family: PingFangSC-Medium;
                        font-weight: bold;
                        display: flex;
                        align-items: center;
                        img {
                            width: 24px;
                            height: 24px;
                        }
                    }
                    button::after {
                        border: none;
                    }
                    .no-select {
                        border: none;
                        background-color: #fff;
                        color: #aaacac;
                    }
                }
            }
            .pm {
                margin-top: 36px;
            }
        }
        .select-time-close {
            width: 64px;
            height: 64px;
            margin-top: 58px;
            background-image: url("https://m.allinmed.cn/static/image/mp/index/1.5.0/department_popup_close.png");
            background-size: 64px 64px;
        }
    }
}
</style>
