<template>
    <section class="attProductItem">
        <article class="attProductInfo" :style="{width:(checkInvalid(resourceLogoUrl))?'100%':'5.97333rem','marginRight':(checkInvalid(resourceLogoUrl))?'0':'0.42667rem'}">
            <h1 class="attProductTitle" v-text="resourceName" @click.stop="jumpTerminal"></h1>
            <section class="detailInfo">
                <p class="author" v-text="(resourceAuthor.indexOf(',')>-1)?(resourceAuthor.split(','))[0]+'等人':resourceAuthor"></p>
                <p class="browseNum" v-text="toW(browseNum)+'浏览'"></p>
            </section>

        </article>
        <figure class="attLogo" v-if="!checkInvalid(resourceLogoUrl)" @click.stop="jumpTerminal">
            <img :src="resourceLogoUrl" alt="">
            <div class="playIcon" v-if="parseInt(resourceType,10)===1"></div>
            <div class="playTime" v-text="playTime" v-if="parseInt(resourceType,10)===1"></div>
        </figure>
    </section>
</template>
<script>
    import comm from 'static/js/comm.js';
    export default {
        props:{
            browseNum:{
              default:'',
              type:String
            },
            resourceName:{
                default: '',
                type:String
            },
            playTime:{
                default:'',
                type:String
            },
            pageStoragePath:{
                default:'',
                type:String
            },
            resourceAuthor:{
                default:'',
                type:String
            },
            resourceType:{
                default:''
            },
            resourceLogoUrl:{
                default:'',
                type:String
            }
        },
        methods:{
            checkInvalid(val){
                if(((typeof val =='string')&&(val.length==0))||(val==undefined)||(val=='undefined')||(val=='null')||(typeof val=='undefined')||(typeof val=='null')||(val==null)){
                    return true;
                }else{
                    return false;
                }
            },
            cutStr(str,len){
                return comm.getStrLen(str,len);
            },
            toW(v){
                return comm.toW(v);
            },
            jumpTerminal(){
                let t = this;
                g_sps.jump(null,t.pageStoragePath);
            }
        }
    }
</script>