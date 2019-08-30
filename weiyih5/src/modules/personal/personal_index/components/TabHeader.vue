<template>
    <nav class="al-personalNavbar" data-alcode-mod='463'>
        <a class="al-personNavbarItem" :href="cId|collection" v-show="customerRole!=14">
            <img class="showOff" src="/static/images/personal/collection_p.png" alt="">
            <figcaption>我的收藏</figcaption>
        </a>
        <a class="al-personNavbarItem"  href="javascript:;" @click="callApp({text:'我的收藏',type:15})" v-show="customerRole==14">
            <img class="showOff" src="/static/images/personal/collection_p.png" alt="">
            <figcaption>我的收藏</figcaption>
        </a>
        <a  class="al-personNavbarItem" href="javascript:;" @click="callApp({text:'我的下载',tplPath:3,type:12})">
            <img class="showOff" src="/static/images/personal/download_p.png" alt="">
            <figcaption>我的下载</figcaption>
        </a>
        <a class="al-personNavbarItem" :href="cId|browsed" v-show="customerRole!=14">
            <img class="showOff" src="/static/images/personal/look_p.png" alt="">
            <figcaption>浏览记录</figcaption>
        </a>
        <a class="al-personNavbarItem"  href="javascript:;" @click="callApp({text:'浏览记录',type:15})" v-show="customerRole==14">
            <img class="showOff" src="/static/images/personal/look_p.png" alt="">
            <figcaption>浏览记录</figcaption>
        </a>
        <a class="al-personNavbarItem" :href="cId|myFollow" v-show="customerRole!=14">
            <img class="showOff" src="/static/images/personal/Subscribe_p.png" alt="">
            <figcaption>我的订阅</figcaption>
        </a>
        <a class="al-personNavbarItem"  href="javascript:;" @click="callApp({text:'我的订阅',type:15})" v-show="customerRole==14">
            <img class="showOff" src="/static/images/personal/Subscribe_p.png" alt="">
            <figcaption>我的订阅</figcaption>
        </a>
    </nav>
</template>

<script>
    import {mapActions,mapGetters} from  "vuex";
  export default {
      data(){
          return {
              cId:localStorage.getItem('userId')
          }
      },
      methods:{
          ...mapActions(['callApp'])
      },
      computed:{
        ...mapGetters(['customerRole'])
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
  }
</script>