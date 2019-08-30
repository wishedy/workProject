<template>
    <section class="al-elite-academic">
        <HeaderBar :header-config="headerConfig" ></HeaderBar>
        <MajorTab @changeTabIndex="getReportList"></MajorTab>
        <EliteReportList :config="reportConfig" v-show="reportConfig.list.length>0"></EliteReportList>
        <EliteNoData v-show="reportConfig.list.length===0&&loadOnOff"></EliteNoData>
    </section>
</template>
<script>
    import EliteSdk from '../untils/eliteCommSdk';
    const xhrUrl = {
        report:EliteSdk.report
    };
    import TempCache from "../../../../../static/js/tempcache";
    let userId = TempCache.getItem('userId');
    import {mapGetters} from 'vuex';
    import axios from 'axios';
    import HeaderBar from '../../../../components/HeaderBar/HeaderBar';
    import MajorTab from './EliteMajorTab';
    import EliteReportList from './EliteReportList';
    import EliteNoData from './EliteNoData';
    export default {
        components:{
            HeaderBar,
            MajorTab,
            EliteReportList,
            EliteNoData
        },
        computed:{
            ...mapGetters(['userId','organizationName'])
        },
        methods:{
            getReportList(config){
                let _this = this;
                axios.get(xhrUrl.report, {
                    params: {
                        paramJson:JSON.stringify({
                            type:config.reportType,
                            organizationId:14,
                            firstResult:0,
                            maxResult:100000
                        })
                    }
                })
                    .then(function (res) {
                        _this.loadOnOff = true;
                        if(res&&res.data&&res.data.responseObject&&res.data.responseObject.responseData){
                            _this.reportConfig.totalCount = res.data.responseObject.responseData.totalCount;
                        }
                        if(res&&res.data&&res.data.responseObject&&res.data.responseObject.responseData&&res.data.responseObject.responseData.dataList&&res.data.responseObject.responseData.dataList){
                            _this.reportConfig.list= res.data.responseObject.responseData.dataList;
                            //存在数据
                        }else{
                            //没有数据
                        };
                    })
                    .catch(function (error) {
                        //console.log(error);
                    });
            }
        },
        data()
        {
            return {
                loadOnOff:false,
                headerConfig:{
                    title:"学术报道",  //  *标题项
                    share:{            // ..自定义分享项
                        onOff:true,
                        params: {
                            "sceneType": "95",
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
                reportConfig:{
                    totalCount:0,
                    list:[],
                    limitNum:111111
                }
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
            _this.getReportList({
                reportType:21904
            });
            EliteSdk.setTitle({
                seoTitle:_this.organizationName+`的学术报道-唯医骨科,allinmd`,
                title:_this.organizationName
            });
        }
    }
</script>