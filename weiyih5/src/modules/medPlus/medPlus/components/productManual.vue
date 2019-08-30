<template>
    <section class="productManual">
        <h1 class="titleBar" v-show="title.length!==0">
            <span v-text="title" ></span>
            <span class="more" v-show="more" @click.stop="checkMore">更多</span>
        </h1>
        <vue-data-loading :loading="loading" :completed="completed" :listens="['infinite-scroll']"
                          @infinite-scroll="infiniteScroll" :distance="distanceNum">
            <div slot="pull-down-ready">ready to refresh</div>
        <section class="productManualList">
            <attProductItem v-for="(item,index) in relatedContent"
                            :key="index"
                            v-if="(index+1)<=maxLen"
                            :resourceName="item.resourceName"
                            :playTime="item.playTime"
                            :browseNum="item.browseNum+''"
                            :resourceType="item.resourceType"
                            :resourceAuthor="item.resourceAuthor"
                            :pageStoragePath="item.pageStoragePath"
                            :resourceLogoUrl="item.resourceLogoUrl"></attProductItem>
        </section>
        </vue-data-loading>
        <loading v-show="loading"></loading>
    </section>
</template>
<script>
    import attProductItem from './attProductItem';
    import comm from 'static/js/comm.js';
    import VueDataLoading from 'components/scroll/vue-data-loading.vue';
    import loading from "components/Loading/Loading.vue";
    export default {
        components:{
            attProductItem,
            VueDataLoading,
            loading
        },
        data(){
          return {
              distanceNum:200
          }
        },
        props:{
            completed:{
                default:false,
                type:Boolean
            },
            loading:{
                default:false,
                type:Boolean
            },
            more:{
              default:false,
              type:Boolean
            },
            maxLen:{
              default:100000,
              type:Number
            },
            relatedContent:{
                default:[],
                type:Array
            },
            title:{
                default: '',
                type:String
            }
        },
        methods:{
            "infiniteScroll"(){
                let t = this;
                setTimeout(() => {
                    if(!t.completed){
                        t.$emit("scrollBottom");
                    }else{
                        return false;
                    }
                }, 800)
            },
            cutStr(str,len){
                return comm.getStrLen(str,len);
            },
            checkMore(){
                let t = this;
                t.$emit('checkMore');
            }
        }
    }
</script>