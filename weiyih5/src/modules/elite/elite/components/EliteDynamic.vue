<template>
    <section class="al-elite-dynamic">
        <EliteTitleBar :config="titleConfig"></EliteTitleBar>
        <EliteDynamicContainer @setTitle="changeTitle"></EliteDynamicContainer>
    </section>
</template>
<script>
    import EliteTitleBar from './EliteTitleBar';
    import EliteDynamicContainer from './EliteDynamicContainer';
    export default {
        components:{
            EliteTitleBar,
            EliteDynamicContainer
        },
        data(){
            return {
                titleConfig:{
                    title:'',
                    icon:false,
                    routerPath:'',
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