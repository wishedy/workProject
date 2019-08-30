<template>
    <section class="al-elite-recommend">
        <EliteTitleBar  :config="titleConfig"></EliteTitleBar>
        <EliteRecommendContainer @setTitle="changeTitle"></EliteRecommendContainer>
    </section>
</template>
<script>
    import EliteTitleBar from './EliteTitleBar';
    import EliteRecommendContainer from './EliteRecommendContainer';
    export default {
            components:{
                EliteTitleBar,
                EliteRecommendContainer
            },
        data(){
            return {
                titleConfig:{
                    title:'',
                    icon:false,
                    routerTitle:''
                }
            }
        },
        methods:{
            changeTitle(n){
                let _this = this;
                _this.titleConfig.title = n;
            }
        }
    }
</script>