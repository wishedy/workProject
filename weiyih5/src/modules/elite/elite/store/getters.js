import comm from 'static/js/comm.js';
const getters = {
    liveIndexList(state){
        let originalList = JSON.parse(JSON.stringify(state.liveIndexList));
        let resultList = [];
        let formatStartTime = (str)=>{
        let timeOriginal = str.split(' ');
        let date = timeOriginal[0].split("-");
        let time = timeOriginal[1].split(":");
        // 获取当前日期
        let nowDate = new Date();

        // 获取当前月份
        let nowMonth = nowDate.getMonth() + 1;

        // 获取当前是几号
        let strDate = nowDate.getDate();
        let yearNum = nowDate.getFullYear();
        if((parseInt(yearNum,10)===parseInt(date[0],10))&&(parseInt(nowMonth,10)===parseInt(date[1],10))&&(parseInt(strDate,10)===parseInt(date[2],10))){
            return '今日'+' '+time[0]+":"+time[1];
         }else{
            return date[1]+"/"+date[2]+' '+time[0]+":"+time[1];
         }
        };
        for(let num = 0;num<originalList.length;num++){

              let dataItem = originalList[num];
              let liveDes = '';
              switch (parseInt(dataItem.liveState,10)) {
                  case 1:
                      liveDes = '预告';
                      break;
                  case 2:
                      liveDes = '直播中';
                      break;
                  case 3:
                      liveDes = '已结束';
                      break;
                  case 4:
                      liveDes = '视频回放';
                      break;
              }
              dataItem.liveDes = liveDes;
              dataItem.livePeopleNum = comm.toW(dataItem.playBackNum)+'观看';
              dataItem.liveName = comm.getStrLen(dataItem.liveName,30);
              dataItem.formatStartTime = formatStartTime(dataItem.liveStartTime);
              resultList.push(dataItem);
        }
        return resultList;
    },
    liveTotalCount(state){
        return state.liveTotalCount;
    },
    scrollTop(state){
        return state.scrollTop;
    },
    userId(state){
        return state.userId;
    },
    organizationName(state){
        return state.organizationName;
    },
    columnState(state){
        return state.columnState;
    },
    bannerData(state){
        return state.bannerData;
    }
};
export default getters;