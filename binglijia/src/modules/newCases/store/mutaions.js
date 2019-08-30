import MergePageData from '../assemble/mergePageData.js';
import isEmptyData from '../assemble/isEmptyData.js';
import splitPageData from '../assemble/splitPageData.js';
import comm from '~utils/comm.js';
import ChangePageData from '../assemble/changePageData.js';
let checkInvalid=(val)=>{
    if(((typeof val =='string')&&(val.length==0))||(val==undefined)||(val=='undefined')||(val=='null')||(typeof val=='undefined')||(typeof val=='null')||(val==null)){
        return true;
    }else{
        return false;
    }
};
let trim = (s)=>{
    return s.replace(/(^\s*)|(\s*$)/g, "");
};
const mutaions = {
    sendNum(state,num){
        state.num = num;
    },
    saveNavTopHeight(state,heightNum){
        state.navHeight = heightNum;
    },
    getBaseCaseInfo(state,type){
        state.loadingOnOff = true;
        state.changeTemplateIdType = 1;
        comm.ajax2({
            type: 'POST',
            url: '/call/caseFolder/baseinfo/getBaseinfoById/',
            data: {
                paramJson:JSON.stringify(
                    {
                        caseId: state.CaseId

                    })

            },
            success:function(req) {
                    if(req.responseObject.responseStatus){
                        state.loadingOnOff = false;
                    }
                   state.numberList ={};//基本信息页，初始化证件号列表要情况
                    //在获取基本信息的时候包含这个病历使用的模板ID
                    state.templateId = (req.responseObject&&req.responseObject.responseData&&req.responseObject.responseData.data_list)?req.responseObject.responseData.data_list[0].templateId:state.templateId;
                    state.CaseDataId = (req.responseObject&&req.responseObject.responseData&&req.responseObject.responseData.data_list)?req.responseObject.responseData.data_list[0].id:state.id;
                    state.ownerCustomerId = (req.responseObject&&req.responseObject.responseData&&req.responseObject.responseData.data_list)?req.responseObject.responseData.data_list[0].customerId:state.customerId;
                state.doctorId = (req.responseObject&&req.responseObject.responseData&&req.responseObject.responseData.data_list)?req.responseObject.responseData.data_list[0].doctorId:state.doctorId;
                state.teamCustomerId = (req.responseObject&&req.responseObject.responseData&&req.responseObject.responseData.data_list)?req.responseObject.responseData.data_list[0].teamCustomerId:state.teamCustomerId;
                    state.teamId = (req.responseObject&&req.responseObject.responseData&&req.responseObject.responseData.data_list[0])?req.responseObject.responseData.data_list[0].teamId:state.teamId;
                state.CaseBelongType = (req.responseObject&&req.responseObject.responseData&&req.responseObject.responseData.data_list[0])?req.responseObject.responseData.data_list[0].belongType:state.CaseBelongType;
                state.CaseTemBelongType = (req.responseObject&&req.responseObject.responseData&&req.responseObject.responseData.data_list[0])?req.responseObject.responseData.data_list[0].belongType:state.CaseTemBelongType;
                    state.baseInfo = (req.responseObject&&req.responseObject.responseData&&req.responseObject.responseData.data_list)?req.responseObject.responseData.data_list[0]:{};
           }
        });
    },
    emptyNumberList(state){
      state.numberModuleCount = 1;
      state.numberList = {};
    },
    saveEditType(state,type){
      state.editType= parseInt(type,10);
    },
    setTopNavTitle(state,titleName){
        state.titleName = titleName;
    },
    saveCaseDataId(state,id){
        state.CaseDataId = id;
    },
    saveCaseId(state,num){
        sessionStorage.removeItem('emrNewCaseCaseId');
        sessionStorage.setItem('emrNewCaseCaseId',num);
        state.CaseId = num;
    },
    saveTemplateId(state,id){
      state.templateId = id;
    },
    showLayer(state,index){
      ////console.log(index);
      state.layerIndex = index;
    },
    hideLayer(state){
      state.layerIndex = -1;
    },
    saveAssembleData(state,options){
      let t = this;
      state.loadingOnOff = true;
        comm.ajax2({
            url: "/call/caseFolder/case_folder_detail/createBatch/",
            type: "POST",
            data:
                {
                    paramJson: JSON.stringify(options.data)
                },
            success:function(res){
                if(res.responseObject.responseStatus){
                    state.loadingOnOff = false;

                }
                options.callBack&&options.callBack(res);
            }
        });
    },
    changeUploadState(state,opt){
        if(!checkInvalid(opt.HandleId)){
            if(checkInvalid(state.uploadState[opt.HandleId])){
                state.uploadState[opt.HandleId] = {};
                state.uploadState[opt.HandleId].status = opt.status;
            }else{
                state.uploadState[opt.HandleId].status = opt.status;
            }
        }
        //console.log(state.uploadState);
    },
    globalEventActions(state){
        state.globalEvent++;
    },
    toast(state,text){
      state.toastState = true;
      state.toastText = text;
      setTimeout(()=>{
          state.toastState = false;
      },3000);
    },
    changeIndex(state,options){
        let t = mutaions;//uploadState
        let checkError = (list)=>{
            if(comm.isEmptyObject(state[list])){
                return false;
            }else{
                let len = Object.keys(state[list]).length;
                let sumLen = 0;
                for(let key in state[list]){
                    if(!state[list][key].status){
                        sumLen++;
                    }
                }
                return !(sumLen==len);
            }

        };
        //console.log(checkError("videoErrorState"),checkError("imageErrorState"));
        //debugger;
        if(checkError("videoErrorState")||checkError("imageErrorState")){
            if(state.imageErrorState){
                mutaions.toast(state,'图片上传失败');
                return false;
            }
            if(state.videoErrorState){
                mutaions.toast(state,'视频上传失败');
                return false;
            }
        }else{
            let statusUpload = ()=>{
                let len = Object.keys(state.uploadState).length;
                let sumLen = 0;
                for(let key in state.uploadState){
                    if(state.uploadState[key].status){
                        sumLen++;
                    }
                }
                return (sumLen==len);
            };
            if(statusUpload()){
                if(isNaN(options.index)){
                    state.changePageOnOff = t.examinePageData(state);
                    mutaions.clickChangeBtn(state);
                    if(!t.examinePageData(state)){
                        return false;
                    }else{
                        mutaions.filtrateBaseData(state);
                        if(state.pageIndex==-1){
                            let port = '/call/caseFolder/baseinfo/create/';
                            if(state.CaseId>0){
                                port = '/call/caseFolder/baseinfo/update/';
                            }
                            state.loadingOnOff = true;
                            let basePostData = JSON.parse(JSON.stringify(state.canSaveBaseData));
                            basePostData.lockedFlag = 1;
                            basePostData.updateFlag = 1;
                            mutaions.checkChangeState(state,0);
                            if(state.isChangeOnOff){
                                comm.ajax2({
                                    url: "/call/caseFolder/baseinfo/update/",
                                    type: "POST",
                                    data: {
                                        paramJson:JSON.stringify(
                                            {
                                                customerId:comm.cookie.get("userId"),
                                                caseId:state.CaseId,
                                                updateFlag:0,
                                                lockedFlag:1
                                            }
                                        )

                                    },
                                    success:function(res){
                                        if(res&&res.responseObject&&res.responseObject.responseStatus){
                                            if(res.responseObject.responseCode==1302){
                                                state.layerIndex = 2;
                                            }else if(res.responseObject.responseCode==1301||res.responseObject.responseCode==1303){
                                                state.layerIndex = 3;
                                            }else if(res.responseObject.responseCode==0){
                                                mutaions.changeBaseHandleType(state,false);
                                                state.tagIdList = '';
                                                if(!(state.CaseId>0)){
                                                    t.saveBasePageInfo(state,basePostData);
                                                }else{
                                                    t.saveBasePageInfo(state,basePostData);
                                                    if(!(state.templateId>0)){
                                                        state.pushTplate = true;
                                                    }else{
                                                        state.pageIndex++;
                                                    }
                                                }
                                            }
                                        }
                                    }
                                });
                            }else{
                                comm.ajax2({
                                    url: port,
                                    type: "POST",
                                    data:
                                        {
                                            paramJson: JSON.stringify(basePostData)
                                        },
                                    success:function(res){
                                        if(res.responseObject.responseStatus){
                                            state.loadingOnOff = false;
                                        }
                                        if(res.responseObject.responseCode==1302){
                                            state.layerIndex = 2;
                                        }else if(res.responseObject.responseCode==1301||res.responseObject.responseCode==1303){
                                            state.layerIndex = 3;
                                        }else if(res.responseObject.responseCode==0){
                                            state.tagIdList = '';
                                            mutaions.changeBaseHandleType(state,true);
                                            if(!(state.CaseId>0)){
                                                //mutaions.operationLog(state,1);
                                                t.saveBasePageInfo(state,basePostData);
                                            }else{
                                               // mutaions.operationLog(state,3);
                                                state.changeTemplateIdType = 1;
                                                state.templateId = (res.responseObject&&res.responseObject.responseData&&res.responseObject.responseData.data_list)?res.responseObject.responseData.templateId:state.templateId;
                                                state.CaseDataId = (res.responseObject&&res.responseObject.responseData&&res.responseObject.responseData.data_list)?res.responseObject.responseData.id:state.id;
                                                state.ownerCustomerId = (res.responseObject&&res.responseObject.responseData&&res.responseObject.responseData.data_list)?res.responseObject.responseData.customerId:state.customerId;
                                                state.doctorId = (res.responseObject&&res.responseObject.responseData&&res.responseObject.responseData.data_list)?res.responseObject.responseData.doctorId:state.doctorId;
                                                state.teamId = (res.responseObject&&res.responseObject.responseData&&res.responseObject.responseData)?res.responseObject.responseData.teamId:state.teamId;
                                                state.CaseBelongType = (res.responseObject&&res.responseObject.responseData&&res.responseObject.responseData)?res.responseObject.responseData.belongType:state.belongType;
                                                state.CaseTemBelongType = (res.responseObject&&res.responseObject.responseData&&res.responseObject.responseData)?res.responseObject.responseData.belongType:state.CaseTemBelongType;
                                                state.teamCustomerId = (res.responseObject&&res.responseObject.responseData&&res.responseObject.responseData)?res.responseObject.responseData.teamCustomerId:state.teamCustomerId;
                                                t.saveBasePageInfo(state,basePostData);
                                                if(!(state.templateId>0)){
                                                    state.pushTplate = true;
                                                }else{
                                                    state.pageIndex++;
                                                }
                                            }
                                        }

                                    }
                                });
                            }

                        }else{
                            let completeOnOff = false;
                            if(options.pre){
                                (parseInt(state.pageIndex,10)===state.tabList.length-1)?(completeOnOff = true):'';
                            }
                            let mergeData = new MergePageData(state.pageInfo.pageData);
                            mutaions.checkChangeState(state,1);
                            if(state.isChangeOnOff){
                                comm.ajax2({
                                    url: "/call/caseFolder/baseinfo/update/",
                                    type: "POST",
                                    data: {
                                        paramJson:JSON.stringify(
                                            {
                                                customerId:comm.cookie.get("userId"),
                                                caseId:state.CaseId,
                                                updateFlag:0,
                                                lockedFlag:completeOnOff?0:1
                                            }
                                        )

                                    },
                                    success:function(res){
                                        if(res&&res.responseObject&&res.responseObject.responseStatus){
                                            mutaions.hideLoading(state);
                                            switch (parseInt(res.responseObject.responseCode)) {
                                                case 0://未锁定
                                                    mutaions.changeHandleType(state,{
                                                        index:state.pageIndex,
                                                        onOff:false
                                                    });
                                                    if(options.pre){
                                                        (parseInt(state.pageIndex,10)===state.tabList.length-1)?mutaions.operationLog(state,3):'';
                                                        (parseInt(state.pageIndex,10)===state.tabList.length-1)?(window.location.href=`/caseDetails/index.html?caseId=${state.CaseId}&templateId=${state.templateId}`):(state.pageIndex++);
                                                    }else{
                                                        (parseInt(state.pageIndex,10)===-1)?(state.pageIndex=-1):(state.pageIndex--);
                                                    }
                                                    break;
                                                case 1301://正在编辑
                                                case 1303://正在编辑
                                                    state.layerIndex = 3;
                                                    break;
                                                case 1302://异常退出
                                                    state.layerIndex = 2;
                                                    //t.showLayer(4);
                                                    break;
                                            }
                                        }
                                    }
                                });
                            }else{
                                mutaions.saveAssembleData(state,{
                                    data: mergeData.mergeData({quiteType:completeOnOff?0:1}),
                                    callBack(res){
                                        if(res.responseObject.responseCode==1302){
                                            state.layerIndex = 2;
                                        }else if(res.responseObject.responseCode==1301||res.responseObject.responseCode==1303){
                                            state.layerIndex = 3;
                                        }else if(res.responseObject.responseCode==0){
                                            if(res.responseObject.responseStatus){
                                                state.subPageData[state.subIndex] = JSON.parse(JSON.stringify(state.pageInfo.pageData));
                                                mutaions.changeHandleType(state,{
                                                    index:state.pageIndex,
                                                    onOff:true
                                                });
                                                if(options.pre){
                                                    (parseInt(state.pageIndex,10)===state.tabList.length-1)?mutaions.operationLog(state,3):'';
                                                    (parseInt(state.pageIndex,10)===state.tabList.length-1)?(window.location.href=`/caseDetails/index.html?caseId=${state.CaseId}&templateId=${state.templateId}`):(state.pageIndex++);
                                                }else{
                                                    (parseInt(state.pageIndex,10)===-1)?(state.pageIndex=-1):(state.pageIndex--);
                                                }
                                            }
                                        }
                                    }
                                });
                            }

                        }
                    }
                }else{
                    state.pageIndex = options.index;
                }
            }else{
                mutaions.toast(state,'您有内容正在上传中，请稍后');
            }
        }
    },
    templateIdType(state,type){
      state.changeTemplateIdType = type;
    },
    saveTagId(state,id){

      if(id.length===0){
          state.tagIdList = '';
      }else{

          state.tagIdList+=','+id;
      }
    },
    changeTemplateId(state,status){
        state.changeTemplateIdOnOff = status;
    },
    saveIndexSubPageData(state){
        state.subPageData[state.subIndex] = state.pageInfo.pageData;
    },
    updateTagId(state,id){
      let str = '';
      let idList = state.tagIdList.length>0?state.tagIdList.split(','):[];
      for(let num = 0;num<idList.length;num++){
          if(idList[num]&&idList[num]!=id){
              str+=','+idList[num];
          }
      }
        state.tagIdList = str;
    },
    savePageData(state,data){
        //console.log(data);
        state.pageInfo.pageData = data;
        //console.log(state.pageInfo);
    },
    clickChangeBtn(state){
        state.clickNum++;
    },
    wantChangePageIndex(state,index){
        state.wantChangeIndex = index;
    },
    examineBasePageData(state){//所有数据的对错都可以判断
      state.changePageOnOff = mutaions.examinePageData(state);
      //debugger;
    },
    examinePageData(state){
        let t = mutaions;
        let data = state.pageInfo.pageData;
        let examineResult = true;
        for(let key in data){
            if(data[key].testResult===0){//操作过错误的直接返回false
                examineResult = false;
                break;
            }else{//没操作过，但是是必填项，没填内容返回false
                switch (parseInt(data[key].componentType)){
                    case 0:
                        if(parseInt(data[key].isRequired,10)===1){
                            examineResult = !(checkInvalid(data[key].contentDes));
                        }
                        break;
                    case 1:
                        if(parseInt(data[key].isRequired,10)===1){
                            examineResult = !(Number(data[key].index)===-1);
                        }
                        break;
                    case 11:

                        break;
                    case 2:
                    case 3:
                        if(parseInt(data[key].isRequired,10)===1){
                            examineResult = (!(Number(data[key].index)===-1))||(!(data[key].contentDes.length===0));
                        }
                        break;
                    case 4:
                        if(parseInt(data[key].isRequired,10)===1){

                            examineResult = !((data[key].contentYear.length===0)&&(data[key].contentMonth.length===0)&&(data[key].contentDay.length===0));
                        }
                        break;
                    case 5:
                        if(parseInt(data[key].isRequired,10)===1){
                            examineResult = (!((data[key].yearSelect.length===0)&&data[key].monthSelect.length===0)&&data[key].daySelect.length===0);
                        }
                        break;
                    case 6:
                        if(parseInt(data[key].isRequired,10)===1){
                        if(parseInt(data[key].needInput,10)===1){
                            (data[key].contentDes.length===0)?(examineResult=false):(examineResult = (!(Number(data[key].index)===-1)));
                        }else{
//                            debugger;
                            examineResult = (!(Number(data[key].index)===-1));
                        }
                      }
                        break;
                    case 7:
                        let checkLen = 0;
                        for(let i = 0;i<data[key].checkBoxList.length;i++){
                            data[key].checkBoxList[i].checkOnOff?checkLen++:'';
                        }
                        if(parseInt(data[key].isRequired,10)===1) {
                            if (parseInt(data[key].needInput, 10) === 1) {
                                (data[key].contentDes&&data[key].contentDes.length === 0) ? (examineResult = false) : (examineResult = (!(checkLen==0)));
                            } else {
                                (examineResult = (!(checkLen==0)));
                            }
                        }
                        break;
                    case 8:
                        if(parseInt(data[key].isRequired,10)===1){
                            examineResult = !(data[key].contentDes&&data[key].contentDes.length===0);
                        }
                        break;
                    case 12:
                        if(parseInt(data[key].isRequired,10)===1){
                            examineResult = (data[key].contentDes&&data[key].radioIndex==0);
                            if(!examineResult){
                                if((data[key].contentDes&&data[key].radioIndex==1)){
                                    examineResult = (data[key].contentDes&&data[key].selectIndex>=0);
                                }
                            }
                        }
                        break;
                }
                if(!examineResult){
                    //console.log(data[key].componentType);
                    break;
                }
            }
        }
        state.changePageOnOff = examineResult;
        return examineResult;
    },
    saveBasePageInfo(state,data){
        let t = mutaions;
        state.baseInfo = data;
    },
    showLoading(state){
        state.loadingOnOff = true;
    },
    hideLoading(state){
        state.loadingOnOff = false;
    },
    changeSaveStatus(state,status){
      state.saveStatus = status;
    },
    saveBaseInfoTagIdSelectList(state,opt){
      if(opt.type=='clear'){
          state.baseInfoTagIdSelectList = '';
          state.tagIdSelectList = '';
      }else if(opt.type=='add'){
          if(state.baseInfoTagIdSelectList.length>0){
              state.baseInfoTagIdSelectList+=','+opt.tagId;
              state.tagIdSelectList+=','+opt.tagId;
          }else{
              state.baseInfoTagIdSelectList+=opt.tagId;
              state.tagIdSelectList+=opt.tagId;
          }

      }
    },
    saveTagIdSelectList(state,opt){
        let arr = state.tagIdSelectList.length>0?JSON.parse(JSON.stringify(state.tagIdSelectList.split(','))):[];
      if(opt.type==='delete'){
          let str = '';
          for(let num = 0;num<arr.length;num++){
              if(arr[num]!=opt.tagId){
                  if(str.length==0){
                      str+=opt.tagId;
                  }else{
                      str+=','+opt.tagId;
                  }

              }else{
                  continue;
              }
          }
          state.tagIdSelectList = str;
      }else{
          state.tagIdSelectList.length>0?state.tagIdSelectList+=','+opt.tagId:state.tagIdSelectList+=opt.tagId;
      }
    },
    checkChangeBaseData(state){
      let t = this;
        let dataJson = state.pageInfo.pageData;
        let  bassInfo = state.baseInfo;
        mutaions.filtrateBaseData(state);//从基本信息接口拉取得数据
        let data = state.canSaveBaseData;//当前页面操作出来的数据
        console.log(data,dataJson,bassInfo);
        let sumLen = Object.keys(state.pageInfo.pageData).length;
        let checkLen = 0;
        let emptyLen =0;
        for(let key in dataJson){
            let checkOnOff = false;
            if(dataJson[key].labelName=='姓名'){
                checkOnOff = (data.patientName == bassInfo.patientName);
                if(!checkInvalid(data.patientName)){
                    emptyLen++;
                }
            }
            if(dataJson[key].labelName=='年龄'){
                checkOnOff = (data.patientAge == bassInfo.patientAge);
                let ageArr = data.patientAge.split(',');
                if(parseInt(ageArr[0])>0||(parseInt(ageArr[1])>0)||(parseInt(ageArr[2])>0)){
                    emptyLen++;
                }
            }
            if(dataJson[key].labelName=='性别'){
                checkOnOff = (data.patientSex == bassInfo.patientSex);
                if(!data.patientSex<0){
                    emptyLen++;
                }
            }
            if(dataJson[key].labelName=='电话'){
                checkOnOff = (data.patientMobile == bassInfo.patientMobile);
                if(!checkInvalid(data.patientMobile)){
                    emptyLen++;
                }
            }
            let checkNumberList = (itemData,num)=>{
                let checkResult = true;
                let numberType = parseInt(itemData.index+1);
                let numberContent =itemData.contentDes;
                    if(bassInfo.numberList&&bassInfo.numberList.length>0&&bassInfo.numberList[num]){

                        checkResult = (numberType == bassInfo.numberList[num].numberType&&
                            numberContent == bassInfo.numberList[num].numberContent);
                    }else{
                        checkResult = checkInvalid(numberContent);
                    }
                    return checkResult;
               };
            if(dataJson[key].labelName=='编号1'){
                checkOnOff = checkNumberList(dataJson[key],0);
                if(!checkInvalid(data.numberContent)){
                    emptyLen++;
                }
            }
            if(dataJson[key].labelName=='编号2'){
                checkOnOff = checkNumberList(dataJson[key],1);
                if(!checkInvalid(data.numberContent)){
                    emptyLen++;
                }
            }
            if(dataJson[key].labelName=='编号3'){
                checkOnOff = checkNumberList(dataJson[key],2);
                console.log(dataJson[key],checkOnOff);
                if(!checkInvalid(data.numberContent)){
                    emptyLen++;
                }
            }
            if(dataJson[key].labelName=='编号4'){
                checkOnOff = checkNumberList(dataJson[key],4);
                if(!checkInvalid(data.numberContent)){
                    emptyLen++;
                }
            }
            if(dataJson[key].labelName=='编号5'){
                checkOnOff = checkNumberList(dataJson[key],5);
                if(!checkInvalid(data.numberContent)){
                    emptyLen++;
                }
            }
            if((dataJson[key].radioLabelName)&&(dataJson[key].radioLabelName)=='归属'){
                checkOnOff = (data.CaseTemBelongType==0)?(data.CaseTemBelongType == bassInfo.belongType):(data.CaseTemBelongType == bassInfo.belongType)&&(data.teamId == bassInfo.teamId)&&(data.doctorId == bassInfo.doctorId);
                if((!checkInvalid(data.teamId))&&(data.belongType==1)&&(!checkInvalid(data.doctorId))){
                    emptyLen++;
                }
            }
            if(dataJson[key].componentType==11){
                let checkArr = [];
                checkArr = (state.tagIdList.substring(1,1000000).length>0)?state.tagIdList.substring(1,1000000).split(','):[];
                checkOnOff = (checkArr.length===0&&!mutaions.isTagChange(state));
                //console.log(checkArr.length===0,mutaions.isTagChange(state));
                if(checkArr.length>0){
                    emptyLen++;
                }

            }
            if(checkOnOff){
                checkLen++;
            }
        }
        state.isEmptyBase = emptyLen>0;
        console.log(checkLen+"=="+sumLen);
        state.isChangeOnOff = (checkLen==sumLen);
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
                let sameHasOnOff = false;
                for(let innerNum = 0;innerNum<arrBaseSelect.length;innerNum++){
                    if(arrSelect[num]==arrBaseSelect[innerNum]){
                        sameHasOnOff = true;

                    }
                }
                if(sameHasOnOff){
                    sumLen++;
                }
            }
            return !(sumLen==arrBaseSelect.length);
        }
    },
    checkChangeState(state,type){
      let t = this;
      if(type==0){
          mutaions.checkChangeBaseData(state);
      }else{
          let CheckChange = new ChangePageData({nowData:state.pageInfo.pageData,lastData:state.subPageData[state.subIndex]});
//          debugger;
          state.isChangeOnOff =CheckChange.comparisonChange();
          //debugger;
          //console.log('change');
      }
    },
    filtrateBaseData(state){
      let t = this;
        let forDate = (date)=>{
            if(parseInt(date)>10){
                return date;
            }else{
                return '0'+parseInt(date,10);
            }
        };
        let data = {
            caseId:(state.CaseId)>0?state.CaseId:'',
            patientName:"",//	string	是	病历名称		王二狗
            patientAge:"",//	string	是	年龄		17
            patientSex:"",//	string	是	性别		1
            patientMobile:"",//	string	是	患者手机号		15187609251
            numberType:"",//	string	是	编号类型		4
            numberContent:"",//	string	是	编号内容		110101199101013726
            belongType:"",//	string	是	病历所属（0：个人，1：团队）		1
            teamId:'',//string	是	团队id		1321112345
            customerId:comm.cookie.get("userId"),//	string	是	用户id		987654567
            tagIdList:"",//	string	是	标签id		2,3,23,39
            visitSiteId:"1",//	string	是	来源站点		1
            patientId:'',
            // creatorId:comm.cookie.get("userId"),
            creatorId:state.baseInfo.creatorId?state.baseInfo.creatorId:comm.cookie.get("userId"),//若接口返回创建者id，代表已经有人创建过该病例，则不再取用户id
            doctorId:'',
            "updateFlag":1
        };
        let dataJson = state.pageInfo.pageData
        let numberList = [];
        for(let key in dataJson){
            if(dataJson[key].labelName=='姓名'){
                //debugger;
                data.patientName = dataJson[key].contentDes;
            }
            if(dataJson[key].labelName=='年龄'){
                if(dataJson[key].contentYear.length>0&&dataJson[key].contentYear==0&&dataJson[key].contentMonth.length>0&&dataJson[key].contentMonth==0){
                    if(checkInvalid(dataJson[key].contentDay)){
                        dataJson[key].contentDay = 1;
                    }

                }
                data.patientAge = `${(dataJson[key].contentYear)?(dataJson[key].contentYear):'0'},${(dataJson[key].contentMonth)?(forDate(dataJson[key].contentMonth)):'00'},${(dataJson[key].contentDay)?(forDate(dataJson[key].contentDay)):'00'}`
            }
            if(dataJson[key].labelName=='性别'){
                data.patientSex = dataJson[key].index>0?0:1;
            }
            if(dataJson[key].labelName=='电话'){
                data.patientMobile = (dataJson[key].contentDes)?(dataJson[key].contentDes):'';
            }
            if(dataJson[key].labelName=='编号1'){
                data.numberType = (parseInt(dataJson[key].index)+1);
                data.numberContent = dataJson[key].contentDes;
            }
            if((dataJson[key].labelName).indexOf("编号")>-1){
                if(!checkInvalid(trim(dataJson[key].contentDes))){
                    let json = {
                        "numberType":(parseInt(dataJson[key].index)+1),
                        "numberId":checkInvalid(dataJson[key].numberId)?'':dataJson[key].numberId,
                        "numberContent":trim(dataJson[key].contentDes)
                    }
                    numberList.push(json);
                }
            }
            if((dataJson[key].radioLabelName)&&(dataJson[key].radioLabelName)=='归属'){
                data.belongType = dataJson[key].radioIndex;
                if(data.belongType==0){//归属于自己
                    data.doctorId=comm.cookie.get("userId");
                }else {
                    data.doctorId = dataJson[key]['doctorId'];
                }

                if(parseInt(dataJson[key].selectIndex,10)>=0){
                    let list = dataJson[key].SelectList;
                    for(let i = 0;i<list.length;i++){
                        if(i==parseInt(dataJson[key].selectIndex,10)){
                            if(data.belongType!=0){
                                data.teamId = list[i].selectId;
                            }
                        }
                    }
                }
            }
            if(dataJson[key].componentType==11){
                /*let tagIdList = '';
                let defaultArr = JSON.parse(dataJson[key].defaultTagList);
                if(state.CaseId>0){
                    tagIdList+=","+state.tagIdList.substring(1,1000000);
                    for(let deNum = 0;deNum<defaultArr.length;deNum++){
                        if(defaultArr[deNum].selectOnOff&&defaultArr[deNum].id&&defaultArr[deNum].id>0){
                            tagIdList+=","+defaultArr[deNum].id;
                        }
                    }
                }else{
                    let arr = JSON.parse(dataJson[key].contentTagList);
                    let defaultArr = JSON.parse(dataJson[key].defaultTagList);
                    for(let i = 0;i<arr.length;i++){
                        if(arr[i].isSelect){
                            tagIdList+=","+arr[i].tagId;
                        }
                    }
                    for(let deNum = 0;deNum<defaultArr.length;deNum++){
                        if(defaultArr[deNum].addTag){
                            tagIdList+=","+defaultArr[deNum].tagId;
                        }
                    }
                }*/
                if(state.CaseId>0){
                    data.tagIdList = state.tagIdList.substring(1,1000000);
                }else{
                    data.tagIdList = state.tagIdSelectList;
                }
            }
        }
        data.numberList = numberList;
        state.canSaveBaseData = data;
        return data;
    },
    changeNumberModuleCount(state){
        state.numberModuleCount<6?state.numberModuleCount++:state.numberModuleCount=5;
    },
    setNumberModuleCount(state,num){
      state.numberModuleCount = num;
    },
    changeNumberTrigger(state){
      state.numberTrigger++;
    },
    changeNumberList(state,options){
      state.numberList[options['HandleId']] = options.componentData;
    },
    changeComponentData(state,config){
        if(state.pageInfo&&state.pageInfo.pageData&&state.pageInfo.pageData[config.HandleId]){
            switch (parseInt(state.pageInfo.pageData[config.HandleId].componentType,10)){
                case 0:
                    //console.log('在修改input输入');
                    state.pageInfo.pageData[config.HandleId].contentDes = config.contentDes;
                    break;
                case 8:
                    //console.log('在修改文本域输入');
                    state.pageInfo.pageData[config.HandleId].contentDes = config.contentDes;
                    break;
                case 1:
                    //console.log('在修改下拉框');
                    state.pageInfo.pageData[config.HandleId].index = config.index;
                    break;
                case 2:
                    //console.log('修改选择输入');
                    state.pageInfo.pageData[config.HandleId].index = config.index;
                    state.pageInfo.pageData[config.HandleId].contentDes = config.contentDes;
                    let isBaseInfoChange = (!checkInvalid(state.pageInfo.pageData[config.HandleId].inBaseInfoPage))&&(parseInt(state.pageInfo.pageData[config.HandleId].inBaseInfoPage,10)===1);
                    if(isBaseInfoChange){
                        mutaions.changeNumberList(state,{
                            HandleId:config.HandleId,
                            componentData:state.pageInfo.pageData[config.HandleId]
                        });
                    }
                    break;
                case 3:
                    //console.log('修改输入选择');
                    state.pageInfo.pageData[config.HandleId].index = config.index;
                    state.pageInfo.pageData[config.HandleId].contentDes = config.contentDes;
                    //console.log(state.pageInfo.pageData[config.HandleId],state.pageInfo.pageData[config.HandleId].contentDes);
                    break;
                case 4:
                    //console.log('在修改年龄');
                    state.pageInfo.pageData[config.HandleId].contentYear = config.contentYear;
                    state.pageInfo.pageData[config.HandleId].contentMonth = config.contentMonth;
                    state.pageInfo.pageData[config.HandleId].contentDay = config.contentDay;
                    break;
                case 5:
                    //console.log('在修改下拉时间选择');
                    state.pageInfo.pageData[config.HandleId].yearSelect = config.yearSelect;
                    state.pageInfo.pageData[config.HandleId].monthSelect = config.monthSelect;
                    state.pageInfo.pageData[config.HandleId].daySelect = config.daySelect;
                    ////console.log(state.pageInfo.pageData[config.HandleId]);
                    break;
                case 6:
                    //console.log('修改单选');
                    state.pageInfo.pageData[config.HandleId].index = config.index;
                    state.pageInfo.pageData[config.HandleId].contentDes = config.contentDes;
                    break;
                case 7:
                    //console.log('修改多选');
                    if(config.checkBoxList){
                        state.pageInfo.pageData[config.HandleId].checkBoxList = config.checkBoxList;
                    }
                    if((typeof config.otherCheckOnOff)==='boolean'){
                        state.pageInfo.pageData[config.HandleId].otherCheckOnOff = config.otherCheckOnOff;
                    }
                    state.pageInfo.pageData[config.HandleId].contentDes = config.contentDes;
                    break;
                case 11:
                    //console.log('修改标签输入项');
                    if(config.contentTagList){
                        state.pageInfo.pageData[config.HandleId].contentTagList = config.contentTagList;
                    }else if(config.defaultTagList){
                        //console.log('修改了默认标签'+config.defaultTagList);
                        state.pageInfo.pageData[config.HandleId].defaultTagList = config.defaultTagList;
                    }
                    break;
                case 12://单选联动下拉框
                    //console.log('修改单选联动下拉框');
                    if(!isNaN(config.doctorId)){
                        state.pageInfo.pageData[config.HandleId].doctorId = config.doctorId;
                        console.log(state.pageInfo.pageData[config.HandleId].doctorId);
                    }
                    if(!isNaN(config.selectIndex)){
                        state.pageInfo.pageData[config.HandleId].selectIndex = config.selectIndex;
                    }
                    if(!isNaN(config.radioIndex)){
                        state.pageInfo.pageData[config.HandleId].radioIndex = config.radioIndex;
                    }
                    //console.log(config.SelectList);
                    if(config.SelectList){
                        state.pageInfo.pageData[config.HandleId].SelectList = config.SelectList;
                    }
                    break;
                case 13://图片视频数据更改
                    let picList = state.pageInfo.pageData[config.HandleId].attPicList;
                    let videoList = state.pageInfo.pageData[config.HandleId].attVideoList;
                    let noteImgList = state.pageInfo.pageData[config.HandleId].noteImgList;
                    let noteVideoList = state.pageInfo.pageData[config.HandleId].noteVideoList;
                    let resultArr = {};
                    let distinct = (listData)=>{
                        let arr = JSON.parse(JSON.stringify(listData));
                        let i;
                        let obj = {};
                        let result = [];
                        let len = arr.length;
                        if(len){
                            for(i = 0; i< len; i++){
                                if((arr[i])&&(!obj[arr[i].id])){ //如果能查找到，证明数组元素重复了
                                    obj[arr[i].id] = 1;
                                    result.push(arr[i]);
                                }
                            }
                        }
                        return result;
                    };
                    let handleFun = (primitive,ultramodern,operate)=>{
                            let copyList = JSON.parse(JSON.stringify(primitive));
                            let deleteContainer = [];
                            let handleContainer = [] ;
                            ////console.log(primitive,ultramodern,operate);
                            if(operate){//添加
                                for(let ulNum = 0;ulNum<ultramodern.length;ulNum++){
                                    copyList.push(ultramodern[ulNum]);
                                }
                                resultArr = {
                                    addData:copyList
                                };
                            }else{//删除
                                //debugger;
                                    for(let innerNum = 0;innerNum<copyList.length;innerNum++){
                                        let deleteOnOff = true;
                                        for(let num = 0;num<ultramodern.length;num++){
                                            if(parseInt(ultramodern[num].id,10)==parseInt(copyList[innerNum].id,10)){
                                                deleteOnOff = false;
                                                deleteContainer.push(ultramodern[num]);
                                            }
                                        }
                                        if(deleteOnOff){
                                            handleContainer.push(copyList[innerNum]);
                                        }
                                    }
                                    resultArr = {
                                        addData:distinct(handleContainer),
                                        deleteData:deleteContainer
                                    };

                            }
                            return resultArr;
                    };
                    if(parseInt(config.handleType,10)){
                        //添加图片或视频资源
                        if(parseInt(config.handleContent,10)===1){
                            //添加视频资源
                            state.pageInfo.pageData[config.HandleId].attVideoList = distinct(handleFun(videoList,config.handleList,1).addData);
                        }else if(parseInt(config.handleContent,10)===0){
                            //添加图片资源
                            state.pageInfo.pageData[config.HandleId].attPicList = distinct(handleFun(picList,config.handleList,1).addData);
                        }else if(parseInt(config.handleContent,10)===2){
                            //添加云资料图片
                            state.pageInfo.pageData[config.HandleId].noteImgList = distinct(config.handleList);
                        }else if(parseInt(config.handleContent,10)===3){
                            //添加云资料视频
                            state.pageInfo.pageData[config.HandleId].noteVideoList = distinct(config.handleList);
                        }
                    }else{
                        //删除图片或视频资源
                        if(parseInt(config.handleContent,10)===1){
                            //删除视频资源
                            state.pageInfo.pageData[config.HandleId].attVideoList = distinct(handleFun(videoList,config.handleList,0).addData);
                            state.pageInfo.pageData[config.HandleId].deleteAttVideoList = distinct(state.pageInfo.pageData[config.HandleId].deleteAttVideoList.concat(handleFun(videoList,config.handleList,0).deleteData));
                        }else if(parseInt(config.handleContent,10)===0){
                            //删除图片资源
                            state.pageInfo.pageData[config.HandleId].attPicList = distinct(handleFun(picList,config.handleList,0).addData);
                            state.pageInfo.pageData[config.HandleId].deleteAttPicList = distinct(state.pageInfo.pageData[config.HandleId].deleteAttPicList.concat(handleFun(picList,config.handleList,0).deleteData));
                        }
                    }
                    if(parseInt(config.handleContent,10)===4){
                        state.pageInfo.pageData[config.HandleId].contentDes = config.contentDes;
                    }
                    let changeRemarks = (id,remark,list)=>{
                        let originalList = JSON.parse(JSON.stringify(list));
                        for(let num = 0;num<originalList.length;num++){
                            if(parseInt(originalList[num]['id'],10)===parseInt(id,10)){
                                if(checkInvalid(originalList[num]['remarks'])){
                                    originalList[num]['remarks'] = remark;
                                }else{
                                    if(originalList[num]['remarks']!==remark){
                                        originalList[num]['remarks']=remark;
                                    }
                                }
                            }
                        }
                        return originalList;
                    };//noteImgList attVideoList attPicList noteVideoList
                    if(parseInt(config.handleContent,10)===5){
                        let remarksJson = config.remarksJson;
                        if(!checkInvalid(remarksJson.noteid)){
                            //note
                            if((parseInt(remarksJson.attType)===1)){
                                state.pageInfo.pageData[config.HandleId]['noteImgList'] = changeRemarks(remarksJson.id,remarksJson.val,state.pageInfo.pageData[config.HandleId]['noteImgList'])
                            }else{
                                state.pageInfo.pageData[config.HandleId]['noteVideoList'] = changeRemarks(remarksJson.id,remarksJson.val,state.pageInfo.pageData[config.HandleId]['noteVideoList'])
                            }
                        }else{
                            //非note
                            if((parseInt(remarksJson.attType)===1)){
                                state.pageInfo.pageData[config.HandleId]['attPicList'] = changeRemarks(remarksJson.id,remarksJson.val,state.pageInfo.pageData[config.HandleId]['attPicList'])
                            }else{
                                state.pageInfo.pageData[config.HandleId]['attVideoList'] = changeRemarks(remarksJson.id,remarksJson.val,state.pageInfo.pageData[config.HandleId]['attVideoList'])
                            }
                        }
                    }
                    ////console.log(state.pageInfo.pageData[config.HandleId]);
                    break;
            }
        }

    },
    changeTemTeam(state,data){
     state.temTeamData =  data;
    },
    getTeamList(state,callBack){
        comm.ajax2({
            url: "/call/caseFolder/team_baseinfo/getMapListByCustomerId/",
            type: "POST",
            data: {
                paramJson: JSON.stringify({
                    customerId: comm.cookie.get("userId"),
                    doctorId:state.doctorId
                })
            },
            success:function(res){
                console.log(res);
                state.teamList = (res.responseObject&&res.responseObject.responseData&&res.responseObject.responseData['data_list'])?res.responseObject.responseData['data_list']:[];
                callBack&&callBack();
            }
        });
    },
    changeComponentTestResult(state,config){
        if(config.HandleId>0&&state.pageInfo.pageData[config.HandleId]){
            state.pageInfo.pageData[config.HandleId].testResult = config.testResult;
        }
    },
    getTabList(state){
        comm.ajax2({
            url: "/call/caseFolder/template_structure/getTemplateDataList/",
            type: "POST",
            data: {
                paramJson: JSON.stringify({
                    templateId:state.templateId,
                    caseId:state.CaseId,
                    visitSiteId:1,
                    customerId:comm.cookie.get("userId")
                })
            },
            success:function(res){
                if(res.responseObject&&res.responseObject.responseData&&res.responseObject.responseData.data_list){
                    let list = res.responseObject.responseData.data_list[0];
                    let lastList = [];
                    for(let i = 0;i<list.length;i++){
                        let dataItem = list[i].caseFolderTemplate;
                        let json = {
                            "id":dataItem.id,
                            "treeLevel": dataItem.treeLevel,
                            "isAdd": dataItem.isCopy,
                            "menuId": dataItem.structureId,
                            "clinicalId": dataItem.fullPath,
                            "menuName": dataItem.structureName,
                            "handleOnOff":false
                        };
                        lastList.push(json);
                    }
                    //console.log(lastList);
                    state.tabList = lastList;
                }
            }
        });
    },
    changeHandleType(state,option){
        option.index>=0?(state.tabList[option.index].handleOnOff = option.onOff):'';
    },
    addSubPage(state){
      let emptyPageData = new isEmptyData(state.pageInfo.pageData);
      mutaions.examinePageData(state);
      state.clickNum++;
      let addSubPageFun=()=>{
          state.subPageData[state.subIndex] = JSON.parse(JSON.stringify(state.pageInfo.pageData));//在这里保存左侧边栏tab数据这时候需要做一个判断，判断当前页面数据是不是空值，如果不是需要保存数据
          let createNewSubPageData = (data)=>{
              let oriData = JSON.parse(JSON.stringify(data));
              let resultArr = [];
              for(let num = 0;num<oriData.length;num++){
                  let IsEmptyData = new isEmptyData(oriData[num]);
                  let isEmptyOnOff = IsEmptyData.isEmpty();
                  if(isEmptyOnOff){
                      continue;
                  }else{
                      resultArr.push(oriData[num]);
                  }
              }
              return resultArr;
          };
          state.subPageData = createNewSubPageData(state.subPageData);
          let SplitPageData = new splitPageData(state.copyModelData);
          mutaions.addSubPageData(state,SplitPageData.splitData());
          if(state.subIndex==state.subPageData.length-1){
              state.subIndex = state.subPageData.length-1;
          }else{
              state.subIndex++;
          }
          setTimeout(()=>{
              state.subIndex = 0;
          },100);
      };
      if(!emptyPageData.isEmpty()&&state.changePageOnOff){
          mutaions.checkChangeState(state,1);
          let mergeData = new MergePageData(state.pageInfo.pageData);
          if(state.isChangeOnOff){
              comm.ajax2({
                  url: "/call/caseFolder/baseinfo/update/",
                  type: "POST",
                  data: {
                      paramJson:JSON.stringify(
                          {
                              customerId:comm.cookie.get("userId"),
                              caseId:state.CaseId,
                              updateFlag:0,
                              lockedFlag:1
                          }
                      )

                  },
                  success:function(res){
                      if(res&&res.responseObject&&res.responseObject.responseStatus){
                          mutaions.hideLoading(state);
                          switch (parseInt(res.responseObject.responseCode)) {
                              case 0://未锁定
                                  addSubPageFun();
                                  break;
                              case 1301://正在编辑
                              case 1303://正在编辑
                                  state.layerIndex = 3;
                                  break;
                              case 1302://异常退出
                                  state.layerIndex = 2;
                                  //t.showLayer(4);
                                  break;
                          }
                      }
                  }
              });
          }else{
              mutaions.saveAssembleData(state,{
                  data: mergeData.mergeData({quiteType:1}),
                  callBack(res){
                      if(res.responseObject.responseCode==1302){
                          state.layerIndex = 2;
                      }else if(res.responseObject.responseCode==1301||res.responseObject.responseCode==1303){
                          state.layerIndex = 3;
                      }else if(res.responseObject.responseCode==0){
                          if(res.responseObject.responseStatus){
                              addSubPageFun();
                              /*state.subIndex = -1;
                              state.subIndex = 0;*/
                          }
                      }
                  }
              });
          }

      }
    },
    saveSubPageData(state,data){
        state.subPageData = data;
    },
    saveCopyModelData(state,data){
      state.copyModelData = data;
    },
    addSubPageData(state,data){
      state.subPageData =  data.concat(state.subPageData);
    },
    initUploadState(state){
      state.imageErrorState = {};
      state.videoErrorState = {};
    },
    changeUploadError(state,opt){
        if(opt.type==='image'){
            //console.log(opt.status);
            if(!checkInvalid(opt.HandleId)){
                if(checkInvalid(state.imageErrorState[opt.HandleId])){
                    state.imageErrorState[opt.HandleId] = {
                        type:'image'
                    };
                    state.imageErrorState[opt.HandleId].status = opt.status;
                }else{
                    state.imageErrorState[opt.HandleId].status = opt.status;
                }
            }
            //console.log(state.imageErrorState);
            //state.imageErrorState = opt.status;
        }else{
            if(!checkInvalid(opt.HandleId)){
                if(checkInvalid(state.videoErrorState[opt.HandleId])){
                    state.videoErrorState[opt.HandleId] = {
                        type:'video'
                    };
                    state.videoErrorState[opt.HandleId].status = opt.status;
                }else{
                    state.videoErrorState[opt.HandleId].status = opt.status;
                }
            }
            //console.log(state.videoErrorState);
            //state.videoErrorState = opt.status;
        }
    },
    changeAssemblePage(state,status){
      state.templateAssemblePageOnOff = status;
    },
    changeSubIndex(state,options){
        if(options.index<0){
            return;
        }else if(options.set){
            state.subPageData[state.subIndex] = JSON.parse(JSON.stringify(state.pageInfo.pageData));//在这里保存左侧边栏tab数据这时候需要做一个判断，判断当前页面数据是不是空值，如果不是需要保存数据
            state.subIndex = options.index;
        }else{
            //let emptyPageData = new isEmptyData(state.pageInfo.pageData);
            mutaions.examinePageData(state);
            mutaions.checkChangeState(state,1);
            state.clickNum++;
            if(state.changePageOnOff) {
                let mergeData = new MergePageData(state.pageInfo.pageData);
                if(state.isChangeOnOff){
                    comm.ajax2({
                        url: "/call/caseFolder/baseinfo/update/",
                        type: "POST",
                        data: {
                            paramJson:JSON.stringify(
                                {
                                    customerId:comm.cookie.get("userId"),
                                    caseId:state.CaseId,
                                    updateFlag:0,
                                    lockedFlag:1
                                }
                            )

                        },
                        success:function(res){
                            if(res&&res.responseObject&&res.responseObject.responseStatus){
                                mutaions.hideLoading(state);
                                switch (parseInt(res.responseObject.responseCode)) {
                                    case 0://未锁定
                                        state.subPageData[state.subIndex] = JSON.parse(JSON.stringify(state.pageInfo.pageData));//在这里保存左侧边栏tab数据这时候需要做一个判断，判断当前页面数据是不是空值，如果不是需要保存数据
                                        state.subIndex = options.index;
                                        break;
                                    case 1301://正在编辑
                                    case 1303://正在编辑
                                        state.layerIndex = 3;
                                        break;
                                    case 1302://异常退出
                                        state.layerIndex = 2;
                                        //t.showLayer(4);
                                        break;
                                }
                            }
                        }
                    });
                }else{
                    mutaions.saveAssembleData(state, {
                            data: mergeData.mergeData({quiteType: 1}),
                            callBack(res) {
                                if (res.responseObject.responseCode == 1302) {
                                    state.layerIndex = 2;
                                } else if(res.responseObject.responseCode==1301||res.responseObject.responseCode==1303){
                                    state.layerIndex = 3;
                                }else if (res.responseObject.responseCode == 0) {
                                    if (res.responseObject.responseStatus) {
                                        state.subPageData[state.subIndex] = JSON.parse(JSON.stringify(state.pageInfo.pageData));//在这里保存左侧边栏tab数据这时候需要做一个判断，判断当前页面数据是不是空值，如果不是需要保存数据
                                        state.subIndex = options.index;
                                    }
                                }
                            }
                        }
                    )
                }

            };
        }

    },
    checkRelationship(state,data){
        //console.log(data);
        state.Relationship = data;
    },
    timingLog(state){
        //let timeLock = 30*60*1000;
      let timeLock = 30*60*1000;
      setInterval(()=>{
          mutaions.operationLog(state);
      },timeLock);
    },
    operationLog(state,type){
        if(state.CaseId<=0){
            return ;
        }
        state.editTypeNum++;
        let opType = 1;
        if(state.editTypeNum==1&&state.editType==0){
            opType = 1;
        }else if(state.CaseId>0){
            opType = 3;
        }else{
            if(state.editTypeNum>1){
                return;
            }else{
                opType = 1;
            }
        }
        let idList = '';
        let nameList = '';
        if(state.handleBaseOnOff){
            idList+=' ';
            nameList+='基本信息';
        }
        for(let num = 0;num<state.tabList.length;num++){
            let item = state.tabList[num];
            //console.log(item['handleOnOff']);
            if(item['handleOnOff']){
                idList+="；"+item.menuId;
                nameList+="；"+item.menuName;
            }
        }
        if(opType==3){
            if(nameList!='基本信息'){
                if(!(idList.length>0&&nameList.length>0)){
                    return;
                }
            }
        }
        let sliceStr = (str)=>{
            if(str[0]==='；'){
                return str.substring(1,1000000);
            }else{
                return str;
            }
        }
        let postJson = {
            caseId: state.CaseId,//	string	是	病历Id
            customerId: comm.cookie.get("userId"),//	string	是	医生ID
            structureId:sliceStr(idList),
            structureName:sliceStr(nameList),
            customerName: localStorage.getItem('userName'),//	string	是	医生名称
            opType:opType//
//
        }
        comm.ajax2({
            url: "/call/caseFolder/log_case_customerOperation/create/",
            type: "POST",
            data: {
                paramJson: JSON.stringify(postJson)
            },
            success:function(res){
                if(res.responseObject.responseStatus){
                    state.loadingOnOff = false;
                    state.handleBaseOnOff = false;
                    for(let num = 0;num<state.tabList.length;num++){
                        let item = state.tabList[num];
                        //console.log(item['handleOnOff']);
                        item['handleOnOff'] = false;
                    }
                }
            }
        })
    },
    changeSelectIndexJson(state,data){
      state.selectIndexJson = data;
    },
    changeCaseBelong(state,type){
        state.CaseTemBelongType = type;
    },
    changeCaseBelongCid(state,cid){
      state.ownerCustomerId = cid;
      console.log(cid);
    },
    changeBaseHandleType(state,status){
        state.handleBaseOnOff = status;
    },
    saveDoctorId(state,num){
        state.doctorId = num;
    }
};
export default mutaions;
