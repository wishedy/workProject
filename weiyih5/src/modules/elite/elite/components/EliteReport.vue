<template>
    <section class="al-elite-report">
        <EliteTitleBar  :config="titleConfig"></EliteTitleBar>
        <EliteReportContainer @setTitleNum="changeTitleNum"></EliteReportContainer>
    </section>
</template>
<script>
    import EliteTitleBar from './EliteTitleBar';
    import EliteReportContainer from './EliteReportContainer';

    export default {
        components:{
            EliteTitleBar,
            EliteReportContainer
        },
        data(){
            return {
                titleConfig:{
                    title:'',
                    icon:true,
                    routerPath:'academic',
                    routerTitle:''
                }
            }
        },
        methods:{
            changeTitleNum(config){
                let _this = this;
                _this.titleConfig.routerTitle = config.totalCount+'篇文章';
                _this.titleConfig.title = config.title;
            }
        }
    }
</script>