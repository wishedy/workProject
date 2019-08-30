import comm from '~utils/comm.js';
const getters = {
    num(state){
        return state.num;
    },
    baseInfo(state){
        return state.baseInfo;
    },
    titleName(state){
        return state.titleName;
    },
    editType(state){
        return state.editType;
    },
    navHeight(state){
        return state.navHeight;
    },
    CaseId(state){
        return state.CaseId;
    },
    CaseTemBelongType(state){
        return state.CaseTemBelongType;
    },
    numberModuleCount(state){
        return state.numberModuleCount;
    },
    numberList(state){
      return state.numberList;
    },
    numberTrigger(state){
        return state.numberTrigger;
    },
    selectIndexJson(state){
        return state.selectIndexJson;
    },
    templateId(state){
      return state.templateId;
    },
    tabList(state){
        return state.tabList;
    },
    teamId(state){
      return state.teamId;
    },
    changeTemplateIdOnOff(state){
      return state.changeTemplateIdOnOff;
    },
    teamList(state){
      return state.teamList;
    },
    pageIndex(state){
        return state.pageIndex;
    },
    pageInfo(state){
        return state.pageInfo;
    },
    subPageData(state){
        return state.subPageData;
    },
    subIndex(state){
        return state.subIndex;
    },
    changePageOnOff(state){
        return state.changePageOnOff;
    },
    clickNum(state){
        return state.clickNum;
    },
    copyModelData(state){
        return state.copyModelData;
    },
    Relationship(state){
        return state.Relationship;
    },
    layerIndex(state){
        return state.layerIndex;
    },
    canSaveBaseData(state){
        return state.canSaveBaseData;
    },
    CaseDataId(state){
        return state.CaseDataId;
    },
    pushTplate(state){
        return state.pushTplate;
    },
    globalEvent(state){
      return state.globalEvent;
    },
    loadingOnOff(state){
        return state.loadingOnOff;
    },
    wantChangeIndex(state){
        return state.wantChangeIndex;
    },
    saveStatus(state){
        return state.saveStatus;
    },
    isChangeOnOff(state){
        return state.isChangeOnOff;
    },
    isOwner(state){
        return state.isOwner;
    },
    uploadState(state){
        let len = Object.keys(state.uploadState).length;
        let sumLen = 0;
        for(let key in state.uploadState){
            if(state.uploadState[key].status){
                sumLen++;
            }
        }
        return (sumLen==len);
    },
    toastText(state){
        return state.toastText;
    },
    toastState(state){
        return state.toastState;
    },
    ownerCustomerId(state){
        return state.ownerCustomerId;
    },
    isEmptyBase(state){
        return state.isEmptyBase;
    },
    teamCustomerId(state){
        return state.teamCustomerId;
    },
    changeTemplateIdType(state){
        return state.changeTemplateIdType;
    },
    CaseBelongType(state){
        return state.CaseBelongType;
    },
    imageErrorState(state){
        if(comm.isEmptyObject(state.imageErrorState)){
            return false;
        }else{
            let len = Object.keys(state.imageErrorState).length;
            let sumLen = 0;
            for(let key in state.imageErrorState){
                if(!state.imageErrorState[key].status){
                    sumLen++;
                }
            }
            return !(sumLen==len);
        }

    },
    videoErrorState(state){
        if(comm.isEmptyObject(state.imageErrorState)){
            return false;
        }else{
            let len = Object.keys(state.videoErrorState).length;
            let sumLen = 0;
            for(let key in state.videoErrorState){
                if(!state.videoErrorState[key].status){
                    sumLen++;
                }
            }
            return !(sumLen==len);
        }
    },
    isTagChange(state){
        let arrSelect = state.tagIdSelectList.length>0?state.tagIdSelectList.split(','):[];
        let arrBaseSelect = state.baseInfoTagIdSelectList.length>0?state.baseInfoTagIdSelectList.split(','):[];
        if(arrSelect.length!=0&&arrSelect.length!==arrBaseSelect.length){
                return true;
        }else if(arrSelect.length==0&&arrSelect.length==arrBaseSelect.length){
            return false;
        } else{
            let sumLen = 0;
            for(let num = 0;num<arrSelect.length;num++){
                for(let innerNum = 0;innerNum<arrBaseSelect.length;innerNum++){
                    if(arrSelect[num]==arrBaseSelect[innerNum]){
                        sumLen++;
                    }
                }
            }
            return !(sumLen==arrBaseSelect.length);
        }
    },
    templateAssemblePageOnOff(state){
        return state.templateAssemblePageOnOff;
    },
    assistantDoctor(state){
        return state.assistantDoctor;
    },
    customerName(state){
        return state.customerName;
    },
    temTeamData(state){
        return state.temTeamData;
    },
    doctorId(state){
        console.log(state.doctorId);
        return state.doctorId;
    }
};
export default getters;
