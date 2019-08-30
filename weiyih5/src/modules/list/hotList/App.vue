<template>
    <section class="al-mainInner">
        <WakeApp :options="wakeData"></WakeApp>
        <HeaderBar :header-config="headerConfig" style="position: inherit;"></HeaderBar>
        <List style="margin-top: 5px;"></List>
    </section>
</template>
<script type="text/ecmascript-6">
import comm from "static/js/comm.js";
import List from "./components/List.vue";
import HeaderBar from 'components/HeaderBar/HeaderBar.vue';
import WakeApp from  'components/WakeApp/WakeApp.vue';
export default {
      data(){
        return {
            headerConfig:{
                title:'',
                share: {
                    onOff: false,
                },
                feedback: {
                    onOff: false
                },
				backOnOff:true,
                backFn:function(){
                    comm.creatEvent({
                        triggerType:'全站功能按钮点击',
                        keyword:"返回",
                        actionId:41,
                        async:false
                    });
                    history.back();
                }
            },
            wakeData:{
                el: ".al-newWakeUpAppBtn",
                ios: "allinmdios://app.allinmd.cn/applinks.html",
                ios9: "http://app.allinmd.cn/applinks.html",
                android: "allin://com.allin.social:75235?data={}"
            },
            groupByFlag:comm.getpara().groupByFlag||1,
            dataType: comm.getpara().dataType||0,
            name:""
        }
      },
      mounted(){
        this.setDocumentTitle();
      },
      components:{
          HeaderBar,
          List,
          WakeApp
      },
       methods:{
         setDocumentTitle(){
            let t =this;
            let resType='资源';
            switch(parseInt(t.dataType)){
                case 1:
                    resType='视频';
                    break;
                case 2:
                    resType='文库';
                    break;
                case 4:
                    resType='话题';
                    break;
                case 7:
                    resType='病例';
                    break;
            }
            switch(parseInt(t.groupByFlag)){
                case 1:
                    t.headerConfig.title = '每日最热';
                    document.title = "每日最热"+resType+" －为你精选,唯医,allinmd";
                    document.getElementsByName('keywords')[0].setAttribute('content',"每日最热"+resType+"，allinmd");
                    // Log.createBrowse(40,"每日最热");
                    break;
                case 5:
                    t.headerConfig.title ='每周最热';
                    document.title = "每周最热"+resType+" －为你精选,唯医,allinmd";
                    document.getElementsByName('keywords')[0].setAttribute('content',"每日最热"+resType+"，allinmd");
                    // Log.createBrowse(41,"每周最热");
                    break;
            }
        },
    }
  };
</script>
<style lang="scss" rel = "stylesheet/scss">
@import "scss/pages/index/weekly_list";
</style>

