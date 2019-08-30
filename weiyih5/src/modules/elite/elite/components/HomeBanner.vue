<template>
    <section class="al-elite-homeBanner" :class="{'al-elite-old-App':!isShow}">
        <HeaderBar :header-config="headerConfig" class="al-elite-bannerHeader" v-if="isShow"></HeaderBar>
        <EliteNum v-if="config.memberCount" :memberCount="config.memberCount"></EliteNum>
    </section>
</template>
<script>
    import {mapGetters,mapActions} from 'vuex';
    import EliteSdk from '../untils/eliteCommSdk';
    import HeaderBar from '../../../../components/HeaderBar/HeaderBar';
    import EliteNum from './EliteNum';
    import TempCache from "../../../../../static/js/tempcache";
    let userId = TempCache.getItem('userId');
    export default {
        name:'homeBanner',
        components:{
            HeaderBar,
            EliteNum
        },
        props:{
            config:{
                default(){
                    return {
                        organizationName:'',
                        memberCount:0,
                    }
                }
            }
        },
        methods:{
            ...mapActions(['saveOrganizationName']),
          setReturnBackIcon(){
              setTimeout(()=>{
                  let element = $('.ev_backBtn');
                  element.find("img").attr({src:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAmCAYAAADEO7urAAAAAXNSR0IArs4c6QAAAKpJREFUSA3tlsEJhEAMRcVWrGCswZtYzVbqWdAKBA+Kx9kXMCCCh83MepAEHhHB70+YDCmKV0eMsYMJBqiSikUgwAYaH7MgCjXMqkTeweaQD8XZWUyeg8mdi/3eNu+Z9+ymAxyNBlbQsM+m/AOVXpXIC9gG/TBc3hi3v8ZR3pLFipQJee44rc1Fvad+pJiCI9JupifH1L4sXWY/zzp3Em3p5QjpC6eK/j1/AULWwNgJng36AAAAAElFTkSuQmCC'});
                  element.show();
              },200);
          }
        },
        computed:{
            ...mapGetters(['organizationName'])
        },
        watch:{
            config:{
              handler(n){
                  let _this = this;
                  _this.headerConfig.title = n.organizationName;
                  EliteSdk.setTitle({
                      seoTitle:n.organizationName+`主页-唯医骨科,allinmd`,
                      title:n.organizationName
                  });
              },
              deep:true
            }
        },
        data(){
            return {
                headerConfig:{
                    title:"",  //  *标题项
                    share:{            // ..自定义分享项
                        onOff:true,
                        params: {
                            "sceneType": "90",
                            customerId:userId,
                            visitSiteId:2
                        },
                        authority:1
                    },
                    feedback: {         //..自定义反馈项
                     onOff: false
                    },
                    backOnOff:false
                },
                isShow:true
            }
        },
        mounted(){
            let _this = this;
            _this.setReturnBackIcon();
            if(comm.getpara().isOldAPP){
                _this.isShow=false;
            }
        }
    }
</script>