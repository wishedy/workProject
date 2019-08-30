<template>
    <!--<tp-comm :typeName="'newCase'" :crumbsText="'新建病历'"></tp-comm>-->
    <tp-comm typeNameCase="newCase" crumbsText="新建病历" @tpUse="useBtn"></tp-comm>
</template>

<script>
    import tpComm from '~components/tpComm/tpComm';
    import {mapActions,mapGetters} from 'vuex';
    export default {
        components: {tpComm},
        methods:{
            ...mapActions(['saveTemplateId','setTopNavTitle','getBaseCaseInfo','templateIdType']),
            useBtn(data){
                //console.log(data);
                let t  = this;
                t.saveTemplateId(data);

            }
        },
        computed:{
            ...mapGetters(['CaseId'])
        },
        watch:{
            CaseId(){
                let t = this;
                t.getBaseCaseInfo();
            }
        },
        mounted(){
            let t = this;
            setTimeout(()=>{
                t.templateIdType(0);
            },500);
            t.setTopNavTitle('选择病历模板');
        }
        // name: "upload"
    }
</script>

<style >
/*.caseTopNav{*/
    /*display: none;*/
/*}*/
</style>
