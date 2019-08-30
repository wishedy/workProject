<template>
    <section class="al-personalContent al-personalIndex" :class="{'al-personalNoLogin':!cId}" data-role="index" data-alcode-mod='465'>
        <section class="al-personalBrowsedPart">
            <section class="al-personalBrowsedItem" @click="callApp({text:'我的笔记',tplPath:1,type:5})">
                <a href="javascript:;" class="icon-collect ev-collectIcon">
                    我的笔记
                </a>
            </section>
            <section class="al-personalBrowsedItem" @click="callApp({text:'云资料库',tplPath:2,type:11})" v-if="!(customerRole===14||customerRole===15)">
                <a href="javascript:;" class="icon-collect ev-collectIcon">
                    云资料库
                </a>
            </section>
            <section class="al-personalBrowsedItem">
                <a href="./personal_setting.html" class="icon-collect ev-collectIcon">
                    设置
                </a>
            </section>
        </section>
    </section>
</template>

<script type="text/ecmascript-6">
    import {mapGetters,mapActions} from  "vuex";
    import TempCache from "static/js/tempcache.js";
    export default{
      data(){
        return {
          cId:TempCache.getItem('userId')
        }
      },
      methods:{
          ...mapActions(['callApp'])
      },
        computed:{
            ...mapGetters(['customerRole'])
        },
        mounted(){
          console.log(this.customerRole);
        }
    }
</script>