const $ =require("jquery");
import comm from '~utils/comm.js';
import isEmptyData from './isEmptyData.js';
class mergePageData {
    constructor(props){
        this.checkEmpty = new isEmptyData();
        this.originalList = JSON.parse(JSON.stringify(props));
    }
    checkInvalid(val){
        if(((typeof val =='string')&&(val.length==0))||(val==undefined)||(val=='undefined')||(val=='null')||(typeof val=='undefined')||(typeof val=='null')||(val==null)){
            return true;
        }else{
            return false;
        }
    }
    mergeData(options){
        let t = this;
        let pageTotalData = [];
        let originalItemData = t.originalList;
        let groupId = -1;
        let parentStructureId = -1;
        let forDate = (date)=>{
          if(parseInt(date)>=10){
              return date;
          }else{
              return '0'+parseInt(date,10);
          }
        };
        for(let key in originalItemData){
                let componentItem = originalItemData[key];
                if((groupId<0)&&(componentItem.groupId)){
                    groupId = componentItem.groupId;
                }
                if((parentStructureId<0)&&(componentItem.parentId)){
                    parentStructureId = componentItem.parentId;
                }
                let toolType = parseInt(componentItem.structureType,10);
                let dataJson = {};
                let sideType = '';
                if(componentItem.sideType==1||componentItem.sideType==2){
                    sideType = componentItem.sideType;
                }
                switch (toolType) {
                    case 1://单选列表
                        //debugger;
                       // //console.log((componentItem.RadioList[componentItem.index]));
                        dataJson = {
                            "detailId": componentItem.detailId,//详情Id,创建时传空串
                            "fieldId": componentItem.fieldId,//fieldId
                            "content":  (componentItem.RadioList[componentItem.index]&&componentItem.RadioList[componentItem.index].radioId)?componentItem.RadioList[componentItem.index].radioId:'',//用户填写内容或者选择项Id
                            "otherContent": "",//选择项中填写的其他内容
                            "structureId": componentItem.componentId,//节点Id
                            sideType:sideType,
                            "structureType": toolType,//字段类型
                            "parentId": componentItem.parentId,//父节点d
                            "deleteAttachmentIds":"",//删除附件id
                            "validAttachmentIds":"", //有效附件id
                            "refNoteAttachmentIds":""//引用云资料附件id
                        };
                        break;
                    case 2://单选列表-其他
                        let content = '';
                        if(Number(componentItem.index)==-2){
                            content = componentItem.otherRadioId;
                        }else{
                            content = (componentItem.RadioList[componentItem.index]&&componentItem.RadioList[componentItem.index].radioId)?componentItem.RadioList[componentItem.index].radioId:''
                        }
                        dataJson = {
                            "detailId": componentItem.detailId,//详情Id,创建时传空串
                            "fieldId": componentItem.fieldId,//fieldId
                            "content":content,//用户填写内容或者选择项Id
                            "otherContent": componentItem.contentDes,//选择项中填写的其他内容
                            "structureId": componentItem.componentId,//节点Id
                            "structureType": toolType,//字段类型
                            sideType:sideType,
                            "parentId": componentItem.parentId,//父节点d
                            "deleteAttachmentIds":"",//删除附件id
                            "validAttachmentIds":"", //有效附件id
                            "refNoteAttachmentIds":""//引用云资料附件id

                        };
                        break;
                    case 3://多选
                        let checkIdList = '';
                        for(let cIInNum = 0;cIInNum<componentItem.checkBoxList.length;cIInNum++){
                            let innerItem = componentItem.checkBoxList[cIInNum];
                            if(innerItem.checkOnOff){
                                checkIdList+=','+innerItem.checkboxId;
                            }
                        }
                        checkIdList = checkIdList.substring(1,1000000);
                        dataJson = {
                            "detailId": componentItem.detailId,//详情Id,创建时传空串
                            "fieldId": componentItem.fieldId,//fieldId
                            "content": checkIdList,//用户填写内容或者选择项Id
                            "otherContent": "",//选择项中填写的其他内容
                            "structureId": componentItem.componentId,//节点Id
                            "structureType": toolType,//字段类型
                            sideType:sideType,
                            "parentId": componentItem.parentId,//父节点d
                            "deleteAttachmentIds":"",//删除附件id
                            "validAttachmentIds":"", //有效附件id
                            "refNoteAttachmentIds":""//引用云资料附件id

                        };
                        break;
                    case 4://多选-其他
                        let checkIdStr = '';
                        for(let cIInNum = 0;cIInNum<componentItem.checkBoxList.length;cIInNum++){
                            let innerItem = componentItem.checkBoxList[cIInNum];
                            if(innerItem.checkOnOff){
                                checkIdStr+=','+innerItem.checkboxId;
                            }
                        }
                        if(componentItem.otherCheckOnOff){
                            checkIdStr+=','+componentItem.otherCheckId;
                        }
                        checkIdStr = checkIdStr.substring(1,1000000);
                        dataJson = {
                            "detailId": componentItem.detailId,//详情Id,创建时传空串
                            "fieldId": componentItem.fieldId,//fieldId
                            "content": checkIdStr,//用户填写内容或者选择项Id
                            "otherContent": componentItem.contentDes,//选择项中填写的其他内容
                            "structureId": componentItem.componentId,//节点Id
                            "structureType": toolType,//字段类型
                            sideType:sideType,
                            "parentId": componentItem.parentId,//父节点d
                            "deleteAttachmentIds":"",//删除附件id
                            "validAttachmentIds":"", //有效附件id
                            "refNoteAttachmentIds":""//引用云资料附件id

                        };
                        break;
                    case 5://时间控件岁月天，手动输入，拼接的内容
                        let patientAge = '';
                        if(componentItem.contentYear.length>0&&componentItem.contentMonth.length>0&&componentItem.contentYear==0&&componentItem.contentMonth==0){
                            if(t.checkInvalid(componentItem.contentDay)){
                                componentItem.contentDay = 1;
                            }
                        }
                         patientAge = `${(componentItem.contentYear)?(componentItem.contentYear):'0'},${(componentItem.contentMonth)?(forDate(componentItem.contentMonth)):'00'},${(componentItem.contentDay)?(forDate(componentItem.contentDay)):'00'}`;

                        dataJson = {
                            "detailId": componentItem.detailId,//详情Id,创建时传空串
                            "fieldId": componentItem.fieldId,//fieldId
                            "content": patientAge,//用户填写内容或者选择项Id
                            "otherContent": '',//选择项中填写的其他内容
                            "structureId": componentItem.componentId,//节点Id
                            "structureType": toolType,//字段类型
                            "parentId": componentItem.parentId,//父节点d
                            "deleteAttachmentIds":"",//删除附件id
                            "validAttachmentIds":"", //有效附件id
                            "refNoteAttachmentIds":""//引用云资料附件id

                        };
                        break;
                    case 6://时间控件年月日，下拉选择
                        let contentSelect = '';
                        if((componentItem.yearSelect+'').length>0&&(componentItem.monthSelect+'').length>0&&(componentItem.daySelect+'').length>0){
                            contentSelect = componentItem.yearSelect+','+forDate(componentItem.monthSelect)+','+forDate(componentItem.daySelect);
                        }
                        //debugger;
                        dataJson = {
                            "detailId": componentItem.detailId,//详情Id,创建时传空串
                            "fieldId": componentItem.fieldId,//fieldId
                            "content": contentSelect,//用户填写内容或者选择项Id
                            "otherContent": '',//选择项中填写的其他内容
                            "structureId": componentItem.componentId,//节点Id
                            "structureType": toolType,//字段类型
                            "parentId": componentItem.parentId,//父节点d
                            "deleteAttachmentIds":"",//删除附件id
                            "validAttachmentIds":"", //有效附件id
                            "refNoteAttachmentIds":""//引用云资料附件id

                        };
                        break;
                    case 7://时间控件月周天，输入下拉选择月周天
                        let mwdStr = '';
                        if(!(componentItem.index<0)&&!t.checkInvalid(componentItem.contentDes)){
                            mwdStr = `${componentItem.contentDes},${componentItem.InputSelectList[componentItem.index].selectName}`;
                        }
                        dataJson = {
                            "detailId": componentItem.detailId,//详情Id,创建时传空串
                            "fieldId": componentItem.fieldId,//fieldId
                            "content": mwdStr,//用户填写内容或者选择项Id
                            "otherContent": '',//选择项中填写的其他内容
                            "structureId": componentItem.componentId,//节点Id
                            "structureType": toolType,//字段类型
                            "parentId": componentItem.parentId,//父节点d
                            "deleteAttachmentIds":"",//删除附件id
                            "validAttachmentIds":"", //有效附件id
                            "refNoteAttachmentIds":""//引用云资料附件id

                        };
                        break;
                    case 8://文本，数值就是多少字符
                        dataJson = {
                            "detailId": componentItem.detailId,//详情Id,创建时传空串
                            "fieldId": componentItem.fieldId,//fieldId
                            "content": componentItem.contentDes,//用户填写内容或者选择项Id
                            "otherContent": '',//选择项中填写的其他内容
                            "structureId": componentItem.componentId,//节点Id
                            "structureType": toolType,//字段类型
                            sideType:sideType,
                            "parentId": componentItem.parentId,//父节点d
                            "deleteAttachmentIds":"",//删除附件id
                            "validAttachmentIds":"", //有效附件id
                            "refNoteAttachmentIds":""//引用云资料附件id

                        };
                        break;
                    case 9://数值，输入框带单位，数值是控制大小范围
                        dataJson = {
                            "detailId": componentItem.detailId,//详情Id,创建时传空串
                            "fieldId": componentItem.fieldId,//fieldId
                            "content": componentItem.contentDes,//用户填写内容或者选择项Id
                            "otherContent": '',//选择项中填写的其他内容
                            sideType:sideType,
                            "structureId": componentItem.componentId,//节点Id
                            "structureType": toolType,//字段类型
                            "parentId": componentItem.parentId,//父节点d
                            "deleteAttachmentIds":"",//删除附件id
                            "validAttachmentIds":"", //有效附件id
                            "refNoteAttachmentIds":""//引用云资料附件id

                        };
                        break;
                    case 10://视频/图片
                        let deleteAttachmentIds = '';
                        let attRemarks = [];
                        let deleteNum = 0;
                        console.log(componentItem);
                        for(let deletePicNum = 0;deletePicNum<componentItem.deleteAttPicList.length;deletePicNum++){
                            let deletePicItem = componentItem.deleteAttPicList[deletePicNum];
                            deleteAttachmentIds+=","+deletePicItem.id+"@=@"+deleteNum;
                            deleteNum++;
                        }
                        for(let deleteVideoNum = 0;deleteVideoNum<componentItem.deleteAttVideoList.length;deleteVideoNum++){
                            let deleteVideoItem = componentItem.deleteAttVideoList[deleteVideoNum];
                            if(!t.checkInvalid(deleteVideoItem.id)){
                                deleteAttachmentIds+=","+deleteVideoItem.id+"@=@"+deleteNum;
                                deleteNum++;
                            }

                        }

                        let validAttachmentIds = '';
                        let validNum = 0;
                        for(let attVideoNum = 0;attVideoNum<componentItem.attVideoList.length;attVideoNum++){
                            let attVideoItem = componentItem.attVideoList[attVideoNum];
                            let elementOnOff = $("[data-id="+attVideoItem.id+"]").length>0;
                            if((!t.checkInvalid(attVideoItem.id))&&(elementOnOff)&&(!t.checkInvalid(attVideoItem.index))){
                                if(!t.checkInvalid(attVideoItem.remarks)) {
                                    validAttachmentIds+=","+attVideoItem.remarks+"&=&"+attVideoItem.id+"@=@"+attVideoItem.index;
                                }else{
                                    validAttachmentIds+=","+attVideoItem.id+"@=@"+attVideoItem.index;
                                }
                                console.log(attRemarks);
                                validNum++;
                            }

                        }
                        for(let attPicNum = 0;attPicNum<componentItem.attPicList.length;attPicNum++){
                            let attPicItem = componentItem.attPicList[attPicNum];
                            let elementOnOff = $("[data-id="+attPicItem.id+"]").length>0;
                            if((!t.checkInvalid(attPicItem.id))&&(elementOnOff)&&(!t.checkInvalid(attPicItem.index))){

                                if(!t.checkInvalid(attPicItem.remarks)) {
                                    validAttachmentIds+=","+attPicItem.remarks+"&=&"+attPicItem.id+"@=@"+attPicItem.index;
                                }else{
                                    validAttachmentIds+=","+attPicItem.id+"@=@"+attPicItem.index;
                                }
                                validNum++;
                            }

                        }//noteImgList noteVideoList
                        let refNoteAttachmentIds = '';
                        let refNoteNum = 0;
                        for(let noteImgNum = 0;noteImgNum<componentItem.noteImgList.length;noteImgNum++){
                            let noteImgItem = componentItem.noteImgList[noteImgNum];
                            let elementOnOff = $("[data-id="+noteImgItem.id+"]").length>0;
                            if(!t.checkInvalid(noteImgItem.noteId)&&!t.checkInvalid(noteImgItem.id)&&(elementOnOff)&&(!t.checkInvalid(noteImgItem.index))){
                                if(!t.checkInvalid(noteImgItem.remarks)) {
                                    refNoteAttachmentIds+=","+noteImgItem.remarks+"&=&"+noteImgItem.noteId+"@=@"+noteImgItem.id+"@=@"+noteImgItem.index;
                                }else{
                                    refNoteAttachmentIds+=","+noteImgItem.noteId+"@=@"+noteImgItem.id+"@=@"+noteImgItem.index;
                                }
                                refNoteNum++;
                            }

                        }
                        for(let noteVideoNum = 0;noteVideoNum<componentItem.noteVideoList.length;noteVideoNum++){
                            let noteVideoItem = componentItem.noteVideoList[noteVideoNum];
                            let elementOnOff = $("[data-id="+noteVideoItem.id+"]").length>0;
                            if(!t.checkInvalid(noteVideoItem.noteId)&&!t.checkInvalid(noteVideoItem.id)&&(elementOnOff)&&(!t.checkInvalid(noteVideoItem.index))){
                                if(!t.checkInvalid(noteVideoItem.remarks)){
                                    refNoteAttachmentIds+=","+noteVideoItem.remarks+"&=&"+noteVideoItem.noteId+"@=@"+noteVideoItem.id+"@=@"+noteVideoItem.index;
                                }else{
                                    refNoteAttachmentIds+=","+noteVideoItem.noteId+"@=@"+noteVideoItem.id+"@=@"+noteVideoItem.index;
                                }
                                refNoteNum++;
                            }
                        }
                        console.log(attRemarks);
                        dataJson = {
                            "detailId": componentItem.detailId,//详情Id,创建时传空串
                            "fieldId": componentItem.fieldId,//fieldId
                            "content": componentItem.contentDes,//用户填写内容或者选择项Id
                            "otherContent": '',//选择项中填写的其他内容
                            "structureId": componentItem.componentId,//节点Id
                            "structureType": toolType,//字段类型
                            "parentId": componentItem.parentId,//父节点d
                            "deleteAttachmentIds":deleteAttachmentIds.substring(1,1000000),//删除附件id
                            "validAttachmentIds":validAttachmentIds.substring(1,1000000), //有效附件id
                            "refNoteAttachmentIds":refNoteAttachmentIds.substring(1,1000000)//,//,//引用云资料附件id
                            //"attRemarks":attRemarks.length>0?attRemarks:''//相关资料的备注
                        };
                        break;
                }
                if((componentItem.associatedRole&&t.checkEmpty.itemIsEmpty(componentItem))||(parseInt(componentItem.reallyIsValid,10)===0)){
                    continue;
                }else{
                    if(!comm.isEmptyObject(dataJson)){
                        pageTotalData.push(dataJson);
                    }
                }
        }
       // debugger;
        return {
            lockedFlag:options.quiteType,
            updateFlag:1,
            customerId:comm.cookie.get("userId"),
            caseId:sessionStorage.getItem('emrNewCaseCaseId'),//	string	是	病历Id
            visitSiteId:'1',//	string	是	站点Id
            isValid:'1',//	string	是	是否有效0-无效，1-有效
            detailList:pageTotalData,//	string	是	详情数据列表（格式见详细说明）
            groupId:(groupId<0)?'':groupId,//	string	是	分组Id,没有的时候传空串
            parentStructureId:(parentStructureId<0)?'':parentStructureId//	string	是	当前所在一级节点Id
        };
    }
}
export default mergePageData;
