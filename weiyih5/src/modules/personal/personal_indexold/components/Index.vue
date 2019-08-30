<template>
    <section class="al-personalContent al-personalIndex" :class="{'al-personalNoLogin':!cId}" data-role="index" data-alcode-mod='465'>
        <section class="al-personalBrowsedPart">
            <section class="al-personalBrowsedItem">
                <a :href="cId|collection" class="icon-collect ev-collectIcon">
                    收藏的
                    <i class="al-newsNum" v-if="specialCount.collectionNum>0">{{specialCount.collectionNum<100 ? specialCount.collectionNum : '...'}}</i>
                </a>
            </section>
            <section class="al-personalBrowsedItem">
                <a :href="cId|myFollow" class="icon-follow">关注的</a>
            </section>
            <section class="al-personalBrowsedItem">
                <a :href="cId|browsed" class="icon-history">浏览记录</a>
            </section>
        </section>

        <section class="al-personalBrowsedPart">
            <section class="al-personalBrowsedItem">
                <a :href="cId|myComment" class="icon-comment">我评论的</a>
            </section>
            <section class="al-personalBrowsedItem">
                <a href="javascript:;" class="icon-draft ev-draftIcon" @click="callApp">
                    草稿
                    <i class="al-newsNum" v-if="specialCount.draftNum>0">{{specialCount.draftNum<100 ? specialCount.draftNum : '...'}}</i>
                </a>
            </section>
        </section>
        <section class="al-personalBrowsedPart">
            <section class="al-personalBrowsedItem">
                <a :href="cId|myOrder" class="icon-myOrder">我的预约</a>
            </section>
        </section>
    </section>
</template>

<script type="text/ecmascript-6">
    import {mapGetters} from  "vuex";
    import comm from 'static/js/comm.js';
    import app from 'static/js/comm.app';
    import TempCache from "static/js/tempcache.js";
    export default{
      data(){
        return {
          cId:TempCache.getItem('userId')
        }
      },
      computed:{
        ...mapGetters(['specialCount'])
      },
      methods:{
        callApp(){
          let amChannel = comm.getpara()._amChannel;
          app.newReleaseBox({
            imgPath:"//img50.allinmd.cn/case/release.png",
            title:"编辑草稿需使用唯医骨科App",
            solidBtnTitile:"立即使用",
            authNoneTitle:"暂不使用",
            data:{
              el: ".solidBtn",
              ios: "allinmdios://app.allinmd.cn/applinks.html?scene=11&type=52" + (amChannel?"&_amChannel="+amChannel:''),
              ios9: "http://app.allinmd.cn/applinks.html?scene=11&type=52" + (amChannel?"&_amChannel="+amChannel:''),
              android: "allin://com.allin.social:75235?data={scene:2,type:52" + (amChannel?",_amChannel:"+amChannel:'')+ "}",
            }
          });
        }
      },
      mounted(){

      },
      filters:{
        collection(cId){
          return cId?'./personal_collection.html':"javascript:;";
        },
        myFollow(cId){
          return cId?'./personal_myFollow.html':"javascript:;"
        },
        browsed(cId){
          return cId?'./personal_browsed.html':"javascript:;"
        },
        myComment(cId){
          return cId?"./personal_myComment.html":"javascript:;"
        },
        myOrder(cId){
          return cId?"/dist/live/livingOrder.html?from=/dist/personal/personal_index.html":"javascript:;"
        }
      },
      watch:{
        "$store.state.specialCount"() {

        },
      }
    }
</script>