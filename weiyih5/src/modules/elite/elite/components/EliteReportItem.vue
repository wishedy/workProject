<template>
    <section class="al-elite-reportItem" :class="{'no-image':checkInvalid(reportConfig.imgUrl)}" v-if="!isEmptyObject(reportConfig)" @click.stop="openDoc({
     linkUrl:reportConfig.h5Url,
     detailInfo:reportConfig
    })" @mousedown.stop="trackAction(reportConfig)">
        <section class="al-elite-reportDetail">
            <h1 class="al-elite-reportTitle" v-text="checkInvalid(reportConfig.imgUrl)?getStrLen(reportConfig.docName,66):getStrLen(reportConfig.docName,32)"></h1>
            <p class="al-elite-reportTime" v-text="formatStartTime(reportConfig.publishTime)"></p>
        </section>
        <figure class="al-elite-reportImg" :style="{background: 'url('+reportConfig.imgUrl+') no-repeat center center/cover',backgroundSize:'cover'}"></figure>
    </section>
</template>
<script>
    import EliteSdk from '../untils/eliteCommSdk';
    import comm from 'static/js/comm.js';
    export default {
        props:{
            hasImage:{
                default:false
            },
            reportConfig:{
                default(){
                    return {}
                }
            }
        },
        watch:{
            reportConfig:{
              handler(n){
                  console.log(n);
              },
              deep:true
            }
        },
        methods:{
            trackAction(data){
                let _this = this;
                let routerName = _this.$route.name;
                let config = {};
                switch (routerName) {
                    case 'home':
                        config = {
                            browseName:'菁英会主页',
                            actionName:'菁英会近期报道-单个文章',
                            keyWord:'菁英会',
                            actionId:'11670',
                            refId:data.docId
                        };
                        break;
                    case 'academic':
                        config = {
                            browseName:'学术报到-菁英会',
                            actionName:'往届文章列表-单个文章',
                            keyWord:'菁英会',
                            actionId:'11686',
                            refId:data.docId
                        };
                        break;
                }
                console.log(JSON.stringify(config));
                EliteSdk.trackAction(config);
            },
            openDoc(config){
                EliteSdk.openDoc(config);
            },
            isEmptyObject(obj){
                return comm.isEmptyObject(obj);
            },
            formatStartTime(str){
                let timeOriginal = str.split(' ');
                let date = timeOriginal[0].split("-");
                return date[1]+"/"+date[2];
            },
            checkInvalid(str){
                return comm.checkInvalid(str);
            },
            getStrLen(str,num){
                return comm.getStrLen(str,num);
            }

        }
    }
</script>