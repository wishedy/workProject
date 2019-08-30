<template>
    <section class="al-view-content">
         <HeaderBar :headerConfig="headerConfig" class="al-medPlus-header"></HeaderBar>
        <productList :resourceType="resourceType" :resourceId="resourceId"></productList>
    </section>
</template>
<script>
    import comm from 'static/js/comm.js';
    import FastClick from "fastclick";
    import HeaderBar from "components/HeaderBar/HeaderBar.vue";
    window.FastClick = FastClick;
    FastClick.attach(document.body);
    import productList from './productList';
    export default {
        components:{
            HeaderBar,
            productList
        },
        data(){
            return {
                headerConfig: {
                    title: "相关产品",
                    backOnOff: true,
                    share: {
                        onOff: false,
                    },
                    feedback: {
                        onOff: false
                    }
                }
            }
        },
        mounted(){
            document.title = '相关产品';
        },
        computed: {
            resourceId() {
                let t = this;
                return comm.getpara().resourceId;
            },
            resourceType() {
                let t = this;
                return comm.getpara().resourceType;
            },
        }
    }
</script>
