<template>
    <section class="al-elite-conferenceContainer">
        <EliteConferenceTab @changeTabIndex="getConferenceList"
                            :recentConfig="{
                  recentType:conferenceConfig.recentType,
                  typeName:'conferenceType',
                  emptyType:conferenceConfig.emptyType

        }"
        ></EliteConferenceTab>
        <EliteConferenceList :config="conferenceConfig"></EliteConferenceList>
    </section>
</template>
<script>
    import EliteSdk from '../untils/eliteCommSdk';
    const  xhrUrl = {
        conferenceList:EliteSdk.indexConferenceList
    };
    import comm from 'static/js/comm.js';
    import axios from 'axios';
    import EliteConferenceTab from './EliteConferenceTab';
    import EliteConferenceList from './EliteConferenceList';
    export default {
        components:{
            EliteConferenceTab,
            EliteConferenceList
        },
        data(){
          return {
              conferenceConfig:{
                  totalCount:0,
                  list:[],
                  limitNum:2,
                  title:'',
                  recentType:-1,
                  emptyType:[]

              }
          }
        },
        watch:{
            conferenceConfig:{
                handler(n){
                    let _this = this;
                    _this.$emit('setTitleNum',{
                        totalCount:n.totalCount,
                        title:n.title
                    });
                },
                deep:true
            }
        },
        methods:{
            getRecentType(){
                let _this = this;
                axios.get(xhrUrl.conferenceList, {
                    params: {}
                })
                    .then(function (res) {
                        if(res&&res.data&&res.data.responseObject&&res.data.responseObject.responseData&&res.data.responseObject.responseData.dataList&&res.data.responseObject.responseData.dataList){
                            _this.conferenceConfig.recentType= res.data.responseObject.responseData.dataList[0]['type'];
                            //存在数据
                            let emptyType = res.data.responseObject.responseData.dataList[0]['emptyType'].split(',');
                            let emptyArr = [];
                            for(let num = 0;num<emptyType.length;num++){
                                if(!comm.checkInvalid(emptyType[num])){
                                    emptyArr.push(parseInt(emptyType[num],10));
                                }
                            }
                            _this.conferenceConfig.emptyType = emptyArr;
                        }else{
                            //没有数据
                        };
                    })
                    .catch(function (error) {

                        ////console.log(error);
                    });
            },
            getConferenceList(config){
                let _this = this;
                axios.get(xhrUrl.conferenceList, {
                    params: {
                        paramJson:JSON.stringify({
                            organizationId:14,
                            type:config.conferenceType,
                            firstResult:0,
                            maxResult:100000
                        })
                    }
                })
                    .then(function (res) {
                        if(res&&res.data&&res.data.responseObject&&res.data.responseObject.responseData&&res.data.responseObject.responseData.dataList&&res.data.responseObject.responseData.dataList){
                            _this.conferenceConfig.totalCount = res.data.responseObject.responseData.dataList[0].totalCount;
                            _this.conferenceConfig.title = res.data.responseObject.responseData.dataList[0].title;
                            _this.conferenceConfig.list= res.data.responseObject.responseData.dataList[0]['resultList'];
                            //存在数据
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
            _this.getRecentType();
        }
    }
</script>