class dateData {
    //时间选择器的数据基于这个类产生
    constructor(){
        let t=this;
        //開始時間的數組和函數調用
        t.yearTimeBox1=[];
        t.monthTimeBox1=[];
        t.dayTimeBox1=[];
        //結束時間的數組和函數調用
        t.yearTimeBox2=[];
        t.monthTimeBox2=[];
        t.dayTimeBox2=[];
        t.getYearDate1();
        t.getYearDate2();
    }
    //獲取選中的年月日數據
    obj(options){
        let t=this;
        t.yearOne =options.yearOne;
        t.monthOne =options.monthOne;
        t.dayOne =options.dayOne;
        t.yearTwo = options.yearTwo;
        t.monthTwo =  options.monthTwo;
        t.dayTwo = options.dayTwo;
        t.getYearDate1();
        t.getYearDate2();
    }
    //更改月份变更已经选中日期
    changeDay1(){
        let t=this;
        return t.dayText1;
    }
    changeDay2(){
        let t=this;
        return t.dayText2;
    }
    getYearDate1(){
        let t = this;
        t.yearTimeBox1=[];
        const dateTime = new Date();
        for(let num = dateTime.getFullYear();num>1899;num--){//num开始时间 yearTwo结束时间
            //开始年份处理
            let _act=true;
            if(t.yearTwo<=num){//开始大于等于结束的情况
                if(t.yearTwo<num){//开始年份大于结束年份的都不让选择
                    _act=false;
                }else{//同年情况
                    if(t.monthTwo<t.monthOne){//开始月大于结束月
                        _act=false;
                    }
                    if(t.monthTwo==t.monthOne){//开始月等于结束月，对比具体日期
                        if(t.dayTwo<t.dayOne){//开始日大于结束日，不能选择
                            _act=false;
                        }
                    }
                }
            }
            //判断月份和日期大于当年年的月日，当前年不能选择
            if(t.monthOne>dateTime.getMonth()+1){//月份大于当前年的月份
                if(num==dateTime.getFullYear()){//当前年不能选择
                    _act=false;
                }
            }
            if(t.monthOne==dateTime.getMonth()+1){//月份等于当前年的月份
                if(t.dayOne>dateTime.getDate()){//当前日大于，当前年的日，当前年不能选择
                    if(num==dateTime.getFullYear()){//当前年不能选择
                        _act=false;
                    }
                }
            }
            let yearJson={
                year:num,
                active:_act
            };
            t.yearTimeBox1.push(yearJson);
        }
        t.getMonthDate1();

    }
    getMonthDate1(){
        let t = this;
        const dateTime = new Date();
        t.monthTimeBox1=[];
        for(let num = 1;num<12+1;num++){//num开始时间 monthTwo结束时间
            //开始月份的处理
            let _act=true;
            if(t.yearTwo==t.yearOne){//开始年等于结束年，判断月份
                if(t.monthTwo<=num){//开始月大于等于结束月
                    if(t.monthTwo<num){//开始大于结束
                        _act=false;
                    }else{//等于结束，判断日期
                        if(t.dayTwo<t.dayOne){//开始日大于结束日，不能选择
                            _act=false;
                        }
                    }
                }
            }
            if(t.yearOne==dateTime.getFullYear()){//当前年等于选中年
                //判断日期大于当年年的日期，当前月不能选择
                if(t.dayOne>dateTime.getDate()){//日期大于当前的日期
                    if(num==dateTime.getMonth()+1){//当前月不能选择
                        _act=false;
                    }
                }
            }
            let monthJson={};
            if(!(t.yearOne==dateTime.getFullYear()&&num>dateTime.getMonth()+1)){
                 monthJson={
                    month:num,
                    active:_act
                };
            }
            t.monthTimeBox1.push(monthJson);
        }
        t.getDayDate1(t.yearOne?t.yearOne:dateTime.getFullYear(),t.monthOne?t.monthOne:dateTime.getMonth()+1);
    }
    getDayDate1(y,m){
        let t = this;
        const dateTime = new Date();
        const year=y; //表示需要查找的年份
        const month=m;//表示需要查找的月份
        this.dayTimeBox1=[];
        const curMonthDays=new Date(year,month,0).getDate(); //0表示3月的第0天，上月的最后一天,月份从0开始记数
        for(let num = 1;num<curMonthDays+1;num++){//num开始时间 dayTwo结束时间
            //开始的日期处理
            let _act=true;
            if(t.yearTwo==t.yearOne&&t.monthTwo==t.monthOne&&t.dayTwo<num){//同年同月  开始时间大于结束时间的都不让选
                _act=false;
            }
            let dayJson={};
            if(!(t.yearOne==dateTime.getFullYear()&&t.monthOne==dateTime.getMonth()+1&&num>dateTime.getDate())){
                dayJson={
                    day:num,
                    active:_act
                };
            }
            t.dayTimeBox1.push(dayJson);
        }
        if(t.dayOne>curMonthDays){//已经选中的日子大于当前月所在的日，将日期更改成本月最大日
            t.dayText1=curMonthDays;

        }else{
            t.dayText1='';
        }
        t.changeDay1();
        return t.dayTimeBox1;

    }
    //結束時間的日期相關操作
    getYearDate2(){
        let t = this;
        t.yearTimeBox2=[];
        const dateTime = new Date();
        for(let num = dateTime.getFullYear();num>1899;num--){//num结束时间，yearOne开始时间
            //结束年份处理
            let _act1=true;
            if(num<=t.yearOne){//结束小于等于开始的情况
                if(num<t.yearOne){//结束年份小于开始年份，不让选择
                    _act1=false;
                }else{//结束年份等于开始年份，验证月份
                    if(t.monthTwo<t.monthOne){//结束月小于开始月
                        _act1=false;
                    }
                    if(t.monthTwo==t.monthOne){//结束月等于开始月，对比具体日期
                        if(t.dayTwo<t.dayOne){//结束日小于开始月，不能选择
                            _act1=false;
                        }
                    }
                }
            }
            //判断月份和日期大于当年年的月日，当前年不能选择
            if(t.monthTwo>dateTime.getMonth()+1){//月份大于当前年的月份
                if(num==dateTime.getFullYear()){//当前年不能选择
                    _act1=false;
                }
            }
            if(t.monthTwo==dateTime.getMonth()+1){//月份等于当前年的月份
                if(t.dayTwo>dateTime.getDate()){//当前日大于，当前年的日，当前年不能选择
                    if(num==dateTime.getFullYear()){//当前年不能选择
                        _act1=false;
                    }
                }
            }
            let yearJson1={
                year:num,
                active:_act1
            };
            t.yearTimeBox2.push(yearJson1);
        }
        t.getMonthDate2();

    }
    getMonthDate2(){
        let t = this;
        const dateTime = new Date();
        t.monthTimeBox2=[];
        for(let num = 1;num<12+1;num++){//num结束时间，monthOne开始时间
            //结束月份的处理
            let _act1=true;
            if(t.yearTwo==t.yearOne){//结束开始同年，判断月份
                if(num<=t.monthOne){//结束月小于等于开始月
                    if(num<t.monthOne){//结束小于开始
                        _act1=false;
                    }else{//等于开始，判断日期
                        if(t.dayTwo<t.dayOne){//结束小于开始日，不能选择
                            _act1=false;
                        }
                    }
                }
            }
            if(t.yearTwo==dateTime.getFullYear()){//当前年等于选中年
                //判断日期大于当年年的日期，当前月不能选择
                if (t.dayTwo > dateTime.getDate()) {//日期大于当前的日期
                    if (num == dateTime.getMonth() + 1) {//当前月不能选择
                        _act1 = false;
                    }
                }
            }
            let monthJson1={};
            if(!(t.yearTwo==dateTime.getFullYear()&&num>dateTime.getMonth()+1)){
                monthJson1={
                    month:num,
                    active:_act1
                };
            }
            t.monthTimeBox2.push(monthJson1);
        }
        t.getDayDate2(t.yearTwo?t.yearTwo:dateTime.getFullYear(),t.monthTwo?t.monthTwo:dateTime.getMonth()+1);
    }
    getDayDate2(y,m){
        let t = this;
        const dateTime = new Date();
        const year=y; //表示需要查找的年份
        const month=m;//表示需要查找的月份
        this.dayTimeBox2=[];
        const curMonthDays=new Date(year,month,0).getDate(); //0表示3月的第0天，上月的最后一天,月份从0开始记数
        for(let num = 1;num<curMonthDays+1;num++){//num结束时间，dayOne开始时间
            //结束的日期处理
            let _act1=true;
            if(t.yearTwo==t.yearOne&&t.monthTwo==t.monthOne&&t.dayOne>num){//同年同月  结束时间小于开始时间的都不让选
                _act1=false;
            }
            let dayJson1={};
            if(!(t.yearTwo==dateTime.getFullYear()&&t.monthTwo==dateTime.getMonth()+1&&num>dateTime.getDate())){
                dayJson1={
                    day:num,
                    active:_act1
                };
            }
            t.dayTimeBox2.push(dayJson1);
        }
        if(t.dayTwo>curMonthDays){//已经选中的日子大于当前月所在的日，将日期更改成本月最大日
            t.dayText2=curMonthDays

        }else{
            t.dayText2='';
        }
        t.changeDay2();
        return t.dayTimeBox2;
    }
}
export default  dateData;
