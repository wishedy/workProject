<template>
    <section class="al-elite-liveList" v-if="liveConfig.list.length>0">
        <EliteTitleBar
          :config="titleConfig"
          class="liveTitle"
        ></EliteTitleBar>
        <EliteLiveContainer :liveConfig="liveConfig"></EliteLiveContainer>
    </section>
</template>
<script>
    import EliteSdk from '../untils/eliteCommSdk';
    const xhrUrl = {
        liveList:EliteSdk.liveList
    };
    import {mapGetters,mapActions} from 'vuex';
    import axios from 'axios';
    import EliteTitleBar from './EliteTitleBar';
    import EliteLiveContainer from './EliteLiveContainer';
    export default {
        name:'elite-liveList',
        components:{
            EliteTitleBar,
            EliteLiveContainer
        },
        data(){
            return {
                liveConfig:{
                    totalCount:0,
                    list:[],
                    limitNum:6
                },
                titleConfig:{
                    title:'',
                    icon:true,
                    routerPath:'face',
                    routerTitle:''
                }
            }
        },
        methods:{
            ...mapActions(['saveIndexLiveList','saveLiveTotalCount']),
            getLiveList(){
                let _this = this;
                axios.get(xhrUrl.liveList, {
                    params: {
                        paramJson:JSON.stringify({
                            organizationId:14,
                            firstResult:0,
                            maxResult:100000
                        })
                    }
                })
                    .then(function (res) {
                        if(res&&res.data&&res.data.responseObject.responseData&&res.data.responseObject.responseData.dataList){
                            //存在数据
                            _this.liveConfig.totalCount = res.data.responseObject.responseData.dataList[0].totalCount;
                            _this.saveIndexLiveList(res.data.responseObject.responseData.dataList[0].resultList);
                            _this.liveConfig.list = _this.liveIndexList;
                            _this.titleConfig.routerTitle = res.data.responseObject.responseData.dataList[0].totalCount+'个直播';
                            _this.titleConfig.title = res.data.responseObject.responseData.dataList[0].title;
                        }else{
                            //没有数据
                        };
                    })
                    .catch(function (error) {

                        ////console.log(error);
                    });
            }
        },
        computed:{
            ...mapGetters(['liveIndexList'])
        },
        watch:{
            liveIndexList(n){
                //console.log(n);
            }
        },
        mounted(){
            let _this = this;
            _this.getLiveList();
        }
    }
</script>