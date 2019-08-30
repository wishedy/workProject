<template>
    <section class="al-mainInnerWrap">
        <HomeBanner :config="bannerConfig"></HomeBanner>
        <HomeCenterBanner :swiperConfig="bannerList"></HomeCenterBanner>
        <EliteLiveList></EliteLiveList>
        <EliteConference></EliteConference>
        <EliteReport></EliteReport>
        <EliteRecommend></EliteRecommend>
        <EliteDynamic></EliteDynamic>
    </section>
</template>
<script>
    import axios from 'axios';
    import HomeBanner from './HomeBanner';
    import HomeCenterBanner from './HomeCenterBanner';
    import EliteLiveList from './EliteLiveList';
    import EliteConference from './EliteConference';
    import EliteReport from './EliteReport';
    import EliteRecommend from './EliteRecommend';
    import EliteDynamic from './EliteDynamic';
    import EliteSdk from '../untils/eliteCommSdk';
    import {mapGetters,mapActions} from 'vuex';
    const xhrUrl = {
        bannerList:EliteSdk.bannerList
    };
    export default {
        components:{
            HomeBanner,
            HomeCenterBanner,
            EliteLiveList,
            EliteConference,
            EliteReport,
            EliteRecommend,
            EliteDynamic
        },
        data(){
          return {
              bannerConfig:{
                  organizationName:'',
                  memberCount:0,
              },
              bannerList:[],
              organizationId:0
          }
        },
        methods:{
            ...mapActions(['saveOrganizationName']),
            getBanner(){
                let _this = this;
                axios.get(xhrUrl.bannerList, {
                    params: {}
                })
                    .then(function (res) {
                        if(res&&res.data&&res.data.responseObject&&res.data.responseObject.responseData){
                            _this.bannerConfig.organizationName = res.data.responseObject.responseData.dataList.name;
                            _this.saveOrganizationName(_this.bannerConfig.organizationName);
                            _this.bannerConfig.memberCount = res.data.responseObject.responseData.dataList.memberCount;
                            _this.organizationId = res.data.responseObject.responseData.dataList.organizationId;
                        }
                        if(res&&res.data&&res.data.responseObject&&res.data.responseObject.responseData&&res.data.responseObject.responseData.dataList&&res.data.responseObject.responseData.dataList.bannerList){
                            _this.bannerList = res.data.responseObject.responseData.dataList.bannerList;
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
            console.log('触发');
            _this.getBanner();

        }
    }
</script>