<template>
    <section class="al-elite-conferenceWrap">
        <HeaderBar :header-config="headerConfig" ></HeaderBar>
        <MajorTab @changeTabIndex="getConferenceList"></MajorTab>
        <EliteConferenceList :config="conferenceConfig" v-show="conferenceConfig.list.length>0"></EliteConferenceList>
        <EliteNoData v-show="conferenceConfig.list.length===0&&loadOnOff"></EliteNoData>
    </section>
</template>
<script>
    import EliteSdk from '../untils/eliteCommSdk';
    const  xhrUrl = {
        conferenceList:EliteSdk.conferenceList
    };
    import comm from 'static/js/comm.js';
    import axios from 'axios';
    import HeaderBar from '../../../../components/HeaderBar/HeaderBar';
    import MajorTab from './EliteMajorTab';
    import EliteConferenceList from './EliteConferenceList';
    import EliteNoData from './EliteNoData';
    import TempCache from "../../../../../static/js/tempcache";
    import {mapGetters,mapActions} from 'vuex';
    let userId = TempCache.getItem('userId');
    export default {
        components:{
            HeaderBar,
            MajorTab,
            EliteConferenceList,
            EliteNoData
        },
        data(){
            return {
                loadOnOff:false,
                headerConfig:{
                    title:"往届会议",  //  *标题项
                    share:{            // ..自定义分享项
                        onOff:true,
                        params: {
                            "sceneType": "94",
                            customerId:userId,
                            visitSiteId:2
                        },
                        authority:1
                    },
                    feedback: {         //..自定义反馈项
                        onOff: false
                    },
                    backOnOff:true
                },
                conferenceConfig:{
                    totalCount:0,
                    list:[],
                    limitNum:111111
                }
            }
        },
        computed:{
            ...mapGetters(['organizationName'])
        },
        methods:{
            changeData(dataList){
              let _this = this;
              let resultList = [];
              let originalList = JSON.parse(JSON.stringify(dataList));
                for(let num = 0;num<originalList.length;num++){
                    let dataItem = originalList[num];
                    if(parseInt(dataItem.liveState,10)===2){
                        dataItem.conName = comm.getStrLen(dataItem.conName,54);
                    }else{
                        dataItem.conName = comm.getStrLen(dataItem.conName,70);
                    }
                    resultList.push(dataItem);
                }
                return resultList;
            },
            getConferenceList(config){
                let _this = this;
                axios.get(xhrUrl.conferenceList, {
                    params: {
                        paramJson:JSON.stringify({
                            type:config.conferenceType,
                            organizationId:14,
                            firstResult:0,
                            maxResult:100000
                        })
                    }
                })
                    .then(function (res) {
                        _this.loadOnOff = true;
                        if(res&&res.data&&res.data.responseObject&&res.data.responseObject.responseData){
                            _this.conferenceConfig.totalCount = res.data.responseObject.responseData.totalCount;
                        }
                        if(res&&res.data&&res.data.responseObject&&res.data.responseObject.responseData&&res.data.responseObject.responseData.dataList&&res.data.responseObject.responseData.dataList){


                            _this.conferenceConfig.list= _this.changeData(res.data.responseObject.responseData.dataList);
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
        watch:{
            organizationName(){
                let _this = this;
                EliteSdk.setTitle({
                    seoTitle:_this.organizationName+`的学术报道-唯医骨科,allinmd`,
                    title:_this.organizationName
                });
            }
        },
        mounted(){
            let _this = this;
            _this.getConferenceList({
                conferenceType:2
            });
            EliteSdk.setTitle({
                seoTitle:_this.organizationName+`的往届会议-唯医骨科,allinmd`,
                title:_this.organizationName
            });
        }
    }
</script>