<template>
    <section class="al-mainInner" v-if="columnState">
        <router-view></router-view>
    </section>
</template>

<script type="text/ecmascript-6">
    import TempCache from "../../../../static/js/tempcache";
    import EliteSdk from './untils/eliteCommSdk';
    import {shareAll} from '@allin/wap-share';
    import axios from 'axios';
    import user from 'static/js/module.user.js';
    import {mapActions,mapGetters} from 'vuex';
    window.shareAll = shareAll;
    let userId = TempCache.getItem('userId');
    const xhrUrl = {
        bannerList:EliteSdk.bannerList
    };
    export default {
        components: {

        },
        data(){
            return {

            }
        },
        beforeMount(){
        },
        computed:{
            ...mapGetters(['columnState'])
        },
        methods: {
            ...mapActions(['saveOrganizationName','changeColumnState','saveBannerData']),
            shareTrigger(){
              let _this = this;
              setTimeout(()=>{
                  $(".share").on("mousedown",()=>{
                      let routerName = _this.$route.name;
                      let actionName = '';
                      let actionId = '';
                      let actionPageName = '';
                      switch (routerName) {
                          case 'home':
                              actionPageName = '菁英会主页';
                              actionName = '菁英会分享';
                              actionId = '11671';
                              break;
                          case 'conference':
                              actionPageName = '往届会议-菁英会';
                              actionName = '菁英会分享';
                              actionId = '11681';
                              break;
                          case 'academic':
                              actionPageName = '学术报到-菁英会';
                              actionName = '菁英会分享';
                              actionId = '11687';
                              break;
                          case 'face':
                              break;
                      }
                      let config = {
                          browseName:actionPageName,
                          actionName:actionName,
                          keyWord:'菁英会',
                          actionId:actionId,
                          refId:14
                      };
                      EliteSdk.trackAction(config);
                      user.privExecute({
                          operateType: 'login',
                          callback: function () {

                          }
                      });
                  });
              },1000);

            },
            checkAppType(){
                let _this = this;
                let routerName = _this.$route.name;
                let type = 94;
                switch (routerName) {
                    case 'home':
                        type = 94;
                        break;
                    case 'conference':
                        type = 98;
                        break;
                    case 'group':
                        type = 95;
                        break;
                    case 'member':
                        type = 97;
                        break;
                    case 'organization':
                        type = 96;
                        break;
                    case 'academic':
                        type = 99;
                        break;
                    case 'face':
                        type = 100;
                        break;
                }
                if(type!==94){
                    axios.get(xhrUrl.bannerList, {
                        params: {}
                    })
                        .then(function (res) {
                            if(res&&res.data&&res.data.responseObject&&res.data.responseObject.responseData){
                                _this.saveOrganizationName(res.data.responseObject.responseData.dataList.name);
                            }
                        })
                        .catch(function (error) {

                            ////console.log(error);
                        });
                }
                EliteSdk.wakeup({
                    type:type
                });
            },
            getBanner(){
                let _this = this;
                axios.get(xhrUrl.bannerList, {
                    params: {}
                })
                    .then(function (res) {
                        if(res&&res.data&&res.data.responseObject&&res.data.responseObject.responseData){
                            /*_this.bannerConfig.organizationName = res.data.responseObject.responseData.dataList.name;
                            _this.saveOrganizationName(_this.bannerConfig.organizationName);
                            _this.bannerConfig.memberCount = res.data.responseObject.responseData.dataList.memberCount;*/
                            if(parseInt(res.data.responseObject.responseData.dataList.columnState,10)===0){
                                EliteSdk.openUrl('https://m.allinmd.cn/pages/error/404.html');
                            }
                            _this.changeColumnState(res.data.responseObject.responseData.dataList.columnState);
                            _this.saveBannerData(res);
                            /*_this.organizationId = res.data.responseObject.responseData.dataList.organizationId;*/
                        }
                        /*if(res&&res.data&&res.data.responseObject&&res.data.responseObject.responseData&&res.data.responseObject.responseData.dataList&&res.data.responseObject.responseData.dataList.bannerList){
                            _this.bannerList = res.data.responseObject.responseData.dataList.bannerList;
                            //存在数据
                        }else{
                            //没有数据
                        };*/
                    })
                    .catch(function (error) {

                        ////console.log(error);
                    });
            }
        },
        watch:{
            "$route"(n){
               let _this = this;
                _this.checkAppType();
            },
            columnState(n){
                console.log("改变值"+n);
            }
        },
        mounted(){
            let _this = this;
            _this.checkAppType();
            _this.shareTrigger();
            _this.getBanner();
            //判断是老版APP进入唤起弹层
            if(comm.getpara().isOldAPP){
                function clickHandle(e) {
                    console.log(e.target.className)
                    if(e.target.className!='conferenceTabItem'){
                        e.preventDefault();
                        e.stopPropagation();
                        document.removeEventListener('click',clickHandle,true);
                        comm.alertBox({
                            mTitle: "提示",
                            title: "当前版本过低，无法进行查看<br/>请前往应用商店进行升级",
                            ensure: "知道了",
                            ensureCallback:function(){
                                $('.al-alertModalMask').remove();
                                document.addEventListener('click',clickHandle,true);
                            }
                        });
                    }

                }

                document.addEventListener('click',clickHandle,true);
            }
        }
    };
</script>
<style lang="scss" rel="stylesheet/scss">
 @import "scss/pages/eliteClub/elite";
</style>


