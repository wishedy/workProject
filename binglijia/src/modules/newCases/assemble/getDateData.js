class dateData {
    //时间选择器的数据基于这个类产生
    constructor(){
        this.yearTimeBox=[];
        this.monthTimeBox=[];
        this.dayTimeBox=[];
        this.getYearDate();
    }
    getYearDate(){
        let t = this;
        const dateTime = new Date();
        for(let num = dateTime.getFullYear();num>1899;num--){
            t.yearTimeBox.push(num);
        }
        t.getMonthDate();

    }
    getMonthDate(){
        let t = this;
        for(let num = 1;num<12+1;num++){
            t.monthTimeBox.push(num);
        }
        const dateTime = new Date();
        t.getDayDate(dateTime.getFullYear(),dateTime.getMonth()+1);
    }
    getDayDate(y,m){
        let t = this;
        const year=y; //表示需要查找的年份
        const month=m;//表示需要查找的月份
        this.dayTimeBox=[];
        const curMonthDays=new Date(year,month,0).getDate(); //0表示3月的第0天，上月的最后一天,月份从0开始记数
        ////console.log('查找的月份共有'+curMonthDays+"天");
        for(let num = 1;num<curMonthDays+1;num++){
            t.dayTimeBox.push(num);
        }
        ////console.log(t.yearTimeBox,t.monthTimeBox,t.dayTimeBox);
        return t.dayTimeBox;

    }
}
export default  dateData;
