class isEmptyData {
   constructor(props){
       this.originalList = props;
   }
    checkInvalid(val){
        if(((typeof val =='string')&&(val.length==0))||(val==undefined)||(val=='undefined')||(val=='null')||(typeof val=='undefined')||(typeof val=='null')||(val==null)){
            return true;
        }else{
            return false;
        }
    }
   isEmpty(){
       let t = this;
       let sumLen = Object.keys(t.originalList).length;
       let emptyLen = 0;
       for(let keyWord in t.originalList){
           let dataItem = t.originalList[keyWord];
           let checkOnOff = false;
           checkOnOff = t.itemIsEmpty(dataItem);
           if(checkOnOff){
               emptyLen++;
           }
       }
       return emptyLen==sumLen;
   }
    itemIsEmpty(dataItem){
       let t = this;
       let checkOnOff = false;
        switch (parseInt(dataItem.componentType)){
            case 0://输入框
                checkOnOff = t.checkInvalid(dataItem.contentDes);
                break;
            case 1://下拉框
                checkOnOff = (dataItem.index<0||t.checkInvalid(dataItem.index));
                break;
            case 2://选择输入框
                checkOnOff = t.checkInvalid(dataItem.contentDes);
                break;
            case 3://输入选择框
                checkOnOff = t.checkInvalid(dataItem.contentDes);
                break;
            case 4://年龄输入框
                checkOnOff = false;
                break;
            case 5://时间下拉框
                checkOnOff = (t.checkInvalid(dataItem.yearSelect)&&t.checkInvalid(dataItem.monthSelect)&&t.checkInvalid(dataItem.daySelect));
                break;
            case 6://单选框
                let InputOnOff = (parseInt(dataItem['needInput'],10)===1);
                //debugger;
                if(InputOnOff){
                    if((dataItem.index<0&&dataItem.index!=-2&&t.checkInvalid(dataItem.contentDes))){
                        checkOnOff = true;
                        ////console.log('单选框');
                    }
                }else{
                    if(dataItem.index<0&&dataItem.index!=-2){
                        checkOnOff = true;
                        ////console.log('单选框');
                    }
                }
                break;
            case 7://多选框
                let checkLen = 0;
                //debugger;
                for(let checkNum = 0;checkNum<dataItem.checkBoxList.length;checkNum++){
                    if(dataItem.checkBoxList[checkNum].checkOnOff===false){
                        checkLen++;
                    }
                }
                if(parseInt(dataItem['needInput'],10)===1){
                    checkOnOff = (t.checkInvalid(dataItem.contentDes)&&(checkLen===dataItem.checkBoxList.length)&&dataItem.otherCheckOnOff==false);
                }else{
                    checkOnOff = (checkLen===dataItem.checkBoxList.length);
                }
                break;
            case 8://文本域
                checkOnOff = t.checkInvalid(dataItem.contentDes);
                break;
            case 13://图片视频
                checkOnOff = ((dataItem.attPicList.length==0)&&(dataItem.attVideoList.length==0)&&(dataItem.noteImgList.length==0)&&(dataItem.noteVideoList==0)&&t.checkInvalid(dataItem.contentDes));
                break;

        }
        return checkOnOff;
    }
}
export default isEmptyData;
