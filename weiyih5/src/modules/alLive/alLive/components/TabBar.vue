<template>
    <section class="al-alLive-tab" v-show="(!landscape)&&(loadOnOff)" :class="{'fullWidth':liveType===1}">
        <section class="al-alLive-handle">
            <figure class="al-alLive-handleItem" v-for="(item,index) in tabList" :key="index" @click.stop="changeTabIndex(index)" v-show="item.tabExist" :class="{'active':tabIndex===index}">
                <span v-text="item.tabTitle"></span>
            </figure>
        </section>
        <section class="al-alLive-liveNum" v-show="(liveNum>0)&&(liveType===0)">
            <span class="icon"></span>
            <span class="live-num" v-text="liveNum"></span>
        </section>
    </section>
</template>
<script>
    import {mapGetters,mapActions} from 'vuex';
     export default {
        data(){
            return {
                tabList:[
                    {
                        tabTitle:'课件',
                        tabExist:false,
                        routerPath:'/dc'
                    },
                    {
                        tabTitle:'日程',
                        tabExist:false,
                        routerPath:'/agenda'
                    },
                    {
                        tabTitle:'聊天互动',
                        tabExist:false,
                        routerPath:'/chat'
                    }
                ]
            }
        },
         methods:{
             ...mapActions(['changeTabIndex','loadEnd','sureNothing']),
             checkLoadStatus(){
                 let _this = this;
                 ((_this.agendaStatus!==-1)&&(_this.documentType!==-1))?_this.loadEnd():'';
                 ((_this.agendaStatus===0)&&(_this.documentType===0))?_this.sureNothing():'';
             }
         },
         computed:{
             ...mapGetters(['tabIndex','landscape','agendaOnOff','liveNum','documentType','agendaStatus','loadOnOff','liveType'])
         },
         watch:{
             agendaStatus(newVal){
                 let _this = this;
                 _this.tabList[1].tabExist = parseInt(newVal,10)===1;
                 _this.checkLoadStatus();
             },
             liveType(newVal){
               let _this = this;
                _this.tabList[2].tabExist = parseInt(newVal,10)===0;
             },
             documentType(newVal){
                 let _this = this;
                 console.log('文档值'+newVal);
                 _this.tabList[0].tabExist = parseInt(newVal,10)===1;
                 _this.checkLoadStatus();
             },
             loadOnOff(newVal){
                 let _this = this;
                 /*if(_this.documentType===1){
                     _this.changeTabIndex(0);
                 }else if(_this.agendaStatus===1){
                     _this.changeTabIndex(1);
                 }*/
             },
             tabIndex(newVal){
                 console.log(newVal);
             }
         },
         mounted(){
            let _this = this;
         }
    }
</script>