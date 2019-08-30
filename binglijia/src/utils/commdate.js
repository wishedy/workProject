/**
 * 功能描述： 时间处理
 * 使用方法: a 发布时间
            b 当前时间
            local_time() 获取客户端时间并格式化为2014-03-07 10:15:02
            am_pm_data(a) 规则:上午 10:20 2014年3月12日
            cut_date_msec  规则：解除毫秒  截取如"2017-07-06 13:50:00.0"为2017-07-06 13:50:00
            isSameDay：验证同一天
            diffDay_one(a,b)规则:刚刚<1分<1小时<1天<7天<日期
            diffDay_two(a,b)规则:7天前<日期
            diffDay_three(a,b)规则：刚刚<n分前<n小时前<昨天 23:30<前天 22:10<06/29 21:15<2017/06/29
            date_word(a) 规则:2014年3月17日
            dateJoint 规则：格式如2017/07/06-08/10
            vsLocalTime 规则：27天前
            dateLocalJoint 规则：如果是当前年只显示08/02-08/02   如果跨年了2017/08/01-2018/01/06  如果只有一天则为08-07或者2014-08-07
 * 引入来源：  作用：
 *
 * Created by QiaoLiang on 2015-3-19.
 */
const $ = require('jquery');
const commdate = {
    local_time: function () {
        let local = new Date();
        let year = local.getFullYear();
        let month = local.getMonth() + 1;
        if (month < 10) {
            month = "0" + month;
        }
        let day = local.getDate();
        if (day < 10) {
            day = "0" + day;
        }
        let time = local.toTimeString().substr(0, 8);
        let local_time = year + "-" + month + "-" + day + " " + time;
        return local_time;
    },
    am_pm_data: function (ampm) {
        let year = ampm.substr(0, 4);
        let month = ampm.substr(5, 2);
        let day = ampm.substr(8, 2);
        let hour = ampm.substr(11, 2);
        let day_ampm;
        let ampmNew;
        if (hour < 12) {
            day_ampm = "上午 ";
        } else if (hour == 12) {
            day_ampm = "中午 ";
        } else if (hour > 12) {
            day_ampm = "下午 ";
        }
        let minute = ampm.substr(14, 2);
        ampmNew = day_ampm + hour + ":" + minute + " " + year + "年" + month + "月" + day + "日";
        return ampmNew;
    },
    cut_date_msec: function (java_date) {
        java_date = java_date.substr(0, 19);
        return java_date;
    },
    isSameDay: function (day1, day2) {
        return day1.substr(0, 10) == day2.substr(0, 10);
    },
    diffDay_one: function (dateStrBefore, dateStrAfter) {
        let dateStrBefore1 = dateStrBefore.substr(0, 19); //发布时间
        let dateStrAfter1 = dateStrAfter.substr(0, 19); //传入系统时间
        let dateStrBefore2 = dateStrBefore1.replace(/\-/g, '/');
        let dateStrAfter2 = dateStrAfter1.replace(/\-/g, '/');

        let days = 1000 * 60 * 60 * 24;
        let day1 = Date.parse(dateStrBefore2);
        let day2 = Date.parse(dateStrAfter2);
        if (isNaN(day1)) {
            return NaN;
        }
        if (isNaN(day2)) {
            return NaN;
        }
        let d = parseInt((day2 - day1) / days);
        if (d < 1) {//秒分小时
            let dateStrB = new Date(dateStrBefore.replace(/\-/g, '/'));
            let dateStrA = new Date(dateStrAfter.replace(/\-/g, '/'));
            let A_B = (dateStrA.getTime() - dateStrB.getTime()) / 1000;
            if (A_B < 60) { //
                return "刚刚";//A_B+"秒前";
            } else {
                A_B = parseInt(A_B / 60);
                if (A_B < 60) {//
                    return A_B + "分钟前";
                } else {
                    A_B = parseInt(A_B / 60);
                    if (A_B < 60) {
                        return A_B + "小时前";
                    }
                }
            }
        } else {
            if (d < 8) {
                return d + "天前";
            } else {
                return dateStrBefore.substr(0, 10); //显示日期
                //return dateStrBefore; //显示到秒
            }

        }
    },
    diffDay_two: function (dateStrBefore, dateStrAfter) {
        let dateStrBefore1 = dateStrBefore.substr(0, 10);
        let dateStrAfter1 = dateStrAfter.substr(0, 10);

        let dateStrBefore2 = dateStrBefore1.replace(/\-/g, '/');
        let dateStrAfter2 = dateStrAfter1.replace(/\-/g, '/');

        let days = 1000 * 60 * 60 * 24;
        let day1 = Date.parse(dateStrBefore2);
        let day2 = Date.parse(dateStrAfter2);
        if (isNaN(day1)) {
            //alert(dateStrBefore + "格式不正确");
            return NaN;
        }
        if (isNaN(day2)) {
            //alert(dateStrAfter + "格式不正确");
            return NaN;
        }
        let d = (day2 - day1) / days;
        if (d > 7) {
            //return dateStrBefore; //显示到秒
            return dateStrBefore.substr(0, 10);//显示日期
        } else {
            return "7天前";
        }
    },
    //病历夹新增规则
    diffDay_three: function (dateStrBefore, dateStrAfter) {
        let dateStrBefore1 = dateStrBefore.substr(0, 19); //发布时间
        let dateStrAfter1 = dateStrAfter.substr(0, 19); //传入系统时间
        let dateStrBefore2 = dateStrBefore1.replace(/\-/g, '/');
        let dateStrAfter2 = dateStrAfter1.replace(/\-/g, '/');

        let beforeYear = dateStrBefore1.substring(0,4);
        let beforeMonth = dateStrBefore1.substring(5,7);
        let beforeDay = dateStrBefore1.substring(8,10);

        let afterYear = dateStrAfter1.substring(0,4);
        let afterMonth = dateStrAfter1.substring(5,7);
        let afterDay = dateStrAfter1.substring(8,10);

        if(beforeYear==afterYear){//当前年
            if(beforeMonth==afterMonth){//当前月
                let day = parseInt(afterDay-beforeDay);//计算与今天相差的天数
                if(day==0){//当天
                    let days = 1000 * 60 * 60 * 24;
                    let day1 = Date.parse(dateStrBefore2);
                    let day2 = Date.parse(dateStrAfter2);
                    if (isNaN(day1)) {
                        //alert(dateStrBefore + "格式不正确");
                        return NaN;
                    }
                    if (isNaN(day2)) {
                        //alert(dateStrAfter + "格式不正确");
                        return NaN;
                    }
                    let d = parseInt((day2 - day1) / days);
                    if (d < 1) {//秒分小时
                        let dateStrB = new Date(dateStrBefore.replace(/\-/g, '/').substring(0,19));
                        let dateStrA = new Date(dateStrAfter.replace(/\-/g, '/').substring(0,19));
                        let A_B = (dateStrA.getTime() - dateStrB.getTime()) / 1000;
                        if (A_B < 60) { //
                            return "刚刚";//A_B+"秒前";
                        } else {
                            A_B = parseInt(A_B / 60);
                            if (A_B < 60) {//
                                return A_B + "分钟前";
                            } else {
                                A_B = parseInt(A_B / 60);
                                if (A_B < 60) {
                                    return A_B + "小时前";
                                }
                            }
                        }
                    }
                }else if(day==1){//前一天
                    return '昨天 '+dateStrBefore.substr(11,5);
                }else if(day==2){
                    return '前天 '+dateStrBefore.substr(11,5);
                }else{
                    return dateStrBefore.substr(5,11).replace(/\-/g, '.');
                }
            }else{
                return dateStrBefore.substr(5,11).replace(/\-/g, '.');
            }
        }else{
            return dateStrBefore.substr(0, 10).replace(/\-/g, '.'); //显示日期
        }
    },
    thirdRule:function(dateStrBefore, dateStrAfter){  //第三种规则今天
        //第三种展示规则
        let dateStrBefore1 = dateStrBefore.substr(0,19); //发布时间
        let dateStrAfter1 = dateStrAfter.substr(0,19); //传入系统时间
        let dateStrBefore2 = dateStrBefore1.replace(/\-/g, '/');
        let dateStrAfter2 = dateStrAfter1.replace(/\-/g, '/');

        let days = 1000 * 60 * 60 * 24;
        let day1 = Date.parse(dateStrBefore2);
        let day2 = Date.parse(dateStrAfter2);
        if (isNaN(day1)) {
            //alert(dateStrBefore + "格式不正确");
            return NaN;
        }
        if (isNaN(day2)) {
            //alert(dateStrAfter + "格式不正确");
            return NaN;
        }
        let d = parseInt((day2 - day1) / days);
        if(d<1){//秒分小时
            return "今天";
        }else{
            if(d<8){
                return d+"天前";
            }else{
                let year = commdate.local_time().split("-")[0];
                let pushYear = dateStrBefore.split("-")[0];
                if(year==pushYear){
                    return dateStrBefore.substring(dateStrBefore.indexOf("-")+1,10); //显示日期
                    //return dateStrBefore; //显示到秒
                }else{
                    return dateStrBefore.substr(0,10); //显示日期
                    //return dateStrBefore; //显示到秒
                }
            }

        }
    },
    date_word: function (a) {
        let year = a.substr(0, 4);
        let month = a.substr(5, 2);
        let day = a.substr(8, 2);
        if (month < 10) {
            month = month.substr(1, 1);
        }
        if (day < 10) {
            day = day.substr(1, 1);
        }
        a = year + "年" + month + "月" + day + "日";
        return a;
    },
    datafomat: function (tar) {
        let obj = tar;
        let text;
        obj.each(function (i) {
            text = date_word(obj.eq(i).html());
            obj.eq(i).html(text.substring(text.indexOf('年') + 1));
        });
    },
    dateJoint: function (date1, date2, sign, middleJoint) {//date1开始时间，date2结束时间
        let result;
        let signal = (sign != undefined && sign != "") ? sign : '.';					//
        let mJoint = (middleJoint != undefined && middleJoint != "") ? middleJoint : "-";
        let d1 = date1.substring(0, 10).replace(/-/g, signal);
        let d1Arr = d1.toString().split(signal);
        let d2 = date2.substring(0, 10).replace(/-/g, signal);
        let d2Arr = d2.toString().split(signal);
        if (parseInt(d2Arr[0]) > parseInt(d1Arr[0])) {//如果跨年
            result = d1 + mJoint + d2;
        } else {//同一年
            if (parseInt(d2Arr[1]) > parseInt(d1Arr[1])) {//如果结束月份大于开始月份
                result = d1 + mJoint + d2.substring(5, 10);
            } else {
                result = d1 + mJoint + d2.substring(8, 10);
            }
        }
        return result;
    },
    vsLocalTime: function (time) {//日期格式 2016-10-18 23:20
        let t;
        if (time.indexOf(':') < 13) {
            t = (new Date().getFullYear() + "-" + time).substring(0, 16);
        } else {
            t = time.substring(0, 16);
        }
        let now = new Date().getTime();
        let thatTime = Date.UTC(t.substring(0, 4), parseInt(t.substring(5, 7)) - 1, t.substring(8, 10), parseInt(t.substring(11, 13)) - 8, t.substring(14, 16), 0);	//月份-1; 小时减8
        let tSu = (thatTime - now) / 1000;//秒
        if (tSu > 0) {
            let _d = tSu / (60 * 60 * 24);//天
            let _a = tSu / (60 * 60);	//小时
            let _m = tSu / 60;		//分钟
            if (_d > 1) {
                return parseInt(_d) + "天后";
            } else if (_a > 1) {
                return parseInt(_a) + '小时后';
            } else if (_m > 1) {
                return parseInt(_m) + '分钟后'
            } else {
                return "";
            }
        } else {
            let _d = tSu / (60 * 60 * 24);//天
            let _a = tSu / (60 * 60);	//小时
            let _m = tSu / 60;		//分钟
            if (_d < -1) {
                return -parseInt(_d) + "天前";
            } else if (_a < -1) {
                return -parseInt(_a) + '小时前';
            } else if (_m < -1) {
                return -parseInt(_m) + '分钟前';
            } else {
                return "";
            }
        }

    },
    dateLocalJoint: function (date1, date2, sign, middleJoint,isMeeting) {//date1开始时间，date2结束时间,sign要替换时间的符号，middleJoint两个时间中间的连接符号
        let result;
        let signal = (sign != undefined && sign != "") ? sign : '.';					//
        let mJoint = (middleJoint != undefined && middleJoint != "") ? middleJoint : "-";
        let d1 = date1.substring(0, 10).replace(/-/g, signal);
        let d1Arr = d1.toString().split(signal);
        let d2 = date2.substring(0, 10).replace(/-/g, signal);
        let d2Arr = d2.toString().split(signal);
        if (parseInt(d2Arr[0]) > parseInt(d1Arr[0])) {//如果跨年
            result = d1 + mJoint + d2;
        } else {//同一年
            if(new Date().getFullYear()==parseInt(d1Arr[0])){//如果开始年份是当前年则不显示年份
                if (Date.parse(new Date(d1))==Date.parse(new Date(d2))) {//如果是同一天
                    if(isMeeting){//如果是会议列表
                        result = d1.substring(5, 10) + mJoint + d2.substring(5, 10);
                    }else{
                        result = date1.substring(5, 10);
                    }
                } else {
                    result = d1.substring(5, 10) + mJoint + d2.substring(5, 10);
                }
            }else{
                if (Date.parse(new Date(d1))==Date.parse(new Date(d2))) {//如果是同一天
                    if(isMeeting){//如果是会议列表
                        result = d1 + mJoint + d2;
                    }else{
                        result = date1.substring(0,10);
                    }
                } else {
                    result = d1 + mJoint + d2;
                }
            }
        }
        return result;
    }
};
export default commdate;
