<template>
    <header class="al-personalScrollHead al-personalHeadFixed" id="floatHeader">
        <h2>
            <a class="ev_backBtn scrollBack" href="javascript:history.back(-1);" @click="hisBack">
                <img src="//img50.allinmd.cn/pages/personal/arrow_back.png" alt="">
            </a>
            <span class="ev-name namecenter">{{name}}</span>
            <span class="al-personalShare icon-shareDeepBlue" v-show="$store.state.issuccess"></span>
        </h2>
    </header>
</template>

<script>
    import comm from "static/js/comm";
    export default {
    	data(){
    		return {
    			name:''
            }
        },
        watch:{
            "$store.state.public"(){
                let str = this.$store.state.public.name;
                this.name = comm.getStrLen(str,20);
            }
        },
        methods:{
            hisBack(){
                 if(!document.referrer){
                     if(window.g_sps){
                         g_sps.jump(null,'/');
                     }else{
                         setTimeout(function(){
                             g_sps.jump(null,'/');
                         },200)
                     }
                 }
            }
        }
    }
</script>

<style>

</style>