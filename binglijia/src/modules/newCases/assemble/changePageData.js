//校验当前数据是否改变，改变返回真不改变返回假
class changePageData {
    constructor(props){
       this.nowData = JSON.parse(JSON.stringify(props.nowData));
       this.lastData = JSON.parse(JSON.stringify(props.lastData));
    }
    comparisonChange(){
        let t = this;
        let sumLen = Object.keys(t.nowData).length;
        let emptyLen = 0;
        let checkInvalid=(val)=>{
            if(((typeof val =='string')&&(val.length==0))||(val==undefined)||(val=='undefined')||(val=='null')||(typeof val=='undefined')||(typeof val=='null')||(val==null)){
                return '';
            }else{
                return val;
            }
        };
        let testInvalid = (val)=>{
            if(((typeof val =='string')&&(val.length==0))||(val==undefined)||(val=='undefined')||(val=='null')||(typeof val=='undefined')||(typeof val=='null')||(val==null)){
                return true;
            }else{
                return false;
            }
        };
        for(let keyWord in t.nowData){
            let dataItem = t.nowData[keyWord];
            let checkOnOff = false;
            switch (parseInt(dataItem.componentType)){
                case 0://输入框
                    checkOnOff = (checkInvalid(dataItem.contentDes)==checkInvalid(t.lastData[keyWord].contentDes));
                    if(checkOnOff){
                        emptyLen++;
                    }else{
                        //console.log('输入框不一样');
                    }
                    break;
                case 1://下拉框
                    checkOnOff = (dataItem.index==t.lastData[keyWord].index);
                    if(checkOnOff){
                        emptyLen++;
                    }else{
                        //console.log('下拉框');
                    }
                    break;
                case 2://选择输入框
                    checkOnOff = (dataItem.index==t.lastData[keyWord].index)&&(checkInvalid(dataItem.contentDes)==checkInvalid(t.lastData[keyWord].contentDes))&&(dataItem.defaultIndex==-1)&&(testInvalid(dataItem.defaultContentDes));
                    if(checkOnOff){
                        emptyLen++;
                    }else{
                        //console.log('选择输入框');
                    }
                    break;
                case 3://输入选择框
                    checkOnOff = (dataItem.index==t.lastData[keyWord].index)&&(checkInvalid(dataItem.contentDes)==checkInvalid(t.lastData[keyWord].contentDes))&&(dataItem.defaultIndex==-1)&&(testInvalid(dataItem.defaultContentDes));
                    if(checkOnOff){
                        emptyLen++;
                    }else{
                        //console.log('输入选择框');
                    }
                    break;
                case 4://年龄输入框
                    let ensureDate = (str)=>{
                        if(str+''.length>0){
                            return str*1+'';
                        }else{
                            return str;
                        }
                    };
                    let lastContentYear = ensureDate(t.lastData[keyWord].contentYear);
                    let lastContentMonth = ensureDate(t.lastData[keyWord].contentMonth);
                    let lastContentDay = ensureDate(t.lastData[keyWord].contentDay);
                    checkOnOff = (dataItem.contentYear==lastContentYear)&&(dataItem.contentMonth==lastContentMonth)&&(dataItem.contentDay==lastContentDay)&&((testInvalid(dataItem.defaultContentYear)&&testInvalid(dataItem.defaultContentMonth)&&testInvalid(dataItem.defaultContentDay)));
                    //debugger;
                    if(checkOnOff){
                        emptyLen++;
                    }else{
                        //console.log('年龄输入框');
                    }
                    break;
                case 5://时间下拉框
                    checkOnOff = (dataItem.yearSelect==t.lastData[keyWord].yearSelect)&&(dataItem.monthSelect==t.lastData[keyWord].monthSelect)&&(dataItem.daySelect==t.lastData[keyWord].daySelect)&&((testInvalid(dataItem.defaultYearSelect)&&testInvalid(dataItem.defaultMonthSelect)&&testInvalid(dataItem.defaultDaySelect)));
                    if(checkOnOff){
                        emptyLen++;
                    }else{
                        //console.log('时间下拉框');
                    }
                    break;
                case 6://单选框
                    checkOnOff = (dataItem.index==t.lastData[keyWord].index)&&(checkInvalid(dataItem.contentDes)==checkInvalid(t.lastData[keyWord].contentDes))&&(dataItem.defaultIndex==-1);
                    if(checkOnOff){
                        emptyLen++;
                    }else{
                        //console.log('单选框');
                    }
                    break;
                case 7://多选框
                    let checkLen = 0;
                    let defaultLen = 0;
                    for(let checkNum = 0;checkNum<dataItem.checkBoxList.length;checkNum++){
                        for(let innerCheckNum = 0;innerCheckNum<t.lastData[keyWord].checkBoxList.length;innerCheckNum++){
                            if((dataItem.checkBoxList[checkNum].checkboxId==t.lastData[keyWord].checkBoxList[innerCheckNum].checkboxId)&&(dataItem.checkBoxList[checkNum].checkOnOff===t.lastData[keyWord].checkBoxList[innerCheckNum].checkOnOff)){
                                checkLen++;
                            }
                        }
                    }
                    for(let checkNum = 0;checkNum<dataItem.defaultCheckBoxList.length;checkNum++){
                       if(dataItem.defaultCheckBoxList[checkNum].checkOnOff){
                           defaultLen++;
                       }
                    }
                    //console.log(checkInvalid(dataItem.contentDes),checkInvalid(t.lastData[keyWord].contentDes));
                    checkOnOff = (checkLen==dataItem.checkBoxList.length)&&(checkInvalid(dataItem.contentDes)==checkInvalid(t.lastData[keyWord].contentDes))&&(defaultLen==0)&&(dataItem.otherCheckOnOff==t.lastData[keyWord].otherCheckOnOff);
                    if(checkOnOff){
                        emptyLen++;
                    }else{
                        //console.log('多选框');
                    }
                    break;
                case 8://文本域
                    checkOnOff = (checkInvalid(dataItem.contentDes)==checkInvalid(t.lastData[keyWord].contentDes));
                    if(checkOnOff){
                        emptyLen++;
                    }else{
                        //console.log('文本域');
                    }
                    break;
                case 13:
                    let checkAttList = (nowList,lastList)=>{
                        console.log(nowList,lastList)
                        if(nowList.length===lastList.length){
                            let checkNum = 0;
                            for(let nowNum = 0;nowNum<nowList.length;nowNum++){
                                for(let lastNum = 0;lastNum<lastList.length;lastNum++){
                                    if(nowList[nowNum].id==lastList[lastNum].id){
                                        checkNum++;
                                    }
                                }
                            }
                            return (checkNum===nowList.length);
                        }else{
                            return false;
                        }
                    };
                    let checkRemarks = (nowList,lastList)=>{
                        if(nowList.length===lastList.length){
                            let checkNum = 0;
                            for(let nowNum = 0;nowNum<nowList.length;nowNum++){
                                for(let lastNum = 0;lastNum<lastList.length;lastNum++){
                                    console.log("-------"+nowList[nowNum].remarks,"-------"+lastList[lastNum].remarks)
                                    if(((nowList[nowNum].id==lastList[lastNum].id))&&(nowList[nowNum].remarks==lastList[lastNum].remarks)){
                                        checkNum++;
                                    }
                                }
                            }
                            console.log(checkNum===nowList.length);
                            return (checkNum===nowList.length);
                        }else{
                            return false;
                        }
                    }
                    if(!t.deleteAttPicList){
                        t.deleteAttPicList = [];
                    }
                    if(!t.deleteAttVideoList){
                        t.deleteAttVideoList = [];
                    }
                    checkOnOff = (checkAttList(dataItem.attPicList,t.lastData[keyWord].attPicList))&&checkAttList(dataItem.attVideoList,t.lastData[keyWord].attVideoList)&&(checkAttList(dataItem.noteImgList,t.lastData[keyWord].noteImgList))&&checkAttList(dataItem.noteVideoList,t.lastData[keyWord].noteVideoList)&&((checkInvalid(dataItem.contentDes)==checkInvalid(t.lastData[keyWord].contentDes)))&&(t.deleteAttPicList.length==0)&&(t.deleteAttVideoList.length==0)&&(checkRemarks(dataItem.attPicList,t.lastData[keyWord].attPicList))&&(checkRemarks(dataItem.noteImgList,t.lastData[keyWord].noteImgList))&&(checkRemarks(dataItem.noteVideoList,t.lastData[keyWord].noteVideoList))&&(checkRemarks(dataItem.attVideoList,t.lastData[keyWord].attVideoList));
                    console.log(checkOnOff);
                    if(checkOnOff){
                        emptyLen++;
                        ////console.log('图片视频');
                    }else{
                        //console.log('图片视频');
                    }
                    break;
            }
        }
        // debugger;
        return emptyLen===sumLen;
    }

}
export default changePageData;
