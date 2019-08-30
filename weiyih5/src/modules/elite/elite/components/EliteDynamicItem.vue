<template>
    <section class="al-elite-dynamicItem" @click.stop="openNews({
     linkUrl:h5Url
    })" @mousedown.stop="trackAction">
        <figure class="dynamicLogo" :style="{background: 'url('+imageUrl+') no-repeat center center',backgroundSize:'cover'}"></figure>
    </section>
</template>
<script>
    import EliteSdk from '../untils/eliteCommSdk';
    export default {
        props:['imageUrl','h5Url','id'],
        mounted(){
            console.log(this.imageUrl);
        },
        methods:{
            openNews(config){
               EliteSdk.openNews(config);
            },
            trackAction(){
                let _this = this;
                let config = {
                    browseName:'菁英会主页',
                    actionName:'菁英会其它动态栏目-单个内容',
                    keyWord:'菁英会',
                    actionId:'11670',
                    refId:_this.id
                };
                EliteSdk.trackAction(config);
            }
        }
    }
</script>