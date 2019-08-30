<template>
    <section class="productParameter">
        <h1 class="title">产品参数</h1>
        <h1 class="subTitle" v-show="baseParamList.length!==0">基本信息</h1>
        <article class="productParameterList" v-show="baseParamList.length!==0">
            <div class="parameterBar" v-for="(item,index) in baseParamList" :key="index" v-show="(sumIndex===0)?((index<5)?true:up):true">
                <p class="label" v-text="item.parameterName"></p>
                <div class="line"></div>
                <p class="describe" v-text="item.parameterValue"></p>
            </div>
        </article>
        <h1 class="subTitle" v-show="(sumIndex===1)?(specTypeParamList.length!==0):(specTypeParamList.length!==0)&&(up)">规格型号</h1>
        <article class="productParameterList" v-show="(sumIndex===1)?(specTypeParamList.length!==0):(specTypeParamList.length!==0)&&(up)">
            <div class="parameterBar" v-for="(item,index) in specTypeParamList" :key="index" v-show="(sumIndex===1)?((index<5)?true:up):true">
                <p class="label" v-text="item.parameterName"></p>
                <div class="line"></div>
                <p class="describe" v-text="item.parameterValue"></p>
            </div>
        </article>
        <h1 class="subTitle" v-show="(sumIndex===2)?(scopeParamList.length!==0):(scopeParamList.length!==0)&&(up)">适用范围</h1>
        <article class="productParameterList" v-show="(sumIndex===2)?(scopeParamList.length!==0):(scopeParamList.length!==0)&&(up)">
            <div class="parameterBar" v-for="(item,index) in scopeParamList" :key="index" v-show="(sumIndex===2)?((index<5)?true:up):true">
                <p class="label" v-text="item.parameterName"></p>
                <div class="line"></div>
                <p class="describe" v-text="item.parameterValue"></p>
            </div>
        </article>
        <h1 class="subTitle" v-show="(sumIndex===3)?(attentionParamList.length!==0):(attentionParamList.length!==0)&&(up)">注意事项</h1>
        <article class="productParameterList" v-show="(sumIndex===3)?(attentionParamList.length!==0):(attentionParamList.length!==0)&&(up)">
            <div class="parameterBar" v-for="(item,index) in attentionParamList" :key="index" v-show="(sumIndex===3)?((index<5)?true:up):true">
                <p class="label" v-text="item.parameterName"></p>
                <div class="line"></div>
                <p class="describe" v-text="item.parameterValue"></p>
            </div>
        </article>
        <section class="productParameterMore" v-show="sumLen">
            <span class="more" :class="{'up':up}" @click="changeUp"></span>
        </section>
    </section>
</template>
<script>
    export default {
        props: {
            attentionParamList: {
                type: Array,
                default: []
            },
            baseParamList: {
                type: Array,
                default: []
            },
            scopeParamList: {
                type: Array,
                default: []
            },
            specTypeParamList: {
                type: Array,
                default: []
            }
        },
        data(){
            return {
                up:false,
                scrollTop:0
            }
        },
        computed:{
          sumLen(){
              let t = this;
              return  (t.baseParamList.length+t.attentionParamList.length+t.scopeParamList.length+t.specTypeParamList.length)>5;
          },
            sumIndex(){
              let t = this;
              if(t.baseParamList.length>0){
                  return 0;
              }
              if(t.specTypeParamList.length>0){
                  return 1;
              }
              if(t.scopeParamList.length>0){
                  return 2;
              }
              if(t.attentionParamList.length>0){
                  return 3;
              }
            }
        },
        mounted(){
            let t = this;
            t.up = !t.sumLen;
        },
        methods:{
            changeUp(){
                let t = this;
                //console.log(t.up);
                t.up = !t.up;
                //console.log(t.up);
                t.up?t.scrollTop=$(document).scrollTop():$(document).scrollTop(t.scrollTop);
            }
        }
    }
</script>