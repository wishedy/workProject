<template>
    <section class="al-elite-faceToFace">
        <HeaderBar :header-config="headerConfig" ></HeaderBar>
        <EliteLiveContainer :liveConfig="liveConfig"></EliteLiveContainer>
    </section>
</template>
<script>
    import EliteSdk from '../untils/eliteCommSdk';
    import comm from 'static/js/comm.js';
    import axios from 'axios';
    import HeaderBar from '../../../../components/HeaderBar/HeaderBar';
    import EliteLiveContainer from './EliteLiveContainer';
    import TempCache from "../../../../../static/js/tempcache";
    let userId = TempCache.getItem('userId');
    const xhrUrl = {
      liveList:EliteSdk.indexLiveList
    };
    export default {
        components:{
            HeaderBar,
            EliteLiveContainer
        },
        data(){
            return {
                liveConfig:{
                    limitNum:111111,
                    list:[]
                },
                headerConfig:{
                    title:"菁英面对面",  //  *标题项
                    share:{            // ..自定义分享项
                        onOff:true,
                        params: {
                            "sceneType": "96",
                            customerId:userId,
                            visitSiteId:2
                        },
                        authority:1
                    },
                    feedback: {         //..自定义反馈项
                        onOff: false
                    },
                    backOnOff:true
                }
            }
        },
        methods:{
            changeData(list){

                    let originalList = JSON.parse(JSON.stringify(list));
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
                        dataItem.liveName = comm.getStrLen(dataItem.liveName,30);
                        dataItem.livePeopleNum = comm.toW(dataItem.playBackNum)+'观看';
                        dataItem.formatStartTime = formatStartTime(dataItem.liveStartTime);
                        resultList.push(dataItem);
                    }
                    return resultList;

            },
            getLiveList(){
                let _this = this;
                axios.get(xhrUrl.liveList, {
                    params: {
                        paramJson:JSON.stringify({
                            organizationId:14,
                            firstResult:0,
                            maxResult:10000
                        })
                    }
                })
                    .then(function (res) {
                        if(res&&res.data&&res.data.responseObject.responseData&&res.data.responseObject.responseData.dataList){
                            //存在数据
                            _this.liveConfig.list = _this.changeData(res.data.responseObject.responseData.dataList);

                        }else{
                            //没有数据
                        };
                    })
                    .catch(function (error) {

                        ////console.log(error);
                    });
            }
        },
        mounted(){
            let _this = this;
            _this.getLiveList();
        }
    }
</script>