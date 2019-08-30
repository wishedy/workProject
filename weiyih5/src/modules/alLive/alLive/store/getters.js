import AlLiveSdk from  '../untils/alLiveSdk';
import comm from 'static/js/comm.js';
const getters = {
    num(state){
        return state.num;
    },
    landscape(state){
        return state.landscape;
    },
    windowWidth(state){
        return state.windowWidth;
    },
    windowHeight(state){
        return state.windowHeight;
    },
    tabIndex(state){
        return state.tabIndex;
    },
    agendaList(state){
        return state.agendaList;
    },
    agendaOnOff(state){
        return Object.keys(state.agendaList).length>0;
    },
    liveNum(state){
        return state.liveNum;
    },
    liveType(state){
        return state.liveType;
    },
    documentType(state){
        return state.documentType;
    },
    agendaStatus(state){
        return state.agendaStatus;
    },
    loadOnOff(state){
        return state.loadOnOff;
    },
    chatTemMsg(state){
        return state.chatTemMsg;
    },
    chatList(state){
        let lastResult = [];
        let produceContent=(arr)=>{
            let  str = '';
            if(arr.length>1){
                for(let arrNum = 0;arrNum<arr.length;arrNum++){
                    if(arrNum!=0){
                        str+=arr[arrNum];
                    }
                }
                return str;
            }else{
                return arr[0];
            }

        };
        let originalList = JSON.parse(JSON.stringify(state.chatList));
        for(let num = 0;num<originalList.length;num++){
            let dataItem = originalList[num];
            let msgContent = '';
            console.log(dataItem);
            let allMsg = dataItem.msg.split(":");
            msgContent = AlLiveSdk.analysisMsg(produceContent(allMsg));
            let speakersInfo = AlLiveSdk.checkSpeakers(dataItem);
            console.log(comm.checkInvalid(dataItem.time));
            let jsonItem = {
                msgClassName:speakersInfo.msgClassName,
                speakers:speakersInfo.speakers,
                msgContent:msgContent,
                msgTime:((typeof dataItem.time)===("string"))?dataItem.time:''
            };
            lastResult.push(jsonItem);
        }
        return lastResult;
    },
    conferenceId(state){
        return state.conferenceId;
    },
    authority(state){
        return state.authority;
    },
    conSubInfo(state){
        return state.conSubInfo;
    },
    queryJson(state){
        return state.queryJson;
    },
    liveStatus(state){
        return state.liveStatus;
    },
    nothingOnOff(state){
        return state.nothingOnOff;
    }
};
export default getters;