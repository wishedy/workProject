class TemplatePage {
    constructor(props){
        let t = this;
        this.pageHtml = '';
        this.pageData = props;
        t.init();
    }
    init(){
        return {'id':'11111111'}
    }
    htmlStr(data,keyWord,paddingBottom,rlOnOff){
      let nowData = data;
      let lastStr = '';
      if(!(nowData.isBothSides==0||nowData.isBothSides==1)){
          nowData.isBothSides = 0;
          nowData.sideType = 0;
      }else{
          if(nowData.sideType.length==0){
              nowData.sideType = 0;
          }
      }
      //console.log(nowData.reallyIsValid);
        switch (parseInt(nowData.componentType,10)){
            case 0://输入框
                lastStr=
                    `
                          <InputBar  reallyIsValid=${nowData.reallyIsValid} sideType=${parseInt(nowData.sideType)} isBothSides=${parseInt(nowData.isBothSides)} relatedParentId=${(nowData.relatedParentId)?nowData.relatedParentId:0} associatedRole=${nowData.associatedRole}  contentDes="${nowData.contentDes}" testRule="${(nowData.testRule)?nowData.testRule:''}"  HandleId="${keyWord}"  ${(parseInt(nowData.isRequired,10)===1)?'isRequired':''} labelName="${nowData.labelName}" placeholder="${nowData.placeholder}" unitName="${nowData.unitName}" maxLen="${(parseInt(nowData.maxLen)>0?nowData.maxLen:'')}"></InputBar>
                        `;
                break;
            case 1://下拉框
                lastStr=
                    `
                          <SelectBar   reallyIsValid=${nowData.reallyIsValid}  style='${paddingBottom}'  sideType=${nowData.sideType}   isBothSides=${nowData.isBothSides} relatedParentId=${(nowData.relatedParentId)?nowData.relatedParentId:0}  associatedRole=${nowData.associatedRole}  SelectList='${JSON.stringify(nowData.SelectList)}'   HandleId="${keyWord}"  index="${nowData.index}" ${(parseInt(nowData.isRequired,10)===1)?'isRequired':''} labelName="${nowData.labelName}"></SelectBar>
                        `;
                break;
            case 2://选择输入框
                lastStr=
                    `
                          <SelectInput    reallyIsValid=${nowData.reallyIsValid} style='${paddingBottom}'   relatedParentId=${(nowData.relatedParentId)?nowData.relatedParentId:0}  associatedRole=${nowData.associatedRole}  SelectInputList='${JSON.stringify(nowData.SelectInputList)}'    HandleId="${keyWord}"  index="${nowData.index}" ${(parseInt(nowData.isRequired,10)===1)?'isRequired':''} labelName="${nowData.labelName}"  contentDes="${nowData.contentDes}"  testRule="${(nowData.testRule)?nowData.testRule:''}" ></SelectInput>
                        `;
                break;
            case 3://输入选择框
                lastStr=
                    `
                          <InputSelect    reallyIsValid=${nowData.reallyIsValid} style='paddingBottom:${paddingBottom};'   relatedParentId=${(nowData.relatedParentId)?nowData.relatedParentId:0}  associatedRole=${nowData.associatedRole}  InputSelectList='${JSON.stringify(nowData.InputSelectList)}'    HandleId="${keyWord}"  contentDes="${nowData.contentDes}"  index="${nowData.index}" ${(parseInt(nowData.isRequired,10)===1)?'isRequired':''} labelName="${nowData.labelName}"  testRule="${(nowData.testRule)?nowData.testRule:''}" ></InputSelect>
                        `;
                break;
            case 4://年龄输入框
                lastStr=
                    `
                          <AgeInput     reallyIsValid=${nowData.reallyIsValid} testYearRule="0,120" testMonthRule="0,12" testDayRule="0,30" relatedParentId=${(nowData.relatedParentId)?nowData.relatedParentId:0}  associatedRole=${nowData.associatedRole}   ${(parseInt(nowData.isRequired,10)===1)?'isRequired':''}   HandleId="${keyWord}"  labelName="${nowData.labelName}" contentYear="${nowData.contentYear}"  contentMonth="${nowData.contentMonth}"  contentDay="${nowData.contentDay}"></AgeInput>
                        `;
                break;
            case 5://日期选择器
                lastStr=
                    `
                          <DatePicker    reallyIsValid=${nowData.reallyIsValid} style='${paddingBottom}' relatedParentId=${(nowData.relatedParentId)?nowData.relatedParentId:0}  associatedRole=${nowData.associatedRole}  ${(parseInt(nowData.isRequired,10)===1)?'isRequired':''}   HandleId="${keyWord}"  labelName="${nowData.labelName}"   yearSelect="${nowData.yearSelect}" monthSelect="${nowData.monthSelect}" daySelect="${nowData.daySelect}"></DatePicker>
                        `;
                break;
            case 6://单选框
                lastStr=
                    `
                        <RadioBar     reallyIsValid=${nowData.reallyIsValid} sideType=${parseInt(nowData.sideType)} isBothSides=${parseInt(nowData.isBothSides)} otherLabel=${(nowData.otherLabel)?nowData.otherLabel:"undefined"} relatedParentId=${(nowData.relatedParentId)?nowData.relatedParentId:0}  associatedRole=${nowData.associatedRole}  RadioList='${JSON.stringify(nowData.RadioList)}'     HandleId="${keyWord}"  contentDes="${nowData.contentDes}"  ${(parseInt(nowData.isRequired,10)===1)?'isRequired':''} index='${nowData.index}' labelName="${nowData.labelName}"  ${(parseInt(nowData.row,10)===1)?'row':''} ${(parseInt(nowData.needInput,10)===1)?'needInput':''} testRule="${(nowData.testRule)?nowData.testRule:''}" placeholder="${nowData.placeholder}" ></RadioBar>
                        `;
                break;
            case 7://多选框
                lastStr=
                    `
                          <CheckboxBar  reallyIsValid=${nowData.reallyIsValid} sideType=${parseInt(nowData.sideType)} isBothSides=${parseInt(nowData.isBothSides)} otherLabel=${(nowData.otherLabel)?nowData.otherLabel:"undefined"} relatedParentId=${(nowData.relatedParentId)?nowData.relatedParentId:0}  associatedRole=${nowData.associatedRole}  checkBoxList='${JSON.stringify(nowData.checkBoxList)}'    index='${nowData.index}'   HandleId="${keyWord}"  contentDes="${nowData.contentDes}"  ${(parseInt(nowData.isRequired,10)===1)?'isRequired':''} labelName="${nowData.labelName}"  ${(parseInt(nowData.row,10)===1)?'row':''}  otherCheckOnOff="${nowData.otherCheckOnOff}" ${(parseInt(nowData.needInput,10)===1)?'needInput':''} testRule="${(nowData.testRule)?nowData.testRule:''}" placeholder="${nowData.placeholder}" ></CheckboxBar>
                        `;
                break;
            case 8://文本域
                lastStr=
                    `
                          <TextAreaBar   labelName="${nowData.labelName}" reallyIsValid=${nowData.reallyIsValid}  sideType=${parseInt(nowData.sideType)} isBothSides=${parseInt(nowData.isBothSides)} relatedParentId=${(nowData.relatedParentId)?nowData.relatedParentId:0}  associatedRole=${nowData.associatedRole}  maxLen=${((parseInt(nowData.maxLen)>0)?nowData.maxLen:'')}     HandleId="${keyWord}"  contentDes="${encodeURIComponent(nowData.contentDes)}"  ${(parseInt(nowData.isRequired,10)===1)?'isRequired':''}  title="${nowData.title}"  titleDes="${nowData.titleDes}" placeholder="${nowData.placeholder}" RadioList='${JSON.stringify(nowData.RadioList)} '   testRule="${(nowData.testRule)?nowData.testRule:''}"  ></TextAreaBar>
                        `;
                break;
            case 13://图片视频
                lastStr=
                    `
                          <UpLoadFile    reallyIsValid=${nowData.reallyIsValid}  relatedParentId=${(nowData.relatedParentId)?nowData.relatedParentId:0}  associatedRole=${nowData.associatedRole}   HandleId='${keyWord}'   contentDes="${encodeURIComponent(nowData.contentDes)}"  detailId="${nowData.detailId}"  componentId="${nowData.componentId}"   groupId="${nowData.groupId}"  ${(parseInt(nowData.isRequired,10)===1)?'isRequired':''}   placeholder="${nowData.placeholder}"  labelName="${nowData.labelName}"   testRule="${(nowData.testRule)?nowData.testRule:''}"    attPicList='${JSON.stringify(nowData.attPicList)}'  CaseId="${nowData.CaseId}" attVideoList='${JSON.stringify(nowData.attVideoList)}' maxLen="${nowData.maxLen}"></UpLoadFile>
                        `;
                break;
        }
        return lastStr;
    }
    createPageHtml(){
        let t = this;
        let num = 0;//json循环计数
        let listArr = Object.keys(t.pageData);
        for(let keyWord in t.pageData){
            let nowData = t.pageData[keyWord];
            let paddingBottom = '';
            if((listArr[listArr.length-1]==keyWord)&&(nowData.componentType==1||nowData.componentType==2||nowData.componentType==3||nowData.componentType==5)){
                paddingBottom = '200px';
            }
            if(parseInt(nowData.isValid)>0){
                if(nowData.isBothSides==1&&nowData.sideType==1){
                    let nextPaddingBottom = '';
                    let nextKey = listArr[num+1];
                    let nextData = t.pageData[nextKey];
                    if((listArr[listArr.length-1]==nextKey)&&(nextData.componentType==1||nextData.componentType==2||nextData.componentType==3||nextData.componentType==5)){
                        nextPaddingBottom = '200px';
                    }
                    t.pageHtml+=`<section class="formCommonLrContainer">
                         ${t.htmlStr(nowData,keyWord,paddingBottom,true)}
                         ${t.htmlStr(nextData,nextKey,nextPaddingBottom,true)}
                     </section>`;
                }else if(nowData.isBothSides==1&&nowData.sideType==2){
                    num++;
                    continue;
                }else{
                    t.pageHtml+=t.htmlStr(nowData,keyWord,paddingBottom);
                }
            }
            num++;
        }
        return t.pageHtml;

    }
}
export default TemplatePage;
