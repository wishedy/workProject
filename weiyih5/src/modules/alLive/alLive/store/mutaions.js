const mutaions = {
    methodFun(state,data){
        state.num=data;
    },
    changeLandscape(state,onOff){
        state.landscape = onOff;
    },
    setWindowSize(state,option){
        //setType:0设置宽度，1设置宽度
        option.setType===0?state.windowWidth = option.size:state.windowHeight = option.size;
    },
    changeTabIndex(state,index){
        state.tabIndex = parseInt(index,10);
    },
    saveAgendaList(state,list){
        state.agendaList = list;
    },
    saveLiveNum(state,num){
        state.liveNum = num;
    },
    saveLiveType(state,type){
        state.liveType = type;
    },
    saveDocumentType(state,type){
        state.documentType = type;
    },
    saveAgendaStatus(state,type){
        state.agendaStatus = type;
    },
    loadEnd(state){
        state.loadOnOff = true;
    },
    changeChatMsg(state,msg){
        state.chatTemMsg = msg;
    },
    saveMessageItem(state,item){
        state.chatList.push(item);
    },
    saveConferenceId(state,config){
        state.conferenceId = config;
    },
    saveAuthority(state,authority){
        state.authority = authority;
    },
    saveConSubInfo(state,config){
        state.conSubInfo = config;
    },
    saveQueryJson(state,config){
        state.queryJson = config;
    },
    changeLiveStatus(state,type){
        state.liveStatus = type;
    },
    sureNothing(state){
        state.nothingOnOff = true;
    }
};
export default mutaions;