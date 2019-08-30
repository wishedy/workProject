<template>
    <section class="alEmr-indexNoCase" v-if="noCListFlag==1">
        <img class="noCaseImg" src="/static/images/pages/allCase/noCase.png">
        <p class="noCaseText">暂无病历，您可以试试 <a @click="newCaseClick" :href="'../newCases/index.html?edit=0'">新建病历</a>/
            <a :href="'../choosePatients/index.html'">选择患者</a></p>
        <ieAlert :showAlert="showAlert"></ieAlert>
    </section>
</template>

<script>
    import {mapActions,mapGetters} from 'vuex';
    import comm from '~utils/comm.js';
    import ieAlert from "~components/ieAlert/ieAlert.vue";
    export default {
        name: 'indexNoCase',
        data(){
            return {
                showAlert:false
            }
        },
        computed:{
            ...mapGetters(['noCListFlag','loading']),
        },
        components:{
            ieAlert
        },
        methods:{
            //新建病历的点击事件
            newCaseClick(){
                if(this.loading){
                    return;
                }
                if(comm.browser.isIe9()){
                    e.preventDefault();
                    this.showAlert = !this.showAlert
                    let t=this;
                    setTimeout(function() {
                        t.showAlert = !t.showAlert
                    },1000)
                }else{
                    sessionStorage.removeItem("emrNewCaseCaseId");
                    sessionStorage.setItem('newCasesSource',window.location.href);
                }
            }
        },
        mounted(){
            if(comm.browser.isIe9()){
                this.isIe9 = true;
            }
        }
    }
</script>

<style scoped>

</style>
