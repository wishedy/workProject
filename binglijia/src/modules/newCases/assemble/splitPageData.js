import comm from '~utils/comm.js';//动态页模板数据请求到后在这里被拆分成前端格式的数据

class splitPageData {
    constructor(props){
        this.originalList = (props.responseObject.responseData&&props.responseObject.responseData.data_list)?JSON.parse(JSON.stringify(props.responseObject.responseData.data_list)):[];
        this.tabId = props.responseObject.responseData.templateStructure.structureId;
        //console.log(props.responseObject.responseData.templateStructure);
        //this.splitData();
    }
    randomNum(minNum,maxNum){
        switch(arguments.length){
            case 1:
                return parseInt(Math.random()*minNum+1,10);
                break;
            case 2:
                return parseInt(Math.random()*(maxNum-minNum+1)+minNum,10);
                break;
            default:
                return 0;
                break;
        }
    }
    correctOtherData(list){
        //将其他数据
        let t=this;
        let originalList = JSON.parse(JSON.stringify(list));
        let resultList = [];
        let otherItem = {};
        for(let num = 0;num<originalList.length;num++){
            let item = originalList[num];
            let dictionaryName = item.dictionaryName;
            if((dictionaryName==='其他')&&(num!==originalList.length-1)){
                otherItem = item;
            }else{
                resultList.push(item);
            }
        }
        if(!comm.isEmptyObject(otherItem)){
            resultList.push(otherItem);
        }
        return resultList;
    }
    formatData(dataItem){
        let t = this;
//        //console.log(dataItem);
        let toolType = parseInt(dataItem.commDataField.fieldType,10);
        let fieldId = (dataItem.commDataField&&dataItem.commDataField.fieldId)?parseInt(dataItem.commDataField.fieldId,10):'';
        let dataJson = {};
        let detailId = '';
        let groupId = '';
        let isValid = 0;
        let defaultOnOff = false;
        let isBothSides = 0;//0非左右字段，1左右字段
        let sideType = 1;//1左侧，2右侧
        let checkInvalid=(val)=>{
            if(((typeof val =='string')&&(val.length==0))||(val==undefined)||(val=='undefined')||(val=='null')||(typeof val=='undefined')||(typeof val=='null')||(val==null)){
                return true;
            }else{
                return false;
            }
        };
        isBothSides = dataItem.caseFolderTemplate.isBothSides;
        sideType = dataItem.caseFolderTemplate.sideType;
        if((dataItem.caseFolderDetail)&&(dataItem.caseFolderDetail.isValid)){
            isValid =dataItem.caseFolderDetail.isValid;
        }else if((dataItem.caseFolderTemplate)&&(dataItem.caseFolderTemplate.isValid)){
            isValid =dataItem.caseFolderTemplate.isValid;
        }
        if((dataItem.caseFolderDetail)&&(dataItem.caseFolderDetail.detailId)){
            detailId =dataItem.caseFolderDetail.detailId;
        }
        if((dataItem.caseFolderDetail)&&(dataItem.caseFolderDetail.groupId)){
            groupId =dataItem.caseFolderDetail.groupId;
        }
        switch (toolType){/*caseFolderDetail回显时候的字段*/
            case 1://单选列表/content 给一个id，多个的时候id拼接
                let RadioContainer = [];
                let rIndex = -1;
                for(let ri = 0;ri<dataItem.caseFolderTemplateScope.length;ri++){
                    let relationId = [];
                    let innerItem = dataItem.caseFolderTemplateScope[ri];

                    if((dataItem.caseFolderDetail)&&!comm.isEmptyObject(dataItem.caseFolderDetail)&&(dataItem.caseFolderDetail.content)){
                        if(innerItem.dictionaryId==dataItem.caseFolderDetail.content){
                            rIndex = ri;
                        }
                    }else if((dataItem.caseFolderTemplate)&&!comm.isEmptyObject(dataItem.caseFolderTemplate)&&(dataItem.caseFolderTemplate.defaultValue)){
                        if(innerItem.dictionaryId==dataItem.caseFolderTemplate.defaultValue){
                            rIndex = ri;
                            defaultOnOff = true;
                        }
                    }

                    let relationJson = {
                        "radioName":innerItem.dictionaryName,
                        "radioId":innerItem.dictionaryId,
                        'relationId':relationId
                    };
                    if(innerItem.relationMap&&!comm.isEmptyObject(innerItem.relationMap)&&innerItem.relationMap.length){
                        relationJson['associatedComponent'] = {};
                        relationJson['relationId'] = [];
                        for(let relateNum = 0;relateNum<innerItem.relationMap.length;relateNum++){
                            let timestamp = Date.parse(new Date())+t.randomNum(10,1000)+relateNum;
                            relationJson['associatedComponent'][timestamp] = t.formatData(innerItem.relationMap[relateNum]);
                            relationJson['relationId'].push(timestamp);
                        }
                    }
                        RadioContainer.push(relationJson);

                }
                dataJson = {
                    "componentId":dataItem.caseFolderTemplate.structureId,
                    "componentType":"6",
                    'structureType':toolType,
                    'fieldId':fieldId,
                    'isValid':isValid,
                    'parentId':t.tabId,
                    'detailId':detailId,
                    'groupId':groupId,
                    'reallyIsValid':dataItem.reallyIsValid,
                    isBothSides:isBothSides,
                    sideType:sideType,
                    "labelName":dataItem.caseFolderTemplate.structureName,
                    "isRequired":0,
                    "needInput":0,
                    "RadioList":RadioContainer,
                    "index":rIndex,
                    defaultIndex:defaultOnOff?rIndex:-1,
                    "testResult":-1
                };
                break;
            case 2://单选列表-其他//otherContent节点的相关内容
                let RadioList = [];
                let rNumIndex = -1;
                let contentDes = '';
                dataItem.caseFolderTemplateScope = t.correctOtherData(dataItem.caseFolderTemplateScope);
                for(let rNum = 0;rNum<dataItem.caseFolderTemplateScope.length;rNum++){
                    let relationId = [];
                    let innerItem = dataItem.caseFolderTemplateScope[rNum];

                    if((dataItem.caseFolderDetail)&&!comm.isEmptyObject(dataItem.caseFolderDetail)&&(dataItem.caseFolderDetail.content)){
                        if(innerItem.dictionaryId==dataItem.caseFolderDetail.content){
                            rNumIndex = rNum;
                        }
                    }else if((dataItem.caseFolderTemplate)&&!comm.isEmptyObject(dataItem.caseFolderTemplate)&&(dataItem.caseFolderTemplate.defaultValue)){
                        if(innerItem.dictionaryId==dataItem.caseFolderTemplate.defaultValue){
                            rNumIndex = rNum;
                            defaultOnOff = true;
                        }
                    }
                    let RadioListItem = {
                        "radioName":innerItem.dictionaryName,
                        "radioId":innerItem.dictionaryId,
                         relationId:relationId
                    };
                    if(innerItem.relationMap&&!comm.isEmptyObject(innerItem.relationMap)&&innerItem.relationMap.length){
                        RadioListItem['associatedComponent'] = {};
                        RadioListItem['relationId'] = [];
                        for(let relateNum = 0;relateNum<innerItem.relationMap.length;relateNum++){
                            let timestamp = Date.parse(new Date())+t.randomNum(10,1000)+relateNum;
                            RadioListItem['associatedComponent'][timestamp] = t.formatData(innerItem.relationMap[relateNum]);
                            RadioListItem['relationId'].push(timestamp);
                        }
                    }
                    if(rNum!=dataItem.caseFolderTemplateScope.length-1){
                        contentDes = '、'+innerItem.dictionaryName;
                        RadioList.push(RadioListItem);
                    }


                }
                if(rNumIndex===dataItem.caseFolderTemplateScope.length-1){
                    contentDes = '、'+(dataItem.caseFolderDetail&&dataItem.caseFolderDetail.otherContent)?dataItem.caseFolderDetail.otherContent:'';
                    rNumIndex = -2;
                }else{
                    contentDes = (dataItem.caseFolderDetail&&dataItem.caseFolderDetail.otherContent)?dataItem.caseFolderDetail.otherContent:'';
                }
                let otherLabel = '';
                let lenSum = dataItem.caseFolderTemplateScope.length-1;

                if(dataItem.caseFolderTemplateScope[lenSum]&&dataItem.caseFolderTemplateScope[lenSum].dictionaryName){
                    otherLabel = dataItem.caseFolderTemplateScope[lenSum].dictionaryName;
                }
                ////console.log(rNumIndex);
                dataJson = {
                    "componentId":dataItem.caseFolderTemplate.structureId,
                    "componentType":"6",
                    'structureType':toolType,
                    'fieldId':fieldId,
                    'isValid':isValid,
                    'parentId':t.tabId,
                    isBothSides:isBothSides,
                    sideType:sideType,
                    'otherRadioId':dataItem.caseFolderTemplateScope.length>0?dataItem.caseFolderTemplateScope[dataItem.caseFolderTemplateScope.length-1].dictionaryId:'',
                    'detailId':detailId,
                    'groupId':groupId,
                    'reallyIsValid':dataItem.reallyIsValid,
                    "labelName":dataItem.caseFolderTemplate.structureName,
                    "isRequired":0,
                    "needInput":1,
                    "contentDes":checkInvalid(contentDes)?'':contentDes,
                    "RadioList":RadioList,
                    "index":rNumIndex,
                    defaultIndex:defaultOnOff?rNumIndex:-1,
                    "placeholder":"请输入内容",
                    'otherLabel':otherLabel,
                    // "maxLen":0,
                    // "testRule":"testNum",
                    // "unitName":"单位1",
                    "testResult":-1
                };
                ////console.log(dataJson);
//                        debugger;
                break;
            case 3://多选
                let checkContainer = [];
                let checkIdList = [];
                if((dataItem.caseFolderDetail)&&!comm.isEmptyObject(dataItem.caseFolderDetail)&&(dataItem.caseFolderDetail.content)){
                    checkIdList =dataItem.caseFolderDetail.content.split(',');
                }else if((dataItem.caseFolderTemplate)&&!comm.isEmptyObject(dataItem.caseFolderTemplate)&&(dataItem.caseFolderTemplate.defaultValue)){
                    defaultOnOff = true;
                    checkIdList =dataItem.caseFolderTemplate.defaultValue.split(',');
                }
                for(let cI= 0;cI<dataItem.caseFolderTemplateScope.length;cI++){
                    let innerItem = dataItem.caseFolderTemplateScope[cI];
                    let checkOnOff = false;
                    for(let cIInNum = 0;cIInNum<checkIdList.length;cIInNum++){
                        if(innerItem.dictionaryId==checkIdList[cIInNum]){
                            checkOnOff = true;
                        }
                    }
                    let checkItem = {
                        "checkboxName":innerItem.dictionaryName,
                        "checkOnOff":checkOnOff,
                        'checkboxId':innerItem.dictionaryId
                    };
                    if(innerItem.relationMap&&!comm.isEmptyObject(innerItem.relationMap)&&innerItem.relationMap.length){
                        checkItem['associatedComponent'] = {};
                        checkItem['relationId'] = [];
                        for(let relateNum = 0;relateNum<innerItem.relationMap.length;relateNum++){
                            let timestamp = Date.parse(new Date())+t.randomNum(10,1000)+relateNum;
                            checkItem['associatedComponent'][timestamp] = t.formatData(innerItem.relationMap[relateNum]);
                            checkItem['relationId'].push(timestamp);
                        }
                    }
                    checkContainer.push(checkItem);
                }
                dataJson = {
                    "componentId":dataItem.caseFolderTemplate.structureId,
                    "componentType":"7",
                    'structureType':toolType,
                    'fieldId':fieldId,
                    'isValid':isValid,
                    'parentId':t.tabId,
                    'detailId':detailId,
                    'groupId':groupId,
                    'reallyIsValid':dataItem.reallyIsValid,
                    "labelName":dataItem.caseFolderTemplate.structureName,
                    "isRequired":0,
                    "needInput":0,
                    isBothSides:isBothSides,
                    sideType:sideType,
                    "checkBoxList":checkContainer,
                    "defaultCheckBoxList":defaultOnOff?checkContainer:[],
                    "testResult":-1
                };
                break;
            case 4://多选-其他
                let checkList = [];
                let checkIdContainer = [];
                let cContentDes = (dataItem.caseFolderDetail&&dataItem.caseFolderDetail.otherContent)?dataItem.caseFolderDetail.otherContent:'';

                if((dataItem.caseFolderDetail)&&!comm.isEmptyObject(dataItem.caseFolderDetail)&&(dataItem.caseFolderDetail.content)){
                    checkIdContainer =dataItem.caseFolderDetail.content.split(',');
                } else if((dataItem.caseFolderTemplate)&&!comm.isEmptyObject(dataItem.caseFolderTemplate)&&(dataItem.caseFolderTemplate.defaultValue)){
                    defaultOnOff = true;
                    checkIdContainer =dataItem.caseFolderTemplate.defaultValue.split(',');
                }
                let otherCheckOnOff = false;
                dataItem.caseFolderTemplateScope = t.correctOtherData(dataItem.caseFolderTemplateScope);
                for(let cNum= 0;cNum<dataItem.caseFolderTemplateScope.length;cNum++){
                    let innerItem = dataItem.caseFolderTemplateScope[cNum];
                    let checkOnOff = false;
                    for(let checkIInNum = 0;checkIInNum<checkIdContainer.length;checkIInNum++){
                        if(innerItem.dictionaryId==checkIdContainer[checkIInNum]){
                            checkOnOff = true;
                            if((cNum==dataItem.caseFolderTemplateScope.length-1)&&cContentDes.length==0){
                                cContentDes+='、'+innerItem.dictionaryName;
                            }
                        }
                    }
                    let checkListItem = {
                        "checkboxName":innerItem.dictionaryName,
                        "checkOnOff":checkOnOff,
                        'checkboxId':innerItem.dictionaryId
                    };
                    if(innerItem.relationMap&&!comm.isEmptyObject(innerItem.relationMap)&&innerItem.relationMap.length){
                        checkListItem['associatedComponent'] = {};
                        checkListItem['relationId'] = [];
                        for(let relateNum = 0;relateNum<innerItem.relationMap.length;relateNum++){
                            let timestamp = Date.parse(new Date())+t.randomNum(10,1000)+relateNum;
                            checkListItem['associatedComponent'][timestamp] = t.formatData(innerItem.relationMap[relateNum]);
                            checkListItem['relationId'].push(timestamp);
                        }
                    }
                    if(cNum!==dataItem.caseFolderTemplateScope.length-1){
                        checkList.push(
                            checkListItem
                        );
                    }else{
                        otherCheckOnOff = checkOnOff;
                    }
                }
                let cotherLabel = '';
                let cLenSum = dataItem.caseFolderTemplateScope.length-1;
                if(dataItem.caseFolderTemplateScope[cLenSum]&&dataItem.caseFolderTemplateScope[cLenSum].dictionaryName){
                    cotherLabel = dataItem.caseFolderTemplateScope[cLenSum].dictionaryName;
                }
                dataJson = {
                    "componentId":dataItem.caseFolderTemplate.structureId,
                    "componentType":"7",
                    'structureType':toolType,
                    'fieldId':fieldId,
                    'isValid':isValid,
                    'parentId':t.tabId,
                    'detailId':detailId,
                    'groupId':groupId,
                    'reallyIsValid':dataItem.reallyIsValid,
                    'otherCheckOnOff':otherCheckOnOff,
                    'otherCheckId':dataItem.caseFolderTemplateScope.length>0?dataItem.caseFolderTemplateScope[dataItem.caseFolderTemplateScope.length-1].dictionaryId:'',
                    "labelName":dataItem.caseFolderTemplate.structureName,
                    "isRequired":0,
                    "needInput":1,
                    isBothSides:isBothSides,
                    sideType:sideType,
                    'otherLabel':cotherLabel,
                    "contentDes":cContentDes.indexOf('、')===0?cContentDes.substring(1,100000):cContentDes,
                    "checkBoxList":checkList,
                    "defaultCheckBoxList":defaultOnOff?checkList:[],
                    "placeholder":"请输入内容",
                    "testResult":-1
                };
                break;
            case 5://时间控件岁月天，手动输入，拼接的内容
                let dateContainer = [];
                if((dataItem.caseFolderDetail)&&!comm.isEmptyObject(dataItem.caseFolderDetail)&&(dataItem.caseFolderDetail.content)){
                    dateContainer =dataItem.caseFolderDetail.content.split(',');
                }else if((dataItem.caseFolderTemplate)&&!comm.isEmptyObject(dataItem.caseFolderTemplate)&&(dataItem.caseFolderTemplate.defaultValue)){
                    defaultOnOff = true;
                    dateContainer =dataItem.caseFolderTemplate.defaultValue.split(',');
                }
                let contentYear = dateContainer[0]&&dateContainer[0].length>0&&(dateContainer[0]*1+'')>=0?dateContainer[0]:'';
                let contentMonth = dateContainer[1]&&dateContainer[1].length>0&&(dateContainer[1]*1+'')>=0?dateContainer[1]:'';
                let contentDay = dateContainer[2]&&dateContainer[2].length>0&&(dateContainer[2]*1+'')>=0?dateContainer[2]:'';
                dataJson = {
                    "componentId":dataItem.caseFolderTemplate.structureId,
                    "componentType":"4",
                    'structureType':toolType,
                    'fieldId':fieldId,
                    'isValid':isValid,
                    'parentId':t.tabId,
                    'detailId':detailId,
                    'groupId':groupId,
                    'reallyIsValid':dataItem.reallyIsValid,
                    "labelName":dataItem.caseFolderTemplate.structureName,
                    "isRequired":0,
                    isBothSides:isBothSides,
                    sideType:sideType,
                    "contentYear":contentYear,
                    "defaultContentYear":defaultOnOff?contentYear:'',
                    "contentMonth":contentMonth,
                    "defaultContentMonth":defaultOnOff?contentMonth:'',
                    "contentDay":contentDay,
                    "defaultContentDay":defaultOnOff?contentDay:'',
                    "testResult":-1
                };
                break;
            case 6://时间控件年月日，下拉选择
                let dateList = [];

                if((dataItem.caseFolderDetail)&&!comm.isEmptyObject(dataItem.caseFolderDetail)&&(dataItem.caseFolderDetail.content)&&(dataItem.caseFolderDetail.content.length>0)){
                    dateList =dataItem.caseFolderDetail.content.split(',');
                }else if((dataItem.caseFolderTemplate)&&!comm.isEmptyObject(dataItem.caseFolderTemplate)&&(dataItem.caseFolderTemplate.defaultValue)&&(dataItem.caseFolderTemplate.defaultValue.length>0)){
                    defaultOnOff = true;
                    dateList =dataItem.caseFolderTemplate.defaultValue.split(',');
                }
                dataJson = {
                    "componentId":dataItem.caseFolderTemplate.structureId,
                    "componentType":"5",
                    'structureType':toolType,
                    'fieldId':fieldId,
                    'isValid':isValid,
                    'parentId':t.tabId,
                    'detailId':detailId,
                    'groupId':groupId,
                    'reallyIsValid':dataItem.reallyIsValid,
                    "labelName":dataItem.caseFolderTemplate.structureName,
                    "isRequired":0,
                    isBothSides:isBothSides,
                    sideType:sideType,
                    "yearSelect":(dateList[0])?dateList[0]:'',
                    "defaultYearSelect":defaultOnOff?((dateList[0])?dateList[0]:''):'',
                    "monthSelect":(dateList[1])?dateList[1]:'',
                    "defaultMonthSelect":defaultOnOff?((dateList[1])?dateList[1]:''):'',
                    "daySelect":(dateList[2])?dateList[2]:'',
                    "defaultDaySelect":defaultOnOff?((dateList[2])?dateList[2]:''):'',
                    "testResult":-1
                };
                break;
            case 7://时间控件月周天，输入下拉选择月周天
                let contentDesTime = [];
                let dateIndex = -1;
                if((dataItem.caseFolderDetail)&&!comm.isEmptyObject(dataItem.caseFolderDetail)&&(dataItem.caseFolderDetail.content)){
                    contentDesTime =dataItem.caseFolderDetail.content.split(',');
                }else if((dataItem.caseFolderTemplate)&&!comm.isEmptyObject(dataItem.caseFolderTemplate)&&(dataItem.caseFolderTemplate.defaultValue)){
                    defaultOnOff = true;
                    contentDesTime =dataItem.caseFolderTemplate.defaultValue.split(',');
                }
                if(contentDesTime[1]=='月'){
                    dateIndex = 0;
                }
                if(contentDesTime[1]=='周'){
                    dateIndex = 1;
                }
                if(contentDesTime[1]=='天'){
                    dateIndex = 2;
                }
                dataJson = {
                    "componentId":dataItem.caseFolderTemplate.structureId,
                    "componentType":'3',
                    'structureType':toolType,
                    'fieldId':fieldId,
                    'isValid':isValid,
                    'parentId':t.tabId,
                    'detailId':detailId,
                    'groupId':groupId,
                    'reallyIsValid':dataItem.reallyIsValid,
                    "labelName":dataItem.caseFolderTemplate.structureName,
                    "isRequired":0,
                    isBothSides:isBothSides,
                    sideType:sideType,
                    "contentDes":contentDesTime[0],
                    "defaultContentDes":defaultOnOff?contentDesTime[0]:'',
                    "InputSelectList":[
                        {
                            "selectName":"月",
                            "testRule":"0,100",
                        },
                        {
                            "selectName":"周",
                            "testRule":"0,100",
                        },
                        {
                            "selectName":"天",
                            "testRule":"0,100",
                        }],
                    "index":dateIndex,
                    "defaultIndex":defaultOnOff?dateIndex:-1,
                    "testResult":-1
                };
                break;
            case 8://文本，数值就是多少字符
                let maxNum = (dataItem.commDataThreshold&&dataItem.commDataThreshold.thresholdValue)?dataItem.commDataThreshold.thresholdValue.split(',')[1]:'';
                let placeholder = '';
                let textContent= '';

                if((dataItem.caseFolderDetail)&&!comm.isEmptyObject(dataItem.caseFolderDetail)&&(dataItem.caseFolderDetail.content)){
                    textContent =checkInvalid(dataItem.caseFolderDetail.content)?"":dataItem.caseFolderDetail.content;
                }else if((dataItem.caseFolderTemplate)&&!comm.isEmptyObject(dataItem.caseFolderTemplate)&&(dataItem.caseFolderTemplate.defaultValue)){
                    defaultOnOff = true;
                    placeholder =checkInvalid(dataItem.caseFolderTemplate.defaultValue)?"":dataItem.caseFolderTemplate.defaultValue;
                }

                if(maxNum>50){
                    dataJson = {
                        "componentId":dataItem.caseFolderTemplate.structureId,
                        "componentType":"8",
                        'structureType':toolType,
                        'fieldId':fieldId,
                        'isValid':isValid,
                        'parentId':t.tabId,
                        'detailId':detailId,
                        'groupId':groupId,
                        'reallyIsValid':dataItem.reallyIsValid,
                        "labelName":dataItem.caseFolderTemplate.structureName,
                        "isRequired":0,
                        isBothSides:isBothSides,
                        sideType:sideType,
                        "contentDes":textContent,
                        "defaultContentDes":defaultOnOff?textContent:'',
                        'placeholder':placeholder.length?placeholder:'请输入内容',
                        'maxLen':maxNum,
                        'testRule':'',
                        'testResult':-1,
                        'titleDes':'',
                        'title':'',
                        "unitName":checkInvalid(dataItem.commDataThreshold.thresholdUnit)?'':dataItem.commDataThreshold.thresholdUnit
                    };
                }else{
                    dataJson = {
                        "componentId":dataItem.caseFolderTemplate.structureId,
                        "componentType":"0",
                        'structureType':toolType,
                        'fieldId':fieldId,
                        'isValid':isValid,
                        'parentId':t.tabId,
                        'detailId':detailId,
                        'groupId':groupId,
                        'reallyIsValid':dataItem.reallyIsValid,
                        "labelName":dataItem.caseFolderTemplate.structureName,
                        "isRequired":0,
                        isBothSides:isBothSides,
                        sideType:sideType,
                        "contentDes":textContent,
                        "defaultContentDes":defaultOnOff?textContent:'',
                        'placeholder':'请输入内容',
                        'maxLen':maxNum,
                        'testRule':'',
                        'testResult':-1,
                        'titleDes':textContent,
                        'title':'文本标题',
                        "unitName":checkInvalid(dataItem.commDataThreshold.thresholdUnit)?'':dataItem.commDataThreshold.thresholdUnit
                    };
                }

                break;
            case 9://数值，输入框带单位，数值是控制大小范围
                let maxUnitNum = (dataItem.commDataThreshold&&dataItem.commDataThreshold.thresholdValue)?dataItem.commDataThreshold.thresholdValue.split(',')[1]:'';
                let unitContent = '';

                if((dataItem.caseFolderDetail)&&!comm.isEmptyObject(dataItem.caseFolderDetail)&&(dataItem.caseFolderDetail.content)){
                    unitContent =dataItem.caseFolderDetail.content;
                }else if((dataItem.caseFolderTemplate)&&!comm.isEmptyObject(dataItem.caseFolderTemplate)&&(dataItem.caseFolderTemplate.defaultValue)){
                    defaultOnOff = true;
                    unitContent =dataItem.caseFolderTemplate.defaultValue;
                }
                dataJson =  {
                    "componentId":dataItem.caseFolderTemplate.structureId,
                    "componentType":"0",
                    'structureType':toolType,
                    'fieldId':fieldId,
                    'isValid':isValid,
                    'parentId':t.tabId,
                    'detailId':detailId,
                    'groupId':groupId,
                    'reallyIsValid':dataItem.reallyIsValid,
                    "labelName":dataItem.caseFolderTemplate.structureName,
                    "isRequired":0,
                    'isBothSides':isBothSides,
                    'sideType':sideType,
                    "placeholder":'',
                    "contentDes":unitContent,
                    "defaultContentDes":defaultOnOff?unitContent:'',
                    "maxLen":maxUnitNum,
                    "testRule":dataItem.commDataThreshold.thresholdValue,
                    "unitName":checkInvalid(dataItem.commDataThreshold.thresholdUnit)?'':dataItem.commDataThreshold.thresholdUnit,
                    "testResult":-1
                };
                break;
            case 10://视频/图片
                let attPicList = [];
                let attVideoList = [];
                if((dataItem.caseFolderDetail)&&(dataItem.caseFolderDetail.attPicList)){
                    //textContent =dataItem.caseFolderDetail.content;
                    for(let picNum = 0;picNum<dataItem.caseFolderDetail.attPicList.length;picNum++){
                        let itemData = dataItem.caseFolderDetail.attPicList[picNum];
                        let json = {
                            imgSrc:itemData.attUrl,
                            remarks:checkInvalid(itemData.remarks)?'':itemData.remarks,
                            id:itemData.id,
                            index:''+picNum
                        };
                        attPicList.push(json);
                    }
                }
                if((dataItem.caseFolderDetail)&&(dataItem.caseFolderDetail.attVideoList)){
                    //textContent =dataItem.caseFolderDetail.content;
                    for(let videoNum=0;videoNum<dataItem.caseFolderDetail.attVideoList.length;videoNum++){
                        let itemData = dataItem.caseFolderDetail.attVideoList[videoNum];
                        let json = {
                            imgSrc:(itemData.videoPicUrl.length)?itemData.videoPicUrl:'//img10.allinmd.cn/default/qiniu196_196.jpg',
                            remarks:checkInvalid(itemData.remarks)?'':itemData.remarks,
                            videoPath:(itemData.videoPicUrl.length)?itemData.attUrl:'',
                            id:itemData.id,
                            index:''+videoNum
                        };
                        attVideoList.push(json);

                    }
                }
                let contentAttr = '';
                if((dataItem.caseFolderDetail)&&(dataItem.caseFolderDetail.content)){
                    contentAttr =dataItem.caseFolderDetail.content;
                }
                let maxLenNum = (dataItem.commDataThreshold&&dataItem.commDataThreshold.thresholdValue)?dataItem.commDataThreshold.thresholdValue.split(',')[1]:'';
                /*if((dataItem.caseFolderDetail)&&(dataItem.caseFolderDetail.detailId)){
                    contentAttr =dataItem.caseFolderDetail.detailId;
                }*/
                dataJson =  {
                    detailId:detailId,
                    CaseId:sessionStorage.getItem('emrNewCaseCaseId'),
                    structureId:dataItem.caseFolderTemplate.structureId,
                    groupId:groupId,
                    'reallyIsValid':dataItem.reallyIsValid,
                    attPicList:attPicList,
                    deleteAttPicList:[],
                    attVideoList:attVideoList,
                    deleteAttVideoList:[],
                    noteImgList:[],
                    noteVideoList:[],
                    "componentId":dataItem.caseFolderTemplate.structureId,
                    "componentType":"13",
                    'structureType':toolType,
                    'fieldId':fieldId,
                    'isValid':isValid,
                    'parentId':t.tabId,
                    "labelName":dataItem.caseFolderTemplate.structureName,
                    "isRequired":0,
                    isBothSides:isBothSides,
                    sideType:sideType,
                    "placeholder":"请输入内容",
                    "contentDes":contentAttr,
                    "maxLen":maxLenNum,
                    "testRule":dataItem.commDataThreshold.thresholdValue,
                    "testResult":1
                };
                break;
        }
        return dataJson;
    }
    combineData(data){
        ////console.log(JSON.stringify(data));
        let arr = JSON.parse(JSON.stringify(data));
        let num = 0;
        let relatedParentId = 0;
        let resultArr = {};
        let fetchData=(amiData,times,fatherId)=>{
            //console.log(fatherId);
            let associated = false;
            if(times!==0){
                associated = true;
            }
            times++;
            for(let checkKey in amiData){
                if(amiData[checkKey].componentType==6||amiData[checkKey].componentType==7){
                    resultArr[checkKey] = amiData[checkKey];
                    let list = [];
                    if(amiData[checkKey].componentType==6){
                        list = amiData[checkKey].RadioList;
                    }else{
                        list = amiData[checkKey].checkBoxList;
                    }
                    for(let checkNum = 0;checkNum<list.length;checkNum++){
                        let checkItem = list[checkNum];
                        if(checkItem.associatedComponent&&!comm.isEmptyObject(checkItem.associatedComponent)){
                            fetchData(checkItem.associatedComponent,times,checkKey);
                        }
                    }
                }else{
                    resultArr[checkKey] = amiData[checkKey];
                }
                resultArr[checkKey].associatedRole = associated;
                if(fatherId>0){
                    resultArr[checkKey].relatedParentId = fatherId;
                }
            }
        };
        fetchData(arr,num,relatedParentId);
        return resultArr;
    }
    splitData(){
        let t = this;
        let pageTotalData = [];
        for(let arrNum=0;arrNum<t.originalList.length;arrNum++){
            let arr = {};
            let originalItemData = t.originalList[arrNum];
            for(let i = 0;i<originalItemData.length;i++){
                let dataItem = originalItemData[i];
                let isValid = 0;
                if((!comm.isEmptyObject(dataItem.caseFolderDetail))&&((dataItem.caseFolderDetail.isValid==0)||(dataItem.caseFolderDetail.isValid==1))&&(dataItem.caseFolderDetail.content&&dataItem.caseFolderDetail.content.length>0)){
                    isValid =dataItem.caseFolderDetail.isValid;
                }else if((!comm.isEmptyObject(dataItem.caseFolderTemplate))&&((dataItem.caseFolderTemplate.isValid==0)||(dataItem.caseFolderTemplate.isValid==1))){
                    isValid =dataItem.caseFolderTemplate.isValid;
                }
                let reallyIsValid = isValid+'';
                if(dataItem.caseFolderTemplate.sideType.length>0){
                    isValid = 1;
                }
                dataItem.reallyIsValid = reallyIsValid;
                if(isValid==0){
                    //console.log(isValid);
                    continue;
                }else{
                    let timestamp = Date.parse(new Date())+parseInt((i+''+arrNum),10);
                    let dataJson = t.formatData(dataItem);
                    arr[timestamp] = (dataJson);
                }
            }
            arr = t.combineData(arr);
            pageTotalData.push(arr);
        }
        return pageTotalData;

    }
}
export default splitPageData;
