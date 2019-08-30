<template>
    <section class="al-elite-conference">
        <EliteTitleBar :config="titleConfig"></EliteTitleBar>
        <EliteConferenceContainer @setTitleNum="changeTitleNum"></EliteConferenceContainer>
    </section>
</template>
<script>
    import EliteTitleBar from './EliteTitleBar';
    import EliteConferenceContainer from './EliteConferenceContainer';
    export default {
        components:{
            EliteTitleBar,
            EliteConferenceContainer
        },
        data(){
            return {
                titleConfig:{
                    title:'',
                    icon:true,
                    routerPath:'conference',
                    routerTitle:''
                }
            }
        },
        methods:{
            changeTitleNum(config){
                let _this = this;
                _this.titleConfig.routerTitle = config.totalCount+'个会议';
                _this.titleConfig.title = config.title;
            }
        }
    }
</script>