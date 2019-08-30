<template>
    <section class="al-elite-reportContainer">
        <EliteConferenceTab @changeTabIndex="getReportList" :recentConfig="{
         recentType:reportConfig.recentType,
         typeName:'reportType',
         emptyType:reportConfig.emptyType
        }"></EliteConferenceTab>
        <EliteReportList :config="reportConfig"></EliteReportList>
    </section>
</template>
<script>
    import EliteSdk from '../untils/eliteCommSdk';
    const xhrUrl = {
        report:EliteSdk.indexReport
    };
    import axios from 'axios';
    import EliteConferenceTab from './EliteConferenceTab';
    import EliteReportList from './EliteReportList';
    import comm from 'static/js/comm.js';
    export default {
        components:{
            EliteConferenceTab,
            EliteReportList
        },
        data(){
          return {
              reportConfig:{
                  totalCount:0,
                  list:[],
                  title:'',
                  limitNum:3,
                  recentType:-1,
                  emptyType:[]
              }
          }
        },
        watch:{
            reportConfig:{
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
            getReportList(config){
                let _this = this;

                axios.get(xhrUrl.report, {
                    params: {
                        paramJson:JSON.stringify({
                            organizationId:14,
                            type:config.reportType
                        })
                    }
                })
                    .then(function (res) {
                        if(res&&res.data&&res.data.responseObject&&res.data.responseObject.responseData&&res.data.responseObject.responseData.dataList&&res.data.responseObject.responseData.dataList){
                            _this.reportConfig.totalCount = res.data.responseObject.responseData.dataList[0].totalCount;
                            _this.reportConfig.title = res.data.responseObject.responseData.dataList[0].title;
                            _this.reportConfig.list= res.data.responseObject.responseData.dataList[0].resultList;
                            //存在数据
                        }else{
                            //没有数据
                        };
                    })
                    .catch(function (error) {

                        ////console.log(error);
                    });
            },
            getRecentType(){
                let _this = this;
                axios.get(xhrUrl.report, {
                    params: {}
                })
                    .then(function (res) {
                        if(res&&res.data&&res.data.responseObject&&res.data.responseObject.responseData&&res.data.responseObject.responseData.dataList&&res.data.responseObject.responseData.dataList){
                            _this.reportConfig.recentType = res.data.responseObject.responseData.dataList[0].type;
                            //存在数据
                            let emptyType = res.data.responseObject.responseData.dataList[0]['emptyType'].split(',');
                            let emptyArr = [];
                            for(let num = 0;num<emptyType.length;num++){
                                if(!comm.checkInvalid(emptyType[num])){
                                    emptyArr.push(parseInt(emptyType[num],10));
                                }
                            }
                            console.log(emptyArr);
                            _this.reportConfig.emptyType= emptyArr;
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