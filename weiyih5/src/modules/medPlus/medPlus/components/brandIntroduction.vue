<template>
    <section class="brandIntroduction">
        <h1 class="titleBar titleBarShouCe">
            <span v-text="title"></span>
        </h1>
        <section class="brandIntroductionList">
            <brandItem v-for="(item,index) in dataList" :key="index" :docName="item.attName" @click.native="checkInfo"></brandItem>
        </section>
    </section>
</template>
<script>
    import brandItem from './brandItem';
    import comm from 'static/js/comm.js';
    import app from 'static/js/comm.app.js';
    export default {
        components:{
            brandItem
        },
        props:{
            type:{
                default:'0',
                type:String
            },
            productName:{
              default:'',
              type:String
            },
            brandName:{
              default:'',
              type:String
            },
            brandId:{
              default:'',
              type:String
            },
            productId:{
              default:'',
              type:String
            },
            title:{
                default:'',
                type:String
            },
            dataList:{
                default: [],
                type:Array
            }
        },
        methods:{
            checkInfo(){
                let t = this;
                let androidParams = ``;
                let iosParams = ``;
                if(parseInt(t.type,10)===0){
                      androidParams = `{scene:3,type:87,sourceId:${t.productId},tplPath:0}`;
                      iosParams = `?scene=productDetailScene&productId=${t.productId}`;
                }else{
                      androidParams = `{scene:3,type:88,sourceId:${t.brandId},tplPath:0}`;
                      iosParams = `?scene=brandDetailScene&brandId=${t.brandId}`;
                }
                let callAppOptions = {
                    ios: "allinmdios://app.allinmd.cn/applinks.html"+iosParams,
                    android: "allin://com.allin.social:75235?data="+androidParams,
                    ios9: "http://app.allinmd.cn/applinks.html"+iosParams,
                    runAtOnce: false
                };
                app.newReleaseBox({
                    imgPath:"//img50.allinmd.cn/case/release.png",
                    title:"需使用唯医骨科App",
                    solidBtnTitile:"立即使用",
                    authNoneTitle:" ",
                    data:{
                        el: ".solidBtn",
                        ios:callAppOptions.ios,
                        ios9: callAppOptions.ios9,
                        android: callAppOptions.android,
                    }
                });
            }
        }
    }
</script>
<style lang="scss">
    .titleBarShouCe{
        padding-bottom: .213rem !important;
    }
</style>