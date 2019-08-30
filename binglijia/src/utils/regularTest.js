//全站正则判断
const regularTest = {
    testNum(val){
        //判断数字
        return (/^\d+$/g).test(val);
    },
    testName(val){
        //判断名字，涵盖少数民族
        return (/^[\u4e00-\u9fa5\s\.·-]{1,25}$|^[\@A-Za-z_\s\.·-]{1,50}$|^[A-Za-z\u4e00-\u9fa5]{1,20}$|^[\u4e00-\u9fa5A-Za-z]{1,20}$/).test(val);
    },
    testPhoneNum(val){
        //判断手机号 包含16、17号段
        //return (/^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/).test(val);
        return (/^1\d{10}$/).test(val);
    },
    testID(value){
        //判断身份证
            let city = {
                11: "北京",
                12: "天津",
                13: "河北",
                14: "山西",
                15: "内蒙古",
                21: "辽宁",
                22: "吉林",
                23: "黑龙江 ",
                31: "上海",
                32: "江苏",
                33: "浙江",
                34: "安徽",
                35: "福建",
                36: "江西",
                37: "山东",
                41: "河南",
                42: "湖北 ",
                43: "湖南",
                44: "广东",
                45: "广西",
                46: "海南",
                50: "重庆",
                51: "四川",
                52: "贵州",
                53: "云南",
                54: "西藏 ",
                61: "陕西",
                62: "甘肃",
                63: "青海",
                64: "宁夏",
                65: "新疆",
                71: "台湾",
                81: "香港",
                82: "澳门",
                91: "国外 "
            };
            let tip = "",
                pass = true;
            value = value.toUpperCase();
            if (value.length == 15) {
                //15位身份证直接过
                pass = false;
            } else if (!value || !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(value)) {
                //tip = "身份证号格式错误";
                pass = false;
            } else if (!city[value.substr(0, 2)]) {
                //tip = "地址编码错误";
                pass = false;
            } else if (value.length == 18) {
                //18位身份证需要验证最后一位校验位
                value = value.split('');
                //∑(ai×Wi)(mod 11)
                //加权因子
                let factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2],
                    parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2],//校验位
                    sum = 0,
                    ai = 0,
                    wi = 0;
                for (let i = 0; i < 17; i++) {
                    ai = value[i];
                    wi = factor[i];
                    sum += ai * wi;
                }
                if (parity[sum % 11] != value[17]) {
                    //tip = "校验位错误";
                    pass = false;
                }
            }
            return pass;
    },
    isPInt(str) {
        return (/^[1-9]*[1-9][0-9]*$/).test(str);
    },
    decimals(str){
        return (/^\d+(\.\d+)?$/).test(str);
    },
    minus(str){
        return (/^(\-|\+)?\d+(\.\d+)?$/).test(str);
    }
};
export default  regularTest;
