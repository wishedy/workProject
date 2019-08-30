<template>
    <section class="al-view-content">
        <HeaderBar :headerConfig="headerConfig" class="al-medPlus-header"></HeaderBar>
        <terminalProductList :resourceType="resourceType" :resourceId="resourceId"></terminalProductList>
    </section>
</template>
<script>
    import comm from 'static/js/comm.js';
    import FastClick from "fastclick";
    import HeaderBar from "components/HeaderBar/HeaderBar.vue";
    window.FastClick = FastClick;
    FastClick.attach(document.body);
    import terminalProductList from './terminalProductList';
    export default {
        components:{
            HeaderBar,
            terminalProductList
        },
        data(){
            return {
                headerConfig: {
                    title: "推荐产品",
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
            document.title = '推荐产品';
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
