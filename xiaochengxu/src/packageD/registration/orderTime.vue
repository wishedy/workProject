<template>
    <section class="calendar">
        <section class="calendar-title">
            <span class="calendar-department"><span style="color: #888;">科室：</span>{{departmentName}}</span>
            <order-rule></order-rule>
        </section>
        <section class="calendar-list">
            <section class="calendar-item" v-for="(month, idx) in allDate" :key="idx">
                <section class="calendar-month">
                    <span class="calendar-month-month">{{month.month}}</span>
                    <span class="calendar-month-yue">月</span>
                    <span class="calendar-month-year">/{{month.year}}</span>
                </section>
                <section class="calendar-week">
                    <span class="week-title">日</span>
                    <span class="week-title">一</span>
                    <span class="week-title">二</span>
                    <span class="week-title">三</span>
                    <span class="week-title">四</span>
                    <span class="week-title">五</span>
                    <span class="week-title">六</span>
                </section>
                <section class="calendar-day">
                    <section class="week" :class="{'week-border':idn === 0}" v-for="(week, idn) in month.weekDate" :key="idn">
                        <section class="day" :class="{'day-now':day.now, 'day-now-before':day.now && day.before, 'day-now-full':day.now && day.full, 'day-before':day.before, 'day-select':day.select, 'day-full':day.full}" v-for="(day, id) in week" :key="id" @click="goOrderDoctor(month.year, month.month, day)">
                            <span class="day-date" v-if="day.date !== null">{{day.date}}</span>
                            <span class="day-text">{{day.text}}</span>
                        </section>
                    </section>
                </section>
            </section>
        </section>
    </section>
</template>

<script>
/*
  * @Desc:预约时间选择
  * @Usage:
  * @Notify：
  * @Depend：
  * Created by ljx on  2019/6/3
  *
  */

import api from 'common/js/util/util'
import dataLog from 'common/js/dataLog/dataLog'

import orderRule from "./components/OrderRule"

const XHRList = {
    getTimelList: api.httpEnv() + '/mcall/tocure/register/basic/getDeptClinicList/'
}

export default {
    data () {
        return {
            date: new Date(),
            departmentCode: 1,
            departmentName: '',
            sourceNo: [],
            allDate: {},
            clickLimit: true
        }
    },
    components: {
        orderRule
    },
    onLoad (option) {
        let info = JSON.parse(decodeURIComponent(option.query))
        this.departmentCode = info.departmentCode
        this.departmentName = info.departmentName
        // this.getCalendar()
        this.getTimeNo()
    },
    onShow() {
        this.clickLimit = true
        dataLog.enterBrowse()
        // this.getTimeNo()
    },
    onHide(){
        dataLog.leaveBrowse()
    },
    methods: {
        // 日历数据
        getCalendar (time) {
            let allDate = {}
            let date = new Date()
            if (time) {
                time = time.replace(/-/g,'/')
                date = new Date(time)
            }
            let year = date.getFullYear()
            let month = date.getMonth() + 1 < 10 ? '0' + Number(date.getMonth() + 1) : date.getMonth() + 1
            let nextMonth = date.getMonth() + 2 < 10 ? '0' + Number(date.getMonth() + 2) : date.getMonth() + 2
            let day = date.getDate()
            let hour = date.getHours()
            let minutes = date.getMinutes()
            let week = date.getDay()
            let one = this.getWeek(year, month)
            let max = this.getMaxDay(year, month)
            let end = Number(day) + 6
            if (end > max) {
                // 跨月
                // 当月1号之前的空白
                allDate[`${year}-${month}`] = {
                    year: year,
                    month: Number(month),
                    data: [],
                    weekDate: []
                }
                for (let o = 0; o < week; o++) {
                    allDate[`${year}-${month}`].data.push({
                        date: day-week+o,
                        now: false,
                        select: false,
                        before: true,
                        full: false,
                        text: ''
                    })
                }
                // 当月日期
                for (let i = day; i<= max; i++) {
                    if (i === day) {
                        if (hour >= 18 || (hour === 17 && minutes > 30)) {
                            allDate[`${year}-${month}`].data.push({
                                date: i,
                                now: true,
                                select: false,
                                before: true,
                                full: false,
                                text: ''
                            })
                        } else {
                            allDate[`${year}-${month}`].data.push({
                                date: i,
                                now: true,
                                select: true,
                                before: false,
                                full: false,
                                text: '有号'
                            })
                        }
                    } else if (i > day && i <= max) {
                        // 当月需要标记的日期
                        allDate[`${year}-${month}`].data.push({
                            date: i,
                            now: false,
                            select: true,
                            before: false,
                            full: false,
                            text: '有号'
                        })
                    } else {
                        // 当月其他日期
                        allDate[`${year}-${month}`].data.push({
                            date: i,
                            now: false,
                            select: false,
                            before: false,
                            full: false,
                            text: ''
                        })
                    }
                }
                // 下个月
                if (nextMonth === 13) {
                    year = year + 1
                    nextMonth = '01'
                }
                allDate[`${year}-${nextMonth}`] = {
                    year: year,
                    month: Number(nextMonth),
                    data: [],
                    weekDate: []
                }
                let two = this.getWeek(year, nextMonth)
                let twoMax = this.getMaxDay(year, nextMonth)
                for (let t = 0; t < two; t++) {
                    allDate[`${year}-${nextMonth}`].data.push({
                        date: null,
                        now: false,
                        select: false,
                        before: false,
                        full: false,
                        text: ''
                    })
                }
                for (let j = 1; j <= twoMax; j++) {
                    if (j <= end-max) {
                        allDate[`${year}-${nextMonth}`].data.push({
                            date: j,
                            now: false,
                            select: true,
                            before: false,
                            full: false,
                            text: '有号'
                        })
                    } else {
                        allDate[`${year}-${nextMonth}`].data.push({
                            date: j,
                            now: false,
                            select: false,
                            before: false,
                            full: false,
                            text: ''
                        })
                    }
                }
            } else {
                // 不跨月
                allDate[`${year}-${month}`] = {
                    year: year,
                    month: Number(month),
                    data: [],
                    weekDate: []
                }
                // 当月1号之前的空白
                for (let o = 0; o < one; o++) {
                    allDate[`${year}-${month}`].data.push({
                        date: null,
                        now: false,
                        select: false,
                        before: true,
                        full: false,
                        text: ''
                    })
                }
                // 当月日期
                for (let i = 1; i<= max; i++) {
                    if (i < day) {
                        allDate[`${year}-${month}`].data.push({
                            date: i,
                            now: false,
                            select: false,
                            before: true,
                            full: false,
                            text: ''
                        })
                    } else if (i === day) {
                        if (hour >= 18 || (hour === 17 && minutes > 30)) {
                            allDate[`${year}-${month}`].data.push({
                                date: i,
                                now: true,
                                select: false,
                                before: true,
                                full: false,
                                text: ''
                            })
                        } else {
                            allDate[`${year}-${month}`].data.push({
                                date: i,
                                now: true,
                                select: true,
                                before: false,
                                full: false,
                                text: '有号'
                            })
                        }
                    } else if (i > day && i < day + 7) {
                        // 当月需要标记的日期
                        allDate[`${year}-${month}`].data.push({
                            date: i,
                            now: false,
                            select: true,
                            before: false,
                            full: false,
                            text: '有号'
                        })
                    } else {
                        // 当月其他日期
                        allDate[`${year}-${month}`].data.push({
                            date: i,
                            now: false,
                            select: false,
                            before: false,
                            full: false,
                            text: ''
                        })
                    }
                }
            }
            this.allDate = allDate
        },
        // 当月1号是周几
        getWeek (year, month) {
            let day = `${year}/${month}/1`
            let myDate = new Date(Date.parse(day))
            return myDate.getDay()
        },
        // 当月有几天
        getMaxDay (year, month) {
            let twoMonth = 28
            let maxDay = 31
            if (year%4 === 0) {
                // 闰年
                twoMonth = 29
            } else {
                // 平年
                twoMonth = 28
            }
            month = '' + month
            switch (month) {
                case '01':
                case '03':
                case '05':
                case '07':
                case '08':
                case '10':
                case '12':
                    maxDay = 31
                    break
                case '02':
                    maxDay = twoMonth
                    break
                case '04':
                case '06':
                case '09':
                case '11':
                    maxDay = 30
                    break
                default:
                    break
            }
            return maxDay
        },
        // 获取服务器时间、号源信息
        getTimeNo (check = false, year = '', month = '', day = '') {
            let that = this
            wx.showLoading({
                title: "正在加载..."
            })
            api.ajax({
                url: XHRList.getTimelList,
                method: 'post',
                // method: 'get',
                data: {
                    deptCode: that.departmentCode
                },
                done(result) {
                    wx.hideLoading()
                    if (!check) {
                        // 获取服务器时间
                        if (result && result.responseObject && result.responseObject.responseData && result.responseObject.responseData.currentTime) {
                            let time = result.responseObject.responseData.currentTime
                            that.getCalendar(time)
                        } else {
                            that.getCalendar()
                        }
                        // 获取号源信息
                        if (result && result.responseObject && result.responseObject.responseData && result.responseObject.responseData.dataList) {
                            that.sourceNo = result.responseObject.responseData.dataList
                            let timeNo = result.responseObject.responseData.dataList
                            for (let no of timeNo) {
                                let item = no.registDate.slice(0,4) + '-' + no.registDate.slice(5,7)
                                let day = Number(no.registDate.slice(8,10))
                                for (let date of that.allDate[item].data) {
                                    if (date.date === day) {
                                        if (no.haveNumber === 0 && date.text !== '') {
                                            date.text = '约满'
                                            date.select = false
                                            date.full = true
                                        }
                                    }
                                }
                            }
                        }
                        // 数据按周处理
                        let times = that.allDate
                        let newDate = {}
                        let weekDate = []
                        for (let time in times) {
                            let weeks = []
                            let week = 1
                            newDate[time] = []
                            // 判断换周参数：weekLength：有几周，weekNo：结束时间是周几
                            let weekLength = Math.floor(times[time].data.length / 7)
                            let weekNo = times[time].data.length % 7
                            if (weekNo !== 0) {
                                weekLength = Math.floor(times[time].data.length / 7) + 1
                            }
                            // 数据分组
                            for (let [date, idx] of new Map(times[time].data.map((date, idx) => [date, idx]))) {
                                if (idx % 7 === 6 || (week === weekLength && weekNo === idx % 7 + 1)) {
                                    weeks.push(date)
                                    newDate[time].push(weeks)
                                    weeks = []
                                    week += 1
                                } else {
                                    weeks.push(date)
                                }
                            }
                        }
                        for (let x in newDate) {
                            that.allDate[x].weekDate = newDate[x]
                        }
                    } else {
                        // 获取服务器时间
                        if (result && result.responseObject && result.responseObject.responseData && result.responseObject.responseData.currentTime) {
                            let time = result.responseObject.responseData.currentTime
                            let ymd = Number(time.substr(0, 10).replace(/-/g,''))
                            let tYmd = Number('' + year + (month > 10 ? month : '0' + month) + day.date)
                            let hour = time.substr(11,2)
                            let min = time.substr(14,2)
                            if (tYmd === ymd && (hour >= 18 || (hour === 17 && min > 30))) {
                                wx.showToast({
                                    title: '当前号源已发生变化，为您刷新到最新列表',
                                    icon: 'none',
                                    duration: 1000,
                                    success: () => {
                                        setTimeout(function () {
                                            that.getCalendar(time)
                                            that.clickLimit = true
                                        }, 1000)
                                    }
                                })
                            } else {
                                // 获取号源信息
                                if (result && result.responseObject && result.responseObject.responseData && result.responseObject.responseData.dataList) {
                                    that.sourceNo = result.responseObject.responseData.dataList
                                    let ymd = `${year}/${month > 10 ? month : '0' + month}/${day.date > 10 ? day.date : '0' + day.date}`
                                    let timeNo = result.responseObject.responseData.dataList
                                    for (let no of timeNo) {
                                        if (no.registDate === ymd && no.haveNumber === 0) {
                                            wx.showToast({
                                                title: '当前号源已发生变化，为您刷新到最新列表',
                                                icon: 'none',
                                                duration: 1000,
                                                success: () => {
                                                    setTimeout(function () {
                                                        that.getCalendar(time)
                                                        that.clickLimit = true
                                                    }, 1000)
                                                }
                                            })
                                        } else {
                                            let departmentCode = that.departmentCode
                                            month = Number(month) < 10 ? '0' + Number(month) : month
                                            let days = Number(day.date) < 10 ? '0' + Number(day.date) : day.date
                                            if (no.registDate === ymd && day.select) {
                                                let query = {
                                                    departmentCode: that.departmentCode,
                                                    departmentName: that.departmentName,
                                                    date: year + '-' + month + '-' + days
                                                }
                                                query = encodeURIComponent(JSON.stringify(query))
                                                wx.navigateTo({
                                                    url: '/packageD/registration/orderDoctor?query=' + query
                                                })
                                            } else {
                                                that.clickLimit = true
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            })
        },
        // 跳转到医生列表
        goOrderDoctor (year, month, day) {
            if (day.select && this.clickLimit) {
                this.clickLimit = false
                this.getTimeNo(true, year, month, day)
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.calendar {
    width: 750px;
    min-height: 100%;
    .calendar-title {
        width: 690px;
        height: 68px;
        color: #444;
        line-height: 68px;
        padding: 0 30px;
        padding-top: 18px;
        display: flex;
        flex-direction: row;
        align-items: center;
        border-bottom-width: 1px;
        border-bottom-color: #f2f5f7;
        border-bottom-style: solid;
        position: fixed;
        top: 0;
        background-color: #fff;
        .calendar-department {
            height: 28px;
            line-height: 28px;
            flex-grow: 1;
            font-size: 28px;
        }
    }
    .calendar-list {
        width: 100%;
        margin-top: 74px;
        .calendar-item {
            margin-top: -10px;
            .calendar-month {
                width: 100%;
                height: 122px;
                margin-bottom: 28px;
                font-size: 26px;
                color: #08112b;
                display: flex;
                justify-content: center;
                align-items: flex-end;
                .calendar-month-month {
                    height: 50px;
                    line-height: 50px;
                    font-size: 50px;
                    color: #20283f;
                }
            }
            .calendar-week {
                width: 100%;
                height: 72px;
                line-height: 72px;
                display: flex;
                justify-content: center;
                align-items: center;
                align-content: space-between;
                .week-title {
                    width: 14.2%;
                    height: 30px;
                    font-size: 26px;
                    color: #25324d;
                    text-align: center;
                    line-height: 30px;
                }
            }
            .calendar-day {
                width: 100%;
                display: flex;
                justify-content: flex-start;
                align-items: flex-start;
                align-content: space-around;
                flex-wrap: wrap;
                background-color: #f2f5f7;
                .week {
                    width: 750px;
                    display: flex;
                    flex-direction: row;
                    border-top: 1px solid #e5ebf2;
                    .day {
                        width: 55px;
                        margin: 0 17.5px;
                        padding: 10px;
                        color: #444;
                        margin-top: 23px;
                        margin-bottom: 24px;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-content: center;
                        align-items: center;
                        span {
                            color: #444;
                        }
                        .day-date {
                            width: 42px;
                            height: 36px;
                            text-align: center;
                            line-height: 36px;
                            font-size: 36px;
                        }
                        .day-text {
                            width: 42px;
                            height: 20px;
                            text-align: center;
                            line-height: 20px;
                            font-size: 20px;
                        }
                    }

                    // 今天之前
                    .day-before {
                        span {
                            color: #ccc;
                        }
                    }
                    // 今天可约
                    .day-now {
                        border: 1px solid #2ea9fe;
                        border-radius: 56px;
                        span {
                            color: #2ea9fe;
                        }
                    }
                    // 今天已过
                    .day-now-before {
                        border: 1px solid #909090;
                        border-radius: 56px;
                        span {
                            font-weight: bold;
                            color: #909090;
                        }
                    }
                    // 今天约满
                    .day-now-full {
                        border: 1px solid #909090;
                        border-radius: 56px;
                        span {
                            color: #909090;
                        }
                    }
                    // 可选日期
                    .day-select {
                        font-weight: bold;
                        span {
                            color: #2ea9fe;
                        }
                    }
                    // 已约满
                    .day-full {
                        font-weight: bold;
                        span {
                            color: #909090;
                        }
                    }
                }
                .week-border {
                    border-top: none;
                }
            }
        }
    }
}
</style>
